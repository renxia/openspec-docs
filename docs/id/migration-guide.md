# Migrasi ke OPSX

Panduan ini membantu Anda beralih dari alur kerja OpenSpec lama ke OPSX. Proses migrasi dirancang agar lancar—pekerjaan Anda yang sudah ada tetap terjaga, dan sistem baru menawarkan lebih banyak fleksibilitas.

## Apa yang Berubah?

OPSX menggantikan alur kerja berfase lama dengan pendekatan yang fleksibel dan berbasis aksi. Berikut adalah perubahan utamanya:

| Aspek | Lama | OPSX |
|--------|--------|------|
| **Perintah** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Default: `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (perintah alur kerja yang diperluas bersifat opsional) |
| **Alur Kerja** | Membuat semua artefak sekaligus | Membuat secara bertahap atau sekaligus—pilihan Anda |
| **Kembali ke Langkah Sebelumnya** | Gerbang fase yang kaku | Alami—perbarui artefak apa pun kapan saja |
| **Kustomisasi** | Struktur yang tetap | Didorong oleh skema, sepenuhnya dapat dimodifikasi |
| **Konfigurasi** | `CLAUDE.md` dengan penanda + `project.md` | Konfigurasi bersih di `openspec/config.yaml` |

**Perubahan filosofi:** Pekerjaan tidak linear. OPSX berhenti berpura-pura demikian.

---

## Sebelum Anda Memulai

### Pekerjaan Anda Yang Sudah Ada Aman

Proses migrasi dirancang dengan mempertahankan pekerjaan Anda:

- **Perubahan aktif di `openspec/changes/`** — Dipertahankan sepenuhnya. Anda dapat melanjutkannya dengan perintah OPSX.
- **Perubahan yang diarsipkan** — Tidak tersentuh. Riwayat Anda tetap utuh.
- **Spesifikasi utama di `openspec/specs/`** — Tidak tersentuh. Ini adalah sumber kebenaran Anda.
- **Konten Anda di CLAUDE.md, AGENTS.md, dll.** — Dipertahankan. Hanya blok penanda OpenSpec yang dihapus; semua yang Anda tulis tetap ada.

### Apa Yang Dihapus

Hanya file yang dikelola OpenSpec yang sedang digantikan:

| Apa | Mengapa |
|------|---------|
| Direktori/file perintah slash lama | Digantikan oleh sistem keterampilan baru |
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

Migrasi akan mendeteksi alat mana yang telah Anda konfigurasi dan membersihkan file lama mereka.

Daftar penghapusan mungkin terlihat panjang, tetapi ini semua adalah file yang awalnya dibuat oleh OpenSpec. Konten Anda sendiri tidak akan pernah dihapus.

### Apa Yang Perlu Perhatian Anda

Satu file membutuhkan migrasi manual:

**`openspec/project.md`** — File ini tidak dihapus secara otomatis karena mungkin berisi konteks proyek yang telah Anda tulis. Anda perlu:

1. Meninjau isinya
2. Memindahkan konteks yang berguna ke `openspec/config.yaml` (lihat panduan di bawah)
3. Menghapus file tersebut saat sudah siap

**Mengapa kami melakukan perubahan ini:**

`project.md` yang lama bersifat pasif—agen mungkin membacanya, mungkin tidak, mungkin lupa apa yang mereka baca. Kami menemukan keandalannya tidak konsisten.

Konteks `config.yaml` yang baru **disuntikkan secara aktif ke dalam setiap permintaan perencanaan OpenSpec**. Ini berarti konvensi proyek, tumpukan teknologi, dan aturan Anda selalu hadir saat AI membuat artefak. Keandalan lebih tinggi.

**Komprominya:**

Karena konteks disuntikkan ke dalam setiap permintaan, Anda harus bersikap ringkas. Fokus pada hal yang benar-benar penting:
- Tumpukan teknologi dan konvensi utama
- Kendala yang tidak jelas yang perlu diketahui AI
- Aturan yang sering diabaikan sebelumnya

Jangan khawatir untuk mendapatkannya dengan sempurna. Kami masih mempelajari apa yang terbaik di sini, dan kami akan meningkatkan cara kerja injeksi konteks saat kami bereksperimen.

---

## Menjalankan Migrasi

Baik `openspec init` maupun `openspec update` mendeteksi file lama dan memandu Anda melalui proses pembersihan yang sama. Gunakan mana yang sesuai dengan situasi Anda:

- Instalasi baru secara default menggunakan profil `core` (`propose`, `explore`, `apply`, `archive`).
- Instalasi yang dimigrasi mempertahankan alur kerja yang sebelumnya diinstal dengan menulis profil `custom` saat diperlukan.

### Menggunakan `openspec init`

Jalankan ini jika Anda ingin menambahkan alat baru atau mengonfigurasi ulang alat yang diatur:

```bash
openspec init
```

Perintah init mendeteksi file lama dan memandu Anda melalui pembersihan:

```
Meningkatkan ke OpenSpec baru

OpenSpec sekarang menggunakan keterampilan agen, standar yang muncul di seluruh
agen pemrograman. Ini menyederhanakan pengaturan Anda sambil tetap membuat semuanya berfungsi
seperti sebelumnya.

File untuk dihapus
Tidak ada konten pengguna untuk dipertahankan:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

File untuk diperbarui
Penanda OpenSpec akan dihapus, konten Anda dipertahankan:
  • CLAUDE.md
  • AGENTS.md

Perlu perhatian Anda
  • openspec/project.md
    Kami tidak akan menghapus file ini. Mungkin berisi konteks proyek yang berguna.

    openspec/config.yaml yang baru memiliki bagian "context:" untuk konteks
    perencanaan. Ini disertakan dalam setiap permintaan OpenSpec dan bekerja lebih
    dapat diandalkan daripada pendekatan project.md lama.

    Tinjau project.md, pindahkan konten yang berguna ke bagian context
    config.yaml, lalu hapus file tersebut saat sudah siap.

? Tingkatkan dan bersihkan file lama? (Y/n)
```

**Apa yang terjadi saat Anda menjawab ya:**

1. Direktori perintah slash lama dihapus
2. Penanda OpenSpec dilepaskan dari `CLAUDE.md`, `AGENTS.md`, dll. (konten Anda tetap ada)
3. `openspec/AGENTS.md` dihapus
4. Keterampilan baru diinstal di `.claude/skills/`
5. `openspec/config.yaml` dibuat dengan skema default

### Menggunakan `openspec update`

Jalankan ini jika Anda hanya ingin memigrasi dan memperbarui alat yang ada ke versi terbaru:

```bash
openspec update
```

Perintah update juga mendeteksi dan membersihkan artefak lama, lalu memperbarui keterampilan/perintah yang dihasilkan agar sesuai dengan profil dan pengaturan pengiriman Anda saat ini.

### Lingkungan Non-Interaktif / CI

Untuk migrasi skrip:

```bash
openspec init --force --tools claude
```

Bendera `--force` melewati prompt dan menerima pembersihan secara otomatis.

---

## Memigrasi project.md ke config.yaml

`openspec/project.md` yang lama adalah file markdown bebas untuk konteks proyek. `openspec/config.yaml` yang baru terstruktur dan—yang kritis—**disuntikkan ke dalam setiap permintaan perencanaan** sehingga konvensi Anda selalu hadir saat AI bekerja.

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
| Satu blok teks | Konteks dan aturan per artefak terpisah |
| Tidak jelas kapan digunakan | Konteks muncul di SEMUA artefak; aturan muncul hanya di artefak yang cocok |
| Tidak ada pemilihan skema | Bidang `schema:` eksplisit menetapkan alur kerja default |

### Apa Yang Disimpan, Apa Yang Dihapus

Saat memigrasi, bersikaplah selektif. Tanyakan pada diri sendiri: "Apakah AI membutuhkan ini untuk *setiap* permintaan perencanaan?"

**Kandidat yang baik untuk `context:`**
- Tumpukan teknologi (bahasa, framework, basis data)
- Pola arsitektur utama (monorepo, mikroservis, dll.)
- Kendala yang tidak jelas ("kami tidak bisa menggunakan library X karena...")
- Konvensi kritis yang sering diabaikan

**Pindahkan ke `rules:` sebagai gantinya**
- Pemformatan spesifik artefak ("gunakan Given/When/Then dalam spesifikasi")
- Kriteria peninjauan ("proposal harus menyertakan rencana rollback")
- Ini hanya muncul untuk artefak yang cocok, menjaga permintaan lain tetap ringan

**Tinggalkan sepenuhnya**
- Praktik terbaik umum yang sudah diketahui AI
- Penjelasan bertele-tele yang bisa diringkas
- Konteks historis yang tidak mempengaruhi pekerjaan saat ini

### Langkah Migrasi

1. **Buat config.yaml** (jika belum dibuat oleh init):
   ```yaml
   schema: spec-driven
   ```

2. **Tambahkan konteks Anda** (bersikaplah ringkas—ini masuk ke setiap permintaan):
   ```yaml
   context: |
     Latar belakang proyek Anda di sini.
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

**Jangan terlalu memikirkannya.** Mulai dari yang esensial dan iterasi. Jika Anda memperhatikan AI melewatkan sesuatu yang penting, tambahkan. Jika konteks terasa berlebihan, potong. Ini adalah dokumen yang hidup.

### Butuh Bantuan? Gunakan Prompt Ini

Jika Anda tidak yakin bagaimana mengekstrak project.md Anda, tanyakan kepada asisten AI Anda:

```
Saya sedang memigrasi dari project.md lama OpenSpec ke format config.yaml baru.

Berikut adalah project.md saya saat ini:
[tempel konten project.md Anda]

Tolong bantu saya membuat config.yaml dengan:
1. Bagian `context:` yang ringkas (ini disuntikkan ke setiap permintaan perencanaan, jadi buatlah padat—fokus pada tumpukan teknologi, kendala utama, dan konvensi yang sering diabaikan)
2. `rules:` untuk artefak spesifik jika ada konten yang spesifik artefak (misalnya "gunakan Given/When/Then" termasuk dalam aturan spesifikasi, bukan konteks global)

Hilangkan apa pun yang umum yang sudah diketahui model AI. Bersikaplah tegas tentang kesingkatan.
```

AI akan membantu Anda mengidentifikasi apa yang esensial vs. apa yang bisa dipangkas.

---

## Perintah Baru

Ketersediaan perintah bergantung pada profil:

**Default (profil `core`):**

| Perintah | Tujuan |
|---------|---------|
| `/opsx:propose` | Membuat perubahan dan menghasilkan artefak perencanaan dalam satu langkah |
| `/opsx:explore` | Memikirkan ide tanpa struktur |
| `/opsx:apply` | Menerapkan tugas dari tasks.md |
| `/opsx:archive` | Menyelesaikan dan mengarsipkan perubahan |

**Alur kerja yang diperluas (pilihan kustom):**

| Perintah | Tujuan |
|---------|---------|
| `/opsx:new` | Memulai kerangka perubahan baru |
| `/opsx:continue` | Membuat artefak berikutnya (satu per satu) |
| `/opsx:ff` | Maju cepat—membuat artefak perencanaan sekaligus |
| `/opsx:verify` | Memvalidasi implementasi sesuai spesifikasi |
| `/opsx:sync` | Pratinjau/gabung spesifikasi tanpa mengarsipkan |
| `/opsx:bulk-archive` | Mengarsipkan beberapa perubahan sekaligus |
| `/opsx:onboard` | Alur kerja orientasi terpadu dari awal hingga akhir |

Aktifkan perintah yang diperluas dengan `openspec config profile`, lalu jalankan `openspec update`.

### Pemetaan Perintah dari Versi Lama

| Lama | OPSX Setara |
|--------|-----------------|
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

### Dari Fase-Kunci ke Alur

Alur kerja lama memaksa perkembangan linier:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PERENCANAAN│ ───► │ PELAKSANAAN  │ ───► │  PENGARSIPAN │
│    FASE      │      │    FASE      │      │    FASE      │
└──────────────┘      └──────────────┘      └──────────────┘

Jika Anda sedang dalam pelaksanaan dan menyadari desainnya salah?
Sayang sekali. Gerbang fase tidak membiarkan Anda kembali dengan mudah.
```

OPSX menggunakan tindakan, bukan fase:

```
         ┌───────────────────────────────────────────────┐
         │           TINDAKAN (bukan fase)               │
         │                                               │
         │     baru ◄──► lanjutkan ◄──► terapkan ◄──► arsipkan │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    urutan bebas               │
         └───────────────────────────────────────────────┘
```

### Grafik Ketergantungan

Artefak membentuk grafik berarah. Ketergantungan adalah pendorong, bukan gerbang:

```
                        proposal
                       (simpul akar)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           spesifikasi                 desain
        (membutuhkan:                (membutuhkan:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tugas
                     (membutuhkan:
                     spesifikasi, desain)
```

Ketika Anda menjalankan `/opsx:continue`, ia memeriksa apa yang sudah siap dan menawarkan artefak berikutnya. Anda juga dapat membuat beberapa artefak yang siap dalam urutan bebas.

### Keterampilan vs Perintah

Sistem lama menggunakan berkas perintah khusus alat:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX menggunakan standar **keterampilan** yang baru muncul:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Keterampilan dikenali di berbagai alat pengodean AI dan menyediakan metadata yang lebih kaya.

---

## Melanjutkan Perubahan yang Sudah Ada

Perubahan Anda yang sedang berjalan bekerja secara mulus dengan perintah OPSX.

**Memiliki perubahan aktif dari alur kerja lama?**

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
# Wajib: Skema default untuk perubahan baru
schema: spec-driven

# Opsional: Konteks proyek (maks 50KB)
# Disuntikkan ke SEMUA instruksi artefak
context: |
  Latar belakang proyek Anda, tumpukan teknologi,
  konvensi, dan batasan.

# Opsional: Aturan per artefak
# Hanya disuntikkan ke artefak yang cocok
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

Saat menentukan skema mana yang akan digunakan, OPSX memeriksa secara berurutan:

1. **Bendera CLI**: `--schema <nama>` (prioritas tertinggi)
2. **Metadata perubahan**: `.openspec.yaml` di direktori perubahan
3. **Konfigurasi proyek**: `openspec/config.yaml`
4. **Default**: `spec-driven`

### Skema yang Tersedia

| Skema | Artefak | Cocok Untuk |
|--------|-----------|----------|
| `spec-driven` | proposal → spesifikasi → desain → tugas | Sebagian besar proyek |

Tampilkan semua skema yang tersedia:

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

### "File lama terdeteksi dalam mode non-interaktif"

Anda menjalankan di lingkungan CI atau non-interaktif. Gunakan:

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
2. Validasi sintaksis YAML
3. Perubahan konfigurasi berlaku segera—tidak perlu restart

### project.md tidak dimigrasi

Sistem secara sengaja mempertahankan `project.md` karena mungkin berisi konten kustom Anda. Tinjau secara manual, pindahkan bagian yang berguna ke `config.yaml`, lalu hapus.

### Ingin melihat apa yang akan dibersihkan?

Jalankan init dan tolak prompt pembersihan—Anda akan melihat ringkasan deteksi lengkap tanpa ada perubahan yang dilakukan.

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
│       └── ...                   # profil yang diperluas menambahkan new/continue/ff/dll.
├── CLAUDE.md                     # Penanda OpenSpec dihapus, konten Anda dipertahankan
└── AGENTS.md                     # Penanda OpenSpec dihapus, konten Anda dipertahankan
```

### Yang Hilang

- `.claude/commands/openspec/` — digantikan oleh `.claude/skills/`
- `openspec/AGENTS.md` — usang
- `openspec/project.md` — migrasikan ke `config.yaml`, lalu hapus
- Blok penanda OpenSpec di `CLAUDE.md`, `AGENTS.md`, dll.

### Lembar Perintah

```text
/opsx:propose      Mulai dengan cepat (profil inti default)
/opsx:apply        Implementasikan tugas
/opsx:archive      Selesaikan dan arsipkan

# Alur kerja yang diperluas (jika diaktifkan):
/opsx:new          Scaffolding perubahan
/opsx:continue     Buat artefak berikutnya
/opsx:ff           Buat artefak perencanaan
```

---

## Mendapatkan Bantuan

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokumentasi**: [docs/opsx.md](opsx.md) untuk referensi OPSX lengkap