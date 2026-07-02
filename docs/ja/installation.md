# インストール

## 前提条件

- **Node.js 20.19.0 以降ろし** — バージョンを確認するには：`node --version`

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

Bun は OpenSpec をグローバルにインストールできますが、OpenSpec は現在 Node.js 上で動作します。引き続き、`PATH` に Node.js 20.19.0 以降ろしが存在する必要があります。

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

インストールせずに OpenSpec を直接実行します：

```bash
nix run github:Fission-AI/OpenSpec -- init
```

またはプロファイルにインストールします：

```bash
nix profile install github:Fission-AI/OpenSpec
```

または`flake.nix`に開発環境として追加します：

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

## アップデート

パッケージをアップグレードした後、各プロジェクトの生成されたファイルをリフレッシュします：

```bash
npm install -g @fission-ai/openspec@latest   # or pnpm/yarn/bun equivalent
openspec update                              # run inside each project
```

`openspec update` は、設定したツールのスキルおよびコマンドファイルを再生成するため、スラッシュコマンドがインストールされたバージョンと同期していることを保証します。

## アンインストール

`openspec uninstall` というコマンドはありません。なぜなら、OpenSpec はグローバルパッケージとプロジェクト内のいくつかのファイルで構成されているからです。削除にはいくつかの手動ステップが必要ですが、ここではソースコードに触れるものは何もありません。

**1. グローバルパッケージの削除:**

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

**2. プロジェクトからの OpenSpec 削除（オプション）。** スキルや変更履歴が不要になった場合は、`openspec/` ディレクトリを削除してください：

```bash
rm -rf openspec/
```

これを行う前に熟考してください：`openspec/specs/` および `openspec/changes/archive/` は、システムがどのように振る舞い、なぜ変更されたのかという記録です。その履歴が必要になる可能性がある場合は、アンインストール後でもフォルダを保持するか（Gitに保存する）、いずれかの方法で対応してください。

**3. 生成された AI ツールファイルの削除（オプション）。** OpenSpec は、`.claude/skills/openspec-*/`、`.cursor/commands/opsx-*` のようなツールごとのディレクトリにスキルおよびコマンドファイルを書き込みます。設定したツールのいずれかについている `openspec-*` スキルと `opsx-*` コマンドを削除してください。各ツールに関する正確なパスは [Supported Tools](supported-tools.md) に記載されています。

もし `CLAUDE.md` や `AGENTS.md` のようなファイルに OpenSpec マーカーブロックがある場合は、それらのブロックを手動で削除してください。これらのファイル内の独自のコンテンツは保持されます。

## 次のステップ

インストール後、プロジェクトで OpenSpec を初期化します：

```bash
cd your-project
openspec init
```

完全な手順については [Getting Started](getting-started.md) を参照してください。