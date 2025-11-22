// script.js — menu interactions + particles + small improvements

document.addEventListener('DOMContentLoaded', function () {
  // MENU: open/close off-canvas with accessibility attributes
  const menuBtn = document.getElementById('menu-btn');
  const offcanvas = document.getElementById('offcanvas-menu');
  const menuClose = document.getElementById('menu-close');
  const focusableSelector = 'a, button, input, textarea, [tabindex]:not([tabindex="-1"])';

  function openMenu() {
    offcanvas.classList.add('open');
    offcanvas.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    // focus first focusable item in menu
    const first = offcanvas.querySelector(focusableSelector);
    if (first) first.focus();
  }
  function closeMenu() {
    offcanvas.classList.remove('open');
    offcanvas.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    menuBtn.focus();
  }

  menuBtn && menuBtn.addEventListener('click', function () {
    const isOpen = offcanvas.classList.contains('open');
    if (isOpen) closeMenu(); else openMenu();
  });

  menuClose && menuClose.addEventListener('click', function () {
    closeMenu();
  });

  // close menu when pressing Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && offcanvas.classList.contains('open')) {
      closeMenu();
    }
  });

  // close when clicking outside content (click on offcanvas area but not inside inner)
  offcanvas && offcanvas.addEventListener('click', function (ev) {
    if (ev.target === offcanvas) closeMenu();
  });

  // Particle background (lightweight)
  const canvas = document.getElementById('particles');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles = [];
    const N = Math.floor(Math.max(30, (w*h) / 120000));
    function rand(min, max){ return Math.random()*(max-min)+min; }
    for (let i=0;i<N;i++){
      particles.push({
        x: rand(0,w),
        y: rand(0,h),
        r: rand(0.4,1.6),
        vx: rand(-0.2,0.2),
        vy: rand(-0.15,0.15),
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

});
