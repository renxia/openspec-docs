---
layout: home

hero:
  name: "OpenSpec"
  text: "AI アシスタントのための仕様駆動開発"
  tagline: AI アシスタントプロジェクトを構築・管理するための軽量な仕様。
  actions:
    - theme: brand
      text: はじめに
      link: ./getting-started
    - theme: alt
      text: ホーム
      link: /

features:
  - title: 仕様優先のワークフロー
    details: コードを書く前に要件を定義します。
  - title: AI ネイティブデザイン
    details: Claude Code、Cursor、Windsurf などに対応。
  - title: 多言語対応
    details: 複数言語でドキュメントを提供。
---

私たちの理念：

```text
→ 流動的で、固定的ではない
→ 反復的で、ウォーターフォールではない
→ 簡単で、複雑ではない
→ ブラウンフィールド向けに構築、グリーンフィールドだけではない
→ 個人プロジェクトから企業までスケール可能
```

> [!TIP]
> **新しいワークフローが利用可能になりました！** 新しいアーティファクト主導のワークフローで OpenSpec を再構築しました。
>
> `/opsx:propose "あなたのアイデア"` を実行して始めましょう。 → [詳細はこちら](opsx.md)

<p align="center">
  最新情報は <a href="https://x.com/0xTab">@0xTab on X</a> をフォロー · ヘルプや質問は <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> に参加。
</p>

## 実際の使用例

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
<summary><strong>OpenSpec ダッシュボード</strong></summary>
</details>

## クイックスタート

**Node.js 20.19.0 以上が必要です。**

OpenSpec をグローバルにインストール：

```bash
npm install -g @fission-ai/openspec@latest
```

次にプロジェクトディレクトリに移動して初期化：

```bash
cd your-project
openspec init
```

次に AI に指示：`/opsx:propose <構築したいもの>`

拡張ワークフロー（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:sync`、`/opsx:bulk-archive`、`/opsx:onboard`）を使用したい場合は、`openspec config profile` で選択し、`openspec update` で適用します。

> [!NOTE]
> お使いのツールがサポートされているか分かりませんか？[完全なリストを表示](supported-tools.md) – 25 以上のツールをサポートし、さらに増加中。
>
> pnpm、yarn、bun、nix でも動作します。[インストールオプションを参照](installation.md)。

## ドキュメント

→ **[はじめに](getting-started.md)**: 最初のステップ<br>
→ **[ワークフロー](workflows.md)**: コンボとパターン<br>
→ **[コマンド](commands.md)**: スラッシュコマンドとスキル<br>
→ **[CLI](cli.md)**: ターミナルリファレンス<br>
→ **[サポートツール](supported-tools.md)**: ツール統合とインストールパス<br>
→ **[コンセプト](concepts.md)**: 全体の仕組み<br>
→ **[多言語対応](multi-language.md)**: 多言語サポート<br>
→ **[カスタマイズ](customization.md)**: あなた好みに


## なぜ OpenSpec なのか？

AI コーディングアシスタントは強力ですが、要件がチャット履歴だけに存在すると予測不能です。OpenSpec は軽量な仕様レイヤーを追加し、コードが書かれる前に構築内容について合意できるようにします。

- **構築前に合意する** — コードが書かれる前に、人間と AI が仕様について合意する
- **整理された状態を保つ** — 各変更には提案、仕様、設計、タスクを含む独自のフォルダが割り当てられる
- **流動的に作業する** — いつでも任意のアーティファクトを更新、固定的なフェーズゲートなし
- **お使いのツールを使用** — スラッシュコマンドを通じて 20 以上の AI アシスタントで動作

### 他との比較

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — 徹底的だが重量級。固定的なフェーズゲート、大量のマークダウン、Python セットアップ。OpenSpec はより軽量で、自由に反復できます。

**vs. [Kiro](https://kiro.dev)** (AWS) — 強力だが、その IDE にロックインされ、Claude モデルに限定されます。OpenSpec は既存のツールで動作します。

**vs. なし** — 仕様なしの AI コーディングは、曖昧なプロンプトと予測不能な結果を意味します。OpenSpec は儀式なしに予測可能性をもたらします。

## OpenSpec の更新

**パッケージをアップグレード**

```bash
npm install -g @fission-ai/openspec@latest
```

**エージェント指示を更新**

各プロジェクト内で実行して AI ガイダンスを再生成し、最新のスラッシュコマンドが有効であることを確認：

```bash
openspec update
```

## 使用上の注意

**モデル選択**: OpenSpec は高推論モデルで最も効果的に動作します。計画と実装の両方に Opus 4.5 と GPT 5.2 を推奨します。

**コンテキストの衛生**: OpenSpec はクリーンなコンテキストウィンドウから恩恵を受けます。実装を開始する前にコンテキストをクリアし、セッション全体を通じて良好なコンテキスト衛生を維持してください。

## 貢献

**小さな修正** — バグ修正、誤字の修正、軽微な改善は PR として直接提出できます。

**大きな変更** — 新機能、大幅なリファクタリング、アーキテクチャの変更については、実装が始まる前に意図と目標を合わせるため、まず OpenSpec 変更提案を提出してください。

提案を作成する際は、OpenSpec の理念を念頭に置いてください。私たちは、異なるコーディングエージェント、モデル、ユースケースにわたる幅広いユーザーにサービスを提供しています。変更は誰にとってもうまく機能するべきです。

**AI 生成コード歓迎** — テストと検証が行われている限り。AI 生成コードを含む PR には、使用したコーディングエージェントとモデルを記載してください（例："Generated with Claude Code using claude-opus-4-5-20251101"）。

### 開発

- 依存関係のインストール: `pnpm install`
- ビルド: `pnpm run build`
- テスト: `pnpm test`
- CLI のローカル開発: `pnpm run dev` または `pnpm run dev:cli`
- 従来のコミット（1 行）: `type(scope): subject`

## その他

<details>
<summary><strong>テレメトリー</strong></summary>

OpenSpec は匿名の使用統計を収集します。

使用パターンを理解するために、コマンド名とバージョンのみを収集します。引数、パス、コンテンツ、PII は収集しません。CI では自動的に無効になります。

**オプトアウト:** `export OPENSPEC_TELEMETRY=0` または `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>メンテナーとアドバイザー</strong></summary>

プロジェクトの指導に貢献するコアメンテナーとアドバイザーの一覧は [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) を参照してください。

</details>



## ライセンス

MIT