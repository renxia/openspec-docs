---
layout: home

hero:
  name: "OpenSpec"
  text: "AIアシスタントのための仕様駆動開発"
  tagline: AIアシスタントプロジェクトの構築と管理のための軽量な仕様。
  actions:
    - theme: brand
      text: 開始する
      link: ./getting-started
    - theme: alt
      text: ホーム
      link: /

features:
  - title: Spec-First Workflow
    details: コードを記述する前に要件を定義します。
  - title: AI-Native Design
    details: Claude Code、Cursor、Windsurfなどのために構築されています。
  - title: Multi-Language
    details: 複数の言語でドキュメントが利用可能です。
---

# OpenSpec ドキュメンテーション

ようこそ。ここはOpenSpecに関するすべての情報が集まる場所です。

OpenSpecは、コードを記述する前に何を作るべきかについて、あなたとAIコーディングアシスタントが合意できるように支援します。あなたが変更点を説明すると、AIが短い仕様書とタスクリストをドラフトし、両者が同じ計画を確認してから作業が行われます。これで、「途中でAIが間違ったものを構築していた」という事態はなくなります。

他に何も読まない場合でも、この2つのページを読んでください。

1. [Getting Started](getting-started.md): インストール、初期化、最初の変更のリリース方法について。
2. [How Commands Work](how-commands-work.md): `/opsx:propose` を実際にタイプする場所（ヒント：ターミナルではなくAIチャット内です）。これはほとんどの人が一度つまずくポイントです。

後者（AIへのスラッシュコマンド）は、見た目以上に重要です。OpenSpecには2つの側面があります。ターミナルで実行するコマンドラインツールと、AIアシスタントに与えるスラッシュコマンドです。どちらがどれであるかを知っておくことで、最も一般的な混乱の瞬間を避けることができます。

> **まず身につけるべき最高の習慣：何を作るべきか確信が持てない場合は、`/opsx:explore` から始めてください。** これは、あなたのコードを読み込み、選択肢を検討し、アーティファクトやコードが存在する前に曖昧なアイデアを具体的な計画へと研ぎ澄ます思考パートナーです。[Explore First](explore.md) ガイドがその根拠を示しています。

## パスを選ぶ

**全くの初心者です。** [Getting Started](getting-started.md) から始め、次に [Core Concepts at a Glance](overview.md) をざっと見てください。何か不可解に感じた場合は、[FAQ](faq.md) や [Glossary](glossary.md) が近くにあります。

**問題はあるが計画がない状態です。** これは一般的なケースであり、専用の回答があります。[Explore First](explore.md) を利用してください。コミットする前にAIと一緒に`/opsx:explore`を使って熟考しましょう。

**大規模な既存のコードベースを持っています。** すべてをドキュメント化する必要はありません。[Using OpenSpec in an Existing Project](existing-projects.md) は、海全体を煮詰めることなく、実際のブラウンフィールドコードから始める方法を示しています。

**とにかく動作させたいです。** [Install](installation.md) を実行し、`openspec init` を実行した後、最初のスラッシュコマンドが正しい場所で機能するように[How Commands Work](how-commands-work.md)を読んでください。

**例から学びたいです。** [Examples & Recipes](examples.md) ページでは、小さなフィーチャー、バグ修正、リファクタリング、探索といった実際の変更を最初から最後まで解説します。

**以前のワークフローからの移行者です。** [Migration Guide](migration-guide.md) は、何がどのように変わったのか、そしてなぜかを説明し、既存の作業が安全であることを保証します。

**チームのプロセスに合わせて調整したいです。** [Customization](customization.md) は、プロジェクトの設定、カスタムスキーマ、共有コンテキストをカバーしています。

**何か壊れています。** [Troubleshooting](troubleshooting.md) には、実際に人々が遭遇する失敗とその修正方法を集めています。

## 全体の地図

### ここから始める
| Doc | 提供するもの |
|-----|-------------------|
| [Getting Started](getting-started.md) | インストール、初期化、最初の変更をエンドツーエンドで実行する方法 |
| [Explore First](explore.md) | コミットする前にアイデアを熟考するために `/opsx:explore` を使用する方法 |
| [How Commands Work](how-commands-work.md) | スラッシュコマンドが動作する場所、"インタラクティブモード"の意味、ターミナルとチャットの違い |
| [Core Concepts at a Glance](overview.md) | すべてのメンタルモデルを1ページにまとめたもの：仕様、変更、デルタ、アーカイブ |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix および動作確認方法 |

### 日常的に使用する
| Doc | 提供するもの |
|-----|-------------------|
| [Workflows](workflows.md) | 一般的なパターンと各コマンドをいつ使うべきか |
| [Examples & Recipes](examples.md) | 実際の変更の完全なウォークスルー、コピー＆ペースト可能 |
| [Using OpenSpec in an Existing Project](existing-projects.md) | 大規模なブラウンフィールドコードへのOpenSpec導入方法 |
| [Editing & Iterating on a Change](editing-changes.md) | アーティファクトの更新、戻る、手動編集の調整 |
| [Commands](commands.md) | すべての `/opsx:*` スラッシュコマンドのリファレンス |
| [CLI](cli.md) | すべての `openspec` ターミナルコマンドのリファレンス |

### 深く理解する
| Doc | 提供するもの |
|-----|-------------------|
| [Concepts](concepts.md) | 仕様、変更、アーティファクト、スキーマ、アーカイブに関する詳細な説明 |
| [OPSX Workflow](opsx.md) | なぜワークフローがフェーズロックではなく流動的であるか、およびアーキテクチャの詳細解説 |
| [Glossary](glossary.md) | 定義されているすべての用語集 |

### 自分らしくカスタマイズする
| Doc | 提供するもの |
|-----|-------------------|
| [Customization](customization.md) | プロジェクトの設定、カスタムスキーマ、共有コンテキスト |
| [Multi-Language](multi-language.md) | 英語以外の言語でアーティファクトを生成する方法 |
| [Supported Tools](supported-tools.md) | OpenSpecが統合する25以上のAIツールとファイルの配置先 |

### ヘルプが必要なとき
| Doc | 提供するもの |
|-----|-------------------|
| [FAQ](faq.md) | 人々が最も尋ねる質問へのクイックアンサー |
| [Troubleshooting](troubleshooting.md) | 具体的な失敗に対する具体的な修正方法 |
| [Migration Guide](migration-guide.md) | レガシーワークフローからOPSXへの移行方法 |

### リポジトリをまたいで連携する（ベータ版）
| Doc | 提供するもの |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | 作業が複数のリポジトリやチームにまたがる場合の計画方法 |
| [Agent Contract](agent-contract.md) | エージェントが駆動する機械可読なCLIサーフェス |

## 30秒バージョン

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← optional, but a great habit
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

ステップ1と2はターミナルで行われます。残りはAIアシスタントのチャットで行われます。この分割こそ覚えておくべきことであり、[How Commands Work](how-commands-work.md) がその理由を正確に説明しています。ステップ3はオプションですが、確信が持てないときに`/opsx:explore`から始めることが最も身につけるべき習慣です。

## 他のヘルプを得る場所

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) で質問、アイデア、ヘルプを求めてください。
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) にはバグや機能リクエストがあります。
- **`openspec feedback "your message"`** は、ターミナルから直接フィードバックを送信します（GitHub Issue を開きます）。

これらのドキュメントに誤り、陳腐化しているもの、または混乱を招くものはありましたか？それはバグです。Issue または PR を開いてください。ドキュメンテーションの改善は、あなたができる最も価値のある貢献の一つです。