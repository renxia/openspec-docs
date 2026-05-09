# Memulai

Panduan ini menjelaskan cara kerja OpenSpec setelah Anda menginstal dan menginisialisasinya. Untuk petunjuk instalasi, lihat [README utama](index.md#quick-start).

## Cara Kerjanya

OpenSpec membantu Anda dan asisten pengkodean AI Anda menyepakati apa yang akan dibangun sebelum kode apa pun ditulis.

**Jalur cepat default (profil inti):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Jalur diperluas (pemilihan alur kerja kustom):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Profil global default adalah `core`, yang mencakup `propose`, `explore`, `apply`, `sync`, dan `archive`. Anda dapat mengaktifkan perintah alur kerja yang diperluas dengan `openspec config profile` lalu `openspec update`.

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
│       └── specs/      # Spesifikasi delta (apa yang berubah)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Konfigurasi proyek (opsional)
```

**Dua direktori utama:**

- **`specs/`** - Sumber kebenaran. Spesifikasi ini menggambarkan perilaku sistem Anda saat ini. Diorganisir berdasarkan domain (misalnya, `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modifikasi yang diusulkan. Setiap perubahan mendapatkan folder sendiri dengan semua artefak terkait. Ketika sebuah perubahan selesai, spesifikasinya digabungkan ke direktori `specs/` utama.

## Memahami Artefak

Setiap folder perubahan berisi artefak yang memandu pekerjaan:

| Artefak | Tujuan |
|----------|---------|
| `proposal.md` | "Mengapa" dan "apa" - menangkap niat, ruang lingkup, dan pendekatan |
| `specs/` | Spesifikasi delta yang menunjukkan persyaratan DITAMBAHKAN/DIUBAH/DIHAPUS |
| `design.md` | "Bagaimana" - pendekatan teknis dan keputusan arsitektur |
| `tasks.md` | Daftar periksa implementasi dengan kotak centang |

**Artefak saling membangun:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            perbarui seiring pembelajaran
```

Anda selalu dapat kembali dan menyempurnakan artefak sebelumnya seiring Anda belajar lebih banyak selama implementasi.

## Cara Kerja Spesifikasi Delta

Spesifikasi delta adalah konsep kunci dalam OpenSpec. Spesifikasi ini menunjukkan apa yang berubah relatif terhadap spesifikasi Anda saat ini.

### Formatnya

Spesifikasi delta menggunakan bagian untuk menunjukkan jenis perubahan:

```markdown
# Delta untuk Auth

## Persyaratan DITAMBAHKAN

### Persyaratan: Autentikasi Dua Faktor
Sistem WAJIB memerlukan faktor kedua selama login.

#### Skenario: OTP diperlukan
- DENGAN pengguna yang memiliki 2FA diaktifkan
- KETIKA pengguna mengirimkan kredensial yang valid
- MAKA tantangan OTP disajikan

## Persyaratan DIUBAH

### Persyaratan: Batas Waktu Sesi
Sistem HARUS mengakhiri sesi setelah 30 menit tidak aktif.
(Sebelumnya: 60 menit)

#### Skenario: Batas waktu menganggur
- DENGAN sesi yang diautentikasi
- KETIKA 30 menit berlalu tanpa aktivitas
- MAKA sesi dibatalkan

## Persyaratan DIHAPUS

### Persyaratan: Ingat Saya
(Dihapus demi 2FA)
```

### Apa yang Terjadi pada Pengarsipan

Ketika Anda mengarsipkan sebuah perubahan:

1. Persyaratan **DITAMBAHKAN** ditambahkan ke spesifikasi utama
2. Persyaratan **DIUBAH** menggantikan versi yang ada
3. Persyaratan **DIHAPUS** dihapus dari spesifikasi utama

Folder perubahan dipindahkan ke `openspec/changes/archive/` untuk riwayat audit.

## Contoh: Perubahan Pertama Anda

Mari kita telusuri penambahan mode gelap ke sebuah aplikasi.

### 1. Memulai Perubahan (Default)

```text
Anda: /opsx:propose add-dark-mode

AI:  Membuat openspec/changes/add-dark-mode/
     ✓ proposal.md — mengapa kita melakukan ini, apa yang berubah
     ✓ specs/       — persyaratan dan skenario
     ✓ design.md    — pendekatan teknis
     ✓ tasks.md     — daftar periksa implementasi
     Siap untuk implementasi!
```

Jika Anda telah mengaktifkan profil alur kerja yang diperluas, Anda juga dapat melakukan ini dalam dua langkah: `/opsx:new` lalu `/opsx:ff` (atau `/opsx:continue` secara bertahap).

### 2. Apa yang Dibuat

**proposal.md** - Menangkap niat:

```markdown
# Proposal: Tambahkan Mode Gelap

## Niat
Pengguna telah meminta opsi mode gelap untuk mengurangi ketegangan mata
selama penggunaan malam hari.

## Ruang Lingkup
- Tambahkan pengalih tema di pengaturan
- Dukung deteksi preferensi sistem
- Pertahankan preferensi di localStorage

## Pendekatan
Gunakan properti kustom CSS untuk tema dengan React context
untuk manajemen state.
```

**specs/ui/spec.md** - Delta yang menunjukkan persyaratan baru:

```markdown
# Delta untuk UI

## Persyaratan DITAMBAHKAN

### Persyaratan: Pemilihan Tema
Sistem HARUS mengizinkan pengguna memilih antara tema terang dan gelap.

#### Skenario: Pengalih manual
- DENGAN pengguna di halaman mana pun
- KETIKA pengguna mengklik pengalih tema
- MAKA tema berubah segera
- DAN preferensi dipertahankan di seluruh sesi

#### Skenario: Preferensi sistem
- DENGAN pengguna tanpa preferensi tersimpan
- KETIKA aplikasi dimuat
- MAKA skema warna yang disukai sistem digunakan
```

**tasks.md** - Daftar periksa implementasi:

```markdown
# Tugas

## 1. Infrastruktur Tema
- [ ] 1.1 Buat ThemeContext dengan state terang/gelap
- [ ] 1.2 Tambahkan properti kustom CSS untuk warna
- [ ] 1.3 Implementasikan persistensi localStorage

## 2. Komponen UI
- [ ] 2.1 Buat komponen ThemeToggle
- [ ] 2.2 Tambahkan pengalih ke halaman pengaturan
- [ ] 2.3 Perbarui Header untuk menyertakan pengalih cepat

## 3. Penataan
- [ ] 3.1 Definisikan palet warna tema gelap
- [ ] 3.2 Perbarui komponen untuk menggunakan variabel CSS
```

### 3. Implementasi

```
Anda: /opsx:apply

AI:  Bekerja melalui tugas...
     ✓ 1.1 Membuat ThemeContext dengan state terang/gelap
     ✓ 1.2 Menambahkan properti kustom CSS ke globals.css
     ✓ 1.3 Mengimplementasikan persistensi localStorage
     ✓ 2.1 Membuat komponen ThemeToggle
     ...
     Semua tugas selesai!
```

Selama implementasi, jika Anda menemukan desain perlu penyesuaian, cukup perbarui artefak dan lanjutkan.

### 4. Pengarsipan

```
Anda: /opsx:archive

AI:  Mengarsipkan add-dark-mode...
     ✓ Menggabungkan spesifikasi ke openspec/specs/ui/spec.md
     ✓ Memindahkan ke openspec/changes/archive/2025-01-24-add-dark-mode/
     Selesai! Siap untuk fitur berikutnya.
```

Spesifikasi delta Anda sekarang menjadi bagian dari spesifikasi utama, mendokumentasikan cara kerja sistem Anda.

## Memverifikasi dan Meninjau

Gunakan CLI untuk memeriksa perubahan Anda:

```bash
# Daftar perubahan aktif
openspec list

# Lihat detail perubahan
openspec show add-dark-mode

# Validasi format spesifikasi
openspec validate add-dark-mode

# Dasbor interaktif
openspec view
```

## Langkah Selanjutnya

- [Alur Kerja](workflows.md) - Pola umum dan kapan menggunakan setiap perintah
- [Perintah](commands.md) - Referensi lengkap untuk semua perintah slash
- [Konsep](concepts.md) - Pemahaman lebih dalam tentang spesifikasi, perubahan, dan skema
- [Kustomisasi](customization.md) - Buat OpenSpec bekerja sesuai keinginan Anda