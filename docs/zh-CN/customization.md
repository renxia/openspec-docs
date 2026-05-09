# 自定义

OpenSpec 提供三个层级的自定义选项：

| 层级 | 功能说明 | 适用场景 |
|------|----------|----------|
| **项目配置** | 设置默认值，注入上下文/规则 | 大多数团队 |
| **自定义模式** | 定义专属工作流制品 | 流程独特的团队 |
| **全局覆盖** | 跨所有项目共享模式 | 高级用户 |

---

## 项目配置

`openspec/config.yaml` 文件是为团队定制 OpenSpec 最简便的方式。它允许您：

- **设置默认模式** - 无需每次命令都添加 `--schema` 参数
- **注入项目上下文** - AI 可识别您的技术栈、规范等信息
- **添加制品专属规则** - 为特定制品定义自定义规则

### 快速设置

```bash
openspec init
```

此命令将引导您交互式创建配置文件。或手动创建：

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  技术栈：TypeScript, React, Node.js, PostgreSQL
  API 风格：RESTful，文档见 docs/api.md
  测试框架：Jest + React Testing Library
  我们重视所有公共 API 的向后兼容性

rules:
  proposal:
    - 包含回滚计划
    - 识别受影响的团队
  specs:
    - 使用 Given/When/Then 格式
    - 优先参考现有模式而非创造新模式
```

### 工作原理

**默认模式：**

```bash
# 无配置时
openspec new change my-feature --schema spec-driven

# 有配置时 - 模式自动应用
openspec new change my-feature
```

**上下文与规则注入：**

生成任何制品时，您的上下文和规则将被注入 AI 提示词：

```xml
<context>
技术栈：TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- 包含回滚计划
- 识别受影响的团队
</rules>

<template>
[模式内置模板]
</template>
```

- **上下文** 会出现在所有制品中
- **规则** 仅出现在匹配的制品中

### 模式解析顺序

当 OpenSpec 需要模式时，按以下顺序检查：

1. CLI 参数：`--schema <名称>`
2. 变更元数据（变更文件夹中的 `.openspec.yaml`）
3. 项目配置（`openspec/config.yaml`）
4. 默认值（`spec-driven`）

---

## 自定义模式

当项目配置无法满足需求时，可创建完全自定义的工作流模式。自定义模式存放在项目的 `openspec/schemas/` 目录中，并随代码进行版本控制。

```text
your-project/
├── openspec/
│   ├── config.yaml        # 项目配置
│   ├── schemas/           # 自定义模式存放处
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 您的变更记录
└── src/
```

### 派生现有模式

最快的定制方式是派生内置模式：

```bash
openspec schema fork spec-driven my-workflow
```

此命令将完整的 `spec-driven` 模式复制到 `openspec/schemas/my-workflow/`，您可自由编辑。

**生成内容：**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # 工作流定义
└── templates/
    ├── proposal.md       # 提案制品模板
    ├── spec.md           # 规格制品模板
    ├── design.md         # 设计制品模板
    └── tasks.md          # 任务制品模板
```

现在编辑 `schema.yaml` 可更改工作流，编辑模板可调整 AI 生成内容。

### 从零创建模式

创建全新工作流：

```bash
# 交互式
openspec schema init research-first

# 非交互式
openspec schema init rapid \
  --description "快速迭代工作流" \
  --artifacts "proposal,tasks" \
  --default
```

### 模式结构

模式定义工作流中的制品及其依赖关系：

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: 我的团队自定义工作流

artifacts:
  - id: proposal
    generates: proposal.md
    description: 初始提案文档
    template: proposal.md
    instruction: |
      创建提案说明为何需要此变更。
      聚焦问题本身，而非解决方案。
    requires: []

  - id: design
    generates: design.md
    description: 技术设计文档
    template: design.md
    instruction: |
      创建设计文档说明如何实现。
    requires:
      - proposal    # 提案存在前无法创建设计

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

**关键字段：**

| 字段 | 用途 |
|------|------|
| `id` | 唯一标识符，用于命令和规则 |
| `generates` | 输出文件名（支持通配符如 `specs/**/*.md`） |
| `template` | `templates/` 目录中的模板文件 |
| `instruction` | 创建此制品的 AI 指令 |
| `requires` | 依赖项 - 必须先存在的制品 |

### 模板

模板是指导 AI 的 Markdown 文件。创建制品时会被注入提示词。

```markdown
<!-- templates/proposal.md -->
## 背景

<!-- 说明此变更的动机。解决什么问题？ -->

## 变更内容

<!-- 描述将发生的变化。明确新功能或修改点。 -->

## 影响范围

<!-- 受影响的代码、API、依赖、系统 -->
```

模板可包含：
- AI 需要填写的章节标题
- 带指导说明的 HTML 注释
- 展示预期结构的示例格式

### 验证模式

使用自定义模式前请先验证：

```bash
openspec schema validate my-workflow
```

此命令检查：
- `schema.yaml` 语法正确性
- 所有引用的模板是否存在
- 无循环依赖
- 制品 ID 有效性

### 使用自定义模式

创建完成后，通过以下方式使用：

```bash
# 命令中指定
openspec new change feature --schema my-workflow

# 或在 config.yaml 中设为默认
schema: my-workflow
```

### 调试模式解析

不确定使用哪个模式？通过以下命令检查：

```bash
# 查看特定模式的解析来源
openspec schema which my-workflow

# 列出所有可用模式
openspec schema which --all
```

输出显示模式来自项目、用户目录还是软件包：

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注意：** OpenSpec 也支持用户级模式（位于 `~/.local/share/openspec/schemas/`）用于跨项目共享，但推荐使用项目级模式（`openspec/schemas/`），因为它们可随代码进行版本控制。

---

## 示例

### 快速迭代工作流

适用于快速迭代的最小化工作流：

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: 最小开销的快速迭代

artifacts:
  - id: proposal
    generates: proposal.md
    description: 快速提案
    template: proposal.md
    instruction: |
      为此变更创建简要提案。
      聚焦内容与原因，跳过详细规格。
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

### 添加审查制品

派生默认模式并添加审查步骤：

```bash
openspec schema fork spec-driven with-review
```

然后编辑 `schema.yaml` 添加：

```yaml
  - id: review
    generates: review.md
    description: 实施前审查检查清单
    template: review.md
    instruction: |
      基于设计创建审查检查清单。
      包含安全性、性能和测试考量。
    requires:
      - design

  - id: tasks
    # ... 现有任务配置 ...
    requires:
      - specs
      - design
      - review    # 现在任务也需要审查
```

---

## 社区模式

OpenSpec 也支持通过独立仓库分发的社区维护模式。这些模式提供将 OpenSpec 与其他工具或系统集成的定制化工作流，类似于 [github/spec-kit 的社区扩展目录](https://github.com/github/spec-kit/tree/main/extensions) 为 spec-kit 提供的功能。

社区模式未包含在 OpenSpec 核心包中——它们存放在独立仓库中，拥有自己的发布节奏。使用时需将模式包复制到项目的 `openspec/schemas/<模式名称>/` 目录（各仓库的 README 中有安装说明）。

| 模式 | 维护者 | 仓库 | 说明 |
|------|--------|------|------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | 将 OpenSpec 的制品治理与 [obra/superpowers](https://github.com/obra/superpowers) 的执行技能（头脑风暴、制定计划、通过子代理进行 TDD、代码审查、收尾）集成。添加了以证据为先的 `retrospective` 制品，填补了 Superpowers 原生未覆盖的空白。 |

> 想要贡献社区模式？请提交包含仓库链接的 issue，或提交 PR 在此表格中添加一行。

---

## 另请参阅

- [CLI 参考：模式命令](cli.md#schema-commands) - 完整命令文档