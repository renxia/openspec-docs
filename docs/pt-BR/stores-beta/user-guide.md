# Stores: Planeje em Seu Próprio Repositório

> **Beta.** Stores, referências, contexto de trabalho e worksets são novos. Nomes de comandos, flags, formatos de arquivo e saída JSON ainda podem sofrer alterações entre versões. Todo o passo a passo abaixo foi executado na versão atual, mas releia este guia após atualizar.

## O problema que isso resolve

O OpenSpec geralmente fica em um único repositório de código: uma pasta `openspec/` ao lado do seu código, contendo specs e alterações para esse repositório.

Isso deixa de funcionar assim que seu planejamento ultrapassa um único repositório:

- Seu trabalho abrange vários repositórios — uma funcionalidade afeta o servidor de API, o aplicativo web e uma biblioteca compartilhada. De qual pasta `openspec/` o planejamento fica?
- Sua equipe planeja antes mesmo de o código existir, ou planeja itens que nunca se tornam código *neste* repositório.
- Os requisitos são de propriedade de uma equipe e consumidos por outras. A versão da wiki fica defasada, e seu agente de codificação não consegue lê-la mesmo assim.

Uma **store** é a solução: um repositório independente cuja única função é o planejamento. Ele tem o mesmo formato de pasta `openspec/` que você já conhece — specs e alterações — além de um pequeno arquivo de identidade. Você registra ela na sua máquina uma única vez, pelo nome, e depois todos os comandos normais do OpenSpec podem funcionar com ela de qualquer lugar.

## A estrutura

```
            team-plans  (um store: planejamento em seu próprio repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      o que é verdadeiro
                └── changes/    o que está em andamento
                      ▲
                      │ registrado em cada máquina por nome;
                      │ compartilhado por push/clone como qualquer repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (repo de código)   (repo de código)    (repo de código)
```

Duas regras mantêm isso simples:

1. **Um store é apenas um repo git.** Você faz commit, push, pull e revisa ele mesmo. O OpenSpec nunca clona, sincroniza ou faz push de nada por conta própria.
2. **Declarações, não maquinário.** Repos podem *declarar* como se relacionam com stores (mostrado abaixo). Declarações mudam o que o OpenSpec pode dizer a você — nunca onde seus comandos atuam.

## Cinco minutos para o seu primeiro store

Dois comandos levam você do nada a uma change funcional, com escopo de store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store pronto: team-plans
Localização: /Users/you/openspec/team-plans
Raiz do OpenSpec: pronta
Registro: registrado

Próximo: execute comandos OpenSpec normais contra este store, por exemplo:
  openspec new change <change-id> --store team-plans
Compartilhe este store fazendo commit e push dele como qualquer repo Git.
```

```bash
openspec new change add-login --store team-plans
```

```
Usando raiz do OpenSpec: team-plans (/Users/you/openspec/team-plans)
Change 'add-login' criada em /Users/you/openspec/team-plans/openspec/changes/add-login/
Esquema: spec-driven
Próximo: openspec status --change add-login --store team-plans
```

Esse é todo o modelo. A partir daqui, o ciclo de vida é exatamente o que você conhece — `status`, `instructions`, `validate`, `archive` — com `--store team-plans` em cada comando, e cada dica impressa carrega a flag para você. A linha `Using OpenSpec root:` sempre diz onde um comando está atuando.

## História: um time, um repo de planejamento

Um time mantém seus specs e changes em `team-plans` em vez de espalhá-los por repos de código.

**Dia um (quem quer que configure):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Passar `--remote` registra a URL de clone dentro do próprio arquivo de identidade do store (`.openspec-store/store.yaml`), no commit inicial. Cada clone futuro nasce sabendo de onde veio, para que verificações de saúde e mensagens de erro possam imprimir uma correção completa e copiável para colegas de equipe que ainda não a possuem.

**Cada colega de equipe (uma vez por máquina):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

A partir daí, todos trabalham no mesmo repo de planejamento pelo nome:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Compartilhar trabalho é git, de propósito.** Uma change que você cria existe apenas no seu checkout até você fazer commit e push dela — igual ao código. Planos ganham branches, pull requests e revisão de graça, porque um store é um repo comum.

**Conectando os repos de código do time.** Um repo de código cujo planejamento é totalmente externalizado precisa de exatamente uma linha, em `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Agora todo comando OpenSpec executado dentro de `web-app` atua em `team-plans` sem nenhuma flag:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Usando raiz do OpenSpec: team-plans (/Users/you/openspec/team-plans)
...
```

O ponteiro é um fallback, nunca uma substituição: um `--store` explícito sempre ganha, e se o repo desenvolver pastas de planejamento reais próprias, elas ganham (com um aviso para remover o ponteiro obsoleto).

**Um padrão para cada repo na sua máquina.** Se você trabalha em vários repos de código que todos planejam no mesmo store, defina-o uma vez, globalmente, em vez de adicionar a linha `store:` a cada repo:

```bash
openspec config set defaultStore team-plans
```

Agora qualquer comando executado fora de uma raiz de planejamento — e sem `--store` e sem ponteiro de projeto — resolve para `team-plans`. Ele fica no final da lista de precedência, então `--store`, uma raiz local e um ponteiro `store:` de projeto ainda ganham. O banner de raiz e o bloco JSON `root` relatam `source: "global_default"` com o id do store, para que você sempre possa distinguir um padrão de toda a máquina do próprio ponteiro do repo. Limpe-o com `openspec config unset defaultStore`. Se o id não estiver registrado, os comandos dão erro e dizem para registrá-lo ou limpar o padrão obsoleto.

## História: requisitos que cruzam as linhas dos times

Um time de plataforma é dono dos requisitos. Times de produto constroem com base neles, em seus próprios repos, com seus próprios designs. Uma referência descreve esse relacionamento sem mover o trabalho de ninguém.

```
   platform-reqs (store)                 api-server (repo de código)
   de propriedade do time de plataforma            de propriedade de um time de produto
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ lê       │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (seus próprios designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (seu próprio trabalho)       │
   └──────────────────────────┘          └──────────────────────────┘
```

**O time de produto declara do que depende** no `openspec/config.yaml` do seu repo:

```yaml
references:
  - platform-reqs
```

Referências são contexto somente leitura. O repo mantém sua própria raiz `openspec/`; o trabalho fica lá. O que muda: `openspec instructions` naquele repo agora inclui um índice dos specs do store referenciado — cada um com um resumo de uma linha e o comando de busca exato (`openspec show <spec-id> --type spec --store platform-reqs`). Um agente trabalhando em `api-server` pode encontrar os requisitos de pagamento upstream, citá-los e escrever seu design de baixo nível na própria raiz do repo — sem ninguém colar contexto por aí.

Uma referência pode carregar sua fonte de clone, para que colegas de equipe que ainda não têm o store recebam uma correção completa em vez de um beco sem saída:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Quando você quiser o plano e o código abertos juntos, crie um workset.** Isso é pessoal e explícito: cada pessoa escolhe as pastas com que realmente trabalha em sua máquina. Nada sobre esses caminhos de checkout locais é commitado no repo de planejamento compartilhado.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Duas perguntas que você sempre pode fazer

**"Minha configuração está saudável?"** — `openspec doctor` verifica a raiz atual e seus stores referenciados, somente leitura, com uma correção copiável por descoberta:

```
Doctor

Raiz
  Localização: /Users/you/src/api-server
  Raiz do OpenSpec: ok

Referências
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: O store referenciado 'design-system' não está registrado nesta máquina.
    Correção: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Com o que estou trabalhando?"** — `openspec context` monta o conjunto de trabalho a partir de declarações OpenSpec: a raiz e os stores que ela referencia.

```
Contexto de trabalho para api-server (/Users/you/src/api-server)

Raiz do OpenSpec
  api-server  /Users/you/src/api-server

Stores referenciados
  platform-reqs  /Users/you/openspec/platform-reqs
    Buscar: openspec show <spec-id> --type spec --store platform-reqs
```

Ambos suportam `--json` para agentes. `openspec context --code-workspace <path>` adicionalmente escreve um arquivo de workspace do VS Code contendo todo o conjunto — a única escrita que este comando realiza.

## Worksets: reabra as pastas com que você trabalha junto

Separado de tudo isso: a maioria das pessoas abre as mesmas poucas pastas juntas a cada sessão — o repo de planejamento mais dois ou três repos de código. Um **workset** é uma visão pessoal e nomeada de exatamente isso, reaberta com um comando na sua ferramenta de escolha.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       os três abertos na sua ferramenta
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

Worksets são deliberadamente *não* estado compartilhado. Eles vivem na sua máquina, nunca são commitados e não fazem nenhuma afirmação sobre o trabalho — eles apenas registram o que você gosta de abrir junto. Remover um nunca toca nas pastas dos membros. Novas ferramentas são configuração, não código: qualquer coisa lançada via um arquivo de workspace ou flags de anexo por pasta pode ser adicionada sob a chave `openers` na configuração global (`openspec config edit`).

## Como os comandos decidem onde atuar

Todo comando normal resolve sua raiz da mesma forma, nesta ordem:

```
1. --store <id>          você disse explicitamente        → esse store
2. nearest openspec/     uma raiz de planejamento real aqui     → este repo
   (subindo a partir do cwd)
3. store: pointer        config.yaml declara um store  → esse store
4. defaultStore          configuração global define um padrão de máquina  → esse store
5. none of the above     stores registrados nesta máquina?     → erro com uma
                         dica de seleção
                         nenhum store registrado?         → o diretório atual
                                                          (comportamento clássico)
```

A linha `Using OpenSpec root:` (e o bloco `root` na saída `--json`) diz em qual caso você está.

## Limitações conhecidas

- **Forma beta.** Tudo nesta página pode mudar entre lançamentos — nomes, flags, formatos de arquivo, chaves JSON.
- **Um checkout por id de store por máquina.** Registrar um segundo checkout com o mesmo id falha com uma dica para fazer `store unregister` primeiro.
- **Sem sincronização, nunca — de propósito.** O OpenSpec nunca clona, puxa ou faz push. Um checkout obsoleto mostra specs obsoletos até que *você* puxe; referências são indexadas ao vivo a partir de qualquer coisa que esteja no disco.
- **Pastas de planejamento vazias podem estar ausentes.** Um novo store pode não ter `openspec/changes/`, `openspec/specs/` ou `openspec/changes/archive/` no Git ainda. Isso é aceito durante o beta; essas pastas aparecem uma vez que comandos normais criem arquivos para elas.
- **Repos ponteiro permanecem ponteiros.** Um repo apenas de configuração cujo `openspec/config.yaml` declara `store: <id>` é tratado como planejamento externalizado, não como um checkout de store para registrar. Remova a linha `store:` primeiro se você quiser intencionalmente converter aquele repo em uma raiz de store local.
- **Alguns comandos permanecem onde estão.** `view`, `templates`, `schemas` e as formas nominais obsoletas (`openspec change show`, ...) atuam apenas no diretório atual — sem `--store`.
- **Estado por máquina é por máquina.** O registro de stores e os worksets são configurações locais. Nada sobre o layout da sua máquina é commitado no planejamento compartilhado.
- **Dois estilos de lançamento para worksets.** Uma ferramenta que não pode ser lançada com um arquivo de workspace ou flags de anexo por pasta não pode ser adicionada como um opener.
- **O JSON do agente tem uma divisão de caixa conhecida** (chaves da família store são snake_case, da família workflow são camelCase). Documentado no [contrato do agente](../agent-contract.md); a unificação é adiada para um lançamento versionado.

## Onde as coisas ficam armazenadas

| O que | Onde | Compartilhado? |
|---|---|---|
| O planejamento da loja | `<store>/openspec/` (especificações, alterações) | Sim — faça commit e envie por push |
| A identidade da loja | `<store>/.openspec-store/store.yaml` | Sim — commitado junto com a loja |
| O registro de lojas | `<data dir>/openspec/stores/registry.yaml` | Não — apenas nesta máquina |
| Worksets | `<data dir>/openspec/worksets/` | Não — apenas nesta máquina |

`<data dir>` é `~/.local/share/openspec` no macOS e no Linux (ou `$XDG_DATA_HOME/openspec` quando definido), e `%LOCALAPPDATA%\openspec` no Windows.

## Referência

Sinalizações exatas e estruturas JSON de todos os comandos desta página: [Referência da CLI](../cli.md) (Stores, Doctor, Working context, Personal worksets) e o [contrato do agente](../agent-contract.md).