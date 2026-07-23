# Alur Kerja

Panduan ini mencakup pola alur kerja umum untuk OpenSpec dan kapan menggunakan masing-masingnya. Untuk pengaturan dasar, lihat [Memulai](getting-started.md). Untuk referensi perintah, lihat [Perintah](commands.md).

## Filosofi: Tindakan, Bukan Fase

Alur kerja tradisional memaksa Anda melalui fase-fase: perencanaan, kemudian implementasi, kemudian selesai. Namun pekerjaan nyata tidak cocok dengan sempurna ke dalam kotak-kotak tersebut.

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

- **Tindakan, bukan fase** - Perintah adalah hal yang dapat Anda lakukan, bukan tahap yang membuat Anda terjebak
- **Ketergantungan adalah pembuka jalan** - Mereka menunjukkan apa yang mungkin, bukan apa yang diperlukan selanjutnya

> **Kustomisasi:** Alur kerja OPSX didorong oleh skema yang menentukan urutan artefak. Lihat [Kustomisasi](customization.md) untuk detail pembuatan skema kustom.

## Dua Mode

### Jalur Cepat Default (profil `core`)

Instalasi baru default ke `core`, yang menyediakan:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Alur umum:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (opsional)
```

#### Mulailah dengan menjelajah (kebiasaan yang layak dibentuk)

`/opsx:explore` adalah bagian dari profil default, bukan add-on lanjutan. Ini adalah langkah yang harus diambil setiap kali Anda memiliki masalah tetapi belum memiliki rencana, yang, dengan asisten AI, adalah sebagian besar waktu.

```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda jelajahi?

Anda: Hasil pencarian kami terasa usang. Saya tidak yakin apakah itu caching,
     pengindeksan, atau query itu sendiri.

AI:  Biarkan saya lihat... [membaca layanan pencarian dan lapisan cache]
     Itu indeksnya: hanya dibangun kembali setiap malam, jadi edit tidak muncul
     sampai hari berikutnya. Dua opsi: rebuild on write (simple,
     lebih banyak beban) atau invalidasi cache TTL pendek (lebih banyak bagian yang bergerak,
     lebih sedikit beban). Mengingat volume tulis Anda rendah, rebuild-on-write adalah
     perbaikan yang lebih bersih. Ingin membatasi cakupannya?

Anda: Ya.

Anda: /opsx:propose rebuild-search-index-on-write
```

Jelajah tidak membuat artefak dan tidak menulis kode. Ini adalah percakapan gratis tanpa taruhan yang mengubah kekhawatiran samar menjadi perubahan yang tepat, sehingga proposal yang mengikuti menjadi tajam. Sudah tahu persis apa yang Anda inginkan? Lewati saja dan langsung ke `/opsx:propose`. Panduan lengkap: [Jelajah Terlebih Dahulu](explore.md).

### Alur Kerja Diperluas/Penuh (pilihan kustom)

Jika Anda ingin perintah scaffold-and-build eksplisit (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), aktifkan dengan:

```bash
openspec config profile
openspec update
```

## Pola Alur Kerja (Mode Diperluas)

### Fitur Cepat

Ketika Anda tahu apa yang ingin Anda bangun dan hanya perlu mengeksekusi:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Contoh percakapan:**

```text
Anda: /opsx:new add-logout-button

AI:  Dibuat openspec/changes/add-logout-button/
     Siap membuat: proposal

Anda: /opsx:ff

AI:  Membuat semua artefak perencanaan...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Siap untuk diimplementasikan!

Anda: /opsx:apply

AI:  Bekerja melalui tugas-tugas...
     ✓ Menambahkan tombol logout ke header
     ✓ Mengimplementasikan pembersihan sesi
     ✓ Menambahkan dialog konfirmasi
     Semua tugas selesai!

Anda: /opsx:archive

AI:  ✓ Spesifikasi yang digabung
     ✓ Perubahan yang diarsipkan
```

**Terbaik untuk:** Fitur kecil hingga menengah, perbaikan bug, perubahan yang jelas.

### Eksploratif

Ketika persyaratan tidak jelas atau Anda perlu menyelidiki terlebih dahulu:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Contoh percakapan:**

```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda jelajahi?

Anda: Saya ingin meningkatkan performa loading halaman tetapi saya tidak yakin
     di mana hambatannya.

AI:  Biarkan saya bantu menyelidiki...
     [Menganalisis ukuran bundle, mengidentifikasi query lambat, meninjau
     pola render komponen]

     Saya menemukan tiga hambatan utama:
     1. Gambar besar yang tidak dioptimalkan
     2. Pengambilan data sinkron di ProductList
     3. Render ulang dari perubahan konteks

     Yang mana yang ingin Anda selesaikan terlebih dahulu?

Anda: Mari kita tangani masalah pengambilan data itu.

Anda: /opsx:new optimize-product-list-fetching

AI:  Perubahan dibuat. Siap membuat: proposal

Anda: /opsx:continue

AI:  Membuat proposal berdasarkan eksplorasi kita...
     [Menulis proposal yang menggabungkan wawasan penyelidikan]

     Siap membuat: specs, desain
     Yang mana yang ingin Anda selanjutnya?

Anda: /opsx:continue

AI:  Membuat spesifikasi...
```

**Terbaik untuk:** Optimasi performa, debugging, keputusan arsitektur, persyaratan yang tidak jelas.

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
Anda: Saya sedang mengerjakan add-dark-mode tapi tiba-tiba harus memperbaiki bug

Anda: /opsx:new fix-login-redirect

AI:  Dibuat openspec/changes/fix-login-redirect/

Anda: /opsx:ff

AI:  ✓ Artefak perencanaan dibuat

Anda: /opsx:apply

AI:  Bekerja pada fix-login-redirect...
     [Mengimplementasikan perbaikan]
     Semua tugas selesai!

Anda: /opsx:archive

AI:  ✓ Diarsipkan fix-login-redirect

Anda: Mari kembali ke dark mode

Anda: /opsx:apply add-dark-mode

AI:  Melanjutkan add-dark-mode...
     Melanjutkan dari tugas 2.3: Perbarui Header...
```

**Terbaik untuk:** Aliran kerja paralel, interupsi mendesak, kolaborasi tim.

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
     Kedua perubahan sudah diimplementasikan. Akan diterapkan dalam urutan kronologis.

     Arsipkan ketiga perubahan?

Anda: Ya

AI:  ✓ Diarsipkan add-dark-mode
     ✓ Diarsipkan fix-login-redirect
     ✓ Diarsipkan update-footer
     Spesifikasi digabung dalam urutan: add-dark-mode → update-footer
```

Arsip massal mendeteksi ketika beberapa perubahan menyentuh spesifikasi yang sama dan menyelesaikan konflik dengan memeriksa apa yang sebenarnya diimplementasikan.

### Menyelesaikan Perubahan

Alur penyelesaian yang direkomendasikan:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              memvalidasi          meminta untuk menyinkronkan
              implementasi         jika diperlukan
```

#### Verifikasi: Periksa Pekerjaan Anda

`/opsx:verify` memvalidasi implementasi terhadap artefak Anda di tiga dimensi:

```text
Anda: /opsx:verify

AI:  Memverifikasi add-auth...

     KELENGKAPAN
     ✓ Semua 12 tugas dalam tasks.md sudah dicek
     ✓ Semua persyaratan dalam spesifikasi memiliki kode yang sesuai
     ⚠ Skenario "Timeout sesi setelah tidak aktif" tidak diuji

     KEBENARAN
     ✓ Implementasi sesuai dengan niat spesifikasi
     ✓ Kasus tepi dari skenario ditangani
     ✓ Status kesalahan sesuai dengan definisi spesifikasi

     KOHERENSI
     ✓ Keputusan desain tercermin dalam struktur kode
     ✓ Konvensi penamaan konsisten dengan design.md
     ⚠ Desain menyebutkan "event-driven" tapi implementasi menggunakan polling

     RINGKASAN
     ─────────────────────────────
     Masalah kritis: 0
     Peringatan: 2
     Siap diarsipkan: Ya (dengan peringatan)

     Rekomendasi:
     1. Tambahkan uji untuk skenario timeout sesi
     2. Pertimbangkan untuk merefaktorkan menjadi event-driven seperti yang dirancang, atau perbarui design.md
```

**Apa yang diperiksa oleh verifikasi:**

| Dimensi | Apa yang divalidasi |
|---------|---------------------|
| Kelengkapan | Semua tugas selesai, semua persyaratan diimplementasikan, skenario tercakup |
| Kebenaran | Implementasi sesuai dengan niat spesifikasi, kasus tepi ditangani |
| Koherensi | Keputusan desain tercermin dalam kode, pola konsisten |

Verifikasi tidak akan memblokir arsip, tetapi mengungkapkan masalah yang mungkin ingin Anda selesaikan terlebih dahulu.

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

     Spesifikasi delta: Belum disinkronkan ke cabang utama
     → Apakah Anda ingin menyinkronkan sekarang?

Anda: Ya

AI:  ✓ Spesifikasi disinkronkan ke openspec/specs/auth/spec.md
     ✓ Dipindahkan ke openspec/changes/archive/2025-01-24-add-auth/

     Perubahan berhasil diarsipkan.
```

Arsip akan meminta jika spesifikasi belum disinkronkan. Itu tidak akan memblokir tugas yang belum selesai, tetapi akan memperingatkan Anda.

## Kapan Menggunakan Apa

### `/opsx:ff` vs `/opsx:continue`

| Situasi | Gunakan |
|---------|---------|
| Persyaratan jelas, siap membangun | `/opsx:ff` |
| Mengeksplorasi, ingin meninjau setiap langkah | `/opsx:continue` |
| Ingin mengulangi proposal sebelum spesifikasi | `/opsx:continue` |
| Tekanan waktu, perlu bergerak cepat | `/opsx:ff` |
| Perubahan kompleks, ingin kontrol | `/opsx:continue` |

**Aturan praktis:** Jika Anda dapat menggambarkan seluruh cakupan di muka, gunakan `/opsx:ff`. Jika Anda mengetahuinya saat Anda pergi, gunakan `/opsx:continue`.

### Kapan Memperbarui vs Memulai dari Awal

Pertanyaan umum: kapan memperbarui perubahan yang ada baik-baik saja, dan kapan harus memulai yang baru?

**Perbarui perubahan yang ada ketika:**

- Niat yang sama, eksekusi yang disempurnakan
- Cakupan menyempit (MVP terlebih dahulu, sisanya nanti)
- Koreksi berbasis pembelajaran (basis kode bukan yang Anda harapkan)
- Penyesuaian desain berdasarkan penemuan implementasi

**Mulai perubahan baru ketika:**

- Niat berubah secara mendasar
- Cakupan meledak menjadi pekerjaan yang sama sekali berbeda
- Perubahan asli dapat ditandai "selesai" mandiri
- Patch akan lebih membingungkan daripada menjelaskan

```text
                     ┌─────────────────────────────────────┐
                     │     Apakah ini pekerjaan yang sama?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Niat sama?      >50% tumpang tindih?      Dapatkah asli
          Masalah sama?     Cakupan sama?        diselesaikan tanpa
                 │                  │          perubahan ini?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YA               TIDAK YA           TIDAK TIDAK           YA
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    PERBARUI            BARU PERBARUI       BARU PERBARUI        BARU
```

**Contoh: "Tambahkan mode gelap"**

- "Perlu juga mendukung tema kustom" → Perubahan baru (cakupan meledak)
- "Deteksi preferensi sistem lebih sulit dari yang diharapkan" → Perbarui (niat sama)
- "Mari kirim toggle terlebih dahulu, tambahkan preferensi nanti" → Perbarui lalu arsipkan, lalu perubahan baru

## Praktik Terbaik

### Jaga Perubahan Tetap Terfokus

Satu unit logis pekerjaan per perubahan. Jika Anda melakukan "tambahkan fitur X dan juga refactor Y", pertimbangkan dua perubahan terpisah.

**Mengapa itu penting:**
- Lebih mudah untuk ditinjau dan dipahami
- Riwayat arsip yang lebih bersih
- Dapat dikirim secara independen
- Rollback yang lebih sederhana jika diperlukan

### Gunakan `/opsx:explore` untuk Persyaratan yang Tidak Jelas

Sebelum berkomitmen pada perubahan, jelajahi ruang masalah:

```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda jelajahi?

Anda: Bagaimana seharusnya kita menangani rate limiting untuk API kami?

AI:  Biarkan saya menyelidiki pengaturan saat ini dan opsi...
     [Meneliti basis kode, mempertimbangkan pola]

     Saya melihat tiga pendekatan yang bisa kita ambil:
     1. Berbasis middleware (sederhana, per-endpoint)
     2. Berbasis Redis (dapat diskalakan, state bersama)
     3. Token bucket per pengguna (adil, kompleks)

     Tumpukan saat ini Anda menunjukkan #1 atau #2. Berapa skala Anda?
```

Eksplorasi mengklarifikasi pemikiran sebelum Anda membuat artefak.

### Verifikasi Sebelum Mengarsipkan

Gunakan `/opsx:verify` untuk memeriksa implementasi sesuai dengan artefak:

```text
Anda: /opsx:verify

AI:  Memverifikasi add-dark-mode...

     ✓ Semua tugas dalam tasks.md sudah dicek
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

Untuk detail dan opsi perintah lengkap, lihat [Perintah](commands.md).

| Perintah | Tujuan | Kapan Digunakan |
|---------|---------|-------------|
| `/opsx:propose` | Buat perubahan + artefak perencanaan | Jalur default cepat (profil `core`) |
| `/opsx:explore` | Pertimbangkan ide bersama AI | Mulai di sini jika tidak yakin: kebutuhan yang tidak jelas, investigasi, membandingkan opsi |
| `/opsx:new` | Mulai kerangka perubahan | Mode diperluas, kontrol artefak eksplisit |
| `/opsx:continue` | Buat artefak berikutnya | Mode diperluas, pembuatan artefak langkah demi langkah |
| `/opsx:ff` | Buat semua artefak perencanaan | Mode diperluas, ruang lingkup yang jelas |
| `/opsx:apply` | Terapkan tugas | Siap menulis kode |
| `/opsx:verify` | Validasi implementasi | Mode diperluas, sebelum mengarsipkan |
| `/opsx:sync` | Gabungkan spesifikasi delta | Mode diperluas, opsional |
| `/opsx:archive` | Selesaikan perubahan | Semua pekerjaan selesai |
| `/opsx:bulk-archive` | Arsipkan banyak perubahan | Mode diperluas, pekerjaan paralel |

## Langkah Selanjutnya

- [Menulis Spesifikasi yang Baik](writing-specs.md) - Bagaimana bentuk kebutuhan dan skenario yang kuat, serta cara menyesuaikan ukuran perubahan agar tepat
- [Meninjau Perubahan](reviewing-changes.md) - Pemeriksaan dua menit pada rencana draf sebelum menulis kode apapun
- [OpenSpec di Tim](team-workflow.md) - Bagaimana perubahan disesuaikan dengan cabang dan pull request
- [Perintah](commands.md) - Referensi perintah lengkap beserta opsi
- [Konsep](concepts.md) - Penjelasan mendalam tentang spesifikasi, artefak, dan skema
- [Kustomisasi](customization.md) - Buat alur kerja kustom