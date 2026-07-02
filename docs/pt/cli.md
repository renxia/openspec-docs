# Referência da CLI

O OpenSpec CLI (`openspec`) fornece comandos de terminal para configuração de projeto, validação, inspeção de status e gerenciamento. Esses comandos complementam os comandos de barra AI (como `/opsx:propose`) documentados em [Commands](commands.md).

## Resumo

| Categoria | Comandos | Propósito |
|----------|----------|---------|
| **Configuração** | `init`, `update` | Inicializar e atualizar o OpenSpec no seu projeto |
| **Armazenamentos (repos OpenSpec autônomos)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Gerenciar armazenamentos — repos OpenSpec autônomos que você registrou |
| **Saúde** | `doctor` | Relatar a saúde do relacionamento para a raiz resolvida |
| **Contexto de trabalho** | `context` | Montar o conjunto de trabalho (raiz + armazenamentos referenciados) |
| **Conjuntos de trabalho pessoais** | `workset create`, `workset list`, `workset open`, `workset remove` | Manter e abrir visualizações locais e pessoais na sua ferramenta |
| **Navegação** | `list`, `view`, `show` | Explorar mudanças e especificações |
| **Validação** | `validate` | Verificar mudanças e especificações em busca de problemas |
| **Ciclo de vida** | `archive` | Finalizar as mudanças concluídas |
| **Fluxo de trabalho** | `new change`, `status`, `instructions`, `templates`, `schemas` | Suporte a fluxo de trabalho orientado por artefatos |
| **Esquemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Criar e gerenciar fluxos de trabalho personalizados |
| **Configuração** | `config` | Visualizar e modificar configurações |
| **Utilidade** | `feedback`, `completion` | Feedback e integração com o shell |

## Comandos para Humanos vs Agentes

A maioria dos comandos de CLI é projetada para **uso humano** em um terminal. Alguns comandos também suportam o **uso por agentes/scripts** via saída JSON.

### Comandos Apenas para Humanos

Estes comandos são interativos e projetados para uso em terminal:

| Comando | Propósito |
|---------|---------|
| `openspec init` | Inicializar projeto (prompts interativos) |
| `openspec view` | Dashboard interativo |
| `openspec workset open <name>` | Abrir um workset salvo (janela de editor ou sessão de agente de terminal) |
| `openspec config edit` | Abrir a configuração no editor |
| `openspec feedback` | Enviar feedback via GitHub |
| `openspec completion install` | Instalar completions de shell |

### Comandos Compatíveis com Agentes

Estes comandos suportam saída `--json` para uso programático por agentes e scripts de IA:

| Comando | Uso Humano | Uso de Agente |
|---------|-----------|---------------|
| `openspec list` | Navegar mudanças/especificações | `--json` para dados estruturados |
| `openspec show <item>` | Ler conteúdo | `--json` para parsing |
| `openspec validate` | Verificar problemas | `--all --json` para validação em massa |
| `openspec status` | Ver o progresso do artefato | `--json` para status estruturado |
| `openspec instructions` | Obter próximos passos | `--json` para instruções de agente |
| `openspec templates` | Encontrar caminhos de template | `--json` para resolução de caminho |
| `openspec schemas` | Listar esquemas disponíveis | `--json` para descoberta de esquema |
| `openspec store setup <id>` | Criar e registrar um store local | `--json` com entradas explícitas para saída estruturada de configuração |
| `openspec store register <path>` | Registrar um store existente | `--json` para saída de registro estruturado |
| `openspec store unregister <id>` | Esquecer um registro de store local | `--json` para saída de limpeza estruturada |
| `openspec store remove <id>` | Excluir uma pasta de store registrada | `--yes --json` para exclusão não interativa |
| `openspec store list` | Navegar stores registrados | `--json` para registros estruturados |
| `openspec store doctor` | Verificar a configuração do store local | `--json` para diagnósticos estruturados |
| `openspec new change <id>` | Criar scaffolding de mudança local no repositório | `--json`, mais `--store <id>` para usar um store registrado como raiz OpenSpec |
| `openspec workset create [name]` | Compor uma visualização de trabalho pessoal | `--member <path> --json` para composição não interativa |
| `openspec workset list` | Navegar worksets salvos | `--json` para visualizações estruturadas |
| `openspec workset remove <name>` | Excluir uma visualização salva | `--yes --json` para remoção não interativa |

---

## Opções Globais

Estas opções funcionam com todos os comandos:

| Opção | Descrição |
|--------|-------------|
| `--version`, `-V` | Mostrar número da versão |
| `--no-color` | Desativar saída colorida |
| `--help`, `-h` | Exibir ajuda para o comando |

---

## Comandos de Configuração (Setup)

### `openspec init`

Inicializa o OpenSpec em seu projeto. Cria a estrutura de pastas e configura as integrações das ferramentas de IA.

O comportamento padrão usa os padrões globais de configuração: perfil `core`, entrega `both`, fluxos de trabalho `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|-------------|-------------|
| `path` | Não | Diretório alvo (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--tools <list>` | Configurar ferramentas de IA de forma não interativa. Use `all`, `none` ou lista separada por vírgulas |
| `--force` | Limpar arquivos legados automaticamente sem solicitar confirmação |
| `--profile <profile>` | Sobrescrever o perfil global para esta execução do init (`core` ou `custom`) |

O `--profile custom` usa quaisquer fluxos de trabalho atualmente selecionados na configuração global (`openspec config profile`).

**IDs de ferramentas suportadas (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> Esta lista espelha o `AI_TOOLS` em `src/core/config.ts`. Consulte [Supported Tools](supported-tools.md) para a habilidade e os caminhos de comando de cada ferramenta.

**Exemplos:**

```bash
# Inicialização interativa
openspec init

# Inicializar em um diretório específico
openspec init ./my-project

# Não interativo: configurar para Claude e Cursor
openspec init --tools claude,cursor

# Configurar para todas as ferramentas suportadas
openspec init --tools all

# Sobrescrever perfil para esta execução
openspec init --profile core

# Pular prompts e limpar arquivos legados automaticamente
openspec init --force
```

**O que ele cria:**

```
openspec/
├── specs/              # Suas especificações (fonte da verdade)
├── changes/            # Mudanças propostas
└── config.yaml         # Configuração do projeto

.claude/skills/         # Habilidades de código Claude (se claude for selecionado)
.cursor/skills/         # Habilidades Cursor (se cursor for selecionado)
.cursor/commands/       # Comandos OPSX Cursor (se a entrega incluir comandos)
... (outras configurações de ferramentas)
```

---

### `openspec update`

Atualiza os arquivos de instrução do OpenSpec após atualizar a CLI. Regenera os arquivos de configuração das ferramentas de IA usando seu perfil global atual, fluxos de trabalho selecionados e modo de entrega.

```
openspec update [path] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|-------------|-------------|
| `path` | Não | Diretório alvo (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--force` | Forçar a atualização mesmo quando os arquivos estão atualizados |

**Exemplo:**

```bash
# Atualizar arquivos de instrução após atualização do npm
npm update @fission-ai/openspec
openspec update
```

---

## Stores (repositórios OpenSpec autônomos)

> **Beta.** Stores e os recursos construídos sobre eles (referências, contexto de trabalho, worksets) são novos; nomes de comandos, flags, formatos de arquivo e saída JSON podem mudar entre lançamentos. Para o guia de walkthrough focado no problema, consulte o [stores guide](stores-beta/user-guide.md).

Um store é um repositório OpenSpec autônomo que você registrou nesta máquina — por exemplo, um repositório de planejamento ou um repositório de contratos. Registrar um store permite que comandos normais (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) atuem nele de qualquer lugar ao passar `--store <id>`.

### `openspec store setup`

Cria e registra um store local. Sem argumentos em um terminal, o OpenSpec guia o usuário através da configuração. Agentes e scripts devem passar entradas explícitas e usar `--json`.

```bash
openspec store setup [id] [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--path <path>` | Pasta onde o store deve residir (por exemplo `~/openspec/<id>`) |
| `--remote <url>` | Registrar o remoto canônico em `store.yaml` do novo store |
| `--init-git` | Inicializar um repositório Git com um commit inicial (padrão) |
| `--no-init-git` | Pular toda ação de Git: sem init, sem commit inicial |
| `--json` | Saída JSON |

Execuções não interativas (`--json`, scripts, agentes) devem passar tanto o ID do store quanto o `--path`. Em um terminal interativo, a configuração solicita o local com uma sugestão editável em um lugar visível e pertencente ao usuário (por exemplo `~/openspec/<id>`); ela nunca usa o diretório de dados gerenciado pelo OpenSpec como padrão.

Exemplos:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registra uma pasta de store local existente.

```bash
openspec store register [path] [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--id <id>` | ID do store; padrão para metadados do store ou nome da pasta |
| `--yes` | Confirmar a criação de metadados de identidade do store para uma raiz OpenSpec saudável |
| `--json` | Saída JSON |

### `openspec store unregister`

Esquecer um registro de store local sem excluir arquivos.

```bash
openspec store unregister <id> [--json]
```

Use isto quando um store foi movido, clonado em outro lugar ou não deve mais ser exibido pelo OpenSpec nesta máquina.

### `openspec store remove`

Esquecer um registro de store local e excluir sua pasta local.

```bash
openspec store remove <id> [--yes] [--json]
```

O comando `remove` mostra a pasta exata antes de excluir em um terminal interativo. Agentes, scripts e chamadores JSON devem passar `--yes` para confirmar a exclusão. O OpenSpec se recusa a excluir uma pasta que não contenha metadados de store correspondentes.

### `openspec store list`

Lista stores registrados localmente.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Verifica o registro do store local, os metadados e a presença de Git.

```bash
openspec store doctor [id] [--json]
```

O Doctor é apenas diagnóstico; ele relata raízes ausentes, incompatibilidades de metadados e estado inválido do registro local sem modificar o store.

### Referenciando stores a partir de um projeto

Um repositório de projeto pode declarar quais stores seu trabalho utiliza em `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

A partir daí, a saída do `openspec instructions` nesse repositório (tanto as superfícies por artefato quanto de `apply`, modos JSON e humano) contém um índice das especificações de cada store referenciado — IDs de especificação, um resumo de uma linha da seção Purpose de cada spec e o comando de busca (`openspec show <spec-id> --type spec --store <id>`). O índice é construído ao vivo a partir do checkout registrado em cada execução; o conteúdo da especificação nunca é copiado para a saída.

As referências são contexto somente leitura. Elas nunca mudam onde os comandos atuam: o trabalho permanece na raiz própria do repositório, e escrever em um store referenciado continua sendo uma ação explícita `--store`. Uma referência que não pode ser resolvida (por exemplo, um store não registrado nesta máquina) degrada para um aviso no índice com a correção exata, e as instruções ainda são geradas. `openspec doctor` relata a saúde da referência em um local.

### Registrando de onde um store foi clonado

Um store pode registrar sua fonte de clonagem canônica em seu arquivo de identidade commitado, para que o onboarding nunca termine em "registre o store":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

O remoto é registrado em `.openspec-store/store.yaml` dentro do commit inicial, para que cada clone nasça sabendo disso. Para um store existente, edite `store.yaml` manualmente e faça o commit. O `store doctor` mostra o remoto registrado (e a origem Git observada pelo checkout); `setup`/`register` nomeia com base no guia; e `register` registra a origem do checkout no registro local da máquina.

Uma declaração de referência também pode carregar a fonte de clonagem, para que um colega de equipe que ainda não tem o store receba uma correção completa e copiada (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Registrar um remoto não é sincronização: o OpenSpec nunca clona, puxa ou envia por conta própria.

### Declarando um store padrão

Um repositório cujo planejamento é totalmente externalizado — sem `openspec/specs/` ou `openspec/changes/` locais — pode declarar seu store uma vez em vez de passar `--store` em cada comando:

```yaml
# openspec/config.yaml (o único arquivo sob openspec/)
store: team-context
```

Os comandos normais, então, resolvem para o store declarado automaticamente; o banner da raiz e o bloco `root` JSON relatam `source: "declared"` com o ID do store, e as dicas impressas ainda carregam `--store <id>`. A declaração é um fallback, nunca uma substituição: o `--store` explícito sempre vence, e um diretório com pastas de planejamento reais ignora o ponteiro (com um aviso). Para converter um repositório apontador em uma raiz OpenSpec local, remova a linha `store:` e execute `openspec init` — o init se recusa a criar scaffolding enquanto a declaração estiver presente.

## Doctor (saúde do relacionamento)

Uma pergunta somente leitura, um único local: o OpenSpec root está saudável e os stores que ele referencia estão disponíveis nesta máquina?

```bash
openspec doctor [--store <id>] [--json]
```

O relatório separa a saúde da raiz, a saúde dos metadados do store (incluindo uma nota quando o remoto registrado e a origem do checkout divergem) e a saúde das referências (as mesmas instruções de diagnóstico são mostradas, com correções de clone para referências não resolvidas). Achados de saúde de qualquer severidade saem com 0 — os agentes leem os arrays `status`; apenas falhas de comando (sem raiz, store desconhecido) saem com 1. O Doctor nunca clona, sincroniza ou repara. Para obter o conjunto montado em si, e não sua saúde, use `openspec context`.

## Contexto de trabalho (o conjunto montado)

Tudo a que este trabalho se relaciona através das declarações OpenSpec, em um único conjunto de trabalho: a raiz OpenSpec e os stores que ela referencia.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

O resumo JSON é consumível por agentes (cada store referenciado disponível carrega sua receita de fetch; membros não resolvidos carregam as mesmas instruções de correção e o que o doctor mostra). `--code-workspace` adicionalmente escreve um arquivo de workspace do VS Code contendo a raiz mais os stores referenciados disponíveis (`ref:<id>` pastas) — esta é a única escrita que este comando realiza, recusada sem `--force` se o arquivo existir. Membros indisponíveis são relatados, nunca adivinhados.

"Contexto de trabalho" é o conjunto montado; o campo `context:` em `openspec/config.yaml` é o background do projeto injetado nas instruções — duas coisas diferentes. `openspec doctor` responde se o conjunto está saudável; `openspec context` responde qual é o conjunto.

## Personal worksets

> **Beta.** Worksets fazem parte da nova superfície beta; comandos, flags e formatos de arquivo podem mudar entre os lançamentos. Para o guia de navegação, consulte [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Um workset é uma visualização nomeada e pessoal das pastas em que você trabalha junto — um diretório raiz de planejamento mais o que mais você escolher — mantida na sua máquina e reaberta por nome na sua ferramenta. É puramente local: nunca commitado, nunca compartilhado, nunca derivado de declarações, e a remoção de um nunca toca uma pasta membro.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` executa um fluxo guiado curto (ou aceita flags `--member` de forma não interativa; o primeiro membro é o principal — as sessões começam ali). `open` lança a ferramenta escolhida: editores (VS Code, Cursor) abrem uma janela com cada membro e retornam; agentes CLI (Claude Code, codex) assumem este terminal como uma sessão com todos os membros anexados e sem prompt pré-preenchido, terminando quando você sai. Uma pasta membro ausente no momento da abertura é ignorada com uma nota; o restante abre. A preferência de ferramenta salva pode ser sobrescrita por abertura usando `--tool`.

Apoiar uma nova ferramenta é configuração, não código. Cada ferramenta é um dos dois estilos de lançamento — `workspace-file` (lançado com o `.code-workspace` gerado) ou `attach-dirs` (uma flag de anexação por membro) — e a chave `openers` no `config.json` global (abra-o com `openspec config edit`) adiciona ferramentas ou ajusta recursos em cada campo:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Todo o estado do workset vive na pasta `worksets/` do diretório de dados global (as visualizações salvas mais os arquivos `<name>.code-workspace` gerados, regenerados em cada abertura); excluir essa pasta remove todo rastro.

---

## Comandos de Navegação

### `openspec list`

Lista mudanças ou especificações no seu projeto.

```
openspec list [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--specs` | Lista especificações em vez de mudanças |
| `--changes` | Lista mudanças (padrão) |
| `--sort <order>` | Classifica por `recent` (recente, padrão) ou `name` (nome) |
| `--json` | Saída como JSON |

**Exemplos:**

```bash
# Lista todas as mudanças ativas
openspec list

# Lista todas as especificações
openspec list --specs

# Saída em JSON para scripts
openspec list --json
```

**Saída (texto):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Exibe um painel interativo para explorar especificações e mudanças.

```
openspec view
```

Abre uma interface baseada em terminal para navegar pelas especificações e mudanças do seu projeto.

---

### `openspec show`

Exibe detalhes de uma mudança ou especificação.

```
openspec show [item-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `item-name` | Não | Nome da mudança ou especificação (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--type <type>` | Especifica o tipo: `change` (mudança) ou `spec` (especificação) (detectado automaticamente se não for ambíguo) |
| `--json` | Saída como JSON |
| `--no-interactive` | Desabilita prompts |

**Opções específicas de Mudança:**

| Opção | Descrição |
|--------|-------------|
| `--deltas-only` | Mostra apenas especificações delta (modo JSON) |

**Opções específicas de Especificação:**

| Opção | Descrição |
|--------|-------------|
| `--requirements` | Mostra apenas requisitos, exclui cenários (modo JSON) |
| `--no-scenarios` | Exclui o conteúdo do cenário (modo JSON) |
| `-r, --requirement <id>` | Mostra requisito específico por índice baseado em 1 (modo JSON) |

**Exemplos:**

```bash
# Seleção interativa
openspec show

# Mostra uma mudança específica
openspec show add-dark-mode

# Mostra uma especificação específica
openspec show auth --type spec

# Saída em JSON para análise
openspec show add-dark-mode --json
```

---

## Comandos de Validação

### `openspec validate`

Valida mudanças e especificações em busca de problemas estruturais.

```
openspec validate [item-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `item-name` | Não | Item específico para validar (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--all` | Valida todas as mudanças e especificações |
| `--changes` | Valida todas as mudanças |
| `--specs` | Valida todas as especificações |
| `--type <type>` | Especifica o tipo quando o nome é ambíguo: `change` (mudança) ou `spec` (especificação) |
| `--strict` | Habilita modo de validação rigorosa |
| `--json` | Saída como JSON |
| `--concurrency <n>` | Máximo de validações paralelas (padrão: 6, ou ambiente `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Desabilita prompts |

**Exemplos:**

```bash
# Validação interativa
openspec validate

# Valida uma mudança específica
openspec validate add-dark-mode

# Valida todas as mudanças
openspec validate --changes

# Valida tudo com saída em JSON (para CI/scripts)
openspec validate --all --json

# Validação rigorosa com paralelismo aumentado
openspec validate --all --strict --concurrency 12
```

**Saída (texto):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: seção "Technical Approach" ausente

1 warning found
```

**Saída (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: seção 'Technical Approach' ausente"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Comandos de Ciclo de Vida

### `openspec archive`

Arquiva uma mudança concluída e mescla especificações delta nas especificações principais.

```
openspec archive [change-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Mudança a ser arquivada (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `-y, --yes` | Pula prompts de confirmação |
| `--skip-specs` | Pula atualizações de especificações (para mudanças apenas de infraestrutura/ferramentas/documentação) |
| `--no-validate` | Pula validação (requer confirmação) |

**Exemplos:**

```bash
# Arquivamento interativo
openspec archive

# Arquiva mudança específica
openspec archive add-dark-mode

# Arquiva sem prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Arquiva uma mudança de ferramenta que não afeta especificações
openspec archive update-ci-config --skip-specs
```

**O que ele faz:**

1. Valida a mudança (a menos que `--no-validate`)
2. Solicita confirmação (a menos que `--yes`)
3. Mescla especificações delta em `openspec/specs/`
4. Move a pasta da mudança para `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandos de Fluxo de Trabalho

Estes comandos suportam o fluxo OPSX orientado por artefatos. Eles são úteis tanto para humanos verificando o progresso quanto para agentes determinando os próximos passos.

### `openspec new change`

Cria um diretório de mudança e metadados opcionais registrados na raiz OpenSpec resolvida.

```bash
openspec new change <name> [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--description <text>` | Descrição para adicionar ao `index.md` |
| `--goal <text>` | Metadado de objetivo opcional para armazenar com a mudança |
| `--schema <name>` | Esquema de fluxo de trabalho a ser usado |
| `--store <id>` | ID do armazenamento a ser usado como raiz OpenSpec (um store é um repositório OpenSpec autônomo que você registrou) |
| `--json` | Saída JSON |

Exemplos:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Exibe o status de conclusão do artefato para uma mudança.

```
openspec status [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--change <id>` | Nome da mudança (solicita se omitido) |
| `--schema <name>` | Sobrescrita de esquema (detectada automaticamente a partir do config da mudança) |
| `--json` | Saída como JSON |

**Exemplos:**

```bash
# Verificação de status interativa
openspec status

# Status para mudança específica
openspec status --change add-dark-mode

# JSON para uso por agentes
openspec status --change add-dark-mode --json
```

**Saída (texto):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**Saída (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Obtém instruções enriquecidas para criar um artefato ou aplicar tarefas. Usado por agentes de IA para entender o que criar em seguida.

```
openspec instructions [artifact] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `artifact` | Não | ID do artefato: `proposal`, `specs`, `design`, `tasks` ou `apply` |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--change <id>` | Nome da mudança (obrigatório em modo não interativo) |
| `--schema <name>` | Sobrescrita de esquema |
| `--json` | Saída como JSON |

**Caso especial:** Use `apply` como o artefato para obter instruções de implementação de tarefas.

**Exemplos:**

```bash
# Obtém instruções para o próximo artefato
openspec instructions --change add-dark-mode

# Obtém instruções de um artefato específico
openspec instructions design --change add-dark-mode

# Obtém instruções de aplicação/implementação
openspec instructions apply --change add-dark-mode

# JSON para consumo por agentes
openspec instructions design --change add-dark-mode --json
```

**A saída inclui:**

- Conteúdo do template para o artefato
- Contexto do projeto a partir da configuração
- Conteúdo dos artefatos dependentes
- Regras específicas de cada artefato a partir da configuração

---

### `openspec templates`

Mostra os caminhos de template resolvidos para todos os artefatos em um esquema.

```
openspec templates [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--schema <name>` | Esquema a ser inspecionado (padrão: `spec-driven`) |
| `--json` | Saída como JSON |

**Exemplos:**

```bash
# Mostra caminhos de template para o esquema padrão
openspec templates

# Mostra templates para um esquema personalizado
openspec templates --schema my-workflow

# JSON para uso programático
openspec templates --json
```

**Saída (texto):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Lista os esquemas de fluxo de trabalho disponíveis com suas descrições e fluxos de artefatos.

```
openspec schemas [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--json` | Saída como JSON |

**Exemplo:**

```bash
openspec schemas
```

**Saída:**

```
Available schemas:

  spec-driven (package)
    O fluxo de desenvolvimento padrão baseado em especificações
    Fluxo: proposal → specs → design → tasks

  my-custom (project)
    Fluxo de trabalho personalizado para este projeto
    Fluxo: research → proposal → tasks
```

## Comandos de Schema

Comandos para criar e gerenciar schemas de fluxo de trabalho personalizados.

### `openspec schema init`

Cria um schema local ao projeto.

```
openspec schema init <name> [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `name` | Sim | Nome do schema (kebab-case) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--description <text>` | Descrição do schema |
| `--artifacts <list>` | IDs de artefatos separados por vírgula (padrão: `proposal,specs,design,tasks`) |
| `--default` | Define como o schema padrão do projeto |
| `--no-default` | Não solicitar para definir como padrão |
| `--force` | Sobrescrever o schema existente |
| `--json` | Saída em JSON |

**Exemplos:**

```bash
# Criação interativa de schema
openspec schema init research-first

# Não interativo com artefatos específicos
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**O que ele cria:**

```
openspec/schemas/<name>/
├── schema.yaml           # Definição do Schema
└── templates/
    ├── proposal.md       # Template para cada artefato
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Copia um schema existente para o seu projeto para personalização.

```
openspec schema fork <source> [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `source` | Sim | Schema a ser copiado |
| `name` | Não | Novo nome do schema (padrão: `<source>-custom`) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--force` | Sobrescrever o destino existente |
| `--json` | Saída em JSON |

**Exemplo:**

```bash
# Fork do schema spec-driven embutido
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valida a estrutura e os templates de um schema.

```
openspec schema validate [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `name` | Não | Schema a ser validado (valida todos se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--verbose` | Mostrar etapas detalhadas de validação |
| `--json` | Saída em JSON |

**Exemplo:**

```bash
# Validar um schema específico
openspec schema validate my-workflow

# Validar todos os schemas
openspec schema validate
```

---

### `openspec schema which`

Mostra de onde um schema é resolvido (útil para depuração da precedência).

```
openspec schema which [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `name` | Não | Nome do schema |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--all` | Listar todos os schemas com suas fontes |
| `--json` | Saída em JSON |

**Exemplo:**

```bash
# Verificar de onde um schema provém
openspec schema which spec-driven
```

**Saída:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedência do Schema:**

1. Projeto: `openspec/schemas/<name>/`
2. Usuário: `~/.local/share/openspec/schemas/<name>/`
3. Pacote: Schemas embutidos

---

## Comandos de Configuração

### `openspec config`

Visualiza e modifica a configuração global do OpenSpec.

```
openspec config <subcommand> [options]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-------------|
| `path` | Mostrar localização do arquivo de configuração |
| `list` | Mostrar todas as configurações atuais |
| `get <key>` | Obter um valor específico |
| `set <key> <value>` | Definir um valor |
| `unset <key>` | Remover uma chave |
| `reset` | Resetar para os padrões |
| `edit` | Abrir no `$EDITOR` |
| `profile [preset]` | Configurar o perfil de fluxo de trabalho interativamente ou via preset |

**Exemplos:**

```bash
# Mostrar caminho do arquivo de configuração
openspec config path

# Listar todas as configurações
openspec config list

# Obter um valor específico
openspec config get telemetry.enabled

# Definir um valor
openspec config set telemetry.enabled false

# Definir explicitamente um valor string
openspec config set user.name "My Name" --string

# Remover uma configuração personalizada
openspec config unset user.name

# Resetar toda a configuração
openspec config reset --all --yes

# Editar a configuração no seu editor
openspec config edit

# Configurar perfil com assistente baseado em ação
openspec config profile

# Preset rápido: mudar fluxos de trabalho para core (mantém o modo de entrega)
openspec config profile core
```

`openspec config profile` começa com um resumo do estado atual e, em seguida, permite que você escolha:
- Mudar a entrega + fluxos de trabalho
- Mudar apenas a entrega
- Mudar apenas os fluxos de trabalho
- Manter as configurações atuais (sair)

Se você mantiver as configurações atuais, nenhuma alteração é escrita e nenhum prompt de atualização é exibido.
Se não houver alterações de configuração, mas os arquivos do projeto atual estiverem dessincronizados com seu perfil/entrega global, o OpenSpec mostrará um aviso e sugerirá `openspec update`.
Pressionar `Ctrl+C` também cancela o fluxo de forma limpa (sem stack trace) e sai com código `130`.
No checklist do fluxo de trabalho, `[x]` significa que o fluxo de trabalho está selecionado na configuração global. Para aplicar essas seleções aos arquivos do projeto, execute `openspec update` (ou escolha `Apply changes to this project now?` quando solicitado dentro de um projeto).

**Exemplos interativos:**

```bash
# Atualização apenas da entrega
openspec config profile
# escolher: Mudar apenas a entrega
# escolher delivery: Skills only

# Atualização apenas dos fluxos de trabalho
openspec config profile
# escolher: Mudar apenas os fluxos de trabalho
# alternar os fluxos de trabalho no checklist, e depois confirmar
```

---

## Comandos Utilitários

### `openspec feedback`

Envie feedback sobre o OpenSpec. Cria uma issue no GitHub.

```
openspec feedback <message> [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `message` | Sim | Mensagem de feedback |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--body <text>` | Descrição detalhada |

**Requisitos:** O GitHub CLI (`gh`) deve estar instalado e autenticado.

**Exemplo:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Gerencia as completações de shell para o CLI do OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-------------|
| `generate [shell]` | Saída do script de conclusão para stdout |
| `install [shell]` | Instalar a conclusão para o seu shell |
| `uninstall [shell]` | Remover as conclusões instaladas |

**Shells suportados:** `bash`, `zsh`, `fish`, `powershell`

**Exemplos:**

```bash
# Instalar conclusões (detecta o shell automaticamente)
openspec completion install

# Instalar para um shell específico
openspec completion install zsh

# Gerar script para instalação manual
openspec completion generate bash > ~/.bash_completion.d/openspec

# Desinstalar
openspec completion uninstall
```

---

## Códigos de Saída

| Código | Significado |
|------|-------------|
| `0` | Sucesso |
| `1` | Erro (falha na validação, arquivos ausentes, etc.) |

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Defina como `0` para desativar a telemetria |
| `DO_NOT_TRACK` | Defina como `1` para desativar a telemetria (sinal DNT padrão) |
| `OPENSPEC_CONCURRENCY` | Concorrência padrão para validação em lote (padrão: 6) |
| `EDITOR` ou `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Desativar a saída colorida quando definido |

---

## Documentação Relacionada

- [Commands](commands.md) - Comandos de barra AI (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](workflows.md) - Padrões comuns e quando usar cada comando
- [Customization](customization.md) - Criar schemas e templates personalizados
- [Getting Started](getting-started.md) - Guia de configuração inicial