# Referensi CLI

OpenSpec CLI (`openspec`) menyediakan perintah terminal untuk penyiapan proyek, validasi, inspeksi status, dan manajemen. Perintah-perintah ini melengkapi perintah slash AI (seperti `/opsx:propose`) yang didokumentasikan di [Commands](commands.md).

## Ringkasan

| Kategori | Perintah | Tujuan |
|----------|----------|---------|
| **Penyiapan** | `init`, `update` | Inisialisasi dan perbarui OpenSpec di proyek Anda |
| **Penyimpanan (repos OpenSpec mandiri)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Mengelola penyimpanan — repo OpenSpec mandiri yang telah Anda daftarkan |
| **Kesehatan** | `doctor` | Melaporkan kesehatan hubungan untuk akar yang terselesaikan |
| **Konteks kerja** | `context` | Merakit kumpulan kerja (akar + penyimpanan yang dirujuk) |
| **Kumpulan kerja pribadi** | `workset create`, `workset list`, `workset open`, `workset remove` | Menyimpan dan membuka tampilan kerja lokal dan pribadi di alat Anda |
| **Penjelajahan** | `list`, `view`, `show` | Jelajahi perubahan dan spesifikasi |
| **Validasi** | `validate` | Periksa perubahan dan spesifikasi untuk masalah |
| **Siklus hidup** | `archive` | Menyelesaikan perubahan yang telah selesai |
| **Alur kerja** | `new change`, `status`, `instructions`, `templates`, `schemas` | Dukungan alur kerja berbasis artefak |
| **Skema** | `schema init`, `schema fork`, `schema validate`, `schema which` | Membuat dan mengelola alur kerja kustom |
| **Konfigurasi** | `config` | Melihat dan memodifikasi pengaturan |
| **Utilitas** | `feedback`, `completion` | Umpan balik dan integrasi shell |

---

## Perintah Manusia vs Agen

Sebagian besar perintah CLI dirancang untuk **penggunaan manusia** di terminal. Beberapa perintah juga mendukung **penggunaan agen/skrip** melalui keluaran JSON.

### Perintah Khusus Manusia

Perintah ini bersifat interaktif dan dirancang untuk penggunaan terminal:

| Perintah | Tujuan |
|---------|---------|
| `openspec init` | Inisialisasi proyek (prompt interaktif) |
| `openspec view` | Dasbor interaktif |
| `openspec workset open <name>` | Membuka *workset* yang disimpan (jendela editor atau sesi agen terminal) |
| `openspec config edit` | Membuka konfigurasi di editor |
| `openspec feedback` | Mengirim umpan balik melalui GitHub |
| `openspec completion install` | Menginstal penyelesaian shell |

### Perintah Kompatibel Agen

Perintah ini mendukung keluaran `--json` untuk penggunaan terprogram oleh agen AI dan skrip:

| Perintah | Penggunaan Manusia | Penggunaan Agen |
|---------|-----------|-----------|
| `openspec list` | Menjelajahi perubahan/spesifikasi | `--json` untuk data terstruktur |
| `openspec show <item>` | Membaca konten | `--json` untuk parsing |
| `openspec validate` | Memeriksa masalah | `--all --json` untuk validasi massal |
| `openspec status` | Melihat kemajuan artefak | `--json` untuk status terstruktur |
| `openspec instructions` | Mendapatkan langkah selanjutnya | `--json` untuk instruksi agen |
| `openspec templates` | Menemukan jalur template | `--json` untuk resolusi jalur |
| `openspec schemas` | Mendaftar skema yang tersedia | `--json` untuk penemuan skema |
| `openspec store setup <id>` | Membuat dan mendaftarkan penyimpanan lokal | `--json` dengan input eksplisit untuk keluaran pengaturan terstruktur |
| `openspec store register <path>` | Mendaftarkan penyimpanan yang sudah ada | `--json` untuk keluaran pendaftaran terstruktur |
| `openspec store unregister <id>` | Melupakan pendaftaran penyimpanan lokal | `--json` untuk keluaran pembersihan terstruktur |
| `openspec store remove <id>` | Menghapus folder penyimpanan lokal yang terdaftar | `--yes --json` untuk penghapusan non-interaktif |
| `openspec store list` | Menjelajahi penyimpanan yang terdaftar | `--json` untuk pendaftaran terstruktur |
| `openspec store doctor` | Memeriksa pengaturan penyimpanan lokal | `--json` untuk diagnostik terstruktur |
| `openspec new change <id>` | Membuat perancahan perubahan lokal repositori | `--json`, ditambah `--store <id>` untuk menggunakan penyimpanan yang terdaftar sebagai akar OpenSpec |
| `openspec workset create [name]` | Menyusun tampilan kerja pribadi | `--member <path> --json` untuk komposisi non-interaktif |
| `openspec workset list` | Menjelajahi *workset* yang disimpan | `--json` untuk tampilan terstruktur |
| `openspec workset remove <name>` | Menghapus tampilan yang disimpan | `--yes --json` untuk penghapusan non-interaktif |

---

## Opsi Global

Opsi-opsi ini berfungsi dengan semua perintah:

| Opsi | Deskripsi |
|--------|-------------|
| `--version`, `-V` | Menampilkan nomor versi |
| `--no-color` | Menonaktifkan keluaran warna |
| `--help`, `-h` | Menampilkan bantuan untuk perintah |

---

## Perintah Pengaturan

### `openspec init`

Inisialisasi OpenSpec di proyek Anda. Membuat struktur folder dan mengonfigurasi integrasi alat AI.

Perilaku default menggunakan pengaturan global: profil `core`, pengiriman `both`, alur kerja `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `path` | Tidak | Direktori target (default: direktori saat ini) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--tools <list>` | Mengonfigurasi alat AI secara non-interaktif. Gunakan `all`, `none`, atau daftar yang dipisahkan koma |
| `--force` | Pembersihan otomatis file lama tanpa meminta konfirmasi |
| `--profile <profile>` | Menimpa profil global untuk proses inisialisasi ini (`core` atau `custom`) |

`--profile custom` menggunakan alur kerja apa pun yang saat ini dipilih di konfigurasi global (`openspec config profile`).

**ID alat yang didukung (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> Daftar ini mencerminkan `AI_TOOLS` di `src/core/config.ts`. Lihat [Supported Tools](supported-tools.md) untuk keahlian dan jalur perintah setiap alat.

**Contoh:**

```bash
# Inisialisasi interaktif
openspec init

# Inisialisasi di direktori tertentu
openspec init ./my-project

# Non-interaktif: konfigurasikan untuk Claude dan Cursor
openspec init --tools claude,cursor

# Konfigurasi untuk semua alat yang didukung
openspec init --tools all

# Menimpa profil untuk proses ini
openspec init --profile core

# Melewati prompt dan membersihkan file lama secara otomatis
openspec init --force
```

**Apa yang dibuat:**

```
openspec/
├── specs/              # Spesifikasi Anda (sumber kebenaran)
├── changes/            # Perubahan yang diusulkan
└── config.yaml         # Konfigurasi proyek

.claude/skills/         # Keahlian Kode Claude (jika claude dipilih)
.cursor/skills/         # Keahlian Cursor (jika cursor dipilih)
.cursor/commands/       # Perintah OPSX Cursor (jika pengiriman menyertakan perintah)
... (konfigurasi alat lainnya)
```

---

### `openspec update`

Memperbarui file instruksi OpenSpec setelah meningkatkan CLI. Menghasilkan ulang file konfigurasi alat AI menggunakan profil global Anda saat ini, alur kerja yang dipilih, dan mode pengiriman.

```
openspec update [path] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `path` | Tidak | Direktori target (default: direktori saat ini) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--force` | Memaksa pembaruan bahkan ketika file sudah diperbarui |

**Contoh:**

```bash
# Perbarui file instruksi setelah npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Penyimpanan (repositori OpenSpec mandiri)

> **Beta.** Penyimpanan dan fitur yang dibangun di atasnya (referensi, konteks kerja, *workset*) masih baru; nama perintah, bendera, format file, dan keluaran JSON dapat berubah bentuk antar rilis. Untuk panduan berbasis masalah, lihat [stores guide](stores-beta/user-guide.md).

Penyimpanan adalah repositori OpenSpec mandiri yang telah Anda daftarkan di mesin ini — misalnya, repositori perencanaan atau repositori kontrak. Mendaftarkan penyimpanan memungkinkan perintah normal (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) untuk bertindak di dalamnya dari mana saja dengan meneruskan `--store <id>`.

### `openspec store setup`

Membuat dan mendaftarkan penyimpanan lokal. Tanpa argumen di terminal, OpenSpec memandu pengguna melalui pengaturan. Agen dan skrip harus memberikan input eksplisit dan menggunakan `--json`.

```bash
openspec store setup [id] [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--path <path>` | Folder tempat penyimpanan harus berada (misalnya `~/openspec/<id>`) |
| `--remote <url>` | Mencatat *remote* kanonis di `store.yaml` penyimpanan baru |
| `--init-git` | Menginisialisasi repositori Git dengan komit awal (default) |
| `--no-init-git` | Melewati setiap tindakan Git: tanpa inisialisasi, tanpa komit awal |
| `--json` | Keluaran JSON |

Jalankan secara non-interaktif (`--json`, skrip, agen) harus memberikan ID penyimpanan dan `--path`. Dalam terminal interaktif, pengaturan meminta lokasi dengan saran yang dapat diedit di tempat yang terlihat dan dimiliki pengguna (misalnya `~/openspec/<id>`); ini tidak pernah menggunakan direktori data terkelola OpenSpec secara default.

Contoh:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Mendaftarkan folder penyimpanan lokal yang sudah ada.

```bash
openspec store register [path] [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--id <id>` | ID penyimpanan; default ke metadata penyimpanan atau nama folder |
| `--yes` | Mengonfirmasi pembuatan metadata identitas penyimpanan untuk akar OpenSpec yang sehat |
| `--json` | Keluaran JSON |

### `openspec store unregister`

Melupakan pendaftaran penyimpanan lokal tanpa menghapus file.

```bash
openspec store unregister <id> [--json]
```

Gunakan ini ketika sebuah penyimpanan dipindahkan, di-*clone* ke tempat lain, atau tidak boleh lagi ditampilkan oleh OpenSpec di mesin ini.

### `openspec store remove`

Melupakan pendaftaran penyimpanan lokal dan menghapus folder lokalnya.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` menunjukkan folder yang tepat sebelum menghapusnya dalam terminal interaktif. Agen, skrip, dan pemanggil JSON harus menggunakan `--yes` untuk mengonfirmasi penghapusan. OpenSpec menolak untuk menghapus folder yang tidak berisi metadata penyimpanan yang cocok.

### `openspec store list`

Mendaftar penyimpanan yang terdaftar secara lokal.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Memeriksa pendaftaran penyimpanan lokal, metadata, dan keberadaan Git.

```bash
openspec store doctor [id] [--json]
```

*Doctor* hanya bersifat diagnostik; ia melaporkan akar yang hilang, ketidakcocokan metadata, dan status registri lokal yang tidak valid tanpa memodifikasi penyimpanan.

### Mereferensikan penyimpanan dari sebuah proyek

Sebuah repositori proyek dapat mendeklarasikan penyimpanan mana yang digunakan oleh kerjanya di `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

Sejak saat itu, keluaran `openspec instructions` di repositori tersebut (baik permukaan per artefak maupun `apply`, mode JSON dan manusia) membawa indeks dari spesifikasi setiap penyimpanan yang direferensikan — ID spesifikasi, ringkasan satu baris dari bagian Tujuan setiap spesifikasi, dan perintah pengambilan (`openspec show <spec-id> --type spec --store <id>`). Indeks dibangun secara langsung dari *checkout* yang terdaftar pada setiap eksekusi; konten spesifikasi tidak pernah disalin ke dalam keluaran.

Referensi bersifat konteks baca-saja. Mereka tidak pernah berubah di mana perintah bertindak: pekerjaan tetap berada di akar repositori itu sendiri, dan penulisan ke penyimpanan yang direferensikan tetap merupakan tindakan `--store` eksplisit. Referensi yang tidak dapat diselesaikan (misalnya, penyimpanan yang tidak terdaftar di mesin ini) menurun menjadi peringatan dalam indeks dengan perbaikan yang tepat, dan instruksi tetap dihasilkan. `openspec doctor` melaporkan kesehatan referensi di satu tempat.

### Mencatat dari mana sebuah penyimpanan di-*clone*

Sebuah penyimpanan dapat mencatat sumber *clone* kanonisnya dalam file identitas yang dikomit, sehingga proses orientasi tidak pernah berakhir pada "daftar penyimpanan":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

*Remote* tersebut masuk ke `.openspec-store/store.yaml` di dalam komit awal, sehingga setiap *clone* lahir dengan mengetahui hal itu. Untuk penyimpanan yang sudah ada, edit `store.yaml` secara manual dan lakukan komit. `store doctor` menunjukkan *remote* yang tercatat (dan asal Git yang diamati oleh *checkout*); `setup`/`register` berbagi nama panduan; dan `register` mencatat asal *checkout* di registri lokal mesin.

Deklarasi referensi juga dapat membawa sumber *clone*, sehingga rekan tim yang belum memiliki penyimpanan mendapatkan perbaikan lengkap yang dapat ditempel (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Mencatat *remote* bukanlah sinkronisasi: OpenSpec tidak pernah melakukan *clone*, *pull*, atau *push* sendiri.

### Mendeklarasikan penyimpanan default

Sebuah repositori yang perencanaannya sepenuhnya dieksternalisasi — tanpa `openspec/specs/` lokal atau `openspec/changes/` — dapat mendeklarasikan penyimpanannya sekali alih-alih meneruskan `--store` pada setiap perintah:

```yaml
# openspec/config.yaml (satu-satunya file di bawah openspec/)
store: team-context
```

Perintah normal kemudian diselesaikan ke penyimpanan yang dideklarasikan secara otomatis; *banner* akar dan blok `root` JSON melaporkan `source: "declared"` dengan ID penyimpanan, dan petunjuk cetak masih membawa `--store <id>`. Deklarasi adalah cadangan, tidak pernah penimpaan: `--store` eksplisit selalu menang, dan direktori dengan folder perencanaan nyata mengabaikan pointer (dengan peringatan). Untuk mengubah repositori *pointer* menjadi akar OpenSpec lokal, hapus baris `store:` dan jalankan `openspec init` — inisialisasi menolak untuk membuat perancahan selama deklarasi ada.

## Doctor (kesehatan relasi)

Satu pertanyaan read-only, satu tempat: apakah root OpenSpec sehat, dan apakah toko yang dirujuk tersedia pada mesin ini?

```bash
openspec doctor [--store <id>] [--json]
```

Laporan memisahkan kesehatan root, kesehatan metadata toko (termasuk catatan ketika remote yang tercatat dan asal checkout berbeda), dan kesehatan referensi (instruksi diagnostik yang sama ditampilkan, dengan perbaikan clone untuk referensi yang belum terselesaikan). Temuan kesehatan apa pun dengan tingkat keparahan tertentu keluar 0 — agen membaca array `status`; hanya kegagalan perintah (tidak ada root, toko tidak diketahui) yang keluar 1. Doctor tidak pernah melakukan clone, sinkronisasi, atau perbaikan. Untuk mendapatkan set yang dirakit itu sendiri alih-alih kesehatannya, gunakan `openspec context`.

## Konteks kerja (set yang dirakit)

Segala hal yang berkaitan dengan pekerjaan ini melalui deklarasi OpenSpec, dalam satu set kerja: root OpenSpec dan toko yang dirujuknya.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Ringkasan JSON dapat dikonsumsi oleh agen (setiap toko referensi yang tersedia membawa resep fetch-nya; anggota yang belum terselesaikan membawa instruksi perbaikan yang sama dan ditampilkan oleh doctor). `--code-workspace` secara tambahan menulis file workspace VS Code yang berisi root ditambah toko referensi yang tersedia (`ref:<id>` folder) — satu-satunya hal yang dilakukan perintah ini, ditolak tanpa `--force` jika file tersebut ada. Anggota yang tidak tersedia dilaporkan, tidak pernah ditebak.

"Konteks kerja" adalah set yang dirakit; bidang `context:` dalam `openspec/config.yaml` adalah latar belakang proyek yang disuntikkan ke dalam instruksi — dua hal yang berbeda. `openspec doctor` menjawab apakah set tersebut sehat; `openspec context` menjawab apa set tersebut.

## Personal worksets

> **Beta.** Worksets adalah bagian dari permukaan beta baru; perintah, flag, dan format file dapat berubah antar rilis. Untuk panduan, lihat [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Workset adalah tampilan bernama pribadi dari folder yang Anda kerjakan bersama — sebuah root perencanaan ditambah apa pun yang Anda pilih — disimpan di mesin Anda dan dibuka kembali dengan nama di alat Anda. Ini murni lokal: tidak pernah di-*commit*, tidak pernah dibagikan, tidak pernah diturunkan dari deklarasi, dan menghapus satu sama sekali tidak menyentuh folder anggota.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` menjalankan alur panduan singkat (atau menerima flag `--member` secara non-interaktif; anggota pertama adalah utama — sesi dimulai dari sana). `open` meluncurkan alat yang dipilih: editor (VS Code, Cursor) membuka jendela dengan setiap anggota dan kembali; agen CLI (Claude Code, codex) mengambil alih terminal ini sebagai sesi dengan setiap anggota terlampir dan tanpa prompt diisi sebelumnya, berakhir ketika Anda keluar. Folder anggota yang hilang saat dibuka dilewati dengan catatan; sisanya terbuka. Preferensi alat yang disimpan dapat ditimpa per buka menggunakan `--tool`.

Mendukung alat baru adalah konfigurasi, bukan kode. Setiap alat adalah salah satu dari dua gaya peluncuran — `workspace-file` (diluncurkan dengan `.code-workspace` yang dihasilkan) atau `attach-dirs` (satu flag lampiran per anggota) — dan kunci `openers` di `config.json` global (buka dengan `openspec config edit`) menambahkan alat atau menyesuaikan bawaan per bidang:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Semua status workset hidup di folder `worksets/` direktori data global (tampilan yang disimpan ditambah file `<name>.code-workspace` yang dihasilkan, diregenerasi pada setiap buka); menghapus folder tersebut menghilangkan jejaknya.

---

## Browsing Commands

### `openspec list`

Daftar perubahan atau spesifikasi di proyek Anda.

```
openspec list [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--specs` | Daftar spesifikasi alih-alih perubahan |
| `--changes` | Daftar perubahan (default) |
| `--sort <order>` | Urutkan berdasarkan `recent` (default) atau `name` |
| `--json` | Keluaran sebagai JSON |

**Contoh:**

```bash
# Daftar semua perubahan aktif
openspec list

# Daftar semua spesifikasi
openspec list --specs

# Keluaran JSON untuk skrip
openspec list --json
```

**Keluaran (teks):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Tampilkan dasbor interaktif untuk menjelajahi spesifikasi dan perubahan.

```
openspec view
```

Membuka antarmuka berbasis terminal untuk menavigasi spesifikasi dan perubahan proyek Anda.

---

### `openspec show`

Tampilkan detail suatu perubahan atau spesifikasi.

```
openspec show [item-name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `item-name` | Tidak | Nama perubahan atau spesifikasi (meminta jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--type <type>` | Tentukan tipe: `change` atau `spec` (terdeteksi secara otomatis jika tidak ambigu) |
| `--json` | Keluaran sebagai JSON |
| `--no-interactive` | Nonaktifkan permintaan |

**Opsi spesifik Perubahan:**

| Opsi | Deskripsi |
|--------|-------------|
| `--deltas-only` | Tampilkan hanya delta spec (mode JSON) |

**Opsi spesifik Spesifikasi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--requirements` | Tampilkan hanya persyaratan, kecualikan skenario (mode JSON) |
| `--no-scenarios` | Kecualikan konten skenario (mode JSON) |
| `-r, --requirement <id>` | Tampilkan persyaratan tertentu berdasarkan indeks 1 (mode JSON) |

**Contoh:**

```bash
# Seleksi interaktif
openspec show

# Tunjukkan perubahan spesifik
openspec show add-dark-mode

# Tunjukkan spesifikasi spesifik
openspec show auth --type spec

# Keluaran JSON untuk parsing
openspec show add-dark-mode --json
```

---

## Validation Commands

### `openspec validate`

Validasi perubahan dan spesifikasi untuk masalah struktural.

```
openspec validate [item-name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `item-name` | Tidak | Item spesifik yang akan divalidasi (meminta jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--all` | Validasi semua perubahan dan spesifikasi |
| `--changes` | Validasi semua perubahan |
| `--specs` | Validasi semua spesifikasi |
| `--type <type>` | Tentukan tipe ketika nama ambigu: `change` atau `spec` |
| `--strict` | Aktifkan mode validasi ketat |
| `--json` | Keluaran sebagai JSON |
| `--concurrency <n>` | Maksimum validasi paralel (default: 6, atau env `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Nonaktifkan permintaan |

**Contoh:**

```bash
# Validasi interaktif
openspec validate

# Validasi perubahan spesifik
openspec validate add-dark-mode

# Validasi semua perubahan
openspec validate --changes

# Validasi semuanya dengan keluaran JSON (untuk CI/skrip)
openspec validate --all --json

# Validasi ketat dengan paralelisme yang ditingkatkan
openspec validate --all --strict --concurrency 12
```

**Keluaran (teks):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**Keluaran (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Lifecycle Commands

### `openspec archive`

Arsipkan perubahan yang selesai dan gabungkan delta spec ke dalam spec utama.

```
openspec archive [change-name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan untuk diarsipkan (meminta jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `-y, --yes` | Lewati permintaan konfirmasi |
| `--skip-specs` | Lewati pembaruan spec (untuk perubahan infrastruktur/tooling/doc-only) |
| `--no-validate` | Lewati validasi (memerlukan konfirmasi) |

**Contoh:**

```bash
# Arsip interaktif
openspec archive

# Arsipkan perubahan spesifik
openspec archive add-dark-mode

# Arsipkan tanpa permintaan (CI/skrip)
openspec archive add-dark-mode --yes

# Arsipkan perubahan tooling yang tidak memengaruhi spec
openspec archive update-ci-config --skip-specs
```

**Apa yang dilakukannya:**

1. Memvalidasi perubahan (kecuali `--no-validate`)
2. Meminta konfirmasi (kecuali `--yes`)
3. Menggabungkan delta spec ke `openspec/specs/`
4. Memindahkan folder perubahan ke `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Workflow Commands

Perintah-perintah ini mendukung alur kerja OPSX berbasis artefak. Perintah ini berguna bagi manusia yang memeriksa kemajuan dan agen yang menentukan langkah selanjutnya.

### `openspec new change`

Buat direktori perubahan dan metadata *checked-in* opsional di root OpenSpec yang diselesaikan.

```bash
openspec new change <name> [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--description <text>` | Deskripsi untuk ditambahkan ke `index.md` |
| `--goal <text>` | Metadata tujuan opsional untuk disimpan bersama perubahan |
| `--schema <name>` | Skema alur kerja yang akan digunakan |
| `--store <id>` | ID toko yang digunakan sebagai root OpenSpec (toko adalah repo OpenSpec mandiri yang telah Anda daftarkan) |
| `--json` | Keluaran JSON |

Contoh:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Tampilkan status penyelesaian artefak untuk suatu perubahan.

```
openspec status [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--change <id>` | Nama perubahan (meminta jika dihilangkan) |
| `--schema <name>` | Penimpaan skema (terdeteksi secara otomatis dari konfigurasi perubahan) |
| `--json` | Keluaran sebagai JSON |

**Contoh:**

```bash
# Pemeriksaan status interaktif
openspec status

# Status untuk perubahan spesifik
openspec status --change add-dark-mode

# JSON untuk penggunaan agen
openspec status --change add-dark-mode --json
```

**Keluaran (teks):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**Keluaran (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Dapatkan instruksi yang diperkaya untuk membuat artefak atau menerapkan tugas. Digunakan oleh agen AI untuk memahami apa yang harus dibuat selanjutnya.

```
openspec instructions [artifact] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `artifact` | Tidak | ID Artefak: `proposal`, `specs`, `design`, `tasks`, atau `apply` |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--change <id>` | Nama perubahan (wajib dalam mode non-interaktif) |
| `--schema <name>` | Penimpaan skema |
| `--json` | Keluaran sebagai JSON |

**Kasus khusus:** Gunakan `apply` sebagai artefak untuk mendapatkan instruksi implementasi tugas.

**Contoh:**

```bash
# Dapatkan instruksi untuk artefak berikutnya
openspec instructions --change add-dark-mode

# Dapatkan instruksi artefak spesifik
openspec instructions design --change add-dark-mode

# Dapatkan instruksi apply/implementasi
openspec instructions apply --change add-dark-mode

# JSON untuk konsumsi agen
openspec instructions design --change add-dark-mode --json
```

**Keluaran mencakup:**

- Konten template untuk artefak
- Konteks proyek dari konfigurasi
- Konten dari artefak dependensi
- Aturan per-artefak dari konfigurasi

---

### `openspec templates`

Tampilkan jalur template yang diselesaikan untuk semua artefak dalam sebuah skema.

```
openspec templates [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--schema <name>` | Skema yang akan diperiksa (default: `spec-driven`) |
| `--json` | Keluaran sebagai JSON |

**Contoh:**

```bash
# Tampilkan jalur template untuk skema default
openspec templates

# Tampilkan template untuk skema kustom
openspec templates --schema my-workflow

# JSON untuk penggunaan programatik
openspec templates --json
```

**Keluaran (teks):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Daftar skema alur kerja yang tersedia beserta deskripsi dan aliran artefak mereka.

```
openspec schemas [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--json` | Keluaran sebagai JSON |

**Contoh:**

```bash
openspec schemas
```

**Keluaran:**

```
Available schemas:

  spec-driven (package)
    Alur kerja pengembangan spec-driven default
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Alur kerja kustom untuk proyek ini
    Flow: research → proposal → tasks
```

## Perintah Skema

Perintah untuk membuat dan mengelola skema alur kerja kustom.

### `openspec schema init`

Membuat skema lokal proyek yang baru.

```
openspec schema init <name> [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `name` | Ya | Nama skema (kebab-case) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--description <text>` | Deskripsi skema |
| `--artifacts <list>` | ID artefak yang dipisahkan koma (default: `proposal,specs,design,tasks`) |
| `--default` | Atur sebagai skema default proyek |
| `--no-default` | Jangan diminta untuk dijadikan default |
| `--force` | Menimpa skema yang sudah ada |
| `--json` | Output dalam format JSON |

**Contoh:**

```bash
# Pembuatan skema interaktif
openspec schema init research-first

# Non-interaktif dengan artefak spesifik
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Apa yang dibuat:**

```
openspec/schemas/<name>/
├── schema.yaml           # Definisi skema
└── templates/
    ├── proposal.md       # Template untuk setiap artefak
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Menyalin skema yang sudah ada ke proyek Anda untuk kustomisasi.

```
openspec schema fork <source> [name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `source` | Ya | Skema yang akan disalin |
| `name` | Tidak | Nama skema baru (default: `<source>-custom`) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--force` | Menimpa tujuan yang sudah ada |
| `--json` | Output dalam format JSON |

**Contoh:**

```bash
# Fork skema spec-driven bawaan
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Memvalidasi struktur dan template suatu skema.

```
openspec schema validate [name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `name` | Tidak | Skema yang akan divalidasi (semua divalidasi jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--verbose` | Tampilkan langkah validasi secara rinci |
| `--json` | Output dalam format JSON |

**Contoh:**

```bash
# Validasi skema tertentu
openspec schema validate my-workflow

# Validasi semua skema
openspec schema validate
```

---

### `openspec schema which`

Menunjukkan dari mana suatu skema diselesaikan (berguna untuk debugging presedensi).

```
openspec schema which [name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `name` | Tidak | Nama skema |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--all` | Daftar semua skema beserta sumbernya |
| `--json` | Output dalam format JSON |

**Contoh:**

```bash
# Periksa dari mana suatu skema berasal
openspec schema which spec-driven
```

**Output:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Presedensi Skema:**

1. Proyek: `openspec/schemas/<name>/`
2. Pengguna: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Skema bawaan

---

## Perintah Konfigurasi

### `openspec config`

Melihat dan memodifikasi konfigurasi global OpenSpec.

```
openspec config <subcommand> [options]
```

**Subperintah:**

| Subperintah | Deskripsi |
|------------|-------------|
| `path` | Tampilkan lokasi file konfigurasi |
| `list` | Tampilkan semua pengaturan saat ini |
| `get <key>` | Dapatkan nilai tertentu |
| `set <key> <value>` | Atur suatu nilai |
| `unset <key>` | Hapus kunci |
| `reset` | Reset ke default |
| `edit` | Buka di `$EDITOR` |
| `profile [preset]` | Konfigurasi profil alur kerja secara interaktif atau melalui preset |

**Contoh:**

```bash
# Tampilkan jalur file konfigurasi
openspec config path

# Daftar semua pengaturan
openspec config list

# Dapatkan nilai tertentu
openspec config get telemetry.enabled

# Atur suatu nilai
openspec config set telemetry.enabled false

# Atur nilai string secara eksplisit
openspec config set user.name "My Name" --string

# Hapus pengaturan kustom
openspec config unset user.name

# Reset semua konfigurasi
openspec config reset --all --yes

# Edit konfigurasi di editor Anda
openspec config edit

# Konfigurasi profil dengan wizard berbasis tindakan
openspec config profile

# Preset cepat: beralih alur kerja ke core (mempertahankan mode delivery)
openspec config profile core
```

`openspec config profile` dimulai dengan ringkasan keadaan saat ini, kemudian memungkinkan Anda memilih:
- Mengubah delivery + alur kerja
- Mengubah delivery saja
- Mengubah alur kerja saja
- Mempertahankan pengaturan saat ini (keluar)

Jika Anda mempertahankan pengaturan saat ini, tidak ada perubahan yang ditulis dan tidak ada prompt pembaruan yang ditampilkan.
Jika tidak ada perubahan konfigurasi tetapi file proyek saat ini tidak sinkron dengan profil/delivery global Anda, OpenSpec akan menampilkan peringatan dan menyarankan `openspec update`.
Menekan `Ctrl+C` juga membatalkan alur kerja dengan bersih (tanpa stack trace) dan keluar dengan kode `130`.
Dalam daftar periksa alur kerja, `[x]` berarti alur kerja dipilih dalam konfigurasi global. Untuk menerapkan pilihan tersebut ke file proyek, jalankan `openspec update` (atau pilih `Apply changes to this project now?` saat diminta di dalam sebuah proyek).

**Contoh interaktif:**

```bash
# Pembaruan delivery saja
openspec config profile
# pilih: Ubah delivery saja
# pilih skills: Hanya Skills

# Pembaruan alur kerja saja
openspec config profile
# pilih: Ubah alur kerja saja
# toggle alur kerja di daftar periksa, lalu konfirmasi
```

---

## Perintah Utilitas

### `openspec feedback`

Mengirimkan umpan balik tentang OpenSpec. Membuat isu GitHub.

```
openspec feedback <message> [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `message` | Ya | Pesan umpan balik |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--body <text>` | Deskripsi rinci |

**Persyaratan:** GitHub CLI (`gh`) harus terinstal dan diautentikasi.

**Contoh:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Mengelola penyelesaian shell untuk CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subperintah:**

| Subperintah | Deskripsi |
|------------|-------------|
| `generate [shell]` | Output skrip penyelesaian ke stdout |
| `install [shell]` | Instalasi penyelesaian untuk shell Anda |
| `uninstall [shell]` | Hapus penyelesaian yang terinstal |

**Shell yang didukung:** `bash`, `zsh`, `fish`, `powershell`

**Contoh:**

```bash
# Instal penyelesaian (mendeteksi shell secara otomatis)
openspec completion install

# Instal untuk shell tertentu
openspec completion install zsh

# Hasilkan skrip untuk instalasi manual
openspec completion generate bash > ~/.bash_completion.d/openspec

# Copot instalasi
openspec completion uninstall
```

---

## Kode Keluar (Exit Codes)

| Kode | Arti |
|------|---------|
| `0` | Berhasil |
| `1` | Kesalahan (kegagalan validasi, file hilang, dll.) |

---

## Variabel Lingkungan

| Variabel | Deskripsi |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Atur ke `0` untuk menonaktifkan telemetri |
| `DO_NOT_TRACK` | Atur ke `1` untuk menonaktifkan telemetri (sinyal DNT standar) |
| `OPENSPEC_CONCURRENCY` | Konkurensi default untuk validasi massal (default: 6) |
| `EDITOR` atau `VISUAL` | Editor untuk `openspec config edit` |
| `NO_COLOR` | Nonaktifkan output warna saat diatur |

---

## Dokumentasi Terkait

- [Commands](commands.md) - Perintah slash AI (`/opsx:propose`, `/opsx:apply`, dll.)
- [Workflows](workflows.md) - Pola umum dan kapan harus menggunakan setiap perintah
- [Customization](customization.md) - Membuat skema dan template kustom
- [Getting Started](getting-started.md) - Panduan pengaturan pertama kali