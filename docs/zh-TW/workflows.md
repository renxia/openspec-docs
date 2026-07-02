# 工作流程

本指南涵蓋了 OpenSpec 的常見工作流程模式，以及何時應使用這些模式。有關基本設置，請參閱 [Getting Started](getting-started.md)。有關命令參考，請參閱 [Commands](commands.md)。

## 設計理念：行動而非階段

傳統的工作流程會迫使您經歷一系列的階段：規劃、然後實施，最後完成。但實際工作並不會如此整齊地放入方框中。

OPSX 採取了不同的方法：

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**核心原則：**

- **行動而非階段** - 命令是您可以執行的事物，而不是您被困住的某個階段
- **依賴項是賦能者 (enablers)** - 它們顯示了哪些事情是可行的，而不是下一步必須完成的事務

> **自定義：** OPSX 工作流程由定義工件序列的 schemas 驅動。請參閱 [Customization](customization.md) 以了解創建自定義 schemas 的詳細資訊。

## 兩種模式 (Two Modes)

### 預設快速路徑（`core` 設定檔）(Default Quick Path (`core` profile))

新安裝會預設使用 `core`，它提供了以下功能：
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

典型流程：

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (可選)
```

#### 從探索開始（值得養成的好習慣）(Start by exploring (the habit worth forming))

`/opsx:explore` 是預設設定檔的一部分，而非進階附加功能。當您有問題但尚未有計畫時，就應該使用它，而這在大多數情況下都是如此。

```text
You: /opsx:explore

AI:  您想探索什麼？

You: 我們的搜尋結果感覺很陳舊。我不確定是快取、索引還是查詢本身的問題。

AI:  讓我查看一下... [閱讀搜尋服務和快取層]
     問題出在索引：它只會夜間重建，因此編輯內容不會直到隔天才顯示。有兩種選擇：寫入時重建（簡單，負載較高）或短 TTL 快取失效（涉及更多組件，負載較低）。鑑於您的寫入量不高，寫入時重建是更乾淨的解決方案。是否要限定範圍？

You: 是。

You: /opsx:propose rebuild-search-index-on-write
```

探索功能不會產生任何產物（artifacts）也不會編寫程式碼。這是一場免費、零風險的對話，它能將一個模糊的擔憂轉化為一個精確的變更，從而使後續的提案更加銳利。是否已經清楚自己想要什麼？請跳過此步驟，直接前往 `/opsx:propose`。完整指南：[Explore First](explore.md)。

### 擴展/完整工作流程（自訂選擇）(Expanded/Full Workflow (custom selection))

如果您需要明確的腳架和建構指令（`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`），請使用以下指令啟用它們：

```bash
openspec config profile
openspec update
```

## 工作流程模式（擴展模式）(Workflow Patterns (Expanded Mode))

### 快速功能 (Quick Feature)

當您知道想建構什麼，只需要執行時：

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**對話範例：**

```text
You: /opsx:new add-logout-button

AI:  已建立 openspec/changes/add-logout-button/
     準備創建：proposal

You: /opsx:ff

AI:  正在創建所有規劃產物...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     準備實作！

You: /opsx:apply

AI:  正在處理任務...
     ✓ 已在標頭中新增登出按鈕
     ✓ 已實作會話狀態清除
     ✓ 已新增確認對話框
     所有任務均已完成！

You: /opsx:archive

AI:  ✓ 已合併規格 (specs)
     ✓ 已歸檔變更
```

**適用情境：** 小型到中型功能、錯誤修復、直接的變更。

### 探索性工作流 (Exploratory)

當需求不清楚或您需要先進行調查時：

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**對話範例：**

```text
You: /opsx:explore

AI:  您想探索什麼？

You: 我想改善頁面載入效能，但我不知道瓶頸在哪裡。

AI:  讓我協助調查...
     [分析套件大小、識別慢速查詢、審查元件渲染模式]

     我發現了三個主要瓶頸：
     1. 未優化的超大圖片
     2. ProductList 中的同步資料擷取 (Synchronous data fetching)
     3. 來自 Context 變更的重新渲染 (Re-renders from context changes)

     您希望先解決哪一個？

You: 我們來處理資料擷取問題。

You: /opsx:new optimize-product-list-fetching

AI:  已建立變更。準備創建：proposal

You: /opsx:continue

AI:  根據我們的探索結果正在創建提案...
     [撰寫納入調查洞察的提案]

     準備創建：specs, design
     您接下來想做什麼？

You: /opsx:continue

AI:  正在創建 specs...
```

**適用情境：** 效能優化、除錯 (debugging)、架構決策、不明確的需求。

### 並行變更 (Parallel Changes)

同時處理多個變更：

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (進行中)
                                         │
                                    情境切換 (context switch)
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**對話範例：**

```text
You: 我正在處理 add-dark-mode，但被拉去修了一個 Bug

You: /opsx:new fix-login-redirect

AI:  已建立 openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ 已創建規劃產物

You: /opsx:apply

AI:  正在處理 fix-login-redirect...
     [實作該修復]
     所有任務均已完成！

You: /opsx:archive

AI:  ✓ 已歸檔 fix-login-redirect

You: 我們回到 dark mode 吧

You: /opsx:apply add-dark-mode

AI:  恢復 add-dark-mode...
     從第 2.3 任務開始：更新標頭 (Update Header)...
```

**適用情境：** 並行工作流、緊急中斷、團隊協作。

當您有多個已完成的變更時，請使用 `/opsx:bulk-archive`：

```text
You: /opsx:bulk-archive

AI:  找到 3 個已完成的變更：
     - add-dark-mode (所有任務均已完成)
     - fix-login-redirect (所有任務均已完成)
     - update-footer (所有任務均已完成)

     正在檢查規格衝突...
     ⚠ add-dark-mode 和 update-footer 都觸及 specs/ui/

     正在檢查程式碼庫以解決...
     兩個變更都已實作。將依時間順序進行應用。

     是否歸檔這 3 個變更？

You: 是

AI:  ✓ 已歸檔 add-dark-mode
     ✓ 已歸檔 fix-login-redirect
     ✓ 已歸檔 update-footer
     規格按順序合併：add-dark-mode → update-footer
```

Bulk archive 會偵測到多個變更觸及相同的規格，並透過檢查實際已實作的內容來解決衝突。

### 完成一個變更 (Completing a Change)

推薦的完成流程：

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              驗證實現 (validates)          提示同步 (prompts to sync)
              實作內容 (implementation)     如果需要
```

#### 驗證：檢查您的工作 (Verify: Check Your Work)

`/opsx:verify` 會根據三個維度來驗證實作與您的產物是否一致：

```text
You: /opsx:verify

AI:  正在驗證 add-auth...

     完整性 (COMPLETENESS)
     ✓ tasks.md 中的所有 12 個任務均已檢查
     ✓ 所有規格中的要求都對應有程式碼
     ⚠ 未測試 "閒置後會話逾時" 的情境

     正確性 (CORRECTNESS)
     ✓ 實作符合規格意圖
     ✓ 已處理來自情境的邊緣案例
     ✓ 錯誤狀態符合規格定義

     連貫性 (COHERENCE)
     ✓ 設計決策體現於程式碼結構中
     ✓ 名稱慣例與 design.md 一致
     ⚠ 設計提到 "事件驅動" (event-driven)，但實作使用了輪詢 (polling)

     摘要 (SUMMARY)
     ─────────────────────────────
     關鍵問題：0
     警告：2
     準備歸檔：是（帶有警告）

     建議：
     1. 為會話逾時情境新增測試
     2. 考慮重構為事件驅動，或更新 design.md
```

**Verify 檢查的內容：**

| 維度 | 驗證項目 |
|-----------|------------------|
| 完整性 (Completeness) | 所有任務已完成、所有要求均已實作、情境已覆蓋 |
| 正確性 (Correctness) | 實作符合規格意圖、已處理邊緣案例 |
| 連貫性 (Coherence) | 設計決策體現於程式碼中、模式一致 |

Verify 不會阻擋歸檔，但它會顯示出您可能需要先解決的問題。

#### 歸檔：完成變更 (Archive: Finalize the Change)

`/opsx:archive` 會完成該變更並將其移至歸檔：

```text
You: /opsx:archive

AI:  正在歸檔 add-auth...

     產物狀態 (Artifact status):
     ✓ proposal.md 存在
     ✓ specs/ 存在
     ✓ design.md 存在
     ✓ tasks.md 存在（12/12 個任務已完成）

     規格差異 (Delta specs)：尚未同步到主程式碼庫
     → 您想現在就同步嗎？

You: 是

AI:  ✓ 已將規格同步至 openspec/specs/auth/spec.md
     ✓ 已移至 openspec/changes/archive/2025-01-24-add-auth/

     變更已成功歸檔。
```

Archive 會提示如果規格尚未同步。它不會因為任務未完成而阻擋，但會發出警告。

## 何時使用何種模式 (When to Use What)

### `/opsx:ff` 與 `/opsx:continue` 的區別

| 情境 | 使用方法 |
|-----------|-----|
| 需求明確，準備好建構 | `/opsx:ff` |
| 正在探索，想審查每個步驟 | `/opsx:continue` |
| 在規格之前想迭代提案 | `/opsx:continue` |
| 時間緊迫，需要快速推進 | `/opsx:ff` |
| 變更複雜，想要掌控權 | `/opsx:continue` |

**經驗法則：** 如果您可以事先描述完整的範圍，請使用 `/opsx:ff`。如果您是在過程中逐步弄清楚，請使用 `/opsx:continue`。

### 何時更新現有變更 vs 從零開始 (When to Update vs Start Fresh)

一個常見的問題：何時可以更新現有的變更，何時應該從新的一開始？

**當滿足以下條件時，請更新現有的變更：**

- 意圖相同，執行方式已精煉
- 範圍縮小（先做 MVP，後續再處理其餘部分）
- 基於學習的修正（程式碼庫並非您預期的樣子）
- 基於實作發現的設計調整

**當滿足以下條件時，請從新的一開始：**

- 意圖發生根本性改變
- 範圍擴大到完全不同的工作
- 原本變更可以獨立地被標記為「完成」
- 修補程式碼會造成混淆而非澄清

```text
                     ┌─────────────────────────────────────┐
                     │     這是同一項工作嗎？ (Is this the same work?)  │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          意圖相同?      >50% 重疊度?      原變更是否可以在沒有這些變更的情況下被「完成」？
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      是 (YES)          否 (NO) 是 (YES)     否 (NO)  否 (NO)
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    更新 (UPDATE)      新的一 (NEW)  更新 (UPDATE)  新的一 (NEW)  更新 (UPDATE)  新的一 (NEW)
```

**範例：「新增暗色模式」**

- 「還需要支援自訂主題」→ 新的變更（範圍擴大）
- 「偵測系統偏好比預期的要難得多」→ 更新（意圖相同）
- 「先發布切換開關，稍後再增加偏好設定」→ 先更新再歸檔，然後再創建一個新的變更

## 最佳實務 (Best Practices)

### 使變更集中化 (Keep Changes Focused)

每個變更應是一個邏輯單元的工作。如果您正在做「新增功能 X 並重構 Y」，請考慮兩個獨立的變更。

**為什麼這很重要：**
- 更容易審查和理解
- 歸檔歷史更乾淨
- 可以獨立發布
- 如果需要，回溯 (rollback) 更簡單

### 對於不明確的需求使用 `/opsx:explore`

在承諾任何變更之前，先探索問題空間：

```text
You: /opsx:explore

AI:  您想探索什麼？

You: 我們應該如何處理 API 的速率限制 (rate limiting)？

AI:  讓我調查一下您的當前設定和選項...
     [研究程式碼庫，考慮模式]

     我看到了三種可以採取的途徑：
     1. 基於中介軟體 (Middleware-based)（簡單，按端點）
     2. 支援 Redis（可擴展，共享狀態）
     3. 每位使用者一個 Token Bucket（公平，複雜）

     您目前的技術堆棧建議 #1 或 #2。您的規模如何？
```

探索能讓您在創建產物之前就釐清思緒。

### 歸檔前進行驗證 (Verify Before Archiving)

使用 `/opsx:verify` 來檢查實作是否與產物一致：

```text
You: /opsx:verify

AI:  正在驗證 add-dark-mode...

     ✓ tasks.md 中的所有任務均已檢查
     ✓ 規格中的要求都對應有程式碼
     ✓ 設計決策體現於實作中

     準備歸檔！
```

在您完成變更之前，就可捕獲不一致之處。

### 清晰地命名變更 (Name Changes Clearly)

好的名稱能讓 `openspec list` 變得有用：

```text
良好範例:                          應避免:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## 命令快速參考

如需完整的命令細節和選項，請參閱[Commands](commands.md)。

| Command | 用途 | 使用時機 |
|---------|---------|-------------|
| `/opsx:propose` | 建立變更和規劃工件 | 快速預設路徑（`core` 設定） |
| `/opsx:explore` | 與 AI 一起思考想法 | 當不確定時從此開始：需求不明確、調查、比較選項 |
| `/opsx:new` | 開始一個變更骨架 | 進階模式，需要明確控制工件 |
| `/opsx:continue` | 建立下一個工件 | 進階模式，逐步創建工件 |
| `/opsx:ff` | 建立所有規劃工件 | 進階模式，範圍清晰 |
| `/opsx:apply` | 實作任務 | 準備好編寫程式碼時 |
| `/opsx:verify` | 驗證實作 | 進階模式，在歸檔之前進行 |
| `/opsx:sync` | 合併變更規格 | 進階模式，可選 |
| `/opsx:archive` | 完成此變更 | 所有工作完成後 |
| `/opsx:bulk-archive` | 歸檔多個變更 | 進階模式，平行工作時 |

## 後續步驟

- [Commands](commands.md) - 完整的命令參考及選項
- [Concepts](concepts.md) - 深入探討規格、工件和模式
- [Customization](customization.md) - 建立自訂工作流程