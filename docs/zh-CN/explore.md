# 探索

**`/opsx:explore` 是您的思考伙伴。当您遇到问题但尚未形成计划时，随时使用它。它会调查您的代码库，与您一起权衡各种方案，并在创建任何工件或一行代码之前，澄清您真正想要什么。当画面清晰后，它会将工作移交给 `/opsx:propose`。**

如果从这些文档中采纳一个习惯，那就采纳这个：**不确定时，先探索再提议。**

这很重要。AI 编码助手非常积极主动。如果您含糊地提问，它们会自信地构建出 *一些东西*，但这可能不是您真正需要的。而“探索”就是解药。这是一个零风险的对话过程，您和 AI 一起找出正确的方向，这样当您提出方案时，您提出的就一定是正确的事项。

## 何时进行探索

“探索”比人们预期的要更常是正确的首步。在以下任一情况成立时，请使用它：

- 您知道*问题*但不知道*解决方案*。（例如：“页面感觉很慢。” “认证机制是一团糟。” “我们不断收到重复订单。”）
- 您正在权衡不同的方法，并希望针对您实际的代码进行利弊分析。
- 您是代码库的新手，需要在修改它之前了解其工作原理。
- 需求模糊不清，而您想在承诺之前将其细化。
- 您怀疑这项工作比看起来要大或小，想诚实地界定范围。

只有当您确切知道自己想要什么以及如何实现时，才跳过探索。在这种情况下，请直接转到 [`/opsx:propose`](commands.md#opsxpropose)。

## 它能做什么（和不能做什么）

“探索”是一个**对话**，而不是一个生成器。

**它能做的是：**
- 阅读和搜索您的代码库，以回答实际问题。
- 比较选项并说明每个选项的利弊。
- 绘制图表，使设计清晰易懂。
- 帮助您将模糊的想法缩小为一个具体、可构建的范围。
- 当您准备好时，过渡到 `/opsx:propose`。

**它不能做的是：**
- 创建一个变更文件夹。
- 撰写任何工件（包括提案、规范、设计或任务）。
- 编写或修改代码。

这就是重点。“探索”对您没有任何成本，也不会让您做出任何承诺。您可以探索三个死胡同，从每个中学习一些东西，然后才提出那个幸存下来的路径。

## 它已经安装好了

好消息是：`/opsx:explore` 包含在默认的 **core** 配置中，与 `propose`、`apply`、`sync` 和 `archive` 一样。您无需启用任何功能。如果 OpenSpec 已在您的项目中设置好，那么它就已准备好在您的 AI 聊天中使用。（与所有 `/opsx:*` 命令一样，您是在助手的聊天中输入它，而不是在终端中。请参阅 [How Commands Work](how-commands-work.md)。）

## 一个完整的示例

观看一个模糊的担忧如何变成一个清晰、可构建的变更。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

注意发生了什么。起步点是“有些地方不对劲，我害怕动它”。二十秒的探索将这件事情变成了一个命名的根本原因、三个排序后的选项、一个与现有代码相关的建议和一个精确的变更。随之而来的提案之所以清晰，是因为思考工作已经先行完成。

## 移交给 Propose

Explore 不会存档到任何东西中。当您准备好时，只需开始一个变更，AI 就会将对话中的上下文带入工件中。

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

您可以用通俗的语言说（“让我们把这个变成一个变更”）或直接运行 `/opsx:propose <name>`。无论哪种方式，您刚刚进行的探索都将成为提案的基础，而不是一次随意的聊天。

如果您使用扩展命令集，explore 也可以移交给 `/opsx:new`，用于逐步创建工件。请参阅 [Workflows](workflows.md)。

## 高效探索的技巧

- **带上问题，而不是解决方案。** “登录感觉很慢”给了 AI 调查的空间。“添加 Redis 缓存”则预先承诺了一个您尚未测试过的答案。
- **大声询问利弊。** “每个选项的缺点是什么？”能让您得到一个更诚实的比较。
- **先让它阅读。** 最好的探索始于 AI 真正查看您的代码，而不是猜测。如果有助于的话，请指明相关区域。
- **放弃也无妨碍。** 如果探索显示这个想法不值得投入，那也是一种胜利。您以低成本学到了东西。
- **在变更过程中再次探索。** 在 `/opsx:apply` 阶段卡住了？您可以退一步，探索一个子问题，然后再回来继续。

## 诚实的权衡

**您获得了什么：** explore 在任何工件存在之前，就以最低成本捕获了错误的转向。这在不熟悉的代码中尤其强大，因为 AI 阅读和总结系统的能力为您节省了一整个下午的“考古”工作。

**它需要付出什么：** 一点耐心。“探索”是一个对话过程，因此它比直接运行 `/opsx:propose` 并抱有希望要慢一些。对于您已经真正理解的工作，这个额外的步骤就是纯粹的开销，您应该跳过它。

经验法则：任务越模糊，explore 带来的回报就越大。任务越清晰，您就可以越快地跳到提案阶段。

## 下一步去哪里

- [Commands: `/opsx:explore`](commands.md#opsxexplore)：精确的参考指南
- [Workflows](workflows.md)：作为日常循环的一部分进行探索
- [Examples & Recipes](examples.md#recipe-3-exploring-before-you-commit)：在完整的操作流程中进行探索
- [Getting Started](getting-started.md)：初次变更指南，包含探索