# Stores: Rencana di Reponya Sendiri
> **Beta.** Stores, referensi, konteks kerja, dan worksets merupakan fitur baru. Nama perintah, flag, format file, dan output JSON masih bisa berubah bentuk antar rilis. Semua panduan langkah demi langkah di bawah dijalankan pada build saat ini, namun baca kembali panduan ini setelah melakukan upgrade.

## Masalah yang Diselesaikan

OpenSpec biasanya berada di dalam satu repo kode: folder `openspec/` di sebelah kode Anda, yang menyimpan spesifikasi dan perubahan untuk repo tersebut.

Hal itu tidak lagi cukup saat perencanaan Anda lebih besar dari satu repo:

- Pekerjaan Anda mencakup beberapa repo — satu fitur menyentuh server API, aplikasi web, dan pustaka bersama. Folder `openspec/` milik repo mana yang harus menampung rencana tersebut?
- Tim Anda merencanakan sebelum kode ada, atau merencanakan hal yang tidak akan pernah menjadi kode di *repo* ini.
- Persyaratan dimiliki oleh satu tim dan dikonsumsi oleh tim lain. Versi wiki bisa melenceng, dan agen pengkodean Anda tidak bisa membacanya sama sekali.

**Store** adalah jawabannya: repo mandiri yang seluruh tugasnya adalah perencanaan. Ia memiliki struktur `openspec/` yang sama seperti yang sudah Anda kenal — spesifikasi dan perubahan — serta file identitas kecil. Anda mendaftarkannya di mesin Anda sekali, dengan nama, lalu semua perintah OpenSpec normal dapat bekerja di dalamnya dari mana saja.

```
            team-plans  (sebuah store: perencanaan di repo sendiri)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      apa yang benar
                └── changes/    apa yang sedang berlangsung
                      ▲
                      │ terdaftar di setiap mesin berdasarkan nama;
                      │ dibagikan dengan mendorong/meng-clone seperti halnya repo biasa
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Dua aturan yang membuat ini tetap sederhana:

1. **Sebuah store hanyalah repo git.** Anda melakukan commit, push, pull, dan meninjau sendiri. OpenSpec tidak pernah meng-clone, menyinkronkan, atau mengirimkan apapun secara otomatis.
2. **Deklarasi, bukan mesin.** Repo dapat *mendeklarasikan* bagaimana hubungan mereka dengan store (ditunjukkan di bawah). Deklarasi mengubah apa yang dapat dikatakan OpenSpec kepadamu — bukan tempat perintahmu bertindak.

## Lima menit untuk store pertamamu

Dua perintah membawamu dari nihil ke perubahan yang berfungsi dan ber-cakup store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store siap: team-plans
Lokasi: /Users/you/openspec/team-plans
OpenSpec root: siap
Registry: terdaftar

Selanjutnya: jalankan perintah OpenSpec normal terhadap store ini, misalnya:
  openspec new change <change-id> --store team-plans
Bagikan store ini dengan melakukan commit dan push seperti halnya repo Git biasa.
```

```bash
openspec new change add-login --store team-plans
```

```
Menggunakan OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Perubahan 'add-login' dibuat di /Users/you/openspec/team-plans/openspec/changes/add-login/
Skema: spec-driven
Selanjutnya: openspec status --change add-login --store team-plans
```

Itulah seluruh modelnya. Dari sini, siklus hidupnya persis seperti yang kamu kenal — `status`, `instructions`, `validate`, `archive` — dengan `--store team-plans` pada setiap perintah, dan setiap petunjuk yang dicetak membawa flag tersebut untukmu. Baris `Using OpenSpec root:` selalu memberitahu kamu tempat perintah sedang bertindak.

## Cerita: satu tim, satu repo perencanaan

Sebuah tim menyimpan spesifikasi dan perubahannya di `team-plans` alih-alih menyebarkannya di berbagai repo kode.

**Hari pertama (siapa pun yang menyiapkannya):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Menambahkan `--remote` akan mencatat URL clone di dalam file identitas store itu sendiri (`.openspec-store/store.yaml`), dalam commit awal. Setiap clone di masa depan lahir dengan tahu dari mana asalnya, sehingga pemeriksaan kesehatan dan pesan kesalahan dapat mencetak perbaikan lengkap yang dapat ditempel untuk rekan tim yang belum memilikinya.

**Setiap rekan tim (sekali per mesin):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Dari saat itu, semua orang bekerja di repo perencanaan yang sama dengan nama:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Berbagi kerja adalah git, dengan sengaja.** Perubahan yang kamu buat hanya ada di checkoutmu sampai kamu melakukan commit dan push — sama seperti kode. Rencana mendapatkan cabang, pull request, dan tinjauan secara gratis, karena store adalah repo biasa.

**Menghubungkan repo kode tim.** Repo kode yang perencanaannya sepenuhnya dieksternalisasi membutuhkan tepat satu baris, di `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Sekarang setiap perintah OpenSpec yang dijalankan di dalam `web-app` bertindak pada `team-plans` tanpa flag sama sekali:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Menggunakan OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Pointer ini adalah fallback, bukan pengganti: `--store` yang eksplisit selalu menang, dan jika repo memiliki folder perencanaan nyata sendiri, yang tersebut menang (dengan peringatan untuk menghapus pointer yang sudah usang).

**Satu default untuk setiap repo di mesinmu.** Jika kamu bekerja di banyak repo kode yang semuanya merencanakan ke store yang sama, atur sekali secara global, alih-alih menambahkan baris `store:` ke setiap repo:

```bash
openspec config set defaultStore team-plans
```

Sekarang setiap perintah yang dijalankan di luar root perencanaan — dan tanpa `--store` serta pointer proyek — akan diresolusi ke `team-plans`. Ini berada di bagian bawah daftar prioritas, jadi `--store`, root lokal, dan pointer `store:` proyek semuanya tetap menang. Banner root dan blok JSON `root` melaporkan `source: "global_default"` dengan id store, sehingga kamu selalu dapat membedakan default seluruh mesin dengan pointer repo itu sendiri. Hapusnya dengan `openspec config unset defaultStore`. Jika id tidak terdaftar, perintah akan error dan memberitahumu untuk mendaftarkannya atau menghapus default yang sudah usang.

## Cerita: persyaratan yang melintasi batas tim

Tim platform memegang persyaratan. Tim produk membangun berdasarkan persyaratan tersebut, di repo mereka sendiri, dengan desain mereka sendiri. Referensi mendeskripsikan hubungan tersebut tanpa memindahkan pekerjaan siapa pun.

```
   platform-reqs (store)                 api-server (code repo)
   dimiliki oleh tim platform            dimiliki oleh tim produk
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ membaca  │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (desain mereka sendiri)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (pekerjaan mereka sendiri)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Tim produk mendeklarasikan apa yang mereka gunakan** di `openspec/config.yaml` repo mereka:

```yaml
references:
  - platform-reqs
```

Referensi adalah konteks hanya-baca. Repo mempertahankan root `openspec/`nya sendiri; pekerjaan tetap ada di sana. Yang berubah: `openspec instructions` di repo tersebut sekarang mencakup indeks spesifikasi store yang dirujuk — masing-masing dengan ringkasan satu baris dan perintah fetch yang tepat (`openspec show <spec-id> --type spec --store platform-reqs`). Agen yang bekerja di `api-server` dapat menemukan persyaratan pembayaran hulu, mengutipnya, dan menulis desain tingkat rendahnya di root repo itu sendiri — tanpa ada yang menempelkan konteks di sekitar.

Referensi dapat membawa sumber clone mereka, sehingga rekan tim yang belum memiliki store mendapatkan perbaikan lengkap alih-alih jalan buntu:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Ketika kamu ingin rencana dan kode terbuka bersama-sama, buat workset.** Ini bersifat pribadi dan eksplisit: setiap orang memilih folder yang mereka gunakan di mesin mereka. Tidak ada yang berhubungan dengan jalur checkout lokal tersebut yang di-commit ke repo perencanaan bersama.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Dua pertanyaan yang selalu bisa kamu ajukan

**"Apakah set-up saya sehat?"** — `openspec doctor` memeriksa root saat ini dan store yang dirujuknya, hanya-baca, dengan perbaikan yang dapat ditempel per temuan:

```
Dokter

Root
  Lokasi: /Users/you/src/api-server
  OpenSpec root: ok

Referensi
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Store yang dirujuk 'design-system' tidak terdaftar di mesin ini.
    Perbaikan: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Apa yang sedang saya kerjakan?"** — `openspec context` menyusun set kerja dari deklarasi OpenSpec: root dan store yang dirujuknya.

```
Konteks kerja untuk api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Store yang dirujuk
  platform-reqs  /Users/you/openspec/platform-reqs
    Ambil: openspec show <spec-id> --type spec --store platform-reqs
```

Keduanya mendukung `--json` untuk agen. `openspec context --code-workspace <path>` juga menulis file workspace VS Code yang berisi seluruh set — satu-satunya tulis yang dilakukan perintah ini.

## Workset: buka kembali folder yang kamu kerjakan bersama

Terpisah dari semua yang di atas: kebanyakan orang membuka beberapa folder yang sama bersama setiap sesi — repo perencanaan ditambah dua atau tiga repo kode. **Workset** adalah tampilan bernama pribadi dari hal tersebut, yang dibuka kembali dengan satu perintah di tool pilihan kamu.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       ketiganya terbuka di tool kamu
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (terbuka di VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` kemudian meluncurkan tool yang disimpan: editor (VS Code, Cursor) membuka satu jendela dengan setiap anggota dan kembali. Anggota pertama adalah yang utama. Timpa tool kapan saja dengan `--tool <id>`.

Workset sengaja *bukan* state bersama. Mereka hidup di mesinmu, tidak pernah di-commit, dan tidak membuat klaim tentang pekerjaan — mereka hanya mencatat apa yang kamu suka buka bersama. Menghapus satu tidak pernah menyentuh folder anggota. Tool baru adalah konfigurasi, bukan kode: apapun yang diluncurkan melalui file workspace atau flag attach per-folder dapat ditambahkan di bawah kunci `openers` di konfigurasi global (`openspec config edit`).

## Bagaimana perintah memutuskan tempat bertindak

Setiap perintah normal menyelesaikan rootnya dengan cara yang sama, dalam urutan ini:

```
1. --store <id>          kamu mengatakannya secara eksplisit        → store tersebut
2. nearest openspec/     root perencanaan nyata di sini     → repo ini
   (berjalan naik dari cwd)
3. store: pointer        config.yaml mendeklarasikan store  → store tersebut
4. defaultStore          konfigurasi global menetapkan default  → store tersebut
                         mesin
5. none of the above     store terdaftar di mesin ini?     → error dengan
                         tidak ada store terdaftar?         → petunjuk pemilihan
                                                          direktori saat ini
                                                          (perilaku klasik)
```

Baris `Using OpenSpec root:` (dan blok `root` dalam output `--json`) memberitahu kamu kasus mana yang sedang kamu hadapi.

## Batasan yang diketahui

- **Bentuk beta.** Segala sesuatu di halaman ini dapat berubah antar rilis — nama, flag, format file, kunci JSON.
- **Satu checkout per id store per mesin.** Mendaftarkan checkout kedua dengan id yang sama gagal dengan petunjuk untuk melakukan `store unregister` terlebih dahulu.
- **Tidak ada sinkronisasi, tidak pernah — dengan sengaja.** OpenSpec tidak pernah meng-clone, menarik, atau mengirimkan. Checkout yang usang menunjukkan spesifikasi usang sampai *kamu* menarik; referensi diindeks langsung dari apapun yang ada di disk.
- **Folder perencanaan kosong dapat tidak ada.** Store baru mungkin tidak memiliki `openspec/changes/`, `openspec/specs/`, atau `openspec/changes/archive/` di Git saat ini. Hal ini diterima selama beta; folder tersebut muncul setelah perintah normal membuat file untuknya.
- **Repo pointer tetap pointer.** Repo hanya-konfigurasi yang `openspec/config.yaml`nya mendeklarasikan `store: <id>` diperlakukan sebagai perencanaan yang dieksternalisasi, bukan sebagai checkout store untuk didaftarkan. Hapus baris `store:` terlebih dahulu jika kamu sengaja ingin mengubah repo itu menjadi root store lokal.
- **Beberapa perintah tetap di tempatnya.** `view`, `templates`, `schemas`, dan bentuk kata benda yang sudah usang (`openspec change show`, ...) bertindak hanya pada direktori saat ini — tidak ada `--store`.
- **State per mesin adalah per mesin.** Registry store dan workset adalah pengaturan lokal. Tidak ada yang berhubungan dengan tata letak mesinmu yang pernah di-commit ke perencanaan bersama.
- **Dua gaya peluncuran untuk workset.** Tool yang tidak dapat diluncurkan dengan file workspace atau flag attach per-folder tidak dapat ditambahkan sebagai opener.
- **JSON agen memiliki pemisahan casing yang diketahui** (kunci keluarga store adalah snake_case, keluarga workflow adalah camelCase). Didokumentasikan dalam [kontrak agen](../agent-contract.md); penggabungannya ditunda ke rilis yang memiliki versi.

## Lokasi Penyimpanan

| Komponen | Lokasi | Bersama? |
|---|---|---|
| Rencana toko | `<store>/openspec/` (spesifikasi, perubahan) | Ya — commit dan push |
| Identitas toko | `<store>/.openspec-store/store.yaml` | Ya — ikut di-commit bersama toko |
| Registry toko | `<data dir>/openspec/stores/registry.yaml` | Tidak — hanya untuk mesin ini |
| Worksets | `<data dir>/openspec/worksets/` | Tidak — hanya untuk mesin ini |

`<data dir>` adalah `~/.local/share/openspec` pada macOS dan Linux (atau `$XDG_DATA_HOME/openspec` jika disetel), dan `%LOCALAPPDATA%\openspec` pada Windows.

## Referensi

Flag dan struktur JSON yang tepat untuk setiap perintah pada halaman ini: [Referensi CLI](../cli.md) (Stores, Doctor, Konteks kerja, Worksets pribadi) dan [Kontrak agen](../agent-contract.md).