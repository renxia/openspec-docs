# OpenSpec ドキュメント

ようこそ。ここはOpenSpecに関するすべてが集まる場所です。

OpenSpecは、コードが書かれる前に、あなたとAIコーディングアシスタントが**何を作るかについて合意する**のを支援します。あなたが変更点を記述し、AIが短い仕様書とタスクリストをドラフトします。二人で同じ計画を確認し、その後作業を進めます。途中で「AIが間違ったものを作っていた」と気づくことはもうありません。

もし他の何も読むのであれば、この2つのページを読んでください。

1. [Getting Started](getting-started.md)：インストール、初期化、最初の変更のリリース方法。
2. [How Commands Work](how-commands-work.md)：`/opsx:propose` を実際にどこで入力するのか（ヒント：ターミナルではなくAIチャットです）。これはほとんどの人が一度つまずくポイントです。

後者の方が、見た目以上に重要です。OpenSpecには二つの側面があります。それは、ターミナルで実行するコマンドラインツールと、AIアシスタントに与えるスラッシュコマンドです。どちらがどれであるかを知っておくと、最も一般的な混乱を避けることができます。

> **最初に身につけるべき最良の習慣：何を作るべきかわからないときは、`/opsx:explore` から始めること。** これは、コードを読み込み、選択肢を評価し、アーティファクトやコードが存在する前に曖昧なアイデアを具体的な計画へと研ぎ澄ます思考パートナーです。[Explore First](explore.md) ガイドがその根拠を示しています。

## パスを選ぶ

**全くの初心者です。** [Getting Started](getting-started.md) から始めてから、[Core Concepts at a Glance](overview.md) をざっと見てください。何か謎めいたと感じたら、[FAQ](faq.md) や [Glossary](glossary.md) が近くにあります。

**問題はあるが計画がない。** これはよくあるケースであり、専用の回答があります：[Explore First](explore.md)。コミットする前に、AIと一緒に`/opsx:explore`を使って熟考してください。

**大規模な既存コードベースがある。** すべてをドキュメント化する必要はありません。[Using OpenSpec in an Existing Project](existing-projects.md) では、すべてを把握しようとせず、実在のブラウンフィールドコードからどのように始めるかを説明しています。

**とにかく動くものを作りたい。** [Install](installation.md) を実行し、`openspec init` を実行した後、最初のスラッシュコマンドが正しい場所に届くように[How Commands Work](how-commands-work.md)を読んでください。

**例から学びたい。** [Examples & Recipes](examples.md) ページでは、小さな機能、バグ修正、リファクタリング、探索といった、実際の変更点を最初から最後まで解説しています。

**以前のワークフローからの移行者です。** [Migration Guide](migration-guide.md) は、何がどのように変わったのかを説明し、既存の作業は安全であると保証します。

**チームのプロセスに合わせて調整したい。** [Customization](customization.md) は、プロジェクト設定、カスタムスキーマ、共有コンテキストについて扱っています。

**何か壊れている。** [Troubleshooting](troubleshooting.md) には、実際にユーザーが遭遇する失敗とその修正方法をまとめています。

## 全体の地図

### ここから始める
| Doc | 提供するもの |
|-----|-------------------|
| [Getting Started](getting-started.md) | インストール、初期化、最初の変更の最初から最後まで実行する方法 |
| [Explore First](explore.md) | コミットする前にアイデアを熟考するために`/opsx:explore`を使用する方法 |
| [How Commands Work](how-commands-work.md) | スラッシュコマンドがどこで実行されるか、「インタラクティブモード」の意味、ターミナルとチャットについて |
| [Core Concepts at a Glance](overview.md) | すべてのメンタルモデルを1ページに：仕様書、変更点、デルタ、アーカイブ |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix の使用法と動作確認方法 |

### 日々の利用方法
| Doc | 提供するもの |
|-----|-------------------|
| [Workflows](workflows.md) | 一般的なパターンと、どのコマンドを使うべきかの指針 |
| [Examples & Recipes](examples.md) | 実際の変更点の完全なウォークスルー（コピー＆ペースト可能） |
| [Using OpenSpec in an Existing Project](existing-projects.md) | 大規模なブラウンフィールドコードへのOpenSpecの採用方法 |
| [Editing & Iterating on a Change](editing-changes.md) | アーティファクトの更新、巻き戻し、手動編集との調整 |
| [Commands](commands.md) | すべての`/opsx:*`スラッシュコマンドのリファレンス |
| [CLI](cli.md) | すべての`openspec`ターミナルコマンドのリファレンス |

### 深く理解する
| Doc | 提供するもの |
|-----|-------------------|
| [Concepts](concepts.md) | 仕様書、変更点、アーティファクト、スキーマ、アーカイブに関する詳細な説明 |
| [OPSX Workflow](opsx.md) | なぜワークフローがフェーズロックではなく流動的であるか、およびアーキテクチャの詳細解説 |
| [Glossary](glossary.md) | 定義されているすべての用語集 |

### 自分らしくする
| Doc | 提供するもの |
|-----|-------------------|
| [Customization](customization.md) | プロジェクト設定、カスタムスキーマ、共有コンテキスト |
| [Multi-Language](multi-language.md) | 英語以外の言語でのアーティファクト生成方法 |
| [Supported Tools](supported-tools.md) | OpenSpecが統合する25以上のAIツールとファイルの格納先 |

### ヘルプが必要なとき
| Doc | 提供するもの |
|-----|-------------------|
| [FAQ](faq.md) | 人々が最も尋ねる質問へのクイックアンサー |
| [Troubleshooting](troubleshooting.md) | 具体的な失敗に対する具体的な修正方法 |
| [Migration Guide](migration-guide.md) | レガシーワークフローからOPSXへの移行方法 |

### リポジトリをまたいで調整する（ベータ版）
| Doc | 提供するもの |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | 作業が複数のリポジトリやチームにまたがる場合の計画立て方 |
| [Agent Contract](agent-contract.md) | 機械で読み取り可能な、エージェントが操作するCLIインターフェース |

## 30秒バージョン

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← optional, but a great habit
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

ステップ1と2はターミナルで行います。残りはAIアシスタントのチャットで行います。この分割点を覚えることが最も重要であり、[How Commands Work](how-commands-work.md)がその理由を正確に説明しています。ステップ3はオプションですが、迷ったときに`/opsx:explore`から始めるのが最も身につけるべき習慣です。

## 他のヘルプを得る場所

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) で質問やアイデア、ヘルプを求めてください。
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) でバグや機能リクエストを報告してください。
- **`openspec feedback "your message"`** は、ターミナルから直接フィードバック（GitHub Issueを開きます）を送信します。

これらのドキュメントで間違っている、古くなっている、または混乱を招くものを見つけましたか？それはバグです。IssueまたはPRを作成してください。ドキュメンテーションの改善は、あなたが提供できる最も価値のある貢献の一つです。