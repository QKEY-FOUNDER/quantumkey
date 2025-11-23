document.addEventListener('DOMContentLoaded', function () {
  // Robust menu open/close logic
  const menuBtn = document.getElementById('menu-btn');
  const offcanvas = document.getElementById('offcanvas-menu');
  const menuClose = document.getElementById('menu-close');
  const focusableSelector = 'a, button, input, textarea, [tabindex]:not([tabindex="-1"])';
  let lastFocusedBeforeOpen = null;

  function safeFocus(el) {
    try { if (el && typeof el.focus === 'function') el.focus(); } catch (e) {}
  }

  function openMenu() {
    if (!offcanvas) return;
    lastFocusedBeforeOpen = document.activeElement;
    offcanvas.classList.add('open');
    offcanvas.setAttribute('aria-hidden', 'false');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    offcanvas.style.pointerEvents = 'auto';
    const first = offcanvas.querySelector(focusableSelector);
    if (first) safeFocus(first);
  }

  function closeMenu() {
    if (!offcanvas) return;
    offcanvas.classList.remove('open');
    offcanvas.setAttribute('aria-hidden', 'true');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    offcanvas.style.pointerEvents = 'none';
    if (lastFocusedBeforeOpen) safeFocus(lastFocusedBeforeOpen);
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!offcanvas) return;
      if (offcanvas.classList.contains('open')) closeMenu(); else openMenu();
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', function (e) {
      e.preventDefault();
      closeMenu();
    });
  }

  if (offcanvas) {
    offcanvas.addEventListener('click', function (ev) {
      if (ev.target === offcanvas) closeMenu();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && offcanvas && offcanvas.classList.contains('open')) {
      closeMenu();
    }
  });

  // Particle background (lightweight)
  const canvas = document.getElementById('particles');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles = [];
    const N = Math.floor(Math.max(20, (w*h) / 140000));
    function rand(min, max){ return Math.random()*(max-min)+min; }
    for (let i=0;i<N;i++){
      particles.push({
        x: rand(0,w),
        y: rand(0,h),
        r: rand(0.4,1.6),
        vx: rand(-0.2,0.2),
        vy: rand(-0.12,0.12),
        alpha: rand(0.04,0.18)
      });
    }

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);

    function draw(){
      ctx.clearRect(0,0,w,h);
      for (let p of particles){
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(180,230,255,${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // Orbital labels removed — no orbital JS to run
});
