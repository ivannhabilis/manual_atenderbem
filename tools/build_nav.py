#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_nav.py — padroniza o CABEÇALHO (mega-menu por tema) em todas as páginas
do Manual Omnichannel, injeta índice (TOC) automático, âncoras de título e
gera o índice de busca (assets/search-index.js).

Idempotente: pode ser reexecutado após qualquer edição de conteúdo.

Uso:  python3 tools/build_nav.py
"""
import os
import re
import json
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ----- estrutura do menu (caminhos relativos à raiz do site) -----
BASE_ITEM = ("Início", "index.html")

GROUPS = [
    ("Operação", [
        ("dashboard.html", "Dashboard e Indicadores"),
        ("agentes.html", "Agentes (Agent Dashboard)"),
        ("produtividade.html", "Monitoramento de Produtividade"),
        ("tarefas.html", "Tarefas (My tasks)"),
        ("chat-interno.html", "Chat Interno"),
        ("contatos.html", "Contatos e Empresas"),
    ]),
    ("Vendas & CRM", [
        ("crm.html", "CRM e Funil de Vendas"),
        ("carrinho-sincronizado.html", "Carrinho Sincronizado com CRM"),
        ("base/config/cataloglist/index.html", "Catálogo de Produtos"),
    ]),
    ("Canais & WhatsApp", [
        ("canais-whatsapp-meta.html", "WhatsApp, Cloud API e Meta"),
    ]),
    ("IA & Automação", [
        ("ia.html", "IA Básica e IA Avançada"),
        ("integracoes.html", "Integrações e Automações"),
    ]),
    ("Suporte & Qualidade", [
        ("tickets.html", "Tickets (Mesa de Ajuda)"),
        ("tickets-faq.html", "FAQ — Tickets e Automações"),
        ("pesquisas.html", "Pesquisas e Satisfação"),
        ("suporte-visual-remoto.html", "Suporte Visual Remoto"),
        ("suporte-operacional.html", "Playbook de Suporte"),
    ]),
    ("Telefonia (PABX)", [
        ("pabx.html", "PABX Fácil e Telefonia VoIP"),
        ("pabx-troncos.html", "Troncos SIP"),
        ("pabx-rotas.html", "Rotas de Entrada/Saída"),
        ("pabx-ramais.html", "Ramais"),
        ("pabx-filas.html", "Filas de Telefonia"),
        ("pabx-ura-audios.html", "URAs e Áudios"),
        ("pabx-horarios.html", "Horários de Funcionamento"),
        ("pabx-custom.html", "Custom & ARI"),
        ("pabx-cdr-auditoria.html", "CDR e Auditoria"),
        ("pabx-cli-troubleshooting.html", "CLI e Troubleshooting"),
    ]),
    ("Relatórios & Gestão", [
        ("relatorios.html", "Relatórios"),
        ("relatorios-personalizados.html", "Relatórios Personalizados"),
    ]),
    ("Configurações & Admin", [
        ("configuracoes.html", "Configurações"),
        ("extensoes.html", "Extensões (SDK)"),
        ("backups.html", "Backups e Restauração"),
    ]),
]

EXTRA_PAGES = ["base/config/cataloglist/index.html"]


def slug(text):
    text = re.sub(r"<[^>]+>", "", text)
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "secao"


def strip_tags(text):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", text)).strip()


def page_files():
    pages = [f for f in sorted(os.listdir(ROOT)) if f.endswith(".html")]
    for extra in EXTRA_PAGES:
        if os.path.exists(os.path.join(ROOT, extra)) and extra not in pages:
            pages.append(extra)
    return pages


def rel_prefix(relpath):
    depth = relpath.count("/")
    return "../" * depth


def nav_active(relpath, target):
    return relpath == target


def build_header(relpath):
    p = rel_prefix(relpath)
    links = []
    links.append(
        '<a class="navlink{}" href="{}index.html">Início</a>'.format(
            " active" if nav_active(relpath, "index.html") else "", p
        )
    )
    for title, items in GROUPS:
        group_hit = any(nav_active(relpath, href) for href, _ in items)
        entries = []
        for href, label in items:
            cls = " class=\"active\"" if nav_active(relpath, href) else ""
            entries.append('<a{} href="{}{}">{}</a>'.format(cls, p, href, label))
        links.append(
            '<div class="navgroup">\n'
            '        <button class="navbtn" type="button" aria-haspopup="true" aria-expanded="false">{}'
            '<span class="caret" aria-hidden="true">&#9660;</span></button>\n'
            '        <div class="navdropdown">\n          {}\n        </div>\n'
            "      </div>".format(title, "\n          ".join(entries))
        )
    return (
        '<header class="topbar">\n'
        '  <div class="brand"><span class="dot"></span><a href="{}index.html">Manual Omnichannel</a></div>\n'
        '  <nav class="navmenu" aria-label="Navegação principal">\n    {}\n  </nav>\n'
        "</header>".format(p, "\n    ".join(links))
    )


SCRIPT_TAGS = (
    '<script src="{p}assets/search-index.js" defer></script>\n'
    '<script src="{p}assets/site.js" defer></script>'
)


def ensure_scripts(html, relpath):
    html = re.sub(r"\s*<script src=\"[^\"]*assets/(search-index|site)\.js\"[^>]*></script>", "", html)
    p = rel_prefix(relpath)
    tags = SCRIPT_TAGS.format(p=p)
    if "</body>" in html:
        return html.replace("</body>", tags + "\n</body>")
    return html + "\n" + tags + "\n"


def inject_heading_ids(html):
    """Dá id a h2/h3 (dentro de <main>) que ainda não têm; devolve (html, [(nivel, texto, id)])."""
    out_headings = []
    used = set()

    def make_unique(base):
        sid = base
        i = 2
        while sid in used:
            sid = "{}-{}".format(base, i)
            i += 1
        used.add(sid)
        return sid

    def repl(m):
        level, attrs, inner = m.group(1), m.group(2), m.group(3)
        text = strip_tags(inner)
        if not text:
            return m.group(0)
        idm = re.search(r'id="([^"]+)"', attrs)
        if idm:
            sid = idm.group(1)
            used.add(sid)
        else:
            sid = make_unique(slug(text))
            attrs = attrs + ' id="{}"'.format(sid)
        out_headings.append((int(level), text, sid))
        return "<h{}{}>{}</h{}>".format(level, attrs, inner, level)

    html = re.sub(r"<h([23])([^>]*)>(.*?)</h\1>", repl, html, flags=re.S)
    return html, out_headings


def build_toc(headings):
    h2s = [h for h in headings if h[0] == 2]
    if len(h2s) < 4:
        return ""
    items = []
    for lvl, text, sid in headings:
        cls = ' class="toc-h3"' if lvl == 3 else ""
        items.append('<li{}><a href="#{}">{}</a></li>'.format(cls, sid, text))
    return (
        "<!-- AUTO-TOC -->\n"
        '  <nav class="toc" aria-label="Índice do capítulo">\n'
        "    <h3>Neste capítulo</h3>\n    <ol>\n      " + "\n      ".join(items) + "\n    </ol>\n  </nav>\n"
        "  <!-- /AUTO-TOC -->"
    )


def insert_toc(html, toc):
    html = re.sub(r"\n\s*<!-- AUTO-TOC -->.*?<!-- /AUTO-TOC -->", "", html, flags=re.S)
    if not toc:
        return html
    # insere logo após o subtítulo, ou após o <h1>, ou logo após abrir o <main>
    m = re.search(r'(<p class="subtitle">.*?</p>)', html, flags=re.S)
    if m:
        return html[:m.end()] + "\n\n  " + toc + html[m.end():]
    m = re.search(r"(<h1[^>]*>.*?</h1>)", html, flags=re.S)
    if m:
        return html[:m.end()] + "\n\n  " + toc + html[m.end():]
    m = re.search(r"(<main[^>]*>)", html)
    if m:
        return html[:m.end()] + "\n  " + toc + html[m.end():]
    return html


def main():
    index = []
    changed = []
    for relpath in page_files():
        full = os.path.join(ROOT, relpath)
        with open(full, encoding="utf-8") as fh:
            html = fh.read()
        original = html

        # 1. cabeçalho padronizado
        header = build_header(relpath)
        if re.search(r'<header class="topbar"[^>]*>.*?</header>', html, flags=re.S):
            html = re.sub(r'<header class="topbar"[^>]*>.*?</header>', header, html, count=1, flags=re.S)
        else:
            html = re.sub(r"(<body[^>]*>)", r"\1\n\n" + header, html, count=1)

        # 2. âncoras de título + índice automático (somente dentro de <main>)
        html = re.sub(r"\n\s*<!-- AUTO-TOC -->.*?<!-- /AUTO-TOC -->", "", html, flags=re.S)
        m = re.search(r"<main\b.*?</main>", html, flags=re.S)
        if m:
            new_main, headings = inject_heading_ids(m.group(0))
            html = html[:m.start()] + new_main + html[m.end():]
        else:
            html, headings = inject_heading_ids(html)
        html = insert_toc(html, build_toc(headings))

        # 3. scripts de navegação/busca
        html = ensure_scripts(html, relpath)

        if html != original:
            with open(full, "w", encoding="utf-8") as fh:
                fh.write(html)
            changed.append(relpath)

        # 4. entrada no índice de busca
        tm = re.search(r"<title>(.*?)</title>", html, flags=re.S)
        title = strip_tags(tm.group(1)) if tm else relpath
        title = title.split("—")[0].split("|")[0].strip() or relpath
        sections = [{"h": h[1], "a": h[2]} for h in headings if h[0] in (2, 3)]
        index.append({"t": title, "u": relpath, "s": sections})

    index.sort(key=lambda e: e["t"].lower())
    out = os.path.join(ROOT, "assets", "search-index.js")
    with open(out, "w", encoding="utf-8") as fh:
        fh.write("/* Gerado por tools/build_nav.py — índice de busca (títulos e seções). */\n")
        fh.write("window.MANUAL_INDEX = ")
        fh.write(json.dumps(index, ensure_ascii=False, indent=1))
        fh.write(";\n")

    print("Páginas atualizadas: {}".format(len(changed)))
    for c in changed:
        print("  -", c)
    print("Índice de busca: {} páginas, {} seções.".format(len(index), sum(len(e["s"]) for e in index)))
    print("Arquivo: assets/search-index.js")


if __name__ == "__main__":
    main()
