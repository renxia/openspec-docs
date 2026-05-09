# Alur Kerja OPSX

> Umpan balik diterima di [Discord](https://discord.gg/YctCnvvshC).

## Apa Itu?

OPSX sekarang adalah alur kerja standar untuk OpenSpec.

Ini adalah **alur kerja yang fleksibel dan iteratif** untuk perubahan OpenSpec. Tidak ada lagi fase yang kaku — hanya tindakan yang dapat Anda lakukan kapan saja.

## Mengapa Ini Ada

Alur kerja OpenSpec lama berfungsi, tetapi **terkunci rapat**:

- **Instruksi sudah tertanam** — terkubur dalam TypeScript, Anda tidak bisa mengubahnya
- **Semua atau tidak sama sekali** — satu perintah besar membuat segalanya, tidak bisa menguji bagian individual
- **Struktur tetap** — alur kerja yang sama untuk semua orang, tanpa kustomisasi
- **Kotak hitam** — ketika output AI buruk, Anda tidak bisa menyesuaikan prompt-nya

**OPSX membukanya.** Sekarang siapa pun bisa:

1. **Bereksperimen dengan instruksi** — edit template, lihat apakah AI bekerja lebih baik
2. **Menguji secara granular** — validasi instruksi setiap artefak secara independen
3. **Mengkustomisasi alur kerja** — definisikan artefak dan dependensi Anda sendiri
4. **Iterasi dengan cepat** — ubah template, uji segera, tanpa rebuild

```
Alur kerja lama:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Tertanam dalam paket  │           │  schema.yaml           │◄── Anda mengedit ini
│  (tidak bisa diubah)   │           │  templates/*.md        │◄── Atau ini
│        ↓               │           │        ↓               │
│  Tunggu rilis baru     │           │  Efek instan           │
│        ↓               │           │        ↓               │
│  Berharap lebih baik   │           │  Uji sendiri           │
└────────────────────────┘           └────────────────────────┘
```

**Ini untuk semua orang:**
- **Tim** — buat alur kerja yang sesuai dengan cara kerja Anda sebenarnya
- **Pengguna tingkat lanjut** — sesuaikan prompt untuk mendapatkan output AI yang lebih baik untuk basis kode Anda
- **Kontributor OpenSpec** — bereksperimen dengan pendekatan baru tanpa rilis

Kita semua masih belajar apa yang paling berhasil. OPSX memungkinkan kita belajar bersama.

## Pengalaman Pengguna

**Masalah dengan alur kerja linear:**
Anda "dalam fase perencanaan", lalu "dalam fase implementasi", lalu "selesai". Tetapi pekerjaan nyata tidak bekerja seperti itu. Anda mengimplementasikan sesuatu, menyadari desain Anda salah, perlu memperbarui spesifikasi, melanjutkan implementasi. Fase linear bertentangan dengan cara kerja yang sebenarnya terjadi.

**Pendekatan OPSX:**
- **Aksi, bukan fase** — buat, implementasikan, perbarui, arsipkan — lakukan kapan saja
- **Dependensi adalah pemberdaya** — mereka menunjukkan apa yang mungkin, bukan apa yang diperlukan selanjutnya

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Pengaturan

```bash
# Pastikan Anda sudah menginstal openspec — skill akan dibuat secara otomatis
openspec init
```

Ini membuat skill di `.claude/skills/` (atau setara) yang dideteksi secara otomatis oleh asisten pengkodean AI.

Secara default, OpenSpec menggunakan profil alur kerja `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Jika Anda menginginkan perintah alur kerja yang diperluas (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), konfigurasikan dengan `openspec config profile` dan terapkan dengan `openspec update`.

Selama pengaturan, Anda akan diminta untuk membuat **konfigurasi proyek** (`openspec/config.yaml`). Ini opsional tetapi direkomendasikan.

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
|--------|------|-----------|
| `schema` | string | Schema default untuk perubahan baru (contoh: `spec-driven`) |
| `context` | string | Konteks proyek yang disuntikkan ke dalam semua instruksi artefak |
| `rules` | object | Aturan per artefak, dikunci berdasarkan ID artefak |

### Cara Kerjanya

**Prioritas schema** (tertinggi ke terendah):
1. Flag CLI (`--schema <name>`)
2. Metadata perubahan (`.openspec.yaml` di direktori perubahan)
3. Konfigurasi proyek (`openspec/config.yaml`)
4. Default (`spec-driven`)

**Suntikan konteks:**
- Konteks ditambahkan di awal setiap instruksi artefak
- Dibungkus dalam tag `<context>...</context>`
- Membantu AI memahami konvensi proyek Anda

**Suntikan aturan:**
- Aturan hanya disuntikkan untuk artefak yang cocok
- Dibungkus dalam tag `<rules>...</rules>`
- Muncul setelah konteks, sebelum template

### ID Artefak Berdasarkan Schema

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

**"ID artefak tidak dikenal di rules: X"**
- Periksa ID artefak sesuai dengan schema Anda (lihat daftar di atas)
- Jalankan `openspec schemas --json` untuk melihat ID artefak untuk setiap schema

**Konfigurasi tidak diterapkan:**
- Pastikan file berada di `openspec/config.yaml` (bukan `.yml`)
- Periksa sintaks YAML dengan validator
- Perubahan konfigurasi berlaku segera (tidak perlu restart)

**Konteks terlalu besar:**
- Konteks dibatasi hingga 50KB
- Ringkas atau tautkan ke dokumen eksternal sebagai gantinya

## Perintah

| Perintah | Apa yang dilakukannya |
|----------|----------------------|
| `/opsx:propose` | Membuat perubahan dan menghasilkan artefak perencanaan dalam satu langkah (jalur cepat default) |
| `/opsx:explore` | Memikirkan ide, menyelidiki masalah, memperjelas persyaratan |
| `/opsx:new` | Memulai kerangka perubahan baru (alur kerja diperluas) |
| `/opsx:continue` | Membuat artefak berikutnya (alur kerja diperluas) |
| `/opsx:ff` | Mempercepat artefak perencanaan (alur kerja diperluas) |
| `/opsx:apply` | Mengimplementasikan tugas, memperbarui artefak sesuai kebutuhan |
| `/opsx:verify` | Memvalidasi implementasi terhadap artefak (alur kerja diperluas) |
| `/opsx:sync` | Menyinkronkan spesifikasi delta ke utama (alur kerja default, opsional) |
| `/opsx:archive` | Mengarsipkan saat selesai |
| `/opsx:bulk-archive` | Mengarsipkan beberapa perubahan yang telah selesai (alur kerja diperluas) |
| `/opsx:onboard` | Panduan langkah demi langkah untuk perubahan ujung-ke-ujung (alur kerja diperluas) |

## Penggunaan

### Jelajahi sebuah ide
```
/opsx:explore
```
Pikirkan ide, selidiki masalah, bandingkan opsi. Tidak diperlukan struktur - hanya mitra berpikir. Ketika wawasan mengkristal, transisikan ke `/opsx:propose` (default) atau `/opsx:new`/`/opsx:ff` (diperluas).

### Mulai perubahan baru
```
/opsx:propose
```
Membuat perubahan dan menghasilkan artefak perencanaan yang diperlukan sebelum implementasi.

Jika Anda telah mengaktifkan alur kerja diperluas, Anda dapat menggunakan:

```text
/opsx:new        # hanya kerangka
/opsx:continue   # buat satu artefak pada satu waktu
/opsx:ff         # buat semua artefak perencanaan sekaligus
```

### Buat artefak
```
/opsx:continue
```
Menunjukkan apa yang siap dibuat berdasarkan dependensi, lalu membuat satu artefak. Gunakan berulang kali untuk membangun perubahan Anda secara bertahap.

```
/opsx:ff add-dark-mode
```
Membuat semua artefak perencanaan sekaligus. Gunakan ketika Anda memiliki gambaran jelas tentang apa yang sedang Anda bangun.

### Implementasikan (bagian yang fleksibel)
```
/opsx:apply
```
Mengerjakan tugas, mencentangnya saat Anda berjalan. Jika Anda menangani beberapa perubahan, Anda dapat menjalankan `/opsx:apply <name>`; jika tidak, itu harus menyimpulkan dari percakapan dan meminta Anda untuk memilih jika tidak bisa menentukan.

### Selesaikan
```
/opsx:archive   # Pindahkan ke arsip saat selesai (meminta untuk menyinkronkan spesifikasi jika diperlukan)
```

## Kapan Memperbarui vs. Memulai dari Awal

Anda selalu dapat mengedit proposal atau spesifikasi Anda sebelum implementasi. Tetapi kapan penyempurnaan menjadi "ini adalah pekerjaan yang berbeda"?

### Apa yang Ditangkap oleh Proposal

Proposal mendefinisikan tiga hal:
1. **Niat** — Masalah apa yang Anda selesaikan?
2. **Cakupan** — Apa yang masuk/keluar dari batas?
3. **Pendekatan** — Bagaimana Anda akan menyelesaikannya?

Pertanyaannya adalah: mana yang berubah, dan seberapa banyak?

### Perbarui Perubahan yang Ada Ketika:

**Niat sama, eksekusi disempurnakan**
- Anda menemukan kasus tepi yang tidak Anda pertimbangkan
- Pendekatan perlu disesuaikan tetapi tujuan tidak berubah
- Implementasi mengungkapkan desain sedikit meleset

**Cakupan menyempit**
- Anda menyadari cakupan penuh terlalu besar, ingin mengirim MVP terlebih dahulu
- "Tambahkan mode gelap" → "Tambahkan sakelar mode gelap (preferensi sistem di v2)"

**Koreksi berbasis pembelajaran**
- Basis kode tidak terstruktur seperti yang Anda kira
- Dependensi tidak bekerja seperti yang diharapkan
- "Gunakan variabel CSS" → "Gunakan awalan dark: Tailwind sebagai gantinya"

### Mulai Perubahan Baru Ketika:

**Niat berubah secara mendasar**
- Masalah itu sendiri sekarang berbeda
- "Tambahkan mode gelap" → "Tambahkan sistem tema komprehensif dengan warna, font, spasi kustom"

**Cakupan meledak**
- Perubahan tumbuh begitu besar sehingga pada dasarnya pekerjaan yang berbeda
- Proposal asli akan tidak dikenali setelah pembaruan
- "Perbaiki bug login" → "Tulis ulang sistem autentikasi"

**Asli dapat diselesaikan**
- Perubahan asli dapat ditandai "selesai"
- Pekerjaan baru berdiri sendiri, bukan penyempurnaan
- Selesaikan "Tambahkan mode gelap MVP" → Arsipkan → Perubahan baru "Tingkatkan mode gelap"

### Heuristik

```
                        ┌─────────────────────────────────────┐
                        │     Apakah ini pekerjaan yang sama? │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Niat sama?        >50% tumpang tindih?   Bisakah asli
             Masalah sama?     Cakupan sama?          "selesai" tanpa
                    │                  │               perubahan ini?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         YA                TIDAK YA          TIDAK TIDAK           YA
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       PERBARUI           BARU PERBARUI    BARU PERBARUI         BARU
```

| Uji | Perbarui | Perubahan Baru |
|-----|----------|----------------|
| **Identitas** | "Hal yang sama, disempurnakan" | "Pekerjaan berbeda" |
| **Tumpang tindih cakupan** | >50% tumpang tindih | <50% tumpang tindih |
| **Penyelesaian** | Tidak bisa "selesai" tanpa perubahan | Dapat menyelesaikan asli, pekerjaan baru berdiri sendiri |
| **Cerita** | Rantai pembaruan menceritakan cerita yang koheren | Patch akan membingungkan lebih dari memperjelas |

### Prinsip

> **Pembaruan melestarikan konteks. Perubahan baru memberikan kejelasan.**
>
> Pilih pembaruan ketika riwayat pemikiran Anda berharga.
> Pilih baru ketika memulai dari awal akan lebih jelas daripada menambal.

Anggaplah seperti cabang git:
- Terus commit saat mengerjakan fitur yang sama
- Mulai cabang baru ketika itu benar-benar pekerjaan baru
- Terkadang gabungkan fitur parsial dan mulai dari awal untuk fase 2

## Apa Perbedaannya?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struktur** | Satu dokumen proposal besar | Artefak diskrit dengan dependensi |
| **Alur Kerja** | Fase linear: rencana → implementasi → arsip | Tindakan fleksibel — lakukan apa saja kapan saja |
| **Iterasi** | Canggung untuk kembali | Perbarui artefak seiring pembelajaran |
| **Kustomisasi** | Struktur tetap | Didorong oleh skema (definisikan artefak Anda sendiri) |

**Wawasan kunci:** pekerjaan tidak bersifat linear. OPSX berhenti berpura-pura bahwa pekerjaan itu linear.

## Penelusuran Mendalam Arsitektur

Bagian ini menjelaskan cara kerja OPSX di balik layar dan perbandingannya dengan alur kerja lama.
Contoh di bagian ini menggunakan kumpulan perintah yang diperluas (`new`, `continue`, dll.); pengguna default `core` dapat memetakan alur yang sama ke `propose → apply → sync → archive`.

### Filosofi: Fase vs Aksi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ALUR KERJA LAMA                                      │
│                    (Terkunci Fase, Semua-atau-Tidak Sama Sekali)            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   FASE       │ ───► │  FASE        │ ───► │   FASE       │             │
│   │  PERENCANAAN │      │ PELAKSANAAN  │      │  PENGARSIPAN │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Membuat SEMUA artefak sekaligus                                        │
│   • Tidak dapat kembali memperbarui spesifikasi selama pelaksanaan         │
│   • Gerbang fase memaksakan progresi linear                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            ALUR KERJA OPSX                                   │
│                      (Aksi Fleksibel, Iteratif)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AKSI (bukan fase)               │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              urutan apa saja               │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Membuat artefak satu per satu ATAU maju cepat                          │
│   • Memperbarui spesifikasi/desain/tugas selama pelaksanaan                │
│   • Dependensi mengaktifkan progres, fase tidak ada                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arsitektur Komponen

**Alur kerja lama** menggunakan templat yang dikodekan secara kaku dalam TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      KOMPONEN ALUR KERJA LAMA                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Templat Kaku (string TypeScript)                                          │
│                    │                                                        │
│                    ▼                                                        │
│   Konfigurator/adapter khusus alat                                          │
│                    │                                                        │
│                    ▼                                                        │
│   File Perintah yang Dihasilkan (.claude/commands/openspec/*.md)            │
│                                                                             │
│   • Struktur tetap, tidak ada kesadaran artefak                            │
│   • Perubahan memerlukan modifikasi kode + pembangunan ulang               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** menggunakan skema eksternal dan mesin grafik dependensi:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KOMPONEN OPSX                                        │
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
│   │      requires: [proposal]      ◄── Diaktifkan setelah proposal      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Mesin Grafik Artefak                                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Pengurutan topologis (urutan dependensi)                         │   │
│   │  • Deteksi status (keberadaan sistem file)                          │   │
│   │  • Pembuatan instruksi kaya (templat + konteks)                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   File Keahlian (.claude/skills/openspec-*/SKILL.md)                        │
│                                                                             │
│   • Kompatibel lintas editor (Claude Code, Cursor, Windsurf)               │
│   • Keahlian mengkueri CLI untuk data terstruktur                          │
│   • Dapat disesuaikan sepenuhnya melalui file skema                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Model Grafik Dependensi

Artefak membentuk grafik asiklik terarah (DAG). Dependensi adalah **pengaktif**, bukan gerbang:

```
                              proposal
                             (simpul akar)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (memerlukan:                (memerlukan:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (memerlukan:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ FASE APPLY   │
                          │ (memerlukan: │
                          │  tasks)      │
                          └──────────────┘
```

**Transisi status:**

```
   TERBLOKIR ────────────────► SIAP ────────────────► SELESAI
      │                        │                       │
   Dependensi               Semua dependensi        File ada
   hilang                   sudah SELESAI           di sistem file
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
  │  Tidak ada kesadaran tentang apa yang   │
  │  ada atau dependensi antar artefak      │
  └─────────────────────────────────────────┘
           │
           ▼
  Agen membuat SEMUA artefak dalam satu kali jalan
```

**OPSX** — agen mengkueri untuk konteks kaya:

```
  Pengguna: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Langkah 1: Kueri status saat ini                                        │
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
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Langkah 3: Baca dependensi → Buat SATU artefak → Tampilkan yang diaktifkan│
  └──────────────────────────────────────────────────────────────────────────┘
```

### Model Iterasi

**Alur kerja lama** — canggung untuk beriterasi:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Tunggu, desainnya salah"
       │               │
       │               ├── Opsi:
       │               │   • Edit file secara manual (merusak konteks)
       │               │   • Batalkan dan mulai ulang
       │               │   • Teruskan dan perbaiki nanti
       │               │
       │               └── Tidak ada mekanisme resmi "kembali"
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
      │                │         dari tempat terakhir
      │                │
      │                └── Membuat SATU artefak, menampilkan yang diaktifkan
      │
      └── Membangun kerangka perubahan, menunggu arahan
```

### Skema Kustom

Buat alur kerja kustom menggunakan perintah manajemen skema:

```bash
# Buat skema baru dari awal (interaktif)
openspec schema init my-workflow

# Atau forking skema yang ada sebagai titik awal
openspec schema fork spec-driven my-workflow

# Validasi struktur skema Anda
openspec schema validate my-workflow

# Lihat dari mana skema diselesaikan (berguna untuk debugging)
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

**Grafik Dependensi:**
```
   research ──► proposal ──► tasks
```

### Ringkasan

| Aspek | Lama | OPSX |
|--------|----------|------|
| **Templat** | TypeScript kaku | YAML + Markdown eksternal |
| **Dependensi** | Tidak ada (semua sekaligus) | DAG dengan pengurutan topologis |
| **Status** | Model mental berbasis fase | Keberadaan sistem file |
| **Kustomisasi** | Edit sumber, bangun ulang | Buat schema.yaml |
| **Iterasi** | Terkunci fase | Fleksibel, edit apa saja |
| **Dukungan Editor** | Konfigurator/adapter khusus alat | Direktori keahlian tunggal |

## Skema

Skema mendefinisikan artefak apa yang ada dan dependensinya. Saat ini tersedia:

- **spec-driven** (default): proposal → specs → design → tasks

```bash
# List available schemas
openspec schemas

# See all schemas with their resolution sources
openspec schema which --all

# Create a new schema interactively
openspec schema init my-workflow

# Fork an existing schema for customization
openspec schema fork spec-driven my-workflow

# Validate schema structure before use
openspec schema validate my-workflow
```

## Tips

- Gunakan `/opsx:explore` untuk memikirkan sebuah ide sebelum berkomitmen pada perubahan
- `/opsx:ff` ketika Anda tahu apa yang Anda inginkan, `/opsx:continue` saat sedang mengeksplorasi
- Selama `/opsx:apply`, jika ada yang salah — perbaiki artefaknya, lalu lanjutkan
- Tugas melacak progres melalui kotak centang di `tasks.md`
- Periksa status kapan saja: `openspec status --change "name"`

## Umpan Balik

Ini masih kasar. Itu disengaja — kami sedang belajar apa yang berhasil.

Menemukan bug? Punya ide? Bergabunglah dengan kami di [Discord](https://discord.gg/YctCnvvshC) atau buka isu di [GitHub](https://github.com/Fission-AI/openspec/issues).