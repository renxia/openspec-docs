# ワークフロー

このガイドでは、OpenSpecの一般的なワークフローパターンと、それぞれの使用タイミングについて説明します。基本的な設定については、[はじめに](getting-started.md)を参照してください。コマンドリファレンスについては、[コマンド](commands.md)を参照してください。

## 哲学：フェーズではなくアクション

従来のワークフローは、計画、実装、完了というフェーズを強制します。しかし、実際の作業はきれいに枠に収まるものではありません。

OPSXは異なるアプローチを取ります：

```text
従来型（フェーズ固定）:

  計画 ────────► 実装 ────────► 完了
      │                │
      │  "戻れない"    │
      └────────────────┘

OPSX（流動的なアクション）:

  提案 ──► 仕様 ──► 設計 ──► タスク ──► 実装
```

**重要な原則：**

- **アクション、フェーズではない** - コマンドは実行可能な操作であり、固定された段階ではない
- **依存関係は促進要因** - 次に何が必要かを示すのではなく、何が可能かを示す

> **カスタマイズ：** OPSXのワークフローは、成果物のシーケンスを定義するスキーマによって駆動されます。カスタムスキーマの作成については、[カスタマイズ](customization.md)を参照してください。

## 2つのモード

### デフォルトのクイックパス（`core`プロファイル）

新規インストールでは、デフォルトで`core`が使用され、以下が提供されます：
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

典型的なフロー：

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### 拡張/フルワークフロー（カスタム選択）

明示的なスキャフォールド＆ビルドコマンド（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:sync`、`/opsx:bulk-archive`、`/opsx:onboard`）を使用したい場合は、以下で有効にします：

```bash
openspec config profile
openspec update
```

## ワークフローパターン（拡張モード）

### クイックフィーチャー

何を構築するか既に分かっていて、実行するだけの場合：

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**会話例：**

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

**最適な用途：** 小〜中規模のフィーチャー、バグ修正、単純な変更。

### 探索型

要件が不明確で、まず調査が必要な場合：

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**会話例：**

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

**最適な用途：** パフォーマンス最適化、デバッグ、アーキテクチャの決定、不明確な要件。

### 並列変更

複数の変更を同時に作業する場合：

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**会話例：**

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

**最適な用途：** 並列作業ストリーム、緊急の割り込み、チームコラボレーション。

完了した変更が複数ある場合は、`/opsx:bulk-archive`を使用します：

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

一括アーカイブは、複数の変更が同じスペックに影響する場合を検出し、実際に実装されている内容を確認して競合を解決します。

### 変更の完了

推奨される完了フロー：

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### 検証：作業を確認する

`/opsx:verify`は、3つの側面にわたってアーティファクトに対する実装を検証します：

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

**検証でチェックする内容：**

| 側面 | 検証内容 |
|-----------|------------------|
| 完全性 | すべてのタスク完了、すべての要件実装、シナリオ網羅 |
| 正確性 | 実装がスペックの意図と一致、エッジケースの処理 |
| 一貫性 | 設計決定がコードに反映、パターンの一貫性 |

検証はアーカイブをブロックしませんが、先に解決したい問題を浮き彫りにします。

#### アーカイブ：変更を確定する

`/opsx:archive`は変更を完了し、アーカイブに移動します：

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

スペックが同期されていない場合、アーカイブはプロンプトを表示します。未完了のタスクでブロックはしませんが、警告を表示します。

## いつ何を使用するか

### `/opsx:ff` vs `/opsx:continue`

| 状況 | 使用するコマンド |
|-----------|-----|
| 要件が明確で、構築準備が整っている | `/opsx:ff` |
| 探索中で、各ステップを確認したい | `/opsx:continue` |
| スペック作成前に提案を反復したい | `/opsx:continue` |
| 時間的制約があり、素早く進みたい | `/opsx:ff` |
| 複雑な変更で、制御を保ちたい | `/opsx:continue` |

**経験則：** 全体像を最初から説明できる場合は`/opsx:ff`を使用。進行しながら決める場合は`/opsx:continue`を使用。

### 更新するか、新規作成するか

よくある質問：既存の変更を更新すべきか、新規に作成すべきか？

**既存の変更を更新する場合：**

- 意図は同じで、実行を洗練する場合
- スコープが狭まる場合（まずMVP、残りは後で）
- 学習に基づく修正（コードベースが予想と異なる）
- 実装の発見に基づく設計の微調整

**新規の変更を開始する場合：**

- 意図が根本的に変化した
- スコープが全く異なる作業に拡大した
- 元の変更を「完了」として単独でマークできる
- パッチが混乱を招く

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

**例：「ダークモードを追加」**

- 「カスタムテーマのサポートも必要」→ 新規変更（スコープ拡大）
- 「システム設定の検出が予想より難しい」→ 更新（同じ意図）
- 「まずトグルをリリースし、設定は後で追加」→ 更新してアーカイブ、その後新規変更

## ベストプラクティス

### 変更を集中させる

変更ごとに1つの論理的な作業単位。もし「フィーチャーXを追加しつつYをリファクタリング」する場合は、2つの別々の変更を検討してください。

**重要性：**
- レビューと理解が容易
- アーカイブ履歴がクリーン
- 独立してリリース可能
- 必要に応じてロールバックが簡単

### 不明確な要件には`/opsx:explore`を使用

変更を開始する前に、問題空間を探索します：

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

探索は、アーティファクトを作成する前に思考を明確にします。

### アーカイブ前に検証

`/opsx:verify`を使用して、実装がアーティファクトと一致することを確認します：

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

変更を完了する前に、不一致をキャッチします。

### 変更に明確な名前を付ける

適切な名前は`openspec list`を有用にします：

```text
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## コマンドクイックリファレンス

コマンドの詳細とオプションについては、[コマンド](commands.md)を参照してください。

| コマンド | 目的 | 使用タイミング |
|---------|---------|-------------|
| `/opsx:propose` | 変更 + プランニングアーティファクトの作成 | 高速デフォルトパス（`core`プロファイル） |
| `/opsx:explore` | アイデアを検討する | 要件が不明確な場合、調査時 |
| `/opsx:new` | 変更のスキャフォールドを開始する | 拡張モード、明示的なアーティファクト制御時 |
| `/opsx:continue` | 次のアーティファクトを作成する | 拡張モード、ステップバイステップのアーティファクト作成時 |
| `/opsx:ff` | 全てのプランニングアーティファクトを作成する | 拡張モード、明確な範囲時 |
| `/opsx:apply` | タスクを実装する | コードを書く準備ができている時 |
| `/opsx:verify` | 実装を検証する | 拡張モード、アーカイブ前 |
| `/opsx:sync` | デルタ仕様をマージする | 拡張モード、オプション |
| `/opsx:archive` | 変更を完了する | 全ての作業が完了した時 |
| `/opsx:bulk-archive` | 複数の変更をアーカイブする | 拡張モード、並列作業時 |

## 次のステップ

- [コマンド](commands.md) - オプション付きの完全なコマンドリファレンス
- [コンセプト](concepts.md) - 仕様、アーティファクト、スキーマの詳細解説
- [カスタマイズ](customization.md) - カスタムワークフローの作成