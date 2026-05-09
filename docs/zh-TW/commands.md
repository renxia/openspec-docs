# 命令參考

這是 OpenSpec 斜線命令的參考說明。這些命令可在您的 AI 程式碼編寫助手聊天介面中呼叫（例如 Claude Code、Cursor、Windsurf）。

關於工作流程模式以及何時使用各個命令，請參閱[工作流程](workflows.md)。關於 CLI 命令，請參閱 [CLI](cli.md)。

## 快速參考

### 預設快速路徑（`core` 設定檔）

| 命令 | 用途 |
|---------|---------|
| `/opsx:propose` | 一步建立變更並生成規劃產物 |
| `/opsx:explore` | 在提交變更前先構思想法 |
| `/opsx:apply` | 實作變更中的任務 |
| `/opsx:sync` | 將差異規格合併至主要規格 |
| `/opsx:archive` | 封存已完成的變更 |

### 擴展工作流程命令（自訂工作流程選擇）

| 命令 | 用途 |
|---------|---------|
| `/opsx:new` | 開始一個新的變更架構 |
| `/opsx:continue` | 根據相依性建立下一個產物 |
| `/opsx:ff` | 快速前進：一次建立所有規劃產物 |
| `/opsx:verify` | 驗證實作是否符合產物 |
| `/opsx:bulk-archive` | 一次封存多個變更 |
| `/opsx:onboard` | 完整工作流程的引導式教學 |

預設的全域設定檔是 `core`。若要啟用擴展工作流程命令，請執行 `openspec config profile`，選擇工作流程，然後在您的專案中執行 `openspec update`。

---

## 指令參考

### `/opsx:propose`

一步建立新的變更並生成規劃產物。這是 `core` 設定檔中的預設起始指令。

**語法：**
```text
/opsx:propose [change-name-or-description]
```

**引數：**
| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `change-name-or-description` | 否 | 以 kebab-case 命名的名稱或自然語言的變更描述 |

**功能說明：**
- 建立 `openspec/changes/<change-name>/` 目錄
- 生成實作前所需的產物（對於 `spec-driven`：提案、規格、設計、任務）
- 當變更準備好執行 `/opsx:apply` 時停止

**範例：**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**提示：**
- 這是實現端到端最快速的路徑
- 如果您想要逐步控制產物，請啟用擴展工作流程並使用 `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

在投入變更之前，先思考想法、調查問題並釐清需求。

**語法：**
```
/opsx:explore [topic]
```

**引數：**
| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `topic` | 否 | 您想要探索或調查的主題 |

**功能說明：**
- 開啟一個無需結構的探索性對話
- 調查程式碼庫以回答問題
- 比較各種選項和方法
- 建立視覺化圖表以釐清思路
- 當洞見成形時，可以轉換到 `/opsx:propose`（預設）或 `/opsx:new`（擴展工作流程）

**範例：**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**提示：**
- 當需求不明確或需要調查時使用
- 探索期間不會建立任何產物
- 適合在決定前比較多種方法
- 可以讀取檔案並搜尋程式碼庫

---

### `/opsx:new`

開始一個新的變更架構。建立變更資料夾，並等待您使用 `/opsx:continue` 或 `/opsx:ff` 來生成產物。

此指令是擴展工作流程集的一部分（不包含在預設的 `core` 設定檔中）。

**語法：**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**引數：**
| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 變更資料夾的名稱（若未提供則會提示輸入） |
| `--schema` | 否 | 要使用的工作流程架構（預設：來自設定檔或 `spec-driven`） |

**功能說明：**
- 建立 `openspec/changes/<change-name>/` 目錄
- 在變更資料夾中建立 `.openspec.yaml` 元資料檔
- 顯示準備好建立的第一個產物範本
- 若未提供變更名稱和架構，則會提示輸入

**建立的內容：**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # 變更元資料（架構、建立日期）
```

**範例：**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**提示：**
- 使用描述性名稱：`add-feature`、`fix-bug`、`refactor-module`
- 避免使用通用名稱如 `update`、`changes`、`wip`
- 架構也可以在專案設定檔 (`openspec/config.yaml`) 中設定

---

### `/opsx:continue`

在依賴鏈中建立下一個產物。一次建立一個產物，以實現漸進式進展。

**語法：**
```
/opsx:continue [change-name]
```

**引數：**
| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要繼續哪個變更（若未提供則從上下文推斷） |

**功能說明：**
- 查詢產物依賴關係圖
- 顯示哪些產物已就緒，哪些被阻擋
- 建立第一個就緒的產物
- 讀取依賴檔案以獲取上下文
- 顯示建立後哪些產物變得可用

**範例：**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**提示：**
- 當您想在繼續前審閱每個產物時使用
- 適合需要控制權的複雜變更
- 多個產物可能同時就緒
- 您可以在繼續前編輯已建立的產物

---

### `/opsx:ff`

快速前進產物建立過程。一次建立所有規劃產物。

**語法：**
```
/opsx:ff [change-name]
```

**引數：**
| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要快速前進哪個變更（若未提供則從上下文推斷） |

**功能說明：**
- 按依賴順序建立所有產物
- 透過待辦事項清單追蹤進度
- 當所有 `apply-required` 產物完成時停止
- 在建立下一個產物前讀取每個依賴項

**範例：**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**提示：**
- 當您對要建構的內容有清晰的藍圖時使用
- 對於直接明瞭的變更，比 `/opsx:continue` 更快
- 您仍然可以在事後編輯產物
- 適合中小型功能

---

### `/opsx:apply`

實作變更中的任務。處理任務清單，編寫程式碼並勾選完成的項目。

**語法：**
```
/opsx:apply [change-name]
```

**引數：**
| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要實作哪個變更（若未提供則從上下文推斷） |

**功能說明：**
- 讀取 `tasks.md` 並識別未完成的任務
- 逐一處理任務
- 根據需要編寫程式碼、建立檔案、執行測試
- 使用核取方塊 `[x]` 將任務標記為完成

**範例：**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**提示：**
- 若中斷，可以從上次停止的地方繼續
- 透過指定變更名稱來用於平行變更
- 完成狀態在 `tasks.md` 的核取方塊中追蹤

---

### `/opsx:verify`

驗證實作是否符合您的變更產物。檢查完整性、正確性和一致性。

**語法：**
```
/opsx:verify [change-name]
```

**引數：**
| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要驗證哪個變更（若未提供則從上下文推斷） |

**功能說明：**
- 檢查實作品質的三個維度
- 在程式碼庫中搜尋實作證據
- 報告問題，並分類為 CRITICAL、WARNING 或 SUGGESTION
- 不會阻擋歸檔，但會顯示問題

**驗證維度：**

| 維度 | 驗證內容 |
|-----------|-------------------|
| **完整性** | 所有任務完成、所有需求已實作、情境已涵蓋 |
| **正確性** | 實作符合規格意圖、邊界情況已處理 |
| **一致性** | 設計決策反映在程式碼中、模式一致 |

**範例：**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**提示：**
- 在歸檔前執行，以提早發現不匹配之處
- 警告不會阻擋歸檔，但表示潛在問題
- 適合在提交前審閱 AI 的工作
- 可以揭示產物與實作之間的偏移

---

### `/opsx:sync`

**可選指令。** 將變更中的增量規格合併到主要規格中。歸檔時若需要會提示同步，因此您通常不需要手動執行此指令。

**語法：**
```
/opsx:sync [change-name]
```

**引數：**
| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要同步哪個變更（若未提供則從上下文推斷） |

**功能說明：**
- 讀取變更資料夾中的增量規格
- 解析 ADDED/MODIFIED/REMOVED/RENAMED 區段
- 將變更合併到主要的 `openspec/specs/` 目錄
- 保留增量中未提及的現有內容
- 不會歸檔變更（保持活躍狀態）

**範例：**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**何時手動使用：**

| 情境 | 使用同步？ |
|----------|-----------|
| 長期運行的變更，希望在歸檔前將規格放入主要規格中 | 是 |
| 多個平行變更需要更新後的基礎規格 | 是 |
| 想要單獨預覽/審閱合併結果 | 是 |
| 快速變更，直接歸檔 | 否（歸檔會處理） |

**提示：**
- 同步是智慧型的，不是單純的複製貼上
- 可以向現有需求新增情境而不會重複
- 同步後變更保持活躍（未歸檔）
- 大多數使用者永遠不需要直接呼叫此指令——歸檔時若需要會提示

---

### `/opsx:archive`

歸檔已完成的變更。完成變更並將其移至歸檔資料夾。

**語法：**
```
/opsx:archive [change-name]
```

**引數：**
| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要歸檔哪個變更（若未提供則從上下文推斷） |

**功能說明：**
- 檢查產物完成狀態
- 檢查任務完成情況（若未完成則警告）
- 若尚未同步，提供同步增量規格的選項
- 將變更資料夾移至 `openspec/changes/archive/YYYY-MM-DD-<name>/`
- 保留所有產物以供稽核追蹤

**範例：**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**提示：**
- 歸檔不會因任務未完成而阻擋，但會發出警告
- 增量規格可以在歸檔期間或之前同步
- 已歸檔的變更會保留作為歷史記錄
- 先使用 `/opsx:verify` 以發現問題

---

### `/opsx:bulk-archive`

一次歸檔多個已完成的變更。處理變更之間的規格衝突。

**語法：**
```
/opsx:bulk-archive [change-names...]
```

**引數：**
| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `change-names` | 否 | 要歸檔的特定變更（若未提供則提示選擇） |

**功能說明：**
- 列出所有已完成的變更
- 在歸檔前驗證每個變更
- 偵測變更之間的規格衝突
- 透過檢查實際實作內容來解決衝突
- 按時間順序歸檔

**範例：**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**提示：**
- 適合平行工作流
- 衝突解決是智慧型的（檢查程式碼庫）
- 變更按建立順序歸檔
- 在覆寫規格內容前會提示

---

### `/opsx:onboard`

引導式入門，體驗完整的 OpenSpec 工作流程。一個使用您實際程式碼庫的互動式教學。

**語法：**
```
/opsx:onboard
```

**功能說明：**
- 帶領您完成一個完整的工作流程循環，並附帶解說
- 掃描您的程式碼庫以尋找實際的改進機會
- 使用真實產物建立一個實際的變更
- 實作實際的工作（小型、安全的變更）
- 歸檔已完成的變更
- 在每個步驟發生時進行解釋

**階段：**
1. 歡迎與程式碼庫分析
2. 尋找改進機會
3. 建立變更 (`/opsx:new`)
4. 撰寫提案
5. 建立規格
6. 撰寫設計
7. 建立任務
8. 實作任務 (`/opsx:apply`)
9. 驗證實作
10. 歸檔變更
11. 總結與後續步驟

**範例：**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**提示：**
- 最適合學習工作流程的新使用者
- 使用真實程式碼，而非玩具範例
- 建立一個您可以保留或丟棄的真實變更
- 完成需要 15-30 分鐘

---

## 依 AI 工具區分的指令語法

不同的 AI 工具使用略微不同的指令語法。請使用與您工具相符的格式：

| 工具 | 語法範例 |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | 基於技能的調用，例如 `/skill:openspec-propose`, `/skill:openspec-apply-change`（不生成 `opsx-*` 指令檔案） |
| Trae | 基於技能的調用，例如 `/openspec-propose`, `/openspec-apply-change`（不生成 `opsx-*` 指令檔案） |

各工具的意圖相同，但指令的呈現方式可能因整合方式而異。

> **注意：** GitHub Copilot 指令（`.github/prompts/*.prompt.md`）僅在 IDE 擴充套件（VS Code、JetBrains、Visual Studio）中可用。GitHub Copilot CLI 目前不支援自訂提示檔案 — 詳情和解決方法請參閱[支援的工具](supported-tools.md)。

---

## 舊版指令

這些指令使用較舊的「一次性完成」工作流程。它們仍然有效，但建議使用 OPSX 指令。

| 指令 | 功能說明 |
|---------|--------------|
| `/openspec:proposal` | 一次性建立所有產出物（提案、規格、設計、任務） |
| `/openspec:apply` | 實施變更 |
| `/openspec:archive` | 封存變更 |

**何時使用舊版指令：**
- 使用舊工作流程的現有專案
- 不需要增量產出物建立的簡單變更
- 偏好全有或全無的方式

**遷移至 OPSX：**
舊版變更可以使用 OPSX 指令繼續。產出物結構是相容的。

---

## 疑難排解

### "找不到變更"

指令無法識別要處理哪個變更。

**解決方案：**
- 明確指定變更名稱：`/opsx:apply add-dark-mode`
- 檢查變更資料夾是否存在：`openspec list`
- 確認您位於正確的專案目錄中

### "沒有準備好的產出物"

所有產出物要么已完成，要么因缺少依賴項而被阻塞。

**解決方案：**
- 執行 `openspec status --change <name>` 以查看阻塞原因
- 檢查所需產出物是否存在
- 先建立缺少的依賴產出物

### "找不到架構"

指定的架構不存在。

**解決方案：**
- 列出可用架構：`openspec schemas`
- 檢查架構名稱的拼寫
- 如果是自訂架構，請建立它：`openspec schema init <name>`

### 指令無法識別

AI 工具無法識別 OpenSpec 指令。

**解決方案：**
- 確保 OpenSpec 已初始化：`openspec init`
- 重新生成技能：`openspec update`
- 檢查 `.claude/skills/` 目錄是否存在（適用於 Claude Code）
- 重新啟動您的 AI 工具以載入新技能

### 產出物生成不正確

AI 建立了不完整或不正確的產出物。

**解決方案：**
- 在 `openspec/config.yaml` 中新增專案上下文
- 為特定指導新增每個產出物的規則
- 在變更描述中提供更多細節
- 使用 `/opsx:continue` 而非 `/opsx:ff` 以獲得更多控制

---

## 後續步驟

- [工作流程](workflows.md) - 常見模式及何時使用每個指令
- [CLI](cli.md) - 用於管理和驗證的終端指令
- [自訂](customization.md) - 建立自訂架構和工作流程