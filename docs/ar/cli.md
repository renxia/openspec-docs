# مرجع واجهة سطر الأوامر

يوفر OpenSpec CLI (`openspec`) أوامر طرفية لإعداد المشروع والتحقق من صحته وفحص حالته وإدارته. تكمل هذه الأوامر أوامر AI المائلة (مثل `/opsx:propose`) الموثقة في [Commands](commands.md).

## ملخص

| الفئة | الأوامر | الغرض |
|----------|----------|---------|
| **الإعداد** | `init`, `update` | تهيئة وتحديث OpenSpec في مشروعك |
| **المستودعات (Stores) (مستودعات OpenSpec المستقلة)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | إدارة المستودعات - وهي مستودعات OpenSpec المستقلة التي قمت بتسجيلها |
| **الحالة الصحية (Health)** | `doctor` | الإبلاغ عن صحة العلاقة للجذر الذي تم حله |
| **سياق العمل** | `context` | تجميع مجموعة العمل (الجذر والمستودعات المرجعية) |
| **مجموعات العمل الشخصية** | `workset create`, `workset list`, `workset open`, `workset remove` | الاحتفاظ بعروض عمل شخصية ومحلية وفتحها في أداتك |
| **التصفح** | `list`, `view`, `show` | استكشاف التغييرات والمواصفات |
| **التحقق من الصحة (Validation)** | `validate` | التحقق من التغييرات والمواصفات بحثًا عن المشكلات |
| **دورة الحياة** | `archive` | إنهاء التغييرات المكتملة |
| **سير العمل** | `new change`, `status`, `instructions`, `templates`, `schemas` | دعم سير العمل القائم على المخرجات (artifacts) |
| **المخططات (Schemas)** | `schema init`, `schema fork`, `schema validate`, `schema which` | إنشاء وإدارة مسارات عمل مخصصة |
| **الإعدادات** | `config` | عرض وتعديل الإعدادات |
| **الأدوات المساعدة** | `feedback`, `completion` | التغذية الراجعة والتكامل مع الصدفة (shell) |

---

## أوامر المستخدم البشري مقابل أوامر الوكيل

تم تصميم معظم أوامر CLI للاستخدام **البشري** في الطرفية (terminal). تدعم بعض الأوامر أيضًا **استخدام الوكيل/البرامج النصية** عبر مخرجات JSON.

### أوامر خاصة بالمستخدم البشري

هذه الأوامر تفاعلية ومصممة للاستخدام في الطرفية:

| الأمر | الغرض |
|---------|---------|
| `openspec init` | تهيئة المشروع (مطالبات تفاعلية) |
| `openspec view` | لوحة تحكم تفاعلية |
| `openspec workset open <name>` | فتح مجموعة عمل محفوظة (نافذة محرر أو جلسة وكيل طرفية) |
| `openspec config edit` | فتح التكوين في المحرر |
| `openspec feedback` | إرسال الملاحظات عبر GitHub |
| `openspec completion install` | تثبيت إكمال الطرفية (shell completions) |

### أوامر متوافقة مع الوكلاء

تدعم هذه الأوامر مخرج `--json` للاستخدام البرمجي من قبل وكلاء الذكاء الاصطناعي والبرامج النصية:

| الأمر | استخدام المستخدم البشري | استخدام الوكيل |
|---------|-----------|-----------|
| `openspec list` | تصفح التغييرات/المواصفات | `--json` للبيانات المهيكلة |
| `openspec show <item>` | قراءة المحتوى | `--json` للتحليل (parsing) |
| `openspec validate` | التحقق من المشكلات | `--all --json` للتحقق الجماعي |
| `openspec status` | رؤية تقدم المخرجات (artifact progress) | `--json` للحالة المهيكلة |
| `openspec instructions` | الحصول على الخطوات التالية | `--json` لتعليمات الوكيل |
| `openspec templates` | العثور على مسارات القوالب | `--json` لحل المسار |
| `openspec schemas` | سرد المخططات المتاحة | `--json` لاكتشاف المخطط |
| `openspec store setup <id>` | إنشاء وتسجيل مخزن محلي | `--json` مع مدخلات صريحة لمخرج إعداد مهيكل |
| `openspec store register <path>` | تسجيل مخزن موجود | `--json` لإخراج التسجيل المهيكل |
| `openspec store unregister <id>` | نسيان تسجيل المخزن المحلي | `--json` لمخرج التنظيف المهيكل |
| `openspec store remove <id>` | حذف مجلد المخزن المحلي المسجل | `--yes --json` للحذف غير التفاعلي |
| `openspec store list` | تصفح المخازن المسجلة | `--json` للتسجيلات المهيكلة |
| `openspec store doctor` | فحص إعداد المخزن المحلي | `--json` لتشخيص مهيكل |
| `openspec new change <id>` | إنشاء هيكل التغيير الخاص بالمستودع (repo-local) | `--json`، بالإضافة إلى `--store <id>` لاستخدام مخزن مسجل كمصدر رئيسي لـ OpenSpec |
| `openspec workset create [name]` | تجميع عرض عمل شخصي | `--member <path> --json` للتكوين غير التفاعلي |
| `openspec workset list` | تصفح مجموعات العمل المحفوظة | `--json` للعروض المهيكلة |
| `openspec workset remove <name>` | حذف عرض محفوظ | `--yes --json` للإزالة غير التفاعلية |

---

## الخيارات العامة (Global Options)

تعمل هذه الخيارات مع جميع الأوامر:

| الخيار | الوصف |
|--------|-------------|
| `--version`, `-V` | إظهار رقم الإصدار |
| `--no-color` | تعطيل مخرج اللون |
| `--help`, `-h` | عرض المساعدة للأمر |

---

## أوامر الإعداد (Setup Commands)

### `openspec init`

تهيئة OpenSpec في مشروعك. يقوم بإنشاء هيكل المجلدات وتكوين تكامل أدوات الذكاء الاصطناعي.

السلوك الافتراضي يستخدم إعدادات التكوين العامة: الملف الشخصي (`profile`) هو `core`، والتسليم (`delivery`) هو `both` (كليهما)، وسير العمل (`workflows`) هي `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**المعاملات (Arguments):**

| المعامل | مطلوب؟ | الوصف |
|----------|----------|-------------|
| `path` | لا | الدليل المستهدف (الافتراضي: الدليل الحالي) |

**الخيارات (Options):**

| الخيار | الوصف |
|--------|-------------|
| `--tools <list>` | تكوين أدوات الذكاء الاصطناعي بشكل غير تفاعلي. استخدم `all` أو `none` أو قائمة مفصولة بفواصل |
| `--force` | التنظيف التلقائي للملفات القديمة دون مطالبة |
| `--profile <profile>` | تجاوز الملف الشخصي العام لتشغيل التهيئة هذا (`core` أو `custom`) |

يستخدم الخيار `--profile custom` سير العمل المحددة حاليًا في التكوين العام (`openspec config profile`).

**معرّفات الأدوات المدعومة (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> تعكس هذه القائمة `AI_TOOLS` في `src/core/config.ts`. راجع [Supported Tools](supported-tools.md) لمعرفة مهارة كل أداة ومسارات الأوامر الخاصة بها.

**أمثلة:**

```bash
# تهيئة تفاعلية
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

**ماذا ينشئ:**

```
openspec/
├── specs/              # مواصفاتك (مصدر الحقيقة)
├── changes/            # التغييرات المقترحة
└── config.yaml         # تكوين المشروع

.claude/skills/         # مهارات Claude Code (إذا تم اختيار claude)
.cursor/skills/         # مهارات Cursor (إذا تم اختيار cursor)
.cursor/commands/       # أوامر OPSX الخاصة بـ Cursor (إذا كان التسليم يتضمن الأوامر)
... (تكوينات الأدوات الأخرى)
```

---

### `openspec update`

تحديث ملفات تعليمات OpenSpec بعد ترقية واجهة سطر الأوامر. يعيد إنشاء ملفات تكوين أدوات الذكاء الاصطناعي باستخدام الملف الشخصي العام الحالي، وسير العمل المحددة، ووضع التسليم الخاص بك.

```
openspec update [path] [options]
```

**المعاملات (Arguments):**

| المعامل | مطلوب؟ | الوصف |
|----------|----------|-------------|
| `path` | لا | الدليل المستهدف (الافتراضي: الدليل الحالي) |

**الخيارات (Options):**

| الخيار | الوصف |
|--------|-------------|
| `--force` | فرض التحديث حتى عندما تكون الملفات محدثة |

**مثال:**

```bash
# تحديث ملفات التعليمات بعد ترقية npm
npm update @fission-ai/openspec
openspec update
```

---

## المخازن (Stores) (مستودعات OpenSpec مستقلة)

> **نسخة تجريبية (Beta).** المخازن والميزات المبنية عليها (المراجع، وسياق العمل، ومجموعات العمل) هي ميزات جديدة؛ وقد تتغير أسماء الأوامر والأعلام وتنسيقات الملفات ومخرجات JSON بين الإصدارات. للمرور عبر المشكلة أولاً، راجع [دليل المخازن](stores-beta/user-guide.md).

المخزن (Store) هو مستودع OpenSpec مستقل قمت بتسجيله على هذه الآلة - مثل مستودع تخطيط أو مستودع عقود. يسمح تسجيل مخزن للأوامر العادية (`list`، `show`، `status`، `validate`، `new change`، `archive`، ...) بالعمل فيه من أي مكان عن طريق تمرير `--store <id>`.

### `openspec store setup`

إنشاء وتسجيل مخزن محلي. بدون معاملات في الطرفية، يقوم OpenSpec بتوجيه المستخدم خلال عملية الإعداد. يجب على الوكلاء والبرامج النصية تمرير مدخلات صريحة واستخدام `--json`.

```bash
openspec store setup [id] [options]
```

**الخيارات (Options):**

| الخيار | الوصف |
|--------|-------------|
| `--path <path>` | المجلد الذي يجب أن يستضيفه المخزن (على سبيل المثال `~/openspec/<id>`) |
| `--remote <url>` | تسجيل المصدر البعيد المعياري في ملف `store.yaml` للمخزن الجديد |
| `--init-git` | تهيئة مستودع Git بتثبيت أولي (افتراضي) |
| `--no-init-git` | تخطي كل إجراءات Git: لا تهيئة، ولا تثبيت أولي |
| `--json` | إخراج JSON |

يجب أن تتم عمليات التشغيل غير التفاعلية (`--json`، البرامج النصية، الوكلاء) بتمرير معرف المخزن و `--path`. في الطرفية التفاعلية، يطلب الإعداد الموقع مع اقتراح قابل للتحرير في مكان مرئي ومملوك للمستخدم (على سبيل المثال `~/openspec/<id>`)؛ ولا يستخدم أبدًا دليل البيانات المُدار من OpenSpec.

أمثلة:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

تسجيل مجلد مخزن محلي موجود.

```bash
openspec store register [path] [options]
```

**الخيارات (Options):**

| الخيار | الوصف |
|--------|-------------|
| `--id <id>` | معرف المخزن؛ الافتراضي هو بيانات وصف المخزن أو اسم المجلد |
| `--yes` | تأكيد إنشاء بيانات تعريف المخزن لجذر OpenSpec سليم |
| `--json` | إخراج JSON |

### `openspec store unregister`

نسيان تسجيل مخزن محلي دون حذف الملفات.

```bash
openspec store unregister <id> [--json]
```

استخدم هذا عندما يتم نقل المخزن، أو استنساخه في مكان آخر، أو لم يعد يجب عرضه بواسطة OpenSpec على هذه الآلة.

### `openspec store remove`

نسيان تسجيل مخزن محلي وحذف مجلده المحلي.

```bash
openspec store remove <id> [--yes] [--json]
```

يظهر أمر `remove` المجلد الدقيق قبل حذفه في الطرفية التفاعلية. يجب على الوكلاء والبرامج النصية ومستدعي JSON تمرير `--yes` لتأكيد الحذف. يرفض OpenSpec حذف مجلد لا يحتوي على بيانات وصف المخزن المطابقة.

### `openspec store list`

سرد المخازن المسجلة محليًا.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

فحص تسجيل المخزن المحلي، والبيانات الوصفية (metadata)، ووجود Git.

```bash
openspec store doctor [id] [--json]
```

أمر Doctor هو تشخيصي فقط؛ فهو يبلغ عن الجذور المفقودة، وعدم تطابق البيانات الوصفية، وحالة السجل المحلية غير الصالحة دون تعديل المخزن.

### الإشارة إلى المخازن من مشروع

يمكن لمستودع المشروع أن يعلن عن المخازن التي يستند إليها عمله في `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

منذ ذلك الحين، فإن مخرج `openspec instructions` في هذا المستودع (سواء على مستوى كل مُخرَج أو واجهة `apply`، سواء بصيغة JSON أو البشرية) يحمل فهرسًا لمواصفات كل مخزن مشار إليه - معرفات المواصفات، وملخص من سطر واحد من قسم الغرض الخاص بكل مواصفة، وأمر السحب (`openspec show <spec-id> --type spec --store <id>`). يتم بناء الفهرس مباشرة من الاستنساخ المسجل في كل تشغيل؛ ولا يتم نسخ محتوى المواصفات أبدًا إلى المخرج.

المراجع هي سياق للقراءة فقط. إنها لا تتغير أبدًا حيث تعمل الأوامر: يظل العمل في الجذر الخاص بالمستودع، ويظل الكتابة إلى مخزن مشار إليه إجراءً صريحًا باستخدام `--store`. إذا لم يتم حل مرجع (على سبيل المثال، مخزن غير مسجل على هذه الآلة)، فإنه يتحول إلى تحذير في الفهرس مع التصحيح الدقيق، وتستمر التعليمات في التوليد. يقوم `openspec doctor` بالإبلاغ عن صحة المراجع في مكان واحد.

### تسجيل مصدر استنساخ المخزن (Clone Source)

يمكن للمخزن أن يسجل مصدر استنساخه المعياري في ملف هويته المُلتزم به، بحيث لا ينتهي الالتحاق أبدًا عند "تسجيل المخزن":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

يتم وضع المصدر البعيد في `.openspec-store/store.yaml` داخل التثبيت الأولي، لذا يولد كل استنساخ وهو يعلم بذلك. بالنسبة لمخزن موجود، قم بتحرير `store.yaml` يدويًا وقم بالالتزام بالتغييرات. يُظهر `store doctor` المصدر المسجل (وأصل Git الذي تم رصده في الاستنساخ)؛ ويقوم الإعداد/التسجيل بتسميته بناءً على التوجيهات؛ ويسجل التسجيل أصل الاستنساخ في السجل المحلي للآلة.

يمكن لإعلان المرجع أن يحمل أيضًا مصدر الاستنساخ، بحيث يحصل زميل لا يمتلك المخزن بعد على تصحيح كامل وقابل للصق (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

تسجيل مصدر بعيد ليس مزامنة (sync): OpenSpec لا يستنسخ أو يسحب أو يدفع بمفرده أبدًا.

### الإعلان عن مخزن افتراضي

يمكن للمستودع الذي يتم فيه إخراج التخطيط بالكامل خارجيًا - دون وجود `openspec/specs/` محلي أو `openspec/changes/` - أن يعلن عن مخزنه مرة واحدة بدلاً من تمرير `--store` في كل أمر:

```yaml
# openspec/config.yaml (الملف الوحيد تحت openspec/)
store: team-context
```

تقوم الأوامر العادية بحل المخزن المُعلن عنه تلقائيًا؛ ويبلغ شريط الجذر ومربع `root` في JSON عن `source: "declared"` مع معرف المخزن، ولا تزال التلميحات المطبوعة تحمل `--store <id>`. الإعلان هو خيار احتياطي (fallback)، وليس تجاوزًا: دائمًا ما يفوز `--store` الصريح، ويتجاهل الدليل الذي يحتوي على مجلدات تخطيط حقيقية المؤشر (مع تحذير). لتحويل مستودع مؤشر إلى جذر OpenSpec محلي، قم بإزالة السطر `store:` وقم بتشغيل `openspec init` - يرفض الإعداد الهيكلة طالما أن الإعلان موجود.

## Doctor (صحة العلاقات)

سؤال واحد للقراءة فقط، وفي مكان واحد: هل جذر OpenSpec سليم، وهل المخازن التي يشير إليها متاحة على هذه الآلة؟

```bash
openspec doctor [--store <id>] [--json]
```

يقوم التقرير بفصل صحة الجذر، وصحة بيانات تعريف المخزن (بما في ذلك ملاحظة عندما يختلف البعيد المسجل وأصل عملية السحب/التحقق)، وصحة المراجع (تظهر نفس تعليمات التشخيص، مع إصلاحات الاستنساخ للمراجع غير المحلولة). تخرج نتائج الصحة بأي مستوى من الخطورة برمز 0 - تقرأ الوكلاء مصفوفات `status`; وفشل الأوامر فقط (لا يوجد جذر، مخزن غير معروف) يخرج برمز 1. أداة Doctor لا تستنسخ أو تتزامن أو تصلح أبدًا. للحصول على المجموعة المجمعة نفسها بدلاً من صحتها، استخدم openspec context.

## السياق العامل (المجموعة المجمعة)

كل ما يتعلق بهذا العمل من خلال إعلانات OpenSpec، في مجموعة عمل واحدة: جذر OpenSpec والمخازن التي يشير إليها.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

ملخص JSON قابل للاستهلاك بواسطة الوكلاء (يحمل كل مخزن مرجعي متاح وصفة جلب خاصة به؛ وتحمل الأعضاء غير المحلولة نفس تعليمات الإصلاح وعرض Doctor). يضيف `--code-workspace` كتابة ملف مساحة عمل VS Code يحتوي على الجذر بالإضافة إلى المخازن المرجعية المتاحة (`ref:<id>`) - وهي الكتابة التي يؤديها هذا الأمر، والتي يتم رفضها بدون `--force` إذا كان الملف موجودًا. يتم الإبلاغ عن الأعضاء غير المتاحين، ولا يتم تخمينهم أبدًا.

"`السياق العامل`" هو المجموعة المجمعة؛ والحقل `context:` في openspec/config.yaml هو خلفية المشروع المحقونة في التعليمات - وهما شيئان مختلفان. يجيب openspec doctor عما إذا كانت المجموعة صحية؛ ويجيب openspec context على ماهية المجموعة.

## مساحات العمل الشخصية

> **نسخة تجريبية (Beta).** تعد مساحات العمل جزءًا من الواجهة التجريبية الجديدة؛ وقد تتغير الأوامر والعلامات وتنسيقات الملفات بين الإصدارات. للاطلاع على الشرح التفصيلي، راجع [دليل المتاجر](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

مساحة العمل (Workset) هي عرض شخصي ومُسمى للمجلدات التي تعملون عليها معًا - وهي جذر تخطيط بالإضافة إلى أي شيء تختاره - ويتم الاحتفاظ بها على جهازك وتفتح بالاسم في أداتك. إنها محلية بحتة: لا يتم الالتزام بها أبدًا، ولا تتم مشاركتها أبدًا، ولا تُشتق من التصريحات، وإزالتها لا تؤثر أبدًا على مجلد العضو.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

يقوم الأمر `create` بتشغيل تدفق إرشادي قصير (أو يأخذ علامات `--member` بطريقة غير تفاعلية؛ العضو الأول هو الأساسي - تبدأ الجلسات منه). ويقوم الأمر `open` بتشغيل الأداة المختارة: تفتح محررات النصوص (VS Code، Cursor) نافذة تحتوي على كل عضو وتعود؛ بينما تتولى وكلاء واجهة سطر الأوامر (Claude Code, codex) هذا الطرفية كجلسة مرتبطة بكل عضو دون ملء أي موجه مسبق، وتنتهي عند خروجك. إذا كان هناك مجلد عضو مفقود وقت الفتح يتم تخطيه مع ملاحظة؛ ويتم فتح البقية. يمكن تجاوز تفضيل الأداة المحفوظ باستخدام `--tool` لكل عملية فتح.

إن دعم أداة جديدة هو تهيئة (configuration)، وليس كودًا. كل أداة هي إحدى طريقتين للإطلاق - `workspace-file` (يتم تشغيلها باستخدام ملف `.code-workspace` الذي تم إنشاؤه) أو `attach-dirs` (علامة ربط واحدة لكل عضو) - ويضيف مفتاح `openers` في الملف العام `config.json` (افتحه باستخدام `openspec config edit`) الأدوات أو يعدل المدمجات حسب الحقل:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

تعيش جميع حالات مساحة العمل تحت مجلد `worksets/` في دليل البيانات العام (العروض المحفوظة بالإضافة إلى ملفات `<name>.code-workspace` التي تم إنشاؤها، والتي يتم إعادة توليدها عند كل عملية فتح)؛ وحذف هذا المجلد يزيل كل أثر.

---

## أوامر التصفح

### `openspec list`

يسرد التغييرات أو المواصفات في مشروعك.

```
openspec list [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--specs` | يسرد المواصفات بدلاً من التغييرات |
| `--changes` | يسرد التغييرات (افتراضي) |
| `--sort <order>` | يفرز حسب `recent` (الأحدث، افتراضي) أو `name` (الاسم) |
| `--json` | الإخراج بتنسيق JSON |

**أمثلة:**

```bash
# يسرد جميع التغييرات النشطة
openspec list

# يسرد جميع المواصفات
openspec list --specs

# إخراج JSON للسكريبتات
openspec list --json
```

**الإخراج (نص):**

```
التغييرات:
  add-dark-mode     لا مهام      منذ قليل
```

---

### `openspec view`

يعرض لوحة تحكم تفاعلية لاستكشاف المواصفات والتغييرات.

```
openspec view
```

يفتح واجهة تعتمد على الطرفية للتنقل في مواصفات مشروعك وتغييراته.

---

### `openspec show`

يعرض تفاصيل تغيير أو مواصفة.

```
openspec show [item-name] [options]
```

**الحجج:**

| الحجة | مطلوب؟ | الوصف |
|----------|----------|-------------|
| `item-name` | لا | اسم التغيير أو المواصفة (يطلب إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--type <type>` | تحديد النوع: `change` (تغيير) أو `spec` (مواصفة) (يتم الكشف عنه تلقائيًا إذا لم يكن غامضًا) |
| `--json` | الإخراج بتنسيق JSON |
| `--no-interactive` | تعطيل المطالبات |

**خيارات خاصة بالتغييرات:**

| الخيار | الوصف |
|--------|-------------|
| `--deltas-only` | عرض مواصفات التغير فقط (وضع JSON) |

**خيارات خاصة بالمواصفات:**

| الخيار | الوصف |
|--------|-------------|
| `--requirements` | عرض المتطلبات فقط، واستبعاد السيناريوهات (وضع JSON) |
| `--no-scenarios` | استبعاد محتوى السيناريو (وضع JSON) |
| `-r, --requirement <id>` | عرض متطلب معين باستخدام فهرس يبدأ من 1 (وضع JSON) |

**أمثلة:**

```bash
# اختيار تفاعلي
openspec show

# عرض تغيير معين
openspec show add-dark-mode

# عرض مواصفة معينة
openspec show auth --type spec

# إخراج JSON للتحليل
openspec show add-dark-mode --json
```

---

## أوامر التحقق

### `openspec validate`

التحقق من التغييرات والمواصفات بحثًا عن مشكلات هيكلية.

```
openspec validate [item-name] [options]
```

**الحجج:**

| الحجة | مطلوب؟ | الوصف |
|----------|----------|-------------|
| `item-name` | لا | العنصر المحدد للتحقق (يطلب إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--all` | التحقق من جميع التغييرات والمواصفات |
| `--changes` | التحقق من جميع التغييرات |
| `--specs` | التحقق من جميع المواصفات |
| `--type <type>` | تحديد النوع عندما يكون الاسم غامضًا: `change` أو `spec` |
| `--strict` | تمكين وضع التحقق الصارم |
| `--json` | الإخراج بتنسيق JSON |
| `--concurrency <n>` | الحد الأقصى للتحققات المتوازية (الافتراضي: 6، أو متغير البيئة `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | تعطيل المطالبات |

**أمثلة:**

```bash
# التحقق التفاعلي
openspec validate

# التحقق من تغيير معين
openspec validate add-dark-mode

# التحقق من جميع التغييرات
openspec validate --changes

# التحقق من كل شيء مع إخراج JSON (لـ CI/السكريبتات)
openspec validate --all --json

# تحقق صارم مع زيادة التوازي
openspec validate --all --strict --concurrency 12
```

**الإخراج (نص):**

```
جاري التحقق من add-dark-mode...
  ✓ proposal.md صالح
  ✓ specs/ui/spec.md صالح
  ⚠ design.md: مفقود قسم "النهج التقني"

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
        "warnings": ["design.md: مفقود قسم 'النهج التقني'"]
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

أرشفة تغيير مكتمل ودمج مواصفات التغير في المواصفات الرئيسية.

```
openspec archive [change-name] [options]
```

**الحجج:**

| الحجة | مطلوب؟ | الوصف |
|----------|----------|-------------|
| `change-name` | لا | التغيير المراد أرشفته (يطلب إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `-y, --yes` | تخطي مطالبات التأكيد |
| `--skip-specs` | تخطي تحديثات المواصفات (للتغييرات الخاصة بالبنية التحتية/الأدوات/التوثيق فقط) |
| `--no-validate` | تخطي التحقق (يتطلب تأكيدًا) |

**أمثلة:**

```bash
# أرشفة تفاعلية
openspec archive

# أرشفة تغيير معين
openspec archive add-dark-mode

# الأرشفة بدون مطالبات (CI/السكريبتات)
openspec archive add-dark-mode --yes

# أرشفة تغيير أدوات لا يؤثر على المواصفات
openspec archive update-ci-config --skip-specs
```

**ماذا يفعل:**

1. يتحقق من التغيير (ما لم يتم استخدام `--no-validate`)
2. يطلب التأكيد (ما لم يتم استخدام `--yes`)
3. يدمج مواصفات التغير في `openspec/specs/`
4. ينقل مجلد التغيير إلى `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## أوامر سير العمل

تدعم هذه الأوامر سير عمل OPSX المعتمد على المخرجات (artifact-driven). وهي مفيدة لكل من البشر الذين يتحققون من التقدم والوكلاء الذين يحددون الخطوات التالية.

### `openspec new change`

إنشاء مجلد تغيير وبيانات وصفية اختيارية موثقة في جذر OpenSpec المُحلل.

```bash
openspec new change <name> [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--description <text>` | الوصف الذي سيتم إضافته إلى `index.md` |
| `--goal <text>` | بيانات الهدف الاختيارية لتخزينها مع التغيير |
| `--schema <name>` | مخطط سير العمل لاستخدامه |
| `--store <id>` | معرف المتجر (Store id) لاستخدامه كجذر OpenSpec (المتجر هو مستودع OpenSpec مستقل قمت بتسجيله) |
| `--json` | الإخراج بصيغة JSON |

أمثلة:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

عرض حالة اكتمال المخرجات (artifact) لتغيير ما.

```
openspec status [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--change <id>` | اسم التغيير (يطلب إذا تم حذفه) |
| `--schema <name>` | تجاوز المخطط (يكتشف تلقائيًا من إعدادات التغيير) |
| `--json` | الإخراج بتنسيق JSON |

**أمثلة:**

```bash
# فحص الحالة التفاعلي
openspec status

# حالة تغيير معين
openspec status --change add-dark-mode

# JSON لاستخدام الوكيل (Agent)
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
[-] tasks (محجوز بواسطة: design)
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

الحصول على تعليمات مُثرية لإنشاء مخرج أو تطبيق المهام. تُستخدم بواسطة وكلاء الذكاء الاصطناعي لفهم ما يجب إنشاؤه تاليًا.

```
openspec instructions [artifact] [options]
```

**الحجج:**

| الحجة | مطلوب؟ | الوصف |
|----------|----------|-------------|
| `artifact` | لا | معرف المخرج: `proposal`، `specs`، `design`، `tasks`، أو `apply` |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--change <id>` | اسم التغيير (مطلوب في الوضع غير التفاعلي) |
| `--schema <name>` | تجاوز المخطط |
| `--json` | الإخراج بتنسيق JSON |

**حالة خاصة:** استخدم `apply` كمخرج للحصول على تعليمات تنفيذ المهمة.

**أمثلة:**

```bash
# الحصول على التعليمات للمخرج التالي
openspec instructions --change add-dark-mode

# الحصول على تعليمات مخرج معين
openspec instructions design --change add-dark-mode

# الحصول على تعليمات التطبيق/التنفيذ
openspec instructions apply --change add-dark-mode

# JSON لاستهلاك الوكيل (Agent)
openspec instructions design --change add-dark-mode --json
```

**يتضمن الإخراج:**

- محتوى القالب للمخرج.
- سياق المشروع من ملف التكوين.
- المحتوى من المخرجات التابعة.
- قواعد خاصة بكل مخرج من ملف التكوين.

---

### `openspec templates`

عرض مسارات القوالب المُحللة لجميع المخرجات في مخطط معين (schema).

```
openspec templates [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--schema <name>` | المخطط المراد فحصه (الافتراضي: `spec-driven`) |
| `--json` | الإخراج بتنسيق JSON |

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
المخطط: spec-driven

القوالب:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

يسرد مخططات سير العمل المتاحة مع أوصافها وتدفقاتها للمخرجات.

```
openspec schemas [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--json` | الإخراج بتنسيق JSON |

**مثال:**

```bash
openspec schemas
```

**الإخراج:**

```
المخططات المتاحة:

  spec-driven (package)
    سير عمل التطوير الافتراضي القائم على المواصفات
    التدفق: proposal → specs → design → tasks

  my-custom (project)
    سير عمل مخصص لهذا المشروع
    التدفق: research → proposal → tasks
```

## أوامر المخططات (Schema Commands)

أوامر إنشاء وإدارة مخططات سير العمل المخصصة.

### `openspec schema init`

إنشاء مخطط محلي جديد للمشروع.

```
openspec schema init <name> [options]
```

**المعاملات (Arguments):**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `name` | نعم | اسم المخطط (بصيغة kebab-case) |

**الخيارات (Options):**

| الخيار | الوصف |
|--------|-------------|
| `--description <text>` | وصف المخطط |
| `--artifacts <list>` | معرّفات المخرجات (Artifact IDs) مفصولة بفواصل (القيمة الافتراضية: `proposal,specs,design,tasks`) |
| `--default` | تعيينه كمخطط افتراضي للمشروع |
| `--no-default` | لا تطلب تعيينه كافتراضي |
| `--force` | الكتابة فوق المخطط الموجود |
| `--json` | الإخراج بصيغة JSON |

**أمثلة:**

```bash
# إنشاء مخطط تفاعلي
openspec schema init research-first

# غير تفاعلي مع مخرجات محددة
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**ماذا ينشئ:**

```
openspec/schemas/<name>/
├── schema.yaml           # تعريف المخطط
└── templates/
    ├── proposal.md       # قالب لكل مخرج (artifact)
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

**المعاملات (Arguments):**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `source` | نعم | المخطط المراد نسخه |
| `name` | لا | اسم المخطط الجديد (القيمة الافتراضية: `<source>-custom`) |

**الخيارات (Options):**

| الخيار | الوصف |
|--------|-------------|
| `--force` | الكتابة فوق الوجهة الموجودة |
| `--json` | الإخراج بصيغة JSON |

**مثال:**

```bash
# نسخ المخطط المدمج القائم على المواصفات (spec-driven)
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

التحقق من بنية المخطط وقوالبه.

```
openspec schema validate [name] [options]
```

**المعاملات (Arguments):**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `name` | لا | المخطط المراد التحقق منه (يتحقق من الكل إذا تم الحذف) |

**الخيارات (Options):**

| الخيار | الوصف |
|--------|-------------|
| `--verbose` | عرض خطوات التحقق التفصيلية |
| `--json` | الإخراج بصيغة JSON |

**مثال:**

```bash
# التحقق من مخطط معين
openspec schema validate my-workflow

# التحقق من جميع المخططات
openspec schema validate
```

---

### `openspec schema which`

عرض مصدر حل المخطط (مفيد لتصحيح الأسبقية).

```
openspec schema which [name] [options]
```

**المعاملات (Arguments):**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `name` | لا | اسم المخطط |

**الخيارات (Options):**

| الخيار | الوصف |
|--------|-------------|
| `--all` | قائمة بجميع المخططات ومصادرها |
| `--json` | الإخراج بصيغة JSON |

**مثال:**

```bash
# التحقق من مصدر المخطط
openspec schema which spec-driven
```

**الإخراج:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**أسبقية المخططات (Schema precedence):**

1. المشروع: `openspec/schemas/<name>/`
2. المستخدم: `~/.local/share/openspec/schemas/<name>/`
3. الحزمة (Package): المخططات المدمجة

---

## أوامر الإعدادات (Configuration Commands)

### `openspec config`

عرض وتعديل إعدادات OpenSpec العامة.

```
openspec config <subcommand> [options]
```

**الأوامر الفرعية (Subcommands):**

| الأمر الفرعي | الوصف |
|------------|-------------|
| `path` | عرض موقع ملف الإعدادات |
| `list` | عرض جميع الإعدادات الحالية |
| `get <key>` | الحصول على قيمة محددة |
| `set <key> <value>` | تعيين قيمة |
| `unset <key>` | إزالة مفتاح |
| `reset` | إعادة التعيين إلى القيم الافتراضية |
| `edit` | الفتح في `$EDITOR` |
| `profile [preset]` | تهيئة ملف تعريف سير العمل بشكل تفاعلي أو عبر قالب مُعد مسبقًا |

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

# تعديل الإعدادات في المحرر الخاص بك
openspec config edit

# تهيئة الملف الشخصي باستخدام معالج قائم على الإجراءات (action-based wizard)
openspec config profile

# قالب سريع: تبديل سير العمل إلى النواة (core) (مع الحفاظ على وضع التسليم delivery mode)
openspec config profile core
```

تبدأ `openspec config profile` بملخص للحالة الحالية، ثم تسمح لك بالاختيار:
- تغيير التسليم + سير العمل (Change delivery + workflows)
- تغيير التسليم فقط (Change delivery only)
- تغيير سير العمل فقط (Change workflows only)
- الاحتفاظ بالإعدادات الحالية (خروج)

إذا احتفظت بالإعدادات الحالية، فلن يتم كتابة أي تغييرات ولن يظهر موجه تحديث.
إذا لم تكن هناك تغييرات في الإعدادات ولكن ملفات المشروع الحالية غير متزامنة مع الملف الشخصي العام/التسليم الخاص بك، فسيقوم OpenSpec بعرض تحذير واقتراح `openspec update`.
الضغط على `Ctrl+C` يلغي التدفق بشكل نظيف (بدون تتبع مكدس) ويخرج بالرمز `130`.
في قائمة تدقيق سير العمل، تعني `[x]` أن سير العمل محدد في الإعدادات العامة. لتطبيق هذه التحديدات على ملفات المشروع، قم بتشغيل `openspec update` (أو اختر "تطبيق التغييرات على هذا المشروع الآن؟" عند المطالبة به داخل مشروع).

**أمثلة تفاعلية:**

```bash
# تحديث التسليم فقط
openspec config profile
# اختيار: تغيير التسليم فقط
# اختيار التسليم: المهارات فقط (Skills only)

# تحديث سير العمل فقط
openspec config profile
# اختيار: تغيير سير العمل فقط
# تبديل حالة سير العمل في قائمة التحقق، ثم التأكيد
```

---

## أوامر الأدوات المساعدة (Utility Commands)

### `openspec feedback`

إرسال ملاحظات حول OpenSpec. ينشئ مشكلة على GitHub.

```
openspec feedback <message> [options]
```

**المعاملات (Arguments):**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `message` | نعم | رسالة الملاحظة |

**الخيارات (Options):**

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

إدارة إكمال الأوامر (shell completions) لـ OpenSpec CLI.

```
openspec completion <subcommand> [shell]
```

**الأوامر الفرعية (Subcommands):**

| الأمر الفرعي | الوصف |
|------------|-------------|
| `generate [shell]` | إخراج سكربت الإكمال إلى stdout |
| `install [shell]` | تثبيت الإكمال لـ shell الخاص بك |
| `uninstall [shell]` | إزالة الإكمالات المثبتة |

**الـ shells المدعومة:** `bash`, `zsh`, `fish`, `powershell`

**أمثلة:**

```bash
# تثبيت الإكمالات (يحدد الـ shell تلقائيًا)
openspec completion install

# التثبيت لـ shell محدد
openspec completion install zsh

# إنشاء سكربت للتثبيت اليدوي
openspec completion generate bash > ~/.bash_completion.d/openspec

# إلغاء التثبيت
openspec completion uninstall
```

---

## رموز الخروج (Exit Codes)

| الرمز | المعنى |
|------|---------|
| `0` | نجاح |
| `1` | خطأ (فشل التحقق، ملفات مفقودة، إلخ.) |

---

## متغيرات البيئة (Environment Variables)

| المتغير | الوصف |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | اضبطه على `0` لتعطيل القياس عن بعد (telemetry) |
| `DO_NOT_TRACK` | اضبطه على `1` لتعطيل القياس عن بعد (إشارة DNT القياسية) |
| `OPENSPEC_CONCURRENCY` | التزامن الافتراضي للتحقق الجماعي (القيمة الافتراضية: 6) |
| `EDITOR` أو `VISUAL` | المحرر المستخدم في `openspec config edit` |
| `NO_COLOR` | تعطيل مخرجات الألوان عند تعيينه |

---

## الوثائق ذات الصلة (Related Documentation)

- [Commands](commands.md) - أوامر الشرطة المائلة (AI slash commands) (`/opsx:propose`, `/opsx:apply`, إلخ.)
- [Workflows](workflows.md) - الأنماط الشائعة ومتى يجب استخدام كل أمر
- [Customization](customization.md) - إنشاء مخططات وقوالب مخصصة
- [Getting Started](getting-started.md) - دليل الإعداد للمرة الأولى