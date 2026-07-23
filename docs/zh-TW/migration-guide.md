# 遷移至 OPSX

本指南協助您從舊版 OpenSpec 工作流程遷移至 OPSX。遷移流程設計為無縫銜接——您既有的工作內容會完整保留，新系統也提供更高的靈活性。

## 有哪些變更？

OPSX 以流暢的行動導向模式，取代原本綁定階段的舊工作流程。主要差異如下：

| 項目 | 舊版 | OPSX |
|--------|--------|------|
| **指令** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | 預設：`/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive`（可選用擴充的工作流程指令） |
| **工作流程** | 一次性建立所有產物 | 可逐步建立或一次性建立，由您自行決定 |
| **回退機制** | 笨拙的階段關卡 | 非常直覺——可隨時更新任何產物 |
| **自訂性** | 固定結構 | 以 Schema 為驅動，可完全自訂 |
| **配置方式** | 含標記的 `CLAUDE.md` 與 `project.md` | `openspec/config.yaml` 中的簡潔配置 |

**核心理念轉變：** 工作流程並非線性。OPSX 不再假裝它是線性流程。

---

## 開始之前

### 你現有內容會完整保留

遷移流程以保留內容為首要設計目標：

- **`openspec/changes/` 中的進行中變更**——完整保留。你可以透過 OPSX 指令繼續這些變更。
- **已封存的變更**——不會更動。你的歷史紀錄會保持完整。
- **`openspec/specs/` 中的主要規格**——不會更動。這些是你的唯一可信來源。
- **你在 CLAUDE.md、AGENTS.md 等檔案中的內容**——會保留。僅會移除 OpenSpec 標記區塊；你撰寫的所有內容都會保留。

### 哪些內容會被移除

僅會移除正在被替換的 OpenSpec 管理檔案：

| 內容 | 原因 |
|------|------|
| 舊版斜線指令目錄/檔案 | 已被新的技能系統取代 |
| `openspec/AGENTS.md` | 已過時的工作流程觸發器 |
| CLAUDE.md、AGENTS.md 等檔案中的 OpenSpec 標記 | 已不再需要 |

**各工具的舊版指令位置**（範例——你使用的工具可能不同）：
- Claude Code：`.claude/commands/openspec/`
- Cursor：`.cursor/commands/openspec-*.md`
- Windsurf：`.windsurf/workflows/openspec-*.md`
- Cline：`.cinerules/workflows/openspec-*.md`
- Roo：`.roo/commands/openspec-*.md`
- GitHub Copilot：`.github/prompts/openspec-*.prompt.md`（僅 IDE 擴充套件支援；不適用於 Copilot CLI）
- Codex：OpenSpec 現在使用 `.codex/skills/openspec-*`；舊版清理僅針對 OpenSpec 允許清單中的提示檔名，位於 `$CODEX_HOME/prompts` 或 `~/.codex/prompts`，且僅在替代技能存在後才會移除。
- 其他工具（Augment、Continue、Amazon Q 等）

遷移程序會偵測你已設定的工具，並清理這些工具的舊版檔案。

這個移除清單看起來很長，但這些都是 OpenSpec 最初建立的檔案，你個人撰寫的內容永遠不會被刪除。

### 需要你注意的事項

有一個檔案需要手動遷移：

**`openspec/project.md`**——這個檔案不會被自動刪除，因為它可能包含你撰寫的專案背景資訊。你需要：
1. 檢視其內容
2. 將有用的背景資訊移至 `openspec/config.yaml`（請參考下方說明）
3. 準備好後刪除該檔案

**我們做出此變更的原因：**

舊版的 `project.md` 是被動的——代理程式可能讀取它、也可能不讀，甚至可能忘記讀過的內容。我們發現其可靠性不穩定。

新版 `config.yaml` 的背景資訊會**主動注入到每一份 OpenSpec 規劃請求中**。這代表你的專案慣例、技術堆疊和規則在 AI 建立產出物時永遠存在，可靠性更高。

**取捨之處：**

由於背景資訊會注入到每一份請求中，你必須保持簡潔。專注於真正重要的內容：
- 技術堆疊與核心慣例
- AI 需要知曉的非顯而易見的限制
- 過去經常被忽略的規則

不用擔心一開始就做到完美。我們仍在學習什麼方式最有效，並且會在實驗過程中持續優化背景資訊注入的運作方式。

---

## 執行遷移

`openspec init` 和 `openspec update` 兩個指令都能偵測舊版檔案，並引導你完成相同的清理流程。請根據你的情況選擇適合的指令：
- 新安裝預設使用 `core` 設定檔（包含 `propose`、`explore`、`apply`、sync、`archive` 指令）。
- 已遷移的安裝會在需要時寫入 `custom` 設定檔，保留你先前安裝的工作流程。

### 使用 `openspec init`

如果你想要新增工具，或重新設定要安裝的工具，請執行此指令：

```bash
openspec init
```

init 指令會偵測舊版檔案並引導你完成清理：

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**當你輸入 Y 確認時會發生的事：**
1. 舊版斜線指令目錄會被移除
2. 會從 `CLAUDE.md`、`AGENTS.md` 等檔案中移除 OpenSpec 標記（你的內容會保留）
3. `openspec/AGENTS.md` 會被刪除
4. 新技能會安裝到 `.claude/skills/` 目錄
5. 會建立帶有預設結構的 `openspec/config.yaml`

### 使用 `openspec update`

如果你只想遷移並將現有工具更新至最新版本，請執行此指令：

```bash
openspec update
```

update 指令同樣會偵測並清理舊版產出物，接著重新整理產生的技能/指令，使其符合你目前的設定檔與交付設定。

### 非互動式 / CI 環境

適用於腳本化遷移：

```bash
openspec init --force --tools claude
```

`--force` 參數會跳過提示，自動接受清理操作。

這包含清理全域 Codex 提示目錄中由 OpenSpec 管理的 Codex 提示檔案。清理僅針對 OpenSpec 允許清單中的舊版 Codex 提示檔名，且僅在替代用的 `.codex/skills/openspec-*` 技能存在後才會移除這些檔案，同時保留所有其他檔案。

---

## 將 project.md 遷移至 config.yaml

舊版的 `openspec/project.md` 是用於儲存專案背景資訊的自由格式 Markdown 檔案。新版 `openspec/config.yaml` 是結構化的，更重要的是——**會注入到每一份規劃請求中**，確保你的慣例在 AI 執行任務時永遠存在。

### 遷移前（project.md）

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### 遷移後（config.yaml）

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### 主要差異

| project.md | config.yaml |
|------------|-------------|
| 自由格式 Markdown | 結構化 YAML |
| 單一區塊的文字 | 背景資訊與各產出物專屬規則分離 |
| 使用時機不明確 | 背景資訊會出現在所有產出物中；規則僅出現在對應的產出物中 |
| 無結構選擇 | 明確的 `schema:` 欄位可設定預設工作流程 |

### 保留什麼、捨棄什麼

遷移時請保持篩選，問自己這個問題：「AI 在*每一份*規劃請求中都需要這份內容嗎？」

**適合放入 `context:` 的內容**
- 技術堆疊（語言、框架、資料庫）
- 核心架構模式（單體代码庫、微服務等）
- 非顯而易見的限制（例如「我們不能使用 X 函式庫，因為……」）
- 經常被忽略的重要慣例

**改為放入 `rules:`**
- 產出物專屬的格式規範（例如「規格文件中要使用 Given/When/Then 格式」）
- 審查標準（例如「提案必須包含回滾方案」）
- 這些內容僅會出現在對應的產出物中，能讓其他請求更輕量

**完全捨棄**
- AI 已經知曉的通用最佳實踐
- 可以摘要的冗長說明
- 不影響當前工作的歷史背景資訊

### 遷移步驟

1. **建立 config.yaml**（如果 init 尚未自動建立）：
   ```yaml
   schema: spec-driven
   ```

2. **加入你的背景資訊**（保持簡潔——這份內容會出現在每一份請求中）：
   ```yaml
   context: |
     Your project background goes here.
     Focus on what the AI genuinely needs to know.
   ```

3. **加入各產出物專屬規則**（選填）：
   ```yaml
   rules:
     proposal:
       - Your proposal-specific guidance
     specs:
       - Your spec-writing rules
   ```

4. **移動完所有有用內容後，刪除 project.md**。

**不用想得太複雜。** 先從核心內容開始，後續再逐步調整。如果你發現 AI 遺漏了重要資訊，就加入它；如果背景資訊過於冗長，就刪減內容。這是一份動態文件。

### 需要協助？使用這個提示詞

如果你不確定如何濃縮你的 project.md 內容，可以向你的 AI 助理提出以下請求：

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI 會協助你分辨哪些內容是必要的、哪些可以刪減。

---

## 新指令

指令的可用性取決於設定檔：

**預設（`core` 設定檔）：**

| 指令 | 用途 |
|---------|---------|
| `/opsx:propose` | 一步驟建立變更並生成規劃產出物 |
| `/opsx:explore` | 無結構地思考構想 |
| `/opsx:apply` | 實作 tasks.md 中的任務 |
| `/opsx:archive` | 完成並封存變更 |

**擴展工作流程（自訂選擇）：**

| 指令 | 用途 |
|---------|---------|
| `/opsx:new` | 建立新的變更骨架 |
| `/opsx:continue` | 建立下一個產出物（一次一個） |
| `/opsx:ff` | 快速前進——一次建立所有規劃產出物 |
| `/opsx:verify` | 驗證實作內容與規格一致 |
| `/opsx:sync` | 將差異規格合併至主規格 |
| `/opsx:bulk-archive` | 一次封存多個變更 |
| `/opsx:onboard` | 引導式端到端入門工作流程 |

請使用 `openspec config profile` 啟用擴展指令，接著執行 `openspec update`。

### 舊版指令對照

| 舊版指令 | OPSX 對應指令 |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose`（預設）或 `/opsx:new` 後接 `/opsx:ff`（擴展模式） |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新功能

這些功能屬於擴展工作流程指令集的一部分。

**細粒度產出物建立：**
```
/opsx:continue
```
根據相依性一次建立一個產出物。當你想要逐步驟審查時使用此指令。

**探索模式：**
```
/opsx:explore
```
在確立變更前，與合作夥伴一起思考構想。

---

## 瞭解新架構

### 從階段鎖定到彈性流程

舊版工作流程強制線性推進：

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
```

OPSX 使用動作，而非階段：

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### 相依性圖表

產出物會形成有向圖。相依性是啟用條件，而非關卡：

```
                        proposal
                       (root node)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requires:                  (requires:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requires:
                     specs, design)
```

當你執行 `/opsx:continue` 時，它會檢查哪些產出物已準備好，並提供下一個可建立的產出物。你也可以依任意順序建立多個已準備好的產出物。

### 技能與指令的差異

舊版系統使用工具專屬的指令檔案：

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX 採用逐漸普及的**技能（skills）**標準：

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

技能在眾多 AI 編程工具中都被辨識，且提供更豐富的元資料。

在 OPSX 中，Codex 僅支援技能模式。OpenSpec 不再產生 Codex 自訂提示檔案；請改用產生的 `.codex/skills/openspec-*` 目錄。

## 延續進行中的變更

你正在進行的變更可與 OPSX 指令無縫協作。

**有來自舊版工作流程的進行中變更？**
```
/opsx:apply add-my-feature
```
OPSX 會讀取既有產出物，從你上次中斷的位置繼續。

**想要為既有變更新增更多產出物？**
```
/opsx:continue add-my-feature
```
會根據既有的內容顯示可建立的產出物。

**需要查看狀態？**
```bash
openspec status --change add-my-feature
```

---

## 全新設定檔系統

### config.yaml 結構

```yaml
# 必要：新變更的預設綱要
schema: spec-driven

# 選用：專案上下文（最大 50KB）
# 會注入到所有產出物說明中
context: |
  Your project background, tech stack,
  conventions, and constraints.

# 選用：各產出物專屬規則
# 僅注入到對應的產出物中
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### 綱要解析規則

決定要使用的綱要時，OPSX 會依序檢查以下項目：

1. **CLI 參數**：`--schema <名稱>`（優先級最高）
2. **變更中繼資料**：變更目錄中的 `.openspec.yaml`
3. **專案設定檔**：`openspec/config.yaml`
4. **預設值**：`spec-driven`

### 可用綱要

| 綱要 | 產出物 | 適用場景 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | 大多數專案 |

列出所有可用綱要：

```bash
openspec schemas
```

### 自訂綱要

建立自己的工作流程：

```bash
openspec schema init my-workflow
```

或基於既有綱要衍生：

```bash
openspec schema fork spec-driven my-workflow
```

詳情請見 [自訂設定](customization.md)。

---

## 疑難排解

### 「非互動模式下偵測到舊版檔案」

你正在 CI 或非互動環境中執行。請使用：

```bash
openspec init --force
```

### 遷移後指令未顯示

重新啟動你的 IDE。技能會在啟動時被偵測。

### 「rules 中包含未知的產出物 ID」

請確認你的 `rules:` 鍵值與所用綱要的產出物 ID 一致：
- **spec-driven**：`proposal`、`specs`、`design`、`tasks`

執行以下指令查看有效的產出物 ID：

```bash
openspec schemas --json
```

### 設定檔未生效

1. 確認檔案路徑為 `openspec/config.yaml`（而非 `.yml`）
2. 驗證 YAML 語法是否正確
3. 設定檔修改會立即生效，不需要重新啟動

### project.md 未遷移

系統會刻意保留 `project.md`，因為其中可能包含你的自訂內容。請手動檢視、將有用的部分移至 `config.yaml`，再刪除該檔案。

### 想要查看哪些內容會被清理？

執行 init 並拒絕清理提示，即可看到完整的偵測摘要，且不會進行任何修改。

---

## 快速參考

### 遷移後的檔案結構

```
project/
├── openspec/
│   ├── specs/                    # 未變更
│   ├── changes/                  # 未變更
│   │   └── archive/              # 未變更
│   └── config.yaml               # 新增：專案設定檔
├── .claude/
│   └── skills/                   # 新增：OPSX 技能
│       ├── openspec-propose/     # 預設核心設定檔
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # 擴充設定檔會新增 new/continue/ff 等指令
├── CLAUDE.md                     # 已移除 OpenSpec 標記，你的內容會保留
└── AGENTS.md                     # 已移除 OpenSpec 標記，你的內容會保留
```

### 已移除的項目

- `.claude/commands/openspec/` → 已由 `.claude/skills/` 取代
- `openspec/AGENTS.md` → 已廢棄
- `openspec/project.md` → 請遷移至 `config.yaml` 後刪除
- `CLAUDE.md`、`AGENTS.md` 等檔案中的 OpenSpec 標記區塊

### 指令速查表

```text
/opsx:propose      快速開始（預設核心設定檔）
/opsx:apply       執行任務
/opsx:archive     完成並封存

# 擴充工作流程（若已啟用）：
/opsx:new         建立變更框架
/opsx:continue    建立下一個產出物
/opsx:ff          建立規劃產出物
```

---

## 取得協助

- **Discord**：[discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**：[github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **官方文件**：[docs/opsx.md](opsx.md) 可查閱完整的 OPSX 參考說明