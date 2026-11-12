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

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
