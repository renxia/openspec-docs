---
layout: home

hero:
  name: "OpenSpec"
  text: "Pengembangan Berbasis Spesifikasi untuk Asisten AI"
  tagline: Spesifikasi ringan untuk membangun dan mengelola proyek asisten AI.
  actions:
    - theme: brand
      text: Mulai
      link: ./getting-started
    - theme: alt
      text: Beranda
      link: /
features:
  - title: Alur Kerja Spesifikasi Terlebih Dahulu
    details: Tentukan persyaratan sebelum menulis kode.
  - title: Desain Native AI
    details: Dibangun untuk Claude Code, Cursor, Windsurf, dan banyak lagi.
  - title: Multi-Bahasa
    details: Dokumentasi tersedia dalam berbagai bahasa.
---

# Dokumentasi OpenSpec

Selamat datang. Ini adalah rumah untuk segala hal tentang OpenSpec.

OpenSpec membantu Anda dan asisten coding AI Anda **sepakat tentang apa yang akan dibangun sebelum ada kode yang ditulis.** Anda menjelaskan perubahan yang diinginkan, AI membuat draf spesifikasi singkat dan daftar tugas, Anda berdua melihat rencana yang sama, kemudian pekerjaan dimulai. Tidak ada lagi penemuan di tengah jalan bahwa AI telah membangun hal yang salah.

Jika Anda tidak bisa membaca yang lain, baca dua halaman ini:

1. [Memulai](getting-started.md): instal, inisialisasi, dan rilis perubahan pertama Anda.
2. [Cara Perintah Bekerja](how-commands-work.md): tempat Anda benar-benar mengetik `/opsx:propose` (petunjuk: di chat AI Anda, bukan di terminal). Ini membuat hampir semua orang tersandung setidaknya sekali.

Yang kedua itu lebih penting daripada yang terlihat. OpenSpec memiliki dua bagian: alat baris perintah yang Anda jalankan di terminal, dan perintah slash yang Anda berikan ke asisten AI Anda. Mengetahui mana yang mana akan menyelamatkan Anda dari kebingungan yang paling umum terjadi.

> **Kebiasaan terbaik yang harus dibangun terlebih dahulu: ketika Anda tidak yakin harus membangun apa, mulailah dengan `/opsx:explore`.** Ini adalah mitra berpikir tanpa risiko yang membaca kode Anda, menimbang pilihan, dan mengasah ide yang kabur menjadi rencana konkret sebelum ada artefak atau kode yang dibuat. Panduan [Jelajahi Terlebih Dahulu](explore.md) menjelaskan mengapa.

## Pilih jalur Anda

**Saya sama sekali baru.** Mulailah dengan [Memulai](getting-started.md), kemudian lihat sekilas [Konsep Inti dalam Sekilas](overview.md). Ketika ada yang terasa misterius, [FAQ](faq.md) dan [Glosarium](glossary.md) ada di dekat Anda.

**Saya punya masalah tapi tidak punya rencana.** Ini adalah kasus yang umum, dan ada jawaban khusus untuknya: [Jelajahi Terlebih Dahulu](explore.md). Gunakan `/opsx:explore` untuk memikirkan masalah itu bersama AI sebelum berkomitmen pada apapun.

**Saya punya basis kode besar yang sudah ada.** Anda tidak perlu mendokumentasikan semuanya. [Menggunakan OpenSpec di Proyek yang Sudah Ada](existing-projects.md) menunjukkan cara memulai dengan kode brownfield yang nyata tanpa harus mengerjakan seluruhnya sekaligus yang membutuhkan usaha besar.

**Saya hanya ingin membuatnya berjalan.** [Instal](installation.md), jalankan `openspec init`, kemudian baca [Cara Perintah Bekerja](how-commands-work.md) agar perintah slash pertama Anda masuk ke tempat yang benar.

**Saya belajar dengan contoh.** Halaman [Contoh & Resep](examples.md) memandu perubahan nyata dari awal sampai akhir: fitur kecil, perbaikan bug, refaktor, dan eksplorasi.

**AI baru saja membuat draf rencana — sekarang apa?** Baca rencana tersebut. [Meninjau Perubahan](reviewing-changes.md) menunjukkan tinjauan dua menit yang bisa menangkap kesalahan arah ketika biayanya masih murah, dan [Menulis Spesifikasi yang Baik](writing-specs.md) membahas apa yang membuat rencana layak disetujui.

**Saya bekerja di tim.** [OpenSpec di Tim](team-workflow.md) menunjukkan bagaimana perubahan dipetakan ke cabang dan pull request, serta bagaimana anggota tim meninjau rencana sebelum kode ditulis.

**Saya datang dari alur kerja lama.** [Panduan Migrasi](migration-guide.md) menjelaskan apa yang berubah dan mengapa, serta menjamin bahwa pekerjaan Anda yang sudah ada tetap aman.

**Saya ingin menyesuaikannya dengan proses tim saya.** [Kustomisasi](customization.md) membahas konfigurasi proyek, skema kustom, dan konteks bersama.

**Ada yang rusak.** [Pemecahan Masalah](troubleshooting.md) mengumpulkan kesalahan yang benar-benar dihadapi orang-orang, beserta perbaikannya.

## Peta lengkap

### Mulai dari sini

| Dokumen | Apa yang Anda dapatkan |
|---------|------------------------|
| [Memulai](getting-started.md) | Instal, inisialisasi, dan jalankan perubahan pertama Anda dari awal sampai akhir |
| [Jelajahi Terlebih Dahulu](explore.md) | Gunakan `/opsx:explore` untuk memikirkan sebuah ide sebelum Anda berkomitmen |
| [Cara Perintah Bekerja](how-commands-work.md) | Tempat perintah slash dijalankan, arti dari "mode interaktif", perbandingan terminal dan chat |
| [Konsep Inti dalam Sekilas](overview.md) | Seluruh model mental dalam satu halaman: spesifikasi, perubahan, delta, arsip |
| [Instalasi](installation.md) | npm, pnpm, yarn, bun, Nix, dan cara memverifikasi bahwa instalasi berhasil |

### Gunakan sehari-hari

| Dokumen | Apa yang Anda dapatkan |
|---------|------------------------|
| [Alur Kerja](workflows.md) | Pola umum dan kapan menggunakan setiap perintah |
| [Contoh & Resep](examples.md) | Panduan lengkap perubahan nyata, bisa disalin dan ditempel |
| [Menulis Spesifikasi yang Baik](writing-specs.md) | Bentuk dari persyaratan dan skenario yang kuat, serta cara menentukan ukuran perubahan yang tepat |
| [Meninjau Perubahan](reviewing-changes.md) | Tinjauan dua menit terhadap rencana draf sebelum ada kode yang ditulis |
| [OpenSpec di Tim](team-workflow.md) | Bagaimana perubahan sesuai dengan cabang, pull request, dan proses peninjauan |
| [Menggunakan OpenSpec di Proyek yang Sudah Ada](existing-projects.md) | Mengadopsi OpenSpec pada basis kode brownfield yang besar |
| [Mengedit & Mengulangi Perubahan](editing-changes.md) | Memperbarui artefak, kembali ke tahap sebelumnya, menyesuaikan edit manual |
| [Perintah](commands.md) | Referensi untuk setiap perintah slash `/opsx:*` |
| [CLI](cli.md) | Referensi untuk setiap perintah terminal `openspec` |

### Pahami lebih dalam

| Dokumen | Apa yang Anda dapatkan |
|---------|------------------------|
| [Konsep](concepts.md) | Penjelasan panjang tentang spesifikasi, perubahan, artefak, skema, dan arsip |
| [Alur Kerja OPSX](opsx.md) | Mengapa alur kerja ini fleksibel bukan fase yang dikunci, serta penjelasan arsitektur yang mendalam |
| [Glosarium](glossary.md) | Setiap istilah didefinisikan di satu tempat |

### Sesuaikan dengan kebutuhan Anda

| Dokumen | Apa yang Anda dapatkan |
|---------|------------------------|
| [Kustomisasi](customization.md) | Konfigurasi proyek, skema kustom, konteks bersama |
| [Multi-Bahasa](multi-language.md) | Hasilkan artefak dalam bahasa selain Inggris |
| [Alat yang Didukung](supported-tools.md) | Lebih dari 25 alat AI yang terintegrasi dengan OpenSpec, dan tempat file disimpan |

### Ketika Anda membutuhkan bantuan

| Dokumen | Apa yang Anda dapatkan |
|---------|------------------------|
| [FAQ](faq.md) | Jawaban cepat untuk pertanyaan yang paling banyak diajukan |
| [Pemecahan Masalah](troubleshooting.md) | Perbaikan konkret untuk kesalahan konkret |
| [Panduan Migrasi](migration-guide.md) | Beralih dari alur kerja lama ke OPSX |

### Koordinasi di seluruh repo (beta)

| Dokumen | Apa yang Anda dapatkan |
|---------|------------------------|
| [Stores: Panduan Pengguna](stores-beta/user-guide.md) | Buat rencana di repo sendiri ketika pekerjaan Anda mencakup banyak repo atau tim |
| [Kontrak Agen](agent-contract.md) | Antarmuka CLI yang dapat dibaca mesin yang diakses oleh agen |

## Versi tiga puluh detik

```text
1. Instal        npm install -g @fission-ai/openspec@latest
2. Inisialisasi     cd your-project && openspec init
3. Jelajahi        (di chat AI Anda)  /opsx:explore           ← opsional, tetapi kebiasaan yang sangat bagus
4. Ajukan        (di chat AI Anda)  /opsx:propose add-dark-mode
5. Bangun        (di chat AI Anda)  /opsx:apply
6. Arsipkan        (di chat AI Anda)  /opsx:archive
```

Langkah 1 dan 2 dilakukan di terminal Anda. Sisanya dilakukan di chat asisten AI Anda. Pemisahan itu adalah satu hal yang layak dihafal, dan [Cara Perintah Bekerja](how-commands-work.md) menjelaskan mengapa secara tepat. Langkah 3 adalah opsional, tetapi memulai dengan `/opsx:explore` ketika Anda tidak yakin adalah kebiasaan yang paling layak dibentuk.

## Tempat lain untuk mendapatkan bantuan

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) untuk pertanyaan, ide, dan bantuan.
- **Isu GitHub:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) untuk bug dan permintaan fitur.
- **`openspec feedback "pesan Anda"`** mengirimkan umpan balik langsung dari terminal Anda (ini akan membuka isu GitHub).

Menemukan sesuatu di dokumen ini yang salah, usang, atau membingungkan? Itu adalah bug. Buka isu atau PR. Peningkatan dokumentasi adalah salah satu kontribusi yang paling berharga yang dapat Anda berikan.