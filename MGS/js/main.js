document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const current = window.location.pathname.split('/').pop() || 'index.html';

  const closeMenu = () => {
    nav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.textContent = '☰';
  };

  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 16), { passive: true });
  toggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    document.body.classList.toggle('menu-open', Boolean(open));
    toggle.setAttribute('aria-expanded', String(Boolean(open)));
    toggle.textContent = open ? '×' : '☰';
  });
  nav?.querySelectorAll('a').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === current);
    link.addEventListener('click', closeMenu);
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.card, .solution-card, .sector-card, .profile, .product-card, .metric-card').forEach((item) => {
    item.classList.add('reveal-item');
    revealObserver.observe(item);
  });

  document.querySelectorAll('.faq-question').forEach((question) => question.addEventListener('click', () => {
    const item = question.closest('.faq-item');
    const open = item?.classList.toggle('open');
    question.setAttribute('aria-expanded', String(Boolean(open)));
  }));

  document.querySelectorAll('[data-count]').forEach((counter) => {
    const target = Number(counter.dataset.count); const suffix = counter.dataset.suffix || ''; let value = 0;
    const tick = () => { value = Math.min(target, value + Math.max(1, Math.ceil(target / 36))); counter.textContent = `${value}${suffix}`; if (value < target) requestAnimationFrame(tick); };
    const observer = new IntersectionObserver((entries, instance) => { if (entries[0].isIntersecting) { tick(); instance.disconnect(); } }, { threshold: .6 }); observer.observe(counter);
  });

  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', (event) => { event.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return; } const status = form.querySelector('.form-status'); if (status) status.textContent = 'Thank you. Our EU response desk will be in touch within one business day.'; form.reset(); });

  const buttons = document.querySelectorAll('[data-filter]'); const items = document.querySelectorAll('[data-category]');
  buttons.forEach((button) => button.addEventListener('click', () => { buttons.forEach((item) => item.classList.remove('active')); button.classList.add('active'); const filter = button.dataset.filter; items.forEach((item) => { item.hidden = filter !== 'all' && item.dataset.category !== filter; }); }));

  const search = document.querySelector('[data-shop-search]');
  search?.addEventListener('input', () => { const term = search.value.toLowerCase(); document.querySelectorAll('[data-product]').forEach((item) => { item.hidden = !item.textContent.toLowerCase().includes(term); }); });
  document.querySelectorAll('[data-quote]').forEach((button) => button.addEventListener('click', () => { button.textContent = 'Added to quote'; button.classList.add('is-added'); }));
});
