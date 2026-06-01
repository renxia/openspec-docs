# CLI リファレンス

OpenSpec CLI (`openspec`) は、プロジェクトのセットアップ、検証、ステータスの確認、管理のためのターミナルコマンドを提供します。これらのコマンドは、[コマンド](commands.md)で文書化されているAIスラッシュコマンド（`/opsx:propose`など）を補完するものです。

## サマリー

| カテゴリ | コマンド | 目的 |
|----------|----------|------|
| **セットアップ** | `init`, `update` | プロジェクト内のOpenSpecの初期化と更新 |
| **ワークスペース (ベータ)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | リンクされたリポジトリやフォルダに対するローカルビューをセットアップする |
| **共有コンテキスト (ベータ)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | ローカルのコンテキストストア登録と永続的なイニシアティブコンテキストを管理する |
| **閲覧** | `list`, `view`, `show` | 変更や仕様を閲覧する |
| **検証** | `validate` | 変更や仕様の問題をチェックする |
| **ライフサイクル** | `archive` | 完了した変更を確定する |
| **ワークフロー** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | アーティファクト主導のワークフロー支援 |
| **スキーマ** | `schema init`, `schema fork`, `schema validate`, `schema which` | カスタムワークフローの作成と管理 |
| **設定** | `config` | 設定の表示と変更 |
| **ユーティリティ** | `feedback`, `completion` | フィードバックとシェル統合 |

---

## Human vs Agent Commands

ほとんどのCLIコマンドは、ターミナルでの**人間による使用**を想定して設計されています。一部のコマンドは、JSON出力による**エージェント/スクリプトによる使用**もサポートしています。

### Human-Only Commands

これらのコマンドは対話型であり、ターミナルでの使用を想定しています：

| コマンド | 目的 |
|---------|---------|
| `openspec init` | プロジェクトの初期化 (対話型プロンプト) |
| `openspec view` | 対話型ダッシュボード |
| `openspec config edit` | エディタで設定を開く |
| `openspec feedback` | GitHub経由でフィードバックを送信する |
| `openspec completion install` | シェル補完をインストールする |

### Agent-Compatible Commands

これらのコマンドは、AIエージェントやスクリプトによるプログラム利用のために `--json` 出力をサポートしています：

| コマンド | 人間による使用 | エージェントによる使用 |
|---------|-----------|-----------|
| `openspec list` | 変更/仕様を参照する | `--json` で構造化データを取得 |
| `openspec show <item>` | コンテンツを表示する | `--json` で解析用データを取得 |
| `openspec validate` | 問題を確認する | `--all --json` で一括検証 |
| `openspec status` | アーティファクトの進捗を表示する | `--json` で構造化されたステータスを取得 |
| `openspec instructions` | 次のステップを取得する | `--json` でエージェント指示を取得 |
| `openspec templates` | テンプレートパスを検索する | `--json` でパス解決データを取得 |
| `openspec schemas` | 利用可能なスキーマを一覧表示する | `--json` でスキーマを発見する |
| `openspec workspace setup --no-interactive` | 明示的な入力でワークスペースを作成する | `--json` で構造化されたセットアップ出力を取得 |
| `openspec workspace list` | 既知のワークスペースを参照する | `--json` で型付きワークスペースオブジェクトを取得 |
| `openspec workspace link` | リポジトリまたはフォルダをリンクする | `--json` で構造化されたリンク出力を取得 |
| `openspec workspace relink` | リンクされたパスを修復する | `--json` で構造化されたリンク出力を取得 |
| `openspec workspace doctor` | 1つのワークスペースを確認する | `--json` で構造化されたステータス出力を取得 |
| `openspec workspace update` | ワークスペースローカルのガイダンスとエージェントスキルを更新する | `--tools` でエージェントを選択; プロファイルがワークフローを選択 |
| `openspec context-store setup <id>` | ローカルコンテキストストアを作成する | `--json` と明示的な入力で構造化されたセットアップ出力を取得 |
| `openspec context-store register <path>` | 既存のコンテキストストアを登録する | `--json` で構造化された登録出力を取得 |
| `openspec context-store unregister <id>` | ローカルコンテキストストアの登録を解除する | `--json` で構造化されたクリーンアップ出力を取得 |
| `openspec context-store remove <id>` | 登録済みのローカルコンテキストストアフォルダを削除する | `--yes --json` で非対話型削除を実行 |
| `openspec context-store list` | 登録済みのコンテキストストアを参照する | `--json` で構造化された登録情報を取得 |
| `openspec context-store doctor` | ローカルストアのセットアップを確認する | `--json` で構造化された診断結果を取得 |
| `openspec initiative list` | 共有イニシアチブを参照する | `--json` で構造化されたイニシアチブレコードを取得 |
| `openspec initiative show <id>` | イニシアチブを解決する | `--json` で標準パスとメタデータを取得 |
| `openspec new change <id>` | リポジトリローカルな変更スキャフォールディングを作成する | `--json`、共有調整リンク用の `--initiative` も使用可能 |
| `openspec set change <id>` | チェックインされた変更メタデータを更新する | `--json`、共有調整リンク用の `--initiative` も使用可能 |

---

## Global Options

これらのオプションはすべてのコマンドで動作します：

| オプション | 説明 |
|--------|-------------|
| `--version`, `-V` | バージョン番号を表示する |
| `--no-color` | カラー出力を無効にする |
| `--help`, `-h` | コマンドのヘルプを表示する |

---

## Setup Commands

### `openspec init`

プロジェクトにOpenSpecを初期化します。フォルダ構造を作成し、AIツールの統合を設定します。

デフォルトの動作ではグローバル設定のデフォルト値を使用します：プロファイルは `core`、デリバリーは `both`、ワークフローは `propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `path` | いいえ | 対象ディレクトリ (デフォルト: カレントディレクトリ) |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--tools <list>` | 非対話型でAIツールを設定する。`all`、`none`、またはカンマ区切りリストを使用 |
| `--force` | プロンプトなしでレガシーファイルを自動クリーンアップする |
| `--profile <profile>` | このinit実行時のグローバルプロファイルを上書きする (`core` または `custom`) |

`--profile custom` は、グローバル設定で現在選択されているワークフローを使用します (`openspec config profile`)。

**サポートされるツールID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**例：**

```bash
# 対話型初期化
openspec init

# 特定のディレクトリに初期化
openspec init ./my-project

# 非対話型: ClaudeとCursor用に設定
openspec init --tools claude,cursor

# すべてのサポート対象ツール用に設定
openspec init --tools all

# この実行時のプロファイルを上書き
openspec init --profile core

# プロンプトをスキップし、レガシーファイルを自動クリーンアップ
openspec init --force
```

**作成される内容：**

```
openspec/
├── specs/              # 仕様 (信頼できるソース)
├── changes/            # 提案された変更
└── config.yaml         # プロジェクト設定

.claude/skills/         # Claude Codeスキル (claudeが選択された場合)
.cursor/skills/         # Cursorスキル (cursorが選択された場合)
.cursor/commands/       # Cursor OPSXコマンド (デリバリーにコマンドが含まれる場合)
... (他のツール設定)
```

---

### `openspec update`

CLIをアップグレードした後、OpenSpec指示ファイルを更新します。現在のグローバルプロファイル、選択されたワークフロー、およびデリバリー モードを使用して、AIツール設定ファイルを再生成します。

```
openspec update [path] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `path` | いいえ | 対象ディレクトリ (デフォルト: カレントディレクトリ) |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--force` | ファイルが最新の場合でも強制的に更新する |

**例：**

```bash
# npmアップグレード後に指示ファイルを更新
npm update @fission-ai/openspec
openspec update
```

---

## Workspace Commands

ワークスペースコマンドはベータ版です。以下のローカルビューモデルは現在の方向性ですが、外部の自動化、統合、および長時間実行されるワークフローでは、コマンドの動作、ステートファイル、およびJSON出力を進化し続けるものとして扱う必要があります。

調整ワークスペースは、リンクされたリポジトリまたはフォルダに対するマシンローカルなビューです。ワークスペースの可視性は変更コミットメントではありません：OpenSpecが把握すべきリポジトリまたはフォルダをリンクし、特定の作業を計画する準備ができてから変更を作成してください。

### `openspec workspace setup`

標準のOpenSpecワークスペースの場所にワークスペースを作成し、少なくとも1つの既存のリポジトリまたはフォルダをリンクします。

```bash
openspec workspace setup [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--name <name>` | ワークスペース名。名前はkebab-caseでなければならない |
| `--link <path>` | 既存のリポジトリまたはフォルダをリンクし、フォルダ名からリンク名を推測する |
| `--link <name>=<path>` | 明示的なリンク名で既存のリポジトリまたはフォルダをリンクする |
| `--opener <id>` | 非対話型セットアップ時に優先オープナーを保存する：`codex-cli`、`claude`、`github-copilot`、または `editor` |
| `--tools <tools>` | エージェント用のワークスペースローカルOpenSpecスキルをインストールする。`all`、`none`、またはカンマ区切りのツールIDを使用 |
| `--no-interactive` | プロンプトを無効にする；`--name` と少なくとも1つの `--link` が必要 |
| `--json` | JSONを出力する；`--no-interactive` が必要 |

**例：**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

対話型セットアップでは、優先オープナーを尋ねられ、選択されたエージェント用のワークスペースローカルOpenSpecスキルをインストールできます。非対話型セットアップでは、`--opener` が提供された場合にのみ優先オープナーが保存されます。それ以外の場合、`workspace open` は後で対話型ターミナルで対応するオープナーが利用可能な場合にプロンプトを表示するか、スクリプトに `--agent <tool>` または `--editor` を渡すよう求めます。

このベータ版では、ワークスペーススキルのインストールはスキルのみです：グローバルデリバリーが `commands` または `both` であっても、ワークスペースのセットアップはワークスペースルートにエージェントスキルフォルダを作成し、スラッシュコマンドファイルは作成しません。アクティブなグローバルプロファイルがインストールするワークフロースキルを選択し、`--tools` がそれらを受け取るエージェントを選択します。非対話型セットアップで `--tools` が省略された場合、スキルはインストールされず、`workspace update --tools <ids>` で後から追加できます。

### `openspec workspace list`

ローカルレジストリから既知のOpenSpecワークスペースを一覧表示します。

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

リストには、各ワークスペースの場所とリンクされたリポジトリまたはフォルダが表示されます。古いレジストリレコードは報告されますが、変更されません。

### `openspec workspace link`

1つのワークスペースについて、既存のリポジトリまたはフォルダを記録します。

```bash
openspec workspace link [name] <path> [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--workspace <name>` | ローカルレジストリから既知のワークスペースを選択する |
| `--json` | JSONを出力する |
| `--no-interactive` | ワークスペースピッカープロンプトを無効にする |

**例：**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

パスは既に存在する必要があります。相対パスは、OpenSpecが検証済みの絶対パスをマシンローカルワークスペースステートに保存する前に、コマンドのカレントディレクトリに対して解決されます。リンクされたパスは、リポジトリローカルな `openspec/` ステートのない、完全なリポジトリ、パッケージ、サービス、アプリ、またはフォルダでもかまいません。

### `openspec workspace relink`

既存のリンクのローカルパスを修復または変更します。

```bash
openspec workspace relink <name> <path> [options]
```

パスは既に存在する必要があります。relinkは、安定したリンク名のマシンローカルパスのみを更新します。

### `openspec workspace doctor`

現在のマシンで1つのワークスペースが解決できる内容を確認します。

```bash
openspec workspace doctor [options]
```

doctorは、ワークスペースの場所、リンクされたリポジトリまたはフォルダ、欠落しているパス、存在する場合はリポジトリローカルのspecsパス、および推奨される修正を表示します。JSON出力には、互換性のためにワークスペースプランニングパスも含まれます。問題を報告するだけで、自動的には修復しません。

1つのワークスペースを必要とするコマンドは、ワークスペースフォルダまたはサブディレクトリ内から実行された場合、現在のワークスペースを使用します。それ以外の場所からは、`--workspace <name>` を渡すか、対話型ターミナルでピッカーから選択するか、既知のワークスペースが1つだけ存在する場合はそれに依存します。`--json` または `--no-interactive` モードでは、あいまいな選択は構造化されたステータスエラーで失敗し、`--workspace <name>` を提案します。

JSONレスポンスは、型付きオブジェクトと `status` 配列を使用します。主要データは `workspace`、`workspaces`、または `link` にあり、警告とエラーは `status` にあります。

### `openspec workspace update`

ワークスペースローカルのOpenSpecガイダンスとエージェントスキルを更新します。

```bash
openspec workspace update [name] [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--workspace <name>` | ローカルレジストリから既知のワークスペースを選択する |
| `--tools <tools>` | ワークスペーススキル用のエージェントを選択する。`all`、`none`、またはカンマ区切りのツールIDを使用 |
| `--json` | JSONを出力する |
| `--no-interactive` | ワークスペースピッカープロンプトを無効にする |

**例：**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` は、生成されたワークスペースガイダンスブロックとローカルオープンサーフェスを更新します。エージェントスキルについては、`--tools` が省略された場合、保存されたワークスペーススキルエージェント選択を再利用します。`--tools` を渡すと、その保存された選択が置き換えられます。ワークスペースルート内のOpenSpec管理対象のワークフロースキルディレクトリのみを更新し、選択解除された管理対象ワークフロースキルを削除し、リンクされたリポジトリとフォルダはそのまま残します。

ワークスペース内部から `openspec update` を実行すると、`openspec workspace update` にリダイレクトされます。リポジトリ所有のツールファイルを更新したい場合は、リポジトリローカルプロジェクト内で `openspec update` を実行してください。

### `openspec workspace open`

保存された優先オープナー、1セッションのエージェントオーバーライド、またはVS Codeエディターモードを通じて、ワークスペースワーキングセットを開きます。

```bash
openspec workspace open [name] [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--workspace <name>` | 位置指定のワークスペース名のエイリアス |
| `--initiative <id>` | イニシアチブをローカルワークスペースビューとして開く。`<id>` または `<store>/<id>` を受け付ける |
| `--store <id>` | `--initiative` 用の登録済みコンテキストストアID |
| `--store-path <path>` | `--initiative` 用の既存ローカルコンテキストストアルート |
| `--agent <tool>` | 1セッションのエージェントオーバーライド：`codex-cli`、`claude`、または `github-copilot` |
| `--editor` | 管理されているVS Codeワークスペースファイルを通常のエディターワークスペースとして開く |
| `--no-interactive` | ワークスペースとオープナーピッカープロンプトを無効にする |

**例：**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` は、内部で実行された場合は現在のワークスペースを使用し、他の場所で実行された場合は唯一の既知のワークスペースを自動選択し、複数のワークスペースが既知の場合はユーザーに選択を求めます。`--agent` と `--editor` は保存された優先オープナーを変更しません。両方のオープナーオーバーライドを渡すことはエラーです。`--agent <tool>` または `--editor` のいずれかを選択してください。

`--initiative` が使用されると、OpenSpecはそのイニシアチブ用のプライベートローカルワークスペースビューを準備または選択します。レジストリで選択されたストアはIDで保存されます。`--store-path` は、ワークスペースビューがプライベートローカルステートであるため、実行時ローカルパスセレクターを保存します。

OpenSpecは、VS CodeエディターおよびGitHub Copilot-in-VS-Codeでのオープンのために、ワークスペースルートに `<workspace-name>.code-workspace` を管理しています。そのファイルはマシンローカルワークスペースビューステートです。

管理されているVS Codeワークスペースは、有効なリンクされたリポジトリまたはフォルダを最初に一覧表示し、次にアタッチされた場合のイニシアチブコンテキスト、最後にOpenSpecワークスペースファイルを表示します。VS Codeはこれらのエントリをマルチルートワークスペースとして表示します。

ルートワークスペースオープンは、リンクされたリポジトリまたはフォルダを探索とコンテキストに可視化します。実装編集は、明示的なユーザー要求と通常のOpenSpec実装ワークフローの後でのみ開始すべきです。

---

## 共有コンテキストコマンド

コンテキストストアとイニシアチブはベータ版の調整機能です。コンテキストストアとは、永続的な共有コンテキストのためのローカル登録で、通常はGitで管理されるフォルダーまたはクローンです。イニシアチブとは、コンテキストストア内の共有調整コンテキストです。リポジトリローカルな変更は、共有計画をすべてのリポジトリにコピーすることなくリンクできます。

### `openspec context-store setup`

ローカルのコンテキストストアを作成し登録します。ターミナルで引数を指定しない場合、
OpenSpecがセットアップをガイドします。エージェントやスクリプトでは明示的な
入力を渡し、`--json`を使用してください。

```bash
openspec context-store setup [id] [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--path <path>` | コンテキストストアのフォルダーパス。デフォルトはOpenSpecが管理するローカルデータディレクトリ |
| `--init-git` | コンテキストストア内にGitリポジトリを初期化 |
| `--no-init-git` | Gitリポジトリを初期化しない |
| `--json` | JSON出力 |

`--path`を省略した場合、`getGlobalDataDir()/context-stores/<id>`の下にストアが作成されます。`XDG_DATA_HOME`が設定されている場合は`$XDG_DATA_HOME/openspec/context-stores/<id>`、Unix系のフォールバックでは`~/.local/share/openspec/context-stores/<id>`になります。ストアを可視なクローンやチーム固有のフォルダーに配置したい場合は`--path`を渡してください。

例:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

既存のローカルコンテキストストアフォルダーを登録します。

```bash
openspec context-store register [path] [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--id <id>` | コンテキストストアID。デフォルトはストアのメタデータまたはフォルダー名 |
| `--json` | JSON出力 |

### `openspec context-store unregister`

ファイルを削除せずに、ローカルコンテキストストアの登録を解除します。

```bash
openspec context-store unregister <id> [--json]
```

ストアが移動された、別の場所にクローンされた、またはこのマシン上でOpenSpecに表示されないようにする場合に使用します。

### `openspec context-store remove`

ローカルコンテキストストアの登録を解除し、ローカルフォルダーを削除します。

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove`は対話型ターミナルで削除前に正確なフォルダーを表示します。
エージェント、スクリプト、およびJSON呼び出し元では削除を確認するために`--yes`を渡す必要があります。
OpenSpecは一致するコンテキストストアのメタデータを含まないフォルダーの削除を拒否します。

### `openspec context-store list`

ローカルに登録されたコンテキストストアを一覧表示します。

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

ローカルのコンテキストストアの登録、メタデータ、Gitの存在を確認します。

```bash
openspec context-store doctor [id] [--json]
```

doctorは診断のみを行い、ストアを変更せずにルートの欠落、メタデータの不一致、ローカルレジストリの無効な状態を報告します。

### `openspec initiative create`

コンテキストストア内にイニシアチブを作成します。

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--store <id>` | ローカルレジストリからのコンテキストストアID |
| `--store-path <path>` | 既存のローカルコンテキストストアルート |
| `--title <title>` | イニシアチブのタイトル |
| `--summary <summary>` | イニシアチブの概要 |
| `--json` | JSON出力 |

### `openspec initiative list`

イニシアチブを一覧表示します。セレクターを指定しない場合、登録されたすべてのコンテキストストアを検索し、`status`に部分的な読み取り警告を報告します。

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--store <id>` | 登録されたコンテキストストアを1つ指定して一覧表示 |
| `--store-path <path>` | 既存のローカルコンテキストストアルートを1つ指定して一覧表示 |
| `--json` | JSON出力 |

### `openspec initiative show`

イニシアチブを解決し、その正規の場所を表示します。

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

`--store`を指定しない場合、OpenSpecは登録されたコンテキストストアを検索します。同じイニシアチブIDが複数のストアに存在する場合は、`--store <id>`を渡すか`<store>/<id>`形式を使用してください。

---

## ブラウズコマンド

### `openspec list`

プロジェクトの変更または仕様を一覧表示します。

```
openspec list [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--specs` | 変更ではなく仕様を一覧表示 |
| `--changes` | 変更を一覧表示（デフォルト） |
| `--sort <order>` | `recent`（デフォルト）または `name` で並べ替え |
| `--json` | JSON 形式で出力 |

**例：**

```bash
# すべてのアクティブな変更を一覧表示
openspec list

# すべての仕様を一覧表示
openspec list --specs

# スクリプト用に JSON 出力
openspec list --json
```

**出力（テキスト）：**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

仕様と変更を探索するための対話式ダッシュボードを表示します。

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
|----------|----------|-------------|
| `item-name` | いいえ | 変更または仕様の名前（省略時は入力を促す） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--type <type>` | タイプを指定：`change` または `spec`（明白な場合は自動検出） |
| `--json` | JSON 形式で出力 |
| `--no-interactive` | プロンプトを無効にする |

**変更固有のオプション：**

| オプション | 説明 |
|--------|-------------|
| `--deltas-only` | デルタ仕様のみを表示（JSON モード） |

**仕様固有のオプション：**

| オプション | 説明 |
|--------|-------------|
| `--requirements` | 要件のみを表示、シナリオを除外（JSON モード） |
| `--no-scenarios` | シナリオコンテンツを除外（JSON モード） |
| `-r, --requirement <id>` | 1 から始まるインデックスで特定の要件を表示（JSON モード） |

**例：**

```bash
# 対話式選択
openspec show

# 特定の変更を表示
openspec show add-dark-mode

# 特定の仕様を表示
openspec show auth --type spec

# 解析用に JSON 出力
openspec show add-dark-mode --json
```

---

## 検証コマンド

### `openspec validate`

変更と仕様の構造上の問題を検証します。

```
openspec validate [item-name] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `item-name` | いいえ | 検証する特定のアイテム（省略時は入力を促す） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--all` | すべての変更と仕様を検証 |
| `--changes` | すべての変更を検証 |
| `--specs` | すべての仕様を検証 |
| `--type <type>` | 名前が曖昧な場合にタイプを指定：`change` または `spec` |
| `--strict` | 厳密な検証モードを有効にする |
| `--json` | JSON 形式で出力 |
| `--concurrency <n>` | 最大並列検証数（デフォルト: 6、または `OPENSPEC_CONCURRENCY` 環境変数） |
| `--no-interactive` | プロンプトを無効にする |

**例：**

```bash
# 対話式検証
openspec validate

# 特定の変更を検証
openspec validate add-dark-mode

# すべての変更を検証
openspec validate --changes

# JSON 出力ですべてを検証（CI/スクリプト用）
openspec validate --all --json

# 厳密な検証と並列度の向上
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

完了した変更をアーカイブし、デルタ仕様をメイン仕様にマージします。

```
openspec archive [change-name] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | アーカイブする変更（省略時は入力を促す） |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `-y, --yes` | 確認プロンプトをスキップ |
| `--skip-specs` | 仕様の更新をスキップ（インフラ/ツール/ドキュメントのみの変更用） |
| `--no-validate` | 検証をスキップ（確認が必要） |

**例：**

```bash
# 対話式アーカイブ
openspec archive

# 特定の変更をアーカイブ
openspec archive add-dark-mode

# プロンプトなしでアーカイブ（CI/スクリプト用）
openspec archive add-dark-mode --yes

# 仕様に影響しないツール変更をアーカイブ
openspec archive update-ci-config --skip-specs
```

**処理内容：**

1. 変更を検証（`--no-validate` を除く）
2. 確認を求めるプロンプト（`--yes` を除く）
3. デルタ仕様を `openspec/specs/` にマージ
4. 変更フォルダを `openspec/changes/archive/YYYY-MM-DD-<name>/` に移動

---

## ワークフローコマンド

これらのコマンドは、アーティファクト駆動の OPSX ワークフローをサポートします。進捗を確認する人間と、次のステップを判断するエージェントの両方に役立ちます。

### `openspec new change`

リポジトリローカルの変更ディレクトリとオプションのチェックイン済みメタデータを作成します。

```bash
openspec new change <name> [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--description <text>` | `README.md` に追加する説明 |
| `--goal <text>` | 変更とともに保存するワークスペース製品の目標 |
| `--areas <names>` | 影響を受けるワークスペースリンク名をカンマ区切りで指定 |
| `--initiative <id>` | リポジトリローカルの変更をイニシアチブにリンク |
| `--store <id>` | `--initiative` 用のコンテキストストア ID |
| `--store-path <path>` | `--initiative` 用の既存のローカルコンテキストストアルート |
| `--schema <name>` | 使用するワークフロースキーマ |
| `--json` | JSON を出力 |

例：

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

変更を再作成せずに、チェックイン済みのリポジトリローカルの変更メタデータを更新します。

```bash
openspec set change <name> [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--initiative <id>` | リポジトリローカルの変更をイニシアチブにリンク |
| `--store <id>` | `--initiative` 用のコンテキストストア ID |
| `--store-path <path>` | `--initiative` 用の既存のローカルコンテキストストアルート |
| `--json` | JSON を出力 |

`set change --initiative` は、要求されたリンクが既に存在する場合は冪等であり、異なる既存のイニシアチブリンクの置換を拒否します。

### `openspec status`

変更に対するアーティファクトの完了状態を表示します。

```
openspec status [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--change <id>` | 変更名（省略時は入力を促す） |
| `--schema <name>` | スキーマのオーバーライド（変更の設定から自動検出） |
| `--json` | JSON 形式で出力 |

**例：**

```bash
# 対話式ステータス確認
openspec status

# 特定の変更のステータス
openspec status --change add-dark-mode

# エージェント用の JSON
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

アーティファクトの作成またはタスクの適用に関する充実した指示を取得します。次に何を作成すべきか理解するために AI エージェントが使用します。

```
openspec instructions [artifact] [options]
```

**引数：**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `artifact` | いいえ | アーティファクト ID：`proposal`、`specs`、`design`、`tasks`、または `apply` |

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--change <id>` | 変更名（非対話モードでは必須） |
| `--schema <name>` | スキーマのオーバーライド |
| `--json` | JSON 形式で出力 |

**特別なケース：** タスク実装の指示を取得するには、アーティファクトとして `apply` を使用します。

**例：**

```bash
# 次のアーティファクトの指示を取得
openspec instructions --change add-dark-mode

# 特定のアーティファクトの指示を取得
openspec instructions design --change add-dark-mode

# 適用/実装の指示を取得
openspec instructions apply --change add-dark-mode

# エージェント用の JSON
openspec instructions design --change add-dark-mode --json
```

**出力に含まれるもの：**

- アーティファクト用のテンプレートコンテンツ
- 設定からのプロジェクトコンテキスト
- 依存アーティファクトからのコンテンツ
- 設定からのアーティファクトごとのルール

---

### `openspec templates`

スキーマ内のすべてのアーティファクトについて、解決されたテンプレートパスを表示します。

```
openspec templates [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--schema <name>` | 調査するスキーマ（デフォルト：`spec-driven`） |
| `--json` | JSON 形式で出力 |

**例：**

```bash
# デフォルトスキーマのテンプレートパスを表示
openspec templates

# カスタムスキーマのテンプレートを表示
openspec templates --schema my-workflow

# プログラム用の JSON
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

利用可能なワークフロースキーマとその説明、およびアーティファクトフローを一覧表示します。

```
openspec schemas [options]
```

**オプション：**

| オプション | 説明 |
|--------|-------------|
| `--json` | JSON 形式で出力 |

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

---

## スキーマコマンド

カスタムワークフロースキーマの作成と管理を行うコマンド。

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
| `--artifacts <list>` | カンマ区切りのアーティファクトID（デフォルト: `proposal,specs,design,tasks`） |
| `--default` | プロジェクトのデフォルトスキーマとして設定 |
| `--no-default` | デフォルトとして設定するプロンプトを表示しない |
| `--force` | 既存のスキーマを上書き |
| `--json` | JSONとして出力 |

**例:**

```bash
# インタラクティブなスキーマ作成
openspec schema init research-first

# 特定のアーティファクトを指定した非インタラクティブ作成
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

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `source` | はい | コピー元のスキーマ |
| `name` | いいえ | 新しいスキーマ名（デフォルト: `<source>-custom`） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--force` | 既存のコピー先を上書き |
| `--json` | JSONとして出力 |

**例:**

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

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `name` | いいえ | 検証するスキーマ（省略時はすべて検証） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--verbose` | 詳細な検証手順を表示 |
| `--json` | JSONとして出力 |

**例:**

```bash
# 特定のスキーマを検証
openspec schema validate my-workflow

# すべてのスキーマを検証
openspec schema validate
```

---

### `openspec schema which`

スキーマがどこから解決されるかを表示します（優先順位のデバッグに便利）。

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
| `--json` | JSONとして出力 |

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

グローバルなOpenSpec設定を表示・変更します。

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
| `edit` | `$EDITOR`で開く |
| `profile [preset]` | ワークフロープロファイルをインタラクティブまたはプリセットで設定 |

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

# 文字列の値を明示的に設定
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

`openspec config profile` は現在の状態の概要から始まり、以下から選択できます:
- 配信 + ワークフローの変更
- 配信のみ変更
- ワークフローのみ変更
- 現在の設定を維持（終了）

現在の設定を維持する場合、変更は書き込まれず、更新プロンプトも表示されません。
設定変更がなくても、現在のプロジェクトまたはワークスペースファイルがグローバルなプロファイル/配信と同期していない場合、OpenSpecは警告を表示し、リポジトリローカルプロジェクトには `openspec update` を、ワークスペースローカルのガイダンスとスキルには `openspec workspace update` を提案します。
`Ctrl+C` を押すと、フローはきれいにキャンされ（スタックトレースなし）、コード `130` で終了します。
ワークフローチェックリストでは、`[x]` はワークフローがグローバル設定で選択されていることを意味します。これらの選択をプロジェクトファイルに適用するには、`openspec update` を実行します（またはプロジェクト内でプロンプトが表示されたときに `Apply changes to this project now?` を選択）。ワークスペース内では、`openspec workspace update` を使用してワークスペースローカルのガイダンスとスキルを更新します。これは生成されたエージェントワークフローファイルについてはスキルのみのままとなり、ワークスペーススラッシュコマンドは生成されません。

**インタラクティブな例:**

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

OpenSpecに関するフィードバックを送信します。GitHubのIssueを作成します。

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

OpenSpec CLIのシェル補完を管理します。

```
openspec completion <subcommand> [shell]
```

**サブコマンド:**

| サブコマンド | 説明 |
|------------|-------------|
| `generate [shell]` | 補完スクリプトを標準出力に出力 |
| `install [shell]` | 使用中のシェルに補完をインストール |
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
| `OPENSPEC_TELEMETRY` | `0` に設定するとテレメトリーを無効化 |
| `DO_NOT_TRACK` | `1` に設定するとテレメトリーを無効化（標準のDNTシグナル） |
| `OPENSPEC_CONCURRENCY` | バルク検証のデフォルトの並行度（デフォルト: 6） |
| `EDITOR` または `VISUAL` | `openspec config edit` で使用するエディタ |
| `NO_COLOR` | 設定するとカラー出力を無効化 |

---

## 関連ドキュメント

- [コマンド](commands.md) - AIスラッシュコマンド（`/opsx:propose`, `/opsx:apply` など）
- [ワークフロー](workflows.md) - 一般的なパターンと各コマンドの使用タイミング
- [カスタマイズ](customization.md) - カスタムスキーマとテンプレートの作成
- [はじめに](getting-started.md) - 初回セットアップガイド