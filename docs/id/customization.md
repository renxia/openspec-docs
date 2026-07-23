# Kustomisasi

OpenSpec menyediakan tiga tingkat kustomisasi:

| Tingkat | Apa yang dilakukan | Terbaik untuk |
|---------|-------------------|---------------|
| **Konfigurasi Proyek** | Tetapkan nilai default, sisipkan konteks/aturan | Kebanyakan tim |
| **Skema Kustom** | Definisikan artefak alur kerja Anda sendiri | Tim dengan proses unik |
| **Timpaan Global** | Bagikan skema di semua proyek | Pengguna tingkat lanjut |

---

## Konfigurasi Proyek

Berkas `openspec/config.yaml` adalah cara termudah untuk menyesuaikan OpenSpec untuk tim Anda. Ini memungkinkan Anda untuk:

- **Tetapkan skema default** - Lewati `--schema` pada setiap perintah
- **Sisipkan konteks proyek** - AI melihat tumpukan teknologi, konvensi, dll. Anda
- **Tambahkan aturan per-artifak** - Aturan kustom untuk artefak tertentu

### Pengaturan Cepat

```bash
openspec init
```

Ini akan memandu Anda membuat konfigurasi secara interaktif. Atau buat secara manual:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Sertakan rencana rollback
    - Identifikasi tim yang terpengaruh
  specs:
    - Gunakan format Given/When/Then
    - Referensikan pola yang ada sebelum menciptakan yang baru
```

### Cara Kerjanya

**Skema default:**

```bash
# Tanpa konfigurasi
openspec new change my-feature --schema spec-driven

# Dengan konfigurasi - skema otomatis
openspec new change my-feature
```

**Penyisipan konteks dan aturan:**

Saat membuat artefak apa pun, konteks dan aturan Anda disisipkan ke dalam prompt AI:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Sertakan rencana rollback
- Identifikasi tim yang terpengaruh
</rules>

<template>
[Template bawaan skema]
</template>
```

- **Konteks** muncul di SEMUA artefak
- **Aturan** HANYA muncul untuk artefak yang sesuai

### Urutan Resolusi Skema

Saat OpenSpec membutuhkan skema, ia memeriksa dalam urutan ini:

1. Bendera CLI: `--schema <nama>`
2. Metadata perubahan (`.openspec.yaml` di folder perubahan)
3. Konfigurasi proyek (`openspec/config.yaml`)
4. Default (`spec-driven`)

---

## Skema Kustom

Saat konfigurasi proyek tidak cukup, buat skema Anda sendiri dengan alur kerja yang sepenuhnya kustom. Skema kustom berada di direktori `openspec/schemas/` proyek Anda dan dikontrol versi bersama kode Anda.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Konfigurasi proyek
│   ├── schemas/           # Skema kustom berada di sini
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Perubahan Anda
└── src/
```

### Fork Skema yang Ada

Cara tercepat untuk menyesuaikan adalah dengan mengfork skema bawaan:

```bash
openspec schema fork spec-driven my-workflow
```

Ini menyalin seluruh skema `spec-driven` ke `openspec/schemas/my-workflow/` tempat Anda dapat mengeditnya dengan bebas.

**Yang Anda dapatkan:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Definisi alur kerja
└── templates/
    ├── proposal.md       # Template untuk artefak proposal
    ├── spec.md           # Template untuk spesifikasi
    ├── design.md         # Template untuk desain
    └── tasks.md          # Template untuk tugas
```

Sekarang edit `schema.yaml` untuk mengubah alur kerja, atau edit template untuk mengubah apa yang dihasilkan AI.

### Buat Skema dari Nol

Untuk alur kerja yang sepenuhnya baru:

```bash
# Interaktif
openspec schema init research-first

# Non-interaktif
openspec schema init rapid \
  --description "Alur kerja iterasi cepat" \
  --artifacts "proposal,tasks" \
  --default
```

### Struktur Skema

Skema mendefinisikan artefak dalam alur kerja Anda dan bagaimana mereka bergantung satu sama lain:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: Alur kerja kustom tim saya

artifacts:
  - id: proposal
    generates: proposal.md
    description: Dokumen proposal awal
    template: proposal.md
    instruction: |
      Buat proposal yang menjelaskan MENGAPA perubahan ini diperlukan.
      Fokus pada masalah, bukan solusi.
    requires: []

  - id: design
    generates: design.md
    description: Desain teknis
    template: design.md
    instruction: |
      Buat dokumen desain yang menjelaskan BAGAIMANA mengimplementasikan.
    requires:
      - proposal    # Tidak dapat membuat desain sampai proposal ada

  - id: tasks
    generates: tasks.md
    description: Daftar periksa implementasi
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Bidang kunci:**

| Bidang | Tujuan |
|--------|--------|
| `id` | Pengidentifikasi unik, digunakan dalam perintah dan aturan |
| `generates` | Nama file keluaran (mendukung glob seperti `specs/**/*.md`) |
| `template` | Berkas template di direktori `templates/` |
| `instruction` | Instruksi AI untuk membuat artefak ini |
| `requires` | Dependensi - artefak mana yang harus ada terlebih dahulu |

### Template

Template adalah berkas markdown yang memandu AI. Mereka disisipkan ke dalam prompt saat membuat artefak tersebut.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Jelaskan motivasi untuk perubahan ini. Masalah apa yang diselesaikan? -->

## What Changes

<!-- Jelaskan apa yang akan berubah. Spesifikkan tentang kemampuan baru atau modifikasi. -->

## Impact

<!-- Kode, API, dependensi, sistem yang terpengaruh -->
```

Template dapat mencakup:
- Header bagian yang harus diisi AI
- Komentar HTML dengan panduan untuk AI
- Format contoh yang menunjukkan struktur yang diharapkan

### Validasi Skema Anda

Sebelum menggunakan skema kustom, validasi:

```bash
openspec schema validate my-workflow
```

Ini memeriksa:
- Sintaks `schema.yaml` benar
- Semua template yang direferensikan ada
- Tidak ada dependensi melingkar
- ID artefak valid

### Gunakan Skema Kustom Anda

Setelah dibuat, gunakan skema Anda dengan:

```bash
# Tentukan pada perintah
openspec new change feature --schema my-workflow

# Atau tetapkan sebagai default di config.yaml
schema: my-workflow
```

### Debug Resolusi Skema

Tidak yakin skema mana yang sedang digunakan? Periksa dengan:

```bash
# Lihat dari mana skema tertentu diselesaikan
openspec schema which my-workflow

# Cantumkan semua skema yang tersedia
openspec schema which --all
```

Keluaran menunjukkan apakah itu dari proyek Anda, direktori pengguna, atau paket:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Catatan:** OpenSpec juga mendukung skema tingkat pengguna di `~/.local/share/openspec/schemas/` untuk berbagi antar proyek, tetapi skema tingkat proyek di `openspec/schemas/` direkomendasikan karena mereka dikontrol versi bersama kode Anda.

---

## Contoh

### Alur Kerja Iterasi Cepat

Alur kerja minimal untuk iterasi cepat:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Iterasi cepat dengan biaya minimal

artifacts:
  - id: proposal
    generates: proposal.md
    description: Proposal cepat
    template: proposal.md
    instruction: |
      Buat proposal singkat untuk perubahan ini.
      Fokus pada apa dan mengapa, lewati spesifikasi detail.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Daftar periksa implementasi
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Menambahkan Artefak Review

Fork yang default dan tambahkan langkah review:

```bash
openspec schema fork spec-driven with-review
```

Kemudian edit `schema.yaml` untuk menambahkan:

```yaml
  - id: review
    generates: review.md
    description: Daftar periksa review pra-implementasi
    template: review.md
    instruction: |
      Buat daftar periksa review berdasarkan desain.
      Sertakan pertimbangan keamanan, kinerja, dan pengujian.
    requires:
      - design

  - id: tasks
    # ... konfigurasi tugas yang ada ...
    requires:
      - specs
      - design
      - review    # Sekarang tugas juga memerlukan review
```

---

## Skema Komunitas

OpenSpec juga mendukung skema yang dirawat komunitas yang didistribusikan melalui repositori mandiri. Ini menyediakan alur kerja beropini yang mengintegrasikan OpenSpec dengan alat atau sistem lain, mirip dengan cara [katalog ekstensi komunitas github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) bekerja untuk spec-kit.

Skema komunitas tidak dimasukkan ke dalam inti OpenSpec — mereka berada di repositori mereka sendiri dengan ritme rilis mereka sendiri. Untuk menggunakannya, salin bundel skema ke direktori `openspec/schemas/<schema-name>/` proyek Anda (setiap repo memiliki README dengan instruksi instalasi).

| Skema | Pengelola | Repositori | Deskripsi |
|-------|-----------|------------|-----------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Mengintegrasikan tata kelola artefak OpenSpec dengan keterampilan eksekusi [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, writing-plans, TDD via subagents, code review, finishing). Menambahkan artefak `retrospective` berbasis bukti yang mengisi celah yang tidak secara asli dicakup oleh Superpowers. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Alur kerja PM-pertama. Menjalankan pipeline perencanaan [nanopm](https://github.com/nmrtn/nanopm) (audit → strategi → roadmap → PRD) hulu dari implementasi. Menjembatani perencanaan produk ke alur kerja rekayasa berbasis spesifikasi OpenSpec. Artefak membaca dari `.nanopm/` jika ada — proposal mengambil sumber dari audit, desain mengambil sumber dari strategi, dan tugas mengambil sumber dari rincian PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Runbook pengujian end-to-end tingkat kemampuan. Setiap kemampuan mendapatkan spesifikasi yang tidak dapat diubah, template tugas yang tidak dapat diubah, dan satu catatan eksekusi bertimestamp per eksekusi. Assertions hanya berupa perilaku yang dapat diamati (status HTTP, isi respons, state yang bertahan — jangan pernah substring log); setiap eksekusi mencatat awal/akhir UTC, durasi, dan perkiraan konsumsi token LLM terbaik. |

> Ingin berkontribusi skema komunitas? Buka isu dengan tautan ke repositori Anda, atau kirim PR menambahkan baris ke tabel ini.

---

## Lihat Juga

- [Referensi CLI: Perintah Skema](cli.md#schema-commands) - Dokumentasi perintah lengkap