# سير العمل

يغطي هذا الدليل أنماط سير العمل الشائعة لـ OpenSpec ومتى تستخدم كل منها. للإعداد الأساسي، راجع [البدء](getting-started.md). لمرجع الأوامر، راجع [الأوامر](commands.md).

## الفلسفة: الإجراءات، وليس المراحل

تجبرك سير العمل التقليدية على المرور بمراحل: التخطيط، ثم التنفيذ، ثم الانتهاء. لكن العمل الحقيقي لا يتناسب بشكل أنيق في مربعات محددة مسبقاً.

يتبع OPSX نهجاً مختلفاً:

```text
التقليدية (مقيدة بالمراحل):

  التخطيط ────────► التنفيذ ────────► الانتهاء
      │                    │
      │   "لا يمكن العودة للخلف"  │
      └────────────────────┘

OPSX (إجراءات مرنة):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**المبادئ الأساسية:**

- **الإجراءات، وليس المراحل** - الأوامر هي أشياء يمكنك القيام بها، وليست مراحل عالق فيها
- **التبعيات هي عوامل تمكين** - فهي توضح ما هو ممكن، وليس ما هو مطلوب تنفيذه لاحقاً

> **التخصيص:** يتم تشغيل سير عمل OPSX بواسطة مخططات تحدد تسلسلات القطع الأثرية. راجع [التخصيص](customization.md) للحصول على تفاصيل حول إنشاء مخططات مخصصة.

## وضعان

### المسار السريع الافتراضي (ملف تعريف `core`)

التثبيتات الجديدة تستخدم `core` افتراضيًا، والذي يوفر:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

التدفق النموذجي:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (اختياري)
```

#### ابدأ بالاستكشاف (العادة التي تستحق التكوين)

`/opsx:explore` هو جزء من الملف الشخصي الافتراضي، وليس إضافة متقدمة. إنه الإجراء الذي يجب اتخاذه كلما كانت لديك مشكلة ولكن ليس لديك خطة بعد، وهو ما يحدث في الغالب مع مساعد الذكاء الاصطناعي.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our search results feel stale. I'm not sure if it's caching,
     indexing, or the query itself.

AI:  Let me look... [reads the search service and cache layer]
     It's the index: it only rebuilds nightly, so edits don't show
     up until the next day. Two options: rebuild on write (simple,
     more load) or a short-TTL cache invalidation (more moving parts,
     less load). Given your write volume is low, rebuild-on-write is
     the cleaner fix. Want to scope it?

You: Yes.

You: /opsx:propose rebuild-search-index-on-write
```

الاستكشاف لا ينشئ أي artifacts ولا يكتب أي كود. إنه محادثة مجانية بدون مخاطر تحول من قلق غامض إلى تغيير دقيق، لذا فإن الاقتراح الذي يلي يكون حادًا. كنت تعرف بالفعل بالضبط ما تريد؟ تخطاه واذهب مباشرة إلى `/opsx:propose`. الدليل الكامل: [Explore First](explore.md).

### سير العمل الموسع/الكامل (تحديد مخصص)

إذا كنت تريد أوامر صريحة لهيكلة وبناء (`/opsx:new`، `/opsx:continue`، `/opsx:ff`، `/opsx:verify`، `/opsx:bulk-archive`، `/opsx:onboard`)، فقم بتفعيلها باستخدام:

```bash
openspec config profile
openspec update
```

## أنماط سير العمل (الوضع الموسع)

### ميزة سريعة

عندما تعرف ما تريد بنائه وتحتاج فقط إلى التنفيذ:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**مثال على محادثة:**

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

**الأفضل لـ:** الميزات الصغيرة إلى المتوسطة، إصلاحات الأخطاء، التغييرات البسيطة.

### استكشافي

عندما تكون المتطلبات غير واضحة أو تحتاج إلى التحقيق أولاً:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**مثال على محادثة:**

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

العمل على تغييرات متعددة في وقت واحد:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**مثال على محادثة:**

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

**الأفضل لـ:** مسارات عمل متوازية، مقاطعات عاجلة، التعاون الجماعي.

عندما يكون لديك تغييرات مكتملة متعددة، استخدم `/opsx:bulk-archive`:

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

الأرشفة الجماعية تكتشف عندما تت touch عدة تغييرات نفس المواصفات وتحل التعارضات عن طريق التحقق مما تم تنفيذه فعليًا.

### إكمال التغيير

تدفق الإكمال الموصى به:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### التحقق: تحقق من عملك

`/opsx:verify` يتحقق من التنفيذ مقابل artifacts الخاصة بك عبر ثلاثة أبعاد:

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

| البعد | ما يتم التحقق منه |
|-----------|------------------|
| الاكتمال | جميع المهام مكتملة، جميع المتطلبات منفذة، السيناريوهات مغطاة |
| الصحة | التنفيذ يطابق نية المواصفة، الحالات الحدية معالجة |
| التماسك | قرارات التصميم منعكسة في الكود، الأنماط متسقة |

لن يمنع التحقق من الأرشفة، ولكنه يسلط الضوء على المشاكل التي قد ترغب في معالجتها أولاً.

#### الأرشفة: إنهاء التغيير

`/opsx:archive` يكمل التغيير وينقله إلى الأرشيف:

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

ستطلب الأرشفة إذا لم تتم مزامنة المواصفات. لن تمنع المهام غير المكتملة، ولكنها ستحذرك.

## متى تستخدم ماذا

### `/opsx:ff` مقابل `/opsx:continue`

| الحالة | استخدم |
|-----------|-----|
| متطلبات واضحة، جاهز للبناء | `/opsx:ff` |
| استكشاف، تريد مراجعة كل خطوة | `/opsx:continue` |
| تريد التكرار على الاقتراح قبل المواصفات | `/opsx:continue` |
| ضغط الوقت، تحتاج إلى التحرك بسرعة | `/opsx:ff` |
| تغيير معقد، تريد التحكم | `/opsx:continue` |

**قاعدة الإبهام:** إذا كنت تستطيع وصف النطاق الكامل مسبقًا، استخدم `/opsx:ff`. إذا كنت تكتشفه أثناء التقدم، استخدم `/opsx:continue`.

### متى تقوم بالتحديث مقابل البدء من جديد

سؤال شائع: متى يكون تحديث تغيير موجود مقبولاً، ومتى يجب أن تبدأ واحدًا جديدًا؟

**حدث التغيير الموجود عندما:**

- نفس النية، تنفيذ محسن
- النطاق يضيق (MVP أولاً، الباقي لاحقًا)
- تصحيحات مدفوعة بالتعلم (الكود ليس كما توقعت)
- تعديلات التصميم بناءً على اكتشافات التنفيذ

**ابدأ تغييرًا جديدًا عندما:**

- النية تغيرت جوهريًا
- النطاق انفجر إلى عمل مختلف تمامًا
- يمكن وضع علامة "تم" على التغيير الأصلي بشكل مستقل
- التصحيحات ستسبب ارتباكًا أكثر من clarification

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

- "نحتاج أيضًا إلى دعم السمات المخصصة" → تغيير جديد (انفجر النطاق)
- "الكشف عن تفضيل النظام أصعب مما توقعت" → تحديث (نفس النية)
- "لنشحن زر التبديل أولاً، نضيف التفضيلات لاحقًا" → تحديث ثم أرشفة، ثم تغيير جديد

## أفضل الممارسات

### احتفظ بالتغييرات مركزة

وحدة عمل منطقية واحدة لكل تغيير. إذا كنت تفعل "أضف الميزة X وأعد هيكلة Y أيضًا"، ففكر في تغييرين منفصلين.

**لماذا يهم هذا:**
- أسهل في المراجعة والفهم
- سجل أرشيف أنظف
- يمكن الشحن بشكل مستقل
- تراجع أبسط إذا لزم الأمر

### استخدم `/opsx:explore` للمتطلبات غير الواضحة

قبل الالتزام بتغيير، استكشف مجال المشكلة:

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

الاستكشاف يوضح التفكير قبل إنشاء الـ artifacts.

### تحقق قبل الأرشفة

استخدم `/opsx:verify` للتحقق من أن التنفيذ يطابق الـ artifacts:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

يلتقط عدم التطابق قبل إغلاق التغيير.

### اسمح للتغييرات بوضوح

الأسماء الجيدة تجعل `openspec list` مفيدًا:

```text
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## مرجع سريع للأوامر

للحصول على تفاصيل وخيارات الأوامر الكاملة، راجع [الأوامر](commands.md).

| الأمر | الغرض | متى تستخدمه |
|---------|---------|-------------|
| `/opsx:propose` | إنشاء مادة التغيير ومواد التخطيط | المسار الافتراضي السريع (ملف تعريف `core`) |
| `/opsx:explore` | التفكير في الأفكار مع الذكاء الاصطناعي | ابدأ من هنا عندما تكون غير متأكد: متطلبات غير واضحة، تحقيق، مقارنة بين الخيارات |
| `/opsx:new` | بدء هيكل التغيير الأولي | الوضع الموسع، تحكم صريح في المواد |
| `/opsx:continue` | إنشاء المادة التالية | الوضع الموسع، إنشاء المواد خطوة بخطوة |
| `/opsx:ff` | إنشاء جميع مواد التخطيط | الوضع الموسع، نطاق عمل واضح |
| `/opsx:apply` | تنفيذ المهام | عندما تكون جاهزًا لكتابة الكود |
| `/opsx:verify` | التحقق من صحة التنفيذ | الوضع الموسع، قبل الأرشفة |
| `/opsx:sync` | دمج مواصفات التغييرات الجزئية | الوضع الموسع، اختياري |
| `/opsx:archive` | إتمام التغيير | عند الانتهاء من جميع الأعمال |
| `/opsx:bulk-archive` | أرشفة تغييرات متعددة | الوضع الموسع، عمل متوازٍ |

## الخطوات التالية

- [كتابة مواصفات جيدة](writing-specs.md) - كيف تبدو المتطلبات والسيناريوهات القوية، وكيفية تحديد الحجم المناسب للتغيير
- [مراجعة التغيير](reviewing-changes.md) - المراجعة السريعة مدتها دقيقتان للخطة المسودة قبل كتابة أي كود
- [OpenSpec ضمن فريق عمل](team-workflow.md) - كيف تتكامل التغييرات مع الفروع وطلبات السحب
- [الأوامر](commands.md) - مرجع كامل للأوامر مع جميع خياراتها
- [المفاهيم](concepts.md) - تعمق في مفاهيم المواصفات، والمواد، والمخططات
- [التخصيص](customization.md) - إنشاء سير عمل مخصص