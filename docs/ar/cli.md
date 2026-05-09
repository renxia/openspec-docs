# مرجع واجهة سطر الأوامر

يوفر OpenSpec CLI (`openspec`) أوامر الطرفية لإعداد المشروع، والتحقق، وفحص الحالة، والإدارة. تكمل هذه الأوامر أوامر الذكاء الاصطناعي المختصرة (مثل `/opsx:propose`) الموثقة في [الأوامر](commands.md).

## ملخص

| الفئة | الأوامر | الغرض |
|----------|----------|---------|
| **الإعداد** | `init`, `update` | تهيئة وتحديث OpenSpec في مشروعك |
| **مساحات العمل (تجريبي)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | إعداد التخطيط عبر المستودعات أو المجلدات المرتبطة |
| **التصفح** | `list`, `view`, `show` | استكشاف التغييرات والمواصفات |
| **التحقق** | `validate` | التحقق من التغييرات والمواصفات بحثًا عن مشكلات |
| **دورة الحياة** | `archive` | إنهاء التغييرات المكتملة |
| **سير العمل** | `status`, `instructions`, `templates`, `schemas` | دعم سير العمل القائم على المصنفات |
| **المخططات** | `schema init`, `schema fork`, `schema validate`, `schema which` | إنشاء وإدارة سير عمل مخصص |
| **التكوين** | `config` | عرض الإعدادات وتعديلها |
| **الأدوات المساعدة** | `feedback`, `completion` | الملاحظات وتكامل الصدفة |

---

## أوامر البشر مقابل الوكلاء

معظم أوامر واجهة سطر الأوامر مصممة **للاستخدام البشري** في الطرفية. تدعم بعض الأوامر أيضًا **استخدام الوكيل/النص البرمجي** عبر مخرجات JSON.

### الأوامر المخصصة للبشر فقط

هذه الأوامر تفاعلية ومصممة للاستخدام في الطرفية:

| الأمر | الغرض |
|---------|---------|
| `openspec init` | تهيئة المشروع (مطالبات تفاعلية) |
| `openspec view` | لوحة معلومات تفاعلية |
| `openspec config edit` | فتح ملف التكوين في المحرر |
| `openspec feedback` | تقديم ملاحظات عبر GitHub |
| `openspec completion install` | تثبيت إكمالات الشل |

### الأوامر المتوافقة مع الوكلاء

تدعم هذه الأوامر مخرجات `--json` للاستخدام البرمجي بواسطة وكلاء الذكاء الاصطناعي والنصوص البرمجية:

| الأمر | الاستخدام البشري | استخدام الوكيل |
|---------|-----------|-----------|
| `openspec list` | تصفح التغييرات/المواصفات | `--json` للبيانات المهيكلة |
| `openspec show <item>` | قراءة المحتوى | `--json` للتحليل |
| `openspec validate` | التحقق من المشكلات | `--all --json` للتحقق المجمّع |
| `openspec status` | رؤية تقدم المخرجات | `--json` للحالة المهيكلة |
| `openspec instructions` | الحصول على الخطوات التالية | `--json` لتعليمات الوكيل |
| `openspec templates` | إيجاد مسارات القوالب | `--json` لحل المسارات |
| `openspec schemas` | سرد المخططات المتاحة | `--json` لاكتشاف المخططات |
| `openspec workspace setup --no-interactive` | إنشاء مساحة عمل بمدخلات صريحة | `--json` لمخرجات الإعداد المهيكلة |
| `openspec workspace list` | تصفح مساحات العمل المعروفة | `--json` لكائنات مساحات العمل المصنفة |
| `openspec workspace link` | ربط مستودع أو مجلد | `--json` لمخرجات الربط المهيكلة |
| `openspec workspace relink` | إصلاح مسار مرتبط | `--json` لمخرجات الربط المهيكلة |
| `openspec workspace doctor` | فحص مساحة عمل واحدة | `--json` لمخرجات الحالة المهيكلة |

---

## الخيارات العامة

تعمل هذه الخيارات مع جميع الأوامر:

| الخيار | الوصف |
|--------|-------------|
| `--version`, `-V` | إظهار رقم الإصدار |
| `--no-color` | تعطيل مخرجات الألوان |
| `--help`, `-h` | عرض المساعدة للأمر |

---

## أوامر الإعداد

### `openspec init`

تهيئة OpenSpec في مشروعك. ينشئ هيكل المجلدات ويُكوّن تكاملات أدوات الذكاء الاصطناعي.

السلوك الافتراضي يستخدم إعدادات التكوين العامة الافتراضية: الملف الشخصي `core`، التسليم `both`، سير العمل `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `path` | لا | الدليل المستهدف (الافتراضي: الدليل الحالي) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--tools <list>` | تكوين أدوات الذكاء الاصطناعي بشكل غير تفاعلي. استخدم `all`، `none`، أو قائمة مفصولة بفواصل |
| `--force` | التنظيف التلقائي للملفات القديمة دون مطالبة |
| `--profile <profile>` | تجاوز الملف الشخصي العام لهذا التشغيل (`core` أو `custom`) |

`--profile custom` يستخدم أي سير عمل محدد حاليًا في التكوين العام (`openspec config profile`).

**معرّفات الأدوات المدعومة (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**أمثلة:**

```bash
# التهيئة التفاعلية
openspec init

# التهيئة في دليل محدد
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

**ما يُنشئه:**

```
openspec/
├── specs/              # مواصفاتك (مصدر الحقيقة)
├── changes/            # التغييرات المقترحة
└── config.yaml         # تكوين المشروع

.claude/skills/         # مهارات Claude Code (إذا تم اختيار claude)
.cursor/skills/         # مهارات Cursor (إذا تم اختيار cursor)
.cursor/commands/       # أوامر OPSX لـ Cursor (إذا كان التسليم يتضمن أوامر)
... (تكوينات أدوات أخرى)
```

---

### `openspec update`

تحديث ملفات تعليمات OpenSpec بعد ترقية واجهة سطر الأوامر. يُعيد إنشاء ملفات تكوين أدوات الذكاء الاصطناعي باستخدام ملفك الشخصي العام الحالي، وسير العمل المحدد، ووضع التسليم.

```
openspec update [path] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `path` | لا | الدليل المستهدف (الافتراضي: الدليل الحالي) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--force` | فرض التحديث حتى عندما تكون الملفات محدّثة |

**مثال:**

```bash
# تحديث ملفات التعليمات بعد ترقية npm
npm update @fission-ai/openspec
openspec update
```

---

## أوامر مساحات العمل

أوامر مساحات العمل قيد التطوير النشط وليست جاهزة للاستخدام بعد. لا تبنِ أتمتة خارجية، أو تكاملات، أو سير عمل طويل الأمد فوق سطح هذا الأمر؛ يمكن أن تتغير سلوك الأوامر، وملفات الحالة، ومخرجات JSON في أي لحظة.

مساحات العمل التنسيقية هي أماكن تخطيط للعمل الذي يمتد عبر مستودعات أو مجلدات متعددة. رؤية مساحة العمل لا تعني الالتزام بالتغيير: اربط المستودعات أو المجلدات التي يجب أن يعرفها OpenSpec، ثم أنشئ التغييرات عندما تكون مستعدًا لتخطيط عمل محدد.

### `openspec workspace setup`

إنشاء مساحة عمل في موقع مساحة العمل القياسي لـ OpenSpec وربط مستودع أو مجلد موجود واحد على الأقل.

```bash
openspec workspace setup [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--name <name>` | اسم مساحة العمل. يجب أن تكون الأسماء بتنسيق kebab-case |
| `--link <path>` | ربط مستودع أو مجلد موجود واستنتاج اسم الربط من اسم المجلد |
| `--link <name>=<path>` | ربط مستودع أو مجلد موجود باسم ربط صريح |
| `--opener <id>` | تخزين أداة فتح مفضلة أثناء الإعداد غير التفاعلي: `codex`، `claude`، `github-copilot`، أو `editor` |
| `--no-interactive` | تعطيل المطالبات؛ يتطلب `--name` و `--link` واحد على الأقل |
| `--json` | مخرجات JSON؛ يتطلب `--no-interactive` |

**أمثلة:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

الإعداد التفاعلي يسأل عن أداة فتح مفضلة ويُخزّنها في حالة مساحة العمل المحلية للجهاز. الإعداد غير التفاعلي يُخزّن أداة فتح مفضلة فقط عند توفير `--opener`؛ وإلا فإن `workspace open` يطالب لاحقًا في الطرفية التفاعلية عند توفر أداة فتح مدعومة، أو يطلب من النصوص البرمجية تمرير `--agent <tool>` أو `--editor`.

### `openspec workspace list`

سرد مساحات العمل المعروفة لـ OpenSpec من السجل المحلي.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

تُظهر القائمة موقع كل مساحة عمل والمستودعات أو المجلدات المرتبطة. يتم الإبلاغ عن سجلات السجل القديمة ولكن لا يتم تغييرها.

### `openspec workspace link`

تسجيل مستودع أو مجلد موجود لمساحة عمل واحدة.

```bash
openspec workspace link [name] <path> [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--workspace <name>` | تحديد مساحة عمل معروفة من السجل المحلي |
| `--json` | مخرجات JSON |
| `--no-interactive` | تعطيل مطالبات اختيار مساحة العمل |

**أمثلة:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

يجب أن يكون المسار موجودًا بالفعل. يتم حل المسارات النسبية بالنسبة للدليل الحالي للأمر قبل أن يُخزّن OpenSpec المسار المطلق المُتحقق منه في حالة مساحة العمل المحلية للجهاز. يمكن أن تكون المسارات المرتبطة مستودعات كاملة، أو حزمًا، أو خدمات، أو تطبيقات، أو مجلدات بدون حالة `openspec/` محلية للمستودع.

### `openspec workspace relink`

إصلاح أو تغيير المسار المحلي لربط موجود.

```bash
openspec workspace relink <name> <path> [options]
```

يجب أن يكون المسار موجودًا بالفعل. يُحدّث relink فقط المسار المحلي للجهاز لاسم الربط المستقر.

### `openspec workspace doctor`

فحص ما يمكن لمساحة عمل واحدة حله على الجهاز الحالي.

```bash
openspec workspace doctor [options]
```

يُظهر Doctor موقع مساحة العمل، مسار التخطيط، المستودعات أو المجلدات المرتبطة، المسارات المفقودة، مسارات المواصفات المحلية للمستودع عند وجودها، والإصلاحات المقترحة. يُبلّغ عن المشكلات فقط؛ لا يقوم بإصلاحها تلقائيًا.

الأوامر التي تحتاج مساحة عمل واحدة تستخدم مساحة العمل الحالية عند التشغيل من داخل مجلد مساحة العمل أو دليل فرعي. من أي مكان آخر، مرر `--workspace <name>`، أو اختر من أداة الاختيار في الطرفية التفاعلية، أو اعتمد على مساحة العمل الوحيدة المعروفة عندما تكون واحدة فقط موجودة. في وضع `--json` أو `--no-interactive`، يفشل الاختيار الغامض مع خطأ حالة مهيكلة ويقترح `--workspace <name>`.

تستخدم استجابات JSON كائنات مصنفة بالإضافة إلى مصفوفات `status`. البيانات الرئيسية توجد في `workspace`، `workspaces`، أو `link`؛ التحذيرات والأخطاء توجد في `status`.

### `openspec workspace open`

فتح مجموعة عمل مساحة العمل عبر أداة الفتح المفضلة المُخزّنة، أو تجاوز وكيل لمرة واحدة، أو وضع محرر VS Code.

```bash
openspec workspace open [name] [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--workspace <name>` | اسم مستعار لاسم مساحة العمل الموضعي |
| `--agent <tool>` | تجاوز وكيل لمرة واحدة: `codex`، `claude`، أو `github-copilot` |
| `--editor` | فتح ملف مساحة عمل VS Code المُصان كمساحة عمل محرر عادية |
| `--no-interactive` | تعطيل مطالبات اختيار مساحة العمل وأداة الفتح |

**أمثلة:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

يستخدم `workspace open` مساحة العمل الحالية عند التشغيل داخل واحدة، ويُختار تلقائيًا مساحة العمل الوحيدة المعروفة عند التشغيل من مكان آخر، ويطلب من المستخدم الاختيار عند وجود مساحات عمل متعددة معروفة. لا يُغيّر `--agent` و `--editor` أداة الفتح المفضلة المُخزّنة. تمرير كلا التجاوزين لأداة الفتح هو خطأ؛ اختر إما `--agent <tool>` أو `--editor`.

يُصان OpenSpec ملف `<workspace-name>.code-workspace` في جذر مساحة العمل لفتحات VS Code و GitHub Copilot-in-VS-Code. هذا الملف محلي للجهاز ويتم تجاهله افتراضيًا بإدخال `.gitignore` محدد لـ `<workspace-name>.code-workspace`، حتى تظل ملفات `*.code-workspace` التي أنشأها المستخدم مؤهلة للتتبع.

تتضمن مساحة عمل VS Code المُصانة جذر التنسيق كـ `.` بالإضافة إلى المستودعات أو المجلدات المرتبطة الصالحة كجذور إضافية. يُعرض VS Code تلك الإدخالات كمساحة عمل متعددة الجذور.

فتح مساحة العمل الجذر يدعم الاستكشاف والتخطيط عبر المستودعات أو المجلدات المرتبطة. يجب أن تبدأ تعديلات التنفيذ فقط بعد طلب صريح من المستخدم وسير عمل تنفيذ OpenSpec عادي.

---

## أوامر التصفية

### `openspec list`

عرض قائمة التغييرات أو المواصفات في مشروعك.

```
openspec list [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--specs` | عرض قائمة المواصفات بدلاً من التغييرات |
| `--changes` | عرض قائمة التغييرات (الافتراضي) |
| `--sort <order>` | الترتيب حسب `recent` (الافتراضي) أو `name` |
| `--json` | الإخراج بتنسيق JSON |

**أمثلة:**

```bash
# عرض جميع التغييرات النشطة
openspec list

# عرض جميع المواصفات
openspec list --specs

# إخراج JSON للنصوص البرمجية
openspec list --json
```

**الإخراج (نص):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

عرض لوحة معلومات تفاعلية لاستكشاف المواصفات والتغييرات.

```
openspec view
```

يفتح واجهة تعتمد على الطرفية للتنقل بين مواصفات مشروعك وتغييراته.

---

### `openspec show`

عرض تفاصيل تغيير أو مواصفة.

```
openspec show [item-name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `item-name` | لا | اسم التغيير أو المواصفة (يُطلب إدخاله إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--type <type>` | تحديد النوع: `change` أو `spec` (يُكتشف تلقائيًا إذا كان غير غامض) |
| `--json` | الإخراج بتنسيق JSON |
| `--no-interactive` | تعطيل المطالبات |

**خيارات خاصة بالتغييرات:**

| الخيار | الوصف |
|--------|-------------|
| `--deltas-only` | عرض مواصفات الدلتا فقط (وضع JSON) |

**خيارات خاصة بالمواصفات:**

| الخيار | الوصف |
|--------|-------------|
| `--requirements` | عرض المتطلبات فقط، باستثناء السيناريوهات (وضع JSON) |
| `--no-scenarios` | استبعاد محتوى السيناريو (وضع JSON) |
| `-r, --requirement <id>` | عرض متطلب محدد حسب الفهرس القائم على 1 (وضع JSON) |

**أمثلة:**

```bash
# تحديد تفاعلي
openspec show

# عرض تغيير محدد
openspec show add-dark-mode

# عرض مواصفة محددة
openspec show auth --type spec

# إخراج JSON للتحليل
openspec show add-dark-mode --json
```

---

## أوامر التحقق من الصحة

### `openspec validate`

التحقق من صحة التغييرات والمواصفات من حيث البنية.

```
openspec validate [item-name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `item-name` | لا | العنصر المحدد للتحقق من صحته (يُطلب إدخاله إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--all` | التحقق من صحة جميع التغييرات والمواصفات |
| `--changes` | التحقق من صحة جميع التغييرات |
| `--specs` | التحقق من صحة جميع المواصفات |
| `--type <type>` | تحديد النوع عندما يكون الاسم غامضًا: `change` أو `spec` |
| `--strict` | تفعيل وضع التحقق الصارم |
| `--json` | الإخراج بتنسيق JSON |
| `--concurrency <n>` | أقصى عدد عمليات تحقق متوازية (الافتراضي: 6، أو متغير البيئة `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | تعطيل المطالبات |

**أمثلة:**

```bash
# تحقق تفاعلي
openspec validate

# التحقق من تغيير محدد
openspec validate add-dark-mode

# التحقق من جميع التغييرات
openspec validate --changes

# التحقق من كل شيء مع إخراج JSON (للتكامل المستمر/النصوص البرمجية)
openspec validate --all --json

# تحقق صارم مع زيادة التوازي
openspec validate --all --strict --concurrency 12
```

**الإخراج (نص):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
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

أرشفة تغيير مكتمل ودمج مواصفات الدلتا في المواصفات الرئيسية.

```
openspec archive [change-name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | التغيير المراد أرشفته (يتم المطالبة به إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `-y, --yes` | تخطي مطالبات التأكيد |
| `--skip-specs` | تخطي تحديثات المواصفات (لتغييرات البنية التحتية/الأدوات/التوثيق فقط) |
| `--no-validate` | تخطي التحقق (يتطلب تأكيدًا) |

**أمثلة:**

```bash
# أرشفة تفاعلية
openspec archive

# أرشفة تغيير محدد
openspec archive add-dark-mode

# أرشفة بدون مطالبات (CI/scripts)
openspec archive add-dark-mode --yes

# أرشفة تغيير في الأدوات لا يؤثر على المواصفات
openspec archive update-ci-config --skip-specs
```

**ما يفعله:**

1. يتحقق من التغيير (ما لم يتم استخدام `--no-validate`)
2. يطلب التأكيد (ما لم يتم استخدام `--yes`)
3. يدمج مواصفات الدلتا في `openspec/specs/`
4. ينقل مجلد التغيير إلى `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## أوامر سير العمل

تدعم هذه الأوامر سير عمل OPSX المُدار بالعناصر. وهي مفيدة لكل من البشر الذين يتحققون من التقدم والوكلاء الذين يحددون الخطوات التالية.

### `openspec status`

عرض حالة اكتمال العناصر لتغيير معين.

```
openspec status [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--change <id>` | اسم التغيير (يتم المطالبة به إذا تم حذفه) |
| `--schema <name>` | تجاوز المخطط (يتم اكتشافه تلقائيًا من تكوين التغيير) |
| `--json` | الإخراج كـ JSON |

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
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
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

الحصول على تعليمات مُحسَّنة لإنشاء عنصر أو تطبيق المهام. تُستخدم من قبل وكلاء الذكاء الاصطناعي لفهم ما يجب إنشاؤه بعد ذلك.

```
openspec instructions [artifact] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `artifact` | لا | معرّف العنصر: `proposal`، `specs`، `design`، `tasks`، أو `apply` |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--change <id>` | اسم التغيير (مطلوب في الوضع غير التفاعلي) |
| `--schema <name>` | تجاوز المخطط |
| `--json` | الإخراج كـ JSON |

**حالة خاصة:** استخدم `apply` كعنصر للحصول على تعليمات تنفيذ المهام.

**أمثلة:**

```bash
# الحصول على تعليمات العنصر التالي
openspec instructions --change add-dark-mode

# الحصول على تعليمات عنصر محدد
openspec instructions design --change add-dark-mode

# الحصول على تعليمات التطبيق/التنفيذ
openspec instructions apply --change add-dark-mode

# JSON لاستهلاك الوكيل
openspec instructions design --change add-dark-mode --json
```

**يتضمن الإخراج:**

- محتوى القالب للعنصر
- سياق المشروع من التكوين
- محتوى من عناصر التبعية
- قواعد لكل عنصر من التكوين

---

### `openspec templates`

عرض مسارات القوالب المُحلَّلة لجميع العناصر في مخطط.

```
openspec templates [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--schema <name>` | المخطط المراد فحصه (الافتراضي: `spec-driven`) |
| `--json` | الإخراج كـ JSON |

**أمثلة:**

```bash
# عرض مسارات القوالب للمخطط الافتراضي
openspec templates

# عرض القوالب لمخطط مخصص
openspec templates --schema my-workflow

# JSON للاستخدام البرمجي
openspec templates --json
```

**الإخراج (نص):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

سرد مخططات سير العمل المتاحة مع أوصافها وتدفقات العناصر.

```
openspec schemas [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--json` | الإخراج كـ JSON |

**مثال:**

```bash
openspec schemas
```

**الإخراج:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## أوامر المخططات

أوامر لإنشاء وإدارة مخططات سير عمل مخصصة.

### `openspec schema init`

إنشاء مخطط محلي جديد للمشروع.

```
openspec schema init <name> [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `name` | نعم | اسم المخطط (kebab-case) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--description <text>` | وصف المخطط |
| `--artifacts <list>` | معرّفات العناصر مفصولة بفواصل (الافتراضي: `proposal,specs,design,tasks`) |
| `--default` | تعيين كمخطط افتراضي للمشروع |
| `--no-default` | عدم المطالبة بالتعيين كافتراضي |
| `--force` | الكتابة فوق المخطط الموجود |
| `--json` | الإخراج كـ JSON |

**أمثلة:**

```bash
# إنشاء مخطط تفاعلي
openspec schema init research-first

# غير تفاعلي مع عناصر محددة
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**ما يُنشئه:**

```
openspec/schemas/<name>/
├── schema.yaml           # تعريف المخطط
└── templates/
    ├── proposal.md       # قالب لكل عنصر
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
| `--json` | الإخراج كـ JSON |

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
| `name` | لا | المخطط المراد التحقق منه (يتحقق من الكل إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--verbose` | عرض خطوات التحقق التفصيلية |
| `--json` | الإخراج كـ JSON |

**مثال:**

```bash
# التحقق من مخطط محدد
openspec schema validate my-workflow

# التحقق من جميع المخططات
openspec schema validate
```

---

### `openspec schema which`

عرض مصدر تحليل المخطط (مفيد لتصحيح أخطاء الأولوية).

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
| `--json` | الإخراج كـ JSON |

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

## أوامر التكوين

### `openspec config`

عرض وتعديل التكوين العام لـ OpenSpec.

```
openspec config <subcommand> [options]
```

**الأوامر الفرعية:**

| الأمر الفرعي | الوصف |
|------------|-------------|
| `path` | عرض موقع ملف التكوين |
| `list` | عرض جميع الإعدادات الحالية |
| `get <key>` | الحصول على قيمة محددة |
| `set <key> <value>` | تعيين قيمة |
| `unset <key>` | إزالة مفتاح |
| `reset` | إعادة التعيين إلى الإعدادات الافتراضية |
| `edit` | الفتح في `$EDITOR` |
| `profile [preset]` | تكوين ملف تعريف سير العمل بشكل تفاعلي أو عبر إعداد مسبق |

**أمثلة:**

```bash
# عرض مسار ملف التكوين
openspec config path

# عرض جميع الإعدادات
openspec config list

# الحصول على قيمة محددة
openspec config get telemetry.enabled

# تعيين قيمة
openspec config set telemetry.enabled false

# تعيين قيمة نصية بشكل صريح
openspec config set user.name "My Name" --string

# إزالة إعداد مخصص
openspec config unset user.name

# إعادة تعيين جميع التكوينات
openspec config reset --all --yes

# تحرير التكوين في المحرر
openspec config edit

# تكوين الملف الشخصي باستخدام معالج قائم على الإجراءات
openspec config profile

# الإعداد المسبق السريع: تبديل سير العمل إلى الأساسي (يحافظ على وضع التسليم)
openspec config profile core
```

يبدأ `openspec config profile` بملخص للحالة الحالية، ثم يتيح لك الاختيار:
- تغيير التسليم + سير العمل
- تغيير التسليم فقط
- تغيير سير العمل فقط
- الإبقاء على الإعدادات الحالية (خروج)

إذا أبقيت على الإعدادات الحالية، فلن يتم كتابة أي تغييرات ولن يتم عرض مطالبة بالتحديث.
إذا لم تكن هناك تغييرات في التكوين ولكن كانت ملفات المشروع الحالية غير متزامنة مع ملفك الشخصي/التسليم العام، فسيعرض OpenSpec تحذيرًا ويقترح تشغيل `openspec update`.
يضغط `Ctrl+C` أيضًا لإلغاء التدفق بشكل نظيف (بدون تتبع المكدس) والخروج بالرمز `130`.
في قائمة التحقق من سير العمل، يشير `[x]` إلى أن سير العمل محدد في التكوين العام. لتطبيق هذه التحديدات على ملفات المشروع، قم بتشغيل `openspec update` (أو اختر `تطبيق التغييرات على هذا المشروع الآن؟` عند المطالبة داخل مشروع).

**أمثلة تفاعلية:**

```bash
# تحديث التسليم فقط
openspec config profile
# اختر: تغيير التسليم فقط
# اختر التسليم: المهارات فقط

# تحديث سير العمل فقط
openspec config profile
# اختر: تغيير سير العمل فقط
# قم بتبديل سير العمل في قائمة التحقق، ثم أكد
```

---

## أوامر المساعدة

### `openspec feedback`

إرسال ملاحظات حول OpenSpec. ينشئ مشكلة GitHub.

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
| `--body <text>` | وصف مفصل |

**المتطلبات:** يجب تثبيت GitHub CLI (`gh`) والمصادقة عليه.

**مثال:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

إدارة إكمالات Shell لواجهة سطر أوامر OpenSpec.

```
openspec completion <subcommand> [shell]
```

**الأوامر الفرعية:**

| الأمر الفرعي | الوصف |
|------------|-------------|
| `generate [shell]` | إخراج سكريبت الإكمال إلى stdout |
| `install [shell]` | تثبيت الإكمال لـ shell الخاص بك |
| `uninstall [shell]` | إزالة الإكمالات المثبتة |

**Shells المدعومة:** `bash`، `zsh`، `fish`، `powershell`

**أمثلة:**

```bash
# تثبيت الإكمالات (يكتشف shell تلقائيًا)
openspec completion install

# التثبيت لـ shell محدد
openspec completion install zsh

# إنشاء سكريبت للتثبيت اليدوي
openspec completion generate bash > ~/.bash_completion.d/openspec

# إلغاء التثبيت
openspec completion uninstall
```

---

## أكواد الخروج

| الكود | المعنى |
|------|---------|
| `0` | نجاح |
| `1` | خطأ (فشل التحقق، ملفات مفقودة، إلخ.) |

---

## متغيرات البيئة

| المتغير | الوصف |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | اضبط على `0` لتعطيل التتبع |
| `DO_NOT_TRACK` | اضبط على `1` لتعطيل التتبع (إشارة DNT قياسية) |
| `OPENSPEC_CONCURRENCY` | التزامن الافتراضي للتحقق بالجملة (الافتراضي: 6) |
| `EDITOR` أو `VISUAL` | المحرر لـ `openspec config edit` |
| `NO_COLOR` | تعطيل مخرجات الألوان عند التعيين |

---

## التوثيق ذي الصلة

- [الأوامر](commands.md) - أوامر AI slash (`/opsx:propose`، `/opsx:apply`، إلخ.)
- [سير العمل](workflows.md) - الأنماط الشائعة ومتى يتم استخدام كل أمر
- [التخصيص](customization.md) - إنشاء مخططات وقوالب مخصصة
- [البدء](getting-started.md) - دليل الإعداد الأولي