# CLIリファレンス

OpenSpec CLI (`openspec`) は、プロジェクトのセットアップ、検証、状態の確認、管理のためのターミナルコマンドを提供します。これらのコマンドは、[コマンド](commands.md) で説明されているAIスラッシュコマンド（`/opsx:propose` など）を補完するものです。

## 概要

| カテゴリ | コマンド | 目的 |
|----------|----------|---------|
| **セットアップ** | `init`, `update` | プロジェクトでOpenSpecを初期化および更新する |
| **ワークスペース (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | リンクされたリポジトリまたはフォルダ間で計画をセットアップする |
| **参照** | `list`, `view`, `show` | 変更と仕様を探索する |
| **検証** | `validate` | 変更と仕様の問題をチェックする |
| **ライフサイクル** | `archive` | 完了した変更を確定する |
| **ワークフロー** | `status`, `instructions`, `templates`, `schemas` | アーティファクト主導のワークフローをサポートする |
| **スキーマ** | `schema init`, `schema fork`, `schema validate`, `schema which` | カスタムワークフローを作成および管理する |
| **設定** | `config` | 設定を表示および変更する |
| **ユーティリティ** | `feedback`, `completion` | フィードバックとシェル統合 |

---

## 人間 vs エージェントコマンド

ほとんどのCLIコマンドは、ターミナルでの**人間の使用**を目的として設計されています。一部のコマンドは、JSON出力を介した**エージェント/スクリプトの使用**もサポートしています。

### 人間専用コマンド

これらのコマンドは対話型で、ターミナルでの使用を目的としています：

| コマンド | 用途 |
|---------|---------|
| `openspec init` | プロジェクトの初期化（対話型プロンプト） |
| `openspec view` | 対話型ダッシュボード |
| `openspec config edit` | エディタで設定を開く |
| `openspec feedback` | GitHub経由でフィードバックを送信 |
| `openspec completion install` | シェル補完をインストール |

### エージェント対応コマンド

これらのコマンドは、AIエージェントやスクリプトによるプログラム的使用のために`--json`出力をサポートしています：

| コマンド | 人間の使用 | エージェントの使用 |
|---------|-----------|-----------|
| `openspec list` | 変更/仕様を閲覧 | `--json`で構造化データを取得 |
| `openspec show <item>` | コンテンツを読み取り | `--json`で解析用データを取得 |
| `openspec validate` | 問題をチェック | `--all --json`で一括検証 |
| `openspec status` | アーティファクトの進捗を確認 | `--json`で構造化されたステータスを取得 |
| `openspec instructions` | 次のステップを取得 | `--json`でエージェント指示を取得 |
| `openspec templates` | テンプレートパスを検索 | `--json`でパス解決 |
| `openspec schemas` | 利用可能なスキーマを一覧表示 | `--json`でスキーマ検出 |
| `openspec workspace setup --no-interactive` | 明示的な入力でワークスペースを作成 | `--json`で構造化されたセットアップ出力を取得 |
| `openspec workspace list` | 既知のワークスペースを閲覧 | `--json`で型付きワークスペースオブジェクトを取得 |
| `openspec workspace link` | リポジトリまたはフォルダをリンク | `--json`で構造化されたリンク出力を取得 |
| `openspec workspace relink` | リンクされたパスを修復 | `--json`で構造化されたリンク出力を取得 |
| `openspec workspace doctor` | 1つのワークスペースをチェック | `--json`で構造化されたステータス出力を取得 |

---

## グローバルオプション

これらのオプションはすべてのコマンドで動作します：

| オプション | 説明 |
|--------|-------------|
| `--version`, `-V` | バージョン番号を表示 |
| `--no-color` | カラー出力を無効にする |
| `--help`, `-h` | コマンドのヘルプを表示 |

---

## セットアップコマンド

### `openspec init`

プロジェクトでOpenSpecを初期化します。フォルダ構造を作成し、AIツール統合を設定します。

デフォルトの動作では、グローバル設定のデフォルト値を使用します：プロファイル`core`、デリバリー`both`、ワークフロー`propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `path` | いいえ | ターゲットディレクトリ（デフォルト：カレントディレクトリ） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--tools <list>` | 非対話的にAIツールを設定。`all`、`none`、またはカンマ区切りリストを使用 |
| `--force` | プロンプトなしでレガシーファイルを自動クリーンアップ |
| `--profile <profile>` | このinit実行時のグローバルプロファイルをオーバーライド（`core`または`custom`） |

`--profile custom`は、グローバル設定（`openspec config profile`）で現在選択されているワークフローを使用します。

**サポートされるツールID（`--tools`）：** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**例：**

```bash
# 対話型初期化
openspec init

# 特定のディレクトリで初期化
openspec init ./my-project

# 非対話型：ClaudeとCursor用に設定
openspec init --tools claude,cursor

# すべてのサポート対象ツール用に設定
openspec init --tools all

# この実行時のプロファイルをオーバーライド
openspec init --profile core

# プロンプトをスキップし、レガシーファイルを自動クリーンアップ
openspec init --force
```

**作成される内容：**

```
openspec/
├── specs/              # 仕様（信頼できるソース）
├── changes/            # 提案された変更
└── config.yaml         # プロジェクト設定

.claude/skills/         # Claude Codeスキル（claudeが選択された場合）
.cursor/skills/         # Cursorスキル（cursorが選択された場合）
.cursor/commands/       # Cursor OPSXコマンド（デリバリーにコマンドが含まれる場合）
... (他のツール設定)
```

---

### `openspec update`

CLIのアップグレード後、OpenSpec指示ファイルを更新します。現在のグローバルプロファイル、選択されたワークフロー、およびデリバリー モードを使用して、AIツール設定ファイルを再生成します。

```
openspec update [path] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `path` | いいえ | ターゲットディレクトリ（デフォルト：カレントディレクトリ） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--force` | ファイルが最新の場合でも強制的に更新 |

**例：**

```bash
# npmアップグレード後に指示ファイルを更新
npm update @fission-ai/openspec
openspec update
```

---

## ワークスペースコマンド

ワークスペースコマンドは現在開発中であり、まだ使用する準備ができていません。このコマンド表面に基づいて外部自動化、統合、または長期間のワークフローを構築しないでください。コマンドの動作、状態ファイル、およびJSON出力はいつでも変更される可能性があります。

調整ワークスペースは、複数のリポジトリまたはフォルダにまたがる作業の計画ホームです。ワークスペースの可視性は変更のコミットメントではありません。OpenSpecが知るべきリポジトリまたはフォルダをリンクし、特定の作業を計画する準備ができたら変更を作成してください。

### `openspec workspace setup`

標準のOpenSpecワークスペースの場所にワークスペースを作成し、少なくとも1つの既存のリポジトリまたはフォルダをリンクします。

```bash
openspec workspace setup [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--name <name>` | ワークスペース名。名前はケバブケースでなければなりません |
| `--link <path>` | 既存のリポジトリまたはフォルダをリンクし、フォルダ名からリンク名を推測 |
| `--link <name>=<path>` | 明示的なリンク名で既存のリポジトリまたはフォルダをリンク |
| `--opener <id>` | 非対話型セットアップ中に優先オープナーを保存：`codex`、`claude`、`github-copilot`、または`editor` |
| `--no-interactive` | プロンプトを無効にする；`--name`と少なくとも1つの`--link`が必要 |
| `--json` | JSONを出力；`--no-interactive`が必要 |

**例：**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

対話型セットアップでは、優先オープナーを尋ね、マシンローカルのワークスペース状態に保存します。非対話型セットアップでは、`--opener`が提供された場合にのみ優先オープナーを保存します。それ以外の場合、`workspace open`は、サポートされているオープナーが利用可能な対話型ターミナルで後でプロンプトを表示するか、スクリプトに`--agent <tool>`または`--editor`を渡すよう求めます。

### `openspec workspace list`

ローカルレジストリから既知のOpenSpecワークスペースを一覧表示します。

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

リストには、各ワークスペースの場所とリンクされたリポジトリまたはフォルダが表示されます。古いレジストリレコードは報告されますが、変更されません。

### `openspec workspace link`

1つのワークスペースに対して既存のリポジトリまたはフォルダを記録します。

```bash
openspec workspace link [name] <path> [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--workspace <name>` | ローカルレジストリから既知のワークスペースを選択 |
| `--json` | JSONを出力 |
| `--no-interactive` | ワークスペースピッカープロンプトを無効にする |

**例：**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

パスはすでに存在している必要があります。相対パスは、OpenSpecが検証済みの絶対パスをマシンローカルのワークスペース状態に保存する前に、コマンドのカレントディレクトリに対して解決されます。リンクされたパスは、リポジトリローカルの`openspec/`状態のない完全なリポジトリ、パッケージ、サービス、アプリ、またはフォルダにすることができます。

### `openspec workspace relink`

既存のリンクのローカルパスを修復または変更します。

```bash
openspec workspace relink <name> <path> [options]
```

パスはすでに存在している必要があります。relinkは、安定したリンク名のマシンローカルパスのみを更新します。

### `openspec workspace doctor`

現在のマシンで1つのワークスペースが解決できる内容をチェックします。

```bash
openspec workspace doctor [options]
```

doctorは、ワークスペースの場所、計画パス、リンクされたリポジトリまたはフォルダ、欠落しているパス、存在する場合のリポジトリローカルの仕様パス、および推奨される修正を表示します。問題を報告するだけで、自動的に修復はしません。

1つのワークスペースを必要とするコマンドは、ワークスペースフォルダまたはサブディレクトリ内から実行された場合、現在のワークスペースを使用します。他の場所から実行する場合は、`--workspace <name>`を渡すか、対話型ターミナルでピッカーから選択するか、1つだけ存在する場合は唯一の既知のワークスペースに依存します。`--json`または`--no-interactive`モードでは、あいまいな選択は構造化されたステータスエラーで失敗し、`--workspace <name>`を提案します。

JSONレスポンスは、型付きオブジェクトと`status`配列を使用します。主要データは`workspace`、`workspaces`、または`link`にあり、警告とエラーは`status`にあります。

### `openspec workspace open`

保存された優先オープナー、1セッションのエージェントオーバーライド、またはVS Codeエディタモードを通じて、ワークスペースワーキングセットを開きます。

```bash
openspec workspace open [name] [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--workspace <name>` | 位置指定のワークスペース名のエイリアス |
| `--agent <tool>` | 1セッションのエージェントオーバーライド：`codex`、`claude`、または`github-copilot` |
| `--editor` | 管理されたVS Codeワークスペースファイルを通常のエディタワークスペースとして開く |
| `--no-interactive` | ワークスペースおよびオープナーピッカープロンプトを無効にする |

**例：**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open`は、ワークスペース内で実行された場合に現在のワークスペースを使用し、他の場所で実行された場合に唯一の既知のワークスペースを自動選択し、複数のワークスペースが既知の場合にユーザーに選択を求めます。`--agent`と`--editor`は保存された優先オープナーを変更しません。両方のオープナーオーバーライドを渡すことはエラーです。`--agent <tool>`または`--editor`のいずれかを選択してください。

OpenSpecは、VS CodeエディタおよびGitHub Copilot-in-VS-Codeのオープンのために、ワークスペースルートに`<workspace-name>.code-workspace`を管理します。そのファイルはマシンローカルであり、特定の`<workspace-name>.code-workspace`の`.gitignore`エントリによりデフォルトで無視されるため、ユーザーが作成した`*.code-workspace`ファイルは追跡対象のまま残ります。

管理されたVS Codeワークスペースには、調整ルートとして`.`と、有効なリンクされたリポジトリまたはフォルダが追加ルートとして含まれます。VS Codeはこれらのエントリをマルチルートワークスペースとして表示します。

ルートワークスペースのオープンは、リンクされたリポジトリまたはフォルダにまたがる探索と計画をサポートします。実装の編集は、明示的なユーザー要求と通常のOpenSpec実装ワークフローの後にのみ開始すべきです。

---

## ブラウジングコマンド

### `openspec list`

プロジェクト内の変更または仕様を一覧表示します。

```
openspec list [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--specs` | 変更ではなく仕様を一覧表示 |
| `--changes` | 変更を一覧表示（デフォルト） |
| `--sort <order>` | `recent`（デフォルト）または `name` で並べ替え |
| `--json` | JSON として出力 |

**使用例:**

```bash
# すべてのアクティブな変更を一覧表示
openspec list

# すべての仕様を一覧表示
openspec list --specs

# スクリプト用の JSON 出力
openspec list --json
```

**出力（テキスト）:**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

仕様と変更を探索するためのインタラクティブなダッシュボードを表示します。

```
openspec view
```

プロジェクトの仕様と変更をナビゲートするためのターミナルベースのインターフェースを開きます。

---

### `openspec show`

変更または仕様の詳細を表示します。

```
openspec show [item-name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `item-name` | いいえ | 変更または仕様の名前（省略時はプロンプト表示） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--type <type>` | タイプを指定: `change` または `spec`（明確な場合は自動検出） |
| `--json` | JSON として出力 |
| `--no-interactive` | プロンプトを無効化 |

**変更固有のオプション:**

| オプション | 説明 |
|--------|-------------|
| `--deltas-only` | デルタ仕様のみ表示（JSON モード） |

**仕様固有のオプション:**

| オプション | 説明 |
|--------|-------------|
| `--requirements` | 要件のみ表示、シナリオを除外（JSON モード） |
| `--no-scenarios` | シナリオコンテンツを除外（JSON モード） |
| `-r, --requirement <id>` | 1 から始まるインデックスで特定の要件を表示（JSON モード） |

**使用例:**

```bash
# インタラクティブな選択
openspec show

# 特定の変更を表示
openspec show add-dark-mode

# 特定の仕様を表示
openspec show auth --type spec

# 解析用の JSON 出力
openspec show add-dark-mode --json
```

---

## 検証コマンド

### `openspec validate`

構造上の問題について変更と仕様を検証します。

```
openspec validate [item-name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `item-name` | いいえ | 検証する特定のアイテム（省略時はプロンプト表示） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--all` | すべての変更と仕様を検証 |
| `--changes` | すべての変更を検証 |
| `--specs` | すべての仕様を検証 |
| `--type <type>` | 名前が曖昧な場合にタイプを指定: `change` または `spec` |
| `--strict` | 厳密な検証モードを有効化 |
| `--json` | JSON として出力 |
| `--concurrency <n>` | 最大並列検証数（デフォルト: 6、または `OPENSPEC_CONCURRENCY` 環境変数） |
| `--no-interactive` | プロンプトを無効化 |

**使用例:**

```bash
# インタラクティブな検証
openspec validate

# 特定の変更を検証
openspec validate add-dark-mode

# すべての変更を検証
openspec validate --changes

# JSON 出力ですべてを検証（CI/スクリプト用）
openspec validate --all --json

# 並列度を上げた厳密な検証
openspec validate --all --strict --concurrency 12
```

**出力（テキスト）:**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**出力（JSON）:**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## ライフサイクルコマンド

### `openspec archive`

完了した変更をアーカイブし、デルタ仕様をメイン仕様にマージします。

```
openspec archive [change-name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | アーカイブする変更（省略時はプロンプト表示） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `-y, --yes` | 確認プロンプトをスキップ |
| `--skip-specs` | 仕様の更新をスキップ（インフラ/ツール/ドキュメントのみの変更用） |
| `--no-validate` | 検証をスキップ（確認が必要） |

**例:**

```bash
# インタラクティブなアーカイブ
openspec archive

# 特定の変更をアーカイブ
openspec archive add-dark-mode

# プロンプトなしでアーカイブ（CI/スクリプト用）
openspec archive add-dark-mode --yes

# 仕様に影響しないツール変更をアーカイブ
openspec archive update-ci-config --skip-specs
```

**動作内容:**

1. 変更を検証（`--no-validate` がない限り）
2. 確認をプロンプト表示（`--yes` がない限り）
3. デルタ仕様を `openspec/specs/` にマージ
4. 変更フォルダを `openspec/changes/archive/YYYY-MM-DD-<name>/` に移動

---

## ワークフローコマンド

これらのコマンドは、成果物駆動の OPSX ワークフローをサポートします。進捗を確認する人間と、次のステップを判断するエージェントの両方に役立ちます。

### `openspec status`

変更に対する成果物の完了状態を表示します。

```
openspec status [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--change <id>` | 変更名（省略時はプロンプト表示） |
| `--schema <name>` | スキーマのオーバーライド（変更の設定から自動検出） |
| `--json` | JSON で出力 |

**例:**

```bash
# インタラクティブな状態確認
openspec status

# 特定の変更の状態
openspec status --change add-dark-mode

# エージェント用の JSON
openspec status --change add-dark-mode --json
```

**出力（テキスト）:**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**出力（JSON）:**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

成果物の作成やタスクの適用に関する拡張指示を取得します。次に何を作成すべきかを理解するために AI エージェントが使用します。

```
openspec instructions [artifact] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `artifact` | いいえ | 成果物 ID: `proposal`、`specs`、`design`、`tasks`、または `apply` |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--change <id>` | 変更名（非対話モードでは必須） |
| `--schema <name>` | スキーマのオーバーライド |
| `--json` | JSON で出力 |

**特別なケース:** `apply` を成果物として使用すると、タスクの実装指示を取得できます。

**例:**

```bash
# 次の成果物の指示を取得
openspec instructions --change add-dark-mode

# 特定の成果物の指示を取得
openspec instructions design --change add-dark-mode

# 適用/実装の指示を取得
openspec instructions apply --change add-dark-mode

# エージェント用の JSON
openspec instructions design --change add-dark-mode --json
```

**出力内容:**

- 成果物のテンプレートコンテンツ
- 設定からのプロジェクトコンテキスト
- 依存成果物からのコンテンツ
- 設定からの成果物ごとのルール

---

### `openspec templates`

スキーマ内のすべての成果物について、解決されたテンプレートパスを表示します。

```
openspec templates [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--schema <name>` | 調査するスキーマ（デフォルト: `spec-driven`） |
| `--json` | JSON で出力 |

**例:**

```bash
# デフォルトスキーマのテンプレートパスを表示
openspec templates

# カスタムスキーマのテンプレートを表示
openspec templates --schema my-workflow

# プログラム用の JSON
openspec templates --json
```

**出力（テキスト）:**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

利用可能なワークフロースキーマとその説明、成果物フローを一覧表示します。

```
openspec schemas [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--json` | JSON で出力 |

**例:**

```bash
openspec schemas
```

**出力:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## スキーマコマンド

カスタムワークフロースキーマの作成と管理のためのコマンド。

### `openspec schema init`

新しいプロジェクトローカルスキーマを作成します。

```
openspec schema init <name> [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `name` | はい | スキーマ名（ケバブケース） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--description <text>` | スキーマの説明 |
| `--artifacts <list>` | カンマ区切りの成果物 ID（デフォルト: `proposal,specs,design,tasks`） |
| `--default` | プロジェクトのデフォルトスキーマとして設定 |
| `--no-default` | デフォルトとして設定するかのプロンプトを表示しない |
| `--force` | 既存のスキーマを上書き |
| `--json` | JSON で出力 |

**例:**

```bash
# インタラクティブなスキーマ作成
openspec schema init research-first

# 特定の成果物を指定した非対話モード
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**作成される内容:**

```
openspec/schemas/<name>/
├── schema.yaml           # スキーマ定義
└── templates/
    ├── proposal.md       # 各成果物のテンプレート
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

既存のスキーマをプロジェクトにコピーしてカスタマイズします。

```
openspec schema fork <source> [name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `source` | はい | コピー元のスキーマ |
| `name` | いいえ | 新しいスキーマ名（デフォルト: `<source>-custom`） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--force` | 既存のコピー先を上書き |
| `--json` | JSON で出力 |

**例:**

```bash
# 組み込みの spec-driven スキーマをフォーク
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

スキーマの構造とテンプレートを検証します。

```
openspec schema validate [name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `name` | いいえ | 検証するスキーマ（省略時はすべて検証） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--verbose` | 詳細な検証ステップを表示 |
| `--json` | JSON で出力 |

**例:**

```bash
# 特定のスキーマを検証
openspec schema validate my-workflow

# すべてのスキーマを検証
openspec schema validate
```

---

### `openspec schema which`

スキーマがどこから解決されるかを表示します（優先順位のデバッグに役立ちます）。

```
openspec schema which [name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `name` | いいえ | スキーマ名 |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--all` | すべてのスキーマとそのソースを一覧表示 |
| `--json` | JSON で出力 |

**例:**

```bash
# スキーマのソースを確認
openspec schema which spec-driven
```

**出力:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**スキーマの優先順位:**

1. プロジェクト: `openspec/schemas/<name>/`
2. ユーザー: `~/.local/share/openspec/schemas/<name>/`
3. パッケージ: 組み込みスキーマ

---

## 設定コマンド

### `openspec config`

グローバルな OpenSpec 設定を表示および変更します。

```
openspec config <subcommand> [options]
```

**サブコマンド:**

| サブコマンド | 説明 |
|------------|-------------|
| `path` | 設定ファイルの場所を表示 |
| `list` | 現在のすべての設定を表示 |
| `get <key>` | 特定の値を取得 |
| `set <key> <value>` | 値を設定 |
| `unset <key>` | キーを削除 |
| `reset` | デフォルトにリセット |
| `edit` | `$EDITOR` で開く |
| `profile [preset]` | ワークフロープロファイルを対話的またはプリセットで設定 |

**例:**

```bash
# 設定ファイルのパスを表示
openspec config path

# すべての設定を一覧表示
openspec config list

# 特定の値を取得
openspec config get telemetry.enabled

# 値を設定
openspec config set telemetry.enabled false

# 文字列値を明示的に設定
openspec config set user.name "My Name" --string

# カスタム設定を削除
openspec config unset user.name

# すべての設定をリセット
openspec config reset --all --yes

# エディタで設定を編集
openspec config edit

# アクションベースのウィザードでプロファイルを設定
openspec config profile

# 高速プリセット: ワークフローをコアに切り替え（配信モードは維持）
openspec config profile core
```

`openspec config profile` は現在の状態の要約から始まり、以下から選択できます:
- 配信 + ワークフローを変更
- 配信のみを変更
- ワークフローのみを変更
- 現在の設定を維持（終了）

現在の設定を維持する場合、変更は書き込まれず、更新プロンプトも表示されません。
設定変更がなくても、現在のプロジェクトファイルがグローバルなプロファイル/配信と同期していない場合、OpenSpec は警告を表示し、`openspec update` の実行を提案します。
`Ctrl+C` を押すと、フローはきれいにキャンセルされ（スタックトレースなし）、コード `130` で終了します。
ワークフローチェックリストでは、`[x]` はワークフローがグローバル設定で選択されていることを意味します。これらの選択をプロジェクトファイルに適用するには、`openspec update` を実行するか（またはプロジェクト内でプロンプトが表示されたら「Apply changes to this project now?」を選択します）。

**対話的な例:**

```bash
# 配信のみの更新
openspec config profile
# 選択: Change delivery only
# 配信を選択: Skills only

# ワークフローのみの更新
openspec config profile
# 選択: Change workflows only
# チェックリストでワークフローをトグルし、確認
```

---

## ユーティリティコマンド

### `openspec feedback`

OpenSpec に関するフィードバックを送信します。GitHub issue を作成します。

```
openspec feedback <message> [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `message` | はい | フィードバックメッセージ |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--body <text>` | 詳細な説明 |

**要件:** GitHub CLI (`gh`) がインストールされ、認証されている必要があります。

**例:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

OpenSpec CLI のシェル補完を管理します。

```
openspec completion <subcommand> [shell]
```

**サブコマンド:**

| サブコマンド | 説明 |
|------------|-------------|
| `generate [shell]` | 補完スクリプトを標準出力に出力 |
| `install [shell]` | 使用しているシェルに補完をインストール |
| `uninstall [shell]` | インストール済みの補完を削除 |

**サポートされているシェル:** `bash`, `zsh`, `fish`, `powershell`

**例:**

```bash
# 補完をインストール（シェルを自動検出）
openspec completion install

# 特定のシェルにインストール
openspec completion install zsh

# 手動インストール用のスクリプトを生成
openspec completion generate bash > ~/.bash_completion.d/openspec

# アンインストール
openspec completion uninstall
```

---

## 終了コード

| コード | 意味 |
|------|---------|
| `0` | 成功 |
| `1` | エラー（検証失敗、ファイル欠落など） |

---

## 環境変数

| 変数 | 説明 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | テレメトリを無効にするには `0` に設定 |
| `DO_NOT_TRACK` | テレメトリを無効にするには `1` に設定（標準的な DNT シグナル） |
| `OPENSPEC_CONCURRENCY` | バルク検証のデフォルトの並行度（デフォルト: 6） |
| `EDITOR` または `VISUAL` | `openspec config edit` 用のエディタ |
| `NO_COLOR` | 設定するとカラー出力を無効化 |

---

## 関連ドキュメント

- [コマンド](commands.md) - AI スラッシュコマンド（`/opsx:propose`、`/opsx:apply` など）
- [ワークフロー](workflows.md) - 一般的なパターンと各コマンドの使用タイミング
- [カスタマイズ](customization.md) - カスタムスキーマとテンプレートの作成
- [はじめに](getting-started.md) - 初回セットアップガイド