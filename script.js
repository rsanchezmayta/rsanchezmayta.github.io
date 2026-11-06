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

    // Sequence of commands to run - simulates opening/running each app
    const sequence = [
      { 
        cmd: 'python3 train_model.py', 
        output: [
          'Loading dataset... [OK]',
          'Initializing XGBoost classifier... [OK]',
          'Training on 45,000 samples... ████████████ 100%',
          'Model saved to models/xgb_churn.pkl',
          'Accuracy: 94.2% | F1: 0.93'
        ],
        icon: 'images/icon-python.png', 
        label: 'Python', 
        delay: 800 
      },
      { 
        cmd: 'sqlite3 data/warehouse.db', 
        output: [
          'Connected to SQLite 3.45.0',
          'Running query: SELECT * FROM sales WHERE year=2024',
          'Rows returned: 45,231',
          'Execution time: 12ms'
        ],
        icon: 'images/icon-sql.png', 
        label: 'SQL', 
        delay: 600 
      },
      { 
        cmd: 'mlflow ui --port 5000', 
        output: [
          'Starting MLflow tracking server...',
          'Backend store: sqlite:///mlflow.db',
          'Artifact store: ./mlruns',
          'Running on http://localhost:5000'
        ],
        icon: 'images/icon-ml.png', 
        label: 'Machine Learning', 
        delay: 800 
      },
      { 
        cmd: 'python -c "import pandas as pd; df=pd.read_parquet(\'data.parquet\')"', 
        output: [
          'Loading parquet file... [OK]',
          'Shape: (1.2M, 47)',
          'Memory usage: 456.3 MB',
          'Dtypes: int64(12), float64(23), object(12)'
        ],
        icon: 'images/icon-pandas.png', 
        label: 'Pandas', 
        delay: 600 
      },
      { 
        cmd: 'python -c "import numpy as np; arr=np.random.rand(10000,100)"', 
        output: [
          'Allocating array (10000, 100)... [OK]',
          'Mean: 0.4998 | Std: 0.2887',
          'Memory: 7.6 MB | Contiguous: True'
        ],
        icon: 'images/icon-numpy.png', 
        label: 'NumPy', 
        delay: 500 
      },
      { 
        cmd: 'docker run -d -p 8080:8080 churn-api:latest', 
        output: [
          'Pulling image churn-api:latest... [OK]',
          'Creating container... [OK]',
          'Container ID: a1b2c3d4e5f6',
          'Health check passing on :8080/health'
        ],
        icon: 'images/icon-docker.png', 
        label: 'Docker', 
        delay: 700 
      },
      { 
        cmd: 'zsh --version && echo $SHELL', 
        output: [
          'zsh 5.9 (x86_64-pc-linux-gnu)',
          '/usr/bin/zsh',
          'Oh My Zsh loaded: robbyrussell theme',
          'Plugins: git, docker, kubectl, python'
        ],
        icon: 'images/icon-terminal.png', 
        label: 'Terminal', 
        delay: 500 
      },
      { 
        cmd: 'minio server /data --console-address ":9001"', 
        output: [
          'Starting MinIO Object Storage...',
          'API: http://localhost:9000',
          'Console: http://localhost:9001',
          'Access Key: minioadmin | Secret: minioadmin',
          'Buckets: ml-models, datasets, artifacts'
        ],
        icon: 'images/icon-datawarehouse.png', 
        label: 'Data Warehouse', 
        delay: 700 
      },
      { 
        cmd: 'php artisan serve --host=0.0.0.0 --port=8000', 
        output: [
          'Starting Laravel development server...',
          'Laravel v11.x | PHP 8.3.12',
          'Running on http://0.0.0.0:8000',
          'Routes cached | Config cached | Views cached'
        ],
        icon: 'images/icon-php.png', 
        label: 'PHP', 
        delay: 500 
      },
      { 
        cmd: 'git status && git log --oneline -5', 
        output: [
          'On branch main | Your branch is up to date',
          'a1b2c3d feat: add ML pipeline monitoring',
          'e4f5g6h fix: Docker healthcheck timeout',
          'i7j8k9l docs: update API documentation',
          'm0n1o2p refactor: optimize DB queries'
        ],
        icon: 'images/icon-git.png', 
        label: 'Git', 
        delay: 500 
      },
      { 
        cmd: 'uname -a && pacman -Q | wc -l', 
        output: [
          'Linux arch 6.10.3-arch1-1 #1 SMP PREEMPT_DYNAMIC',
          'x86_64 GNU/Linux',
          'Packages installed: 1,247',
          'Kernel: 6.10.3 | glibc: 2.40'
        ],
        icon: 'images/icon-linux.png', 
        label: 'Linux', 
        delay: 500 
      },
      { 
        cmd: 'nvim --version | head -1', 
        output: [
          'NVIM v0.10.1',
          'LuaJIT 2.1.1713319384',
          'Config: ~/.config/nvim (lazy.nvim)',
          'LSP: pyright, lua_ls, rust_analyzer, gopls'
        ],
        icon: 'images/icon-nvim.png', 
        label: 'Neovim', 
        delay: 600 
      }
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

    // Show output lines then icon
    const showOutputThenIcon = (item) => {
      let lineIndex = 0;
      const outputLines = item.output || [];
      
      // Create container for output lines (left-aligned)
      const linesContainer = document.createElement('div');
      linesContainer.className = 'terminal-output-lines';
      terminalOutput.appendChild(linesContainer);
      
      const showNextLine = () => {
        if (lineIndex < outputLines.length) {
          const line = document.createElement('div');
          line.className = 'terminal-output-line';
          line.style.opacity = '0';
          line.style.transform = 'translateX(-10px)';
          line.textContent = outputLines[lineIndex];
          linesContainer.appendChild(line);
          
          // Force reflow then animate in
          line.offsetHeight;
          line.style.transition = 'opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          line.style.opacity = '1';
          line.style.transform = 'translateX(0)';
          
          lineIndex++;
          setTimeout(showNextLine, 350); // delay between lines
        } else {
          // All output lines shown, now show spinner then icon
          setTimeout(() => {
            showIconWithSpinner(item.icon, item.label);
          }, 400);
        }
      };
      
      showNextLine();
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
          
          // Show output lines then icon
          showOutputThenIcon(item);
          
          // Wait for output + icon display
          const outputTime = (item.output?.length || 0) * 350 + 400 + spinnerDelay + 400;
          await new Promise(r => setTimeout(r, outputTime));
          
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