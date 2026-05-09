# カスタマイズ

OpenSpec は3つのレベルのカスタマイズを提供します:

| レベル | 概要 | 最適な用途 |
|--------|------|------------|
| **プロジェクト設定** | デフォルトを設定し、コンテキスト/ルールを注入 | ほとんどのチーム |
| **カスタムスキーマ** | 独自のワークフローアーティファクトを定義 | 独自のプロセスを持つチーム |
| **グローバルオーバーライド** | すべてのプロジェクトでスキーマを共有 | パワーユーザー |

---

## プロジェクト設定

`openspec/config.yaml` ファイルは、OpenSpec をチーム向けにカスタマイズする最も簡単な方法です。これにより、以下が可能になります:

- **デフォルトスキーマの設定** - 各コマンドで `--schema` を省略可能
- **プロジェクトコンテキストの注入** - AI が技術スタック、規約などを認識
- **アーティファクトごとのルール追加** - 特定のアーティファクトに対するカスタムルール

### クイックセットアップ

```bash
openspec init
```

これにより、対話形式で設定ファイルの作成がガイドされます。または手動で作成することもできます:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  技術スタック: TypeScript, React, Node.js, PostgreSQL
  API スタイル: RESTful、docs/api.md で文書化
  テスト: Jest + React Testing Library
  すべての公開 API で後方互換性を重視

rules:
  proposal:
    - ロールバック計画を含める
    - 影響を受けるチームを特定する
  specs:
    - Given/When/Then 形式を使用する
    - 新しいパターンを考案する前に既存のパターンを参照する
```

### 仕組み

**デフォルトスキーマ:**

```bash
# 設定なし
openspec new change my-feature --schema spec-driven

# 設定あり - スキーマが自動適用
openspec new change my-feature
```

**コンテキストとルールの注入:**

アーティファクトを生成する際、コンテキストとルールが AI プロンプトに注入されます:

```xml
<context>
技術スタック: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- ロールバック計画を含める
- 影響を受けるチームを特定する
</rules>

<template>
[スキーマの組み込みテンプレート]
</template>
```

- **コンテキスト** はすべてのアーティファクトに表示されます
- **ルール** は一致するアーティファクトにのみ表示されます

### スキーマ解決順序

OpenSpec がスキーマを必要とする場合、以下の順序で確認します:

1. CLI フラグ: `--schema <name>`
2. 変更メタデータ (変更フォルダ内の `.openspec.yaml`)
3. プロジェクト設定 (`openspec/config.yaml`)
4. デフォルト (`spec-driven`)

---

## カスタムスキーマ

プロジェクト設定で十分でない場合は、完全にカスタムなワークフローで独自のスキーマを作成できます。カスタムスキーマはプロジェクトの `openspec/schemas/` ディレクトリに配置され、コードとともにバージョン管理されます。

```text
your-project/
├── openspec/
│   ├── config.yaml        # プロジェクト設定
│   ├── schemas/           # カスタムスキーマの配置場所
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 変更内容
└── src/
```

### 既存スキーマのフォーク

カスタマイズの最も簡単な方法は、組み込みスキーマをフォークすることです:

```bash
openspec schema fork spec-driven my-workflow
```

これにより、`spec-driven` スキーマ全体が `openspec/schemas/my-workflow/` にコピーされ、自由に編集できます。

**取得できる内容:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # ワークフロー定義
└── templates/
    ├── proposal.md       # 提案アーティファクトのテンプレート
    ├── spec.md           # 仕様のテンプレート
    ├── design.md         # 設計のテンプレート
    └── tasks.md          # タスクのテンプレート
```

ここで `schema.yaml` を編集してワークフローを変更するか、テンプレートを編集して AI が生成する内容を変更できます。

### スキーマをゼロから作成

完全に新しいワークフローを作成する場合:

```bash
# 対話形式
openspec schema init research-first

# 非対話形式
openspec schema init rapid \
  --description "高速イテレーションワークフロー" \
  --artifacts "proposal,tasks" \
  --default
```

### スキーマ構造

スキーマはワークフロー内のアーティファクトとその依存関係を定義します:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: チームのカスタムワークフロー

artifacts:
  - id: proposal
    generates: proposal.md
    description: 初期提案ドキュメント
    template: proposal.md
    instruction: |
      この変更が必要な理由を説明する提案を作成してください。
      解決策ではなく、問題に焦点を当ててください。
    requires: []

  - id: design
    generates: design.md
    description: 技術設計
    template: design.md
    instruction: |
      実装方法を説明する設計ドキュメントを作成してください。
    requires:
      - proposal    # 提案が存在しないと設計を作成できない

  - id: tasks
    generates: tasks.md
    description: 実装チェックリスト
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**主要フィールド:**

| フィールド | 用途 |
|-----------|------|
| `id` | 一意識別子。コマンドやルールで使用 |
| `generates` | 出力ファイル名 (`specs/**/*.md` などのグロブをサポート) |
| `template` | `templates/` ディレクトリ内のテンプレートファイル |
| `instruction` | このアーティファクト作成のための AI 指示 |
| `requires` | 依存関係 - 事前に存在する必要があるアーティファクト |

### テンプレート

テンプレートは AI をガイドするマークダウンファイルです。アーティファクト作成時にプロンプトに注入されます。

```markdown
<!-- templates/proposal.md -->
## 理由

<!-- この変更の動機を説明してください。これはどのような問題を解決しますか？ -->

## 変更内容

<!-- 何が変わるかを説明してください。新しい機能や変更点について具体的に記述してください。 -->

## 影響

<!-- 影響を受けるコード、API、依存関係、システム -->
```

テンプレートには以下を含めることができます:
- AI が記入すべきセクション見出し
- AI へのガイダンスを含む HTML コメント
- 期待される構造を示す例形式

### スキーマの検証

カスタムスキーマを使用する前に、検証してください:

```bash
openspec schema validate my-workflow
```

これにより以下をチェックします:
- `schema.yaml` の構文が正しいこと
- 参照されているすべてのテンプレートが存在すること
- 循環依存がないこと
- アーティファクト ID が有効であること

### カスタムスキーマの使用

作成後、以下の方法でスキーマを使用できます:

```bash
# コマンドで指定
openspec new change feature --schema my-workflow

# または config.yaml でデフォルトとして設定
schema: my-workflow
```

### スキーマ解決のデバッグ

どのスキーマが使用されているか不明な場合、以下で確認できます:

```bash
# 特定のスキーマの解決元を確認
openspec schema which my-workflow

# 利用可能なすべてのスキーマを一覧表示
openspec schema which --all
```

出力には、プロジェクト、ユーザーディレクトリ、またはパッケージのいずれから取得されたかが表示されます:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注意:** OpenSpec は `~/.local/share/openspec/schemas/` にあるユーザーレベルのスキーマもサポートしていますが、プロジェクト間で共有する場合は、コードとともにバージョン管理されるプロジェクトレベルのスキーマ (`openspec/schemas/` 内) を推奨します。

---

## 例

### 高速イテレーションワークフロー

迅速なイテレーションのための最小限のワークフロー:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: 最小限のオーバーヘッドで高速イテレーション

artifacts:
  - id: proposal
    generates: proposal.md
    description: 簡易提案
    template: proposal.md
    instruction: |
      この変更に関する簡潔な提案を作成してください。
      何を、なぜ行うかに焦点を当て、詳細な仕様は省略してください。
    requires: []

  - id: tasks
    generates: tasks.md
    description: 実装チェックリスト
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### レビューアーティファクトの追加

デフォルトをフォークしてレビューステップを追加します:

```bash
openspec schema fork spec-driven with-review
```

次に `schema.yaml` を編集して以下を追加します:

```yaml
  - id: review
    generates: review.md
    description: 実装前レビューチェックリスト
    template: review.md
    instruction: |
      設計に基づいてレビューチェックリストを作成してください。
      セキュリティ、パフォーマンス、テストの考慮事項を含めてください。
    requires:
      - design

  - id: tasks
    # ... 既存のタスク設定 ...
    requires:
      - specs
      - design
      - review    # タスクにもレビューが必要に
```

---

## コミュニティスキーマ

OpenSpec は、独立したリポジトリを通じて配布されるコミュニティ管理のスキーマもサポートしています。これらは、[github/spec-kit のコミュニティ拡張カタログ](https://github.com/github/spec-kit/tree/main/extensions) が spec-kit で行っているのと同様に、OpenSpec を他のツールやシステムと統合する、意見を反映したワークフローを提供します。

コミュニティスキーマは OpenSpec コアに組み込まれていません — 独自のリポジトリとリリースサイクルを持っています。使用するには、スキーマバンドルをプロジェクトの `openspec/schemas/<schema-name>/` ディレクトリにコピーしてください (各リポジトリの README にインストール手順があります)。

| スキーマ | メンテナー | リポジトリ | 説明 |
|----------|-----------|-----------|------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | OpenSpec のアーティファクトガバナンスを [obra/superpowers](https://github.com/obra/superpowers) の実行スキル (ブレインストーミング、計画作成、サブエージェントによる TDD、コードレビュー、仕上げ) と統合します。Superpowers が本来カバーしないギャップを埋める、エビデンス重視の `retrospective` アーティファクトを追加します。 |

> コミュニティスキーマを貢献したいですか？ リポジトリへのリンクを添えて issue を作成するか、このテーブルに行を追加する PR を送信してください。

---

## 関連項目

- [CLI リファレンス: スキーマコマンド](cli.md#schema-commands) - 完全なコマンドドキュメント