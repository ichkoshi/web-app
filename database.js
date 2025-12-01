const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, 'artfilm.db');
        this.db = null;
        this.SQL = null;
    }

    async initialize() {
        this.SQL = await initSqlJs();
        
        if (fs.existsSync(this.dbPath)) {
            const fileBuffer = fs.readFileSync(this.dbPath);
            this.db = new this.SQL.Database(fileBuffer);
        } else {
            this.db = new this.SQL.Database();
        }
        
        this.createTables();
        this.seedData();
        this.saveDatabase();
    }

    saveDatabase() {
        const data = this.db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(this.dbPath, buffer);
    }

    createTables() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                avatar TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        this.db.run(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                movie_title TEXT NOT NULL,
                excerpt TEXT,
                content TEXT,
                image_url TEXT,
                category TEXT,
                rating REAL,
                author_id INTEGER,
                is_featured INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (author_id) REFERENCES users(id)
            )
        `);

        this.db.run(`
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                excerpt TEXT,
                content TEXT,
                image_url TEXT,
                category TEXT,
                read_time TEXT,
                author_id INTEGER,
                is_featured INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (author_id) REFERENCES users(id)
            )
        `);

        this.db.run(`
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                image_url TEXT,
                event_date TEXT,
                event_time TEXT,
                venue TEXT,
                price TEXT,
                category TEXT,
                is_featured INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    seedData() {
        var result = this.db.exec('SELECT COUNT(*) as count FROM users');
        var userCount = result.length > 0 ? result[0].values[0][0] : 0;
        if (userCount > 0) return;

        this.db.run(`INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)`,
            ['ichkoshi', 'ichkoshi@artfilm.mn', 'password123', 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100']);
        
        this.db.run(`INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)`,
            ['boldoo', 'boldoo@artfilm.mn', 'password123', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100']);

        this.db.run(`INSERT INTO reviews (title, movie_title, excerpt, image_url, category, rating, author_id, is_featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Dune: Part Two - A Cinematic Masterpiece', 'Dune: Part Two', 
            'Denis Villeneuve has achieved something truly remarkable with "Dune: Part Two" – a sequel that not only matches its predecessor but surpasses it in virtually every conceivable way.',
            'https://images.unsplash.com/photo-1572188863110-46d457c9234d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlcnMlMjB3YWxsfGVufDF8fHx8MTc1OTY1NTcyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
            'Featured', 9.2, 1, 1, '2024-03-15']);

        this.db.run(`INSERT INTO reviews (title, movie_title, excerpt, image_url, category, rating, author_id, is_featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Oppenheimer: Nolan\'s Historical Triumph', 'Oppenheimer',
            'Christopher Nolan delivers a haunting biographical masterpiece that explores the moral complexities of scientific discovery and its devastating consequences.',
            'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2J1c3RlciUyMG1vdmllJTIwcG9zdGVyfGVufDF8fHx8MTc1OTY1NTcyNnww&ixlib=rb-4.1.0&q=80&w=1080',
            'Biography', 8.9, 1, 0, '2024-03-10']);

        this.db.run(`INSERT INTO reviews (title, movie_title, excerpt, image_url, category, rating, author_id, is_featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Old Boy (2003) - A Revenge Masterpiece', 'Old Boy',
            'Matt Reeves crafts a noir-inspired Batman film that explores the detective roots of the character.',
            'https://images.unsplash.com/photo-1548095115-45697e222a58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2luZW1hJTIwbW92aWUlMjB0aGVhdGVyfGVufDF8fHx8MTc1OTY1NTcyMXww&ixlib=rb-4.1.0&q=80&w=1080',
            'Action', 8.5, 1, 0, '2024-03-08']);

        this.db.run(`INSERT INTO reviews (title, movie_title, excerpt, image_url, category, rating, author_id, is_featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Spirited Away - Timeless Animation', 'Spirited Away',
            'Miyazaki\'s masterpiece continues to enchant audiences with its imaginative world and heartfelt storytelling.',
            'https://images.unsplash.com/photo-1572188863110-46d457c9234d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlcnMlMjB3YWxsfGVufDF8fHx8MTc1OTY1NTcyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
            'Animation', 9.3, 1, 0, '2024-03-05']);

        this.db.run(`INSERT INTO reviews (title, movie_title, excerpt, image_url, category, rating, author_id, is_featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Inception - Mind-Bending Sci-Fi', 'Inception',
            'Nolan\'s complex narrative structure creates a unique cinematic experience that rewards multiple viewings.',
            'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2J1c3RlciUyMG1vdmllJTIwcG9zdGVyfGVufDF8fHx8MTc1OTY1NTcyNnww&ixlib=rb-4.1.0&q=80&w=1080',
            'Sci-Fi', 8.8, 1, 0, '2024-03-01']);

        this.db.run(`INSERT INTO articles (title, excerpt, image_url, category, read_time, author_id, is_featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Болдоогийн санал болгох 15 кино',
            'From film to digital, explore how technology has transformed the art of visual storytelling and what it means for the future of cinema.',
            'https://images.unsplash.com/photo-1548095115-45697e222a58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2luZW1hJTIwbW92aWUlMjB0aGVhdGVyfGVufDF8fHx8MTc1OTY1NTcyMXww&ixlib=rb-4.1.0&q=80&w=1080',
            'Featured', '12 min read', 1, 1, '2024-03-20']);

        this.db.run(`INSERT INTO articles (title, excerpt, image_url, category, read_time, author_id, is_featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Шведийн кино наадам энэ сард болно',
            'A deep dive into the directorial genius behind Arrival, Blade Runner 2049, and the Dune saga, exploring his unique visual language.',
            'https://images.unsplash.com/photo-1572188863110-46d457c9234d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlcnMlMjB3YWxsfGVufDF8fHx8MTc1OTY1NTcyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
            'Directors', '15 min read', 1, 0, '2024-03-18']);

        this.db.run(`INSERT INTO events (title, description, image_url, event_date, event_time, venue, price, category, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Тэг цэг',
            'Experience Denis Villeneuve\'s epic sequel in stunning IMAX format. Join fellow sci-fi enthusiasts for an unforgettable cinematic journey.',
            'https://images.unsplash.com/photo-1572188863110-46d457c9234d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlcnMlMjB3YWxsfGVufDF8fHx8MTc1OTY1NTcyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
            'April 15, 2025', '7:30 PM', 'Urgoo Cinema IMAX', '₮25000', 'Featured', 1]);

        this.db.run(`INSERT INTO events (title, description, image_url, event_date, event_time, venue, price, category, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Баавгай болохсон',
            'Relive the terror of William Friedkin\'s masterpiece on the big screen. This classic horror experience includes pre-show discussions.',
            'https://images.unsplash.com/photo-1739891251370-05b62a54697b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2J1c3RlciUyMG1vdmllJTIwcG9zdGVyfGVufDF8fHx8MTc1OTY1NTcyNnww&ixlib=rb-4.1.0&q=80&w=1080',
            'April 15, 2025', '7:30 PM', 'Urgoo Cinema IMAX', '₮25000', 'Drama', 0]);

        this.saveDatabase();
    }

    queryToObjects(result) {
        if (!result || result.length === 0) return [];
        var columns = result[0].columns;
        var values = result[0].values;
        return values.map(function(row) {
            var obj = {};
            columns.forEach(function(col, i) {
                obj[col] = row[i];
            });
            return obj;
        });
    }

    getAllReviews() {
        var result = this.db.exec(`
            SELECT r.*, u.username as author_name, u.avatar as author_avatar
            FROM reviews r
            LEFT JOIN users u ON r.author_id = u.id
            ORDER BY r.created_at DESC
        `);
        return this.queryToObjects(result);
    }

    addReview(data) {
        this.db.run(`
            INSERT INTO reviews (title, movie_title, excerpt, content, image_url, category, rating, author_id, is_featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [data.title, data.movieTitle, data.excerpt, data.content, data.imageUrl, data.category, data.rating, data.authorId, data.isFeatured ? 1 : 0]);
        this.saveDatabase();
        var result = this.db.exec('SELECT last_insert_rowid() as id');
        return result[0].values[0][0];
    }

    getAllArticles() {
        var result = this.db.exec(`
            SELECT a.*, u.username as author_name, u.avatar as author_avatar
            FROM articles a
            LEFT JOIN users u ON a.author_id = u.id
            ORDER BY a.created_at DESC
        `);
        return this.queryToObjects(result);
    }

    addArticle(data) {
        this.db.run(`
            INSERT INTO articles (title, excerpt, content, image_url, category, read_time, author_id, is_featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [data.title, data.excerpt, data.content, data.imageUrl, data.category, data.readTime, data.authorId, data.isFeatured ? 1 : 0]);
        this.saveDatabase();
        var result = this.db.exec('SELECT last_insert_rowid() as id');
        return result[0].values[0][0];
    }

    getAllEvents() {
        var result = this.db.exec('SELECT * FROM events ORDER BY event_date DESC');
        return this.queryToObjects(result);
    }

    addEvent(data) {
        this.db.run(`
            INSERT INTO events (title, description, image_url, event_date, event_time, venue, price, category, is_featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [data.title, data.description, data.imageUrl, data.eventDate, data.eventTime, data.venue, data.price, data.category, data.isFeatured ? 1 : 0]);
        this.saveDatabase();
        var result = this.db.exec('SELECT last_insert_rowid() as id');
        return result[0].values[0][0];
    }

    addUser(data) {
        this.db.run(`INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)`,
            [data.username, data.email, data.password, data.avatar || null]);
        this.saveDatabase();
        var result = this.db.exec('SELECT last_insert_rowid() as id');
        return result[0].values[0][0];
    }

    loginUser(email, password) {
        var result = this.db.exec(`SELECT id, username, email, avatar FROM users WHERE email = ? AND password = ?`, [email, password]);
        var users = this.queryToObjects(result);
        return users.length > 0 ? users[0] : null;
    }
}

module.exports = Database;
