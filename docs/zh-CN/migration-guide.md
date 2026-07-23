# 迁移至 OPSX

本指南可帮助您从旧版 OpenSpec 工作流迁移至 OPSX。本次迁移设计为平滑过渡——您现有的工作内容将被保留，新系统也提供了更高的灵活性。

## 有哪些变化？

OPSX 以流畅的、基于行动的工作流替代了旧版锁相工作流。核心变化如下：

| 方面 | 旧版 | OPSX |
|--------|--------|------|
| **命令** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | 默认：`/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive`（可选用扩展工作流命令） |
| **工作流** | 一次性创建所有产物 | 可增量创建也可一次性创建——由您自主选择 |
| **回退操作** | 僵化的阶段门控 | 自然顺畅——可随时更新任意产物 |
| **自定义能力** | 固定结构 | 基于 Schema 驱动，可完全定制 |
| **配置方式** | `CLAUDE.md` 含标记 + `project.md` | `openspec/config.yaml` 中的简洁配置 |

**理念变化：** 工作并非线性流程。OPSX 不再假装它是。

---

## 开始之前

### 现有工作不会丢失

迁移流程以保留内容为核心设计：

- **`openspec/changes/` 中的活跃变更** — 完全保留。你可以通过 OPSX 命令继续推进这些变更。
- **已归档的变更** — 不会修改。你的历史记录保持完整。
- **`openspec/specs/` 中的主规范** — 不会修改。这些是你的唯一可信来源。
- **`CLAUDE.md`、`AGENTS.md` 等文件中的你的内容** — 保留。仅删除 OpenSpec 标记块，你编写的内容全部保留。

### 哪些内容会被删除

仅删除被替换的 OpenSpec 管理文件：

| 内容 | 原因 |
|------|------|
| 旧版斜杠命令目录/文件 | 已被新的技能系统替代 |
| `openspec/AGENTS.md` | 已过时的工作流触发器 |
| `CLAUDE.md`、`AGENTS.md` 等文件中的 OpenSpec 标记 | 不再需要 |

**各工具的旧版命令位置**（示例——你使用的工具可能不同）：

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.cinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md`（仅限 IDE 扩展；不支持 Copilot CLI）
- Codex: OpenSpec 现在使用 `.codex/skills/openspec-*`；旧版清理仅针对 `$CODEX_HOME/prompts` 或 `~/.codex/prompts` 中 OpenSpec 允许列表内的提示词文件名，且仅在替换技能存在后才会删除这些文件。
- 其他工具（Augment、Continue、Amazon Q 等）

迁移过程会检测你配置的所有工具，并清理对应的旧版文件。

删除列表看起来可能很长，但这些都是 OpenSpec 最初创建的文件。你自己的内容永远不会被删除。

### 需要你手动处理的内容

有一个文件需要手动迁移：

**`openspec/project.md`** — 该文件不会被自动删除，因为它可能包含你编写的项目上下文。你需要执行以下操作：
1. 查看其内容
2. 将有用的上下文移动到 `openspec/config.yaml`（详见下方指引）
3. 准备好后删除该文件

**做出此变更的原因：**

旧版 `project.md` 是被动读取的——代理可能会读，也可能不读，甚至可能读完就忘。我们发现这种方式可靠性不稳定。

新版 `config.yaml` 中的上下文会**主动注入到每一个 OpenSpec 规划请求中**。这意味着 AI 创建产物时，你的项目规范、技术栈和规则始终存在，可靠性更高。

**权衡取舍：**

由于上下文会被注入到每个请求中，你需要尽量简洁。重点关注真正重要的内容：
- 技术栈和核心规范
- AI 需要知晓的非显而易见的约束
- 之前经常被忽略的规则

不用追求完美。我们仍在探索什么方案最有效，后续会随着实践不断优化上下文注入机制。

---

## 执行迁移

`openspec init` 和 `openspec update` 两个命令都会检测旧版文件，并引导你完成相同的清理流程。根据你的情况选择使用：
- 新安装默认使用 `core` 配置文件（包含 `propose`、`explore`、`apply`、`sync`、`archive` 命令）。
- 已迁移的安装会在需要时写入 `custom` 配置文件，保留你之前安装的工作流。

### 使用 `openspec init`

如果你想添加新工具或重新配置已设置的工具，请运行此命令：
```bash
openspec init
```

init 命令会检测旧版文件并引导你完成清理：
```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**当你选择确认时会发生以下操作：**
1. 删除旧版斜杠命令目录
2. 从 `CLAUDE.md`、`AGENTS.md` 等文件中移除 OpenSpec 标记（你的内容会保留）
3. 删除 `openspec/AGENTS.md`
4. 在 `.claude/skills/` 中安装新技能
5. 创建带有默认模式的 `openspec/config.yaml`

### 使用 `openspec update`

如果你只想迁移并刷新现有工具到最新版本，请运行此命令：
```bash
openspec update
```

update 命令同样会检测并清理旧版产物，然后刷新生成的技能/命令以匹配你当前的配置文件和交付设置。

### 非交互式 / CI 环境

对于脚本化迁移场景：
```bash
openspec init --force --tools claude
```

`--force` 参数会跳过提示，自动接受清理操作。

这包括清理全局 Codex 提示词目录中 OpenSpec 管理的 Codex 提示词文件。清理仅针对 OpenSpec 允许列表内的旧版 Codex 提示词文件名，且仅在替换用的 `.codex/skills/openspec-*` 技能存在后才会删除这些文件，同时保留所有其他文件。

---

## 将 project.md 迁移到 config.yaml

旧版 `openspec/project.md` 是用于存放项目上下文的自由格式 Markdown 文件。新版 `openspec/config.yaml` 是结构化格式，最重要的是——**会被注入到每一个规划请求中**，确保 AI 工作时你的规范始终存在。

### 迁移前（project.md）
```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### 迁移后（config.yaml）
```yaml
schema: spec-driven

context: |
  技术栈：TypeScript、React、Node.js
  测试：使用 Jest 和 React Testing Library
  API：RESTful 风格，文档存放在 docs/api.md
  所有公开 API 保持向后兼容

rules:
  proposal:
    - 高风险变更需包含回滚方案
  specs:
    - 场景使用 Given/When/Then 格式
    - 优先复用现有模式，避免重新发明轮子
  design:
    - 复杂流程需包含时序图
```

### 核心差异

| project.md | config.yaml |
|------------|-------------|
| 自由格式 Markdown | 结构化 YAML |
| 一整段文本 | 上下文和分产物的规则相互独立 |
| 使用时机不明确 | 上下文会出现在所有产物中；规则仅出现在匹配的产物中 |
| 无模式选择 | 显式的 `schema:` 字段可设置默认工作流 |

### 保留什么，舍弃什么

迁移时请保持选择性。问问自己：'AI 在*每一个*规划请求中都需要这个内容吗？'

**适合放入 `context:` 的内容**
- 技术栈（编程语言、框架、数据库）
- 核心架构模式（单体仓库、微服务等）
- 非显而易见的约束（例如“我们不能使用 X 库，因为……”）
- 经常被忽略的核心规范

**应放入 `rules:` 的内容**
- 产物专属格式要求（例如“规范中使用 Given/When/Then 格式”）
- 审核标准（例如“提案必须包含回滚方案”）
- 这类内容仅会出现在匹配的产物中，不会让其他请求过于臃肿

**完全不需要的内容**
- AI 已经知晓的通用最佳实践
- 可以精简的冗长解释
- 不影响当前工作的历史背景

### 迁移步骤

1. **创建 config.yaml**（如果 init 命令尚未自动创建）：
   ```yaml
   schema: spec-driven
   ```

2. **添加你的上下文**（尽量简洁——这部分会进入每一个请求）：
   ```yaml
   context: |
     你的项目背景写在这里。
     重点关注 AI 真正需要知晓的内容。
   ```

3. **添加分产物的规则**（可选）：
   ```yaml
   rules:
     proposal:
       - 你的提案专属指引
     specs:
       - 你的规范编写规则
   ```

4. 移动完所有有用内容后，删除 project.md。

**不用过度纠结。** 先写核心内容，后续再迭代优化。如果发现 AI 遗漏了重要内容，就补充进去；如果上下文显得臃肿，就删减内容。这是一份动态更新的文档。

### 需要帮助？使用以下提示词

如果你不确定如何精简 project.md 的内容，可以向你的 AI 助手发送以下提示：
```
我正在将 OpenSpec 旧版 project.md 迁移到新版 config.yaml 格式。

这是我当前的 project.md 内容：
[粘贴你的 project.md 内容]

请帮我创建一个 config.yaml，要求包含：
1. 简洁的 `context:` 部分（这部分会被注入到每一个规划请求中，因此要尽量精简——重点关注技术栈、核心约束和经常被忽略的规范）
2. 如果存在产物专属内容，添加对应的 `rules:` 部分（例如“使用 Given/When/Then 格式”应放在规范规则中，而非全局上下文）

省略 AI 模型已经知晓的通用内容，尽量精简。
```

AI 会帮你区分哪些是核心内容，哪些是可以删减的。

---

## 新命令

命令的可用性取决于配置文件：

**默认（`core` 配置文件）：**

| 命令 | 用途 |
|------|------|
| `/opsx:propose` | 一键创建变更并生成规划产物 |
| `/opsx:explore` | 无结构地梳理思路 |
| `/opsx:apply` | 实现 tasks.md 中的任务 |
| `/opsx:archive` | 完成并归档变更 |

**扩展工作流（自定义选择）：**

| 命令 | 用途 |
|------|------|
| `/opsx:new` | 创建新的变更脚手架 |
| `/opsx:continue` | 创建下一个产物（一次一个） |
| `/opsx:ff` | 快进模式——一次性创建所有规划产物 |
| `/opsx:verify` | 验证实现与规范是否一致 |
| `/opsx:sync` | 将增量规范合并到主规范中 |
| `/opsx:bulk-archive` | 一次性归档多个变更 |
| `/opsx:onboard` | 引导式端到端入门工作流 |

通过 `openspec config profile` 启用扩展命令，然后运行 `openspec update`。

### 旧版命令映射

| 旧版命令 | OPSX 等效命令 |
|----------|--------------|
| `/openspec:proposal` | `/opsx:propose`（默认）或 `/opsx:new` 后接 `/opsx:ff`（扩展模式） |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新能力

以下能力属于扩展工作流命令集。

**细粒度产物创建：**
```
/opsx:continue
```
基于依赖关系一次创建一个产物。当你需要逐步审核每个步骤时使用该命令。

**探索模式：**
```
/opsx:explore
```
在确定变更前，与 AI 伙伴一起梳理思路。

---

## 了解新架构

### 从阶段锁定到灵活流转

旧版工作流强制线性推进：
```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
```

OPSX 使用操作而非阶段：
```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### 依赖图

产物构成有向图。依赖是使能条件，而非限制门：
```
                        proposal
                       (root node)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requires:                  (requires:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requires:
                     specs, design)
```

当你运行 `/opsx:continue` 时，它会检查哪些产物已准备就绪，并推荐下一个可创建的产物。你也可以按任意顺序创建多个已就绪的产物。

### 技能与命令的区别

旧版系统使用工具专属的命令文件：
```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX 使用正在普及的 **技能** 标准：
```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

技能可被多种 AI 编码工具识别，且提供更丰富的元数据。

在 OPSX 中，Codex 仅支持技能模式。OpenSpec 不再生成 Codex 自定义提示词文件，请改用生成的 `.codex/skills/openspec-*` 目录。

## 继续现有变更

你正在进行的变更可与 OPSX 命令无缝配合使用。

**有来自旧工作流的进行中变更？**

```
/opsx:apply add-my-feature
```

OPSX 会读取现有产物，从你上次中断的位置继续。

**想为现有变更添加更多产物？**

```
/opsx:continue add-my-feature
```

会基于已存在的产物展示可创建的内容。

**需要查看状态？**

```bash
openspec status --change add-my-feature
```

---

## 新配置系统

### config.yaml 结构

```yaml
# 必填：新变更的默认模式
schema: spec-driven

# 可选：项目上下文（最大 50KB）
# 会注入到所有产物指令中
context: |
  你的项目背景、技术栈、
  规范与约束条件。

# 可选：产物专属规则
# 仅注入到匹配的产物中
rules:
  proposal:
    - 包含回滚方案
  specs:
    - 使用 给定/当/那么 格式
  design:
    - 记录降级策略
  tasks:
    - 拆分为最多2小时的工作块
```

### 模式解析

确定使用哪个模式时，OPSX 会按以下顺序检查：

1. **CLI 标志**：`--schema <name>`（优先级最高）
2. **变更元数据**：变更目录下的 `.openspec.yaml`
3. **项目配置**：`openspec/config.yaml`
4. **默认值**：`spec-driven`

### 可用模式

| 模式 | 产物 | 适用场景 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | 大多数项目 |

列出所有可用模式：

```bash
openspec schemas
```

### 自定义模式

创建你自己的工作流：

```bash
openspec schema init my-workflow
```

或基于现有模式分支：

```bash
openspec schema fork spec-driven my-workflow
```

详见[自定义](customization.md)文档。

---

## 故障排查

### “非交互模式下检测到旧版文件”

你正在 CI 或非交互式环境中运行。请使用：

```bash
openspec init --force
```

### 迁移后命令未显示

重启你的 IDE。技能会在启动时被检测到。

### “规则中存在未知产物 ID”

检查你的 `rules:` 键是否与所用模式的产物 ID 匹配：

- **spec-driven**：`proposal`, `specs`, `design`, `tasks`

运行以下命令查看合法的产物 ID：

```bash
openspec schemas --json
```

### 配置未生效

1. 确保文件路径为 `openspec/config.yaml`（而非 `.yml` 后缀）
2. 校验 YAML 语法
3. 配置修改会立即生效，无需重启

### project.md 未迁移

系统会特意保留 `project.md`，因为它可能包含你的自定义内容。请手动检查该文件，将有用部分迁移到 `config.yaml` 后再删除它。

### 想查看会被清理的内容？

运行 init 命令并拒绝清理提示，即可查看完整的检测摘要，不会执行任何实际修改。

---

## 快速参考

### 迁移后的文件结构

```
project/
├── openspec/
│   ├── specs/                    # 未变更
│   ├── changes/                  # 未变更
│   │   └── archive/              # 未变更
│   └── config.yaml               # 新增：项目配置
├── .claude/
│   └── skills/                   # 新增：OPSX 技能
│       ├── openspec-propose/     # 默认核心配置集
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # 扩展配置集会新增 new/continue/ff 等命令
├── CLAUDE.md                     # OpenSpec 标记已移除，你的内容保留
└── AGENTS.md                     # OpenSpec 标记已移除，你的内容保留
```

### 已移除的内容

- `.claude/commands/openspec/` — 已被 `.claude/skills/` 替代
- `openspec/AGENTS.md` — 已废弃
- `openspec/project.md` — 迁移到 `config.yaml` 后删除
- `CLAUDE.md`、`AGENTS.md` 等文件中的 OpenSpec 标记块

### 命令速查表

```text
/opsx:propose      快速启动（默认核心配置集）
/opsx:apply        执行任务
/opsx:archive      完成并归档

# 扩展工作流（若已启用）：
/opsx:new          创建变更脚手架
/opsx:continue     创建下一个产物
/opsx:ff           创建规划类产物
```

---

## 获取帮助

- **Discord**：[discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub 问题反馈**：[github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **官方文档**：[docs/opsx.md](opsx.md) 包含完整的 OPSX 参考说明