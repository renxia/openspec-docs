# コンセプト

このガイドでは、OpenSpec の背後にある核心的なアイデアと、それらがどのように関連しているかを説明します。実際の使用方法については、[Getting Started](getting-started.md) および [Workflows](workflows.md) を参照してください。

## 哲学

OpenSpec は 4 つの原則に基づいて構築されています。

```
固定的ではなく流動的         — フェーズゲートなし、意味のある作業に取り組む
ウォーターフォールではなく反復的 — 作りながら学び、進化させる
複雑ではなく簡単            — 軽量なセットアップ、最小限の手順
ブラウンフィールド優先       — 新規開発だけでなく、既存のコードベースに対応
```

### これらの原則が重要な理由

**固定的ではなく流動的です。** 従来の仕様システムでは、フェーズに縛られます：最初に計画し、次に実装し、そして完了です。OpenSpec はより柔軟です — 作業に意味のある任意の順序で成果物を作成できます。

**ウォーターフォールではなく反復的です。** 要件は変化します。理解は深まります。最初は良い方法に思えたことも、コードベースを実際に見た後では維持できなくなるかもしれません。OpenSpec はこの現実を受容します。

**複雑ではなく簡単です。** 仕様フレームワークの中には、広範なセットアップ、厳格なフォーマット、重いプロセスを必要とするものがあります。OpenSpec は邪魔をしません。数秒で初期化し、すぐに作業を開始でき、必要な場合にのみカスタマイズします。

**ブラウンフィールド優先です。** ほとんどのソフトウェア開発は、ゼロからの構築ではなく、既存システムの修正です。OpenSpec のデルタベースのアプローチにより、新しいシステムを説明するだけでなく、既存の動作への変更を容易に指定できます。

## 全体像

OpenSpecは、作業を2つの主要な領域に整理します。

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

**Specs** は情報源です。システムの現在の振る舞いを記述します。

**Changes** は提案された変更です。マージする準備が整うまで、別のフォルダ内に置かれます。

この分離が重要です。競合なく複数の変更を並行して作業できます。メインの仕様に影響を与える前に変更をレビューでき、変更をアーカイブすると、そのデルタが情報源にきれいにマージされます。

## 協調ワークスペース

ワークスペースサポートはベータ版です。以下のローカル表示モデルは現在の方向性ですが、外部の自動化、統合、長期間のワークフローは、コマンドの動作、状態ファイル、およびJSON出力を進化するものとして扱う必要があります。

以下のコマンドは、リンクされたリポジトリまたはフォルダにローカル表示を開くための最初のセットアップフローを提供します。

リポジトリローカルなOpenSpecプロジェクトは、1つのリポジトリが計画、実装、およびアーカイブフローを所有する場合に適切なデフォルトです。一部の作業は複数のリポジトリやフォルダにまたがります。その場合、OpenSpec協調ワークスペースは、リンクされたパス、オープナーの状態、およびエージェントのセットアップをまとめるマシンローカルな表示です。

ワークスペースのメンタルモデルは次のとおりです:

```text
workspace     = private local view over context stores, initiatives, repos, and folders
context store = durable shared context container
initiative    = durable coordination context inside a context store
link          = a stable name for a repo or folder the workspace can resolve locally
change        = one planned piece of work; implementation belongs in the owning repo
```

ワークスペースは、リポジトリローカルプロジェクトとは異なる形状を持ちます:

```text
getGlobalDataDir()/workspaces/<workspace-name>/
├── workspace.yaml                 # Private local view record
├── AGENTS.md                      # Generated runtime guidance
└── <workspace-name>.code-workspace # Generated editor workspace file
```

リポジトリローカルなOpenSpecの状態は、既存の形状を維持します:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

この区別は重要です。ワークスペースフォルダは、リンクされたリポジトリまたはフォルダを開いて検査するためのローカル協調サーフェスです。各リポジトリの `openspec/` ディレクトリは、リポジトリが所有する仕様、リポジトリローカルな変更、および実装計画の場所であり続けます。ユーザーはワークスペースフォルダ内でリポジトリローカルな `openspec init` を実行する必要はありません。

安定したリンク名は、ワークスペースがリポジトリやフォルダを参照する方法です。プライベートワークスペースレコードは、`api`、`web`、`checkout` などの名前を保持し、それらをこのランタイムのローカルパスにマッピングします。

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

ワークスペースがイニシアチブを開くと、`context` は選択されたコンテキストストアのバインディングとイニシアチブIDを記録します。レジストリで選択されたストアはIDにより移植性を維持します。パスで選択されたストアは、`workspace.yaml` がプライベートローカル状態であるため、ランタイムローカルなパスを意図的に保持します。

```yaml
context:
  kind: initiative
  store:
    id: platform
    selector:
      kind: registry
      id: platform
  initiative:
    id: billing-launch
```

リンクされたパスは、完全なリポジトリ、大きなモノリポ内のフォルダ、または他の既存のフォルダであってもかまいません。ワークスペース計画に参加する前に、リポジトリローカルな `openspec/` 状態は必要ありません。後の実装、検証、またはアーカイブワークフローには、リポジトリの準備がさらに必要になる場合がありますが、計画の可視性はリンクから始まります。

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

管理されたワークスペースは、標準のOpenSpecデータディレクトリの下にあります:

```text
getGlobalDataDir()/workspaces
```

これは、`XDG_DATA_HOME` が設定されている場合は `$XDG_DATA_HOME/openspec/workspaces`、Unixスタイルのフォールバックでは `~/.local/share/openspec/workspaces`、ネイティブWindowsのフォールバックでは `%LOCALAPPDATA%\openspec\workspaces` を意味します。ネイティブWindowsシェル、PowerShell、およびWSL2は、それぞれOpenSpecを実行しているランタイムのパス文字列を保持します。この基盤は、`D:\repo`、`/mnt/d/repo`、およびUNC WSLパス間で変換されません。

OpenSpecは、以前のベータワークスペースのルートを互換性入力として引き続き読み取ることができますが、管理されたワークスペースは現在、上記のルート `workspace.yaml` レコードを使用します。ワークスペースフォルダは、自身のプライベートローカル表示に対する権限を持ち続けます。

ワークスペースの可視性は、変更のコミットメントではありません。OpenSpecがどのリポジトリまたはフォルダが関連しているかを知るべき場合にワークスペースをセットアップします。後で機能、修正、プロジェクト、またはその他の作業を計画する準備が整ったら、変更を作成します。

便利なコマンド:

```bash
# Guided setup
openspec workspace setup

# Automation-friendly setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# See known workspaces from the local registry
openspec workspace list
openspec workspace ls

# Add or repair links for the selected workspace
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Check what this machine can resolve
openspec workspace doctor
openspec workspace doctor --workspace platform

# Refresh workspace-local guidance and agent skills
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Open the linked working set
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Open an initiative as a local workspace view
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` は常に標準のワークスペース場所にワークスペースを作成し、ローカルレジストリに記録し、ワークスペースの場所を表示し、少なくとも1つのリンクされたリポジトリまたはフォルダを必要とします。対話型セットアップでは、優先オープナーを求められ、選択されたエージェントにOpenSpecスキルをインストールできます。非対話型セットアップでは、`--opener codex-cli`、`--opener claude`、`--opener github-copilot`、または `--opener editor` が提供された場合にのみ保存します。

ワークスペーススキルはワークスペースルートにのみインストールされます。アクティブなグローバルプロファイルは、どのワークフロースキルが生成されるかを選択します。`--tools` はそれらを受け取るエージェントを選択します。ワークスペースのセットアップと更新は、グローバルデリバリーにコマンドが含まれていても、スラッシュコマンドファイルを作成しません。`openspec workspace update` を実行して、ワークスペースローカルのガイダンスを更新し、管理されたワークスペースローカルスキルディレクトリをリンクされたリポジトリまたはフォルダを編集せずに追加、更新、または削除します。

OpenSpecはまた、ルートワークスペースのオープンファイルも維持します: `AGENTS.md` のOpenSpec管理ガイダンスブロックと、VS CodeおよびGitHub Copilot-in-VS-Codeのオープン用のマシンローカルな `<workspace-name>.code-workspace` ファイルです。管理されたワークスペースはリポジトリではないため、OpenSpecはデフォルトのワークスペース `.gitignore` やデフォルトのワークスペースレベルの `changes/` ディレクトリを作成しません。

管理されたVS Codeワークスペースは、最初に有効なリンクされたリポジトリまたはフォルダを列挙し、次にアタッチされた場合にイニシアチブコンテキストを、最後にOpenSpecワークスペースファイルを列挙します。VS Codeはそれらのエントリをマルチルートワークスペースとして表示します。

`workspace open` は、そのセッションのために `--agent <tool>` または `--editor` が渡されない限り、保存された優先オープナーでリンクされたワーキングセットを開きます。両方のオープナーのオーバーライドを渡すことはエラーです。ルートワークスペースのオープンは、探索とコンテキストのためにリンクされたリポジトリとフォルダを可視にします。実装は、ユーザーが明示的に実装作業を要求した後に始まります。

`workspace link` と `workspace relink` は既存のフォルダのみを記録します。これらはリンクされたリポジトリまたはフォルダを作成、コピー、移動、初期化、または編集しません。リンクまたはリリンクが成功した後、OpenSpecは管理されたガイダンスとVS Codeワークスペースファイルを更新します。

1つのワークスペースを必要とするワークスペースコマンドは、`--workspace <name>` を指定してどこからでも実行できます。ワークスペースフォルダまたはサブディレクトリ内で実行すると、OpenSpecはその現在のワークスペースを使用します。複数の既知のワークスペースが利用可能で、`--workspace <name>` を渡さない場合、人間向けコマンドはピッカーを表示します。`--json` と `--no-interactive` は、プロンプトの代わりに構造化されたステータスエラーで失敗します。

直接のワークスペースコマンドは、スクリプト用にJSON出力をサポートします。JSONレスポンスは、プライマリデータを `workspace`、`workspaces`、または `link` オブジェクトに保持し、警告またはエラーを `status` 配列で報告します。正常なオブジェクトは `status: []` を使用します。

## 仕様

仕様は、構造化された要件とシナリオを使用してシステムの動作を記述します。

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
    └── spec.md           # UIの動作とテーマ
```

仕様はドメイン別に整理します — システムにとって論理的で意味のあるグループ化です。一般的なパターン：

- **機能領域別**: `auth/`, `payments/`, `search/`
- **コンポーネント別**: `api/`, `frontend/`, `workers/`
- **境界付きコンテキスト別**: `ordering/`, `fulfillment/`, `inventory/`

### 仕様フォーマット

仕様は要件を含み、各要件にはシナリオがあります：

```markdown
# 認証仕様

## 目的
アプリケーションの認証とセッション管理。
```

## 要件

### 要件: ユーザー認証
システムは、ログイン成功時にJWTトークンを発行するものとします。

#### シナリオ: 有効な資格情報
- GIVEN: 有効な資格情報を持つユーザー
- WHEN: ユーザーがログインフォームを送信する
- THEN: JWTトークンが返される
- AND: ユーザーはダッシュボードにリダイレクトされる

#### シナリオ: 無効な資格情報
- GIVEN: 無効な資格情報
- WHEN: ユーザーがログインフォームを送信する
- THEN: エラーメッセージが表示される
- AND: トークンは発行されない

### 要件: セッション有効期限
システムは、30分間の非アクティブ状態の後にセッションを期限切れにする必要があります。

#### シナリオ: アイドルタイムアウト
- GIVEN: 認証済みのセッション
- WHEN: アクティビティなしで30分が経過する
- THEN: セッションは無効化される
- AND: ユーザーは再認証を行う必要がある
```

**主要な要素:**

| 要素 | 目的 |
|---------|---------|
| `## Purpose` | この仕様のドメインの高レベルな説明 |
| `### Requirement:` | システムが備えるべき具体的な動作 |
| `#### Scenario:` | 要件の具体的な例 |
| SHALL/MUST/SHOULD | 要件の強度を示すRFC 2119キーワード |

### なぜこのように仕様を構造化するのか

**要件は「何を」か** — 実装を指定せずに、システムが何をすべきかを述べます。

**シナリオは「いつ」か** — 検証可能な具体的な例を提供します。良いシナリオは：
- テスト可能であること（自動テストを記述可能）
- ハッピーパスとエッジケースの両方をカバーすること
- Given/When/Thenまたは類似の構造化された形式を使用すること

**RFC 2119キーワード**（SHALL, MUST, SHOULD, MAY）は意図を伝えます：
- **MUST/SHALL** — 絶対的な要件
- **SHOULD** — 推奨されるが、例外がある場合がある
- **MAY** — 任意

### 仕様とは何か（そして何でないか）

仕様は**動作の契約**であり、実装計画ではありません。

良い仕様の内容：
- ユーザーやダウンストリームシステムが依存する、観測可能な動作
- 入力、出力、エラー条件
- 外部制約（セキュリティ、プライバシー、信頼性、互換性）
- テストまたは明示的に検証可能なシナリオ

仕様に含めるべきでないもの：
- 内部のクラス/関数名
- ライブラリやフレームワークの選択
- ステップバイステップの実装の詳細
- 詳細な実行計画（それらは `design.md` または `tasks.md` に属します）

簡単なテスト：
- 実装が外部から見える動作を変更せずに変更できる場合、それはおそらく仕様に属さない。

### 軽量さを保つ：段階的な厳格さ

OpenSpecは官僚主義を避けることを目指しています。変更を検証可能にする最小限のレベルを使用してください。

**Lite仕様（デフォルト）：**
- 短い動作中心の要件
- 明確なスコープと非目標
- 具体的な受入チェックをいくつか

**Full仕様（より高いリスクの場合）：**
- チーム間やリポジトリ間の変更
- API/契約の変更、移行、セキュリティ/プライバシーの懸念
- 曖昧さが高価な再作業を引き起こす可能性のある変更

ほとんどの変更はLiteモードに留まるべきです。

### 人間とエージェントの協力

多くのチームでは、人間が探索し、エージェントが成果物を起草します。意図されているループは以下の通りです：

1. 人間が意図、コンテキスト、制約を提供する。
2. エージェントがこれを動作中心の要件とシナリオに変換する。
3. エージェントは `design.md` と `tasks.md` に実装の詳細を保持し、`spec.md` には含めない。
4. 検証が構造と明確さを実装前に確認する。

これにより、仕様は人間にとって読みやすく、エージェントにとって一貫性のあるものになります。

## 変更

変更とは、システムへの提案された修正であり、それを理解し実装するために必要なすべてを含むフォルダとしてパッケージ化されます。

### 変更の構造

```
openspec/changes/add-dark-mode/
├── proposal.md           # なぜ、そして何を
├── design.md             # どのように（技術的アプローチ）
├── tasks.md              # 実装チェックリスト
├── .openspec.yaml        # 変更メタデータ（オプション）
└── specs/                # デルタ仕様
    └── ui/
        └── spec.md       # ui/spec.mdの何が変わるか
```

各変更は自己完結しています。以下を含みます：
- **成果物** — 意図、設計、タスクを捉えた文書
- **デルタ仕様** — 追加、変更、または削除される仕様
- **メタデータ** — この特定の変更のオプション設定

### なぜ変更がフォルダなのか

変更をフォルダとしてパッケージ化することには、いくつかの利点があります：

1. **すべてが一箇所に。** 提案、設計、タスク、仕様が1つの場所に存在します。異なる場所を探し回る必要がありません。

2. **並行作業。** 複数の変更が同時に存在でき、競合しません。`add-dark-mode` に取り組みながら、`fix-auth-bug` も進行中にしておくことができます。

3. **クリーンな履歴。** アーカイブされると、変更は完全なコンテキストとともに `changes/archive/` に移動します。何が変わったかだけでなく、なぜ変わったかを振り返って理解できます。

4. **レビューしやすい。** 変更フォルダはレビューしやすいです。開いて、提案を読み、設計を確認し、仕様の差分を見ます。

## 成果物

成果物とは、作業を導く変更内の文書のことです。

### 成果物の流れ

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   なぜ          何が          どのように      実行する
 + スコープ      変わるか      アプローチ      ステップ
```

成果物は相互に構築されます。各成果物は次の成果物のコンテキストを提供します。

### 成果物の種類

#### 提案 (`proposal.md`)

提案は高レベルで**意図**、**スコープ**、**アプローチ**を捉えます。

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

**提案を更新すべきタイミング：**
- スコープが変更された場合（狭まるか、広がるか）
- 意図が明確になった場合（問題のより良い理解）
- アプローチが根本的に変更された場合

#### 仕様 (`specs/` 内のデルタ仕様)

デルタ仕様は、現在の仕様に対する**何が変わるか**を説明します。以下の[デルタ仕様](#delta-specs)を参照してください。

#### 設計 (`design.md`)

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

**設計を更新すべきタイミング：**
- 実装の過程でアプローチが機能しないと判明した場合
- より良い解決策が見つかった場合
- 依存関係や制約が変更された場合

#### タスク (`tasks.md`)

タスクは**実装チェックリスト**です。チェックボックス付きの具体的なステップです。

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
- タスクは1回のセッションで完了できる程度の小ささに保つ
- 完了したタスクにチェックを入れる

## デルタ仕様

デルタ仕様は、OpenSpecを既存システム開発（brownfield development）で機能させる主要な概念です。全体の仕様を繰り返し述べるのではなく、**何が変わるか**を記述します。

### 形式

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

### デルタセクション

| セクション | 意味 | アーカイブ時に何が起こるか |
|---------|---------|------------------------|
| `## ADDED Requirements` | 新しい動作 | メイン仕様に追加される |
| `## MODIFIED Requirements` | 変更された動作 | 既存の要件を置き換える |
| `## REMOVED Requirements` | 非推奨の動作 | メイン仕様から削除される |

### なぜ完全な仕様ではなくデルタなのか

**明確さ。** デルタは正確に何が変わるかを示します。完全な仕様を読む場合、現在のバージョンと頭の中で差分を比較する必要があります。

**競合の回避。** 2つの変更が同じ仕様ファイルに触れる場合でも、異なる要件を変更する限り競合しません。

**レビューの効率性。** レビュアーは変更点を見ることができ、変更されていないコンテキストは省かれます。重要なことに集中できます。

**既存システムへの適合。** ほとんどの作業は既存の動作を変更します。デルタは変更を第一級の存在とし、後付けのものではありません。

## スキーマ

スキーマは、ワークフローにおける成果物のタイプとその依存関係を定義します。

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

**成果物は依存関係のグラフを形成します:**

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

**依存関係はイネーブラーであり、ゲートではありません。** これらは次に作成すべきものではなく、何を作成可能かを示します。設計が不要ならスキップできます。設計の前後どちらで仕様を作成することも可能です—どちらもプロポーザルにのみ依存します。

### 組み込みスキーマ

**spec-driven** (デフォルト)

spec-driven 開発の標準ワークフロー:

```
proposal → specs → design → tasks → implement
```

最適な用途: 実装前に仕様を合意したい場合の、ほとんどの機能開発作業。

### カスタムスキーマ

チームのワークフローに合わせてカスタムスキーマを作成します:

```bash
# 作成を開始
openspec schema init research-first

# 既存のスキーマをフォーク
openspec schema fork spec-driven research-first
```

**カスタムスキーマの例:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Do research first

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informed by research

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Skip specs/design, go straight to tasks
```

カスタムスキーマの作成と使用の詳細については、[カスタマイズ](customization.md) を参照してください。

## アーカイブ

アーカイブは、変更のデルタ仕様をメイン仕様にマージし、変更を履歴として保存することで、変更を完了させます。

### アーカイブ時の動作

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
│       └── spec.md        # 2FA要件が含まれるようになりました
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # 履歴として保存されます
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### アーカイブプロセス

1. **デルタをマージします。** 各デルタ仕様セクション (ADDED/MODIFIED/REMOVED) が、対応するメイン仕様に適用されます。

2. **アーカイブへ移動します。** 変更フォルダが、時系列順に並べるための日付プレフィックスを付けて `changes/archive/` に移動します。

3. **コンテキストを保持します。** 全ての成果物はアーカイブ内にそのまま残ります。いつでも変更がなされた理由を遡って確認できます。

### アーカイブが重要な理由

**クリーンな状態。** アクティブな変更 (`changes/`) には進行中の作業のみが表示されます。完了した作業は邪魔にならない場所に移動します。

**監査証跡。** アーカイブは、変更された内容だけでなく、変更を説明するプロポーザル、方法を説明する設計、そして行われた作業を示すタスクなど、変更の完全なコンテキストを保存します。

**仕様の進化。** 変更がアーカイブされるにつれて、仕様は自然と成長していきます。各アーカイブはデルタをマージし、時間とともに包括的な仕様を構築していきます。

## 全体の連携

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC フロー                                 │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. 開始       │  /opsx:propose (コア) または /opsx:new (拡張)            │
│   │     変更       │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. 作成       │  /opsx:ff または /opsx:continue (拡張ワークフロー)        │
│   │     成果物     │  proposal → specs → design → tasks を作成               │
│   │                │  (スキーマの依存関係に基づく)                             │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. 実装       │  /opsx:apply                                            │
│   │     タスク     │  タスクを進め、完了チェックを入れる                       │
│   │                │◄──── 学習しながら成果物を更新                             │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. 検証       │  /opsx:verify (任意)                                     │
│   │     作業       │  実装が仕様と一致しているかを確認                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. アーカイブ │────►│  デルタ仕様がメイン仕様にマージされる        │    │
│   │     変更       │     │  変更フォルダが archive/ に移動する          │    │
│   └────────────────┘     │  仕様が更新された信頼できる情報源になる      │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**好循環:**

1. 仕様が現在の動作を記述する
2. 変更が修正を提案する (デルタとして)
3. 実装が変更を現実のものにする
4. アーカイブがデルタを仕様にマージする
5. 仕様が新しい動作を記述するようになる
6. 次の変更が更新された仕様を基にして行われる

## 用語集

| 用語 | 定義 |
|------|------|
| **成果物 (Artifact)** | 変更内の文書 (提案、設計、タスク、またはデルタ仕様) |
| **アーカイブ (Archive)** | 変更を完了し、そのデルタをメイン仕様にマージするプロセス |
| **変更 (Change)** | システムへの提案された修正。成果物を含むフォルダとしてパッケージされる |
| **デルタ仕様 (Delta spec)** | 現在の仕様に対する変更内容 (追加/変更/削除) を記述する仕様 |
| **ドメイン (Domain)** | 仕様の論理的なグループ (例: `auth/`, `payments/`) |
| **要件 (Requirement)** | システムが持つべき特定の動作 |
| **シナリオ (Scenario)** | 要件の具体的な例。通常は Given/When/Then 形式で記述される |
| **スキーマ (Schema)** | 成果物のタイプとその依存関係の定義 |
| **仕様 (Spec)** | システムの動作を記述する仕様。要件とシナリオを含む |
| **信頼できる情報源 (Source of truth)** | 現在合意された動作を含む `openspec/specs/` ディレクトリ |

## 次のステップ

- [始め方](getting-started.md) - 実践的な最初のステップ
- [ワークフロー](workflows.md) - 一般的なパターンと各々の使用タイミング
- [コマンド](commands.md) - 完全なコマンドリファレンス
- [カスタマイズ](customization.md) - カスタムスキーマの作成とプロジェクト設定