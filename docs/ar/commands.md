# الأوامر

هذا هو مرجع أوامر OpenSpec ذات الشرطة المائلة. تُستدعى هذه الأوامر في واجهة الدردشة الخاصة بمساعد البرمجة بالذكاء الاصطناعي (مثل Claude Code و Cursor و Windsurf).

لأنماط سير العمل ومتى يجب استخدام كل أمر، راجع [سير العمليات (Workflows)](workflows.md). أما بالنسبة لأوامر سطر الأوامر (CLI)، فراجع [CLI](cli.md).

## مرجع سريع

### المسار السريع الافتراضي (`core` profile)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | إنشاء تغيير وتوليد نواتج التخطيط في خطوة واحدة |
| `/opsx:explore` | التفكير في الأفكار قبل الالتزام بالتغيير |
| `/opsx:apply` | تنفيذ المهام من التغيير |
| `/opsx:sync` | دمج مواصفات الفروقات (delta specs) في المواصفات الرئيسية |
| `/opsx:archive` | أرشفة تغيير مكتمل |

### أوامر سير العمليات الموسعة (اختيار سير عمل مخصص)

| Command | Purpose |
|---------|---------|
| `/opsx:new` | بدء هيكل تغيير جديد |
| `/opsx:continue` | إنشاء النتيجة التالية بناءً على التبعيات |
| `/opsx:ff` | التقدم السريع (Fast-forward): إنشاء جميع نواتج التخطيط دفعة واحدة |
| `/opsx:verify` | التحقق من أن التنفيذ يطابق النواتج |
| `/opsx:bulk-archive` | أرشفة تغييرات متعددة دفعة واحدة |
| `/opsx:onboard` | دليل إرشادي عبر سير العمليات بالكامل |

ملف التعريف العالمي الافتراضي هو `core`. لتفعيل أوامر سير العمليات الموسعة، قم بتشغيل `openspec config profile`، واختر سير العمليات، ثم قم بتشغيل `openspec update` في مشروعك.

## مرجع الأوامر

### `/opsx:propose`

إنشاء تغيير جديد وتوليد مواد التخطيط في خطوة واحدة. هذا هو الأمر الافتراضي للبدء في ملف التعريف `core`.

**الصيغة:**
```text
/opsx:propose [change-name-or-description]
```

**المُدخلات (Arguments):**
| المُدخل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name-or-description` | لا | اسم بتنسيق kebab-case أو وصف التغيير باللغة العادية |

**ماذا يفعل:**
- ينشئ المجلد `openspec/changes/<change-name>/`
- يولد المواد اللازمة قبل التنفيذ (للتخطيط: المقترح، والمواصفات، والتصميم، والمهام)
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
- استخدم هذا المسار للحصول على أسرع عملية من البداية إلى النهاية
- إذا كنت ترغب في التحكم التدريجي في المواد، فقم بتمكين سير العمل الموسع (expanded workflows) واستخدم `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **ابدأ هنا عندما تكون غير متأكد.** Explore هو شريك تفكير لا يحمل مخاطر؛ فهو يقرأ قاعدة الكود الخاصة بك، ويقارن الخيارات، ويحول فكرة غامضة إلى خطة ملموسة قبل وجود أي تغيير. وهو مُضمَّن في ملف التعريف الافتراضي. للحصول على المزيد من الأمثلة والحالة الكاملة، راجع دليل [Explore First](explore.md).

فكر في الأفكار، وقم بالتحقيق في المشكلات، ووضح المتطلبات قبل الالتزام بأي تغيير.

**الصيغة:**
```
/opsx:explore [topic]
```

**المُدخلات (Arguments):**
| المُدخل | مطلوب | الوصف |
|----------|----------|-------------|
| `topic` | لا | ما تريد استكشافه أو التحقيق فيه |

**ماذا يفعل:**
- يفتح محادثة استكشافية دون الحاجة إلى هيكل معين
- يحقق في قاعدة الكود للإجابة على الأسئلة
- يقارن الخيارات والنهجيات
- ينشئ رسوم بيانية مرئية لتوضيح التفكير
- يمكنه الانتقال إلى `/opsx:propose` (افتراضي) أو `/opsx:new` (سير العمل الموسع) عندما تتضح الرؤى

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
- استخدمه عندما تكون المتطلبات غير واضحة أو تحتاج إلى التحقيق
- لا يتم إنشاء أي مواد أثناء الاستكشاف
- جيد لمقارنة نهجيات متعددة قبل اتخاذ القرار
- يمكنه قراءة الملفات والبحث في قاعدة الكود

---

### `/opsx:new`

ابدأ هيكل تغيير جديد. ينشئ مجلد التغيير وينتظر منك توليد المواد باستخدام `/opsx:continue` أو `/opsx:ff`.

هذا الأمر جزء من مجموعة سير العمل الموسع (غير مُدرج في ملف التعريف `core` الافتراضي).

**الصيغة:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**المُدخلات (Arguments):**
| المُدخل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | اسم مجلد التغيير (يتم سؤاله إذا لم يتم توفيره) |
| `--schema` | لا | مخطط سير العمل المراد استخدامه (الافتراضي: من الإعدادات أو `spec-driven`) |

**ماذا يفعل:**
- ينشئ المجلد `openspec/changes/<change-name>/`
- ينشئ ملف البيانات الوصفية `.openspec.yaml` في مجلد التغيير
- يعرض قالب المادة الأولية الجاهز للإنشاء
- يسأل عن اسم التغيير والمخطط إذا لم يتم توفيرهما

**ماذا ينشئ:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # بيانات وصفية للتغيير (المخطط، وتاريخ الإنشاء)
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
- استخدم أسماء وصفية: `add-feature`، `fix-bug`، `refactor-module`
- تجنب الأسماء العامة مثل `update` أو `changes` أو `wip`
- يمكن تعيين المخطط أيضًا في إعدادات المشروع (`openspec/config.yaml`)

---

### `/opsx:continue`

أنشئ المادة التالية في سلسلة التبعيات. ينشئ مادة واحدة في كل مرة لتحقيق تقدم تدريجي.

**الصيغة:**
```
/opsx:continue [change-name]
```

**المُدخلات (Arguments):**
| المُدخل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | التغيير الذي يجب متابعته (يستنتج من السياق إذا لم يتم توفيره) |

**ماذا يفعل:**
- يستعلم عن رسم بياني تبعيات المادة
- يوضح أي المواد جاهزة وأيها محظورة
- ينشئ المادة الجاهزة الأولى
- يقرأ ملفات التبعية للحصول على السياق
- يوضح ما يصبح متاحًا بعد الإنشاء

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
- استخدمه عندما تريد مراجعة كل مادة قبل المتابعة
- جيد للتغييرات المعقدة حيث تريد التحكم
- قد تصبح عدة مواد جاهزة في وقت واحد
- يمكنك تحرير المواد التي تم إنشاؤها قبل الاستمرار

---

### `/opsx:ff`

التجاوز السريع لعملية إنشاء المواد. ينشئ جميع مواد التخطيط دفعة واحدة.

**الصيغة:**
```
/opsx:ff [change-name]
```

**المُدخلات (Arguments):**
| المُدخل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | التغيير الذي يجب تجاوز عمله بسرعة (يستنتج من السياق إذا لم يتم توفيره) |

**ماذا يفعل:**
- ينشئ جميع المواد بترتيب التبعية
- يتتبع التقدم عبر قائمة المهام المطلوبة (todo list)
- يتوقف عندما تكتمل جميع المواد `apply-required`
- يقرأ كل تبعية قبل إنشاء المادة التالية

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
- استخدمه عندما تكون لديك صورة واضحة لما تقوم ببنائه
- أسرع من `/opsx:continue` للتغييرات الواضحة
- لا يزال بإمكانك تحرير المواد بعد ذلك
- جيد للميزات الصغيرة إلى المتوسطة

---

### `/opsx:apply`

تنفيذ المهام المحددة في التغيير. يعمل عبر قائمة المهام، ويكتب الكود ويحدد العناصر المنجزة.

**الصيغة:**
```
/opsx:apply [change-name]
```

**المُدخلات (Arguments):**
| المُدخل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | التغيير الذي يجب تنفيذه (يستنتج من السياق إذا لم يتم توفيره) |

**ماذا يفعل:**
- يقرأ `tasks.md` ويحدد المهام غير المكتملة
- يعمل على المهام واحدة تلو الأخرى
- يكتب الكود، وينشئ الملفات، ويشغل الاختبارات حسب الحاجة
- يضع علامة "مكتمل" على المهام باستخدام مربعات الاختيار `[x]`

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
- يمكنه استئناف العمل من حيث توقفت إذا تم مقاطعته
- استخدمه للتغييرات المتوازية عن طريق تحديد اسم التغيير
- يتم تتبع حالة الإكمال في مربعات الاختيار الموجودة في `tasks.md`

---

### `/opsx:verify`

التحقق من أن التنفيذ يطابق مواد التغيير الخاصة بك. يتحقق من الاكتمال والصحة والاتساق.

**الصيغة:**
```
/opsx:verify [change-name]
```

**المُدخلات (Arguments):**
| المُدخل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | التغيير الذي يجب التحقق منه (يستنتج من السياق إذا لم يتم توفيره) |

**ماذا يفعل:**
- يتحقق من ثلاثة أبعاد لجودة التنفيذ
- يبحث في قاعدة الكود بحثًا عن دليل التنفيذ
- يبلغ عن المشكلات المصنفة على أنها CRITICAL أو WARNING أو SUGGESTION
- لا يمنع الأرشفة، ولكنه يعرض المشكلات

**أبعاد التحقق:**

| البُعد | ما الذي يتم التحقق منه |
|-----------|-------------------|
| **الاكتمال (Completeness)** | جميع المهام مكتملة، وجميع المتطلبات مطبقة، وتم تغطية السيناريوهات |
| **الصحة (Correctness)** | التنفيذ يطابق نية المواصفات، والتعامل مع الحالات الطرفية (edge cases) |
| **الاتساق (Coherence)** | قرارات التصميم منعكسة في الكود، والأنماط متسقة |

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
- قم بتشغيله قبل الأرشفة لاكتشاف أي عدم تطابق في وقت مبكر
- التحذيرات لا تمنع الأرشفة ولكنها تشير إلى مشكلات محتملة
- جيد لمراجعة عمل الذكاء الاصطناعي قبل الالتزام به
- يمكنه الكشف عن الانحراف بين المواد والتنفيذ

---

### `/opsx:sync`

**أمر اختياري.** دمج مواصفات التغيير (delta specs) في المواصفات الرئيسية. سيطلب الأرشفة المزامنة إذا لزم الأمر، لذا فمن غير المحتمل أن تحتاج إلى تشغيل هذا يدويًا.

**الصيغة:**
```
/opsx:sync [change-name]
```

**المُدخلات (Arguments):**
| المُدخل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | التغيير الذي يجب مزامنته (يستنتج من السياق إذا لم يتم توفيره) |

**ماذا يفعل:**
- يقرأ مواصفات التغيير (delta specs) من مجلد التغيير
- يحلل أقسام ADDED/MODIFIED/REMOVED/RENAMED
- يدمج التغييرات في المجلد الرئيسي `openspec/specs/`
- يحافظ على المحتوى الحالي غير المذكور في التغيير (delta)
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

**متى يجب استخدامه يدويًا:**

| السيناريو | هل يجب استخدام sync؟ |
|----------|-----------|
| تغيير طويل الأمد، وتريد وجود المواصفات في الرئيسية قبل الأرشفة | نعم |
| تحتاج عدة تغييرات متوازية إلى المواصفات الأساسية المحدثة | نعم |
| تريد معاينة/مراجعة الدمج بشكل منفصل | نعم |
| تغيير سريع، وتنتقل مباشرة إلى الأرشيف | لا (الأرشفة تتولى الأمر) |

**نصائح:**
- عملية المزامنة ذكية وليست نسخًا ولصقًا
- يمكنها إضافة سيناريوهات إلى المتطلبات الموجودة دون تكرار
- يظل التغيير نشطًا بعد المزامنة (غير مؤرشف)
- لن يحتاج معظم المستخدمين أبدًا إلى استدعاء هذا الأمر مباشرة - الأرشفة تسأل إذا لزم الأمر

---

### `/opsx:archive`

أرشفة تغيير مكتمل. ينهي التغيير وينقله إلى مجلد الأرشيف.

**الصيغة:**
```
/opsx:archive [change-name]
```

**المُدخلات (Arguments):**
| المُدخل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | التغيير الذي يجب أرشيفته (يستنتج من السياق إذا لم يتم توفيره) |

**ماذا يفعل:**
- يتحقق من حالة اكتمال المواد
- يتحقق من إكمال المهام (يحذر إذا كانت غير مكتملة)
- يعرض خيار مزامنة مواصفات التغيير (delta specs) إذا لم تكن قد تمت المزامنة بالفعل
- ينقل مجلد التغيير إلى `openspec/changes/archive/YYYY-MM-DD-<name>/`
- يحافظ على جميع المواد لسجل التدقيق

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
- لن يمنع الأرشفة عدم اكتمال المهام، ولكنه سيحذر
- يمكن مزامنة مواصفات التغيير أثناء الأرشفة أو قبلها
- يتم حفظ التغييرات المؤرشفة للسجل التاريخي
- استخدم `/opsx:verify` أولاً لاكتشاف المشكلات

---

### `/opsx:bulk-archive`

أرشفة عدة تغييرات مكتملة دفعة واحدة. يتعامل مع تعارضات المواصفات بين التغييرات.

**الصيغة:**
```
/opsx:bulk-archive [change-names...]
```

**المُدخلات (Arguments):**
| المُدخل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-names` | لا | التغييرات المحددة المراد أرشيفتها (يسأل للاختيار إذا لم يتم توفيره) |

**ماذا يفعل:**
- يسرد جميع التغييرات المكتملة
- يتحقق من كل تغيير قبل الأرشفة
- يكتشف تعارضات المواصفات عبر التغييرات
- يحل التعارضات عن طريق التحقق مما هو مطبق فعليًا
- يأرشف بالترتيب الزمني

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
- جيد لمسارات العمل المتوازية
- حل التعارضات هو عملية وكيلة (agentic) (يتحقق من قاعدة الكود)
- يتم أرشفة التغييرات بالترتيب الزمني للإنشاء
- يسأل قبل الكتابة فوق محتوى المواصفات

---

### `/opsx:onboard`

إرشاد للمستخدمين الجدد عبر سير عمل OpenSpec الكامل. وهو دليل تفاعلي يستخدم قاعدة الكود الفعلية الخاصة بك.

**الصيغة:**
```
/opsx:onboard
```

**ماذا يفعل:**
- يمر عبر دورة عمل كاملة مع السرد القصصي (narration)
- يبحث في قاعدة الكود بحثًا عن فرص تحسين حقيقية
- ينشئ تغييرًا فعليًا بمواد حقيقية
- ينفذ العمل الفعلي (تغييرات صغيرة وآمنة)
- يأرشف التغيير المكتمل
- يشرح كل خطوة أثناء حدوثها

**المراحل:**
1. الترحيب وتحليل قاعدة الكود
2. العثور على فرصة للتحسين
3. إنشاء تغيير (`/opsx:new`)
4. كتابة المقترح
5. إنشاء المواصفات (specs)
6. كتابة التصميم
7. إنشاء المهام
8. تنفيذ المهام (`/opsx:apply`)
9. التحقق من التنفيذ
10. أرشفة التغيير
11. الملخص والخطوات التالية

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
- يستخدم كودًا حقيقيًا، وليس أمثلة لعب
- ينشئ تغييرًا حقيقيًا يمكنك الاحتفاظ به أو التخلص منه
- يستغرق من 15 إلى 30 دقيقة لإكماله

## صيغة الأوامر حسب أداة الذكاء الاصطناعي

تستخدم أدوات الذكاء الاصطناعي المختلفة صيغ أوامر مختلفة قليلاً. استخدم التنسيق الذي يتناسب مع أداتك:

| الأداة | مثال على الصيغة |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

النية واحدة عبر جميع الأدوات، لكن طريقة ظهور الأوامر قد تختلف حسب التكامل.

> **ملاحظة:** أوامر GitHub Copilot (`.github/prompts/*.prompt.md`) متاحة فقط في إضافات IDE (VS Code, JetBrains, Visual Studio). لا يدعم GitHub Copilot CLI حاليًا ملفات المطالبات المخصصة — راجع [Supported Tools](supported-tools.md) للحصول على التفاصيل والحلول البديلة.

---

## الأوامر القديمة

تستخدم هذه الأوامر سير عمل "الكل دفعة واحدة" الأقدم. لا تزال تعمل ولكن يوصى باستخدام أوامر OPSX.

| الأمر | ما يفعله |
|---------|--------------|
| `/openspec:proposal` | إنشاء جميع القطع الأثرية مرة واحدة (مقترح، ومواصفات، وتصميم، ومهام) |
| `/openspec:apply` | تنفيذ التغيير |
| `/openspec:archive` | أرشفة التغيير |

**متى تستخدم الأوامر القديمة:**
- المشاريع الحالية التي تستخدم سير العمل القديم.
- التغييرات البسيطة التي لا تحتاج فيها إلى إنشاء قطع أثرية تزايدية.
- تفضيل نهج "الكل أو لا شيء".

**الانتقال إلى OPSX:**
يمكن متابعة التغييرات القديمة باستخدام أوامر OPSX. الهيكل الخاص بالقطع الأثرية متوافق.

---

## استكشاف الأخطاء وإصلاحها

### "لم يتم العثور على التغيير"

لم يتمكن الأمر من تحديد التغيير الذي يجب العمل عليه.

**الحلول:**
- حدد اسم التغيير بشكل صريح: `/opsx:apply add-dark-mode`
- تحقق من وجود مجلد التغيير: `openspec list`
- تحقق من أنك في دليل المشروع الصحيح.

### "لا توجد قطع أثرية جاهزة"

جميع القطع الأثرية إما مكتملة أو معطلة بسبب نقص التبعيات (dependencies).

**الحلول:**
- قم بتشغيل `openspec status --change <name>` لمعرفة ما الذي يعيق العملية.
- تحقق مما إذا كانت القطع الأثرية المطلوبة موجودة.
- إنشاء قطع الأثرية التابعة المفقودة أولاً.

### "لم يتم العثور على المخطط (Schema)"

المخطط المحدد غير موجود.

**الحلول:**
- اعرض المخططات المتاحة: `openspec schemas`
- تحقق من تهجئة اسم المخطط.
- أنشئ المخطط إذا كان مخصصًا: `openspec schema init <name>`

### الأوامر غير معترف بها

أداة الذكاء الاصطناعي لا تتعرف أوامر OpenSpec.

**الحلول:**
- تأكد من تهيئة OpenSpec: `openspec init`
- أعد إنشاء المهارات (skills): `openspec update`
- تحقق من وجود الدليل `.claude/skills/` (لأداة Claude Code).
- أعد تشغيل أداة الذكاء الاصطناعي الخاصة بك لتلقي المهارات الجديدة.

### عدم إنشاء القطع الأثرية بشكل صحيح

يقوم الذكاء الاصطناعي بإنشاء قطع أثرية غير كاملة أو خاطئة.

**الحلول:**
- أضف سياق المشروع في `openspec/config.yaml`.
- أضف قواعد لكل قطعة أثرية لتوجيه محدد.
- قدم المزيد من التفاصيل في وصف التغيير الخاص بك.
- استخدم `/opsx:continue` بدلاً من `/opsx:ff` لمزيد من التحكم.

---

## الخطوات التالية

- [سير العمل](workflows.md) - الأنماط الشائعة ومتى استخدام كل أمر.
- [واجهة سطر الأوامر (CLI)](cli.md) - أوامر الطرفية للإدارة والتحقق.
- [التخصيص](customization.md) - إنشاء مخططات وسير عمل مخصصة.