# Referência da CLI

A CLI do OpenSpec (`openspec`) fornece comandos de terminal para configuração de projeto, validação, inspeção de status e gerenciamento. Esses comandos complementam os comandos de barra de IA (como `/opsx:propose`) documentados em [Commands](commands.md).

## Resumo

| Categoria | Comandos | Finalidade |
|----------|----------|---------|
| **Configuração** | `init`, `update` | Inicialize e atualize o OpenSpec no seu projeto |
| **Stores (repos OpenSpec independentes)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Gerencie stores — repositórios OpenSpec independentes que você registrou |
| **Saúde** | `doctor` | Relatar a saúde das relações para a raiz resolvida |
| **Contexto de trabalho** | `context` | Montar o conjunto de trabalho (raiz + stores referenciadas) |
| **Conjuntos de trabalho pessoais** | `workset create`, `workset list`, `workset open`, `workset remove` | Mantenha e abra visualizações de trabalho pessoais e locais na sua ferramenta |
| **Navegação** | `list`, `view`, `show` | Explore alterações e especificações |
| **Validação** | `validate` | Verifique alterações e especificações em busca de problemas |
| **Ciclo de vida** | `archive` | Finalize alterações concluídas |
| **Fluxo de trabalho** | `new change`, `status`, `instructions`, `templates`, `schemas` | Suporte a fluxo de trabalho orientado a artefatos |
| **Esquemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Crie e gerencie fluxos de trabalho personalizados |
| **Configuração** | `config` | Visualize e modifique configurações |
| **Utilitários** | `feedback`, `completion` | Feedback e integração com o shell |

## Comandos Humanos vs. Agente

A maioria dos comandos CLI é projetada para **uso humano** em um terminal. Alguns comandos também suportam **uso por agente/script** via saída JSON.

### Comandos Apenas para Humanos

Estes comandos são interativos e projetados para uso em terminal:

| Comando | Propósito |
|---------|-----------|
| `openspec init` | Inicializar projeto (prompts interativos) |
| `openspec view` | Painel interativo |
| `openspec workset open <name>` | Abrir um workset salvo (janela do editor ou sessão de agente no terminal) |
| `openspec config edit` | Abrir configuração no editor |
| `openspec feedback` | Enviar feedback via GitHub |
| `openspec completion install` | Instalar conclusões de shell |

### Comandos Compatíveis com Agente

Estes comandos suportam saída `--json` para uso programático por agentes de IA e scripts:

| Comando | Uso Humano | Uso por Agente |
|---------|-----------|----------------|
| `openspec list` | Navegar por alterações/especificações | `--json` para dados estruturados |
| `openspec show <item>` | Ler conteúdo | `--json` para parsing |
| `openspec validate` | Verificar problemas | `--all --json` para validação em massa |
| `openspec status` | Ver progresso do artefato | `--json` para status estruturado |
| `openspec instructions` | Obter próximos passos | `--json` para instruções de agente |
| `openspec templates` | Encontrar caminhos de templates | `--json` para resolução de caminhos |
| `openspec schemas` | Listar schemas disponíveis | `--json` para descoberta de schemas |
| `openspec store setup <id>` | Criar e registrar um armazenamento local | `--json` com entradas explícitas para saída de configuração estruturada |
| `openspec store register <path>` | Registrar um armazenamento existente | `--json` para saída de registro estruturada |
| `openspec store unregister <id>` | Esquecer um registro de armazenamento local | `--json` para saída de limpeza estruturada |
| `openspec store remove <id>` | Excluir uma pasta de armazenamento local registrada | `--yes --json` para exclusão não interativa |
| `openspec store list` | Navegar por armazenamentos registrados | `--json` para registros estruturados |
| `openspec store doctor` | Verificar configuração do armazenamento local | `--json` para diagnósticos estruturados |
| `openspec new change <id>` | Criar estrutura de alteração local do repositório | `--json`, além de `--store <id>` para usar um armazenamento registrado como raiz do OpenSpec |
| `openspec workset create [name]` | Compor uma visualização de trabalho pessoal | `--member <path> --json` para composição não interativa |
| `openspec workset list` | Navegar por worksets salvos | `--json` para visualizações estruturadas |
| `openspec workset remove <name>` | Excluir uma visualização salva | `--yes --json` para remoção não interativa |

---

## Opções Globais

Estas opções funcionam com todos os comandos:

| Opção | Descrição |
|-------|-----------|
| `--version`, `-V` | Mostrar número da versão |
| `--no-color` | Desabilitar saída colorida |
| `--help`, `-h` | Exibir ajuda do comando |

---

## Comandos de Configuração

### `openspec init`

Inicialize o OpenSpec em seu projeto. Cria a estrutura de pastas e configura as integrações com ferramentas de IA.

O comportamento padrão usa as configurações globais padrão: perfil `core`, entrega `both`, fluxos de trabalho `propose, explore, apply, sync, archive`.

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
| `--force` | Limpeza automática de arquivos legados sem confirmação |
| `--profile <profile>` | Sobrescrever o perfil global para esta execução de init (`core` ou `custom`) |

`--profile custom` usa quaisquer fluxos de trabalho atualmente selecionados na configuração global (`openspec config profile`).

**IDs de ferramentas suportadas (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> Esta lista espelha `AI_TOOLS` em `src/core/config.ts`. Veja [Ferramentas Suportadas](supported-tools.md) para a habilidade e caminhos de comando de cada ferramenta.

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
.cursor/commands/       # Comandos Cursor OPSX (se a entrega incluir comandos)
... (outras configurações de ferramentas)
```

---

### `openspec update`

Atualize os arquivos de instrução do OpenSpec após atualizar o CLI. Regera os arquivos de configuração de ferramentas de IA usando seu perfil global atual, fluxos de trabalho selecionados e modo de entrega.

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
| `--force` | Forçar atualização mesmo quando os arquivos estão atualizados |

**Exemplo:**

```bash
# Atualizar arquivos de instrução após atualização do npm
npm update @fission-ai/openspec
openspec update
```

---

## Armazenamentos (repositórios OpenSpec independentes)

> **Beta.** Armazenamentos e os recursos construídos sobre eles (referências, contexto de trabalho, worksets) são novos; nomes de comandos, flags, formatos de arquivo e saída JSON podem mudar entre lançamentos. Para o passo a passo focado no problema, veja o [guia de armazenamentos](stores-beta/user-guide.md).

Um armazenamento é um repositório OpenSpec independente que você registrou nesta máquina — por exemplo, um repositório de planejamento ou um repositório de contratos. Registrar um armazenamento permite que comandos normais (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) atuem nele de qualquer lugar passando `--store <id>`.

### `openspec store setup`

Criar e registrar um armazenamento local. Sem argumentos em um terminal, o OpenSpec guia o usuário pela configuração. Agentes e scripts devem passar entradas explícitas e usar `--json`.

```bash
openspec store setup [id] [options]
```

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--path <path>` | Pasta onde o armazenamento deve residir (por exemplo `~/openspec/<id>`) |
| `--remote <url>` | Registrar o remoto canônico no `store.yaml` do novo armazenamento |
| `--init-git` | Inicializar um repositório Git com um commit inicial (padrão) |
| `--no-init-git` | Ignorar todas as ações Git: sem init, sem commit inicial |
| `--json` | Saída JSON |

Execuções não interativas (`--json`, scripts, agentes) devem passar tanto o id do armazenamento quanto `--path`. Em um terminal interativo, a configuração solicita a localização com uma sugestão editável em um lugar visível e pertencente ao usuário (por exemplo `~/openspec/<id>`); ela nunca usa como padrão o diretório de dados gerenciado pelo OpenSpec.

Exemplos:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registrar uma pasta de armazenamento local existente. Durante o beta dos armazenamentos, uma raiz pode ser registrada antes que quaisquer alterações existam, especificações tenham sido aplicadas ou alterações tenham sido arquivadas; nesse caso, `openspec/changes/`, `openspec/specs/`, e `openspec/changes/archive/` podem estar ausentes até que comandos normais as criem. Um repositório apenas de configuração que declara `store: <id>` permanece como um ponteiro para outro armazenamento e não é registrado como uma raiz de armazenamento a menos que esse ponteiro seja removido.

```bash
openspec store register [path] [options]
```

**Opções:**

| Opção | Descrição |
|-------|-----------|
| `--id <id>` | ID do armazenamento; padrão para metadados do armazenamento ou nome da pasta |
| `--yes` | Confirmar criação de metadados de identidade do armazenamento para uma raiz OpenSpec saudável |
| `--json` | Saída JSON |

### `openspec store unregister`

Esquecer um registro de armazenamento local sem excluir arquivos.

```bash
openspec store unregister <id> [--json]
```

Use isso quando um armazenamento foi movido, clonado em outro lugar, ou não deve mais ser exibido pelo OpenSpec nesta máquina.

### `openspec store remove`

Esquecer um registro de armazenamento local e excluir sua pasta local.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` mostra a pasta exata antes de excluir em um terminal interativo. Agentes, scripts e chamadores JSON devem passar `--yes` para confirmar a exclusão. O OpenSpec se recusa a excluir uma pasta que não contém metadados de armazenamento correspondentes.

### `openspec store list`

Listar armazenamentos registrados localmente.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Verificar registro de armazenamento local, metadados e presença do Git.

```bash
openspec store doctor [id] [--json]
```

Doctor é apenas diagnóstico; ele relata raízes ausentes, incompatibilidades de metadados e estado de registro local inválido sem modificar o armazenamento.

### Referenciando armazenamentos a partir de um projeto

Um repositório de projeto pode declarar em `openspec/config.yaml` de quais armazenamentos seu trabalho depende:

```yaml
schema: spec-driven
references:
  - team-context
```

A partir de então, a saída de `openspec instructions` nesse repositório (tanto as superfícies por artefato quanto `apply`, modos JSON e humano) carrega um índice das especificações de cada armazenamento referenciado — ids de especificação, um resumo de uma linha da seção Purpose de cada especificação, e o comando de busca (`openspec show <spec-id> --type spec --store <id>`). O índice é construído em tempo real a partir do checkout registrado em cada execução; o conteúdo da especificação nunca é copiado para a saída.

Referências são contexto apenas de leitura. Elas nunca mudam onde os comandos atuam: o trabalho permanece na raiz própria do repositório, e escrever em um armazenamento referenciado permanece como uma ação `--store` explícita. Uma referência que não pode ser resolvida (por exemplo, um armazenamento não registrado nesta máquina) se degrada para um aviso no índice com a correção exata, e as instruções ainda são geradas. `openspec doctor` relata a saúde das referências em um só lugar.

### Registrando de onde um armazenamento é clonado

Um armazenamento pode registrar sua fonte de clone canônica em seu arquivo de identidade commitado, para que o onboarding nunca termine em um beco sem saída em "registrar o armazenamento":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

O remoto é registrado em `.openspec-store/store.yaml` dentro do commit inicial, para que cada clone já nasça sabendo disso. Para um armazenamento existente, edite `store.yaml` manualmente e commit. `store doctor` mostra o remoto registrado (e a origem Git observada do checkout); a orientação de compartilhamento de setup/register o nomeia; e register registra a origem do checkout no registro local da máquina.

Uma declaração de referência também pode carregar a fonte de clone, para que um colega de equipe que ainda não tenha o armazenamento receba uma correção completa e colável (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Registrar um remoto não é sincronização: o OpenSpec nunca clona, puxa ou envia por conta própria.

### Declarando um armazenamento padrão

Um repositório cujo planejamento é totalmente externalizado — sem `openspec/specs/` ou `openspec/changes/` locais — pode declarar seu armazenamento uma vez em vez de passar `--store` em cada comando:

```yaml
# openspec/config.yaml (o único arquivo sob openspec/)
store: team-context
```

Comandos normais então resolvem para o armazenamento declarado automaticamente; o banner raiz e o bloco JSON `root` relatam `source: "declared"` com o id do armazenamento, e as dicas impressas ainda carregam `--store <id>`. A declaração é um fallback, nunca uma substituição: `--store` explícito sempre ganha, e um diretório com pastas de planejamento reais ignora o ponteiro (com um aviso). Para converter um repositório ponteiro em uma raiz OpenSpec local, remova a linha `store:` e execute `openspec init` — init se recusa a criar a estrutura enquanto a declaração estiver presente.

Uma variante em nível de máquina cobre todos os repositórios de uma vez: `openspec config set defaultStore <id>` (veja Configuração). Ela é consultada apenas depois que `--store`, uma raiz local e um ponteiro de projeto falharam todos em resolver; o banner raiz e o bloco JSON `root` então relatam `source: "global_default"`.

## Doctor (saúde dos relacionamentos)

Uma pergunta de apenas leitura, um único local: a raiz do OpenSpec está saudável e as lojas que ela referencia estão disponíveis nesta máquina?

```bash
openspec doctor [--store <id>] [--json]
```

O relatório separa a saúde da raiz, a saúde dos metadados das lojas (incluindo uma observação quando o remoto registrado e a origem do checkout divergem, e uma observação quando o checkout da loja ficou para trás em relação à sua referência de rastreamento de upstream mais recentemente buscada) e a saúde das referências (as mesmas instruções de diagnóstico exibidas, com correções de clone para referências não resolvidas). Achados de saúde de qualquer severidade saem com código 0 — os agentes leem os arrays `status`; apenas falhas de comando (nenhuma raiz, loja desconhecida) saem com código 1. O Doctor nunca clona, sincroniza ou repara. Para obter o próprio conjunto montado em vez de sua saúde, use `openspec context`.

## Contexto de trabalho (o conjunto montado)

Tudo com que este trabalho se relaciona por meio de declarações OpenSpec, em um único conjunto de trabalho: a raiz do OpenSpec e as lojas que ela referencia.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

O resumo JSON é consumível por agentes (cada loja referenciada disponível carrega sua receita de busca; membros não resolvidos trazem as mesmas instruções de correção exibidas pelo comando `doctor`). A opção `--code-workspace` adicionalmente grava um arquivo de workspace do VS Code contendo a raiz, além das lojas referenciadas disponíveis (pastas `ref:<id>`) — a única operação de escrita realizada por este comando, que é recusada sem a opção `--force` caso o arquivo já exista. Membros indisponíveis são relatados, nunca presumidos.

"Contexto de trabalho" é o conjunto montado; o campo `context:` no arquivo `openspec/config.yaml` é o contexto de projeto injetado nas instruções — duas coisas diferentes. O comando `openspec doctor` responde se o conjunto está saudável; o comando `openspec context` responde qual é o conjunto.

## Conjuntos de trabalho pessoais

> **Beta.** Os worksets fazem parte da nova superfície beta; comandos, sinalizadores e formatos de arquivo podem mudar entre versões. Para um passo a passo, consulte o [guia de lojas](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Um conjunto de trabalho é uma visualização pessoal e nomeada das pastas nas quais você trabalha em conjunto — uma raiz de planejamento mais qualquer outra coisa que você escolher — mantida em sua máquina e reaberta pelo nome em sua ferramenta. É puramente local: nunca é commitado, nunca compartilhado, nunca derivado de declarações e remover um nunca afeta uma pasta membro.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` executa um fluxo guiado curto (ou aceita sinalizadores `--member` de forma não interativa; o primeiro membro é o primário — as sessões começam lá). `open` inicia a ferramenta escolhida: editores (VS Code, Cursor) abrem uma janela com todos os membros e retornam; agentes CLI (Claude Code, codex) assumem este terminal como uma sessão com todos os membros anexados e nenhum prompt pré-preenchido, terminando quando você sair. Uma pasta membro ausente no momento da abertura é ignorada com uma nota; o resto é aberto. A preferência de ferramenta salva é sobrescrevível por abertura com `--tool`.

Suportar uma nova ferramenta é configuração, não código. Cada ferramenta é um de dois estilos de lançamento — `workspace-file` (lançado com o `.code-workspace` gerado) ou `attach-dirs` (um sinalizador de anexação por membro) — e a chave `openers` no `config.json` global (abra-o com `openspec config edit`) adiciona ferramentas ou ajusta as integradas por campo:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Todo o estado do conjunto de trabalho reside na pasta `worksets/` do diretório de dados global (as visualizações salvas mais os arquivos `<name>.code-workspace` gerados, regenerados a cada abertura); excluir essa pasta remove todos os vestígios.

---

## Comandos de Navegação

### `openspec list`

Lista alterações ou especificações em seu projeto.

```
openspec list [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--specs` | Lista especificações em vez de alterações |
| `--changes` | Lista alterações (padrão) |
| `--sort <order>` | Ordena por `recent` (padrão) ou `name` |
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
Alterações:
  add-dark-mode     Sem tarefas      agora mesmo
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
| `item-name` | Não | Nome da alteração ou especificação (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--type <type>` | Especifica o tipo: `change` ou `spec` (detectado automaticamente se não ambíguo) |
| `--json` | Saída como JSON |
| `--no-interactive` | Desativa prompts |

**Opções específicas de alteração:**

| Opção | Descrição |
|--------|-------------|
| `--deltas-only` | Mostra apenas especificações delta (modo JSON) |

**Opções específicas de especificação:**

| Opção | Descrição |
|--------|-------------|
| `--requirements` | Mostra apenas requisitos, exclui cenários (modo JSON) |
| `--no-scenarios` | Exclui conteúdo de cenário (modo JSON) |
| `-r, --requirement <id>` | Mostra requisito específico por índice baseado em 1 (modo JSON) |

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

Valida alterações e especificações quanto a problemas estruturais.

```
openspec validate [item-name] [options]
```

Uma alteração com zero deltas de especificação falha na validação, a menos que seu `.openspec.yaml` declare `skip_specs: true` (para refatorações puras, ferramentas ou trabalho de documentação — consulte a [Receita 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)).

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `item-name` | Não | Item específico para validar (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--all` | Valida todas as alterações e especificações |
| `--changes` | Valida todas as alterações |
| `--specs` | Valida todas as especificações |
| `--type <type>` | Especifica o tipo quando o nome é ambíguo: `change` ou `spec` |
| `--strict` | Habilita o modo de validação estrito |
| `--json` | Saída como JSON |
| `--concurrency <n>` | Validações paralelas máximas (padrão: 6, ou variável de ambiente `OPENSPEC_CONCURRENCY`) |
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

Arquiva uma alteração concluída e mescla especificações delta nas especificações principais.

```
openspec archive [change-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Alteração para arquivar (solicita se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `-y, --yes` | Ignora prompts de confirmação |
| `--skip-specs` | Ignora atualizações de especificações para uma execução de arquivamento. Uma alteração que permanentemente não tem deltas de especificação deve declarar `skip_specs: true` em seu `.openspec.yaml` em vez disso — ela é arquivada sem sinalizador |
| `--no-validate` | Ignora validação (requer confirmação) |

**Exemplos:**

```bash
# Arquivamento interativo
openspec archive

# Arquiva alteração específica
openspec archive add-dark-mode

# Arquiva sem prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Arquiva uma alteração de ferramenta que não afeta especificações
openspec archive update-ci-config --skip-specs
```

**O que faz:**

1. Valida a alteração (a menos que `--no-validate`)
2. Solicita confirmação (a menos que `--yes`)
3. Mescla especificações delta em `openspec/specs/`
4. Move a pasta da alteração para `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandos de Fluxo de Trabalho

Esses comandos suportam o fluxo de trabalho OPSX orientado a artefatos. Eles são úteis tanto para humanos verificando o progresso quanto para agentes determinando os próximos passos.

### `openspec new change`

Cria um diretório de alteração e metadados commitados opcionais na raiz OpenSpec resolvida.

```bash
openspec new change <name> [options]
```

Os nomes de alteração devem usar kebab-case em letras minúsculas. Eles começam com uma letra minúscula,
depois contêm letras minúsculas, números e hífens simples. Eles não podem começar
com um número, conter espaços, sublinhados, letras maiúsculas, hífens consecutivos
ou hífens iniciais/finais. Ao incluir um ID de ticket externo,
prefixe-o com uma palavra, por exemplo `ticket-123-add-notifications` em vez de
`123-add-notifications`.

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--description <text>` | Descrição para adicionar ao `index.md` |
| `--goal <text>` | Metadados de objetivo opcionais para armazenar com a alteração |
| `--schema <name>` | Esquema de fluxo de trabalho a ser usado |
| `--store <id>` | ID da loja para usar como raiz OpenSpec (uma loja é um repositório OpenSpec autônomo que você registrou) |
| `--json` | Saída JSON |

Exemplos:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Exibe o status de conclusão de artefatos para uma alteração.

```
openspec status [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--change <id>` | Nome da alteração (solicita se omitido) |
| `--schema <name>` | Substituição de esquema (detectado automaticamente a partir da configuração da alteração) |
| `--json` | Saída como JSON |

**Exemplos:**

```bash
# Verificação de status interativa
openspec status

# Status para alteração específica
openspec status --change add-dark-mode

# JSON para uso de agente
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

Uma alteração que declara `skip_specs: true` mostra seu estágio de specs como `[~] specs (skipped: change declares skip_specs)` e o exclui da contagem de progresso.

**Saída (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
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
| `--change <id>` | Nome da alteração (obrigatório no modo não interativo) |
| `--schema <name>` | Substituição de esquema |
| `--json` | Saída como JSON |

**Caso especial:** Use `apply` como o artefato para obter instruções de implementação de tarefas.

**Exemplos:**

```bash
# Obtém instruções para o próximo artefato
openspec instructions --change add-dark-mode

# Obtém instruções para um artefato específico
openspec instructions design --change add-dark-mode

# Obtém instruções de apply/implementação
openspec instructions apply --change add-dark-mode

# JSON para consumo de agente
openspec instructions design --change add-dark-mode --json
```

**A saída inclui:**

- Conteúdo do modelo para o artefato
- Contexto do projeto a partir da configuração
- Conteúdo de artefatos dependentes
- Regras por artefato a partir da configuração

Para um artefato ignorado via `skip_specs: true`, a saída é apenas um aviso (JSON adiciona campos `skipped`/`warning`) — o artefato não deve ser criado.

---

### `openspec templates`

Mostra caminhos de modelo resolvidos para todos os artefatos em um esquema.

```
openspec templates [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--schema <name>` | Esquema para inspecionar (padrão: `spec-driven`) |
| `--json` | Saída como JSON |

**Exemplos:**

```bash
# Mostra caminhos de modelo para o esquema padrão
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

Lista esquemas de fluxo de trabalho disponíveis com suas descrições e fluxos de artefatos.

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
Esquemas disponíveis:

  spec-driven (pacote)
    O fluxo de trabalho de desenvolvimento orientado a especificações padrão
    Fluxo: proposal → specs → design → tasks

  my-custom (projeto)
    Fluxo de trabalho personalizado para este projeto
    Fluxo: research → proposal → tasks
```

## Comandos de Esquema

Comandos para criar e gerenciar esquemas de fluxo de trabalho personalizados.

### `openspec schema init`

Criar um novo esquema local do projeto.

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
| `--artifacts <list>` | IDs de artefatos separados por vírgula (padrão: `proposal,specs,design,tasks`) |
| `--default` | Definir como esquema padrão do projeto |
| `--no-default` | Não solicitar para definir como padrão |
| `--force` | Sobrescrever esquema existente |
| `--json` | Saída em JSON |

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
    ├── proposal.md       # Modelo para cada artefato
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Copiar um esquema existente para o seu projeto para personalização.

```
openspec schema fork <source> [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `source` | Sim | Esquema a ser copiado |
| `name` | Não | Novo nome do esquema (padrão: `<source>-custom`) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--force` | Sobrescrever destino existente |
| `--json` | Saída em JSON |

**Exemplo:**

```bash
# Bifurcar o esquema orientado a especificações integrado
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Validar a estrutura e modelos de um esquema.

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
| `--verbose` | Mostrar etapas de validação detalhadas |
| `--json` | Saída em JSON |

**Exemplo:**

```bash
# Validar um esquema específico
openspec schema validate my-workflow

# Validar todos os esquemas
openspec schema validate
```

---

### `openspec schema which`

Mostrar de onde um esquema é resolvido (útil para depurar precedência).

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
| `--all` | Listar todos os esquemas com suas fontes |
| `--json` | Saída em JSON |

**Exemplo:**

```bash
# Verificar de onde vem um esquema
openspec schema which spec-driven
```

**Saída:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedência de esquemas:**

1. Projeto: `openspec/schemas/<name>/`
2. Usuário: `~/.local/share/openspec/schemas/<name>/`
3. Pacote: Esquemas integrados

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
| `reset` | Redefinir para padrões |
| `edit` | Abrir no `$EDITOR` |
| `profile [preset]` | Configurar perfil de fluxo de trabalho interativamente ou via predefinição |

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

# Definir um valor de string explicitamente
openspec config set user.name "My Name" --string

# Remover uma configuração personalizada
openspec config unset user.name

# Definir armazenamento padrão em nível de máquina (raiz de fallback quando não há --store, raiz local ou armazenamento do projeto: o ponteiro é resolvido)
openspec config set defaultStore team-plans

# Redefinir toda a configuração
openspec config reset --all --yes

# Editar configuração no seu editor
openspec config edit

# Configurar perfil com assistente baseado em ações
openspec config profile

# Predefinição rápida: alternar fluxos de trabalho para core (mantém o modo de entrega)
openspec config profile core
```

`openspec config profile` começa com um resumo do estado atual, depois permite que você escolha:
- Alterar entrega + fluxos de trabalho
- Alterar apenas entrega
- Alterar apenas fluxos de trabalho
- Manter configurações atuais (sair)

Se você manter as configurações atuais, nenhuma alteração é salva e nenhuma solicitação de atualização é exibida.
Se não houver alterações de configuração, mas os arquivos do projeto atual estiverem dessincronizados com seu perfil/entrega global, o OpenSpec exibirá um aviso e sugerirá `openspec update`.
Pressionar `Ctrl+C` também cancela o fluxo de forma limpa (sem rastreamento de pilha) e sai com o código `130`.
Na lista de verificação de fluxo de trabalho, `[x]` significa que o fluxo de trabalho está selecionado na configuração global. Para aplicar essas seleções aos arquivos do projeto, execute `openspec update` (ou escolha `Apply changes to this project now?` quando solicitado dentro de um projeto).

**Exemplos interativos:**

```bash
# Atualização apenas de entrega
openspec config profile
# escolha: Alterar apenas entrega
# escolha entrega: Apenas Skills

# Atualização apenas de fluxos de trabalho
openspec config profile
# escolha: Alterar apenas fluxos de trabalho
# alterne os fluxos de trabalho na lista de verificação, depois confirme
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

**Requisitos:** A CLI do GitHub (`gh`) deve estar instalada e autenticada.

**Exemplo:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Gerenciar conclusões de shell para a CLI do OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-------------|
| `generate [shell]` | Saída do script de conclusão para stdout |
| `install [shell]` | Instalar conclusão para o seu shell |
| `uninstall [shell]` | Remover conclusões instaladas |

**Shells suportados:** `bash`, `zsh`, `fish`, `powershell`

**Exemplos:**

```bash
# Instalar conclusões (detecta shell automaticamente)
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
| `OPENSPEC_CONCURRENCY` | Concorrência padrão para validação em massa (padrão: 6) |
| `EDITOR` ou `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Desativar saída colorida quando definida |

---

## Documentação Relacionada

- [Comandos](commands.md) - Comandos de barra AI (`/opsx:propose`, `/opsx:apply`, etc.)
- [Fluxos de Trabalho](workflows.md) - Padrões comuns e quando usar cada comando
- [Personalização](customization.md) - Criar esquemas e modelos personalizados
- [Primeiros Passos](getting-started.md) - Guia de configuração inicial