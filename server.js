const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const Database = require('./database');

const PORT = 3000;
const db = new Database();

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

function serveStaticFile(res, filePath) {
    var ext = path.extname(filePath);
    var contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, function(err, data) {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

function sendJson(res, data, statusCode) {
    statusCode = statusCode || 200;
    res.writeHead(statusCode, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data));
}

function parseBody(req) {
    return new Promise(function(resolve, reject) {
        var body = '';
        req.on('data', function(chunk) {
            body += chunk;
        });
        req.on('end', function() {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
    });
}

async function handleApiRequest(req, res, pathname, method) {
    if (pathname === '/api/reviews' && method === 'GET') {
        var reviews = db.getAllReviews();
        sendJson(res, reviews);
    }
    else if (pathname === '/api/reviews' && method === 'POST') {
        var reviewData = await parseBody(req);
        var reviewId = db.addReview(reviewData);
        sendJson(res, { id: reviewId, message: 'Review added' }, 201);
    }
    else if (pathname === '/api/articles' && method === 'GET') {
        var articles = db.getAllArticles();
        sendJson(res, articles);
    }
    else if (pathname === '/api/articles' && method === 'POST') {
        var articleData = await parseBody(req);
        var articleId = db.addArticle(articleData);
        sendJson(res, { id: articleId, message: 'Article added' }, 201);
    }
    else if (pathname === '/api/events' && method === 'GET') {
        var events = db.getAllEvents();
        sendJson(res, events);
    }
    else if (pathname === '/api/events' && method === 'POST') {
        var eventData = await parseBody(req);
        var eventId = db.addEvent(eventData);
        sendJson(res, { id: eventId, message: 'Event added' }, 201);
    }
    else if (pathname === '/api/users' && method === 'POST') {
        var userData = await parseBody(req);
        var userId = db.addUser(userData);
        sendJson(res, { id: userId, message: 'User registered' }, 201);
    }
    else if (pathname === '/api/login' && method === 'POST') {
        var loginData = await parseBody(req);
        var user = db.loginUser(loginData.email, loginData.password);
        if (user) {
            sendJson(res, { success: true, user: user });
        } else {
            sendJson(res, { success: false, message: 'Invalid credentials' }, 401);
        }
    }
    else {
        sendJson(res, { error: 'Not found' }, 404);
    }
}

async function startServer() {
    await db.initialize();

    var server = http.createServer(async function(req, res) {
        var parsedUrl = url.parse(req.url, true);
        var pathname = parsedUrl.pathname;
        var method = req.method;

        if (method === 'OPTIONS') {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end();
            return;
        }

        if (pathname.startsWith('/api/')) {
            try {
                await handleApiRequest(req, res, pathname, method);
            } catch (error) {
                sendJson(res, { error: error.message }, 500);
            }
            return;
        }

        var filePath = pathname === '/' ? '/src/index.html' : pathname;
        filePath = path.join(__dirname, filePath);
        
        if (!fs.existsSync(filePath)) {
            filePath = path.join(__dirname, 'src', pathname);
        }
        
        serveStaticFile(res, filePath);
    });

    server.listen(PORT, function() {
        console.log('Server running at http://localhost:' + PORT);
    });
}

startServer();
