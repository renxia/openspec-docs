# Alat yang Didukung

OpenSpec bekerja dengan banyak asisten pengkodean AI. Saat Anda menjalankan `openspec init`, OpenSpec mengonfigurasi alat yang dipilih menggunakan profil/alur kerja aktif dan mode pengiriman Anda.

## Cara Kerja

Untuk setiap alat yang dipilih, OpenSpec dapat menginstal:

1. **Skill** (jika pengiriman mencakup skill): `.../skills/openspec-*/SKILL.md`
2. **Perintah** (jika pengiriman mencakup perintah): file perintah `opsx-*` spesifik alat

Secara default, OpenSpec menggunakan profil `core`, yang mencakup:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Anda dapat mengaktifkan alur kerja yang diperluas (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) melalui `openspec config profile`, lalu jalankan `openspec update`.

## Referensi Direktori Alat

| Alat (ID) | Pola jalur skill | Pola jalur perintah |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Tidak dihasilkan (tidak ada adaptor perintah; gunakan pemanggilan berbasis skill `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Tidak dihasilkan (tidak ada adaptor perintah; gunakan pemanggilan berbasis skill `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Tidak dihasilkan (tidak ada adaptor perintah; gunakan pemanggilan berbasis skill `/openspec-*`) |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Tidak dihasilkan (tidak ada adaptor perintah; gunakan pemanggilan berbasis skill `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Perintah Codex diinstal di direktori home global Codex (`$CODEX_HOME/prompts/` jika diatur, jika tidak `~/.codex/prompts/`), bukan di direktori proyek Anda.

\*\* File prompt GitHub Copilot dikenali sebagai perintah slash kustom di ekstensi IDE (VS Code, JetBrains, Visual Studio). Copilot CLI saat ini tidak mengonsumsi `.github/prompts/*.prompt.md` secara langsung.

## Pengaturan Non-Interaktif

Untuk CI/CD atau pengaturan berbasis skrip, gunakan `--tools` (dan opsional `--profile`):

```bash
# Konfigurasi alat tertentu
openspec init --tools claude,cursor

# Konfigurasi semua alat yang didukung
openspec init --tools all

# Lewati konfigurasi alat
openspec init --tools none

# Timpa profil untuk jalankan init ini
openspec init --profile core
```

**ID alat yang tersedia (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `vibe`, `windsurf`

## Instalasi Bergantung Alur Kerja

OpenSpec menginstal artefak alur kerja berdasarkan alur kerja yang dipilih:

- **Profil core (default):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Seleksi kustom:** subset apa pun dari semua ID alur kerja:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Dengan kata lain, jumlah skill/perintah bergantung pada profil dan pengiriman, bukan tetap.

## Nama Skill yang Dihasilkan

Ketika dipilih oleh konfigurasi profil/alur kerja, OpenSpec menghasilkan skill berikut:

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

Lihat [Perintah](commands.md) untuk perilaku perintah dan [CLI](cli.md) untuk opsi `init`/`update`.

## Terkait

- [Referensi CLI](cli.md) — Perintah terminal
- [Perintah](commands.md) — Perintah slash dan skill
- [Memulai](getting-started.md) — Pengaturan pertama kali