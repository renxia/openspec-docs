# 支持的工具

OpenSpec 可与多种 AI 编程助手配合使用。运行 `openspec init` 时，OpenSpec 会根据您当前选择的配置文件/工作流和交付模式来配置所选工具。

## 工作原理

对于每个选定的工具，OpenSpec 可以安装：

1. **技能**（如果交付内容包含技能）：`.../skills/openspec-*/SKILL.md`
2. **命令**（如果交付内容包含命令）：工具特定的 `opsx-*` 命令文件

默认情况下，OpenSpec 使用 `core`（核心）配置文件，其中包括：
- `propose`（提议）
- `explore`（探索）
- `apply`（应用）
- `sync`（同步）
- `archive`（归档）

您可以通过 `openspec config profile` 启用扩展工作流（`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`），然后运行 `openspec update`。

## 工具目录参考

| 工具（ID） | 技能路径模式 | 命令路径模式 |
|-----------|---------------------|----------------------|
| Amazon Q Developer（`amazon-q`） | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity（`antigravity`） | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie（`auggie`） | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell（`bob`） | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code（`claude`） | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline（`cline`） | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy（`codebuddy`） | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex（`codex`） | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode（`forgecode`） | `.forge/skills/openspec-*/SKILL.md` | 未生成（无命令适配器；使用基于技能的 `/openspec-*` 调用） |
| Continue（`continue`） | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict（`costrict`） | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush（`crush`） | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor（`cursor`） | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid（`factory`） | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI（`gemini`） | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot（`github-copilot`） | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| iFlow（`iflow`） | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie（`junie`） | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code（`kilocode`） | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi CLI（`kimi`） | `.kimi/skills/openspec-*/SKILL.md` | 未生成（无命令适配器；使用基于技能的 `/skill:openspec-*` 调用） |
| Kiro（`kiro`） | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma（`lingma`） | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe（`vibe`） | `.vibe/skills/openspec-*/SKILL.md` | 未生成（无命令适配器；使用基于技能的 `/openspec-*` 调用） |
| OpenCode（`opencode`） | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi（`pi`） | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder（`qoder`） | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code（`qwen`） | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode（`roocode`） | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae（`trae`） | `.trae/skills/openspec-*/SKILL.md` | 未生成（无命令适配器；使用基于技能的 `/openspec-*` 调用） |
| Windsurf（`windsurf`） | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex 命令安装在全局 Codex 主目录中（如果设置了 `$CODEX_HOME/prompts/` 则使用该路径，否则使用 `~/.codex/prompts/`），而非您的项目目录。

\*\* GitHub Copilot 提示文件在 IDE 扩展（VS Code、JetBrains、Visual Studio）中被识别为自定义斜杠命令。Copilot CLI 目前不直接读取 `.github/prompts/*.prompt.md`。

## 非交互式设置

对于 CI/CD 或脚本化设置，请使用 `--tools`（以及可选的 `--profile`）：

```bash
# 配置特定工具
openspec init --tools claude,cursor

# 配置所有支持的工具
openspec init --tools all

# 跳过工具配置
openspec init --tools none

# 为此 init 运行覆盖配置文件
openspec init --profile core
```

**可用的工具 ID（`--tools`）：** `amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`codex`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`trae`、`vibe`、`windsurf`

## 工作流依赖的安装

OpenSpec 根据选定的工作流安装工作流构件：

- **核心配置文件（默认）：** `propose`、`explore`、`apply`、`sync`、`archive`
- **自定义选择：** 所有工作流 ID 的任意子集：
  `propose`、`explore`、`new`、`continue`、`apply`、`ff`、`sync`、`archive`、`bulk-archive`、`verify`、`onboard`

换句话说，技能/命令的数量取决于配置文件和交付模式，而非固定不变。

## 生成的技能名称

当被配置文件/工作流配置选中时，OpenSpec 会生成以下技能：

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

有关命令行为，请参阅 [Commands](commands.md)；有关 `init`/`update` 选项，请参阅 [CLI](cli.md)。

## 相关

- [CLI 参考](cli.md) — 终端命令
- [Commands](commands.md) — 斜杠命令和技能
- [入门指南](getting-started.md) — 首次设置