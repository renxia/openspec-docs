# 問題排查

針對具體問題提供具體的解決方案。每一項都列出了一個症狀、解釋可能的原因，並提供了解決方法。如果您沒有看到自己的問題，[FAQ](faq.md) 可能會有幫助，而 [Discord](https://discord.gg/YctCnvvshC) 絕對會。

## 安裝與設定

### `openspec: command not found`

CLI 未安裝，或者您的 shell 無法找到它。請進行全域性（global）安裝並檢查：

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

如果已安裝但仍找不到，那麼您的 global npm bin 目錄可能不在 `PATH` 中。請執行 `npm bin -g` 來查看全域性二進位檔案（binaries）的存放位置，並確保該路徑包含在您的 shell 設定檔中。

### "Requires Node.js 20.19.0 or higher"

OpenSpec 在 Node 20.19.0 及以上版本上運行。請檢查您的版本並按需升級：

```bash
node --version
```

如果您使用 bun 來安裝 OpenSpec，請注意 OpenSpec 仍然是在 Node 上*運作*的，因此無論如何，您都需要在 `PATH` 中有 Node 20.19.0+ 可用。請參閱 [Installation](installation.md)。

### `openspec init` 未為我的 AI 工具進行配置

Init 會詢問需要設定哪些工具。如果您跳過了某個工具或想新增其他工具，只需再次執行它，或使用非互動式（non-interactive）形式：

```bash
openspec init --tools claude,cursor
```

完整的工具 ID 清單請參閱 [Supported Tools](supported-tools.md)。要所有功能請使用 `--tools all`，要跳過工具設定請使用 `--tools none`。

## 命令未顯示

如果 `/opsx:propose`（或您工具的等效命令）沒有出現或沒有任何反應，請依序檢查以下清單。它們是從最快檢查到需要更深入排查的順序排列的。

1. **您可能處於錯誤的位置。** 斜線命令（Slash commands）應在 AI 助理的聊天中輸入，而不是在您的終端機（terminal）。如果您將 `/opsx:propose` 輸入到 shell 中，那就是問題所在。請參閱 [How Commands Work](how-commands-work.md)。

2. **重新生成檔案。** 在專案根目錄下執行：

   ```bash
   openspec update
   ```

   這會為您配置的每個工具重寫技能（skill）和命令檔案。

3. **重新啟動您的助理。** 大多數工具會在啟動時掃描技能和命令。一個全新的視窗通常就能做到這一點。

4. **確認檔案存在。** 對於 Claude Code，請檢查 `.claude/skills/` 中是否包含 `openspec-*` 資料夾。其他工具使用自己的目錄，詳見 [Supported Tools](supported-tools.md)。

5. **確認您已初始化此專案。** 技能是針對每個專案編寫的。如果您克隆（cloned）了一個 repo 或切換了資料夾，請在該處執行 `openspec init`（或 `openspec update`）。

6. **確認您的工具支援命令檔案。** 少數工具（Kimi CLI, Trae, ForgeCode, Mistral Vibe）不會生成 `opsx-*` 命令檔案；它們而是使用基於技能的調用（skill-based invocations）。不同工具的形式有所差異：請參閱 [Supported Tools](supported-tools.md) 和 [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool)。

## 處理變更 (Working with changes)

### "Change not found"（找不到變更）

命令無法判斷您指的是哪個變更。請明確命名它，或檢查現有的變更：

```bash
openspec list                    # 查看活躍的變更
/opsx:apply add-dark-mode        # 在聊天中命名該變更
```

同時確認您位於正確的專案目錄下。

### "No artifacts ready"（沒有 Artifacts 準備就緒）

每個 artifact 要麼已經被創建，要麼正在等待某個依賴項（dependency）。請查看哪些東西在阻塞：

```bash
openspec status --change <name>
```

然後先創建缺失的依賴項。請記住順序：提案（proposal）會啟用規格（specs）和設計（design）；規格和設計一起會啟用任務（tasks）。

### `openspec validate` 報告警告或錯誤

Validation 用來檢查您的 specs 和變更是否存在結構性問題。閱讀訊息：它會指出檔案名和問題所在。

```bash
openspec validate <name>           # 驗證單一項目
openspec validate --all            # 驗證所有內容
openspec validate --all --strict   # 更嚴格的檢查，適合 CI
```

常見的原因是缺少必需的部分（例如沒有情境（scenarios）的 spec），或 delta header 格式錯誤。請修復檔案並重新執行。[CLI reference](cli.md#openspec-validate) 會記錄輸出格式。

### AI 創建了不完整或錯誤的 Artifacts

AI 沒有足夠的上下文資訊。以下幾點可以提供幫助：

*   在 `openspec/config.yaml` 中加入專案上下文（project context），以便將您的技術棧和慣例注入到每個請求中。請參閱 [Customization](customization.md#project-configuration)。
*   為每個 artifact 加入 `rules:` 以提供僅適用於特定項目（例如 specs）的指導方針。
*   在您提出需求時給出更詳細的描述。
*   使用擴展版的 `/opsx:continue` 來一次一個地創建 artifact，並審查每一個，而不是讓 `/opsx:ff` 一次性完成所有事情。

### Archive 無法完成，或警告任務不完整

Archive 不會因為任務不完整而 *阻塞*，但它會發出警告，因為歸檔（archiving）通常意味著工作已經完成。如果任務是故意保留的（您正在提交一個部分變更），請繼續進行。否則請先完成這些任務。如果您尚未同步 delta specs 到主規格中，Archive 也會提供將其同步的選項；除非有理由不執行，否則請選擇「是」。

## 配置 (Configuration)

### 我的 `config.yaml` 沒有被應用

有三個常見嫌疑對象：

1. **檔名錯誤。** 它必須是 `openspec/config.yaml`，而不是 `.yml`。
2. **YAML 無效。** 請使用任何 YAML 驗證器進行檢查；CLI 也會報告帶有行號的語法錯誤。
3. **您預期需要重啟。** 您不需要。配置變更會立即生效。

### "Unknown artifact ID in rules: X"（Rules 中未知 Artifact ID: X）

`rules:` 下的一個鍵（key）與您的 schema 中的任何 artifact 都不匹配。對於預設的 `spec-driven` schema，有效的 ID 包括 `proposal`, `specs`, `design`, `tasks`。要查看任何 schema 的 ID，請執行：

```bash
openspec schemas --json
```

### "Context too large"（上下文過大）

`context:` 欄位被限制在 50KB，這是故意的，因為它會被注入到每個請求中。請進行摘要，或者提供外部的更長文件來替代貼上內容。簡潔的上下文也能產生更好、更快的结果。

### "Schema not found"（未找到 Schema）

您引用的 schema 名稱不存在。請列出所有可用的 schema 並檢查拼寫：

```bash
openspec schemas                    # 列出可用 schema
openspec schema which <name>        # 查看某個 schema 是從哪裡解析出來的
openspec schema init <name>         # 創建一個自定義 schema
```

請參閱 [Customization](customization.md#custom-schemas)。

## 從舊版工作流程遷移 (Migration from the legacy workflow)

### "Legacy files detected in non-interactive mode"（在非互動模式下偵測到舊檔案）

您正在 CI 或非互動式 shell 中運行，OpenSpec 找到了需要清理的舊檔案但無法提示您。請自動批准：

```bash
openspec init --force
```

### 遷移後命令仍未出現

重新啟動您的 IDE。技能會在啟動時被偵測到。如果它們仍然沒有出現，請執行 `openspec update` 並檢查 [Supported Tools](supported-tools.md) 中的檔案位置。

### 我的舊版 `project.md` 沒有被遷移

這是故意的。OpenSpec 不會自動刪除 `project.md`，因為它可能包含您撰寫的上下文資訊。請將有用的部分移動到 `config.yaml` 的 `context:` 區塊中，然後自行刪除該檔案。[Migration Guide](migration-guide.md#migrating-projectmd-to-configyaml) 會逐步指導這一過程，其中包含一個您可以提供給 AI 以進行提煉（distilling）的提示。

## 仍然卡住？

*   **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
*   **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
*   **從您的終端機執行：** `openspec feedback "what went wrong"` 會為您開立一個 issue。

當您報告問題時，請包含您的 OpenSpec 版本（`openspec --version`）、您的 Node 版本（`node --version`）、您的 AI 工具，以及確切的命令和輸出結果。這能讓幫助過程快得多。