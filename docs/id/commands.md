# Perintah

Ini adalah referensi untuk perintah slash dari OpenSpec. Perintah-perintah ini dipanggil di antarmuka obrol asisten pengkodean AI Anda (misalnya, Claude Code, Cursor, Windsurf).

Untuk pola alur kerja dan kapan harus menggunakan setiap perintah, lihat [Workflows](workflows.md). Untuk perintah CLI, lihat [CLI](cli.md).

## Referensi Cepat

### Jalur Cepat Standar (`core` profile)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Membuat perubahan dan menghasilkan artefak perencanaan dalam satu langkah |
| `/opsx:explore` | Memikirkan ide sebelum berkomitmen pada suatu perubahan |
| `/opsx:apply` | Mengimplementasikan tugas dari perubahan tersebut |
| `/opsx:sync` | Menggabungkan spesifikasi delta ke dalam spesifikasi utama |
| `/opsx:archive` | Mengarsipkan perubahan yang telah selesai |

### Perintah Alur Kerja yang Diperluas (pemilihan alur kerja khusus)

| Command | Purpose |
|---------|---------|
| `/opsx:new` | Memulai kerangka perubahan baru |
| `/opsx:continue` | Membuat artefak berikutnya berdasarkan dependensi |
| `/opsx:ff` | Maju Cepat (Fast-forward): membuat semua artefak perencanaan sekaligus |
| `/opsx:verify` | Memvalidasi bahwa implementasi sesuai dengan artefak |
| `/opsx:bulk-archive` | Mengarsipkan beberapa perubahan sekaligus |
| `/opsx:onboard` | Tutorial terpandu melalui seluruh alur kerja |

Profil global standarnya adalah `core`. Untuk mengaktifkan perintah alur kerja yang diperluas, jalankan `openspec config profile`, pilih alur kerja, lalu jalankan `openspec update` di proyek Anda.

## Referensi Perintah

### `/opsx:propose`

Membuat perubahan baru dan menghasilkan artefak perencanaan dalam satu langkah. Ini adalah perintah awal default di profil `core`.

**Sintaks:**
```text
/opsx:propose [change-name-or-description]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `change-name-or-description` | Tidak | Nama kebab-case atau deskripsi perubahan dalam bahasa biasa |

**Fungsi:**
- Membuat `openspec/changes/<change-name>/`
- Menghasilkan artefak yang diperlukan sebelum implementasi (untuk `spec-driven`: proposal, specs, desain, tugas)
- Berhenti ketika perubahan siap untuk `/opsx:apply`

**Contoh:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Siap untuk implementasi. Jalankan /opsx:apply.
```

**Tips:**
- Gunakan ini untuk jalur *end-to-end* tercepat
- Jika Anda ingin kontrol artefak langkah demi langkah, aktifkan alur kerja yang diperluas dan gunakan `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Mulai di sini jika Anda tidak yakin.** Explore adalah mitra berpikir tanpa risiko: ia membaca *codebase* Anda, membandingkan opsi, dan memperjelas ide yang kabur menjadi rencana konkret sebelum perubahan apa pun ada. Ini disertakan dalam profil default. Untuk kasus lengkap dan lebih banyak contoh, lihat panduan [Explore First](explore.md).

Pikirkan ide, selidiki masalah, dan perjelas persyaratan sebelum berkomitmen pada suatu perubahan.

**Sintaks:**
```
/opsx:explore [topic]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `topic` | Tidak | Apa yang ingin Anda jelajahi atau selidiki |

**Fungsi:**
- Membuka percakapan eksploratif tanpa memerlukan struktur
- Menyelidiki *codebase* untuk menjawab pertanyaan
- Membandingkan opsi dan pendekatan
- Membuat diagram visual untuk memperjelas pemikiran
- Dapat beralih ke `/opsx:propose` (default) atau `/opsx:new` (alur kerja yang diperluas) ketika wawasan terbentuk

**Contoh:**
```text
You: /opsx:explore

AI:  Apa yang ingin Anda jelajahi?

You: Bagaimana seharusnya kita menangani otentikasi untuk aplikasi seluler?

AI:  Izinkan saya menyelidiki pengaturan auth Anda saat ini...
     [Menganalisis codebase]

     Saya lihat Anda menggunakan otentikasi berbasis sesi untuk aplikasi web.
     Untuk seluler, kami memiliki tiga opsi utama:

     1. JWT tokens (stateless, berfungsi offline)
     2. OAuth2 (jika Anda memerlukan login pihak ketiga)
     3. Perluas sesi saat ini (lebih sederhana, tetapi membutuhkan konektivitas)

     API Anda sudah dikonfigurasi CORS. Arah mana yang menarik bagi Anda?

You: Mari kita gunakan JWT. Bisakah kita mulai perubahan untuk itu?

AI:  Siap kapan pun Anda siap. Jalankan /opsx:propose add-jwt-auth untuk memulai.
```

**Tips:**
- Gunakan ketika persyaratan tidak jelas atau Anda perlu menyelidiki
- Tidak ada artefak yang dibuat selama eksplorasi
- Baik untuk membandingkan beberapa pendekatan sebelum memutuskan
- Dapat membaca file dan mencari di *codebase*

---

### `/opsx:new`

Memulai perancah (scaffold) perubahan baru. Membuat folder perubahan dan menunggu Anda menghasilkan artefak dengan `/opsx:continue` atau `/opsx:ff`.

Perintah ini adalah bagian dari set alur kerja yang diperluas (tidak termasuk dalam profil `core` default).

**Sintaks:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Nama untuk folder perubahan (ditanyakan jika tidak disediakan) |
| `--schema` | Tidak | Skema alur kerja yang akan digunakan (default: dari konfigurasi atau `spec-driven`) |

**Fungsi:**
- Membuat direktori `openspec/changes/<change-name>/`
- Membuat file metadata `.openspec.yaml` di folder perubahan
- Menampilkan templat artefak pertama yang siap dibuat
- Meminta nama dan skema perubahan jika tidak disediakan

**Apa yang dibuatnya:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Metadata perubahan (skema, tanggal pembuatan)
```

**Contoh:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Siap untuk membuat: proposal
     Gunakan /opsx:continue untuk membuatnya, atau /opsx:ff untuk membuat semua artefak.
```

**Tips:**
- Gunakan nama deskriptif: `add-feature`, `fix-bug`, `refactor-module`
- Hindari nama generik seperti `update`, `changes`, `wip`
- Skema juga dapat diatur dalam konfigurasi proyek (`openspec/config.yaml`)

---

### `/opsx:continue`

Membuat artefak berikutnya dalam rantai dependensi. Membuat satu artefak pada satu waktu untuk kemajuan inkremental.

**Sintaks:**
```
/opsx:continue [change-name]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan dilanjutkan (diinferensikan dari konteks jika tidak disediakan) |

**Fungsi:**
- Menanyakan grafik dependensi artefak
- Menunjukkan artefak mana yang siap vs terblokir
- Membuat artefak pertama yang siap
- Membaca file dependensi untuk konteks
- Menunjukkan apa yang menjadi tersedia setelah pembuatan

**Contoh:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Status artefak:
     ✓ proposal    (selesai)
     ◆ specs       (siap)
     ◆ design      (siap)
     ○ tasks       (terblokir - butuh: specs)

     Membuat specs...

     [Membaca proposal.md, membuat specs berdasarkan persyaratan]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Sekarang tersedia: tasks
     Jalankan /opsx:continue untuk membuat artefak berikutnya.
```

**Tips:**
- Gunakan ketika Anda ingin meninjau setiap artefak sebelum melanjutkan
- Baik untuk perubahan yang kompleks di mana Anda menginginkan kontrol
- Beberapa artefak mungkin siap secara bersamaan
- Anda dapat mengedit artefak yang dibuat sebelum melanjutkan

---

### `/opsx:ff`

Melompat maju (Fast-forward) melalui pembuatan artefak. Membuat semua artefak perencanaan sekaligus.

**Sintaks:**
```
/opsx:ff [change-name]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan dilompat maju (diinferensikan dari konteks jika tidak disediakan) |

**Fungsi:**
- Membuat semua artefak dalam urutan dependensi
- Melacak kemajuan melalui daftar tugas (*todo list*)
- Berhenti ketika semua artefak `apply-required` selesai
- Membaca setiap dependensi sebelum membuat artefak berikutnya

**Contoh:**
```
You: /opsx:ff add-dark-mode

AI:  Melompat maju untuk add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     Semua artefak perencanaan selesai!
     Siap untuk implementasi. Jalankan /opsx:apply untuk memulai.
```

**Tips:**
- Gunakan ketika Anda memiliki gambaran jelas tentang apa yang sedang dibangun
- Lebih cepat daripada `/opsx:continue` untuk perubahan yang sederhana
- Anda masih dapat mengedit artefak setelahnya
- Baik untuk fitur kecil hingga menengah

---

### `/opsx:apply`

Mengimplementasikan tugas dari perubahan. Bekerja melalui daftar tugas, menulis kode dan menandai item selesai.

**Sintaks:**
```
/opsx:apply [change-name]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan diimplementasikan (diinferensikan dari konteks jika tidak disediakan) |

**Fungsi:**
- Membaca `tasks.md` dan mengidentifikasi tugas yang belum selesai
- Bekerja melalui tugas satu per satu
- Menulis kode, membuat file, menjalankan tes sesuai kebutuhan
- Menandai tugas selesai dengan kotak centang `[x]`

**Contoh:**
```
You: /opsx:apply

AI:  Mengimplementasikan add-dark-mode...

     Membaca tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Bekerja pada 1.1: Create ThemeContext...
     [Membuat src/context/ThemeContext.tsx]

     ✓ 1.1 Selesai

     Bekerja pada 1.2: Add CSS custom properties...
     [Memperbarui src/styles/globals.css]

     ✓ 1.2 Selesai
     ...
```

**Tips:**
- Dapat dilanjutkan dari tempat Anda berhenti jika terinterupsi
- Gunakan untuk perubahan paralel dengan menentukan nama perubahannya
- Status penyelesaian dilacak dalam kotak centang `tasks.md`

---

### `/opsx:verify`

Memvalidasi bahwa implementasi sesuai dengan artefak perubahan Anda. Memeriksa kelengkapan, kebenaran, dan koherensi.

**Sintaks:**
```
/opsx:verify [change-name]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan diverifikasi (diinferensikan dari konteks jika tidak disediakan) |

**Fungsi:**
- Memeriksa tiga dimensi kualitas implementasi
- Mencari bukti implementasi di *codebase*
- Melaporkan masalah yang dikategorikan sebagai CRITICAL, WARNING, atau SUGGESTION
- Tidak memblokir pengarsipan, tetapi menampilkan masalah

**Dimensi Verifikasi:**

| Dimensi | Apa yang divalidasi |
|-----------|-------------------|
| **Completeness** | Semua tugas selesai, semua persyaratan diimplementasikan, skenario tercakup |
| **Correctness** | Implementasi sesuai dengan maksud spesifikasi, kasus tepi ditangani |
| **Coherence** | Keputusan desain tercermin dalam kode, pola konsisten |

**Contoh:**
```
You: /opsx:verify

AI:  Memverifikasi add-dark-mode...

     COMPLETENESS
     ✓ Semua 8 tugas di tasks.md telah dicentang
     ✓ Semua persyaratan di specs memiliki kode yang sesuai
     ⚠ Skenario "Deteksi preferensi sistem" tidak memiliki cakupan tes

     CORRECTNESS
     ✓ Implementasi sesuai dengan maksud spesifikasi
     ✓ Kasus tepi dari skenario ditangani
     ✓ Status kesalahan sesuai definisi spesifikasi

     COHERENCE
     ✓ Keputusan desain tercermin dalam struktur kode
     ✓ Konvensi penamaan konsisten dengan design.md
     ⚠ Desain menyebutkan "CSS variables" tetapi implementasi menggunakan kelas Tailwind

     SUMMARY
     ─────────────────────────────
     Masalah Kritis: 0
     Peringatan: 2
     Siap untuk diarsipkan: Ya (dengan peringatan)

     Rekomendasi:
     1. Tambahkan tes untuk deteksi preferensi sistem
     2. Perbarui design.md untuk mencerminkan penggunaan Tailwind, atau refactor untuk menggunakan CSS variables
```

**Tips:**
- Jalankan sebelum mengarsip untuk menangkap ketidaksesuaian sejak dini
- Peringatan tidak memblokir pengarsipan tetapi menunjukkan potensi masalah
- Baik untuk meninjau pekerjaan AI sebelum berkomitmen
- Dapat mengungkapkan penyimpangan antara artefak dan implementasi

---

### `/opsx:sync`

**Perintah Opsional.** Menggabungkan spesifikasi delta dari suatu perubahan ke dalam spesifikasi utama. Pengarsipan akan meminta sinkronisasi jika diperlukan, jadi Anda biasanya tidak perlu menjalankannya secara manual.

**Sintaks:**
```
/opsx:sync [change-name]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan disinkronkan (diinferensikan dari konteks jika tidak disediakan) |

**Fungsi:**
- Membaca spesifikasi delta dari folder perubahan
- Mengurai bagian ADDED/MODIFIED/REMOVED/RENAMED
- Menggabungkan perubahan ke dalam direktori utama `openspec/specs/`
- Mempertahankan konten yang sudah ada yang tidak disebutkan dalam delta
- Tidak mengarsipkan perubahan (tetap aktif)

**Contoh:**
```text
You: /opsx:sync

AI:  Menyinkronkan spesifikasi delta add-dark-mode...

     Membaca: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Perubahan yang akan diterapkan:
     ✓ ADDED: Persyaratan Pemilihan Tema (2 skenario)
     ✓ ADDED: Persyaratan Aksesibilitas (1 skenario)

     Menggabungkan...
     ✓ openspec/specs/ui/spec.md diperbarui

     Perubahan tetap aktif. Jalankan /opsx:archive ketika siap untuk menyelesaikan.
```

**Kapan harus menggunakan secara manual:**

| Skenario | Gunakan sync? |
|----------|-----------|
| Perubahan jangka panjang, ingin spesifikasi ada di utama sebelum mengarsip | Ya |
| Beberapa perubahan paralel membutuhkan spesifikasi dasar yang diperbarui | Ya |
| Ingin melihat/meninjau penggabungan secara terpisah | Ya |
| Perubahan cepat, langsung menuju arsip | Tidak (archive menanganinya) |

**Tips:**
- Sync cerdas, bukan salin-tempel
- Dapat menambahkan skenario ke persyaratan yang sudah ada tanpa menduplikasi
- Perubahan tetap aktif setelah sinkronisasi (tidak diarsipkan)
- Sebagian besar pengguna tidak akan pernah perlu memanggil ini secara langsung—archive akan meminta jika diperlukan

---

### `/opsx:archive`

Mengarsipkan perubahan yang telah selesai. Menyelesaikan perubahan dan memindahkannya ke folder arsip.

**Sintaks:**
```
/opsx:archive [change-name]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan diarsipkan (diinferensikan dari konteks jika tidak disediakan) |

**Fungsi:**
- Memeriksa status penyelesaian artefak
- Memeriksa penyelesaian tugas (memberi peringatan jika belum selesai)
- Menawarkan untuk menyinkronkan spesifikasi delta jika belum disinkronkan
- Memindahkan folder perubahan ke `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Mempertahankan semua artefak untuk jejak audit

**Contoh:**
```text
You: /opsx:archive

AI:  Mengarsipkan add-dark-mode...

     Status artefak:
     ✓ proposal.md ada
     ✓ specs/ ada
     ✓ design.md ada
     ✓ tasks.md ada (8/8 tugas selesai)

     Delta specs: Belum disinkronkan
     → Sinkron sekarang? (direkomendasikan)

You: Yes

AI:  ✓ Specs disinkronkan ke openspec/specs/ui/spec.md
     ✓ Dipindahkan ke openspec/changes/archive/2025-01-24-add-dark-mode/

     Perubahan berhasil diarsipkan.
```

**Tips:**
- Archive tidak akan memblokir pada tugas yang belum selesai, tetapi akan memberi peringatan
- Delta specs dapat disinkronkan selama pengarsipan atau sebelumnya
- Perubahan yang diarsipkan dilestarikan untuk riwayat
- Gunakan `/opsx:verify` terlebih dahulu untuk menangkap masalah

---

### `/opsx:bulk-archive`

Mengarsipkan beberapa perubahan yang telah selesai sekaligus. Menangani konflik spesifikasi antarperubahan.

**Sintaks:**
```
/opsx:bulk-archive [change-names...]
```

**Argumen:**
| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `change-names` | Tidak | Perubahan spesifik untuk diarsipkan (meminta pilihan jika tidak disediakan) |

**Fungsi:**
- Mendaftar semua perubahan yang telah selesai
- Memvalidasi setiap perubahan sebelum pengarsipan
- Mendeteksi konflik spesifikasi antarperubahan
- Menyelesaikan konflik dengan memeriksa apa yang sebenarnya diimplementasikan
- Mengarsipkan dalam urutan kronologis

**Contoh:**
```
You: /opsx:bulk-archive

AI:  Ditemukan 3 perubahan yang selesai:
     - add-dark-mode (8/8 tugas selesai)
     - fix-login-bug (3/3 tugas selesai)
     - update-footer (2/2 tugas selesai)

     Memeriksa konflik spesifikasi...
     ⚠ add-dark-mode dan update-footer keduanya menyentuh specs/ui/

     Menginspeksi codebase untuk menyelesaikan...
     Kedua perubahan telah diimplementasikan. Akan digabungkan dalam urutan kronologis:
     1. add-dark-mode (dibuat Jan 20)
     2. update-footer (dibuat Jan 22)

     Arsipkan ketiga perubahan?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs digabungkan: add-dark-mode → update-footer
```

**Tips:**
- Baik untuk alur kerja paralel
- Penyelesaian konflik bersifat *agentic* (memeriksa *codebase*)
- Perubahan diarsipkan dalam urutan pembuatan
- Meminta sebelum menimpa konten spesifikasi

---

### `/opsx:onboard`

Orientasi terpandu melalui Alur Kerja OpenSpec yang lengkap. Tutorial interaktif menggunakan *codebase* Anda yang sebenarnya.

**Sintaks:**
```
/opsx:onboard
```

**Fungsi:**
- Memandu melalui siklus alur kerja yang lengkap dengan narasi
- Memindai *codebase* Anda untuk peluang perbaikan nyata
- Membuat perubahan aktual dengan artefak nyata
- Mengimplementasikan pekerjaan nyata (perubahan kecil, aman)
- Mengarsipkan perubahan yang selesai
- Menjelaskan setiap langkah saat hal itu terjadi

**Fase:**
1. Selamat datang dan analisis *codebase*
2. Menemukan peluang perbaikan
3. Membuat perubahan (`/opsx:new`)
4. Menulis proposal
5. Membuat specs
6. Menulis desain
7. Membuat tugas
8. Mengimplementasikan tugas (`/opsx:apply`)
9. Memverifikasi implementasi
10. Mengarsipkan perubahan
11. Ringkasan dan langkah selanjutnya

**Contoh:**
```
You: /opsx:onboard

AI:  Selamat datang di OpenSpec!

     Saya akan memandu Anda melalui alur kerja lengkap menggunakan *codebase* Anda yang sebenarnya.
     Kita akan menemukan sesuatu yang kecil untuk diperbaiki, membuat perubahan yang layak untuk itu,
     mengimplementasikannya, dan mengarsipkannya.

     Izinkan saya memindai *codebase* Anda untuk peluang...

     [Menganalisis codebase]

     Saya menemukan beberapa hal yang dapat kami kerjakan:
     1. Tambahkan validasi input ke formulir kontak
     2. Tingkatkan pesan kesalahan di alur otentikasi
     3. Tambahkan status pemuatan pada tombol asinkron

     Mana yang menarik bagi Anda? (atau sarankan hal lain)
```

**Tips:**
- Terbaik untuk pengguna baru yang mempelajari alur kerja
- Menggunakan kode nyata, bukan contoh mainan
- Membuat perubahan nyata yang dapat Anda simpan atau buang
- Membutuhkan 15-30 menit untuk diselesaikan

## Sintaks Perintah Berdasarkan Alat AI

Berbagai alat AI menggunakan sintaks perintah yang sedikit berbeda. Gunakan format yang sesuai dengan alat Anda:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

Maksudnya sama di semua alat, tetapi cara perintah ditampilkan dapat berbeda tergantung integrasi.

> **Catatan:** Perintah GitHub Copilot (`.github/prompts/*.prompt.md`) hanya tersedia di ekstensi IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI saat ini tidak mendukung file prompt khusus — lihat [Supported Tools](supported-tools.md) untuk detail dan solusi sementara.

---

## Perintah Warisan (Legacy)

Perintah ini menggunakan alur kerja "sekaligus" yang lebih lama. Perintah tersebut masih berfungsi tetapi perintah OPSX direkomendasikan.

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | Membuat semua artefak sekaligus (proposal, spesifikasi, desain, tugas) |
| `/openspec:apply` | Mengimplementasikan perubahan |
| `/openspec:archive` | Mengarsipkan perubahan |

**Kapan menggunakan perintah warisan:**
- Proyek yang sudah ada yang menggunakan alur kerja lama
- Perubahan sederhana di mana Anda tidak memerlukan pembuatan artefak inkremental
- Preferensi untuk pendekatan serba-serbi (all-or-nothing)

**Migrasi ke OPSX:**
Perubahan warisan dapat dilanjutkan dengan perintah OPSX. Struktur artefak tersebut kompatibel.

---

## Pemecahan Masalah (Troubleshooting)

### "Change not found"

Perintah tersebut tidak dapat mengidentifikasi perubahan mana yang harus dikerjakan.

**Solusi:**
- Tentukan nama perubahan secara eksplisit: `/opsx:apply add-dark-mode`
- Periksa apakah folder perubahan ada: `openspec list`
- Verifikasi bahwa Anda berada di direktori proyek yang benar

### "No artifacts ready"

Semua artefak baik sudah selesai atau diblokir oleh dependensi yang hilang.

**Solusi:**
- Jalankan `openspec status --change <name>` untuk melihat apa yang memblokir
- Periksa apakah artefak yang diperlukan ada
- Buat artefak dependensi yang hilang terlebih dahulu

### "Schema not found"

Skema yang ditentukan tidak ada.

**Solusi:**
- Daftarkan skema yang tersedia: `openspec schemas`
- Periksa ejaan nama skema
- Buat skema jika itu kustom: `openspec schema init <name>`

### Perintah tidak dikenali

Alat AI tidak mengenali perintah OpenSpec.

**Solusi:**
- Pastikan OpenSpec telah diinisialisasi: `openspec init`
- Regenerasi skill: `openspec update`
- Periksa apakah direktori `.claude/skills/` ada (untuk Claude Code)
- Mulai ulang alat AI Anda untuk mengambil skill yang baru

### Artefak tidak dibuat dengan benar

AI membuat artefak yang tidak lengkap atau salah.

**Solusi:**
- Tambahkan konteks proyek di `openspec/config.yaml`
- Tambahkan aturan per-artefak untuk panduan spesifik
- Berikan lebih banyak detail dalam deskripsi perubahan Anda
- Gunakan `/opsx:continue` alih-alih `/opsx:ff` untuk kontrol yang lebih baik

---

## Langkah Selanjutnya

- [Alur Kerja (Workflows)](workflows.md) - Pola umum dan kapan harus menggunakan setiap perintah
- [CLI](cli.md) - Perintah terminal untuk manajemen dan validasi
- [Kustomisasi (Customization)](customization.md) - Membuat skema dan alur kerja khusus