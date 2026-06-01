# Konsep

Panduan ini menjelaskan ide-ide inti di balik OpenSpec dan bagaimana semuanya saling berkaitan. Untuk penggunaan praktis, lihat [Memulai](getting-started.md) dan [Alur Kerja](workflows.md).

## Filosofi

OpenSpec dibangun berdasarkan empat prinsip:

```
fleksibel bukan kaku        — tidak ada gerbang fase, kerjakan apa yang masuk akal
iteratif bukan waterfall    — belajar saat membangun, perbaiki seiring jalan
mudah bukan rumit           — pengaturan ringan, upacara minimal
brownfield-first            — bekerja dengan kode yang sudah ada, bukan hanya greenfield
```

### Mengapa Prinsip-prinsip Ini Penting

**Fleksibel bukan kaku.** Sistem spesifikasi tradisional mengunci Anda ke dalam fase: pertama Anda merencanakan, lalu mengimplementasikan, lalu selesai. OpenSpec lebih fleksibel — Anda dapat membuat artefak dalam urutan apa pun yang masuk akal untuk pekerjaan Anda.

**Iteratif bukan waterfall.** Kebutuhan berubah. Pemahaman semakin dalam. Apa yang tampak sebagai pendekatan yang baik di awal mungkin tidak bertahan setelah Anda melihat kode sumber. OpenSpec menerima realitas ini.

**Mudah bukan rumit.** Beberapa kerangka spesifikasi memerlukan pengaturan ekstensif, format kaku, atau proses yang berat. OpenSpec tidak menghalangi Anda. Inisialisasi dalam hitungan detik, langsung mulai bekerja, sesuaikan hanya jika diperlukan.

**Brownfield-first.** Sebagian besar pekerjaan perangkat lunak bukan membangun dari awal — itu memodifikasi sistem yang sudah ada. Pendekatan berbasis delta OpenSpec memudahkan untuk menentukan perubahan pada perilaku yang sudah ada, bukan hanya menggambarkan sistem baru.

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

Pemisahan ini adalah kunci. Anda dapat mengerjakan beberapa perubahan secara paralel tanpa konflik. Anda dapat meninjau perubahan sebelum memengaruhi spesifikasi utama. Dan ketika Anda mengarsipkan sebuah perubahan, delta-nya akan tergabung dengan bersih ke dalam sumber kebenaran.

## Ruang Kerja Koordinasi

Dukungan workspace masih dalam tahap beta. Model tampilan lokal di bawah ini adalah arah saat ini, tetapi otomatisasi eksternal, integrasi, dan alur kerja berdurasi panjang sebaiknya tetap menganggap perilaku perintah, file status, dan output JSON sebagai sesuatu yang masih berkembang.

Perintah-perintah di bawah ini menyediakan alur pengaturan awal untuk membuka tampilan lokal pada repositori atau folder yang tertaut.

Proyek OpenSpec lokal-repositori adalah pilihan default yang tepat ketika satu repositori memiliki alur perencanaan, implementasi, dan pengarsipan. Beberapa pekerjaan mencakup beberapa repositori atau folder. Untuk kasus tersebut, ruang kerja koordinasi OpenSpec adalah tampilan lokal-mesin yang menyimpan jalur yang ditautkan, status pembuka, dan pengaturan agen secara bersama.

Model mental workspace adalah:

```text
workspace     = tampilan lokal privat di atas penyimpanan konteks, inisiatif, repositori, dan folder
context store = wadah kontek bersama yang persisten
initiative    = konteks koordinasi persisten di dalam context store
link          = nama stabil untuk repositori atau folder yang dapat diselesaikan secara lokal oleh workspace
change        = satu bagian pekerjaan yang direncanakan; implementasi dimiliki oleh repositori pemilik
```

Workspace memiliki bentuk yang berbeda dari proyek lokal-repositori:

```text
getGlobalDataDir()/workspaces/<workspace-name>/
├── workspace.yaml                 # Catatan tampilan lokal privat
├── AGENTS.md                      # Panduan runtime yang dihasilkan
└── <workspace-name>.code-workspace # File workspace editor yang dihasilkan
```

Status OpenSpec lokal-repositori mempertahankan bentuk yang ada:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Perbedaan ini penting. Folder workspace adalah permukaan koordinasi lokal untuk membuka dan memeriksa repositori atau folder yang ditautkan. Setiap direktori `openspec/` milik repositori tetap menjadi rumah untuk spesifikasi milik repositori, perubahan lokal-repositori, dan perencanaan implementasi. Pengguna tidak perlu menjalankan `openspec init` lokal-repositori di dalam folder workspace.

Nama tautan yang stabil adalah cara workspace merujuk pada repositori dan folder. Catatan workspace privat menyimpan nama-nama seperti `api`, `web`, atau `checkout` dan memetakannya ke jalur lokal runtime ini.

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

Ketika workspace membuka sebuah inisiatif, `context` merekam binding context-store yang dipilih dan id inisiatif. Store yang dipilih dari registry tetap portabel berdasarkan id; store yang dipilih berdasarkan jalur sengaja mempertahankan jalur runtime-lokal karena `workspace.yaml` adalah status lokal privat.

```yaml
context:
  kind: initiative
  store:
    id: platform
    selector:
      kind: registry
      id: platform
  initiative:
    id: billing-launch
```

Jalur yang ditautkan bisa berupa repositori lengkap, folder di dalam monorepo besar, atau folder yang sudah ada. Mereka tidak memerlukan status `openspec/` lokal-repositori sebelum dapat berpartisipasi dalam perencanaan workspace. Alur kerja implementasi, verifikasi, atau pengarsipan selanjutnya mungkin memerlukan kesiapan repositori yang lebih besar, tetapi visibilitas perencanaan dimulai dari tautan.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Workspace yang dikelola berada di bawah direktori data OpenSpec standar:

```text
getGlobalDataDir()/workspaces
```

Artinya `$XDG_DATA_HOME/openspec/workspaces` ketika `XDG_DATA_HOME` diatur, `~/.local/share/openspec/workspaces` pada fallback bergaya Unix, dan `%LOCALAPPDATA%\openspec\workspaces` pada fallback Windows asli. Shell Windows asli, PowerShell, dan WSL2 masing-masing menyimpan string jalur untuk runtime yang menjalankan OpenSpec. Fondasi ini tidak menerjemahkan antara `D:\repo`, `/mnt/d/repo`, dan jalur UNC WSL.

OpenSpec masih dapat membaca akar workspace beta yang lebih lama sebagai input kompatibilitas, tetapi workspace yang dikelola sekarang menggunakan catatan akar `workspace.yaml` di atas. Folder workspace tetap menjadi otoritas untuk tampilan lokal privatnya sendiri.

Visibilitas bukan berarti komitmen terhadap perubahan. Atur workspace ketika OpenSpec perlu mengetahui repositori atau folder mana yang relevan; buat perubahan nanti ketika Anda siap untuk merencanakan fitur, perbaikan, proyek, atau bagian pekerjaan lainnya.

Perintah yang berguna:

```bash
# Pengaturan terpandu
openspec workspace setup

# Pengaturan ramah otomatisasi
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# Lihat workspace yang dikenal dari registry lokal
openspec workspace list
openspec workspace ls

# Tambah atau perbaiki tautan untuk workspace yang dipilih
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Periksa apa yang dapat diselesaikan oleh mesin ini
openspec workspace doctor
openspec workspace doctor --workspace platform

# Perbarui panduan lokal-workspace dan keterampilan agen
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Buka kumpulan kerja yang ditautkan
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Buka inisiatif sebagai tampilan workspace lokal
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` selalu membuat workspace di lokasi workspace standar, mencatatnya di registry lokal, menampilkan lokasi workspace, dan memerlukan setidaknya satu repositori atau folder yang ditautkan. Pengaturan interaktif menanyakan pembuka yang disukai dan dapat menginstal keterampilan OpenSpec untuk agen yang dipilih. Pengaturan non-interaktif hanya menyimpan satu ketika `--opener codex-cli`, `--opener claude`, `--opener github-copilot`, atau `--opener editor` diberikan.

Keterampilan workspace hanya diinstal di akar workspace. Profil global aktif memilih keterampilan alur kerja mana yang dihasilkan; `--tools` memilih agen mana yang menerimanya. Pengaturan dan pembaruan workspace tidak membuat file perintah slash bahkan ketika pengiriman global mencakup perintah. Jalankan `openspec workspace update` untuk memperbarui panduan lokal-workspace dan menambah, memperbarui, atau menghapus direktori keterampilan lokal-workspace yang dikelola tanpa mengedit repositori atau folder yang ditautkan.

OpenSpec juga memelihara file pembukaan workspace akar: blok panduan yang dikelola OpenSpec di `AGENTS.md` dan file `<workspace-name>.code-workspace` lokal-mesin untuk pembuka VS Code dan GitHub Copilot-in-VS-Code. Workspace yang dikelola bukanlah repositori, jadi OpenSpec tidak membuat `.gitignore` workspace default atau direktori `changes/` tingkat workspace default.

Workspace VS Code yang dipelihara mencantumkan repositori atau folder yang ditautkan secara valid terlebih dahulu, kemudian konteks inisiatif ketika dilampirkan, kemudian file workspace OpenSpec. VS Code menampilkan entri-entri tersebut sebagai workspace multi-root.

`workspace open` membuka kumpulan kerja yang ditautkan dengan pembuka yang disukai kecuali `--agent <tool>` atau `--editor` diberikan untuk sesi tersebut. Memberikan kedua override pembuka adalah kesalahan. Pembukaan workspace akar membuat repositori dan folder yang ditautkan terlihat untuk eksplorasi dan konteks; implementasi dimulai setelah pengguna secara eksplisit meminta pekerjaan implementasi.

`workspace link` dan `workspace relink` hanya mencatat folder yang sudah ada; mereka tidak membuat, menyalin, memindahkan, menginisialisasi, atau mengedit repositori atau folder yang ditautkan. Setelah tautan atau penautan ulang berhasil, OpenSpec menyegarkan panduan yang dikelola dan file workspace VS Code.

Perintah workspace yang memerlukan satu workspace dapat dijalankan dari mana saja dengan `--workspace <name>`. Jika Anda menjalankannya di dalam folder workspace atau subdirektori, OpenSpec menggunakan workspace saat itu. Jika beberapa workspace yang dikenal tersedia dan Anda tidak memberikan `--workspace <name>`, perintah interaktif menampilkan pemilih; `--json` dan `--no-interactive` gagal dengan error status terstruktur sebagai pengganti permintaan input.

Perintah workspace langsung mendukung output JSON untuk skrip. Respons JSON menyimpan data utama dalam objek `workspace`, `workspaces`, atau `link` dan melaporkan peringatan atau error dalam array `status`. Objek yang sehat menggunakan `status: []`.

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

- **Berdasarkan area fitur**: `auth/`, `payments/`, `search/`
- **Berdasarkan komponen**: `api/`, `frontend/`, `workers/`
- **Berdasarkan konteks terbatas**: `ordering/`, `fulfillment/`, `inventory/`

### Format Spesifikasi

Spesifikasi berisi persyaratan, dan setiap persyaratan memiliki skenario:

```markdown
# Spesifikasi Autentikasi

## Tujuan
Autentikasi dan manajemen sesi untuk aplikasi.

## Persyaratan

### Requirement: Autentikasi Pengguna
Sistem SHALL mengeluarkan token JWT setelah login berhasil.

#### Scenario: Kredensial valid
- GIVEN pengguna dengan kredensial valid
- WHEN pengguna mengirimkan formulir login
- THEN token JWT dikembalikan
- DAN pengguna dialihkan ke dashboard

#### Scenario: Kredensial tidak valid
- GIVEN kredensial tidak valid
- WHEN pengguna mengirimkan formulir login
- THEN pesan error ditampilkan
- DAN tidak ada token yang dikeluarkan

### Requirement: Kedaluwarsa Sesi
Sistem MUST mengakhiri sesi setelah 30 menit tidak aktif.

#### Scenario: Batas waktu idle
- GIVEN sesi yang terautentikasi
- WHEN 30 menit berlalu tanpa aktivitas
- THEN sesi dibatalkan
- DAN pengguna harus melakukan autentikasi ulang
```

**Elemen kunci:**

| Elemen | Tujuan |
|--------|--------|
| `## Purpose` | Deskripsi tingkat tinggi dari domain spesifikasi ini |
| `### Requirement:` | Perilaku spesifik yang harus dimiliki sistem |
| `#### Scenario:` | Contoh konkret dari persyaratan dalam aksi |
| SHALL/MUST/SHOULD | Kata kunci RFC 2119 yang menunjukkan kekuatan persyaratan |

### Mengapa Spesifikasi Dibuat Dengan Cara Ini

**Persyaratan adalah "apa"** — mereka menyatakan apa yang harus dilakukan sistem tanpa menentukan implementasi.

**Skenario adalah "kapan"** — mereka menyediakan contoh konkret yang dapat diverifikasi. Skenario yang baik:
- Dapat diuji (Anda dapat menulis pengujian otomatis untuk mereka)
- Mencakup jalur utama dan kasus tepi
- Menggunakan Given/When/Then atau format terstruktur serupa

**Kata kunci RFC 2119** (SHALL, MUST, SHOULD, MAY) mengkomunikasikan maksud:
- **MUST/SHALL** — persyaratan mutlak
- **SHOULD** — direkomendasikan, tetapi ada pengecualian
- **MAY** — opsional

### Apa Itu Spesifikasi (dan Bukan)

Spesifikasi adalah **kontrak perilaku**, bukan rencana implementasi.

Konten spesifikasi yang baik:
- Perilaku yang dapat diamati yang bergantung pada pengguna atau sistem hilir
- Input, output, dan kondisi error
- Keamanan, privasi, keandalan, dan kompatibilitas eksternal
- Skenario yang dapat diuji atau divalidasi secara eksplisit

Hindari dalam spesifikasi:
- Nama kelas/fungsi internal
- Pilihan pustaka atau kerangka kerja
- Detail langkah-langkah implementasi
- Rencana eksekusi terperinci (milik `design.md` atau `tasks.md`)

Ujian cepat:
- Jika implementasi dapat berubah tanpa mengubah perilaku yang terlihat secara eksternal, kemungkinan besar tidak termasuk dalam spesifikasi.

### Tetap Ringan: Ketelitian Progresif

OpenSpec bertujuan untuk menghindari birokrasi. Gunakan tingkat paling ringan yang masih membuat perubahan dapat diverifikasi.

**Spesifikasi ringan (default):**
- Persyaratan singkat berfokus pada perilaku
- Cakupan dan tujuan non yang jelas
- Beberapa pemeriksaan penerimaan konkret

**Spesifikasi lengkap (untuk risiko lebih tinggi):**
- Perubahan lintas tim atau lintas repositori
- Perubahan API/kontrak, migrasi, masalah keamanan/privasi
- Perubahan di mana ambiguitas kemungkinan besar menyebabkan pengerjaan ulang yang mahal

Sebagian besar perubahan harus tetap dalam mode ringan.

### Kolaborasi Manusia + Agen

Di banyak tim, manusia menjelajahi dan agen menyusun artefak. Loop yang dimaksud adalah:

1. Manusia memberikan maksud, konteks, dan batasan.
2. Agen mengubah ini menjadi persyaratan dan skenario yang berfokus pada perilaku.
3. Agen menyimpan detail implementasi di `design.md` dan `tasks.md`, bukan di `spec.md`.
4. Validasi mengonfirmasi struktur dan kejelasan sebelum implementasi.

Ini menjaga spesifikasi tetap mudah dibaca oleh manusia dan konsisten untuk agen.

## Perubahan

Sebuah perubahan adalah modifikasi yang diusulkan untuk sistem Anda, dikemas dalam bentuk folder yang berisi semua yang diperlukan untuk memahami dan mengimplementasikannya.

### Struktur Perubahan

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional)
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

Setiap perubahan bersifat mandiri. Perubahan memiliki:
- **Artefak** — dokumen yang memuat intent, desain, dan tugas
- **Delta spec** — spesifikasi untuk apa yang ditambahkan, diubah, atau dihapus
- **Metadata** — konfigurasi opsional untuk perubahan spesifik ini

### Mengapa Perubahan Berupa Folder

Mengemas perubahan sebagai folder memiliki beberapa keuntungan:

1. **Semuanya dalam satu tempat.** Proposal, desain, tugas, dan spec berada di satu lokasi. Tidak perlu mencari di berbagai tempat berbeda.

2. **Kerja paralel.** Beberapa perubahan dapat ada secara bersamaan tanpa konflik. Anda dapat mengerjakan `add-dark-mode` sementara `fix-auth-bug` juga sedang dalam proses.

3. **Riwayat yang bersih.** Saat diarsipkan, perubahan dipindahkan ke `changes/archive/` dengan konteks lengkapnya tetap terjaga. Anda dapat melihat kembali dan memahami bukan hanya apa yang berubah, tetapi juga mengapa.

4. **Mudah untuk ditinjau.** Folder perubahan mudah untuk ditinjau — buka, baca proposalnya, periksa desainnya, lihat delta spec-nya.

## Artefak

Artefak adalah dokumen-dokumen di dalam sebuah perubahan yang memandu pekerjaan.

### Alur Artefak

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artefak dibangun satu sama lain. Setiap artefak menyediakan konteks untuk artefak berikutnya.

### Jenis Artefak

#### Proposal (`proposal.md`)

Proposal memuat **intent**, **cakupan**, dan **pendekatan** secara tingkat tinggi.

```markdown
# Proposal: Add Dark Mode
```

## Niat
Pengguna telah meminta opsi mode gelap untuk mengurangi ketegangan mata selama penggunaan malam hari dan menyelaraskan dengan preferensi sistem.

## Ruang Lingkup
Yang termasuk dalam lingkup:
- Pengalih tema di pengaturan
- Deteksi preferensi sistem
- Menyimpan preferensi di localStorage

Yang tidak termasuk dalam lingkup:
- Tema warna kustom (pekerjaan mendatang)
- Penimpaan tema per halaman

## Pendekatan
Gunakan properti kustom CSS untuk tema dengan React context untuk manajemen state. Deteksi preferensi sistem saat pemuatan pertama, izinkan penggantian manual.
```

**Kapan harus memperbarui proposal:**
- Perubahan ruang lingkup (penyempitan atau perluasan)
- Niat menjadi lebih jelas (pemahaman masalah yang lebih baik)
- Pendekatan berubah secara fundamental

#### Spesifikasi (spesifikasi delta di `specs/`)

Spesifikasi delta menjelaskan **apa yang berubah** relatif terhadap spesifikasi saat ini. Lihat [Spesifikasi Delta](#spesifikasi-delta) di bawah.

#### Desain (`design.md`)

Desain menangkap **pendekatan teknis** dan **keputusan arsitektur**.

````markdown
# Desain: Menambahkan Mode Gelap

## Pendekatan Teknis
State tema dikelola melalui React Context untuk menghindari prop drilling.
Properti kustom CSS memungkinkan pengalihan waktu proses tanpa penggantian class.

## Keputusan Arsitektur

### Keputusan: Context daripada Redux
Menggunakan React Context untuk state tema karena:
- State biner sederhana (terang/gelap)
- Tidak ada transisi state yang kompleks
- Menghindari penambahan dependensi Redux

### Keputusan: Properti Kustom CSS
Menggunakan variabel CSS alih-alih CSS-in-JS karena:
- Bekerja dengan stylesheet yang sudah ada
- Tidak ada overhead waktu proses
- Solusi bawaan peramban

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

## Perubahan Berkas
- `src/contexts/ThemeContext.tsx` (baru)
- `src/components/ThemeToggle.tsx` (baru)
- `src/styles/globals.css` (dimodifikasi)
````

**Kapan harus memperbarui desain:**
- Implementasi menunjukkan pendekatan tidak akan berhasil
- Solusi yang lebih baik ditemukan
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
- Kelompokkan tugas yang terkait di bawah judul
- Gunakan penomoran hierarkis (1.1, 1.2, dll.)
- Buat tugas cukup kecil untuk diselesaikan dalam satu sesi
- Centang tugas saat Anda menyelesaikannya

## Spesifikasi Delta

Spesifikasi delta adalah konsep kunci yang membuat OpenSpec berfungsi untuk pengembangan brownfield. Mereka menjelaskan **apa yang berubah** alih-alih mengulang seluruh spesifikasi.

### Formatnya

```markdown
# Delta untuk Autentikasi

## Persyaratan DITAMBAHKAN

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
- DAN login hanya selesai setelah OTP valid

## Persyaratan DIMODIFIKASI

### Persyaratan: Kedaluwarsa Sesi
Sistem HARUS membuat sesi kedaluwarsa setelah 15 menit tidak aktif.
(Sebelumnya: 30 menit)

#### Skenario: Batas waktu menganggur
- Diberikan sesi yang diautentikasi
- KETIKA 15 menit berlalu tanpa aktivitas
- MAKA sesi dibatalkan

## Persyaratan DIHAPUS

### Persyaratan: Ingat Saya
(Dihapus mendukung 2FA. Pengguna harus mengautentikasi ulang setiap sesi.)
```

### Bagian Delta

| Bagian | Arti | Apa yang Terjadi saat Pengarsipan |
|---------|---------|------------------------|
| `## Persyaratan DITAMBAHKAN` | Perilaku baru | Ditambahkan ke spesifikasi utama |
| `## Persyaratan DIMODIFIKASI` | Perilaku berubah | Menggantikan persyaratan yang ada |
| `## Persyaratan DIHAPUS` | Perilaku usang | Dihapus dari spesifikasi utama |

### Mengapa Delta Alih-alih Spesifikasi Lengkap

**Kejelasan.** Delta menunjukkan dengan tepat apa yang berubah. Membaca spesifikasi lengkap, Anda harus membandingkannya secara mental dengan versi saat ini.

**Penghindaran konflik.** Dua perubahan dapat menyentuh berkas spesifikasi yang sama tanpa konflik, selama mereka memodifikasi persyaratan yang berbeda.

**Efisiensi tinjauan. *Reviewer* melihat perubahan, bukan konteks yang tidak berubah. Fokus pada apa yang penting.

**Kesesuaian brownfield.** Sebagian besar pekerjaan memodifikasi perilaku yang ada. Delta membuat modifikasi menjadi prioritas utama, bukan tambahan belakangan.

## Skema

Skema mendefinisikan jenis artefak dan dependensinya untuk alur kerja.

### Bagaimana Skema Bekerja

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Tidak ada dependensi, bisa dibuat duluan

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Butuh proposal sebelum membuat

  - id: design
    generates: design.md
    requires: [proposal]      # Bisa dibuat paralel dengan specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Butuh kedua specs dan design duluan
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
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**Dependensi adalah pemungkinkan, bukan gerbang.** Mereka menunjukkan apa yang mungkin dibuat, bukan apa yang harus Anda buat selanjutnya. Anda bisa melewatkan desain jika tidak membutuhkannya. Anda bisa membuat spesifikasi sebelum atau sesudah desain — keduanya hanya bergantung pada proposal.

### Skema Bawaan

**spec-driven** (default)

Alur kerja standar untuk pengembangan berbasis spesifikasi:

```
proposal → specs → design → tasks → implement
```

Terbaik untuk: Sebagian besar pekerjaan fitur di mana Anda ingin menyetujui spesifikasi sebelum implementasi.

### Skema Kustom

Buat skema kustom untuk alur kerja tim Anda:

```bash
# Buat dari awal
openspec schema init research-first

# Atau fork yang sudah ada
openspec schema fork spec-driven research-first
```

**Contoh skema kustom:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Lakukan riset duluan

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal didasari riset

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Lewati specs/design, langsung ke tasks
```

Lihat [Kustomisasi](customization.md) untuk detail lengkap tentang membuat dan menggunakan skema kustom.

## Pengarsipan

Pengarsipan menyelesaikan perubahan dengan menggabungkan spesifikasi delta ke dalam spesifikasi utama dan melestarikan perubahan untuk sejarah.

### Apa yang Terjadi Saat Anda Mengarsipkan

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
│       └── spec.md        # Sekarang termasuk persyaratan 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Dilestarikan untuk sejarah
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Proses Pengarsipan

1. **Gabung delta.** Setiap bagian spesifikasi delta (DITAMBAHKAN/DIMODIFIKASI/DIHAPUS) diterapkan ke spesifikasi utama yang sesuai.

2. **Pindahkan ke arsip.** Folder perubahan dipindahkan ke `changes/archive/` dengan awalan tanggal untuk pengurutan kronologis.

3. **Pertahankan konteks.** Semua artefak tetap utuh dalam arsip. Anda selalu bisa melihat ke belakang untuk memahami mengapa perubahan dilakukan.

### Mengapa Pengarsipan Penting

**State bersih.** Perubahan aktif (`changes/`) hanya menampilkan pekerjaan yang sedang berlangsung. Pekerjaan yang selesai dipindahkan dari jalan.

**Jejak audit.** Arsip melestarikan konteks lengkap setiap perubahan — bukan hanya apa yang berubah, tetapi proposal yang menjelaskan mengapa, desain yang menjelaskan bagaimana, dan tugas yang menunjukkan pekerjaan yang dilakukan.

**Evolusi spesifikasi.** Spesifikasi tumbuh secara organik saat perubahan diarsipkan. Setiap arsip menggabungkan delta, membangun spesifikasi yang komprehensif dari waktu ke waktu.

## Bagaimana Semuanya Cocok Bersama

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
│   │  2. BUAT       │  /opsx:ff atau /opsx:continue (alur kerja diperluas)     │
│   │     ARTEFAK    │  Membuat proposal → specs → design → tasks              │
│   │                │  (berdasarkan dependensi skema)                          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTASI│  /opsx:apply                                           │
│   │     TUGAS      │  Kerjakan tugas, centang saat selesai                  │
│   │                │◄──── Perbarui artefak saat Anda belajar                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFIKASI │  /opsx:verify (opsional)                                │
│   │     PEKERJAAN  │  Periksa implementasi sesuai spesifikasi               │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARSIPKAN   │────►│  Spesifikasi delta digabung ke spesifikasi  │    │
│   │     PERUBAHAN  │     │  utama                                      │    │
│   └────────────────┘     │  Folder perubahan dipindah ke arsip/        │    │
│                          │  Spesifikasi sekarang adalah sumber kebenaran│    │
│                          │  yang diperbarui                            │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Siklus yang baik:**

1. Spesifikasi menjelaskan perilaku saat ini
2. Perubahan mengusulkan modifikasi (sebagai delta)
3. Implementasi membuat perubahan menjadi nyata
4. Pengarsipan menggabungkan delta ke spesifikasi
5. Spesifikasi sekarang menjelaskan perilaku baru
6. Perubahan berikutnya dibangun di atas spesifikasi yang diperbarui

## Glosarium

| Istilah | Definisi |
|------|------------|
| **Artifact** | Sebuah dokumen dalam suatu perubahan (proposal, desain, tugas, atau spesifikasi delta) |
| **Archive** | Proses menyelesaikan sebuah perubahan dan menggabungkan delta-deltanya ke dalam spesifikasi utama |
| **Change** | Sebuah modifikasi yang diusulkan terhadap sistem, dikemas sebagai folder berisi artefak-artefak |
| **Delta spec** | Sebuah spesifikasi yang menggambarkan perubahan (DITAMBAHKAN/DIUBAH/DIHAPUS) relatif terhadap spesifikasi saat ini |
| **Domain** | Sebuah pengelompokan logis untuk spesifikasi (misalnya, `auth/`, `payments/`) |
| **Requirement** | Sebuah perilaku spesifik yang harus dimiliki oleh sistem |
| **Scenario** | Sebuah contoh konkret dari suatu persyaratan, biasanya dalam format Given/When/Then |
| **Schema** | Sebuah definisi dari tipe-tipe artefak dan dependensinya |
| **Spec** | Sebuah spesifikasi yang menggambarkan perilaku sistem, berisi persyaratan dan skenario |
| **Source of truth** | Direktori `openspec/specs/`, berisi perilaku yang disepakati saat ini |

## Langkah Selanjutnya

- [Memulai](getting-started.md) - Langkah-langkah praktis pertama
- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakannya
- [Perintah](commands.md) - Referensi perintah lengkap
- [Kustomisasi](customization.md) - Buat skema kustom dan konfigurasi proyek Anda