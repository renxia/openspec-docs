# 概念

本指南解釋 OpenSpec 的核心思想及其相互關聯的方式。有關實際使用，請參閱 [Getting Started](getting-started.md) 和 [Workflows](workflows.md)。

## 設計理念

OpenSpec 基於以下四個原則構建：

```
fluid not rigid         — 沒有階段門檻，專注於有意義的工作
iterative not waterfall — 在建構的過程中學習，隨時優化
easy not complex        — 輕量級設定，極簡流程
brownfield-first        — 與現有程式碼庫協作，而不僅限於全新專案 (greenfield)
```

### 這些原則為何重要

**流動而非僵化。** 傳統的規範系統會將你鎖定在特定的階段：先規劃，然後實作，最後完成。OpenSpec 更具彈性——你可以按照對你的工作而言有意義的任何順序來創建工件 (artifacts)。

**迭代式而非瀑布式。** 需求會改變。理解也會加深。一開始看似良好的方法，在看到程式碼庫後可能不成立。OpenSpec 擁抱這種現實。

**簡單而非複雜。** 有些規範框架需要大量的設定、僵化的格式或重量級的流程。OpenSpec 不會干擾你。只需幾秒鐘即可初始化，立即開始工作，只有在需要時才進行客製化。

**先考慮現有基礎 (Brownfield-first)。** 大多數的軟體工作並非從零開始——而是修改現有的系統。OpenSpec 基於 delta 的方法，讓你可以輕鬆地規範對現有行為的更改，而不僅是描述新系統。

## 概覽 (The Big Picture)

OpenSpec 將您的工作分為兩個主要領域：

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

**Specs (規格)** 是唯一真相源 — 它描述了您的系統目前如何運作。

**Changes (變更)** 是建議的修改 — 在您準備好合併之前，它們會存在於單獨的資料夾中。

這種分離至關重要。您可以同時處理多個變更而不會產生衝突。在變更影響主規格之前，您可以先審查該變更。當您歸檔一個變更時，它的 delta（差異）就會乾淨地合併到唯一真相源中。

## Specs (規格)

Specs 使用結構化的需求和情境來描述您的系統行為。

### 結構 (Structure)

```
openspec/specs/
├── auth/
│   └── spec.md           # 身份驗證行為
├── payments/
│   └── spec.md           # 付款處理
├── notifications/
│   └── spec.md           # 通知系統
└── ui/
    └── spec.md           # UI 行為和主題
```

請根據領域（domain）來組織規格 — 這些是對您的系統有意義的邏輯分組。常見模式包括：

- **按功能區域 (By feature area)**：`auth/`, `payments/`, `search/`
- **按元件 (By component)**：`api/`, `frontend/`, `workers/`
- **按邊界上下文 (By bounded context)**：`ordering/`, `fulfillment/`, `inventory/`

### 規格格式 (Spec Format)

一個 spec 包含需求，每個需求都附帶情境（scenarios）：

```markdown
# Auth Specification (身份驗證規格)

## Purpose (目的)
應用程式的身份驗證和會話管理。

## Requirements (需求)

### Requirement: User Authentication (使用者身份驗證)
系統必須在成功登入後發出 JWT token。

#### Scenario: Valid credentials (有效憑證)
- GIVEN a user with valid credentials (給定一個具有有效憑證的使用者)
- WHEN the user submits login form (當使用者提交登入表單時)
- THEN a JWT token is returned (則會返回一個 JWT token)
- AND the user is redirected to dashboard (並且使用者被導向到儀表板)

#### Scenario: Invalid credentials (無效憑證)
- GIVEN invalid credentials (給定無效的憑證)
- WHEN the user submits login form (當使用者提交登入表單時)
- THEN an error message is displayed (則會顯示一個錯誤訊息)
- AND no token is issued (並且不會發出任何 token)

### Requirement: Session Expiration (會話過期)
系統必須在 30 分鐘不活動後使會話失效。

#### Scenario: Idle timeout (閒置超時)
- GIVEN an authenticated session (給定一個已驗證的會話)
- WHEN 30 minutes pass without activity (當經過 30 分鐘沒有活動時)
- THEN the session is invalidated (則該會話被使失效)
- AND the user must re-authenticate (並且使用者必須重新進行身份驗證)
```

**關鍵元素：**

| Element (元素) | Purpose (目的) |
|---------|---------|
| `## Purpose` | 對此規格領域的高層次描述 |
| `### Requirement:` | 系統必須具備的特定行為 |
| `#### Scenario:` | 需求實際運作的一個具體範例 |
| SHALL/MUST/SHOULD | RFC 2119 關鍵字，指示需求的強度 |

### 為何這樣建構規格 (Why Structure Specs This Way)

**需求是「What」（要做什麼）** — 它陳述了系統應該做的事情，而無需指定實作細節。

**情境是「When」（何時發生）** — 它提供了可以被驗證的具體範例。好的情境：
- 是可測試的（您可以為它們編寫自動化測試）
- 涵蓋了正常路徑和邊緣案例
- 使用 Given/When/Then 或類似結構化的格式

**RFC 2119 關鍵字** (SHALL, MUST, SHOULD, MAY) 用於傳達意圖：
- **MUST/SHALL** — 絕對要求
- **SHOULD** — 建議，但存在例外情況
- **MAY** — 可選的

### 什麼是規格（Spec）(What a Spec Is - and Is Not)

一個 spec 是一個**行為合約 (behavior contract)**，而不是一份實作計畫。

好的規格內容：
- 用使用者或下游系統可以觀察到的行為
- 輸入、輸出和錯誤條件
- 外部限制（安全性、隱私密、可靠性、相容性）
- 可以被測試或明確驗證的情境

規格中應避免的內容：
- 內部類別/函式名稱
- 函式庫或框架選擇
- 逐步的實作細節
- 詳細的執行計畫（這些屬於 `design.md` 或 `tasks.md`）

快速測試：
- 如果實作可以改變而不會改變外部可見的行為，那麼它可能不應包含在規格中。

### 保持輕量化：漸進式嚴謹性 (Progressive Rigor)

OpenSpec 旨在避免官僚主義。請使用仍能使變更可驗證的最輕量級別。

**Lite spec（預設）:**
- 簡短的、以行為為先導向的需求
- 清晰的範圍和非目標 (non-goals)
- 少數具體的接受檢查點 (acceptance checks)

**Full spec（用於高風險情況）:**
- 跨團隊或跨儲存庫的變更
- API/合約變更、遷移、安全/隱私密考量
- 存在歧義可能導致昂貴重工的變更

大多數變更都應該保持在 Lite 模式。

### 人類與代理 (Agent) 的協作

在許多團隊中，人類負責探索，而代理（agent）則負責起草文檔。預期的流程是：

1. 人類提供意圖、上下文和限制。
2. 代理將此內容轉換為以行為為先導向的需求和情境。
3. 代理將實作細節保留在 `design.md` 和 `tasks.md` 中，而不是 `spec.md`。
4. 驗證確認結構和清晰度後進行實作。

這確保了規格對人類來說是可讀的，對代理來說是一致的。

## Changes (變更)

一個 Change 是對您系統的建議修改，它被打包成一個包含所有必要資訊以理解和實作該變更的資料夾。

### 變更結構 (Change Structure)

```
openspec/changes/add-dark-mode/
├── proposal.md           # 原因和內容
├── design.md             # 如何做（技術方法）
├── tasks.md              # 實作檢查清單
├── .openspec.yaml        # 變更元數據（可選）
└── specs/                # Delta specs (差異規格)
    └── ui/
        └── spec.md       # ui/spec.md 中發生了什麼變化
```

每個變更都是自包含的。它包含：
- **Artifacts (文檔)** — 捕捉意圖、設計和任務的文件
- **Delta specs (差異規格)** — 關於所新增、修改或移除內容的規格
- **Metadata (元數據)** — 此特定變更的可選配置

### 為何變更是資料夾 (Why Changes Are Folders)

將變更打包成一個資料夾有幾個好處：

1. **一體化。** 提案、設計、任務和規格都存在於同一個地方。無需在不同的位置尋找。
2. **並行工作。** 多個變更可以同時存在而不會相互衝突。當 `fix-auth-bug` 正在進行時，也可以著手處理 `add-dark-mode`。
3. **清晰的歷史記錄。** 當被歸檔後，變更會移動到 `changes/archive/`，並保留其完整的上下文。您可以回顧並了解不僅僅是「什麼改變了」，還有「為什麼改變」。
4. **易於審查。** 變更資料夾很容易進行審查 — 打開它，閱讀提案，檢查設計，查看規格差異 (spec deltas)。

## Artifacts (文檔)

Artifacts 是指導工作的變更內部的文件。

### 文檔流程 (The Artifact Flow)

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artifacts 是相互依賴的。每個 artifact 都為下一個提供了上下文。

### 文檔類型 (Artifact Types)

#### Proposal (`proposal.md`)

提案捕捉高層次的**意圖、範圍和方法**。

```markdown
# Proposal: Add Dark Mode (提案：新增深色模式)

## Intent (意圖)
使用者要求提供深色模式選項，以減少夜間使用時的眼睛疲勞，並匹配系統偏好設定。

## Scope (範圍)
包含的內容 (In scope):
- 設定中的主題切換開關
- 系統偏好的偵測
- 將偏好儲存到 localStorage 中

不包含的內容 (Out of scope):
- 客製化顏色主題（未來工作）
- 按頁面設定的主題覆蓋

## Approach (方法)
使用 CSS custom properties 進行主題化，並搭配 React context 進行狀態管理。在首次載入時偵測系統偏好，允許手動覆蓋。
```

**何時更新提案：**
- 範圍的變更（縮小或擴大）
- 意圖的澄清（對問題有更好的理解）
- 方法論發生根本性轉變

#### Specs (規格)

Delta specs (差異規格，位於 `specs/` 中) 描述了相對於現有規格**「什麼正在改變」**。請參閱下方的 [Delta Specs](#delta-specs)。

#### Design (`design.md`)

設計捕捉**技術方法和架構決策**。

````markdown
# Design: Add Dark Mode (設計：新增深色模式)

## Technical Approach (技術方法)
透過 React Context 管理主題狀態，以避免 prop drilling（屬性傳遞）。CSS custom properties 使得無需切換類別即可實現運行時切換。

## Architecture Decisions (架構決策)

### Decision: Context over Redux (Context 優於 Redux)
使用 React Context 來管理主題狀態，因為：
- 簡單的二元狀態（淺色/深色）
- 沒有複雜的狀態轉換
- 有助於避免引入 Redux 依賴

### Decision: CSS Custom Properties (CSS 自定義屬性)
使用 CSS variables 而非 CSS-in-JS，因為：
- 與現有的樣式表相容
- 無運行時開銷
- 是瀏覽器原生的解決方案

## Data Flow (資料流)
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes (檔案變更)
- `src/contexts/ThemeContext.tsx` (新增)
- `src/components/ThemeToggle.tsx` (新增)
- `src/styles/globals.css` (修改)
````

**何時更新設計：**
- 實作發現方法論不可行
- 發現更好的解決方案
- 依賴項或限制發生變化

#### Tasks (`tasks.md`)

Tasks 是**實作檢查清單** — 帶有勾選框的具體步驟。

```markdown
# Tasks (任務)

## 1. Theme Infrastructure (主題基礎架構)
- [ ] 1.1 Create ThemeContext with light/dark state (建立包含淺色/深色狀態的主題 Context)
- [ ] 1.2 Add CSS custom properties for colors (新增顏色用的 CSS 自定義屬性)
- [ ] 1.3 Implement localStorage persistence (實作 localStorage 持久化)
- [ ] 1.4 Add system preference detection (新增系統偏好偵測)

## 2. UI Components (UI 元件)
- [ ] 2.1 Create ThemeToggle component (建立主題切換元件)
- [ ] 2.2 Add toggle to settings page (在設定頁面中加入切換開關)
- [ ] 2.3 Update Header to include quick toggle (更新標頭以包含快速切換功能)

## 3. Styling (樣式設計)
- [ ] 3.1 Define dark theme color palette (定義深色主題的顏色調色板)
- [ ] 3.2 Update components to use CSS variables (更新元件以使用 CSS 變數)
- [ ] 3.3 Test contrast ratios for accessibility (測試可存取性對比度)
```

**任務最佳實踐：**
- 將相關任務分組到標題下
- 使用層級化的編號（1.1, 1.2 等）
- 保持任務足夠小，可以在一次工作階段完成
- 完成後勾選任務

## Delta Specs (差異規格)

Delta specs 是讓 OpenSpec 適用於現有系統開發 (brownfield development) 的關鍵概念。它們描述**「什麼正在改變」**，而不是重述整個規格。

### 格式 (The Format)

```markdown
# Delta for Auth (身份驗證的差異規格)

## ADDED Requirements (新增的需求)

### Requirement: Two-Factor Authentication (雙因素身份驗證)
系統必須支援基於 TOTP 的雙因素身份驗證。

#### Scenario: 2FA enrollment (2FA 註冊)
- GIVEN a user without 2FA enabled (給定一個未啟用 2FA 的使用者)
- WHEN the user enables 2FA in settings (當使用者在設定中啟用 2FA 時)
- THEN a QR code is displayed for authenticator app setup (則會顯示用於認證器應用程式的 QR code)
- AND the user must verify with a code before activation (並且使用者必須使用代碼進行驗證才能激活)

#### Scenario: 2FA login (2FA 登入)
- GIVEN a user with 2FA enabled (給定一個已啟用 2FA 的使用者)
- WHEN the user submits valid credentials (當使用者提交有效的憑證時)
- THEN an OTP challenge is presented (則會呈現一個 OTP 挑戰)
- AND login completes only after valid OTP (並且只有在有效的 OTP 後登入才會完成)

## MODIFIED Requirements (修改的需求)

### Requirement: Session Expiration (會話過期)
系統必須在 15 分鐘不活動後使會話失效。
(先前：30 分鐘)

#### Scenario: Idle timeout (閒置超時)
- GIVEN an authenticated session (給定一個已驗證的會話)
- WHEN 15 minutes pass without activity (當經過 15 分鐘沒有活動時)
- THEN the session is invalidated (則該會話被使失效)

## REMOVED Requirements (移除的需求)

### Requirement: Remember Me (記住我)
(已棄用，改為使用 2FA。使用者應在每次會話中重新進行身份驗證。)
```

### Delta Sections (差異區塊)

| Section (區塊) | Meaning (意義) | What Happens on Archive (歸檔時發生什麼) |
|---------|---------|------------------------|
| `## ADDED Requirements` | 新的行為 | 追加到主規格中 |
| `## MODIFIED Requirements` | 已更改的行為 | 取代現有的需求 |
| `## REMOVED Requirements` | 已棄用的行為 | 從主規格中刪除 |

### 為何使用差異 (Deltas) 而非完整規格 (Why Deltas Instead of Full Specs)

**清晰度。** 差異規格清楚地顯示了「什麼正在改變」。閱讀一份完整的規格，您必須在腦海中將其與當前版本進行比對。

**避免衝突。** 兩個變更可以觸及相同的規格文件而不會產生衝突，只要它們修改的是不同的需求即可。

**審查效率。** 審閱者會看到變更本身，而不是未改變的上下文。專注於重要的部分。

**適用於現有系統 (Brownfield fit)。** 大多數工作都是對現有行為進行修改。差異規格使修改成為一級公民 (first-class)，而非事後補救。

## 架構定義 (Schemas)

架構定義用於定義工作流程的產物類型及其依賴關係。

### 架構運作方式

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # 沒有依賴，可以最先創建

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # 需在 proposal 之後才能創建

  - id: design
    generates: design.md
    requires: [proposal]      # 可以與 specs 並行創建

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # 需先有 specs 和 design
```

**產物構成了一個依賴圖：**

```
                    proposal
                   (根節點)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (需要:                  (需要:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (需要:
                specs, design)
```

**依賴關係是賦能者，而非門檻。** 它顯示的是什麼是有可能被創建的，而不是你必須下一步創建什麼。如果你不需要設計，你可以跳過它。你可以在設計之前或之後創建 specs — 兩者都只依賴 proposal。

### 內建架構定義 (Built-in Schemas)

**spec-driven** (預設值)

這是用於規格驅動開發的標準工作流程：

```
proposal → specs → design → tasks → implement
```

適用於：大多數需要先就規格達成一致再進行實作的功能性工作。

### 自定義架構定義 (Custom Schemas)

為您的團隊工作流程創建自定義架構定義：

```bash
# 從零開始創建
openspec schema init research-first

# 或從現有的架構定義複製一份
openspec schema fork spec-driven research-first
```

**範例自定義架構定義：**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # 先進行研究

  - id: proposal
    generates: proposal.md
    requires: [research]   # 提案基於研究結果

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # 跳過 specs/design，直接進入任務階段
```

請參閱 [Customization](customization.md) 以獲取有關創建和使用自定義架構定義的完整詳情。

## 歸檔 (Archive)

歸檔是通過將變更的增量規格（delta specs）合併到主規格中，並保留該變更以供歷史追溯來完成一個變更的過程。

### 歸檔時會發生什麼事

```
歸檔前：

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ 合併 (merge)
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


歸檔後：

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # 現在已包含 2FA 的要求事項
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # 保留於歷史記錄
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### 歸檔流程

1. **合併增量。** 將每個增量規格（delta spec）區塊（ADDED/MODIFIED/REMOVED）應用到對應的主規格上。
2. **移至歸檔。** 變更資料夾會移動到 `changes/archive/`，並加上日期前綴以保持時間順序。
3. **保留上下文。** 所有產物都會完整地保存在歸檔中。您隨時都可以回溯了解決策的依據。

### 為什麼歸檔很重要

**乾淨的狀態。** 活動中的變更（`changes/`）只顯示進行中的工作。已完成的工作會被移開。

**審計軌跡 (Audit trail)。** 歸檔保留了每個變更的完整上下文——不僅僅是「什麼改變了」，還有解釋原因的提案、說明方法的設計，以及所完成工作的任務。

**規格演進。** 隨著變更被歸檔，規格會有機地成長。每一次歸檔都會合併其增量，從而逐步構建起一份全面的規範。

## 各部分如何協作 (How It All Fits Together)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC 工作流程                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. 開始 (START)  │  /opsx:propose (core) 或 /opsx:new (expanded)           │
│   │     變更 (CHANGE) │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. 創建 (CREATE) │  /opsx:ff 或 /opsx:continue (expanded workflow)         │
│   │     產物 (ARTIFACTS) │  根據架構定義（schema dependencies）創建 proposal → specs → design → tasks │
│   │                │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. 實作 (IMPLEMENT) │  /opsx:apply                                            │
│   │     任務 (TASKS)  │  完成任務，並勾選它們                  │
│   │                │◄──── 根據學習情況更新產物                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. 驗證 (VERIFY) │  /opsx:verify (可選)                                │
│   │     工作 (WORK)   │  檢查實作是否符合規格                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. 歸檔 (ARCHIVE) │────►│  增量規格合併到主規格中                   │    │
│   │     變更 (CHANGE) │     │  變更資料夾移動到 archive/             │    │
│   └────────────────┘     │  規格現已成為最新的真實來源 (source of truth)   │    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**良性循環：**

1. 規格描述當前的行為。
2. 變更提出修改建議（以增量形式）。
3. 實作使這些變更成為現實。
4. 歸檔將增量合併到規格中。
5. 規格現在描述了新的行為。
6. 下一次變更會基於更新後的規格進行構建。

## 詞彙表 (Glossary)

| 術語 | 定義 |
|------|------------|
| **Artifact** | 變更中的一個文件（提案、設計、任務或增量規格） |
| **Archive** | 完成變更並將其增量合併到主規格的過程 |
| **Change** | 一個對系統的建議修改，以包含產物的資料夾形式呈現 |
| **Delta spec** | 相對於當前規格所描述變更（ADDED/MODIFIED/REMOVED）的規格 |
| **Domain** | 規格的一個邏輯分組（例如：`auth/`、`payments/`） |
| **Requirement** | 系統必須具備的一個特定行為 |
| **Scenario** | 對於某一要求的具體範例，通常以 Given/When/Then 格式呈現 |
| **Schema** | 產物類型及其依賴關係的定義 |
| **Spec** | 用於描述系統行為的規格，包含要求事項和情境 (scenarios) |
| **Source of truth** | `openspec/specs/` 目錄，包含當前已同意的行為規範 |

## 下一步驟 (Next Steps)

- [Getting Started](getting-started.md) - 實際操作的第一步
- [Workflows](workflows.md) - 常見模式和何時使用它們
- [Commands](commands.md) - 完整的指令參考
- [Customization](customization.md) - 創建自定義架構定義並配置您的專案