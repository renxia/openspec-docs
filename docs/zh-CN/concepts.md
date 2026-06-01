# 概念

本指南阐述了 OpenSpec 的核心理念及其相互关联。关于实际用法，请参阅[入门指南](getting-started.md)和[工作流](workflows.md)。

## 核心理念

OpenSpec 围绕四项原则构建：

```
流动而非僵化         —— 无阶段门禁，按需开展有意义的工作
迭代而非瀑布         —— 边构建边学习，持续优化
简洁而非复杂         —— 轻量化配置，最少化仪式
棕地优先             —— 适用于现有代码库，而非仅限于绿地开发
```

### 为何这些原则至关重要

**流动而非僵化。** 传统规范系统将您锁定在固定阶段：先规划，再实施，然后结束。OpenSpec 更具灵活性——您可以按照工作需要的顺序自由创建产出物。

**迭代而非瀑布。** 需求会变化，理解会深入。初始看似可行的方法，在接触代码库后可能不再适用。OpenSpec 拥抱这一现实。

**简洁而非复杂。** 某些规范框架需要大量配置、严格格式或繁重流程。OpenSpec 尽量减少干预。只需数秒即可初始化，立即开始工作，仅在需要时才进行定制。

**棕地优先。** 多数软件工作并非从零开始构建——而是修改现有系统。OpenSpec 的增量方法能轻松规范现有行为的变更，而非仅仅描述新系统。

## 全景概览

OpenSpec 将你的工作组织到两个主要领域：

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  权威来源            │◄─────│  待合入的修改                 │   │
│   │  描述你的系统        │ 合并 │  每个修改 = 一个文件夹        │   │
│   │  当前是如何工作的    │      │  包含产物与增量                │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**规范 (Specs)** 是权威来源——它们描述了你系统当前的行为方式。

**修改 (Changes)** 是待合入的修改建议——它们位于独立的文件夹中，直到你准备合并它们。

这种分离是关键。你可以并行处理多个修改而不会产生冲突。你可以在修改影响主规范之前对其进行审查。当你归档一个修改时，其增量将干净地合并到权威来源中。

## 协调工作区

工作区支持目前处于测试阶段。下面描述的本地视图模型是当前的发展方向，但外部自动化、集成和长期运行的工作流仍应将命令行为、状态文件和 JSON 输出视为仍在演进中。

以下命令为打开链接仓库或文件夹的本地视图提供了首次设置流程。

当单个仓库负责规划、实施和归档流程时，仓库本地的 OpenSpec 项目是合适的默认选择。有些工作跨越多个仓库或文件夹。对于这种情况，OpenSpec 协调工作区是一种机器本地视图，它将链接的路径、打开器状态和智能体设置整合在一起。

工作区的心智模型是：

```text
工作区 (workspace)    = 覆盖上下文存储、协作计划、仓库和文件夹的私有本地视图
上下文存储 (context store) = 持久化的共享上下文容器
协作计划 (initiative)    = 上下文存储内部的持久化协调上下文
链接 (link)          = 工作区可以在本地解析的仓库或文件夹的稳定名称
修改 (change)        = 一项计划的工作单元；实施归属于拥有该工作的仓库
```

工作区的结构与仓库本地项目不同：

```text
getGlobalDataDir()/workspaces/<workspace-name>/
├── workspace.yaml                 # 私有本地视图记录
├── AGENTS.md                      # 生成的运行时指南
└── <workspace-name>.code-workspace # 生成的编辑器工作区文件
```

仓库本地的 OpenSpec 状态保持原有结构：

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

这种区别很重要。工作区文件夹是一个用于打开和检查链接仓库或文件夹的本地协调界面。每个仓库的 `openspec/` 目录仍然是仓库自有规范、仓库本地修改和实施规划的归属地。用户不需要在工作区文件夹内运行仓库本地的 `openspec init`。

稳定的链接名称是工作区引用仓库和文件夹的方式。私有工作区记录保留诸如 `api`、`web` 或 `checkout` 之类的名称，并将其映射到此运行时环境的本地路径。

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

当工作区打开一个协作计划时，`context` 记录所选的上下文存储绑定和协作计划 ID。通过注册表选择的存储通过 ID 保持可移植性；通过路径选择的存储故意保留运行时本地路径，因为 `workspace.yaml` 是私有的本地状态。

```yaml
context:
  kind: initiative
  store:
    id: platform
    selector:
      kind: registry
      id: platform
  initiative:
    id: billing-launch
```

链接的路径可以是完整的仓库、大型单体仓库内的文件夹，或其他现有文件夹。它们在参与工作区规划之前不需要仓库本地的 `openspec/` 状态。后续的实施、验证或归档工作流可能需要更高的仓库就绪度，但规划可见性从链接开始。

```text
多仓库模式:
  api      -> /repos/api
  web      -> /repos/web

大型单体仓库模式:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

受管工作区位于标准 OpenSpec 数据目录下：

```text
getGlobalDataDir()/workspaces
```

这意味着当设置了 `XDG_DATA_HOME` 时，为 `$XDG_DATA_HOME/openspec/workspaces`；在 Unix 风格回退路径下为 `~/.local/share/openspec/workspaces`；在原生 Windows 回退路径下为 `%LOCALAPPDATA%\openspec\workspaces`。原生 Windows Shell、PowerShell 和 WSL2 各自保留运行 OpenSpec 的运行时环境所对应的路径字符串。此基础不处理 `D:\repo`、`/mnt/d/repo` 和 UNC WSL 路径之间的转换。

OpenSpec 仍然可以读取旧的测试版工作区根目录作为兼容性输入，但受管工作区现在使用上述根目录的 `workspace.yaml` 记录。工作区文件夹对于其自身的私有本地视图仍然是权威的。

工作区可见性不等于变更承诺。当 OpenSpec 需要知道哪些仓库或文件夹相关时，设置工作区；当你准备规划一个功能、修复、项目或其他工作单元时，再创建一个修改。

实用命令：

```bash
# 引导式设置
openspec workspace setup

# 适合自动化的设置
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# 从本地注册表查看已知工作区
openspec workspace list
openspec workspace ls

# 为所选工作区添加或修复链接
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# 检查此机器可以解析什么
openspec workspace doctor
openspec workspace doctor --workspace platform

# 刷新工作区本地指南和智能体技能
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# 打开链接的工作集合
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# 将协作计划作为本地工作区视图打开
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` 总是在标准工作区位置创建工作区，将其记录在本地注册表中，显示工作区位置，并要求至少链接一个仓库或文件夹。交互式设置会询问首选的打开器，并可以为选定的智能体安装 OpenSpec 技能。非交互式设置仅在提供 `--opener codex-cli`、`--opener claude`、`--opener github-copilot` 或 `--opener editor` 时存储打开器。

工作区技能仅安装在工作区根目录。活动的全局配置文件选择生成哪些工作流技能；`--tools` 选择哪些智能体接收它们。工作区设置和更新不会创建斜杠命令文件，即使全局交付包含命令。运行 `openspec workspace update` 以刷新工作区本地指南，并在不编辑链接仓库或文件夹的情况下添加、刷新或移除受管的工作区本地技能目录。

OpenSpec 还维护根工作区打开文件：`AGENTS.md` 中的 OpenSpec 托管指南块，以及用于 VS Code 和 VS Code 中的 GitHub Copilot 打开的机器本地 `<workspace-name>.code-workspace` 文件。受管工作区不是一个仓库，因此 OpenSpec 不会创建默认的工作区 `.gitignore` 或默认的工作区级别 `changes/` 目录。

维护的 VS Code 工作区首先列出有效的链接仓库或文件夹，然后是附加时的协作计划上下文，最后是 OpenSpec 工作区文件。VS Code 将这些条目显示为一个包含多个根文件夹的工作区。

`workspace open` 使用存储的首选打开器打开链接的工作集合，除非为该次会话传递了 `--agent <tool>` 或 `--editor`。同时传递两个打开器覆盖选项会导致错误。根工作区打开使链接的仓库和文件夹可见，可供探索和查看上下文；实施工作在用户明确请求后才开始。

`workspace link` 和 `workspace relink` 仅记录现有文件夹；它们不会创建、复制、移动、初始化或编辑链接的仓库或文件夹。链接或重新链接成功后，OpenSpec 会刷新托管的指南和 VS Code 工作区文件。

需要单个工作区的工作区命令可以从任何位置使用 `--workspace <name>` 运行。如果你在工作区文件夹或子目录内运行它们，OpenSpec 将使用该当前工作区。如果存在多个已知工作区而你没有传递 `--workspace <name>`，交互式命令会显示一个选择器；`--json` 和 `--no-interactive` 会失败并返回结构化的状态错误，而不是进行提示。

直接的工作区命令支持 JSON 输出以便于脚本使用。JSON 响应将主要数据保存在 `workspace`、`workspaces` 或 `link` 对象中，并在 `status` 数组中报告警告或错误。正常的对象使用 `status: []`。

## 规格说明

规格说明通过结构化需求与场景描述系统行为。

### 结构

```
openspec/specs/
├── auth/
│   └── spec.md           # 认证行为
├── payments/
│   └── spec.md           # 支付处理
├── notifications/
│   └── spec.md           # 通知系统
└── ui/
    └── spec.md           # UI 行为与主题
```

按领域组织规格说明——采用对您的系统有意义的逻辑分组。常见模式：

- **按功能领域**：`auth/`、`payments/`、`search/`
- **按组件**：`api/`、`frontend/`、`workers/`
- **按限界上下文**：`ordering/`、`fulfillment/`、`inventory/`

### 规格格式

规格包含需求，每个需求都有场景：

```markdown
# 认证规格说明

## 目的
应用程序的身份验证与会话管理。
```

## 要求

### 需求：用户身份验证
系统在用户成功登录后 **必须** 签发一个 JWT 令牌。

#### 场景：有效凭证
- **假设** 一个用户拥有有效的凭证
- **当** 用户提交登录表单
- **那么** 返回一个 JWT 令牌
- **且** 用户被重定向至仪表盘

#### 场景：无效凭证
- **假设** 凭证无效
- **当** 用户提交登录表单
- **那么** 显示一条错误消息
- **且** 不签发任何令牌

### 需求：会话过期
系统 **必须** 在 30 分钟无活动后使会话过期。

#### 场景：空闲超时
- **假设** 一个已认证的会话
- **当** 30 分钟内没有任何活动
- **那么** 该会话被失效
- **且** 用户必须重新进行身份验证
```

**关键元素：**

| 元素 | 用途 |
|---------|---------|
| `## 用途` | 高层次描述此规范的领域 |
| `### 需求：` | 系统必须具有的特定行为 |
| `#### 场景：` | 需求在实际操作中的具体示例 |
| SHALL/MUST/SHOULD | RFC 2119 关键词，表示需求强度 |

### 为何以这种方式构建规范

**需求是“什么”** —— 它们陈述了系统应该做什么，但不指定实现方式。

**场景是“何时”** —— 它们提供了可以被验证的具体示例。好的场景：
- 是可测试的（你可以为其编写自动化测试）
- 覆盖正常路径和边缘情况
- 使用 Given/When/Then 或类似的结构化格式

**RFC 2119 关键词** (SHALL, MUST, SHOULD, MAY) 传达意图：
- **MUST/SHALL** —— 绝对要求
- **SHOULD** —— 推荐，但存在例外
- **MAY** —— 可选

### 规范是什么（以及不是什么）

规范是一份**行为契约**，而非实现计划。

好的规范内容：
- 用户或下游系统依赖的可观察行为
- 输入、输出和错误条件
- 外部约束（安全、隐私、可靠性、兼容性）
- 可测试或可明确验证的场景

规范中应避免：
- 内部类/函数名
- 库或框架选择
- 分步实现细节
- 详细的执行计划（这些应放在 `design.md` 或 `tasks.md` 中）

快速检验：
- 如果实现在不改变外部可见行为的情况下可以改变，那么它很可能不属于规范。

### 保持轻量：渐进式严谨性

OpenSpec 旨在避免官僚主义。使用能确保变更可验证的最轻量级方法。

**精简规范（默认）：**
- 以行为为核心的简短需求
- 清晰的范围和非目标
- 几个具体的验收检查

**完整规范（用于更高风险场景）：**
- 跨团队或跨代码仓库的变更
- API/契约变更、迁移、安全/隐私问题
- 模糊性可能导致昂贵返工的变更

大多数变更应保持精简模式。

### 人与智能体的协作

在许多团队中，人类探索问题，智能体起草工件。预期的工作流程是：

1. 人类提供意图、上下文和约束。
2. 智能体将其转化为以行为为核心的需求和场景。
3. 智能体将实现细节保留在 `design.md` 和 `tasks.md` 中，而不是 `spec.md`。
4. 在实现之前进行验证，确认结构和清晰度。

这确保了规范对人类可读，并且对智能体保持一致。

## 变更

变更是对系统的一个拟议修改，打包为一个包含理解并实现它所需一切的文件夹。

### 变更结构

```
openspec/changes/add-dark-mode/
├── proposal.md           # 原因与内容
├── design.md             # 如何做（技术方案）
├── tasks.md              # 实现检查清单
├── .openspec.yaml        # 变更元数据（可选）
└── specs/                # 差异规范
    └── ui/
        └── spec.md       # ui/spec.md 中正在改变的内容
```

每个变更都是自包含的。它包含：
- **工件** —— 捕获意图、设计和任务的文档
- **差异规范** —— 关于正在添加、修改或删除内容的规范
- **元数据** —— 此特定变更的可选配置

### 为何变更以文件夹形式组织

将变更打包为文件夹有几个好处：

1. **所有内容集中。** 提案、设计、任务和规范位于同一位置。无需四处寻找。

2. **并行工作。** 多个变更可以同时存在而不会冲突。在处理 `add-dark-mode` 时，`fix-auth-bug` 也可以同时进行。

3. **清晰的历史记录。** 当存档时，变更会连同其完整上下文一起移至 `changes/archive/`。你不仅可以回顾改变了什么，还能理解为什么改变。

4. **便于审查。** 一个变更文件夹易于审查——打开它，阅读提案，检查设计，查看规范差异。

## 工件

工件是变更中指导工作的文档。

### 工件流程

```
提案 ──────► 规范 ──────► 设计 ──────► 任务 ──────► 实现
    │               │             │              │
   为什么          改变了什么      如何做         步骤
 + 范围           变更          方案          需要采取
```

工件相互构建。每个工件都为下一个提供上下文。

### 工件类型

#### 提案 (`proposal.md`)

提案在高层次上捕获**意图**、**范围**和**方案**。

```markdown
# 提案：添加深色模式

## 意图
用户请求添加深色模式选项，以在夜间使用时减少眼睛疲劳并匹配系统偏好。

## 范围
范围内：
- 设置中的主题切换
- 系统偏好检测
- 在 localStorage 中持久化偏好

范围外：
- 自定义颜色主题（未来工作）
- 每页主题覆盖

## 方案
使用 CSS 自定义属性进行主题设置，并通过 React Context 进行状态管理。首次加载时检测系统偏好，允许手动覆盖。
```

**何时更新提案：**
- 范围变更（缩小或扩大）
- 意图澄清（更好地理解问题）
- 方案根本性改变

#### 规范 (`specs/` 中的差异规范)

差异规范描述了**相对于当前规范正在改变的内容**。请参阅下方的[差异规范](#差异规范)。

#### 设计 (`design.md`)

设计捕获**技术方案**和**架构决策**。

````markdown
# 设计：添加深色模式

## 技术方案
通过 React Context 管理主题状态，以避免 props 逐层传递。CSS 自定义属性支持运行时切换，无需切换类名。

## 架构决策

### 决策：使用 Context 而非 Redux
使用 React Context 管理主题状态，因为：
- 简单的二元状态（亮/暗）
- 没有复杂的状态转换
- 避免添加 Redux 依赖

### 决策：使用 CSS 自定义属性
使用 CSS 变量而不是 CSS-in-JS，因为：
- 可与现有样式表配合工作
- 无运行时开销
- 浏览器原生解决方案

## 数据流
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (应用于 :root)
```

## 文件变更
- `src/contexts/ThemeContext.tsx` (新增)
- `src/components/ThemeToggle.tsx` (新增)
- `src/styles/globals.css` (修改)
````

**何时更新设计：**
- 实现过程中发现该方案行不通
- 发现更好的解决方案
- 依赖或约束发生变化

#### 任务 (`tasks.md`)

任务是**实现检查清单** —— 带有复选框的具体步骤。

```markdown
# 任务

## 1. 主题基础设施
- [ ] 1.1 创建包含亮/暗状态的 ThemeContext
- [ ] 1.2 为颜色添加 CSS 自定义属性
- [ ] 1.3 实现 localStorage 持久化
- [ ] 1.4 添加系统偏好检测

## 2. UI 组件
- [ ] 2.1 创建 ThemeToggle 组件
- [ ] 2.2 将切换按钮添加到设置页面
- [ ] 2.3 更新 Header 以包含快速切换

## 3. 样式
- [ ] 3.1 定义深色主题色板
- [ ] 3.2 更新组件以使用 CSS 变量
- [ ] 3.3 测试对比度以确保可访问性
```

**任务最佳实践：**
- 将相关任务分组到标题下
- 使用层次编号（1.1, 1.2 等）
- 保持任务小到可以在一个会话内完成
- 完成任务时将其勾选

## 差异规范

差异规范是使 OpenSpec 适用于现有项目（棕地开发）的关键概念。它们描述了**正在改变的内容**，而不是重述整个规范。

### 格式

```markdown
# Auth 的差异

## 已添加的需求

### 需求：双因素身份验证
系统 **必须** 支持基于 TOTP 的双因素身份验证。

#### 场景：2FA 注册
- **假设** 一个未启用 2FA 的用户
- **当** 用户在设置中启用 2FA
- **那么** 显示一个 QR 码供身份验证器应用设置
- **且** 用户必须在激活前用一个代码进行验证

#### 场景：2FA 登录
- **假设** 一个已启用 2FA 的用户
- **当** 用户提交有效凭证
- **那么** 呈现一个 OTP 挑战
- **且** 仅在输入有效 OTP 后完成登录

## 已修改的需求

### 需求：会话过期
系统 **必须** 在 15 分钟无活动后使会话过期。
（此前：30 分钟）

#### 场景：空闲超时
- **假设** 一个已认证的会话
- **当** 15 分钟内没有任何活动
- **那么** 该会话被失效

## 已移除的需求

### 需求：记住我
（已弃用，改用 2FA。用户应在每次会话时重新进行身份验证。）
```

### 差异章节

| 章节 | 含义 | 存档时会发生什么 |
|---------|---------|------------------------|
| `## 已添加的需求` | 新行为 | 追加到主规范 |
| `## 已修改的需求` | 已改变的行为 | 替换现有需求 |
| `## 已移除的需求` | 已弃用的行为 | 从主规范中删除 |

### 为何使用差异而非完整规范

**清晰性。** 差异确切地显示了正在改变的内容。阅读完整规范时，你需要将其与当前版本在脑中进行对比。

**避免冲突。** 两个变更可以触及同一个规范文件而不冲突，只要它们修改的是不同的需求。

**审查效率。** 审查者看到的是变更，而不是未改变的上下文。专注于重要的事情。

**适应棕地开发。** 大部分工作是修改现有行为。差异将修改作为一等公民，而不是事后补充。

## 模式 (Schemas)

模式为工作流定义了构件 (artifact) 类型及其依赖关系。

### 模式的工作原理

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
```

**构件构成一个依赖关系图：**

```
                    proposal
                   (root node)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**依赖是使能条件，而非强制门槛。** 它们表明了可以创建什么，而不是你下一步必须创建什么。如果不需要，你可以跳过设计 (design)。你可以在设计之前或之后创建规范 (specs)——两者都只依赖于提案 (proposal)。

### 内置模式

**spec-driven** (默认)

规范驱动开发的标准工作流：

```
proposal → specs → design → tasks → implement
```

适用于：大多数功能开发，尤其是当你希望在实现之前就规范达成一致时。

### 自定义模式

为你的团队工作流创建自定义模式：

```bash
# 从头创建
openspec schema init research-first

# 或者复用 (fork) 一个现有模式
openspec schema fork spec-driven research-first
```

**自定义模式示例：**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Do research first

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informed by research

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Skip specs/design, go straight to tasks
```

有关创建和使用自定义模式的完整详情，请参阅 [自定义](customization.md)。

## 归档

归档通过将变更的增量规范 (delta specs) 合并到主规范中，并为历史记录保留该变更，从而完成一项变更。

### 归档时会发生什么

```
归档前：

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ 合并
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


归档后：

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # 现在包含 2FA 需求
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # 为历史保留
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### 归档流程

1.  **合并增量。** 每个增量规范 (delta spec) 的部分（已添加/已修改/已移除）都会应用到相应的主规范中。
2.  **移至归档。** 变更文件夹移至 `changes/archive/`，并加上日期前缀以便按时间顺序排列。
3.  **保留上下文。** 所有构件在归档中保持完整。你始终可以回顾以了解做出变更的原因。

### 为何归档很重要

**状态清晰。** 活跃的变更 (`changes/`) 仅显示进行中的工作。已完成的工作被移开。

**审计追踪。** 归档保留了每个变更的完整上下文——不仅是变更的内容，还有解释原因的提案、解释方法的设计以及展示完成工作的任务。

**规范演进。** 随着变更被归档，规范有机地增长。每次归档都会合并其增量，逐步构建出一份全面的规范。

## 它们如何协同工作

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**良性循环：**

1.  规范描述当前行为
2.  变更提出修改建议（以增量形式）
3.  实现使变更成为现实
4.  归档将增量合并到规范中
5.  规范现在描述新的行为
6.  下一次变更基于更新后的规范进行

## 术语表

| 术语 | 定义 |
|------|------|
| **构件 (Artifact)** | 变更中的一个文档（提案、设计、任务或增量规范） |
| **归档 (Archive)** | 完成一项变更并将其增量合并到主规范中的过程 |
| **变更 (Change)** | 对系统提出的一项修改建议，打包为一个包含构件的文件夹 |
| **增量规范 (Delta spec)** | 描述相对于当前规范的变更（已添加/已修改/已移除）的规范 |
| **域 (Domain)** | 规范的逻辑分组（例如，`auth/`、`payments/`） |
| **需求 (Requirement)** | 系统必须具备的一个特定行为 |
| **场景 (Scenario)** | 一个需求的具体示例，通常采用 Given/When/Then 格式 |
| **模式 (Schema)** | 构件类型及其依赖关系的定义 |
| **规范 (Spec)** | 描述系统行为的规格说明，包含需求和场景 |
| **事实来源 (Source of truth)** | `openspec/specs/` 目录，包含当前已达成一致的行为 |

## 下一步

- [快速入门](getting-started.md) - 实践性的第一步
- [工作流](workflows.md) - 常见模式及何时使用
- [命令](commands.md) - 完整命令参考
- [自定义](customization.md) - 创建自定义模式并配置你的项目