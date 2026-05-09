# インストール

## 前提条件

- **Node.js 20.19.0 以上** — バージョンを確認: `node --version`

## パッケージマネージャー

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

Bun は OpenSpec をグローバルにインストールできますが、OpenSpec は現在 Node.js 上で動作します。
`PATH` に Node.js 20.19.0 以上が引き続き必要です。

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

インストールせずに直接 OpenSpec を実行:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

または、プロファイルにインストール:

```bash
nix profile install github:Fission-AI/OpenSpec
```

または、`flake.nix` で開発環境に追加:

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

## インストールの確認

```bash
openspec --version
```

## 次のステップ

インストール後、プロジェクト内で OpenSpec を初期化します:

```bash
cd your-project
openspec init
```

完全な手順については、[Getting Started](getting-started.md) を参照してください。