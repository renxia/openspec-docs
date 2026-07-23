# OPSX Workflow
> Kami menyambut masukan di [Discord](https://discord.gg/YctCnvvshC).
## Apa Itu?
OPSX sekarang adalah alur kerja standar untuk OpenSpec.
Ini adalah **alur kerja yang fleksibel dan iteratif** untuk perubahan pada OpenSpec. Tidak ada lagi fase yang kaku — Anda hanya perlu melakukan tindakan yang bisa dilakukan kapan saja.

## Mengapa Hal Ini Ada

Alur kerja OpenSpec legacy berfungsi, tetapi **terkunci**:

- **Instruksi di-hardcode** — tertanam dalam TypeScript, Anda tidak dapat mengubahnya
- **Semua atau tidak sama sekali** — satu perintah besar membuat semuanya, tidak dapat menguji bagian individual
- **Struktur tetap** — alur kerja yang sama untuk semua orang, tidak ada penyesuaian
- **Kotak hitam** — ketika output AI buruk, Anda tidak dapat menyesuaikan prompt

**OPSX membukanya.** Sekarang siapa pun dapat:

1. **Bereksperimen dengan instruksi** — edit templat, lihat apakah AI bekerja lebih baik
2. **Uji secara detail** — validasi instruksi setiap artefak secara independen
3. **Sesuaikan alur kerja** — definisikan artefak dan dependensi Anda sendiri
4. **Iterasi dengan cepat** — ubah templat, uji segera, tanpa rebuild

```
Alur kerja legacy:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Di-hardcode di paket  │           │  schema.yaml           │◄── Anda edit ini
│  (tidak dapat diubah)  │           │  templates/*.md        │◄── Atau ini
│        ↓               │           │        ↓               │
│  Tunggu rilis baru     │           │  Efek instan           │
│        ↓               │           │        ↓               │
│  Berharap lebih baik   │           │  Uji sendiri           │
└────────────────────────┘           └────────────────────────┘
```

**Ini untuk semua orang:**
- **Tim** — buat alur kerja yang sesuai dengan cara Anda benar-benar bekerja
- **Pengguna tingkat lanjut** — sesuaikan prompt untuk mendapatkan output AI yang lebih baik untuk basis kode Anda
- **Kontributor OpenSpec** — bereksperimen dengan pendekatan baru tanpa rilis

Kita semua masih belajar apa yang bekerja paling baik. OPSX memungkinkan kita belajar bersama.

## Pengalaman Pengguna

**Masalah dengan alur kerja linier:**
Anda "dalam fase perencanaan", kemudian "dalam fase implementasi", kemudian "selesai". Tetapi pekerjaan nyata tidak bekerja seperti itu. Anda mengimplementasikan sesuatu, menyadari desain Anda salah, perlu memperbarui spesifikasi, melanjutkan implementasi. Fase linier melawan cara kerja yang sebenarnya terjadi.

**Pendekatan OPSX:**
- **Tindakan, bukan fase** — buat, implementasi, perbarui, arsipkan — lakukan salah satunya kapan saja
- **Dependensi adalah pemungkinkan** — mereka menunjukkan apa yang mungkin, bukan apa yang diperlukan selanjutnya

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Pengaturan

```bash
# Pastikan Anda telah menginstal openspec — keterampilan dihasilkan secara otomatis
openspec init
```

Ini membuat keterampilan di `.claude/skills/` (atau yang setara) yang secara otomatis terdeteksi oleh asisten koding AI.

Secara default, OpenSpec menggunakan profil alur kerja `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Jika Anda ingin perintah alur kerja yang diperluas (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), konfigurasikan dengan `openspec config profile` dan terapkan dengan `openspec update`.

Selama pengaturan, Anda akan diminta untuk membuat **konfigurasi proyek** (`openspec/config.yaml`). Ini opsional tetapi direkomendasikan.

## Konfigurasi Proyek

Konfigurasi proyek memungkinkan Anda mengatur default dan menyuntikkan konteks khusus proyek ke semua artefak.

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
|-------|------|-------------|
| `schema` | string | Skema default untuk perubahan baru (misalnya, `spec-driven`) |
| `context` | string | Konteks proyek yang disuntikkan ke semua instruksi artefak |
| `rules` | object | Aturan per artefak, dikunci berdasarkan ID artefak |

### Bagaimana Cara Kerjanya

**Prioritas skema** (tertinggi ke terendah):
1. Bendera CLI (`--schema <nama>`)
2. Metadata perubahan (`.openspec.yaml` di direktori perubahan)
3. Konfigurasi proyek (`openspec/config.yaml`)
4. Default (`spec-driven`)

**Penyuntikan konteks:**
- Konteks ditambahkan di depan setiap instruksi artefak
- Dibungkus dalam tag `<context>...</context>`
- Membantu AI memahami konvensi proyek Anda

**Penyuntikan aturan:**
- Aturan hanya disuntikkan untuk artefak yang cocok
- Dibungkus dalam tag `<rules>...</rules>`
- Muncul setelah konteks, sebelum templat

### ID Artefak berdasarkan Skema

**spec-driven** (default):
- `proposal` — Usulan perubahan
- `specs` — Spesifikasi
- `design` — Desain teknis
- `tasks` — Tugas implementasi

### Validasi Konfigurasi

- ID artefak yang tidak diketahui dalam `rules` menghasilkan peringatan
- Nama skema divalidasi terhadap skema yang tersedia
- Konteks memiliki batas ukuran 50KB
- YAML yang tidak valid dilaporkan dengan nomor baris

### Pemecahan Masalah

**"ID artefak yang tidak diketahui dalam aturan: X"**
- Periksa ID artefak cocok dengan skema Anda (lihat daftar di atas)
- Jalankan `openspec schemas --json` untuk melihat ID artefak untuk setiap skema

**Konfigurasi tidak diterapkan:**
- Pastikan file berada di `openspec/config.yaml` (bukan `.yml`)
- Periksa sintaks YAML dengan validator
- Perubahan konfigurasi berlaku segera (tidak perlu restart)

**Konteks terlalu besar:**
- Konteks dibatasi hingga 50KB
- Merangkum atau menautkan ke dokumen eksternal sebagai gantinya

## Perintah

| Perintah | Apa yang dilakukan |
|---------|--------------|
| `/opsx:propose` | Buat perubahan dan hasilkan artefak perencanaan dalam satu langkah (jalur cepat default) |
| `/opsx:explore` | Pikirkan ide, investigasi masalah, klarifikasi persyaratan |
| `/opsx:new` | Mulai kerangka perubahan baru (alur kerja yang diperluas) |
| `/opsx:continue` | Buat artefak berikutnya (alur kerja yang diperluas) |
| `/opsx:ff` | Fast-forward artefak perencanaan (alur kerja yang diperluas) |
| `/opsx:apply` | Implementasi tugas, memperbarui artefak sesuai kebutuhan |
| `/opsx:update` | Revisi artefak perencanaan perubahan dan jaga agar tetap koheren |
| `/opsx:verify` | Validasi implementasi terhadap artefak (alur kerja yang diperluas) |
| `/opsx:sync` | Sinkronkan delta spesifikasi ke main (alur kerja default, opsional) |
| `/opsx:archive` | Arsipkan ketika selesai |
| `/opsx:bulk-archive` | Arsipkan banyak perubahan yang telah selesai (alur kerja yang diperluas) |
| `/opsx:onboard` | Panduan langkah demi langkah perubahan end-to-end (alur kerja yang diperluas) |

## Penggunaan

### Jelajahi ide
```
/opsx:explore
```
Pikirkan ide, investigasi masalah, bandingkan opsi. Tidak ada struktur yang diperlukan - hanya mitra berpikir. Ketika wawasan mengkristal, transisi ke `/opsx:propose` (default) atau `/opsx:new`/`/opsx:ff` (diperluas).

### Mulai perubahan baru
```
/opsx:propose
```
Membuat perubahan dan menghasilkan artefak perencanaan yang dibutuhkan sebelum implementasi.

Jika Anda telah mengaktifkan alur kerja yang diperluas, Anda sebagai gantinya dapat menggunakan:

```text
/opsx:new        # hanya kerangka
/opsx:continue   # buat satu artefak pada satu waktu
/opsx:ff         # buat semua artefak perencanaan sekaligus
```

### Buat artefak
```
/opsx:continue
```
Menunjukkan apa yang siap dibuat berdasarkan dependensi, kemudian membuat satu artefak. Gunakan berulang kali untuk membangun perubahan Anda secara bertahap.

```
/opsx:ff add-dark-mode
```
Membuat semua artefak perencanaan sekaligus. Gunakan ketika Anda memiliki gambaran yang jelas tentang apa yang Anda bangun.

### Implementasi (bagian yang fleksibel)
```
/opsx:apply
```
Bekerja melalui tugas, menandai selesai saat Anda melakukannya. Jika Anda sedang menangani beberapa perubahan sekaligus, Anda dapat menjalankan `/opsx:apply <nama>`; jika tidak, seharusnya menyimpulkan dari percakapan dan meminta Anda untuk memilih jika tidak dapat menebak.

### Memperbarui perubahan
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
Merevisi artefak perencanaan perubahan yang ada dan menjaganya tetap koheren - dalam segala arah (edit desain mungkin mempengaruhi kembali usulan). Hanya artefak perencanaan: tidak pernah mengedit kode, dan tidak pernah membuat artefak yang hilang (itu adalah `/opsx:continue`). Setiap edit dikonfirmasi dengan Anda terlebih dahulu. Jika perubahan telah diimplementasikan, itu merekomendasikan `/opsx:apply` agar kode mengejar rencana yang telah direvisi. Jika revisi Anda mengubah *tujuan* perubahan, mulailah dari awal sebagai gantinya - lihat [Kapan Memperbarui vs. Mulai dari Awal](#when-to-update-vs-start-fresh).

### Selesaikan
```
/opsx:archive   # Pindah ke arsip ketika selesai (meminta untuk menyinkronkan spesifikasi jika diperlukan)
```

## Kapan Memperbarui vs. Mulai dari Awal

Anda selalu dapat mengedit usulan atau spesifikasi Anda sebelum implementasi. Tetapi kapan penyempurnaan menjadi "ini pekerjaan yang berbeda"?

### Apa yang Ditangkap oleh Usulan

Usulan mendefinisikan tiga hal:
1. **Tujuan** — Masalah apa yang sedang Anda selesaikan?
2. **Ruang lingkup** — Apa yang ada di dalam/luar batas?
3. **Pendekatan** — Bagaimana Anda akan menyelesaikannya?

Pertanyaannya adalah: mana yang berubah, dan seberapa banyak?

### Perbarui Perubahan yang Ada Ketika:

**Tujuan yang sama, eksekusi yang disempurnakan**
- Anda menemukan kasus tepi yang tidak Anda pertimbangkan
- Pendekatan perlu disesuaikan tetapi tujuan tidak berubah
- Implementasi menunjukkan desain sedikit tidak akurat

**Ruang lingkup menyempit**
- Anda menyadari ruang lingkup penuh terlalu besar, ingin mengirim MVP terlebih dahulu
- "Tambahkan mode gelap" → "Tambahkan tombol mode gelap (preferensi sistem di v2)"

**Koreksi yang didorong oleh pembelajaran**
- Basis kode tidak terstruktur seperti yang Anda pikirkan
- Dependensi tidak berfungsi seperti yang diharapkan
- "Gunakan variabel CSS" → "Gunakan awalan `dark:` Tailwind sebagai gantinya"

### Mulai Perubahan Baru Ketika:

**Tujuan berubah secara mendasar**
- Masalah itu sendiri sekarang berbeda
- "Tambahkan mode gelap" → "Tambahkan sistem tema komprehensif dengan warna, font, spasi khusus"

**Ruang lingkup meledak**
- Perubahan berkembang begitu banyak sehingga pada dasarnya pekerjaan yang berbeda
- Usulan asli akan tidak dikenali setelah pembaruan
- "Perbaiki bug login" → "Tulis ulang sistem autentikasi"

**Asli dapat diselesaikan**
- Perubahan asli dapat ditandai "selesai"
- Pekerjaan baru berdiri sendiri, bukan penyempurnaan
- Selesaikan "Tambahkan MVP mode gelap" → Arsipkan → Perubahan baru "Tingkatkan mode gelap"

### Heuristik

```
                        ┌─────────────────────────────────────┐
                        │     Apakah ini pekerjaan yang sama?  │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Tujuan sama?     >50% tumpang tindih? Dapat asli
             Masalah sama?    Ruang lingkup sama?  diselesaikan tanpa
                    │                  │          perubahan ini?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         YA               TIDAK YA          TIDAK TIDAK           YA
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       PERBARUI          BARU PERBARUI      BARU PERBARUI        BARU
```

| Tes | Perbarui | Perubahan Baru |
|------|--------|------------|
| **Identitas** | "Hal yang sama, disempurnakan" | "Pekerjaan yang berbeda" |
| **Tumpang tindih ruang lingkup** | >50% tumpang tindih | <50% tumpang tindih |
| **Penyelesaian** | Tidak dapat "selesai" tanpa perubahan | Dapat menyelesaikan asli, pekerjaan baru berdiri sendiri |
| **Cerita** | Rantai pembaruan menceritakan cerita yang koheren | Patch akan lebih membingungkan daripada menjelaskan |

### Prinsip

> **Pembaruan mempertahankan konteks. Perubahan baru memberikan kejelasan.**
>
> Pilih pembaruan ketika sejarah pemikiran Anda berharga.
> Pilih yang baru ketika memulai dari awal akan lebih jelas daripada menambal.

Pikirkan seperti cabang git:
- Terus melakukan commit saat bekerja pada fitur yang sama
- Mulai cabang baru ketika itu benar-benar pekerjaan baru
- Kadang-kadang gabungkan fitur parsial dan mulai dari awal untuk fase 2

## Apa yang Berbeda?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struktur** | Satu dokumen usulan besar | Artefak terpisah dengan dependensi |
| **Alur kerja** | Fase linier: rencanakan → implementasi → arsipkan | Tindakan fleksibel — lakukan apa saja kapan saja |
| **Iterasi** | Tidak nyaman untuk kembali | Perbarui artefak saat Anda belajar |
| **Penyesuaian** | Struktur tetap | Didorong oleh skema (definisikan artefak Anda sendiri) |

**Wawasan kunci:** pekerjaan tidak linier. OPSX berhenti berpura-pura demikian.

## Penelusuran Arsitektur

Bagian ini menjelaskan cara kerja OPSX di balik layar dan bagaimana perbandingannya dengan alur kerja legacy.
Contoh dalam bagian ini menggunakan set perintah yang diperluas (`new`, `continue`, dll.); pengguna `core` default dapat memetakan alur yang sama ke `propose → apply → sync → archive`.

### Filosofi: Fase vs Aksi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ALUR KERJA LEGACY                                    │
│                    (Terikunci Fase, Semua atau Tidak Ada)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   FASE       │ ───► │   FASE       │ ───► │   FASE       │             │
│   │ PERENCANAAN  │      │ IMPLEMENTASI │      │  ARSIP       │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Membuat SEMUA artefak sekaligus                                         │
│   • Tidak dapat kembali memperbarui spesifikasi selama implementasi         │
│   • Gerbang fase memaksa kemajuan linear                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            ALUR KERJA OPSX                                   │
│                      (Aksi Fleksibel, Iteratif)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           AKSI (bukan fase)                │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              urutan apa saja               │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Buat artefak satu per satu ATAU fast-forward                           │
│   • Perbarui spesifikasi/desain/tugas selama implementasi                   │
│   • Dependensi memungkinkan kemajuan, fase tidak ada                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arsitektur Komponen

**Alur kerja legacy** menggunakan template hardcoded dalam TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      KOMPONEN ALUR KERJA LEGACY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Template Hardcoded (string TypeScript)                                    │
│                    │                                                        │
│                    ▼                                                        │
│   Konfigurator/adaptir khusus alat                                          │
│                    │                                                        │
│                    ▼                                                        │
│   File Perintah yang Dihasilkan (.claude/commands/openspec/*.md)            │
│                                                                             │
│   • Struktur tetap, tanpa kesadaran artefak                                 │
│   • Perubahan memerlukan modifikasi kode + rebuild                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** menggunakan skema eksternal dan mesin graf dependensi:

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
│   │      requires: [proposal]      ◄── Diaktifkan setelah proposal       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Mesin Graf Artefak                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Pengurutan topologis (pengurutan dependensi)                     │   │
│   │  • Deteksi keadaan (keberadaan filesystem)                          │   │
│   │  • Generasi instruksi kaya (template + konteks)                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   File Skill (.claude/skills/openspec-*/SKILL.md)                           │
│                                                                             │
│   • Kompatibel lintas editor (Claude Code, Cursor, Windsurf)                │
│   • Kueri skill CLI untuk data terstruktur                                  │
│   • Sepenuhnya dapat disesuaikan melalui file skema                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Model Graf Dependensi

Artefak membentuk graf arah tanpa siklus (DAG). Dependensi adalah **pengaktif**, bukan gerbang:

```
                              proposal
                             (node akar)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       desain
              (memerlukan:                  (memerlukan:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tugas
                           (memerlukan:
                           spesifikasi, desain)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ FASE APLIKASI│
                          │ (memerlukan: │
                          │  tugas)      │
                          └──────────────┘
```

**Transisi keadaan:**

```
   DIBLOKIR ────────────────► SIAP ────────────────► SELESAI
      │                        │                       │
   Dependensi               Semua dependensi         File ada
   yang hilang              adalah SELESAI           di filesystem
```

### Aliran Informasi

**Alur kerja legacy** — agen menerima instruksi statis:

```
  Pengguna: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Instruksi statis:                      │
  │  • Buat proposal.md                     │
  │  • Buat tasks.md                        │
  │  • Buat design.md                       │
  │  • Buat specs/<kemampuan>/spec.md       │
  │                                         │
  │  Tidak ada kesadaran tentang apa yang   │
  │  ada atau dependensi antar artefak      │
  └─────────────────────────────────────────┘
           │
           ▼
  Agen membuat SEMUA artefak sekaligus
```

**OPSX** — agen melakukan kueri untuk konteks yang kaya:

```
  Pengguna: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Langkah 1: Kueri keadaan saat ini                                       │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── Pertama siap      │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Langkah 2: Dapatkan instruksi kaya untuk artefak yang siap              │
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
  │  Langkah 3: Baca dependensi → Buat SATU artefak → Tunjukkan apa yang     │
  │             terbuka                                                      │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Model Iterasi

**Alur kerja legacy** — sulit untuk mengiterasi:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Tunggu, desainnya salah"
       │               │
       │               ├── Opsi:
       │               │   • Edit file secara manual (merusak konteks)
       │               │   • Batalkan dan mulai dari awal
       │               │   • Lanjutkan dan perbaiki nanti
       │               │
       │               └── Tidak ada mekanisme resmi untuk "kembali ke belakang"
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
      │                │         dari tempat Anda berhenti
      │                │
      │                └── Membuat SATU artefak, menampilkan artefak apa saja yang sudah tersedia
      │
      └── Membuat kerangka perubahan, menunggu arahan
```

### Skema Kustom

Buat alur kerja kustom menggunakan perintah manajemen skema:

```bash
# Tampilkan skema yang tersedia
openspec schemas

# Lihat semua skema beserta sumber resolusinya
openspec schema which --all

# Buat skema baru secara interaktif
openspec schema init my-workflow

# Fork skema yang ada untuk dikustomisasi
openspec schema fork spec-driven my-workflow

# Validasi struktur skema sebelum digunakan
openspec schema validate my-workflow
```

Skema disimpan di `openspec/schemas/` (lokal proyek, dikendalikan versi) atau `~/.local/share/openspec/schemas/` (global pengguna).

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

**Grafik Ketergantungan:**
```
   research ──► proposal ──► tasks
```

### Ringkasan

| Aspek | Legacy | OPSX |
|--------|----------|------|
| **Templat** | TypeScript hardcoded | YAML + Markdown eksternal |
| **Ketergantungan** | Tidak ada (semua sekaligus) | DAG dengan pengurutan topologi |
| **Status** | Model mental berbasis fase | Keberadaan sistem file |
| **Kustomisasi** | Edit sumber, bangun ulang | Buat schema.yaml |
| **Iterasi** | Terkunci fase | Fleksibel, edit apa saja |
| **Dukungan Editor** | Konfigurator/adaptator khusus alat | Direktori skills tunggal |
## Skema

Skema mendefinisikan artefak apa saja yang ada dan ketergantungannya. Yang saat ini tersedia:

- **spec-driven** (default): proposal → specs → design → tasks

```bash
# Tampilkan skema yang tersedia
openspec schemas

# Lihat semua skema beserta sumber resolusinya
openspec schema which --all

# Buat skema baru secara interaktif
openspec schema init my-workflow

# Fork skema yang ada untuk dikustomisasi
openspec schema fork spec-driven my-workflow

# Validasi struktur skema sebelum digunakan
openspec schema validate my-workflow
```

## Tips

- Gunakan `/opsx:explore` untuk memikirkan ide sebelum mengkomitmen perubahan
- Gunakan `/opsx:ff` ketika Anda sudah tahu yang diinginkan, `/opsx:continue` ketika sedang mengeksplorasi
- Selama `/opsx:apply`, jika ada yang salah — perbaiki artefaknya, lalu lanjutkan
- Tugas melacak kemajuan melalui kotak centang di `tasks.md`
- Periksa status kapan saja: `openspec status --change "name"`

## Umpan Balik

Ini masih kasar. Itu sengaja — kami sedang mempelajari apa yang berfungsi.

Menemukan bug? Punya ide? Bergabunglah dengan kami di [Discord](https://discord.gg/YctCnvvshC) atau buka isu di [GitHub](https://github.com/Fission-AI/openspec/issues).