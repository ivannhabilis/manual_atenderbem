/* ============================================================
   Manual Omnichannel — cabeçalho (mobile) + busca de assunto
   Carregado por todas as páginas via <script src=".../assets/site.js" defer>.
   O caminho-base é deduzido do próprio src (funciona em qualquer profundidade).
   ============================================================ */
(function () {
  "use strict";

  var script = document.currentScript || (function () {
    var s = document.getElementsByTagName("script");
    for (var i = s.length - 1; i >= 0; i--) {
      if (s[i].src && s[i].src.indexOf("assets/site.js") !== -1) return s[i];
    }
    return null;
  })();
  var BASE = script ? script.src.replace(/assets\/site\.js.*$/, "") : "";

  function norm(s) {
    return (s || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ---------- 1. Menu móvel (hambúrguer) ---------- */
  function initMobileNav() {
    var topbar = document.querySelector(".topbar");
    var navmenu = topbar && topbar.querySelector(".navmenu");
    if (!topbar || !navmenu) return;

    var burger = el("button", {
      "class": "hamburger",
      type: "button",
      "aria-label": "Abrir menu",
      "aria-expanded": "false"
    }, "&#9776;");
    topbar.insertBefore(burger, navmenu);

    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.innerHTML = open ? "&#10005;" : "&#9776;";
    });
  }

  /* ---------- 2. Busca de assunto ---------- */
  function initSearch() {
    var topbar = document.querySelector(".topbar");
    if (!topbar) return;

    var btn = el("button", {
      "class": "searchbtn",
      type: "button",
      "aria-label": "Buscar assunto",
      title: "Buscar assunto (Ctrl+K)"
    }, '<span aria-hidden="true">&#128269;</span><span class="lbl">Buscar</span>');
    topbar.appendChild(btn);

    var overlay = el("div", { "class": "search-overlay", role: "dialog", "aria-modal": "true", "aria-label": "Busca de assunto" });
    overlay.innerHTML =
      '<div class="search-panel">' +
      '<input type="search" id="srch" placeholder="Buscar assunto, módulo ou campo…" autocomplete="off" aria-label="Buscar assunto">' +
      '<div class="search-results" id="srchres"></div>' +
      "</div>";
    document.body.appendChild(overlay);

    var input = overlay.querySelector("#srch");
    var results = overlay.querySelector("#srchres");
    var index = window.MANUAL_INDEX || [];

    function open() {
      overlay.classList.add("open");
      input.value = "";
      render("");
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() { overlay.classList.remove("open"); }

    btn.addEventListener("click", open);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open(); }
    });

    function esc(s) { return (s || "").replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

    function render(q) {
      var nq = norm(q);
      if (nq.length < 2) {
        results.innerHTML = '<div class="sr-empty">Digite ao menos 2 letras. Procure por assunto, módulo ou nome de campo.</div>';
        return;
      }
      var out = [];
      index.forEach(function (p) {
        var pageHit = norm(p.t).indexOf(nq) !== -1;
        var secHits = (p.s || []).filter(function (s) { return norm(s.h).indexOf(nq) !== -1; });
        if (pageHit && !secHits.length) {
          out.push({ t: p.t, u: p.u, sec: null, score: norm(p.t).indexOf(nq) });
        }
        secHits.slice(0, 6).forEach(function (s) {
          out.push({ t: p.t, u: p.u, sec: s, score: norm(s.h).indexOf(nq) + 3 });
        });
      });
      out.sort(function (a, b) { return a.score - b.score || a.t.localeCompare(b.t); });
      out = out.slice(0, 40);

      if (!out.length) {
        results.innerHTML = '<div class="sr-empty">Nada encontrado para “' + esc(q) + '”.</div>';
        return;
      }
      results.innerHTML = out.map(function (r) {
        var url = BASE + r.u + (r.sec && r.sec.a ? "#" + r.sec.a : "");
        return '<a class="sr-item" href="' + esc(url) + '">' +
          '<div class="sr-page">' + esc(r.t) + "</div>" +
          '<div class="sr-sec' + (r.sec ? "" : " none") + '">' +
          (r.sec ? "&#8594; " + esc(r.sec.h) : "abrir capítulo") + "</div></a>";
      }).join("");
    }

    input.addEventListener("input", function () { render(input.value); });
  }

  function boot() { initMobileNav(); initSearch(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
