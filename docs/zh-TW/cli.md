# CLI 參考資料

OpenSpec CLI (`openspec`) 提供用於專案設定、驗證、狀態檢查和管理的終端機命令。這些命令與 [Commands](commands.md) 中記錄的 AI 斜線命令（例如 `/opsx:propose`）相輔相成。

## 總覽

| Category | Commands | Purpose |
|----------|----------|---------|
| **Setup** | `init`, `update` | 在您的專案中初始化和更新 OpenSpec |
| **Stores (standalone OpenSpec repos)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | 管理儲存庫 — 您已註冊的獨立 OpenSpec 倉庫 |
| **Health** | `doctor` | 報告解析根目錄的關係健康狀況 |
| **Working context** | `context` | 組裝工作集（根目錄 + 參考的儲存庫） |
| **Personal worksets** | `workset create`, `workset list`, `workset open`, `workset remove` | 在您的工具中保存和開啟個人化的本地工作視圖 |
| **Browsing** | `list`, `view`, `show` | 探索變更和規格 |
| **Validation** | `validate` | 檢查變更和規格是否存在問題 |
| **Lifecycle** | `archive` | 完成已完成的變更 |
| **Workflow** | `new change`, `status`, `instructions`, `templates`, `schemas` | 支援基於工件（Artifact）的工作流程 |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | 建立和管理自訂工作流程 |
| **Config** | `config` | 查看和修改設定 |
| **Utility** | `feedback`, `completion` | 反饋和 Shell 整合 |

## Human vs Agent Commands

大多數 CLI 指令是為終端機的**人工使用者**設計。某些指令也支援透過 JSON 輸出供 **agent/script** 使用。

### 人工專用指令

這些指令具有互動性，專為終端機使用而設計：

| Command | Purpose |
|---------|---------|
| `openspec init` | 初始化專案（包含互動式提示） |
| `openspec view` | 互動式儀表板 |
| `openspec workset open <name>` | 開啟已儲存的工作集（編輯器視窗或終端機 agent session） |
| `openspec config edit` | 在編輯器中開啟設定檔 |
| `openspec feedback` | 透過 GitHub 提交回饋意見 |
| `openspec completion install` | 安裝 shell completions |

### Agent 相容指令

這些指令支援 `--json` 輸出，可供 AI agents 和腳本進行程式化使用：

| Command | Human Use | Agent Use |
|---------|-----------|-----------|
| `openspec list` | 瀏覽變更/規格 (specs) | 使用 `--json` 獲取結構化資料 |
| `openspec show <item>` | 閱讀內容 | 使用 `--json` 進行解析 |
| `openspec validate` | 檢查問題 | 使用 `--all --json` 進行批量驗證 |
| `openspec status` | 查看 Artifact 進度 | 使用 `--json` 獲取結構化狀態 |
| `openspec instructions` | 獲取下一步指示 | 使用 `--json` 獲取 agent 指令 |
| `openspec templates` | 尋找範本路徑 | 使用 `--json` 進行路徑解析 |
| `openspec schemas` | 列出可用規格 (schemas) | 使用 `--json` 進行 Schema 發現 |
| `openspec store setup <id>` | 建立並註冊本地儲存庫 | 使用 `--json` 並提供明確輸入，以獲得結構化設定輸出 |
| `openspec store register <path>` | 註冊現有的儲存庫 | 使用 `--json` 獲取結構化註冊輸出 |
| `openspec store unregister <id>` | 忘記本地儲存庫的註冊資訊 | 使用 `--json` 獲取結構化清理輸出 |
| `openspec store remove <id>` | 刪除已註冊的本地儲存庫資料夾 | 使用 `--yes --json` 進行非互動式刪除 |
| `openspec store list` | 瀏覽已註冊的儲存庫 | 使用 `--json` 獲取結構化清單 |
| `openspec store doctor` | 檢查本地儲存庫設定 | 使用 `--json` 獲取結構化診斷資訊 |
| `openspec new change <id>` | 建立 repo-local 變更骨架 (scaffolding) | 使用 `--json`，並搭配 `--store <id>` 以使用已註冊的儲存庫作為 OpenSpec root |
| `openspec workset create [name]` | 組裝個人工作視圖 | 使用 `--member <path> --json` 進行非互動式組裝 |
| `openspec workset list` | 瀏覽已儲存的工作集 | 使用 `--json` 獲取結構化視圖 |
| `openspec workset remove <name>` | 刪除已儲存的視圖 | 使用 `--yes --json` 進行非互動式移除 |

---

## 全域選項 (Global Options)

這些選項適用於所有指令：

| Option | Description |
|--------|-------------|
| `--version`, `-V` | 顯示版本號碼 |
| `--no-color` | 禁用彩色輸出 |
| `--help`, `-h` | 顯示指令的說明文件 |

---

## 設定指令 (Setup Commands)

### `openspec init`

在您的專案中初始化 OpenSpec。它會建立資料夾結構，並配置 AI 工具整合。

預設行為使用全域設定的預設值：profile 為 `core`，delivery 為 `both`，workflows 為 `propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | 目標目錄（預設：當前目錄） |

**Options:**

| Option | Description |
|--------|-------------|
| `--tools <list>` | 非互動式配置 AI 工具。可使用 `all`、`none` 或逗號分隔的清單 |
| `--force` | 自動清理舊版檔案，無需提示 |
| `--profile <profile>` | 覆蓋本次初始化執行的全域 profile（`core` 或 `custom`） |

`--profile custom` 會使用目前在全域設定 (`openspec config profile`) 中選定的工作流程。

**支援的工具 ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> 此清單對應於 `src/core/config.ts` 中的 `AI_TOOLS`。請參閱 [Supported Tools](supported-tools.md) 以了解每個工具的技能和指令路徑。

**範例:**

```bash
# 互動式初始化
openspec init

# 在特定目錄中初始化
openspec init ./my-project

# 非互動式：為 Claude 和 Cursor 配置
openspec init --tools claude,cursor

# 為所有支援的工具配置
openspec init --tools all

# 覆蓋本次執行的 profile
openspec init --profile core

# 跳過提示並自動清理舊版檔案
openspec init --force
```

**它會建立什麼:**

```
openspec/
├── specs/              # 您的規格 (source of truth)
├── changes/            # 提議的變更
└── config.yaml         # 專案設定檔

.claude/skills/         # Claude Code skills (如果選擇 claude)
.cursor/skills/         # Cursor skills (如果選擇 cursor)
.cursor/commands/       # Cursor OPSX 指令 (如果 delivery 包含 commands)
... (其他工具配置)
```

---

### `openspec update`

在升級 CLI 後更新 OpenSpec 指令檔案。它會使用您當前的全域 profile、選定的工作流程和交付模式，重新生成 AI 工具配置檔案。

```
openspec update [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | 目標目錄（預設：當前目錄） |

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | 強制更新，即使檔案已是最新狀態 |

**範例:**

```bash
# 執行 npm upgrade 後更新指令檔案
npm update @fission-ai/openspec
openspec update
```

---

## 儲存庫 (Stores) (獨立 OpenSpec repos)

> **Beta。** 儲存庫及其建立在其上的功能（參考、工作上下文、工作集）是新的；命令名稱、旗標、檔案格式和 JSON 輸出可能會在不同版本之間改變形狀。對於問題導向的入門指南，請參閱 [stores guide](stores-beta/user-guide.md)。

儲存庫 (Store) 是您已註冊於此機器上的獨立 OpenSpec repo，例如一個規劃 repo 或合約 repo。註冊一個儲存庫後，常規指令（`list`, `show`, `status`, `validate`, `new change`, `archive`, ...）就可以透過傳遞 `--store <id>` 從任何地方對其進行操作。

### `openspec store setup`

建立並註冊本地儲存庫。在終端機中不帶參數執行時，OpenSpec 會引導使用者完成設定。Agents 和腳本應提供明確的輸入並使用 `--json`。

```bash
openspec store setup [id] [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--path <path>` | 儲存庫應所在的資料夾（例如 `~/openspec/<id>`） |
| `--remote <url>` | 在新儲存庫的 `store.yaml` 中記錄規範的遠端地址 (canonical remote) |
| `--init-git` | 使用初始 commit 初始化 Git 倉庫（預設） |
| `--no-init-git` | 跳過所有 Git 操作：不初始化，不進行初始 commit |
| `--json` | JSON 輸出 |

非互動式執行 (`--json`, 腳本, agents) 必須同時提供儲存庫 ID 和 `--path`。在互動式的終端機中，設定會提示使用者輸入位置，並以一個可編輯的建議顯示在可見、由使用者擁有的地方（例如 `~/openspec/<id>`）；它絕不會預設為 OpenSpec 的管理資料目錄。

範例:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

註冊現有的本地儲存庫資料夾。

```bash
openspec store register [path] [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <id>` | 儲存庫 ID；預設為儲存庫元數據或資料夾名稱 |
| `--yes` | 確認為一個健康的 OpenSpec root 建立儲存庫身份元數據 |
| `--json` | JSON 輸出 |

### `openspec store unregister`

忘記本地儲存庫的註冊資訊，但不會刪除檔案。

```bash
openspec store unregister <id> [--json]
```

當儲存庫被移動、複製到其他地方，或不應再由此機器上的 OpenSpec 顯示時，請使用此指令。

### `openspec store remove`

忘記本地儲存庫的註冊資訊並刪除其本地資料夾。

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` 在互動式終端機中會先顯示該資料夾，然後再進行刪除。Agents、腳本和 JSON 呼叫者必須傳遞 `--yes` 來確認刪除。OpenSpec 會拒絕刪除不包含匹配儲存庫元數據的資料夾。

### `openspec store list`

列出本地已註冊的儲存庫。

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

檢查本地儲存庫的註冊狀態、元數據和 Git 存在性。

```bash
openspec store doctor [id] [--json]
```

Doctor 僅用於診斷；它會報告缺少根目錄、元數據不匹配以及無效的本地 Registry 狀態，但不會修改儲存庫本身。

### 從專案引用儲存庫 (Referencing stores from a project)

一個專案 repo 可以透過 `openspec/config.yaml` 宣告其工作所依賴的儲存庫：

```yaml
schema: spec-driven
references:
  - team-context
```

從此時起，該 repo 中 `openspec instructions` 的輸出（包括每個 Artifact 和 `apply` 層面的 JSON 及人工模式）都會包含對每個被引用儲存庫的規格 (specs) 索引——包括規格 ID、來自每個規格 Purpose 部分的一行摘要，以及獲取指令 (`openspec show <spec-id> --type spec --store <id>`)。此索引會在每次執行時從已註冊的 checkout 中即時建立；規格內容絕不會被複製到輸出中。

引用是唯讀的上下文 (read-only context)。它們永遠不會改變指令執行的行為：工作仍然保留在 repo 自身的根目錄，並且寫入被引用的儲存庫仍是一個明確的 `--store` 操作。如果一個無法解析的引用（例如，某個未在此機器上註冊的儲存庫）會降級為索引中的一條警告，並提供確切的修復方法，但指令仍然會生成。`openspec doctor` 會在特定地方報告引用的健康狀態。

### 記錄儲存庫的克隆來源 (Recording where a store is cloned from)

一個儲存庫可以將其規範的克隆來源記錄在其已提交的身份檔案中，從而避免「註冊儲存庫」這一點成為入職過程中的死胡同：

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

該遠端地址會被寫入初始 commit 內的 `.openspec-store/store.yaml` 中，因此每個克隆下來的儲存庫都會知道這一點。對於現有的儲存庫，請手動編輯 `store.yaml` 並提交。`store doctor` 會顯示記錄的遠端地址（以及 checkout 所觀察到的 Git origin）；setup/register 負責命名它；而 register 則會將 checkout 的 origin 記錄到機器本地 Registry 中。

引用宣告也可以包含克隆來源，這樣一個尚未擁有該儲存庫的隊友就能獲得一個完整、可貼上的修復指令（`git clone <remote> <path> && openspec store register <path> --id <id>`）：

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

記錄遠端地址並非同步操作：OpenSpec 絕不會自行執行克隆、拉取或推送。

### 宣告預設儲存庫 (Declaring a default store)

一個規劃完全外部化的 repo（即沒有本地的 `openspec/specs/` 或 `openspec/changes/`）可以宣告其儲存庫，而不是在每個指令上都傳遞 `--store`：

```yaml
# openspec/config.yaml (openspec/ 下唯一的檔案)
store: team-context
```

常規指令會自動解析到已宣告的儲存庫；根標題和 JSON 中的 `root` 區塊會報告 `source: "declared"` 並附帶儲存庫 ID，而輸出的提示中仍會包含 `--store <id>`。此宣告是備用選項 (fallback)，絕非覆蓋：明確的 `--store` 永遠優先，並且一個具有真實規劃資料夾的目錄會忽略該指標（並發出警告）。若要將一個指標 repo 轉換為本地 OpenSpec root，請移除 `store:` 行並執行 `openspec init` — 在宣告存在的情況下，init 會拒絕進行骨架建立。

## Doctor（關係健康狀況）

一個唯讀問題，一個地方：OpenSpec root 是否健康，以及它所引用的儲存庫是否在本機上可用？

```bash
openspec doctor [--store <id>] [--json]
```

報告會區分根目錄的健康狀況、儲存庫元數據（store metadata）的健康狀況（包括當記錄的遠端和檢查點（checkout）來源不一致時的情況），以及引用（reference）的健康狀況（顯示相同的診斷指令，並包含針對未解決引用的複製修復）。無論何種嚴重程度的健康發現都會以 0 退出——代理程式（agents）會讀取 `status` 陣列；只有命令失敗（沒有根目錄、未知儲存庫）才會以 1 退出。Doctor 從不複製、同步或修復。若要獲取組裝好的集合本身而非其健康狀況，請使用 `openspec context`。

## 工作上下文（已組裝的集合）

所有透過 OpenSpec 宣告相關的工作內容，都包含在一個工作集合中：OpenSpec root 和它所引用的儲存庫。

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON 簡報（brief）是代理程式可消費的（每個可用的引用儲存庫都包含其獲取配方；未解決的成員也包含相同的修復指令和 Doctor 報告）。`--code-workspace` 還會寫入一個包含根目錄以及可用引用儲存庫（`ref:<id>` 資料夾）的 VS Code 工作區檔案——這正是此命令執行的內容，如果檔案已存在且未加 `--force`，則拒絕執行。不可用的成員會被報告出來，絕不會被猜測。

「工作上下文」是已組裝的集合；而 `openspec/config.yaml` 中的 `context:` 欄位則是注入到指令中的專案背景——這是兩件不同的事情。`openspec doctor` 回答該集合是否健康；`openspec context` 回答該集合是什麼。

## 個人工作集 (Personal worksets)

> **Beta。** 工作集是新 Beta 介面的一部分；命令、旗標和檔案格式可能會在不同版本之間發生變化。有關操作流程，請參閱 [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together)。

工作集 (workset) 是您與他人共同工作的資料夾（包含規劃根目錄和您選擇的其他內容）的一個個人化命名視圖，它保存在您的機器上，並以名稱在工具中重新開啟。它純粹是本地的：從不提交、從不分享、從不基於宣告推導，並且刪除一個工作集不會影響任何成員資料夾。

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` 會執行一個簡短的引導流程（或非互動地接受 `--member` 旗標；第一個成員是主成員—工作階段從那裡開始）。`open` 會啟動所選定的工具：編輯器 (VS Code, Cursor) 會開啟一個包含所有成員的視窗並返回；CLI 代理程式 (Claude Code, codex) 會接管此終端機作為一個帶有所有成員附加的會話，且不會預填提示，直到您退出。在開啟時若缺少某個成員資料夾，系統會跳過該成員並發出通知；其餘的都會正常開啟。儲存的工具偏好設定可以透過 `--tool` 在每次開啟時覆蓋。

支援一個新的工具是配置而非程式碼。每個工具都屬於兩種啟動風格之一—`workspace-file`（使用生成的 `.code-workspace` 檔案啟動）或 `attach-dirs`（每個成員一個附加旗標）—而全局 `config.json` 中的 `openers` 鍵 (使用 `openspec config edit` 開啟) 用於新增工具或依欄位調整內建功能：

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

所有工作集狀態都儲存在全局資料目錄的 `worksets/` 資料夾下（包括已儲存的視圖和生成的 `<name>.code-workspace` 檔案，這些檔案在每次開啟時都會重新生成）；刪除該資料夾將移除所有痕跡。

---

## 瀏覽命令 (Browsing Commands)

### `openspec list`

列出專案中的變更或規格 (specs)。

```
openspec list [options]
```

**選項:**

| 選項 | 描述 |
|---|---|
| `--specs` | 列出規格，而非變更 |
| `--changes` | 列出變更（預設） |
| `--sort <order>` | 依 `recent` (最近, 預設) 或 `name` 排序 |
| `--json` | 以 JSON 格式輸出 |

**範例:**

```bash
# 列出所有活動中的變更
openspec list

# 列出所有規格
openspec list --specs

# 用於腳本的 JSON 輸出
openspec list --json
```

**輸出 (文字):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

顯示一個用於探索規格和變更的互動式儀表板。

```
openspec view
```

這會開啟一個基於終端機介面，用於導覽您專案中規格和變更的工具。

---

### `openspec show`

顯示某個變更或規格的詳細資訊。

```
openspec show [item-name] [options]
```

**參數:**

| 參數 | 是否必需 | 描述 |
|---|---|---|
| `item-name` | 無 | 變更或規格的名稱（如果省略會提示） |

**選項:**

| 選項 | 描述 |
|---|---|
| `--type <type>` | 指定類型：`change` 或 `spec`（若不具歧義性則自動偵測） |
| `--json` | 以 JSON 格式輸出 |
| `--no-interactive` | 禁用提示 |

**變更專用的選項:**

| 選項 | 描述 |
|---|---|
| `--deltas-only` | 只顯示 delta 規格（JSON 模式） |

**規格專用的選項:**

| 選項 | 描述 |
|---|---|
| `--requirements` | 只顯示需求，排除情境 (scenarios)（JSON 模式） |
| `--no-scenarios` | 排除情境內容（JSON 模式） |
| `-r, --requirement <id>` | 依 1-based index 顯示特定需求（JSON 模式） |

**範例:**

```bash
# 互動式選擇
openspec show

# 顯示特定的變更
openspec show add-dark-mode

# 顯示特定的規格
openspec show auth --type spec

# 用於解析的 JSON 輸出
openspec show add-dark-mode --json
```

---

## 驗證命令 (Validation Commands)

### `openspec validate`

對變更和規格進行結構性問題的驗證。

```
openspec validate [item-name] [options]
```

**參數:**

| 參數 | 是否必需 | 描述 |
|---|---|---|
| `item-name` | 無 | 要驗證的特定項目（如果省略會提示） |

**選項:**

| 選項 | 描述 |
|---|---|
| `--all` | 驗證所有變更和規格 |
| `--changes` | 驗證所有變更 |
| `--specs` | 驗證所有規格 |
| `--type <type>` | 當名稱有歧義性時指定類型：`change` 或 `spec` |
| `--strict` | 啟用嚴格驗證模式 |
| `--json` | 以 JSON 格式輸出 |
| `--concurrency <n>` | 最大並行驗證數（預設：6，或使用 `OPENSPEC_CONCURRENCY` 環境變數） |
| `--no-interactive` | 禁用提示 |

**範例:**

```bash
# 互動式驗證
openspec validate

# 驗證特定的變更
openspec validate add-dark-mode

# 驗證所有變更
openspec validate --changes

# 帶有 JSON 輸出的全面驗證（用於 CI/腳本）
openspec validate --all --json

# 增加並行性的嚴格驗證
openspec validate --all --strict --concurrency 12
```

**輸出 (文字):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**輸出 (JSON):**

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

## 生命週期命令 (Lifecycle Commands)

### `openspec archive`

歸檔一個已完成的變更，並將 delta 規格合併到主規格中。

```
openspec archive [change-name] [options]
```

**參數:**

| 參數 | 是否必需 | 描述 |
|---|---|---|
| `change-name` | 無 | 要歸檔的變更（如果省略會提示） |

**選項:**

| 選項 | 描述 |
|---|---|
| `-y, --yes` | 跳過確認提示 |
| `--skip-specs` | 跳過規格更新（用於基礎設施/工具鏈/文件專用的變更） |
| `--no-validate` | 跳過驗證（需要確認） |

**範例:**

```bash
# 互動式歸檔
openspec archive

# 歸檔特定的變更
openspec archive add-dark-mode

# 不帶提示地歸檔（CI/腳本）
openspec archive add-dark-mode --yes

# 歸檔一個不影響規格的工具鏈變更
openspec archive update-ci-config --skip-specs
```

**功能說明:**

1. 驗證該變更（除非使用 `--no-validate`）
2. 提示確認（除非使用 `--yes`）
3. 將 delta 規格合併到 `openspec/specs/`
4. 將變更資料夾移動到 `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## 工作流程命令 (Workflow Commands)

這些命令支援以工件為導向的 OPSX 工作流程。它們對於檢查進度的使用者和判斷下一步行動的代理程式都很有用。

### `openspec new change`

在已解析的 OpenSpec 根目錄中建立一個變更資料夾和可選的提交元數據。

```bash
openspec new change <name> [options]
```

**選項:**

| 選項 | 描述 |
|---|---|
| `--description <text>` | 要新增到 `index.md` 的描述 |
| `--goal <text>` | 可選的目標元數據，與變更一起儲存 |
| `--schema <name>` | 要使用的工作流程 Schema |
| `--store <id>` | 用作 OpenSpec 根目錄的 Store id（Store 是您已註冊的獨立 OpenSpec 倉庫） |
| `--json` | JSON 輸出 |

**範例:**

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

顯示變更的工件完成狀態。

```
openspec status [options]
```

**選項:**

| 選項 | 描述 |
|---|---|
| `--change <id>` | 變更名稱（如果省略會提示） |
| `--schema <name>` | Schema 覆蓋（從變更的配置中自動偵測） |
| `--json` | 以 JSON 格式輸出 |

**範例:**

```bash
# 互動式狀態檢查
openspec status

# 特定變更的狀態
openspec status --change add-dark-mode

# 用於代理程式的 JSON
openspec status --change add-dark-mode --json
```

**輸出 (文字):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**輸出 (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

獲取用於建立工件或應用任務的豐富指令。這對於 AI 代理程式了解下一步該創建什麼非常有用。

```
openspec instructions [artifact] [options]
```

**參數:**

| 參數 | 是否必需 | 描述 |
|---|---|---|
| `artifact` | 無 | 工件 ID：`proposal`, `specs`, `design`, `tasks`, 或 `apply` |

**選項:**

| 選項 | 描述 |
|---|---|
| `--change <id>` | 變更名稱（非互動模式下必需） |
| `--schema <name>` | Schema 覆蓋 |
| `--json` | 以 JSON 格式輸出 |

**特殊情況:** 使用 `apply` 作為工件，以獲取任務實作的指令。

**範例:**

```bash
# 獲取下一個工件的指令
openspec instructions --change add-dark-mode

# 獲取特定工件的指令
openspec instructions design --change add-dark-mode

# 獲取 apply/實作的指令
openspec instructions apply --change add-dark-mode

# 用於代理程式消耗的 JSON
openspec instructions design --change add-dark-mode --json
```

**輸出內容包括:**

- 工件的範本 (Template) 內容
- 來自配置的專案上下文
- 來自依賴工件的內容
- 來自配置的每個工件規則

---

### `openspec templates`

顯示 Schema 中所有工件的解析後的範本路徑。

```
openspec templates [options]
```

**選項:**

| 選項 | 描述 |
|---|---|
| `--schema <name>` | 要檢查的 Schema（預設：`spec-driven`） |
| `--json` | 以 JSON 格式輸出 |

**範例:**

```bash
# 顯示預設 Schema 的範本路徑
openspec templates

# 顯示自訂 Schema 的範本
openspec templates --schema my-workflow

# 用於程式化使用的 JSON
openspec templates --json
```

**輸出 (文字):**

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

列出所有可用的工作流程 Schema，包括它們的描述和工件流程。

```
openspec schemas [options]
```

**選項:**

| 選項 | 描述 |
|---|---|
| `--json` | 以 JSON 格式輸出 |

**範例:**

```bash
openspec schemas
```

**輸出:**

```
Available schemas:

  spec-driven (package)
    預設的 spec-driven 開發工作流程
    流程：proposal → specs → design → tasks

  my-custom (project)
    此專案的自訂工作流程
    流程：research → proposal → tasks
```

## Schema Commands

用於創建和管理自定義工作流程模式的命令。

### `openspec schema init`

創建一個專案本地的模式。

```
openspec schema init <name> [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | Yes | 模式名稱 (kebab-case) |

**Options:**

| Option | Description |
|--------|-------------|
| `--description <text>` | 模式描述 |
| `--artifacts <list>` | 用逗號分隔的產物 ID (預設值: `proposal,specs,design,tasks`) |
| `--default` | 設定為專案預設模式 |
| `--no-default` | 不提示設定為預設 |
| `--force` | 覆蓋現有的模式 |
| `--json` | 以 JSON 格式輸出 |

**Examples:**

```bash
# 互動式模式創建
openspec schema init research-first

# 指定特定產物的非互動式創建
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**它會創建什麼:**

```
openspec/schemas/<name>/
├── schema.yaml           # 模式定義
└── templates/
    ├── proposal.md       # 每個產物的範本
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

將現有的模式複製到您的專案中以進行自訂化。

```
openspec schema fork <source> [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `source` | Yes | 要複製的模式 |
| `name` | No | 新的模式名稱 (預設值: `<source>-custom`) |

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | 覆蓋現有的目標文件 |
| `--json` | 以 JSON 格式輸出 |

**Example:**

```bash
# 分支內建的 spec-driven 模式
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

驗證一個模式的結構和範本。

```
openspec schema validate [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | 要驗證的模式 (如果省略，則驗證所有) |

**Options:**

| Option | Description |
|--------|-------------|
| `--verbose` | 顯示詳細的驗證步驟 |
| `--json` | 以 JSON 格式輸出 |

**Example:**

```bash
# 驗證特定的模式
openspec schema validate my-workflow

# 驗證所有模式
openspec schema validate
```

---

### `openspec schema which`

顯示一個模式從何處解析（有助於除錯優先級別）。

```
openspec schema which [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | 模式名稱 |

**Options:**

| Option | Description |
|--------|-------------|
| `--all` | 列出所有模式及其來源 |
| `--json` | 以 JSON 格式輸出 |

**Example:**

```bash
# 檢查一個模式的來源
openspec schema which spec-driven
```

**Output:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schema precedence (模式優先級別):**

1. Project: `openspec/schemas/<name>/`
2. User: `~/.local/share/openspec/schemas/<name>/`
3. Package: 內建模式

---

## Configuration Commands

### `openspec config`

查看和修改全局 OpenSpec 配置。

```
openspec config <subcommand> [options]
```

**Subcommands (子命令):**

| Subcommand | Description |
|------------|-------------|
| `path` | 顯示配置文件的位置 |
| `list` | 顯示所有當前設定 |
| `get <key>` | 獲取特定值 |
| `set <key> <value>` | 設定一個值 |
| `unset <key>` | 移除一個鍵 |
| `reset` | 重置為預設值 |
| `edit` | 在 `$EDITOR` 中打開 |
| `profile [preset]` | 互動式配置工作流程概況或通過預設集 (preset) |

**Examples:**

```bash
# 顯示配置文件路徑
openspec config path

# 列出所有設定
openspec config list

# 獲取特定值
openspec config get telemetry.enabled

# 設定一個值
openspec config set telemetry.enabled false

# 明確設定字串值
openspec config set user.name "My Name" --string

# 移除自定義設定
openspec config unset user.name

# 重置所有配置
openspec config reset --all --yes

# 在您的編輯器中編輯配置
openspec config edit

# 使用基於動作的嚮導式來配置概況 (profile)
openspec config profile

# 快速預設集：將工作流程切換到 core (保留交付模式)
openspec config profile core
```

`openspec config profile` 會先顯示當前狀態摘要，然後讓您選擇：
- 更改交付方式 + 工作流程
- 只更改交付方式
- 只更改工作流程
- 保留當前設定 (退出)

如果您保留當前設定，則不會寫入任何更改，也不會顯示更新提示。
如果沒有配置更改，但當前的專案文件與您的全局概況/交付狀態不同步，OpenSpec 將會顯示警告並建議執行 `openspec update`。
按下 `Ctrl+C` 也能乾淨地取消流程（不會出現堆棧追蹤）並以代碼 `130` 退出。
在工作流程檢查清單中，`[x]` 表示該工作流程已在全局配置中選定。若要將這些選擇應用到專案文件，請執行 `openspec update` (或在專案內部提示時選擇「現在為此專案應用更改？」)。

**Interactive examples (互動式範例):**

```bash
# 僅交付方式的更新
openspec config profile
# 選擇: 只更改交付方式
# 選擇交付方式: Skills only

# 僅工作流程的更新
openspec config profile
# 選擇: 只更改工作流程
# 勾選檢查清單中的工作流程，然後確認
```

---

## Utility Commands

### `openspec feedback`

提交關於 OpenSpec 的回饋。這會創建一個 GitHub issue。

```
openspec feedback <message> [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `message` | Yes | 回饋訊息 |

**Options:**

| Option | Description |
|--------|-------------|
| `--body <text>` | 詳細描述 |

**Requirements (要求):** 必須安裝並通過身份驗證 GitHub CLI (`gh`)。

**Example:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

管理 OpenSpec CLI 的 Shell 完成功能 (shell completions)。

```
openspec completion <subcommand> [shell]
```

**Subcommands (子命令):**

| Subcommand | Description |
|------------|-------------|
| `generate [shell]` | 將完成腳本輸出到 stdout |
| `install [shell]` | 為您的 Shell 安裝完成功能 |
| `uninstall [shell]` | 移除已安裝的完成功能 |

**Supported shells (支援的 Shell):** `bash`, `zsh`, `fish`, `powershell`

**Examples:**

```bash
# 安裝完成功能 (自動檢測 shell)
openspec completion install

# 為特定 shell 安裝
openspec completion install zsh

# 為手動安裝生成腳本
openspec completion generate bash > ~/.bash_completion.d/openspec

# 卸載
openspec completion uninstall
```

---

## Exit Codes (退出代碼)

| Code | Meaning (含義) |
|------|-----------------|
| `0` | Success (成功) |
| `1` | Error (錯誤，例如驗證失敗、文件缺失等) |

---

## Environment Variables (環境變數)

| Variable | Description |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | 設定為 `0` 以禁用遙測功能 |
| `DO_NOT_TRACK` | 設定為 `1` 以禁用遙測功能 (標準 DNT 信號) |
| `OPENSPEC_CONCURRENCY` | 批量驗證的預設並發數 (預設值: 6) |
| `EDITOR` or `VISUAL` | 用於 `openspec config edit` 的編輯器 |
| `NO_COLOR` | 設定後禁用顏色輸出 |

---

## Related Documentation (相關文檔)

- [Commands](commands.md) - AI 斜槓命令（`/opsx:propose`, `/opsx:apply` 等）
- [Workflows](workflows.md) - 常見模式和何時使用每個命令
- [Customization](customization.md) - 創建自定義模式和範本
- [Getting Started](getting-started.md) - 初次設定指南