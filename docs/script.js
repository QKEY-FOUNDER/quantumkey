// script.js - paste completo

// menu toggle
document.addEventListener('DOMContentLoaded', ()=> {
  const html = document.documentElement;
  // cria botão se não existir
  let toggle = document.querySelector('.menu-toggle');
  if(!toggle){
    toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.innerHTML = '☰';
    document.querySelector('.site-header')?.appendChild(toggle);
  }
  toggle.addEventListener('click', ()=> {
    document.body.classList.toggle('nav-open');
    toggle.classList.toggle('open');
    // simples fallback: desloca header links
    const nav = document.querySelector('.nav');
    if(nav) nav.classList.toggle('open');
  });

  // reveal on scroll
  const reveals = document.querySelectorAll('.fade-up');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('in');
    })
  },{threshold:0.12});
  reveals.forEach(r=>obs.observe(r));

  // smooth anchor scroll for CTA links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });

  // small particle background - lightweight
  const panel = document.createElement('canvas');
  panel.style.position='fixed';
  panel.style.left='0';
  panel.style.top='0';
  panel.style.zIndex='0';
  panel.style.pointerEvents='none';
  panel.width = innerWidth;
  panel.height = innerHeight;
  document.body.appendChild(panel);
  const ctx = panel.getContext('2d');
  let parts=[];
  function initParts(){
    parts = Array.from({length:32}, ()=>{
      return {
        x: Math.random()*panel.width,
        y: Math.random()*panel.height,
        r: Math.random()*1.5+0.2,
        vx: (Math.random()-0.5)*0.2,
        vy: (Math.random()-0.5)*0.2,
        a: Math.random()*0.9+0.1
      }
    })
  }
  initParts();
  function frame(){
    ctx.clearRect(0,0,panel.width,panel.height);
    for(let p of parts){
      p.x += p.vx; p.y += p.vy;
      if(p.x<0) p.x = panel.width;
      if(p.x>panel.width) p.x = 0;
      if(p.y<0) p.y = panel.height;
      if(p.y>panel.height) p.y = 0;
      ctx.beginPath();
      ctx.globalAlpha = p.a * 0.9;
      ctx.fillStyle = 'rgba(120,200,255,0.12)';
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  frame();

  // resize canvas
  addEventListener('resize', ()=>{
    panel.width = innerWidth;
    panel.height = innerHeight;
    initParts();
  });

});
