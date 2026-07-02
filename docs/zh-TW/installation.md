# 安裝

## 先決條件

- **Node.js 20.19.0 或更高版本** — 檢查您的版本：`node --version`

## 套件管理器

### npm

```bash
npm install -g @fission-ai/openspec@latest
```

### pnpm

```bash
pnpm add -g @fission-ai/openspec@latest
```

### yarn

```bash
yarn global add @fission-ai/openspec@latest
```

### bun

Bun 可以將 OpenSpec 全域安裝，但 OpenSpec 目前是在 Node.js 上運行的。
您仍然需要確保 `PATH` 中有 Node.js 20.19.0 或更高版本。

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

直接執行 OpenSpec，無需安裝：

```bash
nix run github:Fission-AI/OpenSpec -- init
```

或安裝到您的設定檔中：

```bash
nix profile install github:Fission-AI/OpenSpec
```

或將其新增到 `flake.nix` 中的開發環境：

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:Fission-AI/OpenSpec";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## 驗證安裝

```bash
openspec --version
```

## 更新

升級套件，然後刷新每個專案生成的檔案：

```bash
npm install -g @fission-ai/openspec@latest   # 或 pnpm/yarn/bun 對應指令
openspec update                              # 在每個專案中執行
```

`openspec update` 會重新生成您所配置的工具的技能 (skill) 和命令 (command) 檔案，確保您的斜線 (`/`) 命令與已安裝的版本保持同步。

## 卸載

沒有 `openspec uninstall` 指令，因為 OpenSpec 僅是一個全域套件，以及一些位於您專案中的檔案。移除它需要幾個手動步驟，而這裡面的任何操作都不會觸及您的原始碼 (source code)。

**1. 移除全域套件：**

```bash
npm uninstall -g @fission-ai/openspec   # 或: pnpm rm -g / yarn global remove / bun rm -g
```

**2. 從專案中移除 OpenSpec（可選）。** 如果您不再需要其規格 (specs) 和變更記錄，請刪除 `openspec/` 目錄：

```bash
rm -rf openspec/
```

請三思後行：`openspec/specs/` 和 `openspec/changes/archive/` 是系統行為及其變化原因的記錄。如果您可能需要這些歷史記錄，即使在卸載之後也請保留該資料夾（或將其保留在 git 中）。

**3. 移除生成的 AI 工具檔案（可選）。** OpenSpec 會將技能和命令檔案寫入到每個工具的目錄中，例如 `.claude/skills/openspec-*/`、`.cursor/commands/opsx-*` 等。請刪除您所配置的工具對應的 `openspec-*` 技能和 `opsx-*` 命令。每個工具的確切路徑詳見 [Supported Tools](supported-tools.md)。

如果您在像 `CLAUDE.md` 或 `AGENTS.md` 這類檔案中也有 OpenSpec marker blocks，請手動移除這些區塊；您自己在這些檔案中的內容是屬於您的。

## 後續步驟

安裝完成後，請在您的專案中初始化 OpenSpec：

```bash
cd your-project
openspec init
```

請參閱 [Getting Started](getting-started.md) 以獲取完整的操作指南。