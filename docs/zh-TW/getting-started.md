# 入門指南

本指南說明在您安裝並初始化 OpenSpec 後，它如何運作。若需安裝說明，請參閱[主要說明文件](index.md#quick-start)。

## 運作原理

OpenSpec 能幫助您和您的 AI 程式設計助手在編寫任何程式碼之前，就「要建構什麼」達成共識。

**預設快速路徑（核心設定檔）：**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**擴展路徑（自訂工作流程選擇）：**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

預設的全域設定檔是 `core`，包含 `propose`、`explore`、`apply`、`sync` 和 `archive`。您可以透過 `openspec config profile` 然後執行 `openspec update` 來啟用擴展的工作流程命令。

## OpenSpec 建立的內容

執行 `openspec init` 後，您的專案將具有以下結構：

```
openspec/
├── specs/              # 真實來源（您系統的行為）
│   └── <domain>/
│       └── spec.md
├── changes/            # 提議的更新（每個變更一個資料夾）
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # 差異規格（正在變更的內容）
│           └── <domain>/
│               └── spec.md
└── config.yaml         # 專案配置（可選）
```

**兩個關鍵目錄：**

- **`specs/`** - 真實來源。這些規格描述您系統目前的行為。按領域組織（例如 `specs/auth/`、`specs/payments/`）。

- **`changes/`** - 提議的修改。每個變更都有自己的資料夾，包含所有相關產出物。當變更完成時，其規格會合併到主要的 `specs/` 目錄中。

## 理解產出物

每個變更資料夾都包含引導工作的產出物：

| 產出物 | 用途 |
|----------|---------|
| `proposal.md` | 「為什麼」和「是什麼」 - 記錄意圖、範圍和方法 |
| `specs/` | 顯示新增/修改/移除需求的差異規格 |
| `design.md` | 「如何做」 - 技術方法和架構決策 |
| `tasks.md` | 帶有核取方塊的實作檢查清單 |

**產出物相互建構：**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            隨著學習不斷更新
```

您隨時可以回頭，根據實作過程中的新發現來完善先前的產出物。

## 差異規格的運作方式

差異規格是 OpenSpec 的關鍵概念。它們顯示相對於您目前規格正在發生的變更。

### 格式

差異規格使用章節來指示變更類型：

```markdown
# Auth 的差異規格

## 新增的需求

### 需求：雙因素驗證
系統必須在登入時要求第二個驗證因素。

#### 情境：需要 OTP
- 假設使用者已啟用 2FA
- 當使用者提交有效的憑證時
- 則呈現 OTP 驗證挑戰

## 修改的需求

### 需求：工作階段逾時
系統應在 30 分鐘不活動後使工作階段過期。
（先前：60 分鐘）

#### 情境：閒置逾時
- 假設有一個已驗證的工作階段
- 當 30 分鐘過去且無活動時
- 則該工作階段被宣告無效

## 移除的需求

### 需求：記住我
（已棄用，改用 2FA）
```

### 歸檔時發生什麼

當您歸檔一個變更時：

1. **新增的**需求會附加到主要規格中
2. **修改的**需求會替換現有版本
3. **移除的**需求會從主要規格中刪除

變更資料夾會移至 `openspec/changes/archive/` 以供稽核歷史記錄。

## 範例：您的第一個變更

讓我們逐步為應用程式新增深色模式。

### 1. 開始變更（預設）

```text
您：/opsx:propose add-dark-mode

AI：  已建立 openspec/changes/add-dark-mode/
     ✓ proposal.md — 我們為什麼這樣做，變更了什麼
     ✓ specs/       — 需求和情境
     ✓ design.md    — 技術方法
     ✓ tasks.md     — 實作檢查清單
     準備好進行實作！
```

如果您已啟用擴展的工作流程設定檔，也可以分兩步完成：先 `/opsx:new` 然後 `/opsx:ff`（或逐步使用 `/opsx:continue`）。

### 2. 建立的內容

**proposal.md** - 記錄意圖：

```markdown
# 提案：新增深色模式

## 意圖
使用者要求新增深色模式選項，以減少夜間使用時的眼睛疲勞。

## 範圍
- 在設定中新增主題切換
- 支援系統偏好偵測
- 在 localStorage 中儲存偏好設定

## 方法
使用 CSS 自訂屬性進行主題設定，並使用 React context 進行狀態管理。
```

**specs/ui/spec.md** - 顯示新需求的差異規格：

```markdown
# UI 的差異規格

## 新增的需求

### 需求：主題選擇
系統應允許使用者在淺色和深色主題之間選擇。

#### 情境：手動切換
- 假設使用者在任何頁面上
- 當使用者點擊主題切換時
- 則主題立即切換
- 且該偏好設定在不同工作階段間持續存在

#### 情境：系統偏好
- 假設使用者沒有儲存的偏好設定
- 當應用程式載入時
- 則使用系統偏好的色彩配置
```

**tasks.md** - 實作檢查清單：

```markdown
# 任務

## 1. 主題基礎架構
- [ ] 1.1 建立具有淺色/深色狀態的 ThemeContext
- [ ] 1.2 為顏色新增 CSS 自訂屬性
- [ ] 1.3 實作 localStorage 持久化

## 2. UI 元件
- [ ] 2.1 建立 ThemeToggle 元件
- [ ] 2.2 在設定頁面新增切換開關
- [ ] 2.3 更新 Header 以包含快速切換

## 3. 樣式
- [ ] 3.1 定義深色主題色彩調色盤
- [ ] 3.2 更新元件以使用 CSS 變數
```

### 3. 實作

```
您：/opsx:apply

AI：  正在處理任務...
     ✓ 1.1 已建立具有淺色/深色狀態的 ThemeContext
     ✓ 1.2 已在 globals.css 中新增 CSS 自訂屬性
     ✓ 1.3 已實作 localStorage 持久化
     ✓ 2.1 已建立 ThemeToggle 元件
     ...
     所有任務完成！
```

在實作過程中，如果您發現設計需要調整，只需更新產出物並繼續即可。

### 4. 歸檔

```
您：/opsx:archive

AI：  正在歸檔 add-dark-mode...
     ✓ 已將規格合併至 openspec/specs/ui/spec.md
     ✓ 已移至 openspec/changes/archive/2025-01-24-add-dark-mode/
     完成！準備好進行下一個功能。
```

您的差異規格現在已成為主要規格的一部分，記錄了您系統的運作方式。

## 驗證與審查

使用 CLI 來檢查您的變更：

```bash
# 列出作用中的變更
openspec list

# 檢視變更詳情
openspec show add-dark-mode

# 驗證規格格式
openspec validate add-dark-mode

# 互動式儀表板
openspec view
```

## 後續步驟

- [工作流程](workflows.md) - 常見模式以及何時使用每個命令
- [命令](commands.md) - 所有斜線命令的完整參考
- [概念](concepts.md) - 更深入理解規格、變更和結構描述
- [自訂](customization.md) - 讓 OpenSpec 以您的方式運作