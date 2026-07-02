# FAQ

Jawaban cepat untuk pertanyaan yang paling sering diajukan. Jika pertanyaan Anda benar-benar tentang "sesuatu rusak," halaman [Troubleshooting](troubleshooting.md) lebih baik. Jika Anda ingin mendefinisikan suatu istilah, lihat [Glossary](glossary.md).

## Dasar-dasar

### Apa itu OpenSpec, dalam satu kalimat?

Lapisan ringan yang membantu Anda dan asisten pengodean AI untuk menyepakati apa yang akan dibangun, secara tertulis, sebelum kode apa pun ditulis.

### Mengapa saya menginginkannya?

Karena asisten AI percaya diri bahkan ketika mereka salah. Ketika persyaratan hanya ada di utas obrol (chat), AI mengisi kekosongan dengan tebakan, dan Anda mengetahuinya setelah kodenya ada. OpenSpec memindahkan kesepakatan lebih awal, di mana kesalahan mudah diperbaiki. Lihat [Core Concepts at a Glance](overview.md) untuk penjelasan lengkapnya.

### Apakah saya harus menggunakannya untuk segalanya?

Tidak. Gunakan di tempat di mana kesepakatan itu penting, yaitu sebagian besar pekerjaan yang tidak sepele. Untuk perbaikan salah ketik satu karakter, upacara tersebut mungkin tidak sepadan, dan itu tidak masalah.

### Bisakah saya menggunakannya pada basis kode yang sudah ada, atau hanya proyek baru?

Basis kode yang sudah ada adalah fokus utamanya. OpenSpec bersifat *brownfield-first*: Anda tidak perlu mendokumentasikan seluruh aplikasi di awal. Anda menulis spesifikasi hanya untuk apa yang disentuh oleh setiap perubahan, dan spesifikasi Anda akan terisi seiring waktu di sekitar pekerjaan yang sebenarnya Anda lakukan. Ada panduan khusus: [Using OpenSpec in an Existing Project](existing-projects.md).

### Apakah ini terikat pada satu alat AI?

Tidak. OpenSpec bekerja dengan 25+ asisten, termasuk Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex, dan lainnya. Daftar lengkap dan detail per alat ada di [Supported Tools](supported-tools.md).

## Menjalankan perintah

### Di mana saya mengetik `/opsx:propose`?

Di obrol asisten AI Anda, bukan di terminal Anda. Ini adalah titik kebingungan yang paling umum, jadi ia memiliki halaman sendiri: [How Commands Work](how-commands-work.md). Versi singkatnya: `openspec ...` dijalankan di terminal, `/opsx:...` dijalankan di chat.

### Bagaimana cara "memulai mode interaktif"?

Tidak ada mode terpisah untuk dimulai. Anda membuka asisten AI Anda seperti biasa dan mengetik perintah garis miring (slash command) ke dalam obrolnya. Perintah garis miring adalah cara Anda "masuk" ke OpenSpec. (Fitur terminal yang benar-benar interaktif adalah `openspec view`, sebuah dasbor untuk menelusuri spesifikasi dan perubahan.) Penjelasan lengkap ada di [How Commands Work](how-commands-work.md).

### Saya mengetik perintah garis miring dan tidak terjadi apa-apa. Mengapa?

Kemungkinan besar Anda mengetiknya di terminal alih-alih di obrol AI Anda, atau perintahnya belum terinstal. Jalankan `openspec update` di proyek Anda, mulai ulang asisten Anda, lalu coba ketik `/opsx` di chat dan perhatikan saran otomatis (autocomplete). [Troubleshooting](troubleshooting.md#commands-dont-show-up) memiliki daftar periksa lengkap.

### Mengapa sintaksnya adalah `/opsx:propose` pada satu alat dan `/opsx-propose` pada yang lain?

Setiap alat AI menampilkan perintah khusus sedikit berbeda. Maksudnya sama; hanya tanda bacanya yang berubah. Ketik garis miring di obrol Anda dan saran otomatis akan menunjukkan bentuk yang diharapkan oleh alat Anda. Tabel per alat ada di [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

### Apa perbedaan antara *skill* dan perintah?

Keduanya adalah file yang ditulis OpenSpec agar asisten Anda dapat menjalankan alur kerja (workflow). *Skills* (`.../skills/openspec-*/SKILL.md`) adalah standar lintas-alat yang lebih baru; perintah (`.../commands/opsx-*`) adalah file garis miring per alat yang lebih lama. Anda tidak perlu memilih. Anda cukup ketik perintah garis miring, dan OpenSpec akan menginstal mana pun yang digunakan oleh alat Anda.

## Alur kerja (Workflow)

### Di mana saya harus mulai jika saya tidak yakin apa yang harus dibangun?

Dengan `/opsx:explore`. Ini adalah mitra berpikir tanpa risiko yang membaca basis kode Anda, menyusun pilihan, dan mengubah masalah yang samar menjadi rencana konkret, semua sebelum ada perubahan atau kode. Ini ada di profil default, jadi selalu tersedia. Ketika rencananya jelas, ia menyerahkan ke `/opsx:propose`. Ini adalah kebiasaan terbaik untuk dibentuk, karena ini menghentikan AI yang bersemangat untuk membangun hal yang salah dengan percaya diri. Lihat [Explore First](explore.md).

### Apa alur kerja paling sederhana?

```text
/opsx:explore (opsional)   kemudian   /opsx:propose <apa yang Anda inginkan>   kemudian   /opsx:apply   kemudian   /opsx:archive
```

Jelajahi untuk memikirkannya, usulkan untuk menyusun rencana, terapkan untuk membangunnya, arsipkan untuk menyimpannya. Lewati eksplorasi jika Anda sudah tahu persis apa yang Anda inginkan.

### Apa perbedaan antara `/opsx:propose` dan `/opsx:new`?

`/opsx:propose` adalah perintah satu langkah default: ia membuat perubahan dan menyusun semua artefak perencanaan sekaligus. `/opsx:new` adalah bagian dari set perintah yang diperluas dan hanya membuat kerangka (scaffolds) perubahan kosong, meninggalkan Anda untuk membuat artefak satu per satu dengan `/opsx:continue` (atau semuanya sekaligus dengan `/opsx:ff`). Gunakan *propose* kecuali Anda menginginkan kontrol langkah demi langkah. Lihat [Commands](commands.md).

### Apa itu profil `core` dan yang diperluas (*expanded*)?

Sebuah profil menentukan perintah garis miring mana yang akan diinstal. **Core** (default) memberi Anda `propose`, `explore`, `apply`, `sync`, `archive`. Set **expanded** menambahkan `new`, `continue`, `ff`, `verify`, `bulk-archive`, dan `onboard` untuk kontrol yang lebih halus. Beralihlah dengan `openspec config profile`, lalu terapkan dengan `openspec update`.

### Apakah saya perlu menjalankan `/opsx:sync`?

Biasanya tidak. Sync menggabungkan spesifikasi delta dari suatu perubahan ke dalam spesifikasi utama Anda, dan `/opsx:archive` akan menawarkan untuk melakukannya untuk Anda. Jalankan sync secara manual hanya jika Anda ingin spesifikasi digabungkan sebelum diarsipkan, misalnya pada perubahan yang berjalan lama. Lihat [Commands](commands.md#opsxsync).

### Bagaimana cara mengedit proposal, spesifikasi, atau tugas setelah saya memulainya?

Cukup edit filenya. Setiap artefak adalah Markdown biasa di `openspec/changes/<name>/`, dan tidak ada fase terkunci atau mode edit khusus. Ubah secara manual, atau minta AI Anda untuk merevisinya ("perbarui desain untuk menggunakan antrian"), lalu lanjutkan. AI selalu bekerja dari isi file saat ini. Panduan lengkap: [Editing & Iterating on a Change](editing-changes.md).

### Bisakah saya kembali dan mengubah rencana setelah mengimplementasikan sebagian darinya?

Ya, kapan saja. Alur kerjanya cair (fluid), jadi peninjauan dan pengeditan bukanlah fase yang membuat Anda terkunci. Edit artefak tersebut, lalu lanjutkan. Jika Anda menginginkan pemeriksaan terstruktur bahwa kode masih sesuai dengan rencana, jalankan `/opsx:verify`. Lihat [Editing & Iterating on a Change](editing-changes.md#how-do-i-go-back-to-review-after-implementing).

### Saya mengedit kodenya secara manual. Bagaimana cara merekonsiliasinya dengan spesifikasi?

Bawa keduanya kembali sinkron sebelum Anda mengarsipkan, karena pengarsipan menjadikan spesifikasi sebagai kebenaran utama (*record of truth*). Jika kode sudah benar, perbarui delta spec agar sesuai dengan apa yang telah Anda kirim; jika spesifiknya benar, teruslah membangun sampai kodenya setuju. `/opsx:verify` menampilkan ketidaksesuaian tersebut. Lihat [Editing & Iterating on a Change](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec).

### Kapan saya harus memperbarui perubahan yang sudah ada versus memulai yang baru?

Perbarui ketika itu adalah pekerjaan yang sama, tetapi disempurnakan. Mulai dari awal ketika niatnya berubah secara fundamental atau cakupannya meledak menjadi pekerjaan yang berbeda. Ada bagan alir keputusan dan contoh di [Workflows](workflows.md#when-to-update-vs-start-fresh).

### Bagaimana jika sesi saya kehabisan konteks, atau persyaratan berubah di tengah implementasi?

Di sinilah spesifikasi membuktikan nilainya. Karena rencana itu hidup dalam file (bukan hanya riwayat obrol), Anda dapat membersihkan konteks, memulai sesi AI yang baru, dan melanjutkan dengan `/opsx:apply`; ia membaca artefak dan melanjutkan dari tugas pertama yang belum diperiksa. Jika persyaratan berubah, edit artefak untuk mencocokkan realitas baru dan lanjutkan. Mempertahankan jendela konteks yang bersih juga menghasilkan hasil yang lebih baik; bersihkan sebelum implementasi.

### Haruskah saya mengunggah folder `openspec/` ke git?

Ya. Spesifikasi, perubahan aktif, dan arsip Anda adalah bagian dari riwayat proyek Anda. Unggahlah seperti sumber lainnya. Arsip khususnya menjadi catatan abadi mengapa sistem Anda bekerja seperti yang dilakukannya.

## Spesifikasi dan Perubahan

### Apa yang masuk dalam spesifikasi versus desain?

Spesifikasi menjelaskan perilaku yang dapat diamati: apa yang dilakukan sistem, masukan (inputs), keluaran (outputs), dan kondisi kesalahan. Desain menjelaskan bagaimana Anda akan membangunnya: pendekatan teknis, keputusan arsitektur, perubahan file. Jika implementasi dapat berubah tanpa mengubah perilaku yang terlihat secara eksternal, itu termasuk dalam desain, bukan spesifikasi. [Concepts](concepts.md#what-a-spec-is-and-is-not) membahas lebih dalam.

### Apa itu delta spec?

Spesifikasi yang hanya menjelaskan apa yang berubah, menggunakan bagian `ADDED`, `MODIFIED`, dan `REMOVED`, daripada menyatakan kembali seluruh spesifikasi. Inilah cara OpenSpec menangani pengeditan pada sistem yang sudah ada dengan bersih. Lihat [Concepts](concepts.md#delta-specs).

### Ke mana perubahan yang diarsipkan disimpan?

Ke `openspec/changes/archive/YYYY-MM-DD-<name>/`, dengan semua artefak dipertahankan. Tidak ada yang dihapus; perubahannya hanya berpindah dari daftar aktif Anda.

## Konfigurasi dan Kustomisasi

### Bagaimana cara memberi tahu AI tentang tumpukan teknologi (*tech stack*) saya?

Masukkan itu ke dalam `openspec/config.yaml` di bawah `context:`. Teks tersebut disuntikkan ke setiap permintaan perencanaan, sehingga AI selalu mengetahui *stack* dan konvensi Anda. Lihat [Customization](customization.md#project-configuration).

### Bisakah saya menghasilkan spesifikasi dalam bahasa selain Inggris?

Ya. Tambahkan instruksi bahasa ke `context:` di konfigurasi Anda. [Multi-Language](multi-language.md) memiliki cuplikan siap salin untuk beberapa bahasa.

### Bisakah saya mengubah alur kerjanya itu sendiri?

Ya, dengan skema khusus (*custom schemas*). Skema mendefinisikan artefak mana yang ada dan bagaimana mereka bergantung satu sama lain. Forklah default dengan `openspec schema fork spec-driven my-workflow`, lalu editlah. Lihat [Customization](customization.md#custom-schemas).

## Model, Privasi, dan Peningkatan (Upgrades)

### Model AI mana yang harus saya gunakan?

OpenSpec bekerja paling baik dengan model penalaran tinggi (*high-reasoning*). README merekomendasikan model seperti Codex 5.5 dan Opus 4.7 untuk perencanaan dan implementasi. Jaga juga jendela konteks Anda tetap bersih: bersihkan sebelum implementasi untuk hasil terbaik.

### Apakah OpenSpec mengumpulkan data?

Ia mengumpulkan statistik penggunaan anonim: nama perintah dan versi saja. Tidak ada argumen, jalur, konten, atau data pribadi, dan itu dinonaktifkan secara otomatis di CI. Opt out dengan `export OPENSPEC_TELEMETRY=0` atau `export DO_NOT_TRACK=1`.

### Bagaimana cara melakukan peningkatan (*upgrade*)?

Dua langkah. Tingkatkan paket (`npm install -g @fission-ai/openspec@latest`), lalu jalankan `openspec update` di setiap proyek untuk menyegarkan *skill* dan perintah yang dihasilkan.

### Bagaimana cara mencopot pemasangan (uninstall) OpenSpec?

Tidak ada perintah pencopotan, karena itu hanyalah paket global ditambah file di proyek Anda. Hapus paketnya (`npm uninstall -g @fission-ai/openspec`), dan opsionalnya hapus direktori `openspec/` dan file alat yang dihasilkan. Langkah demi langkah, termasuk apa yang aman untuk disimpan, ada di [Installation: Uninstalling](installation.md#uninstalling).

## Mendapatkan Bantuan

### Di mana saya mengajukan pertanyaan atau melaporkan bug?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dari terminal Anda:** `openspec feedback "pesan Anda"` akan membuka isu GitHub untuk Anda.

### Dokumentasi ini salah atau membingungkan. Apa yang harus saya lakukan?

Beri tahu kami, atau perbaiki. PR (Pull Request) dokumentasi sangat diterima dan dihargai. Buka isu atau kirimkan permintaan tarik (*pull request*).