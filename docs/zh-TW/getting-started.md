# 入門指南

本指南解釋了您安裝並初始化 OpenSpec 之後它的運作方式。有關安裝說明，請參閱 [主 README](../index.md#quick-start) 或 [安裝指南](installation.md)。對於整個文件集的新手？[文件總覽](index.md) 會為您梳理所有內容。

> **我在哪裡輸入這些指令？** 有兩個地方，混淆這兩者是初期的最常見失誤。
>
> - `openspec ...` 指令（例如 `openspec init`）是在您的**終端機 (terminal)** 中執行的。
> - `/opsx:...` 指令（例如 `/opsx:propose`）是在您的**AI 助理的聊天介面**中執行的，也就是您要求它編寫程式碼的同一個框體。
>
> 沒有獨立的「互動模式」來啟動。您只需在聊天中輸入斜線指令，您的助理就會從那裡開始工作。完整解釋：[如何運作的指令](how-commands-work.md)。

## 您的前五分鐘

完整的流程，並標註每個步驟發生的位置：

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (可選：先思考一下)
AI CHAT      /opsx:propose add-dark-mode      (AI 草擬計畫；您再審閱)
AI CHAT      /opsx:apply                      (AI 進行建構)
AI CHAT      /opsx:archive                    (規格已更新，變更已歸檔)
```

需要兩個終端機步驟來設定，之後您就在聊天介面中工作。本指南的其餘部分將詳細說明每個步驟的功能以及您會看到什麼。

> **還不確定要建構什麼？請從 `/opsx:explore` 開始。** 這是一個零風險的思考夥伴，它會閱讀您的程式碼庫、權衡選項，並在任何成品或程式碼存在之前，將一個模糊的想法塑造成具體的計畫。當畫面變得清晰後，它就會交接給 `/opsx:propose`。這是與 AI 合作的最佳習慣，因為否則該 AI 會自信地建構出錯誤的東西。請參閱 [探索指南](explore.md)。

## 原理運作方式

OpenSpec 幫助您和您的 AI 編碼助理在編寫任何程式碼之前就達成共識，確定要建構什麼。

**預設快速路徑（核心配置）：**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (可選)
```

當您還在弄清楚該做什麼時，請從 `/opsx:explore` 開始；如果您已經知道，則可以直接跳到 `/opsx:propose`。探索功能包含在預設配置中，因此無論何時需要它，它都會在那裡。

**擴展路徑（客製化工作流程選擇）：**

```text
/opsx:new ──► /opsx:ff 或 /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

預設的全局配置是 `core`，它包含 `propose`、`explore`、`apply`、`sync` 和 `archive`。您可以使用 `openspec config profile` 並接著使用 `openspec update` 來啟用擴展工作流程指令。

## OpenSpec 創建了什麼？

運行 `openspec init` 後，您的專案結構如下：

```
openspec/
├── specs/              # 真實依據 (您系統的行為)
│   └── <domain>/
│       └── spec.md
├── changes/            # 建議更新（每個變更一個資料夾）
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta 規格 (正在改變的部分)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # 專案配置（可選）
```

**兩個關鍵目錄：**

- **`specs/`** - 真實依據。這些規格描述了您的系統當前如何運作。按領域分類（例如 `specs/auth/`、`specs/payments/`）。

- **`changes/`** - 建議的修改。每個變更都會擁有自己的資料夾，包含所有相關的成品 (artifacts)。當一個變更完成時，它的規格就會合併到主 `specs/` 目錄中。

## 理解成品 (Artifacts)

每個變更資料夾都包含指導工作的成品：

| 成品 | 用途 |
|----------|---------|
| `proposal.md` | 「為什麼」和「是什麼」— 捕捉意圖、範圍和方法 |
| `specs/` | Delta 規格，顯示新增/修改/移除的需求 |
| `design.md` | 「如何做」— 技術方法和架構決策 |
| `tasks.md` | 帶有勾選框的實作清單 |

**成品之間是層層遞進的：**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            隨著學習而更新
```

您隨時都可以回溯並完善早期的成品，因為在實作過程中您可能會學到更多東西。

## Delta 規格的運作方式

Delta 規格是 OpenSpec 的核心概念。它顯示了相對於當前規格的變化內容。

### 格式

Delta 規格使用區塊來指示變更類型：

```markdown
# Auth 的 Delta

## 新增的需求 (ADDED Requirements)

### Requirement: 雙因素認證 (Two-Factor Authentication)
系統必須在登入時要求第二個驗證因子。

#### Scenario: OTP 要求
- GIVEN 一位已啟用 2FA 的使用者
- WHEN 使用者提交有效的憑證
- THEN 會呈現一個 OTP 挑戰

## 修改的需求 (MODIFIED Requirements)

### Requirement: Session 超時
系統應在一段時間不活躍後 30 分鐘內使 session 過期。
(先前：60 分鐘)

#### Scenario: 不活動超時
- GIVEN 一個已認證的 session
- WHEN 30 分鐘沒有活動發生
- THEN session 將被失效化

## 移除的需求 (REMOVED Requirements)

### Requirement: 記住我 (Remember Me)
(因導入 2FA 而棄用)
```

### 歸檔時會發生什麼？

當您歸檔一個變更時：

1. **ADDED** 的需求會被附加到主規格中。
2. **MODIFIED** 的需求會取代現有的版本。
3. **REMOVED** 的需求會從主規格中刪除。

該變更資料夾會移動到 `openspec/changes/archive/` 以供稽核歷史使用。

## 範例：您的第一個變更

讓我們走一遍為應用程式新增深色模式的流程。

### 1. 開始變更（預設）

```text
You: /opsx:propose add-dark-mode

AI:  已建立 openspec/changes/add-dark-mode/
     ✓ proposal.md — 我們為何要做這件事、正在改變什麼
     ✓ specs/       — 需求和情境
     ✓ design.md    — 技術方法
     ✓ tasks.md     — 實作清單
     準備好進行實作！
```

如果您啟用了擴展工作流程配置，您也可以將其作為兩個步驟完成：`/opsx:new` 然後 `/opsx:ff`（或漸進式的 `/opsx:continue`）。

### 2. 會創建哪些內容？

**proposal.md** - 捕捉意圖：

```markdown
# Proposal: 新增深色模式 (Add Dark Mode)

## Intent (意圖)
使用者要求提供深色模式選項，以減輕夜間使用的眼睛疲勞。

## Scope (範圍)
- 在設定中新增主題切換開關
- 支援系統偏好偵測
- 將偏好儲存在 localStorage 中

## Approach (方法)
使用 CSS 自定義屬性來進行主題化，並搭配 React context 來管理狀態。
```

**specs/ui/spec.md** - Delta 顯示新需求：

```markdown
# UI 的 Delta

## 新增的需求 (ADDED Requirements)

### Requirement: 主題選擇 (Theme Selection)
系統應允許使用者在淺色和深色主題之間進行選擇。

#### Scenario: 手動切換 (Manual toggle)
- GIVEN 一位處於任何頁面的使用者
- WHEN 使用者點擊主題切換開關
- THEN 主題會立即切換
- AND 偏好會在不同 session 間保持一致

#### Scenario: 系統偏好 (System preference)
- GIVEN 一位沒有儲存偏好的使用者
- WHEN 應用程式載入時
- THEN 會使用系統偏好的配色方案
```

**tasks.md** - 實作清單：

```markdown
# Tasks (任務)

## 1. 主題基礎設施 (Theme Infrastructure)
- [ ] 1.1 使用 light/dark 狀態創建 ThemeContext
- [ ] 1.2 為顏色新增 CSS 自定義屬性
- [ ] 1.3 實作 localStorage 持久化

## 2. UI 組件 (UI Components)
- [ ] 2.1 創建 ThemeToggle 組件
- [ ] 2.2 在設定頁中加入切換開關
- [ ] 2.3 更新 Header 以包含快速切換功能

## 3. 樣式設計 (Styling)
- [ ] 3.1 定義深色主題配色方案
- [ ] 3.2 更新組件以使用 CSS 變數
```

### 3. 實作

```
You: /opsx:apply

AI:  正在執行任務...
     ✓ 1.1 已創建包含 light/dark 狀態的 ThemeContext
     ✓ 1.2 已將 CSS 自定義屬性新增到 globals.css
     ✓ 1.3 已實作 localStorage 持久化
     ✓ 2.1 已創建 ThemeToggle 組件
     ...
     所有任務均已完成！
```

在實作過程中，如果您發現設計需要調整，只需更新該成品 (artifact) 並繼續即可。

### 4. 歸檔

```
You: /opsx:archive

AI:  正在歸檔 add-dark-mode...
     ✓ 已將規格合併到 openspec/specs/ui/spec.md
     ✓ 已移動至 openspec/changes/archive/2025-01-24-add-dark-mode/
     完成！準備好迎接下一個功能。
```

您的 Delta 規格現在已成為主規格的一部分，記錄著您的系統運作方式。

## 驗證與審閱

使用 CLI 來檢查您的變更：

```bash
# 列出活躍的變更
openspec list

# 查看變更詳情
openspec show add-dark-mode

# 驗證規格格式
openspec validate add-dark-mode

# 互動式儀表板
openspec view
```

## 下一步驟

- [先進行探索 (Explore First)](explore.md) - 使用 `/opsx:explore` 在提交前思考一個想法。
- [在現有專案中使用 OpenSpec](existing-projects.md) - 從大型的棕地 (brownfield) 程式碼庫開始工作。
- [編輯與迭代變更 (Editing & Iterating on a Change)](editing-changes.md) - 更新成品，回溯並協調手動編輯。
- [核心概念概覽 (Core Concepts at a Glance)](overview.md) - 在單頁上了解整個思維模型。
- [範例與食譜 (Examples & Recipes)](examples.md) - 從頭到尾的真實變更案例。
- [工作流程 (Workflows)](workflows.md) - 常見模式以及何時使用每個指令。
- [指令 (Commands)](commands.md) - 所有斜線指令的完整參考資料。
- [概念 (Concepts)](concepts.md) - 對規格、變更和 Schema 更深入的理解。
- [客製化 (Customization)](customization.md) - 使 OpenSpec 符合您的工作方式。
- [儲存庫 (Stores)](stores-beta/user-guide.md) - 規劃跨專案或團隊？請將其保留在自己的儲存庫中（Beta）。
- [FAQ](faq.md) 和 [疑難排解 (Troubleshooting)](troubleshooting.md) - 當您遇到困難時。