# 命令

這是 OpenSpec 斜線命令的參考資料。這些命令會在您的 AI 編碼助理聊天介面中呼叫（例如：Claude Code、Cursor、Windsurf）。

有關工作流程模式和何時使用每個命令，請參閱 [Workflows](workflows.md)。有關 CLI 命令，請參閱 [CLI](cli.md)。

## 快速參考

### 預設快速路徑（`core` 設定檔）

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | 在單一步驟中建立變更並生成規劃工件 |
| `/opsx:explore` | 在提交變更之前思考想法 |
| `/opsx:apply` | 實作來自該變更的任務 |
| `/opsx:sync` | 將 delta specs 合併到主 spec 中 |
| `/opsx:archive` | 存檔已完成的變更 |

### 進階工作流程命令（自訂工作流程選擇）

| Command | Purpose |
|---------|---------|
| `/opsx:new` | 開始一個新的變更骨架 |
| `/opsx:continue` | 根據依賴項建立下一個工件 |
| `/opsx:ff` | 快轉 (Fast-forward)：一次性建立所有規劃工件 |
| `/opsx:verify` | 驗證實作是否符合工件要求 |
| `/opsx:bulk-archive` | 一次性存檔多個變更 |
| `/opsx:onboard` | 完整工作流程的引導式教學 |

預設的全域設定檔是 `core`。若要啟用進階工作流程命令，請執行 `openspec config profile`，選擇工作流程後，再在您的專案中執行 `openspec update`。

## 命令參考資料

### `/opsx:propose`

一次性地建立新的變更並生成規劃工件。這是 `core` 設定檔中的預設啟動命令。

**語法:**
```text
/opsx:propose [change-name-or-description]
```

**參數:**
| 參數 | 是否必需 | 描述 |
|---|---|---|
| `change-name-or-description` | 否 | 使用 kebab-case 的名稱或純語言的變更描述 |

**功能說明:**
- 建立 `openspec/changes/<change-name>/` 目錄
- 生成實施前所需的工件（針對 `spec-driven`：提案、規格、設計、任務）
- 當變更準備好進行 `/opsx:apply` 時會停止

**範例:**
```text
You: /opsx:propose add-dark-mode

AI:  已建立 openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     準備好進行實施。請執行 /opsx:apply。
```

**提示:**
- 適用於最快速的端到端流程
- 如果您需要逐步控制工件，請啟用擴展工作流程並使用 `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **不確定時從這裡開始。** Explore 是一個零風險的思考夥伴：它會閱讀您的程式碼庫，比較不同的選項，並在任何變更存在之前將模糊的想法精煉成具體的計畫。它包含在預設設定檔中。有關完整的案例和更多範例，請參閱 [Explore First](explore.md) 指南。

在承諾進行任何變更之前，先思考想法、調查問題並澄清需求。

**語法:**
```
/opsx:explore [topic]
```

**參數:**
| 參數 | 是否必需 | 描述 |
|---|---|---|
| `topic` | 否 | 您想要探索或調查的內容 |

**功能說明:**
- 開啟一個無需特定結構的探索性對話
- 調查程式碼庫以回答問題
- 比較不同的選項和方法
- 創建視覺圖表以澄清思考
- 當洞察力成形時，可以轉移到 `/opsx:propose` (預設) 或 `/opsx:new` (擴展工作流程)

**範例:**
```text
You: /opsx:explore

AI:  您想探索什麼？

You: 我們應該如何為行動應用程式處理身份驗證？

AI:  讓我調查您目前的認證設定...
     [分析程式碼庫]

     我看到您對網站應用程式使用的是基於 Session 的認證。
     對於行動裝置，我們有三個主要選項：

     1. JWT tokens (無狀態, 可離線使用)
     2. OAuth2 (如果您需要第三方登入)
     3. 擴展現有的 Session (更簡單, 但需要連線)

     您的 API 已配置 CORS。哪個方向讓您感興趣？

You: 我們選擇 JWT。我們可以為此開始一個變更嗎？

AI:  準備好了。請執行 /opsx:propose add-jwt-auth 來開始。
```

**提示:**
- 當需求不清楚或需要調查時使用
- 探索過程中不會創建任何工件
- 在決定之前比較多種方法的好用
- 可以閱讀檔案並搜索程式碼庫

---

### `/opsx:new`

啟動一個新的變更骨架。會建立變更資料夾，並等待您使用 `/opsx:continue` 或 `/opsx:ff` 來生成工件。

此命令屬於擴展工作流程集（不包含在預設 `core` 設定檔中）。

**語法:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**參數:**
| 參數 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 變更資料夾的名稱（如果未提供，會提示輸入） |
| `--schema` | 否 | 要使用的工作流程 schema (預設: 從 config 或 `spec-driven`) |

**功能說明:**
- 建立 `openspec/changes/<change-name>/` 目錄
- 在變更資料夾中創建 `.openspec.yaml` 中繼資料檔案
- 顯示第一個準備好創建的工件範本
- 如果未提供，會提示輸入變更名稱和 schema

**它會創建什麼:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # 變更中繼資料 (schema, 建立日期)
```

**範例:**
```
You: /opsx:new add-dark-mode

AI:  已建立 openspec/changes/add-dark-mode/
     Schema: spec-driven

     準備創建：proposal
     使用 /opsx:continue 來創建，或使用 /opsx:ff 來創建所有工件。
```

**提示:**
- 使用描述性的名稱：`add-feature`, `fix-bug`, `refactor-module`
- 避免使用 `update`, `changes`, `wip` 等通用名稱
- Schema 也可以在專案設定檔 (`openspec/config.yaml`) 中設置

---

### `/opsx:continue`

創建依賴鏈中的下一個工件。一次性地創建一個工件以實現增量進度。

**語法:**
```
/opsx:continue [change-name]
```

**參數:**
| 參數 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要繼續的變更（如果未提供，則從上下文推斷） |

**功能說明:**
- 查詢工件依賴圖
- 顯示哪些工件已準備好 vs. 已被阻擋
- 創建第一個準備好的工件
- 閱讀依賴檔案以獲取上下文
- 顯示創建後可用的內容

**範例:**
```
You: /opsx:continue

AI:  變更：add-dark-mode

     工件狀態：
     ✓ proposal    (已完成)
     ◆ specs       (準備就緒)
     ◆ design      (準備就緒)
     ○ tasks       (被阻擋 - 需要: specs)

     正在創建 specs...

     [閱讀 proposal.md，根據需求創建 specs]

     ✓ 已創建 openspec/changes/add-dark-mode/specs/ui/spec.md

     現在可用：tasks
     請執行 /opsx:continue 以創建下一個工件。
```

**提示:**
- 當您想審查每個工件後再繼續時使用
- 對於需要控制的複雜變更很有幫助
- 多個工件可能會同時準備好
- 在繼續之前可以編輯已創建的工件

---

### `/opsx:ff`

快速推進工件創建。一次性地創建所有規劃工件。

**語法:**
```
/opsx:ff [change-name]
```

**參數:**
| 參數 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要快速推進的變更（如果未提供，則從上下文推斷） |

**功能說明:**
- 按依賴順序創建所有工件
- 通過待辦清單追蹤進度
- 當所有 `apply-required` 工件完成時停止
- 在創建下一個工件之前閱讀每個依賴項

**範例:**
```
You: /opsx:ff add-dark-mode

AI:  正在快速推進 add-dark-mode...

     ✓ 創建 proposal.md
     ✓ 創建 specs/ui/spec.md
     ✓ 創建 design.md
     ✓ 創建 tasks.md

     所有規劃工件均已完成！
     準備好進行實施。請執行 /opsx:apply 來開始。
```

**提示:**
- 當您對自己正在構建的內容有清晰的了解時使用
- 對於簡單的變更來說比 `/opsx:continue` 更快
- 您仍然可以在之後編輯工件
- 適用於小型到中型特徵

---

### `/opsx:apply`

實施來自該變更的任務。會依序處理任務清單，編寫程式碼並勾選項目。

**語法:**
```
/opsx:apply [change-name]
```

**參數:**
| 參數 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要實施的變更（如果未提供，則從上下文推斷） |

**功能說明:**
- 閱讀 `tasks.md` 並識別未完成的任務
- 一個一個地處理任務
- 根據需要編寫程式碼、創建檔案、運行測試
- 使用勾選框 `[x]` 標記任務已完成

**範例:**
```
You: /opsx:apply

AI:  正在實施 add-dark-mode...

     閱讀 tasks.md：
     - [ ] 1.1 創建 ThemeContext
     - [ ] 1.2 添加 CSS 自定義屬性
     - [ ] 1.3 實現 localStorage 持久化

     正在處理 1.1: 創建 ThemeContext...
     [創建 src/context/ThemeContext.tsx]

     ✓ 1.1 已完成

     正在處理 1.2: 添加 CSS 自定義屬性...
     [更新 src/styles/globals.css]

     ✓ 1.2 已完成
     ...
```

**提示:**
- 如果中斷，可以從上次停止的地方恢復
- 通過指定變更名稱來用於平行變更
- 完成狀態會記錄在 `tasks.md` 的勾選框中

---

### `/opsx:verify`

驗證實施結果是否符合您的變更工件。檢查完整性、正確性和一致性。

**語法:**
```
/opsx:verify [change-name]
```

**參數:**
| 參數 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要驗證的變更（如果未提供，則從上下文推斷） |

**功能說明:**
- 檢查實施的三個維度品質
- 在程式碼庫中搜索實施證據
- 報告分類為 CRITICAL、WARNING 或 SUGGESTION 的問題
- 不會阻止歸檔，但會顯示出問題

**驗證維度:**

| 維度 | 驗證內容 |
|---|---|
| **完整性 (Completeness)** | 所有任務均已完成，所有需求均已實施，場景情況均已覆蓋 |
| **正確性 (Correctness)** | 實施結果符合規格意圖，邊緣案例均已處理 |
| **一致性 (Coherence)** | 設計決策體現於程式碼中，模式保持一致 |

**範例:**
```
You: /opsx:verify

AI:  正在驗證 add-dark-mode...

     完整性 (COMPLETENESS)
     ✓ tasks.md 中的 8 個任務均已勾選
     ✓ specs 中的所有需求都有對應的程式碼
     ⚠ 場景「系統偏好偵測」沒有測試覆蓋率

     正確性 (CORRECTNESS)
     ✓ 實施結果符合規格意圖
     ✓ 場景中的邊緣案例都已處理
     ✓ 錯誤狀態與規格定義一致

     一致性 (COHERENCE)
     ✓ 設計決策體現於程式碼結構中
     ✓ 名稱慣例與 design.md 一致
     ⚠ 設計提到「CSS variables」，但實施卻使用了 Tailwind classes

     摘要 (SUMMARY)
     ─────────────────────────────
     嚴重問題：0
     警告：2
     準備好歸檔：是 (包含警告)

     建議事項：
     1. 為系統偏好偵測添加測試
     2. 更新 design.md 以反映 Tailwind 的使用，或重構以使用 CSS variables
```

**提示:**
- 在歸檔之前運行，以便及早地發現不匹配的地方
- 警告不會阻止歸檔，但會指出潛在問題
- 對於提交前審查 AI 的工作很有幫助
- 可以揭示工件與實施之間的漂移情況

---

### `/opsx:sync`

**可選命令。** 將變更中的 delta specs 合併到主規格中。歸檔時如果需要會提示同步，因此您通常不需要手動運行此命令。

**語法:**
```
/opsx:sync [change-name]
```

**參數:**
| 參數 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要同步的變更（如果未提供，則從上下文推斷） |

**功能說明:**
- 閱讀變更資料夾中的 delta specs
- 解析 ADDED/MODIFIED/REMOVED/RENAMED 部分
- 將變更合併到主 `openspec/specs/` 目錄中
- 保留未提及的現有內容
- 不會歸檔該變更（保持活動狀態）

**範例:**
```text
You: /opsx:sync

AI:  正在同步 add-dark-mode 的 delta specs...

     閱讀：openspec/changes/add-dark-mode/specs/ui/spec.md
     目標： openspec/specs/ui/spec.md

     待應用的變更：
     ✓ ADDED: Theme Selection requirement (2 個場景)
     ✓ ADDED: Accessibility requirement (1 個場景)

     正在合併...
     ✓ openspec/specs/ui/spec.md 已更新

     變更保持活動狀態。準備好完成時，請運行 /opsx:archive。
```

**何時手動使用:**

| 情境 | 是否需要同步？ |
|---|---|
| 長期變更，在歸檔前想讓規格進入主文件 | 是 |
| 多個平行變更需要更新基礎規格 | 是 |
| 想單獨預覽/審查合併結果 | 是 |
| 快速變更，直接進行歸檔 | 否 (archive 會處理) |

**提示:**
- Sync 是智能的，不是複製貼上
- 可以向現有的需求添加場景而無需重複內容
- 同步後變更仍保持活動狀態（未被歸檔）
- 大多數使用者都不會需要直接呼叫此命令——如果需要，archive 會提示

---

### `/opsx:archive`

歸檔一個已完成的變更。最終確定該變更並將其移動到歸檔資料夾。

**語法:**
```
/opsx:archive [change-name]
```

**參數:**
| 參數 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 否 | 要歸檔的變更（如果未提供，則從上下文推斷） |

**功能說明:**
- 檢查工件完成狀態
- 檢查任務完成情況（若不完整會發出警告）
- 如果尚未同步 delta specs，會提供同步選項
- 將變更資料夾移動到 `openspec/changes/archive/YYYY-MM-DD-<name>/`
- 保留所有工件以供審計追蹤

**範例:**
```text
You: /opsx:archive

AI:  正在歸檔 add-dark-mode...

     工件狀態：
     ✓ proposal.md 存在
     ✓ specs/ 存在
     ✓ design.md 存在
     ✓ tasks.md 存在 (8/8 任務已完成)

     Delta specs：尚未同步
     → 現在同步嗎？(建議)

You: 是

AI:  ✓ 已將規格同步到 openspec/specs/ui/spec.md
     ✓ 已移動至 openspec/changes/archive/2025-01-24-add-dark-mode/

     變更已成功歸檔。
```

**提示:**
- 歸檔不會因為任務未完成而阻止，但會發出警告
- Delta specs 可以在歸檔期間或之前同步
- 已歸檔的變更將被保留用於歷史記錄
- 請先運行 `/opsx:verify` 以及早地發現問題

---

### `/opsx:bulk-archive`

一次性歸檔多個已完成的變更。處理不同變更之間的規格衝突。

**語法:**
```
/opsx:bulk-archive [change-names...]
```

**參數:**
| 參數 | 是否必需 | 描述 |
|---|---|---|
| `change-names` | 否 | 要歸檔的特定變更（如果未提供，會提示選擇） |

**功能說明:**
- 列出所有已完成的變更
- 在歸檔前驗證每個變更
- 检测不同變更之間的規格衝突
- 通過檢查實際實施內容來解決衝突
- 按時間順序進行歸檔

**範例:**
```
You: /opsx:bulk-archive

AI:  找到 3 個已完成的變更：
     - add-dark-mode (8/8 任務已完成)
     - fix-login-bug (3/3 任務已完成)
     - update-footer (2/2 任務已完成)

     正在檢查規格衝突...
     ⚠ add-dark-mode 和 update-footer 都涉及 specs/ui/

     正在檢查程式碼庫以解決...
     兩個變更都已實施。將按時間順序合併：
     1. add-dark-mode (創建於 Jan 20)
     2. update-footer (創建於 Jan 22)

     是否歸檔所有 3 個變更？

You: 是

AI:  ✓ 已歸檔 add-dark-mode
     ✓ 已歸檔 fix-login-bug
     ✓ 已歸檔 update-footer
     規格已合併：add-dark-mode → update-footer
```

**提示:**
- 適用於平行工作流
- 衝突解決是基於代理的（檢查程式碼庫）
- 變更會按創建順序進行歸檔
- 在覆蓋規格內容之前會發出提示

---

### `/opsx:onboard`

透過完整的 OpenSpec 工作流程進行引導式上線。這是一個使用您實際程式碼庫的互動式教程。

**語法:**
```
/opsx:onboard
```

**功能說明:**
- 帶有旁白的完整工作流程循環
- 掃描您的程式碼庫以尋找真正的改進機會
- 創建一個包含真實工件的實際變更
- 實施實際的工作（小型、安全的變更）
- 歸檔已完成的變更
- 在每個步驟發生時進行解釋

**階段:**
1. 歡迎和程式碼庫分析
2. 尋找改進機會
3. 創建變更 (`/opsx:new`)
4. 編寫提案
5. 創建規格
6. 編寫設計
7. 創建任務
8. 實施任務 (`/opsx:apply`)
9. 驗證實施結果
10. 歸檔變更
11. 總結和下一步行動

**範例:**
```
You: /opsx:onboard

AI:  歡迎使用 OpenSpec！

     我將帶您走過完整的流程，並使用您的實際程式碼庫。
     我們將找到一個小的改進點，為其創建一個適當的變更，
     實施它，然後歸檔它。

     讓我掃描您的程式碼庫以尋找機會...

     [分析程式碼庫]

     我找到了幾個可以進行的工作：
     1. 為聯絡表單添加輸入驗證
     2. 改進認證流程中的錯誤訊息
     3. 為異步按鈕添加載入狀態

     哪個讓您感興趣？(或建議其他內容)
```

**提示:**
- 最適合學習工作流程的新使用者
- 使用真實程式碼，而非玩具範例
- 會創建一個您可以保留或丟棄的實際變更
- 完成所需時間為 15-30 分鐘

## AI 工具的命令語法

不同的 AI 工具使用略有差異的命令語法。請使用與您的工具相符的格式：

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

儘管跨工具的意圖是相同的，但命令呈現方式可能因整合而異。

> **備註：** GitHub Copilot 的命令（`.github/prompts/*.prompt.md`）僅在 IDE 擴充功能（VS Code, JetBrains, Visual Studio）中可用。GitHub Copilot CLI 目前不支援自定義提示文件 — 請參閱 [Supported Tools](supported-tools.md) 以了解詳情和解決方案。

---

## 舊版命令 (Legacy Commands)

這些命令使用了較舊的「一攬子」工作流程。它們仍然有效，但建議使用 OPSX 命令。

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | 一次性創建所有產物（提案、規格、設計、任務） |
| `/openspec:apply` | 實施變更 |
| `/openspec:archive` | 歸檔變更 |

**何時使用舊版命令：**
- 使用舊工作流程的現有專案
- 不需要增量產物創建的簡單變更
- 偏好「全有或全無」的方法

**遷移到 OPSX：**
可以使用 OPSX 命令來繼續進行舊版變更。其產物結構是相容的。

---

## 故障排除 (Troubleshooting)

### 「找不到變更」(Change not found)

命令無法識別應處理哪個變更。

**解決方案：**
- 明確指定變更名稱：`/opsx:apply add-dark-mode`
- 檢查變更資料夾是否存在：`openspec list`
- 確認您位於正確的專案目錄中

### 「沒有準備好的產物」(No artifacts ready)

所有產物都已完成或被缺失的依賴項所阻擋。

**解決方案：**
- 執行 `openspec status --change <name>` 以查看何處存在阻塞
- 檢查所需的產物是否存在
- 先創建缺失的依賴產物

### 「找不到 Schema」(Schema not found)

指定的 Schema 不存在。

**解決方案：**
- 列出可用的 Schema：`openspec schemas`
- 檢查 Schema 名稱拼寫是否正確
- 如果是自定義 Schema，請創建它：`openspec schema init <name>`

### 命令未被識別 (Commands not recognized)

AI 工具不認識 OpenSpec 命令。

**解決方案：**
- 確保已初始化 OpenSpec：`openspec init`
- 重新生成技能（skills）：`openspec update`
- 檢查 `.claude/skills/` 目錄是否存在（適用於 Claude Code）
- 重啟 AI 工具以載入新的技能

### 產物未正確生成 (Artifacts not generating properly)

AI 生成了不完整或不正確的產物。

**解決方案：**
- 在 `openspec/config.yaml` 中添加專案上下文
- 為特定指導提供單一產物的規則
- 在變更描述中提供更多細節
- 使用 `/opsx:continue` 而非 `/opsx:ff` 以獲得更多的控制權限

---

## 後續步驟 (Next Steps)

- [Workflows](workflows.md) - 常見模式和何時使用每個命令
- [CLI](cli.md) - 用於管理和驗證的終端機命令
- [Customization](customization.md) - 創建自定義 Schema 和工作流程