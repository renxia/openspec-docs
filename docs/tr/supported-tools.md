# Desteklenen Araçlar

OpenSpec, birçok AI kodlama asistanıyla birlikte çalışır. `openspec init` komutunu çalıştırdığınızda OpenSpec, aktif profilinizi/iş akışı seçiminizi ve teslim modunu kullanarak seçili araçları yapılandırır.

## Nasıl Çalışır

Her seçili araç için OpenSpec şunları kurabilir:

1. **Yetenekler** (teslim yetenekleri içeriyorsa): `.../skills/openspec-*/SKILL.md`
2. **Komutlar** (teslim komutları içeriyorsa): araça özgü `opsx-*` komut dosyaları

Varsayılan olarak OpenSpec `core` profilini kullanır ve bu profil şunları içerir:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

`openspec config profile` aracılığıyla genişletilmiş iş akışlarını (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) etkinleştirebilir, ardından `openspec update` komutunu çalıştırabilirsiniz.

## Araç Dizini Referansı

| Araç (Kimlik) | Yetenek yolu deseni | Komut yolu deseni |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Oluşturulmaz (komut adaptörü yok; yetenek tabanlı `/openspec-*` çağrıları kullanın) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Oluşturulmaz (komut adaptörü yok; yetenek tabanlı `/skill:openspec-*` çağrıları kullanın) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Oluşturulmaz (komut adaptörü yok; yetenek tabanlı `/openspec-*` çağrıları kullanın) |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Oluşturulmaz (komut adaptörü yok; yetenek tabanlı `/openspec-*` çağrıları kullanın) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex komutları, proje dizininizde değil, genel Codex ana dizinine (`$CODEX_HOME/prompts/` ayarlanmışsa, aksi halde `~/.codex/prompts/`) kurulur.

\*\* GitHub Copilot prompt dosyaları, IDE uzantılarında (VS Code, JetBrains, Visual Studio) özel slash komutları olarak tanınır. Copilot CLI şu anda `.github/prompts/*.prompt.md` dosyalarını doğrudan kullanmaz.

## Etkileşimsiz Kurulum

CI/CD veya betik tabanlı kurulum için `--tools` (ve isteğe bağlı olarak `--profile`) kullanın:

```bash
# Belirli araçları yapılandır
openspec init --tools claude,cursor

# Tüm desteklenen araçları yapılandır
openspec init --tools all

# Araç yapılandırmasını atla
openspec init --tools none

# Bu init çalıştırması için profil geçersiz kıl
openspec init --profile core
```

**Kullanılabilir araç kimlikleri (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `vibe`, `windsurf`

## İş Akışına Bağımlı Kurulum

OpenSpec, seçilen iş akışlarına göre iş akışı yapıtlarını kurar:

- **Core profil (varsayılan):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Özel seçim:** tüm iş akışı kimliklerinin herhangi bir alt kümesi:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Başka bir deyişle, yetenek/komut sayıları profile ve teslime bağlıdır, sabit değildir.

## Oluşturulan Yetenek Adları

Profil/iş akışı yapılandırması tarafından seçildiğinde OpenSpec şu yetenekleri oluşturur:

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

Komut davranışı için [Komutlar](commands.md) ve `init`/`update` seçenekleri için [CLI](cli.md) sayfalarına bakın.

## İlgili

- [CLI Referansı](cli.md) — Terminal komutları
- [Komutlar](commands.md) — Slash komutları ve yetenekler
- [Başlarken](getting-started.md) — İlk kurulum