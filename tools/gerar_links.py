#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenera links-compartilhamento.html a partir do GROUPS do build_nav + entregaveis.
Convencao do manual: toda entrega compartilhavel entra nesta pagina."""
import importlib.util, html, os
BASE = "/home/hermes/manual-omnichannel"
spec = importlib.util.spec_from_file_location("bn", f"{BASE}/tools/build_nav.py")
bn = importlib.util.module_from_spec(spec); spec.loader.exec_module(bn)
GROUPS = bn.GROUPS
BASE_URL = "https://raw.githack.com/ivannhabilis/manual_atenderbem/main"
RAW_URL  = "https://raw.githubusercontent.com/ivannhabilis/manual_atenderbem/main"

def link(path, raw=False):
    url = (RAW_URL if raw else BASE_URL) + "/" + path
    return '<a href="%s"><code>%s</code></a>' % (url, url)

def table(rows):
    out = ['<div class="table-wrap"><table class="doc"><thead><tr><th>Material</th><th>Link público</th></tr></thead><tbody>']
    for t, p, r in rows:
        out.append('<tr><td>%s</td><td>%s</td></tr>' % (html.escape(t), link(p, r)))
    out.append('</tbody></table></div>')
    return "\n".join(out)

destaques = [
 ("Guia guiado — Criar sua primeira extensão (avulso, imagens embutidas)", "entrega/extensoes-explicacao.html", False),
 ("Tutorial — Gerar documento a partir de um modelo (avulso, imagens embutidas)", "entrega/tutorial-modelo-documento.html", False),
 ("Modelo .docx de exemplo (aviso com variáveis do atendimento)", "entrega/exemplos/modelo-aviso-atendimento.docx", True),
 ("Kit de extensão de exemplo (manifesto instalável)", "ext/kit-extensao-exemplo/manifest.json", False),
 ("Extensão de exemplo — Assistente de Vendas ERP (manifesto instalável)", "ext/exemplo-vendas/manifest.json", False),
 ("Índice dos 57 fluxos de automação para importar", "automacoes/INDICE.txt", True),
]
cats = [(t, [(lbl, href, False) for href, lbl in items]) for t, items in GROUPS]

body = ['<div class="callout info"><strong>Como usar.</strong> Os endereços abaixo são servidos pelo <strong>raw.githack</strong> diretamente do repositório do manual. O sufixo <code>/main/</code> traz sempre a versão mais recente (pode sofrer um pouco de cache do CDN). Para um link <em>estável</em>, troque <code>/main/</code> pelo identificador do commit desejado. Copie a URL exibida na coluna da direita e envie a quem precisar.</div>',
 '<h2 id="entregaveis">Entregáveis e kits (para enviar a terceiros)</h2>',
 '<p>Materiais avulsos e instaláveis, prontos para compartilhar com parceiros e clientes:</p>', table(destaques),
 '<div class="callout warn"><strong>Download do .docx e dos .txt:</strong> esses endereços usam o <code>raw.githubusercontent</code> (baixam o arquivo direto). Pelo raw.githack também funcionam, mas respondem com um redirecionamento antes de baixar.</div>',
 '<div class="callout tip"><strong>Mudou de endereço?</strong> a extensão de exemplo era publicada em <code>ext/fastcorte-vendas/</code>; o caminho atual é <code>ext/exemplo-vendas/</code>. Links antigos daquele caminho não respondem mais.</div>']
for t, rows in cats:
    sid = "cat-" + t.lower().replace(" & ", "-").replace(" ", "-")
    body.append('<h2 id="%s">%s</h2>' % (html.escape(sid), html.escape(t)))
    body.append('<p>%d capítulo(s):</p>' % len(rows)); body.append(table(rows))

page = '''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Links de Compartilhamento (raw.githack) — Manual Omnichannel</title>
<meta name="description" content="Índice dos links públicos (raw.githack) do Manual Omnichannel: entregáveis avulsos, kits de extensão, fluxos importáveis e todos os capítulos por assunto.">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>

<main class="container article">
  <div class="breadcrumb"><a href="index.html">Início</a> &rsaquo; Links de Compartilhamento</div>

  <h1>Links de Compartilhamento (raw.githack)</h1>
  <p class="subtitle">Todos os endereços públicos do manual e dos materiais avulsos, organizados por assunto — para copiar e enviar a parceiros e clientes sem precisar procurar no histórico.</p>

''' + "\n  ".join(body) + '''

  <div class="pagenav">
    <a href="index.html"><span>←</span> Início</a>
    <a class="next" href="faq.html"><span>Relacionado →</span> Base de Conhecimento</a>
  </div>
</main>

<footer class="footer">
  <p>Manual Omnichannel — <strong>AtenderBem / Habilis</strong>. Uso interno e educativo.</p>
</footer>
</body>
</html>
'''
open(f"{BASE}/links-compartilhamento.html", "w", encoding="utf-8").write(page)
n = sum(len(r) for _, r in cats) + len(destaques)
print("links-compartilhamento regenerado | capitulos:", sum(len(r) for _, r in cats), "| total de links:", n)
