# 支援的工具

OpenSpec 可與多種 AI 程式碼助手搭配使用。當您執行 `openspec init` 時，OpenSpec 會根據您目前選擇的設定檔/工作流程和交付模式來配置所選的工具。

## 運作方式

對於每個所選工具，OpenSpec 可以安裝：

1. **技能**（若交付內容包含技能）：`.../skills/openspec-*/SKILL.md`
2. **命令**（若交付內容包含命令）：工具專用的 `opsx-*` 命令檔案

預設情況下，OpenSpec 使用 `core` 設定檔，包含：
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

您可以透過 `openspec config profile` 啟用擴展的工作流程（`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`），然後執行 `openspec update`。

## 工具目錄參考

| 工具（ID） | 技能路徑模式 | 命令路徑模式 |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 未產生（無命令轉接器；使用基於技能的 `/openspec-*` 呼叫） |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | 未產生（無命令轉接器；使用基於技能的 `/skill:openspec-*` 呼叫） |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | 未產生（無命令轉接器；使用基於技能的 `/openspec-*` 呼叫） |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | 未產生（無命令轉接器；使用基於技能的 `/openspec-*` 呼叫） |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex 命令安裝在全域 Codex 主目錄中（若已設定則為 `$CODEX_HOME/prompts/`，否則為 `~/.codex/prompts/`），而非您的專案目錄。

\*\* GitHub Copilot 提示檔案在 IDE 擴充功能（VS Code、JetBrains、Visual Studio）中被辨識為自訂斜線命令。Copilot CLI 目前無法直接讀取 `.github/prompts/*.prompt.md`。

## 非互動式設定

若用於 CI/CD 或腳本化設定，請使用 `--tools`（以及可選的 `--profile`）：

```bash
# 配置特定工具
openspec init --tools claude,cursor

# 配置所有支援的工具
openspec init --tools all

# 跳過工具配置
openspec init --tools none

# 為此 init 執行覆寫設定檔
openspec init --profile core
```

**可用的工具 ID（`--tools`）：** `amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`codex`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`trae`、`vibe`、`windsurf`

## 依工作流程的安裝

OpenSpec 會根據所選工作流程安裝工作流程成品：

- **核心設定檔（預設）：** `propose`、`explore`、`apply`、`sync`、`archive`
- **自訂選擇：** 所有工作流程 ID 的任何子集：
  `propose`、`explore`、`new`、`continue`、`apply`、`ff`、`sync`、`archive`、`bulk-archive`、`verify`、`onboard`

換言之，技能/命令數量取決於設定檔和交付模式，並非固定不變。

## 產生的技能名稱

當被設定檔/工作流程配置選中時，OpenSpec 會產生以下技能：

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

請參閱 [命令](commands.md) 了解命令行為，以及 [CLI](cli.md) 了解 `init`/`update` 選項。

## 相關資源

- [CLI 參考](cli.md) — 終端機命令
- [命令](commands.md) — 斜線命令與技能
- [入門指南](getting-started.md) — 首次設定