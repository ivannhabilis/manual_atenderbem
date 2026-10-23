// Diagnóstico de barra de rolagem horizontal — Painel de Carga dos Agentes
//
// Para que serve: descobrir DE QUEM é a barra horizontal. A rolagem pode ser de três lugares
// diferentes, e cada um tem uma correção diferente:
//   1. a página do sistema (o fundo, atrás do popup);
//   2. o diálogo/popup que hospeda a extensão;
//   3. o conteúdo da extensão, dentro do iframe.
//
// COMO USAR
//   a) Abra o sistema, clique no ícone da extensão para o painel aparecer.
//   b) Tecle F12 → aba Console.
//   c) Se aparecer aviso de que precisa digitar "allow pasting", digite e cole o bloco abaixo.
//   d) Tire um print do resultado (a tabela e a lista).

(() => {
  const larg = el => el ? Math.round(el.getBoundingClientRect().width) : null;
  const de = document.documentElement;

  const painelOverlay = document.querySelector('.cdk-overlay-pane.extension-dialog-panel');
  const dialogo = document.querySelector('.ext-dialog');
  const iframe = dialogo ? dialogo.querySelector('iframe') : null;

  const tabela = {
    'janela (largura util)': de.clientWidth,
    'pagina: largura do conteudo': de.scrollWidth,
    'pagina: TEM barra horizontal': de.scrollWidth > de.clientWidth + 1,
    'fundo (overlay)': larg(painelOverlay),
    'popup (dialogo visivel)': larg(dialogo),
    'popup: classe/tamanho': dialogo ? dialogo.className : null,
    'iframe da extensao': larg(iframe),
  };
  console.table(tabela);

  // Quem, exatamente, esta rolando na horizontal: procura qualquer elemento cujo conteudo
  // seja mais largo que a area visivel dele.
  const culpados = [...document.querySelectorAll('*')].filter(el => {
    const cs = getComputedStyle(el);
    return (cs.overflowX === 'auto' || cs.overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 1;
  }).map(el => ({
    tag: el.tagName,
    classe: (el.className || '').toString().slice(0, 60),
    'largura do conteudo': el.scrollWidth,
    'largura visivel': el.clientWidth
  }));
  console.log('elementos com barra horizontal:', culpados.length ? culpados : 'nenhum');

  console.log('agora o teste de dentro do painel: abra o iframe e rode {visivel: document.documentElement.clientWidth, conteudo: document.documentElement.scrollWidth}');
  return tabela;
})();
