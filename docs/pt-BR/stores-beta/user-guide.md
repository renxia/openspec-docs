# Stores: Planejar em Repositório Próprio

> **Beta.** Stores, referências, contexto de trabalho e conjuntos de trabalho são novos. Nomes de comandos, flags, formatos de arquivo e saída JSON ainda podem mudar de formato entre lançamentos. Todo o guia abaixo foi executado contra a compilação atual, mas releia este guia após a atualização.

## O problema que isso resolve

O OpenSpec geralmente reside dentro de um repositório de código: uma pasta `openspec/` ao lado do seu código, contendo especificações e mudanças para esse repositório.

Isso deixa de ser adequado no momento em que o planejamento é maior do que um repositório:

- Seu trabalho abrange vários repositórios — um recurso toca o servidor de API, o aplicativo web e uma biblioteca compartilhada. Em qual pasta `openspec/` o plano reside?
- Sua equipe planeja antes que o código exista, ou planeja coisas que nunca se tornam código neste repositório.
- Os requisitos são de propriedade de uma equipe e consumidos por outras. A versão do wiki desvia, e seu agente de codificação não consegue ler de qualquer maneira.

Um **store** é a resposta: um repositório autônomo cuja função inteira é o planejamento. Ele tem o mesmo formato `openspec/` que você já conhece — especificações e mudanças — mais um pequeno arquivo de identidade. Você o registra em sua máquina uma vez, pelo nome, e então todo comando normal do OpenSpec pode funcionar nele de qualquer lugar.

## A Estrutura

```
            team-plans  (um store: planejamento em seu próprio repo)
            ├── .openspec-store/store.yaml     identity: "Eu sou team-plans"
            └── openspec/
                ├── specs/      o que é verdade
                └── changes/    o que está em movimento
                      ▲
                      │ registrado em cada máquina pelo nome;
                      │ compartilhado ao fazer push/clone como qualquer repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (repo de código)   (repo de código)    (repo de código)
```

Duas regras mantêm isso simples:

1. **Um store é apenas um repositório Git.** Você commita, faz push, puxa e revisa ele mesmo. O OpenSpec nunca clona, sincroniza ou faz push de nada por conta própria.
2. **Declarações, não mecanismos.** Repos podem *declarar* como se relacionam com os stores (mostrado abaixo). As declarações mudam o que o OpenSpec pode lhe dizer — nunca onde seus comandos agem.

## Cinco minutos para o seu primeiro store

Dois comandos levam você do nada a uma mudança funcional, escopada pelo store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store pronto: team-plans
Localização: /Users/you/openspec/team-plans
Raiz OpenSpec: pronto
Registro: registrado

Próximo: execute comandos normais do OpenSpec contra este store, por exemplo:
  openspec new change <change-id> --store team-plans
Compartilhe este store fazendo commit e push como qualquer repo Git.
```

```bash
openspec new change add-login --store team-plans
```

```
Usando a raiz OpenSpec: team-plans (/Users/you/openspec/team-plans)
Mudança 'add-login' criada em /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Próximo: openspec status --change add-login --store team-plans
```

Esse é o modelo completo. A partir daqui, o ciclo de vida é exatamente o que você sabe — `status`, `instructions`, `validate`, `archive` — com `--store team-plans` em cada comando, e cada dica impressa carrega a bandeira para você. A linha `Using OpenSpec root:` sempre diz onde um comando está agindo.

## História: uma equipe, um repositório de planejamento

Uma equipe mantém seus specs e mudanças em `team-plans` em vez de espalhá-los por vários repositórios de código.

**Dia um (quem configurar):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Passar `--remote` registra a URL de clone dentro do arquivo de identidade do próprio store (`.openspec-store/store.yaml`), no commit inicial. Cada clone futuro nasce sabendo de onde veio, para que verificações de saúde e mensagens de erro possam imprimir uma correção completa e copiável para colegas de equipe que ainda não têm.

**Cada colega de equipe (uma vez por máquina):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

A partir daí, todos trabalham no mesmo repositório de planejamento pelo nome:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Compartilhar trabalho é Git, intencionalmente.** Uma mudança que você cria existe apenas no seu checkout até que você commita e faz push — o mesmo que código. Planos ganham branches, pull requests e revisão de graça, porque um store é um repo comum.

**Conectando os repositórios de código da equipe.** Um repositório de código cuja gestão de planejamento está totalmente externalizada precisa exatamente de uma linha, em `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Agora, todo comando OpenSpec executado dentro de `web-app` age sobre `team-plans` sem nenhuma bandeira:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

O ponteiro é um fallback, nunca uma substituição: um `--store` explícito sempre vence, e se o repo crescer com pastas de planejamento reais próprias, elas vencem (com um aviso para remover o ponteiro obsoleto).

## História: requisitos que cruzam limites de equipe

Uma equipe de plataforma possui os requisitos. As equipes de produto constroem contra eles, em seus próprios repositórios, com seus próprios designs. Uma referência descreve essa relação sem mover o trabalho de ninguém.

```
   platform-reqs (store)                 api-server (repo de código)
   possuído pela equipe de plataforma            possuído por uma equipe de produto
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ lê        │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (seus próprios designs)    │
   │   trabalho da plataforma  │          │ openspec/changes/        │
   │                          │          │   (o trabalho deles)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**A equipe de produto declara no `openspec/config.yaml` de seu repositório o que está usando:**

```yaml
references:
  - platform-reqs
```

Referências são contexto somente leitura. O repo mantém sua própria raiz `openspec`; o trabalho permanece lá. O que muda é que `openspec instructions` nesse repo agora inclui um índice dos specs do store referenciado — cada um com um resumo de uma linha e o comando exato para buscar (`openspec show <spec-id> --type spec --store platform-reqs`). Um agente trabalhando em `api-server` pode encontrar os requisitos de pagamento upstream, citá-los e escrever seu design de baixo nível na raiz do próprio repo — sem que ninguém precise copiar contexto.

Uma referência pode carregar sua fonte de clone, para que colegas de equipe que ainda não têm o store recebam uma correção completa em vez de um beco sem saída:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Quando você quer o plano e o código abertos juntos, crie um workset.** Isso é pessoal e explícito: cada pessoa escolhe as pastas com as quais realmente trabalha em sua máquina. Nada sobre esses caminhos de checkout local são commitados no repositório de planejamento compartilhado.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Duas perguntas que você sempre pode fazer

**"Minha configuração está saudável?"** — `openspec doctor` verifica a raiz atual e seus stores referenciados, somente leitura, com uma correção copiável para cada achado:

```
Doctor

Root
  Localização: /Users/you/src/api-server
  OpenSpec root: ok

Referências
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: O store referenciado 'design-system' não está registrado nesta máquina.
    Correção: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Com o que estou trabalhando?"** — `openspec context` monta o conjunto de trabalho a partir das declarações do OpenSpec: a raiz e os stores que ela referencia.

```
Contexto de trabalho para api-server (/Users/you/src/api-server)

Raiz OpenSpec
  api-server  /Users/you/src/api-server

Stores referenciados
  platform-reqs  /Users/you/openspec/platform-reqs
    Busca: openspec show <spec-id> --type spec --store platform-reqs
```

Ambos suportam `--json` para agentes. `openspec context --code-workspace <path>` adicionalmente escreve um arquivo de workspace do VS Code contendo o conjunto completo — esta é a única escrita que este comando realiza.

## Worksets: reabra as pastas em que você trabalha junto

Separado de tudo isso: a maioria das pessoas abre as mesmas poucas pastas juntas em cada sessão — o repositório de planejamento mais dois ou três repositórios de código. Um **workset** é uma visão pessoal e nomeada disso, reaberta com um comando em sua ferramenta de escolha.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       todos os três abertos na sua ferramenta
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (aberto no VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` então lança a ferramenta salva: editores (VS Code, Cursor) abrem uma janela com todos os membros e retornam. O primeiro membro é o primário. Substitua a ferramenta a qualquer momento com `--tool <id>`.

Worksets são deliberadamente *não* estado compartilhado. Eles vivem na sua máquina, nunca são commitados e não fazem reivindicações sobre o trabalho — eles apenas registram o que você gosta de ter aberto junto. Remover um nunca toca as pastas dos membros. Novas ferramentas são configuração, não código: qualquer coisa lançada via arquivo de workspace ou flags de anexação por pasta pode ser adicionada sob a chave `openers` na configuração global (`openspec config edit`).

## Como os comandos decidem onde agir

Todo comando normal resolve sua raiz da mesma maneira, nesta ordem:

```
1. --store <id>          você disse isso explicitamente        → aquele store
2. openspec/ mais próximo     uma raiz de planejamento real aqui    → este repo
   (subindo a partir do cwd)
3. store: ponteiro        config.yaml declara um store  → aquele store
4. nenhum do acima      stores registrados nesta     → erro com uma
                         máquina?                        dica de seleção
                         nenhum store registrado?         → o diretório atual
                                                          (comportamento clássico)
```

A linha `Using OpenSpec root:` (e o bloco `root` na saída `--json`) diz em qual caso você está.

## Limitações conhecidas

- **Formato Beta.** Tudo nesta página pode mudar entre releases — nomes, flags, formatos de arquivo, chaves JSON.
- **Um checkout por ID de store por máquina.** Registrar um segundo checkout sob o mesmo ID falha com uma dica para `store unregister` primeiro.
- **Sem sincronização, nunca — por design.** O OpenSpec nunca clona, puxa ou faz push. Um checkout obsoleto mostra specs obsoletas até que *você* puxe; as referências são indexadas ao vivo do que estiver em disco.
- **Alguns comandos permanecem onde estão.** `view`, `templates`, `schemas` e as formas nominais depreciadas (`openspec change show`, ...) agem apenas no diretório atual — nenhum `--store`.
- **O estado por máquina é por máquina.** O registro de stores e os worksets são configurações locais. Nada sobre o layout da sua máquina é nunca commitado para planejamento compartilhado.
- **Dois estilos de lançamento para worksets.** Uma ferramenta que não pode ser lançada com um arquivo de workspace ou flags de anexação por pasta não pode ser adicionada como um opener.
- **O JSON do Agente tem uma divisão de casing conhecida** (chaves da família store são snake_case, família workflow é camelCase). Documentado em [agent contract](../agent-contract.md); unificá-lo está pendente para um release versionado.

## Onde as coisas vivem

| O quê | Onde | Compartilhado? |
|---|---|---|
| O planejamento de um store | `<store>/openspec/` (specs, changes) | Sim — commita e faça push |
| A identidade de um store | `<store>/.openspec-store/store.yaml` | Sim — commitado com o store |
| O registro do store | `<data dir>/openspec/stores/registry.yaml` | Não — apenas nesta máquina |
| Worksets | `<data dir>/openspec/worksets/` | Não — apenas nesta máquina |

`<data dir>` é `~/.local/share/openspec` no macOS e Linux (ou `$XDG_DATA_HOME/openspec` quando definido), e `%LOCALAPPDATA%\openspec` no Windows.
## Referência

Flags exatas e formatos JSON para cada comando nesta página:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Worksets Pessoais) e o [agent contract](../agent-contract.md).