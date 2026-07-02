# 命令

这是 OpenSpec 斜杠命令的参考指南。这些命令将在您的 AI 编码助手聊天界面（例如 Claude Code、Cursor、Windsurf）中被调用。

有关工作流程模式和何时使用每个命令，请参阅 [Workflows](workflows.md)。有关 CLI 命令，请参阅 [CLI](cli.md)。

## 快速参考

### 默认快速路径（`core` 配置）

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | 一步完成变更创建和规划产物的生成 |
| `/opsx:explore` | 在确定变更之前思考想法 |
| `/opsx:apply` | 从变更中实现任务 |
| `/opsx:sync` | 将 delta 规范合并到主规范中 |
| `/opsx:archive` | 归档已完成的变更 |

### 扩展工作流命令（自定义工作流选择）

| Command | Purpose |
|---------|---------|
| `/opsx:new` | 开始一个新的变更脚手架 |
| `/opsx:continue` | 根据依赖项创建下一个产物 |
| `/opsx:ff` | 快进：一次性创建所有规划产物 |
| `/opsx:verify` | 验证实现是否符合产物要求 |
| `/opsx:bulk-archive` | 一次性归档多个变更 |
| `/opsx:onboard` | 完整工作流的引导式教程 |

默认的全局配置是 `core`。要启用扩展工作流命令，请运行 `openspec config profile`，选择工作流，然后在项目中运行 `openspec update`。

## 命令参考

### `/opsx:propose`

在一个步骤中创建新的变更并生成规划工件。这是 `core` profile 中的默认启动命令。

**语法:**
```text
/opsx:propose [change-name-or-description]
```

**参数:**
| 参数 | 是否必需 | 描述 |
|---|---|---|
| `change-name-or-description` | 否 | kebab-case 名称或通俗语言的变更描述 |

**功能:**
- 创建 `openspec/changes/<change-name>/`
- 生成实施前的必要工件（对于 `spec-driven`: proposal, specs, design, tasks）
- 在变更准备好进行 `/opsx:apply` 之前停止

**示例:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**提示:**
- 用于最快的端到端路径
- 如果您需要分步的工件控制，请启用扩展工作流并使用 `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **不确定时从这里开始。** Explore 是一个零风险的思考伙伴：它会阅读您的代码库，比较不同的选项，并在任何变更存在之前将模糊的想法打磨成具体的计划。它包含在默认配置中。有关完整的案例和更多示例，请参阅 [Explore First](explore.md) 指南。

在承诺进行任何变更之前，先思考想法、调查问题并澄清需求。

**语法:**
```
/opsx:explore [topic]
```

**参数:**
| 参数 | 是否必需 | 描述 |
|---|---|---|
| `topic` | 否 | 您想要探索或调查的内容 |

**功能:**
- 以无结构化的方式开启一次探索性对话
- 调查代码库以回答问题
- 比较不同的选项和方法
- 创建可视化图表来澄清思考过程
- 当洞察清晰时，可以过渡到 `/opsx:propose` (默认) 或 `/opsx:new` (扩展工作流)

**示例:**
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

**提示:**
- 当需求不明确或需要进行调查时使用
- 探索过程中不会创建任何工件
- 适合在决定之前比较多种方法
- 可以阅读文件和搜索代码库

---

### `/opsx:new`

启动一个新的变更骨架。会创建变更文件夹，并等待您使用 `/opsx:continue` 或 `/opsx:ff` 生成工件。

此命令是扩展工作流集的一部分（不包含在默认的 `core` profile 中）。

**语法:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**参数:**
| 参数 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 变更文件夹的名称（如果未提供，则会提示） |
| `--schema` | 否 | 要使用的工作流 schema (默认: 从配置或 `spec-driven`) |

**功能:**
- 创建 `openspec/changes/<change-name>/` 目录
- 在变更文件夹中创建 `.openspec.yaml` 元数据文件
- 显示第一个准备好创建的工件模板
- 如果未提供，则提示变更名称和 schema

**创建内容:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # 变更元数据 (schema, 创建日期)
```

**示例:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**提示:**
- 使用描述性的名称：`add-feature`, `fix-bug`, `refactor-module`
- 避免使用 `update`, `changes`, `wip` 等通用名称
- Schema 也可以在项目配置 (`openspec/config.yaml`) 中设置

---

### `/opsx:continue`

创建依赖链中的下一个工件。一次只创建一个工件，实现增量式进度。

**语法:**
```
/opsx:continue [change-name]
```

**参数:**
| 参数 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要继续的变更（如果未提供，则从上下文推断） |

**功能:**
- 查询工件依赖图
- 显示哪些工件已准备好 vs 已被阻塞
- 创建第一个可用的工件
- 读取依赖文件以获取上下文
- 显示创建后会可用什么内容

**示例:**
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

**提示:**
- 当您想在继续之前审查每个工件时使用
- 适合需要控制的复杂变更
- 多个工件可能会同时可用
- 在继续之前可以编辑已创建的工件

---

### `/opsx:ff`

快速生成所有工件。一次性创建所有规划工件。

**语法:**
```
/opsx:ff [change-name]
```

**参数:**
| 参数 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要快速生成的变更（如果未提供，则从上下文推断） |

**功能:**
- 按依赖顺序创建所有工件
- 通过待办事项列表跟踪进度
- 在所有 `apply-required` 工件完成后停止
- 在创建下一个工件之前读取每个依赖项

**示例:**
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

**提示:**
- 当您对正在构建的内容有清晰的了解时使用
- 比 `/opsx:continue` 更快，适用于简单的变更
- 您仍然可以在之后编辑工件
- 适合小型到中型的功能

---

### `/opsx:apply`

实施变更中的任务。遍历任务列表，编写代码并勾选项目。

**语法:**
```
/opsx:apply [change-name]
```

**参数:**
| 参数 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要实施的变更（如果未提供，则从上下文推断） |

**功能:**
- 读取 `tasks.md` 并识别未完成的任务
- 逐一处理任务
- 根据需要编写代码、创建文件、运行测试
- 使用复选框 `[x]` 标记任务完成

**示例:**
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

**提示:**
- 如果中断，可以从上次停止的地方恢复
- 通过指定变更名称可用于并行变更
- 完成状态记录在 `tasks.md` 的复选框中

---

### `/opsx:verify`

验证实施是否符合您的变更工件。检查完整性、正确性和一致性。

**语法:**
```
/opsx:verify [change-name]
```

**参数:**
| 参数 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要验证的变更（如果未提供，则从上下文推断） |

**功能:**
- 检查实施质量的三个维度
- 搜索代码库以寻找实施证据
- 报告分类为 CRITICAL、WARNING 或 SUGGESTION 的问题
- 不会阻止归档，但会显示问题

**验证维度:**

| 维度 | 验证内容 |
|---|---|
| **Completeness (完整性)** | 所有任务均已完成，所有需求均已实现，场景均已覆盖 |
| **Correctness (正确性)** | 实施符合 spec 的意图，已处理边缘情况 |
| **Coherence (一致性)** | 设计决策体现在代码中，模式保持一致 |

**示例:**
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

**提示:**
- 在归档之前运行，以尽早发现不匹配的问题
- 警告不会阻止归档，但表明存在潜在问题
- 适合在提交前审查 AI 的工作成果
- 可以揭示工件和实施之间的偏差

---

### `/opsx:sync`

**可选命令。** 将变更中的 delta specs 合并到主 spec 中。如果需要，Archive 会提示同步，因此您通常不需要手动运行此命令。

**语法:**
```
/opsx:sync [change-name]
```

**参数:**
| 参数 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要同步的变更（如果未提供，则从上下文推断） |

**功能:**
- 读取变更文件夹中的 delta specs
- 解析 ADDED/MODIFIED/REMOVED/RENAMED 部分
- 将更改合并到主 `openspec/specs/` 目录
- 保留未提及的现有内容
- 不会归档该变更（仍保持活动状态）

**示例:**
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

**何时手动使用:**

| 场景 | 是否使用 sync? |
|---|---|
| 长期的变更，在归档前想让主 spec 中有这些内容 | 是 |
| 多个并行变更需要更新的基础 spec | 是 |
| 想单独预览/审查合并结果 | 是 |
| 快速变更，直接进行归档 | 否 (archive 会处理) |

**提示:**
- Sync 是智能的，不是简单的复制粘贴
- 可以向现有需求添加场景而无需重复
- 同步后变更仍保持活动状态（未被归档）
- 大多数用户都不需要直接调用此命令——Archive 如果需要会提示

---

### `/opsx:archive`

归档一个已完成的变更。最终确定该变更，并将其移至归档文件夹。

**语法:**
```
/opsx:archive [change-name]
```

**参数:**
| 参数 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要归档的变更（如果未提供，则从上下文推断） |

**功能:**
- 检查工件完成状态
- 检查任务完成情况（如果未完成会发出警告）
- 提供同步 delta specs 的选项（如果尚未同步）
- 将变更文件夹移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`
- 保留所有工件以供审计追踪

**示例:**
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

**提示:**
- 归档不会因为任务未完成而阻止，但会发出警告
- Delta specs 可以在归档过程中或之前进行同步
- 已归档的变更会被保留用于历史记录
- 建议先运行 `/opsx:verify` 以尽早发现问题

---

### `/opsx:bulk-archive`

一次性归档多个已完成的变更。处理不同变更之间的 spec 冲突。

**语法:**
```
/opsx:bulk-archive [change-names...]
```

**参数:**
| 参数 | 是否必需 | 描述 |
|---|---|---|
| `change-names` | 否 | 要归档的特定变更（如果未提供，则会提示选择） |

**功能:**
- 列出所有已完成的变更
- 在归档前验证每个变更
- 检测跨变更的 spec 冲突
- 通过检查实际实施内容来解决冲突
- 按时间顺序进行归档

**示例:**
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

**提示:**
- 适合并行工作流
- 冲突解决是代理式的（检查代码库）
- 变更按创建顺序进行归档
- 在覆盖 spec 内容之前会发出提示

---

### `/opsx:onboard`

通过完整的 OpenSpec 工作流进行引导式学习。这是一个使用您实际代码库的交互式教程。

**语法:**
```
/opsx:onboard
```

**功能:**
- 带着叙述性地走完一个完整的流程周期
- 扫描您的代码库以寻找真正的改进机会
- 创建一个带有真实工件的实际变更
- 实施实际工作（小型、安全的变更）
- 归档完成的变更
- 在每一步发生时进行解释

**阶段:**
1. 欢迎和代码库分析
2. 寻找改进机会
3. 创建变更 (`/opsx:new`)
4. 撰写 proposal
5. 创建 specs
6. 编写设计
7. 创建 tasks
8. 实施任务 (`/opsx:apply`)
9. 验证实施
10. 归档变更
11. 总结和下一步

**示例:**
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

**提示:**
- 最适合学习工作流的新用户
- 使用真实代码，而不是玩具示例
- 会创建一个您可以保留或丢弃的实际变更
- 完成需要 15-30 分钟

## AI 工具的命令语法

不同的 AI 工具使用略有差异的命令语法。请使用与您的工具相匹配的格式：

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

所有工具的意图都是相同的，但命令如何呈现可能因集成而异。

> **注意：** GitHub Copilot 命令（`.github/prompts/*.prompt.md`）仅在 IDE 扩展中可用（VS Code, JetBrains, Visual Studio）。GitHub Copilot CLI 目前不支持自定义提示文件——请参阅 [Supported Tools](supported-tools.md) 获取详情和解决方案。

---

## 遗留命令 (Legacy Commands)

这些命令使用了较旧的“一揽子”工作流程。它们仍然有效，但推荐使用 OPSX 命令。

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | 一次性创建所有产物（提案、规范、设计、任务） |
| `/openspec:apply` | 实现更改 |
| `/openspec:archive` | 归档更改 |

**何时使用遗留命令：**
- 使用旧工作流程的现有项目
- 不需要增量式产物创建的简单更改
- 偏好“要么全有，要么全无”的方法

**迁移到 OPSX：**
可以使用 OPSX 命令继续进行遗留更改。产物结构是兼容的。

---

## 故障排除 (Troubleshooting)

### “未找到更改” ("Change not found")

命令无法识别要处理的是哪一个更改。

**解决方案：**
- 明确指定更改名称：`/opsx:apply add-dark-mode`
- 检查更改文件夹是否存在：`openspec list`
- 验证您是否在正确的项目目录中

### “没有可用的产物” ("No artifacts ready")

所有产物要么已完成，要么被缺失的依赖项所阻塞。

**解决方案：**
- 运行 `openspec status --change <name>` 以查看哪些内容正在阻塞
- 检查所需的产物是否存在
- 先创建缺失的依赖产物

### “未找到 Schema” ("Schema not found")

指定的 schema 不存在。

**解决方案：**
- 列出可用的 schemas：`openspec schemas`
- 检查 schema 名称拼写
- 如果是自定义 schema，请创建它：`openspec schema init <name>`

### 命令无法识别 (Commands not recognized)

AI 工具不识别 OpenSpec 命令。

**解决方案：**
- 确保已初始化 OpenSpec：`openspec init`
- 重新生成 skills：`openspec update`
- 检查 `.claude/skills/` 目录是否存在（针对 Claude Code）
- 重启您的 AI 工具以加载新的 skills

### 产物未正确生成 (Artifacts not generating properly)

AI 生成了不完整或不正确的产物。

**解决方案：**
- 在 `openspec/config.yaml` 中添加项目上下文
- 添加针对特定指导的每个产物的规则
- 在更改描述中提供更多细节
- 使用 `/opsx:continue` 而不是 `/opsx:ff` 以获得更多的控制权

---

## 后续步骤 (Next Steps)

- [Workflows](workflows.md) - 常见模式和何时使用每条命令
- [CLI](cli.md) - 用于管理和验证的终端命令
- [Customization](customization.md) - 创建自定义 schemas 和工作流程