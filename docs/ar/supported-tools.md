# الأدوات المدعومة

يعمل OpenSpec مع العديد من مساعدي البرمجة بالذكاء الاصطناعي. عند تشغيل `openspec init`، يقوم OpenSpec بتكوين الأدوات المحددة باستخدام ملفك الشخصي/سير العمل النشط ووضع التسليم.

## كيف يعمل

لكل أداة محددة، يمكن لـ OpenSpec تثبيت:

1. **المهارات** (إذا كان التسليم يتضمن مهارات): `.../skills/openspec-*/SKILL.md`
2. **الأوامر** (إذا كان التسليم يتضمن أوامر): ملفات أوامر `opsx-*` الخاصة بكل أداة

بشكل افتراضي، يستخدم OpenSpec الملف الشخصي `core`، الذي يتضمن:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

يمكنك تمكين سير العمل الموسع (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) عبر `openspec config profile`، ثم تشغيل `openspec update`.

## مرجع دليل الأدوات

| الأداة (المعرّف) | نمط مسار المهارات | نمط مسار الأوامر |
|-------------------|-------------------|------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | لا يتم إنشاؤه (لا يوجد محوّل أوامر؛ استخدم استدعاءات `/openspec-*` القائمة على المهارات) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | لا يتم إنشاؤه (لا يوجد محوّل أوامر؛ استخدم استدعاءات `/skill:openspec-*` القائمة على المهارات) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | لا يتم إنشاؤه (لا يوجد محوّل أوامر؛ استخدم استدعاءات `/openspec-*` القائمة على المهارات) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* يتم تثبيت أوامر Codex في الدليل الرئيسي العالمي لـ Codex (`$CODEX_HOME/prompts/` إذا تم تعيينه، وإلا `~/.codex/prompts/`)، وليس في دليل مشروعك.

\*\* يتم التعرف على ملفات موجهات GitHub Copilot كأوامر شرطة مائلة مخصصة في إضافات IDE (VS Code، JetBrains، Visual Studio). لا يستهلك سطر أوامر Copilot حاليًا ملفات `.github/prompts/*.prompt.md` مباشرة.

## الإعداد غير التفاعلي

لـ CI/CD أو الإعداد المبرمج، استخدم `--tools` (واختياريًا `--profile`):

```bash
# تكوين أدوات محددة
openspec init --tools claude,cursor

# تكوين جميع الأدوات المدعومة
openspec init --tools all

# تخطي تكوين الأدوات
openspec init --tools none

# تجاوز الملف الشخصي لهذا التشغيل الأولي
openspec init --profile core
```

**معرّفات الأدوات المتاحة (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

## التثبيت المعتمد على سير العمل

يثبّت OpenSpec عناصر سير العمل بناءً على سير العمل المحدد:

- **الملف الشخصي الأساسي (الافتراضي):** `propose`, `explore`, `apply`, `sync`, `archive`
- **اختيار مخصص:** أي مجموعة فرعية من جميع معرّفات سير العمل:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

بمعنى آخر، تعتمد أعداد المهارات/الأوامر على الملف الشخصي وطريقة التسليم، وليست ثابتة.

## أسماء المهارات المُنشأة

عند تحديدها بواسطة تكوين الملف الشخصي/سير العمل، يُنشئ OpenSpec المهارات التالية:

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

انظر [الأوامر](commands.md) لسلوك الأوامر و[واجهة سطر الأوامر](cli.md) لخيارات `init`/`update`.

## ذات الصلة

- [مرجع واجهة سطر الأوامر](cli.md) — أوامر الطرفية
- [الأوامر](commands.md) — أوامر الشريط المائل والمهارات
- [البدء](getting-started.md) — الإعداد الأولي