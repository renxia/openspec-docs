# Perintah

Ini adalah referensi untuk perintah slash OpenSpec. Perintah ini dipanggil di antarmuka chat asisten pemrograman AI Anda (misalnya, Claude Code, Cursor, Windsurf).

Untuk pola kerja dan kapan menggunakan setiap perintah, lihat [Alur Kerja](workflows.md). Untuk perintah CLI, lihat [CLI](cli.md).

## Referensi Cepat

### Jalur Cepat Default (profil `core`)

| Perintah | Tujuan |
|---------|---------|
| `/opsx:propose` | Membuat perubahan dan menghasilkan artefak perencanaan dalam satu langkah |
| `/opsx:explore` | Merenungkan ide sebelum berkomitmen pada perubahan |
| `/opsx:apply` | Menerapkan tugas dari perubahan |
| `/opsx:archive` | Mengarsipkan perubahan yang selesai |

### Perintah Alur Kerja yang Diperluas (pilihan alur kerja kustom)

| Perintah | Tujuan |
|---------|---------|
| `/opsx:new` | Memulai kerangka perubahan baru |
| `/opsx:continue` | Membuat artefak berikutnya berdasarkan dependensi |
| `/opsx:ff` | Maju cepat: membuat semua artefak perencanaan sekaligus |
| `/opsx:verify` | Memvalidasi implementasi sesuai dengan artefak |
| `/opsx:sync` | Menggabungkan spesifikasi delta ke dalam spesifikasi utama |
| `/opsx:bulk-archive` | Mengarsipkan beberapa perubahan sekaligus |
| `/opsx:onboard` | Tutorial terpandu melalui alur kerja lengkap |

Profil global default adalah `core`. Untuk mengaktifkan perintah alur kerja yang diperluas, jalankan `openspec config profile`, pilih alur kerja, lalu jalankan `openspec update` di proyek Anda.

---

## Referensi Perintah

### `/opsx:propose`

Buat perubahan baru dan hasilkan artefak perencanaan dalam satu langkah. Ini adalah perintah awal default dalam profil `core`.

**Sintaks:**
```text
/opsx:propose [nama-atau-deskripsi-perubahan]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `nama-atau-deskripsi-perubahan` | Tidak | Nama kebab-case atau deskripsi perubahan dalam bahasa biasa |

**Yang dilakukannya:**
- Membuat `openspec/changes/<nama-perubahan>/`
- Menghasilkan artefak yang diperlukan sebelum implementasi (untuk `spec-driven`: proposal, spesifikasi, desain, tugas)
- Berhenti ketika perubahan siap untuk `/opsx:apply`

**Contoh:**
```text
Anda: /opsx:propose add-dark-mode

AI:  Membuat openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Siap untuk implementasi. Jalankan /opsx:apply.
```

**Tips:**
- Gunakan ini untuk jalur ujung-ke-ujung tercepat
- Jika Anda ingin kontrol artefak langkah-demi-langkah, aktifkan alur kerja yang diperluas dan gunakan `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Pikirkan ide, investigasi masalah, dan klarifikasi persyarapan sebelum berkomitmen pada perubahan.

**Sintaks:**
```
/opsx:explore [topik]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `topik` | Tidak | Apa yang ingin Anda eksplorasi atau investigasi |

**Yang dilakukannya:**
- Membuka percakapan eksploratif tanpa struktur yang diperlukan
- Menginvestigasi basis kode untuk menjawab pertanyaan
- Membandingkan opsi dan pendekatan
- Membuat diagram visual untuk memperjelas pemikiran
- Dapat beralih ke `/opsx:propose` (default) atau `/opsx:new` (alur kerja yang diperluas) ketika wawasan terkristalisasi

**Contoh:**
```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda eksplorasi?

Anda: Bagaimana kita harus menangani autentikasi untuk aplikasi seluler?

AI:  Biarkan saya investigasi pengaturan autentikasi Anda saat ini...
     [Menganalisis basis kode]

     Saya lihat Anda menggunakan autentikasi berbasis sesi untuk aplikasi web.
     Untuk seluler, kita memiliki tiga opsi utama:

     1. Token JWT (tanpa status, berfungsi offline)
     2. OAuth2 (jika Anda memerlukan login pihak ketiga)
     3. Memperluas sesi saat ini (lebih sederhana, tetapi memerlukan konektivitas)

     API Anda sudah memiliki CORS yang dikonfigurasi. Arah mana yang menarik bagi Anda?

Anda: Mari gunakan JWT. Bisakah kita memulai perubahan untuk itu?

AI:  Siap ketika Anda siap. Jalankan /opsx:propose add-jwt-auth untuk memulai.
```

**Tips:**
- Gunakan ketika persyarapan tidak jelas atau Anda perlu menginvestigasi
- Tidak ada artefak yang dibuat selama eksplorasi
- Bagus untuk membandingkan beberapa pendekatan sebelum memutuskan
- Dapat membaca file dan mencari basis kode

---

### `/opsx:new`

Mulai kerangka perubahan baru. Membuat folder perubahan dan menunggu Anda menghasilkan artefak dengan `/opsx:continue` atau `/opsx:ff`.

Perintah ini merupakan bagian dari set alur kerja yang diperluas (tidak termasuk dalam profil `core` default).

**Sintaks:**
```
/opsx:new [nama-perubahan] [--schema <nama-skema>]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `nama-perubahan` | Tidak | Nama untuk folder perubahan (diminta jika tidak disediakan) |
| `--schema` | Tidak | Skema alur kerja yang akan digunakan (default: dari config atau `spec-driven`) |

**Yang dilakukannya:**
- Membuat direktori `openspec/changes/<nama-perubahan>/`
- Membuat file metadata `.openspec.yaml` di folder perubahan
- Menampilkan template artefak pertama yang siap dibuat
- Meminta nama perubahan dan skema jika tidak disediakan

**Yang dibuatnya:**
```
openspec/changes/<nama-perubahan>/
└── .openspec.yaml    # Metadata perubahan (skema, tanggal dibuat)
```

**Contoh:**
```
Anda: /opsx:new add-dark-mode

AI:  Membuat openspec/changes/add-dark-mode/
     Skema: spec-driven

     Siap membuat: proposal
     Gunakan /opsx:continue untuk membuatnya, atau /opsx:ff untuk membuat semua artefak.
```

**Tips:**
- Gunakan nama deskriptif: `add-feature`, `fix-bug`, `refactor-module`
- Hindari nama generik seperti `update`, `changes`, `wip`
- Skema juga dapat diatur dalam config proyek (`openspec/config.yaml`)

---

### `/opsx:continue`

Buat artefak berikutnya dalam rantai dependensi. Membuat satu artefak pada satu waktu untuk kemajuan bertahap.

**Sintaks:**
```
/opsx:continue [nama-perubahan]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `nama-perubahan` | Tidak | Perubahan mana yang akan dilanjutkan (disimpulkan dari konteks jika tidak disediakan) |

**Yang dilakukannya:**
- Meminta grafik dependensi artefak
- Menampilkan artefak mana yang siap vs terblokir
- Membuat artefak siap pertama
- Membaca file dependensi untuk konteks
- Menampilkan apa yang tersedia setelah pembuatan

**Contoh:**
```
Anda: /opsx:continue

AI:  Perubahan: add-dark-mode

     Status artefak:
     ✓ proposal    (selesai)
     ◆ specs       (siap)
     ◆ design      (siap)
     ○ tasks       (terblokir - membutuhkan: specs)

     Membuat specs...

     [Membaca proposal.md, membuat specs berdasarkan persyarapan]

     ✓ Membuat openspec/changes/add-dark-mode/specs/ui/spec.md

     Sekarang tersedia: tasks
     Jalankan /opsx:continue untuk membuat artefak berikutnya.
```

**Tips:**
- Gunakan ketika Anda ingin meninjau setiap artefak sebelum melanjutkan
- Bagus untuk perubahan kompleks di mana Anda ingin kontrol
- Beberapa artefak mungkin menjadi siap secara bersamaan
- Anda dapat mengedit artefak yang dibuat sebelum melanjutkan

---

### `/opsx:ff`

Maju cepat melalui pembuatan artefak. Membuat semua artefak perencanaan sekaligus.

**Sintaks:**
```
/opsx:ff [nama-perubahan]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `nama-perubahan` | Tidak | Perubahan mana yang akan dimajukan cepat (disimpulkan dari konteks jika tidak disediakan) |

**Yang dilakukannya:**
- Membuat semua artefak dalam urutan dependensi
- Melacak kemajuan melalui daftar todo
- Berhenti ketika semua artefak `apply-required` selesai
- Membaca setiap dependensi sebelum membuat artefak berikutnya

**Contoh:**
```
Anda: /opsx:ff add-dark-mode

AI:  Memajukan cepat add-dark-mode...

     ✓ Membuat proposal.md
     ✓ Membuat specs/ui/spec.md
     ✓ Membuat design.md
     ✓ Membuat tasks.md

     Semua artefak perencanaan selesai!
     Siap untuk implementasi. Jalankan /opsx:apply untuk memulai.
```

**Tips:**
- Gunakan ketika Anda memiliki gambaran jelas tentang apa yang akan dibangun
- Lebih cepat dari `/opsx:continue` untuk perubahan sederhana
- Anda masih dapat mengedit artefak setelahnya
- Bagus untuk fitur kecil hingga menengah

---

### `/opsx:apply`

Implementasikan tugas dari perubahan. Bekerja melalui daftar tugas, menulis kode dan mencentang item.

**Sintaks:**
```
/opsx:apply [nama-perubahan]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `nama-perubahan` | Tidak | Perubahan mana yang akan diimplementasikan (disimpulkan dari konteks jika tidak disediakan) |

**Yang dilakukannya:**
- Membaca `tasks.md` dan mengidentifikasi tugas yang belum selesai
- Bekerja melalui tugas satu per satu
- Menulis kode, membuat file, menjalankan tes sesuai kebutuhan
- Menandai tugas selesai dengan kotak centang `[x]`

**Contoh:**
```
Anda: /opsx:apply

AI:  Mengimplementasikan add-dark-mode...

     Membaca tasks.md:
     - [ ] 1.1 Buat ThemeContext
     - [ ] 1.2 Tambahkan properti kustom CSS
     - [ ] 1.3 Implementasikan persistensi localStorage

     Mengerjakan 1.1: Buat ThemeContext...
     [Membuat src/context/ThemeContext.tsx]

     ✓ 1.1 Selesai

     Mengerjakan 1.2: Tambahkan properti kustom CSS...
     [Memperbarui src/styles/globals.css]

     ✓ 1.2 Selesai
     ...
```

**Tips:**
- Dapat melanjutkan dari tempat Anda berhenti jika terganggu
- Gunakan untuk perubahan paralel dengan menentukan nama perubahan
- Status penyelesaan dilacak di kotak centang `tasks.md`

---

### `/opsx:verify`

Validasi bahwa implementasi sesuai dengan artefak perubahan Anda. Memeriksa kelengkapan, kebenaran, dan koherensi.

**Sintaks:**
```
/opsx:verify [nama-perubahan]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `nama-perubahan` | Tidak | Perubahan mana yang akan diverifikasi (disimpulkan dari konteks jika tidak disediakan) |

**Yang dilakukannya:**
- Memeriksa tiga dimensi kualitas implementasi
- Mencari bukti implementasi di basis kode
- Melaporkan masalah yang dikategorikan sebagai KRITIS, PERINGATAN, atau SARANAN
- Tidak memblokir arsip, tetapi menampilkan masalah

**Dimensi verifikasi:**

| Dimensi | Apa yang divalidasi |
|-----------|-------------------|
| **Kelengkapan** | Semua tugas selesai, semua persyarapan diimplementasikan, skenario tercakup |
| **Kebenaran** | Implementasi sesuai dengan tujuan spesifikasi, kasus tepi ditangani |
| **Koherensi** | Keputusan desain tercermin dalam kode, pola konsisten |

**Contoh:**
```
Anda: /opsx:verify

AI:  Memverifikasi add-dark-mode...

     KELENGKAPAN
     ✓ Semua 8 tugas di tasks.md sudah dicentang
     ✓ Semua persyarapan di specs memiliki kode yang sesuai
     ⚠ Skenario "Deteksi preferensi sistem" tidak memiliki cakupan tes

     KEBENARAN
     ✓ Implementasi sesuai dengan tujuan spesifikasi
     ✓ Kasus tepi dari skenario sudah ditangani
     ✓ Status kesalahan sesuai dengan definisi spesifikasi

     KOHERENSI
     ✓ Keputusan desain tercermin dalam struktur kode
     ✓ Konvensi penamaan konsisten dengan design.md
     ⚠ Desain menyebutkan "variabel CSS" tetapi implementasi menggunakan kelas Tailwind

     RINGKASAN
     ─────────────────────────────
     Masalah kritis: 0
     Peringatan: 2
     Siap untuk diarsipkan: Ya (dengan peringatan)

     Rekomendasi:
     1. Tambahkan tes untuk deteksi preferensi sistem
     2. Perbarui design.md untuk mencerminkan penggunaan Tailwind, atau refactor untuk menggunakan variabel CSS
```

**Tips:**
- Jalankan sebelum mengarsipkan untuk menangkap ketidaksesuaian lebih awal
- Peringatan tidak memblokir arsip tetapi menunjukkan masalah potensial
- Bagus untuk meninjau pekerjaan AI sebelum berkomitmen
- Dapat mengungkapkan drift antara artefak dan implementasi

---

### `/opsx:sync`

**Perintah opsional.** Gabungkan spesifikasi delta dari perubahan ke spesifikasi utama. Arsip akan meminta untuk menyinkronkan jika diperlukan, sehingga biasanya Anda tidak perlu menjalankan ini secara manual.

**Sintaks:**
```
/opsx:sync [nama-perubahan]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `nama-perubahan` | Tidak | Perubahan mana yang akan disinkronkan (disimpulkan dari konteks jika tidak disediakan) |

**Yang dilakukannya:**
- Membaca spesifikasi delta dari folder perubahan
- Mengurai bagian DITAMBAH/DIUBAH/DIHAPUS/DIUBAH NAMA
- Menggabungkan perubahan ke direktori `openspec/specs/` utama
- Mempertahankan konten yang ada yang tidak disebutkan dalam delta
- Tidak mengarsipkan perubahan (tetap aktif)

**Contoh:**
```text
Anda: /opsx:sync

AI:  Menyinkronkan spesifikasi delta add-dark-mode...

     Membaca: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Perubahan yang akan diterapkan:
     ✓ DITAMBAH: Persyaratan Pemilihan Tema (2 skenario)
     ✓ DITAMBAH: Persyaratan Aksesibilitas (1 skenario)

     Menggabungkan...
     ✓ openspec/specs/ui/spec.md diperbarui

     Perubahan tetap aktif. Jalankan /opsx:archive ketika siap untuk menyelesaikan.
```

**Kapan menggunakan secara manual:**

| Skenario | Gunakan sync? |
|----------|-----------|
| Perubahan berlangsung lama, ingin spesifikasi di utama sebelum mengarsipkan | Ya |
| Beberapa perubahan paralel membutuhkan spesifikasi dasar yang diperbarui | Ya |
| Ingin meninjau/meninjau penggabungan secara terpisah | Ya |
| Perubahan cepat, langsung ke arsip | Tidak (arsip menanganinya) |

**Tips:**
- Sync cerdas, bukan salin-tempel
- Dapat menambahkan skenario ke persyaratan yang ada tanpa menduplikasi
- Perubahan tetap aktif setelah sync (tidak diarsipkan)
- Sebagian besar pengguna tidak akan perlu memanggil ini secara langsung—arsip meminta jika diperlukan

---

### `/opsx:archive`

Arsipkan perubahan yang selesai. Menyelesaikan perubahan dan memindahkannya ke folder arsip.

**Sintaks:**
```
/opsx:archive [nama-perubahan]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `nama-perubahan` | Tidak | Perubahan mana yang akan diarsipkan (disimpulkan dari konteks jika tidak disediakan) |

**Yang dilakukannya:**
- Memeriksa status penyelesaian artefak
- Memeriksa penyelesaian tugas (memperingatkan jika belum selesai)
- Menawarkan untuk menyinkronkan spesifikasi delta jika belum disinkronkan
- Memindahkan folder perubahan ke `openspec/changes/archive/YYYY-MM-DD-<nama>/`
- Mempertahankan semua artefak untuk jejak audit

**Contoh:**
```text
Anda: /opsx:archive

AI:  Mengarsipkan add-dark-mode...

     Status artefak:
     ✓ proposal.md ada
     ✓ specs/ ada
     ✓ design.md ada
     ✓ tasks.md ada (8/8 tugas selesai)

     Spesifikasi delta: Belum disinkronkan
     → Sinkronkan sekarang? (disarankan)

Anda: Ya

AI:  ✓ Spesifikasi disinkronkan ke openspec/specs/ui/spec.md
     ✓ Dipindahkan ke openspec/changes/archive/2025-01-24-add-dark-mode/

     Perubahan berhasil diarsipkan.
```

**Tips:**
- Arsip tidak akan memblokir tugas yang belum selesai, tetapi akan memperingatkan
- Spesifikasi delta dapat disinkronkan selama arsip atau sebelumnya
- Perubahan yang diarsipkan dipertahankan untuk riwayat
- Gunakan `/opsx:verify` terlebih dahulu untuk menangkap masalah

---

### `/opsx:bulk-archive`

Arsipkan beberapa perubahan yang selesai sekaligus. Menangani konflik spesifikasi antar perubahan.

**Sintaks:**
```
/opsx:bulk-archive [nama-perubahan...]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `nama-perubahan` | Tidak | Perubahan spesifik yang akan diarsipkan (meminta untuk memilih jika tidak disediakan) |

**Yang dilakukannya:**
- Mencantumkan semua perubahan yang selesai
- Memvalidasi setiap perubahan sebelum mengarsipkan
- Mendeteksi konflik spesifikasi di seluruh perubahan
- Menyelesaikan konflik dengan memeriksa apa yang sebenarnya diimplementasikan
- Mengarsipkan dalam urutan kronologis

**Contoh:**
```
Anda: /opsx:bulk-archive

AI:  Ditemukan 3 perubahan yang selesai:
     - add-dark-mode (8/8 tugas selesai)
     - fix-login-bug (3/3 tugas selesai)
     - update-footer (2/2 tugas selesai)

     Memeriksa konflik spesifikasi...
     ⚠ add-dark-mode dan update-footer keduanya menyentuh specs/ui/

     Memeriksa basis kode untuk menyelesaikan...
     Kedua perubahan sudah diimplementasikan. Akan digabungkan dalam urutan kronologis:
     1. add-dark-mode (dibuat 20 Jan)
     2. update-footer (dibuat 22 Jan)

     Arsipkan ketiga perubahan?

Anda: Ya

AI:  ✓ Mengarsipkan add-dark-mode
     ✓ Mengarsipkan fix-login-bug
     ✓ Mengarsipkan update-footer
     Spesifikasi digabungkan: add-dark-mode → update-footer
```

**Tips:**
- Bagus untuk alur kerja paralel
- Penyelesaian konflik bersifat agenik (memeriksa basis kode)
- Perubahan diarsipkan berdasarkan urutan pembuatan
- Meminta sebelum menimpa konten spesifikasi

---

### `/opsx:onboard`

Panduan onboarding melalui alur kerja OpenSpec yang lengkap. Tutorial interaktif menggunakan basis kode Anda yang sebenarnya.

**Sintaks:**
```
/opsx:onboard
```

**Yang dilakukannya:**
- Membimbing melalui siklus alur kerja lengkap dengan narasi
- Memindai basis kode Anda untuk peluang peningkatan nyata
- Membuat perubahan nyata dengan artefak nyata
- Mengimplementasikan pekerjaan nyata (perubahan kecil, aman)
- Mengarsipkan perubahan yang selesai
- Menjelaskan setiap langkah saat terjadi

**Fase:**
1. Selamat datang dan analisis basis kode
2. Menemukan peluang peningkatan
3. Membuat perubahan (`/opsx:new`)
4. Menulis proposal
5. Membuat spesifikasi
6. Menulis desain
7. Membuat tugas
8. Mengimplementasikan tugas (`/opsx:apply`)
9. Memverifikasi implementasi
10. Mengarsipkan perubahan
11. Ringkasan dan langkah selanjutnya

**Contoh:**
```
Anda: /opsx:onboard

AI:  Selamat datang di OpenSpec!

     Saya akan membimbing Anda melalui alur kerja lengkap menggunakan basis kode Anda yang sebenarnya.
     Kita akan menemukan sesuatu yang kecil untuk ditingkatkan, membuat perubahan yang tepat untuk itu,
     mengimplementasikannya, dan mengarsipkannya.

     Biarkan saya memindai basis kode Anda untuk peluang...

     [Menganalisis basis kode]

     Saya menemukan beberapa hal yang bisa kita kerjakan:
     1. Tambahkan validasi input ke formulir kontak
     2. Tingkatkan pesan kesalahan dalam alur autentikasi
     3. Tambahkan status pemuatan ke tombol async

     Mana yang menarik bagi Anda? (atau sarankan sesuatu yang lain)
```

**Tips:**
- Terbaik untuk pengguna baru yang mempelajari alur kerja
- Menggunakan kode nyata, bukan contoh mainan
- Membuat perubahan nyata yang dapat Anda pertahankan atau buang
- Membutuhkan waktu 15-30 menit untuk menyelesaikan

---

## Sintaksis Perintah Berdasarkan Alat AI

Berbagai alat AI menggunakan sintaksis perintah yang sedikit berbeda. Gunakan format yang sesuai dengan alat Anda:

| Alat | Contoh Sintaksis |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | Pemanggilan berbasis skill seperti `/openspec-propose`, `/openspec-apply-change` (tanpa file perintah `opsx-*` yang dihasilkan) |

Tujuannya sama di semua alat, tetapi cara perintah ditampilkan dapat berbeda bergantung pada integrasinya.

> **Catatan:** Perintah GitHub Copilot (`.github/prompts/*.prompt.md`) hanya tersedia di ekstensi IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI saat ini tidak mendukung file prompt kustom — lihat [Alat yang Didukung](supported-tools.md) untuk detail dan solusi alternatif.

---

## Perintah Lama

Perintah ini menggunakan alur kerja lama "sekaligus". Perintah ini masih berfungsi, tetapi perintah OPSX direkomendasikan.

| Perintah | Fungsinya |
|---------|--------------|
| `/openspec:proposal` | Membuat semua artefak sekaligus (proposal, spesifikasi, desain, tugas) |
| `/openspec:apply` | Menerapkan perubahan |
| `/openspec:archive` | Mengarsipkan perubahan |

**Kapan menggunakan perintah lama:**
- Proyek yang sudah ada menggunakan alur kerja lama
- Perubahan sederhana di mana Anda tidak memerlukan pembuatan artefak bertahap
- Lebih memilih pendekatan all-or-nothing

**Migrasi ke OPSX:**
Perubahan lama dapat dilanjutkan dengan perintah OPSX. Struktur artefaknya kompatibel.

---

## Pemecahan Masalah

### "Perubahan tidak ditemukan"

Perintah tidak dapat mengidentifikasi perubahan mana yang akan dikerjakan.

**Solusi:**
- Tentukan nama perubahan secara eksplisit: `/opsx:apply add-dark-mode`
- Periksa apakah folder perubahan ada: `openspec list`
- Pastikan Anda berada di direktori proyek yang benar

### "Tidak ada artefak yang siap"

Semua artefak sudah selesai atau diblokir oleh dependensi yang hilang.

**Solusi:**
- Jalankan `openspec status --change <nama>` untuk melihat apa yang memblokir
- Periksa apakah artefak yang diperlukan ada
- Buat artefak dependensi yang hilang terlebih dahulu

### "Skema tidak ditemukan"

Skema yang ditentukan tidak ada.

**Solusi:**
- Daftar skema yang tersedia: `openspec schemas`
- Periksa ejaan nama skema
- Buat skema jika itu kustom: `openspec schema init <nama>`

### Perintah tidak dikenali

Alat AI tidak mengenali perintah OpenSpec.

**Solusi:**
- Pastikan OpenSpec sudah diinisialisasi: `openspec init`
- Buat ulang skill: `openspec update`
- Periksa apakah direktori `.claude/skills/` ada (untuk Claude Code)
- Mulai ulang alat AI Anda untuk memuat skill baru

### Artefak tidak dihasilkan dengan benar

AI membuat artefak yang tidak lengkap atau salah.

**Solusi:**
- Tambahkan konteks proyek di `openspec/config.yaml`
- Tambahkan aturan per artefak untuk panduan spesifik
- Berikan detail lebih dalam deskripsi perubahan Anda
- Gunakan `/opsx:continue` alih-alih `/opsx:ff` untuk kontrol lebih

---

## Langkah Selanjutnya

- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakan setiap perintah
- [CLI](cli.md) - Perintah terminal untuk manajemen dan validasi
- [Kustomisasi](customization.md) - Membuat skema dan alur kerja kustom