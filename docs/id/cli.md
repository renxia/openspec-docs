# Referensi CLI

OpenSpec CLI (`openspec`) menyediakan perintah terminal untuk pengaturan proyek, validasi, inspeksi status, dan manajemen. Perintah-perintah ini melengkapi perintah slash AI (seperti `/opsx:propose`) yang didokumentasikan di [Commands](commands.md).

## Ringkasan

| Kategori | Perintah | Tujuan |
|----------|----------|---------|
| **Pengaturan** | `init`, `update` | Inisialisasi dan perbarui OpenSpec di proyek Anda |
| **Workspace (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | Atur perencanaan di seluruh repositori atau folder yang tertaut |
| **Penelusuran** | `list`, `view`, `show` | Jelajahi perubahan dan spesifikasi |
| **Validasi** | `validate` | Periksa perubahan dan spesifikasi untuk masalah |
| **Siklus Hidup** | `archive` | Finalisasi perubahan yang telah selesai |
| **Alur Kerja** | `status`, `instructions`, `templates`, `schemas` | Dukungan alur kerja berbasis artefak |
| **Skema** | `schema init`, `schema fork`, `schema validate`, `schema which` | Buat dan kelola alur kerja kustom |
| **Konfigurasi** | `config` | Lihat dan modifikasi pengaturan |
| **Utilitas** | `feedback`, `completion` | Umpan balik dan integrasi shell |

---

## Perintah Human vs Agent

Sebagian besar perintah CLI dirancang untuk **penggunaan manusia** di terminal. Beberapa perintah juga mendukung **penggunaan agent/skrip** melalui output JSON.

### Perintah Khusus Manusia

Perintah-perintah ini bersifat interaktif dan dirancang untuk penggunaan terminal:

| Perintah | Tujuan |
|----------|--------|
| `openspec init` | Inisialisasi proyek (prompt interaktif) |
| `openspec view` | Dasbor interaktif |
| `openspec config edit` | Buka konfigurasi di editor |
| `openspec feedback` | Kirim umpan balik melalui GitHub |
| `openspec completion install` | Instal pelengkapan shell |

### Perintah Kompatibel Agent

Perintah-perintah ini mendukung output `--json` untuk penggunaan terprogram oleh AI agent dan skrip:

| Perintah | Penggunaan Manusia | Penggunaan Agent |
|----------|-------------------|------------------|
| `openspec list` | Jelajahi perubahan/spesifikasi | `--json` untuk data terstruktur |
| `openspec show <item>` | Baca konten | `--json` untuk parsing |
| `openspec validate` | Periksa masalah | `--all --json` untuk validasi massal |
| `openspec status` | Lihat progres artefak | `--json` untuk status terstruktur |
| `openspec instructions` | Dapatkan langkah selanjutnya | `--json` untuk instruksi agent |
| `openspec templates` | Temukan path template | `--json` untuk resolusi path |
| `openspec schemas` | Daftar skema yang tersedia | `--json` untuk penemuan skema |
| `openspec workspace setup --no-interactive` | Buat ruang kerja dengan input eksplisit | `--json` untuk output pengaturan terstruktur |
| `openspec workspace list` | Jelajahi ruang kerja yang diketahui | `--json` untuk objek ruang kerja bertipe |
| `openspec workspace link` | Tautkan repo atau folder | `--json` untuk output tautan terstruktur |
| `openspec workspace relink` | Perbaiki path yang ditautkan | `--json` untuk output tautan terstruktur |
| `openspec workspace doctor` | Periksa satu ruang kerja | `--json` untuk output status terstruktur |

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

Perilaku default menggunakan konfigurasi global default: profil `core`, pengiriman `both`, alur kerja `propose, explore, apply, sync, archive`.

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
| `--tools <list>` | Konfigurasi alat AI secara non-interaktif. Gunakan `all`, `none`, atau daftar yang dipisahkan koma |
| `--force` | Pembersihan otomatis file warisan tanpa konfirmasi |
| `--profile <profile>` | Timpa profil global untuk inisialisasi ini (`core` atau `custom`) |

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

# Timpa profil untuk inisialisasi ini
openspec init --profile core

# Lewati prompt dan bersihkan otomatis file warisan
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
... (konfigurasi alat lainnya)
```

---

### `openspec update`

Perbarui file instruksi OpenSpec setelah meningkatkan CLI. Membuat ulang file konfigurasi alat AI menggunakan profil global saat ini, alur kerja yang dipilih, dan mode pengiriman.

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
| `--force` | Paksa pembaruan bahkan saat file sudah terbaru |

**Contoh:**

```bash
# Perbarui file instruksi setelah peningkatan npm
npm update @fission-ai/openspec
openspec update
```

---

## Perintah Ruang Kerja

Perintah ruang kerja sedang dalam pengembangan aktif dan belum siap digunakan. Jangan bangun otomatisasi eksternal, integrasi, atau alur kerja jangka panjang di atas permukaan perintah ini; perilaku perintah, file status, dan output JSON dapat berubah sewaktu-waktu.

Ruang kerja koordinasi adalah rumah perencanaan untuk pekerjaan yang mencakup beberapa repo atau folder. Visibilitas ruang kerja bukan komitmen perubahan: tautkan repo atau folder yang perlu diketahui OpenSpec, lalu buat perubahan saat Anda siap merencanakan pekerjaan spesifik.

### `openspec workspace setup`

Buat ruang kerja di lokasi ruang kerja OpenSpec standar dan tautkan setidaknya satu repo atau folder yang ada.

```bash
openspec workspace setup [options]
```

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--name <name>` | Nama ruang kerja. Nama harus dalam format kebab-case |
| `--link <path>` | Tautkan repo atau folder yang ada dan inferensi nama tautan dari nama folder |
| `--link <name>=<path>` | Tautkan repo atau folder yang ada dengan nama tautan eksplisit |
| `--opener <id>` | Simpan pembuka pilihan selama pengaturan non-interaktif: `codex`, `claude`, `github-copilot`, atau `editor` |
| `--no-interactive` | Nonaktifkan prompt; memerlukan `--name` dan setidaknya satu `--link` |
| `--json` | Output JSON; memerlukan `--no-interactive` |

**Contoh:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Pengaturan interaktif menanyakan pembuka pilihan dan menyimpannya dalam status ruang kerja lokal mesin. Pengaturan non-interaktif menyimpan pembuka pilihan hanya ketika `--opener` disediakan; jika tidak, `workspace open` akan meminta nanti di terminal interaktif saat pembuka yang didukung tersedia, atau meminta skrip untuk meneruskan `--agent <tool>` atau `--editor`.

### `openspec workspace list`

Daftar ruang kerja OpenSpec yang diketahui dari registri lokal.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

Daftar menunjukkan lokasi setiap ruang kerja dan repo atau folder yang ditautkan. Catatan registri yang usang dilaporkan tetapi tidak diubah.

### `openspec workspace link`

Catat repo atau folder yang ada untuk satu ruang kerja.

```bash
openspec workspace link [name] <path> [options]
```

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--workspace <name>` | Pilih ruang kerja yang diketahui dari registri lokal |
| `--json` | Output JSON |
| `--no-interactive` | Nonaktifkan prompt pemilih ruang kerja |

**Contoh:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Path harus sudah ada. Path relatif diselesaikan terhadap direktori saat ini perintah sebelum OpenSpec menyimpan path absolut yang diverifikasi dalam status ruang kerja lokal mesin. Path yang ditautkan bisa berupa repo, paket, layanan, aplikasi, atau folder penuh tanpa status `openspec/` lokal repo.

### `openspec workspace relink`

Perbaiki atau ubah path lokal untuk tautan yang ada.

```bash
openspec workspace relink <name> <path> [options]
```

Path harus sudah ada. Relink hanya memperbarui path lokal mesin untuk nama tautan yang stabil.

### `openspec workspace doctor`

Periksa apa yang dapat diselesaikan oleh satu ruang kerja di mesin saat ini.

```bash
openspec workspace doctor [options]
```

Doctor menunjukkan lokasi ruang kerja, path perencanaan, repo atau folder yang ditautkan, path yang hilang, path spesifikasi lokal repo saat ada, dan perbaikan yang disarankan. Hanya melaporkan masalah; tidak memperbaikinya secara otomatis.

Perintah yang memerlukan satu ruang kerja menggunakan ruang kerja saat ini ketika dijalankan dari dalam folder atau subdirektori ruang kerja. Dari tempat lain, teruskan `--workspace <name>`, pilih dari pemilih di terminal interaktif, atau andalkan satu-satunya ruang kerja yang diketahui ketika hanya ada satu. Dalam mode `--json` atau `--no-interactive`, pemilihan ambigu gagal dengan error status terstruktur dan menyarankan `--workspace <name>`.

Respons JSON menggunakan objek bertipe plus array `status`. Data utama ada di `workspace`, `workspaces`, atau `link`; peringatan dan error ada di `status`.

### `openspec workspace open`

Buka set kerja ruang kerja melalui pembuka pilihan yang disimpan, override agent satu sesi, atau mode editor VS Code.

```bash
openspec workspace open [name] [options]
```

**Opsi:**

| Opsi | Deskripsi |
|------|-----------|
| `--workspace <name>` | Alias untuk nama ruang kerja posisional |
| `--agent <tool>` | Override agent satu sesi: `codex`, `claude`, atau `github-copilot` |
| `--editor` | Buka file ruang kerja VS Code yang dipelihara sebagai ruang kerja editor normal |
| `--no-interactive` | Nonaktifkan prompt pemilih ruang kerja dan pembuka |

**Contoh:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` menggunakan ruang kerja saat ini ketika dijalankan di dalamnya, secara otomatis memilih satu-satunya ruang kerja yang diketahui ketika dijalankan di tempat lain, dan meminta pengguna untuk memilih ketika beberapa ruang kerja diketahui. `--agent` dan `--editor` tidak mengubah pembuka pilihan yang disimpan. Meneruskan kedua override pembuka adalah error; pilih salah satu `--agent <tool>` atau `--editor`.

OpenSpec memelihara `<workspace-name>.code-workspace` di root ruang kerja untuk pembuka VS Code dan GitHub Copilot-in-VS-Code. File tersebut bersifat lokal mesin dan diabaikan secara default dengan entri `.gitignore` `<workspace-name>.code-workspace` tertentu, sehingga file `*.code-workspace` buatan pengguna tetap memenuhi syarat untuk dilacak.

Ruang kerja VS Code yang dipelihara mencakup root koordinasi sebagai `.` plus repo atau folder yang ditautkan valid sebagai root tambahan. VS Code menampilkan entri tersebut sebagai ruang kerja multi-root.

Pembuka ruang kerja root mendukung eksplorasi dan perencanaan lintas repo atau folder yang ditautkan. Edit implementasi harus dimulai hanya setelah permintaan eksplisit pengguna dan alur kerja implementasi OpenSpec normal.

---

## Perintah Penelusuran

### `openspec list`

Daftar perubahan atau spesifikasi dalam proyek Anda.

```
openspec list [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--specs` | Daftar spesifikasi alih-alih perubahan |
| `--changes` | Daftar perubahan (default) |
| `--sort <order>` | Urutkan berdasarkan `recent` (default) atau `name` |
| `--json` | Keluaran dalam format JSON |

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
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
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

Tampilkan detail dari sebuah perubahan atau spesifikasi.

```
openspec show [item-name] [options]
```

**Argumen:**

| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `item-name` | Tidak | Nama perubahan atau spesifikasi (akan diminta jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--type <type>` | Tentukan tipe: `change` atau `spec` (terdeteksi otomatis jika tidak ambigu) |
| `--json` | Keluaran dalam format JSON |
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
| `-r, --requirement <id>` | Tampilkan persyaratan spesifik berdasarkan indeks berbasis 1 (mode JSON) |

**Contoh:**

```bash
# Pemilihan interaktif
openspec show

# Tampilkan perubahan spesifik
openspec show add-dark-mode

# Tampilkan spesifikasi spesifik
openspec show auth --type spec

# Keluaran JSON untuk parsing
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

| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `item-name` | Tidak | Item spesifik untuk divalidasi (akan diminta jika dihilangkan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--all` | Validasi semua perubahan dan spesifikasi |
| `--changes` | Validasi semua perubahan |
| `--specs` | Validasi semua spesifikasi |
| `--type <type>` | Tentukan tipe ketika nama ambigu: `change` atau `spec` |
| `--strict` | Aktifkan mode validasi ketat |
| `--json` | Keluaran dalam format JSON |
| `--concurrency <n>` | Validasi paralel maksimum (default: 6, atau env `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Nonaktifkan prompt |

**Contoh:**

```bash
# Validasi interaktif
openspec validate

# Validasi perubahan spesifik
openspec validate add-dark-mode

# Validasi semua perubahan
openspec validate --changes

# Validasi semua dengan keluaran JSON (untuk CI/skrip)
openspec validate --all --json

# Validasi ketat dengan peningkatan paralelisme
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

## Perintah Lifecycle

### `openspec archive`

Arsipkan perubahan yang telah selesai dan gabungkan spesifikasi delta ke dalam spesifikasi utama.

```
openspec archive [change-name] [options]
```

**Argumen:**

| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `change-name` | Tidak | Perubahan yang akan diarsipkan (akan diminta jika tidak disertakan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `-y, --yes` | Lewati konfirmasi |
| `--skip-specs` | Lewati pembaruan spesifikasi (untuk perubahan infrastruktur/peralatan/dokumentasi saja) |
| `--no-validate` | Lewati validasi (memerlukan konfirmasi) |

**Contoh:**

```bash
# Arsipkan secara interaktif
openspec archive

# Arsipkan perubahan spesifik
openspec archive add-dark-mode

# Arsipkan tanpa konfirmasi (untuk CI/skrip)
openspec archive add-dark-mode --yes

# Arsipkan perubahan peralatan yang tidak memengaruhi spesifikasi
openspec archive update-ci-config --skip-specs
```

**Apa yang dilakukan:**

1. Memvalidasi perubahan (kecuali `--no-validate`)
2. Meminta konfirmasi (kecuali `--yes`)
3. Menggabungkan spesifikasi delta ke dalam `openspec/specs/`
4. Memindahkan folder perubahan ke `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Perintah Alur Kerja

Perintah-perintah ini mendukung alur kerja OPSX berbasis artefak. Berguna baik bagi manusia yang memeriksa progres maupun agen yang menentukan langkah selanjutnya.

### `openspec status`

Tampilkan status penyelesaian artefak untuk sebuah perubahan.

```
openspec status [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--change <id>` | Nama perubahan (akan diminta jika tidak disertakan) |
| `--schema <name>` | Timpa skema (terdeteksi otomatis dari konfigurasi perubahan) |
| `--json` | Keluarkan sebagai JSON |

**Contoh:**

```bash
# Periksa status secara interaktif
openspec status

# Status untuk perubahan spesifik
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

| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `artifact` | Tidak | ID artefak: `proposal`, `specs`, `design`, `tasks`, atau `apply` |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--change <id>` | Nama perubahan (wajib dalam mode non-interaktif) |
| `--schema <name>` | Timpa skema |
| `--json` | Keluarkan sebagai JSON |

**Kasus khusus:** Gunakan `apply` sebagai artefak untuk mendapatkan instruksi implementasi tugas.

**Contoh:**

```bash
# Dapatkan instruksi untuk artefak berikutnya
openspec instructions --change add-dark-mode

# Dapatkan instruksi artefak spesifik
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

Tampilkan path template yang telah diselesaikan untuk semua artefak dalam sebuah skema.

```
openspec templates [options]
```

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--schema <name>` | Skema yang akan diperiksa (default: `spec-driven`) |
| `--json` | Keluarkan sebagai JSON |

**Contoh:**

```bash
# Tampilkan path template untuk skema default
openspec templates

# Tampilkan template untuk skema kustom
openspec templates --schema my-workflow

# JSON untuk penggunaan programatik
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
| `--json` | Keluarkan sebagai JSON |

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

| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `name` | Ya | Nama skema (kebab-case) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--description <text>` | Deskripsi skema |
| `--artifacts <list>` | ID artefak yang dipisahkan koma (default: `proposal,specs,design,tasks`) |
| `--default` | Atur sebagai skema default proyek |
| `--no-default` | Jangan tawarkan untuk mengatur sebagai default |
| `--force` | Timpa skema yang sudah ada |
| `--json` | Keluarkan sebagai JSON |

**Contoh:**

```bash
# Buat skema secara interaktif
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

Salin skema yang sudah ada ke proyek Anda untuk kustomisasi.

```
openspec schema fork <source> [name] [options]
```

**Argumen:**

| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `source` | Ya | Skema yang akan disalin |
| `name` | Tidak | Nama skema baru (default: `<source>-custom`) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--force` | Timpa tujuan yang sudah ada |
| `--json` | Keluarkan sebagai JSON |

**Contoh:**

```bash
# Fork skema bawaan spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Validasi struktur dan template sebuah skema.

```
openspec schema validate [name] [options]
```

**Argumen:**

| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `name` | Tidak | Skema yang akan divalidasi (validasi semua jika tidak disertakan) |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--verbose` | Tampilkan langkah validasi secara detail |
| `--json` | Keluarkan sebagai JSON |

**Contoh:**

```bash
# Validasi skema spesifik
openspec schema validate my-workflow

# Validasi semua skema
openspec schema validate
```

---

### `openspec schema which`

Tampilkan dari mana sebuah skema diselesaikan (berguna untuk debugging prioritas).

```
openspec schema which [name] [options]
```

**Argumen:**

| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `name` | Tidak | Nama skema |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--all` | Daftarkan semua skema beserta sumbernya |
| `--json` | Keluarkan sebagai JSON |

**Contoh:**

```bash
# Periksa dari mana sebuah skema berasal
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

Melihat dan memodifikasi konfigurasi global OpenSpec.

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
openspec config set user.name "Nama Saya" --string

# Hapus pengaturan kustom
openspec config unset user.name

# Atur ulang semua konfigurasi
openspec config reset --all --yes

# Edit konfigurasi di editor Anda
openspec config edit

# Konfigurasi profil dengan wizard berbasis aksi
openspec config profile

# Preset cepat: beralih alur kerja ke inti (mempertahankan mode pengiriman)
openspec config profile core
```

`openspec config profile` dimulai dengan ringkasan kondisi saat ini, lalu memungkinkan Anda memilih:
- Ubah pengiriman + alur kerja
- Ubah hanya pengiriman
- Ubah hanya alur kerja
- Pertahankan pengaturan saat ini (keluar)

Jika Anda mempertahankan pengaturan saat ini, tidak ada perubahan yang ditulis dan tidak ada prompt pembaruan yang ditampilkan.
Jika tidak ada perubahan konfigurasi tetapi file proyek saat ini tidak sinkron dengan profil/pengiriman global Anda, OpenSpec akan menampilkan peringatan dan menyarankan untuk menjalankan `openspec update`.
Menekan `Ctrl+C` juga membatalkan alur dengan bersih (tanpa jejak tumpukan) dan keluar dengan kode `130`.
Dalam daftar periksa alur kerja, `[x]` berarti alur kerja dipilih dalam konfigurasi global. Untuk menerapkan pilihan tersebut ke file proyek, jalankan `openspec update` (atau pilih `Terapkan perubahan ke proyek ini sekarang?` saat diminta di dalam proyek).

**Contoh interaktif:**

```bash
# Pembaruan hanya pengiriman
openspec config profile
# pilih: Ubah hanya pengiriman
# pilih pengiriman: Hanya keterampilan

# Pembaruan hanya alur kerja
openspec config profile
# pilih: Ubah hanya alur kerja
# alihkan alur kerja dalam daftar periksa, lalu konfirmasi
```

---

## Perintah Utilitas

### `openspec feedback`

Kirim umpan balik tentang OpenSpec. Membuat isu GitHub.

```
openspec feedback <message> [options]
```

**Argumen:**

| Argumen | Diperlukan | Deskripsi |
|----------|----------|-------------|
| `message` | Ya | Pesan umpan balik |

**Opsi:**

| Opsi | Deskripsi |
|--------|-------------|
| `--body <text>` | Deskripsi rinci |

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

# Hasilkan skrip untuk instalasi manual
openspec completion generate bash > ~/.bash_completion.d/openspec

# Hapus instalasi
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
- [Kustomisasi](customization.md) - Buat skema dan templat kustom
- [Memulai](getting-started.md) - Panduan pengaturan pertama kali