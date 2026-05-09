---
layout: home

hero:
  name: "OpenSpec"
  text: "規格驅動的 AI 助手開發"
  tagline: 用於構建和管理 AI 助手專案的輕量級規格。
  actions:
    - theme: brand
      text: 快速開始
      link: ./getting-started
    - theme: alt
      text: 首頁
      link: /

features:
  - title: 規格優先的工作流程
    details: 在編寫程式碼之前先定義需求。
  - title: AI 原生設計
    details: 為 Claude Code、Cursor、Windsurf 等工具打造。
  - title: 多語言支援
    details: 文件提供多種語言版本。
---


我們的理念：

```text
→ 流動而非僵化
→ 迭代而非瀑布式
→ 簡單而非複雜
→ 為現有專案而非僅為全新專案打造
→ 從個人專案到企業級皆可擴展
```

> [!TIP]
> **全新工作流程現已推出！** 我們以全新的產物導向工作流程重新打造了 OpenSpec。
>
> 執行 `/opsx:propose "你的想法"` 即可開始。 → [在此了解更多](opsx.md)

<p align="center">
  追蹤 <a href="https://x.com/0xTab">@0xTab on X</a> 以獲取更新 · 加入 <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> 尋求幫助和提問。
</p>

## 實際操作示範

```text
你： /opsx:propose add-dark-mode
AI： 已建立 openspec/changes/add-dark-mode/
     ✓ proposal.md — 為何要做此變更、變更內容為何
     ✓ specs/       — 需求與情境
     ✓ design.md    — 技術方案
     ✓ tasks.md     — 實作檢查清單
     準備好進行實作！

你： /opsx:apply
AI： 正在實作任務...
     ✓ 1.1 新增主題上下文提供者
     ✓ 1.2 建立切換元件
     ✓ 2.1 新增 CSS 變數
     ✓ 2.2 串接 localStorage
     所有任務完成！

你： /opsx:archive
AI： 已歸檔至 openspec/changes/archive/2025-01-23-add-dark-mode/
     規格已更新。準備好進行下一個功能。
```

<details>
<summary><strong>OpenSpec 儀表板</strong></summary>
</details>

## 快速開始

**需要 Node.js 20.19.0 或更高版本。**

全域安裝 OpenSpec：

```bash
npm install -g @fission-ai/openspec@latest
```

然後導航到你的專案目錄並進行初始化：

```bash
cd your-project
openspec init
```

現在告訴你的 AI：`/opsx:propose <你想構建的內容>`

如果你想要擴展的工作流程（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:sync`、`/opsx:bulk-archive`、`/opsx:onboard`），請使用 `openspec config profile` 選擇它，並使用 `openspec update` 套用。

> [!NOTE]
> 不確定你的工具是否受支援？[查看完整列表](supported-tools.md) – 我們支援 25 種以上的工具，且持續增加中。
>
> 亦支援 pnpm、yarn、bun 和 nix。[查看安裝選項](installation.md)。

## 文件

→ **[快速開始](getting-started.md)**：第一步<br>
→ **[工作流程](workflows.md)**：組合與模式<br>
→ **[命令](commands.md)**：斜線命令與技能<br>
→ **[CLI](cli.md)**：終端機參考<br>
→ **[支援的工具](supported-tools.md)**：工具整合與安裝路徑<br>
→ **[概念](concepts.md)**：整體運作原理<br>
→ **[多語言](multi-language.md)**：多語言支援<br>
→ **[自訂](customization.md)**：打造你的專屬設定


## 為何選擇 OpenSpec？

AI 程式碼助手功能強大，但當需求僅存在於聊天記錄中時，其行為難以預測。OpenSpec 增加了一個輕量級的規格層，讓你在編寫任何程式碼之前，先就構建內容達成共識。

- **先達成共識再構建** — 人類和 AI 在編寫程式碼之前，先就規格達成一致
- **保持井然有序** — 每次變更都有自己的資料夾，包含提案、規格、設計和任務
- **流暢地工作** — 隨時更新任何產物，沒有僵化的階段門檻
- **使用你的工具** — 透過斜線命令與 20 種以上的 AI 助手協作

### 我們的比較

**與 [Spec Kit](https://github.com/github/spec-kit)** (GitHub) 相比 — 徹底但笨重。僵化的階段門檻、大量的 Markdown、需要 Python 設定。OpenSpec 更輕量，讓你自由迭代。

**與 [Kiro](https://kiro.dev)** (AWS) 相比 — 功能強大，但你被鎖定在他們的 IDE 中，且僅限於 Claude 模型。OpenSpec 可與你現有的工具協作。

**與不使用任何工具相比** — 沒有規格的 AI 程式碼編寫意味著模糊的提示和不可預測的結果。OpenSpec 在不增加繁瑣儀式的情況下帶來可預測性。

## 更新 OpenSpec

**升級套件**

```bash
npm install -g @fission-ai/openspec@latest
```

**重新整理代理指令**

在每個專案內執行此命令，以重新生成 AI 指引並確保最新的斜線命令處於活動狀態：

```bash
openspec update
```

## 使用說明

**模型選擇**：OpenSpec 與高推理能力的模型配合效果最佳。我們推薦 Opus 4.5 和 GPT 5.2 用於規劃和實作。

**上下文衛生**：OpenSpec 受益於乾淨的上下文視窗。在開始實作之前清除你的上下文，並在整個會話期間保持良好的上下文衛生。

## 貢獻

**小修復** — 錯誤修正、拼寫更正和小幅改進可以直接作為 PR 提交。

**較大的變更** — 對於新功能、重大重構或架構變更，請先提交一個 OpenSpec 變更提案，以便我們在意圖和目標上達成一致後再開始實作。

撰寫提案時，請牢記 OpenSpec 的理念：我們服務於各種不同的程式碼代理、模型和使用案例的用戶。變更應對每個人都適用。

**歡迎 AI 生成的程式碼** — 只要它經過測試和驗證。包含 AI 生成程式碼的 PR 應提及所使用的程式碼代理和模型（例如，「使用 claude-opus-4-5-20251101 透過 Claude Code 生成」）。

### 開發

- 安裝依賴項：`pnpm install`
- 構建：`pnpm run build`
- 測試：`pnpm test`
- 本地開發 CLI：`pnpm run dev` 或 `pnpm run dev:cli`
- 約定式提交（單行）：`type(scope): subject`

## 其他

<details>
<summary><strong>遙測</strong></summary>

OpenSpec 收集匿名使用統計資料。

我們僅收集命令名稱和版本以了解使用模式。不收集參數、路徑、內容或個人身份資訊。在 CI 中自動停用。

**選擇退出：** `export OPENSPEC_TELEMETRY=0` 或 `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>維護者與顧問</strong></summary>

請參閱 [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) 以獲取幫助指導專案的核心維護者和顧問列表。

</details>



## 授權條款

MIT