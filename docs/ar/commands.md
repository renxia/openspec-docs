# الأوامر

هذا هو المرجع لأوامر الشرط المائل في OpenSpec. يتم استدعاء هذه الأوامر في واجهة المحادثة لمساعد البرمجة بالذكاء الاصطناعي الخاص بك (مثل Claude Code، Cursor، Windsurf).

لمعرفة أنماط سير العمل ومتى تستخدم كل أمر، راجع [سير العمل](workflows.md). لأوامر سطر الأوامر، راجع [سطر الأوامر](cli.md).

## مرجع سريع

### المسار السريع الافتراضي (ملف `core`)

| الأمر | الغرض |
|---------|---------|
| `/opsx:propose` | إنشاء تغيير وتوليد مخرجات التخطيط في خطوة واحدة |
| `/opsx:explore` | التفكير في الأفكار قبل الالتزام بتغيير |
| `/opsx:apply` | تنفيذ المهام من التغيير |
| `/opsx:archive` | أرشفة تغيير مكتمل |

### أوامر سير العمل الموسعة (اختيار سير عمل مخصص)

| الأمر | الغرض |
|---------|---------|
| `/opsx:new` | بدء هيكل تغيير جديد |
| `/opsx:continue` | إنشاء المخرج التالي بناءً على التبعيات |
| `/opsx:ff` | التقدم السريع: إنشاء جميع مخرجات التخطيط دفعة واحدة |
| `/opsx:verify` | التحقق من تطابق التنفيذ مع المخرجات |
| `/opsx:sync` | دمج المواصفات التفاضلية في المواصفات الرئيسية |
| `/opsx:bulk-archive` | أرشفة تغييرات متعددة دفعة واحدة |
| `/opsx:onboard` | درس تعليمي موجه عبر سير العمل الكامل |

الملف العالمي الافتراضي هو `core`. لتفعيل أوامر سير العمل الموسعة، قم بتشغيل `openspec config profile`، واختر سير العمل، ثم قم بتشغيل `openspec update` في مشروعك.

---

## مرجع الأوامر

### `/opsx:propose`

إنشاء تغيير جديد وإنتاج مخرجات التخطيط في خطوة واحدة. هذه هي الأمر الافتراضي للبدء في ملف تعريف `core`.

**الصيغة:**
```text
/opsx:propose [change-name-or-description]
```

**المعاملات:**
| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name-or-description` | لا | اسم بتنسيق kebab-case أو وصف تغيير بلغة واضحة |

**ما يفعله:**
- ينشئ `openspec/changes/<change-name>/`
- ينشئ المخرجات اللازمة قبل التنفيذ (في حالة `spec-driven`: اقتراح، مواصفات، تصميم، مهام)
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
- استخدم هذا الأمر للحصول على أسرع مسار شامل
- إذا كنت تريد التحكم خطوة بخطوة في المخرجات، قم بتمكين سير العمل الموسع واستخدم `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

التفكير في الأفكار، واستكشاف المشاكل، وتوضيح المتطلبات قبل الالتزام بتغيير.

**الصيغة:**
```
/opsx:explore [topic]
```

**المعاملات:**
| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `topic` | لا | ما تريد استكشافه أو التحقيق فيه |

**ما يفعله:**
- يفتح محادثة استكشافية دون هيكل مطلوب
- يستكشف قاعدة الكود للإجابة على الأسئلة
- يقارن الخيارات والنهج
- ينشئ مخططات مرئية لتوضيح الأفكار
- يمكنه الانتقال إلى `/opsx:propose` (الافتراضي) أو `/opsx:new` (سير عمل موسع) عندما تتبلور الأفكار

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
- لا يتم إنشاء أي مخرجات أثناء الاستكشاف
- جيد لمقارنة نهج متعددة قبل اتخاذ القرار
- يمكنه قراءة الملفات واستكشاف قاعدة الكود

---

### `/opsx:new`

بدء هيكل تغيير جديد. ينشئ مجلد التغيير وينتظر منك إنتاج المخرجات باستخدام `/opsx:continue` أو `/opsx:ff`.

هذا الأمر جزء من مجموعة سير العمل الموسع (غير مشمولة في ملف التعريف الافتراضي `core`).

**الصيغة:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**المعاملات:**
| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | اسم مجلد التغيير (يتم السؤال عنه إذا لم يتم توفيره) |
| `--schema` | لا | مخطط سير العمل المستخدم (الافتراضي: من الإعدادات أو `spec-driven`) |

**ما يفعله:**
- ينشئ دليل `openspec/changes/<change-name>/`
- ينشئ ملف البيانات الوصفية `.openspec.yaml` في مجلد التغيير
- يعرض قالب المخرج الأول الجاهز للإنشاء
- يطلب اسم التغيير والمخطط إذا لم يتم توفيرهما

**ما ينشئه:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # بيانات التغيير الوصفية (المخطط، تاريخ الإنشاء)
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
- تجنب الأسماء العامة مثل `update`، `changes`، `wip`
- يمكن تعيين المخطط أيضًا في إعدادات المشروع (`openspec/config.yaml`)

---

### `/opsx:continue`

إنشاء المخرج التالي في سلسلة التبعيات. ينشئ مخرجًا واحدًا في كل مرة للتقدم التدريجي.

**الصيغة:**
```
/opsx:continue [change-name]
```

**المعاملات:**
| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير يجب المتابعة (يتم استنتاجه من السياق إذا لم يتم توفيره) |

**ما يفعله:**
- يستعلم عن رسم بياني لتبعيات المخرجات
- يعرض المخرجات الجاهزة مقابل المحظورة
- ينشئ أول مخرج جاهز
- يقرأ ملفات التبعية للحصول على السياق
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
- استخدمه عندما تريد مراجعة كل مخرج قبل المتابعة
- جيد للتغييرات المعقدة حيث تريد التحكم
- قد تصبح مخرجات متعددة جاهزة في نفس الوقت
- يمكنك تعديل المخرجات المنشأة قبل المتابعة

---

### `/opsx:ff`

التقدم السريع عبر إنشاء المخرجات. ينشئ جميع مخرجات التخطيط دفعة واحدة.

**الصيغة:**
```
/opsx:ff [change-name]
```

**المعاملات:**
| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير يجب التقدم السريع به (يتم استنتاجه من السياق إذا لم يتم توفيره) |

**ما يفعله:**
- ينشئ جميع المخرجات وفقًا لترتيب التبعيات
- يتبع التقدم عبر قائمة المهام
- يتوقف عندما تكتمل جميع المخرجات المطلوبة للتطبيق
- يقرأ كل تبعية قبل إنشاء المخرج التالي

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
- استخدمه عندما لديك صورة واضحة لما تبنيه
- أسرع من `/opsx:continue` للتغييرات البسيطة
- لا يزال بإمكانك تعديل المخرجات لاحقًا
- جيد للميزات الصغيرة والمتوسطة

---

### `/opsx:apply`

تنفيذ المهام من التغيير. يعمل عبر قائمة المهام، ويكتب الكود ويحدد العناصر المكتملة.

**الصيغة:**
```
/opsx:apply [change-name]
```

**المعاملات:**
| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير يجب تنفيذه (يتم استنتاجه من السياق إذا لم يتم توفيره) |

**ما يفعله:**
- يقرأ `tasks.md` ويحدد المهام غير المكتملة
- يعمل عبر المهام واحدًا تلو الآخر
- يكتب الكود، وينشئ الملفات، ويشغل الاختبارات حسب الحاجة
- يحدد المهام المكتملة بخانات الاختيار `[x]`

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
- يمكنه الاستئناف من حيث توقفت إذا تم الإيقاف
- استخدمه للتغييرات المتوازية عن طريق تحديد اسم التغيير
- يتم تتبع حالة الاكتمال في خانات الاختيار في `tasks.md`

---

### `/opsx:verify`

التحقق من أن التنفيذ يتطابق مع مخرجات التغيير. يتحقق من الاكتمال والصواب والتماسك.

**الصيغة:**
```
/opsx:verify [change-name]
```

**المعاملات:**
| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير يجب التحقق منه (يتم استنتاجه من السياق إذا لم يتم توفيره) |

**ما يفعله:**
- يتحقق من ثلاثة أبعاد لجودة التنفيذ
- يبحث في قاعدة الكود عن أدلة التنفيذ
- يبلغ عن المشاكل المصنفة كحرجة أو تحذيرية أو اقتراحية
- لا يمنع الأرشفة، لكنه يظهر المشاكل

**أبعاد التحقق:**

| البعد | ما يتحقق منه |
|-----------|-------------------|
| **الاكتمال** | جميع المهام مكتملة، جميع المتطلبات منفذة، السيناريوهات مغطاة |
| **الصواب** | التنفيذ يتطابق مع نية المواصفات، الحالات الحدية معالجة |
| **التماسك** | قرارات التصميم منعكسة في الكود، الأنماط متسقة |

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
- شغله قبل الأرشفة للكشف عن عدم التطابق مبكرًا
- التحذيرات لا تمنع الأرشفة لكنها تشير إلى مشاكل محتملة
- جيد لعملية مراجعة عمل الذكاء الاصطناعي قبل الالتزام
- يمكنه الكشف عن الانحراف بين المخرجات والتنفيذ

---

### `/opsx:sync`

**أمر اختياري.** دمج مواصفات التغيير الدلتا في المواصفات الرئيسية. ستطلب الأرشفة المزامنة إذا لزم الأمر، لذلك عادة لا تحتاج إلى تشغيل هذا يدويًا.

**الصيغة:**
```
/opsx:sync [change-name]
```

**المعاملات:**
| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير يجب مزامنته (يتم استنتاجه من السياق إذا لم يتم توفيره) |

**ما يفعله:**
- يقرأ مواصفات التغيير الدلتا من مجلد التغيير
- يحلل أقسام ADDED/MODIFIED/REMOVED/RENAMED
- يدمج التغييرات في الدليل الرئيسي `openspec/specs/`
- يحتفظ بالمحتوى الحالي غير المذكور في الدلتا
- لا يؤرشف التغيير (يظل نشطًا)

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

| السيناريو | استخدام sync؟ |
|----------|-----------|
| تغيير طويل الأمد، تريد المواصفات الرئيسية قبل الأرشفة | نعم |
| تغييرات متوازية متعددة تحتاج إلى مواصفات أساسية محدثة | نعم |
| تريد معاينة/مراجعة الدمج بشكل منفصل | نعم |
| تغيير سريع، تذهب مباشرة إلى الأرشفة | لا (الأرشفة تتعامل معه) |

**نصائح:**
- المزامنة ذكية، ليست نسخًا ولصقًا
- يمكنه إضافة سيناريوهات إلى متطلبات موجودة دون تكرار
- يظل التغيير نشطًا بعد المزامنة (غير مؤرشف)
- معظم المستخدمين لن يحتاجوا إلى استدعاء هذا مباشرة—الأرشفة تطلب إذا لزم الأمر

---

### `/opsx:archive`

أرشفة تغيير مكتمل. ينهي التغيير وينقله إلى مجلد الأرشيف.

**الصيغة:**
```
/opsx:archive [change-name]
```

**المعاملات:**
| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-name` | لا | أي تغيير يجب أرشفته (يتم استنتاجه من السياق إذا لم يتم توفيره) |

**ما يفعله:**
- يتحقق من حالة اكتمال المخرجات
- يتحقق من اكتمال المهام (يحذر إذا كانت غير مكتملة)
- يعرض مزامنة مواصفات الدلتا إذا لم يتم مزامنتها بعد
- ينقل مجلد التغيير إلى `openspec/changes/archive/YYYY-MM-DD-<name>/`
- يحتفظ بجميع المخرجات لسجل التدقيق

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
- لن تمنع الأرشفة المهام غير المكتملة، لكنها ستحذر
- يمكن مزامنة مواصفات الدلتا أثناء الأرشفة أو قبلها
- التغييرات المؤرشفة محفوظة للتاريخ
- استخدم `/opsx:verify` أولاً للكشف عن المشاكل

---

### `/opsx:bulk-archive`

أرشفة تغييرات مكتملة متعددة دفعة واحدة. يتعامل مع تعارضات المواصفات بين التغييرات.

**الصيغة:**
```
/opsx:bulk-archive [change-names...]
```

**المعاملات:**
| المعامل | مطلوب | الوصف |
|----------|----------|-------------|
| `change-names` | لا | تغييرات محددة يجب أرشفتها (يتم السؤال عن الاختيار إذا لم يتم توفيرها) |

**ما يفعله:**
- يسرد جميع التغييرات المكتملة
- يتحقق من كل تغيير قبل الأرشفة
- يكتشف تعارضات المواصفات عبر التغييرات
- يحل التعارضات بالتحقق مما تم تنفيذه فعليًا
- يؤرشف وفقًا للترتيب الزمني

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
- جيد لتدفقات العمل المتوازية
- حل التعارضات يتم بشكل ذكي (يتحقق من قاعدة الكود)
- يتم أرشفة التغييرات وفقًا لترتيب الإنشاء
- يطلب قبل الكتابة فوق محتوى المواصفات

---

### `/opsx:onboard`

إرشاد التأهيل عبر سير عمل OpenSpec الكامل. درس تفاعلي يستخدم قاعدة الكود الحقيقية الخاصة بك.

**الصيغة:**
```
/opsx:onboard
```

**ما يفعله:**
- يمر بدورة سير عمل كاملة مع شرح
- يمسح قاعدة الكود للبحث عن فرص تحسين حقيقية
- ينشئ تغييرًا حقيقيًا بمخرجات حقيقية
- ينفذ عملًا حقيقيًا (تغييرات صغيرة وآمنة)
- يؤرشف التغيير المكتمل
- يشرح كل خطوة أثناء حدوثها

**المراحل:**
1. الترحيب وتحليل قاعدة الكود
2. إيجاد فرصة تحسين
3. إنشاء تغيير (`/opsx:new`)
4. كتابة الاقتراح
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
- الأفضل للمستخدمين الجدد لتعلم سير العمل
- يستخدم كودًا حقيقيًا، وليس أمثلة تجريبية
- ينشئ تغييرًا حقيقيًا يمكنك الاحتفاظ به أو التخلي عنه
- يستغرق 15-30 دقيقة لإكماله

---

## بناء الأوامر حسب أداة الذكاء الاصطناعي

تستخدم أدوات الذكاء الاصطناعي المختلفة بناء أوامر قليلاً مختلفاً. استخدم التنسيق الذي يتطابق مع أداتك:

| الأداة | مثال على الصيغة |
|--------|------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | استدعاءات قائمة على المهارات مثل `/openspec-propose`, `/openspec-apply-change` (لا توجد ملفات أوامر `opsx-*` مولّدة) |

النية متساوية عبر الأدوات، ولكن الطريقة التي تظهر بها الأوامر قد تختلف حسب التكامل.

> **ملاحظة:** أوامر GitHub Copilot (`.github/prompts/*.prompt.md`) متاحة فقط في إضافات IDE (VS Code, JetBrains, Visual Studio). لا يدعم GitHub Copilot CLI حالياً ملفات الإرشادات المخصصة — راجع [الأدوات المدعومة](supported-tools.md) للتفاصيل والحلول البديلة.

---

## الأوامر القديمة

تستخدم هذه الأوامر سير العمل القديم "الكل في مرة واحدة". لا تزال تعمل ولكن يُوصى بأوامر OPSX.

| الأمر | وظيفته |
|-------|--------|
| `/openspec:proposal` | إنشاء جميع الملفات الناتجة دفعة واحدة (اقتراح، مواصفات، تصميم، مهام) |
| `/openspec:apply` | تنفيذ التغيير |
| `/openspec:archive` | أرشفة التغيير |

**متى تستخدم الأوامر القديمة:**
- المشاريع القائمة التي تستخدم سير العمل القديم
- التغييرات البسيطة حيث لا تحتاج إلى إنشاء الملفات الناتجة بشكل تدريجي
- التفضيل لنهج "الكل أو لا شيء"

**الترحيل إلى OPSX:**
يمكن متابعة التغييرات القديمة بأوامر OPSX. بنية الملفات الناتجة متوافقة.

---

## استكشاف الأخطاء وإصلاحها

### "التغيير غير موجود"

لم يتمكن الأمر من تحديد التغيير الذي يجب العمل عليه.

**الحلول:**
- حدد اسم التغيير صراحةً: `/opsx:apply add-dark-mode`
- تحقق من وجود مجلد التغيير: `openspec list`
- تأكد من أنك في مجلد المشروع الصحيح

### "لا توجد ملفات ناتجة جاهزة"

جميع الملفات الناتجة إما مكتملة أو محجوبة بسبب تبعيات مفقودة.

**الحلول:**
- قم بتشغيل `openspec status --change <name>` لمعرفة ما يعيق الإكمال
- تحقق من وجود الملفات الناتجة المطلوبة
- أنشئ أولاً الملفات الناتجة للتبعيات المفقودة

### "المخطط غير موجود"

المخطط المحدد غير موجود.

**الحلول:**
- ا列出 المخططات المتاحة: `openspec schemas`
- تحقق من إملاء اسم المخطط
- أنشئ المخطط إذا كان مخصصاً: `openspec schema init <name>`

### الأوامر غير معترف بها

أداة الذكاء الاصطناعي لا تتعرف على أوامر OpenSpec.

**الحلول:**
- تأكد من تهيئة OpenSpec: `openspec init`
- أعد توليد المهارات: `openspec update`
- تحقق من وجود دليل `.claude/skills/` (لـ Claude Code)
- أعد تشغيل أداة الذكاء الاصطناعي لالتقاط المهارات الجديدة

### الملفات الناتجة لا يتم إنشاؤها بشكل صحيح

ينشئ الذكاء الاصطناعي ملفات ناتجة غير مكتملة أو غير صحيحة.

**الحلول:**
- أضف سياق المشروع في `openspec/config.yaml`
- أضف قواعد لكل ملف ناتج للإرشاد المحدد
- قدم تفاصيل أكثر في وصف التغيير الخاص بك
- استخدم `/opsx:continue` بدلاً من `/opsx:ff` للحصول على مزيد من التحكم

---

## الخطوات التالية

- [سير العمل](workflows.md) - الأنماط الشائعة ومتى تستخدم كل أمر
- [واجهة سطر الأوامر](cli.md) - أوامر الطرفية للإدارة والتحقق
- [التخصيص](customization.md) - إنشاء مخططات وسير عمل مخصص