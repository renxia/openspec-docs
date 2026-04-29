# Kurulum

## Ön Gereksinimler

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

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Kurulum yapmadan OpenSpec'i doğrudan çalıştırın:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Veya profilinize kurun:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Veya `flake.nix` dosyasında geliştirme ortamınıza ekleyin:

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

## Kurulumu Doğrulama

```bash
openspec --version
```

## Sonraki Adımlar

Kurulumdan sonra, projenizde OpenSpec'i başlatın:

```bash
cd your-project
openspec init
```

Tam bir kullanım kılavuzu için [Başlangıç](getting-started.md) sayfasına bakın.