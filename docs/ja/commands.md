# コマンド

これは OpenSpec のスラッシュコマンドのリファレンスです。これらのコマンドは、AI コーディングアシスタントのチャットインターフェース（例：Claude Code、Cursor、Windsurf）で呼び出されます。

ワークフローパターンと各コマンドの使用タイミングについては、[ワークフロー](workflows.md) を参照してください。CLI コマンドについては、[CLI](cli.md) を参照してください。

## クイックリファレンス

### デフォルトのクイックパス（`core` プロファイル）

| コマンド | 目的 |
|---------|---------|
| `/opsx:propose` | 変更を作成し、計画アーティファクトを1ステップで生成する |
| `/opsx:explore` | 変更をコミットする前にアイデアを検討する |
| `/opsx:apply` | 変更からタスクを実装する |
| `/opsx:sync` | デルタ仕様をメイン仕様にマージする |
| `/opsx:archive` | 完了した変更をアーカイブする |

### 拡張ワークフローカマンド（カスタムワークフロー選択）

| コマンド | 目的 |
|---------|---------|
| `/opsx:new` | 新しい変更スキャフォールドを開始する |
| `/opsx:continue` | 依存関係に基づいて次のアーティファクトを作成する |
| `/opsx:ff` | ファストフォワード：すべての計画アーティファクトを一度に作成する |
| `/opsx:verify` | 実装がアーティファクトと一致するか検証する |
| `/opsx:bulk-archive` | 複数の変更を一度にアーカイブする |
| `/opsx:onboard` | 完全なワークフローのガイド付きチュートリアル |

デフォルトのグローバルプロファイルは `core` です。拡張ワークフローカマンドを有効にするには、`openspec config profile` を実行し、ワークフローを選択してから、プロジェクト内で `openspec update` を実行してください。

---

## コマンドリファレンス

### `/opsx:propose`

新しい変更を作成し、計画成果物を1ステップで生成します。これは `core` プロファイルのデフォルトの開始コマンドです。

**構文:**
```text
/opsx:propose [change-name-or-description]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name-or-description` | いいえ | ケバブケースの名前または平易な言語による変更の説明 |

**動作内容:**
- `openspec/changes/<change-name>/` を作成します
- 実装前に必要な成果物を生成します（`spec-driven` の場合: 提案、仕様、設計、タスク）
- 変更が `/opsx:apply` の準備が整った時点で停止します

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
- 最速のエンドツーエンドのパスにはこれを使用します
- ステップバイステップの成果物制御が必要な場合は、拡張ワークフローを有効にして `/opsx:new` + `/opsx:continue` を使用してください

---

### `/opsx:explore`

変更をコミットする前にアイデアを検討し、問題を調査し、要件を明確にします。

**構文:**
```
/opsx:explore [topic]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `topic` | いいえ | 探求または調査したい内容 |

**動作内容:**
- 構造を必要としない探索的な会話を開始します
- 質問に答えるためにコードベースを調査します
- オプションとアプローチを比較します
- 思考を明確にするための視覚的なダイアグラムを作成します
- 洞察が具体化した時点で `/opsx:propose`（デフォルト）または `/opsx:new`（拡張ワークフロー）に移行できます

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
- 要件が不明確な場合や調査が必要な場合に使用します
- 探索中は成果物は作成されません
- 決定する前に複数のアプローチを比較するのに適しています
- ファイルの読み取りやコードベースの検索が可能です

---

### `/opsx:new`

新しい変更のスキャフォールドを開始します。変更フォルダを作成し、`/opsx:continue` または `/opsx:ff` で成果物を生成するのを待ちます。

このコマンドは拡張ワークフローセットの一部です（デフォルトの `core` プロファイルには含まれません）。

**構文:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 変更フォルダの名前（指定がない場合はプロンプトが表示されます） |
| `--schema` | いいえ | 使用するワークフロースキーマ（デフォルト: 設定または `spec-driven` から） |

**動作内容:**
- `openspec/changes/<change-name>/` ディレクトリを作成します
- 変更フォルダに `.openspec.yaml` メタデータファイルを作成します
- 作成準備が整った最初の成果物テンプレートを表示します
- 名前とスキーマが指定されていない場合はプロンプトを表示します

**作成される内容:**
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
- 説明的な名前を使用します: `add-feature`, `fix-bug`, `refactor-module`
- `update`, `changes`, `wip` などの一般的な名前は避けてください
- スキーマはプロジェクト設定 (`openspec/config.yaml`) でも設定できます

---

### `/opsx:continue`

依存関係チェーン内の次の成果物を作成します。増分の進捗のために一度に1つの成果物を作成します。

**構文:**
```
/opsx:continue [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 続行する変更（指定がない場合はコンテキストから推測） |

**動作内容:**
- 成果物の依存関係グラフを照会します
- 準備完了とブロックされた成果物を表示します
- 最初の準備完了の成果物を作成します
- コンテキストのために依存ファイルを読み取ります
- 作成後に利用可能になるものを表示します

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
- 進む前に各成果物を確認したい場合に使用します
- 制御が必要な複雑な変更に適しています
- 複数の成果物が同時に準備完了になる場合があります
- 続行する前に作成された成果物を編集できます

---

### `/opsx:ff`

成果物作成を早送りします。すべての計画成果物を一度に作成します。

**構文:**
```
/opsx:ff [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 早送りする変更（指定がない場合はコンテキストから推測） |

**動作内容:**
- 依存関係の順序ですべての成果物を作成します
- TODOリストで進捗を追跡します
- すべての `apply-required` 成果物が完了した時点で停止します
- 次の成果物を作成する前に各依存関係を読み取ります

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
- 構築する内容が明確な場合に使用します
- 単純な変更には `/opsx:continue` よりも高速です
- その後でも成果物を編集できます
- 小さなから中程度の機能に適しています

---

### `/opsx:apply`

変更からタスクを実装します。タスクリストを処理し、コードを記述し、項目をチェックオフします。

**構文:**
```
/opsx:apply [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 実装する変更（指定がない場合はコンテキストから推測） |

**動作内容:**
- `tasks.md` を読み取り、未完了のタスクを特定します
- タスクを1つずつ処理します
- 必要に応じてコードを記述し、ファイルを作成し、テストを実行します
- チェックボックス `[x]` でタスクを完了としてマークします

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
- 中断した場合、中断した場所から再開できます
- 変更名を指定して並行変更に使用できます
- 完了状態は `tasks.md` のチェックボックスで追跡されます

---

### `/opsx:verify`

実装が変更成果物と一致していることを検証します。完全性、正確性、一貫性をチェックします。

**構文:**
```
/opsx:verify [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 検証する変更（指定がない場合はコンテキストから推測） |

**動作内容:**
- 実装品質の3つの次元をチェックします
- 実装の証拠についてコードベースを検索します
- CRITICAL、WARNING、または SUGGESTION として分類された問題を報告します
- アーカイブをブロックしませんが、問題を表面化します

**検証の次元:**

| 次元 | 検証内容 |
|-----------|-------------------|
| **完全性** | すべてのタスクが完了し、すべての要件が実装され、シナリオがカバーされている |
| **正確性** | 実装が仕様の意図と一致し、エッジケースが処理されている |
| **一貫性** | 設計決定がコードに反映され、パターンが一貫している |

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
- 不一致を早期に発見するためにアーカイブ前に実行します
- 警告はアーカイブをブロックしませんが、潜在的な問題を示します
- コミットする前にAIの作業を確認するのに適しています
- 成果物と実装の間のドリフトを明らかにする場合があります

---

### `/opsx:sync`

**オプションコマンド。** 変更からのデルタ仕様をメイン仕様にマージします。必要に応じてアーカイブが同期を促すため、通常は手動で実行する必要はありません。

**構文:**
```
/opsx:sync [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 同期する変更（指定がない場合はコンテキストから推測） |

**動作内容:**
- 変更フォルダからデルタ仕様を読み取ります
- ADDED/MODIFIED/REMOVED/RENAMED セクションを解析します
- 変更をメインの `openspec/specs/` ディレクトリにマージします
- デルタで言及されていない既存のコンテンツを保持します
- 変更をアーカイブしません（アクティブのまま）

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

| シナリオ | sync を使用しますか？ |
|----------|-----------|
| 長期間の変更で、アーカイブ前にメインの仕様を更新したい | はい |
| 複数の並行変更が更新されたベース仕様を必要とする | はい |
| マージを別途プレビュー/確認したい | はい |
| 簡単な変更で、直接アーカイブに進む | いいえ（アーカイブが処理します） |

**ヒント:**
- sync はインテリジェントであり、単なるコピー＆ペーストではありません
- 既存の要件にシナリオを追加でき、重複しません
- sync 後も変更はアクティブのままです（アーカイブされません）
- 大部分のユーザーはこれを直接呼び出す必要はありません—必要に応じてアーカイブが促します

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
| `change-name` | いいえ | アーカイブする変更（指定がない場合はコンテキストから推測） |

**動作内容:**
- 成果物の完了状態をチェックします
- タスクの完了をチェックします（未完了の場合は警告）
- まだ同期されていない場合、デルタ仕様の同期を提案します
- 変更フォルダを `openspec/changes/archive/YYYY-MM-DD-<name>/` に移動します
- 監査証跡のためにすべての成果物を保持します

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
- 未完了のタスクがあってもアーカイブはブロックしませんが、警告を表示します
- デルタ仕様はアーカイブ時または事前に同期できます
- アーカイブされた変更は履歴として保持されます
- 問題を発見するために最初に `/opsx:verify` を使用してください

---

### `/opsx:bulk-archive`

完了した複数の変更を一度にアーカイブします。変更間の仕様の競合を処理します。

**構文:**
```
/opsx:bulk-archive [change-names...]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-names` | いいえ | アーカイブする特定の変更（指定がない場合は選択を促します） |

**動作内容:**
- すべての完了した変更を一覧表示します
- アーカイブ前に各変更を検証します
- 変更間の仕様の競合を検出します
- 実際に実装されているものをチェックして競合を解決します
- 時系列順にアーカイブします

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
- 並行作業ストリームに適しています
- 競合解決はエージェント的です（コードベースをチェック）
- 変更は作成順にアーカイブされます
- 仕様コンテンツを上書きする前にプロンプトを表示します

---

### `/opsx:onboard`

完全なOpenSpecワークフローのガイド付きオンボーディング。実際のコードベースを使用したインタラクティブチュートリアルです。

**構文:**
```
/opsx:onboard
```

**動作内容:**
- ナレーション付きで完全なワークフローサイクルを説明します
- 実際の改善機会についてコードベースをスキャンします
- 実際の成果物を使用した実際の変更を作成します
- 実際の作業を実装します（小さく安全な変更）
- 完了した変更をアーカイブします
- 各ステップが発生するたびに説明します

**フェーズ:**
1. ようこそとコードベース分析
2. 改善機会の発見
3. 変更の作成 (`/opsx:new`)
4. 提案の作成
5. 仕様の作成
6. 設計の作成
7. タスクの作成
8. タスクの実装 (`/opsx:apply`)
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
- ワークフローを学ぶ新しいユーザーに最適です
- おもちゃの例ではなく、実際のコードを使用します
- 保持または破棄できる実際の変更を作成します
- 完了まで15〜30分かかります

---

## AI ツール別のコマンド構文

各 AI ツールは、わずかに異なるコマンド構文を使用します。お使いのツールに合った形式を使用してください。

| ツール | 構文例 |
|--------|--------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | `/skill:openspec-propose`, `/skill:openspec-apply-change` などのスキルベースの呼び出し（生成された `opsx-*` コマンドファイルなし） |
| Trae | `/openspec-propose`, `/openspec-apply-change` などのスキルベースの呼び出し（生成された `opsx-*` コマンドファイルなし） |

ツール間で意図は同じですが、コマンドの表示方法は統合方法によって異なります。

> **注:** GitHub Copilot コマンド (`.github/prompts/*.prompt.md`) は IDE 拡張機能 (VS Code、JetBrains、Visual Studio) でのみ利用可能です。GitHub Copilot CLI は現在、カスタムプロンプトファイルをサポートしていません。詳細と回避策については、[サポートされているツール](supported-tools.md) を参照してください。

---

## レガシーコマンド

これらのコマンドは、古い「一括処理」ワークフローを使用します。現在も動作しますが、OPSX コマンドの使用を推奨します。

| コマンド | 機能 |
|----------|------|
| `/openspec:proposal` | すべての成果物を一括作成（提案、仕様、設計、タスク） |
| `/openspec:apply` | 変更を実装 |
| `/openspec:archive` | 変更をアーカイブ |

**レガシーコマンドの使用場面:**
- 旧ワークフローを使用している既存プロジェクト
- 増分的な成果物作成が不要な単純な変更
- オールオアナッシング方式を好む場合

**OPSX への移行:**
レガシーの変更は OPSX コマンドで続行できます。成果物構造は互換性があります。

---

## トラブルシューティング

### "Change not found"

コマンドが作業対象の変更を特定できませんでした。

**解決策:**
- 変更名を明示的に指定する: `/opsx:apply add-dark-mode`
- 変更フォルダが存在するか確認する: `openspec list`
- 正しいプロジェクトディレクトリにいるか確認する

### "No artifacts ready"

すべての成果物が完了しているか、依存関係の欠落によりブロックされています。

**解決策:**
- `openspec status --change <name>` を実行して、何がブロックされているか確認する
- 必要な成果物が存在するか確認する
- 欠落している依存関係の成果物を最初に作成する

### "Schema not found"

指定されたスキーマが存在しません。

**解決策:**
- 利用可能なスキーマを一覧表示する: `openspec schemas`
- スキーマ名のスペルを確認する
- カスタムの場合はスキーマを作成する: `openspec schema init <name>`

### コマンドが認識されない

AI ツールが OpenSpec コマンドを認識しません。

**解決策:**
- OpenSpec が初期化されていることを確認する: `openspec init`
- スキルを再生成する: `openspec update`
- `.claude/skills/` ディレクトリが存在するか確認する (Claude Code の場合)
- 新しいスキルを読み込むために AI ツールを再起動する

### 成果物が正しく生成されない

AI が不完全または不正確な成果物を作成します。

**解決策:**
- `openspec/config.yaml` にプロジェクトコンテキストを追加する
- 特定のガイダンスのために成果物ごとのルールを追加する
- 変更の説明に詳細を追加する
- より詳細な制御のために `/opsx:ff` の代わりに `/opsx:continue` を使用する

---

## 次のステップ

- [ワークフロー](workflows.md) - 一般的なパターンと各コマンドの使用場面
- [CLI](cli.md) - 管理と検証のためのターミナルコマンド
- [カスタマイズ](customization.md) - カスタムスキーマとワークフローの作成