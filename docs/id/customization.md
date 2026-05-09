# Kustomisasi

OpenSpec menyediakan tiga tingkat kustomisasi:

| Tingkat | Apa yang dilakukan | Cocok untuk |
|---------|-------------------|-------------|
| **Konfigurasi Proyek** | Mengatur default, menyuntikkan konteks/aturan | Sebagian besar tim |
| **Skema Kustom** | Mendefinisikan artefak alur kerja Anda sendiri | Tim dengan proses unik |
| **Override Global** | Berbagi skema di semua proyek | Pengguna tingkat lanjut |

---

## Konfigurasi Proyek

File `openspec/config.yaml` adalah cara termudah untuk mengkustomisasi OpenSpec untuk tim Anda. File ini memungkinkan Anda:

- **Mengatur skema default** - Lewati `--schema` di setiap perintah
- **Menyuntikkan konteks proyek** - AI melihat tumpukan teknologi, konvensi, dll.
- **Menambahkan aturan per artefak** - Aturan kustom untuk artefak tertentu

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
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### Cara Kerjanya

**Skema default:**

```bash
# Tanpa konfigurasi
openspec new change my-feature --schema spec-driven

# Dengan konfigurasi - skema otomatis
openspec new change my-feature
```

**Suntikan konteks dan aturan:**

Saat membuat artefak apa pun, konteks dan aturan Anda disuntikkan ke dalam prompt AI:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Template bawaan skema]
</template>
```

- **Konteks** muncul di SEMUA artefak
- **Aturan** HANYA muncul untuk artefak yang cocok

### Urutan Resolusi Skema

Ketika OpenSpec membutuhkan skema, ia memeriksa dalam urutan ini:

1. Flag CLI: `--schema <name>`
2. Metadata perubahan (`.openspec.yaml` di folder perubahan)
3. Konfigurasi proyek (`openspec/config.yaml`)
4. Default (`spec-driven`)

---

## Skema Kustom

Ketika konfigurasi proyek tidak cukup, buat skema Anda sendiri dengan alur kerja yang sepenuhnya kustom. Skema kustom berada di direktori `openspec/schemas/` proyek Anda dan dikontrol versi bersama kode Anda.

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

### Fork Skema yang Sudah Ada

Cara tercepat untuk mengkustomisasi adalah melakukan fork skema bawaan:

```bash
openspec schema fork spec-driven my-workflow
```

Ini menyalin seluruh skema `spec-driven` ke `openspec/schemas/my-workflow/` di mana Anda dapat mengeditnya secara bebas.

**Apa yang Anda dapatkan:**

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

### Membuat Skema dari Awal

Untuk alur kerja yang benar-benar baru:

```bash
# Interaktif
openspec schema init research-first

# Non-interaktif
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Struktur Skema

Skema mendefinisikan artefak dalam alur kerja Anda dan bagaimana mereka bergantung satu sama lain:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Kolom kunci:**

| Kolom | Tujuan |
|-------|--------|
| `id` | Pengidentifikasi unik, digunakan dalam perintah dan aturan |
| `generates` | Nama file output (mendukung glob seperti `specs/**/*.md`) |
| `template` | File template di direktori `templates/` |
| `instruction` | Instruksi AI untuk membuat artefak ini |
| `requires` | Dependensi - artefak mana yang harus ada terlebih dahulu |

### Template

Template adalah file markdown yang memandu AI. Template ini disuntikkan ke dalam prompt saat membuat artefak tersebut.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Template dapat mencakup:
- Header bagian yang harus diisi AI
- Komentar HTML dengan panduan untuk AI
- Format contoh yang menunjukkan struktur yang diharapkan

### Validasi Skema Anda

Sebelum menggunakan skema kustom, validasi terlebih dahulu:

```bash
openspec schema validate my-workflow
```

Ini memeriksa:
- Sintaks `schema.yaml` benar
- Semua template yang dirujuk ada
- Tidak ada dependensi sirkuler
- ID artefak valid

### Gunakan Skema Kustom Anda

Setelah dibuat, gunakan skema Anda dengan:

```bash
# Tentukan di perintah
openspec new change feature --schema my-workflow

# Atau atur sebagai default di config.yaml
schema: my-workflow
```

### Debug Resolusi Skema

Tidak yakin skema mana yang digunakan? Periksa dengan:

```bash
# Lihat dari mana skema spesifik diselesaikan
openspec schema which my-workflow

# Daftar semua skema yang tersedia
openspec schema which --all
```

Output menunjukkan apakah itu dari proyek Anda, direktori pengguna, atau paket:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Catatan:** OpenSpec juga mendukung skema tingkat pengguna di `~/.local/share/openspec/schemas/` untuk berbagi di seluruh proyek, tetapi skema tingkat proyek di `openspec/schemas/` direkomendasikan karena dikontrol versi bersama kode Anda.

---

## Contoh

### Alur Kerja Iterasi Cepat

Alur kerja minimal untuk iterasi cepat:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Menambahkan Artefak Tinjauan

Lakukan fork default dan tambahkan langkah tinjauan:

```bash
openspec schema fork spec-driven with-review
```

Kemudian edit `schema.yaml` untuk menambahkan:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... konfigurasi tugas yang ada ...
    requires:
      - specs
      - design
      - review    # Sekarang tugas juga memerlukan tinjauan
```

---

## Skema Komunitas

OpenSpec juga mendukung skema yang dikelola komunitas dan didistribusikan melalui repositori mandiri. Ini menyediakan alur kerja yang terstandar yang mengintegrasikan OpenSpec dengan alat atau sistem lain, mirip dengan cara [katalog ekstensi komunitas github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) bekerja untuk spec-kit.

Skema komunitas tidak disertakan dalam inti OpenSpec — mereka berada di repositori mereka sendiri dengan jadwal rilis mereka sendiri. Untuk menggunakan satu, salin bundel skema ke direktori `openspec/schemas/<schema-name>/` proyek Anda (setiap README repo memiliki instruksi instalasi).

| Skema | Pengelola | Repositori | Deskripsi |
|-------|-----------|-----------|-----------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Mengintegrasikan tata kelola artefak OpenSpec dengan keterampilan eksekusi [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, rencana penulisan, TDD melalui subagent, tinjauan kode, penyelesaian). Menambahkan artefak `retrospective` berbasis bukti yang mengisi celah yang tidak dicakup secara native oleh Superpowers. |

> Ingin berkontribusi skema komunitas? Buka issue dengan tautan ke repositori Anda, atau kirimkan PR yang menambahkan baris ke tabel ini.

---

## Lihat Juga

- [Referensi CLI: Perintah Skema](cli.md#schema-commands) - Dokumentasi perintah lengkap