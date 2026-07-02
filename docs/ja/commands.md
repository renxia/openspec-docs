# コマンド

これはOpenSpecのスラッシュコマンドのリファレンスです。これらのコマンドは、AIコーディングアシスタントのチャットインターフェース（例：Claude Code、Cursor、Windsurf）で呼び出されます。

ワークフローパターンと各コマンドの使用方法については、[Workflows](workflows.md)を参照してください。CLIコマンドについては、[CLI](cli.md)を参照してください。

## クイックリファレンス

### デフォルトのクイックパス（`core` プロファイル）

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | 一度の操作で変更を作成し、計画アーティファクトを生成します |
| `/opsx:explore` | 変更をコミットする前にアイデアを検討します |
| `/opsx:apply` | 変更からのタスクを実行します |
| `/opsx:sync` | Delta specをメインspecにマージします |
| `/opsx:archive` | 完了した変更をアーカイブします |

### 拡張ワークフローコマンド（カスタムワークフロー選択）

| Command | Purpose |
|---------|---------|
| `/opsx:new` | 新しい変更のスケルトンを開始します |
| `/opsx:continue` | 依存関係に基づき、次のアーティファクトを作成します |
| `/opsx:ff` | Fast-forward：すべての計画アーティファクトを一度に作成します |
| `/opsx:verify` | 実装がアーティファクトと一致するか検証します |
| `/opsx:bulk-archive` | 複数の変更を一度にアーカイブします |
| `/opsx:onboard` | 完全なワークフローを通じたガイド付きチュートリアルです |

デフォルトのグローバルプロファイルは`core`です。拡張ワークフローコマンドを有効にするには、`openspec config profile`を実行し、ワークフローを選択した後、プロジェクトで`openspec update`を実行してください。

## コマンドリファレンス

### `/opsx:propose`

新しい変更を作成し、計画アーティファクトを一度に生成します。これは `core` プロファイルにおけるデフォルトの開始コマンドです。

**構文:**
```text
/opsx:propose [change-name-or-description]
```

**引数:**
| 引数 | 必須 | 説明 |
|---|---|---|
| `change-name-or-description` | なし | ケバブケースの名前、または平易な言語による変更の説明 |

**機能:**
- `openspec/changes/<change-name>/` を作成します。
- 実装前に必要なアーティファクト（spec-driven の場合：提案書、仕様書、設計書、タスク）を生成します。
- `/opsx:apply` の準備が整うまで待機します。

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
- 最速のエンドツーエンドパスに使用してください。
- ステップごとのアーティファクト制御が必要な場合は、拡張ワークフローを有効にし、`/opsx:new` + `/opsx:continue` を使用してください。

---

### `/opsx:explore`

> **迷っているときにここから開始してください。** Explore はリスクのない思考パートナーです。コードベースを読み込み、オプションを比較し、変更が存在する前に曖昧なアイデアを具体的な計画に洗練させます。これはデフォルトプロファイルに含まれています。完全なケースとその他の例については、[Explore First](explore.md) ガイドを参照してください。

変更をコミットする前に、アイデアを検討し、問題を調査し、要件を明確にします。

**構文:**
```
/opsx:explore [topic]
```

**引数:**
| 引数 | 必須 | 説明 |
|---|---|---|
| `topic` | なし | 探求または調査したいトピック |

**機能:**
- 構造を必要としない探索的な会話を開始します。
- 質問に答えるためにコードベースを調査します。
- オプションやアプローチを比較します。
- 思考を明確にするための視覚的図を作成します。
- インサイトが結晶化した場合、`/opsx:propose` (デフォルト) または `/opsx:new` (拡張ワークフロー) に移行できます。

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
- 要件が不明確な場合や調査が必要な場合に使用してください。
- 探索中にアーティファクトは作成されません。
- 決定する前に複数のアプローチを比較するのに適しています。
- ファイルの読み取りやコードベースの検索が可能です。

---

### `/opsx:new`

新しい変更のスキャフォールドを開始します。変更フォルダを作成し、`/opsx:continue` または `/opsx:ff` でアーティファクトを生成するのを待ちます。

このコマンドは拡張ワークフローセットの一部であり（デフォルトの `core` プロファイルには含まれていません）、それにあたります。

**構文:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**引数:**
| 引数 | 必須 | 説明 |
|---|---|---|
| `change-name` | なし | 変更フォルダの名前（指定されていない場合はプロンプトが表示されます） |
| `--schema` | なし | 使用するワークフロースキーマ（デフォルト：設定ファイルまたは `spec-driven`） |

**機能:**
- `openspec/changes/<change-name>/` ディレクトリを作成します。
- 変更フォルダ内に `.openspec.yaml` メタデータファイルを生成します。
- 作成準備ができた最初のアーティファクトテンプレートを表示します。
- 指定されていない場合、変更名とスキーマをプロンプトで尋ねます。

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
- 説明的な名前を使用してください: `add-feature`、`fix-bug`、`refactor-module`
- `update`、`changes`、`wip` のような一般的な名前は避けてください。
- スキーマはプロジェクト設定（`openspec/config.yaml`）で設定することもできます。

---

### `/opsx:continue`

依存関係チェーンの次のアーティファクトを作成します。段階的な進捗のために、一度に一つのアーティファクトを作成します。

**構文:**
```
/opsx:continue [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|---|---|---|
| `change-name` | なし | 継続する変更（指定されていない場合はコンテキストから推測されます） |

**機能:**
- アーティファクトの依存関係グラフを照会します。
- どのアーティファクトが準備完了で、どれがブロックされているかを表示します。
- 最初に見つかった準備完了のアーティファクトを作成します。
- コンテキストのために依存ファイルを読み取ります。
- 作成後に利用可能になるものを表示します。

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
- 各アーティファクトをレビューしてから進めたい場合に使用してください。
- 制御を重視する複雑な変更に適しています。
- 複数のアーティファクトが同時に準備完了になる可能性があります。
- 継続する前に作成されたアーティファクトを編集できます。

---

### `/opsx:ff`

アーティファクト作成の高速実行（Fast-forward）。すべての計画アーティファクトを一度に作成します。

**構文:**
```
/opsx:ff [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|---|---|---|
| `change-name` | なし | 高速実行する変更（指定されていない場合はコンテキストから推測されます） |

**機能:**
- すべてのアーティファクトを依存順序で作成します。
- TODO リストを通じて進捗を追跡します。
- すべての `apply-required` アーティファクトが完了したときに停止します。
- 次のアーティファクトを作成する前に、各依存関係を読み取ります。

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
- 何を構築しているか明確な場合に適しています。
- 単純な変更に対しては `/opsx:continue` よりも高速です。
- 後からアーティファクトを編集することは可能です。
- 小〜中規模の機能に適しています。

---

### `/opsx:apply`

変更からのタスクを実行します。タスクリストを順に処理し、コードを記述し、項目にチェックを入れます。

**構文:**
```
/opsx:apply [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|---|---|---|
| `change-name` | なし | 実装する変更（指定されていない場合はコンテキストから推測されます） |

**機能:**
- `tasks.md` を読み取り、未完了のタスクを特定します。
- タスクを一つずつ処理します。
- コードを記述し、ファイルを生成し、必要に応じてテストを実行します。
- チェックボックス `[x]` でタスクを完了済みにマークします。

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
- 中断された場合、中断した場所から再開できます。
- 変更名を指定することで並行する変更に使用できます。
- 完了状態は `tasks.md` のチェックボックスで追跡されます。

---

### `/opsx:verify`

実装が変更アーティファクトと一致しているか検証します。完全性、正確性、一貫性をチェックします。

**構文:**
```
/opsx:verify [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|---|---|---|
| `change-name` | なし | 検証する変更（指定されていない場合はコンテキストから推測されます） |

**機能:**
- 実装の3つの側面をチェックします。
- コードベース内で実装のエビデンスを検索します。
- CRITICAL、WARNING、または SUGGESTION として分類された問題を報告します。
- アーカイブをブロックするものではありませんが、問題を表面化させます。

**検証ディメンション:**

| ディメンション | 検証するもの |
|---|---|
| **Completeness (完全性)** | すべてのタスク完了、すべての要件実装、シナリオ網羅 |
| **Correctness (正確性)** | 実装が仕様の意図と一致しているか、エッジケースを処理しているか |
| **Coherence (一貫性)** | 設計上の決定事項がコードに反映されているか、パターンが一貫しているか |

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
- アーカイブする前に実行して不一致を早期に検出してください。
- WARNING はアーカイブをブロックしませんが、潜在的な問題を示しています。
- コミットする前の AI の作業を確認するのに適しています。
- アーティファクトと実装間のドリフト（ずれ）を発見できる可能性があります。

---

### `/opsx:sync`

**オプションコマンドです。** 変更からのデルタ仕様をメインの仕様にマージします。必要に応じてアーカイブが同期を促すため、通常は手動で実行する必要はありません。

**構文:**
```
/opsx:sync [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|---|---|---|
| `change-name` | なし | 同期する変更（指定されていない場合はコンテキストから推測されます） |

**機能:**
- 変更フォルダからのデルタ仕様を読み取ります。
- ADDED/MODIFIED/REMOVED/RENAMED のセクションを解析します。
- 変更をメインの `openspec/specs/` ディレクトリにマージします。
- デルタで言及されていない既存の内容は保持されます。
- 変更をアーカイブしません（アクティブな状態を維持します）。

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

**手動で使うべきシナリオ:**

| シナリオ | sync を使用するか？ |
|---|---|
| 長期間にわたる変更で、アーカイブ前にメインに仕様を反映させたい場合 | はい |
| 複数の並行する変更が更新されたベース仕様を必要とする場合 | はい |
| マージを個別にプレビュー/レビューしたい場合 | はい |
| 素早い変更で、そのままアーカイブに進む場合 | いいえ（アーカイブが処理します） |

**ヒント:**
- Sync はインテリジェントであり、コピー＆ペーストではありません。
- 既存の要件にシナリオを追加できますが、重複はしません。
- Sync 後も変更はアクティブなままです（アーカイブされません）。
- ほとんどのユーザーはこれを直接呼び出す必要はありません—必要な場合はアーカイブが促します。

---

### `/opsx:archive`

完了した変更をアーカイブします。変更を確定し、アーカイブフォルダに移動させます。

**構文:**
```
/opsx:archive [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|---|---|---|
| `change-name` | なし | アーカイブする変更（指定されていない場合はコンテキストから推測されます） |

**機能:**
- アーティファクトの完了状態をチェックします。
- タスクの完了状況をチェックします（未完了の場合は警告を出します）。
- 未同期の場合、デルタ仕様の同期を提案します。
- 変更フォルダを `openspec/changes/archive/YYYY-MM-DD-<name>/` に移動させます。
- すべてのアーティファクトを監査証跡として保持します。

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
- 未完了のタスクがあってもアーカイブはブロックしませんが、警告を出します。
- デルタ仕様はアーカイブ中または事前に同期できます。
- アーカイブされた変更は履歴として保持されます。
- 問題を検出するために `/opsx:verify` を先に実行してください。

---

### `/opsx:bulk-archive`

複数の完了した変更を一括でアーカイブします。変更間の仕様の競合を処理します。

**構文:**
```
/opsx:bulk-archive [change-names...]
```

**引数:**
| 引数 | 必須 | 説明 |
|---|---|---|
| `change-names` | なし | アーカイブする特定の変更（指定されていない場合は選択を促します） |

**機能:**
- すべての完了した変更をリスト表示します。
- アーカイブ前に各変更を検証します。
- 変更間の仕様の競合を検出します。
- 実際に実装されている内容を確認することで競合を解決します。
- 時系列順にアーカイブします。

**例:**
```text
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
- 並行する作業ストリームに適しています。
- 競合解決はエージェンティック（コードベースをチェック）です。
- 変更は作成順にアーカイブされます。
- 仕様コンテンツを上書きする前にプロンプトを表示します。

---

### `/opsx:onboard`

完全な OpenSpec ワークフローを通じたガイド付きオンボーディング。実際のコードベースを使用したインタラクティブなチュートリアルです。

**構文:**
```
/opsx:onboard
```

**機能:**
- ナレーションを伴う完全なワークフローサイクルを案内します。
- 実際の改善機会を探すためにコードベースをスキャンします。
- 実際のアーティファクトを持つ実際の変更を作成します。
- 実際の作業（小さく安全な変更）を実行します。
- 完了した変更をアーカイブします。
- 各ステップが実行される際に説明します。

**フェーズ:**
1. ウェルカムとコードベース分析
2. 改善機会の発見
3. 変更の作成 (`/opsx:new`)
4. 提案書の記述
5. 仕様書の作成
6. 設計書の記述
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
- ワークフローを学ぶ新しいユーザーに最適です。
- おもちゃの例ではなく、実際のコードを使用します。
- 保留または破棄できる本物の変更を作成します。
- 完了までに15〜30分かかります。

## AIツールごとのコマンド構文

さまざまなAIツールは、わずかに異なるコマンド構文を使用しています。お使いのツールに一致する形式を使用してください。

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

意図はツール間で共通していますが、コマンドの表示方法は統合によって異なる場合があります。

> **注:** GitHub Copilotコマンド（`.github/prompts/*.prompt.md`）は、IDE拡張機能（VS Code, JetBrains, Visual Studio）でのみ利用可能です。GitHub Copilot CLIは現在、カスタムプロンプトファイルをサポートしていません。詳細は[Supported Tools](supported-tools.md)を参照してください。

---

## レガシーコマンド

これらのコマンドは、古い「一括処理（all-at-once）」ワークフローを使用しています。これらは引き続き機能しますが、OPSXコマンドの使用が推奨されます。

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | Create all artifacts at once (proposal, specs, design, tasks) |
| `/openspec:apply` | Implement the change |
| `/openspec:archive` | Archive the change |

**レガシーコマンドを使用するタイミング:**
- 古いワークフローを使用している既存のプロジェクト
- 増分アーティファクト作成が不要な単純な変更
- すべてかゼロかのアプローチを好む場合

**OPSXへの移行:**
レガシーな変更もOPSXコマンドで継続できます。アーティファクトの構造は互換性があります。

---

## トラブルシューティング

### "Change not found"

コマンドがどの変更を対象とするべきか特定できませんでした。

**解決策:**
- 変更名を明示的に指定します: `/opsx:apply add-dark-mode`
- 変更フォルダが存在するか確認します: `openspec list`
- 正しいプロジェクトディレクトリにいることを確認します

### "No artifacts ready"

すべてのアーティファクトは、完了しているか、不足している依存関係によってブロックされています。

**解決策:**
- 何がブロックしているかを確認するために `openspec status --change <name>` を実行します
- 必要なアーティファクトが存在するか確認します
- まず不足している依存関係のアーティファクトを作成します

### "Schema not found"

指定されたスキーマが存在しません。

**解決策:**
- 利用可能なスキーマを一覧表示します: `openspec schemas`
- スキーマ名のスペルを確認します
- カスタムである場合は、スキーマを作成します: `openspec schema init <name>`

### Commands not recognized

AIツールがOpenSpecコマンドを認識していません。

**解決策:**
- OpenSpecが初期化されていることを確認します: `openspec init`
- スキルを再生成します: `openspec update`
- `.claude/skills/` ディレクトリが存在することを確認します（Claude Codeの場合）
- 新しいスキルを認識させるためにAIツールを再起動します

### Artifacts not generating properly

AIが不完全または誤ったアーティファクトを作成しています。

**解決策:**
- `openspec/config.yaml` にプロジェクトのコンテキストを追加します
- 特定のガイダンスのためのアーティファクトごとのルールを追加します
- 変更の説明により多くの詳細を提供します
- より高い制御を行うために、`/opsx:ff` の代わりに `/opsx:continue` を使用します

---

## 次のステップ

- [Workflows](workflows.md) - 一般的なパターンと各コマンドの使用タイミング
- [CLI](cli.md) - 管理および検証のためのターミナルコマンド
- [Customization](customization.md) - カスタムスキーマとワークフローの作成