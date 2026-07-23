# Perintah

Ini adalah referensi untuk perintah slash OpenSpec. Perintah-perintah ini dipanggil di antarmuka chat asisten koding AI Anda (misalnya Claude Code, Cursor, Windsurf).

Untuk pola alur kerja dan kapan menggunakan setiap perintah, lihat [Alur Kerja](workflows.md). Untuk perintah CLI, lihat [CLI](cli.md).

## Referensi Cepat

### Jalur Cepat Default (profil `core`)

| Perintah | Tujuan |
|---------|---------|
| `/opsx:propose` | Buat perubahan dan hasilkan artefak perencanaan dalam satu langkah |
| `/opsx:explore` | Pikirkan ide-ide sebelum memutuskan untuk membuat perubahan |
| `/opsx:apply` | Implementasikan tugas dari perubahan tersebut |
| `/opsx:update` | Revisi artefak perencanaan perubahan dan pastikan tetap konsisten |
| `/opsx:sync` | Gabungkan spesifikasi delta ke dalam spesifikasi utama |
| `/opsx:archive` | Arsipkan perubahan yang sudah selesai |

### Perintah Alur Kerja yang Diperluas (pemilihan alur kerja kustom)

| Perintah | Tujuan |
|---------|---------|
| `/opsx:new` | Mulai kerangka perubahan baru |
| `/opsx:continue` | Buat artefak berikutnya berdasarkan dependensi |
| `/opsx:ff` | Fast-forward: buat semua artefak perencanaan sekaligus |
| `/opsx:verify` | Validasi bahwa implementasi sesuai dengan artefak |
| `/opsx:bulk-archive` | Arsipkan banyak perubahan sekaligus |
| `/opsx:onboard` | Tutorial panduan melalui alur kerja lengkap |

Profil global default adalah `core`. Untuk mengaktifkan perintah alur kerja yang diperluas, jalankan `openspec config profile`, pilih alur kerja, kemudian jalankan `openspec update` di proyek Anda.

## Referensi Perintah

### `/opsx:propose`

Buat perubahan baru dan hasilkan artefak perencanaan dalam satu langkah. Ini adalah perintah mulai default dalam profil `core`.

**Sintaks:**
```text
/opsx:propose [change-name-or-description]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|------------|-----------|
| `change-name-or-description` | Tidak | Nama dalam kebab-case atau deskripsi perubahan dalam bahasa sehari-hari |

**Apa yang dilakukan:**
- Membuat `openspec/changes/<change-name>/`
- Menghasilkan artefak yang dibutuhkan sebelum implementasi (untuk `spec-driven`: proposal, spesifikasi, desain, tugas)
- Berhenti ketika perubahan siap untuk `/opsx:apply`

**Contoh:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Tips:**
- Gunakan ini untuk jalur end-to-end tercepat
- Jika Anda ingin kontrol artefak langkah demi langkah, aktifkan alur kerja yang diperluas dan gunakan `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Mulai dari sini jika Anda tidak yakin.** Explore adalah mitra berpikir tanpa risiko: ia membaca basis kode Anda, membandingkan opsi, dan mengasah ide yang kabur menjadi rencana konkret sebelum ada perubahan apa pun. Ini tersedia dalam profil default. Untuk kasus lengkap dan contoh lainnya, lihat panduan [Explore First](explore.md).

Pikirkan ide, investigasi masalah, dan perjelas persyaratan sebelum berkomitmen pada perubahan.

**Sintaks:**
```
/opsx:explore [topic]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|------------|-----------|
| `topic` | Tidak | Apa yang ingin Anda jelajahi atau investigasi |

**Apa yang dilakukan:**
- Membuka percakapan eksplorasi tanpa struktur yang diwajibkan
- Menginvestigasi basis kode untuk menjawab pertanyaan
- Membandingkan opsi dan pendekatan
- Membuat diagram visual untuk memperjelas pemikiran
- Dapat beralih ke `/opsx:propose` (default) atau `/opsx:new` (alur kerja diperluas) ketika wawasan mengkristal

**Contoh:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Tips:**
- Gunakan ketika persyaratan tidak jelas atau Anda perlu investigasi
- Tidak ada artefak yang dibuat selama eksplorasi
- Baik untuk membandingkan beberapa pendekatan sebelum memutuskan
- Dapat membaca file dan mencari basis kode

---

### `/opsx:new`

Mulai kerangka perubahan baru. Membuat folder perubahan dan menunggu Anda untuk menghasilkan artefak dengan `/opsx:continue` atau `/opsx:ff`.

Perintah ini adalah bagian dari set alur kerja yang diperluas (tidak termasuk dalam profil `core` default).

**Sintaks:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|------------|-----------|
| `change-name` | Tidak | Nama untuk folder perubahan (akan diminta jika tidak diberikan) |
| `--schema` | Tidak | Skema alur kerja yang akan digunakan (default: dari konfigurasi atau `spec-driven`) |

**Apa yang dilakukan:**
- Membuat direktori `openspec/changes/<change-name>/`
- Membuat file metadata `.openspec.yaml` di folder perubahan
- Menampilkan templat artefak pertama yang siap dibuat
- Meminta nama perubahan dan skema jika tidak diberikan

**Apa yang dibuat:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Metadata perubahan (skema, tanggal dibuat)
```

**Contoh:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Tips:**
- Gunakan nama yang deskriptif: `add-feature`, `fix-bug`, `refactor-module`
- Hindari nama umum seperti `update`, `changes`, `wip`
- Skema juga dapat diatur dalam konfigurasi proyek (`openspec/config.yaml`)

---

### `/opsx:continue`

Buat artefak berikutnya dalam rantai ketergantungan. Membuat satu artefak pada satu waktu untuk kemajuan bertahap.

**Sintaks:**
```
/opsx:continue [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|------------|-----------|
| `change-name` | Tidak | Perubahan mana yang akan dilanjutkan (disimpulkan dari konteks jika tidak diberikan) |

**Apa yang dilakukan:**
- Mengkueri grafik ketergantungan artefak
- Menampilkan artefak mana yang siap vs yang diblokir
- Membuat artefak siap pertama
- Membaca file ketergantungan untuk konteks
- Menampilkan apa yang menjadi tersedia setelah pembuatan

**Contoh:**
```
You: /opsx:continue

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
- Baik untuk perubahan kompleks di mana Anda ingin kontrol
- Beberapa artefak mungkin menjadi siap secara bersamaan
- Anda dapat mengedit artefak yang dibuat sebelum melanjutkan

---

### `/opsx:ff`

Fast-forward melalui pembuatan artefak. Membuat semua artefak perencanaan sekaligus.

**Sintaks:**
```
/opsx:ff [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|------------|-----------|
| `change-name` | Tidak | Perubahan mana yang akan di-fast-forward (disimpulkan dari konteks jika tidak diberikan) |

**Apa yang dilakukan:**
- Membuat semua artefak dalam urutan ketergantungan
- Melacak kemajuan melalui daftar todo
- Berhenti ketika semua artefak `apply-required` selesai
- Membaca setiap ketergantungan sebelum membuat artefak berikutnya

**Contoh:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Tips:**
- Gunakan ketika Anda memiliki gambaran jelas tentang apa yang Anda bangun
- Lebih cepat daripada `/opsx:continue` untuk perubahan yang sederhana
- Anda tetap dapat mengedit artefak afterward
- Baik untuk fitur kecil hingga menengah

---

### `/opsx:apply`

Implementasikan tugas dari perubahan. Bekerja melalui daftar tugas, menulis kode dan mencentang item.

**Sintaks:**
```
/opsx:apply [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|------------|-----------|
| `change-name` | Tidak | Perubahan mana yang akan diimplementasikan (disimpulkan dari konteks jika tidak diberikan) |

**Apa yang dilakukan:**
- Membaca `tasks.md` dan mengidentifikasi tugas yang belum selesai
- Bekerja melalui tugas satu per satu
- Menulis kode, membuat file, menjalankan tes jika diperlukan
- Menandai tugas selesai dengan kotak centang `[x]`

**Contoh:**
```
You: /opsx:apply

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
- Dapat melanjutkan dari tempat Anda berhenti jika terhenti
- Gunakan untuk perubahan paralel dengan menentukan nama perubahan
- Status penyelesaian dilacak di kotak centang `tasks.md`

---

### `/opsx:update`

Revisi artefak perencanaan yang ada untuk perubahan dan jaga agar mereka selaras satu sama lain. Hanya artefak perencanaan - tidak pernah mengedit kode.

**Sintaks:**

```text
/opsx:update [change-name]
```

**Argumen:**

| Argumen | Diperlukan | Deskripsi |
|----------|------------|-----------|
| `change-name` | Tidak | Perubahan mana yang akan diperbarui (disimpulkan dari konteks jika tidak diberikan) |

**Apa yang dilakukan:**

- Membaca artefak perubahan melalui `openspec status --change <name> --json`
- Menerapkan revisi yang Anda minta, atau meninjau artefak untuk mencari kontradiksi jika Anda tidak menentukannya
- Menyelaraskan artefak lain yang ada dalam segala arah (edit desain mungkin memengaruhi kembali ke proposal)
- Mengkonfirmasi setiap edit dengan Anda sebelum menulis, satu artefak pada satu waktu
- Berakhir dengan merekomendasikan langkah berikutnya: `/opsx:continue` (artefak hilang), `/opsx:apply` (bawa rencana yang direvisi ke kode), atau `/opsx:archive` (semua selesai)

**Contoh:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Tips:**

- Tidak akan membuat artefak yang hilang - itu tugas `/opsx:continue`
- Jika perubahan sudah diimplementasikan, ikuti dengan `/opsx:apply` agar kode sesuai dengan rencana yang direvisi
- Jika revisi Anda mengubah *tujuan* perubahan, mulailah dari awal dengan perubahan baru sebagai gantinya (lihat [When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

Validasi bahwa implementasi sesuai dengan artefak perubahan Anda. Memeriksa kelengkapan, kebenaran, dan koherensi.

**Sintaks:**
```
/opsx:verify [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|------------|-----------|
| `change-name` | Tidak | Perubahan mana yang akan diverifikasi (disimpulkan dari konteks jika tidak diberikan) |

**Apa yang dilakukan:**
- Memeriksa tiga dimensi kualitas implementasi
- Mencari basis kode untuk bukti implementasi
- Melaporkan masalah yang dikategorikan sebagai KRITIS, PERINGATAN, atau SARAN
- Tidak memblokir arsip, tetapi menampilkan masalah

**Dimensi verifikasi:**

| Dimensi | Apa yang divalidasi |
|-----------|-------------------|
| **Kelengkapan** | Semua tugas selesai, semua persyaratan diimplementasikan, skenario tercakup |
| **Kebenaran** | Implementasi sesuai dengan tujuan spesifikasi, kasus tepi ditangani |
| **Koherensi** | Keputusan desain tercermin dalam kode, pola konsisten |

**Contoh:**
```
You: /opsx:verify

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
- Jalankan sebelum mengarsipkan untuk menangkap ketidakcocokan lebih awal
- Peringatan tidak memblokir arsip tetapi menunjukkan masalah potensial
- Baik untuk meninjau kerja AI sebelum melakukan commit
- Dapat mengungkapkan selisih antara artefak dan implementasi

---

### `/opsx:sync`

**Perintah opsional.** Gabungkan delta spesifikasi dari perubahan ke dalam spesifikasi utama. Arsip akan meminta untuk menyinkronkan jika diperlukan, jadi biasanya Anda tidak perlu menjalankannya secara manual.

**Sintaks:**
```
/opsx:sync [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|------------|-----------|
| `change-name` | Tidak | Perubahan mana yang akan disinkronkan (disimpulkan dari konteks jika tidak diberikan) |

**Apa yang dilakukan:**
- Membaca delta spesifikasi dari folder perubahan
- Menguraikan bagian ADDED/MODIFIED/REMOVED/RENAMED
- Menggabungkan perubahan ke direktori `openspec/specs/` utama
- Mempertahankan konten yang ada yang tidak disebutkan dalam delta
- Tidak mengarsipkan perubahan (tetap aktif)

**Contoh:**
```text
You: /opsx:sync

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

**Kapan menggunakan secara manual:**

| Skenario | Gunakan sinkronisasi? |
|----------|-----------|
| Perubahan jangka panjang, ingin spesifikasi di utama sebelum mengarsipkan | Ya |
| Beberapa perubahan paralel membutuhkan spesifikasi dasar yang diperbarui | Ya |
| Ingin melihat pratinjau/meninjau penggabungan secara terpisah | Ya |
| Perubahan cepat, langsung ke arsip | Tidak (arsip menanganinya) |

**Tips:**
- Sinkronisasi adalah cerdas, bukan salin-tempel
- Dapat menambahkan skenario ke persyaratan yang ada tanpa menduplikasi
- Perubahan tetap aktif setelah sinkronisasi (tidak diarsipkan)
- Sebagian besar pengguna tidak perlu memanggilnya secara langsung—arsip akan meminta jika diperlukan

---

### `/opsx:archive`

Arsipkan perubahan yang selesai. Menyelesaikan perubahan dan memindahkannya ke folder arsip.

**Sintaks:**
```
/opsx:archive [change-name]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|------------|-----------|
| `change-name` | Tidak | Perubahan mana yang akan diarsipkan (disimpulkan dari konteks jika tidak diberikan) |

**Apa yang dilakukan:**
- Memeriksa status penyelesaian artefak
- Memeriksa penyelesaian tugas (memperingatkan jika belum selesai)
- Menawarkan untuk menyinkronkan delta spesifikasi jika belum disinkronkan
- Memindahkan folder perubahan ke `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Mempertahankan semua artefak untuk jejak audit

**Contoh:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Tips:**
- Arsip tidak akan memblokir tugas yang belum selesai, tetapi akan memperingatkan
- Delta spesifikasi dapat disinkronkan selama pengarsipan atau sebelumnya
- Perubahan yang diarsipkan dipertahankan untuk riwayat
- Gunakan `/opsx:verify` terlebih dahulu untuk menangkap masalah

---

### `/opsx:bulk-archive`

Arsipkan beberapa perubahan yang selesai sekaligus. Menangani konflik spesifikasi antar perubahan.

**Sintaks:**
```
/opsx:bulk-archive [change-names...]
```

**Argumen:**
| Argumen | Diperlukan | Deskripsi |
|----------|------------|-----------|
| `change-names` | Tidak | Perubahan tertentu untuk diarsipkan (akan meminta memilih jika tidak diberikan) |

**Apa yang dilakukan:**
- Mencantumkan semua perubahan yang selesai
- Memvalidasi setiap perubahan sebelum mengarsipkan
- Mendeteksi konflik spesifikasi antar perubahan
- Menyelesaikan konflik dengan memeriksa apa yang sebenarnya diimplementasikan
- Mengarsipkan dalam urutan kronologis

**Contoh:**
```
You: /opsx:bulk-archive

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

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Tips:**
- Baik untuk aliran kerja paralel
- Penyelesaian konflik adalah agen (memeriksa basis kode)
- Perubahan diarsipkan dalam urutan pembuatan
- Meminta sebelum menimpa konten spesifikasi

---

### `/opsx:onboard`

Onboarding terpandu melalui alur kerja OpenSpec lengkap. Tutorial interaktif menggunakan basis kode Anda yang sebenarnya.

**Sintaks:**
```
/opsx:onboard
```

**Apa yang dilakukan:**
- Berjalan melalui siklus alur kerja lengkap dengan narasi
- Memindai basis kode Anda untuk peluang perbaikan yang nyata
- Membuat perubahan nyata dengan artefak nyata
- Mengimplementasikan pekerjaan nyata (perubahan kecil, aman)
- Mengarsipkan perubahan yang selesai
- Menjelaskan setiap langkah saat terjadi

**Fase:**
1. Selamat datang dan analisis basis kode
2. Mencari peluang perbaikan
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
You: /opsx:onboard

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
- Membuat perubahan nyata yang dapat Anda simpan atau buang
- Memerlukan waktu 15-30 menit untuk diselesaikan

## Sintaks Perintah Berdasarkan Alat AI

Berbagai alat AI menggunakan sintaks perintah yang sedikit berbeda. Gunakan format yang sesuai dengan alat yang Anda gunakan:

| Alat | Contoh Sintaks |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | Invokasi berbasis keterampilan seperti `/openspec-propose`, `/openspec-apply-change` (tidak ada file perintah `opsx-*` yang dihasilkan) |
| Codex | Invokasi berbasis keterampilan dari `.codex/skills/openspec-*` (tidak ada file prompt `opsx-*` yang dihasilkan) |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | Invokasi berbasis keterampilan seperti `/skill:openspec-propose`, `/skill:openspec-apply-change` (tidak ada file perintah `opsx-*` yang dihasilkan) |
| Trae | `/opsx-propose`, `/opsx-apply` |

Tujuan yang ingin dicapai sama di semua alat, tetapi cara perintah ditampilkan dapat berbeda tergantung integrasi.

> **Catatan:** Perintah GitHub Copilot (`.github/prompts/*.prompt.md`) hanya tersedia pada ekstensi IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI saat ini tidak mendukung file prompt kustom — lihat [Alat yang Didukung](supported-tools.md) untuk detail dan solusi permasalahan.

---

## Perintah Legasi

Perintah ini menggunakan alur kerja "semua sekaligus" yang lebih lama. Perintah ini masih berfungsi, tetapi perintah OPSX direkomendasikan.

| Perintah | Apa yang dilakukannya |
|---------|--------------|
| `/openspec:proposal` | Buat semua artefak sekaligus (proposal, spesifikasi, desain, tugas) |
| `/openspec:apply` | Implementasikan perubahan |
| `/openspec:archive` | Arsipkan perubahan |

**Kapan menggunakan perintah legasi:**
- Proyek yang sudah ada yang menggunakan alur kerja lama
- Perubahan sederhana di mana Anda tidak memerlukan pembuatan artefak bertahap
- Preferensi untuk pendekatan semua atau tidak sama sekali

**Migrasi ke OPSX:**
Perubahan legasi dapat dilanjutkan dengan perintah OPSX. Struktur artefaknya kompatibel.

---

## Pemecahan Masalah

### "Perubahan tidak ditemukan"

Perintah tidak dapat mengidentifikasi perubahan mana yang akan diproses.

**Solusi:**
- Tentukan nama perubahan secara eksplisit: `/opsx:apply add-dark-mode`
- Periksa apakah folder perubahan ada: `openspec list`
- Pastikan Anda berada di direktori proyek yang benar

### "Tidak ada artefak yang siap"

Semua artefak sudah selesai atau terblokir karena dependensi yang hilang.

**Solusi:**
- Jalankan `openspec status --change <name>` untuk melihat yang memblokir
- Periksa apakah artefak yang dibutuhkan ada
- Buat artefak dependensi yang hilang terlebih dahulu

### "Skema tidak ditemukan"

Skema yang ditentukan tidak ada.

**Solusi:**
- Tampilkan daftar skema yang tersedia: `openspec schemas`
- Periksa ejaan nama skema
- Buat skema jika itu adalah skema kustom: `openspec schema init <name>`

### Perintah tidak dikenali

Alat AI tidak mengenali perintah OpenSpec.

**Solusi:**
- Pastikan OpenSpec sudah diinisialisasi: `openspec init`
- Hasilkan ulang keterampilan: `openspec update`
- Periksa apakah direktori `.claude/skills/` ada (untuk Claude Code)
- Mulai ulang alat AI Anda untuk memuat keterampilan baru

### Artefak tidak dihasilkan dengan benar

AI membuat artefak yang tidak lengkap atau tidak benar.

**Solusi:**
- Tambahkan konteks proyek di `openspec/config.yaml`
- Tambahkan aturan per artefak untuk panduan yang lebih spesifik
- Berikan detail lebih banyak pada deskripsi perubahan Anda
- Gunakan `/opsx:continue` sebagai ganti `/opsx:ff` untuk kontrol yang lebih baik

---

## Langkah Selanjutnya

- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakan setiap perintah
- [CLI](cli.md) - Perintah terminal untuk manajemen dan validasi
- [Kustomisasi](customization.md) - Buat skema dan alur kerja kustom