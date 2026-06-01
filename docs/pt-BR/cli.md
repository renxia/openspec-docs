# Referência do CLI

O OpenSpec CLI (`openspec`) oferece comandos de terminal para configuração de projeto, validação, inspeção de status e gerenciamento. Esses comandos complementam os comandos de barra (slash) de IA (como `/opsx:propose`) documentados em [Comandos](commands.md).

## Resumo

| Categoria | Comandos | Finalidade |
|----------|----------|---------|
| **Configuração** | `init`, `update` | Inicializar e atualizar o OpenSpec em seu projeto |
| **Áreas de trabalho (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | Configurar visões locais sobre repositórios ou pastas vinculados |
| **Contexto compartilhado (beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | Gerenciar registros locais de context-store e contexto durável de iniciativas |
| **Navegação** | `list`, `view`, `show` | Explorar mudanças e especificações |
| **Validação** | `validate` | Verificar mudanças e especificações em busca de problemas |
| **Ciclo de vida** | `archive` | Finalizar mudanças concluídas |
| **Fluxo de trabalho** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | Suporte a fluxo de trabalho orientado por artefatos |
| **Esquemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Criar e gerenciar fluxos de trabalho personalizados |
| **Configuração** | `config` | Visualizar e modificar configurações |
| **Utilidades** | `feedback`, `completion` | Feedback e integração com shell |

---

## Comandos Humano vs. Agente

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
| `openspec show <item>` | Ler conteúdo | `--json` para parsing |
| `openspec validate` | Verificar problemas | `--all --json` para validação em massa |
| `openspec status` | Ver progresso dos artefatos | `--json` para status estruturado |
| `openspec instructions` | Obter próximos passos | `--json` para instruções do agente |
| `openspec templates` | Encontrar caminhos de templates | `--json` para resolução de caminhos |
| `openspec schemas` | Listar schemas disponíveis | `--json` para descoberta de schemas |
| `openspec workspace setup --no-interactive` | Criar um workspace com entradas explícitas | `--json` para saída de setup estruturada |
| `openspec workspace list` | Navegar por workspaces conhecidos | `--json` para objetos workspace tipados |
| `openspec workspace link` | Vincular um repositório ou pasta | `--json` para saída de vinculação estruturada |
| `openspec workspace relink` | Reparar um caminho vinculado | `--json` para saída de vinculação estruturada |
| `openspec workspace doctor` | Verificar um workspace | `--json` para saída de status estruturada |
| `openspec workspace update` | Atualizar orientação local do workspace e habilidades dos agentes | `--tools` seleciona agentes; perfil seleciona workflows |
| `openspec context-store setup <id>` | Criar um armazenamento de contexto local | `--json` com entradas explícitas para saída de setup estruturada |
| `openspec context-store register <path>` | Registrar um armazenamento de contexto existente | `--json` para saída de registro estruturada |
| `openspec context-store unregister <id>` | Esquecer um registro de armazenamento de contexto local | `--json` para saída de limpeza estruturada |
| `openspec context-store remove <id>` | Excluir uma pasta de armazenamento de contexto local registrada | `--yes --json` para exclusão não interativa |
| `openspec context-store list` | Navegar por armazenamentos de contexto registrados | `--json` para registros estruturados |
| `openspec context-store doctor` | Verificar a configuração do armazenamento local | `--json` para diagnósticos estruturados |
| `openspec initiative list` | Navegar por iniciativas compartilhadas | `--json` para registros de iniciativa estruturados |
| `openspec initiative show <id>` | Resolver uma iniciativa | `--json` para caminhos canônicos e metadados |
| `openspec new change <id>` | Criar esqueleto de alteração local ao repositório | `--json`, mais `--initiative` para links de coordenação compartilhados |
| `openspec set change <id>` | Atualizar metadados de alteração commitados | `--json`, mais `--initiative` para links de coordenação compartilhados |

---

## Opções Globais

Essas opções funcionam com todos os comandos:

| Opção | Descrição |
|-------|-----------|
| `--version`, `-V` | Mostrar número da versão |
| `--no-color` | Desativar saída colorida |
| `--help`, `-h` | Exibir ajuda para o comando |

---

## Comandos de Setup

### `openspec init`

Inicializa o OpenSpec em seu projeto. Cria a estrutura de pastas e configura integrações com ferramentas de IA.

O comportamento padrão usa os padrões da configuração global: perfil `core`, entrega `both`, workflows `propose, explore, apply, sync, archive`.

```
openspec init [caminho] [opções]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `caminho` | Não | Diretório de destino (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|------|-----------|
| `--tools <lista>` | Configurar ferramentas de IA de forma não interativa. Use `all`, `none`, ou uma lista separada por vírgulas |
| `--force` | Limpar automaticamente arquivos legados sem perguntar |
| `--profile <perfil>` | Substituir o perfil global para esta execução do init (`core` ou `custom`) |

`--profile custom` usa quaisquer workflows atualmente selecionados na configuração global (`openspec config profile`).

**IDs de ferramentas suportados (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Exemplos:**

```bash
# Inicialização interativa
openspec init

# Inicializar em um diretório específico
openspec init ./meu-projeto

# Não interativo: configurar para Claude e Cursor
openspec init --tools claude,cursor

# Configurar para todas as ferramentas suportadas
openspec init --tools all

# Substituir perfil para esta execução
openspec init --profile core

# Ignorar prompts e limpar automaticamente arquivos legados
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
... (outras configs de ferramentas)
```

---

### `openspec update`

Atualiza os arquivos de instrução do OpenSpec após atualizar o CLI. Re-gera os arquivos de configuração das ferramentas de IA usando seu perfil global atual, workflows selecionados e modo de entrega.

```
openspec update [caminho] [opções]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| `caminho` | Não | Diretório de destino (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|------|-----------|
| `--force` | Forçar atualização mesmo quando os arquivos estão atualizados |

**Exemplo:**

```bash
# Atualizar arquivos de instrução após atualização do npm
npm update @fission-ai/openspec
openspec update
```

---

## Comandos de Workspace

Os comandos de workspace estão em beta. O modelo de visualização local abaixo é a direção atual, mas automação externa, integrações e workflows de longa duração ainda devem tratar o comportamento dos comandos, arquivos de estado e saída JSON como evolutivos.

Workspaces de coordenação são visões locais à máquina sobre repositórios ou pastas vinculadas. A visibilidade do workspace não é compromisso de alteração: vincule os repositórios ou pastas que o OpenSpec deve conhecer, então crie alterações quando estiver pronto para planejar um trabalho específico.

### `openspec workspace setup`

Cria um workspace no local padrão do workspace OpenSpec e vincula pelo menos um repositório ou pasta existente.

```bash
openspec workspace setup [opções]
```

**Opções:**

| Opção | Descrição |
|------|-----------|
| `--name <nome>` | Nome do workspace. Nomes devem estar em kebab-case |
| `--link <caminho>` | Vincular um repositório ou pasta existente e inferir o nome do link a partir do nome da pasta |
| `--link <nome>=<caminho>` | Vincular um repositório ou pasta existente com um nome de link explícito |
| `--opener <id>` | Armazenar um abridor preferido durante setup não interativo: `codex-cli`, `claude`, `github-copilot`, ou `editor` |
| `--tools <ferramentas>` | Instalar habilidades OpenSpec locais do workspace para agentes. Use `all`, `none`, ou IDs de ferramentas separados por vírgulas |
| `--no-interactive` | Desativar prompts; requer `--name` e pelo menos um `--link` |
| `--json` | Saída JSON; requer `--no-interactive` |

**Exemplos:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

O setup interativo pergunta por um abridor preferido e pode instalar habilidades OpenSpec locais do workspace para agentes selecionados. O setup não interativo armazena um abridor preferido apenas quando `--opener` é fornecido; caso contrário, `workspace open` solicita mais tarde em terminais interativos quando um abridor suportado está disponível, ou pede que os scripts passem `--agent <ferramenta>` ou `--editor`.

A instalação de habilidades do workspace é apenas de habilidades neste recorte beta: mesmo que a entrega global seja `commands` ou `both`, o setup do workspace grava pastas de habilidades do agente na raiz do workspace e não cria arquivos de comando de barra. O perfil global ativo escolhe quais habilidades de workflow são instaladas; `--tools` escolhe quais agentes as recebem. Se `--tools` for omitido no setup não interativo, nenhuma habilidade é instalada e `workspace update --tools <ids>` pode adicioná-las depois.

### `openspec workspace list`

Lista workspaces OpenSpec conhecidos do registro local.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

A lista mostra a localização de cada workspace e os repositórios ou pastas vinculados. Registros obsoletos do registro são relatados, mas não alterados.

### `openspec workspace link`

Registra um repositório ou pasta existente para um workspace.

```bash
openspec workspace link [nome] <caminho> [opções]
```

**Opções:**

| Opção | Descrição |
|------|-----------|
| `--workspace <nome>` | Selecionar um workspace conhecido do registro local |
| `--json` | Saída JSON |
| `--no-interactive` | Desativar prompts de seleção de workspace |

**Exemplos:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

O caminho deve já existir. Caminhos relativos são resolvidos em relação ao diretório atual do comando antes que o OpenSpec armazene o caminho absoluto verificado no estado do workspace local à máquina. Os caminhos vinculados podem ser repositórios completos, pacotes, serviços, aplicativos ou pastas sem estado `openspec/` local ao repositório.

### `openspec workspace relink`

Repara ou altera o caminho local para um link existente.

```bash
openspec workspace relink <nome> <caminho> [opções]
```

O caminho deve já existir. Relink atualiza apenas o caminho local à máquina para o nome de link estável.

### `openspec workspace doctor`

Verifica o que um workspace pode resolver na máquina atual.

```bash
openspec workspace doctor [opções]
```

Doctor mostra a localização do workspace, repositórios ou pastas vinculados, caminhos ausentes, caminhos de specs locais ao repositório quando presentes, e correções sugeridas. A saída JSON também inclui o caminho de planejamento do workspace para compatibilidade. Ele apenas reporta problemas; não os repara automaticamente.

Comandos que precisam de um workspace usam o workspace atual quando executados de dentro de uma pasta ou subdiretório do workspace. De outro lugar, passe `--workspace <nome>`, selecione do seletor em um terminal interativo, ou confie no único workspace conhecido quando exatamente um existir. No modo `--json` ou `--no-interactive`, uma seleção ambígua falha com um erro de status estruturado e sugere `--workspace <nome>`.

As respostas JSON usam objetos tipados mais arrays `status`. Os dados primários ficam em `workspace`, `workspaces` ou `link`; avisos e erros ficam em `status`.

### `openspec workspace update`

Atualiza a orientação OpenSpec local do workspace e as habilidades dos agentes.

```bash
openspec workspace update [nome] [opções]
```

**Opções:**

| Opção | Descrição |
|------|-----------|
| `--workspace <nome>` | Selecionar um workspace conhecido do registro local |
| `--tools <ferramentas>` | Selecionar agentes para as habilidades do workspace. Use `all`, `none`, ou IDs de ferramentas separados por vírgulas |
| `--json` | Saída JSON |
| `--no-interactive` | Desativar prompts de seleção de workspace |

**Exemplos:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` atualiza o bloco de orientação gerado do workspace e a superfície de abertura local. Para habilidades de agentes, ele reutiliza a seleção armazenada de agentes de habilidades do workspace quando `--tools` é omitido. Passar `--tools` substitui essa seleção armazenada. Ele atualiza apenas os diretórios de habilidades de workflow gerenciados pelo OpenSpec na raiz do workspace, remove habilidades de workflow gerenciadas deselecionadas e deixa repositórios e pastas vinculados intocados.

Executar `openspec update` de dentro de um workspace redireciona para `openspec workspace update`; execute `openspec update` dentro de projetos locais ao repositório quando quiser que os arquivos de ferramentas de propriedade do repositório sejam atualizados.

### `openspec workspace open`

Abre um conjunto de trabalho do workspace através do abridor preferido armazenado, uma substituição de agente para a sessão, ou modo de editor VS Code.

```bash
openspec workspace open [nome] [opções]
```

**Opções:**

| Opção | Descrição |
|------|-----------|
| `--workspace <nome>` | Alias para o nome do workspace posicional |
| `--initiative <id>` | Abrir uma iniciativa como uma visualização local do workspace. Aceita `<id>` ou `<loja>/<id>` |
| `--store <id>` | ID da loja de contexto registrada para `--initiative` |
| `--store-path <caminho>` | Raiz da loja de contexto local existente para `--initiative` |
| `--agent <ferramenta>` | Substituição de agente para a sessão: `codex-cli`, `claude`, ou `github-copilot` |
| `--editor` | Abrir o arquivo de workspace VS Code mantido como um workspace de editor normal |
| `--no-interactive` | Desativar prompts de seleção de workspace e abridor |

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

`workspace open` usa o workspace atual quando executado dentro de um, seleciona automaticamente o único workspace conhecido quando executado em outro lugar, e pede ao usuário que escolha quando múltiplos workspaces são conhecidos. `--agent` e `--editor` não alteram o abridor preferido armazenado. Passar ambas as substituições de abridor é um erro; escolha `--agent <ferramenta>` ou `--editor`.

Quando `--initiative` é usado, o OpenSpec prepara ou seleciona uma visualização local privada do workspace para essa iniciativa. Lojas selecionadas pelo registro são armazenadas por id; `--store-path` armazena um seletor de caminho local em tempo de execução porque as visualizações do workspace são estado local privado.

O OpenSpec mantém `<nome-do-workspace>.code-workspace` na raiz do workspace para aberturas do VS Code e GitHub Copilot-in-VS-Code. Esse arquivo é o estado da visualização local do workspace à máquina.

O workspace VS Code mantido lista primeiro repositórios ou pastas vinculados válidos, depois o contexto da iniciativa quando anexado, depois os arquivos do workspace OpenSpec. O VS Code exibe essas entradas como um workspace multi-raiz.

A abertura de workspace raiz torna os repositórios ou pastas vinculados visíveis para exploração e contexto. Edições de implementação devem começar apenas após uma solicitação explícita do usuário e um workflow normal de implementação do OpenSpec.

---

## Comandos de Contexto Compartilhado

Lojas de contexto e iniciativas são superfícies de coordenação beta. Uma loja de contexto é um registro local para contexto compartilhado durável, geralmente uma pasta ou clone com suporte a Git. Uma iniciativa é contexto de coordenação compartilhada dentro de uma loja de contexto; alterações locais ao repositório podem vinculá-la sem copiar o plano compartilhado em cada repositório.

### `openspec context-store setup`

Cria e registra uma loja de contexto local. Sem argumentos em um terminal,
o OpenSpec guia o usuário durante a configuração. Agentes e scripts devem passar
entradas explícitas e usar `--json`.

```bash
openspec context-store setup [id] [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--path <path>` | Caminho da pasta da loja de contexto; o padrão é o diretório de dados local gerenciado pelo OpenSpec |
| `--init-git` | Inicializa um repositório Git na loja de contexto |
| `--no-init-git` | Não inicializa um repositório Git |
| `--json` | Saída em JSON |

Quando `--path` é omitido, a configuração cria a loja em `getGlobalDataDir()/context-stores/<id>`: `$XDG_DATA_HOME/openspec/context-stores/<id>` quando `XDG_DATA_HOME` está definido, ou `~/.local/share/openspec/context-stores/<id>` em substituições de estilo Unix. Passe `--path` quando quiser a loja em um clone visível ou pasta específica de equipe.

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
| `--id <id>` | ID da loja de contexto; o padrão é os metadados da loja ou o nome da pasta |
| `--json` | Saída em JSON |

### `openspec context-store unregister`

Remove o registro de uma loja de contexto local sem deletar arquivos.

```bash
openspec context-store unregister <id> [--json]
```

Use isso quando uma loja foi movida, clonada em outro lugar, ou não deve mais ser
exibida pelo OpenSpec nesta máquina.

### `openspec context-store remove`

Remove o registro de uma loja de contexto local e deleta sua pasta local.

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` mostra a pasta exata antes de deletar em um terminal interativo.
Agentes, scripts e chamadores JSON devem passar `--yes` para confirmar a exclusão.
O OpenSpec se recusa a deletar uma pasta que não contém metadados
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

Doctor é apenas diagnóstico; relata raízes ausentes, incompatibilidades de metadados e estado de registro local inválido sem modificar a loja.

### `openspec initiative create`

Cria uma iniciativa em uma loja de contexto.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--store <id>` | ID da loja de contexto do registro local |
| `--store-path <path>` | Raiz existente da loja de contexto local |
| `--title <title>` | Título da iniciativa |
| `--summary <summary>` | Resumo da iniciativa |
| `--json` | Saída em JSON |

### `openspec initiative list`

Lista iniciativas. Sem um seletor, isso pesquisa todas as lojas de contexto registradas e relata avisos de leitura parcial em `status`.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--store <id>` | Lista uma loja de contexto registrada |
| `--store-path <path>` | Lista uma raiz de loja de contexto local existente |
| `--json` | Saída em JSON |

### `openspec initiative show`

Resolve uma iniciativa e imprime sua localização canônica.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

Sem `--store`, o OpenSpec pesquisa lojas de contexto registradas. Se a mesma ID de iniciativa existir em múltiplas lojas, passe `--store <id>` ou use o formato `<store>/<id>`.

---

## Comandos de Navegação

### `openspec list`

Lista alterações ou especificações no seu projeto.

```
openspec list [opções]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--specs` | Lista especificações em vez de alterações |
| `--changes` | Lista alterações (padrão) |
| `--sort <ordem>` | Ordena por `recent` (padrão) ou `name` |
| `--json` | Saída como JSON |

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
  add-dark-mode     Suporte a troca de tema da UI
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
openspec show [nome-do-item] [opções]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `nome-do-item` | Não | Nome da alteração ou especificação (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--type <tipo>` | Especifica o tipo: `change` ou `spec` (detectado automaticamente se não ambíguo) |
| `--json` | Saída como JSON |
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

# Mostra uma alteração específica
openspec show add-dark-mode

# Mostra uma especificação específica
openspec show auth --type spec

# Saída JSON para análise
openspec show add-dark-mode --json
```

---

## Comandos de Validação

### `openspec validate`

Valida alterações e especificações em busca de problemas estruturais.

```
openspec validate [nome-do-item] [opções]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `nome-do-item` | Não | Item específico a ser validado (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--all` | Valida todas as alterações e especificações |
| `--changes` | Valida todas as alterações |
| `--specs` | Valida todas as especificações |
| `--type <tipo>` | Especifica o tipo quando o nome é ambíguo: `change` ou `spec` |
| `--strict` | Ativa o modo de validação estrita |
| `--json` | Saída como JSON |
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
  ⚠ design.md: seção "Abordagem Técnica" ausente

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
        "warnings": ["design.md: seção 'Abordagem Técnica' ausente"]
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

Arquiva uma alteração concluída e mescla especificações delta nas especificações principais.

```
openspec archive [nome-da-alteração] [opções]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `nome-da-alteração` | Não | Alteração a ser arquivada (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `-y, --yes` | Pula prompts de confirmação |
| `--skip-specs` | Pula atualizações de especificação (para alterações apenas de infraestrutura/ferramentas/documentação) |
| `--no-validate` | Pula validação (requer confirmação) |

**Exemplos:**

```bash
# Arquivo interativo
openspec archive

# Arquiva alteração específica
openspec archive add-dark-mode

# Arquiva sem prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Arquiva uma alteração de ferramentas que não afeta especificações
openspec archive update-ci-config --skip-specs
```

**O que faz:**

1. Valida a alteração (exceto se `--no-validate`)
2. Solicita confirmação (exceto se `--yes`)
3. Mescla especificações delta em `openspec/specs/`
4. Move a pasta da alteração para `openspec/changes/archive/YYYY-MM-DD-<nome>/`

---

## Comandos de Fluxo de Trabalho

Esses comandos suportam o fluxo de trabalho OPSX orientado a artefatos. São úteis tanto para humanos verificando progresso quanto para agentes determinando as próximas etapas.

### `openspec new change`

Cria um diretório de alteração local no repositório e opcionalmente metadados confirmados.

```bash
openspec new change <nome> [opções]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--description <texto>` | Descrição a ser adicionada ao `README.md` |
| `--goal <texto>` | Meta do produto do workspace para armazenar com a alteração |
| `--areas <nomes>` | Nomes dos links do workspace afetados, separados por vírgula |
| `--initiative <id>` | Vincula a alteração local do repositório a uma iniciativa |
| `--store <id>` | ID do armazenamento de contexto para `--initiative` |
| `--store-path <caminho>` | Raiz existente do armazenamento de contexto local para `--initiative` |
| `--schema <nome>` | Esquema de fluxo de trabalho a ser usado |
| `--json` | Saída JSON |

Exemplos:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

Atualiza metadados confirmados da alteração local do repositório sem recriar a alteração.

```bash
openspec set change <nome> [opções]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--initiative <id>` | Vincula a alteração local do repositório a uma iniciativa |
| `--store <id>` | ID do armazenamento de contexto para `--initiative` |
| `--store-path <caminho>` | Raiz existente do armazenamento de contexto local para `--initiative` |
| `--json` | Saída JSON |

`set change --initiative` é idempotente quando o vínculo solicitado já existe e recusa substituir um vínculo de iniciativa existente diferente.

### `openspec status`

Exibe o status de conclusão dos artefatos de uma alteração.

```
openspec status [opções]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--change <id>` | Nome da alteração (solicita se omitido) |
| `--schema <nome>` | Substituição de esquema (detectado automaticamente a partir da configuração da alteração) |
| `--json` | Saída como JSON |

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
Alteração: add-dark-mode
Esquema: spec-driven
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

Obtém instruções enriquecidas para criar um artefato ou aplicar tarefas. Usado por agentes de IA para entender o que criar a seguir.

```
openspec instructions [artefato] [opções]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `artefato` | Não | ID do artefato: `proposal`, `specs`, `design`, `tasks` ou `apply` |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--change <id>` | Nome da alteração (obrigatório no modo não interativo) |
| `--schema <nome>` | Substituição de esquema |
| `--json` | Saída como JSON |

**Caso especial:** Use `apply` como artefato para obter instruções de implementação de tarefas.

**Exemplos:**

```bash
# Obtém instruções para o próximo artefato
openspec instructions --change add-dark-mode

# Obtém instruções para artefato específico
openspec instructions design --change add-dark-mode

# Obtém instruções de aplicação/implementação
openspec instructions apply --change add-dark-mode

# JSON para consumo por agentes
openspec instructions design --change add-dark-mode --json
```

**A saída inclui:**

- Conteúdo do modelo para o artefato
- Contexto do projeto a partir da configuração
- Conteúdo dos artefatos dependentes
- Regras por artefato a partir da configuração

---

### `openspec templates`

Mostra os caminhos dos modelos resolvidos para todos os artefatos em um esquema.

```
openspec templates [opções]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--schema <nome>` | Esquema a ser inspecionado (padrão: `spec-driven`) |
| `--json` | Saída como JSON |

**Exemplos:**

```bash
# Mostra caminhos dos modelos para o esquema padrão
openspec templates

# Mostra modelos para esquema personalizado
openspec templates --schema my-workflow

# JSON para uso programático
openspec templates --json
```

**Saída (texto):**

```
Esquema: spec-driven

Modelos:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Lista os esquemas de fluxo de trabalho disponíveis com suas descrições e fluxos de artefatos.

```
openspec schemas [opções]
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
Esquemas disponíveis:

  spec-driven (pacote)
    O fluxo de trabalho padrão orientado a especificações
    Fluxo: proposal → specs → design → tasks

  my-custom (projeto)
    Fluxo de trabalho personalizado para este projeto
    Fluxo: research → proposal → tasks
```

---

## Comandos de Schema

Comandos para criar e gerenciar schemas de workflow personalizados.

### `openspec schema init`

Cria um novo schema local do projeto.

```
openspec schema init <nome> [opções]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `nome` | Sim | Nome do schema (kebab-case) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--description <texto>` | Descrição do schema |
| `--artifacts <lista>` | IDs de artefatos separados por vírgula (padrão: `proposal,specs,design,tasks`) |
| `--default` | Definir como schema padrão do projeto |
| `--no-default` | Não solicitar definição como padrão |
| `--force` | Sobrescrever schema existente |
| `--json` | Saída como JSON |

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
openspec/schemas/<nome>/
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
openspec schema fork <fonte> [nome] [opções]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `fonte` | Sim | Schema a ser copiado |
| `nome` | Não | Nome do novo schema (padrão: `<fonte>-custom`) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--force` | Sobrescrever destino existente |
| `--json` | Saída como JSON |

**Exemplo:**

```bash
# Faz um fork do schema spec-driven integrado
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valida a estrutura e os modelos de um schema.

```
openspec schema validate [nome] [opções]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `nome` | Não | Schema a ser validado (valida todos se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--verbose` | Mostrar etapas detalhadas da validação |
| `--json` | Saída como JSON |

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
openspec schema which [nome] [opções]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `nome` | Não | Nome do schema |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--all` | Listar todos os schemas com suas fontes |
| `--json` | Saída como JSON |

**Exemplo:**

```bash
# Verificar de onde um schema vem
openspec schema which spec-driven
```

**Saída:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedência de schemas:**

1. Projeto: `openspec/schemas/<nome>/`
2. Usuário: `~/.local/share/openspec/schemas/<nome>/`
3. Pacote: Schemas integrados

---

## Comandos de Configuração

### `openspec config`

Visualiza e modifica a configuração global do OpenSpec.

```
openspec config <subcomando> [opções]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-------------|
| `path` | Mostrar localização do arquivo de configuração |
| `list` | Mostrar todas as configurações atuais |
| `get <chave>` | Obter um valor específico |
| `set <chave> <valor>` | Definir um valor |
| `unset <chave>` | Remover uma chave |
| `reset` | Restaurar para os padrões |
| `edit` | Abrir no `$EDITOR` |
| `profile [predefinição]` | Configurar perfil de workflow interativamente ou via predefinição |

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

# Predefinição rápida: mudar workflows para core (mantém modo de entrega)
openspec config profile core
```

`openspec config profile` começa com um resumo do estado atual e permite escolher:
- Alterar entrega + workflows
- Alterar somente a entrega
- Alterar somente os workflows
- Manter configurações atuais (sair)

Se você mantiver as configurações atuais, nenhuma alteração é gravada e nenhuma solicitação de atualização é exibida.
Se não houver alterações de configuração, mas os arquivos do projeto ou workspace atual estiverem desatualizados em relação ao seu perfil/entrega global, o OpenSpec mostrará um aviso e sugerirá `openspec update` para projetos locais ao repositório ou `openspec workspace update` para orientação e habilidades locais ao workspace.
Pressionar `Ctrl+C` também cancela o fluxo de forma limpa (sem rastreamento de pilha) e encerra com o código `130`.
Na lista de workflows, `[x]` significa que o workflow está selecionado na configuração global. Para aplicar essas seleções aos arquivos do projeto, execute `openspec update` (ou escolha `Apply changes to this project now?` quando solicitado dentro de um projeto). De dentro de um workspace, use `openspec workspace update` para atualizar a orientação e habilidades locais do workspace; isso permanece apenas para habilidades em arquivos de workflow de agente gerados e não gera comandos de barra do workspace.

**Exemplos interativos:**

```bash
# Atualização somente de entrega
openspec config profile
# escolher: Alterar somente a entrega
# escolher entrega: Apenas habilidades

# Atualização somente de workflows
openspec config profile
# escolher: Alterar somente os workflows
# alternar workflows na lista, depois confirmar
```

---

## Comandos Utilitários

### `openspec feedback`

Enviar feedback sobre o OpenSpec. Cria uma issue no GitHub.

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
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Gerencia auto-completar de shell para o CLI do OpenSpec.

```
openspec completion <subcomando> [shell]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-------------|
| `generate [shell]` | Gerar script de auto-completar para saída padrão |
| `install [shell]` | Instalar auto-completar para seu shell |
| `uninstall [shell]` | Remover auto-completar instalado |

**Shells suportados:** `bash`, `zsh`, `fish`, `powershell`

**Exemplos:**

```bash
# Instalar auto-completar (detecta shell automaticamente)
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
| `OPENSPEC_TELEMETRY` | Definir como `0` para desativar telemetria |
| `DO_NOT_TRACK` | Definir como `1` para desativar telemetria (sinal DNT padrão) |
| `OPENSPEC_CONCURRENCY` | Concorrência padrão para validação em lote (padrão: 6) |
| `EDITOR` ou `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Desativar saída colorida quando definido |

---

## Documentação Relacionada

- [Comandos](commands.md) - Comandos de barra AI (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](workflows.md) - Padrões comuns e quando usar cada comando
- [Personalização](customization.md) - Criar schemas e modelos personalizados
- [Primeiros Passos](getting-started.md) - Guia de configuração inicial