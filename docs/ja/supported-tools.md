# 対応ツール

OpenSpecは多くのAIコーディングアシスタントと連携します。`openspec init`を実行すると、OpenSpecはアクティブなプロファイル/ワークフローの選択とデリバリーモードに基づいて、選択されたツールを設定します。

## 仕組み

選択された各ツールに対して、OpenSpecは以下をインストールできます：

1. **スキル**（デリバリーにスキルが含まれる場合）：`.../skills/openspec-*/SKILL.md`
2. **コマンド**（デリバリーにコマンドが含まれる場合）：ツール固有の`opsx-*`コマンドファイル

デフォルトでは、OpenSpecは`core`プロファイルを使用します。これには以下が含まれます：
- `propose`
- `explore`
- `apply`
- `archive`

`openspec config profile`で拡張ワークフロー（`new`、`continue`、`ff`、`verify`、`sync`、`bulk-archive`、`onboard`）を有効にし、その後`openspec update`を実行することで、それらを有効にできます。

## ツールディレクトリリファレンス

| ツール (ID) | スキルパスパターン | コマンドパスパターン |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 生成されません（コマンドアダプターなし；スキルベースの`/openspec-*`呼び出しを使用） |
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
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | 生成されません（コマンドアダプターなし；スキルベースの`/openspec-*`呼び出しを使用） |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* CodexコマンドはグローバルなCodexホーム（設定されていれば`$CODEX_HOME/prompts/`、そうでなければ`~/.codex/prompts/`）にインストールされ、プロジェクトディレクトリにはインストールされません。

\*\* GitHub Copilotプロンプトファイルは、IDE拡張機能（VS Code、JetBrains、Visual Studio）でカスタムスラッシュコマンドとして認識されます。Copilot CLIは現在、`.github/prompts/*.prompt.md`を直接使用しません。

## 非対話型セットアップ

CI/CDやスクリプト化されたセットアップには、`--tools`（オプションで`--profile`）を使用します：

```bash
# 特定のツールを設定
openspec init --tools claude,cursor

# 対応するすべてのツールを設定
openspec init --tools all

# ツール設定をスキップ
openspec init --tools none

# このinit実行のプロファイルを上書き
openspec init --profile core
```

**利用可能なツールID（`--tools`）：** `amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`codex`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`forgecode`、`gemini`、`github-copilot`、`iflow`、`junie`、`kilocode`、`kiro`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`trae`、`windsurf`

## ワークフローに依存するインストール

OpenSpecは、選択されたワークフローに基づいてワークフローアーティファクトをインストールします：

- **コアプロファイル（デフォルト）：** `propose`、`explore`、`apply`、`archive`
- **カスタム選択：** すべてのワークフローIDのサブセット：
  `propose`、`explore`、`new`、`continue`、`apply`、`ff`、`sync`、`archive`、`bulk-archive`、`verify`、`onboard`

つまり、スキル/コマンドの数はプロファイルとデリバリーに依存し、固定ではありません。

## 生成されるスキル名

プロファイル/ワークフローの設定で選択されると、OpenSpecはこれらのスキルを生成します：

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

コマンドの動作については[コマンド](commands.md)を、`init`/`update`のオプションについては[CLI](cli.md)を参照してください。

## 関連項目

- [CLIリファレンス](cli.md) — ターミナルコマンド
- [コマンド](commands.md) — スラッシュコマンドとスキル
- [はじめに](getting-started.md) — 初期セットアップ