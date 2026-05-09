# 安裝

## 前置條件

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

Bun 可以全域安裝 OpenSpec，但 OpenSpec 目前運行於 Node.js 上。
您仍然需要在 `PATH` 中可用的 Node.js 20.19.0 或更高版本。

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

無需安裝即可直接運行 OpenSpec：

```bash
nix run github:Fission-AI/OpenSpec -- init
```

或安裝到您的設定檔：

```bash
nix profile install github:Fission-AI/OpenSpec
```

或將其添加到 `flake.nix` 中的開發環境：

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

## 後續步驟

安裝完成後，在您的專案中初始化 OpenSpec：

```bash
cd your-project
openspec init
```

完整操作指南請參閱[快速入門](getting-started.md)。