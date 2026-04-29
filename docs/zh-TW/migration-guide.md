# 遷移至 OPSX

本指南協助您從舊版 OpenSpec 工作流程過渡至 OPSX。此次遷移旨在確保過程順暢——您現有的工作成果將予以保留，而新系統則提供更高的靈活性。

## 有何變更？

OPSX 以流暢、基於操作的方式取代了舊有的階段鎖定工作流程。以下是關鍵的轉變：

| 方面 | 舊版 | OPSX |
|--------|--------|------|
| **指令** | `/openspec:proposal`、`/openspec:apply`、`/openspec:archive` | 預設：`/opsx:propose`、`/opsx:apply`、`/opsx:archive`（擴展工作流程指令可選） |
| **工作流程** | 一次性建立所有產出物 | 可增量建立或一次性建立——由您選擇 |
| **回溯修改** | 階段關卡限制較多 | 自然流暢——可隨時更新任何產出物 |
| **自訂性** | 固定結構 | 由 Schema 驅動，完全可自訂 |
| **設定** | 使用標記的 `CLAUDE.md` 加上 `project.md` | 整潔的設定位於 `openspec/config.yaml` |

**理念的轉變：** 工作並非線性。OPSX 不再假裝它是。

---

## 開始之前

### 您現有的工作是安全的

遷移過程的設計以保留為核心：

- **`openspec/changes/` 中的活躍變更** — 完全保留。您可以使用 OPSX 命令繼續它們。
- **已歸檔的變更** — 未被觸動。您的歷史記錄保持完整。
- **`openspec/specs/` 中的主要規格** — 未被觸動。這些是您的真實來源。
- **您在 CLAUDE.md、AGENTS.md 等文件中的內容** — 已保留。僅移除了 OpenSpec 標記區塊；您撰寫的所有內容都保留了下來。

### 什麼會被移除

僅限於被替換的 OpenSpec 管理文件：

| 項目 | 原因 |
|------|------|
| 遺留的斜線命令目錄/文件 | 被新的技能系統取代 |
| `openspec/AGENTS.md` | 已過時的工作流程觸發器 |
| `CLAUDE.md`、`AGENTS.md` 等文件中的 OpenSpec 標記 | 不再需要 |

**各工具的遺留命令位置**（範例——您的工具可能有所不同）：

- Claude Code：`.claude/commands/openspec/`
- Cursor：`.cursor/commands/openspec-*.md`
- Windsurf：`.windsurf/workflows/openspec-*.md`
- Cline：`.clinerules/workflows/openspec-*.md`
- Roo：`.roo/commands/openspec-*.md`
- GitHub Copilot：`.github/prompts/openspec-*.prompt.md`（僅限 IDE 擴充套件；Copilot CLI 不支援）
- 以及其他工具（Augment、Continue、Amazon Q 等）

遷移過程會偵測您已配置的工具，並清理其遺留文件。

移除清單可能看起來很長，但這些都是 OpenSpec 最初建立的文件。您自己的內容永遠不會被刪除。

### 需要您注意的事項

有一個文件需要手動遷移：

**`openspec/project.md`** — 此文件不會被自動刪除，因為它可能包含您撰寫的專案上下文。您需要：

1. 檢視其內容
2. 將有用的上下文移動到 `openspec/config.yaml`（請參閱下方指引）
3. 準備好後刪除該文件

**我們做出此變更的原因：**

舊的 `project.md` 是被動的——代理可能讀取它，也可能不讀取，或者忘記它讀取了什麼。我們發現其可靠性不一致。

新的 `config.yaml` 上下文會**主動注入到每個 OpenSpec 規劃請求中**。這意味著當 AI 建立工件時，您的專案慣例、技術棧和規則始終存在。可靠性更高。

**權衡取捨：**

由於上下文會注入到每個請求中，您會希望保持簡潔。專注於真正重要的內容：
- 技術棧和關鍵慣例
- AI 需要知道的非顯而易見的限制
- 以前經常被忽略的規則

不必擔心做到完美。我們仍在學習什麼是最有效的，並且會在實驗中改進上下文注入的方式。

---

## 執行遷移

`openspec init` 和 `openspec update` 都會偵測遺留文件並引導您完成相同的清理過程。根據您的情況選擇使用：

- 新安裝預設使用 `core` 設定檔（`propose`、`explore`、`apply`、`archive`）。
- 已遷移的安裝會保留您先前安裝的工作流程，並在需要時寫入 `custom` 設定檔。

### 使用 `openspec init`

如果您想新增工具或重新配置已設定的工具，請執行此命令：

```bash
openspec init
```

init 命令會偵測遺留文件並引導您完成清理：

```
升級到新的 OpenSpec

OpenSpec 現在使用代理技能，這是跨編碼代理的新興標準。這簡化了您的設定，同時保持一切如常運作。

要移除的文件
無需保留的使用者內容：
  • .claude/commands/openspec/
  • openspec/AGENTS.md

要更新的文件
OpenSpec 標記將被移除，您的內容將被保留：
  • CLAUDE.md
  • AGENTS.md

需要您注意
  • openspec/project.md
    我們不會刪除此文件。它可能包含有用的專案上下文。

    新的 openspec/config.yaml 有一個 "context:" 區段用於規劃上下文。這會包含在每個 OpenSpec 請求中，比舊的 project.md 方法更可靠。

    檢視 project.md，將任何有用的內容移動到 config.yaml 的 context 區段，然後在準備好時刪除該文件。

? 升級並清理遺留文件？ (Y/n)
```

**當您選擇「是」時會發生什麼：**

1. 遺留的斜線命令目錄被移除
2. OpenSpec 標記從 `CLAUDE.md`、`AGENTS.md` 等文件中被剝離（您的內容保留）
3. `openspec/AGENTS.md` 被刪除
4. 新技能安裝在 `.claude/skills/`
5. `openspec/config.yaml` 使用預設架構建立

### 使用 `openspec update`

如果您只想遷移並更新現有工具到最新版本，請執行此命令：

```bash
openspec update
```

update 命令也會偵測並清理遺留工件，然後刷新生成的技能/命令以符合您目前的設定檔和交付設定。

### 非互動式 / CI 環境

對於腳本化遷移：

```bash
openspec init --force --tools claude
```

`--force` 標誌會跳過提示並自動接受清理。

---

## 將 project.md 遷移到 config.yaml

舊的 `openspec/project.md` 是一個自由格式的 markdown 文件，用於專案上下文。新的 `openspec/config.yaml` 是結構化的，並且——關鍵是——**注入到每個規劃請求中**，因此當 AI 工作時，您的慣例始終存在。

### 之前 (project.md)

```markdown
# 專案上下文

這是一個使用 React 和 Node.js 的 TypeScript 單體倉庫。
我們使用 Jest 進行測試並遵循嚴格的 ESLint 規則。
我們的 API 是 RESTful 的，並在 docs/api.md 中有文件記錄。

## 慣例

- 所有公開 API 必須保持向後相容性
- 新功能應包含測試
- 規格使用 Given/When/Then 格式
```

### 之後 (config.yaml)

```yaml
schema: spec-driven

context: |
  技術棧：TypeScript、React、Node.js
  測試：Jest 搭配 React Testing Library
  API：RESTful，文件記錄在 docs/api.md
  我們為所有公開 API 維持向後相容性

rules:
  proposal:
    - 為有風險的變更包含回滾計畫
  specs:
    - 場景使用 Given/When/Then 格式
    - 在發明新模式前參考現有模式
  design:
    - 為複雜流程包含序列圖
```

### 主要差異

| project.md | config.yaml |
|------------|-------------|
| 自由格式 markdown | 結構化 YAML |
| 一大段文字 | 分開的上下文和每個工件的規則 |
| 不清楚何時被使用 | 上下文出現在所有工件中；規則僅出現在匹配的工件中 |
| 無架構選擇 | 明確的 `schema:` 欄位設定預設工作流程 |

### 保留什麼，捨棄什麼

遷移時，要有選擇性。問自己：「AI 是否需要這個來進行*每個*規劃請求？」

**適合放入 `context:` 的候選項目**
- 技術棧（語言、框架、資料庫）
- 關鍵架構模式（單體倉庫、微服務等）
- 非顯而易見的限制（「我們不能使用 X 函式庫，因為...」）
- 經常被忽略的關鍵慣例

**改為移至 `rules:`**
- 特定於工件的格式（「在規格中使用 Given/When/Then」）
- 審查標準（「提案必須包含回滾計畫」）
- 這些僅出現在匹配的工件中，使其他請求更輕量

**完全省略**
- AI 已經知道的一般最佳實踐
- 可以總結的冗長解釋
- 不影響當前工作的歷史背景

### 遷移步驟

1. **建立 config.yaml**（如果尚未由 init 建立）：
   ```yaml
   schema: spec-driven
   ```

2. **新增您的上下文**（保持簡潔——這會進入每個請求）：
   ```yaml
   context: |
     您的專案背景放在這裡。
     專注於 AI 真正需要知道的內容。
   ```

3. **新增每個工件的規則**（可選）：
   ```yaml
   rules:
     proposal:
       - 您的提案特定指引
     specs:
       - 您的規格撰寫規則
   ```

4. **刪除 project.md**，一旦您移動了所有有用的內容。

**不要想太多。** 從基本要素開始，然後迭代。如果您注意到 AI 遺漏了重要內容，就添加它。如果上下文感覺臃腫，就修剪它。這是一個活的文件。

### 需要幫助嗎？使用此提示

如果您不確定如何提煉您的 project.md，請詢問您的 AI 助手：

```
我正在將 OpenSpec 舊的 project.md 遷移到新的 config.yaml 格式。

以下是我目前的 project.md：
[貼上您的 project.md 內容]

請幫我建立一個 config.yaml，包含：
1. 一個簡潔的 `context:` 區段（這會注入到每個規劃請求中，所以保持緊湊——專注於技術棧、關鍵限制和經常被忽略的慣例）
2. 如果有任何內容是特定於工件的，則為特定工件添加 `rules:`（例如，「使用 Given/When/Then」應放在 specs 規則中，而不是全域上下文中）

省略任何 AI 模型已經知道的通用內容。毫不留情地追求簡潔。
```

AI 將幫助您識別哪些是必要的，哪些是可以修剪的。

---

## 新命令

命令可用性取決於設定檔：

**預設（`core` 設定檔）：**

| 命令 | 用途 |
|------|------|
| `/opsx:propose` | 建立變更並一步生成規劃工件 |
| `/opsx:explore` | 無結構地思考想法 |
| `/opsx:apply` | 實作 tasks.md 中的任務 |
| `/opsx:archive` | 完成並歸檔變更 |

**擴展工作流程（自訂選擇）：**

| 命令 | 用途 |
|------|------|
| `/opsx:new` | 開始一個新的變更腳手架 |
| `/opsx:continue` | 建立下一個工件（一次一個） |
| `/opsx:ff` | 快速前進——一次建立規劃工件 |
| `/opsx:verify` | 驗證實作是否符合規格 |
| `/opsx:sync` | 預覽/規格合併而不歸檔 |
| `/opsx:bulk-archive` | 一次歸檔多個變更 |
| `/opsx:onboard` | 引導式的端到端入門工作流程 |

使用 `openspec config profile` 啟用擴展命令，然後執行 `openspec update`。

### 從遺留命令映射

| 遺留命令 | OPSX 等效命令 |
|----------|---------------|
| `/openspec:proposal` | `/opsx:propose`（預設）或 `/opsx:new` 然後 `/opsx:ff`（擴展） |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新功能

這些功能是擴展工作流程命令集的一部分。

**細粒度工件建立：**
```
/opsx:continue
```
根據依賴關係一次建立一個工件。當您想審查每個步驟時使用此命令。

**探索模式：**
```
/opsx:explore
```
在提交變更之前，與夥伴一起思考想法。

---

## 理解新架構

### 從鎖定階段到流動模式

舊版工作流程強制線性推進：

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   規劃階段   │ ───► │   實作階段   │ ───► │   歸檔階段   │
│   PLANNING   │      │ IMPLEMENTING │      │   ARCHIVING  │
└──────────────┘      └──────────────┘      └──────────────┘

如果您在實作時發現設計有誤？
很遺憾，階段閘門機制讓您難以輕易回退。
```

OPSX 使用「動作」而非「階段」：

```
         ┌───────────────────────────────────────────────┐
         │           動作（非階段）                      │
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    任意順序                    │
         └───────────────────────────────────────────────┘
```

### 依賴關係圖

產物形成一個有向圖。依賴關係是「啟用者」而非「閘門」：

```
                        proposal
                       （根節點）
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        （需要：                     （需要：
         proposal）                   proposal）
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     （需要：
                     specs, design）
```

當您執行 `/opsx:continue` 時，它會檢查哪些產物已就緒，並提供下一個產物的選項。您也可以按任意順序建立多個就緒的產物。

### 技能 vs 指令

舊版系統使用特定工具的指令檔案：

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

技能可被多種 AI 編碼工具識別，並提供更豐富的元數據。

---

## 繼續現有變更

您進行中的變更可與 OPSX 指令無縫協作。

**有來自舊版工作流程的活躍變更嗎？**

```
/opsx:apply add-my-feature
```

OPSX 會讀取現有的產物，並從您離開的地方繼續。

**想為現有變更添加更多產物嗎？**

```
/opsx:continue add-my-feature
```

根據現有內容顯示哪些產物已就緒可建立。

**需要查看狀態嗎？**

```bash
openspec status --change add-my-feature
```

---

## 新的配置系統

### config.yaml 結構

```yaml
# 必填：新變更的預設架構
schema: spec-driven

# 選填：項目上下文（最大 50KB）
# 注入到所有產物指令中
context: |
  您的項目背景、技術棧、
  約定和限制條件。

# 選填：針對特定產物的規則
# 僅注入到匹配的產物中
rules:
  proposal:
    - 包含回滾計畫
  specs:
    - 使用 Given/When/Then 格式
  design:
    - 記錄備用策略
  tasks:
    - 拆分為最多 2 小時的區塊
```

### 架構解析

當確定使用哪個架構時，OPSX 會按以下順序檢查：

1. **CLI 標誌**：`--schema <name>`（最高優先級）
2. **變更元數據**：變更目錄中的 `.openspec.yaml`
3. **項目配置**：`openspec/config.yaml`
4. **預設值**：`spec-driven`

### 可用架構

| 架構 | 產物 | 最適用於 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | 大多數項目 |

列出所有可用架構：

```bash
openspec schemas
```

### 自訂架構

建立您自己的工作流程：

```bash
openspec schema init my-workflow
```

或複製現有的架構：

```bash
openspec schema fork spec-driven my-workflow
```

詳情請參閱 [自訂化](customization.md)。

---

## 疑難排解

### 「在非互動模式下偵測到舊版檔案」

您正在 CI 或非互動環境中執行。請使用：

```bash
openspec init --force
```

### 遷移後指令未顯示

重新啟動您的 IDE。技能會在啟動時被偵測。

### 「規則中出現未知的產物 ID」

檢查您的 `rules:` 鍵是否與架構的產物 ID 匹配：

- **spec-driven**：`proposal`、`specs`、`design`、`tasks`

執行以下指令查看有效的產物 ID：

```bash
openspec schemas --json
```

### 配置未生效

1. 確保檔案位於 `openspec/config.yaml`（而非 `.yml`）
2. 驗證 YAML 語法
3. 配置變更會立即生效——無需重新啟動

### project.md 未遷移

系統有意保留 `project.md`，因為它可能包含您的自訂內容。請手動檢查，將有用的部分移至 `config.yaml`，然後將其刪除。

### 想查看哪些內容會被清理嗎？

執行 init 但拒絕清理提示——您將看到完整的偵測摘要，且不會進行任何變更。

---

## 快速參考

### 遷移後的檔案結構

```
project/
├── openspec/
│   ├── specs/                    # 未變更
│   ├── changes/                  # 未變更
│   │   └── archive/              # 未變更
│   └── config.yaml               # 新增：項目配置
├── .claude/
│   └── skills/                   # 新增：OPSX 技能
│       ├── openspec-propose/     # 預設核心設定檔
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       └── ...                   # 擴充設定檔新增 new/continue/ff 等
├── CLAUDE.md                     # 已移除 OpenSpec 標記，保留您的內容
└── AGENTS.md                     # 已移除 OpenSpec 標記，保留您的內容
```

### 已移除的內容

- `.claude/commands/openspec/` — 已由 `.claude/skills/` 取代
- `openspec/AGENTS.md` — 已過時
- `openspec/project.md` — 請遷移至 `config.yaml`，然後刪除
- `CLAUDE.md`、`AGENTS.md` 等檔案中的 OpenSpec 標記區塊

### 指令速查表

```text
/opsx:propose      快速開始（預設核心設定檔）
/opsx:apply        實作任務
/opsx:archive      完成並歸檔

# 擴充工作流程（若已啟用）：
/opsx:new          建立變更骨架
/opsx:continue     建立下一個產物
/opsx:ff           建立規劃產物
```

---

## 取得協助

- **Discord**：[discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**：[github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **文件**：[docs/opsx.md](opsx.md) 以取得完整的 OPSX 參考