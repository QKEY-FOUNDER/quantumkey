// script.js — lightweight interactions and particle background
// Author: generated for QKEY-FOUNDER

document.addEventListener('DOMContentLoaded', function () {
  // MENU (mobile)
  const menuBtn = document.getElementById('menu-btn');
  let open = false;
  menuBtn && menuBtn.addEventListener('click', () => {
    open = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    // For now we just toggle a simple class for potential panel expansion
    document.body.classList.toggle('menu-open', open);
    // you can implement a slide-in menu here if desired
  });

  // Simple particle background (canvas) — lightweight
  const canvas = document.getElementById('particles');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles = [];
    const N = Math.floor(Math.max(30, (w*h) / 120000)); // density scales with screen

    function rand(min, max){ return Math.random()*(max-min)+min; }

    for (let i=0;i<N;i++){
      particles.push({
        x: rand(0,w),
        y: rand(0,h),
        r: rand(0.4,1.6),
        vx: rand(-0.2,0.2),
        vy: rand(-0.15,0.15),
        alpha: rand(0.05,0.22)
      });
    }

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);

    function draw(){
      ctx.clearRect(0,0,w,h);
      // subtle vignette with dark overlay is handled by SVG/background — keep particles faint
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

  // fix for image poster sizing: ensure poster-thumb uses natural svg sizing
  const poster = document.querySelector('.poster-thumb');
  if (poster) {
    poster.addEventListener('error', ()=> {
      // fallback if svg path missing
      poster.style.display = 'none';
    });
  }

});
