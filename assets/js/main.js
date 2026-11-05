/* ========================================
   MAIN.JS - Interactividad vanilla
   Sin dependencias, ES6 modules ready
   ======================================== */

(() => {
  'use strict';

  /* ---------- UTILITIES ---------- */
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };
  };

  const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  /* ---------- THEME TOGGLE ---------- */
  const initTheme = () => {
    const themeToggle = $('.nav__theme-toggle');
    const html = document.documentElement;

    // Get saved theme or detect system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    html.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
      });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        updateThemeIcon(newTheme);
      }
    });
  };

  const updateThemeIcon = (theme) => {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
  };

  /* ---------- MOBILE MENU ---------- */
  const initMobileMenu = () => {
    const navToggle = $('.nav__toggle');
    const navMenu = $('.nav__menu');
    const navLinks = $$('.nav__link');

    if (!navToggle || !navMenu) return;

    const closeMenu = () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    const toggleMenu = () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('is-open') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        closeMenu();
      }
    });
  };

  /* ---------- HEADER SCROLL EFFECT ---------- */
  const initHeaderScroll = () => {
    const header = $('.header');
    if (!header) return;

    const handleScroll = throttle(() => {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }, 50);

    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  /* ---------- SMOOTH SCROLL OFFSET FOR FIXED HEADER ---------- */
  const initSmoothScroll = () => {
    const header = $('.header');
    const headerHeight = header ? header.offsetHeight : 0;

    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = $(targetId);
        if (target) {
          e.preventDefault();
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const initActiveNavLink = () => {
    const header = $('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const sections = $$('section[id]');
    const navLinks = $$('.nav__link');
    const navLinkMap = {};

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        navLinkMap[href.slice(1)] = link;
      }
    });

    const setActiveLink = throttle(() => {
      let current = '';
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => link.classList.remove('nav__link--active'));
      if (current && navLinkMap[current]) {
        navLinkMap[current].classList.add('nav__link--active');
      }
    }, 50);

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();
  };

  /* ---------- INTERSECTION OBSERVER FOR ANIMATIONS ---------- */
  const initScrollAnimations = () => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    $$('.reveal, .section__header, .project-card, .skill-category, .highlight, .about__text, .contact__form-wrapper, .contact__info, .timeline__item, .learning__card, .stat').forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  };

  /* ---------- HERO TYPING EFFECT ---------- */
  const initTypingEffect = () => {
    const typingElement = $('.hero__role .typing-text');
    if (!typingElement) return;

    const roles = [
      'Estudiante de Ingeniería en Ciencia de Datos e IA',
      'Desarrollador de modelos predictivos',
      'Creador de dashboards interactivos',
      'Amante de Python y datos limpios',
      'Buscando práctica pre-profesional'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    const type = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingElement.classList.add('typing-done');
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        typingElement.classList.remove('typing-done');
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before next
      }

      setTimeout(type, typingSpeed);
    };

    // Start after a small delay
    setTimeout(type, 1000);
  };

  /* ---------- COUNTER ANIMATION ---------- */
  const initCounters = () => {
    const counters = $$('.stat__number[data-target]');

    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  };

  const animateCounter = (element) => {
    const target = parseInt(element.dataset.target, 10);
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * eased);
      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCounter);
  };

  /* ---------- PROJECT FILTERS ---------- */
  const initProjectFilters = () => {
    const filterBtns = $$('.filter-btn');
    const projectCards = $$('.project-card[data-category]');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
        btn.classList.add('filter-btn--active');

        // Filter cards with animation
        projectCards.forEach((card, index) => {
          const category = card.dataset.category;
          const shouldShow = filter === 'all' || category === filter;

          if (shouldShow) {
            card.style.display = '';
            card.style.animation = `fadeInUp 0.4s ease forwards ${index * 50}ms`;
            card.style.opacity = '0';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
            });
          } else {
            card.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    // Add fadeOut animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
  };

  /* ---------- SKILL BARS ANIMATION ---------- */
  const initSkillBars = () => {
    const skillBars = $$('.skill-item__bar');

    if (!skillBars.length) return;

    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.getPropertyValue('--width') || bar.dataset.width || '0%';
          bar.style.setProperty('--width', width);
          bar.style.width = width;
          skillObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
  };

  /* ---------- LEARNING PROGRESS BARS ---------- */
  const initLearningProgress = () => {
    const progressBars = $$('.learning__progress-fill');

    if (!progressBars.length) return;

    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width || '0%';
          bar.style.width = width;
          progressObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => progressObserver.observe(bar));
  };

  /* ---------- FORM HANDLING ---------- */
  const initContactForm = () => {
    const contactForm = $('.contact__form');
    if (!contactForm) return;

    const submitBtn = contactForm.querySelector('.form__submit');
    const statusEl = contactForm.querySelector('.form__status');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Fallback: si Formspree todavía no está configurado, abrir el cliente de correo.
      if (contactForm.action.includes('your-form-id')) {
        const data = new FormData(contactForm);
        const subject = encodeURIComponent(data.get('asunto') || 'Contacto desde el portafolio');
        const body = encodeURIComponent(
          `Nombre: ${data.get('nombre') || ''}\nEmail: ${data.get('email') || ''}\n\n${data.get('mensaje') || ''}`
        );
        window.location.href = `mailto:robinsonjsm281006@gmail.com?subject=${subject}&body=${body}`;
        return;
      }

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      // Hide previous status
      if (statusEl) {
        statusEl.className = 'form__status';
        statusEl.textContent = '';
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          submitBtn.textContent = '¡Enviado!';
          submitBtn.style.background = 'var(--gradient-secondary)';
          if (statusEl) {
            statusEl.className = 'form__status form__status--success';
            statusEl.textContent = '¡Mensaje enviado correctamente! Te responderé pronto.';
          }
          contactForm.reset();
        } else {
          throw new Error('Error al enviar');
        }
      } catch (error) {
        submitBtn.textContent = 'Error, intenta de nuevo';
        submitBtn.style.background = 'var(--color-error)';
        if (statusEl) {
          statusEl.className = 'form__status form__status--error';
          statusEl.textContent = 'Hubo un error. Intenta de nuevo o escríbeme directo por email.';
        }
      }

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
      }, 3000);
    });
  };

  /* ---------- BACK TO TOP BUTTON ---------- */
  const initBackToTop = () => {
    const backToTop = $('.back-to-top');
    if (!backToTop) return;

    const toggleVisibility = throttle(() => {
      if (window.scrollY > 300) {
        backToTop.classList.add('back-to-top--visible');
      } else {
        backToTop.classList.remove('back-to-top--visible');
      }
    }, 100);

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /* ---------- PARALLAX EFFECT (Subtle) ---------- */
  const initParallax = () => {
    const hero = $('.hero');
    if (!hero) return;

    const handleScroll = throttle(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      hero.style.backgroundPositionY = `${rate}px`;
    }, 16);

    // Only enable on desktop and if not reduced motion
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  };

  /* ---------- LAZY LOAD IMAGES (fallback) ---------- */
  const initLazyLoad = () => {
    if ('loading' in HTMLImageElement.prototype) return;

    const lazyImages = $$('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.removeAttribute('loading');
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  };

  /* ---------- INITIALIZE ALL ---------- */
  const init = () => {
    initTheme();
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initActiveNavLink();
    initScrollAnimations();
    initTypingEffect();
    initCounters();
    initProjectFilters();
    initSkillBars();
    initLearningProgress();
    initContactForm();
    initBackToTop();
    initParallax();
    initLazyLoad();
  };

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();