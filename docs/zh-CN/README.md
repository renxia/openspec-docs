# OpenSpec 文档

欢迎。这是 OpenSpec 的所有内容的中心。

OpenSpec 帮助您和您的 AI 编码助手在编写任何代码之前就**达成共识，确定要构建什么**。您描述变更需求，AI 随即起草一份简短的规范和任务列表，你们双方都查看同一份计划，然后工作就开始了。这样就不会再出现“原来 AI 构建的是错误的东西”这种情况了。

如果您只阅读两页内容：

1. [Getting Started](getting-started.md)：安装、初始化并交付您的第一个变更。
2. [How Commands Work](how-commands-work.md)：您实际输入 `/opsx:propose` 的地方（提示：是在您的 AI 聊天中，而不是在终端中）。这是几乎所有人的一个痛点。

第二篇内容比它看起来更重要。OpenSpec 有两个部分：一个您在终端中运行的命令行工具，以及一套您提供给 AI 助手的斜杠命令 (slash commands)。了解这两者分别是什么，可以避免最常见的困惑。

> **首先建立的最佳习惯：当你不确定该构建什么时，就从 `/opsx:explore` 开始。** 它是一个零风险的思考伙伴，它会阅读您的代码，权衡不同的选项，并在任何产物或代码存在之前，将一个模糊的想法打磨成一份具体的计划。[Explore First](explore.md) 指南对此提供了论证。

## 选择您的路径

**我是新手。** 请从 [Getting Started](getting-started.md) 开始，然后浏览一下 [Core Concepts at a Glance](overview.md)。当遇到一些神秘的地方时，[FAQ](faq.md) 和 [Glossary](glossary.md) 就在附近。

**我有一个问题，但还没有计划。** 这是常见的情况，它有专门的解答：[Explore First](explore.md)。使用 `/opsx:explore` 与 AI 一起思考，然后再承诺任何事情。

**我有一个大型现有代码库。** 您不需要文档化所有内容。[Using OpenSpec in an Existing Project](existing-projects.md) 展示了如何在不“把整个海洋都煮沸”的情况下，对真实的存量代码进行启动工作。

**我只想让它运行起来。** [Install](installation.md)，运行 `openspec init`，然后阅读 [How Commands Work](how-commands-work.md)，确保您的第一个斜杠命令进入了正确的位置。

**我通过示例学习。** [Examples & Recipes](examples.md) 页面会带您完成从头到尾的真实变更：一个小型功能、一个 Bug 修复、一次重构，或是一次探索。

**我来自旧的工作流程。** [Migration Guide](migration-guide.md) 解释了哪些地方发生了变化以及为什么，并保证您的现有工作是安全的。

**我想让它适应我的团队流程。** [Customization](customization.md) 涵盖了项目配置、自定义 Schema 和共享上下文。

**有些东西坏了。** [Troubleshooting](troubleshooting.md) 收集了人们实际遇到的故障，并提供了修复方案。

## 完整地图

### 从这里开始

| 文档 | 它能为您提供什么 |
|-----|-------------------|
| [Getting Started](getting-started.md) | 端到端地安装、初始化和运行您的第一个变更 |
| [Explore First](explore.md) | 使用 `/opsx:explore` 在承诺之前思考一个想法 |
| [How Commands Work](how-commands-work.md) | 斜杠命令在哪里运行，什么是“交互模式”，终端与聊天室的区别 |
| [Core Concepts at a Glance](overview.md) | 一页纸上的完整心智模型：规范、变更、增量（deltas）、存档 |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix 以及如何验证它是否正常工作 |

### 日常使用

| 文档 | 它能为您提供什么 |
|-----|-------------------|
| [Workflows](workflows.md) | 常见的模式以及何时应该使用每条命令 |
| [Examples & Recipes](examples.md) | 真实变更的完整操作指南，可复制粘贴 |
| [Using OpenSpec in an Existing Project](existing-projects.md) | 在大型存量代码库上采用 OpenSpec |
| [Editing & Iterating on a Change](editing-changes.md) | 更新产物、回溯、协调手动编辑 |
| [Commands](commands.md) | 所有 `/opsx:*` 斜杠命令的参考指南 |
| [CLI](cli.md) | 所有 `openspec` 终端命令的参考指南 |

### 深入理解

| 文档 | 它能为您提供什么 |
|-----|-------------------|
| [Concepts](concepts.md) | 对规范、变更、产物 (artifacts)、Schema 和存档的详细解释 |
| [OPSX Workflow](opsx.md) | 为什么工作流程是流动的而不是阶段锁定的，以及架构深度解析 |
| [Glossary](glossary.md) | 所有术语在一个地方定义 |

### 使其专属化

| 文档 | 它能为您提供什么 |
|-----|-------------------|
| [Customization](customization.md) | 项目配置、自定义 Schema 和共享上下文 |
| [Multi-Language](multi-language.md) | 生成非英语语言的产物 |
| [Supported Tools](supported-tools.md) | OpenSpec 集成的 25+ 种 AI 工具，以及文件存放的位置 |

### 需要帮助时

| 文档 | 它能为您提供什么 |
|-----|-------------------|
| [FAQ](faq.md) | 对人们最常问问题的快速解答 |
| [Troubleshooting](troubleshooting.md) | 对具体故障的实际解决方案 |
| [Migration Guide](migration-guide.md) | 从遗留工作流程迁移到 OPSX |

### 跨仓库协调（Beta）

| 文档 | 它能为您提供什么 |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | 当您的工作涉及多个仓库或团队时，如何规划 |
| [Agent Contract](agent-contract.md) | 机器可读的 CLI 表面（surfaces）所驱动的 Agent |

## 三十秒版本

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← 可选，但是一个很好的习惯
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

步骤 1 和 2 在您的终端中完成。其余步骤在您的 AI 助手聊天中完成。这个划分是唯一值得记住的事情，而 [How Commands Work](how-commands-work.md) 会解释清楚原因。第 3 步是可选的，但养成在使用 `/opsx:explore` 的习惯（当您不确定时）是最有价值的。

## 其他获取帮助的地方

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) 用于提问、分享想法和寻求帮助。
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) 用于报告 Bug 和功能请求。
- **`openspec feedback "your message"`** 直接从您的终端发送反馈（它会打开一个 GitHub issue）。

在这些文档中发现任何错误、过时或令人困惑的地方吗？那就是一个 Bug。请提交一个 Issue 或 PR。文档改进是您能做的最有价值的贡献之一。