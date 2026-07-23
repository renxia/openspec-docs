# 故障排除

针对具体问题的具体解决方案。每个条目会说明故障现象、用一句话解释可能的原因，并给出修复方法。如果你在这里没找到对应的问题，[常见问题解答（FAQ）](faq.md) 可能会帮到你，[Discord 社区](https://discord.gg/YctCnvvshC) 则一定能提供帮助。

## 安装与配置

### `openspec: command not found`

CLI 工具未安装，或者你的 shell 无法找到该命令。请全局安装后检查：

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

如果已经安装但仍然找不到，说明全局 npm 可执行文件目录没有加入你的 `PATH` 环境变量。运行 `npm bin -g` 查看全局可执行文件的存放路径，并确保该路径已添加到你的 shell 配置文件中。

### "Requires Node.js 20.19.0 or higher"

OpenSpec 需要 Node.js 20.19.0 及以上版本才能运行。请检查你的 Node 版本，必要时升级：

```bash
node --version
```

如果你使用 bun 安装 OpenSpec，请注意 OpenSpec 仍然*基于 Node.js 运行*，因此无论使用哪种安装方式，你的 `PATH` 中都必须有 Node.js 20.19.0+ 版本。详见[安装指南](installation.md)。

### `openspec init` 未配置我的 AI 工具

初始化命令会询问你要配置哪些工具。如果你跳过了对应工具的配置，或者想要新增其他工具，只需重新运行该命令，或者使用非交互式模式：

```bash
openspec init --tools claude,cursor
```

完整的工具 ID 列表见[支持的工具](supported-tools.md)。使用 `--tools all` 可配置所有工具，使用 `--tools none` 可跳过所有工具配置。

## 命令未显示

如果 `/opsx:propose`（或你所用工具的对应命令）没有出现，或者执行后无响应，请按以下列表逐项排查。列表按检查速度从快到慢排序：

1. **你可能在错误的位置使用了命令。** 斜杠命令需要在 AI 助手的聊天界面中使用，而非终端。如果你在 shell 中输入了 `/opsx:propose`，这就是问题所在。详见[命令工作原理](how-commands-work.md)。
2. **重新生成相关文件。** 在项目根目录下运行：
   ```bash
   openspec update
   ```
   该命令会为你配置过的所有工具重写技能和命令文件。
3. **重启你的 AI 助手。** 大多数工具会在启动时扫描技能和命令，打开新的窗口通常就能解决问题。
4. **确认文件存在。** 对于 Claude Code，请检查 `.claude/skills/` 目录下是否存在 `openspec-*` 开头的文件夹。其他工具使用各自的专属目录，完整列表见[支持的工具](supported-tools.md)。
5. **确认你已初始化当前项目。** 技能是按项目单独生成的。如果你克隆了仓库或者切换了文件夹，需要在对应目录下运行 `openspec init`（或 `openspec update`）。
6. **确认你使用的工具支持命令文件。** Codex 和其他部分工具（CodeArts、Kimi CLI、ForgeCode、Mistral Vibe）不会生成 `opsx-*` 开头的命令文件，而是使用基于技能的调用方式。对于 Codex，请检查 `.codex/skills/openspec-*` 目录。不同工具的调用方式不同，详见[支持的工具](supported-tools.md)和[命令工作原理](how-commands-work.md#slash-command-syntax-by-tool)。

## 变更相关操作

### "Change not found"

命令无法识别你提到的变更。请明确指定变更名称，或者先查看已有的变更：

```bash
openspec list                    # 查看所有活跃变更
/opsx:apply add-dark-mode        # 在聊天中明确指定变更名称
```

同时请确认你当前处于正确的项目目录下。

### "No artifacts ready"

每个产物要么已经创建完成，要么因为依赖未就绪而被阻塞。请查看阻塞原因：

```bash
openspec status --change <name>
```

请先创建缺失的依赖项。注意顺序：提案（proposal）是规格说明（specs）和设计（design）的前提；规格说明和设计共同是任务（tasks）的前提。

### `openspec validate` 报告警告或错误

校验功能会检查你的规格说明和变更是否存在结构问题。请阅读报错信息，它会指出问题所在的文件和具体问题。

```bash
openspec validate <name>           # 校验单个条目
openspec validate --all            # 校验所有条目
openspec validate --all --strict   # 更严格的校验规则，适合 CI 场景使用
```

常见原因包括缺少必填章节（比如规格说明没有场景部分）或者变更头格式错误。修复文件后重新运行即可。输出格式详见[CLI 参考文档](cli.md#openspec-validate)。

### AI 生成的产物不完整或错误

AI 没有获取到足够的上下文信息，可以通过以下几个方式优化：
- 在 `openspec/config.yaml` 中添加项目上下文，这样你的技术栈和规范约定会被注入到每一次请求中。详见[自定义配置](customization.md#project-configuration)。
- 为不同产物添加 `rules:` 规则，提供仅针对特定产物（比如规格说明）的指导。
- 发起变更提案时提供更详细的描述。
- 使用扩展版的 `/opsx:continue` 命令逐个生成产物并逐一审核，而不是使用 `/opsx:ff` 一次性生成所有产物。

### 归档无法完成，或提示任务未完成

归档操作不会因为未完成的任务而阻塞，但会发出警告，因为归档通常意味着相关工作已经完成。如果任务未完成是刻意为之（比如你正在提交部分变更），可以继续操作。否则请先完成所有任务。如果你还没有同步增量规格说明到主规格说明，归档操作还会提示你进行同步；除非有特殊理由，否则建议选择同意。

## 配置相关

### 我的 `config.yaml` 配置未生效

通常有以下三个原因：
1. **文件名错误。** 配置文件必须命名为 `openspec/config.yaml`，不能是 `.yml` 后缀。
2. **YAML 格式错误。** 可以用任意 YAML 校验工具检查文件；CLI 也会报告带行号的语法错误。
3. **你以为需要重启。** 不需要。配置修改会立即生效。

### "Unknown artifact ID in rules: X"

`rules:` 下的某个键与你的 schema 中的任何产物 ID 都不匹配。对于默认的 `spec-driven` schema，合法的 ID 为 `proposal`、`specs`、`design`、`tasks`。查看任意 schema 的合法 ID 可运行：

```bash
openspec schemas --json
```

### "Context too large"

`context:` 字段被有意限制为最大 50KB，因为它会被注入到每一次请求中。请对内容做摘要，或者链接到更长的文档，不要直接粘贴完整内容。精简的上下文也能生成质量更高、速度更快的结果。

### "Schema not found"

你引用的 schema 名称不存在。请先查看可用的 schema 列表，检查拼写是否正确：

```bash
openspec schemas                    # 列出所有可用的 schema
openspec schema which <name>        # 查看某个 schema 的解析来源
openspec schema init <name>         # 创建自定义 schema
```

详见[自定义配置](customization.md#custom-schemas)。

## 从旧版工作流迁移

### "Legacy files detected in non-interactive mode"

你当前处于 CI 环境或非交互式 shell 中，OpenSpec 检测到需要清理的旧文件，但无法向你发起交互式确认。可以自动批准清理：

```bash
openspec init --force
```

对于 Codex，OpenSpec 可能会检测到 `$CODEX_HOME/prompts` 或 `~/.codex/prompts` 目录下的旧版托管提示词文件。该清理操作仅针对 OpenSpec 允许列表中的旧版 Codex 提示词文件名；非交互式 `openspec init` 只会删除已有对应替代文件（即 `.codex/skills/openspec-*` 开头的技能文件）的旧文件；非交互式 `openspec update` 不会执行任何旧版文件清理，除非你传入 `--force` 参数。

### 迁移后命令未显示

重启你的 IDE。技能会在启动时被检测到。如果重启后仍然没有出现，请运行 `openspec update`，并查看[支持的工具](supported-tools.md)中的文件路径说明。

### 我的旧版 `project.md` 未被迁移

这是刻意设计的。OpenSpec 永远不会自动删除 `project.md`，因为它可能包含你手动写入的上下文信息。请将其中有用的部分移动到 `config.yaml` 的 `context:` 配置节中，之后自行删除该文件。[迁移指南](migration-guide.md#migrating-projectmd-to-configyaml) 会带你完成整个流程，其中还包含可以直接交给 AI 执行内容提炼的提示词。

## 仍然遇到问题？

- **Discord 社区：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **从终端提交反馈：** 运行 `openspec feedback "what went wrong"` 即可自动为你创建 Issue。

提交问题报告时，请附上你的 OpenSpec 版本（运行 `openspec --version` 获取）、Node 版本（运行 `node --version` 获取）、使用的 AI 工具，以及具体的命令和输出结果。这能大幅提升问题解决效率。