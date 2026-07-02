# 安装

## 先决条件

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

Bun 可以全局安装 OpenSpec，但 OpenSpec 目前是在 Node.js 上运行的。
您仍然需要确保 `PATH` 中有 Node.js 20.19.0 或更高版本可用。

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

直接运行 OpenSpec，无需安装：

```bash
nix run github:Fission-AI/OpenSpec -- init
```

或者将其安装到您的配置文件中：

```bash
nix profile install github:Fission-AI/OpenSpec
```

或者在 `flake.nix` 中添加到您的开发环境：

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

## 更新

升级该包，然后刷新每个项目的生成文件：

```bash
npm install -g @fission-ai/openspec@latest   # 或 pnpm/yarn/bun 等同命令
openspec update                              # 在每个项目中运行
```

`openspec update` 会重新生成您已配置工具的技能和命令文件，从而确保您的斜杠（slash）命令与已安装的版本保持同步。

## 卸载

没有 `openspec uninstall` 命令，因为 OpenSpec 只是一个全局包以及项目中的一些文件。移除它需要进行几个手动步骤，而这里面的操作都不会触及您的源代码。

**1. 移除全局包：**

```bash
npm uninstall -g @fission-ai/openspec   # 或: pnpm rm -g / yarn global remove / bun rm -g
```

**2. 从项目中移除 OpenSpec（可选）。** 如果您不再需要其规范和更改，请删除 `openspec/` 目录：

```bash
rm -rf openspec/
```

请三思而后行：`openspec/specs/` 和 `openspec/changes/archive/` 是系统行为及其变化原因的记录。如果您可能需要这些历史记录，即使在卸载后也请保留该文件夹（或将其保存在 git 中）。

**3. 移除生成的 AI 工具文件（可选）。** OpenSpec 会将技能和命令文件写入到每个工具的目录中，例如 `.claude/skills/openspec-*/`、`.cursor/commands/opsx-*` 等。请删除您配置的工具对应的 `openspec-*` 技能和 `opsx-*` 命令。每个工具的确切路径列在 [支持的工具](supported-tools.md) 中。

如果您在像 `CLAUDE.md` 或 `AGENTS.md` 这样的文件中也有 OpenSpec 标记块，请手动移除这些标记块；您自己在这些文件中的内容是属于您的。

## 后续步骤

安装完成后，请在项目中初始化 OpenSpec：

```bash
cd your-project
openspec init
```

请参阅 [入门指南](getting-started.md) 以获取完整的操作流程。