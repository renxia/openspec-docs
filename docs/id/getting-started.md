# Memulai

Panduan ini menjelaskan cara kerja OpenSpec setelah Anda menginstal dan menginisialisasinya. Untuk instruksi instalasi, lihat [README utama](../index.md#quick-start) atau [Panduan Instalasi](installation.md). Baru mengenal seluruh set dokumen? [Beranda dokumentasi](index.md) memetakan semuanya.

> **Di mana saya harus mengetik perintah-perintah ini?** Ada dua tempat, dan mencampurkannya adalah kesalahan paling umum di awal.
>
> - Perintah `openspec ...` (seperti `openspec init`) berjalan di **terminal** Anda.
> - Perintah `/opsx:...` (seperti `/opsx:propose`) berjalan di **obrolan asisten AI** Anda, kotak yang sama tempat Anda memintanya untuk menulis kode.
>
> Tidak ada "mode interaktif" terpisah untuk dimulai. Anda cukup mengetik perintah slash di obrolan dan asisten Anda akan menanganinya dari sana. Penjelasan lengkap: [Cara Kerja Perintah](how-commands-work.md).

## Lima Menit Pertama Anda

Seluruh loop, dengan setiap langkah dilabeli oleh tempatnya terjadi:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (opsional: pikirkan terlebih dahulu)
AI CHAT      /opsx:propose add-dark-mode      (AI membuat draf rencana; Anda meninjunya)
AI CHAT      /opsx:apply                      (AI membangunnya)
AI CHAT      /opsx:archive                    (spesifikasi diperbarui, perubahan disimpan)
```

Dua langkah terminal untuk menyiapkan, kemudian Anda tinggal di obrolan. Sisa panduan ini akan menguraikan apa yang dilakukan setiap langkah dan apa yang akan Anda lihat.

> **Tidak yakin harus membangun apa? Mulailah dengan `/opsx:explore`.** Ini adalah mitra berpikir tanpa risiko yang membaca basis kode Anda, menimbang opsi, dan mengasah ide yang samar menjadi rencana yang konkret, semua sebelum ada artefak atau kode yang dibuat. Ketika gambaran sudah jelas, ia menyerahkan ke `/opsx:propose`. Ini adalah kebiasaan terbaik untuk bekerja dengan AI yang otherwise akan dengan percaya diri membangun hal yang salah. Lihat [Panduan Explore](explore.md).

## Bagaimana Cara Kerjanya

OpenSpec membantu Anda dan asisten pengkodean AI Anda sepakat tentang apa yang harus dibangun sebelum ada kode yang ditulis.

**Jalur cepat default (profil inti):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (opsional)
```

Mulailah dengan `/opsx:explore` ketika Anda sedang mencari tahu apa yang harus dilakukan, atau lompat langsung ke `/opsx:propose` ketika Anda sudah tahu. Explore ada di profil default, jadi selalu ada ketika Anda membutuhkannya.

**Jalur yang diperluas (pemilihan alur kerja kustom):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Profil global default adalah `core`, yang mencakup `propose`, `explore`, `apply`, `sync`, dan `archive`. Anda dapat mengaktifkan perintah alur kerja yang diperluas dengan `openspec config profile` dan kemudian `openspec update`.

## Apa yang Dibuat OpenSpec

Setelah menjalankan `openspec init`, proyek Anda memiliki struktur ini:

```
openspec/
├── specs/              # Sumber kebenaran (perilaku sistem Anda)
│   └── <domain>/
│       └── spec.md
├── changes/            # Pembaruan yang diusulkan (satu folder per perubahan)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Spesifikasi delta (yang berubah)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Konfigurasi proyek (opsional)
```

**Dua direktori utama:**

- **`specs/`** - Sumber kebenaran. Spesifikasi ini mendeskripsikan bagaimana sistem Anda saat ini berperilaku. Dikelompokkan berdasarkan domain (misalnya, `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modifikasi yang diusulkan. Setiap perubahan mendapatkan folder sendiri dengan semua artefak terkait. Ketika perubahan selesai, spesifikasinya digabungkan ke direktori `specs/` utama.

## Memahami Artefak

Setiap folder perubahan berisi artefak yang memandu pekerjaan:

| Artefak | Tujuan |
|----------|---------|
| `proposal.md` | "Mengapa" dan "Apa" - menangkap niat, ruang lingkup, dan pendekatan |
| `specs/` | Spesifikasi delta yang menunjukkan persyaratan DITAMBAHKAN/DIUBAH/DIHAPUS |
| `design.md` | "Bagaimana" - pendekatan teknis dan keputusan arsitektur |
| `tasks.md` | Daftar periksa implementasi dengan kotak centang |

**Artefak saling membangun:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            perbarui saat Anda belajar
```

Anda selalu dapat kembali dan menyempurnakan artefak sebelumnya saat Anda mempelajari lebih banyak selama implementasi.

## Bagaimana Cara Kerja Spesifikasi Delta

Spesifikasi delta adalah konsep kunci di OpenSpec. Mereka menunjukkan apa yang berubah relatif terhadap spesifikasi Anda saat ini.

### Format

Spesifikasi delta menggunakan bagian untuk menunjukkan jenis perubahan:

```markdown
# Delta untuk Auth

## Persyaratan DITAMBAHKAN

### Persyaratan: Two-Factor Authentication
Sistem HARUS memerlukan faktor kedua selama login.

#### Skenario: OTP diperlukan
- DENGAN pengguna dengan 2FA diaktifkan
- KETIKA pengguna mengirimkan kredensial yang valid
- MAKA tantangan OTP disajikan

## Persyaratan DIUBAH

### Persyaratan: Session Timeout
Sistem AKAN mengakhiri sesi setelah 30 menit tidak aktif.
(Sebelumnya: 60 menit)

#### Skenario: Timeout tidak aktif
- DENGAN sesi yang terautentikasi
- KETIKA 30 menit berlalu tanpa aktivitas
- MAKA sesi dibatalkan

## Persyaratan DIHAPUS

### Persyaratan: Remember Me
(Digantikan oleh 2FA)
```

### Yang Terjadi saat Arsip

Ketika Anda mengarsipkan perubahan:

1. Persyaratan **DITAMBAHKAN** ditambahkan ke spesifikasi utama
2. Persyaratan **DIUBAH** menggantikan versi yang ada
3. Persyaratan **DIHAPUS** dihapus dari spesifikasi utama

Folder perubahan dipindahkan ke `openspec/changes/archive/` untuk riwayat audit.

## Contoh: Perubahan Pertama Anda

Mari kita jalankan menambahkan mode gelap ke aplikasi.

### 1. Mulai Perubahan (Default)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Jika Anda telah mengaktifkan profil alur kerja yang diperluas, Anda juga dapat melakukan ini dalam dua langkah: `/opsx:new` kemudian `/opsx:ff` (atau `/opsx:continue` secara bertahap).

### 2. Apa yang Dibuat

**proposal.md** - Menangkap niat:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - Delta yang menunjukkan persyaratan baru:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - Daftar periksa implementasi:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. Implementasi

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

Selama implementasi, jika Anda menemukan bahwa desain perlu disesuaikan, cukup perbarui artefak dan lanjutkan.

### 4. Arsip

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Spesifikasi delta Anda sekarang menjadi bagian dari spesifikasi utama, mendokumentasikan bagaimana sistem Anda bekerja.

## Memverifikasi dan Meninjau

Gunakan CLI untuk memeriksa perubahan Anda:

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## Langkah Berikutnya

- [Jelajah Terlebih Dahulu](explore.md) - Gunakan `/opsx:explore` untuk berpikir melalui ide sebelum Anda berkomitmen
- [Meninjau Perubahan](reviewing-changes.md) - Apa yang harus diperiksa dalam rencana yang dibuat AI, sebelum ada kode
- [Menulis Spesifikasi yang Baik](writing-specs.md) - Bagaimana persyaratan dan skenario yang kuat terlihat
- [Menggunakan OpenSpec di Proyek yang Sudah Ada](existing-projects.md) - Mulai di basis kode brownfield yang besar
- [Mengedit & Mengulangi Perubahan](editing-changes.md) - Perbarui artefak, kembali, rekonsiliasi edit manual
- [Konsep Inti sekilas](overview.md) - Seluruh model mental di satu halaman
- [Contoh & Resep](examples.md) - Perubahan nyata, dari awal sampai akhir
- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakan setiap perintah
- [Perintah](commands.md) - Referensi lengkap untuk semua perintah slash
- [Konsep](concepts.md) - Pemahaman yang lebih dalam tentang spesifikasi, perubahan, dan skema
- [Kustomisasi](customization.md) - Buat OpenSpec bekerja sesuai keinginan Anda
- [Toko](stores-beta/user-guide.md) - Perencanaan yang mencakup repo atau tim? Simpan di repo sendiri sendiri (beta)
- [FAQ](faq.md) dan [Pemecahan Masalah](troubleshooting.md) - Ketika Anda mengalami kesulitan