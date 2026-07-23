# はじめに

このガイドでは、OpenSpec をインストールして初期化した後の動作について説明します。インストール手順については、[メイン README](../index.md#quick-start) または[インストールガイド](installation.md)を参照してください。ドキュメント全体に不慣れな場合は、[ドキュメントホーム](index.md)で全体像を確認できます。

> **コマンドはどこに入力すればよいですか？** 2つの場所があり、これらを混同することが初心者にとって最も多いつまずきの原因です。
>
> - `openspec ...` コマンド（`openspec init` など）は**ターミナル**で実行します。
> - `/opsx:...` コマンド（`/opsx:propose` など）は**AI アシスタントのチャット**、つまりコードを書くように依頼するのと同じボックス内で実行します。
>
> 別途「インタラクティブモード」を開始する必要はありません。チャットにスラッシュコマンドを入力するだけで、アシスタントが後続の処理を引き受けます。詳細な説明：[コマンドの仕組み](how-commands-work.md)。

## 最初の5分間

各ステップが発生する場所とともに、全体の流れを示します：

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

セットアップに必要なターミナルステップは2つだけです。その後はチャット上で作業を進めます。このガイドの残りの部分では、各ステップの内容と表示されるものを詳しく説明します。

> **まだ何を作るか決まっていませんか？`/opsx:explore` から始めましょう。** これはリスクのない思考パートナーであり、アーティファクトやコードが存在する前に、コードベースを読み込み、選択肢を検討し、曖昧なアイデアを具体的な計画に磨き上げます。構想が固まったら `/opsx:propose` に引き継ぎます。これは、AI が誤ったものを自信満々に構築してしまうのを防ぐための最も効果的な習慣です。[Explore ガイド](explore.md)を参照してください。

## 仕組み

OpenSpec は、コードが書かれる前に、あなたと AI コーディングアシスタントの間で「何を作るか」について合意することを支援します。

**デフォルトのクイックパス（コアプロファイル）：**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

何を作るか検討中は `/opsx:explore` から始め、すでに決まっている場合は `/opsx:propose` に直接ジャンプしてください。Explore はデフォルトプロファイルに含まれているため、必要に応じて常に利用可能です。

**拡張パス（カスタムワークフロー選択）：**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

デフォルトのグローバルプロファイルは `core` で、`propose`、`explore`、`apply`、`sync`、`archive` が含まれます。`openspec config profile` と `openspec update` を使用することで、拡張ワークフローコマンドを有効にできます。

## OpenSpec が作成するもの

`openspec init` を実行した後、プロジェクトは以下の構造になります：

```
openspec/
├── specs/              # 信頼の源泉（システムの動作仕様）
│   └── <domain>/
│       └── spec.md
├── changes/            # 提案された更新（変更ごとに1つのフォルダ）
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # デルタ仕様（変更内容）
│           └── <domain>/
│               └── spec.md
└── config.yaml         # プロジェクト設定（オプション）
```

**2つの重要なディレクトリ：**

- **`specs/`** - 信頼の源泉。これらの仕様は、システムが現在どのように動作するかを記述します。ドメインごとに整理されます（例：`specs/auth/`、`specs/payments/`）。

- **`changes/`** - 提案された変更。各変更には関連するすべてのアーティファクトを含む独自のフォルダがあります。変更が完了すると、その仕様はメインの `specs/` ディレクトリにマージされます。

## アーティファクトの理解

各変更フォルダには、作業をガイドするアーティファクトが含まれます：

| アーティファクト | 目的 |
|----------|---------|
| `proposal.md` | 「なぜ」と「何」- 意図、スコープ、アプローチを記録 |
| `specs/` | 追加/変更/削除された要件を示すデルタ仕様 |
| `design.md` | 「どうやって」- 技術的アプローチとアーキテクチャ上の決定 |
| `tasks.md` | チェックボックス付き実装チェックリスト |

**アーティファクトは相互に連携しています：**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

実装中に新しいことが分かった場合、いつでも以前のアーティファクトに戻って改良できます。

## デルタ仕様の仕組み

デルタ仕様は OpenSpec の重要な概念です。現在の仕様との差分で「何が変更されるか」を示します。

### フォーマット

デルタ仕様は、変更の種類を示すセクションを使用します：

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### アーカイブ時の処理

変更をアーカイブすると：

1. **ADDED** の要件はメイン仕様に追加されます
2. **MODIFIED** の要件は既存のバージョンを置き換えます
3. **REMOVED** の要件はメイン仕様から削除されます

変更フォルダは監査履歴のために `openspec/changes/archive/` に移動されます。

## 例：最初の変更

アプリケーションにダークモードを追加する手順を説明します。

### 1. 変更を開始する（デフォルト）

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

拡張ワークフロープロファイルを有効にしている場合は、2つのステップに分けて実行することもできます：`/opsx:new` の後に `/opsx:ff`（または段階的に `/opsx:continue`）。

### 2. 作成されるもの

**proposal.md** - 意図を記録：

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - 新規要件を示すデルタ：

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - 実装チェックリスト：

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. 実装

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

実装中に設計の調整が必要だと判明した場合は、アーティファクトを更新して続行してください。

### 4. アーカイブ

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

デルタ仕様はメイン仕様の一部となり、システムの動作が文書化されます。

## 確認とレビュー

CLI を使用して変更状況を確認できます：

```bash
# アクティブな変更を一覧表示
openspec list

# 変更の詳細を表示
openspec show add-dark-mode

# 仕様フォーマットを検証
openspec validate add-dark-mode

# インタラクティブダッシュボード
openspec view
```

## 次のステップ

- [まずは Explore から](explore.md) - コミットする前にアイデアを整理するために `/opsx:explore` を使用
- [変更のレビュー](reviewing-changes.md) - コードが書かれる前に、AI が作成した計画で確認すべき点
- [優れた仕様の書き方](writing-specs.md) - 強固な要件とシナリオの例
- [既存プロジェクトでの OpenSpec 利用](existing-projects.md) - 大規模なレガシーコードベースでの開始方法
- [変更の編集と反復](editing-changes.md) - アーティファクトの更新、戻る、手動編集の調整
- [コアコンセプト一覧](overview.md) - 1ページにまとまった全体像
- [例とレシピ](examples.md) - 実際の変更例、最初から最後まで
- [ワークフロー](workflows.md) - 一般的なパターンと各コマンドの使用タイミング
- [コマンド](commands.md) - すべてのスラッシュコマンドの完全なリファレンス
- [コンセプト](concepts.md) - 仕様、変更、スキーマのより深い理解
- [カスタマイズ](customization.md) - OpenSpec を自分好みに調整
- [ストア](stores-beta/user-guide.md) - 複数のリポジトリやチームにまたがる計画？別リポジトリに保管（ベータ）
- [FAQ](faq.md) と[トラブルシューティング](troubleshooting.md) - 行き詰まったときに