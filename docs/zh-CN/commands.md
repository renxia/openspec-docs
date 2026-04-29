# 命令参考

这是 OpenSpec 斜杠命令的参考文档。这些命令在您的 AI 编程助手聊天界面中调用（例如 Claude Code、Cursor、Windsurf）。

有关工作流模式及各命令的使用场景，请参阅[工作流](workflows.md)。有关 CLI 命令，请参阅 [CLI](cli.md)。

## 快速参考

### 默认快捷路径（`core` 配置）

| 命令 | 用途 |
|------|------|
| `/opsx:propose` | 一步完成变更创建与规划产物生成 |
| `/opsx:explore` | 在确定变更前深入思考构想 |
| `/opsx:apply` | 执行变更中的具体任务 |
| `/opsx:archive` | 归档已完成的变更 |

### 扩展工作流命令（自定义工作流选择）

| 命令 | 用途 |
|------|------|
| `/opsx:new` | 启动新的变更框架 |
| `/opsx:continue` | 基于依赖关系创建下一个产物 |
| `/opsx:ff` | 快进：一次性生成所有规划产物 |
| `/opsx:verify` | 验证实现与产物的一致性 |
| `/opsx:sync` | 将增量规范合并至主规范 |
| `/opsx:bulk-archive` | 批量归档多个变更 |
| `/opsx:onboard` | 引导式完整工作流教程 |

默认全局配置为 `core`。要启用扩展工作流命令，请运行 `openspec config profile`，选择工作流，然后在项目中运行 `openspec update`。

---

## 命令参考

### `/opsx:propose`

一步创建新变更并生成规划工件。这是 `core` 配置文件中的默认起始命令。

**语法：**
```text
/opsx:propose [change-name-or-description]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name-or-description` | 否 | 短横线命名的名称或自然语言的变更描述 |

**功能说明：**
- 创建 `openspec/changes/<change-name>/` 目录
- 生成实施前所需的工件（对于 `spec-driven`：提案、规范、设计、任务）
- 当变更准备好执行 `/opsx:apply` 时停止

**示例：**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**提示：**
- 用于最快的端到端流程
- 如果希望逐步控制工件生成，请启用扩展工作流并使用 `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

在确定变更前，梳理思路、调查问题并明确需求。

**语法：**
```
/opsx:explore [topic]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `topic` | 否 | 您希望探索或调查的内容 |

**功能说明：**
- 开启一个无需结构的探索性对话
- 调查代码库以回答问题
- 比较不同选项和方法
- 创建可视化图表以厘清思路
- 当思路清晰后，可过渡到 `/opsx:propose`（默认）或 `/opsx:new`（扩展工作流）

**示例：**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**提示：**
- 当需求不明确或需要调查时使用
- 探索期间不会创建任何工件
- 适合在决定前比较多种方案
- 可以读取文件和搜索代码库

---

### `/opsx:new`

启动一个新的变更脚手架。创建变更文件夹，并等待您使用 `/opsx:continue` 或 `/opsx:ff` 生成工件。

此命令是扩展工作流集的一部分（不包含在默认的 `core` 配置文件中）。

**语法：**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 变更文件夹的名称（如未提供则会提示） |
| `--schema` | 否 | 要使用的工作流模式（默认：来自配置或 `spec-driven`） |

**功能说明：**
- 创建 `openspec/changes/<change-name>/` 目录
- 在变更文件夹中创建 `.openspec.yaml` 元数据文件
- 显示准备好创建的第一个工件模板
- 如未提供变更名称和模式，则进行提示

**创建内容：**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # 变更元数据（模式、创建日期）
```

**示例：**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**提示：**
- 使用描述性名称：`add-feature`、`fix-bug`、`refactor-module`
- 避免使用通用名称如 `update`、`changes`、`wip`
- 模式也可以在项目配置 (`openspec/config.yaml`) 中设置

---

### `/opsx:continue`

创建依赖链中的下一个工件。一次创建一个工件，实现增量进展。

**语法：**
```
/opsx:continue [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要继续哪个变更（如未提供则从上下文推断） |

**功能说明：**
- 查询工件依赖关系图
- 显示哪些工件已就绪，哪些被阻塞
- 创建第一个就绪的工件
- 读取依赖文件以获取上下文
- 显示创建后哪些工件变得可用

**示例：**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**提示：**
- 当您希望在继续前审查每个工件时使用
- 适合需要控制权的复杂变更
- 多个工件可能同时就绪
- 您可以在继续前编辑已创建的工件

---

### `/opsx:ff`

快速推进工件创建。一次性创建所有规划工件。

**语法：**
```
/opsx:ff [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要快速推进哪个变更（如未提供则从上下文推断） |

**功能说明：**
- 按依赖顺序创建所有工件
- 通过待办事项列表跟踪进度
- 当所有 `apply-required` 工件完成时停止
- 在创建下一个工件前读取每个依赖项

**示例：**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**提示：**
- 当您对要构建的内容有清晰认识时使用
- 对于直接明了的变更，比 `/opsx:continue` 更快
- 您仍然可以在事后编辑工件
- 适合中小型功能

---

### `/opsx:apply`

实施变更中的任务。处理任务列表，编写代码并勾选完成项。

**语法：**
```
/opsx:apply [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要实施哪个变更（如未提供则从上下文推断） |

**功能说明：**
- 读取 `tasks.md` 并识别未完成的任务
- 逐一处理任务
- 根据需要编写代码、创建文件、运行测试
- 使用复选框 `[x]` 标记任务完成

**示例：**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**提示：**
- 如果中断，可以从上次停止的地方继续
- 通过指定变更名称，可用于并行处理变更
- 完成状态在 `tasks.md` 的复选框中跟踪

---

### `/opsx:verify`

验证实施是否符合您的变更工件。检查完整性、正确性和一致性。

**语法：**
```
/opsx:verify [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要验证哪个变更（如未提供则从上下文推断） |

**功能说明：**
- 检查实施质量的三个维度
- 在代码库中搜索实施证据
- 报告问题，分为 CRITICAL（严重）、WARNING（警告）或 SUGGESTION（建议）
- 不会阻止归档，但会指出问题

**验证维度：**

| 维度 | 验证内容 |
|-----------|-------------------|
| **完整性** | 所有任务完成，所有需求已实施，场景已覆盖 |
| **正确性** | 实施符合规范意图，边界情况已处理 |
| **一致性** | 设计决策体现在代码中，模式保持一致 |

**示例：**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**提示：**
- 在归档前运行，以便尽早发现不匹配之处
- 警告不会阻止归档，但表明存在潜在问题
- 适合在提交前审查 AI 的工作
- 可以揭示工件与实施之间的偏差

---

### `/opsx:sync`

**可选命令。** 将变更中的增量规范合并到主规范中。归档时如果需要会提示同步，因此您通常不需要手动运行此命令。

**语法：**
```
/opsx:sync [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要同步哪个变更（如未提供则从上下文推断） |

**功能说明：**
- 从变更文件夹读取增量规范
- 解析 ADDED/MODIFIED/REMOVED/RENAMED 部分
- 将更改合并到主 `openspec/specs/` 目录
- 保留增量中未提及的现有内容
- 不会归档变更（保持活动状态）

**示例：**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**何时手动使用：**

| 场景 | 使用同步？ |
|----------|-----------|
| 长期运行的变更，希望在归档前将规范放入主规范 | 是 |
| 多个并行变更需要更新的基础规范 | 是 |
| 希望单独预览/审查合并结果 | 是 |
| 快速变更，直接归档 | 否（归档会处理） |

**提示：**
- 同步是智能的，不是简单的复制粘贴
- 可以向现有需求添加场景而不会重复
- 同步后变更保持活动状态（未归档）
- 大多数用户永远不需要直接调用此命令——归档时如果需要会提示

---

### `/opsx:archive`

归档已完成的变更。完成变更并将其移动到归档文件夹。

**语法：**
```
/opsx:archive [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要归档哪个变更（如未提供则从上下文推断） |

**功能说明：**
- 检查工件完成状态
- 检查任务完成情况（如果未完成则警告）
- 如果尚未同步，提供同步增量规范的选项
- 将变更文件夹移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`
- 保留所有工件以供审计追踪

**示例：**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**提示：**
- 归档不会因任务未完成而阻止，但会发出警告
- 增量规范可以在归档期间或之前同步
- 已归档的变更会保留以供历史记录
- 使用 `/opsx:verify` 先行检查问题

---

### `/opsx:bulk-archive`

一次归档多个已完成的变更。处理变更之间的规范冲突。

**语法：**
```
/opsx:bulk-archive [change-names...]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-names` | 否 | 要归档的特定变更（如未提供则提示选择） |

**功能说明：**
- 列出所有已完成的变更
- 在归档前验证每个变更
- 检测变更间的规范冲突
- 通过检查实际实施情况来解决冲突
- 按时间顺序归档

**示例：**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**提示：**
- 适合并行工作流
- 冲突解决是智能的（检查代码库）
- 变更按创建顺序归档
- 覆盖规范内容前会提示

---

### `/opsx:onboard`

引导式入门，贯穿完整的 OpenSpec 工作流。一个使用您实际代码库的交互式教程。

**语法：**
```
/opsx:onboard
```

**功能说明：**
- 带讲解地走完一个完整的工作流周期
- 扫描您的代码库以寻找真实的改进机会
- 使用真实工件创建一个实际的变更
- 实施实际工作（小型、安全的更改）
- 归档已完成的变更
- 在每一步发生时进行解释

**阶段：**
1. 欢迎与代码库分析
2. 寻找改进机会
3. 创建变更 (`/opsx:new`)
4. 编写提案
5. 创建规范
6. 编写设计
7. 创建任务
8. 实施任务 (`/opsx:apply`)
9. 验证实施
10. 归档变更
11. 总结与后续步骤

**示例：**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**提示：**
- 最适合学习工作流的新用户
- 使用真实代码，而非玩具示例
- 创建一个您可以保留或丢弃的真实变更
- 完成需要 15-30 分钟

---

## AI 工具命令语法

不同 AI 工具使用略有差异的命令语法。请使用与您工具匹配的格式：

| 工具 | 语法示例 |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | 基于技能的调用，例如 `/openspec-propose`, `/openspec-apply-change`（不生成 `opsx-*` 命令文件） |

各工具的意图相同，但命令的呈现方式可能因集成方式而异。

> **注意：** GitHub Copilot 命令（`.github/prompts/*.prompt.md`）仅在 IDE 扩展（VS Code、JetBrains、Visual Studio）中可用。GitHub Copilot CLI 目前不支持自定义提示文件 — 详情和解决方法请参见[支持的工具](supported-tools.md)。

---

## 旧版命令

这些命令使用较旧的“一次性”工作流。它们仍然有效，但推荐使用 OPSX 命令。

| 命令 | 功能 |
|---------|--------------|
| `/openspec:proposal` | 一次性创建所有工件（提案、规范、设计、任务） |
| `/openspec:apply` | 实施变更 |
| `/openspec:archive` | 归档变更 |

**何时使用旧版命令：**
- 使用旧工作流的现有项目
- 不需要增量工件创建的简单变更
- 偏好全有或全无的方式

**迁移到 OPSX：**
旧版变更可以使用 OPSX 命令继续。工件结构是兼容的。

---

## 故障排除

### “未找到变更”

命令无法识别要处理哪个变更。

**解决方案：**
- 明确指定变更名称：`/opsx:apply add-dark-mode`
- 检查变更文件夹是否存在：`openspec list`
- 确认您位于正确的项目目录中

### “没有就绪的工件”

所有工件要么已完成，要么因缺少依赖项而被阻塞。

**解决方案：**
- 运行 `openspec status --change <name>` 查看阻塞原因
- 检查所需工件是否存在
- 首先创建缺失的依赖工件

### “未找到架构”

指定的架构不存在。

**解决方案：**
- 列出可用架构：`openspec schemas`
- 检查架构名称的拼写
- 如果是自定义架构，请创建：`openspec schema init <name>`

### 命令未被识别

AI 工具无法识别 OpenSpec 命令。

**解决方案：**
- 确保 OpenSpec 已初始化：`openspec init`
- 重新生成技能：`openspec update`
- 检查 `.claude/skills/` 目录是否存在（适用于 Claude Code）
- 重启您的 AI 工具以加载新技能

### 工件生成不正确

AI 创建的工件不完整或不正确。

**解决方案：**
- 在 `openspec/config.yaml` 中添加项目上下文
- 为特定指导添加每工件规则
- 在变更描述中提供更多细节
- 使用 `/opsx:continue` 代替 `/opsx:ff` 以获得更多控制

---

## 后续步骤

- [工作流](workflows.md) - 常见模式及何时使用每个命令
- [CLI](cli.md) - 用于管理和验证的终端命令
- [自定义](customization.md) - 创建自定义架构和工作流