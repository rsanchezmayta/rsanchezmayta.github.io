(() => {
  const english = document.documentElement.lang === 'en';
  const menu = document.querySelector('#menuBtn');
  const nav = document.querySelector('#navLinks');
  const navLinks = [...nav.querySelectorAll('.nav-link')];
  const mobile = window.matchMedia('(max-width: 760px)');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    const labels = english ? ['Open navigation menu', 'Close navigation menu'] : ['Abrir menú de navegación', 'Cerrar menú de navegación'];
    menu.setAttribute('aria-label', labels[Number(open)]);
  }

  menu.hidden = false;
  document.documentElement.classList.add('js');
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
  mobile.addEventListener('change', () => setMenu(false));

  navLinks.forEach(link => link.addEventListener('click', () => {
    if (!mobile.matches) return;
    setMenu(false);
    const section = document.getElementById(link.dataset.section);
    section.tabIndex = -1;
    section.focus({ preventScroll: true });
  }));

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !nav.classList.contains('open')) return;
    setMenu(false);
    menu.focus();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const current = entries.find(entry => entry.isIntersecting);
      if (!current) return;
      navLinks.forEach(link => {
        if (link.dataset.section === current.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-25% 0px -55% 0px' });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
  }

  const filters = document.querySelector('.project-filters');
  const buttons = [...filters.querySelectorAll('button')];
  const cards = [...document.querySelectorAll('.project-card')];
  const status = document.querySelector('#projectStatus');
  filters.hidden = false;
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    const category = button.dataset.filter;
    let visible = 0;
    cards.forEach(card => {
      card.hidden = category !== 'all' && !card.dataset.category.split(' ').includes(category);
      if (!card.hidden) visible += 1;
    });
    const label = english ? (visible === 1 ? 'project visible' : 'projects visible') : (visible === 1 ? 'proyecto visible' : 'proyectos visibles');
    status.textContent = `${visible} ${label}`;
  }));

  const root = document.documentElement;
  const appearance = document.querySelector('.appearance');
  const theme = document.querySelector('#theme');
  const accent = document.querySelector('#accent');
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function applyAppearance() {
    root.dataset.theme = theme.value;
    root.dataset.accent = accent.value;
    themeColor.content = getComputedStyle(root).getPropertyValue('--surface').trim();
  }

  theme.value = root.dataset.theme || 'dark';
  accent.value = root.dataset.accent || 'mint';
  applyAppearance();
  appearance.hidden = false;
  appearance.addEventListener('change', () => {
    applyAppearance();
    try {
      localStorage.setItem('portfolio-appearance', JSON.stringify({ theme: theme.value, accent: accent.value }));
    } catch {
      // Appearance still works without persistent storage.
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !appearance.open || !appearance.contains(document.activeElement)) return;
    appearance.open = false;
    appearance.querySelector('summary').focus();
  });

  const mascot = document.querySelector('.mascot-button');
  const mascotMessage = document.querySelector('.mascot-line');
  const mascotStatus = document.querySelector('.mascot-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('es') : null;
  let typingTimer;

  function showMascotLine(text, onComplete) {
    clearTimeout(typingTimer);
    mascotStatus.replaceChildren(document.createTextNode(text));
    if (reducedMotion.matches) {
      mascotMessage.textContent = text;
      onComplete?.();
      return;
    }

    const characters = segmenter ? Array.from(segmenter.segment(text), part => part.segment) : Array.from(text);
    let index = 0;
    mascotMessage.textContent = '';
    function typeNext() {
      mascotMessage.textContent += characters[index];
      index += 1;
      if (index < characters.length) typingTimer = setTimeout(typeNext, 23);
      else onComplete?.();
    }
    typeNext();
  }

  const command = document.querySelector('.mascot-command');
  const commandInput = document.querySelector('#diffty-command');
  const errorScreen = document.querySelector('.diffty-error');
  const greeting = returning => returning ? [
    '¿Qué haces aquí si ya te boté? ¡Cara enojao! 😕',
    'Oe, es🐟ial, ya leíste lo que tenía que decir.',
    'Pero ya, si no entendiste, teclea: soy gil.'
  ] : ['¡Hola, amigo!'];
  const visitedKey = 'diffty-visited';
  let returning = false;
  try {
    returning = localStorage.getItem(visitedKey) === 'true';
  } catch {
    // The dialogue still works when storage is unavailable.
  }

  const intro = greeting(returning);
  const dialogue = [
    ...intro,
    'Soy Diffty, un chatbot en construcción.',
    'Mi dueño, Robin, es un tigre que está en cambios.',
    'Por eso, si él cambia, yo también.',
    'En fin, esta es una página para que conozcas algo de este gomol, pes.',
    'Que diga, de “Robin”.',
    'Así que tú tranquilo, revisa nomás.',
    'Eso sí, no seas tan 🐸, tampoco 🐟.',
    'Pero con confianza.',
    'Cualquier duda, pregúntale a la IA, p, BAB🐻.',
    'Ya, como solo es un guion…',
    'Me despido. Ya no des más clic.',
    'Oe, te dije que ya no, AN🦖.',
    '¿Tú no entiendes, no?',
    'Basta.',
    'Basta.',
    'Cánsate, pes.',
    'Ya te kgaste… 🤫'
  ];
  let line = 0;

  mascot.hidden = false;
  mascot.addEventListener('click', () => {
    if (!command.hidden || line >= dialogue.length) return;
    if (line === 0) mascot.classList.add('has-spoken');
    if (line === 0 && !returning) {
      try {
        localStorage.setItem(visitedKey, 'true');
      } catch {
        // The greeting can repeat on a later visit without storage.
      }
    }
    const text = dialogue[line];
    line += 1;
    if (line === dialogue.length) {
      mascotMessage.parentElement.classList.add('mascot-finale');
      showMascotLine(text, () => setTimeout(() => errorScreen.showModal(), 2000));
      return;
    }
    showMascotLine(text);
    if (returning && line === intro.length) {
      command.hidden = false;
      commandInput.focus();
    }
  });

  command.addEventListener('submit', event => {
    event.preventDefault();
    if (commandInput.value.trim().toLowerCase() !== 'soy gil') {
      showMascotLine('Oe, teclea: soy gil.');
      commandInput.select();
      return;
    }
    command.hidden = true;
    command.reset();
    mascot.focus();
    mascot.click();
  });

  errorScreen.addEventListener('cancel', event => event.preventDefault());
  errorScreen.querySelector('.diffty-reload').addEventListener('click', () => location.reload());

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
