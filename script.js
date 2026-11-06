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
  // Terminal Sequence Runner (inside hero terminal)
  // ========================================
  const initTerminalSequence = () => {
    const terminalBody = document.getElementById('terminalBody');
    const terminalOutput = document.getElementById('terminalOutput');
    const cmdText = document.getElementById('cmdText');
    if (!terminalBody || !terminalOutput || !cmdText) return;

    // Sequence of commands to run
    const sequence = [
      { cmd: 'python3', icon: 'images/icon-python.png', label: 'Python', delay: 800 },
      { cmd: 'sqlite3', icon: 'images/icon-sql.png', label: 'SQL', delay: 600 },
      { cmd: 'mlflow', icon: 'images/icon-ml.png', label: 'Machine Learning', delay: 800 },
      { cmd: 'pandas', icon: 'images/icon-pandas.png', label: 'Pandas', delay: 600 },
      { cmd: 'numpy', icon: 'images/icon-numpy.png', label: 'NumPy', delay: 500 },
      { cmd: 'docker', icon: 'images/icon-docker.png', label: 'Docker', delay: 700 },
      { cmd: 'zsh', icon: 'images/icon-terminal.png', label: 'Terminal', delay: 500 },
      { cmd: 'minio', icon: 'images/icon-datawarehouse.png', label: 'Data Warehouse', delay: 700 },
      { cmd: 'php', icon: 'images/icon-php.png', label: 'PHP', delay: 500 },
      { cmd: 'git', icon: 'images/icon-git.png', label: 'Git', delay: 500 },
      { cmd: 'arch', icon: 'images/icon-linux.png', label: 'Linux', delay: 500 },
      { cmd: 'nvim', icon: 'images/icon-nvim.png', label: 'Neovim', delay: 600 }
    ];

    let currentIndex = 0;
    let isRunning = false;
    const typeSpeed = 45; // ms per character
    const pauseAfterIcon = 1600; // ms to show icon before next command
    const spinnerDelay = 400; // ms spinner shows before icon appears

    // Create icon element
    const createIconElement = (iconSrc, label) => {
      const container = document.createElement('div');
      container.className = 'terminal-icon-output';
      container.style.opacity = '0';
      container.style.transform = 'translateY(10px)';
      container.innerHTML = `
        <img src="${iconSrc}" alt="${label}" loading="lazy" width="100" height="100" class="terminal-icon-img">
        <span class="terminal-icon-label">${label}</span>
      `;
      return container;
    };

    // Type command character by character
    const typeCommand = (cmd, callback) => {
      let i = 0;
      cmdText.textContent = '';
      cmdText.style.opacity = '1';
      
      const type = () => {
        if (i < cmd.length) {
          cmdText.textContent += cmd[i];
          i++;
          setTimeout(type, typeSpeed);
        } else {
          callback();
        }
      };
      type();
    };

    // Show spinner briefly then icon
    const showIconWithSpinner = (iconSrc, label) => {
      // Add spinner line
      const spinnerLine = document.createElement('div');
      spinnerLine.className = 'terminal-spinner-line';
      spinnerLine.innerHTML = '<span class="spinner"></span>';
      terminalOutput.appendChild(spinnerLine);
      
      setTimeout(() => {
        spinnerLine.remove();
        
        const iconEl = createIconElement(iconSrc, label);
        terminalOutput.appendChild(iconEl);
        
        // Force reflow then animate in
        iconEl.offsetHeight;
        iconEl.style.transition = 'opacity 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        iconEl.style.opacity = '1';
        iconEl.style.transform = 'translateY(0)';
      }, spinnerDelay);
    };

    // Clear output and command for next iteration
    const clearForNext = () => {
      terminalOutput.innerHTML = '';
      cmdText.textContent = '';
      cmdText.style.opacity = '0';
    };

    // Run sequence
    const runSequence = async () => {
      if (isRunning) return;
      isRunning = true;

      while (true) {
        for (const item of sequence) {
          // Type command
          await new Promise(resolve => typeCommand(item.cmd, resolve));
          
          // Small pause after typing
          await new Promise(r => setTimeout(r, 200));
          
          // Show icon with spinner
          showIconWithSpinner(item.icon, item.label);
          
          // Wait for icon display
          await new Promise(r => setTimeout(r, pauseAfterIcon + spinnerDelay + 400));
          
          // Clear for next
          clearForNext();
          
          // Small pause between commands
          await new Promise(r => setTimeout(r, 300));
        }
        
        // Loop back to start after full sequence
        // Small pause before restarting
        await new Promise(r => setTimeout(r, 800));
      }
    };

    // Start when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isRunning) {
          runSequence();
          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    const hero = document.getElementById('inicio');
    if (hero) heroObserver.observe(hero);

    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
      // Sequence handles its own timing, but we can pause if needed
    });

    // Reduced motion - show all icons at once
    if (prefersReducedMotion) {
      terminalOutput.innerHTML = '';
      sequence.forEach(item => {
        const iconEl = createIconElement(item.icon, item.label);
        iconEl.style.opacity = '1';
        iconEl.style.transform = 'translateY(0)';
        terminalOutput.appendChild(iconEl);
      });
      terminalOutput.style.display = 'flex';
      terminalOutput.style.flexWrap = 'wrap';
      terminalOutput.style.justifyContent = 'center';
      terminalOutput.style.gap = 'var(--space-4)';
      cmdText.style.display = 'none';
    }
  };

  // Initialize terminal sequence
  initTerminalSequence();

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