/* ============================================================================
   TOUR GUIADO — Extensões (nível 2)
   ----------------------------------------------------------------------------
   Um tour que roda DENTRO do produto: escurece a tela, destaca o elemento
   real e mostra um balão explicando cada passo.

   É 100% somente-leitura: apenas navega e abre/fecha diálogos. Nunca cria,
   publica, instala ou apaga nada.

   COMO USAR
   ---------
   Opção A (console): abra a instância, faça login, abra o console do navegador
   (F12) e cole o conteúdo deste arquivo. O tour começa sozinho.

   Opção B (favorito/bookmarklet): crie um favorito com este endereço:
   javascript:(function(){var s=document.createElement('script');s.src='<URL_DESTE_ARQUIVO>?v='+Date.now();document.body.appendChild(s);})()

   Atalhos: → / Próximo  |  ← / Anterior  |  Esc  sair
   ============================================================================ */
(function () {
  "use strict";

  var ROOT_ID = "omni-tour-root";
  if (window.__omniTour && window.__omniTour.__running) { window.__omniTour.destroy(); }

  /* ------------------------------------------------------------------ util */
  function $(sel) { return document.querySelector(sel); }

  function byText(txt, tag) {
    tag = tag || "*";
    var els = document.querySelectorAll(tag);
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.children.length === 0 && (e.innerText || "").trim() === txt) return e;
    }
    return null;
  }

  function byContains(txt, tag) {
    tag = tag || "*";
    var els = document.querySelectorAll(tag);
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.children.length === 0 && (e.innerText || "").trim().indexOf(txt) !== -1) return e;
    }
    return null;
  }

  function byRegex(re, tag) {
    var els = document.querySelectorAll(tag || "*");
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.children.length === 0 && re.test((e.innerText || "").trim())) return e;
    }
    return null;
  }

  // Encontra o elemento mais PROFUNDO cujo texto contém o trecho (inclui folhas).
  function deepContains(txt) {
    var all = document.querySelectorAll("*");
    for (var i = all.length - 1; i >= 0; i--) {
      var e = all[i];
      if ((e.innerText || "").indexOf(txt) === -1) continue;
      var deeper = false;
      for (var j = 0; j < e.children.length; j++) {
        if ((e.children[j].innerText || "").indexOf(txt) !== -1) { deeper = true; break; }
      }
      if (!deeper) return e;
    }
    return null;
  }

  function upBy(el, n) {
    var x = el;
    for (var i = 0; i < n && x; i++) x = x.parentElement;
    return x || el;
  }

  function nearestClickable(el) {
    var n = el;
    for (var i = 0; i < 6 && n; i++) {
      var tag = (n.tagName || "").toUpperCase();
      var role = n.getAttribute && n.getAttribute("role");
      if (tag === "A" || tag === "BUTTON" || role === "menuitem" || role === "button") return n;
      n = n.parentElement;
    }
    return el;
  }

  function clickEl(el) {
    if (!el) return false;
    el = nearestClickable(el);
    try {
      el.click();                       // clique nativo: é o que os componentes Angular escutam
      return true;
    } catch (e) {
      try {
        var r = el.getBoundingClientRect();
        var x = r.left + r.width / 2, y = r.top + r.height / 2;
        ["pointerdown", "mousedown", "mouseup", "click"].forEach(function (t) {
          el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, clientX: x, clientY: y, view: window }));
        });
        return true;
      } catch (e2) { return false; }
    }
  }

  /* ------------------------------------------- esperas/garantias (auto-correção) */
  // Espera uma condição ficar verdadeira; chama done(true/false).
  function waitUntil(pred, done, limit) {
    limit = limit || 34;
    (function tick(i) {
      var ok = false;
      try { ok = !!pred(); } catch (e) {}
      if (ok) return done(true);
      if (i >= limit) return done(false);
      setTimeout(function () { tick(i + 1); }, 220);
    })(0);
  }
  // Se a condição já vale, segue; senão executa a ação e espera.
  function ensure(pred, act, done) {
    var ok = false;
    try { ok = !!pred(); } catch (e) {}
    if (ok) return done(true);
    try { act(); } catch (e) {}
    waitUntil(pred, done);
  }
  function hasDialog() {
    return !!deepContains("Identificador (opcional)") ||
           !!document.querySelector(".cdk-overlay-pane [role=dialog]");
  }
  function openConfigMenu(done) {
    ensure(function () { return !!byText("Extensões"); },
           function () { clickEl($('[title="Configurações"]')); },
           done || function () {});
  }

  // Botão/link “Nova extensão” (robusto: procura em qualquer clicável que contenha o texto).
  function findNovaExtensao() {
    var els = document.querySelectorAll("button, a, [role=button], mat-button, span");
    for (var i = 0; i < els.length; i++) {
      if ((els[i].innerText || "").trim() === "Nova extensão" ||
          (els[i].innerText || "").indexOf("Nova extensão") !== -1) return els[i];
    }
    return null;
  }

  /* ------------------------------------------------------- os passos do tour */
  // Cada passo: { anchor: seletor ou função, title, text, place, before }
  var STEPS = [
    {
      anchor: null,
      title: "Vamos criar uma extensão, na tela de verdade",
      text: "Este tour aponta para os elementos reais, na ordem. É somente leitura: ele navega e abre diálogos, mas não cria nada. Use “Próximo”, ou as setas do teclado. Leva cerca de 2 minutos."
    },
    {
      anchor: '[title="Configurações"]',
      title: "1. O ponto de partida",
      text: "Tudo começa aqui: o menu <b>Configurações</b>, na barra superior. É onde ficam as telas de administração — inclusive o editor de extensões.",
      place: "bottom"
    },
    {
      anchor: function () { return byText("Extensões"); },
      before: function (done) { openConfigMenu(done); },
      title: "2. O item Extensões",
      text: "No menu, o item <b>Extensões</b> fica no fim da lista. Ele abre o <b>Editor</b> — a tela de quem <i>cria</i> extensões (perfil Administrador).",
      place: "right"
    },
    {
      anchor: function () { return findNovaExtensao() || byText("Nova extensão"); },
      before: function (done) {
        openConfigMenu(function () {
          clickEl(byText("Extensões"));
          waitUntil(function () {
            return /extensions-editor/.test(location.pathname);
          }, function () { done(); });
        });
      },
      title: "3. Criar uma extensão",
      text: "Aqui você cria. O botão <b>+ Nova extensão</b> abre um formulário logo abaixo da lista. Uma extensão nasce como <b>rascunho</b> — o único estado editável; tudo o mais é publicado depois.",
      place: "bottom"
    },
    {
      anchor: function () { return findNovaExtensao() || byText("Nova extensão"); },
      title: "4. O formulário e a pegadinha do identificador",
      text: "O formulário pede <b>Nome</b>, <b>Identificador (opcional)</b> e <b>Descrição</b>. Dois campos importam: o <b>Nome</b> (o que aparece na lista) e o <b>Identificador</b> — o nome <b>único e global</b> da extensão, no formato <code>fornecedor.extensao</code>.<br><br><b>Pegadinha:</b> o aviso diz que o identificador fica <b>IMUTÁVEL</b> após a primeira publicação. Escolha bem — mudar depois só apagando e recriando.",
      place: "bottom"
    },
    {
      anchor: function () {
        return document.querySelector(".ext-row-head") || byContains("rascunho");
      },
      before: function (done) {
        // espera o usuário fechar o formulário, se estiver aberto (não bloqueia se já fechou)
        waitUntil(function () { return !hasDialog(); }, function () { done(); }, 6);
      },
      title: "5. A lista de extensões",
      text: "Cada linha é uma extensão autorada <b>nesta</b> instância: nome, identificador, a versão do canal de teste e a cota de versões publicadas.",
      place: "bottom"
    },
    {
      anchor: function () { return byContains("rascunho") || byContains("RASCUNHO"); },
      title: "6. Rascunho x Publicado",
      text: "Na linha, o selo <b>rascunho</b> é o único estado editável — é ali que você escreve. Ao abrir a linha, aparecem também as versões já <b>PUBLICADAS</b>, que são imutáveis e ficam no servidor central (CDN).",
      place: "bottom"
    },
    {
      anchor: function () { return byRegex(/^dev\b/i) || byRegex(/^prod\b/i); },
      title: "7. O marcador do canal",
      text: "Este selo mostra onde o canal de <b>teste</b> aponta. E aqui está o pulo do gato: <b>publicar não coloca a extensão no ar</b> — é <b>apontar o canal</b> (dev ou prod) que a coloca em uso.",
      place: "bottom"
    },
    {
      anchor: function () { return byRegex(/^\d+\s*\/\s*\d+$/); },
      title: "8. Atualizar sem reinstalar",
      text: "O segundo número é o limite de versões publicadas. Para corrigir algo: crie uma versão nova (clone), publique e mova o canal. Quem consome aquela URL recebe a atualização — <b>ninguém reinstala nada</b>. O <i>rollback</i> é mover o canal de volta.",
      place: "bottom"
    },
    {
      anchor: null,
      title: "Pronto! E o passo que não é seu",
      text: "Você <b>cria e publica</b>. A <b>instalação</b> (quem recebe) é do <b>superusuário</b>: o Administrador comum não vê essa tela e o servidor bloqueia o acesso direto.<br><br><b>Importante:</b> como o parceiro/cliente <b>não tem login de superadmin na própria instância</b>, na prática <b>alterar</b> o que está instalado (instalar, configurar, ligar/desligar, remover) é feito pelo <b>MCP</b> — a integração de configuração, que opera exatamente com esse perfil — ou pelo <b>painel do parceiro</b>.<br><br>Regra de ouro: <b>publique → aponte → instale</b>."
    }
  ];

  /* --------------------------------------------------------------- o motor */
  var idx = 0, root, hl, balloon, bTitle, bText, bCount, anchors = [];

  var CSS = "" +
    "#" + ROOT_ID + "{position:fixed;inset:0;z-index:2147483600;pointer-events:none;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}" +
    "#" + ROOT_ID + " .t-hl{position:absolute;border-radius:10px;box-shadow:0 0 0 9999px rgba(15,23,42,.62);outline:3px solid #7c3aed;outline-offset:2px;transition:all .25s ease;pointer-events:none}" +
    "#" + ROOT_ID + " .t-balloon{position:absolute;pointer-events:auto;max-width:380px;background:#fff;color:#0f172a;border-radius:14px;box-shadow:0 18px 50px rgba(2,6,23,.45);padding:16px 18px;transition:all .25s ease}" +
    "#" + ROOT_ID + " .t-balloon.center{left:50%;top:50%;transform:translate(-50%,-50%);max-width:520px}" +
    "#" + ROOT_ID + " .t-balloon h4{margin:0 0 8px;font-size:16px;color:#4c1d95}" +
    "#" + ROOT_ID + " .t-balloon p{margin:0;font-size:13.5px;line-height:1.6}" +
    "#" + ROOT_ID + " .t-balloon code{background:#f1f5f9;border:1px solid #e2e8f0;border-radius:4px;padding:0 4px;font-size:12px}" +
    "#" + ROOT_ID + " .t-foot{display:flex;align-items:center;gap:8px;margin-top:14px}" +
    "#" + ROOT_ID + " .t-count{font-size:11px;color:#64748b;margin-right:auto}" +
    "#" + ROOT_ID + " .t-dots{display:flex;gap:4px;margin-right:6px}" +
    "#" + ROOT_ID + " .t-dots i{width:6px;height:6px;border-radius:50%;background:#cbd5e1;display:block}" +
    "#" + ROOT_ID + " .t-dots i.on{background:#7c3aed}" +
    "#" + ROOT_ID + " button{font:inherit;font-size:13px;padding:7px 12px;border-radius:9px;border:1px solid #cbd5e1;background:#f8fafc;cursor:pointer}" +
    "#" + ROOT_ID + " button.primary{background:#6d28d9;border-color:#6d28d9;color:#fff;font-weight:600}" +
    "#" + ROOT_ID + " button.ghost{border-color:transparent;background:transparent;color:#64748b}" +
    "#" + ROOT_ID + " .t-note{margin-top:10px;font-size:12px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:7px 9px;color:#92400e}";

  function build() {
    root = document.createElement("div");
    root.id = ROOT_ID;
    var st = document.createElement("style"); st.textContent = CSS;
    root.appendChild(st);
    hl = document.createElement("div"); hl.className = "t-hl"; root.appendChild(hl);
    balloon = document.createElement("div"); balloon.className = "t-balloon";
    balloon.innerHTML = '<h4></h4><p></p><div class="t-foot">' +
      '<span class="t-count"></span><span class="t-dots"></span>' +
      '<button class="ghost" data-act="prev">Anterior</button>' +
      '<button class="primary" data-act="next">Próximo</button>' +
      '<button class="ghost" data-act="close" title="Sair (Esc)">✕</button></div>';
    root.appendChild(balloon);
    document.body.appendChild(root);
    bTitle = balloon.querySelector("h4");
    bText = balloon.querySelector("p");
    bCount = balloon.querySelector(".t-count");
    balloon.addEventListener("click", function (e) {
      e.stopPropagation();                 // não deixa o clique do balão chegar ao documento
      var a = e.target && e.target.getAttribute && e.target.getAttribute("data-act");
      if (a === "next") go(idx + 1);
      if (a === "prev") go(idx - 1);
      if (a === "close") destroy();
    });
    document.addEventListener("keydown", onKey, true);
  }

  function onKey(e) {
    if (e.key === "Escape") { destroy(); }
    else if (e.key === "ArrowRight") { go(idx + 1); }
    else if (e.key === "ArrowLeft") { go(idx - 1); }
  }

  function place(rect, pref) {
    var vw = innerWidth, vh = innerHeight, bw = balloon.offsetWidth, bh = balloon.offsetHeight, m = 12;
    var top, left;
    if (pref === "left" && rect.left - bw - m > 0) { left = rect.left - bw - m; top = rect.top; }
    else if (pref === "right" && rect.right + bw + m < vw) { left = rect.right + m; top = rect.top; }
    else if (pref === "top" && rect.top - bh - m > 0) { left = rect.left; top = rect.top - bh - m; }
    else if (rect.bottom + bh + m < vh) { left = rect.left; top = rect.bottom + m; }
    else { left = rect.left; top = Math.max(m, rect.top - bh - m); }
    balloon.style.transform = "none";
    balloon.style.left = Math.min(Math.max(m, left), vw - bw - m) + "px";
    balloon.style.top = Math.min(Math.max(m, top), vh - bh - m) + "px";
  }

  function paintText() {
    var s = STEPS[idx];
    bTitle.innerHTML = s.title;
    bText.innerHTML = s.text;
    bCount.textContent = (idx + 1) + " de " + STEPS.length;
    var dots = balloon.querySelector(".t-dots");
    dots.innerHTML = STEPS.map(function (_, i) { return '<i class="' + (i === idx ? "on" : "") + '"></i>'; }).join("");
  }

  function render(tries, myIdx) {
    if (myIdx === undefined) myIdx = idx;
    if (myIdx !== idx) return;                 // o usuário mudou de passo: aborta
    tries = tries || 0;
    var s = STEPS[idx];
    paintText();

    var a = s.anchor;
    var el = (typeof a === "function") ? a() : (a ? $(a) : null);
    // Elemento invisível (0x0) não serve como âncora: trata como "não encontrado".
    if (el && el.offsetWidth === 0 && el.offsetHeight === 0) el = null;

    // Se o elemento ainda não existe (a tela pode estar carregando), tenta de novo.
    if (!el && a && tries < 16) {
      setTimeout(function () { render(tries + 1, myIdx); }, 250);
      return;
    }
    if (el) {
      anchors.push(el);
      try { el.scrollIntoView({ block: "center", inline: "center" }); } catch (e) {}
      var r = el.getBoundingClientRect(), pad = 6;
      hl.style.display = "block";
      hl.style.left = (r.left - pad) + "px";
      hl.style.top = (r.top - pad) + "px";
      hl.style.width = (r.width + pad * 2) + "px";
      hl.style.height = (r.height + pad * 2) + "px";
      place(r, s.place);
    } else {
      hl.style.display = "none";
      balloon.classList.add("center");
      balloon.style.left = ""; balloon.style.top = "";
      var note = balloon.querySelector(".t-note");
      if (s.anchor && !note) {
        var n = document.createElement("div"); n.className = "t-note";
        n.innerHTML = "Não encontrei este elemento nesta tela — confira se você está na tela certa (talvez seja preciso abrir o menu Configurações ou o editor).";
        balloon.appendChild(n);
      }
    }
    if (el) { var n2 = balloon.querySelector(".t-note"); if (n2) n2.remove(); balloon.classList.remove("center"); }
  }

  function go(n) {
    if (n < 0) n = 0;
    if (n >= STEPS.length) { destroy(); return; }
    var s = STEPS[n];
    idx = n;
    var pronto = function () { render(0, n); };
    if (s.before) {
      paintText();
      hl.style.display = "none";            // enquanto prepara, não deixa destaque obsoleto
      try { s.before(pronto); } catch (e) { pronto(); }
    } else {
      pronto();
    }
  }

  function destroy() {
    if (root && root.parentNode) root.parentNode.removeChild(root);
    document.removeEventListener("keydown", onKey, true);
    window.__omniTour.__running = false;
  }

  build();
  window.__omniTour = { start: function () { go(0); }, destroy: destroy, __running: true };
  go(0);
})();
