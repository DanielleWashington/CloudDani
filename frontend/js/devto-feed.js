/**
 * CloudDani — Dev.to Live Feed
 * Replaces placeholder blog cards with real articles from Dev.to.
 * Generates HTML matching the editorial blog card structure in blog-styles.css.
 */

const DEVTO_USERNAME = 'daniellewashington';
const DEVTO_API      = 'https://dev.to/api/articles';
const MAX_POSTS      = 6;

// Header color classes cycle for editorial variety
const CARD_COLORS = ['blue', 'yellow', 'pink', 'red', 'ink', 'green'];

// Icon per card position
const CARD_ICONS = [
    'fa-rocket', 'fa-code', 'fa-book',
    'fa-chalkboard-teacher', 'fa-database', 'fa-lightbulb'
];

async function fetchDevToArticles() {
    const res = await fetch(`${DEVTO_API}?username=${DEVTO_USERNAME}&per_page=${MAX_POSTS}`);
    if (!res.ok) throw new Error(`Dev.to API ${res.status}`);
    return res.json();
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function readTime(text = '') {
    return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
}

function buildFeaturedPost(article) {
    const category = article.tag_list[0] || 'Technical Writing';
    const mins     = readTime(article.description || article.body_markdown || '');
    const tags     = article.tag_list.slice(0, 3)
        .map(t => `<span class="post-tag">${t}</span>`).join('');

    return `
        <div class="featured-post-header blog-card-header--ink">
            <i class="fas fa-newspaper"></i>
            <span class="featured-badge">FEATURED</span>
        </div>
        <div class="featured-post-content">
            <div class="post-meta">
                <span class="post-category">${category}</span>
                <span class="post-date">${formatDate(article.published_at)}</span>
                <span class="post-read-time"><i class="far fa-clock"></i> ${mins} min read</span>
            </div>
            <h3>${article.title}</h3>
            <p class="post-excerpt">${article.description || ''}</p>
            <div class="post-tags">${tags}</div>
            <a href="${article.url}" target="_blank" rel="noopener" class="read-more">
                Read Full Article <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
}

function buildBlogCard(article, index) {
    const category = article.tag_list[0] || 'Technical Writing';
    const color    = CARD_COLORS[index % CARD_COLORS.length];
    const icon     = CARD_ICONS[index % CARD_ICONS.length];
    const tags     = article.tag_list.slice(0, 3)
        .map(t => `<span class="post-tag">${t}</span>`).join('');

    return `
        <article class="blog-card">
            <div class="blog-card-header blog-card-header--${color}">
                <i class="fas ${icon}"></i>
            </div>
            <div class="blog-card-content">
                <div class="post-meta">
                    <span class="post-category">${category}</span>
                    <span class="post-date">${formatDate(article.published_at)}</span>
                </div>
                <h4>${article.title}</h4>
                <p class="post-excerpt">${article.description || ''}</p>
                <div class="post-tags">${tags}</div>
                <a href="${article.url}" target="_blank" rel="noopener" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `;
}

async function loadDevToPosts() {
    let articles;

    try {
        articles = await fetchDevToArticles();
    } catch (err) {
        console.warn('Dev.to feed unavailable — showing placeholder content.', err.message);
        return;
    }

    if (!articles || articles.length === 0) {
        console.warn('No Dev.to articles found for user:', DEVTO_USERNAME);
        return;
    }

    // Replace featured post inner content
    const featuredPost = document.querySelector('.featured-post');
    if (featuredPost && articles[0]) {
        featuredPost.innerHTML = buildFeaturedPost(articles[0]);
    }

    // Replace posts grid with live articles (articles 1–5)
    const postsGrid = document.querySelector('.posts-grid');
    if (postsGrid && articles.length > 1) {
        postsGrid.innerHTML = articles
            .slice(1, MAX_POSTS)
            .map((a, i) => buildBlogCard(a, i))
            .join('');
    }

    console.log(`✅ Dev.to feed: loaded ${articles.length} articles`);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDevToPosts);
} else {
    loadDevToPosts();
}
