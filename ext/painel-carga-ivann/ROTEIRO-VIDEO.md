# Roteiro de narração — Painel de Carga dos Agentes (Ivann)

Vídeo: `/home/hermes/videos/painel-carga-ivann.mp4`
Extensão: `ivann.painel-carga` · versão **1.0.8** · menu superior (topMenu), modo diálogo
Duração: 3min57 · 1440x838 · sem áudio (grave a sua narração por cima)
Legendas prontas: `legendas.srt` (mesma divisão de tempo deste roteiro)

Os tempos foram tirados do próprio vídeo. Se sobrar tempo num bloco, respire e espere o próximo;
se faltar, corte o que estiver entre parênteses.

Números que aparecem na tela deste vídeo: **19** atendimentos abertos · **15** sem agente ·
**46.367 min** de espera do mais antigo · **10** filas com atendimento. Na tabela por agente:
"sem agente" com 8 filas e 15 abertos, e "Ivann Ribeiro" com 2 filas e 4 abertos.
Se você gravar em outro dia, troque estes números pelos que aparecerem na tela.

---

## 0:00 – 0:32 | TELA: o sistema aberto, sem o painel

"Neste vídeo eu apresento a extensão que eu desenvolvi para o módulo de Extensões do AtenderBem.
O objetivo dela é simples de dizer e chato de fazer à mão: dar ao supervisor, numa tela só,
a foto da carga de atendimento da operação."

## 0:32 – 1:02 | TELA: o mouse subindo até o ícone no menu superior

"Quando o supervisor precisa saber quem está sobrecarregado, ele abre o painel de agentes, depois
o histórico de chats, depois a lista de filas — e no fim ainda tem que agir em outra tela. A ideia
aqui é juntar a visão e a ação no mesmo lugar. A extensão fica neste ícone, na barra superior."

## 1:02 – 1:12 | TELA: clique no ícone e o diálogo abrindo, com o selo v1.0.8

"Cliquei, e o sistema abre o painel. No cabeçalho estão o nome, a versão que está no ar — v1.0.8 —
e o perfil desta sessão: gerente, administrador, visão global. Esse selo não é enfeite: extensão
publicada vive de cache, e eu quero saber num relance qual versão o navegador carregou."

## 1:12 – 1:30 | TELA: a barra de progresso percorrendo o topo

"O painel precisa consultar fila por fila. Esta barra é essa varredura: são noventa e quatro
filas, uma de cada vez e com pausa entre elas. A pausa é técnica — o canal da extensão tem limite
de requisições por segundo, e disparar tudo de uma vez faria o próprio sistema derrubar o canal."

## 1:30 – 1:48 | TELA: os quatro cartões do topo

"Terminada a varredura: dezenove atendimentos abertos, quinze deles sem agente. A espera do mais
antigo é de quarenta e seis mil minutos, e isso não é erro de conta: é ambiente de teste, com
atendimento parado há semanas. E dez filas têm atendimento em aberto."

## 1:48 – 2:00 | TELA: as duas tabelas

"Na primeira tabela, a carga agrupada: 'sem agente' com oito filas e quinze atendimentos, e o
agente Ivann Ribeiro com duas filas e quatro. Na segunda, linha por linha, só quem está sem
agente — e os que passaram do limite de espera aparecem em vermelho."

## 2:00 – 2:20 | TELA: clique na linha e a lista de agentes

"Agora sair da visão e agir. Clico numa linha: o atendimento fica selecionado, com número, fila,
contato e espera. Depois escolho o destino nesta lista de agentes."

## 2:20 – 2:36 | TELA: o diálogo de confirmação do sistema

"Antes de executar, a extensão chama o diálogo de confirmação do próprio sistema. Isso é
deliberado: transferir mexe em dado real. O diálogo mostra o atendimento, a fila e o destino.
Eu confirmo."

## 2:36 – 3:20 | TELA: a faixa azul com a mensagem e o bloco de diagnóstico

"E aqui eu preciso ser honesto: isso é resultado de investigação, não de suposição. O sistema não
aceitou a transferência por extensão nesta versão — o método omni.chats.transfer existe no SDK,
mas do outro lado não tem serviço; a resposta foi Service not found. Eu testei sete formas
diferentes de chamada, inclusive transferência por fila, e todas devolvem o mesmo erro. Leitura
de dados, avisos e navegação funcionam normalmente.

Em vez de esconder, o painel mostra a mensagem e oferece o caminho que funciona. É para isso que
existe este bloco, o Diagnóstico do SDK: ele lista, na sessão real, cada namespace e cada método
que o SDK expõe, marca quais dos métodos do cenário existem, e informa o modo de consulta usado."

## 3:20 – 3:32 | TELA: segunda ação e a confirmação

"Como a transferência por extensão não está disponível neste ambiente, a extensão oferece a ação
que fecha o fluxo: abrir o painel de agentes para tratar o atendimento manualmente. Também passa
por confirmação."

## 3:32 – 3:57 | TELA: troca de tela e quadro final

"Confirmo, o sistema troca de tela e o painel se fecha, revelando o painel de agentes — onde o
supervisor conclui a transferência pelos controles nativos do produto. Resumindo: consulta dados
reais das noventa e quatro filas, agrupa a carga, destaca os atendimentos sem agente e o tempo de
espera, e executa a ação sempre com confirmação antes. Obrigado."

---

## Observação sobre perfil (importante para entender o painel)

A consulta se adapta ao perfil de quem está logado — ajuste feito na versão 1.0.8:

- **Administrador / supervisor** → visão global: varre as filas uma a uma, porque só supervisor
  pode listar os atendimentos de uma fila.
- **Agente** → visão dos próprios atendimentos: usa a lista dos atendimentos dele, porque o
  sistema recusa a listagem por fila para quem não supervisiona
  ("Only supervisors can list service requests from a queue.").

O modo usado aparece no rodapé do Diagnóstico do SDK. Se você gravar logado como agente, a linha
de sessão mostra "seus atendimentos" e a tabela do agente terá uma linha só (a sua).

## Antes de gravar

- Deixe o painel FECHADO e a plataforma carregada: os primeiros segundos do vídeo são o sistema
  sem o painel.
- Comece a falar em 0:00 junto com a imagem. O clique no ícone acontece por volta de 1:02.
- O diálogo de confirmação fica na tela por volta de 2:20 — use esse tempo para ler a mensagem.
- Os números são do momento da gravação; o significado de cada cartão e de cada coluna não muda.
