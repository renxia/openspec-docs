# CLI 参考

OpenSpec CLI（`openspec`）提供用于项目初始化、验证、状态检查与管理的终端命令。这些命令是对[Commands](commands.md)中记录的 AI 斜杠命令（如 `/opsx:propose`）的补充。

## 摘要

| 分类 | 命令 | 用途 |
|----------|----------|---------|
| **初始化** | `init`, `update` | 在项目中初始化与更新 OpenSpec |
| **存储库（独立 OpenSpec 仓库）** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | 管理存储库——即你已注册的独立 OpenSpec 仓库 |
| **健康检查** | `doctor` | 报告已解析根目录的关系健康状态 |
| **工作上下文** | `context` | 组装工作集（根目录 + 引用的存储库） |
| **个人工作集** | `workset create`, `workset list`, `workset open`, `workset remove` | 在工具中保存并打开个人本地工作视图 |
| **浏览** | `list`, `view`, `show` | 浏览变更与规范 |
| **验证** | `validate` | 检查变更与规范是否存在问题 |
| **生命周期** | `archive` | 归档已完成的变更 |
| **工作流** | `new change`, `status`, `instructions`, `templates`, `schemas` | 支持基于产物的工作流 |
| **规范** | `schema init`, `schema fork`, `schema validate`, `schema which` | 创建与管理自定义工作流 |
| **配置** | `config` | 查看与修改配置 |
| **工具** | `feedback`, `completion` | 反馈与 shell 集成 |

---

## 人工命令与代理命令

大多数CLI命令是为终端中的**人工使用**设计的。部分命令还支持通过JSON输出供**代理/脚本使用**。

### 仅人工使用的命令

这些命令具有交互性，专为终端使用设计：

| 命令 | 用途 |
|---------|---------|
| `openspec init` | 初始化项目（交互式提示） |
| `openspec view` | 交互式仪表盘 |
| `openspec workset open <name>` | 打开已保存的工作集（编辑器窗口或终端代理会话） |
| `openspec config edit` | 在编辑器中打开配置文件 |
| `openspec feedback` | 通过GitHub提交反馈 |
| `openspec completion install` | 安装shell自动补全 |

### 代理兼容命令

这些命令支持`--json`输出，可供AI代理和脚本进行编程式使用：

| 命令 | 人工用途 | 代理用途 |
|---------|-----------|-----------|
| `openspec list` | 浏览变更/规范 | 通过`--json`获取结构化数据 |
| `openspec show <item>` | 读取内容 | 通过`--json`供解析使用 |
| `openspec validate` | 检查问题 | 通过`--all --json`进行批量校验 |
| `openspec status` | 查看产物进度 | 通过`--json`获取结构化状态 |
| `openspec instructions` | 获取后续步骤 | 通过`--json`获取代理指令 |
| `openspec templates` | 查找模板路径 | 通过`--json`进行路径解析 |
| `openspec schemas` | 列出可用架构 | 通过`--json`进行架构发现 |
| `openspec store setup <id>` | 创建并注册本地存储 | 通过`--json`传入显式输入以获取结构化配置输出 |
| `openspec store register <path>` | 注册已有存储 | 通过`--json`获取结构化注册输出 |
| `openspec store unregister <id>` | 注销本地存储注册 | 通过`--json`获取结构化清理输出 |
| `openspec store remove <id>` | 删除已注册的本地存储文件夹 | 通过`--yes --json`进行非交互式删除 |
| `openspec store list` | 浏览已注册存储 | 通过`--json`获取结构化注册列表 |
| `openspec store doctor` | 检查本地存储配置 | 通过`--json`获取结构化诊断结果 |
| `openspec new change <id>` | 创建仓库本地变更脚手架 | 通过`--json`输出，还可搭配`--store <id>`将已注册存储用作OpenSpec根目录 |
| `openspec workset create [name]` | 组合个人工作视图 | 通过`--member <path> --json`进行非交互式组合 |
| `openspec workset list` | 浏览已保存工作集 | 通过`--json`获取结构化视图 |
| `openspec workset remove <name>` | 删除已保存视图 | 通过`--yes --json`进行非交互式删除 |

---

## 全局选项

这些选项适用于所有命令：

| 选项 | 说明 |
|--------|-------------|
| `--version`, `-V` | 显示版本号 |
| `--no-color` | 禁用彩色输出 |
| `--help`, `-h` | 显示命令帮助 |

---

## 配置命令

### `openspec init`

在项目中初始化OpenSpec。创建文件夹结构并配置AI工具集成。

默认行为使用全局配置默认值：配置文件`core`、交付模式`both`、工作流`propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**参数：**

| 参数 | 是否必填 | 说明 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认：当前目录） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--tools <list>` | 非交互式配置AI工具。可使用`all`、`none`或逗号分隔的列表 |
| `--force` | 无需提示自动清理旧版文件 |
| `--profile <profile>` | 覆盖本次初始化运行的全局配置文件（`core`或`custom`） |

使用`--profile custom`时，会采用全局配置（`openspec config profile`）中当前选定的工作流。

**支持的工具ID（`--tools`）：** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> 该列表与`src/core/config.ts`中的`AI_TOOLS`保持一致。各工具的能力和命令路径请参阅[支持的工具](supported-tools.md)。

**示例：**

```bash
# 交互式初始化
openspec init

# 在指定目录初始化
openspec init ./my-project

# 非交互式：为Claude和Cursor配置
openspec init --tools claude,cursor

# 为所有支持的工具配置
openspec init --tools all

# 覆盖本次运行的配置文件
openspec init --profile core

# 跳过提示，自动清理旧版文件
openspec init --force
```

**生成内容：**

```
openspec/
├── specs/              # 您的规范（唯一事实来源）
├── changes/            # 待提交变更
└── config.yaml         # 项目配置文件

.claude/skills/         # Claude Code 技能（如果选中了claude）
.cursor/skills/         # Cursor 技能（如果选中了cursor）
.cursor/commands/       # Cursor OPSX 命令（如果交付模式包含命令）
...（其他工具配置）
```

---

### `openspec update`

升级CLI后更新OpenSpec指令文件。使用当前全局配置文件、选定工作流和交付模式重新生成AI工具配置文件。

```
openspec update [path] [options]
```

**参数：**

| 参数 | 是否必填 | 说明 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认：当前目录） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--force` | 即使文件已是最新版本，仍强制更新 |

**示例：**

```bash
# npm升级后更新指令文件
npm update @fission-ai/openspec
openspec update
```

---

## 存储（独立OpenSpec仓库）

> **测试版。** 存储及基于存储构建的功能（引用、工作上下文、工作集）均为新功能；不同版本间，命令名称、标志、文件格式和JSON输出的形态可能发生变化。如需了解以问题为导向的入门指南，请参阅[存储指南](stores-beta/user-guide.md)。

存储是您在此机器上注册的独立OpenSpec仓库，例如规划仓库或合约仓库。注册存储后，即可通过传入`--store <id>`参数，让常规命令（`list`、`show`、`status`、`validate`、`new change`、`archive`等）在任何位置对该存储执行操作。

### `openspec store setup`

创建并注册本地存储。在终端中不带参数运行时，OpenSpec会引导用户完成配置。代理和脚本应传入显式输入并使用`--json`参数。

```bash
openspec store setup [id] [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--path <path>` | 存储所在的文件夹（例如`~/openspec/<id>`） |
| `--remote <url>` | 在新存储的`store.yaml`中记录规范的远程仓库地址 |
| `--init-git` | 初始化Git仓库并创建初始提交（默认行为） |
| `--no-init-git` | 跳过所有Git操作：不初始化，不创建初始提交 |
| `--json` | 输出JSON格式 |

非交互式运行（使用`--json`、脚本、代理）必须同时传入存储ID和`--path`参数。在交互式终端中，配置流程会提示输入存储位置，并提供位于用户可见、用户拥有权限的目录下的可编辑建议（例如`~/openspec/<id>`）；它永远不会默认使用OpenSpec的托管数据目录。

示例：

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

注册已有的本地存储文件夹。在存储测试版期间，根目录可以在任何变更存在、规范已应用或变更已归档之前完成注册；这种情况下，`openspec/changes/`、`openspec/specs/`和`openspec/changes/archive/`目录可能在常规命令创建它们之前不存在。仅包含配置、声明了`store: <id>`的仓库仍是指向另一个存储的指针，除非移除该指针，否则不会注册为存储根目录。

```bash
openspec store register [path] [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--id <id>` | 存储ID；默认使用存储元数据或文件夹名称 |
| `--yes` | 确认为正常的OpenSpec根目录创建存储身份元数据 |
| `--json` | 输出JSON格式 |

### `openspec store unregister`

注销本地存储注册，不删除相关文件。

```bash
openspec store unregister <id> [--json]
```

当存储被移动、克隆到其他位置，或不再需要在此机器上由OpenSpec显示时，可使用此命令。

### `openspec store remove`

注销本地存储注册并删除其本地文件夹。

```bash
openspec store remove <id> [--yes] [--json]
```

在交互式终端中，`remove`命令会在删除前显示确切的文件夹路径。代理、脚本和JSON调用方必须传入`--yes`参数确认删除。如果文件夹不包含匹配的存储元数据，OpenSpec会拒绝删除。

### `openspec store list`

列出本地已注册的存储。

```bash
openspec store list [--json]
openspec store ls [--json]
```

`openspec store ls`是`openspec store list`的简写。

### `openspec store doctor`

检查本地存储注册状态、元数据和Git仓库是否存在。

```bash
openspec store doctor [id] [--json]
```

`doctor`命令仅用于诊断；它会报告缺失的根目录、元数据不匹配以及无效的本地注册表状态，不会修改存储。

### 从项目引用存储

项目仓库可以在`openspec/config.yaml`中声明其工作所依赖的存储：

```yaml
schema: spec-driven
references:
  - team-context
```

此后，该仓库中`openspec instructions`的输出（包括单产物和`apply`界面，JSON和人工模式）会携带每个被引用存储的规范索引——包括规范ID、各规范Purpose章节的一行摘要，以及获取命令（`openspec show <spec-id> --type spec --store <id>`）。该索引会在每次运行时从已注册的检出版本实时生成；规范内容永远不会被复制到输出中。

引用是只读上下文。它们不会改变命令的执行位置：工作始终在仓库自身的根目录下进行，向被引用存储写入内容仍需显式执行`--store`操作。无法解析的引用（例如未在此机器上注册的存储）会在索引中降级为警告，并附带精确的修复方案，指令仍会正常生成。`openspec doctor`会在一个位置统一报告引用的健康状态。

### 记录存储的克隆来源

存储可以在其已提交的身份文件中记录规范的克隆来源，这样新成员入职时不会卡在“注册存储”这一步：

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

远程仓库地址会保存在初始提交中的`.openspec-store/store.yaml`文件里，因此每个克隆出的仓库都会自带该信息。对于已有存储，可手动编辑`store.yaml`文件并提交。`store doctor`会显示已记录的远程地址（以及检出仓库的观测Git源）；配置/注册共享指南会命名该地址；注册操作会将检出仓库的源地址记录到机器本地注册表中。

引用声明也可以携带克隆来源，这样尚未获取存储的团队成员就能获得完整的、可直接粘贴的修复命令（`git clone <remote> <path> && openspec store register <path> --id <id>`）：

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

记录远程地址不等于同步：OpenSpec永远不会自行执行克隆、拉取或推送操作。

### 声明默认存储

对于完全外部化规划（本地无`openspec/specs/`或`openspec/changes/`目录）的仓库，可以一次性声明其存储，而无需在每个命令中传入`--store`参数：

```yaml
# openspec/config.yaml（openspec/目录下唯一的文件）
store: team-context
```

此后，常规命令会自动解析到声明的存储；根目录横幅和JSON `root`块会报告`source: "declared"`及存储ID，打印的提示信息仍会携带`--store <id>`。该声明是回退方案，而非覆盖规则：显式传入的`--store`参数始终优先，包含真实规划文件夹的目录会忽略该指针（并附带警告）。要将指针仓库转换为本地OpenSpec根目录，请删除`store:`行并运行`openspec init`——只要声明存在，init命令拒绝创建脚手架。

机器级别的变体可一次性覆盖所有仓库：`openspec config set defaultStore <id>`（请参阅配置章节）。该配置仅在`--store`参数、本地根目录和项目指针均无法解析时生效；此时根目录横幅和JSON `root`块会报告`source: "global_default"`。

## doctor（关联健康检查）

一个只读问题，一个位置：OpenSpec 根目录是否健康，以及它引用的存储库是否在当前机器上可用？

```bash
openspec doctor [--store <id>] [--json]
```

报告会拆分出根目录健康状态、存储库元数据健康状态（包括记录中的远程仓库与检出目录的源地址不一致时的提示，以及存储库检出目录落后于上次获取的上游跟踪引用时的提示），以及引用健康状态（会展示与诊断指令相同的修复说明，包含未解析引用的克隆修复方案）。任何严重程度的健康检查结果都会以退出码 0 结束——代理程序会读取 `status` 数组；仅当出现命令失败（无根目录、未知存储库）时才会以退出码 1 结束。doctor 命令永远不会执行克隆、同步或修复操作。若要获取已组装集合本身而非其健康状态，请使用 `openspec context`。

## 工作上下文（已组装集合）

所有通过 OpenSpec 声明关联的工作内容，统一归入一个工作集合：即 OpenSpec 根目录及其引用的所有存储库。

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

输出的 JSON 简报可供代理程序消费（每个可用的引用存储库都会附带其获取方案；未解析的成员会附带与 doctor 命令输出相同的修复说明）。`--code-workspace` 参数还会生成一个 VS Code 工作区文件，其中包含根目录以及所有可用的引用存储库（以 `ref:<id>` 文件夹的形式存储）——这是该命令执行的唯一写入操作，若文件已存在且未携带 `--force` 参数，该操作会被拒绝。不可用的成员会被上报，不会进行任何猜测。

「工作上下文」指的是已组装的集合；`openspec/config.yaml` 中的 `context:` 字段是注入到指令中的项目背景信息——二者是完全不同的概念。`openspec doctor` 命令用于回答集合是否健康；`openspec context` 命令用于回答集合的具体内容是什么。

## 个人工作集

> **Beta 版。** 工作集属于新的 Beta 测试功能；命令、标志位和文件格式在不同版本间可能会发生变化。操作指南请参阅[存储指南](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together)。

工作集是你协同工作的文件夹的个人命名视图——包含一个规划根目录以及你自行选择的其他文件夹——存储在你的本地机器上，可通过名称在工具中重新打开。它完全是本地化的：不会被提交、不会被共享、不会从声明派生而来，删除工作集也绝不会影响任何成员文件夹。

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` 会运行简短的引导流程（或通过 `--member` 标志位以非交互方式创建；第一个成员是主目录——会话会从该目录启动）。`open` 会启动你选择的工具：编辑器（VS Code、Cursor）会打开包含所有成员的窗口后返回；CLI 代理（Claude Code、codex）会接管当前终端作为会话，附加所有成员且无预填充提示，退出时会话结束。若打开时某个成员文件夹缺失，会跳过该文件夹并给出提示，其余文件夹正常打开。保存的工具偏好可通过每次打开时传入 `--tool` 标志位覆盖。

支持新工具只需配置，无需修改代码。每个工具属于以下两种启动风格之一——`workspace-file`（通过生成的 `.code-workspace` 文件启动）或 `attach-dirs`（每个成员对应一个附加标志位）——全局 `config.json` 中的 `openers` 键（可通过 `openspec config edit` 打开该文件）可添加工具或按字段调整内置配置：

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

所有工作集状态都存储在全局数据目录的 `worksets/` 文件夹下（包含保存的视图以及每次打开时重新生成的 `<name>.code-workspace` 文件）；删除该文件夹会清除所有工作集相关痕迹。

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
| `--sort <order>` | 按 `recent`（最近，默认）或 `name`（名称）排序 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 列出所有活跃变更
openspec list

# 列出所有规范
openspec list --specs

# 为脚本提供 JSON 格式输出
openspec list --json
```

**输出（文本格式）：**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

显示用于浏览规范和变更的交互式仪表盘。

```
openspec view
```

打开终端界面，用于导航项目的规范和变更。

---

### `openspec show`

显示变更或规范的详细信息。

```
openspec show [item-name] [options]
```

**参数：**

| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 变更或规范的名称（省略时会提示输入） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--type <type>` | 指定类型：`change`（变更）或 `spec`（规范）（名称无歧义时自动检测） |
| `--json` | 以 JSON 格式输出 |
| `--no-interactive` | 禁用提示 |

**变更专属选项：**

| 选项 | 描述 |
|--------|-------------|
| `--deltas-only` | 仅显示增量规范（JSON 模式） |

**规范专属选项：**

| 选项 | 描述 |
|--------|-------------|
| `--requirements` | 仅显示需求，排除场景（JSON 模式） |
| `--no-scenarios` | 排除场景内容（JSON 模式） |
| `-r, --requirement <id>` | 按 1 起始的索引显示指定需求（JSON 模式） |

**示例：**

```bash
# 交互式选择
openspec show

# 显示指定变更
openspec show add-dark-mode

# 显示指定规范
openspec show auth --type spec

# 为解析提供 JSON 格式输出
openspec show add-dark-mode --json
```

---

## 验证命令

### `openspec validate`

验证变更和规范的结构问题。

```
openspec validate [item-name] [options]
```

若变更没有规范增量，则验证失败，除非其 `.openspec.yaml` 声明了 `skip_specs: true`（适用于纯重构、工具类或文档类工作——请参阅[示例 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)）。

**参数：**

| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 要验证的特定条目（省略时会提示输入） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--all` | 验证所有变更和规范 |
| `--changes` | 验证所有变更 |
| `--specs` | 验证所有规范 |
| `--type <type>` | 名称有歧义时指定类型：`change` 或 `spec` |
| `--strict` | 启用严格验证模式 |
| `--json` | 以 JSON 格式输出 |
| `--concurrency <n>` | 最大并行验证数（默认：6，或通过 `OPENSPEC_CONCURRENCY` 环境变量设置） |
| `--no-interactive` | 禁用提示 |

**示例：**

```bash
# 交互式验证
openspec validate

# 验证指定变更
openspec validate add-dark-mode

# 验证所有变更
openspec validate --changes

# 验证所有内容并以 JSON 格式输出（适用于 CI/脚本）
openspec validate --all --json

# 严格验证模式，提高并行度
openspec validate --all --strict --concurrency 12
```

**输出（文本格式）：**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**输出（JSON 格式）：**

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

归档已完成的变更，并将增量规范合并到主规范中。

```
openspec archive [change-name] [options]
```

**参数：**

| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要归档的变更（省略时会提示输入） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `-y, --yes` | 跳过确认提示 |
| `--skip-specs` | 单次归档时跳过规范更新。若变更永久没有规范增量，应在其 `.openspec.yaml` 中声明 `skip_specs: true`——此时无需标志位即可归档，不会执行规范相关操作 |
| `--no-validate` | 跳过验证（需要确认） |

**示例：**

```bash
# 交互式归档
openspec archive

# 归档指定变更
openspec archive add-dark-mode

# 无提示归档（适用于 CI/脚本）
openspec archive add-dark-mode --yes

# 归档不影响规范的工具类变更
openspec archive update-ci-config --skip-specs
```

**执行操作：**
1. 验证变更（除非传入 `--no-validate`）
2. 请求确认（除非传入 `--yes`）
3. 将增量规范合并到 `openspec/specs/` 目录
4. 将变更文件夹移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/` 目录

---

## 工作流命令

以下命令支持面向产物的 OPSX 工作流。它们既适用于人工查看进度，也适用于代理判断下一步操作。

### `openspec new change`

在解析后的 OpenSpec 根目录下创建变更目录和可选的可提交元数据。

```bash
openspec new change <name> [options]
```

变更名称必须使用小写 kebab-case 格式。命名规则为：以小写字母开头，后续可包含小写字母、数字和单个连字符；不能以数字开头，不能包含空格、下划线、大写字母、连续连字符，以及首尾连字符。若需包含外部工单 ID，请添加前缀，例如使用 `ticket-123-add-notifications` 而非 `123-add-notifications`。

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--description <text>` | 添加到 `index.md` 的描述内容 |
| `--goal <text>` | 与变更一同存储的可选目标元数据 |
| `--schema <name>` | 要使用的工作流模式 |
| `--store <id>` | 用作 OpenSpec 根目录的存储 ID（存储是你已注册的独立 OpenSpec 仓库） |
| `--json` | 输出 JSON 格式 |

**示例：**

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

显示变更的产物完成状态。

```
openspec status [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--change <id>` | 变更名称（省略时会提示输入） |
| `--schema <name>` | 模式覆盖（从变更的配置中自动检测） |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 交互式状态检查
openspec status

# 查看指定变更的状态
openspec status --change add-dark-mode

# 为代理使用提供 JSON 格式输出
openspec status --change add-dark-mode --json
```

**输出（文本格式）：**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

若变更声明了 `skip_specs: true`，其规范阶段会显示为 `[~] specs (skipped: change declares skip_specs)`，且该阶段不计入完成进度。

**输出（JSON 格式）：**

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

获取创建产物或应用任务的增强指令。AI 代理可使用该命令了解下一步需要创建的内容。

```
openspec instructions [artifact] [options]
```

**参数：**

| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `artifact` | 否 | 产物 ID：`proposal`、`specs`、`design`、`tasks` 或 `apply` |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--change <id>` | 变更名称（非交互模式下必填） |
| `--schema <name>` | 模式覆盖 |
| `--json` | 以 JSON 格式输出 |

**特殊情况：** 使用 `apply` 作为产物可获取任务实施指令。

**示例：**

```bash
# 获取下一个产物的指令
openspec instructions --change add-dark-mode

# 获取指定产物的指令
openspec instructions design --change add-dark-mode

# 获取 apply/实施指令
openspec instructions apply --change add-dark-mode

# 为代理消费提供 JSON 格式输出
openspec instructions design --change add-dark-mode --json
```

**输出包含：**
- 产物的模板内容
- 来自配置的项目上下文
- 依赖产物的内容
- 来自配置的每个产物的专属规则

对于通过 `skip_specs: true` 跳过的产物，输出仅为警告（JSON 格式会额外添加 `skipped`/`warning` 字段）——不得创建该产物。

---

### `openspec templates`

显示模式中所有产物的解析后模板路径。

```
openspec templates [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--schema <name>` | 要检查的模式（默认：`spec-driven`） |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 显示默认模式的模板路径
openspec templates

# 显示自定义模式的模板
openspec templates --schema my-workflow

# 为编程使用提供 JSON 格式输出
openspec templates --json
```

**输出（文本格式）：**

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

列出可用的工作流模式，包含其描述和产物流程。

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

## 模式命令

用于创建和管理自定义工作流模式的命令。

### `openspec schema init`

创建一个新的项目级本地模式。

```
openspec schema init <name> [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `name` | 是 | 模式名称（短横线命名法 / kebab-case） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--description <text>` | 模式描述 |
| `--artifacts <list>` | 工件ID列表（逗号分隔，默认值：`proposal,specs,design,tasks`） |
| `--default` | 设为项目默认模式 |
| `--no-default` | 不提示设为默认 |
| `--force` | 覆盖已存在的模式 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 交互式创建模式
openspec schema init research-first

# 非交互式指定工件创建
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**生成内容：**

```
openspec/schemas/<name>/
├── schema.yaml           # 模式定义
└── templates/
    ├── proposal.md       # 各工件模板
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

将现有模式复制到项目中以便自定义。

```
openspec schema fork <source> [name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `source` | 是 | 要复制的模式 |
| `name` | 否 | 新模式名称（默认值：`<source>-custom`） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--force` | 覆盖已存在的目标模式 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 复刻内置的 spec-driven 模式
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

验证模式的结构和模板是否合法。

```
openspec schema validate [name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `name` | 否 | 要验证的模式名称（省略时验证所有模式） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--verbose` | 显示详细的验证步骤 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 验证指定模式
openspec schema validate my-workflow

# 验证所有模式
openspec schema validate
```

---

### `openspec schema which`

显示模式的解析来源（用于调试优先级问题）。

```
openspec schema which [name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `name` | 否 | 模式名称 |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--all` | 列出所有模式及其来源 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# 查看模式的来源
openspec schema which spec-driven
```

**输出：**

```
spec-driven 解析来源：package
  来源：/usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**模式优先级：**
1. 项目级：`openspec/schemas/<name>/`
2. 用户级：`~/.local/share/openspec/schemas/<name>/`
3. 包级：内置模式

---

## 配置命令

### `openspec config`

查看和修改 OpenSpec 全局配置。

```
openspec config <subcommand> [options]
```

**子命令：**

| 子命令 | 说明 |
|------------|-------------|
| `path` | 显示配置文件路径 |
| `list` | 显示所有当前设置 |
| `get <key>` | 获取指定配置项的值 |
| `set <key> <value>` | 设置配置项的值 |
| `unset <key>` | 删除指定配置项 |
| `reset` | 重置为默认值 |
| `edit` | 在 `$EDITOR` 中打开配置文件 |
| `profile [preset]` | 通过交互式向导或预设配置工作流配置文件 |

**示例：**

```bash
# 显示配置文件路径
openspec config path

# 列出所有配置项
openspec config list

# 获取指定配置项的值
openspec config get telemetry.enabled

# 设置配置项的值
openspec config set telemetry.enabled false

# 显式设置字符串类型值
openspec config set user.name "My Name" --string

# 删除自定义配置项
openspec config unset user.name

# 设置机器级默认存储（当未指定 --store、本地根目录或项目存储时，作为回退根目录：指针将解析到该存储）
openspec config set defaultStore team-plans

# 重置所有配置
openspec config reset --all --yes

# 在编辑器中打开配置文件
openspec config edit

# 通过基于操作的向导配置配置文件
openspec config profile

# 快速预设：将工作流切换为核心模式（保留交付模式）
openspec config profile core
```

`openspec config profile` 会先展示当前状态摘要，然后提供以下选项：
- 更改交付模式 + 工作流
- 仅更改交付模式
- 仅更改工作流
- 保留当前设置（退出）

如果选择保留当前设置，则不会写入任何更改，也不会显示更新提示。
如果配置未发生变更，但当前项目文件与全局配置文件/交付模式不同步，OpenSpec 会显示警告并建议运行 `openspec update`。
按下 `Ctrl+C` 也会干净地取消流程（不会输出堆栈跟踪），并以退出码 `130` 结束。
在工作流清单中，`[x]` 表示该工作流已在全局配置中选中。要将这些选择应用到项目文件，请运行 `openspec update`（或在项目内收到提示时选择 `立即将更改应用到当前项目？`）。

**交互式示例：**

```bash
# 仅更新交付模式
openspec config profile
# 选择：仅更改交付模式
# 选择交付模式：仅技能

# 仅更新工作流
openspec config profile
# 选择：仅更改工作流
# 在清单中切换工作流选项，然后确认
```

---

## 工具命令

### `openspec feedback`

提交 OpenSpec 相关反馈。该命令会自动创建 GitHub issue。

```
openspec feedback <message> [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `message` | 是 | 反馈内容 |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--body <text>` | 详细描述 |

**前置要求：** 必须安装并已认证 GitHub CLI（`gh`）。

**示例：**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

管理 OpenSpec CLI 的 shell 自动补全。

```
openspec completion <subcommand> [shell]
```

**子命令：**

| 子命令 | 说明 |
|------------|-------------|
| `generate [shell]` | 输出补全脚本到标准输出 |
| `install [shell]` | 为当前 shell 安装自动补全 |
| `uninstall [shell]` | 卸载已安装的自动补全 |

**支持的 shell：** `bash`、`zsh`、`fish`、`powershell`

**示例：**

```bash
# 安装自动补全（自动检测当前 shell）
openspec completion install

# 为指定 shell 安装
openspec completion install zsh

# 生成脚本用于手动安装
openspec completion generate bash > ~/.bash_completion.d/openspec

# 卸载
openspec completion uninstall
```

---

## 退出码

| 退出码 | 含义 |
|------|---------|
| `0` | 成功 |
| `1` | 错误（验证失败、文件缺失等） |

---

## 环境变量

| 变量名 | 说明 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | 设为 `0` 可禁用遥测 |
| `DO_NOT_TRACK` | 设为 `1` 可禁用遥测（标准 DNT 信号） |
| `OPENSPEC_CONCURRENCY` | 批量验证的默认并发数（默认值：6） |
| `EDITOR` 或 `VISUAL` | `openspec config edit` 使用的编辑器 |
| `NO_COLOR` | 设置后禁用彩色输出 |

---

## 相关文档

- [命令](commands.md) - AI 斜杠命令（`/opsx:propose`、`/opsx:apply` 等）
- [工作流](workflows.md) - 常见模式及各命令的使用场景
- [自定义配置](customization.md) - 创建自定义模式和模板
- [快速入门](getting-started.md) - 首次设置指南