# CLI 參考

OpenSpec CLI (`openspec`) 提供用於專案設定、驗證、狀態檢查和管理的終端機命令。這些命令與 [Commands](commands.md) 文件中記載的 AI 斜線命令（如 `/opsx:propose`）互補。

## 摘要

| 類別 | 命令 | 用途 |
|----------|----------|---------|
| **設定** | `init`, `update` | 在您的專案中初始化及更新 OpenSpec |
| **儲存庫（獨立 OpenSpec 儲存庫）** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | 管理儲存庫 — 您已註冊的獨立 OpenSpec 儲存庫 |
| **健康狀態** | `doctor` | 回報已解析根目錄的關聯健康狀態 |
| **工作上下文** | `context` | 組合工作集（根目錄 + 參照的儲存庫） |
| **個人工作集** | `workset create`, `workset list`, `workset open`, `workset remove` | 在您的工具中保留並開啟個人本機工作檢視 |
| **瀏覽** | `list`, `view`, `show` | 瀏覽變更和規格 |
| **驗證** | `validate` | 檢查變更和規格是否有問題 |
| **生命週期** | `archive` | 完成已結束的變更 |
| **工作流程** | `new change`, `status`, `instructions`, `templates`, `schemas` | 產物驅動的工作流程支援 |
| **結構描述** | `schema init`, `schema fork`, `schema validate`, `schema which` | 建立及管理自訂工作流程 |
| **設定** | `config` | 檢視及修改設定 |
| **工具** | `feedback`, `completion` | 意見回饋和 Shell 整合 |

## 人類與 AI 代理使用指令

大多數 CLI 指令是為終端機的**人類使用**場景設計的。部分指令也支援透過 JSON 輸出供 **AI 代理/腳本使用**。

### 僅供人類使用的指令

這些指令為互動式設計，用於終端機操作：

| 指令 | 用途 |
|---------|---------|
| `openspec init` | 初始化專案（互動式提示） |
| `openspec view` | 互動式儀表板 |
| `openspec workset open <name>` | 開啟已儲存的工作集（編輯器視窗或終端機 AI 代理工作階段） |
| `openspec config edit` | 在編輯器中開啟設定檔 |
| `openspec feedback` | 透過 GitHub 提交意見回饋 |
| `openspec completion install` | 安裝 shell 自動補全 |

### 相容 AI 代理的指令

這些指令支援 `--json` 輸出，可供 AI 代理與腳本進行程式化使用：

| 指令 | 人類使用場景 | AI 代理使用場景 |
|---------|-----------|-----------|
| `openspec list` | 瀏覽變更/規格文件 | 使用 `--json` 取得結構化資料 |
| `openspec show <item>` | 讀取內容 | 使用 `--json` 便於解析 |
| `openspec validate` | 檢查問題 | 使用 `--all --json` 進行批量驗證 |
| `openspec status` | 查看產物進度 | 使用 `--json` 取得結構化狀態 |
| `openspec instructions` | 取得後續步驟 | 使用 `--json` 取得 AI 代理指令 |
| `openspec templates` | 尋找範本路徑 | 使用 `--json` 進行路徑解析 |
| `openspec schemas` | 列出可用結構描述 | 使用 `--json` 探索結構描述 |
| `openspec store setup <id>` | 建立並註冊本機儲存庫 | 搭配明確輸入使用 `--json` 取得結構化設定輸出 |
| `openspec store register <path>` | 註冊既有儲存庫 | 使用 `--json` 取得結構化註冊輸出 |
| `openspec store unregister <id>` | 撤銷本機儲存庫註冊 | 使用 `--json` 取得結構化清理輸出 |
| `openspec store remove <id>` | 刪除已註冊的本機儲存庫資料夾 | 搭配 `--yes --json` 進行非互動式刪除 |
| `openspec store list` | 瀏覽已註冊的儲存庫 | 使用 `--json` 取得結構化註冊列表 |
| `openspec store doctor` | 檢查本機儲存庫設定 | 使用 `--json` 取得結構化診斷資訊 |
| `openspec new change <id>` | 建立儲存庫內部的變更脚手架 | 使用 `--json`，並可搭配 `--store <id>` 將已註冊的儲存庫作為 OpenSpec 根目錄 |
| `openspec workset create [name]` | 組合個人工作視圖 | 搭配 `--member <path> --json` 進行非互動式組合 |
| `openspec workset list` | 瀏覽已儲存的工作集 | 使用 `--json` 取得結構化視圖 |
| `openspec workset remove <name>` | 刪除已儲存的視圖 | 搭配 `--yes --json` 進行非互動式移除 |

---

## 全域選項

這些選項適用於所有指令：

| 選項 | 說明 |
|--------|-------------|
| `--version`, `-V` | 顯示版本號 |
| `--no-color` | 停用色彩輸出 |
| `--help`, `-h` | 顯示指令說明 |

---

## 設定指令

### `openspec init`

在您的專案中初始化 OpenSpec。會建立資料夾結構並設定 AI 工具整合。

預設行為會使用全域設定預設值：設定檔 `core`、交付方式 `both`、工作流程 `propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**參數：**

| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `path` | 否 | 目標目錄（預設：當前目錄） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--tools <list>` | 以非互動方式設定 AI 工具。可使用 `all`、`none` 或逗號分隔的列表 |
| `--force` | 自動清理舊版檔案，無需提示 |
| `--profile <profile>` | 覆蓋本次初始化執行的全域設定檔（`core` 或 `custom`） |

使用 `--profile custom` 時，會套用全域設定中當前選取的所有工作流程（可透過 `openspec config profile` 查詢）。

**支援的工具 ID（`--tools` 參數）：** `amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`codeartsagent`、`codex`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`hermes`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`vibe`、`oh-my-pi`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`trae`、`windsurf`、`zcode`

> 此列表與 `src/core/config.ts` 中的 `AI_TOOLS` 保持一致。各工具的技能與指令路徑詳見[支援的工具](supported-tools.md)。

**範例：**

```bash
# 互動式初始化
openspec init

# 在特定目錄中初始化
openspec init ./my-project

# 非互動式：為 Claude 和 Cursor 進行設定
openspec init --tools claude,cursor

# 為所有支援的工具進行設定
openspec init --tools all

# 覆蓋本次執行的設定檔
openspec init --profile core

# 跳過提示並自動清理舊版檔案
openspec init --force
```

**建立內容：**

```
openspec/
├── specs/              # 您的規格文件（唯一可信來源）
├── changes/            # 提出的變更
└── config.yaml         # 專案設定檔

.claude/skills/         # Claude Code 技能（若選取 claude 則建立）
.cursor/skills/         # Cursor 技能（若選取 cursor 則建立）
.cursor/commands/       # Cursor OPSX 指令（若交付方式包含指令則建立）
...（其他工具設定檔）
```

---

### `openspec update`

升級 CLI 後更新 OpenSpec 指令檔案。會使用您當前的全域設定檔、選取的工作流程以及交付模式，重新產生 AI 工具設定檔。

```
openspec update [path] [options]
```

**參數：**

| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `path` | 否 | 目標目錄（預設：當前目錄） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--force` | 即使檔案已為最新版本，仍強制更新 |

**範例：**

```bash
# npm 升級後更新指令檔案
npm update @fission-ai/openspec
openspec update
```

---

## 儲存庫（獨立 OpenSpec 儲存庫）

> **Beta 版。** 儲存庫及其建構於其上的功能（引用、工作上下文、工作集）均為新功能；指令名稱、旗標、檔案格式與 JSON 輸出在不同版本間可能有所調整。若要查看以問題為導向的操作指南，請參閱[儲存庫指南](stores-beta/user-guide.md)。

儲存庫是您在本機註冊的獨立 OpenSpec 儲存庫，例如規劃儲存庫或合約儲存庫。註冊儲存庫後，即可從任何位置透過傳入 `--store <id>` 參數，讓一般指令（`list`、`show`、`status`、`validate`、`new change`、`archive` 等）對其執行操作。

### `openspec store setup`

建立並註冊本機儲存庫。在終端機中不帶參數執行時，OpenSpec 會引導使用者完成設定流程。AI 代理與腳本應傳入明確的輸入值並使用 `--json` 參數。

```bash
openspec store setup [id] [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--path <path>` | 儲存庫所在的資料夾（例如 `~/openspec/<id>`） |
| `--remote <url>` | 將權威遠端儲存庫位址記錄到新儲存庫的 `store.yaml` 中 |
| `--init-git` | 初始化 Git 儲存庫並建立初始提交（預設行為） |
| `--no-init-git` | 跳過所有 Git 操作：不初始化、不建立初始提交 |
| `--json` | 輸出 JSON 格式 |

非互動式執行（使用 `--json`、腳本、AI 代理）時，必須同時傳入儲存庫 ID 與 `--path` 參數。在互動式終端機中執行時，設定流程會提示輸入位置，並提供位於使用者可見、擁有權歸使用者的位置的可編輯建議（例如 `~/openspec/<id>`）；絕不會預設使用 OpenSpec 的受管理資料目錄。

範例：

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

註冊既有的本機儲存庫資料夾。在儲存庫 Beta 測試期間，可在尚未有任何變更、規格文件尚未套用、或變更尚未歸檔前註冊根目錄；此時 `openspec/changes/`、`openspec/specs/` 與 `openspec/changes/archive/` 目錄可能不存在，直到一般指令將其建立為止。僅包含設定的儲存庫若宣告了 `store: <id>`，則仍屬於指向另一個儲存庫的指標，除非移除該指標，否則不會被註冊為儲存庫根目錄。

```bash
openspec store register [path] [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--id <id>` | 儲存庫 ID；預設為儲存庫中繼資料或資料夾名稱 |
| `--yes` | 確認為正常的 OpenSpec 根目錄建立儲存庫身份中繼資料 |
| `--json` | 輸出 JSON 格式 |

### `openspec store unregister`

撤銷本機儲存庫的註冊，同時保留檔案不刪除。

```bash
openspec store unregister <id> [--json]
```

當儲存庫被移動、複製到其他位置，或是不應再於本機的 OpenSpec 中顯示時，可使用此指令。

### `openspec store remove`

撤銷本機儲存庫的註冊，並刪除其本機資料夾。

```bash
openspec store remove <id> [--yes] [--json]
```

在互動式終端機中執行 `remove` 時，會在刪除前顯示確切的資料夾路徑。AI 代理、腳本與 JSON 調用者必須傳入 `--yes` 參數確認刪除。若資料夾不包含對應的儲存庫中繼資料，OpenSpec 會拒絕執行刪除操作。

### `openspec store list`

列出本機已註冊的儲存庫。

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

檢查本機儲存庫的註冊狀態、中繼資料與 Git 儲存庫是否存在。

```bash
openspec store doctor [id] [--json]
```

`doctor` 僅執行診斷操作；它會回報缺失的根目錄、中繼資料不符，以及無效的本機註冊表狀態，不會修改儲存庫內容。

### 從專案引用儲存庫

專案儲存庫可在 `openspec/config.yaml` 中宣告其工作所引用的儲存庫：

```yaml
schema: spec-driven
references:
  - team-context
```

此後，該儲存庫中的 `openspec instructions` 輸出（包含各產物版本與 `apply` 介面、JSON 格式與人類可讀模式）會攜帶每個引用儲存庫的規格文件索引——包含規格 ID、各規格 Purpose 章節的一行摘要，以及獲取指令（`openspec show <spec-id> --type spec --store <id>`）。該索引會在每次執行時從已註冊的本地副本即時建立；規格內容永遠不會被複製到輸出中。

引用為唯讀上下文。它們永遠不會改變指令的執行位置：工作始終在儲存庫自身的根目錄下進行，而對引用儲存庫的寫入操作仍需明確傳入 `--store` 參數。若無法解析某個引用（例如本機未註冊對應的儲存庫），索引中會將其降級為警告並提供確切的修復方式，且指令仍會正常生成。`openspec doctor` 會統一回報所有引用的健康狀態。

### 記錄儲存庫的克隆來源

儲存庫可將其權威克隆來源記錄到已提交的身份檔案中，從而使新手入門流程不會卡在「註冊儲存庫」步驟：

```bash
# 將 team-context 儲存庫克隆到本機並記錄其遠端來源
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

該遠端位址會儲存在初始提交中的 `.openspec-store/store.yaml` 內，因此每個克隆出來的儲存庫都會自帶此資訊。對於既有儲存庫，可手動編輯 `store.yaml` 並提交。`store doctor` 會顯示已記錄的遠端位址（以及本地副本觀測到的 Git 來源）；設定/註冊共享指南會標註該位址；而註冊操作會將本地副本的來源記錄到本機註冊表中。

引用宣告也可包含克隆來源，因此尚未擁有該儲存庫的團隊成員可獲得完整的、可直接貼上執行的修復指令（`git clone <remote> <path> && openspec store register <path> --id <id>`）：

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

記錄遠端位址不屬於同步操作：OpenSpec 永遠不會自動執行克隆、提取或推送操作。

### 宣告預設儲存庫

若一個儲存庫的規劃工作完全外部化（本機無 `openspec/specs/` 或 `openspec/changes/` 目錄），可一次性宣告其對應的儲存庫，而無需在每次執行指令時都傳入 `--store` 參數：

```yaml
# openspec/config.yaml（openspec/ 目錄下唯一的檔案）
store: team-context
```

此後，一般指令會自動解析到宣告的儲存庫；根目錄橫幅與 JSON `root` 區塊會回傳 `source: "declared"` 及對應的儲存庫 ID，且輸出的提示仍會包含 `--store <id>`。此宣告屬於後備方案，永遠不會覆蓋其他設定：明確傳入的 `--store` 參數始終優先，且包含實際規劃資料夾的目錄會忽略該指向（並發出警告）。若要將指標型儲存庫轉換為本機 OpenSpec 根目錄，請移除 `store:` 這行，然後執行 `openspec init`——若宣告存在，init 會拒絕建立脚手架。

機器層級的變體可一次性套用到所有儲存庫：`openspec config set defaultStore <id>`（詳見設定章節）。該設定僅在 `--store` 參數、本機根目錄、專案指標均無法解析時才會生效；此時根目錄橫幅與 JSON `root` 區塊會回傳 `source: "global_default"`。

## Doctor（關係健康檢查）

單一唯讀查詢，單一位置：OpenSpec 根目錄是否健康，且其引用的所有 store 是否在此機器上可用？

```bash
openspec doctor [--store <id>] [--json]
```

報告會將結果分為三大類：根目錄健康狀態、store 中繼資料健康狀態（包含當記錄的遠端與簽出來源不一致時的提示，以及當 store 的簽出內容落後於上次抓取的上游追蹤引用時的提示），以及引用健康狀態（顯示與診斷指令相同的修復說明，包含未解析引用的克隆修復方案）。任何嚴重程度的健康檢查結果都不會觸發非零退出碼——代理程式（agent）會讀取 `status` 陣列獲取結果；僅當指令執行失敗（例如找不到根目錄、未知的 store）時才會返回退出碼 1。Doctor 指令永遠不會自動執行克隆、同步或修復操作。若要取得已組裝的集合本身而非其健康狀態，請使用 `openspec context`。

## 工作上下文（已組裝的集合）

所有透過 OpenSpec 宣告與此工作相關的內容，都會整合進單一工作集合中：包含 OpenSpec 根目錄以及其引用的所有 store。

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

輸出的 JSON 摘要可供代理程式（agent）直接使用（每個可用的引用 store 都會附帶其對應的抓取配方；未解析的成員則會附帶與 doctor 指令相同的修復說明）。加上 `--code-workspace` 參數時，指令還會寫入一個 VS Code 工作區檔案，內容包含根目錄以及所有可用的引用 store（以 `ref:<id>` 資料夾的形式）——這是該指令唯一會執行的寫入操作，若檔案已存在且未加上 `--force` 參數則會拒絕執行。對於不可用的成員只會回報狀態，不會進行任何猜測。

「工作上下文」指的是已組裝的集合；而 `openspec/config.yaml` 中的 `context:` 欄位則是注入到指令中的專案背景資訊——兩者是完全不同的概念。`openspec doctor` 用於查詢集合是否健康；`openspec context` 用於查詢集合的具體組成內容。

## 個人工作集

> **Beta 版。** 工作集屬於新的 Beta 版功能；指令、旗標與檔案格式在不同版本間可能有所調整。操作步驟請參閱 [stores 指南](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together)。

工作集是您協作處理的資料夾的個人命名檢視——包含一個規劃根目錄，以及您自行選擇的其他資料夾——儲存在您的本機上，可透過名稱在工具中重新開啟。它完全是本機端功能：永遠不會被提交、不會被分享、不會從宣告衍生而來，移除工作集也永遠不會影響到成員資料夾。

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` 會執行簡短的引導流程（或是在非互動模式下使用 `--member` 旗標；第一個成員是主要成員——工作階段會從此處啟動）。`open` 會啟動選擇的工具：編輯器（VS Code、Cursor）會開啟包含所有成員的視窗並返回；CLI 代理程式（Claude Code、codex）會接管這個終端作為工作階段，附加所有成員且無預先填入的提示，直到您退出為止。開啟時若成員資料夾不存在，會跳過並附上提示；其餘資料夾仍會正常開啟。已儲存的工具偏好可在每次開啟時透過 `--tool` 旗標覆蓋。

支援新工具只需要進行設定，無需修改程式碼。每個工具都屬於兩種啟動樣式之一——`workspace-file`（使用生成的 `.code-workspace` 檔案啟動）或 `attach-dirs`（每個成員對應一個附加旗標）——全域 `config.json` 中的 `openers` 鍵（可使用 `openspec config edit` 開啟）可新增工具或依欄位調整內建工具：

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

所有工作集狀態都儲存在全域資料目錄下的 `worksets/` 資料夾中（包含已儲存的檢視，以及每次開啟時重新生成的 `<name>.code-workspace` 檔案）；刪除該資料夾會移除所有相關痕跡。

---

## 瀏覽指令

### `openspec list`

列出專案中的變更或規格。

```
openspec list [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--specs` | 列出規格而非變更 |
| `--changes` | 列出變更（預設） |
| `--sort <order>` | 依 `recent`（預設）或 `name` 排序 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**輸出（文字格式）：**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

顯示用於瀏覽規格與變更的互動式儀表板。

```
openspec view
```

開啟終端機介面，供您瀏覽專案的規格與變更。

---

### `openspec show`

顯示變更或規格的詳細資訊。

```
openspec show [item-name] [options]
```

**參數：**

| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `item-name` | 否 | 變更或規格的名稱（省略時會提示輸入） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--type <type>` | 指定類型：`change` 或 `spec`（若無歧義則自動偵測） |
| `--json` | 以 JSON 格式輸出 |
| `--no-interactive` | 停用提示 |

**變更專屬選項：**

| 選項 | 說明 |
|--------|-------------|
| `--deltas-only` | 僅顯示差異規格（JSON 模式） |

**規格專屬選項：**

| 選項 | 說明 |
|--------|-------------|
| `--requirements` | 僅顯示需求，排除場景（JSON 模式） |
| `--no-scenarios` | 排除場景內容（JSON 模式） |
| `-r, --requirement <id>` | 依 1 為起始的索引顯示特定需求（JSON 模式） |

**範例：**

```bash
# Interactive selection
openspec show

# Show a specific change
openspec show add-dark-mode

# Show a specific spec
openspec show auth --type spec

# JSON output for parsing
openspec show add-dark-mode --json
```

---

## 驗證指令

### `openspec validate`

驗證變更與規格的結構問題。

```
openspec validate [item-name] [options]
```

若變更沒有規格差異，驗證將會失敗，除非其 `.openspec.yaml` 宣告了 `skip_specs: true`（適用於純重構、工具或文件相關工作——請參閱 [範例 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)）。

**參數：**

| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `item-name` | 否 | 要驗證的特定項目（省略時會提示輸入） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--all` | 驗證所有變更與規格 |
| `--changes` | 驗證所有變更 |
| `--specs` | 驗證所有規格 |
| `--type <type>` | 當名稱有歧義時指定類型：`change` 或 `spec` |
| `--strict` | 啟用嚴格驗證模式 |
| `--json` | 以 JSON 格式輸出 |
| `--concurrency <n>` | 最大並行驗證數（預設：6，或使用 `OPENSPEC_CONCURRENCY` 環境變數） |
| `--no-interactive` | 停用提示 |

**範例：**

```bash
# Interactive validation
openspec validate

# Validate a specific change
openspec validate add-dark-mode

# Validate all changes
openspec validate --changes

# Validate everything with JSON output (for CI/scripts)
openspec validate --all --json

# Strict validation with increased parallelism
openspec validate --all --strict --concurrency 12
```

**輸出（文字格式）：**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**輸出（JSON 格式）：**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## 生命週期指令

### `openspec archive`

封存已完成的變更，並將差異規格合併到主規格中。

```
openspec archive [change-name] [options]
```

**參數：**

| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-name` | 否 | 要封存的變更（省略時會提示輸入） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `-y, --yes` | 跳過確認提示 |
| `--skip-specs` | 跳過本次封存的規格更新。若變更永久沒有規格差異，應在其 `.openspec.yaml` 中宣告 `skip_specs: true`——如此一來封存時無需使用此旗標 |
| `--no-validate` | 跳過驗證（需要確認） |

**範例：**

```bash
# Interactive archive
openspec archive

# Archive specific change
openspec archive add-dark-mode

# Archive without prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
openspec archive update-ci-config --skip-specs
```

**執行內容：**

1. 驗證變更（除非使用 `--no-validate`）
2. 提示確認（除非使用 `--yes`）
3. 將差異規格合併到 `openspec/specs/`
4. 將變更資料夾移動到 `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## 工作流程指令

這些指令支援產物驅動的 OPSX 工作流程，無論是人員追蹤進度，還是代理程式判斷下一步操作，都非常實用。

### `openspec new change`

建立變更資料夾，以及在解析後的 OpenSpec 根目錄中選擇性加入已提交的中繼資料。

```bash
openspec new change <name> [options]
```

變更名稱必須使用小寫 kebab-case 格式。名稱需以英文小寫字母開頭，其後可包含小寫字母、數字與單個連字號。不得以數字開頭、包含空格、底線、大寫字母、連續連字號，或開頭/結尾的連字號。若需包含外部票證 ID，請在名稱前加上前綴，例如使用 `ticket-123-add-notifications` 而非 `123-add-notifications`。

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--description <text>` | 要新增至 `index.md` 的描述 |
| `--goal <text>` | 要與變更一起儲存的選用目標中繼資料 |
| `--schema <name>` | 要使用的工作流程 schema |
| `--store <id>` | 要作為 OpenSpec 根目錄使用的 store ID（store 是您已註冊的獨立 OpenSpec 存放庫） |
| `--json` | 輸出 JSON |

**範例：**

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

顯示變更的產物完成狀態。

```
openspec status [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--change <id>` | 變更名稱（省略時會提示輸入） |
| `--schema <name>` | Schema 覆蓋設定（會從變更的設定檔自動偵測） |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# Interactive status check
openspec status

# Status for specific change
openspec status --change add-dark-mode

# JSON for agent use
openspec status --change add-dark-mode --json
```

**輸出（文字格式）：**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

若變更宣告了 `skip_specs: true`，其規格階段會顯示為 `[~] specs (skipped: change declares skip_specs)`，且不會納入進度計算。

**輸出（JSON 格式）：**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

取得建立產物或套用任務的增強說明。AI 代理程式可使用此指令了解下一步要建立的內容。

```
openspec instructions [artifact] [options]
```

**參數：**

| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `artifact` | 否 | 產物 ID：`proposal`、`specs`、`design`、`tasks` 或 `apply` |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--change <id>` | 變更名稱（非互動模式下必填） |
| `--schema <name>` | Schema 覆蓋設定 |
| `--json` | 以 JSON 格式輸出 |

**特殊情況：** 使用 `apply` 作為產物可取得任務實作說明。

**範例：**

```bash
# Get instructions for next artifact
openspec instructions --change add-dark-mode

# Get specific artifact instructions
openspec instructions design --change add-dark-mode

# Get apply/implementation instructions
openspec instructions apply --change add-dark-mode

# JSON for agent consumption
openspec instructions design --change add-dark-mode --json
```

**輸出內容包含：**

- 產物的範本內容
- 來自設定的專案上下文
- 來自相依產物的內容
- 來自設定的每個產物專屬規則

若產物透過 `skip_specs: true` 跳過，輸出僅包含警告（JSON 格式會新增 `skipped`/`warning` 欄位）——不得建立該產物。

---

### `openspec templates`

顯示 schema 中所有產物的已解析範本路徑。

```
openspec templates [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--schema <name>` | 要檢查的 schema（預設：`spec-driven`） |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# Show template paths for default schema
openspec templates

# Show templates for custom schema
openspec templates --schema my-workflow

# JSON for programmatic use
openspec templates --json
```

**輸出（文字格式）：**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

列出可用的工作流程 schema，包含其說明與產物流程。

```
openspec schemas [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
openspec schemas
```

**輸出：**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

## 結構描述指令

用於建立與管理自訂工作流程結構描述的指令。

### `openspec schema init`

建立新的專案本機結構描述。

```
openspec schema init <name> [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `name` | 是 | 結構描述名稱（kebab-case 格式） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--description <文字>` | 結構描述說明 |
| `--artifacts <列表>` | 以逗號分隔的產物 ID（預設值：`proposal,specs,design,tasks`） |
| `--default` | 設為專案預設結構描述 |
| `--no-default` | 不提示設為預設 |
| `--force` | 覆寫現有結構描述 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 互動式建立結構描述
openspec schema init research-first

# 非互動式，指定特定產物
openspec schema init rapid \
  --description "快速迭代工作流程" \
  --artifacts "proposal,tasks" \
  --default
```

**建立的內容：**

```
openspec/schemas/<name>/
├── schema.yaml           # 結構描述定義
└── templates/
    ├── proposal.md       # 各產物範本
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

複製現有結構描述至專案以供自訂。

```
openspec schema fork <source> [name] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `source` | 是 | 要複製的結構描述 |
| `name` | 否 | 新結構描述名稱（預設值：`<source>-custom`） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--force` | 覆寫目標位置現有內容 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 衍生內建的規格驅動結構描述
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

驗證結構描述的結構與範本是否正確。

```
openspec schema validate [name] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `name` | 否 | 要驗證的結構描述（省略時驗證所有結構描述） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--verbose` | 顯示詳細驗證步驟 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 驗證特定結構描述
openspec schema validate my-workflow

# 驗證所有結構描述
openspec schema validate
```

---

### `openspec schema which`

顯示結構描述的解析來源（用於除錯優先順序時特別有用）。

```
openspec schema which [name] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `name` | 否 | 結構描述名稱 |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--all` | 列出所有結構描述及其來源 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 查詢結構描述的來源
openspec schema which spec-driven
```

**輸出：**

```
spec-driven 解析來源：套件內建
  來源：/usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**結構描述優先順序：**

1. 專案：`openspec/schemas/<name>/`
2. 使用者：`~/.local/share/openspec/schemas/<name>/`
3. 套件：內建結構描述

---

## 設定指令

### `openspec config`

檢視與修改 OpenSpec 全域設定。

```
openspec config <subcommand> [options]
```

**子指令：**

| 子指令 | 說明 |
|------------|-------------|
| `path` | 顯示設定檔位置 |
| `list` | 顯示所有目前設定值 |
| `get <key>` | 取得特定設定值 |
| `set <key> <value>` | 設定指定值 |
| `unset <key>` | 移除指定鍵值 |
| `reset` | 重設為預設值 |
| `edit` | 在 `$EDITOR` 中開啟設定檔 |
| `profile [preset]` | 以互動式或預設值設定工作流程設定檔 |

**範例：**

```bash
# 顯示設定檔路徑
openspec config path

# 列出所有設定
openspec config list

# 取得特定設定值
openspec config get telemetry.enabled

# 設定指定值
openspec config set telemetry.enabled false

# 明確設定字串值
openspec config set user.name "My Name" --string

# 移除自訂設定
openspec config unset user.name

# 設定機器層級預設儲存位置（當未指定 --store、本機根目錄或專案儲存位置時，作為後援根目錄：指標解析）
openspec config set defaultStore team-plans

# 重設所有設定
openspec config reset --all --yes

# 在編輯器中開啟設定檔
openspec config edit

# 以動作導向精靈設定設定檔
openspec config profile

# 快速預設值：切換工作流程至核心模式（保留傳遞模式）
openspec config profile core
```

`openspec config profile` 執行時會先顯示目前狀態摘要，接著可選擇：
- 變更傳遞模式與工作流程
- 僅變更傳遞模式
- 僅變更工作流程
- 保留目前設定（離開）

若選擇保留目前設定，將不會寫入任何變更，也不會顯示更新提示。
若無設定變更，但目前專案檔案與全域設定檔/傳遞模式不同步，OpenSpec 會顯示警告並建議執行 `openspec update`。
按下 `Ctrl+C` 也會乾淨地取消流程（不會顯示堆疊追蹤）並以錯誤碼 `130` 離開。
在工作流程核取清單中，`[x]` 代表該工作流程已在全域設定中選取。要將這些選取套用至專案檔案，請執行 `openspec update`（或在專案內收到提示時選擇「立即將變更套用至此專案？」）。

**互動式範例：**

```bash
# 僅更新傳遞模式
openspec config profile
# 選擇：僅變更傳遞模式
# 選擇傳遞模式：僅 Skills

# 僅更新工作流程
openspec config profile
# 選擇：僅變更工作流程
# 在核取清單中切換工作流程，接著確認
```

---

## 工具指令

### `openspec feedback`

提交 OpenSpec 相關意見回饋，會自動建立 GitHub issue。

```
openspec feedback <message> [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `message` | 是 | 意見回饋內容 |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--body <文字>` | 詳細說明 |

**需求：** 必須安裝並已驗證 GitHub CLI (`gh`)。

**範例：**

```bash
openspec feedback "新增自訂產物類型支援" \
  --body "我希望可以定義內建類型以外的自訂產物類型。"
```

---

### `openspec completion`

管理 OpenSpec CLI 的 Shell 自動完成功能。

```
openspec completion <subcommand> [shell]
```

**子指令：**

| 子指令 | 說明 |
|------------|-------------|
| `generate [shell]` | 將完成指令腳本輸出至標準輸出 |
| `install [shell]` | 為當前 Shell 安裝自動完成功能 |
| `uninstall [shell]` | 移除已安裝的自動完成功能 |

**支援的 Shell：** `bash`、`zsh`、`fish`、`powershell`

**範例：**

```bash
# 安裝自動完成功能（自動偵測 Shell）
openspec completion install

# 為特定 Shell 安裝
openspec completion install zsh

# 產生腳本以供手動安裝
openspec completion generate bash > ~/.bash_completion.d/openspec

# 解除安裝
openspec completion uninstall
```

---

## 離開碼

| 代碼 | 說明 |
|------|------|
| `0` | 成功 |
| `1` | 錯誤（驗證失敗、檔案遺失等） |

---

## 環境變數

| 變數 | 說明 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | 設為 `0` 以停用遙測功能 |
| `DO_NOT_TRACK` | 設為 `1` 以停用遙測功能（標準 DNT 信號） |
| `OPENSPEC_CONCURRENCY` | 大量驗證的預設併發數（預設值：6） |
| `EDITOR` 或 `VISUAL` | `openspec config edit` 使用的編輯器 |
| `NO_COLOR` | 設定時停用色彩輸出 |

---

## 相關文件

- [Commands](commands.md) - AI 斜線指令（`/opsx:propose`、`/opsx:apply` 等）
- [Workflows](workflows.md) - 常見模式及各指令的使用時機
- [Customization](customization.md) - 建立自訂結構描述與範本
- [Getting Started](getting-started.md) - 首次設定指南