# Kustomisasi

OpenSpec menyediakan tiga tingkat kustomisasi:

| Level | Fungsi | Cocok untuk |
|-------|--------|-------------|
| **Konfigurasi Proyek** | Menetapkan default, menyuntikkan konteks/aturan | Sebagian besar tim |
| **Skema Kustom** | Mendefinisikan artefak alur kerja Anda sendiri | Tim dengan proses unik |
| **Penggantian Global** | Berbagi skema di semua proyek | Pengguna tingkat lanjut |

---

## Konfigurasi Proyek

File `openspec/config.yaml` adalah cara termudah untuk menyesuaikan OpenSpec untuk tim Anda. File ini memungkinkan Anda untuk:

- **Menetapkan skema default** - Lewati perintah `--schema` pada setiap perintah
- **Menyuntikkan konteks proyek** - AI melihat tumpukan teknologi, konvensi, dll.
- **Menambahkan aturan per artefak** - Aturan kustom untuk artefak tertentu

### Pengaturan Cepat

```bash
openspec init
```

Perintah ini akan memandu Anda dalam membuat konfigurasi secara interaktif. Atau buat secara manual:

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

### Cara Kerja

**Skema default:**

```bash
# Tanpa konfigurasi
openspec new change my-feature --schema spec-driven

# Dengan konfigurasi - skema otomatis
openspec new change my-feature
```

**Penyuntikan konteks dan aturan:**

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
[Schema's built-in template]
</template>
```

- **Konteks** muncul di SEMUA artefak
- **Aturan** HANYA muncul untuk artefak yang cocok

### Urutan Resolusi Skema

Saat OpenSpec membutuhkan skema, ia memeriksa dalam urutan ini:

1. Flag CLI: `--schema <nama>`
2. Metadata perubahan (`.openspec.yaml` di folder perubahan)
3. Konfigurasi proyek (`openspec/config.yaml`)
4. Default (`spec-driven`)

---

## Skema Kustom

Saat konfigurasi proyek tidak cukup, buat skema Anda sendiri dengan alur kerja yang sepenuhnya kustom. Skema kustom berada di direktori `openspec/schemas/` proyek Anda dan dikelola versinya bersama kode Anda.

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

Cara tercepat untuk menyesuaikan adalah dengan melakukan fork pada skema bawaan:

```bash
openspec schema fork spec-driven my-workflow
```

Ini akan menyalin seluruh skema `spec-driven` ke `openspec/schemas/my-workflow/` di mana Anda dapat mengeditnya dengan bebas.

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

### Buat Skema dari Awal

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

Skema mendefinisikan artefak dalam alur kerja Anda dan bagaimana artefak tersebut bergantung satu sama lain:

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

**Bidang kunci:**

| Bidang | Tujuan |
|--------|--------|
| `id` | Pengenal unik, digunakan dalam perintah dan aturan |
| `generates` | Nama file output (mendukung glob seperti `specs/**/*.md`) |
| `template` | File template di direktori `templates/` |
| `instruction` | Instruksi AI untuk membuat artefak ini |
| `requires` | Dependensi - artefak mana yang harus ada terlebih dahulu |

### Template

Template adalah file markdown yang memandu AI. Template disuntikkan ke dalam prompt saat membuat artefak tersebut.

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
- Judul bagian yang harus diisi AI
- Komentar HTML dengan panduan untuk AI
- Contoh format yang menunjukkan struktur yang diharapkan

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
# Tentukan pada perintah
openspec new change feature --schema my-workflow

# Atau tetapkan sebagai default di config.yaml
schema: my-workflow
```

### Debug Resolusi Skema

Tidak yakin skema mana yang digunakan? Periksa dengan:

```bash
# Lihat dari mana skema tertentu berasal
openspec schema which my-workflow

# Daftar semua skema yang tersedia
openspec schema which --all
```

Output menunjukkan apakah skema berasal dari proyek Anda, direktori pengguna, atau paket:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Catatan:** OpenSpec juga mendukung skema tingkat pengguna di `~/.local/share/openspec/schemas/` untuk dibagikan di seluruh proyek, tetapi skema tingkat proyek di `openspec/schemas/` direkomendasikan karena dikelola versinya bersama kode Anda.

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

### Menambahkan Artefak Review

Fork default dan tambahkan langkah review:

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
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Lihat Juga

- [Referensi CLI: Perintah Skema](cli.md#schema-commands) - Dokumentasi perintah lengkap