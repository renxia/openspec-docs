# 命令如何工作

**只需记住一件事：OpenSpec 有两类命令，它们分别在两个不同的位置运行。**

- `openspec ...` 命令在你的**终端**中运行。（示例：`openspec init`。）
- `/opsx:...` 命令在你的**AI 助手聊天窗口**中运行。（示例：`/opsx:propose`。）

如果你曾经在终端中输入 `/opsx:propose` 却没有任何反应，原因就在本页。你正在和 OpenSpec 的“另一半”对话。斜杠命令不是终端命令，而是你向 AI 编程助手发出的指令，和你平时输入“添加登录表单”的聊天框是同一个地方。

这一区别是新用户最常遇到的障碍，所以我们把它讲得明明白白。

## 两个组成部分

OpenSpec 是一个项目，却有两副“面孔”。

**CLI（终端部分）。** 名为 `openspec` 的程序，你需要安装它并通过 shell 运行。它可以初始化你的项目、列出和校验变更、展示仪表盘、归档已完成的工作。你可以在 iTerm、VS Code 终端、PowerShell 等任何能运行 `git` 或 `npm` 的地方输入这些命令。

```bash
openspec init        # 在当前项目中初始化 OpenSpec
openspec list        # 查看进行中的变更
openspec view        # 打开交互式仪表盘
```

**斜杠命令（聊天部分）。** 像 `/opsx:propose`、`/opsx:apply` 这样的短命令，需要输入到你的 AI 助手中。这些命令会指示 AI 遵循 OpenSpec 工作流：起草提案、编写规格说明、根据任务列表构建、完成后归档。你可以在 Claude Code、Cursor、Windsurf、Copilot 或你使用的任何其他助手中输入这些命令。

```text
/opsx:propose add-dark-mode    （在你的 AI 聊天框中输入）
/opsx:apply                    （在你的 AI 聊天框中输入）
/opsx:archive                  （在你的 AI 聊天框中输入）
```

用一张图就能讲清这个逻辑：

```text
        你的终端                              你的 AI 助手聊天窗口
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   安装        │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   命令与技能   │  /opsx:archive                │
   └──────────────────────┘               └──────────────────────────────┘
        在此运行 openspec                      在此运行 /opsx:* 命令
```

注意图中的箭头。在终端中运行 `openspec init` 会将斜杠命令*安装*到你的 AI 工具中。终端部分是聊天部分的设置入口，完成安装后，日常操作基本都在聊天窗口中完成。

## “如何启动交互模式？”

**没有独立的交互模式需要启动。** 这个问题经常被问到，所以我们需要给出一个明确的答复。

你不需要进入特殊的 OpenSpec 模式，只要像往常一样打开你的 AI 编程助手，在聊天框中输入斜杠命令即可。斜杠命令*就是*你“进入”OpenSpec 的方式。你的助手会识别该命令，加载对应的 OpenSpec 技能，然后开始遵循工作流执行。

所以正确的操作步骤是：

1. 在你的项目中打开 AI 编程助手（Claude Code、Cursor、Windsurf 等）。
2. 在其聊天框中输入 `/opsx:propose`，和你输入其他请求的位置一样。
3. 留意自动补全：如果 OpenSpec 已安装，输入斜杠时你会看到 `/opsx:propose`、`/opsx:apply` 等相关命令自动弹出。

就这么简单。不需要切换模式，不需要启动守护进程，也不需要打开单独的窗口。

终端里确实有一个交互式功能：`openspec view`。它会打开一个仪表盘，供你浏览规格说明和变更。但这只是一个查看器，不是用来提案和构建的工具。构建工作是通过聊天框中的斜杠命令完成的。

## 为什么会有这种划分

了解这个设计的原因很有必要，因为它解释了为什么 OpenSpec 可以兼容 25 种以上的不同 AI 工具。

CLI 是**引擎**。它掌握所有规则：变更文件夹的结构、各产物之间的依赖关系、如何将增量规格说明合并到你的唯一可信源中。它在所有环境下都保持一致。

斜杠命令是**方向盘**，而每个 AI 工具的“方向盘”略有不同。Claude Code 称其为命令，Cursor 和 Windsurf 有自己的格式，还有一些工具称其为技能。当你运行 `openspec init` 时，OpenSpec 会为你选择的每个工具生成对应格式的文件，因此无论你使用哪个助手，`/opsx:propose` 的意图都能生效。

这种设计的优势是：你只需要学习一次工作流，就可以在所有工具中使用。代价是：不同工具之间的命令精确语法可能略有差异，下一节会详细介绍这一点。

## 各工具斜杠命令语法

所有工具的命令意图完全一致，仅标点符号不同。请使用和你所用助手匹配的格式。

| 工具 | 输入格式 |
|------|----------|
| Claude Code | `/opsx:propose`、`/opsx:apply` |
| Cursor | `/opsx-propose`、`/opsx-apply` |
| Windsurf | `/opsx-propose`、`/opsx-apply` |
| GitHub Copilot（IDE 版） | `/opsx-propose`、`/opsx-apply` |
| CodeArts | 技能风格，例如 `/openspec-propose` |
| Codex | 通过 `.codex/skills/openspec-*` 调用技能风格 |
| Oh My Pi | `/opsx-propose`、`/opsx:apply` |
| Kimi CLI | 技能风格，例如 `/skill:openspec-propose` |
| Trae | `/opsx-propose`、`/opsx-apply` |

大多数工具要么使用冒号格式（`/opsx:propose`），要么使用连字符格式（`/opsx-propose`）。少数工具将 OpenSpec 以命名技能的形式呈现，而非斜杠命令；对于这类工具，你需要通过技能名称来调用。完整的各工具列表，包括文件写入的确切路径，请参阅[支持的工具](supported-tools.md)。

如果不确定，就在 AI 聊天框中输入一个斜杠，查看自动补全提示。你的工具会显示它支持的格式。

## 命令的来源：技能与命令

当你运行 `openspec init`（或 `openspec update`）时，OpenSpec 会在你的项目中写入小型文件，让你的 AI 工具可以找到工作流。根据你使用的工具和设置，这些文件可能是**技能**、**命令**，或两者都有。

- **技能** 通常存放在 `.claude/skills/openspec-*/SKILL.md` 这类路径下。它是新兴的跨工具标准：一个包含指令的文件夹，你的助手可以自动检测到它。
- **命令** 通常存放在 `.claude/commands/opsx/<id>.md` 这类路径下。它是较早期的、针对单个工具的斜杠命令文件。Codex 不会生成命令文件，请使用 `.codex/skills/openspec-*` 路径下的技能文件。

你不需要关心你的工具用的是哪一种，只要输入斜杠命令即可生效。但了解这些文件的存在有助于排查问题：如果你的命令消失了，通常意味着这些文件丢失或过时，运行 `openspec update` 就可以重新生成它们。

各工具的具体文件路径请参阅[支持的工具](supported-tools.md)，技能如何替代旧版纯命令方案的说明请参阅[迁移指南](migration-guide.md)。

## 确认安装成功

快速校验，按速度从快到慢排序：

1. **在 AI 聊天框中输入一个斜杠。** 开始输入 `/opsx`，留意自动补全建议。如果出现了相关建议，说明安装成功。
2. **检查对应文件。** 对于 Claude Code，检查 `.claude/skills/` 目录下是否存在 `openspec-*` 文件夹。其他工具使用自己的专属目录，[支持的工具](supported-tools.md) 页面列出了所有路径。
3. **重新运行安装流程。** 在项目根目录下运行 `openspec update`，这会为你配置的所有工具重新生成技能和命令文件。
4. **重启你的助手。** 许多工具会在启动时扫描技能和命令，因此打开一个新窗口可能就是缺失的步骤。

## 我有哪些可用命令？

默认情况下，OpenSpec 会安装**核心**斜杠命令集：

- `/opsx:explore`：在确定要做变更前，先和 AI 一起梳理想法（不确定时这是绝佳的第一步）
- `/opsx:propose`：一步创建变更并起草所有规划产物
- `/opsx:apply`：通过执行任务列表来构建变更
- `/opsx:sync`：将变更的规格说明更新合并到主规格说明中（通常自动完成）
- `/opsx:archive`：完成变更并将其归档

推荐的默认节奏：不确定要做什么时先用 `explore`，然后依次执行 `propose`、`apply`、`archive`。[先探索](explore.md) 指南会解释为什么这第一步非常值得。

如果你需要更精细的控制，还可以使用**扩展**命令集（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:bulk-archive`、`/opsx:onboard`）。你可以通过 `openspec config profile` 开启该命令集，然后运行 `openspec update` 使其生效。

刚接触这些功能？扩展集中的 `/opsx:onboard` 会引导你在自己的代码库上完成一次完整的变更，并逐步讲解每个步骤，是最友好的入门方式。

每个命令的详细说明请参阅[命令](commands.md)，不同场景下该使用哪个命令请参阅[工作流](workflows.md)。

## 首次运行完整流程

把以上内容整合起来，以下是完整的操作流程，每一步都标注了执行位置：

```text
终端       $ npm install -g @fission-ai/openspec@latest
终端       $ cd your-project
终端       $ openspec init
              （将斜杠命令安装到你的 AI 工具中）

AI 聊天框    /opsx:explore
              （可选：先和 AI 一起梳理想法）

AI 聊天框    /opsx:propose add-dark-mode
              （AI 起草提案、规格说明、设计、任务列表）

AI 聊天框    /opsx:apply
              （AI 执行构建，逐项完成任务）

AI 聊天框    /opsx:archive
              （变更合并到规格说明中并归档）
```

只需要两步终端操作完成设置，之后你就在聊天框中完成所有工作。这就是 OpenSpec 的节奏。

## 相关资源

- [入门指南](getting-started.md)：完整的首次变更操作指南
- [命令](commands.md)：所有斜杠命令的详细说明
- [CLI](cli.md)：所有终端命令的详细说明
- [支持的工具](supported-tools.md)：各工具的语法和文件位置说明
- [常见问题](faq.md)：更多快速解答
- [故障排查](troubleshooting.md)：命令不显示时的修复方法