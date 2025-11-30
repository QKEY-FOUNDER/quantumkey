// script.js — carregador simples de Markdown

const viewer = document.getElementById("viewer");
const flash = document.getElementById("flash");
const btn = document.getElementById("btn-show-doc");
const pdfLink = document.getElementById("pdf-link");

// Conversor de Markdown → HTML simplificado (sem dependências externas)
function mdToHtml(md) {
  md = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // codeblocks ```
  md = md.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre class="code-block">${code}</pre>`;
  });

  // headings
  md = md.replace(/^###### (.*$)/gim, `<h6>$1</h6>`);
  md = md.replace(/^##### (.*$)/gim, `<h5>$1</h5>`);
  md = md.replace(/^#### (.*$)/gim, `<h4>$1</h4>`);
  md = md.replace(/^### (.*$)/gim, `<h3>$1</h3>`);
  md = md.replace(/^## (.*$)/gim, `<h2>$1</h2>`);
  md = md.replace(/^# (.*$)/gim, `<h1>$1</h1>`);

  // bold / italic
  md = md.replace(/\*\*(.*?)\*\*/g, `<strong>$1</strong>`);
  md = md.replace(/\*(.*?)\*/g, `<em>$1</em>`);

  // links
  md = md.replace(/(.*?)(.*?)/g, `<a href="$2" target="_blank">$1</a>`);

  // lists
  md = md.replace(/^- (.*)$/gim, `<li>$1</li>`);
  md = md.replace(/(<li>.*<\/li>)/gms, `<ul>$1</ul>`);

  // paragraphs
  md = md.replace(/\n{2,}/g, `</p><p>`);

  return `<p>${md}</p>`;
}

// Fetch + render Markdown
async function fetchAndRender(path) {
  viewer.innerHTML = `A carregar ${path} ...`;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Erro HTTP " + res.status);

    const text = await res.text();
    viewer.innerHTML = mdToHtml(text);
    flash.style.display = "none";
  } catch (err) {
    viewer.innerHTML = `
      <div class="flash">
        Erro ao carregar o ficheiro: ${err.message}.<br>
        Consulte o PDF <a href="${pdfLink.href}" target="_blank">aqui</a>.
      </div>`;
  }
}

// Botão "Ver Whitepaper"
btn.addEventListener("click", () => fetchAndRender("docs/WHITEPAPER.md"));

// Sidebar clicks
document.getElementById("doc-list").addEventListener("click", (e) => {
  if (e.target.dataset.path) {
    fetchAndRender(e.target.dataset.path);
  }
});

// Auto-load
fetchAndRender("docs/WHITEPAPER.md");
