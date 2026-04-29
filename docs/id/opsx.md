# Alur Kerja OPSX

> Umpan balik dipersilakan di [Discord](https://discord.gg/YctCnvvshC).

## Apa Itu?

OPSX sekarang merupakan alur kerja standar untuk OpenSpec.

Ini adalah **alur kerja yang fleksibel dan iteratif** untuk perubahan OpenSpec. Tidak lagi ada fase yang kaku — hanya tindakan yang dapat Anda ambil kapan saja.

## Mengapa Ini Ada

Alur kerja OpenSpec lama berfungsi, tetapi **terkunci**:

- **Instruksi di-hardcode** — tersembunyi dalam TypeScript, Anda tidak dapat mengubahnya
- **Semua atau tidak sama sekali** — satu perintah besar membuat segalanya, tidak dapat menguji bagian individual
- **Struktur tetap** — alur kerja yang sama untuk semua orang, tanpa kustomisasi
- **Kotak hitam** — ketika output AI buruk, Anda tidak dapat menyesuaikan prompt

**OPSX membukanya.** Sekarang siapa pun bisa:

1. **Mengeksperimen dengan instruksi** — edit template, lihat apakah AI menjadi lebih baik
2. **Menguji secara granular** — validasi instruksi setiap artefak secara independen
3. **Mengkustomisasi alur kerja** — tentukan artefak dan dependensi Anda sendiri
4. **Iterasi dengan cepat** — ubah template, uji segera, tanpa rebuild

```
Alur kerja lama:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcode dalam paket  │           │  schema.yaml           │◄── Anda edit ini
│  (tidak dapat diubah)  │           │  templates/*.md        │◄── Atau ini
│        ↓               │           │        ↓               │
│  Tunggu rilis baru     │           │  Efek instan           │
│        ↓               │           │        ↓               │
│  Berharap lebih baik   │           │  Uji sendiri           │
└────────────────────────┘           └────────────────────────┘
```

**Ini untuk semua orang:**
- **Tim** — buat alur kerja yang sesuai dengan cara Anda benar-benar bekerja
- **Pengguna lanjutan** — sesuaikan prompt untuk mendapatkan output AI yang lebih baik untuk codebase Anda
- **Kontributor OpenSpec** — eksperimen dengan pendekatan baru tanpa rilis

Kita semua masih belajar apa yang paling berhasil. OPSX memungkinkan kita belajar bersama.

## Pengalaman Pengguna

**Masalah dengan alur kerja linear:**
Anda "dalam fase perencanaan", lalu "dalam fase implementasi", lalu "selesai". Tetapi pekerjaan nyata tidak bekerja seperti itu. Anda mengimplementasikan sesuatu, menyadari desain Anda salah, perlu memperbarui spesifikasi, melanjutkan implementasi. Fase linear bertentangan dengan bagaimana pekerjaan sebenarnya terjadi.

**Pendekatan OPSX:**
- **Tindakan, bukan fase** — buat, implementasikan, perbarui, arsipkan — lakukan salah satunya kapan saja
- **Dependensi adalah pemberdaya** — mereka menunjukkan apa yang mungkin, bukan apa yang diperlukan selanjutnya

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Pengaturan

```bash
# Pastikan Anda telah menginstal openspec — skill akan dihasilkan secara otomatis
openspec init
```

Ini membuat skill di `.claude/skills/` (atau yang setara) yang dideteksi secara otomatis oleh asisten coding AI.

Secara default, OpenSpec menggunakan profil alur kerja `core` (`propose`, `explore`, `apply`, `archive`). Jika Anda menginginkan perintah alur kerja yang diperluas (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`), konfigurasikan dengan `openspec config profile` dan terapkan dengan `openspec update`.

Selama pengaturan, Anda akan diminta membuat **konfigurasi proyek** (`openspec/config.yaml`). Ini opsional tetapi disarankan.

## Konfigurasi Proyek

Konfigurasi proyek memungkinkan Anda mengatur default dan menyuntikkan konteks spesifik proyek ke dalam semua artefak.

### Membuat Konfigurasi

Konfigurasi dibuat selama `openspec init`, atau secara manual:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### Bidang Konfigurasi

| Bidang | Tipe | Deskripsi |
|-------|------|-----------|
| `schema` | string | Schema default untuk perubahan baru (misalnya, `spec-driven`) |
| `context` | string | Konteks proyek yang disuntikkan ke instruksi semua artefak |
| `rules` | object | Aturan per artefak, dikunci berdasarkan ID artefak |

### Cara Kerjanya

**Prioritas schema** (dari tertinggi ke terendah):
1. Flag CLI (`--schema <nama>`)
2. Metadata perubahan (`.openspec.yaml` di direktori perubahan)
3. Konfigurasi proyek (`openspec/config.yaml`)
4. Default (`spec-driven`)

**Penyuntikan konteks:**
- Konteks ditambahkan di awal instruksi setiap artefak
- Dibungkus dalam tag `<context>...</context>`
- Membantu AI memahami konvensi proyek Anda

**Penyuntikan aturan:**
- Aturan hanya disuntikkan untuk artefak yang cocok
- Dibungkus dalam tag `<rules>...</rules>`
- Muncul setelah konteks, sebelum template

### ID Artefak per Schema

**spec-driven** (default):
- `proposal` — Proposal perubahan
- `specs` — Spesifikasi
- `design` — Desain teknis
- `tasks` — Tugas implementasi

### Validasi Konfigurasi

- ID artefak yang tidak dikenal di `rules` menghasilkan peringatan
- Nama schema divalidasi terhadap schema yang tersedia
- Konteks memiliki batas ukuran 50KB
- YAML yang tidak valid dilaporkan dengan nomor baris

### Pemecahan Masalah

**"ID artefak tidak dikenal dalam rules: X"**
- Periksa ID artefak cocok dengan schema Anda (lihat daftar di atas)
- Jalankan `openspec schemas --json` untuk melihat ID artefak untuk setiap schema

**Konfigurasi tidak diterapkan:**
- Pastikan file berada di `openspec/config.yaml` (bukan `.yml`)
- Periksa sintaksis YAML dengan validator
- Perubahan konfigurasi berlaku segera (tidak perlu restart)

**Konteks terlalu besar:**
- Konteks dibatasi hingga 50KB
- Ringkas atau tautkan ke dokumentasi eksternal sebagai gantinya

## Perintah

| Perintah | Fungsinya |
|---------|-----------|
| `/opsx:propose` | Buat perubahan dan hasilkan artefak perencanaan dalam satu langkah (jalur cepat default) |
| `/opsx:explore` | Pikirkan ide, investigasi masalah, klarifikasi persyaratan |
| `/opsx:new` | Mulai scaffold perubahan baru (alur kerja diperluas) |
| `/opsx:continue` | Buat artefak berikutnya (alur kerja diperluas) |
| `/opsx:ff` | Majukan cepat artefak perencanaan (alur kerja diperluas) |
| `/opsx:apply` | Implementasikan tugas, perbarui artefak sesuai kebutuhan |
| `/opsx:verify` | Validasi implementasi terhadap artefak (alur kerja diperluas) |
| `/opsx:sync` | Sinkronkan spesifikasi delta ke utama (alur kerja diperluas, opsional) |
| `/opsx:archive` | Arsipkan ketika selesai |
| `/opsx:bulk-archive` | Arsipkan beberapa perubahan yang selesai (alur kerja diperluas) |
| `/opsx:onboard` | Panduan langkah demi langkah untuk perubahan end-to-end (alur kerja diperluas) |

## Penggunaan

### Eksplorasi ide
```
/opsx:explore
```
Pikirkan ide, investigasi masalah, bandingkan opsi. Tidak diperlukan struktur - hanya mitra berpikir. Ketika wawasan mengkristal, beralih ke `/opsx:propose` (default) atau `/opsx:new`/`/opsx:ff` (diperluas).

### Mulai perubahan baru
```
/opsx:propose
```
Membuat perubahan dan menghasilkan artefak perencanaan yang diperlukan sebelum implementasi.

Jika Anda telah mengaktifkan alur kerja diperluas, Anda dapat menggunakan:

```text
/opsx:new        # hanya scaffold
/opsx:continue   # buat satu artefak pada satu waktu
/opsx:ff         # buat semua artefak perencanaan sekaligus
```

### Membuat artefak
```
/opsx:continue
```
Menampilkan apa yang siap dibuat berdasarkan dependensi, lalu membuat satu artefak. Gunakan berulang kali untuk membangun perubahan Anda secara bertahap.

```
/opsx:ff add-dark-mode
```
Membuat semua artefak perencanaan sekaligus. Gunakan ketika Anda memiliki gambaran jelas tentang apa yang akan dibangun.

### Implementasi (bagian yang cair)
```
/opsx:apply
```
Mengerjakan tugas, menandainya selesai saat Anda melakukannya. Jika Anda mengelola beberapa perubahan, Anda dapat menjalankan `/opsx:apply <nama>`; jika tidak, seharusnya menyimpulkan dari percakapan dan meminta Anda memilih jika tidak dapat menentukan.

### Selesai
```
/opsx:archive   # Pindahkan ke arsip ketika selesai (meminta untuk menyinkronkan spesifikasi jika diperlukan)
```

## Kapan Memperbarui vs. Mulai dari Awal

Anda selalu dapat mengedit proposal atau spesifikasi Anda sebelum implementasi. Tetapi kapan penyempurnaan menjadi "ini adalah pekerjaan yang berbeda"?

### Apa yang Ditangkap oleh Proposal

Proposal mendefinisikan tiga hal:
1. **Niat** — Masalah apa yang Anda selesaikan?
2. **Cakupan** — Apa yang termasuk/di luar cakupan?
3. **Pendekatan** — Bagaimana Anda akan menyelesaikannya?

Pertanyaannya adalah: apa yang berubah, dan seberapa banyak?

### Perbarui Perubahan yang Ada Ketika:

**Niat sama, eksekusi disempurnakan**
- Anda menemukan kasus tepi yang tidak Anda pertimbangkan
- Pendekatan perlu penyesuaian tetapi tujuan tidak berubah
- Implementasi mengungkapkan desain sedikit salah

**Cakupan menyempit**
- Anda menyadari cakupan penuh terlalu besar, ingin merilis MVP terlebih dahulu
- "Tambahkan mode gelap" → "Tambahkan tombol mode gelap (preferensi sistem di v2)"

**Koreksi berbasis pembelajaran**
- Codebase tidak terstruktur seperti yang Anda kira
- Dependensi tidak berfungsi seperti yang diharapkan
- "Gunakan variabel CSS" → "Gunakan awalan dark: Tailwind sebagai gantinya"

### Mulai Perubahan Baru Ketika:

**Niat berubah mendasar**
- Masalah itu sendiri sekarang berbeda
- "Tambahkan mode gelap" → "Tambahkan sistem tema lengkap dengan warna, font, spasi kustom"

**Cakupan meledak**
- Perubahan menjadi begitu besar sehingga pada dasarnya adalah pekerjaan yang berbeda
- Proposal asli akan tidak dapat dikenali setelah pembaruan
- "Perbaiki bug login" → "Tulis ulang sistem autentikasi"

**Asli dapat diselesaikan**
- Perubahan asli dapat ditandai "selesai"
- Pekerjaan baru berdiri sendiri, bukan penyempurnaan
- Selesaikan "Tambahkan mode gelap MVP" → Arsipkan → Perubahan baru "Tingkatkan mode gelap"

### Heuristiknya

```
                        ┌─────────────────────────────────────┐
                        │     Apakah ini pekerjaan yang sama? │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Niat sama?        >50% tumpang tindih?  Apakah asli
             Masalah sama?     Cakupan sama?         dapat "selesai" tanpa
                    │                  │              perubahan ini?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         YA                TIDAK YA          TIDAK TIDAK          YA
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       PERBARUI          BARU PERBARUI     BARU PERBARUI        BARU
```

| Uji | Perbarui | Perubahan Baru |
|-----|----------|----------------|
| **Identitas** | "Hal yang sama, disempurnakan" | "Pekerjaan berbeda" |
| **Tumpang tindih cakupan** | >50% tumpang tindih | <50% tumpang tindih |
| **Penyelesaian** | Tidak dapat "selesai" tanpa perubahan | Dapat menyelesaikan yang asli, pekerjaan baru berdiri sendiri |
| **Cerita** | Rantai pembaruan menceritakan kisah yang koheren | Patch akan membingungkan lebih dari mengklarifikasi |

### Prinsipnya

> **Pembaruan mempertahankan konteks. Perubahan baru memberikan kejelasan.**
>
> Pilih pembaruan ketika riwayat pemikiran Anda berharga.
> Pilih yang baru ketika mulai dari awal akan lebih jelas daripada menambal.

Pikirkan seperti cabang git:
- Terus commit saat mengerjakan fitur yang sama
- Mulai cabang baru ketika itu benar-benar pekerjaan baru
- Kadang-kadang merge fitur parsial dan mulai dari awal untuk fase 2

## Apa yang Berbeda?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struktur** | Satu dokumen proposal besar | Artefak terpisah dengan dependensi |
| **Alur Kerja** | Fase linear: rencana → implementasi → arsip | Aksi fleksibel — lakukan apa saja kapan saja |
| **Iterasi** | Sulit untuk kembali | Perbarui artefak saat Anda belajar |
| **Kustomisasi** | Struktur tetap | Didorong skema (tentukan artefak Anda sendiri) |

**Wawasan kunci:** pekerjaan tidak linear. OPSX berhenti berpura-pura demikian.

## Arsitektur Mendalam

Bagian ini menjelaskan cara kerja OPSX di balik layar dan bagaimana perbandingannya dengan alur kerja lama.
Contoh dalam bagian ini menggunakan set perintah yang diperluas (`new`, `continue`, dll.); pengguna `core` default dapat memetakan alur yang sama ke `propose → apply → archive`.

### Filosofi: Fase vs Aksi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ALUR KERJA LAMA                                     │
│                    (Terkunci Fase, Semua atau Tidak Sama Sekali)            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │    FASE      │      │    FASE      │      │    FASE      │             │
│   │ PERENCANAAN  │ ───► │ PELAKSANAAN  │ ───► │ PENGARSIPAN  │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Membuat SEMUA artefak sekaligus                                        │
│   • Tidak dapat kembali untuk memperbarui spesifikasi saat implementasi    │
│   • Gerbang fase memaksa progres linear                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                          ALUR KERJA OPSX                                    │
│                    (Aksi Fleksibel, Iteratif)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AKSI (bukan fase)                │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              urutan bebas                   │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Buat artefak satu per satu ATAU maju cepat                             │
│   • Perbarui spesifikasi/desain/tugas saat implementasi                    │
│   • Dependensi memungkinkan kemajuan, fase tidak ada                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arsitektur Komponen

**Alur kerja lama** menggunakan templat hardcoded dalam TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    KOMPONEN ALUR KERJA LAMA                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Templat Hardcoded (string TypeScript)                                     │
│                    │                                                        │
│                    ▼                                                        │
│   Konfigurator/adaptor khusus alat                                          │
│                    │                                                        │
│                    ▼                                                        │
│   File Perintah yang Dihasilkan (.claude/commands/openspec/*.md)            │
│                                                                             │
│   • Struktur tetap, tidak menyadari artefak                                │
│   • Perubahan memerlukan modifikasi kode + rebuild                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** menggunakan skema eksternal dan mesin graf dependensi:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       KOMPONEN OPSX                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Definisi Skema (YAML)                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependensi                       │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Pola glob                        │   │
│   │      requires: [proposal]      ◄── Mengaktifkan setelah proposal   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Mesin Graf Artefak                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Pengurutan topologis (urutan dependensi)                         │   │
│   │  • Deteksi status (keberadaan sistem berkas)                        │   │
│   │  • Pembuatan instruksi kaya (templat + konteks)                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   File Skill (.claude/skills/openspec-*/SKILL.md)                           │
│                                                                             │
│   • Kompatibel lintas-editor (Claude Code, Cursor, Windsurf)                │
│   • Skill meminta data terstruktur ke CLI                                   │
│   • Sepenuhnya dapat dikustomisasi melalui file skema                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Model Graf Dependensi

Artefak membentuk graf berarah tanpa siklus (DAG). Dependensi adalah **pemantik**, bukan gerbang:

```
                              proposal
                             (simpul akar)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (membutuhkan:                (membutuhkan:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (membutuhkan:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ FASE APPLY   │
                          │ (membutuhkan:│
                          │  tasks)      │
                          └──────────────┘
```

**Transisi status:**

```
   DIBLOKIR ────────────────► SIAP ────────────────► SELESAI
      │                        │                       │
   Dependensi                 Semua dep               Berkas ada
   hilang                     SELESAI                 di sistem berkas
```

### Alur Informasi

**Alur kerja lama** — agen menerima instruksi statis:

```
  Pengguna: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Instruksi statis:                      │
  │  • Buat proposal.md                     │
  │  • Buat tasks.md                        │
  │  • Buat design.md                       │
  │  • Buat specs/<capability>/spec.md      │
  │                                         │
  │  Tidak menyadari apa yang ada atau      │
  │  dependensi antar artefak               │
  └─────────────────────────────────────────┘
           │
           ▼
  Agen membuat SEMUA artefak sekaligus
```

**OPSX** — agen meminta konteks kaya:

```
  Pengguna: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Langkah 1: Minta status saat ini                                       │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── Pertama siap     │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Langkah 2: Dapatkan instruksi kaya untuk artefak yang siap             │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Spesifikasi\n\n## Persyaratan DITAMBAHKAN...",  │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Langkah 3: Baca dependensi → Buat SATU artefak → Tampilkan yang terbuka│
  └──────────────────────────────────────────────────────────────────────────┘
```

### Model Iterasi

**Alur kerja lama** — canggung untuk iterasi:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Tunggu, desainnya salah"
       │               │
       │               ├── Opsi:
       │               │   • Edit berkas secara manual (merusak konteks)
       │               │   • Batalkan dan mulai dari awal
       │               │   • Lanjutkan dan perbaiki nanti
       │               │
       │               └── Tidak ada mekanisme "kembali" resmi
       │
       └── Membuat SEMUA artefak sekaligus
```

**OPSX** — iterasi alami:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "Desainnya salah"
      │                │                  │
      │                │                  ▼
      │                │            Cukup edit design.md
      │                │            dan lanjutkan!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply melanjutkan
      │                │         dari mana Anda berhenti
      │                │
      │                └── Membuat SATU artefak, menampilkan yang terbuka
      │
      └── Merancang perubahan, menunggu arahan
```

### Skema Kustom

Buat alur kerja kustom menggunakan perintah manajemen skema:

```bash
# Buat skema baru dari awal (interaktif)
openspec schema init my-workflow

# Atau fork skema yang ada sebagai titik awal
openspec schema fork spec-driven my-workflow

# Validasi struktur skema Anda
openspec schema validate my-workflow

# Lihat dari mana skema di-resolve (berguna untuk debugging)
openspec schema which my-workflow
```

Skema disimpan di `openspec/schemas/` (lokal proyek, dikontrol versi) atau `~/.local/share/openspec/schemas/` (global pengguna).

**Struktur skema:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Contoh schema.yaml:**
```yaml
name: research-first
artifacts:
  - id: research        # Ditambahkan sebelum proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Sekarang bergantung pada research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Graf Dependensi:**
```
   research ──► proposal ──► tasks
```

### Ringkasan

| Aspek | Lama | OPSX |
|--------|----------|------|
| **Templat** | TypeScript Hardcoded | YAML + Markdown Eksternal |
| **Dependensi** | Tidak ada (semua sekaligus) | DAG dengan pengurutan topologis |
| **Status** | Model mental berbasis fase | Keberadaan sistem berkas |
| **Kustomisasi** | Edit sumber, rebuild | Buat schema.yaml |
| **Iterasi** | Terkunci fase | Fleksibel, edit apa saja |
| **Dukungan Editor** | Konfigurator/adaptor khusus alat | Direktori skill tunggal |

## Skema

Skema mendefinisikan artefak apa yang ada dan dependensinya. Yang saat ini tersedia:

- **spec-driven** (default): proposal → spesifikasi → desain → tugas

```bash
# Daftar skema yang tersedia
openspec schemas

# Lihat semua skema beserta sumber resolusinya
openspec schema which --all

# Buat skema baru secara interaktif
openspec schema init my-workflow

# Fork skema yang ada untuk kustomisasi
openspec schema fork spec-driven my-workflow

# Validasi struktur skema sebelum digunakan
openspec schema validate my-workflow
```

## Tips

- Gunakan `/opsx:explore` untuk memikirkan sebuah ide sebelum berkomitmen pada perubahan
- `/opsx:ff` ketika Anda tahu apa yang Anda inginkan, `/opsx:continue` saat sedang menjelajahi
- Selama `/opsx:apply`, jika ada yang salah — perbaiki artefaknya, lalu lanjutkan
- Tugas melacak kemajuan melalui kotak centang di `tasks.md`
- Periksa status kapan saja: `openspec status --change "name"`

## Umpan Balik

Ini masih kasar. Itu disengaja — kami sedang mempelajari apa yang berhasil.

Menemukan bug? Punya ide? Bergabunglah dengan kami di [Discord](https://discord.gg/YctCnvvshC) atau buka issue di [GitHub](https://github.com/Fission-AI/openspec/issues).