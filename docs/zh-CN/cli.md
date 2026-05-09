# CLI 参考

OpenSpec CLI (`openspec`) 提供终端命令，用于项目设置、验证、状态检查和管理。这些命令补充了 [命令](commands.md) 中记录的 AI 斜杠命令（如 `/opsx:propose`）。

## 概要

| 类别 | 命令 | 用途 |
|----------|----------|---------|
| **设置** | `init`, `update` | 在项目中初始化和更新 OpenSpec |
| **工作区 (测试版)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | 设置跨链接仓库或文件夹的规划 |
| **浏览** | `list`, `view`, `show` | 探索变更和规范 |
| **验证** | `validate` | 检查变更和规范是否存在问题 |
| **生命周期** | `archive` | 完成已完成的变更 |
| **工作流** | `status`, `instructions`, `templates`, `schemas` | 基于工件的工作流支持 |
| **模式** | `schema init`, `schema fork`, `schema validate`, `schema which` | 创建和管理自定义工作流 |
| **配置** | `config` | 查看和修改设置 |
| **实用工具** | `feedback`, `completion` | 反馈和 shell 集成 |

---

## 人工与智能体命令

大多数 CLI 命令设计为在终端中供**人工使用**。部分命令也支持通过 JSON 输出供**智能体/脚本使用**。

### 仅限人工使用的命令

这些命令是交互式的，专为终端使用设计：

| 命令 | 用途 |
|---------|---------|
| `openspec init` | 初始化项目（交互式提示） |
| `openspec view` | 交互式仪表板 |
| `openspec config edit` | 在编辑器中打开配置 |
| `openspec feedback` | 通过 GitHub 提交反馈 |
| `openspec completion install` | 安装 Shell 补全 |

### 兼容智能体的命令

这些命令支持 `--json` 输出，供 AI 智能体和脚本进行程序化使用：

| 命令 | 人工使用 | 智能体使用 |
|---------|-----------|-----------|
| `openspec list` | 浏览变更/规格 | `--json` 获取结构化数据 |
| `openspec show <item>` | 读取内容 | `--json` 用于解析 |
| `openspec validate` | 检查问题 | `--all --json` 用于批量验证 |
| `openspec status` | 查看工件进度 | `--json` 获取结构化状态 |
| `openspec instructions` | 获取下一步操作 | `--json` 获取智能体指令 |
| `openspec templates` | 查找模板路径 | `--json` 用于路径解析 |
| `openspec schemas` | 列出可用模式 | `--json` 用于模式发现 |
| `openspec workspace setup --no-interactive` | 使用明确输入创建工作区 | `--json` 获取结构化设置输出 |
| `openspec workspace list` | 浏览已知工作区 | `--json` 获取类型化的工作区对象 |
| `openspec workspace link` | 链接仓库或文件夹 | `--json` 获取结构化链接输出 |
| `openspec workspace relink` | 修复已链接的路径 | `--json` 获取结构化链接输出 |
| `openspec workspace doctor` | 检查一个工作区 | `--json` 获取结构化状态输出 |

---

## 全局选项

这些选项适用于所有命令：

| 选项 | 描述 |
|--------|-------------|
| `--version`, `-V` | 显示版本号 |
| `--no-color` | 禁用彩色输出 |
| `--help`, `-h` | 显示命令帮助信息 |

---

## 设置命令

### `openspec init`

在您的项目中初始化 OpenSpec。创建文件夹结构并配置 AI 工具集成。

默认行为使用全局配置默认值：配置文件 `core`，交付方式 `both`，工作流 `propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认：当前目录） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--tools <list>` | 非交互式配置 AI 工具。使用 `all`、`none` 或逗号分隔的列表 |
| `--force` | 自动清理遗留文件，无需提示 |
| `--profile <profile>` | 覆盖此次初始化运行的全局配置文件（`core` 或 `custom`） |

`--profile custom` 使用全局配置（`openspec config profile`）中当前选定的任何工作流。

**支持的工具 ID (`--tools`)：** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**示例：**

```bash
# 交互式初始化
openspec init

# 在特定目录中初始化
openspec init ./my-project

# 非交互式：为 Claude 和 Cursor 配置
openspec init --tools claude,cursor

# 为所有支持的工具配置
openspec init --tools all

# 覆盖此次运行的配置文件
openspec init --profile core

# 跳过提示并自动清理遗留文件
openspec init --force
```

**创建的内容：**

```
openspec/
├── specs/              # 您的规格说明（事实来源）
├── changes/            # 提议的变更
└── config.yaml         # 项目配置

.claude/skills/         # Claude Code 技能（如果选择了 claude）
.cursor/skills/         # Cursor 技能（如果选择了 cursor）
.cursor/commands/       # Cursor OPSX 命令（如果交付方式包含命令）
... (其他工具配置)
```

---

### `openspec update`

在升级 CLI 后更新 OpenSpec 指令文件。使用您当前的全局配置文件、选定的工作流和交付模式重新生成 AI 工具配置文件。

```
openspec update [path] [options]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认：当前目录） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--force` | 即使文件已是最新也强制更新 |

**示例：**

```bash
# 在 npm 升级后更新指令文件
npm update @fission-ai/openspec
openspec update
```

---

## 工作区命令

工作区命令正在积极开发中，尚未准备好使用。请勿在此命令接口之上构建外部自动化、集成或长期运行的工作流；命令行为、状态文件和 JSON 输出可能随时更改。

协调工作区是跨多个仓库或文件夹工作的规划场所。工作区的可见性不等于变更承诺：链接 OpenSpec 应了解的仓库或文件夹，然后在您准备好规划具体工作时创建变更。

### `openspec workspace setup`

在标准 OpenSpec 工作区位置创建工作区，并链接至少一个现有的仓库或文件夹。

```bash
openspec workspace setup [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--name <name>` | 工作区名称。名称必须为 kebab-case 格式 |
| `--link <path>` | 链接现有的仓库或文件夹，并从文件夹名称推断链接名称 |
| `--link <name>=<path>` | 使用显式链接名称链接现有的仓库或文件夹 |
| `--opener <id>` | 在非交互式设置期间存储首选打开器：`codex`、`claude`、`github-copilot` 或 `editor` |
| `--no-interactive` | 禁用提示；需要 `--name` 和至少一个 `--link` |
| `--json` | 输出 JSON；需要 `--no-interactive` |

**示例：**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

交互式设置会询问首选打开器并将其存储在机器本地的工作区状态中。非交互式设置仅在提供 `--opener` 时存储首选打开器；否则，`workspace open` 在支持的打开器可用时，会在交互式终端中稍后提示，或要求脚本传递 `--agent <tool>` 或 `--editor`。

### `openspec workspace list`

从本地注册表列出已知的 OpenSpec 工作区。

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

列表显示每个工作区的位置以及链接的仓库或文件夹。过时的注册表记录会被报告但不会被更改。

### `openspec workspace link`

为一个工作区记录一个现有的仓库或文件夹。

```bash
openspec workspace link [name] <path> [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--workspace <name>` | 从本地注册表选择一个已知的工作区 |
| `--json` | 输出 JSON |
| `--no-interactive` | 禁用工作区选择器提示 |

**示例：**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

路径必须已存在。相对路径会在 OpenSpec 将验证后的绝对路径存储到机器本地工作区状态之前，根据命令的当前目录进行解析。链接的路径可以是完整的仓库、包、服务、应用或没有仓库本地 `openspec/` 状态的文件夹。

### `openspec workspace relink`

修复或更改现有链接的本地路径。

```bash
openspec workspace relink <name> <path> [options]
```

路径必须已存在。Relink 仅更新稳定链接名称的机器本地路径。

### `openspec workspace doctor`

检查一个工作区在当前机器上可以解析什么。

```bash
openspec workspace doctor [options]
```

Doctor 显示工作区位置、规划路径、链接的仓库或文件夹、缺失的路径（如果存在则显示仓库本地的 specs 路径）以及建议的修复方法。它只报告问题；不会自动修复它们。

需要一个工作区的命令在从工作区文件夹或子目录内部运行时使用当前工作区。从其他地方运行时，传递 `--workspace <name>`，在交互式终端中从选择器中选择，或者当仅存在一个已知工作区时依赖该工作区。在 `--json` 或 `--no-interactive` 模式下，不明确的选择会失败并返回结构化状态错误，并建议使用 `--workspace <name>`。

JSON 响应使用类型化对象加上 `status` 数组。主要数据位于 `workspace`、`workspaces` 或 `link` 中；警告和错误位于 `status` 中。

### `openspec workspace open`

通过存储的首选打开器、单次会话智能体覆盖或 VS Code 编辑器模式打开一个工作区工作集。

```bash
openspec workspace open [name] [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--workspace <name>` | 位置参数工作区名称的别名 |
| `--agent <tool>` | 单次会话智能体覆盖：`codex`、`claude` 或 `github-copilot` |
| `--editor` | 将维护的 VS Code 工作区文件作为普通编辑器工作区打开 |
| `--no-interactive` | 禁用工作区和打开器选择器提示 |

**示例：**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` 在内部运行时使用当前工作区，在其他地方运行时自动选择唯一已知的工作区，当存在多个已知工作区时要求用户选择。`--agent` 和 `--editor` 不会更改存储的首选打开器。同时传递两个打开器覆盖是错误的；请选择 `--agent <tool>` 或 `--editor`。

OpenSpec 在工作区根目录维护 `<workspace-name>.code-workspace` 文件，用于 VS Code 编辑器和 GitHub Copilot-in-VS-Code 打开。该文件是机器本地的，默认情况下通过特定的 `<workspace-name>.code-workspace` `.gitignore` 条目被忽略，因此用户编写的 `*.code-workspace` 文件仍可被跟踪。

维护的 VS Code 工作区包含协调根目录作为 `.`，加上有效的链接仓库或文件夹作为附加根目录。VS Code 将这些条目显示为多根工作区。

根工作区打开支持跨链接仓库或文件夹的探索和规划。实现编辑应仅在用户明确请求并经过正常的 OpenSpec 实现工作流后开始。

---

## 浏览命令

### `openspec list`

列出项目中的变更或规格。

```
openspec list [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--specs` | 列出规格而非变更 |
| `--changes` | 列出变更（默认） |
| `--sort <order>` | 按 `recent`（默认）或 `name` 排序 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 列出所有活动变更
openspec list

# 列出所有规格
openspec list --specs

# 用于脚本的 JSON 输出
openspec list --json
```

**输出（文本）：**

```
活动变更：
  add-dark-mode     UI 主题切换支持
  fix-login-bug     会话超时处理
```

---

### `openspec view`

显示用于探索规格和变更的交互式仪表板。

```
openspec view
```

打开一个基于终端的界面，用于浏览项目的规格和变更。

---

### `openspec show`

显示变更或规格的详细信息。

```
openspec show [item-name] [options]
```

**参数：**

| 参数 | 是否必需 | 说明 |
|----------|----------|-------------|
| `item-name` | 否 | 变更或规格的名称（若省略则提示输入） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--type <type>` | 指定类型：`change` 或 `spec`（若明确则自动检测） |
| `--json` | 以 JSON 格式输出 |
| `--no-interactive` | 禁用提示 |

**变更特定选项：**

| 选项 | 说明 |
|--------|-------------|
| `--deltas-only` | 仅显示增量规格（JSON 模式） |

**规格特定选项：**

| 选项 | 说明 |
|--------|-------------|
| `--requirements` | 仅显示需求，排除场景（JSON 模式） |
| `--no-scenarios` | 排除场景内容（JSON 模式） |
| `-r, --requirement <id>` | 按基于 1 的索引显示特定需求（JSON 模式） |

**示例：**

```bash
# 交互式选择
openspec show

# 显示特定变更
openspec show add-dark-mode

# 显示特定规格
openspec show auth --type spec

# 用于解析的 JSON 输出
openspec show add-dark-mode --json
```

---

## 验证命令

### `openspec validate`

验证变更和规格是否存在结构问题。

```
openspec validate [item-name] [options]
```

**参数：**

| 参数 | 是否必需 | 说明 |
|----------|----------|-------------|
| `item-name` | 否 | 要验证的特定项目（若省略则提示输入） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--all` | 验证所有变更和规格 |
| `--changes` | 验证所有变更 |
| `--specs` | 验证所有规格 |
| `--type <type>` | 当名称不明确时指定类型：`change` 或 `spec` |
| `--strict` | 启用严格验证模式 |
| `--json` | 以 JSON 格式输出 |
| `--concurrency <n>` | 最大并行验证数（默认：6，或 `OPENSPEC_CONCURRENCY` 环境变量） |
| `--no-interactive` | 禁用提示 |

**示例：**

```bash
# 交互式验证
openspec validate

# 验证特定变更
openspec validate add-dark-mode

# 验证所有变更
openspec validate --changes

# 验证所有内容并以 JSON 输出（用于 CI/脚本）
openspec validate --all --json

# 严格验证并增加并行度
openspec validate --all --strict --concurrency 12
```

**输出（文本）：**

```
正在验证 add-dark-mode...
  ✓ proposal.md 有效
  ✓ specs/ui/spec.md 有效
  ⚠ design.md: 缺少“技术方案”部分

发现 1 个警告
```

**输出（JSON）：**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: 缺少 'Technical Approach' 部分"]
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

## 生命周期命令

### `openspec archive`

归档已完成的变更，并将增量规范合并到主规范中。

```
openspec archive [change-name] [options]
```

**参数：**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要归档的变更（若省略则会提示输入） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `-y, --yes` | 跳过确认提示 |
| `--skip-specs` | 跳过规范更新（适用于仅涉及基础设施/工具/文档的变更） |
| `--no-validate` | 跳过验证（需要确认） |

**示例：**

```bash
# 交互式归档
openspec archive

# 归档特定变更
openspec archive add-dark-mode

# 无提示归档（用于CI/脚本）
openspec archive add-dark-mode --yes

# 归档不影响规范的工具变更
openspec archive update-ci-config --skip-specs
```

**功能说明：**

1. 验证变更（除非使用 `--no-validate`）
2. 提示确认（除非使用 `--yes`）
3. 将增量规范合并到 `openspec/specs/` 目录
4. 将变更文件夹移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/` 目录

---

## 工作流命令

这些命令支持基于制品的 OPSX 工作流。它们既适用于检查进度的人员，也适用于确定下一步操作的智能体。

### `openspec status`

显示变更的制品完成状态。

```
openspec status [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--change <id>` | 变更名称（若省略则会提示输入） |
| `--schema <name>` | 模式覆盖（根据变更配置自动检测） |
| `--json` | 以JSON格式输出 |

**示例：**

```bash
# 交互式状态检查
openspec status

# 特定变更的状态
openspec status --change add-dark-mode

# 供智能体使用的JSON格式
openspec status --change add-dark-mode --json
```

**输出（文本格式）：**

```
变更: add-dark-mode
模式: spec-driven
进度: 4个制品中已完成2个

[x] 提案
[ ] 设计
[x] 规范
[-] 任务 (被阻塞，原因: 设计)
```

**输出（JSON格式）：**

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

获取用于创建制品或应用任务的增强指令。供AI智能体用于了解接下来需要创建什么。

```
openspec instructions [artifact] [options]
```

**参数：**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `artifact` | 否 | 制品ID：`proposal`、`specs`、`design`、`tasks` 或 `apply` |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--change <id>` | 变更名称（非交互模式下必需） |
| `--schema <name>` | 模式覆盖 |
| `--json` | 以JSON格式输出 |

**特殊情况：** 使用 `apply` 作为制品可获取任务实现指令。

**示例：**

```bash
# 获取下一个制品的指令
openspec instructions --change add-dark-mode

# 获取特定制品的指令
openspec instructions design --change add-dark-mode

# 获取应用/实现指令
openspec instructions apply --change add-dark-mode

# 供智能体使用的JSON格式
openspec instructions design --change add-dark-mode --json
```

**输出内容包括：**

- 制品的模板内容
- 来自配置的项目上下文
- 依赖制品的内容
- 来自配置的每制品规则

---

### `openspec templates`

显示模式中所有制品的已解析模板路径。

```
openspec templates [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--schema <name>` | 要检查的模式（默认：`spec-driven`） |
| `--json` | 以JSON格式输出 |

**示例：**

```bash
# 显示默认模式的模板路径
openspec templates

# 显示自定义模式的模板
openspec templates --schema my-workflow

# 供程序化使用的JSON格式
openspec templates --json
```

**输出（文本格式）：**

```
模式: spec-driven

模板:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

列出可用的工作流模式及其描述和制品流程。

```
openspec schemas [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--json` | 以JSON格式输出 |

**示例：**

```bash
openspec schemas
```

**输出：**

```
可用模式:

  spec-driven (包)
    默认的规范驱动开发工作流
    流程: 提案 → 规范 → 设计 → 任务

  my-custom (项目)
    此项目的自定义工作流
    流程: 研究 → 提案 → 任务
```

---

## 模式命令

用于创建和管理工作流模式的命令。

### `openspec schema init`

创建新的项目本地模式。

```
openspec schema init <name> [options]
```

**参数：**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `name` | 是 | 模式名称（使用短横线命名法） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--description <text>` | 模式描述 |
| `--artifacts <list>` | 逗号分隔的制品ID（默认：`proposal,specs,design,tasks`） |
| `--default` | 设置为项目默认模式 |
| `--no-default` | 不提示设置为默认模式 |
| `--force` | 覆盖现有模式 |
| `--json` | 以JSON格式输出 |

**示例：**

```bash
# 交互式模式创建
openspec schema init research-first

# 非交互式创建，指定制品
openspec schema init rapid \
  --description "快速迭代工作流" \
  --artifacts "proposal,tasks" \
  --default
```

**创建内容：**

```
openspec/schemas/<name>/
├── schema.yaml           # 模式定义
└── templates/
    ├── proposal.md       # 每个制品的模板
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

将现有模式复制到您的项目中进行自定义。

```
openspec schema fork <source> [name] [options]
```

**参数：**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `source` | 是 | 要复制的模式 |
| `name` | 否 | 新模式名称（默认：`<source>-custom`） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--force` | 覆盖现有目标 |
| `--json` | 以JSON格式输出 |

**示例：**

```bash
# 复制内置的spec-driven模式
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

验证模式的结构和模板。

```
openspec schema validate [name] [options]
```

**参数：**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `name` | 否 | 要验证的模式（若省略则验证所有模式） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--verbose` | 显示详细的验证步骤 |
| `--json` | 以JSON格式输出 |

**示例：**

```bash
# 验证特定模式
openspec schema validate my-workflow

# 验证所有模式
openspec schema validate
```

---

### `openspec schema which`

显示模式的解析来源（用于调试优先级）。

```
openspec schema which [name] [options]
```

**参数：**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `name` | 否 | 模式名称 |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--all` | 列出所有模式及其来源 |
| `--json` | 以JSON格式输出 |

**示例：**

```bash
# 检查模式来源
openspec schema which spec-driven
```

**输出：**

```
spec-driven 解析自: 包
  来源: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**模式优先级：**

1. 项目: `openspec/schemas/<name>/`
2. 用户: `~/.local/share/openspec/schemas/<name>/`
3. 包: 内置模式

---

## 配置命令

### `openspec config`

查看和修改全局 OpenSpec 配置。

```
openspec config <子命令> [选项]
```

**子命令：**

| 子命令 | 描述 |
|------------|-------------|
| `path` | 显示配置文件位置 |
| `list` | 显示所有当前设置 |
| `get <key>` | 获取特定值 |
| `set <key> <value>` | 设置一个值 |
| `unset <key>` | 移除一个键 |
| `reset` | 重置为默认值 |
| `edit` | 在 `$EDITOR` 中打开 |
| `profile [preset]` | 交互式或通过预设配置工作流配置文件 |

**示例：**

```bash
# 显示配置文件路径
openspec config path

# 列出所有设置
openspec config list

# 获取特定值
openspec config get telemetry.enabled

# 设置一个值
openspec config set telemetry.enabled false

# 显式设置一个字符串值
openspec config set user.name "My Name" --string

# 移除自定义设置
openspec config unset user.name

# 重置所有配置
openspec config reset --all --yes

# 在编辑器中编辑配置
openspec config edit

# 使用基于操作的向导配置配置文件
openspec config profile

# 快速预设：将工作流切换为核心（保留交付模式）
openspec config profile core
```

`openspec config profile` 会从当前状态摘要开始，然后让你选择：
- 更改交付 + 工作流
- 仅更改交付
- 仅更改工作流
- 保留当前设置（退出）

如果你选择保留当前设置，将不会写入任何更改，也不会显示更新提示。
如果没有配置更改，但当前项目文件与你的全局配置文件/交付设置不同步，OpenSpec 将显示警告并建议运行 `openspec update`。
按下 `Ctrl+C` 也会干净地取消流程（无堆栈跟踪）并以代码 `130` 退出。
在工作流清单中，`[x]` 表示该工作流已在全局配置中选中。要将这些选择应用到项目文件，请运行 `openspec update`（或在项目内部提示时选择 `立即应用更改到此项目？`）。

**交互式示例：**

```bash
# 仅更新交付
openspec config profile
# 选择：仅更改交付
# 选择交付：仅技能

# 仅更新工作流
openspec config profile
# 选择：仅更改工作流
# 在清单中切换工作流，然后确认
```

---

## 实用工具命令

### `openspec feedback`

提交关于 OpenSpec 的反馈。会创建一个 GitHub issue。

```
openspec feedback <消息> [选项]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `message` | 是 | 反馈消息 |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--body <text>` | 详细描述 |

**要求：** 必须安装并认证 GitHub CLI (`gh`)。

**示例：**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

管理 OpenSpec CLI 的 shell 自动补全。

```
openspec completion <子命令> [shell]
```

**子命令：**

| 子命令 | 描述 |
|------------|-------------|
| `generate [shell]` | 将补全脚本输出到标准输出 |
| `install [shell]` | 为你的 shell 安装补全 |
| `uninstall [shell]` | 移除已安装的补全 |

**支持的 shell：** `bash`, `zsh`, `fish`, `powershell`

**示例：**

```bash
# 安装补全（自动检测 shell）
openspec completion install

# 为特定 shell 安装
openspec completion install zsh

# 生成脚本以手动安装
openspec completion generate bash > ~/.bash_completion.d/openspec

# 卸载
openspec completion uninstall
```

---

## 退出代码

| 代码 | 含义 |
|------|---------|
| `0` | 成功 |
| `1` | 错误（验证失败、文件缺失等） |

---

## 环境变量

| 变量 | 描述 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | 设置为 `0` 以禁用遥测 |
| `DO_NOT_TRACK` | 设置为 `1` 以禁用遥测（标准 DNT 信号） |
| `OPENSPEC_CONCURRENCY` | 批量验证的默认并发数（默认：6） |
| `EDITOR` 或 `VISUAL` | 用于 `openspec config edit` 的编辑器 |
| `NO_COLOR` | 设置时禁用彩色输出 |

---

## 相关文档

- [命令](commands.md) - AI 斜杠命令（`/opsx:propose`、`/opsx:apply` 等）
- [工作流](workflows.md) - 常见模式及何时使用每个命令
- [自定义](customization.md) - 创建自定义模式和模板
- [入门指南](getting-started.md) - 首次设置指南