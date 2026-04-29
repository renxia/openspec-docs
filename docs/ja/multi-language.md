# 多言語ガイド

OpenSpecを設定して、英語以外の言語で成果物を生成する方法を説明します。

## クイックセットアップ

`openspec/config.yaml`に言語指示を追加します：

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

これで完了です。これ以降、生成されるすべての成果物はポルトガル語で出力されます。

## 言語設定例

### ポルトガル語（ブラジル）

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### スペイン語

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### 中国語（簡体字）

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### 日本語

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### フランス語

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### ドイツ語

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## ヒント

### 技術用語の扱い

技術用語の扱い方を決定します：

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### 他のコンテキストとの組み合わせ

言語設定は、プロジェクトの他のコンテキストと併用できます：

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## 検証

言語設定が正しく機能しているか確認するには：

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## 関連ドキュメント

- [カスタマイズガイド](./customization.md) - プロジェクト設定オプション
- [ワークフローガイド](./workflows.md) - ワークフローの完全なドキュメント