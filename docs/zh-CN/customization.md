# 自定义

OpenSpec 提供三级自定义能力：

| 级别 | 作用 | 适用场景 |
|------|------|----------|
| **项目配置** | 设置默认值、注入上下文/规则 | 大多数团队 |
| **自定义架构** | 定义专属工作流产物 | 有独特流程的团队 |
| **全局覆盖** | 在所有项目间共享架构 | 高级用户 |

---

## 项目配置

`openspec/config.yaml` 文件是为你团队自定义 OpenSpec 最简单的方式，它支持以下操作：

- **设置默认架构** - 无需在每个命令后都加 `--schema` 参数
- **注入项目上下文** - AI 会了解你的技术栈、规范等信息
- **为单个产物添加规则** - 为特定产物设置自定义规则

### 快速配置

```bash
openspec init
```

该命令会引导你交互式创建配置文件。你也可以手动创建：

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  技术栈：TypeScript、React、Node.js、PostgreSQL
  API 风格：RESTful，文档位于 docs/api.md
  测试方案：Jest + React Testing Library
  我们要求所有公开 API 保持向后兼容性

rules:
  proposal:
    - 包含回滚方案
    - 识别受影响的团队
  specs:
    - 使用 Given/When/Then 格式
    - 优先复用现有模式，避免重新造轮子
```

### 工作原理

**默认架构：**

```bash
# 无配置时
openspec new change my-feature --schema spec-driven

# 有配置时 - 架构会自动生效
openspec new change my-feature
```

**上下文和规则注入：**

生成任意产物时，你的上下文和规则会被注入到 AI 提示词中：

```xml
<context>
技术栈：TypeScript、React、Node.js、PostgreSQL
...
</context>

<rules>
- 包含回滚方案
- 识别受影响的团队
</rules>

<template>
[架构内置模板]
</template>
```

- **上下文** 会出现在所有产物中
- **规则** 仅会出现在匹配的产物中

### 架构解析优先级

OpenSpec 需要获取架构时，会按以下顺序检查：

1. CLI 参数：`--schema <名称>`
2. 变更元数据（变更目录下的 `.openspec.yaml` 文件）
3. 项目配置（`openspec/config.yaml`）
4. 默认值（`spec-driven`）

---

## 自定义架构

当项目配置无法满足需求时，你可以创建完全自定义工作流的专属架构。自定义架构存放在项目的 `openspec/schemas/` 目录下，会和你的代码一起纳入版本控制。

```text
你的项目/
├── openspec/
│   ├── config.yaml        # 项目配置
│   ├── schemas/           # 自定义架构存放目录
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 你的变更目录
└── src/
```

### 基于现有架构派生

自定义架构最快的方式是基于内置架构派生：

```bash
openspec schema fork spec-driven my-workflow
```

该命令会将完整的 `spec-driven` 架构复制到 `openspec/schemas/my-workflow/` 目录，你可以自由编辑其中的内容。

**派生后你会得到：**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # 工作流定义
└── templates/
    ├── proposal.md       # proposal 产物模板
    ├── spec.md           # specs 产物模板
    ├── design.md         # design 产物模板
    └── tasks.md          # tasks 产物模板
```

现在你可以编辑 `schema.yaml` 修改工作流，或编辑模板文件调整 AI 生成的内容。

### 从零创建架构

需要完全自定义工作流时：

```bash
# 交互式模式
openspec schema init research-first

# 非交互式模式
openspec schema init rapid \
  --description "快速迭代工作流" \
  --artifacts "proposal,tasks" \
  --default
```

### 架构结构

架构用于定义工作流中的产物，以及产物之间的依赖关系：

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: 我团队的自定义工作流

artifacts:
  - id: proposal
    generates: proposal.md
    description: 初始提案文档
    template: proposal.md
    instruction: |
      创建一份提案，说明本次变更的必要性。
      重点关注问题本身，而非解决方案。
    requires: []

  - id: design
    generates: design.md
    description: 技术设计文档
    template: design.md
    instruction: |
      创建一份设计文档，说明具体的实现方案。
    requires:
      - proposal    # 需先存在 proposal 才能创建 design

  - id: tasks
    generates: tasks.md
    description: 实施检查清单
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**核心字段说明：**

| 字段 | 作用 |
|------|------|
| `id` | 唯一标识符，用于命令和规则中 |
| `generates` | 输出文件名（支持通配符，如 `specs/**/*.md`） |
| `template` | `templates/` 目录下的模板文件 |
| `instruction` | 创建该产物的 AI 指令 |
| `requires` | 依赖项 - 创建该产物前必须存在的其他产物 |

### 模板

模板是用于引导 AI 的 Markdown 文件，创建对应产物时会被注入到提示词中。

```markdown
<!-- templates/proposal.md -->
## 背景

<!-- 说明本次变更的动机，要解决什么问题？ -->

## 变更内容

<!-- 描述具体变更内容，明确新增能力或修改点。 -->

## 影响范围

<!-- 受影响的代码、API、依赖、系统 -->
```

模板可以包含：
- 需要 AI 填写的章节标题
- 给 AI 的 HTML 格式指引注释
- 展示预期结构的示例格式

### 校验架构

使用自定义架构前，请先校验：

```bash
openspec schema validate my-workflow
```

该命令会检查：
- `schema.yaml` 语法是否正确
- 所有引用的模板文件是否存在
- 是否存在循环依赖
- 产物 ID 是否合法

### 使用自定义架构

架构创建完成后，你可以通过以下方式使用：

```bash
# 在命令中指定架构
openspec new change feature --schema my-workflow

# 或在 config.yaml 中设为默认架构
schema: my-workflow
```

### 调试架构解析

不确定当前使用的是哪个架构？可以通过以下命令检查：

```bash
# 查看指定架构的解析来源
openspec schema which my-workflow

# 列出所有可用架构
openspec schema which --all
```

输出会显示架构来源是你的项目、用户目录还是安装包：

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注意：** OpenSpec 也支持用户级架构，存放在 `~/.local/share/openspec/schemas/` 目录下，可用于跨项目共享。但推荐使用项目级架构（存放在 `openspec/schemas/` 目录），因为这类架构会和你的代码一起纳入版本控制。

---

## 示例

### 快速迭代工作流

适用于快速迭代的极简工作流：

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: 低开销的快速迭代工作流

artifacts:
  - id: proposal
    generates: proposal.md
    description: 简要提案
    template: proposal.md
    instruction: |
      为本次变更创建一份简要提案，重点关注变更内容和原因，无需编写详细规格说明。
    requires: []

  - id: tasks
    generates: tasks.md
    description: 实施检查清单
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### 新增评审产物

基于默认架构派生，新增评审环节：

```bash
openspec schema fork spec-driven with-review
```

然后编辑 `schema.yaml` 添加以下配置：

```yaml
  - id: review
    generates: review.md
    description: 实施前评审检查清单
    template: review.md
    instruction: |
      基于设计文档创建评审检查清单，包含安全、性能、测试相关考量。
    requires:
      - design

  - id: tasks
    # ... 原有 tasks 配置 ...
    requires:
      - specs
      - design
      - review    # 现在 tasks 的创建也依赖 review 了
```

---

## 社区架构

OpenSpec 也支持由独立仓库分发、社区维护的架构。这类架构提供了集成 OpenSpec 与其他工具/系统的定制化工作流，类似于 [github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) 的社区扩展目录为 spec-kit 提供的扩展能力。

社区架构不会内置到 OpenSpec 核心中，它们各自存放在独立仓库，有独立的发布节奏。要使用某个社区架构，只需将其架构包复制到项目的 `openspec/schemas/<架构名称>/` 目录即可（每个仓库的 README 中都有安装说明）。

| 架构名称 | 维护者 | 仓库地址 | 描述 |
|----------|--------|----------|------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | 将 OpenSpec 的产物治理能力与 [obra/superpowers](https://github.com/obra/superpowers) 的执行技能（头脑风暴、编写计划、通过子代理实现 TDD、代码评审、收尾）集成。新增了以证据为核心的 `retrospective` 产物，填补了 Superpowers 原生不支持的能力空白。 |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | 以产品经理为核心的工作流。在实施环节之前运行 [nanopm](https://github.com/nmrtn/nanopm) 的规划流程（审计 → 策略 → 路线图 → PRD）。将产品规划与 OpenSpec 的规格驱动工程工作流衔接。若存在 `.nanopm/` 目录，产物会从中读取数据：proposal 来源为审计结果，design 来源为策略文档，tasks 来源为 PRD 拆解。 |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | 能力级端到端测试手册。每个能力对应一份不可变的规格说明、一份不可变的任务模板，以及每次执行的时间戳运行记录。断言仅包含可观测行为（HTTP 状态码、响应体、持久化状态，绝不包含日志子串）；每次运行会记录 UTC 时间的开始/结束时间、耗时，以及估算的 LLM token 消耗量。 |

> 想要贡献社区架构？请提交 Issue 附上你的仓库链接，或提交 PR 向本表格新增一行即可。

---

## 相关参考

- [CLI 参考：架构相关命令](cli.md#schema-commands) - 完整命令文档