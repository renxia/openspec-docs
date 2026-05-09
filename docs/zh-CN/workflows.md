# 工作流

本指南涵盖 OpenSpec 的常见工作流模式及各自的适用场景。基础设置请参阅[快速入门](getting-started.md)。命令参考请查阅[命令说明](commands.md)。

## 核心理念：行动而非阶段

传统工作流强制你经历阶段：规划、实施、然后完成。但实际工作很难整齐地归入这些框架。

OPSX 采用了不同的方式：

```text
传统（阶段锁定）：

  规划 ────────► 实施 ────────► 完成
      │                    │
      │   "无法回退"        │
      └────────────────────┘

OPSX（流动行动）：

  提案 ──► 规格 ──► 设计 ──► 任务 ──► 实施
```

**核心原则：**

- **行动而非阶段** - 命令是你可执行的操作，而非你被困住的阶段
- **依赖是使能器** - 它们展示的是可能性，而非下一步的强制要求

> **自定义：** OPSX 工作流由定义制品序列的模式驱动。关于创建自定义模式的详细信息，请参阅[自定义配置](customization.md)。

## 两种模式

### 默认快速路径（`core` 配置）

新安装默认使用 `core` 配置，提供以下命令：
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

典型流程：

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### 扩展/完整工作流（自定义选择）

如果您需要显式的脚手架和构建命令（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:bulk-archive`、`/opsx:onboard`），请通过以下方式启用：

```bash
openspec config profile
openspec update
```

## 工作流模式（扩展模式）

### 快速功能开发

当您明确要构建什么，只需执行时：

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**示例对话：**

```text
You: /opsx:new add-logout-button

AI:  已创建 openspec/changes/add-logout-button/
     准备创建：提案

You: /opsx:ff

AI:  正在创建所有规划产物...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     准备就绪，可以开始实现！

You: /opsx:apply

AI:  正在处理任务...
     ✓ 已在页眉添加登出按钮
     ✓ 已实现会话清除
     ✓ 已添加确认对话框
     所有任务完成！

You: /opsx:archive

AI:  ✓ 已合并规格说明
     ✓ 已归档变更
```

**最适合：** 中小型功能、错误修复、直接的变更。

### 探索性开发

当需求不明确或需要先调查时：

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**示例对话：**

```text
You: /opsx:explore

AI:  您想探索什么？

You: 我想改善页面加载性能，但不确定瓶颈在哪里。

AI:  让我来帮您调查...
     [分析包大小，识别慢查询，检查组件渲染模式]

     我发现了三个主要瓶颈：
     1. 大型未优化的图片
     2. ProductList 中的同步数据获取
     3. 上下文变化导致的重新渲染

     您想先解决哪个问题？

You: 我们先处理数据获取问题。

You: /opsx:new optimize-product-list-fetching

AI:  已创建变更。准备创建：提案

You: /opsx:continue

AI:  基于我们的探索创建提案...
     [撰写包含调查见解的提案]

     准备创建：规格说明、设计
     您接下来想要哪个？

You: /opsx:continue

AI:  正在创建规格说明...
```

**最适合：** 性能优化、调试、架构决策、需求不明确的情况。

### 并行变更

同时处理多个变更：

```text
变更 A: /opsx:new ──► /opsx:ff ──► /opsx:apply (进行中)
                                         │
                                    上下文切换
                                         │
变更 B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**示例对话：**

```text
You: 我正在处理 add-dark-mode，但被拉去修复一个 bug

You: /opsx:new fix-login-redirect

AI:  已创建 openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ 已创建规划产物

You: /opsx:apply

AI:  正在处理 fix-login-redirect...
     [实现修复]
     所有任务完成！

You: /opsx:archive

AI:  ✓ 已归档 fix-login-redirect

You: 让我们回到暗黑模式

You: /opsx:apply add-dark-mode

AI:  恢复 add-dark-mode...
     从任务 2.3 开始：更新页眉...
```

**最适合：** 并行工作流、紧急中断、团队协作。

当您有多个已完成的变更时，使用 `/opsx:bulk-archive`：

```text
You: /opsx:bulk-archive

AI:  找到 3 个已完成的变更：
     - add-dark-mode (所有任务完成)
     - fix-login-redirect (所有任务完成)
     - update-footer (所有任务完成)

     检查规格说明冲突...
     ⚠ add-dark-mode 和 update-footer 都涉及 specs/ui/

     检查代码库以解决...
     两个变更都已实现。将按时间顺序应用。

     归档所有 3 个变更？

You: 是

AI:  ✓ 已归档 add-dark-mode
     ✓ 已归档 fix-login-redirect
     ✓ 已归档 update-footer
     规格说明按顺序合并：add-dark-mode → update-footer
```

批量归档会检测多个变更是否涉及相同的规格说明，并通过检查实际实现来解决冲突。

### 完成变更

推荐的完成流程：

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              验证实现          如有需要则提示同步
```

#### 验证：检查您的工作

`/opsx:verify` 从三个维度验证实现是否符合您的产物：

```text
You: /opsx:verify

AI:  正在验证 add-auth...

     完整性
     ✓ tasks.md 中的所有 12 个任务都已勾选
     ✓ 规格说明中的所有需求都有对应代码
     ⚠ 场景“不活动后会话超时”未测试

     正确性
     ✓ 实现符合规格说明意图
     ✓ 场景中的边缘情况已处理
     ✓ 错误状态符合规格说明定义

     一致性
     ✓ 设计决策反映在代码结构中
     ✓ 命名约定与 design.md 一致
     ⚠ 设计提到“事件驱动”但实现使用轮询

     总结
     ─────────────────────────────
     严重问题：0
     警告：2
     准备归档：是（带警告）

     建议：
     1. 为会话超时场景添加测试
     2. 考虑按设计重构为事件驱动，或更新 design.md
```

**验证检查内容：**

| 维度 | 验证内容 |
|------|----------|
| 完整性 | 所有任务完成，所有需求已实现，场景已覆盖 |
| 正确性 | 实现符合规格说明意图，边缘情况已处理 |
| 一致性 | 设计决策反映在代码中，模式保持一致 |

验证不会阻止归档，但它会暴露您可能希望先处理的问题。

#### 归档：完成变更

`/opsx:archive` 完成变更并将其移至归档：

```text
You: /opsx:archive

AI:  正在归档 add-auth...

     产物状态：
     ✓ proposal.md 存在
     ✓ specs/ 存在
     ✓ design.md 存在
     ✓ tasks.md 存在 (12/12 任务完成)

     增量规格说明：尚未同步到主分支
     → 您想现在同步吗？

You: 是

AI:  ✓ 已将规格说明同步到 openspec/specs/auth/spec.md
     ✓ 已移至 openspec/changes/archive/2025-01-24-add-auth/

     变更归档成功。
```

如果规格说明未同步，归档会提示。它不会阻止不完整的任务，但会警告您。

## 何时使用什么

### `/opsx:ff` 与 `/opsx:continue`

| 情况 | 使用 |
|------|------|
| 需求明确，准备构建 | `/opsx:ff` |
| 探索中，想逐步审查 | `/opsx:continue` |
| 想在规格说明前迭代提案 | `/opsx:continue` |
| 时间紧迫，需要快速推进 | `/opsx:ff` |
| 复杂变更，需要控制 | `/opsx:continue` |

**经验法则：** 如果您能预先描述完整范围，使用 `/opsx:ff`。如果您是边做边摸索，使用 `/opsx:continue`。

### 何时更新与何时重新开始

一个常见问题：何时可以更新现有变更，何时应该开始新的？

**在以下情况下更新现有变更：**
- 意图相同，执行优化
- 范围缩小（先做 MVP，其余稍后）
- 基于学习的修正（代码库与预期不符）
- 基于实现发现的设计调整

**在以下情况下开始新变更：**
- 意图根本改变
- 范围爆炸式增长，变成完全不同的工作
- 原始变更可以独立标记为“完成”
- 补丁会混淆而非澄清

```text
                     ┌─────────────────────────────────────┐
                     │     这是同一项工作吗？              │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          相同意图？        >50% 重叠？      原始变更能否
          相同问题？       相同范围？        在没有这些
                 │                  │          变更的情况下“完成”？
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      是                否 是            否  否              是
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    更新              新建 更新         新建  更新            新建
```

**示例：“添加暗黑模式”**
- “还需要支持自定义主题” → 新变更（范围爆炸）
- “系统偏好检测比预期更难” → 更新（相同意图）
- “我们先发布开关，稍后添加偏好” → 更新然后归档，然后新建变更

## 最佳实践

### 保持变更专注

每个变更一个逻辑工作单元。如果您在做“添加功能 X 并重构 Y”，请考虑分成两个独立的变更。

**为什么重要：**
- 更容易审查和理解
- 更清晰的归档历史
- 可以独立发布
- 如需要，回滚更简单

### 使用 `/opsx:explore` 处理不明确的需求

在承诺一个变更之前，先探索问题空间：

```text
You: /opsx:explore

AI:  您想探索什么？

You: 我们应该如何处理 API 的速率限制？

AI:  让我调查一下您当前的设置和选项...
     [研究代码库，考虑模式]

     我看到三种可能的方法：
     1. 基于中间件（简单，按端点）
     2. 基于 Redis（可扩展，共享状态）
     3. 按用户的令牌桶（公平，复杂）

     您当前的技术栈建议使用 #1 或 #2。您的规模是多大？
```

探索可以在创建产物之前理清思路。

### 归档前验证

使用 `/opsx:verify` 检查实现是否符合产物：

```text
You: /opsx:verify

AI:  正在验证 add-dark-mode...

     ✓ tasks.md 中的所有任务都已勾选
     ✓ 规格说明中的需求都有对应代码
     ✓ 设计决策反映在实现中

     准备归档！
```

在关闭变更前捕获不匹配项。

### 清晰命名变更

好的名称使 `openspec list` 更有用：

```text
好的：                          避免：
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## 命令快速参考

如需查看完整的命令详情和选项，请参阅 [命令](commands.md)。

| 命令 | 用途 | 适用场景 |
|------|------|----------|
| `/opsx:propose` | 创建变更及规划工件 | 快速默认路径（`core` 配置） |
| `/opsx:explore` | 深入思考想法 | 需求不明确、调查研究阶段 |
| `/opsx:new` | 启动变更脚手架 | 扩展模式，显式工件控制 |
| `/opsx:continue` | 创建下一个工件 | 扩展模式，逐步创建工件 |
| `/opsx:ff` | 创建所有规划工件 | 扩展模式，范围清晰 |
| `/opsx:apply` | 实施任务 | 准备编写代码 |
| `/opsx:verify` | 验证实现 | 扩展模式，归档前 |
| `/opsx:sync` | 合并增量规格 | 扩展模式，可选 |
| `/opsx:archive` | 完成变更 | 所有工作已完成 |
| `/opsx:bulk-archive` | 归档多个变更 | 扩展模式，并行工作 |

## 后续步骤

- [命令](commands.md) - 包含选项的完整命令参考
- [概念](concepts.md) - 深入了解规格、工件和模式
- [自定义](customization.md) - 创建自定义工作流