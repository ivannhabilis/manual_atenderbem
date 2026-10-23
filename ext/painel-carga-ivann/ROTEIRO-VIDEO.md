# Roteiro de narração — Painel de Carga dos Agentes (Ivann)

Vídeo: `/home/hermes/videos/painel-carga-ivann.mp4`
Extensão: `ivann.painel-carga` · versão **1.0.7** · menu superior (topMenu), modo diálogo
Duração: 4min41 · 1440x838 · sem áudio (grave a sua narração por cima)
Legendas prontas: `legendas.srt` (mesma divisão de tempo deste roteiro)

Os tempos foram tirados do próprio vídeo. Se sobrar tempo num bloco, respire e espere o próximo;
se faltar, corte o que estiver entre parênteses.

---

## 0:00 – 0:30 | TELA: o sistema aberto, sem o painel

"Neste vídeo eu apresento a extensão que eu desenvolvi para o módulo de Extensões do AtenderBem.
O objetivo dela é simples de dizer e chato de fazer à mão: dar ao supervisor, numa tela só,
a foto da carga de atendimento da operação."

## 0:30 – 1:06 | TELA: o mouse subindo até o ícone no menu superior

"Quando o supervisor precisa saber quem está sobrecarregado, ele abre o painel de agentes, depois
o histórico de chats, depois a lista de filas, e no fim ainda tem que agir em outra tela. A ideia
aqui é juntar a visão e a ação no mesmo lugar. A extensão fica neste ícone, na barra superior."

## 1:06 – 1:20 | TELA: clique no ícone e o diálogo abrindo, com o selo v1.0.7

"Cliquei, e o sistema abre o painel. No cabeçalho está o nome e a versão que está no ar: v1.0.7.
Esse selo não é enfeite: ele existe para eu ter certeza de qual versão o navegador carregou,
porque extensão publicada vive de cache."

## 1:20 – 1:45 | TELA: a barra de progresso percorrendo o topo

"O painel precisa consultar fila por fila. Esta barra é essa varredura: são noventa e quatro
filas, uma de cada vez e com uma pausa entre elas. O motivo da pausa é técnico: o canal da
extensão tem limite de requisições por segundo, e se eu disparar tudo de uma vez o próprio
sistema derruba o canal."

## 1:45 – 2:05 | TELA: os quatro cartões do topo

"Terminada a varredura, estes são os números que importam. Vinte e sete atendimentos abertos.
Vinte e sete estão sem agente — ou seja, todos. A espera do mais antigo: quarenta e seis mil
minutos, e isso não é erro de conta: é ambiente de teste, com atendimento parado há semanas.
E doze filas com atendimento em aberto."

## 2:05 – 2:22 | TELA: as duas tabelas

"Embaixo, a primeira tabela agrupa a carga por agente: quantas filas ele cobre, quantos
atendimentos estão abertos com ele e a maior espera dele. A segunda desce ao detalhe: um
atendimento por linha, só os que estão sem agente. Quem passou do limite que eu configuro
aparece em vermelho, e a ordem é do mais crítico para o menos crítico."

## 2:22 – 2:42 | TELA: clique na linha, a lista de agentes abrindo

"Agora a parte que interessa: sair da visão e agir. Clico numa linha — o atendimento fica
selecionado e aparece no campo, com número, fila, contato e tempo de espera. Depois escolho o
destino nesta lista de agentes."

## 2:42 – 2:59 | TELA: o diálogo de confirmação do sistema

"Antes de executar, a extensão chama o diálogo de confirmação do próprio sistema. Isso é
deliberado: transferir mexe em dado real. O diálogo mostra exatamente qual atendimento vai sair,
de qual fila, e para quem. Eu confirmo."

## 2:59 – 3:35 | TELA: a faixa azul com a mensagem e, abaixo, o bloco de diagnóstico

"E aqui eu preciso ser honesto com você, porque isso é resultado de investigação, não de
suposição. O sistema não aceitou a transferência por extensão nesta versão: o método
omni.chats.transfer existe no SDK, mas do outro lado não tem serviço — a resposta foi
Service not found. Eu testei sete formas diferentes de chamada, inclusive transferência por
fila, e todas devolvem o mesmo erro. Enquanto isso, leitura de dados, avisos e navegação
funcionam normalmente.

Em vez de esconder, o painel mostra a mensagem e oferece o caminho que funciona. E é para isso
que existe este bloco aqui embaixo, o Diagnóstico do SDK: ele lista, na sessão real, cada
namespace e cada método que o SDK expõe, e marca quais dos métodos previstos no cenário existem.
Eu prefiro mostrar o que é real a fingir uma função que não existe."

## 3:35 – 4:05 | TELA: o texto do diagnóstico rolado

"Repare no que ele mostra: filas, usuários, atendimentos por fila, contatos, tickets, tarefas,
produtos, carrinho, CRM — tudo isso existe e está disponível. O que falta é só a ação de
transferir. Então a diferença entre 'a documentação diz que existe' e 'existe de verdade' foi
medida aqui, em execução, e não copiada de lugar nenhum."

## 4:05 – 4:28 | TELA: segunda ação, confirmação e a troca de tela

"Como a transferência programática não está disponível neste ambiente, a extensão oferece a ação
que fecha o fluxo: abrir o painel de agentes para tratar o atendimento manualmente. Também passa
por confirmação. Confirmo, o sistema troca de tela e o painel se fecha, revelando o painel de
agentes — que é onde o supervisor conclui a transferência pelos controles nativos do produto."

## 4:28 – 4:41 | TELA: quadro final

"Resumindo: a extensão está publicada e instalada, aparece no menu superior, consulta dados reais
das noventa e quatro filas, agrupa a carga por agente, destaca os atendimentos sem agente e o
tempo de espera, e executa a ação escolhida sempre com confirmação antes. Obrigado."

---

## Antes de gravar

- Deixe o painel FECHADO e a plataforma carregada: os primeiros segundos do vídeo são o sistema
  sem o painel.
- Comece a falar em 0:00 junto com a imagem. O clique no ícone acontece por volta de 1:06.
- Se a varredura (bloco 1:20) demorar mais na sua máquina, não tem problema: a barra de progresso
  cobre o tempo morto e é justamente onde a pausa entre filas fica visível.
- Os números são do momento da gravação. Se você gravar em outro dia, eles mudam — o que não muda
  é o significado de cada cartão e de cada coluna.
