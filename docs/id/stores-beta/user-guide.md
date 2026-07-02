# Store: Rencana dalam Repositori Sendiri

> **Beta.** Stores, references, working context, dan worksets adalah hal baru. Nama perintah, flag, format file, dan output JSON mungkin masih berubah bentuk antar rilis. Setiap panduan di bawah ini dijalankan terhadap build saat ini, tetapi baca kembali panduan ini setelah melakukan peningkatan (upgrade).

## Masalah yang Dipecahkan Ini

OpenSpec biasanya berada di dalam satu repositori kode: folder `openspec/` di samping kode Anda, berisi spesifikasi dan perubahan untuk repositori tersebut.

Hal itu tidak lagi sesuai ketika perencanaan Anda lebih besar dari satu repo:

- Pekerjaan Anda mencakup beberapa repositori — satu fitur menyentuh API server, aplikasi web, dan pustaka bersama (shared library). Di folder `openspec/` milik siapa rencana itu berada?
- Tim Anda merencanakan sebelum kode ada, atau merencanakan hal-hal yang tidak pernah menjadi kode di *repositori ini*.
- Persyaratan dimiliki oleh satu tim dan dikonsumsi oleh tim lainnya. Versi wiki bergeser (drifts), dan agen coding Anda tidak dapat membacanya.

Sebuah **store** adalah jawabannya: sebuah repositori mandiri yang seluruh tugasnya adalah perencanaan. Ia memiliki bentuk `openspec/` yang sama seperti yang sudah Anda ketahui — spesifikasi dan perubahan — ditambah satu file identitas kecil. Anda mendaftarkannya di mesin Anda sekali, berdasarkan nama, dan kemudian setiap perintah OpenSpec biasa dapat bekerja di dalamnya dari mana saja.

## Bentuknya

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Dua aturan membuat ini sederhana:

1. **A store hanyalah git repo.** Anda melakukan commit, push, pull, dan meninjaunya sendiri. OpenSpec tidak pernah mengkloning, menyinkronkan, atau mendorong apa pun sendirian.
2. **Deklarasi, bukan mesin.** Repos dapat *mendeklarasikan* bagaimana mereka berhubungan dengan stores (ditunjukkan di bawah). Deklarasi mengubah apa yang dapat dikatakan OpenSpec kepada Anda — tidak pernah ke mana perintah Anda bertindak.

## Lima menit menuju store pertama Anda

Dua perintah membawa Anda dari ketiadaan ke perubahan yang berfungsi dan terikat pada store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

Itulah keseluruhan modelnya. Dari sini siklus hidupnya persis seperti yang Anda ketahui — `status`, `instructions`, `validate`, `archive` — dengan `--store team-plans` pada setiap perintah, dan setiap petunjuk yang dicetak membawa bendera untuk Anda. Baris `Using OpenSpec root:` selalu memberi tahu Anda di mana sebuah perintah bertindak.

## Cerita: satu tim, satu repo perencanaan

Sebuah tim menyimpan specs dan perubahan mereka di `team-plans` alih-alih menyebarkannya ke berbagai code repos.

**Hari pertama (siapa pun yang mengaturnya):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Meneruskan `--remote` mencatat URL kloning di dalam file identitas store itu sendiri (`.openspec-store/store.yaml`), pada commit awal. Setiap kloning di masa depan lahir mengetahui dari mana asalnya, sehingga pemeriksaan kesehatan dan pesan kesalahan dapat mencetak perbaikan lengkap yang dapat ditempelkan untuk rekan tim yang belum memilikinya.

**Setiap anggota tim (sekali per mesin):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Sejak saat itu, semua orang bekerja di repo perencanaan yang sama berdasarkan nama:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Berbagi pekerjaan adalah git, dan itu disengaja.** Sebuah perubahan yang Anda buat hanya ada di checkout Anda sampai Anda melakukan commit dan push — sama seperti kode. Rencana mendapatkan cabang, pull request, dan peninjauan secara gratis, karena sebuah store adalah repo biasa.

**Menghubungkan code repos tim.** Sebuah code repo yang perencanaannya sepenuhnya dieksternalisasi membutuhkan tepat satu baris, di `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Sekarang setiap perintah OpenSpec yang dijalankan di dalam `web-app` bertindak pada `team-plans` tanpa bendera sama sekali:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Pointer adalah cadangan, tidak pernah pengganti: `--store` yang eksplisit selalu menang, dan jika repo tersebut tumbuh folder perencanaan sungguhan tersendiri, maka itu yang menang (dengan peringatan untuk menghapus pointer lama).

## Cerita: persyaratan yang melintasi batas tim

Sebuah tim platform memiliki persyaratan. Tim produk membangun berdasarkan persyaratan tersebut, di repos mereka sendiri, dengan desain mereka sendiri. Sebuah referensi menjelaskan hubungan tersebut tanpa memindahkan pekerjaan siapa pun.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Tim produk mendeklarasikan apa yang mereka gunakan** di `openspec/config.yaml` repos mereka:

```yaml
references:
  - platform-reqs
```

Referensi adalah konteks baca-saja. Repo tersebut mempertahankan akar `openspec`-nya sendiri; pekerjaan tetap ada di sana. Apa yang berubah: `openspec instructions` di repo itu sekarang mencakup indeks dari specs store yang dirujuk — masing-masing dengan ringkasan satu baris dan perintah fetch yang tepat (`openspec show <spec-id> --type spec --store platform-reqs`). Sebuah agent yang bekerja di `api-server` dapat menemukan persyaratan pembayaran upstream, mengutipnya, dan menulis desain tingkat rendah mereka di akar repo itu sendiri — tanpa ada orang yang menyalin konteks.

Sebuah referensi dapat membawa sumber kloningnya, sehingga rekan tim yang belum memiliki store tersebut mendapatkan perbaikan lengkap alih-alih jalan buntu:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Ketika Anda ingin rencana dan kode terbuka bersama, buat workset.** Ini bersifat pribadi dan eksplisit: setiap orang memilih folder yang sebenarnya mereka kerjakan di mesin mereka. Tidak ada tentang jalur checkout lokal tersebut yang dicommit ke repo perencanaan bersama.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Dua pertanyaan yang selalu bisa Anda ajukan

**"Apakah setup saya sehat?"** — `openspec doctor` memeriksa akar saat ini dan stores yang dirujuknya, baca-saja, dengan perbaikan yang dapat ditempelkan untuk setiap temuan:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Apa yang sedang saya kerjakan?"** — `openspec context` menyusun workset dari deklarasi OpenSpec: akar dan stores yang dirujuknya.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Keduanya mendukung `--json` untuk agen. `openspec context --code-workspace <path>` juga menulis file workspace VS Code yang berisi seluruh set — satu-satunya hal yang dilakukan perintah ini.

## Worksets: buka kembali folder yang Anda kerjakan bersama

Terpisah dari semua hal di atas: kebanyakan orang membuka beberapa folder yang sama setiap sesi — repo perencanaan ditambah dua atau tiga code repos. Sebuah **workset** adalah pandangan pribadi dan bernama tentang persis hal itu, dibuka kembali dengan satu perintah di alat pilihan Anda.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` kemudian meluncurkan alat yang disimpan: editor (VS Code, Cursor) membuka satu jendela dengan setiap anggota dan kembali. Anggota pertama adalah utamanya. Ganti alatnya kapan saja dengan `--tool <id>`.

Worksets sengaja *bukan* status bersama. Mereka hidup di mesin Anda, tidak pernah dicommit, dan tidak membuat klaim tentang pekerjaan — mereka hanya mencatat apa yang Anda sukai untuk dibuka bersama. Menghapus satu sama sekali tidak menyentuh folder anggota. Alat baru adalah konfigurasi, bukan kode: apa pun yang diluncurkan melalui file workspace atau bendera lampiran per-folder dapat ditambahkan di bawah kunci `openers` dalam config global (`openspec config edit`).

## Bagaimana perintah memutuskan tempat untuk bertindak

Setiap perintah normal menyelesaikan akarnya dengan cara yang sama, dalam urutan ini:

```
1. --store <id>          Anda menyatakannya secara eksplisit        → store tersebut
2. nearest openspec/     Akar perencanaan yang nyata di sini     → repo ini
   (berjalan ke atas dari cwd)
3. store: pointer        config.yaml mendeklarasikan sebuah store  → store tersebut
4. tidak ada di atas     Stores terdaftar di mesin ini?         → error dengan petunjuk pemilihan
                         tidak?                                   → direktori saat ini
                                                          (perilaku klasik)
```

Baris `Using OpenSpec root:` (dan blok `root` dalam output `--json`) memberi tahu Anda kasus mana yang sedang terjadi.

## Keterbatasan yang diketahui

- **Bentuk Beta.** Segala sesuatu di halaman ini dapat berubah antara rilis — nama, bendera, format file, kunci JSON.
- **Satu checkout per ID store per mesin.** Mendaftarkan checkout kedua di bawah ID yang sama akan gagal dengan petunjuk untuk `store unregister` terlebih dahulu.
- **Tidak ada sinkronisasi, selamanya — berdasarkan desain.** OpenSpec tidak pernah mengkloning, menarik, atau mendorong. Sebuah checkout yang usang menunjukkan specs yang usang sampai *Anda* menariknya; referensi diindeks secara langsung dari apa pun yang ada di disk.
- **Beberapa perintah tetap di tempatnya.** `view`, `templates`, `schemas`, dan bentuk kata benda yang sudah usang (`openspec change show`, ...) hanya bertindak pada direktori saat ini — tidak ada `--store`.
- **Status per-mesin adalah per-mesin.** Registry store dan worksets adalah pengaturan lokal. Tidak ada tentang tata letak mesin Anda yang pernah dicommit ke perencanaan bersama.
- **Dua gaya peluncuran untuk worksets.** Alat yang tidak dapat diluncurkan dengan file workspace atau bendera lampiran per-folder tidak dapat ditambahkan sebagai opener.
- **JSON Agent memiliki pembagian casing yang diketahui** (kunci keluarga store adalah `snake_case`, keluarga alur kerja adalah `camelCase`). Didokumentasikan di [agent contract](../agent-contract.md); menyatukannya ditunda hingga rilis berversi.

## Di mana segala sesuatu berada

| Apa | Di mana | Dibagikan? |
|---|---|---|
| Perencanaan sebuah store | `<store>/openspec/` (specs, changes) | Ya — commit dan push |
| Identitas sebuah store | `<store>/.openspec-store/store.yaml` | Ya — dicommit bersama store |
| Registry store | `<data dir>/openspec/stores/registry.yaml` | Tidak — hanya mesin ini |
| Worksets | `<data dir>/openspec/worksets/` | Tidak — hanya mesin ini |

`<data dir>` adalah `~/.local/share/openspec` pada macOS dan Linux (atau `$XDG_DATA_HOME/openspec` jika diatur), dan `%LOCALAPPDATA%\openspec` pada Windows.
## Referensi

Bendera dan bentuk JSON yang tepat untuk setiap perintah di halaman ini:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) dan [agent contract](../agent-contract.md).