# 在现有项目中使用 OpenSpec

**您不需要一开始就对整个代码库进行文档编写。您只需要为即将更改的部分编写规范。** 这是采用 OpenSpec 到现有项目时最重要的一点，也是 OpenSpec 之所以被设计成“棕地优先”（brownfield-first）的原因。

一个常见的担忧是这样的：“我的应用有 80,000 行代码了。我是否必须在 OpenSpec 有用之前就为所有内容编写规范？”答案不是。您会讨厌这种做法，我们也会。OpenSpec 是一次一次的更改来扩展您的规范。您的第一次更改会记录它所涉及的部分；下一次更改则记录其部分，随着时间的推移，您的规范将自然地围绕您实际进行的工作而完善起来。

本指南将展示如何在不“大水漫灌”的情况下从第一天开始使用。

## 三十秒版本

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

然后，在您的 AI 聊天中：

```text
/opsx:explore            # optional: have the AI read the area you'll touch
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

现在，您的规范精确地描述了该更改所涉及的系统部分，仅此而已。这很正确。您不必再担心其他 80,000 行代码了。

## 为什么“增量优先”（delta-first）是关键技巧

OpenSpec 的更改是以**增量（deltas）**的形式编写的：`ADDED`、`MODIFIED`、`REMOVED`。一个增量描述的是相对于当前行为的变化，而不是整个系统。

这正是棕地项目所需要的。您很少是从零开始构建的。您是在添加一个字段、修复一个重定向、收紧一个超时时间。增量允许您精确地指定这一项更改，而无需先撰写一份关于其周围所有内容的 40 页规范。

因此，您的 `openspec/specs/` 目录不会一开始就是完整且齐全的。它几乎是空的，然后逐渐积累起来。每个存档的更改都会合并其增量。只有在您进行了几次与 `auth/` 相关的更改后，`auth/` 的规范才会变得详尽无遗，而这正是您希望它如此完善的时候。

如果需要更深入的机制了解，请参阅 [Concepts: Delta Specs](concepts.md#delta-specs)。

## 在真实代码库上的第一次更改

选择一件小而实际的事情。不是一个玩具项目，也不是一次重写。是您本周本来就要做的一项更改。先从小的更改开始，这能让您以低风险的方式掌握工作流程。

**步骤 1：让 AI 阅读相关区域。** 这就是 `/opsx:explore` 在面对不熟悉或庞大的代码库时发挥作用的地方。将其指向您即将触及的部分，让它在提出任何建议之前先映射出事物的工作方式。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I need to add rate limiting to our public API, but I'm not sure
     how requests currently flow through the middleware.

AI:  Let me trace it... [reads the router, middleware stack, and config]
     Requests hit Express, pass through auth middleware, then your
     controllers. There's no rate-limiting layer today. The cleanest
     insertion point is a middleware right after auth. Want me to scope it?
```

请注意，AI 现在理解了您的实际结构，因此它撰写的提案将适合您的代码，而不是一个通用的模板。对于大型代码库来说，这个习惯能省去最大的麻烦。请参阅 [Explore First](explore.md)。

**步骤 2：提出更改。** 该提案及其增量规范只捕获这一项更改。

```text
You: /opsx:propose add-api-rate-limiting
```

**步骤 3：使用 `/opsx:apply` 和 `/opsx:archive` 进行构建和存档，与任何其他更改一样。** 存档后，您就拥有了一份关于您的限速行为的真实规范，它源于一项您本来就需要做的更改。

## 更喜欢指导式流程？请使用 onboard

如果您宁愿在自己的代码上观看整个循环过程并进行叙述，那么扩展命令 `/opsx:onboard` 就会做这件事：它会扫描您的代码库，寻找一个小的、安全的改进点，然后引导您完成提案、构建和存档的每一步，解释每个步骤。

首先开启扩展命令：

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

然后在聊天中：

```text
/opsx:onboard
```

这是对真实项目最温和的介绍，它会给您一个可以保留或丢弃的真正（小的）更改。请参阅 [Commands: `/opsx:onboard`](commands.md#opsxonboard)。

## “但我已经有需求文档了”

也许您有 PRD、SRS、正式规范，甚至 TLA+ 模型。这很好。您不需要全部导入它们，也不需要扔掉它们。

将现有文档视为**探索的源材料**，而不是需要转换的规范。当您开始一项更改时，请粘贴或指向 AI 相关的部分，让它从中塑造一个集中的 OpenSpec 增量。该增量捕获了您当前正在更改的行为，以 OpenSpec 可测试的需求和场景形式存在。您的原始文档保持原位作为背景参考。

诚实的理由是：OpenSpec 的规范是有意为行为优先且限定范围的。一份 40 页的 PRD 是一个不同用途的产物。强制进行一次性的大规模转换往往会产生一份庞大、过时的规范，没人会信任它。让规范从真实更改中生长出来，才能保持其准确性。

```text
You: /opsx:explore
You: Here's the section of our PRD about checkout. I'm implementing the
     "guest checkout" requirement next.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## 在大型代码库中组织规范

规范存储在 `openspec/specs/` 下，按**领域（domain）**分组：一个与您的团队思考系统方式相匹配的逻辑区域。您不必预先设计好整个分类法。当您在该领域的第一次更改需要时，就创建一个领域文件夹。

划分领域的常见方法包括：

- **按功能区域：** `auth/`、`payments/`、`search/`
- **按组件：** `api/`、`frontend/`、`workers/`
- **按边界上下文（bounded context）：** `ordering/`、`fulfillment/`、`inventory/`

选择能让新手点头同意的任何一种方式。以后再进行完善。请参阅 [Concepts: Specs](concepts.md#specs)。

## Monorepos 和跨仓库的工作

对于 monorepo，最简单的模型是在仓库根目录设置一个 `openspec/` 目录，其中包含映射到您的包或服务的领域。这足以覆盖大多数团队。

如果您的工作确实跨越**多个仓库**（或您视为独立的不同软件包），OpenSpec 有一个 beta **stores** 功能：规划内容存在于它自己的独立仓库中，而您的任何代码仓库都可以引用它，这样计划就不必存在于某一个仓库的 `openspec/` 文件夹内。它仍处于 beta 阶段，请将它的命令和状态视为不断演进的。请从 [Stores User Guide](stores-beta/user-guide.md) 开始了解其心智模型和最小的有用的路径。

## 几点诚实的提醒

- **抵制“回填所有内容”的冲动。** 为您没有更改的代码编写规范，感觉很有效率，但通常不是。那些规范会变得过时，因为没有任何东西能迫使它们追踪现实。让真实的更改来驱动您的规范。
- **保持早期更改的小巧。** 您最初的几次更改与交付成果一样重要，它们是学习节奏的过程。一个紧凑的范围可以使循环快速进行，经验教训成本低廉。
- **将 `openspec/` 提交到 git。** 您的规范和存档属于描述它们的代码，应随之版本控制。
- **为 AI 提供上下文。** 在拥有严格约定的大型代码库中，请填写 `openspec/config.yaml` 中的 `context:`，以确保每个提案都尊重您的技术栈和模式。请参阅 [Customization](customization.md#project-configuration)。

## 下一步去哪里

- [Explore First](explore.md) - 在更改代码之前理解代码的关键习惯
- [Getting Started](getting-started.md) - 完整的首次更改流程指南
- [Editing & Iterating on a Change](editing-changes.md) - 在学习过程中调整更改
- [Concepts: Delta Specs](concepts.md#delta-specs) - 为什么增量使棕地工作变得干净利落
- [Customization](customization.md) - 教会 OpenSpec 您的项目约定