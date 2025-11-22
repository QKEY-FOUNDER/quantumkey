// script.js — menu interactions + particles + dynamic orbit radius
// Colar em: docs/script.js

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

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      const isOpen = offcanvas.classList.contains('open');
      if (isOpen) closeMenu(); else openMenu();
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', function () {
      closeMenu();
    });
  }

  // close menu when pressing Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && offcanvas && offcanvas.classList.contains('open')) {
      closeMenu();
    }
  });

  // close when clicking outside content (click on offcanvas area but not inside inner)
  if (offcanvas) {
    offcanvas.addEventListener('click', function (ev) {
      if (ev.target === offcanvas) closeMenu();
    });
  }

  /* ------------------------------------------------------------
     Orbit: calculate center & radius based on poster image bounds
     ------------------------------------------------------------*/
  const poster = document.getElementById('poster-thumb');
  const orbitWrap = document.getElementById('orbit-wrap');

  function computeOrbit() {
    if (!poster || !orbitWrap) return;
    // get bounding rect of poster relative to viewport
    const imgRect = poster.getBoundingClientRect();
    // compute center of poster in page coords
    const centerX = imgRect.left + imgRect.width / 2;
    const centerY = imgRect.top + imgRect.height / 2;
    // compute radius: a little bigger than the largest half-dimension of poster
    const baseRadius = Math.max(imgRect.width, imgRect.height) / 2;
    const extra = Math.max(28, Math.min(160, baseRadius * 0.15)); // extra padding
    let radius = Math.round(baseRadius + extra);

    // cap radius so it won't overflow tiny screens
    const maxAllowed = Math.max(window.innerWidth, window.innerHeight) * 0.6;
    if (radius > maxAllowed) radius = Math.round(maxAllowed);

    // set CSS variable on orbitWrap so labels rotate around poster center
    orbitWrap.style.setProperty('--orbit-radius', radius + 'px');

    // additionally position orbitWrap center to the poster center (helps precise alignment)
    // orbitWrap is absolutely positioned inset:0 inside poster container, but if poster container
    // has offset inside layout, we want transform-origin aligned visually — we use translate to center.
    const posterParentRect = poster.parentElement.getBoundingClientRect();
    const offsetX = (imgRect.left - posterParentRect.left) + imgRect.width / 2;
    const offsetY = (imgRect.top - posterParentRect.top) + imgRect.height / 2;
    orbitWrap.style.left = '0';
    orbitWrap.style.top = '0';
    orbitWrap.style.transform = `translate(${offsetX - posterParentRect.width/2}px, ${offsetY - posterParentRect.height/2}px)`;
  }

  // compute after image loads and on resize/scroll (scroll can change poster position)
  function safeCompute() {
    // small timeout to allow layout to stabilize
    setTimeout(computeOrbit, 40);
  }

  if (poster && poster.complete) {
    safeCompute();
  } else if (poster) {
    poster.addEventListener('load', safeCompute);
  }

  window.addEventListener('resize', safeCompute);
  window.addEventListener('orientationchange', safeCompute);
  window.addEventListener('scroll', safeCompute, { passive: true });

  /* ------------------------------------------------------------
     Particle background (lightweight)
     ------------------------------------------------------------*/
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

});
