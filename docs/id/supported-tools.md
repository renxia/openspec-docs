# Alat yang Didukung

OpenSpec bekerja dengan banyak asisten pengkodean AI. Saat Anda menjalankan `openspec init`, OpenSpec mengonfigurasi alat yang dipilih menggunakan profil/workflow aktif dan mode pengiriman yang Anda pilih.

## Cara Kerjanya

Untuk setiap alat yang dipilih, OpenSpec dapat menginstal:

1. **Keterampilan** (jika pengiriman mencakup keterampilan): `.../skills/openspec-*/SKILL.md`
2. **Perintah** (jika pengiriman mencakup perintah): file perintah `opsx-*` khusus alat

Codex hanya menggunakan keterampilan: OpenSpec menginstal `.codex/skills/openspec-*/SKILL.md` untuk Codex bahkan ketika pengiriman diatur ke `commands`, dan tidak menghasilkan file prompt khusus untuk Codex.

Secara default, OpenSpec menggunakan profil `core`, yang mencakup:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Anda dapat mengaktifkan workflow yang diperluas (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) melalui `openspec config profile`, kemudian jalankan `openspec update`.

## Referensi Direktori Alat

| Alat (ID) | Pola path keterampilan | Pola path perintah |
|-----------|------------------------|---------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Tidak dihasilkan (tidak ada adaptor perintah; gunakan invocations berbasis keterampilan `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | Tidak dihasilkan (hanya keterampilan; gunakan `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Tidak dihasilkan (tidak ada adaptor perintah; gunakan invocations berbasis keterampilan `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Tidak dihasilkan (tidak ada adaptor perintah; gunakan invocations berbasis keterampilan `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Tidak dihasilkan (tidak ada adaptor perintah; gunakan invocations berbasis keterampilan `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Tidak dihasilkan (tidak ada adaptor perintah; gunakan invocations berbasis keterampilan `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* File prompt GitHub Copilot dikenali sebagai perintah garis miring khusus di ekstensi IDE (VS Code, JetBrains, Visual Studio). Copilot CLI saat ini tidak menggunakan `.github/prompts/*.prompt.md` secara langsung.

\*\*\* Hermes memuat keterampilan dari `~/.hermes/skills/` secara default. Untuk menggunakan keterampilan OpenSpec lokal proyek, tambahkan direktori `.hermes/skills/` proyek ke `skills.external_dirs` di `~/.hermes/config.yaml`; Hermes kemudian mengekspos keterampilan dengan invocations garis miring yang dapat dilihat pengguna seperti `/openspec-propose`.

## Pengaturan Non-Interaktif

Untuk pengaturan CI/CD atau yang menggunakan skrip, gunakan `--tools` (dan secara opsional `--profile`):

```bash
# Konfigurasikan alat tertentu
openspec init --tools claude,cursor

# Konfigurasikan semua alat yang didukung
openspec init --tools all

# Lewati konfigurasi alat
openspec init --tools none

# Timpa profil untuk menjalankan init ini
openspec init --profile core
```

**ID alat yang tersedia (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## Instalasi Bergantung pada Workflow

OpenSpec menginstal artefak workflow berdasarkan workflow yang dipilih:

- **Profil inti (default):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Pilihan khusus:** subset berapapun dari semua ID workflow:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Dengan kata lain, jumlah keterampilan/perintah bergantung pada profil dan pengiriman, bukan tetap.

## Nama Keterampilan yang Dihasilkan

Saat dipilih oleh konfigurasi profil/workflow, OpenSpec menghasilkan keterampilan berikut:

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

Lihat [Perintah](commands.md) untuk perilaku perintah dan [CLI](cli.md) untuk opsi `init`/`update`.

## Terkait

- [Referensi CLI](cli.md) — Perintah terminal
- [Perintah](commands.md) — Perintah garis miring dan keterampilan
- [Memulai](getting-started.md) — Pengaturan pertama kali