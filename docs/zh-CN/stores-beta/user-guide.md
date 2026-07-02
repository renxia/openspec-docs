# 存储库：在自己的仓库中规划

> **Beta。** Stores（存储库）、references（引用）、working context（工作上下文）和 worksets（工作集）是新的概念。命令名称、标志、文件格式和 JSON 输出可能仍会在不同版本之间发生变化。下述所有操作流程均是在当前构建上运行的，但在升级后请重新阅读本指南。

## 解决的问题

OpenSpec 通常存在于一个代码仓库中：即您的代码旁边的 `openspec/` 文件夹，其中包含该仓库的规范和变更。

当您的规划范围超过一个仓库时，这种模式就不再适用：

- 您的工作涉及多个仓库——一项功能可能同时触及 API server、Web 应用和一个共享库。那么，这个计划应该存在于哪个 `openspec/` 文件夹中？
- 您的团队在代码生成之前进行规划，或者规划了那些最终不会在 *当前* 仓库中实现的事务。
- 需求由一个团队拥有，但被其他团队消费。Wiki 版本会发生漂移，而您的编码代理也无法读取它。

**存储库（store）** 就是答案：这是一个独立的仓库，其全部职责就是规划。它具有您已知的相同 `openspec/` 结构——即规范和变更——外加一个小的身份文件。您只需在本地机器上通过名称注册一次，然后任何标准的 OpenSpec 命令就可以从任意位置在该存储库中运行。

## The shape

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

两条规则保持其简单性：

1. **存储库就是一个 git 仓库。** 你自己进行提交、推送、拉取和审查。OpenSpec 本身绝不会克隆、同步或推送任何内容。
2. **是声明，而非机制。** 仓库可以*声明*它们与存储库的关系（如下所示）。这些声明改变了 OpenSpec 能告诉你什么——但绝不改变你的命令作用于何处。

## 五分钟到你的第一个存储库

两个命令能让你从零开始拥有一个可工作的、以存储库为范围的变更：

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

这就是整个模型。从这里开始，其生命周期就是你所知道的——`status`、`instructions`、`validate`、`archive` ——在每个命令中都带上 `--store team-plans`，并且每一个打印出的提示都为你提供了旗标。`Using OpenSpec root:` 这行信息总是告诉你命令作用于何处。

## 故事：一个团队，一个规划仓库

一个团队将自己的规范和变更保存在 `team-plans` 中，而不是分散到各个代码仓库中。

**第一天（谁来设置的）：**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

传递 `--remote` 会在存储库自身的身份文件（`.openspec-store/store.yaml`）中记录克隆 URL，并在初始提交中完成。未来的每一次克隆都将知道它来自哪里，因此健康检查和错误消息可以打印出完整的、可粘贴的修复方案，供那些尚未拥有该仓库的队友使用。

**每个队友（机器上一次）：**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

从那时起，每个人都通过名称在同一个规划仓库中工作：

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**共享工作就是 Git，目的性明确。** 你创建的变更只存在于你的本地检出中，直到你提交并推送它——这和代码一样。规划可以获得分支、拉取请求和审查，因为存储库是一个普通的仓库。

**连接团队的代码仓库。** 一个需要将规划完全外部化的代码仓库，只需要在 `openspec/config.yaml` 中添加一行：

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

现在，任何在 `web-app` 内部运行的 OpenSpec 命令都作用于 `team-plans`，无需任何旗标：

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

这个指针是一个备选方案，绝不是强制性的：显式的 `--store` 始终获胜，如果仓库本身拥有真正的规划文件夹，那么这些文件夹就获胜（会附带一个移除陈旧指针的警告）。

## 故事：跨团队边界的需求

一个平台团队拥有需求。产品团队在自己的仓库中、使用自己的设计来构建它们。引用描述了这种关系，而无需移动任何人的工作。

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**产品团队在自己的仓库 `openspec/config.yaml` 中声明它所依赖的内容：**

```yaml
references:
  - platform-reqs
```

引用是只读的上下文。仓库保留自己的 `openspec/` 根目录；工作内容仍保留在那里。改变了什么？该仓库中的 `openspec instructions` 现在包含一个对被引用的存储库规范的索引——每个都附带一行摘要和精确的获取命令（`openspec show <spec-id> --type spec --store platform-reqs`）。在 `api-server` 中工作的代理可以找到上游支付需求，引用它们，并在仓库自己的根目录中编写其低级设计——而无需任何人粘贴上下文。

一个引用可以携带其克隆源，这样那些尚未拥有该存储库的队友就能得到完整的修复方案，而不是一个死胡同：

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**当你希望规划和代码同时存在时，就创建一个工作集 (workset)。** 这是个人化且明确的：每个人选择自己机器上实际工作的文件夹。关于这些本地检出路径的任何内容都不会提交到共享的规划仓库中。

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## 你可以永远问的两个问题

**“我的设置是否健康？”** — `openspec doctor` 会检查当前的根目录及其引用的存储库，只读地进行检查，并针对每个发现提供一个可粘贴的修复方案：

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**“我正在处理什么？”** — `openspec context` 会根据 OpenSpec 声明来组装工作集：即根目录和它所引用的存储库。

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

两者都支持 `--json` 选项，供代理使用。`openspec context --code-workspace <path>` 会额外写入一个包含整个集合的 VS Code 工作区文件——这是此命令唯一执行的操作。

## 工作集：重新打开你一起工作的文件夹

这与所有上述内容不同：大多数人每次会话都会同时打开少数几个文件夹——规划仓库加上两三个代码仓库。**工作集 (workset)** 是对这个内容的个人化、命名视图，通过一个命令在你的工具中重新打开它。

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

然后 `openspec workset open platform` 就会启动保存的工具：编辑器（VS Code, Cursor）会打开一个窗口，包含所有成员，然后返回。第一个成员是主导者。你可以随时使用 `--tool <id>` 来覆盖该工具。

工作集被刻意设计为*非共享状态*。它们存在于你的机器上，绝不会被提交，也不会对工作内容做出任何宣称——它们只记录你喜欢同时打开什么。移除一个成员永远不会触动其他成员的文件夹。新的工具是配置，而非代码：任何通过工作区文件或按文件夹附加旗标启动的内容都可以添加到全局配置（`openspec config edit`）中的 `openers` 键下。

## 命令如何决定作用位置

每个常规命令都以相同的方式解析其根目录，顺序如下：

```
1. --store <id>          你明确指出的        → 该存储库
2. nearest openspec/     此处存在真实的规划根目录  → 这个仓库
   (从 cwd 向上查找)
3. store: pointer        config.yaml 中声明了一个存储库  → 该存储库
4. 以上皆非         机器上注册了存储库吗？    → 错误，请选择一个
                         没有注册的存储库？    → 当前目录
                                                          (经典行为)
```

`Using OpenSpec root:` 这行信息（以及 `--json` 输出中的 `root` 块）会告诉你处于哪种情况。

## 已知限制

- **Beta 形状。** 本页面上的所有内容都可能在不同版本之间发生变化——包括名称、旗标、文件格式和 JSON 键。
- **每个存储库 ID 对应一个检出。** 在同一 ID 下注册第二个检出将会失败，并提示你先运行 `store unregister`。
- **永不同步——这是设计使然。** OpenSpec 从不克隆、拉取或推送。一个陈旧的检出会显示陈旧的规范，直到*你*进行拉取；引用是实时索引自磁盘上存在的内容。
- **某些命令保持原样。** `view`、`templates`、`schemas` 以及已弃用的名词形式（如 `openspec change show` 等）只作用于当前目录——不带 `--store` 旗标。
- **每台机器的状态都是局部的。** 存储库注册和工作集是本地设置。你的机器布局不会被提交到共享的规划中。
- **两种工作集启动方式。** 一个不能通过工作区文件或按文件夹附加旗标启动的工具，就不能作为 opener 添加进来。
- **代理 JSON 有已知的命名约定划分**（store-family 使用 snake_case，workflow-family 使用 camelCase）。这在 [agent contract](../agent-contract.md) 中有文档说明；统一它将推迟到版本化发布。

## 东西存在于何处

| 内容 | 存储位置 | 是否共享？ |
|---|---|---|
| 存储库的规划内容 | `<store>/openspec/` (specs, changes) | 是 — 进行提交并推送 |
| 存储库的身份信息 | `<store>/.openspec-store/store.yaml` | 是 — 与存储库一起提交 |
| 存储库注册表 | `<data dir>/openspec/stores/registry.yaml` | 否 — 仅此机器 |
| 工作集 | `<data dir>/openspec/worksets/` | 否 — 仅此机器 |

`<data dir>` 在 macOS 和 Linux 上是 `~/.local/share/openspec`（或设置了 `$XDG_DATA_HOME/openspec`），在 Windows 上是 `%LOCALAPPDATA%\openspec`。
## 参考

本页面上所有命令的精确旗标和 JSON 形状：[CLI reference](../cli.md)（存储库、Doctor、工作上下文、个人工作集）以及 [agent contract](../agent-contract.md)。