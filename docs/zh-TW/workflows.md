# 工作流程

本指南涵蓋 OpenSpec 的常見工作流程模式及其適用場景。基本設定請參閱[快速入門](getting-started.md)。指令參考請參閱[指令](commands.md)。

## 理念：行動，而非階段

傳統工作流程強制您按階段進行：規劃、實作、完成。但實際工作並非如此規整。

OPSX 採取不同的方法：

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

- **行動，而非階段** - 指令是您可以執行的操作，而非必須停留的階段
- **依賴關係是助力** - 它們顯示可行的選項，而非下一步的強制要求

> **自訂功能：** OPSX 工作流程由定義產物序列的架構驅動。詳情請參閱[自訂功能](customization.md)以了解如何建立自訂架構。

## 兩種模式

### 預設快速路徑（`core` 設定檔）

新安裝預設使用 `core`，提供以下功能：
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

典型流程：

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### 擴充/完整工作流程（自訂選擇）

如果您需要明確的腳手架與建構指令（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:sync`、`/opsx:bulk-archive`、`/opsx:onboard`），請使用以下指令啟用：

```bash
openspec config profile
openspec update
```

## 工作流程模式（擴充模式）

### 快速功能

當您清楚要建構什麼，只需執行時：

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**對話範例：**

```text
您：/opsx:new add-logout-button

AI：已建立 openspec/changes/add-logout-button/
    準備建立：提案

您：/opsx:ff

AI：正在建立所有規劃產物...
    ✓ proposal.md
    ✓ specs/
    ✓ design.md
    ✓ tasks.md
    準備進行實作！

您：/opsx:apply

AI：正在處理任務...
    ✓ 已在標頭加入登出按鈕
    ✓ 已實作階段清除功能
    ✓ 已加入確認對話框
    所有任務完成！

您：/opsx:archive

AI：✓ 已合併規格
    ✓ 已封存變更
```

**最適用於：** 中小型功能、錯誤修正、直接的變更。

### 探索性

當需求不明確或需要先進行調查時：

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**對話範例：**

```text
您：/opsx:explore

AI：您想探索什麼？

您：我想改善頁面載入效能，但不確定瓶頸在哪裡。

AI：讓我協助調查...
    [分析套件大小、識別慢速查詢、檢視元件渲染模式]

    我發現三個主要瓶頸：
    1. 大型未優化的圖片
    2. ProductList 中的同步資料擷取
    3. 因 context 變更導致的重新渲染

    您想先處理哪一個？

您：我們先處理資料擷取問題。

您：/opsx:new optimize-product-list-fetching

AI：已建立變更。準備建立：提案

您：/opsx:continue

AI：根據我們的探索建立提案...
    [撰寫包含調查見解的提案]

    準備建立：規格、設計
    您接下來想建立哪一個？

您：/opsx:continue

AI：正在建立規格...
```

**最適用於：** 效能最佳化、除錯、架構決策、需求不明確時。

### 平行變更

同時處理多個變更：

```text
變更 A：/opsx:new ──► /opsx:ff ──► /opsx:apply（進行中）
                                         │
                                    切換上下文
                                         │
變更 B：/opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**對話範例：**

```text
您：我正在處理 add-dark-mode，但被拉去修正一個錯誤

您：/opsx:new fix-login-redirect

AI：已建立 openspec/changes/fix-login-redirect/

您：/opsx:ff

AI：✓ 已建立規劃產物

您：/opsx:apply

AI：正在處理 fix-login-redirect...
    [實作修正]
    所有任務完成！

您：/opsx:archive

AI：✓ 已封存 fix-login-redirect

您：讓我們回到 dark mode

您：/opsx:apply add-dark-mode

AI：正在恢復 add-dark-mode...
    從任務 2.3 繼續：更新標頭...
```

**最適用於：** 平行工作流程、緊急中斷、團隊協作。

當您有多個已完成的變更時，使用 `/opsx:bulk-archive`：

```text
您：/opsx:bulk-archive

AI：找到 3 個已完成的變更：
    - add-dark-mode（所有任務完成）
    - fix-login-redirect（所有任務完成）
    - update-footer（所有任務完成）

    正在檢查規格衝突...
    ⚠ add-dark-mode 和 update-footer 都涉及 specs/ui/

    正在檢查程式碼庫以解決...
    兩個變更都已實作。將按時間順序套用。

    要封存所有 3 個變更嗎？

您：是

AI：✓ 已封存 add-dark-mode
    ✓ 已封存 fix-login-redirect
    ✓ 已封存 update-footer
    規格按順序合併：add-dark-mode → update-footer
```

批次封存會偵測多個變更是否涉及相同規格，並透過檢查實際實作內容來解決衝突。

### 完成變更

建議的完成流程：

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              驗證實作          提示同步
                              （如需要）
```

#### 驗證：檢查您的工作

`/opsx:verify` 會從三個維度驗證實作是否符合您的產物：

```text
您：/opsx:verify

AI：正在驗證 add-auth...

    完整性
    ✓ tasks.md 中所有 12 個任務都已勾選
    ✓ 規格中的所有需求都有對應的程式碼
    ⚠ 場景「閒置後逾時」未經測試

    正確性
    ✓ 實作符合規格意圖
    ✓ 處理了場景中的邊界情況
    ✓ 錯誤狀態符合規格定義

    一致性
    ✓ 設計決策反映在程式碼結構中
    ✓ 命名慣例與 design.md 一致
    ⚠ 設計提到「事件驅動」但實作使用輪詢

    摘要
    ─────────────────────────────
    嚴重問題：0
    警告：2
    可以封存：是（帶有警告）

    建議：
    1. 為逾時場景新增測試
    2. 考慮重構為事件驅動（如設計所述），或更新 design.md
```

**驗證檢查內容：**

| 維度 | 驗證內容 |
|-----------|------------------|
| 完整性 | 所有任務完成、所有需求已實作、場景已涵蓋 |
| 正確性 | 實作符合規格意圖、邊界情況已處理 |
| 一致性 | 設計決策反映在程式碼中、模式一致 |

驗證不會阻止封存，但會顯示您可能想先處理的問題。

#### 封存：完成變更

`/opsx:archive` 完成變並將其移至封存區：

```text
您：/opsx:archive

AI：正在封存 add-auth...

    產物狀態：
    ✓ proposal.md 存在
    ✓ specs/ 存在
    ✓ design.md 存在
    ✓ tasks.md 存在（12/12 任務完成）

    差異規格：尚未同步至主線
    → 您要現在同步嗎？

您：是

AI：✓ 已同步規格至 openspec/specs/auth/spec.md
    ✓ 已移至 openspec/changes/archive/2025-01-24-add-auth/

    變更已成功封存。
```

如果規格未同步，封存會提示您。它不會因未完成的任務而阻止，但會警告您。

## 何時使用何種指令

### `/opsx:ff` 與 `/opsx:continue`

| 情況 | 使用 |
|-----------|-----|
| 需求明確，準備建構 | `/opsx:ff` |
| 探索中，想逐步檢視 | `/opsx:continue` |
| 想在規格前反覆修改提案 | `/opsx:continue` |
| 時間緊迫，需要快速進行 | `/opsx:ff` |
| 複雜變更，想要控制 | `/opsx:continue` |

**經驗法則：** 如果您能事先描述完整範圍，使用 `/opsx:ff`。如果您是邊做邊摸索，使用 `/opsx:continue`。

### 何時更新 vs 重新開始

一個常見問題：何時可以更新現有變更，何時應該開始新的變更？

**更新現有變更的情況：**

- 相同意圖，優化執行
- 範圍縮小（先做 MVP，其餘之後）
- 基於學習的修正（程式碼庫與預期不同）
- 基於實作發現的設計調整

**開始新變更的情況：**

- 意圖根本改變
- 範圍擴大到完全不同的工作
- 原始變更可以獨立標記為「完成」
- 補丁會造成更多混淆而非釐清

```text
                     ┌─────────────────────────────────────┐
                     │     這是相同的工作嗎？              │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          相同意圖？        重疊 >50%？         原始變更可以
          相同問題？        相同範圍？          不含這些變更
                 │                  │          就「完成」嗎？
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      是                否 是             否  否              是
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    更新              新  更新           新  更新              新
```

**範例：「新增深色模式」**

- 「還需要支援自訂主題」→ 新變更（範圍擴大）
- 「系統偏好偵測比預期困難」→ 更新（相同意圖）
- 「我們先推出開關，之後再加入偏好設定」→ 更新然後封存，再建立新變更

## 最佳實踐

### 保持變更專注

每個變更一個邏輯工作單位。如果您正在做「新增功能 X 並重構 Y」，請考慮分成兩個獨立的變更。

**為什麼重要：**
- 更容易審查和理解
- 更乾淨的封存歷史
- 可以獨立發布
- 需要時更容易回滾

### 對不明確的需求使用 `/opsx:explore`

在投入變更之前，先探索問題空間：

```text
您：/opsx:explore

AI：您想探索什麼？

您：我們應該如何處理 API 的速率限制？

AI：讓我調查您目前的設定和選項...
    [研究程式碼庫，考慮模式]

    我看到三種可行的方法：
    1. 基於中介層（簡單，每個端點）
    2. 基於 Redis（可擴展，共享狀態）
    3. 每個使用者的令牌桶（公平，複雜）

    您目前的技術堆疊建議使用 #1 或 #2。您的規模是？
```

探索可以在建立產物之前釐清思路。

### 封存前進行驗證

使用 `/opsx:verify` 檢查實作是否符合產物：

```text
您：/opsx:verify

AI：正在驗證 add-dark-mode...

    ✓ tasks.md 中的所有任務都已勾選
    ✓ 規格中的需求都有對應的程式碼
    ✓ 設計決策反映在實作中

    準備封存！
```

在關閉變更之前，捕捉不匹配之處。

### 清晰命名變更

好的名稱讓 `openspec list` 更有用：

```text
良好：                          避免：
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## 命令快速參考

如需完整的命令詳細資訊與選項，請參閱 [命令](commands.md)。

| 命令 | 用途 | 使用時機 |
|---------|---------|-------------|
| `/opsx:propose` | 建立變更 + 規劃產物 | 快速預設路徑（`core` 設定檔） |
| `/opsx:explore` | 思考構想 | 需求不明確、進行調查時 |
| `/opsx:new` | 啟動變更腳手架 | 擴充模式，明確控制產物 |
| `/opsx:continue` | 建立下一個產物 | 擴充模式，逐步建立產物 |
| `/opsx:ff` | 建立所有規劃產物 | 擴充模式，範圍明確 |
| `/opsx:apply` | 實作任務 | 準備撰寫程式碼時 |
| `/opsx:verify` | 驗證實作結果 | 擴充模式，歸檔前執行 |
| `/opsx:sync` | 合併差異規格 | 擴充模式，可選步驟 |
| `/opsx:archive` | 完成變更 | 所有工作完成時 |
| `/opsx:bulk-archive` | 批次歸檔多個變更 | 擴充模式，平行工作時 |

## 後續步驟

- [命令](commands.md) - 完整命令參考與選項
- [概念](concepts.md) - 深入了解規格、產物與架構
- [自訂](customization.md) - 建立自訂工作流程