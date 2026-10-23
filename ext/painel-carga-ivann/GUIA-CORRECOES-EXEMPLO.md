# Guia — corrigir os dois defeitos na "Extensão de Exemplo" (aprendizagem)

Este guia é para você fazer, com as próprias mãos, na extensão `exemplo.painel`
("Extensão de Exemplo"). São os mesmos dois defeitos que apareceram no Painel de Carga,
explicados do começo: o que causa, como enxergar, como corrigir e como provar que corrigiu.

Regra de ouro: **medir antes de mexer**. Os dois defeitos foram encontrados medindo, não olhando.

---

## Defeito 1 — Barra de rolagem horizontal no painel

### O que causa
Uma tabela HTML, por padrão (`table-layout: auto`), é dimensionada pelo **conteúdo**: o navegador
calcula a largura mínima que o conteúdo exige e **não deixa a tabela ficar menor que isso**. Se a
largura mínima passar da largura disponível, o navegador não corta nem quebra o layout: ele cria
uma barra de rolagem horizontal.

Soma-se a isso outro clássico: `min-width` fixo em campos (`input`, `select`). Um `min-width: 210px`
dentro de um flex que não pode encolher empurra o conteúdo para fora do container.

### Como enxergar (DevTools)
1. Abra o painel da extensão.
2. Clique com o botão direito dentro do painel → **Inspecionar**. Confirme no topo do DevTools que
   você está no frame da extensão (o seletor de contexto de frame), não na página principal.
3. No Console (dentro do frame), rode:

```js
const de = document.documentElement;
({ clientW: de.clientWidth, scrollW: de.scrollWidth, temBarra: de.scrollWidth > de.clientWidth + 1 });
```

Se `temBarra` for `true`, existe conteúdo maior que a área. Para achar QUEM estoura:

```js
[...document.querySelectorAll('*')].filter(el => el.scrollWidth > el.clientWidth + 1)
  .map(el => el.tagName + '.' + el.className);
```

A leitura útil: `scrollWidth` é o conteúdo; `clientWidth` é a área visível. Conteúdo > área = barra.

Dica de teste: não dependa do tamanho da sua janela. Redimensione o elemento para provar que o
layout aguenta qualquer largura:

```js
const f = document.querySelectorAll('iframe')[1];  // na página principal, não no frame
```

Ou, mais simples na prática: encolha a janela do navegador e observe.

### Como corrigir
Quatro mudanças, todas no CSS:

```css
/* 1. a tabela obedece a largura do container em vez do conteúdo */
table { width: 100%; max-width: 100%; table-layout: fixed; }

/* 2. texto longo quebra dentro da célula em vez de empurrar a coluna */
th, td { overflow-wrap: anywhere; word-break: break-word; }

/* 3. largura de cada coluna declarada (com table-layout:fixed, quem manda é o th) */
table.carga th:nth-child(1) { width: 40%; }
table.carga th:nth-child(2) { width: 16%; }
table.carga th:nth-child(3) { width: 16%; }
table.carga th:nth-child(4) { width: 28%; }

/* 4. campos encolhem em vez de criar piso */
select, input { width: 100%; min-width: 0; max-width: 100%; }
label { min-width: 0; flex: 1 1 200px; }

/* trava final */
html, body { max-width: 100%; overflow-x: hidden; }
```

E, no HTML, dê uma classe às tabelas que precisam de largura controlada:

```html
<table class="carga"> … </table>
```

### Por que `table-layout: fixed` resolve
Com `fixed`, o navegador **não** consulta o conteúdo para decidir a largura: ele usa a largura da
tabela (100% do container) e as larguras declaradas nos `th`. A partir daí o conteúdo é obrigado a
caber — e é por isso que a quebra de palavra (`overflow-wrap`) precisa vir junto.

### Como provar que corrigiu
```js
const de = document.documentElement;
de.scrollWidth === de.clientWidth;   // precisa ser true
```
Teste em várias larguras (1280, 1000, 800, 640, 480, 400, 360, 320). Se em TODAS os dois números
forem iguais, não existe mais rolagem horizontal.

---

## Defeito 2 — "Promise rejeitada sem tratamento: omni.ui.resize(altura) exige uma altura numérica positiva"

### O que causa (duas coisas somadas)
**1. A chamada sem argumento.** O manual mostra `omni.ui.resize()` sem parâmetro, mas nesta versão
o método **exige uma altura numérica positiva**. Chamada vazia = rejeição.

**2. O erro não é uma exceção, é uma Promise rejeitada.** `resize()` devolve uma Promise. Um
`try/catch` só pega erro lançado na hora (síncrono). Uma Promise rejeitada **escapa do try/catch** e
vira "unhandled rejection" — por isso a mensagem diz "sem tratamento".

Código que eu tinha (errado):

```js
try { O.ui.resize(); } catch (e) {}     // não pega rejeição de Promise
```

### Como enxergar
No Console do frame da extensão, force o erro e observe:

```js
omni.ui.resize();      // rejeita
omni.ui.resize(0);     // rejeita (precisa ser positiva)
omni.ui.resize(300);   // ok
```

Para ver rejeições que passariam despercebidas, registre um tratador:

```js
window.addEventListener('unhandledrejection', ev => console.log('REJEITADA:', ev.reason));
```

E, no `ResizeObserver`, cuidado com rajada: cada mudança de layout dispara o observador. Oito erros
iguais no console foram exatamente isso.

### Como corrigir
```js
let agendado = null;
function ajustarAltura(){
  if (agendado) return;                      // agrupa a rajada do ResizeObserver
  agendado = setTimeout(() => {
    agendado = null;
    try{
      if (!omni || typeof omni.ui.resize !== 'function') return;
      const conteudo = Math.ceil(document.body.scrollHeight || 1);
      const h = Math.max(1, Math.min(660, conteudo));   // positiva e com teto
      const r = omni.ui.resize(h);
      if (r && typeof r.catch === 'function') r.catch(() => {});   // absorve a rejeição
    }catch(e){}
  }, 150);
}
```

Três decisões aqui, e cada uma tem motivo:
- `Math.max(1, ...)` → garante o "numérica positiva" que a API exige.
- `Math.min(660, ...)` → passar a altura real faz o Host **aplicar** o resize; sem teto, o diálogo
  cresce até 1084px e passa da tela. Com teto, fica dentro da janela.
- `r.catch(() => {})` → é o que trata a Promise; o `try/catch` continua ali só para erro síncrono.

E registre o observador assim:

```js
if (window.ResizeObserver) new ResizeObserver(() => ajustarAltura()).observe(document.body);
window.addEventListener('load', ajustarAltura);
```

### Como provar que corrigiu
No Console do frame:
```js
window.addEventListener('unhandledrejection', ev => console.log('REJEITADA:', ev.reason));
```
Abra e feche o painel, clique em Atualizar, redimensione a janela. Console limpo = corrigido.
Complemento: no DevTools, aba **Console**, marque "Preserve log" e recarregue — não deve sobrar
nenhuma linha vermelha.

---

## Como aplicar isso na Extensão de Exemplo (passo a passo)

1. **Configurações › Extensões** (`/base/extensions-editor`). Localize "Extensão de Exemplo".
2. Abra o rascunho. Se não houver rascunho, use a ação de criar/clonar versão — a publicada é
   imutável, então a edição sempre acontece no rascunho.
3. Grave o arquivo `index.html` corrigido (o editor aceita colar o conteúdo) e ajuste a `version`
   do manifesto para algo maior que a última publicada (ex.: `0.1.4`).
4. Rode a verificação do editor. Corrija todo erro antes de publicar.
5. **Publicar** — e depois **mover o ponteiro `dev`** para a versão nova. Publicar não coloca no ar;
   quem coloca é o ponteiro.
6. Feche e reabra o painel para carregar a versão nova.

## Duas armadilhas que valem saber
- **Cache.** O arquivo da versão tem URL nova (`v/<versão>/index.html`), então versão nova não fica
  velha. Mas o **manifesto** é que decide qual versão carregar: se ele não atualizar no seu
  navegador, você continua na versão antiga sem perceber. Um selo de versão visível na tela resolve
  essa dúvida em um relance — foi por isso que coloquei `v1.0.6` no cabeçalho do painel.
- **Limite de versões.** A plataforma aceita **5 versões publicadas** por extensão. Na sexta é
  preciso apagar uma antiga (`extensions_delete_version`) que **não** esteja apontada por `prod`/`dev`.
  Publicar é imutável: rollback se faz movendo o ponteiro, não editando.
