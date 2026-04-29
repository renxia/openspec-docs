# CLIリファレンス

OpenSpec CLI (`openspec`) は、プロジェクトのセットアップ、検証、状態確認、管理のためのターミナルコマンドを提供します。これらのコマンドは、[コマンド](commands.md)で説明されているAIスラッシュコマンド（`/opsx:propose`など）を補完するものです。

## 概要

| カテゴリ | コマンド | 目的 |
|----------|----------|---------|
| **セットアップ** | `init`, `update` | プロジェクトでOpenSpecを初期化および更新 |
| **閲覧** | `list`, `view`, `show` | 変更や仕様を探索 |
| **検証** | `validate` | 変更や仕様に問題がないか確認 |
| **ライフサイクル** | `archive` | 完了した変更を確定 |
| **ワークフロー** | `status`, `instructions`, `templates`, `schemas` | アーティファクト駆動型ワークフローのサポート |
| **スキーマ** | `schema init`, `schema fork`, `schema validate`, `schema which` | カスタムワークフローの作成と管理 |
| **設定** | `config` | 設定の表示と変更 |
| **ユーティリティ** | `feedback`, `completion` | フィードバックとシェル統合 |

---

## 人間向けコマンドとエージェント向けコマンド

ほとんどのCLIコマンドは、ターミナルで**人間が使用する**ように設計されています。一部のコマンドは、JSON出力によって**エージェント/スクリプトからの使用**もサポートしています。

### 人間専用コマンド

これらのコマンドはインタラクティブで、ターミナルでの使用を目的としています：

| コマンド | 目的 |
|---------|---------|
| `openspec init` | プロジェクトを初期化（インタラクティブなプロンプト） |
| `openspec view` | インタラクティブなダッシュボード |
| `openspec config edit` | エディタで設定を開く |
| `openspec feedback` | GitHub経由でフィードバックを送信 |
| `openspec completion install` | シェル補完をインストール |

### エージェント互換コマンド

これらのコマンドは、AIエージェントやスクリプトによるプログラマティックな使用のために`--json`出力をサポートしています：

| コマンド | 人間向け使用 | エージェント向け使用 |
|---------|-----------|-----------|
| `openspec list` | 変更/スペックを閲覧 | 構造化データ用の`--json` |
| `openspec show <item>` | 内容を読み取り | パース用の`--json` |
| `openspec validate` | 問題を確認 | 一括検証用の`--all --json` |
| `openspec status` | 成果物の進捗を確認 | 構造化ステータス用の`--json` |
| `openspec instructions` | 次のステップを取得 | エージェント指示用の`--json` |
| `openspec templates` | テンプレートパスを検索 | パス解決用の`--json` |
| `openspec schemas` | 利用可能なスキーマを一覧表示 | スキーマ検出用の`--json` |

---

## グローバルオプション

これらのオプションはすべてのコマンドで機能します：

| オプション | 説明 |
|--------|-------------|
| `--version`, `-V` | バージョン番号を表示 |
| `--no-color` | カラー出力を無効にする |
| `--help`, `-h` | コマンドのヘルプを表示 |

---

## セットアップコマンド

### `openspec init`

プロジェクトにOpenSpecを初期化します。フォルダ構造を作成し、AIツールの統合を設定します。

デフォルトの動作は、グローバル設定のデフォルトを使用します：プロファイル `core`、配信 `both`、ワークフロー `propose, explore, apply, archive`。

```
openspec init [path] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `path` | いいえ | 対象ディレクトリ（デフォルト：現在のディレクトリ） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--tools <list>` | インタラクティブでなくAIツールを設定する。`all`、`none`、またはカンマ区切りのリストを使用 |
| `--force` | プロンプトなしでレガシーファイルを自動クリーンアップ |
| `--profile <profile>` | この初期化実行用にグローバルプロファイルを上書き（`core`または`custom`） |

`--profile custom`は、グローバル設定（`openspec config profile`）で現在選択されているワークフローを使用します。

**サポートされているツールID（`--tools`）：** `amazon-q`、`antigravity`、`auggie`、`claude`、`cline`、`codex`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`iflow`、`kilocode`、`kiro`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`trae`、`windsurf`

**例：**

```bash
# インタラクティブな初期化
openspec init

# 特定のディレクトリで初期化
openspec init ./my-project

# インタラクティブでなく、ClaudeとCursorを設定
openspec init --tools claude,cursor

# すべてのサポートされているツールを設定
openspec init --tools all

# この実行用にプロファイルを上書き
openspec init --profile core

# プロンプトをスキップし、レガシーファイルを自動クリーンアップ
openspec init --force
```

**作成されるもの：**

```
openspec/
├── specs/              # スペック（信頼できる情報源）
├── changes/            # 提案された変更
└── config.yaml         # プロジェクト設定

.claude/skills/         # Claude Codeスキル（claudeを選択した場合）
.cursor/skills/         # Cursorスキル（cursorを選択した場合）
.cursor/commands/       # Cursor OPSXコマンド（配信にコマンドが含まれる場合）
...（その他のツール設定）
```

---

### `openspec update`

CLIをアップグレードした後、OpenSpecの指示ファイルを更新します。現在のグローバルプロファイル、選択されたワークフロー、および配信モードを使用して、AIツールの設定ファイルを再生成します。

```
openspec update [path] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `path` | いいえ | 対象ディレクトリ（デフォルト：現在のディレクトリ） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--force` | ファイルが最新でも強制的に更新 |

**例：**

```bash
# npmアップグレード後に指示ファイルを更新
npm update @fission-ai/openspec
openspec update
```

---

## 閲覧コマンド

### `openspec list`

プロジェクト内の変更またはスペックを一覧表示します。

```
openspec list [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--specs` | 変更ではなくスペックを一覧表示 |
| `--changes` | 変更を一覧表示（デフォルト） |
| `--sort <order>` | `recent`（デフォルト）または`name`でソート |
| `--json` | JSONとして出力 |

**例：**

```bash
# すべてのアクティブな変更を一覧表示
openspec list

# すべてのスペックを一覧表示
openspec list --specs

# スクリプト用のJSON出力
openspec list --json
```

**出力（テキスト）：**

```
アクティブな変更：
  add-dark-mode     UIテーマ切り替えサポート
  fix-login-bug     セッションタイムアウト処理
```

---

### `openspec view`

スペックと変更を探索するためのインタラクティブなダッシュボードを表示します。

```
openspec view
```

プロジェクトのスペックと変更をナビゲートするためのターミナルベースのインターフェースを開きます。

---

### `openspec show`

変更またはスペックの詳細を表示します。

```
openspec show [item-name] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `item-name` | いいえ | 変更またはスペックの名前（省略した場合はプロンプト） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--type <type>` | タイプを指定：`change`または`spec`（曖昧でない場合は自動検出） |
| `--json` | JSONとして出力 |
| `--no-interactive` | プロンプトを無効にする |

**変更固有のオプション：**

| オプション | 説明 |
|--------|-------------|
| `--deltas-only` | デルタスペックのみを表示（JSONモード） |

**スペック固有のオプション：**

| オプション | 説明 |
|--------|-------------|
| `--requirements` | 要件のみを表示し、シナリオを除外（JSONモード） |
| `--no-scenarios` | シナリオ内容を除外（JSONモード） |
| `-r, --requirement <id>` | 1から始まるインデックスで特定の要件を表示（JSONモード） |

**例：**

```bash
# インタラクティブな選択
openspec show

# 特定の変更を表示
openspec show add-dark-mode

# 特定のスペックを表示
openspec show auth --type spec

# パース用のJSON出力
openspec show add-dark-mode --json
```

---

## 検証コマンド

### `openspec validate`

変更とスペックの構造的な問題を検証します。

```
openspec validate [item-name] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `item-name` | いいえ | 検証する特定のアイテム（省略した場合はプロンプト） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--all` | すべての変更とスペックを検証 |
| `--changes` | すべての変更を検証 |
| `--specs` | すべてのスペックを検証 |
| `--type <type>` | 名前が曖昧な場合にタイプを指定：`change`または`spec` |
| `--strict` | 厳格な検証モードを有効にする |
| `--json` | JSONとして出力 |
| `--concurrency <n>` | 最大並列検証数（デフォルト：6、または`OPENSPEC_CONCURRENCY`環境変数） |
| `--no-interactive` | プロンプトを無効にする |

**例：**

```bash
# インタラクティブな検証
openspec validate

# 特定の変更を検証
openspec validate add-dark-mode

# すべての変更を検証
openspec validate --changes

# すべてを検証し、JSON出力（CI/スクリプト用）
openspec validate --all --json

# 厳格な検証で並列度を増加
openspec validate --all --strict --concurrency 12
```

**出力（テキスト）：**

```
add-dark-modeを検証中...
  ✓ proposal.md 有効
  ✓ specs/ui/spec.md 有効
  ⚠ design.md: "Technical Approach"セクションがありません

警告が1件見つかりました
```

**出力（JSON）：**

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

完了した変更をアーカイブし、デルタスペックをメインスペックにマージします。

```
openspec archive [change-name] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | アーカイブする変更（省略した場合はプロンプト） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `-y, --yes` | 確認プロンプトをスキップ |
| `--skip-specs` | スペック更新をスキップ（インフラ/ツール/ドキュメントのみの変更用） |
| `--no-validate` | 検証をスキップ（確認が必要） |

**例：**

```bash
# インタラクティブなアーカイブ
openspec archive

# 特定の変更をアーカイブ
openspec archive add-dark-mode

# プロンプトなしでアーカイブ（CI/スクリプト用）
openspec archive add-dark-mode --yes

# スペックに影響しないツール変更をアーカイブ
openspec archive update-ci-config --skip-specs
```

**実行内容：**

1. 変更を検証（`--no-validate`でない限り）
2. 確認を求める（`--yes`でない限り）
3. デルタスペックを`openspec/specs/`にマージ
4. 変更フォルダを`openspec/changes/archive/YYYY-MM-DD-<name>/`に移動

---

## ワークフローコマンド

これらのコマンドは、成果物駆動のOPSXワークフローをサポートします。進捗を確認する人間や、次のステップを決定するエージェントの両方に役立ちます。

### `openspec status`

変更の成果物の完了状況を表示します。

```
openspec status [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--change <id>` | 変更名（省略した場合はプロンプト） |
| `--schema <name>` | スキーマの上書き（変更の設定から自動検出） |
| `--json` | JSONとして出力 |

**例：**

```bash
# インタラクティブなステータス確認
openspec status

# 特定の変更のステータス
openspec status --change add-dark-mode

# エージェント向けのJSON
openspec status --change add-dark-mode --json
```

**出力（テキスト）：**

```
変更: add-dark-mode
スキーマ: spec-driven
進捗: 4つの成果物のうち2つ完了

[x] proposal
[ ] design
[x] specs
[-] tasks（designにブロックされています）
```

**出力（JSON）：**

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

成果物の作成またはタスクの適用のための拡張された指示を取得します。AIエージェントが次に何を作成すべきかを理解するために使用されます。

```
openspec instructions [artifact] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `artifact` | いいえ | 成果物ID：`proposal`、`specs`、`design`、`tasks`、または`apply` |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--change <id>` | 変更名（非インタラクティブモードでは必須） |
| `--schema <name>` | スキーマの上書き |
| `--json` | JSONとして出力 |

**特別なケース：** タスク実装指示を取得するには、成果物として`apply`を使用します。

**例：**

```bash
# 次の成果物の指示を取得
openspec instructions --change add-dark-mode

# 特定の成果物の指示を取得
openspec instructions design --change add-dark-mode

# 適用/実装指示を取得
openspec instructions apply --change add-dark-mode

# エージェントが消費するJSON
openspec instructions design --change add-dark-mode --json
```

**出力に含まれるもの：**

- 成果物のテンプレート内容
- 設定からのプロジェクトコンテキスト
- 依存成果物からの内容
- 設定からの成果物ごとのルール

---

### `openspec templates`

スキーマ内のすべての成果物の解決済みテンプレートパスを表示します。

```
openspec templates [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--schema <name>` | 検査するスキーマ（デフォルト：`spec-driven`） |
| `--json` | JSONとして出力 |

**例：**

```bash
# デフォルトスキーマのテンプレートパスを表示
openspec templates

# カスタムスキーマのテンプレートを表示
openspec templates --schema my-workflow

# プログラマティックな使用のためのJSON
openspec templates --json
```

**出力（テキスト）：**

```
スキーマ: spec-driven

テンプレート:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

説明と成果物フローを含む、利用可能なワークフロースキーマを一覧表示します。

```
openspec schemas [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--json` | JSONとして出力 |

**例：**

```bash
openspec schemas
```

**出力：**

```
利用可能なスキーマ：

  spec-driven（パッケージ）
    デフォルトのスペック駆動開発ワークフロー
    フロー: proposal → specs → design → tasks

  my-custom（プロジェクト）
    このプロジェクト用のカスタムワークフロー
    フロー: research → proposal → tasks
```

---

## スキーマコマンド

カスタムワークフロースキーマの作成と管理を行うコマンドです。

### `openspec schema init`

新しいプロジェクトローカルスキーマを作成します。

```
openspec schema init <name> [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `name` | はい | スキーマ名（ケバブケース） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--description <text>` | スキーマの説明 |
| `--artifacts <list>` | カンマ区切りのアーティファクトID（デフォルト：`proposal,specs,design,tasks`） |
| `--default` | プロジェクトのデフォルトスキーマとして設定 |
| `--no-default` | デフォルトとして設定するか確認しない |
| `--force` | 既存のスキーマを上書き |
| `--json` | JSON形式で出力 |

**例：**

```bash
# インタラクティブなスキーマ作成
openspec schema init research-first

# 特定のアーティファクトを指定した非インタラクティブな作成
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**作成されるもの：**

```
openspec/schemas/<name>/
├── schema.yaml           # スキーマ定義
└── templates/
    ├── proposal.md       # 各アーティファクトのテンプレート
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

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `source` | はい | コピー元のスキーマ |
| `name` | いいえ | 新しいスキーマ名（デフォルト：`<source>-custom`） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--force` | 既存のコピー先を上書き |
| `--json` | JSON形式で出力 |

**例：**

```bash
# 組み込みのspec-drivenスキーマをフォーク
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

スキーマの構造とテンプレートを検証します。

```
openspec schema validate [name] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `name` | いいえ | 検証するスキーマ（省略時は全て検証） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--verbose` | 詳細な検証ステップを表示 |
| `--json` | JSON形式で出力 |

**例：**

```bash
# 特定のスキーマを検証
openspec schema validate my-workflow

# 全てのスキーマを検証
openspec schema validate
```

---

### `openspec schema which`

スキーマがどこから解決されるかを表示します（優先順位のデバッグに便利）。

```
openspec schema which [name] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `name` | いいえ | スキーマ名 |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--all` | 全てのスキーマとそのソースを一覧表示 |
| `--json` | JSON形式で出力 |

**例：**

```bash
# スキーマのソースを確認
openspec schema which spec-driven
```

**出力：**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**スキーマの優先順位：**

1. プロジェクト：`openspec/schemas/<name>/`
2. ユーザー：`~/.local/share/openspec/schemas/<name>/`
3. パッケージ：組み込みスキーマ

---

## 設定コマンド

### `openspec config`

グローバルなOpenSpec設定を表示および変更します。

```
openspec config <subcommand> [options]
```

**サブコマンド：**

| サブコマンド | 説明 |
|------------|-------------|
| `path` | 設定ファイルの場所を表示 |
| `list` | 現在の全ての設定を表示 |
| `get <key>` | 特定の値を取得 |
| `set <key> <value>` | 値を設定 |
| `unset <key>` | キーを削除 |
| `reset` | デフォルトにリセット |
| `edit` | `$EDITOR`で開く |
| `profile [preset]` | ワークフロープロファイルをインタラクティブにまたはプリセットで設定 |

**例：**

```bash
# 設定ファイルのパスを表示
openspec config path

# 全ての設定を一覧表示
openspec config list

# 特定の値を取得
openspec config get telemetry.enabled

# 値を設定
openspec config set telemetry.enabled false

# 文字列値を明示的に設定
openspec config set user.name "My Name" --string

# カスタム設定を削除
openspec config unset user.name

# 全ての設定をリセット
openspec config reset --all --yes

# エディタで設定を編集
openspec config edit

# アクションベースのウィザードでプロファイルを設定
openspec config profile

# 高速プリセット：ワークフローをコアに切り替え（配信モードは維持）
openspec config profile core
```

`openspec config profile`は現在の状態の要約から開始し、以下の選択肢を提供します：
- 配信 + ワークフローを変更
- 配信のみ変更
- ワークフローのみ変更
- 現在の設定を維持（終了）

現在の設定を維持した場合、変更は書き込まれず、更新プロンプトも表示されません。
設定に変更がない場合でも、現在のプロジェクトファイルがグローバルプロファイル/配信と同期していない場合、OpenSpecは警告を表示し、`openspec update`の実行を提案します。
`Ctrl+C`を押すとフローが正常にキャンセルされ（スタックトレースなし）、終了コード`130`で終了します。
ワークフローチェックリストで、`[x]`はグローバル設定でワークフローが選択されていることを意味します。これらの選択をプロジェクトファイルに適用するには、`openspec update`を実行するか（またはプロジェクト内でプロンプトが表示されたときに`Apply changes to this project now?`を選択します）。

**インタラクティブな例：**

```bash
# 配信のみ更新
openspec config profile
# 選択肢：Change delivery only
# 配信を選択：Skills only

# ワークフローのみ更新
openspec config profile
# 選択肢：Change workflows only
# チェックリストでワークフローを切り替え、確認
```

---

## ユーティリティコマンド

### `openspec feedback`

OpenSpecに関するフィードバックを送信します。GitHubイシューを作成します。

```
openspec feedback <message> [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `message` | はい | フィードバックメッセージ |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--body <text>` | 詳細な説明 |

**要件：** GitHub CLI（`gh`）がインストールされ、認証されている必要があります。

**例：**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

OpenSpec CLIのシェル補完を管理します。

```
openspec completion <subcommand> [shell]
```

**サブコマンド：**

| サブコマンド | 説明 |
|------------|-------------|
| `generate [shell]` | 補完スクリプトを標準出力に出力 |
| `install [shell]` | 使用しているシェルに補完をインストール |
| `uninstall [shell]` | インストールされた補完を削除 |

**対応シェル：** `bash`、`zsh`、`fish`、`powershell`

**例：**

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
| `OPENSPEC_TELEMETRY` | `0`に設定するとテレメトリを無効化 |
| `DO_NOT_TRACK` | `1`に設定するとテレメトリを無効化（標準DNTシグナル） |
| `OPENSPEC_CONCURRENCY` | 一括検証のデフォルト並行数（デフォルト：6） |
| `EDITOR`または`VISUAL` | `openspec config edit`用のエディタ |
| `NO_COLOR` | 設定するとカラーアウトプットを無効化 |

---

## 関連ドキュメント

- [コマンド](commands.md) - AIスラッシュコマンド（`/opsx:propose`、`/opsx:apply`など）
- [ワークフロー](workflows.md) - 一般的なパターンと各コマンドの使用場面
- [カスタマイズ](customization.md) - カスタムスキーマとテンプレートの作成
- [はじめに](getting-started.md) - 初期セットアップガイド