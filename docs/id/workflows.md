# Alur Kerja

Panduan ini mencakup pola alur kerja umum untuk OpenSpec dan kapan menggunakan masing-masing pola. Untuk pengaturan dasar, lihat [Memulai](getting-started.md). Untuk referensi perintah, lihat [Perintah](commands.md).

## Filosofi: Aksi, Bukan Fase

Alur kerja tradisional memaksa Anda melewati fase: perencanaan, lalu implementasi, lalu selesai. Tetapi pekerjaan nyata tidak pas dengan kotak-kotak tersebut.

OPSX mengambil pendekatan yang berbeda:

```text
Tradisional (terkunci fase):

  PERENCANAAN ────────► IMPLEMENTASI ────────► SELESAI
      │                    │
      │   "Tidak bisa kembali"  │
      └────────────────────┘

OPSX (aksi yang mengalir):

  proposal ──► spesifikasi ──► desain ──► tugas ──► implementasi
```

**Prinsip-prinsip utama:**

- **Aksi, bukan fase** - Perintah adalah hal yang dapat Anda lakukan, bukan tahapan yang membuat Anda terjebak
- **Dependensi adalah pemberdaya** - Mereka menunjukkan apa yang mungkin, bukan apa yang wajib dilakukan selanjutnya

> **Kustomisasi:** Alur kerja OPSX didorong oleh skema yang mendefinisikan sekuens artefak. Lihat [Kustomisasi](customization.md) untuk detail tentang membuat skema kustom.

## Dua Mode

### Jalur Cepat Default (profil `core`)

Instalasi baru secara default menggunakan `core`, yang menyediakan:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Alur kerja umum:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### Alur Kerja Diperluas/Lengkap (pilihan kustom)

Jika Anda menginginkan perintah scaffold-and-build eksplisit (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), aktifkan dengan:

```bash
openspec config profile
openspec update
```

## Pola Alur Kerja (Mode Diperluas)

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

AI:  Mengerjakan tugas...
     ✓ Menambahkan tombol logout ke header
     ✓ Mengimplementasikan penghapusan sesi
     ✓ Menambahkan dialog konfirmasi
     Semua tugas selesai!

Anda: /opsx:archive

AI:  ✓ Menggabungkan spesifikasi
     ✓ Mengarsipkan perubahan
```

**Paling cocok untuk:** Fitur kecil hingga sedang, perbaikan bug, perubahan langsung.

### Eksplorasi

Ketika persyaratan tidak jelas atau Anda perlu menyelidiki terlebih dahulu:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Contoh percakapan:**

```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda eksplorasi?

Anda: Saya ingin meningkatkan performa pemuatan halaman tetapi saya tidak yakin
     di mana hambatannya.

AI:  Biarkan saya bantu menyelidiki...
     [Menganalisis ukuran bundel, mengidentifikasi kueri lambat, meninjau
     pola render komponen]

     Saya menemukan tiga hambatan utama:
     1. Gambar besar yang tidak dioptimalkan
     2. Pengambilan data sinkron di ProductList
     3. Render ulang dari perubahan konteks

     Mana yang ingin Anda tangani terlebih dahulu?

Anda: Mari kita atasi masalah pengambilan data.

Anda: /opsx:new optimize-product-list-fetching

AI:  Membuat perubahan. Siap membuat: proposal

Anda: /opsx:continue

AI:  Membuat proposal berdasarkan eksplorasi kita...
     [Menulis proposal yang menggabungkan wawasan investigasi]

     Siap membuat: spesifikasi, desain
     Mana yang Anda inginkan selanjutnya?

Anda: /opsx:continue

AI:  Membuat spesifikasi...
```

**Paling cocok untuk:** Optimasi performa, debugging, keputusan arsitektur, persyaratan yang tidak jelas.

### Perubahan Paralel

Bekerja pada beberapa perubahan sekaligus:

```text
Perubahan A: /opsx:new ──► /opsx:ff ──► /opsx:apply (sedang berlangsung)
                                         │
                                    beralih konteks
                                         │
Perubahan B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Contoh percakapan:**

```text
Anda: Saya sedang mengerjakan add-dark-mode tetapi tertarik pada perbaikan bug

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

Anda: Mari kita kembali ke mode gelap

Anda: /opsx:apply add-dark-mode

AI:  Melanjutkan add-dark-mode...
     Melanjutkan di tugas 2.3: Memperbarui Header...
```

**Paling cocok untuk:** Alur kerja paralel, interupsi mendesak, kolaborasi tim.

Ketika Anda memiliki beberapa perubahan yang selesai, gunakan `/opsx:bulk-archive`:

```text
Anda: /opsx:bulk-archive

AI:  Menemukan 3 perubahan yang selesai:
     - add-dark-mode (semua tugas selesai)
     - fix-login-redirect (semua tugas selesai)
     - update-footer (semua tugas selesai)

     Memeriksa konflik spesifikasi...
     ⚠ add-dark-mode dan update-footer keduanya menyentuh specs/ui/

     Memeriksa basis kode untuk menyelesaikan...
     Kedua perubahan telah diimplementasikan. Akan diterapkan dalam urutan kronologis.

     Arsipkan semua 3 perubahan?

Anda: Ya

AI:  ✓ Mengarsipkan add-dark-mode
     ✓ Mengarsipkan fix-login-redirect
     ✓ Mengarsipkan update-footer
     Spesifikasi digabungkan dalam urutan: add-dark-mode → update-footer
```

Arsip massal mendeteksi ketika beberapa perubahan menyentuh spesifikasi yang sama dan menyelesaikan konflik dengan memeriksa apa yang benar-benar diimplementasikan.

### Menyelesaikan Perubahan

Alur penyelesaian yang direkomendasikan:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              memvalidasi         meminta untuk menyinkronkan
              implementasi        jika diperlukan
```

#### Verifikasi: Periksa Pekerjaan Anda

`/opsx:verify` memvalidasi implementasi terhadap artefak Anda di tiga dimensi:

```text
Anda: /opsx:verify

AI:  Memverifikasi add-auth...

     KELENGKAPAN
     ✓ Semua 12 tugas di tasks.md telah diperiksa
     ✓ Semua persyaratan dalam spesifikasi memiliki kode yang sesuai
     ⚠ Skenario "Sesi habis setelah tidak aktif" belum diuji

     KEBENARAN
     ✓ Implementasi sesuai dengan maksud spesifikasi
     ✓ Kasus ujung dari skenario ditangani
     ✓ Status kesalahan sesuai dengan definisi spesifikasi

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
     1. Tambahkan tes untuk skenario sesi habis
     2. Pertimbangkan untuk memfaktorkan ulang ke event-driven seperti yang dirancang, atau perbarui design.md
```

**Apa yang diperiksa verifikasi:**

| Dimensi | Apa yang divalidasi |
|---------|---------------------|
| Kelengkapan | Semua tugas selesai, semua persyaratan diimplementasikan, skenario tercakup |
| Kebenaran | Implementasi sesuai dengan maksud spesifikasi, kasus ujung ditangani |
| Koherensi | Keputusan desain tercermin dalam kode, pola konsisten |

Verifikasi tidak akan memblokir pengarsipan, tetapi menyoroti masalah yang mungkin ingin Anda tangani terlebih dahulu.

#### Arsip: Finalisasi Perubahan

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

AI:  ✓ Menyinkronkan spesifikasi ke openspec/specs/auth/spec.md
     ✓ Dipindahkan ke openspec/changes/archive/2025-01-24-add-auth/

     Perubahan berhasil diarsipkan.
```

Arsip akan meminta jika spesifikasi belum disinkronkan. Ini tidak akan memblokir tugas yang belum selesai, tetapi akan memperingatkan Anda.

## Kapan Menggunakan Apa

### `/opsx:ff` vs `/opsx:continue`

| Situasi | Gunakan |
|---------|---------|
| Persyaratan jelas, siap membangun | `/opsx:ff` |
| Mengeksplorasi, ingin meninjau setiap langkah | `/opsx:continue` |
| Ingin mengulang proposal sebelum spesifikasi | `/opsx:continue` |
| Tekanan waktu, perlu bergerak cepat | `/opsx:ff` |
| Perubahan kompleks, ingin kontrol | `/opsx:continue` |

**Aturan praktis:** Jika Anda dapat menggambarkan ruang lingkup penuh di muka, gunakan `/opsx:ff`. Jika Anda mengetahuinya saat berjalan, gunakan `/opsx:continue`.

### Kapan Memperbarui vs Memulai dari Awal

Pertanyaan umum: kapan memperbarui perubahan yang ada itu baik, dan kapan Anda harus memulai yang baru?

**Perbarui perubahan yang ada ketika:**

- Maksud yang sama, eksekusi yang disempurnakan
- Ruang lingkup menyempit (MVP dulu, sisanya nanti)
- Koreksi berbasis pembelajaran (basis kode tidak seperti yang Anda harapkan)
- Penyesuaian desain berdasarkan temuan implementasi

**Mulai perubahan baru ketika:**

- Maksud berubah secara fundamental
- Ruang lingkup meledak ke pekerjaan yang sama sekali berbeda
- Perubahan asli dapat ditandai "selesai" secara mandiri
- Patch akan membingungkan lebih dari memperjelas

```text
                     ┌─────────────────────────────────────┐
                     │     Apakah ini pekerjaan yang sama? │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Maksud sama?      >50% tumpang tindih?  Bisakah asli
          Masalah sama?     Ruang lingkup sama?   "selesai" tanpa
                 │                  │          perubahan ini?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YA               TIDAK YA         TIDAK TIDAK           YA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    PERBARUI          BARU PERBARUI     BARU PERBARUI        BARU
```

**Contoh: "Tambahkan mode gelap"**

- "Perlu juga mendukung tema kustom" → Perubahan baru (ruang lingkup meledak)
- "Deteksi preferensi sistem lebih sulit dari yang diharapkan" → Perbarui (maksud sama)
- "Mari kita kirim toggle dulu, tambahkan preferensi nanti" → Perbarui lalu arsipkan, lalu perubahan baru

## Praktik Terbaik

### Pertahankan Perubahan Terfokus

Satu unit logika pekerjaan per perubahan. Jika Anda melakukan "tambahkan fitur X dan juga refaktor Y", pertimbangkan dua perubahan terpisah.

**Mengapa ini penting:**
- Lebih mudah ditinjau dan dipahami
- Riwayat arsip lebih bersih
- Dapat dikirim secara independen
- Rollback lebih sederhana jika diperlukan

### Gunakan `/opsx:explore` untuk Persyaratan yang Tidak Jelas

Sebelum berkomitmen pada perubahan, eksplorasi ruang masalah:

```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda eksplorasi?

Anda: Bagaimana kita seharusnya menangani pembatasan laju untuk API kita?

AI:  Biarkan saya menyelidiki pengaturan dan opsi Anda saat ini...
     [Meneliti basis kode, mempertimbangkan pola]

     Saya melihat tiga pendekatan yang bisa kita ambil:
     1. Berbasis middleware (sederhana, per-endpoint)
     2. Didukung Redis (skalabel, status bersama)
     3. Ember token per pengguna (adil, kompleks)

     Tumpukan teknologi Anda saat ini menyarankan #1 atau #2. Berapa skala Anda?
```

Eksplorasi memperjelas pemikiran sebelum Anda membuat artefak.

### Verifikasi Sebelum Mengarsipkan

Gunakan `/opsx:verify` untuk memeriksa implementasi sesuai dengan artefak:

```text
Anda: /opsx:verify

AI:  Memverifikasi add-dark-mode...

     ✓ Semua tugas di tasks.md telah diperiksa
     ✓ Persyaratan dalam spesifikasi memiliki kode yang sesuai
     ✓ Keputusan desain tercermin dalam implementasi

     Siap diarsipkan!
```

Menangkap ketidakcocokan sebelum Anda menutup perubahan.

### Beri Nama Perubahan dengan Jelas

Nama yang baik membuat `openspec list` berguna:

```text
Baik:                          Hindari:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Referensi Cepat Perintah

Untuk detail lengkap perintah dan opsi, lihat [Perintah](commands.md).

| Perintah | Tujuan | Kapan Digunakan |
|----------|--------|-----------------|
| `/opsx:propose` | Buat perubahan + artefak perencanaan | Jalur default cepat (profil `core`) |
| `/opsx:explore` | Pikirkan ide-ide | Kebutuhan tidak jelas, investigasi |
| `/opsx:new` | Mulai kerangka perubahan | Mode diperluas, kontrol artefak eksplisit |
| `/opsx:continue` | Buat artefak berikutnya | Mode diperluas, pembuatan artefak langkah demi langkah |
| `/opsx:ff` | Buat semua artefak perencanaan | Mode diperluas, ruang lingkup jelas |
| `/opsx:apply` | Implementasikan tugas | Siap menulis kode |
| `/opsx:verify` | Validasi implementasi | Mode diperluas, sebelum pengarsipan |
| `/opsx:sync` | Gabungkan spesifikasi delta | Mode diperluas, opsional |
| `/opsx:archive` | Selesaikan perubahan | Semua pekerjaan selesai |
| `/opsx:bulk-archive` | Arsipkan beberapa perubahan | Mode diperluas, pekerjaan paralel |

## Langkah Selanjutnya

- [Perintah](commands.md) - Referensi perintah lengkap dengan opsi
- [Konsep](concepts.md - Penjelasan mendalam tentang spesifikasi, artefak, dan skema
- [Kustomisasi](customization.md) - Buat alur kerja kustom