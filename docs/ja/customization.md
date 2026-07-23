# カスタマイズ

OpenSpecは3つのレベルのカスタマイズを提供します：

| レベル | 内容 | 対象 |
|-------|------|------|
| **プロジェクト設定** | デフォルトを設定し、コンテキスト/ルールを注入 | ほとんどのチーム |
| **カスタムスキーマ** | 独自のワークフローアーティファクトを定義 | 独自のプロセスを持つチーム |
| **グローバルオーバーライド** | すべてのプロジェクトでスキーマを共有 | パワーユーザー |

---

## プロジェクト設定

`openspec/config.yaml`ファイルは、チームのためにOpenSpecをカスタマイズする最も簡単な方法です。以下を可能にします：

- **デフォルトスキーマを設定** - すべてのコマンドで`--schema`をスキップ
- **プロジェクトコンテキストを注入** - AIが技術スタック、規約などを認識
- **アーティファクトごとのルールを追加** - 特定のアーティファクト向けのカスタムルール

### クイックセットアップ

```bash
openspec init
```

これは対話的に設定を作成する手順を案内します。または手動で作成することもできます：

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  技術スタック：TypeScript、React、Node.js、PostgreSQL
  APIスタイル：RESTful、docs/api.mdに記載
  テスト：Jest + React Testing Library
  すべての公開APIの後方互換性を重視します

rules:
  proposal:
    - ロールバック計画を含める
    - 影響を受けるチームを特定
  specs:
    - Given/When/Then形式を使用
    - 新しいパターンを考案する前に既存のパターンを参照
```

### 仕組み

**デフォルトスキーマ：**

```bash
# 設定なし
openspec new change my-feature --schema spec-driven

# 設定あり - スキーマは自動的に適用
openspec new change my-feature
```

**コンテキストとルールの注入：**

任意のアーティファクトを生成する際、コンテキストとルールはAIプロンプトに注入されます：

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **コンテキスト**はすべてのアーティファクトに表示されます
- **ルール**は一致するアーティファクトにのみ表示されます

### スキーマ解決順序

OpenSpecがスキーマを必要とする場合、以下の順序で確認します：

1. CLIフラグ：`--schema <name>`
2. 変更メタデータ（変更フォルダ内の`.openspec.yaml`）
3. プロジェクト設定（`openspec/config.yaml`）
4. デフォルト（`spec-driven`）

---

## カスタムスキーマ

プロジェクト設定だけでは不十分な場合、独自のスキーマを作成して完全にカスタマイズされたワークフローを実現できます。カスタムスキーマはプロジェクトの`openspec/schemas/`ディレクトリに配置され、コードとともにバージョン管理されます。

```text
your-project/
├── openspec/
│   ├── config.yaml        # プロジェクト設定
│   ├── schemas/           # カスタムスキーマを配置
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 変更履歴
└── src/
```

### 既存スキーマのフォーク

カスタマイズする最も簡単な方法は、組み込みスキーマをフォークすることです：

```bash
openspec schema fork spec-driven my-workflow
```

これにより、`spec-driven`スキーマ全体が`openspec/schemas/my-workflow/`にコピーされ、自由に編集できます。

**生成されるファイル：**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # ワークフロー定義
└── templates/
    ├── proposal.md       # 提案アーティファクト用テンプレート
    ├── spec.md           # 仕様書用テンプレート
    ├── design.md         # 設計書用テンプレート
    └── tasks.md          # タスク用テンプレート
```

次に`schema.yaml`を編集してワークフローを変更するか、テンプレートを編集してAIが生成する内容を変更できます。

### スキーマを新規作成

完全に新しいワークフローの場合：

```bash
# 対話モード
openspec schema init research-first

# 非対話モード
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### スキーマ構造

スキーマは、ワークフロー内のアーティファクトとそれらの依存関係を定義します：

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # 提案が存在するまで設計を作成できません

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**主要なフィールド：**

| フィールド | 目的 |
|-------|---------|
| `id` | 一意の識別子。コマンドやルールで使用されます |
| `generates` | 出力ファイル名（`specs/**/*.md`などのグロブをサポート） |
| `template` | `templates/`ディレクトリ内のテンプレートファイル |
| `instruction` | このアーティファクトを作成するためのAI指示 |
| `requires` | 依存関係 - 先に存在が必要なアーティファクト |

### テンプレート

テンプレートはAIをガイドするためのMarkdownファイルです。アーティファクトを作成する際にプロンプトに注入されます。

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

テンプレートに含めることができるもの：
- AIが記入すべきセクション見出し
- AI向けのガイダンスを含むHTMLコメント
- 期待される構造を示す例示フォーマット

### スキーマの検証

カスタムスキーマを使用する前に検証してください：

```bash
openspec schema validate my-workflow
```

以下を確認します：
- `schema.yaml`の構文が正しいこと
- 参照されているすべてのテンプレートが存在すること
- 循環依存がないこと
- アーティファクトIDが有効であること

### カスタムスキーマの使用

作成後、以下の方法でスキーマを使用できます：

```bash
# コマンドで指定
openspec new change feature --schema my-workflow

# またはconfig.yamlでデフォルトとして設定
schema: my-workflow
```

### スキーマ解決のデバッグ

どのスキーマが使用されているか不明な場合、以下のコマンドで確認できます：

```bash
# 特定のスキーマの解決元を表示
openspec schema which my-workflow

# 利用可能なすべてのスキーマを一覧表示
openspec schema which --all
```

出力には、プロジェクト、ユーザーディレクトリ、パッケージのいずれから取得されたかが表示されます：

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注記：** OpenSpecは、`~/.local/share/openspec/schemas/`にユーザーレベルのスキーマを配置してプロジェクト間で共有することもサポートしていますが、コードとともにバージョン管理できるため、`openspec/schemas/`のプロジェクトレベルのスキーマを使用することを推奨します。

---

## 例

### 高速反復ワークフロー

迅速な反復のための最小限のワークフロー：

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### レビューアーティファクトの追加

デフォルトをフォークしてレビューステップを追加：

```bash
openspec schema fork spec-driven with-review
```

次に`schema.yaml`を編集して以下を追加：

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... 既存のタスク設定 ...
    requires:
      - specs
      - design
      - review    # タスクがレビューも要求するようになりました
```

---

## コミュニティスキーマ

OpenSpecは、スタンドアロンリポジトリで配布されるコミュニティメンテナンスのスキーマもサポートしています。これらは、OpenSpecを他のツールやシステムと統合するための意見が反映されたワークフローを提供します。これは、[spec-kit用のgithub/spec-kitのコミュニティ拡張カタログ](https://github.com/github/spec-kit/tree/main/extensions)の仕組みと同様です。

コミュニティスキーマはOpenSpecコアに組み込まれていません。独自のリポジトリに存在し、独自のリリースサイクルを持っています。使用するには、スキーマバンドルをプロジェクトの`openspec/schemas/<schema-name>/`ディレクトリにコピーしてください（各リポジトリのREADMEにインストール手順が記載されています）。

| スキーマ | メンテナー | リポジトリ | 説明 |
|--------|-----------|-----------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | OpenSpecのアーティファクトガバナンスを[obra/superpowers](https://github.com/obra/superpowers)の実行スキル（ブレインストーミング、プラン作成、サブエージェントによるTDD、コードレビュー、仕上げ）と統合します。Superpowersがネイティブでカバーしていないギャップを埋める、エビデンスファーストの`retrospective`アーティファクトを追加します。 |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | PMファーストのワークフロー。[nanopm](https://github.com/nmrtn/nanopm)の計画パイプライン（監査→戦略→ロードマップ→PRD）を実装の上流で実行します。製品計画をOpenSpecの仕様駆動エンジニアリングワークフローに橋渡しします。`.nanopm/`が存在する場合はアーティファクトをそこから読み込みます - 提案は監査を、設計は戦略を、タスクはPRD分解をソースとします。 |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | 機能レベルエンドツーエンドテストランブック。各機能には不変の仕様、不変のタスクテンプレート、実行ごとのタイムスタンプ付き実行記録が1つずつあります。アサーションは観測可能な動作のみ（HTTPステータス、レスポンスボディ、永続化された状態 - ログの部分文字列は使用しない）で、各実行には開始/終了UTC、所要時間、最適推定LLMトークン消費量を記録します。 |

> コミュニティスキーマを提供したいですか？リポジトリへのリンクを含むissueを開くか、このテーブルに行を追加するPRを送信してください。

---

## 関連項目

- [CLIリファレンス：スキーマコマンド](cli.md#schema-commands) - 完全なコマンドドキュメント