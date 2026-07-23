# Cara Perintah Bekerja

**Satu hal yang perlu diketahui: OpenSpec memiliki dua jenis perintah, dan keduanya berjalan di dua tempat yang berbeda.**

- Perintah `openspec ...` berjalan di **terminal** Anda. (Contoh: `openspec init`.)
- Perintah `/opsx:...` berjalan di **obrolan asisten AI** Anda. (Contoh: `/opsx:propose`.)

Jika Anda pernah mengetik `/opsx:propose` di terminal Anda dan tidak terjadi apa-apa, halaman ini adalah alasannya. Anda sedang berbicara dengan setengah yang salah dari OpenSpec. Perintah slash bukan perintah terminal. Mereka adalah instruksi yang Anda berikan kepada asisten pengkodean AI Anda, di kotak obrolan yang sama tempat Anda biasanya mengetik "tambahkan formulir login".

Satu perbedaan itu adalah rintangan paling umum bagi pengguna baru, jadi mari kita buat sangat jelas.

## Dua setengah

OpenSpec adalah satu proyek yang memakai dua topi.

**CLI (setengah terminal).** Program bernama `openspec` yang Anda instal dan jalankan dari shell Anda. Ia menyiapkan proyek Anda, mencantumkan dan memvalidasi perubahan, menampilkan dasbor, dan mengarsipkan pekerjaan yang selesai. Anda mengetik ini ke iTerm, terminal VS Code, PowerShell, atau tempat mana pun yang biasanya Anda jalankan `git` atau `npm`.

```bash
openspec init        # siapkan OpenSpec di proyek ini
openspec list        # lihat perubahan aktif
openspec view        # buka dasbor interaktif
```

**Perintah slash (setengah obrolan).** Perintah pendek seperti `/opsx:propose` dan `/opsx:apply` yang Anda ketik ke asisten AI Anda. Perintah ini memberi tahu AI untuk mengikuti alur kerja OpenSpec: buat draf proposal, tulis spesifikasi, bangun dari daftar tugas, arsipkan ketika selesai. Anda mengetik ini ke Claude Code, Cursor, Windsurf, Copilot, atau asisten mana pun yang Anda gunakan.

```text
/opsx:propose add-dark-mode    (diketik di obrolan AI Anda)
/opsx:apply                    (diketik di obrolan AI Anda)
/opsx:archive                  (diketik di obrolan AI Anda)
```

Berikut model mentalnya dalam satu gambar:

```text
        TERMINAL ANDA                         OBROLAN ASISTEN AI ANDA
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   menginstal  │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   perintah    │  /opsx:archive                │
   └──────────────────────┘    & skill   └──────────────────────────────┘
        jalankan openspec di sini                       jalankan /opsx:* di sini
```

Perhatikan panah. Menjalankan `openspec init` di terminal Anda adalah yang *menginstal* perintah slash ke dalam alat AI Anda. Setengah terminal menyiapkan setengah obrolan. Setelah itu, pengoperasian sehari-hari sebagian besar terjadi di obrolan.

## "Bagaimana cara memulai mode interaktif?"

**Tidak ada mode interaktif terpisah yang perlu dimulai.** Pertanyaan ini sering muncul, jadi layak mendapatkan jawaban yang jelas.

Anda tidak perlu masuk ke mode OpenSpec khusus. Anda hanya perlu membuka asisten pengkodean AI Anda seperti biasa, dan ketik perintah slash ke obrolan. Perintah slash *adalah* cara Anda "masuk" ke OpenSpec. Asisten Anda mengenalinya, memuat skill OpenSpec yang sesuai, dan mulai mengikuti alur kerja.

Jadi instruksi yang sebenarnya adalah:

1. Buka asisten pengkodean AI Anda (Claude Code, Cursor, Windsurf, dan seterusnya) di proyek Anda.
2. Ketik `/opsx:propose` di obrolannya, tempat yang sama tempat Anda mengetik permintaan lain.
3. Lihat autocomplete: jika OpenSpec terinstal, Anda akan melihat `/opsx:propose`, `/opsx:apply`, dan yang lainnya muncul saat Anda mengetik slash.

Itu saja. Tidak ada mode untuk di-toggle, tidak ada daemon untuk diluncurkan, tidak ada jendela terpisah.

Satu hal yang *benar-benar* interaktif ada di terminal: `openspec view`. Ia membuka dasbor untuk menelusuri spesifikasi dan perubahan Anda. Tapi itu adalah penampil, bukan hal yang Anda usulkan dan bangun. Pembangunan terjadi melalui perintah slash di obrolan.

## Mengapa ada pembagian ini

Layak dipahami, karena ini menjelaskan mengapa OpenSpec bekerja dengan lebih dari 25 alat AI yang berbeda.

CLI adalah **mesin**. Ia tahu aturan: seperti apa folder perubahan, artefak mana yang bergantung pada artefak mana, cara menggabungkan spesifikasi delta ke dalam sumber kebenaran Anda. Ia sama di mana pun.

Perintah slash adalah **setir**, dan setiap alat AI memiliki setir yang sedikit berbeda. Claude Code menyebutnya perintah. Cursor dan Windsurf memiliki format mereka sendiri. Beberapa alat menyebutnya skill. Saat Anda menjalankan `openspec init`, OpenSpec menghasilkan jenis file yang tepat untuk setiap alat yang Anda pilih, sehingga niat `/opsx:propose` yang sama bekerja tidak peduli asisten mana yang Anda gunakan.

Kekuatan desain ini: Anda mempelajari alur kerja sekali dan membawanya ke berbagai alat. Komprominya: sintaks perintah yang tepat bisa sedikit berbeda antar alat, yang akan dibahas di bagian berikutnya.

## Sintaks perintah slash per alat

Niatnya identik di mana pun. Tanda baca berbeda. Gunakan formulir yang sesuai dengan asisten Anda.

| Alat | Cara mengetikkannya |
|------|---------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | gaya skill, misal `/openspec-propose` |
| Codex | gaya skill via `.codex/skills/openspec-*` |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | gaya skill, misal `/skill:openspec-propose` |
| Trae | `/opsx-propose`, `/opsx:apply` |

Sebagian besar alat menggunakan formulir titik dua (`/opsx:propose`) atau formulir garis (`/opsx-propose`). Beberapa alat menampilkan OpenSpec sebagai skill bernama bukan perintah slash; untuk itu Anda memanggil skill dengan nama. Daftar lengkap per alat, termasuk file mana yang ditulis di mana, ada di [Alat yang Didukung](supported-tools.md).

Jika ragu, ketik slash di obrolan AI Anda dan lihat autocomplete. Alat Anda akan menunjukkan formulir yang diharapkan.

## Bagaimana perintah sampai di sana: skill dan perintah

Saat Anda menjalankan `openspec init` (atau `openspec update`), OpenSpec menulis file kecil ke dalam proyek Anda agar alat AI Anda dapat menemukan alur kerja. Bergantung pada alat dan pengaturan Anda, ini adalah **skill**, **perintah**, atau keduanya.

- **Skill** berada di tempat seperti `.claude/skills/openspec-*/SKILL.md`. Mereka adalah standar lintas alat yang sedang muncul: folder instruksi yang asisten Anda deteksi otomatis.
- **Perintah** berada di tempat seperti `.claude/commands/opsx/<id>.md`. Mereka adalah file perintah slash per alat yang lebih lama. Codex tidak mendapatkan file perintah yang dihasilkan; gunakan `.codex/skills/openspec-*`.

Anda tidak perlu peduli alat mana yang menggunakan yang mana. Anda hanya perlu ketik perintah slash dan itu berfungsi. Tapi mengetahui file-file ini ada membantu ketika ada yang salah: jika perintah Anda hilang, biasanya berarti file ini hilang atau usang, dan `openspec update` membuatnya kembali.

Lihat [Alat yang Didukung](supported-tools.md) untuk jalur yang tepat per alat, dan [Panduan Migrasi](migration-guide.md) untuk cara skill menggantikan pendekatan hanya perintah yang lebih lama.

## Memastikan itu terinstal

Pemeriksaan cepat, yang tercepat terlebih dahulu:

1. **Ketik slash di obrolan AI Anda.** Mulai mengetik `/opsx` dan lihat saran autocomplete. Jika muncul, Anda siap.
2. **Cari file.** Untuk Claude Code, periksa bahwa `.claude/skills/` berisi folder `openspec-*`. Alat lain menggunakan direktori mereka sendiri ([Alat yang Didukung](supported-tools.md) memuat daftarnya).
3. **Jalankan ulang penyiapan.** Dari root proyek Anda, jalankan `openspec update`. Ini membuat kembali file skill dan perintah untuk alat apa pun yang Anda konfigurasi.
4. **Mulai ulang asisten Anda.** Banyak alat memindai skill dan perintah saat startup, jadi jendela baru bisa menjadi langkah yang hilang.

## Perintah apa saja yang saya miliki?

Secara default, OpenSpec menginstal set perintah slash **inti**:

- `/opsx:explore`: pikirkan ide dengan AI sebelum berkomitmen pada perubahan (langkah pertama yang bagus ketika Anda tidak yakin)
- `/opsx:propose`: buat perubahan dan buat draf semua artefak perencanaannya dalam satu langkah
- `/opsx:apply`: bangun perubahan dengan bekerja melalui daftar tugasnya
- `/opsx:sync`: gabungkan pembaruan spesifikasi perubahan ke dalam spesifikasi utama Anda (biasanya otomatis)
- `/opsx:archive`: selesaikan perubahan dan simpan di arsip

Irama default yang baik: `explore` ketika Anda menentukan apa yang harus dilakukan, kemudian `propose`, `apply`, `archive`. Panduan [Jelajahi Terlebih Dahulu](explore.md) menjelaskan mengapa langkah pembuka itu berharga.

Ada juga set **diperluas** untuk orang yang ingin kontrol yang lebih halus (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Anda menyalakannya dengan `openspec config profile`, kemudian menerapkannya dengan `openspec update`.

Baru pertama kali dengan semua ini? `/opsx:onboard` (di set diperluas) memandu Anda melalui perubahan lengkap di basis kode Anda sendiri, menceritakan setiap langkah. Ini adalah pengenalan yang paling ramah.

Untuk detail apa yang dilakukan setiap perintah, lihat [Perintah](commands.md). Untuk kapan menggunakan yang mana, lihat [Alur Kerja](workflows.md).

## Run pertama yang bersih

Menggabungkannya, berikut seluruh urutan dengan setiap langkah diberi label tempat di mana itu terjadi.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (menginstal perintah slash ke dalam alat AI Anda)

AI CHAT      /opsx:explore
              (opsional: pikirkan ide dengan AI terlebih dahulu)

AI CHAT      /opsx:propose add-dark-mode
              (AI membuat draf proposal, spesifikasi, desain, tugas)

AI CHAT      /opsx:apply
              (AI membangunnya, menandai tugas selesai)

AI CHAT      /opsx:archive
              (perubahan digabungkan ke dalam spesifikasi Anda dan disimpan di arsip)
```

Dua langkah terminal untuk menyiapkan. Kemudian Anda tinggal di obrolan. Itu iramanya.

## Terkait

- [Memulai](getting-started.md): panduan lengkap perubahan pertama
- [Perintah](commands.md): setiap perintah slash secara detail
- [CLI](cli.md): setiap perintah terminal secara detail
- [Alat yang Didukung](supported-tools.md): sintaks per alat dan lokasi file
- [FAQ](faq.md): lebih banyak jawaban cepat
- [Pemecahan Masalah](troubleshooting.md): perbaikan ketika perintah tidak muncul