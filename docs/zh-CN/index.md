---
layout: home

hero:
  name: "OpenSpec"
  text: "面向AI助手的规格驱动开发"
  tagline: 用于构建和管理AI助手项目的轻量级规格规范。
  actions:
    - theme: brand
      text: 快速开始
      link: ./getting-started
    - theme: alt
      text: 首页
      link: /
  features:
    - title: 规格优先工作流
      details: 先定义需求，再编写代码。
    - title: AI原生设计
      details: 专为 Claude Code、Cursor、Windsurf 等工具打造。
    - title: 多语言支持
      details: 提供多语言文档。
---

# OpenSpec 文档

欢迎。这里是 OpenSpec 所有文档的主页。

OpenSpec 可帮助你和你的 AI 编程助手**在编写任何代码之前就明确要构建的内容**。你描述变更需求，AI 会起草一份简短的规格说明和任务清单，你们双方共同查看同一份计划，之后再进行开发。再也不会出现开发到一半才发现 AI 做错了东西的情况。

如果你只读两页文档，就读这两篇：

1. [快速开始](getting-started.md)：安装、初始化，并完成你的第一个变更交付。
2. [命令工作原理](how-commands-work.md)：你实际输入 `/opsx:propose` 的位置（提示：是在 AI 聊天窗口，而不是终端）。几乎所有人在第一次使用时都会在这里踩坑。

第二篇文档的重要性远超它的篇幅。OpenSpec 包含两个部分：一个你在终端中运行的命令行工具，以及你向 AI 助手发送的斜杠命令。搞清楚两者的区别，能帮你避开最常见的困惑场景。

> **首先要养成的习惯：当你还不确定要构建什么时，先从 `/opsx:explore` 开始。** 这是一个零风险的思考伙伴，它会读取你的代码、评估各种选项，在任何产物或代码出现之前，就把模糊的想法打磨成具体的计划。[先探索](explore.md) 指南会详细说明这一点。

## 选择你的路径

**我是新手。** 从[快速开始](getting-started.md)入手，然后浏览[核心概念概览](overview.md)。遇到看不懂的地方，可以随时查看附近的[常见问题](faq.md)和[术语表](glossary.md)。

**我有问题但没有明确方案。** 这是最常见的情况，OpenSpec 有专门的解决方案：[先探索](explore.md)。在确定任何方案之前，先用 `/opsx:explore` 和 AI 一起梳理清楚思路。

**我有一个庞大的现有代码库。** 你不需要给所有代码都写文档。[在现有项目中引入 OpenSpec](existing-projects.md) 会告诉你如何在不贪大求全的前提下，对真实的遗留代码开始使用 OpenSpec。

**我只想先跑通流程。** 先[安装](installation.md)，运行 `openspec init`，然后阅读[命令工作原理](how-commands-work.md)，确保你的第一个斜杠命令发对地方。

**我通过示例学习。** [示例与配方](examples.md) 页面会从头到尾带你走完真实的变更流程：小功能开发、Bug 修复、重构、探索分析。

**AI 刚起草了一份计划——接下来怎么办？** 先读它。[评审变更](reviewing-changes.md) 会告诉你如何在成本极低的情况下，用两分钟快速检查出计划里的错误方向；[编写优质规格说明](writing-specs.md) 则会讲解值得批准的规划需要包含哪些内容。

**我在团队中工作。** [团队中的 OpenSpec](team-workflow.md) 会讲解变更如何对应到分支和拉取请求，以及团队成员如何在代码编写前评审计划。

**我之前用的是旧工作流。** [迁移指南](migration-guide.md) 会解释哪些地方变了、为什么变，并保证你现有的工作不会丢失。

**我想适配团队的现有流程。** [自定义配置](customization.md) 涵盖了项目配置、自定义模式和共享上下文。

**出问题了。** [故障排查](troubleshooting.md) 收集了用户实际遇到的各种问题及对应的修复方法。

## 完整文档地图

### 入门必读

| 文档 | 内容简介 |
|-----|-------------------|
| [快速开始](getting-started.md) | 安装、初始化，端到端完成你的第一个变更 |
| [先探索](explore.md) | 在确定方案前，用 `/opsx:explore` 梳理思路 |
| [命令工作原理](how-commands-work.md) | 斜杠命令的运行位置、“交互模式”的含义，以及终端与聊天的区别 |
| [核心概念概览](overview.md) | 一页纸讲清完整心智模型：规格说明、变更、增量、归档 |
| [安装](installation.md) | 支持 npm、pnpm、yarn、bun、Nix 安装，以及如何验证安装成功 |

### 日常使用

| 文档 | 内容简介 |
|-----|-------------------|
| [工作流](workflows.md) | 常见工作模式，以及何时使用对应命令 |
| [示例与配方](examples.md) | 真实变更的完整演示，可直接复制粘贴使用 |
| [编写优质规格说明](writing-specs.md) | 优质需求与场景的写法，以及如何合理控制变更规模 |
| [评审变更](reviewing-changes.md) | 编写代码前，对起草的计划做两分钟快速评审 |
| [团队中的 OpenSpec](team-workflow.md) | 变更如何对应分支、拉取请求和评审流程 |
| [在现有项目中引入 OpenSpec](existing-projects.md) | 在大型遗留代码库中引入 OpenSpec 的方法 |
| [编辑与迭代变更](editing-changes.md) | 更新变更产物、回滚变更、调和手动修改的内容 |
| [命令](commands.md) | 所有 `/opsx:*` 斜杠命令的参考文档 |
| [CLI](cli.md) | 所有 `openspec` 终端命令的参考文档 |

### 深入理解

| 文档 | 内容简介 |
|-----|-------------------|
| [概念](concepts.md) | 关于规格说明、变更、产物、模式和归档的长篇详解 |
| [OPSX 工作流](opsx.md) | 为什么工作流是灵活的而非阶段锁定的，以及架构深度解析 |
| [术语表](glossary.md) | 所有术语的集中定义 |

### 自定义配置

| 文档 | 内容简介 |
|-----|-------------------|
| [自定义配置](customization.md) | 项目配置、自定义模式和共享上下文 |
| [多语言支持](multi-language.md) | 生成非英语的变更产物 |
| [支持的集成工具](supported-tools.md) | OpenSpec 集成的 25+ 款 AI 工具，以及产物的存储位置 |

### 获取帮助

| 文档 | 内容简介 |
|-----|-------------------|
| [常见问题](faq.md) | 常见问题的快速解答 |
| [故障排查](troubleshooting.md) | 具体问题的具体修复方案 |
| [迁移指南](migration-guide.md) | 从旧工作流迁移到 OPSX 的指南 |

### 跨仓库协作（测试版）

| 文档 | 内容简介 |
|-----|-------------------|
| [Stores：用户指南](stores-beta/user-guide.md) | 当你的工作涉及多个仓库或团队时，可在独立仓库中管理计划 |
| [代理契约](agent-contract.md) | 代理驱动的机器可读 CLI 接口 |

## 30 秒速览

```text
1. 安装        npm install -g @fission-ai/openspec@latest
2. 初始化     cd your-project && openspec init
3. 探索        （in your AI chat）  /opsx:explore           ← 可选，但值得养成的好习惯
4. 提议        （in your AI chat）  /opsx:propose add-dark-mode
5. 构建        （in your AI chat）  /opsx:apply
6. 归档        （in your AI chat）  /opsx:archive
```

步骤 1 和 2 在终端中执行，其余步骤在你的 AI 助手聊天窗口中完成。这个区分是唯一值得记住的点，[命令工作原理](how-commands-work.md) 会详细解释原因。步骤 3 是可选的，但在不确定时优先使用 `/opsx:explore` 是最值得养成的习惯。

## 其他获取帮助的渠道

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)，用于提问、交流想法和获取帮助。
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)，用于提交 Bug 和功能需求。
- 在终端中运行 `openspec feedback "你的反馈内容"` 可直接提交反馈（会自动打开一个 GitHub Issue）。

发现这些文档里有错误、过时或者令人困惑的内容？这属于 Bug。请提交 Issue 或 PR。文档改进是你所能做的最有价值的贡献之一。