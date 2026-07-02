# Stores: Planejar em um Repositório Próprio

> **Beta.** Stores, references, working context e worksets são novos. Nomes de comandos, flags, formatos de arquivo e saída JSON ainda podem mudar entre releases. Cada guia abaixo foi executado contra a build atual, mas leia este guia novamente após a atualização.

## O problema que isso resolve

O OpenSpec normalmente reside dentro de um repositório de código: uma pasta openspec/ ao lado do seu código, contendo especificações e mudanças para esse repositório.

Isso deixa de ser adequado no momento em que seu planejamento é maior do que um repositório:

- Seu trabalho abrange vários repositórios — um recurso toca o servidor API, o aplicativo web e uma biblioteca compartilhada. Em qual pasta openspec/ o plano reside?
- Sua equipe planeja antes que o código exista, ou planeja coisas que nunca se tornarão código neste repositório.
- Requisitos são de propriedade de uma equipe e consumidos por outras. A versão da wiki diverge, e seu agente de codificação não consegue lê-la de qualquer maneira.

Um **store** é a resposta: um repositório autônomo cujo trabalho inteiro é o planejamento. Ele tem a mesma estrutura openspec/ que você já conhece — especificações e mudanças — mais um pequeno arquivo de identidade. Você o registra em sua máquina uma vez, pelo nome, e então todo comando OpenSpec normal pode funcionar nele de qualquer lugar.

## A Estrutura

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Duas regras mantêm isso simples:

1. **Um store é apenas um repositório Git.** Você o commita, envia (push), puxa (pull) e revisa por conta própria. O OpenSpec nunca clona, sincroniza ou envia qualquer coisa sozinho.
2. **Declarações, não maquinário.** Os repositórios podem *declarar* como se relacionam com os stores (mostrado abaixo). As declarações mudam o que o OpenSpec pode lhe dizer — nunca onde seus comandos agem.

## Dois minutos para o seu primeiro store

Dois comandos levam você do nada a uma mudança funcional, escopada pelo store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Próximo passo: execute comandos normais do OpenSpec contra este store, por exemplo:
  openspec new change <change-id> --store team-plans
Compartilhe este store ao commitar e enviar (push) como qualquer repositório Git.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Próximo passo: openspec status --change add-login --store team-plans
```

Este é o modelo completo. A partir daqui, o ciclo de vida é exatamente o que você sabe — `status`, `instructions`, `validate`, `archive` — com `--store team-plans` em cada comando, e cada dica impressa carrega a bandeira para você. A linha `Using OpenSpec root:` sempre indica onde um comando está agindo.

## História: uma equipe, um repositório de planejamento

Uma equipe mantém suas especificações e mudanças em `team-plans` em vez de espalhá-las por vários repositórios de código.

**Dia um (quem configurar):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Passar `--remote` registra o URL de clonagem dentro do arquivo de identidade do próprio store (`.openspec-store/store.yaml`), no commit inicial. Cada clone futuro nasce sabendo de onde veio, para que verificações de saúde e mensagens de erro possam imprimir uma correção completa e copiável para colegas de equipe que ainda não a possuem.

**Todo colega de equipe (uma vez por máquina):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

A partir daí, todos trabalham no mesmo repositório de planejamento pelo nome:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**O trabalho é compartilhado via Git, e isso é intencional.** Uma mudança que você cria existe apenas no seu checkout até que você o commita e o envie (push) — assim como código. Planos recebem branches, pull requests e revisão de graça, porque um store é um repositório comum.

**Conectando os repositórios de código da equipe.** Um repositório de código cujo planejamento está totalmente externalizado precisa de exatamente uma linha, em `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Agora, cada comando OpenSpec executado dentro de `web-app` age sobre `team-plans` sem nenhuma flag:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

O ponteiro é um recurso de fallback, nunca uma substituição: um `--store` explícito sempre vence, e se o repositório crescer com suas próprias pastas de planejamento reais, estas vencem (com um aviso para remover o ponteiro obsoleto).

## História: requisitos que cruzam linhas de equipe

Uma equipe de plataforma é dona dos requisitos. As equipes de produto constroem contra eles, em seus próprios repositórios, com seus próprios designs. Uma referência descreve essa relação sem mover o trabalho de ninguém.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          │          └──────────────────────────┘
   └──────────────────────────┘
```

**A equipe de produto declara no `openspec/config.yaml` do seu repositório o que está usando:**

```yaml
references:
  - platform-reqs
```

Referências são contexto somente leitura. O repositório mantém sua própria raiz `openspec/`; o trabalho permanece lá. O que muda: `openspec instructions` nesse repositório agora inclui um índice das especificações do store referenciado — cada uma com um resumo de uma linha e o comando exato de busca (`openspec show <spec-id> --type spec --store platform-reqs`). Um agente trabalhando em `api-server` pode encontrar os requisitos de pagamento upstream, citá-los e escrever seu design de baixo nível na própria raiz do repositório — sem que ninguém precise colar contexto ao redor.

Uma referência pode carregar sua fonte de clonagem, para que colegas de equipe que ainda não têm o store recebam uma correção completa em vez de um beco sem saída:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Quando você quer que o plano e o código estejam abertos juntos, crie um workset.** Isso é pessoal e explícito: cada pessoa escolhe as pastas com as quais realmente trabalha em sua máquina. Nada sobre esses caminhos de checkout local são committados no repositório de planejamento compartilhado.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Duas perguntas que você sempre pode fazer

**"Meu setup está saudável?"** — `openspec doctor` verifica a raiz atual e seus stores referenciados, somente leitura, com uma correção copiável por achado:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Com o que estou trabalhando?"** — `openspec context` monta o conjunto de trabalho a partir das declarações do OpenSpec: a raiz e os stores que ele referencia.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Ambos suportam `--json` para agentes. `openspec context --code-workspace <path>` adicionalmente escreve um arquivo de workspace do VS Code contendo o conjunto completo — esta é a única escrita que este comando realiza.

## Worksets: reabra as pastas nas quais você trabalha junto

Separado de tudo isso: a maioria das pessoas abre as mesmas poucas pastas juntas em cada sessão — o repositório de planejamento mais dois ou três repositórios de código. Um **workset** é uma visão pessoal e nomeada disso exatamente, reaberta com um comando na sua ferramenta de escolha.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` então lança a ferramenta salva: editores (VS Code, Cursor) abrem uma janela com cada membro e retornam. O primeiro membro é o principal. Sobrescreva a ferramenta a qualquer momento com `--tool <id>`.

Os Worksets não são estado compartilhado deliberadamente. Eles vivem na sua máquina, nunca são committados e não fazem alegações sobre o trabalho — eles apenas registram o que você gosta de ter aberto junto. Remover um nunca toca as pastas dos membros. Novas ferramentas são configuração, não código: qualquer coisa lançada via arquivo de workspace ou flags de anexo por pasta pode ser adicionada sob a chave `openers` na configuração global (`openspec config edit`).

## Como os comandos decidem onde agir

Todo comando normal resolve sua raiz da mesma maneira, nesta ordem:

```
1. --store <id>          você disse isso explicitamente        → aquele store
2. nearest openspec/     uma raiz de planejamento real aqui     → este repositório
   (subindo do diretório atual)
3. store: pointer        config.yaml declara um store  → aquele store
4. nenhum dos anteriores     stores registrados nesta     → erro com uma
                         máquina?                        seleção
                         no stores registrados?         → nenhuma store registrada?         → o diretório atual
                                                          (comportamento clássico)
```

A linha `Using OpenSpec root:` (e o bloco `root` na saída `--json`) informa em qual caso você está.

## Limitações conhecidas

- **Estrutura Beta.** Tudo nesta página pode mudar entre lançamentos — nomes, flags, formatos de arquivo, chaves JSON.
- **Um checkout por ID do store por máquina.** Registrar um segundo checkout sob o mesmo ID falha com uma dica para `store unregister` primeiro.
- **Sem sincronização, nunca — por design.** O OpenSpec nunca clona, puxa ou envia (push). Um checkout obsoleto mostra especificações obsoletas até que *você* puxe; as referências são indexadas ao vivo a partir do que estiver no disco.
- **Alguns comandos permanecem onde estão.** `view`, `templates`, `schemas`, e as formas substantivas obsoletas (`openspec change show`, ...) agem apenas no diretório atual — sem `--store`.
- **O estado por máquina é por máquina.** O registro de stores e os worksets são configurações locais. Nada sobre o layout da sua máquina é jamais committado para planejamento compartilhado.
- **Dois estilos de lançamento para worksets.** Uma ferramenta que não pode ser lançada com um arquivo de workspace ou flags de anexo por pasta não pode ser adicionada como um opener.
- **JSON do Agente tem uma divisão de caixa conhecida** (chaves da família store são `snake_case`, da família fluxo de trabalho são `camelCase`). Documentado em [agent contract](../agent-contract.md); a unificação é adiada para um lançamento versionado.

## Onde as coisas vivem

| O quê | Onde | Compartilhado? |
|---|---|---|
| O planejamento de um store | `<store>/openspec/` (specs, changes) | Sim — commita e envie (push) |
| A identidade de um store | `<store>/.openspec-store/store.yaml` | Sim — committado com o store |
| O registro do store | `<data dir>/openspec/stores/registry.yaml` | Não — apenas nesta máquina |
| Worksets | `<data dir>/openspec/worksets/` | Não — apenas nesta máquina |

`<data dir>` é `~/.local/share/openspec` no macOS e Linux (ou `$XDG_DATA_HOME/openspec` quando definido) e `%LOCALAPPDATA%\openspec` no Windows.
## Referência

Flags exatas e formas JSON para cada comando nesta página: [CLI reference](../cli.md) (Stores, Doctor, Contexto de Trabalho, Worksets Pessoais) e o [agent contract](../agent-contract.md).