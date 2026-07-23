# コマンド

OpenSpecのスラッシュコマンドのリファレンスです。これらのコマンドは、AIコーディングアシスタントのチャットインターフェース（Claude Code、Cursor、Windsurfなど）から呼び出されます。

ワークフローのパターンや各コマンドの使用タイミングについては、[ワークフロー](workflows.md)を参照してください。CLIコマンドについては、[CLI](cli.md)を参照してください。

## クイックリファレンス

### デフォルトクイックパス（`core`プロファイル）

| コマンド | 目的 |
|---------|------|
| `/opsx:propose` | 変更を作成し、計画アーティファクトを1ステップで生成 |
| `/opsx:explore` | 変更にコミットする前にアイデアを検討 |
| `/opsx:apply` | 変更からタスクを実装 |
| `/opsx:update` | 変更の計画アーティファクトを修正し、整合性を維持 |
| `/opsx:sync` | デルタ仕様をメイン仕様にマージ |
| `/opsx:archive` | 完了した変更をアーカイブ |

### 拡張ワークフローコマンド（カスタムワークフロー選択）

| コマンド | 目的 |
|---------|------|
| `/opsx:new` | 新しい変更スキャフォールドを開始 |
| `/opsx:continue` | 依存関係に基づいて次のアーティファクトを作成 |
| `/opsx:ff` | ファストフォワード：すべての計画アーティファクトを一度に作成 |
| `/opsx:verify` | 実装がアーティファクトと一致することを検証 |
| `/opsx:bulk-archive` | 複数の変更を一度にアーカイブ |
| `/opsx:onboard` | 完全なワークフローのガイド付きチュートリアル |

デフォルトのグローバルプロファイルは`core`です。拡張ワークフローコマンドを有効にするには、`openspec config profile`を実行してworkflowsを選択し、プロジェクト内で`openspec update`を実行してください。

## コマンドリファレンス

### `/opsx:propose`

新しい変更を作成し、計画アーティファクトを1ステップで生成します。これは `core` プロファイルのデフォルト開始コマンドです。

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
- 実装前に必要なアーティファクトを生成します（`spec-driven` の場合：proposal、specs、design、tasks）
- 変更が `/opsx:apply` の準備ができた時点で停止します

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
- これを使用すると、最も高速なエンドツーエンドのパスになります
- アーティファクトを段階的に制御したい場合は、拡張ワークフローを有効にして `/opsx:new` + `/opsx:continue` を使用してください

---

### `/opsx:explore`

> **迷った場合はここから始めてください。** Explore はリスクのない思考パートナーです：コードベースを読み取り、選択肢を比較し、変更が存在する前に曖昧なアイデアを具体的な計画に磨き上げます。デフォルトプロファイルに含まれています。詳細なケースと追加の例については、[Explore First](explore.md) ガイドを参照してください。

変更にコミットする前に、アイデアを検討し、問題を調査し、要件を明確にします。

**構文:**
```
/opsx:explore [topic]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `topic` | いいえ | 探索または調査したい内容 |

**動作内容:**
- 構造を必要としない探索的な会話を開始します
- 質問に答えるためにコードベースを調査します
- 選択肢とアプローチを比較します
- 思考を明確にするための視覚的な図を作成します
- 洞察が明確になると、`/opsx:propose`（デフォルト）または `/opsx:new`（拡張ワークフロー）に移行できます

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
- 要件が不明確な場合や調査が必要な場合に使用してください
- 探索中はアーティファクトは作成されません
- 決定前に複数のアプローチを比較するのに適しています
- ファイルを読み取り、コードベースを検索できます

---

### `/opsx:new`

新しい変更スキャフォールドを開始します。変更フォルダを作成し、`/opsx:continue` または `/opsx:ff` でアーティファクトを生成するまで待機します。

このコマンドは拡張ワークフローセットの一部です（デフォルトの `core` プロファイルには含まれていません）。

**構文:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 変更フォルダの名前（指定しない場合はプロンプトが表示されます） |
| `--schema` | いいえ | 使用するワークフロースキーマ（デフォルト：設定からまたは `spec-driven`） |

**動作内容:**
- `openspec/changes/<change-name>/` ディレクトリを作成します
- 変更フォルダに `.openspec.yaml` メタデータファイルを作成します
- 作成準備ができた最初のアーティファクトテンプレートを表示します
- 指定しない場合は変更名とスキーマの入力を求めます

**作成内容:**
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
- 説明的な名前を使用してください：`add-feature`、`fix-bug`、`refactor-module`
- `update`、`changes`、`wip` などの一般的な名前は避けてください
- スキーマはプロジェクト設定（`openspec/config.yaml`）でも設定できます

---

### `/opsx:continue`

依存関係チェーン内の次のアーティファクトを作成します。段階的な進捗のために1つのアーティファクトずつ作成します。

**構文:**
```
/opsx:continue [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 続行する変更（指定しない場合はコンテキストから推測されます） |

**動作内容:**
- アーティファクトの依存関係グラフを照会します
- 準備完了とブロック済みのアーティファクトを表示します
- 最初の準備完了アーティファクトを作成します
- コンテキストのために依存関係ファイルを読み取ります
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
- 次に進む前に各アーティファクトを確認したい場合に使用してください
- 制御したい複雑な変更に適しています
- 複数のアーティファクトが同時に準備完了になる場合があります
- 続行する前に作成したアーティファクトを編集できます

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
| `change-name` | いいえ | 早送りする変更（指定しない場合はコンテキストから推測されます） |

**動作内容:**
- 依存関係の順序ですべてのアーティファクトを作成します
- TODOリストで進捗を追跡します
- すべての `apply-required` アーティファクトが完了した時点で停止します
- 次のアーティファクトを作成する前に各依存関係を読み取ります

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
- 構築するものの全体像が明確な場合に使用してください
- 単純な変更の場合、`/opsx:continue` よりも高速です
- 後でアーティファクトを編集することもできます
- 小規模から中規模の機能に適しています

---

### `/opsx:apply`

変更からのタスクを実装します。タスクリストを処理し、コードを作成して項目にチェックを入れます。

**構文:**
```
/opsx:apply [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 実装する変更（指定しない場合はコンテキストから推測されます） |

**動作内容:**
- `tasks.md` を読み取り、未完了のタスクを特定します
- タスクを1つずつ処理します
- 必要に応じてコードを作成し、ファイルを作成し、テストを実行します
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
- 中断した場合は中断した場所から再開できます
- 変更名を指定して並列変更に使用してください
- 完了状態は `tasks.md` のチェックボックスで追跡されます

---

### `/opsx:update`

変更の既存の計画アーティファクトを修正し、相互に整合性を保ちます。計画アーティファクトのみ - コードを編集することはありません。

**構文:**

```text
/opsx:update [change-name]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 更新する変更（指定しない場合はコンテキストから推測されます） |

**動作内容:**

- `openspec status --change <name> --json` を介して変更のアーティファクトを読み取ります
- 要求された修正を適用するか、名前を指定しなかった場合はアーティファクトの矛盾を確認します
- 他の既存のアーティファクトを任意の方向で調整します（デザインの編集が提案に波及する可能性があります）
- 書き込む前に、各アーティファクトごとにすべての編集を確認します
- 次のステップを推奨して終了します：`/opsx:continue`（アーティファクトが不足している場合）、`/opsx:apply`（修正した計画をコードに反映する場合）、または `/opsx:archive`（すべて完了）

**例:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**ヒント:**

- 不足しているアーティファクトは作成しません - それは `/opsx:continue` の役割です
- 変更がすでに実装されている場合は、コードが修正した計画と一致するように `/opsx:apply` でフォローアップしてください
- 修正が変更の意図を変える場合は、代わりに新しい変更を最初から始めてください（[When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh) を参照）

---

### `/opsx:verify`

実装が変更アーティファクトと一致することを検証します。完全性、正確性、整合性を確認します。

**構文:**
```
/opsx:verify [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 検証する変更（指定しない場合はコンテキストから推測されます） |

**動作内容:**
- 実装品質の3つの次元を確認します
- 実装の証拠をコードベースで検索します
- CRITICAL、WARNING、または SUGGESTION として分類された問題を報告します
- アーカイブをブロックしませんが、問題を表面化させます

**検証次元:**

| 次元 | 検証内容 |
|-----------|-------------------|
| **完全性** | すべてのタスクが完了、すべての要件が実装、シナリオが網羅されていること |
| **正確性** | 実装が仕様の意図と一致し、エッジケースが処理されていること |
| **整合性** | デザインの決定がコードに反映され、パターンが一貫していること |

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
- 不一致を早期に検出するためにアーカイブする前に実行してください
- 警告はアーカイブをブロックしませんが、潜在的な問題を示します
- コミットする前に AI の作業を確認するのに適しています
- アーティファクトと実装の間の乖離を明らかにすることができます

---

### `/opsx:sync`

**オプションコマンド。** 変更からのデルタ仕様をメインの仕様にマージします。必要に応じてアーカイブが同期を促すため、通常は手動で実行する必要はありません。

**構文:**
```
/opsx:sync [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 同期する変更（指定しない場合はコンテキストから推測されます） |

**動作内容:**
- 変更フォルダからデルタ仕様を読み取ります
- ADDED/MODIFIED/REMOVED/RENAMED セクションを解析します
- 変更をメインの `openspec/specs/` ディレクトリにマージします
- デルタで言及されていない既存のコンテンツを保持します
- 変更をアーカイブしません（アクティブなままです）

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

**手動で使用する場合:**

| シナリオ | 同期を使用？ |
|----------|-----------|
| 長期実行の変更、アーカイブする前にメインに仕様を反映したい場合 | はい |
| 複数の並列変更が更新された基本仕様を必要とする場合 | はい |
| マージを個別にプレビュー/確認したい場合 | はい |
| 迅速な変更、直接アーカイブする場合 | いいえ（アーカイブが処理します） |

**ヒント:**
- 同期はインテリジェントであり、コピペではありません
- 重複せずに既存の要件にシナリオを追加できます
- 同期後も変更はアクティブなままです（アーカイブされません）
- ほとんどのユーザーはこれを直接呼び出す必要はありません - 必要に応じてアーカイブがプロンプトを表示します

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
| `change-name` | いいえ | アーカイブする変更（指定しない場合はコンテキストから推測されます） |

**動作内容:**
- アーティファクトの完了状態を確認します
- タスクの完了を確認します（未完了の場合は警告します）
- まだ同期されていない場合はデルタ仕様の同期を提供します
- 変更フォルダを `openspec/changes/archive/YYYY-MM-DD-<name>/` に移動します
- 監査証跡のためにすべてのアーティファクトを保持します

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
- アーカイブは未完了のタスクでブロックしませんが、警告します
- デルタ仕様はアーカイブ中または事前に同期できます
- アーカイブされた変更は履歴のために保持されます
- 問題を検出するために最初に `/opsx:verify` を使用してください

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
| `change-names` | いいえ | アーカイブする特定の変更（指定しない場合は選択を求めるプロンプトが表示されます） |

**動作内容:**
- すべての完了した変更を一覧表示します
- アーカイブする前に各変更を検証します
- 変更間の仕様の競合を検出します
- 実際に実装されているものを確認して競合を解決します
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
- 並列ワークストリームに適しています
- 競合解決はエージェント型です（コードベースを確認します）
- 変更は作成順にアーカイブされます
- 仕様コンテンツを上書きする前にプロンプトを表示します

---

### `/opsx:onboard`

完全な OpenSpec ワークフローによるガイド付きオンボーディング。実際のコードベースを使用したインタラクティブなチュートリアル。

**構文:**
```
/opsx:onboard
```

**動作内容:**
- ナレーション付きで完全なワークフローサイクルを説明します
- 実際の改善機会を探すためにコードベースをスキャンします
- 実際のアーティファクトを使用して実際の変更を作成します
- 実際の作業を実装します（小さく、安全な変更）
- 完了した変更をアーカイブします
- 各ステップが発生するときに説明します

**フェーズ:**
1. ウェルカムとコードベース分析
2. 改善機会の発見
3. 変更の作成（`/opsx:new`）
4. 提案の作成
5. 仕様の作成
6. デザインの作成
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
- ワークフローを学習中の新規ユーザーに最適です
- 実コードを使用し、おもちゃの例は使用しません
- 保持または破棄できる実際の変更を作成します
- 完了までに15〜30分かかります

## AIツール別コマンド構文

AIツールによってコマンド構文が若干異なります。お使いのツールに合わせた形式をご利用ください：

| ツール | 構文例 |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | `/openspec-propose`, `/openspec-apply-change` などのスキルベースの呼び出し（生成される `opsx-*` コマンドファイルはありません） |
| Codex | `.codex/skills/openspec-*` からのスキルベースの呼び出し（生成される `opsx-*` プロンプトファイルはありません） |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | `/skill:openspec-propose`, `/skill:openspec-apply-change` などのスキルベースの呼び出し（生成される `opsx-*` コマンドファイルはありません） |
| Trae | `/opsx-propose`, `/opsx-apply` |

ツール間で意図は同じですが、コマンドの提供方法は統合方法によって異なる場合があります。

> **注記:** GitHub Copilotコマンド（`.github/prompts/*.prompt.md`）はIDE拡張機能（VS Code、JetBrains、Visual Studio）でのみ利用可能です。GitHub Copilot CLIは現在、カスタムプロンプトファイルをサポートしていません。詳細と回避策については、[サポートツール](supported-tools.md)を参照してください。

---

## レガシーコマンド

これらのコマンドは古い「一括」ワークフローを使用します。引き続き機能しますが、OPSXコマンドの使用を推奨します。

| コマンド | 処理内容 |
|---------|--------------|
| `/openspec:proposal` | すべての成果物を一度に作成（提案書、仕様書、設計、タスク） |
| `/openspec:apply` | 変更を実装 |
| `/openspec:archive` | 変更をアーカイブ |

**レガシーコマンドを使用する場合:**
- 古いワークフローを使用している既存プロジェクト
- 段階的な成果物作成が不要な単純な変更
- オールオアナッシング方式を好む場合

**OPSXへの移行:**
レガシーの変更はOPSXコマンドで継続できます。成果物構造は互換性があります。

---

## トラブルシューティング

### "変更が見つかりません"

コマンドが作業対象の変更を識別できませんでした。

**解決策:**
- 変更名を明示的に指定: `/opsx:apply add-dark-mode`
- 変更フォルダが存在するか確認: `openspec list`
- 正しいプロジェクトディレクトリにいることを確認

### "成果物が準備できていません"

すべての成果物は完了しているか、依存関係の欠如によってブロックされています。

**解決策:**
- `openspec status --change <name>` を実行してブロックの原因を確認
- 必要な成果物が存在するか確認
- 不足している依存関係の成果物を先に作成

### "スキーマが見つかりません"

指定されたスキーマが存在しません。

**解決策:**
- 利用可能なスキーマを一覧表示: `openspec schemas`
- スキーマ名のスペルを確認
- カスタムスキーマの場合は作成: `openspec schema init <name>`

### コマンドが認識されません

AIツールがOpenSpecコマンドを認識しません。

**解決策:**
- OpenSpecが初期化されていることを確認: `openspec init`
- スキルを再生成: `openspec update`
- `.claude/skills/` ディレクトリが存在するか確認（Claude Codeの場合）
- 新しいスキルを反映させるためにAIツールを再起動

### 成果物が正しく生成されません

AIが不完全または不正な成果物を作成します。

**解決策:**
- `openspec/config.yaml` にプロジェクトコンテキストを追加
- 特定のガイダンスのために成果物ごとのルールを追加
- 変更の説明に詳細を追加
- より詳細な制御のために `/opsx:ff` の代わりに `/opsx:continue` を使用

---

## 次のステップ

- [ワークフロー](workflows.md) - 一般的なパターンと各コマンドの使用タイミング
- [CLI](cli.md) - 管理と検証のためのターミナルコマンド
- [カスタマイズ](customization.md) - カスタムスキーマとワークフローの作成