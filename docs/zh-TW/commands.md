# 命令

這是 OpenSpec 斜線命令的參考文件。這些命令會在您的 AI 編程助手的聊天介面（例如 Claude Code、Cursor、Windsurf）中調用。

如需了解工作流程模式以及各命令的使用時機，請參閱[工作流程](workflows.md)。如需了解 CLI 命令，請參閱[CLI](cli.md)。

## 快速參考

### 預設快速路徑（`core` 設定檔）

| 命令 | 用途 |
|---------|---------|
| `/opsx:propose` | 建立變更並一步生成規劃產物 |
| `/opsx:explore` | 在確認要進行變更前先構思想法 |
| `/opsx:apply` | 實作變更中的任務 |
| `/opsx:update` | 修訂變更的規劃產物並保持其一致性 |
| `/opsx:sync` | 將增量規格合併至主規格 |
| `/opsx:archive` | 封存已完成的變更 |

### 擴展工作流程命令（自訂工作流程選擇）

| 命令 | 用途 |
|---------|---------|
| `/opsx:new` | 啟動新的變更脚手架 |
| `/opsx:continue` | 根據相依性建立下一個產物 |
| `/opsx:ff` | 快速前進：一次建立所有規劃產物 |
| `/opsx:verify` | 驗證實作內容與產物一致 |
| `/opsx:bulk-archive` | 一次封存多個變更 |
| `/opsx:onboard` | 透過引導式教程走完整個工作流程

預設全域設定檔為 `core`。若要啟用擴展工作流程命令，請在您的專案中執行 `openspec config profile`，選擇工作流程，接著執行 `openspec update`。

## 命令參考

### `/opsx:propose`

一次性建立新變更並生成規劃產物。這是 `core` 設定檔中的預設起始指令。

**語法：**
```text
/opsx:propose [change-name-or-description]
```

**參數：**
| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-name-or-description` | 否 | kebab-case 格式的名稱或自然語言變更描述 |

**功能說明：**
- 建立 `openspec/changes/<change-name>/` 目錄
- 生成實作前所需的產物（`spec-driven` 模式下包含：提案、規格、設計、任務）
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
- 適用於需要最快完成端到端流程的場景
- 若需要逐步控制產物生成，可啟用擴展工作流，並使用 `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **當你沒有明確方向時，從這裡開始。** Explore 是一個無風險的思考夥伴：它會讀取你的程式碼庫、比較不同選項，並在建立任何變更之前，將模糊的想法梳理成具體的計畫。它內建於預設設定檔中。完整案例與更多範例請參閱 [探索優先](explore.md) 指南。

在確立變更之前，思考構想、調查問題、釐清需求。

**語法：**
```
/opsx:explore [topic]
```

**參數：**
| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `topic` | 否 | 你想探索或調查的主題 |

**功能說明：**
- 開啟無結構限制的探索性對話
- 調查程式碼庫以回答問題
- 比較不同選項與做法
- 生成視覺化圖表以釐清思路
- 當思路清晰時，可切換至 `/opsx:propose`（預設）或 `/opsx:new`（擴展工作流）

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
- 適用於需求不明確、需要進一步調查的場景
- 探索過程中不會產生任何產物
- 適合在做出決定前比較多種做法
- 可讀取檔案並搜尋程式碼庫

---

### `/opsx:new`

建立新變更的基礎框架。會建立變更資料夾，並等待你使用 `/opsx:continue` 或 `/opsx:ff` 生成產物。此指令屬於擴展工作流套件（未包含在預設 `core` 設定檔中）。

**語法：**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**參數：**
| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-name` | 否 | 變更資料夾的名稱（未提供時會提示輸入） |
| `--schema` | 否 | 要使用的工作流 schema（預設值來自配置或 `spec-driven`） |

**功能說明：**
- 建立 `openspec/changes/<change-name>/` 目錄
- 在變更資料夾中建立 `.openspec.yaml` 元數據檔案
- 顯示第一個待建立的產物範本
- 未提供時提示輸入變更名稱與 schema

**建立內容：**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # 變更元數據（schema、建立日期）
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
- 使用描述性名稱，例如 `add-feature`、`fix-bug`、`refactor-module`
- 避免使用 `update`、`changes`、`wip` 這類籠統的名稱
- Schema 也可在專案配置檔（`openspec/config.yaml`）中設定

---

### `/opsx:continue`

依賴鏈中的下一個產物。一次建立一個產物，實現漸進式推進。

**語法：**
```
/opsx:continue [change-name]
```

**參數：**
| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-name` | 否 | 要繼續的變更名稱（未提供時會從上下文推斷） |

**功能說明：**
- 查詢產物依賴圖
- 顯示哪些產物已就緒、哪些被阻擋
- 建立第一個已就緒的產物
- 讀取依賴檔案以獲取上下文
- 顯示建立後可使用的產物

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
- 適用於希望在繼續之前審查每個產物的場景
- 適合需要掌控流程的複雜變更
- 可能同時有多個產物進入就緒狀態
- 在繼續之前，你可以編輯已建立的產物

---

### `/opsx:ff`

快速跳過產物建立環節，一次建立所有規劃產物。

**語法：**
```
/opsx:ff [change-name]
```

**參數：**
| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-name` | 否 | 要快速推進的變更名稱（未提供時會從上下文推斷） |

**功能說明：**
- 依照依賴順序建立所有產物
- 透過待辦清單追蹤進度
- 當所有需要 `apply` 的產物都建立完成時停止
- 建立下一個產物前，會先讀取對應的依賴內容

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
- 適用於你對要開發的內容有明確規劃的場景
- 對於簡單的變更，比 `/opsx:continue` 更高效
- 建立完成後仍可編輯產物
- 適合中小型功能開發

---

### `/opsx:apply`

執行變更中的任務。按照任務清單逐步編寫程式碼並標記完成項目。

**語法：**
```
/opsx:apply [change-name]
```

**參數：**
| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-name` | 否 | 要執行的變更名稱（未提供時會從上下文推斷） |

**功能說明：**
- 讀取 `tasks.md` 並找出未完成的任務
- 逐個處理任務
- 視需要編寫程式碼、建立檔案、執行測試
- 使用勾選框 `[x]` 標記任務完成

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
- 若執行中斷，可從中斷處繼續
- 透過指定變更名稱，可平行處理多個變更
- 完成狀態會記錄在 `tasks.md` 的勾選框中

---

### `/opsx:update`

修訂變更的既有規劃產物，並確保所有產物之間的一致性。僅處理規劃產物，不會修改程式碼。

**語法：**

```text
/opsx:update [change-name]
```

**參數：**

| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-name` | 否 | 要修訂的變更名稱（未提供時會從上下文推斷） |

**功能說明：**

- 透過 `openspec status --change <name> --json` 讀取變更的產物
- 套用你指定的修訂內容；若未明確指定修訂內容，則檢查產物之間的矛盾之處
- 協調其他既有產物的內容（例如修改設計可能會反向影響提案內容）
- 每次寫入前都會逐一與你確認每個編輯內容
- 結束時會建議下一步操作：若產物缺失則執行 `/opsx:continue`、若要將修訂後的計畫落地為程式碼則執行 `/opsx:apply`、若全部完成則執行 `/opsx:archive`

**範例：**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**提示：**

- 不會建立遺漏的產物，此功能由 `/opsx:continue` 提供
- 若變更已經實作完成，請後續執行 `/opsx:apply` 確保程式碼與修訂後的計畫一致
- 若你的修訂內容改變了變更的*核心目的*，建議重新建立一個新變更（詳見 [何時修訂 vs. 重新開始](opsx.md#when-to-update-vs-start-fresh)）

---

### `/opsx:verify`

驗證實作內容與變更產物是否一致。檢查完整性、正確性與連貫性。

**語法：**
```
/opsx:verify [change-name]
```

**參數：**
| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-name` | 否 | 要驗證的變更名稱（未提供時會從上下文推斷） |

**功能說明：**
- 從三個維度檢查實作品質
- 搜尋程式碼庫中的實作證據
- 將問題歸類為「嚴重（CRITICAL）」、「警告（WARNING）」或「建議（SUGGESTION）」後回報
- 不會阻擋歸檔操作，但會列出發現的問題

**驗證維度：**

| 維度 | 驗證內容 |
|-----------|-------------------|
| **Completeness** | 所有任務已完成、所有需求已實作、所有場景已覆蓋 |
| **Correctness** | 實作內容符合規格意圖、邊界情況已處理 |
| **Coherence** | 設計決策已反映在程式碼中、模式保持一致 |

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
- 在歸檔前執行，及早發現不一致之處
- 警告不會阻擋歸檔，但代表可能存在潛在問題
- 適合在提交前審查 AI 的實作內容
- 可發現產物與實作之間的偏差

---

### `/opsx:sync`

**可選指令。** 將變更中的差異規格合併到主規格中。歸檔時若需要同步會自動提示，因此通常不需要手動執行此指令。

**語法：**
```
/opsx:sync [change-name]
```

**參數：**
| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-name` | 否 | 要同步的變更名稱（未提供時會從上下文推斷） |

**功能說明：**
- 讀取變更資料夾中的差異規格
- 解析「新增（ADDED）/修改（MODIFIED）/移除（REMOVED）/重新命名（RENAMED）」章節
- 將變更合併到主 `openspec/specs/` 目錄中
- 保留差異規格中未提及的既有內容
- 不會歸檔變更（變更仍處於啟用狀態）

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

**手動執行時機：**

| 場景 | 是否需要同步？ |
|----------|-----------|
| 長期執行的變更，希望在歸檔前將規格合併到主規格 | 是 |
| 多個平行變更需要使用更新後的基礎規格 | 是 |
| 希望單獨預覽/審查合併內容 | 是 |
| 快速變更，直接歸檔即可 | 否（歸檔指令會自動處理）|

**提示：**
- 同步功能是智慧合併，而非單純的複製貼上
- 可在現有需求中新增場景，不會產生重複內容
- 同步後變更仍處於啟用狀態（不會自動歸檔）
- 大多數用戶不需要直接呼叫此指令，歸檔時若需要同步會自動提示

---

### `/opsx:archive`

歸檔已完成的變更。最終確立變更狀態，並將其移動到歸檔資料夾。

**語法：**
```
/opsx:archive [change-name]
```

**參數：**
| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-name` | 否 | 要歸檔的變更名稱（未提供時會從上下文推斷） |

**功能說明：**
- 檢查產物完成狀態
- 檢查任務完成情況（若有未完成任務會發出警告）
- 若差異規格尚未同步，會提示是否要同步
- 將變更資料夾移動到 `openspec/changes/archive/YYYY-MM-DD-<name>/`
- 保留所有產物以供審計追溯

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
- 歸檔不會因未完成任務而阻擋，但會發出警告
- 差異規格可在歸檔時同步，也可提前同步
- 已歸檔的變更會被保留以供歷史查閱
- 先執行 `/opsx:verify` 以發現潛在問題

---

### `/opsx:bulk-archive`

一次性歸檔多個已完成的變更。可處理變更之間的規格衝突。

**語法：**
```
/opsx:bulk-archive [change-names...]
```

**參數：**
| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-names` | 否 | 要歸檔的變更名稱（未提供時會提示選擇） |

**功能說明：**
- 列出所有已完成的變更
- 歸檔前驗證每個變更的狀態
- 偵測變更之間的規格衝突
- 透過檢查實際實作內容解決衝突
- 依照建立時間順序歸檔

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
- 適合平行處理的多個工作流
- 衝突解決為自主執行（會檢查程式碼庫）
- 變更依照建立時間順序歸檔
- 覆寫規格內容前會發出提示

---

### `/opsx:onboard`

透過完整的 OpenSpec 工作流進行引導式入門。使用你的實際程式碼庫進行互動式教學。

**語法：**
```
/opsx:onboard
```

**功能說明：**
- 搭配講解走訪完整的工作流循環
- 掃描你的程式碼庫，找出實際可改進的地方
- 建立包含真實產物的實際變更
- 實作實際工作（小型、安全的變更）
- 歸檔已完成的變更
- 在執行每一步時同步進行說明

**流程階段：**
1. 歡迎與程式碼庫分析
2. 尋找可改進的機會
3. 建立變更（`/opsx:new`）
4. 撰寫提案
5. 建立規格
6. 撰寫設計文件
7. 建立任務
8. 實作任務（`/opsx:apply`）
9. 驗證實作內容
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
- 適合正在學習工作流的新手用戶
- 使用真實程式碼，而非範例程式碼
- 會建立一個真實的變更，你可以選擇保留或丟棄
- 完成整個流程約需 15 至 30 分鐘

## 各 AI 工具的指令語法

不同 AI 工具使用的指令語法略有差異，請選擇符合您所用工具的格式：

| 工具 | 語法範例 |
|------|----------------|
| Claude Code | `/opsx:propose`、`/opsx:apply` |
| Cursor | `/opsx-propose`、`/opsx-apply` |
| Windsurf | `/opsx-propose`、`/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`、`/opsx-apply` |
| CodeArts | 以技能為基礎的調用方式，例如 `/openspec-propose`、`/openspec-apply-change`（不會生成 `opsx-*` 指令檔案） |
| Codex | 從 `.codex/skills/openspec-*` 進行以技能為基礎的調用（不會生成 `opsx-*` 提示檔案） |
| Oh My Pi | `/opsx-propose`、`/opsx-apply` |
| Kimi Code | 以技能為基礎的調用方式，例如 `/skill:openspec-propose`、`/skill:openspec-apply-change`（不會生成 `opsx-*` 指令檔案） |
| Trae | `/opsx-propose`、`/opsx-apply` |

各工具的指令核心意圖一致，但指令的呈現方式會因整合方式而有所不同。

> **注意：** GitHub Copilot 指令（`.github/prompts/*.prompt.md`）僅適用於 IDE 擴充功能（VS Code、JetBrains、Visual Studio）。GitHub Copilot CLI 目前不支援自訂提示檔案，詳細資訊與解決方案請參閱[支援的工具](supported-tools.md)。

---

## 舊版指令

這些指令使用較舊的「一次性處理」工作流程，目前仍可使用，但建議改用 OPSX 指令。

| 指令 | 功能說明 |
|---------|--------------|
| `/openspec:proposal` | 一次性建立所有產出物（提案、規格、設計、任務） |
| `/openspec:apply` | 實作變更 |
| `/openspec:archive` | 封存變更 |

**舊版指令適用場景：**
- 現有專案使用舊版工作流程
- 簡單變更，不需要逐步建立產出物
- 偏好全有或全無的處理方式

**遷移至 OPSX：**
舊版變更可使用 OPSX 指令延續處理，兩者的產出物結構相容。

---

## 疑難排解

### 找不到變更

指令無法識別要處理的變更。

**解決方案：**
- 明確指定變更名稱：`/opsx:apply add-dark-mode`
- 檢查變更資料夾是否存在：`openspec list`
- 確認您位於正確的專案目錄

### 無可用的產出物

所有產出物要麼已完成，要麼因缺少相依性而被阻擋。

**解決方案：**
- 執行 `openspec status --change <name>` 查看阻擋原因
- 檢查必要的產出物是否存在
- 先建立缺少的相依性產出物

### 找不到綱要

指定的綱要不存在。

**解決方案：**
- 列出可用綱要：`openspec schemas`
- 檢查綱要名稱拼寫是否正確
- 若為自訂綱要請建立：`openspec schema init <name>`

### 無法辨識指令

AI 工具無法辨識 OpenSpec 指令。

**解決方案：**
- 確認已初始化 OpenSpec：`openspec init`
- 重新生成技能：`openspec update`
- 檢查 `.claude/skills/` 目錄是否存在（適用於 Claude Code）
- 重新啟動 AI 工具以載入新技能

### 產出物生成異常

AI 生成的產出物不完整或不符合預期。

**解決方案：**
- 在 `openspec/config.yaml` 中加入專案上下文
- 為特定產出物加入專屬規則以提供明確指引
- 在變更描述中提供更詳細的資訊
- 使用 `/opsx:continue` 替代 `/opsx:ff` 以獲取更細緻的控制

---

## 後續步驟

- [工作流程](workflows.md) - 常見模式及各指令的適用場景
- [命令列介面](cli.md) - 用於管理與驗證的終端機指令
- [自訂](customization.md) - 建立自訂綱要與工作流程