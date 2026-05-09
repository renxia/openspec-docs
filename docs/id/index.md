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
  - title: Alur Kerja Utamakan Spesifikasi
    details: Tentukan kebutuhan sebelum menulis kode.
  - title: Desain Native AI
    details: Dibangun untuk Claude Code, Cursor, Windsurf, dan lainnya.
  - title: Multi-Bahasa
    details: Dokumentasi tersedia dalam berbagai bahasa.
---


Filosofi kami:

```text
→ fleksibel bukan kaku
→ iteratif bukan waterfall
→ mudah bukan kompleks
→ dibangun untuk brownfield bukan hanya greenfield
→ dapat diskalakan dari proyek pribadi hingga perusahaan
```

> [!TIP]
> **Alur kerja baru kini tersedia!** Kami telah membangun ulang OpenSpec dengan alur kerja baru yang dipandu artefak.
>
> Jalankan `/opsx:propose "ide Anda"` untuk memulai. → [Pelajari lebih lanjut di sini](opsx.md)

<p align="center">
  Ikuti <a href="https://x.com/0xTab">@0xTab di X</a> untuk pembaruan · Bergabung dengan <a href="https://discord.gg/YctCnvvshC">Discord OpenSpec</a> untuk bantuan dan pertanyaan.
</p>

## Lihat dalam aksi

```text
Anda: /opsx:propose add-dark-mode
AI:  Membuat openspec/changes/add-dark-mode/
     ✓ proposal.md — mengapa kami melakukan ini, apa yang berubah
     ✓ specs/       — kebutuhan dan skenario
     ✓ design.md    — pendekatan teknis
     ✓ tasks.md     — daftar periksa implementasi
     Siap untuk implementasi!

Anda: /opsx:apply
AI:  Mengimplementasikan tugas...
     ✓ 1.1 Tambahkan penyedia konteks tema
     ✓ 1.2 Buat komponen toggle
     ✓ 2.1 Tambahkan variabel CSS
     ✓ 2.2 Hubungkan localStorage
     Semua tugas selesai!

Anda: /opsx:archive
AI:  Diarsipkan ke openspec/changes/archive/2025-01-23-add-dark-mode/
     Spesifikasi diperbarui. Siap untuk fitur berikutnya.
```

<details>
<summary><strong>Dasbor OpenSpec</strong></summary>
</details>

## Mulai Cepat

**Membutuhkan Node.js 20.19.0 atau lebih tinggi.**

Instal OpenSpec secara global:

```bash
npm install -g @fission-ai/openspec@latest
```

Kemudian navigasikan ke direktori proyek Anda dan inisialisasi:

```bash
cd your-project
openspec init
```

Sekarang beri tahu AI Anda: `/opsx:propose <apa-yang-ingin-anda-bangun>`

Jika Anda menginginkan alur kerja yang diperluas (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), pilih dengan `openspec config profile` dan terapkan dengan `openspec update`.

> [!NOTE]
> Tidak yakin apakah alat Anda didukung? [Lihat daftar lengkap](supported-tools.md) – kami mendukung 25+ alat dan terus bertambah.
>
> Juga berfungsi dengan pnpm, yarn, bun, dan nix. [Lihat opsi instalasi](installation.md).

## Dokumentasi

→ **[Memulai](getting-started.md)**: langkah pertama<br>
→ **[Alur Kerja](workflows.md)**: kombinasi dan pola<br>
→ **[Perintah](commands.md)**: perintah slash & keterampilan<br>
→ **[CLI](cli.md)**: referensi terminal<br>
→ **[Alat yang Didukung](supported-tools.md)**: integrasi alat & jalur instalasi<br>
→ **[Konsep](concepts.md)**: bagaimana semuanya cocok<br>
→ **[Multi-Bahasa](multi-language.md)**: dukungan multi-bahasa<br>
→ **[Kustomisasi](customization.md)**: buat milik Anda


## Mengapa OpenSpec?

Asisten pengkodean AI sangat kuat tetapi tidak dapat diprediksi ketika kebutuhan hanya ada dalam riwayat obrolan. OpenSpec menambahkan lapisan spesifikasi ringan sehingga Anda menyepakati apa yang akan dibangun sebelum kode apa pun ditulis.

- **Sepakati sebelum membangun** — manusia dan AI menyelaraskan spesifikasi sebelum kode ditulis
- **Tetap terorganisir** — setiap perubahan mendapatkan folder sendiri dengan proposal, spesifikasi, desain, dan tugas
- **Bekerja secara fleksibel** — perbarui artefak kapan saja, tanpa gerbang fase yang kaku
- **Gunakan alat Anda** — berfungsi dengan 20+ asisten AI melalui perintah slash

### Perbandingan kami

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Mendetail tetapi berat. Gerbang fase kaku, banyak Markdown, pengaturan Python. OpenSpec lebih ringan dan memungkinkan Anda beriterasi dengan bebas.

**vs. [Kiro](https://kiro.dev)** (AWS) — Kuat tetapi Anda terkunci ke IDE mereka dan terbatas pada model Claude. OpenSpec berfungsi dengan alat yang sudah Anda gunakan.

**vs. tanpa apa-apa** — Pengkodean AI tanpa spesifikasi berarti prompt yang samar dan hasil yang tidak dapat diprediksi. OpenSpec membawa prediktabilitas tanpa birokrasi.

## Memperbarui OpenSpec

**Tingkatkan paket**

```bash
npm install -g @fission-ai/openspec@latest
```

**Segarkan instruksi agen**

Jalankan ini di dalam setiap proyek untuk meregenerasi panduan AI dan memastikan perintah slash terbaru aktif:

```bash
openspec update
```

## Catatan Penggunaan

**Pemilihan model**: OpenSpec bekerja paling baik dengan model penalaran tinggi. Kami merekomendasikan Opus 4.5 dan GPT 5.2 untuk perencanaan dan implementasi.

**Kebersihan konteks**: OpenSpec mendapat manfaat dari jendela konteks yang bersih. Bersihkan konteks Anda sebelum memulai implementasi dan pertahankan kebersihan konteks yang baik sepanjang sesi Anda.

## Berkontribusi

**Perbaikan kecil** — Perbaikan bug, koreksi kesalahan ketik, dan peningkatan kecil dapat dikirimkan langsung sebagai PR.

**Perubahan lebih besar** — Untuk fitur baru, refaktorisasi signifikan, atau perubahan arsitektur, harap kirimkan proposal perubahan OpenSpec terlebih dahulu sehingga kami dapat menyelaraskan niat dan tujuan sebelum implementasi dimulai.

Saat menulis proposal, ingat filosofi OpenSpec: kami melayani berbagai pengguna di berbagai agen pengkodean, model, dan kasus penggunaan. Perubahan harus berfungsi dengan baik untuk semua orang.

**Kode yang dihasilkan AI diterima** — selama telah diuji dan diverifikasi. PR yang berisi kode yang dihasilkan AI harus menyebutkan agen pengkodean dan model yang digunakan (mis., "Dihasilkan dengan Claude Code menggunakan claude-opus-4-5-20251101").

### Pengembangan

- Instal dependensi: `pnpm install`
- Build: `pnpm run build`
- Tes: `pnpm test`
- Kembangkan CLI secara lokal: `pnpm run dev` atau `pnpm run dev:cli`
- Conventional commits (satu baris): `type(scope): subject`

## Lainnya

<details>
<summary><strong>Telemetri</strong></summary>

OpenSpec mengumpulkan statistik penggunaan anonim.

Kami hanya mengumpulkan nama perintah dan versi untuk memahami pola penggunaan. Tidak ada argumen, jalur, konten, atau PII. Secara otomatis dinonaktifkan di CI.

**Pilih keluar:** `export OPENSPEC_TELEMETRY=0` atau `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Pengelola & Penasihat</strong></summary>

Lihat [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) untuk daftar pengelola inti dan penasihat yang membantu membimbing proyek.

</details>



## Lisensi

MIT