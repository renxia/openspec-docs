# Stores：在独立仓库中规划

> **Beta 版。** Stores（存储库）、references（引用）、working context（工作上下文）和 worksets（工作集）均为新功能。命令名称、标志、文件格式和 JSON 输出在不同版本间仍可能发生变动。下方所有操作步骤均基于当前构建版本运行，升级后请重新阅读本指南。

## 解决的问题

OpenSpec 通常存在于单个代码仓库中：代码旁设有 `openspec/` 文件夹，用于存储该仓库的规范与变更记录。

当你的规划范围超出单个仓库时，这种模式便不再适用：
- 你的工作横跨多个仓库——单个功能可能涉及 API 服务器、Web 应用和共享库。那么规划应该存放在哪个仓库的 `openspec/` 文件夹下？
- 你的团队可能在代码尚未创建时就开始规划，或规划的内容永远不会成为*当前*仓库的代码。
- 需求由某一团队负责，供其他团队使用。Wiki 版本容易过时，且你的编码代理根本无法读取 Wiki 内容。

**Store（存储库）** 就是解决方案：它是一个独立的仓库，唯一职责就是存放规划内容。它拥有你熟悉的 `openspec/` 目录结构——包含规范与变更记录——还附带一个轻量的身份标识文件。你只需在本地机器上按名称注册一次该仓库，之后所有常规 OpenSpec 命令都可以在任何位置针对该 Store 执行。

## 结构概览

```
            team-plans  (一个存储库：在独立仓库中进行规划)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      真实有效的规则（规格说明）
                └── changes/   进行中的变更
                      ▲
                      │ 按名称注册到每台机器上；
                      │ 像普通仓库一样通过推送/克隆共享
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

两条规则让整个模型保持简洁：

1. **存储库就是普通的 git 仓库**。你可以自行提交、推送、拉取、审查它。OpenSpec 永远不会自行克隆、同步或推送任何内容。
2. **声明，而非底层机制**。仓库可以声明自身与存储库的关联关系（如下所示）。声明只会改变 OpenSpec 能向你反馈的信息——永远不会改变你的命令的实际作用范围。

## 五分钟创建你的第一个存储库

两条命令即可从零开始创建一个可用的、限定存储库范围的变更：

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
存储库就绪：team-plans
位置：/Users/you/openspec/team-plans
OpenSpec 根目录：已就绪
注册表：已注册

下一步：针对此存储库运行常规 OpenSpec 命令，例如：
  openspec new change <change-id> --store team-plans
像普通 Git 仓库一样提交并推送该存储库即可共享。
```

```bash
openspec new change add-login --store team-plans
```

```
正在使用 OpenSpec 根目录：team-plans (/Users/you/openspec/team-plans)
已在 /Users/you/openspec/team-plans/openspec/changes/add-login/ 创建变更 'add-login'
架构：spec-driven
下一步：openspec status --change add-login --store team-plans
```

这就是完整的模型。此后生命周期和你已知的完全一致——`status`、`instructions`、`validate`、`archive`——每个命令都加上 `--store team-plans`，所有打印的提示都会为你携带该标志。`Using OpenSpec root:` 行始终会告诉你命令正在作用于何处。

## 案例：一个团队，一个规划仓库

团队将规格说明和变更统一保存在 `team-plans` 中，而非分散在各个代码仓库里。

**第一天（由负责搭建的成员执行）：**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

传入 `--remote` 参数会将克隆 URL 记录到存储库自身的身份文件（`.openspec-store/store.yaml`）中，并纳入初始提交。后续所有克隆都会自带来源信息，因此健康检查和错误提示可以输出完整的、可直接粘贴的修复方案，供尚未拉取该存储库的团队成员使用。

**每位团队成员（每台机器执行一次即可）：**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

此后，所有人都可通过名称在同一个规划仓库中协作：

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**共享工作刻意基于 Git 实现**。你创建的变更仅在本地检出中存在，直到你提交并推送它——和代码的逻辑完全一致。规划天然支持分支、拉取请求和评审流程，因为存储库就是普通的 Git 仓库。

### 关联团队的代码仓库

如果代码仓库的规划已完全外置，只需在 `openspec/config.yaml` 中添加一行配置即可：

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

现在，在 `web-app` 内运行的所有 OpenSpec 命令无需任何标志即可作用于 `team-plans`：

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
正在使用 OpenSpec 根目录：team-plans (/Users/you/openspec/team-plans)
...
```

该指针是兜底配置，永远不会覆盖显式设置：显式传入的 `--store` 优先级始终最高；如果仓库后续生成了自己的真实规划文件夹，则本地规划的优先级更高（同时会弹出警告，提示你删除过时的指针）。

### 为所有仓库设置全局默认值

如果你需要在多个代码仓库中统一使用同一个存储库进行规划，只需全局设置一次，无需为每个仓库单独添加 `store:` 配置行：

```bash
openspec config set defaultStore team-plans
```

现在，任何在规划根目录之外运行、且未传入 `--store` 和项目指针的命令，都会解析到 `team-plans`。该配置位于优先级列表的最底层，因此 `--store`、本地根目录和项目 `store:` 指针的优先级仍然更高。根目录横幅以及 JSON 输出中的 `root` 块会报告 `source: "global_default"` 及存储库 ID，因此你可以始终区分机器级默认配置和仓库自身的指针。可通过 `openspec config unset defaultStore` 清除该配置。如果 ID 未注册，命令会报错并提示你注册该存储库或清除过时的默认配置。

## 案例：跨团队的共享需求

平台团队负责维护公共需求。产品团队基于这些需求，在各自的仓库中完成自己的设计。引用（reference）可以描述这种关联关系，无需移动任何人的工作内容。

```
   platform-reqs（存储库）                 api-server（代码仓库）
   由平台团队拥有                           由产品团队拥有
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ 读取     │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   （产品团队自身的设计）  │
   │   平台侧工作              │          │ openspec/changes/        │
   │                          │          │   （产品团队自身的工作）  │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

产品团队可在其仓库的 `openspec/config.yaml` 中声明所依赖的存储库：

```yaml
references:
  - platform-reqs
```

引用是只读上下文。仓库保留自身的 `openspec/` 根目录，工作内容也保存在此处。变化在于：该仓库中的 `openspec instructions` 命令现在会包含被引用存储库的规格说明索引——每条规格说明附带一行摘要，以及精确的获取命令（`openspec show <spec-id> --type spec --store platform-reqs`）。在 `api-server` 中工作的智能体可以查找上游支付需求、引用相关规格，并在仓库自身的根目录中编写底层设计——无需任何人来回粘贴上下文。

引用可以附带克隆源，因此尚未拉取该存储库的团队成员可以获得完整的修复方案，而不是陷入死胡同：

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

### 同时打开规划和代码仓库

如果你希望同时打开规划和代码仓库，可以创建一个工作集（workset）。工作集是个人化、显式的配置：每个人可以选择自己机器上实际使用的文件夹。这些本地检出路径的任何信息都不会提交到共享规划仓库中。

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## 你可以随时查询的两个问题

**「我的配置是否健康？」** — 运行 `openspec doctor` 会以只读方式检查当前根目录及其引用的所有存储库，每个问题都会附带可直接粘贴的修复方案：

```
诊断报告

根目录
  位置：/Users/you/src/api-server
  OpenSpec 根目录：正常

引用项
  - platform-reqs：正常 (/Users/you/openspec/platform-reqs)
  - design-system：引用的存储库 'design-system' 未在此机器上注册。
    修复方案：git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system
```

**「我当前的工作范围包含什么？」** — 运行 `openspec context` 会根据 OpenSpec 声明组装工作集：包含根目录及其引用的所有存储库。

```
api-server 的工作上下文 (/Users/you/src/api-server)

OpenSpec 根目录
  api-server  /Users/you/src/api-server

引用的存储库
  platform-reqs  /Users/you/openspec/platform-reqs
    获取命令：openspec show <spec-id> --type spec --store platform-reqs
```

两者都支持通过 `--json` 参数输出供智能体使用的格式。`openspec context --code-workspace <path>` 还会额外写入一个包含所有成员的 VS Code 工作区文件——这是该命令执行的唯一写入操作。

## 工作集：一键重新打开你协作使用的所有文件夹

与上述所有功能独立：大多数人每次会话都会一起打开相同的几个文件夹——规划仓库加上两三个代码仓库。工作集正是针对这种场景的个人化、具名视图，只需一条命令即可在你选择的工具中重新打开所有文件夹。

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       三个文件夹全部在你的工具中打开
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform（在 VS Code 中打开）
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

运行 `openspec workset open platform` 会启动已保存的工具：编辑器（VS Code、Cursor）会打开一个包含所有成员的窗口并返回。第一个成员是主文件夹。你可以随时通过 `--tool <id>` 参数覆盖默认工具。

工作集刻意设计为非共享状态。它们仅存在于你的本地机器上，永远不会被提交，也不会对工作内容做任何断言——仅记录你希望一起打开的文件夹。删除工作集不会影响成员文件夹。新增工具属于配置项，而非代码：任何通过工作区文件或逐文件夹附加标志启动的工具，都可以添加到全局配置的 `openers` 键下（通过 `openspec config edit` 编辑）。

## 命令如何决定作用范围

所有常规命令解析根目录的逻辑优先级一致，顺序如下：

```
1. --store <id>          你显式指定                  → 对应存储库
2. nearest openspec/     当前目录向上遍历存在真实规划根目录 → 该仓库
   (walking up from cwd)
3. store: 指针            config.yaml 中声明了存储库   → 对应存储库
4. defaultStore          全局配置设置了机器级默认值    → 对应存储库
5. none of the above     以上都不满足
                         机器上已注册存储库？          → 报错并给出选择提示
                         无已注册存储库？             → 当前目录（经典行为）
```

`Using OpenSpec root:` 行（以及 `--json` 输出中的 `root` 块）会告诉你当前属于哪种情况。

## 已知限制

- **Beta 形态。** 本页所有内容在版本发布前都可能发生变化——包括名称、标志、文件格式、JSON 键。
- **每台机器每个存储库 ID 仅允许一个检出。** 在同一 ID 下注册第二个检出会失败，并提示你先执行 `store unregister`。
- **绝不自动同步——刻意设计。** OpenSpec 永远不会自行克隆、拉取或推送。过时的检出会显示过时的规格说明，直到你手动拉取；引用会从磁盘上的内容实时建立索引。
- **空的规划文件夹可以不存在。** 新存储库在 Git 中可能尚未包含 `openspec/changes/`、`openspec/specs/` 或 `openspec/changes/archive/` 文件夹。Beta 阶段接受这种情况；一旦常规命令在其中创建文件，这些文件夹就会出现。
- **指针仓库保持为指针。** 仅包含配置、且在 `openspec/config.yaml` 中声明了 `store: <id>` 的仓库会被视为外置规划，而非需要注册的存储库检出。如果你确实想将该仓库转换为本地存储库根目录，请先删除 `store:` 配置行。
- **部分命令仍作用于当前目录。** `view`、`templates`、`schemas` 以及已废弃的名词形式（`openspec change show` 等）仅作用于当前目录——不支持 `--store` 参数。
- **每台机器的状态是本地化的。** 存储库注册表和工作集是本地设置。你机器上的布局信息永远不会被提交到共享规划中。
- **工作集的两种启动限制。** 无法通过工作区文件或逐文件夹附加标志启动的工具，无法被添加为启动器。
- **智能体 JSON 存在已知的大小写分裂问题**（存储库族键为 snake_case，工作流族键为 camelCase）。具体说明见[代理契约](../agent-contract.md)；统一该问题将推迟到版本化发布时处理。

## 各组件存储位置

| 组件 | 存储位置 | 是否共享？ |
|---|---|---|
| 门店规划内容 | `<store>/openspec/`（规范、变更） | 是 — 提交并推送即可 |
| 门店身份标识 | `<store>/.openspec-store/store.yaml` | 是 — 随门店一同提交 |
| 门店注册表 | `<data dir>/openspec/stores/registry.yaml` | 否 — 仅本机可用 |
| 工作集 | `<data dir>/openspec/worksets/` | 否 — 仅本机可用 |

`<data dir>` 在 macOS 和 Linux 上为 `~/.local/share/openspec`（若已设置 `$XDG_DATA_HOME` 则为 `$XDG_DATA_HOME/openspec`），在 Windows 上为 `%LOCALAPPDATA%\openspec`。

## 参考

本页所有命令的精确参数及 JSON 结构请参考：[CLI 参考](../cli.md)（门店、健康检查、工作上下文、个人工作集）以及[代理规范](../agent-contract.md)。