# 命令的工作原理

**唯一需要知道的一點是：OpenSpec 有兩種命令，它們在不同的地方執行。**

- `openspec ...` 命令在您的**終端機 (terminal)** 中運行。（範例：`openspec init`。）
- `/opsx:...` 命令在您的**AI 助理聊天室**中運行。（範例：`/opsx:propose`。）

如果您不小心將 `/opsx:propose` 輸入到終端機中，卻沒有任何反應，那麼這篇頁面就是為此而設的。您正在與 OpenSpec 的錯誤部分對話。斜線命令並非終端機命令。它們是您給 AI 編碼助理的指令，是在您通常輸入「新增登入表單」的同一個聊天框中使用的。

這個單一的區別是新用戶最常遇到的障礙，所以讓我們把它說得清清楚楚。

## 兩種部分

OpenSpec 是披著兩件外衣的一個專案。

**CLI（終端機部分）。** 這是一個名為 `openspec` 的程式，您需要將其安裝並從 Shell 中運行。它負責設定您的專案、列出和驗證變更、顯示儀表板，以及歸檔已完成的工作。您可以將這些命令輸入到 iTerm、VS Code 終端機、PowerShell 或任何您執行 `git` 或 `npm` 的地方。

```bash
openspec init        # 在此專案中設定 OpenSpec
openspec list        # 查看活躍的變更
openspec view        # 開啟互動式儀表板
```

**斜線命令（聊天室部分）。** 像 `/opsx:propose` 和 `/opsx:apply` 這樣的簡短命令，您將它們輸入到 AI 助理中。這些命令指示 AI 遵循 OpenSpec 的工作流程：起草提案、編寫規格、根據任務清單進行建構、完成後方可歸檔。您將這些命令輸入到 Claude Code、Cursor、Windsurf、Copilot 或您使用的任何助理中。

```text
/opsx:propose add-dark-mode    (在您的 AI 聊天室中輸入)
/opsx:apply                    (在您的 AI 聊天室中輸入)
/opsx:archive                  (在您的 AI 聊天室中輸入)
```

這是一個單圖的思維模型：

```text
        您的終端機 (YOUR TERMINAL)                         您的AI助理聊天室 (YOUR AI ASSISTANT'S CHAT)
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   安裝 (installs)    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   命令 (commands)    │  /opsx:archive                │
   └──────────────────────┘    & 技能 (skills)   └──────────────────────────────┘
        在此運行 openspec       在 /opsx:* 中運行
```

請注意那個箭頭。在終端機中運行 `openspec init` 是將斜線命令「安裝」到您的 AI 工具的過程。終端機部分負責設定聊天室部分。完成後，日常操作主要是在聊天室中進行。

## 「我如何開始互動模式？」

**沒有單獨的互動模式需要啟動。** 這個問題經常出現，所以它值得一個明確的答案。

您不需要進入特殊的 OpenSpec 模式。您只需像往常一樣打開您的 AI 編碼助理，然後在聊天室中輸入一個斜線命令。這個斜線命令*就是*您「進入」OpenSpec 的方式。您的助理會識別它，載入匹配的 OpenSpec 技能，並開始遵循工作流程。

所以真正的指示是：

1. 在您的專案中打開 AI 編碼助理（Claude Code、Cursor、Windsurf 等）。
2. 在其聊天室中輸入 `/opsx:propose`，這與您輸入任何其他請求的地方相同。
3. 觀察自動完成功能：如果已安裝 OpenSpec，當您輸入斜線時，您會看到 `/opsx:propose`、`/opsx:apply` 等選項出現。

就是這樣。不需要切換模式，不需要啟動守護程式 (daemon)，也不需要單獨的視窗。

唯一真正具有互動性的東西存在於終端機中：`openspec view`。它會開啟一個用於瀏覽您的規格和變更的儀表板。但那只是個查看器，而不是您用來提案和建構的東西。建構是在聊天室中的斜線命令中進行的。

## 為什麼會有這種分割？

了解這一點是值得的，因為它解釋了 OpenSpec 如何與 25 個以上的不同 AI 工具協作。

CLI 是**引擎 (engine)**。它知道規則：一個變更資料夾應該是什麼樣子、哪些人工製品依賴於哪些、如何將 delta spec 合併到您的真實來源中。這點在所有地方都是一致的。

斜線命令是**方向盤 (steering wheel)**，而每個 AI 工具都有自己略有不同的版本。Claude Code 將它們稱為命令。Cursor 和 Windsurf 有自己的格式。有些工具稱之為技能 (skills)。當您運行 `openspec init` 時，OpenSpec 會為您選擇的每個工具生成正確類型的檔案，因此無論您偏好哪個助理，相同的 `/opsx:propose` 意圖都能正常運作。

這個設計的優勢：您只需要學習一次工作流程，就能在不同工具間沿用它。需要權衡的地方是：命令的確切語法可能因工具而略有不同，這將在下一節中說明。

## 各工具的斜線命令語法

意圖處於所有地方都是相同的。標點符號有所不同。請使用與您的助理相匹配的形式。

| 工具 | 輸入方式 |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | 技能式，例如 `/skill:openspec-propose` |
| Trae | 技能式，例如 `/openspec-propose` |

大多數工具使用的是冒號形式（`/opsx:propose`）或連字號形式（`/opsx-propose`）。少數工具將 OpenSpec 作為命名技能而非斜線命令來呈現；對於這些工具，您需要按名稱調用該技能。完整的、包含每個工具具體檔案位置的清單請參閱 [Supported Tools](supported-tools.md)。

如有疑問，請在您的 AI 聊天室中輸入一個斜線符號，然後查看自動完成功能。您的工具會顯示出它所預期的格式。

## 命令是如何出現的：技能與命令

當您運行 `openspec init`（或 `openspec update`）時，OpenSpec 會將小型檔案寫入您的專案中，以便您的 AI 工具能夠找到該工作流程。根據您的工具和設定，這些可以是**技能 (skills)**、**命令 (commands)** 或兩者皆是。

- **技能 (Skills)** 存在於 `.claude/skills/openspec-*/SKILL.md` 等地方。它們是正在興起的跨工具標準：一個由助理自動偵測的指令資料夾。
- **命令 (Commands)** 存在於 `.claude/commands/opsx/<id>.md` 等地方。它們是較舊有的、針對特定工具的斜線命令檔案。

您不需要關心您的工具使用的是哪一種。您只需輸入斜線命令，它就能正常運作。但了解這些檔案的存在有助於排錯：如果您的命令消失了，通常意味著這些檔案丟失或過時，而 `openspec update` 會重新生成它們。

請參閱 [Supported Tools](supported-tools.md) 以獲取每個工具的確切路徑，以及 [Migration Guide](migration-guide.md) 以了解技能如何取代舊有的僅有命令的方法。

## 確認已安裝

快速檢查，先從最快開始：

1. **在您的 AI 聊天室中輸入一個斜線符號。** 開始輸入 `/opsx` 並留意自動完成建議。如果它們出現了，您就沒問題了。
2. **尋找這些檔案。** 對於 Claude Code，請檢查 `.claude/skills/` 中是否包含 `openspec-*` 資料夾。其他工具使用自己的目錄（[Supported Tools](supported-tools.md) 會列出）。
3. **重新運行設定。** 從您的專案根目錄運行 `openspec update`。這會為您配置的工具重新生成技能和命令檔案。
4. **重啟您的助理。** 許多工具會在啟動時掃描技能和命令，所以開啟一個新的視窗可能是缺失的一步。

## 我到底有哪些命令？

預設情況下，OpenSpec 會安裝一套**核心 (core)** 的斜線命令：

- `/opsx:explore`: 在承諾任何變更之前，先與 AI 一起思考想法（當您不確定時這是一個很好的第一步）
- `/opsx:propose`: 創建一個變更並在一步中草擬所有相關的規劃人工製品
- `/opsx:apply`: 通過完成其任務清單來建構該變更
- `/opsx:sync`: 將變更的規格更新合併到您的主規格中（通常是自動的）
- `/opsx:archive`: 完成一個變更並將其歸檔

一個良好的預設節奏：當您正在想如何做時就使用 `explore`，然後使用 `propose`、`apply`、`archive`。[Explore First](explore.md) 指南解釋了為什麼這個開頭步驟會帶來回報。

還有一個**擴展 (expanded)** 的集合，供那些想要更精細控制的人使用（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:bulk-archive`、`/opsx:onboard`）。您可以使用 `openspec config profile` 打開它，然後使用 `openspec update` 應用它。

對此一體都感到陌生？`/opsx:onboard`（在擴展集合中）會引導您完成一個基於您自己程式碼庫的完整變更過程，並敘述每一步驟。這是最友善的介紹方式。

有關每個命令功能的詳細資訊，請參閱 [Commands](commands.md)。關於何時使用哪個命令，請參閱 [Workflows](workflows.md)。

## 乾淨俐落的第一次運行

將所有內容整合起來，以下是完整的序列，並標註了每一步發生的位置。

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (將斜線命令安裝到您的 AI 工具中)

AI CHAT      /opsx:explore
              (可選：先與 AI 一起思考想法)

AI CHAT      /opsx:propose add-dark-mode
              (AI 草擬提案、規格、設計和任務)

AI CHAT      /opsx:apply
              (AI 進行建構，並勾選任務)

AI CHAT      /opsx:archive
              (變更已合併到您的規格中並被歸檔)
```

兩個終端機步驟用於設定。然後您就在聊天室中操作。這就是節奏。

## 相關資源

- [Getting Started](getting-started.md): 完整的首次變更流程指南
- [Commands](commands.md): 所有斜線命令的詳細說明
- [CLI](cli.md): 所有終端機命令的詳細說明
- [Supported Tools](supported-tools.md): 各工具的語法和檔案位置
- [FAQ](faq.md): 更多快速問答
- [Troubleshooting](troubleshooting.md): 命令未顯示時的修復方法