# Manual Omnichannel — AtenderBem / Habilis

Guia de instrução em formato de blog (HTML estático, responsivo) da plataforma
**AtenderBem** (Habilis — Gestão de Atendimentos), ambiente fastcorte.atenderbem.com.

## Conteúdo

Site estático em HTML + CSS, sem dependências. Cada módulo da plataforma
tem sua própria página, com capturas de tela reais e explicações didáticas.

Páginas:
- `index.html` — página inicial com cards de todos os capítulos
- `dashboard.html` — Dashboard e Indicadores (KPI) e aba Integrations
- `agentes.html` — Agent Dashboard (monitoramento de agentes)
- `crm.html` — CRM e Funil de Vendas
- `tickets.html` — Tickets (mesa de ajuda / Kanban)
- `chat-interno.html` — Chat Interno
- `tarefas.html` — Tarefas (My tasks)
- `contatos.html` — Contatos e Empresas
- `relatorios.html` — Relatórios (menu principal)
- `relatorios-personalizados.html` — Relatórios Personalizados (Custom Reports)
- `configuracoes.html` — Configurações (Filas, Usuários, Pausas, Ajuda)

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
