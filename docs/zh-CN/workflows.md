# 工作流

本指南涵盖了 OpenSpec 的常见工作流模式，以及何时使用它们。有关基本设置，请参阅 [Getting Started](getting-started.md)。有关命令参考，请参阅 [Commands](commands.md)。

## 理念：操作而非阶段

传统的流程会迫使你经历一系列阶段：规划、然后实现，最后完成。但真实的工作并不能完美地放入这些方框中。

OPSX 采取了不同的方法：

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**核心原则：**

- **操作而非阶段** - 命令是你能够做的事情，而不是你被困住的阶段。
- **依赖是赋能者** - 它们展示了哪些是可行的，而不是下一步必须完成什么。

> **自定义：** OPSX 工作流由定义工件序列的 schemas 驱动。有关创建自定义 schemas 的详细信息，请参阅 [Customization](customization.md)。

## 两种模式

### 默认快速路径（`core` 配置）

新安装程序默认为 `core`，它提供了以下功能：
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

典型流程：

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (可选)
```

#### 从探索开始（值得养成的一个习惯）

`/opsx:explore` 是默认配置的一部分，而不是高级附加功能。当你有一个问题但还没有计划时，就应该使用它，而这种情况通常是这样。

```text
You: /opsx:explore

AI:  您想探索什么？

You: 我们的搜索结果感觉很陈旧。我不确定这是缓存、索引还是查询本身的问题。

AI:  让我看看…… [读取搜索服务和缓存层]
     问题出在索引上：它只进行夜间重建，因此编辑内容直到第二天才会显示。有两种选择：写入时重建（简单，负载更高）或短 TTL 缓存失效（涉及更多组件，负载更低）。考虑到您的写入量较低，写入时重建是更干净的解决方案。想限定范围吗？

You: 是的。

You: /opsx:propose rebuild-search-index-on-write
```

探索功能不会创建任何产物，也不会编写代码。它是一次免费、零风险的对话，可以将模糊的担忧转化为精确的变更，从而使随后的提案更加精准。是否已经确切知道自己想要什么？请跳过这一步，直接进入 `/opsx:propose`。完整指南：[Explore First](explore.md)。

### 扩展/完整工作流（自定义选择）

如果您想启用显式的脚手架和构建命令（`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`），请使用以下命令：

```bash
openspec config profile
openspec update
```

## 工作流模式（扩展模式）

### 快速功能 (Quick Feature)

当你清楚自己想构建什么，只需要执行时：

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**示例对话：**

```text
You: /opsx:new add-logout-button

AI:  已创建 openspec/changes/add-logout-button/
     准备创建：proposal

You: /opsx:ff

AI:  正在创建所有规划产物...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     准备实施！

You: /opsx:apply

AI:  正在处理任务...
     ✓ 已在头部添加退出登录按钮
     ✓ 已实现会话清除
     ✓ 已添加确认对话框
     所有任务均已完成！

You: /opsx:archive

AI:  ✓ 已合并规范 (specs)
     ✓ 已归档变更
```

**适用场景：** 小型到中等的功能、错误修复、直接的变更。

### 探索性工作流 (Exploratory)

当需求不明确或需要先进行调查时：

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**示例对话：**

```text
You: /opsx:explore

AI:  您想探索什么？

You: 我想提高页面加载性能，但我不知道瓶颈在哪里。

AI:  让我帮助调查……
     [分析捆绑包大小、识别慢查询、审查组件渲染模式]

     我发现了三个主要瓶颈：
     1. 大型未优化的图片
     2. ProductList 中的同步数据获取
     3. 来自上下文更改的重新渲染

     您想先解决哪一个？

You: 让我们处理数据获取问题。

You: /opsx:new optimize-product-list-fetching

AI:  已创建变更。准备创建：proposal

You: /opsx:continue

AI:  正在根据我们的探索来创建提案...
     [撰写包含调查洞察的提案]

     准备创建：specs, design
     您想接下来做什么？

You: /opsx:continue

AI:  正在创建 specs...
```

**适用场景：** 性能优化、调试、架构决策、不明确的需求。

### 并行变更 (Parallel Changes)

同时处理多个变更：

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (进行中)
                                         │
                                    上下文切换
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**示例对话：**

```text
You: 我正在做 add-dark-mode，但被一个错误修复打断了

You: /opsx:new fix-login-redirect

AI:  已创建 openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ 已创建规划产物

You: /opsx:apply

AI:  正在处理 fix-login-redirect...
     [实施修复]
     所有任务均已完成！

You: /opsx:archive

AI:  ✓ 已归档 fix-login-redirect

You: 让我们回到暗黑模式 (dark mode)

You: /opsx:apply add-dark-mode

AI:  恢复 add-dark-mode...
     从任务 2.3：更新头部开始...
```

**适用场景：** 并行工作流、紧急中断、团队协作。

当您有多个已完成的变更时，请使用 `/opsx:bulk-archive`：

```text
You: /opsx:bulk-archive

AI:  找到 3 个已完成的变更：
     - add-dark-mode (所有任务均已完成)
     - fix-login-redirect (所有任务均已完成)
     - update-footer (所有任务均已完成)

     正在检查规范冲突...
     ⚠ add-dark-mode 和 update-footer 都涉及 specs/ui/

     正在检查代码库以解决问题...
     两个变更都已实现。将按时间顺序应用。

     是否归档所有 3 个变更？

You: 是

AI:  ✓ 已归档 add-dark-mode
     ✓ 已归档 fix-login-redirect
     ✓ 已归档 update-footer
     规范按顺序合并：add-dark-mode → update-footer
```

批量归档会检测多个变更是否涉及相同的规范，并通过检查实际已实现的内容来解决冲突。

### 完成一个变更 (Completing a Change)

推荐的完成流程：

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              验证实施情况          提示同步
              implementation     如果需要
```

#### 验证：检查您的工作 (Verify: Check Your Work)

`/opsx:verify` 会根据三个维度来验证实现是否符合您的产物要求：

```text
You: /opsx:verify

AI:  正在验证 add-auth...

     完整性 (COMPLETENESS)
     ✓ tasks.md 中的所有 12 个任务均已检查
     ✓ specs 中所有的需求都有对应的代码
     ⚠ 未测试“不活动后会话超时”的场景

     正确性 (CORRECTNESS)
     ✓ 实现与规范意图一致
     ✓ 已处理来自场景的边缘情况
     ✓ 错误状态符合规范定义

     连贯性 (COHERENCE)
     ✓ 设计决策已反映在代码结构中
     ✓ 命名约定与 design.md 一致
     ⚠ 设计中提到“事件驱动”，但实现使用了轮询

     摘要 (SUMMARY)
     ─────────────────────────────
     关键问题：0
     警告：2
     是否准备归档：是（带有警告）

     建议：
     1. 添加会话超时场景的测试
     2. 考虑重构为事件驱动，或更新 design.md
```

**验证检查的内容：**

| 维度 | 检查内容 |
|-----------|------------------|
| 完整性 (Completeness) | 所有任务均已完成、所有需求均已实现、场景均已覆盖 |
| 正确性 (Correctness) | 实现与规范意图一致、已处理边缘情况 |
| 连贯性 (Coherence) | 设计决策已反映在代码中、模式保持一致 |

验证不会阻止归档，但它会提示您可能需要先解决的问题。

#### 归档：完成变更 (Archive: Finalize the Change)

`/opsx:archive` 会完成该变更并将其移至归档：

```text
You: /opsx:archive

AI:  正在归档 add-auth...

     产物状态：
     ✓ proposal.md 存在
     ✓ specs/ 存在
     ✓ design.md 存在
     ✓ tasks.md 存在 (12/12 任务已完成)

     规范增量 (Delta specs)：尚未同步到主分支
     → 您想现在同步吗？

You: 是

AI:  ✓ 已将规范同步到 openspec/specs/auth/spec.md
     ✓ 已移至 openspec/changes/archive/2025-01-24-add-auth/

     变更已成功归档。
```

归档功能会提示如果规范尚未同步。它不会阻止未完成的任务，但会发出警告。

## 何时使用什么 (When to Use What)

### `/opsx:ff` 与 `/opsx:continue`

| 情况 | 使用方法 |
|-----------|-----|
| 需求明确，准备构建 | `/opsx:ff` |
| 正在探索，想审查每一步骤 | `/opsx:continue` |
| 在规范之前想迭代提案 | `/opsx:continue` |
| 时间紧迫，需要快速推进 | `/opsx:ff` |
| 变更复杂，想要控制权 | `/opsx:continue` |

**经验法则：** 如果您可以事先描述完整的范围，请使用 `/opsx:ff`。如果您是在过程中逐步弄清楚，请使用 `/opsx:continue`。

### 何时更新现有变更 vs 从头开始

一个常见问题：什么时候可以更新现有变更，什么时候应该开始一个新的？

**在以下情况下更新现有变更：**

- 意图相同，执行方式进行了完善
- 范围缩小（先实现 MVP，其余稍后）
- 基于学习的修正（代码库并非如预期）
- 基于实施发现的设计调整

**在以下情况下开始新的变更：**

- 意图发生了根本性改变
- 范围爆炸到完全不同的工作内容
- 原始变更可以独立标记为“已完成”
- 打补丁会造成更多的困惑而不是澄清

```text
                     ┌─────────────────────────────────────┐
                     │     这是同一项工作吗？          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          意图相同?      >50% 重叠?      原始变更是否可以在没有
          同一种问题?     相同的范围?        这些变更的情况下“完成”?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      是 (YES)         否 (NO) 是 (YES)           否 (NO)  否 (NO)  是 (YES)
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    更新 (UPDATE)     新变更 (NEW)  更新 (UPDATE)  新变更 (NEW)  更新 (UPDATE)  新变更 (NEW)
```

**示例：“添加暗黑模式”**

- “还需要支持自定义主题” → 新变更（范围爆炸）
- “检测系统偏好比预期的要困难得多” → 更新（意图相同）
- “先发布切换按钮，稍后再添加偏好设置” → 先更新再归档，然后创建新变更

## 最佳实践 (Best Practices)

### 使变更保持聚焦

每个变更只包含一个逻辑工作单元。如果您正在做“添加功能 X 并重构 Y”，请考虑两个独立的变更。

**为什么这很重要：**
- 更容易审查和理解
- 更清晰的归档历史记录
- 可以独立发布
- 如果需要，回滚更简单

### 对不明确的需求使用 `/opsx:explore`

在承诺进行任何变更之前，先探索问题空间：

```text
You: /opsx:explore

AI:  您想探索什么？

You: 我们应该如何处理 API 的速率限制 (rate limiting)？

AI:  让我调查您的当前设置和选项……
     [研究代码库，考虑模式]

     我看到了三种方法：
     1. 基于中间件（简单，按端点）
     2. 基于 Redis（可扩展，共享状态）
     3. 每个用户的令牌桶（公平，复杂）

     您当前的堆栈表明是 #1 或 #2。您的规模如何？
```

探索可以在您创建产物之前澄清思考过程。

### 归档前进行验证 (Verify Before Archiving)

使用 `/opsx:verify` 来检查实现是否符合产物要求：

```text
You: /opsx:verify

AI:  正在验证 add-dark-mode...

     ✓ tasks.md 中的所有任务均已检查
     ✓ 规范中的需求有对应的代码
     ✓ 设计决策已反映在实现中

     准备归档！
```

这可以在您关闭变更之前捕获不匹配的问题。

### 清晰地命名变更

好的名称可以使 `openspec list` 变得有用：

```text
好的示例:                          应避免:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## 命令快速参考

有关完整的命令详情和选项，请参阅[Commands](commands.md)。

| Command | 用途 | 使用时机 |
|---------|---------|-------------|
| `/opsx:propose` | 创建变更和规划工件 | 快速默认路径（`core` 配置） |
| `/opsx:explore` | 与AI一起构思想法 | 不确定时的起始点：需求不明确、调查研究、比较选项 |
| `/opsx:new` | 启动变更脚手架 | 扩展模式，显式控制工件 |
| `/opsx:continue` | 创建下一个工件 | 扩展模式，逐步创建工件 |
| `/opsx:ff` | 创建所有规划工件 | 扩展模式，范围明确 |
| `/opsx:apply` | 实现任务 | 准备编写代码时 |
| `/opsx:verify` | 验证实现 | 归档前的检查 |
| `/opsx:sync` | 合并差异规范 | 扩展模式，可选 |
| `/opsx:archive` | 完成变更 | 所有工作完成 |
| `/opsx:bulk-archive` | 归档多个变更 | 扩展模式，并行工作 |

## 后续步骤

- [Commands](commands.md) - 完整的命令参考和选项
- [Concepts](concepts.md) - 深入了解规范、工件和模式
- [Customization](customization.md) - 创建自定义工作流程