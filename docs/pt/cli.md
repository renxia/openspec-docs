# Referência do CLI

O CLI do OpenSpec (`openspec`) fornece comandos de terminal para configuração do projeto, validação, inspeção de status e gerenciamento. Esses comandos complementam os comandos de IA com barra (como `/opsx:propose`) documentados em [Comandos](commands.md).

## Resumo

| Categoria | Comandos | Finalidade |
|----------|----------|---------|
| **Configuração** | `init`, `update` | Inicializar e atualizar o OpenSpec em seu projeto |
| **Navegação** | `list`, `view`, `show` | Explorar alterações e especificações |
| **Validação** | `validate` | Verificar alterações e especificações em busca de problemas |
| **Ciclo de vida** | `archive` | Finalizar alterações concluídas |
| **Fluxo de trabalho** | `status`, `instructions`, `templates`, `schemas` | Suporte a fluxo de trabalho orientado por artefatos |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Criar e gerenciar fluxos de trabalho personalizados |
| **Configuração** | `config` | Visualizar e modificar configurações |
| **Utilitários** | `feedback`, `completion` | Feedback e integração com shell |

## Comandos Humanos vs Agentes

A maioria dos comandos CLI é projetada para **uso humano** em um terminal. Alguns comandos também suportam **uso por agentes/scripts** via saída JSON.

### Comandos Exclusivos para Humanos

Estes comandos são interativos e projetados para uso no terminal:

| Comando | Finalidade |
|---------|------------|
| `openspec init` | Inicializar projeto (solicitações interativas) |
| `openspec view` | Painel de controle interativo |
| `openspec config edit` | Abrir configuração no editor |
| `openspec feedback` | Enviar feedback via GitHub |
| `openspec completion install` | Instalar conclusões do shell |

### Comandos Compatíveis com Agentes

Estes comandos suportam saída `--json` para uso programático por agentes de IA e scripts:

| Comando | Uso Humano | Uso por Agente |
|---------|------------|----------------|
| `openspec list` | Navegar em alterações/especificações | `--json` para dados estruturados |
| `openspec show <item>` | Ler conteúdo | `--json` para análise |
| `openspec validate` | Verificar problemas | `--all --json` para validação em lote |
| `openspec status` | Ver progresso dos artefatos | `--json` para status estruturado |
| `openspec instructions` | Obter próximos passos | `--json` para instruções do agente |
| `openspec templates` | Encontrar caminhos dos templates | `--json` para resolução de caminhos |
| `openspec schemas` | Listar schemas disponíveis | `--json` para descoberta de schemas |

---

## Opções Globais

Estas opções funcionam com todos os comandos:

| Opção | Descrição |
|-------|-----------|
| `--version`, `-V` | Mostrar número da versão |
| `--no-color` | Desativar saída colorida |
| `--help`, `-h` | Exibir ajuda para o comando |

---

## Comandos de Configuração

### `openspec init`

Inicializar OpenSpec no seu projeto. Cria a estrutura de pastas e configura integrações com ferramentas de IA.

O comportamento padrão usa os padrões da configuração global: perfil `core`, entrega `both`, fluxos de trabalho `propose, explore, apply, archive`.

```
openspec init [path] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `path` | Não | Diretório alvo (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--tools <list>` | Configurar ferramentas de IA de forma não interativa. Use `all`, `none`, ou lista separada por vírgulas |
| `--force` | Limpeza automática de arquivos legados sem solicitar confirmação |
| `--profile <profile>` | Sobrescrever o perfil global para esta execução de init (`core` ou `custom`) |

`--profile custom` usa quaisquer fluxos de trabalho que estejam selecionados na configuração global (`openspec config profile`).

**IDs de ferramentas suportadas (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

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

# Sobrescrever o perfil para esta execução
openspec init --profile core

# Pular solicitações e limpar automaticamente arquivos legados
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
.cursor/commands/       # Comandos OPSX do Cursor (se entrega inclui comandos)
... (outras configurações de ferramentas)
```

---

### `openspec update`

Atualizar os arquivos de instruções do OpenSpec após atualizar o CLI. Regenera os arquivos de configuração das ferramentas de IA usando seu perfil global atual, fluxos de trabalho selecionados e modo de entrega.

```
openspec update [path] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `path` | Não | Diretório alvo (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--force` | Forçar atualização mesmo quando os arquivos estiverem atualizados |

**Exemplo:**

```bash
# Atualizar arquivos de instruções após atualização via npm
npm update @fission-ai/openspec
openspec update
```

---

## Comandos de Navegação

### `openspec list`

Listar alterações ou especificações no seu projeto.

```
openspec list [options]
```

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--specs` | Listar especificações em vez de alterações |
| `--changes` | Listar alterações (padrão) |
| `--sort <order>` | Ordenar por `recent` (padrão) ou `name` |
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
Alterações ativas:
  add-dark-mode     Suporte a alternância de tema da UI
  fix-login-bug     Tratamento de timeout de sessão
```

---

### `openspec view`

Exibir um painel de controle interativo para explorar especificações e alterações.

```
openspec view
```

Abre uma interface baseada no terminal para navegar nas especificações e alterações do seu projeto.

---

### `openspec show`

Exibir detalhes de uma alteração ou especificação.

```
openspec show [item-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `item-name` | Não | Nome da alteração ou especificação (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--type <type>` | Especificar tipo: `change` ou `spec` (detectado automaticamente se inequívoco) |
| `--json` | Saída em formato JSON |
| `--no-interactive` | Desativar solicitações |

**Opções específicas para alterações:**

| Opção | Descrição |
|-------|-----------|
| `--deltas-only` | Mostrar apenas especificações delta (modo JSON) |

**Opções específicas para especificações:**

| Opção | Descrição |
|-------|-----------|
| `--requirements` | Mostrar apenas requisitos, excluir cenários (modo JSON) |
| `--no-scenarios` | Excluir conteúdo de cenários (modo JSON) |
| `-r, --requirement <id>` | Mostrar requisito específico por índice baseado em 1 (modo JSON) |

**Exemplos:**

```bash
# Seleção interativa
openspec show

# Mostrar uma alteração específica
openspec show add-dark-mode

# Mostrar uma especificação específica
openspec show auth --type spec

# Saída JSON para análise
openspec show add-dark-mode --json
```

---

## Comandos de Validação

### `openspec validate`

Validar alterações e especificações quanto a problemas estruturais.

```
openspec validate [item-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `item-name` | Não | Item específico para validar (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--all` | Validar todas as alterações e especificações |
| `--changes` | Validar todas as alterações |
| `--specs` | Validar todas as especificações |
| `--type <type>` | Especificar tipo quando o nome é ambíguo: `change` ou `spec` |
| `--strict` | Ativar modo de validação estrita |
| `--json` | Saída em formato JSON |
| `--concurrency <n>` | Máximo de validações paralelas (padrão: 6, ou variável de ambiente `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Desativar solicitações |

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

Arquivar uma alteração concluída e mesclar especificações delta nas especificações principais.

```
openspec archive [change-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `change-name` | Não | Alteração para arquivar (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `-y, --yes` | Pular solicitações de confirmação |
| `--skip-specs` | Pular atualizações de especificações (para alterações apenas de infraestrutura/ferramentas/documentação) |
| `--no-validate` | Pular validação (requer confirmação) |

**Exemplos:**

```bash
# Arquivamento interativo
openspec archive

# Arquivar alteração específica
openspec archive add-dark-mode

# Arquivar sem solicitações (CI/scripts)
openspec archive add-dark-mode --yes

# Arquivar alteração de ferramentas que não afeta especificações
openspec archive update-ci-config --skip-specs
```

**O que ele faz:**

1. Valida a alteração (a menos que `--no-validate`)
2. Solicita confirmação (a menos que `--yes`)
3. Mescla especificações delta em `openspec/specs/`
4. Move a pasta da alteração para `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandos de Fluxo de Trabalho

Estes comandos suportam o fluxo de trabalho OPSX orientado a artefatos. São úteis tanto para humanos verificando progresso quanto para agentes determinando os próximos passos.

### `openspec status`

Exibir status de conclusão dos artefatos para uma alteração.

```
openspec status [options]
```

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--change <id>` | Nome da alteração (solicita se omitido) |
| `--schema <name>` | Sobrescrita de schema (detectado automaticamente da config da alteração) |
| `--json` | Saída em formato JSON |

**Exemplos:**

```bash
# Verificação de status interativa
openspec status

# Status para alteração específica
openspec status --change add-dark-mode

# JSON para uso por agente
openspec status --change add-dark-mode --json
```

**Saída (texto):**

```
Alteração: add-dark-mode
Schema: spec-driven
Progresso: 2/4 artefatos concluídos

[x] proposal
[ ] design
[x] specs
[-] tasks (bloqueado por: design)
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

Obter instruções enriquecidas para criar um artefato ou aplicar tarefas. Usado por agentes de IA para entender o que criar a seguir.

```
openspec instructions [artifact] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `artifact` | Não | ID do artefato: `proposal`, `specs`, `design`, `tasks` ou `apply` |

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--change <id>` | Nome da alteração (obrigatório no modo não interativo) |
| `--schema <name>` | Sobrescrita de schema |
| `--json` | Saída em formato JSON |

**Caso especial:** Use `apply` como artefato para obter instruções de implementação de tarefas.

**Exemplos:**

```bash
# Obter instruções para o próximo artefato
openspec instructions --change add-dark-mode

# Obter instruções para artefato específico
openspec instructions design --change add-dark-mode

# Obter instruções de aplicação/implementação
openspec instructions apply --change add-dark-mode

# JSON para consumo por agente
openspec instructions design --change add-dark-mode --json
```

**A saída inclui:**

- Conteúdo do template para o artefato
- Contexto do projeto da configuração
- Conteúdo dos artefatos dependentes
- Regras por artefato da configuração

---

### `openspec templates`

Mostrar caminhos de templates resolvidos para todos os artefatos em um schema.

```
openspec templates [options]
```

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--schema <name>` | Schema a inspecionar (padrão: `spec-driven`) |
| `--json` | Saída em formato JSON |

**Exemplos:**

```bash
# Mostrar caminhos de templates para o schema padrão
openspec templates

# Mostrar templates para schema personalizado
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

Listar schemas de fluxo de trabalho disponíveis com suas descrições e fluxos de artefatos.

```
openspec schemas [options]
```

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--json` | Saída em formato JSON |

**Exemplo:**

```bash
openspec schemas
```

**Saída:**

```
Schemas disponíveis:

  spec-driven (pacote)
    O fluxo de trabalho padrão de desenvolvimento orientado a especificações
    Fluxo: proposal → specs → design → tasks

  my-custom (projeto)
    Fluxo de trabalho personalizado para este projeto
    Fluxo: research → proposal → tasks
```

---

## Comandos de Schema

Comandos para criar e gerenciar schemas de fluxo de trabalho personalizados.

### `openspec schema init`

Cria um novo schema local ao projeto.

```
openspec schema init <name> [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `name` | Sim | Nome do schema (kebab-case) |

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--description <text>` | Descrição do schema |
| `--artifacts <list>` | IDs de artefatos separados por vírgula (padrão: `proposal,specs,design,tasks`) |
| `--default` | Definir como schema padrão do projeto |
| `--no-default` | Não perguntar se deseja definir como padrão |
| `--force` | Sobrescrever schema existente |
| `--json` | Saída em formato JSON |

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

Copia um schema existente para o seu projeto para personalização.

```
openspec schema fork <source> [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `source` | Sim | Schema a ser copiado |
| `name` | Não | Novo nome do schema (padrão: `<source>-custom`) |

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--force` | Sobrescrever destino existente |
| `--json` | Saída em formato JSON |

**Exemplo:**

```bash
# Bifurcar o schema spec-driven embutido
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valida a estrutura e os modelos de um schema.

```
openspec schema validate [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `name` | Não | Schema a ser validado (valida todos se omitido) |

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--verbose` | Mostrar etapas detalhadas de validação |
| `--json` | Saída em formato JSON |

**Exemplo:**

```bash
# Validar um schema específico
openspec schema validate my-workflow

# Validar todos os schemas
openspec schema validate
```

---

### `openspec schema which`

Mostra de onde um schema é resolvido (útil para depurar precedência).

```
openspec schema which [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `name` | Não | Nome do schema |

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--all` | Listar todos os schemas com suas origens |
| `--json` | Saída em formato JSON |

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

Visualiza e modifica a configuração global do OpenSpec.

```
openspec config <subcommand> [options]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-----------|
| `path` | Mostrar localização do arquivo de configuração |
| `list` | Mostrar todas as configurações atuais |
| `get <key>` | Obter um valor específico |
| `set <key> <value>` | Definir um valor |
| `unset <key>` | Remover uma chave |
| `reset` | Redefinir para os padrões |
| `edit` | Abrir no `$EDITOR` |
| `profile [preset]` | Configurar o perfil do fluxo de trabalho interativamente ou via predefinição |

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

# Redefinir toda a configuração
openspec config reset --all --yes

# Editar configuração no seu editor
openspec config edit

# Configurar perfil com assistente baseado em ações
openspec config profile

# Predefinição rápida: mudar fluxos de trabalho para core (mantém modo de entrega)
openspec config profile core
```

`openspec config profile` começa com um resumo do estado atual, depois permite que você escolha:
- Mudar entrega + fluxos de trabalho
- Mudar apenas a entrega
- Mudar apenas os fluxos de trabalho
- Manter as configurações atuais (sair)

Se você mantiver as configurações atuais, nenhuma alteração será gravada e nenhum prompt de atualização será exibido.
Se não houver alterações de configuração, mas os arquivos do projeto atual estiverem dessincronizados com o seu perfil/entrega global, o OpenSpec exibirá um aviso e sugerirá executar `openspec update`.
Pressionar `Ctrl+C` também cancela o fluxo limamente (sem rastreamento de pilha) e sai com o código `130`.
Na lista de verificação do fluxo de trabalho, `[x]` significa que o fluxo de trabalho está selecionado na configuração global. Para aplicar essas seleções aos arquivos do projeto, execute `openspec update` (ou escolha `Apply changes to this project now?` quando solicitado dentro de um projeto).

**Exemplos interativos:**

```bash
# Atualização apenas de entrega
openspec config profile
# escolher: Change delivery only
# escolher entrega: Skills only

# Atualização apenas de fluxos de trabalho
openspec config profile
# escolher: Change workflows only
# alternar fluxos de trabalho na lista de verificação, depois confirmar
```

---

## Comandos Utilitários

### `openspec feedback`

Envia feedback sobre o OpenSpec. Cria uma issue no GitHub.

```
openspec feedback <message> [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `message` | Sim | Mensagem de feedback |

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--body <text>` | Descrição detalhada |

**Requisitos:** O GitHub CLI (`gh`) deve estar instalado e autenticado.

**Exemplo:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Gerencia as conclusões de shell para o CLI do OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-----------|
| `generate [shell]` | Gerar script de conclusão para stdout |
| `install [shell]` | Instalar conclusão para o seu shell |
| `uninstall [shell]` | Remover conclusões instaladas |

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
|--------|-------------|
| `0` | Sucesso |
| `1` | Erro (falha de validação, arquivos ausentes, etc.) |

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `OPENSPEC_TELEMETRY` | Definir como `0` para desativar a telemetria |
| `DO_NOT_TRACK` | Definir como `1` para desativar a telemetria (sinal DNT padrão) |
| `OPENSPEC_CONCURRENCY` | Concorrência padrão para validação em massa (padrão: 6) |
| `EDITOR` ou `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Desativar saída colorida quando definido |

---

## Documentação Relacionada

- [Comandos](commands.md) - Comandos de barra de IA (`/opsx:propose`, `/opsx:apply`, etc.)
- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada comando
- [Personalização](customization.md) - Criar schemas e modelos personalizados
- [Primeiros Passos](getting-started.md) - Guia de configuração inicial