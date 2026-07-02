# 术语表

所有 OpenSpec 术语都在这里，用通俗的语言进行定义。快速浏览一遍，就能更快地阅读其余文档。

术语按主题分组，并在每个组内按字母顺序排列。

## 核心名词

**Spec.** 一份描述系统某一部分行为的文档。Specs 存放在 `openspec/specs/` 中，按领域组织，由需求和场景组成。Spec 是对“这个软件做什么？”这一问题的既定答案。参见 [Concepts](concepts.md#specs)。

**Source of truth.** 指整个 `openspec/specs/` 目录。它包含了系统当前已确定的行为。更改提出对其的编辑建议；归档则应用这些变更。

**Change.** 一项工作单元，以 `openspec/changes/<name>/` 下的一个文件夹形式打包。一个 Change 包含有关这项工作的全部信息：其提案、设计、任务以及它引入的 Spec 编辑。一个 Change = 一个功能或一个修复。

**Artifact.** Change 内的一个文档。标准 Artifact 包括提案（proposal）、Delta spec、设计和任务。它们按依赖顺序创建并相互关联。

**Delta spec.** Change 内的一个 Spec，它只描述正在发生的变化，使用 `ADDED`、`MODIFIED` 和 `REMOVED` 部分，而不是重述整个 Spec。这使得 OpenSpec 能够干净地编辑现有系统。参见 [Concepts](concepts.md#delta-specs)。

**Domain.** Specs 的逻辑分组，例如 `auth/`、`payments/` 或 `ui/`。您选择的 Domain 应与您思考系统的方式相匹配。

## Spec 内部内容

**Requirement.** 系统必须具备的一个单一行为，通常使用 RFC 2119 关键字编写：“系统应在 30 分钟后过期会话。” Requirement 描述的是 *做什么*（what），而不是 *如何做*（how）。

**Scenario.** 一个具体的、可测试的 Requirement 实际运行示例，通常采用 Given/When/Then 的形式。Scenario 使 Requirement 可被验证：您可以据此编写自动化测试。

**RFC 2119 keywords.** 即 MUST、SHALL、SHOULD 和 MAY 这些词语，它们承载着关于需求严格程度的标准含义。MUST 和 SHALL 是绝对的。SHOULD 是推荐的，允许有例外情况。MAY 是可选的。这个名称来源于定义这些关键字的互联网标准文档。

## Artifacts

**Proposal (`proposal.md`).** Change 的 *原因* 和 *做什么*：其意图、范围和高层级方法。这是您创建的第一个 Artifact。

**Design (`design.md`).** 即 *如何做*（how）：技术方法、架构决策以及您预期会修改的文件。对于简单的更改来说，这一项是可选的。

**Tasks (`tasks.md`).** 包含复选框的任务清单。AI 在执行 `/opsx:apply` 时会处理它，并在进行过程中勾选项目。

## 生命周期

**Archive.** 完成一个 Change 的行为。它的 delta specs 会合并到主 Spec 中，而 Change 文件夹则会移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`。归档后，您的 Specs 就描述了新的现实。参见 [Concepts](concepts.md#archive)。

**Sync.** 将 Change 的 delta specs 合并到主 Spec 中，但*不*归档该 Change。通常是自动的（Archive 会提供此功能），但也可以作为 `/opsx:sync` 单独使用，用于长期进行的更改。参见 [Commands](commands.md#opsxsync)。

## 工作流程和命令

**OPSX.** 当前的标准 OpenSpec 工作流，它围绕流畅的操作而非僵化的阶段构建。它的斜杠命令都以 `/opsx:` 开头。参见 [OPSX Workflow](opsx.md)。

**Slash command.** 您输入到 AI 助手聊天框中的一个命令，例如 `/opsx:propose`。Slash commands 驱动工作流。它们不是终端命令。参见 [How Commands Work](how-commands-work.md)。

**Explore (`/opsx:explore`).** 思维伙伴（thinking-partner）命令。它会读取您的代码库，比较不同的选项，并将模糊的想法澄清为一个具体的计划，不会创建任何 Artifact 也不编写任何代码。当您有一个问题但还没有计划时，这是推荐的起始点。参见 [Explore First](explore.md)。

**CLI.** 您在终端中运行的 `openspec` 程序。它负责设置项目、列出和验证 Change、打开仪表板以及归档。它是 OpenSpec 的终端部分。参见 [CLI](cli.md)。

**Skill.** 一组指令文件夹（`.../skills/openspec-*/SKILL.md`），AI 助手会自动检测并遵循这些 Skill。Skill 是交付 OpenSpec 工作流给您助手的新兴跨工具标准。

**Command file.** 一个针对特定工具的斜杠命令文件（`.../commands/opsx-*`）。这是较早期的交付机制，目前仍与 Skill 一起支持。您很少需要直接操作它们。

**Profile.** 安装在项目中的一组斜杠命令。**Core**（默认）包括 `propose`、`explore`、`apply`、`sync` 和 `archive`。**Expanded** 集合增加了 `new`、`continue`、`ff`、`verify`、`bulk-archive` 和 `onboard`。您可以使用 `openspec config profile` 进行更改。

**Delivery.** 指 OpenSpec 是否为您的工具安装了 Skill、命令文件，或两者都安装。它由全局配置并使用 `openspec update` 应用。

## 定制化（Customization）

**Schema.** 定义一个工作流包含哪些 Artifact 以及它们之间如何依赖的定义。内置默认值是 `spec-driven`（提案 → Specs → 设计 → 任务）。您可以分叉（fork）它或编写自己的 Schema。参见 [Customization](customization.md#custom-schemas)。

**Template.** 一个位于 Schema 内的 Markdown 文件，用于塑造 AI 为给定 Artifact 生成的内容。编辑 Template 会立即改变 AI 的输出，无需重新构建。

**Project config (`openspec/config.yaml`).** 项目级别的设置：默认 Schema、注入到每个规划请求中的 `context:` 以及每项 Artifact 的 `rules:`。这是向 OpenSpec 介绍您的技术栈和约定的最简单方法。参见 [Customization](customization.md#project-configuration)。

**Context injection.** 将项目背景信息放入 `config.yaml` 的 `context:` 字段中，使其自动添加到 AI 生成的每个 Artifact 中。这比指望 AI 阅读一个单独的文件更可靠。

**Dependency graph.** 由 Artifact `requires:` 关系形成的有向图（DAG：箭头只指向前方，永不形成循环）。OpenSpec 使用它来了解下一步可以创建什么。

**Enablers, not gates.** 一种原则，即 Artifact 的依赖关系显示的是接下来*可能*做的事情，而不是接下来*必须*做的事情。您可以随时回顾和编辑任何一个 Artifact。参见 [Core Concepts at a Glance](overview.md#enablers-not-gates)。

## 跨仓库协调（Beta）

这些术语仅适用于您的规划涉及多个仓库的情况。它们仍处于 Beta 阶段。大多数用户可以忽略它们。请参阅 [Stores User Guide](stores-beta/user-guide.md)。

**Store.** 一个独立运行的仓库，其全部工作就是进行规划。它具有您已知的相同 `openspec/` 结构（Specs 和 Changes），外加一个小的身份文件。您只需在本地机器上按名称注册一次，然后任何 OpenSpec 命令就可以从任何地方在该 Store 中运行。

**Reference.** 在代码仓库的 `openspec/config.yaml` 中对某个 Store 的声明，表明该仓库依赖于此 Store。References 是只读的：仓库保留自己的根目录，而 `openspec instructions` 则获得了被引用 Store Specs 的索引，每个条目都包含精确的获取指令。

**Working context.** `openspec context` 为当前仓库所汇集的内容：其 OpenSpec 根目录加上它引用的所有 Store，并说明如何获取它们。这是对“我正在处理什么？”这一问题的答案。

**Workset.** 一组您一起打开的、本地机器级别的文件夹（一个 Store 和您工作的代码仓库）。它是通过 `openspec workset create` 明确创建的；这些本地路径信息不会被提交到共享的规划仓库中。

## 参见

- [Core Concepts at a Glance](overview.md)：一页纸上的五大理念
- [Concepts](concepts.md)：详细解释
- [How Commands Work](how-commands-work.md)：Slash commands 与 CLI 的区别