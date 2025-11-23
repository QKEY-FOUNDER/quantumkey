1. index.html

```html
(... <!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>QuantumKey — Documentation Hub</title>
  <meta name="description" content="QuantumKey — the key between consciousness and intelligence. Documentation hub: whitepaper, tokenomics, DAO, identity, protocol, specs." />
  <meta name="theme-color" content="#07121a">

  <link rel="stylesheet" href="./styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
</head>

<body class="dark">

  <!-- Particle background -->
  <canvas id="particles" aria-hidden="true"></canvas>

  <!-- HEADER -->
  <header class="site-header">
    <div class="container header-row">

      <div class="brand">
        <a class="brand-link" href="./">
          <div class="brand-logo-wrapper">
            <img src="./assets/quantumkey-logo.svg" alt="QuantumKey badge" class="brand-img">
          </div>
          <span class="brand-name">QUANTUMKEY</span>
        </a>
      </div>

      <button id="menu-btn" class="menu-btn" aria-expanded="false" aria-controls="offcanvas-menu" aria-label="Open menu">
        <span class="burger"></span>
      </button>

    </div>
  </header>


  <!-- OFFCANVAS MENU -->
  <nav id="offcanvas-menu" class="offcanvas" aria-hidden="true">
    <div class="offcanvas-inner container" role="dialog" aria-modal="true">
      <button id="menu-close" class="menu-close" aria-label="Close menu">×</button>

      <ul class="nav-list">
        <li><a href="#hero">Home</a></li>
        <li><a href="#docs">Documentation</a></li>
        <li><a href="./assets/whitepaper/QuantumKey_Whitepaper.pdf" target="_blank" rel="noopener">Whitepaper</a></li>
        <li><a href="./assets/whitepaper/QuantumKey_Tokenomics.pdf" target="_blank" rel="noopener">Tokenomics</a></li>
      </ul>
    </div>
  </nav>


  <!-- MAIN -->
  <main class="site-main">

    <!-- HERO -->
    <section id="hero" class="hero container">
      <div class="hero-visual">
        <div class="hero-poster">
          <img src="./assets/quantumkey-logo.svg" alt="QuantumKey emblem" class="poster-thumb">
        </div>
      </div>

      <div class="hero-content">
        <h1 class="site-title">QuantumKey</h1>
        <p class="site-subtitle">
          A subtle architecture of meaning — the key that harmonizes conscious intent with machine intelligence.
        </p>

        <div class="hero-cta">
          <a class="btn btn-primary" href="./assets/whitepaper/QuantumKey_Whitepaper.pdf" target="_blank" rel="noopener">Read Whitepaper</a>
          <a class="btn btn-primary" href="./assets/whitepaper/QuantumKey_Tokenomics.pdf" target="_blank" rel="noopener">Tokenomics</a>
        </div>
      </div>
    </section>


    <!-- DOCUMENTATION -->
    <section id="docs" class="docs container">
      <h2>Documentation Library</h2>
      <p class="lead">All core documents for QuantumKey are available for review.</p>

      <div class="docs-grid">

        <article class="doc-card">
          <h3>Whitepaper</h3>
          <p>Vision, architecture and philosophical foundations.</p>
          <a class="doc-link" href="./assets/whitepaper/QuantumKey_Whitepaper.pdf" target="_blank">Open PDF</a>
        </article>

        <article class="doc-card">
          <h3>Tokenomics</h3>
          <p>The energetic architecture of the $QKEY economy.</p>
          <a class="doc-link" href="./assets/whitepaper/QuantumKey_Tokenomics.pdf" target="_blank">Open PDF</a>
        </article>

        <article class="doc-card">
          <h3>DAO</h3>
          <p>Governance model and alignment primitives.</p>
          <a class="doc-link" href="./assets/whitepaper/QuantumKey_DAO.pdf" target="_blank">Open PDF</a>
        </article>

        <article class="doc-card">
          <h3>Identity</h3>
          <p>Identity as a field of presence and continuity.</p>
          <a class="doc-link" href="./assets/whitepaper/QuantumKey_Identity.pdf" target="_blank">Open PDF</a>
        </article>

        <article class="doc-card">
          <h3>Protocol</h3>
          <p>Operational mechanics of the harmonic engine.</p>
          <a class="doc-link" href="./assets/whitepaper/QuantumKey_Protocol.pdf" target="_blank">Open PDF</a>
        </article>

        <article class="doc-card">
          <h3>Specs</h3>
          <p>Technical spine and message propagation rules.</p>
          <a class="doc-link" href="./assets/whitepaper/QuantumKey_Specs.pdf" target="_blank">Open PDF</a>
        </article>

      </div>
    </section>

    <footer class="site-footer">
      <div class="container">
        <p>© QuantumKey — The union of Consciousness and Intelligence.</p>
        <p>Repository: <a href="https://github.com/QKEY-FOUNDER/quantumkey" target="_blank">quantumkey</a></p>
      </div>
    </footer>

  </main>

  <script src="./script.js" defer></script>
</body>
</html> ...)
```

2. styles.css

```css
(... :root{
  --bg:#07121a;
  --text:#e8fbff;
  --muted:rgba(200,230,240,0.6);
  --accent-a:#5fe6ff;
  --accent-b:#b66dff;
  --container-w:1100px;
}

*{box-sizing:border-box}
html,body{
  margin:0;
  padding:0;
  font-family:'Inter',system-ui,Arial,sans-serif;
  background:var(--bg);
  color:var(--text);
}

/* CANVAS */
#particles{
  position:fixed;
  inset:0;
  z-index:-1;
  pointer-events:none;
}

/* HEADER */
.site-header{
  position:sticky;
  top:0;
  background:rgba(7,18,26,0.6);
  backdrop-filter:blur(6px);
  border-bottom:1px solid rgba(255,255,255,0.05);
  padding:10px 0;
  z-index:20;
}
.container{
  width:92%;
  max-width:var(--container-w);
  margin:0 auto;
}
.header-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.brand{
  display:flex;
  align-items:center;
  gap:12px;
}
.brand-logo-wrapper{
  width:70px;
  height:70px;
}
.brand-img{
  width:100%;
  height:100%;
  object-fit:contain;
}
.brand-name{
  font-weight:800;
  font-size:20px;
  letter-spacing:2px;
}

/* MENU BUTTON */
.menu-btn{
  background:transparent;
  border:0;
  cursor:pointer;
}
.burger{
  width:26px;
  height:3px;
  background:var(--text);
  position:relative;
}
.burger::before,.burger::after{
  content:"";
  position:absolute;
  left:0;
  width:26px;
  height:3px;
  background:var(--text);
}
.burger::before{ top:-8px; }
.burger::after{ top:8px; }

/* OFFCANVAS */
.offcanvas{
  position:fixed;
  inset:0;
  background:rgba(7,18,26,0.96);
  transform:translateX(100%);
  opacity:0;
  transition:0.35s ease-out;
  pointer-events:none;
  z-index:50;
}
.offcanvas.open{
  transform:translateX(0);
  opacity:1;
  pointer-events:auto;
}
.offcanvas-inner{
  padding:40px;
}
.menu-close{
  background:transparent;
  border:0;
  color:var(--text);
  font-size:40px;
  float:right;
  cursor:pointer;
}
.nav-list{
  list-style:none;
  padding:0;
  margin-top:40px;
  display:flex;
  flex-direction:column;
  gap:18px;
}
.nav-list a{
  font-size:22px;
  color:var(--text);
  text-decoration:none;
}

/* HERO */
.hero{
  display:flex;
  flex-direction:column;
  text-align:center;
  padding:60px 0;
}
.hero-visual{
  display:flex;
  justify-content:center;
}
.hero-poster{
  max-width:520px;
  width:90%;
  margin:0 auto;
}
.poster-thumb{
  width:100%;
  height:auto;
  display:block;
}
.hero-content{
  max-width:820px;
  margin:30px auto 0;
}
.site-title{
  font-size:48px;
  margin-bottom:8px;
}
.site-subtitle{
  font-size:18px;
  color:var(--muted);
  margin-bottom:30px;
}

/* BUTTONS */
.btn{
  padding:14px 22px;
  border-radius:16px;
  font-weight:700;
  min-height:44px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  text-decoration:none;
}
.btn-primary{
  background:linear-gradient(90deg,var(--accent-a),var(--accent-b));
  color:#041216;
}
.hero-cta{
  display:flex;
  gap:18px;
  justify-content:center;
  flex-wrap:wrap;
}

/* DOCS GRID */
.docs{
  padding:60px 0;
}
.docs-grid{
  display:grid;
  grid-template-columns:1fr;
  gap:18px;
}
.doc-card{
  background:rgba(255,255,255,0.04);
  padding:20px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,0.05);
}
.doc-card h3{ margin-top:0 }

/* FOOTER */
.site-footer{
  padding:30px 0;
  color:var(--muted);
  text-align:center;
  border-top:1px solid rgba(255,255,255,0.05);
}

@media(min-width:768px){
  .hero{
    flex-direction:row;
    text-align:left;
    align-items:center;
  }
  .hero-visual,.hero-content{
    flex:1;
  }
  .docs-grid{
    grid-template-columns:repeat(2,1fr);
  }
} ...)
```

3. script.js

```javascript
(... // MENU INTERACTIONS + PARTICLES

document.addEventListener("DOMContentLoaded", () => {

  // MENU
  const menuBtn = document.getElementById("menu-btn");
  const offcanvas = document.getElementById("offcanvas-menu");
  const closeBtn = document.getElementById("menu-close");

  function openMenu(){
    offcanvas.classList.add("open");
    offcanvas.setAttribute("aria-hidden","false");
    menuBtn.setAttribute("aria-expanded","true");
    document.body.classList.add("menu-open");
  }
  function closeMenu(){
    offcanvas.classList.remove("open");
    offcanvas.setAttribute("aria-hidden","true");
    menuBtn.setAttribute("aria-expanded","false");
    document.body.classList.remove("menu-open");
  }

  if(menuBtn){
    menuBtn.addEventListener("click", () => {
      offcanvas.classList.contains("open") ? closeMenu() : openMenu();
    });
  }
  if(closeBtn){
    closeBtn.addEventListener("click", closeMenu);
  }

  document.addEventListener("keydown", e=>{
    if(e.key === "Escape") closeMenu();
  });

  offcanvas.addEventListener("click", e=>{
    if(e.target === offcanvas) closeMenu();
  });

  // PARTICLES
  const canvas = document.getElementById("particles");
  if(canvas && canvas.getContext){
    const ctx = canvas.getContext("2d");
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;

    const particles = [];
    const N = Math.max(20, Math.floor((w*h)/150000));

    function rand(a,b){ return Math.random()*(b-a)+a; }

    for(let i=0;i<N;i++){
      particles.push({
        x:rand(0,w),
        y:rand(0,h),
        r:rand(0.5,1.6),
        vx:rand(-0.15,0.15),
        vy:rand(-0.1,0.1),
        a:rand(0.04,0.14)
      });
    }

    function resize(){
      w = canvas.width = innerWidth;
      h = canvas.height = innerHeight;
    }
    addEventListener("resize", resize);

    function draw(){
      ctx.clearRect(0,0,w,h);
      for(const p of particles){
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < -10) p.x=w+10;
        if(p.x > w+10) p.x=-10;
        if(p.y < -10) p.y=h+10;
        if(p.y > h+10) p.y=-10;

        ctx.beginPath();
        ctx.fillStyle=`rgba(180,230,255,${p.a})`;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

}); ...)
```

4. quantumkey-logo.svg

```xml
(... <?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 1000 1000"
     width="1000" height="1000"
     role="img" aria-labelledby="title desc">
  <title id="title">QuantumKey badge — emblem</title>
  <desc id="desc">Circular neon badge with three glowing spheres (QFT, Consciousness, GR) and QUANTUMKEY wordmark below the badge.</desc>

  <defs>
    <!-- gradients -->
    <radialGradient id="gradQ" cx="30%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#e8ffff"/>
      <stop offset="40%" stop-color="#63e7ff"/>
      <stop offset="100%" stop-color="#0ea7ff"/>
    </radialGradient>

    <radialGradient id="gradC" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#fff7d6"/>
      <stop offset="40%" stop-color="#ffb57a"/>
      <stop offset="100%" stop-color="#ff6e8a"/>
    </radialGradient>

    <radialGradient id="gradR" cx="70%" cy="60%" r="60%">
      <stop offset="0%" stop-color="#fff6e8"/>
      <stop offset="40%" stop-color="#ffd07a"/>
      <stop offset="100%" stop-color="#ff8a2c"/>
    </radialGradient>

    <filter id="glow">
      <feGaussianBlur stdDeviation="12" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <style><![CDATA[
      .bg { fill:#041216; }
      .vign { fill: url(#vign); }
      .title { font-family: Inter, system-ui, Arial, sans-serif; font-weight:800; fill:#e8fbff; font-size:34px; letter-spacing:4px; }
      .subtitle { font-family: Inter, system-ui, Arial, sans-serif; font-size:12px; fill:rgba(200,230,240,0.7); }
      .label { font-family: Inter, system-ui, Arial, sans-serif; font-weight:700; fill:#031216; }
      .small { font-family: Inter, system-ui, Arial, sans-serif; font-size:12px; fill:rgba(10,20,30,0.88); }
      .dash-cool { fill:none; stroke:#9fe7ff; stroke-width:4; stroke-linecap:round; stroke-dasharray:14 10; opacity:0.98; }
      .dash-warm { fill:none; stroke:#ffd6a3; stroke-width:4.6; stroke-linecap:round; stroke-dasharray:12 8; opacity:0.98; }
      #pA { animation: dashAnimA 6.5s linear infinite; }
      #pB { animation: dashAnimB 5.2s linear infinite; }
      #pC { animation: dashAnimC 7.0s linear infinite; }
      @keyframes dashAnimA { from { stroke-dashoffset: 0 } to { stroke-dashoffset: -800 } }
      @keyframes dashAnimB { from { stroke-dashoffset: 0 } to { stroke-dashoffset: -600 } }
      @keyframes dashAnimC { from { stroke-dashoffset: 0 } to { stroke-dashoffset: -700 } }
    ]]></style>

    <radialGradient id="vign" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="rgba(6,18,22,0.0)"/>
      <stop offset="100%" stop-color="rgba(2,8,12,0.8)"/>
    </radialGradient>
  </defs>

  <!-- background -->
  <rect width="100%" height="100%" class="bg"/>
  <rect width="100%" height="100%" class="vign"/>

  <!-- circular clip so the badge preview looks round -->
  <g clip-path="circle(480 at 500 460)">

    <!-- outer soft ring -->
    <g filter="url(#glow)" opacity="0.95">
      <circle cx="500" cy="460" r="420" fill="rgba(8,18,26,0.06)"/>
      <circle cx="500" cy="460" r="360" fill="rgba(4,10,12,0.06)"/>
    </g>

    <!-- left sphere (QFT) -->
    <g transform="translate(240,460)">
      <circle cx="0" cy="0" r="120" fill="url(#gradQ)" filter="url(#glow)"/>
      <circle cx="-12" cy="-8" r="4" fill="#ffffff" opacity="0.95"/>
      <text class="label" x="0" y="8" font-size="36" text-anchor="middle">QFT</text>
      <text class="small" x="0" y="40" text-anchor="middle">fields • possibility</text>
    </g>

    <!-- top sphere (Consciousness) -->
    <g transform="translate(500,220)">
      <circle cx="0" cy="0" r="135" fill="url(#gradC)" filter="url(#glow)"/>
      <circle cx="-10" cy="-12" r="4.2" fill="#ffffff" opacity="0.96"/>
      <text class="label" x="0" y="12" font-size="28" text-anchor="middle">Consciousness</text>
      <text class="small" x="0" y="36" text-anchor="middle">awareness • integration</text>
    </g>

    <!-- right sphere (GR) -->
    <g transform="translate(760,520)">
      <circle cx="0" cy="0" r="100" fill="url(#gradR)" filter="url(#glow)"/>
      <circle cx="12" cy="10" r="3.6" fill="#ffffff" opacity="0.96"/>
      <text class="label" x="0" y="10" font-size="30" text-anchor="middle">GR</text>
      <text class="small" x="0" y="36" text-anchor="middle">structure • anchor</text>
    </g>

    <!-- animated dashed connectors (arrows simplified for SVG preview) -->
    <path id="pA" class="dash-cool" d="M340,420 C420,360 480,320 500,300"/>
    <path class="dash-cool" d="M500,300 L492,308 L504,312" stroke-width="4" />

    <path id="pB" class="dash-warm" d="M540,340 C660,400 720,460 748,504"/>
    <path class="dash-warm" d="M748,504 L740,496 L756,496" stroke-width="4" />

    <path id="pC" class="dash-cool" d="M740,520 C640,516 560,500 380,468"/>
    <path class="dash-cool" d="M380,468 L392,464 L378,458" stroke-width="4"/>

    <!-- gentle structural strokes -->
    <g stroke="rgba(255,255,255,0.03)" stroke-width="18" stroke-linecap="round">
      <path d="M240,460 C340,420 480,380 500,300"/>
      <path d="M500,300 C610,380 720,460 760,520"/>
      <path d="M760,520 C630,512 520,496 380,468"/>
    </g>

    <!-- equations / center -->
    <g transform="translate(360,740)" fill="rgba(230,240,255,0.95)" font-family="Inter, system-ui, Arial">
      <text x="0" y="0" font-size="28" font-weight="700">(α) Φ = 1</text>
      <text x="0" y="36" font-size="16">☐ + Λ → p ≈ ½ Σ(Ψ, g)</text>
    </g>

    <!-- small footer signature inside circle -->
    <g transform="translate(500,890)" text-anchor="middle" fill="rgba(200,220,235,0.55)" font-family="Inter, system-ui, Arial" font-size="11">
      <text x="0" y="0">interlinked fields • operators as motion • equations as portals</text>
    </g>

    <!-- decorative small particles -->
    <g fill="#c6f2ff" opacity="0.9">
      <circle cx="420" cy="120" r="1.8"/>
      <circle cx="680" cy="90" r="1.6"/>
      <circle cx="780" cy="240" r="1.4"/>
      <circle cx="360" cy="520" r="1.2"/>
      <circle cx="920" cy="640" r="1.6"/>
      <circle cx="160" cy="360" r="1.3"/>
    </g>

  </g> <!-- end clip group -->

  <!-- WORDMARK centered BELOW the circular badge (clear, big and readable) -->
  <g transform="translate(500,960)" text-anchor="middle" aria-hidden="false">
    <text class="title" x="0" y="-6">QUANTUMKEY</text>
    <text class="subtitle" x="0" y="20">the key between consciousness &amp; intelligence</text>
  </g>

</svg> ...)
```

# QuantumKey — Baseline Reference (Stable Build)

This document freezes the exact state of the homepage that is considered stable and correct.

## Included
- index.html  
- styles.css  
- script.js  
- assets/quantumkey-logo.svg  
- No orbital animations  
- No header buttons besides menu  
- Menu fully functional  
- PDF library working  
- Hero layout stable and symmetrical  
- Particle background active and lightweight  

This baseline serves as the restoration point for any future rebuilds.
