# Konsep

Panduan ini menjelaskan ide-ide inti di balik OpenSpec dan bagaimana semuanya saling terhubung. Untuk penggunaan praktis, lihat [Memulai](getting-started.md) dan [Alur Kerja](workflows.md).

## Filosofi

OpenSpec dibangun berdasarkan empat prinsip:

```
fleksibel bukan kaku         — tanpa gerbang fase, kerjakan apa yang masuk akal
iteratif bukan air terjun    — pelajari saat Anda membangun, sempurnakan saat Anda melangkah
mudah bukan kompleks         — pengaturan ringkas, formalitas minimal
utamakan lapangan cokelat    — bekerja dengan basis kode yang ada, bukan hanya proyek baru
```

### Mengapa Prinsip-Prinsip Ini Penting

**Fleksibel bukan kaku.** Sistem spesifikasi tradisional mengunci Anda ke dalam fase: pertama Anda merencanakan, lalu Anda mengimplementasikan, lalu selesai. OpenSpec lebih fleksibel — Anda dapat membuat artefak dalam urutan apa pun yang masuk akal untuk pekerjaan Anda.

**Iteratif bukan air terjun.** Persyaratan berubah. Pemahaman mendalam. Apa yang tampak seperti pendekatan yang baik di awal mungkin tidak bertahan setelah Anda melihat basis kode. OpenSpec menerima realitas ini.

**Mudah bukan kompleks.** Beberapa kerangka kerja spesifikasi memerlukan pengaturan ekstensif, format kaku, atau proses yang berat. OpenSpec tidak menghalangi Anda. Inisialisasi dalam hitungan detik, mulai bekerja segera, sesuaikan hanya jika Anda perlu.

**Utamakan lapangan cokelat.** Sebagian besar pekerjaan perangkat lunak bukan membangun dari awal — melainkan memodifikasi sistem yang ada. Pendekatan berbasis delta OpenSpec memudahkan untuk menentukan perubahan pada perilaku yang ada, bukan hanya mendeskripsikan sistem baru.

## Gambaran Besar

OpenSpec mengorganisasi pekerjaan Anda menjadi dua area utama:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Sumber kebenaran   │◄─────│  Modifikasi yang diusulkan    │   │
│   │  Bagaimana sistem   │ merge│  Setiap perubahan = satu folder│   │
│   │  Anda saat ini      │      │  Berisi artefak + delta       │   │
│   │  bekerja            │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** adalah sumber kebenaran — mereka mendeskripsikan bagaimana sistem Anda saat ini berperilaku.

**Changes** adalah modifikasi yang diusulkan — mereka berada di folder terpisah hingga Anda siap untuk menggabungkannya.

Pemisahan ini adalah kunci. Anda dapat mengerjakan beberapa perubahan secara paralel tanpa konflik. Anda dapat meninjau sebuah perubahan sebelum ia mempengaruhi specs utama. Dan ketika Anda mengarsipkan sebuah perubahan, delta-nya akan bergabung dengan bersih ke dalam sumber kebenaran.

## Specs

Specs mendeskripsikan perilaku sistem Anda menggunakan persyaratan dan skenario yang terstruktur.

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

Organisasi specs berdasarkan domain — pengelompokan logis yang masuk akal untuk sistem Anda. Pola umum:

- **Berdasarkan area fitur**: `auth/`, `payments/`, `search/`
- **Berdasarkan komponen**: `api/`, `frontend/`, `workers/`
- **Berdasarkan konteks terikat**: `ordering/`, `fulfillment/`, `inventory/`

### Format Spec

Sebuah spec berisi persyaratan, dan setiap persyaratan memiliki skenario:

```markdown
# Spesifikasi Autentikasi

## Tujuan
Autentikasi dan manajemen sesi untuk aplikasi.

## Persyaratan

### Persyaratan: Autentikasi Pengguna
Sistem HARUS menerbitkan token JWT setelah login berhasil.

#### SENARIO: Kredensial valid
- DENGAN pengguna yang memiliki kredensial valid
- KETIKA pengguna mengirimkan formulir login
- MAKA token JWT dikembalikan
- DAN pengguna dialihkan ke dasbor

#### SENARIO: Kredensial tidak valid
- DENGAN kredensial tidak valid
- KETIKA pengguna mengirimkan formulir login
- MAKA pesan error ditampilkan
- DAN tidak ada token yang diterbitkan

### Persyaratan: Kedaluwarsa Sesi
Sistem WAJIB mengakhiri sesi setelah 30 menit tidak aktif.

#### SENARIO: Waktu tunggu idle
- DENGAN sesi yang terotentikasi
- KETIKA 30 menit berlalu tanpa aktivitas
- MAKA sesi menjadi tidak valid
- DAN pengguna harus melakukan autentikasi ulang
```

**Elemen kunci:**

| Elemen | Tujuan |
|---------|---------|
| `## Tujuan` | Deskripsi tingkat tinggi dari domain spec ini |
| `### Persyaratan:` | Perilaku spesifik yang harus dimiliki sistem |
| `#### SENARIO:` | Contoh konkret dari persyaratan dalam aksi |
| SHALL/MUST/SHOULD | Kata kunci RFC 2119 yang menunjukkan kekuatan persyaratan |

### Mengapa Specs Distrukturkan Seperti Ini

**Persyaratan adalah "apa"** — mereka menyatakan apa yang harus dilakukan sistem tanpa menentukan implementasi.

**Skenario adalah "kapan"** — mereka memberikan contoh konkret yang dapat diverifikasi. Skenario yang baik:
- Dapat diuji (Anda bisa menulis tes otomatis untuk mereka)
- Mencakup jalur happy path dan kasus tepi
- Menggunakan format terstruktur Given/When/Then atau serupa

**Kata kunci RFC 2119** (SHALL, MUST, SHOULD, MAY) mengkomunikasikan intensi:
- **MUST/SHALL** — persyaratan absolut
- **SHOULD** — direkomendasikan, tetapi ada pengecualian
- **MAY** — opsional

### Apa Itu Spec (dan Bukan Apa)

Spec adalah **kontrak perilaku**, bukan rencana implementasi.

Konten spec yang baik:
- Perilaku yang dapat diamati oleh pengguna atau sistem downstream
- Input, output, dan kondisi error
- Batasan eksternal (keamanan, privasi, keandalan, kompatibilitas)
- Skenario yang dapat diuji atau divalidasi secara eksplisit

Hindari dalam spec:
- Nama kelas/fungsi internal
- Pilihan library atau framework
- Detail implementasi langkah demi langkah
- Rencana eksekusi detail (miliknya di `design.md` atau `tasks.md`)

Tes cepat:
- Jika implementasi dapat berubah tanpa mengubah perilaku yang terlihat secara eksternal, kemungkinan itu bukan milik spec.

### Pertahankan Ringan: Ketat Progresif

OpenSpec bertujuan untuk menghindari birokrasi. Gunakan level paling ringan yang masih membuat perubahan dapat diverifikasi.

**Spec Lite (default):**
- Persyaratan singkat berorientasi perilaku
- Cakupan dan non-tujuan yang jelas
- Beberapa pemeriksaan penerimaan konkret

**Spec Lengkap (untuk risiko lebih tinggi):**
- Perubahan lintas tim atau lintas repo
- Perubahan API/kontrak, migrasi, masalah keamanan/privasi
- Perubahan di mana ambiguitas kemungkinan akan menyebabkan pekerjaan ulang yang mahal

Sebagian besar perubahan harus tetap dalam mode Lite.

### Kolaborasi Manusia + Agen

Di banyak tim, manusia menjelajahi dan agen membuat draf artefak. Loop yang dimaksud adalah:

1. Manusia memberikan intensi, konteks, dan batasan.
2. Agen mengubah ini menjadi persyaratan berorientasi perilaku dan skenario.
3. Agen menyimpan detail implementasi di `design.md` dan `tasks.md`, bukan di `spec.md`.
4. Validasi mengonfirmasi struktur dan kejelasan sebelum implementasi.

Ini menjaga spec tetap dapat dibaca oleh manusia dan konsisten untuk agen.

## Changes

Sebuah change adalah modifikasi yang diusulkan untuk sistem Anda, dikemas sebagai folder dengan semua yang diperlukan untuk memahami dan mengimplementasikannya.

### Struktur Change

```
openspec/changes/add-dark-mode/
├── proposal.md           # Mengapa dan apa
├── design.md             # Bagaimana (pendekatan teknis)
├── tasks.md              # Daftar periksa implementasi
├── .openspec.yaml        # Metadata perubahan (opsional)
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # Apa yang berubah di ui/spec.md
```

Setiap change bersifat mandiri. Ia memiliki:
- **Artefak** — dokumen yang menangkap intensi, desain, dan tugas
- **Delta specs** — spesifikasi untuk apa yang ditambahkan, dimodifikasi, atau dihapus
- **Metadata** — konfigurasi opsional untuk perubahan spesifik ini

### Mengapa Changes Adalah Folder

Mengemas sebuah change sebagai folder memiliki beberapa manfaat:

1. **Semuanya bersama.** Proposal, desain, tugas, dan specs berada di satu tempat. Tidak perlu mencari di berbagai lokasi.

2. **Pekerjaan paralel.** Beberapa change dapat ada secara bersamaan tanpa konflik. Kerjakan `add-dark-mode` sementara `fix-auth-bug` juga sedang berlangsung.

3. **Riwayat bersih.** Ketika diarsipkan, change berpindah ke `changes/archive/` dengan konteks lengkapnya terjaga. Anda dapat melihat ke belakang dan memahami tidak hanya apa yang berubah, tetapi mengapa.

4. **Ramah tinjauan.** Folder change mudah ditinjau — buka, baca proposal, periksa desain, lihat delta spec.

## Artefak

Artefak adalah dokumen dalam sebuah change yang memandu pekerjaan.

### Alur Artefak

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   mengapa         apa           bagaimana      langkah
 + cakupan       perubahan      pendekatan     yang diambil
```

Artefak dibangun di atas satu sama lain. Setiap artefak memberikan konteks untuk yang berikutnya.

### Tipe Artefak

#### Proposal (`proposal.md`)

Proposal menangkap **intensi**, **cakupan**, dan **pendekatan** secara tingkat tinggi.

```markdown
# Proposal: Tambahkan Mode Gelap

## Intensi
Pengguna telah meminta opsi mode gelap untuk mengurangi kelelahan mata
selama penggunaan malam hari dan menyesuaikan dengan preferensi sistem.

## Cakupan
Termasuk:
- Pengalih tema di pengaturan
- Deteksi preferensi sistem
- Menyimpan preferensi di localStorage

Tidak termasuk:
- Tema warna kustom (pekerjaan masa depan)
- Penggantian tema per halaman

## Pendekatan
Gunakan properti kustom CSS untuk tema dengan React context
untuk manajemen state. Deteksi preferensi sistem pada pemuatan pertama,
izinkan penggantian manual.
```

**Kapan harus memperbarui proposal:**
- Cakupan berubah (menyempit atau meluas)
- Intensi menjadi lebih jelas (pemahaman yang lebih baik tentang masalah)
- Pendekatan berubah secara mendasar

#### Specs (delta specs di `specs/`)

Delta specs mendeskripsikan **apa yang berubah** relatif terhadap specs saat ini. Lihat [Delta Specs](#delta-specs) di bawah.

#### Design (`design.md`)

Desain menangkap **pendekatan teknis** dan **keputusan arsitektur**.

````markdown
# Desain: Tambahkan Mode Gelap

## Pendekatan Teknis
State tema dikelola melalui React Context untuk menghindari prop drilling.
Properti kustom CSS memungkinkan pengalihan runtime tanpa penggantian kelas.

## Keputusan Arsitektur

### Keputusan: Konteks daripada Redux
Menggunakan React Context untuk state tema karena:
- State biner yang sederhana (terang/gelap)
- Tidak ada transisi state yang kompleks
- Menghindari penambahan dependensi Redux

### Keputusan: CSS Custom Properties
Menggunakan variabel CSS alih-alih CSS-in-JS karena:
- Berfungsi dengan stylesheet yang sudah ada
- Tidak ada beban runtime
- Solusi native browser

## Aliran Data
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## Perubahan File
- `src/contexts/ThemeContext.tsx` (baru)
- `src/components/ThemeToggle.tsx` (baru)
- `src/styles/globals.css` (dimodifikasi)
````

**Kapan harus memperbarui desain:**
- Implementasi mengungkapkan pendekatan tidak akan berhasil
- Solusi yang lebih baik ditemukan
- Dependensi atau batasan berubah

#### Tugas (`tasks.md`)

Tugas adalah **daftar periksa implementasi** — langkah-langkah konkret dengan kotak centang.

```markdown
# Tugas

## 1. Infrastruktur Tema
- [ ] 1.1 Buat ThemeContext dengan status terang/gelap
- [ ] 1.2 Tambahkan properti kustom CSS untuk warna
- [ ] 1.3 Implementasikan persistensi localStorage
- [ ] 1.4 Tambahkan deteksi preferensi sistem

## 2. Komponen UI
- [ ] 2.1 Buat komponen ThemeToggle
- [ ] 2.2 Tambahkan toggle ke halaman pengaturan
- [ ] 2.3 Perbarui Header untuk menyertakan toggle cepat

## 3. Pemrograman Gaya
- [ ] 3.1 Definisikan palet warna tema gelap
- [ ] 3.2 Perbarui komponen untuk menggunakan variabel CSS
- [ ] 3.3 Uji rasio kontras untuk aksesibilitas
```

**Praktik terbaik tugas:**
- Kelompokkan tugas terkait di bawah judul
- Gunakan penomoran hierarkis (1.1, 1.2, dll.)
- Buat tugas cukup kecil untuk diselesaikan dalam satu sesi
- Centang tugas saat Anda menyelesaikannya

## Spesifikasi Delta

Spesifikasi delta adalah konsep kunci yang membuat OpenSpec cocok untuk pengembangan brownfield. Mereka mendeskripsikan **apa yang berubah** daripada menyatakan kembali seluruh spesifikasi.

### Formatnya

```markdown
# Delta untuk Autentikasi

## Persyaratan DITAMBAHKAN

### Persyaratan: Autentikasi Dua Faktor
Sistem HARUS mendukung autentikasi dua faktor berbasis TOTP.

#### Skenario: Pendaftaran 2FA
- MENGINGAT pengguna tanpa 2FA yang diaktifkan
- KETIKA pengguna mengaktifkan 2FA di pengaturan
- MAKA kode QR ditampilkan untuk pengaturan aplikasi autentikator
- DAN pengguna harus memverifikasi dengan kode sebelum aktivasi

#### Skenario: Login 2FA
- MENGINGAT pengguna dengan 2FA yang diaktifkan
- KETIKA pengguna mengirimkan kredensial yang valid
- MAKA tantangan OTP ditampilkan
- DAN login selesai hanya setelah OTP yang valid

## Persyaratan DIMODIFIKASI

### Persyaratan: Kadaluarsa Sesi
Sistem HARUS mengakhiri sesi setelah 15 menit tidak aktif.
(Sebelumnya: 30 menit)

#### Skenario: Batas waktu idle
- MENGINGAT sesi yang terotentikasi
- KETIKA 15 menit berlalu tanpa aktivitas
- MAKA sesi dibatalkan

## Persyaratan DIHAPUS

### Persyaratan: Ingat Saya
(Dihentikan demi 2FA. Pengguna harus mengautentikasi ulang setiap sesi.)
```

### Bagian Delta

| Bagian | Arti | Apa yang Terjadi saat Pengarsipan |
|---------|---------|------------------------|
| `## Persyaratan DITAMBAHKAN` | Perilaku baru | Ditambahkan ke spesifikasi utama |
| `## Persyaratan DIMODIFIKASI` | Perilaku yang diubah | Menggantikan persyaratan yang ada |
| `## Persyaratan DIHAPUS` | Perilaku yang usang | Dihapus dari spesifikasi utama |

### Mengapa Delta Daripada Spesifikasi Penuh

**Kejelasan.** Delta menunjukkan dengan tepat apa yang berubah. Membaca spesifikasi penuh, Anda harus membedakannya secara mental dengan versi saat ini.

**Menghindari konflik.** Dua perubahan dapat menyentuh file spesifikasi yang sama tanpa konflik, selama mereka memodifikasi persyaratan yang berbeda.

**Efisiensi peninjauan.** Peninjau melihat perubahan, bukan konteks yang tidak berubah. Fokus pada hal yang penting.

**Cocok untuk brownfield.** Sebagian besar pekerjaan memodifikasi perilaku yang ada. Delta menjadikan modifikasi sebagai fitur utama, bukan sekadar pemikiran belakangan.

## Skema

Skema mendefinisikan jenis artefak dan dependensinya untuk suatu alur kerja.

### Cara Kerja Skema

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Tidak ada dependensi, bisa dibuat pertama

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Membutuhkan proposal sebelum dibuat

  - id: design
    generates: design.md
    requires: [proposal]      # Bisa dibuat bersamaan dengan specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Membutuhkan specs dan design terlebih dahulu
```

**Artefak membentuk grafik dependensi:**

```
                    proposal
                   (simpul akar)
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

**Dependensi adalah pemberi kemampuan, bukan gerbang.** Mereka menunjukkan apa yang mungkin untuk dibuat, bukan apa yang harus Anda buat selanjutnya. Anda dapat melewati desain jika tidak membutuhkannya. Anda dapat membuat spesifikasi sebelum atau sesudah desain — keduanya hanya bergantung pada proposal.

### Skema Bawaan

**spec-driven** (default)

Alur kerja standar untuk pengembangan berbasis spesifikasi:

```
proposal → specs → design → tasks → implement
```

Cocok untuk: Sebagian besar pekerjaan fitur di mana Anda ingin menyepakati spesifikasi sebelum implementasi.

### Skema Kustom

Buat skema kustom untuk alur kerja tim Anda:

```bash
# Buat dari awal
openspec schema init research-first

# Atapi fork yang sudah ada
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
    requires: [research]   # Proposal yang diinformasikan oleh riset

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Lewati specs/design, langsung ke tugas
```

Lihat [Kustomisasi](customization.md) untuk detail lengkap tentang membuat dan menggunakan skema kustom.

## Pengarsipan

Pengarsipan menyelesaikan suatu perubahan dengan menggabungkan spesifikasi delta-nya ke dalam spesifikasi utama dan mempertahankan perubahan tersebut untuk riwayat.

### Apa yang Terjadi Saat Anda Mengarsipkan

```
Sebelum pengarsipan:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Setelah pengarsipan:

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

1. **Gabungkan delta.** Setiap bagian spesifikasi delta (DITAMBAHKAN/DIMODIFIKASI/DIHAPUS) diterapkan ke spesifikasi utama yang sesuai.

2. **Pindahkan ke arsip.** Folder perubahan dipindahkan ke `changes/archive/` dengan awalan tanggal untuk pengurutan kronologis.

3. **Pertahankan konteks.** Semua artefak tetap utuh di arsip. Anda selalu dapat melihat kembali untuk memahami mengapa suatu perubahan dilakukan.

### Mengapa Pengarsipan Penting

**Keadaan bersih.** Perubahan aktif (`changes/`) hanya menampilkan pekerjaan yang sedang berlangsung. Pekerjaan yang selesai keluar dari jalan.

**Jejak audit.** Arsip mempertahankan konteks lengkap dari setiap perubahan — bukan hanya apa yang berubah, tetapi proposal yang menjelaskan mengapa, desain yang menjelaskan bagaimana, dan tugas yang menunjukkan pekerjaan yang dilakukan.

**Evolusi spesifikasi.** Spesifikasi berkembang secara organik saat perubahan diarsipkan. Setiap pengarsipan menggabungkan delta-nya, membangun spesifikasi yang komprehensif dari waktu ke waktu.

## Bagaimana Semuanya Terhubung

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              ALUR OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. MULAI      │  /opsx:propose (inti) atau /opsx:new (diperluas)        │
│   │     PERUBAHAN  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. BUAT       │  /opsx:ff atau /opsx:continue (alur kerja diperluas)    │
│   │     ARTEFAK    │  Membuat proposal → specs → design → tasks              │
│   │                │  (berdasarkan dependensi skema)                          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTASIKAN │  /opsx:apply                                       │
│   │     TUGAS      │  Kerjakan tugas, centang saat selesai                  │
│   │                │◄──── Perbarui artefak saat Anda belajar                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFIKASI │  /opsx:verify (opsional)                               │
│   │     PEKERJAAN  │  Periksa implementasi sesuai spesifikasi               │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARSIPKAN   │────►│  Spesifikasi delta digabungkan ke spesifikasi utama │    │
│   │     PERUBAHAN  │     │  Folder perubahan dipindahkan ke archive/    │    │
│   └────────────────┘     │  Spesifikasi sekarang menjadi sumber kebenaran yang diperbarui │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Siklus virtuous:**

1. Spesifikasi mendeskripsikan perilaku saat ini
2. Perubahan mengusulkan modifikasi (sebagai delta)
3. Implementasi membuat perubahan menjadi nyata
4. Pengarsipan menggabungkan delta ke dalam spesifikasi
5. Spesifikasi sekarang mendeskripsikan perilaku baru
6. Perubahan berikutnya dibangun di atas spesifikasi yang diperbarui

## Glosarium

| Istilah | Definisi |
|---------|----------|
| **Artifact** | Dokumen dalam sebuah perubahan (proposal, desain, tugas, atau delta spec) |
| **Archive** | Proses menyelesaikan sebuah perubahan dan menggabungkan delta-deltanya ke dalam spesifikasi utama |
| **Change** | Modifikasi yang diusulkan terhadap sistem, dikemas sebagai sebuah folder berisi artifact |
| **Delta spec** | Spesifikasi yang mendeskripsikan perubahan (DITAMBAH/DIUBAH/DIHAPUS) relatif terhadap spesifikasi saat ini |
| **Domain** | Pengelompokan logis untuk spesifikasi (contoh: `auth/`, `payments/`) |
| **Requirement** | Perilaku spesifik yang harus dimiliki oleh sistem |
| **Scenario** | Contoh konkret dari sebuah requirement, biasanya dalam format Given/When/Then |
| **Schema** | Definisi jenis artifact dan dependensi antar artifact |
| **Spec** | Spesifikasi yang mendeskripsikan perilaku sistem, berisi requirement dan scenario |
| **Source of truth** | Direktori `openspec/specs/`, berisi perilaku yang telah disepakati saat ini |

## Langkah Selanjutnya

- [Memulai](getting-started.md) - Langkah praktis pertama
- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakan masing-masing
- [Perintah](commands.md) - Referensi perintah lengkap
- [Kustomisasi](customization.md) - Membuat schema kustom dan mengonfigurasi proyek Anda