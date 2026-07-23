# 故障排除

針對具體問題提供具體解決方案。每個條目都會說明症狀、用一句話解釋可能的原因，並提供修復方法。如果這裡沒有看到你遇到的問題，[常見問題集](faq.md) 或許能幫上忙，而 [Discord](https://discord.gg/YctCnvvshC) 肯定可以。

## 安裝與設定

### `openspec: command not found`

CLI 尚未安裝，或是你的 Shell 找不到該指令。請全域安裝並執行以下檢查：

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

如果已經安裝但仍然找不到，代表你的全域 npm bin 目錄可能沒有加入 `PATH` 環境變數。執行 `npm bin -g` 查看全域二進制檔案的存放位置，並確認該路徑已加入你的 Shell 設定檔中。

### "Requires Node.js 20.19.0 or higher"

OpenSpec 需要運行在 Node 20.19.0 及以上版本。請檢查你的版本，必要時升級：

```bash
node --version
```

如果你使用 bun 安裝 OpenSpec，請注意 OpenSpec 依然*運行*在 Node 上，因此無論如何你的 `PATH` 中都必須要有 Node 20.19.0+ 版本。詳情請見 [安裝指南](installation.md)。

### `openspec init` 沒有設定我的 AI 工具

執行 init 時會詢問要設定哪些工具。如果你跳過了你的工具，或是想要新增其他工具，只要重新執行一次即可，或是使用非互動式模式：

```bash
openspec init --tools claude,cursor
```

完整的工具 ID 列表請見 [支援的工具](supported-tools.md)。使用 `--tools all` 可設定所有工具，使用 `--tools none` 可跳過工具設定。

## 指令沒有顯示出來

如果 `/opsx:propose`（或是你所用工具的對應指令）沒有出現，或是執行後沒有反應，請依序排查以下項目。列表已按照檢查速度從快到慢排序：

1. **你可能在錯誤的位置執行。** 斜線指令要在你的 AI 助理的對話視窗中使用，而不是在終端機執行。如果你在 Shell 中輸入了 `/opsx:propose`，那就是問題所在。詳情請見 [指令運作方式](how-commands-work.md)。

2. **重新產生檔案。** 從你的專案根目錄執行：

   ```bash
   openspec update
   ```

   這會重新寫入你已設定的所有工具的指令碼與指令檔案。

3. **重新啟動你的 AI 助理。** 大多數工具會在啟動時掃描指令碼與指令，開啟新視窗通常就能解決問題。

4. **確認檔案是否存在。** 以 Claude Code 為例，請檢查 `.claude/skills/` 目錄下是否有 `openspec-*` 資料夾。其他工具會使用各自的目錄，完整列表請見 [支援的工具](supported-tools.md)。

5. **確認你已經初始化這個專案。** 指令碼會依專案分別寫入。如果你複製了儲存庫或是切換了資料夾，請在該目錄下執行 `openspec init`（或是 `openspec update`）。

6. **確認你的工具支援指令檔案。** Codex 以及部分其他工具（CodeArts、Kimi CLI、ForgeCode、Mistral Vibe）不會生成 `opsx-*` 指令檔案，而是使用基於指令碼的調用方式。以 Codex 為例，請檢查 `.codex/skills/openspec-*`。不同工具的調用方式有所差異，詳情請見 [支援的工具](supported-tools.md) 與 [指令運作方式](how-commands-work.md#slash-command-syntax-by-tool)。

## 處理變更

### "Change not found"

指令無法判斷你指的是哪個變更。請明確指定變更名稱，或是查看現有變更：

```bash
openspec list                    # 查看進行中的變更
/opsx:apply add-dark-mode        # 在對話中指定變更名稱
```

同時請確認你當前位於正確的專案目錄下。

### "No artifacts ready"

每個產出物要麼已經建立完成，要麼因為等待依賴項而被阻擋。請查看阻擋原因：

```bash
openspec status --change <name>
```

請先建立缺少的依賴項。請記住順序：提案完成後才能建立規格與設計；規格與設計都完成後才能建立任務。

### `openspec validate` 回報警告或錯誤

驗證功能會檢查你的規格與變更是否存在結構性問題。請閱讀回報訊息：其中會標註問題所在的檔案與具體問題。

```bash
openspec validate <name>           # 驗證單一項目
openspec validate --all            # 驗證所有項目
openspec validate --all --strict   # 更嚴格的檢查，適合用於 CI 流程
```

常見原因包括缺少必要區塊（例如規格中沒有場景說明），或是 delta 標頭格式錯誤。修復檔案後重新執行即可。[CLI 參考文件](cli.md#openspec-validate) 說明了輸出格式。

### AI 建立了不完整或錯誤的產出物

AI 沒有取得足夠的上下文資訊。你可以透過以下方式調整：

- 在 `openspec/config.yaml` 中加入專案上下文資訊，讓你的技術棧與規範被注入到所有請求中。詳情請見 [自訂設定](customization.md#project-configuration)。
- 為不同產出物加入對應的 `rules:` 設定，提供僅適用於特定產出物（例如規格）的指引。
- 在提出變更時提供更詳細的描述。
- 使用展開版的 `/opsx:continue` 一次建立一個產出物並逐一審查，不要使用一次建立所有產出物的 `/opsx:ff`。

### 封存無法完成，或是警告有未完成的任務

封存功能不會因為有未完成的任務而*阻擋*執行，但會發出警告，因為封存通常代表工作已經完成。如果任務是刻意保留的（例如你要提交部分變更），可以繼續執行。否則請先完成所有任務。如果你還沒有同步 delta 規格到主規格，封存時也會提示你進行同步；除非有特殊理由，否則請選擇同意。

## 設定

### 我的 `config.yaml` 沒有生效

通常有以下三個原因：

1. **檔案名稱錯誤。** 檔案必須命名為 `openspec/config.yaml`，不能是 `.yml`。
2. **YAML 格式無效。** 請使用任何 YAML 驗證工具檢查格式；CLI 也會回報帶有行號的語法錯誤。
3. **你以為需要重新啟動。** 不需要。設定變更會立即生效。

### "Unknown artifact ID in rules: X"

`rules:` 下的鍵值與你的 schema 中的任何產出物 ID 都不匹配。對於預設的 `spec-driven` schema，有效的 ID 為 `proposal`、`specs`、`design`、`tasks`。要查看任何 schema 的 ID 列表：

```bash
openspec schemas --json
```

### "Context too large"

`context:` 欄位的上限為 50KB，這是刻意設定的限制，因為該欄位的內容會被注入到所有請求中。請摘要化內容，或是連結到較長的文件，不要直接貼上完整內容。較精簡的上下文也能產生更好、更快的結果。

### "Schema not found"

你參照的 schema 名稱不存在。請列出可用的 schema 並檢查拼寫：

```bash
openspec schemas                    # 列出可用的 schema
openspec schema which <name>        # 查看 schema 的解析來源
openspec schema init <name>         # 建立自訂 schema
```

詳情請見 [自訂設定](customization.md#custom-schemas)。

## 從舊版工作流程遷移

### "Legacy files detected in non-interactive mode"

你正在使用 CI 或非互動式 Shell，OpenSpec 偵測到有舊檔案需要清理，但無法向你發出提示。請自動批准清理：

```bash
openspec init --force
```

針對 Codex，OpenSpec 可能會在 `$CODEX_HOME/prompts` 或 `~/.codex/prompts` 中偵測到舊的受管理提示檔案。該清理作業僅限於 OpenSpec 允許清單中的舊版 Codex 提示檔案名稱，非互動式 `openspec init` 只會刪除已有對應替代 `.codex/skills/openspec-*` 指令碼的檔案。除非你加上 `--force` 參數，否則非互動式 `openspec update` 不會動用任何舊版清理作業。

### 遷移後指令沒有出現

請重新啟動你的 IDE。指令碼會在啟動時被偵測。如果仍然沒有出現，請執行 `openspec update` 並在 [支援的工具](supported-tools.md) 中查看檔案位置。

### 我的舊版 `project.md` 沒有被遷移

這是刻意設計的行為。OpenSpec 永遠不會自動刪除 `project.md`，因為該檔案可能包含你寫入的上下文資訊。請將有用的內容移到 `config.yaml` 的 `context:` 區塊中，之後再自行刪除該檔案。[遷移指南](migration-guide.md#migrating-projectmd-to-configyaml) 說明了完整步驟，其中包含你可以交給 AI 執行的提問提示，用於提煉內容。

## 還是遇到問題？

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub 問題回報：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **從終端機執行：** 執行 `openspec feedback "what went wrong"` 可自動為你建立問題回報單。

回報問題時，請附上你的 OpenSpec 版本（執行 `openspec --version` 查看）、Node 版本（執行 `node --version` 查看）、使用的 AI 工具，以及確切的指令與輸出內容。這能大幅加快協助的速度。