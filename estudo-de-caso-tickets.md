# ESTUDO DE CASO PRÁTICO: CONFIGURAÇÃO DO MÓDULO DE TICKETS (ATENDERBEM)
**Ambiente:** https://fastcorte.atenderbem.com
**Empresa:** FastCorte (Central de Manutenção e Assistência Técnica)

---

## 1. Ordem de Dependência dos Cadastros
Para configurar o módulo de Tickets do zero sem erros de dependência, siga rigorosamente a sequência abaixo:

1. `tickets-system-config` (Regras Globais e Horários)
2. `tickets-email-config` (Servidor de E-mail e Notificações)
3. `tickets-service-groups` (Equipes e Usuários)
4. `tickets-stage-flows` (Etapas e Colunas do Kanban)
5. `tickets-classifications` (Categorias Pai)
6. `tickets-reasons` (Motivos Filhos)

---

## 2. Passo a Passo Detalhado da Configuração

### Passo 1: Configurações Gerais do Sistema (`/base/config/tickets-system-config`)
- **Protocol Prefix:** `TK` (gera protocolos no padrão `TK-YYYYMMDD-XXXXX`)
- **Business Hours Schedule:** Segunda a Sexta, das 08:00 às 18:00
- **Pause SLA on Pending Statuses:** `Ativado (True)` (congela o tempo em status de espera)
- **Auto-Close Inactive Days:** `7 dias` (fecha chamados sem retorno do cliente)
- **Allow Customer Reopen:** `Desativado (False)`
- **Max Attachment Size:** `10 MB`

### Passo 2: Configuração de E-mail (`/base/config/tickets-email-config`)
- **SMTP Host:** `smtp.fastcorte.com.br` | **Porta:** `587` (TLS)
- **Sender Name & Address:** `Suporte FastCorte <suporte@fastcorte.com.br>`
- **Template de Abertura:**
  > "Olá {contact_name}, seu chamado sobre '{subject}' foi registrado sob o protocolo **{protocol}**. Previsão de resposta: {sla_due_at}."

### Passo 3: Criar Grupo de Atendimento (`/base/config/tickets-service-groups`)
- **Group Name:** `Equipe Técnica de Campo`
- **Members:** Selecionar os técnicos especialistas
- **Supervisors:** Selecionar o Gerente de Operações
- **Routing Policy:** `Menor Carga (Least Busy)`
- **Status:** `Ativo`

### Passo 4: Criar Fluxo de Etapas do Kanban (`/base/config/tickets-stage-flows`)
- **Flow Name:** `Atendimento Técnico Industrial`
- **Etapas cadastradas:**
  1. `Open` (Azul - Inicial)
  2. `Triagem Técnica` (Amarelo - Em Andamento)
  3. `Aguardando Peça` (Roxo - Pausado)
  4. `Em Manutenção` (Laranja - Em Andamento)
  5. `Concluído` (Verde - Finalizado)

### Passo 5: Cadastrar Classificação Pai (`/base/config/tickets-classifications`)
- **Classification Name:** `Assistência de Máquinas Laser`
- **Color:** Roxo (`#6c3fb5`)
- **Default Service Group:** `Equipe Técnica de Campo`
- **Default Stage Flow:** `Atendimento Técnico Industrial`
- **Status:** `Ativo`

### Passo 6: Cadastrar Motivos de Abertura (`/base/config/tickets-reasons`)
- **Motivo 1:** `Substituição de Espelho Óptico`
  - **Classificação:** `Assistência de Máquinas Laser`
  - **Prioridade Padrão:** `High`
  - **SLA de Resolução:** `8 horas úteis`
  - **Require Resolution Note:** `Sim`
- **Motivo 2:** `Calibração de Foco`
  - **Classificação:** `Assistência de Máquinas Laser`
  - **Prioridade Padrão:** `Medium`
  - **SLA de Resolução:** `24 horas úteis`
  - **Require Resolution Note:** `Sim`
