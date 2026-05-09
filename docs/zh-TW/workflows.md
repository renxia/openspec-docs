# 工作流程

本指南涵蓋 OpenSpec 的常見工作流程模式及其適用時機。關於基礎設定，請參閱[入門指南](getting-started.md)。關於指令參考，請參閱[指令說明](commands.md)。

## 核心理念：行動，而非階段

傳統工作流程強制你經歷各個階段：規劃、然後實作、然後完成。但實際工作並無法如此整齊地歸類。

OPSX 採取了不同的方法：

```text
傳統（階段鎖定）：

  規劃 ────────► 實作 ────────► 完成
      │                    │
      │   "無法回頭"        │
      └────────────────────┘

OPSX（流暢行動）：

  提案 ──► 規格 ──► 設計 ──► 任務 ──► 實作
```

**核心原則：**

- **行動，而非階段** - 指令是你「可以執行的動作」，而非你「被困住的階段」
- **依賴關係是促成條件** - 它們顯示的是「可能的選項」，而非「接下來必須做的事」

> **自訂化：** OPSX 工作流程由定義產出物序列的結構描述驅動。關於建立自訂結構描述的詳細資訊，請參閱[自訂化](customization.md)。

## 兩種模式

### 預設快速路徑 (`core` 配置檔)

新安裝預設使用 `core`，提供以下功能：
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

典型流程：

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### 擴展/完整工作流（自訂選擇）

如果您需要明確的腳手架與建構命令（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:bulk-archive`、`/opsx:onboard`），請透過以下方式啟用：

```bash
openspec config profile
openspec update
```

## 工作流模式（擴展模式）

### 快速功能

當您清楚要建構什麼，只需要執行時：

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**範例對話：**

```text
You: /opsx:new add-logout-button

AI:  已建立 openspec/changes/add-logout-button/
     準備建立：提案

You: /opsx:ff

AI:  正在建立所有規劃文件...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     準備進行實作！

You: /opsx:apply

AI:  正在處理任務...
     ✓ 已在標頭新增登出按鈕
     ✓ 已實作清除 session 功能
     ✓ 已新增確認對話框
     所有任務完成！

You: /opsx:archive

AI:  ✓ 已合併規格
     ✓ 已封存變更
```

**適用於：** 中小型功能、錯誤修復、直接的變更。

### 探索性

當需求不明確或需要先調查時：

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**範例對話：**

```text
You: /opsx:explore

AI:  您想要探索什麼？

You: 我想改善頁面載入效能，但不確定瓶頸在哪裡。

AI:  讓我協助調查...
     [分析套件大小、識別慢速查詢、檢視元件渲染模式]

     我發現三個主要瓶頸：
     1. 大型未優化的圖片
     2. ProductList 中的同步資料獲取
     3. 因 context 變更導致的重新渲染

     您想先處理哪一個？

You: 我們先處理資料獲取的問題。

You: /opsx:new optimize-product-list-fetching

AI:  已建立變更。準備建立：提案

You: /opsx:continue

AI:  根據我們的探索建立提案...
     [撰寫包含調查洞察的提案]

     準備建立：規格、設計
     您想先進行哪一個？

You: /opsx:continue

AI:  正在建立規格...
```

**適用於：** 效能優化、偵錯、架構決策、需求不明確。

### 並行變更

同時處理多個變更：

```text
變更 A: /opsx:new ──► /opsx:ff ──► /opsx:apply (進行中)
                                         │
                                    切換情境
                                         │
變更 B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**範例對話：**

```text
You: 我正在處理 add-dark-mode，但被拉去修一個錯誤

You: /opsx:new fix-login-redirect

AI:  已建立 openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ 已建立規劃文件

You: /opsx:apply

AI:  正在處理 fix-login-redirect...
     [實作修復]
     所有任務完成！

You: /opsx:archive

AI:  ✓ 已封存 fix-login-redirect

You: 我們回到深色模式吧

You: /opsx:apply add-dark-mode

AI:  恢復 add-dark-mode...
     從任務 2.3 繼續：更新標頭...
```

**適用於：** 並行工作流、緊急中斷、團隊協作。

當您有多個已完成的變更時，使用 `/opsx:bulk-archive`：

```text
You: /opsx:bulk-archive

AI:  找到 3 個已完成的變更：
     - add-dark-mode (所有任務完成)
     - fix-login-redirect (所有任務完成)
     - update-footer (所有任務完成)

     檢查規格衝突...
     ⚠ add-dark-mode 和 update-footer 都涉及 specs/ui/

     檢查程式碼庫以解決...
     兩個變更都已實作。將按時間順序套用。

     封存所有 3 個變更？

You: 是

AI:  ✓ 已封存 add-dark-mode
     ✓ 已封存 fix-login-redirect
     ✓ 已封存 update-footer
     規格已按順序合併：add-dark-mode → update-footer
```

批量封存會偵測多個變更是否涉及相同規格，並透過檢查實際實作來解決衝突。

### 完成變更

建議的完成流程：

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              驗證實作           提示同步
              是否符合文件       （如有需要）
```

#### 驗證：檢查您的工作

`/opsx:verify` 會從三個維度驗證實作是否符合您的文件：

```text
You: /opsx:verify

AI:  正在驗證 add-auth...

     完整性
     ✓ tasks.md 中的 12 個任務都已勾選
     ✓ 規格中的所有需求都有對應的程式碼
     ⚠ 情境「閒置逾時後 session 過期」未經測試

     正確性
     ✓ 實作符合規格意圖
     ✓ 情境中的邊界情況已處理
     ✓ 錯誤狀態符合規格定義

     一致性
     ✓ 設計決策反映在程式碼結構中
     ✓ 命名慣例與 design.md 一致
     ⚠ 設計提到「事件驅動」但實作使用輪詢

     摘要
     ─────────────────────────────
     嚴重問題：0
     警告：2
     準備封存：是（帶有警告）

     建議：
     1. 為 session 逾時情境新增測試
     2. 考慮按設計重構為事件驅動，或更新 design.md
```

**驗證檢查什麼：**

| 維度 | 驗證內容 |
|------|----------|
| 完整性 | 所有任務完成、所有需求已實作、情境已涵蓋 |
| 正確性 | 實作符合規格意圖、邊界情況已處理 |
| 一致性 | 設計決策反映在程式碼中、模式一致 |

驗證不會阻止封存，但它會浮現您可能想先處理的問題。

#### 封存：完成變更

`/opsx:archive` 完成變更並將其移至封存：

```text
You: /opsx:archive

AI:  正在封存 add-auth...

     文件狀態：
     ✓ proposal.md 存在
     ✓ specs/ 存在
     ✓ design.md 存在
     ✓ tasks.md 存在 (12/12 任務完成)

     差異規格：尚未同步至主分支
     → 您想現在同步嗎？

You: 是

AI:  ✓ 已將規格同步至 openspec/specs/auth/spec.md
     ✓ 已移至 openspec/changes/archive/2025-01-24-add-auth/

     變更封存成功。
```

如果規格未同步，封存會提示。它不會因未完成的任務而阻止，但會警告您。

## 何時使用什麼

### `/opsx:ff` vs `/opsx:continue`

| 情境 | 使用 |
|------|------|
| 需求明確，準備建構 | `/opsx:ff` |
| 探索中，想審閱每個步驟 | `/opsx:continue` |
| 想在建立規格前迭代提案 | `/opsx:continue` |
| 時間緊迫，需要快速行動 | `/opsx:ff` |
| 複雜變更，想要控制 | `/opsx:continue` |

**經驗法則：** 如果您能預先描述完整範圍，使用 `/opsx:ff`。如果您是邊做邊想，使用 `/opsx:continue`。

### 何時更新 vs 重新開始

一個常見問題：何時可以更新現有變更，何時應該開始新的？

**更新現有變更當：**

- 意圖相同，執行方式優化
- 範圍縮小（先做最小可行產品，其餘稍後）
- 基於學習的修正（程式碼庫與預期不同）
- 基於實作發現的設計調整

**開始新變更當：**

- 意圖根本改變
- 範圍擴展到完全不同的工作
- 原始變更可以獨立標記為「完成」
- 修補會造成更多混淆而非釐清

```text
                     ┌─────────────────────────────────────┐
                     │     這是同一個工作嗎？              │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          相同意圖？        >50% 重疊？        原始變更能否
          相同問題？       相同範圍？          不含這些變更
                 │                  │          就「完成」？
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      是               否 是           否  否              是
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    更新            新增  更新       新增  更新          新增
```

**範例：「新增深色模式」**

- 「還需要支援自訂主題」→ 新增變更（範圍擴展）
- 「系統偏好偵測比預期困難」→ 更新（相同意圖）
- 「先推出開關，稍後新增偏好設定」→ 更新然後封存，然後新增變更

## 最佳實踐

### 保持變更專注

每個變更一個邏輯工作單元。如果您正在做「新增功能 X 並同時重構 Y」，考慮分成兩個獨立變更。

**為什麼重要：**
- 更容易審閱和理解
- 更清晰的封存歷史
- 可以獨立發布
- 如有需要，回滾更簡單

### 使用 `/opsx:explore` 處理不明確的需求

在提交變更之前，先探索問題空間：

```text
You: /opsx:explore

AI:  您想要探索什麼？

You: 我們應該如何處理 API 的速率限制？

AI:  讓我調查您目前的設定和選項...
     [研究程式碼庫，考慮模式]

     我看到三種可行的方法：
     1. 基於中介軟體（簡單，每個端點）
     2. 基於 Redis（可擴展，共享狀態）
     3. 每個使用者的令牌桶（公平，複雜）

     您目前的技術堆疊建議使用 #1 或 #2。您的規模如何？
```

探索可以在建立文件之前釐清思路。

### 封存前驗證

使用 `/opsx:verify` 檢查實作是否符合文件：

```text
You: /opsx:verify

AI:  正在驗證 add-dark-mode...

     ✓ tasks.md 中的所有任務都已勾選
     ✓ 規格中的需求都有對應的程式碼
     ✓ 設計決策反映在實作中

     準備封存！
```

在關閉變更之前捕捉不匹配之處。

### 清楚命名變更

好的名稱讓 `openspec list` 更有用：

```text
好的：                          避免：
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## 指令快速參考

完整的指令詳細資訊與選項，請參閱 [指令](commands.md)。

| 指令 | 用途 | 使用時機 |
|------|------|----------|
| `/opsx:propose` | 建立變更與規劃產出物 | 快速預設路徑 (`core` 設定檔) |
| `/opsx:explore` | 深入思考想法 | 需求不明確、調查研究時 |
| `/opsx:explore` | 開始變更架構 | 擴展模式，明確控制產出物 |
| `/opsx:continue` | 建立下一個產出物 | 擴展模式，逐步建立產出物 |
| `/opsx:ff` | 建立所有規劃產出物 | 擴展模式，範圍明確時 |
| `/opsx:apply` | 實作任務 | 準備開始編寫程式碼時 |
| `/opsx:verify` | 驗證實作結果 | 擴展模式，歸檔前 |
| `/opsx:sync` | 合併差異規格 | 擴展模式，選擇性使用 |
| `/opsx:archive` | 完成變更 | 所有工作完成時 |
| `/opsx:bulk-archive` | 批次歸檔多個變更 | 擴展模式，平行作業時 |

## 後續步驟

- [指令](commands.md) - 完整的指令參考與選項
- [概念](concepts.md) - 深入了解規格、產出物與結構描述
- [自訂](customization.md) - 建立自訂工作流程