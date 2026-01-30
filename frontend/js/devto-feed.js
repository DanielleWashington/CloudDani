/**
 * Dev.to Blog Feed Integration
 * Fetches and displays real Dev.to articles dynamically
 */

// Configuration
const DEVTO_USERNAME = 'daniellewashington'; //
const DEVTO_API = 'https://dev.to/api/articles';
const MAX_POSTS = 6;

/**
 * Fetch articles from Dev.to API
 */
async function fetchDevToArticles() {
    try {
        const response = await fetch(`${DEVTO_API}?username=${DEVTO_USERNAME}&per_page=${MAX_POSTS}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const articles = await response.json();
        return articles;
    } catch (error) {
        console.error('Error fetching Dev.to articles:', error);
        return null;
    }
}

/**
 * Calculate read time from article content
 */
function calculateReadTime(text) {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Get gradient background for post card
 */
function getGradient(index) {
    const gradients = [
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    ];
    return gradients[index % gradients.length];
}

/**
 * Get icon for post card
 */
function getIcon(index) {
    const icons = [
        'fa-rocket',
        'fa-code',
        'fa-book',
        'fa-chalkboard-teacher',
        'fa-database',
        'fa-lightbulb'
    ];
    return icons[index % icons.length];
}

/**
 * Create HTML for featured post
 */
function createFeaturedPost(article) {
    const readTime = calculateReadTime(article.description || article.body_markdown || '');
    const category = article.tag_list[0] || 'Technical Writing';
    
    return `
        <div class="featured-post">
            <div class="featured-post-image">
                ${article.cover_image 
                    ? `<img src="${article.cover_image}" alt="${article.title}">`
                    : `<div class="featured-placeholder" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <i class="fas fa-newspaper fa-4x"></i>
                       </div>`
                }
                <span class="featured-badge">Featured</span>
            </div>
            <div class="featured-post-content">
                <div class="post-meta">
                    <span class="post-category">${category}</span>
                    <span class="post-date">${formatDate(article.published_at)}</span>
                    <span class="post-read-time"><i class="far fa-clock"></i> ${readTime} min read</span>
                </div>
                <h3>${article.title}</h3>
                <p class="post-excerpt">${article.description}</p>
                <div class="post-tags">
                    ${article.tag_list.slice(0, 3).map(tag => 
                        `<span class="post-tag">${tag}</span>`
                    ).join('')}
                </div>
                <a href="${article.url}" target="_blank" class="btn btn-primary">
                    Read Full Article <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
}

/**
 * Create HTML for blog card
 */
function createBlogCard(article, index) {
    const category = article.tag_list[0] || 'Technical Writing';
    const gradient = getGradient(index);
    const icon = getIcon(index);
    
    return `
        <article class="blog-card">
            <div class="blog-card-image">
                ${article.cover_image 
                    ? `<img src="${article.cover_image}" alt="${article.title}">`
                    : `<div class="blog-placeholder" style="background: ${gradient};">
                        <i class="fas ${icon} fa-3x"></i>
                       </div>`
                }
            </div>
            <div class="blog-card-content">
                <div class="post-meta">
                    <span class="post-category">${category}</span>
                    <span class="post-date">${formatDate(article.published_at)}</span>
                </div>
                <h4>${article.title}</h4>
                <p class="post-excerpt">${article.description}</p>
                <div class="post-tags">
                    ${article.tag_list.slice(0, 3).map(tag => 
                        `<span class="post-tag">${tag}</span>`
                    ).join('')}
                </div>
                <a href="${article.url}" target="_blank" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `;
}

/**
 * Update the blog page with Dev.to content
 */
async function loadDevToPosts() {
    const articles = await fetchDevToArticles();
    
    if (!articles || articles.length === 0) {
        console.warn('No Dev.to articles found. Using placeholder content.');
        return;
    }
    
    // Update featured post (first article)
    const featuredSection = document.querySelector('.featured-post');
    if (featuredSection && articles[0]) {
        featuredSection.outerHTML = createFeaturedPost(articles[0]);
    }
    
    // Update recent posts grid (remaining articles)
    const postsGrid = document.querySelector('.posts-grid');
    if (postsGrid && articles.length > 1) {
        const recentArticles = articles.slice(1, MAX_POSTS);
        postsGrid.innerHTML = recentArticles.map((article, index) => 
            createBlogCard(article, index)
        ).join('');
    }
    
    console.log(`✅ Loaded ${articles.length} Dev.to articles`);
}

// Load posts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDevToPosts);
} else {
    loadDevToPosts();
}
