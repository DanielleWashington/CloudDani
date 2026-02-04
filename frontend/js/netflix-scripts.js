/**
 * Netflix-Styled Portfolio - Cloud Dani
 * Interactive Features & Animations
 */

// ============================================
// Initialize on DOM Load
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initScrollAnimations();
    initProjectSliders();
    initVisitorCounter();
    initMobileMenu();
    initSmoothScroll();
});

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add scroll effect to navbar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease ${index * 0.05}s`;
        observer.observe(card);
    });
}

// ============================================
// Project Sliders - Horizontal Scroll
// ============================================
function initProjectSliders() {
    const sliders = document.querySelectorAll('.projects-slider');
    
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        // Mouse drag to scroll
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchScrollLeft = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].pageX - slider.offsetLeft;
            touchScrollLeft = slider.scrollLeft;
        });
        
        slider.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - slider.offsetLeft;
            const walk = (x - touchStartX) * 2;
            slider.scrollLeft = touchScrollLeft - walk;
        });
        
        // Add scroll arrows on hover for desktop
        addScrollArrows(slider);
    });
}

function addScrollArrows(slider) {
    // Create left arrow
    const leftArrow = document.createElement('button');
    leftArrow.className = 'slider-arrow slider-arrow-left';
    leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    leftArrow.style.cssText = `
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.8);
        border: none;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.3s;
        display: none;
    `;
    
    // Create right arrow
    const rightArrow = document.createElement('button');
    rightArrow.className = 'slider-arrow slider-arrow-right';
    rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    rightArrow.style.cssText = `
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.8);
        border: none;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.3s;
        display: none;
    `;
    
    // Add arrows to slider parent
    const sliderContainer = slider.parentElement;
    sliderContainer.style.position = 'relative';
    sliderContainer.appendChild(leftArrow);
    sliderContainer.appendChild(rightArrow);
    
    // Show arrows on hover (desktop only)
    if (window.innerWidth > 768) {
        sliderContainer.addEventListener('mouseenter', () => {
            leftArrow.style.display = 'block';
            rightArrow.style.display = 'block';
            setTimeout(() => {
                leftArrow.style.opacity = '1';
                rightArrow.style.opacity = '1';
            }, 10);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            leftArrow.style.opacity = '0';
            rightArrow.style.opacity = '0';
            setTimeout(() => {
                leftArrow.style.display = 'none';
                rightArrow.style.display = 'none';
            }, 300);
        });
    }
    
    // Arrow click handlers
    leftArrow.addEventListener('click', () => {
        slider.scrollBy({
            left: -400,
            behavior: 'smooth'
        });
    });
    
    rightArrow.addEventListener('click', () => {
        slider.scrollBy({
            left: 400,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Visitor Counter
// ============================================
function initVisitorCounter() {
    const counterElement = document.getElementById('visitorCount');
    
    // API endpoint - update this with your actual Lambda endpoint
    const API_ENDPOINT = 'https://ikpwxosww6lds75pwnk3r6ozdu0thjky.lambda-url.us-east-1.on.aws/';
    
    // Try to fetch visitor count from API
    fetchVisitorCount(API_ENDPOINT, counterElement);
}

async function fetchVisitorCount(endpoint, element) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        const count = data.count || data.visitor_count || 0;
        
        console.log('Visitor count fetched successfully:', count);
        animateCounter(element, count);
    } catch (error) {
        console.error('Error fetching visitor count:', error);
        element.textContent = 'Error loading count';
    }
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, stepTime);
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle) return;
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-active');
        
        // Toggle icon
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('mobile-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('mobile-active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // Mobile menu styles
    if (window.innerWidth <= 768) {
        navMenu.style.cssText = `
            position: fixed;
            top: 0;
            right: -100%;
            width: 70%;
            height: 100vh;
            background: rgba(20, 20, 20, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            transition: right 0.3s ease;
            z-index: 999;
        `;
        
        // Add styles for active state
        const style = document.createElement('style');
        style.textContent = `
            .nav-menu.mobile-active {
                right: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty anchors
            if (href === '#' || href === '#0') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Account for navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Project Card Click Handler
// ============================================
document.addEventListener('click', function(e) {
    const projectCard = e.target.closest('.project-card');
    
    if (projectCard) {
        const link = projectCard.querySelector('.project-link');
        if (link && !e.target.closest('.project-link')) {
            // Optional: Add modal or expand card functionality here
            console.log('Project card clicked:', projectCard.querySelector('h4').textContent);
        }
    }
});

// ============================================
// Parallax Effect for Hero Background
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ============================================
// Performance: Debounce Scroll Events
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers if needed
const debouncedScroll = debounce(() => {
    // Additional scroll handlers can go here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ============================================
// Console Easter Egg
// ============================================
console.log('%c👋 Hey there!', 'font-size: 20px; font-weight: bold; color: #E50914;');
console.log('%cLooking under the hood? I like your style!', 'font-size: 14px; color: #b3b3b3;');
console.log('%cCheck out the code on GitHub: https://github.com/DanielleWashington/cloudresumechallenge', 'font-size: 12px; color: #808080;');
console.log('%cLet\'s connect: shakara.washington02@gmail.com', 'font-size: 12px; color: #E50914;');
