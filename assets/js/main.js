/* ========================================
   MAIN.JS - Interactividad vanilla
   Sin dependencias, ES6 modules ready
   ======================================== */

(() => {
  'use strict';

  /* ---------- MOBILE MENU ---------- */
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (navToggle && navMenu) {
    const toggleMenu = () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMenu);

    // Cerrar menú al clickar un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });

    // Cerrar menú al clickar fuera
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('is-open') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- SMOOTH SCROLL OFFSET FOR FIXED HEADER ---------- */
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
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

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkMap = {};

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      navLinkMap[href.slice(1)] = link;
    }
  });

  const setActiveLink = () => {
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
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink(); // Initial check

  /* ---------- INTERSECTION OBSERVER FOR ANIMATIONS ---------- */
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
  document.querySelectorAll('.section__header, .project-card, .skill-category, .highlight, .about__text, .contact__form, .contact__info')
    .forEach(el => observer.observe(el));

  /* ---------- LAZY LOAD IMAGES (fallback for older browsers) ---------- */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
  } else {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
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
  }

  /* ---------- FORM HANDLING (Formspree integration) ---------- */
  const contactForm = document.querySelector('.contact__form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form__submit');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          submitBtn.textContent = '¡Enviado!';
          submitBtn.style.backgroundColor = 'var(--color-success)';
          contactForm.reset();
        } else {
          throw new Error('Error al enviar');
        }
      } catch (error) {
        submitBtn.textContent = 'Error, intenta de nuevo';
        submitBtn.style.backgroundColor = 'var(--color-error)';
      }

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = '';
      }, 3000);
    });
  }

  /* ---------- THEME TOGGLE (preparado para futuro) ---------- */
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  };

  // initTheme(); // Descomenta cuando añadas el toggle en el UI

})();