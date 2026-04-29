---
layout: home

hero:
  name: "OpenSpec"
  text: "Spesifikasi-Driven Development untuk Asisten AI"
  tagline: Spesifikasi ringan untuk membangun dan mengelola proyek asisten AI.
  actions:
    - theme: brand
      text: Mulai
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


<details>
<summary><strong>Framework spesifikasi paling disukai.</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
Filosofi kami:

```text
→ fluida bukan kaku
→ iteratif bukan waterfall
→ mudah bukan kompleks
→ dibangun untuk brownfield bukan hanya greenfield
→ dapat diskalakan dari proyek pribadi hingga enterprise
```

> [!TIP]
> **Alur kerja baru tersedia!** Kami telah membangun kembali OpenSpec dengan alur kerja artifact-guided yang baru.
>
> Jalankan `/opsx:propose "ide Anda"` untuk memulai. → [Pelajari lebih lanjut di sini](opsx.md)

<p align="center">
  Ikuti <a href="https://x.com/0xTab">@0xTab di X</a> untuk pembaruan · Bergabunglah dengan <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> untuk bantuan dan pertanyaan.
</p>

<!-- TODO: Add GIF demo of /opsx:propose → /opsx:archive workflow -->

## Lihat dalam aksi

```text
You: /opsx:propose add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /opsx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /opsx:archive
AI:  Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>Dashboard OpenSpec</strong></summary>

</details>

## Mulai Cepat

**Membutuhkan Node.js 20.19.0 atau lebih tinggi.**

Instal OpenSpec secara global:

```bash
npm install -g @fission-ai/openspec@latest
```

Kemudian navigasi ke direktori proyek Anda dan inisialisasi:

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
→ **[Konsep](concepts.md)**: bagaimana semuanya terhubung<br>
→ **[Multi-Bahasa](multi-language.md)**: dukungan multi-bahasa<br>
→ **[Kustomisasi](customization.md)**: buat milik Anda


## Mengapa OpenSpec?

Asisten pemrograman AI sangat kuat tetapi tidak dapat diprediksi ketika persyaratan hanya ada di riwayat obrolan. OpenSpec menambahkan lapisan spesifikasi ringan sehingga Anda setuju tentang apa yang akan dibangun sebelum kode apa pun ditulis.

- **Sepakati sebelum Anda membangun** — manusia dan AI menyelaraskan spesifikasi sebelum kode ditulis
- **Tetap terorganisir** — setiap perubahan mendapat folder sendiri dengan proposal, spesifikasi, desain, dan tugas
- **Bekerja secara fluida** — perbarui artifact kapan saja, tanpa gerbang fase yang kaku
- **Gunakan alat Anda** — berfungsi dengan 20+ asisten AI melalui perintah slash

### Bagaimana kami dibandingkan

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Menyeluruh tetapi berat. Gerbang fase kaku, banyak Markdown, pengaturan Python. OpenSpec lebih ringan dan memungkinkan Anda ber迭代 secara bebas.

**vs. [Kiro](https://kiro.dev)** (AWS) — Kuat tetapi Anda terkunci di IDE mereka dan terbatas pada model Claude. OpenSpec berfungsi dengan alat yang sudah Anda gunakan.

**vs. tidak ada** — Pemrograman AI tanpa spesifikasi berarti prompt yang samar dan hasil yang tidak dapat diprediksi. OpenSpec membawa prediktabilitas tanpa keributan.

## Memperbarui OpenSpec

**Tingkatkan paket**

```bash
npm install -g @fission-ai/openspec@latest
```

**Segarkan instruksi agen**

Jalankan ini di dalam setiap proyek untuk menghasilkan kembali panduan AI dan memastikan perintah slash terbaru aktif:

```bash
openspec update
```

## Catatan Penggunaan

**Pemilihan model**: OpenSpec bekerja paling baik dengan model dengan penalaran tinggi. Kami merekomendasikan Opus 4.5 dan GPT 5.2 untuk perencanaan dan implementasi.

**Kebersihan konteks**: OpenSpec mendapat manfaat dari jendela konteks yang bersih. Bersihkan konteks Anda sebelum memulai implementasi dan pertahankan kebersihan konteks yang baik sepanjang sesi Anda.

## Berkontribusi

**Perbaikan kecil** — Perbaikan bug, koreksi kesalahan ketik, dan perbaikan minor dapat diajukan langsung sebagai PR.

**Perubahan lebih besar** — Untuk fitur baru, refactor signifikan, atau perubahan arsitektural, silakan ajukan proposal perubahan OpenSpec terlebih dahulu agar kami dapat menyelaraskan tujuan dan niat sebelum implementasi dimulai.

Saat menulis proposal, ingat filosofi OpenSpec: kami melayani berbagai pengguna di berbagai agen pemrograman, model, dan kasus penggunaan. Perubahan harus berfungsi dengan baik untuk semua orang.

**Kode yang dihasilkan AI diterima** — selama sudah diuji dan diverifikasi. PR yang berisi kode yang dihasilkan AI harus menyebutkan agen pemrograman dan model yang digunakan (misalnya, "Dihasilkan dengan Claude Code menggunakan claude-opus-4-5-20251101").

### Pengembangan

- Instal dependensi: `pnpm install`
- Bangun: `pnpm run build`
- Uji: `pnpm test`
- Kembangkan CLI secara lokal: `pnpm run dev` atau `pnpm run dev:cli`
- Komit konvensional (satu baris): `type(scope): subject`

## Lainnya

<details>
<summary><strong>Telemetri</strong></summary>

OpenSpec mengumpulkan statistik penggunaan anonim.

Kami hanya mengumpulkan nama perintah dan versi untuk memahami pola penggunaan. Tidak ada argumen, jalur, konten, atau PII. Dinonaktifkan secara otomatis di CI.

**Keluar:** `export OPENSPEC_TELEMETRY=0` atau `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Pemelihara & Penasihat</strong></summary>

Lihat [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) untuk daftar pemelihara inti dan penasihat yang membantu memandu proyek.

</details>



## Lisensi

MIT