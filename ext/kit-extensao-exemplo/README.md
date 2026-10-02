# Kit de Exemplo — ponto de partida para criar uma extensão

Este diretório é um **kit pronto** para você criar a sua primeira extensão copiando e
adaptando. Ele tem só dois arquivos que importam:

| Arquivo | Para que serve |
|---|---|
| `manifest.json` | A "carteira de identidade" da extensão: nome, versão, onde ela aparece. |
| `index.html` | A tela que o usuário vê (usa o SDK `omni` para conversar com o sistema). |

> Publique esta pasta num servidor web ou CDN pública (GitHub Pages, Cloudflare, um VPS seu).
> O manifesto precisa ficar acessível por uma URL pública — é essa URL que se informa na
> hora de instalar.

---

## 1. Antes de começar: os três papéis

Criar e instalar são coisas diferentes, feitas por pessoas diferentes:

- **Criar / publicar** — o **Administrador**, no *Editor de Extensões*.
- **Instalar / configurar / ligar‑desligar** — **somente o superusuário**.
- **Distribuir em várias empresas** — pelo **painel do parceiro**.

Um Administrador comum **não vê** a tela de "Extensões instaladas" e não instala. Se ele
tentar acessar por baixo, o servidor responde **403** (proibido), inclusive para leitura.

---

## 2. `manifest.json` — campo por campo

```json
{
  "manifestVersion": 1,
  "id": "exemplo.kit",
  "version": "1.0.0",
  "name": "Kit de Exemplo",
  "description": "Uma frase explicando o que a extensão faz.",
  "author": { "name": "Seu Nome" },
  "contributions": [
    { "id": "painel_kit", "type": "chatPanel",
      "title": { "pt-BR": "Kit de Exemplo" },
      "url": "index.html" },
    { "id": "menu_kit", "type": "topMenu",
      "title": { "pt-BR": "Kit de Exemplo" },
      "presentation": { "mode": "dialog", "size": "lg" },
      "url": "index.html" }
  ]
}
```

**Obrigatórios:** `manifestVersion`, `id`, `version`, `name`, `contributions`.

- **`id`** — identificador **global**, no formato `fornecedor.extensao` (minúsculas, números
  e hífen; exatamente um ponto). É **congelado na primeira publicação**: escolha bem.
- **`version`** — Semver estrito `X.Y.Z`. Ao publicar, tem de ser **maior** que a última
  publicada.
- **`author`** — é um **objeto** `{ "name": "...", "url": "..." (opcional) }`, **não** um
  texto solto.
- **`contributions`** — onde a extensão aparece. Cada uma precisa de `id` (único), `type`,
  `title` e `url`.
- **`icon`** (opcional) — se você usar, é um **arquivo** da extensão (ex.: `assets/icone.svg`),
  **não** o nome de um ícone do sistema.

### Onde a extensão pode aparecer (`type`)

| Tipo | Onde aparece |
|---|---|
| `chatPanel` | Aba lateral dentro do atendimento |
| `topMenu` | Ícone na barra superior (visível para todos) |
| `mainNav` | Item na navegação principal |
| `chatMenu` / `msgMenu` | Menus dentro do atendimento / da mensagem |
| `cartAction` / `cartFooterAction` | Botões no painel de carrinho |
| `callAction` | Ação durante uma ligação |

Modos de apresentação (quando o tipo aceita): `dialog`, `fullscreen`, `menu`, `inline`,
`action` — variam conforme o tipo.

---

## 3. `index.html` — o SDK `omni`

O Host injeta `window.omni` automaticamente. Os recursos mais usados:

```js
const usuario   = await omni.session.getUser();        // { id, name, type, email, queues, groups }
const instancia = await omni.session.getInstance();    // { name, domain, hostVersion, viewVersion }
const chat      = await omni.chats.getSelected();      // atendimento aberto (ou null)
await omni.chats.sendMessage(chat.id, { text: "Olá" }); // envia mensagem em nome do agente
omni.ui.resize();                                       // avisa o Host para ajustar a altura
omni.nav.navigate(["/base", "ticketspanel"]);           // navega para outra tela do sistema
```

**Nunca** coloque chaves de API ou senhas dentro do HTML. Declare-as no manifesto (tipo
`secret`) e o instalador as preenche — elas são cifradas e nunca retornam em leitura.

---

## 4. Passo a passo para publicar

1. Copie esta pasta e renomeie.
2. Ajuste `manifest.json` (`id`, `name`, `version`) e escreva a sua tela.
3. No **Editor de Extensões** (Configurações › Extensões): crie a extensão, cole o manifesto,
   grave os arquivos e confira (o editor mostra cada erro antes de publicar).
4. **Publique** — a versão vai para o CDN e fica **imutável**. Publicar **não** coloca no ar.
5. **Aponte o canal** — `dev` (teste, imediato) ou `prod` (produção, ~15 min de cache).
6. Copie a **URL do manifesto** e informe a quem vai instalar.

Para corrigir algo já publicado: **crie uma versão nova** (clone) — não dá para editar a
publicada. Publicar nova versão + mover o ponteiro = **atualização sem reinstalar** em todas
as empresas que usam aquela URL.

---

## 5. Armadilhas (as que mais aparecem)

- **Filtro vazio = ninguém.** Ao instalar, uma lista de inclusão vazia **não** significa
  "todos".
- **Só aparece em certas telas.** `chatPanel` só existe para quem atende chats.
- **Arquivo citado e inexistente** → publicação recusada.
- **`author` como texto** → manifesto recusado.
- **`icon` como nome de ícone do sistema** → recusado (é arquivo).
- **Esqueceu de salvar o manifesto** antes de publicar → publica a versão antiga.
- **Remover instalação** exige confirmação explícita.
- **Apagar a extensão** não remove as instalações (podem ficar órfãs) e tem **alcance
  externo**: afeta outras empresas que já instalaram.

---

## 6. Teste rápido depois de publicar

Abra a URL do seu manifesto no navegador:

```
https://raw.githack.com/<usuario>/<repo>/<commit>/ext/kit-extensao-exemplo/manifest.json
```

Se aparecer o JSON, o arquivo está público e pronto para ser instalado.
