# Konsep

Panduan ini menjelaskan ide-ide inti di balik OpenSpec dan bagaimana konsep-konsep tersebut saling terkait. Untuk penggunaan praktis, lihat [Memulai](getting-started.md) dan [Alur Kerja](workflows.md).

## Filosofi

OpenSpec dibangun berdasarkan empat prinsip:

```
fluid not rigid         — tanpa gerbang fase, kerjakan apa yang masuk akal
iterative not waterfall — pelajari saat membangun, perbaiki seiring berjalan
easy not complex        — pengaturan ringan, upacara minimal
brownfield-first        — bekerja dengan basis kode yang ada, bukan hanya greenfield
```

### Mengapa Prinsip-Prinsip Ini Penting

**Fluid not rigid.** Sistem spesifikasi tradisional mengunci Anda ke dalam fase: pertama Anda merencanakan, lalu mengimplementasikan, lalu selesai. OpenSpec lebih fleksibel — Anda dapat membuat artefak dalam urutan apa pun yang masuk akal untuk pekerjaan Anda.

**Iterative not waterfall.** Kebutuhan berubah. Pemahaman semakin dalam. Apa yang tampak seperti pendekatan yang baik di awal mungkin tidak bertahan setelah Anda melihat basis kode. OpenSpec menerima kenyataan ini.

**Easy not complex.** Beberapa kerangka kerja spesifikasi memerlukan pengaturan yang luas, format yang kaku, atau proses yang berat. OpenSpec tidak menghalangi Anda. Inisialisasi dalam hitungan detik, mulai bekerja segera, sesuaikan hanya jika diperlukan.

**Brownfield-first.** Sebagian besar pekerjaan perangkat lunak bukan membangun dari awal — ini memodifikasi sistem yang ada. Pendekatan berbasis delta OpenSpec memudahkan untuk menentukan perubahan pada perilaku yang ada, bukan hanya menggambarkan sistem baru.

## Gambaran Besar

OpenSpec mengatur pekerjaan Anda ke dalam dua area utama:

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

**Specs** adalah sumber kebenaran — mereka menggambarkan bagaimana sistem Anda saat ini berperilaku.

**Changes** adalah modifikasi yang diusulkan — mereka berada di folder terpisah hingga Anda siap untuk menggabungkannya.

Pemisahan ini adalah kunci. Anda dapat mengerjakan beberapa perubahan secara paralel tanpa konflik. Anda dapat meninjau perubahan sebelum memengaruhi spesifikasi utama. Dan ketika Anda mengarsipkan perubahan, delta-nya akan bergabung dengan bersih ke dalam sumber kebenaran.

## Ruang Kerja Koordinasi

Dukungan ruang kerja sedang dalam pengembangan aktif dan belum siap digunakan. Jangan membuat otomatisasi eksternal, integrasi, atau alur kerja jangka panjang di atas perilaku ruang kerja; perintah, file status, dan output JSON dapat berubah sewaktu-waktu.

Perintah di bawah ini menyediakan alur pengaturan awal untuk perencanaan di seluruh repositori atau folder yang tertaut.

Proyek OpenSpec lokal repositori adalah default yang tepat ketika satu repositori memiliki alur perencanaan, implementasi, dan arsip. Beberapa pekerjaan mencakup beberapa repositori atau folder. Untuk kasus tersebut, ruang kerja koordinasi OpenSpec adalah rumah perencanaan yang persisten.

Model mental ruang kerja adalah:

```text
workspace = tempat perubahan lintas repositori yang terkait tinggal
link      = nama stabil untuk repositori atau folder yang dapat direncanakan oleh ruang kerja
change    = satu fitur, perbaikan, proyek, atau bagian pekerjaan terencana lainnya
```

Ruang kerja memiliki bentuk yang berbeda dari proyek lokal repositori:

```text
workspace-folder/
├── changes/                       # Perencanaan tingkat ruang kerja
└── .openspec-workspace/
    ├── workspace.yaml             # Identitas ruang kerja bersama dan nama tautan
    └── local.yaml                 # Jalur lokal mesin ini
```

Status OpenSpec lokal repositori mempertahankan bentuk yang ada:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Perbedaan itu penting. Folder ruang kerja adalah permukaan koordinasi untuk perencanaan di seluruh repositori atau folder yang tertaut. Setiap direktori `openspec/` repositori tetap menjadi rumah untuk spesifikasi milik repositori, perubahan lokal repositori, dan perencanaan implementasi. Pengguna tidak perlu menjalankan `openspec init` lokal repositori di dalam folder ruang kerja.

Nama tautan stabil adalah cara perencanaan ruang kerja merujuk ke repositori dan folder. Status ruang kerja bersama menyimpan nama seperti `api`, `web`, atau `checkout`; setiap mesin memetakan nama-nama tersebut ke jalur lokalnya sendiri di `.openspec-workspace/local.yaml`.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

Ruang kerja yang dibuat OpenSpec secara default mengecualikan `.openspec-workspace/local.yaml` dari status kolaborasi portabel. `.openspec-workspace/workspace.yaml` tetap portabel karena menyimpan nama ruang kerja dan nama tautan stabil, bukan jalur checkout absolut milik satu pengguna.

Jalur tertaut bisa berupa repositori penuh, folder di dalam monorepositori besar, atau folder yang sudah ada lainnya. Mereka tidak memerlukan status `openspec/` lokal repositori sebelum dapat berpartisipasi dalam perencanaan ruang kerja. Alur kerja implementasi, verifikasi, atau arsip selanjutnya mungkin memerlukan kesiapan repositori yang lebih besar, tetapi visibilitas perencanaan dimulai dengan tautan.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Ruang kerja yang dikelola berada di bawah direktori data standar OpenSpec:

```text
getGlobalDataDir()/workspaces
```

Itu berarti `$XDG_DATA_HOME/openspec/workspaces` ketika `XDG_DATA_HOME` diatur, `~/.local/share/openspec/workspaces` pada fallback gaya Unix, dan `%LOCALAPPDATA%\openspec\workspaces` pada fallback Windows asli. Shell Windows asli, PowerShell, dan WSL2 masing-masing menyimpan string jalur untuk runtime yang menjalankan OpenSpec. Fondasi ini tidak menerjemahkan antara `D:\repo`, `/mnt/d/repo`, dan jalur UNC WSL.

OpenSpec juga menyimpan registri lokal mesin di:

```text
getGlobalDataDir()/workspaces/registry.yaml
```

Registri memetakan nama ruang kerja ke lokasi ruang kerja sehingga perintah global selanjutnya dapat mendaftar atau memilih ruang kerja yang diketahui dari mana saja. Ini hanya indeks. Setiap folder ruang kerja tetap otoritatif untuk `.openspec-workspace/workspace.yaml` dan `.openspec-workspace/local.yaml` miliknya sendiri, sehingga catatan registri yang usang dapat dilaporkan dan diperbaiki tanpa mendefinisikan ulang ruang kerja itu sendiri.

Visibilitas ruang kerja bukan komitmen perubahan. Atur ruang kerja ketika OpenSpec perlu mengetahui repositori atau folder mana yang relevan; buat perubahan nanti ketika Anda siap untuk merencanakan fitur, perbaikan, proyek, atau bagian pekerjaan lainnya.

Perintah yang berguna:

```bash
# Pengaturan terpandu
openspec workspace setup

# Pengaturan ramah otomatisasi
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# Lihat ruang kerja yang diketahui dari registri lokal
openspec workspace list
openspec workspace ls

# Tambah atau perbaiki tautan untuk ruang kerja yang dipilih
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Periksa apa yang dapat diselesaikan mesin ini
openspec workspace doctor
openspec workspace doctor --workspace platform

# Buka kumpulan kerja yang tertaut
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

`workspace setup` selalu membuat ruang kerja di lokasi ruang kerja standar, mencatatnya di registri lokal, menunjukkan lokasi ruang kerja, dan memerlukan setidaknya satu repositori atau folder yang tertaut. Pengaturan interaktif menanyakan pembuka yang disukai. Pengaturan non-interaktif menyimpan satu hanya ketika `--opener codex`, `--opener claude`, `--opener github-copilot`, atau `--opener editor` disediakan.

OpenSpec juga memelihara file buka ruang kerja akar: blok panduan yang dikelola OpenSpec di `AGENTS.md`, file `<workspace-name>.code-workspace` lokal mesin untuk pembuka VS Code dan GitHub Copilot-in-VS-Code, dan entri abaikan khusus untuk file `.code-workspace` yang dipelihara tersebut. File `*.code-workspace` buatan pengguna tetap dapat dilacak karena aturan abaikan hanya menargetkan file yang dipelihara.

Ruang kerja VS Code yang dipelihara mencakup akar koordinasi sebagai `.` plus repositori atau folder tertaut yang valid sebagai akar tambahan. VS Code menampilkan entri-entri tersebut sebagai ruang kerja multi-akar.

`workspace open` membuka kumpulan kerja yang tertaut dengan pembuka yang disukai yang tersimpan kecuali `--agent <tool>` atau `--editor` diteruskan untuk sesi itu. Meneruskan kedua pengganti pembuka adalah kesalahan. Buka ruang kerja akar membuat repositori dan folder tertaut terlihat untuk eksplorasi dan perencanaan; implementasi dimulai setelah pengguna secara eksplisit meminta pekerjaan implementasi.

`workspace link` dan `workspace relink` hanya mencatat folder yang ada; mereka tidak membuat, menyalin, memindahkan, menginisialisasi, atau mengedit repositori atau folder yang tertaut. Setelah tautan atau tautan ulang berhasil, OpenSpec menyegarkan panduan yang dikelola, file ruang kerja VS Code, dan aturan abaikan.

Perintah ruang kerja yang memerlukan satu ruang kerja dapat dijalankan dari mana saja dengan `--workspace <name>`. Jika Anda menjalankannya di dalam folder ruang kerja atau subdirektori, OpenSpec menggunakan ruang kerja saat itu. Jika beberapa ruang kerja yang diketahui tersedia dan Anda tidak meneruskan `--workspace <name>`, perintah manusia menampilkan pemilih; `--json` dan `--no-interactive` gagal dengan kesalahan status terstruktur alih-alih meminta.

Perintah ruang kerja langsung mendukung output JSON untuk skrip. Respons JSON menyimpan data utama dalam objek `workspace`, `workspaces`, atau `link` dan melaporkan peringatan atau kesalahan dalam array `status`. Objek yang sehat menggunakan `status: []`.

## Spesifikasi

Spesifikasi menggambarkan perilaku sistem Anda menggunakan persyaratan dan skenario terstruktur.

### Struktur

```
openspec/specs/
├── autentikasi/
│   └── spec.md           # Perilaku autentikasi
├── pembayaran/
│   └── spec.md           # Pemrosesan pembayaran
├── notifikasi/
│   └── spec.md           # Sistem notifikasi
└── ui/
    └── spec.md           # Perilaku UI dan tema
```

Atur spesifikasi berdasarkan domain — pengelompokan logis yang masuk akal untuk sistem Anda. Pola umum:

- **Berdasarkan area fitur**: `autentikasi/`, `pembayaran/`, `pencarian/`
- **Berdasarkan komponen**: `api/`, `frontend/`, `workers/`
- **Berdasarkan konteks terbatas**: `pemesanan/`, `pemenuhan/`, `inventaris/`

### Format Spesifikasi

Sebuah spesifikasi berisi persyaratan, dan setiap persyaratan memiliki skenario:

```markdown
# Spesifikasi Autentikasi
```

## Tujuan
Autentikasi dan manajemen sesi untuk aplikasi.

## Persyaratan

### Persyaratan: Autentikasi Pengguna
Sistem HARUS mengeluarkan token JWT setelah login berhasil.

#### Skenario: Kredensial valid
- Diberikan pengguna dengan kredensial valid
- KETIKA pengguna mengirimkan formulir login
- MAKA token JWT dikembalikan
- DAN pengguna dialihkan ke dashboard

#### Skenario: Kredensial tidak valid
- Diberikan kredensial tidak valid
- KETIKA pengguna mengirimkan formulir login
- MAKA pesan kesalahan ditampilkan
- DAN tidak ada token yang dikeluarkan

### Persyaratan: Kedaluwarsa Sesi
Sistem HARUS mengakhiri sesi setelah 30 menit tidak aktif.

#### Skenario: Batas waktu menganggur
- Diberikan sesi yang terautentikasi
- KETIKA 30 menit berlalu tanpa aktivitas
- MAKA sesi dibatalkan
- DAN pengguna harus melakukan autentikasi ulang
```

**Elemen kunci:**

| Elemen | Tujuan |
|---------|---------|
| `## Purpose` | Deskripsi tingkat tinggi dari domain spesifikasi ini |
| `### Requirement:` | Perilaku spesifik yang harus dimiliki sistem |
| `#### Scenario:` | Contoh konkret dari persyaratan dalam aksi |
| SHALL/MUST/SHOULD | Kata kunci RFC 2119 yang menunjukkan kekuatan persyaratan |

### Mengapa Menyusun Spesifikasi Seperti Ini

**Persyaratan adalah "apa"** — mereka menyatakan apa yang harus dilakukan sistem tanpa menentukan implementasi.

**Skenario adalah "ketika"** — mereka memberikan contoh konkret yang dapat diverifikasi. Skenario yang baik:
- Dapat diuji (Anda dapat menulis pengujian otomatis untuk mereka)
- Mencakup jalur bahagia dan kasus tepi
- Menggunakan format terstruktur Given/When/Then atau serupa

**Kata kunci RFC 2119** (SHALL, MUST, SHOULD, MAY) mengkomunikasikan niat:
- **MUST/SHALL** — persyaratan absolut
- **SHOULD** — direkomendasikan, tetapi ada pengecualian
- **MAY** — opsional

### Apa Itu Spesifikasi (dan Bukan)

Spesifikasi adalah **kontrak perilaku**, bukan rencana implementasi.

Konten spesifikasi yang baik:
- Perilaku yang dapat diamati yang diandalkan pengguna atau sistem hilir
- Masukan, keluaran, dan kondisi kesalahan
- Batasan eksternal (keamanan, privasi, keandalan, kompatibilitas)
- Skenario yang dapat diuji atau divalidasi secara eksplisit

Hindari dalam spesifikasi:
- Nama kelas/fungsi internal
- Pilihan pustaka atau kerangka kerja
- Detail implementasi langkah demi langkah
- Rencana eksekusi terperinci (milik `design.md` atau `tasks.md`)

Ujian cepat:
- Jika implementasi dapat berubah tanpa mengubah perilaku yang terlihat secara eksternal, kemungkinan besar tidak termasuk dalam spesifikasi.

### Pertahankan Ringan: Ketelitian Progresif

OpenSpec bertujuan untuk menghindari birokrasi. Gunakan tingkat paling ringan yang masih membuat perubahan dapat diverifikasi.

**Spesifikasi lite (default):**
- Persyaratan singkat yang berfokus pada perilaku
- Cakupan dan non-tujuan yang jelas
- Beberapa pemeriksaan penerimaan konkret

**Spesifikasi penuh (untuk risiko lebih tinggi):**
- Perubahan lintas tim atau lintas repositori
- Perubahan API/kontrak, migrasi, masalah keamanan/privasi
- Perubahan di mana ambiguitas kemungkinan akan menyebabkan pengerjaan ulang yang mahal

Sebagian besar perubahan harus tetap dalam mode Lite.

### Kolaborasi Manusia + Agen

Di banyak tim, manusia menjelajahi dan agen menyusun artefak. Loop yang dimaksud adalah:

1. Manusia memberikan niat, konteks, dan batasan.
2. Agen mengubah ini menjadi persyaratan dan skenario yang berfokus pada perilaku.
3. Agen menyimpan detail implementasi di `design.md` dan `tasks.md`, bukan di `spec.md`.
4. Validasi mengonfirmasi struktur dan kejelasan sebelum implementasi.

Ini menjaga spesifikasi tetap dapat dibaca oleh manusia dan konsisten untuk agen.

## Perubahan

Sebuah perubahan adalah modifikasi yang diusulkan untuk sistem Anda, dikemas sebagai folder dengan semua yang diperlukan untuk memahami dan mengimplementasikannya.

### Struktur Perubahan

```
openspec/changes/add-dark-mode/
├── proposal.md           # Mengapa dan apa
├── design.md             # Bagaimana (pendekatan teknis)
├── tasks.md              # Daftar periksa implementasi
├── .openspec.yaml        # Metadata perubahan (opsional)
└── specs/                # Spesifikasi delta
    └── ui/
        └── spec.md       # Apa yang berubah di ui/spec.md
```

Setiap perubahan bersifat mandiri. Ia memiliki:
- **Artefak** — dokumen yang menangkap niat, desain, dan tugas
- **Spesifikasi delta** — spesifikasi untuk apa yang ditambahkan, dimodifikasi, atau dihapus
- **Metadata** — konfigurasi opsional untuk perubahan spesifik ini

### Mengapa Perubahan Berupa Folder

Mengemas perubahan sebagai folder memiliki beberapa keuntungan:

1. **Semuanya terkumpul.** Proposal, desain, tugas, dan spesifikasi berada di satu tempat. Tidak perlu mencari di lokasi berbeda.

2. **Kerja paralel.** Beberapa perubahan dapat ada secara bersamaan tanpa konflik. Bekerja pada `add-dark-mode` sementara `fix-auth-bug` juga sedang dalam proses.

3. **Riwayat yang bersih.** Saat diarsipkan, perubahan dipindahkan ke `changes/archive/` dengan konteks lengkapnya terjaga. Anda dapat melihat ke belakang dan memahami bukan hanya apa yang berubah, tetapi mengapa.

4. **Ramah tinjauan.** Folder perubahan mudah ditinjau — buka, baca proposalnya, periksa desainnya, lihat delta spesifikasinya.

## Artefak

Artefak adalah dokumen-dokumen dalam sebuah perubahan yang memandu pekerjaan.

### Alur Artefak

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artefak saling membangun. Setiap artefak menyediakan konteks untuk yang berikutnya.

### Jenis Artefak

#### Proposal (`proposal.md`)

Proposal menangkap **niat**, **cakupan**, dan **pendekatan** pada tingkat tinggi.

```markdown
# Proposal: Tambahkan Mode Gelap

## Niat
Pengguna telah meminta opsi mode gelap untuk mengurangi ketegangan mata
selama penggunaan malam hari dan menyesuaikan preferensi sistem.

## Cakupan
Dalam cakupan:
- Pengalih tema di pengaturan
- Deteksi preferensi sistem
- Simpan preferensi di localStorage

Di luar cakupan:
- Tema warna kustom (pekerjaan masa depan)
- Penggantian tema per halaman

## Pendekatan
Gunakan properti kustom CSS untuk tema dengan React context
untuk manajemen state. Deteksi preferensi sistem pada pemuatan pertama,
izinkan penggantian manual.
```

**Kapan memperbarui proposal:**
- Cakupan berubah (penyempitan atau perluasan)
- Niat menjadi lebih jelas (pemahaman lebih baik tentang masalah)
- Pendekatan berubah secara mendasar

#### Spesifikasi (spesifikasi delta di `specs/`)

Spesifikasi delta menggambarkan **apa yang berubah** relatif terhadap spesifikasi saat ini. Lihat [Spesifikasi Delta](#spesifikasi-delta) di bawah.

#### Desain (`design.md`)

Desain menangkap **pendekatan teknis** dan **keputusan arsitektur**.

````markdown
# Desain: Tambahkan Mode Gelap

## Pendekatan Teknis
State tema dikelola melalui React Context untuk menghindari prop drilling.
Properti kustom CSS memungkinkan pengalihan runtime tanpa penggantian class.

## Keputusan Arsitektur

### Keputusan: Context daripada Redux
Menggunakan React Context untuk state tema karena:
- State biner sederhana (terang/gelap)
- Tidak ada transisi state yang kompleks
- Menghindari menambahkan dependensi Redux

### Keputusan: Properti Kustom CSS
Menggunakan variabel CSS alih-alih CSS-in-JS karena:
- Bekerja dengan stylesheet yang ada
- Tidak ada overhead runtime
- Solusi native browser

## Alur Data
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

**Kapan memperbarui desain:**
- Implementasi mengungkapkan pendekatan tidak akan berhasil
- Solusi lebih baik ditemukan
- Dependensi atau batasan berubah

#### Tugas (`tasks.md`)

Tugas adalah **daftar periksa implementasi** — langkah-langkah konkret dengan kotak centang.

```markdown
# Tugas

## 1. Infrastruktur Tema
- [ ] 1.1 Buat ThemeContext dengan state terang/gelap
- [ ] 1.2 Tambahkan properti kustom CSS untuk warna
- [ ] 1.3 Implementasikan persistensi localStorage
- [ ] 1.4 Tambahkan deteksi preferensi sistem

## 2. Komponen UI
- [ ] 2.1 Buat komponen ThemeToggle
- [ ] 2.2 Tambahkan pengalih ke halaman pengaturan
- [ ] 2.3 Perbarui Header untuk menyertakan pengalih cepat

## 3. Penataan Gaya
- [ ] 3.1 Definisikan palet warna tema gelap
- [ ] 3.2 Perbarui komponen untuk menggunakan variabel CSS
- [ ] 3.3 Uji rasio kontras untuk aksesibilitas
```

**Praktik terbaik tugas:**
- Kelompokkan tugas terkait di bawah judul
- Gunakan penomoran hierarki (1.1, 1.2, dll.)
- Jaga tugas cukup kecil untuk diselesaikan dalam satu sesi
- Centang tugas saat Anda menyelesaikannya

## Spesifikasi Delta

Spesifikasi delta adalah konsep kunci yang membuat OpenSpec bekerja untuk pengembangan brownfield. Mereka menggambarkan **apa yang berubah** alih-alih mengulang seluruh spesifikasi.

### Format

```markdown
# Delta untuk Autentikasi

## Persyaratan DITAMBAH

### Persyaratan: Autentikasi Dua Faktor
Sistem HARUS mendukung autentikasi dua faktor berbasis TOTP.

#### Skenario: Pendaftaran 2FA
- Diberikan pengguna tanpa 2FA diaktifkan
- KETIKA pengguna mengaktifkan 2FA di pengaturan
- MAKA kode QR ditampilkan untuk pengaturan aplikasi autentikator
- DAN pengguna harus memverifikasi dengan kode sebelum aktivasi

#### Skenario: Login 2FA
- Diberikan pengguna dengan 2FA diaktifkan
- KETIKA pengguna mengirimkan kredensial yang valid
- MAKA tantangan OTP disajikan
- DAN login selesai hanya setelah OTP valid

## Persyaratan DIMODIFIKASI

### Persyaratan: Kedaluwarsa Sesi
Sistem HARUS mengakhiri sesi setelah 15 menit tidak aktif.
(Sebelumnya: 30 menit)

#### Skenario: Batas waktu idle
- Diberikan sesi terotentikasi
- KETIKA 15 menit berlalu tanpa aktivitas
- MAKA sesi dibatalkan

## Persyaratan DIHAPUS

### Persyaratan: Ingat Saya
(Dihapus demi 2FA. Pengguna harus mengotentikasi ulang setiap sesi.)
```

### Bagian Delta

| Bagian | Makna | Apa yang Terjadi Saat Diarsipkan |
|--------|-------|----------------------------------|
| `## Persyaratan DITAMBAH` | Perilaku baru | Ditambahkan ke spesifikasi utama |
| `## Persyaratan DIMODIFIKASI` | Perilaku berubah | Menggantikan persyaratan yang ada |
| `## Persyaratan DIHAPUS` | Perilaku usang | Dihapus dari spesifikasi utama |

### Mengapa Delta Bukan Spesifikasi Lengkap

**Kejelasan.** Delta menunjukkan dengan tepat apa yang berubah. Membaca spesifikasi lengkap, Anda harus membedakannya secara mental dengan versi saat ini.

**Penghindaran konflik.** Dua perubahan dapat menyentuh file spesifikasi yang sama tanpa konflik, selama mereka memodifikasi persyaratan yang berbeda.

**Efisiensi tinjauan.** Peninjau melihat perubahannya, bukan konteks yang tidak berubah. Fokus pada apa yang penting.

**Kesesuaian brownfield.** Sebagian besar pekerjaan memodifikasi perilaku yang ada. Delta membuat modifikasi menjadi kelas utama, bukan renungan.

## Skema

Skema mendefinisikan jenis artefak dan dependensinya untuk sebuah alur kerja.

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
    requires: [proposal]      # Bisa dibuat paralel dengan specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Membutuhkan specs dan design terlebih dahulu
```

**Artefak membentuk graf dependensi:**

```
                    proposal
                   (simpul akar)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (membutuhkan:               (membutuhkan:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (membutuhkan:
                specs, design)
```

**Dependensi adalah pemicu, bukan gerbang.** Dependensi menunjukkan apa yang mungkin untuk dibuat, bukan apa yang harus Anda buat selanjutnya. Anda bisa melewati design jika tidak membutuhkannya. Anda bisa membuat specs sebelum atau sesudah design — keduanya hanya bergantung pada proposal.

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
    requires: [research]   # Proposal berdasarkan riset

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Lewati specs/design, langsung ke tasks
```

Lihat [Kustomisasi](customization.md) untuk detail lengkap tentang membuat dan menggunakan skema kustom.

## Arsip

Pengarsipan menyelesaikan sebuah perubahan dengan menggabungkan spesifikasi delta-nya ke dalam spesifikasi utama dan menyimpan perubahan tersebut untuk riwayat.

### Apa yang Terjadi Saat Mengarsipkan

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
        └── 2025-01-24-add-2fa/    # Disimpan untuk riwayat
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Proses Pengarsipan

1. **Gabungkan delta.** Setiap bagian spesifikasi delta (DITAMBAHKAN/DIUBAH/DIHAPUS) diterapkan ke spesifikasi utama yang sesuai.

2. **Pindahkan ke arsip.** Folder perubahan dipindahkan ke `changes/archive/` dengan awalan tanggal untuk pengurutan kronologis.

3. **Pertahankan konteks.** Semua artefak tetap utuh dalam arsip. Anda selalu dapat melihat kembali untuk memahami mengapa sebuah perubahan dilakukan.

### Mengapa Pengarsipan Penting

**Keadaan bersih.** Perubahan aktif (`changes/`) hanya menampilkan pekerjaan yang sedang berlangsung. Pekerjaan yang selesai dipindahkan dari jangkauan.

**Jejak audit.** Arsip menyimpan konteks lengkap dari setiap perubahan — bukan hanya apa yang berubah, tetapi proposal yang menjelaskan mengapa, desain yang menjelaskan bagaimana, dan tugas yang menunjukkan pekerjaan yang dilakukan.

**Evolusi spesifikasi.** Spesifikasi berkembang secara organik seiring perubahan diarsipkan. Setiap arsip menggabungkan delta-nya, membangun spesifikasi yang komprehensif seiring waktu.

## Bagaimana Semuanya Terintegrasi

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
│   │                │  (berdasarkan dependensi skema)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTASI│  /opsx:apply                                            │
│   │     TUGAS      │  Kerjakan tugas, centang saat selesai                   │
│   │                │◄──── Perbarui artefak saat Anda belajar                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFIKASI │  /opsx:verify (opsional)                                │
│   │     PEKERJAAN  │  Periksa apakah implementasi sesuai spesifikasi         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARSIPKAN   │────►│  Spesifikasi delta digabung ke spesifikasi   │    │
│   │     PERUBAHAN  │     │  utama                                       │    │
│   └────────────────┘     │  Folder perubahan dipindahkan ke archive/    │    │
│                          │  Spesifikasi sekarang adalah sumber kebenaran│    │
│                          │  yang diperbarui                             │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Siklus positif:**

1. Spesifikasi menggambarkan perilaku saat ini
2. Perubahan mengusulkan modifikasi (sebagai delta)
3. Implementasi mewujudkan perubahan tersebut
4. Arsip menggabungkan delta ke dalam spesifikasi
5. Spesifikasi sekarang menggambarkan perilaku baru
6. Perubahan berikutnya dibangun berdasarkan spesifikasi yang diperbarui

## Glosarium

| Istilah | Definisi |
|---------|----------|
| **Artefak** | Sebuah dokumen dalam sebuah perubahan (proposal, desain, tugas, atau spesifikasi delta) |
| **Arsip** | Proses menyelesaikan sebuah perubahan dan menggabungkan delta-nya ke dalam spesifikasi utama |
| **Perubahan** | Sebuah modifikasi yang diusulkan untuk sistem, dikemas sebagai folder dengan artefak |
| **Spesifikasi delta** | Spesifikasi yang menggambarkan perubahan (DITAMBAHKAN/DIUBAH/DIHAPUS) relatif terhadap spesifikasi saat ini |
| **Domain** | Pengelompokan logis untuk spesifikasi (misalnya, `auth/`, `payments/`) |
| **Persyaratan** | Perilaku spesifik yang harus dimiliki sistem |
| **Skenario** | Contoh konkret dari sebuah persyaratan, biasanya dalam format Given/When/Then |
| **Skema** | Definisi jenis artefak dan dependensinya |
| **Spesifikasi** | Spesifikasi yang menggambarkan perilaku sistem, berisi persyaratan dan skenario |
| **Sumber kebenaran** | Direktori `openspec/specs/`, berisi perilaku yang disepakati saat ini |

## Langkah Selanjutnya

- [Memulai](getting-started.md) - Langkah praktis pertama
- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakannya
- [Perintah](commands.md) - Referensi perintah lengkap
- [Kustomisasi](customization.md) - Buat skema kustom dan konfigurasi proyek Anda