---
layout: home

hero:
  name: "OpenSpec"
  text: "AI 助手的规范驱动开发"
  tagline: 用于构建和管理 AI 助手项目的轻量级规范。
  actions:
    - theme: brand
      text: 开始使用
      link: ./getting-started
    - theme: alt
      text: 主页
      link: /

features:
  - title: 规范优先的工作流程
    details: 在编写代码之前定义需求。
  - title: AI 原生设计
    details: 为 Claude Code、Cursor、Windsurf 等而构建。
  - title: 多语言支持
    details: 文档提供多种语言。
---

# OpenSpec 文档

欢迎。这是 OpenSpec 的所有内容的中心。

OpenSpec 帮助您和您的 AI 编码助手在编写任何代码之前**就“要构建什么”达成一致**。您描述更改，AI 草拟一份简短的规范和任务列表，你们双方都查看同一份计划，然后工作就开始了。再也不会出现半途发现 AI 构建错了东西的情况。

如果您只阅读一两页，请阅读这两篇：

1. [Getting Started](getting-started.md)：安装、初始化并发布您的首次更改。
2. [How Commands Work](how-commands-work.md)：您实际输入 `/opsx:propose` 的地方（提示：在 AI 聊天中，而不是在终端）。这几乎让所有人都会感到困惑一次。

第二篇文档比它看起来更重要。OpenSpec 有两个部分：一个您在终端中运行的命令行工具，以及您提供给 AI 助手的斜杠命令（slash commands）。了解哪一个是哪个，可以避免最常见的困惑。

> **首先建立的最佳习惯：当你不确定要构建什么时，就从 `/opsx:explore` 开始。** 它是一个零风险的思考伙伴，它会阅读您的代码，权衡不同的选项，并在任何产物或代码存在之前，将一个模糊的想法打磨成一个具体的计划。[Explore First](explore.md) 指南提供了论据。

## 选择您的路径

**我是一个新手。** 从 [Getting Started](getting-started.md) 开始，然后浏览一下 [Core Concepts at a Glance](overview.md)。当遇到任何神秘事物时，[FAQ](faq.md) 和 [Glossary](glossary.md) 就在附近。

**我有一个问题，但还没有计划。** 这是常见的情况，它有专门的答案：[Explore First](explore.md)。使用 `/opsx:explore` 在承诺任何事情之前与 AI 一起思考。

**我有一个大型现有代码库。** 您不需要都进行文档化。[Using OpenSpec in an Existing Project](existing-projects.md) 展示了如何在不“把海洋煮沸”的情况下，对真实的、遗留（brownfield）代码开始工作。

**我只想让它运行起来。** [Install](installation.md)，运行 `openspec init`，然后阅读 [How Commands Work](how-commands-work.md)，确保您的第一个斜杠命令发送到正确的地方。

**我通过示例学习。** [Examples & Recipes](examples.md) 页面会带您完成从头到尾的真实更改：一个小型功能、一个错误修复、一次重构，或是一次探索。

**我来自旧的工作流程。** [Migration Guide](migration-guide.md) 解释了哪些地方发生了变化以及为什么，并保证您的现有工作是安全的。

**我想让它适应我的团队流程。** [Customization](customization.md) 涵盖项目配置、自定义模式（schemas）和共享上下文。

**出错了。** [Troubleshooting](troubleshooting.md) 收集了人们实际遇到的故障，并提供了修复方法。

## 完整的地图

### 从这里开始

| Doc | 内容描述 |
|-----|-------------------|
| [Getting Started](getting-started.md) | 安装、初始化并端到端运行您的首次更改 |
| [Explore First](explore.md) | 使用 `/opsx:explore` 在承诺之前思考一个想法 |
| [How Commands Work](how-commands-work.md) | 斜杠命令在哪里运行，什么是“交互模式”，终端与聊天室的区别 |
| [Core Concepts at a Glance](overview.md) | 一页纸上的完整心智模型：规范、更改、增量（deltas）、归档 |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix 以及如何验证它是否正常工作 |

### 日常使用

| Doc | 内容描述 |
|-----|-------------------|
| [Workflows](workflows.md) | 常见模式以及何时使用每条命令 |
| [Examples & Recipes](examples.md) | 真实更改的完整操作指南，可复制粘贴 |
| [Using OpenSpec in an Existing Project](existing-projects.md) | 在大型遗留代码库上采用 OpenSpec |
| [Editing & Iterating on a Change](editing-changes.md) | 更新产物、回溯、协调手动编辑 |
| [Commands](commands.md) | 所有 `/opsx:*` 斜杠命令的参考指南 |
| [CLI](cli.md) | 所有 `openspec` 终端命令的参考指南 |

### 深入理解

| Doc | 内容描述 |
|-----|-------------------|
| [Concepts](concepts.md) | 对规范、更改、产物（artifacts）、模式和归档的长篇解释 |
| [OPSX Workflow](opsx.md) | 为什么工作流程是流动的而不是阶段锁定的，以及架构的深度解析 |
| [Glossary](glossary.md) | 所有术语的定义集中地 |

### 使它属于您自己

| Doc | 内容描述 |
|-----|-------------------|
| [Customization](customization.md) | 项目配置、自定义模式、共享上下文 |
| [Multi-Language](multi-language.md) | 生成非英语语言的产物 |
| [Supported Tools](supported-tools.md) | OpenSpec 集成的 25+ 个 AI 工具及其文件存放位置 |

### 需要帮助时

| Doc | 内容描述 |
|-----|-------------------|
| [FAQ](faq.md) | 对人们最常问问题的快速回答 |
| [Troubleshooting](troubleshooting.md) | 对具体故障的切实解决方案 |
| [Migration Guide](migration-guide.md) | 从旧工作流程迁移到 OPSX |

### 跨仓库协调（Beta）

| Doc | 内容描述 |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | 当您的工作跨越多个仓库或团队时，如何规划存储库 |
| [Agent Contract](agent-contract.md) | 代理（agents）驱动的、机器可读的 CLI 接口 |

## 三十秒速览

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← 可选，但是一个很好的习惯
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

步骤 1 和 2 在您的终端中完成。其余操作在您的 AI 助手聊天室中完成。这个划分是唯一值得记住的事情，而 [How Commands Work](how-commands-work.md) 会解释清楚原因。第 3 步是可选的，但从不确定时就使用 `/opsx:explore` 是最值得培养的习惯。

## 其他获取帮助的地方

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) 用于提问、分享想法和寻求帮助。
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) 用于报告 Bug 和功能请求。
- **`openspec feedback "your message"`** 直接从您的终端发送反馈（它会打开一个 GitHub issue）。

在这些文档中发现任何错误、过时或令人困惑的地方吗？那就是一个 Bug。请开一个 Issue 或 PR。文档改进是您可以做出的最有价值的贡献之一。