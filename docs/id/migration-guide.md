# Migrasi ke OPSX

Panduan ini membantu Anda beralih dari alur kerja OpenSpec legacy ke OPSX. Migrasi ini dirancang untuk berjalan lancar—pekerjaan Anda yang ada tetap terjaga, dan sistem baru menawarkan fleksibilitas yang lebih besar.

## Apa yang Berubah?

OPSX menggantikan alur kerja berbasis fase yang lama dengan pendekatan yang lebih cair berbasis aksi. Perubahan kuncinya adalah sebagai berikut:

| Aspek | Legacy | OPSX |
|--------|--------|------|
| **Perintah** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Default: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (perintah alur kerja tambahan opsional) |
| **Alur Kerja** | Buat semua artefak sekaligus | Buat secara bertahap atau sekaligus—pilihan Anda |
| **Kembali ke belakang** | Gerbang fase yang canggung | Alami—perbarui artefak kapan saja |
| **Kustomisasi** | Struktur tetap | Berdasarkan skema, sepenuhnya dapat dihack |
| **Konfigurasi** | `CLAUDE.md` dengan penanda + `project.md` | Konfigurasi bersih di `openspec/config.yaml` |

**Perubahan filosofi:** Pekerjaan tidak bersifat linear. OPSX berhenti berpura-pura bahwa ia linear.

## Sebelum Anda Mulai

### Pekerjaan Anda yang Sudah Ada Aman

Proses migrasi dirancang dengan mempertimbangkan preservasi:

- **Perubahan aktif di `openspec/changes/`** — Sepenuhnya dipertahankan. Anda dapat melanjutkannya dengan perintah OPSX.
- **Perubahan yang diarsipkan** — Tidak diubah. Riwayat Anda tetap utuh.
- **Spesifikasi utama di `openspec/specs/`** — Tidak diubah. Ini adalah sumber kebenaran Anda.
- **Konten Anda di CLAUDE.md, AGENTS.md, dll.** — Dipertahankan. Hanya blok penanda OpenSpec yang dihapus; semua yang Anda tulis tetap ada.

### Apa yang Dihapus

Hanya file yang dikelola OpenSpec yang sedang diganti:

| Apa | Mengapa |
|-----|---------|
| Direktori/file perintah legacy | Diganti oleh sistem skill baru |
| `openspec/AGENTS.md` | Pemicu alur kerja usang |
| Penanda OpenSpec di `CLAUDE.md`, `AGENTS.md`, dll. | Tidak lagi diperlukan |

**Lokasi perintah legacy berdasarkan alat** (contoh—alat Anda mungkin berbeda):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.cinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (hanya ekstensi IDE; tidak didukung di Copilot CLI)
- Codex: OpenSpec sekarang menggunakan `.codex/skills/openspec-*`; pembersihan legacy hanya menargetkan nama file prompt OpenSpec yang diizinkan di `$CODEX_HOME/prompts` atau `~/.codex/prompts`, dan hanya menghapusnya setelah skill pengganti ada.
- Dan lainnya (Augment, Continue, Amazon Q, dll.)

Migrasi mendeteksi alat mana pun yang Anda konfigurasi dan membersihkan file legacy-nya.

Daftar penghapusan mungkin terlihat panjang, tetapi semua ini adalah file yang awalnya dibuat oleh OpenSpec. Konten Anda sendiri tidak pernah dihapus.

### Apa yang Perlu Perhatian Anda

Satu file memerlukan migrasi manual:

**`openspec/project.md`** — File ini tidak dihapus secara otomatis karena mungkin berisi konteks proyek yang Anda tulis. Anda perlu:

1. Tinjau isinya
2. Pindahkan konteks yang berguna ke `openspec/config.yaml` (lihat panduan di bawah)
3. Hapus file tersebut saat siap

**Mengapa kami membuat perubahan ini:**

`project.md` lama bersifat pasif—agen mungkin membacanya, mungkin tidak, mungkin lupa apa yang mereka baca. Kami menemukan keandalan tidak konsisten.

Konteks `config.yaml` baru **secara aktif disuntikkan ke setiap permintaan perencanaan OpenSpec**. Artinya konvensi proyek, tumpukan teknologi, dan aturan Anda selalu ada ketika AI membuat artefak. Keandalan lebih tinggi.

**Komprominya:**

Karena konteks disuntikkan ke setiap permintaan, Anda ingin tetap ringkas. Fokus pada apa yang benar-benar penting:
- Tumpukan teknologi dan konvensi utama
- Batasan yang tidak jelas yang perlu diketahui AI
- Aturan yang sering diabaikan sebelumnya

Jangan khawatir untuk membuatnya sempurna. Kami masih mempelajari apa yang terbaik di sini, dan kami akan meningkatkan cara injeksi konteks saat kami bereksperimen.

---

## Menjalankan Migrasi

Baik `openspec init` maupun `openspec update` mendeteksi file legacy dan memandu Anda melalui proses pembersihan yang sama. Gunakan yang sesuai dengan situasi Anda:

- Instalasi baru default ke profil `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Instalasi yang dimigrasikan mempertahankan alur kerja yang sebelumnya diinstal dengan menulis profil `custom` saat diperlukan.

### Menggunakan `openspec init`

Jalankan ini jika Anda ingin menambahkan alat baru atau mengonfigurasi ulang alat mana pun yang disiapkan:

```bash
openspec init
```

Perintah init mendeteksi file legacy dan memandu Anda melalui pembersihan:

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

**Yang terjadi ketika Anda mengatakan ya:**

1. Direktori perintah slash legacy dihapus
2. Penanda OpenSpec dihapus dari `CLAUDE.md`, `AGENTS.md`, dll. (konten Anda tetap)
3. `openspec/AGENTS.md` dihapus
4. Skill baru diinstal di `.claude/skills/`
5. `openspec/config.yaml` dibuat dengan skema default

### Menggunakan `openspec update`

Jalankan ini jika Anda hanya ingin memigrasikan dan menyegarkan alat yang ada ke versi terbaru:

```bash
openspec update
```

Perintah update juga mendeteksi dan membersihkan artefak legacy, lalu menyegarkan skill/perintah yang dihasilkan agar sesuai dengan profil dan pengaturan pengiriman Anda saat ini.

### Lingkungan Non-Interaktif / CI

Untuk migrasi yang discript:

```bash
openspec init --force --tools claude
```

Bendera `--force` melewati prompt dan secara otomatis menerima pembersihan.

Ini termasuk pembersihan file prompt Codex yang dikelola OpenSpec di direktori prompt Codex global. Pembersihan hanya menargetkan nama file prompt Codex legacy OpenSpec yang diizinkan, menghapusnya hanya setelah skill `.codex/skills/openspec-*` pengganti ada, dan mempertahankan semua file lainnya.

---

## Memigrasikan project.md ke config.yaml

`openspec/project.md` lama adalah file markdown bebas untuk konteks proyek. `openspec/config.yaml` baru terstruktur dan—yang penting—**disuntikkan ke setiap permintaan perencanaan** sehingga konvensi Anda selalu ada ketika AI bekerja.

### Sebelumnya (project.md)

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

### Sesudahnya (config.yaml)

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
| Satu gumpalan teks | Konteks terpisah dan aturan per-artefak |
| Tidak jelas kapan digunakan | Konteks muncul di SEMUA artefak; aturan muncul hanya di artefak yang cocok |
| Tidak ada pemilihan skema | Bidang `schema:` eksplisit menetapkan alur kerja default |

### Apa yang Dipertahankan, Apa yang Dihapus

Saat memigrasikan, bersikap selektif. Tanyakan pada diri sendiri: "Apakah AI membutuhkan ini untuk *setiap* permintaan perencanaan?"

**Kandidat baik untuk `context:`**
- Tumpukan teknologi (bahasa, framework, database)
- Pola arsitektur utama (monorepo, mikroservis, dll.)
- Batasan yang tidak jelas ("kami tidak bisa menggunakan pustaka X karena...")
- Konvensi penting yang sering diabaikan

**Pindahkan ke `rules:` sebagai gantinya**
- Pemformatan spesifik artefak ("gunakan Given/When/Then dalam spesifikasi")
- Kriteria review ("proposal harus mencakup rencana rollback")
- Ini hanya muncul untuk artefak yang cocok, membuat permintaan lainnya lebih ringan

**Biarkan sama sekali**
- Praktik terbaik umum yang sudah diketahui AI
- Penjelasan verbose yang dapat dirangkum
- Konteks historis yang tidak memengaruhi pekerjaan saat ini

### Langkah Migrasi

1. **Buat config.yaml** (jika belum dibuat oleh init):
   ```yaml
   schema: spec-driven
   ```

2. **Tambahkan konteks Anda** (beri ringkas—ini masuk ke setiap permintaan):
   ```yaml
   context: |
     Latar belakang proyek Anda goes here.
     Fokus pada apa yang benar-benar perlu diketahui AI.
   ```

3. **Tambahkan aturan per-artefak** (opsional):
   ```yaml
   rules:
     proposal:
       - Panduan khusus proposal Anda
     specs:
       - Aturan penulisan spesifikasi Anda
   ```

4. **Hapus project.md** setelah Anda memindahkan semua yang berguna.

**Jangan terlalu memikirkannya.** Mulai dengan yang penting dan iterasi. Jika Anda noticing AI melewatkan sesuatu yang penting, tambahkan. Jika konteks terasa membengkak, potong. Ini adalah dokumen yang hidup.

### Butuh Bantuan? Gunakan Prompt Ini

Jika Anda tidak yakin cara meringkas project.md Anda, tanyakan pada asisten AI Anda:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI akan membantu Anda mengidentifikasi apa yang penting vs apa yang dapat dipotong.

---

## Perintah Baru

Ketersediaan perintah tergantung profil:

**Default (profil `core`):**

| Perintah | Tujuan |
|---------|--------|
| `/opsx:propose` | Buat perubahan dan hasilkan artefak perencanaan dalam satu langkah |
| `/opsx:explore` | Pikirkan ide tanpa struktur |
| `/opsx:apply` | Implementasikan tugas dari tasks.md |
| `/opsx:archive` | Finalisasi dan arsipkan perubahan |

**Alur kerja diperluas (pilihan kustom):**

| Perintah | Tujuan |
|---------|--------|
| `/opsx:new` | Mulai kerangka perubahan baru |
| `/opsx:continue` | Buat artefak berikutnya (satu per satu) |
| `/opsx:ff` | Fast-forward—buat artefak perencanaan sekaligus |
| `/opsx:verify` | Validasi implementasi sesuai spesifikasi |
| `/opsx:sync` | Gabungkan spesifikasi delta ke spesifikasi utama |
| `/opsx:bulk-archive` | Arsipkan beberapa perubahan sekaligus |
| `/opsx:onboard` | Alur kerja onboarding ujung-ke-ujung yang dipandu |

Aktifkan perintah diperluas dengan `openspec config profile`, lalu jalankan `openspec update`.

### Pemetaan Perintah dari Legacy

| Legacy | Ekuivalen OPSX |
|--------|----------------|
| `/openspec:proposal` | `/opsx:propose` (default) atau `/opsx:new` lalu `/opsx:ff` (diperluas) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Kemampuan Baru

Kemampuan ini adalah bagian dari set perintah alur kerja diperluas.

**Pembuatan artefak granular:**
```
/opsx:continue
```
Membuat satu artefak pada satu waktu berdasarkan dependensi. Gunakan ini ketika Anda ingin meninjau setiap langkah.

**Mode eksplorasi:**
```
/opsx:explore
```
Pikirkan ide dengan mitra sebelum berkomitmen pada perubahan.

---

## Memahami Arsitektur Baru

### Dari Terkunci Fase ke Cair

Alur kerja legacy memaksa progresi linier:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Jika Anda sedang mengimplementasi dan menyadari desainnya salah?
Terlalu buruk. Gerbang fase tidak memudahkan Anda untuk kembali.
```

OPSX menggunakan tindakan, bukan fase:

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

### Graf Dependensi

Artefak membentuk graf berarah. Dependensi adalah pembuka, bukan gerbang:

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

Ketika Anda menjalankan `/opsx:continue`, itu memeriksa apa yang siap dan menawarkan artefak berikutnya. Anda juga dapat membuat beberapa artefak yang siap dalam urutan apa pun.

### Skill vs Perintah

Sistem legacy menggunakan file perintah khusus alat:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX menggunakan standar **skill** yang muncul:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Skill dikenali di beberapa alat coding AI dan menyediakan metadata yang lebih kaya.

Codex hanya menggunakan skill di OPSX. OpenSpec tidak lagi menghasilkan file prompt kustom Codex; gunakan direktori `.codex/skills/openspec-*` yang dihasilkan sebagai gantinya.

## Melanjutkan Perubahan yang Ada

Perubahan yang sedang Anda kerjakan berfungsi dengan mulus bersama perintah OPSX.

**Memiliki perubahan aktif dari alur kerja legacy?**

```
/opsx:apply add-my-feature
```

OPSX membaca artefak yang ada dan melanjutkan dari tempat Anda berhenti.

**Ingin menambahkan lebih banyak artefak ke perubahan yang ada?**

```
/opsx:continue add-my-feature
```

Menampilkan apa yang siap dibuat berdasarkan apa yang sudah ada.

**Perlu melihat status?**

```bash
openspec status --change add-my-feature
```

---

## Sistem Konfigurasi Baru

### Struktur config.yaml

```yaml
# Diperlukan: Skema default untuk perubahan baru
schema: spec-driven

# Opsional: Konteks proyek (maks 50KB)
# Disisipkan ke dalam SEMUA instruksi artefak
context: |
  Latar belakang proyek Anda, tumpukan teknologi,
  konvensi, dan batasan.

# Opsional: Aturan per-artifak
# Hanya disisipkan ke artefak yang cocok
rules:
  proposal:
    - Sertakan rencana rollback
  specs:
    - Gunakan format Given/When/Then
  design:
    - Dokumentasikan strategi fallback
  tasks:
    - Pecah menjadi bagian maksimal 2 jam
```

### Resolusi Skema

Saat menentukan skema mana yang akan digunakan, OPSX memeriksa secara berurutan:

1. **Bendera CLI**: `--schema <nama>` (prioritas tertinggi)
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

Lihat [Kustomisasi](customization.md) untuk detailnya.

---

## Pemecahan Masalah

### "Legacy files detected in non-interactive mode"

Anda sedang berjalan di lingkungan CI atau non-interaktif. Gunakan:

```bash
openspec init --force
```

### Perintah tidak muncul setelah migrasi

Mulai ulang IDE Anda. Keterampilan (skills) terdeteksi saat startup.

### "Unknown artifact ID in rules"

Pastikan bahwa kunci `rules:` Anda sesuai dengan ID artefak skema Anda:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Jalankan ini untuk melihat ID artefak yang valid:

```bash
openspec schemas --json
```

### Konfigurasi tidak diterapkan

1. Pastikan file berada di `openspec/config.yaml` (bukan `.yml`)
2. Validasi sintaks YAML
3. Perubahan konfigurasi berlaku segera—tidak perlu restart

### project.md tidak dimigrasi

Sistem secara sengaja mempertahankan `project.md` karena mungkin berisi konten kustom Anda. Tinjau secara manual, pindahkan bagian yang berguna ke `config.yaml`, lalu hapus.

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
├── CLAUDE.md                     # Penanda OpenSpec dihapus, konten Anda tetap
└── AGENTS.md                     # Penanda OpenSpec dihapus, konten Anda tetap
```

### Yang Hilang

- `.claude/commands/openspec/` — digantikan oleh `.claude/skills/`
- `openspec/AGENTS.md` — usang
- `openspec/project.md` — migrasikan ke `config.yaml`, lalu hapus
- Blok penanda OpenSpec di `CLAUDE.md`, `AGENTS.md`, dll.

### Cheatsheet Perintah

```text
/opsx:propose      Mulai cepat (profil inti default)
/opsx:apply        Implementasikan tugas
/opsx:archive      Selesaikan dan arsipkan

# Alur kerja yang diperluas (jika diaktifkan):
/opsx:new          Siapkan struktur perubahan
/opsx:continue     Buat artefak berikutnya
/opsx:ff           Buat artefak perencanaan
```

---

## Memperoleh Bantuan

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokumentasi**: [docs/opsx.md](opsx.md) untuk referensi OPSX lengkap