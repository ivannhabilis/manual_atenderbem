# Roteiro de narração — vídeo da extensão "Painel de Carga dos Agentes (Ivann)"

Duração-alvo: 4 a 6 minutos. Fale em ritmo normal; os blocos abaixo estão na ordem em que a
tela deve aparecer. Onde estiver **[TELA]**, é o que precisa estar visível naquele momento.

Identificação da entrega
- Extensão: `ivann.painel-carga` — "Painel de Carga dos Agentes (Ivann)"
- Versão publicada: 1.0.0
- Manifesto (dev): https://cdn.a-tend.online/ivann.painel-carga/manifest_dev.json
- Onde aparece: menu superior (topMenu), em modo diálogo

---

## Bloco 1 — Abertura (0:00–0:30) — [TELA: a extensão aberta, painel com os números]

"Neste vídeo eu mostro a extensão que eu desenvolvi para o módulo de Extensões do AtenderBem.
Ela se chama Painel de Carga dos Agentes, está publicada na versão 1.0.0 e aparece no menu
superior do sistema. O objetivo é simples: dar ao supervisor, numa única tela, a foto da carga
de atendimentos — quantos atendimentos estão abertos por fila, quais estão sem agente e há
quanto tempo o mais antigo está esperando — e, a partir daí, permitir a ação: transferir um
atendimento para outro agente, com confirmação antes de executar."

## Bloco 2 — O problema que ela resolve (0:30–1:10) — [TELA: painel aberto, cartões no topo]

"Hoje, para saber quem está sobrecarregado, o supervisor precisa abrir mais de uma tela: o
painel de agentes, o histórico de chats e a lista de filas. A extensão junta isso num lugar só
e acrescenta o que faltava — a ação. Repare nos quatro cartões do topo: total de atendimentos
abertos, quantos estão sem agente, a espera do atendimento mais antigo e em quantas filas há
atendimento em aberto."

## Bloco 3 — Onde ela é declarada no manifesto (1:10–1:50) — [TELA: manifest.json]

"A extensão é declarada por um manifesto. O identificador global é `ivann.painel-carga`, no
formato fornecedor ponto extensão, que fica congelado na primeira publicação. A contribuição
é do tipo `topMenu`, em modo diálogo, com título em português e em inglês e ícone próprio.
Também declarei dois campos de configuração que o administrador preenche na instalação: os
minutos de espera que disparam o destaque em vermelho e uma lista de filas a ignorar."

## Bloco 4 — Onde ela é instalada (1:50–2:30) — [TELA: tela de Extensões instaladas]

"A autoria e a instalação são coisas diferentes, feitas por pessoas diferentes. Quem cria e
publica é o administrador, no Editor de Extensões. Quem instala, habilita ou desabilita é o
superusuário, na tela de Extensões instaladas. A instalação recebe a URL pública do manifesto,
o servidor busca o arquivo, valida, confere o CORS e só então cadastra a extensão. Aqui na
instalação eu também preencho os campos de configuração que o manifesto declarou."

## Bloco 5 — A lógica aplicada (2:30–3:40) — [TELA: painel aberto; passar o mouse pela tabela]

"A lógica é esta. Ao abrir, a extensão conversa com o sistema pelo SDK injetado no iframe, o
objeto `omni`. Ela lê quem é o usuário da sessão com `omni.session.getUser`, lê a instância com
`getInstance`, e carrega os atendimentos disponíveis. Em seguida ela agrupa por agente e por
fila, conta os atendimentos de cada combinação e calcula o tempo de espera do mais antigo de
cada grupo. A tabela ordena do mais crítico para o menos crítico, e pinta de vermelho quem
passou do limite de minutos que eu configurei. Quem está sem agente aparece etiquetado, porque
é justamente quem precisa de ação primeiro."

## Bloco 6 — A ação, com confirmação (3:40–4:30) — [TELA: clicar numa linha e transferir]

"Seleciono uma linha da tabela — o atendimento fica marcado e aparece no campo de seleção.
Escolho o agente de destino na lista e clico em Transferir. Antes de executar qualquer coisa,
a extensão chama `omni.ui.confirm` e mostra este diálogo de confirmação. Isso é deliberado: a
transferência mexe em dados reais, então nada acontece sem o aceite explícito do usuário. Confirmo,
e a extensão chama `omni.chats.transfer` para o agente escolhido, avisa por toast e recarrega
os números."

## Bloco 7 — Diagnóstico e honestidade técnica (4:30–5:20) — [TELA: abrir o "Diagnóstico do SDK"]

"Na parte de baixo tem um bloco de diagnóstico. Ele lista quais namespaces e métodos do SDK
existem de fato nesta sessão e qual dos métodos previstos no cenário está presente. Eu deixei
isso à vista de propósito: o cenário pedia uma visão global por fila, com contagem de todos os
agentes e identificação de quem está sem agente. A extensão entrega essa visão a partir do que
o SDK expõe; o que o SDK não expõe, aparece aqui marcado como ausente, em vez de ser inventado.
Prefiro mostrar o que é real a fingir uma funcionalidade que não existe."

## Bloco 8 — Fechamento (5:20–5:50) — [TELA: painel aberto]

"Resumindo: a extensão está publicada na versão 1.0.0, instalada e funcionando, aparece no menu
superior, lê dados reais, destaca os casos críticos e executa a transferência com confirmação.
É isso."

---

## Observações para a gravação

- Falar devagar nos blocos 5 e 6 — são os que provam a interação em tempo real.
- No bloco 6, mostre o diálogo de confirmação parado por 2 ou 3 segundos antes de clicar.
- No bloco 7, role o texto do diagnóstico devagar, para o avaliador conseguir ler.
- Se a instância tiver poucos atendimentos abertos na hora, o bloco 5 fica curto: diga que a
  tabela reflete o movimento do momento e que atualiza sozinha quando a lista de chats muda.
