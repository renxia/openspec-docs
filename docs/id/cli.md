# Referensi CLI

OpenSpec CLI (`openspec`) menyediakan perintah terminal untuk pengaturan proyek, validasi, inspeksi status, dan manajemen. Perintah-perintah ini melengkapi perintah slash AI (seperti `/opsx:propose`) yang didokumentasikan di [Perintah](commands.md).

## Ringkasan

| Kategori | Perintah | Tujuan |
|----------|----------|--------|
| **Setup** | `init`, `update` | Inisialisasi dan perbarui OpenSpec di proyek Anda |
| **Workspaces (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | Siapkan tampilan lokal di atas repositori atau folder yang ditautkan |
| **Shared context (beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | Kelola pendaftaran context-store lokal dan konteks inisiatif yang persisten |
| **Browsing** | `list`, `view`, `show` | Jelajahi perubahan dan spesifikasi |
| **Validasi** | `validate` | Periksa perubahan dan spesifikasi untuk masalah |
| **Lifecycle** | `archive` | Selesaikan perubahan yang telah selesai |
| **Workflow** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | Dukungan alur kerja berbasis artefak |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Buat dan kelola alur kerja kustom |
| **Config** | `config` | Lihat dan ubah pengaturan |
| **Utility** | `feedback`, `completion` | Umpan balik dan integrasi shell |

---

## Perintah Manusia vs Agen

Sebagian besar perintah CLI dirancang untuk **penggunaan manusia** di terminal. Beberapa perintah juga mendukung **penggunaan agen/skrip** melalui output JSON.

### Perintah Khusus Manusia

Perintah-perintah ini bersifat interaktif dan dirancang untuk penggunaan di terminal:

| Perintah | Tujuan |
|----------|--------|
| `openspec init` | Inisialisasi proyek (prompt interaktif) |
| `openspec view` | Dasbor interaktif |
| `openspec config edit` | Buka konfigurasi di editor |
| `openspec feedback` | Kirim umpan balik melalui GitHub |
| `openspec completion install` | Instal pelengkapan shell |

### Perintah Kompatibel Agen

Perintah-perintah ini mendukung output `--json` untuk penggunaan terprogram oleh agen AI dan skrip:

| Perintah | Penggunaan Manusia | Penggunaan Agen |
|----------|-------------------|-----------------|
| `openspec list` | Jelajahi perubahan/spesifikasi | `--json` untuk data terstruktur |
| `openspec show <item>` | Baca konten | `--json` untuk parsing |
| `openspec validate` | Periksa masalah | `--all --json` untuk validasi massal |
| `openspec status` | Lihat progres artefak | `--json` untuk status terstruktur |
| `openspec instructions` | Dapatkan langkah selanjutnya | `--json` untuk instruksi agen |
| `openspec templates` | Temukan jalur templat | `--json` untuk resolusi jalur |
| `openspec schemas` | Daftar skema yang tersedia | `--json` untuk penemuan skema |
| `openspec workspace setup --no-interactive` | Buat workspace dengan input eksplisit | `--json` untuk output pengaturan terstruktur |
| `openspec workspace list` | Jelajahi workspace yang diketahui | `--json` untuk objek workspace bertipe |
| `openspec workspace link` | Tautkan repo atau folder | `--json` untuk output tautan terstruktur |
| `openspec workspace relink` | Perbaiki jalur tertaut | `--json` untuk output tautan terstruktur |
| `openspec workspace doctor` | Periksa satu workspace | `--json` untuk output status terstruktur |
| `openspec workspace update` | Perbarui panduan lokal workspace dan keterampilan agen | `--tools` memilih agen; profil memilih alur kerja |
| `openspec context-store setup <id>` | Buat penyimpanan konteks lokal | `--json` dengan input eksplisit untuk output pengaturan terstruktur |
| `openspec context-store register <path>` | Daftarkan penyimpanan konteks yang ada | `--json` untuk output pendaftaran terstruktur |
| `openspec context-store unregister <id>` | Lupakan pendaftaran penyimpanan konteks lokal | `--json` untuk output pembersihan terstruktur |
| `openspec context-store remove <id>` | Hapus folder penyimpanan konteks lokal yang terdaftar | `--yes --json` untuk penghapusan non-interaktif |
| `openspec context-store list` | Jelajahi penyimpanan konteks yang terdaftar | `--json` untuk pendaftaran terstruktur |
| `openspec context-store doctor` | Periksa pengaturan penyimpanan lokal | `--json` untuk diagnostik terstruktur |
| `openspec initiative list` | Jelajahi inisiatif bersama | `--json` untuk catatan inisiatif terstruktur |
| `openspec initiative show <id>` | Selesaikan inisiatif | `--json` untuk jalur kanonik dan metadata |
| `openspec new change <id>` | Buat kerangka perubahan repo-lokal | `--json`, plus `--initiative` untuk tautan koordinasi bersama |
| `openspec set change <id>` | Perbarui metadata perubahan yang tercatat | `--json`, plus `--initiative` untuk tautan koordinasi bersama |

---

## Opsi Global

Opsi-opsi ini berfungsi dengan semua perintah:

| Opsi | Deskripsi |
|------|-----------|
| `--version`, `-V` | Tampilkan nomor versi |
| `--no-color` | Nonaktifkan output berwarna |
| `--help`, `-h` | Tampilkan bantuan untuk perintah |

---

## Perintah Pengaturan

### `openspec init`

Inisialisasi OpenSpec di proyek Anda. Membuat struktur folder dan mengonfigurasi integrasi alat AI.

Perilaku default menggunakan default konfigurasi global: profil `core`, pengiriman `both`, alur kerja `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argumen:**

| Argumen | Diperlukan | Deskripsi |
|---------|------------|-----------|
| `path` | Tidak | Direktori target (default: direktori saat ini) |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--tools <list>` | Konfigurasi alat AI secara non-interaktif. Gunakan `all`, `none`, atau daftar dipisahkan koma |
| `--force` | Otomatis membersihkan file lama tanpa prompt |
| `--profile <profile>` | Ganti profil global untuk menjalankan init ini (`core` atau `custom`) |

`--profile custom` menggunakan alur kerja apa pun yang saat ini dipilih dalam konfigurasi global (`openspec config profile`).

**ID alat yang didukung (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Contoh:**

```bash
# Inisialisasi interaktif
openspec init

# Inisialisasi di direktori tertentu
openspec init ./my-project

# Non-interaktif: konfigurasi untuk Claude dan Cursor
openspec init --tools claude,cursor

# Konfigurasi untuk semua alat yang didukung
openspec init --tools all

# Ganti profil untuk menjalankan ini
openspec init --profile core

# Lewati prompt dan otomatis bersihkan file lama
openspec init --force
```

**Apa yang dibuat:**

```
openspec/
├── specs/              # Spesifikasi Anda (sumber kebenaran)
├── changes/            # Perubahan yang diusulkan
└── config.yaml         # Konfigurasi proyek

.claude/skills/         # Keterampilan Claude Code (jika claude dipilih)
.cursor/skills/         # Keterampilan Cursor (jika cursor dipilih)
.cursor/commands/       # Perintah OPSX Cursor (jika pengiriman mencakup perintah)
... (konfigurasi alat lain)
```

---

### `openspec update`

Perbarui file instruksi OpenSpec setelah memutakhirkan CLI. Menghasilkan ulang file konfigurasi alat AI menggunakan profil global Anda saat ini, alur kerja yang dipilih, dan mode pengiriman.

```
openspec update [path] [options]
```

**Argumen:**

| Argumen | Diperlukan | Deskripsi |
|---------|------------|-----------|
| `path` | Tidak | Direktori target (default: direktori saat ini) |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--force` | Paksa pembaruan bahkan ketika file sudah terbaru |

**Contoh:**

```bash
# Perbarui file instruksi setelah pemutakhiran npm
npm update @fission-ai/openspec
openspec update
```

---

## Perintah Workspace

Perintah workspace dalam versi beta. Model tampilan lokal di bawah ini adalah arah saat ini, namun otomatisasi eksternal, integrasi, dan alur kerja yang berjalan lama masih harus memperlakukan perilaku perintah, file status, dan output JSON sebagai yang sedang berkembang.

Workspace koordinasi adalah tampilan lokal mesin di atas repo atau folder yang ditautkan. Visibilitas workspace bukan komitmen perubahan: tautkan repo atau folder yang seharusnya diketahui OpenSpec, lalu buat perubahan ketika Anda siap merencanakan pekerjaan spesifik.

### `openspec workspace setup`

Buat workspace di lokasi workspace OpenSpec standar dan tautkan setidaknya satu repo atau folder yang ada.

```bash
openspec workspace setup [options]
```

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--name <name>` | Nama workspace. Nama harus dalam format kebab-case |
| `--link <path>` | Tautkan repo atau folder yang ada dan inferensi nama tautan dari nama folder |
| `--link <name>=<path>` | Tautkan repo atau folder yang ada dengan nama tautan eksplisit |
| `--opener <id>` | Simpan pembuka pilihan selama pengaturan non-interaktif: `codex-cli`, `claude`, `github-copilot`, atau `editor` |
| `--tools <tools>` | Instal keterampilan OpenSpec lokal workspace untuk agen. Gunakan `all`, `none`, atau ID alat dipisahkan koma |
| `--no-interactive` | Nonaktifkan prompt; memerlukan `--name` dan setidaknya satu `--link` |
| `--json` | Output JSON; memerlukan `--no-interactive` |

**Contoh:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Pengaturan interaktif menanyakan pembuka pilihan dan dapat menginstal keterampilan OpenSpec lokal workspace untuk agen yang dipilih. Pengaturan non-interaktif menyimpan pembuka pilihan hanya ketika `--opener` disediakan; jika tidak, `workspace open` akan meminta nanti di terminal interaktif ketika pembuka yang didukung tersedia, atau meminta skrip untuk meneruskan `--agent <tool>` atau `--editor`.

Instalasi keterampilan workspace hanya keterampilan dalam potongan beta ini: bahkan jika pengiriman global adalah `commands` atau `both`, pengaturan workspace menulis folder keterampilan agen di akar workspace dan tidak membuat file perintah slash. Profil global aktif memilih keterampilan alur kerja mana yang diinstal; `--tools` memilih agen mana yang menerimanya. Jika `--tools` dihilangkan dalam pengaturan non-interaktif, tidak ada keterampilan yang diinstal dan `workspace update --tools <ids>` dapat menambahkannya nanti.

### `openspec workspace list`

Daftar workspace OpenSpec yang diketahui dari registri lokal.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

Daftar menunjukkan lokasi setiap workspace dan repo atau folder yang ditautkan. Catatan registri yang usang dilaporkan tetapi tidak diubah.

### `openspec workspace link`

Catat repo atau folder yang ada untuk satu workspace.

```bash
openspec workspace link [name] <path> [options]
```

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--workspace <name>` | Pilih workspace yang diketahui dari registri lokal |
| `--json` | Output JSON |
| `--no-interactive` | Nonaktifkan prompt pemilih workspace |

**Contoh:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Jalur harus sudah ada. Jalur relatif diselesaikan terhadap direktori saat ini perintah sebelum OpenSpec menyimpan jalur absolut yang diverifikasi dalam status workspace lokal mesin. Jalur yang ditautkan dapat berupa repo, paket, layanan, aplikasi, atau folder penuh tanpa status `openspec/` lokal repo.

### `openspec workspace relink`

Perbaiki atau ubah jalur lokal untuk tautan yang ada.

```bash
openspec workspace relink <name> <path> [options]
```

Jalur harus sudah ada. Relink hanya memperbarui jalur lokal mesin untuk nama tautan yang stabil.

### `openspec workspace doctor`

Periksa apa yang dapat diselesaikan satu workspace di mesin saat ini.

```bash
openspec workspace doctor [options]
```

Doctor menunjukkan lokasi workspace, repo atau folder yang ditautkan, jalur yang hilang, jalur spesifikasi lokal repo ketika ada, dan perbaikan yang disarankan. Output JSON juga mencakup jalur perencanaan workspace untuk kompatibilitas. Ia hanya melaporkan masalah; ia tidak memperbaikinya secara otomatis.

Perintah yang membutuhkan satu workspace menggunakan workspace saat ini ketika dijalankan dari dalam folder atau subdirektori workspace. Dari tempat lain, teruskan `--workspace <name>`, pilih dari pemilih di terminal interaktif, atau andalkan satu-satunya workspace yang diketahui ketika tepat satu ada. Dalam mode `--json` atau `--no-interactive`, pilihan ambigu gagal dengan status error terstruktur dan menyarankan `--workspace <name>`.

Respons JSON menggunakan objek bertipe plus array `status`. Data utama berada di `workspace`, `workspaces`, atau `link`; peringatan dan error berada di `status`.

### `openspec workspace update`

Segarkan panduan OpenSpec lokal workspace dan keterampilan agen.

```bash
openspec workspace update [name] [options]
```

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--workspace <name>` | Pilih workspace yang diketahui dari registri lokal |
| `--tools <tools>` | Pilih agen untuk keterampilan workspace. Gunakan `all`, `none`, atau ID alat dipisahkan koma |
| `--json` | Output JSON |
| `--no-interactive` | Nonaktifkan prompt pemilih workspace |

**Contoh:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` menyegarkan blok panduan workspace yang dihasilkan dan permukaan terbuka lokal. Untuk keterampilan agen, ia menggunakan ulang pilihan agen keterampilan workspace yang disimpan ketika `--tools` dihilangkan. Meneruskan `--tools` mengganti pilihan yang disimpan itu. Ia hanya menyegarkan direktori keterampilan alur kerja yang dikelola OpenSpec di akar workspace, menghapus keterampilan alur kerja terkelola yang tidak dipilih, dan membiarkan repo dan folder yang ditautkan tidak tersentuh.

Menjalankan `openspec update` dari dalam workspace mengarahkan ulang ke `openspec workspace update`; jalankan `openspec update` di dalam proyek lokal repo ketika Anda ingin file alat milik repo diperbarui.

### `openspec workspace open`

Buka kumpulan kerja workspace melalui pembuka pilihan yang disimpan, penggantian agen satu sesi, atau mode editor VS Code.

```bash
openspec workspace open [name] [options]
```

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--workspace <name>` | Alias untuk nama workspace posisional |
| `--initiative <id>` | Buka inisiatif sebagai tampilan workspace lokal. Menerima `<id>` atau `<store>/<id>` |
| `--store <id>` | ID penyimpanan konteks terdaftar untuk `--initiative` |
| `--store-path <path>` | Akar penyimpanan konteks lokal yang ada untuk `--initiative` |
| `--agent <tool>` | Penggantian agen satu sesi: `codex-cli`, `claude`, atau `github-copilot` |
| `--editor` | Buka file workspace VS Code yang dipelihara sebagai workspace editor normal |
| `--no-interactive` | Nonaktifkan prompt pemilih workspace dan pembuka |

**Contoh:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` menggunakan workspace saat ini ketika dijalankan di dalam satu, otomatis memilih satu-satunya workspace yang diketahui ketika dijalankan di tempat lain, dan meminta pengguna untuk memilih ketika beberapa workspace diketahui. `--agent` dan `--editor` tidak mengubah pembuka pilihan yang disimpan. Meneruskan kedua penggantian pembuka adalah error; pilih salah satu `--agent <tool>` atau `--editor`.

Ketika `--initiative` digunakan, OpenSpec mempersiapkan atau memilih tampilan workspace lokal privat untuk inisiatif itu. Penyimpanan yang dipilih registri disimpan berdasarkan id; `--store-path` menyimpan pemilih jalur lokal waktu proses karena tampilan workspace adalah status lokal privat.

OpenSpec memelihara `<workspace-name>.code-workspace` di akar workspace untuk pembuka VS Code dan GitHub Copilot-in-VS-Code. File tersebut adalah status tampilan workspace lokal mesin.

Workspace VS Code yang dipelihara mendaftarkan repo atau folder yang ditautkan valid terlebih dahulu, lalu konteks inisiatif ketika dilampirkan, lalu file workspace OpenSpec. VS Code menampilkan entri-entri tersebut sebagai workspace multi-root.

Pembukaan workspace akar membuat repo atau folder yang ditautkan terlihat untuk eksplorasi dan konteks. Edit implementasi harus dimulai hanya setelah permintaan eksplisit pengguna dan alur kerja implementasi OpenSpec normal.

---

## Perintah Kontek Bersama

Penyimpanan dan prakarsa konteks adalah permukaan koordinasi beta. Penyimpanan konteks adalah pendaftaran lokal untuk kontek bersama yang tahan lama, biasanya folder yang didukung Git atau klon. Prakarsa adalah kontek koordinasi bersama di dalam penyimpanan konteks; perubahan lokal repo dapat ditautkan tanpa menyalin rencana bersama ke setiap repo.

### `openspec context-store setup`

Buat dan daftarkan penyimpanan konteks lokal. Tanpa argumen di terminal,
OpenSpec memandu pengguna melalui pengaturan. Agen dan skrip harus memberikan
input eksplisit dan menggunakan `--json`.

```bash
openspec context-store setup [id] [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--path <path>` | Jalur folder penyimpanan konteks; default ke direktori data lokal yang dikelola OpenSpec |
| `--init-git` | Inisialisasi repositori Git di penyimpanan konteks |
| `--no-init-git` | Jangan inisialisasi repositori Git |
| `--json` | Keluarkan JSON |

Ketika `--path` dihilangkan, pengaturan membuat penyimpanan di bawah `getGlobalDataDir()/context-stores/<id>`: `$XDG_DATA_HOME/openspec/context-stores/<id>` ketika `XDG_DATA_HOME` diatur, atau `~/.local/share/openspec/context-stores/<id>` pada fallback gaya Unix. Berikan `--path` ketika Anda ingin penyimpanan berada di klon yang terlihat atau folder khusus tim.

Contoh:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

Daftarkan folder penyimpanan konteks lokal yang sudah ada.

```bash
openspec context-store register [path] [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--id <id>` | ID penyimpanan konteks; default ke metadata penyimpanan atau nama folder |
| `--json` | Keluarkan JSON |

### `openspec context-store unregister`

Lupakan pendaftaran penyimpanan konteks lokal tanpa menghapus file.

```bash
openspec context-store unregister <id> [--json]
```

Gunakan ini ketika penyimpanan dipindahkan, diklon ke tempat lain, atau seharusnya tidak lagi
ditampilkan oleh OpenSpec di mesin ini.

### `openspec context-store remove`

Lupakan pendaftaran penyimpanan konteks lokal dan hapus folder lokalnya.

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` menampilkan folder yang tepat sebelum menghapus di terminal interaktif.
Agen, skrip, dan pemanggil JSON harus memberikan `--yes` untuk konfirmasi penghapusan.
OpenSpec menolak menghapus folder yang tidak berisi metadata
penyimpanan konteks yang cocok.

### `openspec context-store list`

Daftar penyimpanan konteks yang terdaftar secara lokal.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

Periksa pendaftaran penyimpanan konteks lokal, metadata, dan keberadaan Git.

```bash
openspec context-store doctor [id] [--json]
```

Doctor hanya diagnostik; ia melaporkan akar yang hilang, ketidakcocokan metadata, dan status registri lokal yang tidak valid tanpa memodifikasi penyimpanan.

### `openspec initiative create`

Buat prakarsa di penyimpanan konteks.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--store <id>` | ID penyimpanan konteks dari registri lokal |
| `--store-path <path>` | Akar penyimpanan konteks lokal yang sudah ada |
| `--title <title>` | Judul prakarsa |
| `--summary <summary>` | Ringkasan prakarsa |
| `--json` | Keluarkan JSON |

### `openspec initiative list`

Daftar prakarsa. Tanpa pemilih, ini mencari semua penyimpanan konteks yang terdaftar dan melaporkan peringatan baca sebagian di `status`.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--store <id>` | Daftar satu penyimpanan konteks yang terdaftar |
| `--store-path <path>` | Daftar satu akar penyimpanan konteks lokal yang sudah ada |
| `--json` | Keluarkan JSON |

### `openspec initiative show`

Selesaikan prakarsa dan cetak lokasi kanoniknya.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

Tanpa `--store`, OpenSpec mencari penyimpanan konteks yang terdaftar. Jika ID prakarsa yang sama ada di beberapa penyimpanan, berikan `--store <id>` atau gunakan formulir `<store>/<id>`.

---

## Perintah Penjelajahan

### `openspec list`

Daftar perubahan atau spesifikasi dalam proyek Anda.

```
openspec list [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--specs` | Daftarkan spesifikasi alih-alih perubahan |
| `--changes` | Daftarkan perubahan (default) |
| `--sort <order>` | Urutkan berdasarkan `recent` (default) atau `name` |
| `--json` | Output dalam format JSON |

**Contoh:**

```bash
# Daftar semua perubahan aktif
openspec list

# Daftar semua spesifikasi
openspec list --specs

# Output JSON untuk skrip
openspec list --json
```

**Output (teks):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

Tampilkan dashboard interaktif untuk menjelajahi spesifikasi dan perubahan.

```
openspec view
```

Membuka antarmuka berbasis terminal untuk menavigasi spesifikasi dan perubahan proyek Anda.

---

### `openspec show`

Tampilkan detail perubahan atau spesifikasi.

```
openspec show [item-name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `item-name` | Tidak | Nama perubahan atau spesifikasi (diminta jika tidak disertakan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--type <type>` | Tentukan tipe: `change` atau `spec` (terdeteksi otomatis jika tidak ambigu) |
| `--json` | Output dalam format JSON |
| `--no-interactive` | Nonaktifkan prompt |

**Opsi khusus perubahan:**

| Opsi | Deskripsi |
|--------|-------------|
| `--deltas-only` | Tampilkan hanya delta spec (mode JSON) |

**Opsi khusus spesifikasi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--requirements` | Tampilkan hanya persyaratan, kecualikan skenario (mode JSON) |
| `--no-scenarios` | Kecualikan konten skenario (mode JSON) |
| `-r, --requirement <id>` | Tampilkan persyaratan tertentu berdasarkan indeks mulai dari 1 (mode JSON) |

**Contoh:**

```bash
# Pemilihan interaktif
openspec show

# Tampilkan perubahan tertentu
openspec show add-dark-mode

# Tampilkan spesifikasi tertentu
openspec show auth --type spec

# Output JSON untuk parsing
openspec show add-dark-mode --json
```

---

## Perintah Validasi

### `openspec validate`

Validasi perubahan dan spesifikasi untuk masalah struktural.

```
openspec validate [item-name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `item-name` | Tidak | Item spesifik yang akan divalidasi (diminta jika tidak disertakan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--all` | Validasi semua perubahan dan spesifikasi |
| `--changes` | Validasi semua perubahan |
| `--specs` | Validasi semua spesifikasi |
| `--type <type>` | Tentukan tipe saat nama ambigu: `change` atau `spec` |
| `--strict` | Aktifkan mode validasi ketat |
| `--json` | Output dalam format JSON |
| `--concurrency <n>` | Maksimal validasi paralel (default: 6, atau env `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Nonaktifkan prompt |

**Contoh:**

```bash
# Validasi interaktif
openspec validate

# Validasi perubahan tertentu
openspec validate add-dark-mode

# Validasi semua perubahan
openspec validate --changes

# Validasi semua dengan output JSON (untuk CI/skrip)
openspec validate --all --json

# Validasi ketat dengan peningkatan paralelisme
openspec validate --all --strict --concurrency 12
```

**Output (teks):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**Output (JSON):**

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

## Perintah Siklus Hidup

### `openspec archive`

Arsipkan perubahan yang telah selesai dan gabungkan delta spec ke spesifikasi utama.

```
openspec archive [change-name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan yang akan diarsipkan (diminta jika tidak disertakan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `-y, --yes` | Lewati prompt konfirmasi |
| `--skip-specs` | Lewati pembaruan spesifikasi (untuk perubahan infrastruktur/peralatan/dokumentasi saja) |
| `--no-validate` | Lewati validasi (memerlukan konfirmasi) |

**Contoh:**

```bash
# Arsip interaktif
openspec archive

# Arsipkan perubahan tertentu
openspec archive add-dark-mode

# Arsip tanpa prompt (CI/skrip)
openspec archive add-dark-mode --yes

# Arsipkan perubahan peralatan yang tidak memengaruhi spesifikasi
openspec archive update-ci-config --skip-specs
```

**Apa yang dilakukan:**

1. Memvalidasi perubahan (kecuali `--no-validate`)
2. Meminta konfirmasi (kecuali `--yes`)
3. Menggabungkan delta spec ke `openspec/specs/`
4. Memindahkan folder perubahan ke `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Perintah Alur Kerja

Perintah-perintah ini mendukung alur kerja OPSX berbasis artefak. Berguna baik untuk manusia yang memeriksa progres maupun agen yang menentukan langkah selanjutnya.

### `openspec new change`

Buat direktori perubahan lokal repo dan metadata opsional yang di-commit.

```bash
openspec new change <name> [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--description <text>` | Deskripsi untuk ditambahkan ke `README.md` |
| `--goal <text>` | Tujuan produk workspace yang disimpan bersama perubahan |
| `--areas <names>` | Nama tautan workspace yang terpengaruh, dipisahkan koma |
| `--initiative <id>` | Tautkan perubahan lokal repo ke sebuah inisiatif |
| `--store <id>` | ID penyimpanan konteks untuk `--initiative` |
| `--store-path <path>` | Root penyimpanan konteks lokal yang sudah ada untuk `--initiative` |
| `--schema <name>` | Skema alur kerja yang digunakan |
| `--json` | Output JSON |

Contoh:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

Perbarui metadata perubahan lokal repo yang di-commit tanpa membuat ulang perubahan.

```bash
openspec set change <name> [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--initiative <id>` | Tautkan perubahan lokal repo ke sebuah inisiatif |
| `--store <id>` | ID penyimpanan konteks untuk `--initiative` |
| `--store-path <path>` | Root penyimpanan konteks lokal yang sudah ada untuk `--initiative` |
| `--json` | Output JSON |

`set change --initiative` bersifat idempoten ketika tautan yang diminta sudah ada dan menolak untuk menggantikan tautan inisiatif yang sudah ada dan berbeda.

### `openspec status`

Tampilkan status penyelesaian artefak untuk sebuah perubahan.

```
openspec status [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--change <id>` | Nama perubahan (diminta jika tidak disertakan) |
| `--schema <name>` | Override skema (terdeteksi otomatis dari konfigurasi perubahan) |
| `--json` | Output dalam format JSON |

**Contoh:**

```bash
# Pemeriksaan status interaktif
openspec status

# Status untuk perubahan tertentu
openspec status --change add-dark-mode

# JSON untuk penggunaan agen
openspec status --change add-dark-mode --json
```

**Output (teks):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**Output (JSON):**

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
| `artifact` | Tidak | ID artefak: `proposal`, `specs`, `design`, `tasks`, atau `apply` |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--change <id>` | Nama perubahan (wajib dalam mode non-interaktif) |
| `--schema <name>` | Override skema |
| `--json` | Output dalam format JSON |

**Kasus khusus:** Gunakan `apply` sebagai artefak untuk mendapatkan instruksi implementasi tugas.

**Contoh:**

```bash
# Dapatkan instruksi untuk artefak berikutnya
openspec instructions --change add-dark-mode

# Dapatkan instruksi artefak tertentu
openspec instructions design --change add-dark-mode

# Dapatkan instruksi penerapan/implementasi
openspec instructions apply --change add-dark-mode

# JSON untuk konsumsi agen
openspec instructions design --change add-dark-mode --json
```

**Output mencakup:**

- Konten template untuk artefak
- Konteks proyek dari konfigurasi
- Konten dari artefak dependensi
- Aturan per artefak dari konfigurasi

---

### `openspec templates`

Tampilkan jalur template yang telah diselesaikan untuk semua artefak dalam sebuah skema.

```
openspec templates [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--schema <name>` | Skema yang akan diperiksa (default: `spec-driven`) |
| `--json` | Output dalam format JSON |

**Contoh:**

```bash
# Tampilkan jalur template untuk skema default
openspec templates

# Tampilkan template untuk skema kustom
openspec templates --schema my-workflow

# JSON untuk penggunaan terprogram
openspec templates --json
```

**Output (teks):**

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

Daftarkan skema alur kerja yang tersedia beserta deskripsi dan alur artefaknya.

```
openspec schemas [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--json` | Output dalam format JSON |

**Contoh:**

```bash
openspec schemas
```

**Output:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Perintah Skema

Perintah untuk membuat dan mengelola skema alur kerja kustom.

### `openspec schema init`

Buat skema lokal proyek baru.

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
| `--no-default` | Jangan minta untuk diatur sebagai default |
| `--force` | Timpa skema yang sudah ada |
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
# Pembuatan skema interaktif
openspec schema init research-first

# Non-interaktif dengan artefak spesifik
openspec schema init rapid \
  --description "Alur kerja iterasi cepat" \
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

Salin skema yang ada ke proyek Anda untuk kustomisasi.

```
openspec schema fork <source> [name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `source` | Ya | Skema untuk disalin |
| `name` | Tidak | Nama skema baru (default: `<source>-custom`) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--force` | Timpa tujuan yang sudah ada |
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
# Fork skema bawaan spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Validasi struktur dan template skema.

```
openspec schema validate [name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `name` | Tidak | Skema untuk divalidasi (validasi semua jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--verbose` | Tampilkan langkah validasi detail |
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
# Validasi skema spesifik
openspec schema validate my-workflow

# Validasi semua skema
openspec schema validate
```

---

### `openspec schema which`

Tunjukkan dari mana skema di-resolve (berguna untuk debugging prioritas).

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
| `--all` | Daftar semua skema dengan sumbernya |
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
# Periksa dari mana skema berasal
openspec schema which spec-driven
```

**Output:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Prioritas skema:**

1. Proyek: `openspec/schemas/<name>/`
2. Pengguna: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Skema bawaan

---

## Perintah Konfigurasi

### `openspec config`

Lihat dan modifikasi konfigurasi global OpenSpec.

```
openspec config <subcommand> [options]
```

**Subperintah:**

| Subperintah | Deskripsi |
|------------|-------------|
| `path` | Tampilkan lokasi file konfigurasi |
| `list` | Tampilkan semua pengaturan saat ini |
| `get <key>` | Dapatkan nilai spesifik |
| `set <key> <value>` | Atur nilai |
| `unset <key>` | Hapus kunci |
| `reset` | Atur ulang ke default |
| `edit` | Buka di `$EDITOR` |
| `profile [preset]` | Konfigurasikan profil alur kerja secara interaktif atau melalui preset |

**Contoh:**

```bash
# Tampilkan path file konfigurasi
openspec config path

# Daftar semua pengaturan
openspec config list

# Dapatkan nilai spesifik
openspec config get telemetry.enabled

# Atur nilai
openspec config set telemetry.enabled false

# Atur nilai string secara eksplisit
openspec config set user.name "Nama Saya" --string

# Hapus pengaturan kustom
openspec config unset user.name

# Atur ulang semua konfigurasi
openspec config reset --all --yes

# Edit konfigurasi di editor Anda
openspec config edit

# Konfigurasikan profil dengan wizard berbasis aksi
openspec config profile

# Preset cepat: alihkan alur kerja ke inti (pertahankan mode pengiriman)
openspec config profile core
```

`openspec config profile` dimulai dengan ringkasan keadaan saat ini, lalu memungkinkan Anda memilih:
- Ubah pengiriman + alur kerja
- Hanya ubah pengiriman
- Hanya ubah alur kerja
- Pertahankan pengaturan saat ini (keluar)

Jika Anda mempertahankan pengaturan saat ini, tidak ada perubahan yang ditulis dan tidak ada prompt pembaruan yang ditampilkan.
Jika tidak ada perubahan konfigurasi tetapi file proyek atau ruang kerja saat ini tidak sinkron dengan profil/pengiriman global Anda, OpenSpec akan menampilkan peringatan dan menyarankan `openspec update` untuk proyek lokal repo atau `openspec workspace update` untuk panduan dan keterampilan ruang kerja lokal.
Menekan `Ctrl+C` juga membatalkan alur dengan bersih (tanpa stack trace) dan keluar dengan kode `130`.
Dalam daftar periksa alur kerja, `[x]` berarti alur kerja dipilih dalam konfigurasi global. Untuk menerapkan pilihan tersebut ke file proyek, jalankan `openspec update` (atau pilih `Terapkan perubahan ke proyek ini sekarang?` saat diminta di dalam proyek). Dari dalam ruang kerja, gunakan `openspec workspace update` untuk menyegarkan panduan dan keterampilan ruang kerja lokal; ini tetap hanya keterampilan untuk file alur kerja agen yang dihasilkan dan tidak menghasilkan perintah slash ruang kerja.

**Contoh interaktif:**

```bash
# Pembaruan hanya pengiriman
openspec config profile
# pilih: Ubah pengiriman saja
# pilih pengiriman: Hanya keterampilan

# Pembaruan hanya alur kerja
openspec config profile
# pilih: Hanya ubah alur kerja
# toggle alur kerja dalam daftar periksa, lalu konfirmasi
```

---

## Perintah Utilitas

### `openspec feedback`

Kirim umpan balik tentang OpenSpec. Membuat isu GitHub.

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
| `--body <text>` | Deskripsi detail |

**Persyaratan:** GitHub CLI (`gh`) harus terinstal dan terotentikasi.

**Contoh:**

```bash
openspec feedback "Tambahkan dukungan untuk tipe artefak kustom" \
  --body "Saya ingin mendefinisikan tipe artefak saya sendiri di luar yang bawaan."
```

---

### `openspec completion`

Kelola pelengkapan shell untuk CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subperintah:**

| Subperintah | Deskripsi |
|------------|-------------|
| `generate [shell]` | Output skrip pelengkapan ke stdout |
| `install [shell]` | Instal pelengkapan untuk shell Anda |
| `uninstall [shell]` | Hapus pelengkapan yang terinstal |

**Shell yang didukung:** `bash`, `zsh`, `fish`, `powershell`

**Contoh:**

```bash
# Instal pelengkapan (deteksi shell otomatis)
openspec completion install

# Instal untuk shell spesifik
openspec completion install zsh

# Generate skrip untuk instalasi manual
openspec completion generate bash > ~/.bash_completion.d/openspec

# Uninstall
openspec completion uninstall
```

---

## Kode Keluar

| Kode | Arti |
|------|---------|
| `0` | Sukses |
| `1` | Kesalahan (kegagalan validasi, file hilang, dll.) |

---

## Variabel Lingkungan

| Variabel | Deskripsi |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Atur ke `0` untuk menonaktifkan telemetri |
| `DO_NOT_TRACK` | Atur ke `1` untuk menonaktifkan telemetri (sinyal DNT standar) |
| `OPENSPEC_CONCURRENCY` | Konkurensi default untuk validasi massal (default: 6) |
| `EDITOR` atau `VISUAL` | Editor untuk `openspec config edit` |
| `NO_COLOR` | Nonaktifkan output berwarna saat diatur |

---

## Dokumentasi Terkait

- [Perintah](commands.md) - Perintah slash AI (`/opsx:propose`, `/opsx:apply`, dll.)
- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakan setiap perintah
- [Kustomisasi](customization.md) - Buat skema dan template kustom
- [Memulai](getting-started.md) - Panduan pengaturan pertama kali