# OpenSpec dalam Tim

Semua yang ada di panduan lain bekerja sama baik Anda bekerja sendiri maupun dalam tim dua puluh orang. Yang berubah saat bekerja dalam tim adalah pertanyaan di sekitar pinggiran: di mana spesifikasi berada, bagaimana rekan tim meninjau rencana, dan bagaimana semua ini cocok dengan alur pull-request yang sudah kita miliki?

Jawabannya singkat: perubahan hanyalah file, dan OpenSpec tidak pernah menyentuh git. Jadi itu cocok dengan alur kerja yang sudah ada alih-alih menggantikannya. Halaman ini menjelaskan konvensi yang bekerja dengan baik.

## Satu aturan: OpenSpec tidak menyentuh git

OpenSpec membaca dan menulis Markdown biasa di bawah `openspec/`. Itu tidak pernah melakukan commit, membuat cabang, push, atau pull di proyek Anda — dan tidak pernah mengkloning atau menyinkronkan [store](stores-beta/user-guide.md) sendiri. Artinya:

- **Anda melakukan commit `openspec/` seperti sumber lainnya.** Spesifikasi, perubahan aktif, dan arsip adalah bagian dari riwayat proyek Anda. (Ya, commit seluruh folder — lihat [FAQ](faq.md#should-i-commit-the-openspec-folder-to-git).)
- **Perubahan adalah folder yang Anda versi seperti kode.** `openspec/changes/add-dark-mode/` hanyalah file di cabang.
- **Semua yang ada di bawah ini adalah konvensi, bukan pengaturan.** OpenSpec tidak akan memaksa Anda melakukannya dengan cara ini; itu hanya cocok dengan rapi.

## Loop sehari-hari

Alur kerja yang bekerja dengan baik memetakan perubahan ke cabang dan pull request:

```
git switch -c add-dark-mode        mulai cabang, seperti biasa
   │
/opsx:propose add-dark-mode        susun rencana (proposal + spesifikasi + tugas)
   │
PERIKSA RENCANA                    Anda membacanya sebelum melihat kode — lihat Memeriksa Perubahan
   │
/opsx:apply                        bangun; artefak + perubahan kode bersama-sama
   │
git commit && open a PR            PR tersebut berisi delta spesifikasi DAN kode
   │
rekan tim meninjau, menggabungkan
   │
/opsx:archive                      gabungkan delta ke specs/, pindahkan perubahan ke archive/
```

Rencana dan kode hidup berdampingan di cabang yang sama, sehingga rekan tim Anda meninjau keduanya bersama-sama, dan enam bulan kemudian spesifikasi yang diarsipkan masih menjelaskan mengapa kode terlihat seperti itu.

## Meninjau spesifikasi dalam pull request

Inilah saat tim merasakan manfaatnya. Ketika PR menyertakan spesifikasi delta perubahan, peninjau mendapatkan sesuatu yang tidak pernah diberikan oleh diff mentah: **pernyataan bahasa sederhana tentang apa yang seharusnya dilakukan perubahan ini**, sebelum mereka membaca satu baris kode pun.

Urutan peninjauan yang baik untuk peninjau:

1. **Baca `proposal.md`** — apakah ini masalah dan cakupan yang tepat?
2. **Baca delta di bawah `specs/`** — apakah "selesai" didefinisikan dengan benar? (Ini adalah tinjauan dua menit [Memeriksa Perubahan](reviewing-changes.md), yang sekarang terjadi di PR.)
3. **Kemudian baca diff kode** — apakah itu memenuhi persis persyaratan tersebut?

Peninjau yang tidak setuju dengan *pendekatan* dapat mengatakannya terhadap proposal, dengan mudah, alih-alih mengulanginya kembali di 300 baris kode. Letakkan spesifikasi delta di bagian atas deskripsi PR, atau tunjukkan peninjau ke folder perubahan, sehingga mereka memulai dari sana.

## Kapan mengarsipkan

Mengarsipkan menggabungkan delta perubahan ke `openspec/specs/` utama Anda dan memindahkan folder perubahan ke `openspec/changes/archive/YYYY-MM-DD-<name>/`. Karena `specs/` adalah **sumber kebenaran bersama**, waktu pelaksanaannya penting dalam tim. Dua konvensi yang dapat diterapkan:

- **Arsipkan setelah PR digabungkan (direkomendasikan).** Cabang membawa perubahan aktif; setelah digabungkan ke cabang utama Anda, arsipkan di sana (seringkali commit kecil lanjutan atau pembersihan terjadwal). Ini membuat `specs/` bersama hanya bergerak maju dengan pekerjaan yang benar-benar dirilis.
- **Arsipkan di dalam PR.** Lebih sederhana untuk tim kecil: PR yang sama yang menambahkan kode juga menyinkronkan dan mengarsipkan. Komprominya adalah bahwa diff `specs/` Anda dan diff kode Anda mendarat bersama-sama, yang dapat membuat PR lebih berisik.

Pilih salah satu dan tetap konsisten. Baik cara yang mana pun, `/opsx:archive` memeriksa bahwa tugas sudah selesai dan menawarkan untuk menyinkronkan terlebih dahulu, sehingga tidak ada yang digabungkan setengah selesai secara tidak sengaja.

## Dua orang, perubahan paralel

Karena perubahan adalah folder terpisah, mereka tidak bertabrakan:

- **Perubahan berbeda, orang berbeda — tidak masalah.** `add-dark-mode` dan `rate-limit-login` adalah folder yang berbeda di cabang yang berbeda; mereka tidak pernah menyentuh satu sama lain sampai keduanya diarsipkan.
- **Satu perubahan, satu pemilik.** Dua orang yang mengedit folder perubahan yang sama akan mengalami konflik persis seperti dua orang yang mengedit file yang sama. Tetapkan satu perubahan untuk satu penulis saja, atau bagi menjadi dua perubahan (alasan lain untuk [menyesuaikan ukuran](writing-specs.md#right-size-the-change)).
- **Satu-satunya tempat konflik muncul adalah di `specs/`.** Jika dua perubahan keduanya memodifikasi *persyaratan yang sama*, pengarsipan yang kedua akan bertentangan di `openspec/specs/…/spec.md` — selesaikan seperti konflik penggabungan biasa, dengan mempertahankan persyaratan yang mencerminkan kenyataan. Ini jarang terjadi, dan itu adalah fitur: git memberitahu Anda bahwa dua perubahan tidak setuju tentang bagaimana sistem harus berperilaku.

## Ketika perencanaan melampaui satu repo

Semua yang di atas mengasumsikan bahwa rencana berada di folder `openspec/` sendiri repo kode, yang merupakan default yang tepat. Ketika perencanaan Anda benar-benar mencakup beberapa repo atau tim — satu fitur yang menyentuh tiga layanan, atau persyaratan yang dimiliki satu tim dan dikonsumsi tim lain — itu adalah fungsi **stores** beta yang digunakan: perencanaan mendapatkan repo sendiri yang dapat diacu oleh repo kode mana pun. Mulai dengan [Panduan Pengguna Stores](stores-beta/user-guide.md).

## Kemampuan selanjutnya

- [Memeriksa Perubahan](reviewing-changes.md) — putaran peninjauan, sekarang di dalam PR Anda.
- [Menulis Spesifikasi yang Baik](writing-specs.md) — termasuk cara menyesuaikan ukuran perubahan agar sesuai dengan satu cabang.
- [Panduan Pengguna Stores](stores-beta/user-guide.md) — perencanaan yang mencakup repo dan tim.