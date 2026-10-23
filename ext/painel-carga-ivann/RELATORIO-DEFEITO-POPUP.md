# Defeito: o diálogo de extensão fica mais largo que o seu container e cria barra horizontal

**Onde:** extensões com contribuição de menu (`topMenu` / `action`, apresentação em diálogo) — qualquer
tamanho de diálogo, qualquer extensão.
**Quando aparece:** janelas de navegador acima de **1422 px** de largura (comum em monitores 2K e 4K).
Quanto maior a janela, maior a sobra — não é um caso de borda raro: é o padrão em monitor moderno.
**Gravidade:** média-alta (usabilidade). Nada é corrompido, mas a parte direita do painel da extensão
fica inacessível sem arrastar a barra, e não existe correção possível pelo lado da extensão.

---

## 1. Como reproduzir

Não precisa de extensão própria: a **extensão de exemplo** do produto já reproduz.

1. Maximize o navegador numa tela de 2K (2560 px) ou 4K.
2. Abra qualquer extensão instalada que use apresentação em diálogo (a de exemplo serve; no
   tamanho `lg` o defeito começa ainda antes, em janela de 1200 px).
3. Observe a barra de rolagem horizontal no rodapé do diálogo. Arraste: a porção direita do painel
   estava fora da área visível.

## 2. Medições (janela → container → diálogo)

| Janela | `.cdk-overlay-pane.extension-dialog-panel` | `.dialog-x-large.ext-dialog` | Sobra | Barra |
|---|---|---|---|---|
| 1280 | 1280 | 1152 | — | não |
| 1400 | 1280 | 1260 | — | não |
| **1423** | 1280 | **1281** | 1 | **sim** |
| 1440 | 1280 | 1296 | 16 | sim |
| 1920 | 1280 | 1728 | 448 | sim |
| 2560 | 1280 | 2304 | 1024 | sim |
| 3840 | 1280 | 3456 | 2176 | sim |

O corte é aritmético: `0,9 × largura da janela > 1280` → janela acima de **1422,2 px**.
Em `lg` (80vw) a conta muda para `0,8 × janela > 960` → janela acima de **1200 px**.

## 3. Causa

Dois elementos vizinhos medem largura com réguas diferentes:

- O **container** (`.cdk-overlay-pane.extension-dialog-panel`) tem largura **fixa em 1280 px**
  (limitada por `max-width` igual à largura da janela).
- O **diálogo** logo dentro dele (`.dialog-x-large.ext-dialog`) recebe **90vw** — 90% da
  **viewport**, não 90% do pai.

Enquanto `90vw` couber em 1280, o layout funciona por coincidência. Acima disso o filho passa a ser
maior que o pai e quem paga a conta é o primeiro ancestral com rolagem:

```
DIV.dialog-x-large.ext-dialog                  w=2304   (90vw de 2560)
DIV.mat-mdc-dialog-surface.mdc-dialog__surface w=1280   overflow-x: auto  -> ROLA (2304 > 1280)
DIV.cdk-overlay-pane.extension-dialog-panel    w=1280
```

Ou seja: `90vw` num pai de largura fixa. Um é percentual da janela, o outro é pixel.

Observação adicional: o conteúdo da extensão **não** contribui para o defeito. O iframe hospedeiro é
`width:100%; height:100%`, colado no diálogo, e medindo por dentro
(`document.documentElement.scrollWidth` × `clientWidth`) não há estouro em nenhuma largura testada
(de 320 a 3840 px). A rolagem nasce acima do iframe.

## 4. Correção sugerida (qualquer uma resolve)

1. **A mais simples:** `max-width: 100%` no diálogo — o teto do pai passa a valer para o filho.
2. Trocar `vw` por `%` nas classes de tamanho (`dialog-small|medium|large|x-large`), para o diálogo
   medir 90% do **container**, que é o comportamento esperado de um diálogo.
3. Manter o `vw` e fazer o container acompanhar (`width: max-content` / largura pelo diálogo), de modo
   que as duas larguras venham da mesma fonte.

Vale aplicar a mesma revisão a qualquer outro componente que use `vw` dentro de um container de
largura fixa (`action`/`topMenu` em diálogo, e eventualmente modais internos).

## 5. Impacto em quem usa

- Em 2K/4K, a coluna ou o botão que ficam na parte direita do painel da extensão saem da área visível.
  No nosso caso, o atalho que resolve o problema do usuário ficava ele mesmo escondido.
- A extensão não tem como consertar: o SDK expõe `omni.ui.resize(altura)` — **só altura**
  (`post('resize', { height })` no próprio SDK). Não há como pedir largura nem como medir a largura
  do popup por dentro do iframe.
- Mitigação que aplicamos do lado da extensão, enquanto o defeito existir: alinhar o conteúdo a
  1280 px, avisar na tela e oferecer o atalho **Tela cheia** (`omni.nav.openFullscreen`), que abre o
  painel em rota de página inteira — ali não há teto de largura.
- Mitigação do lado do usuário, sem release: manter a janela abaixo de ~1422 px ou aumentar o zoom do
  navegador até a viewport efetiva cair nesse limite.

## 6. Como medir (para reproduzir a evidência)

Com o painel aberto, no console da página (F12 → Console):

```js
(() => {
  const larg = el => el ? Math.round(el.getBoundingClientRect().width) : null;
  let el = document.querySelector('.ext-dialog');
  const linhas = [];
  while (el && el !== document.documentElement){
    const cs = getComputedStyle(el);
    linhas.push({
      elemento: el.tagName + '.' + (el.className || '').toString().replace(/\s+/g, '.').slice(0, 40),
      largura: larg(el), cssWidth: cs.width, maxWidth: cs.maxWidth, overflowX: cs.overflowX,
      rola: el.scrollWidth > el.clientWidth + 1
    });
    el = el.parentElement;
  }
  console.table(linhas);
  console.log('janela:', document.documentElement.clientWidth);
})();
```

A linha com `overflowX: auto` e `rola: true` é o elemento que produz a barra; a divergência entre
`largura` e `maxWidth` nos níveis acima aponta a régua divergente.

---

# Defeito 2 (mesmo relatório): o SDK expõe ações de chat que não têm serviço no Host

`omni.chats.transfer` e `omni.chats.select` aparecem na superfície do SDK, mas **nenhuma chamada
funciona**. Testadas sete formas de assinatura contra um atendimento real, em duas telas diferentes
(painel aberto sobre o dashboard e painel aberto sobre a tela de atendimento):

```
transfer(id, {userId})           -> Service not found.
transfer({id, userId})           -> Service not found.
transfer({chatId, userId})       -> Service not found.
transfer(id, userId)             -> Service not found.
transfer({id, userId, queueId})  -> Service not found.
transfer(id, {userId, queueId})  -> Service not found.
select(id)                       -> Service not found.
```

Não é erro de assinatura (o SDK repassaria um erro de argumento) nem falta de permissão (a mensagem
seria outra): é **ausência de serviço** do outro lado. Nada é alterado — o atendimento continua com
o mesmo responsável depois das tentativas.

**Como a própria plataforma transfere:** pela Socket.IO, dentro da tela de atendimento —

```js
// supervisor
socket.emit("supervisorAction", { type: "transferChat", userId, clientId, queueId, pageId });
// agente
socket.emit("action", { type: "transferChat", userId, chatId, queueId });
```

O SDK de extensões **não expõe socket** (`omni.http.request` faz HTTP, não Socket.IO), então nenhuma
extensão consegue executar a transferência nesta versão — independentemente de assinatura ou
permissão. Caminhos que existem e continuam válidos para leitura: `chats.listByQueue`, `listMine`,
`get`, `getMessages`, `queues.list`, `users.list`.

**Pedido ao time do produto**, uma das três:

1. Implementar o serviço de `chats.transfer` no Host (o caminho é o próprio emit de socket acima).
2. Expor um método explícito de escrita de chat no SDK (`omni.chats.transfer` com assinatura
   documentada), com erro claro quando não houver permissão.
3. Documentar a lacuna na página do SDK, para que quem escreve extensão não perca tempo com um
   método que aparece em `Object.keys(omni.chats)` e nunca responde.

**Lacuna vizinha, mesma família:** `omni.chatPanel.select(chatId)` responde
`The side panel only exists on the service screen, with an open service.` — ou seja, só funciona se
já existir um atendimento aberto; e **não há como abrir um atendimento específico pelo SDK nem por
rota** (a própria UI faz isso internamente com `actions.selectChat(chat)`, via estado em memória).
Consequência prática: uma extensão consegue *navegar* para a tela de atendimento
(`omni.nav.navigate(['/base','agentchat'])`), mas não consegue *selecionar* o atendimento lá.

## Observação sobre usuário sem atendimento de chat

`chatenabled = 0` (caso do administrador `gerente`) faz a tela de atendimento abrir **sem lista de
atendimentos** — comportamento esperado do produto, mas que confunde quem testa uma extensão a partir
do perfil de administrador: a ação "abrir no painel de agentes" parece quebrada quando, na verdade,
o usuário da sessão é que não atende chats. Vale a mensagem explícita na tela (a extensão passou a
avisar).

---

*Relato preparado com medições feitas no produto em 23/10/2026. Reprodução independente de qualquer
extensão de terceiros: qualquer contribuição em diálogo serve — inclusive a extensão de exemplo.*
