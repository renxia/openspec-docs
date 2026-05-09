---
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
  - title: 规范先行的工作流
    details: 在编写代码前先定义需求。
  - title: AI原生设计
    details: 为Claude Code、Cursor、Windsurf等工具打造。
  - title: 多语言支持
    details: 文档提供多种语言版本。
---


我们的理念：

```text
→ 流动而非僵化
→ 迭代而非瀑布
→ 简单而非复杂
→ 为存量项目而生，而非仅限于新项目
→ 从个人项目到企业级均可扩展
```

> [!TIP]
> **全新工作流现已推出！** 我们使用新的工件引导式工作流重构了OpenSpec。
>
> 运行 `/opsx:propose "你的想法"` 即可开始。 → [在此了解更多](opsx.md)

<p align="center">
  关注 <a href="https://x.com/0xTab">@0xTab on X</a> 获取更新 · 加入 <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> 获取帮助和提问。
</p>

## 实际演示

```text
You: /opsx:propose add-dark-mode
AI:  已创建 openspec/changes/add-dark-mode/
     ✓ proposal.md — 说明变更原因和内容
     ✓ specs/       — 需求与场景
     ✓ design.md    — 技术方案
     ✓ tasks.md     — 实施清单
     准备就绪，可以开始实施！

You: /opsx:apply
AI:  正在执行任务...
     ✓ 1.1 添加主题上下文提供者
     ✓ 1.2 创建切换组件
     ✓ 2.1 添加CSS变量
     ✓ 2.2 连接localStorage
     所有任务完成！

You: /opsx:archive
AI:  已归档至 openspec/changes/archive/2025-01-23-add-dark-mode/
     规范已更新。准备好进行下一个功能。
```

<details>
<summary><strong>OpenSpec 仪表盘</strong></summary>
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

现在告诉你的AI：`/opsx:propose <你想构建的内容>`

如果你想要扩展的工作流（`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`），请使用 `openspec config profile` 选择，并通过 `openspec update` 应用。

> [!NOTE]
> 不确定你的工具是否受支持？[查看完整列表](supported-tools.md) – 我们支持25+种工具且仍在增加。
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
→ **[自定义](customization.md)**：打造你的专属配置


## 为什么选择 OpenSpec？

AI编程助手功能强大，但当需求仅存在于聊天记录中时，它们就变得不可预测。OpenSpec 增加了一个轻量级的规范层，让你在编写任何代码之前就对要构建的内容达成共识。

- **先达成共识再构建** — 人类和AI在代码编写前就规范对齐
- **保持组织有序** — 每个变更都有自己的文件夹，包含提案、规范、设计和任务
- **灵活工作** — 随时更新任何工件，没有僵化的阶段门控
- **使用你的工具** — 通过斜杠命令与20+种AI助手协同工作

### 我们如何比较

**对比 [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — 全面但笨重。僵化的阶段门控，大量Markdown，需要Python环境。OpenSpec更轻量，让你自由迭代。

**对比 [Kiro](https://kiro.dev)** (AWS) — 功能强大但你被锁定在他们的IDE中，并且仅限于Claude模型。OpenSpec与你已有的工具协同工作。

**对比无规范** — 没有规范的AI编程意味着模糊的提示和不可预测的结果。OpenSpec在不增加繁文缛节的情况下带来可预测性。

## 更新 OpenSpec

**升级软件包**

```bash
npm install -g @fission-ai/openspec@latest
```

**刷新代理指令**

在每个项目内运行此命令以重新生成AI指导，并确保最新的斜杠命令处于活动状态：

```bash
openspec update
```

## 使用说明

**模型选择**：OpenSpec 与高推理能力的模型配合效果最佳。我们推荐 Opus 4.5 和 GPT 5.2 用于规划和实施。

**上下文卫生**：OpenSpec 受益于干净的上下文窗口。在开始实施前清除上下文，并在整个会话中保持良好的上下文卫生。

## 贡献

**小修复** — 错误修复、拼写更正和小改进可以直接作为PR提交。

**较大变更** — 对于新功能、重大重构或架构变更，请先提交一个OpenSpec变更提案，以便我们在开始实施前就意图和目标达成一致。

撰写提案时，请牢记OpenSpec的理念：我们服务于各种不同编码代理、模型和用例的用户。变更应对所有人都适用。

**欢迎AI生成的代码** — 只要经过测试和验证。包含AI生成代码的PR应提及所使用的编码代理和模型（例如，“使用 claude-opus-4-5-20251101 通过 Claude Code 生成”）。

### 开发

- 安装依赖：`pnpm install`
- 构建：`pnpm run build`
- 测试：`pnpm test`
- 本地开发CLI：`pnpm run dev` 或 `pnpm run dev:cli`
- 约定式提交（单行）：`type(scope): subject`

## 其他

<details>
<summary><strong>遥测</strong></summary>

OpenSpec 收集匿名使用统计。

我们仅收集命令名称和版本以了解使用模式。不收集参数、路径、内容或个人身份信息。在CI环境中自动禁用。

**选择退出：** `export OPENSPEC_TELEMETRY=0` 或 `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>维护者与顾问</strong></summary>

请参阅 [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) 以获取帮助指导项目的核心维护者和顾问名单。

</details>



## 许可证

MIT