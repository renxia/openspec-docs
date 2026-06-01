# الأدوات المدعومة

يعمل OpenSpec مع العديد من مساعدات البرمجة بالذكاء الاصطناعي. عند تشغيل `openspec init`، يقوم OpenSpec بتهيئة الأدوات المحددة باستخدام ملفك الشخصي/سير العمل النشط ووضع التسليم.

## كيف يعمل

لكل أداة محددة، يمكن لـ OpenSpec تثبيت:

1. **المهارات** (إذا كان التسليم يتضمن مهارات): `.../skills/openspec-*/SKILL.md`
2. **الأوامر** (إذا كان التسليم يتضمن أوامر): ملفات أوامر `opsx-*` الخاصة بالأداة

افتراضيًا، يستخدم OpenSpec الملف الشخصي `core`، والذي يتضمن:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

يمكنك تمكين سير العمل الموسع (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) عبر `openspec config profile`، ثم تشغيل `openspec update`.

## مرجع دليل الأدوات

| الأداة (المعرف) | نمط مسار المهارات | نمط مسار الأوامر |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | غير مُنشأ (لا يوجد محول أوامر؛ استخدم الاستدعاءات القائمة على المهارات `/openspec-*`) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | غير مُنشأ (لا يوجد محول أوامر؛ استخدم الاستدعاءات القائمة على المهارات `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | غير مُنشأ (لا يوجد محول أوامر؛ استخدم الاستدعاءات القائمة على المهارات `/openspec-*`) |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | غير مُنشأ (لا يوجد محول أوامر؛ استخدم الاستدعاءات القائمة على المهارات `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* يتم تثبيت أوامر Codex في الدليل الرئيسي العام لـ Codex (`$CODEX_HOME/prompts/` إذا كان مضبوطًا، وإلا `~/.codex/prompts/`)، وليس في دليل مشروعك.

\*\* يتم التعرف على ملفات GitHub Copilot كمشروعة أوامر شرطة مخصصة في إضافات بيئة التطوير المتكاملة (VS Code, JetBrains, Visual Studio). لا يستهلك Copilot CLI حاليًا ملفات `.github/prompts/*.prompt.md` مباشرة.

## الإعداد غير التفاعلي

لبيئات CI/CD أو الإعداد البرمجي، استخدم `--tools` (واختياريًا `--profile`):

```bash
# تهيئة أدوات محددة
openspec init --tools claude,cursor

# تهيئة جميع الأدوات المدعومة
openspec init --tools all

# تخطي تهيئة الأدوات
openspec init --tools none

# تجاوز الملف الشخصي لتشغيل التهيئة هذا
openspec init --profile core
```

**معرفات الأدوات المتاحة (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `vibe`, `windsurf`

## التثبيت المعتمد على سير العمل

يقوم OpenSpec بتثبيت مكونات سير العمل بناءً على سير العمل المحدد:

- **الملف الشخصي الأساسي (افتراضي):** `propose`, `explore`, `apply`, `sync`, `archive`
- **اختيار مخصص:** أي مجموعة فرعية من جميع معرفات سير العمل:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

بمعنى آخر، أعداد المهارات/الأوامر تعتمد على الملف الشخصي والتسليم، وليست ثابتة.

## أسماء المهارات المُنشأة

عند تحديدها بواسطة إعداد الملف الشخصي/سير العمل، يقوم OpenSpec بإنشاء هذه المهارات:

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

راجع [الأوامر](commands.md) لسلوك الأوامر و[واجهة سطر الأوامر](cli.md) لخيارات `init`/`update`.

## ذات صلة

- [مرجع واجهة سطر الأوامر](cli.md) — أوامر الطرفية
- [الأوامر](commands.md) — أوامر الشرطة المائلة والمهارات
- [البدء](getting-started.md) — الإعداد لأول مرة