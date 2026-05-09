# OPSX ワークフロー

> [Discord](https://discord.gg/YctCnvvshC) でフィードバックをお待ちしています。

## これは何ですか？

OPSX は現在、OpenSpec の標準ワークフローです。

OpenSpec の変更のための**流動的で反復的なワークフロー**です。厳格なフェーズはもうありません。いつでも実行できるアクションがあるだけです。

## 存在理由

レガシーな OpenSpec ワークフローは機能しますが、**固定化されています**:

- **指示がハードコードされている** — TypeScript に埋め込まれており、変更できません
- **オールオアナッシング** — 一つの大きなコマンドで全てが作成され、個々の部分をテストできません
- **固定構造** — 全員同じワークフローで、カスタマイズ不可
- **ブラックボックス** — AI の出力が悪い場合、プロンプトを調整できません

**OPSX はこれを開放します。** 今や誰でも:

1. **指示を実験できる** — テンプレートを編集し、AI が改善するか確認
2. **細かくテストできる** — 各成果物の指示を独立して検証
3. **ワークフローをカスタマイズできる** — 独自の成果物と依存関係を定義
4. **迅速に反復できる** — テンプレートを変更し、即座にテスト、再ビルド不要

```
レガシーワークフロー:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  パッケージにハードコード  │           │  schema.yaml           │◄── これを編集
│  (変更不可)              │           │  templates/*.md        │◄── またはこれを
│        ↓               │           │        ↓               │
│  新リリースを待つ        │           │  即時反映               │
│        ↓               │           │        ↓               │
│  改善を祈る              │           │  自分でテスト           │└────────────────────────┘           └────────────────────────┘
```

**これは全員のためのものです:**
- **チーム** — 実際の作業方法に合ったワークフローを作成
- **パワーユーザー** — プロンプトを調整し、コードベースに最適な AI 出力を得る
- **OpenSpec コントリビューター** — リリースなしで新しいアプローチを実験

私たちは皆、何が最適かを学んでいます。OPSX で一緒に学びましょう。

## ユーザーエクスペリエンス

**線形ワークフローの問題点:**
「計画フェーズ」にいる、次に「実装フェーズ」にいる、そして「完了」。しかし、実際の作業はそうは動きません。何かを実装し、設計が間違っていたと気づき、仕様を更新し、実装を続ける必要があります。線形フェーズは作業の実際の進行と対立します。

**OPSX のアプローチ:**
- **フェーズではなくアクション** — 作成、実装、更新、アーカイブ — いつでも任意のものを実行
- **依存関係はイネーブラー** — 次に必要なものではなく、可能なことを示す

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## セットアップ

```bash
# openspec がインストールされていることを確認 — スキルは自動生成されます
openspec init
```

これにより、AI コーディングアシスタントが自動検出する `.claude/skills/` (または同等の場所) にスキルが作成されます。

デフォルトでは、OpenSpec は `core` ワークフロープロファイル (`propose`, `explore`, `apply`, `sync`, `archive`) を使用します。拡張ワークフローコマンド (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) を使用したい場合は、`openspec config profile` で設定し、`openspec update` で適用します。

セットアップ中、**プロジェクト設定** (`openspec/config.yaml`) の作成を求められます。これはオプションですが推奨されます。

## プロジェクト設定

プロジェクト設定では、デフォルト値を設定し、プロジェクト固有のコンテキストをすべての成果物に注入できます。

### 設定の作成

設定は `openspec init` 時に作成されるか、手動で作成できます:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### 設定フィールド

| フィールド | 型 | 説明 |
|-----------|------|-------------|
| `schema` | string | 新しい変更のデフォルトスキーマ (例: `spec-driven`) |
| `context` | string | すべての成果物の指示に注入されるプロジェクトコンテキスト |
| `rules` | object | 成果物 ID をキーとした、成果物ごとのルール |

### 仕組み

**スキーマの優先順位** (高い順):
1. CLI フラグ (`--schema <name>`)
2. 変更メタデータ (変更ディレクトリ内の `.openspec.yaml`)
3. プロジェクト設定 (`openspec/config.yaml`)
4. デフォルト (`spec-driven`)

**コンテキストの注入:**
- コンテキストはすべての成果物の指示の先頭に追加されます
- `<context>...</context>` タグで囲まれます
- AI があなたのプロジェクトの慣習を理解するのに役立ちます

**ルールの注入:**
- ルールは一致する成果物にのみ注入されます
- `<rules>...</rules>` タグで囲まれます
- コンテキストの後、テンプレートの前に表示されます

### スキーマ別成果物 ID

**spec-driven** (デフォルト):
- `proposal` — 変更提案
- `specs` — 仕様
- `design` — 技術設計
- `tasks` — 実装タスク

### 設定の検証

- `rules` 内の不明な成果物 ID は警告を生成します
- スキーマ名は利用可能なスキーマに対して検証されます
- コンテキストには 50KB のサイズ制限があります
- 無効な YAML は行番号付きで報告されます

### トラブルシューティング

**「rules 内の不明な成果物 ID: X」**
- 成果物 ID がスキーマと一致しているか確認 (上記リスト参照)
- `openspec schemas --json` を実行して各スキーマの成果物 ID を確認

**設定が適用されない:**
- ファイルが `openspec/config.yaml` (`.yml` ではない) にあることを確認
- YAML 構文をバリデーターで確認
- 設定変更は即座に有効になります (再起動不要)

**コンテキストが大きすぎる:**
- コンテキストは 50KB に制限されています
- 代わりに要約するか、外部ドキュメントにリンクしてください

## コマンド

| コマンド | 内容 |
|---------|--------------|
| `/opsx:propose` | 変更を作成し、計画成果物を一括生成 (デフォルトのクイックパス) |
| `/opsx:explore` | アイデアを検討し、問題を調査し、要件を明確化 |
| `/opsx:new` | 新しい変更のスキャフォールドを開始 (拡張ワークフロー) |
| `/opsx:continue` | 次の成果物を作成 (拡張ワークフロー) |
| `/opsx:ff` | 計画成果物を早送り (拡張ワークフロー) |
| `/opsx:apply` | タスクを実装し、必要に応じて成果物を更新 |
| `/opsx:verify` | 成果物に対して実装を検証 (拡張ワークフロー) |
| `/opsx:sync` | デルタ仕様をメインに同期 (デフォルトワークフロー、オプション) |
| `/opsx:archive` | 完了時にアーカイブ |
| `/opsx:bulk-archive` | 完了した複数の変更をアーカイブ (拡張ワークフロー) |
| `/opsx:onboard` | エンドツーエンドの変更のガイド付きウォークスルー (拡張ワークフロー) |

## 使用方法

### アイデアを探索する
```
/opsx:explore
```
アイデアを検討し、問題を調査し、オプションを比較。構造は不要 - ただの思考パートナーです。洞察が具体化したら、`/opsx:propose` (デフォルト) または `/opsx:new`/`/opsx:ff` (拡張) に移行します。

### 新しい変更を開始する
```
/opsx:propose
```
変更を作成し、実装前に必要な計画成果物を生成します。

拡張ワークフローを有効にしている場合は、代わりに以下を使用できます:

```text
/opsx:new        # スキャフォールドのみ
/opsx:continue   # 一度に1つの成果物を作成
/opsx:ff         # すべての計画成果物を一括作成
```

### 成果物を作成する
```
/opsx:continue
```
依存関係に基づいて作成可能なものを表示し、1つの成果物を作成します。繰り返し使用して変更を段階的に構築します。

```
/opsx:ff add-dark-mode
```
すべての計画成果物を一括作成。構築内容が明確な場合に使用します。

### 実装する (流動的な部分)
```
/opsx:apply
```
タスクを処理し、完了時にチェックを入れます。複数の変更を並行処理している場合は `/opsx:apply <name>` を実行できます。それ以外の場合は、会話から推測し、判断できない場合は選択を求めます。

### 仕上げる
```
/opsx:archive   # 完了時にアーカイブへ移動 (必要に応じて仕様の同期を促します)
```

## 更新か新規作成かの判断基準

実装前に提案や仕様をいつでも編集できます。しかし、洗練が「これは異なる作業」となるのはいつですか？

### 提案が捉えるもの

提案は3つのことを定義します:
1. **意図** — どの問題を解決しようとしていますか？
2. **範囲** — 範囲内/外は何ですか？
3. **アプローチ** — どのように解決しますか？

問題は: どれが、どの程度変更されたかです。

### 既存の変更を更新する場合:

**同じ意図、洗練された実行**
- 考慮していなかったエッジケースを発見
- アプローチの調整が必要だが目標は変更なし
- 実装により設計がわずかにずれていたと判明

**範囲が狭まる**
- 全範囲が大きすぎると気づき、まず MVP を出荷したい
- 「ダークモードを追加」→「ダークモードトグルを追加 (システム設定は v2 で)」

**学習に基づく修正**
- コードベースが思っていた構造ではない
- 依存関係が期待通りに機能しない
- 「CSS 変数を使用」→「代わりに Tailwind の dark: プレフィックスを使用」

### 新しい変更を開始する場合:

**意図が根本的に変更された**
- 問題自体が異なる
- 「ダークモードを追加」→「カスタムカラー、フォント、間隔を含む包括的なテーマシステムを追加」

**範囲が爆発的に拡大**
- 変更が非常に大きくなり、本質的に異なる作業に
- 更新後、元の提案は認識できないものになる
- 「ログインバグを修正」→「認証システムを書き直す」

**元のものが完了可能**
- 元の変更を「完了」としてマークできる
- 新しい作業は独立しており、洗練ではない
- 「ダークモード MVP を追加」を完了 → アーカイブ → 新しい変更「ダークモードを強化」

### ヒューリスティクス

```
                        ┌─────────────────────────────────────┐
                        │     これは同じ作業ですか？            │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             同じ意図ですか？    >50% 重複しますか？  元のものを
             同じ問題ですか？    同じ範囲ですか？     これらの変更なしで
                    │                  │          「完了」できますか？
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         はい              いいえ はい        いいえ いいえ          はい
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       更新              新規  更新         新規  更新            新規
```

| テスト | 更新 | 新しい変更 |
|------|--------|------------|
| **同一性** | 「同じもの、洗練された」 | 「異なる作業」 |
| **範囲の重複** | >50% 重複 | <50% 重複 |
| **完了** | 変更なしでは「完了」できない | 元のものを完了でき、新しい作業は独立 |
| **ストーリー** | 更新チェーンが一貫した物語を語る | パッチは明確化より混乱を招く |

### 原則

> **更新はコンテキストを保持します。新しい変更は明確さを提供します。**
>
> 思考の履歴が価値ある場合は更新を選択してください。
> パッチを当てるより新規開始が明確な場合は新規を選択してください。

git ブランチのように考えてください:
- 同じ機能に取り組みながらコミットを続ける
- 本当に新しい作業の場合は新しいブランチを開始
- 部分的な機能をマージし、フェーズ 2 用に新規開始することもある

## 何が違うのか？

| | レガシー (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **構造** | 一つの大きな提案書 | 依存関係を持つ個別の成果物 |
| **ワークフロー** | 線形フェーズ: 計画 → 実装 → アーカイブ | 流動的なアクション — いつでも何でもできる |
| **イテレーション** | 戻るのが面倒 | 学んだことに応じて成果物を更新 |
| **カスタマイズ** | 固定構造 | スキーマ駆動（独自の成果物を定義） |

**重要な洞察:** 作業は線形ではない。OPSXは、そうであるかのように見せかけるのをやめる。

## アーキテクチャの深掘り

このセクションでは、OPSX の内部動作と、レガシーワークフローとの比較について説明します。
このセクションの例では、拡張コマンドセット（`new`、`continue` など）を使用しています。デフォルトの `core` ユーザーは、同じフローを `propose → apply → sync → archive` にマッピングできます。

### 哲学：フェーズ vs アクション

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Phase-Locked, All-or-Nothing)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Creates ALL artifacts at once                                          │
│   • Can't go back to update specs during implementation                    │
│   • Phase gates enforce linear progression                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Fluid Actions, Iterative)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACTIONS (not phases)             │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              any order                     │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Create artifacts one at a time OR fast-forward                         │
│   • Update specs/design/tasks during implementation                        │
│   • Dependencies enable progress, phases don't exist                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### コンポーネントアーキテクチャ

**レガシーワークフロー**は、TypeScript にハードコードされたテンプレートを使用します。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEGACY WORKFLOW COMPONENTS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Hardcoded Templates (TypeScript strings)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Tool-specific configurators/adapters                                      │
│                    │                                                        │
│                    ▼                                                        │
│   Generated Command Files (.claude/commands/openspec/*.md)                  │
│                                                                             │
│   • Fixed structure, no artifact awareness                                  │
│   • Change requires code modification + rebuild                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** は、外部スキーマと依存関係グラフエンジンを使用します。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX COMPONENTS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Schema Definitions (YAML)                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependencies                     │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob patterns                    │   │
│   │      requires: [proposal]      ◄── Enables after proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artifact Graph Engine                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topological sort (dependency ordering)                           │   │
│   │  • State detection (filesystem existence)                           │   │
│   │  • Rich instruction generation (templates + context)                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill Files (.claude/skills/openspec-*/SKILL.md)                          │
│                                                                             │
│   • Cross-editor compatible (Claude Code, Cursor, Windsurf)                 │
│   • Skills query CLI for structured data                                    │
│   • Fully customizable via schema files                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 依存関係グラフモデル

成果物は有向非巡回グラフ (DAG) を形成します。依存関係は**イネーブラー**であり、ゲートではありません。

```
                              proposal
                             (root node)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (requires:                  (requires:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requires:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY PHASE  │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**状態遷移：**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

### 情報フロー

**レガシーワークフロー** — エージェントは静的な指示を受け取ります。

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Static instructions:                   │
  │  • Create proposal.md                   │
  │  • Create tasks.md                      │
  │  • Create design.md                     │
  │  • Create specs/<capability>/spec.md    │
  │                                         │
  │  No awareness of what exists or         │
  │  dependencies between artifacts         │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent creates ALL artifacts in one go
```

**OPSX** — エージェントはリッチなコンテキストを照会します。

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Step 1: Query current state                                             │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── First ready      │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 2: Get rich instructions for ready artifact                        │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 3: Read dependencies → Create ONE artifact → Show what's unlocked  │
  └──────────────────────────────────────────────────────────────────────────┘
```

### 反復モデル

**レガシーワークフロー** — 反復が面倒です。

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Wait, the design is wrong"
       │               │
       │               ├── Options:
       │               │   • Edit files manually (breaks context)
       │               │   • Abandon and start over
       │               │   • Push through and fix later
       │               │
       │               └── No official "go back" mechanism
       │
       └── Creates ALL artifacts at once
```

**OPSX** — 自然な反復が可能です。

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "The design is wrong"
      │                │                  │
      │                │                  ▼
      │                │            Just edit design.md
      │                │            and continue!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply picks up
      │                │         where you left off
      │                │
      │                └── Creates ONE artifact, shows what's unlocked
      │
      └── Scaffolds change, waits for direction
```

### カスタムスキーマ

スキーマ管理コマンドを使用して、カスタムワークフローを作成します。

```bash
# Create a new schema from scratch (interactive)
openspec schema init my-workflow

# Or fork an existing schema as a starting point
openspec schema fork spec-driven my-workflow

# Validate your schema structure
openspec schema validate my-workflow

# See where a schema resolves from (useful for debugging)
openspec schema which my-workflow
```

スキーマは `openspec/schemas/`（プロジェクトローカル、バージョン管理対象）または `~/.local/share/openspec/schemas/`（ユーザーグローバル）に保存されます。

**スキーマ構造：**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**schema.yaml の例：**
```yaml
name: research-first
artifacts:
  - id: research        # Added before proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Now depends on research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**依存関係グラフ：**
```
   research ──► proposal ──► tasks
```

### まとめ

| 項目 | レガシー | OPSX |
|--------|----------|------|
| **テンプレート** | ハードコードされた TypeScript | 外部 YAML + Markdown |
| **依存関係** | なし（すべて一括） | トポロジカルソート付き DAG |
| **状態** | フェーズベースのメンタルモデル | ファイルシステムの存在 |
| **カスタマイズ** | ソースを編集、リビルド | schema.yaml を作成 |
| **反復** | フェーズロック | 流動的、何でも編集可能 |
| **エディタサポート** | ツール固有のコンフィギュレーター/アダプター | 単一のスキルディレクトリ |

## スキーマ

スキーマは、存在する成果物とその依存関係を定義します。現在利用可能なスキーマは以下のとおりです:

- **spec-driven** (デフォルト): proposal → specs → design → tasks

```bash
# 利用可能なスキーマの一覧を表示
openspec schemas

# すべてのスキーマとその解決元を表示
openspec schema which --all

# 対話形式で新しいスキーマを作成
openspec schema init my-workflow

# 既存のスキーマをフォークしてカスタマイズ
openspec schema fork spec-driven my-workflow

# 使用前にスキーマ構造を検証
openspec schema validate my-workflow
```

## ヒント

- 変更をコミットする前に `/opsx:explore` を使ってアイデアを練る
- 何をしたいか分かっているときは `/opsx:ff`、探索中は `/opsx:continue`
- `/opsx:apply` 中に問題が見つかったら、成果物を修正してから続行する
- タスクは `tasks.md` のチェックボックスで進捗を追跡
- ステータスはいつでも確認可能: `openspec status --change "name"`

## フィードバック

これはまだ荒削りです。意図的です — 私たちは何が機能するかを学んでいる最中です。

バグを見つけましたか？アイデアがありますか？[Discord](https://discord.gg/YctCnvvshC) に参加するか、[GitHub](https://github.com/Fission-AI/openspec/issues) でissueを開いてください。