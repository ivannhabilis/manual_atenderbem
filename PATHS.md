# Catálogo de Paths — AtenderBem (fastcorte.atenderbem.com)

Levantamento dos paths (rotas) do sistema, extraído do bundle de produção
(`static-fe.atenderbem.com/140001/pt/main.js` + chunks lazy) e cruzado com:
- sessão real da plataforma (referência: skill `live-platform-manual`, módulos observados ao vivo);
- servidor MCP `omni-config` (categorias de configuração confirmadas).

Aplicação: SPA Angular com `PathLocationStrategy` (URLs limpas, sem `#`).
Layout principal sob `/base`. Rota `/**` (wildcard) redireciona para `/error`.

Estrutura de pastas espelhada em `~/manual-omnichannel/`:
cada path virou um diretório (parâmetros `:id` / `:uuid` viraram `[id]` / `[uuid]`).
O path raiz `/` (tela de login) virou a pasta `login`.

Total: 124 paths navegáveis catalogados.

---

## Raiz (fora de /base)

| Path | Pasta | Observação |
|---|---|---|
| `/` | `login/` | Tela de login (campos User, Password, botão "Log in" — observado em sessão real) |
| `/externalnewchat` | `externalnewchat/` | Chat externo (novo) |
| `/alreadyLogged` | `alreadyLogged/` | Estado "já logado" |
| `/f/:id/:uuid` | `f/[id]/[uuid]/` | Formulário externo por id + uuid (ex.: formulário de pesquisa) |
| `/error` | `error/` | Tela de erro (destino do wildcard `/**`) |

## /base — layout principal (menu)

| Path | Pasta | Label observado |
|---|---|---|
| `/base` | `base/` | Layout base (shell com menu) |
| `/base/dashboard` | `base/dashboard/` | — |
| `/base/agentdashboard` | `base/agentdashboard/` | Agent Dashboard ("Dashboard and Indicators") |
| `/base/agenttasksdashboard` | `base/agenttasksdashboard/` | Tasks (My tasks) |
| `/base/agentschedulesdashboard` | `base/agentschedulesdashboard/` | Schedules (escalas) |
| `/base/agentchat` | `base/agentchat/` | Chat do agente |
| `/base/internalchat` | `base/internalchat/` | Internal Chat |
| `/base/queuepanel` | `base/queuepanel/` | Filas (painel) |
| `/base/crmpanel` | `base/crmpanel/` | CRM (Sales funnel) |
| `/base/ticketspanel` | `base/ticketspanel/` | Tickets (Kanban) |
| `/base/monitoringonly` | `base/monitoringonly/` | Monitoramento (somente leitura) |
| `/base/addressbookmobile` | `base/addressbookmobile/` | Contatos (versão mobile) |
| `/base/about` | `base/about/` | Sobre |

## /base/config — Configurações (ConfigurationModule, lazy)

Módulo carregado sob demanda (chunks 816/549/894/214/76/438).
Submenu observado em sessão real: Queues, Users, Breaks, Campaigns, Auto-dialer,
Surveys, Assistants, CRM and Tasks, Contacts, Automation, Records, Labels, Groups,
Ticket, Custom Reports, Productivity Monitoring, Audit Log, General.

| Path | Pasta | Correlação (MCP / observado) |
|---|---|---|
| `/base/config` | `base/config/` | Settings (página de configurações) |
| `/base/config/userslist` | `base/config/userslist/` | Users (48 usuários observados) |
| `/base/config/queueslist` | `base/config/queueslist/` | Filas de atendimento (MCP: queues_*) |
| `/base/config/uralist` | `base/config/uralist/` | URAs |
| `/base/config/ivreditor` | `base/config/ivreditor/` | Editor de URA/IVR |
| `/base/config/assistantslist` | `base/config/assistantslist/` | Assistentes de IA (MCP: assistants_*) |
| `/base/config/assistanteditor` | `base/config/assistanteditor/` | Editor de assistente |
| `/base/config/campaignslist` | `base/config/campaignslist/` | Campanhas (MCP: campaigns_*) |
| `/base/config/dialercampaignslist` | `base/config/dialercampaignslist/` | Auto-dialer (campanhas de discagem) |
| `/base/config/surveyformslist` | `base/config/surveyformslist/` | Surveys (formulários de pesquisa) |
| `/base/config/surveyformsbuilder/:id` | `base/config/surveyformsbuilder/[id]/` | Builder de survey |
| `/base/config/customreportslist` | `base/config/customreportslist/` | Custom Reports (lista) |
| `/base/config/customreporteditor` | `base/config/customreporteditor/` | Custom Reports (editor) |
| `/base/config/tagslist` | `base/config/tagslist/` | Etiquetas / Labels (MCP: tags_*) |
| `/base/config/chattagslist` | `base/config/chattagslist/` | Etiquetas de atendimento (MCP: chat_tags_*) |
| `/base/config/contactgroupslist` | `base/config/contactgroupslist/` | Grupos de contatos |
| `/base/config/internalgroupslist` | `base/config/internalgroupslist/` | Grupos internos |
| `/base/config/visualgrouplist` | `base/config/visualgrouplist/` | Grupos visuais |
| `/base/config/contactextrafieldlist` | `base/config/contactextrafieldlist/` | Campos extras de contato (MCP: contact_extra_fields_*) |
| `/base/config/contactautomationlist` | `base/config/contactautomationlist/` | Automação de contatos |
| `/base/config/triggerslist` | `base/config/triggerslist/` | Gatilhos de atendimento (MCP: triggers_*) |
| `/base/config/keywordstriggerslist` | `base/config/keywordstriggerslist/` | Gatilhos de mensagens (MCP: keyword_triggers_*) |
| `/base/config/faqslist` | `base/config/faqslist/` | FAQs (MCP: faqs_*) |
| `/base/config/newslist` | `base/config/newslist/` | Notícias |
| `/base/config/actionslist` | `base/config/actionslist/` | Ações |
| `/base/config/reasonslist` | `base/config/reasonslist/` | Motivos (Reasons) |
| `/base/config/predefinedtextslist` | `base/config/predefinedtextslist/` | Textos predefinidos |
| `/base/config/templatelist` | `base/config/templatelist/` | Modelos (Templates) |
| `/base/config/htmltemplatelist` | `base/config/htmltemplatelist/` | Templates HTML |
| `/base/config/documentstemplatelist` | `base/config/documentstemplatelist/` | Templates de documentos |
| `/base/config/formflowslist` | `base/config/formflowslist/` | Fluxos de formulário |
| `/base/config/customformslist` | `base/config/customformslist/` | Formulários personalizados (MCP: forms_*) |
| `/base/config/informationcardslist` | `base/config/informationcardslist/` | Cards de informação |
| `/base/config/cataloglist` | `base/config/cataloglist/` | Catálogo de produtos (MCP: products_*) |
| `/base/config/cardeditor` | `base/config/cardeditor/` | Editor de card |
| `/base/config/cardeditorv2` | `base/config/cardeditorv2/` | Editor de card v2 |
| `/base/config/originslist` | `base/config/originslist/` | Origens |
| `/base/config/webhookcapturelist` | `base/config/webhookcapturelist/` | Capturas de webhook (MCP: webhook_captures_*) |
| `/base/config/generalconfig` | `base/config/generalconfig/` | General (configurações gerais) |
| `/base/config/auditlog` | `base/config/auditlog/` | Audit Log (registro de auditoria) |
| `/base/config/debugviewer` | `base/config/debugviewer/` | Debug viewer |
| `/base/config/apidoc` | `base/config/apidoc/` | API Documentation (observado em Filas: botão "API Documentation") |
| `/base/config/licenseslist` | `base/config/licenseslist/` | Licenças |
| `/base/config/holidayslist` | `base/config/holidayslist/` | Feriados |
| `/base/config/businesshourslist` | `base/config/businesshourslist/` | Horários de funcionamento |
| `/base/config/galerylist` | `base/config/galerylist/` | Galeria |
| `/base/config/pm-applications` | `base/config/pm-applications/` | Productivity Monitoring — aplicações |
| `/base/config/pm-scoring-profiles` | `base/config/pm-scoring-profiles/` | Productivity Monitoring — perfis de scoring |
| `/base/config/pm-scoring-profiles/:id` | `base/config/pm-scoring-profiles/[id]/` | Perfil de scoring (detalhe) |
| `/base/config/pm-settings` | `base/config/pm-settings/` | Productivity Monitoring — configurações |
| `/base/config/pm-title-rules` | `base/config/pm-title-rules/` | Productivity Monitoring — regras de título |
| `/base/config/tickets-service-groups` | `base/config/tickets-service-groups/` | Tickets — service groups |
| `/base/config/tickets-classifications` | `base/config/tickets-classifications/` | Tickets — classificações |
| `/base/config/tickets-reasons` | `base/config/tickets-reasons/` | Tickets — motivos |
| `/base/config/tickets-email-config` | `base/config/tickets-email-config/` | Tickets — config de e-mail |
| `/base/config/tickets-stage-flows` | `base/config/tickets-stage-flows/` | Tickets — fluxos de etapa |
| `/base/config/tickets-system-config` | `base/config/tickets-system-config/` | Tickets — config do sistema |
| `/base/config/pbx-extensions` | `base/config/pbx-extensions/` | PBX — ramais |
| `/base/config/pbx-trunks` | `base/config/pbx-trunks/` | PBX — troncos |
| `/base/config/pbx-inbound-routes` | `base/config/pbx-inbound-routes/` | PBX — rotas de entrada |
| `/base/config/pbx-outbound-routes` | `base/config/pbx-outbound-routes/` | PBX — rotas de saída |
| `/base/config/pbx-ring-groups` | `base/config/pbx-ring-groups/` | PBX — grupos de toque |
| `/base/config/pbx-recordings` | `base/config/pbx-recordings/` | PBX — gravações |
| `/base/config/pbx-debug` | `base/config/pbx-debug/` | PBX — debug |

## /base/partner — Painel de parceiros (PartnersPanelModule, lazy)

| Path | Pasta | Observação |
|---|---|---|
| `/base/partner` | `base/partner/` | Partner panel |
| `/base/partner/billingpanel` | `base/partner/billingpanel/` | Billing (faturamento) |
| `/base/partner/instancespanel` | `base/partner/instancespanel/` | Instâncias |
| `/base/partner/partnerstats` | `base/partner/partnerstats/` | Estatísticas do parceiro |
| `/base/partner/partnerstyles` | `base/partner/partnerstyles/` | Estilos do parceiro |

## /base/reports — Relatórios

Submenu observado em sessão real: Chat History, Scheduled Reopenings, Opportunity
History, Agents, Queues, Break Report, CDR and Recordings, Abandoned, Tickets,
Records in AutoSend, Monitoring, Inactive Users, Productivity.

| Path | Pasta | Label / correlação |
|---|---|---|
| `/base/reports` | `base/reports/` | Reports |
| `/base/reports/kpidashboard` | `base/reports/kpidashboard/` | Service Interactions (KPI — observado) |
| `/base/reports/crmdashboard` | `base/reports/crmdashboard/` | CRM Dashboard |
| `/base/reports/crmdashboardperuser` | `base/reports/crmdashboardperuser/` | CRM by user (observado em Custom Reports) |
| `/base/reports/monitordashboard` | `base/reports/monitordashboard/` | Monitoring |
| `/base/reports/monitorreport` | `base/reports/monitorreport/` | Monitoring (relatório) |
| `/base/reports/tasksdashboard` | `base/reports/tasksdashboard/` | Tasks (relatório) |
| `/base/reports/ticketsdashboard` | `base/reports/ticketsdashboard/` | Tickets (relatório) |
| `/base/reports/tickets-sla-detail` | `base/reports/tickets-sla-detail/` | Tickets — detalhe SLA |
| `/base/reports/tickets-top-problems` | `base/reports/tickets-top-problems/` | Tickets — top problemas |
| `/base/reports/tickets-top-clients` | `base/reports/tickets-top-clients/` | Tickets — top clientes |
| `/base/reports/ticketsvolumetria` | `base/reports/ticketsvolumetria/` | Tickets — volumetria |
| `/base/reports/tickets-agent-performance` | `base/reports/tickets-agent-performance/` | Tickets — performance do agente |
| `/base/reports/tickets-audit` | `base/reports/tickets-audit/` | Tickets — auditoria |
| `/base/reports/tickets-history` | `base/reports/tickets-history/` | Tickets — histórico |
| `/base/reports/tickets-company` | `base/reports/tickets-company/` | Tickets — por empresa |
| `/base/reports/surveyformsdashboard` | `base/reports/surveyformsdashboard/` | Surveys (relatório) |
| `/base/reports/chatshistory` | `base/reports/chatshistory/` | Chat History (Service report — observado) |
| `/base/reports/chatshistoryagent` | `base/reports/chatshistoryagent/` | Chat History por agente |
| `/base/reports/addressbook` | `base/reports/addressbook/` | Contacts (Contatos e Empresas — observado, 510 contatos) |
| `/base/reports/abandonedreport` | `base/reports/abandonedreport/` | Abandoned (abandonadas) |
| `/base/reports/agentstablereport` | `base/reports/agentstablereport/` | Agents (relatório tabular) |
| `/base/reports/timesreport` | `base/reports/timesreport/` | Tempos |
| `/base/reports/timelapsereport` | `base/reports/timelapsereport/` | Time lapse |
| `/base/reports/evaluationsreport` | `base/reports/evaluationsreport/` | Avaliações |
| `/base/reports/cdrreport` | `base/reports/cdrreport/` | CDR and Recordings (Ligações e Gravações) |
| `/base/reports/cdrreportnew` | `base/reports/cdrreportnew/` | CDR (novo) |
| `/base/reports/capturesreport` | `base/reports/capturesreport/` | Capturas |
| `/base/reports/queuereport` | `base/reports/queuereport/` | Queues (relatório de filas) |
| `/base/reports/autosendhistory` | `base/reports/autosendhistory/` | Records in AutoSend (histórico auto-envio) |
| `/base/reports/opportunityhistory` | `base/reports/opportunityhistory/` | Opportunity History (observado) |
| `/base/reports/reopenreport` | `base/reports/reopenreport/` | Scheduled Reopenings (reaberturas agendadas) |
| `/base/reports/inactiveusersreport` | `base/reports/inactiveusersreport/` | Inactive Users |
| `/base/reports/pmteamdashboard` | `base/reports/pmteamdashboard/` | Productivity — Team |
| `/base/reports/pmagentreport` | `base/reports/pmagentreport/` | Productivity — Agent |
| `/base/reports/customreport` | `base/reports/customreport/` | Custom Reports (lista — observado: "Service Interactions" abre a lista) |
| `/base/reports/customreport/:id` | `base/reports/customreport/[id]/` | Visualizador público de relatório (módulo lazy 123; usa API cubejs/getReportStructure) |

---

## Fontes

1. Bundle de produção `main.js` (19.4 MB) + chunks lazy (`438.js` ConfigurationModule,
   `467.js` PartnersPanelModule, `123.js` CustomReportPublicRoutingModule) —
   extração das rotas Angular (`path:`, `children:`, `loadChildren`).
2. Sessão real da plataforma (referência da skill `live-platform-manual`):
   URLs confirmadas (`/base/reports/kpidashboard`), labels do menu e submenus,
   contagem de usuários/contatos.
3. MCP `omni-config` (`config_capabilities`): categorias de configuração e
   ferramentas, usadas para correlacionar os paths de `/base/config`.

Observação: `/**` (wildcard) existe no roteador e redireciona para `/error`;
não é uma tela, por isso não ganhou pasta própria.
