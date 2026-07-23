# 支持的工具

OpenSpec 兼容多种 AI 编程助手。当你运行 `openspec init` 时，OpenSpec 会根据你当前激活的配置集/工作流选择以及交付模式，对选中的工具进行配置。

## 工作原理

对于每个选中的工具，OpenSpec 可以安装以下内容：
1. **技能（Skills）**（若交付模式包含技能）：`.../skills/openspec-*/SKILL.md`
2. **命令（Commands）**（若交付模式包含命令）：对应工具专属的 `opsx-*` 命令文件

Codex 仅支持技能模式：即便交付模式设置为 `commands`，OpenSpec 也会为 Codex 安装 `.codex/skills/openspec-*/SKILL.md`，且不会生成 Codex 的自定义提示词文件。

默认情况下，OpenSpec 使用 `core` 核心配置集，该配置包含以下工作流：
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

你可以通过 `openspec config profile` 启用扩展工作流（`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`），之后运行 `openspec update` 即可生效。

## 工具目录参考

| 工具（ID） | 技能路径规则 | 命令路径规则 |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | 不生成（无命令适配器；请使用基于技能的 `/openspec-*` 调用方式） |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | 不生成（仅支持技能模式；请使用 `.codex/skills/openspec-*`） |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 不生成（无命令适配器；请使用基于技能的 `/openspec-*` 调用方式） |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | 不生成（无命令适配器；请使用基于技能的 `/openspec-*` 调用方式） |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | 不生成（无命令适配器；请使用基于技能的 `/skill:openspec-*` 调用方式） |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | 不生成（无命令适配器；请使用基于技能的 `/openspec-*` 调用方式） |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* GitHub Copilot 提示词文件在 IDE 扩展（VS Code、JetBrains、Visual Studio）中被识别为自定义斜杠命令。Copilot CLI 目前无法直接读取 `.github/prompts/*.prompt.md` 文件。

\*\*\* Hermes 默认从 `~/.hermes/skills/` 加载技能。若要使用项目本地的 OpenSpec 技能，需将项目下的 `.hermes/skills/` 目录添加到 `~/.hermes/config.yaml` 配置文件的 `skills.external_dirs` 配置项中；之后 Hermes 会暴露这些技能，用户可通过 `/openspec-propose` 这类斜杠调用方式使用。

## 非交互式配置

针对 CI/CD 或脚本化配置场景，可使用 `--tools` 参数（也可选搭配 `--profile` 参数）：

```bash
# 配置指定工具
openspec init --tools claude,cursor

# 配置所有支持的工具
openspec init --tools all

# 跳过工具配置
openspec init --tools none

# 为本次 init 运行覆盖配置集
openspec init --profile core
```

**可用的工具 ID（`--tools` 参数）：** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## 工作流依赖型安装

OpenSpec 会根据选中的工作流安装对应的工作流产物：
- **核心配置集（默认）：** `propose`, `explore`, `apply`, `sync`, `archive`
- **自定义选择：** 所有工作流 ID 的任意子集：`propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

换言之，技能/命令的数量由配置集和交付模式共同决定，并非固定值。

## 生成的技能名称

当配置文件/工作流配置选中对应项时，OpenSpec 会生成以下技能：
- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

命令行为说明请参阅 [Commands](commands.md)，`init`/`update` 参数说明请参阅 [CLI](cli.md)。

## 相关文档
- [CLI 参考](cli.md) — 终端命令
- [命令](commands.md) — 斜杠命令与技能
- [入门指南](getting-started.md) — 首次配置