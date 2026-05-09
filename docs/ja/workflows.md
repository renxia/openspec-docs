# ワークフロー

このガイドでは、OpenSpec の一般的なワークフローパターンと、それぞれの使用場面について説明します。基本的なセットアップについては、[Getting Started](getting-started.md) を参照してください。コマンドリファレンスについては、[Commands](commands.md) を参照してください。

## 哲学: フェーズではなくアクション

従来のワークフローでは、計画、実装、完了というフェーズを順に進める必要があります。しかし、実際の作業はそのような箱にはきれいに収まりません。

OPSX は異なるアプローチをとります。

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**主要な原則:**

- **フェーズではなくアクション** - コマンドは、あなたが行えるアクションであり、囚われるべきステージではありません
- **依存関係はイネーブラー** - 次に何が必要かではなく、何が可能かを示します

> **カスタマイズ:** OPSX のワークフローは、成果物のシーケンスを定義するスキーマによって駆動されます。カスタムスキーマの作成の詳細については、[Customization](customization.md) を参照してください。

## 2つのモード

### デフォルトのクイックパス (`core` プロファイル)

新規インストールでは `core` がデフォルトとなり、以下が提供されます:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

一般的なフロー:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### 拡張/フルワークフロー (カスタム選択)

明示的なスキャフォールドおよびビルドコマンド (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`) を使用したい場合は、以下で有効にします:

```bash
openspec config profile
openspec update
```

## ワークフローパターン (拡張モード)

### クイック機能

構築したいものが明確で、実行するだけの場合:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**会話例:**

```text
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**最適な用途:** 小規模から中規模の機能、バグ修正、単純な変更。

### 探索的

要件が不明確な場合や、まず調査が必要な場合:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**会話例:**

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**最適な用途:** パフォーマンス最適化、デバッグ、アーキテクチャの決定、要件が不明確な場合。

### 並列変更

複数の変更を同時に作業する:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**会話例:**

```text
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**最適な用途:** 並列作業ストリーム、緊急の割り込み、チームコラボレーション。

複数の完了した変更がある場合は、`/opsx:bulk-archive` を使用します:

```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

一括アーカイブは、複数の変更が同じ仕様に触れた場合を検出し、実際に実装されている内容を確認して競合を解決します。

### 変更の完了

推奨される完了フロー:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### 検証: 作業を確認する

`/opsx:verify` は、3つの側面で実装をアーティファクトに対して検証します:

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

**検証がチェックする内容:**

| 側面 | 検証内容 |
|-----------|------------------|
| 完全性 | すべてのタスクが完了し、すべての要件が実装され、シナリオがカバーされている |
| 正確性 | 実装が仕様の意図と一致し、エッジケースが処理されている |
| 一貫性 | 設計決定がコードに反映され、パターンが一貫している |

検証はアーカイブをブロックしませんが、まず対処したい問題を表面化させます。

#### アーカイブ: 変更を確定する

`/opsx:archive` は変更を完了し、アーカイブに移動します:

```text
You: /opsx:archive

AI:  Archiving add-auth...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (12/12 tasks complete)

     Delta specs: Not yet synced to main
     → Would you like to sync now?

You: Yes

AI:  ✓ Synced specs to openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-auth/

     Change archived successfully.
```

アーカイブは、仕様が同期されていない場合にプロンプトを表示します。未完了のタスクではブロックしませんが、警告は表示します。

## いつ何を使うか

### `/opsx:ff` vs `/opsx:continue`

| 状況 | 使用するコマンド |
|-----------|-----|
| 要件が明確で、構築準備ができている | `/opsx:ff` |
| 探索中で、各ステップを確認したい | `/opsx:continue` |
| 仕様の前に提案を反復したい | `/opsx:continue` |
| 時間的制約があり、迅速に進める必要がある | `/opsx:ff` |
| 複雑な変更で、制御したい | `/opsx:continue` |

**経験則:** 全体のスコープを事前に説明できる場合は `/opsx:ff` を使用します。進行中に詰めていく場合は `/opsx:continue` を使用します。

### 更新するか、新規に始めるか

よくある質問: 既存の変更を更新するのはいつか、新規に始めるのはいつか？

**既存の変更を更新する場合:**

- 同じ意図で、実行を洗練している
- スコープが狭まる (まずMVP、残りは後で)
- 学習に基づく修正 (コードベースが予想と違った)
- 実装の発見に基づく設計の微調整

**新規の変更を始める場合:**

- 意図が根本的に変わった
- スコープがまったく異なる作業に爆発的に拡大した
- 元の変更を単独で「完了」としてマークできる
- パッチが明確にするより混乱させる

```text
                     ┌─────────────────────────────────────┐
                     │     Is this the same work?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Same intent?      >50% overlap?      Can original
          Same problem?     Same scope?        be "done" without
                 │                  │          these changes?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YES               NO YES           NO  NO              YES
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

**例: 「ダークモードを追加」**

- 「カスタムテーマもサポートする必要がある」→ 新規の変更 (スコープが爆発的に拡大)
- 「システム設定の検出が予想より難しい」→ 更新 (同じ意図)
- 「まずトグルを出荷し、設定は後で追加」→ 更新、アーカイブ、その後新規の変更

## ベストプラクティス

### 変更を焦点を絞って保つ

変更ごとに1つの論理的な作業単位。「機能Xを追加し、同時にYをリファクタリングしている」場合は、2つの別々の変更を検討してください。

**重要な理由:**
- レビューと理解が容易
- よりクリーンなアーカイブ履歴
- 独立して出荷可能
- 必要に応じてロールバックがより簡単

### 不明確な要件には `/opsx:explore` を使用する

変更にコミットする前に、問題空間を探索します:

```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebase, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

探索により、アーティファクトを作成する前に思考が明確になります。

### アーカイブ前に検証する

`/opsx:verify` を使用して、実装がアーティファクトと一致していることを確認します:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

変更を閉じる前に、不一致を捕捉します。

### 変更に明確な名前を付ける

良い名前は `openspec list` を役立たせます:

```text
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## コマンドクイックリファレンス

完全なコマンド詳細とオプションについては、[コマンド](commands.md) を参照してください。

| コマンド | 目的 | 使用タイミング |
|---------|---------|-------------|
| `/opsx:propose` | 変更と計画成果物を作成 | 高速デフォルトパス（`core` プロファイル） |
| `/opsx:explore` | アイデアを検討 | 要件が不明瞭な場合、調査時 |
| `/opsx:new` | 変更スキャフォールドを開始 | 拡張モード、明示的な成果物制御 |
| `/opsx:continue` | 次の成果物を作成 | 拡張モード、段階的な成果物作成 |
| `/opsx:ff` | すべての計画成果物を作成 | 拡張モード、明確なスコープ |
| `/opsx:apply` | タスクを実装 | コード記述の準備完了時 |
| `/opsx:verify` | 実装を検証 | 拡張モード、アーカイブ前 |
| `/opsx:sync` | デルタ仕様をマージ | 拡張モード、オプション |
| `/opsx:archive` | 変更を完了 | すべての作業完了時 |
| `/opsx:bulk-archive` | 複数の変更をアーカイブ | 拡張モード、並行作業 |

## 次のステップ

- [コマンド](commands.md) - オプション付きの完全なコマンドリファレンス
- [コンセプト](concepts.md) - スペック、成果物、スキーマの詳細解説
- [カスタマイズ](customization.md) - カスタムワークフローの作成