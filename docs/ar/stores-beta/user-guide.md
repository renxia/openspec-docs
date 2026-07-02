# المستودعات (Stores): التخطيط في مستودعه الخاص

> **نسخة تجريبية (Beta).** إن المستودعات والمراجع وسياق العمل ومجموعات العمل هي ميزات جديدة. قد تتغير أسماء الأوامر والعلامات وملفات JSON وشكل المخرجات بين الإصدارات. تم تشغيل كل دليل أدناه مقابل البناء الحالي، ولكن يرجى إعادة قراءة هذا الدليل بعد الترقية.

## المشكلة التي يحلها هذا الأمر

عادةً ما يكون OpenSpec موجودًا داخل مستودع كود واحد: مجلد `openspec/` بجوار الكود الخاص بك، ويحتوي على المواصفات والتغييرات الخاصة بذلك المستودع.

لكن هذا لم يعد مناسبًا عندما يصبح تخطيطك أكبر من مستودع واحد:

- يمتد عملك عبر عدة مستودعات — قد يمسّ أحد الميزات خادم الـ API وتطبيق الويب ومكتبة مشتركة. ففي أي `openspec/` يجب أن يكون التخطيط؟
- يقوم فريقك بالتخطيط قبل وجود الكود، أو يخطط لأشياء لن تصبح كودًا في *هذا* المستودع.
- تكون المتطلبات مملوكة لفريق واحد ويستهلكها فرق أخرى. وتتغير النسخة الموجودة في الويكي، ولا يمكن لوكيل البرمجة (coding agent) قراءتها على أي حال.

**المستودع (Store)** هو الحل: وهو مستودع مستقل وظيفته بالكامل هي التخطيط. إنه يمتلك نفس شكل `openspec/` الذي تعرفه بالفعل — المواصفات والتغييرات — بالإضافة إلى ملف تعريف صغير. أنت تسجله على جهازك مرة واحدة، باسمه، ومن ثم يمكن لأي أمر عادي في OpenSpec أن يعمل بداخله من أي مكان.

## الشكل (The shape)

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

قاعدتان تبقيان هذا الأمر بسيطًا:

1. **المخزن (Store) هو مجرد مستودع Git.** أنت من يقوم بالالتزام (commit)، والدفع (push)، والسحب (pull)، والمراجعة له بنفسك. OpenSpec لا يقوم أبدًا بعملية استنساخ أو مزامنة أو دفع لأي شيء بمفرده.
2. **الإعلانات، وليس الآليات.** يمكن للمستودعات أن *تعلن* كيف ترتبط بالمخازن (كما هو موضح أدناه). هذه الإعلانات تغير ما يمكن لـ OpenSpec إخبارك به — ولا تغير أبدًا المكان الذي تعمل فيه أوامرك.

## خمس دقائق حتى أول مخزن لك (Five minutes to your first store)

يأخذك أمران من لا شيء إلى تغيير عامل ومحدد بنطاق المخزن:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

هذا هو النموذج بأكمله. من هنا، تكون دورة الحياة هي بالضبط ما تعرفه — `status` و `instructions` و `validate` و `archive` — مع إضافة `--store team-plans` على كل أمر، وكل تلميح مطبوع يحمل العلامة لك. السطر الذي يبدأ بـ `Using OpenSpec root:` يخبرك دائمًا أين يعمل الأمر.

## قصة: فريق واحد، ومستودع تخطيط واحد (Story: one team, one planning repo)

يقوم الفريق بتخزين مواصفاته وتغييراته في `team-plans` بدلاً من تشتيتها عبر مستودعات التعليمات البرمجية.

**اليوم الأول (من يقوم بالإعداد):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

إن تمرير `--remote` يسجل رابط الاستنساخ داخل ملف هوية المخزن نفسه (`.openspec-store/store.yaml`)، في الالتزام الأولي. كل استنساخ مستقبلي يولد وهو يعلم من أين أتى، لذا يمكن لفحوصات الصحة ورسائل الخطأ أن تطبع إصلاحًا كاملاً وقابلاً للنسخ لزملائه الذين ليس لديهم هذا المخزن بعد.

**كل زميل في الفريق (مرة واحدة لكل جهاز):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

منذ ذلك الحين، يعمل الجميع في نفس مستودع التخطيط بالاسم:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**مشاركة العمل هي Git، وذلك عن قصد.** إن التغيير الذي تنشئه موجود فقط في النسخة التي لديك حتى تقوم بالالتزام والدفع به — وهو نفس الأمر بالنسبة للتعليمات البرمجية. تحصل الخطط على فروع وطلبات سحب ومراجعات مجانًا، لأن المخزن هو مستودع عادي.

**ربط مستودعات التعليمات البرمجية الخاصة بالفريق.** يحتاج المستودع الذي يخص التعليمات البرمجية وتكون تخطيطاته خارجية بالكامل إلى سطر واحد فقط، في `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

الآن، كل أمر OpenSpec يتم تشغيله داخل `web-app` يعمل على `team-plans` دون الحاجة لأي علامات (flags):

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

المؤشر هو خيار احتياطي، وليس بديلاً. الأمر `--store` الصريح يفوز دائمًا، وإذا نما المستودع ليحتوي على مجلدات تخطيط حقيقية خاصة به، فإنها تفوز (مع تحذير لإزالة المؤشر القديم).

## قصة: المتطلبات التي تعبر حدود الفرق (Story: requirements that cross team lines)

يملك فريق المنصة المتطلبات. وتقوم فرق المنتجات بالبناء بناءً عليها، في مستودعاتها الخاصة، بتصاميمها الخاصة. يصف المرجع هذه العلاقة دون نقل أي عمل لأحد.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**يقوم فريق المنتج بالإعلان عما يعتمد عليه** في ملف `openspec/config.yaml` الخاص بمستودعه:

```yaml
references:
  - platform-reqs
```

المراجع هي سياق للقراءة فقط. يحتفظ المستودع بجذر `openspec/` الخاص به؛ ويبقى العمل هناك. ما الذي يتغير؟ أن `openspec instructions` في ذلك المستودع يشمل الآن فهرسًا لمواصفات المخزن المرجعي — كل منها مع ملخص من سطر واحد والأمر الدقيق لجلبها (`openspec show <spec-id> --type spec --store platform-reqs`). يمكن لوكيل يعمل في `api-server` أن يجد متطلبات الدفع (payment requirements) الأصلية، ويشير إليها، ويكتب تصميمه منخفض المستوى في جذر المستودع الخاص به — دون أن يقوم أي شخص بنسخ السياق.

يمكن للمرجع حمل مصدر الاستنساخ الخاص به، لذا يحصل الزملاء الذين ليس لديهم المخزن بعد على إصلاح كامل بدلاً من طريق مسدود:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**عندما تريد الخطة والتعليمات البرمجية معًا، قم بإنشاء مجموعة عمل (workset).** هذا أمر شخصي وصريح: يختار كل شخص المجلدات التي يعمل عليها فعليًا على جهازه. لا شيء من مسارات الاستنساخ المحلية هذه يتم الالتزام به في مستودع التخطيط المشترك.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## سؤالان يمكنك دائمًا طرحهما (Two questions you can always ask)

**"هل إعدادي سليم؟"** — يتحقق `openspec doctor` من الجذر الحالي والمخازن المرجعية، للقراءة فقط، مع إصلاح قابل للنسخ لكل اكتشاف:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"ما الذي أعمل عليه؟"** — يجمع `openspec context` مجموعة العمل من إعلانات OpenSpec: الجذر والمخازن التي يشير إليها.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

كلاهما يدعم `--json` للوكلاء (agents). يكتب `openspec context --code-workspace <path>` أيضًا ملف مساحة عمل VS Code الذي يحتوي على المجموعة بأكملها — وهو الشيء الوحيد الذي يقوم به هذا الأمر.

## مجموعات العمل (Worksets): أعد فتح المجلدات التي تعمل عليها معًا

بصرف النظر عن كل ما سبق: معظم الناس يفتحون نفس عدد قليل من المجلدات في كل جلسة — مستودع التخطيط بالإضافة إلى اثنين أو ثلاثة مستودعات تعليمات برمجية. **مجموعة العمل (workset)** هي رؤية شخصية ومسماة لهذا الأمر تحديدًا، ويتم فتحها بأمر واحد في الأداة التي تختارها.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

ثم يقوم `openspec workset open platform` بتشغيل الأداة المحفوظة: تفتح المحررات (VS Code, Cursor) نافذة واحدة بكل عضو وتعود. العضو الأول هو الأساسي. يمكنك تجاوز الأداة في أي وقت باستخدام `--tool <id>`.

مجموعات العمل *ليست* حالة مشتركة عن قصد. إنها تعيش على جهازك، ولا يتم الالتزام بها أبدًا، ولا تدعي شيئًا عن العمل — بل تسجل فقط ما تحب أن يكون مفتوحًا معًا. إزالة أي منها لا يمس المجلدات الأعضاء. الأدوات الجديدة هي تهيئة (configuration)، وليست تعليمات برمجية: يمكن إضافة أي شيء يتم تشغيله عبر ملف مساحة عمل أو علامات ربط للمجلدات إلى مفتاح `openers` في الإعدادات العامة (`openspec config edit`).

## كيف تقرر الأوامر أين تعمل (How commands decide where to act)

يحل كل أمر عادي جذره بنفس الطريقة، وبالترتيب التالي:

```
1. --store <id>          أنت من قال ذلك صراحةً        → هذا المخزن
2. nearest openspec/     جذر تخطيط حقيقي هنا      → هذا المستودع
   (walking up from cwd)
3. store: pointer        يحدد config.yaml مخزناً  → هذا المخزن
4. none of the above     هل تم تسجيل مخازن على هذا الجهاز؟ → خطأ مع تلميح اختيار
                         لا توجد مخازن مسجلة؟         → الدليل الحالي
                                                          (السلوك الكلاسيكي)
```

السطر الذي يبدأ بـ `Using OpenSpec root:` (والكتلة `root` في مخرجات `--json`) يخبرك أي حالة أنت فيها.

## القيود المعروفة (Known limitations)

- **شكل تجريبي.** كل ما هو موجود في هذه الصفحة قد يتغير بين الإصدارات — الأسماء، والعلامات، وتنسيقات الملفات، ومفاتيح JSON.
- **استنساخ واحد لكل معرف مخزن ولكل جهاز.** يفشل تسجيل استنساخ ثانٍ تحت نفس المعرف مع تلميح إلى `store unregister` أولاً.
- **لا مزامنة أبدًا — بحكم التصميم.** OpenSpec لا يقوم بالاستنساخ أو السحب أو الدفع. النسخة القديمة تعرض مواصفات قديمة حتى *أنت* تسحب؛ ويتم فهرسة المراجع مباشرة من أي شيء موجود على القرص.
- **بعض الأوامر تبقى كما هي.** `view` و `templates` و `schemas` والأشكال الاسمية المهملة (`openspec change show`، إلخ) تعمل على الدليل الحالي فقط — ولا تتطلب `--store`.
- **الحالة الخاصة بالجهاز خاصة بكل جهاز.** سجل المخازن ومجموعات العمل هي إعدادات محلية. لا يتم الالتزام بأي شيء يتعلق بتخطيط جهازك المشترك.
- **طريقتان لتشغيل مجموعات العمل.** الأداة التي لا يمكن تشغيلها بملف مساحة عمل أو بعلامات ربط للمجلدات لا يمكن إضافتها كـ opener.
- **تنسيق JSON للوكيل (Agent) له تقسيم معروف** (مفاتيح العائلة المخزن snake_case، ومفاتيح العائلة سير العمل camelCase). موثق في [agent contract](../agent-contract.md)؛ ويتم تأجيل توحيده إلى إصدار مُرقّم.

## أين الأشياء موجودة (Where things live)

| ماذا | أين | مشترك؟ |
|---|---|---|
| تخطيط المخزن | `<store>/openspec/` (specs, changes) | نعم — قم بالالتزام والدفع به |
| هوية المخزن | `<store>/.openspec-store/store.yaml` | نعم — يتم الالتزام بها مع المخزن |
| سجل المخازن | `<data dir>/openspec/stores/registry.yaml` | لا — هذا الجهاز فقط |
| مجموعات العمل | `<data dir>/openspec/worksets/` | لا — هذا الجهاز فقط |

`<data dir>` هو `~/.local/share/openspec` على macOS و Linux (أو `$XDG_DATA_HOME/openspec` عند تعيينه)، و `%LOCALAPPDATA%\openspec` على Windows.
## المراجع (Reference)

العلامات الدقيقة وأشكال JSON لكل أمر في هذه الصفحة:
[CLI reference](../cli.md) (المخازن، والطبيب، والسياق التشغيلي، ومجموعات العمل الشخصية) و [agent contract](../agent-contract.md).