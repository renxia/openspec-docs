# OPSXへの移行

このガイドは、レガシーなOpenSpecワークフローからOPSXへの移行を支援します。移行はスムーズに設計されており、既存の作業は保持され、新しいシステムはより高い柔軟性を提供します。

## 変更点

OPSXは、旧来のフェーズ固定型ワークフローを、流動的でアクションベースのアプローチに置き換えます。主な変更点は以下の通りです：

| 項目 | レガシー | OPSX |
|--------|--------|------|
| **コマンド** | `/openspec:proposal`、`/openspec:apply`、`/openspec:archive` | デフォルト：`/opsx:propose`、`/opsx:apply`、`/opsx:archive`（拡張ワークフローコマンドはオプション） |
| **ワークフロー** | すべての成果物を一度に作成 | 増分的または一度に作成—お客様の選択次第 |
| **巻き戻し** | ぎこちないフェーズゲート | 自然—任意の成果物をいつでも更新可能 |
| **カスタマイズ** | 固定構造 | スキーマ駆動、完全にハッキング可能 |
| **設定** | マーカー付きの`CLAUDE.md` + `project.md` | `openspec/config.yaml`のクリーンな設定 |

**哲学の変化：** 作業は線形ではありません。OPSXはそのような仮定をやめます。

---

## はじめに

### 既存の作業は安全です

移行プロセスは、保存を念頭に置いて設計されています：

- **`openspec/changes/` 内のアクティブな変更** — 完全に保持されます。OPSXコマンドで続行できます。
- **アーカイブされた変更** — 変更されません。履歴はそのまま残ります。
- **`openspec/specs/` 内のメイン仕様** — 変更されません。これらが信頼できる情報源です。
- **CLAUDE.md、AGENTS.md 等のあなたのコンテンツ** — 保持されます。OpenSpecマーカーブロックのみが削除され、あなたが書いたすべての内容は残ります。

### 削除されるもの

置き換えられるOpenSpec管理ファイルのみです：

| 対象 | 理由 |
|------|------|
| レガシースラッシュコマンドディレクトリ/ファイル | 新しいスキルシステムに置き換えられたため |
| `openspec/AGENTS.md` | 廃止されたワークフロートリガー |
| `CLAUDE.md`、`AGENTS.md` 等のOpenSpecマーカー | もう必要なくなったため |

**ツール別のレガシーコマンドの場所**（例 – ツールによって異なる場合があります）：

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md`（IDE拡張のみ；Copilot CLIではサポートされません）
- その他（Augment、Continue、Amazon Qなど）

移行プロセスは、設定されているツールを検出し、それらのレガシーファイルをクリーンアップします。

削除リストは長く見えるかもしれませんが、これらはすべてOpenSpecが元々作成したファイルです。ご自身のコンテンツが削除されることはありません。

### 注意が必要なもの

1つのファイルに手動での移行が必要です：

**`openspec/project.md`** — このファイルは自動的には削除されません。あなたが書いたプロジェクトコンテキストが含まれている可能性があるためです。以下の作業を行う必要があります：

1. 内容を確認する
2. 有用なコンテキストを `openspec/config.yaml` に移動する（以下のガイドラインを参照）
3. 準備ができたらファイルを削除する

**この変更を行った理由：**

旧 `project.md` は受動的でした。エージェントが読むかもしれないし、読まないかもしれないし、読んだ内容を忘れるかもしれません。信頼性にばらつきがあることが分かりました。

新しい `config.yaml` のコンテキストは、**すべてのOpenSpec計画リクエストにアクティブに注入されます**。これにより、AIが成果物を作成する際に、プロジェクトの規約、技術スタック、ルールが常に存在します。信頼性が向上します。

**トレードオフ：**

コンテキストがすべてのリクエストに注入されるため、簡潔に保つことが重要です。本当に重要なことに焦点を当てましょう：
- 技術スタックと主要な規約
- AIが把握すべき非自明な制約
- 以前頻繁に無視されていたルール

完璧にする必要はありません。何が最適かはまだ学習中であり、実験を重ねてコンテキスト注入の方法を改善していきます。

---

## 実行する移行

`openspec init` と `openspec update` の両方で、レガシーファイルを検出し、同じクリーンアッププロセスを案内します。状況に合った方を使用してください：

- 新規インストールでは、デフォルトでプロファイル `core`（`propose`、`explore`、`apply`、`archive`）が使用されます。
- 移行済みのインストールでは、必要に応じて `custom` プロファイルを書き込むことで、以前インストールされたワークフローが保持されます。

### `openspec init` の使用

新しいツールを追加したり、セットアップされているツールを再構成したりしたい場合は、これを実行します：

```bash
openspec init
```

initコマンドはレガシーファイルを検出し、クリーンアップを案内します：

```
新しいOpenSpecにアップグレードします

OpenSpecは、コーディングエージェント全体で普及しつつある標準であるエージェントスキルを使用するようになりました。
これにより、以前と同様にすべてが機能しながら、セットアップが簡素化されます。

削除するファイル
ユーザーのコンテンツを保持する必要なし：
  • .claude/commands/openspec/
  • openspec/AGENTS.md

更新するファイル
OpenSpecマーカーが削除され、コンテンツは保持されます：
  • CLAUDE.md
  • AGENTS.md

注意が必要なもの
  • openspec/project.md
    このファイルは削除しません。有用なプロジェクトコンテキストが含まれている可能性があります。

    新しいopenspec/config.yamlには、計画コンテキスト用の"context:"セクションがあります。
    これはすべてのOpenSpecリクエストに含まれ、古いproject.mdアプローチよりも確実に機能します。

    project.mdを確認し、有用なコンテンツをconfig.yamlのcontextセクションに移動し、
    準備ができたらファイルを削除してください。

? アップグレードしてレガシーファイルをクリーンアップしますか？ (Y/n)
```

**「はい」と答えた場合に起こること：**

1. レガシースラッシュコマンドディレクトリが削除されます
2. `CLAUDE.md`、`AGENTS.md` 等からOpenSpecマーカーが除去されます（コンテンツは残ります）
3. `openspec/AGENTS.md` が削除されます
4. 新しいスキルが `.claude/skills/` にインストールされます
5. デフォルトのスキーマで `openspec/config.yaml` が作成されます

### `openspec update` の使用

既存のツールを移行し、最新バージョンに更新したい場合は、これを実行します：

```bash
openspec update
```

updateコマンドもレガシーアーティファクトを検出しクリーンアップし、現在のプロファイルと配信設定に合わせて生成されたスキル/コマンドを更新します。

### 非対話型 / CI環境

スクリプト化された移行の場合：

```bash
openspec init --force --tools claude
```

`--force` フラグはプロンプトをスキップし、クリーンアップを自動承認します。

---

## project.md を config.yaml に移行する

旧 `openspec/project.md` は、プロジェクトコンテキスト用の自由形式のマークダウンファイルでした。新しい `openspec/config.yaml` は構造化されており、重要なことに、**すべての計画リクエストに注入される**ため、AIが作業する際にあなたの規約が常に存在します。

### 以前（project.md）

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

### 以後（config.yaml）

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
| 自由形式のマークダウン | 構造化されたYAML |
| 1つのテキストブロック | コンテキストと成果物ごとのルールが分離 |
| いつ使用されるか不明 | コンテキストはすべての成果物に表示；ルールは一致する成果物のみに表示 |
| スキーマ選択なし | 明示的な `schema:` フィールドでデフォルトのワークフローを設定 |

### 保持するもの、削除するもの

移行する際は、選択的に行いましょう。自問してください：「AIは*すべての*計画リクエストにこれが必要か？」

**`context:` の適切な候補**
- 技術スタック（言語、フレームワーク、データベース）
- 主要なアーキテクチャパターン（モノレポ、マイクロサービスなど）
- 非自明な制約（「なぜかライブラリXが使用できない」など）
- 頻繁に無視される重要な規約

**`rules:` に移動すべきもの**
- 成果物固有のフォーマット（「仕様でGiven/When/Thenを使用する」）
- レビュー基準（「提案にはロールバック計画を含める必要がある」）
- これらは一致する成果物のみに表示され、他のリクエストを軽量に保ちます。

**完全に除外するもの**
- AIが既に知っている一般的なベストプラクティス
- 要約できる冗長な説明
- 現在の作業に影響しない過去のコンテキスト

### 移行手順

1. **config.yamlを作成する**（initでまだ作成されていない場合）：
   ```yaml
   schema: spec-driven
   ```

2. **コンテキストを追加する**（簡潔に – これはすべてのリクエストに含まれます）：
   ```yaml
   context: |
     プロジェクトの背景をここに記述します。
     AIが本当に知る必要があることに焦点を当ててください。
   ```

3. **成果物ごとのルールを追加する**（オプション）：
   ```yaml
   rules:
     proposal:
       - 提案固有のガイドライン
     specs:
       - 仕様作成ルール
   ```

4. すべての有用な内容を移動したら、**project.mdを削除する**。

**深く考えすぎないでください。** 基本から始めて、反復的に改善しましょう。AIが重要なことを逃していると気づいたら、追加してください。コンテキストが冗長に感じたら、削りましょう。これは生きたドキュメントです。

### ヘルプが必要ですか？このプロンプトを使用してください

project.mdをどう凝縮すべきか迷っている場合は、AIアシスタントに尋ねてください：

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AIが、本質的なものと削減できるものを特定するのを手助けします。

---

## 新しいコマンド

コマンドの利用可能性はプロファイルに依存します：

**デフォルト（`core` プロファイル）：**

| コマンド | 目的 |
|---------|---------|
| `/opsx:propose` | 変更を作成し、計画成果物を1ステップで生成 |
| `/opsx:explore` | 構造なしでアイデアを検討 |
| `/opsx:apply` | tasks.mdからタスクを実装 |
| `/opsx:archive` | 変更を確定し、アーカイブ |

**拡張ワークフロー（カスタム選択）：**

| コマンド | 目的 |
|---------|---------|
| `/opsx:new` | 新しい変更の足場を作成 |
| `/opsx:continue` | 次の成果物を作成（1つずつ） |
| `/opsx:ff` | 高速転送 – 計画成果物を一度に作成 |
| `/opsx:verify` | 実装が仕様と一致するか検証 |
| `/opsx:sync` | アーカイブなしでプレビュー/仕様マージ |
| `/opsx:bulk-archive` | 複数の変更を一度にアーカイブ |
| `/opsx:onboard` | ガイド付きエンドツーエンドのオンボーディングワークフロー |

拡張コマンドを有効にするには `openspec config profile` を実行し、次に `openspec update` を実行します。

### レガシーからのコマンドマッピング

| レガシー | OPSX同等 |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose`（デフォルト）または `/opsx:new` 次に `/opsx:ff`（拡張） |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新機能

これらの機能は、拡張ワークフローコマンドセットの一部です。

**詳細な成果物作成：**
```
/opsx:continue
```
依存関係に基づいて、1つの成果物を一度に作成します。各ステップを確認したい場合に使用します。

**探索モード：**
```
/opsx:explore
```
変更を確定する前に、パートナーとアイデアを検討します。

---

## 新しいアーキテクチャの理解

### フェーズロックからフリッドへ

レガシーワークフローは直線的な進行を強制していました：

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

実装中に設計が間違っていると気づいた場合？
残念ながら、フェーズゲートでは簡単に戻ることができません。
```

OPSXはフェーズではなく、アクションを使用します：

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### 依存関係グラフ

成果物は有向グラフを形成します。依存関係はゲートではなく、促進要因です：

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
```

`/opsx:continue` を実行すると、準備が整っているものを確認し、次の成果物を提案します。また、複数の準備が整った成果物を任意の順序で作成することもできます。

### スキル vs コマンド

レガシーシステムはツール固有のコマンドファイルを使用していました：

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSXは新興の **skills** 標準を使用します：

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

進行中の変更は、OPSXコマンドとシームレスに連携します。

**レガシーワークフローからのアクティブな変更がありますか？**

```
/opsx:apply add-my-feature
```

OPSXは既存の成果物を読み込み、中断した場所から継続します。

**既存の変更にさらに成果物を追加したいですか？**

```
/opsx:continue add-my-feature
```

既存のものに基づいて、作成準備が整っているものを表示します。

**ステータスを確認する必要がありますか？**

```bash
openspec status --change add-my-feature
```

---

## 新しい設定システム

### config.yaml 構造

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### スキーマの解決

どのスキーマを使用するかを決定する際、OPSXは以下の順序で確認します：

1. **CLIフラグ**: `--schema <name>` (最優先)
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

詳細は [カスタマイズ](customization.md) を参照してください。

---

## トラブルシューティング

### "Legacy files detected in non-interactive mode"

CIまたは非対話型環境で実行しています。以下を使用してください：

```bash
openspec init --force
```

### 移行後にコマンドが表示されない

IDEを再起動してください。スキルは起動時に検出されます。

### "Unknown artifact ID in rules"

`rules:` キーがスキーマの成果物IDと一致しているか確認してください：

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

有効な成果物IDを確認するには以下を実行：

```bash
openspec schemas --json
```

### 設定が適用されない

1. ファイルが `openspec/config.yaml` にあることを確認してください（`.yml` ではなく）
2. YAML構文を検証してください
3. 設定の変更は即座に有効になります—再起動は不要です

### project.md が移行されていない

システムは `project.md` を意図的に保持します。カスタムコンテンツが含まれている可能性があるためです。手動で確認し、有用な部分を `config.yaml` に移動してから削除してください。

### クリーンアップされる内容を確認したいですか？

initを実行し、クリーンアッププロンプトを拒否してください—変更を加えずに完全な検出サマリーが表示されます。

---

## クイックリファレンス

### 移行後のファイル構成

```
project/
├── openspec/
│   ├── specs/                    # Unchanged
│   ├── changes/                  # Unchanged
│   │   └── archive/              # Unchanged
│   └── config.yaml               # NEW: Project configuration
├── .claude/
│   └── skills/                   # NEW: OPSX skills
│       ├── openspec-propose/     # default core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       └── ...                   # expanded profile adds new/continue/ff/etc.
├── CLAUDE.md                     # OpenSpec markers removed, your content preserved
└── AGENTS.md                     # OpenSpec markers removed, your content preserved
```

### 廃止されたもの

- `.claude/commands/openspec/` — `.claude/skills/` に置き換え
- `openspec/AGENTS.md` — 廃止
- `openspec/project.md` — `config.yaml` に移行後、削除
- `CLAUDE.md`、`AGENTS.md` 等のOpenSpecマーカーブロック

### コマンドチートシート

```text
/opsx:propose      Start quickly (default core profile)
/opsx:apply        Implement tasks
/opsx:archive      Finish and archive

# Expanded workflow (if enabled):
/opsx:new          Scaffold a change
/opsx:continue     Create next artifact
/opsx:ff           Create planning artifacts
```

---

## ヘルプ

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **ドキュメント**: [docs/opsx.md](opsx.md) で完全なOPSXリファレンスを参照