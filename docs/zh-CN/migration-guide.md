# 迁移至 OPSX

本指南帮助您从旧版 OpenSpec 工作流过渡到 OPSX。迁移过程设计平滑——您现有的工作将被保留，新系统提供更灵活的操作方式。

## 主要变化

OPSX 以流畅的、基于操作的方式取代了旧有的阶段锁定工作流。以下是关键转变：

| 方面 | 旧版 | OPSX |
|------|------|------|
| **命令** | `/openspec:proposal`、`/openspec:apply`、`/openspec:archive` | 默认：`/opsx:propose`、`/opsx:apply`、`/opsx:sync`、`/opsx:archive`（可选扩展工作流命令） |
| **工作流** | 一次性创建所有产物 | 可增量创建或一次性创建——由您选择 |
| **回溯操作** | 受限于阶段门控，操作不便 | 自然流畅——可随时更新任何产物 |
| **定制化** | 固定结构 | 基于模式驱动，完全可自定义 |
| **配置** | `CLAUDE.md` 中的标记 + `project.md` | 简洁配置于 `openspec/config.yaml` |

**理念转变：** 工作并非线性。OPSX 不再假装它是线性的。

---

## 开始之前

### 您现有的工作是安全的

迁移过程的设计以保留为首要考虑：

- **`openspec/changes/` 中的活跃更改** — 完全保留。您可以继续使用 OPSX 命令处理它们。
- **已归档的更改** — 未受影响。您的历史记录保持完整。
- **`openspec/specs/` 中的主规范** — 未受影响。这些是您的事实来源。
- **您在 CLAUDE.md、AGENTS.md 等文件中的内容** — 已保留。仅移除 OpenSpec 标记块；您编写的所有内容都会保留。

### 什么会被移除

仅移除正在被替换的、由 OpenSpec 管理的文件：

| 内容 | 原因 |
|------|------|
| 旧版斜杠命令目录/文件 | 被新的技能系统取代 |
| `openspec/AGENTS.md` | 过时的工作流触发器 |
| `CLAUDE.md`、`AGENTS.md` 等文件中的 OpenSpec 标记 | 不再需要 |

**按工具划分的旧版命令位置**（示例——您的工具可能有所不同）：

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md`（仅限 IDE 扩展；Copilot CLI 不支持）
- 以及其他（Augment, Continue, Amazon Q 等）

迁移过程会检测您配置了哪些工具，并清理其旧版文件。

移除列表可能看起来很长，但这些都是 OpenSpec 最初创建的文件。您自己的内容永远不会被删除。

### 需要您关注的事项

有一个文件需要手动迁移：

**`openspec/project.md`** — 此文件不会被自动删除，因为它可能包含您编写的项目上下文。您需要：

1. 审阅其内容
2. 将有用的上下文移动到 `openspec/config.yaml`（参见下方指南）
3. 准备好后删除该文件

**我们做出此更改的原因：**

旧的 `project.md` 是被动的——代理可能会读取它，也可能不会，可能会忘记读取的内容。我们发现其可靠性不一致。

新的 `config.yaml` 上下文会被**主动注入到每个 OpenSpec 规划请求中**。这意味着当 AI 创建工件时，您的项目约定、技术栈和规则始终存在。可靠性更高。

**权衡：**

由于上下文被注入到每个请求中，您需要保持简洁。专注于真正重要的内容：
- 技术栈和关键约定
- AI 需要知道的非显而易见的约束
- 之前经常被忽略的规则

不必担心做到完美。我们仍在学习什么最有效，并且会随着实验改进上下文注入的工作方式。

---

## 运行迁移

`openspec init` 和 `openspec update` 都会检测旧版文件并引导您完成相同的清理过程。根据您的情况选择使用：

- 新安装默认使用 `core` 配置文件（`propose`, `explore`, `apply`, `sync`, `archive`）。
- 迁移安装会通过在需要时写入 `custom` 配置文件来保留您之前安装的工作流。

### 使用 `openspec init`

如果您想添加新工具或重新配置要设置的工具，请运行此命令：

```bash
openspec init
```

init 命令会检测旧版文件并引导您完成清理：

```
正在升级到新版 OpenSpec

OpenSpec 现在使用代理技能，这是跨编码代理的新兴标准。这简化了您的设置，同时保持一切照常工作。

要移除的文件
无需保留的用户内容：
  • .claude/commands/openspec/
  • openspec/AGENTS.md

要更新的文件
OpenSpec 标记将被移除，您的内容将被保留：
  • CLAUDE.md
  • AGENTS.md

需要您关注
  • openspec/project.md
    我们不会删除此文件。它可能包含有用的项目上下文。

    新的 openspec/config.yaml 有一个 "context:" 部分用于规划上下文。这包含在每个 OpenSpec 请求中，并且比旧的 project.md 方法更可靠。

    审阅 project.md，将任何有用的内容移动到 config.yaml 的 context 部分，然后在准备好后删除该文件。

? 升级并清理旧版文件？(Y/n)
```

**当您选择是时会发生什么：**

1. 旧版斜杠命令目录被移除
2. OpenSpec 标记从 `CLAUDE.md`、`AGENTS.md` 等文件中剥离（您的内容保留）
3. `openspec/AGENTS.md` 被删除
4. 新技能安装在 `.claude/skills/` 中
5. `openspec/config.yaml` 使用默认模式创建

### 使用 `openspec update`

如果您只想迁移并将现有工具刷新到最新版本，请运行此命令：

```bash
openspec update
```

update 命令也会检测并清理旧版工件，然后刷新生成的技能/命令以匹配您当前的配置文件和交付设置。

### 非交互式 / CI 环境

用于脚本化迁移：

```bash
openspec init --force --tools claude
```

`--force` 标志会跳过提示并自动接受清理。

---

## 将 project.md 迁移到 config.yaml

旧的 `openspec/project.md` 是一个用于项目上下文的自由格式 markdown 文件。新的 `openspec/config.yaml` 是结构化的，并且——关键的是——**被注入到每个规划请求中**，因此当 AI 工作时，您的约定始终存在。

### 迁移前 (project.md)

```markdown
# 项目上下文

这是一个使用 React 和 Node.js 的 TypeScript 单体仓库。
我们使用 Jest 进行测试并遵循严格的 ESLint 规则。
我们的 API 是 RESTful 的，并在 docs/api.md 中有文档记录。

## 约定

- 所有公共 API 必须保持向后兼容性
- 新功能应包含测试
- 规范使用 Given/When/Then 格式
```

### 迁移后 (config.yaml)

```yaml
schema: spec-driven

context: |
  技术栈：TypeScript, React, Node.js
  测试：Jest 配合 React Testing Library
  API：RESTful，在 docs/api.md 中有文档记录
  我们为所有公共 API 保持向后兼容性

rules:
  proposal:
    - 对于高风险更改包含回滚计划
  specs:
    - 场景使用 Given/When/Then 格式
    - 在发明新模式之前参考现有模式
  design:
    - 对于复杂流程包含序列图
```

### 主要区别

| project.md | config.yaml |
|------------|-------------|
| 自由格式的 markdown | 结构化的 YAML |
| 一大段文本 | 分离的上下文和按工件划分的规则 |
| 不清楚何时使用 | 上下文出现在所有工件中；规则仅出现在匹配的工件中 |
| 没有模式选择 | 显式的 `schema:` 字段设置默认工作流 |

### 保留什么，舍弃什么

迁移时要有选择性。问问自己：“AI 是否需要这个用于*每个*规划请求？”

**适合放入 `context:` 的内容：**
- 技术栈（语言、框架、数据库）
- 关键架构模式（单体仓库、微服务等）
- 非显而易见的约束（“我们不能使用库 X，因为...”）
- 经常被忽略的关键约定

**改为放入 `rules:` 的内容：**
- 特定于工件的格式（“在规范中使用 Given/When/Then”）
- 审查标准（“提案必须包含回滚计划”）
- 这些仅出现在匹配的工件中，使其他请求更轻量

**完全省略的内容：**
- AI 已经知道的通用最佳实践
- 可以总结的冗长解释
- 不影响当前工作的历史上下文

### 迁移步骤

1. **创建 config.yaml**（如果 init 尚未创建）：
   ```yaml
   schema: spec-driven
   ```

2. **添加您的上下文**（保持简洁——这会进入每个请求）：
   ```yaml
   context: |
     您的项目背景放在这里。
     专注于 AI 真正需要知道的内容。
   ```

3. **添加按工件划分的规则**（可选）：
   ```yaml
   rules:
     proposal:
       - 您的提案特定指南
     specs:
       - 您的规范编写规则
   ```

4. **删除 project.md**，一旦您移动了所有有用的内容。

**不要想太多。** 从要点开始并迭代。如果您注意到 AI 遗漏了重要内容，请添加它。如果上下文感觉臃肿，请精简它。这是一个动态文档。

### 需要帮助？使用此提示

如果您不确定如何提炼您的 project.md，请询问您的 AI 助手：

```
我正在从 OpenSpec 旧的 project.md 迁移到新的 config.yaml 格式。

这是我当前的 project.md：
[粘贴您的 project.md 内容]

请帮我创建一个 config.yaml，包含：
1. 一个简洁的 `context:` 部分（这会注入到每个规划请求中，所以保持紧凑——专注于技术栈、关键约束和经常被忽略的约定）
2. 如果有任何内容是特定于工件的，则为 `rules:`（例如，“使用 Given/When/Then” 属于规范规则，而不是全局上下文）

省略 AI 模型已经知道的任何通用内容。对简洁性要毫不留情。
```

AI 将帮助您识别什么是必需的，什么可以精简。

---

## 新命令

命令可用性取决于配置文件：

**默认（`core` 配置文件）：**

| 命令 | 用途 |
|------|------|
| `/opsx:propose` | 一步创建更改并生成规划工件 |
| `/opsx:explore` | 无结构地思考想法 |
| `/opsx:apply` | 实现 tasks.md 中的任务 |
| `/opsx:archive` | 完成并归档更改 |

**扩展工作流（自定义选择）：**

| 命令 | 用途 |
|------|------|
| `/opsx:new` | 开始一个新的更改脚手架 |
| `/opsx:continue` | 创建下一个工件（一次一个） |
| `/opsx:ff` | 快进——一次性创建规划工件 |
| `/opsx:verify` | 验证实现是否符合规范 |
| `/opsx:sync` | 将增量规范合并到主规范 |
| `/opsx:bulk-archive` | 一次归档多个更改 |
| `/opsx:onboard` | 引导式端到端入门工作流 |

使用 `openspec config profile` 启用扩展命令，然后运行 `openspec update`。

### 从旧版命令映射

| 旧版 | OPSX 等效命令 |
|------|---------------|
| `/openspec:proposal` | `/opsx:propose`（默认）或 `/opsx:new` 然后 `/opsx:ff`（扩展） |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新功能

这些功能是扩展工作流命令集的一部分。

**细粒度工件创建：**
```
/opsx:continue
```
基于依赖关系一次创建一个工件。当您想审查每个步骤时使用此命令。

**探索模式：**
```
/opsx:explore
```
在承诺更改之前与伙伴一起思考想法。

---

## 理解新架构

### 从阶段锁定到流程灵活

旧版工作流强制线性推进：

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   规划阶段   │ ───► │   实施阶段   │ ───► │   归档阶段   │
└──────────────┘      └──────────────┘      └──────────────┘

如果你在实施阶段发现设计有问题？
太糟糕了。阶段门控不允许你轻易回退。
```

OPSX 使用操作，而非阶段：

```
         ┌───────────────────────────────────────────────┐
         │           操作（而非阶段）                    │
         │                                               │
         │     新建 ◄──► 继续 ◄──► 应用 ◄──► 归档       │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    任意顺序                   │
         └───────────────────────────────────────────────┘
```

### 依赖关系图

制品构成一个有向图。依赖关系是启用条件，而非门控：

```
                        提案
                       (根节点)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           规格说明                     设计
        (依赖于：                   (依赖于：
         提案)                       提案)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         任务
                     (依赖于：
                     规格说明, 设计)
```

当你运行 `/opsx:continue` 时，它会检查哪些已就绪并提供下一个制品。你也可以按任意顺序创建多个已就绪的制品。

### 技能 vs 命令

旧系统使用特定于工具的命令文件：

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX 使用新兴的 **技能** 标准：

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

技能在多个 AI 编码工具中得到识别，并提供更丰富的元数据。

---

## 继续现有更改

你正在进行的更改可以与 OPSX 命令无缝协作。

**在旧工作流中有活跃的更改？**

```
/opsx:apply add-my-feature
```

OPSX 会读取现有制品并从你上次中断的地方继续。

**想为现有更改添加更多制品？**

```
/opsx:continue add-my-feature
```

根据已有内容，显示哪些已准备好可以创建。

**需要查看状态？**

```bash
openspec status --change add-my-feature
```

---

## 新的配置系统

### config.yaml 结构

```yaml
# 必需：新更改的默认模式
schema: spec-driven

# 可选：项目上下文（最大 50KB）
# 注入到所有制品指令中
context: |
  你的项目背景、技术栈、
  约定和约束。

# 可选：每个制品的规则
# 仅注入到匹配的制品中
rules:
  proposal:
    - 包含回滚计划
  specs:
    - 使用 Given/When/Then 格式
  design:
    - 记录降级策略
  tasks:
    - 分解为最大 2 小时的任务块
```

### 模式解析

在确定使用哪个模式时，OPSX 按以下顺序检查：

1. **CLI 标志**：`--schema <name>`（最高优先级）
2. **更改元数据**：更改目录中的 `.openspec.yaml`
3. **项目配置**：`openspec/config.yaml`
4. **默认值**：`spec-driven`

### 可用模式

| 模式 | 制品 | 最适用于 |
|--------|-----------|----------|
| `spec-driven` | 提案 → 规格说明 → 设计 → 任务 | 大多数项目 |

列出所有可用模式：

```bash
openspec schemas
```

### 自定义模式

创建你自己的工作流：

```bash
openspec schema init my-workflow
```

或者复用现有模式：

```bash
openspec schema fork spec-driven my-workflow
```

详情请参阅 [自定义](customization.md)。

---

## 故障排除

### "在非交互模式下检测到旧文件"

你正在 CI 或非交互环境中运行。请使用：

```bash
openspec init --force
```

### 迁移后命令未出现

重启你的 IDE。技能在启动时被检测。

### "规则中存在未知的制品 ID"

检查你的 `rules:` 键是否与模式的制品 ID 匹配：

- **spec-driven**：`proposal`、`specs`、`design`、`tasks`

运行以下命令查看有效的制品 ID：

```bash
openspec schemas --json
```

### 配置未生效

1. 确保文件位于 `openspec/config.yaml`（不是 `.yml`）
2. 验证 YAML 语法
3. 配置更改立即生效——无需重启

### project.md 未迁移

系统有意保留 `project.md`，因为它可能包含你的自定义内容。请手动审查它，将有用的部分移至 `config.yaml`，然后删除它。

### 想看看哪些会被清理？

运行 init 并拒绝清理提示——你将看到完整的检测摘要，而不会进行任何更改。

---

## 快速参考

### 迁移后的文件

```
project/
├── openspec/
│   ├── specs/                    # 未更改
│   ├── changes/                  # 未更改
│   │   └── archive/              # 未更改
│   └── config.yaml               # 新增：项目配置
├── .claude/
│   └── skills/                   # 新增：OPSX 技能
│       ├── openspec-propose/     # 默认核心配置
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # 扩展配置添加了 new/continue/ff 等
├── CLAUDE.md                     # OpenSpec 标记已移除，你的内容已保留
└── AGENTS.md                     # OpenSpec 标记已移除，你的内容已保留
```

### 已移除的内容

- `.claude/commands/openspec/` — 被 `.claude/skills/` 取代
- `openspec/AGENTS.md` — 已过时
- `openspec/project.md` — 迁移到 `config.yaml`，然后删除
- `CLAUDE.md`、`AGENTS.md` 等文件中的 OpenSpec 标记块

### 命令速查表

```text
/opsx:propose      快速开始（默认核心配置）
/opsx:apply        实施任务
/opsx:archive      完成并归档

# 扩展工作流（如果启用）：
/opsx:new          搭建一个更改的脚手架
/opsx:continue     创建下一个制品
/opsx:ff           创建规划制品
```

---

## 获取帮助

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **文档**: [docs/opsx.md](opsx.md) 获取完整的 OPSX 参考