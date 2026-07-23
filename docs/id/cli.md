# Referensi CLI

OpenSpec CLI (`openspec`) menyediakan perintah terminal untuk penyiapan proyek, validasi, pemeriksaan status, dan manajemen. Perintah ini melengkapi perintah slash AI (seperti `/opsx:propose`) yang didokumentasikan di [Perintah](commands.md).

## Ringkasan

| Kategori | Perintah | Tujuan |
|----------|----------|--------|
| **Penyiapan** | `init`, `update` | Inisialisasi dan perbarui OpenSpec di proyek Anda |
| **Store (repo OpenSpec mandiri)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Kelola store — repo OpenSpec mandiri yang telah Anda daftarkan |
| **Kesehatan** | `doctor` | Laporkan kesehatan hubungan untuk root yang teridentifikasi |
| **Konteks kerja** | `context` | Kumpulkan set kerja (root + store yang direferensikan) |
| **Workset pribadi** | `workset create`, `workset list`, `workset open`, `workset remove` | Simpan dan buka tampilan kerja pribadi, lokal di tool Anda |
| **Penelusuran** | `list`, `view`, `show` | Jelajahi perubahan dan spesifikasi |
| **Validasi** | `validate` | Periksa perubahan dan spesifikasi untuk menemukan masalah |
| **Siklus hidup** | `archive` | Finalisasi perubahan yang telah selesai |
| **Alur kerja** | `new change`, `status`, `instructions`, `templates`, `schemas` | Dukungan alur kerja yang berbasis artefak |
| **Skema** | `schema init`, `schema fork`, `schema validate`, `schema which` | Buat dan kelola alur kerja kustom |
| **Konfigurasi** | `config` | Lihat dan ubah pengaturan |
| **Utilitas** | `feedback`, `completion` | Umpan balik dan integrasi shell |

---

## Perintah Manusia vs Agen

Sebagian besar perintah CLI dirancang untuk **penggunaan manusia** di terminal. Beberapa perintah juga mendukung **penggunaan agen/script** melalui output JSON.

### Perintah Hanya untuk Manusia

Perintah ini bersifat interaktif dan dirancang untuk penggunaan di terminal:

| Perintah | Tujuan |
|---------|---------|
| `openspec init` | Inisialisasi proyek (prompt interaktif) |
| `openspec view` | Dasbor interaktif |
| `openspec workset open <name>` | Buka workset yang disimpan (jendela editor atau sesi agen terminal) |
| `openspec config edit` | Buka konfigurasi di editor |
| `openspec feedback` | Kirim umpan balik via GitHub |
| `openspec completion install` | Instal pelengkapan otomatis shell |

### Perintah yang Kompatibel dengan Agen

Perintah ini mendukung output `--json` untuk penggunaan pemrograman oleh agen AI dan script:

| Perintah | Penggunaan Manusia | Penggunaan Agen |
|---------|-----------|-----------|
| `openspec list` | Jelajahi perubahan/specs | `--json` untuk data terstruktur |
| `openspec show <item>` | Baca konten | `--json` untuk parsing |
| `openspec validate` | Periksa masalah | `--all --json` untuk validasi massal |
| `openspec status` | Lihat kemajuan artefak | `--json` untuk status terstruktur |
| `openspec instructions` | Dapatkan langkah selanjutnya | `--json` untuk instruksi agen |
| `openspec templates` | Temukan path template | `--json` untuk resolusi path |
| `openspec schemas` | Daftar skema yang tersedia | `--json` untuk penemuan skema |
| `openspec store setup <id>` | Buat dan daftarkan store lokal | `--json` dengan input eksplisit untuk output setup terstruktur |
| `openspec store register <path>` | Daftarkan store yang ada | `--json` untuk output pendaftaran terstruktur |
| `openspec store unregister <id>` | Lupakan pendaftaran store lokal | `--json` untuk output pembersihan terstruktur |
| `openspec store remove <id>` | Hapus folder store lokal yang terdaftar | `--yes --json` untuk penghapusan non-interaktif |
| `openspec store list` | Jelajahi store yang terdaftar | `--json` untuk pendaftaran terstruktur |
| `openspec store doctor` | Periksa setup store lokal | `--json` untuk diagnostik terstruktur |
| `openspec new change <id>` | Buat kerangka perubahan repo-lokal | `--json`, ditambah `--store <id>` untuk menggunakan store terdaftar sebagai root OpenSpec |
| `openspec workset create [name]` | Susun tampilan kerja pribadi | `--member <path> --json` untuk komposisi non-interaktif |
| `openspec workset list` | Jelajahi workset yang disimpan | `--json` untuk tampilan terstruktur |
| `openspec workset remove <name>` | Hapus tampilan yang disimpan | `--yes --json` untuk penghapusan non-interaktif |

---

## Opsi Global

Opsi ini berlaku untuk semua perintah:

| Opsi | Deskripsi |
|--------|-------------|
| `--version`, `-V` | Tampilkan nomor versi |
| `--no-color` | Nonaktifkan output warna |
| `--help`, `-h` | Tampilkan bantuan untuk perintah |

---

## Perintah Setup

### `openspec init`

Inisialisasi OpenSpec di proyek Anda. Membuat struktur folder dan mengonfigurasi integrasi alat AI.

Perilaku default menggunakan default konfigurasi global: profil `core`, pengiriman `both`, alur kerja `propose, explore, apply, sync, archive`.

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
| `--tools <list>` | Konfigurasi alat AI secara non-interaktif. Gunakan `all`, `none`, atau daftar yang dipisahkan koma |
| `--force` | Bersihkan file legacy secara otomatis tanpa meminta konfirmasi |
| `--profile <profile>` | Timpa profil global untuk menjalankan init ini (`core` atau `custom`) |

`--profile custom` menggunakan alur kerja apa pun yang saat ini dipilih di konfigurasi global (`openspec config profile`).

**ID Alat yang Didukung (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> Daftar ini mencerminkan `AI_TOOLS` di `src/core/config.ts`. Lihat [Alat yang Didukung](supported-tools.md) untuk keterampilan dan path perintah setiap alat.

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

# Timpa profil untuk menjalankan ini
openspec init --profile core

# Lewati prompt dan bersihkan file legacy secara otomatis
openspec init --force
```

**Yang dibuatnya:**

```
openspec/
├── specs/              # Spesifikasi Anda (sumber kebenaran)
├── changes/            # Perubahan yang diusulkan
└── config.yaml         # Konfigurasi proyek

.claude/skills/         # Keterampilan Claude Code (jika claude dipilih)
.cursor/skills/         # Keterampilan Cursor (jika cursor dipilih)
.cursor/commands/       # Perintah Cursor OPSX (jika pengiriman mencakup perintah)
... (konfigurasi alat lainnya)
```

---

### `openspec update`

Perbarui file instruksi OpenSpec setelah mengupgrade CLI. Hasilkan ulang file konfigurasi alat AI menggunakan profil global saat ini, alur kerja yang dipilih, dan mode pengiriman.

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
| `--force` | Paksa pembaruan bahkan ketika file sudah up to date |

**Contoh:**

```bash
# Perbarui file instruksi setelah upgrade npm
npm update @fission-ai/openspec
openspec update
```

---

## Store (repo OpenSpec mandiri)

> **Beta.** Store dan fitur yang dibangun di atasnya (referensi, konteks kerja, workset) adalah yang baru; nama perintah, flag, format file, dan output JSON mungkin berubah bentuk antar rilis. Untuk panduan langkah demi langkah yang berfokus pada masalah, lihat [panduan store](stores-beta/user-guide.md).

Store adalah repo OpenSpec mandiri yang telah Anda daftarkan di mesin ini — misalnya repo perencanaan atau repo kontrak. Mendaftarkan store memungkinkan perintah normal (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) bertindak di dalamnya dari mana saja dengan meneruskan `--store <id>`.

### `openspec store setup`

Buat dan daftarkan store lokal. Tanpa argumen di terminal, OpenSpec memandu pengguna melalui setup. Agen dan script harus meneruskan input eksplisit dan menggunakan `--json`.

```bash
openspec store setup [id] [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--path <path>` | Folder tempat store harus berada (misalnya `~/openspec/<id>`) |
| `--remote <url>` | Catat remote kanonik di `store.yaml` store baru |
| `--init-git` | Inisialisasi repositori Git dengan commit awal (default) |
| `--no-init-git` | Lewati semua aksi Git: tidak ada inisialisasi, tidak ada commit awal |
| `--json` | Output JSON |

Jalankan non-interaktif (`--json`, script, agen) harus meneruskan baik id store maupun `--path`. Di terminal interaktif, setup meminta lokasi dengan saran yang dapat diedit di tempat yang terlihat dan dimiliki pengguna (misalnya `~/openspec/<id>`); ini tidak pernah default ke direktori data yang dikelola OpenSpec.

Contoh:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Daftarkan folder store lokal yang ada. Selama beta store, root mungkin didaftarkan sebelum ada perubahan, spec diterapkan, atau perubahan diarsipkan; dalam hal itu `openspec/changes/`, `openspec/specs/`, dan `openspec/changes/archive/` mungkin tidak ada sampai perintah normal membuatnya. Repo yang hanya berisi konfigurasi yang mendeklarasikan `store: <id>` tetap menjadi pointer ke store lain dan tidak didaftarkan sebagai root store kecuali pointer tersebut dihapus.

```bash
openspec store register [path] [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--id <id>` | Id store; default ke metadata store atau nama folder |
| `--yes` | Konfirmasi pembuatan metadata identitas store untuk root OpenSpec yang sehat |
| `--json` | Output JSON |

### `openspec store unregister`

Lupakan pendaftaran store lokal tanpa menghapus file.

```bash
openspec store unregister <id> [--json]
```

Gunakan ini ketika store dipindahkan, dikloning di tempat lain, atau tidak boleh ditampilkan lagi oleh OpenSpec di mesin ini.

### `openspec store remove`

Lupakan pendaftaran store lokal dan hapus folder lokalnya.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` menampilkan folder yang tepat sebelum menghapus di terminal interaktif. Agen, script, dan pemanggil JSON harus meneruskan `--yes` untuk mengkonfirmasi penghapusan. OpenSpec menolak menghapus folder yang tidak berisi metadata store yang cocok.

### `openspec store list`

Daftar store yang terdaftar secara lokal.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Periksa pendaftaran store lokal, metadata, dan kehadiran Git.

```bash
openspec store doctor [id] [--json]
```

Doctor hanya untuk diagnostik; ini melaporkan root yang hilang, ketidakcocokan metadata, dan state registry lokal yang tidak valid tanpa memodifikasi store.

### Referencing stores from a project

Repo proyek dapat mendeklarasikan store mana yang digunakan untuk kerjanya di `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

Dari saat itu, output `openspec instructions` di repo tersebut (baik permukaan per-artefak maupun `apply`, mode JSON dan manusia) membawa indeks dari spec setiap store yang dirujuk — id spec, ringkasan satu baris dari bagian Purpose setiap spec, dan perintah pengambilan (`openspec show <spec-id> --type spec --store <id>`). Indeks dibangun secara langsung dari checkout yang terdaftar setiap kali dijalankan; konten spec tidak pernah disalin ke dalam output.

Referensi adalah konteks hanya-baca. Mereka tidak pernah mengubah tempat perintah bertindak: pekerjaan tetap di root repo sendiri, dan menulis ke store yang dirujuk tetap merupakan aksi `--store` eksplisit. Referensi yang tidak dapat diselesaikan (misalnya, store yang tidak terdaftar di mesin ini) menjadi peringatan di indeks dengan perbaikan yang tepat, dan instruksi tetap dihasilkan. `openspec doctor` melaporkan kesehatan referensi di satu tempat.

### Recording where a store is cloned from

Store dapat mencatat sumber klon kanoniknya di file identitas yang di-commit, sehingga proses onboarding tidak pernah berakhir di "daftarkan store":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Remote masuk ke `.openspec-store/store.yaml` di dalam commit awal, sehingga setiap klon lahir dengan mengetahuinya. Untuk store yang sudah ada, edit `store.yaml` secara manual dan commit. `store doctor` menampilkan remote yang tercatat (dan asal Git checkout yang diamati); panduan berbagi setup/register menamainya; dan register mencatat asal checkout di registry lokal mesin.

Deklarasi referensi juga dapat membawa sumber klon, sehingga rekan tim yang belum memiliki store mendapatkan perbaikan lengkap yang dapat ditempel (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Mencatat remote bukanlah sinkronisasi: OpenSpec tidak pernah mengkloning, menarik, atau mengirimkan secara otomatis.

### Declaring a default store

Repo yang perencanaannya sepenuhnya dieksternalisasi — tidak ada `openspec/specs/` atau `openspec/changes/` lokal — dapat mendeklarasikan store-nya sekali saja alih-alih meneruskan `--store` di setiap perintah:

```yaml
# openspec/config.yaml (satu-satunya file di bawah openspec/)
store: team-context
```

Perintah normal kemudian secara otomatis mengatasi ke store yang dideklarasikan; banner root dan blok JSON `root` melaporkan `source: "declared"` dengan id store, dan petunjuk yang dicetak tetap membawa `--store <id>`. Deklarasi adalah fallback, bukan pengganti: `--store` eksplisit selalu menang, dan direktori dengan folder perencanaan nyata mengabaikan pointer (dengan peringatan). Untuk mengubah repo pointer menjadi root OpenSpec lokal, hapus baris `store:` dan jalankan `openspec init` — init menolak membuat kerangka sementara deklarasi ada.

Variasi tingkat mesin mencakup semua repo sekaligus: `openspec config set defaultStore <id>` (lihat Konfigurasi). Ini hanya dikonsultasikan setelah `--store`, root lokal, dan pointer proyek semuanya gagal diatasi; banner root dan blok JSON `root` kemudian melaporkan `source: "global_default"`.

## Doctor (kesehatan relasi)

Satu pertanyaan hanya-baca, satu lokasi: apakah akar OpenSpec sehat, dan apakah toko yang dirujuknya tersedia di mesin ini?

```bash
openspec doctor [--store <id>] [--json]
```

Laporan memisahkan kesehatan akar, kesehatan metadata toko (termasuk catatan ketika remote yang tercatat dan asal checkout berbeda, serta catatan ketika checkout toko tertinggal di belakang ref pelacakan upstream terakhir yang diambil), dan kesehatan referensi (instruksi diagnostik yang sama ditampilkan, dengan perbaikan clone untuk referensi yang belum terselesaikan). Temuan kesehatan dengan tingkat keparahan apapun menghasilkan kode keluar 0 — agen membaca array `status`; hanya kegagalan perintah (tidak ada akar, toko tidak dikenali) yang menghasilkan kode keluar 1. Doctor tidak pernah mengkloning, menyinkronkan, atau memperbaiki. Untuk mendapatkan set yang disusun itu sendiri bukan kondisi sehatnya, gunakan `openspec context`.

## Konteks kerja (set yang disusun)

Segala sesuatu yang terkait dengan pekerjaan ini melalui deklarasi OpenSpec, dalam satu set kerja: akar OpenSpec dan toko yang dirujuknya.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Ringkasan JSON dapat dikonsumsi agen (setiap toko yang dirujuk dan tersedia membawa resep fetch-nya; anggota yang belum terselesaikan membawa instruksi perbaikan yang sama seperti yang ditampilkan oleh doctor). Opsi `--code-workspace` juga menulis file ruang kerja VS Code yang berisi akar ditambah toko yang dirujuk dan tersedia (folder `ref:<id>`) — ini adalah satu-satunya operasi tulis yang dilakukan oleh perintah ini, yang akan ditolak jika file sudah ada tanpa opsi `--force`. Anggota yang tidak tersedia dilaporkan, tidak pernah ditebak.

"Konteks kerja" adalah set yang disusun; field `context:` di `openspec/config.yaml` adalah latar belakang proyek yang disisipkan ke dalam instruksi — dua hal yang berbeda. Perintah `openspec doctor` menjawab apakah set tersebut sehat; perintah `openspec context` menjawab apa itu set tersebut.

## Set kerja pribadi

> **Beta.** Set kerja adalah bagian dari permukaan beta baru; perintah, flag, dan format file mungkin berubah antar rilis. Untuk panduan langkah demi langkah, lihat [panduan toko](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Set kerja adalah tampilan pribadi yang bernama dari folder yang Anda gunakan bersama — akar perencanaan plus apapun yang Anda pilih — yang disimpan di mesin Anda dan dibuka kembali berdasarkan nama di alat Anda. Ini sepenuhnya lokal: tidak pernah di-commit, tidak pernah dibagikan, tidak pernah diturunkan dari deklarasi, dan menghapusnya tidak pernah menyentuh folder anggota.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` menjalankan alur panduan singkat (atau menerima flag `--member` secara non-interaktif; anggota pertama adalah utama — sesi dimulai di sana). `open` meluncurkan alat yang dipilih: editor (VS Code, Cursor) membuka jendela dengan setiap anggota dan kembali; agen CLI (Claude Code, codex) mengambil alih terminal ini sebagai sesi dengan setiap anggota yang terlampir dan tidak ada prompt yang terisi sebelumnya, berakhir ketika Anda keluar. Folder anggota yang hilang saat dibuka akan dilewati dengan catatan; yang lainnya terbuka. Preferensi alat yang disimpan dapat diganti per pembukaan dengan `--tool`.

Mendukung alat baru adalah konfigurasi, bukan kode. Setiap alat adalah salah satu dari dua gaya peluncuran — `workspace-file` (diluncurkan dengan `.code-workspace` yang dihasilkan) atau `attach-dirs` (satu flag lampiran per anggota) — dan kunci `openers` di `config.json` global (buka dengan `openspec config edit`) menambahkan alat atau menyesuaikan bawaan per bidang:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Semua status set kerja berada di folder `worksets/` di direktori data global (tampilan yang disimpan plus file `<name>.code-workspace` yang dihasilkan, dibuat ulang setiap kali dibuka); menghapus folder tersebut menghapus semua jejak.

---

## Perintah Penelusuran

### `openspec list`

Daftar perubahan atau spesifikasi di proyek Anda.

```
openspec list [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--specs` | Daftar spesifikasi sebagai ganti perubahan |
| `--changes` | Daftar perubahan (default) |
| `--sort <order>` | Urutkan berdasarkan `recent` (default) atau `name` |
| `--json` | Keluarkan sebagai JSON |

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
Perubahan:
  add-dark-mode     Tidak ada tugas      baru saja
```

---

### `openspec view`

Tampilkan dasbor interaktif untuk menelusuri spesifikasi dan perubahan.

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

| Argumen | Diperlukan | Deskripsi |
|----------|------------|-------------|
| `item-name` | Tidak | Nama perubahan atau spesifikasi (meminta input jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--type <type>` | Tentukan jenis: `change` atau `spec` (terdeteksi otomatis jika tidak ambigu) |
| `--json` | Keluarkan sebagai JSON |
| `--no-interactive` | Nonaktifkan prompt |

**Opsi khusus perubahan:**

| Opsi | Deskripsi |
|--------|-------------|
| `--deltas-only` | Tampilkan hanya spesifikasi delta (mode JSON) |

**Opsi khusus spesifikasi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--requirements` | Tampilkan hanya persyaratan, kecualikan skenario (mode JSON) |
| `--no-scenarios` | Kecualikan konten skenario (mode JSON) |
| `-r, --requirement <id>` | Tampilkan persyaratan tertentu berdasarkan indeks berbasis 1 (mode JSON) |

**Contoh:**

```bash
# Seleksi interaktif
openspec show

# Tampilkan perubahan tertentu
openspec show add-dark-mode

# Tampilkan spesifikasi tertentu
openspec show auth --type spec

# Keluaran JSON untuk penguraian
openspec show add-dark-mode --json
```

---

## Perintah Validasi

### `openspec validate`

Validasi perubahan dan spesifikasi untuk masalah struktural.

```
openspec validate [item-name] [options]
```

Perubahan dengan nol delta spesifikasi gagal validasi kecuali `.openspec.yaml`-nya mendeklarasikan `skip_specs: true` (untuk refactor murni, tooling, atau pekerjaan dokumen — lihat [Resep 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)).

**Argumen:**

| Argumen | Diperlukan | Deskripsi |
|----------|------------|-------------|
| `item-name` | Tidak | Item tertentu untuk divalidasi (meminta input jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--all` | Validasi semua perubahan dan spesifikasi |
| `--changes` | Validasi semua perubahan |
| `--specs` | Validasi semua spesifikasi |
| `--type <type>` | Tentukan jenis ketika nama ambigu: `change` atau `spec` |
| `--strict` | Aktifkan mode validasi ketat |
| `--json` | Keluarkan sebagai JSON |
| `--concurrency <n>` | Validasi paralel maksimum (default: 6, atau env `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Nonaktifkan prompt |

**Contoh:**

```bash
# Validasi interaktif
openspec validate

# Validasi perubahan tertentu
openspec validate add-dark-mode

# Validasi semua perubahan
openspec validate --changes

# Validasi semua hal dengan keluaran JSON (untuk CI/skrip)
openspec validate --all --json

# Validasi ketat dengan peningkatan paralelisme
openspec validate --all --strict --concurrency 12
```

**Keluaran (teks):**

```
Memvalidasi add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: bagian "Technical Approach" hilang

1 peringatan ditemukan
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

## Perintah Siklus Hidup

### `openspec archive`

Arsipkan perubahan yang selesai dan gabungkan spesifikasi delta ke spesifikasi utama.

```
openspec archive [change-name] [options]
```

**Argumen:**

| Argumen | Diperlukan | Deskripsi |
|----------|------------|-------------|
| `change-name` | Tidak | Perubahan untuk diarsipkan (meminta input jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `-y, --yes` | Lewati prompt konfirmasi |
| `--skip-specs` | Lewati pembaruan spesifikasi untuk satu kali arsip. Perubahan yang secara permanen tidak memiliki delta spesifikasi harus mendeklarasikan `skip_specs: true` di `.openspec.yaml`-nya sebagai gantinya — ini mengarsipkan tanpa flag |
| `--no-validate` | Lewati validasi (memerlukan konfirmasi) |

**Contoh:**

```bash
# Arsip interaktif
openspec archive

# Arsipkan perubahan tertentu
openspec archive add-dark-mode

# Arsipkan tanpa prompt (CI/skrip)
openspec archive add-dark-mode --yes

# Arsipkan perubahan tooling yang tidak memengaruhi spesifikasi
openspec archive update-ci-config --skip-specs
```

**Apa yang dilakukan:**

1. Memvalidasi perubahan (kecuali `--no-validate`)
2. Meminta konfirmasi (kecuali `--yes`)
3. Menggabungkan spesifikasi delta ke `openspec/specs/`
4. Memindahkan folder perubahan ke `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Perintah Alur Kerja

Perintah ini mendukung alur kerja berbasis artefak OPSX. Mereka berguna bagi manusia yang memeriksa kemajuan dan agen yang menentukan langkah selanjutnya.

### `openspec new change`

Buat direktori perubahan dan metadata opsional yang di-check-in di root OpenSpec yang terselesaikan.

```bash
openspec new change <name> [options]
```

Nama perubahan harus menggunakan huruf kecil kebab-case. Mereka dimulai dengan huruf kecil,
kemudian berisi huruf kecil, angka, dan tanda hubung tunggal. Mereka tidak dapat dimulai
dengan angka, berisi spasi, garis bawah, huruf besar, tanda hubung berturut-turut,
atau tanda hubung di awal/akhir. Saat menyertakan ID tiket eksternal,
beri awalan dengan kata, misalnya `ticket-123-add-notifications` alih-alih
`123-add-notifications`.

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--description <text>` | Deskripsi untuk ditambahkan ke `index.md` |
| `--goal <text>` | Metadata tujuan opsional untuk disimpan dengan perubahan |
| `--schema <name>` | Skema alur kerja yang akan digunakan |
| `--store <id>` | ID toko untuk digunakan sebagai root OpenSpec (toko adalah repo OpenSpec mandiri yang telah Anda daftarkan) |
| `--json` | Keluarkan JSON |

Contoh:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Tampilkan status penyelesaian artefak untuk sebuah perubahan.

```
openspec status [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--change <id>` | Nama perubahan (meminta input jika dihilangkan) |
| `--schema <name>` | Override skema (terdeteksi otomatis dari konfigurasi perubahan) |
| `--json` | Keluarkan sebagai JSON |

**Contoh:**

```bash
# Pemeriksaan status interaktif
openspec status

# Status untuk perubahan tertentu
openspec status --change add-dark-mode

# JSON untuk penggunaan agen
openspec status --change add-dark-mode --json
```

**Keluaran (teks):**

```
Perubahan: add-dark-mode
Skema: spec-driven
Kemajuan: 2/4 artefak selesai

[x] proposal
[ ] design
[x] specs
[-] tasks (diblokir oleh: design)
```

Perubahan yang mendeklarasikan `skip_specs: true` menampilkan tahap spesifikasinya sebagai `[~] specs (skipped: change declares skip_specs)` dan mengecualikannya dari hitungan kemajuan.

**Keluaran (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
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

| Argumen | Diperlukan | Deskripsi |
|----------|------------|-------------|
| `artifact` | Tidak | ID artefak: `proposal`, `specs`, `design`, `tasks`, atau `apply` |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--change <id>` | Nama perubahan (diperlukan dalam mode non-interaktif) |
| `--schema <name>` | Override skema |
| `--json` | Keluarkan sebagai JSON |

Kasus khusus: Gunakan `apply` sebagai artefak untuk mendapatkan instruksi implementasi tugas.

**Contoh:**

```bash
# Dapatkan instruksi untuk artefak selanjutnya
openspec instructions --change add-dark-mode

# Dapatkan instruksi artefak tertentu
openspec instructions design --change add-dark-mode

# Dapatkan instruksi penerapan/implementasi
openspec instructions apply --change add-dark-mode

# JSON untuk konsumsi agen
openspec instructions design --change add-dark-mode --json
```

**Keluaran mencakup:**

- Konten templat untuk artefak
- Konteks proyek dari konfigurasi
- Konten dari artefak dependensi
- Aturan per artefak dari konfigurasi

Untuk artefak yang dilewati melalui `skip_specs: true`, keluaran hanya berupa peringatan (JSON menambahkan bidang `skipped`/`warning`) — artefak tidak boleh dibuat.

---

### `openspec templates`

Tampilkan jalur templat yang terselesaikan untuk semua artefak dalam skema.

```
openspec templates [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--schema <name>` | Skema untuk diperiksa (default: `spec-driven`) |
| `--json` | Keluarkan sebagai JSON |

**Contoh:**

```bash
# Tampilkan jalur templat untuk skema default
openspec templates

# Tampilkan templat untuk skema kustom
openspec templates --schema my-workflow

# JSON untuk penggunaan pemrograman
openspec templates --json
```

**Keluaran (teks):**

```
Skema: spec-driven

Templat:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Daftar skema alur kerja yang tersedia dengan deskripsi dan aliran artefaknya.

```
openspec schemas [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--json` | Keluarkan sebagai JSON |

**Contoh:**

```bash
openspec schemas
```

**Keluaran:**

```
Skema yang tersedia:

  spec-driven (paket)
    Alur kerja pengembangan berbasis spesifikasi default
    Alur: proposal → specs → design → tasks

  my-custom (proyek)
    Alur kerja kustom untuk proyek ini
    Alur: research → proposal → tasks
```

## Perintah Schema

Perintah untuk membuat dan mengelola skema alur kerja kustom.

### `openspec schema init`

Buat skema lokal proyek baru.

```
openspec schema init <name> [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|-------|-----------|
| `name` | Ya | Nama skema (kebab-case) |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--description <teks>` | Deskripsi skema |
| `--artifacts <daftar>` | ID artefak yang dipisahkan koma (default: `proposal,specs,design,tasks`) |
| `--default` | Tetapkan sebagai skema default proyek |
| `--no-default` | Jangan tanyakan untuk menetapkan sebagai default |
| `--force` | Timpa skema yang ada |
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

**Yang dihasilkan:**

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

Salin skema yang ada ke proyek Anda untuk disesuaikan.

```
openspec schema fork <source> [name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|-------|-----------|
| `source` | Ya | Skema yang akan disalin |
| `name` | Tidak | Nama skema baru (default: `<source>-custom`) |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--force` | Timpa tujuan yang ada |
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
# Fork skema spec-driven bawaan
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
|----------|-------|-----------|
| `name` | Tidak | Skema yang akan divalidasi (validasi semua jika diabaikan) |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--verbose` | Tampilkan langkah validasi terperinci |
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
# Validasi skema tertentu
openspec schema validate my-workflow

# Validasi semua skema
openspec schema validate
```

---

### `openspec schema which`

Tampilkan dari mana skema diselesaikan (berguna untuk debugging prioritas).

```
openspec schema which [name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|-------|-----------|
| `name` | Tidak | Nama skema |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--all` | Cantumkan semua skema beserta sumbernya |
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
# Periksa dari mana skema berasal
openspec schema which spec-driven
```

**Output:**

```
spec-driven diselesaikan dari: package
  Sumber: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
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
|-------------|-----------|
| `path` | Tampilkan lokasi file konfigurasi |
| `list` | Tampilkan semua pengaturan saat ini |
| `get <kunci>` | Dapatkan nilai tertentu |
| `set <kunci> <nilai>` | Tetapkan nilai |
| `unset <kunci>` | Hapus kunci |
| `reset` | Reset ke default |
| `edit` | Buka di `$EDITOR` |
| `profile [preset]` | Konfigurasi profil alur kerja secara interaktif atau melalui preset |

**Contoh:**

```bash
# Tampilkan jalur file konfigurasi
openspec config path

# Cantumkan semua pengaturan
openspec config list

# Dapatkan nilai tertentu
openspec config get telemetry.enabled

# Tetapkan nilai
openspec config set telemetry.enabled false

# Tetapkan nilai string secara eksplisit
openspec config set user.name "My Name" --string

# Hapus pengaturan kustom
openspec config unset user.name

# Tetapkan toko default tingkat mesin (akar fallback ketika tidak ada --store,
# akar lokal, atau toko proyek: pointer diselesaikan)
openspec config set defaultStore team-plans

# Reset semua konfigurasi
openspec config reset --all --yes

# Edit konfigurasi di editor Anda
openspec config edit

# Konfigurasi profil dengan wizard berbasis aksi
openspec config profile

# Preset cepat: ganti alur kerja ke core (pertahankan mode pengiriman)
openspec config profile core
```

`openspec config profile` dimulai dengan ringkasan keadaan saat ini, kemudian memungkinkan Anda memilih:
- Ubah pengiriman + alur kerja
- Ubah pengiriman saja
- Ubah alur kerja saja
- Pertahankan pengaturan saat ini (keluar)

Jika Anda mempertahankan pengaturan saat ini, tidak ada perubahan yang ditulis dan tidak ada prompt pembaruan yang ditampilkan.
Jika tidak ada perubahan konfigurasi tetapi file proyek saat ini tidak sinkron dengan profil/pengiriman global Anda, OpenSpec akan menampilkan peringatan dan menyarankan `openspec update`.
Menekan `Ctrl+C` juga akan membatalkan alur dengan bersih (tidak ada jejak tumpukan) dan keluar dengan kode `130`.
Dalam daftar periksa alur kerja, `[x]` berarti alur kerja tersebut dipilih dalam konfigurasi global. Untuk menerapkan pilihan tersebut ke file proyek, jalankan `openspec update` (atau pilih `Terapkan perubahan ke proyek ini sekarang?` ketika diminta di dalam proyek).

**Contoh interaktif:**

```bash
# Pembaruan hanya pengiriman
openspec config profile
# pilih: Ubah pengiriman saja
# pilih pengiriman: Skills saja

# Pembaruan hanya alur kerja
openspec config profile
# pilih: Ubah alur kerja saja
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
|----------|-------|-----------|
| `message` | Ya | Pesan umpan balik |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--body <teks>` | Deskripsi terperinci |

**Persyaratan:** GitHub CLI (`gh`) harus diinstal dan diautentikasi.

**Contoh:**

```bash
openspec feedback "Tambahkan dukungan untuk jenis artefak kustom" \
  --body "Saya ingin mendefinisikan jenis artefak saya sendiri di luar yang bawaan."
```

---

### `openspec completion`

Kelola pelengkapan shell untuk CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subperintah:**

| Subperintah | Deskripsi |
|-------------|-----------|
| `generate [shell]` | Output skrip pelengkapan ke stdout |
| `install [shell]` | Instal pelengkapan untuk shell Anda |
| `uninstall [shell]` | Hapus pelengkapan yang terinstal |

**Shell yang didukung:** `bash`, `zsh`, `fish`, `powershell`

**Contoh:**

```bash
# Instal pelengkapan (deteksi shell otomatis)
openspec completion install

# Instal untuk shell tertentu
openspec completion install zsh

# Hasilkan skrip untuk instalasi manual
openspec completion generate bash > ~/.bash_completion.d/openspec

# Hapus instalasi
openspec completion uninstall
```

---

## Kode Keluar

| Kode | Makna |
|------|-------|
| `0` | Berhasil |
| `1` | Kesalahan (kegagalan validasi, file hilang, dll.) |

---

## Variabel Lingkungan

| Variabel | Deskripsi |
|----------|-----------|
| `OPENSPEC_TELEMETRY` | Tetapkan ke `0` untuk menonaktifkan telemetri |
| `DO_NOT_TRACK` | Tetapkan ke `1` untuk menonaktifkan telemetri (sinyal DNT standar) |
| `OPENSPEC_CONCURRENCY` | Konkurensi default untuk validasi massal (default: 6) |
| `EDITOR` atau `VISUAL` | Editor untuk `openspec config edit` |
| `NO_COLOR` | Nonaktifkan output warna ketika disetel |

---

## Dokumentasi Terkait

- [Perintah](commands.md) - Perintah slash AI (`/opsx:propose`, `/opsx:apply`, dll.)
- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakan setiap perintah
- [Kustomisasi](customization.md) - Buat skema dan template kustom
- [Memulai](getting-started.md) - Panduan setup pertama kali