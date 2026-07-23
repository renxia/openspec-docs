# Menulis Spesifikasi yang Baik

Anda jarang menulis spesifikasi dari halaman kosong. Anda mendeskripsikan perubahan dalam bahasa yang jelas, `/opsx:propose` membuat draf persyaratan dan skenario, kemudian Anda menyempurnakannya. Halaman ini membahas bagian terakhir itu — seperti apa yang "baik", dan cara mengarahkan AI ke arah itu. Ini adalah panduan pendamping dari [Meninjau Perubahan](reviewing-changes.md): meninjau adalah menemukan kelemahan di draf, menulis adalah mengetahui apa yang membuat draf yang kuat.

## Spesifikasi adalah perilaku, bukan kode

Spesifikasi menjelaskan apa yang *dilakukan* sistem Anda, dalam istilah yang bisa diverifikasi oleh siapa pun — bukan bagaimana sistem dibangun. Spesifikasi terdiri dari **persyaratan** (pernyataan perilaku) dan **skenario** (contoh konkret yang membuktikannya).

```markdown
### Persyaratan: Batas Waktu Sesi
Sistem SHALL mengakhiri sesi setelah 30 menit tidak ada aktivitas.

#### Skenario: Batas waktu tidak aktif
- GIVEN sesi yang terautentikasi
- WHEN 30 menit berlalu tanpa aktivitas
- THEN sesi diinvalidasi dan pengguna harus mengautentikasi ulang
```

Simpan *bagaimana* — antrian, pustaka, skema tabel — di `design.md` atau di dalam kode. Ketika perilaku dan implementasi tercampur menjadi satu persyaratan, persyaratan itu menjadi tidak bisa diuji dan mulai usang saat kode berubah.

## Apa yang membuat persyaratan yang baik

Persyaratan yang baik adalah satu perilaku, yang dijelaskan dengan sangat jelas sehingga Anda bisa memberikannya ke orang lain untuk diuji.

- **Satu pernyataan, satu `SHALL`/`MUST`.** Jika persyaratan memiliki tiga klausa "dan juga", itu sebenarnya tiga persyaratan. Pisahkan masing-masing.
- **Dapat diamati.** Orang yang tidak mengakses kode harus bisa menentukan apakah persyaratan itu terpenuhi. "Sistem SHALL menampilkan banner kesalahan ketika unggahan melebihi 10 MB" adalah persyaratan yang dapat diamati. "Sistem SHALL menangani unggahan besar dengan baik" bukan.
- **Kekuatan yang tepat.** OpenSpec menggunakan kata kunci dari RFC 2119, dan masing-masing memiliki arti yang berbeda:

  | Kata kunci | Arti |
  |---------|---------|
  | `MUST` / `SHALL` | Persyaratan wajib. Tidak bisa ditawar. |
  | `SHOULD` | Rekomendasi kuat, dengan ruang untuk pengecualian yang dapat dipertanggungjawabkan. |
  | `MAY` | Benar-benar opsional. |

  Gunakan `MUST`/`SHALL` secara default. Gunakan `SHOULD` hanya ketika Anda benar-benar berarti "kecuali ada alasan yang sah untuk tidak melakukannya."

Uji untuk persyaratan: *apakah penguji yang belum pernah melihat kode bisa menentukan apakah persyaratan itu lulus?* Jika tidak, persyaratan itu perlu diperbaiki.

## Apa yang membuat skenario yang baik

Skenario adalah tempat di mana persyaratan terbukti bermanfaat. Setiap skenario adalah GIVEN / WHEN / THEN yang konkret yang bisa diubah menjadi uji otomatis.

- **Skenario harus memenuhi persyaratannya.** Skenario yang hanya mengulang persyaratan dengan kata lain tidak menguji apa-apa. Buatlah menjadi situasi spesifik dengan hasil yang spesifik.
- **Sakupkan kasus yang penting, bukan hanya jalur yang berhasil.** Login yang valid itu mudah. Input kosong, token kadaluarsa, klik kedua, hal yang salah — itulah tempat bug berada, dan tempat di mana skenario paling bernilai.
- **Beri nama kasus pada judul.** "Skenario: Menolak token kadaluarsa" langsung memberitahu peninjau apa yang dicakup dengan sekilas; "Skenario: Tes 2" tidak.

Kebiasaan yang berguna: sebelum menyetujui, tanyakan *apa kasus yang akan saya kesal jika ternyata rusak?* — dan pastikan ada skenario yang menamainya.

## Pilih jenis delta yang tepat

Perubahan mendeskripsikan editnya pada spesifikasi dengan tiga jenis bagian. Menggunakan jenis yang tepat membuat spesifikasi yang diarsipkan tetap akurat:

- **`## ADDED Requirements`** — perilaku sepenuhnya baru yang belum ada sebelumnya.
- **`## MODIFIED Requirements`** — perilaku yang sudah ada dan sedang berubah. Sertakan versi baru lengkap; catatan singkat tentang perubahan yang terjadi membantu peninjau.
- **`## REMOVED Requirements`** — perilaku yang dihapus, dengan penjelasan mengapa.

Saat diarsipkan, ADDED akan ditambahkan ke spesifikasi utama, MODIFIED menggantikan versi lama, dan REMOVED dihapus. Jika Anda menandai perubahan nyata sebagai ADDED, Anda akan mendapatkan dua persyaratan yang bertentangan; jika Anda mendeskripsikan perilaku baru sebagai MODIFIED, tidak ada yang bisa diganti. Jika ragu, buka spesifikasi saat ini dan lihat apakah persyaratan itu sudah ada.

## Sesuaikan ukuran perubahan

Kesalahan penulisan yang paling umum bukanlah persyaratan yang diartikan dengan buruk — melainkan perubahan yang mencoba menjadi tiga perubahan sekaligus.

**Perubahan yang baik memiliki satu tujuan yang bisa Anda jelaskan dalam satu kalimat.** "Tambahkan tombol mode gelap." "Batasi laju permintaan endpoint login." "Migrasi sesi dari cookie." Jika mendeskripsikan perubahan membutuhkan banyak "dan juga", itu adalah sinyal untuk memecahnya menjadi perubahan terpisah.

Tanda perubahan terlalu besar:
- Ruang lingkup proposal terlihat seperti daftar fitur yang tidak terkait.
- Meninjau membutuhkan waktu seharian, jadi tidak ada yang mau melakukannya.
- Dua orang tidak bisa mengerjakannya tanpa bentrok.
- Setengah dari tugasnya bisa dirilis sendiri.

Perubahan yang lebih kecil lebih mudah ditinjau, lebih mudah dibangun dalam satu sesi yang fokus, dan lebih mudah dipahami enam bulan kemudian ketika arsip adalah satu-satunya yang tersisa. Anda selalu bisa menjalankan beberapa perubahan secara paralel — lihat [Mengedit & Mengulang](editing-changes.md) dan [Alur Kerja](workflows.md).

Kebalikannya juga terjadi: perbaikan ketik satu baris tidak membutuhkan tiga persyaratan dan dokumen desain. Sesuaikan tingkat formalitas dengan tingkat dampak perubahan.

## Cara mengarahkan AI ke draf yang baik

Karena `/opsx:propose` membuat draf pertama, kualitas hasil yang Anda dapatkan mengikuti kualitas masukan yang Anda berikan. Anda tidak perlu menulis persyaratan secara manual — Anda hanya perlu mengarahkan AI dengan baik:

- **Sampaikan tujuan dan batasan.** *"Tambahkan tombol mode gelap yang mengikuti pengaturan sistem operasi saat pertama kali dimuat — jangan sentuh API tema yang ada."* Bagian yang di luar ruang lingkup sama pentingnya dengan bagian yang di dalam ruang lingkup.
- **Sebutkan kasus yang Anda pedulikan.** *"Pastikan ada skenario untuk pengguna yang sudah memilih tema secara manual."* AI akan mencakup apa yang Anda sebutkan.
- **Kemudian edit.** Itu adalah Markdown biasa. Perbaiki `SHALL` yang samar, hapus skenario yang tidak menguji apa-apa, tambahkan kasus yang terlewat — atau minta AI untuk: *"persyaratan batas waktu samar, tetapkan menjadi 30 menit."*

Buat draf, perbaiki, ulangi. Beberapa putaran itu akan menghasilkan spesifikasi yang bisa Anda percayai, yang merupakan tujuan utamanya.

## Daftar periksa cepat

- [ ] Setiap persyaratan adalah satu perilaku yang dapat diamati dengan `SHALL`/`MUST`.
- [ ] Tidak ada detail implementasi yang dicampur ke dalam persyaratan.
- [ ] Setiap persyaratan memiliki setidaknya satu skenario yang benar-benar memujinya.
- [ ] Kasus tepi dan kesalahan yang penting memiliki skenario, bukan hanya jalur yang berhasil.
- [ ] Delta menggunakan ADDED / MODIFIED / REMOVED dengan benar sesuai spesifikasi saat ini.
- [ ] Seluruh perubahan memiliki satu tujuan yang bisa Anda jelaskan dalam satu kalimat.

## Langkah selanjutnya

- [Meninjau Perubahan](reviewing-changes.md) — tinjauan dua menit yang menemukan apa yang terlewat.
- [Konsep](concepts.md) — model yang lebih dalam di balik spesifikasi, perubahan, dan delta.
- [Contoh & Resep](examples.md) — perubahan nyata dari awal sampai akhir.