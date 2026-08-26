# GUIA DE COLABORAÇÃO HUMANO-MÁQUINA: MANUAL OMNICHANNEL
**Projeto:** Documentação AtenderBem & PABX Fácil  
**Repositório:** `/home/hermes/manual-omnichannel`  

Este documento reúne o Procedimento Operacional Padrão (SOP) para o colaborador humano revisar, editar, substituir imagens e versionar a documentação em conjunto com o agente Hermes.

---

## 1. Como Revisar o Conteúdo Visualmente no Navegador

A forma recomendada de auditar a documentação é visualizando o site estático renderizado:

1. **Iniciar o Servidor HTTP Local:**
   ```bash
   python3 -m http.server 8000 --directory /home/hermes/manual-omnichannel
   ```
2. **Acessar no Navegador:**
   - Na rede interna: `http://172.16.16.132:8000/index.html`
   - Na mesma máquina: `http://localhost:8000/index.html`
3. **Atualização em Tempo Real:**
   - Qualquer alteração de texto ou imagem nos arquivos HTML é refletida instantaneamente pressionando `F5` (Refresh) no navegador.

---

## 2. Como Modificar Textos e Imagens Manualmente

### A. Edição de Textos e Estrutura HTML
- Todos os arquivos de conteúdo estão na raiz: `/home/hermes/manual-omnichannel/`
- Podem ser editados diretamente pelo **VS Code** (conectado via SSH/Remote) ou pelo terminal com `nano nome-do-arquivo.html`.
- O projeto utiliza HTML5 semântico limpo:
  - Parágrafos: `<p>...</p>`
  - Itens de lista: `<ul><li>...</li></ul>`
  - Passos numerados: `<ol class="steps"><li>...</li></ol>`
  - Destaques informativos: `<div class="callout tip">...</div>` (ou `.info` / `.warn`)
  - Tabelas: `<div class="table-wrap"><table class="doc">...</table></div>`

### B. Substituição ou Inclusão de Imagens (Prints)
1. Salve o novo print com formato `.png` na pasta de assets:
   `/home/hermes/manual-omnichannel/assets/`
2. No arquivo HTML correspondente, aponte a tag da imagem:
   ```html
   <figure class="figure">
     <img src="assets/seu-novo-print.png" alt="Descrição da tela">
     <figcaption>Legenda explicativa do que a imagem apresenta.</figcaption>
   </figure>
   ```

---

## 3. Como Versionar e Fazer Commit sem Conflito com a IA

O Git permite colaboração paralela perfeita seguindo os passos:

```bash
# 1. Acessar a pasta do projeto
cd /home/hermes/manual-omnichannel

# 2. Inspecionar o que foi alterado
git status
git diff

# 3. Adicionar as alterações e commitar localmente
git add .
git commit -m "docs: revisao manual de texto no capitulo de filas"

# 4. Enviar para o repositório remoto
git push origin main
```

*(Dica de Produtividade: Você pode apenas salvar suas edições manuais nos arquivos e solicitar ao Hermes: **"Hermes, revisei os arquivos, faça o commit e o push"**).*

---

## 4. Boas Práticas Essenciais do Colaborador Humano

| Pilar | O que fazer (Recomendado) | O que evitar |
| :--- | :--- | :--- |
| **Segurança e Privacidade** | Usar exemplos genéricos nos tutoriais (`suporte@suaempresa.com.br`, `551199999999`). | Nunca inserir senhas reais, tokens de API ou logins de produção nos arquivos HTML/Markdown. |
| **Padronização Visual** | Reaproveitar as classes CSS existentes em `assets/style.css` (`.callout`, `.table-wrap`, `.steps`). | Evitar estilos inline desnecessários (`style="..."`) que quebrem o design responsivo. |
| **Integridade do Git** | Manter a branch `main` limpa e verificar `git status` antes de grandes alterações. | Não comitar arquivos temporários ou lixo de sistema na raiz. |
| **Interação com o Hermes** | Pedir revisões automatizadas: *"Hermes, valide se há tags HTML não fechadas no arquivo X"*. | Não se preocupar com retrabalho de formatação — a IA ajusta a sintaxe sob demanda. |

---

## 5. Mapa dos Arquivos de Documentação

- `index.html` — Página inicial com cards de navegação para todos os módulos.
- `tickets.html` — Módulo completo de Tickets (Kanban + 6 telas de configuração).
- `estudo-de-caso-tickets.md` — Roteiro de configuração de tickets passo a passo.
- `pabx.html` — Portal mestre de Telefonia VoIP e PABX Fácil.
- `pabx-troncos.html` — Troncos SIP convencionais e WhatsApp Cloud API (Meta).
- `pabx-rotas.html` — Rotas de Entrada (DIDs) e Rotas de Saída (Dial Patterns).
- `pabx-ramais.html` — Gestão de Ramais PJSIP, MicroSIP e Webphone no AtenderBem.
- `pabx-filas.html` — Filas de atendimento, regras de distribuição e transbordo.
- `pabx-ura-audios.html` — Gravações do sistema, anúncios e menus de URA/IVR.
- `pabx-horarios.html` — Time Groups e Time Conditions (expediente comercial).
- `pabx-custom.html` — Custom Destinations e integração ARI Bridge com URA.
- `pabx-cdr-auditoria.html` — Análise de CDR, detecção de recusas e queries SQL.
- `pabx-cli-troubleshooting.html` — Comandos CLI Asterisk e resolução de problemas.
- `assets/` — Folha de estilos (`style.css`) e imagens/prints do sistema.
