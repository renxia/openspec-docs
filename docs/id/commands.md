# Perintah

Ini adalah referensi untuk perintah slash OpenSpec. Perintah-perintah ini dipanggil di antarmuka chat asisten pengkodean AI Anda (misalnya, Claude Code, Cursor, Windsurf).

Untuk pola alur kerja dan kapan menggunakan setiap perintah, lihat [Alur Kerja](workflows.md). Untuk perintah CLI, lihat [CLI](cli.md).

## Referensi Cepat

### Jalur Cepat Default (profil `core`)

| Perintah | Tujuan |
|----------|--------|
| `/opsx:propose` | Buat perubahan dan hasilkan artefak perencanaan dalam satu langkah |
| `/opsx:explore` | Pikirkan ide-ide sebelum berkomitmen pada perubahan |
| `/opsx:apply` | Implementasikan tugas-tugas dari perubahan |
| `/opsx:sync` | Gabungkan spesifikasi delta ke dalam spesifikasi utama |
| `/opsx:archive` | Arsipkan perubahan yang telah selesai |

### Perintah Alur Kerja yang Diperluas (pemilihan alur kerja kustom)

| Perintah | Tujuan |
|----------|--------|
| `/opsx:new` | Mulai kerangka perubahan baru |
| `/opsx:continue` | Buat artefak berikutnya berdasarkan dependensi |
| `/opsx:ff` | Maju cepat: buat semua artefak perencanaan sekaligus |
| `/opsx:verify` | Validasi bahwa implementasi sesuai dengan artefak |
| `/opsx:bulk-archive` | Arsipkan beberapa perubahan sekaligus |
| `/opsx:onboard` | Tutorial terpandu melalui alur kerja lengkap |

Profil global default adalah `core`. Untuk mengaktifkan perintah alur kerja yang diperluas, jalankan `openspec config profile`, pilih alur kerja, lalu jalankan `openspec update` di proyek Anda.

---

## Referensi Perintah

### `/opsx:propose`

Buat perubahan baru dan hasilkan artefak perencanaan dalam satu langkah. Ini adalah perintah awal default dalam profil `core`.

**Sintaks:**
```text
/opsx:propose [change-name-or-description]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `change-name-or-description` | Tidak | Nama dalam format kebab-case atau deskripsi perubahan dalam bahasa sehari-hari |

**Apa yang dilakukannya:**
- Membuat `openspec/changes/<change-name>/`
- Menghasilkan artefak yang diperlukan sebelum implementasi (untuk `spec-driven`: proposal, spesifikasi, desain, tugas)
- Berhenti ketika perubahan siap untuk `/opsx:apply`

**Contoh:**
```text
Anda: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Tips:**
- Gunakan ini untuk jalur ujung-ke-ujung tercepat
- Jika Anda menginginkan kontrol artefak langkah demi langkah, aktifkan alur kerja yang diperluas dan gunakan `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Pikirkan ide-ide, investigasi masalah, dan klarifikasi persyaratan sebelum berkomitmen pada sebuah perubahan.

**Sintaks:**
```
/opsx:explore [topic]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `topic` | Tidak | Apa yang ingin Anda eksplorasi atau investigasi |

**Apa yang dilakukannya:**
- Membuka percakapan eksplorasi tanpa struktur yang diperlukan
- Menginvestigasi basis kode untuk menjawab pertanyaan
- Membandingkan opsi dan pendekatan
- Membuat diagram visual untuk memperjelas pemikiran
- Dapat beralih ke `/opsx:propose` (default) atau `/opsx:new` (alur kerja yang diperluas) ketika wawasan sudah terbentuk

**Contoh:**
```text
Anda: /opsx:explore

AI:  What would you like to explore?

Anda: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

Anda: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Tips:**
- Gunakan ketika persyaratan tidak jelas atau Anda perlu melakukan investigasi
- Tidak ada artefak yang dibuat selama eksplorasi
- Baik untuk membandingkan beberapa pendekatan sebelum memutuskan
- Dapat membaca file dan mencari di basis kode

---

### `/opsx:new`

Mulai kerangka perubahan baru. Membuat folder perubahan dan menunggu Anda menghasilkan artefak dengan `/opsx:continue` atau `/opsx:ff`.

Perintah ini merupakan bagian dari set alur kerja yang diperluas (tidak termasuk dalam profil `core` default).

**Sintaks:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Nama untuk folder perubahan (akan ditanyakan jika tidak disediakan) |
| `--schema` | Tidak | Skema alur kerja yang akan digunakan (default: dari konfigurasi atau `spec-driven`) |

**Apa yang dilakukannya:**
- Membuat direktori `openspec/changes/<change-name>/`
- Membuat file metadata `.openspec.yaml` di folder perubahan
- Menampilkan template artefak pertama yang siap dibuat
- Menanyakan nama perubahan dan skema jika tidak disediakan

**Apa yang dibuatnya:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Metadata perubahan (skema, tanggal pembuatan)
```

**Contoh:**
```
Anda: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Tips:**
- Gunakan nama deskriptif: `add-feature`, `fix-bug`, `refactor-module`
- Hindari nama generik seperti `update`, `changes`, `wip`
- Skema juga dapat diatur dalam konfigurasi proyek (`openspec/config.yaml`)

---

### `/opsx:continue`

Buat artefak berikutnya dalam rantai dependensi. Membuat satu artefak pada satu waktu untuk kemajuan bertahap.

**Sintaks:**
```
/opsx:continue [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan dilanjutkan (disimpulkan dari konteks jika tidak disediakan) |

**Apa yang dilakukannya:**
- Menanyakan grafik dependensi artefak
- Menampilkan artefak mana yang siap vs terblokir
- Membuat artefak pertama yang siap
- Membaca file dependensi untuk konteks
- Menampilkan apa yang tersedia setelah pembuatan

**Contoh:**
```
Anda: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**Tips:**
- Gunakan ketika Anda ingin meninjau setiap artefak sebelum melanjutkan
- Baik untuk perubahan kompleks di mana Anda menginginkan kontrol
- Beberapa artefak mungkin menjadi siap secara bersamaan
- Anda dapat mengedit artefak yang sudah dibuat sebelum melanjutkan

---

### `/opsx:ff`

Maju cepat melalui pembuatan artefak. Membuat semua artefak perencanaan sekaligus.

**Sintaks:**
```
/opsx:ff [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan dimajukan cepat (disimpulkan dari konteks jika tidak disediakan) |

**Apa yang dilakukannya:**
- Membuat semua artefak dalam urutan dependensi
- Melacak kemajuan melalui daftar tugas
- Berhenti ketika semua artefak `apply-required` selesai
- Membaca setiap dependensi sebelum membuat artefak berikutnya

**Contoh:**
```
Anda: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Tips:**
- Gunakan ketika Anda memiliki gambaran jelas tentang apa yang sedang dibangun
- Lebih cepat dari `/opsx:continue` untuk perubahan yang sederhana
- Anda masih dapat mengedit artefak setelahnya
- Baik untuk fitur kecil hingga menengah

---

### `/opsx:apply`

Implementasikan tugas dari perubahan. Bekerja melalui daftar tugas, menulis kode, dan mencentang item.

**Sintaks:**
```
/opsx:apply [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan diimplementasikan (disimpulkan dari konteks jika tidak disediakan) |

**Apa yang dilakukannya:**
- Membaca `tasks.md` dan mengidentifikasi tugas yang belum selesai
- Bekerja melalui tugas satu per satu
- Menulis kode, membuat file, menjalankan pengujian sesuai kebutuhan
- Menandai tugas selesai dengan kotak centang `[x]`

**Contoh:**
```
Anda: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Tips:**
- Dapat melanjutkan dari tempat terakhir jika terganggu
- Gunakan untuk perubahan paralel dengan menentukan nama perubahan
- Status penyelesaian dilacak dalam kotak centang `tasks.md`

---

### `/opsx:verify`

Validasi bahwa implementasi sesuai dengan artefak perubahan Anda. Memeriksa kelengkapan, kebenaran, dan koherensi.

**Sintaks:**
```
/opsx:verify [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan diverifikasi (disimpulkan dari konteks jika tidak disediakan) |

**Apa yang dilakukannya:**
- Memeriksa tiga dimensi kualitas implementasi
- Mencari basis kode untuk bukti implementasi
- Melaporkan masalah yang dikategorikan sebagai KRITIS, PERINGATAN, atau SARAN
- Tidak memblokir pengarsipan, tetapi menyoroti masalah

**Dimensi verifikasi:**

| Dimensi | Apa yang divalidasi |
|-----------|-------------------|
| **Kelengkapan** | Semua tugas selesai, semua persyaratan diimplementasikan, skenario tercakup |
| **Kebenaran** | Implementasi sesuai dengan maksud spesifikasi, kasus tepi ditangani |
| **Koherensi** | Keputusan desain tercermin dalam kode, pola konsisten |

**Contoh:**
```
Anda: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Tips:**
- Jalankan sebelum mengarsipkan untuk menangkap ketidaksesuaian lebih awal
- Peringatan tidak memblokir pengarsipan tetapi menunjukkan masalah potensial
- Baik untuk meninjau pekerjaan AI sebelum berkomitmen
- Dapat mengungkap pergeseran antara artefak dan implementasi

---

### `/opsx:sync`

**Perintah opsional.** Menggabungkan spesifikasi delta dari sebuah perubahan ke dalam spesifikasi utama. Pengarsipan akan menanyakan untuk menyinkronkan jika diperlukan, jadi Anda biasanya tidak perlu menjalankan ini secara manual.

**Sintaks:**
```
/opsx:sync [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan disinkronkan (disimpulkan dari konteks jika tidak disediakan) |

**Apa yang dilakukannya:**
- Membaca spesifikasi delta dari folder perubahan
- Mengurai bagian DITAMBAHKAN/DIUBAH/DIHAPUS/DINAMAI ULANG
- Menggabungkan perubahan ke direktori utama `openspec/specs/`
- Mempertahankan konten yang ada yang tidak disebutkan dalam delta
- Tidak mengarsipkan perubahan (tetap aktif)

**Contoh:**
```text
Anda: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Kapan menggunakannya secara manual:**

| Skenario | Gunakan sync? |
|----------|-----------|
| Perubahan jangka panjang, ingin spesifikasi di utama sebelum mengarsipkan | Ya |
| Beberapa perubahan paralel memerlukan basis spesifikasi yang diperbarui | Ya |
| Ingin melihat/meninjau penggabungan secara terpisah | Ya |
| Perubahan cepat, langsung ke pengarsipan | Tidak (pengarsipan menanganinya) |

**Tips:**
- Sinkronisasi cerdas, bukan salin-tempel
- Dapat menambahkan skenario ke persyaratan yang ada tanpa duplikasi
- Perubahan tetap aktif setelah sinkronisasi (tidak diarsipkan)
- Sebagian besar pengguna tidak akan pernah perlu memanggil ini secara langsung—pengarsipan akan menanyakan jika diperlukan

---

### `/opsx:archive`

Arsipkan perubahan yang telah selesai. Menyelesaikan perubahan dan memindahkannya ke folder arsip.

**Sintaks:**
```
/opsx:archive [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan mana yang akan diarsipkan (disimpulkan dari konteks jika tidak disediakan) |

**Apa yang dilakukannya:**
- Memeriksa status penyelesaian artefak
- Memeriksa penyelesaian tugas (memperingatkan jika belum selesai)
- Menawarkan untuk menyinkronkan spesifikasi delta jika belum disinkronkan
- Memindahkan folder perubahan ke `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Mempertahankan semua artefak untuk jejak audit

**Contoh:**
```text
Anda: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

Anda: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Tips:**
- Pengarsipan tidak akan memblokir tugas yang belum selesai, tetapi akan memperingatkan
- Spesifikasi delta dapat disinkronkan selama pengarsipan atau sebelumnya
- Perubahan yang diarsipkan dipertahankan untuk riwayat
- Gunakan `/opsx:verify` terlebih dahulu untuk menangkap masalah

---

### `/opsx:bulk-archive`

Arsipkan beberapa perubahan yang telah selesai sekaligus. Menangani konflik spesifikasi antar perubahan.

**Sintaks:**
```
/opsx:bulk-archive [change-names...]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `change-names` | Tidak | Perubahan spesifik yang akan diarsipkan (menanyakan untuk memilih jika tidak disediakan) |

**Apa yang dilakukannya:**
- Mendaftar semua perubahan yang telah selesai
- Memvalidasi setiap perubahan sebelum mengarsipkan
- Mendeteksi konflik spesifikasi di seluruh perubahan
- Menyelesaikan konflik dengan memeriksa apa yang benar-benar diimplementasikan
- Mengarsipkan dalam urutan kronologis

**Contoh:**
```
Anda: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

Anda: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Tips:**
- Baik untuk alur kerja paralel
- Penyelesaian konflik bersifat agen (memeriksa basis kode)
- Perubahan diarsipkan berdasarkan urutan pembuatan
- Menanyakan sebelum menimpa konten spesifikasi

---

### `/opsx:onboard`

Panduan orientasi melalui alur kerja OpenSpec secara lengkap. Tutorial interaktif menggunakan basis kode Anda yang sebenarnya.

**Sintaks:**
```
/opsx:onboard
```

**Apa yang dilakukannya:**
- Menjelajahi siklus alur kerja lengkap dengan narasi
- Memindai basis kode Anda untuk peluang peningkatan nyata
- Membuat perubahan aktual dengan artefak nyata
- Mengimplementasikan pekerjaan aktual (perubahan kecil, aman)
- Mengarsipkan perubahan yang telah selesai
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

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Tips:**
- Terbaik untuk pengguna baru yang mempelajari alur kerja
- Menggunakan kode nyata, bukan contoh mainan
- Membuat perubahan nyata yang dapat Anda pertahankan atau buang
- Membutuhkan waktu 15-30 menit untuk menyelesaikan

---

## Sintaks Perintah berdasarkan Alat AI

Alat AI yang berbeda menggunakan sintaks perintah yang sedikit berbeda. Gunakan format yang sesuai dengan alat Anda:

| Alat | Contoh Sintaks |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Invokasi berbasis Skill seperti `/skill:openspec-propose`, `/skill:openspec-apply-change` (tidak ada file perintah `opsx-*` yang dihasilkan) |
| Trae | Invokasi berbasis Skill seperti `/openspec-propose`, `/openspec-apply-change` (tidak ada file perintah `opsx-*` yang dihasilkan) |

Intensinya sama di semua alat, tetapi cara perintah disajikan dapat berbeda tergantung pada integrasinya.

> **Catatan:** Perintah GitHub Copilot (`.github/prompts/*.prompt.md`) hanya tersedia di ekstensi IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI saat ini tidak mendukung file prompt kustom — lihat [Alat yang Didukung](supported-tools.md) untuk detail dan solusi alternatif.

---

## Perintah Legacy

Perintah-perintah ini menggunakan alur kerja lama "all-at-once" (semua sekaligus). Perintah-perintah ini masih berfungsi tetapi perintah OPSX direkomendasikan.

| Perintah | Fungsinya |
|---------|--------------|
| `/openspec:proposal` | Membuat semua artefak sekaligus (proposal, spesifikasi, desain, tugas) |
| `/openspec:apply` | Mengimplementasikan perubahan |
| `/openspec:archive` | Mengarsipkan perubahan |

**Kapan menggunakan perintah legacy:**
- Proyek yang sudah ada menggunakan alur kerja lama
- Perubahan sederhana di mana Anda tidak memerlukan pembuatan artefak secara bertahap
- Preferensi untuk pendekatan semua-atau-tidak sama sekali

**Bermigrasi ke OPSX:**
Perubahan legacy dapat dilanjutkan dengan perintah OPSX. Struktur artefaknya kompatibel.

---

## Pemecahan Masalah

### "Change not found" (Perubahan tidak ditemukan)

Perintah tidak dapat mengidentifikasi perubahan mana yang akan dikerjakan.

**Solusi:**
- Tentukan nama perubahan secara eksplisit: `/opsx:apply add-dark-mode`
- Periksa apakah folder perubahan ada: `openspec list`
- Verifikasi Anda berada di direktori proyek yang benar

### "No artifacts ready" (Tidak ada artefak yang siap)

Semua artefak sudah selesai atau terblokir oleh dependensi yang hilang.

**Solusi:**
- Jalankan `openspec status --change <name>` untuk melihat apa yang memblokir
- Periksa apakah artefak yang diperlukan ada
- Buat artefak dependensi yang hilang terlebih dahulu

### "Schema not found" (Skema tidak ditemukan)

Skema yang ditentukan tidak ada.

**Solusi:**
- Daftarkan skema yang tersedia: `openspec schemas`
- Periksa ejaan nama skema
- Buat skema jika itu kustom: `openspec schema init <name>`

### Perintah tidak dikenali

Alat AI tidak mengenali perintah OpenSpec.

**Solusi:**
- Pastikan OpenSpec sudah diinisialisasi: `openspec init`
- Buat ulang skill: `openspec update`
- Periksa apakah direktori `.claude/skills/` ada (untuk Claude Code)
- Mulai ulang alat AI Anda untuk mengambil skill baru

### Artefak tidak dihasilkan dengan benar

AI membuat artefak yang tidak lengkap atau salah.

**Solusi:**
- Tambahkan konteks proyek di `openspec/config.yaml`
- Tambahkan aturan per artefak untuk panduan spesifik
- Berikan lebih banyak detail dalam deskripsi perubahan Anda
- Gunakan `/opsx:continue` alih-alih `/opsx:ff` untuk kontrol lebih

---

## Langkah Selanjutnya

- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakan setiap perintah
- [CLI](cli.md) - Perintah terminal untuk manajemen dan validasi
- [Kustomisasi](customization.md) - Membuat skema dan alur kerja kustom