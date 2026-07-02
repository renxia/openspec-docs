# Memulai

Panduan ini menjelaskan cara kerja OpenSpec setelah Anda menginstalnya dan menginisialisasinya. Untuk instruksi instalasi, lihat [README utama](../index.md#quick-start) atau [panduan Instalasi](installation.md). Baru mengenal seluruh kumpulan dokumentasi? [Beranda dokumentasi](index.md) memetakan segalanya.

> **Di mana saya mengetik perintah ini?** Dua tempat, dan mencampurnya adalah kesalahan awal yang paling umum.
>
> - Perintah `openspec ...` (seperti `openspec init`) dijalankan di **terminal** Anda.
> - Perintah `/opsx:...` (seperti `/opsx:propose`) dijalankan di **obrolan asisten AI** Anda, kotak yang sama tempat Anda memintanya untuk menulis kode.
>
> Tidak ada "mode interaktif" terpisah untuk memulai. Anda hanya mengetik perintah garis miring di obrolan dan asisten Anda melanjutkan dari sana. Penjelasan lengkap: [Cara Kerja Perintah](how-commands-work.md).

## Lima Menit Pertama Anda

Seluruh siklus, dengan setiap langkah diberi label berdasarkan tempat ia terjadi:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (opsional: pikirkan dulu)
AI CHAT      /opsx:propose add-dark-mode      (AI membuat draf rencana; Anda meninjaunya)
AI CHAT      /opsx:apply                      (AI membangunnya)
AI CHAT      /opsx:archive                    (spesifikasi diperbarui, perubahan diarsipkan)
```

Dua langkah terminal untuk penyiapan, kemudian Anda hidup di obrolan. Sisa panduan ini menguraikan apa yang dilakukan setiap langkah dan apa yang akan Anda lihat.

> **Belum yakin ingin membangun apa? Mulailah dengan `/opsx:explore`.** Ini adalah mitra berpikir tanpa risiko yang membaca basis kode Anda, menimbang pilihan, dan mempertajam ide yang samar menjadi rencana konkret, semua sebelum artefak atau kode apa pun ada. Ketika gambaran sudah jelas, ia menyerahkan tugas ke `/opsx:propose`. Ini adalah kebiasaan terbaik untuk bekerja dengan AI yang jika tidak, akan secara percaya diri membangun hal yang salah. Lihat [panduan Explore](explore.md).

## Cara Kerjanya

OpenSpec membantu Anda dan asisten pengkodean AI Anda menyepakati apa yang harus dibangun sebelum kode apa pun ditulis.

**Jalur cepat default (profil inti):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (opsional)
```

Mulai dengan `/opsx:explore` ketika Anda mencari tahu apa yang harus dilakukan, atau langsung melompat ke `/opsx:propose` ketika Anda sudah tahu. Explore ada di profil default, jadi selalu tersedia saat Anda menginginkannya.

**Jalur yang diperluas (pemilihan alur kerja kustom):**

```text
/opsx:new ──► /opsx:ff atau /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Profil global default adalah `core`, yang mencakup `propose`, `explore`, `apply`, `sync`, dan `archive`. Anda dapat mengaktifkan perintah alur kerja yang diperluas dengan `openspec config profile` dan kemudian `openspec update`.

## Apa yang Diciptakan OpenSpec

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
│       └── specs/      # Delta specs (apa yang berubah)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Konfigurasi proyek (opsional)
```

**Dua direktori utama:**

- **`specs/`** - Sumber kebenaran. Spesifikasi ini menjelaskan bagaimana sistem Anda berperilaku saat ini. Diatur berdasarkan domain (misalnya, `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modifikasi yang diusulkan. Setiap perubahan mendapatkan foldernya sendiri dengan semua artefak terkait. Ketika sebuah perubahan selesai, spesifikasinya digabungkan ke direktori utama `specs/`.

## Memahami Artefak

Setiap folder perubahan berisi artefak yang memandu pekerjaan:

| Artefak | Tujuan |
|----------|---------|
| `proposal.md` | "mengapa" dan "apa" - menangkap niat, ruang lingkup, dan pendekatan |
| `specs/` | Delta specs yang menunjukkan persyaratan yang DITAMBAHKAN/DIMODIFIKASI/DIHAPUS |
| `design.md` | "bagaimana" - pendekatan teknis dan keputusan arsitektur |
| `tasks.md` | daftar periksa implementasi dengan kotak centang |

**Artefak dibangun satu sama lain:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            diperbarui seiring Anda belajar
```

Anda selalu dapat kembali dan menyempurnakan artefak sebelumnya saat Anda mempelajari lebih lanjut selama implementasi.

## Cara Kerja Delta Specs

Delta specs adalah konsep kunci dalam OpenSpec. Mereka menunjukkan apa yang berubah relatif terhadap spesifikasi Anda saat ini.

### Formatnya

Delta specs menggunakan bagian untuk menunjukkan jenis perubahan:

```markdown
# Delta untuk Auth

## Persyaratan DITAMBAHKAN

### Persyaratan: Otentikasi Dua Faktor
Sistem HARUS memerlukan faktor kedua selama login.

#### Skenario: OTP diperlukan
- GIVEN pengguna dengan 2FA diaktifkan
- WHEN pengguna mengirim kredensial yang valid
- THEN tantangan OTP disajikan

## Persyaratan DIMODIFIKASI

### Persyaratan: Batas Waktu Sesi
Sistem HARUS mengakhiri sesi setelah 30 menit tidak aktif.
(Sebelumnya: 60 menit)

#### Skenario: Timeout diam
- GIVEN sesi yang diautentikasi
- WHEN 30 menit berlalu tanpa aktivitas
- THEN sesi dinonaktifkan

## Persyaratan DIHAPUS

### Persyaratan: Ingat Saya
(Usang demi 2FA)
```

### Apa yang Terjadi saat Arsip?

Ketika Anda mengarsipkan sebuah perubahan:

1. Persyaratan **DITAMBAHKAN** ditambahkan ke spesifikasi utama
2. Persyaratan **DIMODIFIKASI** mengganti versi yang ada
3. Persyaratan **DIHAPUS** dihapus dari spesifikasi utama

Folder perubahan dipindahkan ke `openspec/changes/archive/` untuk riwayat audit.

## Contoh: Perubahan Pertama Anda

Mari kita bahas penambahan mode gelap pada sebuah aplikasi.

### 1. Memulai Perubahan (Default)

```text
Anda: /opsx:propose add-dark-mode

AI:  Membuat openspec/changes/add-dark-mode/
     ✓ proposal.md — mengapa kita melakukan ini, apa yang berubah
     ✓ specs/       — persyaratan dan skenario
     ✓ design.md    — pendekatan teknis
     ✓ tasks.md     — daftar periksa implementasi
     Siap untuk diimplementasikan!
```

Jika Anda telah mengaktifkan profil alur kerja yang diperluas, Anda juga dapat melakukan ini sebagai dua langkah: `/opsx:new` lalu `/opsx:ff` (atau `/opsx:continue` secara bertahap).

### 2. Apa yang Dibuat

**proposal.md** - Menangkap niat:

```markdown
# Proposal: Tambahkan Mode Gelap

## Niat
Pengguna telah meminta opsi mode gelap untuk mengurangi ketegangan mata
selama penggunaan malam hari.

## Ruang Lingkup
- Tambahkan sakelar tema di pengaturan
- Dukungan deteksi preferensi sistem
- Simpan preferensi di localStorage

## Pendekatan
Gunakan properti kustom CSS untuk penentuan tema dengan konteks React
untuk manajemen status.
```

**specs/ui/spec.md** - Delta yang menunjukkan persyaratan baru:

```markdown
# Delta untuk UI

## Persyaratan DITAMBAHKAN

### Persyaratan: Pemilihan Tema
Sistem HARUS mengizinkan pengguna memilih antara tema terang dan gelap.

#### Skenario: Sakelar manual
- GIVEN pengguna di halaman apa pun
- WHEN pengguna mengklik sakelar tema
- THEN temanya langsung beralih
- DAN preferensi bertahan di seluruh sesi

#### Skenario: Preferensi sistem
- GIVEN pengguna tanpa preferensi yang disimpan
- WHEN aplikasi dimuat
- THEN skema warna pilihan sistem digunakan
```

**tasks.md** - Daftar periksa implementasi:

```markdown
# Tugas

## 1. Infrastruktur Tema
- [ ] 1.1 Buat ThemeContext dengan status terang/gelap
- [ ] 1.2 Tambahkan properti kustom CSS untuk warna
- [ ] 1.3 Implementasikan persistensi localStorage

## 2. Komponen UI
- [ ] 2.1 Buat komponen ThemeToggle
- [ ] 2.2 Tambahkan sakelar ke halaman pengaturan
- [ ] 2.3 Perbarui Header untuk menyertakan sakelar cepat

## 3. Penataan Gaya
- [ ] 3.1 Tentukan palet warna tema gelap
- [ ] 3.2 Perbarui komponen untuk menggunakan variabel CSS
```

### 3. Implementasi

```
Anda: /opsx:apply

AI:  Mengerjakan tugas...
     ✓ 1.1 Dibuat ThemeContext dengan status terang/gelap
     ✓ 1.2 Ditambahkan properti kustom CSS ke globals.css
     ✓ 1.3 Diimplementasikan persistensi localStorage
     ✓ 2.1 Dibuat komponen ThemeToggle
     ...
     Semua tugas selesai!
```

Selama implementasi, jika Anda menemukan desain memerlukan penyesuaian, cukup perbarui artefak dan lanjutkan.

### 4. Arsip

```
Anda: /opsx:archive

AI:  Mengarsipkan add-dark-mode...
     ✓ Menggabungkan spesifikasi ke openspec/specs/ui/spec.md
     ✓ Dipindahkan ke openspec/changes/archive/2025-01-24-add-dark-mode/
     Selesai! Siap untuk fitur berikutnya.
```

Delta specs Anda sekarang menjadi bagian dari spesifikasi utama, mendokumentasikan cara kerja sistem Anda.

## Verifikasi dan Tinjauan

Gunakan CLI untuk memeriksa perubahan Anda:

```bash
# Daftar perubahan aktif
openspec list

# Lihat detail perubahan
openspec show add-dark-mode

# Validasi pemformatan spec
openspec validate add-dark-mode

# Dasbor interaktif
openspec view
```

## Langkah Selanjutnya

- [Explore First](explore.md) - Gunakan `/opsx:explore` untuk memikirkan ide sebelum Anda berkomitmen
- [Menggunakan OpenSpec dalam Proyek yang Sudah Ada](existing-projects.md) - Mulai pada basis kode brownfield yang besar
- [Mengedit & Mengiterasi Perubahan](editing-changes.md) - Perbarui artefak, kembali, rekonsiliasi pengeditan manual
- [Konsep Inti Sekilas](overview.md) - Seluruh model mental dalam satu halaman
- [Contoh & Resep](examples.md) - Perubahan nyata, dari awal hingga akhir
- [Alur Kerja](workflows.md) - Pola umum dan kapan harus menggunakan setiap perintah
- [Perintah](commands.md) - Referensi lengkap untuk semua perintah garis miring
- [Konsep](concepts.md) - Pemahaman yang lebih dalam tentang spesifikasi, perubahan, dan skema
- [Kustomisasi](customization.md) - Buat OpenSpec bekerja sesuai cara Anda
- [Penyimpanan](stores-beta/user-guide.md) - Perencanaan yang mencakup repositori atau tim? Simpan di repo sendiri (beta)
- [FAQ](faq.md) dan [Pemecahan Masalah](troubleshooting.md) - Saat Anda buntu