# Jelajahi Pertama

**`/opsx:explore` adalah mitra berpikir Anda.** Gunakan ia setiap kali Anda memiliki masalah tetapi belum memiliki rencana. Ia menyelidiki basis kode Anda, menimbang pilihan bersama Anda, dan mengklarifikasi apa yang sebenarnya Anda inginkan, semuanya sebelum satu pun artefak atau baris kode dibuat. Ketika gambaran sudah jelas, ia akan menyerahkannya ke `/opsx:propose`.

Jika Anda mengambil satu kebiasaan dari dokumen ini, ambil ini: **ketika Anda tidak yakin, jelajahi sebelum Anda mengusulkan.**

Inilah mengapa itu penting. Asisten pengodean AI sangat antusias. Tanyakan secara samar dan mereka akan dengan percaya diri membangun *sesuatu*, mungkin bukan hal yang Anda butuhkan. Explore adalah obatnya. Ini adalah percakapan tanpa risiko di mana Anda dan AI mencari tahu langkah yang benar bersama-sama, sehingga ketika Anda mengusulkan, Anda mengusulkan hal yang tepat.

## Kapan harus menjelajah (explore)

Explore seringkali merupakan langkah pertama yang tepat lebih dari yang diperkirakan orang. Gunakannya ketika salah satu dari hal berikut ini benar:

- Anda mengetahui *masalahnya* tetapi tidak mengetahui *solusinya*. ("Halaman terasa lambat." "Otentikasi berantakan." "Kami terus mendapatkan pesanan duplikat.")
- Anda sedang memilih di antara berbagai pendekatan dan ingin melihat pertukaran (tradeoffs) dari setiap pilihan terhadap kode Anda yang sebenarnya.
- Anda baru mengenal basis kode dan perlu memahami cara kerja sesuatu sebelum mengubahnya.
- Persyaratan masih samar dan Anda ingin memperjelasnya sebelum berkomitmen.
- Anda menduga bahwa pekerjaan itu lebih besar atau lebih kecil dari kelihatannya dan ingin menentukan ruang lingkupnya secara jujur.

Lewati explore hanya jika Anda sudah tahu persis apa yang Anda inginkan dan bagaimana melakukannya. Dalam kasus tersebut, langsung menuju ke [`/opsx:propose`](commands.md#opsxpropose).

## Apa yang dilakukannya (dan tidak)

Explore adalah **percakapan**, bukan generator.

**Ia melakukan:**
- Membaca dan mencari basis kode Anda untuk menjawab pertanyaan nyata.
- Membandingkan pilihan dan menyebutkan pertukaran (tradeoffs) dari masing-masingnya.
- Menggambar diagram untuk membuat desain mudah dipahami.
- Membantu Anda mempersempit ide yang samar menjadi ruang lingkup yang konkret dan dapat dibangun.
- Beralih ke `/opsx:propose` ketika Anda siap.

**Ia tidak melakukan:**
- Membuat folder perubahan.
- Menulis artefak apa pun (tidak ada proposal, spesifikasi, desain, atau tugas).
- Menulis atau memodifikasi kode.

Itulah intinya. Mengeksplorasi tidak merugikan apa pun dan tidak mengikat Anda pada apa pun. Anda dapat menjelajahi tiga jalan buntu, belajar sesuatu dari masing-masingnya, dan baru kemudian mengusulkan jalur yang berhasil bertahan.

## Sudah terinstal

Kabar baik: `/opsx:explore` disertakan dalam profil **core** bawaan, tepat di samping `propose`, `apply`, `sync`, dan `archive`. Anda tidak perlu mengaktifkan apa pun. Jika OpenSpec telah disiapkan di proyek Anda, explore siap di obrolan AI Anda. (Sama seperti semua perintah `/opsx:*`, Anda mengetiknya di obrolan asisten Anda, bukan di terminal. Lihat [Cara Kerja Perintah](how-commands-work.md).)

## Contoh lengkap

Saksikan bagaimana kekhawatiran yang samar berubah menjadi perubahan yang tajam dan dapat dibangun.

```text
You: /opsx:explore

AI:  Apa yang ingin Anda jelajahi?

You: Terkadang checkout kami membuat pesanan duplikat. Saya tidak tahu mengapa
     dan saya tidak tahu cara memperbaikinya dengan aman.

AI:  Biar saya selami jalur checkout...
     [membaca layanan pemesanan, penangan webhook pembayaran, dan logika kirim klien]

     Inilah yang saya temukan. Ada dua cara duplikasi bisa terjadi:

     1. Klien dapat mengirim dua kali (klik ganda, mencoba lagi pada jaringan lambat).
        Tidak ada mekanisme debounce.
     2. Webhook pembayaran dapat terpicu lebih dari satu kali, dan penangan tersebut
        membuat pesanan setiap saat. Tidak ada kunci idempotensi.

     Penyebab #2 adalah yang berbahaya: ini bisa menagih dan memenuhi dua kali.

     Tiga cara untuk memperbaikinya, kira-kira berdasarkan urutan kekuatannya:
     - Kunci idempotensi pada endpoint pembuatan pesanan (menangani kedua penyebab)
     - Dedup pada webhook menggunakan id intent pembayaran (hanya menangani #2)
     - Debounce di sisi klien (hanya menangani #1, menutupi bug yang sebenarnya)

     Mengingat kode Anda sudah menyimpan id intent pembayaran, pendekatan kunci idempotensi adalah perubahan kecil dengan imbalan terbesar.
     Ingin saya menentukan ruang lingkupnya?

You: Ya, mari kita lakukan kunci idempotensi.

You: /opsx:propose add-order-idempotency-key

AI:  Membuat openspec/changes/add-order-idempotency-key/, dengan proposal
     dan spesifikasi delta yang didasarkan pada apa yang baru saja kami temukan. Siap untuk implementasi.
```

Perhatikan apa yang terjadi. Titik awalnya adalah "ada yang salah dan saya takut menyentuhnya." Dua puluh detik eksplorasi mengubahnya menjadi akar penyebab yang diberi nama, tiga opsi berperingkat, rekomendasi yang terkait dengan kode yang ada, dan perubahan yang presisi. Proposal yang mengikutinya tajam karena pemikiran telah dilakukan terlebih dahulu.

## Menyerahkan ke propose

Explore tidak menyimpan ke dalam apa pun. Ketika Anda siap, Anda cukup memulai sebuah perubahan, dan AI akan membawa konteks dari percakapan Anda ke dalam artefak.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (berpikir)     (setuju)       (membangun)     (mencatat)
```

Anda bisa mengatakannya dalam bahasa biasa ("mari kita jadikan ini sebuah perubahan") atau menjalankan `/opsx:propose <nama>` secara langsung. Bagaimanapun juga, eksplorasi yang baru saja Anda lakukan menjadi fondasi dari proposal, bukan obrolan sekali pakai.

Jika Anda menggunakan set perintah yang diperluas, explore dapat menyerahkan ke `/opsx:new` sebagai gantinya, untuk pembuatan artefak langkah demi langkah. Lihat [Alur Kerja](workflows.md).

## Tips untuk eksplorasi yang baik

- **Bawa masalahnya, bukan solusinya.** "Login terasa lambat" memberi ruang bagi AI untuk menyelidiki. "Tambahkan cache Redis" membuat Anda berkomitmen pada jawaban yang belum Anda uji.
- **Tanyakan pertukaran (tradeoffs) secara lantang.** "Apa kelemahan dari setiap opsi?" akan memberikan perbandingan yang lebih jujur.
- **Biarkan ia membaca terlebih dahulu.** Eksplorasi terbaik dimulai dengan AI benar-benar melihat kode Anda, bukan menebak-nebak. Tunjukilah area yang relevan jika itu membantu.
- **Tidak apa-apa untuk menyerah.** Jika eksplorasi mengungkapkan bahwa ide tersebut tidak sepadan, itu adalah sebuah kemenangan. Anda mempelajarinya dengan murah.
- **Jelajahi lagi di tengah perubahan.** Terjebak selama `/opsx:apply`? Anda dapat mundur dan menjelajahi sub-masalah, lalu kembali.

## Pertukaran yang jujur

**Apa yang Anda peroleh:** explore menangkap belokan yang salah pada saat termurah mungkin, sebelum ada artefak yang ada. Ini sangat kuat dalam kode yang tidak dikenal, di mana kemampuan AI untuk membaca dan meringkas sistem menghemat waktu seharian penyelaman (spelunking).

**Apa yang biayanya:** sedikit kesabaran. Explore adalah percakapan, jadi ia lebih lambat daripada langsung menjalankan `/opsx:propose` dan berharap. Untuk pekerjaan yang Anda pahami dengan tulus-tulusan, langkah tambahan itu murni beban overhead, dan Anda harus melewatinya.

Aturan umumnya: semakin samar tugasnya, semakin besar manfaat dari explore. Semakin jelas tugasnya, semakin banyak Anda dapat langsung melompat ke pengusulan.

## Ke mana selanjutnya

- [Perintah: `/opsx:explore`](commands.md#opsxexplore): referensi yang presisi
- [Alur Kerja](workflows.md): explore sebagai bagian dari siklus sehari-hari
- [Contoh & Resep](examples.md#recipe-3-exploring-before-you-commit): explore dalam panduan lengkap
- [Memulai](getting-started.md): panduan perubahan pertama, termasuk eksplorasi