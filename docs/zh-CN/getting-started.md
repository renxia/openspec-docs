# 快速入门

本指南介绍在安装和初始化 OpenSpec 后，它是如何工作的。有关安装说明，请参阅[主 README](index.md#quick-start)。

## 工作原理

OpenSpec 帮助您和您的 AI 编程助手在编写任何代码之前，就构建内容达成一致。

**默认快速路径（核心配置文件）：**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**扩展路径（自定义工作流选择）：**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

默认的全局配置文件是 `core`，它包含 `propose`、`explore`、`apply`、`sync` 和 `archive`。您可以通过 `openspec config profile` 然后 `openspec update` 来启用扩展的工作流命令。

## OpenSpec 创建的内容

运行 `openspec init` 后，您的项目将具有以下结构：

```
openspec/
├── specs/              # 真实来源（您系统的行为）
│   └── <domain>/
│       └── spec.md
├── changes/            # 提议的更新（每个变更一个文件夹）
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # 增量规范（正在变更的内容）
│           └── <domain>/
│               └── spec.md
└── config.yaml         # 项目配置（可选）
```

**两个关键目录：**

- **`specs/`** - 真实来源。这些规范描述了您系统当前的行为。按领域组织（例如，`specs/auth/`、`specs/payments/`）。

- **`changes/`** - 提议的修改。每个变更都有自己的文件夹，包含所有相关工件。当一个变更完成时，其规范会合并到主 `specs/` 目录中。

## 理解工件

每个变更文件夹都包含指导工作的工件：

| 工件 | 用途 |
|----------|---------|
| `proposal.md` | "为什么"和"是什么" - 记录意图、范围和方法 |
| `specs/` | 显示新增/修改/删除需求的增量规范 |
| `design.md` | "如何做" - 技术方法和架构决策 |
| `tasks.md` | 带复选框的实施清单 |

**工件相互构建：**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            随着了解深入而更新
```

您随时可以回头完善早期的工件，因为您在实施过程中会了解更多。

## 增量规范如何工作

增量规范是 OpenSpec 中的关键概念。它们显示相对于您当前规范正在发生的变化。

### 格式

增量规范使用章节来表示变更类型：

```markdown
# Auth 的增量规范

## 新增需求

### 需求：双因素认证
系统必须在登录时要求第二个因素。

#### 场景：需要 OTP
- 假设一个启用了 2FA 的用户
- 当用户提交有效凭据时
- 那么将呈现 OTP 挑战

## 修改需求

### 需求：会话超时
系统应在 30 分钟不活动后使会话过期。
（之前：60 分钟）

#### 场景：空闲超时
- 假设一个已认证的会话
- 当 30 分钟过去且没有活动时
- 那么该会话将被失效

## 删除需求

### 需求：记住我
（已弃用，改用 2FA）
```

### 归档时会发生什么

当您归档一个变更时：

1. **新增**的需求将追加到主规范中
2. **修改**的需求将替换现有版本
3. **删除**的需求将从主规范中删除

变更文件夹将移动到 `openspec/changes/archive/` 以供审计历史记录。

## 示例：您的第一个变更

让我们逐步完成为应用程序添加深色模式的过程。

### 1. 开始变更（默认）

```text
You: /opsx:propose add-dark-mode

AI:  已创建 openspec/changes/add-dark-mode/
     ✓ proposal.md — 我们为什么做这个，正在改变什么
     ✓ specs/       — 需求和场景
     ✓ design.md    — 技术方法
     ✓ tasks.md     — 实施清单
     准备好进行实施！
```

如果您启用了扩展的工作流配置文件，您也可以分两步完成：`/opsx:new` 然后 `/opsx:ff`（或 `/opsx:continue` 逐步进行）。

### 2. 创建了什么

**proposal.md** - 记录意图：

```markdown
# 提案：添加深色模式

## 意图
用户请求添加深色模式选项，以减少夜间使用时的眼睛疲劳。

## 范围
- 在设置中添加主题切换
- 支持系统偏好检测
- 在 localStorage 中持久化偏好

## 方法
使用 CSS 自定义属性进行主题设置，并使用 React 上下文进行状态管理。
```

**specs/ui/spec.md** - 显示新需求的增量规范：

```markdown
# UI 的增量规范

## 新增需求

### 需求：主题选择
系统应允许用户在浅色和深色主题之间进行选择。

#### 场景：手动切换
- 假设一个在任何页面上的用户
- 当用户点击主题切换时
- 那么主题立即切换
- 并且该偏好在会话间持久化

#### 场景：系统偏好
- 假设一个没有保存偏好的用户
- 当应用程序加载时
- 那么将使用系统的首选配色方案
```

**tasks.md** - 实施清单：

```markdown
# 任务

## 1. 主题基础设施
- [ ] 1.1 创建具有浅色/深色状态的 ThemeContext
- [ ] 1.2 为颜色添加 CSS 自定义属性
- [ ] 1.3 实现 localStorage 持久化

## 2. UI 组件
- [ ] 2.1 创建 ThemeToggle 组件
- [ ] 2.2 将切换添加到设置页面
- [ ] 2.3 更新 Header 以包含快速切换

## 3. 样式
- [ ] 3.1 定义深色主题调色板
- [ ] 3.2 更新组件以使用 CSS 变量
```

### 3. 实施

```
You: /opsx:apply

AI:  正在处理任务...
     ✓ 1.1 已创建具有浅色/深色状态的 ThemeContext
     ✓ 1.2 已将 CSS 自定义属性添加到 globals.css
     ✓ 1.3 已实现 localStorage 持久化
     ✓ 2.1 已创建 ThemeToggle 组件
     ...
     所有任务完成！
```

在实施过程中，如果您发现设计需要调整，只需更新工件并继续即可。

### 4. 归档

```
You: /opsx:archive

AI:  正在归档 add-dark-mode...
     ✓ 已将规范合并到 openspec/specs/ui/spec.md
     ✓ 已移动到 openspec/changes/archive/2025-01-24-add-dark-mode/
     完成！准备好进行下一个功能。
```

您的增量规范现在已成为主规范的一部分，记录了您的系统如何工作。

## 验证和审查

使用 CLI 检查您的变更：

```bash
# 列出活动变更
openspec list

# 查看变更详情
openspec show add-dark-mode

# 验证规范格式
openspec validate add-dark-mode

# 交互式仪表板
openspec view
```

## 后续步骤

- [工作流](workflows.md) - 常见模式以及何时使用每个命令
- [命令](commands.md) - 所有斜杠命令的完整参考
- [概念](concepts.md) - 更深入地理解规范、变更和模式
- [自定义](customization.md) - 让 OpenSpec 按您的方式工作