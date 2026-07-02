# FAQ

针对人们最常问的问题提供的快速解答。如果你的问题是“某处有故障”，请参考 [Troubleshooting](troubleshooting.md)。如果你想了解某个术语的定义，请参阅 [Glossary](glossary.md)。

## 基础知识

### OpenSpec 是什么？用一句话概括。

它是一个轻量级的层级，能够在任何代码编写之前，让您和您的 AI 编码助手就“要做什么”达成书面共识。

### 我为什么要使用它？

因为 AI 助手即使出错也表现得很有把握。当需求仅存在于聊天线程中时，AI 会用猜测来填补空白，而你直到代码生成后才知道问题所在。OpenSpec 将这种共识提前，让错误变得容易修复。请参阅 [Core Concepts at a Glance](overview.md) 以了解完整的案例分析。

### 我必须对所有事情都使用它吗？

不。在需要达成一致意见的地方使用它，即大多数非琐碎的工作。对于一个字符的拼写错误修复，这个流程可能不值得，这也没关系。

### 我可以在一个大型现有代码库上使用它，还是只能用于新项目？

现有代码库才是重点。OpenSpec 是“棕地优先”（brownfield-first）：你不需要一次性地文档化你的整个应用。你只需为每个变更所涉及的部分编写规范，而这些规范会随着实际工作逐步完善。有一个专门的指南：[Using OpenSpec in an Existing Project](existing-projects.md)。

### 它是否与某一个 AI 工具绑定？

不。OpenSpec 支持 25+ 个助手，包括 Claude Code、Cursor、Windsurf、GitHub Copilot、Gemini CLI、Codex 等。完整的列表和每个工具的详细信息请参阅 [Supported Tools](supported-tools.md)。

## 命令操作

### 我在哪里输入 `/opsx:propose`？

在你的 AI 助手的聊天窗口中，而不是在终端中。这是最常见的困惑点之一，因此有专门的页面：[How Commands Work](how-commands-work.md)。简而言：`openspec ...` 在终端中运行，`/opsx:...` 在聊天中运行。

### 我如何“启动交互模式”？

没有一个单独的模式需要启动。你像往常一样打开你的 AI 助手，然后在它的聊天框中输入一个斜杠命令（slash command）。这个斜杠命令就是你“进入”OpenSpec 的方式。（真正具有交互性的终端功能是 `openspec view`，它是一个用于浏览规范和变更的仪表板。）完整解释请参阅 [How Commands Work](how-commands-work.md)。

### 我输入了斜杠命令但没有反应。为什么？

你很可能是在终端而不是在 AI 聊天中输入的，或者这些命令尚未安装。请在你的项目中运行 `openspec update`，重启你的助手，然后尝试在聊天中输入 `/opsx` 并留意自动补全功能。[Troubleshooting](troubleshooting.md#commands-dont-show-up) 有完整的检查清单。

### 为什么一个工具中的语法是 `/opsx:propose`，而另一个工具中的是 `/opsx-propose`？

每个 AI 工具都以略有不同的方式展示自定义命令。其意图是相同的；只是标点符号不同。在聊天中输入斜杠，自动补全功能就会显示出你的工具所期望的格式。关于每个工具的表格请参阅 [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool)。

### 技能（skill）和命令（command）有什么区别？

两者都是 OpenSpec 生成的文件，供你的助手运行工作流程。Skills (`.../skills/openspec-*/SKILL.md`) 是较新的跨工具标准；Commands (`.../commands/opsx-*`) 是较旧的特定工具斜杠文件。你不需要二选一。你只需输入斜杠命令，OpenSpec 就会安装你的工具所使用的那个。

## 工作流程

### 如果我不确定要做什么，我应该从哪里开始？

从 `/opsx:explore` 开始。它是一个零风险的思考伙伴，会阅读你的代码库，列出选项，并将一个模糊的问题转化为一个具体的计划，所有这些都在任何变更或代码存在之前完成。它位于默认配置中，因此始终可用。当计划清晰后，它会移交给 `/opsx:propose`。这是你唯一应该形成的好习惯，因为它能阻止一个急切的 AI 助手自信地构建错误的东西。请参阅 [Explore First](explore.md)。

### 最简单的流程是什么样的？

```text
/opsx:explore (可选)   然后   /opsx:propose <你需要什么>   然后   /opsx:apply   然后   /opsx:archive
```

先探索（explore）来思考，再提议（propose）来起草计划，应用（apply）来构建，归档（archive）来存档。如果你已经非常清楚自己想要什么，可以跳过探索步骤。

### `/opsx:propose` 和 `/opsx:new` 有什么区别？

`/opsx:propose` 是默认的一步式命令：它会一次性创建变更并起草所有规划产物（artifacts）。`/opsx:new` 是扩展命令集的一部分，它只搭建一个空的变更框架，让你使用 `/opsx:continue`（或一次性使用 `/opsx:ff`）来逐一创建产物。除非你想要分步控制，否则请使用 propose。请参阅 [Commands](commands.md)。

### 什么是 core 和 expanded 配置？

配置决定了哪些斜杠命令会被安装。**Core**（默认配置）提供了 `propose`、`explore`、`apply`、`sync`、`archive`。**Expanded** 集增加了 `new`、`continue`、`ff`、`verify`、`bulk-archive` 和 `onboard`，以提供更精细的控制。使用 `openspec config profile` 进行切换，然后用 `openspec update` 进行应用。

### 我需要运行 `/opsx:sync` 吗？

通常不需要。Sync 会将变更的 delta 规范合并到你的主规范中，而 `/opsx:archive` 会主动提供此功能。只有当你希望在归档之前先合并规范时（例如在一个长期进行的变更中），才手动运行 sync。请参阅 [Commands](commands.md#opsxsync)。

### 我开始工作后，如何编辑提案、规范或任务？

直接编辑文件即可。每个产物都是 `openspec/changes/<name>/` 中的纯 Markdown 文件，没有锁定阶段或特殊的编辑模式。你可以手动更改它，或者要求你的 AI 助手进行修订（“将设计更新为使用队列”），然后继续进行下一步工作。AI 始终基于当前的文件内容进行操作。完整指南：[Editing & Iterating on a Change](editing-changes.md)。

### 我是否可以在实现一部分后返回修改计划？

可以，随时都可以。这个工作流程是流动的，因此审查和编辑都不是你会被锁定的阶段。编辑产物，然后继续。如果你想要一个结构化的检查来确认代码仍然符合计划，请运行 `/opsx:verify`。请参阅 [Editing & Iterating on a Change](editing-changes.md#how-do-i-go-back-to-review-after-implementing)。

### 我手动编辑了代码。我该如何将其与规范协调一致？

在归档之前将它们同步起来，因为归档会将你的规范设为事实依据（record of truth）。如果代码现在是正确的，请更新 delta 规范以匹配你交付的内容；如果规范是正确的，则继续构建直到代码与之吻合。`/opsx:verify` 会显示出不一致之处。请参阅 [Editing & Iterating on a Change](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec)。

### 我应该在何时更新一个现有变更，而不是开始一个新的？

当它是经过完善的同一项工作时，就进行更新。当意图根本性改变或范围扩大到不同的工作时，则从头开始。关于何时更新与何时全新开始的决策流程图和示例请参阅 [Workflows](workflows.md#when-to-update-vs-start-fresh)。

### 如果我的会话耗尽上下文，或者需求在实现过程中发生变化怎么办？

这就是规范发挥作用的地方。因为计划存在于文件（而不仅仅是聊天历史记录）中，所以你可以清除上下文，启动一个新的 AI 会话，然后使用 `/opsx:apply` 恢复工作；它会读取产物并从第一个未完成的任务处继续。如果需求发生变化，请编辑产物以匹配新的现实情况，然后继续。保持干净的上下文窗口也能带来更好的结果；在实现前清除它。

### 我应该将 `openspec/` 文件夹提交到 git 仓库吗？

是的。你的规范、活动变更和归档都是你项目历史的一部分。像对待任何其他源代码一样进行提交。特别是归档，它成为了一个持久的记录，说明了你的系统为何以当前的方式运行。

## 规范与变更

### 规范（spec）和设计（design）有什么区别？

规范描述的是可观察到的行为：系统做了什么、它的输入、输出以及错误条件。设计描述的是你将如何构建它：技术方法、架构决策、文件更改。如果实现可以改变而不会改变外部可见的行为，那么它就属于设计，而不是规范。[Concepts](concepts.md#what-a-spec-is-and-is-not) 会更深入地探讨这一点。

### 什么是 delta spec？

一种只描述正在发生变化的规范，使用 `ADDED`、`MODIFIED` 和 `REMOVED` 部分，而不是重述整个规范。这是 OpenSpec 清晰处理现有系统编辑方式的方法。请参阅 [Concepts](concepts.md#delta-specs)。

### 归档的变更文件放在哪里？

放在 `openspec/changes/archive/YYYY-MM-DD-<name>/` 中，所有产物都被保留。没有任何东西被删除；该变更只是从你的活动列表中移出去了。

## 配置与定制

### 我如何告诉 AI 我的技术栈？

将其放入 `openspec/config.yaml` 的 `context:` 下面。这段文本会被注入到每一次规划请求中，因此 AI 始终了解你的技术栈和约定。请参阅 [Customization](customization.md#project-configuration)。

### 我能否生成非英语语言的规范？

可以。向配置文件的 `context:` 添加一个语言指令。[Multi-Language](multi-language.md) 提供了多种语言的复制粘贴片段。

### 我能否更改工作流程本身？

可以，通过自定义模式（schemas）。模式定义了哪些产物存在以及它们之间如何相互依赖。使用 `openspec schema fork spec-driven my-workflow` 对默认配置进行分叉（fork），然后对其进行编辑。请参阅 [Customization](customization.md#custom-schemas)。

## 模型、隐私和升级

### 我应该使用哪个 AI 模型？

OpenSpec 在与高推理能力的模型配合使用时效果最佳。README 推荐 Codex 5.5 和 Opus 4.7 等模型，适用于规划和实现。同时保持你的上下文窗口干净：在实现前清除它以获得最佳结果。

### OpenSpec 会收集数据吗？

它会收集匿名的使用统计数据：仅包括命令名称和版本。不包含参数、路径、内容或个人数据，并且在 CI 中会自动关闭。你可以通过 `export OPENSPEC_TELEMETRY=0` 或 `export DO_NOT_TRACK=1` 来选择退出。

### 我如何升级？

两个步骤。首先升级包（`npm install -g @fission-ai/openspec@latest`），然后运行每个项目内部的 `openspec update` 以刷新生成的技能和命令。

### 我如何卸载 OpenSpec？

没有卸载命令，因为它只是一个全局包加上你项目中的文件。移除该包（`npm uninstall -g @fission-ai/openspec`），并可选地删除 `openspec/` 目录和生成的工具文件。逐步指南，包括哪些内容可以安全保留，请参阅 [Installation: Uninstalling](installation.md#uninstalling)。

## 获取帮助

### 我在哪里提问或报告 Bug？

*   **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
*   **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
*   **从你的终端：** `openspec feedback "your message"` 会为你打开一个 GitHub issue。

### 这些文档有错误或令人困惑。我该怎么办？

告诉我们，或者修复它。欢迎并重视文档 PR（Pull Request）。请开一个 Issue 或发送一个 Pull Request。