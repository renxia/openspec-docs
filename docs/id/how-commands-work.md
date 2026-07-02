# Cara Kerja Perintah

**Satu hal yang perlu diketahui: OpenSpec memiliki dua jenis perintah, dan keduanya berjalan di tempat yang berbeda.**

- Perintah `openspec ...` berjalan di **terminal** Anda. (Contoh: `openspec init`.)
- Perintah `/opsx:...` berjalan di **obrolan asisten AI** Anda. (Contoh: `/opsx:propose`.)

Jika Anda pernah mengetik `/opsx:propose` ke dalam terminal dan tidak terjadi apa-apa, halaman ini adalah jawabannya. Anda sedang berbicara dengan bagian OpenSpec yang salah. Perintah slash bukanlah perintah terminal. Mereka adalah instruksi yang Anda berikan kepada asisten pengodean AI Anda, di kotak obrolan yang sama tempat Anda biasanya mengetik "tambahkan formulir login."

Perbedaan tunggal ini adalah hambatan paling umum bagi pengguna baru, jadi mari kita buat itu sangat jelas.

## Dua Bagiannya

OpenSpec adalah satu proyek yang mengenakan dua topi.

**CLI (Bagian terminal).** Sebuah program bernama `openspec` yang Anda instal dan jalankan dari shell Anda. Ini menyiapkan proyek Anda, mencantumkan dan memvalidasi perubahan, menampilkan dasbor, dan mengarsipkan pekerjaan yang telah selesai. Anda mengetik ini ke iTerm, terminal VS Code, PowerShell, di mana pun Anda menjalankan `git` atau `npm`.

```bash
openspec init        # siapkan OpenSpec dalam proyek ini
openspec list        # lihat perubahan aktif
openspec view        # buka dasbor interaktif
```

**Perintah Slash (Bagian obrolan).** Perintah singkat seperti `/opsx:propose` dan `/opsx:apply` yang Anda ketik ke asisten AI Anda. Ini memberi tahu AI untuk mengikuti alur kerja OpenSpec: membuat draf proposal, menulis spesifikasi, membangun dari daftar tugas, mengarsipkan setelah selesai. Anda mengetik ini ke Claude Code, Cursor, Windsurf, Copilot, atau asisten mana pun yang Anda gunakan.

```text
/opsx:propose add-dark-mode    (diketik di obrolan AI Anda)
/opsx:apply                    (diketik di obrolan AI Anda)
/opsx:archive                  (diketik di obrolan AI Anda)
```

Berikut adalah model mental dalam satu gambar:

```text
        TERMINAL ANDA                         OBROLAN ASISTEN AI ANDA
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   menginstal    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   perintah      │  /opsx:archive                │
   └──────────────────────┘    & skill   └──────────────────────────────┘
        jalankan openspec di sini                       jalankan /opsx:* di sini
```

Perhatikan panah tersebut. Menjalankan `openspec init` di terminal Anda adalah yang *menginstal* perintah slash ke alat AI Anda. Bagian terminal menyiapkan bagian obrolan. Setelah itu, pengoperasian sehari-hari sebagian besar terjadi di obrolan.

## "Bagaimana cara memulai mode interaktif?"

**Tidak ada mode interaktif terpisah untuk dimulai.** Pertanyaan ini sering muncul, jadi ia pantas mendapatkan jawaban yang lugas.

Anda tidak memasuki mode OpenSpec khusus. Anda cukup membuka asisten pengodean AI Anda seperti biasa, dan mengetik perintah slash ke dalam obrolan. Perintah slash *adalah* cara Anda "memasuki" OpenSpec. Asisten Anda mengenalinya, memuat skill OpenSpec yang sesuai, dan mulai mengikuti alur kerja.

Jadi instruksi sebenarnya adalah:

1. Buka asisten pengodean AI Anda (Claude Code, Cursor, Windsurf, dan sejenisnya) di proyek Anda.
2. Ketik `/opsx:propose` di obrolannya, di tempat yang sama saat Anda mengetik permintaan lainnya.
3. Perhatikan saran otomatis (autocomplete): jika OpenSpec terinstal, Anda akan melihat `/opsx:propose`, `/opsx:apply`, dan teman-teman muncul saat Anda mengetik slash.

Cuma itu. Tidak ada mode untuk diganti, tidak ada daemon untuk diluncurkan, tidak ada jendela terpisah.

Satu hal yang *benar-benar* interaktif berada di terminal: `openspec view`. Ini membuka dasbor untuk menjelajahi spesifikasi dan perubahan Anda. Tetapi itu adalah penampil (viewer), bukan hal yang Anda usulkan dan bangun dengannya. Pembangunan terjadi melalui perintah slash di obrolan.

## Mengapa pembagian ini ada

Penting untuk dipahami, karena ini menjelaskan mengapa OpenSpec bekerja dengan 25+ alat AI yang berbeda.

CLI adalah **mesin**. Ia mengetahui aturannya: seperti apa tampilan folder perubahan, artefak mana yang bergantung pada mana, cara menggabungkan delta spec ke dalam sumber kebenaran Anda. Ini sama di mana pun.

Perintah slash adalah **setir**, dan setiap alat AI memiliki setirnya yang sedikit berbeda. Claude Code menyebutnya perintah. Cursor dan Windsurf memiliki format mereka sendiri. Beberapa alat menyebutnya skill. Ketika Anda menjalankan `openspec init`, OpenSpec menghasilkan jenis file yang tepat untuk setiap alat yang Anda pilih, sehingga niat `/opsx:propose` yang sama berfungsi terlepas dari asisten mana pun yang Anda sukai.

Kekuatan desain ini: Anda mempelajari alur kerja sekali dan membawanya ke berbagai alat. Komprominya: sintaks persis dari sebuah perintah dapat sedikit berbeda antar alat, yang merupakan bagian selanjutnya.

## Sintaks Perintah Slash Berdasarkan Alat

Niatnya identik di mana pun. Punctuation-nya berbeda. Gunakan format yang sesuai dengan asisten Anda.

| Alat | Cara mengetiknya |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | skill-style, contohnya `/skill:openspec-propose` |
| Trae | skill-style, contohnya `/openspec-propose` |

Sebagian besar alat menggunakan bentuk titik dua (`/opsx:propose`) atau bentuk tanda hubung (`/opsx-propose`). Beberapa alat menampilkan OpenSpec sebagai skill bernama alih-alih perintah slash; untuk mereka Anda memanggil skill berdasarkan nama. Daftar lengkap per alat, termasuk file mana yang ditulis persis di mana, terdapat di [Supported Tools](supported-tools.md).

Jika ragu, ketikkan sebuah slash di obrolan AI Anda dan lihat saran otomatisnya. Alat Anda akan menunjukkan format yang diharapkan.

## Bagaimana Perintah Itu Ada: Skills dan Commands

Ketika Anda menjalankan `openspec init` (atau `openspec update`), OpenSpec menulis file kecil ke dalam proyek Anda sehingga alat AI Anda dapat menemukan alur kerja. Tergantung pada alat dan pengaturan Anda, ini adalah **skills**, **commands**, atau keduanya.

- **Skills** berada di tempat seperti `.claude/skills/openspec-*/SKILL.md`. Ini adalah standar lintas-alat yang sedang berkembang: folder instruksi yang secara otomatis dideteksi oleh asisten Anda.
- **Commands** berada di tempat seperti `.claude/commands/opsx/<id>.md`. Ini adalah file perintah slash per alat yang lebih lama.

Anda tidak perlu peduli mana yang digunakan alat Anda. Anda cukup mengetik perintah slash dan itu berfungsi. Tetapi mengetahui bahwa file-file ini ada membantu ketika sesuatu berjalan salah: jika perintah Anda hilang, biasanya berarti file-file ini hilang atau kedaluwarsa, dan `openspec update` akan meregenerasinya.

Lihat [Supported Tools](supported-tools.md) untuk jalur persis per alat, dan [Migration Guide](migration-guide.md) untuk bagaimana skill menggantikan pendekatan perintah yang lebih lama.

## Mengonfirmasi bahwa itu terinstal

Pemeriksaan cepat, tercepat dulu:

1. **Ketikkan sebuah slash di obrolan AI Anda.** Mulai mengetik `/opsx` dan perhatikan saran otomatisnya. Jika mereka muncul, Anda siap.
2. **Cari file-file tersebut.** Untuk Claude Code, periksa apakah `.claude/skills/` berisi folder `openspec-*`. Alat lain menggunakan direktori mereka sendiri ([Supported Tools](supported-tools.md) mencantumkannya).
3. **Jalankan ulang setup.** Dari root proyek Anda, jalankan `openspec update`. Ini meregenerasi file skill dan perintah untuk alat apa pun yang Anda konfigurasikan.
4. **Mulai ulang asisten Anda.** Banyak alat memindai skill dan perintah saat startup, jadi jendela baru bisa menjadi langkah yang hilang.

## Perintah Apa Saja yang Saya Miliki?

Secara default, OpenSpec menginstal set **inti** dari perintah slash:

- `/opsx:explore`: pikirkan sebuah ide bersama AI sebelum berkomitmen pada perubahan (langkah pertama yang bagus saat Anda tidak yakin)
- `/opsx:propose`: buat perubahan dan buat draf semua artefak perencanaannya dalam satu langkah
- `/opsx:apply`: bangun perubahan dengan mengerjakan daftar tugasnya
- `/opsx:sync`: gabungkan pembaruan spesifikasi suatu perubahan ke dalam spesifikasi utama Anda (biasanya otomatis)
- `/opsx:archive`: selesaikan sebuah perubahan dan arsipkan

Irama default yang baik: `explore` saat Anda mencari tahu apa yang harus dilakukan, lalu `propose`, `apply`, `archive`. Panduan [Explore First](explore.md) menjelaskan mengapa langkah pembuka ini bermanfaat.

Ada juga set **diperluas** untuk orang-orang yang menginginkan kontrol yang lebih halus (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Anda mengaktifkannya dengan `openspec config profile`, lalu menerapkannya dengan `openspec update`.

Baru dengan semua ini? `/opsx:onboard` (dalam set yang diperluas) memandu Anda melalui perubahan lengkap pada codebase Anda sendiri, menceritakan setiap langkah. Ini adalah perkenalan yang paling ramah.

Untuk apa yang dilakukan setiap perintah secara rinci, lihat [Commands](commands.md). Untuk kapan harus menggunakan yang mana, lihat [Workflows](workflows.md).

## Jalankan Pertama yang Bersih

Menggabungkan semuanya, berikut adalah seluruh urutan dengan setiap langkah diberi label di mana itu terjadi.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (menginstal perintah slash ke alat AI Anda)

AI CHAT      /opsx:explore
              (opsional: pikirkan ide bersama AI terlebih dahulu)

AI CHAT      /opsx:propose add-dark-mode
              (AI membuat draf proposal, spesifikasi, desain, tugas)

AI CHAT      /opsx:apply
              (AI membangunnya, mencentang tugas)

AI CHAT      /opsx:archive
              (perubahan digabungkan ke dalam spesifikasi Anda dan diarsipkan)
```

Dua langkah terminal untuk menyiapkan. Kemudian Anda hidup di obrolan. Itulah iramanya.

## Terkait

- [Getting Started](getting-started.md): panduan walkthrough perubahan pertama yang lengkap
- [Commands](commands.md): setiap perintah slash secara rinci
- [CLI](cli.md): setiap perintah terminal secara rinci
- [Supported Tools](supported-tools.md): sintaks dan lokasi file per alat
- [FAQ](faq.md): jawaban cepat lainnya
- [Troubleshooting](troubleshooting.md): perbaikan ketika perintah tidak muncul