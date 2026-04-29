# Desteklenen Araçlar

OpenSpec, birçok AI kodlama asistanıyla çalışır. `openspec init` komutunu çalıştırdığınızda OpenSpec, seçili araçları aktif profil/iş akışı seçiminiz ve teslimat modunuz ile yapılandırır.

## Nasıl Çalışır

Her seçili araç için OpenSpec şunları kurabilir:

1. **Yetenekler** (teslimat yetenekleri içeriyorsa): `.../skills/openspec-*/SKILL.md`
2. **Komutlar** (teslimat komutları içeriyorsa): araca özgü `opsx-*` komut dosyaları

Varsayılan olarak OpenSpec, şunları içeren `core` profilini kullanır:
- `propose`
- `explore`
- `apply`
- `archive`

Genişletilmiş iş akışlarını (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`) `openspec config profile` ile etkinleştirebilir, ardından `openspec update` çalıştırabilirsiniz.

## Araç Dizin Referansı

| Araç (ID) | Yetenekler yol deseni | Komut yol deseni |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Üretilmez (komut adaptörü yok; yetenek tabanlı `/openspec-*` çağrılarını kullanın) |
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
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Üretilmez (komut adaptörü yok; yetenek tabanlı `/openspec-*` çağrılarını kullanın) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex komutları, küresel Codex ana dizinine (`$CODEX_HOME/prompts/` ayarlanmışsa, aksi takdirde `~/.codex/prompts/`) değil, proje dizininize kurulmaz.

\*\* GitHub Copilot istem dosyaları, IDE eklentilerinde (VS Code, JetBrains, Visual Studio) özel eğik çizgi komutları olarak tanınır. Copilot CLI şu anda `.github/prompts/*.prompt.md` dosyalarını doğrudan kullanmaz.

## Etkileşimsiz Kurulum

CI/CD veya betikli kurulum için `--tools` (ve isteğe bağlı olarak `--profile`) kullanın:

```bash
# Belirli araçları yapılandırın
openspec init --tools claude,cursor

# Desteklenen tüm araçları yapılandırın
openspec init --tools all

# Araç yapılandırmasını atlayın
openspec init --tools none

# Bu init çalışması için profili geçersiz kılın
openspec init --profile core
```

**Kullanılabilir araç ID'leri (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `forgecode`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## İş Akışına Bağlı Kurulum

OpenSpec, seçilen iş akışlarına göre iş akışı bileşenlerini kurar:

- **Çekirdek profili (varsayılan):** `propose`, `explore`, `apply`, `archive`
- **Özel seçim:** tüm iş akışı ID'lerinin herhangi bir alt kümesi:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Başka bir deyişle, yetenek/komut sayıları profile ve teslimata bağlıdır, sabit değildir.

## Üretilen Yetenek Adları

Profil/iş akışı yapılandırmasıyla seçildiğinde, OpenSpec bu yetenekleri üretir:

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

Komut davranışları için [Komutlar](commands.md) ve `init`/`update` seçenekleri için [CLI](cli.md) bölümüne bakın.

## İlgili

- [CLI Referansı](cli.md) — Terminal komutları
- [Komutlar](commands.md) — Eğik çizgi komutları ve yetenekler
- [Başlangıç](getting-started.md) — İlk kurulum