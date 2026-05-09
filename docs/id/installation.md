# Instalasi

## Prasyarat

- **Node.js 20.19.0 atau lebih tinggi** — Periksa versi Anda: `node --version`

## Paket Manajer

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

Bun dapat menginstal OpenSpec secara global, tetapi OpenSpec saat ini berjalan di Node.js.
Anda tetap memerlukan Node.js 20.19.0 atau lebih tinggi yang tersedia di `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Jalankan OpenSpec langsung tanpa instalasi:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Atau instal ke profil Anda:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Atau tambahkan ke lingkungan pengembangan Anda di `flake.nix`:

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

## Verifikasi Instalasi

```bash
openspec --version
```

## Langkah Selanjutnya

Setelah menginstal, inisialisasi OpenSpec di proyek Anda:

```bash
cd your-project
openspec init
```

Lihat [Memulai](getting-started.md) untuk panduan lengkap.