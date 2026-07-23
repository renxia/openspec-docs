# 概念

このガイドでは、OpenSpecの核となるアイデアとそれらの関係について説明します。実践的な使用方法については、[Getting Started](getting-started.md) と [Workflows](workflows.md) を参照してください。

## 設計思想

OpenSpecは4つの原則を基盤として構築されています：

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### なぜこれらの原則が重要なのか

**Fluid not rigid.** 従来の仕様システムでは、フェーズに縛られます：まず計画を立て、次に実装し、そして完了です。OpenSpecはより柔軟です — あなたの作業に合わせて、任意の順序で成果物を作成できます。

**Iterative not waterfall.** 要件は変化します。理解は深まります。最初は良いアプローチだと思えたことが、コードベースを見た後では通用しないかもしれません。OpenSpecはこの現実を受け入れます。

**Easy not complex.** 一部の仕様フレームワークは、広範なセットアップ、硬直したフォーマット、または重厚なプロセスを必要とします。OpenSpecはあなたの邪魔をしません。数秒で初期化し、すぐに作業を開始し、必要に応じてのみカスタマイズできます。

**Brownfield-first.** ほとんどのソフトウェア作業は、一から構築するのではなく、既存システムを修正することです。OpenSpecのデルタベースのアプローチにより、新規システムの説明だけでなく、既存の動作への変更を簡単に指定できます。

## 全体像

OpenSpecは、作業を2つの主要な領域に整理します：

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs（仕様書）**は信頼できる情報源であり、システムが現在どのように動作するかを記述します。

**Changes（変更）**は提案された修正であり、マージする準備ができるまで別々のフォルダに保存されます。

この分離が重要です。競合することなく複数の変更を並行して作業できます。メインの仕様書に影響する前に変更をレビューできます。また、変更をアーカイブすると、その差分（delta）は信頼できる情報源にクリーンにマージされます。

## 仕様書（Specs）

仕様書は、構造化された要件とシナリオを使用してシステムの動作を記述します。

### 構造

```
openspec/specs/
├── auth/
│   └── spec.md           # 認証動作
├── payments/
│   └── spec.md           # 決済処理
├── notifications/
│   └── spec.md           # 通知システム
└── ui/
    └── spec.md           # UI動作とテーマ
```

ドメイン別に仕様書を整理します。システムにとって意味のある論理的なグループ化です。一般的なパターン：

- **機能領域別**：`auth/`、`payments/`、`search/`
- **コンポーネント別**：`api/`、`frontend/`、`workers/`
- **境界づけられたコンテキスト別**：`ordering/`、`fulfillment/`、`inventory/`

### 仕様書のフォーマット

仕様書には要件が含まれ、各要件にはシナリオがあります：

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**主要な要素：**

| 要素 | 目的 |
|---------|---------|
| `## Purpose` | この仕様書のドメインの高レベルの説明 |
| `### Requirement:` | システムが持つべき特定の動作 |
| `#### Scenario:` | 要件が実際に動作する具体例 |
| SHALL/MUST/SHOULD | 要件の強度を示すRFC 2119キーワード |

### このように仕様書を構造化する理由

**要件は「何を」** — 実装を指定せずにシステムが何をすべきかを記述します。

**シナリオは「いつ」** — 検証可能な具体例を提供します。良いシナリオ：
- テスト可能である（自動テストを作成できる）
- 正常系とエッジケースの両方をカバーする
- Given/When/Thenまたは類似の構造化フォーマットを使用する

**RFC 2119キーワード**（SHALL、MUST、SHOULD、MAY）は意図を伝えます：
- **MUST/SHALL** — 絶対的な要件
- **SHOULD** — 推奨されるが、例外が存在する
- **MAY** — 任意

### 仕様書の定義（および非定義）

仕様書は**動作契約**であり、実装計画ではありません。

良い仕様書の内容：
- ユーザーまたは下流システムが依存する観測可能な動作
- 入力、出力、エラー条件
- 外部制約（セキュリティ、プライバシー、信頼性、互換性）
- テストまたは明示的に検証できるシナリオ

仕様書で避けるべきもの：
- 内部のクラス/関数名
- ライブラリまたはフレームワークの選択
- 段階的な実装詳細
- 詳細な実行計画（それらは`design.md`または`tasks.md`に属する）

簡単なテスト：
- 実装を変更しても外部から見える動作が変わらない場合、それはおそらく仕様書に属するべきではありません。

### 軽量に保つ：段階的な厳密性

OpenSpecは官僚主義を回避することを目的としています。変更を検証可能にする最も軽量なレベルを使用してください。

**ライト仕様書（デフォルト）：**
- 動作優先の短い要件
- 明確な範囲と非目標
- いくつかの具体的な受け入れチェック

**完全な仕様書（リスクが高い場合）：**
- チーム間またはリポジトリ間の変更
- API/コントラクトの変更、移行、セキュリティ/プライバシーの懸念
- 曖昧さが高価な手戻りを引き起こす可能性のある変更

ほとんどの変更はライトモードのままにすべきです。

### 人間とエージェントのコラボレーション

多くのチームでは、人間が探索し、エージェントが成果物の草案を作成します。意図されたループは以下の通りです：

1. 人間が意図、コンテキスト、制約を提供します。
2. エージェントはこれを動作優先の要件とシナリオに変換します。
3. エージェントは実装詳細を`spec.md`ではなく`design.md`と`tasks.md`に保持します。
4. 実装前に検証が構造と明確さを確認します。

これにより、仕様書は人間にとって読みやすく、エージェントにとって一貫性が保たれます。

## 変更（Changes）

変更とは、システムへの提案された修正であり、理解と実装に必要なすべてを含むフォルダとしてパッケージ化されています。

### 変更の構造

```
openspec/changes/add-dark-mode/
├── proposal.md           # 理由と内容
├── design.md             # 方法（技術的アプローチ）
├── tasks.md              # 実装チェックリスト
├── .openspec.yaml        # 変更メタデータ（オプション）：スキーマ、作成日、skip_specs
└── specs/                # 差分仕様書
    └── ui/
        └── spec.md       # ui/spec.mdで変更される内容
```

各変更は自己完結しています。以下を含みます：
- **成果物（Artifacts）** — 意図、設計、タスクを捉えた文書
- **差分仕様書（Delta specs）** — 追加、修正、または削除されるものの仕様
- **メタデータ** — この特定の変更のためのオプションの設定

### 変更がフォルダである理由

変更をフォルダとしてパッケージ化することにはいくつかの利点があります：

1. **すべてが一緒に。** 提案、設計、タスク、仕様書が1つの場所にあります。異なる場所を探し回る必要はありません。

2. **並列作業。** 複数の変更が競合することなく同時に存在できます。`fix-auth-bug`も進行中である間に`add-dark-mode`で作業できます。

3. **クリーンな履歴。** アーカイブすると、変更は完全なコンテキストを保持したまま`changes/archive/`に移動します。何が変更されたかだけでなく、なぜ変更されたかを理解するために振り返ることができます。

4. **レビューに適している。** 変更フォルダはレビューが簡単です — 開いて、提案を読み、設計を確認し、仕様書の差分（delta）を見ます。

## 成果物（Artifacts）

成果物とは、変更内にあり、作業をガイドする文書です。

### 成果物のフロー

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

成果物は相互に構築されます。各成果物は次のものにコンテキストを提供します。

### 成果物の種類

#### 提案（`proposal.md`）

提案は、高レベルで**意図**、**範囲**、**アプローチ**を捉えます。

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**提案を更新するタイミング：**
- 範囲の変更（縮小または拡大）
- 意図の明確化（問題のより良い理解）
- アプローチの根本的な変更

#### 仕様書（`specs/`内の差分仕様書）

差分仕様書は、現在の仕様書と比較して**何が変更されているか**を記述します。以下の[差分仕様書](#delta_specs)を参照してください。

#### 設計（`design.md`）

設計は**技術的アプローチ**と**アーキテクチャの決定**を捉えます。

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**設計を更新するタイミング：**
- 実装によりアプローチが機能しないことが判明した場合
- より良い解決策が見つかった場合
- 依存関係または制約が変更された場合

#### タスク（`tasks.md`）

タスクは**実装チェックリスト**です。チェックボックス付きの具体的な手順です。

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**タスクのベストプラクティス：**
- 関連するタスクを見出しの下にグループ化する
- 階層的な番号付けを使用する（1.1、1.2など）
- 1回のセッションで完了できる程度にタスクを小さく保つ
- タスクを完了したらチェックを入れる

## 差分仕様書（Delta Specs）

差分仕様書は、OpenSpecをブラウンフィールド開発で機能させるための重要な概念です。仕様書全体を再記述するのではなく、**何が変更されているか**を記述します。

### フォーマット

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### 差分セクション

| セクション | 意味 | アーカイブ時に何が起こるか |
|---------|---------|------------------------|
| `## ADDED Requirements` | 新しい動作 | メインの仕様書に追加される |
| `## MODIFIED Requirements` | 変更された動作 | 既存の要件を置き換える |
| `## REMOVED Requirements` | 非推奨の動作 | メインの仕様書から削除される |

### 完全な仕様書の代わりに差分を使用する理由

**明確さ。** 差分は正確に何が変更されているかを示します。完全な仕様書を読む場合、現在のバージョンと mentally diff する必要があります。

**競合回避。** 2つの変更が異なる要件を修正する限り、同じ仕様書ファイルに触れても競合しません。

**レビューの効率化。** レビュアーは変更された内容だけを見ます。変更されていないコンテキストは見ません。重要なものに焦点を当てます。

**ブラウンフィールドへの適合。** ほとんどの作業は既存の動作を修正します。差分は修正を第一級のものにし、後から考えたものにしません。

## スキーマ

スキーマは、ワークフローのアーティファクトタイプとその依存関係を定義します。

### スキーマの仕組み

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # 依存関係なし、最初に作成可能

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # 作成前に提案が必要

  - id: design
    generates: design.md
    requires: [proposal]      # specsと並行して作成可能

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # specsとdesignの両方が先に必要
```

**アーティファクトは依存関係グラフを形成します：**

```
                    proposal
                   (ルートノード)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**依存関係は「ゲート」ではなく「イネーブラー」です。** 次に何を作成しなければならないかを示すのではなく、何を作成できるかを示します。必要がなければdesignをスキップできます。specsをdesignの前でも後でも作成できます — どちらもproposalにのみ依存しています。

### 組み込みスキーマ

**spec-driven**（デフォルト）

仕様駆動開発の標準ワークフロー：

```
proposal → specs → design → tasks → implement
```

最適な用途：実装前に仕様について合意したいほとんどの機能作業。

### カスタムスキーマ

チームのワークフローに合わせたカスタムスキーマを作成：

```bash
# 新規作成
openspec schema init research-first

# または既存のものをフォーク
openspec schema fork spec-driven research-first
```

**カスタムスキーマの例：**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # 最初にリサーチを行う

  - id: proposal
    generates: proposal.md
    requires: [research]   # リサーチを基にした提案

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # specs/designをスキップし、直接タスクへ
```

カスタムスキーマの作成と使用の詳細については、[Customization](customization.md)を参照してください。

## アーカイブ

アーカイブは、変更のデルタ仕様をメインの仕様にマージし、変更を履歴として保存することで、変更を完了させます。

### アーカイブ時の処理

```
アーカイブ前：

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


アーカイブ後：

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # 2FAの要件が含まれるようになりました
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # 履歴として保存
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### アーカイブプロセス

1. **デルタをマージします。** 各デルタ仕様セクション（ADDED/MODIFIED/REMOVED）が対応するメイン仕様に適用されます。

2. **アーカイブに移動します。** 変更フォルダは、時系列順に並べるための日付プレフィックス付きで`changes/archive/`に移動します。

3. **コンテキストを保持します。** すべてのアーティファクトはアーカイブ内に完全に保持されます。変更が行われた理由を常に確認できます。

### アーカイブが重要な理由

**クリーンな状態。** アクティブな変更（`changes/`）は作業中のものだけを表示します。完了した作業は片付けられます。

**監査証跡。** アーカイブは、すべての変更の完全なコンテキストを保持します — 変更された内容だけでなく、理由を説明する提案、方法を説明する設計、実行された作業を示すタスクも含まれます。

**仕様の進化。** 仕様は変更がアーカイブされるにつれて有機的に成長します。各アーカイブはデルタをマージし、時間をかけて包括的な仕様を構築します。

## 全体の仕組み

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. 変更開始   │  /opsx:propose (コア) または /opsx:new (拡張)           │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. アーティファクト作成 │  /opsx:ff または /opsx:continue (拡張ワークフロー) │
│   │                │  提案 → specs → design → タスクを作成                  │
│   │                │  （スキーマの依存関係に基づく）                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. タスク実装 │  /opsx:apply                                            │
│   │                │  タスクを実行し、チェックを付ける                       │
│   │                │◄──── 学習に応じてアーティファクトを更新                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. 作業検証   │  /opsx:verify (任意)                                    │
│   │                │  実装が仕様と一致するか確認                             │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. 変更アーカイブ │────►│  デルタ仕様がメイン仕様にマージ           │    │
│   │                │     │  変更フォルダがarchive/に移動               │    │
│   └────────────────┘     │  仕様が更新された信頼できる情報源になる       │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**好循環：**

1. 仕様が現在の動作を記述
2. 変更が修正案を提案（デルタとして）
3. 実装が変更を実現
4. アーカイブがデルタを仕様にマージ
5. 仕様が新しい動作を記述
6. 次の変更が更新された仕様の上に構築

## 用語集

| 用語 | 定義 |
|------|------|
| **アーティファクト** | 変更内のドキュメント（提案、設計、タスク、またはデルタ仕様） |
| **アーカイブ** | 変更を完了し、そのデルタをメイン仕様にマージするプロセス |
| **変更** | システムへの修正案を、アーティファクトを含むフォルダとしてパッケージ化したもの |
| **デルタ仕様** | 現在の仕様に対する変更（ADDED/MODIFIED/REMOVED）を記述する仕様 |
| **ドメイン** | 仕様の論理的なグループ化（例：`auth/`、`payments/`） |
| **要件** | システムが持つべき特定の動作 |
| **シナリオ** | 要件の具体的な例、通常はGiven/When/Then形式 |
| **スキーマ** | アーティファクトタイプとその依存関係の定義 |
| **仕様（Spec）** | システム動作を記述する仕様書で、要件とシナリオを含む |
| **信頼できる情報源（Source of Truth）** | 現在合意された動作を含む`openspec/specs/`ディレクトリ |

## 次のステップ

- [Getting Started](getting-started.md) - 実践的な最初の手順
- [Workflows](workflows.md) - 一般的なパターンとそれぞれの使用タイミング
- [Commands](commands.md) - コマンドの完全なリファレンス
- [Customization](customization.md) - カスタムスキーマの作成とプロジェクトの設定