# CLI 參考手冊

OpenSpec CLI (`openspec`) 提供了用於專案設定、驗證、狀態檢查與管理的終端機命令。這些命令補充了在 [命令](commands.md) 中記錄的 AI 斜線命令（例如 `/opsx:propose`）。

## 摘要

| 類別 | 命令 | 用途 |
|------|------|------|
| **設定** | `init`, `update` | 在您的專案中初始化並更新 OpenSpec |
| **工作區（測試版）** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | 為連結的儲存庫或資料夾設定本地檢視 |
| **共享上下文（測試版）** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | 管理本地 context-store 註冊和持久的 initiative 上下文 |
| **瀏覽** | `list`, `view`, `show` | 探索變更與規格 |
| **驗證** | `validate` | 檢查變更與規格是否存在問題 |
| **生命週期** | `archive` | 完成已完成的變更 |
| **工作流程** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | 以工件為導向的工作流程支援 |
| **結構描述** | `schema init`, `schema fork`, `schema validate`, `schema which` | 建立與管理自訂工作流程 |
| **設定** | `config` | 檢視並修改設定 |
| **實用工具** | `feedback`, `completion` | 回饋與 Shell 整合 |

---

## 人類 vs 代理指令

大多數 CLI 指令設計用於在終端機中供**人類使用**。部分指令也支援透過 JSON 輸出供**代理/腳本使用**。

### 僅限人類使用的指令

這些指令是互動式的，專為終端機使用設計：

| 指令 | 用途 |
|------|------|
| `openspec init` | 初始化專案（互動式提示） |
| `openspec view` | 互動式儀表板 |
| `openspec config edit` | 在編輯器中開啟設定檔 |
| `openspec feedback` | 透過 GitHub 提交意見回饋 |
| `openspec completion install` | 安裝 shell 自動補全 |

### 兼容代理的指令

這些指令支援 `--json` 輸出，供 AI 代理和腳本進行程式化使用：

| 指令 | 人類使用 | 代理使用 |
|------|----------|----------|
| `openspec list` | 瀏覽變更/規格 | `--json` 用於結構化資料 |
| `openspec show <item>` | 讀取內容 | `--json` 用於解析 |
| `openspec validate` | 檢查問題 | `--all --json` 用於批量驗證 |
| `openspec status` | 查看成品進度 | `--json` 用於結構化狀態 |
| `openspec instructions` | 取得後續步驟 | `--json` 用於代理指令 |
| `openspec templates` | 尋找範本路徑 | `--json` 用於路徑解析 |
| `openspec schemas` | 列出可用的結構描述 | `--json` 用於結構描述探索 |
| `openspec workspace setup --no-interactive` | 使用明確輸入建立工作區 | `--json` 用於結構化設定輸出 |
| `openspec workspace list` | 瀏覽已知的工作區 | `--json` 用於有類型的工作區物件 |
| `openspec workspace link` | 連結一個儲存庫或資料夾 | `--json` 用於結構化連結輸出 |
| `openspec workspace relink` | 修復一個已連結的路徑 | `--json` 用於結構化連結輸出 |
| `openspec workspace doctor` | 檢查一個工作區 | `--json` 用於結構化狀態輸出 |
| `openspec workspace update` | 重新整理工作區本地指引與代理技能 | `--tools` 選擇代理；設定檔選擇工作流程 |
| `openspec context-store setup <id>` | 建立一個本地上下文儲存區 | `--json` 搭配明確輸入用於結構化設定輸出 |
| `openspec context-store register <path>` | 註冊一個現有的上下文儲存區 | `--json` 用於結構化註冊輸出 |
| `openspec context-store unregister <id>` | 移除一個本地上下文儲存區註冊 | `--json` 用於結構化清理輸出 |
| `openspec context-store remove <id>` | 刪除一個已註冊的本地上下文儲存區資料夾 | `--yes --json` 用於非互動式刪除 |
| `openspec context-store list` | 瀏覽已註冊的上下文儲存區 | `--json` 用於結構化註冊資訊 |
| `openspec context-store doctor` | 檢查本地儲存區設定 | `--json` 用於結構化診斷 |
| `openspec initiative list` | 瀏覽共享的倡議 | `--json` 用於結構化倡議記錄 |
| `openspec initiative show <id>` | 解析一個倡議 | `--json` 用於標準路徑與元資料 |
| `openspec new change <id>` | 建立儲存庫本地的變更框架 | `--json`，加上 `--initiative` 用於共享協調連結 |
| `openspec set change <id>` | 更新已簽入的變更元資料 | `--json`，加上 `--initiative` 用於共享協調連結 |

---

## 全域選項

這些選項適用於所有指令：

| 選項 | 描述 |
|------|------|
| `--version`, `-V` | 顯示版本號碼 |
| `--no-color` | 停用彩色輸出 |
| `--help`, `-h` | 顯示指令說明 |

---

## 設定指令

### `openspec init`

在您的專案中初始化 OpenSpec。建立資料夾結構並設定 AI 工具整合。

預設行為使用全域設定預設值：設定檔 `core`、交付方式 `both`、工作流程 `propose, explore, apply, sync, archive`。

```
openspec init [path] [options]
```

**引數：**

| 引數 | 必要性 | 描述 |
|------|--------|------|
| `path` | 否 | 目標目錄（預設：當前目錄） |

**選項：**

| 選項 | 描述 |
|------|------|
| `--tools <list>` | 非互動式設定 AI 工具。使用 `all`、`none` 或以逗號分隔的清單 |
| `--force` | 自動清理舊版檔案，不提示 |
| `--profile <profile>` | 為此次初始化運行覆蓋全域設定檔（`core` 或 `custom`） |

`--profile custom` 使用全域設定中當前選擇的工作流程（`openspec config profile`）。

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

# 為此次運行覆蓋設定檔
openspec init --profile core

# 跳過提示並自動清理舊版檔案
openspec init --force
```

**它建立的內容：**

```
openspec/
├── specs/              # 您的規格（真實來源）
├── changes/            # 提議的變更
└── config.yaml         # 專案設定

.claude/skills/         # Claude Code 技能（若選擇了 claude）
.cursor/skills/         # Cursor 技能（若選擇了 cursor）
.cursor/commands/       # Cursor OPSX 指令（若交付方式包含指令）
... （其他工具設定）
```

---

### `openspec update`

升級 CLI 後，更新 OpenSpec 指令檔案。使用您當前的全域設定檔、選定的工作流程和交付模式，重新產生 AI 工具設定檔。

```
openspec update [path] [options]
```

**引數：**

| 引數 | 必要性 | 描述 |
|------|--------|------|
| `path` | 否 | 目標目錄（預設：當前目錄） |

**選項：**

| 選項 | 描述 |
|------|------|
| `--force` | 即使檔案已是最新也強制更新 |

**範例：**

```bash
# 在 npm 升級後更新指令檔案
npm update @fission-ai/openspec
openspec update
```

---

## 工作區指令

工作區指令處於測試階段。下方的本地檢視模型是當前的發展方向，但外部自動化、整合和長期運行的工作流程，仍應將指令行為、狀態檔案和 JSON 輸出視為仍在演進中。

協調工作區是針對已連結儲存庫或資料夾的本機檢視。工作區的可見性不等於變更承諾：連結 OpenSpec 應知曉的儲存庫或資料夾，然後在您準備好規劃具體工作時再建立變更。

### `openspec workspace setup`

在標準的 OpenSpec 工作區位置建立一個工作區，並連結至少一個現有的儲存庫或資料夾。

```bash
openspec workspace setup [options]
```

**選項：**

| 選項 | 描述 |
|------|------|
| `--name <name>` | 工作區名稱。名稱必須使用烤肉串式命名法 |
| `--link <path>` | 連結一個現有的儲存庫或資料夾，並從資料夾名稱推斷連結名稱 |
| `--link <name>=<path>` | 使用明確的連結名稱連結一個現有的儲存庫或資料夾 |
| `--opener <id>` | 在非互動式設定期間儲存偏好的開啟工具：`codex-cli`、`claude`、`github-copilot` 或 `editor` |
| `--tools <tools>` | 為代理安裝工作區本地的 OpenSpec 技能。使用 `all`、`none` 或以逗號分隔的工具 ID |
| `--no-interactive` | 停用提示；需要 `--name` 和至少一個 `--link` |
| `--json` | 輸出 JSON；需要 `--no-interactive` |

**範例：**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

互動式設定會詢問偏好的開啟工具，並可為選定的代理安裝工作區本地的 OpenSpec 技能。非互動式設定僅在提供 `--opener` 時儲存偏好的開啟工具；否則 `workspace open` 在支援的開啟工具可用時，稍後會在互動式終端機中提示，或要求腳本傳遞 `--agent <tool>` 或 `--editor`。

在此測試階段中，工作區技能安裝僅限於技能：即使全域交付方式為 `commands` 或 `both`，工作區設定也只會在工作區根目錄寫入代理技能資料夾，而不會建立斜線指令檔案。活躍的全域設定檔決定安裝哪些工作流程技能；`--tools` 決定哪些代理接收它們。如果在非互動式設定中省略 `--tools`，則不會安裝任何技能，稍後可以使用 `workspace update --tools <ids>` 加入。

### `openspec workspace list`

從本機註冊表列出已知的 OpenSpec 工作區。

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

清單顯示每個工作區的位置和已連結的儲存庫或資料夾。過時的註冊表記錄會被回報，但不會更改。

### `openspec workspace link`

為一個工作區記錄一個現有的儲存庫或資料夾。

```bash
openspec workspace link [name] <path> [options]
```

**選項：**

| 選項 | 描述 |
|------|------|
| `--workspace <name>` | 從本機註冊表選擇一個已知的工作區 |
| `--json` | 輸出 JSON |
| `--no-interactive` | 停用工作區選擇器提示 |

**範例：**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

路徑必須已存在。相對路徑會在 OpenSpec 將驗證過的絕對路徑儲存到本機工作區狀態之前，根據指令的當前目錄進行解析。連結的路徑可以是完整的儲存庫、套件、服務、應用程式，或是沒有儲存庫本地 `openspec/` 狀態的資料夾。

### `openspec workspace relink`

修復或變更一個現有連結的本機路徑。

```bash
openspec workspace relink <name> <path> [options]
```

路徑必須已存在。Relink 僅更新穩定連結名稱的本機路徑。

### `openspec workspace doctor`

檢查一個工作區在當前機器上可以解析什麼。

```bash
openspec workspace doctor [options]
```

Doctor 顯示工作區位置、已連結的儲存庫或資料夾、遺失的路徑、存在的儲存庫本地規格路徑，以及建議的修復方式。JSON 輸出也包含工作區規劃路徑以保持相容性。它僅報告問題；不會自動修復。

需要一個工作區的指令，在工作區資料夾或子目錄內運行時使用當前的工作區。從其他地方運行時，傳遞 `--workspace <name>`、在互動式終端機中從選擇器選擇，或在僅有一個已知工作區時依賴該工作區。在 `--json` 或 `--no-interactive` 模式下，模糊選擇會導致結構化狀態錯誤，並建議使用 `--workspace <name>`。

JSON 回應使用有類型的物件加上 `status` 陣列。主要資料位於 `workspace`、`workspaces` 或 `link` 中；警告和錯誤位於 `status` 中。

### `openspec workspace update`

重新整理工作區本地的 OpenSpec 指引和代理技能。

```bash
openspec workspace update [name] [options]
```

**選項：**

| 選項 | 描述 |
|------|------|
| `--workspace <name>` | 從本機註冊表選擇一個已知的工作區 |
| `--tools <tools>` | 為工作區技能選擇代理。使用 `all`、`none` 或以逗號分隔的工具 ID |
| `--json` | 輸出 JSON |
| `--no-interactive` | 停用工作區選擇器提示 |

**範例：**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` 重新整理產生的工作區指引區塊和本機開放介面。對於代理技能，它在省略 `--tools` 時重用儲存的工作區技能代理選擇。傳遞 `--tools` 會替換該儲存的選擇。它僅重新整理工作區根目錄中 OpenSpec 管理的工作流程技能目錄，移除已取消選擇的管理工作流程技能，並保持已連結的儲存庫和資料夾不變。

在工作區內部執行 `openspec update` 會重新導向到 `openspec workspace update`；當您希望更新儲存庫擁有的工具檔案時，請在儲存庫本地專案內部執行 `openspec update`。

### `openspec workspace open`

透過儲存的偏好的開啟工具、一次性代理覆蓋，或 VS Code 編輯器模式，開啟一個工作區工作集。

```bash
openspec workspace open [name] [options]
```

**選項：**

| 選項 | 描述 |
|------|------|
| `--workspace <name>` | 位置工作區名稱的別名 |
| `--initiative <id>` | 作為本機工作區檢視開啟一個倡議。接受 `<id>` 或 `<store>/<id>` |
| `--store <id>` | 用於 `--initiative` 的已註冊上下文儲存區 ID |
| `--store-path <path>` | 用於 `--initiative` 的現有本機上下文儲存區根目錄 |
| `--agent <tool>` | 一次性代理覆蓋：`codex-cli`、`claude` 或 `github-copilot` |
| `--editor` | 以一般編輯器工作區形式開啟維護的 VS Code 工作區檔案 |
| `--no-interactive` | 停用工作區和開啟工具選擇器提示 |

**範例：**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` 在內部執行時使用當前的工作區，在其他地方執行時自動選擇唯一已知的工作區，並在有多個已知工作區時要求使用者選擇。`--agent` 和 `--editor` 不會更改儲存的偏好的開啟工具。同時傳遞兩個開啟工具覆蓋是錯誤的；請選擇 `--agent <tool>` 或 `--editor` 其中之一。

當使用 `--initiative` 時，OpenSpec 會為該倡議準備或選擇一個私有的本機工作區檢視。從註冊表選擇的儲存區按 ID 儲存；`--store-path` 儲存一個運行時本機路徑選擇器，因為工作區檢視是私有的本機狀態。

OpenSpec 在工作區根目錄維護 `<workspace-name>.code-workspace`，用於 VS Code 編輯器和 GitHub Copilot-in-VS-Code 的開啟。該檔案是本機工作區檢視狀態。

維護的 VS Code 工作區首先列出有效的已連結儲存庫或資料夾，然後是附加的倡議上下文，最後是 OpenSpec 工作區檔案。VS Code 將這些條目顯示為一個多根工作區。

根工作區開啟使已連結的儲存庫或資料夾可見，便於探索和上下文查閱。實作編輯應僅在使用者明確要求並遵循正常的 OpenSpec 實作工作流程後才開始。

## 共享上下文指令

上下文存储與協調計劃是 Beta 版的協調介面。上下文存儲是本地端的持久化共享上下文註冊，通常為一個 Git 支持的資料夾或克隆庫。協調計劃則是上下文存儲內部的共享協調上下文；儲存庫本地端的變更可以與其連結，而無需將共享方案複製到每個儲存庫中。

### `openspec context-store setup`

建立並註冊本地端上下文存儲。在終端機中不帶任何引數執行時，
OpenSpec 將引導使用者完成設定。代理與腳本應傳入明確輸入並使用 `--json`。

```bash
openspec context-store setup [id] [options]
```

**選項：**

| 選項 | 描述 |
|------|------|
| `--path <path>` | 上下文存儲資料夾路徑；預設為 OpenSpec 管理的本地端資料目錄 |
| `--init-git` | 在上下文存儲中初始化一個 Git 儲存庫 |
| `--no-init-git` | 不初始化 Git 儲存庫 |
| `--json` | 輸出 JSON |

當省略 `--path` 時，setup 會在 `getGlobalDataDir()/context-stores/<id>` 下建立存儲：若已設定 `XDG_DATA_HOME`，則為 `$XDG_DATA_HOME/openspec/context-stores/<id>`；在 Unix 風格的回退路徑下則為 `~/.local/share/openspec/context-stores/<id>`。若您希望存儲位於一個可見的克隆庫或團隊專用資料夾中，請傳入 `--path`。

範例：

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

註冊一個現有的本地端上下文存儲資料夾。

```bash
openspec context-store register [path] [options]
```

**選項：**

| 選項 | 描述 |
|------|------|
| `--id <id>` | 上下文存儲 ID；預設為存儲的中繼資料或資料夾名稱 |
| `--json` | 輸出 JSON |

### `openspec context-store unregister`

移除一個本地端上下文存儲的註冊，但不刪除檔案。

```bash
openspec context-store unregister <id> [--json]
```

當存儲已被移動、克隆到其他位置，或不應再由 OpenSpec 在此機器上顯示時，可使用此指令。

### `openspec context-store remove`

移除一個本地端上下文存儲的註冊，並刪除其本地端資料夾。

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` 在互動式終端機中刪除前會顯示確切的資料夾路徑。
代理、腳本和 JSON 呼叫者必須傳入 `--yes` 以確認刪除。
OpenSpec 拒絕刪除一個不包含相符上下文存儲中繼資料的資料夾。

### `openspec context-store list`

列出本地端已註冊的上下文存儲。

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

檢查本地端上下文存儲的註冊、中繼資料和 Git 狀態。

```bash
openspec context-store doctor [id] [--json]
```

Doctor 僅進行診斷；它會報告遺失的根目錄、中繼資料不匹配以及無效的本地端註冊表狀態，而不會修改存儲本身。

### `openspec initiative create`

在上下文存儲中建立一個協調計劃。

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**選項：**

| 選項 | 描述 |
|------|------|
| `--store <id>` | 來自本地端註冊表的上下文存儲 ID |
| `--store-path <path>` | 現有的本地端上下文存儲根目錄 |
| `--title <title>` | 協調計劃標題 |
| `--summary <summary>` | 協調計劃摘要 |
| `--json` | 輸出 JSON |

### `openspec initiative list`

列出協調計劃。若無選擇器，此指令會搜尋所有已註冊的上下文存儲，並在 `status` 中報告部分讀取警告。

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**選項：**

| 選項 | 描述 |
|------|------|
| `--store <id>` | 列出一個已註冊的上下文存儲 |
| `--store-path <path>` | 列出一個現有的本地端上下文存儲根目錄 |
| `--json` | 輸出 JSON |

### `openspec initiative show`

解析一個協調計劃並印出其標準路徑位置。

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

若未使用 `--store`，OpenSpec 會搜尋已註冊的上下文存儲。若相同的協調計劃 ID 存在於多個存儲中，請傳入 `--store <id>` 或使用 `<store>/<id>` 形式。

---

## 瀏覽命令

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
| `--sort <order>` | 依據 `recent`（預設）或 `name` 排序 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 列出所有進行中的變更
openspec list

# 列出所有規格
openspec list --specs

# 用於腳本的 JSON 輸出
openspec list --json
```

**輸出（文字）：**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
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

| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 變更或規格的名稱（若省略則會提示輸入） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--type <type>` | 指定類型：`change` 或 `spec`（若明確則自動偵測） |
| `--json` | 以 JSON 格式輸出 |
| `--no-interactive` | 停用提示 |

**變更專屬選項：**

| 選項 | 描述 |
|--------|-------------|
| `--deltas-only` | 僅顯示增量規格（JSON 模式） |

**規格專屬選項：**

| 選項 | 描述 |
|--------|-------------|
| `--requirements` | 僅顯示需求，排除情境（JSON 模式） |
| `--no-scenarios` | 排除情境內容（JSON 模式） |
| `-r, --requirement <id>` | 依據從 1 開始的索引顯示特定需求（JSON 模式） |

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

## 驗證命令

### `openspec validate`

驗證變更和規格是否存在結構性問題。

```
openspec validate [item-name] [options]
```

**引數：**

| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 要驗證的特定項目（若省略則會提示輸入） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--all` | 驗證所有變更和規格 |
| `--changes` | 驗證所有變更 |
| `--specs` | 驗證所有規格 |
| `--type <type>` | 當名稱不明確時指定類型：`change` 或 `spec` |
| `--strict` | 啟用嚴格驗證模式 |
| `--json` | 以 JSON 格式輸出 |
| `--concurrency <n>` | 最大並行驗證數（預設：6，或使用 `OPENSPEC_CONCURRENCY` 環境變數） |
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

# 嚴格驗證並提高並行度
openspec validate --all --strict --concurrency 12
```

**輸出（文字）：**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
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

## 生命週期命令

### `openspec archive`

封存一個已完成的變更，並將增量規格合併到主要規格中。

```
openspec archive [change-name] [options]
```

**引數：**

| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要封存的變更（若省略則會提示輸入） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `-y, --yes` | 跳過確認提示 |
| `--skip-specs` | 跳過規格更新（適用於基礎架構/工具/僅限文件的變更） |
| `--no-validate` | 跳過驗證（需要確認） |

**範例：**

```bash
# 互動式封存
openspec archive

# 封存特定變更
openspec archive add-dark-mode

# 封存且不提示（用於 CI/腳本）
openspec archive add-dark-mode --yes

# 封存一個不影響規格的工具變更
openspec archive update-ci-config --skip-specs
```

**其作用：**

1. 驗證變更（除非使用 `--no-validate`）
2. 提示確認（除非使用 `--yes`）
3. 將增量規格合併到 `openspec/specs/` 中
4. 將變更資料夾移動到 `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## 工作流程命令

這些命令支援以產出物為導向的 OPSX 工作流程。它們對於人類檢查進度和代理決定下一步都很有用。

### `openspec new change`

建立一個倉庫本地的變更目錄和可選的簽入中繼資料。

```bash
openspec new change <name> [options]
```

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--description <text>` | 要新增到 `README.md` 的描述 |
| `--goal <text>` | 要與變更一起儲存的工作區產品目標 |
| `--areas <names>` | 受影響的工作區連結名稱（以逗號分隔） |
| `--initiative <id>` | 將倉庫本地變更連結到一個計劃 |
| `--store <id>` | `--initiative` 的情境儲存 ID |
| `--store-path <path>` | `--initiative` 的現有本地情境儲存根目錄 |
| `--schema <name>` | 要使用的工作流程架構 |
| `--json` | 輸出 JSON |

範例：

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

更新已簽入的倉庫本地變更中繼資料，而無需重新建立變更。

```bash
openspec set change <name> [options]
```

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--initiative <id>` | 將倉庫本地變更連結到一個計劃 |
| `--store <id>` | `--initiative` 的情境儲存 ID |
| `--store-path <path>` | `--initiative` 的現有本地情境儲存根目錄 |
| `--json` | 輸出 JSON |

當請求的連結已存在時，`set change --initiative` 是冪等的，並且拒絕替換不同的現有計劃連結。

### `openspec status`

顯示變更的產出物完成狀態。

```
openspec status [options]
```

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--change <id>` | 變更名稱（若省略則會提示輸入） |
| `--schema <name>` | 架構覆寫（從變更的設定中自動偵測） |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 互動式狀態檢查
openspec status

# 特定變更的狀態
openspec status --change add-dark-mode

# 供代理使用的 JSON
openspec status --change add-dark-mode --json
```

**輸出（文字）：**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**輸出（JSON）：**

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

取得用於建立產出物或應用任務的充實說明。供 AI 代理用於了解下一步應建立什麼。

```
openspec instructions [artifact] [options]
```

**引數：**

| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `artifact` | 否 | 產出物 ID：`proposal`、`specs`、`design`、`tasks` 或 `apply` |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--change <id>` | 變更名稱（在非互動模式下為必需） |
| `--schema <name>` | 架構覆寫 |
| `--json` | 以 JSON 格式輸出 |

**特殊情況：** 使用 `apply` 作為產出物以取得任務實作說明。

**範例：**

```bash
# 取得下一個產出物的說明
openspec instructions --change add-dark-mode

# 取得特定產出物的說明
openspec instructions design --change add-dark-mode

# 取得套用/實作說明
openspec instructions apply --change add-dark-mode

# 供代理消費的 JSON
openspec instructions design --change add-dark-mode --json
```

**輸出包含：**

- 產出物的範本內容
- 來自設定的專案情境
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

# 供程式化使用的 JSON
openspec templates --json
```

**輸出（文字）：**

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

## 結構架構命令

用於建立與管理自訂工作流程架構的指令。

### `openspec schema init`

建立新的專案層級架構。

```
openspec schema init <name> [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|------|------|------|
| `name` | 是 | 架構名稱 (kebab-case 格式) |

**選項：**

| 選項 | 說明 |
|------|------|
| `--description <text>` | 架構說明 |
| `--artifacts <list>` | 以逗號分隔的產出物 ID (預設: `proposal,specs,design,tasks`) |
| `--default` | 設為專案預設架構 |
| `--no-default` | 不提示是否設為預設 |
| `--force` | 覆寫既有架構 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 互動式架構建立
openspec schema init research-first

# 非互動式，指定產出物
openspec schema init rapid \
  --description "快速迭代工作流程" \
  --artifacts "proposal,tasks" \
  --default
```

**建立的內容：**

```
openspec/schemas/<name>/
├── schema.yaml           # 架構定義
└── templates/
    ├── proposal.md       # 各產出物的範本
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

複製既有架構到您的專案進行自訂。

```
openspec schema fork <source> [name] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|------|------|------|
| `source` | 是 | 要複製的架構 |
| `name` | 否 | 新架構名稱 (預設: `<source>-custom`) |

**選項：**

| 選項 | 說明 |
|------|------|
| `--force` | 覆寫既有目標位置 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 複製內建的 spec-driven 架構
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

驗證架構的結構與範本。

```
openspec schema validate [name] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|------|------|------|
| `name` | 否 | 要驗證的架構 (省略則驗證所有) |

**選項：**

| 選項 | 說明 |
|------|------|
| `--verbose` | 顯示詳細驗證步驟 |
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

顯示架構的來源解析位置 (有助於除錯優先順序)。

```
openspec schema which [name] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|------|------|------|
| `name` | 否 | 架構名稱 |

**選項：**

| 選項 | 說明 |
|------|------|
| `--all` | 列出所有架構及其來源 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 檢查架構來源
openspec schema which spec-driven
```

**輸出：**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**架構優先順序：**

1. 專案層級：`openspec/schemas/<name>/`
2. 使用者層級：`~/.local/share/openspec/schemas/<name>/`
3. 套件層級：內建架構

---

## 組態設定命令

### `openspec config`

檢視與修改全域 OpenSpec 組態設定。

```
openspec config <subcommand> [options]
```

**子命令：**

| 子命令 | 說明 |
|--------|------|
| `path` | 顯示組態檔案位置 |
| `list` | 顯示所有目前設定 |
| `get <key>` | 取得特定設定值 |
| `set <key> <value>` | 設定值 |
| `unset <key>` | 移除設定鍵 |
| `reset` | 重設為預設值 |
| `edit` | 在 `$EDITOR` 中開啟編輯 |
| `profile [preset]` | 以互動式或預設方案設定工作流程設定檔 |

**範例：**

```bash
# 顯示組態檔案路徑
openspec config path

# 列出所有設定
openspec config list

# 取得特定設定值
openspec config get telemetry.enabled

# 設定值
openspec config set telemetry.enabled false

# 明確設定字串值
openspec config set user.name "My Name" --string

# 移除自訂設定
openspec config unset user.name

# 重設所有組態設定
openspec config reset --all --yes

# 在編輯器中編輯組態設定
openspec config edit

# 以動作導向精靈設定設定檔
openspec config profile

# 快速預設方案：切換工作流程至核心 (保留交付模式)
openspec config profile core
```

`openspec config profile` 會先顯示目前狀態摘要，接著讓您選擇：
- 變更交付模式 + 工作流程
- 僅變更交付模式
- 僅變更工作流程
- 保留目前設定 (離開)

若您選擇保留目前設定，則不會寫入任何變更，也不會顯示更新提示。
若組態設定沒有變更，但目前專案或工作區檔案與您的全域設定檔/交付模式不同步，OpenSpec 會顯示警告，並建議對專案層級專案執行 `openspec update`，或對工作區層級使用 `openspec workspace update` 以更新指引與技能。
按下 `Ctrl+C` 也會乾淨地取消流程 (無堆疊追蹤) 並以代碼 `130` 結束。
在工作流程清單中，`[x]` 表示該工作流程已在全域組態中選取。要將這些選取套用至專案檔案，請執行 `openspec update` (或在專案內出現提示時選擇「立即將變更套用至此專案？」)。在工作區內，使用 `openspec workspace update` 來更新工作區層級的指引與技能；對於已生成的代理工作流程檔案，此操作仍僅限於技能層級，不會生成工作區斜線命令。

**互動式範例：**

```bash
# 僅更新交付模式
openspec config profile
# 選擇：僅變更交付模式
# 選擇交付模式：僅技能

# 僅更新工作流程
openspec config profile
# 選擇：僅變更工作流程
# 在清單中切換工作流程，然後確認
```

---

## 工具命令

### `openspec feedback`

提交關於 OpenSpec 的回饋意見。會建立一個 GitHub Issue。

```
openspec feedback <message> [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|------|------|------|
| `message` | 是 | 回饋訊息 |

**選項：**

| 選項 | 說明 |
|------|------|
| `--body <text>` | 詳細說明 |

**需求：** GitHub CLI (`gh`) 必須已安裝並完成驗證。

**範例：**

```bash
openspec feedback "新增對自訂產出物類型的支援" \
  --body "我希望定義超出內建類型的自訂產出物類型。"
```

---

### `openspec completion`

管理 OpenSpec CLI 的 Shell 自動補全。

```
openspec completion <subcommand> [shell]
```

**子命令：**

| 子命令 | 說明 |
|--------|------|
| `generate [shell]` | 將補全腳本輸出至標準輸出 |
| `install [shell]` | 為您的 Shell 安裝補全 |
| `uninstall [shell]` | 移除已安裝的補全 |

**支援的 Shell：** `bash`、`zsh`、`fish`、`powershell`

**範例：**

```bash
# 安裝補全 (自動偵測 Shell)
openspec completion install

# 為特定 Shell 安裝
openspec completion install zsh

# 產生腳本以手動安裝
openspec completion generate bash > ~/.bash_completion.d/openspec

# 解除安裝
openspec completion uninstall
```

---

## 結束代碼

| 代碼 | 意義 |
|------|------|
| `0` | 成功 |
| `1` | 錯誤 (驗證失敗、檔案遺失等) |

---

## 環境變數

| 變數 | 說明 |
|------|------|
| `OPENSPEC_TELEMETRY` | 設為 `0` 以停用遙測 |
| `DO_NOT_TRACK` | 設為 `1` 以停用遙測 (標準 DNT 訊號) |
| `OPENSPEC_CONCURRENCY` | 批次驗證的預設並行數 (預設: 6) |
| `EDITOR` 或 `VISUAL` | 用於 `openspec config edit` 的編輯器 |
| `NO_COLOR` | 設定後停用顏色輸出 |

---

## 相關文件

- [指令](commands.md) - AI 斜線命令 (`/opsx:propose`、`/opsx:apply` 等)
- [工作流程](workflows.md) - 常見模式與各指令的使用時機
- [自訂](customization.md) - 建立自訂架構與範本
- [快速入門](getting-started.md) - 首次設定指南