/**
 * Netflix-Style Intro Animation for CloudDani
 * Displays on first visit or can be shown on demand
 */

// ============================================
// Configuration
// ============================================
const INTRO_CONFIG = {
    duration: 3500,           // Total intro duration (ms)
    soundWaveCount: 3,        // Number of sound wave effects
    particleCount: 20,        // Number of floating particles
    skipDelay: 1500,          // When skip button appears (ms)
    storageKey: 'clouddani_intro_shown',
    playOnEveryVisit: false   // Set to true to always show intro
};

// ============================================
// Initialize Intro
// ============================================
function initIntro() {
    // Check if intro should be shown
    const shouldShowIntro = INTRO_CONFIG.playOnEveryVisit || 
                           !sessionStorage.getItem(INTRO_CONFIG.storageKey);
    
    if (!shouldShowIntro) {
        return; // Skip intro if already shown this session
    }
    
    // Create and inject intro HTML
    createIntroHTML();
    
    // Start intro sequence
    setTimeout(() => {
        playIntro();
    }, 100);
    
    // Mark intro as shown
    sessionStorage.setItem(INTRO_CONFIG.storageKey, 'true');
}

// ============================================
// Create Intro HTML Structure
// ============================================
function createIntroHTML() {
    const introHTML = `
        <div class="intro-screen" id="introScreen">
            <div class="sound-waves" id="soundWaves">
                ${createSoundWaves()}
            </div>
            <div class="particles" id="particles">
                ${createParticles()}
            </div>
            <div class="intro-logo">CLOUDDANI</div>
            <button class="skip-intro" id="skipIntro">
                <i class="fas fa-forward"></i> Skip
            </button>
        </div>
    `;
    
    // Insert at beginning of body
    document.body.insertAdjacentHTML('afterbegin', introHTML);
    
    // Add event listeners
    setupIntroEventListeners();
}

// ============================================
// Create Sound Wave Elements
// ============================================
function createSoundWaves() {
    let waves = '';
    for (let i = 0; i < INTRO_CONFIG.soundWaveCount; i++) {
        waves += `<div class="sound-wave"></div>`;
    }
    return waves;
}

// ============================================
// Create Particle Elements
// ============================================
function createParticles() {
    let particles = '';
    for (let i = 0; i < INTRO_CONFIG.particleCount; i++) {
        const size = Math.random() * 4 + 2; // 2-6px
        const left = Math.random() * 100;   // 0-100%
        const delay = Math.random() * 2;    // 0-2s delay
        const duration = Math.random() * 2 + 2; // 2-4s duration
        
        particles += `
            <div class="particle" style="
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                bottom: 0;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            "></div>
        `;
    }
    return particles;
}

// ============================================
// Setup Event Listeners
// ============================================
function setupIntroEventListeners() {
    const skipButton = document.getElementById('skipIntro');
    const introScreen = document.getElementById('introScreen');
    
    if (skipButton) {
        skipButton.addEventListener('click', skipIntro);
    }
    
    // Allow ESC key to skip
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && introScreen && !introScreen.classList.contains('hidden')) {
            skipIntro();
        }
    });
}

// ============================================
// Play Intro Animation
// ============================================
function playIntro() {
    const introScreen = document.getElementById('introScreen');
    
    if (!introScreen) return;
    
    // Prevent body scroll during intro
    document.body.style.overflow = 'hidden';
    
    // Auto-end intro after duration
    setTimeout(() => {
        endIntro();
    }, INTRO_CONFIG.duration);
}

// ============================================
// Skip Intro
// ============================================
function skipIntro() {
    endIntro();
}

// ============================================
// End Intro (Fade Out & Remove)
// ============================================
function endIntro() {
    const introScreen = document.getElementById('introScreen');
    
    if (!introScreen) return;
    
    // Fade out
    introScreen.classList.add('fade-out');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Remove from DOM after fade
    setTimeout(() => {
        introScreen.classList.add('hidden');
        
        // Optional: completely remove from DOM
        setTimeout(() => {
            if (introScreen.parentNode) {
                introScreen.parentNode.removeChild(introScreen);
            }
        }, 500);
    }, 500);
    
    // Trigger custom event for other scripts
    document.dispatchEvent(new CustomEvent('introComplete'));
}

// ============================================
// Public API for Manual Control
// ============================================
window.CloudDaniIntro = {
    play: () => {
        if (document.getElementById('introScreen')) {
            skipIntro(); // End current intro first
            setTimeout(() => {
                createIntroHTML();
                playIntro();
            }, 600);
        } else {
            createIntroHTML();
            playIntro();
        }
    },
    
    skip: () => {
        skipIntro();
    },
    
    reset: () => {
        sessionStorage.removeItem(INTRO_CONFIG.storageKey);
    },
    
    config: INTRO_CONFIG
};

// ============================================
// Initialize on DOM Load
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntro);
} else {
    initIntro();
}

// ============================================
// Optional: Sound Effect Simulation
// ============================================
function playIntroSound() {
    // This is a placeholder for sound
    // You can use Web Audio API to create a custom sound
    // or link to an audio file
    
    // Example with Web Audio API (creates a simple tone):
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Create a simple "whoosh" sound
        const duration = 1.5;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        console.log('Audio context not supported');
    }
}

// Uncomment to enable sound (commented out by default)
// document.addEventListener('DOMContentLoaded', () => {
//     setTimeout(playIntroSound, 100);
// });

// ============================================
// Debug Helpers (Console Commands)
// ============================================
console.log('%c🎬 CloudDani Intro System Loaded', 'font-size: 14px; font-weight: bold; color: #E50914;');
console.log('%cCommands:', 'font-size: 12px; color: #b3b3b3;');
console.log('%c  CloudDaniIntro.play()  - Play intro animation', 'font-size: 11px; color: #808080;');
console.log('%c  CloudDaniIntro.skip()  - Skip current intro', 'font-size: 11px; color: #808080;');
console.log('%c  CloudDaniIntro.reset() - Reset intro (play on next visit)', 'font-size: 11px; color: #808080;');
