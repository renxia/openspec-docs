# Alur Kerja

Panduan ini mencakup pola alur kerja umum untuk OpenSpec dan kapan harus menggunakan masing-masing. Untuk pengaturan dasar, lihat [Memulai](getting-started.md). Untuk referensi perintah, lihat [Perintah](commands.md).

## Filosofi: Tindakan, Bukan Fase

Alur kerja tradisional memaksa Anda melalui fase: perencanaan, kemudian implementasi, lalu selesai. Tetapi pekerjaan nyata tidak cocok dengan kotak-kotak yang kaku.

OPSX mengambil pendekatan yang berbeda:

```text
Tradisional (terkunci fase):

  PERENCANAAN ────────► IMPLEMENTASI ────────► SELESAI
      │                    │
      │   "Tidak bisa kembali"  │
      └────────────────────┘

OPSX (tindakan fleksibel):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Prinsip utama:**

- **Tindakan, bukan fase** - Perintah adalah hal yang dapat Anda lakukan, bukan tahapan di mana Anda terjebak
- **Ketergantungan adalah pemberi kemampuan** - Ketergantungan menunjukkan apa yang mungkin dilakukan, bukan apa yang harus dilakukan selanjutnya

> **Kustomisasi:** Alur kerja OPSX didorong oleh skema yang mendefinisikan urutan artefak. Lihat [Kustomisasi](customization.md) untuk detail tentang membuat skema kustom.

## Dua Mode

### Jalur Cepat Default (profil `core`)

Instalasi baru secara default menggunakan `core`, yang menyediakan:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

Alur umum:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### Alur Kerja Lengkap (pilihan kustom)

Jika Anda menginginkan perintah scaffolding-and-build yang eksplisit (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), aktifkan dengan:

```bash
openspec config profile
openspec update
```

## Pola Alur Kerja (Mode Lengkap)

### Fitur Cepat

Ketika Anda tahu apa yang ingin dibangun dan hanya perlu mengeksekusi:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Contoh percakapan:**

```text
Anda: /opsx:new add-logout-button

AI:  Membuat openspec/changes/add-logout-button/
     Siap membuat: proposal

Anda: /opsx:ff

AI:  Membuat semua artefak perencanaan...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Siap untuk implementasi!

Anda: /opsx:apply

AI:  Mengerjakan tugas-tugas...
     ✓ Menambahkan tombol logout ke header
     ✓ Mengimplementasikan pembersihan sesi
     ✓ Menambahkan dialog konfirmasi
     Semua tugas selesai!

Anda: /opsx:archive

AI:  ✓ Menggabungkan spesifikasi
     ✓ Mengarsipkan perubahan
```

**Cocok untuk:** Fitur kecil hingga menengah, perbaikan bug, perubahan sederhana.

### Eksploratif

Ketika persyaratan tidak jelas atau Anda perlu menyelidiki terlebih dahulu:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Contoh percakapan:**

```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda eksplorasi?

Anda: Saya ingin meningkatkan performa pemuatan halaman tetapi tidak yakin
     di mana bottleneck-nya.

AI:  Biarkan saya membantu menyelidiki...
     [Menganalisis ukuran bundle, mengidentifikasi query lambat, meninjau
     pola render komponen]

     Saya menemukan tiga bottleneck utama:
     1. Gambar besar yang belum dioptimalkan
     2. Pengambilan data sinkron di ProductList
     3. Render ulang dari perubahan context

     Mana yang ingin Anda atasi terlebih dahulu?

Anda: Mari kita tangani masalah pengambilan data.

Anda: /opsx:new optimize-product-list-fetching

AI:  Perubahan dibuat. Siap membuat: proposal

Anda: /opsx:continue

AI:  Membuat proposal berdasarkan eksplorasi kita...
     [Menulis proposal yang menggabungkan wawasan investigasi]

     Siap membuat: spesifikasi, desain
     Mana yang ingin Anda buat selanjutnya?

Anda: /opsx:continue

AI:  Membuat spesifikasi...
```

**Cocok untuk:** Optimasi performa, debugging, keputusan arsitektural, persyaratan yang tidak jelas.

### Perubahan Paralel

Bekerja pada beberapa perubahan sekaligus:

```text
Perubahan A: /opsx:new ──► /opsx:ff ──► /opsx:apply (sedang berlangsung)
                                         │
                                    pergantian konteks
                                         │
Perubahan B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Contoh percakapan:**

```text
Anda: Saya sedang mengerjakan add-dark-mode tetapi diminta untuk memperbaiki bug

Anda: /opsx:new fix-login-redirect

AI:  Membuat openspec/changes/fix-login-redirect/

Anda: /opsx:ff

AI:  ✓ Membuat artefak perencanaan

Anda: /opsx:apply

AI:  Mengerjakan fix-login-redirect...
     [Mengimplementasikan perbaikan]
     Semua tugas selesai!

Anda: /opsx:archive

AI:  ✓ Mengarsipkan fix-login-redirect

Anda: Mari kita kembali ke dark mode

Anda: /opsx:apply add-dark-mode

AI:  Melanjutkan add-dark-mode...
     Melanjutkan dari tugas 2.3: Memperbarui Header...
```

**Cocok untuk:** Alur kerja paralel, interupsi mendesak, kolaborasi tim.

Ketika Anda memiliki beberapa perubahan yang selesai, gunakan `/opsx:bulk-archive`:

```text
Anda: /opsx:bulk-archive

AI:  Ditemukan 3 perubahan yang selesai:
     - add-dark-mode (semua tugas selesai)
     - fix-login-redirect (semua tugas selesai)
     - update-footer (semua tugas selesai)

     Memeriksa konflik spesifikasi...
     ⚠ add-dark-mode dan update-footer keduanya menyentuh specs/ui/

     Memeriksa kode sumber untuk menyelesaikan...
     Kedua perubahan telah diimplementasikan. Akan diterapkan secara kronologis.

     Arsipkan semua 3 perubahan?

Anda: Ya

AI:  ✓ Mengarsipkan add-dark-mode
     ✓ Mengarsipkan fix-login-redirect
     ✓ Mengarsipkan update-footer
     Spesifikasi digabungkan dalam urutan: add-dark-mode → update-footer
```

Arsip massal mendeteksi ketika beberapa perubahan menyentuh spesifikasi yang sama dan menyelesaikan konflik dengan memeriksa apa yang sebenarnya diimplementasikan.

### Menyelesaikan Perubahan

Alur penyelesaian yang direkomendasikan:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              memvalidasi          meminta untuk sync
              implementasi         jika diperlukan
```

#### Verifikasi: Periksa Pekerjaan Anda

`/opsx:verify` memvalidasi implementasi terhadap artefak Anda dalam tiga dimensi:

```text
Anda: /opsx:verify

AI:  Memverifikasi add-auth...

     KELENGKAPAN
     ✓ Semua 12 tugas di tasks.md telah ditandai
     ✓ Semua persyaratan di spesifikasi memiliki kode yang sesuai
     ⚠ Skenario "Sesi timeout setelah tidak aktif" belum diuji

     KEBENARAN
     ✓ Implementasi sesuai dengan tujuan spesifikasi
     ✓ Kasus batas dari skenario telah ditangani
     ✓ Status error sesuai dengan definisi spesifikasi

     KOHERENSI
     ✓ Keputusan desain tercermin dalam struktur kode
     ✓ Konvensi penamaan konsisten dengan design.md
     ⚠ Desain menyebutkan "event-driven" tetapi implementasi menggunakan polling

     RINGKASAN
     ─────────────────────────────
     Masalah kritis: 0
     Peringatan: 2
     Siap diarsipkan: Ya (dengan peringatan)

     Rekomendasi:
     1. Tambahkan pengujian untuk skenario timeout sesi
     2. Pertimbangkan untuk refactor ke event-driven sesuai desain, atau perbarui design.md
```

**Apa yang diperiksa oleh verifikasi:**

| Dimensi | Apa yang divalidasi |
|-----------|------------------|
| Kelengkapan | Semua tugas selesai, semua persyaratan diimplementasikan, skenario tercakup |
| Kebenaran | Implementasi sesuai dengan tujuan spesifikasi, kasus batas ditangani |
| Koherensi | Keputusan desain tercermin dalam kode, pola konsisten |

Verifikasi tidak akan memblokir arsip, tetapi akan menampilkan masalah yang mungkin ingin Anda tangani terlebih dahulu.

#### Arsipkan: Finalisasi Perubahan

`/opsx:archive` menyelesaikan perubahan dan memindahkannya ke arsip:

```text
Anda: /opsx:archive

AI:  Mengarsipkan add-auth...

     Status artefak:
     ✓ proposal.md ada
     ✓ specs/ ada
     ✓ design.md ada
     ✓ tasks.md ada (12/12 tugas selesai)

     Spesifikasi delta: Belum disinkronkan ke main
     → Apakah Anda ingin menyinkronkan sekarang?

Anda: Ya

AI:  ✓ Spesifikasi disinkronkan ke openspec/specs/auth/spec.md
     ✓ Dipindahkan ke openspec/changes/archive/2025-01-24-add-auth/

     Perubahan berhasil diarsipkan.
```

Arsip akan meminta jika spesifikasi belum disinkronkan. Ini tidak akan memblokir tugas yang belum selesai, tetapi akan memperingatkan Anda.

## Kapan Menggunakan Apa

### `/opsx:ff` vs `/opsx:continue`

| Situasi | Gunakan |
|-----------|-----|
| Persyaratan jelas, siap membangun | `/opsx:ff` |
| Eksplorasi, ingin meninjau setiap langkah | `/opsx:continue` |
| Ingin iterasi pada proposal sebelum spesifikasi | `/opsx:continue` |
| Tekanan waktu, perlu bergerak cepat | `/opsx:ff` |
| Perubahan kompleks, ingin kendali | `/opsx:continue` |

**Aturan praktis:** Jika Anda dapat mendeskripsikan cakupan penuh di awal, gunakan `/opsx:ff`. Jika Anda menentukannya seiring berjalannya, gunakan `/opsx:continue`.

### Kapan Memperbarui vs Memulai Baru

Pertanyaan umum: kapan memperbarui perubahan yang ada itu baik, dan kapan harus memulai yang baru?

**Perbarui perubahan yang ada ketika:**

- Tujuan sama, eksekusi disempurnakan
- Cakupan menyusut (MVP dulu, sisanya nanti)
- Koreksi berdasarkan pembelajaran (kode sumber tidak seperti yang Anda harapkan)
- Penyesuaian desain berdasarkan temuan implementasi

**Mulai perubahan baru ketika:**

- Tujuan berubah mendasar
- Cakupan meledak menjadi pekerjaan yang sama sekali berbeda
- Perubahan asli dapat ditandai "selesai" secara mandiri
- Patch akan lebih membingungkan daripada menjelaskan

```text
                     ┌─────────────────────────────────────┐
                     │     Apakah ini pekerjaan yang sama? │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Tujuan sama?      Tumpang tindih >50%?   Apakah asli
          Masalah sama?     Cakupan sama?          bisa "selesai" tanpa
                 │                  │              perubahan ini?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YA                TIDAK YA          TIDAK TIDAK          YA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    PERBARUI          BARU PERBARUI     BARU PERBARUI        BARU
```

**Contoh: "Tambahkan dark mode"**

- "Perlu juga mendukung tema kustom" → Perubahan baru (cakupan meledak)
- "Deteksi preferensi sistem lebih sulit dari yang diharapkan" → Perbarui (tujuan sama)
- "Mari kita rilis toggle dulu, tambahkan preferensi nanti" → Perbarui lalu arsipkan, lalu perubahan baru

## Praktik Terbaik

### Jaga Perubahan Tetap Fokus

Satu unit logis pekerjaan per perubahan. Jika Anda melakukan "tambahkan fitur X dan juga refactor Y", pertimbangkan dua perubahan terpisah.

**Mengapa ini penting:**
- Lebih mudah ditinjau dan dipahami
- Riwayat arsip lebih bersih
- Dapat dirilis secara independen
- Lebih mudah di-rollback jika diperlukan

### Gunakan `/opsx:explore` untuk Persyaratan yang Tidak Jelas

Sebelum berkomitmen pada perubahan, eksplorasi ruang masalah:

```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda eksplorasi?

Anda: Bagaimana kita harus menangani rate limiting untuk API kita?

AI:  Biarkan saya menyelidiki pengaturan dan opsi Anda saat ini...
     [Meneliti kode sumber, mempertimbangkan pola]

     Saya melihat tiga pendekatan yang bisa kita ambil:
     1. Berbasis middleware (sederhana, per-endpoint)
     2. Berbasis Redis (skalabel, status bersama)
     3. Token bucket per pengguna (adil, kompleks)

     Stack Anda saat ini menunjukkan #1 atau #2. Berapa skala Anda?
```

Eksplorasi memperjelas pemikiran sebelum Anda membuat artefak.

### Verifikasi Sebelum Mengarsipkan

Gunakan `/opsx:verify` untuk memeriksa implementasi sesuai dengan artefak:

```text
Anda: /opsx:verify

AI:  Memverifikasi add-dark-mode...

     ✓ Semua tugas di tasks.md telah ditandai
     ✓ Persyaratan di spesifikasi memiliki kode yang sesuai
     ✓ Keputusan desain tercermin dalam implementasi

     Siap diarsipkan!
```

Mendeteksi ketidakcocokan sebelum Anda menutup perubahan.

### Beri Nama Perubahan dengan Jelas

Nama yang baik membuat `openspec list` berguna:

```text`
Baik:                          Hindari:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Referensi Cepat Perintah

Untuk detail lengkap perintah dan opsi, lihat [Perintah](commands.md).

| Perintah | Tujuan | Kapan Digunakan |
|---------|--------|-----------------|
| `/opsx:propose` | Membuat perubahan + artefak perencanaan | Jalur default cepat (profil `core`) |
| `/opsx:explore` | Merenungkan ide | Persyaratan tidak jelas, investigasi |
| `/opsx:new` | Memulai kerangka perubahan | Mode yang diperluas, kontrol artefak eksplisit |
| `/opsx:continue` | Membuat artefak berikutnya | Mode yang diperluas, pembuatan artefak langkah demi langkah |
| `/opsx:ff` | Membuat semua artefak perencanaan | Mode yang diperluas, cakupan jelas |
| `/opsx:apply` | Menerapkan tugas | Siap menulis kode |
| `/opsx:verify` | Memvalidasi implementasi | Mode yang diperluas, sebelum pengarsipan |
| `/opsx:sync` | Menggabungkan spesifikasi delta | Mode yang diperluas, opsional |
| `/opsx:archive` | Menyelesaikan perubahan | Semua pekerjaan selesai |
| `/opsx:bulk-archive` | Mengarsipkan beberapa perubahan | Mode yang diperluas, pekerjaan paralel |

## Langkah Selanjutnya

- [Perintah](commands.md) - Referensi lengkap perintah dengan opsi
- [Konsep](concepts.md) - Penjelasan mendalam tentang spesifikasi, artefak, dan skema
- [Kustomisasi](customization.md) - Membuat alur kerja kustom