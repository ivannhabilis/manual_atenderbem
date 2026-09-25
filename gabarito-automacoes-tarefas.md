# GABARITO — Avaliação técnica: base das Automações e Módulo de Tarefas (AtenderBem)

Formulário: https://docs.google.com/forms/d/e/1FAIpQLSeBOWRUqJKLkStXGg02u9h7h44vrZSz3vdwkzSFpF3H27pdOg/viewform
10 questões. Respostas fundamentadas no bundle de produção
`static-fe.atenderbem.com/140001/pt/main.js` + chunks lazy (`438.js`, `549.js`)
e no manual omni-channel (construído da plataforma real).

## Respostas (letra = índice da alternativa: A=0, B=1, C=2, D=3)

| # | Resposta | Texto da alternativa |
|---|----------|----------------------|
| 1 | C | Criar um Fluxo de Automação centralizado com a regra de validação e apenas chamá-lo dentro da URA de cada fila por meio do elemento de execução de fluxo. |
| 2 | B | O fluxo está no contexto do CRM (variáveis de chat vazias); usar o elemento "Abrir Atendimento" (ou "Buscar Atendimento" pelo telefone) antes de enviar a mensagem. |
| 3 | B | As automações são sequenciais e as filas "Não Oficial" (WA MD) têm limite de cadência de 4 automações por minuto. |
| 4 | C | Nas Configurações Gerais da instância, no campo "Fila para notificações". |
| 5 | C | Ativar "Salvar log de execuções (48 horas)", reproduzir e verificar no painel de debug as variáveis de entrada e o nó com valor vazio/indefinido. |
| 6 | B | O fluxo deve estar com a opção "Permitir execução em tarefas" ativada. |
| 7 | A | No início do horário agendado. |
| 8 | B | As tarefas concluídas são mantidas e as pendentes/não concluídas são excluídas. |
| 9 | B | O agente só pode executar uma tarefa por vez; ao iniciar outra, a anterior é interrompida automaticamente. |
| 10 | A | Administradores definem múltiplos responsáveis e editam tarefas de outros; agentes criam tarefas vinculadas a si mesmos. |

## Envio rápido

1. C
2. B
3. B
4. C
5. C
6. B
7. A
8. B
9. B
10. A

## Evidências por questão

**Q1 — C.** O editor de URA (IVR) possui o tipo de widget `execAutomation` ("Executar fluxo de automação"), permitindo chamar um fluxo centralizado. enum `IvrWidgetType`: `execAutomation=27`. Evita duplicar a regra de validação em 10 URAs.

**Q2 — B.** O elemento "Enviar mensagem" (`message`) é `availableAt:EXCEPT_PHONE` e depende de um atendimento/chat; no contexto do CRM as variáveis de chat iniciam vazias. Os elementos "Abrir atendimento" (`openChat`, `availableAt:AUTOMATION`) e "Buscar atendimento" (`searchChat`, `availableAt:AUTOMATION`) preparam o atendimento antes do envio.

**Q3 — B.** Aviso do próprio painel de Automações: "Automações utilizando filas WA MD estão limitadas a **4 automações por minuto**"; "WA Cloud API ... 600 automações por minuto". WAMD = conexão **não oficial** ("...quando a fila for com conexão não oficial (WAMD)").

**Q4 — C.** Em `chunk_438.js` (Configuração Geral): `h="Configuração Geral"`, `x="Fila para notificações"`, `y="Nenhuma"` (ao lado de `k="Fila para automações de contato"`). O elemento "Enviar notificação" (`sendNotification`) envia "para um ou mais usuários do sistema".

**Q5 — C.** `chunk_438.js`: "próximas 48 horas, para depuração. Após esse período o log é desativado automaticamente." — label `Mo="Salvar log de execuções (48 horas)"`.

**Q6 — B.** `chunk_438.js`: opção `at="Permitir execução em tarefas"` → `to="Permite selecionar essa automação para ser executada automaticamente no vencimento de uma tarefa."`

**Q7 — A.** Task dialog (main.js): campos "Vencimento", "Agendamento: Início/Término", "Ação:". O handler `notificationWithActionHandler` é acionado quando chega o horário do agendamento: *"Você possui uma chamada agendada para agora com ... Deseja iniciar a chamada?"* → o disparo ocorre no início do horário agendado. (confiança média)

**Q8 — B.** Elemento `clearOpportunityTasks` (label na URA `limparTarefas = "Limpar tarefas não concluídas"`; no palette, título "Limpar tarefas da oportunidade"), recebe `{opportunityId}`. O nome do elemento delimita a ação às tarefas **não concluídas**. Não existe o conceito de "lixeira temporária" em nenhum ponto do bundle (a alternativa A é falsa na mecânica). (confiança média)

**Q9 — B.** Manual `produtividade.html` (seção 10.1): *"Mantenha uma tarefa por vez. Ao iniciar outra, a anterior é interrompida automaticamente."*

**Q10 — A.** Permissões de usuário (`chunk_438.js`): `Si="Permitir criar tarefas para outros"` → *"Se habilitado, esse usuário poderá criar tarefas para qualquer outro usuário do sistema."* (default: tarefa vinculada a si). O diálogo "Selecionar responsáveis" (`single=false`) permite múltiplos responsáveis; papéis `typeLabels={0:Administrador,1:Supervisor,2:Agente}`. Alternativas B/C/D são factualmente falsas.

## CONFIRMAÇÃO OFICIAL (viewscore)

O feedback oficial do formulário confirma TODAS as 10 respostas deste gabarito (10/10).
Justificativas oficiais (texto do viewscore):

- Q1: "Centralizar o processo em um Fluxo de Automação e reutilizá-lo nas URAs otimiza a manutenção e evita retrabalho. Qualquer alteração na API ou regra é feita em um único ponto e reflete em todas as filas."
- Q2: "Analogia da 'carta sem destinatário': no contexto do CRM, o fluxo herda variáveis da oportunidade, mas as variáveis de chat iniciam vazias. Para enviar mensagem, é obrigatório abrir ou associar um atendimento previamente."
- Q3: "O processamento em massa ocorre elemento por elemento em sequência. Filas não oficiais possuem rate limit de 4 automações/min (contra até 600/min em Cloud API Meta). O tempo de espera é o comportamento normal da plataforma."
- Q4: "O envio de notificações internas ... utiliza a fila previamente configurada em Configurações Gerais da instância."
- Q5: "O modo de Debug (com retenção por 48 horas) permite inspecionar as variáveis disponíveis no início da execução, os nós percorridos e identificar onde os valores retornaram vazios ou indefinidos."
- Q6: "Para que um fluxo fique visível na seleção de vencimento de tarefas, é mandatório que a permissão 'Permitir a execução em tarefas' esteja habilitada nas configurações do fluxo de automação."
- Q7: "Conforme validado em testes práticos, as ações automáticas configuradas no agendamento são disparadas no exato início do horário programado."
- Q8: "O elemento mantém as tarefas que já foram marcadas como concluídas e remove/exclui permanentemente todas as tarefas pendentes vinculadas à oportunidade."
- Q9: "O sistema aplica a regra de unicidade operacional: o agente só pode executar uma tarefa por vez. Dar play em outra tarefa interrompe automaticamente a anterior."
- Q10: "Administradores podem delegar tarefas para múltiplos responsáveis na criação manual e têm permissão para visualizar e editar tarefas de qualquer colaborador."

## Observações de confiança (pré-envio)

- Q1–Q6, Q9, Q10: alta (termo/string exata no bundle ou no manual).
- Q7 e Q8: média — deduzidas da semântica do produto; Q7 pela mensagem de notificação no horário agendado, Q8 pelo nome do elemento x ausência do conceito de "lixeira". Ambas CONFIRMADAS pelo feedback oficial.

## Envio do formulário

O formulário exige login Google (campo Email obrigatório). O provedor de browser desta sessão
retornou "no CDP endpoint" — a submissão automática precisa do operador autenticar a conta Google
na sessão do browser. As respostas acima estão prontas para preenchimento manual.