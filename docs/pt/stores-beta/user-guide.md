# Stores: Planeje em Seu Próprio Repositório

> **Beta.** Stores, referências, contexto de trabalho e worksets são novos. Nomes de comandos, flags, formatos de arquivo e saída JSON ainda podem mudar de formato entre versões. Todos os passos a passo abaixo foram executados na versão atual, mas releia este guia após atualizar.

## O problema que isso resolve

O OpenSpec geralmente fica dentro de um único repositório de código: uma pasta `openspec/` ao lado do seu código, contendo especificações e alterações para esse repositório.

Isso deixa de funcionar assim que o seu planejamento é maior do que um repositório:

- Seu trabalho abrange vários repositórios — uma funcionalidade mexe no servidor de API, no aplicativo web e em uma biblioteca compartilhada. Em qual pasta `openspec/` o plano deve ficar?
- Sua equipe planeja antes que o código exista, ou planeja coisas que nunca se tornam código *neste* repositório.
- Os requisitos são de propriedade de uma equipe e consumidos por outras. A versão da wiki fica desalinhada, e seu agente de codificação não consegue lê-la de qualquer forma.

Um **Store** é a solução: um repositório independente cuja única finalidade é o planejamento. Ele mantém a mesma estrutura da pasta `openspec/` que você já conhece — especificações e alterações — além de um pequeno arquivo de identidade. Você o registra na sua máquina uma única vez, pelo nome, e depois todos os comandos normais do OpenSpec podem funcionar nele a partir de qualquer lugar.

## A estrutura

```
            team-plans  (um armazenamento: planejamento em seu próprio repositório)
            ├── .openspec-store/store.yaml     identity: "Eu sou team-plans"
            └── openspec/
                ├── specs/      o que é verdadeiro
                └── changes/    o que está em andamento
                      ▲
                      │ registrado em cada máquina por nome;
                      │ compartilhado por push/clone como qualquer repositório
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (repositório de código)   (repositório de código)    (repositório de código)
```

Duas regras mantêm isso simples:

1. **Um armazenamento é apenas um repositório git.** Você faz commit, push, pull e revisa ele mesmo. O OpenSpec nunca clona, sincroniza ou faz push de nada por conta própria.
2. **Declarações, não maquinário.** Repositórios podem *declarar* como se relacionam com armazenamentos (mostrado abaixo). Declarações mudam o que o OpenSpec pode dizer a você — nunca onde seus comandos atuam.

## Cinco minutos para seu primeiro armazenamento

Dois comandos levam você do nada a uma mudança funcional e com escopo de armazenamento:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Armazenamento pronto: team-plans
Localização: /Users/you/openspec/team-plans
Raiz do OpenSpec: pronta
Registro: registrado

Próximo: execute comandos normais do OpenSpec contra este armazenamento, por exemplo:
  openspec new change <change-id> --store team-plans
Compartilhe este armazenamento fazendo commit e push como qualquer repositório Git.
```

```bash
openspec new change add-login --store team-plans
```

```
Usando raiz do OpenSpec: team-plans (/Users/you/openspec/team-plans)
Mudança 'add-login' criada em /Users/you/openspec/team-plans/openspec/changes/add-login/
Esquema: orientado por especificações
Próximo: openspec status --change add-login --store team-plans
```

Esse é todo o modelo. A partir daqui, o ciclo de vida é exatamente o que você conhece — `status`, `instructions`, `validate`, `archive` — com `--store team-plans` em cada comando, e cada dica impressa carrega a flag para você. A linha `Usando raiz do OpenSpec:` sempre diz onde um comando está atuando.

## História: uma equipe, um repositório de planejamento

Uma equipe mantém suas especificações e mudanças no `team-plans` em vez de espalhá-las por repositórios de código.

**Dia um (quem quer que configure):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Passar `--remote` registra a URL de clone dentro do próprio arquivo de identidade do armazenamento (`.openspec-store/store.yaml`), no commit inicial. Todo clone futuro já nasce sabendo de onde veio, para que verificações de integridade e mensagens de erro possam imprimir uma correção completa e copiável para colegas de equipe que ainda não o têm.

**Cada colega de equipe (uma vez por máquina):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

A partir daí, todos trabalham no mesmo repositório de planejamento por nome:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Compartilhar trabalho é git, de propósito.** Uma mudança que você cria existe apenas em seu checkout até que você faça commit e push — igual ao código. Planos ganham branches, pull requests e revisão de graça, porque um armazenamento é um repositório comum.

**Conectando os repositórios de código da equipe.** Um repositório de código cujo planejamento é totalmente externalizado precisa de exatamente uma linha, em `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Agora todo comando OpenSpec executado dentro de `web-app` atua no `team-plans` sem nenhuma flag:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Usando raiz do OpenSpec: team-plans (/Users/you/openspec/team-plans)
...
```

O ponteiro é um fallback, nunca uma substituição: um `--store` explícito sempre ganha, e se o repositório desenvolver pastas de planejamento reais próprias, elas ganham (com um aviso para remover o ponteiro obsoleto).

**Um padrão para cada repositório em sua máquina.** Se você trabalha em muitos repositórios de código que todos planejam no mesmo armazenamento, configure isso uma vez, globalmente, em vez de adicionar a linha `store:` a cada repositório:

```bash
openspec config set defaultStore team-plans
```

Agora qualquer comando executado fora de uma raiz de planejamento — e sem `--store` e sem ponteiro de projeto — resolve para `team-plans`. Ele fica no final da lista de precedência, então `--store`, uma raiz local e um ponteiro `store:` de projeto ainda ganham. O banner de raiz e o bloco JSON `root` relatam `source: "global_default"` com o id do armazenamento, para que você sempre possa distinguir um padrão de toda a máquina do próprio ponteiro do repositório. Limpe isso com `openspec config unset defaultStore`. Se o id não estiver registrado, os comandos dão erro e dizem para registrá-lo ou limpar o padrão obsoleto.

## História: requisitos que cruzam as linhas das equipes

Uma equipe de plataforma é dona dos requisitos. Equipes de produto constroem com base neles, em seus próprios repositórios, com seus próprios designs. Uma referência descreve esse relacionamento sem mover o trabalho de ninguém.

```
   platform-reqs (armazenamento)                 api-server (repositório de código)
   de propriedade da equipe de plataforma        de propriedade de uma equipe de produto
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ lê      │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (seus próprios designs)│
   │   trabalho da plataforma │          │ openspec/changes/        │
   │                          │          │   (seu próprio trabalho) │
   └──────────────────────────┘          └──────────────────────────┘
```

**A equipe de produto declara o que usa** no `openspec/config.yaml` de seu repositório:

```yaml
references:
  - platform-reqs
```

Referências são contexto somente leitura. O repositório mantém sua própria raiz `openspec/`; o trabalho fica lá. O que muda: `openspec instructions` nesse repositório agora inclui um índice das especificações do armazenamento referenciado — cada uma com um resumo de uma linha e o comando de busca exato (`openspec show <spec-id> --type spec --store platform-reqs`). Um agente trabalhando no `api-server` pode encontrar os requisitos de pagamento upstream, citá-los e escrever seu design de baixo nível na própria raiz do repositório — sem que ninguém precise colar contexto por aí.

Uma referência pode carregar sua fonte de clone, para que colegas de equipe que ainda não têm o armazenamento recebam uma correção completa em vez de um beco sem saída:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Quando você quiser o plano e o código abertos juntos, crie um workset.** Isso é pessoal e explícito: cada pessoa escolhe as pastas com que realmente trabalha em sua máquina. Nada sobre esses caminhos de checkout locais é commitado no repositório de planejamento compartilhado.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Duas perguntas que você sempre pode fazer

**"Minha configuração está saudável?"** — `openspec doctor` verifica a raiz atual e seus armazenamentos referenciados, somente leitura, com uma correção copiável por achado:

```
Doutor

Raiz
  Localização: /Users/you/src/api-server
  Raiz do OpenSpec: ok

Referências
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Armazenamento referenciado 'design-system' não está registrado nesta máquina.
    Correção: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system
```

**"Com o que estou trabalhando?"** — `openspec context` monta o conjunto de trabalho a partir das declarações do OpenSpec: a raiz e os armazenamentos que ela referencia.

```
Contexto de trabalho para api-server (/Users/you/src/api-server)

Raiz do OpenSpec
  api-server  /Users/you/src/api-server

Armazenamentos referenciados
  platform-reqs  /Users/you/openspec/platform-reqs
    Buscar: openspec show <spec-id> --type spec --store platform-reqs
```

Ambos suportam `--json` para agentes. `openspec context --code-workspace <caminho>` adicionalmente escreve um arquivo de workspace do VS Code contendo todo o conjunto — a única escrita que este comando realiza.

## Worksets: reabra as pastas com que você trabalha junto

Separado de tudo isso: a maioria das pessoas abre as mesmas poucas pastas juntas a cada sessão — o repositório de planejamento mais dois ou três repositórios de código. Um **workset** é uma visualização pessoal e nomeada de exatamente isso, reaberta com um comando na ferramenta de sua escolha.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       os três abertos em sua ferramenta
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (abre no VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` então lança a ferramenta salva: editores (VS Code, Cursor) abrem uma janela com todos os membros e retornam. O primeiro membro é o principal. Substitua a ferramenta a qualquer momento com `--tool <id>`.

Worksets são deliberadamente *não* estado compartilhado. Eles vivem em sua máquina, nunca são commitados e não fazem afirmações sobre o trabalho — eles apenas registram o que você gosta de abrir junto. Remover um nunca toca nas pastas dos membros. Novas ferramentas são configuração, não código: qualquer coisa lançada via um arquivo de workspace ou flags de anexo por pasta pode ser adicionada sob a chave `openers` na configuração global (`openspec config edit`).

## Como os comandos decidem onde atuar

Todo comando normal resolve sua raiz da mesma forma, nesta ordem:

```
1. --store <id>          você disse explicitamente        → esse armazenamento
2. nearest openspec/     uma raiz de planejamento real aqui     → este repositório
   (caminhando para cima a partir do cwd)
3. store: pointer        config.yaml declara um armazenamento  → esse armazenamento
4. defaultStore          configuração global define um padrão de máquina  → esse armazenamento
5. nenhum dos acima     armazenamentos registrados nesta máquina?     → erro com uma
                         dica de seleção
                         nenhum armazenamento registrado?         → o diretório
                                                                  atual
                                                                  (comportamento clássico)
```

A linha `Usando raiz do OpenSpec:` (e o bloco `root` na saída `--json`) diz em qual caso você está.

## Limitações conhecidas

- **Forma beta.** Tudo nesta página pode mudar entre lançamentos — nomes, flags, formatos de arquivo, chaves JSON.
- **Um checkout por id de armazenamento por máquina.** Registrar um segundo checkout com o mesmo id falha com uma dica para fazer `store unregister` primeiro.
- **Nenhuma sincronização, nunca — por design.** O OpenSpec nunca clona, puxa ou envia. Um checkout obsoleto mostra especificações obsoletas até que *você* puxe; referências são indexadas ao vivo a partir do que estiver no disco.
- **Pastas de planejamento vazias podem estar ausentes.** Um novo armazenamento pode não ter `openspec/changes/`, `openspec/specs/` ou `openspec/changes/archive/` no Git ainda. Isso é aceito durante o beta; essas pastas aparecem uma vez que comandos normais criem arquivos para elas.
- **Repositórios ponteiro permanecem ponteiros.** Um repositório apenas de configuração cujo `openspec/config.yaml` declara `store: <id>` é tratado como planejamento externalizado, não como um checkout de armazenamento para registrar. Remova a linha `store:` primeiro se você quiser intencionalmente converter esse repositório em uma raiz de armazenamento local.
- **Alguns comandos permanecem onde estão.** `view`, `templates`, `schemas` e as formas nominais obsoletas (`openspec change show`, ...) atuam apenas no diretório atual — sem `--store`.
- **Estado por máquina é por máquina.** O registro de armazenamentos e os worksets são configurações locais. Nada sobre o layout de sua máquina é jamais commitado no planejamento compartilhado.
- **Dois estilos de lançamento para worksets.** Uma ferramenta que não pode ser lançada com um arquivo de workspace ou flags de anexo por pasta não pode ser adicionada como um abridor.
- **O JSON do agente tem uma divisão de caixa conhecida** (chaves da família de armazenamento são snake_case, da família de fluxo de trabalho camelCase). Documentado no [contrato do agente](../agent-contract.md); a unificação é adiada para um lançamento versionado.

## Onde as coisas ficam armazenadas

| O quê | Onde | Compartilhado? |
|---|---|---|
| O planejamento de uma loja | `<store>/openspec/` (especificações, alterações) | Sim — faça commit e envie por push |
| A identidade de uma loja | `<store>/.openspec-store/store.yaml` | Sim — commitado junto com a loja |
| O registro de lojas | `<data dir>/openspec/stores/registry.yaml` | Não — apenas nesta máquina |
| Worksets | `<data dir>/openspec/worksets/` | Não — apenas nesta máquina |

`<data dir>` é `~/.local/share/openspec` no macOS e no Linux (ou
`$XDG_DATA_HOME/openspec` quando definido), e `%LOCALAPPDATA%\openspec` no
Windows.

## Referência

Sinalizações exatas e formatos JSON de todos os comandos desta página:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal
worksets) e o [agent contract](../agent-contract.md).