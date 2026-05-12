const cursor = document.getElementById('cursor');
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, .project, .product-card, .service-cell, .fs-col, li, .lang-switch span').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });

  const nav = document.getElementById('nav');
  const heroEl = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (window.scrollY > heroEl.offsetHeight - 80) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  const words = document.querySelectorAll('#manifesto .word');
  window.addEventListener('scroll', () => {
    const manifesto = document.querySelector('.manifesto');
    if (!manifesto) return;
    const rect = manifesto.getBoundingClientRect();
    const start = window.innerHeight;
    const end = -manifesto.offsetHeight + window.innerHeight;
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    const litCount = Math.floor(progress * words.length * 1.4);
    words.forEach((w, i) => w.classList.toggle('lit', i < litCount));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.style.opacity = '1'; });
  }, {threshold: 0.1});
  document.querySelectorAll('section').forEach(s => {
    s.style.transition = 'opacity .8s ease';
    observer.observe(s);
  });