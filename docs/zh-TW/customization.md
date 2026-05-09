# 自訂功能

OpenSpec 提供三個層級的自訂功能：

| 層級 | 功能說明 | 適用對象 |
|------|----------|----------|
| **專案配置** | 設定預設值、注入上下文/規則 | 大多數團隊 |
| **自訂架構** | 定義您自己的工作流程產出物 | 擁有獨特流程的團隊 |
| **全域覆寫** | 在所有專案間共享架構 | 進階使用者 |

---

## 專案配置

`openspec/config.yaml` 檔案是為您的團隊自訂 OpenSpec 最簡便的方式。它讓您可以：

- **設定預設架構** - 在每個指令中省略 `--schema` 參數
- **注入專案上下文** - AI 能看到您的技術堆疊、慣例等
- **新增每個產出物的規則** - 為特定產出物設定自訂規則

### 快速設定

```bash
openspec init
```

此指令會引導您以互動方式建立配置檔案。或者手動建立：

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  技術堆疊：TypeScript, React, Node.js, PostgreSQL
  API 風格：RESTful，文件記錄於 docs/api.md
  測試：Jest + React Testing Library
  我們重視所有公開 API 的向後相容性

rules:
  proposal:
    - 包含回滾計畫
    - 識別受影響的團隊
  specs:
    - 使用 Given/When/Then 格式
    - 在發明新模式之前，先參考現有模式
```

### 運作原理

**預設架構：**

```bash
# 沒有配置時
openspec new change my-feature --schema spec-driven

# 有配置時 - 架構自動套用
openspec new change my-feature
```

**上下文與規則注入：**

在生成任何產出物時，您的上下文和規則會被注入到 AI 的提示中：

```xml
<context>
技術堆疊：TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- 包含回滾計畫
- 識別受影響的團隊
</rules>

<template>
[架構內建的範本]
</template>
```

- **上下文** 會出現在所有產出物中
- **規則** 僅出現在對應的產出物中

### 架構解析順序

當 OpenSpec 需要一個架構時，它會按以下順序檢查：

1. CLI 旗標：`--schema <name>`
2. 變更元資料（變更資料夾中的 `.openspec.yaml`）
3. 專案配置（`openspec/config.yaml`）
4. 預設值（`spec-driven`）

---

## 自訂架構

當專案配置無法滿足需求時，您可以建立自己的架構，打造完全自訂的工作流程。自訂架構存放在您專案的 `openspec/schemas/` 目錄中，並與您的程式碼一起進行版本控制。

```text
your-project/
├── openspec/
│   ├── config.yaml        # 專案配置
│   ├── schemas/           # 自訂架構存放於此
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 您的變更
└── src/
```

### 複製現有架構

最快的自訂方式是複製一個內建架構：

```bash
openspec schema fork spec-driven my-workflow
```

這會將整個 `spec-driven` 架構複製到 `openspec/schemas/my-workflow/`，您可以在那裡自由編輯。

**您會得到：**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # 工作流程定義
└── templates/
    ├── proposal.md       # 提案產出物的範本
    ├── spec.md           # 規格的範本
    ├── design.md         # 設計的範本
    └── tasks.md          # 任務的範本
```

現在您可以編輯 `schema.yaml` 來更改工作流程，或編輯範本來更改 AI 生成的內容。

### 從頭建立架構

若要建立一個全新的工作流程：

```bash
# 互動式
openspec schema init research-first

# 非互動式
openspec schema init rapid \
  --description "快速迭代工作流程" \
  --artifacts "proposal,tasks" \
  --default
```

### 架構結構

一個架構定義了您工作流程中的產出物以及它們之間的相依關係：

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: 我的團隊的自訂工作流程

artifacts:
  - id: proposal
    generates: proposal.md
    description: 初始提案文件
    template: proposal.md
    instruction: |
      建立一份提案，說明為何需要此變更。
      著重於問題本身，而非解決方案。
    requires: []

  - id: design
    generates: design.md
    description: 技術設計
    template: design.md
    instruction: |
      建立一份設計文件，說明如何實作。
    requires:
      - proposal    # 在提案存在之前無法建立設計

  - id: tasks
    generates: tasks.md
    description: 實作檢查清單
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**關鍵欄位：**

| 欄位 | 用途 |
|------|------|
| `id` | 唯一識別碼，用於指令和規則 |
| `generates` | 輸出檔名（支援 glob 模式，如 `specs/**/*.md`） |
| `template` | `templates/` 目錄中的範本檔案 |
| `instruction` | AI 建立此產出物的指令 |
| `requires` | 相依性 - 哪些產出物必須先存在 |

### 範本

範本是引導 AI 的 Markdown 檔案。在建立該產出物時，它們會被注入到提示中。

```markdown
<!-- templates/proposal.md -->
## 為何

<!-- 說明此變更的動機。這解決了什麼問題？ -->

## 變更內容

<!-- 描述將會發生什麼變化。具體說明新功能或修改。 -->

## 影響

<!-- 受影響的程式碼、API、相依性、系統 -->
```

範本可以包含：
- AI 應填寫的章節標題
- 帶有 AI 指導方針的 HTML 註解
- 展示預期結構的範例格式

### 驗證您的架構

在使用自訂架構之前，請先驗證它：

```bash
openspec schema validate my-workflow
```

這會檢查：
- `schema.yaml` 語法是否正確
- 所有引用的範本是否存在
- 沒有循環相依性
- 產出物 ID 是否有效

### 使用您的自訂架構

建立完成後，使用您的架構：

```bash
# 在指令中指定
openspec new change feature --schema my-workflow

# 或在 config.yaml 中設為預設
schema: my-workflow
```

### 除錯架構解析

不確定正在使用哪個架構？使用以下指令檢查：

```bash
# 查看特定架構的解析來源
openspec schema which my-workflow

# 列出所有可用架構
openspec schema which --all
```

輸出會顯示它是來自您的專案、使用者目錄還是套件：

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注意：** OpenSpec 也支援使用者層級的架構，位於 `~/.local/share/openspec/schemas/`，可在不同專案間共享，但建議使用專案層級的架構（`openspec/schemas/`），因為它們會與您的程式碼一起進行版本控制。

---

## 範例

### 快速迭代工作流程

適用於快速迭代的最小化工作流程：

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: 以最小開銷進行快速迭代

artifacts:
  - id: proposal
    generates: proposal.md
    description: 快速提案
    template: proposal.md
    instruction: |
      為此變更建立一份簡要提案。
      著重於內容和原因，跳過詳細規格。
    requires: []

  - id: tasks
    generates: tasks.md
    description: 實作檢查清單
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### 新增審查產出物

複製預設架構並新增一個審查步驟：

```bash
openspec schema fork spec-driven with-review
```

然後編輯 `schema.yaml` 以新增：

```yaml
  - id: review
    generates: review.md
    description: 實作前審查檢查清單
    template: review.md
    instruction: |
      根據設計建立一份審查檢查清單。
      包含安全性、效能和測試方面的考量。
    requires:
      - design

  - id: tasks
    # ... 現有的任務配置 ...
    requires:
      - specs
      - design
      - review    # 現在任務也需要審查
```

---

## 社群架構

OpenSpec 也支援透過獨立儲存庫發佈的社群維護架構。這些架構提供了將 OpenSpec 與其他工具或系統整合的特定工作流程，類似於 [github/spec-kit 的社群擴充目錄](https://github.com/github/spec-kit/tree/main/extensions) 為 spec-kit 提供的功能。

社群架構並未內建於 OpenSpec 核心中 — 它們位於各自的儲存庫中，並有自己的發佈節奏。要使用它，請將架構套件複製到您專案的 `openspec/schemas/<schema-name>/` 目錄中（每個儲存庫的 README 都有安裝說明）。

| 架構 | 維護者 | 儲存庫 | 描述 |
|------|--------|--------|------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | 將 OpenSpec 的產出物治理與 [obra/superpowers](https://github.com/obra/superpowers) 的執行技能（腦力激盪、撰寫計畫、透過子代理進行 TDD、程式碼審查、完成）整合。新增了一個以證據為先的 `retrospective` 產出物，填補了 Superpowers 原生未涵蓋的空白。 |

> 想貢獻一個社群架構嗎？請開啟一個 issue 並附上您的儲存庫連結，或提交一個 PR 在此表格中新增一行。

---

## 另請參閱

- [CLI 參考：架構指令](cli.md#schema-commands) - 完整的指令文件