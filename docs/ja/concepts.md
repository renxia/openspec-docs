# コンセプト

このガイドでは、OpenSpecの核となるアイデアとそれらがどのように連携するかを説明します。実用的な使用方法については、[Getting Started](getting-started.md) および [Workflows](workflows.md) を参照してください。

## 設計思想

OpenSpecは、以下の4つの原則に基づいています:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### これらの原則が重要な理由

**fluid not rigid。** 従来の仕様システムは、フェーズに縛り付けます。つまり、まず計画し、次に実装し、その後完了します。OpenSpecはより柔軟で、作業にとって意味のある順序でアーティファクトを作成できます。

**iterative not waterfall。** 要件は変化します。理解は深まります。当初良さそうに見えたアプローチも、コードベースを見た後では通用しないかもしれません。OpenSpecはこの現実を受け入れています。

**easy not complex。** 一部の仕様フレームワークは、広範なセットアップ、厳格なフォーマット、または重厚なプロセスを必要とします。OpenSpecは邪魔になりません。数秒で初期化し、すぐに作業を開始し、必要な場合のみカスタマイズしてください。

**brownfield-first。** ほとんどのソフトウェア作業はゼロからの構築ではなく、既存システムの修正です。OpenSpecのデルタベースのアプローチにより、新しいシステムを記述するだけでなく、既存の動作への変更を指定することが容易になります。

## 全体像

OpenSpecは、あなたの作業を2つの主要な領域に整理します。

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

**Specs** は真実の源泉（source of truth）であり、システムが現在どのように動作しているかを記述します。

**Changes** は提案された変更であり、マージする準備ができるまで個別のフォルダ内に存在します。

この分離が鍵となります。これにより、競合することなく複数の変更を並行して作業できます。また、メインのspecsに影響を与える前に変更内容を確認することができます。そして、変更をアーカイブするとき、その差分（deltas）は真実の源泉にきれいにマージされます。

## Specs

Specsは、構造化された要件とシナリオを使用してシステムの動作を記述します。

### 構成

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior（認証の動作）
├── payments/
│   └── spec.md           # Payment processing（支払い処理）
├── notifications/
│   └── spec.md           # Notification system（通知システム）
└── ui/
    └── spec.md           # UI behavior and themes（UIの動作とテーマ）
```

Specsは、システムの論理的なグループ分けとなるドメインごとに整理します。一般的なパターンは以下の通りです。

- **機能領域ごと**: `auth/`、`payments/`、`search/`
- **コンポーネントごと**: `api/`、`frontend/`、`workers/`
- **境界づけられたコンテキスト（Bounded Context）ごと**: `ordering/`、`fulfillment/`、`inventory/`

### Specの形式

Specには要件が含まれ、各要件にはシナリオがあります。

```markdown
# Auth Specification（認証仕様）

## Purpose (目的)
アプリケーションの認証とセッション管理について。

## Requirements (要件)

### Requirement: User Authentication（ユーザー認証）
システムは、ログインが成功した場合にJWTトークンを発行しなければならない（SHALL）。

#### Scenario: Valid credentials（有効な資格情報）
- GIVEN a user with valid credentials（前提：有効な資格情報を持つユーザーがいる）
- WHEN the user submits login form（実行：ユーザーがログインフォームを送信する）
- THEN a JWT token is returned（結果：JWTトークンが返される）
- AND the user is redirected to dashboard（かつ、ユーザーはダッシュボードにリダイレクトされる）

#### Scenario: Invalid credentials（無効な資格情報）
- GIVEN invalid credentials（前提：無効な資格情報がある）
- WHEN the user submits login form（実行：ユーザーがログインフォームを送信する）
- THEN an error message is displayed（結果：エラーメッセージが表示される）
- AND no token is issued（かつ、トークンは発行されない）

### Requirement: Session Expiration（セッションの期限切れ）
システムは、30分間の非アクティブ状態の後でセッションを失効させなければならない（MUST）。

#### Scenario: Idle timeout（アイドルタイムアウト）
- GIVEN an authenticated session（前提：認証済みのセッションがある）
- WHEN 30 minutes pass without activity（実行：活動なしに30分が経過する）
- THEN the session is invalidated（結果：セッションが無効化される）
- AND the user must re-authenticate（かつ、ユーザーは再認証しなければならない）
```

**主な要素:**

| 要素 | 目的 |
|---------|---------|
| `## Purpose` | このSpecのドメインに関するハイレベルな説明 |
| `### Requirement:` | システムが持つべき特定の動作 |
| `#### Scenario:` | 要件を具体的に実行した例 |
| SHALL/MUST/SHOULD | 要件の強度を示すRFC 2119キーワード |

### なぜこのような構造でSpecsを書くのか

**要件（Requirements）は「何をすべきか (what)」** — 実装方法を指定することなく、システムが何をするべきかを記述します。

**シナリオ（Scenarios）は「いつ（どのような状況で）」** — 検証できる具体的な例を提供します。良いシナリオとは：
- テスト可能であること（自動テストを記述できること）
- ハッピーパスとエッジケースの両方をカバーしていること
- Given/When/Thenのような構造化された形式を使用していること

**RFC 2119キーワード** (SHALL, MUST, SHOULD, MAY) は意図を伝達します：
- **MUST/SHALL** — 絶対的な要件
- **SHOULD** — 推奨されるが、例外が存在する可能性あり
- **MAY** — オプション

### Specとは何か（そして何ではないか）

Specは実装計画ではなく、**動作契約（behavior contract）** です。

良いSpecの内容:
- ユーザーやダウンストリームシステムが依存する観察可能な動作
- 入力、出力、エラー条件
- 外部制約（セキュリティ、プライバシー、信頼性、互換性）
- テストまたは明示的に検証できるシナリオ

Specで避けるべきこと:
- 内部のクラス/関数名
- ライブラリやフレームワークの選択
- ステップバイステップの実装詳細
- 詳細な実行計画（これらは`design.md`や`tasks.md`に属します）

簡単なテスト：
- もし実装が変わっても外部に見える動作が変わらなければ、それはSpecには含まれない可能性が高いです。

### 軽量化の維持：段階的な厳密性 (Progressive Rigor)

OpenSpecは官僚主義を避けることを目指しています。変更が検証可能であるために必要な最も軽いレベルを使用してください。

**Lite spec（デフォルト）:**
- 短く、動作優先の要件
- 明確なスコープと非目標（non-goals）
- いくつかの具体的な受け入れチェック

**Full spec（高リスクの場合）:**
- チーム間またはリポジトリをまたぐ変更
- API/契約の変更、マイグレーション、セキュリティ/プライバシーに関する懸念事項
- 曖昧さが高価な手戻りを引き起こす可能性のある変更

ほとんどの変更はLiteモードで留めるべきです。

### 人間とエージェントのコラボレーション

多くのチームでは、人間がアイデアを練り、エージェントが成果物（artifacts）を作成します。意図されたフローは以下の通りです：

1. 人間が意図、コンテキスト、制約を提供する。
2. エージェントがこれを動作優先の要件とシナリオに変換する。
3. エージェントは実装の詳細を`design.md`や`tasks.md`に保持し、`spec.md`には含めない。
4. 検証によって、実装前に構造と明確さが確認される。

これにより、Specが人間にとって読みやすく、エージェントにとって一貫性のあるものになります。

## Changes

Changeはシステムに対する提案された変更であり、それを理解し実装するために必要なすべてのものが含まれたフォルダとしてパッケージ化されます。

### Changeの構成

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what（理由と内容）
├── design.md             # How (technical approach)（方法（技術的アプローチ））
├── tasks.md              # Implementation checklist（実装チェックリスト）
├── .openspec.yaml        # Change metadata (optional)（変更メタデータ（オプション））
└── specs/                # Delta specs（差分Spec）
    └── ui/
        └── spec.md       # What's changing in ui/spec.md（ui/spec.mdで何が変わるか）
```

各Changeは自己完結的です。以下の要素を持ちます：
- **Artifacts** — 意図、設計、タスクを捉えるドキュメント
- **Delta specs** — 追加、変更、削除される内容の仕様
- **Metadata** — この特定の変更に関するオプションの設定情報

### なぜChangesがフォルダなのか

Changeをフォルダとしてパッケージ化することにはいくつかの利点があります：

1. **すべてを一箇所に。** 提案、設計、タスク、Specが一つの場所に存在します。色々な場所を探し回る必要がありません。

2. **並行作業。** 複数のChangeが競合することなく同時に存在できます。「`add-dark-mode`」に取り組んでいる間に「`fix-auth-bug`」も進行中である、といったことが可能です。

3. **クリーンな履歴。** アーカイブされる際、Changeは完全なコンテキストを保持したまま`changes/archive/`に移動します。何が変わったかだけでなく、なぜ変わったかを振り返って理解することができます。

4. **レビューしやすい。** Changeフォルダはレビューが容易です。開いて、提案を読み、設計を確認し、Specの差分を見るだけで済みます。

## Artifacts

Artifactsは、作業を導くChange内のドキュメントです。

### Artifactの流れ

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artifactsは互いに積み重ねられています。各Artifactは次のものに対するコンテキストを提供します。

### Artifactの種類

#### Proposal (`proposal.md`)

Proposalは、高レベルでの**意図（intent）**、**スコープ（scope）**、および**アプローチ（approach）**を捉えます。

```markdown
# Proposal: Add Dark Mode（提案：ダークモードの追加）

## Intent (意図)
ユーザーからの要望として、夜間の使用における目の負担軽減とシステム設定との一致のため、ダークモードオプションを提供すること。

## Scope (スコープ)
対象範囲内:
- 設定画面でのテーマ切り替え
- システム設定の検出
- ユーザー設定をlocalStorageに永続化する

対象外:
- カスタムカラーテーマ（今後の作業）
- ページごとのテーマ上書き

## Approach (アプローチ)
状態管理のためのReactコンテキストとCSSカスタムプロパティを使用してテーマ付けを行う。初回ロード時にシステム設定を検出し、手動での上書きを許可する。
```

**Proposalを更新すべきタイミング:**
- スコープの変更（絞り込みまたは拡大）
- 意図の明確化（問題に対するより良い理解）
- アプローチの根本的なシフト

#### Specs (delta specs in `specs/`)

Delta specsは、現在のSpecに対する**何が変わっているか**を記述します。後述の[Delta Specs](#delta-specs)を参照してください。

#### Design (`design.md`)

Designは**技術的アプローチ**と**アーキテクチャ上の決定事項**を捉えます。

````markdown
# Design: Add Dark Mode（設計：ダークモードの追加）

## Technical Approach (技術的アプローチ)
プロパティドリリングを避けるため、React Contextを通じてテーマの状態を管理する。CSSカスタムプロパティにより、クラス切り替えなしでランタイムでの切り替えを可能にする。

## Architecture Decisions (アーキテクチャ上の決定事項)

### Decision: Context over Redux（ReduxではなくContextを使用すること）
理由：
- 単純なバイナリ状態（ライト/ダーク）であるため
- 複雑な状態遷移がないため
- Reduxの依存関係を追加することを避けるため

### Decision: CSS Custom Properties（CSSカスタムプロパティの使用）
理由：
- 既存のスタイルシートと連携するため
- ランタイムオーバーヘッドがないため
- ブラウザネイティブなソリューションであるため

## Data Flow (データフロー)
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes (ファイル変更)
- `src/contexts/ThemeContext.tsx` (新規)
- `src/components/ThemeToggle.tsx` (新規)
- `src/styles/globals.css` (修正)
````

**Designを更新すべきタイミング:**
- 実装によりアプローチが機能しないことが判明したとき
- より良いソリューションを発見したとき
- 依存関係や制約が変更されたとき

#### Tasks (`tasks.md`)

Tasksは**実装チェックリスト**であり、チェックボックス付きの具体的なステップです。

```markdown
# Tasks (タスク)

## 1. Theme Infrastructure（テーマ基盤）
- [ ] 1.1 Create ThemeContext with light/dark state（ライト/ダーク状態を持つThemeContextを作成する）
- [ ] 1.2 Add CSS custom properties for colors（色のためのCSSカスタムプロパティを追加する）
- [ ] 1.3 Implement localStorage persistence（localStorageへの永続化を実装する）
- [ ] 1.4 Add system preference detection（システム設定の検出を追加する）

## 2. UI Components（UIコンポーネント）
- [ ] 2.1 Create ThemeToggle component（ThemeToggleコンポーネントを作成する）
- [ ] 2.2 Add toggle to settings page（設定ページにトグルを追加する）
- [ ] 2.3 Update Header to include quick toggle（クイックトグルを含めるためにヘッダーを更新する）

## 3. Styling（スタイリング）
- [ ] 3.1 Define dark theme color palette（ダークテーマのカラーパレットを定義する）
- [ ] 3.2 Update components to use CSS variables（CSS変数を使用するようにコンポーネントを更新する）
- [ ] 3.3 Test contrast ratios for accessibility（アクセシビリティのためのコントラスト比率をテストする）
```

**タスクのベストプラクティス:**
- 関連するタスクをヘッダーの下にグループ化する
- 階層的な番号付けを使用する（1.1, 1.2など）
- 一つのセッションで完了できる程度の小さなタスクに保つ
- 完了したタスクはチェックを入れる

## Delta Specs (差分Spec)

Delta specsは、OpenSpecがブラウンフィールド開発（既存のシステムへの変更）に対応するための鍵となる概念です。これは、全体のSpecを再記述するのではなく、**何が変わっているか**を記述します。

### 形式

```markdown
# Delta for Auth（認証の差分）

## ADDED Requirements (追加された要件)

### Requirement: Two-Factor Authentication（二要素認証）
システムはTOTPベースの二要素認証をサポートしなければならない（MUST）。

#### Scenario: 2FA enrollment（2FA登録）
- GIVEN a user without 2FA enabled（前提：2FAが有効になっていないユーザーがいる）
- WHEN the user enables 2FA in settings（実行：ユーザーが設定で2FAを有効にする）
- THEN a QR code is displayed for authenticator app setup（結果：認証アプリの設定用のQRコードが表示される）
- AND the user must verify with a code before activation（かつ、アクティベーション前にコードで検証しなければならない）

#### Scenario: 2FA login（2FAログイン）
- GIVEN a user with 2FA enabled（前提：2FAが有効になっているユーザーがいる）
- WHEN the user submits valid credentials（実行：ユーザーが有効な資格情報を送信する）
- THEN an OTP challenge is presented（結果：OTPチャレンジが表示される）
- AND login completes only after valid OTP（かつ、有効なOTPの後にのみログインが完了する）

## MODIFIED Requirements (変更された要件)

### Requirement: Session Expiration（セッションの期限切れ）
システムは15分間の非アクティブ状態の後でセッションを失効させなければならない（MUST）。
(以前：30分)

#### Scenario: Idle timeout（アイドルタイムアウト）
- GIVEN an authenticated session（前提：認証済みのセッションがある）
- WHEN 15 minutes pass without activity（実行：活動なしに15分が経過する）
- THEN the session is invalidated（結果：セッションが無効化される）

## REMOVED Requirements (削除された要件)

### Requirement: Remember Me（ログイン状態の記憶）
(2FAに置き換えられました。ユーザーは各セッションで再認証する必要があります。)
```

### Delta Sections (差分セクション)

| Section | Meaning (意味) | What Happens on Archive (アーカイブ時の挙動) |
|---------|---------|------------------------|
| `## ADDED Requirements` | 新しい動作 | メインSpecに追加される |
| `## MODIFIED Requirements` | 変更された動作 | 既存の要件を置き換える |
| `## REMOVED Requirements` | 非推奨（廃止）となった動作 | メインSpecから削除される |

### なぜフルSpecではなくDeltaを使うのか

**明確性。** Deltaは正確に何が変わっているかを示します。フルSpecを読む場合、現在のバージョンと比較して頭の中で差分を取る必要があります。

**競合の回避。** 2つのChangeが異なる要件を変更している限り、同じSpecファイルを触っても競合することはありません。

**レビュー効率性。** レビュアーは変更点のみに焦点を当てることができ、変更されていないコンテキストを見る必要がありません。

**ブラウンフィールドへの適合。** ほとんどの作業は既存の動作を修正することです。Deltaは修正を後回しではなく、第一級の要素にします。

## スキーマ

スキーマは、ワークフローにおけるアーティファクトの種類とその依存関係を定義します。

### スキーマの仕組み

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
```

**アーティファクトは依存関係グラフを形成します:**

```
                    proposal
                   (root node)
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

**依存関係はゲートではなくイネーブラー（実現要因）です。** それらは次に何を「しなければならないか」を示すのではなく、何が作成可能であるかを示します。デザインが必要なければスキップできます。スペックとデザインはどちらもproposalにのみ依存するため、順番を問わず作成できます。

### 標準スキーマ

**spec-driven** (デフォルト)

仕様駆動開発のための標準的なワークフローです:

```
proposal → specs → design → tasks → implement
```

最適な用途: 実装前に仕様について合意したいほとんどの機能開発。

### カスタムスキーマ

チームのワークフローに合わせてカスタムスキーマを作成します:

```bash
# ゼロから作成
openspec schema init research-first

# または既存のものをフォークする
openspec schema fork spec-driven research-first
```

**カスタムスキーマの例:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # まずリサーチを行う

  - id: proposal
    generates: proposal.md
    requires: [research]   # リサーチに基づいた提案書を作成

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # スペック/デザインをスキップし、直接タスクへ進む
```

カスタムスキーマの作成と使用に関する詳細については、[Customization](customization.md)を参照してください。

## アーカイブ

アーカイブは、デルタ仕様（delta specs）をメインの仕様にマージし、変更点を履歴として保持することで、変更を完了させます。

### アーカイブする際に何が起こるか

```
アーカイブ前:

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


アーカイブ後:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # これで2FAの要件を含むようになる
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # 履歴のために保持される
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### アーカイブのプロセス

1. **デルタのマージ。** 各デルタ仕様セクション（ADDED/MODIFIED/REMOVED）が対応するメインの仕様に適用されます。
2. **アーカイブへの移動。** 変更フォルダは、時系列順序付けのために日付プレフィックスを付けて `changes/archive/` に移動します。
3. **コンテキストの保持。** すべてのアーティファクトがアーカイブ内にそのまま残ります。いつでもなぜその変更が行われたのかを振り返ることができます。

### なぜアーカイブが重要なのか

**クリーンな状態。** アクティブな変更（`changes/`）には進行中の作業のみが表示されます。完了した作業は整理されて移動します。

**監査証跡。** アーカイブは、単に何が変わったかだけでなく、なぜ変わるのかを説明する提案書、どのように変わるかを説明するデザイン、そして行われた作業を示すタスクという、すべての変更の完全なコンテキストを保持します。

**仕様の進化。** 仕様は、変更がアーカイブされるにつれて有機的に成長します。各アーカイブがデルタをマージし、時間の経過とともに包括的な仕様を構築していきます。

## 全体の流れ

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**好循環:**

1. 仕様は現在の動作を記述する
2. 変更は修正案（デルタとして）を提案する
3. 実装がその変更を現実のものとする
4. アーカイブがデルタを仕様にマージする
5. 仕様は新しい動作を記述するようになる
6. 次の変更は更新された仕様に基づいて構築される

## 用語集

| Term | Definition |
|------|------------|
| **Artifact** | 変更（提案書、デザイン、タスク、またはデルタ仕様）内のドキュメント |
| **Archive** | 変更を完了させ、そのデルタをメインの仕様にマージするプロセス |
| **Change** | アーティファクトを含むフォルダとしてパッケージ化されたシステムへの提案された修正 |
| **Delta spec** | 現在の仕様に対する変更（ADDED/MODIFIED/REMOVED）を記述する仕様 |
| **Domain** | 仕様の論理的なグループ化（例: `auth/`、`payments/`） |
| **Requirement** | システムが満たすべき特定の動作 |
| **Scenario** | 要件の具体的な例。通常はGiven/When/Then形式で記述される |
| **Schema** | アーティファクトの種類とその依存関係の定義 |
| **Spec** | システムの動作を記述する仕様書。要件とシナリオを含む |
| **Source of truth** | 現在合意されている動作を含む `openspec/specs/` ディレクトリ |

## 次のステップ

- [Getting Started](getting-started.md) - 実践的な最初のステップ
- [Workflows](workflows.md) - 一般的なパターンとそれぞれの使用タイミング
- [Commands](commands.md) - 完全なコマンドリファレンス
- [Customization](customization.md) - カスタムスキーマの作成とプロジェクトの設定