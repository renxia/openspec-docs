# Meninjau Perubahan

Seluruh janji OpenSpec adalah bahwa Anda dan AI Anda **sepakat tentang apa yang akan dibangun sebelum ada kode yang ditulis.** Kesepakatan itu hanya berarti sesuatu jika Anda benar-benar membaca apa yang AI susun. Halaman ini tentang dua menit tempat Anda melakukan itu — apa yang harus dibuka, dalam urutan apa, dan apa yang harus dicari.

Taruhannya sederhana: menangkap langkah yang salah dalam rencana satu paragraf hampir tidak membutuhkan biaya. Menangkap langkah salah yang sama dalam 300 baris kode tidak. Tinjauan adalah tempat Anda memenangkan taruhan itu.

## Dua momen yang Anda tinjau

Ada tepat dua:

```
/opsx:propose ──► TINJAU RENCANA ──► /opsx:apply ──► TINJAU KODE ──► /opsx:archive
                  (sebelum ada kode)                    (/opsx:verify)
```

1. **Setelah `/opsx:propose`** (atau `/opsx:ff`), sebelum `/opsx:apply` — baca rencana saat itu masih hanya kata-kata.
2. **Setelah membangun**, dengan `/opsx:verify` — periksa apakah kode benar-benar melakukan apa yang dikatakan dalam rencana.

Tinjauan pertama adalah yang paling menghematkan Anda, dan yang paling banyak dilewati orang. Halaman ini menghabiskan sebagian besar waktunya di sana.

## Baca dalam urutan ini

Perubahan adalah folder Markdown biasa di `openspec/changes/<name>/`. Baca file dalam urutan yang memungkinkan Anda berhenti secepatnya jika ada yang salah:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. tujuan dan ruang lingkup   ← jika ini salah, berhenti di sini
├── specs/…/spec.md  2. persyaratan       ← inti dari tinjauan
├── design.md        (hanya untuk perubahan yang lebih besar) — pendekatan teknis
└── tasks.md         3. rencana kerja
```

Anda tidak perlu membaca setiap baris. Anda perlu menjawab tiga pertanyaan, satu per file.

## Proposal: apakah ini masalah yang tepat?

Buka `proposal.md` terlebih dahulu. Itu menangkap "mengapa" dan "apa" — tujuan, ruang lingkup, pendekatan dalam satu atau dua paragraf.

**Apa yang terlihat baik:** satu tujuan yang jelas, ruang lingkup yang Anda kenali, dan alasan mengapa ini layak dilakukan sekarang.

**Tanda bahaya:**

- Itu menyelesaikan masalah yang sedikit *berbeda* dari yang Anda minta.
- Ruang lingkup telah berkembang — Anda meminta pengalih tema dan proposal juga menyentuh otentikasi "selama kita di sini."
- Itu samar. "Tingkatkan halaman pengaturan" bukanlah ruang lingkup; "tambahkan pengalih mode gelap yang menghormati preferensi sistem operasi" adalah.

**Pertanyaan yang harus dijawab:** *Apakah ini sesuai dengan apa yang saya benar-benar minta, dan apakah ada yang menyusup?* Jika jawabannya tidak, berhenti — jangan baca lebih lanjut, perbaiki proposal (lihat [Pushing back](#pushing-back-is-cheap)).

## Delta spesifikasi: apakah "selesai" didefinisikan dengan benar?

Ini adalah inti dari tinjauan. Delta spesifikasi di bawah `specs/` mengatakan apa yang akan *benar* ketika perubahan dirilis — sebagai persyaratan dan skenario yang membuktikannya:

```markdown
## ADDED Persyaratan

### Persyaratan: Pengalih Mode Gelap
Sistem SHALL memungkinkan pengguna untuk beralih antara tema terang dan gelap.

#### Skenario: Menghormati preferensi sistem operasi saat pertama kali dimuat
- GIVEN pengguna yang belum pernah mengatur tema
- WHEN mereka membuka aplikasi di perangkat yang diatur ke mode gelap
- THEN aplikasi menampilkan dalam mode gelap
```

**Apa yang terlihat baik dari persyaratan:** satu pernyataan `SHALL`/`MUST` yang jelas yang bisa Anda berikan ke penguji, dan setidaknya satu skenario yang GIVEN/WHEN/THEN-nya benar-benar menguji pernyataan itu.

**Tanda bahaya:**

- **Persyaratan yang samar.** "The system SHALL be fast" tidak bisa dibangun atau diuji. Apa yang dimaksud dengan cepat?
- **Persyaratan tanpa skenario**, atau skenario yang tidak menguji persyaratan yang ada di bawahnya.
- **Tangkapan yang paling berharga: apa yang hilang.** AI mencatat dengan setia apa yang Anda *katakan*. Pekerjaan Anda adalah memperhatikan apa yang Anda *lupa* katakan. Jika yang paling Anda pedulikan adalah kasus preferensi sistem operasi dan tidak ada skenario yang menyebutkannya, itu adalah tinjauan yang membayar diri sendiri.

Baca delta dengan bertanya *apakah saya akan senang jika sistem melakukan persis — dan hanya — ini?* Tidak ada yang berkaitan dengan kode di sini, jadi tetap murah untuk diubah.

## Tugas: apakah rencana kerja masuk akal?

Buka `tasks.md` terakhir. Itu adalah daftar periksa implementasi yang akan AI lalui.

**Apa yang terlihat baik:** langkah-langkah yang berurutan, masing-masing dapat ditelusuri ke persyaratan, tidak ada yang misterius.

**Tanda bahaya:**

- Tugas tanpa persyaratan yang sesuai (dari mana asalnya?).
- Satu tugas raksasa "implementasikan fitur" yang menyembunyikan semua keputusan nyata.
- Tugas yang menyentuh sesuatu di luar ruang lingkup yang baru saja Anda setujui.

Anda tidak sedang memperkirakan atau mengelola secara berlebih di sini — Anda sedang memeriksa bahwa rencana sesuai dengan persyaratan yang sudah Anda terima.

## Pushing back is cheap

Jika salah satu dari tiga pertanyaan kembali salah, katakanlah. Tidak ada fase dan tidak ada yang dikunci — Anda memperbaiki dan melanjutkan. Dua cara, persis seperti di [Mengedit perubahan](editing-changes.md):

- **Edit file sendiri.** Itu adalah Markdown biasa; ubah baris ruang lingkup, ketatkan persyaratan, hapus tugas.
- **Beritahu AI apa yang salah** dan biarkan merevisi: *"hapus perubahan otentikasi — di luar ruang lingkup,"* *"tambahkan skenario untuk ketika pengguna sudah memilih tema,"* *"bagi tugas 3 menjadi skema dan UI."*

Kemudian baca kembali bagian yang Anda ubah. Buat draf ulang sampai itu adalah rencana yang akan Anda tanda tangani. Itu bolak-balik *adalah* produk yang bekerja.

## Setelah kode: verifikasi

Setelah kerja selesai dibangun, `/opsx:verify` adalah tinjauan kedua Anda. Itu membaca ulang artefak dan kode dan melaporkan ketidakcocokan di tiga dimensi:

| Dimensi | Apa yang diperiksa |
|-----------|----------------|
| **Kelengkapan** | Setiap tugas selesai, setiap persyaratan diimplementasikan, skenario tercakup |
| **Kebenaran** | Implementasi sesuai dengan tujuan spesifikasi, kasus tepi ditangani |
| **Keselarasan** | Keputusan desain benar-benar muncul di kode |

```
Anda: /opsx:verify

AI:  Memverifikasi add-dark-mode...

     KELENGKAPAN
     ✓ Semua 8 tugas di tasks.md diperiksa
     ✓ Semua persyaratan di specs memiliki kode yang sesuai
     ⚠ Skenario "Menghormati preferensi sistem operasi saat pertama kali dimuat" tidak memiliki cakupan tes
```

Itu menandai masalah sebagai KRITIS, PERINGATAN, atau SARAN, dan itu **tidak** memblokir pengarsipan — itu menampilkan kesenjangan dan membiarkan keputusan kepada Anda. Ini adalah perbedaan antara "apakah AI menulis kode" dan "apakah itu membangun apa yang kita sepakati."

`/opsx:verify` ada dalam profil yang diperluas. Jika Anda tidak memilikinya, nyalakan dengan `openspec config profile` (kemudian `openspec update`), atau cukup baca kembali perubahan dan diff sendiri.

## Sesuaikan ukuran tinjauan

Tidak setiap perubahan layak mendapatkan tinjauan penuh. Perbaikan ketik satu file layak mendapatkan sekilas dua puluh detik. Perubahan yang menyentuh otentikasi, pembayaran, atau data yang tidak bisa Anda pulihkan layak mendapatkan semua pertanyaan di atas. Titiknya bukanlah seremonial — itu adalah menghabiskan perhatian Anda di tempat di mana kesalahan akan mahal, dan menyelip di tempat di mana tidak.

## Daftar periksa dua menit

- [ ] Tujuan proposal sesuai dengan apa yang saya minta.
- [ ] Tidak ada yang tambahan yang menyusup ke ruang lingkup.
- [ ] Setiap persyaratan cukup spesifik untuk diuji.
- [ ] Setiap persyaratan memiliki skenario yang benar-benar mengujinya.
- [ ] Kasus yang paling saya pedulikan tercakup.
- [ ] Tugas memetakan ke persyaratan; tidak ada yang misterius atau di luar ruang lingkup.
- [ ] Saya akan nyaman jika AI membangun persis ini dan tidak lebih.

Jika ketujuh lulus, jalankan `/opsx:apply` dengan percaya diri. Jika yang mana pun gagal, itu bukanlah kemunduran — itu adalah dua menit yang melakukan pekerjaannya.

## Ke mana harus pergi selanjutnya

- [Menulis Spesifikasi yang Baik](writing-specs.md) — sisi lain: cara membuat draf persyaratan dan skenario yang layak disetujui.
- [Mengedit & Melakukan Iterasi pada Perubahan](editing-changes.md) — mekanisme mengubah rencana setelah Anda memulai.
- [Alur Kerja](workflows.md) — tempat tinjauan cocok dalam loop yang lebih besar.