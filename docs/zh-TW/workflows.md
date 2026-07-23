# 工作流程

本指南說明 OpenSpec 常見的工作流程模式，以及各模式的適用時機。基礎設定請參閱 [入門指南](getting-started.md)，指令參考請參閱 [指令](commands.md)。

## 核心原則：行動，而非階段

傳統工作流程強制你依序走完各個階段：先規劃、再實作、最後完成。但實際工作往往無法 neatly 歸入這些固定的階段範疇。

OPSX 採取不同的做法：

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

- **行動，而非階段** - 指令是可以執行的動作，而非讓你卡住的固定階段
- **相依性是輔助條件** - 相依性顯示的是可行選項，而非下一步的必要條件

> **自訂：** OPSX 工作流程由定義產物序列的 schema 驅動。建立自訂 schema 的詳細說明請參閱 [自訂](customization.md)。

## 兩種模式

### 預設快速路徑（`core` 設定檔）

新安裝預設使用 `core` 設定檔，提供以下功能：
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

典型流程：

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (optional)
```

#### 從探索開始（值得養成的習慣）

`/opsx:explore` 是預設設定檔的一部分，並非進階附加功能。每當你遇到問題但還沒有明確方案時，這就是首選操作——搭配 AI 助手時，這種情況幾乎是常態。

```text
You: /opsx:explore

AI:  你想探索什麼呢？

You: 我們的搜尋結果感覺過時了，我不確定是快取、索引還是查詢本身的問題。

AI:  我來看看……[讀取搜尋服務與快取層]
     問題出在索引：它只會在夜間重建，所以修改內容要到隔天才會顯示。有兩個解決方案：寫入時重建索引（實現簡單，但負載較高），或是設定短 TTL 的快取失效機制（元件較多，負載較低）。考慮到你的寫入量很低，寫入時重建是更乾淨的修復方案。要限定範圍嗎？

You: 好。

You: /opsx:propose rebuild-search-index-on-write
```

探索操作不會產生任何產物，也不會編寫任何程式碼。這是一場零成本、無風險的對話，能將模糊的擔憂轉化為明確的變更方案，因此後續提出的提案也會更精準。如果你已經完全清楚自己想要什麼，可以跳過這一步，直接使用 `/opsx:propose`。完整指南：[先探索](explore.md)。

### 擴充/完整工作流（自訂選擇）

如果你想要使用明確的脚手架與建置指令（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:bulk-archive`、`/opsx:onboard`），請執行以下指令啟用：

```bash
openspec config profile
openspec update
```

## 工作流模式（擴充模式）

### 快速功能開發

當你已經清楚要開發什麼，只需要執行操作時：

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**對話範例：**

```text
You: /opsx:new add-logout-button

AI:  已建立 openspec/changes/add-logout-button/
     準備建立：提案

You: /opsx:ff

AI:  正在建立所有規劃產物……
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     準備好進行實作！

You: /opsx:apply

AI:  正在處理任務……
     ✓ 已於頁首新增登出按鈕
     ✓ 已實作工作階段清除邏輯
     ✓ 已新增確認對話框
     所有任務完成！

You: /opsx:archive

AI:  ✓ 已合併規格文件
     ✓ 已封存變更
```

**適用場景：** 中小型功能、錯誤修復、單純的變更。

### 探索式開發

當需求不明確，或是需要先進行調查時：

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**對話範例：**

```text
You: /opsx:explore

AI:  你想探索什麼呢？

You: 我想提升頁面載入效能，但還不確定瓶頸在哪裡。

AI:  我來幫你調查……
     [分析打包後檔案大小、找出緩慢查詢、審閱元件渲染模式]

     我發現三個主要瓶頸：
     1. 未優化的大型圖片
     2. ProductList 元件中的同步資料抓取
     3. 上下文變更導致的重複渲染

     你想先處理哪一個？

You: 先處理資料抓取的問題吧。

You: /opsx:new optimize-product-list-fetching

AI:  已建立變更方案，準備建立：提案

You: /opsx:continue

AI:  根據我們的探索結果建立提案……
     [撰寫納入調查洞察的提案]

     準備建立：規格文件、設計文件
     接下來要進行哪一步？

You: /opsx:continue

AI:  正在建立規格文件……
```

**適用場景：** 效能優化、除錯、架構決策、需求不明確的專案。

### 平行變更

同時處理多個變更方案：

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**對話範例：**

```text
You: 我本來在處理 add-dark-mode，但臨時被叫去修一個錯誤

You: /opsx:new fix-login-redirect

AI:  已建立 openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ 已建立規劃產物

You: /opsx:apply

AI:  正在處理 fix-login-redirect……
     [實作修復方案]
     所有任務完成！

You: /opsx:archive

AI:  ✓ 已封存 fix-login-redirect

You: 回到深色模式的開發吧

You: /opsx:apply add-dark-mode

AI:  繼續 add-dark-mode 的開發……
     從任務 2.3 繼續：更新頁首……
```

**適用場景：** 平行工作流、緊急插單、團隊協作。

當你有多個已完成的變更方案時，可以使用 `/opsx:bulk-archive`：

```text
You: /opsx:bulk-archive

AI:  找到 3 個已完成的變更方案：
     - add-dark-mode（所有任務完成）
     - fix-login-redirect（所有任務完成）
     - update-footer（所有任務完成）

     正在檢查規格文件衝突……
     ⚠ add-dark-mode 與 update-footer 都修改了 specs/ui/

     正在檢查程式碼庫以解決衝突……
     兩個變更方案都已實作，將依時間順序合併。

     要封存全部 3 個變更方案嗎？

You: 好

AI:  ✓ 已封存 add-dark-mode
     ✓ 已封存 fix-login-redirect
     ✓ 已封存 update-footer
     規格文件依序合併：add-dark-mode → update-footer
```

批量封存功能會偵測多個變更方案是否修改了相同規格文件，並透過檢查實際實作內容來解決衝突。

### 完成變更方案

建議的完成流程：

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### 驗證：檢查你的實作

`/opsx:verify` 會從三個維度驗證實作內容與產物是否一致：

```text
You: /opsx:verify

AI:  正在驗證 add-auth……

     完整性
     ✓ tasks.md 中的 12 個任務皆已標記完成
     ✓ 規格文件中的所有需求都有對應的程式碼
     ⚠ 「閒置後工作階段逾時」情境尚未測試

     正確性
     ✓ 實作內容符合規格文件意圖
     ✓ 已處理情境中的邊界條件
     ✓ 錯誤狀態符合規格文件定義

     一致性
     ✓ 設計決策反映在程式碼結構中
     ✓ 命名規範與 design.md 一致
     ⚠ 設計文件中提到「事件驅動」，但實作使用輪詢機制

     總結
     ─────────────────────────────
     嚴重問題：0 個
     警告：2 個
     可封存：是（帶有警告）

     建議：
     1. 為「閒置後工作階段逾時」情境新增測試
     2. 考慮依設計重構為事件驅動架構，或是更新 design.md
```

**驗證功能會檢查以下項目：**

| 維度 | 驗證內容 |
|-----------|------------------|
| 完整性 | 所有任務完成、所有需求已實作、所有情境已涵蓋 |
| 正確性 | 實作內容符合規格意圖、邊界條件已處理 |
| 一致性 | 設計決策反映在程式碼中、模式保持一致 |

驗證不會阻擋封存流程，但會凸顯你可能希望優先處理的問題。

#### 封存：完成變更方案

`/opsx:archive` 會完成變更方案並將其移至封存區：

```text
You: /opsx:archive

AI:  正在封存 add-auth……

     產物狀態：
     ✓ proposal.md 存在
     ✓ specs/ 存在
     ✓ design.md 存在
     ✓ tasks.md 存在（12/12 個任務完成）

     增量規格文件：尚未同步至主分支
     → 要現在同步嗎？

You: 好

AI:  ✓ 已將規格文件同步至 openspec/specs/auth/spec.md
     ✓ 已移至 openspec/changes/archive/2025-01-24-add-auth/

     變更方案已成功封存。
```

如果規格文件尚未同步，封存流程會發出提示。它不會因為任務未完成而阻擋流程，但會發出警告。

## 使用場景指南

### `/opsx:ff` 與 `/opsx:continue` 的差異

| 情境 | 適用指令 |
|-----------|-----|
| 需求明確，準備好開始實作 | `/opsx:ff` |
| 處於探索階段，希望逐步審查每個步驟 | `/opsx:continue` |
| 希望在生成規格文件前反覆修改提案 | `/opsx:continue` |
| 時間緊迫，需要快速推進 | `/opsx:ff` |
| 變更方案複雜，需要全程掌控 | `/opsx:continue` |

**經驗法則：** 如果你可以提前描述完整的範圍，請使用 `/opsx:ff`。如果你是在執行過程中逐步釐清範圍，請使用 `/opsx:continue`。

### 何時更新現有變更方案，何時重新開始

常見問題：什麼時候可以更新現有的變更方案，什麼時候應該重新建立一個新的？

**適合更新現有變更方案的場景：**
- 意圖相同，僅優化執行方式
- 範圍縮小（先交付最小可行產品 MVP，其餘部分後續處理）
- 基於學習進行的修正（程式碼庫與預期不符）
- 基於實作發現調整設計

**適合重新建立新變更方案的場景：**
- 核心意圖發生根本變化
- 範圍大幅擴展至完全不同的工作內容
- 原始變更方案可以單獨標記為「完成」
- 修補程式會造成更多混淆而非釐清問題

```text
                     ┌─────────────────────────────────────┐
                     │     Is this the same work?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Same intent?      >50% overlap?      Can original
          Same problem?     Same scope?        be "done" without
                 │                  │          these changes?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YES               NO YES           NO  NO              YES
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

**範例：「新增深色模式」**
- 「還需要支援自訂主題」→ 新變更方案（範圍大幅擴展）
- 「系統偏好偵測比預期更困難」→ 更新現有方案（意圖相同）
- 「先推出切換開關，後續再加偏好設定」→ 先更新現有方案並封存，再建立新變更方案

## 最佳實踐

### 保持變更方案聚焦

每個變更方案只包含一個邏輯工作單元。如果你正在進行「新增功能 X 同時重構 Y」的任務，建議拆分為兩個獨立的變更方案。

**為什麼這麼重要：**
- 更容易審查與理解
- 封存歷史更清晰
- 可獨立交付
- 需要時更易回滾

### 需求不明確時使用 `/opsx:explore`

在確定變更方案前，先探索問題領域：

```text
You: /opsx:explore

AI:  你想探索什麼呢？

You: 我們的 API 該如何處理速率限制？

AI:  我來調查你目前的設定與可行方案……
     [研究程式碼庫、考慮常見模式]

     我發現三個可行方案：
     1. 基於中介軟體（實現簡單，按端點設定）
     2. 基於 Redis（可擴展，共享狀態）
     3. 每位使用者一個權杖桶（公平，但實現複雜）

     你目前的技術堆疊建議選擇方案 1 或 2，你的服務規模如何？
```

探索操作能讓你在建立產物前釐清思路。

### 封存前先驗證

使用 `/opsx:verify` 檢查實作內容與產物是否一致：

```text
You: /opsx:verify

AI:  正在驗證 add-dark-mode……

     ✓ tasks.md 中的所有任務皆已標記完成
     ✓ 規格文件中的所有需求都有對應的程式碼
     ✓ 設計決策已反映在實作內容中

     可以封存了！
```

在結束變更方案前找出不一致之處。

### 明確命名變更方案

好的名稱能讓 `openspec list` 指令更有用：

| 好的範例 | 應避免的範例 |
|-------|--------|
| add-dark-mode | feature-1 |
| fix-login-redirect | update |
| optimize-product-query | changes |
| implement-2fa | wip |

## 命令快速參考

完整命令詳細資訊與選項請參閱 [Commands](commands.md)。

| 命令 | 用途 | 適用時機 |
|---------|---------|-------------|
| `/opsx:propose` | 建立變更與規劃產出物 | 快速預設路徑（`core` 設定檔） |
| `/opsx:explore` | 與 AI 共同構思想法 | 不確定時從這裡開始：需求不明、需要調查、比較方案時適用 |
| `/opsx:new` | 啟動變更骨架 | 擴充模式，明確產出物控制 |
| `/opsx:continue` | 建立下一個產出物 | 擴充模式，逐步建立產出物 |
| `/opsx:ff` | 建立所有規劃產出物 | 擴充模式，範圍明確時適用 |
| `/opsx:apply` | 實作任務 | 準備好撰寫程式碼時適用 |
| `/opsx:verify` | 驗證實作結果 | 擴充模式，封存前使用 |
| `/opsx:sync` | 合併增量規格 | 擴充模式，選用功能 |
| `/opsx:archive` | 完成變更 | 所有工作完成時適用 |
| `/opsx:bulk-archive` | 封存多個變更 | 擴充模式，平行工作時適用 |

## 後續步驟

- [撰寫優質規格](writing-specs.md) - 說明強健的需求與場景應具備的條件，以及如何為變更選擇合適的大小
- [審閱變更](reviewing-changes.md) - 在撰寫任何程式碼前，對草擬的計畫進行兩分鐘快速檢閱
- [團隊使用 OpenSpec](team-workflow.md) - 說明變更如何對應分支與 Pull Request
- [Commands](commands.md) - 完整命令參考與選項說明
- [Concepts](concepts.md) - 深入探討規格、產出物與結構描述
- [Customization](customization.md) - 建立自訂工作流程