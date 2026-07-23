# 範例與食譜

真實專案，從頭到尾。每個食譜都會展示你輸入的指令以及對應的回應，方便你對應自身情境、複用模式。本文預設使用**核心**指令（`propose`、`explore`、apply、`sync`、`archive`）；若擴充指令集能提供幫助，會特別標註。

開始前的提醒：像 `/opsx:propose` 這類斜線指令要輸入到**AI 助理的對話視窗**，`openspec` 指令則要輸入到**終端機**。如果你還不熟悉這項規則，請先閱讀[指令運作方式](how-commands-work.md)。在下方的對話紀錄中，`You:` 和 `AI:` 代表對話視窗的內容，以 `$` 開頭的行則代表終端機指令。

> **還不確定要建置什麼？** 大部分食譜都會先建議你用 `/opsx:explore` 梳理思路，效果會更好。[食譜 3](#recipe-3-exploring-before-you-commit) 展示了實際操作方式，而[先探索](explore.md)指南則說明了完整的適用場景。

## 食譜 1：小型功能，快速路徑

**適用場景：** 你已經確定了要做的內容，且工作範圍明確。這是最常用的食譜。

整個流程只需要三個指令：提案、建置、歸檔。

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

現在閱讀計畫。打開提案與差異規格文件。這就是 OpenSpec 的核心價值：在錯誤假設還只是一段文字、尚未變成 400 行程式碼時就將其攔截。如果有任何內容不對，直接編輯對應產出物，之後繼續即可。

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

就這樣完成了。登出行為現在已納入你的規格文件，本次變更也連同完整上下文一起歸檔。

## 食譜 2：錯誤修復

**適用場景：** 系統出現問題，且你想要將修復過程記錄為明確的行為變更，而非難以追蹤的神祕提交。

錯誤修復的流程與功能開發完全一致，差別在於提案的撰寫方式：你要描述*正確的行為*，而非只寫「修復錯誤」。

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

由於本次修復會以 `MODIFIED` 狀態的需求搭配新場景落地，後續人員（或下一個 AI 工作階段）不僅能看到你修復了問題，還能明確知道「正確行為」的定義。後續照常執行 `/opsx:apply` 與 `/opsx:archive` 即可。

提示：針對錯誤修復，一個好的場景就是文字版的回歸測試。例如：「GIVEN 處於登出狀態的使用者，WHEN 提交有效的憑證，THEN 會跳轉到儀表板且不會再次重新導向。」寫下這樣的場景，實作就會有明確的目標。

## 食譜 3：提交前先探索

**適用場景：** 你遇到了問題但還沒有明確的計畫，不確定要建置什麼，或是哪種方案更合適。

先執行 `/opsx:explore`。這個指令沒有固定格式、也不會產生任何產出物，就像一個思考夥伴，會讀取你的程式碼庫並協助你做出決策。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

探索能讓你在投入變更之前釐清思路。當洞察形成後，提出提案即可，AI 會繼承之前的對話上下文繼續後續流程。

## 食譜 4：同時處理多個變更

**適用場景：** 你正在開發某個功能時，突然有緊急修復需要插隊處理。

每個變更都有獨立的資料夾，因此平行處理多個任務不會產生衝突。先完成緊急修復並上線，再回到原本的功能開發，從中斷的地方繼續即可。

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

在 `/opsx:apply` 後加上變更名稱（例如 `/opsx:apply add-dark-mode`），就是當有多個進行中的變更時，指定 AI 處理特定變更的方式。由於任務完成狀態會記錄在 `tasks.md` 中，AI 能準確知道你在哪裡中斷了工作。

當有多個變更需要一次性歸檔時，擴充指令 `/opsx:bulk-archive` 可以批次處理，並透過比對實際實作內容來解決規格衝突。詳見[工作流程](workflows.md#parallel-changes)。

## 食譜 5：無行為變更的程式碼重構

**適用場景：** 你正在調整程式碼結構，且對外可見的行為必須保持完全不變。

這是一個比較特殊的情況：純重構不需要對規格文件做任何修改。行為契約沒有變化，只有實作方式改變。因此相關工作只存在於設計文件與任務清單中，規格差異為空或完全不存在。

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

要明確標示規格差異為空，可以在變更的 `.openspec.yaml` 檔案中設定 `skip_specs: true`：

```yaml
schema: spec-driven
skip_specs: true
```

如果沒有這個標記，`openspec validate` 會拒絕沒有規格差異的變更（這樣就能攔截遺漏規格階段的疏漏）；加上標記後，驗證會通過，且 `openspec status` 會顯示規格階段為「明確跳過」而非「待處理」。如果重構後續發現還是改變了行為，只要從 `.openspec.yaml` 中移除 `skip_specs` 並撰寫規格差異即可——驗證機制會將標記與規格檔案視為衝突，因此舊標記不會默默遺留。

歸檔帶有標記的變更不需要額外參數（因為沒有規格差異需要合併）。另外，終端機指令的 `--skip-specs` 參數可以用來明確跳過規格步驟：

```bash
$ openspec archive refactor-payment-module --skip-specs
```

這個參數在工具整合、CI 以及僅修改文件的變更中都很實用。核心原則是：規格文件描述的是行為，因此如果行為沒有變化，規格也不應該修改。詳見[概念](concepts.md#what-a-spec-is-and-is-not)。

## 食譜 6：逐步控制（使用擴充指令）

**適用場景：** 複雜或高風險的變更，你想要在進入下一步之前先審查每個產出物。

核心指令 `/opsx:propose` 會一次產出所有文件。如果你想要逐步進行，可以啟用擴充指令：

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

現在你可以逐步搭建雛形與建置：

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

每個產出物完成後都可以先審查，隨意編輯，滿意後再繼續。如果你想要一次性產出剩餘的所有規劃文件，可以使用 `/opsx:ff` 快速跳過剩餘的規劃產出物。歸檔前，`/opsx:verify` 會檢查實作內容是否真的符合規格。詳見[工作流程](workflows.md#opsxff-vs-opsxcontinue)。

## 食譜 7：親手體驗完整流程

**適用場景：** 你已經安裝了 OpenSpec，想要在自己的程式碼上親身體驗工作流程，而不是用玩具範例。

先啟用擴充指令（詳見食譜 6），然後：

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` 會找到一個真實的（小型）優化項目，為它建立變更、實作並歸檔，同時講解每一步驟。整個過程耗時 15 到 30 分鐘，最後會留下一個真實的變更，你可以選擇保留或丟棄。這是最輕鬆的學習方式。詳見[指令](commands.md#opsxonboard)。

## 從終端機檢查你的工作

隨時都可以從終端機檢查當前狀態：

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

這些都是讀取與檢查工具，提案與建置流程仍然需要透過對話視窗中的斜線指令完成。完整說明請見[CLI 參考文件](cli.md)。

## 下一步建議

- [先探索](explore.md)：不確定方向時推薦的起始方式
- [工作流程](workflows.md)：上述模式的詳細說明，包含各模式的適用場景判斷指引
- [指令](commands.md)：所有斜線指令的詳細說明
- [入門指南](getting-started.md)：首次變更的標準步驟解說
- [概念](concepts.md)：各元件設計邏輯的背後原因