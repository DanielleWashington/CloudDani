/**
 * CloudDani — Unified Blog Feed
 * Sources: Dev.to (live API) · Substack (RSS via rss2json) · Weaviate (static)
 */

// ═══════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════
const DEVTO_USERNAME = 'daniellewashington';
const DEVTO_API      = 'https://dev.to/api/articles';

const SUBSTACK_FEED = 'https://clouddani.substack.com/feed';
const RSS2JSON_API  = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBSTACK_FEED)}`;

const WEAVIATE_POSTS = [
    {
        title:        'From Kitchen Experiments to Five Star Service: The Weaviate Development Journey',
        url:          'https://weaviate.io/blog/day0-day1-day2-operations',
        published_at: '2025-11-06',
        description:  'A comprehensive guide to the full lifecycle of running Weaviate in production — from initial cluster setup and configuration through steady-state management and incident response.',
        tag_list:     ['Operations', 'Kubernetes', 'Production'],
        source:       'weaviate',
    },
    {
        title:        'The Art of Scaling a Vector Database like Weaviate',
        url:          'https://weaviate.io/blog/scaling-and-weaviate',
        published_at: '2025-06-18',
        description:  'How to scale a Weaviate cluster horizontally under load — covering sharding strategies, node configuration, and the operational patterns that keep latency predictable.',
        tag_list:     ['Scaling', 'Kubernetes', 'Vector DB'],
        source:       'weaviate',
    },
    {
        title:        'Latency and Weaviate: How to Diagnose and Reduce It',
        url:          'https://weaviate.io/blog/latency-and-weaviate',
        published_at: '2025-07-10',
        description:  'Latency in vector search isn\'t just a hardware problem. Your index configuration, query patterns, and data shape all play a role — here\'s how to think through each layer.',
        tag_list:     ['Performance', 'Vector DB', 'AI'],
        source:       'weaviate',
    },
];

// ═══════════════════════════════════════════════════
// STYLE MAPS
// ═══════════════════════════════════════════════════
const DEVTO_COLORS   = ['blue', 'yellow', 'pink', 'ink'];
const DEVTO_ICONS    = ['fa-rocket', 'fa-code', 'fa-book', 'fa-chalkboard-teacher', 'fa-lightbulb', 'fa-terminal'];
const WEAVIATE_ICONS = ['fa-database', 'fa-project-diagram', 'fa-search'];

const SOURCE_LABEL = { devto: 'DEV.TO', substack: 'SUBSTACK', weaviate: 'WEAVIATE' };
const SOURCE_COLOR = { devto: null /* cycles */, substack: 'red', weaviate: 'weaviate' };
const SOURCE_ICON  = { substack: 'fa-envelope-open-text' };

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
function formatDate(str) {
    const d = new Date(str);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function stripHtml(html = '') {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || '').trim();
}

function truncate(str, max = 180) {
    return str.length > max ? str.slice(0, max).trimEnd() + '…' : str;
}

function buildTags(tagList = []) {
    return tagList.slice(0, 3).map(t => `<span class="post-tag">${t}</span>`).join('');
}

// ═══════════════════════════════════════════════════
// FETCHERS
// ═══════════════════════════════════════════════════
async function fetchDevTo() {
    try {
        const res = await fetch(`${DEVTO_API}?username=${DEVTO_USERNAME}&per_page=6`);
        if (!res.ok) throw new Error(`Dev.to ${res.status}`);
        const articles = await res.json();
        return articles.map(a => ({ ...a, source: 'devto' }));
    } catch (err) {
        console.warn('Dev.to feed unavailable:', err.message);
        return [];
    }
}

async function fetchSubstack() {
    try {
        const res = await fetch(RSS2JSON_API);
        if (!res.ok) throw new Error(`rss2json ${res.status}`);
        const data = await res.json();
        if (data.status !== 'ok') throw new Error('rss2json error: ' + data.message);
        return (data.items || []).slice(0, 6).map(item => ({
            title:        item.title,
            url:          item.link,
            published_at: item.pubDate,
            description:  truncate(stripHtml(item.description)),
            tag_list:     item.categories || [],
            source:       'substack',
        }));
    } catch (err) {
        console.warn('Substack feed unavailable:', err.message);
        return [];
    }
}

// ═══════════════════════════════════════════════════
// CARD BUILDERS
// ═══════════════════════════════════════════════════
function buildCard(article, colorClass, icon) {
    const category = article.tag_list?.[0] || 'Technical Writing';
    return `
        <article class="blog-card" data-source="${article.source}">
            <div class="blog-card-header blog-card-header--${colorClass}">
                <i class="fas ${icon}"></i>
                <span class="source-badge">${SOURCE_LABEL[article.source] || ''}</span>
            </div>
            <div class="blog-card-content">
                <div class="post-meta">
                    <span class="post-category">${category}</span>
                    <span class="post-date">${formatDate(article.published_at)}</span>
                </div>
                <h4>${article.title}</h4>
                <p class="post-excerpt">${article.description || ''}</p>
                <div class="post-tags">${buildTags(article.tag_list)}</div>
                <a href="${article.url}" target="_blank" rel="noopener" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>`;
}

function buildFeatured(article) {
    const category = article.tag_list?.[0] || 'Technical Writing';
    const colorMap  = { devto: 'ink', substack: 'red', weaviate: 'weaviate' };
    const iconMap   = { devto: 'fa-newspaper', substack: 'fa-envelope-open-text', weaviate: 'fa-database' };

    return `
        <div class="featured-post-header blog-card-header--${colorMap[article.source] || 'ink'}">
            <i class="fas ${iconMap[article.source] || 'fa-newspaper'}"></i>
            <span class="featured-badge">${SOURCE_LABEL[article.source] || 'FEATURED'}</span>
        </div>
        <div class="featured-post-content">
            <div class="post-meta">
                <span class="post-category">${category}</span>
                <span class="post-date">${formatDate(article.published_at)}</span>
                <span class="post-read-time"><i class="far fa-clock"></i> 5 min read</span>
            </div>
            <h3>${article.title}</h3>
            <p class="post-excerpt">${article.description || ''}</p>
            <div class="post-tags">${buildTags(article.tag_list)}</div>
            <a href="${article.url}" target="_blank" rel="noopener" class="read-more">
                Read Full Article <i class="fas fa-arrow-right"></i>
            </a>
        </div>`;
}

// ═══════════════════════════════════════════════════
// FILTER BAR
// ═══════════════════════════════════════════════════
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const source = this.dataset.source;
            document.querySelectorAll('#postsGrid .blog-card').forEach(card => {
                const visible = !source || source === 'all' || card.dataset.source === source;
                card.style.display = visible ? '' : 'none';
            });
        });
    });
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════
async function loadUnifiedFeed() {
    const [devtoArticles, substackArticles] = await Promise.all([
        fetchDevTo(),
        fetchSubstack(),
    ]);

    // Merge all sources, sort newest-first
    const all = [
        ...devtoArticles,
        ...substackArticles,
        ...WEAVIATE_POSTS,
    ].sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

    if (all.length === 0) {
        const postsGrid = document.getElementById('postsGrid');
        if (postsGrid) postsGrid.innerHTML = '<p class="feed-empty">No posts available right now — check back soon.</p>';
        const featuredEl = document.querySelector('.featured-post');
        if (featuredEl) featuredEl.innerHTML = '<p class="feed-empty">No featured post available.</p>';
        return;
    }

    // Featured post — most recent article
    const featuredEl = document.querySelector('.featured-post');
    if (featuredEl && all[0]) {
        featuredEl.innerHTML = buildFeatured(all[0]);
    }

    // Posts grid — rest of the articles
    const postsGrid = document.getElementById('postsGrid');
    if (postsGrid && all.length > 1) {
        let devtoIdx = 0, weaviateIdx = 0;

        postsGrid.innerHTML = all.slice(1).map(article => {
            if (article.source === 'devto') {
                const color = DEVTO_COLORS[devtoIdx % DEVTO_COLORS.length];
                const icon  = DEVTO_ICONS[devtoIdx % DEVTO_ICONS.length];
                devtoIdx++;
                return buildCard(article, color, icon);
            }
            if (article.source === 'substack') {
                return buildCard(article, 'red', 'fa-envelope-open-text');
            }
            if (article.source === 'weaviate') {
                const icon = WEAVIATE_ICONS[weaviateIdx % WEAVIATE_ICONS.length];
                weaviateIdx++;
                return buildCard(article, 'weaviate', icon);
            }
            return '';
        }).join('');

        // Update article count
        const countEl = document.querySelector('.posts-section .section-count');
        if (countEl) countEl.textContent = `${all.length} DISPATCHES`;
    }

    initFilters();
    console.log(
        `✅ Unified feed loaded — Dev.to: ${devtoArticles.length} · Substack: ${substackArticles.length} · Weaviate: ${WEAVIATE_POSTS.length}`
    );
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUnifiedFeed);
} else {
    loadUnifiedFeed();
}
