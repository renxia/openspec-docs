---
layout: home

hero:
  name: "OpenSpec"
  text: "AI 助理的規範驅動開發"
  tagline: 用於建構和管理 AI 助理專案的輕量級規範。
  actions:
    - theme: brand
      text: 開始使用
      link: ./getting-started
    - theme: alt
      text: 首頁
      link: /

features:
  - title: 規範優先的工作流程
    details: 在撰寫程式碼之前先定義需求。
  - title: AI 原生設計
    details: 為 Claude Code、Cursor、Windsurf 等工具打造。
  - title: 多語言支援
    details: 提供多種語言的文件。
---


<details>
<summary><strong>最受喜愛的規範框架。</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>

我們的理念：

```text
→ 流動而非僵化
→ 迭代而非瀑布式
→ 簡單而非複雜
→ 為既有專案打造，而不僅是全新專案
→ 可從個人專案擴展至企業級規模
```

> [!TIP]
> **全新工作流程現已推出！** 我們已使用新的工件引導式工作流程重建了 OpenSpec。
>
> 執行 `/opsx:propose "your idea"` 即可開始。→ [在此了解更多](opsx.md)

<p align="center">
  追蹤 <a href="https://x.com/0xTab">@0xTab on X</a> 以獲取最新消息 · 加入 <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> 尋求協助與提問。
</p>


## 實際運作範例

```text
You: /opsx:propose add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /opsx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /opsx:archive
AI:  Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>OpenSpec 控制面板</strong></summary>

</details>

## 快速開始

**需要 Node.js 20.19.0 或更高版本。**

全域安裝 OpenSpec：

```bash
npm install -g @fission-ai/openspec@latest
```

然後導航至您的專案目錄並進行初始化：

```bash
cd your-project
openspec init
```

現在告訴您的 AI：`/opsx:propose <what-you-want-to-build>`

如果您想使用擴充工作流程（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:sync`、`/opsx:bulk-archive`、`/opsx:onboard`），請使用 `openspec config profile` 選擇它，並使用 `openspec update` 套用。

> [!NOTE]
> 不確定您的工具是否受支援？[查看完整列表](supported-tools.md) – 我們支援 25 種以上工具且數量持續增加。
>
> 也適用於 pnpm、yarn、bun 和 nix。[查看安裝選項](installation.md)。

## 文件

→ **[開始使用](getting-started.md)**：初步步驟<br>
→ **[工作流程](workflows.md)**：組合與模式<br>
→ **[命令](commands.md)**：斜線命令與技能<br>
→ **[CLI](cli.md)**：終端機參考<br>
→ **[支援的工具](supported-tools.md)**：工具整合與安裝路徑<br>
→ **[概念](concepts.md)**：整體運作方式<br>
→ **[多語言](multi-language.md)**：多語言支援<br>
→ **[自訂](customization.md)**：打造專屬您的版本


## 為何選擇 OpenSpec？

AI 編碼助理功能強大，但當需求僅存在於聊天記錄中時，其行為難以預測。OpenSpec 新增了一個輕量級的規範層，讓您在撰寫任何程式碼之前就能就建構內容達成共識。

- **建構前先達成共識** — 人類與 AI 在撰寫程式碼之前，先就規範達成一致
- **保持井然有序** — 每個變更都有自己的資料夾，包含提案、規範、設計與任務
- **流暢運作** — 隨時更新任何工件，無需僵化的階段關卡
- **使用您的工具** — 透過斜線命令與 20 種以上的 AI 助理協作

### 我們的比較優勢

**與 [Spec Kit](https://github.com/github/spec-kit)** (GitHub) 相比 — 全面但笨重。僵化的階段關卡、大量 Markdown、Python 設定。OpenSpec 更輕量，讓您自由迭代。

**與 [Kiro](https://kiro.dev)** (AWS) 相比 — 功能強大，但您被鎖定在其 IDE 中，且僅限於 Claude 模型。OpenSpec 可與您現有的工具協作。

**與沒有規範相比** — 沒有規範的 AI 編碼意味著模糊的提示和不可預測的結果。OpenSpec 在不增加繁文縟節的情況下帶來可預測性。

## 更新 OpenSpec

**升級套件**

```bash
npm install -g @fission-ai/openspec@latest
```

**重新整理代理指示**

在每個專案中執行此命令，以重新產生 AI 指導並確保最新的斜線命令處於啟用狀態：

```bash
openspec update
```

## 使用注意事項

**模型選擇**：OpenSpec 在高推理能力模型上運作最佳。我們建議使用 Opus 4.5 和 GPT 5.2 進行規劃與實作。

**上下文管理**：OpenSpec 受益於乾淨的上下文視窗。在開始實作前清除您的上下文，並在整個會話期間保持良好的上下文管理。

## 貢獻

**小型修復** — 錯誤修復、錯字更正和小型改進可以直接提交為 PR。

**較大變更** — 對於新功能、重大重構或架構變更，請先提交 OpenSpec 變更提案，以便我們在實作開始前就意圖和目標達成共識。

撰寫提案時，請牢記 OpenSpec 的理念：我們服務於跨不同編碼代理、模型和使用案例的廣泛用戶群。變更應對所有人都適用。

**歡迎 AI 生成的程式碼** — 只要經過測試和驗證即可。包含 AI 生成程式碼的 PR 應註明所使用的編碼代理和模型（例如，「使用 Claude Code 和 claude-opus-4-5-20251101 生成」）。

### 開發

- 安裝依賴項：`pnpm install`
- 建構：`pnpm run build`
- 測試：`pnpm test`
- 本地開發 CLI：`pnpm run dev` 或 `pnpm run dev:cli`
- 約定提交（單行）：`type(scope): subject`

## 其他

<details>
<summary><strong>遙測</strong></summary>

OpenSpec 會收集匿名使用統計資料。

我們僅收集命令名稱和版本以了解使用模式。不收集參數、路徑、內容或個人身份資訊。在 CI 中自動停用。

**選擇退出：** `export OPENSPEC_TELEMETRY=0` 或 `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>維護者與顧問</strong></summary>

請參閱 [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) 以獲取協助指導專案的核心維護者和顧問名單。

</details>



## 授權條款

MIT