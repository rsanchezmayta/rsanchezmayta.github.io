/**
 * Robinson J. Sánchez Mayta — CV/Portfolio
 * Main JavaScript: interactions, animations, form handling, project filtering
 * Principles: Accessible, performant, respects reduced-motion
 */

(() => {
  'use strict';

  // ========================================
  // DOM Elements
  // ========================================
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const navLinkElements = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const counters = document.querySelectorAll('[data-count]');
  const skillFills = document.querySelectorAll('.skill-fill');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const yearEl = document.getElementById('year');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // ========================================
  // Reduced Motion Preference
  // ========================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================
  // Year in footer
  // ========================================
  yearEl.textContent = new Date().getFullYear();

  // ========================================
  // Mobile Menu - Accessible
  // ========================================
  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    // Focus management
    if (isOpen) {
      const firstLink = navLinks.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    }
  });

  navLinkElements.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      menuBtn.focus(); // Return focus to menu button
    });
  });

  // Close menu on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      menuBtn.focus();
    }
  });

  // ========================================
  // Navbar Scroll Effect
  // ========================================
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ========================================
  // Active Nav Link on Scroll
  // ========================================
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkElements.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  // ========================================
  // Reveal Animations - Staggered
  // ========================================
  const revealElements = document.querySelectorAll(
    '.section, .hero, .about-pillars > *, .about-bottom, .timeline-item, .project-card, .skill-category, .contact-card, .contact-form'
  );

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger delay - max 300ms
    el.style.transitionDelay = `${Math.min(i * 40, 300)}ms`;
    revealObserver.observe(el);
  });

  // ========================================
  // Animated Counters
  // ========================================
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = prefersReducedMotion ? 0 : 1600;
    const startTime = performance.now();
    const easing = t => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easing(progress);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    if (prefersReducedMotion) {
      el.textContent = target;
    } else {
      requestAnimationFrame(tick);
    }
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });

  counters.forEach(el => counterObserver.observe(el));

  // ========================================
  // Skill Bars Animation
  // ========================================
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const pct = fill.style.getPropertyValue('--pct') || '0%';
        if (!prefersReducedMotion) {
          fill.style.width = pct;
        } else {
          fill.style.width = pct;
          fill.style.transition = 'none';
        }
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

  skillFills.forEach(el => skillObserver.observe(el));

  // ========================================
  // Tech Carousel (inside terminal) - 16 items, 2s each
  // ========================================
  const initTechCarousel = () => {
    const carousel = document.getElementById('techCarousel');
    if (!carousel) return;

    const items = carousel.querySelectorAll('.tech-item');
    const pagination = carousel.querySelector('.tech-pagination');
    if (items.length === 0) return;

    // Generate pagination dots dynamically
    items.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'tech-page' + (i === 0 ? ' active' : '');
      btn.dataset.index = i;
      btn.setAttribute('aria-label', `Tecnología ${i + 1} de ${items.length}`);
      btn.setAttribute('aria-selected', i === 0);
      pagination.appendChild(btn);
    });
    pagination.hidden = false;

    const pages = pagination.querySelectorAll('.tech-page');
    let currentIndex = 0;
    let carouselInterval = null;

    const showItem = (index) => {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
        item.hidden = i !== index;
      });
      pages.forEach((page, i) => {
        page.classList.toggle('active', i === index);
        page.setAttribute('aria-selected', i === index);
      });
      currentIndex = index;
    };

    const nextItem = () => {
      const next = (currentIndex + 1) % items.length;
      showItem(next);
    };

    const startCarousel = () => {
      if (prefersReducedMotion) return;
      carouselInterval = setInterval(nextItem, 2000); // 2 seconds per tech
    };

    const stopCarousel = () => {
      if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
      }
    };

    // Pagination click handlers
    pages.forEach((page, i) => {
      page.addEventListener('click', () => {
        showItem(i);
        stopCarousel();
        startCarousel();
      });
      page.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          page.click();
        }
      });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      stopCarousel();
    });

    carousel.addEventListener('mouseleave', () => {
      startCarousel();
    });

    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopCarousel();
      else startCarousel();
    });

    // Start when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          showItem(0);
          startCarousel();
          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    const hero = document.getElementById('inicio');
    if (hero) heroObserver.observe(hero);

    // Keyboard navigation for carousel
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextItem();
        stopCarousel();
        startCarousel();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (currentIndex - 1 + items.length) % items.length;
        showItem(prev);
        stopCarousel();
        startCarousel();
      }
    });

    // Make carousel focusable
    carousel.setAttribute('tabindex', '0');
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-label', 'Carrusel de tecnologías');
  };

  // Initialize tech carousel
  initTechCarousel();

  // ========================================
  // Project Filtering - Accessible
  // ========================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button with ARIA
      filterBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', isActive);
      });

      // Filter cards with animation
      projectCards.forEach((card, index) => {
        const categories = card.dataset.category.split(' ');
        const show = filter === 'all' || categories.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          // Staggered reveal
          if (!prefersReducedMotion) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.offsetHeight; // Force reflow
            card.style.transition = `opacity 0.4s var(--ease-out) ${index * 30}ms, transform 0.4s var(--ease-out) ${index * 30}ms`;
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          }
        } else {
          card.classList.add('hidden');
        }
      });
    });

    // Keyboard support
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // ========================================
  // Form Validation & Submission
  // ========================================
  const validateField = (field) => {
    const errorEl = field.parentElement.querySelector('.form-error');
    if (!errorEl) return true;

    let isValid = true;
    if (field.required && !field.value.trim()) {
      isValid = false;
    } else if (field.type === 'email' && field.value.trim()) {
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    } else if (field.tagName === 'SELECT' && field.required) {
      isValid = field.value !== '';
    }

    field.setAttribute('aria-invalid', !isValid);
    return isValid;
  };

  const showFormStatus = (message, isError = false) => {
    formStatus.textContent = message;
    formStatus.classList.toggle('error', isError);
    formStatus.style.opacity = '1';
    // Move focus to status for screen readers
    formStatus.focus();
  };

  const clearFormStatus = () => {
    formStatus.textContent = '';
    formStatus.classList.remove('error');
    formStatus.style.opacity = '0';
  };

  // Real-time validation on blur
  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.hasAttribute('aria-invalid')) validateField(field);
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormStatus();

    // Validate all fields
    const fields = contactForm.querySelectorAll('[required]');
    let allValid = true;
    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      showFormStatus('Por favor completa todos los campos requeridos correctamente.', true);
      const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Submit
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    try {
      // Simulate API call - replace with real endpoint
      await new Promise(resolve => setTimeout(resolve, 1200));

      showFormStatus(`¡Gracias, ${data.name}! Tu mensaje ha sido enviado. Te responderé pronto.`);
      contactForm.reset();
    } catch (err) {
      showFormStatus('Hubo un error al enviar. Intenta de nuevo o escríbeme directo a mi email.', true);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 72; // navbar height
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        // Focus target for accessibility
        setTimeout(() => target.focus({ preventScroll: true }), prefersReducedMotion ? 0 : 500);
      }
    });
  });

  // ========================================
  // Keyboard Navigation for Project Cards
  // ========================================
  projectCards.forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const link = card.querySelector('.project-link');
        if (link) {
          e.preventDefault();
          link.click();
        }
      }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
  });

  // ========================================
  // Initialize Reveal for Sections
  // ========================================
  // Add reveal classes to main sections
  document.querySelectorAll('section, header.hero').forEach((el, i) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
      revealObserver.observe(el);
    }
  });

  console.log('%c🚀 Robinson J. Sánchez Mayta — Portfolio loaded', 'color: #0d9488; font-size: 1.2rem; font-weight: 600;');
  console.log('%c💚 Built with Minimalism & Swiss Style principles', 'color: #14b8a6; font-size: 0.9rem;');
})();