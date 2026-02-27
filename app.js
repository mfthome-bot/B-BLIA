let almeida, kjv, strong, refs;

async function init() {
  almeida = await fetch('data/almeida.json').then(r=>r.json());
  kjv = await fetch('data/kjv.json').then(r=>r.json());
  strong = await fetch('data/strong.json').then(r=>r.json());
  refs = await fetch('data/referencias.json').then(r=>r.json());

  // remover 4 primeiras linhas lixo
  almeida = almeida.slice(4);
  kjv = kjv.slice(4);

  menu();
}

function menu() {
  const m = document.getElementById("menu");
  m.innerHTML = "";

  const livros = [...new Set(almeida.map(v => v[""]))];

  livros.forEach(livro=>{
    const d=document.createElement("div");
    d.innerText=livro;
    d.onclick=()=>abrirLivro(livro);
    m.appendChild(d);
  });
}

function abrirLivro(livro) {
  const capitulo = 1;

  const versiculos = almeida.filter(v =>
    v[""] === livro && v["__2"] === capitulo && v["__4"]
  );

  const c=document.getElementById("conteudo");
  c.innerHTML="";

  versiculos.forEach(v=>{

    const kjvVerse = kjv.find(k =>
      k[""] === livro &&
      k["__2"] === v["__2"] &&
      k["__3"] === v["__3"]
    );

    const p=document.createElement("p");
    p.className="verso";

    let texto = v["__4"];

    if (kjvVerse) {
      texto += "<br><small style='color:gray'>" + 
        destacarStrong(kjvVerse["__4"]) +
        "</small>";
    }

    p.innerHTML=`<b>${v["__3"]}</b> ${texto}`;

    // referencias limitadas
    const chave = "Gn.1."+v["__3"];
    const r = refs.filter(x=>x["From Verse"]===chave);

    r.slice(0,3).forEach(ref=>{
      const l=document.createElement("span");
      l.className="link";
      l.innerText=" [ref]";
      l.onclick=()=>abrirReferencia(ref["To Verse"]);
      p.appendChild(l);
    });

    c.appendChild(p);
  });
}

function destacarStrong(texto) {
  return texto.replace(/\{(H\d+)\}/g,
    `<span class="link" onclick="abrirStrong('$1')">$1</span>`
  );
}

function abrirStrong(cod) {
  const s = strong.find(x=>x.number===cod);
  popup(`<h3>${cod}</h3><p>${s[""]}</p>`);
}

function abrirReferencia(ref) {
  popup(`<p>${ref}</p>`);
}

function popup(html) {
  const p=document.getElementById("popup");
  p.innerHTML=html+`<br><button onclick="fechar()">Fechar</button>`;
  p.classList.remove("hidden");
}

function fechar() {
  document.getElementById("popup").classList.add("hidden");
}

function toggleRefs(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "none" ? "block" : "none";
}


init();
