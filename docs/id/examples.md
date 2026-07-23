# Contoh & Resep

Perubahan nyata, dari awal sampai akhir. Setiap resep menunjukkan perintah yang akan Anda ketik dan apa yang akan Anda lihat kembali, sehingga Anda dapat mencocokkan situasi Anda dengan pola dan menyalinnya. Resep ini menggunakan perintah **inti** default (`propose`, `explore`, `apply`, `sync`, `archive`); di mana set yang diperluas membantu, itu akan dicatat.

Pengingat sebelum Anda memulai: perintah slash seperti `/opsx:propose` dimasukkan di **obrolan asisten AI** Anda, dan perintah `openspec` dimasukkan di **terminal** Anda. Jika itu yang baru, baca [Cara Perintah Bekerja](how-commands-work.md) terlebih dahulu. Dalam transkrip di bawah ini, `You:` dan `AI:` adalah obrolan, dan baris yang dimulai dengan `$` adalah terminal.

> **Tidak yakin apa yang sedang Anda bangun?** Kebanyakan resep ini akan lebih jelas jika Anda memulai dengan `/opsx:explore` untuk memikirkannya terlebih dahulu. [Resep 3](#recipe-3-exploring-before-you-commit) menunjukkan ini dalam aksi, dan panduan [Jelajahi Terlebih Dahulu](explore.md) membuat kasus yang lengkap.

## Resep 1: Fitur kecil, jalur cepat

**Kapan menggunakannya:** Anda tahu apa yang Anda inginkan, dan itu adalah bagian pekerjaan yang terbatas. Ini adalah resep yang paling umum.

Seluruhnya adalah tiga perintah. Usulkan, bangun, arsipkan.

```text
You: /opsx:propose add-logout-button

AI:  Dibuat openspec/changes/add-logout-button/
     ✓ proposal.md — mengapa dan apa
     ✓ specs/      — persyaratan baru dan skenarionya
     ✓ design.md   — pendekatan teknis
     ✓ tasks.md    — daftar periksa implementasi
     Siap untuk diimplementasikan. Jalankan /opsx:apply.
```

Sekarang baca rencananya. Buka proposal dan delta spec. Ini adalah momen yang OpenSpec dibangun untuk: menangkap asumsi yang salah saat masih satu paragraf, bukan 400 baris kode. Edit artefak apa pun secara langsung jika ada yang salah, kemudian lanjutkan.

```text
You: /opsx:apply

AI:  Sedang mengerjakan tugas...
     ✓ 1.1 Tambahkan tombol logout ke header
     ✓ 1.2 Bersihkan sesi saat diklik
     ✓ 1.3 Tambahkan dialog konfirmasi
     Semua tugas selesai!

You: /opsx:archive

AI:  Mengarsipkan add-logout-button...
     ✓ Menggabungkan spesifikasi ke openspec/specs/auth/spec.md
     ✓ Dipindahkan ke openspec/changes/archive/2026-06-22-add-logout-button/
     Selesai. Siap untuk perubahan berikutnya.
```

Itu saja. Perilaku logout sekarang menjadi bagian dari spesifikasi Anda, dan perubahan tersebut disimpan dengan konteks lengkapnya.

## Resep 2: Perbaikan bug

**Kapan menggunakannya:** ada sesuatu yang rusak dan Anda ingin perbaikan tersebut dicatat sebagai perubahan perilaku yang disengaja, bukan commit yang misterius.

Perbaikan bug bekerja persis seperti fitur. Perbedaannya adalah pada cara Anda menyusun proposal: jelaskan perilaku yang *benar*, bukan hanya "perbaiki bug."

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Dibuat openspec/changes/fix-login-redirect-loop/
     Proposal ini menangkap perilaku rusak saat ini dan
     perilaku yang diinginkan. Delta spec MEMODIFIKASI persyaratan pengalihan
     sehingga sekarang menjadi tepat dan dapat diuji.
     Siap untuk diimplementasikan.
```

Karena perbaikan tersebut mendarat sebagai persyaratan `MODIFIED` dengan skenario baru, orang berikutnya (atau sesi AI berikutnya) tidak hanya melihat bahwa Anda memperbaikinya, tetapi juga apa arti "benar". Kemudian `/opsx:apply` dan `/opsx:archive` seperti biasa.

Tip: untuk perbaikan, skenario yang baik adalah uji regresi dalam bentuk prosa. "GIVEN pengguna yang sudah logout, WHEN mereka mengirimkan kredensial yang valid, THEN mereka mendarat di dashboard dan tidak dialihkan lagi." Tulis itu, dan implementasi memiliki target yang jelas.

## Resep 3: Menjelajahi sebelum Anda berkomitmen

**Kapan menggunakannya:** Anda memiliki masalah tetapi belum memiliki rencana. Anda tidak yakin apa yang harus dibangun, atau pendekatan mana yang benar.

Mulailah dengan `/opsx:explore`. Ini adalah mitra berpikir tanpa struktur dan tanpa artefak yang dibuat. Ini membaca basis kode Anda dan membantu Anda memutuskan.

```text
You: /opsx:explore

AI:  Apa yang ingin Anda jelajahi?

You: Halaman terasa lambat saat dimuat tetapi saya tidak tahu ke mana waktu itu pergi.

AI:  Biarkan saya lihat... Saya menemukan tiga kemungkinan penyebab:
     1. Gambar besar yang tidak dioptimalkan pada daftar produk
     2. Pengambilan data sinkron yang memblokir render
     3. Render ulang yang dipicu oleh perubahan konteks
     Mana yang harus kita selesaikan terlebih dahulu?

You: Yang pengambilan datanya.

You: /opsx:propose optimize-product-list-fetching

AI:  Perubahan dibuat, dengan proposal yang diinformasikan oleh apa yang baru saja
     kita temukan. Siap untuk diimplementasikan.
```

Eksplorasi mengklarifikasi pemikiran Anda *sebelum* Anda menghabiskan perubahan untuk itu. Ketika wawasan mengkristal, usulkan, dan AI membawa konteks ke depan.

## Resep 4: Menangani dua perubahan sekaligus

**Kapan menggunakannya:** Anda sedang di tengah fitur dan perbaikan mendesak melompati antrian.

Perubahan adalah folder yang independen, jadi pekerjaan paralel tidak bertentangan. Mulailah perbaikan, kirimkan, kemudian kembali ke fitur tepat di tempat Anda tinggalkan.

```text
You: Saya sedang di tengah add-dark-mode, tetapi saya perlu memperbaiki bug login sekarang.

You: /opsx:propose fix-login-redirect

AI:  Dibuat openspec/changes/fix-login-redirect/. Siap untuk diimplementasikan.

You: /opsx:apply

AI:  Perbaikan diimplementasikan. Semua tugas selesai.

You: /opsx:archive

AI:  ✓ Diarsipkan fix-login-redirect.

You: Kembali ke mode gelap.

You: /opsx:apply add-dark-mode

AI:  Melanjutkan add-dark-mode. Melanjutkan dari tugas 2.3: Perbarui Header...
```

Menamai perubahan di `/opsx:apply add-dark-mode` adalah cara Anda mengarahkan AI ke perubahan tertentu ketika lebih dari satu yang aktif. Karena tugas melacak penyelesaian di `tasks.md`, AI tahu persis di mana Anda berhenti.

Ketika beberapa perubahan selesai sekaligus, `/opsx:bulk-archive` yang diperluas mengarsipkannya bersama-sama dan menyelesaikan konflik spesifikasi dengan memeriksa apa yang benar-benar diimplementasikan. Lihat [Alur Kerja](workflows.md#parallel-changes).

## Resep 5: Refactor tanpa perubahan perilaku

**Kapan menggunakannya:** Anda sedang mengatur ulang kode, dan perilaku yang terlihat secara eksternal harus tetap identik.

Ini adalah kasus yang menarik, karena refactor murni tidak memiliki *apa-apa untuk ditambahkan ke spesifikasi Anda*. Kontrak perilaku tidak berubah; hanya implementasinya yang berubah. Jadi pekerjaan itu ada di desain dan tugas, dan delta spesifikasi kosong atau tidak ada.

```text
You: /opsx:propose refactor-payment-module

AI:  Perubahan dibuat. Proposal menyatakan tujuan (pisahkan modul pembayaran, tidak ada perubahan perilaku) dan desain menangkap
     struktur baru. Tidak ada perubahan spesifikasi, karena perilaku identik.
     Siap untuk diimplementasikan.
```

Nyatakan delta kosong secara eksplisit dengan mengatur `skip_specs: true` di `.openspec.yaml` perubahan:

```yaml
schema: spec-driven
skip_specs: true
```

Tanpa penanda, `openspec validate` menolak perubahan dengan nol delta (sehingga fase spesifikasi yang terlupakan masih tertangkap); dengan itu, validasi lulus dan `openspec status` menunjukkan tahap spesifikasi sebagai yang secara eksplisit dilewati daripada tertunda. Jika refactor ternyata mengubah perilaku setelah semua, hapus `skip_specs` dari `.openspec.yaml` dan tulis delta spesifikasi — validate memperlakukan penanda ditambah file spesifikasi sebagai konflik, sehingga penanda yang usang tidak bisa tetap diam-diam.

Mengarsipkan perubahan yang ditandai tidak memerlukan bendera tambahan (tidak ada delta untuk digabungkan). Secara independen, bendera `--skip-specs` memberi tahu perintah terminal untuk melewati langkah spesifikasi secara eksplisit:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Bendera yang sama berguna untuk tooling, CI, dan perubahan hanya dokumen. Prinsipnya: spesifikasi mendeskripsikan perilaku, jadi jika perilaku tidak berubah, spesifikasi juga tidak boleh berubah. Lihat [Konsep](concepts.md#what-a-spec-is-and-is-not).

## Resep 6: Kontrol langkah demi langkah (perintah yang diperluas)

**Kapan menggunakannya:** perubahan yang kompleks atau berisiko di mana Anda ingin meninjau setiap artefak sebelum melanjutkan.

Perintah inti `/opsx:propose` membuat draf semuanya sekaligus. Ketika Anda lebih suka melakukannya satu langkah pada satu waktu, aktifkan perintah yang diperluas:

```bash
$ openspec config profile      # pilih alur kerja yang diperluas
$ openspec update              # terapkan ke proyek ini
```

Sekarang Anda dapat membuat kerangka dan membangun secara bertahap:

```text
You: /opsx:new add-2fa

AI:  Dibuat openspec/changes/add-2fa/. Siap untuk membuat: proposal.

You: /opsx:continue

AI:  Dibuat proposal.md. Sekarang tersedia: spesifikasi, desain.

You: /opsx:continue

AI:  Dibuat specs/auth/spec.md. Sekarang tersedia: desain.
```

Tinjau setiap artefak saat itu tiba, edit dengan bebas, dan lanjutkan ketika Anda puas. Ketika Anda ingin sisa draf dibuat sekaligus, `/opsx:ff` mempercepat melalui artefak perencanaan yang tersisa. Sebelum mengarsipkan, `/opsx:verify` memeriksa bahwa implementasi benar-benar cocok dengan spesifikasi. Lihat [Alur Kerja](workflows.md#opsxff-vs-opsxcontinue).

## Resep 7: Mempelajari seluruh siklus secara langsung

**Kapan menggunakannya:** Anda telah menginstal OpenSpec dan ingin *merasakan* alur kerja pada kode Anda sendiri, bukan contoh mainan.

Aktifkan perintah yang diperluas (lihat Resep 6), kemudian:

```text
You: /opsx:onboard

AI:  Selamat datang di OpenSpec! Saya akan memandu Anda melalui perubahan lengkap
     menggunakan basis kode aktual Anda. Biarkan saya memindai untuk peningkatan kecil dan aman
     yang dapat kita buat bersama...
```

`/opsx:onboard` menemukan peningkatan nyata (kecil), membuat perubahan untuk itu, mengimplementasikannya, dan mengarsipkannya, menceritakan setiap langkah. Ini membutuhkan waktu 15 hingga 30 menit dan meninggalkan Anda dengan perubahan nyata yang dapat Anda simpan atau buang. Ini adalah cara paling lembut untuk belajar. Lihat [Perintah](commands.md#opsxonboard).

## Memeriksa pekerjaan Anda dari terminal

Kapan saja, dari terminal Anda, Anda dapat memeriksa keadaan hal-hal:

```bash
$ openspec list                      # perubahan aktif
$ openspec show add-dark-mode        # satu perubahan secara detail
$ openspec validate add-dark-mode    # periksa struktur
$ openspec view                      # dasbor interaktif
```

Ini adalah alat baca dan periksa. Pengusulan dan pembangunan masih terjadi melalui perintah slash di obrolan. Detail lengkap di [Referensi CLI](cli.md).

## Ke mana harus pergi selanjutnya

- [Jelajahi Terlebih Dahulu](explore.md): cara yang direkomendasikan untuk memulai ketika Anda tidak yakin
- [Alur Kerja](workflows.md): pola di atas, dengan panduan pengambilan keputusan kapan menggunakan masing-masing
- [Perintah](commands.md): setiap perintah slash secara detail
- [Memulai](getting-started.md): panduan langkah demi langkah perubahan pertama yang kanonik
- [Konsep](concepts.md): mengapa bagian-bagian tersebut saling cocok dengan cara tersebut