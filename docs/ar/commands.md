# الأوامر

هذا هو المرجع لأوامر الشرطة المائلة لـ OpenSpec. يتم استدعاء هذه الأوامر في واجهة الدردشة لمساعد البرمجة بالذكاء الاصطناعي الخاص بك (على سبيل المثال، Claude Code، Cursor، Windsurf).

للاطلاع على أنماط سير العمل ومتى تستخدم كل أمر، راجع [سير العمل](workflows.md). للاطلاع على أوامر واجهة سطر الأوامر، راجع [واجهة سطر الأوامر](cli.md).

## مرجع سريع

### المسار السريع الافتراضي (ملف التعريف `core`)

| الأمر | الغرض |
|---------|---------|
| `/opsx:propose` | إنشاء تغيير وتوليد عناصر التخطيط في خطوة واحدة |
| `/opsx:explore` | التفكير في الأفكار قبل الالتزام بتغيير |
| `/opsx:apply` | تنفيذ المهام من التغيير |
| `/opsx:update` | مراجعة عناصر التخطيط للتغيير والحفاظ على تماسكها |
| `/opsx:sync` | دمج مواصفات دلتا في المواصفات الرئيسية |
| `/opsx:archive` | أرشفة تغيير مكتمل |

### أوامر سير العمل الموسعة (تحديد مخصص لسير العمل)

| الأمر | الغرض |
|---------|---------|
| `/opsx:new` | بدء هيكل تغيير جديد |
| `/opsx:continue` | إنشاء العنصر التالي بناءً على التبعيات |
| `/opsx:ff` | تقديم سريع: إنشاء جميع عناصر التخطيط دفعة واحدة |
| `/opsx:verify` | التحقق من أن التنفيذ يطابق العناصر |
| `/opsx:bulk-archive` | أرشفة تغييرات متعددة دفعة واحدة |
| `/opsx:onboard` | دليل تعليمي موجه عبر سير العمل الكامل |

الملف التعريفي العام الافتراضي هو `core`. لتمكين أوامر سير العمل الموسعة، قم بتشغيل `openspec config profile`، واختر سير العمل، ثم قم بتشغيل `openspec update` في مشروعك.

---

## مرجع الأوامر

### `/opsx:propose`

إنشاء تغيير جديد وتوليد عناصر التخطيط في خطوة واحدة. هذا هو أمر البدء الافتراضي في ملف التعريف `core`.

**البنية:**
```text
/opsx:propose [change-name-or-description]
```

**الوسائط:**
| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name-or-description` | لا | اسم بحالة kebab-case أو وصف تغيير بلغة عادية |

**ما يفعله:**
- ينشئ `openspec/changes/<change-name>/`
- يولد عناصر التخطيط المطلوبة قبل التنفيذ (للـ `spec-driven`: proposal, specs, design, tasks)
- يتوقف عندما يكون التغيير جاهزًا لـ `/opsx:apply`

**مثال:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**نصائح:**
- استخدم هذا لأسرع مسار من البداية إلى النهاية
- إذا كنت تريد التحكم في عناصر التخطيط خطوة بخطوة، فقم بتفعيل سير العمل الموسع واستخدم `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **ابدأ هنا عندما تكون غير متأكد.** Explore هو شريك تفكير بدون مخاطر: يقرأ قاعدة الكود الخاصة بك، ويقارن الخيارات، ويحول الفكرة الغامضة إلى خطة ملموسة قبل وجود أي تغيير. يأتي مع ملف التعريف الافتراضي. للحالة الكاملة والمزيد من الأمثلة، راجع دليل [Explore First](explore.md).

فكر في الأفكار، وتحقق من المشاكل، ووضح المتطلبات قبل الالتزام بتغيير.

**البنية:**
```
/opsx:explore [topic]
```

**الوسائط:**
| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `topic` | لا | ما تريد استكشافه أو التحقيق فيه |

**ما يفعله:**
- يفتح محادثة استكشافية بدون هيكل مطلوب
- يحقق في قاعدة الكود للإجابة على الأسئلة
- يقارن الخيارات والمناهج
- ينشئ رسومًا بيانية بصرية لتوضيح التفكير
- يمكنه الانتقال إلى `/opsx:propose` (افتراضي) أو `/opsx:new` (سير عمل موسع) عندما تتضح الرؤى

**مثال:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**نصائح:**
- استخدم عندما تكون المتطلبات غير واضحة أو تحتاج إلى تحقيق
- لا يتم إنشاء عناصر التخطيط أثناء الاستكشاف
- جيد لمقارنة مناهج متعددة قبل اتخاذ القرار
- يمكنه قراءة الملفات والبحث في قاعدة الكود

---

### `/opsx:new`

ابدأ هيكلًا جديدًا للتغيير. ينشئ مجلد التغيير وينتظرك لتوليد عناصر التخطيط باستخدام `/opsx:continue` أو `/opsx:ff`.

هذا الأمر جزء من مجموعة سير العمل الموسعة (غير مدرجة في ملف التعريف الافتراضي `core`).

**البنية:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**الوسائط:**
| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | اسم لمجلد التغيير (يطلب إذا لم يتم تقديمه) |
| `--schema` | لا | مخطط سير العمل لاستخدامه (افتراضي: من التكوين أو `spec-driven`) |

**ما يفعله:**
- ينشئ دليل `openspec/changes/<change-name>/`
- ينشئ ملف بيانات وصفية `.openspec.yaml` في مجلد التغيير
- يعرض قالب العنصر الأول جاهزًا للإنشاء
- يطلب اسم التغيير والمخطط إذا لم يتم تقديمهما

**ما ينشئه:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**مثال:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**نصائح:**
- استخدم أسماء وصفية: `add-feature`, `fix-bug`, `refactor-module`
- تجنب الأسماء العامة مثل `update`, `changes`, `wip`
- يمكن أيضًا تعيين المخطط في تكوين المشروع (`openspec/config.yaml`)

---

### `/opsx:continue`

إنشاء العنصر التالي في سلسلة التبعية. ينشئ عنصرًا واحدًا في كل مرة للتقدم التدريجي.

**البنية:**
```
/opsx:continue [change-name]
```

**الوسائط:**
| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير للمتابعة (مستنتج من السياق إذا لم يتم تقديمه) |

**ما يفعله:**
- يستعلم عن رسم بياني لتبعية العناصر
- يعرض أي العناصر جاهزة وأيها محظور
- ينشئ أول عنصر جاهز
- يقرأ ملفات التبعية للسياق
- يعرض ما يصبح متاحًا بعد الإنشاء

**مثال:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**نصائح:**
- استخدم عندما تريد مراجعة كل عنصر قبل المتابعة
- جيد للتغييرات المعقدة حيث تريد التحكم
- قد تصبح عناصر متعددة جاهزة في نفس الوقت
- يمكنك تعديل العناصر المنشأة قبل المتابعة

---

### `/opsx:ff`

التقديم السريع خلال إنشاء العناصر. ينشئ جميع عناصر التخطيط دفعة واحدة.

**البنية:**
```
/opsx:ff [change-name]
```

**الوسائط:**
| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير للتقديم السريع (مستنتج من السياق إذا لم يتم تقديمه) |

**ما يفعله:**
- ينشئ جميع العناصر بترتيب التبعية
- يتتبع التقدم عبر قائمة المهام
- يتوقف عندما تكون جميع العناصر المطلوبة للتطبيق مكتملة
- يقرأ كل تبعية قبل إنشاء العنصر التالي

**مثال:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**نصائح:**
- استخدم عندما تكون لديك صورة واضحة لما تبني
- أسرع من `/opsx:continue` للتغييرات البسيطة
- لا يزال بإمكانك تعديل العناصر بعد ذلك
- جيد للميزات الصغيرة إلى المتوسطة

---

### `/opsx:apply`

تنفيذ المهام من التغيير. يعمل من خلال قائمة المهام، وكتابة الكود وتحديد العناصر المكتملة.

**البنية:**
```
/opsx:apply [change-name]
```

**الوسائط:**
| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير لتنفيذه (مستنتج من السياق إذا لم يتم تقديمه) |

**ما يفعله:**
- يقرأ `tasks.md` ويحدد المهام غير المكتملة
- يعمل من خلال المهام واحدة تلو الأخرى
- يكتب الكود، وينشئ الملفات، ويشغل الاختبارات حسب الحاجة
- يحدد المهام مكتملة باستخدام مربعات الاختيار `[x]`

**مثال:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**نصائح:**
- يمكنه الاستئناف من حيث توقفت إذا تم مقاطعته
- استخدم للتغييرات المتوازية عن طريق تحديد اسم التغيير
- يتم تتبع حالة الإكمال في مربعات الاختيار في `tasks.md`

---

### `/opsx:update`

مراجعة عناصر التخطيط الحالية للتغيير والحفاظ على تماسكها مع بعضها البعض. عناصر التخطيط فقط - لا يعدل الكود أبدًا.

**البنية:**

```text
/opsx:update [change-name]
```

**الوسائط:**

| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير لتحديثه (مستنتج من السياق إذا لم يتم تقديمه) |

**ما يفعله:**

- يقرأ عناصر التغيير عبر `openspec status --change <name> --json`
- يطبق المراجعة المطلوبة، أو يراجع العناصر للبحث عن تناقضات إذا لم تحدد واحدة
- يوفق بين العناصر الموجودة الأخرى في أي اتجاه (قد ينتشر تعديل التصميم مرة أخرى إلى المقترح)
- يؤكد كل تعديل معك قبل الكتابة، عنصرًا واحدًا في كل مرة
- ينتهي بتوصية الخطوة التالية: `/opsx:continue` (عناصر مفقودة)، `/opsx:apply` (نقل خطة منقحة إلى الكود)، أو `/opsx:archive` (انتهى كل شيء)

**مثال:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**نصائح:**

- لن ينشئ عناصر مفقودة - هذا هو `/opsx:continue`
- إذا كان التغيير قد تم تنفيذه بالفعل، فتابع باستخدام `/opsx:apply` حتى يتطابق الكود مع الخطة المنقحة
- إذا غيرت مراجعتك هدف التغيير، فابدأ من جديد بتغيير جديد بدلاً من ذلك (راجع [When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

التحقق من أن التنفيذ يطابق عناصر التغيير الخاصة بك. يتحقق من الاكتمال والصحة والتماسك.

**البنية:**
```
/opsx:verify [change-name]
```

**الوسائط:**
| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير للتحقق منه (مستنتج من السياق إذا لم يتم تقديمه) |

**ما يفعله:**
- يتحقق من ثلاثة أبعاد لجودة التنفيذ
- يبحث في قاعدة الكود عن أدلة التنفيذ
- يبلغ عن المشاكل المصنفة على أنها CRITICAL أو WARNING أو SUGGESTION
- لا يحظر الأرشيف، ولكنه يظهر المشاكل

**أبعاد التحقق:**

| البعد | ما يتحقق منه |
|-----------|-------------------|
| **الاكتمال** | جميع المهام مكتملة، وجميع المتطلبات منفذة، والسيناريوهات مغطاة |
| **الصحة** | التنفيذ يطابق هدف المواصفة، والحالات الحدية معالجة |
| **التماسك** | قرارات التصميم منعكسة في الكود، والأنماط متسقة |

**مثال:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**نصائح:**
- تشغيل قبل الأرشفة للقبض على عدم التطابق مبكرًا
- التحذيرات لا تحظر الأرشيف ولكنها تشير إلى مشاكل محتملة
- جيد لمراجعة عمل الذكاء الاصطناعي قبل الالتزام
- يمكنه الكشف عن الانحراف بين العناصر والتنفيذ

---

### `/opsx:sync`

**أمر اختياري.** دمج مواصفات دلتا من تغيير في المواصفات الرئيسية. سيطلب الأرشيف المزامنة إذا لزم الأمر، لذلك لا تحتاج عادةً إلى تشغيل هذا يدويًا.

**البنية:**
```
/opsx:sync [change-name]
```

**الوسائط:**
| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير لمزامنته (مستنتج من السياق إذا لم يتم تقديمه) |

**ما يفعله:**
- يقرأ مواصفات دلتا من مجلد التغيير
- يحلل أقسام ADDED/MODIFIED/REMOVED/RENAMED
- يدمج التغييرات في الدليل الرئيسي `openspec/specs/`
- يحافظ على المحتوى الموجود غير المذكور في دلتا
- لا يؤرشف التغيير (يبقى نشطًا)

**مثال:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**متى تستخدمه يدويًا:**

| السيناريو | استخدم المزامنة؟ |
|----------|-----------|
| تغيير طويل الأمد، تريد المواصفات في الرئيسية قبل الأرشفة | نعم |
| تغييرات متوازية متعددة تحتاج إلى المواصفات الأساسية المحدثة | نعم |
| تريد معاينة/مراجعة الدمج بشكل منفصل | نعم |
| تغيير سريع، يذهب مباشرة إلى الأرشيف | لا (الأرشيف يتعامل معه) |

**نصائح:**
- المزامنة ذكية، وليست نسخ ولصق
- يمكنه إضافة سيناريوهات إلى المتطلبات الموجودة دون تكرار
- يبقى التغيير نشطًا بعد المزامنة (غير مؤرشف)
- معظم المستخدمين لن يحتاجوا أبدًا إلى استدعاء هذا مباشرة - يطلب الأرشيف إذا لزم الأمر

---

### `/opsx:archive`

أرشفة تغيير مكتمل. يختتم التغيير وينقله إلى مجلد الأرشيف.

**البنية:**
```
/opsx:archive [change-name]
```

**الوسائط:**
| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير لأرشفته (مستنتج من السياق إذا لم يتم تقديمه) |

**ما يفعله:**
- يتحقق من حالة اكتمال العناصر
- يتحقق من اكتمال المهام (يحذر إذا كانت غير مكتملة)
- يعرض مزامنة مواصفات دلتا إذا لم تتم مزامنتها بالفعل
- ينقل مجلد التغيير إلى `openspec/changes/archive/YYYY-MM-DD-<name>/`
- يحافظ على جميع العناصر لمسار التدقيق

**مثال:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**نصائح:**
- الأرشيف لن يحظر بسبب المهام غير المكتملة، ولكنه سيحذر
- يمكن مزامنة مواصفات دلتا أثناء الأرشفة أو قبلها
- يتم الحفاظ على التغييرات المؤرشفة للسجل
- استخدم `/opsx:verify` أولاً للقبض على المشاكل

---

### `/opsx:bulk-archive`

أرشفة تغييرات مكتملة متعددة دفعة واحدة. يتعامل مع تعارضات المواصفات بين التغييرات.

**البنية:**
```
/opsx:bulk-archive [change-names...]
```

**الوسائط:**
| الوسيط | مطلوب | الوصف |
|----------|----------|-------------|
| `change-names` | لا | تغييرات محددة لأرشفتها (يطلب التحديد إذا لم يتم تقديمه) |

**ما يفعله:**
- يسرد جميع التغييرات المكتملة
- يتحقق من صحة كل تغيير قبل الأرشفة
- يكشف عن تعارضات المواصفات عبر التغييرات
- يحل التعارضات عن طريق التحقق مما تم تنفيذه بالفعل
- يؤرشف بترتيب زمني

**مثال:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**نصائح:**
- جيد لتيارات العمل المتوازية
- حل التعارضات استباقي (يتحقق من قاعدة الكود)
- يتم أرشفة التغييرات بترتيب الإنشاء
- يطلب قبل الكتابة فوق محتوى المواصفة

---

### `/opsx:onboard`

إرشاد الإعداد الأولي عبر سير عمل OpenSpec الكامل. درس تعليمي تفاعلي يستخدم قاعدة الكود الفعلية الخاصة بك.

**البنية:**
```
/opsx:onboard
```

**ما يفعله:**
- يمر عبر دورة سير عمل كاملة مع سرد
- يفحص قاعدة الكود الخاصة بك عن فرص تحسين حقيقية
- ينشئ تغييرًا فعليًا مع عناصر حقيقية
- ينفذ عملاً فعليًا (تغييرات صغيرة وآمنة)
- يأرشف التغيير المكتمل
- يشرح كل خطوة أثناء حدوثها

**المراحل:**
1. الترحيب وتحليل قاعدة الكود
2. إيجاد فرصة تحسين
3. إنشاء تغيير (`/opsx:new`)
4. كتابة المقترح
5. إنشاء المواصفات
6. كتابة التصميم
7. إنشاء المهام
8. تنفيذ المهام (`/opsx:apply`)
9. التحقق من التنفيذ
10. أرشفة التغيير
11. ملخص والخطوات التالية

**مثال:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**نصائح:**
- الأفضل للمستخدمين الجدد الذين يتعلمون سير العمل
- يستخدم كودًا فعليًا، وليس أمثلة وهمية
- ينشئ تغييرًا فعليًا يمكنك الاحتفاظ به أو التخلص منه
- يستغرق 15-30 دقيقة للإكمال

## بناء جملة الأوامر حسب أداة الذكاء الاصطناعي

تستخدم أدوات الذكاء الاصطناعي المختلفة بناء جملة أوامر مختلفة قليلاً. استخدم التنسيق الذي يتطابق مع أداتك:

| الأداة | مثال بناء الجملة |
|------|----------------|
| Claude Code | `/opsx:propose`، `/opsx:apply` |
| Cursor | `/opsx-propose`، `/opsx-apply` |
| Windsurf | `/opsx-propose`، `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`، `/opsx-apply` |
| CodeArts | استدعاءات قائمة على المهارات مثل `/openspec-propose`، `/openspec-apply-change` (لا توجد ملفات أوامر `opsx-*` تم إنشاؤها) |
| Codex | استدعاءات قائمة على المهارات من `.codex/skills/openspec-*` (لا توجد ملفات موجهات `opsx-*` تم إنشاؤها) |
| Oh My Pi | `/opsx-propose`، `/opsx-apply` |
| Kimi Code | استدعاءات قائمة على المهارات مثل `/skill:openspec-propose`، `/skill:openspec-apply-change` (لا توجد ملفات أوامر `opsx-*` تم إنشاؤها) |
| Trae | `/opsx-propose`، `/opsx-apply` |

الهدف هو نفسه عبر جميع الأدوات، ولكن طريقة ظهور الأوامر يمكن أن تختلف حسب التكامل.

> **ملاحظة:** أوامر GitHub Copilot (`.github/prompts/*.prompt.md`) متوفرة فقط في امتدادات IDE (VS Code، JetBrains، Visual Studio). لا تدعم GitHub Copilot CLI ملفات الموجهات المخصصة حالياً — راجع [الأدوات المدعومة](supported-tools.md) للتفاصيل والحلول البديلة.

---

## الأوامر القديمة

تستخدم هذه الأوامر سير العمل الأقدم "الكل دفعة واحدة". لا تزال تعمل ولكن يوصى بأوامر OPSX.

| الأمر | ما يفعله |
|---------|--------------|
| `/openspec:proposal` | إنشاء جميع القطع الأثرية دفعة واحدة (اقتراح، مواصفات، تصميم، مهام) |
| `/openspec:apply` | تنفيذ التغيير |
| `/openspec:archive` | أرشفة التغيير |

**متى تستخدم الأوامر القديمة:**
- المشاريع الحالية التي تستخدم سير العمل القديم
- التغييرات البسيطة التي لا تحتاج إلى إنشاء تدريجي للقطع الأثرية
- التفضيل لنهج الكل أو لا شيء

**الترحيل إلى OPSX:**
يمكن متابعة التغييرات القديمة بأوامر OPSX. هيكل القطع الأثرية متوافق.

---

## استكشاف الأخطاء وإصلاحها

### "التغيير غير موجود"

لم يتمكن الأمر من تحديد التغيير الذي يجب العمل عليه.

**الحلول:**
- حدد اسم التغيير بشكل صريح: `/opsx:apply add-dark-mode`
- تحقق من وجود مجلد التغيير: `openspec list`
- تحقق من أنك في دليل المشروع الصحيح

### "لا توجد قطع أثرية جاهزة"

جميع القطع الأثرية إما مكتملة أو محجوبة بسبب تبعيات مفقودة.

**الحلول:**
- قم بتشغيل `openspec status --change <name>` لمعرفة ما الذي يحجب التقدم
- تحقق من وجود القطع الأثرية المطلوبة
- قم بإنشاء القطع الأثرية التابعة المفقودة أولاً

### "المخطط غير موجود"

المخطط المحدد غير موجود.

**الحلول:**
- قم بسرد المخططات المتاحة: `openspec schemas`
- تحقق من تهجئة اسم المخطط
- قم بإنشاء المخطط إذا كان مخصصاً: `openspec schema init <name>`

### الأوامر غير معترف بها

أداة الذكاء الاصطناعي لا تعرف أوامر OpenSpec.

**الحلول:**
- تأكد من تهيئة OpenSpec: `openspec init`
- أعد إنشاء المهارات: `openspec update`
- تحقق من وجود دليل `.claude/skills/` (لـ Claude Code)
- أعد تشغيل أداة الذكاء الاصطناعي لاستلام المهارات الجديدة

### القطع الأثرية لا يتم إنشاؤها بشكل صحيح

ينشئ الذكاء الاصطناعي قطعاً أثرية غير مكتملة أو غير صحيحة.

**الحلول:**
- أضف سياق المشروع في `openspec/config.yaml`
- أضف قواعد لكل قطعة أثرية للحصول على إرشادات محددة
- قدم المزيد من التفاصيل في وصف التغيير
- استخدم `/opsx:continue` بدلاً من `/opsx:ff` لمزيد من التحكم

---

## الخطوات التالية

- [سير العمل](workflows.md) - الأنماط الشائعة ومتى تستخدم كل أمر
- [CLI](cli.md) - أوامر المحطة الطرفية للإدارة والتحقق من الصحة
- [التخصيص](customization.md) - إنشاء مخططات وسير عمل مخصصة