# サポート対象ツール

OpenSpec は多くのAIコーディングアシスタントと連携します。`openspec init` を実行すると、OpenSpec はアクティブなプロファイル/ワークフロー選択と配信モードを使用して、選択したツールを構成します。

## 仕組み

選択したツールごとに、OpenSpec は以下をインストールできます：

1. **スキル**（配信にスキルが含まれる場合）：`.../skills/openspec-*/SKILL.md`
2. **コマンド**（配信にコマンドが含まれる場合）：ツール固有の `opsx-*` コマンドファイル

デフォルトでは、OpenSpec は `core` プロファイルを使用します。これには以下が含まれます：
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

`openspec config profile` で拡張ワークフロー（`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`）を有効にし、その後 `openspec update` を実行できます。

## ツールディレクトリリファレンス

| ツール（ID） | スキルパスパターン | コマンドパスパターン |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 生成されません（コマンドアダプターなし。スキルベースの `/openspec-*` 呼び出しを使用） |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | 生成されません（コマンドアダプターなし。スキルベースの `/skill:openspec-*` 呼び出しを使用） |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | 生成されません（コマンドアダプターなし。スキルベースの `/openspec-*` 呼び出しを使用） |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | 生成されません（コマンドアダプターなし。スキルベースの `/openspec-*` 呼び出しを使用） |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex コマンドはプロジェクトディレクトリではなく、グローバルな Codex ホーム（設定されていれば `$CODEX_HOME/prompts/`、そうでなければ `~/.codex/prompts/`）にインストールされます。

\*\* GitHub Copilot プロンプトファイルは、IDE拡張機能（VS Code、JetBrains、Visual Studio）でカスタムスラッシュコマンドとして認識されます。Copilot CLI は現在 `.github/prompts/*.prompt.md` を直接消費しません。

## 非対話型セットアップ

CI/CD やスクリプトによるセットアップには、`--tools`（およびオプションで `--profile`）を使用します：

```bash
# 特定のツールを構成
openspec init --tools claude,cursor

# サポート対象の全ツールを構成
openspec init --tools all

# ツール構成をスキップ
openspec init --tools none

# この init 実行のプロファイルを上書き
openspec init --profile core
```

**利用可能なツールID（`--tools`）：** `amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`codex`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`trae`、`vibe`、`windsurf`

## ワークフロー依存のインストール

OpenSpec は選択されたワークフローに基づいてワークフローアーティファクトをインストールします：

- **Core プロファイル（デフォルト）：** `propose`、`explore`、`apply`、`sync`、`archive`
- **カスタム選択：** 全ワークフローIDの任意のサブセット：
  `propose`、`explore`、`new`、`continue`、`apply`、`ff`、`sync`、`archive`、`bulk-archive`、`verify`、`onboard`

つまり、スキル/コマンド数はプロファイル依存および配信依存であり、固定ではありません。

## 生成されるスキル名

プロファイル/ワークフロー設定によって選択された場合、OpenSpec は以下のスキルを生成します：

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

コマンドの動作については [Commands](commands.md) を、`init`/`update` オプションについては [CLI](cli.md) を参照してください。

## 関連

- [CLI リファレンス](cli.md) — ターミナルコマンド
- [Commands](commands.md) — スラッシュコマンドとスキル
- [はじめに](getting-started.md) — 初回セットアップ