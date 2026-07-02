# FAQ

人們常問到的問題的快速解答。如果您的問題是「某個東西壞了」這類型的，請參閱 [Troubleshooting](troubleshooting.md)。如果您想定義一個術語，請查看 [Glossary](glossary.md)。

## 基礎知識 (The basics)

### 一句話概括 OpenSpec 是什麼？

它是一個輕量級的層次，可以在任何程式碼被編寫之前，讓您和您的 AI 編程助手就「要做什麼」達成書面共識。

### 我為什麼會需要它？

因為 AI 助手即使出錯也表現得很有把握。當需求僅存在於聊天串中時，AI 會用猜測來填補空白，而您是在程式碼生成後才發現問題。OpenSpec 將這個共識提前，讓錯誤的修正成本更低。請參閱 [Core Concepts at a Glance](overview.md) 以了解完整的案例說明。

### 我必須對所有事情都使用它嗎？

不。在需要達成共識的地方使用它，這通常是大多數非瑣碎的工作。對於一個單字元的拼寫錯誤修復，這個儀式可能不值得，這是可以接受的。

### 我可以在現有的大型程式碼庫上使用它，還是只能用於新專案？

現有程式碼庫才是重點。OpenSpec 採用「棕地優先」（brownfield-first）原則：您不需要一次性地記錄整個應用程式。您只需針對每個變更所涉及的部分撰寫規格，而您的規格會隨著實際工作進展而被逐步完善。有一份專門的指南：[Using OpenSpec in an Existing Project](existing-projects.md)。

### 它是否與某一個 AI 工具綁定？

不。OpenSpec 可與 25 個以上的助手配合使用，包括 Claude Code、Cursor、Windsurf、GitHub Copilot、Gemini CLI、Codex 等。完整的清單和每個工具的詳細資訊請參閱 [Supported Tools](supported-tools.md)。

## 執行指令 (Running commands)

### 我在哪裡輸入 `/opsx:propose`？

在您的 AI 助手的聊天介面中，而不是在終端機（terminal）。這是最常見的一個困惑點，因此有專門的頁面：[How Commands Work](how-commands-work.md)。簡而言：`openspec ...` 在終端機執行，`/opsx:...` 在聊天室執行。

### 我如何「啟動互動模式」？

並沒有一個單獨的模式需要啟動。您像平常一樣開啟您的 AI 助手，然後在它的聊天介面中輸入一個斜線指令（slash command）。這個斜線指令就是您「進入」OpenSpec 的方式。（唯一真正具有互動性的終端機功能是 `openspec view`，這是一個用於瀏覽規格和變更的儀表板。）完整的解釋請參閱 [How Commands Work](how-commands-work.md)。

### 我輸入了斜線指令但沒有任何反應。為什麼？

您很可能是在終端機而不是在 AI 聊天室中輸入的，或者這些指令尚未安裝。請在專案中執行 `openspec update`，重新啟動您的助手，然後再嘗試在聊天室中輸入 `/opsx` 並留意自動補全功能。[Troubleshooting](troubleshooting.md#commands-dont-show-up) 提供了完整的檢查清單。

### 為何有些工具的語法是 `/opsx:propose`，而另一些則是 `/opsx-propose`？

每個 AI 工具呈現自訂指令的方式略有不同。其意圖是相同的；只是標點符號不一樣。在聊天室中輸入斜線，自動補全功能會顯示出您的工具所預期的格式。每個工具的表格請參閱 [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool)。

### 技能（skill）和指令（command）有什麼區別？

兩者都是 OpenSpec 用來讓您的助手執行工作流程的文件。Skills (`.../skills/openspec-*/SKILL.md`) 是較新的跨工具標準；Commands (`.../commands/opsx-*`) 是舊的、針對特定工具的斜線文件。您不需要二選一。您只需輸入斜線指令，OpenSpec 就會安裝您的工具所使用的那一個。

## 工作流程 (The workflow)

### 如果我不確定要做什麼，我應該從哪裡開始？

從 `/opsx:explore` 開始。它是一個無壓力的思考夥伴，會閱讀您的程式碼庫、列出選項，並在任何變更或程式碼存在之前，將模糊的問題轉化為具體的計畫。它位於預設配置中，因此隨時可用。當計畫清晰後，它會交接給 `/opsx:propose`。這是您應該採取的最佳習慣，因為它可以阻止一個急於表現的 AI 做出自信地編寫錯誤的東西。請參閱 [Explore First](explore.md)。

### 最簡單的流程是什麼？

```text
/opsx:explore (可選)   然後   /opsx:propose <您想要什麼>   然後   /opsx:apply   然後   /opsx:archive
```

先探索（explore）來思考，再提出（propose）來起草計畫，應用（apply）來建置，歸檔（archive）來存檔。如果您已經清楚知道自己想要什麼，則可以跳過探索步驟。

### `/opsx:propose` 和 `/opsx:new` 有什麼區別？

`/opsx:propose` 是預設的一步式指令：它會一次性地創建變更並起草所有規劃產物（planning artifacts）。`/opsx:new` 是擴展指令集的一部分，它只會搭建一個空的變更框架（scaffold），讓您使用 `/opsx:continue`（或一次性使用 `/opsx:ff`）來逐一創建產物。除非您想要逐步控制，否則請使用 propose。請參閱 [Commands](commands.md)。

### 什麼是 `core` 和 expanded (擴展) 配置？

配置決定了哪些斜線指令會被安裝。**Core**（預設）提供了 `propose`、`explore`、`apply`、`sync`、`archive`。**Expanded** 集則增加了 `new`、`continue`、`ff`、`verify`、`bulk-archive` 和 `onboard`，以提供更精細的控制。請使用 `openspec config profile` 進行切換，然後使用 `openspec update` 應用更改。

### 我需要執行 `/opsx:sync` 嗎？

通常不需要。Sync 會將變更的 delta 規格（delta specs）合併到您的主規格中，而 `/opsx:archive` 會提供此功能。僅當您希望在歸檔之前先合併規格時才手動運行 sync，例如對於一個長期進行的變更。請參閱 [Commands](commands.md#opsxsync)。

### 我開始後了，如何編輯提案（proposal）、規格（spec）或任務（task）？

直接編輯文件即可。每個產物都是 `openspec/changes/<name>/` 中的純 Markdown 文件，沒有鎖定的階段或特殊的編輯模式。您可以手動更改它，或者請您的 AI 助手進行修訂（例如：「將設計更新為使用佇列」），然後繼續進行。AI 總是基於當前的文件內容來工作的。完整指南：[Editing & Iterating on a Change](editing-changes.md)。

### 我是否可以在實施了一部分後退回去更改計畫？

可以，隨時都可以。工作流程是流動的，因此審查和編輯並非您會被鎖定的階段。請編輯該產物，然後繼續進行。如果您想要一個結構化的檢查，以確保程式碼仍然符合計畫，請執行 `/opsx:verify`。請參閱 [Editing & Iterating on a Change](editing-changes.md#how-do-i-go-back-to-review-after-implementing)。

### 我手動編輯了程式碼。我該如何將其與規格（spec）對齊？

在歸檔之前，請讓它們重新同步，因為歸檔會使您的規格成為「真實的記錄」。如果程式碼現在是正確的，請更新 delta 規格以匹配您所交付的內容；如果規格是正確的，則繼續編寫，直到程式碼與之相符。`/opsx:verify` 會顯示出不一致的地方。請參閱 [Editing & Iterating on a Change](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec)。

### 應該在更新現有變更和開始一個新的變更之間如何抉擇？

當它是相同的、經過精煉的工作時，就進行更新。當意圖根本性地改變或範圍擴大到不同的工作時，則從頭開始。[Workflows](workflows.md#when-to-update-vs-start-fresh) 中有決策流程圖和範例。

### 如果我的會話（session）耗盡上下文（context），或者需求在實施過程中發生變化該怎麼辦？

這就是規格發揮作用的地方。因為計畫存在於文件中（而不僅僅是聊天記錄中），您可以清除您的上下文，開始一個新的 AI 會話，然後使用 `/opsx:apply` 繼續；它會閱讀這些產物並從第一個未檢查的任務處恢復。如果需求發生變化，請編輯產物以匹配新的現實情況，然後繼續進行。保持乾淨的上下文視窗也能產生更好的結果；在實施前清除它。

### 我應該將 `openspec/` 資料夾提交到 git 嗎？

是的。您的規格、活躍變更和歸檔都是您專案歷史的一部分。像任何其他原始碼一樣提交它們。特別是歸檔，它成為了一個持久的記錄，說明了您的系統為何以這種方式運作。

## 規格與變更 (Specs and changes)

### 規格（spec）和設計（design）有什麼區別？

規格描述可觀察到的行為：系統做了什麼、它的輸入、輸出和錯誤條件。設計則描述您將如何構建它：技術方法、架構決策、文件變動。如果實施可以改變而不會改變外部可見的行為，那麼它就屬於設計而非規格。[Concepts](concepts.md#what-a-spec-is-and-is-not) 提供了更深入的探討。

### 什麼是 delta spec？

一種只描述正在變動的部分的規格，使用 `ADDED`、`MODIFIED` 和 `REMOVED` 等區塊，而不是重述整個規格。這是 OpenSpec 清晰處理現有系統編輯方式的方法。[Concepts](concepts.md#delta-specs)。

### 歸檔的變更會放在哪裡？

會存放在 `openspec/changes/archive/YYYY-MM-DD-<name>/` 中，所有產物都被保留。沒有任何東西被刪除；該變更只是從您的活躍清單中移出去了。

## 配置與自訂 (Configuration and customization)

### 我如何告訴 AI 我的技術棧（tech stack）？

將它放在 `openspec/config.yaml` 的 `context:` 下面。這段文字會被注入到每一次規劃請求中，因此 AI 總是知道您的技術棧和約定俗成。請參閱 [Customization](customization.md#project-configuration)。

### 我可以生成非英文的規格嗎？

可以。在配置文件的 `context:` 中加入語言指令。[Multi-Language](multi-language.md) 提供了多種語言的複製貼上範例。

### 我可以改變工作流程本身嗎？

可以，使用自訂模式（custom schemas）。一個 Schema 定義了哪些產物存在以及它們之間如何依賴。請使用 `openspec schema fork spec-driven my-workflow` 從預設配置進行分支（fork），然後編輯它。請參閱 [Customization](customization.md#custom-schemas)。

## 模型、隱私密與升級 (Models, privacy, and upgrades)

### 我應該使用哪個 AI 模型？

OpenSpec 與高推理能力的模型配合得最好。README 建議使用 Codex 5.5 和 Opus 4.7 等模型進行規劃和實施。同時請保持您的上下文視窗乾淨：在實施前清除它以獲得最佳結果。

### OpenSpec 會收集資料嗎？

它會收集匿名的使用統計數據：僅限於指令名稱和版本。不會收集參數、路徑、內容或個人資料，並且在 CI 中是自動關閉的。您可以使用 `export OPENSPEC_TELEMETRY=0` 或 `export DO_NOT_TRACK=1` 來選擇退出（opt out）。

### 我如何升級？

兩個步驟。首先升級套件 (`npm install -g @fission-ai/openspec@latest`)，然後在每個專案內部運行 `openspec update` 以刷新生成的技能和指令。

### 我如何解除安裝 OpenSpec？

沒有單獨的解除安裝指令，因為它只是一個全域性（global）套件加上您專案中的文件。請移除該套件 (`npm uninstall -g @fission-ai/openspec`)，並可選地刪除 `openspec/` 目錄和生成的工具文件。逐步指南，包括哪些內容是安全的保留，請參閱 [Installation: Uninstalling](installation.md#uninstalling)。

## 尋求幫助 (Getting help)

### 我在哪裡提問或回報錯誤？

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **從您的終端機：** `openspec feedback "your message"` 會為您開啟一個 GitHub issue。

### 這些文件有錯誤或令人困惑。我該怎麼辦？

請告訴我們，或者修復它。歡迎並重視文檔 PR（Pull Request）。請開啟一個 Issue 或發送一個 Pull Request。