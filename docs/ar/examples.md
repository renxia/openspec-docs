# الأمثلة ووصفات العمل

تغييرات حقيقية، من البداية إلى النهاية. يعرض كل وصفة الأوامر التي ستقوم بكتابتها وما ستراه في المقابل، حتى تتمكن من مطابقة وضعك مع نمط معين ونسخه. تستخدم هذه الوصفات الأوامر الأساسية الافتراضية (`propose`، `explore`، `apply`، `sync`، `archive`)؛ وفي الحالات التي يكون فيها المجموعة الموسعة مفيدة، يتم التنويه بذلك.

تذكير قبل البدء: أوامر الشرطة المائلة مثل `/opsx:propose` تُوضع في **دردشة مساعد الذكاء الاصطناعي**، وأوامر `openspec` تُوضع في **الطرفية (terminal)**. إذا كان هذا جديدًا بالنسبة لك، فاقرأ [كيف تعمل الأوامر](how-commands-work.md) أولاً. في النصوص أدناه، يمثل `You:` و `AI:` الدردشة، والأسطر التي تبدأ بـ `$` هي الطرفية.

> **هل لست متأكدًا مما تقوم ببنائه بعد؟** تكون معظم هذه الوصفات أكثر دقة إذا بدأت باستخدام `/opsx:explore` للتفكير في الأمر أولاً. يُظهر [الوصفة 3](#recipe-3-exploring-before-you-commit) ذلك عمليًا، ويوفر دليل [التنقيب أولاً](explore.md) الحجة الكاملة.

## الوصفة 1: ميزة صغيرة، المسار السريع

**متى تستخدمها:** أنت تعرف ما تريده، وهي قطعة عمل محددة النطاق. هذه هي الوصفة الأكثر شيوعًا.

العملية بأكملها تتكون من ثلاثة أوامر. اقتراح (Propose)، بناء (Build)، وأرشفة (Archive).

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — لماذا وماذا
     ✓ specs/      — المتطلبات الجديدة وسيناريوهاتها
     ✓ design.md   — النهج التقني
     ✓ tasks.md    — قائمة مراجعة التنفيذ
     Ready for implementation. Run /opsx:apply.
```

الآن اقرأ الخطة. افتح الاقتراح و مواصفات التغيير (delta spec). هذه هي اللحظة التي صُمم من أجلها OpenSpec: اكتشاف افتراض خاطئ بينما لا يزال الأمر فقرة واحدة، وليس 400 سطر من التعليمات البرمجية. قم بتحرير أي مُصنَّف (artifact) مباشرة إذا كان هناك شيء غير صحيح، ثم استمر.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

هذا كل شيء. أصبح سلوك تسجيل الخروج جزءًا من مواصفاتك، وتم حفظ التغيير مع سياقه الكامل.

## الوصفة 2: إصلاح خطأ (Bug fix)

**متى تستخدمها:** هناك شيء مكسور وتريد تسجيل الإصلاح كتغيير متعمد في السلوك، وليس كالتزام غامض.

تعمل إصلاحات الأخطاء تمامًا مثل الميزات. الفرق يكمن في كيفية تأطير الاقتراح: صف السلوك *الصحيح*، وليس مجرد "إصلاح الخطأ".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

نظرًا لأن الإصلاح يصل كمتطلب `MODIFIED` مع سيناريو جديد، فإن الشخص التالي (أو جلسة الذكاء الاصطناعي التالية) لا يرى فقط أنك أصلحته، بل ما الذي يعنيه "الصحيح". ثم `/opsx:apply` و `/opsx:archive` كالمعتاد.

نصيحة: بالنسبة للإصلاح، السيناريو الجيد هو اختبار الانحدار (regression test) في شكل نصي. "بافتراض مستخدم غير مسجل الدخول، وعندما يقوم بإرسال بيانات اعتماد صالحة، فإنه يصل إلى لوحة التحكم ولا يتم إعادة توجيهه مرة أخرى." اكتب ذلك، ويكون لدى التنفيذ هدف واضح.

## الوصفة 3: الاستكشاف قبل الالتزام

**متى تستخدمها:** لديك مشكلة ولكن ليس لديك خطة بعد. لست متأكدًا مما يجب بناؤه، أو أي نهج هو الصحيح.

ابدأ باستخدام `/opsx:explore`. إنه شريك تفكير بدون هيكل وبدون إنشاء مُصنَّفات (artifacts). يقرأ قاعدة الكود الخاصة بك ويساعدك على اتخاذ القرار.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

يؤدي الاستكشاف إلى توضيح تفكيرك *قبل* أن تنفق تغييرًا عليه. عندما تتضح الرؤية، قم بتقديم الاقتراح، ويحمل الذكاء الاصطناعي السياق قدمًا.

## الوصفة 4: إدارة تغييرين في آن واحد

**متى تستخدمها:** أنت في منتصف ميزة ما و إصلاح عاجل يقفز إلى الطابور.

التغييرات هي مجلدات مستقلة، لذا فإن العمل المتوازي لا يتعارض. ابدأ الإصلاح، وأطلقه (ship it)، ثم عد إلى الميزة حيث توقفت بالضبط.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

إن تسمية التغيير في `/opsx:apply add-dark-mode` هي الطريقة التي توجه بها الذكاء الاصطناعي إلى تغيير معين عندما يكون أكثر من واحد نشطًا. نظرًا لأن المهام تتتبع الاكتمال في `tasks.md`، يعرف الذكاء الاصطناعي بالضبط أين توقفت.

عند الانتهاء من عدة تغييرات دفعة واحدة، تقوم ملفات `/opsx:bulk-archive` الموسعة بأرشفتها معًا وتحل تعارضات المواصفات عن طريق التحقق مما هو مطبق بالفعل. انظر [سير العمل](workflows.md#parallel-changes).

## الوصفة 5: إعادة هيكلة (Refactor) دون تغيير السلوك

**متى تستخدمها:** أنت تعيد هيكلة الكود، ويجب أن يظل السلوك المرئي خارجيًا متطابقًا.

هذه هي الحالة المثيرة للاهتمام، لأن إعادة الهيكلة البحتة ليس لديها *شيء لإضافته إلى مواصفاتك*. عقد السلوك لا يتغير؛ التنفيذ فقط هو الذي يتغير. لذا فإن العمل يكمن في التصميم والمهام، ويكون دلتا المواصفات فارغًا أو غائبًا.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

عندما تقوم بأرشفة تغيير لا يمس المواصفات، يمكنك إخبار الأمر الطرفي أن يتخطى خطوة المواصفات:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

هذه العلامة مفيدة أيضًا للأدوات و CI والتغييرات الخاصة بالتوثيق فقط. المبدأ هو: المواصفات تصف السلوك، لذا إذا لم يتغير السلوك، فلا ينبغي أن تتغير المواصفات أيضًا. انظر [المفاهيم](concepts.md#what-a-spec-is-and-is-not).

## الوصفة 6: التحكم خطوة بخطوة (الأوامر الموسعة)

**متى تستخدمها:** تغيير معقد أو محفوف بالمخاطر حيث تريد مراجعة كل مُصنَّف قبل الانتقال إلى التالي.

يقوم `/opsx:propose` الأساسي بصياغة كل شيء دفعة واحدة. عندما تفضل المضي قدمًا خطوة بخطوة، قم بتشغيل الأوامر الموسعة:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

الآن يمكنك بناء الهيكل والتنفيذ بشكل تدريجي:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

راجع كل مُصنَّف بمجرد وصوله، وقم بالتحرير بحرية، واستمر عندما تكون راضيًا. عندما تريد أن يقوم الباقي بصياغته دفعة واحدة، فإن `/opsx:ff` يتقدم بسرعة عبر مُصنَّفات التخطيط المتبقية. قبل الأرشفة، يتحقق `/opsx:verify` من أن التنفيذ يتطابق بالفعل مع المواصفات. انظر [سير العمل](workflows.md#opsxff-vs-opsxcontinue).

## الوصفة 7: تعلم الدورة باليدين

**متى تستخدمها:** لقد قمت بتثبيت OpenSpec وتريد *الشعور* بسير العمل على الكود الخاص بك، وليس مثالاً لعبة.

قم بتشغيل الأوامر الموسعة (انظر الوصفة 6)، ثم:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

يجد `/opsx:onboard` تحسينًا حقيقيًا (صغيرًا)، ويقوم بإنشاء تغيير له، وينفذه، ويؤرشفه، ويسرد كل خطوة. يستغرق الأمر من 15 إلى 30 دقيقة ويترك لك تغييرًا حقيقيًا يمكنك الاحتفاظ به أو التخلص منه. إنها الطريقة الأكثر لطفًا للتعلم. انظر [الأوامر](commands.md#opsxonboard).

## التحقق من عملك باستخدام الطرفية (Terminal)

في أي وقت، يمكنك فحص حالة الأمور من الطرفية:

```bash
$ openspec list                      # التغييرات النشطة
$ openspec show add-dark-mode        # تغيير واحد بالتفصيل
$ openspec validate add-dark-mode    # التحقق من الهيكل
$ openspec view                      # لوحة تحكم تفاعلية
```

هذه أدوات للقراءة والفحص. لا يزال الاقتراح والبناء يحدثان عبر أوامر الشرطة المائلة في الدردشة. التفاصيل الكاملة موجودة في [مرجع CLI](cli.md).

## إلى أين تذهب بعد ذلك

- [التنقيب أولاً](explore.md): الطريقة الموصى بها للبدء عندما تكون غير متأكد
- [سير العمل](workflows.md): الأنماط المذكورة أعلاه، مع إرشادات اتخاذ القرار حول متى استخدام كل منها
- [الأوامر](commands.md): كل أمر من أوامر الشرطة المائلة بالتفصيل
- [البدء](getting-started.md): دليل التغيير الأول الكنسي (canonical)
- [المفاهيم](concepts.md): لماذا تتناسب القطع معًا بالطريقة التي هي عليها