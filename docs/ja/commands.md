# コマンド

これはOpenSpecのスラッシュコマンドのリファレンスです。これらのコマンドは、AIコーディングアシスタントのチャットインターフェース（例：Claude Code、Cursor、Windsurf）で呼び出されます。

ワークフローパターンや各コマンドの使用タイミングについては、[ワークフロー](workflows.md)を参照してください。CLIコマンドについては、[CLI](cli.md)を参照してください。

## クイックリファレンス

### デフォルトのクイックパス（`core`プロファイル）

| コマンド | 目的 |
|---------|------|
| `/opsx:propose` | 変更を作成し、計画アーティファクトを1ステップで生成します |
| `/opsx:explore` | 変更を確定する前にアイデアを検討します |
| `/opsx:apply` | 変更からタスクを実装します |
| `/opsx:archive` | 完了した変更をアーカイブします |

### 拡張ワークフローコマンド（カスタムワークフロー選択）

| コマンド | 目的 |
|---------|------|
| `/opsx:new` | 新しい変更のスキャフォールドを開始します |
| `/opsx:continue` | 依存関係に基づいて次のアーティファクトを作成します |
| `/opsx:ff` | 高速転送：すべての計画アーティファクトを一度に作成します |
| `/opsx:verify` | 実装がアーティファクトと一致するかを検証します |
| `/opsx:sync` | デルタ仕様をメイン仕様にマージします |
| `/opsx:bulk-archive` | 複数の変更を一度にアーカイブします |
| `/opsx:onboard` | 完全なワークフローをガイド付きチュートリアルで案内します |

デフォルトのグローバルプロファイルは`core`です。拡張ワークフローコマンドを有効にするには、`openspec config profile`を実行してワークフローを選択し、プロジェクトで`openspec update`を実行してください。

## コマンドリファレンス

### `/opsx:propose`

新しい変更を作成し、計画アーティファクトを1ステップで生成します。これは`core`プロファイルのデフォルトの開始コマンドです。

**構文:**
```text
/opsx:propose [change-name-or-description]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name-or-description` | いいえ | ケバブケースの名前、またはプレーン言語の変更説明 |

**機能:**
- `openspec/changes/<change-name>/`を作成
- 実装に必要なアーティファクトを生成（`spec-driven`の場合は、提案、仕様、設計、タスク）
- 変更が`/opsx:apply`の準備ができたら停止

**例:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**ヒント:**
- 最速のエンドツーエンドパスにはこれを使用
- ステップごとのアーティファクト制御が必要な場合は、拡張ワークフローを有効にして`/opsx:new` + `/opsx:continue`を使用

---

### `/opsx:explore`

変更をコミットする前に、アイデアを検討し、問題を調査し、要件を明確にします。

**構文:**
```
/opsx:explore [topic]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `topic` | いいえ | 探索または調査したい内容 |

**機能:**
- 構造を必要としない探索的な会話を開く
- コードベースを調査して質問に答える
- オプションやアプローチを比較
- 思考を明確にするためのビジュアル図を作成
- 洞察が具体化した時点で、`/opsx:propose`（デフォルト）または`/opsx:new`（拡張ワークフロー）に移行可能

**例:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**ヒント:**
- 要件が不明確な場合や調査が必要な場合に使用
- 探索中はアーティファクトは作成されない
- 決定前に複数のアプローチを比較するのに適している
- ファイルの読み取りやコードベースの検索が可能

---

### `/opsx:new`

新しい変更のスキャフォールドを開始します。変更フォルダを作成し、`/opsx:continue`または`/opsx:ff`でアーティファクトを生成するのを待ちます。

このコマンドは拡張ワークフローセットの一部です（デフォルトの`core`プロファイルには含まれません）。

**構文:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 変更フォルダの名前（未指定の場合はプロンプト表示） |
| `--schema` | いいえ | 使用するワークフロースキーマ（デフォルト: 設定または`spec-driven`から） |

**機能:**
- `openspec/changes/<change-name>/`ディレクトリを作成
- 変更フォルダに`.openspec.yaml`メタデータファイルを作成
- 作成準備完了の最初のアーティファクトテンプレートを表示
- 未指定の場合は変更名とスキーマをプロンプト表示

**作成されるもの:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # 変更メタデータ（スキーマ、作成日）
```

**例:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**ヒント:**
- 記述的な名前を使用: `add-feature`、`fix-bug`、`refactor-module`
- `update`、`changes`、`wip`のような汎用的な名前は避ける
- スキーマはプロジェクト設定（`openspec/config.yaml`）でも設定可能

---

### `/opsx:continue`

依存チェーンの次のアーティファクトを作成します。段階的な進捗のために1回に1つのアーティファクトを作成します。

**構文:**
```
/opsx:continue [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 続行する変更（未指定の場合はコンテキストから推測） |

**機能:**
- アーティファクト依存グラフをクエリ
- 準備完了 vs ブロックされているアーティファクトを表示
- 最初の準備完了アーティファクトを作成
- コンテキスト用の依存ファイルを読み取り
- 作成後に利用可能になるものを表示

**例:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**ヒント:**
- 続行前に各アーティファクトを確認したい場合に使用
- 制御が必要な複雑な変更に適している
- 複数のアーティファクトが同時に準備完了になる場合がある
- 続行前に作成したアーティファクトを編集可能

---

### `/opsx:ff`

アーティファクト作成を早送りします。すべての計画アーティファクトを一度に作成します。

**構文:**
```
/opsx:ff [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 早送りする変更（未指定の場合はコンテキストから推測） |

**機能:**
- 依存順序ですべてのアーティファクトを作成
- TODOリストで進捗を追跡
- すべての`apply-required`アーティファクトが完了したら停止
- 次のアーティファクトを作成する前に各依存を読み取り

**例:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**ヒント:**
- 構築するものの明確なイメージがある場合に使用
- 単純な変更には`/opsx:continue`より高速
- その後もアーティファクトを編集可能
- 小規模から中規模の機能に適している

---

### `/opsx:apply`

変更からタスクを実装します。タスクリストを処理し、コードを書き、項目にチェックを入れます。

**構文:**
```
/opsx:apply [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 実装する変更（未指定の場合はコンテキストから推測） |

**機能:**
- `tasks.md`を読み取り、未完了タスクを特定
- タスクを1つずつ処理
- 必要に応じてコードを書き、ファイルを作成、テストを実行
- チェックボックス`[x]`でタスクを完了としてマーク

**例:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**ヒント:**
- 中断した場合でも途中から再開可能
- 変更名を指定して並列変更に使用
- 完了状態は`tasks.md`のチェックボックスで追跡

---

### `/opsx:verify`

実装が変更アーティファクトと一致することを検証します。完全性、正確性、一貫性をチェックします。

**構文:**
```
/opsx:verify [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 検証する変更（未指定の場合はコンテキストから推測） |

**機能:**
- 実装品質の3つの次元をチェック
- 実装の証拠をコードベースで検索
- CRITICAL、WARNING、SUGGESTIONに分類された問題を報告
- アーカイブをブロックしないが、問題を表面化

**検証次元:**

| 次元 | 検証内容 |
|-----------|-------------------|
| **完全性** | すべてのタスク完了、すべての要件実装、シナリオカバー |
| **正確性** | 実装が仕様の意図と一致、エッジケースの処理 |
| **一貫性** | 設計決定がコードに反映、パターンの一貫性 |

**例:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**ヒント:**
- アーカイブ前に不一致をキャッチするために実行
- 警告はアーカイブをブロックしないが、潜在的な問題を示す
- コミット前にAIの作業を確認するのに適している
- アーティファクトと実装の乖離を明らかにできる

---

### `/opsx:sync`

**オプションコマンド。** 変更からメイン仕様にデルタ仕様をマージします。アーカイブ時に必要に応じて同期を促すため、通常は手動で実行する必要はありません。

**構文:**
```
/opsx:sync [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 同期する変更（未指定の場合はコンテキストから推測） |

**機能:**
- 変更フォルダからデルタ仕様を読み取り
- ADDED/MODIFIED/REMOVED/RENAMEDセクションを解析
- 変更をメインの`openspec/specs/`ディレクトリにマージ
- デルタで言及されていない既存のコンテンツを保持
- 夘更をアーカイブしない（アクティブなまま）

**例:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**手動で使用するタイミング:**

| シナリオ | syncを使用するか？ |
|----------|-----------|
| 長期間の変更で、アーカイブ前にメインに仕様を持ちたい場合 | はい |
| 複数の並列変更が更新されたベース仕様を必要とする場合 | はい |
| マージを別途プレビュー/レビューしたい場合 | はい |
| 短い変更で、アーカイブに直接進む場合 | いいえ（アーカイブが処理） |

**ヒント:**
- syncはインテリジェントで、コピー＆ペーストではない
- 既存の要件にシナリオを追加可能（重複なし）
- sync後も変更はアクティブなまま（アーカイブされない）
- 多くのユーザーは直接呼び出す必要がない—必要に応じてアーカイブが促す

---

### `/opsx:archive`

完了した変更をアーカイブします。変更を確定し、アーカイブフォルダに移動します。

**構文:**
```
/opsx:archive [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | アーカイブする変更（未指定の場合はコンテキストから推測） |

**機能:**
- アーティファクトの完了状態をチェック
- タスクの完了をチェック（未完了の場合は警告）
- まだ同期されていない場合はデルタ仕様の同期を提案
- 変更フォルダを`openspec/changes/archive/YYYY-MM-DD-<name>/`に移動
- 監査証跡用にすべてのアーティファクトを保持

**例:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**ヒント:**
- アーカイブは未完了タスクでブロックしないが、警告する
- デルタ仕様はアーカイブ時または事前に同期可能
- アーカイブされた変更は履歴用に保持
- 問題をキャッチするために先に`/opsx:verify`を使用

---

### `/opsx:bulk-archive`

複数の完了した変更を一度にアーカイブします。変更間の仕様の競合を処理します。

**構文:**
```
/opsx:bulk-archive [change-names...]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-names` | いいえ | アーカイブする特定の変更（未指定の場合は選択を促す） |

**機能:**
- すべての完了した変更をリスト表示
- アーカイブ前に各変更を検証
- 変更間の仕様の競合を検出
- 実際に実装されているものを確認して競合を解決
- 時系列順にアーカイブ

**例:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**ヒント:**
- 並列ワークフローに適している
- 競合解決はエージェント的（コードベースを確認）
- 変更は作成順にアーカイブ
- 仕様コンテンツの上書き前にプロンプト表示

---

### `/opsx:onboard`

完全なOpenSpecワークフローを通じたガイド付きオンボーディング。実際のコードベースを使用したインタラクティブチュートリアルです。

**構文:**
```
/opsx:onboard
```

**機能:**
- ナレーション付きで完全なワークフローサイクルを実演
- 実際の改善機会のためにコードベースをスキャン
- 実際のアーティファクトで実際の変更を作成
- 実際の作業を実装（小さく安全な変更）
- 完了した変更をアーカイブ
- 各ステップを実行中に説明

**フェーズ:**
1. ウェルカムとコードベース分析
2. 改善機会の発見
3. 変更の作成（`/opsx:new`）
4. 提案の作成
5. 仕様の作成
6. 設計の作成
7. タスクの作成
8. タスクの実装（`/opsx:apply`）
9. 実装の検証
10. 変更のアーカイブ
11. まとめと次のステップ

**例:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**ヒント:**
- ワークフローを学ぶ新規ユーザーに最適
- おもちゃの例ではなく、実際のコードを使用
- 保持または破棄可能な実際の変更を作成
- 完了まで15〜30分かかる

---

## AI ツール別のコマンド構文

異なる AI ツールは、わずかに異なるコマンド構文を使用します。お使いのツールに合った形式を使用してください：

| ツール | 構文例 |
|------|----------------|
| Claude Code | `/opsx:propose`、`/opsx:apply` |
| Cursor | `/opsx-propose`、`/opsx-apply` |
| Windsurf | `/opsx-propose`、`/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`、`/opsx-apply` |
| Trae | `/openspec-propose`、`/openspec-apply-change` などのスキルベースの呼び出し（生成された `opsx-*` コマンドファイルはなし） |

ツール全体で意図は同じですが、コマンドの表示方法は統合方法によって異なる場合があります。

> **注意：** GitHub Copilot コマンド（`.github/prompts/*.prompt.md`）は IDE 拡張機能（VS Code、JetBrains、Visual Studio）でのみ利用可能です。GitHub Copilot CLI は現在カスタムプロンプトファイルをサポートしていません — 詳細と回避策については [サポートされているツール](supported-tools.md) を参照してください。

---

## レガシーコマンド

これらのコマンドは、以前の「一括」ワークフローを使用します。引き続き動作しますが、OPSX コマンドの使用が推奨されます。

| コマンド | 機能 |
|---------|--------------|
| `/openspec:proposal` | すべての成果物を一度に作成（提案、仕様、設計、タスク） |
| `/openspec:apply` | 変更を実装する |
| `/openspec:archive` | 変更をアーカイブする |

**レガシーコマンドを使用するタイミング：**
- 古いワークフローを使用している既存のプロジェクト
- 段階的な成果物作成が不要な単純な変更
- オール・オア・ナッシングのアプローチを好む場合

**OPSX への移行：**
レガシーな変更は OPSX コマンドで引き続き処理できます。成果物構造は互換性があります。

---

## トラブルシューティング

### 「Change not found」

コマンドが作業対象の変更を特定できませんでした。

**解決策：**
- 変更名を明示的に指定する：`/opsx:apply add-dark-mode`
- 変更フォルダが存在することを確認する：`openspec list`
- 正しいプロジェクトディレクトリにいることを確認する

### 「No artifacts ready」

すべての成果物が完了しているか、依存関係の不足によりブロックされています。

**解決策：**
- `openspec status --change <name>` を実行して、何がブロックされているかを確認する
- 必要な成果物が存在するかを確認する
- 不足している依存関係の成果物を先に作成する

### 「Schema not found」

指定されたスキーマが存在しません。

**解決策：**
- 利用可能なスキーマを一覧表示する：`openspec schemas`
- スキーマ名のスペルを確認する
- カスタムスキーマの場合は作成する：`openspec schema init <name>`

### コマンドが認識されない

AI ツールが OpenSpec コマンドを認識しません。

**解決策：**
- OpenSpec が初期化されていることを確認する：`openspec init`
- スキルを再生成する：`openspec update`
- `.claude/skills/` ディレクトリが存在することを確認する（Claude Code の場合）
- AI ツールを再起動して新しいスキルを読み込ませる

### 成果物が正しく生成されない

AI が不完全または不正確な成果物を作成します。

**解決策：**
- `openspec/config.yaml` にプロジェクトコンテキストを追加する
- 特定のガイダンスのために成果物ごとのルールを追加する
- 変更の説明に詳細を追加する
- より制御を行うために `/opsx:ff` の代わりに `/opsx:continue` を使用する

---

## 次のステップ

- [ワークフロー](workflows.md) - 一般的なパターンと各コマンドの使用タイミング
- [CLI](cli.md) - 管理と検証のためのターミナルコマンド
- [カスタマイズ](customization.md) - カスタムスキーマとワークフローの作成