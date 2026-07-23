# Konsep

Panduan ini menjelaskan ide-ide inti di balik OpenSpec dan bagaimana mereka saling berkaitan. Untuk penggunaan praktis, lihat [Memulai](getting-started.md) dan [Alur Kerja](workflows.md).

## Filosofi

OpenSpec dibangun di sekitar empat prinsip:

```
fleksibel bukan kaku         — tidak ada gerbang fase, kerjakan hal yang masuk akal
iteratif bukan waterfall — pelajari saat membangun, perbaiki seiring berjalannya
mudah bukan rumit        — penyiapan ringan, proses formal minimal
brownfield-first        — berfungsi dengan basis kode yang sudah ada, bukan hanya greenfield
```

### Mengapa Prinsip-Prinsip Ini Penting

**Fleksibel bukan kaku.** Sistem spesifikasi tradisional mengunci Anda ke dalam fase: pertama Anda merencanakan, kemudian Anda mengimplementasikan, kemudian Anda selesai. OpenSpec lebih fleksibel — Anda dapat membuat artefak dalam urutan apapun yang masuk akal untuk pekerjaan Anda.

**Iteratif bukan waterfall.** Persyaratan berubah. Pemahaman semakin dalam. Apa yang terlihat seperti pendekatan baik di awal mungkin tidak berlaku lagi setelah Anda melihat basis kode. OpenSpec menerima realitas ini.

**Mudah bukan rumit.** Beberapa kerangka kerja spesifikasi memerlukan penyiapan yang luas, format yang kaku, atau proses yang berat. OpenSpec tidak menghalangi pekerjaan Anda. Inisialisasi dalam hitungan detik, mulai bekerja segera, kustomisasi hanya jika Anda membutuhkannya.

**Brownfield-first.** Sebagian besar pekerjaan perangkat lunak bukan membangun dari nol — melainkan memodifikasi sistem yang sudah ada. Pendekatan berbasis delta OpenSpec memudahkan untuk menspesifikasikan perubahan pada perilaku yang sudah ada, bukan hanya mendeskripsikan sistem baru.

## Gambaran Besar

OpenSpec mengatur pekerjaan Anda menjadi dua area utama:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Sumber kebenaran   │◄─────│  Modifikasi yang diusulkan    │   │
│   │  Bagaimana sistem   │ merge│  Setiap perubahan = satu      │   │
│   │  Anda saat ini      │      │  folder                       │   │
│   │  bekerja            │      │  Berisi artefak + delta       │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Spesifikasi** adalah sumber kebenaran — mereka mendeskripsikan bagaimana sistem Anda saat ini berperilaku.

**Perubahan** adalah modifikasi yang diusulkan — mereka berada di folder terpisah sampai Anda siap menggabungkannya.

Pemisahan ini adalah kunci. Anda dapat bekerja pada beberapa perubahan secara paralel tanpa konflik. Anda dapat meninjau perubahan sebelum mempengaruhi spesifikasi utama. Dan ketika Anda mengarsipkan perubahan, delta-nya digabungkan dengan bersih ke dalam sumber kebenaran.

## Spesifikasi

Spesifikasi mendeskripsikan perilaku sistem Anda menggunakan persyaratan dan skenario yang terstruktur.

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
    └── spec.md           # Perilaku dan tema UI
```

Organisir spesifikasi berdasarkan domain — pengelompokan logis yang masuk akal untuk sistem Anda. Pola umum:

- **Berdasarkan area fitur**: `auth/`, `payments/`, `search/`
- **Berdasarkan komponen**: `api/`, `frontend/`, `workers/`
- **Berdasarkan konteks terbatas**: `ordering/`, `fulfillment/`, `inventory/`

### Format Spesifikasi

Sebuah spesifikasi berisi persyaratan, dan setiap persyaratan memiliki skenario:

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**Elemen kunci:**

| Elemen | Tujuan |
|---------|---------|
| `## Purpose` | Deskripsi tingkat tinggi dari domain spesifikasi ini |
| `### Requirement:` | Perilaku spesifik yang harus dimiliki sistem |
| `#### Scenario:` | Contoh konkret dari persyaratan yang sedang berlangsung |
| SHALL/MUST/SHOULD | Kata kunci RFC 2119 yang menunjukkan kekuatan persyaratan |

### Mengapa Menstrukturkan Spesifikasi Dengan Cara Ini

**Persyaratan adalah "apa"** — mereka menyatakan apa yang harus dilakukan sistem tanpa menentukan implementasi.

**Skenario adalah "kapan"** — mereka memberikan contoh konkret yang dapat diverifikasi. Skenario yang baik:
- Dapat diuji (Anda dapat menulis tes otomatis untuknya)
- Mencakup jalur bahagia dan kasus tepi
- Menggunakan Given/When/Then atau format terstruktur serupa

**Kata kunci RFC 2119** (SHALL, MUST, SHOULD, MAY) mengkomunikasikan niat:
- **MUST/SHALL** — persyaratan mutlak
- **SHOULD** — direkomendasikan, tetapi ada pengecualian
- **MAY** — opsional

### Apa Itu Spesifikasi (Dan Apa Bukan)

Spesifikasi adalah **kontrak perilaku**, bukan rencana implementasi.

Konten spesifikasi yang baik:
- Perilaku yang dapat diamati yang bergantung pada pengguna atau sistem hiliran
- Input, output, dan kondisi kesalahan
- Batasan eksternal (keamanan, privasi, keandalan, kompatibilitas)
- Skenario yang dapat diuji atau divalidasi secara eksplisit

Hindari dalam spesifikasi:
- Nama kelas/fungsi internal
- Pilihan pustaka atau kerangka kerja
- Detail implementasi langkah demi langkah
- Rencana eksekusi detail (itu milik `design.md` atau `tasks.md`)

Uji cepat:
- Jika implementasi dapat diubah tanpa mengubah perilaku yang terlihat secara eksternal, kemungkinan besar tidak termasuk dalam spesifikasi.

### Jaga Agar Tetap Ringan: Keteguhan Progresif

OpenSpec bertujuan untuk menghindari birokrasi. Gunakan tingkat yang paling ringan yang masih membuat perubahan dapat diverifikasi.

**Spesifikasi ringan (default):**
- Persyaratan singkat yang berfokus pada perilaku
- Lingkup yang jelas dan tujuan non
- Beberapa pemeriksaan penerimaan yang konkret

**Spesifikasi lengkap (untuk risiko yang lebih tinggi):**
- Perubahan lintas tim atau lintas repositori
- Perubahan API/kontrak, migrasi, masalah keamanan/privasi
- Perubahan di mana ketidakjelasan kemungkinan menyebabkan pekerjaan ulang yang mahal

Sebagian besar perubahan harus tetap dalam mode Ringan.

### Kolaborasi Manusia + Agen

Di banyak tim, manusia mengeksplorasi dan agen membuat draf artefak. Loop yang dimaksud adalah:

1. Manusia memberikan niat, konteks, dan batasan.
2. Agen mengubah ini menjadi persyaratan dan skenario yang berfokus pada perilaku.
3. Agen menyimpan detail implementasi di `design.md` dan `tasks.md`, bukan di `spec.md`.
4. Validasi mengonfirmasi struktur dan kejelasan sebelum implementasi.

Ini membuat spesifikasi tetap mudah dibaca untuk manusia dan konsisten untuk agen.

## Perubahan

Perubahan adalah modifikasi yang diusulkan untuk sistem Anda, dikemas sebagai folder dengan semua yang dibutuhkan untuk memahaminya dan mengimplementasikannya.

### Struktur Perubahan

```
openspec/changes/add-dark-mode/
├── proposal.md           # Mengapa dan apa
├── design.md             # Bagaimana (pendekatan teknis)
├── tasks.md              # Daftar periksa implementasi
├── .openspec.yaml        # Metadata perubahan (opsional): skema, dibuat, skip_specs
└── specs/                # Spesifikasi delta
    └── ui/
        └── spec.md       # Apa yang berubah di ui/spec.md
```

Setiap perubahan mandiri. Ia memiliki:
- **Artefak** — dokumen yang menangkap niat, desain, dan tugas
- **Spesifikasi delta** — spesifikasi untuk apa yang sedang ditambahkan, diubah, atau dihapus
- **Metadata** — konfigurasi opsional untuk perubahan spesifik ini

### Mengapa Perubahan Berbentuk Folder

Mengemas perubahan sebagai folder memiliki beberapa manfaat:

1. **Semuanya bersama.** Proposal, desain, tugas, dan spesifikasi berada di satu tempat. Tidak perlu mencari di lokasi yang berbeda.
2. **Pekerjaan paralel.** Beberapa perubahan dapat ada secara simultan tanpa konflik. Bekerja pada `add-dark-mode` sementara `fix-auth-bug` juga sedang berlangsung.
3. **Riwayat yang bersih.** Ketika diarsipkan, perubahan pindah ke `changes/archive/` dengan konteks lengkapnya yang tetap terjaga. Anda dapat melihat kembali dan memahami tidak hanya apa yang berubah, tetapi mengapa.
4. **Mudah ditinjau.** Folder perubahan mudah untuk ditinjau — buka, baca proposal, periksa desain, lihat delta spesifikasi.

## Artefak

Artefak adalah dokumen dalam perubahan yang memandu pekerjaan.

### Aliran Artefak

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   mengapa         apa         bagaimana      langkah
 + lingkup     perubahan     pendekatan     yang diambil
```

Artefak saling membangun. Setiap artefak memberikan konteks untuk yang berikutnya.

### Jenis Artefak

#### Proposal (`proposal.md`)

Proposal menangkap **niat**, **lingkup**, dan **pendekatan** pada tingkat tinggi.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**Kapan harus memperbarui proposal:**
- Perubahan lingkup (mempersempit atau memperluas)
- Niat menjadi lebih jelas (pemahaman yang lebih baik tentang masalah)
- Pendekatan bergeser secara mendasar

#### Spesifikasi (spesifikasi delta di `specs/`)

Spesifikasi delta mendeskripsikan **apa yang berubah** relatif terhadap spesifikasi saat ini. Lihat [Spesifikasi Delta](#delta-specs) di bawah.

#### Desain (`design.md`)

Desain menangkap **pendekatan teknis** dan **keputusan arsitektur**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**Kapan harus memperbarui desain:**
- Implementasi menunjukkan pendekatan tidak akan berfungsi
- Solusi yang lebih baik ditemukan
- Dependensi atau batasan berubah

#### Tugas (`tasks.md`)

Tugas adalah **daftar periksa implementasi** — langkah-langkah konkret dengan kotak centang.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**Praktik terbaik untuk tugas:**
- Kelompokkan tugas terkait di bawah heading
- Gunakan penomoran hierarkis (1.1, 1.2, dll.)
- Jaga tugas cukup kecil untuk diselesaikan dalam satu sesi
- Centang tugas saat Anda menyelesaikannya

## Spesifikasi Delta

Spesifikasi delta adalah konsep kunci yang membuat OpenSpec berfungsi untuk pengembangan brownfield. Mereka mendeskripsikan **apa yang berubah** daripada mengulang seluruh spesifikasi.

### Format

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Bagian Delta

| Bagian | Makna | Yang Terjadi Saat Diarsipkan |
|---------|---------|------------------------|
| `## ADDED Requirements` | Perilaku baru | Ditambahkan ke spesifikasi utama |
| `## MODIFIED Requirements` | Perilaku yang diubah | Menggantikan persyaratan yang ada |
| `## REMOVED Requirements` | Perilaku yang ditinggalkan | Dihapus dari spesifikasi utama |

### Mengapa Delta Daripada Spesifikasi Lengkap

**Kejelasan.** Delta menunjukkan tepat apa yang berubah. Membaca spesifikasi lengkap, Anda harus membandingkannya secara mental dengan versi saat ini.

**Penghindarian konflik.** Dua perubahan dapat menyentuh file spesifikasi yang sama tanpa bertentangan, asalkan mereka memodifikasi persyaratan yang berbeda.

**Efisiensi peninjauan.** Peninjau melihat perubahan, bukan konteks yang tidak berubah. Fokus pada apa yang penting.

**Kesesuaian dengan brownfield.** Sebagian besar pekerjaan memodifikasi perilaku yang ada. Delta membuat modifikasi menjadi kelas utama, bukan pikiran setelahnya.

## Skema

Skema mendefinisikan jenis artefak dan dependensinya untuk suatu alur kerja.

### Cara Kerja Skema

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Tidak ada dependensi, dapat dibuat terlebih dahulu

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Memerlukan proposal sebelum membuat

  - id: design
    generates: design.md
    requires: [proposal]      # Dapat dibuat secara paralel dengan spesifikasi

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Memerlukan kedua spesifikasi dan desain terlebih dahulu
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
   (memerlukan:                  (memerlukan:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (memerlukan:
                spesifikasi, desain)
```

**Dependensi adalah fasilitator, bukan penghalang.** Mereka menunjukkan apa yang dapat dibuat, bukan apa yang harus Anda buat selanjutnya. Anda dapat melewati desain jika tidak membutuhkannya. Anda dapat membuat spesifikasi sebelum atau sesudah desain — keduanya hanya bergantung pada proposal.

### Skema Bawaan

**spec-driven** (default)

Alur kerja standar untuk pengembangan berbasis spesifikasi (spec-driven development):

```
proposal → specs → design → tasks → implement
```

Terbaik untuk: Sebagian besar pekerjaan fitur di mana Anda ingin menyepakati spesifikasi sebelum implementasi.

### Skema Kustom

Buat skema kustom untuk alur kerja tim Anda:

```bash
# Buat dari nol
openspec schema init research-first

# Atau fork skema yang sudah ada
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
    requires: [research]   # Proposal didasari oleh riset

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Lewati spesifikasi/desain, langsung ke tugas
```

Lihat [Kustomisasi](customization.md) untuk detail lengkap mengenai cara membuat dan menggunakan skema kustom.

## Arsip

Pengarsipan menyelesaikan suatu perubahan dengan menggabungkan delta spesifikasinya ke dalam spesifikasi utama dan mempertahankan perubahan untuk riwayat.

### Yang Terjadi Saat Anda Mengarsipkan

```
Sebelum arsip:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ gabung
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Setelah arsip:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Sekarang mencakup persyaratan 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Dipertahankan untuk riwayat
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Proses Pengarsipan

1. **Gabungkan delta.** Setiap bagian delta spesifikasi (DITAMBAHKAN/DIMODIFIKASI/DIHAPUS) diterapkan ke spesifikasi utama yang sesuai.

2. **Pindahkan ke arsip.** Folder perubahan dipindahkan ke `changes/archive/` dengan awalan tanggal untuk pengurutan kronologis.

3. **Pertahankan konteks.** Semua artefak tetap utuh di arsip. Anda selalu dapat melihat kembali untuk memahami mengapa perubahan tersebut dilakukan.

### Mengapa Pengarsipan Penting

**Status bersih.** Perubahan aktif (`changes/`) hanya menampilkan pekerjaan yang sedang berlangsung. Pekerjaan yang selesai dipindahkan keluar dari area tersebut.

**Jejak audit.** Arsip mempertahankan konteks lengkap setiap perubahan — bukan hanya apa yang diubah, tetapi proposal yang menjelaskan mengapa, desain yang menjelaskan bagaimana, dan tugas yang menunjukkan pekerjaan yang dilakukan.

**Evolusi spesifikasi.** Spesifikasi berkembang secara alami seiring pengarsipan perubahan. Setiap pengarsipan menggabungkan deltanya, membangun spesifikasi yang komprehensif seiring waktu.

## Bagaimana Semua Ini Saling Terkait

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              ALUR OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. MULAI      │  /opsx:propose (inti) atau /opsx:new (diperluas)       │
│   │     PERUBAHAN  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. BUAT       │  /opsx:ff atau /opsx:continue (alur kerja diperluas)   │
│   │     ARTEFAK    │  Membuat proposal → spesifikasi → desain → tugas        │
│   │                │  (berdasarkan dependensi skema)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3.            │  /opsx:apply                                            │
│   │     IMPLEMENTASIKAN  │  Kerjakan tugas satu per satu, centang saat selesai                  │
│   │     TUGAS      │◄──── Perbarui artefak seiring Anda belajar              │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFIKASI │  /opsx:verify (opsional)                               │
│   │     PEKERJAAN  │  Periksa apakah implementasi sesuai dengan spesifikasi │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARSIPKAN   │────►│  Delta spesifikasi digabungkan ke spesifikasi  │    │
│   │     PERUBAHAN  │     │  utama                                         │    │
│   └────────────────┘     │  Folder perubahan dipindahkan ke arsip/        │    │
│                          │  Spesifikasi sekarang adalah sumber kebenaran  │    │
│                          │  yang sudah diperbarui                          │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Siklus positif:**

1. Spesifikasi mendeskripsikan perilaku saat ini
2. Perubahan mengusulkan modifikasi (sebagai delta)
3. Implementasi membuat perubahan menjadi nyata
4. Arsip menggabungkan delta ke dalam spesifikasi
5. Spesifikasi sekarang mendeskripsikan perilaku baru
6. Perubahan selanjutnya dibangun di atas spesifikasi yang sudah diperbarui

## Glosarium

| Istilah | Definisi |
|------|------------|
| **Artefak** | Dokumen di dalam suatu perubahan (proposal, desain, tugas, atau delta spesifikasi) |
| **Arsip** | Proses menyelesaikan perubahan dan menggabungkan deltanya ke dalam spesifikasi utama |
| **Perubahan** | Modifikasi yang diusulkan untuk sistem, dikemas sebagai folder dengan artefak |
| **Delta spesifikasi** | Spesifikasi yang mendeskripsikan perubahan (DITAMBAHKAN/DIMODIFIKASI/DIHAPUS) relatif terhadap spesifikasi saat ini |
| **Domain** | Pengelompokan logis untuk spesifikasi (misalnya `auth/`, `payments/`) |
| **Persyaratan** | Perilaku spesifik yang harus dimiliki sistem |
| **Skenario** | Contoh konkret dari suatu persyaratan, biasanya dalam format Given/When/Then |
| **Skema** | Definisi jenis artefak dan dependensinya |
| **Spesifikasi** | Dokumen yang mendeskripsikan perilaku sistem, berisi persyaratan dan skenario |
| **Sumber kebenaran** | Direktori `openspec/specs/`, yang berisi perilaku yang sudah disepakati saat ini |

## Langkah Selanjutnya

- [Memulai](getting-started.md) - Langkah praktis pertama
- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakan masing-masing
- [Perintah](commands.md) - Referensi perintah lengkap
- [Kustomisasi](customization.md) - Buat skema kustom dan konfigurasikan proyek Anda