# 故障排除

针对具体问题的解决方案。每个条目都列出了一个症状，用一句话解释了可能的原因，并提供了修复方法。如果您没有在这里找到您的问题，[FAQ](faq.md) 可能有所帮助，而 [Discord](https://discord.gg/YctCnvvshC) 肯定会有帮助。

## 安装和设置

### `openspec: command not found`

CLI 未安装，或者您的 shell 找不到它。请全局安装并检查：

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

如果已安装但仍然找不到，则可能是您的全局 npm bin 目录不在 `PATH` 中。运行 `npm bin -g` 查看全局二进制文件的位置，并确保该路径包含在您的 shell 配置文件中。

### "Requires Node.js 20.19.0 or higher"

OpenSpec 在 Node 20.19.0+ 上运行。请检查您的版本，如果需要则升级：

```bash
node --version
```

如果您使用 bun 来安装 OpenSpec，请注意 OpenSpec 仍然在 Node 上*运行*，因此无论如何，您都需要确保 `PATH` 中有 Node 20.19.0+ 可用。请参阅 [Installation](installation.md)。

### `openspec init` 没有配置我的 AI 工具

Init 会询问需要设置哪些工具。如果您跳过了某个工具或想添加另一个，只需再次运行它，或者使用非交互式形式：

```bash
openspec init --tools claude,cursor
```

完整的工具 ID 列表请参考 [Supported Tools](supported-tools.md)。使用 `--tools all` 代表所有，使用 `--tools none` 跳过工具设置。

## 命令未显示

如果 `/opsx:propose`（或您工具的等效命令）没有出现或没有任何反应，请按以下列表逐一排查。它们是按照从最快检查到需要更多时间来检查的顺序排列的。

1. **您可能在错误的位置。** 斜杠命令属于您的 AI 助手聊天框，而不是终端。如果您将 `/opsx:propose` 输入到 shell 中，那就是问题所在。请参阅 [How Commands Work](how-commands-work.md)。

2. **重新生成文件。** 在项目根目录执行：

   ```bash
   openspec update
   ```

   这会为所有已配置的工具重写技能和命令文件。

3. **重启您的助手。** 大多数工具会在启动时扫描技能和命令。打开一个新的窗口通常可以完成此操作。

4. **确认文件存在。** 对于 Claude Code，请检查 `.claude/skills/` 中是否包含 `openspec-*` 文件夹。其他工具使用自己的目录，所有这些信息都在 [Supported Tools](supported-tools.md) 中列出。

5. **确认您初始化了此项目。** 技能是针对每个项目的编写的。如果您克隆了一个仓库或切换了文件夹，请在该位置运行 `openspec init`（或 `openspec update`）。

6. **确认您的工具支持命令文件。** 少数工具（Kimi CLI, Trae, ForgeCode, Mistral Vibe）不会生成 `opsx-*` 命令文件；它们使用基于技能的调用。不同工具的形式有所不同：请参阅 [Supported Tools](supported-tools.md) 和 [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool)。

## 处理更改

### "Change not found"（未找到更改）

命令无法告诉您指的是哪个更改。请明确命名它，或者检查一下当前有哪些：

```bash
openspec list                    # 查看活动的更改
/opsx:apply add-dark-mode        # 在聊天中命名更改
```

同时确认您在正确的项目目录中。

### "No artifacts ready"（没有工件准备就绪）

每个工件要么已经创建，要么正在等待某个依赖项而处于阻塞状态。请查看哪些内容正在阻塞：

```bash
openspec status --change <name>
```

然后先创建缺失的依赖项。记住顺序：提案 (proposal) 启用规范 (specs) 和设计 (design)；规范和设计共同启用任务 (tasks)。

### `openspec validate` 报告警告或错误

验证会检查您的规范和更改是否存在结构性问题。请阅读消息：它会指出文件和问题所在。

```bash
openspec validate <name>           # 验证一个项目
openspec validate --all            # 验证所有内容
openspec validate --all --strict   # 更严格的检查，适用于 CI
```

常见的原因是缺少必需的部分（例如没有场景的规范）或 delta header 格式错误。请修复文件并重新运行。[CLI reference](cli.md#openspec-validate) 记录了输出格式。

### AI 创建了不完整或错误的工件

AI 没有足够的上下文。以下几点可以提供帮助：

*   在 `openspec/config.yaml` 中添加项目上下文，以便将您的技术栈和约定注入到每一次请求中。请参阅 [Customization](customization.md#project-configuration)。
*   为每个工件添加 `rules:` 以提供仅适用于特定部分（例如规范）的指导。
*   在您提出需求时提供更详细的描述。
*   使用扩展的 `/opsx:continue`，一次创建一个工件并进行审查，而不是让 `/opsx:ff` 一次性完成所有工作。

### Archive 无法完成或警告任务不完整

Archive 不会因为任务不完整而*阻塞*，但它会发出警告，因为存档通常意味着工作已经完成。如果任务是故意保留的（您正在提交部分更改），请继续进行操作。否则，请先完成这些任务。如果您尚未同步 delta 规范，Archive 也会提供将您的 delta 规范同步到主规范的功能；除非有理由不这样做，否则请选择“是”。

## 配置

### 我的 `config.yaml` 没有被应用

三个常见嫌疑对象：

1. **文件名错误。** 它必须是 `openspec/config.yaml`，而不是 `.yml`。
2. **YAML 无效。** 运行它通过任何 YAML 验证器；CLI 也会报告带有行号的语法错误。
3. **您期望重启。** 您不需要重启。配置更改会立即生效。

### "Unknown artifact ID in rules: X"（规则中的未知工件 ID: X）

`rules:` 下的一个键与您的 schema 中任何工件都不匹配。对于默认的 `spec-driven` schema，有效的 ID 是 `proposal`, `specs`, `design`, `tasks`。要查看任何 schema 的 ID，请运行：

```bash
openspec schemas --json
```

### "Context too large"（上下文过大）

`context:` 字段被限制在 50KB，这是故意的，因为它会被注入到每一次请求中。请进行总结，或者提供链接指向更长的文档，而不是直接粘贴内容。精简的上下文也能产生更好、更快的结果。

### "Schema not found"（未找到 Schema）

您引用的 schema 名称不存在。请列出所有可用的 schema 并检查拼写：

```bash
openspec schemas                    # 列出可用 schema
openspec schema which <name>        # 查看一个 schema 从何处解析而来
openspec schema init <name>         # 创建一个自定义的 schema
```

请参阅 [Customization](customization.md#custom-schemas)。

## 从旧版工作流程迁移

### "Legacy files detected in non-interactive mode"（在非交互模式下检测到旧文件）

您正在 CI 或非交互式 shell 中运行，OpenSpec 找到了需要清理的旧文件，但无法提示您。请自动批准：

```bash
openspec init --force
```

### 迁移后命令未出现

重启您的 IDE。技能会在启动时被检测到。如果它们仍然没有出现，请运行 `openspec update` 并参考 [Supported Tools](supported-tools.md) 中的文件位置进行检查。

### 我的旧版 `project.md` 没有被迁移

这是故意的。OpenSpec 不会自动删除 `project.md`，因为它可能包含您编写的上下文信息。请将有用的部分移动到 `config.yaml` 的 `context:` 部分中，然后自己删除它。[Migration Guide](migration-guide.md#migrating-projectmd-to-configyaml) 会逐步指导这一过程，其中也包括一个您可以交给 AI 进行提炼的提示。

## 仍然卡住？

*   **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
*   **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
*   **从您的终端运行：** `openspec feedback "what went wrong"` 会为您创建一个 Issue。

当您报告问题时，请包括您的 OpenSpec 版本（`openspec --version`）、您的 Node 版本（`node --version`）、您的 AI 工具以及确切的命令和输出。这能让帮助过程快得多。