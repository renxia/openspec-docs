# 在現有專案中使用 OpenSpec

**您不需要從零開始就對整個程式碼庫進行文件化。您只需要為即將更改的部分撰寫規格書。** 這是採用 OpenSpec 到既有專案時最重要的一點，也是 OpenSpec 之所以被設計成「現有基礎優先」（brownfield-first）的原因。

一個常見的擔憂是：「我的應用程式已經有八萬行了。我是否必須在 OpenSpec 有用之前就為所有內容撰寫規格書？」答案不是。您會討厭那樣做，我們也會。OpenSpec 是一次一改、逐步擴展您的規格書。您的第一次更改會記錄它所觸及的那個片段；下一次更改則記錄其片段，隨著數月過去，您的規格書將自然地圍繞著您實際進行的工作而充實起來。

本指南將展示如何在不「想把海洋都煮沸」的情況下從第一天開始使用。

## 三十秒版本

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

然後，在您的 AI 聊天介面中：

```text
/opsx:explore            # 可選：讓 AI 閱讀您將要觸及的區域
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

您的規格書現在精確地描述了該更改所涉及的系統部分，不多也不少。這就是正確的。您不必再為那其他八萬行程式碼而煩惱了。

## 為什麼「增量優先」（delta-first）是關鍵技巧

OpenSpec 的變更是以**增量（deltas）**形式編寫的：`ADDED`、`MODIFIED`、`REMOVED`。一個增量描述的是相對於當前行為的變化，而不是整個系統。

這正是現有基礎工作所需要的。您很少是從零開始建構的。您可能是在新增一個欄位、修復一個重定向（redirect），或是收緊一個超時時間（timeout）。增量讓您可以精確地指定那一個變更，而無需先撰寫一份關於周圍環境的四十頁規格書。

因此，您的 `openspec/specs/` 目錄並不會一開始就充滿且完整。它幾乎是空的，然後逐漸累積起來。每個歸檔（archived）的更改都會合併其增量。只有在您進行了數個與認證（auth）相關的變更之後，`auth/` 的規格書才會變得詳盡，而這正是您希望它詳盡的時候。

如果您想了解更深層的機制，請參閱 [Concepts: Delta Specs](concepts.md#delta-specs)。

## 在真實程式碼庫上的第一次更改

選擇一件小且實際的事情。不是一個玩具項目，也不是重寫。而是您本週就打算做的一項變更。先從小的變更開始，這能讓您以低風險的方式掌握工作流程。

**步驟 1：讓 AI 閱讀相關區域。** 這就是 `/opsx:explore` 在面對不熟悉或龐大的程式碼庫時發揮作用的地方。將它指向您即將觸及的部分，讓它先繪製出事物運作的方式，然後再提出任何建議。

```text
You: /opsx:explore

AI:  您想探索什麼？

You: 我需要為我們的公共 API 添加速率限制（rate limiting），但我不太確定請求目前是如何流經中間件（middleware）的。

AI:  讓我追蹤一下... [閱讀路由器、中間件堆疊和配置]
     請求會到達 Express，通過認證中間件，然後進入您的控制器。目前沒有速率限制層級。最乾淨的插入點是在認證之後的一個中間件。需要我來規劃嗎？
```

請注意，AI 現在了解您實際的結構，因此它撰寫的提案將符合您的程式碼，而不是一個通用的模板。在大型程式碼庫中，這個單一習慣就能省去最大的痛苦。請參閱 [Explore First](explore.md)。

**步驟 2：提出變更。** 該提案及其增量規格書只捕捉了這項更改。

```text
You: /opsx:propose add-api-rate-limiting
```

**步驟 3：使用 `/opsx:apply` 和 `/opsx:archive` 進行建構和歸檔，與任何其他變更一樣。** 歸檔後，您就擁有了一個真實的速率限制行為規格書，它源於一項您本來就需要做的變更。

## 偏好引導式導覽？請使用 onboard

如果您寧願觀看整個循環在自己的程式碼上發生並附帶解說，那麼擴展命令 `/opsx:onboard` 就會做這件事：它會掃描您的程式碼庫尋找一個微小、安全的改進點，然後引導您完成提案、建構和歸檔的過程，解釋每個步驟。

請先開啟擴展命令：

```bash
$ openspec config profile      # 選擇擴展工作流程
$ openspec update              # 將它們應用於此專案
```

然後在聊天介面中：

```text
/opsx:onboard
```

這是對真實專案最溫和的介紹，它會讓您得到一個可以保留或丟棄的真正（小的）變更。請參閱 [Commands: `/opsx:onboard`](commands.md#opsxonboard)。

## 「但我已經有需求文件了」

也許您有一份 PRD、一份 SRS、一份正式規格書，甚至是 TLA+ 模型。這很好。您不需要將它們全部匯入，也不需要丟棄它們。

請將現有的文件視為**探索的原始素材**，而不是需要轉換成規格書的對象。當您開始一項變更時，請貼上或指向 AI 相關的部分，讓它從中塑造一個集中的 OpenSpec 增量。該增量會捕捉您現在正在更改的行為，並以 OpenSpec 可測試的要求和情境形式呈現。您的原始文件將保持原位作為背景參考。

這份誠實的原因是：OpenSpec 的規格書是有意地「行為優先」且限定於變更範圍的。一份四十頁的 PRD 是一個不同類型的產物，具有不同的職責。強行一次性的批量轉換往往會產生一份龐大、過時、沒有人信任的規格書。讓規格書從真實的變更中生長，才能保持其準確性。

```text
You: /opsx:explore
You: 這是我們 PRD 中關於結帳（checkout）的部分。我接下來要實作「訪客結帳」（guest checkout）的需求。
     [貼上相關需求]
AI:  [閱讀後，提出澄清問題，然後協助規劃變更]
You: /opsx:propose add-guest-checkout
```

## 在大型程式碼庫中組織規格書

規格書存放在 `openspec/specs/` 下，並按**領域（domain）**分組：這是一個與您的團隊如何看待系統相匹配的邏輯區域。您不必一開始就設計出完整的分類法。當該領域的第一次變更需要時，才創建一個領域資料夾。

切分領域的常見方式包括：

- **按功能區塊（feature area）：** `auth/`、`payments/`、`search/`
- **按元件（component）：** `api/`、`frontend/`、`workers/`
- **按邊界上下文（bounded context）：** `ordering/`、`fulfillment/`、`inventory/`

選擇讓新來者感到滿意的任何一種方式。之後再進行完善。請參閱 [Concepts: Specs](concepts.md#specs)。

## 單體儲存庫（Monorepos）和跨儲存庫的工作

對於單體儲存庫，最簡單的模型是在儲存庫根目錄下有一個 `openspec/` 目錄，並使用對應於您的套件或服務的領域。這涵蓋了大多數團隊的需求。

如果您的工作確實橫跨**多個儲存庫**（或您視為獨立的幾個套件），OpenSpec 有一個 Beta 版的 **stores** 功能：規劃將存在於它自己的獨立儲存庫中，任何一個程式碼儲存庫都可以引用它，這樣計畫就不必存在於某一個儲存庫的 `openspec/` 資料夾內。由於這是 Beta 版本，請將其命令和狀態視為不斷演進的。請從 [Stores User Guide](stores-beta/user-guide.md) 開始了解心智模型和最小的有用路徑。

## 幾點誠實的注意事項

- **抵制一股想要補齊所有內容的衝動。** 為您沒有更改的程式碼撰寫規格書會讓人感覺有成效，但通常不是這樣。那些規格書會過時，因為沒有任何東西迫使它們追蹤現實情況。讓真實的變更來驅動您的規格書。
- **保持初期的變更小巧。** 您最初的幾次更改與交付成果一樣重要，它也是關於學習節奏感。一個緊密的範圍能讓循環快速進行，並讓教訓成本低廉。
- **將 `openspec/` 提交到 git。** 您的規格書和歸檔內容應與它們所描述的程式碼一起存在於版本控制中。
- **給 AI 上下文。** 在一個具有強烈約定（conventions）的大型程式碼庫上，請填寫 `openspec/config.yaml` 中的 `context:` 欄位，確保每個提案都尊重您的技術棧和模式。請參閱 [Customization](customization.md#project-configuration)。

## 下一步該去哪裡？

- [Explore First](explore.md) - 在更改程式碼之前理解程式碼的關鍵習慣
- [Getting Started](getting-started.md) - 完整的首次變更流程指南
- [Editing & Iterating on a Change](editing-changes.md) - 當您學習時如何調整一個變更
- [Concepts: Delta Specs](concepts.md#delta-specs) - 為什麼增量使現有基礎工作變得乾淨俐落
- [Customization](customization.md) - 教導 OpenSpec 了解您的專案約定