# CLI 参考

OpenSpec CLI（`openspec`）提供用于项目设置、验证、状态检查和管理的终端命令。这些命令与[Commands](commands.md) 中记录的 AI 斜杠命令（如 `/opsx:propose`）相辅相成。

## 摘要

| Category | Commands | Purpose |
| :--- | :--- | :--- |
| **设置** | `init`, `update` | 在项目中初始化和更新 OpenSpec |
| **存储（独立的 OpenSpec 仓库）** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | 管理已注册的独立 OpenSpec 仓库 |
| **健康状况** | `doctor` | 报告解析根节点的关联健康状态 |
| **工作上下文** | `context` | 组装工作集（根节点 + 引用存储） |
| **个人工作集** | `workset create`, `workset list`, `workset open`, `workset remove` | 在工具中保存和打开个人的本地工作视图 |
| **浏览** | `list`, `view`, `show` | 探索更改和规范 |
| **验证** | `validate` | 检查更改和规范是否存在问题 |
| **生命周期** | `archive` | 完成已完成的更改 |
| **工作流程** | `new change`, `status`, `instructions`, `templates`, `schemas` | 成果驱动的工作流程支持 |
| **模式 (Schemas)** | `schema init`, `schema fork`, `schema validate`, `schema which` | 创建和管理自定义工作流程 |
| **配置** | `config` | 查看和修改设置 |
| **实用工具** | `feedback`, `completion` | 反馈和 Shell 集成 |

## 人类操作与代理命令

大多数 CLI 命令是为终端中的**人类使用**而设计的。有些命令也通过 JSON 输出支持**代理/脚本使用**。

### 仅限人类使用的命令

这些命令具有交互性，专为终端使用设计：

| Command | Purpose |
|---------|---------|
| `openspec init` | 初始化项目（交互式提示） |
| `openspec view` | 交互式仪表板 |
| `openspec workset open <name>` | 打开已保存的工作集（编辑器窗口或终端代理会话） |
| `openspec config edit` | 在编辑器中打开配置 |
| `openspec feedback` | 通过 GitHub 提交反馈 |
| `openspec completion install` | 安装 shell 补全功能 |

### 支持代理的命令

这些命令支持 `--json` 输出，可供 AI 代理和脚本进行程序化使用：

| Command | Human Use | Agent Use |
|---------|-----------|-----------|
| `openspec list` | 浏览更改/规范 | `--json` 用于结构化数据 |
| `openspec show <item>` | 读取内容 | `--json` 用于解析 |
| `openspec validate` | 检查问题 | `--all --json` 用于批量验证 |
| `openspec status` | 查看工件进度 | `--json` 用于结构化状态 |
| `openspec instructions` | 获取下一步操作 | `--json` 用于代理指令 |
| `openspec templates` | 查找模板路径 | `--json` 用于路径解析 |
| `openspec schemas` | 列出可用模式 (schemas) | `--json` 用于模式发现 |
| `openspec store setup <id>` | 创建并注册本地存储 | 使用显式输入，以获得结构化设置输出的 `--json` |
| `openspec store register <path>` | 注册现有存储 | 使用结构化注册输出的 `--json` |
| `openspec store unregister <id>` | 取消本地存储注册 | 使用结构化清理输出的 `--json` |
| `openspec store remove <id>` | 删除已注册的本地存储文件夹 | 用于非交互式删除的 `--yes --json` |
| `openspec store list` | 浏览已注册的存储 | `--json` 用于结构化注册列表 |
| `openspec store doctor` | 检查本地存储设置 | `--json` 用于结构化诊断 |
| `openspec new change <id>` | 创建仓库本地更改脚手架 (scaffolding) | `--json`，并加上 `--store <id>` 以使用已注册的存储作为 OpenSpec 根 |
| `openspec workset create [name]` | 组合个人工作视图 | 用于非交互式组合的 `--member <path> --json` |
| `openspec workset list` | 浏览已保存的工作集 | `--json` 用于结构化视图 |
| `openspec workset remove <name>` | 删除已保存的视图 | 用于非交互式移除的 `--yes --json` |

---

## 全局选项 (Global Options)

这些选项适用于所有命令：

| Option | Description |
|--------|-------------|
| `--version`, `-V` | 显示版本号 |
| `--no-color` | 禁用彩色输出 |
| `--help`, `-h` | 显示命令帮助 |

---

## 设置命令 (Setup Commands)

### `openspec init`

在您的项目中初始化 OpenSpec。它会创建文件夹结构并配置 AI 工具集成。

默认行为使用全局配置的默认值：profile 为 `core`，delivery 为 `both`，workflows 为 `propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**Arguments (参数):**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | 目标目录（默认为当前目录） |

**Options (选项):**

| Option | Description |
|--------|-------------|
| `--tools <list>` | 非交互式配置 AI 工具。使用 `all`、`none` 或逗号分隔的列表 |
| `--force` | 自动清理遗留文件，无需提示 |
| `--profile <profile>` | 覆盖本次初始化运行的全局 profile（`core` 或 `custom`） |

`--profile custom` 会使用当前在全局配置 (`openspec config profile`) 中选择的工作流。

**支持的工具 ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> 此列表与 `src/core/config.ts` 中的 `AI_TOOLS` 保持一致。请参阅 [Supported Tools](supported-tools.md) 以了解每个工具的技能和命令路径。

**Examples (示例):**

```bash
# 交互式初始化
openspec init

# 在特定目录中初始化
openspec init ./my-project

# 非交互式：为 Claude 和 Cursor 配置
openspec init --tools claude,cursor

# 为所有支持的工具配置
openspec init --tools all

# 覆盖本次运行的 profile
openspec init --profile core

# 跳过提示并自动清理遗留文件
openspec init --force
```

**它会创建什么:**

```
openspec/
├── specs/              # 您的规范 (source of truth)
├── changes/            # 建议更改
└── config.yaml         # 项目配置

.claude/skills/         # Claude Code skills（如果选择了 claude）
.cursor/skills/         # Cursor skills（如果选择了 cursor）
.cursor/commands/       # Cursor OPSX 命令（如果 delivery 包括 commands）
... (其他工具配置)
```

---

### `openspec update`

在升级 CLI 后更新 OpenSpec 指令文件。它会使用您当前的全局 profile、所选的工作流和交付模式重新生成 AI 工具配置文件。

```
openspec update [path] [options]
```

**Arguments (参数):**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | 目标目录（默认为当前目录） |

**Options (选项):**

| Option | Description |
|--------|-------------|
| `--force` | 即使文件是最新的，也强制更新 |

**Example (示例):**

```bash
# npm 升级后更新指令文件
npm update @fission-ai/openspec
openspec update
```

---

## 存储 (Stores)（独立的 OpenSpec 仓库）

> **Beta。** 存储及其基于它们构建的功能（引用、工作上下文、工作集）是新的；命令名称、标志、文件格式和 JSON 输出可能会在不同版本之间发生变化。有关问题优先的入门指南，请参阅 [stores guide](stores-beta/user-guide.md)。

存储 (Store) 是您已注册在该机器上的独立 OpenSpec 仓库——例如一个规划仓库或一个合同仓库。注册一个存储后，普通命令（`list`、`show`、`status`、`validate`、`new change`、`archive` 等）就可以通过传递 `--store <id>` 从任何地方对其进行操作。

### `openspec store setup`

创建并注册本地存储。在终端中不带参数运行时，OpenSpec 会引导用户完成设置。代理和脚本应该传入显式输入并使用 `--json`。

```bash
openspec store setup [id] [options]
```

**Options (选项):**

| Option | Description |
|--------|-------------|
| `--path <path>` | 存储应所在的文件夹（例如 `~/openspec/<id>`） |
| `--remote <url>` | 在新存储的 `store.yaml` 中记录规范远程地址 |
| `--init-git` | 使用初始提交初始化 Git 仓库（默认） |
| `--no-init-git` | 跳过所有 Git 操作：不初始化，不进行初始提交 |
| `--json` | 输出 JSON |

非交互式运行（`--json`、脚本、代理）必须同时传入存储 ID 和 `--path`。在交互式终端中，设置会提示用户输入位置，并提供一个可编辑的建议，显示在一个可见的、由用户拥有的位置（例如 `~/openspec/<id>`）；它绝不会默认使用 OpenSpec 的管理数据目录。

Examples (示例):

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

注册一个现有的本地存储文件夹。

```bash
openspec store register [path] [options]
```

**Options (选项):**

| Option | Description |
|--------|-------------|
| `--id <id>` | 存储 ID；默认为存储元数据或文件夹名称 |
| `--yes` | 确认为健康的 OpenSpec 根创建存储身份元数据 |
| `--json` | 输出 JSON |

### `openspec store unregister`

取消本地存储注册，但不会删除文件。

```bash
openspec store unregister <id> [--json]
```

当存储被移动、克隆到其他地方，或者不应再由本机 OpenSpec 显示时，请使用此命令。

### `openspec store remove`

取消本地存储注册并删除其本地文件夹。

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` 命令会在交互式终端中显示删除前的确切文件夹。代理、脚本和 JSON 调用者必须传入 `--yes` 来确认删除。OpenSpec 会拒绝删除不包含匹配存储元数据的文件夹。

### `openspec store list`

列出本地已注册的存储。

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

检查本地存储注册、元数据和 Git 存在性。

```bash
openspec store doctor [id] [--json]
```

Doctor 命令仅用于诊断；它会报告缺失的根目录、元数据不匹配以及无效的本地注册状态，而不会修改存储本身。

### 从项目中引用存储 (Referencing stores from a project)

项目仓库可以在 `openspec/config.yaml` 中声明其工作所依赖的存储：

```yaml
schema: spec-driven
references:
  - team-context
```

此后，该仓库中 `openspec instructions` 的输出（包括每个工件和 `apply` 视图中的 JSON 和人类模式）都会包含对每个引用存储的索引——即规范 ID、来自每个规范 Purpose 部分的一行摘要以及获取命令 (`openspec show <spec-id> --type spec --store <id>`)。该索引在每次运行中都实时构建自已注册的检出；规范内容绝不会被复制到输出中。

引用是只读上下文。它们永远不会改变命令的操作对象：工作仍然保留在仓库自身的根目录中，写入引用的存储仍然是一个显式的 `--store` 操作。如果一个引用无法解析（例如，该存储未在该机器上注册），它将退化为索引中的一个警告，并提供确切的修复方法，指令仍会生成。`openspec doctor` 会在一个地方报告引用的健康状况。

### 记录存储是从何处克隆下来的 (Recording where a store is cloned from)

存储可以在其提交身份文件中记录其规范克隆源，从而使“注册存储”这一步骤不再是终点：

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

该远程地址会记录在初始提交的 `.openspec-store/store.yaml` 中，因此每次克隆时都会知道这一点。对于现有存储，请手动编辑 `store.yaml` 并提交。`store doctor` 会显示记录的远程地址（以及检出观察到的 Git 原始地址）；setup/register 会为其命名指导；而 register 则会在本地机器注册表中记录该检出的原始地址。

引用声明也可以携带克隆源，这样即使队友尚未拥有该存储，也能获得一个完整、可粘贴的修复命令（`git clone <remote> <path> && openspec store register <path> --id <id>`）：

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

记录远程地址不是同步操作：OpenSpec 绝不会自行克隆、拉取或推送。

### 声明默认存储 (Declaring a default store)

一个其规划完全外部化的仓库（即没有本地的 `openspec/specs/` 或 `openspec/changes/`）可以一次性声明其存储，而不是在每个命令中都传递 `--store`：

```yaml
# openspec/config.yaml (openspec/ 下唯一的文件)
store: team-context
```

普通命令随后会自动解析到声明的存储；根横幅和 JSON 中的 `root` 块会报告 `source: "declared"` 并附带存储 ID，打印的提示仍会包含 `--store <id>`。此声明是一个后备选项，绝不是覆盖项：显式的 `--store` 始终获胜，并且一个具有真实规划文件夹的目录会忽略该指针（并发出警告）。要将一个指针仓库转换为本地 OpenSpec 根，请删除 `store:` 行并运行 `openspec init`——只要声明存在，init 就拒绝进行脚手架搭建。

## Doctor（关系健康状况）

一个只读的查询，一处查看：OpenSpec 根目录是否健康，以及它所引用的存储库是否在该机器上可用？

```bash
openspec doctor [--store <id>] [--json]
```

该报告会区分根目录健康状况、存储库元数据健康状况（包括当记录的远程和检出源发生分歧时的提示），以及引用健康状况（相同的诊断说明，并包含未解决引用的修复方案）。任何严重程度的健康发现都会以 0 退出 — agents 会读取 `status` 数组；只有命令失败（没有根目录、未知存储库）才会以 1 退出。Doctor 从不克隆、同步或修复。要获取已组装的集合本身而非其健康状况，请使用 `openspec context`。

## 工作上下文（已组装的集合）

所有通过 OpenSpec 声明所涉及的工作内容，都包含在一个工作集中：即 OpenSpec 根目录及其引用的存储库。

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON 概要文件是 agent 可消费的（每个可用的引用存储库都带有其获取配方；未解决的成员也包含相同的修复说明和 doctor 的显示信息）。`--code-workspace` 还会写入一个 VS Code 工作区文件，其中包含根目录以及所有可用的引用存储库（`ref:<id>` 文件夹）— 这个命令执行的功能是此项操作，如果文件已存在，则在没有 `--force` 参数的情况下会拒绝执行。将不可用的成员进行报告，绝不猜测。

“工作上下文”即为已组装的集合；`openspec/config.yaml` 中的 `context:` 字段是将项目背景注入到指令中的内容 — 这两者是不同的概念。`openspec doctor` 回答的是该集合是否健康；而 `openspec context` 回答的是这个集合是什么。

## 个人工作集 (Personal worksets)

> **Beta。** 工作集是新的 beta 功能集的一部分；命令、标志和文件格式在不同版本之间可能会发生变化。有关操作流程，请参阅 [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together)。

工作集是对你共同工作的文件夹的个人命名视图——它包括一个规划根目录以及你选择的其他内容——存储在你的机器上，并以名称在你工具中重新打开。它是纯本地的：永不提交、永不共享、永不源自声明，并且删除一个工作集不会触及任何成员文件夹。

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` 会运行一个简短的引导流程（或者非交互式地接受 `--member` 标志；第一个成员是主成员——会话从那里开始）。`open` 会启动所选工具：编辑器（VS Code, Cursor）会打开一个包含所有成员的窗口并返回；CLI 代理（Claude Code, codex）则接管此终端，作为带有所有成员附件的一个会话，不会预填充提示，直到你退出。在打开时缺少某个成员文件夹会被跳过并给出提示；其余的都会打开。保存的工具偏好设置可以通过使用 `--tool` 在每次打开时覆盖。

支持新工具是配置，而不是代码。每个工具都属于两种启动样式——`workspace-file`（通过生成的 `.code-workspace` 启动）或 `attach-dirs`（每个成员一个附件标志）——而全局 `config.json` 中的 `openers` 键（使用 `openspec config edit` 打开它）则会根据字段添加工具或调整内置功能：

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

所有工作集状态都存储在全局数据目录的 `worksets/` 文件夹下（保存的视图以及生成的 `<name>.code-workspace` 文件，这些文件在每次打开时都会重新生成）；删除该文件夹就会抹去所有痕迹。

---

## 浏览命令 (Browsing Commands)

### `openspec list`

列出项目中的更改或规范。

```
openspec list [options]
```

**选项:**

| 选项 | 描述 |
|--------|-------------|
| `--specs` | 列出规范，而不是更改 |
| `--changes` | 列出更改（默认） |
| `--sort <order>` | 按 `recent`（最近，默认）或 `name` 排序 |
| `--json` | 以 JSON 格式输出 |

**示例:**

```bash
# 列出所有活动的更改
openspec list

# 列出所有规范
openspec list --specs

# 用于脚本的 JSON 输出
openspec list --json
```

**输出（文本）:**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

显示一个用于探索规范和更改的交互式仪表板。

```
openspec view
```

它会打开一个基于终端的界面，用于导航项目的规范和更改。

---

### `openspec show`

显示更改或规范的详细信息。

```
openspec show [item-name] [options]
```

**参数:**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 更改或规范的名称（如果省略，则会提示） |

**选项:**

| 选项 | 描述 |
|--------|-------------|
| `--type <type>` | 指定类型：`change` 或 `spec`（如果不明确，则自动检测） |
| `--json` | 以 JSON 格式输出 |
| `--no-interactive` | 禁用提示 |

**特定于更改的选项:**

| 选项 | 描述 |
|--------|-------------|
| `--deltas-only` | 只显示 delta 规范（JSON 模式） |

**特定于规范的选项:**

| 选项 | 描述 |
|--------|-------------|
| `--requirements` | 只显示要求，排除场景（JSON 模式） |
| `--no-scenarios` | 排除场景内容（JSON 模式） |
| `-r, --requirement <id>` | 通过 1-based 索引显示特定要求（JSON 模式） |

**示例:**

```bash
# 交互式选择
openspec show

# 显示特定的更改
openspec show add-dark-mode

# 显示特定的规范
openspec show auth --type spec

# 用于解析的 JSON 输出
openspec show add-dark-mode --json
```

---

## 验证命令 (Validation Commands)

### `openspec validate`

对更改和规范进行结构性问题验证。

```
openspec validate [item-name] [options]
```

**参数:**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 要验证的特定项目（如果省略，则会提示） |

**选项:**

| 选项 | 描述 |
|--------|-------------|
| `--all` | 验证所有更改和规范 |
| `--changes` | 验证所有更改 |
| `--specs` | 验证所有规范 |
| `--type <type>` | 当名称不明确时指定类型：`change` 或 `spec` |
| `--strict` | 启用严格验证模式 |
| `--json` | 以 JSON 格式输出 |
| `--concurrency <n>` | 最大并行验证数（默认：6，或 `OPENSPEC_CONCURRENCY` 环境变量） |
| `--no-interactive` | 禁用提示 |

**示例:**

```bash
# 交互式验证
openspec validate

# 验证特定的更改
openspec validate add-dark-mode

# 验证所有更改
openspec validate --changes

# 使用 JSON 输出验证所有内容（用于 CI/脚本）
openspec validate --all --json

# 增加并行度的严格验证
openspec validate --all --strict --concurrency 12
```

**输出（文本）:**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**输出（JSON）:**

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

## 生命周期命令 (Lifecycle Commands)

### `openspec archive`

归档一个已完成的更改，并将 delta 规范合并到主规范中。

```
openspec archive [change-name] [options]
```

**参数:**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要归档的更改（如果省略，则会提示） |

**选项:**

| 选项 | 描述 |
|--------|-------------|
| `-y, --yes` | 跳过确认提示 |
| `--skip-specs` | 跳过规范更新（用于基础设施/工具链/文档专用更改） |
| `--no-validate` | 跳过验证（需要确认） |

**示例:**

```bash
# 交互式归档
openspec archive

# 归档特定的更改
openspec archive add-dark-mode

# 不带提示的归档（CI/脚本）
openspec archive add-dark-mode --yes

# 归档一个不影响规范的工具链更改
openspec archive update-ci-config --skip-specs
```

**功能说明:**

1. 验证更改（除非使用 `--no-validate`）
2. 提示确认（除非使用 `--yes`）
3. 将 delta 规范合并到 `openspec/specs/`
4. 将更改文件夹移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## 工作流命令 (Workflow Commands)

这些命令支持面向产物的 OPSX 工作流。它们对于检查进度的用户和确定下一步行动的代理都非常有用。

### `openspec new change`

在已解析的 OpenSpec 根目录中创建更改目录和可选的已提交元数据。

```bash
openspec new change <name> [options]
```

**选项:**

| 选项 | 描述 |
|--------|-------------|
| `--description <text>` | 要添加到 `index.md` 的描述 |
| `--goal <text>` | 可选的目标元数据，与更改一起存储 |
| `--schema <name>` | 要使用的工作流模式 (Workflow schema) |
| `--store <id>` | 用作 OpenSpec 根的存储 ID（一个存储是一个你已注册的独立 OpenSpec 仓库） |
| `--json` | JSON 输出 |

**示例:**

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

显示更改的产物完成状态。

```
openspec status [options]
```

**选项:**

| 选项 | 描述 |
|--------|-------------|
| `--change <id>` | 更改名称（如果省略，则会提示） |
| `--schema <name>` | 模式覆盖（从更改的配置中自动检测） |
| `--json` | 以 JSON 格式输出 |

**示例:**

```bash
# 交互式状态检查
openspec status

# 特定更改的状态
openspec status --change add-dark-mode

# 用于代理的 JSON
openspec status --change add-dark-mode --json
```

**输出（文本）:**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**输出（JSON）:**

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

获取创建产物或应用任务的增强型说明。AI 代理使用此命令来了解下一步应该创建什么。

```
openspec instructions [artifact] [options]
```

**参数:**

| 参数 | 是否必需 | 描述 |
|----------|----------|-------------|
| `artifact` | 否 | 产物 ID：`proposal`、`specs`、`design`、`tasks` 或 `apply` |

**选项:**

| 选项 | 描述 |
|--------|-------------|
| `--change <id>` | 更改名称（在非交互模式下必需） |
| `--schema <name>` | 模式覆盖 |
| `--json` | 以 JSON 格式输出 |

**特殊情况:** 使用 `apply` 作为产物，以获取任务实现说明。

**示例:**

```bash
# 获取下一个产物的说明
openspec instructions --change add-dark-mode

# 获取特定产物的说明
openspec instructions design --change add-dark-mode

# 获取 apply/实现说明
openspec instructions apply --change add-dark-mode

# 用于代理的 JSON
openspec instructions design --change add-dark-mode --json
```

**输出包括:**

- 产物的模板内容
- 来自配置的项目上下文
- 来自依赖产物的内容
- 来自配置的每个产物规则

---

### `openspec templates`

显示模式中所有产物的已解析模板路径。

```bash
openspec templates [options]
```

**选项:**

| 选项 | 描述 |
|--------|-------------|
| `--schema <name>` | 要检查的模式（默认：`spec-driven`） |
| `--json` | 以 JSON 格式输出 |

**示例:**

```bash
# 显示默认模式的模板路径
openspec templates

# 显示自定义模式的模板
openspec templates --schema my-workflow

# 用于程序化使用的 JSON
openspec templates --json
```

**输出（文本）:**

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

列出所有可用的工作流模式及其描述和产物流程。

```bash
openspec schemas [options]
```

**选项:**

| 选项 | 描述 |
|--------|-------------|
| `--json` | 以 JSON 格式输出 |

**示例:**

```bash
openspec schemas
```

**输出:**

```
Available schemas:

  spec-driven (package)
    默认的 spec-driven 开发工作流
    流程：proposal → specs → design → tasks

  my-custom (project)
    本项目自定义的工作流
    流程：research → proposal → tasks
```

## 模式命令

用于创建和管理自定义工作流模式的命令。

### `openspec schema init`

创建一个新的项目本地模式。

```
openspec schema init <name> [options]
```

**Arguments (参数):**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | Yes | 模式名称（kebab-case） |

**Options (选项):**

| Option | Description |
|--------|-------------|
| `--description <text>` | 模式描述 |
| `--artifacts <list>` | 产物 ID 列表（默认值：`proposal,specs,design,tasks`） |
| `--default` | 设置为项目默认模式 |
| `--no-default` | 不提示设置为默认值 |
| `--force` | 覆盖现有模式 |
| `--json` | 以 JSON 格式输出 |

**Examples (示例):**

```bash
# 交互式模式创建
openspec schema init research-first

# 指定特定产物的非交互式创建
openspec schema init rapid \
  --description "快速迭代工作流" \
  --artifacts "proposal,tasks" \
  --default
```

**What it creates (它会生成什么):**

```
openspec/schemas/<name>/
├── schema.yaml           # 模式定义
└── templates/
    ├── proposal.md       # 每个产物的模板
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

将现有模式复制到您的项目以供自定义使用。

```
openspec schema fork <source> [name] [options]
```

**Arguments (参数):**

| Argument | Required | Description |
|----------|----------|-------------|
| `source` | Yes | 要复制的模式 |
| `name` | No | 新的模式名称（默认值：`<source>-custom`） |

**Options (选项):**

| Option | Description |
|--------|-------------|
| `--force` | 覆盖现有目标模式 |
| `--json` | 以 JSON 格式输出 |

**Example (示例):**

```bash
# Fork 内置的 spec-driven 模式
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

验证模式的结构和模板。

```
openspec schema validate [name] [options]
```

**Arguments (参数):**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | 要验证的模式（如果省略，则验证所有） |

**Options (选项):**

| Option | Description |
|--------|-------------|
| `--verbose` | 显示详细的验证步骤 |
| `--json` | 以 JSON 格式输出 |

**Example (示例):**

```bash
# 验证特定的模式
openspec schema validate my-workflow

# 验证所有模式
openspec schema validate
```

---

### `openspec schema which`

显示一个模式是从哪里解析出来的（这对于调试优先级非常有用）。

```
openspec schema which [name] [options]
```

**Arguments (参数):**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | 模式名称 |

**Options (选项):**

| Option | Description |
|--------|-------------|
| `--all` | 列出所有模式及其来源 |
| `--json` | 以 JSON 格式输出 |

**Example (示例):**

```bash
# 检查一个模式的来源
openspec schema which spec-driven
```

**Output (输出):**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schema precedence (模式优先级):**

1. Project（项目）：`openspec/schemas/<name>/`
2. User（用户）：`~/.local/share/openspec/schemas/<name>/`
3. Package（包）：内置模式

---

## 配置命令

### `openspec config`

查看和修改全局 OpenSpec 配置。

```
openspec config <subcommand> [options]
```

**Subcommands (子命令):**

| Subcommand | Description |
|------------|-------------|
| `path` | 显示配置文件的位置 |
| `list` | 显示所有当前设置 |
| `get <key>` | 获取特定的值 |
| `set <key> <value>` | 设置一个值 |
| `unset <key>` | 移除一个键 |
| `reset` | 重置为默认值 |
| `edit` | 在 `$EDITOR` 中打开配置 |
| `profile [preset]` | 交互式地或通过预设配置工作流配置文件 |

**Examples (示例):**

```bash
# 显示配置文件路径
openspec config path

# 列出所有设置
openspec config list

# 获取一个特定的值
openspec config get telemetry.enabled

# 设置一个值
openspec config set telemetry.enabled false

# 显式地设置字符串值
openspec config set user.name "My Name" --string

# 移除一个自定义设置
openspec config unset user.name

# 重置所有配置
openspec config reset --all --yes

# 在编辑器中编辑配置
openspec config edit

# 使用基于操作员的向导来配置工作流配置文件
openspec config profile

# 快速预设：将工作流切换到核心模式（保留交付模式）
openspec config profile core
```

`openspec config profile` 会先显示当前状态摘要，然后让您选择：
- 更改交付方式 + 工作流
- 只更改交付方式
- 只更改工作流
- 保留当前设置（退出）

如果您保留当前设置，则不会写入任何更改，也不会显示更新提示。
如果没有配置更改，但当前的项目文件与您的全局配置文件/交付模式不同步，OpenSpec 将会显示一个警告并建议运行 `openspec update`。
按下 `Ctrl+C` 也会干净地取消流程（不产生堆栈跟踪），并以代码 `130` 退出。
在工作流检查清单中，`[x]` 表示该工作流已在全局配置中选中。要将这些选择应用到项目文件，请运行 `openspec update`（或在项目中提示时选择“立即将更改应用于此项目？”）。

**Interactive examples (交互式示例):**

```bash
# 只更新交付方式
openspec config profile
# 选择：只更改交付方式
# 选择交付方式：技能

# 工作流专用更新
openspec config profile
# 选择：只更改工作流
# 切换检查清单中的工作流，然后确认
```

---

## 实用工具命令

### `openspec feedback`

提交关于 OpenSpec 的反馈。这会创建一个 GitHub issue。

```
openspec feedback <message> [options]
```

**Arguments (参数):**

| Argument | Required | Description |
|----------|----------|-------------|
| `message` | Yes | 反馈信息 |

**Options (选项):**

| Option | Description |
|--------|-------------|
| `--body <text>` | 详细描述 |

**Requirements (要求):** 必须安装并认证 GitHub CLI (`gh`)。

**Example (示例):**

```bash
openspec feedback "为自定义产物类型添加支持" \
  --body "我希望能够定义超出内置类型的自定义产物。"
```

---

### `openspec completion`

管理 OpenSpec CLI 的 Shell 补全功能。

```
openspec completion <subcommand> [shell]
```

**Subcommands (子命令):**

| Subcommand | Description |
|------------|-------------|
| `generate [shell]` | 将补全脚本输出到标准输出 |
| `install [shell]` | 为您的 Shell 安装补全功能 |
| `uninstall [shell]` | 移除已安装的补全功能 |

**Supported shells (支持的 Shell):** `bash`, `zsh`, `fish`, `powershell`

**Examples (示例):**

```bash
# 安装补全功能（自动检测 Shell）
openspec completion install

# 为特定的 Shell 安装
openspec completion install zsh

# 生成用于手动安装的脚本
openspec completion generate bash > ~/.bash_completion.d/openspec

# 卸载
openspec completion uninstall
```

---

## Exit Codes (退出代码)

| Code | Meaning |
|------|---------|
| `0` | 成功 |
| `1` | 错误（验证失败、文件缺失等） |

---

## Environment Variables (环境变量)

| Variable | Description |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | 设置为 `0` 以禁用遥测功能 |
| `DO_NOT_TRACK` | 设置为 `1` 以禁用遥测功能（标准的 DNT 信号） |
| `OPENSPEC_CONCURRENCY` | 大批量验证的默认并发数（默认值：6） |
| `EDITOR` or `VISUAL` | 用于 `openspec config edit` 的编辑器 |
| `NO_COLOR` | 设置后禁用彩色输出 |

---

## Related Documentation (相关文档)

- [Commands](commands.md) - AI 助手命令（`/opsx:propose`, `/opsx:apply` 等）
- [Workflows](workflows.md) - 常见模式以及何时使用每个命令
- [Customization](customization.md) - 创建自定义模式和模板
- [Getting Started](getting-started.md) - 初次设置指南