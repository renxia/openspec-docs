# Konsep Inti Sekilas

**OpenSpec adalah lapisan perjanjian ringan antara Anda dan AI Anda.** Anda menuliskan apa yang seharusnya dilakukan oleh sebuah perubahan, AI menyusun draf detailnya, kalian berdua melihat rencana yang sama, dan barulah kode ditulis. Halaman ini adalah keseluruhan model mental dalam satu layar. Jika Anda menginginkan versi panjang, [Concepts](concepts.md) memilikinya.

Inilah seluruh ide dalam lima kata: **setuju dulu, lalu bangun dengan percaya diri.**

## Lima Gagasan

Segala sesuatu di OpenSpec dibangun dari lima konsep. Pelajari ini dan sisanya adalah detail.

**1. Spesifikasi adalah kebenaran.** Sebuah spesifikasi menjelaskan bagaimana sistem Anda berperilaku *saat ini*. Ia berada di `openspec/specs/`, diorganisasi berdasarkan domain (`auth/`, `payments/`, `ui/`). Spesifikasi terdiri dari persyaratan ("sistem HARUS mengakhiri sesi setelah 30 menit") dan skenario (contoh konkret given/when/then). Anggaplah spesifikasi sebagai jawaban tunggal yang disepakati untuk "apa yang dilakukan perangkat lunak ini?"

**2. Perubahan adalah satu unit pekerjaan.** Ketika Anda ingin menambahkan, memodifikasi, atau menghapus perilaku, Anda membuat sebuah perubahan: sebuah folder di `openspec/changes/` yang berisi segala hal tentang pekerjaan itu di satu tempat. Sebuah proposal, desain, daftar tugas, dan penyuntingan spesifikasi. Satu perubahan, satu folder, satu fitur.

**3. Delta specs menjelaskan apa yang berubah, bukan seluruh dunia.** Di dalam suatu perubahan, Anda tidak menulis ulang keseluruhan spesifikasi. Anda menulis delta kecil: `ADDED` persyaratan ini, `MODIFIED` yang itu, `REMOVED` yang lainnya. Inilah trik yang membuat OpenSpec bagus untuk mengedit sistem yang sudah ada, bukan hanya sistem baru (green-field). Anda menjelaskan perbedaan (diff), bukan tujuannya (destination).

**4. Artefak dibangun di atas satu sama lain.** Sebuah perubahan berisi beberapa dokumen, dibuat dalam urutan alami, masing-masing memberi makan yang berikutnya:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   mengapa    apa       bagaimana  langkah      lakukan
```

Anda dapat meninjau kembali salah satunya kapan saja. Mereka adalah pendorong (enabler), bukan penghalang (gate). (Lebih lanjut di bawah.)

**5. Pengarsipan memasukkan perubahan kembali ke dalam kebenaran.** Ketika pekerjaan selesai, Anda mengarsipkan perubahannya. Delta spesifikasi-nya digabungkan ke dalam spesifikasi utama Anda, dan folder perubahan dipindahkan ke `changes/archive/` dengan stempel tanggal. Kini spesifikasi Anda menjelaskan realitas yang baru, dan Anda siap untuk perubahan berikutnya. Siklus ditutup.

## Gambaran Umum

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ sumber kebenaran  │  gabung  │ satu folder per perubahan  │    │
│   │ cara segala hal │  ke dalam │ proposal · design ·      │    │
│   │ bekerja         │ archive │ tugas · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Dua folder. `specs/` adalah kebenaran. `changes/` adalah apa yang Anda usulkan. Pengarsipan memindahkan sebuah proposal menjadi kebenaran.

## Alur yang Akan Anda Jalankan

Dalam pengaturan default, hari Anda terlihat seperti ini. Secara opsional pikirkan dulu; lalu satu perintah menyusun draf rencana, Anda membacanya, yang berikutnya membangunnya, dan yang terakhir mengarsipkannya.

```text
/opsx:explore                   →  (opsional) pikirkan bersama AI terlebih dahulu
/opsx:propose add-dark-mode     →  AI menyusun proposal, spesifikasi, desain, tugas
        (Anda membaca dan menyesuaikan rencana)
/opsx:apply                     →  AI membangunnya, mencentang tugas
/opsx:archive                   →  spesifikasi diperbarui, perubahan diarsipkan
```

**Jika ragu, mulailah dengan menjelajahi.** `/opsx:explore` adalah mitra berpikir tanpa risiko: ia membaca kode Anda, menyajikan pilihan, dan mengubah ide yang kabur menjadi rencana konkret sebelum ada artefak yang dibuat. Ini adalah penawar terbaik bagi AI yang sebaliknya akan membangun *sesuatu* dari prompt yang samar. Sudah tahu persis apa yang Anda inginkan? Langsung saja ke `/opsx:propose`. Bagaimanapun juga, menjelajahi disertakan dalam profil default, jadi itu selalu tersedia. Lihat panduan [Explore](explore.md).

Itu adalah perintah slash, diketik di obrolan asisten AI Anda. Pengaturan (`openspec init`) dilakukan di terminal Anda. Jika pemisahan ini masih baru bagi Anda, baca [Cara Kerja Perintah](how-commands-work.md) terlebih dahulu; itu adalah titik kebingungan yang paling umum.

## "Pemberdaya, Bukan Gerbang"

Frasa ini muncul di mana-mana di OpenSpec, jadi inilah artinya dalam istilah sederhana.

Proses spesifikasi ala lama seperti air terjun: selesaikan perencanaan, *baru* Anda diizinkan untuk mengimplementasikan, dan kembali ke belakang itu menyakitkan. OpenSpec menolak hal itu. Urutan `proposal → specs → design → tasks` menunjukkan apa yang menjadi *mungkin* selanjutnya, bukan apa yang *dipaksa* Anda lakukan selanjutnya.

Menemukan selama implementasi bahwa desainnya salah? Edit `design.md` dan teruslah maju. Sadar bahwa ruang lingkup harus dikecilkan? Perbarui proposal. Tidak ada yang terkunci. Ketergantungan itu ada hanya agar AI memiliki konteks yang dibutuhkannya (Anda tidak bisa menulis tugas yang baik tanpa spesifikasi untuk dijadikan dasar), bukan untuk membatasi Anda.

Kekuatan di sini adalah kejujuran: pekerjaan nyata itu berantakan dan iteratif, dan OpenSpec membiarkannya. Komprominya adalah disiplin: karena tidak ada yang memaksa Anda maju, terserah pada Anda untuk menjaga agar perubahan tetap fokus daripada membiarkannya melebar. Panduan [Workflows](workflows.md) memiliki kebiasaan baik untuk itu.

## Mengapa Ini Layak Diberi Beban Kecil

Kebenaran sederhana: OpenSpec menambahkan satu langkah. Anda menulis rencana singkat sebelum membangun. Jadi, apa yang Anda dapatkan sebagai gantinya?

- **Anda menangkap arah yang salah sebelum itu merugikan Anda.** Memperbaiki kesalahpahaman dalam proposal satu paragraf adalah gratis. Memperbaikinya setelah AI menulis 400 baris bukanlah hal yang murah.
- **Rencana dan kode tetap berada di repositori yang sama.** Enam bulan kemudian, spesifikasi memberi tahu Anda (dan sesi AI berikutnya) mengapa sistem itu bekerja seperti adanya.
- **Perubahan dapat ditinjau.** Sebuah folder perubahan adalah paket yang rapi: baca proposalnya, lihat sekilas deltanya, periksa tugasnya. Tidak perlu arkeologi melalui riwayat obrolan.
- **Ini sesuai dengan basis kode yang sudah ada.** Delta berarti Anda dapat menentukan perubahan pada aplikasi 50.000 baris tanpa terlebih dahulu mendokumentasikan semuanya.

Dan kompromi yang jujur: untuk perbaikan satu baris yang benar-benar sepele, upacara tersebut mungkin tidak membuahkan hasil, dan itu tidak apa-apa. OpenSpec dirancang agar ringan, tetapi itu tidak gratis. Gunakan di tempat di mana persetujuan penting, yang ternyata adalah sebagian besar waktu setelah Anda bekerja dengan AI yang akan membangun dengan percaya diri apa pun yang Anda minta secara samar.

## Langkah Selanjutnya

- Baru di sini? [Getting Started](getting-started.md) membahas perubahan pertama secara lengkap.
- Belum yakin apa yang harus dibangun? [Explore First](explore.md) adalah tempat untuk memulai.
- Bingung tentang di mana perintah dijalankan? [How Commands Work](how-commands-work.md).
- Ingin versi mendalam dari semua hal di atas? [Concepts](concepts.md).
- Belajar melalui contoh? [Examples & Recipes](examples.md).
- Perlu definisi istilah? [Glossary](glossary.md).