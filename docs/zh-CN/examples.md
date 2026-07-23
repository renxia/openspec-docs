# 示例与食谱

从零到一的真实变更。每个食谱都会展示你需要输入的命令以及对应的返回结果，你可以对照自己的场景匹配对应模式并直接套用。本文使用默认的**核心**命令（`propose`、`explore`、`apply`、`sync`、`archive`）；如果扩展命令集更适用，会特别注明。

开始前提醒：`/opsx:propose` 这类斜杠命令需要输入到**AI 助手的聊天窗口**中，`openspec` 命令则需要在**终端**中执行。如果你还不清楚这一点，请先阅读[命令工作原理](how-commands-work.md)。下文的操作记录中，`You:` 和 `AI:` 代表聊天内容，以 `$` 开头的行代表终端命令。

> **还不确定要构建什么？** 如果你先用 `/opsx:explore` 梳理思路，大部分食谱的效果会更好。[食谱 3](#recipe-3-exploring-before-you-commit) 展示了实际用法，[先探索](explore.md) 指南会完整说明这样做的理由。

## 食谱 1：小型功能，快速路径

**适用场景：** 你明确知道自己要做什么，且工作范围可控。这是最常用的食谱。

整个流程只需要三条命令：提案、构建、归档。

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

现在阅读方案。打开提案和增量规范。这正是 OpenSpec 设计的核心场景：在错误假设还只是一段话、而不是 400 行代码的时候就发现它。如果发现有问题，直接编辑任意产物，然后继续即可。

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

完成。登出行为现在已经纳入你的规范体系，本次变更也连同完整上下文一起归档保存。

## 食谱 2：缺陷修复

**适用场景：** 出现功能异常，你希望将修复过程记录为对行为的明确变更，而不是一个含义不明的提交。

缺陷修复的流程和功能开发完全一致，区别在于提案的表述方式：需要描述*正确的行为*，而不是只写“修复缺陷”。

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

由于修复会以 `MODIFIED`（已修改）状态的需求和新的场景落地，后续人员（或下一次 AI 会话）不仅能看到你做了修复，还能明确“正确行为”的定义。之后照常执行 `/opsx:apply` 和 `/opsx:archive` 即可。

提示：针对缺陷修复，好的场景描述就是纯文本形式的回归测试用例。例如：“假设用户未登录，当用户提交有效凭证时，那么用户会跳转到控制台且不会被再次重定向。” 写出这样的描述，实施过程就有了明确的目标。

## 食谱 3：提交前先探索

**适用场景：** 你遇到了问题但还没有明确的方案，不确定要构建什么，或者不确定哪种方案更合适。

先从 `/opsx:explore` 开始。它是不设固定结构、也不会生成任何产物的思考伙伴，会读取你的代码库并帮你做决策。

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

探索能让你在投入变更资源*之前*理清思路。当思路明确后，发起提案即可，AI 会延续之前的上下文继续工作。

## 食谱 4：同时处理多个变更

**适用场景：** 你正在开发某个功能，但突然有紧急缺陷需要优先处理。

每个变更都是独立的文件夹，因此并行工作不会产生冲突。先处理紧急缺陷，发布后再回到之前中断的功能开发，继续从上次停下的位置推进。

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

当有多个活跃变更时，在 `/opsx:apply` 后加上变更名称（比如 `add-dark-mode`），就可以指定 AI 处理对应的变更。由于任务完成状态会记录在 `tasks.md` 中，AI 能精准定位到你上次中断的位置。

如果有多项变更需要同时归档，扩展命令 `/opsx:bulk-archive` 可以批量归档所有变更，并通过核对实际实现内容解决规范冲突。详见[工作流](workflows.md#parallel-changes)。

## 食谱 5：无行为变更的代码重构

**适用场景：** 你正在调整代码结构，且对外可见的行为需要保持完全一致。

这是比较特殊的情况：纯重构不需要对规范做任何修改。行为契约没有变化，只有实现逻辑变了。因此相关工作只需要记录在方案设计和任务清单中，规范增量为空或不存在。

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

你需要在变更的 `.openspec.yaml` 文件中显式声明空增量，设置 `skip_specs: true` 即可：

```yaml
schema: spec-driven
skip_specs: true
```

如果没有这个标记，`openspec validate` 会拒绝零增量的变更（从而避免遗漏规范阶段的问题）；加上标记后，验证会通过，`openspec status` 也会将规范阶段显示为“已显式跳过”而非“待处理”。如果重构最终确实改变了行为，只需要从 `.openspec.yaml` 中删除 `skip_specs` 标记，再编写增量规范即可——验证逻辑会将“标记+规范文件”识别为冲突，因此过时的标记不会悄悄残留。

归档带标记的变更不需要额外参数（因为没有需要合并的增量）。另外，`--skip-specs` 参数可以显式让终端命令跳过规范步骤：

```bash
$ openspec archive refactor-payment-module --skip-specs
```

这个参数在工具集成、CI 流水线以及仅修改文档的变更中非常实用。核心原则是：规范描述行为，因此如果行为没有变化，规范也不应该修改。详见[概念](concepts.md#what-a-spec-is-and-is-not)。

## 食谱 6：分步控制（扩展命令）

**适用场景：** 变更复杂度高或风险较大，你希望在推进前逐一审查每个产物。

核心命令 `/opsx:propose` 会一次性生成所有产物。如果你希望分步推进，可以启用扩展命令：

```bash
$ openspec config profile      # 选择扩展工作流
$ openspec update              # 将扩展配置应用到当前项目
```

之后你就可以分步搭建和生成产物了：

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

每个产物生成后都可以立即审查，自由编辑，满意后再继续。如果你希望一次性生成剩余的所有规划产物，可以使用 `/opsx:ff` 快速跳过剩余的规划步骤。归档前，`/opsx:verify` 会检查实现内容是否和规范一致。详见[工作流](workflows.md#opsxff-vs-opsxcontinue)。

## 食谱 7：动手实践完整流程

**适用场景：** 你已经安装了 OpenSpec，希望在自己的实际代码库中*亲身体验*工作流，而不是用玩具示例学习。

先启用扩展命令（详见食谱 6），然后：

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` 会找到一个真实的小型改进项，为其创建变更、实施并归档，全程会讲解每一步操作。整个过程耗时 15 到 30 分钟，最后你会得到一个真实的变更，可以选择保留或丢弃。这是最友好的入门学习方式。详见[命令](commands.md#opsxonboard)。

## 从终端检查工作状态

任何时候，你都可以在终端中检查当前状态：

```bash
$ openspec list                      # 查看活跃变更
$ openspec show add-dark-mode        # 查看单个变更的详细信息
$ openspec validate add-dark-mode    # 检查变更结构是否合规
$ openspec view                      # 打开交互式仪表盘
```

这些是只读检查工具，提案和构建操作仍然需要通过聊天窗口中的斜杠命令完成。完整说明详见[CLI 参考](cli.md)。

## 下一步阅读

- [先探索](explore.md)：不确定方向时的推荐启动方式
- [工作流](workflows.md)：上述模式的汇总，附带各模式的使用场景决策指引
- [命令](commands.md)：所有斜杠命令的详细说明
- [快速入门](getting-started.md)：官方推荐的首个变更实操指南
- [核心概念](concepts.md)：各组件设计逻辑的底层说明