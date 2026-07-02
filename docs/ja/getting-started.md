# Getting Started

このガイドでは、OpenSpecをインストールし初期化した後、それがどのように機能するかを説明します。インストール手順については、[main README](../index.md#quick-start) または [Installation guide](installation.md) を参照してください。ドキュメントセット全体が初めての方へは、[documentation home](index.md) がすべてをまとめたものとなります。

> **これらのコマンドはどこに入力するのですか？** 2つの場所があり、これらを混同することが最も一般的な初期のつまずきポイントです。
>
> - `openspec ...` コマンド（例：`openspec init`）は**ターミナル**で実行します。
> - `/opsx:...` コマンド（例：`/opsx:propose`）は**AIアシスタントのチャット**で実行します。これは、コードを記述するように依頼するのと同じボックスです。
>
> 開始するための独立した「対話モード」はありません。単にチャットでスラッシュコマンドを入力すれば、アシスタントがそこから対応します。詳細な説明は [How Commands Work](how-commands-work.md) を参照してください。

## Your First Five Minutes

各ステップがどこで行われるかを示した、全体のフローです：

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

セットアップに必要な2つのターミナルステップの後、あなたはチャット内で作業を進めます。このガイドの残りの部分は、各ステップが何をするのか、そして何が表示されるのかを詳しく解説します。

> **まだ何を構築すべきか決めていませんか？ `/opsx:explore` から始めてください。** これは、コードベースを読み込み、選択肢を評価し、アーティファクトやコードが存在する前に曖昧なアイデアを具体的な計画に研ぎ澄ます、リスクのない思考パートナーです。ビジョンが明確になったら、`/opsx:propose` に引き継ぎます。これは、そうでなければAIが自信満々に間違ったものを構築してしまうためにも、最も優れた習慣です。 [Explore guide](explore.md) を参照してください。

## How It Works

OpenSpecは、コードが書かれる前に、あなたとあなたのAIコーディングアシスタントが何を構築すべきかについて合意するのを助けます。

**標準のクイックパス（coreプロファイル）：**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

何をすべきか検討している場合は `/opsx:explore` から始め、すでに知っている場合は `/opsx:propose` に直接ジャンプしてください。Exploreはデフォルトプロファイルに含まれているため、必要とする時に常に利用可能です。

**拡張パス（カスタムワークフロー選択）：**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

デフォルトのグローバルプロファイルは `core` であり、これには `propose`、`explore`、`apply`、`sync`、および `archive` が含まれます。拡張ワークフローコマンドを有効にするには `openspec config profile` を使用し、その後 `openspec update` を実行してください。

## What OpenSpec Creates

`openspec init` を実行した後、プロジェクトは次のような構造になります：

```
openspec/
├── specs/              # 真実の源泉（システムの動作）
│   └── <domain>/
│       └── spec.md
├── changes/            # 提案中の更新（変更ごとのフォルダ）
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs（何が変化しているか）
│           └── <domain>/
│               └── spec.md
└── config.yaml         # プロジェクト設定（オプション）
```

**2つの重要なディレクトリ：**

- **`specs/`**: 真実の源泉です。これらの仕様書は、システムが現在どのように動作しているかを記述します。ドメインごとに整理されています（例：`specs/auth/`、`specs/payments/`）。

- **`changes/`**: 提案中の変更です。各変更には、関連するすべてのアーティファクトを含む独自のフォルダが割り当てられます。変更が完了すると、その仕様書はメインの `specs/` ディレクトリにマージされます。

## Understanding Artifacts

各変更フォルダには、作業を導くためのアーティファクトが含まれています：

| Artifact | Purpose |
|----------|---------|
| `proposal.md` | 「なぜ」と「何を」— 意図、スコープ、アプローチを記録します |
| `specs/` | ADDED/MODIFIED/REMOVEDの要件を示すDelta specs |
| `design.md` | 「どのように」— 技術的なアプローチとアーキテクチャ上の決定事項 |
| `tasks.md` | チェックボックス付きの実装チェックリスト |

**Artifactsは相互に依存しています：**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

実装中にさらに学ぶことで、以前のアーティファクトをいつでも見直し、洗練させることができます。

## How Delta Specs Work

Delta specsはOpenSpecにおける重要な概念です。これらは現在の仕様書に対する変更点を表示します。

### The Format

Delta specsでは、セクションを使用して変更の種類を示します：

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

### What Happens on Archive

変更をアーカイブするとき：

1. **ADDED** の要件はメインの仕様書に追加されます。
2. **MODIFIED** の要件は既存のバージョンに置き換えられます。
3. **REMOVED** の要件はメインの仕様書から削除されます。

変更フォルダは、監査履歴のために `openspec/changes/archive/` に移動します。

## Example: Your First Change

アプリケーションにダークモードを追加するプロセスを追ってみましょう。

### 1. Start the Change (Default)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

拡張ワークフロープロファイルを有効にしている場合は、2つのステップとして実行することもできます：`/opsx:new` の後 `/opsx:ff`（またはインクリメンタルな `/opsx:continue`）。

### 2. What Gets Created

**proposal.md** - 意図を記録します：

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

**specs/ui/spec.md** - 新しい要件を示すDelta：

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

### 3. Implement

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

実装中にデザインの調整が必要だと気づいた場合は、アーティファクトを更新して作業を続行するだけで構いません。

### 4. Archive

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

あなたのDelta specsは、システムの動作を文書化するメインの仕様書の一部となります。

## Verifying and Reviewing

CLIを使用して変更を確認します：

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## Next Steps

- [Explore First](explore.md) - `/opsx:explore` を使用して、コミットする前にアイデアを検討します
- [Using OpenSpec in an Existing Project](existing-projects.md) - 大規模な既存のコードベース（brownfield codebase）で開始する方法
- [Editing & Iterating on a Change](editing-changes.md) - アーティファクトの更新、後戻り、手動編集の調整方法
- [Core Concepts at a Glance](overview.md) - すべてのメンタルモデルを1ページにまとめたもの
- [Examples & Recipes](examples.md) - 実例とレシピ：最初から最後まで
- [Workflows](workflows.md) - 一般的なパターンと各コマンドの使用タイミング
- [Commands](commands.md) - すべてのスラッシュコマンドの完全リファレンス
- [Concepts](concepts.md) - specs、changes、schemasに関するより深い理解
- [Customization](customization.md) - OpenSpecを自分のやり方に合わせる方法
- [Stores](stores-beta/user-guide.md) - 複数のリポジトリやチームにまたがる計画は？独自のリポジトリ（ベータ版）で管理します
- [FAQ](faq.md) および [Troubleshooting](troubleshooting.md) - 問題が発生した場合