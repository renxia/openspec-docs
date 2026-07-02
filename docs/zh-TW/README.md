# OpenSpec 文件說明

歡迎。這是所有關於 OpenSpec 的資訊中心。

OpenSpec 幫助您和您的 AI 編碼助理在撰寫任何程式碼之前就「同意要構建什麼」。您描述變更，AI 草擬一份簡短規格書和任務清單，你們雙方都審閱同一份計畫，然後工作便可開始。這樣一來，就不會再有「到一半才發現 AI 搞錯了」的情況發生了。

如果您只閱讀這兩頁：

1. [Getting Started](getting-started.md)：安裝、初始化並發布您的第一個變更。
2. [How Commands Work](how-commands-work.md)：您實際輸入 `/opsx:propose` 的地方（提示：在 AI 聊天中，而不是在終端機）。這點幾乎會讓所有人感到困惑一次。

第二個內容比它看起來更重要。OpenSpec 有兩個部分：一個您在終端機執行的命令列工具 (command line tool)，以及一套您提供給 AI 助理的斜線指令 (slash commands)。了解哪一項是什麼，可以避免最常見的那種混淆。

> **首先應養成最好的習慣：當您不確定要構建什麼時，請從 `/opsx:explore` 開始。** 這是一個無風險的思考夥伴，它會閱讀您的程式碼、權衡選項，並在任何成品或程式碼存在之前，將一個模糊的想法打磨成一份具體的計畫。[Explore First](explore.md) 指南提供了支持性的論據。

## 選擇您的路徑

**我是新手。** 請從 [Getting Started](getting-started.md) 開始，然後瀏覽 [Core Concepts at a Glance](overview.md)。當有任何事情讓您感到神秘時，[FAQ](faq.md) 和 [Glossary](glossary.md) 就在附近。

**我遇到了問題，但沒有計畫。** 這是常見的情況，它有專門的解答：[Explore First](explore.md)。請使用 `/opsx:explore` 與 AI 一起思考，然後再承諾任何事情。

**我有一個大型現有的程式碼庫 (codebase)。** 您不需要都去文件化。 [Using OpenSpec in an Existing Project](existing-projects.md) 說明如何在不「想著海裡所有東西」的情況下，從真實的、棕色場地 (brownfield) 程式碼開始工作。

**我只想讓它運作起來。** 請閱讀 [Install](installation.md)，運行 `openspec init`，然後閱讀 [How Commands Work](how-commands-work.md)，確保您的第一個斜線指令會落在正確的地方。

**我透過範例學習。** [Examples & Recipes](examples.md) 頁面將從頭到尾地帶您完成真實的變更：一個小型功能、一個錯誤修復、一次重構，或是一次探索。

**我來自舊的工作流程。** [Migration Guide](migration-guide.md) 解釋了哪些地方改變了以及為什麼，並保證您的現有工作是安全的。

**我想讓它符合我的團隊流程。** [Customization](customization.md) 涵蓋專案配置、自定義 Schema 和共享上下文。

**出錯了。** [Troubleshooting](troubleshooting.md) 收集了人們實際遇到的故障，並提供了修復方法。

## 完整地圖 (The whole map)

### 從這裡開始

| 文件 | 它能為您提供什麼 |
|-----|-------------------|
| [Getting Started](getting-started.md) | 安裝、初始化並端到端運行您的第一個變更 |
| [Explore First](explore.md) | 使用 `/opsx:explore` 在承諾之前思考一個想法 |
| [How Commands Work](how-commands-work.md) | 斜線指令在哪裡執行、什麼是「互動模式 (interactive mode)」、終端機 vs 聊天室 |
| [Core Concepts at a Glance](overview.md) | 一頁式概覽整個心智模型：規格書、變更、差異 (deltas)、歸檔 (archive) |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix 以及如何驗證它是否成功運作 |

### 日常使用

| 文件 | 它能為您提供什麼 |
|-----|-------------------|
| [Workflows](workflows.md) | 常見的模式以及何時該使用哪個指令 |
| [Examples & Recipes](examples.md) | 完整的真實變更範例，可複製貼上 (copy-pasteable) |
| [Using OpenSpec in an Existing Project](existing-projects.md) | 在大型棕色場地程式碼庫中採用 OpenSpec |
| [Editing & Iterating on a Change](editing-changes.md) | 更新成品 (artifacts)，回溯，協調手動編輯的內容 |
| [Commands](commands.md) | 所有 `/opsx:*` 斜線指令的參考資料 |
| [CLI](cli.md) | 所有 `openspec` 終端機指令的參考資料 |

### 深入理解

| 文件 | 它能為您提供什麼 |
|-----|-------------------|
| [Concepts](concepts.md) | 對規格書、變更、成品 (artifacts)、Schema 和歸檔的詳細解釋 |
| [OPSX Workflow](opsx.md) | 為什麼這個工作流程是流動性的而不是階段鎖定的，以及架構深度解析 |
| [Glossary](glossary.md) | 所有術語集中定義的地方 |

### 使其專屬化 (Make it yours)

| 文件 | 它能為您提供什麼 |
|-----|-------------------|
| [Customization](customization.md) | 專案配置、自定義 Schema 和共享上下文 |
| [Multi-Language](multi-language.md) | 在非英文語言中生成成品 (artifacts) |
| [Supported Tools](supported-tools.md) | OpenSpec 集成支援的 25+ 種 AI 工具，以及檔案儲存的位置 |

### 需要協助時

| 文件 | 它能為您提供什麼 |
|-----|-------------------|
| [FAQ](faq.md) | 對人們最常問問題的快速解答 |
| [Troubleshooting](troubleshooting.md) | 針對具體故障的具體修復方法 |
| [Migration Guide](migration-guide.md) | 從舊版工作流程遷移到 OPSX |

### 跨儲存庫協調 (beta)

| 文件 | 它能為您提供什麼 |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | 當您的工作涵蓋多個儲存庫或團隊時的規劃指南 |
| [Agent Contract](agent-contract.md) | 機制可讀取的 CLI 介面所驅動的代理 (agents) |

## 三十秒速覽

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← 可選，但是一個很好的習慣
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

步驟 1 和 2 在您的終端機上執行。其餘的步驟都在您的 AI 助理聊天室中完成。這是一個值得記住的分界點，而 [How Commands Work](how-commands-work.md) 會詳細解釋原因。步驟 3 是可選的，但從不確定時就開始使用 `/opsx:explore` 是一個最值得培養的習慣。

## 其他尋求協助的地方

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) 用於提問、分享想法和尋求幫助。
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) 用於報告錯誤和功能需求。
- **`openspec feedback "your message"`** 可以直接從您的終端機發送回饋（它會開啟一個 GitHub issue）。

在這些文件中發現任何錯誤、過時或令人困惑的地方嗎？這就是一個 Bug。請開立一個 Issue 或 PR。文件改進是您可以做出的最有價值貢獻之一。