# Konsep

Panduan ini menjelaskan ide inti di balik OpenSpec dan bagaimana semuanya saling terkait. Untuk penggunaan praktis, lihat [Getting Started](getting-started.md) dan [Workflows](workflows.md).

## Filosofi

OpenSpec dibangun di atas empat prinsip:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Mengapa Prinsip-Prinsip Ini Penting

**Fleksibel, tidak kaku.** Sistem spesifikasi tradisional mengunci Anda ke dalam fase-fase tertentu: pertama Anda merencanakan, kemudian Anda mengimplementasikan, lalu selesai. OpenSpec lebih fleksibel — Anda dapat membuat artefak dalam urutan apa pun yang masuk akal bagi pekerjaan Anda.

**Iteratif, bukan air terjun (waterfall).** Persyaratan berubah. Pemahaman semakin mendalam. Apa yang tampaknya merupakan pendekatan yang baik di awal mungkin tidak bertahan setelah Anda melihat *codebase*. OpenSpec merangkul kenyataan ini.

**Mudah, tidak rumit.** Beberapa kerangka kerja spesifikasi memerlukan penyiapan yang ekstensif, format yang kaku, atau proses yang berat. OpenSpec tidak menghalangi pekerjaan Anda. Inisialisasi dalam hitungan detik, mulai bekerja segera, dan sesuaikan hanya jika diperlukan.

**Prioritas pada sistem yang sudah ada (brownfield).** Sebagian besar pekerjaan perangkat lunak bukanlah membangun dari awal — melainkan memodifikasi sistem yang sudah ada. Pendekatan berbasis delta OpenSpec memudahkan untuk menentukan perubahan pada perilaku yang sudah ada, tidak hanya mendeskripsikan sistem baru.

## Gambaran Besar

OpenSpec mengatur pekerjaan Anda ke dalam dua area utama:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Sumber kebenaran   │◄─────│  Modifikasi yang diusulkan     │   │
│   │  Cara sistem Anda    │ merge│  Setiap perubahan = satu folder │   │
│   │  saat ini bekerja  │      │  Berisi artefak + delta       │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** adalah sumber kebenaran — mereka menjelaskan bagaimana sistem Anda saat ini berperilaku.

**Changes** adalah modifikasi yang diusulkan — mereka berada dalam folder terpisah sampai Anda siap untuk menggabungkannya (merge).

Pemisahan ini adalah kunci. Anda dapat mengerjakan beberapa perubahan secara paralel tanpa konflik. Anda dapat meninjau suatu perubahan sebelum hal itu memengaruhi specs utama. Dan ketika Anda mengarsipkan sebuah perubahan, delta-nya akan digabungkan dengan bersih ke dalam sumber kebenaran.

## Specs

Specs menjelaskan perilaku sistem Anda menggunakan persyaratan dan skenario terstruktur.

### Struktur

```
openspec/specs/
├── auth/
│   └── spec.md           # Perilaku autentikasi
├── payments/
│   └── spec.md           # Pemrosesan pembayaran
├── notifications/
│   └── spec.md           # Sistem notifikasi
└── ui/
    └── spec.md           # Perilaku UI dan tema
```

Atur specs berdasarkan domain — pengelompokan logis yang masuk akal bagi sistem Anda. Pola umum:

- **Berdasarkan area fitur**: `auth/`, `payments/`, `search/`
- **Berdasarkan komponen**: `api/`, `frontend/`, `workers/`
- **Berdasarkan konteks terbatas (bounded context)**: `ordering/`, `fulfillment/`, `inventory/`

### Format Spec

Sebuah spec berisi persyaratan, dan setiap persyaratan memiliki skenario:

```markdown
# Spesifikasi Auth

## Tujuan
Manajemen autentikasi dan sesi untuk aplikasi.

## Persyaratan

### Persyaratan: Autentikasi Pengguna
Sistem SHALL mengeluarkan token JWT setelah login berhasil.

#### Skenario: Kredensial Valid
- GIVEN pengguna dengan kredensial yang valid
- WHEN pengguna mengirimkan formulir login
- THEN sebuah token JWT dikembalikan
- AND pengguna dialihkan ke dashboard

#### Skenario: Kredensial Tidak Valid
- GIVEN kredensial tidak valid
- WHEN pengguna mengirimkan formulir login
- THEN pesan kesalahan ditampilkan
- AND tidak ada token yang dikeluarkan

### Persyaratan: Kedaluwarsa Sesi
Sistem MUST mengakhiri sesi setelah 30 menit tanpa aktivitas.

#### Skenario: Batas Waktu Idle
- GIVEN sebuah sesi terautentikasi
- WHEN 30 menit berlalu tanpa aktivitas
- THEN sesi tersebut dinonaktifkan
- AND pengguna harus melakukan autentikasi ulang
```

**Elemen kunci:**

| Elemen | Tujuan |
|---------|---------|
| `## Tujuan` | Deskripsi tingkat tinggi dari domain spec ini |
| `### Persyaratan:` | Perilaku spesifik yang harus dimiliki sistem |
| `#### Skenario:` | Contoh konkret dari persyaratan dalam tindakan |
| SHALL/MUST/SHOULD | Kata kunci RFC 2119 yang menunjukkan kekuatan persyaratan |

### Mengapa Struktur Specs Seperti Ini

**Persyaratan adalah "apa"** — mereka menyatakan apa yang harus dilakukan sistem tanpa menentukan implementasi.

**Skenario adalah "kapan"** — mereka menyediakan contoh konkret yang dapat diverifikasi. Skenario yang baik:
- Dapat diuji (Anda bisa menulis tes otomatis untuknya)
- Mencakup jalur bahagia (happy path) dan kasus tepi (edge cases)
- Menggunakan format Given/When/Then atau format terstruktur serupa

**Kata kunci RFC 2119** (SHALL, MUST, SHOULD, MAY) mengkomunikasikan maksud:
- **MUST/SHALL** — persyaratan mutlak
- **SHOULD** — direkomendasikan, tetapi pengecualian ada
- **MAY** — opsional

### Apa Itu Spec (dan Bukan Apa)

Spec adalah **kontrak perilaku**, bukan rencana implementasi.

Konten spec yang baik:
- Perilaku yang dapat diamati yang diandalkan oleh pengguna atau sistem hilir (downstream systems)
- Input, output, dan kondisi kesalahan
- Batasan eksternal (keamanan, privasi, keandalan, kompatibilitas)
- Skenario yang dapat diuji atau divalidasi secara eksplisit

Hindari dalam spec:
- Nama kelas/fungsi internal
- Pilihan pustaka atau kerangka kerja (framework)
- Detail implementasi langkah demi langkah
- Rencana eksekusi terperinci (itu milik `design.md` atau `tasks.md`)

Tes cepat:
- Jika implementasi dapat berubah tanpa mengubah perilaku yang terlihat secara eksternal, kemungkinan besar itu tidak termasuk dalam spec.

### Jaga Agar Tetap Ringan: Rigor Progresif

OpenSpec bertujuan untuk menghindari birokrasi. Gunakan tingkat paling ringan yang masih membuat perubahan tersebut dapat diverifikasi.

**Lite spec (default):**
- Persyaratan singkat yang berfokus pada perilaku
- Cakupan dan non-goal yang jelas
- Beberapa pemeriksaan penerimaan konkret

**Full spec (untuk risiko yang lebih tinggi):**
- Perubahan lintas tim atau lintas repositori (cross-repo)
- Perubahan API/kontrak, migrasi, masalah keamanan/privasi
- Perubahan di mana ambiguitas kemungkinan menyebabkan pengerjaan ulang yang mahal

Sebagian besar perubahan harus tetap dalam mode Lite.

### Kolaborasi Manusia + Agen

Dalam banyak tim, manusia mengeksplorasi dan agen menyusun artefak. Alur kerja yang dimaksudkan adalah:

1. Manusia memberikan maksud (intent), konteks, dan batasan.
2. Agen mengubah ini menjadi persyaratan dan skenario yang berfokus pada perilaku.
3. Agen menyimpan detail implementasi di `design.md` dan `tasks.md`, bukan di `spec.md`.
4. Validasi mengonfirmasi struktur dan kejelasan sebelum implementasi.

Ini membuat specs dapat dibaca oleh manusia dan konsisten bagi agen.

## Changes

Sebuah perubahan adalah modifikasi yang diusulkan untuk sistem Anda, dikemas sebagai folder dengan segala sesuatu yang diperlukan untuk memahami dan menerapkannya.

### Struktur Perubahan

```
openspec/changes/add-dark-mode/
├── proposal.md           # Mengapa dan apa
├── design.md             # Bagaimana (pendekatan teknis)
├── tasks.md              # Daftar periksa implementasi
├── .openspec.yaml        # Metadata perubahan (opsional)
└── specs/                # Spec delta
    └── ui/
        └── spec.md       # Apa yang berubah di ui/spec.md
```

Setiap perubahan bersifat mandiri (self-contained). Ia memiliki:
- **Artifacts** — dokumen yang menangkap maksud, desain, dan tugas
- **Delta specs** — spesifikasi untuk apa yang ditambahkan, dimodifikasi, atau dihapus
- **Metadata** — konfigurasi opsional untuk perubahan tertentu ini

### Mengapa Perubahan Berupa Folder

Mengemas sebuah perubahan sebagai folder memiliki beberapa manfaat:

1. **Semuanya bersama.** Proposal, desain, tugas, dan specs berada di satu tempat. Tidak perlu mencari di lokasi yang berbeda.

2. **Pekerjaan Paralel.** Beberapa perubahan dapat ada secara simultan tanpa konflik. Bekerja pada `add-dark-mode` sementara `fix-auth-bug` juga sedang berlangsung.

3. **Riwayat Bersih.** Ketika diarsipkan, perubahan dipindahkan ke `changes/archive/` dengan konteks lengkapnya tetap terjaga. Anda dapat melihat kembali dan memahami tidak hanya apa yang berubah, tetapi mengapa.

4. **Ramah Tinjauan (Review-friendly).** Folder perubahan mudah untuk ditinjau — buka folder tersebut, baca proposal, periksa desain, lihat delta spec.

## Artifacts

Artifacts adalah dokumen di dalam sebuah perubahan yang memandu pekerjaan.

### Alur Artefak

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   mengapa        apa           bagaimana      langkah-langkah
 + lingkup       perubahan     pendekatan    untuk dilakukan
```

Artefak dibangun di atas satu sama lain. Setiap artefak memberikan konteks untuk yang berikutnya.

### Jenis Artefak

#### Proposal (`proposal.md`)

Proposal menangkap **maksud (intent)**, **lingkup (scope)**, dan **pendekatan (approach)** pada tingkat tinggi.

```markdown
# Proposal: Tambahkan Dark Mode

## Maksud (Intent)
Pengguna telah meminta opsi dark mode untuk mengurangi ketegangan mata
selama penggunaan malam hari dan agar sesuai dengan preferensi sistem.

## Lingkup (Scope)
Termasuk dalam lingkup:
- Toggle tema di pengaturan
- Deteksi preferensi sistem
- Mempertahankan preferensi di localStorage

Di luar lingkup:
- Tema warna khusus (pekerjaan masa depan)
- Penimpaan tema per halaman

## Pendekatan (Approach)
Gunakan properti kustom CSS untuk theming dengan konteks React
untuk manajemen state. Deteksi preferensi sistem pada pemuatan pertama,
izinkan penimpaan manual.
```

**Kapan memperbarui proposal:**
- Perubahan lingkup (mempersempit atau memperluas)
- Maksud menjadi lebih jelas (pemahaman yang lebih baik tentang masalah tersebut)
- Pendekatan bergeser secara fundamental

#### Specs (delta specs di `specs/`)

Delta specs menjelaskan **apa yang berubah** relatif terhadap specs saat ini. Lihat [Delta Specs](#delta-specs) di bawah.

#### Desain (`design.md`)

Desain menangkap **pendekatan teknis** dan **keputusan arsitektur**.

````markdown
# Desain: Tambahkan Dark Mode

## Pendekatan Teknis
State tema dikelola melalui React Context untuk menghindari prop drilling.
Properti kustom CSS memungkinkan peralihan saat runtime tanpa toggling kelas.

## Keputusan Arsitektur

### Keputusan: Context daripada Redux
Menggunakan React Context untuk state tema karena:
- State biner sederhana (terang/gelap)
- Tidak ada transisi state yang kompleks
- Menghindari penambahan dependensi Redux

### Keputusan: Properti Kustom CSS
Menggunakan variabel CSS alih-alih CSS-in-JS karena:
- Berfungsi dengan stylesheet yang sudah ada
- Tanpa overhead runtime
- Solusi asli browser

## Aliran Data
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
Variabel CSS (diterapkan ke :root)
```

## Perubahan File
- `src/contexts/ThemeContext.tsx` (baru)
- `src/components/ThemeToggle.tsx` (baru)
- `src/styles/globals.css` (dimodifikasi)
````

**Kapan memperbarui desain:**
- Implementasi mengungkapkan bahwa pendekatan tersebut tidak akan berhasil
- Solusi yang lebih baik ditemukan
- Dependensi atau batasan berubah

#### Tasks (`tasks.md`)

Tasks adalah **daftar periksa implementasi** — langkah-langkah konkret dengan kotak centang.

```markdown
# Tugas

## 1. Infrastruktur Tema
- [ ] 1.1 Buat ThemeContext dengan state light/dark
- [ ] 1.2 Tambahkan properti kustom CSS untuk warna
- [ ] 1.3 Implementasikan persistensi localStorage
- [ ] 1.4 Tambahkan deteksi preferensi sistem

## 2. Komponen UI
- [ ] 2.1 Buat komponen ThemeToggle
- [ ] 2.2 Tambahkan toggle ke halaman pengaturan
- [ ] 2.3 Perbarui Header untuk menyertakan quick toggle

## 3. Styling
- [ ] 3.1 Tentukan palet warna tema gelap
- [ ] 3.2 Perbarui komponen untuk menggunakan variabel CSS
- [ ] 3.3 Uji rasio kontras untuk aksesibilitas
```

**Praktik terbaik tugas:**
- Kelompokkan tugas terkait di bawah judul
- Gunakan penomoran hierarkis (1.1, 1.2, dll.)
- Jaga agar tugas cukup kecil untuk diselesaikan dalam satu sesi
- Centang tugas saat Anda menyelesaikannya

## Delta Specs

Delta specs adalah konsep kunci yang membuat OpenSpec berfungsi untuk pengembangan brownfield. Mereka menjelaskan **apa yang berubah** daripada menyatakan kembali seluruh spec.

### Format

```markdown
# Delta untuk Auth

## Persyaratan YANG DITAMBAHKAN (ADDED Requirements)

### Persyaratan: Autentikasi Dua Faktor
Sistem MUST mendukung autentikasi dua faktor berbasis TOTP.

#### Skenario: Pendaftaran 2FA
- GIVEN pengguna tanpa 2FA diaktifkan
- WHEN pengguna mengaktifkan 2FA di pengaturan
- THEN sebuah QR code ditampilkan untuk penyiapan aplikasi authenticator
- AND pengguna harus memverifikasi dengan kode sebelum aktivasi

#### Skenario: Login 2FA
- GIVEN pengguna dengan 2FA diaktifkan
- WHEN pengguna mengirimkan kredensial yang valid
- THEN tantangan OTP disajikan
- AND login hanya selesai setelah OTP yang valid

## Persyaratan YANG DIMODIFIKASI (MODIFIED Requirements)

### Persyaratan: Kedaluwarsa Sesi
Sistem MUST mengakhiri sesi setelah 15 menit tanpa aktivitas.
(Sebelumnya: 30 menit)

#### Skenario: Batas Waktu Idle
- GIVEN sebuah sesi terautentikasi
- WHEN 15 menit berlalu tanpa aktivitas
- THEN sesi tersebut dinonaktifkan

## Persyaratan YANG DIHAPUS (REMOVED Requirements)

### Persyaratan: Ingat Saya (Remember Me)
(Dihentikan demi 2FA. Pengguna harus melakukan autentikasi ulang setiap sesi.)
```

### Bagian Delta

| Bagian | Arti | Apa yang Terjadi Saat Diarsipkan |
|---------|---------|------------------------|
| `## Persyaratan YANG DITAMBAHKAN` | Perilaku baru | Ditambahkan ke spec utama |
| `## Persyaratan YANG DIMODIFIKASI` | Perilaku yang diubah | Menggantikan persyaratan yang sudah ada |
| `## Persyaratan YANG DIHAPUS` | Perilaku yang usang (deprecated) | Dihapus dari spec utama |

### Mengapa Delta Daripada Spec Penuh

**Kejelasan.** Sebuah delta menunjukkan persis apa yang berubah. Membaca spec penuh, Anda harus membandingkannya secara mental dengan versi saat ini.

**Pencegahan Konflik.** Dua perubahan dapat menyentuh file spec yang sama tanpa konflik, selama mereka mengubah persyaratan yang berbeda.

**Efisiensi Tinjauan.** Peninjau melihat perubahannya, bukan konteks yang tidak berubah. Fokus pada apa yang penting.

**Cocok untuk Brownfield.** Sebagian besar pekerjaan memodifikasi perilaku yang sudah ada. Deltas menjadikan modifikasi sebagai hal utama (first-class), bukan pemikiran belakangan.

## Skema (Schemas)

Skema mendefinisikan jenis artefak dan dependensinya untuk sebuah alur kerja (workflow).

### Cara Kerja Skema

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Tidak ada dependensi, dapat dibuat pertama

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Membutuhkan proposal sebelum pembuatan

  - id: design
    generates: design.md
    requires: [proposal]      # Dapat dibuat paralel dengan specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Membutuhkan specs dan design terlebih dahulu
```

**Artefak membentuk grafik dependensi:**

```
                    proposal
                   (node akar)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (membutuhkan:                  (membutuhkan:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (membutuhkan:
                specs, design)
```

**Dependensi adalah pemungkin (enablers), bukan penghalang (gates).** Mereka menunjukkan apa yang mungkin untuk dibuat, bukan apa yang harus Anda buat selanjutnya. Anda dapat melewati desain jika tidak membutuhkannya. Anda dapat membuat specs sebelum atau sesudah desain — keduanya hanya bergantung pada proposal.

### Skema Bawaan (Built-in Schemas)

**spec-driven** (default)

Alur kerja standar untuk pengembangan berbasis spesifikasi:

```
proposal → specs → design → tasks → implement
```

Paling baik digunakan untuk: Sebagian besar pekerjaan fitur di mana Anda ingin menyepakati spesifikasi sebelum implementasi.

### Skema Kustom (Custom Schemas)

Buat skema kustom untuk alur kerja tim Anda:

```bash
# Buat dari awal
openspec schema init research-first

# Atau fork dari yang sudah ada
openspec schema fork spec-driven research-first
```

**Contoh skema kustom:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Lakukan riset terlebih dahulu

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal diinformasikan oleh hasil riset

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Lewati specs/design, langsung ke tasks
```

Lihat [Kustomisasi](customization.md) untuk rincian lengkap tentang cara membuat dan menggunakan skema kustom.

## Arsip (Archive)

Pengarsipan menyelesaikan sebuah perubahan dengan menggabungkan delta spesifikasi-nya ke dalam spesifikasi utama dan menjaga perubahan tersebut untuk riwayat.

### Apa yang Terjadi Saat Anda Mengarsipkan

```
Sebelum diarsipkan:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ digabungkan (merge)
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Setelah diarsipkan:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Sekarang sudah mencakup persyaratan 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Dijaga untuk riwayat
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Proses Pengarsipan

1. **Gabungkan delta.** Setiap bagian spesifikasi delta (ADDED/MODIFIED/REMOVED) diterapkan ke spesifikasi utama yang sesuai.

2. **Pindahkan ke arsip.** Folder perubahan dipindahkan ke `changes/archive/` dengan awalan tanggal untuk pengurutan kronologis.

3. **Pertahankan konteks.** Semua artefak tetap utuh di dalam arsip. Anda selalu dapat melihat kembali untuk memahami mengapa suatu perubahan dibuat.

### Mengapa Pengarsipan Penting

**Keadaan yang bersih (Clean state).** Perubahan aktif (`changes/`) hanya menunjukkan pekerjaan yang sedang berlangsung. Pekerjaan yang selesai dipindahkan ke tempatnya.

**Jejak audit (Audit trail).** Arsip menjaga konteks penuh dari setiap perubahan — tidak hanya apa yang berubah, tetapi proposal yang menjelaskan mengapa, desain yang menjelaskan bagaimana, dan tugas yang menunjukkan pekerjaan yang telah dilakukan.

**Evolusi spesifikasi.** Spesifikasi tumbuh secara organik seiring pengarsipan perubahan. Setiap arsip menggabungkan delta-nya, membangun spesifikasi komprehensif dari waktu ke waktu.

## Bagaimana Semuanya Saling Terkait

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              ALUR OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. MULAI      │  /opsx:propose (core) atau /opsx:new (expanded)           │
│   │     PERUBAHAN │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. BUAT      │  /opsx:ff atau /opsx:continue (alur kerja diperluas)         │
│   │     ARTEFAK  │  Membuat proposal → specs → design → tasks              │
│   │                │  (berdasarkan dependensi skema)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTASI │  /opsx:apply                                            │
│   │     TUGAS      │  Mengerjakan tugas, mencentangnya                  │
│   │                │◄──── Perbarui artefak seiring Anda belajar                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFIKASI │  /opsx:verify (opsional)                                │
│   │     PEKERJAAN  │  Periksa apakah implementasi sesuai dengan spesifikasi      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARSIP    │────►│  Delta spesifikasi digabungkan ke dalam spesifikasi utama │    │
│   │     PERUBAHAN │     │  Folder perubahan dipindahkan ke archive/             │    │
│   └────────────────┘     │  Spesifikasi kini menjadi sumber kebenaran yang diperbarui   │    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Siklus yang berkelanjutan (The virtuous cycle):**

1. Spesifikasi menjelaskan perilaku saat ini
2. Perubahan mengusulkan modifikasi (sebagai delta)
3. Implementasi mewujudkan perubahan tersebut
4. Arsip menggabungkan delta ke dalam spesifikasi
5. Spesifikasi kini menjelaskan perilaku baru
6. Perubahan berikutnya dibangun di atas spesifikasi yang diperbarui

## Glosarium

| Istilah | Definisi |
|------|------------|
| **Artifact** | Sebuah dokumen di dalam perubahan (proposal, desain, tugas, atau delta spec) |
| **Archive** | Proses menyelesaikan sebuah perubahan dan menggabungkan delta-nya ke dalam spesifikasi utama |
| **Change** | Modifikasi yang diusulkan untuk sistem, dikemas sebagai folder dengan artefak |
| **Delta spec** | Spesifikasi yang menjelaskan perubahan (ADDED/MODIFIED/REMOVED) relatif terhadap spesifikasi saat ini |
| **Domain** | Pengelompokan logis untuk spesifikasi (misalnya, `auth/`, `payments/`) |
| **Requirement** | Perilaku spesifik yang harus dimiliki sistem |
| **Scenario** | Contoh konkret dari sebuah requirement, biasanya dalam format Given/When/Then |
| **Schema** | Definisi jenis artefak dan dependensinya |
| **Spec** | Sebuah spesifikasi yang menjelaskan perilaku sistem, berisi requirement dan scenario |
| **Source of truth** | Direktori `openspec/specs/`, yang berisi perilaku yang disepakati saat ini |

## Langkah Selanjutnya (Next Steps)

- [Getting Started](getting-started.md) - Langkah praktis untuk memulai
- [Workflows](workflows.md) - Pola umum dan kapan harus menggunakan masing-masing alur kerja
- [Commands](commands.md) - Referensi perintah lengkap
- [Customization](customization.md) - Membuat skema kustom dan mengonfigurasi proyek Anda