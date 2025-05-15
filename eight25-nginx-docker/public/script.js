/**
 * Utility function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} A debounced version of the function
 */
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

/**
 * Initialize all functionality when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        initLogoAnimations();
        initScrollAnimations();
        initSmoothScrolling();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

/**
 * Initialize smooth scrolling behavior for anchor links
 * Handles clicking on navigation links to scroll smoothly to sections
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize animations for the floating logos in the hero section
 * Handles both initial fade-in and continuous floating animations
 */
function initLogoAnimations() {
    const logos = document.querySelectorAll('.logo');
    if (!logos.length) return;

    // Animate each logo with a staggered delay
    logos.forEach((logo, index) => {
        // Initial fade in animation
        setTimeout(() => {
            requestAnimationFrame(() => {
                logo.style.opacity = '1';
                logo.style.transform = 'translateY(0)';
            });
        }, 300 * index);
        
        // Start continuous floating animation
        setInterval(() => floatAnimation(logo), 3000 + (index * 500));
    });

    // Animate hero content after logos
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            requestAnimationFrame(() => {
                heroContent.classList.add('active');
            });
        }, 500);
    }
}

/**
 * Create floating animation effect for individual logo elements
 * Applies random movement within a defined range
 * @param {HTMLElement} element - The logo element to animate
 */
function floatAnimation(element) {
    if (!element) return;

    // Calculate random movement values
    const xMove = (Math.random() - 0.5) * 20; // Random X movement
    const yMove = (Math.random() - 0.5) * 20; // Random Y movement
    
    // Apply the floating animation
    requestAnimationFrame(() => {
        element.style.transition = 'transform 3s ease-in-out';
        element.style.transform = `translate(${xMove}px, ${yMove}px)`;
        
        // Reset position after animation
        setTimeout(() => {
            requestAnimationFrame(() => {
                element.style.transform = 'translate(0, 0)';
            });
        }, 3000);
    });
}

/**
 * Initialize scroll-based animations for elements
 * Sets up intersection observers for fade and slide effects
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    if (!animatedElements.length) return;

    // Check elements initially
    checkElementsInViewport(animatedElements);
    
    // Set up scroll listener with performance optimization
    const debouncedScroll = debounce(() => {
        checkElementsInViewport(animatedElements);
    }, 16); // ~60fps for smooth animation

    window.addEventListener('scroll', debouncedScroll, { passive: true });
}

/**
 * Check if elements are in viewport and trigger their animations
 * @param {NodeList} elements - Collection of elements to check
 */
function checkElementsInViewport(elements) {
    const windowHeight = window.innerHeight;
    const triggerPoint = 0.85; // Trigger animation when element is 85% in view

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect();
        if (elementPosition.top < windowHeight * triggerPoint) {
            requestAnimationFrame(() => {
                element.classList.add('active');
            });
        }
    });
}

/**
 * Handle parallax scrolling effects for sections
 * Creates smooth parallax movement for background elements
 */
const handleParallax = debounce(() => {
    const scrollPosition = window.pageYOffset;
    
    // Handle AI Section parallax
    const aiSection = document.getElementById('ai-section');
    const gridBackground = document.querySelector('.grid-background');
    
    if (aiSection && gridBackground) {
        const aiSectionTop = aiSection.offsetTop;
        const aiSectionHeight = aiSection.offsetHeight;
        
        if (scrollPosition > aiSectionTop - window.innerHeight && 
            scrollPosition < aiSectionTop + aiSectionHeight) {
            requestAnimationFrame(() => {
                const parallaxValue = (scrollPosition - (aiSectionTop - window.innerHeight)) * 0.1;
                gridBackground.style.transform = `translateY(${parallaxValue}px)`;
            });
        }
    }
    
    // Handle Testimonial Section parallax
    const testimonialSection = document.getElementById('testimonial-section');
    if (testimonialSection) {
        const testimonialSectionTop = testimonialSection.offsetTop;
        const testimonialSectionHeight = testimonialSection.offsetHeight;
        
        if (scrollPosition > testimonialSectionTop - window.innerHeight && 
            scrollPosition < testimonialSectionTop + testimonialSectionHeight) {
            requestAnimationFrame(() => {
                const parallaxValue = (scrollPosition - (testimonialSectionTop - window.innerHeight)) * 0.05;
                testimonialSection.style.backgroundPosition = `center ${-parallaxValue}px`;
            });
        }
    }
}, 16);

// Add scroll listener for parallax effects
window.addEventListener('scroll', handleParallax, { passive: true });