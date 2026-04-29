# 自訂化

OpenSpec 提供三個層級的自訂化選項：

| 層級 | 功能 | 適用對象 |
|------|------|----------|
| **專案配置** | 設定預設值、注入上下文/規則 | 大多數團隊 |
| **自訂配置方案** | 定義自己的工作流程產物 | 有獨特流程的團隊 |
| **全域覆寫** | 跨專案共享配置方案 | 進階使用者 |

---

## 專案配置

`openspec/config.yaml` 檔案是為團隊自訂 OpenSpec 最簡單的方式。它允許您：

- **設定預設配置方案** - 省去每次指令都要加上 `--schema` 的麻煩
- **注入專案上下文** - 讓 AI 了解您的技術棧、慣例等
- **新增針對特定產物的規則** - 為特定工作產物制定自訂規則

### 快速設定

```bash
openspec init
```

此指令會引導您互動式地建立配置檔案。或者您可以手動建立：

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  技術棧：TypeScript, React, Node.js, PostgreSQL
  API 風格：RESTful，文件位於 docs/api.md
  測試：Jest + React Testing Library
  我們重視所有公開 API 的向後相容性

rules:
  proposal:
    - 包含回滾計畫
    - 識別受影響的團隊
  specs:
    - 使用 Given/When/Then 格式
    - 在發明新模式前，先參考現有模式
```

### 運作方式

**預設配置方案：**

```bash
# 無配置時
openspec new change my-feature --schema spec-driven

# 有配置時 - 配置方案自動套用
openspec new change my-feature
```

**上下文與規則注入：**

當生成任何工作產物時，您的上下文和規則會被注入到 AI 提示中：

```xml
<context>
技術棧：TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- 包含回滾計畫
- 識別受影響的團隊
</rules>

<template>
[配置方案的內建模板]
</template>
```

- **上下文**會出現在所有工作產物中
- **規則**僅出現在匹配的工作產物中

### 配置方案解析順序

當 OpenSpec 需要一個配置方案時，它會按以下順序檢查：

1. 命令列參數：`--schema <名稱>`
2. 變更中繼資料（變更資料夾中的 `.openspec.yaml`）
3. 專案配置（`openspec/config.yaml`）
4. 預設值（`spec-driven`）

---

## 自訂配置方案

當專案配置不夠用時，您可以建立自己的配置方案，打造完全自訂的工作流程。自訂配置方案位於專案的 `openspec/schemas/` 目錄中，並與您的程式碼一起進行版本控制。

```text
your-project/
├── openspec/
│   ├── config.yaml        # 專案配置
│   ├── schemas/           # 自訂配置方案位於此處
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 您的變更
└── src/
```

### 分叉現有配置方案

最快的自訂方式是分叉一個內建的配置方案：

```bash
openspec schema fork spec-driven my-workflow
```

這會將整個 `spec-driven` 配置方案複製到 `openspec/schemas/my-workflow/`，您可以在那裡自由編輯。

**您將獲得：**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # 工作流程定義
└── templates/
    ├── proposal.md       # 提案工作產物的模板
    ├── spec.md           # 規格的模板
    ├── design.md         # 設計的模板
    └── tasks.md          # 任務的模板
```

現在您可以編輯 `schema.yaml` 來改變工作流程，或編輯模板來改變 AI 生成的內容。

### 從頭建立配置方案

若要建立全新的工作流程：

```bash
# 互動式
openspec schema init research-first

# 非互動式
openspec schema init rapid \
  --description "快速迭代工作流程" \
  --artifacts "proposal,tasks" \
  --default
```

### 配置方案結構

配置方案定義了工作流程中的工作產物及其相互依賴關係：

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: 我的團隊自訂工作流程

artifacts:
  - id: proposal
    generates: proposal.md
    description: 初始提案文件
    template: proposal.md
    instruction: |
      建立一份解釋「為什麼」需要此變更的提案。
      聚焦於問題，而非解決方案。
    requires: []

  - id: design
    generates: design.md
    description: 技術設計
    template: design.md
    instruction: |
      建立一份解釋「如何」實作的設計文件。
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
| `id` | 唯一識別碼，用於指令和規則中 |
| `generates` | 輸出檔案名稱（支援如 `specs/**/*.md` 的萬用字元） |
| `template` | `templates/` 目錄中的模板檔案 |
| `instruction` | 建立此工作產物的 AI 指示 |
| `requires` | 依賴項 - 哪些工作產物必須先存在 |

### 模板

模板是引導 AI 的 Markdown 檔案。它們在建立該工作產物時會被注入到提示中。

```markdown
<!-- templates/proposal.md -->
## 為什麼

<!-- 解釋此變更的動機。這解決了什麼問題？ -->

## 變更內容

<!-- 描述將會發生什麼變化。具體說明新功能或修改。 -->

## 影響

<!-- 受影響的程式碼、API、依賴項、系統 -->
```

模板可以包含：
- AI 應填寫的章節標題
- 帶有給 AI 指導的 HTML 註解
- 顯示預期結構的範例格式

### 驗證您的配置方案

在使用自訂配置方案之前，請先驗證它：

```bash
openspec schema validate my-workflow
```

這會檢查：
- `schema.yaml` 語法是否正確
- 所有引用的模板是否存在
- 是否有循環依賴
- 工作產物 ID 是否有效

### 使用您的自訂配置方案

建立後，使用您的配置方案：

```bash
# 在指令中指定
openspec new change feature --schema my-workflow

# 或在 config.yaml 中設為預設值
schema: my-workflow
```

### 除錯配置方案解析

不確定正在使用哪個配置方案？可以用以下指令檢查：

```bash
# 查看特定配置方案從哪裡解析而來
openspec schema which my-workflow

# 列出所有可用的配置方案
openspec schema which --all
```

輸出會顯示它來自您的專案、使用者目錄還是套件：

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注意：** OpenSpec 也支援使用者層級的配置方案，位於 `~/.local/share/openspec/schemas/`，可用於跨專案共享，但建議使用 `openspec/schemas/` 中的專案層級配置方案，因為它們與您的程式碼一起進行版本控制。

---

## 範例

### 快速迭代工作流程

一個用於快速迭代的最小化工作流程：

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
      建立一份關於此變更的簡要提案。
      聚焦於「什麼」和「為什麼」，跳過詳細規格。
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

### 新增審查工作產物

分叉預設配置方案並新增審查步驟：

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
      包含安全性、效能和測試考量。
    requires:
      - design

  - id: tasks
    # ... 現有的 tasks 配置 ...
    requires:
      - specs
      - design
      - review    # 現在 tasks 也需要 review
```

---

## 另請參閱

- [命令列參考：配置方案指令](cli.md#schema-commands) - 完整的指令文件