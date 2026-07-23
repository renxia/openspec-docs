# المتاجر (Stores): التخطيط في مستودعها الخاص

> **تجريبي.** المتاجر (Stores) والمراجع وسياق العمل ومجموعات العمل هي ميزات جديدة. قد لا تزال أسماء الأوامر والأعلام وتنسيقات الملفات ومخرجات JSON تتخذ أشكالاً مختلفة بين الإصدارات. تم تشغيل جميع الدروس الإرشادية أدناه على الإصدار الحالي، ولكن أعد قراءة هذا الدليل بعد الترقية.

## المشكلة التي يحلها هذا

يعيش OpenSpec عادةً داخل مستودع كود واحد: مجلد `openspec/` بجانب الكود الخاص بك، يحتوي على المواصفات (specs) والتغييرات الخاصة بهذا المستودع.

هذا لم يعد مناسبًا بمجرد أن يتجاوز تخطيطك نطاق مستودع واحد:
- يمتد عملك عبر عدة مستودعات — ميزة واحدة تؤثر على خادم API، وتطبيق الويب، ومكتبة مشتركة. في أي مجلد `openspec/` سيوجد المخطط؟
- يخطط فريقك قبل وجود الكود، أو يخطط لأشياء لا تتحول أبدًا إلى كود في *هذا* المستودع.
- المتطلبات مملوكة لفريق واحد وتستخدمها فرق أخرى. تنحرف نسخة الويكي مع الوقت، ووكيل البرمجة الخاص بك لا يمكنه قراءتها على أي حال.

المتجر (Store) هو الحل: مستودع مستقل وظيفته بالكامل هي التخطيط. له نفس شكل مجلد `openspec/` الذي تعرفه بالفعل — المواصفات (specs) والتغييرات — بالإضافة إلى ملف هوية صغير. تقوم بتسجيله على جهازك مرة واحدة باسمه، وبعد ذلك يمكن لجميع أوامر OpenSpec العادية العمل بداخله من أي مكان.

## الشكل

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

قاعدتان تبقيان الأمر بسيطاً:

1. **المخزن هو مجرد مستودع git.** تقوم أنت بالالتزام والدفع والسحب ومراجعته بنفسك. لا يقوم OpenSpec بالاستنساخ أو المزامنة أو الدفع لأي شيء من تلقاء نفسه.
2. **إعلانات، وليس آلات.** يمكن للمستودعات *إعلان* كيفية ارتباطها بالمخازن (كما هو موضح أدناه). تغير الإعلانات ما يمكن أن يخبرك به OpenSpec — أبداً حيث تعمل أوامرك.

## خمس دقائق لإنشاء مخزنك الأول

أمران يأخذانك من لا شيء إلى تغيير عامل ومحدد بمخزن:

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

هذا هو النموذج بأكمله. من هنا دورة الحياة هي بالضبط ما تعرفه — `status` و `instructions` و `validate` و `archive` — مع `--store team-plans` في كل أمر، وتحمل كل تلميحة مطبوعة العلم لك. السطر `Using OpenSpec root:` يخبرك دائماً أين يعمل الأمر.

## قصة: فريق واحد، مستودع تخطيط واحد

يحتفظ الفريق بمواصفاته (specs) وتغييراته في `team-plans` بدلاً من تشتيتها عبر مستودعات الأكواد.

**اليوم الأول (من يقوم بإعداده):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

يؤدي تمرير `--remote` إلى تسجيل عنوان URL للاستنساخ داخل ملف هوية المخزن الخاص به (`.openspec-store/store.yaml`)، في الالتزام الأولي. يولد كل استنساخ مستقبلي وهو يعلم من أين أتى، حتى تتمكن عمليات التحقق من الصحة ورسائل الخطأ من طباعة إصلاح كامل وقابل للصق لأعضاء الفريق الذين لم يمتلكوه بعد.

**كل عضو في الفريق (مرة واحدة لكل جهاز):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

منذ ذلك الحين، يعمل الجميع في نفس مستودع التخطيط بالاسم:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**مشاركة العمل هي git، عن قصد.** التغيير الذي تنشئه موجود فقط في نسختك المحلية (checkout) حتى تقوم بالالتزام والدفع له — تماماً مثل الكود. تحصل الخطط على فروع وطلبات سحب ومراجعة مجاناً، لأن المخزن هو مستودع عادي.

**ربط مستودعات أكواد الفريق.** يحتاج مستودع الكود الذي تم تخزين تخطيطه بالكامل خارجياً إلى سطر واحد بالضبط، في `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

الآن يعمل كل أمر OpenSpec يتم تشغيله داخل `web-app` على `team-plans` بدون أي أعلام على الإطلاق:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

المؤشر هو احتياطي، وليس تجاوزاً أبداً: `--store` الصريح يفوز دائماً، وإذا نما المستودع وأصبح يحتوي على مجلدات تخطيط حقيقية خاصة به، فإنها تفوز (مع تحذير لإزالة المؤشر القديم).

**افتراضي واحد لكل مستودع على جهازك.** إذا كنت تعمل عبر العديد من مستودعات الأكواد التي تخطط كلها إلى نفس المخزن، فقم بتعيينه مرة واحدة، عالمياً، بدلاً من إضافة سطر `store:` إلى كل مستودع:

```bash
openspec config set defaultStore team-plans
```

الآن أي أمر يتم تشغيله خارج جذر التخطيط — وبدون `--store` وبدون مؤشر المشروع — يحل إلى `team-plans`. يجلس في قائمة الأولويات، لذا `--store` والجذر المحلي ومؤشر `store:` للمشروع يفوزون جميعاً لا يزالون. يبلغ لافتة الجذر وكتلة JSON `root` عن `source: "global_default"` مع معرف المخزن، حتى تتمكن دائماً من التمييز بين الافتراضي على مستوى الجهاز ومؤشر المستودع الخاص به. امسحه باستخدام `openspec config unset defaultStore`. إذا لم يتم تسجيل المعرف، تظهر الأوامر خطأ وتخبرك بتسجيله أو مسح الافتراضي القديم.

## قصة: متطلبات تعبر حدود الفرق

يمتلك فريق المنصة المتطلبات. يبني فرق المنتجات بناءً عليها، في مستودعاتهم الخاصة، بتصاميمهم الخاصة. يصف المرجع هذه العلاقة دون نقل عمل أي شخص.

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

**يعلن فريق المنتج ما يستند إليه** في ملف `openspec/config.yaml` الخاص بمستودعه:

```yaml
references:
  - platform-reqs
```

المراجع هي سياق للقراءة فقط. يحتفظ المستودع بجذره `openspec/` الخاص به؛ يبقى العمل هناك. ما يتغير: `openspec instructions` في ذلك المستودع يتضمن الآن فهرساً لمواصفات المخزن المشار إليه — كل منها مع ملخص من سطر واحد والأمر الدقيق لجلب البيانات (`openspec show <spec-id> --type spec --store platform-reqs`). يمكن للعامل العامل في `api-server` العثور على متطلبات الدفع الأصلية، واستشهادها، وكتابة تصميمه منخفض المستوى في جذر المستودع الخاص به — دون أن يقوم أي شخص بلصق السياق هنا وهناك.

يمكن أن يحمل المرجع مصدر استنساخه، حتى يحصل أعضاء الفريق الذين لم يمتلكوا المخزن بعد على إصلاح كامل بدلاً من طريق مسدود:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**عندما تريد فتح الخطة والكود معاً، قم بإنشاء مجموعة عمل (workset).** هذا شخصي وصريح: يختار كل شخص المجلدات التي يعمل معها فعلياً على جهازه. لا يتم الالتزام بأي شيء يتعلق بمسارات النسخ المحلية هذه إلى مستودع التخطيط المشترك.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## سؤالان يمكنك دائماً طرحهما

**"هل إعدادي صحي؟"** — `openspec doctor` يتحقق من الجذر الحالي والمخازن المشار إليه، للقراءة فقط، مع إصلاح قابل للصق لكل نتيجة:

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

**"مع ماذا أعمل؟"** — `openspec context` يجمع مجموعة العمل من إعلانات OpenSpec: الجذر والمخازن التي يشير إليها.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

كلاهما يدعمان `--json` للعاملين. `openspec context --code-workspace <path>` يكتب إضافياً ملف مساحة عمل VS Code يحتوي على المجموعة بأكملها — الكتابة الوحيدة التي يقوم بها هذا الأمر.

## مجموعات العمل: أعد فتح المجلدات التي تعمل عليها معاً

منفصل عن كل ما سبق: يفتح معظم الأشخاص نفس المجلدات القليلة معاً في كل جلسة — مستودع التخطيط بالإضافة إلى مستودعي أو ثلاثة أكواد. **مجموعة العمل (workset)** هي عرض شخصي ومسماة بالضبط لذلك، تتم إعادة فتحه بأمر واحد في الأداة التي تختارها.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

ثم يقوم `openspec workset open platform` بتشغيل الأداة المحفوظة: تفتح المحررات (VS Code، Cursor) نافذة واحدة مع كل عضو وتعود. العضو الأول هو الأساسي. تجاوز الأداة في أي وقت باستخدام `--tool <id>`.

مجموعات العمل ليست *حالة مشتركة* عن قصد. تعيش على جهازك، لا يتم الالتزام بها أبداً، ولا تدعي أي شيء عن العمل — تسجل فقط ما تحب فتحه معاً. إزالة واحدة لا تلمس مجلدات الأعضاء أبداً. الأدوات الجديدة هي إعدادات، وليس كود: أي شيء يتم تشغيله عبر ملف مساحة العمل أو أعلام الإرفاق لكل مجلد يمكن إضافته تحت مفتاح `openers` في الإعدادات العامة (`openspec config edit`).

## كيف تقرر الأوامر أين تعمل

يحل كل أمر عادي جذره بنفس الطريقة، بهذا الترتيب:

```
1. --store <id>          لقد قلت ذلك صراحة        → ذلك المخزن
2. nearest openspec/     جذر تخطيط حقيقي هنا     → هذا المستودع
   (walking up from cwd)
3. store: pointer        config.yaml يعلن عن مخزن  → ذلك المخزن
4. defaultStore          الإعدادات العامة تعيين افتراضي للجهاز → ذلك المخزن
5. none of the above     مخازن مسجلة على هذا     → خطأ مع تلميح اختيار
                         الجهاز؟                   لا مخازن مسجلة؟     → الدليل الحالي
                                                          (السلوك الكلاسيكي)
```

السطر `Using OpenSpec root:` (وكتلة `root` في مخرج `--json`) يخبرك أي حالة أنت فيها.

## القيود المعروفة

- **شكل بيتا.** كل شيء في هذه الصفحة قد يتغير بين الإصدارات — الأسماء والأعلام وتنسيقات الملفات ومفاتيح JSON.
- **نسخة واحدة لكل معرف مخزن لكل جهاز.** يفشل تسجيل نسخة ثانية تحت نفس المعرف مع تلميح لاستخدام `store unregister` أولاً.
- **لا مزامنة، أبداً — عن قصد.** لا يقوم OpenSpec بالاستنساخ أو السحب أو الدفع أبداً. تظهر النسخة القديمة مواصفات قديمة حتى *تقوم أنت* بالسحب؛ تتم فهرسة المراجع مباشرة من أي شيء موجود على القرص.
- **يمكن أن تكون مجلدات التخطيط الفارغة غائبة.** قد لا يكون لدى المخزن الجديد `openspec/changes/` أو `openspec/specs/` أو `openspec/changes/archive/` في Git بعد. يتم قبول ذلك أثناء مرحلة البيتا؛ تظهر هذه المجلدات بمجرد أن تقوم الأوامر العادية بإنشاء ملفات لها.
- **تبقى مستودعات المؤشرات مؤشرات.** يتم التعامل مع مستودع الإعدادات فقط الذي يعلن في `openspec/config.yaml` عن `store: <id>` على أنه تخطيط خارجي، وليس كنسخة مخزن لتسجيلها. أزل سطر `store:` أولاً إذا كنت تريد عن قصد تحويل ذلك المستودع إلى جذر مخزن محلي.
- **تبقى بعض الأوامر حيث هي.** `view` و `templates` و `schemas` والأسماء المعدلة المهملة (`openspec change show`، ...) تعمل على الدليل الحالي فقط — لا `--store`.
- **الحالة لكل جهاز هي لكل جهاز.** سجل المخزن ومجموعات العمل هي إعدادات محلية. لا يتم الالتزام بأي شيء يتعلق بتخطيط جهازك أبداً إلى التخطيط المشترك.
- **أسلوبان للإطلاق لمجموعات العمل.** لا يمكن إضافة الأداة التي لا يمكن تشغيلها بملف مساحة عمل أو أعلام إرفاق لكل مجلد كأداة فتح.
- **يحتوي JSON للعامل على انقسام حالة معروف** (مفاتيح عائلة المخزن هي snake_case، عائلة سير العمل camelCase). موثق في [عقد العامل](../agent-contract.md)؛ تم تأجيل توحيده إلى إصدار مصنف.

## أماكن تخزين الأشياء

| ما هو | أين | مشترك؟ |
|---|---|---|
| تخطيط المتجر | `<store>/openspec/` (المواصفات، التغييرات) | نعم — قم بالحفظ والرفع |
| هوية المتجر | `<store>/.openspec-store/store.yaml` | نعم — محفوظة مع المتجر |
| سجل المتاجر | `<data dir>/openspec/stores/registry.yaml` | لا — لهذه الآلة فقط |
| مجموعات العمل | `<data dir>/openspec/worksets/` | لا — لهذه الآلة فقط |

`<data dir>` هو `~/.local/share/openspec` على أنظمة macOS و Linux (أو `$XDG_DATA_HOME/openspec` عند تعيينه)، و `%LOCALAPPDATA%\openspec` على Windows.

## مرجع

الأعلام الدقيقة وأشكال JSON لكل أمر في هذه الصفحة:
[مرجع واجهة سطر الأوامر](../cli.md) (Stores, Doctor, سياق العمل, مجموعات العمل الشخصية) و [عقد الوكيل](../agent-contract.md).