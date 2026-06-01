# Referência da CLI

A CLI do OpenSpec (`openspec`) fornece comandos de terminal para configuração de projeto, validação, inspeção de status e gerenciamento. Esses comandos complementam os comandos slash de IA (como `/opsx:propose`) documentados em [Comandos](commands.md).

## Resumo

| Categoria | Comandos | Finalidade |
|----------|----------|---------|
| **Configuração** | `init`, `update` | Inicializar e atualizar o OpenSpec em seu projeto |
| **Workspaces (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | Configurar visualizações locais sobre repositórios ou pastas vinculadas |
| **Contexto compartilhado (beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | Gerenciar registros locais de context-store e contexto duradouro de iniciativas |
| **Navegação** | `list`, `view`, `show` | Explorar alterações e especificações |
| **Validação** | `validate` | Verificar alterações e especificações em busca de problemas |
| **Ciclo de vida** | `archive` | Finalizar alterações concluídas |
| **Fluxo de trabalho** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | Suporte a fluxo de trabalho orientado a artefatos |
| **Esquemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Criar e gerenciar fluxos de trabalho personalizados |
| **Configuração** | `config` | Visualizar e modificar configurações |
| **Utilitários** | `feedback`, `completion` | Feedback e integração com shell |

---

## Comandos Humanos vs Agentes

A maioria dos comandos CLI são projetados para **uso humano** em um terminal. Alguns comandos também suportam **uso por agentes/scripts** via saída JSON.

### Comandos Apenas para Humanos

Esses comandos são interativos e projetados para uso em terminal:

| Comando | Finalidade |
|---------|---------|
| `openspec init` | Inicializar projeto (prompts interativos) |
| `openspec view` | Painel interativo |
| `openspec config edit` | Abrir configuração no editor |
| `openspec feedback` | Enviar feedback via GitHub |
| `openspec completion install` | Instalar completions de shell |

### Comandos Compatíveis com Agentes

Esses comandos suportam saída `--json` para uso programático por agentes de IA e scripts:

| Comando | Uso Humano | Uso por Agentes |
|---------|-----------|-----------|
| `openspec list` | Navegar alterações/especificações | `--json` para dados estruturados |
| `openspec show <item>` | Ler conteúdo | `--json` para análise |
| `openspec validate` | Verificar problemas | `--all --json` para validação em lote |
| `openspec status` | Ver progresso dos artefatos | `--json` para status estruturado |
| `openspec instructions` | Obter próximos passos | `--json` para instruções de agente |
| `openspec templates` | Encontrar caminhos de templates | `--json` para resolução de caminhos |
| `openspec schemas` | Listar schemas disponíveis | `--json` para descoberta de schemas |
| `openspec workspace setup --no-interactive` | Criar um workspace com entradas explícitas | `--json` para saída de configuração estruturada |
| `openspec workspace list` | Navegar workspaces conhecidos | `--json` para objetos de workspace tipados |
| `openspec workspace link` | Vincular um repositório ou pasta | `--json` para saída de vinculação estruturada |
| `openspec workspace relink` | Reparar um caminho vinculado | `--json` para saída de vinculação estruturada |
| `openspec workspace doctor` | Verificar um workspace | `--json` para saída de status estruturada |
| `openspec workspace update` | Atualizar orientações locais do workspace e habilidades de agentes | `--tools` seleciona agentes; perfil seleciona workflows |
| `openspec context-store setup <id>` | Criar uma loja de contexto local | `--json` com entradas explícitas para saída de configuração estruturada |
| `openspec context-store register <path>` | Registrar uma loja de contexto existente | `--json` para saída de registro estruturada |
| `openspec context-store unregister <id>` | Remover o registro de uma loja de contexto local | `--json` para saída de limpeza estruturada |
| `openspec context-store remove <id>` | Excluir a pasta de uma loja de contexto local registrada | `--yes --json` para exclusão não interativa |
| `openspec context-store list` | Navegar lojas de contexto registradas | `--json` para registros estruturados |
| `openspec context-store doctor` | Verificar configuração da loja local | `--json` para diagnósticos estruturados |
| `openspec initiative list` | Navegar iniciativas compartilhadas | `--json` para registros estruturados de iniciativas |
| `openspec initiative show <id>` | Resolver uma iniciativa | `--json` para caminhos canônicos e metadados |
| `openspec new change <id>` | Criar estrutura de alteração local ao repositório | `--json`, além de `--initiative` para links de coordenação compartilhada |
| `openspec set change <id>` | Atualizar metadados de alteração commitados | `--json`, além de `--initiative` para links de coordenação compartilhada |

---

## Opções Globais

Essas opções funcionam com todos os comandos:

| Opção | Descrição |
|--------|-------------|
| `--version`, `-V` | Exibir número da versão |
| `--no-color` | Desabilitar saída colorida |
| `--help`, `-h` | Exibir ajuda do comando |

---

## Comandos de Configuração

### `openspec init`

Inicializar o OpenSpec em seu projeto. Cria a estrutura de pastas e configura as integrações de ferramentas de IA.

O comportamento padrão usa as configurações globais padrão: perfil `core`, entrega `both`, workflows `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `path` | Não | Diretório de destino (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--tools <list>` | Configurar ferramentas de IA de forma não interativa. Use `all`, `none` ou lista separada por vírgulas |
| `--force` | Limpar automaticamente arquivos legados sem solicitar confirmação |
| `--profile <profile>` | Sobrescrever o perfil global para esta execução de init (`core` ou `custom`) |

`--profile custom` usa quaisquer workflows atualmente selecionados na configuração global (`openspec config profile`).

**IDs de ferramentas suportados (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

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

# Pular prompts e limpar automaticamente arquivos legados
openspec init --force
```

**O que é criado:**

```
openspec/
├── specs/              # Suas especificações (fonte da verdade)
├── changes/            # Alterações propostas
└── config.yaml         # Configuração do projeto

.claude/skills/         # Habilidades do Claude Code (se claude selecionado)
.cursor/skills/         # Habilidades do Cursor (se cursor selecionado)
.cursor/commands/       # Comandos OPSX do Cursor (se entrega incluir comandos)
... (outras configurações de ferramentas)
```

---

### `openspec update`

Atualizar os arquivos de instrução do OpenSpec após atualizar a CLI. Recria os arquivos de configuração das ferramentas de IA usando seu perfil global atual, workflows selecionados e modo de entrega.

```
openspec update [path] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `path` | Não | Diretório de destino (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--force` | Forçar atualização mesmo quando os arquivos estiverem atualizados |

**Exemplo:**

```bash
# Atualizar arquivos de instrução após atualização via npm
npm update @fission-ai/openspec
openspec update
```

---

## Comandos de Workspace

Os comandos de workspace estão em beta. O modelo de visão local abaixo é a direção atual, mas automação externa, integrações e workflows de longa duração ainda devem tratar o comportamento dos comandos, arquivos de estado e saída JSON como em evolução.

Os workspaces de coordenação são visões locais à máquina sobre repositórios ou pastas vinculados. A visibilidade do workspace não é compromisso com alterações: vincule os repositórios ou pastas que o OpenSpec deve conhecer, depois crie alterações quando estiver pronto para planejar trabalho específico.

### `openspec workspace setup`

Criar um workspace no local padrão do OpenSpec e vincular pelo menos um repositório ou pasta existente.

```bash
openspec workspace setup [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--name <name>` | Nome do workspace. Os nomes devem estar em kebab-case |
| `--link <path>` | Vincular um repositório ou pasta existente e inferir o nome da vinculação a partir do nome da pasta |
| `--link <name>=<path>` | Vincular um repositório ou pasta existente com um nome de vinculação explícito |
| `--opener <id>` | Armazenar um abridor preferido durante a configuração não interativa: `codex-cli`, `claude`, `github-copilot` ou `editor` |
| `--tools <tools>` | Instalar habilidades locais do OpenSpec para agentes no workspace. Use `all`, `none` ou IDs de ferramentas separados por vírgulas |
| `--no-interactive` | Desabilitar prompts; requer `--name` e pelo menos um `--link` |
| `--json` | Saída JSON; requer `--no-interactive` |

**Exemplos:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

A configuração interativa solicita um abridor preferido e pode instalar habilidades locais do OpenSpec no workspace para os agentes selecionados. A configuração não interativa armazena um abridor preferido apenas quando `--opener` é fornecido; caso contrário, `workspace open` solicita mais tarde em terminais interativos quando um abridor suportado está disponível, ou pede que os scripts passem `--agent <tool>` ou `--editor`.

A instalação de habilidades do workspace é apenas habilidades nesta fatia beta: mesmo que a entrega global seja `commands` ou `both`, a configuração do workspace grava pastas de habilidades de agente na raiz do workspace e não cria arquivos de comando de barra. O perfil global ativo escolhe quais habilidades de workflow são instaladas; `--tools` escolhe quais agentes as recebem. Se `--tools` for omitido na configuração não interativa, nenhuma habilidade é instalada e `workspace update --tools <ids>` pode adicioná-las depois.

### `openspec workspace list`

Listar workspaces do OpenSpec conhecidos no registro local.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

A lista mostra a localização de cada workspace e os repositórios ou pastas vinculados. Registros obsoletos no registro são reportados mas não alterados.

### `openspec workspace link`

Registrar um repositório ou pasta existente para um workspace.

```bash
openspec workspace link [name] <path> [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--workspace <name>` | Selecionar um workspace conhecido do registro local |
| `--json` | Saída JSON |
| `--no-interactive` | Desabilitar prompts de seleção de workspace |

**Exemplos:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

O caminho já deve existir. Caminhos relativos são resolvidos em relação ao diretório atual do comando antes que o OpenSpec armazene o caminho absoluto verificado no estado do workspace local à máquina. Os caminhos vinculados podem ser repositórios completos, pacotes, serviços, aplicativos ou pastas sem estado local `openspec/` no repositório.

### `openspec workspace relink`

Reparar ou alterar o caminho local de uma vinculação existente.

```bash
openspec workspace relink <name> <path> [options]
```

O caminho já deve existir. Relink atualiza apenas o caminho local à máquina para o nome de vinculação estável.

### `openspec workspace doctor`

Verificar o que um workspace pode resolver na máquina atual.

```bash
openspec workspace doctor [options]
```

Doctor mostra a localização do workspace, repositórios ou pastas vinculados, caminhos ausentes, caminhos de especificações locais ao repositório quando presentes e correções sugeridas. A saída JSON também inclui o caminho de planejamento do workspace para compatibilidade. Reporta apenas problemas; não os repara automaticamente.

Os comandos que necessitam de um workspace usam o workspace atual quando executados de dentro de uma pasta ou subdiretório do workspace. De outro local, passe `--workspace <name>`, selecione a partir do seletor em um terminal interativo, ou confie no único workspace conhecido quando exatamente um existir. No modo `--json` ou `--no-interactive`, seleção ambígua falha com um erro de status estruturado e sugere `--workspace <name>`.

As respostas JSON usam objetos tipados mais arrays `status`. Os dados primários ficam em `workspace`, `workspaces` ou `link`; avisos e erros ficam em `status`.

### `openspec workspace update`

Atualizar as orientações locais do workspace e habilidades de agentes do OpenSpec.

```bash
openspec workspace update [name] [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--workspace <name>` | Selecionar um workspace conhecido do registro local |
| `--tools <tools>` | Selecionar agentes para habilidades do workspace. Use `all`, `none` ou IDs de ferramentas separados por vírgulas |
| `--json` | Saída JSON |
| `--no-interactive` | Desabilitar prompts de seleção de workspace |

**Exemplos:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` atualiza o bloco de orientação gerado do workspace e a superfície aberta local. Para habilidades de agentes, reutiliza a seleção de agentes de habilidades do workspace armazenada quando `--tools` é omitido. Passar `--tools` substitui essa seleção armazenada. Atualiza apenas os diretórios de habilidades de workflow gerenciados pelo OpenSpec na raiz do workspace, remove habilidades de workflow gerenciadas deselecionadas e não altera repositórios e pastas vinculados.

Executar `openspec update` de dentro de um workspace redireciona para `openspec workspace update`; execute `openspec update` dentro de projetos locais ao repositório quando quiser que os arquivos de ferramentas pertencentes ao repositório sejam atualizados.

### `openspec workspace open`

Abrir um conjunto de trabalho do workspace através do abridor preferido armazenado, uma substituição de agente para a sessão, ou modo editor VS Code.

```bash
openspec workspace open [name] [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--workspace <name>` | Alias para o nome do workspace posicional |
| `--initiative <id>` | Abrir uma iniciativa como uma visão de workspace local. Aceita `<id>` ou `<store>/<id>` |
| `--store <id>` | ID da loja de contexto registrada para `--initiative` |
| `--store-path <path>` | Raiz da loja de contexto local existente para `--initiative` |
| `--agent <tool>` | Substituição de agente para a sessão: `codex-cli`, `claude` ou `github-copilot` |
| `--editor` | Abrir o arquivo de workspace VS Code mantido como um workspace de editor normal |
| `--no-interactive` | Desabilitar prompts de seleção de workspace e abridor |

**Exemplos:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` usa o workspace atual quando executado dentro de um, seleciona automaticamente o único workspace conhecido quando executado de outro local e solicita ao usuário que escolha quando múltiplos workspaces são conhecidos. `--agent` e `--editor` não alteram o abridor preferido armazenado. Passar ambas as substituições de abridor é um erro; escolha `--agent <tool>` ou `--editor`.

Quando `--initiative` é usado, o OpenSpec prepara ou seleciona uma visão de workspace local privada para essa iniciativa. Lojas selecionadas pelo registro são armazenadas por id; `--store-path` armazena um seletor de caminho local em tempo de execução, pois as visões de workspace são estado local privado.

O OpenSpec mantém `<workspace-name>.code-workspace` na raiz do workspace para aberturas no VS Code e GitHub Copilot-in-VS-Code. Esse arquivo é estado de visão de workspace local à máquina.

O workspace VS Code mantido lista primeiro os repositórios ou pastas vinculados válidos, depois o contexto da iniciativa quando anexado, depois os arquivos do workspace OpenSpec. O VS Code exibe essas entradas como um workspace de múltiplas raízes.

A abertura do workspace raiz torna os repositórios ou pastas vinculados visíveis para exploração e contexto. Edições de implementação devem começar apenas após uma solicitação explícita do usuário e um workflow normal de implementação do OpenSpec.

## Comandos de Contexto Compartilhado

Lojas de contexto e iniciativas são superfícies de coordenação em fase beta. Uma loja de contexto é um registro local para contexto compartilhado durável, geralmente uma pasta ou clone com suporte a Git. Uma iniciativa é um contexto de coordenação compartilhado dentro de uma loja de contexto; alterações locais ao repositório podem ser vinculadas a ela sem copiar o plano compartilhado em cada repositório.

### `openspec context-store setup`

Cria e registra uma loja de contexto local. Sem argumentos em um terminal,
o OpenSpec orienta o usuário durante a configuração. Agentes e scripts devem fornecer
entradas explícitas e usar `--json`.

```bash
openspec context-store setup [id] [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--path <path>` | Caminho da pasta da loja de contexto; o padrão é o diretório de dados local gerenciado pelo OpenSpec |
| `--init-git` | Inicializar um repositório Git na loja de contexto |
| `--no-init-git` | Não inicializar um repositório Git |
| `--json` | Saída em JSON |

Quando `--path` é omitido, o setup cria a loja em `getGlobalDataDir()/context-stores/<id>`: `$XDG_DATA_HOME/openspec/context-stores/<id>` quando `XDG_DATA_HOME` está definido, ou `~/.local/share/openspec/context-stores/<id>` como fallback em sistemas do tipo Unix. Passe `--path` quando desejar que a loja esteja em um clone visível ou pasta específica da equipe.

Exemplos:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

Registra uma pasta de loja de contexto local existente.

```bash
openspec context-store register [path] [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--id <id>` | ID da loja de contexto; o padrão é o metadado da loja ou o nome da pasta |
| `--json` | Saída em JSON |

### `openspec context-store unregister`

Remove o registro de uma loja de contexto local sem excluir os arquivos.

```bash
openspec context-store unregister <id> [--json]
```

Use isso quando uma loja foi movida, clonada em outro local, ou quando não deve mais ser
exibida pelo OpenSpec nesta máquina.

### `openspec context-store remove`

Remove o registro de uma loja de contexto local e exclui sua pasta local.

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` exibe a pasta exata antes de excluir em um terminal interativo.
Agentes, scripts e chamadores JSON devem passar `--yes` para confirmar a exclusão.
O OpenSpec se recusa a excluir uma pasta que não contém metadados
de loja de contexto correspondentes.

### `openspec context-store list`

Lista as lojas de contexto registradas localmente.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

Verifica o registro da loja de contexto local, metadados e presença do Git.

```bash
openspec context-store doctor [id] [--json]
```

Doctor é apenas diagnóstico; ele relata raízes ausentes, incompatibilidades de metadados e estado inválido do registro local sem modificar a loja.

### `openspec initiative create`

Cria uma iniciativa em uma loja de contexto.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--store <id>` | ID da loja de contexto do registro local |
| `--store-path <path>` | Raiz da loja de contexto local existente |
| `--title <title>` | Título da iniciativa |
| `--summary <summary>` | Resumo da iniciativa |
| `--json` | Saída em JSON |

### `openspec initiative list`

Lista iniciativas. Sem um seletor, esta comando pesquisa todas as lojas de contexto registradas e relata avisos de leitura parcial em `status`.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--store <id>` | Listar uma loja de contexto registrada |
| `--store-path <path>` | Listar uma raiz de loja de contexto local existente |
| `--json` | Saída em JSON |

### `openspec initiative show`

Resolve uma iniciativa e exibe sua localização canônica.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

Sem `--store`, o OpenSpec pesquisa as lojas de contexto registradas. Se a mesma ID de iniciativa existir em múltiplas lojas, passe `--store <id>` ou use o formato `<store>/<id>`.

---

## Comandos de Navegação

### `openspec list`

Lista alterações ou especificações no seu projeto.

```
openspec list [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--specs` | Lista especificações em vez de alterações |
| `--changes` | Lista alterações (padrão) |
| `--sort <order>` | Ordena por `recent` (padrão) ou `name` |
| `--json` | Saída em formato JSON |

**Exemplos:**

```bash
# Listar todas as alterações ativas
openspec list

# Listar todas as especificações
openspec list --specs

# Saída JSON para scripts
openspec list --json
```

**Saída (texto):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

Exibe um painel interativo para explorar especificações e alterações.

```
openspec view
```

Abre uma interface baseada em terminal para navegar pelas especificações e alterações do seu projeto.

---

### `openspec show`

Exibe detalhes de uma alteração ou especificação.

```
openspec show [item-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `item-name` | Não | Nome da alteração ou especificação (solicita entrada se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--type <type>` | Especifica o tipo: `change` ou `spec` (detectado automaticamente se não ambíguo) |
| `--json` | Saída em formato JSON |
| `--no-interactive` | Desativa prompts |

**Opções específicas para alterações:**

| Opção | Descrição |
|--------|-------------|
| `--deltas-only` | Mostra apenas especificações delta (modo JSON) |

**Opções específicas para especificações:**

| Opção | Descrição |
|--------|-------------|
| `--requirements` | Mostra apenas requisitos, exclui cenários (modo JSON) |
| `--no-scenarios` | Exclui conteúdo de cenários (modo JSON) |
| `-r, --requirement <id>` | Mostra requisito específico pelo índice baseado em 1 (modo JSON) |

**Exemplos:**

```bash
# Seleção interativa
openspec show

# Mostrar uma alteração específica
openspec show add-dark-mode

# Mostrar uma especificação específica
openspec show auth --type spec

# Saída JSON para parsing
openspec show add-dark-mode --json
```

---

## Comandos de Validação

### `openspec validate`

Valida alterações e especificações quanto a problemas estruturais.

```
openspec validate [item-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `item-name` | Não | Item específico para validar (solicita entrada se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--all` | Valida todas as alterações e especificações |
| `--changes` | Valida todas as alterações |
| `--specs` | Valida todas as especificações |
| `--type <type>` | Especifica o tipo quando o nome é ambíguo: `change` ou `spec` |
| `--strict` | Ativa o modo de validação estrita |
| `--json` | Saída em formato JSON |
| `--concurrency <n>` | Máximo de validações paralelas (padrão: 6, ou variável de ambiente `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Desativa prompts |

**Exemplos:**

```bash
# Validação interativa
openspec validate

# Validar uma alteração específica
openspec validate add-dark-mode

# Validar todas as alterações
openspec validate --changes

# Validar tudo com saída JSON (para CI/scripts)
openspec validate --all --json

# Validação estrita com paralelismo aumentado
openspec validate --all --strict --concurrency 12
```

**Saída (texto):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

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
        "warnings": ["design.md: missing 'Technical Approach' section"]
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

Arquiva uma alteração concluída e mescla as especificações delta nas especificações principais.

```
openspec archive [change-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Alteração para arquivar (solicita entrada se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `-y, --yes` | Pula prompts de confirmação |
| `--skip-specs` | Pula atualizações de especificações (para alterações apenas de infraestrutura/ferramentas/documentação) |
| `--no-validate` | Pula a validação (requer confirmação) |

**Exemplos:**

```bash
# Arquivamento interativo
openspec archive

# Arquivar alteração específica
openspec archive add-dark-mode

# Arquivar sem prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Arquivar uma alteração de ferramentas que não afeta especificações
openspec archive update-ci-config --skip-specs
```

**O que faz:**

1. Valida a alteração (exceto se `--no-validate`)
2. Solicita confirmação (exceto se `--yes`)
3. Mescla as especificações delta em `openspec/specs/`
4. Move a pasta da alteração para `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandos de Fluxo de Trabalho

Esses comandos suportam o fluxo de trabalho OPSX orientado a artefatos. São úteis tanto para humanos que verificam o progresso quanto para agentes que determinam os próximos passos.

### `openspec new change`

Cria um diretório de alteração local no repositório e metadados opcionais registrados.

```bash
openspec new change <name> [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--description <text>` | Descrição a ser adicionada ao `README.md` |
| `--goal <text>` | Meta do produto do espaço de trabalho para armazenar com a alteração |
| `--areas <names>` | Nomes de links do espaço de trabalho afetados, separados por vírgula |
| `--initiative <id>` | Vincula a alteração local do repositório a uma iniciativa |
| `--store <id>` | ID do armazenamento de contexto para `--initiative` |
| `--store-path <path>` | Raiz existente do armazenamento de contexto local para `--initiative` |
| `--schema <name>` | Esquema de fluxo de trabalho a ser utilizado |
| `--json` | Saída em formato JSON |

Exemplos:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

Atualiza os metadados registrados de uma alteração local do repositório sem recriar a alteração.

```bash
openspec set change <name> [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--initiative <id>` | Vincula a alteração local do repositório a uma iniciativa |
| `--store <id>` | ID do armazenamento de contexto para `--initiative` |
| `--store-path <path>` | Raiz existente do armazenamento de contexto local para `--initiative` |
| `--json` | Saída em formato JSON |

`set change --initiative` é idempotente quando o vínculo solicitado já existe e recusa substituir um vínculo de iniciativa existente diferente.

### `openspec status`

Exibe o status de conclusão dos artefatos de uma alteração.

```
openspec status [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--change <id>` | Nome da alteração (solicita entrada se omitido) |
| `--schema <name>` | Substituição de esquema (detectado automaticamente a partir da configuração da alteração) |
| `--json` | Saída em formato JSON |

**Exemplos:**

```bash
# Verificação de status interativa
openspec status

# Status para alteração específica
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

Obtém instruções enriquecidas para criar um artefato ou aplicar tarefas. Utilizado por agentes de IA para entender o que criar em seguida.

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
| `--change <id>` | Nome da alteração (obrigatório no modo não interativo) |
| `--schema <name>` | Substituição de esquema |
| `--json` | Saída em formato JSON |

**Caso especial:** Use `apply` como artefato para obter instruções de implementação de tarefas.

**Exemplos:**

```bash
# Obter instruções para o próximo artefato
openspec instructions --change add-dark-mode

# Obter instruções de artefato específico
openspec instructions design --change add-dark-mode

# Obter instruções de aplicação/implementação
openspec instructions apply --change add-dark-mode

# JSON para consumo por agentes
openspec instructions design --change add-dark-mode --json
```

**A saída inclui:**

- Conteúdo do modelo para o artefato
- Contexto do projeto a partir da configuração
- Conteúdo dos artefatos de dependência
- Regras por artefato a partir da configuração

---

### `openspec templates`

Exibe os caminhos resolvidos dos modelos para todos os artefatos de um esquema.

```
openspec templates [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--schema <name>` | Esquema a inspecionar (padrão: `spec-driven`) |
| `--json` | Saída em formato JSON |

**Exemplos:**

```bash
# Mostrar caminhos dos modelos para o esquema padrão
openspec templates

# Mostrar modelos para esquema personalizado
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
| `--json` | Saída em formato JSON |

**Exemplo:**

```bash
openspec schemas
```

**Saída:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Comandos de Schema

Comandos para criar e gerenciar schemas de workflow personalizados.

### `openspec schema init`

Criar um novo schema local do projeto.

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
| `--default` | Definir como schema padrão do projeto |
| `--no-default` | Não perguntar se deseja definir como padrão |
| `--force` | Sobrescrever schema existente |
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

**O que é criado:**

```
openspec/schemas/<name>/
├── schema.yaml           # Definição do schema
└── templates/
    ├── proposal.md       # Modelo para cada artefato
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Copiar um schema existente para o seu projeto para personalização.

```
openspec schema fork <source> [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `source` | Sim | Schema a ser copiado |
| `name` | Não | Nome do novo schema (padrão: `<source>-custom`) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--force` | Sobrescrever destino existente |
| `--json` | Saída em JSON |

**Exemplo:**

```bash
# Fazer fork do schema embutido spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Validar a estrutura e os modelos de um schema.

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

Mostrar de onde um schema é resolvido (útil para depurar precedência).

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
# Verificar de onde vem um schema
openspec schema which spec-driven
```

**Saída:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedência de schemas:**

1. Projeto: `openspec/schemas/<name>/`
2. Usuário: `~/.local/share/openspec/schemas/<name>/`
3. Pacote: Schemas embutidos

---

## Comandos de Configuração

### `openspec config`

Visualizar e modificar a configuração global do OpenSpec.

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
| `reset` | Restaurar valores padrão |
| `edit` | Abrir no `$EDITOR` |
| `profile [preset]` | Configurar perfil de workflow interativamente ou via preset |

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

# Definir explicitamente um valor de string
openspec config set user.name "My Name" --string

# Remover uma configuração personalizada
openspec config unset user.name

# Restaurar toda a configuração
openspec config reset --all --yes

# Editar configuração no seu editor
openspec config edit

# Configurar perfil com assistente baseado em ações
openspec config profile

# Preset rápido: mudar workflows para core (mantém modo de entrega)
openspec config profile core
```

`openspec config profile` inicia com um resumo do estado atual e, em seguida, permite escolher:
- Alterar entrega + workflows
- Alterar apenas a entrega
- Alterar apenas os workflows
- Manter configurações atuais (sair)

Se você mantiver as configurações atuais, nenhuma alteração será gravada e nenhuma solicitação de atualização será exibida.
Se não houver alterações de configuração, mas os arquivos atuais do projeto ou workspace estiverem dessincronizados com seu perfil/entrega global, o OpenSpec exibirá um aviso e sugerirá `openspec update` para projetos locais ao repositório ou `openspec workspace update` para orientação e habilidades locais ao workspace.
Pressionar `Ctrl+C` também cancela o fluxo de forma limpa (sem stack trace) e sai com o código `130`.
Na lista de workflows, `[x]` significa que o workflow está selecionado na configuração global. Para aplicar essas seleções aos arquivos do projeto, execute `openspec update` (ou escolha `Apply changes to this project now?` quando solicitado dentro de um projeto). De dentro de um workspace, use `openspec workspace update` para atualizar orientação e habilidades locais ao workspace; isso permanece apenas para habilidades nos arquivos de workflow de agente gerados e não gera comandos de barra do workspace.

**Exemplos interativos:**

```bash
# Atualização apenas de entrega
openspec config profile
# escolher: Change delivery only
# escolher entrega: Skills only

# Atualização apenas de workflows
openspec config profile
# escolher: Change workflows only
# alternar workflows na lista, depois confirmar
```

---

## Comandos de Utilidade

### `openspec feedback`

Enviar feedback sobre o OpenSpec. Cria uma issue no GitHub.

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

**Requisitos:** GitHub CLI (`gh`) deve estar instalado e autenticado.

**Exemplo:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Gerenciar completions de shell para o CLI do OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-------------|
| `generate [shell]` | Saída do script de completion no stdout |
| `install [shell]` | Instalar completion para seu shell |
| `uninstall [shell]` | Remover completions instaladas |

**Shells suportados:** `bash`, `zsh`, `fish`, `powershell`

**Exemplos:**

```bash
# Instalar completions (detecta shell automaticamente)
openspec completion install

# Instalar para shell específico
openspec completion install zsh

# Gerar script para instalação manual
openspec completion generate bash > ~/.bash_completion.d/openspec

# Desinstalar
openspec completion uninstall
```

---

## Códigos de Saída

| Código | Significado |
|------|---------|
| `0` | Sucesso |
| `1` | Erro (falha de validação, arquivos ausentes, etc.) |

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Definir como `0` para desabilitar telemetria |
| `DO_NOT_TRACK` | Definir como `1` para desabilitar telemetria (sinal DNT padrão) |
| `OPENSPEC_CONCURRENCY` | Concorrência padrão para validação em massa (padrão: 6) |
| `EDITOR` ou `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Desabilitar saída colorida quando definido |

---

## Documentação Relacionada

- [Comandos](commands.md) - Comandos de barra de IA (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](workflows.md) - Padrões comuns e quando usar cada comando
- [Personalização](customization.md) - Criar schemas e modelos personalizados
- [Primeiros Passos](getting-started.md) - Guia de configuração inicial