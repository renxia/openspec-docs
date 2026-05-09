# CLI 參考

OpenSpec CLI (`openspec`) 提供用於專案設定、驗證、狀態檢查與管理的終端機命令。這些命令補充了 [命令](commands.md) 中所記載的 AI 斜線命令（如 `/opsx:propose`）。

## 摘要

| 類別 | 命令 | 用途 |
|----------|----------|---------|
| **設定** | `init`, `update` | 初始化並更新您專案中的 OpenSpec |
| **工作區（測試版）** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | 設定跨連結儲存庫或資料夾的規劃 |
| **瀏覽** | `list`, `view`, `show` | 探索變更與規格 |
| **驗證** | `validate` | 檢查變更與規格是否有問題 |
| **生命週期** | `archive` | 完成已完成的變更 |
| **工作流程** | `status`, `instructions`, `templates`, `schemas` | 以產物為導向的工作流程支援 |
| **結構描述** | `schema init`, `schema fork`, `schema validate`, `schema which` | 建立與管理自訂工作流程 |
| **設定** | `config` | 檢視與修改設定 |
| **工具** | `feedback`, `completion` | 回饋與 Shell 整合 |

---

## 人類與代理命令

大多數 CLI 命令是為**人類**在終端機中使用而設計的。部分命令也支援透過 JSON 輸出供**代理/腳本**使用。

### 人類專用命令

這些命令是互動式的，專為終端機使用而設計：

| 命令 | 用途 |
|---------|---------|
| `openspec init` | 初始化專案（互動式提示） |
| `openspec view` | 互動式儀表板 |
| `openspec config edit` | 在編輯器中開啟設定檔 |
| `openspec feedback` | 透過 GitHub 提交回饋 |
| `openspec completion install` | 安裝 Shell 自動補全 |

### 代理相容命令

這些命令支援 `--json` 輸出，供 AI 代理和腳本進行程式化使用：

| 命令 | 人類使用 | 代理使用 |
|---------|-----------|-----------|
| `openspec list` | 瀏覽變更/規格 | `--json` 用於結構化資料 |
| `openspec show <item>` | 讀取內容 | `--json` 用於解析 |
| `openspec validate` | 檢查問題 | `--all --json` 用於批次驗證 |
| `openspec status` | 查看產物進度 | `--json` 用於結構化狀態 |
| `openspec instructions` | 取得後續步驟 | `--json` 用於代理指令 |
| `openspec templates` | 尋找範本路徑 | `--json` 用於路徑解析 |
| `openspec schemas` | 列出可用的結構描述 | `--json` 用於結構描述探索 |
| `openspec workspace setup --no-interactive` | 使用明確輸入建立工作區 | `--json` 用於結構化設定輸出 |
| `openspec workspace list` | 瀏覽已知工作區 | `--json` 用於類型化工作區物件 |
| `openspec workspace link` | 連結儲存庫或資料夾 | `--json` 用於結構化連結輸出 |
| `openspec workspace relink` | 修復已連結的路徑 | `--json` 用於結構化連結輸出 |
| `openspec workspace doctor` | 檢查一個工作區 | `--json` 用於結構化狀態輸出 |

---

## 全域選項

這些選項適用於所有命令：

| 選項 | 描述 |
|--------|-------------|
| `--version`, `-V` | 顯示版本號碼 |
| `--no-color` | 停用彩色輸出 |
| `--help`, `-h` | 顯示命令的說明 |

---

## 設定命令

### `openspec init`

在您的專案中初始化 OpenSpec。建立資料夾結構並設定 AI 工具整合。

預設行為使用全域設定預設值：設定檔 `core`，交付方式 `both`，工作流程 `propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**引數：**

| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `path` | 否 | 目標目錄（預設：目前目錄） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--tools <list>` | 以非互動方式設定 AI 工具。使用 `all`、`none` 或逗號分隔的列表 |
| `--force` | 自動清理舊版檔案，無需提示 |
| `--profile <profile>` | 覆蓋此次初始化執行的全域設定檔（`core` 或 `custom`） |

`--profile custom` 使用目前在全域設定中選取的任何工作流程（`openspec config profile`）。

**支援的工具 ID (`--tools`)：** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**範例：**

```bash
# 互動式初始化
openspec init

# 在特定目錄中初始化
openspec init ./my-project

# 非互動式：為 Claude 和 Cursor 設定
openspec init --tools claude,cursor

# 為所有支援的工具設定
openspec init --tools all

# 覆蓋此次執行的設定檔
openspec init --profile core

# 跳過提示並自動清理舊版檔案
openspec init --force
```

**建立的內容：**

```
openspec/
├── specs/              # 您的規格（真實來源）
├── changes/            # 提議的變更
└── config.yaml         # 專案設定

.claude/skills/         # Claude Code 技能（若選擇 claude）
.cursor/skills/         # Cursor 技能（若選擇 cursor）
.cursor/commands/       # Cursor OPSX 命令（若交付方式包含命令）
... (其他工具設定)
```

---

### `openspec update`

在升級 CLI 後更新 OpenSpec 指令檔案。使用您目前的全域設定檔、選取的工作流程和交付模式，重新產生 AI 工具設定檔。

```
openspec update [path] [options]
```

**引數：**

| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `path` | 否 | 目標目錄（預設：目前目錄） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--force` | 即使檔案已是最新版本，也強制更新 |

**範例：**

```bash
# 在 npm 升級後更新指令檔案
npm update @fission-ai/openspec
openspec update
```

---

## 工作區命令

工作區命令正在積極開發中，尚未準備就緒供使用。請勿在此命令介面上建立外部自動化、整合或長期運行的工作流程；命令行為、狀態檔案和 JSON 輸出可能隨時變更。

協調工作區是跨多個儲存庫或資料夾進行工作的規劃場所。工作區的可見性並非變更承諾：連結 OpenSpec 應知曉的儲存庫或資料夾，然後在您準備規劃特定工作時建立變更。

### `openspec workspace setup`

在標準的 OpenSpec 工作區位置建立一個工作區，並連結至少一個現有的儲存庫或資料夾。

```bash
openspec workspace setup [options]
```

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--name <name>` | 工作區名稱。名稱必須為 kebab-case 格式 |
| `--link <path>` | 連結一個現有的儲存庫或資料夾，並從資料夾名稱推斷連結名稱 |
| `--link <name>=<path>` | 使用明確的連結名稱連結一個現有的儲存庫或資料夾 |
| `--opener <id>` | 在非互動式設定期間儲存偏好的開啟工具：`codex`、`claude`、`github-copilot` 或 `editor` |
| `--no-interactive` | 停用提示；需要 `--name` 和至少一個 `--link` |
| `--json` | 輸出 JSON；需要 `--no-interactive` |

**範例：**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

互動式設定會詢問偏好的開啟工具並將其儲存在機器本地的工作區狀態中。非互動式設定僅在提供 `--opener` 時才儲存偏好的開啟工具；否則，`workspace open` 在支援的開啟工具可用時，會在互動式終端機中稍後提示，或要求腳本傳遞 `--agent <tool>` 或 `--editor`。

### `openspec workspace list`

從本機登錄檔列出已知的 OpenSpec 工作區。

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

列表顯示每個工作區的位置和連結的儲存庫或資料夾。過時的登錄記錄會被報告，但不會被更改。

### `openspec workspace link`

為一個工作區記錄一個現有的儲存庫或資料夾。

```bash
openspec workspace link [name] <path> [options]
```

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--workspace <name>` | 從本機登錄檔選擇一個已知的工作區 |
| `--json` | 輸出 JSON |
| `--no-interactive` | 停用工作區選擇器提示 |

**範例：**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

路徑必須已存在。相對路徑會在 OpenSpec 將驗證過的絕對路徑儲存到機器本地工作區狀態之前，根據命令的目前目錄進行解析。連結的路徑可以是完整的儲存庫、套件、服務、應用程式或沒有儲存庫本地 `openspec/` 狀態的資料夾。

### `openspec workspace relink`

修復或變更現有連結的本機路徑。

```bash
openspec workspace relink <name> <path> [options]
```

路徑必須已存在。Relink 僅更新穩定連結名稱的機器本地路徑。

### `openspec workspace doctor`

檢查一個工作區在目前機器上可以解析的內容。

```bash
openspec workspace doctor [options]
```

Doctor 顯示工作區位置、規劃路徑、連結的儲存庫或資料夾、遺失的路徑、存在時的儲存庫本地規格路徑，以及建議的修復方法。它僅報告問題；不會自動修復它們。

需要一個工作區的命令在從工作區資料夾或子目錄內執行時使用目前的工作區。從其他地方執行時，傳遞 `--workspace <name>`，在互動式終端機中從選擇器選擇，或在恰好存在一個已知工作區時依賴它。在 `--json` 或 `--no-interactive` 模式下，模糊的選擇會導致結構化狀態錯誤，並建議使用 `--workspace <name>`。

JSON 回應使用類型化物件加上 `status` 陣列。主要資料位於 `workspace`、`workspaces` 或 `link` 中；警告和錯誤位於 `status` 中。

### `openspec workspace open`

透過儲存的偏好的開啟工具、單次代理覆蓋或 VS Code 編輯器模式，開啟一個工作區工作集。

```bash
openspec workspace open [name] [options]
```

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--workspace <name>` | 位置工作區名稱的別名 |
| `--agent <tool>` | 單次代理覆蓋：`codex`、`claude` 或 `github-copilot` |
| `--editor` | 將維護的 VS Code 工作區檔案作為一般編輯器工作區開啟 |
| `--no-interactive` | 停用工作區和開啟工具選擇器提示 |

**範例：**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` 在內部執行時使用目前的工作區，在其他地方執行時自動選擇唯一已知的工作區，並在已知多個工作區時要求使用者選擇。`--agent` 和 `--editor` 不會更改儲存的偏好的開啟工具。同時傳遞兩個開啟工具覆蓋是錯誤的；請選擇 `--agent <tool>` 或 `--editor`。

OpenSpec 在工作區根目錄維護 `<workspace-name>.code-workspace`，用於 VS Code 編輯器和 GitHub Copilot-in-VS-Code 的開啟。該檔案是機器本地的，預設情況下透過特定的 `<workspace-name>.code-workspace` `.gitignore` 條目被忽略，因此使用者編寫的 `*.code-workspace` 檔案仍可被追蹤。

維護的 VS Code 工作區將協調根目錄作為 `.`，加上有效的連結儲存庫或資料夾作為額外的根目錄。VS Code 將這些條目顯示為多根工作區。

根工作區開啟支援跨連結儲存庫或資料夾的探索和規劃。實作編輯應僅在使用者明確要求並經過正常的 OpenSpec 實作工作流程後才開始。

---

## 瀏覽指令

### `openspec list`

列出您專案中的變更或規格。

```
openspec list [options]
```

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--specs` | 列出規格而非變更 |
| `--changes` | 列出變更（預設） |
| `--sort <order>` | 按 `recent`（預設）或 `name` 排序 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 列出所有作用中的變更
openspec list

# 列出所有規格
openspec list --specs

# 用於腳本的 JSON 輸出
openspec list --json
```

**輸出（文字）：**

```
作用中的變更：
  add-dark-mode     UI 主題切換支援
  fix-login-bug     工作階段逾時處理
```

---

### `openspec view`

顯示一個用於探索規格和變更的互動式儀表板。

```
openspec view
```

開啟一個基於終端機的介面，用於導覽您專案的規格和變更。

---

### `openspec show`

顯示變更或規格的詳細資訊。

```
openspec show [item-name] [options]
```

**引數：**

| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 變更或規格的名稱（若省略則會提示） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--type <type>` | 指定類型：`change` 或 `spec`（若明確則自動偵測） |
| `--json` | 以 JSON 格式輸出 |
| `--no-interactive` | 停用提示 |

**變更特定選項：**

| 選項 | 描述 |
|--------|-------------|
| `--deltas-only` | 僅顯示差異規格（JSON 模式） |

**規格特定選項：**

| 選項 | 描述 |
|--------|-------------|
| `--requirements` | 僅顯示需求，排除情境（JSON 模式） |
| `--no-scenarios` | 排除情境內容（JSON 模式） |
| `-r, --requirement <id>` | 按 1 為基底的索引顯示特定需求（JSON 模式） |

**範例：**

```bash
# 互動式選擇
openspec show

# 顯示特定變更
openspec show add-dark-mode

# 顯示特定規格
openspec show auth --type spec

# 用於解析的 JSON 輸出
openspec show add-dark-mode --json
```

---

## 驗證指令

### `openspec validate`

驗證變更和規格是否存在結構性問題。

```
openspec validate [item-name] [options]
```

**引數：**

| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 要驗證的特定項目（若省略則會提示） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--all` | 驗證所有變更和規格 |
| `--changes` | 驗證所有變更 |
| `--specs` | 驗證所有規格 |
| `--type <type>` | 當名稱不明確時指定類型：`change` 或 `spec` |
| `--strict` | 啟用嚴格驗證模式 |
| `--json` | 以 JSON 格式輸出 |
| `--concurrency <n>` | 最大平行驗證數（預設：6，或 `OPENSPEC_CONCURRENCY` 環境變數） |
| `--no-interactive` | 停用提示 |

**範例：**

```bash
# 互動式驗證
openspec validate

# 驗證特定變更
openspec validate add-dark-mode

# 驗證所有變更
openspec validate --changes

# 驗證所有項目並以 JSON 輸出（用於 CI/腳本）
openspec validate --all --json

# 嚴格驗證並增加平行度
openspec validate --all --strict --concurrency 12
```

**輸出（文字）：**

```
正在驗證 add-dark-mode...
  ✓ proposal.md 有效
  ✓ specs/ui/spec.md 有效
  ⚠ design.md：缺少「技術方法」章節

發現 1 個警告
```

**輸出（JSON）：**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md：缺少「技術方法」章節"]
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

## 生命週期命令

### `openspec archive`

封存已完成的變更，並將差異規格合併至主要規格中。

```
openspec archive [change-name] [options]
```

**引數：**

| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要封存的變更（若省略則會提示輸入） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `-y, --yes` | 跳過確認提示 |
| `--skip-specs` | 跳過規格更新（僅適用於基礎架構/工具/文件變更） |
| `--no-validate` | 跳過驗證（需要確認） |

**範例：**

```bash
# 互動式封存
openspec archive

# 封存特定變更
openspec archive add-dark-mode

# 無提示封存（適用於 CI/腳本）
openspec archive add-dark-mode --yes

# 封存不影響規格的工具變更
openspec archive update-ci-config --skip-specs
```

**執行內容：**

1. 驗證變更（除非使用 `--no-validate`）
2. 提示確認（除非使用 `--yes`）
3. 將差異規格合併至 `openspec/specs/`
4. 將變更資料夾移動至 `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## 工作流程命令

這些命令支援以產出物為導向的 OPSX 工作流程。它們對於人類檢查進度和代理決定後續步驟都很有用。

### `openspec status`

顯示變更的產出物完成狀態。

```
openspec status [options]
```

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--change <id>` | 變更名稱（若省略則會提示輸入） |
| `--schema <name>` | 覆蓋架構（從變更的設定中自動偵測） |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 互動式狀態檢查
openspec status

# 特定變更的狀態
openspec status --change add-dark-mode

# 供代理使用的 JSON 格式
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

**輸出（JSON 格式）：**

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

取得用於建立產出物或套用任務的詳細說明。供 AI 代理用於了解下一步應建立什麼。

```
openspec instructions [artifact] [options]
```

**引數：**

| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `artifact` | 否 | 產出物 ID：`proposal`、`specs`、`design`、`tasks` 或 `apply` |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--change <id>` | 變更名稱（在非互動模式下為必要） |
| `--schema <name>` | 覆蓋架構 |
| `--json` | 以 JSON 格式輸出 |

**特殊情況：** 使用 `apply` 作為產出物可取得任務實作說明。

**範例：**

```bash
# 取得下一個產出物的說明
openspec instructions --change add-dark-mode

# 取得特定產出物的說明
openspec instructions design --change add-dark-mode

# 取得套用/實作說明
openspec instructions apply --change add-dark-mode

# 供代理使用的 JSON 格式
openspec instructions design --change add-dark-mode --json
```

**輸出內容包括：**

- 產出物的範本內容
- 來自設定的專案上下文
- 來自相依產出物的內容
- 來自設定的每個產出物規則

---

### `openspec templates`

顯示架構中所有產出物的已解析範本路徑。

```
openspec templates [options]
```

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--schema <name>` | 要檢查的架構（預設：`spec-driven`） |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 顯示預設架構的範本路徑
openspec templates

# 顯示自訂架構的範本
openspec templates --schema my-workflow

# 供程式化使用的 JSON 格式
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

列出可用的工作流程架構及其描述和產出物流程。

```
openspec schemas [options]
```

**選項：**

| 選項 | 描述 |
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

---

## 架構命令

用於建立和管理自訂工作流程架構的命令。

### `openspec schema init`

建立新的專案本地架構。

```
openspec schema init <name> [options]
```

**引數：**

| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `name` | 是 | 架構名稱（使用 kebab-case 命名法） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--description <text>` | 架構描述 |
| `--artifacts <list>` | 以逗號分隔的產出物 ID（預設：`proposal,specs,design,tasks`） |
| `--default` | 設為專案預設架構 |
| `--no-default` | 不提示設為預設 |
| `--force` | 覆蓋現有架構 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 互動式架構建立
openspec schema init research-first

# 非互動式並指定產出物
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**建立內容：**

```
openspec/schemas/<name>/
├── schema.yaml           # 架構定義
└── templates/
    ├── proposal.md       # 每個產出物的範本
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

複製現有架構至您的專案以進行自訂。

```
openspec schema fork <source> [name] [options]
```

**引數：**

| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `source` | 是 | 要複製的架構 |
| `name` | 否 | 新架構名稱（預設：`<source>-custom`） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--force` | 覆蓋現有目標 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 複製內建的 spec-driven 架構
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

驗證架構的結構和範本。

```
openspec schema validate [name] [options]
```

**引數：**

| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `name` | 否 | 要驗證的架構（若省略則驗證所有架構） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--verbose` | 顯示詳細的驗證步驟 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 驗證特定架構
openspec schema validate my-workflow

# 驗證所有架構
openspec schema validate
```

---

### `openspec schema which`

顯示架構的解析來源（對於偵錯優先順序很有用）。

```
openspec schema which [name] [options]
```

**引數：**

| 引數 | 必要 | 描述 |
|----------|----------|-------------|
| `name` | 否 | 架構名稱 |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--all` | 列出所有架構及其來源 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 檢查架構的來源
openspec schema which spec-driven
```

**輸出：**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**架構優先順序：**

1. 專案：`openspec/schemas/<name>/`
2. 使用者：`~/.local/share/openspec/schemas/<name>/`
3. 套件：內建架構

---

## 設定指令

### `openspec config`

檢視與修改全域 OpenSpec 設定。

```
openspec config <子指令> [選項]
```

**子指令：**

| 子指令 | 說明 |
|------------|-------------|
| `path` | 顯示設定檔位置 |
| `list` | 顯示所有當前設定 |
| `get <key>` | 取得特定值 |
| `set <key> <value>` | 設定值 |
| `unset <key>` | 移除金鑰 |
| `reset` | 重設為預設值 |
| `edit` | 在 `$EDITOR` 中開啟 |
| `profile [preset]` | 互動式或透過預設設定工作流程設定檔 |

**範例：**

```bash
# 顯示設定檔路徑
openspec config path

# 列出所有設定
openspec config list

# 取得特定值
openspec config get telemetry.enabled

# 設定值
openspec config set telemetry.enabled false

# 明確設定字串值
openspec config set user.name "My Name" --string

# 移除自訂設定
openspec config unset user.name

# 重設所有設定
openspec config reset --all --yes

# 在您的編輯器中編輯設定
openspec config edit

# 使用基於操作的精靈設定設定檔
openspec config profile

# 快速預設：將工作流程切換至核心（保留傳遞模式）
openspec config profile core
```

`openspec config profile` 會從當前狀態摘要開始，然後讓您選擇：
- 變更傳遞模式 + 工作流程
- 僅變更傳遞模式
- 僅變更工作流程
- 保留當前設定（退出）

如果您選擇保留當前設定，則不會寫入任何變更，也不會顯示更新提示。
如果沒有設定變更，但當前專案檔案與您的全域設定檔/傳遞模式不同步，OpenSpec 將顯示警告並建議執行 `openspec update`。
按下 `Ctrl+C` 也會乾淨地取消流程（無堆疊追蹤）並以代碼 `130` 退出。
在工作流程檢查清單中，`[x]` 表示該工作流程已在全域設定中選取。要將這些選取套用到專案檔案，請執行 `openspec update`（或在專案內出現提示時選擇 `立即將變更套用到此專案？`）。

**互動式範例：**

```bash
# 僅更新傳遞模式
openspec config profile
# 選擇：僅變更傳遞模式
# 選擇傳遞模式：僅限技能

# 僅更新工作流程
openspec config profile
# 選擇：僅變更工作流程
# 在檢查清單中切換工作流程，然後確認
```

---

## 工具指令

### `openspec feedback`

提交關於 OpenSpec 的回饋。會建立一個 GitHub 議題。

```
openspec feedback <訊息> [選項]
```

**引數：**

| 引數 | 必要 | 說明 |
|----------|----------|-------------|
| `message` | 是 | 回饋訊息 |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--body <text>` | 詳細說明 |

**需求：** 必須安裝並驗證 GitHub CLI (`gh`)。

**範例：**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

管理 OpenSpec CLI 的 Shell 自動補全。

```
openspec completion <子指令> [shell]
```

**子指令：**

| 子指令 | 說明 |
|------------|-------------|
| `generate [shell]` | 將補全腳本輸出到標準輸出 |
| `install [shell]` | 為您的 Shell 安裝補全 |
| `uninstall [shell]` | 移除已安裝的補全 |

**支援的 Shell：** `bash`、`zsh`、`fish`、`powershell`

**範例：**

```bash
# 安裝補全（自動偵測 Shell）
openspec completion install

# 為特定 Shell 安裝
openspec completion install zsh

# 產生腳本以手動安裝
openspec completion generate bash > ~/.bash_completion.d/openspec

# 解除安裝
openspec completion uninstall
```

---

## 退出代碼

| 代碼 | 意義 |
|------|---------|
| `0` | 成功 |
| `1` | 錯誤（驗證失敗、檔案遺失等） |

---

## 環境變數

| 變數 | 說明 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | 設為 `0` 以停用遙測 |
| `DO_NOT_TRACK` | 設為 `1` 以停用遙測（標準 DNT 訊號） |
| `OPENSPEC_CONCURRENCY` | 批次驗證的預設並行數（預設：6） |
| `EDITOR` 或 `VISUAL` | 用於 `openspec config edit` 的編輯器 |
| `NO_COLOR` | 設定時停用彩色輸出 |

---

## 相關文件

- [指令](commands.md) - AI 斜線指令（`/opsx:propose`、`/opsx:apply` 等）
- [工作流程](workflows.md) - 常見模式與何時使用每個指令
- [自訂](customization.md) - 建立自訂結構描述與範本
- [快速入門](getting-started.md) - 首次設定指南