# カスタマイズ

OpenSpecは3つのレベルのカスタマイズを提供します：

| レベル | 機能 | 適しているチーム |
|-------|------|------------------|
| **プロジェクト設定** | デフォルト値の設定、コンテキスト/ルールの注入 | ほとんどのチーム |
| **カスタムスキーマ** | 独自のワークフローアーティファクトを定義 | 独自のプロセスを持つチーム |
| **グローバルオーバーライド** | 全プロジェクトでスキーマを共有 | パワーユーザー |

---

## プロジェクト設定

`openspec/config.yaml`ファイルは、チーム向けにOpenSpecをカスタマイズする最も簡単な方法です。これにより以下が可能になります：

- **デフォルトスキーマの設定** - 全コマンドで`--schema`を省略可能
- **プロジェクトコンテキストの注入** - AIが技術スタック、規約などを認識
- **アーティファクト別ルールの追加** - 特定アーティファクトに対するカスタムルール

### クイックセットアップ

```bash
openspec init
```

このコマンドで対話的に設定を作成できます。または手動で作成：

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### 仕組み

**デフォルトスキーマ：**

```bash
# 設定なしの場合
openspec new change my-feature --schema spec-driven

# 設定ありの場合 - スキーマは自動適用
openspec new change my-feature
```

**コンテキストとルールの注入：**

任意のアーティファクトを生成する際、コンテキストとルールがAIプロンプトに注入されます：

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
[スキーマの組み込みテンプレート]
</template>
```

- **コンテキスト**は全アーティファクトに表示
- **ルール**は対応するアーティファクトのみに表示

### スキーマ解決順序

OpenSpecがスキーマを必要とする場合、以下の順序で確認します：

1. CLIフラグ：`--schema <name>`
2. 変更メタデータ（変更フォルダ内の`.openspec.yaml`）
3. プロジェクト設定（`openspec/config.yaml`）
4. デフォルト（`spec-driven`）

---

## カスタムスキーマ

プロジェクト設定では不十分な場合、完全にカスタムしたワークフローで独自のスキーマを作成できます。カスタムスキーマはプロジェクトの`openspec/schemas/`ディレクトリに配置し、コードとバージョン管理されます。

```text
your-project/
├── openspec/
│   ├── config.yaml        # プロジェクト設定
│   ├── schemas/           # カスタムスキーマ配置場所
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 変更内容
└── src/
```

### 既存スキーマのフォーク

カスタマイズの最速方法は、組み込みスキーマをフォークすることです：

```bash
openspec schema fork spec-driven my-workflow
```

これにより`spec-driven`スキーマ全体が`openspec/schemas/my-workflow/`にコピーされ、自由に編集可能になります。

**作成される構造：**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # ワークフロー定義
└── templates/
    ├── proposal.md       # 提案アーティファクト用テンプレート
    ├── spec.md           # 仕様用テンプレート
    ├── design.md         # 設計用テンプレート
    └── tasks.md          # タスク用テンプレート
```

`schema.yaml`を編集してワークフローを変更し、テンプレートを編集してAI生成内容を変更します。

### 新規スキーマの作成

完全に新しいワークフローを作成する場合：

```bash
# 対話的
openspec schema init research-first

# 非対話的
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### スキーマ構造

スキーマはワークフロー内のアーティファクトとその依存関係を定義します：

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
      - proposal    # 提案が存在するまで設計を作成不可

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

**主要フィールド：**

| フィールド | 目的 |
|-----------|------|
| `id` | ユニーク識別子、コマンドとルールで使用 |
| `generates` | 出力ファイル名（`specs/**/*.md`のようなグロブ対応） |
| `template` | `templates/`ディレクトリ内のテンプレートファイル |
| `instruction` | アーティファクト作成時のAI指示 |
| `requires` | 依存関係 - 事前に存在する必要があるアーティファクト |

### テンプレート

テンプレートはAIをガイドするMarkdownファイルです。アーティファクト作成時にプロンプトに注入されます。

```markdown
<!-- templates/proposal.md -->
## Why

<!-- この変更が必要な理由を説明。どのような問題を解決するか？ -->

## What Changes

<!-- 変更内容を記述。新機能や変更点を具体的に記載 -->

## Impact

<!-- 影響を受けるコード、API、依存関係、システム -->
```

テンプレートには以下を含められます：
- AIが記入すべきセクション見出し
- AIへのガイダンスを含むHTMLコメント
- 期待される構造を示す例示フォーマット

### スキーマの検証

カスタムスキーマを使用する前に検証します：

```bash
openspec schema validate my-workflow
```

これにより以下を確認：
- `schema.yaml`の構文が正しい
- 参照されているテンプレートが全て存在する
- 循環依存がない
- アーティファクトIDが有効

### カスタムスキーマの使用

作成後、以下の方法でスキーマを使用：

```bash
# コマンドで指定
openspec new change feature --schema my-workflow

# またはconfig.yamlでデフォルトに設定
schema: my-workflow
```

### スキーマ解決のデバッグ

どのスキーマが使用されているか不明な場合、以下で確認：

```bash
# 特定スキーマの解決元を確認
openspec schema which my-workflow

# 利用可能なスキーマを一覧表示
openspec schema which --all
```

出力でプロジェクト、ユーザーディレクトリ、パッケージのいずれから解決されたかを確認：

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注意：** OpenSpecは`~/.local/share/openspec/schemas/`にユーザーレベルのスキーマもサポートし、プロジェクト間で共有可能ですが、コードとバージョン管理されるプロジェクトレベルのスキーマ（`openspec/schemas/`）を推奨します。

---

## 例

### 素早い反復ワークフロー

最小限のオーバーヘッドで高速な反復を行うワークフロー：

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

次に`schema.yaml`を編集して追加：

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
      - review    # タスクにもレビューを要求
```

---

## 関連項目

- [CLIリファレンス：スキーマコマンド](cli.md#schema-commands) - 完全なコマンドドキュメント