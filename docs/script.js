/* script.js — updated (drop into docs/script.js)
   Changes made:
   - If #menu-toggle is missing we create a lightweight hamburger button for mobile.
   - More robust nav toggle (works if nav starts hidden or visible).
   - Ensure Markdown links open reliably (force navigation for .md links).
   - Improved canvas resize / DPR handling and transform reset.
   - Fallbacks if #logo-plate missing (use .hero-card center).
   - Minor performance and accessibility tweaks.
*/

(function(){
  // ---- UTILS ----
  const qs = sel => document.querySelector(sel);
  const qsa = sel => Array.from(document.querySelectorAll(sel));

  // ---- CREATE MENU TOGGLE IF MISSING ----
  let menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if(!menuToggle && mainNav){
    const brand = qs('.brand') || document.body;
    menuToggle = document.createElement('button');
    menuToggle.id = 'menu-toggle';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'main-nav');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<span class="sr-only">Menu</span><svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true"><path d="M0 1h22M0 8h22M0 15h22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    // try to place before nav or at start of brand
    if(mainNav.parentNode) mainNav.parentNode.insertBefore(menuToggle, mainNav);
    else brand.insertBefore(menuToggle, brand.firstChild);
  }

  // ---- NAV TOGGLE ----
  function setNavOpen(open){
    if(!mainNav) return;
    mainNav.style.display = open ? 'block' : 'none';
    mainNav.setAttribute('aria-hidden', (!open).toString());
    if(menuToggle) menuToggle.setAttribute('aria-expanded', String(open));
  }

  if(menuToggle && mainNav){
    // initialize: hide nav on small screens, show on wide screens
    const mq = window.matchMedia('(min-width: 860px)');
    const applyMedia = () => {
      if(mq.matches){
        // wide -> always visible
        mainNav.style.display = 'flex';
        mainNav.setAttribute('aria-hidden', 'false');
        if(menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
      } else {
        // small -> hide by default
        mainNav.style.display = 'none';
        mainNav.setAttribute('aria-hidden', 'true');
        if(menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }
    };
    applyMedia();
    mq.addEventListener ? mq.addEventListener('change', applyMedia) : mq.addListener(applyMedia);

    menuToggle.addEventListener('click', () => {
      const isHidden = mainNav.getAttribute('aria-hidden') === 'true' || mainNav.style.display === 'none';
      setNavOpen(isHidden);
    });
  }

  // ---- FORCE .md LINKS TO NAVIGATE (fixes some browsers/overlays) ----
  qsa('a[href$=".md"]').forEach(a=>{
    a.addEventListener('click', e=>{
      // allow local navigation: ensure link opens as a top-level navigation
      e.preventDefault();
      const href = a.getAttribute('href');
      // relative links should work; use location.assign to keep history
      window.location.assign(href);
    });
  });

  // ---- SMOOTH SCROLL FOR IN-PAGE LINKS ----
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  });

  // ---- PARTICLE BACKGROUND ----
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  let DPR = Math.max(1, window.devicePixelRatio || 1);
  let w = window.innerWidth;
  let h = window.innerHeight;

  function setupCanvas(){
    DPR = Math.max(1, window.devicePixelRatio || 1);
    w = Math.max(320, window.innerWidth);
    h = Math.max(240, window.innerHeight);

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);

    // reset transform and scale for DPR
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  setupCanvas();

  // adaptive particle count
  let PARTICLE_COUNT = Math.max(26, Math.floor((w*h)/90000));
  const particles = [];
  function initParticles(){
    particles.length = 0;
    for(let i=0;i<PARTICLE_COUNT;i++){
      particles.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-0.5)*0.3,
        vy: (Math.random()-0.5)*0.3,
        r: 0.6 + Math.random()*2.2,
        alpha: 0.05 + Math.random()*0.9
      });
    }
  }
  initParticles();

  // orbit nodes around logo (dist will be adapted later)
  const orbitNodes = [
    {label:'Consciousness', angle: -0.9, dist: 220},
    {label:'Governance', angle: 0.6, dist: 220},
    {label:'Identity', angle: 2.0, dist: 220}
  ];

  // logo plate element fallback
  const logoPlate = document.getElementById('logo-plate');
  const heroCard = document.querySelector('.hero-card');

  let t = 0;
  function resize(){
    setupCanvas();
    // adapt particle count if viewport changed a lot
    const newCount = Math.max(26, Math.floor((w*h)/90000));
    if(newCount !== PARTICLE_COUNT){
      PARTICLE_COUNT = newCount;
      initParticles();
    }
  }
  window.addEventListener('resize', resize);

  function draw(){
    t += 0.012;
    ctx.clearRect(0,0,w,h);

    // gentle vignette
    const gx = w*0.5, gy = h*0.45;
    const g = ctx.createRadialGradient(gx, gy, Math.min(w,h)*0.18, gx, gy, Math.max(w,h));
    g.addColorStop(0, 'rgba(6,18,22,0.0)');
    g.addColorStop(1, 'rgba(2,6,10,0.65)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    // draw particles
    for(let p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -60) p.x = w + 60;
      if(p.x > w + 60) p.x = -60;
      if(p.y < -60) p.y = h + 60;
      if(p.y > h + 60) p.y = -60;

      ctx.beginPath();
      ctx.fillStyle = `rgba(150,220,255,${0.08 * p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }

    // compute center for hero/logo (fallbacks included)
    let cx = w/2, cy = Math.max(h*0.22, h*0.28);
    let logoSize = 120;
    if(logoPlate && logoPlate.getBoundingClientRect){
      const rect = logoPlate.getBoundingClientRect();
      cx = rect.left + rect.width/2;
      cy = rect.top + rect.height/2;
      logoSize = Math.max(60, Math.min(rect.width, rect.height));
    } else if(heroCard && heroCard.getBoundingClientRect){
      const rect = heroCard.getBoundingClientRect();
      cx = rect.left + rect.width/2;
      cy = rect.top + rect.height*0.35;
      logoSize = Math.max(60, Math.min(rect.width*0.35, rect.height*0.35));
    }

    // soft rings behind hero logo
    ctx.globalCompositeOperation = 'lighter';
    for(let i=1;i<=3;i++){
      ctx.beginPath();
      const alpha = Math.max(0.02, 0.06/(i*0.6));
      ctx.strokeStyle = `rgba(100,200,255,${alpha})`;
      ctx.lineWidth = 14 + (6*i);
      ctx.arc(cx, cy, (logoSize*0.9) + i*28 + Math.sin(t*1.2 + i)*6, 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';

    // subtle floating particles closer to logo
    for(let i=0;i<6;i++){
      const px = cx + Math.cos(t*0.8 + i)* (logoSize*0.9 + 30 + i*6);
      const py = cy + Math.sin(t*1.1 + i*0.6)* (logoSize*0.45 + i*4);
      ctx.beginPath();
      ctx.fillStyle = `rgba(170,230,255,${0.06 + i*0.01})`;
      ctx.arc(px, py, 1.2 + (i%3), 0, Math.PI*2);
      ctx.fill();
    }

    // orbiting nodes labels
    ctx.save();
    ctx.font = '13px Inter, system-ui, Arial, sans-serif';
    ctx.fillStyle = 'rgba(200,230,255,0.94)';
    ctx.textAlign = 'center';
    orbitNodes.forEach((n,i)=>{
      // adapt distance based on viewport
      const baseDist = Math.min(Math.max(w, h)*0.18, 260);
      n.dist = baseDist + (i*12);
      const ang = n.angle + t*0.35 + i*0.6;
      const x = cx + Math.cos(ang) * n.dist;
      const y = cy + Math.sin(ang) * n.dist*0.6;
      // glowing connector
      ctx.beginPath();
      ctx.strokeStyle = `rgba(120,200,255,${0.06 + i*0.02})`;
      ctx.lineWidth = 1.2;
      ctx.moveTo(cx + Math.cos(ang)* (logoSize*0.6), cy + Math.sin(ang)*(logoSize*0.5));
      ctx.lineTo(x, y);
      ctx.stroke();

      // small node dot
      ctx.beginPath();
      ctx.fillStyle = 'rgba(120,200,255,0.98)';
      ctx.arc(x, y, 4 + (i%2), 0, Math.PI*2);
      ctx.fill();

      // label
      ctx.fillStyle = 'rgba(200,230,255,0.95)';
      ctx.fillText(n.label, x + Math.cos(ang)*16, y + Math.sin(ang)*12);
    });
    ctx.restore();

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // ---- KEYBOARD SHORTCUTS ----
  document.addEventListener('keyup', e=>{
    if(e.key === 'm' || e.key === 'M'){
      if(menuToggle) menuToggle.click();
    }
  });

  // ---- ENSURE CANVAS ADAPTS AFTER LAYOUT CHANGES ----
  const ro = new ResizeObserver(() => resize());
  ro.observe(document.body);

  // ---- DEBUG ----
  console.log('QuantumKey visual engine loaded (enhanced script)');
})();
// script.js — pequeno utilitário
document.addEventListener('DOMContentLoaded', () => {
  const hh = document.querySelector('.hamburger');
  if(hh){
    hh.addEventListener('click', ()=>{
      document.body.classList.toggle('menu-open');
      // abre/fecha menu — podes criar painel mais tarde
    });
  }

  // pequenas melhorias: se o poster for muito alto, garantir que cabe
  const poster = document.querySelector('.hero-preview');
  if(poster){
    poster.style.maxHeight = (window.innerHeight * 0.58) + 'px';
  }

  // anima label quando tocar (apenas visual)
  const labels = document.querySelectorAll('.orbit-label');
  labels.forEach(l => {
    l.addEventListener('touchstart', ()=> {
      l.style.transform = 'scale(1.06)';
      setTimeout(()=> l.style.transform = '', 300);
    });
  });
});
