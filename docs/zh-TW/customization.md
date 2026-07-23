# 自訂

OpenSpec 提供三種自訂層級：

| 層級 | 作用 | 適用場景 |
|-------|--------------|----------|
| **專案配置** | 設定預設值、注入上下文與規則 | 大多數團隊 |
| **自訂架構** | 定義屬於自己的工作流產出物 | 有獨特流程的團隊 |
| **全域覆蓋** | 在所有專案間共享架構 | 進階使用者 |

---

## 專案配置

`openspec/config.yaml` 檔案是為團隊自訂 OpenSpec 最簡單的方式，可讓你：

- **設定預設架構** - 無需在每個指令都加上 `--schema` 參數
- **注入專案上下文** - AI 可識別你的技術棧、規範等資訊
- **為個別產出物新增規則** - 為特定產出物設定自訂規則

### 快速設定

```bash
openspec init
```

此指令會引導你互動式建立配置，也可以手動建立：

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### 運作方式

**預設架構：**

```bash
# 無配置時
openspec new change my-feature --schema spec-driven

# 加入配置後 - 架構會自動套用
openspec new change my-feature
```

**上下文與規則注入：**

生成任何產出物時，你的上下文與規則會被注入到 AI 提示詞中：

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[架構內建範本]
</template>
```

- **上下文** 會出現在所有產出物中
- **規則** 僅會出現在對應的產出物中

### 架構解析順序

當 OpenSpec 需要載入架構時，會依以下順序檢查：

1. CLI 參數：`--schema <name>`
2. 變更中繼資料（變更資料夾內的 `.openspec.yaml`）
3. 專案配置（`openspec/config.yaml`）
4. 預設值（`spec-driven`）

---

## 自訂架構

當專案配置無法滿足需求時，你可以建立完全自訂工作流的專屬架構。自訂架構會儲存在專案的 `openspec/schemas/` 目錄下，並與程式碼一起納入版本控制。

```text
your-project/
├── openspec/
│   ├── config.yaml        # 專案配置
│   ├── schemas/           # 自訂架構存放於此
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 你的變更
└── src/
```

### 複用既有架構

自訂架構最快的方式是複用內建架構進行修改：

```bash
openspec schema fork spec-driven my-workflow
```

這會將完整的 `spec-driven` 架構複製到 `openspec/schemas/my-workflow/` 目錄，你可以在該目錄下自由編輯。

**你會得到：**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # 工作流定義
└── templates/
    ├── proposal.md       # 提案產出物的範本
    ├── spec.md           # 規格書範本
    ├── design.md         # 設計文件範本
    └── tasks.md          # 任務清單範本
```

現在你可以編輯 `schema.yaml` 來修改工作流，或是編輯範本檔案來調整 AI 生成的內容。

### 從零建立架構

若需要全新的工作流，可執行：

```bash
# 互動模式
openspec schema init research-first

# 非互動模式
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### 架構結構

架構用於定義工作流中的產出物，以及它們之間的相依關係：

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # 必須先有提案才能建立設計

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**關鍵欄位：**

| 欄位 | 用途 |
|-------|---------|
| `id` | 唯一識別符，用於指令與規則中 |
| `generates` | 輸出檔名（支援萬用字元，例如 `specs/**/*.md`） |
| `template` | `templates/` 目錄下的範本檔案 |
| `instruction` | 建立此產出物時給 AI 的指令 |
| `requires` | 相依關係 - 哪些產出物必須先存在 |

### 範本

範本是引導 AI 的 Markdown 檔案，在建立對應產出物時會被注入到提示詞中。

```markdown
<!-- templates/proposal.md -->
## Why

<!-- 說明這項變更的動機，它解決了什麼問題？ -->

## What Changes

<!-- 描述會進行哪些變更，具體說明新增的功能或修改內容。 -->

## Impact

<!-- 受影響的程式碼、API、相依套件、系統 -->
```

範本可包含：
- AI 需要填寫的區塊標題
- 給 AI 的引導性 HTML 註解
- 顯示預期結構的範例格式

### 驗證你的架構

使用自訂架構前，請先進行驗證：

```bash
openspec schema validate my-workflow
```

驗證會檢查以下項目：
- `schema.yaml` 語法是否正確
- 所有參照的範本是否存在
- 是否存在循環相依
- 產出物 ID 是否有效

### 使用你的自訂架構

架構建立完成後，可透過以下方式使用：

```bash
# 在指令中指定
openspec new change feature --schema my-workflow

# 或在 config.yaml 中設為預設
schema: my-workflow
```

### 除錯架構解析

不確定目前使用的是哪個架構？可執行以下指令檢查：

```bash
# 查看特定架構的解析來源
openspec schema which my-workflow

# 列出所有可用架構
openspec schema which --all
```

執行結果會顯示架構來源是專案、使用者目錄還是套件本身：

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注意：** OpenSpec 同時支援使用者層級的架構，存放於 `~/.local/share/openspec/schemas/` 目錄，可跨專案共享；但建議使用 `openspec/schemas/` 下的專案層級架構，此類架構會與程式碼一起納入版本控制。

---

## 範例

### 快速迭代工作流

適合快速迭代的最小工作流：

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### 新增審閱產出物

複用預設架構並新增審閱步驟：

```bash
openspec schema fork spec-driven with-review
```

接著編輯 `schema.yaml` 並新增以下內容：

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... 既有任務配置 ...
    requires:
      - specs
      - design
      - review    # 現在任務也需先完成審閱
```

---

## 社群架構

OpenSpec 同時支援由社群維護、透過獨立倉庫分發的架構。這類架構提供帶有明確設計理念的工作流，可將 OpenSpec 與其他工具或系統整合，運作方式類似 [github/spec-kit 社群擴充目錄](https://github.com/github/spec-kit/tree/main/extensions) 為 spec-kit 提供的功能。

社群架構不會內嵌到 OpenSpec 核心中，而是各自存放在獨立倉庫，有各自的發佈節奏。要使用某個社群架構時，請將對應的架構包複製到專案的 `openspec/schemas/<schema-name>/` 目錄下（各倉庫的 README 都有安裝說明）。

| 架構名稱 | 維護者 | 倉庫 | 說明 |
|--------|-----------|-----------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | 整合 OpenSpec 的產出物治理機制與 [obra/superpowers](https://github.com/obra/superpowers) 的執行技能（腦力激盪、撰寫計畫、透過子代理執行 TDD、程式碼審閱、任務收尾）。新增了以證據為優先的 `retrospective` 產出物，補足了 Superpowers 原生未涵蓋的缺口。 |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | 以產品經理為核心的工作流。在實作流程上游執行 [nanopm](https://github.com/nmrtn/nanopm) 的規劃管線（稽核 → 策略 → 路線圖 → 產品需求文件），將產品規劃銜接至 OpenSpec 的規格驅動工程工作流。若存在 `.nanopm/` 目錄，則產出物會從中讀取資料：提案來源為稽核結果、設計來源為策略文件、任務來源為產品需求文件拆解。 |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | 功能層級的端對端測試執行手冊。每個功能都會有一份不可變的規格書、一份不可變的任務範本，以及每次執行對應的一筆帶時間戳的執行記錄。斷言僅使用可觀察的行為（HTTP 狀態碼、回應內容、持久化狀態，絕不使用日誌子字串）；每次執行會記錄開始/結束時間（UTC）、執行時間，以及最佳估算的 LLM 權杖耗用量。 |

> 想要貢獻社群架構？請開啟一個 issue 並附上你的倉庫連結，或是提交 PR 並在表格中新增一筆你的架構資料。

---

## 相關連結

- [CLI 參考：架構指令](cli.md#schema-commands) - 完整指令文件