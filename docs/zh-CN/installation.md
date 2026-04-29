# 安装指南

## 前提条件

- **Node.js 20.19.0 或更高版本** — 检查您的版本：`node --version`

## 包管理器

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

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

无需安装即可直接运行 OpenSpec：

```bash
nix run github:Fission-AI/OpenSpec -- init
```

或将其安装到您的配置文件中：

```bash
nix profile install github:Fission-AI/OpenSpec
```

或在 `flake.nix` 中将其添加到您的开发环境：

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

## 验证安装

```bash
openspec --version
```

## 后续步骤

安装完成后，在您的项目中初始化 OpenSpec：

```bash
cd your-project
openspec init
```

完整操作指南请参阅[入门指南](getting-started.md)。