# Contoh & Resep

Perubahan nyata, dari awal hingga akhir. Setiap resep menunjukkan perintah yang akan Anda ketik dan apa yang akan Anda lihat kembali, sehingga Anda dapat mencocokkan situasi Anda dengan sebuah pola dan menyalinnya. Ini menggunakan perintah inti default (`propose`, `explore`, `apply`, `sync`, `archive`); jika set yang diperluas membantu, hal itu dicatat.

Pengingat sebelum memulai: perintah slash seperti `/opsx:propose` dimasukkan ke dalam **obrolan asisten AI** Anda, dan perintah `openspec` dimasukkan ke dalam **terminal**. Jika ini masih baru bagi Anda, baca [Cara Kerja Perintah](how-commands-work.md) terlebih dahulu. Dalam transkrip di bawah, `You:` dan `AI:` adalah obrolannya, dan baris yang diawali dengan `$` adalah terminalnya.

> **Masih tidak yakin apa yang sedang Anda bangun?** Sebagian besar resep ini akan lebih terarah jika Anda mulai dengan `/opsx:explore` untuk memikirkannya terlebih dahulu. [Resep 3](#recipe-3-exploring-before-you-commit) menunjukkannya dalam aksi, dan panduan [Explore First](explore.md) memberikan penjelasan lengkapnya.

## Resep 1: Fitur kecil, jalur cepat

**Kapan menggunakannya:** Anda tahu apa yang Anda inginkan, dan itu adalah pekerjaan yang terbatas. Ini adalah resep yang paling umum.

Keseluruhan proses ini terdiri dari tiga perintah. Propose, bangun, arsipkan.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — mengapa dan apa
     ✓ specs/      — persyaratan baru dan skenarionya
     ✓ design.md   — pendekatan teknis
     ✓ tasks.md    — daftar periksa implementasi
     Siap untuk implementasi. Jalankan /opsx:apply.
```

Sekarang baca rencananya. Buka proposal dan delta spec. Inilah momen di mana OpenSpec dibuat: menangkap asumsi yang salah saat itu masih satu paragraf, bukan 400 baris kode. Edit artefak apa pun secara langsung jika ada sesuatu yang tidak sesuai, lalu lanjutkan.

```text
You: /opsx:apply

AI:  Mengerjakan tugas-tugas...
     ✓ 1.1 Tambahkan tombol logout ke header
     ✓ 1.2 Bersihkan sesi saat diklik
     ✓ 1.3 Tambahkan dialog konfirmasi
     Semua tugas selesai!

You: /opsx:archive

AI:  Mengarsip add-logout-button...
     ✓ Menggabungkan spesifikasi ke openspec/specs/auth/spec.md
     ✓ Dipindahkan ke openspec/changes/archive/2026-06-22-add-logout-button/
     Selesai. Siap untuk perubahan berikutnya.
```

Itu saja. Perilaku logout kini menjadi bagian dari spesifikasi Anda, dan perubahannya diarsipkan bersama dengan konteks lengkapnya.

## Resep 2: Perbaikan bug

**Kapan menggunakannya:** Sesuatu yang rusak dan Anda ingin perbaikannya dicatat sebagai perubahan yang disengaja terhadap perilaku, bukan commit misterius.

Perbaikan bug bekerja persis seperti fitur. Perbedaannya terletak pada cara Anda membingkai proposal: jelaskan perilaku *yang benar*, bukan hanya "perbaiki bug."

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     Proposal tersebut menangkap perilaku yang rusak saat ini dan
     perilaku yang dimaksudkan. Delta spec MEMODIFIKASI persyaratan
     redirect sehingga kini presisi dan dapat diuji.
     Siap untuk implementasi.
```

Karena perbaikan itu masuk sebagai persyaratan `MODIFIED` dengan skenario baru, orang berikutnya (atau sesi AI berikutnya) tidak hanya melihat bahwa Anda memperbaikinya, tetapi apa artinya "benar." Kemudian `/opsx:apply` dan `/opsx:archive` seperti biasa.

Tips: untuk sebuah perbaikan, skenario yang baik adalah tes regresi dalam bentuk prosa. "DIBERIKAN pengguna yang belum login, SAAT mereka mengirimkan kredensial yang valid, MAKA mereka mendarat di dasbor dan tidak diarahkan lagi." Tulis itu, dan implementasi memiliki target yang jelas.

## Resep 3: Mengeksplorasi sebelum berkomitmen

**Kapan menggunakannya:** Anda memiliki masalah tetapi belum ada rencana. Anda tidak yakin apa yang harus dibangun, atau pendekatan mana yang benar.

Mulai dengan `/opsx:explore`. Ini adalah mitra berpikir tanpa struktur dan tanpa pembuatan artefak. Ia membaca codebase Anda dan membantu Anda memutuskan.

```text
You: /opsx:explore

AI:  Apa yang ingin Anda eksplorasi?

You: Halaman terasa lambat tetapi saya tidak tahu ke mana perginya waktu.

AI:  Biar saya lihat... Saya menemukan tiga kemungkinan penyebab:
     1. Gambar besar yang tidak teroptimalkan di daftar produk
     2. Pengambilan data sinkronus yang memblokir render
     3. Re-render yang dipicu oleh perubahan konteks
     Mana yang harus kita tangani terlebih dahulu?

You: Yang pengambilan data.

You: /opsx:propose optimize-product-list-fetching

AI:  Telah membuat perubahannya, dengan proposal yang diinformasikan dari apa yang baru saja kami temukan. Siap untuk implementasi.
```

Eksplorasi mengklarifikasi pemikiran Anda *sebelum* Anda menghabiskan perubahan untuk itu. Ketika wawasan tersebut menjadi jelas, ajukan proposal, dan AI membawa konteksnya maju.

## Resep 4: Mengelola dua perubahan sekaligus

**Kapan menggunakannya:** Anda sedang di tengah-tengah fitur dan perbaikan mendesak menyela antrean.

Perubahan adalah folder yang independen, jadi pekerjaan paralel tidak akan bentrok. Mulai perbaikannya, kirimkan, lalu kembali ke fitur tepat di tempat Anda berhenti.

```text
You: Saya setengah jalan menyelesaikan add-dark-mode, tetapi saya perlu memperbaiki bug login sekarang.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Siap untuk implementasi.

You: /opsx:apply

AI:  Mengimplementasikan perbaikannya. Semua tugas selesai.

You: /opsx:archive

AI:  ✓ Mengarsipkan fix-login-redirect.

You: Kembali ke dark mode.

You: /opsx:apply add-dark-mode

AI:  Melanjutkan add-dark-mode. Melanjutkan di tugas 2.3: Perbarui Header...
```

Penamaan perubahan dalam `/opsx:apply add-dark-mode` adalah cara Anda menunjukkan kepada AI suatu perubahan tertentu ketika lebih dari satu yang aktif. Karena tugas melacak penyelesaian di `tasks.md`, AI tahu persis di mana Anda berhenti.

Ketika beberapa perubahan selesai sekaligus, `/opsx:bulk-archive` yang diperluas mengarsipkannya bersama dan menyelesaikan konflik spesifikasi dengan memeriksa apa yang sebenarnya telah diimplementasikan. Lihat [Alur Kerja](workflows.md#parallel-changes).

## Resep 5: Refactor tanpa perubahan perilaku

**Kapan menggunakannya:** Anda sedang menstruktur ulang kode, dan perilaku yang terlihat secara eksternal harus tetap identik.

Ini adalah kasus yang menarik, karena refactor murni *tidak memiliki apa pun untuk ditambahkan ke spesifikasi Anda*. Kontrak perilakunya tidak berubah; hanya implementasinya yang berubah. Jadi pekerjaan itu berada di desain dan tugas, dan delta spec kosong atau tidak ada.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. Proposal tersebut menyatakan tujuannya (memisahkan modul pembayaran, tanpa perubahan perilaku) dan desain menangkap struktur baru. Tidak ada perubahan spesifikasi, karena perilakunya identik. Siap untuk implementasi.
```

Ketika Anda mengarsipkan perubahan yang tidak menyentuh spesifikasi, Anda dapat memberi tahu perintah terminal untuk melewati langkah spesifikasi:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Bendera yang sama berguna untuk tooling, CI, dan perubahan hanya dokumen. Prinsipnya: spesifikasi menjelaskan perilaku, jadi jika perilakunya tidak berubah, spesifikasinya juga seharusnya tidak berubah. Lihat [Konsep](concepts.md#what-a-spec-is-and-is-not).

## Resep 6: Kontrol langkah demi langkah (perintah yang diperluas)

**Kapan menggunakannya:** Perubahan yang kompleks atau berisiko di mana Anda ingin meninjau setiap artefak sebelum melanjutkan.

`/opsx:propose` inti membuat semuanya sekaligus. Ketika Anda lebih suka melakukannya satu per satu, aktifkan perintah yang diperluas:

```bash
$ openspec config profile      # pilih alur kerja yang diperluas
$ openspec update              # terapkan pada proyek ini
```

Sekarang Anda dapat membuat kerangka dan membangun secara bertahap:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Siap untuk membuat: proposal.

You: /opsx:continue

AI:  Created proposal.md. Sekarang tersedia: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Sekarang tersedia: design.
```

Tinjau setiap artefak saat muncul, edit secara bebas, dan lanjutkan ketika Anda puas. Ketika Anda ingin sisanya dibuat sekaligus, `/opsx:ff` akan maju melalui artefak perencanaan yang tersisa. Sebelum mengarsipkan, `/opsx:verify` memeriksa bahwa implementasi benar-benar sesuai dengan spesifikasi. Lihat [Alur Kerja](workflows.md#opsxff-vs-opsxcontinue).

## Resep 7: Mempelajari seluruh alur kerja secara langsung

**Kapan menggunakannya:** Anda telah menginstal OpenSpec dan ingin *merasakan* alur kerja pada kode Anda sendiri, bukan contoh mainan.

Aktifkan perintah yang diperluas (lihat Resep 6), lalu:

```text
You: /opsx:onboard

AI:  Selamat datang di OpenSpec! Saya akan memandu Anda melalui perubahan lengkap menggunakan codebase aktual Anda. Biarkan saya mencari perbaikan kecil dan aman yang dapat kita lakukan bersama...
```

`/opsx:onboard` menemukan perbaikan nyata (kecil), membuat perubahan untuk itu, mengimplementasikannya, dan mengarsipkannya, menceritakan setiap langkahnya. Ini membutuhkan waktu 15 hingga 30 menit dan menyisakan Anda dengan perubahan nyata yang dapat Anda simpan atau buang. Ini adalah cara paling lembut untuk belajar. Lihat [Perintah](commands.md#opsxonboard).

## Memeriksa pekerjaan Anda dari terminal

Kapan pun, dari terminal Anda, Anda dapat memeriksa status segala sesuatu:

```bash
$ openspec list                      # perubahan aktif
$ openspec show add-dark-mode        # satu perubahan secara detail
$ openspec validate add-dark-mode    # periksa struktur
$ openspec view                      # dasbor interaktif
```

Ini adalah alat untuk membaca dan memeriksa. Proses pengajuan dan pembangunan masih terjadi melalui perintah slash di obrolan. Detail lengkap ada di [Referensi CLI](cli.md).

## Ke mana harus melangkah selanjutnya

- [Explore First](explore.md): cara yang direkomendasikan untuk memulai ketika Anda tidak yakin
- [Workflows](workflows.md): pola-pola di atas, dengan panduan keputusan kapan harus menggunakan masing-masing
- [Commands](commands.md): setiap perintah slash secara detail
- [Getting Started](getting-started.md): panduan perubahan pertama yang kanonik
- [Concepts](concepts.md): mengapa bagian-bagian tersebut saling melengkapi