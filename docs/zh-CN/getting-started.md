# 入门指南

本指南解释了在安装和初始化 OpenSpec 之后它的工作原理。有关安装说明，请参阅 [主 README](../index.md#quick-start) 或 [安装指南](installation.md)。对整个文档集不熟悉？[文档首页](index.md) 会为您提供全面的概览。

> **我应该在哪里输入这些命令？** 有两个地方，混淆它们是初学者最常见的失误。
>
> - `openspec ...` 命令（如 `openspec init`）在您的**终端**中运行。
> - `/opsx:...` 命令（如 `/opsx:propose`）在您的**AI 助手聊天框**中运行，即您用来要求它编写代码的同一个框体。
>
> 没有一个单独的“交互模式”来启动。您只需在聊天框中输入斜杠命令，您的助手就会从那里开始工作。完整解释：[如何运作命令](how-commands-work.md)。

## 你的前五分钟

整个流程，以及每个步骤对应的发生位置：

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (可选：先思考一下)
AI CHAT      /opsx:propose add-dark-mode      (AI 草拟计划；您进行审查)
AI CHAT      /opsx:apply                      (AI 进行构建)
AI CHAT      /opsx:archive                    (规范已更新，变更已归档)
```

两个终端步骤用于设置，之后您就在聊天框中工作。本指南的其余部分将详细解释每个步骤的功能以及您会看到的内容。

> **还不确定要构建什么？请从 `/opsx:explore` 开始。** 这是一个零风险的思考伙伴，它会阅读您的代码库，权衡不同的选项，并在任何工件或代码存在之前，将一个模糊的想法打磨成一个具体的计划。一旦画面清晰，它就会交给 `/opsx:propose`。这是与一个本应自信地构建错误东西的 AI 合作的最佳习惯。请参阅 [探索指南](explore.md)。

## 工作原理

OpenSpec 帮助您和您的 AI 编码助手在编写任何代码之前就达成共识，确定要构建什么。

**默认快速路径（核心配置）：**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (可选)
```

当您正在弄清楚该做什么时，请从 `/opsx:explore` 开始；如果您已经知道，则直接跳到 `/opsx:propose`。探索功能包含在默认配置中，因此无论何时需要它，它都可用。

**扩展路径（自定义工作流选择）：**

```text
/opsx:new ──► /opsx:ff 或 /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

默认全局配置是 `core`，它包括 `propose`、`explore`、`apply`、`sync` 和 `archive`。您可以使用 `openspec config profile` 和然后 `openspec update` 来启用扩展工作流命令。

## OpenSpec 创建了什么

运行 `openspec init` 后，您的项目将具有以下结构：

```
openspec/
├── specs/              # 事实依据（系统的行为）
│   └── <domain>/
│       └── spec.md
├── changes/            # 提议的更新（每个变更一个文件夹）
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta规范（正在改变的部分）
│           └── <domain>/
│               └── spec.md
└── config.yaml         # 项目配置（可选）
```

**两个关键目录：**

- **`specs/`** - 事实依据。这些规范描述了您的系统当前的行为。按领域组织（例如 `specs/auth/`、`specs/payments/`）。

- **`changes/`** - 提议的修改。每个变更都有自己的文件夹，包含所有相关的工件。当一个变更完成后，它的规范就会合并到主 `specs/` 目录中。

## 理解工件 (Artifacts)

每个变更文件夹都包含指导工作的工件：

| 工件 | 用途 |
|----------|---------|
| `proposal.md` | “为什么”和“是什么”——捕获意图、范围和方法 |
| `specs/` | Delta规范，显示已添加/修改/移除的需求 |
| `design.md` | “如何做”——技术方法和架构决策 |
| `tasks.md` | 带有复选框的实现清单 |

**工件是相互构建的：**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            随着学习而更新
```

您随时可以回顾并完善早期的工件，因为在实现过程中您可能会学到更多东西。

## Delta规范的工作原理

Delta 规范是 OpenSpec 的核心概念。它们显示了相对于现有规范正在发生的变化。

### 格式

Delta 规范使用部分来指示变更的类型：

```markdown
# Auth 的 Delta

## 已添加的需求 (ADDED Requirements)

### Requirement: 双因素认证
系统必须在登录时要求第二因素。

#### Scenario: OTP required
- GIVEN 一个启用了 2FA 的用户
- WHEN 用户提交有效的凭据
- THEN 会呈现一个 OTP 挑战

## 已修改的需求 (MODIFIED Requirements)

### Requirement: 会话超时
系统应在不活动 30 分钟后使会话过期。
(之前：60 分钟)

#### Scenario: Idle timeout
- GIVEN 一个已认证的会话
- WHEN 30 分钟内没有活动
- THEN 该会话将被失效

## 已移除的需求 (REMOVED Requirements)

### Requirement: 记住我
(因引入 2FA 而弃用)
```

### 归档时发生什么？

当您归档一个变更时：

1. **ADDED**（已添加）的需求会被追加到主规范中。
2. **MODIFIED**（已修改）的需求会替换现有版本。
3. **REMOVED**（已移除）的需求会被从主规范中删除。

该变更文件夹会被移动到 `openspec/changes/archive/`，用于审计历史记录。

## 示例：您的第一个变更

让我们以添加深色模式到一个应用程序为例。

### 1. 启动变更 (默认)

```text
You: /opsx:propose add-dark-mode

AI:  已创建 openspec/changes/add-dark-mode/
     ✓ proposal.md — 我们为什么要这样做，正在改变什么
     ✓ specs/       — 需求和场景
     ✓ design.md    — 技术方法
     ✓ tasks.md     — 实现清单
     准备好进行实现！
```

如果您启用了扩展工作流配置，您也可以将其作为两个步骤完成：`/opsx:new` 然后 `/opsx:ff`（或逐步使用 `/opsx:continue`）。

### 2. 会创建什么？

**proposal.md** - 捕获意图：

```markdown
# Proposal: 添加深色模式

## Intent (意图)
用户要求提供一个深色模式选项，以减轻夜间使用的眼睛疲劳。

## Scope (范围)
- 在设置中添加主题切换功能
- 支持系统偏好检测
- 将偏好保存到 localStorage 中

## Approach (方法)
使用 CSS 自定义属性进行主题化，并使用 React context 进行状态管理。
```

**specs/ui/spec.md** - 显示新需求的 Delta 规范：

```markdown
# UI 的 Delta

## 已添加的需求 (ADDED Requirements)

### Requirement: 主题选择
系统应允许用户在浅色和深色主题之间进行选择。

#### Scenario: Manual toggle (手动切换)
- GIVEN 用户在任何页面上
- WHEN 用户点击主题切换按钮
- THEN 主题立即切换
- AND 偏好设置会跨会话保留下来

#### Scenario: System preference (系统偏好)
- GIVEN 一个没有保存偏好的用户
- WHEN 应用程序加载时
- THEN 系统首选的配色方案将被使用
```

**tasks.md** - 实现清单：

```markdown
# Tasks (任务)

## 1. 主题基础设施
- [ ] 1.1 创建带有 light/dark 状态的 ThemeContext
- [ ] 1.2 为颜色添加 CSS 自定义属性
- [ ] 1.3 实现 localStorage 持久化

## 2. UI 组件
- [ ] 2.1 创建 ThemeToggle 组件
- [ ] 2.2 在设置页面中添加切换按钮
- [ ] 2.3 更新 Header 以包含快速切换功能

## 3. 样式
- [ ] 3.1 定义深色主题配色方案
- [ ] 3.2 更新组件以使用 CSS 变量
```

### 3. 实现

```
You: /opsx:apply

AI:  正在处理任务...
     ✓ 1.1 创建了带有 light/dark 状态的 ThemeContext
     ✓ 1.2 已将 CSS 自定义属性添加到 globals.css
     ✓ 1.3 已实现 localStorage 持久化
     ✓ 2.1 创建了 ThemeToggle 组件
     ...
     所有任务均已完成！
```

在实现过程中，如果您发现设计需要调整，只需更新相应的工件并继续即可。

### 4. 归档

```
You: /opsx:archive

AI:  正在归档 add-dark-mode...
     ✓ 已将规范合并到 openspec/specs/ui/spec.md
     ✓ 已移动到 openspec/changes/archive/2025-01-24-add-dark-mode/
     完成！准备好迎接下一个功能。
```

您的 Delta 规范现在已成为主规范的一部分，记录了您的系统工作方式。

## 验证和审查

使用 CLI 来检查您的变更：

```bash
# 列出活动变更
openspec list

# 查看变更详情
openspec show add-dark-mode

# 验证规范格式
openspec validate add-dark-mode

# 交互式仪表板
openspec view
```

## 下一步

- [先进行探索 (Explore First)](explore.md) - 使用 `/opsx:explore` 在提交之前思考一个想法
- [在现有项目中使用 OpenSpec](existing-projects.md) - 从大型的“棕地”代码库开始工作
- [编辑和迭代变更](editing-changes.md) - 更新工件，回溯，协调手动编辑
- [核心概念概览](overview.md) - 一页纸上的完整心智模型
- [示例与食谱](examples.md) - 从头到尾的真实变更案例
- [工作流](workflows.md) - 常见模式和何时使用每条命令
- [命令](commands.md) - 所有斜杠命令的完整参考
- [概念](concepts.md) - 对规范、变更和模式更深入的理解
- [定制化](customization.md) - 让 OpenSpec 符合您的需求
- [存储 (Stores)](stores-beta/user-guide.md) - 规划跨仓库或团队？请将其保留在自己的仓库中（Beta）
- [FAQ](faq.md) 和 [故障排除](troubleshooting.md) - 当您遇到困难时