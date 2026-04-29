# CLI 參考手冊

OpenSpec CLI (`openspec`) 提供終端機指令，用於專案設定、驗證、狀態檢查與管理。這些指令是 [指令](commands.md) 文件中所述 AI 斜線指令（如 `/opsx:propose`）的補充。

## 摘要

| 類別 | 指令 | 用途 |
|----------|----------|---------|
| **設定** | `init`, `update` | 在您的專案中初始化與更新 OpenSpec |
| **瀏覽** | `list`, `view`, `show` | 探索變更與規格 |
| **驗證** | `validate` | 檢查變更與規格是否存在問題 |
| **生命週期** | `archive` | 完成已完成的變更 |
| **工作流程** | `status`, `instructions`, `templates`, `schemas` | 提供以工件為導向的工作流程支援 |
| **架構** | `schema init`, `schema fork`, `schema validate`, `schema which` | 建立與管理自訂工作流程 |
| **設定** | `config` | 檢視與修改設定 |
| **實用工具** | `feedback`, `completion`` | 提供回饋與 Shell 整合功能 |

---

## 人類與代理命令

大多數 CLI 命令是為**人類在終端機中使用**而設計的。部分命令也支援透過 JSON 輸出供**代理/腳本使用**。

### 僅限人類使用的命令

這些命令是互動式的，專為終端機使用而設計：

| 命令 | 用途 |
|---------|---------|
| `openspec init` | 初始化專案（互動式提示） |
| `openspec view` | 互動式儀表板 |
| `openspec config edit` | 在編輯器中開啟設定檔 |
| `openspec feedback` | 透過 GitHub 提交回饋 |
| `openspec completion install` | 安裝 shell 自動補全 |

### 兼容代理的命令

這些命令支援 `--json` 輸出，供 AI 代理和腳本進行程式化使用：

| 命令 | 人類用途 | 代理用途 |
|---------|-----------|-----------|
| `openspec list` | 瀏覽變更/規格 | `--json` 用於結構化資料 |
| `openspec show <item>` | 閱讀內容 | `--json` 用於解析 |
| `openspec validate` | 檢查問題 | `--all --json` 用於批量驗證 |
| `openspec status` | 查看工件進度 | `--json` 用於結構化狀態 |
| `openspec instructions` | 取得下一步驟 | `--json` 用於代理指令 |
| `openspec templates` | 尋找範本路徑 | `--json` 用於路徑解析 |
| `openspec schemas` | 列出可用的架構 | `--json` 用於架構探索 |

---

## 全域選項

這些選項適用於所有命令：

| 選項 | 描述 |
|--------|-------------|
| `--version`, `-V` | 顯示版本號 |
| `--no-color` | 停用彩色輸出 |
| `--help`, `-h` | 顯示命令的說明 |

---

## 設定命令

### `openspec init`

在您的專案中初始化 OpenSpec。建立資料夾結構並設定 AI 工具整合。

預設行為使用全域設定預設值：設定檔 `core`、交付物 `both`、工作流程 `propose, explore, apply, archive`。

```
openspec init [path] [options]
```

**參數：**

| 參數 | 必要 | 描述 |
|----------|----------|-------------|
| `path` | 否 | 目標目錄（預設：目前目錄） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--tools <list>` | 非互動式設定 AI 工具。使用 `all`、`none` 或逗號分隔的清單 |
| `--force` | 自動清理舊版檔案，不進行提示 |
| `--profile <profile>` | 覆寫此次初始化運行的全域設定檔（`core` 或 `custom`） |

`--profile custom` 會使用全域設定中目前選定的工作流程（`openspec config profile`）。

**支援的工具 ID（`--tools`）：** `amazon-q`、`antigravity`、`auggie`、`claude`、`cline`、`codex`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`iflow`、`kilocode`、`kiro`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`trae`、`windsurf`

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

# 覆寫此次運行的設定檔
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

.claude/skills/         # Claude Code 技能（如果選取了 claude）
.cursor/skills/         # Cursor 技能（如果選取了 cursor）
.cursor/commands/       # Cursor OPSX 命令（如果交付物包含命令）
... (其他工具設定)
```

---

### `openspec update`

在升級 CLI 後更新 OpenSpec 指令檔案。使用您目前的全域設定檔、選定的工作流程和交付模式，重新產生 AI 工具設定檔。

```
openspec update [path] [options]
```

**參數：**

| 參數 | 必要 | 描述 |
|----------|----------|-------------|
| `path` | 否 | 目標目錄（預設：目前目錄） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--force` | 即使檔案已是最新也強制更新 |

**範例：**

```bash
# 在 npm 升級後更新指令檔案
npm update @fission-ai/openspec
openspec update
```

---

## 瀏覽命令

### `openspec list`

列出專案中的變更或規格。

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

顯示互動式儀表板，用於探索規格和變更。

```
openspec view
```

開啟一個基於終端機的介面，用於瀏覽專案的規格和變更。

---

### `openspec show`

顯示變更或規格的詳細資訊。

```
openspec show [item-name] [options]
```

**參數：**

| 參數 | 必要 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 變更或規格的名稱（如果省略則會提示） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--type <type>` | 指定類型：`change` 或 `spec`（如果明確則自動偵測） |
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
| `-r, --requirement <id>` | 按從 1 開始的索引顯示特定需求（JSON 模式） |

**範例：**

```bash
# 互動式選取
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

驗證變更和規格的結構問題。

```
openspec validate [item-name] [options]
```

**參數：**

| 參數 | 必要 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 要驗證的特定項目（如果省略則會提示） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--all` | 驗證所有變更和規格 |
| `--changes` | 驗證所有變更 |
| `--specs` | 驗證所有規格 |
| `--type <type>` | 當名稱不明確時指定類型：`change` 或 `spec` |
| `--strict` | 啟用嚴格驗證模式 |
| `--json` | 以 JSON 格式輸出 |
| `--concurrency <n>` | 最大並行驗證數（預設：6，或 `OPENSPEC_CONCURRENCY` 環境變數） |
| `--no-interactive` | 停用提示 |

**範例：**

```bash
# 互動式驗證
openspec validate

# 驗證特定變更
openspec validate add-dark-mode

# 驗證所有變更
openspec validate --changes

# 驗證所有內容並以 JSON 輸出（用於 CI/腳本）
openspec validate --all --json

# 嚴格驗證並增加並行度
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
        "warnings": ["design.md: 缺少 '技術方法' 章節"]
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

封存已完成的變更，並將差異規格合併至主規格。

```
openspec archive [change-name] [options]
```

**參數：**

| 參數 | 必要 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要封存的變更（如果省略則會提示） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `-y, --yes` | 跳過確認提示 |
| `--skip-specs` | 跳過規格更新（用於僅影響基礎設施/工具/文件的變更） |
| `--no-validate` | 跳過驗證（需要確認） |

**範例：**

```bash
# 互動式封存
openspec archive

# 封存特定變更
openspec archive add-dark-mode

# 無提示封存（用於 CI/腳本）
openspec archive add-dark-mode --yes

# 封存不影響規格的工具變更
openspec archive update-ci-config --skip-specs
```

**運作方式：**

1. 驗證變更（除非使用 `--no-validate`）
2. 提示確認（除非使用 `--yes`）
3. 將差異規格合併至 `openspec/specs/`
4. 將變更資料夾移至 `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## 工作流程命令

這些命令支援以工件為導向的 OPSX 工作流程。它們對於檢查進度的人類和決定下一步驟的代理都很有用。

### `openspec status`

顯示變更的工件完成狀態。

```
openspec status [options]
```

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--change <id>` | 變更名稱（如果省略則會提示） |
| `--schema <name>` | 架構覆寫（從變更的設定自動偵測） |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 互動式狀態檢查
openspec status

# 特定變更的狀態
openspec status --change add-dark-mode

# 用於代理的 JSON
openspec status --change add-dark-mode --json
```

**輸出（文字）：**

```
變更：add-dark-mode
架構：spec-driven
進度：2/4 個工件完成

[x] proposal
[ ] design
[x] specs
[-] tasks (被 design 阻塞)
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

取得用於建立工件或套用任務的豐富化指令。AI 代理使用它來理解下一步要建立什麼。

```
openspec instructions [artifact] [options]
```

**參數：**

| 參數 | 必要 | 描述 |
|----------|----------|-------------|
| `artifact` | 否 | 工件 ID：`proposal`、`specs`、`design`、`tasks` 或 `apply` |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--change <id>` | 變更名稱（在非互動模式中必要） |
| `--schema <name>` | 架構覆寫 |
| `--json` | 以 JSON 格式輸出 |

**特殊情況：** 使用 `apply` 作為工件，以取得任務實作指令。

**範例：**

```bash
# 取得下一個工件的指令
openspec instructions --change add-dark-mode

# 取得特定工件的指令
openspec instructions design --change add-dark-mode

# 取得套用/實作指令
openspec instructions apply --change add-dark-mode

# 用於代理消費的 JSON
openspec instructions design --change add-dark-mode --json
```

**輸出包含：**

- 工件的範本內容
- 來自設定的專案上下文
- 來自相依工件的內容
- 來自設定的每個工件規則

---

### `openspec templates`

顯示架構中所有工件的已解析範本路徑。

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

# 用於程式化使用的 JSON
openspec templates --json
```

**輸出（文字）：**

```
架構：spec-driven

範本：
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

列出可用的工作流程架構及其描述和工件流程。

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
可用的架構：

  spec-driven (package)
    預設的規格驅動開發工作流程
    流程：proposal → specs → design → tasks

  my-custom (project)
    此專案的自訂工作流程
    流程：research → proposal → tasks
```

---

## 配置方案指令

用於建立和管理工作流程配置方案的指令。

### `openspec schema init`

建立一個新的專案專屬配置方案。

```
openspec schema init <name> [options]
```

**參數：**

| 參數 | 必要 | 描述 |
|----------|----------|-------------|
| `name` | 是 | 配置方案名稱（連字號分隔格式） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--description <text>` | 配置方案描述 |
| `--artifacts <list>` | 以逗號分隔的產出物 ID（預設值：`proposal,specs,design,tasks`） |
| `--default` | 設定為專案預設配置方案 |
| `--no-default` | 不提示設定為預設值 |
| `--force` | 覆寫現有的配置方案 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 互動式建立配置方案
openspec schema init research-first

# 非互動式並指定特定產出物
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**建立的內容：**

```
openspec/schemas/<name>/
├── schema.yaml           # 配置方案定義
└── templates/
    ├── proposal.md       # 每個產出物的範本
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

將現有的配置方案複製到您的專案中進行自訂。

```
openspec schema fork <source> [name] [options]
```

**參數：**

| 參數 | 必要 | 描述 |
|----------|----------|-------------|
| `source` | 是 | 要複製的配置方案 |
| `name` | 否 | 新配置方案名稱（預設值：`<source>-custom`） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--force` | 覆寫現有的目標位置 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 分叉內建的規格驅動配置方案
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

驗證配置方案的結構與範本。

```
openspec schema validate [name] [options]
```

**參數：**

| 參數 | 必要 | 描述 |
|----------|----------|-------------|
| `name` | 否 | 要驗證的配置方案（若省略則驗證所有） |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--verbose` | 顯示詳細的驗證步驟 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 驗證特定的配置方案
openspec schema validate my-workflow

# 驗證所有配置方案
openspec schema validate
```

---

### `openspec schema which`

顯示配置方案的解析來源（有助於調試優先順序）。

```
openspec schema which [name] [options]
```

**參數：**

| 參數 | 必要 | 描述 |
|----------|----------|-------------|
| `name` | 否 | 配置方案名稱 |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--all` | 列出所有配置方案及其來源 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# 檢查配置方案的來源
openspec schema which spec-driven
```

**輸出：**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**配置方案優先順序：**

1. 專案：`openspec/schemas/<name>/`
2. 使用者：`~/.local/share/openspec/schemas/<name>/`
3. 套件：內建配置方案

---

## 設定指令

### `openspec config`

檢視和修改全域 OpenSpec 設定。

```
openspec config <subcommand> [options]
```

**子指令：**

| 子指令 | 描述 |
|------------|-------------|
| `path` | 顯示設定檔位置 |
| `list` | 顯示所有目前設定 |
| `get <key>` | 取得特定值 |
| `set <key> <value>` | 設定值 |
| `unset <key>` | 移除鍵值 |
| `reset` | 重設為預設值 |
| `edit` | 在 `$EDITOR` 中開啟 |
| `profile [preset]` | 互動式或透過預設值設定工作流程設定檔 |

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

# 使用基於動作的精靈設定設定檔
openspec config profile

# 快速預設值：將工作流程切換為核心（保留交付模式）
openspec config profile core
```

`openspec config profile` 會先顯示目前狀態摘要，然後讓您選擇：
- 變更交付模式 + 工作流程
- 僅變更交付模式
- 僅變更工作流程
- 保留目前設定（結束）

如果您選擇保留目前設定，則不會寫入任何變更，也不會顯示更新提示。
如果設定沒有變更，但目前的專案檔案與您的全域設定檔/交付模式不同步，OpenSpec 會顯示警告並建議執行 `openspec update`。
按下 `Ctrl+C` 也會乾淨地取消流程（不會顯示堆疊追蹤），並以代碼 `130` 結束。
在工作流程清單中，`[x]` 表示該工作流程已在全域設定中選取。若要將這些選取套用至專案檔案，請執行 `openspec update`（或在專案內提示時選擇 `Apply changes to this project now?`）。

**互動式範例：**

```bash
# 僅更新交付模式
openspec config profile
# 選擇：Change delivery only
# 選擇交付模式：Skills only

# 僅更新工作流程
openspec config profile
# 選擇：Change workflows only
# 在清單中切換工作流程，然後確認
```

---

## 實用工具指令

### `openspec feedback`

提交關於 OpenSpec 的回饋。會建立一個 GitHub issue。

```
openspec feedback <message> [options]
```

**參數：**

| 參數 | 必要 | 描述 |
|----------|----------|-------------|
| `message` | 是 | 回饋訊息 |

**選項：**

| 選項 | 描述 |
|--------|-------------|
| `--body <text>` | 詳細描述 |

**要求：** 必須安裝並驗證 GitHub CLI (`gh`)。

**範例：**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

管理 OpenSpec CLI 的 Shell 自動補全。

```
openspec completion <subcommand> [shell]
```

**子指令：**

| 子指令 | 描述 |
|------------|-------------|
| `generate [shell]` | 將補全腳本輸出到標準輸出 |
| `install [shell]` | 為您的 Shell 安裝補全功能 |
| `uninstall [shell]` | 移除已安裝的補全功能 |

**支援的 Shell：** `bash`、`zsh`、`fish`、`powershell`

**範例：**

```bash
# 安裝補全功能（自動偵測 Shell）
openspec completion install

# 為特定 Shell 安裝
openspec completion install zsh

# 產生腳本以進行手動安裝
openspec completion generate bash > ~/.bash_completion.d/openspec

# 移除
openspec completion uninstall
```

---

## 結束代碼

| 代碼 | 意義 |
|------|---------|
| `0` | 成功 |
| `1` | 錯誤（驗證失敗、檔案遺失等） |

---

## 環境變數

| 變數 | 描述 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | 設為 `0` 以停用遙測 |
| `DO_NOT_TRACK` | 設為 `1` 以停用遙測（標準 DNT 訊號） |
| `OPENSPEC_CONCURRENCY` | 大量驗證的預設並行處理數（預設值：6） |
| `EDITOR` 或 `VISUAL` | 用於 `openspec config edit` 的編輯器 |
| `NO_COLOR` | 設定時停用彩色輸出 |

---

## 相關文件

- [指令](commands.md) - AI 斜線指令（`/opsx:propose`、`/opsx:apply` 等）
- [工作流程](workflows.md) - 常見模式與何時使用每個指令
- [自訂](customization.md) - 建立自訂配置方案與範本
- [快速入門](getting-started.md) - 首次設定指南