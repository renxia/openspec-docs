# 探索 (Explore)

**`/opsx:explore` 是您的思考夥伴。當您遇到問題但還沒有解決方案時，就尋求它。它會調查您的程式碼庫、與您一起權衡選項，並在任何單一的產物或程式碼行被創建之前，釐清您真正想要的是什麼。一旦畫面清晰，它就會將工作移交給 `/opsx:propose`。**

如果您從這份文件學到一個習慣，那就學這個：**當您不確定時，先探索再提出方案。**

這點為什麼重要？AI 程式碼助理非常熱切。如果您模糊地提問，它會自信地建立*某個東西*，但可能不是您真正需要的東西。而「探索」就是解藥方。這是一個沒有風險的對話過程，您和 AI 一起找出正確的方向，這樣當您提出方案時，您提出的就是正確的東西。

## 何時進行探索 (When to explore)

「探索」比人們預期的情況下更常是正確的第一步。當以下任一情況成立時，請使用它：

- 您知道*問題*但不知道*解決方案*。（例如：「頁面感覺很慢。」「身份驗證（Auth）是一團亂麻。」「我們不斷收到重複的訂單。」）
- 您正在權衡不同的方法，並希望針對您的實際程式碼來評估這些取捨。
- 您是新加入一個程式碼庫，需要先了解某事物如何運作才能進行修改。
- 需求模糊不清，您想在承諾之前將其精煉出來。
- 您懷疑工作量比看起來大或小，並想誠實地評估範圍。

只有當您已經確切知道自己想要什麼以及如何做時，才跳過探索。那時請直接前往 [`/opsx:propose`](commands.md#opsxpropose)。

## 它能做什麼（和不能做什麼）(What it does (and doesn't))

「探索」是一個**對話過程**，而不是一個生成器。

**它會：**
- 閱讀並搜尋您的程式碼庫以回答真實的問題。
- 比較選項並說明每個選項的權衡取捨。
- 繪製圖表，使設計易於理解。
- 幫助您將模糊的想法縮小為具體、可建構的範圍。
- 當您準備好時，過渡到 `/opsx:propose`。

**它不會：**
- 創建變更資料夾。
- 撰寫任何產物（不包括提案、規格說明、設計或任務）。
- 撰寫或修改程式碼。

這就是重點。「探索」對您來說成本為零，也承諾您做任何事。您可以探索三個死胡同，從每個中學到一些東西，然後才提出那個倖存下來的解決方案路徑。

## 它已經安裝好了 (It's already installed)

好消息是：`/opsx:explore` 包含在預設的 **core** 設定檔中，與 `propose`、`apply`、`sync` 和 `archive` 一樣存在。您不需要啟用任何東西。如果您的專案中設定了 OpenSpec，那麼 AI 聊天室就準備好使用探索功能了。（和所有 `/opsx:*` 指令一樣，您是在助理的聊天室中輸入它，而不是在終端機中。請參閱 [How Commands Work](how-commands-work.md)。）

## 一個完整範例 (A full example)

觀看一個模糊的擔憂如何變成一個清晰、可執行的變更。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

請注意所發生的事情。起點是「有什麼不對勁，我害怕動它」。二十秒的探索將其轉變為一個命名的根本原因、三個排序的選項、一個與現有程式碼相關聯的建議，以及一個精確的變更。後續的提案之所以清晰，是因為思考過程先於行動。

## 移交給 Propose (Handing off to propose)

探索不會將內容歸檔到任何地方。當您準備好時，您只需開始一個變更，AI 就會將對話中的上下文帶入產物中。

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

您可以用日常語言說出（「讓我們把這變成一個變更」），或者直接執行 `/opsx:propose <name>`。無論哪種方式，您剛完成的探索都會成為提案的基礎，而不是一次隨意的聊天。

如果您使用擴展的指令集，探索還可以將工作移交給 `/opsx:new`，以便逐步創建產物。請參閱 [Workflows](workflows.md)。

## 好的探索技巧 (Tips for a good exploration)

- **帶來問題，而不是解決方案。**「登入感覺很慢」會給 AI 空間去調查。「新增 Redis 快取」則預先承諾了一個您尚未測試過的答案。
- **大聲詢問權衡取捨。**「每個選項的缺點是什麼？」可以讓您得到更誠實的比較。
- **讓它先閱讀。**最好的探索始於 AI 實際查看您的程式碼，而不是猜測。如果有幫助，請將相關區域指出給它看。
- **放棄也是可以接受的。**如果探索顯示這個想法不值得投入，那也是一個勝利。您以低成本學到了教訓。
- **在變更過程中再次探索。**在 `/opsx:apply` 階段卡住了？您可以退回一步，去探索一個子問題，然後再回來。

## 誠實的權衡取捨 (The honest tradeoffs)

**您獲得了什麼：** 「探索」能在任何產物存在之前，以最低成本地攔截錯誤的方向。這在不熟悉的程式碼中尤其強大，因為 AI 閱讀和總結系統的能力為您省下了半天的「考古」。

**它需要付出什麼：** 一點耐心。「探索」是一個對話過程，因此比直接執行 `/opsx:propose` 並祈禱要慢一些。對於您已經真正了解的工作，這個額外的步驟就是純粹的開銷，您應該跳過它。

經驗法則：任務越模糊不清，探索的回報就越高。任務越清晰明確，您就可以越快地直接進入提案階段。

## 下一步去哪裡 (Where to go next)

- [Commands: `/opsx:explore`](commands.md#opsxexplore)：精確的參考指南
- [Workflows](workflows.md)：作為日常循環的一部分進行探索
- [Examples & Recipes](examples.md#recipe-3-exploring-before-you-commit)：完整的操作流程中的探索範例
- [Getting Started](getting-started.md)：包含探索功能的首次變更指南