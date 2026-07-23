---
layout: home

hero:
  name: "OpenSpec"
  text: "AI 助理的規格驅動開發"
  tagline: 一個輕量級規格，用於建構與管理 AI 助理專案。
  actions:
    - theme: brand
      text: 開始使用
      link: ./getting-started
    - theme: alt
      text: 首頁
      link: /

features:
  - title: 規格優先工作流程
    details: 在撰寫程式碼之前先定義需求。
  - title: AI 原生設計
    details: 為 Claude Code、Cursor、Windsurf 等工具打造。
  - title: 多語言支援
    details: 提供多語言版本的文件。
---

# OpenSpec 文件

歡迎來到 OpenSpec 的官方文件中心。

OpenSpec 能幫助你與你的 AI 編程助理**在撰寫任何程式碼之前，先就「要建置什麼」達成共識**。你描述需求變更，AI 會起草一份簡短的規格書與任務清單，你們雙方共同審閱同一份計畫，之後再開始執行工作。再也不會有做到一半才發現 AI 建置出錯誤東西的情況發生。

如果只打算讀兩頁，優先閱讀這兩份文件：
1. [開始使用](getting-started.md)：安裝、初始化，並上線你的第一個變更。
2. [指令運作方式](how-commands-work.md)：你實際輸入 `/opsx:propose` 的位置（提示：是在你的 AI 聊天視窗，而不是終端機）。幾乎每個新手都會在這裡卡關一次。

第二份文件的重要性遠超乎表面。OpenSpec 有兩大組成部分：一個是在終端機執行的命令列工具，另一個是傳送給 AI 助理的斜線指令。搞懂兩者的差異，能幫你避開最常見的困惑時刻。

> **最優先養成的好習慣：當你不確定要建置什麼時，先輸入 `/opsx:explore`。** 這是一個零風險的思考夥伴，會閱讀你的程式碼、權衡各種選項，在產出任何文件或程式碼之前，就把模糊的想法打磨成具體的計畫。[先探索](explore.md) 指南會詳細說明原因。

## 選擇適合你的路徑

**我是完全的新手。** 先閱讀[開始使用](getting-started.md)，再快速瀏覽[核心概念一覽](overview.md)。遇到看不懂的地方，可以隨時查閱[常見問題](faq.md)與[術語表](glossary.md)。

**我有問題但還沒有具體計畫。** 這是常見的情況，有專門的解法：[先探索](explore.md)。在投入任何實作之前，先用 `/opsx:explore` 和 AI 一起把問題想清楚。

**我有一個龐大的現有程式碼庫。** 你不需要把所有東西都文件化。[在現有專案中使用 OpenSpec](existing-projects.md) 會說明如何在真實的舊有程式碼上開始導入，不用大動干戈。

**我只要先讓它跑起來。** 先[安裝](installation.md)，執行 `openspec init`，再閱讀[指令運作方式](how-commands-work.md)，確保你的第一個斜線指令輸入到正確的位置。

**我透過範例學習。** [範例與實用技巧](examples.md) 頁面會從頭到尾走一遍真實的變更流程：小型功能、錯誤修復、重構、探索任務。

**AI 剛起草了一份計畫——接下來要做什麼？** 先讀它。[審閱變更](reviewing-changes.md) 說明如何在兩分鐘內快速檢查，在成本還很低的時候抓出錯誤方向，而[撰寫優質規格書](writing-specs.md) 則說明一份值得批准的計畫該包含什麼內容。

**我在團隊中工作。** [團隊中的 OpenSpec](team-workflow.md) 說明變更如何對應到分支與提取要求，以及團隊成員如何在程式碼撰寫前審閱計畫。

**我原本使用舊的工作流程。** [移轉指南](migration-guide.md) 會說明改了什麼、為什麼改，並保證你現有的工作都不會受影響。

**我想調整它以符合團隊的流程。** [自訂設定](customization.md) 涵蓋專案設定、自訂結構描述，以及共享上下文。

**遇到問題了。** [疑難排解](troubleshooting.md) 整理了大家實際遇到的錯誤，並提供修復方法。

## 完整文件地圖

### 從這裡開始

| 文件 | 內容說明 |
|-----|-------------------|
| [開始使用](getting-started.md) | 安裝、初始化，並從頭到尾執行你的第一個變更 |
| [先探索](explore.md) | 在投入實作前，用 `/opsx:explore` 把想法想清楚 |
| [指令運作方式](how-commands-work.md) | 斜線指令的執行位置、「互動模式」的意義，以及終端機與聊天的差異 |
| [核心概念一覽](overview.md) | 一整頁的完整心智模型：規格書、變更、差異、封存 |
| [安裝](installation.md) | 支援 npm、pnpm、yarn、bun、Nix，以及如何驗證安裝成功 |

### 日常使用

| 文件 | 內容說明 |
|-----|-------------------|
| [工作流程](workflows.md) | 常見模式，以及何時該使用哪個指令 |
| [範例與實用技巧](examples.md) | 真實變更的完整逐步解說，可直接複製貼上使用 |
| [撰寫優質規格書](writing-specs.md) | 強健的需求與場景長什麼樣子，以及如何調整變更的合適大小 |
| [審閱變更](reviewing-changes.md) | 在撰寫任何程式碼前，對起草的計畫進行兩分鐘快速檢查 |
| [團隊中的 OpenSpec](team-workflow.md) | 變更如何對應到分支、提取要求與審核流程 |
| [在現有專案中使用 OpenSpec](existing-projects.md) | 在大型舊有程式碼庫中導入 OpenSpec 的方法 |
| [編輯與反覆調整變更](editing-changes.md) | 更新產出物、退回修改、協調手動編輯的內容 |
| [指令](commands.md) | 所有 `/opsx:*` 斜線指令的參考文件 |
| [CLI](cli.md) | 所有 `openspec` 終端機指令的參考文件 |

### 深入理解

| 文件 | 內容說明 |
|-----|-------------------|
| [概念](concepts.md) | 關於規格書、變更、產出物、結構描述、封存的長篇解說 |
| [OPSX 工作流程](opsx.md) | 說明工作流程為何是流動式而非階段鎖定式，以及架構深度解析 |
| [術語表](glossary.md) | 所有術語的集中定義 |

### 自訂調整

| 文件 | 內容說明 |
|-----|-------------------|
| [自訂設定](customization.md) | 專案設定、自訂結構描述、共享上下文 |
| [多語言支援](multi-language.md) | 產生非英語的產出物 |
| [支援工具](supported-tools.md) | OpenSpec 整合的 25 種以上 AI 工具，以及檔案儲存位置 |

### 需要協助時

| 文件 | 內容說明 |
|-----|-------------------|
| [常見問題](faq.md) | 大家最常提問的問題的快速解答 |
| [疑難排解](troubleshooting.md) | 具體錯誤對應的具體修復方法 |
| [移轉指南](migration-guide.md) | 從舊版工作流程移轉到 OPSX 的說明 |

### 跨儲存庫協作（beta 版）

| 文件 | 內容說明 |
|-----|-------------------|
| [Stores：使用者指南](stores-beta/user-guide.md) | 當你的工作橫跨多個儲存庫或團隊時，將計畫放在獨立的儲存庫中 |
| [代理程式合約](agent-contract.md) | 代理程式驅動的機器可讀 CLI 介面 |

## 三十秒快速版

```text
1. 安裝        npm install -g @fission-ai/openspec@latest
2. 初始化     cd your-project && openspec init
3. 探索        (在你的 AI 聊天視窗)  /opsx:explore           ← 選用，但是非常值得養成的好習慣
4. 提案        (在你的 AI 聊天視窗)  /opsx:propose add-dark-mode
5. 建置        (在你的 AI 聊天視窗)  /opsx:apply
6. 封存        (在你的 AI 聊天視窗)  /opsx:archive
```

第 1 和 2 步在你的終端機執行，其餘步驟在你的 AI 助理聊天視窗執行。這個區分是唯一值得記住的要點，[指令運作方式](how-commands-work.md) 會詳細說明原因。第 3 步是選用的，但當你不確定時先輸入 `/opsx:explore`，是最值得養成的好習慣。

## 其他協助管道

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) 用於提問、分享想法與尋求協助。
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) 用於回報錯誤與功能需求。
- 執行 `openspec feedback "你的訊息"` 可直接從終端機傳送反饋（會自動開啟一個 GitHub Issue）。

如果在這些文件中發現錯誤、過時或令人困惑的內容，那就是一個 bug。請開啟 Issue 或 PR。文件改進是你所能做出的最有價值的貢獻之一。