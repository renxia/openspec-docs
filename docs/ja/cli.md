# CLI リファレンス

OpenSpec CLI (`openspec`) は、プロジェクトのセットアップ、検証、ステータス確認、管理のためのターミナルコマンドを提供します。これらのコマンドは、[Commands](commands.md) に記載されている AI スラッシュコマンド（`/opsx:propose` など）を補完するものです。

## 概要

| カテゴリ | コマンド | 目的 |
|----------|----------|------|
| **セットアップ** | `init`, `update` | プロジェクト内で OpenSpec を初期化および更新します |
| **ストア（スタンドアロン OpenSpec リポジトリ）** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | ストアを管理します — 登録したスタンドアロン OpenSpec リポジトリ |
| **正常性** | `doctor` | 解決されたルートの関係の正常性を報告します |
| **作業コンテキスト** | `context` | 作業セット（ルート + 参照ストア）を組み立てます |
| **個人ワークセット** | `workset create`, `workset list`, `workset open`, `workset remove` | ツール内で個人用のローカル作業ビューを保持して開きます |
| **参照** | `list`, `view`, `show` | 変更と仕様を参照します |
| **検証** | `validate` | 変更と仕様の問題を確認します |
| **ライフサイクル** | `archive` | 完了した変更を確定します |
| **ワークフロー** | `new change`, `status`, `instructions`, `templates`, `schemas` | 成果物駆動ワークフローのサポート |
| **スキーマ** | `schema init`, `schema fork`, `schema validate`, `schema which` | カスタムワークフローを作成および管理します |
| **設定** | `config` | 設定を表示および変更します |
| **ユーティリティ** | `feedback`, `completion` | フィードバックとシェル統合 |

---

## 人間用コマンドとエージェント用コマンド

ほとんどのCLIコマンドは**人間による使用**を想定して端末上で設計されています。一部のコマンドは、JSON出力による**エージェント/スクリプト使用**もサポートしています。

### 人間専用コマンド

これらのコマンドはインタラクティブで、端末使用を目的として設計されています：

| コマンド | 目的 |
|---------|------|
| `openspec init` | プロジェクトを初期化（インタラクティブなプロンプト） |
| `openspec view` | インタラクティブなダッシュボード |
| `openspec workset open <name>` | 保存されたワークセットを開く（エディタウィンドウまたは端末エージェントセッション） |
| `openspec config edit` | 設定をエディタで開く |
| `openspec feedback` | GitHub経由でフィードバックを送信 |
| `openspec completion install` | シェル補完をインストール |

### エージェント対応コマンド

これらのコマンドは、AIエージェントやスクリプトによるプログラム的な使用のために `--json` 出力をサポートしています：

| コマンド | 人間による使用 | エージェントによる使用 |
|---------|--------------|----------------------|
| `openspec list` | 変更/仕様を閲覧 | `--json` で構造化データを取得 |
| `openspec show <item>` | コンテンツを読み取り | `--json` で解析可能な形式で取得 |
| `openspec validate` | 問題がないか確認 | `--all --json` で一括検証 |
| `openspec status` | アーティファクトの進捗を確認 | `--json` で構造化されたステータスを取得 |
| `openspec instructions` | 次の手順を取得 | `--json` でエージェント向け指示を取得 |
| `openspec templates` | テンプレートのパスを検索 | `--json` でパス解決 |
| `openspec schemas` | 利用可能なスキーマを一覧表示 | `--json` でスキーマ検出 |
| `openspec store setup <id>` | ローカルストアを作成して登録 | `--json` で明示的な入力による構造化されたセットアップ出力を取得 |
| `openspec store register <path>` | 既存のストアを登録 | `--json` で構造化された登録出力を取得 |
| `openspec store unregister <id>` | ローカルストアの登録を解除 | `--json` で構造化されたクリーンアップ出力を取得 |
| `openspec store remove <id>` | 登録されたローカルストアフォルダを削除 | `--yes --json` で非対話的な削除を実行 |
| `openspec store list` | 登録されたストアを閲覧 | `--json` で構造化された登録情報を取得 |
| `openspec store doctor` | ローカルストアのセットアップを確認 | `--json` で構造化された診断情報を取得 |
| `openspec new change <id>` | リポジトリローカルの変更スキャフォールディングを作成 | `--json`、および `--store <id>` で登録済みストアをOpenSpecルートとして使用 |
| `openspec workset create [name]` | 個人用の作業ビューを構成 | `--member <path> --json` で非対話的な構成を実行 |
| `openspec workset list` | 保存されたワークセットを閲覧 | `--json` で構造化されたビューを取得 |
| `openspec workset remove <name>` | 保存されたビューを削除 | `--yes --json` で非対話的な削除を実行 |

---

## グローバルオプション

これらのオプションはすべてのコマンドで機能します：

| オプション | 説明 |
|------------|------|
| `--version`, `-V` | バージョン番号を表示 |
| `--no-color` | カラー出力を無効化 |
| `--help`, `-h` | コマンドのヘルプを表示 |

---

## セットアップコマンド

### `openspec init`

プロジェクトでOpenSpecを初期化します。フォルダ構造を作成し、AIツール統合を設定します。

デフォルトの動作ではグローバル設定のデフォルトを使用します：プロファイル `core`、配信 `both`、ワークフロー `propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|------|------|------|
| `path` | いいえ | 対象ディレクトリ（デフォルト：カレントディレクトリ） |

**オプション：**

| オプション | 説明 |
|------------|------|
| `--tools <list>` | AIツールを非対話的に設定。`all`、`none`、またはカンマ区切りリストを使用 |
| `--force` | プロンプトなしでレガシーファイルを自動クリーンアップ |
| `--profile <profile>` | このinit実行のグローバルプロファイルを上書き（`core` または `custom`） |

`--profile custom` は、グローバル設定で現在選択されているワークフロー（`openspec config profile`）を使用します。

**サポートされているツールID（`--tools`）：** `amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`codeartsagent`、`codex`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`hermes`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`vibe`、`oh-my-pi`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`trae`、`windsurf`、`zcode`

> このリストは `src/core/config.ts` の `AI_TOOLS` と一致します。各ツールのスキルとコマンドパスについては、[サポートツール](supported-tools.md)を参照してください。

**例：**

```bash
# インタラクティブな初期化
openspec init

# 特定のディレクトリに初期化
openspec init ./my-project

# 非対話的：ClaudeとCursor用に設定
openspec init --tools claude,cursor

# すべてのサポートツール用に設定
openspec init --tools all

# この実行のプロファイルを上書き
openspec init --profile core

# プロンプトをスキップし、レガシーファイルを自動クリーンアップ
openspec init --force
```

**作成されるもの：**

```
openspec/
├── specs/              # 仕様（信頼できる情報源）
├── changes/            # 提案された変更
└── config.yaml         # プロジェクト設定

.claude/skills/         # Claude Codeスキル（claudeを選択した場合）
.cursor/skills/         # Cursorスキル（cursorを選択した場合）
.cursor/commands/       # Cursor OPSXコマンド（配信にコマンドが含まれる場合）
... （その他のツール設定）
```

---

### `openspec update`

CLIのアップグレード後にOpenSpecの指示ファイルを更新します。現在のグローバルプロファイル、選択されたワークフロー、配信モードを使用してAIツール設定ファイルを再生成します。

```
openspec update [path] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|------|------|------|
| `path` | いいえ | 対象ディレクトリ（デフォルト：カレントディレクトリ） |

**オプション：**

| オプション | 説明 |
|------------|------|
| `--force` | ファイルが最新の場合でも強制的に更新 |

**例：**

```bash
# npmアップグレード後に指示ファイルを更新
npm update @fission-ai/openspec
openspec update
```

---

## ストア（スタンドアロンOpenSpecリポジトリ）

> **ベータ版。** ストアとそれに基づく機能（参照、作業コンテキスト、ワークセット）は新機能です。コマンド名、フラグ、ファイル形式、JSON出力はリリース間で変更される可能性があります。問題ファーストのウォークスルーについては、[ストアガイド](stores-beta/user-guide.md)を参照してください。

ストアとは、このマシン上に登録されたスタンドアロンOpenSpecリポジトリのことです（例：計画リポジトリやコントラクトリポジトリ）。ストアを登録することで、通常のコマンド（`list`、`show`、`status`、`validate`、`new change`、`archive` など）を `--store <id>` を渡すことでどこからでもそのストア内で実行できるようになります。

### `openspec store setup`

ローカルストアを作成して登録します。端末で引数なしで実行した場合、OpenSpecはユーザーをセットアップ手順へ誘導します。エージェントやスクリプトは明示的な入力を渡し、`--json` を使用してください。

```bash
openspec store setup [id] [options]
```

**オプション：**

| オプション | 説明 |
|------------|------|
| `--path <path>` | ストアを作成するフォルダ（例：`~/openspec/<id>`） |
| `--remote <url>` | 新しいストアの `store.yaml` に正規リモートを記録 |
| `--init-git` | Gitリポジトリを初期コミット付きで初期化（デフォルト） |
| `--no-init-git` | すべてのGitアクションをスキップ：初期化も初回コミットも行わない |
| `--json` | JSONを出力 |

非対話的な実行（`--json`、スクリプト、エージェント）では、ストアIDと `--path` の両方を渡す必要があります。インタラクティブな端末では、セットアップが場所を尋ね、編集可能な提案をユーザーが所有する明確な場所（例：`~/openspec/<id>`）に表示します。OpenSpecの管理データディレクトリをデフォルトとすることはありません。

例：

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

既存のローカルストアフォルダを登録します。ストアのベータ期間中、変更が存在したり、仕様が適用されたり、変更がアーカイブされたりする前にルートを登録できます。その場合、`openspec/changes/`、`openspec/specs/`、`openspec/changes/archive/` は通常のコマンドが作成するまで存在しない可能性があります。`store: <id>` を宣言する設定のみのリポジトリは、別のストアへのポインタとして機能し、そのポインタが削除されない限りストアルートとして登録されません。

```bash
openspec store register [path] [options]
```

**オプション：**

| オプション | 説明 |
|------------|------|
| `--id <id>` | ストアID。デフォルトはストアメタデータまたはフォルダ名 |
| `--yes` | 正常なOpenSpecルートのストアアイデンティティメタデータを作成することを確認 |
| `--json` | JSONを出力 |

### `openspec store unregister`

ファイルを削除せずにローカルストアの登録を解除します。

```bash
openspec store unregister <id> [--json]
```

ストアが移動されたり、別の場所にクローンされたり、このマシン上のOpenSpecに表示されなくなったりした場合に使用してください。

### `openspec store remove`

ローカルストアの登録を解除し、ローカルフォルダを削除します。

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` は、削除前に正確なフォルダをインタラクティブな端末に表示します。エージェント、スクリプト、JSON呼び出し元は削除を確認するために `--yes` を渡す必要があります。OpenSpecは、一致するストアメタデータを含まないフォルダの削除を拒否します。

### `openspec store list`

ローカルに登録されたストアを一覧表示します。

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

ローカルストアの登録、メタデータ、Gitの存在を確認します。

```bash
openspec store doctor [id] [--json]
```

Doctorは診断専用です。ストアを変更せずに、欠落しているルート、メタデータの不一致、無効なローカルレジストリの状態を報告します。

### プロジェクトからのストア参照

プロジェクトリポジトリは、`openspec/config.yaml` で作業が参照するストアを宣言できます：

```yaml
schema: spec-driven
references:
  - team-context
```

その後、そのリポジトリの `openspec instructions` 出力（アーティファクトごとおよび `apply` サーフェスの両方、JSONおよび人間モード）には、各参照ストアの仕様のインデックスが含まれます（仕様ID、各仕様のPurposeセクションからの1行の要約、取得コマンド `openspec show <spec-id> --type spec --store <id>`）。インデックスは実行ごとに登録済みチェックアウトからライブで構築されます。仕様コンテンツが出力にコピーされることはありません。

参照は読み取り専用のコンテキストです。コマンドが動作する場所を変更することはありません：作業はリポジトリ自身のルートに留まり、参照ストアへの書き込みは明示的な `--store` アクションです。解決できない参照（例：このマシンに登録されていないストア）は、正確な修正方法と共にインデックスの警告に低下し、指示は引き続き生成されます。`openspec doctor` は1つの場所で参照の正常性を報告します。

### ストアのクローン元の記録

ストアは、コミット済みのアイデンティティファイルに正規クローン元を記録できるため、オンボーディング時に「ストアを登録」で行き詰まることがなくなります：

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

リモートは初期コミット内の `.openspec-store/store.yaml` に格納されるため、すべてのクローンはそれを認識して生まれます。既存のストアの場合は、`store.yaml` を手動で編集してコミットしてください。`store doctor` は記録されたリモート（およびチェックアウトの観測Git起点）を表示します。setup/registerの共有ガイダンスはそれを名前で示し、registerはマシンローカルレジストリにチェックアウトの起点を記録します。

参照宣言もクローン元を運べるため、まだストアを持っていないチームメイトは完全で貼り付け可能な修正（`git clone <remote> <path> && openspec store register <path> --id <id>`）を取得できます：

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

リモートの記録は同期ではありません：OpenSpecは独自にクローン、プル、プッシュを行いません。

### デフォルトストアの宣言

計画が完全に外部化されているリポジトリ（ローカルの `openspec/specs/` や `openspec/changes/` がない）は、すべてのコマンドで `--store` を渡す代わりにストアを1回宣言できます：

```yaml
# openspec/config.yaml （openspec/ の下にある唯一のファイル）
store: team-context
```

通常のコマンドはその後、宣言されたストアに自動的に解決されます。ルートバナーとJSONの `root` ブロックはストアIDで `source: "declared"` を報告し、印刷されたヒントには引き続き `--store <id>` が含まれます。この宣言はフォールバックであり、決してオーバーライドではありません：明示的な `--store` が常に優先され、実際の計画フォルダを含むディレクトリはポインタを無視します（警告付き）。ポインタリポジトリをローカルOpenSpecルートに変換するには、`store:` 行を削除して `openspec init` を実行してください。宣言が存在する間、initはスキャフォールディングを拒否します。

マシンレベルのバリアントはすべてのリポジトリを一度にカバーします：`openspec config set defaultStore <id>`（設定を参照）。`--store`、ローカルルート、プロジェクトポインタのいずれも解決に失敗した場合にのみ参照され、ルートバナーとJSONの `root` ブロックは `source: "global_default"` を報告します。

## Doctor（関係の健全性）

1つの読み取り専用の質問、1つの場所：OpenSpecルートが健全か、そしてこのマシンで参照されているストアが利用可能か？

```bash
openspec doctor [--store <id>] [--json]
```

レポートは、ルートの健全性、ストアメタデータの健全性（記録されたリモートとチェックアウトの原点が分岐した場合の注記、およびストアチェックアウトが最後にフェッチした上流トラッキングリファレンスより遅れている場合の注記を含む）、および参照の健全性（同じ診断手順を表示し、未解決の参照に対するクローン修正を表示）に分けられます。あらゆる重大度の健全性調査結果は終了コード0で終了します——エージェントは`status`配列を読み取ります。コマンド失敗（ルートなし、不明なストア）の場合にのみ終了コード1で終了します。Doctorはクローン、同期、修復を一切行いません。健全性自体ではなく、アセンブルされたセット自体を取得するには、`openspec context`を使用してください。

## 作業コンテキスト（アセンブルされたセット）

OpenSpec宣言を通じてこの作業が関連するすべてのものを、1つの作業セットにまとめたもの：OpenSpecルートとそれが参照するストア。

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON概要はエージェントが消費可能です（利用可能な各参照ストアにはフェッチレシピが含まれます。未解決のメンバーには、同じ修正手順とdoctorの表示が含まれます）。`--code-workspace`はさらに、ルートと利用可能な参照ストア（`ref:<id>`フォルダ）を含むVS Codeワークスペースファイルを書き込みます——このコマンドが実行する唯一の書き込み操作で、ファイルが存在する場合は`--force`なしでは拒否されます。利用できないメンバーは報告されますが、推測されることはありません。

"作業コンテキスト"はアセンブルされたセットです。`openspec/config.yaml`の`context:`フィールドは、手順に注入されるプロジェクト背景です——これらは2つの異なるものです。`openspec doctor`はセットが健全かどうかに答え、`openspec context`はセットが何であるかに答えます。

## 個人用ワークセット

> **ベータ版。** ワークセットは新機能のベータ版の一部です。コマンド、フラグ、ファイル形式はリリース間で変更される可能性があります。詳細な手順については、[ストアガイド](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together)を参照してください。

ワークセットとは、共同で作業するフォルダの個人用かつ名前付きビューです。計画ルートと、ユーザーが選択したその他のフォルダで構成され、ユーザーのマシン上に保存され、ツール内で名前を指定して再度開くことができます。これは完全にローカルな機能であり、コミットされることも共有されることもなく、宣言から派生することもなく、削除してもメンバーフォルダに影響を与えることはありません。

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` は短いガイド付きフローを実行します（または `--member` フラグを使用して非対話的に実行することも可能です。最初のメンバーがプライマリです — セッションはそこから開始されます）。`open` は選択したツールを起動します：エディタ（VS Code、Cursor）は全メンバーを含むウィンドウを開いて終了します。CLIエージェント（Claude Code、codex）はこのターミナルを全メンバーがアタッチされたセッションとして引き継ぎ、プロンプトは事前に入力されず、ユーザーが終了するまでセッションは継続します。開く際にメンバーフォルダが存在しない場合は、注記とともにスキップされ、残りは開かれます。保存されたツール設定は、`--tool` を指定することで開くごとに上書きできます。

新しいツールのサポートはコードではなく設定で行えます。各ツールは2種類の起動スタイルのいずれかに対応しています — `workspace-file`（生成された `.code-workspace` で起動）または `attach-dirs`（メンバーごとに1つのアタッチフラグ） — で、グローバル `config.json` 内の `openers` キー（`openspec config edit` で開く）でツールを追加したり、フィールドごとに組み込みの設定を調整したりできます：

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

すべてのワークセットの状態は、グローバルデータディレクトリの `worksets/` フォルダに保存されます（保存されたビューと、生成された `<name>.code-workspace` ファイル。開くたびに再生成されます）。このフォルダを削除すると、すべての痕跡が削除されます。

---

## ブラウジングコマンド

### `openspec list`

プロジェクト内の変更または仕様を一覧表示します。

```
openspec list [options]
```

**オプション：**

| オプション | 説明 |
|------------|------|
| `--specs` | 変更の代わりに仕様を一覧表示 |
| `--changes` | 変更を一覧表示（デフォルト） |
| `--sort <order>` | `recent`（デフォルト）または `name` でソート |
| `--json` | JSON形式で出力 |

**例：**

```bash
# すべてのアクティブな変更を一覧表示
openspec list

# すべての仕様を一覧表示
openspec list --specs

# スクリプト用のJSON出力
openspec list --json
```

**出力（テキスト）：**

```
Changes:
  add-dark-mode     No tasks      just now
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

**引数：**

| 引数 | 必須 | 説明 |
|------|------|------|
| `item-name` | いいえ | 変更または仕様の名前（省略時はプロンプトが表示されます） |

**オプション：**

| オプション | 説明 |
|------------|------|
| `--type <type>` | タイプを指定：`change` または `spec`（曖昧でない場合は自動検出） |
| `--json` | JSON形式で出力 |
| `--no-interactive` | プロンプトを無効化 |

**変更固有のオプション：**

| オプション | 説明 |
|------------|------|
| `--deltas-only` | デルタ仕様のみを表示（JSONモード） |

**仕様固有のオプション：**

| オプション | 説明 |
|------------|------|
| `--requirements` | 要件のみを表示し、シナリオを除外（JSONモード） |
| `--no-scenarios` | シナリオの内容を除外（JSONモード） |
| `-r, --requirement <id>` | 1から始まるインデックスで特定の要件を表示（JSONモード） |

**例：**

```bash
# インタラクティブな選択
openspec show

# 特定の変更を表示
openspec show add-dark-mode

# 特定の仕様を表示
openspec show auth --type spec

# 解析用のJSON出力
openspec show add-dark-mode --json
```

---

## 検証コマンド

### `openspec validate`

変更と仕様の構造的な問題を検証します。

```
openspec validate [item-name] [options]
```

デルタ仕様が0件の変更は、`.openspec.yaml` で `skip_specs: true` が宣言されていない限り、検証に失敗します（純粋なリファクタリング、ツール、ドキュメント作業の場合 — [レシピ5](examples.md#recipe-5-a-refactor-with-no-behavior-change)を参照）。

**引数：**

| 引数 | 必須 | 説明 |
|------|------|------|
| `item-name` | いいえ | 検証する特定のアイテム（省略時はプロンプトが表示されます） |

**オプション：**

| オプション | 説明 |
|------------|------|
| `--all` | すべての変更と仕様を検証 |
| `--changes` | すべての変更を検証 |
| `--specs` | すべての仕様を検証 |
| `--type <type>` | 名前が曖昧な場合にタイプを指定：`change` または `spec` |
| `--strict` | 厳格な検証モードを有効化 |
| `--json` | JSON形式で出力 |
| `--concurrency <n>` | 最大並列検証数（デフォルト：6、または `OPENSPEC_CONCURRENCY` 環境変数） |
| `--no-interactive` | プロンプトを無効化 |

**例：**

```bash
# インタラクティブな検証
openspec validate

# 特定の変更を検証
openspec validate add-dark-mode

# すべての変更を検証
openspec validate --changes

# JSON出力で全てを検証（CI/スクリプト用）
openspec validate --all --json

# 厳格な検証と並列処理の増加
openspec validate --all --strict --concurrency 12
```

**出力（テキスト）：**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
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

完了した変更をアーカイブし、デルタ仕様をメインの仕様にマージします。

```
openspec archive [change-name] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|------|------|------|
| `change-name` | いいえ | アーカイブする変更（省略時はプロンプトが表示されます） |

**オプション：**

| オプション | 説明 |
|------------|------|
| `-y, --yes` | 確認プロンプトをスキップ |
| `--skip-specs` | 1回のアーカイブ実行で仕様の更新をスキップします。恒久的にデルタ仕様を持たない変更は、代わりに `.openspec.yaml` で `skip_specs: true` を宣言してください — フラグなしでアーカイブされます |
| `--no-validate` | 検証をスキップ（確認が必要です） |

**例：**

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

**処理内容：**

1. 変更を検証します（`--no-validate` の場合を除く）
2. 確認を求めます（`--yes` の場合を除く）
3. デルタ仕様を `openspec/specs/` にマージ
4. 変更フォルダを `openspec/changes/archive/YYYY-MM-DD-<name>/` に移動

---

## ワークフローコマンド

これらのコマンドは、アーティファクト駆動型OPSXワークフローをサポートします。進捗状況を確認する人間と、次のステップを判断するエージェントの両方に役立ちます。

### `openspec new change`

変更ディレクトリを作成し、解決されたOpenSpecルートにオプションでチェックインされたメタデータを追加します。

```bash
openspec new change <name> [options]
```

変更名は小文字のケバブケースを使用する必要があります。小文字で始まり、その後に小文字、数字、および単一のハイフンを含みます。数字で始めること、スペース、アンダースコア、大文字、連続するハイフン、先頭または末尾のハイフンを含めることはできません。外部チケットIDを含める場合は、プレフィックスに単語を付けてください。例えば `123-add-notifications` の代わりに `ticket-123-add-notifications` を使用してください。

**オプション：**

| オプション | 説明 |
|------------|------|
| `--description <text>` | `index.md` に追加する説明 |
| `--goal <text>` | 変更とともに保存するオプションのゴールメタデータ |
| `--schema <name>` | 使用するワークフロースキーマ |
| `--store <id>` | OpenSpecルートとして使用するストアID（ストアとは、登録済みのスタンドアロンOpenSpecリポジトリです） |
| `--json` | JSONを出力 |

**例：**

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

変更のアーティファクト完了状況を表示します。

```
openspec status [options]
```

**オプション：**

| オプション | 説明 |
|------------|------|
| `--change <id>` | 変更名（省略時はプロンプトが表示されます） |
| `--schema <name>` | スキーマのオーバーライド（変更の設定から自動検出） |
| `--json` | JSON形式で出力 |

**例：**

```bash
# インタラクティブなステータス確認
openspec status

# 特定の変更のステータス
openspec status --change add-dark-mode

# エージェント使用のためのJSON
openspec status --change add-dark-mode --json
```

**出力（テキスト）：**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

`skip_specs: true` を宣言した変更は、仕様ステージを `[~] specs (skipped: change declares skip_specs)` と表示し、進捗カウントから除外されます。

**出力（JSON）：**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

アーティファクトの作成やタスクの適用に関する詳細な手順を取得します。AIエージェントが次に作成すべき内容を理解するために使用されます。

```
openspec instructions [artifact] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|------|------|------|
| `artifact` | いいえ | アーティファクトID：`proposal`、`specs`、`design`、`tasks`、または `apply` |

**オプション：**

| オプション | 説明 |
|------------|------|
| `--change <id>` | 変更名（非対話モードでは必須） |
| `--schema <name>` | スキーマのオーバーライド |
| `--json` | JSON形式で出力 |

**特殊ケース：** タスク実装の手順を取得するには、アーティファクトとして `apply` を使用してください。

**例：**

```bash
# 次のアーティファクトの手順を取得
openspec instructions --change add-dark-mode

# 特定のアーティファクトの手順を取得
openspec instructions design --change add-dark-mode

# 適用/実装の手順を取得
openspec instructions apply --change add-dark-mode

# エージェントが消費するためのJSON
openspec instructions design --change add-dark-mode --json
```

**出力に含まれる内容：**

- アーティファクトのテンプレート内容
- 設定からのプロジェクトコンテキスト
- 依存アーティファクトからの内容
- 設定からのアーティファクトごとのルール

`skip_specs: true` でスキップされたアーティファクトの場合、出力は警告のみです（JSONは `skipped`/`warning` フィールドを追加します）— そのアーティファクトを作成してはなりません。

---

### `openspec templates`

スキーマ内のすべてのアーティファクトの解決済みテンプレートパスを表示します。

```
openspec templates [options]
```

**オプション：**

| オプション | 説明 |
|------------|------|
| `--schema <name>` | 検査するスキーマ（デフォルト：`spec-driven`） |
| `--json` | JSON形式で出力 |

**例：**

```bash
# デフォルトスキーマのテンプレートパスを表示
openspec templates

# カスタムスキーマのテンプレートを表示
openspec templates --schema my-workflow

# プログラム使用のためのJSON
openspec templates --json
```

**出力（テキスト）：**

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

アーティファクトフローと説明を含む、利用可能なワークフロースキーマを一覧表示します。

```
openspec schemas [options]
```

**オプション：**

| オプション | 説明 |
|------------|------|
| `--json` | JSON形式で出力 |

**例：**

```bash
openspec schemas
```

**出力：**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

## スキーマコマンド

カスタムワークフロースキーマを作成・管理するためのコマンドです。

### `openspec schema init`

プロジェクトローカルの新しいスキーマを作成します。

```
openspec schema init <name> [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|------|------|------|
| `name` | はい | スキーマ名（ケバブケース） |

**オプション：**

| オプション | 説明 |
|------------|------|
| `--description <text>` | スキーマの説明 |
| `--artifacts <list>` | カンマ区切りのアーティファクトID（デフォルト：`proposal,specs,design,tasks`） |
| `--default` | プロジェクトのデフォルトスキーマとして設定 |
| `--no-default` | デフォルトに設定するかどうかの確認を表示しない |
| `--force` | 既存のスキーマを上書き |
| `--json` | JSON形式で出力 |

**使用例：**

```bash
# インタラクティブなスキーマ作成
openspec schema init research-first

# 特定のアーティファクトを指定した非インタラクティブモード
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**作成されるファイル：**

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
|------|------|------|
| `source` | はい | コピーするスキーマ |
| `name` | いいえ | 新しいスキーマ名（デフォルト：`<source>-custom`） |

**オプション：**

| オプション | 説明 |
|------------|------|
| `--force` | 既存のコピー先を上書き |
| `--json` | JSON形式で出力 |

**使用例：**

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
|------|------|------|
| `name` | いいえ | 検証するスキーマ（省略時はすべて検証） |

**オプション：**

| オプション | 説明 |
|------------|------|
| `--verbose` | 詳細な検証ステップを表示 |
| `--json` | JSON形式で出力 |

**使用例：**

```bash
# 特定のスキーマを検証
openspec schema validate my-workflow

# すべてのスキーマを検証
openspec schema validate
```

---

### `openspec schema which`

スキーマがどの場所から解決されるかを表示します（優先順位のデバッグに便利）。

```
openspec schema which [name] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|------|------|------|
| `name` | いいえ | スキーマ名 |

**オプション：**

| オプション | 説明 |
|------------|------|
| `--all` | すべてのスキーマとそのソースを一覧表示 |
| `--json` | JSON形式で出力 |

**使用例：**

```bash
# スキーマの場所を確認
openspec schema which spec-driven
```

**出力例：**

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

OpenSpecのグローバル設定を表示・変更します。

```
openspec config <subcommand> [options]
```

**サブコマンド：**

| サブコマンド | 説明 |
|-------------|------|
| `path` | 設定ファイルの場所を表示 |
| `list` | 現在のすべての設定を表示 |
| `get <key>` | 特定の値を取得 |
| `set <key> <value>` | 値を設定 |
| `unset <key>` | キーを削除 |
| `reset` | デフォルトにリセット |
| `edit` | `$EDITOR`で開く |
| `profile [preset]` | ワークフロープロファイルをインタラクティブにまたはプリセット経由で設定 |

**使用例：**

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

# マシンレベルのデフォルトストアを設定（--store、ローカルルート、またはプロジェクトストアがない場合のフォールバックルート：ポインターが解決されます）
openspec config set defaultStore team-plans

# すべての設定をリセット
openspec config reset --all --yes

# エディタで設定を編集
openspec config edit

# アクションベースのウィザードでプロファイルを設定
openspec config profile

# 高速プリセット：ワークフローをcoreに切り替え（デリバリーモードは保持）
openspec config profile core
```

`openspec config profile`は現在の状態のサマリーから始まり、以下から選択できます：
- デリバリーとワークフローの両方を変更
- デリバリーのみ変更
- ワークフローのみ変更
- 現在の設定を維持（終了）

現在の設定を維持した場合、変更は書き込まれず、更新を促すプロンプトも表示されません。
設定に変更がなくても、現在のプロジェクトファイルがグローバルプロファイル/デリバリーと同期していない場合、OpenSpecは警告を表示し、`openspec update`を提案します。
`Ctrl+C`を押すと、フローがクリーンにキャンセルされ（スタックトレースは表示されず）、終了コード`130`で終了します。
ワークフローチェックリストでは、`[x]`はグローバル設定でワークフローが選択されていることを意味します。これらの選択をプロジェクトファイルに適用するには、`openspec update`を実行してください（またはプロジェクト内でプロンプトが表示されたときに「今すぐこのプロジェクトに変更を適用しますか？」を選択してください）。

**インタラクティブな使用例：**

```bash
# デリバリーのみ更新
openspec config profile
# 選択：デリバリーのみ変更
# デリバリーを選択：Skills only

# ワークフローのみ更新
openspec config profile
# 選択：ワークフローのみ変更
# チェックリストでワークフローを切り替え、確認
```

---

## ユーティリティコマンド

### `openspec feedback`

OpenSpecに関するフィードバックを送信します。GitHubのissueを作成します。

```
openspec feedback <message> [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|------|------|------|
| `message` | はい | フィードバックメッセージ |

**オプション：**

| オプション | 説明 |
|------------|------|
| `--body <text>` | 詳細な説明 |

**要件：** GitHub CLI（`gh`）がインストールされ、認証されている必要があります。

**使用例：**

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
|-------------|------|
| `generate [shell]` | 補完スクリプトを標準出力に出力 |
| `install [shell]` | 使用中のシェルに補完をインストール |
| `uninstall [shell]` | インストール済みの補完を削除 |

**対応シェル：** `bash`、`zsh`、`fish`、`powershell`

**使用例：**

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
|--------|------|
| `0` | 成功 |
| `1` | エラー（検証失敗、ファイルが見つからないなど） |

---

## 環境変数

| 変数 | 説明 |
|------|------|
| `OPENSPEC_TELEMETRY` | `0`に設定するとテレメトリーを無効化 |
| `DO_NOT_TRACK` | `1`に設定するとテレメトリーを無効化（標準のDNTシグナル） |
| `OPENSPEC_CONCURRENCY` | 一括検証のデフォルト並行数（デフォルト：6） |
| `EDITOR`または`VISUAL` | `openspec config edit`で使用するエディタ |
| `NO_COLOR` | 設定するとカラー出力を無効化 |

---

## 関連ドキュメント

- [コマンド](commands.md) - AIスラッシュコマンド（`/opsx:propose`、`/opsx:apply`など）
- [ワークフロー](workflows.md) - 一般的なパターンと各コマンドの使用タイミング
- [カスタマイズ](customization.md) - カスタムスキーマとテンプレートの作成
- [はじめに](getting-started.md) - 初回セットアップガイド