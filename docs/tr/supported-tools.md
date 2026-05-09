# Desteklenen Araçlar

OpenSpec birçok AI kodlama asistanıyla çalışır. `openspec init` komutunu çalıştırdığınızda OpenSpec, seçilen araçları etkin profil/iş akışı seçiminize ve teslimat modunuza göre yapılandırır.

## Nasıl Çalışır

Seçilen her araç için OpenSpec şunları kurabilir:

1. **Beceriler** (teslimat becerileri içeriyorsa): `.../skills/openspec-*/SKILL.md`
2. **Komutlar** (teslimat komutları içeriyorsa): araca özel `opsx-*` komut dosyaları

Varsayılan olarak OpenSpec, aşağıdakileri içeren `core` profilini kullanır:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

`openspec config profile` aracılığıyla genişletilmiş iş akışlarını (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) etkinleştirebilir, ardından `openspec update` komutunu çalıştırabilirsiniz.

## Araç Dizin Referansı

| Araç (ID) | Beceri yolu deseni | Komut yolu deseni |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Oluşturulmaz (komut adaptörü yok; beceri tabanlı `/openspec-*` çağırmalarını kullanın) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Oluşturulmaz (komut adaptörü yok; beceri tabanlı `/skill:openspec-*` çağırmalarını kullanın) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Oluşturulmaz (komut adaptörü yok; beceri tabanlı `/openspec-*` çağırmalarını kullanın) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex komutları, proje dizininiz yerine global Codex ana dizinine (`$CODEX_HOME/prompts/` ayarlanmışsa, aksi takdirde `~/.codex/prompts/`) kurulur.

\*\* GitHub Copilot istem dosyaları, IDE uzantılarında (VS Code, JetBrains, Visual Studio) özel eğik çizgi komutları olarak tanınır. Copilot CLI şu anda `.github/prompts/*.prompt.md` dosyalarını doğrudan kullanmamaktadır.

## Etkileşim Olmayan Kurulum

CI/CD veya betik tabanlı kurulum için `--tools` (ve isteğe bağlı olarak `--profile`) kullanın:

```bash
# Belirli araçları yapılandırın
openspec init --tools claude,cursor

# Tüm desteklenen araçları yapılandırın
openspec init --tools all

# Araç yapılandırmasını atlayın
openspec init --tools none

# Bu init çalıştırması için profili geçersiz kılın
openspec init --profile core
```

**Mevcut araç ID'leri (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

## İş Akışına Bağımlı Kurulum

OpenSpec, seçilen iş akışlarına göre iş akışı eserlerini kurar:

- **Çekirdek profil (varsayılan):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Özel seçim:** tüm iş akışı ID'lerinin herhangi bir alt kümesi:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Başka bir deyişle, beceri/komut sayıları profile ve teslimata bağlıdır, sabit değildir.

## Oluşturulan Beceri İsimleri

Profil/iş akışı yapılandırması tarafından seçildiğinde OpenSpec şu becerileri oluşturur:

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
- [Komutlar](commands.md) — Eğik çizgi komutları ve beceriler
- [Başlarken](getting-started.md) — İlk kurulum