(() => {
  const menu = document.querySelector('#menuBtn');
  const nav = document.querySelector('#navLinks');
  const navLinks = [...nav.querySelectorAll('.nav-link')];
  const mobile = window.matchMedia('(max-width: 760px)');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
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
    status.textContent = visible === 1 ? '1 proyecto visible' : `${visible} proyectos visibles`;
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
  const mascotMessage = document.querySelector('.mascot-message');
  const visitedKey = 'diffty-visited';
  let returning = false;
  try {
    returning = localStorage.getItem(visitedKey) === 'true';
  } catch {
    // The dialogue still works when storage is unavailable.
  }

  const dialogue = [
    returning ? '¿Qué haces aquí si ya te boté? ¡Cara enojao! 😕' : '¡Hola, amigo!',
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
    'Ya te kgaste…'
  ];
  let line = 0;

  mascot.hidden = false;
  mascot.addEventListener('click', () => {
    if (line >= dialogue.length) return;
    if (line === 0 && !returning) {
      try {
        localStorage.setItem(visitedKey, 'true');
      } catch {
        // The greeting can repeat on a later visit without storage.
      }
    }
    // Replace the text node so the repeated “Basta” also updates the live region.
    mascotMessage.replaceChildren(document.createTextNode(dialogue[line]));
    line += 1;
    if (line === dialogue.length) mascot.setAttribute('aria-disabled', 'true');
  });

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
