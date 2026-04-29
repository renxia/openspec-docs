# Referensi CLI

CLI OpenSpec (`openspec`) menyediakan perintah terminal untuk pengaturan proyek, validasi, inspeksi status, dan manajemen. Perintah-perintah ini melengkapi perintah AI slash (seperti `/opsx:propose`) yang didokumentasikan di [Perintah](commands.md).

## Ringkasan

| Kategori | Perintah | Tujuan |
|----------|----------|--------|
| **Pengaturan** | `init`, `update` | Menginisialisasi dan memperbarui OpenSpec di proyek Anda |
| **Penjelajahan** | `list`, `view`, `show` | Menjelajahi perubahan dan spesifikasi |
| **Validasi** | `validate` | Memeriksa perubahan dan spesifikasi untuk masalah |
| **Siklus Hidup** | `archive` | Menyelesaikan perubahan yang telah selesai |
| **Alur Kerja** | `status`, `instructions`, `templates`, `schemas` | Dukungan alur kerja berbasis artefak |
| **Skema** | `schema init`, `schema fork`, `schema validate`, `schema which` | Membuat dan mengelola alur kerja kustom |
| **Konfigurasi** | `config` | Melihat dan mengubah pengaturan |
| **Utilitas** | `feedback`, `completion` | Umpan balik dan integrasi shell |

## Perintah Manusia vs Agen

Sebagian besar perintah CLI dirancang untuk **penggunaan manusia** di terminal. Beberapa perintah juga mendukung **penggunaan agen/skrip** melalui output JSON.

### Perintah Hanya untuk Manusia

Perintah ini bersifat interaktif dan dirancang untuk penggunaan terminal:

| Perintah | Tujuan |
|----------|--------|
| `openspec init` | Inisialisasi proyek (prompt interaktif) |
| `openspec view` | Dasbor interaktif |
| `openspec config edit` | Buka konfigurasi di editor |
| `openspec feedback` | Kirim umpan balik melalui GitHub |
| `openspec completion install` | Instalasi penyelesaian shell |

### Perintah Kompatibel dengan Agen

Perintah ini mendukung output `--json` untuk penggunaan terprogram oleh agen AI dan skrip:

| Perintah | Penggunaan Manusia | Penggunaan Agen |
|----------|---------------------|------------------|
| `openspec list` | Jelajahi perubahan/spesifikasi | `--json` untuk data terstruktur |
| `openspec show <item>` | Baca konten | `--json` untuk parsing |
| `openspec validate` | Periksa masalah | `--all --json` untuk validasi massal |
| `openspec status` | Lihat progres artefak | `--json` untuk status terstruktur |
| `openspec instructions` | Dapatkan langkah selanjutnya | `--json` untuk instruksi agen |
| `openspec templates` | Temukan jalur template | `--json` untuk resolusi jalur |
| `openspec schemas` | Daftar skema yang tersedia | `--json` untuk penemuan skema |

---

## Opsi Global

Opsi ini berfungsi dengan semua perintah:

| Opsi | Deskripsi |
|------|-----------|
| `--version`, `-V` | Tampilkan nomor versi |
| `--no-color` | Nonaktifkan output berwarna |
| `--help`, `-h` | Tampilkan bantuan untuk perintah |

---

## Perintah Pengaturan

### `openspec init`

Inisialisasi OpenSpec di proyek Anda. Membuat struktur folder dan mengonfigurasi integrasi alat AI.

Perilaku default menggunakan nilai default konfigurasi global: profil `core`, pengiriman `both`, alur kerja `propose, explore, apply, archive`.

```
openspec init [path] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|---------|-------|-----------|
| `path` | Tidak | Direktori target (default: direktori saat ini) |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--tools <list>` | Konfigurasi alat AI secara non-interaktif. Gunakan `all`, `none`, atau daftar dipisah koma |
| `--force` | Bersihkan file legacy secara otomatis tanpa prompt |
| `--profile <profile>` | Ganti profil global untuk menjalankan init ini (`core` atau `custom`) |

`--profile custom` menggunakan alur kerja apa pun yang saat ini dipilih dalam konfigurasi global (`openspec config profile`).

**ID alat yang didukung (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

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

# Lewati prompt dan bersihkan file legacy secara otomatis
openspec init --force
```

**Yang dibuat:**

```
openspec/
├── specs/              # Spesifikasi Anda (sumber kebenaran)
├── changes/            # Perubahan yang diusulkan
└── config.yaml         # Konfigurasi proyek

.claude/skills/         # Skill Claude Code (jika claude dipilih)
.cursor/skills/         # Skill Cursor (jika cursor dipilih)
.cursor/commands/       # Perintah Cursor OPSX (jika pengiriman mencakup perintah)
... (konfigurasi alat lainnya)
```

---

### `openspec update`

Perbarui file instruksi OpenSpec setelah meningkatkan versi CLI. Buat ulang file konfigurasi alat AI menggunakan profil global, alur kerja yang dipilih, dan mode pengiriman saat ini.

```
openspec update [path] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|---------|-------|-----------|
| `path` | Tidak | Direktori target (default: direktori saat ini) |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--force` | Paksa pembaruan meskipun file sudah terbaru |

**Contoh:**

```bash
# Perbarui file instruksi setelah npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Perintah Penjelajahan

### `openspec list`

Daftar perubahan atau spesifikasi di proyek Anda.

```
openspec list [options]
```

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--specs` | Daftar spesifikasi alih-alih perubahan |
| `--changes` | Daftar perubahan (default) |
| `--sort <order>` | Urutkan berdasarkan `recent` (default) atau `name` |
| `--json` | Output sebagai JSON |

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
Perubahan aktif:
  add-dark-mode     Dukungan pergantian tema UI
  fix-login-bug     Penanganan timeout sesi
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

Tampilkan detail perubahan atau spesifikasi.

```
openspec show [item-name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|---------|-------|-----------|
| `item-name` | Tidak | Nama perubahan atau spesifikasi (prompts jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--type <type>` | Tentukan tipe: `change` atau `spec` (otomatis terdeteksi jika tidak ambigu) |
| `--json` | Output sebagai JSON |
| `--no-interactive` | Nonaktifkan prompt |

**Opsi spesifik perubahan:**

| Opsi | Deskripsi |
|------|-----------|
| `--deltas-only` | Hanya tampilkan spesifikasi delta (mode JSON) |

**Opsi spesifik spesifikasi:**

| Opsi | Deskripsi |
|------|-----------|
| `--requirements` | Hanya tampilkan persyaratan, kecualikan skenario (mode JSON) |
| `--no-scenarios` | Kecualikan konten skenario (mode JSON) |
| `-r, --requirement <id>` | Tampilkan persyaratan spesifik berdasarkan indeks 1-based (mode JSON) |

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
|---------|-------|-----------|
| `item-name` | Tidak | Item spesifik untuk divalidasi (prompts jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--all` | Validasi semua perubahan dan spesifikasi |
| `--changes` | Validasi semua perubahan |
| `--specs` | Validasi semua spesifikasi |
| `--type <type>` | Tentukan tipe saat nama ambigu: `change` atau `spec` |
| `--strict` | Aktifkan mode validasi ketat |
| `--json` | Output sebagai JSON |
| `--concurrency <n>` | Maksimum validasi paralel (default: 6, atau env `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Nonaktifkan prompt |

**Contoh:**

```bash
# Validasi interaktif
openspec validate

# Validasi perubahan tertentu
openspec validate add-dark-mode

# Validasi semua perubahan
openspec validate --changes

# Validasi semuanya dengan output JSON (untuk CI/skrip)
openspec validate --all --json

# Validasi ketat dengan peningkatan paralelisme
openspec validate --all --strict --concurrency 12
```

**Output (teks):**

```
Memvalidasi add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: bagian "Technical Approach" tidak ditemukan

1 peringatan ditemukan
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
        "warnings": ["design.md: bagian 'Technical Approach' tidak ditemukan"]
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

Arsipkan perubahan yang selesai dan gabungkan spesifikasi delta ke dalam spesifikasi utama.

```
openspec archive [change-name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|---------|-------|-----------|
| `change-name` | Tidak | Perubahan untuk diarsipkan (prompts jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `-y, --yes` | Lewati prompt konfirmasi |
| `--skip-specs` | Lewati pembaruan spesifikasi (untuk perubahan infrastruktur/alat/dokumentasi saja) |
| `--no-validate` | Lewati validasi (memerlukan konfirmasi) |

**Contoh:**

```bash
# Arsipkan interaktif
openspec archive

# Arsipkan perubahan tertentu
openspec archive add-dark-mode

# Arsipkan tanpa prompt (CI/skrip)
openspec archive add-dark-mode --yes

# Arsipkan perubahan alat yang tidak mempengaruhi spesifikasi
openspec archive update-ci-config --skip-specs
```

**Yang dilakukan:**

1. Validasi perubahan (kecuali `--no-validate`)
2. Minta konfirmasi (kecuali `--yes`)
3. Gabungkan spesifikasi delta ke `openspec/specs/`
4. Pindahkan folder perubahan ke `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Perintah Alur Kerja

Perintah ini mendukung alur kerja OPSX yang berbasis artefak. Perintah ini berguna baik bagi manusia yang memeriksa progres maupun agen yang menentukan langkah selanjutnya.

### `openspec status`

Tampilkan status penyelesaian artefak untuk sebuah perubahan.

```
openspec status [options]
```

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--change <id>` | Nama perubahan (prompts jika dihilangkan) |
| `--schema <name>` | Pengganti skema (otomatis terdeteksi dari konfigurasi perubahan) |
| `--json` | Output sebagai JSON |

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
Perubahan: add-dark-mode
Skema: spec-driven
Progres: 2/4 artefak selesai

[x] proposal
[ ] design
[x] specs
[-] tasks (diblokir oleh: design)
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
|---------|-------|-----------|
| `artifact` | Tidak | ID Artefak: `proposal`, `specs`, `design`, `tasks`, atau `apply` |

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--change <id>` | Nama perubahan (wajib dalam mode non-interaktif) |
| `--schema <name>` | Pengganti skema |
| `--json` | Output sebagai JSON |

**Kasus khusus:** Gunakan `apply` sebagai artefak untuk mendapatkan instruksi implementasi tugas.

**Contoh:**

```bash
# Dapatkan instruksi untuk artefak berikutnya
openspec instructions --change add-dark-mode

# Dapatkan instruksi artefak tertentu
openspec instructions design --change add-dark-mode

# Dapatkan instruksi apply/implementasi
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

Tampilkan jalur template yang telah diresolusi untuk semua artefak dalam sebuah skema.

```
openspec templates [options]
```

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--schema <name>` | Skema untuk diperiksa (default: `spec-driven`) |
| `--json` | Output sebagai JSON |

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
Skema: spec-driven

Template:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Daftar skema alur kerja yang tersedia beserta deskripsi dan alur artefaknya.

```
openspec schemas [options]
```

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
openspec schemas
```

**Output:**

```
Skema yang tersedia:

  spec-driven (package)
    Alur kerja pengembangan berbasis spesifikasi default
    Alur: proposal → specs → design → tasks

  my-custom (project)
    Alur kerja kustom untuk proyek ini
    Alur: research → proposal → tasks
```

---

## Perintah Schema

Perintah untuk membuat dan mengelola schema alur kerja kustom.

### `openspec schema init`

Membuat schema lokal proyek baru.

```
openspec schema init <name> [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `name` | Ya | Nama schema (kebab-case) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--description <text>` | Deskripsi schema |
| `--artifacts <list>` | ID artefak yang dipisahkan koma (default: `proposal,specs,design,tasks`) |
| `--default` | Atur sebagai schema default proyek |
| `--no-default` | Jangan tampilkan prompt untuk mengatur sebagai default |
| `--force` | Timpa schema yang sudah ada |
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
# Pembuatan schema interaktif
openspec schema init research-first

# Non-interaktif dengan artefak spesifik
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Yang dibuat:**

```
openspec/schemas/<name>/
├── schema.yaml           # Definisi schema
└── templates/
    ├── proposal.md       # Template untuk setiap artefak
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Menyalin schema yang sudah ada ke proyek Anda untuk dikustomisasi.

```
openspec schema fork <source> [name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `source` | Ya | Schema yang akan disalin |
| `name` | Tidak | Nama schema baru (default: `<source>-custom`) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--force` | Timpa tujuan yang sudah ada |
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
# Fork schema bawaan spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Memvalidasi struktur dan template schema.

```
openspec schema validate [name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `name` | Tidak | Schema yang akan divalidasi (validasi semua jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--verbose` | Tampilkan langkah validasi detail |
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
# Validasi schema spesifik
openspec schema validate my-workflow

# Validasi semua schema
openspec schema validate
```

---

### `openspec schema which`

Menunjukkan dari mana schema berasal (berguna untuk debugging prioritas).

```
openspec schema which [name] [options]
```

**Argumen:**

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `name` | Tidak | Nama schema |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--all` | Daftar semua schema beserta sumbernya |
| `--json` | Output sebagai JSON |

**Contoh:**

```bash
# Cek dari mana schema berasal
openspec schema which spec-driven
```

**Output:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Prioritas schema:**

1. Proyek: `openspec/schemas/<name>/`
2. Pengguna: `~/.local/share/openspec/schemas/<name>/`
3. Paket: Schema bawaan

---

## Perintah Konfigurasi

### `openspec config`

Melihat dan memodifikasi konfigurasi OpenSpec global.

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
| `profile [preset]` | Konfigurasi profil alur kerja secara interaktif atau melalui preset |

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
openspec config set user.name "My Name" --string

# Hapus pengaturan kustom
openspec config unset user.name

# Atur ulang semua konfigurasi
openspec config reset --all --yes

# Edit konfigurasi di editor Anda
openspec config edit

# Konfigurasi profil dengan wizard berbasis aksi
openspec config profile

# Preset cepat: beralih alur kerja ke core (pertahankan mode pengiriman)
openspec config profile core
```

`openspec config profile` dimulai dengan ringkasan status saat ini, lalu memungkinkan Anda memilih:
- Ubah pengiriman + alur kerja
- Ubah pengiriman saja
- Ubah alur kerja saja
- Pertahankan pengaturan saat ini (keluar)

Jika Anda mempertahankan pengaturan saat ini, tidak ada perubahan yang ditulis dan tidak ada prompt pembaruan yang ditampilkan.
Jika tidak ada perubahan konfigurasi tetapi file proyek saat ini tidak sinkron dengan profil/pengiriman global Anda, OpenSpec akan menampilkan peringatan dan menyarankan menjalankan `openspec update`.
Menekan `Ctrl+C` juga membatalkan alur dengan bersih (tanpa stack trace) dan keluar dengan kode `130`.
Di daftar periksa alur kerja, `[x]` berarti alur kerja dipilih di konfigurasi global. Untuk menerapkan pilihan tersebut ke file proyek, jalankan `openspec update` (atau pilih `Apply changes to this project now?` saat diminta di dalam proyek).

**Contoh interaktif:**

```bash
# Pembaruan hanya pengiriman
openspec config profile
# pilih: Change delivery only
# pilih pengiriman: Skills only

# Pembaruan hanya alur kerja
openspec config profile
# pilih: Change workflows only
# toggle alur kerja di daftar periksa, lalu konfirmasi
```

---

## Perintah Utilitas

### `openspec feedback`

Kirim umpan balik tentang OpenSpec. Membuat issue GitHub.

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
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Kelola penyelesaian shell untuk OpenSpec CLI.

```
openspec completion <subcommand> [shell]
```

**Subperintah:**

| Subperintah | Deskripsi |
|------------|-------------|
| `generate [shell]` | Output skrip penyelesaian ke stdout |
| `install [shell]` | Instal penyelesaian untuk shell Anda |
| `uninstall [shell]` | Hapus penyelesaian yang terinstal |

**Shell yang didukung:** `bash`, `zsh`, `fish`, `powershell`

**Contoh:**

```bash
# Instal penyelesaian (otomatis mendeteksi shell)
openspec completion install

# Instal untuk shell spesifik
openspec completion install zsh

# Generate skrip untuk instalasi manual
openspec completion generate bash > ~/.bash_completion.d/openspec

# Uninstal
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
| `NO_COLOR` | Nonaktifkan output warna saat diatur |

---

## Dokumentasi Terkait

- [Perintah](commands.md) - Perintah slash AI (`/opsx:propose`, `/opsx:apply`, dll.)
- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakan setiap perintah
- [Kustomisasi](customization.md) - Membuat schema dan template kustom
- [Memulai](getting-started.md) - Panduan pengaturan pertama kali