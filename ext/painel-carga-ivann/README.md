# Painel de Carga dos Agentes (Ivann) — `ivann.painel-carga`

Extensão do módulo de Extensões do AtenderBem. Aparece no **menu superior** (contribuição
`topMenu`, modo `dialog`).

## Arquivos

| Arquivo | Papel |
|---|---|
| `manifest.json` | Carteira de identidade da extensão (id, versão, contribuição, config). |
| `index.html` | A tela: lê o SDK `omni`, monta o painel e executa a transferência. |
| `assets/icone.svg` | Ícone do item no menu superior. É **arquivo da versão** (não é nome de ícone do sistema). |
| `ROTEIRO-VIDEO.md` | Roteiro de narração do vídeo, com os tempos reais do vídeo gravado. |
| `legendas.srt` | Legendas sincronizadas com o vídeo (mesma divisão de tempo do roteiro). |
| `GUIA-CORRECOES-EXEMPLO.md` | Guia para corrigir os dois defeitos na Extensão de Exemplo (aprendizagem). |
| `AULA-COMO-FOI-FEITO.md` | Aula: decisões de projeto, conceitos de programação e exercícios. |

## Estado atual (publicado e verificado)

- Extensão no editor: **id 3**, identificador global `ivann.painel-carga` (congelado na 1ª publicação).
- Versão **1.1.1** publicada — versão id **23**; ponteiro **dev** apontando para ela.
  (Limite da plataforma: 5 versões publicadas por extensão — para publicar a próxima é preciso
  `extensions_delete_version` numa antiga que não esteja apontada por prod/dev.)
- Instalação nesta instância: **id 34**, habilitada, visibilidade `userTypes [0,1,2]` (padrão).
- Manifesto dev: `https://cdn.a-tend.online/ivann.painel-carga/manifest_dev.json`
- Arquivo da versão: `https://cdn.a-tend.online/ivann.painel-carga/v/1.1.1/index.html`
- Sondagem de instalação: `installable: true`, CORS `*`, sem avisos e sem dependências pendentes.

## Configuração declarada

| Chave | Tipo | Padrão | Para que serve |
|---|---|---|---|
| `limiteEsperaAlerta` | number | 10 | Minutos de espera a partir dos quais a linha fica vermelha. |
| `intervaloMs` | number | 60 | Pausa entre as consultas de fila (protege o canal da extensão). |
| `maxFilas` | number | 0 | Teto de filas a consultar; `0` = todas. |

## Publicar uma nova versão (não dá para editar a publicada)

1. `extensions_create_draft` (ou `extensions_clone_version`) → obtém o rascunho.
2. `extensions_put_resource` nos arquivos alterados.
3. `extensions_save_manifest` com o manifesto **completo** (ele substitui, não faz merge) e a `version` maior.
4. `extensions_check_version` → corrija todo finding de severidade `error`.
5. `extensions_publish_version` → depois `extensions_set_pointer` (`dev` para testar, `prod` para produção).

Publicar **não** coloca no ar: quem coloca é o ponteiro.

## Rollback

- Tirar do ar sem apagar: `extension_installs_set_enabled` com `enabled: false`.
- Desinstalar: `extension_installs_remove` com `confirm: true`.
- Voltar a versão servida: `extensions_set_pointer` apontando o ponteiro para outra versão publicada.

## Notas técnicas

- O `chatPanel` não foi usado de propósito: o usuário administrador desta instância tem
  `chatenabled = 0`, e painéis de chat só renderizam para quem atende chats. O `topMenu` aparece para todos.
- O `requires` no manifesto é **lista** de nomes de recurso (um objeto é recusado com `E_TYPE`).
- **Teto de largura do popup do Host (não é do conteúdo).** Medido: o painel do overlay
  `.cdk-overlay-pane.extension-dialog-panel` fica preso em **1280 px**, enquanto o diálogo
  `.dialog-x-large.ext-dialog` ocupa **90% da janela** (`90vw`, não `90%` do pai). Logo, acima de
  **1422 px** de janela o diálogo passa a ser mais largo que o container e o
  `.mat-mdc-dialog-surface` (`overflow-x: auto`) cria a barra horizontal — em 2560 px a sobra é
  1024 px; em 3840 px, 2176 px. O conteúdo da extensão nunca estoura: medi a largura interna
  igual à visível em 520, 700, 900, 1280, 1400, 1920, 2560 e 3840 px.
  Atenção: a inconsistência é do Host e piora com `lg` (painel 960 px com diálogo de 80vw — já
  estoura em janela de 1200 px). `xl` é o tamanho de diálogo mais seguro.
- **Solução entregue: o atalho "Tela cheia"** (`omni.nav.openFullscreen('menu_carga')`), que abre
  o painel na rota `/base/extensions/34/menu_carga` — ali não existe o teto de 1280 px. Nessa rota
  o painel detecta o modo via `omni.nav.getRoute()` (caminho terminando em `menu_carga`), para de
  chamar `omni.ui.resize` (a altura passa a ser a da página) e esconde o próprio atalho.
- Utilitário de diagnóstico: `diagnostico-scroll.js` (colar no console) mostra de quem é a barra —
  página, popup ou conteúdo — com larguras de janela, overlay, diálogo e iframe.
- **Dentro do iframe, `window.innerWidth` é a largura DO IFRAME** (90% da janela), não a da janela do
  navegador. Em 1.1.0 a regra do aviso usava 1422 px e nunca disparava; a régua certa é o teto do
  popup: `window.innerWidth > 1280`. Erro de 1ª pessoa registrado na lição 15 da aula.
- Em 1.1.1, quando o painel está mais largo que o teto: o conteúdo é alinhado a 1280 px (nada fica
  escondido atrás da rolagem do popup), o aviso em cinza explica o motivo e o atalho **Tela cheia**
  abre a rota de página inteira. O aviso e o alinhamento são desligados em página cheia.
- Relato do defeito para o time do produto: `RELATORIO-DEFEITO-POPUP.md` (reprodução sem depender
  desta extensão — a extensão de exemplo em `lg` já estoura em janela de 1200 px —, medições,
  causa com as duas réguas, três correções possíveis e o script de medição).
- **Permissão define a estratégia de consulta** (v1.0.8). `omni.chats.listByQueue(queueId)` é
  **exclusivo de supervisor/administrador**: para um agente ele responde
  `"Only supervisors can list service requests from a queue."` — e `omni.queues.list()` devolve
  apenas as filas do próprio agente (18, contra 94 de um administrador). Por isso o painel lê
  `omni.session.getPermissions()` e escolhe: `isAdmin || isSupervisor || isSuperAdmin` → visão
  global por fila; caso contrário → `omni.chats.listMine()` (os atendimentos do próprio agente).
  O modo usado aparece no rodapé do Diagnóstico do SDK.
  Sintoma antigo: logado como agente, a varredura batia em 3 filas sem permissão e abortava com
  "Consulta interrompida após 3 falhas seguidas" — parecia limite de canal, era permissão.
  Falha de permissão numa fila agora é contada e ignorada, sem derrubar a varredura.
- **SDK real medido em sessão (host 14.2.5, `omni.sdkVersion` 1.4.0)** — o capítulo do manual
  documenta bem menos do que existe. Namespaces expostos: `bus, cart, channel, chatPanel, chats,
  contacts, crm, data, forms, handlers, http, nav, on/off, products, queueTypes, queues, ready,
  runAutomation, session, state, storage, tasks, tickets, ui, users`. Deste recorte, o cenário 3
  usa `queues.list()` (94 filas), `users.list()` (44 usuários) e `chats.listByQueue(queueId)`.
- **Lacuna do Host**: `omni.chats.transfer` e `omni.chats.select` estão expostos no SDK, mas
  devolvem `Service not found.` em qualquer forma de chamada testada (objeto, posicional,
  `userId`, `queueId`) — o método é roteado e não existe serviço do outro lado. Método realmente
  inexistente dá outro erro (`is not a function`), então a distinção é confiável. Leitura
  (`chats.get`, `getSelected`, `tickets.list`), `ui.toast`, `ui.confirm`, `ui.close`,
  `ui.openContribution` e `nav.navigate` funcionam.
  Por isso o painel trata a falha e oferece a ação que funciona ("Abrir no painel de agentes").
- **Custo da varredura**: consultar as 94 filas leva ~19 s (uma chamada por fila, ~200 ms cada).
  O canal da instalação tem limite declarado de 10 req/s (rajada 20, 3 estouros derrubam);
  o laço é sequencial e espaçado, e aborta após 3 falhas seguidas em vez de insistir.
