# OPSXへの移行

このガイドは、レガシーなOpenSpecワークフローからOPSXへの移行を支援します。移行はスムーズに設計されており、既存の作業は保持され、新しいシステムはより高い柔軟性を提供します。

## 何が変わるのか？

OPSXは、従来のフェーズ固定ワークフローを、流動的でアクション中心のアプローチに置き換えます。主な変更点は以下の通りです：

| 側面 | レガシー | OPSX |
|--------|--------|------|
| **コマンド** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | デフォルト: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive`（拡張ワークフローコマンドはオプション） |
| **ワークフロー** | すべての成果物を一度に作成 | 段階的または一括で作成—選択はあなた次第 |
| **後戻り** | 煩雑なフェーズゲート | 自然—いつでも任意の成果物を更新可能 |
| **カスタマイズ** | 固定構造 | スキーマ駆動型、完全にハック可能 |
| **設定** | マーカー付き`CLAUDE.md` + `project.md` | `openspec/config.yaml`によるクリーンな設定 |

**哲学の変化:** 作業は線形ではありません。OPSXはそれが線形であるというふりをやめます。

## 開始する前に

### 既存の作業は安全です

移行プロセスは、データの保存を最優先に設計されています：

- **`openspec/changes/` 内のアクティブな変更** — 完全に保存されます。OPSXコマンドで引き続き作業を続けられます。
- **アーカイブされた変更** — 変更されません。履歴はそのまま保持されます。
- **`openspec/specs/` 内のメイン仕様書** — 変更されません。これらは信頼できる情報源です。
- **`CLAUDE.md`、`AGENTS.md` などのあなたのコンテンツ** — 保存されます。OpenSpecマーカーブロックのみが削除され、あなたが記述した内容はすべて残ります。

### 削除されるもの

置き換えられるOpenSpec管理ファイルのみが削除対象です：

| 対象 | 理由 |
|------|------|
| レガシースラッシュコマンドディレクトリ/ファイル | 新しいスキルシステムに置き換えられるため |
| `openspec/AGENTS.md` | 廃止されたワークフロートリガー |
| `CLAUDE.md`、`AGENTS.md` などのOpenSpecマーカー | 不要になったため |

**ツール別レガシーコマンド配置場所**（例—ツールによって異なる場合があります）：

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.cinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md`（IDE拡張機能のみ；Copilot CLIではサポートされていません）
- Codex: OpenSpecは現在 `.codex/skills/openspec-*` を使用します；レガシークリーンアップは、OpenSpecの許可リストに登録されたプロンプトファイル名を `$CODEX_HOME/prompts` または `~/.codex/prompts` から対象とし、置換スキルが存在した場合にのみ削除します。
- その他（Augment、Continue、Amazon Qなど）

移行プロセスは、設定されているツールを自動検出し、レガシーファイルをクリーンアップします。

削除リストは長く見えますが、これらはすべてOpenSpecが元々作成したファイルです。あなた自身のコンテンツが削除されることは決してありません。

### 注意が必要な項目

1つのファイルを手動で移行する必要があります：

**`openspec/project.md`** — このファイルは自動的には削除されません。プロジェクトコンテキストが記述されている可能性があるため、以下の手順で対応してください：

1. 内容を確認する
2. 役立つコンテキストを `openspec/config.yaml` に移動する（以下のガイダンスを参照）
3. 準備ができたらファイルを削除する

**この変更を行った理由：**

古い `project.md` は受動的でした—エージェントが読む場合もあれば、読まない場合もあり、読んだ内容を忘れることもありました。信頼性に一貫性がないことが判明しました。

新しい `config.yaml` のコンテキストは、**すべてのOpenSpec計画リクエストに積極的に挿入されます**。つまり、プロジェクトの規約、技術スタック、ルールがAIがアーティファクトを作成する際に常に存在することになります。信頼性が向上します。

**トレードオフ：**

コンテキストがすべてのリクエストに挿入されるため、簡潔に保つ必要があります。本当に重要なものに焦点を当ててください：
- 技術スタックと主要な規約
- AIが知る必要がある明白ではない制約
- 以前に無視されがちだったルール

完璧を目指す必要はありません。何が最適かはまだ模索中であり、実験を通じてコンテキスト挿入の仕組みを改善していきます。

---

## 移行の実行

`openspec init` と `openspec update` の両方がレガシーファイルを検出し、同じクリーンアッププロセスを案内します。状況に合わせて使用してください：

- 新規インストールでは、デフォルトで `core` プロファイル（`propose`、`explore`、`apply`、`sync`、`archive`）が使用されます。
- 移行済みインストールでは、必要に応じて `custom` プロファイルが書き込まれ、以前インストールしたワークフローが保持されます。

### `openspec init` の使用

新しいツールを追加したり、設定するツールを再構成したりする場合に実行してください：

```bash
openspec init
```

initコマンドはレガシーファイルを検出し、クリーンアップを案内します：

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

**「はい」と答えた場合の処理：**

1. レガシースラッシュコマンドディレクトリが削除されます
2. `CLAUDE.md`、`AGENTS.md` などからOpenSpecマーカーが削除されます（あなたのコンテンツは残ります）
3. `openspec/AGENTS.md` が削除されます
4. 新しいスキルが `.claude/skills/` にインストールされます
5. デフォルトスキーマで `openspec/config.yaml` が作成されます

### `openspec update` の使用

移行して既存のツールを最新バージョンに更新するだけの場合は、これを実行してください：

```bash
openspec update
```

updateコマンドもレガシーアーティファクトを検出してクリーンアップし、生成されたスキル/コマンドを現在のプロファイルおよび配信設定に合わせて更新します。

### 非対話型/CI環境

スクリプト化された移行の場合：

```bash
openspec init --force --tools claude
```

`--force` フラグはプロンプトをスキップし、クリーンアップを自動的に承認します。

これには、OpenSpecが管理するCodexプロンプトファイルのクリーンアップが含まれます。クリーンアップはOpenSpecの許可リストに登録されたレガシーCodexプロンプトファイル名のみを対象とし、置換用の `.codex/skills/openspec-*` スキルが存在した場合にのみ削除し、他のすべてのファイルは保持されます。

---

## project.mdからconfig.yamlへの移行

古い `openspec/project.md` は、プロジェクトコンテキスト用の自由形式のマークダウンファイルでした。新しい `openspec/config.yaml` は構造化されており、重要な点として**すべての計画リクエストに挿入される**ため、AIが作業する際にあなたの規約が常に存在するようになります。

### 移行前（project.md）

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

### 移行後（config.yaml）

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
| 単一のテキストブロブ | コンテキストとアーティファクト別ルールを分離 |
| 使用タイミングが不明確 | コンテキストはすべてのアーティファクトに表示され、ルールは一致するアーティファクトにのみ表示される |
| スキーマ選択なし | 明示的な `schema:` フィールドがデフォルトワークフローを設定 |

### 保持すべきものと削除すべきもの

移行時には選択的に行ってください。自問してください：「AIが**すべての**計画リクエストでこれが必要か？」

**`context:` の適切な候補：**
- 技術スタック（言語、フレームワーク、データベース）
- 主要なアーキテクチャパターン（モノレポ、マイクロサービスなど）
- 明白ではない制約（「ライブラリXは使用できない理由は...」）
- しばしば無視されがちな重要な規約

**代わりに `rules:` に移動する：**
- アーティファクト固有のフォーマット（「仕様書にはGiven/When/Thenを使用する」）
- レビュー基準（「提案にはロールバック計画を含める必要がある」）
- これらは一致するアーティファクトにのみ表示されるため、他のリクエストを軽量に保てます

**完全に除外する：**
- AIがすでに知っている一般的なベストプラクティス
- 要約できる冗長な説明
- 現在の作業に影響しない歴史的コンテキスト

### 移行手順

1. **config.yamlを作成する**（initでまだ作成されていない場合）：
   ```yaml
   schema: spec-driven
   ```

2. **コンテキストを追加する**（簡潔に—これはすべてのリクエストに含まれます）：
   ```yaml
   context: |
     プロジェクトの背景情報をここに記述してください。
     AIが真に必要とする情報に焦点を当ててください。
   ```

3. **アーティファクト別ルールを追加する**（オプション）：
   ```yaml
   rules:
     proposal:
       - 提案固有のガイダンス
     specs:
       - 仕様書作成のルール
   ```

4. **役立つものをすべて移動したら、project.mdを削除する**

**深く考えすぎないでください。** 基本から始めて、反復改善してください。AIが重要な何かを見落としているのに気づいたら追加し、コンテキストが膨らんでいると感じたら削減してください。これは生きているドキュメントです。

### ヘルプが必要ですか？このプロンプトを使用してください

project.mdをどのように整理すればよいかわからない場合、AIアシスタントに尋ねてください：

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AIが、essentialなものと削減できるものを識別するのを手伝ってくれます。

---

## 新しいコマンド

コマンドの利用可否はプロファイルに依存します：

**デフォルト（coreプロファイル）：**

| コマンド | 目的 |
|---------|------|
| `/opsx:propose` | 変更を作成し、計画アーティファクトを1ステップで生成する |
| `/opsx:explore` | 構造化せずにアイデアを検討する |
| `/opsx:apply` | `tasks.md`のタスクを実装する |
| `/opsx:archive` | 変更を確定してアーカイブする |

**拡張ワークフロー（カスタム選択）：**

| コマンド | 目的 |
|---------|------|
| `/opsx:new` | 新しい変更スキャフォールドを開始する |
| `/opsx:continue` | 次のアーティファクトを作成する（1つずつ） |
| `/opsx:ff` | ファストフォワード—計画アーティファクトを一度に作成する |
| `/opsx:verify` | 実装が仕様書と一致することを検証する |
| `/opsx:sync` | 差分仕様書をメイン仕様書にマージする |
| `/opsx:bulk-archive` | 複数の変更を一度にアーカイブする |
| `/opsx:onboard` | ガイド付きエンドツーエンドオンボーディングワークフロー |

拡張コマンドを有効にするには `openspec config profile` を実行し、その後 `openspec update` を実行してください。

### レガシーからのコマンド対応表

| レガシー | OPSX相当 |
|---------|---------|
| `/openspec:proposal` | `/opsx:propose`（デフォルト）または `/opsx:new` の後に `/opsx:ff`（拡張） |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新機能

これらの機能は、拡張ワークフローコマンドセットの一部です。

**きめ細かいアーティファクト作成：**
```
/opsx:continue
```
依存関係に基づいてアーティファクトを1つずつ作成します。各ステップを確認したい場合に使用してください。

**探索モード：**
```
/opsx:explore
```
変更をコミットする前に、パートナーとアイデアを検討します。

---

## 新しいアーキテクチャの理解

### フェーズ固定からフルイドへ

レガシーワークフローは線形の進行を強制しました：

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

実装中に設計が間違っていることに気づいたら？
残念です。フェーズゲートは簡単に戻ることを許可しません。
```

OPSXはフェーズではなくアクションを使用します：

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

アーティファクトは有向グラフを形成します。依存関係はイネーブラーであり、ゲートではありません：

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

`/opsx:continue` を実行すると、準備が完了しているものを確認し、次のアーティファクトを提案します。また、準備が完了している複数のアーティファクトを任意の順序で作成できます。

### スキルとコマンド

レガシーシステムはツール固有のコマンドファイルを使用しました：

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSXは普及しつつある**スキル**標準を使用します：

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

スキルは複数のAIコーディングツールで認識され、より豊富なメタデータを提供します。

OPSXではCodexはスキルのみです。OpenSpecはCodexカスタムプロンプトファイルを生成しなくなりました。代わりに生成された `.codex/skills/openspec-*` ディレクトリを使用してください。

## 既存の変更の継続

進行中の変更は、OPSX コマンドとシームレスに連携します。

**レガシーワークフローからのアクティブな変更がありますか？**

```
/opsx:apply add-my-feature
```

OPSX は既存のアーティファクトを読み取り、中断した箇所から処理を再開します。

**既存の変更にアーティファクトを追加したい場合？**

```
/opsx:continue add-my-feature
```

既存の内容に基づいて、作成可能なアーティファクトを表示します。

**ステータスを確認したい場合？**

```bash
openspec status --change add-my-feature
```

---

## 新しい設定システム

### config.yaml の構造

```yaml
# 必須: 新規変更のデフォルトスキーマ
schema: spec-driven

# 任意: プロジェクトコンテキスト（最大 50KB）
# すべてのアーティファクト指示に注入されます
context: |
  Your project background, tech stack,
  conventions, and constraints.

# 任意: アーティファクトごとのルール
# 一致するアーティファクトにのみ注入されます
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

### スキーマの解決順序

使用するスキーマを決定する際、OPSX は以下の順序で確認します：

1. **CLI フラグ**: `--schema <name>`（最優先）
2. **変更メタデータ**: 変更ディレクトリ内の `.openspec.yaml`
3. **プロジェクト設定**: `openspec/config.yaml`
4. **デフォルト**: `spec-driven`

### 利用可能なスキーマ

| スキーマ | アーティファクト | 最適な用途 |
|----------|-----------------|------------|
| `spec-driven` | proposal → specs → design → tasks | ほとんどのプロジェクト |

利用可能なスキーマをすべて一覧表示：

```bash
openspec schemas
```

### カスタムスキーマ

独自のワークフローを作成：

```bash
openspec schema init my-workflow
```

または既存のスキーマをフォーク：

```bash
openspec schema fork spec-driven my-workflow
```

詳細は [カスタマイズ](customization.md) を参照してください。

---

## トラブルシューティング

### "非インタラクティブモードでレガシーファイルが検出されました"

CI 環境や非インタラクティブ環境で実行しています。以下のコマンドを使用してください：

```bash
openspec init --force
```

### 移行後にコマンドが表示されない

IDE を再起動してください。スキルは起動時に検出されます。

### "rules 内の不明なアーティファクト ID"

`rules:` のキーがスキーマのアーティファクト ID と一致しているか確認してください：

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

有効なアーティファクト ID を確認するには：

```bash
openspec schemas --json
```

### 設定が適用されない

1. ファイルが `openspec/config.yaml`（`.yml` ではない）にあることを確認してください
2. YAML 構文を検証してください
3. 設定の変更は即座に反映されます—再起動は不要です

### project.md が移行されない

システムは意図的に `project.md` を保持します。カスタムコンテンツが含まれている可能性があるためです。手動で確認し、有用な部分を `config.yaml` に移動してから削除してください。

### クリーンアップされる内容を確認したい場合？

init を実行し、クリーンアッププロンプトを拒否してください—変更を加えることなく、検出サマリー全体が表示されます。

---

## クイックリファレンス

### 移行後のファイル構成

```
project/
├── openspec/
│   ├── specs/                    # 変更なし
│   ├── changes/                  # 変更なし
│   │   └── archive/              # 変更なし
│   └── config.yaml               # 新規: プロジェクト設定
├── .claude/
│   └── skills/                   # 新規: OPSX スキル
│       ├── openspec-propose/     # デフォルトコアプロファイル
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # 拡張プロファイルは new/continue/ff などを追加
├── CLAUDE.md                     # OpenSpec マーカーは削除、コンテンツは保持
└── AGENTS.md                     # OpenSpec マーカーは削除、コンテンツは保持
```

### 削除されるもの

- `.claude/commands/openspec/` — `.claude/skills/` に置き換え
- `openspec/AGENTS.md` — 廃止
- `openspec/project.md` — `config.yaml` に移行してから削除
- `CLAUDE.md`、`AGENTS.md` などの OpenSpec マーカーブロック

### コマンドチートシート

```text
/opsx:propose      すぐに開始（デフォルトコアプロファイル）
/opsx:apply        タスクを実装
/opsx:archive      完了してアーカイブ

# 拡張ワークフロー（有効化されている場合）:
/opsx:new          変更のスキャフォールド
/opsx:continue     次のアーティファクトを作成
/opsx:ff           計画アーティファクトを作成
```

---

## ヘルプを取得

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **ドキュメント**: [docs/opsx.md](opsx.md)（OPSX リファレンス全文）