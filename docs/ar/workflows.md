# سير العمل

يغطي هذا الدليل أنماط سير العمل الشائعة لـ OpenSpec ومتى يجب استخدام كل منها. للإعداد الأساسي، راجع [البدء](getting-started.md). للمرجع الخاص بالأوامر، راجع [الأوامر](commands.md).

## المبدأ: إجراءات، وليس مراحل

تفرض سير العمل التقليدية عليك اتباع مراحل: التخطيط، ثم التنفيذ، ثم الانتهاء. لكن العمل الحقيقي لا يتناسب تمامًا مع هذه الصناديق المحددة.

يتبع OPSX نهجًا مختلفًا:

```text
التقليدي (مقيد بالمرحلة):

  التخطيط ────────► التنفيذ ────────► الانتهاء
      │                    │
      │   "لا يمكن الرجوع"  │
      └────────────────────┘

OPSX (إجراءات سلسة):

  اقتراح ──► مواصفات ──► تصميم ──► مهام ──► تنفيذ
```

**المبادئ الرئيسية:**

- **إجراءات، وليس مراحل** - الأوامر هي أشياء يمكنك القيام بها، وليس مراحل تعلق فيها
- **التبعيات هي مُمكِّنات** - تُظهر ما هو ممكن، وليس ما هو مطلوب لاحقًا

> **التخصيص:** سير عمل OPSX محرك بواسطة مخططات تحدد تسلسل المخرجات. راجع [التخصيص](customization.md) للتفاصيل حول إنشاء مخططات مخصصة.

## وضعان

### المسار السريع الافتراضي (ملف `core`)

التثبيتات الجديدة تستخدم `core` بشكل افتراضي، والذي يوفر:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

التدفق النموذجي:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### سير العمل الموسّع/الكامل (اختيار مخصص)

إذا كنت ترغب في أوامر البناء والهيكلة الصريحة (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`)، قم بتفعيلها باستخدام:

```bash
openspec config profile
openspec update
```

## أنماط سير العمل (الوضع الموسّع)

### ميزة سريعة

عندما تعرف ما تريد بناءه وتحتاج فقط إلى التنفيذ:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**محادثة نموذجية:**

```text
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**الأفضل لـ:** الميزات الصغيرة إلى المتوسطة، إصلاح الأخطاء، التغييرات المباشرة.

### استكشافية

عندما تكون المتطلبات غير واضحة أو تحتاج إلى التحقيق أولاً:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**محادثة نموذجية:**

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**الأفضل لـ:** تحسين الأداء، تصحيح الأخطاء، القرارات المعمارية، المتطلبات غير الواضحة.

### تغييرات متوازية

العمل على عدة تغييرات في وقت واحد:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**محادثة نموذجية:**

```text
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**الأفضل لـ:** تدفقات العمل المتوازية، المقاطعات العاجلة، التعاون الجماعي.

عندما يكون لديك عدة تغييرات مكتملة، استخدم `/opsx:bulk-archive`:

```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

يكتشف الأرشفة الجماعية عندما تلمس عدة تغييرات نفس المواصفات وحل النزاعات عن طريق التحقق مما تم تنفيذه فعلياً.

### إكمال تغيير

تدفق الإكمال الموصى به:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### التحقق: فحص عملك

يتحقق `/opsx:verify` من التنفيذ مقارنةً بأصولك عبر ثلاثة أبعاد:

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

**ما يتحقق منه التحقق:**

| البعد | ما يتحقق منه |
|-----------|------------------|
| الاكتمال | اكتمال جميع المهام، تنفيذ جميع المتطلبات، تغطية السيناريوهات |
| الصحة | مطابقة التنفيذ لنية المواصفات، معالجة الحالات الحدية |
| التناسق | انعكاس القرارات التصميمية في الكود، اتساق الأنماط |

لن يمنع التحقق الأرشفة، لكنه يظهر مشاكل قد ترغب في معالجتها أولاً.

#### الأرشفة: إنهاء التغيير

يقوم `/opsx:archive` بإتمام التغيير ونقله إلى الأرشيف:

```text
You: /opsx:archive

AI:  Archiving add-auth...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (12/12 tasks complete)

     Delta specs: Not yet synced to main
     → Would you like to sync now?

You: Yes

AI:  ✓ Synced specs to openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-auth/

     Change archived successfully.
```

ستظهر الأرشفة بrompt إذا لم تتم مزامنة المواصفات. لن تمنع المهام غير المكتملة، لكنها ستحذرك.

## متى تستخدم ماذا

### `/opsx:ff` مقابل `/opsx:continue`

| الموقف | الاستخدام |
|-----------|-----|
| متطلبات واضحة، جاهز للبناء | `/opsx:ff` |
| استكشاف، تريد مراجعة كل خطوة | `/opsx:continue` |
| تريد التكرار على المقترح قبل المواصفات | `/opsx:continue` |
| ضغط الوقت، تحتاج للتحرك بسرعة | `/opsx:ff` |
| تغيير معقد، تريد التحكم | `/opsx:continue` |

**قاعدة عامة:** إذا كنت تستطيع وصف النطاق الكامل مسبقاً، استخدم `/opsx:ff`. إذا كنت تحدده أثناء العمل، استخدم `/opsx:continue`.

### متى تحدّث مقابل البدء من جديد

سؤال شائع: متى يكون تحديث تغيير موجود مقبولاً، ومتى يجب البدء بجديد؟

**حدّث التغيير الموجود عندما:**

- نفس النية، تنفيذ مُحسَّن
- تضيق النطاق (MVP أولاً، الباقي لاحقاً)
- تصحيحات مبنية على التعلم (الكود ليس كما توقعت)
- تعديلات تصميمية بناءً على اكتشافات التنفيذ

**ابدأ تغييراً جديداً عندما:**

- تغيرت النية بشكل جوهري
- انفجر النطاق إلى عمل مختلف تماماً
- يمكن وضع علامة "مكتمل" على التغيير الأصلي بمفرده
- ستسبب الترقيات حيرة أكثر من التوضيح

```text
                     ┌─────────────────────────────────────┐
                     │     Is this the same work?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Same intent?      >50% overlap?      Can original
          Same problem?     Same scope?        be "done" without
                 │                  │          these changes?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YES               NO YES           NO  NO              YES
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

**مثال: "إضافة الوضع الداكن"**

- "يجب دعم السمات المخصصة أيضاً" → تغيير جديد (انفجار النطاق)
- "كشف تفضيلات النظام أصعب مما توقعت" → تحديث (نفس النية)
- "دعنا نصدر المفتاح أولاً، نضيف التفضيلات لاحقاً" → تحديث ثم أرشفة، ثم تغيير جديد

## أفضل الممارسات

### اجعل التغييرات مركّزة

وحدة عمل منطقية واحدة لكل تغيير. إذا كنت تقوم بـ "إضافة ميزة X وإعادة هيكلة Y"، فكر في تغييرين منفصلين.

**لماذا هذا مهم:**
- أسهل في المراجعة والفهم
- سجل أرشيف أنظف
- يمكن تسليمه بشكل مستقل
- أسهل في التراجع إذا لزم الأمر

### استخدم `/opsx:explore` للمتطلبات غير الواضحة

قبل الالتزام بتغيير، استكشف مساحة المشكلة:

```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebase, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

الاستكشاف يوضح التفكير قبل إنشاء الأصول.

### تحقق قبل الأرشفة

استخدم `/opsx:verify` للتحقق من مطابقة التنفيذ للأصول:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

يكتشف عدم التطابق قبل إغلاق التغيير.

### سمّ التغييرات بوضوح

الأسماء الجيدة تجعل `openspec list` مفيداً:

```text`
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## مرجع سريع للأوامر

للحصول على التفاصيل الكاملة للأوامر والخيارات، راجع [الأوامر](commands.md).

| الأمر | الغرض | متى تستخدمه |
|---------|---------|-------------|
| `/opsx:propose` | إنشاء تغيير + أدوات التخطيط | المسار الافتراضي السريع (ملف `core`) |
| `/opsx:explore` | التفكير في الأفكار | متطلبات غير واضحة، التحقيق |
| `/opsx:new` | بدء هيكل تغيير | الوضع الموسع، التحكم الصريح في الأدوات |
| `/opsx:continue` | إنشاء الأداة التالية | الوضع الموسع، إنشاء الأدوات خطوة بخطوة |
| `/opsx:ff` | إنشاء جميع أدوات التخطيط | الوضع الموسع، النطاق الواضح |
| `/opsx:apply` | تنفيذ المهام | جاهز لكتابة الكود |
| `/opsx:verify` | التحقق من التنفيذ | الوضع الموسع، قبل الأرشفة |
| `/opsx:sync` | دمج المواصفات التفاضلية | الوضع الموسع، اختياري |
| `/opsx:archive` | إتمام التغيير | انتهاء جميع الأعمال |
| `/opsx:bulk-archive` | أرشفة تغييرات متعددة | الوضع الموسع، العمل المتوازي |

## الخطوات التالية

- [الأوامر](commands.md) - مرجع كامل للأوامر مع الخيارات
- [المفاهيم](concepts.md) - استكشاف معمّق للمواصفات والأدوات والمخططات
- [التخصيص](customization.md) - إنشاء سير عمل مخصص