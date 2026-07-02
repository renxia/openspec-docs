# Glossary

Glossary
每個 OpenSpec 術語的集中收錄，以通俗易懂的方式定義。只需瀏覽一次，後續的文件閱讀速度都會加快。

術語按主題分組，然後在每個組內按字母順序排列。

## The core nouns (核心名詞)

**Spec.** 一份描述您的系統某一部分行為的文檔。Specs 儲存在 `openspec/specs/` 中，按領域劃分，並包含需求和情境（scenarios）。該 Spec 是對「這個軟體要做什麼？」這一問題的共識答案。詳見 [Concepts](concepts.md#specs)。

**Source of truth.** 指整個 `openspec/specs/` 目錄。它儲存著您系統當前、已商定的行為。變更會提出對它的編輯；歸檔（archiving）則應用這些變更。

**Change.** 一個工作單元，以 `openspec/changes/<name>/` 下的資料夾形式封裝。一個 Change 包含了該項目的所有資訊：其提案、設計、任務以及它引入的 Spec 編輯。一個 Change = 一個功能或修復。

**Artifact.** Change 內的一個文檔。標準的 Artifact 包括提案（proposal）、delta specs、設計和任務。它們依賴順序創建，並相互提供輸入。

**Delta spec.** Change 內的一份 Spec，它只描述正在變動的部分，使用 `ADDED`、`MODIFIED` 和 `REMOVED` 等區塊，而不是重述整個 Spec。這使得 OpenSpec 能夠乾淨地編輯現有系統。詳見 [Concepts](concepts.md#delta-specs)。

**Domain.** Specs 的邏輯分組，例如 `auth/`、`payments/` 或 `ui/`。您選擇的 Domain 應與您思考您的系統的方式相符。

## Inside a spec (Spec 內部)

**Requirement.** 系統必須具備的一個單一行為，通常使用 RFC 2119 的關鍵字詞撰寫：「The system SHALL expire sessions after 30 minutes.」（該系統應在 30 分鐘後使會話終止）。Requirement 定義的是 *what*（要做什麼），而不是 *how*（如何做）。

**Scenario.** 對於 Requirement 的一個具體、可測試的範例，通常以 Given/When/Then 的形式呈現。Scenario 使 Requirement 可被驗證：您可以從中編寫自動化測試。

**RFC 2119 keywords.** 即 MUST, SHALL, SHOULD 和 MAY 這幾個詞彙，它們承載著關於需求嚴格程度的標準化意義。MUST 和 SHALL 是絕對的。SHOULD 是建議性的，允許例外情況。MAY 是可選的。這個名稱來自於定義這些關鍵字的網際網路標準文件。

## The artifacts (Artifacts)

**Proposal (`proposal.md`).** Change 的 *why*（原因）和 *what*（內容）：其意圖、範圍和高層次方法。這是您創建的第一個 Artifact。

**Design (`design.md`).** *How*（如何做）：技術方法、架構決策以及預期需要修改的文件。對於簡單的變更來說，這部分是可選的。

**Tasks (`tasks.md`).** 包含勾選框的實施清單。AI 在執行 `/opsx:apply` 時會依此進行操作並逐項打勾。

## The lifecycle (生命週期)

**Archive.** 完成一個 Change 的行為。它的 delta specs 會合併到主 Spec 中，而該 Change 資料夾則移動到 `openspec/changes/archive/YYYY-MM-DD-<name>/`。歸檔後，您的 Specs 就描述了新的現實。詳見 [Concepts](concepts.md#archive)。

**Sync.** 將 Change 的 delta specs 合併到主 Spec 中，但*不*歸檔該 Change。通常是自動完成的（Archive 會提供此選項），但也可用於長期進行的變更，通過 `/opsx:sync` 命令執行。詳見 [Commands](commands.md#opsxsync)。

## Workflow and commands (工作流程和命令)

**OPSX.** 當前的 OpenSpec 工作流程，它圍繞流動性的操作（fluid actions）而非僵化的階段來構建。其斜線命令（slash commands）均以 `/opsx:` 開頭。詳見 [OPSX Workflow](opsx.md)。

**Slash command.** 您輸入到 AI 助理聊天框中的一個命令，例如 `/opsx:propose`。Slash 命令驅動著工作流程。它們不是終端機（terminal）命令。詳見 [How Commands Work](how-commands-work.md)。

**Explore (`/opsx:explore`).** 思維夥伴（thinking-partner）命令。它會閱讀您的程式碼庫，比較選項，並將模糊的想法澄清成一個具體的計畫，過程中不會創建任何 Artifacts 也不寫任何程式碼。當您有問題但還沒有計畫時，這是建議的起點。詳見 [Explore First](explore.md)。

**CLI.** 您在終端機中執行的 `openspec` 程式。它負責設定專案、列出和驗證 Change、開啟儀表板並進行歸檔。它是 OpenSpec 的終端機部分。詳見 [CLI](cli.md)。

**Skill.** 一個包含指令（`.../skills/openspec-*/SKILL.md`）的資料夾，由您的 AI 助理自動偵測並遵循。Skills 是交付 OpenSpec 工作流程給您助理的新興跨工具標準。

**Command file.** 一個針對特定工具的斜線命令文件（`.../commands/opsx-*`）。這是舊有的交付機制，目前仍與 Skills 並存留用。您很少需要直接操作這些文件。

**Profile.** 安裝在您的專案中的一組斜線命令。**Core**（預設）包括 `propose`、`explore`、`apply`、`sync` 和 `archive`。**Expanded** 集合則增加了 `new`、`continue`、`ff`、`verify`、`bulk-archive` 和 `onboard`。您可以使用 `openspec config profile` 來更改它。

**Delivery.** 指 OpenSpec 是否為您的工具安裝了 Skills、Command files，或兩者皆有。這項設定是全局配置的，並使用 `openspec update` 應用。

## Customization (客製化)

**Schema.** 定義一個工作流程包含哪些 Artifacts 以及它們之間如何依賴的藍圖。內建預設值為 `spec-driven`（提案 → Specs → 設計 → 任務）。您可以分叉（fork）它或編寫自己的 Schema。詳見 [Customization](customization.md#custom-schemas)。

**Template.** 位於 Schema 內的一個 Markdown 文件，用於塑造 AI 為特定 Artifact 生成的內容。編輯 Template 會立即改變 AI 的輸出，無需重新建構。

**Project config (`openspec/config.yaml`).** 專案級別的設定：預設的 Schema、注入到每個規劃請求中的 `context:` 以及針對每個 Artifact 的 `rules:`。這是向 OpenSpec 教導您的技術棧和約定的最簡單方法。詳見 [Customization](customization.md#project-configuration)。

**Context injection.** 將專案背景放入 `config.yaml` 的 `context:` 欄位中，以便它能自動添加到 AI 生成的每個 Artifact 中。這比寄望 AI 能讀取一個單獨的文件要可靠得多。

**Dependency graph.** 由 Artifact `requires:` 關係所形成的有向圖（directed graph）。它是一個 DAG（Directed Acyclic Graph：箭頭只指向前方，絕不會形成循環），OpenSpec 利用它來了解下一步您可以創建什麼。

**Enablers, not gates.** 一個原則，即 Artifact 的依賴性顯示了下一步*可能*做什麼，而不是下一步*必須*做什麼。您可以隨時回顧和編輯任何一個 Artifact。詳見 [Core Concepts at a Glance](overview.md#enablers-not-gates)。

## Coordination across repos (beta) (跨儲存庫協調 - Beta)

這些術語僅適用於您的規劃涵蓋多個儲存庫的情況。它們仍處於測試階段（beta）。大多數使用者可以忽略它們。詳見 [Stores User Guide](stores-beta/user-guide.md)。

**Store.** 一個專門負責規劃的獨立儲存庫。它具有您已知的相同 `openspec/` 結構（Specs 和 Changes），外加一個小的身份文件。您只需在機器上以名稱註冊一次，之後任何 OpenSpec 命令就可以從任何地方在其上執行。

**Reference.** 一個程式碼儲存庫的 `openspec/config.yaml` 中對某個 Store 的宣告，表明該儲存庫依賴於此 Store。References 是唯讀的：該儲存庫保留自己的根目錄，而 `openspec instructions` 則獲得一個被引用 Store Specs 的索引，每個項目都附帶有精確的獲取指令。

**Working context.** `openspec context` 為當前儲存庫組裝出來的東西：它自身的 OpenSpec root 以及它所引用的所有 Store，並說明如何獲取它們。這是對「我正在處理什麼？」這個問題的答案。

**Workset.** 一套您同時打開的個人、機器本地化的資料夾集合（一個 Store 和您正在操作的程式碼儲存庫）。它是使用 `openspec workset create` 明確創建的；這些本地路徑的任何資訊都不會被提交到共享的規劃儲存庫中。

## See also (另請參閱)

- [Core Concepts at a Glance](overview.md): 概覽五個核心概念
- [Concepts](concepts.md): 詳細解釋
- [How Commands Work](how-commands-work.md): 斜線命令與 CLI 的區別