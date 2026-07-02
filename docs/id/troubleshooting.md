# Pemecahan Masalah

Perbaikan konkret untuk masalah yang nyata. Setiap entri menyebutkan gejala, menjelaskan kemungkinan penyebab dalam satu kalimat, dan memberikan perbaikannya. Jika Anda tidak menemukan masalah Anda di sini, [FAQ](faq.md) mungkin membantu, dan [Discord](https://discord.gg/YctCnvvshC) pasti akan membantu.

## Instalasi dan Pengaturan

### `openspec: command not found`

CLI belum terinstal, atau shell Anda tidak dapat menemukannya. Instal secara global dan periksa:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Jika sudah terinstal tetapi masih tidak ditemukan, kemungkinan direktori bin npm global Anda tidak ada di `PATH`. Jalankan `npm bin -g` untuk melihat lokasi biner global, dan pastikan jalur tersebut ada di profil shell Anda.

### "Requires Node.js 20.19.0 or higher"

OpenSpec berjalan pada Node 20.19.0+. Periksa versi Anda dan tingkatkan jika diperlukan:

```bash
node --version
```

Jika Anda menggunakan bun untuk menginstal OpenSpec, perlu diketahui bahwa OpenSpec tetap *berjalan* di Node, jadi Anda memerlukan Node 20.19.0+ yang tersedia di `PATH` Anda terlepas dari itu. Lihat [Instalasi](installation.md).

### `openspec init` tidak mengonfigurasi alat AI saya

Init menanyakan alat mana yang perlu disiapkan. Jika Anda melewatkan alat Anda atau ingin menambahkan yang lain, jalankan lagi, atau gunakan formulir non-interaktif:

```bash
openspec init --tools claude,cursor
```

Daftar lengkap ID alat ada di [Supported Tools](supported-tools.md). Gunakan `--tools all` untuk semuanya, dan `--tools none` untuk melewati pengaturan alat.

## Perintah tidak muncul

Jika `/opsx:propose` (atau padanan alat Anda) tidak muncul atau tidak melakukan apa-apa, ikuti daftar ini. Mereka diurutkan dari yang tercepat diperiksa terlebih dahulu.

1. **Anda mungkin berada di tempat yang salah.** Perintah slash masuk ke obrolan asisten AI Anda, bukan terminal Anda. Jika Anda mengetik `/opsx:propose` ke dalam shell Anda, itulah masalahnya. Lihat [Cara Kerja Perintah](how-commands-work.md).

2. **Buat ulang file.** Dari root proyek Anda:

   ```bash
   openspec update
   ```

   Ini menulis ulang file skill dan perintah untuk setiap alat yang telah Anda konfigurasikan.

3. **Mulai ulang asisten Anda.** Sebagian besar alat memindai keterampilan dan perintah saat startup. Jendela baru sering kali melakukannya.

4. **Konfirmasi bahwa file tersebut ada.** Untuk Claude Code, periksa apakah `.claude/skills/` berisi folder `openspec-*`. Alat lain menggunakan direktori mereka sendiri, yang semuanya tercantum di [Supported Tools](supported-tools.md).

5. **Periksa apakah Anda menginisialisasi proyek ini.** Keterampilan ditulis per proyek. Jika Anda mengkloning repo atau beralih folder, jalankan `openspec init` (atau `openspec update`) di sana.

6. **Konfirmasi bahwa alat Anda mendukung file perintah.** Beberapa alat (Kimi CLI, Trae, ForgeCode, Mistral Vibe) tidak menghasilkan file perintah `opsx-*`; mereka menggunakan invokasi berbasis skill sebagai gantinya. Formulirnya berbeda per alat: lihat [Supported Tools](supported-tools.md) dan [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

## Bekerja dengan Perubahan

### "Change not found" (Perubahan tidak ditemukan)

Perintah tersebut tidak dapat memberi tahu perubahan mana yang Anda maksudkan. Sebutkan secara eksplisit, atau periksa apa yang ada:

```bash
openspec list                    # lihat perubahan aktif
/opsx:apply add-dark-mode        # sebutkan perubahan di obrolan
```

Pastikan juga Anda berada di direktori proyek yang benar.

### "No artifacts ready" (Tidak ada artefak siap)

Setiap artefak sudah dibuat atau diblokir menunggu dependensi. Lihat apa yang memblokir:

```bash
openspec status --change <name>
```

Kemudian buat dependensi yang hilang terlebih dahulu. Ingat urutannya: proposal memungkinkan spesifikasi dan desain; spesifikasi dan desain bersama-sama memungkinkan tugas.

### `openspec validate` melaporkan peringatan atau kesalahan

Validasi memeriksa spesifikasi dan perubahan Anda untuk masalah struktural. Baca pesannya: ia menyebutkan file dan masalahnya.

```bash
openspec validate <name>           # validasi satu item
openspec validate --all            # validasi semuanya
openspec validate --all --strict   # pemeriksaan yang lebih ketat, bagus untuk CI
```

Penyebab umumnya adalah bagian wajib yang hilang (seperti spesifikasi tanpa skenario) atau header delta yang salah format. Perbaiki file dan jalankan lagi. [CLI reference](cli.md#openspec-validate) mendokumentasikan format outputnya.

### AI membuat artefak yang tidak lengkap atau salah

AI tidak memiliki cukup konteks. Beberapa cara dapat membantu:

- Tambahkan konteks proyek di `openspec/config.yaml` sehingga tumpukan dan konvensi Anda disuntikkan ke dalam setiap permintaan. Lihat [Kustomisasi](customization.md#project-configuration).
- Tambahkan `rules:` per artefak untuk panduan yang hanya berlaku, misalnya, untuk spesifikasi.
- Berikan deskripsi yang lebih rinci saat Anda mengajukan proposal.
- Gunakan `/opsx:continue` yang diperluas untuk membuat satu artefak pada satu waktu dan meninjau setiap satunya, alih-alih `/opsx:ff` melakukannya sekaligus.

### Archive tidak selesai, atau memperingatkan tentang tugas yang tidak lengkap

Archive tidak akan *memblokir* pada tugas yang tidak lengkap, tetapi ia memperingatkan Anda, karena pengarsipan biasanya berarti pekerjaan sudah selesai. Jika tugas tetap ada secara sengaja (Anda mengajukan perubahan parsial), lanjutkan. Jika tidak, selesaikan tugasnya terlebih dahulu. Archive juga akan menawarkan untuk menyinkronkan delta specs Anda ke dalam spesifikasi utama jika Anda belum melakukannya; katakan ya kecuali Anda punya alasan untuk tidak.

## Konfigurasi

### `config.yaml` saya tidak diterapkan

Tiga tersangka umum:

1. **Nama file yang salah.** Harus berupa `openspec/config.yaml`, bukan `.yml`.
2. **YAML tidak valid.** Jalankan melalui validator YAML mana pun; CLI juga melaporkan kesalahan sintaks dengan nomor baris.
3. **Anda mengharapkan restart.** Anda tidak memerlukannya. Perubahan konfigurasi berlaku segera.

### "Unknown artifact ID in rules: X" (ID artefak yang tidak diketahui dalam aturan: X)

Sebuah kunci di bawah `rules:` tidak cocok dengan artefak apa pun dalam skema Anda. Untuk skema default `spec-driven`, ID yang valid adalah `proposal`, `specs`, `design`, `tasks`. Untuk melihat ID untuk skema apa pun:

```bash
openspec schemas --json
```

### "Context too large" (Konteks terlalu besar)

Bidang `context:` dibatasi hingga 50KB, dan itu disengaja, karena ia disuntikkan ke dalam setiap permintaan. Ringkaslah, atau tautkan ke dokumen yang lebih panjang alih-alih menempelkannya. Konteks yang ringkas juga menghasilkan hasil yang lebih baik dan lebih cepat.

### "Schema not found" (Skema tidak ditemukan)

Nama skema yang Anda rujuk tidak ada. Daftarkan apa yang tersedia dan periksa ejaan:

```bash
openspec schemas                    # daftarkan skema yang tersedia
openspec schema which <name>        # lihat dari mana sebuah skema diselesaikan
openspec schema init <name>         # buat satu kustom
```

Lihat [Kustomisasi](customization.md#custom-schemas).

## Migrasi dari alur kerja lama

### "Legacy files detected in non-interactive mode" (File warisan terdeteksi dalam mode non-interaktif)

Anda berada di CI atau shell non-interaktif, dan OpenSpec menemukan file lama untuk dibersihkan tetapi tidak dapat meminta Anda. Setujui secara otomatis:

```bash
openspec init --force
```

### Perintah tidak muncul setelah migrasi

Mulai ulang IDE Anda. Keterampilan dideteksi saat startup. Jika mereka masih tidak muncul, jalankan `openspec update` dan periksa lokasi file di [Supported Tools](supported-tools.md).

### `project.md` lama saya tidak dimigrasikan

Itu disengaja. OpenSpec tidak pernah menghapus `project.md` secara otomatis karena itu mungkin berisi konteks yang Anda tulis. Pindahkan bagian yang berguna ke dalam bagian `context:` dari `config.yaml`, lalu hapus sendiri. [Migration Guide](migration-guide.md#migrating-projectmd-to-configyaml) melalui hal ini, termasuk permintaan yang dapat Anda berikan kepada AI Anda untuk melakukan penyulingan.

## Masih buntu?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dari terminal Anda:** `openspec feedback "what went wrong"` membuka isu untuk Anda.

Ketika Anda melaporkan masalah, sertakan versi OpenSpec Anda (`openspec --version`), versi Node Anda (`node --version`), alat AI Anda, dan perintah serta output yang tepat. Hal ini membuat bantuan jauh lebih cepat.