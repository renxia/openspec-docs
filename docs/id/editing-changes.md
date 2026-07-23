# Mengedit & Mengulang Perubahan

**Setiap artefak dalam perubahan hanyalah file Markdown yang dapat Anda edit kapan saja.** Tidak ada fase perencanaan yang dikunci, tidak ada pintu persetujuan, tidak ada mode edit khusus yang harus dimasuki. Ingin mengubah proposal setelah Anda mulai membangun? Buka `proposal.md` dan ubahlah. Menyadari desainnya salah di tengah implementasi? Perbaiki `design.md` dan lanjutkan. Itu seluruh jawabannya, dan itu sengaja dirancang demikian.

Halaman ini untuk saat Anda berpikir "tunggu, apakah saya bisa kembali dan mengubah itu?" Ya. Berikut caranya, untuk setiap kasus umum.

## Dua cara untuk mengedit apa saja

Anda selalu memiliki keduanya:

1. **Edit file secara langsung.** Artefak adalah Markdown biasa di `openspec/changes/<name>/`. Buka `proposal.md`, `design.md`, `tasks.md`, atau delta spec di bawah `specs/` di editor Anda dan ubahlah. Tidak ada yang lain diperlukan.

2. **Minta AI Anda untuk merevisinya.** Di chat, cukup katakan apa yang Anda inginkan: "Perbarui proposal untuk menghapus ide caching dan tambahkan bagian rate-limit," atau "desain harus menggunakan antrian, bukan polling." AI mengedit artefak untuk Anda, menggunakan sisa perubahan sebagai konteks.

Gunakan yang sesuai dengan saat itu. Perubahan kecil pada kata-kata? Edit file. Pemikiran ulang yang substansial? Biarkan AI merevisi dengan konteks penuh.

## "Bagaimana cara memperbarui proposal (atau spesifikasi) setelah saya memulai?"

Cukup perbarui. Perubahan yang sama, yang disempurnakan.

Jika Anda menggunakan perintah yang diperluas, alur alaminya adalah: edit artefak, kemudian jalankan `/opsx:continue` untuk melanjutkan dari keadaan baru, atau `/opsx:apply` untuk terus mengimplementasikan terhadap rencana yang diperbarui. Jika Anda menggunakan perintah `core` default, edit artefak dan jalankan `/opsx:apply`; itu membaca file saat ini, jadi itu membangun terhadap apapun yang sekarang dikatakan oleh artefak.

Model mental: artefak adalah rencana yang hidup, bukan kontrak yang ditandatangani. AI selalu bekerja dari isi mereka saat ini, jadi mengedit mereka mengarahkan pekerjaan.

```text
Anda: Saya ingin mengubah pendekatan dalam perubahan ini.

Anda: [edit design.md, atau katakan ke AI:]
     Perbarui design.md untuk menggunakan pekerjaan latar belakang alih-alih panggilan sinkron.

AI:  design.md telah diperbarui. Daftar tugas masih cocok; apakah Anda ingin saya terus menerapkan?

Anda: /opsx:apply
```

Ini menjawab pertanyaan yang sangat umum: tidak ada perintah "update proposal" terpisah karena Anda tidak membutuhkannya. File adalah sumber kebenaran, dan mengeditnya (secara manual atau melalui AI) adalah pembaruan.

## "Bagaimana cara kembali untuk meninjau setelah mengimplementasikan?"

Anda tidak harus "kembali", karena Anda tidak pernah pergi. Alur kerja cair: tinjau, edit, dan implementasi bukan fase berurutan yang Anda terjebak di dalamnya.

Secara konkret, setelah beberapa pekerjaan `/opsx:apply`:

- Ingin memeriksa ulang rencana? Buka artefak dan baca mereka, atau jalankan `openspec show <change>` di terminal Anda untuk tampilan yang dikonsolidasikan.
- Menemukan sesuatu yang ingin diubah? Edit artefak (atau minta AI), kemudian lanjutkan.
- Ingin pemeriksaan terstruktur bahwa kode sesuai dengan rencana? Jalankan `/opsx:verify` (perintah yang diperluas). Itu melaporkan kelengkapan, kebenaran, dan koherensi tanpa memblokir apapun. Lihat [Alur Kerja: Verifikasi](workflows.md#verify-check-your-work).

Tidak ada "fase tinjauan" untuk kembali, karena tinjauan adalah sesuatu yang dapat Anda lakukan kapan saja, termasuk setelah implementasi.

## "Saya mengedit kode secara manual. Bagaimana cara menyelaraskannya dengan OpenSpec?"

Ini terjadi terus menerus dan itu tidak masalah. Anda menyesuaikan sesuatu di editor Anda, dan sekarang kode dan artefak tidak setuju. Kembalikan mereka ke sinkronisasi ke arah mana pun yang benar:

- **Kode sekarang benar, spesifikasi sudah ketinggalan zaman.** Perbarui delta spec (dan tugas, jika relevan) untuk menggambarkan perilaku yang sebenarnya Anda kirimkan. Spesifikasi harus sesuai dengan kenyataan sebelum Anda mengarsipkan, karena pengarsipan menggabungkan spesifikasi ke dalam sumber kebenaran Anda.
- **Spesifikasi benar, kode menyimpang.** Terus membangun atau memperbaiki hingga kode sesuai dengan spesifikasi.

Cara cepat untuk menemukan ketidakcocokan adalah `/opsx:verify`: itu membaca artefak dan kode Anda dan memberitahu Anda di mana mereka berbeda. Perlakukan outputnya sebagai daftar tugas untuk rekonsiliasi, kemudian arsipkan setelah mereka setuju.

Prinsip: saat pengarsipan, spesifikasi Anda menjadi kebenaran yang tercatat. Jadi sebelum Anda mengarsipkan, buat spesifikasi tersebut jujur tentang apa yang dilakukan kode. Edit manual dipersilakan; jangan biarkan mereka secara diam-diam menyesinkkan spesifikasi.

## Menyempurnakan proposal yang tidak memuaskan Anda

Jika proposal yang dihasilkan tidak sesuai, Anda memiliki tiga langkah yang baik:

- **Ulangi di tempat.** Katakan ke AI apa yang salah ("cakupannya terlalu luas, hapus fitur admin") dan biarkan merevisi. Paling murah dan biasanya benar.
- **Jelajahi terlebih dahulu, kemudian ajukan ulang.** Jika masalahnya adalah ide itu sendiri tidak jelas, mundur ke `/opsx:explore`, pikirkan dengan baik, dan biarkan proposal yang lebih tajam muncul dari sana. Lihat [Jelajahi Terlebih Dahulu](explore.md).
- **Mulai dari nol.** Jika niatnya telah berubah secara mendasar, perubahan baru dapat lebih jelas daripada menambal yang lama.

Langkah terakhir itu memiliki panduan keputusan sendiri, selanjutnya.

## Kapan memperbarui vs. memulai perubahan baru

Versi singkat: **perbarui ketika itu adalah pekerjaan yang sama yang disempurnakan; mulailah yang baru ketika niatnya berubah secara mendasar atau cakupan meledak menjadi pekerjaan yang berbeda.**

- Tujuan sama, pendekatan lebih baik? Perbarui.
- Penyempitan cakupan (kirim MVP sekarang, lebih banyak nanti)? Perbarui, kemudian arsipkan, kemudian perubahan baru untuk fase dua.
- Masalah itu sendiri berubah ("tambahkan mode gelap" menjadi "bangun sistem tema lengkap")? Perubahan baru.

Ada alur lengkap dan contoh kerja di [Alur Kerja: Kapan Memperbarui vs Memulai dari Nol](workflows.md#when-to-update-vs-start-fresh) dan penanganan lebih dalam di [OPSX: Kapan Memperbarui vs. Memulai dari Nol](opsx.md#when-to-update-vs-start-fresh).

## Catatan tentang tugas

`tasks.md` adalah daftar periksa yang hidup, bukan rencana yang membeku. Saat Anda mengimplementasikan, Anda dapat menambahkan tugas yang Anda temukan, menghapus yang ternyata tidak perlu, atau mengurutkan ulang mereka. AI menandai item selesai saat menyelesaikannya selama `/opsx:apply`, dan itu melanjutkan dari tugas yang belum dicek pertama jika Anda kembali nanti. Mengedit daftar di tengah penerbangan adalah yang diharapkan.

## Ke mana harus pergi selanjutnya

- [Alur Kerja](workflows.md) - pola, plus panduan keputusan pembaruan vs baru
- [Meninjau Perubahan](reviewing-changes.md) - pass dua menit pada rencana sebelum Anda membangunnya
- [Jelajahi Terlebih Dahulu](explore.md) - tempat untuk mundur ketika ide perlu dipikirkan ulang
- [Perintah](commands.md) - `/opsx:continue`, `/opsx:apply`, dan `/opsx:verify` secara detail
- [Konsep: Artefak](concepts.md#artifacts) - untuk apa setiap artefak digunakan