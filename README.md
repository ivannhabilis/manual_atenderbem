# Manual Omnichannel — AtenderBem / Habilis

Guia de instrução em formato de blog (HTML estático, responsivo) da plataforma
**AtenderBem** (Habilis — Gestão de Atendimentos).

## Conteúdo

Site estático em HTML + CSS, sem dependências. Cada módulo da plataforma
tem sua própria página, com capturas de tela reais e explicações didáticas.

Páginas:
- `index.html` — página inicial com cards de todos os capítulos
- `dashboard.html` — Dashboard e Indicadores (KPI) e aba Integrations
- `agentes.html` — Agent Dashboard (monitoramento de agentes)
- `produtividade.html` — Monitoramento de Produtividade
- `tarefas.html` — Tarefas (My tasks)
- `chat-interno.html` — Chat Interno
- `contatos.html` — Contatos e Empresas
- `crm.html` — CRM e Funil de Vendas
- `carrinho-sincronizado.html` — Carrinho Sincronizado com CRM
- `base/config/cataloglist/index.html` — Catálogo de Produtos
- `canais-whatsapp-meta.html` — WhatsApp, Cloud API e Meta
- `ia.html` — IA Básica e IA Avançada (inclui novidades dos assistentes v14.1)
- `integracoes.html` — Integrações e Automações Externas
- `tickets.html` — Tickets (mesa de ajuda / Kanban)
- `tickets-faq.html` — FAQ de Tickets e Automações
- `pesquisas.html` — Pesquisas e Satisfação
- `suporte-visual-remoto.html` — Suporte Visual Remoto
- `suporte-operacional.html` — Playbook de Suporte Operacional
- `pabx.html` + `pabx-*.html` — PABX Fácil / Telefonia VoIP (troncos, rotas, ramais, filas, URAs, horários, custom, CDR, CLI)
- `relatorios.html` — Relatórios (menu principal)
- `relatorios-personalizados.html` — Relatórios Personalizados (Custom Reports)
- `configuracoes.html` — Configurações (Filas, Usuários, Pausas, Ajuda)
- `extensoes.html` — Extensões (micro-frontends / SDK)
- `backups.html` — Backups e Restauração

## Navegação (cabeçalho) e busca

O cabeçalho de todas as páginas é gerado e padronizado por `tools/build_nav.py`
(mega-menu agrupado por tema: Operação, Vendas & CRM, Canais & WhatsApp,
IA & Automação, Suporte & Qualidade, Telefonia (PABX), Relatórios & Gestão,
Configurações & Admin). O mesmo script injeta um índice (TOC) automático em
capítulos com 4+ seções, dá âncoras (`id`) aos títulos e gera o índice de busca
`assets/search-index.js`.

Recursos em runtime (`assets/site.js`):
- busca de assunto (botão "Buscar" no topo, atalho `Ctrl+K`), que pesquisa em
  títulos de capítulo e em todas as seções;
- menu móvel (hambúrguer) abaixo de 900px.

Depois de editar/adicionar páginas ou títulos, reexecute para atualizar menu,
âncoras e índice de busca (é idempotente):

```bash
python3 tools/build_nav.py
```

Pasta `assets/`: folha de estilo (`style.css`) e imagens (capturas reais da plataforma).

## Idioma

O conteúdo do manual está em **pt-BR**. A plataforma AtenderBem não possui
seletor de idioma: seus rótulos são fixos e combinam termos em português
("Atualizar", "TMA", "Hoje", "Relatório de…") com alguns em inglês
("Service Interactions", "Queue", "Today"). As capturas de tela refletem a
interface exatamente como ela aparece.

## Como visualizar

Abra `index.html` no navegador, ou sirva localmente:

```bash
cd manual-omnichannel
python3 -m http.server 8000
# acesse http://localhost:8000
```

## Observações

- Todo o conteúdo foi elaborado a partir da interface real da plataforma.
  Nenhuma funcionalidade foi inventada.
- As capturas de tela foram tiradas em um ambiente com dados de exemplo;
  seus números reais serão diferentes.

## Publicação no GitHub Pages (opcional)

Este projeto é um site estático e pode ser publicado via GitHub Pages:
nas configurações do repositório, em *Pages*, escolha a branch `main` e a
pasta raiz (`/`). O `index.html` será a página inicial.

## Catálogo de paths (estrutura de pastas)

`PATHS.md` — catálogo completo dos paths (rotas) do sistema, extraído do
bundle de produção e cruzado com sessão real + MCP. Cada path virou uma
pasta espelhada na raiz do projeto (ex.: `/base/config/userslist` →
`base/config/userslist/`, parâmetros `:id` viram `[id]`). São 124 paths
navegáveis catalogados. As pastas contêm `.gitkeep` e aguardam o conteúdo
do manual (páginas HTML + capturas) por módulo.

