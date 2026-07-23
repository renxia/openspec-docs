# مرجع واجهة سطر الأوامر (CLI)

توفر واجهة سطر الأوامر (CLI) الخاصة بـ OpenSpec (`openspec`) أوامر طرفية لإعداد المشاريع والتحقق من صحتها وفحص حالتها وإدارتها. تكمل هذه الأوامر أوامر الشرطة المائلة للذكاء الاصطناعي (مثل `/opsx:propose`) الموثقة في [الأوامر](commands.md).

## ملخص

| الفئة | الأوامر | الغرض |
|----------|----------|---------|
| **الإعداد** | `init`، `update` | تهيئة OpenSpec وتحديثه في مشروعك |
| **المخازن (مستودعات OpenSpec مستقلة)** | `store setup`، `store register`، `store unregister`، `store remove`، `store list`، `store doctor` | إدارة المخازن — وهي مستودعات OpenSpec مستقلة قمت بتسجيلها |
| **الصحة** | `doctor` | الإبلاغ عن حالة العلاقات للجذر الذي تم حله |
| **سياق العمل** | `context` | تجميع مجموعة العمل (الجذر + المخازن المشار إليها) |
| **مجموعات العمل الشخصية** | `workset create`، `workset list`، `workset open`، `workset remove` | الاحتفاظ بآراء العمل الشخصية المحلية وفتحها في أداتك |
| **التصفح** | `list`، `view`، `show` | استكشاف التغييرات والمواصفات |
| **التحقق من الصحة** | `validate` | فحص التغييرات والمواصفات بحثًا عن مشاكل |
| **دورة الحياة** | `archive` | إنهاء التغييرات المكتملة |
| **سير العمل** | `new change`، `status`، `instructions`، `templates`، `schemas` | دعم سير العمل القائم على المخرجات |
| **المخططات** | `schema init`، `schema fork`، `schema validate`، `schema which` | إنشاء سير العمل المخصصة وإدارتها |
| **الإعدادات** | `config` | عرض الإعدادات وتعديلها |
| **الأدوات المساعدة** | `feedback`، `completion` | التغذية الراجعة وتكامل الـ shell |

---

## الأوامر الخاصة بالبشر مقابل الوكلاء

معظم أوامر واجهة سطر الأوامر (CLI) مصممة للاستخدام البشري في المحطة الطرفية (terminal). بعض الأوامر تدعم أيضاً الاستخدام من قبل الوكلاء (الذكاء الاصطناعي/البرامج النصية) عبر إخراج بتنسيق JSON.

### الأوامر المخصصة للبشر فقط

هذه الأوامر تفاعلية ومصممة للاستخدام في المحطة الطرفية:

| الأمر | الغرض |
|-------|-------|
| `openspec init` | تهيئة المشروع (مطالبات تفاعلية) |
| `openspec view` | لوحة تحكم تفاعلية |
| `openspec workset open <name>` | فتح مجموعة عمل محفوظة (نافذة محرر أو جلسة وكيل في المحطة الطرفية) |
| `openspec config edit` | فتح ملف الإعدادات في المحرر |
| `openspec feedback` | إرسال ملاحظات عبر GitHub |
| `openspec completion install` | تثبيت إكمالات أوامر الصدفة |

### الأوامر المتوافقة مع الوكلاء

هذه الأوامر تدعم إخراجاً بتنسيق `--json` للاستخدام البرمجي من قبل وكلاء الذكاء الاصطناعي والبرامج النصية:

| الأمر | الاستخدام البشري | الاستخدام من قبل الوكلاء |
|-------|-----------------|--------------------------|
| `openspec list` | تصفح التغييرات/المواصفات | `--json` للحصول على بيانات منظمة |
| `openspec show <item>` | قراءة المحتوى | `--json` للتحليل البرمجي |
| `openspec validate` | التحقق من وجود مشاكل | `--all --json` للتحقق المجمع |
| `openspec status` | الاطلاع على تقدم القطع الأثرية (artifacts) | `--json` للحصول على حالة منظمة |
| `openspec instructions` | الحصول على الخطوات التالية | `--json` للحصول على تعليمات للوكلاء |
| `openspec templates` | العثور على مسارات القوالب | `--json` لحل مسارات الملفات |
| `openspec schemas` | سرد المخططات المتاحة | `--json` لاكتشاف المخططات |
| `openspec store setup <id>` | إنشاء وتسجيل مخزن محلي | `--json` مع مدخلات صريحة للحصول على إخراج إعداد منظم |
| `openspec store register <path>` | تسجيل مخزن موجود مسبقاً | `--json` للحصول على إخراج تسجيل منظم |
| `openspec store unregister <id>` | إزالة تسجيل مخزن محلي | `--json` للحصول على إخراج تنظيف منظم |
| `openspec store remove <id>` | حذف مجلد مخزن محلي مسجل | `--yes --json` للحذف غير التفاعلي |
| `openspec store list` | تصفح المخازن المسجلة | `--json` للحصول على سجلات منظمة |
| `openspec store doctor` | التحقق من إعداد المخزن المحلي | `--json` للحصول على تشخيصات منظمة |
| `openspec new change <id>` | إنشاء هيكل تغيير محلي للمستودع | `--json`، بالإضافة إلى `--store <id>` لاستخدام مخزن مسجل كجذر OpenSpec |
| `openspec workset create [name]` | إنشاء مجموعة عمل شخصية | `--member <path> --json` للتكوين غير التفاعلي |
| `openspec workset list` | تصفح مجموعات العمل المحفوظة | `--json` للحصول على عروض منظمة |
| `openspec workset remove <name>` | حذف مجموعة عمل محفوظة | `--yes --json` للإزالة غير التفاعلية |

---

## الخيارات العامة

تعمل هذه الخيارات مع جميع الأوامر:

| الخيار | الوصف |
|--------|-------|
| `--version`, `-V` | عرض رقم الإصدار |
| `--no-color` | تعطيل إخراج الألوان |
| `--help`, `-h` | عرض تعليمات الأمر |

---

## أوامر الإعداد

### `openspec init`

تهيئة OpenSpec في مشروعك. يقوم بإنشاء هيكل المجلدات وتكوين تكاملات أدوات الذكاء الاصطناعي.

السلوك الافتراضي يستخدم الإعدادات الافتراضية العامة: ملف التعريف `core`، طريقة التسليم `both`، سير العمل `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|---------|-------|-------|
| `path` | لا | المجلد المستهدف (الافتراضي: المجلد الحالي) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--tools <list>` | تكوين أدوات الذكاء الاصطناعي بشكل غير تفاعلي. استخدم `all` أو `none` أو قائمة مفصولة بفواصل |
| `--force` | تنظيف الملفات القديمة (legacy) تلقائياً دون مطالبة |
| `--profile <profile>` | تجاوز ملف التعريف العام لهذه العملية (`core` أو `custom`) |

يستخدم `--profile custom` سير العمل المحدد حالياً في الإعدادات العامة (`openspec config profile`).

**معرفات الأدوات المدعومة (`--tools`):** `amazon-q`، `antigravity`، `auggie`، `bob`، `claude`، `cline`، `codeartsagent`، `codex`، `forgecode`، `codebuddy`، `continue`، `costrict`، `crush`، `cursor`، `factory`، `gemini`، `github-copilot`، `hermes`، `iflow`، `junie`، `kilocode`، `kimi`، `kiro`، `lingma`، `vibe`، `oh-my-pi`، `opencode`، `pi`، `qoder`، `qwen`، `roocode`، `trae`، `windsurf`، `zcode`

> هذه القائمة تطابق `AI_TOOLS` في الملف `src/core/config.ts`. راجع [الأدوات المدعومة](supported-tools.md) لمعرفة مهارات كل أداة ومسارات أوامرها.

**أمثلة:**

```bash
# التهيئة التفاعلية
openspec init

# التهيئة في مجلد محدد
openspec init ./my-project

# غير تفاعلي: تكوين لـ Claude و Cursor
openspec init --tools claude,cursor

# التكوين لجميع الأدوات المدعومة
openspec init --tools all

# تجاوز ملف التعريف لهذه العملية
openspec init --profile core

# تخطي المطالبات وتنظيف الملفات القديمة تلقائياً
openspec init --force
```

**ما الذي ينشئه:**

```
openspec/
├── specs/              # مواصفاتك (مصدر الحقيقة)
├── changes/            # التغييرات المقترحة
└── config.yaml         # إعدادات المشروع

.claude/skills/         # مهارات Claude Code (إذا تم تحديد claude)
.cursor/skills/         # مهارات Cursor (إذا تم تحديد cursor)
.cursor/commands/       # أوامر Cursor OPSX (إذا كانت طريقة التسليم تتضمن أوامر)
... (إعدادات أدوات أخرى)
```

---

### `openspec update`

تحديث ملفات تعليمات OpenSpec بعد ترقية واجهة سطر الأوامر. إعادة إنشاء ملفات إعدادات أدوات الذكاء الاصطناعي باستخدام ملف التعريف العام الحالي، وسير العمل المحددة، وطريقة التسليم.

```
openspec update [path] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|---------|-------|-------|
| `path` | لا | المجلد المستهدف (الافتراضي: المجلد الحالي) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--force` | فرض التحديث حتى لو كانت الملفات محدثة بالفعل |

**مثال:**

```bash
# تحديث ملفات التعليمات بعد ترقية npm
npm update @fission-ai/openspec
openspec update
```

---

## المخازن (مستودعات OpenSpec مستقلة)

> **تجريبية (Beta).** المخازن والميزات المبنية عليها (المراجع، سياق العمل، مجموعات العمل) هي ميزات جديدة؛ قد تتغير أسماء الأوامر، والأعلام (flags)، وتنسيقات الملفات، وإخراج JSON بين الإصدارات. للاطلاع على الدليل الموجه لحل المشاكل، راجع [دليل المخازن](stores-beta/user-guide.md).

المخزن هو مستودع OpenSpec مستقل قمت بتسجيله على هذا الجهاز — على سبيل المثال مستودع تخطيط أو مستودع عقود. يسمح تسجيل مخزن للأوامر العادية (`list`، `show`، `status`، `validate`، `new change`، `archive`، ...) بالعمل عليه من أي مكان عن طريق تمرير `--store <id>`.

### `openspec store setup`

إنشاء وتسجيل مخزن محلي. عند عدم تمرير معاملات في المحطة الطرفية، يوجه OpenSpec المستخدم خلال عملية الإعداد. يجب على الوكلاء والبرامج النصية تمرير مدخلات صريحة واستخدام `--json`.

```bash
openspec store setup [id] [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--path <path>` | المجلد الذي سيوجد فيه المخزن (على سبيل المثال `~/openspec/<id>`) |
| `--remote <url>` | تسجيل المصدر البعيد الرسمي في ملف `store.yaml` الخاص بالمخزن الجديد |
| `--init-git` | تهيئة مستودع Git مع التزام أولي (افتراضي) |
| `--no-init-git` | تخطي جميع إجراءات Git: لا تهيئة، ولا التزام أولي |
| `--json` | إخراج بتنسيق JSON |

عمليات التشغيل غير التفاعلية (`--json`، البرامج النصية، الوكلاء) يجب أن تمرر كل من معرف المخزن و `--path`. في المحطة الطرفية التفاعلية، تطلب عملية الإعداد الموقع مع اقتراح قابل للتعديل في مكان مرئي مملوك للمستخدم (على سبيل المثال `~/openspec/<id>`); لا تستخدم أبداً دليل البيانات المدار لـ OpenSpec كافتراضي.

أمثلة:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

تسجيل مجلد مخزن محلي موجود مسبقاً. خلال مرحلة تجربة المخازن، يمكن تسجيل جذر قبل وجود أي تغييرات، أو تطبيق مواصفات، أو أرشفة التغييرات؛ في هذه الحالة، قد تكون المجلدات `openspec/changes/`، `openspec/specs/`، و `openspec/changes/archive/` غير موجودة حتى تقوم الأوامر العادية بإنشائها. يبقى مستودع يحتوي على إعدادات فقط ويعلن عن `store: <id>` كمرجع لمخزن آخر، ولا يتم تسجيله كجذر مخزن ما لم يتم إزالة هذا المرجع.

```bash
openspec store register [path] [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--id <id>` | معرف المخزن؛ الافتراضي هو بيانات تعريف المخزن أو اسم المجلد |
| `--yes` | تأكيد إنشاء بيانات تعريف هوية المخزن لجذر OpenSpec سليم |
| `--json` | إخراج بتنسيق JSON |

### `openspec store unregister`

إزالة تسجيل مخزن محلي دون حذف ملفاته.

```bash
openspec store unregister <id> [--json]
```

استخدم هذا الأمر عندما يتم نقل مخزن، أو استنساخه في مكان آخر، أو عندما لا يجب أن يظهره OpenSpec بعد الآن على هذا الجهاز.

### `openspec store remove`

إزالة تسجيل مخزن محلي وحذف مجلده المحلي.

```bash
openspec store remove <id> [--yes] [--json]
```

يعرض الأمر `remove` المجلد المحدد قبل الحذف في المحطة الطرفية التفاعلية. يجب على الوكلاء، والبرامج النصية، وطرق استدعاء JSON تمرير `--yes` لتأكيد الحذف. يرفض OpenSpec حذف أي مجلد لا يحتوي على بيانات تعريف مخزن مطابقة.

### `openspec store list`

سرد المخازن المسجلة محلياً.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

التحقق من تسجيل المخزن المحلي، وبيانات تعريفه، ووجود Git.

```bash
openspec store doctor [id] [--json]
```

الأمر `doctor` للفحص التشخيصي فقط؛ يبلغ عن الجذور المفقودة، وعدم تطابق بيانات التعريف، وحالة السجل المحلي غير الصالحة دون تعديل المخزن.

### الإشارة إلى المخازن من المشروع

يمكن لمستودع المشروع الإعلان عن المخازن التي يعتمد عليها عمله في ملف `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

من ذلك الحين، يحمل إخراج الأمر `openspec instructions` في ذلك المستودع (سواء أسطح per-artifact و `apply`، أو أوضاع JSON والبشر) فهرساً لمواصفات كل مخزن مشار إليه — معرفات المواصفات، وملخص من سطر واحد من قسم الغرض من كل مواصفة، وأمر الجلب (`openspec show <spec-id> --type spec --store <id>`). يتم بناء الفهرس مباشرة من النسخة المسجلة في كل تشغيل؛ لا يتم نسخ محتوى المواصفات مطلقاً إلى الإخراج.

المراجع هي سياق للقراءة فقط. لا تغير أبداً مكان عمل الأوامر: يبقى العمل في جذر المستودع الخاص به، والكتابة إلى مخزن مشار إليها تظل إجراءً صريحاً باستخدام `--store`. يتحول أي مرجع لا يمكن حله (على سبيل المثال مخزن غير مسجل على هذا الجهاز) إلى تحذير في الفهرس مع الإصلاح الدقيق، ولا تزال التعليمات يتم إنشاؤها. يبلغ الأمر `openspec doctor` عن حالة المراجع في مكان واحد.

### تسجيل مصدر استنساخ المخزن

يمكن للمخزن تسجيل مصدر الاستنساخ الرسمي الخاص به في ملف الهوية الملتزم به، حتى لا تنتهي عملية الإعداد عند الخطوة "سجل المخزن":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

يتم تسجيل المصدر البعيد في ملف `.openspec-store/store.yaml` داخل الالتزام الأولي، حتى تعرف كل نسخة مستنسخة مصدرها منذ الولادة. بالنسبة لمخزن موجود، قم بتعديل ملف `store.yaml` يدوياً ثم قم بالالتزام. يعرض الأمر `store doctor` المصدر البعيد المسجل (وأصل Git الملاحظ للنسخة)؛ ويسمي إرشاد مشاركة الإعداد/التسجيل هذا المصدر؛ ويسجل الأمر `register` أصل النسخة في السجل المحلي للجهاز.

يمكن أن يحمل إعلان المرجع مصدر الاستنساخ أيضاً، حتى يحصل أي عضو في الفريق لا يمتلك المخزن بعد على إصلاح كامل يمكن لصقه (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

تسجيل مصدر بعيد لا يعني المزامنة: لا يقوم OpenSpec مطلقاً باستنساخ، أو سحب، أو دفع التغييرات من تلقاء نفسه.

### الإعلان عن مخزن افتراضي

يمكن لأي مستودع تمت خارجية تخطيطه بالكامل — أي لا يحتوي على مجلدات `openspec/specs/` أو `openspec/changes/` محلية — الإعلان عن مخزنه مرة واحدة بدلاً من تمرير `--store` في كل أمر:

```yaml
# openspec/config.yaml (الملف الوحيد تحت مجلد openspec/)
store: team-context
```

ثم تحل الأوامر العادية تلقائياً إلى المخزن المعلن تلقائياً؛ يبلغ الشريط الجذري وكتلة JSON `root` عن `source: "declared"` مع معرف المخزن، ولا تزال التلميحات المطبوعة تحمل `--store <id>`. الإعلان هو خيار احتياطي، وليس خياراً يتجاوز الإعدادات الأخرى: تفوز دائماً القيمة الصريحة لـ `--store`، ويتجاهل أي دليل يحتوي على مجلدات تخطيط حقيقية هذا المؤشر (مع تحذير). لتحويل مستودع مؤشر إلى جذر OpenSpec محلي، احذف سطر `store:` ثم قم بتشغيل `openspec init` — يرفض الأمر `init` إنشاء الهيكل ما دام الإعلان موجوداً.

يوجد متغير على مستوى الجهاز يغطي جميع المستودعات مرة واحدة: `openspec config set defaultStore <id>` (راجع قسم الإعدادات). يتم الرجوع إليه فقط بعد فشل حل `--store`، وجذر محلي، ومؤشر مشروع جميعها؛ ثم يبلغ الشريط الجذري وكتلة JSON `root` عن `source: "global_default"`.

## دكتور (صحة العلاقات)

سؤال واحد للقراءة فقط، في مكان واحد: هل جذر OpenSpec سليم، وهل المتاجر التي يشير إليها متوفرة على هذا الجهاز؟

```bash
openspec doctor [--store <id>] [--json]
```

يفصل التقرير بين صحة الجذر، وصحة بيانات المتاجر الوصفية (بما في ذلك ملاحظة عند اختلاف النص البعيد المسجل وأصل النسخة المسحوبة، وملاحظة عندما تكون نسخة المتجر المسحوبة متأخرة عن مرجع تتبع upstream الذي تم جلب آخر تحديث له)، وصحة المراجع (تظهر نفس تعليمات التشخيص، مع إصلاحات الاستنساخ للمراجع غير المحلولة). توجد نتائج الفحص الصحي لأي درجة خطورة بالخروج 0 — تقرأ الوكلاء مصفوفات `status`؛ فقط أخطاء الأوامر (عدم وجود جذر، متجر غير معروف) تخرج بالكود 1. لا يقوم الأمر doctor مطلقًا بالاستنساخ أو المزامنة أو الإصلاح. للحصول على المجموعة المجمعة نفسها بدلاً من صحتها، استخدم `openspec context`.

## السياق العام (المجموعة المجمعة)

كل ما يتعلق بهذا العمل من خلال إعلانات OpenSpec، في مجموعة عمل واحدة: جذر OpenSpec والمتاجر التي يشير إليها.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

الملخص بتنسيق JSON قابل للاستهلاك من قبل الوكلاء (تحمل كل متجر مشار متاح وصفة جلب خاصة به؛ تحمل الأعضاء غير المحلولة نفس تعليمات الإصلاح التي يعرضها أمر doctor). يضيف الخيار `--code-workspace` كتابة ملف مساحة عمل لـ VS Code يحتوي على الجذر بالإضافة إلى المتاجر المشاركة المتاحة (مجلدات `ref:<id>`) — هذه هي العملية الوحيدة للكتابة التي يقوم بها هذا الأمر، ويرفض الكتابة إذا كان الملف موجودًا ما لم يتم استخدام الخيار `--force`. يتم الإبلاغ عن الأعضاء غير المتوفرة، ولا يتم تخمينها أبدًا.

"السياق العام" هو المجموعة المجمعة؛ حقل `context:` في ملف `openspec/config.yaml` هو خلفية المشروع التي يتم حقنها في التعليمات — هما شيئان مختلفان. يجيب أمر `openspec doctor` على ما إذا كانت المجموعة سليمة؛ بينما يجيب أمر `openspec context` على ما هي هذه المجموعة.

## مجموعات العمل الشخصية (Worksets)

> **تجريبي.** تعتبر الـ Worksets جزءًا من السطح التجريبي الجديد؛ قد تتغير الأوامر والأعلام وتنسيقات الملفات بين الإصدارات. للاطلاع على الدليل التفصيلي، راجع [دليل المتاجر](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

الـ Workset هو عرض شخصي مُسَمَّى للمجلدات التي تعمل عليها معًا — جذر التخطيط بالإضافة إلى أي مجلدات أخرى تختارها — محفوظة على جهازك وتُعاد فتحها بالاسم في أداتك. إنه محلي بالكامل: لا يتم إيداعه أبدًا، ولا تتم مشاركته، ولا يتم اشتقاقه من إعلانات، وحذف أي منها لا يؤثر أبدًا على مجلد عضو.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

يقوم الأمر `create` بتشغيل تدفق إرشادي قصير (أو يستخدم أعلام `--member` بشكل غير تفاعلي؛ العضو الأول هو الأساسي — تبدأ الجلسات هناك). يقوم الأمر `open` بتشغيل الأداة المختارة: المحررات (VS Code, Cursor) تفتح نافذة تحتوي على جميع الأعضاء وتعود؛ وكلاء سطر الأوامر (Claude Code, codex) يأخذون هذه الطرفية كجلسة مع جميع الأعضاء المرفقة وبدون أي موجه مُعبأ مسبقًا، وتنتهي الجلسة عند خروجك. يتم تخطي مجلد عضو مفقود في وقت الفتح مع ملاحظة؛ ويتم فتح الباقي. يمكن تجاوز تفضيل الأداة المحفوظة في كل فتح باستخدام `--tool`.

دعم أداة جديدة هو مسألة إعدادات وليس كود. كل أداة تنتمي إلى أحد نمطي تشغيل اثنين — `workspace-file` (يتم تشغيله باستخدام ملف `.code-workspace` المُنشأ) أو `attach-dirs` (علامة إرفاق واحدة لكل عضو) — ومفتاح `openers` في ملف `config.json` العام (افتحه باستخدام الأمر `openspec config edit`) يضيف أدوات أو يعدل الأدوات المدمجة حسب الحقل:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

توجد جميع بيانات حالة الـ Workset في مجلد `worksets/` ضمن دليل البيانات العام (العروض المحفوظة بالإضافة إلى ملفات `<name>.code-workspace` المُنشأة، التي يتم إعادة إنشائها في كل عملية فتح)؛ حذف هذا المجلد يزيل كل أثر.

---

## أوامر التصفح

### الأمر `openspec list`

يعرض قائمة بالتغييرات أو الـ specs في مشروعك.

```
openspec list [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--specs` | يعرض الـ specs بدلاً من التغييرات |
| `--changes` | يعرض التغييرات (الخيار الافتراضي) |
| `--sort <order>` | الفرز حسب `recent` (الافتراضي) أو `name` |
| `--json` | الإخراج بتنسيق JSON |

**أمثلة:**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**الإخراج (نص):**

```
التغييرات:
  add-dark-mode     لا توجد مهام      للتو
```

---

### الأمر `openspec view`

يعرض لوحة تحكم تفاعلية لاستكشاف الـ specs والتغييرات.

```
openspec view
```

يفتح واجهة تعتمد على الطرفية للتنقل بين مواصفات مشروعك والتغييرات.

---

### الأمر `openspec show`

يعرض تفاصيل تغيير أو spec.

```
openspec show [item-name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|-------|-------|
| `item-name` | لا | اسم التغيير أو الـ spec (يطلب إدخاله إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--type <type>` | تحديد النوع: `change` أو `spec` (يتم اكتشافه تلقائيًا إذا لم يكن هناك غموض) |
| `--json` | الإخراج بتنسيق JSON |
| `--no-interactive` | تعطيل الطلبات التفاعلية |

**خيارات خاصة بالتغييرات:**

| الخيار | الوصف |
|--------|-------|
| `--deltas-only` | يعرض فقط الـ spec deltas (في وضع JSON) |

**خيارات خاصة بالـ specs:**

| الخيار | الوصف |
|--------|-------|
| `--requirements` | يعرض المتطلبات فقط، باستثناء السيناريوهات (في وضع JSON) |
| `--no-scenarios` | يستبعد محتوى السيناريوهات (في وضع JSON) |
| `-r, --requirement <id>` | يعرض متطلبًا محددًا حسب فهرس يبدأ من 1 (في وضع JSON) |

**أمثلة:**

```bash
# Interactive selection
openspec show

# Show a specific change
openspec show add-dark-mode

# Show a specific spec
openspec show auth --type spec

# JSON output for parsing
openspec show add-dark-mode --json
```

---

## أوامر التحقق من الصحة

### الأمر `openspec validate`

يتحقق من صحة التغييرات والـ specs بحثًا عن مشاكل هيكلية.

```
openspec validate [item-name] [options]
```

يفشل التحقق من صحة التغيير الذي لا يحتوي على أي spec deltas ما لم يعلن ملف `.openspec.yaml` الخاص به عن `skip_specs: true` (لأعمال إعادة الهيكلة النقية أو الأدوات أو التوثيق — راجع [الوصفة 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)).

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|-------|-------|
| `item-name` | لا | العنصر المحدد للتحقق من صحته (يطلب إدخاله إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--all` | التحقق من صحة جميع التغييرات والـ specs |
| `--changes` | التحقق من صحة جميع التغييرات |
| `--specs` | التحقق من صحة جميع الـ specs |
| `--type <type>` | تحديد النوع عندما يكون الاسم غامضًا: `change` أو `spec` |
| `--strict` | تفعيل وضع التحقق الصارم |
| `--json` | الإخراج بتنسيق JSON |
| `--concurrency <n>` | الحد الأقصى للتحققات المتوازية (الافتراضي: 6، أو متغير البيئة `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | تعطيل الطلبات التفاعلية |

**أمثلة:**

```bash
# Interactive validation
openspec validate

# Validate a specific change
openspec validate add-dark-mode

# Validate all changes
openspec validate --changes

# Validate everything with JSON output (for CI/scripts)
openspec validate --all --json

# Strict validation with increased parallelism
openspec validate --all --strict --concurrency 12
```

**الإخراج (نص):**

```
التحقق من صحة add-dark-mode...
  ✓ ملف proposal.md صالح
  ✓ ملف specs/ui/spec.md صالح
  ⚠ design.md: قسم "النهج التقني" مفقود

تم العثور على 1 تحذير
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

### الأمر `openspec archive`

يؤرشف تغييرًا مكتملًا ويدمج الـ spec deltas في الـ specs الرئيسية.

```
openspec archive [change-name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|-------|-------|
| `change-name` | لا | التغيير المراد أرشفته (يطلب إدخاله إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `-y, --yes` | تخطي طلبات التأكيد |
| `--skip-specs` | تخطي تحديثات الـ specs لعملية أرشفة واحدة. يجب على التغيير الذي لا يحتوي بشكل دائم على أي spec deltas أن يعلن عن `skip_specs: true` في ملف `.openspec.yaml` الخاص به بدلاً من ذلك — يتم أرشفته بدون أي علامة |
| `--no-validate` | تخطي التحقق من الصحة (يتطلب تأكيدًا) |

**أمثلة:**

```bash
# Interactive archive
openspec archive

# Archive specific change
openspec archive add-dark-mode

# Archive without prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
openspec archive update-ci-config --skip-specs
```

**ما الذي يفعله:**

1. يتحقق من صحة التغيير (ما لم يتم تحديد الخيار `--no-validate`)
2. يطلب التأكيد (ما لم يتم تحديد الخيار `--yes`)
3. يدمج الـ spec deltas في المجلد `openspec/specs/`
4. ينقل مجلد التغيير إلى المسار `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## أوامر سير العمل

تدعم هذه الأوامر سير عمل OPSX المعتمد على الـ artifacts. وهي مفيدة لكل من البشر للتحقق من التقدم والوكلاء لتحديد الخطوات التالية.

### الأمر `openspec new change`

ينشئ مجلد تغيير وبيانات وصفية اختيارية مُسجلة في جذر OpenSpec المحلول.

```bash
openspec new change <name> [options]
```

يجب أن تستخدم أسماء التغييرات حالة أحرف صغيرة مع شرطات (kebab-case). تبدأ بحرف صغير، ثم تحتوي على أحرف صغيرة وأرقام وشرطات فردية. لا يمكن أن تبدأ برقم، أو تحتوي على مسافات أو شرطات سفلية أو أحرف كبيرة أو شرطات متتالية أو شرطات في البداية أو النهاية. عند تضمين معرف تذكرة خارجي، ابدأه بكلمة، على سبيل المثال `ticket-123-add-notifications` بدلاً من `123-add-notifications`.

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--description <text>` | الوصف المراد إضافته إلى ملف `index.md` |
| `--goal <text>` | بيانات وصفية اختيارية للهدف لتخزينها مع التغيير |
| `--schema <name>` | مخطط سير العمل المراد استخدامه |
| `--store <id>` | معرف المتجر المراد استخدامه كجذر لـ OpenSpec (المتجر هو مستودع OpenSpec مستقل قمت بتسجيله) |
| `--json` | إخراج JSON |

أمثلة:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### الأمر `openspec status`

يعرض حالة اكتمال الـ artifacts لتغيير ما.

```
openspec status [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--change <id>` | اسم التغيير (يطلب إدخاله إذا تم حذفه) |
| `--schema <name>` | تجاوز مخطط سير العمل (يتم اكتشافه تلقائيًا من إعدادات التغيير) |
| `--json` | الإخراج بتنسيق JSON |

**أمثلة:**

```bash
# Interactive status check
openspec status

# Status for specific change
openspec status --change add-dark-mode

# JSON for agent use
openspec status --change add-dark-mode --json
```

**الإخراج (نص):**

```
التغيير: add-dark-mode
المخطط: spec-driven
التقدم: 2/4 من الـ artifacts مكتملة

[x] proposal
[ ] design
[x] specs
[-] tasks (محظور بواسطة: design)
```

يعرض التغيير الذي يعلن عن `skip_specs: true` مرحلة الـ specs الخاصة به على شكل `[~] specs (تم التخطي: التغيير يعلن عن skip_specs)` ويستبعدها من عداد التقدم.

**الإخراج (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

---

### الأمر `openspec instructions`

يحصل على تعليمات موسعة لإنشاء artifact أو تطبيق المهام. تستخدمه الوكلاء الذكيين الاصطناعيين لفهم ما يجب إنشاؤه بعد ذلك.

```
openspec instructions [artifact] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|-------|-------|
| `artifact` | لا | معرف الـ artifact: `proposal`، `specs`، `design`، `tasks`، أو `apply` |

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--change <id>` | اسم التغيير (مطلوب في الوضع غير التفاعلي) |
| `--schema <name>` | تجاوز مخطط سير العمل |
| `--json` | الإخراج بتنسيق JSON |

**حالة خاصة:** استخدم `apply` كـ artifact للحصول على تعليمات تنفيذ المهام.

**أمثلة:**

```bash
# Get instructions for next artifact
openspec instructions --change add-dark-mode

# Get specific artifact instructions
openspec instructions design --change add-dark-mode

# Get apply/implementation instructions
openspec instructions apply --change add-dark-mode

# JSON for agent consumption
openspec instructions design --change add-dark-mode --json
```

**يتضمن الإخراج:**

- محتوى القالب للـ artifact
- سياق المشروع من الإعدادات
- محتوى الـ artifacts التابعة
- القواعد الخاصة بكل artifact من الإعدادات

بالنسبة للـ artifact الذي تم تخطيه عبر `skip_specs: true`، يكون الإخراج تحذيرًا فقط (يضيف JSON حقول `skipped`/`warning`) — يجب عدم إنشاء الـ artifact.

---

### الأمر `openspec templates`

يعرض مسارات القوالب المحلولة لجميع الـ artifacts في مخطط سير العمل.

```
openspec templates [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--schema <name>` | مخطط سير العمل المراد فحصه (الافتراضي: `spec-driven`) |
| `--json` | الإخراج بتنسيق JSON |

**أمثلة:**

```bash
# Show template paths for default schema
openspec templates

# Show templates for custom schema
openspec templates --schema my-workflow

# JSON for programmatic use
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

### الأمر `openspec schemas`

يعرض قائمة بمخططات سير العمل المتاحة مع أوصافها وتدفقات الـ artifacts.

```
openspec schemas [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--json` | الإخراج بتنسيق JSON |

**مثال:**

```bash
openspec schemas
```

**الإخراج:**

```
المخططات المتاحة:

  spec-driven (حزمة)
    سير عمل التطوير المعتمد على الـ specs الافتراضي
    التدفق: proposal → specs → design → tasks

  my-custom (مشروع)
    سير عمل مخصص لهذا المشروع
    التدفق: research → proposal → tasks
```

## أوامر المخططات
أوامر لإنشاء وإدارة مخططات سير عمل مخصصة.

### `openspec schema init`
إنشاء مخطط محلي جديد لمشروع.
```
openspec schema init <name> [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `name` | نعم | اسم المخطط (بصيغة kebab-case) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--description <text>` | وصف المخطط |
| `--artifacts <list>` | معرفات المخرجات مفصولة بفواصل (القيمة الافتراضية: `proposal,specs,design,tasks`) |
| `--default` | تعيينه كمخطط افتراضي للمشروع |
| `--no-default` | عدم المطالبة بتعيينه كافتراضي |
| `--force` | الكتابة فوق مخطط موجود مسبقاً |
| `--json` | إخراج النتيجة بتنسيق JSON |

**أمثلة:**

```bash
# إنشاء مخطط تفاعلي
openspec schema init research-first

# إنشاء غير تفاعلي مع مخرجات محددة
openspec schema init rapid \
  --description "سير عمل للتكرار السريع" \
  --artifacts "proposal,tasks" \
  --default
```

**ما الذي ينشئه:**

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
نسخ مخطط موجود مسبقاً إلى مشروعك للتخصيص.
```
openspec schema fork <source> [name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `source` | نعم | المخطط المراد نسخه |
| `name` | لا | اسم المخطط الجديد (القيمة الافتراضية: `<source>-custom`) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--force` | الكتابة فوق الوجهة الموجودة مسبقاً |
| `--json` | إخراج النتيجة بتنسيق JSON |

**مثال:**

```bash
# نسخ مخطط spec-driven المدمج
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`
التحقق من صحة هيكل المخطط والقوالب الخاصة به.
```
openspec schema validate [name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `name` | لا | اسم المخطط المراد التحقق من صحته (يتم التحقق من جميع المخططات إذا لم يتم تحديده) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--verbose` | عرض خطوات التحقق من الصحة بشكل مفصل |
| `--json` | إخراج النتيجة بتنسيق JSON |

**مثال:**

```bash
# التحقق من صحة مخطط محدد
openspec schema validate my-workflow

# التحقق من صحة جميع المخططات
openspec schema validate
```

---

### `openspec schema which`
عرض مصدر المخطط الذي يتم جلبه منه (مفيد لتصحيح أخطاء أولوية البحث عن المخططات).
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
| `--all` | عرض جميع المخططات مع مصادرها |
| `--json` | إخراج النتيجة بتنسيق JSON |

**مثال:**

```bash
# التحقق من مصدر المخطط
openspec schema which spec-driven
```

**المخرجات:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**أولوية البحث عن المخططات:**

1. المشروع: `openspec/schemas/<name>/`
2. المستخدم: `~/.local/share/openspec/schemas/<name>/`
3. الحزمة المدمجة: المخططات المضمنة

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
| `path` | عرض مسار ملف التكوين |
| `list` | عرض جميع الإعدادات الحالية |
| `get <key>` | الحصول على قيمة محددة |
| `set <key> <value>` | تعيين قيمة |
| `unset <key>` | إزالة مفتاح |
| `reset` | إعادة التعيين إلى القيم الافتراضية |
| `edit` | الفتح في المحرر المحدد في متغير `$EDITOR` |
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

# تعيين مخزن افتراضي على مستوى الجهاز (الجذر الاحتياطي عند عدم وجود خيار --store أو مخزن محلي أو مخزن مشروع: يتم حل مؤشر التخزين)
openspec config set defaultStore team-plans

# إعادة تعيين كافة التكوينات
openspec config reset --all --yes

# تعديل التكوين في المحرر الخاص بك
openspec config edit

# تكوين ملف تعريف سير العمل باستخدام معالج قائم على الإجراءات
openspec config profile

# إعداد مسبق سريع: تبديل سير العمل إلى الأساسي (يحافظ على وضع التوصيل)
openspec config profile core
```

يبدأ الأمر `openspec config profile` بعرض ملخص للحالة الحالية، ثم يسمح لك بالاختيار من بين:
- تغيير وضع التوصيل + سير العمل
- تغيير وضع التوصيل فقط
- تغيير سير العمل فقط
- الاحتفاظ بالإعدادات الحالية (خروج)

إذا اخترت الاحتفاظ بالإعدادات الحالية، لن يتم حفظ أي تغييرات ولن يظهر أي مطالبة بالتحديث.
إذا لم يكن هناك أي تغييرات في التكوين ولكن ملفات المشروع الحالية غير متزامنة مع ملف تعريف التكوين العام/وضع التوصيل الخاص بك، سيعرض OpenSpec تحذيراً ويقترح تشغيل الأمر `openspec update`.
الضغط على `Ctrl+C` يلغي التدفق بشكل نظيف (بدون تتبع مكدس الأخطاء) ويخرج برقم رمز `130`.
في قائمة تحقق سير العمل، يعني الرمز `[x]` أن سير العمل مُحدد في التكوين العام. لتطبيق هذه التحديدات على ملفات المشروع، قم بتشغيل الأمر `openspec update` (أو اختر `Apply changes to this project now?` عند المطالبة بذلك داخل مشروع).

**أمثلة تفاعلية:**

```bash
# تحديث وضع التوصيل فقط
openspec config profile
# اختر: تغيير وضع التوصيل فقط
# اختر وضع التوصيل: المهارات فقط

# تحديث سير العمل فقط
openspec config profile
# اختر: تغيير سير العمل فقط
# تبديل سير العمل في قائمة التحقق، ثم التأكيد
```

---

## أوامر مساعدة
### `openspec feedback`
إرسال ملاحظات حول OpenSpec. ينشئ هذا الأمر مشكلة (issue) على GitHub.
```
openspec feedback <message> [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `message` | نعم | نص الملاحظات |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--body <text>` | وصف تفصيلي |

**المتطلبات:** يجب تثبيت أداة سطر أوامر GitHub (`gh`) والمصادقة عليها.

**مثال:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`
إدارة إكمالات سطر الأوامر لـ OpenSpec CLI.
```
openspec completion <subcommand> [shell]
```

**الأوامر الفرعية:**

| الأمر الفرعي | الوصف |
|------------|-------------|
| `generate [shell]` | إخراج سكربت الإكمال إلى الإخراج القياسي (stdout) |
| `install [shell]` | تثبيت الإكمالات للأصداف الخاصة بك |
| `uninstall [shell]` | إزالة الإكمالات المثبتة |

**الأصداف المدعومة:** `bash`, `zsh`, `fish`, `powershell`

**أمثلة:**

```bash
# تثبيت الإكمالات (يكتشف الأصداف تلقائياً)
openspec completion install

# تثبيت لأصداف محدد
openspec completion install zsh

# إنشاء سكربت للتثبيت اليدوي
openspec completion generate bash > ~/.bash_completion.d/openspec

# إزالة التثبيت
openspec completion uninstall
```

---

## رموز الخروج

| الرمز | المعنى |
|------|---------|
| `0` | نجاح |
| `1` | خطأ (فشل في التحقق من الصحة، ملفات مفقودة، إلخ) |

---

## متغيرات البيئة

| المتغير | الوصف |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | اضبط قيمته على `0` لتعطيل جمع بيانات الاستخدام عن بعد (التيليستري) |
| `DO_NOT_TRACK` | اضبط قيمته على `1` لتعطيل جمع بيانات الاستخدام عن بعد (إشارة "عدم التتبع" DNT القياسية) |
| `OPENSPEC_CONCURRENCY` | التزامن الافتراضي للتحقق من الصحة الجماعي (القيمة الافتراضية: 6) |
| `EDITOR` أو `VISUAL` | المحرر المستخدم لأمر `openspec config edit` |
| `NO_COLOR` | تعطيل إخراج الألوان عند تعيينه |

---

## الوثائق ذات الصلة
- [الأوامر](commands.md) - أوامر الشرطة المائلة للذكاء الاصطناعي (`/opsx:propose`, `/opsx:apply`, إلخ)
- [سير العمل](workflows.md) - الأنماط الشائعة ومتى تستخدم كل أمر
- [التخصيص](customization.md) - إنشاء مخططات وقوالب مخصصة
- [البدء](getting-started.md) - دليل الإعداد لأول مرة