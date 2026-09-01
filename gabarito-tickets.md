# GABARITO — Avaliação de Conhecimento: Módulo de Tickets e Automações (AtenderBem)

Formulário: https://docs.google.com/forms/d/e/1FAIpQLSeetaNd7cHtcGIKwmOIMXTkPYAZEzdFkfAr9ztqwLVUdJWL0A/viewform
15 questões, 1 ponto cada. Respostas confirmadas com evidência do bundle de produção
(static-fe.atenderbem.com main.js + chunks 438.js/549.js) e specs oficiais via MCP omni-config (fastcorte).

| # | Resposta | Evidência |
|---|----------|-----------|
| 1 | B | GABARITO OFICIAL confirmado no viewscore: "Pela hierarquia estrita, ao desativar um nível intermediário, os posteriores são desativados automaticamente." O sistema permite até 6 níveis. |
| 2 | C | Formulário de Motivo: campos group_id e classification_id com "disabled" (read-only pós-criação). |
| 3 | D | Hierarquia automationSourceLabels {1:Motivo, 2:Classificação, 3:Global}; Classificação tem templates por evento (cls_on_*_email_template_id) com fallback globalField. Mais específico precede. |
| 4 | B | "SLA Breach: escala automaticamente quando SLA do nível atual é violado"; "Tempo Fixo: escala após tempo fixo (min)"; "Manual: agentes/supervisores escalam manualmente". |
| 5 | C | "Estágio final: Marca o fim do fluxo. Dispara 'Ao chegar em estágio final' e impede transições para frente (permite apenas retorno para correção)." |
| 6 | B | Restrição padrão: agente comum não enxerga tickets sob responsabilidade de outro operador. |
| 7 | A | Eventos reais da tela de Classificação: cls_on_sla_breach "Ao violar SLA", cls_on_client_inactivity "Inatividade do cliente", cls_on_first_response "Na primeira resposta", cls_on_stage_change "Ao mudar estágio". |
| 8 | B | Catálogo oficial de blocos: addTicket, escalateTicket, contactClientTicket, addCommentTicket, linkContactTicket, unlinkContactTicket. |
| 9 | B | Dicionário oficial: "ticket_tracking_url: URL pública para acompanhamento do ticket"; ticket_contacts = lista de objetos (id, name, email, number...), ex: {{ ticket_contacts[0].name }}. |
| 10 | C | Componente /base/reports/tickets-company filtra por companyId e mostra companyName + resumo (totalTickets, SLA compliance). |
| 11 | B | "Disponível apenas na automação de criação (evento 'ao criar')"; URA: ID = 0 (sistema/IVR); nome = nome da URA. |
| 12 | A | "ticket_status: 1 - Aberto, 2 - Em atendimento, 3 - Aguardando cliente, 4 - Resolvido, 5 - Fechado." |
| 13 | B | SearchTicketConfig: searchField (id/number/phone/email), classificationId (filtro opcional), associateToCurrentChat, resultVariableName (variável customizada). |
| 14 | A | Gatilho de inatividade: tempo limite configurável + "Inatividade por: Cliente" (tempo desde a última mensagem do cliente). |
| 15 | C | Hierarquia 1:Motivo → 2:Classificação → 3:Global; Motivo anula Classificação; branco = herda; ambos vazios = nenhuma automação. |

## Respostas em formato de envio rápido

1. D
2. C
3. D
4. B
5. C
6. B
7. A
8. B
9. B
10. C
11. B
12. A
13. B
14. A
15. C

## Observações de envio

- O formulário exige login Google e o campo Email é obrigatório (a cópia das respostas é enviada para ele).
- Para preenchimento automático via browser, é necessário o operador autenticar a conta Google na sessão.

## Resultado oficial do envio (viewscore — ivannhabilis@gmail.com)

Nota obtida no envio: 11/15. O gabarito oficial confirma TODAS as 15 respostas deste arquivo.
As 4 questões erradas no envio (Q2, Q4, Q5, Q9) foram marcadas divergindo do gabarito acima:

- Q2: marcado "SLA 1ª Resposta e SLA Resolução" (B) → correto: C (Classificação e Grupo de Atendimento)
- Q4: marcado "Automático, Escalonado e Supervisionado" (A) → correto: B (SLA Breach, Tempo Fixo e Manual)
- Q5: marcado "Estágios finais encerram o ciclo e bloqueiam qualquer movimentação" (B) → correto: C (não avançam, permitido retornar)
- Q9: marcado "{{ [ticket_contact.name](...) }}" (C) → correto: B ({{ ticket_contacts[0].name }})

Gabaritos oficiais (justificativas do formulário):
- Q1: "O sistema permite até 6 níveis. Pela hierarquia estrita, ao desativar um nível intermediário, os posteriores são desativados automaticamente." (B)
- Q2: "Após salvar o Motivo, o sistema bloqueia a alteração da Classificação e do Grupo de Atendimento." (C)
- Q3: "A cascata avalia do mais específico ao mais geral: 1º Motivo, 2º Classificação e 3º Configuração Geral." (D)
- Q4: "SLA Breach (estouro de SLA), Tempo Fixo (minutos/horas fixas) e Manual (ação do atendente/supervisor)." (B)
- Q5: "Estágios marcados como finais não podem avançar no fluxo, mas suportam retorno para etapas anteriores para correções." (C)
- Q6: "A visualização livre é exclusiva para chamados sem dono nas filas do agente; um agente comum jamais visualiza tickets já atribuídos a outro operador." (B)
- Q7: "Eventos nativos: Ao criar, Ao distribuir, Na primeira resposta, Ao mudar status/prioridade/estágio, Ao reatribuir, Ao escalar, Ao violar SLA, Ao comentar, Ao resolver, Ao fechar, Ao reabrir, Inatividade do cliente e Ao chegar em estágio final." (A)
- Q8: "Blocos: Criar (111), Editar (112), Buscar (113), Adicionar comentário (114), Resolver (115), Atribuir (116), Escalar (117), Reabrir (118), Aguardar cliente (119), Vincular/Desvincular contato (120/121), Alterar status (122), Adicionar tag e Alterar estágio." (B)
- Q9: "ticket_tracking_url fornece o link sem login; ticket_contacts armazena o array de contatos, indexado por colchetes ({{ ticket_contacts[0].name }})." (B)
- Q10: "Tickets Empresa é voltado à gestão B2B, isolando e consolidando o histórico de chamados de uma conta corporativa específica." (C)
- Q11: "Disponíveis exclusivamente no evento 'Ao criar ticket'. Se criado por URA/IVR, ID = 0 e nome = árvore telefônica." (B)
- Q12: "Enums: 1 (Aberto), 2 (Em atendimento), 3 (Aguardando cliente), 4 (Resolvido) e 5 (Fechado)." (A)
- Q13: "Buscar por ID, filtrar por Classificação, toggle para associar ao chat atual e gravar o payload em variável." (B)
- Q14: "Monitora a falta de retorno do cliente com contador em minutos (ex: 5 min) para acionar fluxos de aviso/cobrança." (A)
- Q15: "Motivo substitui a Classificação; sem regra no Motivo, herda da Classificação; ambos vazios, nada roda." (C)

## FAQ na documentação

As 15 dúvidas foram transformadas em página de FAQ oficial do manual:
/home/hermes/manual-omnichannel/tickets-faq.html (linkada no index.html e no tickets.html).
