---
# https://vitepress.vuejs.org/guide/home-page
layout: home

hero:
  name: "OpenSpec"
  text: "面向AI助手的规范驱动开发"
  tagline: 一个用于构建和管理AI助手项目的轻量级规范。
  actions:
    - theme: brand
      text: 快速开始
      link: ./getting-started
    - theme: alt
      text: 首页
      link: /

features:
  - title: 规范优先的工作流
    details: 在编写代码前定义需求。
  - title: AI原生设计
    details: 为Claude Code、Cursor、Windsurf等工具构建。
  - title: 多语言支持
    details: 文档提供多种语言版本。
---


<details>
<summary><strong>最受欢迎的规范框架。</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
我们的理念：

```text
→ 流动而非僵化
→ 迭代而非瀑布
→ 简单而非复杂
→ 为现有项目而生，而非仅限于全新项目
→ 可从个人项目扩展到企业级应用
```

> [!TIP]
> **全新工作流现已推出！** 我们使用新的制品引导工作流重建了OpenSpec。
>
> 运行 `/opsx:propose "你的想法"` 即可开始。 → [在此了解更多](opsx.md)

<p align="center">
  关注 <a href="https://x.com/0xTab">@0xTab on X</a> 获取更新 · 加入 <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> 获取帮助和提问。
</p>

<!-- TODO: 添加 /opsx:propose → /opsx:archive 工作流的 GIF 演示 -->

## 实际演示

```text
你：/opsx:propose add-dark-mode
AI： 已创建 openspec/changes/add-dark-mode/
     ✓ proposal.md — 为什么要做这个，要改变什么
     ✓ specs/       — 需求和场景
     ✓ design.md    — 技术方案
     ✓ tasks.md     — 实施清单
     准备好进行实施！

你：/opsx:apply
AI： 正在实施任务...
     ✓ 1.1 添加主题上下文提供者
     ✓ 1.2 创建切换组件
     ✓ 2.1 添加CSS变量
     ✓ 2.2 连接localStorage
     所有任务完成！

你：/opsx:archive
AI： 已归档至 openspec/changes/archive/2025-01-23-add-dark-mode/
     规范已更新。准备好进行下一个功能。
```

<details>
<summary><strong>OpenSpec 仪表板</strong></summary>

</details>

## 快速开始

**需要 Node.js 20.19.0 或更高版本。**

全局安装 OpenSpec：

```bash
npm install -g @fission-ai/openspec@latest
```

然后导航到你的项目目录并初始化：

```bash
cd your-project
openspec init
```

现在告诉你的AI：`/opsx:propose <你想构建什么>`

如果你想要扩展的工作流（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:sync`、`/opsx:bulk-archive`、`/opsx:onboard`），请使用 `openspec config profile` 选择它，并使用 `openspec update` 应用。

> [!NOTE]
> 不确定你的工具是否受支持？[查看完整列表](supported-tools.md) – 我们支持25+种工具，并且还在增加。
>
> 也适用于 pnpm、yarn、bun 和 nix。[查看安装选项](installation.md)。

## 文档

→ **[快速开始](getting-started.md)**：第一步<br>
→ **[工作流](workflows.md)**：组合与模式<br>
→ **[命令](commands.md)**：斜杠命令与技能<br>
→ **[CLI](cli.md)**：终端参考<br>
→ **[支持的工具](supported-tools.md)**：工具集成与安装路径<br>
→ **[概念](concepts.md)**：整体如何运作<br>
→ **[多语言](multi-language.md)**：多语言支持<br>
→ **[自定义](customization.md)**：让它为你所用


## 为什么选择 OpenSpec？

AI编码助手功能强大，但当需求仅存在于聊天历史中时，它们会变得不可预测。OpenSpec添加了一个轻量级的规范层，让你在编写任何代码之前就对要构建的内容达成一致。

- **先达成共识再构建** — 人类和AI在编写代码前就规范达成一致
- **保持有序** — 每个变更都有自己的文件夹，包含提案、规范、设计和任务
- **灵活工作** — 随时更新任何制品，没有僵化的阶段门控
- **使用你的工具** — 通过斜杠命令与20+种AI助手协同工作

### 我们如何比较

**对比 [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — 全面但重量级。僵化的阶段门控，大量Markdown，需要Python设置。OpenSpec更轻量，让你自由迭代。

**对比 [Kiro](https://kiro.dev)** (AWS) — 功能强大，但你被锁定在他们的IDE中，并且仅限于Claude模型。OpenSpec与你已有的工具协同工作。

**对比无规范** — 没有规范的AI编码意味着模糊的提示和不可预测的结果。OpenSpec在不增加繁文缛节的情况下带来可预测性。

## 更新 OpenSpec

**升级包**

```bash
npm install -g @fission-ai/openspec@latest
```

**刷新代理指令**

在每个项目内运行此命令以重新生成AI指导，并确保最新的斜杠命令处于活动状态：

```bash
openspec update
```

## 使用说明

**模型选择**：OpenSpec与高推理能力的模型配合效果最佳。我们推荐Opus 4.5和GPT 5.2用于规划和实施。

**上下文卫生**：OpenSpec受益于干净的上下文窗口。在开始实施前清除上下文，并在整个会话期间保持良好的上下文卫生。

## 贡献

**小修复** — 错误修复、拼写更正和小改进可以直接作为PR提交。

**较大变更** — 对于新功能、重大重构或架构变更，请先提交一个OpenSpec变更提案，以便我们在开始实施前就意图和目标达成一致。

撰写提案时，请牢记OpenSpec的理念：我们为使用不同编码代理、模型和用例的广泛用户服务。变更应对所有人都适用。

**欢迎AI生成的代码** — 只要经过测试和验证。包含AI生成代码的PR应提及所使用的编码代理和模型（例如，“使用Claude Code和claude-opus-4-5-20251101生成”）。

### 开发

- 安装依赖：`pnpm install`
- 构建：`pnpm run build`
- 测试：`pnpm test`
- 本地开发CLI：`pnpm run dev` 或 `pnpm run dev:cli`
- 约定式提交（单行）：`type(scope): subject`

## 其他

<details>
<summary><strong>遥测</strong></summary>

OpenSpec收集匿名使用统计。

我们仅收集命令名称和版本以了解使用模式。不收集参数、路径、内容或个人身份信息。在CI中自动禁用。

**选择退出：** `export OPENSPEC_TELEMETRY=0` 或 `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>维护者与顾问</strong></summary>

请参阅 [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) 了解帮助指导项目的核心维护者和顾问列表。

</details>



## 许可证

MIT