// script.js — menu mobile + loader de markdown + geração de cartões robusta

const viewer = document.getElementById("viewer");
const flash = document.getElementById("flash");
const btnShow = document.getElementById("btn-show-doc");
const pdfWhitepaperBtn = document.getElementById("pdf-whitepaper");
const pdfTokenomicsBtn = document.getElementById("pdf-tokenomics");
const ctaRead = document.getElementById("cta-read");
const ctaTokenomics = document.getElementById("cta-tokenomics");

// Mobile menu toggle (vertical)
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
if(menuToggle){
  menuToggle.addEventListener('click', ()=>{
    const open = mainNav.classList.toggle('mobile-open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Utility to safely build encoded URL to file in repo
function assetPath(folder, filename){
  // folder ex: "docs/assets/whitepaper"
  // filename: actual file name as appears in repo
  return `${folder}/${encodeURIComponent(filename).replace(/%2F/g,'/')}`;
}

// Valores base — nomes tal como estão no repo (confirma na tree)
const whitepaperFile = "QuantumKey Protocol — Whitepaper v1.0.pdf";
const tokenomicsFile = "QuantumKey_Tokenomics_v1.0.pdf";

// Patch link targets in DOM (so the visible buttons open correct PDFs)
if(pdfWhitepaperBtn) pdfWhitepaperBtn.href = assetPath("docs/assets/whitepaper", whitepaperFile);
if(pdfTokenomicsBtn) pdfTokenomicsBtn.href = assetPath("docs/assets/whitepaper", tokenomicsFile);
if(ctaTokenomics) ctaTokenomics.href = assetPath("docs/assets/whitepaper", tokenomicsFile);

// Lightweight markdown -> HTML
function mdToHtml(md){
  md = md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  md = md.replace(/```([\s\S]*?)```/g, (_, code) => `<pre class="code-block">${code}</pre>`);
  md = md.replace(/^###### (.*$)/gim,'<h6>$1</h6>');
  md = md.replace(/^##### (.*$)/gim,'<h5>$1</h5>');
  md = md.replace(/^#### (.*$)/gim,'<h4>$1</h4>');
  md = md.replace(/^### (.*$)/gim,'<h3>$1</h3>');
  md = md.replace(/^## (.*$)/gim,'<h2>$1</h2>');
  md = md.replace(/^# (.*$)/gim,'<h1>$1</h1>');
  md = md.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  md = md.replace(/\*(.*?)\*/g,'<em>$1</em>');
  md = md.replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2" target="_blank">$1</a>');
  md = md.replace(/^- (.*)$/gim,'<li>$1</li>');
  md = md.replace(/(<li>.*<\/li>)/gms,'<ul>$1</ul>');
  md = md.replace(/\n{2,}/g,'</p><p>');
  return `<p>${md}</p>`;
}

async function fetchAndRender(path){
  viewer.innerHTML = `A carregar ${path} ...`;
  try{
    const res = await fetch(path);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const text = await res.text();
    viewer.innerHTML = mdToHtml(text);
    flash.style.display = 'none';
    window.scrollTo({top: document.querySelector('.md-viewer').offsetTop - 80, behavior:'smooth'});
  }catch(err){
    viewer.innerHTML = `<div class="flash">Erro ao carregar: ${err.message}. Abre o PDF <a href="${pdfWhitepaperBtn ? pdfWhitepaperBtn.href : '#'}" target="_blank">aqui</a>.</div>`;
  }
}

// Buttons actions
if(btnShow) btnShow.addEventListener('click', (e)=>{ e.preventDefault(); fetchAndRender('docs/WHITEPAPER.md'); });
if(ctaRead) ctaRead.addEventListener('click', ()=> fetchAndRender('docs/WHITEPAPER.md'));

// Generate PDF cards (uses exact filenames from repo)
const pdfs = [
  {title:'Whitepaper', desc:'Vision, architecture and philosophical foundations.', filename: whitepaperFile},
  {title:'Tokenomics', desc:'The energetic architecture of the $QKEY economy.', filename: tokenomicsFile},
  {title:'DAO', desc:'Governance model and alignment primitives.', filename:'QuantumKey_DAO_v1.0.pdf'},
  {title:'Identity', desc:'Identity as a field of presence and continuity.', filename:'QuantumKey_Identity_v1.0.pdf'},
  {title:'Protocol', desc:'Operational mechanics of the protocol.', filename:'QuantumKey_Protocol_Core_v1.0.pdf'}
];

function renderCards(){
  const container = document.getElementById('pdf-cards');
  if(!container) return;
  container.innerHTML = '';
  pdfs.forEach(p=>{
    const href = assetPath('docs/assets/whitepaper', p.filename);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${p.title}</h3><p>${p.desc}</p><div><a class="open" href="${href}" target="_blank" rel="noopener">Open PDF</a></div>`;
    container.appendChild(card);
  });
}

renderCards();
