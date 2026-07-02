# Menggunakan OpenSpec dalam Proyek yang Sudah Ada

**Anda tidak mendokumentasikan seluruh basis kode Anda untuk memulai. Anda hanya menulis spesifikasi untuk apa yang akan Anda ubah.** Itulah hal terpenting yang perlu diketahui tentang mengadopsi OpenSpec pada proyek yang sudah ada, dan inilah mengapa OpenSpec dibangun dengan pendekatan *brownfield-first*.

Kekhawatiran umum terdengar seperti ini: "Aplikasi saya berusia 80.000 baris kode. Apakah saya harus menulis spesifikasi untuk semuanya sebelum OpenSpec berguna?" Tidak. Anda akan membenci hal itu, dan kami juga. OpenSpec mengembangkan spesifikasi Anda satu perubahan pada satu waktu. Perubahan pertama Anda mendokumentasikan bagian yang disentuhnya, perubahan berikutnya mendokumentasikan bagiannya, dan seiring berjalannya bulan, spesifikasi Anda secara alami terisi di sekitar pekerjaan yang benar-benar Anda lakukan.

Panduan ini menunjukkan cara untuk memulai sejak hari pertama tanpa mencoba menyelesaikan semuanya sekaligus.

## Versi Tiga Puluh Detik

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

Kemudian, di obrolan AI Anda:

```text
/opsx:explore            # opsional: minta AI membaca area yang akan Anda sentuh
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

Spesifikasi Anda sekarang menjelaskan persis bagian dari sistem yang disentuh oleh perubahan tersebut, dan tidak lebih. Itu benar. Anda selesai mengkhawatirkan 80.000 baris kode lainnya.

## Mengapa *delta-first* adalah Kunci Utamanya

Perubahan OpenSpec ditulis sebagai **deltas**: `ADDED`, `MODIFIED`, `REMOVED`. Delta menjelaskan apa yang berubah relatif terhadap perilaku saat ini, bukan seluruh sistem.

Inilah yang dibutuhkan oleh pekerjaan *brownfield*. Anda jarang membangun dari nol. Anda menambahkan sebuah bidang, memperbaiki pengalihan (*redirect*), memperketat batas waktu (*timeout*). Sebuah delta memungkinkan Anda untuk menentukan satu perubahan secara tepat tanpa harus terlebih dahulu menulis spesifikasi 40 halaman tentang segala sesuatu di sekitarnya.

Jadi direktori `openspec/specs/` Anda tidak dimulai dengan penuh dan lengkap. Ia dimulai hampir kosong dan terakumulasi. Setiap perubahan yang diarsipkan menggabungkan deltanya. Spesifikasi untuk `auth/` baru menjadi menyeluruh setelah Anda membuat beberapa perubahan terkait otentikasi, yang persisnya adalah saat Anda menginginkannya menyeluruh.

Jika Anda ingin tahu mekanika yang lebih dalam, lihat [Concepts: Delta Specs](concepts.md#delta-specs).

## Perubahan Pertama Anda pada Basis Kode Nyata

Pilih sesuatu yang kecil dan nyata. Bukan mainan, bukan penulisan ulang (*rewrite*). Sebuah perubahan yang memang akan Anda lakukan minggu ini. Perubahan awal yang kecil mengajarkan alur kerja dengan risiko rendah.

**Langkah 1: Biarkan AI membaca area yang relevan.** Di sinilah `/opsx:explore` mendapatkan nilainya pada basis kode yang tidak dikenal atau besar. Arahkan ia ke bagian yang akan Anda sentuh dan biarkan ia memetakan cara kerja segala sesuatu sebelum mengajukan apa pun.

```text
Anda: /opsx:explore

AI:  Apa yang ingin Anda jelajahi?

Anda: Saya perlu menambahkan pembatasan laju (*rate limiting*) pada API publik kami, tetapi saya tidak yakin bagaimana permintaan saat ini mengalir melalui *middleware*.

AI:  Biar saya lacak... [membaca router, tumpukan middleware, dan konfigurasi]
     Permintaan mencapai Express, melewati *auth middleware*, kemudian ke *controller* Anda. Saat ini tidak ada lapisan pembatasan laju. Titik penyisipan yang paling bersih adalah *middleware* tepat setelah otentikasi. Mau saya lingkupi?
```

Perhatikan bahwa AI sekarang memahami struktur aktual Anda, sehingga proposal yang ia tulis akan sesuai dengan kode Anda, bukan templat generik. Pada basis kode besar, kebiasaan tunggal ini menghemat penderitaan terbesar. Lihat [Explore First](explore.md).

**Langkah 2: Ajukan perubahan.** Proposal dan delta spesifikasi menangkap hanya perubahan ini.

```text
Anda: /opsx:propose add-api-rate-limiting
```

**Langkah 3: Bangun dan arsipkan** dengan `/opsx:apply` dan `/opsx:archive`, sama seperti perubahan lainnya. Setelah diarsipkan, Anda memiliki spesifikasi nyata untuk perilaku pembatasan laju Anda, lahir dari sebuah perubahan yang memang perlu Anda lakukan.

## Lebih Suka Tur Terpandu? Gunakan *onboard*

Jika Anda lebih suka menyaksikan seluruh perputaran terjadi pada kode Anda sendiri dengan narasi, perintah yang diperluas `/opsx:onboard` melakukan hal tersebut: ia memindai basis kode Anda untuk peningkatan kecil dan aman, kemudian membimbing Anda melalui pengajuan, pembangunan, dan pengarsipannya, menjelaskan setiap langkah.

Aktifkan perintah yang diperluas terlebih dahulu:

```bash
$ openspec config profile      # pilih alur kerja yang diperluas
$ openspec update              # terapkan ke proyek ini
```

Kemudian di obrolan:

```text
/opsx:onboard
```

Ini adalah pengenalan paling lembut pada proyek nyata, dan ia meninggalkan Anda dengan perubahan (kecil) yang asli yang dapat Anda simpan atau buang. Lihat [Commands: `/opsx:onboard`](commands.md#opsxonboard).

## "Tapi Saya Sudah Punya Dokumen Persyaratan"

Mungkin Anda memiliki PRD, SRS, spesifikasi formal, bahkan model TLA+. Bagus. Anda tidak mengimpornya secara keseluruhan, dan Anda juga tidak membuangnya.

Anggap dokumen yang sudah ada sebagai **bahan sumber untuk eksplorasi**, bukan sebagai spesifikasi untuk diubah. Ketika Anda memulai suatu perubahan, tempel atau arahkan AI ke bagian yang relevan, dan biarkan ia membentuk delta OpenSpec yang terfokus darinya. Delta tersebut menangkap perilaku yang sedang Anda ubah sekarang, dalam bentuk persyaratan dan skenario yang dapat diuji oleh OpenSpec. Dokumen asli Anda tetap berada di tempatnya sebagai latar belakang.

Alasan jujurnya: Spesifikasi OpenSpec sengaja dibuat *behavior-first* (berbasis perilaku) dan dibatasi pada perubahan. PRD 40 halaman adalah artefak yang berbeda dengan tugas yang berbeda. Memaksa konversi massal satu kali cenderung menghasilkan spesifikasi besar yang usang dan tidak dipercaya siapa pun. Membiarkan spesifikasi tumbuh dari perubahan nyata menjaganya tetap akurat.

```text
Anda: /opsx:explore
Anda: Ini adalah bagian PRD kami tentang proses *checkout*. Saya akan mengimplementasikan persyaratan "guest checkout" selanjutnya.
     [tempelkan persyaratan yang relevan]
AI:  [membacanya, mengajukan pertanyaan klarifikasi, lalu membantu menentukan lingkup perubahan]
Anda: /opsx:propose add-guest-checkout
```

## Mengorganisasi Spesifikasi dalam Basis Kode Besar

Spesifikasi berada di bawah `openspec/specs/`, dikelompokkan berdasarkan **domain**: area logis yang sesuai dengan cara tim Anda berpikir tentang sistem. Anda tidak harus merancang seluruh taksonomi dari awal. Buat folder domain ketika perubahan pertama di area tersebut membutuhkannya.

Cara umum untuk membagi domain:

- **Berdasarkan area fitur:** `auth/`, `payments/`, `search/`
- **Berdasarkan komponen:** `api/`, `frontend/`, `workers/`
- **Berdasarkan konteks terbatas (*bounded context*):** `ordering/`, `fulfillment/`, `inventory/`

Pilih apa pun yang membuat pendatang baru mengangguk. Anda dapat menyempurnakannya nanti. Lihat [Concepts: Specs](concepts.md#specs).

## Monorepo dan Pekerjaan yang Melintasi Repositori

Untuk monorepo, model paling sederhana adalah satu direktori `openspec/` di akar repositori, dengan domain yang dipetakan ke paket atau layanan Anda. Itu mencakup sebagian besar tim.

Jika pekerjaan Anda benar-benar melintasi **beberapa repositori** (atau beberapa paket yang Anda anggap terpisah), OpenSpec memiliki fitur beta **stores**: perencanaan hidup di repo mandiri yang dapat dirujuk oleh salah satu repositori kode Anda, sehingga rencana tersebut tidak harus hidup di dalam folder `openspec/` dari satu repositori. Ini masih versi beta, jadi perlakukan perintah dan statusnya sebagai sesuatu yang terus berkembang. Mulailah dengan [Stores User Guide](stores-beta/user-guide.md) untuk model mental dan jalur paling berguna.

## Beberapa Peringatan Jujur

- **Tahan godaan untuk mengisi semua hal.** Menulis spesifikasi untuk kode yang tidak Anda ubah terasa produktif dan biasanya tidak demikian. Spesifikasi tersebut menjadi usang, karena tidak ada yang memaksanya melacak kenyataan. Biarkan perubahan nyata mendorong spesifikasi Anda.
- **Jaga agar perubahan awal tetap kecil.** Beberapa perubahan pertama Anda sama pentingnya tentang mempelajari ritme seperti halnya mengirimkannya. Lingkup yang ketat membuat perputaran cepat dan pelajaran murah.
- **Commit `openspec/` ke git.** Spesifikasi dan arsip Anda termasuk dalam kontrol versi bersama dengan kode yang mereka jelaskan.
- **Berikan konteks kepada AI.** Pada basis kode besar dengan konvensi yang kuat, isi `context:` di `openspec/config.yaml` sehingga setiap proposal menghormati tumpukan (*stack*) dan pola Anda. Lihat [Customization](customization.md#project-configuration).

## Ke Mana Selanjutnya

- [Explore First](explore.md) - kebiasaan kunci untuk memahami kode sebelum Anda mengubahnya
- [Getting Started](getting-started.md) - panduan lengkap perubahan pertama
- [Editing & Iterating on a Change](editing-changes.md) - menyesuaikan sebuah perubahan saat Anda belajar
- [Concepts: Delta Specs](concepts.md#delta-specs) - mengapa delta membuat pekerjaan *brownfield* bersih
- [Customization](customization.md) - ajarkan OpenSpec konvensi proyek Anda