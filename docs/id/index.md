---
layout: home

hero:
  name: "OpenSpec"
  text: "Pengembangan Berbasis Spesifikasi untuk Asisten AI"
  tagline: Spek ringan untuk membangun dan mengelola proyek asisten AI.
  actions:
    - theme: brand
      text: Mulai Sekarang
      link: ./getting-started
    - theme: alt
      text: Beranda
      link: /

features:
  - title: Alur Kerja Spec-First
    details: Tentukan persyaratan sebelum menulis kode.
  - title: Desain AI-Native
    details: Dibangun untuk Claude Code, Cursor, Windsurf, dan lainnya.
  - title: Multi-Bahasa
    details: Dokumentasi tersedia dalam berbagai bahasa.
---

# Dokumentasi OpenSpec

Selamat datang. Ini adalah pusat dari segala hal tentang OpenSpec.

OpenSpec membantu Anda dan asisten pengkodean AI Anda **sepakat tentang apa yang akan dibangun sebelum kode apa pun ditulis.** Anda mendeskripsikan perubahannya, AI membuat draf spek singkat dan daftar tugas, Anda berdua melihat rencana yang sama, dan kemudian pekerjaan dilakukan. Tidak ada lagi penemuan di tengah jalan bahwa AI telah membangun hal yang salah.

Jika Anda tidak membaca hal lain, bacalah dua halaman ini:

1. [Getting Started](getting-started.md): instalasi, inisialisasi, dan kirim perubahan pertama Anda.
2. [How Commands Work](how-commands-work.md): tempat Anda benar-benar mengetik `/opsx:propose` (petunjuk: di obrolan AI Anda, bukan terminal). Ini menjebak hampir semua orang sekali.

Yang kedua lebih penting daripada kelihatannya. OpenSpec memiliki dua bagian: alat baris perintah yang Anda jalankan di terminal, dan perintah slash yang Anda berikan kepada asisten AI Anda. Mengetahui mana yang mana menghemat kebingungan paling umum.

> **Kebiasaan terbaik untuk dibangun pertama: ketika Anda tidak yakin apa yang akan dibangun, mulailah dengan `/opsx:explore`.** Ini adalah mitra berpikir tanpa risiko yang membaca kode Anda, menimbang opsi, dan mempertajam ide samar menjadi rencana konkret sebelum ada artefak atau kode yang ada. Panduan [Explore First](explore.md) menyampaikannya.

## Pilih jalur Anda

**Saya benar-benar baru.** Mulailah dengan [Getting Started](getting-started.md), lalu baca sekilas [Core Concepts at a Glance](overview.md). Jika sesuatu terasa misterius, [FAQ](faq.md) dan [Glossary](glossary.md) ada di dekatnya.

**Saya punya masalah tetapi belum punya rencana.** Ini adalah kasus yang umum, dan ini memiliki jawaban khusus: [Explore First](explore.md). Gunakan `/opsx:explore` untuk memikirkannya bersama AI sebelum berkomitmen pada apa pun.

**Saya memiliki basis kode besar yang sudah ada.** Anda tidak mendokumentasikan semuanya. [Using OpenSpec in an Existing Project](existing-projects.md) menunjukkan cara memulai pada kode *brownfield* yang nyata tanpa membuat masalah terlalu rumit.

**Saya hanya ingin membuatnya berfungsi.** [Install](installation.md), jalankan `openspec init`, lalu baca [How Commands Work](how-commands-work.md) agar perintah slash pertama Anda mendarat di tempat yang benar.

**Saya belajar dari contoh.** Halaman [Examples & Recipes](examples.md) memandu melalui perubahan nyata dari awal hingga akhir: fitur kecil, perbaikan bug, refactoring, eksplorasi.

**Saya datang dari alur kerja lama.** [Migration Guide](migration-guide.md) menjelaskan apa yang berubah dan mengapa, serta menjanjikan bahwa pekerjaan Anda yang sudah ada aman.

**Saya ingin menyesuaikannya dengan proses tim saya.** [Customization](customization.md) mencakup konfigurasi proyek, skema kustom, dan konteks bersama.

**Ada yang rusak.** [Troubleshooting](troubleshooting.md) mengumpulkan kegagalan yang benar-benar dialami orang, lengkap dengan perbaikannya.

## Peta keseluruhan

### Mulai di sini

| Doc | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [Getting Started](getting-started.md) | Instalasi, inisialisasi, dan jalankan perubahan pertama Anda dari awal hingga akhir |
| [Explore First](explore.md) | Gunakan `/opsx:explore` untuk memikirkan ide sebelum Anda berkomitmen |
| [How Commands Work](how-commands-work.md) | Di mana perintah slash berjalan, apa arti "mode interaktif", terminal vs obrolan |
| [Core Concepts at a Glance](overview.md) | Seluruh model mental dalam satu halaman: spek, perubahan, delta, arsip |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix, dan cara memverifikasi bahwa itu berhasil |

### Gunakan sehari-hari

| Doc | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [Workflows](workflows.md) | Pola umum dan kapan harus menggunakan setiap perintah |
| [Examples & Recipes](examples.md) | Panduan lengkap perubahan nyata, siap disalin-tempel |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Mengadopsi OpenSpec pada basis kode *brownfield* yang besar |
| [Editing & Iterating on a Change](editing-changes.md) | Perbarui artefak, kembali, rekonsiliasi pengeditan manual |
| [Commands](commands.md) | Referensi untuk setiap perintah slash `/opsx:*` |
| [CLI](cli.md) | Referensi untuk setiap perintah terminal `openspec` |

### Pahami secara mendalam

| Doc | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [Concepts](concepts.md) | Penjelasan panjang tentang spek, perubahan, artefak, skema, dan arsip |
| [OPSX Workflow](opsx.md) | Mengapa alur kerja itu cair daripada terkunci fase, ditambah pendalaman arsitektur |
| [Glossary](glossary.md) | Setiap istilah yang didefinisikan di satu tempat |

### Jadikan milik Anda

| Doc | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [Customization](customization.md) | Konfigurasi proyek, skema kustom, konteks bersama |
| [Multi-Language](multi-language.md) | Menghasilkan artefak dalam bahasa selain Inggris |
| [Supported Tools](supported-tools.md) | 25+ alat AI yang diintegrasikan dengan OpenSpec, dan tempat berkas mendarat |

### Saat Anda membutuhkan bantuan

| Doc | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [FAQ](faq.md) | Jawaban cepat untuk pertanyaan yang paling sering diajukan orang |
| [Troubleshooting](troubleshooting.md) | Perbaikan konkret untuk kegagalan yang nyata |
| [Migration Guide](migration-guide.md) | Pindah dari alur kerja lama ke OPSX |

### Koordinasi antar repos (beta)

| Doc | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Rencana di repo sendiri ketika pekerjaan Anda mencakup beberapa repos atau tim |
| [Agent Contract](agent-contract.md) | Permukaan CLI yang dapat dibaca mesin yang dikendalikan agen |

## Versi tiga puluh detik

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (di obrolan AI Anda)  /opsx:explore           ← opsional, tetapi kebiasaan yang bagus
4. Propose        (di obrolan AI Anda)  /opsx:propose add-dark-mode
5. Build          (di obrolan AI Anda)  /opsx:apply
6. Archive        (di obrolan AI Anda)  /opsx:archive
```

Langkah 1 dan 2 terjadi di terminal Anda. Sisanya terjadi di obrolan asisten AI Anda. Perpecahan inilah yang layak diingat, dan [How Commands Work](how-commands-work.md) menjelaskan mengapa secara tepat. Langkah 3 opsional, tetapi memulai dengan `/opsx:explore` ketika Anda tidak yakin adalah kebiasaan yang paling berharga untuk dibentuk.

## Di mana lagi mencari bantuan

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) untuk pertanyaan, ide, dan bantuan.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) untuk bug dan permintaan fitur.
- **`openspec feedback "pesan Anda"`** mengirimkan umpan balik langsung dari terminal Anda (ini membuka isu GitHub).

Menemukan sesuatu di dokumentasi ini yang salah, usang, atau membingungkan? Itu adalah bug. Buka isu atau PR. Peningkatan dokumentasi adalah beberapa kontribusi paling berharga yang dapat Anda buat.