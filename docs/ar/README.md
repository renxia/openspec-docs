# وثائق OpenSpec

مرحباً. هذه هي الصفحة الرئيسية لكل ما يتعلق بـ OpenSpec.

يساعدك OpenSpec أنت ومساعد البرمجة بالذكاء الاصطناعي الخاص بك على **الاتفاق على ما يجب بناؤه قبل كتابة أي كود**. أنت تصف التغيير، ويقوم الذكاء الاصطناعي بصياغة مواصفات موجزة وقائمة مهام؛ كلاكما ينظر إلى نفس الخطة، ومن ثم يتم العمل. وداعاً لاكتشاف أن الذكاء الاصطناعي قد بنى الشيء الخطأ في منتصف الطريق.

إذا قرأت شيئًا آخر، فاقرأ هاتين الصفحتين:

1. [Getting Started](getting-started.md): التثبيت والتهيئة وإطلاق أول تغيير لك.
2. [How Commands Work](how-commands-work.md): المكان الذي تكتب فيه فعلياً `/opsx:propose` (تلميح: في محادثة الذكاء الاصطناعي، وليس في الطرفية). هذا يربك الغالبية العظمى من المستخدمين في البداية.

الأمر الثاني أهم مما يبدو عليه. يحتوي OpenSpec على جانبين: أداة سطر أوامر تقوم بتشغيلها في الطرفية (terminal)، وأوامر شرطة مائلة (slash commands) تقدمها لمساعد الذكاء الاصطناعي الخاص بك. معرفة أيهما أي شيء يوفر عليك أكثر لحظات الارتباك شيوعًا.

> **أفضل عادة لبنائها أولاً: عندما لا تكون متأكدًا مما يجب بناؤه، ابدأ بـ `/opsx:explore`.** إنه شريك تفكير غير محفوف بالمخاطر يقرأ الكود الخاص بك، ويوازن الخيارات، ويحول فكرة غامضة إلى خطة ملموسة قبل وجود أي مُنتَج أو كود. دليل [Explore First](explore.md) يقدم الحجة لذلك.

## اختر مسارك

**أنا جديد تمامًا.** ابدأ بـ [Getting Started](getting-started.md)، ثم تصفح [Core Concepts at a Glance](overview.md). عندما تشعر بشيء غامض، فإن صفحة الأسئلة الشائعة (FAQ) و[Glossary] مفيدة لك.

**لدي مشكلة ولكن ليس لدي خطة.** هذه هي الحالة الشائعة، ولها إجابة مخصصة: [Explore First](explore.md). استخدم `/opsx:explore` للتفكير في الأمر مع الذكاء الاصطناعي قبل الالتزام بأي شيء.

**لدي قاعدة بيانات ضخمة موجودة بالفعل.** أنت لا توثق كل شيء. يُوضح [Using OpenSpec in an Existing Project](existing-projects.md) كيفية البدء بالعمل على كود حقيقي وموجود مسبقًا (brownfield code) دون محاولة حل المشكلة بأكملها دفعة واحدة.

**أريد فقط أن أجعله يعمل.** [Install](installation.md)، ثم قم بتشغيل `openspec init`، بعد ذلك اقرأ [How Commands Work](how-commands-work.md) حتى تصل أول أمر شرطة مائلة لك إلى المكان الصحيح.

**أنا أتعلم بالمثال.** صفحة [Examples & Recipes](examples.md) تستعرض التغييرات الحقيقية من البداية إلى النهاية: ميزة صغيرة، إصلاح خطأ (bug fix)، إعادة هيكلة (refactor)، أو استكشاف للمشكلة.

**أنا قادم من سير العمل القديم.** يوضح [Migration Guide](migration-guide.md) ما الذي تغير ولماذا، ويعد بأن عملك الحالي آمن.

**أريد تكييفه ليناسب عملية فريقي.** تغطي [Customization](customization.md) إعدادات المشروع والمخططات المخصصة والسياق المشترك.

**شيء ما معطّل.** [Troubleshooting](troubleshooting.md) يجمع الأعطال التي يصادفها الناس بالفعل، مع الحلول.

## الخريطة الكاملة

### ابدأ هنا

| الوثيقة | ما تقدمه لك |
|-----|-------------------|
| [Getting Started](getting-started.md) | التثبيت والتهيئة وتشغيل أول تغيير لديك من البداية إلى النهاية |
| [Explore First](explore.md) | استخدم `/opsx:explore` للتفكير في فكرة ما قبل الالتزام بها |
| [How Commands Work](how-commands-work.md) | أين تعمل الأوامر الشرطية، وماذا يعني "الوضع التفاعلي"، والفرق بين الطرفية والمحادثة |
| [Core Concepts at a Glance](overview.md) | النموذج الذهني الكامل في صفحة واحدة: المواصفات، والتغييرات، والفروقات (deltas)، والأرشيف |
| [Installation](installation.md) | npm و pnpm و yarn و bun و Nix وكيفية التحقق من نجاح التثبيت |

### استخدمه يوميًا

| الوثيقة | ما تقدمه لك |
|-----|-------------------|
| [Workflows](workflows.md) | الأنماط الشائعة ومتى يجب اللجوء إلى كل أمر |
| [Examples & Recipes](examples.md) | استعراضات كاملة للتغييرات الحقيقية، قابلة للنسخ واللصق |
| [Using OpenSpec in an Existing Project](existing-projects.md) | تبني OpenSpec في قاعدة بيانات ضخمة موجودة مسبقًا (brownfield codebase) |
| [Editing & Iterating on a Change](editing-changes.md) | تحديث المُنتَجات، والعودة إلى الوراء، ومصالحة التعديلات اليدوية |
| [Commands](commands.md) | مرجع لكل أمر شرطة مائلة `/opsx:*` |
| [CLI](cli.md) | مرجع لكل أمر طرفية `openspec` |

### افهمها بعمق

| الوثيقة | ما تقدمه لك |
|-----|-------------------|
| [Concepts](concepts.md) | الشرح المفصل للمواصفات والتغييرات والمُنتَجات والمخططات والأرشيف |
| [OPSX Workflow](opsx.md) | لماذا سير العمل مرن بدلاً من أن يكون مقيدًا بمراحل، بالإضافة إلى تعميق معماري |
| [Glossary](glossary.md) | تعريف كل مصطلح في مكان واحد |

### اجعله خاصاً بك

| الوثيقة | ما تقدمه لك |
|-----|-------------------|
| [Customization](customization.md) | إعدادات المشروع والمخططات المخصصة والسياق المشترك |
| [Multi-Language](multi-language.md) | إنشاء مُنتَجات بلغات غير الإنجليزية |
| [Supported Tools](supported-tools.md) | أكثر من 25 أداة ذكاء اصطناعي تتكامل معها OpenSpec، وأين تذهب الملفات |

### عندما تحتاج إلى مساعدة

| الوثيقة | ما تقدمه لك |
|-----|-------------------|
| [FAQ](faq.md) | إجابات سريعة على الأسئلة الأكثر شيوعًا |
| [Troubleshooting](troubleshooting.md) | حلول ملموسة للأعطال المحددة |
| [Migration Guide](migration-guide.md) | الانتقال من سير العمل القديم إلى OPSX |

### التنسيق عبر المستودعات (beta)

| الوثيقة | ما تقدمه لك |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | التخطيط في مستودع خاص بك عندما يمتد عملك عبر مستودعات أو فرق مختلفة |
| [Agent Contract](agent-contract.md) | الواجهات التي يديرها الوكيل (agents) والتي يمكن قراءتها بواسطة الآلة |

## النسخة الثلاثينية (Thirty-second version)

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← optional, but a great habit
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

تحدث الخطوتان 1 و 2 في الطرفية (terminal). أما البقية فتتم في محادثة مساعد الذكاء الاصطناعي الخاص بك. هذا الانقسام هو الشيء الوحيد الذي يستحق الحفظ، ويشرح [How Commands Work](how-commands-work.md) السبب بالتحديد. الخطوة 3 اختيارية، لكن البدء بـ `/opsx:explore` عندما تكون غير متأكد هو العادة الأكثر قيمة لتكوينها.

## أين يمكن الحصول على مساعدة أخرى؟

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) للأسئلة والأفكار والمساعدة.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) للأخطاء وطلبات الميزات.
- **`openspec feedback "your message"`** يرسل التعليقات مباشرة من الطرفية الخاصة بك (يفتح تذكرة في GitHub).

هل وجدت شيئًا خاطئًا أو قديمًا أو محيرًا في هذه الوثائق؟ فهذا خطأ برمجي (bug). افتح قضية (issue) أو طلب سحب (PR). تحسينات التوثيق هي بعض القيمة الأكبر التي يمكنك تقديمها.