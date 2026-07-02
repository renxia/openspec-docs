# Mengedit dan Melakukan Iterasi pada Perubahan

**Setiap artefak dalam sebuah perubahan hanyalah file Markdown yang dapat Anda edit kapan saja.** Tidak ada "fase perencanaan" yang terkunci, tidak ada gerbang persetujuan, dan tidak ada mode edit khusus untuk dimasuki. Ingin mengubah proposal setelah Anda mulai membangun? Buka `proposal.md` dan ubah isinya. Menyadari bahwa desainnya salah di tengah implementasi? Perbaiki `design.md` dan lanjutkan. Itulah jawabannya secara keseluruhan, dan itu memang disengaja.

Halaman ini adalah untuk saat Anda berpikir "tunggu, bisakah saya kembali dan mengubahnya?" Ya. Begini caranya, untuk setiap kasus umum.

## Dua cara untuk mengedit apa pun

Anda selalu memiliki keduanya:

1. **Edit file secara langsung.** Artefak adalah Markdown biasa di `openspec/changes/<name>/`. Buka `proposal.md`, `design.md`, `tasks.md`, atau delta spec di bawah `specs/` pada editor Anda dan ubah isinya. Tidak ada hal lain yang diperlukan.

2. **Minta AI Anda untuk merevisinya.** Dalam obrolan, cukup katakan apa yang Anda inginkan: "Perbarui proposal untuk menghapus ide caching dan menambahkan bagian batasan laju (rate-limit)," atau "desainnya harus menggunakan antrian (queue), bukan polling." AI akan mengedit artefak tersebut untuk Anda, menggunakan sisa perubahan sebagai konteks.

Gunakan mana pun yang paling sesuai dengan situasinya. Sedikit penyesuaian kata? Edit file. Pemikiran ulang yang substansial? Biarkan AI merevisi dengan konteks penuh.

## "Bagaimana saya memperbarui proposal (atau spesifikasi) setelah saya mulai?"

Cukup perbarui. Perubahan yang sama, disempurnakan.

Jika Anda menggunakan perintah yang diperluas (expanded commands), alur kerjanya adalah: edit artefak, lalu jalankan `/opsx:continue` untuk melanjutkan dari keadaan baru, atau `/opsx:apply` untuk terus mengimplementasikan berdasarkan rencana yang diperbarui. Jika Anda menggunakan perintah `core` default, edit artefak dan jalankan `/opsx:apply`; ini akan membaca file saat ini, jadi ia membangun berdasarkan apa pun yang tertulis di artefak tersebut.

Model mentalnya: artefak adalah rencana hidup, bukan kontrak yang ditandatangani. AI selalu bekerja dari isi terkini mereka, jadi mengeditnya mengarahkan pekerjaan.

```text
Anda: Saya ingin mengubah pendekatan dalam perubahan ini.

Anda: [edit design.md, atau beri tahu AI:]
     Perbarui design.md untuk menggunakan background job alih-alih panggilan sinkron.

AI:  design.md telah diperbarui. Daftar tugas masih sesuai; apakah Anda ingin saya melanjutkan penerapannya?

Anda: /opsx:apply
```

Ini menjawab pertanyaan yang sangat umum: tidak ada perintah "perbarui proposal" terpisah karena Anda tidak membutuhkannya. File tersebut adalah sumber kebenaran, dan mengeditnya (secara manual atau melalui AI) adalah pembaruannya.

## "Bagaimana saya kembali untuk meninjau setelah mengimplementasikan?"

Anda tidak perlu "kembali," karena Anda tidak pernah pergi. Alur kerjanya cair: tinjauan, edit, dan implementasi bukanlah fase sekuensial yang menjebak Anda.

Secara konkret, setelah beberapa pekerjaan `/opsx:apply`:

- Ingin meninjau kembali rencana? Buka artefak dan bacalah, atau jalankan `openspec show <change>` di terminal Anda untuk tampilan terpadu.
- Menemukan sesuatu yang perlu diubah? Edit artefak (atau minta AI untuk), lalu lanjutkan.
- Ingin pemeriksaan terstruktur bahwa kode sesuai dengan rencana? Jalankan `/opsx:verify` (perintah diperluas). Ini melaporkan kelengkapan, kebenaran, dan koherensi tanpa memblokir apa pun. Lihat [Workflows: Verify](workflows.md#verify-check-your-work).

Tidak ada "fase tinjauan" untuk kembali, karena peninjauan adalah sesuatu yang dapat Anda lakukan kapan saja, termasuk setelah implementasi.

## "Saya mengedit kodenya secara manual. Bagaimana saya merekonsiliasi hal itu dengan OpenSpec?"

Ini terjadi terus-menerus dan tidak masalah. Anda menyempurnakan sesuatu di editor Anda, dan sekarang kode serta artefak tersebut tidak sesuai. Satukan kembali keduanya ke arah mana pun yang benar:

- **Kodenya sudah benar, spesifikasinya usang.** Perbarui delta spec (dan tugas, jika relevan) untuk menjelaskan perilaku yang sebenarnya telah Anda kirimkan. Spesifikasi harus sesuai dengan kenyataan sebelum Anda mengarsipkannya, karena pengarsipan menggabungkan spesifikasi ke dalam sumber kebenaran Anda.
- **Spesifikasinya benar, kodenya menyimpang.** Teruslah membangun atau memperbaiki sampai kode sesuai dengan spesifikasi.

Cara cepat untuk menampilkan ketidaksesuaian adalah `/opsx:verify`: ia membaca artefak dan kode Anda dan memberi tahu di mana keduanya berbeda. Perlakukan hasilnya sebagai daftar tugas untuk rekonsiliasi, lalu arsipkan setelah mereka setuju.

Prinsipnya: pada saat pengarsipan, spesifikasi Anda menjadi kebenaran catatan. Jadi sebelum Anda mengarsipkan, buatlah spesifikasi jujur mengenai apa yang dilakukan kode tersebut. Pengeditan manual sangat diterima; jangan hanya membiarkannya secara diam-diam membuat spesifikasi tidak sinkron.

## Menyempurnakan proposal yang tidak Anda sukai

Jika sebuah proposal yang dihasilkan kurang memuaskan, Anda memiliki tiga langkah bagus:

- **Lakukan iterasi di tempat.** Beri tahu AI apa yang salah ("lingkupnya terlalu luas, hapus fitur admin") dan biarkan ia merevisi. Paling murah dan biasanya benar.
- **Jelajahi dulu, baru kemudian usulkan kembali.** Jika masalahnya adalah ide itu sendiri yang tidak jelas, mundur ke `/opsx:explore`, pikirkan secara mendalam, dan biarkan proposal yang lebih tajam muncul dari sana. Lihat [Explore First](explore.md).
- **Mulai dari awal.** Jika niatnya telah berubah secara fundamental, perubahan baru bisa lebih jelas daripada menambal yang lama.

Langkah terakhir itu memiliki panduan keputusannya sendiri, selanjutnya.

## Kapan harus memperbarui vs. memulai perubahan baru

Versi singkat: **perbarui ketika itu adalah pekerjaan yang sama yang disempurnakan; mulai baru ketika niatnya berubah secara fundamental atau lingkupnya meledak menjadi pekerjaan yang berbeda.**

- Tujuan yang sama, pendekatan yang lebih baik? Perbarui.
- Penyempitan lingkup (kirim MVP sekarang, sisanya nanti)? Perbarui, lalu arsipkan, lalu perubahan baru untuk fase dua.
- Masalahnya sendiri yang berubah ("tambahkan mode gelap" menjadi "bangun sistem theming penuh")? Perubahan baru.

Terdapat diagram alir lengkap dan contoh kerja di [Workflows: When to Update vs Start Fresh](workflows.md#when-to-update-vs-start-fresh) dan pembahasan lebih mendalam di [OPSX: When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh).

## Catatan tentang tugas

`tasks.md` adalah daftar periksa yang hidup, bukan rencana yang beku. Saat Anda mengimplementasikan, Anda dapat menambahkan tugas yang Anda temukan, menghapus yang ternyata tidak perlu, atau menyusun ulang mereka. AI mencentang item saat ia menyelesaikannya selama `/opsx:apply`, dan ia melanjutkan dari tugas pertama yang belum dicentang jika Anda kembali nanti. Mengedit daftar di tengah jalan adalah hal yang diharapkan.

## Ke mana harus pergi selanjutnya

- [Workflows](workflows.md) - pola, ditambah panduan keputusan perbarui vs baru
- [Explore First](explore.md) - tempat untuk mundur ketika sebuah ide perlu dipikirkan ulang
- [Commands](commands.md) - `/opsx:continue`, `/opsx:apply`, dan `/opsx:verify` secara rinci
- [Concepts: Artifacts](concepts.md#artifacts) - kegunaan setiap artefak