# مرجع واجهة سطر الأوامر

يوفر واجهة سطر أوامر OpenSpec (`openspec`) أوامر طرفية لإعداد المشروع والتحقق منه وفحص الحالة وإدارته. تكمل هذه الأوامر أوامر الشريحة الخاصة بالذكاء الاصطناعي (مثل `/opsx:propose`) الموثقة في قسم [الأوامر](commands.md).

## ملخص

| الفئة | الأوامر | الغرض |
|----------|----------|---------|
| **الإعداد** | `init`, `update` | تهيئة وتحديث OpenSpec في مشروعك |
| **التصفح** | `list`, `view`, `show` | استكشاف التغييرات والمواصفات |
| **التحقق** | `validate` | فحص التغييرات والمواصفات بحثًا عن مشاكل |
| **دورة الحياة** | `archive` | تأكيد التغييرات المكتملة |
| **سير العمل** | `status`, `instructions`, `templates`, `schemas` | دعم سير العمل القائم على المخرجات |
| **المخططات** | `schema init`, `schema fork`, `schema validate`, `schema which` | إنشاء وإدارة سير عمل مخصص |
| **الإعدادات** | `config` | عرض وتعديل الإعدادات |
| **الأدوات المساعدة** | `feedback`, `completion` | تقديم الملاحظات وتكامل وحدة التحكم |

---

## أوامر البشر مقابل الوكلاء

معظم أوامر واجهة سطر الأوامر (CLI) مصممة **لاستخدام البشر** في الطرفية. بعض الأوامر تدعم أيضًا **استخدام الوكيل/السكريبت** عبر الإخراج بصيغة JSON.

### أوامر البشر فقط

هذه الأوامر تفاعلية ومصممة للاستخدام في الطرفية:

| الأمر | الغرض |
|---------|---------|
| `openspec init` | تهيئة المشروع (مطالبات تفاعلية) |
| `openspec view` | لوحة معلومات تفاعلية |
| `openspec config edit` | فتح الإعدادات في محرر |
| `openspec feedback` | إرسال ملاحظات عبر GitHub |
| `openspec completion install` | تثبيت إكمالات الصدفة |

### أوامر متوافقة مع الوكيل

هذه الأوامر تدعم الإخراج `--json` للاستخدام البرمجي من قبل وكلاء الذكاء الاصطناعي والسكريبتات:

| الأمر | استخدام البشر | استخدام الوكيل |
|---------|-----------|-----------|
| `openspec list` | تصفح التغييرات/المواصفات | `--json` للبيانات المهيكلة |
| `openspec show <item>` | قراءة المحتوى | `--json` للتحليل |
| `openspec validate` | التحقق من المشاكل | `--all --json` للتحقق الجماعي |
| `openspec status` | رؤية تقدم المخرجات | `--json` للحالة المهيكلة |
| `openspec instructions` | الحصول على الخطوات التالية | `--json` لتعليمات الوكيل |
| `openspec templates` | العثور على مسارات القوالب | `--json` لتحديد المسارات |
| `openspec schemas` | سرد المخططات المتاحة | `--json` لاكتشاف المخططات |

---

## الخيارات العامة

هذه الخيارات تعمل مع جميع الأوامر:

| الخيار | الوصف |
|--------|-------------|
| `--version`, `-V` | عرض رقم الإصدار |
| `--no-color` | تعطيل الإخراج الملون |
| `--help`, `-h` | عرض المساعدة للأمر |

---

## أوامر الإعداد

### `openspec init`

تهيئة OpenSpec في مشروعك. ينشئ هيكل المجلدات ويقوم بتكوين تكاملات أدوات الذكاء الاصطناعي.

السلوك الافتراضي يستخدم إعدادات الإعدادات العامة الافتراضية: الملف الشخصي `core`، التسليم `both`، سير العمل `propose, explore, apply, archive`.

```
openspec init [path] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `path` | لا | المجلد الهدف (الافتراضي: المجلد الحالي) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--tools <list>` | تكوين أدوات الذكاء الاصطناعي بشكل غير تفاعلي. استخدم `all` أو `none` أو قائمة مفصولة بفواصل |
| `--force` | التنظيف التلقائي للملفات القديمة دون مطالبة |
| `--profile <profile>` | تجاوز الملف الشخصي العام لهذا التشغيل (`core` أو `custom`) |

`--profile custom` يستخدم أي سير عمل محدد حاليًا في الإعدادات العامة (`openspec config profile`).

**معرفات الأدوات المدعومة (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

**أمثلة:**

```bash
# التهيئة التفاعلية
openspec init

# التهيئة في مجلد محدد
openspec init ./my-project

# غير تفاعلي: التكوين لـ Claude و Cursor
openspec init --tools claude,cursor

# التكوين لجميع الأدوات المدعومة
openspec init --tools all

# تجاوز الملف الشخصي لهذا التشغيل
openspec init --profile core

# تخطي المطالبات والتنظيف التلقائي للملفات القديمة
openspec init --force
```

**ما ينشئه:**

```
openspec/
├── specs/              # مواصفاتك (مصدر الحقيقة)
├── changes/            # التغييرات المقترحة
└── config.yaml         # إعدادات المشروع

.claude/skills/         # مهارات Claude Code (إذا تم تحديد claude)
.cursor/skills/         # مهارات Cursor (إذا تم تحديد cursor)
.cursor/commands/       # أوامر Cursor OPSX (إذا تضمن التسليم الأوامر)
... (تكوينات أدوات أخرى)
```

---

### `openspec update`

تحديث ملفات تعليمات OpenSpec بعد ترقية واجهة سطر الأوامر. يعيد إنشاء ملفات تكوين أدوات الذكاء الاصطناعي باستخدام الملف الشخصي العام الحالي، وسير العمل المحدد، ووضع التسليم.

```
openspec update [path] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `path` | لا | المجلد الهدف (الافتراضي: المجلد الحالي) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--force` | فرض التحديث حتى إذا كانت الملفات محدّثة |

**مثال:**

```bash
# تحديث ملفات التعليمات بعد ترقية npm
npm update @fission-ai/openspec
openspec update
```

---

## أوامر التصفح

### `openspec list`

سرد التغييرات أو المواصفات في مشروعك.

```
openspec list [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--specs` | سرد المواصفات بدلاً من التغييرات |
| `--changes` | سرد التغييرات (الافتراضي) |
| `--sort <order>` | الترتيب حسب `recent` (الافتراضي) أو `name` |
| `--json` | الإخراج بصيغة JSON |

**أمثلة:**

```bash
# سرد جميع التغييرات النشطة
openspec list

# سرد جميع المواصفات
openspec list --specs

# إخراج JSON للسكريبتات
openspec list --json
```

**الإخراج (نص):**

```
التغييرات النشطة:
  add-dark-mode     دعم تبديل سمة واجهة المستخدم
  fix-login-bug     معالجة انتهاء جلسة المستخدم
```

---

### `openspec view`

عرض لوحة معلومات تفاعلية لاستكشاف المواصفات والتغييرات.

```
openspec view
```

يفتح واجهة قائمة على الطرفية للتنقل في مواصفات وتغييرات مشروعك.

---

### `openspec show`

عرض تفاصيل تغيير أو مواصفة.

```
openspec show [item-name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `item-name` | لا | اسم التغيير أو المواصفة (يتم المطالبة إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--type <type>` | تحديد النوع: `change` أو `spec` (يتم اكتشافه تلقائيًا إذا لم يكن غامضًا) |
| `--json` | الإخراج بصيغة JSON |
| `--no-interactive` | تعطيل المطالبات |

**خيارات خاصة بالتغيير:**

| الخيار | الوصف |
|--------|-------------|
| `--deltas-only` | عرض مواصفات التغييرات فقط (وضع JSON) |

**خيارات خاصة بالمواصفة:**

| الخيار | الوصف |
|--------|-------------|
| `--requirements` | عرض المتطلبات فقط، باستثناء السيناريوهات (وضع JSON) |
| `--no-scenarios` | باستثناء محتوى السيناريو (وضع JSON) |
| `-r, --requirement <id>` | عرض متطلب محدد حسب الفهرس المبدأ من 1 (وضع JSON) |

**أمثلة:**

```bash
# التحديد التفاعلي
openspec show

# عرض تغيير محدد
openspec show add-dark-mode

# عرض مواصفة محددة
openspec show auth --type spec

# إخراج JSON للتحليل
openspec show add-dark-mode --json
```

---

## أوامر التحقق

### `openspec validate`

التحقق من التغييرات والمواصفات بحثًا عن مشاكل هيكلية.

```
openspec validate [item-name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `item-name` | لا | عنصر محدد للتحقق منه (يتم المطالبة إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--all` | التحقق من جميع التغييرات والمواصفات |
| `--changes` | التحقق من جميع التغييرات |
| `--specs` | التحقق من جميع المواصفات |
| `--type <type>` | تحديد النوع عندما يكون الاسم غامضًا: `change` أو `spec` |
| `--strict` | تمكين وضع التحقق الصارم |
| `--json` | الإخراج بصيغة JSON |
| `--concurrency <n>` | الحد الأقصى للتحقق المتوازي (الافتراضي: 6، أو متغير البيئة `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | تعطيل المطالبات |

**أمثلة:**

```bash
# التحقق التفاعلي
openspec validate

# التحقق من تغيير محدد
openspec validate add-dark-mode

# التحقق من جميع التغييرات
openspec validate --changes

# التحقق من كل شيء مع إخراج JSON (للتكامل المستمر/السكريبتات)
openspec validate --all --json

# التحقق الصارم مع زيادة التوازي
openspec validate --all --strict --concurrency 12
```

**الإخراج (نص):**

```
جارٍ التحقق من add-dark-mode...
  ✓ proposal.md صالح
  ✓ specs/ui/spec.md صالح
  ⚠ design.md: ينقص قسم "النهج التقني"

تم العثور على تحذير واحد
```

**الإخراج (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## أوامر دورة الحياة

### `openspec archive`

أرشفة تغيير مكتمل ودمج مواصفات التغييرات في المواصفات الرئيسية.

```
openspec archive [change-name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | التغيير لأرشفته (يتم المطالبة إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `-y, --yes` | تخطي مطالبات التأكيد |
| `--skip-specs` | تخطي تحديثات المواصفات (لتغييرات البنية التحتية/الأدوات/التوثيق فقط) |
| `--no-validate` | تخطي التحقق (يتطلب تأكيدًا) |

**أمثلة:**

```bash
# الأرشفة التفاعلية
openspec archive

# أرشفة تغيير محدد
openspec archive add-dark-mode

# الأرشفة دون مطالبات (للكامل المستمر/السكريبتات)
openspec archive add-dark-mode --yes

# أرشفة تغيير أداة لا يؤثر على المواصفات
openspec archive update-ci-config --skip-specs
```

**ما يفعله:**

1. التحقق من التغيير (إلا إذا تم استخدام `--no-validate`)
2. المطالبة بالتأكيد (إلا إذا تم استخدام `--yes`)
3. دمج مواصفات التغييرات في `openspec/specs/`
4. نقل مجلد التغيير إلى `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## أوامر سير العمل

هذه الأوامر تدعم سير عمل OPSX المبني على المخرجات. إنها مفيدة لكل من البشر للتحقق من التقدم والوكيل لتحديد الخطوات التالية.

### `openspec status`

عرض حالة اكتمال المخرجات لتغيير.

```
openspec status [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--change <id>` | اسم التغيير (يتم المطالبة إذا تم حذفه) |
| `--schema <name>` | تجاوز المخطط (يتم اكتشافه تلقائيًا من إعدادات التغيير) |
| `--json` | الإخراج بصيغة JSON |

**أمثلة:**

```bash
# فحص الحالة التفاعلي
openspec status

# الحالة لتغيير محدد
openspec status --change add-dark-mode

# JSON لاستخدام الوكيل
openspec status --change add-dark-mode --json
```

**الإخراج (نص):**

```
التغيير: add-dark-mode
المخطط: spec-driven
التقدم: 2/4 مخرجات مكتملة

[x] proposal
[ ] design
[x] specs
[-] tasks (محجوب بواسطة: design)
```

**الإخراج (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

الحصول على تعليمات مُغنية لإنشاء مخرج أو تطبيق المهام. تستخدمها وكلاء الذكاء الاصطناعي لفهم ما يجب إنشاؤه بعد ذلك.

```
openspec instructions [artifact] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `artifact` | لا | معرف المخرج: `proposal`، `specs`، `design`، `tasks`، أو `apply` |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--change <id>` | اسم التغيير (مطلوب في الوضع غير التفاعلي) |
| `--schema <name>` | تجاوز المخطط |
| `--json` | الإخراج بصيغة JSON |

**حالة خاصة:** استخدم `apply` كمخرج للحصول على تعليمات تنفيذ المهام.

**أمثلة:**

```bash
# الحصول على تعليمات المخرج التالي
openspec instructions --change add-dark-mode

# الحصول على تعليمات مخرج محدد
openspec instructions design --change add-dark-mode

# الحصول على تعليمات التطبيق/التنفيذ
openspec instructions apply --change add-dark-mode

# JSON لاستهلاك الوكيل
openspec instructions design --change add-dark-mode --json
```

**يتضمن الإخراج:**

- محتوى القالب للمخرج
- سياق المشروع من الإعدادات
- المحتوى من المخرجات المعتمدة
- قواعد لكل مخرج من الإعدادات

---

### `openspec templates`

عرض مسارات القوالب المحددة لجميع المخرجات في مخطط.

```
openspec templates [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--schema <name>` | المخطط لفحصه (الافتراضي: `spec-driven`) |
| `--json` | الإخراج بصيغة JSON |

**أمثلة:**

```bash
# عرض مسارات القالب للمخطط الافتراضي
openspec templates

# عرض القوالب لمخطط مخصص
openspec templates --schema my-workflow

# JSON للاستخدام البرمجي
openspec templates --json
```

**الإخراج (نص):**

```
المخطط: spec-driven

القوالب:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

سرد مخططات سير العمل المتاحة مع أوصافها وتدفقات المخرجات.

```
openspec schemas [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--json` | الإخراج بصيغة JSON |

**مثال:**

```bash
openspec schemas
```

**الإخراج:**

```
المخططات المتاحة:

  spec-driven (حزمة)
    سير عمل التطوير الافتراضي القائم على المواصفات
    التدفق: proposal → specs → design → tasks

  my-custom (مشروع)
    سير عمل مخصص لهذا المشروع
    التدفق: research → proposal → tasks
```

---

## أوامر المخططات

أوامر لإنشاء وإدارة مخططات سير العمل المخصصة.

### `openspec schema init`

إنشاء مخطط جديد محلي للمشروع.

```
openspec schema init <name> [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `name` | نعم | اسم المخطط (بتنسيق kebab-case) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--description <text>` | وصف المخطط |
| `--artifacts <list>` | قائمة معرفات المخرجات مفصولة بفواصل (الافتراضي: `proposal,specs,design,tasks`) |
| `--default` | تعيينه كمخطط افتراضي للمشروع |
| `--no-default` | عدم طرح السؤال لتعيينه كافتراضي |
| `--force` | الكتابة فوق مخطط موجود |
| `--json` | الإخراج بصيغة JSON |

**أمثلة:**

```bash
# إنشاء مخطط تفاعلي
openspec schema init research-first

# إنشاء غير تفاعلي مع مخرجات محددة
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**ما يتم إنشاؤه:**

```
openspec/schemas/<name>/
├── schema.yaml           # تعريف المخطط
└── templates/
    ├── proposal.md       # قالب لكل مخرج
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

نسخ مخطط موجود إلى مشروعك للتخصيص.

```
openspec schema fork <source> [name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `source` | نعم | المخطط المراد نسخه |
| `name` | لا | اسم المخطط الجديد (الافتراضي: `<source>-custom`) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--force` | الكتابة فوق الوجهة الموجودة |
| `--json` | الإخراج بصيغة JSON |

**مثال:**

```bash
# نسخ مخطط spec-driven المدمج
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

التحقق من هيكل المخطط وقوالبه.

```
openspec schema validate [name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `name` | لا | المخطط المراد التحقق منه (يتحقق من جميع المخططات إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--verbose` | عرض خطوات التحقق التفصيلية |
| `--json` | الإخراج بصيغة JSON |

**مثال:**

```bash
# التحقق من مخطط محدد
openspec schema validate my-workflow

# التحقق من جميع المخططات
openspec schema validate
```

---

### `openspec schema which`

عرض مصدر اشتقاق المخطط (مفيد لتصحيح أولوية الاشتقاق).

```
openspec schema which [name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `name` | لا | اسم المخطط |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--all` | سرد جميع المخططات مع مصادرها |
| `--json` | الإخراج بصيغة JSON |

**مثال:**

```bash
# التحقق من مصدر مخطط
openspec schema which spec-driven
```

**الإخراج:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**أولوية المخططات:**

1. المشروع: `openspec/schemas/<name>/`
2. المستخدم: `~/.local/share/openspec/schemas/<name>/`
3. الحزمة: المخططات المدمجة

---

## أوامر الإعدادات

### `openspec config`

عرض وتعديل إعدادات OpenSpec العامة.

```
openspec config <subcommand> [options]
```

**الأوامر الفرعية:**

| الأمر الفرعي | الوصف |
|------------|-------------|
| `path` | عرض موقع ملف الإعدادات |
| `list` | عرض جميع الإعدادات الحالية |
| `get <key>` | الحصول على قيمة محددة |
| `set <key> <value>` | تعيين قيمة |
| `unset <key>` | إزالة مفتاح |
| `reset` | إعادة التعيين إلى الافتراضيات |
| `edit` | الفتح في `$EDITOR` |
| `profile [preset]` | تكوين ملف تعريف سير العمل تفاعلياً أو عبر إعداد مسبق |

**أمثلة:**

```bash
# عرض مسار ملف الإعدادات
openspec config path

# سرد جميع الإعدادات
openspec config list

# الحصول على قيمة محددة
openspec config get telemetry.enabled

# تعيين قيمة
openspec config set telemetry.enabled false

# تعيين قيمة نصية بشكل صريح
openspec config set user.name "My Name" --string

# إزالة إعداد مخصص
openspec config unset user.name

# إعادة تعيين جميع الإعدادات
openspec config reset --all --yes

# تعديل الإعدادات في محررك
openspec config edit

# تكوين ملف التعريف مع معالج مبني على الإجراءات
openspec config profile

# إعداد مسبق سريع: تبديل سير العمل إلى Core (يحافظ على وضع التسليم)
openspec config profile core
```

`openspec config profile` يبدأ بملخص للحالة الحالية، ثم يتيح لك الاختيار من:
- تغيير التسليم + سير العمل
- تغيير التسليم فقط
- تغيير سير العمل فقط
- الاحتفاظ بالإعدادات الحالية (خروج)

إذا احتفظت بالإعدادات الحالية، لن يتم كتابة أي تغييرات ولن يتم عرض طلب تحديث.
إذا لم تكن هناك تغييرات في الإعدادات ولكن ملفات المشروع الحالية غير متزامنة مع ملف التعريف/التسليم العام الخاص بك، سيعرض OpenSpec تحذيراً ويقترح تشغيل `openspec update`.
يؤدي الضغط على `Ctrl+C` أيضاً إلى إلغاء التدفق بسلاسة (بدون تتبع مكدس) والخروج بالرمز `130`.
في قائمة سير العمل، يشير `[x]` إلى أن سير العمل محدد في الإعدادات العامة. لتطبيق هذه الاختيارات على ملفات المشروع، قم بتشغيل `openspec update` (أو اختر `Apply changes to this project now?` عند السؤال داخل مشروع).

**أمثلة تفاعلية:**

```bash
# تحديث التسليم فقط
openspec config profile
# اختر: Change delivery only
# اختر التسليم: Skills only

# تحديث سير العمل فقط
openspec config profile
# اختر: Change workflows only
# قم بتبديل سير العمل في القائمة، ثم تأكيد
```

---

## أوامر مساعدة

### `openspec feedback`

إرسال ملاحظات حول OpenSpec. ينشئ تذكرة على GitHub.

```
openspec feedback <message> [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `message` | نعم | رسالة الملاحظات |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--body <text>` | وصف تفصيلي |

**المتطلبات:** يجب تثبيت وتوثيق GitHub CLI (`gh`).

**مثال:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

إدارة إكمالات shell لـ OpenSpec CLI.

```
openspec completion <subcommand> [shell]
```

**الأوامر الفرعية:**

| الأمر الفرعي | الوصف |
|------------|-------------|
| `generate [shell]` | إخراج سكربت الإكمال إلى stdout |
| `install [shell]` | تثبيت الإكمال لـ shell الخاص بك |
| `uninstall [shell]` | إزالة الإكمالات المثبتة |

**الأ shells المدعومة:** `bash`, `zsh`, `fish`, `powershell`

**أمثلة:**

```bash
# تثبيت الإكمالات (يكتشف shell تلقائياً)
openspec completion install

# التثبيت لـ shell محدد
openspec completion install zsh

# إنشاء سكربت للتثبيت اليدوي
openspec completion generate bash > ~/.bash_completion.d/openspec

# إلغاء التثبيت
openspec completion uninstall
```

---

## أكواد الخروج

| الرمز | المعنى |
|------|---------|
| `0` | نجاح |
| `1` | خطأ (فشل في التحقق، ملفات مفقودة، إلخ) |

---

## متغيرات البيئة

| المتغير | الوصف |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | اضبط على `0` لتعطيل القياس عن بعد |
| `DO_NOT_TRACK` | اضبط على `1` لإلغاء قياس عن بعد (إشارة DNT قياسية) |
| `OPENSPEC_CONCURRENCY` | التزامن الافتراضي للتحقق بالجملة (الافتراضي: 6) |
| `EDITOR` أو `VISUAL` | المحرر لـ `openspec config edit` |
| `NO_COLOR` | تعطيل الإخراج الملون عند التعيين |

---

## التوثيق ذات الصلة

- [الأوامر](commands.md) - أوامر AI المنقولة (`/opsx:propose`, `/opsx:apply`, إلخ)
- [سير العمل](workflows.md) - الأنماط الشائعة ومتى تستخدم كل أمر
- [التخصيص](customization.md) - إنشاء مخططات وقوالب مخصصة
- [البدء](getting-started.md) - دليل الإعداد الأولي