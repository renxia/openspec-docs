# 概念

本指南解释了 OpenSpec 背后的核心思想以及它们如何协同工作。有关实际使用，请参阅 [Getting Started](getting-started.md) 和 [Workflows](workflows.md)。

## 理念

OpenSpec 基于四个原则构建：

```
fluid not rigid         — 不设阶段性门槛，根据合理需求进行工作
iterative not waterfall — 在构建过程中学习，持续完善
easy not complex        — 轻量级设置，极简流程
brownfield-first        — 与现有代码库协同工作，而非仅限于全新项目
```

### 这些原则为何重要

**灵活而非僵化。** 传统的规范系统会强制你遵循特定的阶段：先规划，然后实现，最后完成。OpenSpec 更具灵活性——你可以按照对你的工作而言最合理的方式创建工件（artifacts）。

**迭代而非瀑布式。** 需求是会变化的。理解也会加深。在项目初期看似可行的方法，在看到实际代码库后可能就不再适用。OpenSpec 拥抱这种现实。

**简单而非复杂。** 一些规范框架需要大量的设置、僵化的格式或重量级的流程。OpenSpec 会保持低调，不添麻烦。只需几秒钟即可初始化，立即开始工作，仅在必要时才进行定制。

**先考虑现有代码库（Brownfield-first）。** 大部分软件工作都不是从零开始构建——而是修改现有的系统。OpenSpec 基于增量（delta-based）的方法，使得指定对现有行为的更改变得轻而易举，而不仅仅是描述新的系统。

## 宏观图景 (The Big Picture)

OpenSpec 将您的工作划分为两个主要领域：

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** 是事实的来源（source of truth）——它们描述了您的系统当前的工作方式。

**Changes** 是拟议的修改——在您准备好合并之前，它们都存在于单独的文件夹中。

这种分离至关重要。您可以并行地处理多个更改而不会产生冲突。您可以在一个更改影响主 Specs 之前对其进行审查。并且当您归档一个更改时，它的 delta 会干净地合并到事实的来源中。

## Specs

Specs 使用结构化的要求和场景来描述您的系统行为。

### 结构 (Structure)

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior（身份验证行为）
├── payments/
│   └── spec.md           # Payment processing（支付处理）
├── notifications/
│   └── spec.md           # Notification system（通知系统）
└── ui/
    └── spec.md           # UI behavior and themes（UI 行为和主题）
```

请按领域组织 Specs——这些是对您的系统有意义的逻辑分组。常见的模式包括：

- **按功能区域 (By feature area)**：`auth/`、`payments/`、`search/`
- **按组件 (By component)**：`api/`、`frontend/`、`workers/`
- **按边界上下文 (By bounded context)**：`ordering/`、`fulfillment/`、`inventory/`

### Spec 格式 (Spec Format)

一个 Spec 包含要求，每个要求都包含场景：

```markdown
# Auth Specification（身份验证规范）

## Purpose (目的)
应用程序的身份验证和会话管理。

## Requirements (要求)

### Requirement: User Authentication（用户身份验证）
系统在成功登录后必须颁发一个 JWT token。

#### Scenario: Valid credentials（有效凭据）
- GIVEN a user with valid credentials（给定一个拥有有效凭据的用户）
- WHEN the user submits login form（当用户提交登录表单时）
- THEN a JWT token is returned（则返回一个 JWT token）
- AND the user is redirected to dashboard（并且用户被重定向到仪表板）

#### Scenario: Invalid credentials（无效凭据）
- GIVEN invalid credentials（给定无效的凭据）
- WHEN the user submits login form（当用户提交登录表单时）
- THEN an error message is displayed（则显示一个错误消息）
- AND no token is issued（并且没有颁发任何 token）

### Requirement: Session Expiration（会话过期）
系统必须在 30 分钟不活动后使会话失效。

#### Scenario: Idle timeout（空闲超时）
- GIVEN an authenticated session（给定一个已认证的会话）
- WHEN 30 minutes pass without activity（当 30 分钟没有活动时）
- THEN the session is invalidated（则会话被使失效）
- AND the user must re-authenticate（并且用户必须重新进行身份验证）
```

**关键元素 (Key elements)：**

| Element | Purpose (目的) |
|---------|-----------------|
| `## Purpose` | 对此 Spec 领域的宏观描述 |
| `### Requirement:` | 系统必须具备的特定行为 |
| `#### Scenario:` | 要求实际操作的一个具体示例 |
| SHALL/MUST/SHOULD | 表示要求强度的 RFC 2119 关键词 |

### 为什么这样组织 Specs (Why Structure Specs This Way)

**Requirements 是“做什么”（the "what"）**——它们陈述了系统应该做什么，而无需指定实现方式。

**Scenarios 是“何时”或“如何验证”（the "when"）**——它们提供了可以被验证的具体示例。好的场景：
- 是可测试的（您可以为它们编写自动化测试）
- 涵盖正常路径和边缘情况
- 使用 Given/When/Then 或类似的结构化格式

**RFC 2119 关键词** (SHALL, MUST, SHOULD, MAY) 用于传达意图：
- **MUST/SHALL** — 绝对要求
- **SHOULD** — 推荐，但存在例外情况
- **MAY** — 可选

### Spec 是什么（以及不是什么）(What a Spec Is (and Is Not))

Spec 是一个**行为契约 (behavior contract)**，而不是实现计划。

好的 Spec 内容：
- 用户或下游系统所依赖的可观察行为
- 输入、输出和错误条件
- 外部约束（安全、隐私、可靠性、兼容性）
- 可以被测试或明确验证的场景

Spec 中应避免的内容：
- 内部类/函数名称
- 库或框架选择
- 分步实现细节
- 详细的执行计划（这些属于 `design.md` 或 `tasks.md`）

快速检验：
- 如果实现方式可以改变而不会改变外部可见的行为，那么它可能不属于 Spec。

### 保持轻量级：渐进式严谨性 (Keep It Lightweight: Progressive Rigor)

OpenSpec 旨在避免官僚主义。使用仍能使更改可验证的最轻量级级别。

**Lite spec（默认）:**
- 短小的、以行为为先导的要求
- 清晰的范围和非目标 (non-goals)
- 少数具体的验收检查项

**Full spec（针对高风险情况）:**
- 跨团队或跨仓库的更改
- API/契约更改、迁移、安全/隐私问题
- 存在歧义可能导致昂贵重做的更改

大多数更改都应该保持 Lite 模式。

### 人类与 Agent 的协作 (Human + Agent Collaboration)

在许多团队中，人类负责探索，而 Agent（智能体）则起草工件。预期的流程是：

1. 人类提供意图、上下文和约束。
2. Agent 将这些内容转换为以行为为先导的要求和场景。
3. Agent 将实现细节保留在 `design.md` 和 `tasks.md` 中，而不是 `spec.md`。
4. 验证确认结构和清晰度后再进行实现。

这使得 Specs 对人类来说易于阅读，对 Agent 来说保持一致性。

## Changes

Change 是对您系统的拟议修改，它被打包成一个包含所有必要信息以理解和实施该修改的文件夹。

### Change 结构 (Change Structure)

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what（原因和内容）
├── design.md             # How (technical approach)（如何实现（技术方法））
├── tasks.md              # Implementation checklist（实施清单）
├── .openspec.yaml        # Change metadata (optional)（更改元数据（可选））
└── specs/                # Delta specs（Delta Specs）
    └── ui/
        └── spec.md       # What's changing in ui/spec.md（ui/spec.md 中哪些内容正在改变）
```

每个 Change 都是自包含的。它包含：
- **Artifacts** — 用于捕捉意图、设计和任务的文档
- **Delta specs** — 关于所添加、修改或移除内容的规范
- **Metadata** — 此特定更改的可选配置信息

### 为什么 Changes 是文件夹 (Why Changes Are Folders)

将一个 Change 打包成一个文件夹具有多重好处：

1. **一站式服务。** Proposal（提案）、Design（设计）、Tasks（任务）和 Specs（规范）都存在于同一个地方。无需在不同的位置进行搜索。

2. **并行工作。** 多个 Changes 可以同时存在而不会相互冲突。可以同时处理 `add-dark-mode` 和 `fix-auth-bug`。

3. **清晰的历史记录。** 当被归档时，Changes 会移动到 `changes/archive/`，并保留完整的上下文。您可以回顾不仅发生了什么变化，还了解为什么发生变化。

4. **易于审查。** 一个 Change 文件夹很容易进行审查——打开它，阅读提案，检查设计，查看 Spec 的 delta。

## Artifacts

Artifacts 是指导工作的文档。

### Artifact 流程 (The Artifact Flow)

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artifacts 是相互构建的。每个 Artifact 都为下一个提供了上下文。

### Artifact 类型 (Artifact Types)

#### Proposal (`proposal.md`)

Proposal 捕捉了高层次的**意图、范围和方法**。

```markdown
# Proposal: Add Dark Mode（提案：添加暗黑模式）

## Intent (意图)
用户要求提供一个暗黑模式选项，以减少夜间使用时的眼睛疲劳，并匹配系统偏好。

## Scope (范围)
包含的范围 (In scope)：
- 设置中的主题切换功能
- 系统偏好的检测
- 在 localStorage 中持久化偏好设置

不包含的范围 (Out of scope)：
- 自定义颜色主题（未来工作）
- 页面级别的テーマ覆盖

## Approach (方法)
使用 CSS custom properties 进行主题化，并使用 React context 进行状态管理。在首次加载时检测系统偏好，允许手动覆盖。
```

**何时更新 Proposal：**
- 范围的更改（缩小或扩大）
- 意图的澄清（对问题的更好理解）
- 方法论的根本性转变

#### Specs (delta specs in `specs/`)

Delta specs 描述了相对于当前 Spec **哪些内容正在改变**。请参阅下面的 [Delta Specs](#delta-specs)。

#### Design (`design.md`)

Design 捕捉了**技术方法和架构决策**。

````markdown
# Design: Add Dark Mode（设计：添加暗黑模式）

## Technical Approach (技术方法)
通过 React Context 管理主题状态，以避免 Prop Drilling（属性逐级传递）。CSS custom properties 使得无需切换类名即可实现运行时切换。

## Architecture Decisions (架构决策)

### Decision: Context over Redux（选择 Context 而非 Redux）
使用 React Context 来管理主题状态，因为：
- 简单的二进制状态（亮/暗）
- 没有复杂的状态转换
- 避免添加 Redux 依赖

### Decision: CSS Custom Properties（选择 CSS Custom Properties）
使用 CSS 变量而不是 CSS-in-JS，因为：
- 与现有样式表兼容
- 无运行时开销
- 是浏览器原生的解决方案

## Data Flow (数据流)
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes (文件更改)
- `src/contexts/ThemeContext.tsx` (新增)
- `src/components/ThemeToggle.tsx` (新增)
- `src/styles/globals.css` (修改)
````

**何时更新 Design：**
- 实现发现方法论不可行
- 发现了更好的解决方案
- 依赖项或约束发生变化

#### Tasks (`tasks.md`)

Tasks 是**实施清单**——带有复选框的具体步骤。

```markdown
# Tasks（任务）

## 1. Theme Infrastructure (主题基础设施)
- [ ] 1.1 Create ThemeContext with light/dark state（创建包含亮/暗状态的 ThemeContext）
- [ ] 1.2 Add CSS custom properties for colors（添加颜色相关的 CSS custom properties）
- [ ] 1.3 Implement localStorage persistence（实现本地存储持久化）
- [ ] 1.4 Add system preference detection（添加系统偏好检测）

## 2. UI Components (UI 组件)
- [ ] 2.1 Create ThemeToggle component（创建 ThemeToggle 组件）
- [ ] 2.2 Add toggle to settings page（在设置页面中添加切换功能）
- [ ] 2.3 Update Header to include quick toggle（更新头部以包含快速切换）

## 3. Styling (样式)
- [ ] 3.1 Define dark theme color palette（定义暗黑主题配色方案）
- [ ] 3.2 Update components to use CSS variables（更新组件以使用 CSS 变量）
- [ ] 3.3 Test contrast ratios for accessibility（测试可访问性对比度比率）
```

**任务最佳实践：**
- 按标题分组相关任务
- 使用分级编号（1.1, 1.2 等）
- 保持任务足够小，可以在一次会话中完成
- 完成后勾选任务

## Delta Specs

Delta specs 是使 OpenSpec 适用于棕地开发 (brownfield development) 的关键概念。它们描述**哪些内容正在改变**，而不是重述整个 Spec。

### 格式 (The Format)

```markdown
# Delta for Auth（身份验证的 Delta）

## ADDED Requirements (新增要求)

### Requirement: Two-Factor Authentication（双因素认证）
系统必须支持基于 TOTP 的双因素认证。

#### Scenario: 2FA enrollment（2FA 注册）
- GIVEN a user without 2FA enabled（给定一个未启用 2FA 的用户）
- WHEN the user enables 2FA in settings（当用户在设置中启用 2FA 时）
- THEN a QR code is displayed for authenticator app setup（则显示用于身份验证器应用的二维码）
- AND the user must verify with a code before activation（并且用户必须使用代码进行激活前的验证）

#### Scenario: 2FA login（2FA 登录）
- GIVEN a user with 2FA enabled（给定一个已启用 2FA 的用户）
- WHEN the user submits valid credentials（当用户提交有效的凭据时）
- THEN an OTP challenge is presented（则会呈现一个 OTP 挑战）
- AND login completes only after valid OTP（并且只有在有效的 OTP 后登录才完成）

## MODIFIED Requirements (修改要求)

### Requirement: Session Expiration（会话过期）
系统必须在 15 分钟不活动后使会话失效。
(之前：30 分钟)

#### Scenario: Idle timeout（空闲超时）
- GIVEN an authenticated session（给定一个已认证的会话）
- WHEN 15 minutes pass without activity（当 15 分钟没有活动时）
- THEN the session is invalidated（则会话被使失效）

## REMOVED Requirements (移除要求)

### Requirement: Remember Me（记住我）
(因引入 2FA 而已弃用。用户应该每次会话都重新进行身份验证。)
```

### Delta 部分 (Delta Sections)

| Section | Meaning (含义) | What Happens on Archive (归档时发生什么) |
|---------|-----------------|------------------------|
| `## ADDED Requirements` | 新行为 | 追加到主 Spec 中 |
| `## MODIFIED Requirements` | 已更改的行为 | 替换现有要求 |
| `## REMOVED Requirements` | 已弃用的行为 | 从主 Spec 中删除 |

### 为什么是 Deltas 而不是完整的 Specs (Why Deltas Instead of Full Specs)

**清晰度。** Delta 清晰地显示了哪些内容正在改变。阅读一份完整的 Spec，您需要将其与当前版本进行精神上的比对（diff）。

**避免冲突。** 两个 Changes 可以触及同一个 Spec 文件而不会冲突，只要它们修改的是不同的要求。

**审查效率。** 审查者看到的是变化，而不是未更改的上下文。专注于重要的部分。

**适应棕地开发 (Brownfield fit)。** 大多数工作都是在现有行为上进行修改。Deltas 使修改成为一等公民，而不仅仅是事后的想法。

## Schemas

Schemas 定义了工作流程的产物类型及其依赖关系。

### How Schemas Work

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

**Artifacts form a dependency graph:**

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

**Dependencies are enablers, not gates.** 依赖是使能项，而不是门禁。它们显示了哪些内容可以被创建，而不是你必须下一步创建什么。如果你不需要设计，你可以跳过它。你可以在设计之前或之后创建 specs — 两者都只依赖于 proposal。

### Built-in Schemas

**spec-driven** (default)

标准的 spec-driven 开发工作流程：

```
proposal → specs → design → tasks → implement
```

适用于：大多数需要先就规范达成一致再进行实现的特性工作。

### Custom Schemas

为团队的工作流程创建自定义模式：

```bash
# Create from scratch
openspec schema init research-first

# Or fork an existing one
openspec schema fork spec-driven research-first
```

**Example custom schema:**

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

有关创建和使用自定义模式的完整细节，请参阅 [Customization](customization.md)。

## Archive

归档通过将变更的增量（delta）规范合并到主规范中并保留该变更以供历史参考来完成。

### What Happens When You Archive

```
Before archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


After archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Now includes 2FA requirements
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preserved for history
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### The Archive Process

1. **Merge deltas.** 将每个增量规范部分（ADDED/MODIFIED/REMOVED）应用到相应的主规范。

2. **Move to archive.** 变更文件夹移动到 `changes/archive/`，并带有一个日期前缀以进行时间顺序排列。

3. **Preserve context.** 所有产物都完整地保存在归档中。你总是可以回顾以了解一个变更的原因。

### Why Archive Matters

**Clean state.** 活动的变更（`changes/`）只显示正在进行的工作。已完成的工作会被移走。

**Audit trail.** 归档保留了每一次变更的完整上下文——不仅是发生了什么变化，还包括解释原因的提案、说明如何做的设计以及所完成工作的任务。

**Spec evolution.** 随着变更被归档，规范会有机地成长。每次归档都会合并其增量，从而随时间推移构建起一份全面的规范。

## How It All Fits Together

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

**The virtuous cycle:**

1. Specs describe current behavior -> 规范描述当前行为
2. Changes propose modifications (as deltas) -> 变更以增量（deltas）的形式提出修改建议
3. Implementation makes the changes real -> 实现将这些更改变为现实
4. Archive merges deltas into specs -> 归档将增量合并到规范中
5. Specs now describe the new behavior -> 规范现在描述新的行为
6. Next change builds on updated specs -> 下一次变更基于更新后的规范进行构建

## Glossary

| Term | Definition |
|------|------------|
| **Artifact** | A document within a change (proposal, design, tasks, or delta specs) |
| **Archive** | The process of completing a change and merging its deltas into main specs |
| **Change** | A proposed modification to the system, packaged as a folder with artifacts |
| **Delta spec** | A spec that describes changes (ADDED/MODIFIED/REMOVED) relative to current specs |
| **Domain** | A logical grouping for specs (e.g., `auth/`, `payments/`) |
| **Requirement** | A specific behavior the system must have |
| **Scenario** | A concrete example of a requirement, typically in Given/When/Then format |
| **Schema** | A definition of artifact types and their dependencies |
| **Spec** | A specification describing system behavior, containing requirements and scenarios |
| **Source of truth** | The `openspec/specs/` directory, containing the current agreed-upon behavior |

## Next Steps

- [Getting Started](getting-started.md) - Practical first steps
- [Workflows](workflows.md) - Common patterns and when to use each
- [Commands](commands.md) - Full command reference
- [Customization](customization.md) - Create custom schemas and configure your project