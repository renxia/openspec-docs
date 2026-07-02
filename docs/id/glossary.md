# Glosarium

Setiap istilah OpenSpec di satu tempat, didefinisikan dalam bahasa yang jelas. Baca sekali dan sisa dokumentasi akan lebih cepat dipahami.

Istilah-istilah dikelompokkan berdasarkan topik, kemudian diurutkan secara alfabetis di dalam setiap kelompok.

## Kata Benda Inti (The core nouns)

**Spec.** Sebuah dokumen yang menjelaskan bagaimana sebagian sistem Anda berperilaku. Specs berada di `openspec/specs/`, diorganisasi berdasarkan domain, dan terdiri dari persyaratan serta skenario. Spec adalah jawaban yang disepakati untuk "apa yang dilakukan perangkat lunak ini?" Lihat [Konsep](concepts.md#specs).

**Source of truth.** Seluruh direktori `openspec/specs/`. Ini menyimpan perilaku sistem Anda yang saat ini dan telah disepakati. Perubahan mengajukan suntingan terhadapnya; pengarsipan menerapkannya.

**Change.** Satu unit pekerjaan, dikemas sebagai folder di bawah `openspec/changes/<name>/`. Sebuah change berisi segala sesuatu tentang pekerjaan tersebut: proposalnya, desainnya, tugas-tugasnya, dan suntingan spec yang diperkenalkannya. Satu change, satu fitur atau perbaikan.

**Artifact.** Sebuah dokumen di dalam sebuah change. Artifact standar adalah proposal, delta specs, desain, dan tugas. Mereka dibuat secara berurutan (dependency order) dan saling mengisi.

**Delta spec.** Sebuah spec di dalam sebuah change yang hanya menjelaskan apa yang berubah, menggunakan bagian `ADDED`, `MODIFIED`, dan `REMOVED`, alih-alih menyatakan ulang seluruh spec. Inilah yang memungkinkan OpenSpec menyunting sistem yang sudah ada secara bersih. Lihat [Konsep](concepts.md#delta-specs).

**Domain.** Pengelompokan logis untuk specs, seperti `auth/`, `payments/`, atau `ui/`. Anda memilih domain yang sesuai dengan cara Anda memikirkan sistem Anda.

## Di Dalam Sebuah Spec (Inside a spec)

**Requirement.** Satu perilaku yang harus dimiliki sistem, biasanya ditulis dengan kata kunci RFC 2119: "Sistem SHALL mengakhiri sesi setelah 30 menit." Persyaratan menyatakan *apa*, bukan *bagaimana*.

**Scenario.** Contoh konkret dan dapat diuji dari sebuah persyaratan dalam tindakan, biasanya dalam format Given/When/Then. Skenario membuat suatu persyaratan dapat diverifikasi: Anda bisa menulis tes otomatis darinya.

**RFC 2119 keywords.** Kata-kata MUST, SHALL, SHOULD, dan MAY, yang membawa makna standar tentang seberapa ketatnya suatu persyaratan. MUST dan SHALL adalah mutlak. SHOULD direkomendasikan dengan ruang untuk pengecualian. MAY bersifat opsional. Nama ini berasal dari dokumen standar internet yang mendefinisikannya.

## Artifact (The artifacts)

**Proposal (`proposal.md`).** *Alasan* dan *apa* dari sebuah perubahan: maksud, cakupan, dan pendekatan tingkat tinggi. Ini adalah artifact pertama yang Anda buat.

**Design (`design.md`).** *Bagaimana*: pendekatan teknis, keputusan arsitektur, dan file-file yang Anda harapkan untuk disentuh. Opsional untuk perubahan sederhana.

**Tasks (`tasks.md`).** Daftar periksa implementasi, dengan kotak centang. AI akan mengerjakannya selama `/opsx:apply` dan mencentang item saat ia berjalan.

## Siklus Hidup (The lifecycle)

**Archive.** Tindakan menyelesaikan sebuah change. Delta specs-nya digabungkan ke dalam spec utama, dan folder change dipindahkan ke `openspec/changes/archive/YYYY-MM-DD-<name>/`. Setelah diarsipkan, specs Anda menjelaskan realitas yang baru. Lihat [Konsep](concepts.md#archive).

**Sync.** Menggabungkan delta specs dari sebuah change ke dalam spec utama *tanpa* mengarsip perubahan tersebut. Biasanya otomatis (archive menawarkan untuk melakukannya), tetapi tersedia sendiri sebagai `/opsx:sync` untuk perubahan jangka panjang. Lihat [Perintah](commands.md#opsxsync).

## Alur Kerja dan Perintah (Workflow and commands)

**OPSX.** Alur kerja OpenSpec standar saat ini, dibangun di sekitar tindakan yang mengalir alih-alih fase yang kaku. Semua perintah slash-nya dimulai dengan `/opsx:`. Lihat [Alur Kerja OPSX](opsx.md).

**Slash command.** Perintah yang Anda ketik ke dalam obrolan asisten AI Anda, seperti `/opsx:propose`. Slash commands menggerakkan alur kerja. Mereka bukan perintah terminal. Lihat [Cara Kerja Perintah](how-commands-work.md).

**Explore (`/opsx:explore`).** Perintah mitra berpikir (thinking-partner). Ia membaca codebase Anda, membandingkan opsi, dan menjernihkan ide yang kabur menjadi rencana konkret, tanpa membuat artifact dan tanpa menulis kode. Ini adalah titik awal yang direkomendasikan kapan pun Anda memiliki masalah tetapi belum memiliki rencana. Lihat [Explore First](explore.md).

**CLI.** Program `openspec` yang Anda jalankan di terminal Anda. Ia mengatur proyek, mencantumkan dan memvalidasi perubahan, membuka dashboard, dan mengarsipkan. Bagian terminal dari OpenSpec. Lihat [CLI](cli.md).

**Skill.** Sebuah folder berisi instruksi (`.../skills/openspec-*/SKILL.md`) yang dideteksi secara otomatis oleh asisten AI Anda dan diikuti. Skills adalah standar lintas-alat yang sedang berkembang untuk menyampaikan alur kerja OpenSpec ke kepada asisten Anda.

**Command file.** File perintah slash per alat (`.../commands/opsx-*`). Mekanisme pengiriman yang lebih lama, masih didukung bersama dengan skills. Anda jarang menyentuh ini secara langsung.

**Profile.** Set perintah slash yang terinstal di proyek Anda. **Core** (standar) adalah `propose`, `explore`, `apply`, `sync`, `archive`. Set **expanded** menambahkan `new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`. Ubah ini dengan `openspec config profile`.

**Delivery.** Apakah OpenSpec menginstal skills, command files, atau keduanya untuk alat Anda. Dikonfigurasi secara global dan diterapkan dengan `openspec update`.

## Kustomisasi (Customization)

**Schema.** Definisi artifact mana yang dimiliki suatu alur kerja dan bagaimana mereka bergantung satu sama lain. Default bawaan adalah `spec-driven` (proposal → specs → desain → tugas). Anda dapat memecahnya atau menulis milik sendiri. Lihat [Kustomisasi](customization.md#custom-schemas).

**Template.** Sebuah file Markdown di dalam sebuah schema yang membentuk apa yang dihasilkan AI untuk suatu artifact tertentu. Mengedit template akan langsung mengubah output AI, tanpa perlu membangun ulang.

**Project config (`openspec/config.yaml`).** Pengaturan per proyek: schema default, `context:` yang disuntikkan ke setiap permintaan perencanaan, dan `rules:` per-artifact. Cara termudah untuk mengajarkan OpenSpec tentang stack dan konvensi Anda. Lihat [Kustomisasi](customization.md#project-configuration).

**Context injection.** Meletakkan latar belakang proyek di bidang `context:` dari `config.yaml` sehingga secara otomatis ditambahkan ke setiap artifact yang dihasilkan AI. Lebih andal daripada berharap AI membaca file terpisah.

**Dependency graph.** Grafik berarah yang dibentuk oleh hubungan `requires:` artifact. Ini adalah DAG (directed acyclic graph: panah hanya menunjuk maju, tidak pernah dalam lingkaran), dan OpenSpec menggunakannya untuk mengetahui apa yang dapat Anda buat selanjutnya.

**Enablers, not gates.** Prinsip bahwa dependensi artifact menunjukkan apa yang *mungkin* dilakukan selanjutnya, bukan apa yang *diperlukan* selanjutnya. Anda dapat mengunjungi kembali dan menyunting artifact apa pun kapan saja. Lihat [Konsep Inti Sekilas](overview.md#enablers-not-gates).

## Koordinasi antar Repos (Beta)

Istilah-istilah ini hanya berlaku jika perencanaan Anda mencakup lebih dari satu repo. Mereka masih dalam tahap beta. Sebagian besar pengguna dapat mengabaikannya. Lihat [Panduan Pengguna Stores](stores-beta/user-guide.md).

**Store.** Sebuah repo mandiri yang seluruh tugasnya adalah perencanaan. Ia memiliki bentuk `openspec/` yang sama seperti yang Anda ketahui (specs dan changes) ditambah satu file identitas kecil. Anda mendaftarkannya di mesin Anda sekali, berdasarkan nama, dan kemudian setiap perintah OpenSpec dapat bekerja di dalamnya dari mana saja.

**Reference.** Sebuah deklarasi, dalam `openspec/config.yaml` sebuah repo kode, tentang sebuah store yang dirujuk oleh repo tersebut. References bersifat read-only: repo menjaga akar sendiri, dan `openspec instructions` mendapatkan indeks dari specs store yang dirujuk, masing-masing dengan perintah tepat untuk mengambilnya.

**Working context.** Apa yang disiapkan oleh `openspec context` untuk repo saat ini: root OpenSpec-nya ditambah setiap store yang dirujuknya, masing-masing dengan cara untuk mengambilnya. Jawaban atas "apa yang sedang saya kerjakan?"

**Workset.** Satu set folder pribadi di mesin lokal yang Anda buka bersamaan (sebuah store bersamaan dengan repos kode yang Anda kerjakan). Dibuat secara eksplisit dengan `openspec workset create`; tidak ada hal tentang path lokal tersebut yang dikomit ke repo perencanaan bersama.

## Lihat Juga (See also)

- [Konsep Inti Sekilas](overview.md): lima ide, dalam satu halaman
- [Konsep](concepts.md): penjelasan bentuk panjang
- [Cara Kerja Perintah](how-commands-work.md): perintah slash versus CLI