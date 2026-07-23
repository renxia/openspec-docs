# 命令運作方式

**唯一需要知道的事：OpenSpec 有兩種命令，且它們在兩個不同的地方執行。**

- `openspec ...` 命令在你的**終端機**執行。（範例：`openspec init`。）
- `/opsx:...` 命令在你的**AI 助理的對話視窗**執行。（範例：`/opsx:propose`。）

如果你曾經在終端機輸入 `/opsx:propose` 卻沒有任何反應，原因就在這頁。你正在跟 OpenSpec 錯誤的部分對話。斜線指令不是終端機命令，而是你傳給 AI 程式開發助理的指示，和你平常輸入「新增登入表單」的對話框是同一個。

這項區別是新手使用者最常遇到的障礙，所以我們會把它講得非常清楚。

## 兩個部分

OpenSpec 是同一個專案，卻有兩種運作模式。

**CLI（終端機端）** 是一支名為 `openspec` 的程式，你會在 shell 中安裝並執行它。它會為你設定專案、列出並驗證變更、顯示儀表板，以及封存已完成的工作。你可以在 iTerm、VS Code 終端機、PowerShell，或是任何你會執行 `git` 或 `npm` 的地方輸入這些指令。

```bash
openspec init        # 在此專案中設定 OpenSpec
openspec list        # 查看進行中的變更
openspec view        # 開啟互動式儀表板
```

**斜線指令（對話端）** 是在 AI 助理對話框中輸入的短指令，例如 `/opsx:propose` 和 `/opsx:apply`。這些指令會告訴 AI 遵循 OpenSpec 工作流程：起草提案、撰寫規格、根據任務清單建置、完成後封存。你可以在 Claude Code、Cursor、Windsurf、Copilot，或是任何你使用的助理對話框中輸入這些指令。

```text
/opsx:propose add-dark-mode    （在你的 AI 對話框中輸入）
/opsx:apply                    （在你的 AI 對話框中輸入）
/opsx:archive                  （在你的 AI 對話框中輸入）
```

以下用一張圖說明這個運作模型：

```text
        你的終端機                         你的 AI 助理對話框
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   安裝指令    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │ ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   與技能     │  /opsx:archive                │
   └──────────────────────┘              └──────────────────────────────┘
       在這裡執行 openspec                       在這裡執行 /opsx:* 指令
```

請注意箭頭方向。在終端機執行 `openspec init` 會將斜線指令*安裝*到你的 AI 工具中。終端機端會設定對話端。完成設定後，日常操作大多在對話框中進行。

## 「如何啟動互動模式？」

**沒有需要額外啟動的獨立互動模式。** 這個問題非常常見，所以我們直接給出明確答案。

你不需要進入特殊的 OpenSpec 模式，只要像平常一樣打開 AI 程式開發助理，在對話框中輸入斜線指令即可。斜線指令本身就是你「進入」OpenSpec 的方式。你的助理會辨識這個指令、載入對應的 OpenSpec 技能，並開始遵循工作流程。

所以實際操作步驟如下：

1. 在你的專案中打開 AI 程式開發助理（Claude Code、Cursor、Windsurf 等）。
2. 在助理的對話框中輸入 `/opsx:propose`，和你輸入其他需求的位置相同。
3. 留意自動完成功能：如果 OpenSpec 已安裝，當你輸入斜線時，就會看到 `/opsx:propose`、`/opsx:apply` 等相關指令出現。

就這樣。不需要切換模式、不需要啟動守護行程、也不需要開啟獨立視窗。

唯一位於終端機的互動功能是 `openspec view`，它會開啟一個儀表板供你瀏覽規格與變更。但這只是檢視工具，不是用來提案與建置的功能，建置工作都是透過對話框中的斜線指令完成。

## 為什麼要這樣拆分？

了解這個設計原因很有幫助，因為它說明了為什麼 OpenSpec 可以支援超過 25 種不同的 AI 工具。

CLI 是**引擎**。它知道所有規則：變更資料夾的結構、哪些成品相依於哪些其他成品、如何將增量規格合併到你的主要規格來源中。這些規則在所有環境中都一致。

斜線指令則是**方向盤**，而每種 AI 工具的指令格式略有不同。Claude Code 稱它們為指令，Cursor 和 Windsurf 有各自的格式，有些工具則稱之為技能。當你執行 `openspec init` 時，OpenSpec 會為你選擇的每種工具產生對應的正確檔案類型，因此無論你使用哪種助理，`/opsx:propose` 的意圖都能正常運作。

這個設計的優點是：你只需要學習一次工作流程，就能在所有工具中使用。權衡之處在於：不同工具之間的指令語法可能略有差異，這會在下一節說明。

## 各工具的斜線指令語法

所有工具的指令意圖都相同，只有標點符號不同。請使用對應你助理的格式。

| 工具 | 輸入方式 |
|------|----------|
| Claude Code | `/opsx:propose`、`/opsx:apply` |
| Cursor | `/opsx-propose`、`/opsx-apply` |
| Windsurf | `/opsx-propose`、`/opsx-apply` |
| GitHub Copilot（IDE） | `/opsx-propose`、`/opsx-apply` |
| CodeArts | 技能風格，例如 `/openspec-propose` |
| Codex | 透過 `.codex/skills/openspec-*` 的技能風格 |
| Oh My Pi | `/opsx-propose`、`/opsx:apply` |
| Kimi CLI | 技能風格，例如 `/skill:openspec-propose` |
| Trae | `/opsx-propose`、`/opsx-apply` |

大多數工具使用冒號格式（`/opsx:propose`）或連字號格式（`/opsx-propose`）。少數工具會將 OpenSpec 以命名技能的形式呈現，而非斜線指令；對於這些工具，你需要透過名稱來呼叫技能。完整的各工具對照表，包含檔案確切寫入位置，請參閱[支援的工具](supported-tools.md)。

如果不確定，就在你的 AI 對話框中輸入斜線並查看自動完成建議，你的工具會顯示它預期的格式。

## 指令的由來：技能與指令

當你執行 `openspec init`（或 `openspec update`）時，OpenSpec 會將小型檔案寫入你的專案，讓你的 AI 工具可以找到工作流程。根據你使用的工具與設定，這些檔案可能是**技能**、**指令**，或兩者皆是。

- **技能** 儲存在類似 `.claude/skills/openspec-*/SKILL.md` 的路徑。這是新興的跨工具標準：助理會自動偵測這些包含指示的資料夾。
- **指令** 儲存在類似 `.claude/commands/opsx/<id>.md` 的路徑。這是較舊的單一工具斜線指令檔案。Codex 不會產生指令檔案，請使用 `.codex/skills/openspec-*`。

你不需要在意你的工具使用哪一種，只要輸入斜線指令就能運作。但知道這些檔案的存在有助於排除問題：如果你的指令消失了，通常代表這些檔案遺失或過時，執行 `openspec update` 就能重新產生它們。

各工具的確切路徑請參閱[支援的工具](supported-tools.md)，技能如何取代舊版純指令模式的說明請參閱[移轉指南](migration-guide.md)。

## 確認已安裝

快速檢查方式，依速度排序：

1. **在你的 AI 對話框中輸入斜線。** 開始輸入 `/opsx` 並留意自動完成建議，如果出現相關建議就代表設定完成。
2. **檢查檔案是否存在。** 如果你使用 Claude Code，請確認 `.claude/skills/` 資料夾中包含 `openspec-*` 資料夾。其他工具會使用自己的目錄（[支援的工具](supported-tools.md) 有列出）。
3. **重新執行設定。** 從你的專案根目錄執行 `openspec update`，這會重新產生你設定的所有工具對應的技能與指令檔案。
4. **重新啟動你的助理。** 許多工具會在啟動時掃描技能與指令，因此開啟新視窗可能是你缺少的步驟。

## 我有哪些指令可用？

預設情況下，OpenSpec 會安裝**核心**斜線指令集：

- `/opsx:explore`：在確立變更前，先和 AI 一起思考構想的方向（當你不確定要做什麼時，是非常好的第一步）
- `/opsx:propose`：建立變更並一步完成所有規劃文件的起草
- `/opsx:apply`：透過執行任務清單來建置變更
- `/opsx:sync`：將變更的規格更新合併到你的主要規格中（通常會自動執行）
- `/opsx:archive`：完成變更並封存

良好的預設節奏是：在思考要做什麼時使用 `explore`，接著依序使用 `propose`、`apply`、`archive`。[先探索](explore.md) 指南說明了為什麼這個起始步驟值得執行。

還有提供給需要更細膩控制的使用者的**擴充**指令集（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:bulk-archive`、`/opsx:onboard`）。你可以使用 `openspec config profile` 啟用這個指令集，再執行 `openspec update` 套用設定。

如果你是新手，擴充指令集中的 `/opsx:onboard` 會帶領你在自己的程式碼庫中完成一次完整的變更，並逐步解說每個步驟，是最友善的入門方式。

各指令的詳細說明請參閱[指令](commands.md)，何時使用哪個指令的說明請參閱[工作流程](workflows.md)。

## 乾淨的首次執行

以下整合所有步驟，並標註每個步驟的執行位置。

```text
終端機   $ npm install -g @fission-ai/openspec@latest
終端機   $ cd your-project
終端機   $ openspec init
              （將斜線指令安裝到你的 AI 工具中）

AI 對話框      /opsx:explore
              （選用：先和 AI 一起思考構想方向）

AI 對話框      /opsx:propose add-dark-mode
              （AI 起草提案、規格、設計、任務）

AI 對話框      /opsx:apply
              （AI 建置功能，逐項勾選任務）

AI 對話框      /opsx:archive
              （變更已合併到你的規格中並封存）
```

只需要兩個終端機步驟完成設定，之後你就在對話框中操作。這就是基本節奏。

## 相關內容

- [入門指南](getting-started.md)：完整的首次變更操作導覽
- [指令](commands.md)：所有斜線指令的詳細說明
- [CLI](cli.md)：所有終端機指令的詳細說明
- [支援的工具](supported-tools.md)：各工具的語法與檔案位置
- [常見問題](faq.md)：更多快速解答
- [疑難排解](troubleshooting.md)：指令未顯示時的解決方法