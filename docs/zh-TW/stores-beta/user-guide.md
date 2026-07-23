# Stores：在專屬儲存庫中進行規劃

> **Beta.** Stores、references、working context 與 worksets 均為新功能。指令名稱、旗標、檔案格式與 JSON 輸出在版本之間仍可能有所調整。下方所有操作步驟皆以目前建置版本執行，但升級後請重新閱讀本指南。

## 本功能解決的問題

OpenSpec 通常會放在單一程式碼儲存庫內：在程式碼旁的 `openspec/` 資料夾，存放該儲存庫的規格文件與變更記錄。

當你的規劃範圍超過單一儲存庫時，這種方式便不再適用：

- 你的工作橫跨多個儲存庫：單一功能可能涉及 API 伺服器、網頁應用程式與共用函式庫。這時規劃要放在哪個儲存庫的 `openspec/` 資料夾？
- 你的團隊可能在程式碼尚未存在時就進行規劃，或是規劃的內容永遠不會成為此儲存庫的程式碼。
- 需求文件由一個團隊維護、其他團隊使用。Wiki 版本容易出現偏差，而且你的編碼代理也無法讀取。

**store** 就是解決方案：這是一個獨立的儲存庫，唯一用途就是進行規劃。它具備你已經熟悉的 `openspec/` 結構——包含規格文件與變更記錄——另外還有一個小型身份識別檔案。你只需在機器上依名稱註冊一次這個 store，之後所有標準 OpenSpec 指令都可以從任何位置對其執行操作。

```
            team-plans  （儲存庫：在自身倉庫中進行規劃）
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      永恆成立的內容
                └── changes/   進行中的內容
                      ▲
                      │ 依名稱在每台機器上註冊；
                      │ 可像普通倉庫一樣透過推送/克隆共享
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   （程式碼倉庫） （程式碼倉庫）  （程式碼倉庫）
```

兩條規則讓一切保持簡單：

1. **儲存庫就是一個 Git 倉庫**。你可以自行提交、推送、拉取、審查它。OpenSpec 永遠不會自行克隆、同步或推送任何內容。
2. **宣告優先，而非隱藏機制**。倉庫可以「宣告」它與儲存庫的關聯方式（如下文所示）。宣告只會改變 OpenSpec 能告訴你的內容——永遠不會改變你的指令作用的位置。

## 五分鐘建立你的第一個儲存庫

兩條指令即可從零開始建立可正常運作的、作用於指定儲存庫的變更：

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

這就是完整的模型。後續的生命週期與你熟悉的完全一致——`status`、`instructions`、`validate`、`archive`——只需在每個指令後加上 `--store team-plans`，所有輸出的提示都會自動攜帶這個標誌。`Using OpenSpec root:` 這行永遠會告訴你當前指令的作用位置。

## 案例：一個團隊，一份規劃倉庫

一個團隊將其規格與變更集中在 `team-plans` 中，而非分散在各程式碼倉庫中。

**第一天（由負責設定的成員執行）：**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

傳入 `--remote` 會將克隆 URL 記錄在儲存庫自身的身份檔案（`.openspec-store/store.yaml`）中，並納入初始提交。後續所有克隆都會自動繼承來源資訊，因此健康檢查與錯誤訊息可以為尚未取得此儲存庫的隊友提供可直接複製的修復方案。

**所有隊友（每台機器執行一次即可）：**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

此後所有人均可透過名稱使用同一份規劃倉庫：

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**刻意以 Git 作為共享工作流**。你建立的變更只會存在你的本地工作目錄中，直到你提交並推送它——與程式碼的邏輯完全一致。規劃內容可以免費獲得分支、拉取請求與審查流程，因為儲存庫就是一個普通的 Git 倉庫。

**連結團隊的程式碼倉庫**。若某個程式碼倉庫的規劃內容完全外部化，只需在 `openspec/config.yaml` 中加入一行：

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

現在在 `web-app` 內執行的所有 OpenSpec 指令都會自動作用於 `team-plans`，無需任何標誌：

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

此指向是備用方案，永遠不會覆蓋顯式設定：若明確指定 `--store`，則該設定永遠優先；若該倉庫後續新增了自己的規劃資料夾，則本地規劃資料夾優先（同時會彈出警告，提示你移除過時的指向）。

**為你機器上的所有倉庫設定單一預設值**。若你需要在多個程式碼倉庫中使用同一個儲存庫進行規劃，只需全域設定一次，無需為每個倉庫加入 `store:` 指向：

```bash
openspec config set defaultStore team-plans
```

現在，在任何非規劃根目錄的位置執行的指令，只要沒有指定 `--store` 也無專案指向，都會自動解析到 `team-plans`。它位於優先順序列表的最底層，因此 `--store`、本地根目錄、專案 `store:` 指向的優先級都高於它。根目錄橫幅與 JSON 輸出的 `root` 區塊會標註 `source: "global_default"` 與儲存庫 ID，讓你可以隨時區分機器全域預設與專案自身的指向。透過 `openspec config unset defaultStore` 即可清除。若指定的 ID 未註冊，指令會報錯並提示你註冊該儲存庫或清除過時的預設值。

## 案例：跨團隊的需求管理

平台團隊擁有需求，產品團隊在各自的倉庫中基於這些需求進行開發，並產出自己的設計。參考（reference）機制可以在不移動任何工作內容的前提下描述這種關聯。

```
   platform-reqs (store)                 api-server (code repo)
   由平台團隊擁有                       由產品團隊擁有
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ 讀取     │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   （自身的設計）         │
   │   平台相關工作            │          │ openspec/changes/        │
   │                          │          │   （自身的工作）         │
   └──────────────────────────┘          └──────────────────────────┘
```

**產品團隊在其倉庫的 `openspec/config.yaml` 中宣告其依賴的內容**：

```yaml
references:
  - platform-reqs
```

參考是唯讀上下文。該倉庫保留自己的 `openspec/` 根目錄，工作內容也留在本地。變化在於：該倉庫執行 `openspec instructions` 時，現在會包含參考儲存庫的規格索引——每個規格都有一行摘要，以及對應的獲取指令（`openspec show <spec-id> --type spec --store platform-reqs`）。在 `api-server` 中工作的代理可以找到上遊的支付需求、引用它們，並在倉庫自身的根目錄中撰寫自己的低階設計——無需任何人複製貼上上下文。

參考可以攜帶克隆來源，因此尚未取得該儲存庫的隊友會收到完整的修復方案，而非無效提示：

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**若你需要同時開啟規劃與程式碼倉庫，可以建立一個工作集（workset）**。這是個人化且明確的設定：每個人可以選擇自己機器上實際使用的資料夾。這些本地克隆路徑不會被提交到共享的規劃倉庫中：

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## 你可以隨時提出的兩個問題

**「我的設定是否健康？」**——執行 `openspec doctor` 會以唯讀方式檢查當前根目錄及其參考的儲存庫，每個發現的問題都會附上可直接複製的修復方案：

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

**「我當前的工作環境包含哪些內容？」**——執行 `openspec context` 會根據 OpenSpec 的宣告彙總工作集：包含根目錄及其參考的所有儲存庫。

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

兩個指令都支援 `--json` 參數以供代理使用。`openspec context --code-workspace <path>` 還會額外寫入一個包含所有成員的 VS Code 工作區檔案——這是該指令唯一會執行的寫入操作。

## 工作集：一鍵重新開啟你協作使用的所有資料夾

與上述功能獨立：大多數人每次工作時都會同時開啟相同的幾個資料夾——規劃倉庫加上兩三個程式碼倉庫。**工作集（workset）** 就是對這些資料夾的個人化、具名視圖，只需執行一條指令即可在你選擇的工具中重新開啟所有成員資料夾。

```
  工作集「platform」                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       三個資料夾全部在你的工具中開啟
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  （在 VS Code 中開啟）
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

執行 `openspec workset open platform` 後會啟動已儲存的工具：編輯器（VS Code、Cursor）會開啟一個包含所有成員資料夾的視窗並返回。第一個成員是主視窗。隨時可以透過 `--tool <id>` 覆寫工具設定。

工作集刻意設計為非共享狀態。它們儲存在你的本地機器上，永遠不會被提交，也不會對工作內容做任何斷言——只會記錄你偏好同時開啟的資料夾組合。刪除工作集永遠不會影響成員資料夾。新工具的配置屬於設定而非程式碼：任何可透過工作區檔案或資料夾附加標誌啟動的工具，都可以在全局配置的 `openers` 鍵下新增（透過 `openspec config edit` 編輯）。

## 指令如何決定作用位置

所有常規指令都按照以下優先順序解析作用根目錄：

```
1. --store <id>          你明確指定的儲存庫        → 作用於該儲存庫
2. 最近的 openspec/      當前位置存在真實的規劃根目錄 → 作用於該倉庫
   （從當前工作目錄向上遍歷查找）
3. store: 指向            config.yaml 中宣告了儲存庫  → 作用於該儲存庫
4. defaultStore          全局配置設定了機器級預設值  → 作用於該儲存庫
5. 以上皆不滿足           此機器已註冊儲存庫？        → 報錯並提示選擇
                         無已註冊儲存庫？            → 作用於當前目錄
                                                     （傳統行為）
```

`Using OpenSpec root:` 這行（以及 `--json` 輸出的 `root` 區塊）會告訴你當前屬於哪種情況。

## 已知限制

- **Beta 版本形態**。本頁的所有內容在版本迭代間都可能發生變化——包括名稱、標誌、檔案格式、JSON 鍵值等。
- **每台機器每個儲存庫 ID 僅允許一個克隆**。若嘗試用相同 ID 註冊第二個克隆，會報錯並提示你先執行 `store unregister`。
- **永遠不會同步——這是刻意設計**。OpenSpec 永遠不會自動克隆、拉取或推送。過時的克隆會顯示過時的規格，直到你手動拉取；參考內容會根據磁碟上的當前內容即時索引。
- **空的規劃資料夾可以不存在**。新儲存庫的 Git 倉庫中可能尚未包含 `openspec/changes/`、`openspec/specs/` 或 `openspec/changes/archive/`。Beta 版本接受這種情況，這些資料夾會在常規指令建立對應檔案後自動出現。
- **指向型倉庫保持指向狀態**。若某個僅含配置的倉庫在其 `openspec/config.yaml` 中宣告了 `store: <id>`，則它會被視為外部化規劃倉庫，而非需要註冊的本地儲存庫根目錄。若你確實想將該倉庫轉換為本地儲存庫根目錄，請先移除 `store:` 這一行。
- **部分指令的作用位置保持不變**。`view`、`templates`、`schemas` 以及已棄用的名詞形式指令（如 `openspec change show` 等）只作用於當前目錄——不支援 `--store` 參數。
- **每台機器的狀態僅對應該機器**。儲存庫註冊表與工作集都是本地設定。你機器上的任何布局資訊永遠不會被提交到共享的規劃倉庫中。
- **工作集有兩種啟動方式**。無法透過工作區檔案或資料夾附加標誌啟動的工具，無法新增為工作集啟動器。
- **代理 JSON 存在已知的大小寫分裂問題**（儲存庫相關鍵值為 snake_case，工作流相關鍵值為 camelCase）。相關說明見[代理契約](../agent-contract.md)；統一處理已推遲到版本化發佈時再實現。

## 各項目存放位置

| 項目 | 存放位置 | 是否共享？ |
|---|---|---|
| 商店的規劃文件 | `<store>/openspec/`（規格、變更） | 是 — 需提交並推送至遠端 |
| 商店的身份配置 | `<store>/.openspec-store/store.yaml` | 是 — 隨商店一併提交 |
| 商店註冊表 | `<data dir>/openspec/stores/registry.yaml` | 否 — 僅存在本機 |
| 工作集 | `<data dir>/openspec/worksets/` | 否 — 僅存在本機 |

`<data dir>` 在 macOS 與 Linux 上為 `~/.local/share/openspec`（若已設定 `$XDG_DATA_HOME` 則為 `$XDG_DATA_HOME/openspec`），在 Windows 上則為 `%LOCALAPPDATA%\openspec`。

## 參考資料

本頁所有命令的完整參數與 JSON 格式說明：[CLI 參考文件](../cli.md)（商店、診斷、工作上下文、個人工作集）與 [代理程式合約](../agent-contract.md)。