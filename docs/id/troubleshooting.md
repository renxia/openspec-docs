# Pemecahan Masalah

Perbaikan konkret untuk masalah konkret. Setiap entri menyebutkan gejala, menjelaskan kemungkinan penyebab dalam satu kalimat, dan memberikan perbaikan untuk Anda. Jika Anda tidak melihat masalah Anda di sini, [FAQ](faq.md) mungkin dapat membantu, dan [Discord](https://discord.gg/YctCnvvshC) pasti dapat membantu.

## Instalasi dan pengaturan

### `openspec: perintah tidak ditemukan`

CLI tidak terinstal, atau shell Anda tidak dapat menemukannya. Instal secara global dan periksa:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Jika sudah terinstal tetapi masih tidak ditemukan, direktori bin npm global Anda kemungkinan tidak ada di `PATH` Anda. Jalankan `npm bin -g` untuk melihat lokasi biner global, dan pastikan jalur tersebut ada di profil shell Anda.

### "Memerlukan Node.js 20.19.0 atau lebih tinggi"

OpenSpec berjalan pada Node 20.19.0+. Periksa versi Anda dan tingkatkan jika diperlukan:

```bash
node --version
```

Jika Anda menggunakan bun untuk menginstal OpenSpec, perhatikan bahwa OpenSpec tetap *berjalan* pada Node, jadi Anda tetap memerlukan Node 20.19.0+ yang tersedia di `PATH` Anda. Lihat [Instalasi](installation.md).

### `openspec init` tidak mengonfigurasi alat AI saya

Init akan bertanya alat mana yang ingin disiapkan. Jika Anda melewatkan alat Anda atau ingin menambahkan alat lain, cukup jalankan lagi, atau gunakan formulir non-interaktif:

```bash
openspec init --tools claude,cursor
```

Daftar lengkap ID alat ada di [Alat yang Didukung](supported-tools.md). Gunakan `--tools all` untuk semua alat, `--tools none` untuk melewatkan penyiapan alat.

## Perintah tidak muncul

Jika `/opsx:propose` (atau yang setara untuk alat Anda) tidak muncul atau tidak melakukan apa-apa, ikuti daftar ini. Daftar diurutkan dari yang tercepat untuk diperiksa terlebih dahulu.

1. **Anda mungkin berada di tempat yang salah.** Perintah slash harus digunakan di chat asisten AI Anda, bukan di terminal Anda. Jika Anda mengetik `/opsx:propose` di shell Anda, itu adalah masalahnya. Lihat [Cara Kerja Perintah](how-commands-work.md).

2. **Hasilkan ulang file.** Dari direktori root proyek Anda:

   ```bash
   openspec update
   ```

   Ini menulis ulang file keterampilan dan perintah untuk setiap alat yang telah Anda konfigurasi.

3. **Mulai ulang asisten Anda.** Kebanyakan alat memindai keterampilan dan perintah saat startup. Jendela baru seringkali dapat mengatasinya.

4. **Konfirmasikan file ada.** Untuk Claude Code, periksa bahwa `.claude/skills/` berisi folder `openspec-*`. Alat lain menggunakan direktori mereka sendiri, semuanya tercantum di [Alat yang Didukung](supported-tools.md).

5. **Periksa apakah Anda telah menginisialisasi proyek ini.** Keterampilan ditulis per proyek. Jika Anda mengkloning repo atau beralih folder, jalankan `openspec init` (atau `openspec update`) di sana.

6. **Konfirmasikan alat Anda mendukung file perintah.** Codex dan beberapa alat lain (CodeArts, Kimi CLI, ForgeCode, Mistral Vibe) tidak menghasilkan file perintah `opsx-*`; mereka menggunakan invokasi berbasis keterampilan sebagai gantinya. Untuk Codex, periksa `.codex/skills/openspec-*`. Bentuknya berbeda per alat: lihat [Alat yang Didukung](supported-tools.md) dan [Cara Kerja Perintah](how-commands-work.md#slash-command-syntax-by-tool).

## Bekerja dengan perubahan

### "Perubahan tidak ditemukan"

Perintah tidak dapat menentukan perubahan mana yang Anda maksud. Beri nama secara eksplisit, atau periksa apa yang ada:

```bash
openspec list                    # lihat perubahan aktif
/opsx:apply add-dark-mode        # beri nama perubahan di chat
```

Juga konfirmasikan Anda berada di direktori proyek yang benar.

### "Tidak ada artefak yang siap"

Setiap artefak sudah dibuat atau diblokir menunggu dependensi. Lihat apa yang memblokir:

```bash
openspec status --change <name>
```

Kemudian buat dependensi yang hilang terlebih dahulu. Ingat urutannya: proposal memungkinkan spesifikasi dan desain; spesifikasi dan desain bersama-sama memungkinkan tugas.

### `openspec validate` melaporkan peringatan atau kesalahan

Validasi memeriksa spesifikasi dan perubahan Anda untuk masalah struktural. Baca pesan: pesan tersebut menyebutkan file dan masalahnya.

```bash
openspec validate <name>           # validasi satu item
openspec validate --all            # validasi semuanya
openspec validate --all --strict   # pemeriksaan lebih ketat, bagus untuk CI
```

Penyebab umum adalah bagian yang diperlukan hilang (seperti spesifikasi tanpa skenario) atau header delta yang salah format. Perbaiki file dan jalankan lagi. [Referensi CLI](cli.md#openspec-validate) mendokumentasikan format keluaran.

### AI membuat artefak yang tidak lengkap atau salah

AI tidak memiliki konteks yang cukup. Beberapa tuas dapat membantu:

- Tambahkan konteks proyek di `openspec/config.yaml` agar tumpukan dan konvensi Anda disisipkan ke setiap permintaan. Lihat [Kustomisasi](customization.md#project-configuration).
- Tambahkan `rules:` per-artefak untuk panduan yang hanya berlaku untuk, misalnya, spesifikasi.
- Berikan deskripsi yang lebih detail saat Anda mengusulkan.
- Gunakan `/opsx:continue` yang diperluas untuk membuat satu artefak pada satu waktu dan meninjau masing-masing, bukan `/opsx:ff` yang membuat semuanya sekaligus.

### Arsip tidak akan selesai, atau memperingatkan tentang tugas yang tidak lengkap

Arsip tidak akan *memblokir* tugas yang tidak lengkap, tetapi akan memperingatkan Anda, karena mengarsipkan biasanya berarti pekerjaan sudah selesai. Jika tugas sengaja tetap ada (Anda mengajukan perubahan parsial), lanjutkan. Jika tidak, selesaikan tugas terlebih dahulu. Arsip juga akan menawarkan untuk menyinkronkan spesifikasi delta Anda ke spesifikasi utama jika Anda belum menyinkronkan; katakan ya kecuali Anda memiliki alasan untuk tidak melakukannya.

## Konfigurasi

### `config.yaml` saya tidak diterapkan

Tiga kandidat yang biasa:

1. **Nama file salah.** Harus berupa `openspec/config.yaml`, bukan `.yml`.
2. **YAML tidak valid.** Jalankan melalui validator YAML apa pun; CLI juga melaporkan kesalahan sintaks dengan nomor baris.
3. **Anda mengharapkan restart.** Anda tidak membutuhkannya. Perubahan konfigurasi berlaku segera.

### "ID artefak tidak diketahui dalam rules: X"

Kunci di bawah `rules:` tidak cocok dengan artefak apa pun di skema Anda. Untuk skema `spec-driven` default, ID yang valid adalah `proposal`, `specs`, `design`, `tasks`. Untuk melihat ID untuk skema apa pun:

```bash
openspec schemas --json
```

### "Konteks terlalu besar"

Bidang `context:` dibatasi pada 50KB, dengan sengaja, karena disisipkan ke setiap permintaan. Ringkaslah, atau tautkan ke dokumen yang lebih panjang alih-alih menempelkannya. Konteks yang ringkas juga menghasilkan hasil yang lebih baik dan lebih cepat.

### "Skema tidak ditemukan"

Nama skema yang Anda referensikan tidak ada. Cantumkan yang tersedia dan periksa ejaan:

```bash
openspec schemas                    # cantumkan skema yang tersedia
openspec schema which <name>        # lihat dari mana skema diselesaikan
openspec schema init <name>         # buat yang kustom
```

Lihat [Kustomisasi](customization.md#custom-schemas).

## Migrasi dari alur kerja lama

### "File lama terdeteksi dalam mode non-interaktif"

Anda berada di CI atau shell non-interaktif, dan OpenSpec menemukan file lama untuk dibersihkan tetapi tidak dapat meminta persetujuan Anda. Setujui secara otomatis:

```bash
openspec init --force
```

Untuk Codex, OpenSpec mungkin mendeteksi file prompt lama yang dikelola di `$CODEX_HOME/prompts` atau `~/.codex/prompts`. Pembersihan tersebut dibatasi pada nama file prompt Codex legacy yang ada dalam daftar putih OpenSpec, dan `openspec init` non-interaktif hanya menghapus file yang penggantinya, yaitu keterampilan `.codex/skills/openspec-*`, ada. `openspec update` non-interaktif membiarkan semua pembersihan legacy tidak tersentuh kecuali Anda meneruskan `--force`.

### Perintah tidak muncul setelah migrasi

Mulai ulang IDE Anda. Keterampilan terdeteksi saat startup. Jika mereka masih tidak muncul, jalankan `openspec update` dan periksa lokasi file di [Alat yang Didukung](supported-tools.md).

### `project.md` lama saya tidak dimigrasikan

Itu disengaja. OpenSpec tidak pernah menghapus `project.md` secara otomatis karena mungkin memegang konteks yang Anda tulis. Pindahkan bagian yang berguna ke bagian `context:` di `config.yaml`, lalu hapus sendiri. [Panduan Migrasi](migration-guide.md#migrating-projectmd-to-configyaml) membahas ini, termasuk prompt yang dapat Anda berikan ke AI Anda untuk melakukan penyulingan.

## Masih kesulitan?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **Isu GitHub:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dari terminal Anda:** `openspec feedback "what went wrong"` membuka isu untuk Anda.

Saat Anda melaporkan masalah, sertakan versi OpenSpec Anda (`openspec --version`), versi Node Anda (`node --version`), alat AI Anda, serta perintah dan keluaran yang tepat. Hal ini membuat bantuan menjadi lebih cepat.