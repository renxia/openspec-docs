# 例とレシピ

現実の変更を、最初から最後まで。各レシピは、入力すべきコマンドとその結果をすべて示しているため、ご自身の状況にパターンを当てはめ、それをコピーすることができます。これらはデフォルトの**core**コマンド（`propose`、`explore`、`apply`、`sync`、`archive`）を使用しており、拡張セットが役立つ場合はその旨が記載されています。

始める前の注意点：`/opsx:propose`のようなスラッシュコマンドは**AIアシスタントのチャット**に入力し、`openspec`コマンドは**ターミナル**に入力します。これらが初めての場合は、まず[How Commands Work](how-commands-work.md)を読んでください。以下のトランスクリプトにおいて、「You:」と「AI:」がチャットであり、`$`で始まる行がターミナルの操作です。

> **何を作っているのかまだ確信が持てない場合？** これらのレシピのほとんどは、まず`/opsx:explore`から始めて、考えを整理することによってより明確になります。[Recipe 3](#recipe-3-exploring-before-you-commit)でその様子を示しており、[Explore First](explore.md)ガイドがその完全な根拠を提供します。

## Recipe 1: 小規模な機能の高速パス

**使用するタイミング:** 何をしたいか分かっており、それが限定的な作業である場合。これが最も一般的なレシピです。

全体は3つのコマンドで構成されます。提案（Propose）、構築（Build）、アーカイブ（Archive）。

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what (理由と内容)
     ✓ specs/      — the new requirement and its scenarios (新しい要件とそのシナリオ)
     ✓ design.md   — technical approach (技術的なアプローチ)
     ✓ tasks.md    — implementation checklist (実装チェックリスト)
     Ready for implementation. Run /opsx:apply.
```

次に、計画を読んでください。提案書とデルタ仕様（delta spec）を開きます。OpenSpecが作られているのはこの瞬間です。まだ400行のコードではなく、たった一つの段落で間違った仮定を見つけ出すためです。もし何かおかしいと感じたら、任意のアーティファクト（artifact）を直接編集し、続けてください。

```text
You: /opsx:apply

AI:  Working through tasks... (タスクの処理中...)
     ✓ 1.1 Add logout button to header (ヘッダーにログアウトボタンを追加)
     ✓ 1.2 Clear session on click (クリック時にセッションをクリア)
     ✓ 1.3 Add confirmation dialog (確認ダイアログを追加)
     All tasks complete! (すべてのタスクが完了しました！)

You: /opsx:archive

AI:  Archiving add-logout-button... (add-logout-buttonをアーカイブ中...)
     ✓ Merged specs into openspec/specs/auth/spec.md (仕様をopenspec/specs/auth/spec.mdにマージ)
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/ (openspec/changes/archive/2026-06-22-add-logout-button/へ移動)
     Done. Ready for the next change. (完了。次の変更の準備ができています。)
```

それだけです。ログアウトの動作はあなたの仕様の一部となり、その変更とその完全なコンテキストとともにファイルに保存されます。

## Recipe 2: バグ修正

**使用するタイミング:** 何か壊れており、それを「ミステリアスなコミット」ではなく「意図的な振る舞いへの変更」として記録したい場合。

バグ修正は機能（フィーチャー）とまったく同じように動作します。違いは、提案をどのように構成するかです。「バグを直す」だけでなく、「*正しい*振る舞い」を記述する必要があります。

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

この修正が、新しいシナリオを持つ`MODIFIED`（変更済み）な要件として記録されるため、次の担当者（または次のAIセッション）は、単に「あなたがそれを直した」ということだけでなく、「*正しい*とはどういうことか」を知ることができます。その後、通常通り`/opsx:apply`と`/opsx:archive`を実行します。

ヒント：修正の場合、良いシナリオとはプロセスの回帰テスト（regression test）を文章で記述することです。「ログアウト状態のユーザーが有効な認証情報を送信した場合、ダッシュボードに遷移し、再度リダイレクトされないこと。」これを記述すれば、実装は明確なターゲットを持てます。

## Recipe 3: コミットする前の探索

**使用するタイミング:** 問題はあるものの、まだ計画がない場合。何を作るべきか、どのアプローチが正しいのか確信が持てない場合です。

`/opsx:explore`から始めてください。これは構造やアーティファクト（成果物）を作成しない思考パートナーです。コードベースを読み込み、意思決定を支援します。

```text
You: /opsx:explore

AI:  What would you like to explore? (何を探索したいですか？)

You: Page loads feel slow but I don't know where the time goes. (ページの読み込みが遅いように感じるが、どこに時間がかかっているのか分からない。)

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list (製品リストの大きな最適化されていない画像)
     2. Synchronous data fetching that blocks render (レンダリングをブロックする同期的なデータ取得)
     3. Re-renders triggered by context changes (コンテキスト変更によって引き起こされる再レンダリング)
     Which should we tackle first? (どれから取り組むべきでしょうか？)

You: The data fetching one. (データ取得の方です。)

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation. (先ほど見つけた情報に基づいた提案とともに変更を作成しました。実装の準備ができています。)
```

探索は、その変更に時間をかける*前*に思考を明確にします。洞察が結晶化したら、提案し、AIにコンテキストを引き継がせます。

## Recipe 4: 複数の変更を同時に進める

**使用するタイミング:** 機能の途中にいて、緊急の修正がキューを飛び越えてきた場合。

変更は独立したフォルダであるため、並行作業による衝突はありません。まず修正に着手し、それをリリースした後、元の機能に戻り、中断したところから再開します。

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now. (add-dark-modeの途中にいるが、今ログインバグを修正する必要がある。)

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation. (実装の準備ができています。)

You: /opsx:apply

AI:  Implemented the fix. All tasks complete. (修正を実装しました。すべてのタスクが完了しました。)

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect. (fix-login-redirectをアーカイブしました。)

You: Back to dark mode. (ダークモードに戻る。)

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header... (add-dark-modeの再開。タスク2.3：ヘッダーの更新から再開...)
```

`/opsx:apply add-dark-mode`で変更名を指定することが、複数の変更がアクティブな場合にAIに特定の変更を指し示す方法です。タスクが`tasks.md`で完了状況を追跡しているため、AIはあなたがどこで止まったかを正確に知っています。

複数の変更を同時に行う場合、拡張された`/opsx:bulk-archive`がそれらをまとめてアーカイブし、実際に実装されている内容を確認することで仕様の衝突を解決します。[Workflows](workflows.md#parallel-changes)を参照してください。

## Recipe 5: 振る舞いの変更を伴わないリファクタリング

**使用するタイミング:** コードを再構築しているが、外部から見える振る舞いは同一でなければならない場合。

これは興味深いケースです。純粋なリファクタリングには「仕様に追加すべきもの」が*何もない*からです。振る舞いの契約は変わらず、実装だけが変わります。したがって、作業はデザインとタスクに存在し、仕様のデルタは空であるか、存在しません。

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation. (変更を作成しました。提案では目標（支払いモジュールの分割、振る舞いの変更なし）を述べ、デザインが新しい構造を捉えています。振る舞いは同一であるため、仕様の変更はありません。実装の準備ができています。)
```

仕様に触れない変更をアーカイブする場合、ターミナルコマンドで仕様ステップをスキップするように指示できます。

```bash
$ openspec archive refactor-payment-module --skip-specs
```

このフラグは、ツール、CI（継続的インテグレーション）、ドキュメントのみの変更にも便利です。原則として：仕様は振る舞いを記述するため、振る舞いが変わらなければ、仕様も変えるべきではない。詳しくは[Concepts](concepts.md#what-a-spec-is-and-is-not)を参照してください。

## Recipe 6: ステップごとの制御（拡張コマンド）

**使用するタイミング:** 複雑でリスクの高い変更であり、次に進む前に各アーティファクトをレビューしたい場合。

コアの`/opsx:propose`はすべてを一括でドラフトします。一つずつ進めたい場合は、拡張コマンドを有効にします。

```bash
$ openspec config profile      # 拡張ワークフローを選択
$ openspec update              # これらをこのプロジェクトに適用
```

これで、段階的にスキャフォールド（scaffold）し、構築することができます。

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal. (提案の作成準備ができています。)

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design. (proposal.mdを作成しました。現在利用可能なもの：specs、design。)

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design. (specs/auth/spec.mdを作成しました。現在利用可能なもの：design。)
```

各アーティファクトが生成されるたびにレビューし、自由に編集し、満足できたら続行します。残りのものを一括でドラフトしたい場合は、`/opsx:ff`を使用して残りすべてを早送り（fast-forward）します。アーカイブする前に、`/opsx:verify`が実装が仕様と一致しているかを確認します。[Workflows](workflows.md#opsxff-vs-opsxcontinue)を参照してください。

## Recipe 7: 全てのループのハンズオン学習

**使用するタイミング:** OpenSpecをインストールし、おもちゃのような例ではなく、自分のコードでワークフローを*体感したい*場合。

拡張コマンドを有効にし（Recipe 6を参照）、次に進みます。

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together... (OpenSpecへようこそ！実際のコードベースを使用して完全な変更を案内します。一緒にできる小さく安全な改善点をスキャンさせてください...)
```

`/opsx:onboard`は、本物の（小さな）改善点を見つけ、それに対する変更を作成し、実装し、アーカイブし、すべてのステップをナレーションします。所要時間は15分から30分で、保持するか破棄できる実用的な変更を残します。これは最も優しい学習方法です。[Commands](commands.md#opsxonboard)を参照してください。

## ターミナルからの作業確認

いつでも、ターミナルから物事の状態を検査できます。

```bash
$ openspec list                      # アクティブな変更
$ openspec show add-dark-mode        # 特定の変更の詳細
$ openspec validate add-dark-mode    # 構造のチェック
$ openspec view                      # インタラクティブダッシュボード
```

これらは読み取りおよび検査のためのツールです。提案と構築は、引き続きチャット内のスラッシュコマンドで行います。詳細は[CLI reference](cli.md)を参照してください。

## 次にどこへ進むか

- [Explore First](explore.md): 不安な場合に推奨される開始方法
- [Workflows](workflows.md): 使用すべきタイミングに関する意思決定ガイダンス付きの上記のパターン
- [Commands](commands.md): すべてのスラッシュコマンドの詳細
- [Getting Started](getting-started.md): 標準的な最初の変更ウォークスルー
- [Concepts](concepts.md): なぜ各ピースがこのように組み合わさっているのか