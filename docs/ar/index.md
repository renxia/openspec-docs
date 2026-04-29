---
layout: home

hero:
  name: "OpenSpec"
  text: "التطوير المبني على المواصفات لمساعدي الذكاء الاصطناعي"
  tagline: مواصفة خفيفة الوزن لإنشاء وإدارة مشاريع مساعدي الذكاء الاصطناعي.
  actions:
    - theme: brand
      text: ابدأ الآن
      link: ./getting-started
    - theme: alt
      text: الرئيسية
      link: /

features:
  - title: سير عمل يعتمد على المواصفات أولاً
    details: حدد المتطلبات قبل كتابة الكود.
  - title: تصميم أصيل للذكاء الاصطناعي
    details: مبني للعمل مع Claude Code، Cursor، Windsurf والمزيد.
  - title: متعدد اللغات
    details: التوثيق متاح بلغات متعددة.
---


فلسفتنا:

```text
→ مرن وليس جامد
→ تكراري وليس شلالي
→ سهل وليس معقد
→ مبني للمشاريع القائمة وليس فقط للمشاريع الجديدة
→ قابل للتوسع من المشاريع الشخصية إلى المؤسسات
```

> [!TIP]
> **سير عمل جديد متاح الآن!** أعدنا بناء OpenSpec بسير عمل جديد يوجّهه المخرجات.
>
> قم بتشغيل `/opsx:propose "فكرتك"` للبدء. → [اعرف المزيد هنا](opsx.md)

<p align="center">
  تابع <a href="https://x.com/0xTab">@0xTab على X</a> للتحديثات · انضم إلى <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> للحصول على المساعدة والأسئلة.
</p>

## شاهده في العمل

```text
You: /opsx:propose add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /opsx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /opsx:archive
AI:  Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>لوحة تحكم OpenSpec</strong></summary>
</details>

## البدء السريع

**يتطلب Node.js الإصدار 20.19.0 أو أعلى.**

قم بتثبيت OpenSpec عالمياً:

```bash
npm install -g @fission-ai/openspec@latest
```

ثم انتقل إلى دليل مشروعك وقم بالتهيئة:

```bash
cd your-project
openspec init
```

الآن أخبر الذكاء الاصطناعي الخاص بك: `/opsx:propose <ما تريد بناءه>`

إذا كنت ترغب في سير العمل الموسّع (`/opsx:new`، `/opsx:continue`، `/opsx:ff`، `/opsx:verify`، `/opsx:sync`، `/opsx:bulk-archive`، `/opsx:onboard`)، حدد باستخدام `openspec config profile` وطبّق باستخدام `openspec update`.

> [!NOTE]
> لست متأكداً مما إذا كان أداتك مدعومة؟ [عرض القائمة الكاملة](supported-tools.md) – ندعم أكثر من 25 أداة ونواصل النمو.
>
> يعمل أيضاً مع pnpm، yarn، bun، و nix. [ראה خيارات التثبيت](installation.md).

## التوثيق

→ **[البدء](getting-started.md)**: الخطوات الأولى<br>
→ **[سير العمل](workflows.md)**: التجميعات والأنماط<br>
→ **[الأوامر](commands.md)**: أوامر الشرطة المائلة والمهارات<br>
→ **[واجهة سطر الأوامر](cli.md)**: مرجع الطرفية<br>
→ **[الأدوات المدعومة](supported-tools.md)**: تكاملات الأدوات ومسارات التثبيت<br>
→ **[المفاهيم](concepts.md)**: كيف تتصل كل الأجزاء<br>
→ **[متعدد اللغات](multi-language.md)**: الدعم متعدد اللغات<br>
→ **[التخصيص](customization.md)**: اجعله خاصاً بك


## لماذا OpenSpec؟

مساعدو البرمجة بالذكاء الاصطناعي قويون لكنهم غير متوقعين عندما تكون المتطلبات موجودة فقط في سجل المحادثات. يضيف OpenSpec طبقة مواصفات خفيفة حتى تتفق على ما يجب بناؤه قبل كتابة أي كود.

- **اتفق قبل البناء** — يتوافق البشر والذكاء الاصطناعي على المواصفات قبل كتابة الكود
- **ابق منظماً** — كل تغيير يحصل على مجلده الخاص مع العرض والمواصفات والتصميم والمهام
- **اعمل بمرونة** — حدّث أي مخرج في أي وقت، لا توجد مراحل تقييدية صارمة
- **استخدم أدواتك** — يعمل مع أكثر من 20 مساعد ذكاء اصطناعي عبر أوامر الشرطة المائلة

### كيف نقارن

**مقارنة بـ [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — شامل لكنه ثقيل. مراحل تقييدية صارمة، الكثير من Markdown، إعداد Python. OpenSpec أخف وزناً ويتيح لك التكرار بحرية.

**مقارنة بـ [Kiro](https://kiro.dev)** (AWS) — قوي لكنك مقيد ببيئتهم التطويرية ومحصور في نماذج Claude فقط. OpenSpec يعمل مع الأدوات التي تستخدمها بالفعل.

**مقارنة بالعدم** — البرمجة بالذكاء الاصطناعي بدون مواصفات تعني مطالبات غامضة ونتائج غير متوقعة. يجلب OpenSpec التنبؤ دون الطقوس المعقدة.

## تحديث OpenSpec

**ترقية الحزمة**

```bash
npm install -g @fission-ai/openspec@latest
```

**تحديث تعليمات الوكيل**

قم بتشغيل هذا داخل كل مشروع لإعادة إنشاء إرشادات الذكاء الاصطناعي والتأكد من تفعيل أحدث أوامر الشرطة المائلة:

```bash
openspec update
```

## ملاحظات الاستخدام

**اختيار النموذج**: يعمل OpenSpec بشكل أفضل مع النماذج عالية الاستدلال. نوصي بـ Opus 4.5 و GPT 5.2 لكل من التخطيط والتنفيذ.

**نظافة السياق**: يستفيد OpenSpec من نافذة سياق نظيفة. امسح سياقك قبل البدء في التنفيذ وحافظ على نظافة السياق طوال جلستك.

## المساهمة

**إصلاحات صغيرة** — يمكن تقديم إصلاحات الأخطاء، وتصحيح الأخطاء الإملائية، والتحسينات الطفيفة مباشرة كطلبات سحب.

**تغييرات أكبر** — للميزات الجديدة، أو إعادة الهيكلة الكبيرة، أو التغييرات المعمارية، يرجى تقديم عرض تغيير OpenSpec أولاً حتى نتمكن من التوافق على النية والأهداف قبل البدء في التنفيذ.

عند كتابة العروض، ضع فلسفة OpenSpec في الاعتبار: نخدم مجموعة واسعة من المستخدمين عبر وكلاء برمجة مختلفة، ونماذج، وحالات استخدام. يجب أن تعمل التغييرات بشكل جيد للجميع.

**الكود المولّد بالذكاء الاصطناعي مرحب به** — طالما أنه تم اختباره والتحقق منه. يجب أن تذكر طلبات السحب التي تحتوي على كود مولّد بالذكاء الاصطناعي وكيل البرمجة والنموذج المستخدم (على سبيل المثال، "تم التوليد باستخدام Claude Code باستخدام claude-opus-4-5-20251101").

### التطوير

- تثبيت التبعيات: `pnpm install`
- البناء: `pnpm run build`
- الاختبار: `pnpm test`
- تطوير واجهة سطر الأوامر محلياً: `pnpm run dev` أو `pnpm run dev:cli`
- الالتزامات التقليدية (سطر واحد): `type(scope): subject`

## أخرى

<details>
<summary><strong>القياس عن بعد</strong></summary>

يجمع OpenSpec إحصائيات استخدام مجهولة الهوية.

نجمع فقط أسماء الأوامر والإصدار لفهم أنماط الاستخدام. لا نجمع أي وسائط، أو مسارات، أو محتوى، أو معلومات تعريف شخصية. يتم تعطيله تلقائياً في بيئة التكامل المستمر.

**إلغاء الاشتراك:** `export OPENSPEC_TELEMETRY=0` أو `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>المشرفون والاستشاريون</strong></summary>

انظر [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) لقائمة المشرفين الأساسيين والاستشاريين الذين يساعدون في توجيه المشروع.

</details>



## الترخيص

MIT