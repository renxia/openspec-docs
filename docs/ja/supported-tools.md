# サポート対象ツール

OpenSpecは多数のAIコーディングアシスタントと連携します。`openspec init`を実行すると、OpenSpecはアクティブなプロファイル/ワークフローの選択と配信モードに基づいて、選択したツールを設定します。

## 仕組み

選択した各ツールについて、OpenSpecは以下をインストールできます：

1. **スキル**（配信にスキルが含まれる場合）：`.../skills/openspec-*/SKILL.md`
2. **コマンド**（配信にコマンドが含まれる場合）：ツール固有の`opsx-*`コマンドファイル

Codexはスキルのみに対応しています：配信モードが`commands`に設定されている場合でも、OpenSpecはCodex用に`.codex/skills/openspec-*/SKILL.md`をインストールし、Codexのカスタムプロンプトファイルは生成しません。

デフォルトでは、OpenSpecは`core`プロファイルを使用します。これには以下が含まれます：
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

`openspec config profile`で拡張ワークフロー（`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`）を有効にし、その後`openspec update`を実行できます。

## ツールディレクトリリファレンス

| ツール（ID） | スキルパスのパターン | コマンドパスのパターン |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | 生成されません（コマンドアダプターなし；スキルベースの`/openspec-*`呼び出しを使用） |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | 生成されません（スキルのみ；`.codex/skills/openspec-*`を使用） |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 生成されません（コマンドアダプターなし；スキルベースの`/openspec-*`呼び出しを使用） |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | 生成されません（コマンドアダプターなし；スキルベースの`/openspec-*`呼び出しを使用） |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | 生成されません（コマンドアダプターなし；スキルベースの`/skill:openspec-*`呼び出しを使用） |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | 生成されません（コマンドアダプターなし；スキルベースの`/openspec-*`呼び出しを使用） |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* GitHub Copilotのプロンプトファイルは、IDE拡張機能（VS Code、JetBrains、Visual Studio）でカスタムスラッシュコマンドとして認識されます。Copilot CLIは現在、`.github/prompts/*.prompt.md`を直接読み込むことはできません。

\*\*\* Hermesはデフォルトで`~/.hermes/skills/`からスキルを読み込みます。プロジェクトローカルのOpenSpecスキルを使用するには、プロジェクトの`.hermes/skills/`ディレクトリを`~/.hermes/config.yaml`の`skills.external_dirs`に追加してください。そうすることで、Hermesは`/openspec-propose`などのユーザー向けスラッシュ呼び出しでスキルを公開します。

## 非対話型セットアップ

CI/CDやスクリプトによるセットアップでは、`--tools`（およびオプションで`--profile`）を使用します：

```bash
# 特定のツールを設定
openspec init --tools claude,cursor

# すべてのサポート対象ツールを設定
openspec init --tools all

# ツール設定をスキップ
openspec init --tools none

# このinit実行のプロファイルを上書き
openspec init --profile core
```

**利用可能なツールID（`--tools`）：** `amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`codeartsagent`、`codex`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`hermes`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`vibe`、`oh-my-pi`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`trae`、`windsurf`、`zcode`

## ワークフロー依存のインストール

OpenSpecは、選択したワークフローに基づいてワークフローアーティファクトをインストールします：

- **コアプロファイル（デフォルト）：** `propose`、`explore`、`apply`、`sync`、`archive`
- **カスタム選択：** すべてのワークフローIDの任意のサブセット：
  `propose`、`explore`、`new`、`continue`、`apply`、`ff`、`sync`、`archive`、`bulk-archive`、`verify`、`onboard`

つまり、スキル/コマンドの数はプロファイルと配信モードに依存し、固定されていません。

## 生成されるスキル名

プロファイル/ワークフロー設定で選択された場合、OpenSpecは以下のスキルを生成します：

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

コマンドの動作については[Commands](commands.md)、`init`/`update`オプションについては[CLI](cli.md)を参照してください。

## 関連

- [CLI Reference](cli.md) — ターミナルコマンド
- [Commands](commands.md) — スラッシュコマンドとスキル
- [Getting Started](getting-started.md) — 初回セットアップ