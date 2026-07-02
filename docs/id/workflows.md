# Alur Kerja

Panduan ini mencakup pola alur kerja umum untuk OpenSpec dan kapan harus menggunakan masing-masingnya. Untuk pengaturan dasar, lihat [Getting Started](getting-started.md). Untuk referensi perintah, lihat [Commands](commands.md).

## Filosofi: Tindakan, Bukan Fase

Alur kerja tradisional memaksa Anda melalui fase-fase: perencanaan, kemudian implementasi, kemudian selesai. Namun, pekerjaan nyata tidak selalu pas ke dalam kotak yang ditentukan.

OPSX mengambil pendekatan yang berbeda:

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Prinsip Utama:**

- **Tindakan, bukan fase** - Perintah adalah hal yang dapat Anda lakukan, bukan tahapan di mana Anda terjebak
- **Ketergantungan (Dependencies) adalah pemungkin** - Mereka menunjukkan apa yang mungkin, bukan apa yang diperlukan selanjutnya

> **Kustomisasi:** Alur kerja OPSX didorong oleh skema yang mendefinisikan urutan artefak. Lihat [Customization](customization.md) untuk detail tentang pembuatan skema kustom.

## Dua Mode

### Jalur Cepat Standar (`core` profile)

Instalasi baru secara default menggunakan `core`, yang menyediakan:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Alur kerja tipikal:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (optional)
```

#### Mulai dengan Eksplorasi (kebiasaan yang perlu dibentuk)

`/opsx:explore` adalah bagian dari profil standar, bukan tambahan lanjutan. Ini adalah langkah yang harus diambil kapan pun Anda memiliki masalah tetapi belum memiliki rencana, dan ini sering terjadi ketika menggunakan asisten AI.

```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda eksplorasi?

Anda: Hasil pencarian kami terasa usang. Saya tidak yakin apakah itu karena caching,
     pengindeksan, atau kueri itu sendiri.

AI:  Biar saya lihat... [membaca layanan pencarian dan lapisan cache]
     Ini masalah indeks: ia hanya dibangun ulang setiap malam, jadi perubahan
     tidak muncul sampai hari berikutnya. Ada dua pilihan: bangun saat penulisan (sederhana,
     lebih banyak beban) atau pembatalan cache TTL pendek (lebih banyak bagian yang bergerak,
     beban lebih ringan). Mengingat volume penulisan Anda rendah, pembangunan ulang saat penulisan adalah
     perbaikan yang lebih bersih. Ingin mempersempikannya?

Anda: Ya.

Anda: /opsx:propose rebuild-search-index-on-write
```

Eksplorasi tidak menghasilkan artefak dan tidak menulis kode. Ini adalah percakapan bebas tanpa risiko yang mengubah kekhawatiran samar menjadi perubahan yang tepat, sehingga proposal yang mengikutinya tajam. Sudah tahu persis apa yang Anda inginkan? Lewati dan langsung menuju ke `/opsx:propose`. Panduan lengkap: [Explore First](explore.md).

### Alur Kerja Lengkap/Diperluas (pilihan kustom)

Jika Anda menginginkan perintah *scaffold* dan *build* yang eksplisit (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), aktifkan dengan:

```bash
openspec config profile
openspec update
```

## Pola Alur Kerja (Mode Diperluas)

### Fitur Cepat

Ketika Anda tahu apa yang ingin dibangun dan hanya perlu mengeksekusinya:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Contoh percakapan:**

```text
Anda: /opsx:new add-logout-button

AI:  Telah membuat openspec/changes/add-logout-button/
     Siap untuk membuat: proposal

Anda: /opsx:ff

AI:  Membuat semua artefak perencanaan...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Siap untuk implementasi!

Anda: /opsx:apply

AI:  Mengerjakan tugas-tugas...
     ✓ Menambahkan tombol keluar ke header
     ✓ Mengimplementasikan penghapusan sesi
     ✓ Menambahkan dialog konfirmasi
     Semua tugas selesai!

Anda: /opsx:archive

AI:  ✓ Merging specs
     ✓ Mengarsipkan perubahan
```

**Paling baik untuk:** Fitur kecil hingga menengah, perbaikan bug, perubahan yang lugas.

### Eksploratif

Ketika persyaratan tidak jelas atau Anda perlu menyelidiki terlebih dahulu:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Contoh percakapan:**

```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda eksplorasi?

Anda: Saya ingin meningkatkan kinerja pemuatan halaman tetapi saya tidak yakin di mana letak hambatan utamanya.

AI:  Biar saya bantu menyelidiki...
     [Menganalisis ukuran bundel, mengidentifikasi kueri lambat, meninjau pola render komponen]

     Saya menemukan tiga hambatan utama:
     1. Gambar besar yang tidak dioptimalkan
     2. Pengambilan data sinkron di ProductList
     3. Re-render dari perubahan konteks

     Mana yang ingin Anda tangani terlebih dahulu?

Anda: Mari kita tangani masalah pengambilan data.

Anda: /opsx:new optimize-product-list-fetching

AI:  Telah membuat perubahan. Siap untuk membuat: proposal

Anda: /opsx:continue

AI:  Membuat proposal berdasarkan eksplorasi kami...
     [Menulis proposal yang menggabungkan wawasan investigasi]

     Siap untuk membuat: specs, desain
     Mana yang ingin Anda lakukan selanjutnya?

Anda: /opsx:continue

AI:  Membuat specs...
```

**Paling baik untuk:** Optimasi kinerja, debugging, keputusan arsitektur, persyaratan yang tidak jelas.

### Perubahan Paralel

Bekerja pada beberapa perubahan sekaligus:

```text
Perubahan A: /opsx:new ──► /opsx:ff ──► /opsx:apply (sedang berlangsung)
                                         │
                                    ganti konteks
                                         │
Perubahan B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Contoh percakapan:**

```text
Anda: Saya sedang mengerjakan add-dark-mode tetapi terganggu oleh perbaikan bug

Anda: /opsx:new fix-login-redirect

AI:  Telah membuat openspec/changes/fix-login-redirect/

Anda: /opsx:ff

AI:  ✓ Artefak perencanaan dibuat

Anda: /opsx:apply

AI:  Mengerjakan fix-login-redirect...
     [Mengimplementasikan perbaikan]
     Semua tugas selesai!

Anda: /opsx:archive

AI:  ✓ Mengarsipkan fix-login-redirect

Anda: Mari kita kembali ke dark mode

Anda: /opsx:apply add-dark-mode

AI:  Melanjutkan add-dark-mode...
     Melanjutkan pada tugas 2.3: Perbarui Header...
```

**Paling baik untuk:** Alur kerja paralel, interupsi mendesak, kolaborasi tim.

Ketika Anda memiliki beberapa perubahan yang telah selesai, gunakan `/opsx:bulk-archive`:

```text
Anda: /opsx:bulk-archive

AI:  Ditemukan 3 perubahan yang selesai:
     - add-dark-mode (semua tugas selesai)
     - fix-login-redirect (semua tugas selesai)
     - update-footer (semua tugas selesai)

     Memeriksa konflik spesifikasi...
     ⚠ add-dark-mode dan update-footer keduanya menyentuh specs/ui/

     Menginspeksi codebase untuk menyelesaikan...
     Kedua perubahan telah diimplementasikan. Akan diterapkan dalam urutan kronologis.

     Arsipkan ketiga perubahan?

Anda: Ya

AI:  ✓ Mengarsipkan add-dark-mode
     ✓ Mengarsipkan fix-login-redirect
     ✓ Mengarsipkan update-footer
     Specs digabungkan dalam urutan: add-dark-mode → update-footer
```

Bulk archive mendeteksi ketika beberapa perubahan menyentuh spesifikasi yang sama dan menyelesaikan konflik dengan memeriksa apa yang sebenarnya diimplementasikan.

### Menyelesaikan Perubahan

Alur penyelesaian yang direkomendasikan:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              memvalidasi          mengingatkan untuk sinkronisasi
              implementasi     jika diperlukan
```

#### Verifikasi: Periksa Pekerjaan Anda

`/opsx:verify` memvalidasi implementasi terhadap artefak Anda dalam tiga dimensi:

```text
Anda: /opsx:verify

AI:  Memverifikasi add-auth...

     KELENGKAPAN (COMPLETENESS)
     ✓ Semua 12 tugas di tasks.md telah diperiksa
     ✓ Semua persyaratan di specs memiliki kode yang sesuai
     ⚠ Skenario "Sesi habis setelah tidak aktif" belum diuji

     KEBENARAN (CORRECTNESS)
     ✓ Implementasi sesuai dengan maksud spesifikasi
     ✓ Kasus batas dari skenario ditangani
     ✓ Status kesalahan sesuai dengan definisi spesifikasi

     KOHERENSI (COHERENCE)
     ✓ Keputusan desain tercermin dalam struktur kode
     ✓ Konvensi penamaan konsisten dengan design.md
     ⚠ Desain menyebutkan "event-driven" tetapi implementasi menggunakan polling

     RINGKASAN (SUMMARY)
     ─────────────────────────────
     Masalah kritis: 0
     Peringatan: 2
     Siap untuk diarsipkan: Ya (dengan peringatan)

     Rekomendasi:
     1. Tambahkan tes untuk skenario batas waktu sesi
     2. Pertimbangkan refactoring ke event-driven seperti yang dirancang, atau perbarui design.md
```

**Apa yang diperiksa oleh verifikasi:**

| Dimensi | Apa yang divalidasi |
|-----------|------------------|
| Kelengkapan | Semua tugas selesai, semua persyaratan diimplementasikan, skenario tercakup |
| Kebenaran | Implementasi sesuai dengan maksud spesifikasi, kasus batas ditangani |
| Koherensi | Keputusan desain tercermin dalam kode, pola konsisten |

Verifikasi tidak akan memblokir pengarsipan, tetapi ia menyoroti masalah yang mungkin ingin Anda tangani terlebih dahulu.

#### Arsip: Selesaikan Perubahan

`/opsx:archive` menyelesaikan perubahan dan memindahkannya ke arsip:

```text
Anda: /opsx:archive

AI:  Mengarsipkan add-auth...

     Status artefak:
     ✓ proposal.md ada
     ✓ specs/ ada
     ✓ design.md ada
     ✓ tasks.md ada (12/12 tugas selesai)

     Delta specs: Belum disinkronkan ke utama
     → Apakah Anda ingin menyinkronkannya sekarang?

Anda: Ya

AI:  ✓ Specs disinkronkan ke openspec/specs/auth/spec.md
     ✓ Dipindahkan ke openspec/changes/archive/2025-01-24-add-auth/

     Perubahan diarsipkan dengan sukses.
```

Arsip akan meminta jika spesifikasi belum disinkronkan. Ini tidak akan memblokir pada tugas yang belum selesai, tetapi akan memberikan peringatan.

## Kapan Menggunakan Apa

### `/opsx:ff` vs `/opsx:continue`

| Situasi | Gunakan |
|-----------|-----|
| Persyaratan jelas, siap untuk membangun | `/opsx:ff` |
| Mengeksplorasi, ingin meninjau setiap langkah | `/opsx:continue` |
| Ingin mengiterasi proposal sebelum spesifikasi | `/opsx:continue` |
| Tekanan waktu, perlu bergerak cepat | `/opsx:ff` |
| Perubahan kompleks, ingin kontrol | `/opsx:continue` |

**Aturan praktis:** Jika Anda dapat menjelaskan seluruh ruang lingkup di awal, gunakan `/opsx:ff`. Jika Anda menemukannya saat berjalan, gunakan `/opsx:continue`.

### Kapan Memperbarui vs Mulai dari Awal

Pertanyaan umum: kapan aman untuk memperbarui perubahan yang sudah ada, dan kapan harus memulai yang baru?

**Perbarui perubahan yang sudah ada ketika:**

- Maksud sama, eksekusi disempurnakan
- Ruang lingkup menyempit (MVP dulu, sisanya nanti)
- Koreksi berbasis pembelajaran (codebase tidak seperti yang diharapkan)
- Penyesuaian desain berdasarkan penemuan implementasi

**Mulai perubahan baru ketika:**

- Maksudnya berubah secara fundamental
-Ruang lingkup meledak menjadi pekerjaan yang sama sekali lagi
-Perubahan asli dapat ditandai "selesai" secara mandiri
-Patch akan lebih membingungkan daripada memperjelas

```text
                     ┌─────────────────────────────────────┐
                     │     Apakah ini pekerjaan yang sama?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
      Maksud yang Sama?  >50% Tumpang Tindih?  Bisakah Perubahan Asli
      Masalah yang Sama?  Ruang Lingkup yang Sama?        dinyatakan "selesai" tanpa
                 │                  │          perubahan ini?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YA               TIDAK YA           TIDAK  TIDAK            YA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    PERBARUI        BARU  PERBARUI       BARU  PERBARUI         BARU
```

**Contoh: "Tambahkan mode gelap"**

- "Perlu mendukung tema kustom juga" → Perubahan baru (ruang lingkup meledak)
- "Deteksi preferensi sistem lebih sulit dari yang diperkirakan" → Perbarui (maksud sama)
- "Mari kita kirim toggle dulu, tambahkan preferensi nanti" → Perbarui lalu arsipkan, kemudian perubahan baru

## Praktik Terbaik

### Jaga Agar Perubahan Tetap Fokus

Satu unit kerja logis per perubahan. Jika Anda melakukan "menambahkan fitur X dan juga refactoring Y", pertimbangkan dua perubahan terpisah.

**Mengapa ini penting:**
- Lebih mudah ditinjau dan dipahami
- Riwayat arsip yang lebih bersih
- Dapat dikirim secara independen
- Rollback lebih sederhana jika diperlukan

### Gunakan `/opsx:explore` untuk Persyaratan yang Tidak Jelas

Sebelum berkomitmen pada suatu perubahan, eksplorasi ruang masalahnya:

```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda eksplorasi?

Anda: Bagaimana seharusnya kita menangani pembatasan laju (rate limiting) untuk API kita?

AI:  Biar saya selidiki pengaturan dan pilihan Anda saat ini...
     [Meneliti codebase, mempertimbangkan pola]

     Saya melihat tiga pendekatan yang bisa kita ambil:
     1. Berbasis Middleware (sederhana, per-endpoint)
     2. Didukung Redis (skalabel, status bersama)
     3. Ember keranjang token per pengguna (adil, kompleks)

     Tumpukan Anda saat ini menunjukkan #1 atau #2. Bagaimana skala Anda?
```

Eksplorasi memperjelas pemikiran sebelum Anda membuat artefak.

### Verifikasi Sebelum Mengarsipkan

Gunakan `/opsx:verify` untuk memeriksa bahwa implementasi sesuai dengan artefak:

```text
Anda: /opsx:verify

AI:  Memverifikasi add-dark-mode...

     ✓ Semua tugas di tasks.md telah diperiksa
     ✓ Persyaratan di specs memiliki kode yang sesuai
     ✓ Keputusan desain tercermin dalam implementasi

     Siap untuk diarsipkan!
```

Menangkap ketidaksesuaian sebelum Anda menutup perubahan tersebut.

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

Untuk detail dan opsi perintah lengkap, lihat [Commands](commands.md).

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/opsx:propose` | Buat perubahan + artefak perencanaan | Jalur cepat default (`profil core`) |
| `/opsx:explore` | Pikirkan ide dengan AI | Mulai di sini saat tidak yakin: persyaratan tidak jelas, investigasi, membandingkan opsi |
| `/opsx:new` | Mulai kerangka perubahan | Mode diperluas, kontrol artefak eksplisit |
| `/opsx:continue` | Buat artefak berikutnya | Mode diperluas, pembuatan artefak langkah demi langkah |
| `/opsx:ff` | Buat semua artefak perencanaan | Mode diperluas, cakupan jelas |
| `/opsx:apply` | Implementasikan tugas | Siap untuk menulis kode |
| `/opsx:verify` | Validasi implementasi | Mode diperluas, sebelum pengarsipan |
| `/opsx:sync` | Gabungkan spesifikasi delta | Mode diperluas, opsional |
| `/opsx:archive` | Selesaikan perubahan | Semua pekerjaan selesai |
| `/opsx:bulk-archive` | Arsipkan beberapa perubahan | Mode diperluas, pekerjaan paralel |

## Langkah Selanjutnya

- [Commands](commands.md) - Referensi perintah lengkap dengan opsi
- [Concepts](concepts.md) - Penyelaman mendalam ke dalam spesifikasi, artefak, dan skema
- [Customization](customization.md) - Buat alur kerja khusus