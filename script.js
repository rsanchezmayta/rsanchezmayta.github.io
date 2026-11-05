/**
 * Robinson J. Sánchez Mayta — CV/Portfolio
 * Main JavaScript: interactions, animations, form handling
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
  const reveals = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-count]');
  const skillFills = document.querySelectorAll('.skill-fill');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const yearEl = document.getElementById('year');

  // ========================================
  // Year in footer
  // ========================================
  yearEl.textContent = new Date().getFullYear();

  // ========================================
  // Mobile Menu
  // ========================================
  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinkElements.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      menuBtn.focus();
    }
  });

  // ========================================
  // Navbar scroll effect
  // ========================================
  let lastScroll = 0;
  const navbarThreshold = 50;

  const handleNavbarScroll = () => {
    const currentScroll = window.scrollY;
    if (currentScroll > navbarThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ========================================
  // Active nav link on scroll
  // ========================================
  const sectionObserverOptions = {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkElements.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, sectionObserverOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ========================================
  // Reveal animations (IntersectionObserver)
  // ========================================
  const revealObserverOptions = {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  reveals.forEach(el => revealObserver.observe(el));

  // ========================================
  // Animated counters
  // ========================================
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const startTime = performance.now();
    const easing = t => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easing(progress);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
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
  // Skill bars animation
  // ========================================
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const pct = fill.style.getPropertyValue('--pct') || fill.dataset.level + '%';
        fill.style.width = pct;
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

  skillFills.forEach(el => skillObserver.observe(el));

  // ========================================
  // Neural Network Background (canvas) - handles multiple canvases
  // ========================================
  const createNeuralBackground = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, dpr = 1;
    let nodes = [];
    let animationId = null;
    let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initNodes();
    };

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.7 ? '#10b981' : '#34d399';
        this.opacity = Math.random() * 0.4 + 0.15;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const initNodes = () => {
      const count = Math.min(Math.floor((width * height) / 8000), 60);
      nodes = Array.from({ length: count }, () => new Node());
    };

    const drawConnections = () => {
      const maxDist = 140;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = '#10b981';
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    const animate = () => {
      if (prefersReducedMotion) return;
      ctx.clearRect(0, 0, width, height);
      drawConnections();
      nodes.forEach(n => { n.update(); n.draw(); });
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      cancelAnimationFrame(animationId);
      resize();
      animate();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
      prefersReducedMotion = e.matches;
      if (!prefersReducedMotion) animate();
    });

    resize();
    animate();
  };

  const initNeuralBackgrounds = () => {
    createNeuralBackground('neural-bg');
    createNeuralBackground('neural-bg-about');
  };

  // ========================================
  // Skill Radar Chart
  // ========================================
  const initSkillRadar = () => {
    const canvas = document.getElementById('skill-radar');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Skill data: [current level (0-1), learning level (0-1)]
    const skills = [
      { label: 'Python & ML', current: 0.9, learning: 0.1 },
      { label: 'Data Engineering', current: 0.75, learning: 0.2 },
      { label: 'MLOps & Deploy', current: 0.65, learning: 0.25 },
      { label: 'Deep Learning', current: 0.7, learning: 0.3 },
      { label: 'Data Viz & Story', current: 0.8, learning: 0.15 },
      { label: 'Colaboración & Git', current: 0.85, learning: 0.1 }
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
    };

    const drawRadar = (progress = 1) => {
      const cx = canvas.width / 2 / dpr;
      const cy = canvas.height / 2 / dpr;
      const radius = Math.min(cx, cy) - 20;
      const vertices = skills.length;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      const levels = 5;
      for (let level = 1; level <= levels; level++) {
        const r = (radius / levels) * level;
        ctx.beginPath();
        for (let i = 0; i < vertices; i++) {
          const angle = (Math.PI * 2 * i) / vertices - Math.PI / 2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Axis lines
      for (let i = 0; i < vertices; i++) {
        const angle = (Math.PI * 2 * i) / vertices - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Current skill area
      ctx.beginPath();
      for (let i = 0; i < vertices; i++) {
        const angle = (Math.PI * 2 * i) / vertices - Math.PI / 2;
        const value = skills[i].current * progress;
        const r = radius * value;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Learning area (secondary)
      ctx.beginPath();
      for (let i = 0; i < vertices; i++) {
        const angle = (Math.PI * 2 * i) / vertices - Math.PI / 2;
        const value = (skills[i].current + skills[i].learning) * progress * 0.6;
        const r = radius * value;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const gradient2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient2.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
      gradient2.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = gradient2;
      ctx.fill();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      // Vertex dots
      for (let i = 0; i < vertices; i++) {
        const angle = (Math.PI * 2 * i) / vertices - Math.PI / 2;
        const value = skills[i].current * progress;
        const r = radius * value;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0f0d';
        ctx.fill();
      }
    };

    // Animate radar on scroll into view
    const radarObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (prefersReducedMotion) {
            drawRadar(1);
          } else {
            let progress = 0;
            const duration = 1200;
            const start = performance.now();
            const animate = (now) => {
              progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              drawRadar(eased);
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
          radarObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    radarObserver.observe(canvas);

    const handleResize = () => {
      resize();
      drawRadar(1);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
      prefersReducedMotion = e.matches;
    });

    resize();
    drawRadar(0);
  };

  // ========================================
  // Terminal Animation (Hero)
  // ========================================
  const initTerminal = () => {
    const outputEl = document.getElementById('terminal-output');
    if (!outputEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lines = [
      { type: 'comment', text: '# Iniciando laboratorio de ciencia de datos...' },
      { type: 'command', text: 'python3 -c "import torch; print(f'PyTorch {torch.__version__} ✓')"' },
      { type: 'command', text: 'python3 -c "import sklearn; print(f'scikit-learn {sklearn.__version__} ✓')"' },
      { type: 'command', text: 'python3 -c "import pandas; print(f'pandas {pandas.__version__} ✓')"' },
      { type: 'command', text: 'python3 -c "import xgboost; print(f'XGBoost {xgboost.__version__} ✓')"' },
      { type: 'command', text: 'python3 -c "import sqlalchemy; print(f'SQLAlchemy {sqlalchemy.__version__} ✓')"' },
      { type: 'comment', text: '# Entorno listo. Cargando perfil...' },
      { type: 'command', text: 'cat ~/.config/data_scientist/profile.json' },
      { type: 'output', html: `
        <div class="terminal-character">
          <div class="character-avatar pixel-avatar" id="pixel-avatar"></div>
          <div class="character-speech">¡Hola! Soy tu asistente de DS. Amo Python, ML, SQL y dashboards 📊</div>
        </div>
        <div class="terminal-line">
          <span class="skill-tag">Python</span>
          <span class="skill-tag">PyTorch</span>
          <span class="skill-tag">Scikit-learn</span>
          <span class="skill-tag">XGBoost</span>
          <span class="skill-tag">Pandas</span>
          <span class="skill-tag">SQL</span>
          <span class="skill-tag">Docker</span>
          <span class="skill-tag">MLOps</span>
        </div>
      ` }
    ];

    const typeLine = (line, index) => {
      return new Promise(resolve => {
        const lineEl = document.createElement('div');
        lineEl.className = 'terminal-line';
        
        if (line.type === 'comment') {
          lineEl.innerHTML = `<span class="comment">${line.text}</span>`;
        } else if (line.type === 'command') {
          lineEl.innerHTML = `<span class="prompt">robinson@data-lab:~$</span> <span class="command">${line.text}</span>`;
        } else if (line.type === 'output') {
          lineEl.innerHTML = line.html;
        }
        
        outputEl.appendChild(lineEl);
        
        // Scroll to bottom
        outputEl.scrollTop = outputEl.scrollHeight;
        
        const delay = prefersReducedMotion ? 0 : (line.type === 'output' ? 800 : 300);
        setTimeout(resolve, delay);
      });
    };

    const runSequence = async () => {
      for (let i = 0; i < lines.length; i++) {
        await typeLine(lines[i], i);
      }
      // Draw pixel avatar after sequence completes
      setTimeout(drawPixelAvatar, 100);
    };

    // Pixel art avatar drawing
    const drawPixelAvatar = () => {
      const avatarEl = document.getElementById('pixel-avatar');
      if (!avatarEl) return;
      
      const pixelArt = [
        "      ██████      ",
        "    ██████████    ",
        "   ████████████   ",
        "  ██████████████  ",
        "  ██████████████  ",
        "  ██░░██████░░██  ",
        "  ██░░██████░░██  ",
        "  ██████████████  ",
        "  ██████████████  ",
        "  ██████████████  ",
        "   ████████████   ",
        "    ██████████    ",
        "      ██████      "
      ];
      
      avatarEl.innerHTML = pixelArt.map(row => `<div class="pixel-row">${row}</div>`).join('');
    };

    // Start when terminal is in view
    const terminalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runSequence();
          terminalObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) {
      terminalObserver.observe(terminalWindow);
    }
  };
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
  };

  const clearFormStatus = () => {
    formStatus.textContent = '';
    formStatus.classList.remove('error');
    formStatus.style.opacity = '0';
  };

  // Real-time validation
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

      // Success
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
  // Smooth scroll for anchor links
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
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
        target.focus({ preventScroll: true });
      }
    });
  });

  // ========================================
  // Keyboard navigation for project cards
  // ========================================
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const link = card.querySelector('.project-link');
        if (link) link.click();
      }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
  });

  // ========================================
  // Initialize all
  // ========================================
  const init = () => {
    initNeuralBackgrounds();
    initTerminal();
    initSkillRadar();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('%c🚀 Robinson J. Sánchez Mayta — CV loaded', 'color: #10b981; font-size: 1.2rem; font-weight: 600;');
  console.log('%c💚 Built with curiosity and green', 'color: #34d399; font-size: 0.9rem;');
})();