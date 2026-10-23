# Aula — como este painel foi construído (e o que treinar a partir dele)

Professor: leia este arquivo com o código aberto ao lado. Cada seção tem uma ideia de programação,
o trecho real que a usa e um exercício. A ordem é a ordem em que eu pensaria o problema de novo.

---

## 1. Antes de escrever código: transformar pedido em requisitos

O pedido era: "mostrar quantos atendimentos abertos cada agente tem por fila, quais estão sem
agente e há quanto tempo o mais antigo espera; e permitir transferir, com confirmação".

Isso vira cinco perguntas técnicas, e cada uma é uma decisão:

1. **Onde isso aparece?** (menu superior, painel lateral, menu da mensagem…) → define o tipo de
   contribuição no manifesto.
2. **De onde vêm os dados?** → define quais métodos do SDK eu preciso.
3. **O que eu faço se o dado não vier?** → define o tratamento de erro e o estado vazio.
4. **Qual é a ação?** → define o que é leitura e o que é escrita.
5. **Como o usuário não se arrepende?** → define a confirmação antes de escrever.

Lição: **requisito vago vira código vago**. As cinco perguntas acima são o mínimo antes de abrir o editor.

---

## 2. Arquitetura: por que uma extensão roda dentro de um iframe

A extensão não roda "dentro" do sistema: ela roda num iframe isolado, e os dois conversam por uma
ponte. O código da extensão não tem acesso ao DOM do sistema, nem o contrário. Essa é uma decisão
de **segurança**: se a extensão travar, o atendimento não trava; se ela tentar mexer no que não
deve, não alcança.

O preço dessa escolha aparece no código: **toda comunicação é assíncrona**. Não existe
`nomeDoUsuario` lido direto — existe `await omni.session.getUser()`.

Lição: entender a arquitetura explica 80% dos "por que isso é tão complicado". A complicação não é
capricho; é a fronteira de segurança sendo respeitada.

---

## 3. Da visão para a ação: o fluxo de dados do painel

O painel tem quatro etapas, e cada uma é uma função separada:

```
carregar()  →  busca os dados no SDK e guarda em `estado`
render()    →  lê `estado` e desenha as tabelas
selecionar()→  guarda qual linha o usuário escolheu
transferir()→  confirma e executa a escrita
```

Isso se chama **separar quem busca de quem desenha**. A vantagem é prática: quando o visual está
errado, eu mexo só no `render()`; quando o dado está errado, mexo só no `carregar()`. Se tudo
estivesse numa função só, cada ajuste seria uma caixa-preta.

O `estado` é um objeto único:

```js
const estado = { chats: [], filas: [], usuarios: [], filaPorId: {}, userPorId: {}, selecionado: null, euId: null };
```

E os dicionários `filaPorId` / `userPorId` existem por um motivo de performance: o chat guarda
apenas `queueId` e `userId` (números). Para mostrar o nome, eu preciso converter número → nome, e
fazer isso dentro de um laço de 27 atendimentos seria 27 buscas na lista. Com o dicionário, é uma
busca só por chave. **Trocar busca linear por acesso por chave** é o truque de otimização mais
barato que existe.

Exercício: no `render()`, explique em voz alta por que ele percorre `estado.chats` e não faz nova
chamada ao SDK.

---

## 4. Assincronismo: `await` dentro de um laço

O ponto mais importante do carregamento:

```js
for (let i = 0; i < filas.length; i++){
  const l = await O.chats.listByQueue(filas[i].id);
  ...
  if (CFG.intervaloMs > 0) await new Promise(r => setTimeout(r, CFG.intervaloMs));
}
```

Três conceitos num trecho só:

1. **`await` pausa a função, não o navegador.** O `carregar()` fica esperando, mas a tela continua
   respondendo. Por isso a barra de progresso anda.
2. **Sequencial e não paralelo, de propósito.** Se eu disparasse 94 chamadas de uma vez, o canal
   da extensão estouraria o limite de requisições e seria cortado. Aqui, "mais devagar" é mais
   confiável do que "mais rápido".
3. **`await new Promise(r => setTimeout(r, ms))`** é o jeito idiomático de "dormir" dentro de uma
   função assíncrona. Não existe `sleep()` em JavaScript; você promete resolver depois do tempo.

Exercício: mude `intervaloMs` para 0 e observe (num teste, não em produção) o que acontece com o
tempo de resposta. Depois explique por que o limite existe.

---

## 5. Programação defensiva: testar antes de chamar

```js
function temMetodo(root, path){
  let o = root; const p = path.split('.');
  for (let i = 0; i < p.length - 1; i++){ o = o ? o[p[i]] : null; if (!o) return false; }
  return typeof o[p[p.length - 1]] === 'function';
}
```

Uso: `temMetodo(O, 'queues.list') ? await O.queues.list() : []`.

O que essa função realmente ensina: **o caminho até o método pode não existir no meio**. Se eu
escrevesse `typeof O.queues.list === 'function'` e `omni.queues` não existisse, o código quebraria
antes mesmo de testar.

Aqui tem uma história real e útil: a primeira versão que eu escrevi estava ERRADA — ela exigia que
**todos** os níveis fossem função, então reprovava `chats.listMine` (porque `chats` é objeto, não
função) e o painel vinha zerado, sem nenhum erro visível. O defeito era silencioso.

Lição: teste com um caso que **deve** dar verdadeiro e outro que **deve** dar falso. Um teste só,
que passa, não prova nada.

---

## 6. Erro síncrono x Promise rejeitada (o erro que apareceu na tela)

Este é o conceito que mais confunde quem vem de linguagens não assíncronas:

```js
try { O.ui.resize(); } catch (e) {}      // NÃO pega erro de Promise
```

Um `try/catch` captura apenas o que é lançado **enquanto o código roda** (síncrono). Quando a
função devolve uma Promise, o erro acontece **depois**, em outra "volta" do fluxo. Para pegar isso
existem duas formas:

```js
o  →  r.catch(() => {})                    // tratar na chamada
o  →  try { await f() } catch (e) {}       // tratar com await
```

E existe um terceiro caminho, para investigar:

```js
window.addEventListener('unhandledrejection', ev => console.log('REJEITADA:', ev.reason));
```

Sem esse tratador, rejeições somem. **É por isso que existe a regra "nunca deixe Promise sem
tratamento"**: não é preciosismo, é que o erro fica invisível e só aparece quando um usuário reclama.

O defeito concreto do painel: chamar `omni.ui.resize()` sem argumento. A API exige altura numérica
positiva; sem argumento, rejeita — e a rejeição escapava do `try/catch`. A correção:

```js
const conteudo = Math.ceil(document.body.scrollHeight || 1);
const h = Math.max(1, Math.min(660, conteudo));
const r = O.ui.resize(h);
if (r && typeof r.catch === 'function') r.catch(() => {});
```

`Math.max(1, …)` garante o "positiva" que a API exige; `Math.min(660, …)` é uma decisão de produto
(sem o teto, o diálogo crescia até 1084px e passava da tela).

Exercício: no Console do frame, rode `omni.ui.resize()` e depois `omni.ui.resize(300)`. Veja a
diferença e explique em uma frase.

---

## 7. Agrupar dados: o padrão `Map` + `Set`

```js
const porAgente = new Map();
for (const c of estado.chats){
  const nome = nomeAgente(c.userId) || '(sem agente)';
  if (!porAgente.has(nome)) porAgente.set(nome, { nome, filas: new Set(), n: 0, espera: null });
  const it = porAgente.get(nome);
  it.n++;
  it.filas.add(String(c.queueId));           // Set: não repete fila
  const e = esperaMin(c);
  if (e !== null && (it.espera === null || e > it.espera)) it.espera = e;   // maior espera
}
```

Três ideias:
- **Map** = dicionário que preserva a chave (nome do agente) → valor (resumo dele).
- **Set** = conjunto sem repetição. Usei para contar *filas distintas*, não atendimentos.
- **`if (… || e > it.espera)`** é a computação do máximo sem ordenar nada. Comparar a cada volta é
  O(n); ordenar para pegar o maior seria O(n log n) por nada.

Depois a ordenação é feita só na apresentação:

```js
const linhas = [...porAgente.values()].sort((a, b) => (b.espera ?? -1) - (a.espera ?? -1));
```

E aqui há um detalhe que vale ouro: `null` significa "não sei a espera", não "espera zero".
Tratar `null` como zero jogaria para o topo justamente quem não tem informação.

Exercício: acrescente uma coluna "média de espera por agente" e decida o que fazer quando não há
nenhuma espera conhecida.

---

## 8. Interface: separar o que é cálculo do que é HTML

O `render()` monta HTML por concatenação e joga em `innerHTML`. Simples e suficiente para uma tela
que se redesenha inteira. Duas armadilhas que eu evitei:

- **Texto do usuário dentro de HTML** (`nomeContato`, `nomeFila`) entra sem escape. Aqui o dado é
  interno, mas em produto exposto isso é porta para injeção. A versão "de verdade" usaria
  `textContent` em vez de `innerHTML`.
- **Redesenhar tudo** perde o estado de foco e seleção. Estratégia consciente: eu redesenho e
  reconstruo a seleção a partir de `estado.selecionado`.

Exercício: troque a montagem por `createElement` + `textContent` na segunda tabela e compare o
tamanho do código. Anote qual ficou mais fácil de ler.

---

## 9. CSS: o `table-layout` e a barra de rolagem que apareceu

O defeito: barra de rolagem horizontal no painel. A causa não estava no JavaScript.

```css
table{ width:100%; max-width:100%; table-layout:fixed; }
th,td{ overflow-wrap:anywhere; word-break:break-word; }
```

Entenda o modelo: por padrão (`table-layout:auto`), o navegador mede o conteúdo para descobrir a
largura das colunas. Se essa largura mínima passar da área disponível, ele **não quebra o layout**:
ele cria barra de rolagem. Com `fixed`, o navegador faz o contrário: obedece a largura que você
declarou (`width:40%` no `th`) e obriga o conteúdo a caber — e é por isso que a quebra de palavra
precisa vir junto, senão o texto é cortado.

Também contribuíam:
- `min-width:210px` em `select`/`input` → um piso que empurra o conteúdo para fora;
- `label` sem `min-width:0` → em flex, o filho tem tamanho mínimo automático e não encolhe.

E a trava final, `html,body{ max-width:100%; overflow-x:hidden }`, é o cinto além do suspensório.

Método de diagnóstico — porque "acho que é isso" não serve:

```js
const de = document.documentElement;
de.scrollWidth > de.clientWidth + 1;   // existe estouro?
[...document.querySelectorAll('*')].filter(el => el.scrollWidth > el.clientWidth + 1);
```

Exercício: no painel, rode o segundo trecho e veja a lista diminuir conforme você corrige.

---

## 10. Agrupar rajadas: debounce

`ResizeObserver` dispara a cada mudança de layout — e cada disparo gerava uma rejeição. Solução:

```js
let alturaAgendada = null;
function ajustarAltura(){
  if (alturaAgendada) return;                  // já tem uma chamada agendada: ignora esta
  alturaAgendada = setTimeout(() => { alturaAgendada = null; /* ...faz o trabalho... */ }, 150);
}
```

O nome disso é **debounce**: em vez de reagir a cada evento, você reage uma vez ao fim da rajada.
Aplicável em busca digitada, redimensionamento, salvamento automático, clique repetido.

Exercício: mude 150 para 1000 e sinta a diferença de comportamento no redimensionamento.

---

## 11. Ação que altera dado: confirmação antes, sempre

```js
let ok = true;
if (temMetodo(O, 'ui.confirm')){
  ok = await O.ui.confirm({ title: 'Transferir atendimento', message: '…', okText: 'Transferir' });
}
if (!ok){ say('info', 'Transferência cancelada pelo usuário.'); return; }
```

Padrão importante: **a confirmação fica na extensão, não no diálogo padrão do navegador**. Assim o
texto é seu, o contexto está na tela e o cancelamento é tratado como fluxo normal (mensagem
informativa, não erro).

E a falha também é tratada como informação, não como drama:

```js
if (/service not found/i.test(m)){ say('info', 'O sistema não aceitou a transferência…'); }
else { say('bad', 'Falha ao transferir: ' + m); }
```

Diferença de mentalidade: "não é permitido" não é a mesma coisa que "quebrou". Mensagem de erro
que não distingue as duas faz o usuário tentar de novo o que nunca vai funcionar.

---

## 12. Método de investigação: medir, não supor

O que eu realmente fiz quando apareceu o `Service not found`:

1. Enumerei a superfície real em vez de confiar na documentação:
   `Object.keys(window.omni)` e, por namespace, as chaves com `typeof === 'function'`.
2. Comparei com o manual do produto — e achei namespaces que a documentação não citava.
3. Testei **várias assinaturas** da mesma chamada até concluir que não era o formato dos argumentos.
4. Usei a **diferença entre as mensagens** para separar "não existe método" (`is not a function`)
   de "existe, mas o serviço não responde" (`Service not found`).
5. Documentei o limite na própria tela (o bloco de diagnóstico), em vez de esconder.

Lição de engenharia: **documentação é hipótese, não verdade**. Verificar em execução é o que separa
"eu li" de "eu sei". E quando você encontra um limite do produto, a resposta profissional é
explicitar e contornar, não inventar dado.

---

## 13. Sobre "parecer humano" no código

Duas coisas foram ajustadas e vale entender por quê:

1. **Comentário com acentuação e frase natural.** Comentário em português sem acento, ou escrito em
   formato de "relatório", denuncia texto gerado. Um comentário humano é curto e explica o *porquê*,
   não o *o quê*:

   ```js
   // antes:  "// o METODO final tem de ser funcao; os niveis intermediarios sao objetos"
   // depois: "// o método só existe se o caminho terminar numa função (os níveis do meio são objetos)"
   ```

2. **Comentário que documenta o processo de investigação.** Frases como "esta versão do SDK exige…"
   podem existir, mas precisam ser úteis para quem lê o código depois — não um diário de bordo.

Regra prática: **comentário bom responde "por quê"; código bom responde "o quê"**. Se o comentário
só repete o que a linha já diz, ele é ruído.

---

## 14. Roteiro de treino sugerido (na Extensão de Exemplo)

Na ordem, cada um usando o que está acima:

1. **Medir** o painel de exemplo: rode o detector de estouro e anote a largura em que a barra aparece.
2. **Corrigir a tabela** com `table-layout:fixed` + larguras + quebra de palavra. Prove com os dois números.
3. **Corrigir o resize**: trate a Promise com `.catch()`, mande altura positiva, com teto. Prove com
   o tratador de `unhandledrejection` e console limpo.
4. **Acrescentar um filtro por fila** ao painel (um `<select>` acima da tabela) — treino de estado.
5. **Acrescentar uma confirmação** antes de uma ação que escreve dado — treino do padrão da seção 11.
6. **Escrever o comentário** de cada trecho que você mexeu, explicando o porquê em uma linha, com acentuação.

Se você fizer 1 a 3 sozinho, você domina os dois defeitos que apareceram aqui de verdade.
