# Desteklenen Araçlar

OpenSpec, birçok AI kod asistanı ile çalışır. `openspec init` komutunu çalıştırdığınızda, OpenSpec seçili araçları aktif profiliniz/iş akışınız seçimi ve teslimat modunuza göre yapılandırır.

## Nasıl Çalışır

Her seçili araç için OpenSpec şunları yükleyebilir:

1. **Beceriler** (teslimat becerileri içeriyorsa): `.../skills/openspec-*/SKILL.md`
2. **Komutlar** (teslimat komutları içeriyorsa): araca özel `opsx-*` komut dosyaları

Codex yalnızca becerileri destekler: OpenSpec, teslimat `commands` olarak ayarlanmış olsa bile Codex için `.codex/skills/openspec-*/SKILL.md` dosyalarını yükler ve Codex özel prompt dosyaları oluşturmaz.

Varsayılan olarak OpenSpec, şunları içeren `core` profilini kullanır:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Genişletilmiş iş akışlarını (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) `openspec config profile` komutu ile etkinleştirebilir, ardından `openspec update` komutunu çalıştırabilirsiniz.

## Araç Dizini Referansı

| Araç (Kimliği) | Beceri yolu deseni | Komut yolu deseni |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Oluşturulmaz (komut bağdaştırıcısı yok; beceri tabanlı `/openspec-*` çağrılarını kullanın) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | Oluşturulmaz (yalnızca beceriler; `.codex/skills/openspec-*` kullanın) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Oluşturulmaz (komut bağdaştırıcısı yok; beceri tabanlı `/openspec-*` çağrılarını kullanın) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Oluşturulmaz (komut bağdaştırıcısı yok; beceri tabanlı `/openspec-*` çağrılarını kullanın) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Oluşturulmaz (komut bağdaştırıcısı yok; beceri tabanlı `/skill:openspec-*` çağrılarını kullanın) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Oluşturulmaz (komut bağdaştırıcısı yok; beceri tabanlı `/openspec-*` çağrılarını kullanın) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* GitHub Copilot prompt dosyaları, IDE eklentilerinde (VS Code, JetBrains, Visual Studio) özel eğik çizgi komutları olarak tanınır. Copilot CLI şu anda `.github/prompts/*.prompt.md` dosyalarını doğrudan kullanmaz.

\*\*\* Hermes, becerileri varsayılan olarak `~/.hermes/skills/` dizininden yükler. Proje yerel OpenSpec becerilerini kullanmak için, projenin `.hermes/skills/` dizinini `~/.hermes/config.yaml` dosyasındaki `skills.external_dirs` bölümüne ekleyin; Hermes daha sonra becerileri `/openspec-propose` gibi kullanıcıya yönelik eğik çizgi çağrıları ile sunar.

## Etkileşimsiz Kurulum

CI/CD veya komut dosyası ile yapılan kurulumlar için `--tools` (ve isteğe bağlı olarak `--profile`) kullanın:

```bash
# Belirli araçları yapılandır
openspec init --tools claude,cursor

# Tüm desteklenen araçları yapılandır
openspec init --tools all

# Araç yapılandırmasını atla
openspec init --tools none

# Bu init çalıştırması için profili geçersiz kıl
openspec init --profile core
```

**Kullanılabilir araç kimlikleri (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## İş Akışına Bağlı Yükleme

OpenSpec, seçili iş akışlarına göre iş akışı yapıtlarını yükler:

- **Çekirdek profil (varsayılan):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Özel seçim:** tüm iş akışı kimliklerinin herhangi bir alt kümesi:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Başka bir deyişle, beceri/komut sayıları profil ve teslimat moduna bağlıdır, sabit değildir.

## Oluşturulan Beceri İsimleri

Profil/iş akışı yapılandırması tarafından seçildiğinde OpenSpec şu becerileri oluşturur:

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

Komut davranışları için [Komutlar](commands.md) ve `init`/`update` seçenekleri için [CLI](cli.md) belgelerine bakın.

## İlgili Konular

- [CLI Reference](cli.md) — Terminal komutları
- [Commands](commands.md) — Eğik çizgi komutları ve beceriler
- [Getting Started](getting-started.md) — İlk kurulum