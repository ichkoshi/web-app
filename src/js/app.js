var apiBaseUrl = 'http://localhost:3000/api';

var currentView = 'home';

var reviewsData = [];
var articlesData = [];
var eventsData = [];

function initializeApp() {
    bindNavigationEvents();
    bindModalEvents();
    loadAllData();
    navigateToView('home');
}

function bindNavigationEvents() {
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            var targetPage = this.getAttribute('data-page');
            navigateToView(targetPage);
        });
    });

    var logoLink = document.querySelector('.site-logo');
    logoLink.addEventListener('click', function(event) {
        event.preventDefault();
        navigateToView('home');
    });
}

function bindModalEvents() {
    var loginButton = document.getElementById('loginButton');
    var authModal = document.getElementById('authModal');
    var loginForm = document.getElementById('loginForm');

    loginButton.addEventListener('click', function() {
        showAuthModal();
    });

    authModal.addEventListener('click', function(event) {
        if (event.target === authModal) {
            hideAuthModal();
        }
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleLogin();
    });
}

function navigateToView(viewName) {
    currentView = viewName;

    var allViews = document.querySelectorAll('.view-wrapper');
    allViews.forEach(function(view) {
        view.classList.remove('active-view');
    });

    var viewMap = {
        'home': 'homeView',
        'articles': 'articlesView',
        'movie-night': 'movieNightView'
    };

    var targetViewId = viewMap[viewName];
    var targetView = document.getElementById(targetViewId);
    if (targetView) {
        targetView.classList.add('active-view');
        targetView.classList.add('fade-enter');
    }

    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        item.classList.remove('current');
        if (item.getAttribute('data-page') === viewName) {
            item.classList.add('current');
        }
    });
}

function loadAllData() {
    fetchReviews();
    fetchArticles();
    fetchEvents();
}

function fetchReviews() {
    makeRequest(apiBaseUrl + '/reviews', 'GET', null, function(data) {
        reviewsData = data;
        renderFeaturedReviews();
        renderAllReviews();
    });
}

function fetchArticles() {
    makeRequest(apiBaseUrl + '/articles', 'GET', null, function(data) {
        articlesData = data;
        renderArticles();
    });
}

function fetchEvents() {
    makeRequest(apiBaseUrl + '/events', 'GET', null, function(data) {
        eventsData = data;
        renderEvents();
    });
}

function makeRequest(url, method, body, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                var responseData = JSON.parse(xhr.responseText);
                onSuccess(responseData);
            }
        }
    };

    if (body) {
        xhr.send(JSON.stringify(body));
    } else {
        xhr.send();
    }
}

function renderFeaturedReviews() {
    var container = document.getElementById('featuredReviewsContainer');
    var featuredItems = reviewsData.filter(function(review) {
        return review.is_featured === 1;
    });

    if (featuredItems.length === 0) {
        featuredItems = reviewsData.slice(0, 2);
    }

    var htmlContent = '';
    featuredItems.forEach(function(review) {
        htmlContent += createReviewCardHtml(review, true);
    });

    container.innerHTML = htmlContent;
}

function renderAllReviews() {
    var container = document.getElementById('allReviewsContainer');
    var regularReviews = reviewsData.filter(function(review) {
        return review.is_featured !== 1;
    });

    var htmlContent = '';
    regularReviews.forEach(function(review) {
        htmlContent += createReviewCardHtml(review, false);
    });

    container.innerHTML = htmlContent;
}

function renderArticles() {
    var container = document.getElementById('articlesContainer');
    var htmlContent = '';

    articlesData.forEach(function(article) {
        htmlContent += createArticleCardHtml(article);
    });

    container.innerHTML = htmlContent;
}

function renderEvents() {
    var container = document.getElementById('eventsContainer');
    var htmlContent = '';

    eventsData.forEach(function(event) {
        htmlContent += createEventCardHtml(event);
    });

    container.innerHTML = htmlContent;
}

function createReviewCardHtml(review, isFeatured) {
    var badgeClass = isFeatured ? 'card-badge card-badge-highlight' : 'card-badge';
    var categoryText = review.category || 'Review';
    var authorName = review.author_name || 'Unknown';
    var authorAvatar = review.author_avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100';
    var rating = review.rating || 0;
    var createdDate = formatDate(review.created_at);

    var starSvg = '<svg class="star-icon" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';

    var cardHtml = '<article class="review-card">';
    cardHtml += '<img src="' + review.image_url + '" alt="' + review.title + '" class="card-thumbnail">';
    cardHtml += '<div class="card-body">';
    cardHtml += '<span class="' + badgeClass + '">' + categoryText + '</span>';
    cardHtml += '<h3 class="card-heading">' + review.title + '</h3>';
    cardHtml += '<p class="card-summary">' + review.excerpt + '</p>';
    cardHtml += '<div class="card-footer">';
    cardHtml += '<div class="author-block">';
    cardHtml += '<img src="' + authorAvatar + '" alt="' + authorName + '" class="author-photo">';
    cardHtml += '<span>' + authorName + '</span>';
    cardHtml += '</div>';
    cardHtml += '<div class="star-rating">' + starSvg + '<span>' + rating + '</span></div>';
    cardHtml += '<span>' + createdDate + '</span>';
    cardHtml += '</div>';
    cardHtml += '</div>';
    cardHtml += '</article>';

    return cardHtml;
}

function createArticleCardHtml(article) {
    var isFeatured = article.is_featured === 1;
    var badgeClass = isFeatured ? 'card-badge card-badge-highlight' : 'card-badge';
    var categoryText = isFeatured ? 'Featured' : (article.category || 'Article');
    var authorName = article.author_name || 'Unknown';
    var authorAvatar = article.author_avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100';
    var readTime = article.read_time || '5 min read';
    var createdDate = formatDate(article.created_at);

    var cardHtml = '<article class="review-card">';
    cardHtml += '<img src="' + article.image_url + '" alt="' + article.title + '" class="card-thumbnail">';
    cardHtml += '<div class="card-body">';
    cardHtml += '<span class="' + badgeClass + '">' + categoryText + '</span>';
    cardHtml += '<h3 class="card-heading">' + article.title + '</h3>';
    cardHtml += '<p class="card-summary">' + article.excerpt + '</p>';
    cardHtml += '<div class="card-footer">';
    cardHtml += '<div class="author-block">';
    cardHtml += '<img src="' + authorAvatar + '" alt="' + authorName + '" class="author-photo">';
    cardHtml += '<span>' + authorName + '</span>';
    cardHtml += '</div>';
    cardHtml += '<span>' + readTime + '</span>';
    cardHtml += '<span>' + createdDate + '</span>';
    cardHtml += '</div>';
    cardHtml += '</div>';
    cardHtml += '</article>';

    return cardHtml;
}

function createEventCardHtml(event) {
    var isFeatured = event.is_featured === 1;
    var badgeClass = isFeatured ? 'card-badge card-badge-highlight' : 'card-badge';
    var categoryText = isFeatured ? 'Featured' : (event.category || 'Event');

    var cardHtml = '<article class="review-card">';
    cardHtml += '<img src="' + event.image_url + '" alt="' + event.title + '" class="card-thumbnail">';
    cardHtml += '<div class="card-body">';
    cardHtml += '<span class="' + badgeClass + '">' + categoryText + '</span>';
    cardHtml += '<h3 class="card-heading">' + event.title + '</h3>';
    cardHtml += '<p class="card-summary">' + event.description + '</p>';
    cardHtml += '<div class="event-details">';
    cardHtml += '<span>' + event.event_date + ' • ' + event.event_time + '</span>';
    cardHtml += '<span>' + event.venue + '</span>';
    cardHtml += '<span>' + event.price + '</span>';
    cardHtml += '</div>';
    cardHtml += '<button class="button button-primary space-top-lg">Бүртгүүлэх</button>';
    cardHtml += '</div>';
    cardHtml += '</article>';

    return cardHtml;
}

function formatDate(dateString) {
    if (!dateString) return '';
    var date = new Date(dateString);
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

function showAuthModal() {
    var modal = document.getElementById('authModal');
    modal.classList.add('shown');
}

function hideAuthModal() {
    var modal = document.getElementById('authModal');
    modal.classList.remove('shown');
}

function handleLogin() {
    var emailInput = document.getElementById('emailInput');
    var passwordInput = document.getElementById('passwordInput');
    var email = emailInput.value;
    var password = passwordInput.value;

    var loginData = {
        email: email,
        password: password
    };

    makeRequest(apiBaseUrl + '/login', 'POST', loginData, function(response) {
        if (response.success) {
            hideAuthModal();
            alert('Welcome, ' + response.user.username + '!');
        } else {
            alert('Login failed. Please check your credentials.');
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);

