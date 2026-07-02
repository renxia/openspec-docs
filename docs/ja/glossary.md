# 用語集

すべてのOpenSpecの用語を一つの場所にまとめ、平易な言葉で定義します。一度ざっと目を通せば、他のドキュメントがより速く読めるようになります。

用語はトピックごとにグループ化され、各グループ内ではアルファベット順に並べられています。

## コアとなる名詞

**Spec.** システムの一部がどのように動作するかを記述するドキュメントです。Specsは`openspec/specs/`に存在し、ドメインごとに整理され、要件とシナリオで構成されています。Specは「このソフトウェアは何をするのか？」に対する合意された答えです。[Concepts](concepts.md#specs)を参照してください。

**Source of truth.** `openspec/specs/`ディレクトリ全体を指します。これはシステムの現在の、合意された動作状態を保持しています。変更はそれに対する編集案を提案し、アーカイブがそれを適用します。

**Change.** 一つの作業単位であり、`openspec/changes/<name>/`の下にフォルダとしてパッケージ化されています。Changeにはその作業に関するすべて（提案、設計、タスク、導入するSpecの編集）が含まれます。一つのChangeは、一つの機能または修正です。

**Artifact.** Changeの中にあるドキュメントです。標準的なArtifactは、提案、delta spec、設計、およびタスクです。これらは依存関係の順序で作成され、互いにフィードバックを与え合います。

**Delta spec.** Change内にあり、Spec全体を再記述するのではなく、`ADDED`、`MODIFIED`、および`REMOVED`セクションを使用して変更点のみを記述するSpecです。これがOpenSpecが既存のシステムをクリーンに編集できる理由です。[Concepts](concepts.md#delta-specs)を参照してください。

**Domain.** `auth/`、`payments/`、または`ui/`のようなSpecsの論理的なグループ化です。ドメインは、あなたがシステムについてどのように考えているかに合わせて選択します。

## Specの内側

**Requirement.** システムが持つべき単一の動作であり、通常RFC 2119キーワード（例：「The system SHALL expire sessions after 30 minutes.」）で記述されます。Requirementは「方法（how）」ではなく「何を（what）」を述べています。

**Scenario.** Requirementが実際に機能している具体的なテスト可能な例であり、通常Given/When/Thenの形式をとります。ScenarioはRequirementを検証可能にします。そこから自動テストを作成することができます。

**RFC 2119 keywords.** MUST、SHALL、SHOULD、MAYという単語で、Requirementの厳格さに関する標準化された意味を持っています。MUSTとSHALLは絶対的です。SHOULDは例外を許容する範囲での推奨事項です。MAYはオプションです。この名前はそれらを定義したインターネット標準ドキュメントに由来します。

## Artifact

**Proposal (`proposal.md`).** Changeの「なぜ（why）」と「何を（what）」を記述します。意図、スコープ、およびハイレベルのアプローチです。最初に作成するArtifactです。

**Design (`design.md`).** 「どのように（how）」を記述します。技術的なアプローチ、アーキテクチャ上の決定事項、そして触れるべきファイル群です。シンプルなChangeの場合はオプションです。

**Tasks (`tasks.md`).** チェックボックス付きの実装チェックリストです。AIは`/opsx:apply`実行中にこれを通じて作業し、項目をチェックしていきます。

## ライフサイクル

**Archive.** Changeを完了させる行為です。そのdelta specがメインSpecにマージされ、Changeフォルダは`openspec/changes/archive/YYYY-MM-DD-<name>/`に移動します。アーカイブ後、あなたのSpecsが新しい現実を記述します。[Concepts](concepts.md#archive)を参照してください。

**Sync.** Changeのdelta specをメインSpecにマージする行為ですが、Change自体はアーカイブしません。通常は自動で行われます（アーカイブ機能で提案されます）。しかし、長期間かかるChangeのために`/opsx:sync`として単独で実行することも可能です。[Commands](commands.md#opsxsync)を参照してください。

## ワークフローとコマンド

**OPSX.** 硬直的なフェーズではなく、流動的なアクションを中心に構築された現在の標準OpenSpecワークフローです。そのスラッシュコマンドはすべて`/opsx:`から始まります。[OPSX Workflow](opsx.md)を参照してください。

**Slash command.** AIアシスタントのチャットに入力するコマンドで、例として`/opsx:propose`があります。Slash commandがワークフローを駆動します。これらはターミナルコマンドではありません。[How Commands Work](how-commands-work.md)を参照してください。

**Explore (`/opsx:explore`).** 思考のパートナーとなるコマンドです。コードベースを読み込み、オプションを比較し、曖昧なアイデアを具体的な計画に明確化します。Artifactを作成したりコードを書いたりしません。問題はあるがまだ計画がない場合に推奨される出発点です。[Explore First](explore.md)を参照してください。

**CLI.** ターミナルで実行する`openspec`プログラムです。プロジェクトを設定し、Changeを一覧表示・検証し、ダッシュボードを開き、アーカイブします。OpenSpecのターミナル側の部分です。[CLI](cli.md)を参照してください。

**Skill.** AIアシスタントが自動検出して従うべき一連の指示（`.../skills/openspec-*/SKILL.md`）です。Skillは、あなたのアシスタントにOpenSpecワークフローを提供するための新興のクロスツール標準です。

**Command file.** ツールごとのスラッシュコマンドファイル（`.../commands/opsx-*`）です。Skillsと並行してサポートされている古い提供メカニズムです。これらを直接操作することはほとんどありません。

**Profile.** プロジェクトにインストールされているスラッシュコマンドのセットです。**Core**（デフォルト）には`propose`、`explore`、`apply`、`sync`、`archive`が含まれます。**Expanded**セットには`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`が追加されます。これは`openspec config profile`で変更できます。

**Delivery.** OpenSpecがあなたのツールに対してSkillをインストールするか、Command fileをインストールするか、あるいは両方行うかどうかの設定です。グローバルに設定され、`openspec update`で適用されます。

## カスタマイズ

**Schema.** あるワークフローがどのようなArtifactを持ち、それらがどのように相互依存しているかを定義します。組み込みのデフォルトは`spec-driven`（proposal → specs → design → tasks）です。これをフォークするか、独自のものを書くことができます。[Customization](customization.md#custom-schemas)を参照してください。

**Template.** Schema内にあるMarkdownファイルで、AIが特定のArtifactに対して何を出力するかを形作ります。テンプレートを編集すると、再ビルドなしにAIの出力を即座に変更できます。

**Project config (`openspec/config.yaml`).** プロジェクトごとの設定です。デフォルトのSchema、すべての計画リクエストに注入される`context:`、およびArtifactごとの`rules:`が含まれます。OpenSpecにあなたのスタックと規約について教える最も簡単な方法です。[Customization](customization.md#project-configuration)を参照してください。

**Context injection.** プロジェクトの背景情報を`config.yaml`の`context:`フィールドに入れることで、AIが生成するすべてのArtifactに自動的に追加されます。AIが別々のファイルを読み込むことを期待するよりも信頼性が高い方法です。

**Dependency graph.** Artifactの`requires:`関係によって形成される有向グラフです。これはDAG（Directed Acyclic Graph：矢印は常に前方に向け、ループにはならない）であり、OpenSpecはこれを使用して次に何を作成できるかを把握します。

**Enablers, not gates.** Artifactの依存関係が「次に何を*必要とするか*」ではなく、「次に何が*可能になるか*」を示すという原則です。いつでも任意のArtifactを再検討し編集することができます。[Core Concepts at a Glance](overview.md#enablers-not-gates)を参照してください。

## リポジトリ間での調整（ベータ）

これらの用語は、あなたの計画が複数のリポジトリにまたがる場合にのみ適用されます。これらはベータ版です。ほとんどのユーザーは無視しても構いません。[Stores User Guide](stores-beta/user-guide.md)を参照してください。

**Store.** 計画だけを目的とするスタンドアロンのリポジトリです。既知のある`openspec/`の形状（SpecsとChanges）に加えて、小さなアイデンティティファイルを持っています。一度マシン上で名前によって登録すれば、どこからでも任意のOpenSpecコマンドを実行できます。

**Reference.** あるリポジトリが参照するStoreを宣言することです。これはコードリポジトリの`openspec/config.yaml`内に記述されます。Referencesは読み取り専用です。リポジトリは自身のルートを保持し、`openspec instructions`は参照されたStoreのSpecsのインデックスを取得し、それぞれにそれをフェッチするための正確なコマンドを持つのです。

**Working context.** `openspec context`が現在のリポジトリに対して組み立てるもの：そのOpenSpec rootと、それが参照するすべてのStore、そしてそれらをどのようにフェッチするかという情報です。「何を使って作業しているのか？」という問いへの答えです。

**Workset.** あなたが一緒に開く個人的なマシンローカルのフォルダセット（作業対象のコードリポジトリに加えてStoreを開くこと）です。`openspec workset create`で明示的に作成されます。これらのローカルパスに関する情報は、共有される計画リポジトリにはコミットされません。

## 関連項目

- [Core Concepts at a Glance](overview.md): 5つのアイデアを1ページに
- [Concepts](concepts.md): 長文での説明
- [How Commands Work](how-commands-work.md): スラッシュコマンドとCLIについて