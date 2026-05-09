# Migrasi ke OPSX

Panduan ini membantu Anda beralih dari alur kerja OpenSpec lama ke OPSX. Migrasi dirancang agar lancar—pekerjaan Anda yang ada tetap terjaga, dan sistem baru menawarkan lebih banyak fleksibilitas.

## Apa yang Berubah?

OPSX menggantikan alur kerja terkunci fase lama dengan pendekatan berbasis aksi yang mengalir. Berikut perubahan utamanya:

| Aspek | Legacy | OPSX |
|--------|--------|------|
| **Perintah** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Default: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (perintah alur kerja yang diperluas opsional) |
| **Alur Kerja** | Buat semua artefak sekaligus | Buat secara bertahap atau sekaligus—pilihan Anda |
| **Kembali ke tahap sebelumnya** | Gerbang fase yang canggung | Alami—perbarui artefak kapan saja |
| **Kustomisasi** | Struktur tetap | Didorong skema, sepenuhnya dapat diutak-atik |
| **Konfigurasi** | `CLAUDE.md` dengan penanda + `project.md` | Konfigurasi bersih di `openspec/config.yaml` |

**Perubahan filosofi:** Pekerjaan tidak linear. OPSX berhenti berpura-pura bahwa itu linear.

---

## Sebelum Memulai

### Pekerjaan Anda yang Ada Aman

Proses migrasi dirancang dengan mempertahankan data:

- **Perubahan aktif di `openspec/changes/`** — Sepenuhnya dipertahankan. Anda dapat melanjutkannya dengan perintah OPSX.
- **Perubahan yang diarsipkan** — Tidak tersentuh. Riwayat Anda tetap utuh.
- **Spesifikasi utama di `openspec/specs/`** — Tidak tersentuh. Ini adalah sumber kebenaran Anda.
- **Konten Anda di CLAUDE.md, AGENTS.md, dll.** — Dipertahankan. Hanya blok penanda OpenSpec yang dihapus; semua yang Anda tulis tetap ada.

### Apa yang Dihapus

Hanya file yang dikelola OpenSpec yang sedang diganti:

| Apa | Mengapa |
|------|---------|
| Direktori/file perintah slash lama | Diganti oleh sistem keterampilan baru |
| `openspec/AGENTS.md` | Pemicu alur kerja yang sudah usang |
| Penanda OpenSpec di `CLAUDE.md`, `AGENTS.md`, dll. | Tidak lagi diperlukan |

**Lokasi perintah lama berdasarkan alat** (contoh—alat Anda mungkin berbeda):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (hanya ekstensi IDE; tidak didukung di Copilot CLI)
- Dan lainnya (Augment, Continue, Amazon Q, dll.)

Migrasi mendeteksi alat mana yang Anda konfigurasikan dan membersihkan file lamanya.

Daftar penghapusan mungkin terlihat panjang, tetapi ini semua adalah file yang awalnya dibuat oleh OpenSpec. Konten Anda sendiri tidak pernah dihapus.

### Apa yang Perlu Perhatian Anda

Satu file memerlukan migrasi manual:

**`openspec/project.md`** — File ini tidak dihapus secara otomatis karena mungkin berisi konteks proyek yang Anda tulis. Anda perlu:

1. Tinjau isinya
2. Pindahkan konteks yang berguna ke `openspec/config.yaml` (lihat panduan di bawah)
3. Hapus file tersebut setelah siap

**Mengapa kami membuat perubahan ini:**

`project.md` lama bersifat pasif—agen mungkin membacanya, mungkin tidak, mungkin lupa apa yang dibaca. Kami menemukan keandalannya tidak konsisten.

Konteks `config.yaml` baru **disuntikkan secara aktif ke setiap permintaan perencanaan OpenSpec**. Ini berarti konvensi proyek, tumpukan teknologi, dan aturan Anda selalu ada saat AI membuat artefak. Keandalan lebih tinggi.

**Kompensasinya:**

Karena konteks disuntikkan ke setiap permintaan, Anda akan ingin lebih ringkas. Fokus pada apa yang benar-benar penting:
- Tumpukan teknologi dan konvensi utama
- Batasan yang tidak jelas yang perlu diketahui AI
- Aturan yang sering diabaikan sebelumnya

Jangan khawatir untuk membuatnya sempurna. Kami masih belajar apa yang paling berhasil di sini, dan kami akan meningkatkan cara injeksi konteks bekerja saat kami bereksperimen.

---

## Menjalankan Migrasi

Baik `openspec init` maupun `openspec update` mendeteksi file lama dan memandu Anda melalui proses pembersihan yang sama. Gunakan mana yang sesuai dengan situasi Anda:

- Instalasi baru secara default menggunakan profil `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Instalasi yang dimigrasi mempertahankan alur kerja yang sebelumnya diinstal dengan menulis profil `custom` saat diperlukan.

### Menggunakan `openspec init`

Jalankan ini jika Anda ingin menambahkan alat baru atau mengonfigurasi ulang alat mana yang diatur:

```bash
openspec init
```

Perintah init mendeteksi file lama dan memandu Anda melalui pembersihan:

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**Apa yang terjadi saat Anda menjawab ya:**

1. Direktori perintah slash lama dihapus
2. Penanda OpenSpec dihapus dari `CLAUDE.md`, `AGENTS.md`, dll. (konten Anda tetap ada)
3. `openspec/AGENTS.md` dihapus
4. Keterampilan baru diinstal di `.claude/skills/`
5. `openspec/config.yaml` dibuat dengan skema default

### Menggunakan `openspec update`

Jalankan ini jika Anda hanya ingin memigrasi dan menyegarkan alat yang ada ke versi terbaru:

```bash
openspec update
```

Perintah update juga mendeteksi dan membersihkan artefak lama, lalu menyegarkan keterampilan/perintah yang dihasilkan agar sesuai dengan profil dan pengaturan pengiriman Anda saat ini.

### Lingkungan Non-Interaktif / CI

Untuk migrasi yang dijalankan melalui skrip:

```bash
openspec init --force --tools claude
```

Flag `--force` melewati prompt dan secara otomatis menerima pembersihan.

---

## Memigrasi project.md ke config.yaml

`openspec/project.md` lama adalah file markdown bebas untuk konteks proyek. `openspec/config.yaml` baru terstruktur dan—yang paling kritis—**disuntikkan ke setiap permintaan perencanaan** sehingga konvensi Anda selalu ada saat AI bekerja.

### Sebelum (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Sesudah (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Perbedaan Utama

| project.md | config.yaml |
|------------|-------------|
| Markdown bebas | YAML terstruktur |
| Satu blok teks | Konteks terpisah dan aturan per artefak |
| Tidak jelas kapan digunakan | Konteks muncul di SEMUA artefak; aturan hanya muncul di artefak yang cocok |
| Tidak ada pemilihan skema | Field `schema:` eksplisit mengatur alur kerja default |

### Apa yang Harus Dipertahankan, Apa yang Harus Dihapus

Saat memigrasi, bersikap selektif. Tanyakan pada diri sendiri: "Apakah AI memerlukan ini untuk *setiap* permintaan perencanaan?"

**Kandidat yang baik untuk `context:`**
- Tumpukan teknologi (bahasa, kerangka kerja, basis data)
- Pola arsitektur utama (monorepo, microservices, dll.)
- Batasan yang tidak jelas ("kami tidak bisa menggunakan pustaka X karena...")
- Konvensi kritis yang sering diabaikan

**Pindahkan ke `rules:` sebagai gantinya**
- Pemformatan spesifik artefak ("gunakan Given/When/Then dalam spesifikasi")
- Kriteria tinjauan ("proposal harus menyertakan rencana rollback")
- Ini hanya muncul untuk artefak yang cocok, menjaga permintaan lain tetap ringan

**Hilangkan sepenuhnya**
- Praktik terbaik umum yang sudah diketahui AI
- Penjelasan bertele-tele yang bisa diringkas
- Konteks historis yang tidak memengaruhi pekerjaan saat ini

### Langkah Migrasi

1. **Buat config.yaml** (jika belum dibuat oleh init):
   ```yaml
   schema: spec-driven
   ```

2. **Tambahkan konteks Anda** (singkat—ini masuk ke setiap permintaan):
   ```yaml
   context: |
     Latar belakang proyek Anda ada di sini.
     Fokus pada apa yang benar-benar perlu diketahui AI.
   ```

3. **Tambahkan aturan per artefak** (opsional):
   ```yaml
   rules:
     proposal:
       - Panduan spesifik proposal Anda
     specs:
       - Aturan penulisan spesifikasi Anda
   ```

4. **Hapus project.md** setelah Anda memindahkan semua yang berguna.

**Jangan terlalu berpikir keras.** Mulailah dengan hal-hal penting dan iterasi. Jika Anda melihat AI melewatkan sesuatu yang penting, tambahkan. Jika konteks terasa berlebihan, potong. Ini adalah dokumen hidup.

### Butuh Bantuan? Gunakan Prompt Ini

Jika Anda tidak yakin bagaimana menyaring project.md Anda, minta asisten AI Anda:

```
Saya sedang memigrasi dari project.md lama OpenSpec ke format config.yaml baru.

Ini project.md saya saat ini:
[tempel konten project.md Anda]

Tolong bantu saya membuat config.yaml dengan:
1. Bagian `context:` yang ringkas (ini disuntikkan ke setiap permintaan perencanaan, jadi buat padat—fokus pada tumpukan teknologi, batasan utama, dan konvensi yang sering diabaikan)
2. `rules:` untuk artefak spesifik jika ada konten yang spesifik artefak (misalnya, "gunakan Given/When/Then" masuk ke aturan spesifikasi, bukan konteks global)

Hilangkan apa pun yang umum yang sudah diketahui model AI. Tegas tentang keringkasan.
```

AI akan membantu Anda mengidentifikasi apa yang penting vs. apa yang bisa dipotong.

---

## Perintah Baru

Ketersediaan perintah tergantung pada profil:

**Default (profil `core`):**

| Perintah | Tujuan |
|----------|--------|
| `/opsx:propose` | Membuat perubahan dan menghasilkan artefak perencanaan dalam satu langkah |
| `/opsx:explore` | Memikirkan ide tanpa struktur |
| `/opsx:apply` | Mengimplementasikan tugas dari tasks.md |
| `/opsx:archive` | Memfinalisasi dan mengarsipkan perubahan |

**Alur kerja yang diperluas (pilihan kustom):**

| Perintah | Tujuan |
|----------|--------|
| `/opsx:new` | Memulai kerangka perubahan baru |
| `/opsx:continue` | Membuat artefak berikutnya (satu per satu) |
| `/opsx:ff` | Fast-forward—membuat artefak perencanaan sekaligus |
| `/opsx:verify` | Memvalidasi implementasi sesuai spesifikasi |
| `/opsx:sync` | Menggabungkan spesifikasi delta ke spesifikasi utama |
| `/opsx:bulk-archive` | Mengarsipkan beberapa perubahan sekaligus |
| `/opsx:onboard` | Alur kerja orientasi ujung-ke-ujung terpandu |

Aktifkan perintah yang diperluas dengan `openspec config profile`, lalu jalankan `openspec update`.

### Pemetaan Perintah dari Versi Lama

| Versi Lama | Setara OPSX |
|------------|-------------|
| `/openspec:proposal` | `/opsx:propose` (default) atau `/opsx:new` lalu `/opsx:ff` (diperluas) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Kemampuan Baru

Kemampuan ini merupakan bagian dari set perintah alur kerja yang diperluas.

**Pembuatan artefak granular:**
```
/opsx:continue
```
Membuat satu artefak pada satu waktu berdasarkan dependensi. Gunakan ini saat Anda ingin meninjau setiap langkah.

**Mode eksplorasi:**
```
/opsx:explore
```
Memikirkan ide dengan mitra sebelum berkomitmen pada perubahan.

---

## Memahami Arsitektur Baru

### Dari Terkunci-Fase ke Fleksibel

Alur kerja lama memaksa progresi linear:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Jika Anda sedang dalam implementasi dan menyadari desainnya salah?
Sayang sekali. Gerbang fase tidak memungkinkan Anda kembali dengan mudah.
```

OPSX menggunakan aksi, bukan fase:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### Grafik Dependensi

Artefak membentuk grafik terarah. Dependensi adalah pengaktif, bukan gerbang:

```
                        proposal
                       (root node)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requires:                  (requires:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requires:
                     specs, design)
```

Ketika Anda menjalankan `/opsx:continue`, ia memeriksa apa yang siap dan menawarkan artefak berikutnya. Anda juga dapat membuat beberapa artefak yang siap dalam urutan apa pun.

### Keterampilan vs Perintah

Sistem lama menggunakan file perintah khusus alat:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX menggunakan standar **keterampilan** yang muncul:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Keterampilan diakui di berbagai alat pengkodean AI dan menyediakan metadata yang lebih kaya.

---

## Melanjutkan Perubahan yang Ada

Perubahan Anda yang sedang berlangsung berfungsi secara mulus dengan perintah OPSX.

**Memiliki perubahan aktif dari alur kerja lama?**

```
/opsx:apply add-my-feature
```

OPSX membaca artefak yang ada dan melanjutkan dari tempat Anda tinggalkan.

**Ingin menambahkan lebih banyak artefak ke perubahan yang ada?**

```
/opsx:continue add-my-feature
```

Menampilkan apa yang siap untuk dibuat berdasarkan apa yang sudah ada.

**Perlu melihat status?**

```bash
openspec status --change add-my-feature
```

---

## Sistem Konfigurasi Baru

### Struktur config.yaml

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Latar belakang proyek Anda, tumpukan teknologi,
  konvensi, dan batasan.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Sertakan rencana rollback
  specs:
    - Gunakan format Given/When/Then
  design:
    - Dokumentasikan strategi cadangan
  tasks:
    - Pecah menjadi potongan maksimal 2 jam
```

### Resolusi Skema

Ketika menentukan skema mana yang akan digunakan, OPSX memeriksa secara berurutan:

1. **Bendera CLI**: `--schema <name>` (prioritas tertinggi)
2. **Metadata perubahan**: `.openspec.yaml` di direktori perubahan
3. **Konfigurasi proyek**: `openspec/config.yaml`
4. **Default**: `spec-driven`

### Skema yang Tersedia

| Skema | Artefak | Terbaik Untuk |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | Sebagian besar proyek |

Daftar semua skema yang tersedia:

```bash
openspec schemas
```

### Skema Kustom

Buat alur kerja Anda sendiri:

```bash
openspec schema init my-workflow
```

Atau fork yang sudah ada:

```bash
openspec schema fork spec-driven my-workflow
```

Lihat [Kustomisasi](customization.md) untuk detail.

---

## Pemecahan Masalah

### "File lama terdeteksi dalam mode non-interaktif"

Anda menjalankan dalam CI atau lingkungan non-interaktif. Gunakan:

```bash
openspec init --force
```

### Perintah tidak muncul setelah migrasi

Mulai ulang IDE Anda. Keterampilan terdeteksi saat startup.

### "ID artefak tidak dikenal dalam aturan"

Periksa bahwa kunci `rules:` Anda cocok dengan ID artefak skema Anda:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Jalankan ini untuk melihat ID artefak yang valid:

```bash
openspec schemas --json
```

### Konfigurasi tidak diterapkan

1. Pastikan file berada di `openspec/config.yaml` (bukan `.yml`)
2. Validasi sintaks YAML
3. Perubahan konfigurasi berlaku segera—tidak perlu restart

### project.md tidak dimigrasikan

Sistem sengaja mempertahankan `project.md` karena mungkin berisi konten kustom Anda. Tinjau secara manual, pindahkan bagian yang berguna ke `config.yaml`, lalu hapus.

### Ingin melihat apa yang akan dibersihkan?

Jalankan init dan tolak prompt pembersihan—Anda akan melihat ringkasan deteksi lengkap tanpa perubahan apa pun yang dilakukan.

---

## Referensi Cepat

### File Setelah Migrasi

```
project/
├── openspec/
│   ├── specs/                    # Tidak berubah
│   ├── changes/                  # Tidak berubah
│   │   └── archive/              # Tidak berubah
│   └── config.yaml               # BARU: Konfigurasi proyek
├── .claude/
│   └── skills/                   # BARU: Keterampilan OPSX
│       ├── openspec-propose/     # profil inti default
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # profil yang diperluas menambahkan new/continue/ff/dll.
├── CLAUDE.md                     # Penanda OpenSpec dihapus, konten Anda dipertahankan
└── AGENTS.md                     # Penanda OpenSpec dihapus, konten Anda dipertahankan
```

### Apa yang Hilang

- `.claude/commands/openspec/` — digantikan oleh `.claude/skills/`
- `openspec/AGENTS.md` — usang
- `openspec/project.md` — migrasikan ke `config.yaml`, lalu hapus
- Blok penanda OpenSpec di `CLAUDE.md`, `AGENTS.md`, dll.

### Lembar Contek Perintah

```text
/opsx:propose      Mulai dengan cepat (profil inti default)
/opsx:apply        Implementasikan tugas
/opsx:archive      Selesaikan dan arsipkan

# Alur kerja yang diperluas (jika diaktifkan):
/opsx:new          Scaffold perubahan
/opsx:continue     Buat artefak berikutnya
/opsx:ff           Buat artefak perencanaan
```

---

## Mendapatkan Bantuan

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokumentasi**: [docs/opsx.md](opsx.md) untuk referensi OPSX lengkap