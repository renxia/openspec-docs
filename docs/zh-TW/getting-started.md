# 快速開始

本指南說明你在安裝並初始化 OpenSpec 後，該工具的使用方式。安裝說明可參閱[主要 README](../index.md#quick-start)或[安裝指南](installation.md)。剛接觸這份文件集？[文件首頁](index.md)會幫你梳理所有內容的對應關係。

> **這些指令要輸入在哪裡？** 只有兩個地方，搞混是新手最常遇到的初學者失誤。
>
> - `openspec ...` 系列指令（例如 `openspec init`）要在你的**終端機**執行。
> - `/opsx:...` 系列指令（例如 `/opsx:propose`）要在你的**AI 助理的對話視窗**執行，也就是你通常會請它撰寫程式碼的那個輸入框。
>
> 沒有額外的「互動模式」需要啟動，只要在對話視窗輸入斜線指令，你的助理就會接手後續流程。完整說明可參閱[指令運作方式](how-commands-work.md)。

## 前五分鐘快速上手

完整流程如下，每個步驟都標註了執行位置：

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

只要先在終端機完成兩個設定步驟，後續所有操作都會在對話視窗進行。本指南其餘部分會詳細說明每個步驟的用途與執行結果。

> **還不確定要開發什麼功能？先從 `/opsx:explore` 開始。** 這是一個零風險的思考夥伴，會讀取你的程式碼庫、權衡各種選項，把模糊的想法打磨成具體計畫，全程不會產生任何產出檔案或程式碼。當方向明確後，它會交接給 `/opsx:propose` 繼續執行。這是與 AI 協作時最重要的習慣，能避免 AI 自信滿滿地做出錯誤的產出。詳情可參閱[探索指南](explore.md)。

## 運作原理

OpenSpec 能協助你與 AI 程式開發助理在撰寫任何程式碼前，先確認要開發的內容。

**預設快速路徑（核心設定檔）：**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

如果你還在釐清要做的內容，可以先從 `/opsx:explore` 開始；如果已經有明確方向，也可以直接跳過這一步使用 `/opsx:propose`。探索功能包含在預設設定檔中，隨時都可以使用。

**擴展路徑（自訂工作流程選擇）：**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

全域預設設定檔為 `core`，包含 `propose`、`explore`、`apply`、`sync` 和 `archive` 五個指令。你可以透過 `openspec config profile` 啟用擴展工作流程指令，再執行 `openspec update` 完成設定。

## OpenSpec 會建立的檔案結構

執行 `openspec init` 後，你的專案會產生以下結構：

```
openspec/
├── specs/              # 系統行為的唯一依據
│   └── <domain>/
│       └── spec.md
├── changes/            #  proposed 的更新內容（每個變更一個獨立資料夾）
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # 差異規格文件（標註變更內容）
│           └── <domain>/
│               └── spec.md
└── config.yaml         # 專案設定檔（選填）
```

**兩個核心資料夾：**

- **`specs/`** - 系統行為的唯一依據。這些規格文件描述你系統目前的運作方式，依功能領域組織（例如 `specs/auth/`、`specs/payments/`）。
- **`changes/`** -  proposed 的修改內容。每個變更都會有獨立資料夾，存放所有相關產出檔案。當變更完成後，對應的規格文件會合併到主要的 `specs/` 目錄中。

## 產出檔案說明

每個變更資料夾都會包含引導開發流程的產出檔案：

| 產出檔案 | 用途 |
|----------|------|
| `proposal.md` | 「為什麼做、做什麼」- 記錄目標、範圍與實作方向 |
| `specs/` | 差異規格文件，標示新增/修改/移除的需求 |
| `design.md` | 「怎麼做」- 技術方案與架構決策 |
| `tasks.md` | 附有核取方塊的實作檢查清單 |

**產出檔案彼此層層關聯：**

```text
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

在實作過程中如果學到更多資訊，你可以隨時回頭調整先前的產出檔案。

## 差異規格文件的運作方式

差異規格文件是 OpenSpec 的核心概念，用來標示相對於現有規格的變更內容。

### 格式

差異規格文件使用不同區段標示變更類型：

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

### 封存時的處理流程

當你封存一個變更時：
1. **新增**的需求會附加到主要規格文件末尾
2. **修改**的需求會取代現有版本
3. **移除**的需求會從主要規格文件中刪除

變更資料夾會移動到 `openspec/changes/archive/` 目錄，供稽核留存。

## 範例：你的第一個變更

我們以為應用程式新增深色模式為例，逐步說明流程。

### 1. 啟動變更（預設方式）

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

如果你已啟用擴展工作流程設定檔，也可以分兩步完成：先執行 `/opsx:new`，再執行 `/opsx:ff`（或逐步執行 `/opsx:continue`）。

### 2. 會產生的檔案

**proposal.md** - 記錄目標：

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

**specs/ui/spec.md** - 標示新增需求的差異規格文件：

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

**tasks.md** - 實作檢查清單：

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

### 3. 實作

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

實作過程中如果發現設計需要調整，只要更新對應的產出檔案並繼續執行即可。

### 4. 封存

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

你的差異規格文件現在已納入主要規格文件，成為系統運作方式的正式文件。

## 驗證與審查

使用 CLI 工具查看你的變更狀態：

```bash
# 列出所有進行中的變更
openspec list

# 查看變更詳細內容
openspec show add-dark-mode

# 驗證規格文件格式是否正確
openspec validate add-dark-mode

# 開啟互動式儀表板
openspec view
```

## 後續步驟

- [先探索再決定](explore.md) - 在確認開發方向前，先用 `/opsx:explore` 梳理想法
- [審查變更內容](reviewing-changes.md) - AI 起草計畫後、撰寫程式碼前，需要檢查的事項
- [撰寫優質規格文件](writing-specs.md) - 優良需求與情境的撰寫範例
- [在現有專案中使用 OpenSpec](existing-projects.md) - 在大型舊有程式碼庫上開始使用
- [編輯與迭代變更內容](editing-changes.md) - 更新產出檔案、回頭調整、整合手動修改
- [核心概念一覽](overview.md) - 單頁梳理完整心智模型
- [範例與實踐指南](examples.md) - 真實變更的完整流程
- [工作流程](workflows.md) - 常見模式與各指令的使用時機
- [指令清單](commands.md) - 所有斜線指令的完整參考文件
- [概念說明](concepts.md) - 深入理解規格文件、變更與結構描述
- [自訂設定](customization.md) - 讓 OpenSpec 符合你的使用習慣
- [Stores（儲存庫）](stores-beta/user-guide.md) - 需要跨儲存庫或團隊的規劃？將內容存在獨立儲存庫即可（beta 版）
- [常見問題](faq.md)與[疑難排解](troubleshooting.md) - 遇到問題時查閱