// docs/script.js
// Versão robusta: orbita com texto horizontal, fallback para inline SVG se <img> falhar,
// centralização precisa do eixo no centro do poster, menu off-canvas permanece intacto.

(() => {
  'use strict';

  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // CONFIG
  const LABELS = ['Governance', 'Identity', 'Consciousness'];
  const ROTATION_SPEED_DEG_PER_SEC = 14; // degrees per second for each full wrapper revolution (lower = slower)
  const EXTRA_RADIUS_FACTOR = 0.22; // quanto maior, mais afastadas as labels do poster
  const MIN_RADIUS = 80;
  const MAX_VIEWPORT_FRACTION = 0.7; // maximum radius relative to viewport

  // DOM elements
  let orbitWrap = document.getElementById('orbit-wrap');
  if (!orbitWrap) {
    orbitWrap = document.createElement('div');
    orbitWrap.id = 'orbit-wrap';
    document.body.appendChild(orbitWrap);
    orbitWrap.style.position = 'fixed';
    orbitWrap.style.pointerEvents = 'none';
    orbitWrap.style.zIndex = '35';
  }

  // Fallback: ensure header stays above overlays
  const header = document.querySelector('.site-header');
  if (header) header.style.zIndex = 60;

  // Find poster (many fallbacks)
  function findPosterElement() {
    return (
      document.getElementById('poster-thumb') ||
      document.querySelector('.poster-img') ||
      document.querySelector('.hero img') ||
      document.querySelector('img[src*="quantumkey-logo"]') ||
      document.querySelector('img')
    );
  }

  // Ensure poster exists; returns the element or null
  let poster = findPosterElement();

  // If poster is <img>, attach error handler and load handler
  function ensurePosterLoadHandling(p) {
    if (!p) return;
    if (p.tagName && p.tagName.toLowerCase() === 'img') {
      p.addEventListener('error', async () => {
        // Try to fetch the SVG and inline it (works on same origin like GitHub Pages)
        try {
          const src = p.getAttribute('src');
          if (!src) return;
          const res = await fetch(src);
          if (!res.ok) return;
          const txt = await res.text();
          // crude check if it's an SVG
          if (txt.trim().startsWith('<svg')) {
            const container = document.createElement('div');
            container.innerHTML = txt;
            const svg = container.querySelector('svg');
            if (svg) {
              // preserve id so positioning still works: set id="poster-thumb"
              svg.id = 'poster-thumb';
              svg.classList.add('poster-img');
              // replace the <img> with inline svg
              p.replaceWith(svg);
              poster = svg;
              observePosterSize(poster);
              scheduleCompute();
            }
          }
        } catch (e) {
          console.warn('Inline SVG fallback failed:', e);
        }
      }, { once: true });

      // if already loaded, ensure observation
      if (p.complete) {
        observePosterSize(p);
      } else {
        p.addEventListener('load', () => observePosterSize(p), { once: true });
      }
    } else {
      // if poster is not <img> (maybe inline svg already), observe it
      observePosterSize(p);
    }
  }

  // create orbit labels
  function createLabels() {
    // remove existing labels (for safe re-init)
    orbitWrap.innerHTML = '';
    orbitWrap.style.setProperty('--orbit-radius', '220px');

    LABELS.forEach((txt, i) => {
      const lbl = document.createElement('div');
      lbl.className = 'orbit-label';
      // store base angle (degrees)
      const baseAngle = 360 * (i / LABELS.length);
      lbl.dataset.baseAngle = String(baseAngle);

      // make label accessible for touch (pointer-events auto on label)
      lbl.style.pointerEvents = 'auto';

      // inner span holds visible text and will counter-rotate
      const span = document.createElement('span');
      span.textContent = txt;
      lbl.appendChild(span);

      orbitWrap.appendChild(lbl);
    });
  }

  // observes poster size changes for responsive adjustments
  let posterResizeObserver = null;
  function observePosterSize(el) {
    try {
      if (posterResizeObserver) posterResizeObserver.disconnect();
      posterResizeObserver = new ResizeObserver(() => scheduleCompute());
      posterResizeObserver.observe(el);
    } catch (e) {
      // ResizeObserver not supported -> fall back to window resize
    }
  }

  // compute center of poster and radius
  let lastCompute = 0;
  let cached = { centerX: 0, centerY: 0, radius: 220 };

  function computeOrbitParameters() {
    poster = poster || findPosterElement();
    if (!poster) return cached;

    const rect = poster.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return cached;

    // center coordinates in viewport (client)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // compute radius: half of larger dimension plus extra breathing room
    const base = Math.max(rect.width, rect.height) / 2;
    const extra = Math.max(48, base * EXTRA_RADIUS_FACTOR);
    let radius = Math.round(base + extra);

    // clamp radius to viewport fraction
    const maxAllowed = Math.round(Math.max(window.innerWidth, window.innerHeight) * MAX_VIEWPORT_FRACTION);
    radius = Math.max(MIN_RADIUS, Math.min(radius, maxAllowed));

    cached = { centerX, centerY, radius };
    return cached;
  }

  // position orbitWrap exactly at poster center (fixed positioning)
  function positionOrbitWrap() {
    const { centerX, centerY } = computeOrbitParameters();
    orbitWrap.style.left = `${Math.round(centerX)}px`;
    orbitWrap.style.top = `${Math.round(centerY)}px`;
    orbitWrap.style.transform = 'translate(-50%,-50%)';
  }

  // animation loop for labels: uses requestAnimationFrame for smoothness
  let running = false;
  let startTs = null;

  function animateLabels(ts) {
    if (!startTs) startTs = ts;
    const elapsed = (ts - startTs) / 1000; // seconds

    // compute fresh params
    const { radius } = computeOrbitParameters();
    orbitWrap.style.setProperty('--orbit-radius', `${radius}px`);

    // rotation amount in degrees (we'll advance all labels by the same global offset)
    // We want a full 360deg rotation in ROTATION_SPEED_DEG_PER_SEC? The name is deg per sec; better: degrees per second = 360 / period.
    // Let's interpret ROTATION_SPEED_DEG_PER_SEC as degrees/second global.
    const globalDeg = (ROTATION_SPEED_DEG_PER_SEC * elapsed) % 360;

    const labels = orbitWrap.querySelectorAll('.orbit-label');
    labels.forEach((el, i) => {
      const base = parseFloat(el.dataset.baseAngle || (360 * (i / labels.length)));
      const angle = (base + globalDeg) % 360;

      // set transform so the label orbits: rotate(angle) translateX(radius)
      el.style.transform = `rotate(${angle}deg) translateX(${radius}px)`;
      // inner text must stay horizontal: counter-rotate by same angle
      const span = el.querySelector('span');
      if (span) span.style.transform = `rotate(${-angle}deg)`;
    });

    // keep orbitWrap positioned accurately in case of scroll/resize
    positionOrbitWrap();

    if (running) requestAnimationFrame(animateLabels);
  }

  function startAnimation() {
    if (running) return;
    running = true;
    startTs = null;
    requestAnimationFrame(animateLabels);
  }
  function stopAnimation() {
    running = false;
  }

  // debounced compute
  let computeScheduled = false;
  function scheduleCompute() {
    if (computeScheduled) return;
    computeScheduled = true;
    requestAnimationFrame(() => {
      computeScheduled = false;
      positionOrbitWrap();
      // and restart animation baseline to avoid jumpiness
      if (!running) startAnimation();
    });
  }

  // Attach global listeners to re-compute when necessary
  window.addEventListener('resize', scheduleCompute, { passive: true });
  window.addEventListener('orientationchange', scheduleCompute, { passive: true });
  window.addEventListener('scroll', scheduleCompute, { passive: true });

  // If poster added later, watch DOM
  (function watchForPosterInsertion() {
    if (poster) return;
    const mo = new MutationObserver(() => {
      poster = findPosterElement();
      if (poster) {
        ensurePosterLoadHandling(poster);
        createAndStart();
        mo.disconnect();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  })();

  // Menu logic (lightweight) — keep existing offcanvas behavior intact
  const menuBtn = $('#menu-btn');
  const offcanvas = $('#offcanvas-menu');
  const menuClose = $('#menu-close');

  function openMenu() {
    document.body.classList.add('menu-open');
    if (offcanvas) offcanvas.classList.add('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    if (offcanvas) offcanvas.setAttribute('aria-hidden', 'false');
    scheduleCompute();
  }
  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (offcanvas) offcanvas.classList.remove('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (offcanvas) offcanvas.setAttribute('aria-hidden', 'true');
    scheduleCompute();
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', e => {
      e.preventDefault();
      const exp = menuBtn.getAttribute('aria-expanded') === 'true';
      if (exp) closeMenu(); else openMenu();
    });
  }
  if (menuClose) menuClose.addEventListener('click', e => { e.preventDefault(); closeMenu(); });

  // close on outside click
  document.addEventListener('click', e => {
    if (!offcanvas) return;
    if (!offcanvas.classList.contains('open')) return;
    if (!offcanvas.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // initialise everything
  function createAndStart() {
    poster = poster || findPosterElement();
    if (!poster) {
      // no poster yet, will wait for mutation observer
      return;
    }
    // ensure load/error handling and observing size
    ensurePosterLoadHandling(poster);

    // create labels and start animation
    createLabels();
    scheduleCompute();
    startAnimation();
  }

  // first attempt
  poster = poster || findPosterElement();
  if (poster) {
    ensurePosterLoadHandling(poster);
    createAndStart();
  } else {
    // will be created by mutation observer above
    createLabels();
    startAnimation();
  }

  // Expose small debug API
  window.__QKEY = window.__QKEY || {};
  window.__QKEY.orbit = {
    scheduleCompute,
    computeOrbitParameters,
    startAnimation,
    stopAnimation,
    orbitWrap
  };

})();

// docs/script.js
// Orbital labels + menu controller for QuantumKey
// Integrated final version — replace existing script.js

(() => {
  // --- Utilities ----------------------------------------------------------
  const q = (sel, root = document) => root.querySelector(sel);
  const def = (v, d) => (v == null ? d : v);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // --- DOM elements (will be created if missing) -------------------------
  let orbitWrap = q('#orbit-wrap');
  if (!orbitWrap) {
    orbitWrap = document.createElement('div');
    orbitWrap.id = 'orbit-wrap';
    document.body.appendChild(orbitWrap);
    orbitWrap.style.position = 'fixed';
    orbitWrap.style.left = '50%';
    orbitWrap.style.top = '50%';
    orbitWrap.style.transform = 'translate(-50%,-50%)';
    orbitWrap.style.pointerEvents = 'none';
    orbitWrap.style.width = '1px';
    orbitWrap.style.height = '1px';
    orbitWrap.style.zIndex = '35';
  }

  // find poster image with several fallbacks:
  function findPoster() {
    let el = q('#poster-thumb') || q('.poster img') || q('.poster-img') || q('.hero img') || q('img[src*="quantumkey-logo"]') || q('img');
    return el;
  }

  let poster = findPoster();

  // --- Orbit labels creation ----------------------------------------------
  const labelsText = ['Governance', 'Identity', 'Consciousness']; // order / content
  function ensureLabels() {
    // avoid duplicates
    if (orbitWrap.dataset.inited) return;
    orbitWrap.dataset.inited = '1';

    labelsText.forEach((txt, i) => {
      const lbl = document.createElement('div');
      lbl.className = 'orbit-label';
      const angle = 360 * (i / labelsText.length);
      lbl.style.setProperty('--angle', angle + 'deg');

      const inner = document.createElement('span');
      inner.textContent = txt;
      lbl.appendChild(inner);

      orbitWrap.appendChild(lbl);
    });
  }

  // --- Compute center and orbit radius ------------------------------------
  let rafPending = false;
  function computeOrbit() {
    if (!poster) poster = findPoster();
    if (!poster) return;

    ensureLabels();

    const imgRect = poster.getBoundingClientRect();

    // if image is hidden or zero size, abort
    if (imgRect.width === 0 || imgRect.height === 0) return;

    // center in viewport coordinates
    const centerX = imgRect.left + imgRect.width / 2;
    const centerY = imgRect.top + imgRect.height / 2;

    // base radius: a bit larger than half the larger dimension of the poster
    const base = Math.max(imgRect.width, imgRect.height) / 2;
    const extra = Math.max(48, base * 0.22); // give more breathing room on mobile
    let radius = Math.round(base + extra);

    // clamp to viewport sensible values
    const maxAllowed = Math.max(window.innerWidth, window.innerHeight) * 0.7;
    radius = clamp(radius, 80, Math.round(maxAllowed));

    // apply radius as CSS variable
    orbitWrap.style.setProperty('--orbit-radius', radius + 'px');

    // position orbitWrap fixed at the poster center (so it doesn't change layout)
    orbitWrap.style.position = 'fixed';
    orbitWrap.style.left = Math.round(centerX) + 'px';
    orbitWrap.style.top = Math.round(centerY) + 'px';
    orbitWrap.style.transform = 'translate(-50%,-50%)';

    // Update labels inner rotation so label text stays horizontal relative to page
    const labels = orbitWrap.querySelectorAll('.orbit-label');
    labels.forEach((el, idx) => {
      const initialAngle = parseFloat(getComputedStyle(el).getPropertyValue('--angle')) || (360 * (idx / labels.length));
      el.style.setProperty('--angle', initialAngle + 'deg');
      const span = el.querySelector('span');
      if (span) {
        span.style.transform = `rotate(calc(-1 * ${initialAngle}deg))`;
      }
    });
  }

  // debounce with rAF
  function scheduleCompute() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      computeOrbit();
    });
  }

  // attach events
  window.addEventListener('resize', scheduleCompute, { passive: true });
  window.addEventListener('orientationchange', scheduleCompute, { passive: true });
  window.addEventListener('scroll', scheduleCompute, { passive: true });

  // initial compute after load
  window.addEventListener('load', () => {
    poster = findPoster();
    computeOrbit();
    requestAnimationFrame(() => computeOrbit());
  });

  // observe poster size changes (for lazy-loaded or responsive images)
  function watchPosterSize(p) {
    if (!p) return;
    try {
      const ro = new ResizeObserver(() => scheduleCompute());
      ro.observe(p);
    } catch (e) { /* ResizeObserver not supported */ }
  }
  watchPosterSize(poster);

  // ensure poster if added later
  (function ensurePosterLater() {
    if (!poster) {
      const mo = new MutationObserver(() => {
        poster = findPoster();
        if (poster) {
          watchPosterSize(poster);
          computeOrbit();
          mo.disconnect();
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  })();

  // --- Menu toggle --------------------------------------------------------
  const menuBtn = q('#menu-btn') || q('.menu-btn') || q('.hamburger') || null;
  const offcanvas = q('#offcanvas-menu') || q('#menu-panel') || q('.offcanvas') || null;
  const menuClose = q('#menu-close') || q('.menu-close') || null;

  function openMenu() {
    document.body.classList.add('menu-open');
    if (offcanvas) offcanvas.classList.add('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    if (offcanvas) offcanvas.setAttribute('aria-hidden', 'false');
    scheduleCompute();
  }
  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (offcanvas) offcanvas.classList.remove('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (offcanvas) offcanvas.setAttribute('aria-hidden', 'true');
    scheduleCompute();
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      if (expanded) closeMenu(); else openMenu();
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', (ev) => {
      ev.preventDefault();
      closeMenu();
    });
  }

  // close if click outside
  document.addEventListener('click', (ev) => {
    if (!offcanvas) return;
    if (!offcanvas.classList.contains('open')) return;
    if (!offcanvas.contains(ev.target) && !menuBtn.contains(ev.target)) {
      closeMenu();
    }
  });

  // ESC closes
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeMenu();
  });

  // --- Start --------------------------------------------------------------
  ensureLabels();
  scheduleCompute();

  // expose for debugging
  window.__QKEY_ORBIT = {
    computeOrbit: computeOrbit,
    orbitWrap,
    poster,
    ensureLabels
  };

})();
