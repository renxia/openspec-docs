# CLI 参考

OpenSpec CLI (`openspec`) 提供了终端命令，用于项目设置、验证、状态检查和管理。这些命令补充了 [命令](commands.md) 中记录的 AI 斜杠命令（如 `/opsx:propose`）。

## 概要

| 类别 | 命令 | 用途 |
|----------|----------|---------|
| **设置** | `init`, `update` | 在项目中初始化和更新 OpenSpec |
| **工作区 (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | 设置链接仓库或文件夹的本地视图 |
| **共享上下文 (beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | 管理本地上下文存储注册和持久化计划上下文 |
| **浏览** | `list`, `view`, `show` | 探索变更和规格 |
| **验证** | `validate` | 检查变更和规格是否有问题 |
| **生命周期** | `archive` | 完成已完成的变更 |
| **工作流** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | 制品驱动的工作流支持 |
| **架构** | `schema init`, `schema fork`, `schema validate`, `schema which` | 创建和管理工作流 |
| **配置** | `config` | 查看和修改设置 |
| **工具** | `feedback`, `completion` | 反馈和 Shell 集成 |

---

## 人工与智能体命令

大多数 CLI 命令设计为在终端中**供人使用**。部分命令也通过 JSON 输出支持**智能体/脚本使用**。

### 仅限人工命令

这些命令是交互式的，专为终端使用而设计：

| 命令 | 用途 |
|---------|---------|
| `openspec init` | 初始化项目（交互式提示） |
| `openspec view` | 交互式仪表板 |
| `openspec config edit` | 在编辑器中打开配置 |
| `openspec feedback` | 通过 GitHub 提交反馈 |
| `openspec completion install` | 安装 shell 自动补全 |

### 智能体兼容命令

这些命令支持 `--json` 输出，以便 AI 智能体和脚本进行编程式使用：

| 命令 | 人工用途 | 智能体用途 |
|---------|-----------|-----------|
| `openspec list` | 浏览变更/规范 | `--json` 获取结构化数据 |
| `openspec show <item>` | 读取内容 | `--json` 用于解析 |
| `openspec validate` | 检查问题 | `--all --json` 进行批量验证 |
| `openspec status` | 查看制品进度 | `--json` 获取结构化状态 |
| `openspec instructions` | 获取下一步操作 | `--json` 获取智能体指令 |
| `openspec templates` | 查找模板路径 | `--json` 用于路径解析 |
| `openspec schemas` | 列出可用 schema | `--json` 用于 schema 发现 |
| `openspec workspace setup --no-interactive` | 使用明确输入创建工作区 | `--json` 获取结构化设置输出 |
| `openspec workspace list` | 浏览已知工作区 | `--json` 获取类型化的工作区对象 |
| `openspec workspace link` | 链接一个仓库或文件夹 | `--json` 获取结构化链接输出 |
| `openspec workspace relink` | 修复已链接的路径 | `--json` 获取结构化链接输出 |
| `openspec workspace doctor` | 检查一个工作区 | `--json` 获取结构化状态输出 |
| `openspec workspace update` | 刷新工作区本地指导和智能体技能 | `--tools` 选择智能体；配置文件选择工作流 |
| `openspec context-store setup <id>` | 创建一个本地上下文存储 | `--json` 与明确输入一起用于结构化设置输出 |
| `openspec context-store register <path>` | 注册一个现有的上下文存储 | `--json` 获取结构化注册输出 |
| `openspec context-store unregister <id>` | 取消注册一个本地上下文存储 | `--json` 获取结构化清理输出 |
| `openspec context-store remove <id>` | 删除一个已注册的本地上下文存储文件夹 | `--yes --json` 进行非交互式删除 |
| `openspec context-store list` | 浏览已注册的上下文存储 | `--json` 获取结构化注册信息 |
| `openspec context-store doctor` | 检查本地存储设置 | `--json` 获取结构化诊断信息 |
| `openspec initiative list` | 浏览共享倡议 | `--json` 获取结构化倡议记录 |
| `openspec initiative show <id>` | 解析一个倡议 | `--json` 获取规范路径和元数据 |
| `openspec new change <id>` | 创建仓库本地的变更脚手架 | `--json`，加 `--initiative` 用于共享协调链接 |
| `openspec set change <id>` | 更新已检入的变更元数据 | `--json`，加 `--initiative` 用于共享协调链接 |

---

## 全局选项

这些选项适用于所有命令：

| 选项 | 描述 |
|--------|-------------|
| `--version`, `-V` | 显示版本号 |
| `--no-color` | 禁用彩色输出 |
| `--help`, `-h` | 显示命令的帮助信息 |

---

## 设置命令

### `openspec init`

在你的项目中初始化 OpenSpec。创建文件夹结构并配置 AI 工具集成。

默认行为使用全局配置默认值：配置文件为 `core`，交付模式为 `both`，工作流为 `propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**参数：**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认值：当前目录） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--tools <list>` | 非交互式地配置 AI 工具。使用 `all`、`none` 或逗号分隔的列表 |
| `--force` | 自动清理旧版文件，无需提示 |
| `--profile <profile>` | 覆盖本次初始化运行的全局配置文件（`core` 或 `custom`） |

`--profile custom` 使用当前全局配置中选择的任何工作流（`openspec config profile`）。

**支持的工具 ID（`--tools`）：** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**示例：**

```bash
# 交互式初始化
openspec init

# 在指定目录初始化
openspec init ./my-project

# 非交互式：为 Claude 和 Cursor 配置
openspec init --tools claude,cursor

# 为所有支持的工具配置
openspec init --tools all

# 覆盖本次运行的配置文件
openspec init --profile core

# 跳过提示并自动清理旧版文件
openspec init --force
```

**创建的内容：**

```
openspec/
├── specs/              # 你的规范（事实来源）
├── changes/            # 提议的变更
└── config.yaml         # 项目配置

.claude/skills/         # Claude Code 技能（如果选择了 claude）
.cursor/skills/         # Cursor 技能（如果选择了 cursor）
.cursor/commands/       # Cursor OPSX 命令（如果交付模式包含 commands）
... (其他工具配置)
```

---

### `openspec update`

在升级 CLI 后更新 OpenSpec 指令文件。使用当前的全局配置文件、选定的工作流和交付模式重新生成 AI 工具配置文件。

```
openspec update [path] [options]
```

**参数：**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认值：当前目录） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--force` | 即使文件是最新的也强制更新 |

**示例：**

```bash
# 在 npm 升级后更新指令文件
npm update @fission-ai/openspec
openspec update
```

---

## 工作区命令

工作区命令目前处于测试阶段。下面描述的本地视图模型是当前的发展方向，但外部自动化、集成和长期运行的工作流仍应将命令行为、状态文件和 JSON 输出视为在不断演进中。

协调工作区是链接仓库或文件夹在机器本地的视图。工作区可见性不等于变更提交：链接 OpenSpec 应该知道的仓库或文件夹，然后在你准备好规划具体工作时再创建变更。

### `openspec workspace setup`

在标准 OpenSpec 工作区位置创建工作区，并链接至少一个现有仓库或文件夹。

```bash
openspec workspace setup [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--name <name>` | 工作区名称。名称必须为短横线分隔格式 |
| `--link <path>` | 链接现有仓库或文件夹，并从文件夹名称推断链接名称 |
| `--link <name>=<path>` | 链接现有仓库或文件夹，并使用明确的链接名称 |
| `--opener <id>` | 在非交互式设置期间存储首选打开器：`codex-cli`、`claude`、`github-copilot` 或 `editor` |
| `--tools <tools>` | 为智能体安装工作区本地的 OpenSpec 技能。使用 `all`、`none` 或逗号分隔的工具 ID |
| `--no-interactive` | 禁用提示；需要 `--name` 和至少一个 `--link` |
| `--json` | 输出 JSON；需要 `--no-interactive` |

**示例：**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

交互式设置会询问首选打开器，并可以为选定的智能体安装工作区本地的 OpenSpec 技能。非交互式设置仅在提供 `--opener` 时存储首选打开器；否则 `workspace open` 会在支持的打开器可用时，在交互式终端中稍后提示，或要求脚本传递 `--agent <tool>` 或 `--editor`。

在此测试版本中，工作区技能安装仅限于技能本身：即使全局交付模式是 `commands` 或 `both`，工作区设置也只会在工作区根目录下写入智能体技能文件夹，而不会创建斜杠命令文件。活动的全局配置文件决定安装哪些工作流技能；`--tools` 决定哪些智能体会接收它们。如果在非交互式设置中省略 `--tools`，则不安装任何技能，稍后可以通过 `workspace update --tools <ids>` 添加。

### `openspec workspace list`

从本地注册表列出已知的 OpenSpec 工作区。

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

列表显示每个工作区的位置以及链接的仓库或文件夹。过时的注册记录会被报告但不会被更改。

### `openspec workspace link`

为一个工作区记录一个现有的仓库或文件夹。

```bash
openspec workspace link [name] <path> [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--workspace <name>` | 从本地注册表中选择一个已知的工作区 |
| `--json` | 输出 JSON |
| `--no-interactive` | 禁用工作区选择器提示 |

**示例：**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

路径必须已经存在。相对路径在 OpenSpec 将验证后的绝对路径存储到机器本地的工作区状态之前，会根据命令的当前目录进行解析。链接的路径可以是完整的仓库、包、服务、应用或没有仓库本地 `openspec/` 状态的文件夹。

### `openspec workspace relink`

修复或更改现有链接的本地路径。

```bash
openspec workspace relink <name> <path> [options]
```

路径必须已经存在。`relink` 仅更新稳定链接名称对应的机器本地路径。

### `openspec workspace doctor`

检查一个工作区在当前机器上可以解析的内容。

```bash
openspec workspace doctor [options]
```

`doctor` 显示工作区位置、链接的仓库或文件夹、缺失的路径、存在时的仓库本地规范路径以及建议的修复方法。JSON 输出还包括工作区规划路径以保持兼容性。它只报告问题；不会自动修复。

需要工作区的命令在从工作区文件夹或子目录内部运行时，使用当前工作区。在其他地方运行时，请传递 `--workspace <name>`，在交互式终端中从选择器中选择，或者当只有一个已知工作区时依赖它。在 `--json` 或 `--no-interactive` 模式下，歧义选择会失败并返回结构化状态错误，并建议使用 `--workspace <name>`。

JSON 响应使用类型化对象加上 `status` 数组。主要数据在 `workspace`、`workspaces` 或 `link` 中；警告和错误在 `status` 中。

### `openspec workspace update`

刷新工作区本地的 OpenSpec 指导和智能体技能。

```bash
openspec workspace update [name] [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--workspace <name>` | 从本地注册表中选择一个已知的工作区 |
| `--tools <tools>` | 为工作区技能选择智能体。使用 `all`、`none` 或逗号分隔的工具 ID |
| `--json` | 输出 JSON |
| `--no-interactive` | 禁用工作区选择器提示 |

**示例：**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` 刷新生成的工作区指导块和本地开放表面。对于智能体技能，当省略 `--tools` 时，它会重用存储的工作区技能智能体选择。传递 `--tools` 会替换该存储的选择。它只刷新工作区根目录下由 OpenSpec 管理的工作流技能目录，移除未选定的管理工作流技能，并保持链接的仓库和文件夹不变。

在工作区内部运行 `openspec update` 会重定向到 `openspec workspace update`；当你想更新仓库拥有的工具文件时，请在仓库本地项目内部运行 `openspec update`。

### `openspec workspace open`

通过存储的首选打开器、单会话智能体覆盖或 VS Code 编辑器模式打开一个工作区工作集。

```bash
openspec workspace open [name] [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--workspace <name>` | 位置参数工作区名称的别名 |
| `--initiative <id>` | 将倡议作为本地工作区视图打开。接受 `<id>` 或 `<store>/<id>` |
| `--store <id>` | 用于 `--initiative` 的已注册上下文存储 ID |
| `--store-path <path>` | 用于 `--initiative` 的现有本地上下文存储根 |
| `--agent <tool>` | 单会话智能体覆盖：`codex-cli`、`claude` 或 `github-copilot` |
| `--editor` | 将维护的 VS Code 工作区文件作为普通编辑器工作区打开 |
| `--no-interactive` | 禁用工作区和打开器选择器提示 |

**示例：**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` 在工作区内部运行时使用当前工作区，在其他地方运行时自动选择唯一已知的工作区，当有多个已知工作区时会要求用户选择。`--agent` 和 `--editor` 不会更改存储的首选打开器。同时传递两者覆盖是错误的；请在 `--agent <tool>` 或 `--editor` 中选择其一。

当使用 `--initiative` 时，OpenSpec 会为该倡议准备或选择一个私有的本地工作区视图。从注册表选择的存储按 ID 存储；`--store-path` 存储一个运行时本地路径选择器，因为工作区视图是私有的本地状态。

OpenSpec 在工作区根目录维护 `<workspace-name>.code-workspace`，用于 VS Code 编辑器和 GitHub Copilot-in-VS-Code 打开。该文件是机器本地的工作区视图状态。

维护的 VS Code 工作区首先列出有效的链接仓库或文件夹，然后是附加的倡议上下文，最后是 OpenSpec 工作区文件。VS Code 将这些条目显示为一个多根工作区。

根工作区打开使链接的仓库或文件夹可见，便于探索和获取上下文。实现编辑应在用户明确请求并遵循正常的 OpenSpec 实现工作流后才开始。

---

## 共享上下文命令

上下文存储和计划是处于测试阶段的协调界面。上下文存储是用于持久化共享上下文的本地注册，通常是一个 Git 支持的文件夹或克隆仓库。计划是上下文存储内的共享协调上下文；仓库本地的更改可以链接到它，而无需将共享计划复制到每个仓库中。

### `openspec context-store setup`

创建并注册一个本地上下文存储。在终端中不带参数执行时，
OpenSpec 会引导用户完成设置。代理和脚本应传递显式参数并使用 `--json`。

```bash
openspec context-store setup [id] [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--path <path>` | 上下文存储文件夹路径；默认使用 OpenSpec 的托管本地数据目录 |
| `--init-git` | 在上下文存储中初始化一个 Git 仓库 |
| `--no-init-git` | 不初始化 Git 仓库 |
| `--json` | 输出 JSON 格式 |

当省略 `--path` 时，设置会在 `getGlobalDataDir()/context-stores/<id>` 下创建存储：如果设置了 `XDG_DATA_HOME`，则为 `$XDG_DATA_HOME/openspec/context-stores/<id>`；在 Unix 风格的回退路径上则为 `~/.local/share/openspec/context-stores/<id>`。当您希望将存储放在可见的克隆仓库或团队专用文件夹中时，请传递 `--path` 参数。

示例：

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

注册一个已存在的本地上下文存储文件夹。

```bash
openspec context-store register [path] [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--id <id>` | 上下文存储 ID；默认使用存储元数据或文件夹名称 |
| `--json` | 输出 JSON 格式 |

### `openspec context-store unregister`

取消一个本地上下文存储的注册，但不删除文件。

```bash
openspec context-store unregister <id> [--json]
```

当存储已被移动、克隆到其他位置，或者不应再在此机器上由 OpenSpec 显示时，请使用此命令。

### `openspec context-store remove`

取消一个本地上下文存储的注册并删除其本地文件夹。

```bash
openspec context-store remove <id> [--yes] [--json]
```

在交互式终端中，`remove` 命令会在删除前显示确切的文件夹路径。
代理、脚本和 JSON 调用者必须传递 `--yes` 以确认删除。
OpenSpec 会拒绝删除不包含匹配上下文存储元数据的文件夹。

### `openspec context-store list`

列出本地注册的上下文存储。

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

检查本地上下文存储的注册、元数据和 Git 状态。

```bash
openspec context-store doctor [id] [--json]
```

Doctor 仅用于诊断；它会报告缺失的根目录、元数据不匹配和无效的本地注册状态，而不会修改存储。

### `openspec initiative create`

在上下文存储中创建一个计划。

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--store <id>` | 来自本地注册表的上下文存储 ID |
| `--store-path <path>` | 已存在的本地上下文存储根目录 |
| `--title <title>` | 计划标题 |
| `--summary <summary>` | 计划摘要 |
| `--json` | 输出 JSON 格式 |

### `openspec initiative list`

列出计划。不带选择器时，此命令会搜索所有已注册的上下文存储，并在 `status` 中报告部分读取警告。

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--store <id>` | 列出一个已注册的上下文存储 |
| `--store-path <path>` | 列出一个已存在的本地上下文存储根目录 |
| `--json` | 输出 JSON 格式 |

### `openspec initiative show`

解析一个计划并打印其规范位置。

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

不使用 `--store` 时，OpenSpec 会搜索已注册的上下文存储。如果同一个计划 ID 存在于多个存储中，请传递 `--store <id>` 或使用 `<store>/<id>` 形式。

---

## 浏览命令

### `openspec list`

列出项目中的变更或规范。

```
openspec list [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--specs` | 列出规范而非变更 |
| `--changes` | 列出变更（默认） |
| `--sort <order>` | 按 `recent`（默认）或 `name` 排序 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 列出所有活动的变更
openspec list

# 列出所有规范
openspec list --specs

# 为脚本输出 JSON 格式
openspec list --json
```

**输出（文本）：**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

显示一个交互式仪表盘，用于探索规范和变更。

```
openspec view
```

打开一个基于终端的界面，用于浏览项目的规范和变更。

---

### `openspec show`

显示变更或规范的详细信息。

```
openspec show [item-name] [options]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 变更或规范的名称（如果省略则提示输入） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--type <type>` | 指定类型：`change` 或 `spec`（如果无歧义则自动检测） |
| `--json` | 以 JSON 格式输出 |
| `--no-interactive` | 禁用提示 |

**变更特定选项：**

| 选项 | 描述 |
|--------|-------------|
| `--deltas-only` | 仅显示增量规范（JSON 模式） |

**规范特定选项：**

| 选项 | 描述 |
|--------|-------------|
| `--requirements` | 仅显示需求，排除场景（JSON 模式） |
| `--no-scenarios` | 排除场景内容（JSON 模式） |
| `-r, --requirement <id>` | 按从 1 开始的索引显示特定需求（JSON 模式） |

**示例：**

```bash
# 交互式选择
openspec show

# 显示特定变更
openspec show add-dark-mode

# 显示特定规范
openspec show auth --type spec

# 为解析输出 JSON 格式
openspec show add-dark-mode --json
```

---

## 验证命令

### `openspec validate`

验证变更和规范的结构性问题。

```
openspec validate [item-name] [options]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 要验证的特定项目（如果省略则提示输入） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--all` | 验证所有变更和规范 |
| `--changes` | 验证所有变更 |
| `--specs` | 验证所有规范 |
| `--type <type>` | 当名称有歧义时指定类型：`change` 或 `spec` |
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

# 以 JSON 输出验证所有内容（用于 CI/脚本）
openspec validate --all --json

# 增加并行度的严格验证
openspec validate --all --strict --concurrency 12
```

**输出（文本）：**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
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

## 生命周期命令

### `openspec archive`

归档一个已完成的变更，并将增量规范合并到主规范中。

```
openspec archive [change-name] [options]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要归档的变更（如果省略则提示输入） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `-y, --yes` | 跳过确认提示 |
| `--skip-specs` | 跳过规范更新（用于基础设施/工具/仅文档的变更） |
| `--no-validate` | 跳过验证（需要确认） |

**示例：**

```bash
# 交互式归档
openspec archive

# 归档特定变更
openspec archive add-dark-mode

# 无提示归档（CI/脚本）
openspec archive add-dark-mode --yes

# 归档一个不影响规范的工具变更
openspec archive update-ci-config --skip-specs
```

**功能说明：**

1.  验证变更（除非使用 `--no-validate`）
2.  提示确认（除非使用 `--yes`）
3.  将增量规范合并到 `openspec/specs/`
4.  将变更文件夹移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## 工作流命令

这些命令支持基于制品的 OPSX 工作流。它们既适用于检查进度的人类，也适用于确定下一步的代理。

### `openspec new change`

创建一个仓库本地的变更目录和可选的已签入元数据。

```bash
openspec new change <name> [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--description <text>` | 添加到 `README.md` 的描述 |
| `--goal <text>` | 与变更一起存储的工作空间产品目标 |
| `--areas <names>` | 逗号分隔的受影响工作空间链接名称 |
| `--initiative <id>` | 将仓库本地变更链接到一个 initiative |
| `--store <id>` | 用于 `--initiative` 的上下文存储 ID |
| `--store-path <path>` | 用于 `--initiative` 的现有本地上下文存储根目录 |
| `--schema <name>` | 要使用的工作流 schema |
| `--json` | 输出 JSON |

示例：

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

更新已签入的仓库本地变更元数据，而不重新创建变更。

```bash
openspec set change <name> [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--initiative <id>` | 将仓库本地变更链接到一个 initiative |
| `--store <id>` | 用于 `--initiative` 的上下文存储 ID |
| `--store-path <path>` | 用于 `--initiative` 的现有本地上下文存储根目录 |
| `--json` | 输出 JSON |

当请求的链接已存在时，`set change --initiative` 是幂等的，并且会拒绝替换不同的现有 initiative 链接。

### `openspec status`

显示变更的制品完成状态。

```
openspec status [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--change <id>` | 变更名称（如果省略则提示输入） |
| `--schema <name>` | Schema 覆盖（从变更的配置自动检测） |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 交互式状态检查
openspec status

# 特定变更的状态
openspec status --change add-dark-mode

# 供代理使用的 JSON 格式
openspec status --change add-dark-mode --json
```

**输出（文本）：**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**输出（JSON）：**

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

获取用于创建制品或应用任务的增强指令。供 AI 代理用于理解接下来要创建什么。

```
openspec instructions [artifact] [options]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `artifact` | 否 | 制品 ID：`proposal`、`specs`、`design`、`tasks` 或 `apply` |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--change <id>` | 变更名称（在非交互模式下必需） |
| `--schema <name>` | Schema 覆盖 |
| `--json` | 以 JSON 格式输出 |

**特殊情况：** 使用 `apply` 作为制品可获取任务实现指令。

**示例：**

```bash
# 获取下一个制品的指令
openspec instructions --change add-dark-mode

# 获取特定制品的指令
openspec instructions design --change add-dark-mode

# 获取应用/实现指令
openspec instructions apply --change add-dark-mode

# 供代理消费的 JSON 格式
openspec instructions design --change add-dark-mode --json
```

**输出包括：**

- 制品的模板内容
- 来自配置的项目上下文
- 来自依赖制品的内容
- 来自配置的每制品规则

---

### `openspec templates`

显示 schema 中所有制品的已解析模板路径。

```
openspec templates [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--schema <name>` | 要检查的 schema（默认：`spec-driven`） |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 显示默认 schema 的模板路径
openspec templates

# 显示自定义 schema 的模板
openspec templates --schema my-workflow

# 供编程使用的 JSON 格式
openspec templates --json
```

**输出（文本）：**

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

列出可用的工作流 schema 及其描述和制品流程。

```
openspec schemas [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
openspec schemas
```

**输出：**

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

## 模式命令

用于创建和管理自定义工作流模式的命令。

### `openspec schema init`

创建一个新的项目本地模式。

```
openspec schema init <name> [options]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `name` | 是 | 模式名称（短横线命名法） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--description <text>` | 模式描述 |
| `--artifacts <list>` | 逗号分隔的工件 ID（默认值：`proposal,specs,design,tasks`） |
| `--default` | 设为项目默认模式 |
| `--no-default` | 不提示设为默认 |
| `--force` | 覆盖现有模式 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 交互式创建模式
openspec schema init research-first

# 非交互式，指定特定工件
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**创建内容：**

```
openspec/schemas/<name>/
├── schema.yaml           # 模式定义
└── templates/
    ├── proposal.md       # 每个工件的模板
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

将现有模式复制到您的项目中以便进行自定义。

```
openspec schema fork <source> [name] [options]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `source` | 是 | 要复制的模式 |
| `name` | 否 | 新模式名称（默认值：`<source>-custom`） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--force` | 覆盖现有目标 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 复刻内置的 spec-driven 模式
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

验证模式的结构和模板。

```
openspec schema validate [name] [options]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `name` | 否 | 要验证的模式（如果省略则验证所有模式） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--verbose` | 显示详细的验证步骤 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 验证特定模式
openspec schema validate my-workflow

# 验证所有模式
openspec schema validate
```

---

### `openspec schema which`

显示模式解析的来源（用于调试优先级）。

```
openspec schema which [name] [options]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `name` | 否 | 模式名称 |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--all` | 列出所有模式及其来源 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 检查模式来源
openspec schema which spec-driven
```

**输出：**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**模式优先级：**

1. 项目：`openspec/schemas/<name>/`
2. 用户：`~/.local/share/openspec/schemas/<name>/`
3. 包：内置模式

---

## 配置命令

### `openspec config`

查看和修改全局 OpenSpec 配置。

```
openspec config <subcommand> [options]
```

**子命令：**

| 子命令 | 描述 |
|------------|-------------|
| `path` | 显示配置文件位置 |
| `list` | 显示所有当前设置 |
| `get <key>` | 获取特定值 |
| `set <key> <value>` | 设置值 |
| `unset <key>` | 移除键 |
| `reset` | 重置为默认值 |
| `edit` | 在 `$EDITOR` 中打开 |
| `profile [preset]` | 通过交互或预设配置工作流配置文件 |

**示例：**

```bash
# 显示配置文件路径
openspec config path

# 列出所有设置
openspec config list

# 获取特定值
openspec config get telemetry.enabled

# 设置值
openspec config set telemetry.enabled false

# 显式设置字符串值
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

`openspec config profile` 首先显示当前状态摘要，然后让您选择：
- 更改交付 + 工作流
- 仅更改交付
- 仅更改工作流
- 保持当前设置（退出）

如果选择保持当前设置，不会写入任何更改，也不会显示更新提示。
如果没有配置更改，但当前项目或工作区文件与您的全局配置文件/交付不同步，OpenSpec 将显示警告，并为仓库本地项目建议 `openspec update`，或为工作区本地指导和技能建议 `openspec workspace update`。
按 `Ctrl+C` 也会干净地取消流程（无堆栈跟踪）并以代码 `130` 退出。
在工作流复选框中，`[x]` 表示该工作流已在全局配置中选中。要将这些选择应用到项目文件，请运行 `openspec update`（或在项目内提示时选择 `现在将更改应用到此项目？`）。在工作区内，使用 `openspec workspace update` 刷新工作区本地指导和技能；对于生成的代理工作流文件，这仍然仅限于技能，并且不会生成工作区斜杠命令。

**交互示例：**

```bash
# 仅更新交付
openspec config profile
# 选择：仅更改交付
# 选择交付方式：仅限技能

# 仅更新工作流
openspec config profile
# 选择：仅更改工作流
# 在复选框中切换工作流，然后确认
```

---

## 实用工具命令

### `openspec feedback`

提交关于 OpenSpec 的反馈。创建一个 GitHub issue。

```
openspec feedback <message> [options]
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

管理 OpenSpec CLI 的 Shell 补全。

```
openspec completion <subcommand> [shell]
```

**子命令：**

| 子命令 | 描述 |
|------------|-------------|
| `generate [shell]` | 将补全脚本输出到标准输出 |
| `install [shell]` | 为您的 Shell 安装补全 |
| `uninstall [shell]` | 移除已安装的补全 |

**支持的 Shell：** `bash`, `zsh`, `fish`, `powershell`

**示例：**

```bash
# 安装补全（自动检测 Shell）
openspec completion install

# 为特定 Shell 安装
openspec completion install zsh

# 生成脚本以进行手动安装
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
| `OPENSPEC_CONCURRENCY` | 批量验证的默认并发数（默认值：6） |
| `EDITOR` 或 `VISUAL` | 用于 `openspec config edit` 的编辑器 |
| `NO_COLOR` | 设置时禁用彩色输出 |

---

## 相关文档

- [命令](commands.md) - AI 斜杠命令（`/opsx:propose`, `/opsx:apply` 等）
- [工作流](workflows.md) - 常见模式及何时使用每个命令
- [自定义](customization.md) - 创建自定义模式和模板
- [入门指南](getting-started.md) - 初次设置指南