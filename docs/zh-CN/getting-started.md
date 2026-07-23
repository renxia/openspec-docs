# 入门指南

本指南介绍安装并初始化 OpenSpec 后的使用方法。安装说明请参阅[主 README](../index.md#quick-start)或[安装指南](installation.md)。刚接触整套文档？[文档首页](index.md)会为你梳理所有内容。

> **这些命令该输入在哪里？** 只有两个位置，混淆二者是新手最容易踩的坑。
>
> - `openspec ...` 类命令（如 `openspec init`）在**终端**中运行。
> - `/opsx:...` 类命令（如 `/opsx:propose`）在**AI 助手的聊天框**中运行，和你让 AI 写代码用的是同一个输入框。
>
> 不需要启动单独的「交互模式」，你只需在聊天框中输入斜杠命令，后续操作都会由你的 AI 助手完成。完整说明请参阅[命令工作原理](how-commands-work.md)。

## 前五分钟入门

完整操作流程如下，每一步都标注了执行位置：

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (可选：先梳理思路)
AI CHAT      /opsx:propose add-dark-mode      (AI 起草方案；你负责审核)
AI CHAT      /opsx:apply                      (AI 开始构建)
AI CHAT      /opsx:archive                    (规范更新，变更归档)
```

两步终端操作完成初始化后，你后续的所有操作都会在聊天框中完成。本指南后续部分会逐一解释每个步骤的作用和你会看到的内容。

> **还没想好要做什么？先从 `/opsx:explore` 开始。** 这是一个零风险的思考伙伴，它会读取你的代码库、权衡不同方案，在你创建任何产物或代码之前，就把模糊的想法打磨成具体的计划。思路清晰后，它会自动交接给 `/opsx:propose`。这是和 AI 协作时最重要的习惯——否则 AI 可能会信心满满地做出完全不符合预期的东西。详见[探索指南](explore.md)。

## 工作原理

OpenSpec 能帮助你和你的 AI 编程助手在编写任何代码之前，就明确要构建的内容达成一致。

**默认快速路径（核心配置档）：**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (可选)
```

当你还在梳理要做什么时，可以从 `/opsx:explore` 开始；如果你已经明确需求，也可以直接跳到 `/opsx:propose`。探索命令包含在默认配置档中，随时可用。

**扩展路径（自定义工作流选择）：**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

默认全局配置档为 `core`，包含 `propose`、`explore`、`apply`、`sync` 和 `archive` 命令。你可以通过 `openspec config profile` 启用扩展工作流命令，再执行 `openspec update` 完成更新。

## OpenSpec 会创建哪些内容

执行 `openspec init` 后，你的项目会生成如下结构：

```
openspec/
├── specs/              # 唯一事实来源（描述系统当前行为）
│   └── <domain>/
│       └── spec.md
├── changes/            # 待定变更（每个变更对应一个文件夹）
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # 增量规范文件（标注变更内容）
│           └── <domain>/
│               └── spec.md
└── config.yaml         # 项目配置（可选）
```

**两个核心目录：**

- **`specs/`** - 唯一事实来源。这些规范文件描述系统当前的行为，按领域组织（例如 `specs/auth/`、`specs/payments/`）。
- **`changes/`** - 待定修改。每个变更都有独立的文件夹，存放所有相关产物。变更完成后，对应的规范文件会合并到主 `specs/` 目录中。

## 理解产物

每个变更文件夹中都包含用于指导工作的产物：

| 产物 | 用途 |
|----------|---------|
| `proposal.md` | 「为什么做」和「做什么」- 记录变更意图、范围和方案 |
| `specs/` | 增量规范文件，标注新增/修改/删除的需求 |
| `design.md` | 「怎么做」- 技术方案和架构决策 |
| `tasks.md` | 带复选框的实施清单 |

**产物之间层层递进：**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

在实施过程中如果学到更多信息，你可以随时返回并优化之前的产物。

## 增量规范文件的工作原理

增量规范文件是 OpenSpec 的核心概念，用于展示相对于当前主规范的变更内容。

### 格式规范

增量规范文件通过不同章节标注变更类型：

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### 归档时的处理逻辑

当你归档一个变更时：
1. **新增**需求会被追加到主规范文件中
2. **修改**需求会替换现有版本
3. **删除**需求会从主规范文件中移除

变更文件夹会被移动到 `openspec/changes/archive/` 目录，用于审计留痕。

## 示例：你的第一个变更

我们以给应用新增深色模式为例，走完全流程。

### 1. 启动变更（默认方式）

```text
你：/opsx:propose add-dark-mode

AI：已创建 openspec/changes/add-dark-mode/
     ✓ proposal.md — 变更原因、变更内容
     ✓ specs/       — 需求和场景
     ✓ design.md    — 技术方案
     ✓ tasks.md     — 实施清单
     已就绪，可开始实施！
```

如果你已启用扩展工作流配置档，也可以通过两步完成：先执行 `/opsx:new`，再执行 `/opsx:ff`（或逐步执行 `/opsx:continue`）。

### 2. 生成的产物

**proposal.md** - 记录变更意图：

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - 展示新增需求的增量规范：

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - 实施清单：

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. 实施

```
你：/opsx:apply

AI：正在执行任务...
     ✓ 1.1 已创建 ThemeContext，管理浅色/深色状态
     ✓ 1.2 已向 globals.css 添加 CSS 自定义属性
     ✓ 1.3 已实现 localStorage 持久化存储
     ✓ 2.1 已创建 ThemeToggle 组件
     ...
     所有任务已完成！
```

实施过程中如果发现方案需要调整，只需更新对应产物后继续即可。

### 4. 归档

```
你：/opsx:archive

AI：正在归档 add-dark-mode...
     ✓ 已将规范合并到 openspec/specs/ui/spec.md
     ✓ 已移动到 openspec/changes/archive/2025-01-24-add-dark-mode/
     完成！可以开始下一个功能的开发了。
```

你的增量规范文件现在已经并入主规范文件，成为系统行为的正式文档。

## 验证与审查

使用 CLI 工具查看你的变更状态：

```bash
# 列出进行中的变更
openspec list

# 查看变更详情
openspec show add-dark-mode

# 校验规范文件格式
openspec validate add-dark-mode

# 交互式仪表盘
openspec view
```

## 后续步骤

- [先探索再行动](explore.md) - 在确定需求前，用 `/opsx:explore` 梳理思路
- [审查变更](reviewing-changes.md) - AI 起草方案后、编写代码前需要检查的内容
- [编写优质规范](writing-specs.md) - 高质量需求和场景的写法
- [在现有项目中使用 OpenSpec](existing-projects.md) - 如何在大型遗留代码库中落地
- [编辑与迭代变更](editing-changes.md) - 更新产物、回退步骤、对齐手动编辑的内容
- [核心概念速览](overview.md) - 一页纸梳理完整心智模型
- [示例与最佳实践](examples.md) - 真实变更的完整流程
- [工作流](workflows.md) - 常见模式及各命令的使用场景
- [命令](commands.md) - 所有斜杠命令的完整参考
- [概念](concepts.md) - 深入理解规范、变更和模式
- [自定义配置](customization.md) - 让 OpenSpec 适配你的使用习惯
- [存储（测试版）](stores-beta/user-guide.md) - 跨仓库或跨团队的规划？把它放在独立仓库中即可（测试版）
- [常见问题与故障排查](faq.md)和[故障排查](troubleshooting.md) - 遇到问题时查阅