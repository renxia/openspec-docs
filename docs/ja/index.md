---
layout: home

hero:
  name: "OpenSpec"
  text: "AIアシスタント向け仕様駆動開発"
  tagline: AIアシスタントプロジェクトを構築・管理するための軽量な仕様フレームワーク。
  actions:
    - theme: brand
      text: はじめに
      link: ./getting-started
    - theme: alt
      text: ホーム
      link: /

features:
  - title: 仕様ファーストのワークフロー
    details: コードを書く前に要件を定義します。
  - title: AIネイティブ設計
    details: Claude Code、Cursor、Windsurfなどに対応。
  - title: 多言語対応
    details: 複数の言語でドキュメントを提供。
---


<details>
<summary><strong>最も愛される仕様フレームワーク。</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
私たちの理念：

```text
→ 流動的であり、固定的ではない
→ 反復的であり、ウォーターフォールではない
→ 簡単であり、複雑ではない
→ グリーンフィールドだけでなく、ブラウンフィールド向けに構築
→ 個人プロジェクトから企業までスケーラブル
```

> [!TIP]
> **新しいワークフローが利用可能になりました！** 新しいアーティファクトガイド型ワークフローでOpenSpecを再構築しました。
>
> `/opsx:propose "your idea"` を実行して始めましょう。→ [詳細はこちら](opsx.md)

<p align="center">
  <a href="https://x.com/0xTab">@0xTab on X</a> をフォローして最新情報を入手 · <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> に参加してヘルプや質問を受ける。
</p>

<!-- TODO: Add GIF demo of /opsx:propose → /opsx:archive workflow -->

## 実際の動作

```text
You: /opsx:propose add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /opsx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /opsx:archive
AI:  Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>OpenSpecダッシュボード</strong></summary>

</details>

## クイックスタート

**Node.js 20.19.0以上が必要です。**

OpenSpecをグローバルにインストール：

```bash
npm install -g @fission-ai/openspec@latest
```

次にプロジェクトディレクトリに移動して初期化：

```bash
cd your-project
openspec init
```

これでAIに指示できます：`/opsx:propose <what-you-want-to-build>`

拡張ワークフロー（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:sync`、`/opsx:bulk-archive`、`/opsx:onboard`）を使用したい場合は、`openspec config profile` で選択し、`openspec update` で適用してください。

> [!NOTE]
> 使用しているツールがサポートされているか不明な場合は、[完全なリストを確認](supported-tools.md)してください。25以上のツールをサポートしており、今後も拡大予定です。
>
> pnpm、yarn、bun、nixでも動作します。[インストールオプションを確認](installation.md)。

## ドキュメント

→ **[はじめに](getting-started.md)**: 最初のステップ<br>
→ **[ワークフロー](workflows.md)**: 組み合わせとパターン<br>
→ **[コマンド](commands.md)**: スラッシュコマンドとスキル<br>
→ **[CLI](cli.md)**: ターミナルリファレンス<br>
→ **[サポートツール](supported-tools.md)**: ツール統合とインストールパス<br>
→ **[コンセプト](concepts.md)**: 全体の仕組み<br>
→ **[多言語対応](multi-language.md)**: 多言語サポート<br>
→ **[カスタマイズ](customization.md)**: 自分好みにカスタマイズ


## なぜOpenSpecなのか？

AIコーディングアシスタントは強力ですが、要件がチャット履歴にしか存在しない場合、予測不可能になります。OpenSpecは軽量な仕様レイヤーを追加し、コードを書く前に何を構築するかを合意できるようにします。

- **構築前に合意** — コードを書く前に、人間とAIが仕様を一致させる
- **整理を維持** — 各変更にはプロポーザル、仕様、設計、タスクが含まれる専用フォルダがある
- **流動的に作業** — いつでも任意のアーティファクトを更新可能、堅いフェーズゲートなし
- **ツールを活用** — スラッシュコマンドを通じて20以上のAIアシスタントで動作

### 比較

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — 詳細だが重い。堅いフェーズゲート、大量のMarkdown、Pythonセットアップ。OpenSpecはより軽量で、自由に反復可能。

**vs. [Kiro](https://kiro.dev)** (AWS) — 強力だがIDEにロックインされ、Claudeモデルに限定。OpenSpecは既に使用しているツールで動作。

**vs. なし** — 仕様なしのAIコーディングは曖昧なプロンプトと予測不可能な結果を意味。OpenSpecは儀式なしで予測可能性を提供。

## OpenSpecの更新

**パッケージをアップグレード**

```bash
npm install -g @fission-ai/openspec@latest
```

**エージェント指示を更新**

各プロジェクト内で以下を実行し、AIガイダンスを再生成し、最新のスラッシュコマンドが有効であることを確認：

```bash
openspec update
```

## 使用上の注意

**モデル選択**: OpenSpecは高推論モデルで最も効果的です。計画と実装の両方にOpus 4.5とGPT 5.2を推奨します。

**コンテキスト管理**: OpenSpecはクリーンなコンテキストウィンドウから恩恵を受けます。実装を始める前にコンテキストをクリアし、セッション全体で適切なコンテキスト管理を維持してください。

## コントリビューション

**小規模な修正** — バグ修正、誤字修正、 minorな改善は直接PRとして提出できます。

**大規模な変更** — 新機能、大規模なリファクタリング、アーキテクチャの変更については、まずOpenSpec変更提案を提出してください。実装開始前に意図と目標を一致させることができます。

提案を作成する際は、OpenSpecの理念を念頭に置いてください。私たちは、異なるコーディングエージェント、モデル、ユースケースにまたがる幅広いユーザーにサービスを提供しています。変更はすべてのユーザーにとって適切であるべきです。

**AI生成コードは歓迎** — テスト済みで検証されている限り。AI生成コードを含むPRには、使用したコーディングエージェントとモデル（例：「Claude Code using claude-opus-4-5-20251101で生成」）を記載してください。

### 開発

- 依存関係のインストール: `pnpm install`
- ビルド: `pnpm run build`
- テスト: `pnpm test`
- ローカルでCLIを開発: `pnpm run dev` または `pnpm run dev:cli`
- 約束されたコミット（1行）: `type(scope): subject`

## その他

<details>
<summary><strong>テレメトリ</strong></summary>

OpenSpecは匿名の使用統計を収集します。

使用パターンを理解するために、コマンド名とバージョンのみを収集します。引数、パス、内容、個人を特定する情報は収集しません。CI環境では自動的に無効になります。

**オプトアウト:** `export OPENSPEC_TELEMETRY=0` または `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>メンテナーとアドバイザー</strong></summary>

プロジェクトの推進を支援するコアメンテナーとアドバイザーのリストは、[MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) を参照してください。

</details>



## ライセンス

MIT