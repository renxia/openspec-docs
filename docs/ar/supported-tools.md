# الأدوات المدعومة

يعمل OpenSpec مع العديد من مساعدي البرمجة بالذكاء الاصطناعي. عند تشغيل `openspec init`، يقوم OpenSpec بتكوين الأدوات المحددة باستخدام تحديد ملف التعريف/سير العمل النشط ووضع التسليم.

## آلية العمل

لكل أداة مختارة، يمكن لـ OpenSpec تثبيت:

1. **المهارات** (إذا كان التسليم يتضمن مهارات): `.../skills/openspec-*/SKILL.md`
2. **الأوامر** (إذا كان التسليم يتضمن أوامر): ملفات أوامر محددة للأداة `opsx-*`

Codex هو مهارات فقط: يقوم OpenSpec بتثبيت `.codex/skills/openspec-*/SKILL.md` لـ Codex حتى عند تعيين التسليم على `commands`، ولا يقوم بإنشاء ملفات موجهات مخصصة لـ Codex.

بشكل افتراضي، يستخدم OpenSpec ملف التعريف `core`، الذي يتضمن:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

يمكنك تمكين سير العمل الموسعة (`new`، `continue`، `ff`، `verify`، `bulk-archive`، `onboard`) عبر `openspec config profile`، ثم تشغيل `openspec update`.

## مرجع دليل الأدوات

| الأداة (المعرف) | نمط مسار المهارات | نمط مسار الأوامر |
|----------------|-------------------|-------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | غير مُنشأ (لا يوجد محول أوامر؛ استخدم استدعاءات `/openspec-*` القائمة على المهارات) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | غير مُنشأ (مهارات فقط؛ استخدم `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | غير مُنشأ (لا يوجد محول أوامر؛ استخدم استدعاءات `/openspec-*` القائمة على المهارات) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | غير مُنشأ (لا يوجد محول أوامر؛ استخدم استدعاءات `/openspec-*` القائمة على المهارات) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | غير مُنشأ (لا يوجد محول أوامر؛ استخدم استدعاءات `/skill:openspec-*` القائمة على المهارات) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | غير مُنشأ (لا يوجد محول أوامر؛ استخدم استدعاءات `/openspec-*` القائمة على المهارات) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* يتم التعرف على ملفات موجهات GitHub Copilot كأوامر مائلة مخصصة في امتدادات IDE (VS Code، JetBrains، Visual Studio). لا يستهلك Copilot CLI حاليًا ملفات `.github/prompts/*.prompt.md` مباشرة.

\*\*\* يقوم Hermes بتحميل المهارات من `~/.hermes/skills/` بشكل افتراضي. لاستخدام مهارات OpenSpec المحلية للمشروع، أضف دليل المشروع `.hermes/skills/` إلى `skills.external_dirs` في `~/.hermes/config.yaml`؛ ثم يعرض Hermes المهارات باستدعاءات مائلة موجهة للمستخدم مثل `/openspec-propose`.

## الإعداد غير التفاعلي

لإعداد CI/CD أو الإعداد النصي، استخدم `--tools` (واختياريًا `--profile`):

```bash
# Configure specific tools
openspec init --tools claude,cursor

# Configure all supported tools
openspec init --tools all

# Skip tool configuration
openspec init --tools none

# Override profile for this init run
openspec init --profile core
```

**معرفات الأدوات المتاحة (`--tools`):** `amazon-q`، `antigravity`، `auggie`، `bob`، `claude`، `cline`، `codeartsagent`، `codex`، `forgecode`، `codebuddy`، `continue`، `costrict`، `crush`، `cursor`، `factory`، `gemini`، `github-copilot`، `hermes`، `iflow`، `junie`، `kilocode`، `kimi`، `kiro`، `lingma`، `vibe`، `oh-my-pi`، `opencode`، `pi`، `qoder`، `qwen`، `roocode`، `trae`، `windsurf`، `zcode`

## التثبيت المعتمد على سير العمل

يقوم OpenSpec بتثبيت منتجات سير العمل بناءً على سير العمل المحدد:

- **ملف التعريف الأساسي (افتراضي):** `propose`، `explore`، `apply`، `sync`، `archive`
- **تحديد مخصص:** أي مجموعة فرعية من جميع معرفات سير العمل:
  `propose`، `explore`، `new`، `continue`، `apply`، `ff`، `sync`، `archive`، `bulk-archive`، `verify`، `onboard`

بعبارة أخرى، تعتمد أعداد المهارات/الأوامر على ملف التعريف ووضع التسليم، وليست ثابتة.

## أسماء المهارات المُنشأة

عند تحديدها من خلال تكوين ملف التعريف/سير العمل، ينشئ OpenSpec هذه المهارات:

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

راجع [الأوامر](commands.md) لسلوك الأوامر و [CLI](cli.md) لخيارات `init`/`update`.

## ذات صلة

- [مرجع CLI](cli.md) — أوامر الطرفية
- [الأوامر](commands.md) — الأوامر المائلة والمهارات
- [البدء](getting-started.md) — الإعداد لأول مرة