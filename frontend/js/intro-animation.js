/**
 * CloudDani — Editorial Intro Animation
 * Basquiat × Mondrian aesthetic — cream, ink, yellow, red
 * Matches the actual site design (not Netflix).
 */

const INTRO_CONFIG = {
    duration: 2400,          // ms before auto-dismiss
    skipDelay: 1400,         // ms before skip button appears
    storageKey: 'clouddani_intro_shown',
    playOnEveryVisit: false
};

// ── Build intro DOM ──────────────────────────────────────────────────────────
function createIntroHTML() {
    const html = `
        <div class="intro-screen" id="introScreen" role="dialog" aria-label="CloudDani intro">
            <div class="intro-border-top"></div>
            <div class="intro-border-bottom"></div>
            <div class="intro-color-block"></div>
            <div class="intro-color-block-right"></div>

            <div class="intro-center">
                <div class="intro-prelabel">DANIELLE WASHINGTON</div>
                <div class="intro-crown">♛ ♛ ♛</div>
                <div class="intro-name">CLOUD<br>DANI</div>
                <div class="intro-subtitle">TECHNICAL STORYTELLER &nbsp;·&nbsp; NYC</div>
            </div>

            <button class="skip-intro" id="skipIntro" aria-label="Skip intro">
                Skip <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', html);
}

// ── Event wiring ─────────────────────────────────────────────────────────────
function setupListeners() {
    const skip = document.getElementById('skipIntro');
    if (skip) skip.addEventListener('click', endIntro);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') endIntro();
    });
}

// ── Play ─────────────────────────────────────────────────────────────────────
function playIntro() {
    document.body.style.overflow = 'hidden';

    // Auto-dismiss after duration
    setTimeout(endIntro, INTRO_CONFIG.duration);
}

// ── Dismiss ──────────────────────────────────────────────────────────────────
function endIntro() {
    const screen = document.getElementById('introScreen');
    if (!screen || screen.classList.contains('fade-out')) return;

    screen.classList.add('fade-out');
    document.body.style.overflow = '';

    setTimeout(() => {
        screen.classList.add('hidden');
        setTimeout(() => screen.remove(), 300);
    }, 500);

    document.dispatchEvent(new CustomEvent('introComplete'));
}

// ── Init ─────────────────────────────────────────────────────────────────────
function initIntro() {
    const alreadySeen = !INTRO_CONFIG.playOnEveryVisit &&
                        sessionStorage.getItem(INTRO_CONFIG.storageKey);
    if (alreadySeen) return;

    sessionStorage.setItem(INTRO_CONFIG.storageKey, 'true');
    createIntroHTML();
    setupListeners();
    setTimeout(playIntro, 80);
}

// ── Public API ────────────────────────────────────────────────────────────────
window.CloudDaniIntro = {
    play() {
        const existing = document.getElementById('introScreen');
        if (existing) existing.remove();
        createIntroHTML();
        setupListeners();
        playIntro();
    },
    skip: endIntro,
    reset() { sessionStorage.removeItem(INTRO_CONFIG.storageKey); }
};

// ── Boot ──────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntro);
} else {
    initIntro();
}

console.log('%c♛ CloudDani Intro loaded', 'font-weight:bold; color:#D42020;');
