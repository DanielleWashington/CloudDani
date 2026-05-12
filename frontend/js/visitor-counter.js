/**
 * CloudDani — Visitor Counter
 * Fetches live visitor count from Lambda and animates it into the dateline.
 */

const API_ENDPOINT = 'https://ikpwxosww6lds75pwnk3r6ozdu0thjky.lambda-url.us-east-1.on.aws/';

function initVisitorCounter() {
    const el = document.getElementById('visitor-count');
    if (!el) return;
    fetchVisitorCount(el);
}

async function fetchVisitorCount(el, attempt = 0) {
    const MAX_ATTEMPTS = 3;
    const RETRY_MS     = 1500;

    try {
        const res = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data  = await res.json();
        const count = data.count || data.visitor_count || 0;

        animateCounter(el, count);
    } catch (err) {
        console.warn(`Visitor counter attempt ${attempt + 1} failed:`, err.message);
        if (attempt < MAX_ATTEMPTS - 1) {
            setTimeout(() => fetchVisitorCount(el, attempt + 1), RETRY_MS);
        } else {
            el.textContent = '—';
        }
    }
}

function animateCounter(el, target) {
    const steps    = 50;
    const duration = 2000;
    const interval = duration / steps;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current).toLocaleString();
        }
    }, interval);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisitorCounter);
} else {
    initVisitorCounter();
}

console.log('%c♛ CloudDani — built by Danielle Washington', 'font-weight:bold; color:#D42020;');
console.log('%cCode: https://github.com/DanielleWashington | Contact: shakara.washington02@gmail.com', 'color:#3D3220;');
