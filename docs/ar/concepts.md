# المفاهيم

يشرح هذا الدليل الأفكار الأساسية وراء OpenSpec وكيفية ترابطها. للاستخدام العملي، راجع [البدء](getting-started.md) و[سير العمل](workflows.md).

## الفلسفة

OpenSpec مبني حول أربعة مبادئ:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### لماذا هذه المبادئ مهمة

**مرن وليس جامداً.** تقيدك أنظمة المواصفات التقليدية في مراحل: أولاً تخطط، ثم تنفذ، ثم تنتهي. OpenSpec أكثر مرونة — يمكنك إنشاء المخرجات بأي ترتيب يناسب عملك.

**تكراري وليس شلالياً.** المتطلبات تتغير. الفهم يتعمق. ما بدا كنهج جيد في البداية قد لا يصمد بعد رؤية قاعدة التعليمات البرمجية. OpenSpec يتبنى هذه الحقيقة.

**سهل وليس معقداً.** تتطلب بعض أطر المواصفات إعداداً مكثفاً، أو صيغ صارمة، أو عمليات ثقيلة الوزن. OpenSpec لا يعترض طريقك. قم بالتهيئة في ثوانٍ، وابدأ العمل فوراً، وقم بالتخصيص فقط إذا لزم الأمر.

**أولوية للأنظمة القائمة.** معظم أعمال البرمجيات ليست بناءً من الصفر — بل هي تعديل أنظمة قائمة. يجعل نهج OpenSpec القائم على الدلتا من السهل تحديد التغييرات على السلوك الحالي، وليس فقط وصف أنظمة جديدة.

## الصورة الكبيرة

ينظم OpenSpec عملك في مجالين رئيسيين:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**المواصفات (Specs)** هي المصدر الأساسي — إنها تصف سلوك نظامك الحالي.

**التغييرات (Changes)** هي تعديلات مقترحة — توجد في مجلدات منفصلة حتى تكون جاهزًا لدمجها.

هذا الفصل هو المفتاح. يمكنك العمل على عدة تغييرات بالتوازي دون تعارضات. يمكنك مراجعة التغيير قبل أن يؤثر على المواصفات الرئيسية. وعند أرشفة تغيير، تندمج تعديلاته (deltas) بسلاسة في المصدر الأساسي.

## مساحات عمل التنسيق

دعم مساحات العمل قيد التطوير النشط وغير جاهز للاستخدام بعد. لا تبنِ أتمتة خارجية أو تكاملات أو سير عمل طويلة الأمد فوق سلوك مساحة العمل؛ الأوامر وملفات الحالة ومخرجات JSON يمكن أن تتغير في أي وقت.

توفر الأوامر أدناه تدفق الإعداد الأولي للتخطيط عبر مستودعات أو مجلدات مرتبطة.

مشاريع OpenSpec المحلية للمستودع هي الخيار الافتراضي الصحيح عندما يمتلك مستودع واحد تدفق التخطيط والتنفيذ والأرشفة. يمتد بعض العمل عبر عدة مستودعات أو مجلدات. لهذه الحالة، تعد مساحة عمل تنسيق OpenSpec موطن التخطيط الدائم.

النموذج الذهبي لمساحة العمل هو:

```text
workspace = where related cross-repo changes live
link      = a stable name for a repo or folder the workspace can plan against
change    = one feature, fix, project, or other planned piece of work
```

لمساحة العمل شكل مختلف عن المشروع المحلي للمستودع:

```text
workspace-folder/
├── changes/                       # Workspace-level planning
└── .openspec-workspace/
    ├── workspace.yaml             # Shared workspace identity and link names
    └── local.yaml                 # This machine's local paths
```

يحتفظ حالة OpenSpec المحلية للمستودع بالشكل الحالي:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

هذا التمييز مهم. مجلد مساحة العمل هو سطح تنسيق للتخطيط عبر المستودعات أو المجلدات المرتبطة. يظل دليل `openspec/` لكل مستودع هو الموطن للمواصفات التي يمتلكها المستودع، والتغييرات المحلية للمستودع، وتخطيط التنفيذ. لا يحتاج المستخدمون إلى تشغيل `openspec init` المحلي للمستودع داخل مجلد مساحة العمل.

أسماء الروابط المستقرة هي الطريقة التي يشير بها تخطيط مساحة العمل إلى المستودعات والمجلدات. تحتفظ حالة مساحة العمل المشتركة بأسماء مثل `api` أو `web` أو `checkout`؛ يقوم كل جسم بتعيين هذه الأسماء إلى مساراته المحلية في `.openspec-workspace/local.yaml`.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

تستبعد مساحات العمل التي أنشأها OpenSpec ملف `.openspec-workspace/local.yaml` من حالة التعاون المحمولة بشكل افتراضي. يظل ملف `.openspec-workspace/workspace.yaml` متحركًا لأنه يخزن اسم مساحة العمل وأسماء الروابط المستقرة، وليس مسارات الفحص المطلقة لمستخدم معين.

يمكن أن تكون المسارات المرتبطة مستودعات كاملة، أو مجلدات داخل مستودع أحادي كبير، أو مجلدات موجودة أخرى. لا تحتاج إلى حالة `openspec/` محلية للمستودع قبل أن تتمكن من المشاركة في تخطيط مساحة العمل. قد تتطلب سير عمل التنفيذ أو التحقق أو الأرشفة اللاحق مزيدًا من جاهزية المستودع، لكن تبدأ الرؤية للتخطيط بالرابط.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

تقع مساحات العمل المُدارة تحت دليل بيانات OpenSpec القياسي:

```text
getGlobalDataDir()/workspaces
```

وهذا يعني `$XDG_DATA_HOME/openspec/workspaces` عندما يكون `XDG_DATA_HOME` مُعيّنًا، و`~/.local/share/openspec/workspaces` في نظام Unix كخيار احتياطي، و`%LOCALAPPDATA%\openspec\workspaces` في نظام Windows الأصلي كخيار احتياطي. تحتفظ أجهزة Windows الأصلية وPowerShell وWSL2 كل منها بسلاسل المسارات للوقت التشغيلي الذي يشغّل OpenSpec. لا تترجم هذه الأساسيات بين `D:\repo` و`/mnt/d/repo` ومسارات UNC WSL.

يحافظ OpenSpec أيضًا على سجل محلي للجهاز في:

```text
getGlobalDataDir()/workspaces/registry.yaml
```

يقوم السجل بتعيين أسماء مساحات العمل إلى مواقعها حتى تتمكن الأوامر العامة اللاحقة من سرد مساحات العمل المعروفة أو اختيارها من أي مكان. إنه مجرد فهرس. يظل كل مجلد مساحة العمل هو المرجع النهائي لملف `.openspec-workspace/workspace.yaml` وملف `.openspec-workspace/local.yaml` الخاص به، بحيث يمكن الإبلاغ عن سجلات السجل القديمة وإصلاحها دون إعادة تعريف مساحة العمل نفسها.

رؤية مساحة العمل ليست التزامًا بالتغيير. قم بإعداد مساحة عمل عندما يجب أن يعرف OpenSpec أي مستودعات أو مجلدات ذات صلة؛ قم بإنشاء تغيير لاحقًا عندما تكون جاهزًا لتخطيط ميزة أو إصلاح أو مشروع أو قطعة عمل أخرى.

أوامر مفيدة:

```bash
# Guided setup
openspec workspace setup

# Automation-friendly setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# See known workspaces from the local registry
openspec workspace list
openspec workspace ls

# Add or repair links for the selected workspace
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Check what this machine can resolve
openspec workspace doctor
openspec workspace doctor --workspace platform

# Open the linked working set
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

يقوم `workspace setup` دائمًا بإنشاء مساحة العمل في موقع مساحة العمل القياسي، ويسجلها في السجل المحلي، ويعرض موقع مساحة العمل، ويتطلب مستودعًا أو مجلدًا واحدًا مرتبطًا على الأقل. يطلب الإعداد التفاعلي أداة فتح مفضلة. يخزن الإعداد غير التفاعلي واحدة فقط عند توفير `--opener codex` أو `--opener claude` أو `--opener github-copilot` أو `--opener editor`.

يحافظ OpenSpec أيضًا على ملفات فتح مساحة العمل الجذرية: كتلة إرشادية يديرها OpenSpec في `AGENTS.md`، وملف `<workspace-name>.code-workspace` محلي للجهاز لفتح VS Code وGitHub Copilot-in-VS-Code، وتجاهل محدد لذلك الملف الذي تتم صيانته `.code-workspace`. تظل ملفات `*.code-workspace` التي أنشأها المستخدم قابلة للتتبع لأن قاعدة التجاهل تستهدف فقط الملف الذي تتم صيانته.

تتضمن مساحة عمل VS Code التي تتم صيانتها جذر التنسيق كـ `.` بالإضافة إلى مستودعات أو مجلدات مرتبطة صالحة كجذور إضافية. يعرض VS Code تلك الإدخالات كمساحة عمل متعددة الجذور.

يفتح `workspace open` مجموعة العمل المرتبطة بأداة الفتح المفضلة المخزنة ما لم يتم تمرير `--agent <tool>` أو `--editor` لتلك الجلسة. تمرير كلا تجاوزات الأداة هو خطأ. يفتح فتح مساحة العمل الجذرية المستودعات والمجلدات المرتبطة لجعلها مرئية للاستكشاف والتخطيط؛ يبدأ التنفيذ بعد أن يطلب المستخدم صراحةً عمل التنفيذ.

يقوم `workspace link` و`workspace relink` بتسجيل المجلدات الموجودة فقط؛ لا يقومان بإنشاء أو نسخ أو نقل أو تهيئة أو تحرير المستودع أو المجلد المرتبط. بعد الارتباط أو إعادة الارتباط الناجح، يقوم OpenSpec بتحديث الإرشادات المُدارة، وملف مساحة عمل VS Code، وقاعدة التجاهل.

أوامر مساحة العمل التي تحتاج إلى مساحة عمل واحدة يمكن تشغيلها من أي مكان باستخدام `--workspace <name>`. إذا قمت بتشغيلها داخل مجلد مساحة العمل أو دليل فرعي، يستخدم OpenSpec مساحة العمل الحالية تلك. إذا كانت عدة مساحات عمل معروفة متاحة ولم تمرر `--workspace <name>`، تعرض الأوامر البشرية أداة انتقاء؛ تفشل `--json` و`--no-interactive` مع خطأ حالة منظمة بدلاً من المطالبة.

تدعم أوامر مساحة العمل المباشرة مخرجات JSON للنصوص البرمجية. تحتفظ استجابات JSON بالبيانات الأساسية في كائنات `workspace` أو `workspaces` أو `link` وتبلغ عن التحذيرات أو الأخطاء في مصفوفات `status`. تستخدم الكائنات السليمة `status: []`.

## المواصفات

تصف المواصفات سلوك نظامك باستخدام المتطلبات والسيناريوهات المنظمة.

### الهيكل

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

نظم المواصفات حسب المجال — تجميعات منطقية منطقية بالنسبة لنظامك. الأنماط الشائعة:

- **حسب منطقة الميزة**: `auth/`، `payments/`، `search/`
- **حسب المكون**: `api/`، `frontend/`، `workers/`
- **حسب السياق المحدود**: `ordering/`، `fulfillment/`، `inventory/`

### صيغة المواصفة

تحتوي المواصفة على متطلبات، ولكل متطلب سيناريوهات:

```markdown
# Auth Specification
```

## الغرض
المصادقة وإدارة الجلسات للتطبيق.

## المتطلبات

### متطلب: مصادقة المستخدم
يجب أن يُصدر النظام رمز JWT عند نجاح عملية تسجيل الدخول.

#### سيناريو: بيانات اعتماد صالحة
- بوجود مستخدم لديه بيانات اعتماد صالحة
- عندما يرسل المستخدم نموذج تسجيل الدخول
- عندها يتم إرجاع رمز JWT
- ويتم إعادة توجيه المستخدم إلى لوحة التحكم

#### سيناريو: بيانات اعتماد غير صالحة
- بوجود بيانات اعتماد غير صالحة
- عندما يرسل المستخدم نموذج تسجيل الدخول
- عندها يتم عرض رسالة خطأ
- ولا يتم إصدار أي رمز

### متطلب: انتهاء صلاحية الجلسة
يجب أن تُنهي الجلسات صلاحيتها بعد 30 دقيقة من عدم النشاط.

#### سيناريو: انتهاء المهلة بسبب الخمول
- بوجود جلسة مصادق عليها
- عندما تمر 30 دقيقة دون نشاط
- عندها يتم إبطال الجلسة
- ويجب على المستخدم إعادة المصادقة
```

**العناصر الأساسية:**

| العنصر | الغرض |
|---------|---------|
| `## Purpose` | وصف على مستوى عالٍ لمجال هذا المواصفات |
| `### Requirement:` | سلوك محدد يجب أن يمتلكه النظام |
| `#### Scenario:` | مثال ملموس للمتطلب أثناء التنفيذ |
| SHALL/MUST/SHOULD | كلمات مفتاحية من RFC 2119 تشير إلى قوة المتطلب |

### لماذا يتم هيكلة المواصفات بهذه الطريقة

**المتطلبات هي "ماذا"** — تنص على ما يجب أن يفعله النظام دون تحديد التنفيذ.

**السيناريوهات هي "متى"** — توفر أمثلة ملموسية يمكن التحقق منها. السيناريوهات الجيدة:
- قابلة للاختبار (يمكنك كتابة اختبار آلي لها)
- تغطي المسار السعيد وحالات الحواف
- تستخدم صيغة Given/When/Then أو تنسيق منظم مشابه

**كلمات مفتاحية من RFC 2119** (SHALL، MUST، SHOULD، MAY) تنقل النية:
- **MUST/SHALL** — متطلب مطلق
- **SHOULD** — موصى به، لكن توجد استثناءات
- **MAY** — اختياري

### ما هي المواصفات (وما ليست)

المواصفات هي **عقد سلوك**، وليس خطة تنفيذ.

محتوى المواصفات الجيد:
- سلوك مراقب يعتمد عليه المستخدمون أو الأنظمة التابعة
- المدخلات والمخرجات وحالات الخطأ
- القيود الخارجية (الأمان، الخصوصية، الموثوقية، التوافق)
- سيناريوهات يمكن اختبارها أو التحقق منها صراحةً

تجنّب في المواصفات:
- أسماء الفئات/الدوال الداخلية
- مكتبات أو أطر عمل محددة
- تفاصيل التنفيذ خطوة بخطوة
- خطط تنفيذ مفصلة (تلك تنتمي إلى `design.md` أو `tasks.md`)

اختبار سريع:
- إذا كان يمكن تغيير التنفيذ دون تغيير السلوك المرئي خارجيًا، فعلى الأرجح لا ينتمي إلى المواصفات.

### اجعلها خفيفة: الدقة التدريجية

يهدف OpenSpec إلى تجنب البيروقراطية. استخدم أخف مستوى لا يزال يجعل التغيير قابلاً للتحقق.

**مواصفات مبسطة (الافتراضي):**
- متطلبات قصيرة تركز على السلوك
- نطاق واضح وأهداف غير مرغوب فيها
- عدد قليل من عمليات القبول الملموسية

**مواصفات كاملة (لمخاطر أعلى):**
- تغييرات عبر الفرق أو المستودعات
- تغييرات في واجهة برمجة التطبيقات/العقد، الترحيل، مخاوف تتعلق بالأمن/الخصوصية
- تغييرات حيث من المحتمل أن يسبب الغموض إعادة عمل مكلفة

يجب أن تظل معظم التغييرات في الوضع المبسط.

### التعاون بين الإنسان والوكيل

في العديد من الفرق، يستكشف البشر وينشئ الوكلاء المسودات. الحلقة المقصودة هي:

1. يوفر الإنسان النية والسياق والقيود.
2. يحول الوكيل هذا إلى متطلبات تركز على السلوك وسيناريوهات.
3. يحتفظ الوكيل بتفاصيل التنفيذ في `design.md` و`tasks.md`، وليس في `spec.md`.
4. يؤكد التحقق من الهيكل والوضوح قبل التنفيذ.

هذا يحافظ على قراءة المواصفات للبشر واتساقها للوكلاء.

## التغييرات

التغيير هو تعديل مقترح على نظامك، مُغلف كمجلد يحتوي على كل ما يلزم لفهمه وتنفيذه.

### هيكل التغيير

```
openspec/changes/add-dark-mode/
├── proposal.md           # لماذا وماذا
├── design.md             # كيف (النهج التقني)
├── tasks.md              # قائمة التحقق للتنفيذ
├── .openspec.yaml        # بيانات التغيير الوصفية (اختياري)
└── specs/                # مواصفات التغيير
    └── ui/
        └── spec.md       # ما يتغير في ui/spec.md
```

كل تغيير مكتفٍ ذاتي. يحتوي على:
- **منتجات** — مستندات تلتقط النية والتصميم والمهام
- **مواصفات التغيير** — مواصفات لما يتم إضافته أو تعديله أو إزالته
- **البيانات الوصفية** — تكوين اختياري لهذا التغيير المحدد

### لماذا التغييرات مجلدات

تغليف التغيير كمجلد له عدة فوائد:

1. **كل شيء معاً.** الاقتراح والتصميم والمهام والمواصفات تعيش في مكان واحد. لا حاجة للبحث في مواقع مختلفة.

2. **العمل المتوازي.** يمكن أن تتواجد تغييرات متعددة في وقت واحد دون تعارض. العمل على `add-dark-mode` بينما `fix-auth-bug` قيد التنفيذ أيضاً.

3. **تاريخ نظيف.** عند الأرشفة، تنتقل التغييرات إلى `changes/archive/` مع الحفاظ على سياقها الكامل. يمكنك النظر إلى الوراء وفهم ليس فقط ما تغير، بل لماذا.

4. **مريح للمراجعة.** مجلد التغيير سهل المراجعة — افتحه، اقرأ الاقتراح، تحقق من التصميم، شَهَد تغيرات المواصفات.

## المنتجات

المنتجات هي المستندات داخل التغيير التي توجه العمل.

### تدفق المنتجات

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

المنتجات تبني على بعضها البعض. كل منتج يوفر السياق للمنتج التالي.

### أنواع المنتجات

#### الاقتراح (`proposal.md`)

يلتقط الاقتراح **النطاق** و**النية** و**النهج** على مستوى عالٍ.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**متى يتم تحديث الاقتراح:**
- تغير النطاق (تضييق أو توسيع)
- توضيح النية (فهم أفضل للمشكلة)
- تغيير جذري في النهج

#### المواصفات (مواصفات التغيير في `specs/`)

تصف مواصفات التغيير **ما يتغير** بالنسبة للمواصفات الحالية. انظر [مواصفات التغيير](#delta-specs) أدناه.

#### التصميم (`design.md`)

يلتقط التصميم **النهج التقني** و**قرارات الهندسة المعمارية**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**متى يتم تحديث التصميم:**
- يكشف التنفيذ أن النهج لن يعمل
- اكتشاف حل أفضل
- تغيير الاعتماديات أو القيود

#### المهام (`tasks.md`)

المهام هي **قائمة التحقق للتنفيذ** — خطوات ملموسة مع مربعات اختيار.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**أفضل الممارسات للمهام:**
- تجميع المهام ذات الصلة تحت عناوين
- استخدام الترقيم الهرمي (1.1، 1.2، إلخ)
- إبقاء المهام صغيرة بما يكفي لإكمالها في جلسة واحدة
- تحديد المهام كمكتملة عند إنجازها

## مواصفات التغيير

مواصفات التغيير هي المفهوم الرئيسي الذي يجعل OpenSpec يعمل للتطوير على الأنظمة القائمة. تصف **ما يتغير** بدلاً من إعادة صياغة المواصفات بالكامل.

### الصيغة

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### أقسام التغيير

| القسم | المعنى | ما يحدث عند الأرشفة |
|---------|---------|------------------------|
| `## ADDED Requirements` | سلوك جديد | يُلحق بالمواصفات الرئيسية |
| `## MODIFIED Requirements` | سلوك متغير | يستبدل المتطلب الحالي |
| `## REMOVED Requirements` | سلوك مهمل | يُحذف من المواصفات الرئيسية |

### لماذا التغييرات بدلاً من المواصفات الكاملة

**الوضوح.** يُظهر التغيير بالضبط ما يتغير. عند قراءة المواصفات الكاملة، سيتعين عليك مقارنتها ذهنياً مع الإصدار الحالي.

**تجنب التعارض.** يمكن أن يلمس تغييران نفس ملف المواصفات دون تعارض، طالما أنهما يعدلان متطلبات مختلفة.

**كفاءة المراجعة.** يرى المراجعون التغيير، وليس السياق غير المتغير. التركيز على ما يهم.

**ملاءمة الأنظمة القائمة.** معظم العمل يعدل السلوك الحالي. تجعل التغييرات التعديلات من الدرجة الأولى، وليس فكرة لاحقة.

## المخططات

تحدد المخططات أنواع المُصنَّفات واعتمادياتها لسير العمل.

### كيف تعمل المخططات

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # لا توجد اعتمادات، يمكن إنشاؤه أولاً

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # يحتاج إلى الاقتراح قبل الإنشاء

  - id: design
    generates: design.md
    requires: [proposal]      # يمكن إنشاؤه بالتوازي مع المواصفات

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # يحتاج إلى كل من المواصفات والتصميم أولاً
```

**تشكل المُصنَّفات رسمًا بيانيًا للاعتمادية:**

```
                    proposal
                   (العقدة الجذرية)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (يعتمد على:                  (يعتمد على:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (يعتمد على:
                specs, design)
```

**الاعتماديات هي مُمَكِّنات، وليست بوابات.** تُظهر ما يمكن إنشاؤه، وليس ما يجب إنشاؤه بعد ذلك. يمكنك تخطي التصميم إذا لم تكن بحاجة إليه. يمكنك إنشاء المواصفات قبل التصميم أو بعده - كلاهما يعتمد فقط على الاقتراح.

### المخططات المدمجة

**spec-driven** (الافتراضي)

سير العمل القياسي للتطوير المُوجَّه بالمواصفات:

```
proposal → specs → design → tasks → implement
```

الأفضل لـ: معظم أعمال الميزات حيث تريد الاتفاق على المواصفات قبل التنفيذ.

### المخططات المخصصة

أنشئ مخططات مخصصة لسير عمل فريقك:

```bash
# إنشاء من الصفر
openspec schema init research-first

# أو نسخ مخطط موجود
openspec schema fork spec-driven research-first
```

**مثال على مخطط مخصص:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # إجراء البحث أولاً

  - id: proposal
    generates: proposal.md
    requires: [research]   # الاقتراح مبني على البحث

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # تخطي المواصفات/التصميم، والانتقال مباشرة إلى المهام
```

انظر [التخصيص](customization.md) للحصول على تفاصيل كاملة حول إنشاء واستخدام المخططات المخصصة.

## الأرشيف

يُكمل الأرشيف التغيير من خلال دمج مواصفات الدلتا الخاصة به في المواصفات الرئيسية والحفاظ على التغيير للتاريخ.

### ماذا يحدث عند الأرشفة

```
قبل الأرشفة:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ دمج
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


بعد الأرشفة:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # تتضمن الآن متطلبات المصادقة الثنائية
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # محفوظ للتاريخ
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### عملية الأرشفة

1. **دمج الدلتا.** يتم تطبيق كل قسم مواصفات دلتا (مُضاف/مُعدَّل/مُزال) على المواصفات الرئيسية المقابلة.

2. **النقل إلى الأرشيف.** ينتقل مجلد التغيير إلى `changes/archive/` مع بادئة تاريخية للترتيب الزمني.

3. **الحفاظ على السياق.** تظل جميع المُصنَّفات سليمة في الأرشيف. يمكنك دائمًا الرجوع للخلف لفهم سبب إجراء التغيير.

### لماذا يهم الأرشيف

**حالة نظيفة.** يُظهر التغييرات النشطة (`changes/`) فقط العمل قيد التنفيذ. ينتقل العمل المكتمل بعيدًا.

**سجل التدقيق.** يحافظ الأرشيف على السياق الكامل لكل تغيير - ليس فقط ما تغير، بل الاقتراح الذي يشرح السبب، والتصميم الذي يشرح الكيفية، والمهام التي تُظهر العمل المنجز.

**تطور المواصفات.** تنمو المواصفات بشكل عضوي مع أرشفة التغييرات. يدمج كل أرشيف دلتا الخاصة به، مما يُبني مواصفات شاملة بمرور الوقت.

## كيف يتناسب كل شيء معًا

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              سير عمل OPENSPEC                                │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. البدء      │  /opsx:propose (أساسي) أو /opsx:new (موسّع)            │
│   │     بتغيير     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. إنشاء      │  /opsx:ff أو /opsx:continue (سير عمل موسّع)            │
│   │     المُصنَّفات│  إنشاء اقتراح → مواصفات → تصميم → مهام                  │
│   │                │  (بناءً على اعتمادات المخطط)                            │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. تنفيذ      │  /opsx:apply                                            │
│   │     المهام     │  العمل على المهام وتحديدها كمكتملة                      │
│   │                │◄──── تحديث المُصنَّفات أثناء التعلم                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. التحقق     │  /opsx:verify (اختياري)                                 │
│   │     من العمل   │  التحقق من تطابق التنفيذ مع المواصفات                   │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. أرشفة      │────►│  مواصفات الدلتا تندمج في المواصفات الرئيسية │    │
│   │     التغيير    │     │  مجلد التغيير ينتقل إلى الأرشيف/            │    │
│   └────────────────┘     │  المواصفات هي الآن مصدر الحقيقة المحدَّث   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**الدورة الفاضلة:**

1. تصف المواصفات السلوك الحالي
2. تقترح التغييرات تعديلات (كدلتا)
3. يجعل التنفيذ التغييرات حقيقية
4. يدمج الأرشيف الدلتا في المواصفات
5. تصف المواصفات الآن السلوك الجديد
6. يبني التغيير التالي على المواصفات المحدَّثة

## المصطلحات

| المصطلح | التعريف |
|---------|---------|
| **Artifact (مُصنَّف)** | وثيقة داخل تغيير (اقتراح، تصميم، مهام، أو مواصفات دلتا) |
| **Archive (أرشيف)** | عملية إكمال تغيير ودمج الدلتا الخاصة به في المواصفات الرئيسية |
| **Change (تغيير)** | تعديل مقترح على النظام، مُجمَّع كمجلد يحتوي على مُصنَّفات |
| **Delta spec (مواصفات دلتا)** | مواصفات تصف التغييرات (مُضاف/مُعدَّل/مُزال) مقارنة بالمواصفات الحالية |
| **Domain (مجال)** | تجميع منطقي للمواصفات (مثل `auth/`، `payments/`) |
| **Requirement (متطلب)** | سلوك محدد يجب أن يمتلكه النظام |
| **Scenario (سيناريو)** | مثال ملموس على متطلب، عادةً بتنسيق Given/When/Then |
| **Schema (مخطط)** | تعريف لأنواع المُصنَّفات واعتمادياتها |
| **Spec (مواصفات)** | وصف لسلوك النظام، يحتوي على متطلبات وسيناريوهات |
| **Source of truth (مصدر الحقيقة)** | دليل `openspec/specs/`، يحتوي على السلوك المتفق عليه حاليًا |

## الخطوات التالية

- [البدء](getting-started.md) - خطوات عملية أولى
- [سير العمل](workflows.md) - الأنماط الشائعة ومتى يتم استخدام كل منها
- [الأوامر](commands.md) - مرجع الأوامر الكامل
- [التخصيص](customization.md) - إنشاء مخططات مخصصة وتكوين مشروعك