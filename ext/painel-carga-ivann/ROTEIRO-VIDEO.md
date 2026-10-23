# Roteiro de narração — Painel de Carga dos Agentes (Ivann)

Vídeo: `/home/hermes/videos/painel-carga-ivann.mp4` (3min51, sem áudio)
Versão com as legendas gravadas na imagem: `/home/hermes/videos/painel-carga-ivann-legendado.mp4`
Extensão: `ivann.painel-carga` · versão **1.1.1** · menu superior (topMenu), modo diálogo
Legendas: `legendas.srt` (mesma divisão de tempo deste roteiro)

Os tempos foram medidos no próprio vídeo: o popup abre em 1:02, a barra de varredura vai de 1:03 a
1:27 e o diálogo de confirmação aparece em 2:10. Se sobrar tempo num bloco, respire e espere o
próximo; se faltar, corte o trecho entre parênteses.

Números que aparecem na tela deste vídeo: **19** atendimentos abertos · **19** sem agente ·
**46.567 min** de espera do mais antigo · **9** filas com atendimento. Como todos os atendimentos
estão sem agente, a tabela de carga tem uma linha só ("sem agente", com 9 filas e 19 abertos).
Se você gravar em outro dia, troque estes números pelos que aparecerem na tela.

---

## 0:00 – 0:14 | TELA: o sistema aberto, sem o painel

"Neste vídeo eu apresento a extensão que eu desenvolvi para o módulo de Extensões do AtenderBem."

## 0:14 – 0:28 | TELA: a página de indicadores, mouse parado

"O objetivo dela é simples de dizer e chato de fazer à mão: dar ao supervisor, numa tela só, a foto
da carga de atendimento da operação."

## 0:28 – 0:50 | TELA: o mouse subindo até o ícone no menu superior

"Quando o supervisor precisa saber quem está sobrecarregado, ele abre o painel de agentes, depois o
histórico de chats, depois a lista de filas — e no fim ainda tem que agir em outra tela. A ideia
aqui é juntar a visão e a ação no mesmo lugar. A extensão fica neste ícone, na barra superior."

## 0:50 – 1:02 | TELA: clique no ícone e o painel abrindo

"Cliquei. Ele já começa a trabalhar."

## 1:02 – 1:20 | TELA: a barra de progresso percorrendo o topo

"Esta barra é a varredura: noventa e quatro filas, uma de cada vez, com pausa entre elas. A pausa é
técnica — o canal da extensão tem limite de requisições por segundo, e disparar tudo de uma vez
faria o próprio sistema derrubar o canal."

## 1:20 – 1:36 | TELA: o cabeçalho (selo v1.1.1, botões Tela cheia / Atualizar) e o aviso em cinza

"No cabeçalho estão o nome, a versão que está no ar — v1.1.1 —, o perfil desta sessão e o atalho
Tela cheia. O aviso em cinza explica o motivo: o popup do sistema tem teto de mil duzentos e oitenta
pixels de largura, e num monitor mais largo que isso a parte direita do painel ficaria escondida
atrás da barra de rolagem do próprio popup. Na página cheia o painel usa a janela inteira."

## 1:36 – 1:56 | TELA: os quatro cartões do topo e a tabela de carga

"Terminada a varredura: dezenove atendimentos abertos, e os dezenove estão sem agente. A espera do
mais antigo é de quarenta e seis mil e quinhentos minutos — não é erro de conta: é ambiente de
teste, com atendimento parado há semanas. E nove filas têm atendimento em aberto."

## 1:56 – 2:10 | TELA: clique na linha e a lista de agentes

"Agora sair da visão e agir. Clico numa linha: o atendimento fica selecionado, com número, fila,
contato e tempo de espera. Depois escolho o destino nesta lista de agentes."

## 2:10 – 2:23 | TELA: o diálogo de confirmação do sistema

"Antes de executar, a extensão chama o diálogo de confirmação do próprio sistema. Isso é
deliberado: transferir mexe em dado real. O diálogo mostra o atendimento, a fila e o destino.
Eu confirmo."

## 2:23 – 3:11 | TELA: a faixa azul com a mensagem e o bloco de diagnóstico

"E aqui eu preciso ser honesto: isso é resultado de investigação, não de suposição. O sistema não
aceitou a transferência por extensão nesta versão — o método omni.chats.transfer existe no SDK,
mas do outro lado não tem serviço; a resposta foi Service not found. Eu testei sete formas
diferentes de chamada, inclusive transferência por fila, e todas devolvem o mesmo erro. Leitura de
dados, avisos e navegação funcionam normalmente.

Em vez de esconder, o painel mostra a mensagem e oferece o caminho que funciona. É para isso que
existe este bloco, o Diagnóstico do SDK: ele lista, na sessão real, cada namespace e cada método que
o SDK expõe, marca quais dos métodos do cenário existem e informa o modo de consulta usado."

## 3:11 – 3:20 | TELA: segunda ação e a confirmação

"Como a transferência por extensão não está disponível neste ambiente, a extensão oferece a ação que
fecha o fluxo: abrir o painel de agentes para tratar o atendimento manualmente. Também passa por
confirmação."

## 3:20 – 3:51 | TELA: troca de tela e quadro final

"Confirmo, o sistema troca de tela e revela o painel de agentes — onde o supervisor conclui a
transferência pelos controles nativos do produto. Resumindo: o painel consulta dados reais das
noventa e quatro filas, agrupa a carga, destaca os atendimentos sem agente e o tempo de espera, e
executa a ação sempre com confirmação antes. Obrigado."

---

## Duas observações que valem saber antes de gravar

**Perfil de quem está logado.** A consulta se adapta ao perfil:

- **Administrador / supervisor** → visão global: varre as filas uma a uma, porque só supervisor
  pode listar os atendimentos de uma fila.
- **Agente** → visão dos próprios atendimentos: usa a lista dos atendimentos dele, porque o
  sistema recusa a listagem por fila para quem não supervisiona
  ("Only supervisors can list service requests from a queue.").

O modo usado aparece no rodapé do Diagnóstico do SDK. Se gravar logado como agente, a linha de
sessão mostra "seus atendimentos" e a tabela do agente terá uma linha só (a sua).

**Teto de largura do popup.** O popup do sistema fica preso em 1280 px e o diálogo da extensão
ocupa 90% da janela: acima de ~1422 px de janela (comum em monitor 2K/4K) o popup cria barra
horizontal. Não é do conteúdo da extensão — é do Host. Desde a 1.1.1 o painel alinha o conteúdo a
1280 px (nada fica escondido), o atalho **Tela cheia** abre o painel na janela inteira e o aviso em
cinza na tela explica o motivo — o aviso só aparece quando o painel está mais largo que o teto.

## Antes de gravar

- Deixe o painel FECHADO e a plataforma carregada: o início do vídeo é o sistema sem o painel.
- Comece a falar em 0:00 junto com a imagem. O clique no ícone acontece por volta de 0:50.
- O diálogo de confirmação fica na tela por volta de 2:10 — use esse tempo para ler a mensagem.
- Este vídeo tem 3min51; se você narra mais devagar, aumente as pausas no meio dos blocos (nunca no
  meio de uma frase).
