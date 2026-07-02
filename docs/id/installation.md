# Instalasi

## Prasyarat

- **Node.js 20.19.0 atau lebih tinggi** — Periksa versi Anda: `node --version`

## Manajer Paket

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

Bun dapat menginstal OpenSpec secara global, tetapi OpenSpec saat ini berjalan di Node.js. Anda tetap memerlukan Node.js 20.19.0 atau lebih tinggi yang tersedia di `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Jalankan OpenSpec secara langsung tanpa instalasi:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Atau instal ke profil Anda:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Atau tambahkan ke lingkungan pengembangan di `flake.nix`:

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

## Pembaruan

Tingkatkan paketnya, lalu perbarui file yang dihasilkan oleh setiap proyek:

```bash
npm install -g @fission-ai/openspec@latest   # atau setara pnpm/yarn/bun
openspec update                              # jalankan di dalam setiap proyek
```

`openspec update` meregenerasi file skill dan command untuk tools yang telah Anda konfigurasikan, sehingga perintah slash Anda tetap sesuai dengan versi yang terinstal.

## Penghapusan Instalasi

Tidak ada perintah `openspec uninstall`, karena OpenSpec hanyalah paket global ditambah beberapa file di proyek Anda. Menghapusnya memerlukan beberapa langkah manual, dan tidak ada yang di sini menyentuh kode sumber Anda.

**1. Hapus paket global:**

```bash
npm uninstall -g @fission-ai/openspec   # atau: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Hapus OpenSpec dari sebuah proyek (opsional).** Hapus direktori `openspec/` jika Anda tidak lagi menginginkan specs dan perubahannya:

```bash
rm -rf openspec/
```

Pikirkan baik-baik sebelum melakukan ini: `openspec/specs/` dan `openspec/changes/archive/` adalah catatan tentang bagaimana sistem berperilaku dan mengapa hal itu berubah. Jika Anda mungkin menginginkan riwayat tersebut, simpan folder tersebut (atau simpan di git) bahkan setelah menghapus instalasi.

**3. Hapus file tool AI yang dihasilkan (opsional).** OpenSpec menulis file skill dan command ke dalam direktori per-tool seperti `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*`, dan sebagainya. Hapus skill `openspec-*` dan command `opsx-*` untuk tool mana pun yang Anda konfigurasikan. Jalur yang tepat per tool tercantum di [Supported Tools](supported-tools.md).

Jika Anda juga memiliki blok penanda OpenSpec di file seperti `CLAUDE.md` atau `AGENTS.md`, hapus blok tersebut secara manual; konten Anda sendiri di dalam file tersebut adalah milik Anda untuk disimpan.

## Langkah Selanjutnya

Setelah menginstal, inisialisasi OpenSpec di proyek Anda:

```bash
cd your-project
openspec init
```

Lihat [Getting Started](getting-started.md) untuk panduan lengkap.