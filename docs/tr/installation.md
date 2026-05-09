# Kurulum

## Ön Koşullar

- **Node.js 20.19.0 veya üzeri** — Sürümünüzü kontrol edin: `node --version`

## Paket Yöneticileri

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

Bun, OpenSpec'i global olarak yükleyebilir, ancak OpenSpec şu anda Node.js üzerinde çalışmaktadır.
`PATH`'de hâlâ Node.js 20.19.0 veya üzeri sürümün bulunması gerekmektedir.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

OpenSpec'i yüklemeden doğrudan çalıştırın:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Veya profilinize yükleyin:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Veya `flake.nix` dosyanızdaki geliştirme ortamınıza ekleyin:

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

## Kurulumu Doğrulayın

```bash
openspec --version
```

## Sonraki Adımlar

Kurulumdan sonra, projenizde OpenSpec'i başlatın:

```bash
cd your-project
openspec init
```

Tam bir kılavuz için [Başlarken](getting-started.md) bölümüne bakın.