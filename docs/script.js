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
    // ensure pointer events enabled (CSS also handles it)
    offcanvas.style.pointerEvents = 'auto';
    // focus first focusable
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
    // return focus to previous
    if (lastFocusedBeforeOpen) safeFocus(lastFocusedBeforeOpen);
  }

  // attach listeners safely
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

  // click outside close
  if (offcanvas) {
    offcanvas.addEventListener('click', function (ev) {
      // if user clicks overlay area (outside inner)
      if (ev.target === offcanvas) closeMenu();
    });
  }

  // Escape key closes
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

  // Orbital labels (simple animation), robust checks
  const poster = document.querySelector('.poster-thumb');
  const orbitWrap = document.querySelector('.orbit-wrap');
  const orbitLabels = orbitWrap ? Array.from(orbitWrap.querySelectorAll('.orbit-label')) : [];

  if (poster && orbitWrap && orbitLabels.length === 3) {
    let angle = 0;
    const offsets = [0, (Math.PI*2)/3, (Math.PI*4)/3]; // three positions
    const speed = (Math.PI*2) / 28; // full rotation in 28s

    function updateOrbit() {
      const rect = poster.getBoundingClientRect();
      const centerX = rect.left + rect.width/2 + window.scrollX;
      const centerY = rect.top + rect.height/2 + window.scrollY;
      const radius = Math.max(rect.width, rect.height) * 0.6 + 40;

      angle += speed / 60; // assumes ~60fps

      orbitLabels.forEach((label, idx) => {
        const a = angle + offsets[idx];
        const x = centerX + Math.cos(a) * radius;
        const y = centerY + Math.sin(a) * radius;
        const rectL = label.getBoundingClientRect();
        const w = rectL.width || 100;
        const h = rectL.height || 30;
        label.style.left = (x - w/2) + 'px';
        label.style.top = (y - h/2) + 'px';

        const deg = a * 180 / Math.PI;
        // rotate wrapper so it follows orbit path, then counter-rotate inner text
        label.style.transform = `rotate(${deg}deg)`;
        // ensure label contains no nested tags that break layout — use <span> or plain text
        // safe attempt to counter-rotate children
        const children = Array.from(label.children || []);
        children.forEach(child => {
          if (child && child.style) child.style.transform = `rotate(${-deg}deg)`;
        });
      });

      requestAnimationFrame(updateOrbit);
    }

    function startWhenReady() {
      const r = poster.getBoundingClientRect();
      if (r.width > 10) {
        requestAnimationFrame(updateOrbit);
      } else {
        setTimeout(startWhenReady, 200);
      }
    }
    startWhenReady();
  }

});
