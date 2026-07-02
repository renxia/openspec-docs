# 既存プロジェクトでのOpenSpecの利用

**すべてを網羅的にドキュメント化する必要はありません。変更しようとしている部分のみについて仕様書を作成します。** これが、既存のプロジェクトでOpenSpecを採用する上で最も重要な点であり、OpenSpecがブラウンフィールド（既存環境）ファーストで構築されている理由です。

「私のアプリは8万行あります。OpenSpecが役立つ前に、すべてについて仕様を書かなければならないのですか？」という懸念はよく聞かれます。答えはノーです。それはあなたにとっても、私たちにとっても嫌なことです。OpenSpecは、一度に一つの変更に対して仕様を増やしていきます。最初の変更でその変更が触れる部分をドキュメント化し、次の変更でその部分をドキュメント化します。数ヶ月かけて、あなたの仕様書は実際に作業を行った周辺領域を自然に満たしていくのです。

このガイドでは、すべてを一度にやろうとせず、初日からどのように始めるかを示します。

## 30秒バージョン

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

次に、AIチャットで：

```text
/opsx:explore            # optional: have the AI read the area you'll touch
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

これで、あなたの仕様書は、その変更が触れたシステムの正確な部分のみを記述します。それ以上でもそれ以下でもありません。他の8万行について心配する必要はありません。

## なぜデルタファースト（Delta-first）が鍵なのか

OpenSpecの変更は、**デルタ**（`ADDED`、`MODIFIED`、`REMOVED`）として書かれます。デルタとは、システム全体ではなく、現在の動作に対する何が変わっているかを記述するものです。

これはまさにブラウンフィールドでの作業が必要とするものです。あなたはめったにゼロから構築しているわけではありません。フィールドを追加したり、リダイレクトを修正したり、タイムアウトを厳密に設定したりしています。デルタがあれば、それらのいずれか一つの変更を正確に指定でき、その周辺のすべてについて40ページの仕様書を書く必要がなくなります。

したがって、`openspec/specs/` ディレクトリは最初から完全に揃っているわけではありません。それはほぼ空の状態から始まり、蓄積していきます。アーカイブされた各変更が自身のデルタをマージします。`auth/` の仕様が徹底的になるのは、いくつかの認証関連の変更を行った後であり、まさにそうなるべきタイミングです。

より深い仕組みにご興味があれば、[Concepts: Delta Specs](concepts.md#delta-specs) を参照してください。

## 本物のコードベースでの最初の変更

小さくて現実的なものを選んでください。おもちゃや書き換えではありません。いずれこの週中に実行するつもりだった変更で構いません。小さな初期の変更は、リスクを低く保ちながらワークフローを学ぶ機会を与えてくれます。

**ステップ 1: AIに関連領域を読ませる。** ここで `/opsx:explore` が、馴染みのない、または大規模なコードベースにおいてその価値を発揮します。これから触れる部分をAIに見せ、何かを提案する前に、それがどのように機能しているかをマッピングさせます。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I need to add rate limiting to our public API, but I'm not sure
     how requests currently flow through the middleware.

AI:  Let me trace it... [reads the router, middleware stack, and config]
     Requests hit Express, pass through auth middleware, then your
     controllers. There's no rate-limiting layer today. The cleanest
     insertion point is a middleware right after auth. Want me to scope it?
```

AIがあなたの実際の構造を理解していることに注目してください。そのため、それが書く提案は、汎用的なテンプレートではなく、あなたのコードに適合したものになります。大規模なコードベースにおいて、この一つの習慣が最も多くの苦痛を救ってくれます。[Explore First](explore.md) を参照してください。

**ステップ 2: 変更を提案する。** 提案とそのデルタ仕様は、この変更のみを捉えます。

```text
You: /opsx:propose add-api-rate-limiting
```

**ステップ 3: `/opsx:apply` と `/opsx:archive` でビルドしアーカイブする。** これは他の変更と同じです。アーカイブ後、あなたは自分でも必要だった変更から生まれた、レート制限動作に関する本物の仕様を得ます。

## ガイド付きツアーを好む場合は onboard を使用

もし、ナレーション付きで自分のコード上でこのプロセス全体が進行するのを見たいのであれば、拡張コマンドである `/opsx:onboard` がまさにそれを実行します。それは、小さな安全な改善点を探すためにコードベースをスキャンし、その後提案、ビルド、アーカイブのプロセスを通してあなたを導き、各ステップを説明します。

まず、拡張コマンドを有効にします。

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

次にチャットで：

```text
/opsx:onboard
```

これは本物のプロジェクトにおける最も優しい導入方法であり、あなたは保持するか破棄するかできる、真の（小さな）変更を得ることになります。[Commands: `/opsx:onboard`](commands.md#opsxonboard) を参照してください。

## 「しかし、すでに要件定義書を持っています」

PRDやSRS、正式な仕様書、TLA+モデルを持っているかもしれません。それで良いのです。それらを丸ごとインポートする必要はなく、捨てる必要もありません。

既存のドキュメントを、変換すべき仕様としてではなく、**探索のためのソース資料**として扱ってください。変更を開始するときに、AIに関連セクションを貼り付けるか指示し、そこから焦点を絞ったOpenSpecデルタを作成させます。このデルタは、あなたが今変更している動作を、OpenSpecのテスト可能な要件およびシナリオの形式で捉えます。元のドキュメントは背景としてそのまま残ります。

正直な理由：OpenSpecの仕様書は意図的に行動（ビヘイビア）ファーストであり、変更にスコープされています。40ページのPRDは異なるアーティファクトであり、異なる役割を持っています。一度きりの一括変換を強制すると、誰も信頼しないような大規模で陳腐化した仕様が生まれる傾向があります。仕様書を実際の変更から成長させることで、それらを正確なものに保ちます。

```text
You: /opsx:explore
You: Here's the section of our PRD about checkout. I'm implementing the
     "guest checkout" requirement next.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## 大規模コードベースでの仕様の整理

仕様書は `openspec/specs/` の下に存在し、**ドメイン**（チームがシステムについて考えている論理的な領域）ごとにグループ化されます。最初から完全な分類法を設計する必要はありません。その領域で最初の変更が必要になったときに、ドメインフォルダを作成してください。

ドメインを分割する一般的な方法：

- **機能領域による:** `auth/`、`payments/`、`search/`
- **コンポーネントによる:** `api/`、`frontend/`、`workers/`
- **境界づけられた文脈（Bounded Context）による:** `ordering/`、`fulfillment/`、`inventory/`

新参者が頷くようなものを選んでください。後で洗練させることができます。[Concepts: Specs](concepts.md#specs) を参照してください。

## モノレポと複数のリポジトリにまたがる作業について

モノレポの場合、最もシンプルなモデルは、リポジトリルートにある単一の `openspec/` ディレクトリであり、ドメインがパッケージやサービスに対応しているというものです。これはほとんどのチームをカバーします。

もしあなたの作業が**複数のリポジトリ**（または別個のものとして扱ういくつかのパッケージ）に真にまたがる場合、OpenSpecにはベータ版の **stores** 機能があります。計画は独自のスタンドアロンのリポジトリ内に存在し、どのコードリポジトリからも参照できるため、計画を単一のリポジトリの `openspec/` フォルダ内に置く必要がなくなります。これはベータ版であるため、そのコマンドと状態は進化しているものとして扱ってください。[Stores User Guide](stores-beta/user-guide.md) を参照し、メンタルモデルと最も有用な経路を把握してください。

## いくつかの正直な忠告

- **すべてをバックフィルしようとする衝動に抵抗すること。** 変更していないコードの仕様を書くことは生産的だと感じますが、通常そうではありません。それらの仕様は陳腐化します。なぜなら、何ものも現実を追跡することを強制しないからです。実際の変更があなたの仕様を牽引するのを待ちましょう。
- **初期の変更を小さく保つこと。** 最初の数回の変更は、出荷することと同じくらいにリズムを学ぶことが重要です。狭いスコープはループを速くし、教訓を安価なものにします。
- **`openspec/` をgitにコミットする。** あなたの仕様書とアーカイブは、それらが記述するコードと一緒にバージョン管理下に置かれるべきです。
- **AIにコンテキストを与えること。** 強い規約を持つ大規模なコードベースでは、すべての提案があなたのスタックとパターンを尊重するように `openspec/config.yaml` の `context:` を埋めてください。[Customization](customization.md#project-configuration) を参照してください。

## 次にどこへ進むか

- [Explore First](explore.md) - 変更する前にコードを理解するための鍵となる習慣
- [Getting Started](getting-started.md) - 完全な最初の変更のウォークスルー
- [Editing & Iterating on a Change](editing-changes.md) - 学びながら変更を調整する方法
- [Concepts: Delta Specs](concepts.md#delta-specs) - デルタがブラウンフィールドでの作業をクリーンにする理由
- [Customization](customization.md) - OpenSpecにプロジェクトの規約を教える