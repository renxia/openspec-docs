# まず探る (Explore First)

**`/opsx:explore` はあなたの思考パートナーです。問題があるがまだ計画がないと感じたときはいつでも頼ってください。** それはあなたのコードベースを調査し、選択肢について一緒に検討し、単一の成果物や一行のコードが作成される前に、あなたが本当に何を望んでいるのかを明確にします。全体像が見えたら、`/opsx:propose` に引き継ぎます。

これらのドキュメントから一つの習慣を取り入れるなら、これです：**確信が持てないときは、提案する前に探る（explore）こと。**

なぜそれが重要なのかを見てみましょう。AIコーディングアシスタントは熱心です。漠然と尋ねると、彼らは自信満々に*何か*を構築しますが、それはあなたが本当に必要としていたものではないかもしれません。「Explore」がその特効薬です。これは、あなたとAIが一緒に正しい道を見つけるためのリスクのない会話であり、提案を行うときには、あなたは「正しいこと」を提案している状態になります。

## いつ探るべきか (When to explore)

「Explore」は、人々が思っているよりも頻繁に適切な最初のステップです。以下のいずれかが真実である場合にそれを使用してください。

- *問題* はわかっているが *解決策* がわからない場合。（例：「ページが遅いと感じる。」「認証機能がめちゃくちゃだ。」「重複注文が続いている。」）
- 複数のアプローチを比較検討しており、実際のコードに対するトレードオフを知りたい場合。
- コードベースに慣れておらず、変更を加える前に何がどのように機能しているかを理解する必要がある場合。
- 要件が曖昧で、コミットする前にそれらを明確にしたい場合。
- 作業量が見た目よりも大きいか小さいか疑っており、正直にスコープを定めたい場合。

すでに何を望んでいるか、そしてどうすればよいかを正確に知っている場合にのみ、「explore」をスキップしてください。その場合は、直接 [`/opsx:propose`](commands.md#opsxpropose) に進んでください。

## 何をするか（何もしないか）(What it does (and doesn't))

「Explore」はジェネレーターではなく**会話**です。

**できること:**
- 実際の質問に答えるためにコードベースを読み込み、検索する。
- 選択肢を比較し、それぞれのトレードオフを明記する。
- 設計を明確にするための図を作成する。
- 曖昧なアイデアを具体的で構築可能なスコープに絞り込むのを助ける。
- 準備ができた際に `/opsx:propose` に引き継ぐ。

**できないこと:**
- 変更フォルダを作成すること。
- いかなる成果物（提案、仕様書、設計書、タスク）も作成すること。
- コードの記述や修正を行うこと。

それがポイントです。「Explore」は費用をかけず、コミットメントも伴いません。3つの行き止まりを探求し、それぞれから何かを学び、それから初めて生き残った道筋を提案することができます。

## すでにインストールされています (It's already installed)

朗報です：`/opsx:explore` は `propose`、`apply`、`sync`、`archive` と並んで、デフォルトの**core**プロファイルに同梱されています。何も有効にする必要はありません。OpenSpec がプロジェクトにセットアップされていれば、AIチャットで「explore」が利用可能です。（すべての `/opsx:*` コマンドと同様に、ターミナルではなくアシスタントのチャットに入力します。[How Commands Work](how-commands-work.md) を参照してください。）

## 完全な例 (A full example)

漠然とした懸念が、いかにして鋭く構築可能な変更になるかを観察してください。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

何が起こったかに注目してください。出発点は「何か問題があるし、触るのが怖い」というものでした。20秒間の探求により、それは名前の付いた根本原因、3つのランク付けされた選択肢、既存のコードに結びついた推奨事項、そして正確な変更へと変わりました。後続する提案は、まず思考が完了しているため、鋭いものです。

## Propose への引き継ぎ (Handing off to propose)

「Explore」は何もアーカイブしません。準備ができたら、単に変更を開始し、AIに会話のコンテキストを成果物へ引き継がせます。

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

平易な言葉で「これを変更にしよう」と言うか、`/opsx:propose <name>` を直接実行しても構いません。いずれの場合も、あなたが行った探求が使い捨てのチャットではなく、提案の基盤となります。

拡張されたコマンドセットを使用する場合、「explore」はステップバイステップの成果物作成のために `/opsx:new` に引き継ぐことができます。[Workflows](workflows.md) を参照してください。

## 良い「探索（exploration）」のためのヒント (Tips for a good exploration)

- **解決策ではなく問題をもたらすこと。** 「ログインが遅いと感じる」という表現は、AIに調査する余地を与えます。「Redisキャッシュを追加する」と先に答えをコミットしてしまい、まだテストしていないものになります。
- **トレードオフについて声に出して尋ねること。** 「各オプションの欠点は何ですか？」と聞くことで、より正直な比較を得られます。
- **まず読ませること。** 最良の探求は、AIが推測するのではなく、実際にあなたのコードを見ることから始まります。必要であれば関連領域を指し示してください。
- **諦めても構いません。** 探求の結果、そのアイデアに価値がないと判明しても、それは勝利です。安く学んだのです。
- **変更途中で再探索すること。** `/opsx:apply` の最中に行き詰まりましたか？一度立ち止まってサブの問題を探索し、その後戻ってきましょう。

## 正直なトレードオフ (The honest tradeoffs)

**得られるもの:** 「Explore」は、いかなる成果物も存在しない最も安価な瞬間に誤った方向転換を検出します。特に不慣れなコードにおいて強力であり、AIがシステムを読み取り要約する能力によって、何時間もの調査作業を節約できます。

**かかるコスト:** 少しの忍耐です。「Explore」は会話であるため、`/opsx:propose` を実行して祈るよりも時間がかかります。あなたがすでに真に理解している作業に対して、その追加ステップは純粋なオーバーヘッドであり、スキップすべきです。

経験則：タスクが曖昧であればあるほど、「explore」の価値は高くなります。タスクが明確であればあるほど、提案へ直行できる可能性が高まります。

## 次に進むべき場所 (Where to go next)

- [Commands: `/opsx:explore`](commands.md#opsxexplore): 正確なリファレンス
- [Workflows](workflows.md): 日常のループにおける「explore」
- [Examples & Recipes](examples.md#recipe-3-exploring-before-you-commit): 完全なウォークスルーでの「explore」
- [Getting Started](getting-started.md): 最初の変更ガイド（探索を含む）