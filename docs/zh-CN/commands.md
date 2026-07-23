# 命令

本文档是 OpenSpec 斜杠命令的参考说明。这些命令会在 AI 编程助手的聊天界面中调用（例如 Claude Code、Cursor、Windsurf）。

有关工作流模式以及各命令的使用场景，请参阅[工作流](workflows.md)。有关 CLI 命令，请参阅[CLI](cli.md)。

## 快速参考

### 默认快速路径（`core` 配置文件）

| 命令 | 用途 |
|---------|---------|
| `/opsx:propose` | 创建变更，一步生成规划产物 |
| `/opsx:explore` | 在确定变更前先梳理思路 |
| `/opsx:apply` | 根据变更要求实现任务 |
| `/opsx:update` | 修订变更的规划产物并保持其一致性 |
| `/opsx:sync` | 将增量规范合并到主规范中 |
| `/opsx:archive` | 归档已完成的变更 |

### 扩展工作流命令（自定义工作流选择）

| 命令 | 用途 |
|---------|---------|
| `/opsx:new` | 启动新的变更脚手架 |
| `/opsx:continue` | 根据依赖关系生成下一个产物 |
| `/opsx:ff` | 快速推进：一次性生成所有规划产物 |
| `/opsx:verify` | 验证实现内容与规划产物是否一致 |
| `/opsx:bulk-archive` | 批量归档多个变更 |
| `/opsx:onboard` | 通过引导教程完成完整工作流流程 |

默认全局配置文件为 `core`。如需启用扩展工作流命令，请运行 `openspec config profile` 选择工作流，之后在项目中运行 `openspec update` 即可。

---

## 命令参考

### `/opsx:propose`

一步创建新变更并生成规划产物。这是 `core` 配置文件的默认起始命令。

**语法：**
```text
/opsx:propose [change-name-or-description]
```

**参数：**
| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `change-name-or-description` | 否 | kebab-case 格式的名称或自然语言描述的变更内容 |

**作用：**
- 创建 `openspec/changes/<change-name>/` 目录
- 生成实现前所需的产物（`spec-driven` 模式下包括：提案、规格说明、设计、任务）
- 当变更准备好进入 `/opsx:apply` 阶段时停止

**示例：**
```text
You: /opsx:propose add-dark-mode

AI:  已创建 openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     已准备好进入实现阶段。运行 /opsx:apply 即可开始。
```

**提示：**
- 这是最快的一站式端到端路径
- 如果需要分步控制产物生成，可启用扩展工作流，使用 `/opsx:new` + `/opsx:continue` 组合

---

### `/opsx:explore`

> **不确定从哪开始时，从这里入手。** Explore 是无风险的思考伙伴：它会读取你的代码库、对比不同方案，在变更创建前将模糊的想法打磨成具体计划。该命令随默认配置文件一起提供。完整案例和更多示例请参阅 [优先探索](explore.md) 指南。

在确定变更前梳理思路、排查问题、明确需求。

**语法：**
```
/opsx:explore [topic]
```

**参数：**
| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `topic` | 否 | 你想要探索或调研的内容 |

**作用：**
- 开启无固定结构的探索性对话
- 调研代码库以解答疑问
- 对比不同选项和实现方案
- 生成可视化图表来梳理思路
- 当思路清晰后，可切换至 `/opsx:propose`（默认）或 `/opsx:new`（扩展工作流）继续推进

**示例：**
```text
You: /opsx:explore

AI:  你想探索什么内容？

You: 我们应该如何处理移动应用的认证？

AI:  让我先调研你当前的认证配置...
     [分析代码库]

     我看到你的 Web 应用目前使用基于会话的认证。针对移动端，我们有三个主要选项：
     1. JWT 令牌（无状态，支持离线使用）
     2. OAuth2（如果你需要第三方登录）
     3. 扩展现有会话（更简单，但需要保持网络连接）

     你的 API 已经配置了 CORS。你对哪个方向感兴趣？

You: 那就选 JWT 吧。我们可以为此创建一个变更吗？

AI:  随时可以开始。运行 /opsx:propose add-jwt-auth 即可启动变更。
```

**提示：**
- 适用于需求不明确或需要调研的场景
- 探索过程中不会生成任何产物
- 适合在决策前对比多种方案
- 可读取文件、搜索代码库

---

### `/opsx:new`

创建新变更脚手架。生成变更文件夹后，会等待你使用 `/opsx:continue` 或 `/opsx:ff` 生成产物。该命令属于扩展工作流集（未包含在默认 `core` 配置文件中）。

**语法：**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**参数：**
| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 变更文件夹的名称（未提供时会提示输入） |
| `--schema` | 否 | 要使用的工作流模式（默认：来自配置文件或 `spec-driven`） |

**作用：**
- 创建 `openspec/changes/<change-name>/` 目录
- 在变更文件夹中创建 `.openspec.yaml` 元数据文件
- 展示第一个待创建的产物模板
- 未提供参数时会提示输入变更名称和模式

**生成内容：**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # 变更元数据（模式、创建日期）
```

**示例：**
```
You: /opsx:new add-dark-mode

AI:  已创建 openspec/changes/add-dark-mode/
     模式：spec-driven

     待创建产物：proposal
     使用 /opsx:continue 创建该产物，或使用 /opsx:ff 一次性创建所有产物。
```

**提示：**
- 使用描述性名称，例如 `add-feature`、`fix-bug`、`refactor-module`
- 避免使用 `update`、`changes`、`wip` 这类泛化名称
- 模式也可以在项目配置文件（`openspec/config.yaml`）中设置

---

### `/opsx:continue`

按依赖链创建下一个产物。每次创建一个产物，支持增量推进。

**语法：**
```
/opsx:continue [change-name]
```

**参数：**
| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要延续的变更（未提供时会从上下文推断） |

**作用：**
- 查询产物依赖关系图
- 展示哪些产物已就绪、哪些被阻塞
- 创建第一个就绪的产物
- 读取依赖文件以获取上下文
- 展示创建后可用的后续产物

**示例：**
```
You: /opsx:continue

AI:  变更：add-dark-mode

     产物状态：
     ✓ proposal    （已完成）
     ◆ specs       （已就绪）
     ◆ design      （已就绪）
     ○ tasks       （已阻塞 - 依赖：specs）

     正在创建 specs...

     [读取 proposal.md，基于需求创建 specs]

     ✓ 已创建 openspec/changes/add-dark-mode/specs/ui/spec.md

     现在可用产物：tasks
     运行 /opsx:continue 创建下一个产物。
```

**提示：**
- 适用于希望在推进前审查每个产物的场景
- 适合需要精细控制的复杂变更
- 可能有多个产物同时就绪
- 继续前可以编辑已创建的产物

---

### `/opsx:ff`

快进式产物创建。一次性生成所有规划产物。

**语法：**
```
/opsx:ff [change-name]
```

**参数：**
| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要快进的变更（未提供时会从上下文推断） |

**作用：**
- 按依赖顺序创建所有产物
- 通过待办列表跟踪进度
- 所有需要 apply 阶段的产物完成后停止
- 创建下一个产物前会读取对应的依赖文件

**示例：**
```
You: /opsx:ff add-dark-mode

AI:  正在快进处理 add-dark-mode...

     ✓ 正在创建 proposal.md
     ✓ 正在创建 specs/ui/spec.md
     ✓ 正在创建 design.md
     ✓ 正在创建 tasks.md

     所有规划产物已创建完成！
     已准备好进入实现阶段。运行 /opsx:apply 即可开始。
```

**提示：**
- 适用于对要构建的内容有清晰认知的场景
- 对于简单的变更，比 `/opsx:continue` 更快
- 创建后仍可编辑产物
- 适合中小型功能

---

### `/opsx:apply`

执行变更中的任务。按任务清单逐步完成，编写代码并标记完成项。

**语法：**
```
/opsx:apply [change-name]
```

**参数：**
| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要实现的变更（未提供时会从上下文推断） |

**作用：**
- 读取 `tasks.md` 并识别未完成的任务
- 逐个完成任务
- 按需编写代码、创建文件、运行测试
- 用复选框 `[x]` 标记任务为已完成

**示例：**
```
You: /opsx:apply

AI:  正在实现 add-dark-mode...

     正在读取 tasks.md：
     - [ ] 1.1 创建 ThemeContext
     - [ ] 1.2 添加 CSS 自定义属性
     - [ ] 1.3 实现 localStorage 持久化

     正在处理 1.1：创建 ThemeContext...
     [创建 src/context/ThemeContext.tsx]

     ✓ 1.1 已完成

     正在处理 1.2：添加 CSS 自定义属性...
     [更新 src/styles/globals.css]

     ✓ 1.2 已完成
     ...
```

**提示：**
- 如果中断，可以从中断的位置继续执行
- 通过指定变更名称，可并行处理多个变更
- 完成状态通过 `tasks.md` 中的复选框跟踪

---

### `/opsx:update`

修订变更的现有规划产物，并保持各产物之间的一致性。仅处理规划产物，不会修改代码。

**语法：**

```text
/opsx:update [change-name]
```

**参数：**

| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要更新的变更（未提供时会从上下文推断） |

**作用：**

- 通过 `openspec status --change <name> --json` 读取变更的所有产物
- 应用你指定的修订内容；如果未明确修订内容，则会检查产物之间是否存在矛盾
- 同步调整其他现有产物（例如修改设计可能会反向影响提案）
- 每次写入前都会逐产物确认所有修改
- 最后会推荐下一步操作：`/opsx:continue`（产物缺失）、`/opsx:apply`（将修订后的计划落地到代码）或 `/opsx:archive`（全部完成）

**示例：**

```text
You: /opsx:update add-dark-mode - 我们现在把主题存在 cookie 里，不用 localStorage 了

AI:  正在读取 add-dark-mode 的产物...

     设计文档中有两处引用了 localStorage；任务 1.3 覆盖了 localStorage 持久化逻辑；提案中未提及存储方案。

     提议的修订内容：
     1. design.md - 将 localStorage 方案替换为 cookie 存储
     2. tasks.md - 将任务 1.3 的描述修改为 cookie 持久化

     是否应用修订 1？（design.md）
```

**提示：**

- 不会创建缺失的产物，该功能由 `/opsx:continue` 提供
- 如果变更已经实现，请后续执行 `/opsx:apply` 以确保代码与修订后的计划一致
- 如果你的修订内容改变了变更的*核心目标*，建议重新创建一个新变更（详见[何时更新 vs 重新开始](opsx.md#when-to-update-vs-start-fresh)）

---

### `/opsx:verify`

验证实现内容与变更产物的一致性。检查完整性、正确性和一致性三个维度。

**语法：**
```
/opsx:verify [change-name]
```

**参数：**
| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要验证的变更（未提供时会从上下文推断） |

**作用：**
- 检查实现质量的三个维度
- 搜索代码库以获取实现证据
- 将问题按 CRITICAL（严重）、WARNING（警告）、SUGGESTION（建议）分类报告
- 不会阻止归档操作，但会暴露所有问题

**验证维度：**

| 维度 | 验证内容 |
|-----------|-------------------|
| **完整性** | 所有任务已完成、所有需求已实现、所有场景已覆盖 |
| **正确性** | 实现符合规格说明的预期、边界情况已处理 |
| **一致性** | 设计决策在代码中有所体现、代码模式保持一致 |

**示例：**
```
You: /opsx:verify

AI:  正在验证 add-dark-mode...

     完整性
     ✓ tasks.md 中的 8 个任务均已标记完成
     ✓ 规格说明中的所有需求都有对应代码实现
     ⚠ 场景「系统偏好检测」无测试覆盖

     正确性
     ✓ 实现符合规格说明的预期
     ✓ 场景中的边界情况已处理
     ✓ 错误状态符合规格说明的定义

     一致性
     ✓ 设计决策在代码结构中有所体现
     ✓ 命名规范与 design.md 保持一致
     ⚠ 设计文档提及「CSS 变量」，但实现使用了 Tailwind 类

     总结
     ─────────────────────────────
     严重问题：0
     警告：2
     可归档：是（存在警告）

     建议：
     1. 为系统偏好检测场景添加测试
     2. 更新 design.md 以反映 Tailwind 的使用情况，或重构代码以使用 CSS 变量
```

**提示：**
- 归档前运行该命令，提前发现不一致问题
- 警告不会阻止归档，但代表存在潜在问题
- 适合在提交前审查 AI 的工作成果
- 可发现产物与实现之间的偏差

---

### `/opsx:sync`

**可选命令。** 将变更中的增量规格说明合并到主规格说明中。归档时会提示是否需要同步，因此通常无需手动运行该命令。

**语法：**
```
/opsx:sync [change-name]
```

**参数：**
| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要同步的变更（未提供时会从上下文推断） |

**作用：**
- 读取变更文件夹中的增量规格说明
- 解析 ADDED（新增）/MODIFIED（修改）/REMOVED（删除）/RENAMED（重命名）区块
- 将变更合并到主 `openspec/specs/` 目录
- 保留增量中未提及的现有内容
- 不会归档变更（变更仍处于激活状态）

**示例：**
```text
You: /opsx:sync

AI:  正在同步 add-dark-mode 的增量规格说明...

     读取源：openspec/changes/add-dark-mode/specs/ui/spec.md
     目标：openspec/specs/ui/spec.md

     待应用的变更：
     ✓ 新增：主题选择需求（2 个场景）
     ✓ 新增：无障碍需求（1 个场景）

     正在合并...
     ✓ openspec/specs/ui/spec.md 已更新

     变更仍处于激活状态。准备完成后运行 /opsx:archive 即可完成归档。
```

**手动使用场景：**

| 场景 | 是否需要同步？ |
|----------|-----------|
| 长期运行的变更，希望在归档前将规格说明合并到主分支 | 是 |
| 多个并行变更需要使用更新后的基础规格说明 | 是 |
| 希望单独预览/审查合并结果 | 是 |
| 快速变更，直接归档即可 | 否（归档操作会自动处理） |

**提示：**
- 同步逻辑是智能的，而非简单的复制粘贴
- 可在不重复的前提下，为现有需求新增场景
- 同步后变更仍处于激活状态（不会自动归档）
- 绝大多数用户无需直接调用该命令，归档时会自动提示是否需要同步

---

### `/opsx:archive`

归档已完成的变更。完成变更的收尾工作，并将其移动到归档文件夹。

**语法：**
```
/opsx:archive [change-name]
```

**参数：**
| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要归档的变更（未提供时会从上下文推断） |

**作用：**
- 检查产物完成状态
- 检查任务完成情况（未完成会发出警告）
- 如果增量规格说明未同步，会提示是否执行同步
- 将变更文件夹移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`
- 保留所有产物以供审计追溯

**示例：**
```text
You: /opsx:archive

AI:  正在归档 add-dark-mode...

     产物状态：
     ✓ proposal.md 存在
     ✓ specs/ 存在
     ✓ design.md 存在
     ✓ tasks.md 存在（8/8 个任务已完成）

     增量规格说明：尚未同步
     → 是否立即同步？（推荐）

You: Yes

AI:  ✓ 已将规格说明同步到 openspec/specs/ui/spec.md
     ✓ 已移动到 openspec/changes/archive/2025-01-24-add-dark-mode/

     变更归档成功。
```

**提示：**
- 即使任务未完成，归档操作也不会被阻止，但会发出警告
- 增量规格说明可以在归档时同步，也可以提前同步
- 已归档的变更会被保留以供历史查询
- 建议先执行 `/opsx:verify` 以提前发现问题

---

### `/opsx:bulk-archive`

一次性归档多个已完成的变更。可处理变更之间的规格说明冲突。

**语法：**
```
/opsx:bulk-archive [change-names...]
```

**参数：**
| 参数 | 是否必填 | 描述 |
|----------|----------|-------------|
| `change-names` | 否 | 要归档的指定变更（未提供时会提示选择） |

**作用：**
- 列出所有已完成的变更
- 归档前验证每个变更的状态
- 检测变更之间的规格说明冲突
- 通过检查实际实现内容解决冲突
- 按创建时间顺序归档

**示例：**
```
You: /opsx:bulk-archive

AI:  发现 3 个已完成的变更：
     - add-dark-mode（8/8 个任务已完成）
     - fix-login-bug（3/3 个任务已完成）
     - update-footer（2/2 个任务已完成）

     正在检查规格说明冲突...
     ⚠ add-dark-mode 和 update-footer 都涉及 specs/ui/ 目录

     正在检查代码库以解决冲突...
     两个变更均已实现。将按创建时间顺序合并：
     1. add-dark-mode（创建于 1 月 20 日）
     2. update-footer（创建于 1 月 22 日）

     是否归档全部 3 个变更？

You: Yes

AI:  ✓ 已归档 add-dark-mode
     ✓ 已归档 fix-login-bug
     ✓ 已归档 update-footer
     规格说明已合并：add-dark-mode → update-footer
```

**提示：**
- 适合并行工作流
- 冲突解决是智能的（会自动检查代码库）
- 变更按创建顺序归档
- 覆盖规格说明内容前会提示确认

---

### `/opsx:onboard`

OpenSpec 完整工作流引导式入门教程。使用你的真实代码库进行交互式教学。

**语法：**
```
/opsx:onboard
```

**作用：**
- 配合讲解走完完整的工作流周期
- 扫描你的代码库寻找真实的优化机会
- 创建包含真实产物的实际变更
- 实现实际工作（小型、安全的变更）
- 归档已完成的变更
- 每一步都会同步讲解原理

**阶段：**
1. 欢迎与代码库分析
2. 寻找优化机会
3. 创建变更（`/opsx:new`）
4. 编写提案
5. 创建规格说明
6. 编写设计文档
7. 创建任务清单
8. 执行任务（`/opsx:apply`）
9. 验证实现结果
10. 归档变更
11. 总结与后续步骤

**示例：**
```
You: /opsx:onboard

AI:  欢迎使用 OpenSpec！

     我会使用你的真实代码库带你走完完整的工作流。我们会找一个小的优化点，为其创建规范的变更，实现后归档。

     让我扫描你的代码库寻找优化机会...

     [分析代码库]

     我发现了一些可以优化的点：
     1. 为联系表单添加输入校验
     2. 优化认证流程的错误提示
     3. 为异步按钮添加加载状态

     你对哪个感兴趣？（或者也可以提出其他想法）
```

**提示：**
- 适合正在学习工作流的新用户
- 使用真实代码，而非示例代码
- 会创建一个真实变更，你可以选择保留或丢弃
- 完成整个流程需要 15-30 分钟

## 各AI工具的命令语法

不同AI工具的命令语法略有差异，请使用与你的工具匹配的格式：

| 工具 | 语法示例 |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | 基于技能的调用，例如 `/openspec-propose`、`/openspec-apply-change`（不会生成 `opsx-*` 格式的命令文件） |
| Codex | 从 `.codex/skills/openspec-*` 目录调用技能（不会生成 `opsx-*` 格式的提示词文件） |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | 基于技能的调用，例如 `/skill:openspec-propose`、`/skill:openspec-apply-change`（不会生成 `opsx-*` 格式的命令文件） |
| Trae | `/opsx-propose`, `/opsx-apply` |

所有工具的底层逻辑一致，但命令的呈现方式会因集成方式不同而有所差异。

> **注意：** GitHub Copilot 命令（`.github/prompts/*.prompt.md`）仅在 IDE 扩展（VS Code、JetBrains、Visual Studio）中可用。GitHub Copilot CLI 目前不支持自定义提示词文件，详情和替代方案请参阅[支持的工具](supported-tools.md)。

---

## 旧版命令

这些命令采用更早的「全量一次性」工作流，目前仍可使用，但推荐使用 OPSX 命令。

| 命令 | 功能说明 |
|---------|--------------|
| `/openspec:proposal` | 一次性创建所有产物（提案、规范、设计、任务） |
| `/openspec:apply` | 执行变更 |
| `/openspec:archive` | 归档变更 |

**旧版命令适用场景：**
- 正在使用旧工作流的现有项目
- 无需增量创建产物的简单变更
- 偏好「全有或全无」的处理方式

**迁移至 OPSX：**
旧版变更可使用 OPSX 命令继续处理，产物结构完全兼容。

---

## 故障排查

### "未找到变更"

命令无法识别要处理的变更。

**解决方案：**
- 明确指定变更名称：`/opsx:apply add-dark-mode`
- 检查变更文件夹是否存在：`openspec list`
- 确认当前处于正确的项目目录下

### "无可用产物"

所有产物要么已完成，要么因缺少依赖项而被阻塞。

**解决方案：**
- 运行 `openspec status --change <name>` 查看阻塞原因
- 检查所需产物是否存在
- 先创建缺失的依赖产物

### "未找到模式"

指定的模式不存在。

**解决方案：**
- 列出可用模式：`openspec schemas`
- 检查模式名称拼写
- 如果是自定义模式，请创建：`openspec schema init <name>`

### 命令无法识别

AI 工具无法识别 OpenSpec 命令。

**解决方案：**
- 确保 OpenSpec 已初始化：`openspec init`
- 重新生成技能：`openspec update`
- 检查 `.claude/skills/` 目录是否存在（适用于 Claude Code）
- 重启 AI 工具以加载新技能

### 产物生成异常

AI 生成的产物不完整或存在错误。

**解决方案：**
- 在 `openspec/config.yaml` 中添加项目上下文
- 为各产物添加专属规则以提供具体指引
- 在变更描述中补充更多细节
- 使用 `/opsx:continue` 替代 `/opsx:ff` 以获得更多控制权

---

## 后续步骤

- [工作流](workflows.md) - 常见模式及各命令适用场景
- [CLI](cli.md) - 用于管理和验证的终端命令
- [自定义配置](customization.md) - 创建自定义模式和工作流