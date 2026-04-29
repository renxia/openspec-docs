# 自定义

OpenSpec 提供三个层级的自定义：

| 层级 | 功能 | 适用场景 |
|------|------|----------|
| **项目配置** | 设置默认值，注入上下文/规则 | 大多数团队 |
| **自定义模式** | 定义您自己的工作流产物 | 流程独特的团队 |
| **全局覆盖** | 在所有项目间共享模式 | 高级用户 |

---

## 项目配置

`openspec/config.yaml` 文件是为团队自定义 OpenSpec 的最简单方式。它允许您：

- **设置默认模式** - 无需在每个命令中使用 `--schema`
- **注入项目上下文** - AI 可以了解您的技术栈、规范等
- **添加针对特定产物的规则** - 为特定产物定制规则

### 快速设置

```bash
openspec init
```

这将引导您交互式创建配置。或者手动创建：

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  技术栈：TypeScript, React, Node.js, PostgreSQL
  API 风格：RESTful，文档位于 docs/api.md
  测试：Jest + React Testing Library
  我们重视所有公共 API 的向后兼容性

rules:
  proposal:
    - 包含回滚计划
    - 识别受影响的团队
  specs:
    - 使用 Given/When/Then 格式
    - 在创新之前先参考现有模式
```

### 工作原理

**默认模式：**

```bash
# 无配置时
openspec new change my-feature --schema spec-driven

# 有配置时 - 模式自动应用
openspec new change my-feature
```

**上下文和规则注入：**

在生成任何产物时，您的上下文和规则会被注入到 AI 提示中：

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

- **上下文** 会出现在所有产物中
- **规则** 仅出现在匹配的产物中

### 模式解析顺序

当 OpenSpec 需要模式时，它会按以下顺序检查：

1. CLI 标志：`--schema <name>`
2. 变更元数据（变更文件夹中的 `.openspec.yaml`）
3. 项目配置（`openspec/config.yaml`）
4. 默认值（`spec-driven`）

---

## 自定义模式

当项目配置无法满足需求时，您可以创建自己的模式，实现完全自定义的工作流。自定义模式位于项目的 `openspec/schemas/` 目录中，并随代码进行版本控制。

```text
your-project/
├── openspec/
│   ├── config.yaml        # 项目配置
│   ├── schemas/           # 自定义模式存放于此
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 您的变更
└── src/
```

### 复刻现有模式

最快的自定义方式是复刻一个内置模式：

```bash
openspec schema fork spec-driven my-workflow
```

这会将整个 `spec-driven` 模式复制到 `openspec/schemas/my-workflow/`，您可以在其中自由编辑。

**您将获得：**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # 工作流定义
└── templates/
    ├── proposal.md       # 提案产物的模板
    ├── spec.md           # 规格说明的模板
    ├── design.md         # 设计文档的模板
    └── tasks.md          # 任务清单的模板
```

现在编辑 `schema.yaml` 以更改工作流，或编辑模板以更改 AI 生成的内容。

### 从零开始创建模式

要创建一个全新的工作流：

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

模式定义了工作流中的产物及其相互依赖关系：

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: 我的团队的自定义工作流

artifacts:
  - id: proposal
    generates: proposal.md
    description: 初始提案文档
    template: proposal.md
    instruction: |
      创建一份提案，解释为什么需要此变更。
      关注问题本身，而非解决方案。
    requires: []

  - id: design
    generates: design.md
    description: 技术设计
    template: design.md
    instruction: |
      创建一份设计文档，解释如何实现。
    requires:
      - proposal    # 在提案存在之前无法创建设计

  - id: tasks
    generates: tasks.md
    description: 实施清单
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
| `generates` | 输出文件名（支持通配符，如 `specs/**/*.md`） |
| `template` | `templates/` 目录中的模板文件 |
| `instruction` | AI 创建此产物的指令 |
| `requires` | 依赖项 - 必须先存在的产物 |

### 模板

模板是指导 AI 的 Markdown 文件。在创建该产物时，它们会被注入到提示中。

```markdown
<!-- templates/proposal.md -->
## 为什么

<!-- 解释此变更的动机。它解决了什么问题？ -->

## 变更内容

<!-- 描述将要发生的变化。具体说明新增的功能或修改。 -->

## 影响

<!-- 受影响的代码、API、依赖、系统 -->
```

模板可以包含：
- AI 应填写的章节标题
- 带有 AI 指导的 HTML 注释
- 展示预期结构的示例格式

### 验证您的模式

在使用自定义模式之前，请验证它：

```bash
openspec schema validate my-workflow
```

这将检查：
- `schema.yaml` 语法是否正确
- 所有引用的模板是否存在
- 是否存在循环依赖
- 产物 ID 是否有效

### 使用您的自定义模式

创建完成后，通过以下方式使用您的模式：

```bash
# 在命令中指定
openspec new change feature --schema my-workflow

# 或在 config.yaml 中设置为默认值
schema: my-workflow
```

### 调试模式解析

不确定正在使用哪个模式？通过以下命令检查：

```bash
# 查看特定模式的解析来源
openspec schema which my-workflow

# 列出所有可用模式
openspec schema which --all
```

输出将显示它是来自您的项目、用户目录还是软件包：

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注意：** OpenSpec 也支持位于 `~/.local/share/openspec/schemas/` 的用户级模式，用于跨项目共享，但建议使用 `openspec/schemas/` 中的项目级模式，因为它们会随代码进行版本控制。

---

## 示例

### 快速迭代工作流

一个用于快速迭代的最小化工作流：

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: 以最小开销进行快速迭代

artifacts:
  - id: proposal
    generates: proposal.md
    description: 快速提案
    template: proposal.md
    instruction: |
      为此变更创建一份简要提案。
      关注变更内容和原因，跳过详细规格说明。
    requires: []

  - id: tasks
    generates: tasks.md
    description: 实施清单
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### 添加审查产物

复刻默认模式并添加一个审查步骤：

```bash
openspec schema fork spec-driven with-review
```

然后编辑 `schema.yaml` 以添加：

```yaml
  - id: review
    generates: review.md
    description: 实施前审查清单
    template: review.md
    instruction: |
      根据设计创建一份审查清单。
      包含安全性、性能和测试方面的考虑。
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

## 另请参阅

- [CLI 参考：模式命令](cli.md#schema-commands) - 完整的命令文档