# Referência da CLI

A CLI do OpenSpec (`openspec`) fornece comandos de terminal para configuração do projeto, validação, inspeção de status e gerenciamento. Esses comandos complementam os comandos de barra da IA (como `/opsx:propose`) documentados em [Comandos](commands.md).

## Resumo

| Category | Commands | Purpose |
|----------|----------|---------|
| **Configuração** | `init`, `update` | Inicializar e atualizar o OpenSpec no seu projeto |
| **Workspaces (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | Configurar planejamento entre repositórios ou pastas vinculadas |
| **Navegação** | `list`, `view`, `show` | Explorar alterações e especificações |
| **Validação** | `validate` | Verificar alterações e especificações em busca de problemas |
| **Ciclo de vida** | `archive` | Finalizar alterações concluídas |
| **Fluxo de trabalho** | `status`, `instructions`, `templates`, `schemas` | Suporte a fluxo de trabalho orientado por artefatos |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Criar e gerenciar fluxos de trabalho personalizados |
| **Configuração** | `config` | Visualizar e modificar configurações |
| **Utilitários** | `feedback`, `completion` | Feedback e integração com o shell |

---

## Comandos Humanos vs. de Agente

A maioria dos comandos CLI são projetados para **uso humano** em um terminal. Alguns comandos também suportam **uso por agente/script** através de saída JSON.

### Comandos Apenas para Humanos

Esses comandos são interativos e projetados para uso em terminal:

| Comando | Finalidade |
|---------|------------|
| `openspec init` | Inicializar projeto (prompts interativos) |
| `openspec view` | Painel interativo |
| `openspec config edit` | Abrir configuração no editor |
| `openspec feedback` | Enviar feedback via GitHub |
| `openspec completion install` | Instalar completions de shell |

### Comandos Compatíveis com Agentes

Esses comandos suportam saída `--json` para uso programático por agentes de IA e scripts:

| Comando | Uso Humano | Uso por Agente |
|---------|------------|----------------|
| `openspec list` | Navegar por alterações/especificações | `--json` para dados estruturados |
| `openspec show <item>` | Ler conteúdo | `--json` para análise |
| `openspec validate` | Verificar problemas | `--all --json` para validação em lote |
| `openspec status` | Ver progresso dos artefatos | `--json` para status estruturado |
| `openspec instructions` | Obter próximos passos | `--json` para instruções do agente |
| `openspec templates` | Encontrar caminhos de templates | `--json` para resolução de caminhos |
| `openspec schemas` | Listar schemas disponíveis | `--json` para descoberta de schemas |
| `openspec workspace setup --no-interactive` | Criar um espaço de trabalho com entradas explícitas | `--json` para saída de setup estruturada |
| `openspec workspace list` | Navegar por espaços de trabalho conhecidos | `--json` para objetos de espaço de trabalho tipados |
| `openspec workspace link` | Vincular um repositório ou pasta | `--json` para saída de vinculação estruturada |
| `openspec workspace relink` | Reparar um caminho vinculado | `--json` para saída de vinculação estruturada |
| `openspec workspace doctor` | Verificar um espaço de trabalho | `--json` para saída de status estruturada |

---

## Opções Globais

Essas opções funcionam com todos os comandos:

| Opção | Descrição |
|-------|-----------|
| `--version`, `-V` | Mostrar número da versão |
| `--no-color` | Desabilitar saída colorida |
| `--help`, `-h` | Exibir ajuda para o comando |

---

## Comandos de Setup

### `openspec init`

Inicializar o OpenSpec em seu projeto. Cria a estrutura de pastas e configura integrações com ferramentas de IA.

O comportamento padrão usa os padrões da configuração global: perfil `core`, entrega `both`, workflows `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `path` | Não | Diretório de destino (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|------|-----------|
| `--tools <list>` | Configurar ferramentas de IA de forma não interativa. Use `all`, `none` ou uma lista separada por vírgulas |
| `--force` | Limpar automaticamente arquivos legados sem solicitar confirmação |
| `--profile <profile>` | Sobrescrever o perfil global para esta execução do init (`core` ou `custom`) |

`--profile custom` usa quaisquer workflows que estejam atualmente selecionados na configuração global (`openspec config profile`).

**IDs de ferramentas suportadas (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

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

**O que ele cria:**

```
openspec/
├── specs/              # Suas especificações (fonte da verdade)
├── changes/            # Alterações propostas
└── config.yaml         # Configuração do projeto

.claude/skills/         # Habilidades do Claude Code (se claude selecionado)
.cursor/skills/         # Habilidades do Cursor (se cursor selecionado)
.cursor/commands/       # Comandos OPSX do Cursor (se a entrega incluir comandos)
... (outras configurações de ferramentas)
```

---

### `openspec update`

Atualizar os arquivos de instrução do OpenSpec após atualizar a CLI. Re-gera os arquivos de configuração da ferramenta de IA usando seu perfil global atual, workflows selecionados e modo de entrega.

```
openspec update [path] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `path` | Não | Diretório de destino (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|------|-----------|
| `--force` | Forçar atualização mesmo quando os arquivos estiverem atualizados |

**Exemplo:**

```bash
# Atualizar arquivos de instrução após atualização via npm
npm update @fission-ai/openspec
openspec update
```

---

## Comandos de Espaço de Trabalho

Os comandos de espaço de trabalho estão em desenvolvimento ativo e ainda não estão prontos para uso. Não construa automações externas, integrações ou workflows de longa duração sobre essa superfície de comandos; o comportamento dos comandos, os arquivos de estado e a saída JSON podem mudar a qualquer momento.

Espaços de trabalho de coordenação são locais de planejamento para trabalho que abrange múltiplos repositórios ou pastas. A visibilidade do espaço de trabalho não é um compromisso de alteração: vincule os repositórios ou pastas que o OpenSpec deve conhecer, depois crie alterações quando estiver pronto para planejar um trabalho específico.

### `openspec workspace setup`

Criar um espaço de trabalho no local padrão do OpenSpec e vincular pelo menos um repositório ou pasta existente.

```bash
openspec workspace setup [options]
```

**Opções:**

| Opção | Descrição |
|------|-----------|
| `--name <name>` | Nome do espaço de trabalho. Os nomes devem estar em kebab-case |
| `--link <path>` | Vincular um repositório ou pasta existente e inferir o nome do link a partir do nome da pasta |
| `--link <name>=<path>` | Vincular um repositório ou pasta existente com um nome de link explícito |
| `--opener <id>` | Armazenar um abridor preferido durante o setup não interativo: `codex`, `claude`, `github-copilot`, ou `editor` |
| `--no-interactive` | Desabilitar prompts; requer `--name` e pelo menos um `--link` |
| `--json` | Saída JSON; requer `--no-interactive` |

**Exemplos:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

O setup interativo pergunta por um abridor preferido e o armazena no estado local da máquina do espaço de trabalho. O setup não interativo armazena um abridor preferido apenas quando `--opener` é fornecido; caso contrário, `workspace open` solicitará mais tarde em terminais interativos quando um abridor suportado estiver disponível, ou pedirá que os scripts passem `--agent <tool>` ou `--editor`.

### `openspec workspace list`

Listar os espaços de trabalho OpenSpec conhecidos a partir do registro local.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

A lista mostra a localização de cada espaço de trabalho e os repositórios ou pastas vinculados. Registros obsoletos no registro são reportados, mas não alterados.

### `openspec workspace link`

Registrar um repositório ou pasta existente para um espaço de trabalho.

```bash
openspec workspace link [name] <path> [options]
```

**Opções:**

| Opção | Descrição |
|------|-----------|
| `--workspace <name>` | Selecionar um espaço de trabalho conhecido do registro local |
| `--json` | Saída JSON |
| `--no-interactive` | Desabilitar prompts do seletor de espaço de trabalho |

**Exemplos:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

O caminho deve já existir. Caminhos relativos são resolvidos em relação ao diretório atual do comando antes que o OpenSpec armazene o caminho absoluto verificado no estado local da máquina do espaço de trabalho. Os caminhos vinculados podem ser repositórios completos, pacotes, serviços, aplicativos ou pastas sem estado `openspec/` local ao repositório.

### `openspec workspace relink`

Reparar ou alterar o caminho local para um link existente.

```bash
openspec workspace relink <name> <path> [options]
```

O caminho deve já existir. Relink atualiza apenas o caminho local da máquina para o nome de link estável.

### `openspec workspace doctor`

Verificar o que um espaço de trabalho pode resolver na máquina atual.

```bash
openspec workspace doctor [options]
```

Doctor mostra a localização do espaço de trabalho, caminho de planejamento, repositórios ou pastas vinculados, caminhos ausentes, caminhos de especificações locais do repositório quando presentes, e correções sugeridas. Ele apenas reporta problemas; não os repara automaticamente.

Comandos que precisam de um espaço de trabalho usam o espaço de trabalho atual quando executados de dentro de uma pasta ou subdiretório de um espaço de trabalho. De outro lugar, passe `--workspace <name>`, selecione a partir do seletor em um terminal interativo, ou confie no único espaço de trabalho conhecido quando exatamente um existir. No modo `--json` ou `--no-interactive`, uma seleção ambígua falha com um erro de status estruturado e sugere `--workspace <name>`.

As respostas JSON usam objetos tipados mais arrays `status`. Os dados primários ficam em `workspace`, `workspaces` ou `link`; avisos e erros ficam em `status`.

### `openspec workspace open`

Abrir um conjunto de trabalho do espaço de trabalho através do abridor preferido armazenado, uma substituição de agente para uma sessão, ou o modo editor do VS Code.

```bash
openspec workspace open [name] [options]
```

**Opções:**

| Opção | Descrição |
|------|-----------|
| `--workspace <name>` | Alias para o nome posicional do espaço de trabalho |
| `--agent <tool>` | Substituição de agente para uma sessão: `codex`, `claude`, ou `github-copilot` |
| `--editor` | Abrir o arquivo de espaço de trabalho VS Code mantido como um espaço de trabalho de editor normal |
| `--no-interactive` | Desabilitar prompts do seletor de espaço de trabalho e abridor |

**Exemplos:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` usa o espaço de trabalho atual quando executado dentro de um, seleciona automaticamente o único espaço de trabalho conhecido quando executado em outro lugar, e pede ao usuário para escolher quando múltiplos espaços de trabalho são conhecidos. `--agent` e `--editor` não alteram o abridor preferido armazenado. Passar ambas as substituições de abridor é um erro; escolha `--agent <tool>` ou `--editor`.

O OpenSpec mantém `<workspace-name>.code-workspace` na raiz do espaço de trabalho para aberturas no editor VS Code e no GitHub Copilot-in-VS-Code. Esse arquivo é local da máquina e ignorado por padrão com uma entrada específica `<workspace-name>.code-workspace` no `.gitignore`, para que os arquivos `*.code-workspace` criados pelo usuário permaneçam elegíveis para rastreamento.

O espaço de trabalho VS Code mantido inclui a raiz de coordenação como `.` mais repositórios ou pastas vinculados válidos como raízes adicionais. O VS Code exibe essas entradas como um espaço de trabalho multi-raiz.

A abertura do espaço de trabalho raiz suporta exploração e planejamento através dos repositórios ou pastas vinculados. Edições de implementação devem começar apenas após uma solicitação explícita do usuário e um fluxo de trabalho normal de implementação do OpenSpec.

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
# Lista todas as alterações ativas
openspec list

# Lista todas as especificações
openspec list --specs

# Saída JSON para scripts
openspec list --json
```

**Saída (texto):**

```
Alterações ativas:
  add-dark-mode     Suporte a troca de tema da interface
  fix-login-bug     Tratamento de timeout de sessão
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
| `-r, --requirement <id>` | Mostra requisito específico por índice baseado em 1 (modo JSON) |

**Exemplos:**

```bash
# Seleção interativa
openspec show

# Exibe uma alteração específica
openspec show add-dark-mode

# Exibe uma especificação específica
openspec show auth --type spec

# Saída JSON para análise
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

# Valida uma alteração específica
openspec validate add-dark-mode

# Valida todas as alterações
openspec validate --changes

# Valida tudo com saída JSON (para CI/scripts)
openspec validate --all --json

# Validação estrita com paralelismo aumentado
openspec validate --all --strict --concurrency 12
```

**Saída (texto):**

```
Validando add-dark-mode...
  ✓ proposal.md válido
  ✓ specs/ui/spec.md válido
  ⚠ design.md: seção "Technical Approach" ausente

1 aviso encontrado
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
| `change-name` | Não | Alteração a ser arquivada (solicita entrada se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `-y, --yes` | Pula as confirmações interativas |
| `--skip-specs` | Pula atualizações de especificações (para alterações apenas de infraestrutura/ferramentas/documentação) |
| `--no-validate` | Pula a validação (requer confirmação) |

**Exemplos:**

```bash
# Arquivamento interativo
openspec archive

# Arquiva uma alteração específica
openspec archive add-dark-mode

# Arquiva sem prompts (para CI/scripts)
openspec archive add-dark-mode --yes

# Arquiva uma alteração de ferramentas que não afeta as especificações
openspec archive update-ci-config --skip-specs
```

**O que ele faz:**

1. Valida a alteração (a menos que `--no-validate`)
2. Solicita confirmação (a menos que `--yes`)
3. Mescla as especificações delta em `openspec/specs/`
4. Move a pasta da alteração para `openspec/changes/archive/YYYY-MM-DD-<nome>/`

---

## Comandos de Fluxo de Trabalho

Esses comandos suportam o fluxo de trabalho OPSX orientado por artefatos. São úteis tanto para humanos verificando o progresso quanto para agentes determinando os próximos passos.

### `openspec status`

Exibe o status de conclusão dos artefatos para uma alteração.

```
openspec status [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--change <id>` | Nome da alteração (solicita entrada se omitido) |
| `--schema <name>` | Substituição do esquema (detectado automaticamente a partir da config da alteração) |
| `--json` | Saída em formato JSON |

**Exemplos:**

```bash
# Verificação de status interativa
openspec status

# Status para uma alteração específica
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

Obtém instruções enriquecidas para criar um artefato ou aplicar tarefas. Usado por agentes de IA para entender o que criar a seguir.

```
openspec instructions [artifact] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `artifact` | Não | ID do artefato: `proposal`, `specs`, `design`, `tasks`, ou `apply` |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--change <id>` | Nome da alteração (obrigatório no modo não interativo) |
| `--schema <name>` | Substituição do esquema |
| `--json` | Saída em formato JSON |

**Caso especial:** Use `apply` como artefato para obter instruções de implementação de tarefas.

**Exemplos:**

```bash
# Obtém instruções para o próximo artefato
openspec instructions --change add-dark-mode

# Obtém instruções para um artefato específico
openspec instructions design --change add-dark-mode

# Obtém instruções de aplicação/implementação
openspec instructions apply --change add-dark-mode

# JSON para consumo por agentes
openspec instructions design --change add-dark-mode --json
```

**A saída inclui:**

- Conteúdo do template para o artefato
- Contexto do projeto a partir da config
- Conteúdo dos artefatos dependentes
- Regras por artefato a partir da config

---

### `openspec templates`

Mostra os caminhos resolvidos dos templates para todos os artefatos em um esquema.

```
openspec templates [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--schema <name>` | Esquema a ser inspecionado (padrão: `spec-driven`) |
| `--json` | Saída em formato JSON |

**Exemplos:**

```bash
# Mostra os caminhos dos templates para o esquema padrão
openspec templates

# Mostra os templates para um esquema personalizado
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

## Comandos de Esquema

Comandos para criar e gerenciar esquemas de fluxo de trabalho personalizados.

### `openspec schema init`

Cria um novo esquema local do projeto.

```
openspec schema init <name> [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `name` | Sim | Nome do esquema (kebab-case) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--description <text>` | Descrição do esquema |
| `--artifacts <list>` | IDs dos artefatos separados por vírgula (padrão: `proposal,specs,design,tasks`) |
| `--default` | Define como esquema padrão do projeto |
| `--no-default` | Não solicita para definir como padrão |
| `--force` | Sobrescreve um esquema existente |
| `--json` | Saída em formato JSON |

**Exemplos:**

```bash
# Criação interativa de esquema
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
├── schema.yaml           # Definição do esquema
└── templates/
    ├── proposal.md       # Template para cada artefato
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Copia um esquema existente para o seu projeto para personalização.

```
openspec schema fork <source> [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `source` | Sim | Esquema a ser copiado |
| `name` | Não | Nome do novo esquema (padrão: `<source>-custom`) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--force` | Sobrescreve o destino existente |
| `--json` | Saída em formato JSON |

**Exemplo:**

```bash
# Faz um fork do esquema spec-driven integrado
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valida a estrutura e os templates de um esquema.

```
openspec schema validate [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `name` | Não | Esquema a ser validado (valida todos se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--verbose` | Mostra as etapas de validação detalhadas |
| `--json` | Saída em formato JSON |

**Exemplo:**

```bash
# Valida um esquema específico
openspec schema validate my-workflow

# Valida todos os esquemas
openspec schema validate
```

---

### `openspec schema which`

Mostra de onde um esquema é resolvido (útil para depurar precedência).

```
openspec schema which [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `name` | Não | Nome do esquema |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--all` | Lista todos os esquemas com suas fontes |
| `--json` | Saída em formato JSON |

**Exemplo:**

```bash
# Verifica de onde um esquema vem
openspec schema which spec-driven
```

**Saída:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedência dos esquemas:**

1. Projeto: `openspec/schemas/<nome>/`
2. Usuário: `~/.local/share/openspec/schemas/<nome>/`
3. Pacote: Esquemas integrados

---

## Comandos de Configuração

### `openspec config`

Visualize e modifique a configuração global do OpenSpec.

```
openspec config <subcomando> [opções]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-------------|
| `path` | Mostra a localização do arquivo de configuração |
| `list` | Mostra todas as configurações atuais |
| `get <chave>` | Obtém um valor específico |
| `set <chave> <valor>` | Define um valor |
| `unset <chave>` | Remove uma chave |
| `reset` | Restaura para os padrões |
| `edit` | Abre no `$EDITOR` |
| `profile [preset]` | Configura o perfil do fluxo de trabalho interativamente ou via preset |

**Exemplos:**

```bash
# Mostra o caminho do arquivo de configuração
openspec config path

# Lista todas as configurações
openspec config list

# Obtém um valor específico
openspec config get telemetry.enabled

# Define um valor
openspec config set telemetry.enabled false

# Define explicitamente um valor de string
openspec config set user.name "Meu Nome" --string

# Remove uma configuração personalizada
openspec config unset user.name

# Restaura toda a configuração
openspec config reset --all --yes

# Edita a configuração no seu editor
openspec config edit

# Configura o perfil com um assistente baseado em ações
openspec config profile

# Preset rápido: alterna fluxos de trabalho para core (mantém o modo de entrega)
openspec config profile core
```

`openspec config profile` começa com um resumo do estado atual, depois permite que você escolha:
- Alterar entrega + fluxos de trabalho
- Alterar apenas a entrega
- Alterar apenas os fluxos de trabalho
- Manter configurações atuais (sair)

Se você mantiver as configurações atuais, nenhuma alteração será gravada e nenhuma solicitação de atualização será exibida.
Se não houver alterações na configuração, mas os arquivos do projeto atual estiverem desatualizados em relação ao seu perfil/entrega global, o OpenSpec mostrará um aviso e sugerirá executar `openspec update`.
Pressionar `Ctrl+C` também cancela o fluxo de forma limpa (sem rastreamento de pilha) e sai com o código `130`.
Na lista de verificação de fluxos de trabalho, `[x]` significa que o fluxo de trabalho está selecionado na configuração global. Para aplicar essas seleções aos arquivos do projeto, execute `openspec update` (ou escolha `Aplicar alterações a este projeto agora?` quando solicitado dentro de um projeto).

**Exemplos interativos:**

```bash
# Atualização apenas da entrega
openspec config profile
# escolha: Alterar apenas a entrega
# escolha a entrega: Somente habilidades

# Atualização apenas dos fluxos de trabalho
openspec config profile
# escolha: Alterar apenas os fluxos de trabalho
# alterne os fluxos de trabalho na lista de verificação, depois confirme
```

---

## Comandos de Utilidade

### `openspec feedback`

Envie feedback sobre o OpenSpec. Cria uma issue no GitHub.

```
openspec feedback <mensagem> [opções]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `mensagem` | Sim | Mensagem de feedback |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--body <texto>` | Descrição detalhada |

**Requisitos:** O GitHub CLI (`gh`) deve estar instalado e autenticado.

**Exemplo:**

```bash
openspec feedback "Adicionar suporte para tipos de artefato personalizados" \
  --body "Eu gostaria de definir meus próprios tipos de artefato além dos integrados."
```

---

### `openspec completion`

Gerencia as conclusões de shell para o CLI do OpenSpec.

```
openspec completion <subcomando> [shell]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-------------|
| `generate [shell]` | Gera o script de conclusão para stdout |
| `install [shell]` | Instala a conclusão para seu shell |
| `uninstall [shell]` | Remove as conclusões instaladas |

**Shells suportados:** `bash`, `zsh`, `fish`, `powershell`

**Exemplos:**

```bash
# Instala as conclusões (detecta automaticamente o shell)
openspec completion install

# Instala para um shell específico
openspec completion install zsh

# Gera o script para instalação manual
openspec completion generate bash > ~/.bash_completion.d/openspec

# Desinstala
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
| `OPENSPEC_TELEMETRY` | Defina como `0` para desativar a telemetria |
| `DO_NOT_TRACK` | Defina como `1` para desativar a telemetria (sinal DNT padrão) |
| `OPENSPEC_CONCURRENCY` | Concorrência padrão para validação em massa (padrão: 6) |
| `EDITOR` ou `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Desativa a saída colorida quando definido |

---

## Documentação Relacionada

- [Comandos](commands.md) - Comandos de barra AI (`/opsx:propose`, `/opsx:apply`, etc.)
- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada comando
- [Personalização](customization.md) - Crie esquemas e modelos personalizados
- [Primeiros Passos](getting-started.md) - Guia de configuração inicial