/* ============================================
   Mohamed M — Portfolio Website
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========================= ELEMENTS =========================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const backToTopBtn = document.getElementById('back-to-top');
    const currentYearEl = document.getElementById('current-year');

    // ========================= DYNAMIC YEAR =========================
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // ========================= MOBILE NAVIGATION =========================
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    // ========================= NAVBAR SCROLL EFFECT =========================
    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ========================= ACTIVE NAV LINK ON SCROLL =========================
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveNav() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ========================= BACK TO TOP =========================
    function handleBackToTop() {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========================= SCROLL EVENT (combined) =========================
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleNavScroll();
                highlightActiveNav();
                handleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Run on load
    handleNavScroll();
    highlightActiveNav();

    // ========================= SCROLL REVEAL (IntersectionObserver) =========================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================= PROJECT FILTERING =========================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                } else {
                    card.classList.remove('show');
                    card.classList.add('hide');
                }
            });
        });
    });

    // ========================= CONTACT FORM VALIDATION =========================
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        let isValid = true;

        // Name validation
        if (name.value.trim() === '') {
            showError('name', 'Please enter your name');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            showError('email', 'Please enter your email');
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Subject validation
        if (subject.value.trim() === '') {
            showError('subject', 'Please enter a subject');
            isValid = false;
        }

        // Message validation
        if (message.value.trim() === '') {
            showError('message', 'Please enter a message');
            isValid = false;
        } else if (message.value.trim().length < 20) {
            showError('message', 'Message must be at least 20 characters');
            isValid = false;
        }

        if (isValid) {
            // Simulate form submission (frontend only)
            showFormStatus('success', '✓ Message sent successfully! Thank you for reaching out. I\'ll get back to you soon.');
            contactForm.reset();

            // Auto-hide after 5s
            setTimeout(() => {
                formStatus.className = 'form-status';
                formStatus.style.display = 'none';
            }, 5000);
        } else {
            showFormStatus('error', 'Please fix the errors above before submitting.');
        }
    });

    function showError(fieldId, message) {
        const errorEl = document.getElementById(fieldId + '-error');
        const inputEl = document.getElementById(fieldId);
        if (errorEl) errorEl.textContent = message;
        if (inputEl) inputEl.classList.add('input-error');
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';
    }

    function showFormStatus(type, message) {
        formStatus.className = 'form-status ' + type;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
    }

    // ========================= SMOOTH SCROLL FOR ANCHOR LINKS =========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
