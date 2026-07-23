# ストア: 独自リポジトリでの計画

> **ベータ版です。** ストア、references、working context、worksetsは新機能です。コマンド名、フラグ、ファイル形式、JSON出力はリリース間で変更される可能性があります。以下のすべての手順は現在のビルドで実行されましたが、アップグレード後はこのガイドを再読してください。

## 解決する課題

OpenSpecは通常、単一のコードリポジトリ内に存在します：コードの隣にある`openspec/`フォルダに、そのリポジトリのspecsとchangesが格納されています。

計画が1つのリポジトリに収まらなくなると、この構成は成り立たなくなります：

- 作業が複数のリポジトリにまたがる場合 — 1つの機能がAPIサーバー、Webアプリ、共有ライブラリに影響する場合、計画はどのリポジトリの`openspec/`フォルダに置くべきか？
- チームがコード作成前に計画を立てたり、*この*リポジトリではコード化されないものを計画したりする場合。
- 要件を1つのチームが管理し、他のチームが利用する場合。Wikiのバージョンは乖離し、コーディングエージェントはそれを読み取ることができません。

**ストア**がその答えです：計画専用の独立したリポジトリです。既にご存知の`openspec/`構造（specsとchanges）に加え、小さな識別ファイルを含みます。名前を指定してマシンに1回登録すれば、どこからでも通常のOpenSpecコマンドで操作できます。

## 構造

```
            team-plans  (ストア: 独自リポジトリで計画を管理)
            ├── .openspec-store/store.yaml     識別子: "I am team-plans"
            └── openspec/
                ├── specs/      何が真実か
                └── changes/   何が進行中か
                      ▲
                      │ 各マシンで名前によって登録;
                      │ 他のリポジトリと同様にプッシュ/クローンで共有
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (コードリポジトリ)   (コードリポジトリ)    (コードリポジトリ)
```

2つのルールでシンプルに保ちます：

1. **ストアは単なるGitリポジトリです。** コミット、プッシュ、プル、レビューは自分で行います。OpenSpecは決して独自にクローン、同期、プッシュを行いません。
2. **宣言のみ、機械的な処理は行いません。** リポジトリはストアとの関係を*宣言*できます（下記参照）。宣言はOpenSpecが伝えられる内容を変更しますが、コマンドの実行場所を変更することは決してありません。

## 5分で最初のストアを作成

2つのコマンドで、何もない状態から動作するストアスコープの変更を作成できます：

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

これが全体のモデルです。ここから先のライフサイクルはあなたが知っているものと exactly 同じです — `status`、`instructions`、`validate`、`archive` — 各コマンドに `--store team-plans` を付けるだけで、表示されるすべてのヒントにフラグが含まれます。`Using OpenSpec root:` 行は常にコマンドが実行されている場所を示します。

## ストーリー：1つのチーム、1つの計画リポジトリ

チームは仕様と変更を `team-plans` に保持し、コードリポジトリ全体に散らばることを避けます。

**1日目（セットアップする人）：**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

`--remote` を渡すと、クローンURLがストア自身の識別ファイル（`.openspec-store/store.yaml`）内の初期コミットに記録されます。今後のすべてのクローンはどこから来たかを認識して生成されるため、ヘルスチェックやエラーメッセージで、まだ持っていないチームメンバー向けに完全で貼り付け可能な修正案を表示できます。

**すべてのチームメンバー（マシンごとに1回）：**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

その後は、全員が名前によって同じ計画リポジトリで作業します：

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**意図的にGitを使用して作業を共有します。** あなたが作成した変更は、コミットしてプッシュするまであなたのチェックアウトにのみ存在します — コードと同じです。ストアは通常のリポジトリであるため、計画はブランチ、プルリクエスト、レビューを無料で取得できます。

**チームのコードリポジトリを接続します。** 計画が完全に外部化されたコードリポジトリには、`openspec/config.yaml` に1行だけが必要です：

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

これで `web-app` 内で実行されるすべてのOpenSpecコマンドが、フラグなしで `team-plans` に対して実行されます：

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

このポインタはフォールバックであり、決してオーバーライドではありません：明示的な `--store` が常に優先され、リポジトリに独自の計画フォルダが存在する場合はそれらが優先されます（古いポインタを削除するよう警告が表示されます）。

**マシン上のすべてのリポジトリに1つのデフォルトを設定。** 同じストアに計画を立てる多くのコードリポジトリで作業する場合は、各リポジトリに `store:` 行を追加する代わりに、1回だけグローバルに設定できます：

```bash
openspec config set defaultStore team-plans
```

これで、計画ルートの外で実行され、`--store` もプロジェクトポインタも指定されていないコマンドはすべて `team-plans` に解決されます。これは優先順位リストの最下位にあるため、`--store`、ローカルルート、プロジェクトの `store:` ポインタがすべて依然として優先されます。ルートバナーとJSONの `root` ブロックには `source: "global_default"` とストアIDが表示されるため、マシン全体のデフォルトとリポジトリ独自のポインタを常に識別できます。`openspec config unset defaultStore` でクリアします。IDが登録されていない場合、コマンドはエラーになり、登録するか古いデフォルトをクリアするよう指示されます。

## ストーリー：チームの境界を越える要件

プラットフォームチームが要件を所有し、プロダクトチームは独自のリポジトリでそれらを実装し、独自の設計を行います。リファレンスは誰の作業も移動させることなく、その関係を記述します。

```
   platform-reqs (ストア)                 api-server (コードリポジトリ)
   プラットフォームチームが所有              プロダクトチームが所有
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ 読み込み  │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (独自の設計)           │
   │   プラットフォーム作業    │          │ openspec/changes/        │
   │                          │          │   (独自の作業)           │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**プロダクトチームはリポジトリの `openspec/config.yaml` で依存関係を宣言します：**

```yaml
references:
  - platform-reqs
```

参照は読み取り専用のコンテキストです。リポジトリは独自の `openspec/` ルートを保持し、作業はそこで行われます。変更点：そのリポジトリの `openspec instructions` に、参照されたストアの仕様インデックスが含まれるようになります — 各仕様には1行の要約と正確な取得コマンド（`openspec show <spec-id> --type spec --store platform-reqs`）が記載されます。`api-server` で作業するエージェントは、上流の支払い要件を見つけ、引用し、独自のルートに詳細設計を記述できます — 誰もコンテキストを貼り付ける必要がありません。

参照にはクローン元を含めることができるため、まだストアを持っていないチームメンバーは行き詰まることなく完全な修正案を取得できます：

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**計画とコードを一緒に開きたい場合は、ワークセットを作成します。** これは個人的かつ明示的なものです：各人がマシン上で実際に作業するフォルダを選択します。これらのローカルチェックアウトパスに関する情報は共有計画リポジトリにコミットされません。

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## いつでも質問できる2つのこと

**「セットアップは正常か？」** — `openspec doctor` は現在のルートと参照されたストアを読み取り専用でチェックし、検出ごとに貼り付け可能な修正案を表示します：

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

**「何を扱っているか？」** — `openspec context` はOpenSpecの宣言から作業セットを組み立てます：ルートとそれが参照するストアです。

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

どちらもエージェント向けに `--json` をサポートしています。`openspec context --code-workspace <path>` はさらに、セット全体を含むVS Codeワークスペースファイルを書き出します — このコマンドが行う唯一の書き込み操作です。

## ワークセット：一緒に作業するフォルダを再び開く

上記すべてとは別に、ほとんどの人は毎回同じ数個のフォルダを一緒に開きます — 計画リポジトリと2つまたは3つのコードリポジトリです。**ワークセット** は、まさにその個人的な名前付きビューで、お気に入りのツールで1つのコマンドで再び開くことができます。

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       すべて3つがツールで開かれます
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (VS Codeで開く)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` は保存されたツールを起動します：エディタ（VS Code、Cursor）はすべてのメンバーを含む1つのウィンドウを開いて戻ります。最初のメンバーがプライマリです。いつでも `--tool <id>` でツールをオーバーライドできます。

ワークセットは意図的に*共有状態ではありません*。マシン上に存在し、決してコミットされず、作業に関する主張は行いません — 一緒に開くのが好きなものだけを記録します。ワークセットを削除してもメンバーフォルダには影響しません。新しいツールは設定であり、コードではありません：ワークスペースファイルまたはフォルダごとのアタッチフラグ経由で起動できるものはすべて、グローバル設定の `openers` キー（`openspec config edit`）の下に追加できます。

## コマンドが実行場所を決定する方法

すべての通常コマンドは、次の順序でルートを解決します：

```
1. --store <id>          明示的に指定した場合       → そのストア
2. 最も近い openspec/    ここに実際の計画ルートがある → このリポジトリ
   (cwdから上位に探索)
3. store: ポインタ         config.yamlがストアを宣言   → そのストア
4. defaultStore          グローバル設定がマシン全体   → そのストア
                         のデフォルトを設定
5. 上記のいずれでもない   このマシンに登録された       エラーと選択
                         ストアがある？               ヒントを表示
                         登録されたストアがない？     現在の
                                                      ディレクトリ
                                                      （従来の動作）
```

`Using OpenSpec root:` 行（および `--json` 出力の `root` ブロック）は、どのケースに該当するかを示します。

## 既知の制限事項

- **ベータ版の構造。** このページのすべてはリリース間で変更される可能性があります — 名前、フラグ、ファイル形式、JSONキー。
- **マシンごとにストアIDごとに1つのチェックアウト。** 同じIDの下に2つ目のチェックアウトを登録すると、先に `store unregister` を行うようヒントが表示されて失敗します。
- **同期は決して行いません — 設計上。** OpenSpecは決してクローン、プル、プッシュを行いません。古いチェックアウトは、*あなたが*プルするまで古い仕様を表示し続けます。参照はディスク上の内容からライブでインデックス化されます。
- **空の計画フォルダは存在しなくても可。** 新しいストアには、Gitにまだ `openspec/changes/`、`openspec/specs/`、または `openspec/changes/archive/` がない場合があります。これはベータ期間中に受け入れられます。通常のコマンドがファイルを作成すると、これらのフォルダが表示されます。
- **ポインタリポジトリはポインタのまま。** `openspec/config.yaml` に `store: <id>` を宣言する設定のみのリポジトリは、外部化された計画として扱われ、登録するストアチェックアウトとしては扱われません。意図的にそのリポジトリをローカルストアルートに変換したい場合は、先に `store:` 行を削除してください。
- **一部のコマンドは現在の場所に留まります。** `view`、`templates`、`schemas`、および非推奨の名詞形式（`openspec change show` など）は現在のディレクトリでのみ実行されます — `--store` は使用できません。
- **マシンごとの状態はマシン固有です。** ストアレジストリとワークセットはローカル設定です。マシンのレイアウトに関する情報が共有計画にコミットされることは決してありません。
- **ワークセットには2つの起動スタイルがあります。** ワークスペースファイルまたはフォルダごとのアタッチフラグで起動できないツールは、オープナーとして追加できません。
- **エージェントJSONには既知の大文字小文字の分割があります**（ストアファミリのキーはsnake_case、ワークフローファミリはcamelCase）。[エージェントコントラクト](../agent-contract.md)に記載されています。統一はバージョン付きリリースまで延期されています。

## 各リソースの保存場所

| 項目 | 場所 | 共有？ |
|---|---|---|
| ストアの計画 | `<store>/openspec/` (specs, 変更) | はい — コミットしてプッシュする |
| ストアの識別情報 | `<store>/.openspec-store/store.yaml` | はい — ストアと一緒にコミットされる |
| ストアレジストリ | `<data dir>/openspec/stores/registry.yaml` | いいえ — このマシンのみ |
| ワークセット | `<data dir>/openspec/worksets/` | いいえ — このマシンのみ |

`<data dir>` は、macOS と Linux では `~/.local/share/openspec`（または `$XDG_DATA_HOME/openspec` が設定されている場合）、Windows では `%LOCALAPPDATA%\openspec` です。

## リファレンス

このページの各コマンドの正確なフラグと JSON 構造については、[CLIリファレンス](../cli.md)（ストア、Doctor、作業コンテキスト、個人ワークセット）および [エージェントコントラクト](../agent-contract.md) を参照してください。