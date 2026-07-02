# Stores: Plan in Its Own Repo

> **Beta.** Stores, references, working context, and worksets are
> 新增的。命令名稱、旗標（flags）、檔案格式和 JSON 輸出仍可能在不同版本間發生變化。每個以下的範例皆是在當前建構上執行的，但請在升級後重新閱讀本指南。

## 這項功能解決的問題

OpenSpec 通常存在於一個程式碼儲存庫 (code repo) 中：即您的程式碼旁邊的一個 `openspec/` 資料夾，用於存放該儲存庫的規格（specs）和變更內容。

但當您的規劃範圍大於單一個儲存庫時，這種做法就顯得力不從心：

- 您的工作涵蓋多個儲存庫 — 一項功能可能涉及 API server、Web app 和一個共用函式庫。那麼，這份計畫應該存在於哪個 `openspec/` 資料夾中？
- 您的團隊在程式碼不存在之前就進行規劃，或者規劃了那些永遠不會成為 *這個* 儲存庫程式碼的部分。
- 需求由一個團隊負責，但被其他團隊使用。Wiki 版本會漂移（drift），而您的編碼代理 (coding agent) 無法讀取它。

**store** 就是答案：這是一個獨立的儲存庫，其唯一職責就是規劃。它具有您已經熟悉的 `openspec/` 格式——規格和變更內容——外加一個小的身份檔案。您只需在機器上用名稱註冊一次，之後任何標準的 OpenSpec 命令都可以在任何地方對其執行。

## The shape

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

兩條規則保持其簡潔：

1. **儲存庫 (store) 本質上就是一個 git 倉庫。** 你自己進行提交、推送、拉取和審查。OpenSpec 從未自行克隆、同步或推送任何內容。
2. **是宣告，而非機制。** 倉庫可以*宣告*它們與儲存庫的關係（如下所示）。這些宣告改變了 OpenSpec 能告訴你的事情——但絕不會改變你的指令實際作用的位置。

## 五分鐘達到第一個儲存庫

兩個指令能讓你從零開始，建立一個可運作、以儲存庫為範圍的變更：

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

這就是整個模型。從這裡開始，其生命週期與你所知的一切完全一致——使用 `--store team-plans` 參數在每個指令上執行 `status`、`instructions`、`validate`、`archive` 等操作，而每一個輸出的提示都承載著這個標記。`Using OpenSpec root:` 這行文字總是會告訴你某個指令正在作用於何處。

## 故事：一個團隊，一個規劃倉庫 (planning repo)

一個團隊將其規格和變更保存在 `team-plans` 中，而不是分散在各個程式碼倉庫中。

**第一天（誰來設定）：**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

傳入 `--remote` 會在初始提交中記錄克隆 URL 到儲存庫自身的身份檔案 (`.openspec-store/store.yaml`) 中。每一次未來的克隆都將知道它來自何處，因此健康檢查和錯誤訊息可以印出一個完整、可複製的修復方案給那些尚未擁有此倉庫的隊友。

**每個隊友（每台機器一次）：**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

從那時起，每個人都以名稱在同一個規劃倉庫中工作：

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**分享工作就是 Git，這是故意的。** 你創建的變更只存在於你的本地檢查點 (checkout) 中，直到你提交並推送它——這與程式碼一樣。規劃也獲得了分支、拉取請求和審查功能，因為儲存庫是一個普通的倉庫。

**連接團隊的程式碼倉庫。** 一個其規劃完全外部化的程式碼倉庫，只需要在 `openspec/config.yaml` 中有一行：

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

現在，任何在 `web-app` 內執行的 OpenSpec 指令都作用於 `team-plans`，完全不需要額外的參數：

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

這個指標是一個備用選項，絕非覆蓋：顯式的 `--store` 永遠優先，如果倉庫本身發展出真正的規劃資料夾，那麼那些資料夾就會優先（並會發出警告，要求移除過時的指標）。

## 故事：跨團隊界線的需求

一個平台團隊擁有這些需求。產品團隊在自己的倉庫中、使用自己的設計來依賴它們。引用 (reference) 描述了這種關係，而無需移動任何人的工作。

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          │          └──────────────────────────┘
   └──────────────────────────┘
```

**產品團隊在其倉庫的 `openspec/config.yaml` 中宣告它所依賴的內容：**

```yaml
references:
  - platform-reqs
```

引用是唯讀的上下文。該倉庫保留自己的 `openspec/` 根目錄；工作仍然存在於此處。改變的是：該倉庫中的 `openspec instructions` 現在包含一個對所引用儲存庫規格的索引——每個都有一個單行摘要和確切的獲取指令 (`openspec show <spec-id> --type spec --store platform-reqs`)。在 `api-server` 中工作的代理 (agent) 可以找到上游的支付需求，引用它們，並在其自己的根目錄中撰寫低層設計——而無需任何人複製貼上上下文。

一個引用可以攜帶其克隆來源，因此那些尚未擁有該儲存庫的隊友會得到完整的修復方案，而不是一條死胡同：

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**當你希望規劃和程式碼同時開放時，請建立一個工作集 (workset)。** 這是個人化且明確的：每個人選擇他們實際在機器上操作哪些資料夾。那些本地檢查點路徑與共享規劃倉庫無關。

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## 你可以永遠問的兩個問題

**「我的設定是否健康？」** — `openspec doctor` 會檢查當前的根目錄及其所引用的儲存庫，以唯讀方式進行，並針對每個發現提供一個可複製的修復方案：

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**「我正在處理什麼？」** — `openspec context` 會從 OpenSpec 宣告中組裝工作集：即根目錄和它所引用的儲存庫。

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

兩者都支援 `--json` 參數供代理使用。`openspec context --code-workspace <path>` 還會寫入一個包含整個集合的 VS Code 工作區檔案——這是該指令唯一執行的操作。

## 工作集 (Worksets)：重新開啟你一起工作的資料夾

這與上述所有內容不同：大多數人會在每次工作時同時打開少數幾個資料夾——即規劃倉庫加上兩到三個程式碼倉庫。一個**工作集 (workset)** 是對此情況的個人化、命名視圖，可以使用選擇的工具執行單一指令來重新開啟它。

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

接著執行 `openspec workset open platform`，它就會啟動儲存的工具：編輯器（VS Code, Cursor）會以一個視窗同時開啟所有成員並返回。第一個成員是主體 (primary)。你可以隨時使用 `--tool <id>` 覆蓋該工具。

工作集被刻意設計為*非共享狀態*。它們存在於你的機器上，絕不會被提交，也不對工作內容做出任何聲明——它們只記錄你喜歡同時開啟哪些東西。移除一個成員永遠不會觸及其他成員的資料夾。新的工具是配置，而非程式碼：任何通過工作區檔案或按資料夾附加標記啟動的東西都可以添加到全局配置 (`openspec config edit`) 中的 `openers` 鍵下。

## 指令如何決定作用位置

每個正常的指令都以相同的方式解析其根目錄，順序如下：

```
1. --store <id>          你明確指定了 → 那個儲存庫
2. nearest openspec/     這裡有一個真正的規劃根目錄 (walking up from cwd) → 這個倉庫
3. store: pointer        config.yaml 宣告了一個儲存庫  → 那個儲存庫
4. none of the above     這台機器上有註冊儲存庫嗎？   → 與選擇提示一起出錯
                         沒有任何儲存庫嗎？         → 當前的目錄 (經典行為)
```

`Using OpenSpec root:` 這行文字（以及 `--json` 輸出中的 `root` 區塊）會告訴你處於哪一種情況。

## 已知的限制

- **Beta 形態。** 本頁上的所有內容都可能在發布之間發生變化——包括名稱、標記、檔案格式和 JSON 鍵。
- **每個儲存庫 ID 對應一台機器一個檢查點 (checkout)。** 如果嘗試使用相同的 ID 註冊第二個檢查點，將會失敗並提供 `store unregister` 的提示。
- **從不同步，這是設計要求。** OpenSpec 從未克隆、拉取或推送。一個過時的檢查點會顯示過時的規格，直到*你*進行拉取；引用是從磁碟上現有的內容即時索引的。
- **某些指令保持原樣。** `view`、`templates`、`schemas` 以及已棄用的名詞形式（如 `openspec change show` 等）只作用於當前目錄——不帶 `--store` 參數。
- **每台機器狀態是本地化的。** 儲存庫註冊表和工作集是本地設定。你的機器佈局情況絕不會被提交到共享規劃中。
- **兩種工作集啟動方式。** 無法使用工作區檔案或按資料夾附加標記來啟動的工具，就不能作為開箱器 (opener) 被添加。
- **代理 JSON 有已知的命名規範劃分** (store-family 鍵為 snake_case，workflow-family 為 camelCase)。這在 [agent contract](../agent-contract.md) 中有文件說明；統一它將延遲到版本發布。

## 事物的存放位置

| 項目 | 存放位置 | 是否共享？ |
|---|---|---|
| 儲存庫的規劃內容 | `<store>/openspec/` (specs, changes) | 是 — 提交並推送 |
| 儲存庫的身份資訊 | `<store>/.openspec-store/store.yaml` | 是 — 與儲存庫一起提交 |
| 儲存庫註冊表 | `<data dir>/openspec/stores/registry.yaml` | 否 — 僅限於這台機器 |
| 工作集 (Worksets) | `<data dir>/openspec/worksets/` | 否 — 僅限於這台機器 |

`<data dir>` 在 macOS 和 Linux 上是 `~/.local/share/openspec`（或設定了 `$XDG_DATA_HOME/openspec`），在 Windows 上是 `%LOCALAPPDATA%\openspec`。
## Reference

本頁上每個指令的確切標記和 JSON 形態：
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) 和 [agent contract](../agent-contract.md)。