# 示例与配方

真实的场景，从始至终。每个配方都展示了你会输入的命令以及你将看到的返回结果，这样你可以将自己的情况与模式进行匹配并复制它。这些配方使用了默认的 **core** 命令（`propose`、`explore`、`apply`、`sync`、`archive`）；如果需要扩展集来帮助，则会注明。

在开始之前提醒一下：`/opsx:propose` 这类斜杠命令应输入到你的 **AI assistant 的聊天界面**中，而 `openspec` 命令应输入到你的 **终端 (terminal)** 中。如果这是你第一次接触这些功能，请先阅读 [How Commands Work](how-commands-work.md)。在下面的转录记录中，`You:` 和 `AI:` 是聊天内容，以 `$` 开头的行是终端操作。

> **还不确定自己正在构建什么？** 大部分配方如果能从 `/opsx:explore` 开始思考会更清晰。[Recipe 3](#recipe-3-exploring-before-you-commit) 展示了这一过程，而 [Explore First](explore.md) 指南则阐述了完整的论证过程。

## Recipe 1：一个小的功能，快速路径

**何时使用：** 你知道自己想要什么，并且这是一个独立的小型工作。这是最常见的配方。

整个流程包含三个命令：Propose（提议）、Build（构建）、Archive（归档）。

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

现在阅读计划。打开提案和 delta spec（差异规范）。这正是 OpenSpec 存在的价值：在错误的假设还只是一个段落，而不是四百行代码时就将其捕获。如果发现任何地方不对劲，请直接编辑任何产物，然后继续进行下一步操作。

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

就是这样。登出功能现在已成为你的规范的一部分，并且这个变更连同其完整的上下文一起被归档了。

## Recipe 2：一个 Bug 修复

**何时使用：** 有些东西坏掉了，而你希望将此修复记录为对行为的故意更改，而不是一个神秘的提交 (commit)。

Bug 修复的工作方式与功能开发完全相同。不同之处在于如何构建提案：描述*正确的*行为，而不仅仅是“修复这个 Bug”。

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

由于这个修复以一个带有全新场景的 `MODIFIED`（修改）需求形式出现，所以接下来的那个人（或下一次 AI 会话）看到的不仅仅是你修复了它，而是“正确”意味着什么。然后像往常一样执行 `/opsx:apply` 和 `/opsx:archive`。

提示：对于一个 Bug 修复，一个好的场景就是用自然语言描述的回归测试 (regression test)。例如：“给定一个未登录用户，当他们提交有效的凭证时，他们应该到达仪表板且不会再次被重定向。”写下这一点，实现过程就有了明确的目标。

## Recipe 3：在提交之前进行探索

**何时使用：** 你有一个问题，但还没有计划。你不确定该构建什么，或者哪种方法是正确的。

从 `/opsx:explore` 开始。它是一个没有结构、不创建任何产物的思考伙伴。它会阅读你的代码库并帮助你做决定。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

探索在花费精力进行变更*之前*澄清你的思路。当洞察力变得清晰时，就提出（propose），让 AI 承接住这个上下文。

## Recipe 4：同时处理两个变更

**何时使用：** 你正在进行一个功能开发，但有一个紧急的修复跳过了队列。

变更项是独立的文件夹，因此并行工作不会相互冲突。先开始修复，然后发布它，再回到功能开发，从上次中断的地方继续。

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

在 `/opsx:apply add-dark-mode` 中命名变更，就是告诉 AI 在多个变更同时进行时，你指的是哪个特定的变更。因为任务会跟踪 `tasks.md` 中的完成情况，AI 就知道你停在了哪里。

当同时完成多个变更时，扩展的 `/opsx:bulk-archive` 会将它们一起归档，并通过检查实际实现内容来解决规范冲突。请参阅 [Workflows](workflows.md#parallel-changes)。

## Recipe 5：一个没有行为变化的重构 (refactor)

**何时使用：** 你正在重组代码，并且外部可见的行为应该保持不变。

这是有趣的情况，因为纯粹的重构*不需要对你的规范添加任何内容*。行为契约不会改变；只有实现方式会改变。因此，工作内容体现在设计和任务中，而规范差异（spec delta）是空的或不存在的。

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

当你归档一个不涉及规范的变更时，你可以告诉终端命令跳过规范步骤：

```bash
$ openspec archive refactor-payment-module --skip-specs
```

这个标志对于工具、CI 和文档专用变更也是有用的。原则是：规范描述行为，因此如果行为没有改变，规范也不应该改变。请参阅 [Concepts](concepts.md#what-a-spec-is-and-is-not)。

## Recipe 6：分步控制（扩展命令）

**何时使用：** 一个复杂或有风险的变更，你希望在继续进行下一步操作之前审查每一个产物 (artifact)。

核心的 `/opsx:propose` 一次性地起草所有内容。如果你更倾向于一步一个地走，那就启用扩展命令：

```bash
$ openspec config profile      # 选择扩展工作流程
$ openspec update              # 将它们应用于此项目
```

现在你可以增量地搭建和构建：

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

随着每个产物的生成，进行审查、自由编辑，并在满意后继续。当你希望其余内容一次性起草完成时，`/opsx:ff` 会快速推进剩余的规划产物。在归档之前，`/opsx:verify` 会检查实现是否确实与规范匹配。请参阅 [Workflows](workflows.md#opsxff-vs-opsxcontinue)。

## Recipe 7：亲身体验整个流程

**何时使用：** 你已经安装了 OpenSpec，并希望在自己的代码库上（而不是玩具示例）*感受*这个工作流。

启用扩展命令（参阅 Recipe 6），然后：

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` 会找到一个真实的（小的）改进点，为其创建变更，进行实现并归档，同时叙述每一个步骤。这需要 15 到 30 分钟，会给你一个你可以保留或丢弃的真实变更。这是最温和的学习方式。请参阅 [Commands](commands.md#opsxonboard)。

## 从终端检查你的工作

任何时候，你都可以从终端中检查事物的状态：

```bash
$ openspec list                      # 活跃的变更 (active changes)
$ openspec show add-dark-mode        # 单个变更详情
$ openspec validate add-dark-mode    # 检查结构
$ openspec view                      # 交互式仪表板
```

这些都是读取和检查工具。提案和构建仍然是通过聊天中的斜杠命令完成的。完整的细节请参阅 [CLI reference](cli.md)。

## 下一步去哪里？

- [Explore First](explore.md)：如果你不确定，这是推荐的起始方式
- [Workflows](workflows.md)：即上述配方，并提供了何时使用每个配方的决策指导
- [Commands](commands.md)：所有斜杠命令的详细说明
- [Getting Started](getting-started.md)：标准的首次变更流程指南
- [Concepts](concepts.md)：解释各个部分为何如此契合