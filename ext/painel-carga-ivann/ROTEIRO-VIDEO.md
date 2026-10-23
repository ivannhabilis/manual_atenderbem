# Roteiro de narração — vídeo da extensão "Painel de Carga dos Agentes (Ivann)"

Arquivo do vídeo: `/home/hermes/videos/painel-carga-ivann.mp4` (1440x838, ~3min, sem áudio).
Grave a sua narração por cima. Os tempos abaixo são os do vídeo gravado.

Identificação da entrega
- Extensão: `ivann.painel-carga` — "Painel de Carga dos Agentes (Ivann)"
- Versão publicada: 1.0.2 (CDN dev: `https://cdn.a-tend.online/ivann.painel-carga/manifest_dev.json`)
- Onde aparece: menu superior (contribuição `topMenu`, modo diálogo) — visível a administrador, supervisor e agente.

---

## Bloco 1 — 0:00 a 0:35 — [TELA: o sistema, o mouse indo ao ícone do menu e o painel abrindo]

"Neste vídeo eu apresento a extensão que desenvolvi para o módulo de Extensões do AtenderBem.
Ela se chama Painel de Carga dos Agentes, está publicada na versão 1.0.2 e aparece aqui no menu
superior, como este ícone de barras. Ao clicar, o sistema abre o painel num diálogo."

## Bloco 2 — 0:35 a 0:55 — [TELA: a barra de progresso e os números aparecendo]

"O painel precisa consultar cada fila para montar o retrato da operação. Esta barra é essa
varredura: são noventa e quatro filas consultadas em sequência, espaçadas de propósito para não
sobrecarregar o canal da extensão. Ao terminar, aparecem os quatro números do topo: atendimentos
abertos, quantos estão sem agente, a espera do mais antigo e em quantas filas há atendimento."

## Bloco 3 — 0:55 a 1:20 — [TELA: os cartões e as duas tabelas]

"O valor aqui é ter tudo num lugar só. Em cima, o resumo. Na primeira tabela, a carga agrupada
por agente, com quantas filas ele cobre, quantos atendimentos estão abertos com ele e há quanto
tempo o mais antigo espera. Na segunda tabela, linha por linha, só os atendimentos que estão sem
agente — que são exatamente os que precisam de decisão. Quem passou do limite de espera que eu
configurei aparece em vermelho; neste ambiente de teste há atendimentos parados há semanas, então
quase tudo está destacado."

## Bloco 4 — 1:20 a 1:35 — [TELA: clicar na linha e abrir a lista de agentes]

"Eu seleciono um atendimento: clico na linha e ele aparece no campo de seleção, com o número, a
fila, o contato e o tempo de espera. Depois escolho para quem transferir — aqui está a lista dos
agentes desta instância."

## Bloco 5 — 1:35 a 1:55 — [TELA: o diálogo de confirmação do sistema]

"Antes de executar qualquer coisa, a extensão chama o diálogo de confirmação do próprio sistema.
Isto é deliberado: a transferência mexe em dados reais, então nada acontece sem o aceite explícito
do usuário. O diálogo mostra exatamente qual atendimento será movido e para quem."

## Bloco 6 — 1:55 a 2:20 — [TELA: a mensagem informativa e o bloco de diagnóstico]

"Aqui eu preciso ser honesto, porque isso é resultado de investigação e não de suposição. Ao
confirmar, o sistema respondeu que não implementa o serviço de transferência: `omni.chats.transfer`
existe no SDK, mas o Host devolve 'Service not found'. Eu testei seis formas diferentes de chamada,
inclusive transferência por fila, e todas devolvem o mesmo erro — enquanto leitura de dados, avisos
e navegação funcionam normal. Em vez de esconder isso, o painel mostra a mensagem e oferece o
caminho que funciona. É por isso que existe este bloco 'Diagnóstico do SDK': ele lista, na sessão
real, todos os namespaces e métodos que o SDK expõe e marca quais dos métodos previstos no cenário
estão presentes. Prefiro mostrar o que é real a fingir uma função que não existe."

## Bloco 7 — 2:20 a 2:50 — [TELA: segunda ação, confirmação e a tela de destino]

"Como a transferência programática não está disponível neste Host, a extensão oferece a ação que
fecha o fluxo: abrir o painel de agentes para tratar o atendimento manualmente. Ela também passa
por confirmação. Confirmo, o sistema troca de tela, e o painel se fecha com `omni.ui.close` —
revelando o painel de agentes aberto, que é onde o supervisor conclui a transferência pelos
controles nativos do produto."

## Bloco 8 — 2:50 ao fim — [TELA: quadro final]

"Resumindo: a extensão está publicada na versão 1.0.2, instalada e habilitada nesta instância,
aparece no menu superior, consulta dados reais das noventa e quatro filas, agrupa a carga por
agente, destaca os atendimentos sem agente e o tempo de espera, e executa a ação escolhida sempre
com confirmação prévia. Obrigado."

---

## Observações para a gravação

- Fale devagar nos blocos 2, 5 e 6 — são os que mostram o funcionamento e a análise técnica.
- No bloco 5 o diálogo fica na tela por cerca de cinco segundos; use esse tempo para ler a frase.
- Se quiser encurtar, os blocos 4 e 8 são os mais fáceis de reduzir.
- O vídeo não tem áudio: a narração é sua; não há trilha nem legenda embutida.
