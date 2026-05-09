# OPSXへの移行

このガイドは、レガシーなOpenSpecワークフローからOPSXへの移行を支援するものです。移行はスムーズに行えるよう設計されており、既存の作業は保持され、新しいシステムはより柔軟性を提供します。

## 何が変わるのか？

OPSXは、固定されたフェーズのワークフローを、流動的でアクションベースのアプローチに置き換えます。主な変更点は以下の通りです：

| 項目 | レガシー | OPSX |
|------|----------|------|
| **コマンド** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | デフォルト: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (拡張ワークフローコマンドはオプション) |
| **ワークフロー** | すべての成果物を一度に作成 | 段階的に、または一度に作成可能—選択はあなた次第 |
| **戻る操作** | 不格好なフェーズゲート | 自然に—いつでも任意の成果物を更新可能 |
| **カスタマイズ** | 固定構造 | スキーマ駆動で、完全にハック可能 |
| **設定** | マーカー付きの `CLAUDE.md` + `project.md` | `openspec/config.yaml` にクリーンな設定 |

**哲学の変化:** 作業は直線的ではありません。OPSXは、そうであるかのように見せかけることをやめます。

---

## 始める前に

### 既存の作業は安全です

移行プロセスは保存を念頭に置いて設計されています。

- **`openspec/changes/` 内のアクティブな変更** — 完全に保存されます。OPSXコマンドで続行できます。
- **アーカイブされた変更** — 変更されません。履歴はそのまま残ります。
- **`openspec/specs/` 内のメイン仕様** — 変更されません。これらは信頼できる情報源です。
- **CLAUDE.md、AGENTS.md などのコンテンツ** — 保存されます。OpenSpecマーカーブロックのみが削除され、あなたが書いた内容はすべて残ります。

### 削除されるもの

置き換えられるOpenSpec管理ファイルのみです：

| 対象 | 理由 |
|------|------|
| レガシースラッシュコマンドのディレクトリ/ファイル | 新しいスキルシステムに置き換え |
| `openspec/AGENTS.md` | 廃止されたワークフロートリガー |
| `CLAUDE.md`、`AGENTS.md` などのOpenSpecマーカー | 不要に |

**ツール別のレガシーコマンドの場所**（例示—使用ツールにより異なります）：

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md`（IDE拡張のみ。Copilot CLIではサポートされません）
- その他（Augment、Continue、Amazon Q など）

移行プロセスは、設定されているツールを検出し、レガシーファイルをクリーンアップします。

削除リストは長く見えるかもしれませんが、これらはすべてOpenSpecが元々作成したファイルです。あなた自身のコンテンツが削除されることはありません。

### 注意が必要なもの

1つのファイルは手動での移行が必要です：

**`openspec/project.md`** — このファイルは、あなたが書いたプロジェクトコンテキストを含む可能性があるため、自動的には削除されません。以下を行う必要があります：

1. 内容を確認する
2. 有用なコンテキストを `openspec/config.yaml` に移動する（以下のガイダンス参照）
3. 準備ができたらファイルを削除する

**この変更を行った理由：**

旧 `project.md` は受動的でした—エージェントがそれを読むかもしれないし、読まないかもしれないし、読んだことを忘れるかもしれない。信頼性が一貫しないことが分かりました。

新しい `config.yaml` のコンテキストは**すべてのOpenSpec計画リクエストにアクティブに注入されます**。つまり、AIが成果物を作成する際に、プロジェクトの規約、技術スタック、ルールが常に存在します。より高い信頼性。

**トレードオフ：**

コンテキストはすべてのリクエストに注入されるため、簡潔にすることが重要です。本当に重要なことに焦点を当ててください：
- 技術スタックと主要な規約
- AIが知る必要のある明白でない制約
- 以前よく無視されていたルール

完璧にしようと心配しないでください。ここでは何が最適かをまだ学習中であり、実験を重ねながらコンテキスト注入の仕組みを改善していきます。

---

## 移行の実行

`openspec init` と `openspec update` の両方がレガシーファイルを検出し、同じクリーンアッププロセスをガイドします。状況に合ったものを使用してください：

- 新規インストールでは、デフォルトでプロファイル `core`（`propose`、`explore`、`apply`、`sync`、`archive`）が使用されます。
- 移行インストールでは、必要に応じて `custom` プロファイルを書き込むことで、以前にインストールしたワークフローを保持します。

### `openspec init` の使用

新しいツールを追加したり、セットアップするツールを再設定したい場合に実行します：

```bash
openspec init
```

initコマンドはレガシーファイルを検出し、クリーンアップをガイドします：

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**「はい」と答えた場合の動作：**

1. レガシースラッシュコマンドディレクトリが削除されます
2. `CLAUDE.md`、`AGENTS.md` などからOpenSpecマーカーが除去されます（コンテンツは残ります）
3. `openspec/AGENTS.md` が削除されます
4. 新しいスキルが `.claude/skills/` にインストールされます
5. `openspec/config.yaml` がデフォルトスキーマで作成されます

### `openspec update` の使用

既存のツールを移行し、最新バージョンに更新したいだけの場合に実行します：

```bash
openspec update
```

updateコマンドもレガシーアーティファクトを検出してクリーンアップし、現在のプロファイルと配信設定に合わせて生成されたスキル/コマンドを更新します。

### 非対話型 / CI 環境

スクリプトによる移行の場合：

```bash
openspec init --force --tools claude
```

`--force` フラグはプロンプトをスキップし、クリーンアップを自動承認します。

---

## project.md から config.yaml への移行

旧 `openspec/project.md` はプロジェクトコンテキスト用の自由形式のMarkdownファイルでした。新しい `openspec/config.yaml` は構造化されており、そして重要なことに、**すべての計画リクエストに注入される**ため、AIが作業する際にあなたの規約が常に存在します。

### 移行前 (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### 移行後 (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### 主な違い

| project.md | config.yaml |
|------------|-------------|
| 自由形式のMarkdown | 構造化されたYAML |
| テキストの単一ブロック | コンテキストと成果物ごとのルールが分離 |
| 使用されるタイミングが不明確 | コンテキストはすべての成果物に表示；ルールは一致する成果物にのみ表示 |
| スキーマ選択なし | 明示的な `schema:` フィールドでデフォルトワークフローを設定 |

### 保持するもの、除外するもの

移行時には選択的になりましょう。自問してみてください：「AIは*すべての*計画リクエストでこれを必要とするか？」

**`context:` の候補として適しているもの：**
- 技術スタック（言語、フレームワーク、データベース）
- 主要なアーキテクチャパターン（モノレポ、マイクロサービスなど）
- 明白でない制約（「ライブラリXは使用できない理由...」）
- よく無視される重要な規約

**代わりに `rules:` に移動するもの：**
- 成果物固有のフォーマット（「仕様ではGiven/When/Thenを使用」）
- レビュー基準（「提案にはロールバック計画を含める」）
- これらは一致する成果物にのみ表示され、他のリクエストを軽量に保ちます

**完全に除外するもの：**
- AIがすでに知っている一般的なベストプラクティス
- 要約できる冗長な説明
- 現在の作業に影響しない履歴コンテキスト

### 移行手順

1. **config.yaml を作成する**（initでまだ作成されていない場合）：
   ```yaml
   schema: spec-driven
   ```

2. **コンテキストを追加する**（簡潔に—これはすべてのリクエストに含まれます）：
   ```yaml
   context: |
     Your project background goes here.
     Focus on what the AI genuinely needs to know.
   ```

3. **成果物ごとのルールを追加する**（オプション）：
   ```yaml
   rules:
     proposal:
       - Your proposal-specific guidance
     specs:
       - Your spec-writing rules
   ```

4. **project.md を削除する**（有用なものをすべて移動したら）。

**考えすぎないでください。** 基本から始めて反復的に改善しましょう。AIが重要な何かを見落としていることに気づいたら、追加してください。コンテキストが膨らみすぎたら、トリムしてください。これは生きたドキュメントです。

### ヘルプが必要な場合：このプロンプトを使用

project.mdをどう要約すべきかわからない場合は、AIアシスタントに尋ねてください：

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AIが何が本質的で、何をトリムできるかを特定するのを手伝ってくれます。

---

## 新しいコマンド

コマンドの可用性はプロファイルに依存します：

**デフォルト（`core` プロファイル）：**

| コマンド | 目的 |
|---------|------|
| `/opsx:propose` | 変更を作成し、計画アーティファクトを1ステップで生成する |
| `/opsx:explore` | 構造なしでアイデアを検討する |
| `/opsx:apply` | tasks.mdからタスクを実装する |
| `/opsx:archive` | 変更を最終化し、アーカイブする |

**拡張ワークフロー（カスタム選択）：**

| コマンド | 目的 |
|---------|------|
| `/opsx:new` | 新しい変更スキャフォールドを開始する |
| `/opsx:continue` | 次のアーティファクトを作成する（一度に1つ） |
| `/opsx:ff` | ファストフォワード—計画アーティファクトを一度に作成する |
| `/opsx:verify` | 実装が仕様と一致するか検証する |
| `/opsx:sync` | デルタ仕様をメイン仕様にマージする |
| `/opsx:bulk-archive` | 複数の変更を一度にアーカイブする |
| `/opsx:onboard` | ガイド付きのエンドツーエンドオンボーディングワークフロー |

`openspec config profile` で拡張コマンドを有効にし、`openspec update` を実行してください。

### レガシーからのコマンドマッピング

| レガシー | OPSX同等コマンド |
|----------|-----------------|
| `/openspec:proposal` | `/opsx:propose`（デフォルト）または `/opsx:new` その後 `/opsx:ff`（拡張） |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新機能

これらの機能は、拡張ワークフローコマンドセットの一部です。

**粒度の細かいアーティファクト作成：**
```
/opsx:continue
```
依存関係に基づいて一度に1つのアーティファクトを作成します。各ステップを確認したい場合に使用します。

**探索モード：**
```
/opsx:explore
```
変更をコミットする前に、パートナーとアイデアを検討します。

---

## 新しいアーキテクチャの理解

### フェーズ固定から流動的へ

レガシーワークフローは線形の進行を強制していました：

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

実装中にデザインが間違っていると気づいたら？
残念。フェーズゲートでは容易に戻ることはできません。
```

OPSXはフェーズではなくアクションを使用します：

```
         ┌───────────────────────────────────────────────┐
         │           アクション（フェーズではない）       │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    任意の順序                  │
         └───────────────────────────────────────────────┘
```

### 依存関係グラフ

成果物は有向グラフを形成します。依存関係はゲートではなくイネーブラーです：

```
                        proposal
                       (ルートノード)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (要件:                      (要件:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (要件:
                     specs, design)
```

`/opsx:continue`を実行すると、何が準備できているかを確認し、次の成果物を提案します。準備ができた複数の成果物を任意の順序で作成することもできます。

### スキルとコマンド

レガシーシステムはツール固有のコマンドファイルを使用していました：

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSXは新興の**スキル**標準を使用します：

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

スキルは複数のAIコーディングツールで認識され、より豊富なメタデータを提供します。

---

## 既存の変更の継続

進行中の変更はOPSXコマンドとシームレスに動作します。

**レガシーワークフローからのアクティブな変更がありますか？**

```
/opsx:apply add-my-feature
```

OPSXは既存の成果物を読み取り、中断したところから継続します。

**既存の変更にさらに成果物を追加したいですか？**

```
/opsx:continue add-my-feature
```

既存の成果物に基づいて、作成可能なものを表示します。

**ステータスを確認する必要がありますか？**

```bash
openspec status --change add-my-feature
```

---

## 新しい設定システム

### config.yaml の構造

```yaml
# 必須: 新しい変更のデフォルトスキーマ
schema: spec-driven

# 任意: プロジェクトコンテキスト (最大50KB)
# すべての成果物の指示に注入されます
context: |
  プロジェクトの背景、技術スタック、
  規約、制約条件。

# 任意: 成果物ごとのルール
# マッチする成果物にのみ注入されます
rules:
  proposal:
    - ロールバック計画を含める
  specs:
    - Given/When/Then形式を使用する
  design:
    - フォールバック戦略を文書化する
  tasks:
    - 最大2時間のチャンクに分割する
```

### スキーマの解決

使用するスキーマを決定する際、OPSXは以下の順序で確認します：

1. **CLIフラグ**: `--schema <name>` (最高優先度)
2. **変更メタデータ**: 変更ディレクトリ内の `.openspec.yaml`
3. **プロジェクト設定**: `openspec/config.yaml`
4. **デフォルト**: `spec-driven`

### 利用可能なスキーマ

| スキーマ | 成果物 | 最適な用途 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | ほとんどのプロジェクト |

利用可能なすべてのスキーマを一覧表示：

```bash
openspec schemas
```

### カスタムスキーマ

独自のワークフローを作成：

```bash
openspec schema init my-workflow
```

または既存のものをフォーク：

```bash
openspec schema fork spec-driven my-workflow
```

詳細は[カスタマイズ](customization.md)を参照してください。

---

## トラブルシューティング

### 「非対話モードでレガシーファイルが検出されました」

CIまたは非対話環境で実行しています。以下を使用してください：

```bash
openspec init --force
```

### 移行後にコマンドが表示されない

IDEを再起動してください。スキルは起動時に検出されます。

### 「ルール内の不明な成果物ID」

`rules:`のキーがスキーマの成果物IDと一致していることを確認してください：

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

有効な成果物IDを確認するには以下を実行：

```bash
openspec schemas --json
```

### 設定が適用されない

1. ファイルが `openspec/config.yaml` (`.yml` ではない) にあることを確認
2. YAML構文を検証
3. 設定の変更は即座に有効になります。再起動は不要です

### project.mdが移行されない

システムは意図的に `project.md` を保持します。カスタムコンテンツが含まれている可能性があるためです。手動で確認し、有用な部分を `config.yaml` に移動してから削除してください。

### クリーンアップされる内容を確認したいですか？

initを実行し、クリーンアッププロンプトを拒否してください。変更を加えずに、完全な検出サマリーが表示されます。

---

## クイックリファレンス

### 移行後のファイル

```
project/
├── openspec/
│   ├── specs/                    # 変更なし
│   ├── changes/                  # 変更なし
│   │   └── archive/              # 変更なし
│   └── config.yaml               # 新規: プロジェクト設定
├── .claude/
│   └── skills/                   # 新規: OPSXスキル
│       ├── openspec-propose/     # デフォルトのコアプロファイル
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # 拡張プロファイルはnew/continue/ff等を追加
├── CLAUDE.md                     # OpenSpecマーカーは削除、コンテンツは保持
└── AGENTS.md                     # OpenSpecマーカーは削除、コンテンツは保持
```

### 削除されたもの

- `.claude/commands/openspec/` — `.claude/skills/` に置き換え
- `openspec/AGENTS.md` — 廃止
- `openspec/project.md` — `config.yaml` に移行後、削除
- `CLAUDE.md`、`AGENTS.md` などのOpenSpecマーカーブロック

### コマンドチートシート

```text
/opsx:propose      高速に開始（デフォルトのコアプロファイル）
/opsx:apply        タスクを実装
/opsx:archive      完了してアーカイブ

# 拡張ワークフロー（有効な場合）:
/opsx:new          変更をスキャフォールド
/opsx:continue     次の成果物を作成
/opsx:ff           計画成果物を作成
```

---

## ヘルプの入手

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **ドキュメント**: 完全なOPSXリファレンスは [docs/opsx.md](opsx.md) を参照