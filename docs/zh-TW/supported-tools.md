# 支援的工具

OpenSpec 可與眾多 AI 編程助手搭配使用。當你執行 `openspec init` 時，OpenSpec 會根據你目前選取的設定檔/工作流程以及交付模式，為選定的工具進行配置。

## 運作方式

針對每個選定的工具，OpenSpec 可安裝以下項目：

1. **技能**（若交付內容包含技能）：`.../skills/openspec-*/SKILL.md`
2. **指令**（若交付內容包含指令）：工具專屬的 `opsx-*` 指令檔案

Codex 僅支援技能模式：就算交付模式設定為 `commands`，OpenSpec 仍會為 Codex 安裝 `.codex/skills/openspec-*/SKILL.md`，且不會產生 Codex 的自訂提示詞檔案。

預設情況下，OpenSpec 使用 `core` 設定檔，其中包含：
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

你可以透過 `openspec config profile` 啟用擴充工作流程（`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`），接著執行 `openspec update`。

## 工具目錄對照表

| 工具（ID） | 技能路徑模式 | 指令路徑模式 |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | 不會產生（無指令轉接器；請使用以技能為基礎的 `/openspec-*` 調用方式） |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | 不會產生（僅支援技能模式；請使用 `.codex/skills/openspec-*`） |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 不會產生（無指令轉接器；請使用以技能為基礎的 `/openspec-*` 調用方式） |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | 不會產生（無指令轉接器；請使用以技能為基礎的 `/openspec-*` 調用方式） |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | 不會產生（無指令轉接器；請使用以技能為基礎的 `/skill:openspec-*` 調用方式） |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | 不會產生（無指令轉接器；請使用以技能為基礎的 `/openspec-*` 調用方式） |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* GitHub Copilot 提示詞檔案在 IDE 擴充功能（VS Code、JetBrains、Visual Studio）中會被辨識為自訂斜線指令。Copilot CLI 目前無法直接讀取 `.github/prompts/*.prompt.md`。

\*\*\* Hermes 預設會從 `~/.hermes/skills/` 載入技能。若要使用專案本地的 OpenSpec 技能，請將專案的 `.hermes/skills/` 目錄新增至 `~/.hermes/config.yaml` 中的 `skills.external_dirs` 設定項；之後 Hermes 會提供以斜線指令形式呼叫的技能，例如 `/openspec-propose`。

## 非互動式設定

適用於 CI/CD 或指令碼設定場景，請使用 `--tools`（可選搭配 `--profile`）：

```bash
# 設定特定工具
openspec init --tools claude,cursor

# 設定所有支援的工具
openspec init --tools all

# 跳過工具設定
openspec init --tools none

# 覆寫本次 init 執行的設定檔
openspec init --profile core
```

**可用的工具 ID（`--tools`）：** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## 依工作流程而定的安裝方式

OpenSpec 會根據選取的工作流程安裝對應的工作流程產物：

- **核心設定檔（預設）：** `propose`, `explore`, `apply`, `sync`, `archive`
- **自訂選取：** 所有工作流程 ID 的任意子集：
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

換句話說，技能/指令的數量會依設定檔和交付模式而定，並非固定不變。

## 產生的技能名稱

當被設定檔/工作流程設定選取時，OpenSpec 會產生以下技能：

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

有關指令行為詳情請參閱 [Commands](commands.md)，`init`/`update` 選項說明請參閱 [CLI](cli.md)。

## 相關資源

- [CLI 參考文件](cli.md) — 終端機指令
- [指令](commands.md) — 斜線指令與技能
- [入門指南](getting-started.md) — 首次設定