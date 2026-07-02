# 範例與食譜

真實的變更，從開始到結束。每個食譜都展示了您會輸入的指令和您將看到的結果，因此您可以將您的情況套用到一個模式並複製它。這些食譜使用了預設的 **core** 指令（`propose`、`explore`、`apply`、`sync`、`archive`）；如果需要擴展功能，則有註明說明。

在開始之前提醒一下：像 `/opsx:propose` 這樣的斜線指令應輸入到您的 **AI 助理聊天**中，而 `openspec` 指令應輸入到您的 **終端機 (terminal)** 中。如果這對您來說是新的，請先閱讀 [How Commands Work](how-commands-work.md)。在下面的轉錄內容中，`You:` 和 `AI:` 是聊天記錄，以 `$` 開頭的行是終端機操作。

> **還不確定自己正在構建什麼？** 大多數這些食譜如果先從 `/opsx:explore` 開始思考會更清晰。[Recipe 3](#recipe-3-exploring-before-you-commit) 展示了這一點，而 [Explore First](explore.md) 指南則提供了完整的論證。

## Recipe 1：一個小型功能，快速路徑

**何時使用它：** 您知道自己想要什麼，這是一個範圍明確的工作。這是最常見的食譜。

整個過程包含三個指令：Propose（提議）、Build（構建）和Archive（歸檔）。

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — 為什麼以及是什麼
     ✓ specs/      — 新的需求及其場景
     ✓ design.md   — 技術方法
     ✓ tasks.md    — 實作檢查清單
     Ready for implementation. Run /opsx:apply.
```

現在請閱讀規劃。打開提議和 delta spec。這正是 OpenSpec 的用途：在錯誤假設還只是一個段落，而不是四百行程式碼時就捕捉到它。如果某個地方不對勁，請直接編輯任何產物，然後繼續進行下一步。

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

就是這樣。登出行為現在已成為您的規格的一部分，並且變更已與其完整的上下文一起歸檔。

## Recipe 2：一個 Bug 修復

**何時使用它：** 有些東西壞了，您希望將修復記錄為對行為的刻意更改，而不是一個神秘的提交 (commit)。

Bug 修復的工作方式與功能相同。區別在於您如何構建提議：描述*正確*的行為，而不僅僅是「修復這個 Bug」。

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

由於這個修復是以一個帶有新場景的 `MODIFIED`（已修改）需求形式落地的，所以下一個人（或下一次 AI 會話）看到的不僅僅是您修好了它，而是「正確」意味著什麼。然後像往常一樣執行 `/opsx:apply` 和 `/opsx:archive`。

提示：對於一個 Bug 修復來說，一個好的場景就是敘述性的回歸測試 (regression test)。例如：「GIVEN 一個已登出用戶，WHEN 他們提交有效的憑證，THEN 他們會到達儀表板且不會再次被重定向。」寫下這段話，實作就有了明確的目標。

## Recipe 3：在提交前進行探索

**何時使用它：** 您有一個問題，但還沒有解決方案。您不確定該構建什麼，或者哪種方法是正確的。

從 `/opsx:explore` 開始。這是一個沒有結構、也沒有創建任何產物的思考夥伴。它會閱讀您的程式碼庫並幫助您做出決定。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: 頁面加載感覺很慢，但我不知道時間花在哪裡。

AI:  讓我看看... 我找到了三個可能的元兇：
     1. 產品列表中的大型未優化圖像
     2. 會阻塞渲染的同步資料獲取 (Synchronous data fetching)
     3. 由上下文變更觸發的重新渲染 (Re-renders)
     我們應該先處理哪一個？

You: 資料獲取的那個。

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

探索在您投入資源之前就澄清了您的思考。當洞察力結晶化後，請提出（propose），然後 AI 才能將上下文承接下去。

## Recipe 4：同時處理兩個變更

**何時使用它：** 您正在進行某個功能，但一個緊急的修復跳過了排隊順序。

變更是獨立的資料夾，因此平行工作不會產生衝突。先開始修復，發布它，然後回到功能，從您中途停止的地方繼續。

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

在 `/opsx:apply add-dark-mode` 中命名變更，就是當有多個變更同時進行時，您指示 AI 去處理特定變換的方法。因為任務會追蹤 `tasks.md` 中的完成情況，所以 AI 精確地知道您在哪裡停止了。

當多個變更同時完成時，擴展的 `/opsx:bulk-archive` 會將它們一起歸檔，並通過檢查實際實作內容來解決規格衝突。請參閱 [Workflows](workflows.md#parallel-changes)。

## Recipe 5：一個沒有行為變化的重構 (Refactor)

**何時使用它：** 您正在重組程式碼，而外部可見的行為應該保持不變。

這是有趣的情況，因為純粹的重構（refactor）對您的規格來說是*沒有任何新增內容*的。行為合約不會改變；只有實作會改變。因此，工作存在於設計和任務中，規格 delta 則是空的或不存在的。

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

當您歸檔一個不涉及規格的變更時，您可以指示終端機指令跳過規格步驟：

```bash
$ openspec archive refactor-payment-module --skip-specs
```

這個旗標對於工具、CI 和僅限於文件 (docs-only) 的變更也很有用。原則是：規格描述行為，因此如果行為沒有改變，規格也不應該改變。請參閱 [Concepts](concepts.md#what-a-spec-is-and-is-not)。

## Recipe 6：逐步控制（擴展指令）

**何時使用它：** 一個複雜或高風險的變更，您希望在推進之前審查每個產物。

核心的 `/opsx:propose` 會一次性起草所有內容。當您寧願一步一步地進行時，請開啟擴展指令：

```bash
$ openspec config profile      # 選擇擴展工作流程
$ openspec update              # 將它們應用到此專案
```

現在您可以增量地搭建和構建：

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

當每個產物生成時都進行審查，自由編輯，然後在您滿意後繼續。當您想一次性完成剩餘的規劃內容時，使用 `/opsx:ff` 快速推進 (fast-forwards) 剩下的規劃產物。在歸檔之前，`/opsx:verify` 會檢查實作是否確實符合規格。請參閱 [Workflows](workflows.md#opsxff-vs-opsxcontinue)。

## Recipe 7：親手學習整個流程

**何時使用它：** 您已經安裝了 OpenSpec，並想在您自己的程式碼上（而不是玩具範例）*感受*這個工作流程。

開啟擴展指令（參見 Recipe 6），然後執行以下操作：

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` 會找到一個真實的（小型）改進，為其創建一個變更、進行實作並歸檔它，同時敘述每個步驟。這需要 15 到 30 分鐘，會讓您得到一個可以保留或丟棄的實際變更。這是最溫和的學習方式。請參閱 [Commands](commands.md#opsxonboard)。

## 從終端機檢查您的工作成果

隨時，您都可以從終端機檢查事物狀態：

```bash
$ openspec list                      # 正在進行中的變更
$ openspec show add-dark-mode        # 詳細查看一個變更
$ openspec validate add-dark-mode    # 檢查結構
$ openspec view                      # 互動式儀表板
```

這些都是閱讀和檢查的工具。提議和構建仍然是在聊天中的斜線指令完成的。完整的詳情請參閱 [CLI reference](cli.md)。

## 下一步該去哪裡？

- [Explore First](explore.md)：當您不確定時，建議採用的起始方式
- [Workflows](workflows.md)：上述模式，並提供何時使用每個模式的決策指南
- [Commands](commands.md)：所有斜線指令的詳細說明
- [Getting Started](getting-started.md)：標準化的首次變更操作流程
- [Concepts](concepts.md)：解釋各部分為何會如此協作