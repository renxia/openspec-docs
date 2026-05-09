# 遷移至 OPSX

本指南協助您從舊版 OpenSpec 工作流程過渡至 OPSX。此遷移過程設計順暢——您現有的工作成果將被保留，而新系統提供更高的靈活性。

## 主要變更

OPSX 以流暢、基於操作的方式取代了舊有的固定階段工作流程。以下是關鍵轉變：

| 方面 | 舊版 | OPSX |
|--------|--------|------|
| **指令** | `/openspec:proposal`、`/openspec:apply`、`/openspec:archive` | 預設：`/opsx:propose`、`/opsx:apply`、`/opsx:sync`、`/opsx:archive`（可選用擴展工作流程指令） |
| **工作流程** | 一次性建立所有產出物 | 可增量建立或一次性建立——由您選擇 |
| **回溯修改** | 需通過尷尬的階段關卡 | 自然流暢——隨時可更新任何產出物 |
| **自訂性** | 固定結構 | 由結構描述驅動，完全可自訂 |
| **配置方式** | `CLAUDE.md` 加上標記 + `project.md` | 簡潔配置於 `openspec/config.yaml` |

**理念轉變：** 工作並非線性進行。OPSX 不再假裝它是。

---

## 開始之前

### 您現有的工作是安全的

遷移過程的設計以保留為首要考量：

- **`openspec/changes/` 中的進行中變更** — 完全保留。您可以繼續使用 OPSX 命令處理它們。
- **已歸檔的變更** — 未受影響。您的歷史記錄保持完整。
- **`openspec/specs/` 中的主要規格** — 未受影響。這些是您的真實來源。
- **您在 CLAUDE.md、AGENTS.md 等檔案中的內容** — 已保留。僅移除了 OpenSpec 標記區塊；您撰寫的所有內容都會保留。

### 會被移除的內容

僅限正在被替換的、由 OpenSpec 管理的檔案：

| 項目 | 原因 |
|------|-----|
| 舊版斜線命令目錄/檔案 | 由新的技能系統取代 |
| `openspec/AGENTS.md` | 已過時的工作流程觸發器 |
| `CLAUDE.md`、`AGENTS.md` 等檔案中的 OpenSpec 標記 | 不再需要 |

**按工具列出的舊版命令位置**（範例——您的工具可能有所不同）：

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md`（僅限 IDE 擴充功能；Copilot CLI 不支援）
- 以及其他（Augment、Continue、Amazon Q 等）

遷移過程會偵測您已配置的工具，並清理其舊版檔案。

移除清單可能看起來很長，但這些都是 OpenSpec 最初建立的檔案。您自己的內容絕不會被刪除。

### 需要您注意的事項

有一個檔案需要手動遷移：

**`openspec/project.md`** — 此檔案不會自動刪除，因為它可能包含您撰寫的專案上下文。您需要：

1. 檢視其內容
2. 將有用的上下文移至 `openspec/config.yaml`（請參閱下方指引）
3. 準備好後刪除該檔案

**我們做出此變更的原因：**

舊的 `project.md` 是被動的——代理程式可能會讀取它，也可能不會，也可能讀了就忘。我們發現其可靠性並不一致。

新的 `config.yaml` 上下文會**主動注入到每個 OpenSpec 規劃請求中**。這意味著當 AI 在建立產出物時，您的專案慣例、技術堆疊和規則總是存在的。可靠性更高。

**權衡取捨：**

由於上下文會注入到每個請求中，您會希望保持簡潔。專注於真正重要的事項：
- 技術堆疊和關鍵慣例
- AI 需要知道的非顯而易見的約束條件
- 以前經常被忽略的規則

不用擔心做到完美。我們仍在學習什麼最有效，並且會隨著實驗改進上下文注入的工作方式。

---

## 執行遷移

`openspec init` 和 `openspec update` 都會偵測舊版檔案，並引導您完成相同的清理過程。根據您的情況選擇使用：

- 全新安裝預設使用 `core` 設定檔（`propose`、`explore`、`apply`、`sync`、`archive`）。
- 遷移的安裝會在需要時寫入 `custom` 設定檔，以保留您先前安裝的工作流程。

### 使用 `openspec init`

如果您想新增工具或重新配置要設定的工具，請執行此命令：

```bash
openspec init
```

init 命令會偵測舊版檔案並引導您完成清理：

```
升級至新版 OpenSpec

OpenSpec 現在使用代理程式技能，這是跨編碼代理程式的
新興標準。這簡化了您的設定，同時保持一切運作如常。

待移除的檔案
無需保留的使用者內容：
  • .claude/commands/openspec/
  • openspec/AGENTS.md

待更新的檔案
將移除 OpenSpec 標記，您的內容將被保留：
  • CLAUDE.md
  • AGENTS.md

需要您注意的事項
  • openspec/project.md
    我們不會刪除此檔案。它可能包含有用的專案上下文。

    新的 openspec/config.yaml 有一個 "context:" 區段用於規劃
    上下文。這會包含在每個 OpenSpec 請求中，比舊的
    project.md 方法更可靠。

    檢視 project.md，將任何有用的內容移至 config.yaml 的 context
    區段，然後在準備好後刪除該檔案。

? 升級並清理舊版檔案？ (Y/n)
```

**當您選擇「是」時會發生什麼：**

1. 移除舊版斜線命令目錄
2. 從 `CLAUDE.md`、`AGENTS.md` 等檔案中移除 OpenSpec 標記（您的內容保留）
3. 刪除 `openspec/AGENTS.md`
4. 新技能安裝在 `.claude/skills/`
5. 使用預設結構描述建立 `openspec/config.yaml`

### 使用 `openspec update`

如果您只想遷移並將現有工具刷新到最新版本，請執行此命令：

```bash
openspec update
```

update 命令也會偵測並清理舊版產出物，然後根據您目前的設定檔和交付設定刷新產生的技能/命令。

### 非互動式 / CI 環境

用於腳本化遷移：

```bash
openspec init --force --tools claude
```

`--force` 標誌會跳過提示並自動接受清理。

---

## 將 project.md 遷移至 config.yaml

舊的 `openspec/project.md` 是一個用於專案上下文的自由格式 Markdown 檔案。新的 `openspec/config.yaml` 是結構化的，並且——關鍵是——**注入到每個規劃請求中**，因此當 AI 工作時，您的慣例總是存在的。

### 遷移前 (project.md)

```markdown
# 專案上下文

這是一個使用 React 和 Node.js 的 TypeScript 單一存放庫。
我們使用 Jest 進行測試並遵循嚴格的 ESLint 規則。
我們的 API 是 RESTful 的，並記錄在 docs/api.md 中。

## 慣例

- 所有公開 API 必須維護向後相容性
- 新功能應包含測試
- 規格使用 Given/When/Then 格式
```

### 遷移後 (config.yaml)

```yaml
schema: spec-driven

context: |
  技術堆疊：TypeScript、React、Node.js
  測試：Jest 搭配 React Testing Library
  API：RESTful，記錄在 docs/api.md 中
  我們為所有公開 API 維護向後相容性

rules:
  proposal:
    - 包含高風險變更的回滾計畫
  specs:
    - 情境使用 Given/When/Then 格式
    - 在發明新模式之前先參考現有模式
  design:
    - 複雜流程包含序列圖
```

### 主要差異

| project.md | config.yaml |
|------------|-------------|
| 自由格式的 Markdown | 結構化的 YAML |
| 一大段文字 | 分開的上下文和每個產出物的規則 |
| 不清楚何時使用 | 上下文出現在所有產出物中；規則僅出現在對應的產出物中 |
| 無結構描述選擇 | 顯式的 `schema:` 欄位設定預設工作流程 |

### 保留什麼，丟棄什麼

遷移時要有選擇性。問問自己：「AI 在*每個*規劃請求中都需要這個嗎？」

**適合放入 `context:` 的候選項目：**
- 技術堆疊（語言、框架、資料庫）
- 關鍵架構模式（單一存放庫、微服務等）
- 非顯而易見的約束條件（「我們不能使用 X 函式庫，因為...」）
- 經常被忽略的關鍵慣例

**改為移至 `rules:`**
- 產出物特定的格式（「規格使用 Given/When/Then」）
- 審查標準（「提案必須包含回滾計畫」）
- 這些僅出現在對應的產出物中，讓其他請求更輕量

**完全省略**
- AI 已經知道的通用最佳實踐
- 可以總結的冗長解釋
- 不影響當前工作的歷史上下文

### 遷移步驟

1. **建立 config.yaml**（如果尚未由 init 建立）：
   ```yaml
   schema: spec-driven
   ```

2. **新增您的上下文**（保持簡潔——這會進入每個請求）：
   ```yaml
   context: |
     您的專案背景寫在這裡。
     專注於 AI 真正需要知道的內容。
   ```

3. **新增每個產出物的規則**（可選）：
   ```yaml
   rules:
     proposal:
       - 您的提案特定指引
     specs:
       - 您的規格撰寫規則
   ```

4. **刪除 project.md** 一旦您移動了所有有用的內容。

**不要想太多。** 從基本要素開始並迭代。如果您發現 AI 遺漏了重要內容，就新增它。如果上下文感覺臃腫，就修剪它。這是一個動態的文件。

### 需要幫助？使用此提示

如果您不確定如何提煉您的 project.md，請詢問您的 AI 助理：

```
我正在從 OpenSpec 舊的 project.md 遷移到新的 config.yaml 格式。

這是我目前的 project.md：
[貼上您的 project.md 內容]

請幫助我建立一個 config.yaml，包含：
1. 一個簡潔的 `context:` 區段（這會注入到每個規劃請求中，所以保持緊湊——專注於技術堆疊、關鍵約束和經常被忽略的慣例）
2. 如果任何內容是產出物特定的，則為特定產出物設定 `rules:`（例如，「使用 Given/When/Then」應屬於規格規則，而非全域上下文）

省略 AI 模型已知的任何通用內容。對簡潔性要嚴格要求。
```

AI 會幫助您區分什麼是必要的，什麼可以修剪。

---

## 新命令

命令可用性取決於設定檔：

**預設（`core` 設定檔）：**

| 命令 | 用途 |
|---------|---------|
| `/opsx:propose` | 一步建立變更並產生規劃產出物 |
| `/opsx:explore` | 無結構地思考想法 |
| `/opsx:apply` | 實作 tasks.md 中的任務 |
| `/opsx:archive` | 最終確定並歸檔變更 |

**擴展工作流程（自訂選擇）：**

| 命令 | 用途 |
|---------|---------|
| `/opsx:new` | 開始一個新的變更支架 |
| `/opsx:continue` | 建立下一個產出物（一次一個） |
| `/opsx:ff` | 快速前進——一次建立規劃產出物 |
| `/opsx:verify` | 驗證實作是否符合規格 |
| `/opsx:sync` | 將差異規格合併到主要規格中 |
| `/opsx:bulk-archive` | 一次歸檔多個變更 |
| `/opsx:onboard` | 引導式端到端入門工作流程 |

使用 `openspec config profile` 啟用擴展命令，然後執行 `openspec update`。

### 與舊版的命令對應關係

| 舊版 | OPSX 對應 |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose`（預設）或 `/opsx:new` 然後 `/opsx:ff`（擴展） |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新功能

這些功能是擴展工作流程命令集的一部分。

**細粒度產出物建立：**
```
/opsx:continue
```
根據相依性一次建立一個產出物。當您想逐步審查時使用此命令。

**探索模式：**
```
/opsx:explore
```
在承諾變更之前，與合作夥伴一起思考想法。

---

## 理解新架構

### 從階段鎖定到流體式

舊版工作流程強制線性推進：

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   規劃階段   │ ───► │   實作階段   │ ───► │   歸檔階段   │
└──────────────┘      └──────────────┘      └──────────────┘

如果你在實作階段發現設計有問題？
太糟了。階段關卡不會讓你輕易回頭。
```

OPSX 使用動作，而非階段：

```
         ┌───────────────────────────────────────────────┐
         │           動作（而非階段）                    │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    任意順序                   │
         └───────────────────────────────────────────────┘
```

### 依賴關係圖

產出物構成一個有向圖。依賴關係是啟用條件，而非關卡：

```
                        proposal
                       (根節點)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (需要：                      (需要：
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (需要：
                     specs, design)
```

當你執行 `/opsx:continue` 時，它會檢查哪些已就緒，並提供下一個產出物。你也可以按任意順序建立多個已就緒的產出物。

### 技能 vs 指令

舊版系統使用特定工具的指令檔：

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX 使用新興的 **技能** 標準：

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

技能在多個 AI 程式碼工具中都能被識別，並提供更豐富的元資料。

---

## 繼續進行中的變更

你正在進行的變更可以與 OPSX 指令無縫協作。

**有來自舊版工作流程的進行中變更嗎？**

```
/opsx:apply add-my-feature
```

OPSX 會讀取現有產出物，並從你上次中斷的地方繼續。

**想為現有變更多新增一些產出物嗎？**

```
/opsx:continue add-my-feature
```

根據已存在的內容，顯示可以建立哪些已就緒的產出物。

**需要查看狀態嗎？**

```bash
openspec status --change add-my-feature
```

---

## 新的配置系統

### config.yaml 結構

```yaml
# 必要：新變更的預設模式
schema: spec-driven

# 可選：專案背景（最大 50KB）
# 會注入到所有產出物的說明中
context: |
  你的專案背景、技術堆疊、
  慣例與限制條件。

# 可選：每個產出物的規則
# 僅注入到相符的產出物中
rules:
  proposal:
    - 包含回滾計畫
  specs:
    - 使用 Given/When/Then 格式
  design:
    - 記錄備援策略
  tasks:
    - 拆分為最多 2 小時的區塊
```

### 模式解析

在決定使用哪種模式時，OPSX 會按以下順序檢查：

1. **CLI 標誌**：`--schema <name>`（最高優先級）
2. **變更元資料**：變更目錄中的 `.openspec.yaml`
3. **專案配置**：`openspec/config.yaml`
4. **預設值**：`spec-driven`

### 可用模式

| 模式 | 產出物 | 最適用於 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | 大多數專案 |

列出所有可用模式：

```bash
openspec schemas
```

### 自訂模式

建立你自己的工作流程：

```bash
openspec schema init my-workflow
```

或複製現有模式：

```bash
openspec schema fork spec-driven my-workflow
```

詳情請參閱[自訂](customization.md)。

---

## 疑難排解

### "在非互動模式下偵測到舊版檔案"

你正在 CI 或非互動環境中執行。請使用：

```bash
openspec init --force
```

### 遷移後指令未出現

重新啟動你的 IDE。技能在啟動時被偵測。

### "規則中的未知產出物 ID"

檢查你的 `rules:` 鍵是否與你模式的產出物 ID 相符：

- **spec-driven**：`proposal`、`specs`、`design`、`tasks`

執行以下指令查看有效的產出物 ID：

```bash
openspec schemas --json
```

### 配置未被套用

1. 確認檔案位於 `openspec/config.yaml`（而非 `.yml`）
2. 驗證 YAML 語法
3. 配置變更會立即生效——無需重新啟動

### project.md 未被遷移

系統有意保留 `project.md`，因為它可能包含你的自訂內容。請手動檢視，將有用的部分移至 `config.yaml`，然後刪除它。

### 想看看哪些會被清理嗎？

執行 init 並拒絕清理提示——你將看到完整的偵測摘要，而不會進行任何變更。

---

## 快速參考

### 遷移後的檔案

```
project/
├── openspec/
│   ├── specs/                    # 未變更
│   ├── changes/                  # 未變更
│   │   └── archive/              # 未變更
│   └── config.yaml               # 新增：專案配置
├── .claude/
│   └── skills/                   # 新增：OPSX 技能
│       ├── openspec-propose/     # 預設核心設定檔
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # 擴充設定檔新增 new/continue/ff 等
├── CLAUDE.md                     # OpenSpec 標記已移除，你的內容已保留
└── AGENTS.md                     # OpenSpec 標記已移除，你的內容已保留
```

### 已移除的內容

- `.claude/commands/openspec/` — 被 `.claude/skills/` 取代
- `openspec/AGENTS.md` — 已過時
- `openspec/project.md` — 遷移至 `config.yaml`，然後刪除
- `CLAUDE.md`、`AGENTS.md` 等檔案中的 OpenSpec 標記區塊

### 指令速查表

```text
/opsx:propose      快速開始（預設核心設定檔）
/opsx:apply        實作任務
/opsx:archive      完成並歸檔

# 擴充工作流程（若已啟用）：
/opsx:new          建立變更腳手架
/opsx:continue     建立下一個產出物
/opsx:ff           建立規劃產出物
```

---

## 取得幫助

- **Discord**：[discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**：[github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **文件**：[docs/opsx.md](opsx.md) 獲取完整的 OPSX 參考資料