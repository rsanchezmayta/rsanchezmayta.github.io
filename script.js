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
      const target = document.getElementById(link.dataset.section);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
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
          const active = link.dataset.section === id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
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

  const projectStatus = document.getElementById('projectStatus');
  filterBtns.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterBtns.forEach(option => {
        const selected = option === button;
        option.classList.toggle('active', selected);
        option.setAttribute('aria-pressed', selected);
      });

      let visible = 0;
      projectCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category.split(' ').includes(filter);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      projectStatus.textContent = visible === 1 ? '1 proyecto visible' : `${visible} proyectos visibles`;
    });
  });
})();
