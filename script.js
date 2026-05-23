/* ==========================================================================
   PORTFOLIO CORE ACTIONS & ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MOBILE NAVIGATIONDRAWER CONTROLLER
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMobileNav() {
        document.body.classList.toggle('mobile-nav-active');
        navMenu.classList.toggle('open');
        mobileOverlay.classList.toggle('active');
    }

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', toggleMobileNav);
    }
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', toggleMobileNav);
    }

    // Close menu when clicking nav links on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMobileNav();
            }
        });
    });


    // 2. INTERACTIVE AMBIENT GLOW (SPOTLIGHT HOVER MOUSE ACTION)
    const ambientGlow = document.getElementById('ambient-glow');
    
    document.addEventListener('mousemove', (e) => {
        // Track mouse coordinates
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Dynamic radial position centered on mouse coordinates
        if (ambientGlow) {
            ambientGlow.style.background = `
                radial-gradient(circle at ${mouseX}px ${mouseY}px, 
                var(--color-primary-glow) 0%, 
                transparent 35%),
                radial-gradient(circle at 10% 20%, var(--color-primary-glow) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, var(--color-secondary-glow) 0%, transparent 40%)
            `;
        }
    });


    // 3. SUBTLE 3D CARD TILT EFFECT (MOUSE COORDINATES MAPPING)
    const tiltCards = document.querySelectorAll('.tilt-target');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse coordinate relative to the card's dimensions
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Core Center coordinates of card
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Distance from center
            const deltaX = x - centerX;
            const deltaY = y - centerY;
            
            // Calculate rotational values (tilt scale: max 6 degrees for subtle look)
            const rotateX = -(deltaY / centerY) * 6;
            const rotateY = (deltaX / centerX) * 6;
            
            // Map custom property offsets to CSS transforms
            card.style.setProperty('--rx', `${rotateX}deg`);
            card.style.setProperty('--ry', `${rotateY}deg`);
            
            // Add subtle scaling highlight reflection
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
            card.style.boxShadow = `0 15px 35px rgba(0,0,0,0.4), 0 0 25px hsla(260, 100%, 75%, 0.12)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset smooth state when cursor leaves the card bounds
            card.style.setProperty('--rx', `0deg`);
            card.style.setProperty('--ry', `0deg`);
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.boxShadow = `var(--glass-shadow)`;
        });
    });


    // 4. DYNAMIC TYPEWRITER EFFECT
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const words = JSON.parse(typewriterElement.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Delete letters
                currentText = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Add letters
                currentText = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            typewriterElement.textContent = currentText;

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && currentText === currentWord) {
                // Pause at end of completed word
                typeSpeed = 1500;
                isDeleting = true;
            } else if (isDeleting && currentText === '') {
                isDeleting = false;
                // Go to next word block
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400;
            }

            setTimeout(type, typeSpeed);
        }

        // Start typewriter
        setTimeout(type, 1000);
    }


    // 5. HIGH-PERFORMANCE INTERSECTION OBSERVER FOR SCROLL REVEALS
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after revealing to prevent repeating animation
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => revealObserver.observe(el));


    // 6. SCROLL NAVIGATION ACTIVE INDICATOR
    const sectionElements = document.querySelectorAll('section');
    const scrollObserverOptions = {
        threshold: 0.25,
        rootMargin: "-20% 0px -60% 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active classes from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding link
                const activeLink = document.getElementById(`nav-link-${id}`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, scrollObserverOptions);

    sectionElements.forEach(section => scrollObserver.observe(section));


    // 7. PROJECTS FILTER TAB INTERACTION
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active status from sibling buttons
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCat === filterValue) {
                    // Show matching cards with scaling animation
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide other elements
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

});

// 8. POLISHED CONTACT FORM HANDLING & SIMULATED SERVER DASHBOARD SUCCESS STATE
function submitContactForm() {
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;
    const submitBtn = document.getElementById('form-submit-btn');
    const successOverlay = document.getElementById('form-success-overlay');

    if (!name || !email || !subject || !message) {
        return;
    }

    // Disable submit button and trigger loading text
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin"></i>`;

    // Simulate server response timer delay
    setTimeout(() => {
        // Show success confirmation screen
        if (successOverlay) {
            successOverlay.classList.add('active');
        }
        
        // Reset submit button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Send Message <i class="fa-solid fa-paper-plane"></i>`;
    }, 1500);
}

function resetContactForm() {
    const contactForm = document.getElementById('contact-form');
    const successOverlay = document.getElementById('form-success-overlay');

    if (contactForm) {
        contactForm.reset();
    }
    
    if (successOverlay) {
        successOverlay.classList.remove('active');
    }
}
