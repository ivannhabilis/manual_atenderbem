# Painel de Carga dos Agentes (Ivann) — `ivann.painel-carga`

Extensão do módulo de Extensões do AtenderBem. Aparece no **menu superior** (contribuição
`topMenu`, modo `dialog`).

## Arquivos

| Arquivo | Papel |
|---|---|
| `manifest.json` | Carteira de identidade da extensão (id, versão, contribuição, config). |
| `index.html` | A tela: lê o SDK `omni`, monta o painel e executa a transferência. |
| `assets/icone.svg` | Ícone do item no menu superior. É **arquivo da versão** (não é nome de ícone do sistema). |
| `ROTEIRO-VIDEO.md` | Roteiro de narração do vídeo de entrega. |

## Estado atual (publicado e verificado)

- Extensão no editor: **id 3**, identificador global `ivann.painel-carga` (congelado na 1ª publicação).
- Versão **1.0.0** publicada — versão id **11**; ponteiro **dev** apontando para ela.
- Manifesto dev: `https://cdn.a-tend.online/ivann.painel-carga/manifest_dev.json`
- Arquivo da versão: `https://cdn.a-tend.online/ivann.painel-carga/v/1.0.0/index.html`
- Sondagem de instalação: `installable: true`, CORS `*`, sem avisos e sem dependências pendentes.

## Configuração declarada

| Chave | Tipo | Padrão | Para que serve |
|---|---|---|---|
| `limiteEsperaAlerta` | number | 10 | Minutos de espera a partir dos quais a linha fica vermelha. |
| `filasIgnoradas` | string | (vazio) | Ids de fila separados por vírgula. |

## Publicar uma nova versão (não dá para editar a publicada)

1. `extensions_create_draft` (ou `extensions_clone_version`) → obtém o rascunho.
2. `extensions_put_resource` nos arquivos alterados.
3. `extensions_save_manifest` com o manifesto **completo** (ele substitui, não faz merge) e a `version` maior.
4. `extensions_check_version` → corrija todo finding de severidade `error`.
5. `extensions_publish_version` → depois `extensions_set_pointer` (`dev` para testar, `prod` para produção).

Publicar **não** coloca no ar: quem coloca é o ponteiro.

## Rollback

- Tirar do ar sem apagar: `extension_installs_set_enabled` com `enabled: false`.
- Desinstalar: `extension_installs_remove` com `confirm: true`.
- Voltar a versão servida: `extensions_set_pointer` apontando o ponteiro para outra versão publicada.

## Notas técnicas

- O `chatPanel` não foi usado de propósito: o usuário administrador desta instância tem
  `chatenabled = 0`, e painéis de chat só renderizam para quem atende chats. O `topMenu` aparece para todos.
- `requires` no manifesto é **lista** de nomes de recurso (um objeto é recusado com `E_TYPE`).
- O SDK não expõe hoje os namespaces `queues` nem `users`, nem `chats.listByQueue`. O painel
  detecta isso em tempo de execução e mostra no bloco "Diagnóstico do SDK" o que existe de fato,
  em vez de assumir. Ver `ROTEIRO-VIDEO.md`, bloco 7.
