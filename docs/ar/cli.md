# مرجع واجهة سطر الأوامر (CLI)

توفر واجهة سطر أوامر OpenSpec (`openspec`) أوامر الطرفية لإعداد المشروع، والتحقق من الصحة، وفحص الحالة، والإدارة. تكمل هذه الأوامر أوامر الشرطة المائلة للذكاء الاصطناعي (مثل `/opsx:propose`) الموثقة في [الأوامر](commands.md).

## ملخص

| الفئة | الأوامر | الغرض |
|----------|----------|---------|
| **الإعداد** | `init`, `update` | تهيئة وتحديث OpenSpec في مشروعك |
| **Areas العمل (تجريبي)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | إعداد عروض محلية فوق المستودعات أو المجلدات المرتبطة |
| **السياق المشترك (تجريبي)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | إدارة تسجيلات context-store المحلية وسياق المبادرة الدائم |
| **التصفح** | `list`, `view`, `show` | استكشاف التغييرات والمواصفات |
| **التحقق من الصحة** | `validate` | التحقق من وجود مشاكل في التغييرات والمواصفات |
| **الدورة الحياة** | `archive` | إنهاء التغييرات المكتملة |
| **سير العمل** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | دعم سير العمل القائم على الأدلة |
| **المخططات** | `schema init`, `schema fork`, `schema validate`, `schema which` | إنشاء وإدارة تدفقات عمل مخصصة |
| **التكوين** | `config` | عرض وتعديل الإعدادات |
| **الأدوات المساعدة** | `feedback`, `completion` | الملاحظات وتكامل غلاف الأوامر |

---

## أوامر البشر مقابل الوكلاء

معظم أوامر CLI مصممة **لاستخدام بشري** في الواجهة الطرفية. تدعم بعض الأوامر أيضاً **استخدام الوكلاء/النصوص البرمجية** عبر مخرجات JSON.

### الأوامر المخصصة للبشر فقط

هذه الأوامر تفاعلية ومصممة للاستخدام في الواجهة الطرفية:

| الأمر | الغرض |
|---------|---------|
| `openspec init` | تهيئة المشروع (مطالبات تفاعلية) |
| `openspec view` | لوحة معلومات تفاعلية |
| `openspec config edit` | فتح الملف الإعدادي في المحرر |
| `openspec feedback` | تقديم ملاحظات عبر GitHub |
| `openspec completion install` | تثبيت استكمالات الشل |

### الأوامر المتوافقة مع الوكلاء

هذه الأوامر تدعم مخرجات `--json` للاستخدام البرمجي من قبل وكلاء الذكاء الاصطناعي والنصوص البرمجية:

| الأمر | الاستخدام البشري | الاستخدام للوكلاء |
|---------|-----------|-----------|
| `openspec list` | تصفح التغييرات/المواصفات | `--json` للبيانات المهيكلة |
| `openspec show <item>` | قراءة المحتوى | `--json` للتحليل |
| `openspec validate` | التحقق من المشكلات | `--all --json` للتحقق بالجملة |
| `openspec status` | رؤية تقدم المخرجات | `--json` للحالة المهيكلة |
| `openspec instructions` | الحصول على الخطوات التالية | `--json` لتعليمات الوكلاء |
| `openspec templates` | إيجاد مسارات القوالب | `--json` لتحديد المسارات |
| `openspec schemas` | سرد المخططات المتاحة | `--json` لاكتشاف المخططات |
| `openspec workspace setup --no-interactive` | إنشاء مساحة عمل مع مدخلات واضحة | `--json` لمخرجات إعداد مهيكلة |
| `openspec workspace list` | تصفح مساحات العمل المعروفة | `--json` لكائنات مساحات العمل المصنفة |
| `openspec workspace link` | ربط مستودع أو مجلد | `--json` لمخرجات ربط مهيكلة |
| `openspec workspace relink` | إصلاح مسار مرتبط | `--json` لمخرجات ربط مهيكلة |
| `openspec workspace doctor` | فحص مساحة عمل واحدة | `--json` لمخرجات حالة مهيكلة |
| `openspec workspace update` | تحديث التوجيه المحلي لمساحة العمل ومهارات الوكلاء | `--tools` يختار الوكلاء؛ يختار الملف التعريفي سير العمل |
| `openspec context-store setup <id>` | إنشاء مخزن سياق محلي | `--json` مع مدخلات واضحة لمخرجات إعداد مهيكلة |
| `openspec context-store register <path>` | تسجيل مخزن سياق موجود | `--json` لمخرجات تسجيل مهيكلة |
| `openspec context-store unregister <id>` | نسيان تسجيل مخزن سياق محلي | `--json` لمخرجات تنظيف مهيكلة |
| `openspec context-store remove <id>` | حذف مجلد مخزن سياق محلي مسجل | `--yes --json` للحذف غير التفاعلي |
| `openspec context-store list` | تصفح مخازن السياق المسجلة | `--json` للتسجيلات المهيكلة |
| `openspec context-store doctor` | فحص إعداد المخزن المحلي | `--json` للتشخيصات المهيكلة |
| `openspec initiative list` | تصفح المبادرات المشتركة | `--json` لسجلات المبادرات المهيكلة |
| `openspec initiative show <id>` | حل مبادرة | `--json` للمسارات والبيانات الوصفية المعيارية |
| `openspec new change <id>` | إنشاء هيكل تغيير محلي للمستودع | `--json`، بالإضافة إلى `--initiative` لروابط التنسيق المشتركة |
| `openspec set change <id>` | تحديث بيانات وصفية للتغيير تم إيداعها | `--json`، بالإضافة إلى `--initiative` لروابط التنسيق المشتركة |

---

## الخيارات العامة

هذه الخيارات تعمل مع جميع الأوامر:

| الخيار | الوصف |
|--------|-------------|
| `--version`, `-V` | إظهار رقم الإصدار |
| `--no-color` | تعطيل المخرجات الملونة |
| `--help`, `-h` | عرض المساعدة للأمر |

---

## أوامر الإعداد

### `openspec init`

تهيئة OpenSpec في مشروعك. ينشئ هيكل المجلدات ويضبط تكاملات أدوات الذكاء الاصطناعي.

السلوك الافتراضي يستخدم الافتراضيات العالمية للملف التعريفي `core`، التسليم `both`، سير العمل `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**الوسائط:**

| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `path` | لا | الدليل المستهدف (الافتراضي: الدليل الحالي) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--tools <list>` | ضبط أدوات الذكاء الاصطناعي بشكل غير تفاعلي. استخدم `all`، `none`، أو قائمة مفصولة بفواصل |
| `--force` | التنظيف التلقائي للملفات القديمة دون مطالبة |
| `--profile <profile>` | تجاوز الملف التعريفي العالمي لهذه عملية التهيئة (`core` أو `custom`) |

`--profile custom` يستخدم أي سير عمل محدد حالياً في الإعدادات العالمية (`openspec config profile`).

**معرّفات الأدوات المدعومة (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**أمثلة:**

```bash
# التهيئة التفاعلية
openspec init

# التهيئة في دليل محدد
openspec init ./my-project

# غير تفاعلي: التهيئة لـ Claude و Cursor
openspec init --tools claude,cursor

# التهيئة لجميع الأدوات المدعومة
openspec init --tools all

# تجاوز الملف التعريفي لهذه العملية
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

.claude/skills/         # مهارات Claude Code (إذا تم اختيار claude)
.cursor/skills/         # مهارات Cursor (إذا تم اختيار cursor)
.cursor/commands/       # أوامر OPSX لـ Cursor (إذا كان التسليم يشمل الأوامر)
... (إعدادات أدوات أخرى)
```

---

### `openspec update`

تحديث ملفات تعليمات OpenSpec بعد ترقية CLI. إعادة إنشاء ملفات إعدادات أدوات الذكاء الاصطناعي باستخدام ملفك التعريفي العالمي الحالي، وسير العمل المحدد، ووضع التسليم.

```
openspec update [path] [options]
```

**الوسائط:**

| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `path` | لا | الدليل المستهدف (الافتراضي: الدليل الحالي) |

**الخيارات:**

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

## أوامر مساحات العمل

أوامر مساحات العمل في مرحلة بيتا. نموذج العرض المحلي أدناه هو الاتجاه الحالي، لكن الأتمتة الخارجية، والتكاملات، وسير العمل طويل الأمد لا يزال ينبغي أن تعامل سلوك الأوامر، وملفات الحالة، ومخرجات JSON على أنها قابلة للتطور.

مساحات عمل التنسيق هي عروض محلية على الآلة للمستودعات أو المجلدات المرتبطة. مرئية مساحة العمل ليست التزاماً بالتغيير: اربط المستودعات أو المجلدات التي ينبغي لـ OpenSpec معرفتها، ثم أنشئ التغييرات عندما تكون مستعداً لتخطيط عمل محدد.

### `openspec workspace setup`

إنشاء مساحة عمل في مسار مساحة عمل OpenSpec القياسي وربط مستودع أو مجلد موجود واحد على الأقل.

```bash
openspec workspace setup [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--name <name>` | اسم مساحة العمل. يجب أن تكون الأسماء بالشكل kebab-case |
| `--link <path>` | ربط مستودع أو مجلد موجود واستنتاج اسم الرابط من اسم المجلد |
| `--link <name>=<path>` | ربط مستودع أو مجلد موجود باسم رابط واضح |
| `--opener <id>` | تخزين الافتتاحية المفضلة أثناء الإعداد غير التفاعلي: `codex-cli`، `claude`، `github-copilot`، أو `editor` |
| `--tools <tools>` | تثبيت مهارات OpenSpec المحلية لمساحة العمل للوكلاء. استخدم `all`، `none`، أو قائمة معرّفات أدوات مفصولة بفواصل |
| `--no-interactive` | تعطيل المطالبات؛ يتطلب `--name` ورابط `--link` واحد على الأقل |
| `--json` | مخرجات JSON؛ يتطلب `--no-interactive` |

**أمثلة:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

يسأل الإعداد التفاعلي عن الافتتاحية المفضلة ويمكنه تثبيت مهارات OpenSpec المحلية لمساحة العمل للوكلاء المحددين. يقوم الإعداد غير التفاعلي بتخزين الافتتاحية المفضلة فقط عند توفير `--opener`؛ وإلا `workspace open` يطالب لاحقاً في الواجهات الطرفية التفاعلية عندما تتوفر افتتاحية مدعومة، أو يطلب من النصوص البرمجية تمرير `--agent <tool>` أو `--editor`.

تثبيت مهارات مساحة العمل هو للمهارات فقط في هذا الجزء من البيتا: حتى لو كان التسليم العالمي `commands` أو `both`، يكتب إعداد مساحة العمل مجلدات مهارات الوكيل في جذر مساحة العمل ولا ينشئ ملفات أوامر شرطة مائلة. يختار الملف التعريفي العالمي النشط سير عمل المهارات المثبتة؛ يختار `--tools` الوكلاء الذين يستقبلونها. إذا تم إهمال `--tools` في الإعداد غير التفاعلي، لا يتم تثبيت مهارات ويمكن لـ `workspace update --tools <ids>` إضافتها لاحقاً.

### `openspec workspace list`

سرد مساحات العمل المعروفة من سجل OpenSpec المحلي.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

تعرض القائمة موقع كل مساحة عمل والمستودعات أو المجلدات المرتبطة. يتم الإبلاغ عن سجلات السجل القديمة ولكن لا يتم تغييرها.

### `openspec workspace link`

تسجيل مستودع أو مجلد موجود لمساحة عمل واحدة.

```bash
openspec workspace link [name] <path> [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--workspace <name>` | اختيار مساحة عمل معروفة من السجل المحلي |
| `--json` | مخرجات JSON |
| `--no-interactive` | تعطيل مطالبات اختيار مساحة العمل |

**أمثلة:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

يجب أن يكون المسار موجوداً بالفعل. تتم معالجة المسارات النسبية بالنسبة للدليل الحالي للأمر قبل أن يخزن OpenSpec المسار المطلق المُتحقق منه في حالة مساحة العمل المحلية للآلة. يمكن أن تكون المسارات المرتبطة مستودعات كاملة، أو حزم، أو خدمات، أو تطبيقات، أو مجلدات بدون حالة `openspec/` محلية للمستودع.

### `openspec workspace relink`

إصلاح أو تغيير المسار المحلي لرابط موجود.

```bash
openspec workspace relink <name> <path> [options]
```

يجب أن يكون المسار موجوداً بالفعل. يحدّث Relink فقط المسار المحلي للآلة لاسم الرابط المستقر.

### `openspec workspace doctor`

فحص ما يمكن أن تحله مساحة عمل واحدة على الآلة الحالية.

```bash
openspec workspace doctor [options]
```

يعرض Doctor موقع مساحة العمل، والمستودعات أو المجلدات المرتبطة، والمسارات المفقودة، ومسارات المواصفات المحلية للمستودع عند وجودها، والإصلاحات المقترحة. تتضمن مخرجات JSON أيضاً مسار تخطيط مساحة العمل للتوافق. يُبلّغ عن المشكلات فقط؛ لا يصلحها تلقائياً.

الأوامر التي تحتاج مساحة عمل واحدة تستخدم مساحة العمل الحالية عند تشغيلها من داخل مجلد مساحة العمل أو دليل فرعي. من أماكن أخرى، مرر `--workspace <name>`، اختر من القائمة في الواجهة الطرفية التفاعلية، أو اعتمد على مساحة العمل الوحيدة المعروفة عندما تكون واحدة بالضبط. في وضع `--json` أو `--no-interactive`، يفشل الاختيار الغامض مع خطأ حالة مهيكلة ويقترح `--workspace <name>`.

تستخدم استجابات JSON كائنات مصنفة مضافاً إليها مصفوفات `status`. البيانات الرئيسية تقع في `workspace`، `workspaces`، أو `link`؛ التحذيرات والأخطاء تقع في `status`.

### `openspec workspace update`

تحديث توجيه OpenSpec المحلي لمساحة العمل ومهارات الوكلاء.

```bash
openspec workspace update [name] [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--workspace <name>` | اختيار مساحة عمل معروفة من السجل المحلي |
| `--tools <tools>` | اختيار الوكلاء لمهارات مساحة العمل. استخدم `all`، `none`، أو قائمة معرّفات أدوات مفصولة بفواصل |
| `--json` | مخرجات JSON |
| `--no-interactive` | تعطيل مطالبات اختيار مساحة العمل |

**أمثلة:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

يحدّث `workspace update` كتلة التوجيه المُنشأة لمساحة العمل والسطح المفتوح المحلي. بالنسبة لمهارات الوكلاء، يعيد استخدام اختيار وكيل مهارات مساحة العمل المخزن عند إهمال `--tools`. تمرير `--tools` يستبدل ذلك الاختيار المخزن. يحدّث فقط أدلة مهارات سير العمل المدارة بواسطة OpenSpec في جذر مساحة العمل، يزيل مهارات سير العمل المدارة غير المختارة، ويترك المستودعات والمجلدات المرتبطة دون تغيير.

تشغيل `openspec update` من داخل مساحة العمل يعيد التوجيه إلى `openspec workspace update`؛ شغّل `openspec update` داخل مشاريع المستودعات المحلية عندما تريد تحديث ملفات الأدوات التي يملكها المستودع.

### `openspec workspace open`

فتح مجموعة عمل مساحة العمل من خلال الافتتاحية المفضلة المخزنة، تجاوز وكيل لجلسة واحدة، أو وضع محرر VS Code.

```bash
openspec workspace open [name] [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--workspace <name>` | مرادف لاسم مساحة العمل الموقع |
| `--initiative <id>` | فتح مبادرة كعرض مساحة عمل محلية. يقبل `<id>` أو `<store>/<id>` |
| `--store <id>` | معرّف مخزن السياق المسجل لـ `--initiative` |
| `--store-path <path>` | جذر مخزن سياق محلي موجود لـ `--initiative` |
| `--agent <tool>` | تجاوز وكيل لجلسة واحدة: `codex-cli`، `claude`، أو `github-copilot` |
| `--editor` | فتح ملف مساحة عمل VS Code المُصان كمساحة عمل محرر عادية |
| `--no-interactive` | تعطيل مطالبات اختيار مساحة العمل والافتتاحية |

**أمثلة:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

يستخدم `workspace open` مساحة العمل الحالية عند التشغيل داخلها، ويختار تلقائياً مساحة العمل الوحيدة المعروفة عند التشغيل من مكان آخر، ويسأل المستخدم للاختيار عندما تكون هناك عدة مساحات عمل معروفة. لا يغير `--agent` و `--editor` الافتتاحية المفضلة المخزنة. تمرير تجاوزات الافتتاحية معاً هو خطأ؛ اختر إما `--agent <tool>` أو `--editor`.

عند استخدام `--initiative`، يُعدّ OpenSpec أو يختار عرض مساحة عمل خاصة لتلك المبادرة. المخازن المختارة من السجل يتم تخزينها بالمعرّف؛ يقوم `--store-path` بتخزين محدد مسار محلي وقت التشغيل لأن عروض مساحة العمل هي حالة خاصة محلية.

يُصان OpenSpec `<workspace-name>.code-workspace` في جذر مساحة العمل لافتتاحيات VS Code و GitHub Copilot-in-VS-Code. هذا الملف هو حالة عرض مساحة العمل المحلية للآلة.

تسرد مساحة العمل VS Code المُصانة المستودعات أو المجلدات المرتبطة الصالحة أولاً، ثم سياق المبادرة عند إرفاقه، ثم ملفات مساحة العمل OpenSpec. تعرض VS Code تلك الإدخالات كمساحة عمل متعددة الجذور.

فتح مساحة العمل الجذر يجعل المستودعات أو المجلدات المرتبطة مرئية للاستكشاف والسياق. يجب أن تبدأ تعديلات التنفيذ فقط بعد طلب صريح من المستخدم وسير عمل تنفيذ OpenSpec عادي.

---

## أوامر السياق المشترك

سياقات التخزين والمبادرات هي أسطح تنسيق تجريبية. يُعد سياق التخزين (context store) تسجيلًا محليًا لسياق مشترك دائم، عادةً ما يكون مجلدًا مدعومًا بـ Git أو نسخة مستنسخة منه. أما المبادرة (initiative) فهي سياق تنسيق مشترك داخل سياق تخزين؛ يمكن للتغييرات المحلية في المستودع الربط بها دون نسخ الخطة المشتركة إلى كل مستودع.

### `openspec context-store setup`

إنشاء وتسجيل سياق تخزين محلي. بدون أي معطيات في الطرفية،
يقوم OpenSpec بتوجيه المستخدم خلال عملية الإعداد. ينبغي للوكلاء والسكربتات تمرير مدخلات صريحة واستخدام `--json`.

```bash
openspec context-store setup [id] [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--path <path>` | مسار مجلد سياق التخزين؛ الافتراضي هو دليل البيانات المحلية المُدار بواسطة OpenSpec |
| `--init-git` | تهيئة مستودع Git في سياق التخزين |
| `--no-init-git` | عدم تهيئة مستودع Git |
| `--json` | إخراج JSON |

عند حذف `--path`، يقوم الإعداد بإنشاء سياق التخزين تحت `getGlobalDataDir()/context-stores/<id>`: `$XDG_DATA_HOME/openspec/context-stores/<id>` عند تعيين `XDG_DATA_HOME`، أو `~/.local/share/openspec/context-stores/<id>` في أنظمة Unix البديلة. قم بتمرير `--path` عندما تريد أن يكون سياق التخزين في نسخة مستنسخة مرئية أو مجلد خاص بالفريق.

أمثلة:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

تسجيل مجلد سياق تخزين محلي موجود مسبقًا.

```bash
openspec context-store register [path] [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--id <id>` | معرّف سياق التخزين؛ الافتراضي هو البيانات الوصفية لسياق التخزين أو اسم المجلد |
| `--json` | إخراج JSON |

### `openspec context-store unregister`

نسيان تسجيل سياق تخزين محلي دون حذف الملفات.

```bash
openspec context-store unregister <id> [--json]
```

استخدم هذا الأمر عندما تم نقل سياق التخزين، أو استنساخه في مكان آخر، أو لم يعد ينبغي لـ OpenSpec عرضه على هذا الجهاز.

### `openspec context-store remove`

نسيان تسجيل سياق تخزين محلي وحذف مجلده المحلي.

```bash
openspec context-store remove <id> [--yes] [--json]
```

يعرض الأمر `remove` المجلد الدقيق قبل الحذف في الطرفية التفاعلية. يجب على الوكلاء والسكربتات ومتصلات JSON تمرير `--yes` لتأكيد الحذف. يرفض OpenSpec حذف مجلد لا يحتوي على بيانات وصفية مطابقة لسياق التخزين.

### `openspec context-store list`

عرض سياقات التخزين المحلية المسجلة.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

التحقق من تسجيل سياق التخزين المحلي والبيانات الوصفية ووجود Git.

```bash
openspec context-store doctor [id] [--json]
```

الدكتور للتشخيص فقط؛ يقوم بالإبلاغ عن الجذور المفقودة و عدم تطابق البيانات الوصفية وحالات السجل المحلي غير الصالحة دون تعديل سياق التخزين.

### `openspec initiative create`

إنشاء مبادرة في سياق تخزين.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--store <id>` | معرّف سياق التخزين من السجل المحلي |
| `--store-path <path>` | الجذر المحلي الموجود لسياق التخزين |
| `--title <title>` | عنوان المبادرة |
| `--summary <summary>` | ملخص المبادرة |
| `--json` | إخراج JSON |

### `openspec initiative list`

عرض المبادرات. بدون مُحدد، يقوم هذا الأمر بالبحث في جميع سياقات التخزين المسجلة ويُبلغ عن تحذيرات القراءة الجزئية في `status`.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------|
| `--store <id>` | عرض سياق تخزين مسجل واحد |
| `--store-path <path>` | عرض جذر محلي موجود لسياق تخزين واحد |
| `--json` | إخراج JSON |

### `openspec initiative show`

حل مبادرة وطباعة موقعها الرسمي.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

بدون `--store`، يقوم OpenSpec بالبحث في سياقات التخزين المسجلة. إذا كان نفس معرّف المبادرة موجودًا في عدة سياقات تخزين، قم بتمرير `--store <id>` أو استخدم الصيغة `<store>/<id>`.

---

## أوامر التصفية

### `openspec list`

إظهار التغييرات أو المواصفات في مشروعك.

```
openspec list [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--specs` | إظهار المواصفات بدلاً من التغييرات |
| `--changes` | إظهار التغييرات (الافتراضي) |
| `--sort <order>` | الترتيب حسب `recent` (الافتراضي) أو `name` |
| `--json` | الإخراج بصيغة JSON |

**أمثلة:**

```bash
# إظهار جميع التغييرات النشطة
openspec list

# إظهار جميع المواصفات
openspec list --specs

# إخراج JSON للسكربتات
openspec list --json
```

**الإخراج (نصي):**

```
التغييرات النشطة:
  add-dark-mode     تبديل سمة واجهة المستخدم
  fix-login-bug     معالجة انتهاء الجلسة
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
| `item-name` | لا | اسم التغيير أو المواصفة (يتم المطالبة به إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--type <type>` | تحديد النوع: `change` أو `spec` (يتم اكتشافه تلقائيًا إذا لم يكن غامضًا) |
| `--json` | الإخراج بصيغة JSON |
| `--no-interactive` | تعطيل المطالبات |

**خيارات خاصة بالتغييرات:**

| الخيار | الوصف |
|--------|-------------|
| `--deltas-only` | إظهار مواصفات الدلتا فقط (وضع JSON) |

**خيارات خاصة بالمواصفات:**

| الخيار | الوصف |
|--------|-------------|
| `--requirements` | إظهار المتطلبات فقط، باستثناء السيناريوهات (وضع JSON) |
| `--no-scenarios` | استبعاد محتوى السيناريو (وضع JSON) |
| `-r, --requirement <id>` | إظهار متطلب محدد حسب الفهرس القائم على 1 (وضع JSON) |

**أمثلة:**

```bash
# تحديد تفاعلي
openspec show

# إظهار تغيير محدد
openspec show add-dark-mode

# إظهار مواصفة محددة
openspec show auth --type spec

# إخراج JSON للتحليل
openspec show add-dark-mode --json
```

---

## أوامر التحقق من الصحة

### `openspec validate`

التحقق من صحة التغييرات والمواصفات بحثًا عن مشكلات بنيوية.

```
openspec validate [item-name] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `item-name` | لا | العنصر المحدد للتحقق (يتم المطالبة به إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--all` | التحقق من جميع التغييرات والمواصفات |
| `--changes` | التحقق من جميع التغييرات |
| `--specs` | التровер من جميع المواصفات |
| `--type <type>` | تحديد النوع عندما يكون الاسم غامضًا: `change` أو `spec` |
| `--strict` | تمكين وضع التحقق الصارم |
| `--json` | الإخراج بصيغة JSON |
| `--concurrency <n>` | الحد الأقصى للتحققات المتوازية (الافتراضي: 6، أو متغير البيئة `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | تعطيل المطالبات |

**أمثلة:**

```bash
# تحقق تفاعلي
openspec validate

# التحقق من تغيير محدد
openspec validate add-dark-mode

# التحقق من جميع التغييرات
openspec validate --changes

# التحقق من كل شيء مع إخراج JSON (لـ CI/السكربتات)
openspec validate --all --json

# تحقق صارم مع زيادة التوازي
openspec validate --all --strict --concurrency 12
```

**الإخراج (نصي):**

```
التحقق من add-dark-mode...
  ✓ proposal.md صالح
  ✓ specs/ui/spec.md صالح
  ⚠ design.md: مقطع "النهج التقني" مفقود

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
        "warnings": ["design.md: مقطع 'النهج التقني' مفقود"]
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
| `change-name` | لا | التغيير لأرشفته (يتم المطالبة به إذا تم حذفه) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `-y, --yes` | تخطي مطالبات التأكيد |
| `--skip-specs` | تخطي تحديثات المواصفات (للتغييرات المتعلقة بالبنية التحتية/الأدوات/المستندات فقط) |
| `--no-validate` | تخطي التحقق (يتطلب تأكيدًا) |

**أمثلة:**

```bash
# أرشفة تفاعلية
openspec archive

# أرشفة تغيير محدد
openspec archive add-dark-mode

# أرشفة بدون مطالبات (CI/السكربتات)
openspec archive add-dark-mode --yes

# أرشفة تغيير في الأدوات لا يؤثر على المواصفات
openspec archive update-ci-config --skip-specs
```

**ما يقوم به:**

1. التحقق من التغيير (ما لم يكن `--no-validate`)
2. المطالبة بالتأكيد (ما لم يكن `--yes`)
3. دمج مواصفات الدلتا في `openspec/specs/`
4. نقل مجلد التغيير إلى `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## أوامر سير العمل

تدعم هذه الأوامر سير عمل OPSX الموجه بالمنتجات. وهي مفيدة لكل من البشر الذين يتحققون من التقدم والوكلاء الذين يحددون الخطوات التالية.

### `openspec new change`

إنشاء دليل تغيير محلي في المستودع وبيانات تعريف اختيارية يمكن تسجيلها.

```bash
openspec new change <name> [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--description <text>` | وصف لإضافته إلى `README.md` |
| `--goal <text>` | هدف منتج مساحة العمل لتخزينه مع التغيير |
| `--areas <names>` | أسماء روابط مساحة العمل المتأثرة مفصولة بفواصل |
| `--initiative <id>` | ربط التغيير المحلي بالمستودع بمبادرة |
| `--store <id>` | معرّف مخزن السياق لـ `--initiative` |
| `--store-path <path>` | جذر مخزن سياق محلي موجود لـ `--initiative` |
| `--schema <name>` | مخطط سير العمل للاستخدام |
| `--json` | إخراج JSON |

أمثلة:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

تحديث بيانات تعريف التغيير المحلي للمستودع المسجلة دون إعادة إنشاء التغيير.

```bash
openspec set change <name> [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--initiative <id>` | ربط التغيير المحلي بالمستودع بمبادرة |
| `--store <id>` | معرّف مخزن السياق لـ `--initiative` |
| `--store-path <path>` | جذر مخزن سياق محلي موجود لـ `--initiative` |
| `--json` | إخراج JSON |

`set change --initiative` متكافئ عندما يكون الربط المطلوب موجودًا بالفعل ويرفض استبدال ربط مبادرة موجود مختلف.

### `openspec status`

عرض حالة اكتمال المنتجات لتغيير.

```
openspec status [options]
```

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--change <id>` | اسم التغيير (يتم المطالبة به إذا تم حذفه) |
| `--schema <name>` | تجاوز المخطط (يتم اكتشافه تلقائيًا من تكوين التغيير) |
| `--json` | الإخراج بصيغة JSON |

**أمثلة:**

```bash
# فحص حالة تفاعلي
openspec status

# حالة تغيير محدد
openspec status --change add-dark-mode

# JSON لاستخدام الوكيل
openspec status --change add-dark-mode --json
```

**الإخراج (نصي):**

```
التغيير: add-dark-mode
المخطط: spec-driven
التقدم: 2/4 منتجات مكتملة

[x] proposal
[ ] design
[x] specs
[-] tasks (محجوبة بواسطة: design)
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

الحصول على تعليمات غنية لإنشاء منتج أو تطبيق المهام. تُستخدم من قبل وكلاء الذكاء الاصطناعي لفهم ما يجب إنشاؤه بعد ذلك.

```
openspec instructions [artifact] [options]
```

**المعاملات:**

| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `artifact` | لا | معرّف المنتج: `proposal`، `specs`، `design`، `tasks`، أو `apply` |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--change <id>` | اسم التغيير (مطلوب في الوضع غير التفاعلي) |
| `--schema <name>` | تجاوز المخطط |
| `--json` | الإخراج بصيغة JSON |

**حالة خاصة:** استخدم `apply` كمنتج للحصول على تعليمات تنفيذ المهام.

**أمثلة:**

```bash
# الحصول على تعليمات المنتج التالي
openspec instructions --change add-dark-mode

# الحصول على تعليمات منتج محدد
openspec instructions design --change add-dark-mode

# الحصول على تعليمات التطبيق/التنفيذ
openspec instructions apply --change add-dark-mode

# JSON لاستهلاك الوكيل
openspec instructions design --change add-dark-mode --json
```

**يتضمن الإخراج:**

- محتوى القالب للمنتج
- سياق المشروع من التكوين
- محتوى منتجات الاعتماد
- قواعد لكل منتج من التكوين

---

### `openspec templates`

عرض مسارات القوالب المحلولة لجميع المنتجات في مخطط.

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
# عرض مسارات القوالب للمخطط الافتراضي
openspec templates

# عرض القوالب لمخطط مخصص
openspec templates --schema my-workflow

# JSON للاستخدام البرمجي
openspec templates --json
```

**الإخراج (نصي):**

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

عرض مخططات سير العمل المتاحة مع أوصافها وتدفقات المنتجات.

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

  spec-driven (package)
    سير عمل التطوير الموجه بالمواصفات الافتراضي
    التدفق: proposal → specs → design → tasks

  my-custom (project)
    سير عمل مخصص لهذا المشروع
    التدفق: research → proposal → tasks
```

---

## أوامر المخططات

أوامر لإنشاء وإدارة مخططات سير العمل المخصصة.

### `openspec schema init`

إنشاء مخطط جديد على مستوى المشروع.

```
openspec schema init <name> [options]
```

**الوسائط:**

| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `name` | نعم | اسم المخطط (kebab-case) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--description <text>` | وصف المخطط |
| `--artifacts <list>` | معرّفات العناصر مفصولة بفواصل (الافتراضي: `proposal,specs,design,tasks`) |
| `--default` | تعيين كمخطط افتراضي للمشروع |
| `--no-default` | لا تطلب التعيين كمخطط افتراضي |
| `--force` | استبدال المخطط الموجود |
| `--json` | الإخراج كـ JSON |

**أمثلة:**

```bash
# إنشاء مخطط تفاعلي
openspec schema init research-first

# غير تفاعلي مع عناصر محددة
openspec schema init rapid \
  --description "سير عمل التكرار السريع" \
  --artifacts "proposal,tasks" \
  --default
```

**ما يُنشأ:**

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

نسخ مخطط موجود إلى مشروعك لتخصيصه.

```
openspec schema fork <source> [name] [options]
```

**الوسائط:**

| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `source` | نعم | المخطط المراد نسخه |
| `name` | لا | اسم المخطط الجديد (الافتراضي: `<source>-custom`) |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--force` | استبدال الوجهة الموجودة |
| `--json` | الإخراج كـ JSON |

**مثال:**

```bash
# نسخ مخطط spec-driven المدمج
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

التحقق من صحة بنية المخطط وقوالبه.

```
openspec schema validate [name] [options]
```

**الوسائط:**

| الوسيط | مطلوب | الوصف |
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

عرض مكان تحليل المخطط منه (مفيد لتصحيح أخطاء الأولوية).

```
openspec schema which [name] [options]
```

**الوسائط:**

| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `name` | لا | اسم المخطط |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--all` | عرض جميع المخططات مع مصادرها |
| `--json` | الإخراج كـ JSON |

**مثال:**

```bash
# التحقق من مصدر مخطط ما
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

عرض وتعديل تكوين OpenSpec العام.

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
| `reset` | إعادة التعيين إلى الافتراضيات |
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

# إعادة تعيين كل التكوين
openspec config reset --all --yes

# تحرير التكوين في المحرر
openspec config edit

# تكوين الملف الشخصي باستخدام معالج قائم على الإجراءات
openspec config profile

# إعداد مسبق سريع: تبديل سير العمل إلى الأساسي (يحتفظ بوضع التسليم)
openspec config profile core
```

يبدأ أمر `openspec config profile` بملخص للحالة الحالية، ثم يتيح لك الاختيار:
- تغيير التسليم + سير العمل
- تغيير التسليم فقط
- تغيير سير العمل فقط
- الحفاظ على الإعدادات الحالية (خروج)

إذا حافظت على الإعدادات الحالية، لن يتم كتابة أي تغييرات ولن يظهر مطالبة بالتحديث.
إذا لم يكن هناك تغييرات في التكوين ولكن كانت ملفات المشروع أو مساحة العمل الحالية غير متزامنة مع ملفك الشخصي/التسليم العالمي، سيعرض OpenSpec تحذيرًا ويقترح `openspec update` للمشاريع المحلية للمستودع أو `openspec workspace update` لإرشادات ومهارات مساحة العمل المحلية.
الضغط على `Ctrl+C` أيضًا يلغي التدفق بشكل نظيف (بدون تتبع مكدس) ويخرج بالكود `130`.
في قائمة التحقق من سير العمل، تعني `[x]` أن سير العمل محدد في التكوين العالمي. لتطبيق هذه الاختيارات على ملفات المشروع، قم بتشغيل `openspec update` (أو اختر `Apply changes to this project now?` عند المطالبة من داخل مشروع). من داخل مساحة العمل، استخدم `openspec workspace update` لتحديث إرشادات ومهارات مساحة العمل المحلية؛ يبقى هذا على المهارات فقط لملفات سير عمل الوكيل المولدة ولا يُنشئ أوامر شرطة مائلة لمساحة العمل.

**أمثلة تفاعلية:**

```bash
# تحديث التسليم فقط
openspec config profile
# choose: Change delivery only
# choose delivery: Skills only

# تحديث سير العمل فقط
openspec config profile
# choose: Change workflows only
# toggle workflows in the checklist, then confirm
```

---

## أوامر المساعدة

### `openspec feedback`

تقديم ملاحظات حول OpenSpec. يُنشئ مشكلة على GitHub.

```
openspec feedback <message> [options]
```

**الوسائط:**

| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `message` | نعم | رسالة الملاحظات |

**الخيارات:**

| الخيار | الوصف |
|--------|-------------|
| `--body <text>` | وصف مفصل |

**المتطلبات:** يجب تثبيت سطر أوامر GitHub (`gh`) والمصادقة عليه.

**مثال:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

إدارة إكمالات Shell لسطر أوامر OpenSpec.

```
openspec completion <subcommand> [shell]
```

**الأوامر الفرعية:**

| الأمر الفرعي | الوصف |
|------------|-------------|
| `generate [shell]` | إخراج سكربت الإكمال إلى stdout |
| `install [shell]` | تثبيت الإكمال لـ shell الخاص بك |
| `uninstall [shell]` | إزالة الإكمالات المثبتة |

**الـ Shells المدعومة:** `bash`، `zsh`، `fish`، `powershell`

**أمثلة:**

```bash
# تثبيت الإكمالات (يكتشف الـ shell تلقائيًا)
openspec completion install

# التثبيت لـ shell محدد
openspec completion install zsh

# توليد سكربت للتثبيت اليدوي
openspec completion generate bash > ~/.bash_completion.d/openspec

# إلغاء التثبيت
openspec completion uninstall
```

---

## أكواد الخروج

| الكود | المعنى |
|------|---------|
| `0` | نجاح |
| `1` | خطأ (فشل التحقق، ملفات مفقودة، إلخ) |

---

## متغيرات البيئة

| المتغير | الوصف |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | اضبط على `0` لتعطيل التتبع |
| `DO_NOT_TRACK` | اضبط على `1` لتعطيل التتبع (إشارة DNTقياسية) |
| `OPENSPEC_CONCURRENCY` | عدد العمليات المتزامنة الافتراضي للتحقق بالجملة (الافتراضي: 6) |
| `EDITOR` أو `VISUAL` | المحرر لأمر `openspec config edit` |
| `NO_COLOR` | تعطيل إخراج الألوان عند تعيينه |

---

## التوثيق ذي الصلة

- [الأوامر](commands.md) - أوامر شرطة مائلة للذكاء الاصطناعي (`/opsx:propose`، `/opsx:apply`، إلخ)
- [سير العمل](workflows.md) - الأنماط الشائعة ومتى يتم استخدام كل أمر
- [التخصيص](customization.md) - إنشاء مخططات وقوالب مخصصة
- [البدء](getting-started.md) - دليل الإعداد الأولي