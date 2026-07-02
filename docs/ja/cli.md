# CLI Reference

OpenSpec CLI（`openspec`）は、プロジェクトのセットアップ、検証、ステータス検査、および管理のためのターミナルコマンドを提供します。これらのコマンドは、[Commands]（`commands.md`）で文書化されているAIスラッシュコマンド（例：`/opsx:propose`）を補完するものです。

## 概要

| カテゴリ | コマンド | 用途 |
|----------|----------|---------|
| **Setup** | `init`, `update` | プロジェクトでOpenSpecを初期化および更新します |
| **Stores (standalone OpenSpec repos)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | 登録済みのスタンドアロンのOpenSpecリポジトリであるストアを管理します |
| **Health** | `doctor` | 解像されたルートに対する関係の健全性を報告します |
| **Working context** | `context` | 作業セット（ルート＋参照されているストア）を組み立てます |
| **Personal worksets** | `workset create`, `workset list`, `workset open`, `workset remove` | ツール内での個人的な、ローカルな作業ビューを保持し、開きます |
| **Browsing** | `list`, `view`, `show` | 変更点と仕様を閲覧します |
| **Validation** | `validate` | 変更点と仕様に問題がないか確認します |
| **Lifecycle** | `archive` | 完了した変更点を確定させます |
| **Workflow** | `new change`, `status`, `instructions`, `templates`, `schemas` | アーティファクト駆動型のワークフローをサポートします |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | カスタムワークフローを作成し、管理します |
| **Config** | `config` | 設定を表示および変更します |
| **Utility** | `feedback`, `completion` | フィードバックとシェル統合を提供します |

## 人間操作とエージェント操作のコマンド

ほとんどのCLIコマンドは、ターミナルでの**人間による利用**を想定しています。一部のコマンドは、JSON出力経由で**エージェント／スクリプトによる利用**もサポートしています。

### 人間操作専用のコマンド

これらのコマンドは対話型であり、ターミナル使用のために設計されています：

| Command | Purpose |
|---------|---------|
| `openspec init` | プロジェクトの初期化（対話形式のプロンプト） |
| `openspec view` | 対話型ダッシュボード |
| `openspec workset open <name>` | 保存されたワークセットを開く（エディタウィンドウまたはターミナルエージェントセッション） |
| `openspec config edit` | エディタで設定ファイルを開く |
| `openspec feedback` | GitHub経由でのフィードバック送信 |
| `openspec completion install` | シェル補完のインストール |

### エージェント互換のコマンド

これらのコマンドは、AIエージェントおよびスクリプトによるプログラム的な使用のために `--json` 出力をサポートしています：

| Command | Human Use | Agent Use |
|---------|-----------|-----------|
| `openspec list` | 変更／仕様の閲覧 | 構造化されたデータのための`--json` |
| `openspec show <item>` | コンテンツの読み取り | 解析のための`--json` |
| `openspec validate` | 問題点のチェック | 一括検証のための`--all --json` |
| `openspec status` | アーティファクトの進捗確認 | 構造化されたステータスのための`--json` |
| `openspec instructions` | 次のステップを取得 | エージェント指示のための`--json` |
| `openspec templates` | テンプレートパスの検索 | パス解決のための`--json` |
| `openspec schemas` | 利用可能なスキーマの一覧表示 | スキーマ発見のための`--json` |
| `openspec store setup <id>` | ローカルストアの作成と登録 | 構造化された設定出力のための明示的な入力を伴う`--json` |
| `openspec store register <path>` | 既存ストアの登録 | 構造化された登録出力のための`--json` |
| `openspec store unregister <id>` | ローカルストア登録の解除 | 構造化されたクリーンアップ出力のための`--json` |
| `openspec store remove <id>` | 登録されたローカルストアフォルダの削除 | 非対話的な削除のための`--yes --json` |
| `openspec store list` | 登録済みストアの閲覧 | 構造化された登録のための`--json` |
| `openspec store doctor` | ローカルストア設定のチェック | 構造化された診断のための`--json` |
| `openspec new change <id>` | リポジトリローカルな変更スキャフォールドの作成 | `--store <id>` を使用して登録済みストアをOpenSpecルートとして利用するための`--json` |
| `openspec workset create [name]` | 個人的な作業ビューの構成 | 非対話的な構成のための`--member <path> --json` |
| `openspec workset list` | 保存されたワークセットの閲覧 | 構造化されたビューのための`--json` |
| `openspec workset remove <name>` | 保存されたビューの削除 | 非対話的な削除のための`--yes --json` |

---

## グローバルオプション

これらのオプションはすべてのコマンドで機能します：

| Option | Description |
|--------|-------------|
| `--version`, `-V` | バージョン番号を表示 |
| `--no-color` | 色付き出力の無効化 |
| `--help`, `-h` | コマンドのヘルプ表示 |

---

## セットアップコマンド

### `openspec init`

プロジェクトにOpenSpecを初期化します。フォルダ構造を作成し、AIツール統合を設定します。

デフォルトの動作はグローバル設定のデフォルトを使用します：プロファイル `core`、デリバリー `both`、ワークフロー `propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | 対象ディレクトリ（デフォルト：カレントディレクトリ） |

**Options:**

| Option | Description |
|--------|-------------|
| `--tools <list>` | AIツールを非対話的に設定します。`all`、`none`、またはカンマ区切りのリストを使用します |
| `--force` | プロンプトなしでレガシーファイルを自動クリーンアップします |
| `--profile <profile>` | この初期化実行に対するグローバルプロファイルのオーバーライド（`core`または`custom`） |

`--profile custom` は、グローバル設定（`openspec config profile`）で現在選択されているワークフローを使用します。

**サポートされているツールID（`--tools`）：** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> このリストは、`src/core/config.ts` の `AI_TOOLS` を反映しています。各ツールのスキルとコマンドパスについては、[Supported Tools](supported-tools.md) を参照してください。

**Examples:**

```bash
# Interactive initialization
openspec init

# Initialize in a specific directory
openspec init ./my-project

# Non-interactive: configure for Claude and Cursor
openspec init --tools claude,cursor

# Configure for all supported tools
openspec init --tools all

# Override profile for this run
openspec init --profile core

# Skip prompts and auto-cleanup legacy files
openspec init --force
```

**What it creates:**

```
openspec/
├── specs/              # Your specifications (source of truth)
├── changes/            # Proposed changes
└── config.yaml         # Project configuration

.claude/skills/         # Claude Code skills (if claude selected)
.cursor/skills/         # Cursor skills (if cursor selected)
.cursor/commands/       # Cursor OPSX commands (if delivery includes commands)
... (other tool configs)
```

---

### `openspec update`

CLIをアップグレードした後、OpenSpecの指示ファイルを更新します。現在のグローバルプロファイル、選択されたワークフロー、およびデリバリーモードを使用してAIツールの設定ファイルを再生成します。

```
openspec update [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | 対象ディレクトリ（デフォルト：カレントディレクトリ） |

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | ファイルが最新の状態であっても強制的に更新します |

**Example:**

```bash
# Update instruction files after npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## ストア（スタンドアロンのOpenSpecリポジトリ）

> **ベータ版。**ストアおよびそれに基づいて構築された機能（参照、作業コンテキスト、ワークセット）は新規のものです。コマンド名、フラグ、ファイル形式、JSON出力はリリース間で変更される可能性があります。問題解決を優先したウォークスルーについては、[stores guide](stores-beta/user-guide.md) を参照してください。

ストアとは、このマシンに登録したスタンドアロンのOpenSpecリポジトリです。例えば、計画リポジトリや契約リポジトリなどがあります。ストアを登録することで、通常のコマンド（`list`、`show`、`status`、`validate`、`new change`、`archive`など）が、`--store <id>` を渡すことでどこからでもそれに対して作用できるようになります。

### `openspec store setup`

ローカルストアを作成し、登録します。ターミナルで引数を指定しない場合、OpenSpecがユーザーをセットアッププロセスに導きます。エージェントやスクリプトは明示的な入力を渡し、`--json` を使用する必要があります。

```bash
openspec store setup [id] [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--path <path>` | ストアが存在すべきフォルダ（例：`~/openspec/<id>`） |
| `--remote <url>` | 新しいストアの `store.yaml` に正規のリモートを記録します |
| `--init-git` | 初期コミットを含むGitリポジトリの初期化（デフォルト） |
| `--no-init-git` | すべてのGitアクションをスキップします：初期化なし、初回コミットなし |
| `--json` | JSONを出力 |

非対話的な実行（`--json`、スクリプト、エージェント）では、ストアIDと`--path`の両方を渡す必要があります。対話型ターミナルでは、セットアップが場所を尋ねますが、これはユーザー所有の目に見える場所に編集可能な提案として表示されます（例：`~/openspec/<id>`）。OpenSpecの管理データディレクトリにデフォルト設定されることはありません。

Examples:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

既存のローカルストアフォルダを登録します。

```bash
openspec store register [path] [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <id>` | ストアID。ストアメタデータまたはフォルダ名がデフォルトになります |
| `--yes` | 健康なOpenSpecルートのためのストアアイデンティティメタデータの作成を確定します |
| `--json` | JSONを出力 |

### `openspec store unregister`

ファイルを削除することなく、ローカルストアの登録を解除します。

```bash
openspec store unregister <id> [--json]
```

これは、ストアが移動された場合、他の場所にクローンされた場合、またはこのマシン上でOpenSpecによって表示されるべきではない場合に使用します。

### `openspec store remove`

ローカルストアの登録を解除し、そのローカルフォルダを削除します。

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` は、対話型ターミナルで削除前に正確なフォルダを表示します。エージェント、スクリプト、JSON呼び出し元は、削除を確定するために`--yes`を渡す必要があります。OpenSpecは、一致するストアメタデータを含まないフォルダの削除を拒否します。

### `openspec store list`

ローカルに登録されているストアの一覧を表示します。

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

ローカルストアの登録、メタデータ、Gitの存在を確認します。

```bash
openspec store doctor [id] [--json]
```

Doctorは診断専用であり、ストアを変更することなく、ルートの欠落、メタデータの不一致、ローカルレジストリの状態の無効性を報告します。

### プロジェクトからのストア参照

プロジェクトリポジトリは、`openspec/config.yaml` でどのストアを利用するかを宣言できます：

```yaml
schema: spec-driven
references:
  - team-context
```

これ以降、そのリポジトリにおける `openspec instructions` の出力（アーティファクトごとの表示と `apply` 表示の両方、JSONおよび人間モード）には、参照された各ストアの仕様（spec ID、各仕様のPurposeセクションからの1行要約、およびフェッチコマンド (`openspec show <spec-id> --type spec --store <id>`)）がインデックスとして含まれます。このインデックスは、実行ごとに登録済みのチェックアウトからライブで構築され、仕様の内容が出力にコピーされることはありません。

参照は読み取り専用のコンテキストです。それはコマンドが作用する場所を一切変更しません。作業はリポジトリ自身のルートに留まり、参照されたストアへの書き込みは明示的な `--store` アクションのままです。解決できない参照（例えば、このマシンに登録されていないストア）は、正確な修正案とともにインデックス内の警告に格下げられますが、指示は引き続き生成されます。`openspec doctor` はある場所で参照の状態を報告します。

### ストアがどこからクローンされたかを記録する

ストアは、コミットされたアイデンティティファイルに正規のクローンソースを記録できるため、「ストアを登録する」という点でオンボーディングが行き詰まることはありません：

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

リモートは初回コミット内の `.openspec-store/store.yaml` に格納されるため、すべてのクローンがそれを知った状態で生まれます。既存のストアについては、手動で `store.yaml` を編集しコミットします。`store doctor` は記録されたリモート（およびチェックアウトが観測したGitオリジン）を表示します。setup/register はガイダンス名を与えるものであり、register はローカルマシンレジストリにチェックアウトのオリジンを記録します。

参照宣言もクローンソースを保持できるため、まだストアを持っていないチームメイトは完全で貼り付け可能な修正（`git clone <remote> <path> && openspec store register <path> --id <id>`）を得ることができます：

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

リモートの記録は同期ではありません。OpenSpecは自らクローンしたり、プルしたり、プッシュしたりすることはありません。

### デフォルトストアの宣言

計画が完全に外部化されているリポジトリ（ローカルの `openspec/specs/` や `openspec/changes/` がない）は、すべてのコマンドで `--store` を渡す代わりに、一度でストアを宣言できます：

```yaml
# openspec/config.yaml (the only file under openspec/)
store: team-context
```

通常のコマンドはその後、宣言されたストアに自動的に解決されます。ルートバナーとJSONの `root` ブロックは、ストアIDとともに `source: "declared"` を報告し、表示されるヒントには引き続き `--store <id>` が含まれます。この宣言はフォールバックであり、決してオーバーライドではありません。明示的な `--store` が常に優先され、実際の計画フォルダを持つディレクトリはポインターを無視します（警告付き）。ポインターリポジトリをローカルのOpenSpecルートに変換するには、`store:` 行を削除し `openspec init` を実行してください。宣言が存在する限り、init はスキャフォールドすることを拒否します。

## Doctor（リレーションシップの健全性）

オープン仕様ルートが健全であるか、またそれが参照しているストアがこのマシンで利用可能であるかを問う、読み取り専用の質問です。

```bash
openspec doctor [--store <id>] [--json]
```

レポートは、ルートの健全性、ストアメタデータの健全性（記録されているリモートとチェックアウトのオリジンが異なる場合の注記を含む）、および参照の健全性（未解決の参照に対するクローン修正を伴う同じ診断手順を表示）に分けています。いずれかの重大度を持つ健全性の発見があった場合、エージェントは `status` 配列を読み取ります。コマンド自体の失敗（ルートがない、ストアが不明）でのみ終了コード 1 が返されます。Doctor は決してクローンしたり、同期したり、修復したりしません。アセンブルされたセット自体を取得したい場合は、`openspec context` を使用してください。

## Working context（アセンブルされたセット）

この作業に関連するすべてのもの—オープン仕様の宣言を通じて—は、一つのワーキングセットにまとめられています。すなわち、オープン仕様ルートとそれが参照しているストアです。

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSONブリーフはエージェントが消費できる形式であり（利用可能な各参照ストアは自身のフェッチレシピを持ちます。未解決のメンバーは同じ修正手順とDoctorの表示を伴います）。`--code-workspace` は、ルートと利用可能な参照ストア（`ref:<id>` フォルダ）を含む VS Code のワークスペースファイルを書き出すことに加えて機能します。このコマンドが実行する作業であり、ファイルが存在する場合に `--force` なしで拒否されます。未利用のメンバーは報告されるだけであり、推測されることはありません。

「Working context」とはアセンブルされたセットそのものであり、`openspec/config.yaml` の `context:` フィールドは、指示に注入されるプロジェクトの背景情報であり—これらは異なるものです。`openspec doctor` はそのセットが健全であるかを回答し、`openspec context` はそのセットが何であるかを回答します。

## 個人用ワークセット (Personal worksets)

> **ベータ版。** ワークセットは新しいベータ機能の一部です。コマンド、フラグ、ファイル形式はリリースによって変更される可能性があります。ウォークスルーについては、[ストアガイド](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together)を参照してください。

ワークセットとは、一緒に作業するフォルダの個人的な名前付きビュー（計画ルートとその他選択したものを組み合わせたもの）であり、ローカルマシンに保存され、ツール内で名前によって再オープンされます。これは完全にローカルです。コミットされることはなく、共有されることもなく、宣言から派生することもなく、一つを削除してもメンバーフォルダには一切影響を与えません。

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` は短いガイド付きフローを実行します（または `--member` フラグを使用して非対話的に実行されます。最初のメンバーがプライマリとなり、そこからセッションが開始されます）。`open` は選択されたツールを起動します：エディタ（VS Code, Cursor）はすべてのメンバーを含むウィンドウを開き、戻ります。CLIエージェント（Claude Code, codex）はこのターミナルを各メンバーのセッションとして引き継ぎ、プロンプトは事前に埋められず、終了時に閉じます。オープン時に見つからないメンバーフォルダは注記付きでスキップされますが、残りは開かれます。保存されたツール設定は、`--tool` を使用してオープンごとに上書きできます。

新しいツールをサポートすることは、コードではなく設定です。すべてのツールは2つの起動スタイル（生成された `.code-workspace` で起動される `workspace-file` またはメンバーごとの1つのアタッチフラグを持つ `attach-dirs`）のいずれかであり、グローバルな `config.json` の `openers` キー（`openspec config edit` で開く）は、フィールドごとにツールを追加するか組み込み機能を調整します。

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

すべてのワークセットの状態は、グローバルデータディレクトリの `worksets/` フォルダ（保存されたビューと、オープンごとに再生成される `<name>.code-workspace` ファイル）に存在します。このフォルダを削除すると、その痕跡すべてが失われます。

---

## ブラウジングコマンド (Browsing Commands)

### `openspec list`

プロジェクト内の変更または仕様を一覧表示します。

```
openspec list [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--specs` | 変更ではなく仕様を一覧表示する |
| `--changes` | 変更を一覧表示する（デフォルト） |
| `--sort <order>` | `recent`（デフォルト）または `name` でソートする |
| `--json` | JSONとして出力する |

**例:**

```bash
# すべてのアクティブな変更を一覧表示する
openspec list

# すべての仕様を一覧表示する
openspec list --specs

# スクリプト用のJSON出力
openspec list --json
```

**出力（テキスト）:**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

仕様と変更を探索するための対話型ダッシュボードを表示します。

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
| `item-name` | なし | 変更または仕様の名前（省略された場合はプロンプトが表示される） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--type <type>` | タイプを指定: `change` または `spec`（曖昧でない場合は自動検出される） |
| `--json` | JSONとして出力する |
| `--no-interactive` | プロンプトを無効にする |

**変更固有のオプション:**

| オプション | 説明 |
|--------|-------------|
| `--deltas-only` | Delta仕様のみを表示する（JSONモード） |

**仕様固有のオプション:**

| オプション | 説明 |
|--------|-------------|
| `--requirements` | 要件のみを表示し、シナリオを除外する（JSONモード） |
| `--no-scenarios` | シナリオコンテンツを除外する（JSONモード） |
| `-r, --requirement <id>` | 1ベースのインデックスによる特定の要件を表示する（JSONモード） |

**例:**

```bash
# 対話型選択
openspec show

# 特定の変更を表示
openspec show add-dark-mode

# 特定の仕様を表示
openspec show auth --type spec

# 解析用のJSON出力
openspec show add-dark-mode --json
```

---

## 検証コマンド (Validation Commands)

### `openspec validate`

構造的な問題について変更と仕様を検証します。

```
openspec validate [item-name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `item-name` | なし | 検証する特定のアイテム（省略された場合はプロンプトが表示される） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--all` | すべての変更と仕様を検証する |
| `--changes` | すべての変更を検証する |
| `--specs` | すべての仕様を検証する |
| `--type <type>` | 名前が曖昧な場合のタイプ指定: `change` または `spec` |
| `--strict` | 厳格な検証モードを有効にする |
| `--json` | JSONとして出力する |
| `--concurrency <n>` | 最大並列検証数（デフォルト: 6、または `OPENSPEC_CONCURRENCY` 環境変数） |
| `--no-interactive` | プロンプトを無効にする |

**例:**

```bash
# 対話型検証
openspec validate

# 特定の変更を検証
openspec validate add-dark-mode

# すべての変更を検証する
openspec validate --changes

# CI/スクリプト用のすべてJSON出力での検証
openspec validate --all --json

# 並列処理数を増やした厳格な検証
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

## ライフサイクルコマンド (Lifecycle Commands)

### `openspec archive`

完了した変更をアーカイブし、delta仕様をメインの仕様にマージします。

```
openspec archive [change-name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | なし | アーカイブする変更（省略された場合はプロンプトが表示される） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `-y, --yes` | 確認プロンプトをスキップする |
| `--skip-specs` | 仕様の更新をスキップする（インフラストラクチャ/ツールング/ドキュメントのみの変更の場合） |
| `--no-validate` | 検証をスキップする（確認が必要） |

**例:**

```bash
# 対話型アーカイブ
openspec archive

# 特定の変更をアーカイブ
openspec archive add-dark-mode

# プロンプトなしでアーカイブ（CI/スクリプト）
openspec archive add-dark-mode --yes

# 仕様に影響しないツールングの変更をアーカイブ
openspec archive update-ci-config --skip-specs
```

**機能:**

1. 変更を検証する（`--no-validate` の場合を除く）
2. 確認プロンプトを表示する（`--yes` の場合を除く）
3. delta仕様を `openspec/specs/` にマージする
4. 変更フォルダを `openspec/changes/archive/YYYY-MM-DD-<name>/` に移動する

---

## ワークフローコマンド (Workflow Commands)

これらのコマンドは、成果物駆動型のOPSXワークフローをサポートします。人間が進捗を確認する場合も、エージェントが次のステップを決定する場合も役立ちます。

### `openspec new change`

解決されたOpenSpecルートに変更ディレクトリとオプションのチェックインメタデータを作成します。

```bash
openspec new change <name> [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--description <text>` | `index.md` に追加する説明文 |
| `--goal <text>` | 変更と一緒に保存するオプションの目標メタデータ |
| `--schema <name>` | 使用するワークフロースキーマ |
| `--store <id>` | OpenSpecルートとして使用するストアID（ストアとは、登録済みのスタンドアロンOpenSpecリポジトリです） |
| `--json` | JSONを出力する |

**例:**

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

変更の成果物完了ステータスを表示します。

```
openspec status [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--change <id>` | 変更名（省略された場合はプロンプトが表示される） |
| `--schema <name>` | スキーマのオーバーライド（変更の設定から自動検出される） |
| `--json` | JSONとして出力する |

**例:**

```bash
# 対話型のステータスチェック
openspec status

# 特定の変更のステータス
openspec status --change add-dark-mode

# エージェント使用用のJSON
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

成果物を作成したりタスクを適用したりするためのリッチな指示を取得します。AIエージェントが次に何を作成すべきかを理解するために使用されます。

```
openspec instructions [artifact] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `artifact` | なし | 成果物ID: `proposal`, `specs`, `design`, `tasks`, または `apply` |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--change <id>` | 変更名（非対話モードで必須） |
| `--schema <name>` | スキーマのオーバーライド |
| `--json` | JSONとして出力する |

**特殊なケース:** `apply` をアーティファクトとして使用して、タスクの実装指示を取得します。

**例:**

```bash
# 次の成果物に関する指示を取得
openspec instructions --change add-dark-mode

# 特定の成果物に関する指示を取得
openspec instructions design --change add-dark-mode

# apply/実装に関する指示を取得
openspec instructions apply --change add-dark-mode

# エージェント消費用のJSON
openspec instructions design --change add-dark-mode --json
```

**出力内容:**

*   成果物用のテンプレートコンテンツ
*   設定からのプロジェクトコンテキスト
*   依存する成果物からのコンテンツ
*   設定からの成果物ごとのルール

---

### `openspec templates`

スキーマ内のすべての成果物に対する解決済みテンプレートパスを表示します。

```
openspec templates [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--schema <name>` | 検査するスキーマ（デフォルト: `spec-driven`） |
| `--json` | JSONとして出力する |

**例:**

```bash
# デフォルトスキーマのテンプレートパスを表示
openspec templates

# カスタムスキーマのテンプレートを表示
openspec templates --schema my-workflow

# プログラムによる使用のためのJSON
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

利用可能なワークフロースキーマとその説明、成果物の流れを一覧表示します。

```
openspec schemas [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--json` | JSONとして出力する |

**例:**

```bash
openspec schemas
```

**出力:**

```
Available schemas:

  spec-driven (package)
    デフォルトの仕様駆動型開発ワークフロー
    流れ: proposal → specs → design → tasks

  my-custom (project)
    このプロジェクト向けのカスタムワークフロー
    流れ: research → proposal → tasks
```

## スキーマコマンド

カスタムワークフロースキーマの作成と管理に関するコマンド。

### `openspec schema init`

新しいプロジェクトローカルなスキーマを作成します。

```
openspec schema init <name> [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|---|---|---|
| `name` | はい | スキーマ名 (kebab-case) |

**オプション:**

| オプション | 説明 |
|---|---|
| `--description <text>` | スキーマの説明 |
| `--artifacts <list>` | アーティファクトIDのカンマ区切り (デフォルト: `proposal,specs,design,tasks`) |
| `--default` | プロジェクトのデフォルトスキーマとして設定 |
| `--no-default` | デフォルト設定のプロンプトを表示しない |
| `--force` | 既存のスキーマを上書き |
| `--json` | JSON形式で出力 |

**例:**

```bash
# 対話形式でのスキーマ作成
openspec schema init research-first

# 特定のアーティファクトを指定した非対話形式
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**作成されるファイル:**

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

既存のスキーマをコピーして、プロジェクトでカスタマイズします。

```
openspec schema fork <source> [name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|---|---|---|
| `source` | はい | コピーするスキーマ |
| `name` | いいえ | 新しいスキーマ名 (デフォルト: `<source>-custom`) |

**オプション:**

| オプション | 説明 |
|---|---|
| `--force` | 既存の宛先を上書き |
| `--json` | JSON形式で出力 |

**例:**

```bash
# 内蔵されているspec-drivenスキーマをフォークする
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
|---|---|---|
| `name` | いいえ | 検証するスキーマ (省略された場合はすべて検証) |

**オプション:**

| オプション | 説明 |
|---|---|
| `--verbose` | 詳細な検証ステップを表示 |
| `--json` | JSON形式で出力 |

**例:**

```bash
# 特定のスキーマを検証
openspec schema validate my-workflow

# すべてのスキーマを検証
openspec schema validate
```

---

### `openspec schema which`

スキーマがどこから解決されているかを表示します (優先順位のデバッグに便利です)。

```
openspec schema which [name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|---|---|---|
| `name` | いいえ | スキーマ名 |

**オプション:**

| オプション | 説明 |
|---|---|
| `--all` | すべてのスキーマとそのソースをリスト表示 |
| `--json` | JSON形式で出力 |

**例:**

```bash
# スキーマがどこから来ているかを確認
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
3. パッケージ: 内蔵スキーマ

---

## 設定コマンド

### `openspec config`

グローバルなOpenSpec設定の表示と変更。

```
openspec config <subcommand> [options]
```

**サブコマンド:**

| サブコマンド | 説明 |
|---|---|
| `path` | 設定ファイルの場所を表示 |
| `list` | すべての設定を表示 |
| `get <key>` | 特定の値を取得 |
| `set <key> <value>` | 値を設定 |
| `unset <key>` | キーを削除 |
| `reset` | デフォルトにリセット |
| `edit` | `$EDITOR` で開く |
| `profile [preset]` | ワークフロープロファイルを対話形式またはプリセット経由で設定 |

**例:**

```bash
# 設定ファイルパスを表示
openspec config path

# すべての設定をリスト表示
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

# エディタで設定を開く
openspec config edit

# アクションベースのウィザードでプロファイルを構成
openspec config profile

# 高速プリセット: ワークフローをcoreに切り替える (デリバリーモードは維持)
openspec config profile core
```

`openspec config profile` は、現在の状態サマリーから始まり、以下の選択肢を提供します。
- デリバリーとワークフローの変更
- デリバリーのみの変更
- ワークフローのみの変更
- 現在の設定を維持 (終了)

現在の設定を維持した場合、何も変更は書き込まれず、更新プロンプトも表示されません。
設定の変更がないにもかかわらず、現在のプロジェクトファイルがグローバルなプロフィール/デリバリーと同期していない場合、OpenSpec は警告を表示し `openspec update` を提案します。
`Ctrl+C` を押してもフローはクリーンにキャンセルされ (スタックトレースなし)、コード `130` で終了します。
ワークフローチェックリストにおいて、`[x]` はグローバル設定でそのワークフローが選択されていることを意味します。これらの選択をプロジェクトファイルに適用するには、`openspec update` を実行するか、プロジェクト内でプロンプトが表示されたときに「このプロジェクトに変更を適用しますか？」を選択してください。

**対話形式の例:**

```bash
# デリバリーのみの更新
openspec config profile
# 選択: デリバリーの変更のみ
# 選択: デリバリー: スキルのみ

# ワークフローのみの更新
openspec config profile
# 選択: ワークフローの変更のみ
# チェックリストでワークフローをトグルし、確認する
```

---

## ユーティリティコマンド

### `openspec feedback`

OpenSpecに関するフィードバックを送信します。GitHub Issueを作成します。

```
openspec feedback <message> [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|---|---|---|
| `message` | はい | フィードバックメッセージ |

**オプション:**

| オプション | 説明 |
|---|---|
| `--body <text>` | 詳細な説明 |

**要件:** GitHub CLI (`gh`) がインストールされ、認証されていること。

**例:**

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

**サブコマンド:**

| サブコマンド | 説明 |
|---|---|
| `generate [shell]` | 補完スクリプトをstdoutに出力 |
| `install [shell]` | シェルに補完をインストール |
| `uninstall [shell]` | インストールされた補完を削除 |

**サポートされているシェル:** `bash`, `zsh`, `fish`, `powershell`

**例:**

```bash
# 補完をインストール (シェルの自動検出を行う)
openspec completion install

# 特定のシェルにインストール
openspec completion install zsh

# 手動インストールのためのスクリプトを生成
openspec completion generate bash > ~/.bash_completion.d/openspec

# アンインストール
openspec completion uninstall
```

---

## 終了コード

| コード | 意味 |
|---|---|
| `0` | 成功 |
| `1` | エラー (検証失敗、ファイル不足など) |

---

## 環境変数

| 変数 | 説明 |
|---|---|
| `OPENSPEC_TELEMETRY` | `0` に設定するとテレメトリーを無効にする |
| `DO_NOT_TRACK` | `1` に設定するとテレメトリーを無効にする (標準のDNTシグナル) |
| `OPENSPEC_CONCURRENCY` | 一括検証のデフォルト並列数 (デフォルト: 6) |
| `EDITOR` または `VISUAL` | `openspec config edit` 用のエディタ |
| `NO_COLOR` | 設定するとカラー出力を無効にする |

---

## 関連ドキュメント

- [Commands](commands.md) - AIスラッシュコマンド (`/opsx:propose`, `/opsx:apply` など)
- [Workflows](workflows.md) - 一般的なパターンと各コマンドの使用タイミング
- [Customization](customization.md) - カスタムスキーマとテンプレートの作成
- [Getting Started](getting-started.md) - 初回セットアップガイド