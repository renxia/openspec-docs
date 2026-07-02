# Dokumentasi OpenSpec

Selamat datang. Ini adalah pusat dari segala hal tentang OpenSpec.

OpenSpec membantu Anda dan asisten coding AI Anda **untuk menyepakati apa yang harus dibangun sebelum kode apa pun ditulis.** Anda mendeskripsikan perubahannya, AI membuat draf spesifikasi singkat dan daftar tugas, kalian berdua melihat rencana yang sama, dan kemudian pekerjaan itu dilakukan. Tidak ada lagi penemuan di tengah jalan bahwa AI telah membangun hal yang salah.

Jika Anda tidak membaca hal lain, bacalah dua halaman ini:

1. [Getting Started](getting-started.md): instalasi, inisialisasi, dan kirimkan perubahan pertama Anda.
2. [How Commands Work](how-commands-work.md): tempat Anda benar-benar mengetik `/opsx:propose` (petunjuk: di obrolan AI Anda, bukan di terminal). Ini menjebak hampir semua orang pada awalnya.

Hal kedua itu lebih penting daripada kelihatannya. OpenSpec memiliki dua bagian: alat baris perintah yang Anda jalankan di terminal, dan perintah slash yang Anda berikan kepada asisten AI Anda. Mengetahui mana yang mana akan menghemat momen kebingungan yang paling umum.

> **Kebiasaan terbaik untuk dibangun terlebih dahulu: ketika Anda tidak yakin apa yang harus dibangun, mulailah dengan `/opsx:explore`.** Ini adalah mitra berpikir tanpa risiko yang membaca kode Anda, menimbang pilihan, dan mempertajam ide yang kabur menjadi rencana konkret sebelum ada artefak atau kode yang ada. Panduan [Explore First](explore.md) menjadikannya sebuah argumen.

## Pilih jalur Anda

**Saya benar-benar baru.** Mulailah dengan [Getting Started](getting-started.md), lalu lihat sekilas [Core Concepts at a Glance](overview.md). Ketika sesuatu terasa misterius, [FAQ](faq.md) dan [Glossary](glossary.md) ada di dekatnya.

**Saya punya masalah tetapi belum punya rencana.** Ini adalah kasus yang umum, dan ini memiliki jawaban khusus: [Explore First](explore.md). Gunakan `/opsx:explore` untuk memikirkannya bersama AI sebelum berkomitmen pada apa pun.

**Saya memiliki codebase yang besar yang sudah ada.** Anda tidak mendokumentasikan semuanya. [Using OpenSpec in an Existing Project](existing-projects.md) menunjukkan cara memulai pada kode *brownfield* (kode lama) yang nyata tanpa harus menyelesaikan segalanya sekaligus.

**Saya hanya ingin membuatnya berfungsi.** [Install](installation.md), jalankan `openspec init`, lalu baca [How Commands Work](how-commands-work.md) agar perintah slash pertama Anda mendarat di tempat yang benar.

**Saya belajar dari contoh.** Halaman [Examples & Recipes](examples.md) membahas perubahan nyata dari awal hingga akhir: fitur kecil, perbaikan bug, refactor, atau eksplorasi.

**Saya berasal dari alur kerja lama.** [Migration Guide](migration-guide.md) menjelaskan apa yang berubah dan mengapa, serta menjaminkan bahwa pekerjaan Anda yang sudah ada aman.

**Saya ingin menyesuaikannya dengan proses tim saya.** [Customization](customization.md) mencakup konfigurasi proyek, skema kustom, dan konteks bersama.

**Ada yang rusak.** [Troubleshooting](troubleshooting.md) mengumpulkan kegagalan yang benar-benar dialami orang, beserta perbaikannya.

## Peta lengkap

### Mulai di sini

| Dokumen | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [Getting Started](getting-started.md) | Instalasi, inisialisasi, dan menjalankan perubahan pertama Anda dari awal hingga akhir |
| [Explore First](explore.md) | Gunakan `/opsx:explore` untuk memikirkan sebuah ide sebelum Anda berkomitmen |
| [How Commands Work](how-commands-work.md) | Di mana perintah slash berjalan, apa artinya "mode interaktif", terminal vs obrolan |
| [Core Concepts at a Glance](overview.md) | Seluruh model mental dalam satu halaman: spesifikasi, perubahan, delta, arsip |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix, dan cara memverifikasi bahwa itu berhasil |

### Gunakan sehari-hari

| Dokumen | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [Workflows](workflows.md) | Pola umum dan kapan harus menggunakan setiap perintah |
| [Examples & Recipes](examples.md) | Panduan lengkap perubahan nyata, siap untuk disalin-tempel |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Mengadopsi OpenSpec pada codebase *brownfield* yang besar |
| [Editing & Iterating on a Change](editing-changes.md) | Memperbarui artefak, kembali ke belakang, merekonsiliasi pengeditan manual |
| [Commands](commands.md) | Referensi untuk setiap perintah slash `/opsx:*` |
| [CLI](cli.md) | Referensi untuk setiap perintah terminal `openspec` |

### Pahami secara mendalam

| Dokumen | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [Concepts](concepts.md) | Penjelasan panjang tentang spesifikasi, perubahan, artefak, skema, dan arsip |
| [OPSX Workflow](opsx.md) | Mengapa alur kerja ini cair (fluid) daripada terkunci fase, ditambah pendalaman arsitektur |
| [Glossary](glossary.md) | Setiap istilah didefinisikan di satu tempat |

### Jadikan milik Anda

| Dokumen | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [Customization](customization.md) | Konfigurasi proyek, skema kustom, konteks bersama |
| [Multi-Language](multi-language.md) | Menghasilkan artefak dalam bahasa selain Inggris |
| [Supported Tools](supported-tools.md) | Lebih dari 25 alat AI yang diintegrasikan dengan OpenSpec, dan ke mana file akan ditempatkan |

### Ketika Anda membutuhkan bantuan

| Dokumen | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [FAQ](faq.md) | Jawaban cepat untuk pertanyaan yang paling sering diajukan orang |
| [Troubleshooting](troubleshooting.md) | Perbaikan konkret untuk kegagalan yang nyata |
| [Migration Guide](migration-guide.md) | Pindah dari alur kerja lama ke OPSX |

### Koordinasi antar repos (beta)

| Dokumen | Apa yang diberikannya kepada Anda |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Merencanakan di repo sendiri ketika pekerjaan Anda mencakup beberapa repos atau tim |
| [Agent Contract](agent-contract.md) | Antarmuka CLI yang dapat dibaca mesin yang digerakkan oleh agen |

## Versi tiga puluh detik

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (di obrolan AI Anda)  /opsx:explore           ← opsional, tetapi kebiasaan yang bagus
4. Propose        (di obrolan AI Anda)  /opsx:propose add-dark-mode
5. Build          (di obrolan AI Anda)  /opsx:apply
6. Archive        (di obrolan AI Anda)  /opsx:archive
```

Langkah 1 dan 2 terjadi di terminal Anda. Sisanya terjadi di obrolan asisten AI Anda. Pemisahan inilah satu hal yang layak diingat, dan [How Commands Work](how-commands-work.md) menjelaskan mengapa secara tepat. Langkah 3 bersifat opsional, tetapi memulai dengan `/opsx:explore` ketika Anda tidak yakin adalah kebiasaan yang paling berharga untuk dibentuk.

## Di mana lagi mencari bantuan

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) untuk pertanyaan, ide, dan bantuan.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) untuk bug dan permintaan fitur.
- **`openspec feedback "pesan Anda"`** mengirimkan umpan balik langsung dari terminal Anda (ini membuka isu GitHub).

Menemukan sesuatu di dokumentasi ini yang salah, usang, atau membingungkan? Itu adalah bug. Buka isu atau PR. Peningkatan dokumentasi adalah beberapa kontribusi paling berharga yang dapat Anda lakukan.