# Stores: Plan in Its Own Repo

> **Beta.** Stores, references, working context, and worksets are
> 新規導入されました。コマンド名、フラグ、ファイル形式、JSON出力はリリース間で形状が変わる可能性があります。以下のすべてのウォークスルーは現在のビルドに対して実行されましたが、アップグレード後は本ガイドを再読してください。

## The problem this solves

OpenSpec は通常、コードリポジトリ（repo）内に存在します。それは、そのリポジトリの仕様と変更を保持する `openspec/` フォルダです。

しかし、計画が単一のリポジトリを超えるような状況では、この方法では対応できません。

*   作業が複数のリポジトリにまたがる場合 — ある機能が API サーバー、Web アプリケーション、共有ライブラリのすべてに影響を与える場合。その計画はどの `openspec/` フォルダ内に存在するのでしょうか？
*   チームがコードが存在する前に計画を立てる場合、または *この* リポジトリには実装されないものを計画する場合。
*   要件が特定のチームによって所有され、他のチームによって消費される場合。Wiki 版が陳腐化し、コーディングエージェントがそれを読み取れない場合。

**store** がその解決策です。それは、計画のみを目的とするスタンドアロンのリポジトリです。既知の `openspec/` 形式（仕様と変更）に加え、小さな識別ファイルを持っています。一度マシンに名前で登録すれば、どの場所からでも通常の OpenSpec コマンドを実行できるようになります。

## The shape

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

このシンプルな状態を維持する2つのルールがあります。

1. **ストアは単なる git リポジトリです。** あなた自身がコミット、プッシュ、プルし、レビューします。OpenSpec は何もクローンしたり同期したりプッシュしたりしません。
2. **機械的なものではなく、宣言です。** リポジトリは、ストアとの関係を*宣言*することができます（以下に表示）。この宣言によって、OpenSpec が何を知ることができるかが変わるだけであり、コマンドが作用する場所が変わるわけではありません。

## 初めてのストアまでの5分間

以下の2つのコマンドで、何も状態のない状態から、動作するストアスコープの変更へと移行できます。

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

これがモデルの全てです。ここから、ライフサイクルはすべてご存知のものと全く同じです — `status`、`instructions`、`validate`、`archive` — 各コマンドに `--store team-plans` を付け、表示されるすべてのヒントがそれを担っています。「`Using OpenSpec root:`」という行は常に、どのコマンドがどこで作用しているかを教えてくれます。

## ストーリー：チーム一つ、プランニングリポジトリ一つ

チームは、仕様や変更をコードリポジトリに散らばらせるのではなく、`team-plans` に保持します。

**初日（セットアップを行う人）：**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

`--remote` を渡すことで、クローンURLがストア自身のアイデンティティファイル（`.openspec-store/store.yaml`）に初期コミットとして記録されます。将来のすべてのクローンは、どこから来たのかを知った状態で誕生するため、健康チェックやエラーメッセージが、まだそれを持っていないチームメイトに対して完全で貼り付け可能な修正を印刷することができます。

**各チームメンバー（マシンにつき一度）：**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

これ以降、全員が名前で同じプランニングリポジトリを操作します。

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**作業の共有は Git に任せます。** 作成した変更は、コミットしてプッシュするまであなたのチェックアウト内にのみ存在します — コードと同じです。プランにはブランチ、プルリクエスト、レビューが無料で付与されます。なぜなら、ストアは普通のリポジトリだからです。

**チームのコードリポジトリの接続。** プランニングを完全に外部化する必要があるコードリポジトリには、`openspec/config.yaml` にたった一行が必要です。

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

これで、`web-app` 内で実行されるすべての OpenSpec コマンドは、フラグを一切必要とせず `team-plans` に対して作用します。

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

ポインターはフォールバックであり、上書きではありません。明示的な `--store` が常に優先され、もしリポジトリが独自の本格的なプランニングフォルダを持つようになった場合（古いポインターを削除する警告付き）、それらが優先されます。

## ストーリー：チームをまたぐ要件

プラットフォームチームが要件を所有します。プロダクトチームは、それぞれのデザインとリポジトリ内でそれに基づいて構築します。参照は、誰の作業も移動させることなくその関係性を記述します。

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**プロダクトチームは、リポジトリの `openspec/config.yaml` にて、何を参照しているかを宣言します。**

```yaml
references:
  - platform-reqs
```

参照は読み取り専用のコンテキストです。リポジトリは独自の `openspec/` ルートを保持し、作業はその中に留まります。変わるのは、そのリポジトリの `openspec instructions` に、参照されたストアの仕様のインデックス（それぞれ1行の要約と正確な取得コマンド (`openspec show <spec-id> --type spec --store platform-reqs`)）が含まれるようになることです。`api-server` で作業するエージェントは、アップストリームの支払い要件を見つけ、それらを引用し、リポジトリ自身のルートに低レベルのデザインを記述することができます — 誰かがコンテキストを貼り付ける必要はありません。

参照にはクローンソースを含めることができます。そのため、まだストアを持っていないチームメイトに対して、行き止まりではなく完全な修正を提供できます。

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**計画とコードを同時に開きたい場合は、ワークセットを作成します。** これは個人的で明示的なものです。各人は、自分のマシン上で実際に作業するフォルダを選択します。それらのローカルチェックアウトパスに関するものは、共有のプランニングリポジトリにはコミットされません。

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## いつでも尋ねられる2つの質問

**「私のセットアップは健全ですか？」** — `openspec doctor` は現在のルートとその参照されているストアを読み取り専用でチェックし、発見事項ごとに貼り付け可能な修正を提供します。

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**「私は何に取り組んでいるのですか？」** — `openspec context` は、OpenSpec の宣言から作業セットを組み立てます：ルートとそれが参照しているストアです。

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

両方ともエージェント向けに `--json` をサポートします。`openspec context --code-workspace <path>` は、このコマンドが唯一行う書き込みである、全体セットを含む VS Code ワークスペースファイルをさらに作成します。

## Worksets：一緒に作業するフォルダを再開する

上記すべてとは別に、ほとんどの人はセッションごとに同じ少数のフォルダを開きます — プランニングリポジトリと2つか3つのコードリポジトリです。**ワークセット**は、これら全てを正確に捉えた個人的な名前付きビューであり、選択したツールで一つのコマンドによって再開されます。

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` は、保存されたツールを起動します：エディタ（VS Code, Cursor）は一つのウィンドウですべてのメンバーを開き、戻ります。最初のメンバーがプライマリです。いつでも `--tool <id>` でツールを上書きできます。

ワークセットは意図的に*共有状態ではありません*。それらはあなたのマシン上に存在し、コミットされることはなく、作業について主張することはありません — それらは単にあなたが何を開いておくのが好きなのかを記録するだけです。一つを削除してもメンバーフォルダには一切触れません。新しいツールは設定でありコードではありません：ワークスペースファイルやパーフォルダアタッチフラグを通じて起動できるものは、グローバル設定（`openspec config edit`）の `openers` キーの下に追加できます。

## コマンドがどこで作用するかを決める方法

すべての通常のコマンドは、以下の順序でルートを同じように解決します。

```
1. --store <id>          あなたが明示的に指定した → そのストア
2. nearest openspec/     ここに実際のプランニングルートがある → このリポジトリ
   (cwd から上方向へ移動)
3. store: pointer        config.yaml がストアを宣言している → そのストア
4. none of the above     マシンに登録されているストアがない？ → 選択のヒント付きエラー
                         no stores registered?         → 現在のディレクトリ（古典的な動作）
```

「`Using OpenSpec root:`」という行（および `--json` 出力における `root` ブロック）が、あなたがどのケースにいるかを教えてくれます。

## 知られている制限事項

- **ベータ版の形状。** このページにあるすべては、リリース間で名前、フラグ、ファイル形式、JSONキーなどが変更される可能性があります。
- **マシンごとのストアIDに対する単一チェックアウト。** 同じIDの下で2つ目のチェックアウトを登録しようとすると、まず `store unregister` を行うようにヒントが表示されます。
- **同期は絶対にしない — 設計によるものです。** OpenSpec はクローンしたりプルしたりプッシュしたりしません。古いチェックアウトは、*あなたが*プルするまで古い仕様を表示します。参照はディスク上のものからライブでインデックス化されます。
- **一部のコマンドは元の場所に留まります。** `view`、`templates`、`schemas`、および非推奨となった名詞形式（`openspec change show` など）は現在のディレクトリのみに作用し、`--store` は使用しません。
- **マシンごとの状態はマシン固有です。** ストアレジストリとワークセットはローカル設定です。あなたのマシンのレイアウトに関するものは、共有のプランニングには決してコミットされません。
- **ワークセットの2つの起動スタイル。** ワークスペースファイルやパーフォルダアタッチフラグで起動できないツールは、オープナーとして追加できません。
- **エージェントJSONには既知のケーシング分割があります** (store-family キーは snake_case、workflow-family は camelCase)。[agent contract](../agent-contract.md) に文書化されていますが、統一化はバージョン付きリリースに延期されています。

## どこに配置されるか

| 何 | 配置場所 | 共有するか？ |
|---|---|---|
| ストアのプランニング | `<store>/openspec/` (specs, changes) | はい — コミットしてプッシュする |
| ストアのアイデンティティ | `<store>/.openspec-store/store.yaml` | はい — ストアと一緒にコミットされる |
| ストアレジストリ | `<data dir>/openspec/stores/registry.yaml` | いいえ — このマシンのみ |
| Worksets | `<data dir>/openspec/worksets/` | いいえ — このマシンのみ |

`<data dir>` は、macOS および Linux では `~/.local/share/openspec` (または設定されている場合は `$XDG_DATA_HOME/openspec`)、Windows では `%LOCALAPPDATA%\openspec` です。
## Reference

このページにあるすべてのコマンドの正確なフラグとJSON形状については：
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) および [agent contract](../agent-contract.md)。