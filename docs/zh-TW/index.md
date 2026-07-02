---
layout: home

hero:
  name: "OpenSpec"
  text: "AI 助理的規格化開發"
  tagline: 用於建構和管理 AI 助理專案的輕量級規範。
  actions:
    - theme: brand
      text: 開始使用
      link: ./getting-started
    - theme: alt
      text: 首頁
      link: /

features:
  - title: 規格優先的工作流程 (Spec-First Workflow)
    details: 在編寫程式碼之前定義需求。
  - title: AI 原生設計 (AI-Native Design)
    details: 為 Claude Code, Cursor, Windsurf 等工具而建構。
  - title: 多語言支援 (Multi-Language)
    details: 文件提供多種語言。
---

# OpenSpec 文件說明

歡迎您。這是所有關於 OpenSpec 的資訊中心。

OpenSpec 幫助您和您的 AI 編碼助理**在編寫任何程式碼之前就達成共識要做什麼**。您描述變更，AI 撰寫一份簡短的規格書和任務清單，雙方審閱同一份計畫，然後工作便可開始。再也不必在過程中發現 AI 做了錯誤的東西。

如果您只閱讀這兩頁：

1. [Getting Started](getting-started.md)：安裝、初始化並發布您的第一個變更。
2. [How Commands Work](how-commands-work.md)：您實際輸入 `/opsx:propose` 的地方（提示：在 AI 聊天中，而不是在終端機）。這幾乎會讓所有人感到困惑一次。

第二點比看起來更重要。OpenSpec 有兩個部分：一個您在終端機執行的指令列工具 (command line tool)，以及一套您提供給 AI 助理的斜線指令 (slash commands)。了解哪一個是什麼，可以避免最常見的混淆情況。

> **第一個應該養成的好習慣：當您不確定要做什麼時，請從 `/opsx:explore` 開始。** 這是一個零風險的思考夥伴，它會閱讀您的程式碼、權衡選項，並在任何產物或程式碼存在之前，將模糊的想法磨練成具體的計畫。[Explore First](explore.md) 指南提供了論證基礎。

## 選擇您的路徑

**我完全新手。** 從 [Getting Started](getting-started.md) 開始，然後瀏覽一下 [Core Concepts at a Glance](overview.md)。當您感到困惑時，[FAQ](faq.md) 和 [Glossary](glossary.md) 就在附近。

**我有問題但沒有計畫。** 這是常見的情況，並有專門的解答：[Explore First](explore.md)。使用 `/opsx:explore` 與 AI 一起思考，而不是倉促承諾任何事情。

**我有一個大型現有的程式碼庫 (codebase)。** 您不需要都做文件記錄。[Using OpenSpec in an Existing Project](existing-projects.md) 說明如何在不「把海洋煮沸」的情況下，對真實的、已存在的專案進行開端採用。

**我只想讓它跑起來。** [Install](installation.md)，運行 `openspec init`，然後閱讀 [How Commands Work](how-commands-work.md)，確保您的第一個斜線指令出現在正確的地方。

**我透過範例學習。** [Examples & Recipes](examples.md) 頁面會完整地帶領您完成從頭到尾的真實變更：一個小型功能、一個錯誤修復、一次重構，或是一次探索。

**我來自舊的工作流程。** [Migration Guide](migration-guide.md) 解釋了哪些地方發生了變化以及原因，並保證您的現有工作是安全的。

**我想讓它符合我的團隊流程。** [Customization](customization.md) 涵蓋專案配置、自定義 Schema 和共享上下文。

**某個東西壞了。** [Troubleshooting](troubleshooting.md) 收集了人們實際遇到的故障，並提供了修復方法。

## 完整地圖 (The whole map)

### 從這裡開始

| 文件 | 它能給您什麼？ |
|-----|-------------------|
| [Getting Started](getting-started.md) | 安裝、初始化並端到端執行您的第一個變更 |
| [Explore First](explore.md) | 使用 `/opsx:explore` 在承諾之前思考一個想法 |
| [How Commands Work](how-commands-work.md) | 斜線指令在哪裡運行，什麼是「互動模式」，終端機與聊天室的區別 |
| [Core Concepts at a Glance](overview.md) | 一頁式的心智模型：規格、變更、差量 (deltas)、歸檔 (archive) |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix 以及如何驗證它是否正常運作 |

### 日常使用

| 文件 | 它能給您什麼？ |
|-----|-------------------|
| [Workflows](workflows.md) | 常見的模式以及何時該使用哪個指令 |
| [Examples & Recipes](examples.md) | 完整的真實變更流程，可複製貼上 |
| [Using OpenSpec in an Existing Project](existing-projects.md) | 在大型現有程式碼庫上採用 OpenSpec |
| [Editing & Iterating on a Change](editing-changes.md) | 更新產物、回溯、協調手動編輯的變更 |
| [Commands](commands.md) | 所有 `/opsx:*` 斜線指令的參考資料 |
| [CLI](cli.md) | 所有 `openspec` 終端機指令的參考資料 |

### 深入理解

| 文件 | 它能給您什麼？ |
|-----|-------------------|
| [Concepts](concepts.md) | 對規格、變更、產物 (artifacts)、Schema 和歸檔的長篇解釋 |
| [OPSX Workflow](opsx.md) | 為什麼這個工作流程是流動而非階段鎖定的，以及架構深度解析 |
| [Glossary](glossary.md) | 所有術語的定義集中地 |

### 使它屬於您自己

| 文件 | 它能給您什麼？ |
|-----|-------------------|
| [Customization](customization.md) | 專案配置、自定義 Schema 和共享上下文 |
| [Multi-Language](multi-language.md) | 生成非英文語言的產物 |
| [Supported Tools](supported-tools.md) | OpenSpec 集成的 25+ 種 AI 工具，以及檔案存放的位置 |

### 需要幫助時

| 文件 | 它能給您什麼？ |
|-----|-------------------|
| [FAQ](faq.md) | 對人們最常問問題的快速解答 |
| [Troubleshooting](troubleshooting.md) | 對具體故障的具體修復方案 |
| [Migration Guide](migration-guide.md) | 從舊版工作流程遷移到 OPSX |

### 跨 Repo 協調 (Beta)

| 文件 | 它能給您什麼？ |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | 當您的工作跨越多個 Repo 或團隊時的規劃指南 |
| [Agent Contract](agent-contract.md) | 機器可讀取的 CLI 介面所驅動的代理 (agents) 合約 |

## 三十秒速覽

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← 可選，但是一個很好的習慣
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

步驟 1 和 2 在您的終端機上完成。其餘的步驟在您的 AI 助理聊天室中完成。這是一個值得記住的分界點，而 [How Commands Work](how-commands-work.md) 會詳細解釋原因。步驟 3 是可選的，但當您不確定時從 `/opsx:explore` 開始是最有價值養成的一個習慣。

## 其他尋求幫助的地方

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) 用於提問、分享想法和尋求協助。
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) 用於報告錯誤和功能請求。
- **`openspec feedback "your message"`** 可直接從您的終端機發送回饋（它會開啟一個 GitHub issue）。

在這些文件中發現任何不正確、過時或令人困惑的地方嗎？這就是一個 Bug。請開立一個 Issue 或 PR。文件改進是您可以做出的最有價值貢獻之一。