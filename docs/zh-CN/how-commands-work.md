# 命令的工作原理

**唯一需要知道的一点是：OpenSpec 有两种类型的命令，它们在不同的地方运行。**

- `openspec ...` 命令在你的 **终端（terminal）** 中运行。（示例：`openspec init`。）
- `/opsx:...` 命令在你的 **AI 助手聊天界面** 中运行。（示例：`/opsx:propose`。）

如果你不小心将 `/opsx:propose` 输入到终端中，而没有任何反应，那么这个页面就是为你准备的。你正在与 OpenSpec 的错误部分进行对话。斜杠命令（Slash commands）不是终端命令。它们是你给 AI 编码助手下达的指令，是在你通常输入“添加一个登录表单”的同一个聊天框中使用的。

这一个区别是新用户最容易卡住的地方，所以让我们把它说得清清楚楚。

## 两部分

OpenSpec 是一个同时扮演着两种角色的项目。

**CLI（命令行界面/终端部分）。** 一个名为 `openspec` 的程序，你需要将其安装并在 Shell 中运行。它负责设置你的项目、列出和验证更改、显示仪表板并归档已完成的工作。你将这些命令输入到 iTerm、VS Code 终端、PowerShell 等任何地方都可以运行 `git` 或 `npm` 的地方。

```bash
openspec init        # 在此项目中设置 OpenSpec
openspec list        # 查看活动更改
openspec view        # 打开交互式仪表板
```

**斜杠命令（聊天部分）。** 像 `/opsx:propose` 和 `/opsx:apply` 这样的简短命令，你将它们输入到 AI 助手中。这些命令告诉 AI 遵循 OpenSpec 工作流程：起草提案、编写规范、根据任务列表构建、完成后归档。你将这些命令输入到 Claude Code、Cursor、Windsurf、Copilot 或你使用的任何助手中。

```text
/opsx:propose add-dark-mode    (在 AI 聊天中输入)
/opsx:apply                    (在 AI 聊天中输入)
/opsx:archive                  (在 AI 聊天中输入)
```

这是用一张图展示的思维模型：

```text
        你的终端 (YOUR TERMINAL)                         你的 AI 助手聊天界面 (YOUR AI ASSISTANT'S CHAT)
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   安装    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   命令    │  /opsx:archive                │
   └──────────────────────┘    & 技能 (skills)   └──────────────────────────────┘
        在这里运行 openspec       在这里运行 /opsx:*
```

注意那个箭头。在终端中运行 `openspec init` 会将斜杠命令*安装*到你的 AI 工具中。终端部分负责设置聊天部分。完成这一步后，日常操作主要是在聊天界面进行。

## “我如何开始交互模式？”

**没有需要启动的独立交互模式。** 这个问题经常出现，所以值得一个明确的答案。

你不需要进入特殊的 OpenSpec 模式。你只需要像往常一样打开你的 AI 编码助手，然后在聊天中输入一个斜杠命令。这个斜杠命令*就是*你“进入”OpenSpec 的方式。你的助手会识别它，加载匹配的 OpenSpec 技能（skill），并开始遵循工作流程。

真正的操作步骤是：

1. 在你的项目中使用 AI 编码助手（Claude Code、Cursor、Windsurf 等）。
2. 在聊天中输入 `/opsx:propose`，就像你输入任何其他请求一样。
3. 观察自动补全（autocomplete）：如果 OpenSpec 已安装，当你输入斜杠时，你会看到 `/opsx:propose`、`/opsx:apply` 等命令出现。

就是这样。不需要切换模式，不需要启动守护进程（daemon），也不需要单独的窗口。

唯一真正具有交互性的东西存在于终端中：`openspec view`。它会打开一个用于浏览你的规范和更改的仪表板。但这只是一个查看器，而不是你用来提案和构建的工具。构建工作是通过聊天中的斜杠命令完成的。

## 为什么会有这种划分

了解这一点是值得的，因为它解释了 OpenSpec 如何与 25+ 种不同的 AI 工具协同工作。

CLI 是**引擎（engine）**。它知道规则：一个更改文件夹应该是什么样子、哪些工件依赖于哪些内容、如何将 delta spec 合并到你的真相来源中。这在所有地方都是一致的。

斜杠命令是**方向盘（steering wheel）**，而每种 AI 工具都有自己略有不同的方向盘。Claude Code 将它们称为命令。Cursor 和 Windsurf 有自己的格式。有些工具称之为技能（skills）。当你运行 `openspec init` 时，OpenSpec 会为你选择的每种工具生成正确的类型文件，因此无论你偏爱哪种助手，相同的 `/opsx:propose` 意图都能正常工作。

这种设计的优势在于：你只需要学习一次工作流程，就可以在所有工具上沿用它。需要注意的权衡点是：命令的确切语法可能因工具而略有不同，这将在下一节介绍。

## 不同工具的斜杠命令语法

意图（intent）在所有地方都是相同的。标点符号有所不同。请使用与你的助手相匹配的形式。

| 工具 | 输入方式 |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | 技能式，例如 `/skill:openspec-propose` |
| Trae | 技能式，例如 `/openspec-propose` |

大多数工具使用冒号形式（`/opsx:propose`）或破折号形式（`/opsx-propose`）。少数工具将 OpenSpec 显示为命名技能而不是斜杠命令；对于这些工具，你需要通过名称来调用该技能。完整的每种工具列表，包括哪些文件会被写入何处，请参阅 [Supported Tools](supported-tools.md)。

如有疑问，请在 AI 聊天中输入一个斜杠符号，然后查看自动补全。你的工具会显示出它所期望的形式。

## 命令是如何产生的：技能和命令

当你运行 `openspec init`（或 `openspec update`）时，OpenSpec 会在你项目中写入小文件，以便你的 AI 工具能够找到这个工作流程。根据你使用的工具和设置，这些文件是**技能（skills）**、**命令（commands）**，或者是两者都有。

- **技能（Skills）** 存在于 `.claude/skills/openspec-*/SKILL.md` 等位置。它们是一种新兴的跨工具标准：一个由你的助手自动检测到的指令文件夹。
- **命令（Commands）** 存在于 `.claude/commands/opsx/<id>.md` 等位置。它们是较早期的、针对特定工具的斜杠命令文件。

你不需要关心你的工具使用的是哪一种。你只需要输入斜杠命令，它就能工作。但了解这些文件存在有助于排查问题：如果你的命令消失了，通常意味着这些文件丢失或已过时，而 `openspec update` 就会重新生成它们。

请参阅 [Supported Tools](supported-tools.md) 获取每种工具的确切路径，以及 [Migration Guide](migration-guide.md) 以了解技能是如何取代旧的仅命令方法。

## 确认是否已安装

快速检查，先从最快的开始：

1. **在你的 AI 聊天中输入一个斜杠符号。** 开始输入 `/opsx` 并留意自动补全建议。如果它们出现了，你就设置好了。
2. **查找文件。** 对于 Claude Code，请检查 `.claude/skills/` 中是否包含 `openspec-*` 文件夹。其他工具使用自己的目录（[Supported Tools](supported-tools.md) 会列出这些目录）。
3. **重新运行设置。** 从你的项目根目录运行 `openspec update`。这将为所有你配置的工具重新生成技能和命令文件。
4. **重启你的助手。** 许多工具会在启动时扫描技能和命令，所以刷新一个窗口可能是缺失的一步。

## 我到底有哪些命令？

默认情况下，OpenSpec 会安装一套**核心（core）**斜杠命令：

- `/opsx:explore`: 在投入更改之前与 AI 一起思考一个想法（当你不确定如何做时，这是一个很好的第一步）。
- `/opsx:propose`: 创建一个更改并在一步中草拟所有相关的规划工件。
- `/opsx:apply`: 通过完成任务列表来构建这个更改。
- `/opsx:sync`: 将更改的规范更新合并到你的主规范中（通常是自动的）。
- `/opsx:archive`: 完成一个更改并将其归档。

一个良好的默认节奏是：当你正在弄清楚该做什么时，先 `explore`；然后执行 `propose`、`apply` 和 `archive`。[Explore First](explore.md) 指南解释了为什么这个开头的步骤会带来回报。

还有一套**扩展（expanded）**命令供那些需要更精细控制的用户使用（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:bulk-archive`、`/opsx:onboard`）。你通过 `openspec config profile` 开启它，然后用 `openspec update` 应用它。

对这一切感到陌生？`/opsx:onboard`（在扩展命令集中）会带你完成一次在你自己的代码库上的完整更改流程，并叙述每个步骤。这是最友好的入门方式。

有关每个命令的详细功能，请参阅 [Commands](commands.md)。关于何时使用哪个命令，请参阅 [Workflows](workflows.md)。

## 完整的首次运行流程

将所有内容整合起来，以下是包含每一步发生位置的完整序列。

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (将斜杠命令安装到你的 AI 工具中)

AI CHAT      /opsx:explore
              (可选：先与 AI 一起思考想法)

AI CHAT      /opsx:propose add-dark-mode
              (AI 草拟提案、规范、设计和任务)

AI CHAT      /opsx:apply
              (AI 进行构建，并勾选任务)

AI CHAT      /opsx:archive
              (更改被合并到你的规范中并存档)
```

两个终端步骤用于设置。然后你就进入聊天界面进行操作。这就是节奏。

## 相关资源

- [Getting Started](getting-started.md): 完整的首次更改操作指南
- [Commands](commands.md): 所有斜杠命令的详细信息
- [CLI](cli.md): 所有终端命令的详细信息
- [Supported Tools](supported-tools.md): 每种工具的语法和文件位置
- [FAQ](faq.md): 更多快速问答
- [Troubleshooting](troubleshooting.md): 命令不显示时的修复方法