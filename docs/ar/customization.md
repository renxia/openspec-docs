# التخصيص

يوفر OpenSpec ثلاثة مستويات للتخصيص:

| المستوى | ماذا يفعل | الأفضل لـ |
|---------|----------|-----------|
| **تهيئة المشروع** | تعيين الافتراضات، حقن السياق/القواعد | معظم الفرق |
| **المخططات المخصصة** | تحديد عناصر سير العمل الخاصة بك | الفرق ذات العمليات الفريدة |
| **التجاوزات العامة** | مشاركة المخططات عبر جميع المشاريع | المستخدمون المتقدمون |

---

## تهيئة المشروع

ملف `openspec/config.yaml` هو أسهل طريقة لتخصيص OpenSpec لفريقك. يتيح لك:

- **تعيين مخطط افتراضي** - تخطي `--schema` في كل أمر
- **حقن سياق المشروع** - يرى الذكاء الاصطناعي حزمة التقنيات الخاصة بك، الاتفاقيات، إلخ.
- **إضافة قواعد لكل عنصر** - قواعد مخصصة لعناصر محددة

### الإعداد السريع

```bash
openspec init
```

سي带你 خلال إنشاء تهيئة تفاعلية. أو أنشئ واحدة يدويًا:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### كيف يعمل

**المخطط الافتراضي:**

```bash
# بدون تهيئة
openspec new change my-feature --schema spec-driven

# مع التهيئة - المخطط تلقائي
openspec new change my-feature
```

**حقن السياق والقواعد:**

عند إنشاء أي عنصر، يتم حقن سياقك وقواعدك في موجه الذكاء الاصطناعي:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- يظهر **السياق** في جميع العناصر
- تظهر **القواعد** فقط للعنصر المطابق

### ترتيب حل المخطط

عندما يحتاج OpenSpec إلى مخطط، يتحقق بالترتيب التالي:

1. علامة CLI: `--schema <name>`
2. بيانات التعريف الخاصة بالتغيير (`.openspec.yaml` في مجلد التغيير)
3. تهيئة المشروع (`openspec/config.yaml`)
4. الافتراضي (`spec-driven`)

---

## المخططات المخصصة

عندما لا تكون تهيئة المشروع كافية، قم بإنشاء مخططك الخاص بسير عمل مخصص تمامًا. تعيش المخططات المخصصة في دليل `openspec/schemas/` الخاص بمشروعك ويتم التحكم في إصدارها مع الكود الخاص بك.

```text
your-project/
├── openspec/
│   ├── config.yaml        # تهيئة المشروع
│   ├── schemas/           # تعيش المخططات المخصصة هنا
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # تغييراتك
└── src/
```

### تفرع مخطط موجود

أسرع طريقة للتخصيص هي تفرع مخطط مدمج:

```bash
openspec schema fork spec-driven my-workflow
```

ينسخ هذا المخطط `spec-driven` بالكامل إلى `openspec/schemas/my-workflow/` حيث يمكنك تعديله بحرية.

**ما تحصل عليه:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # تعريف سير العمل
└── templates/
    ├── proposal.md       # قالب عنصر الاقتراح
    ├── spec.md           # قالب للمواصفات
    ├── design.md         # قالب للتصميم
    └── tasks.md          # قالب للمهام
```

الآن قم بتعديل `schema.yaml` لتغيير سير العمل، أو قم بتعديل القوالب لتغيير ما ينشئه الذكاء الاصطناعي.

### إنشاء مخطط من الصفر

لسير عمل جديد تمامًا:

```bash
# تفاعلي
openspec schema init research-first

# غير تفاعلي
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### هيكل المخطط

يحدد المخطط العناصر في سير عملك وكيف تعتمد على بعضها البعض:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # لا يمكن إنشاء التصميم حتى يوجد الاقتراح

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**الحقول الرئيسية:**

| الحقل | الغرض |
|-------|-------|
| `id` | معرّف فريد، يُستخدم في الأوامر والقواعد |
| `generates` | اسم ملف الإخراج (يدعم globs مثل `specs/**/*.md`) |
| `template` | ملف القالب في دليل `templates/` |
| `instruction` | تعليمات الذكاء الاصطناعي لإنشاء هذا العنصر |
| `requires` | الاعتماديات - أي عناصر يجب أن تكون موجودة أولاً |

### القوالب

القوالب هي ملفات markdown توجه الذكاء الاصطناعي. يتم حقنها في الموجه عند إنشاء ذلك العنصر.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

يمكن أن تتضمن القوالب:
- عناوين الأقسام التي يجب أن يملأها الذكاء الاصطناعي
- تعليقات HTML مع إرشادات للذكاء الاصطناعي
- أمثلة للتنسيقات تُظهر الهيكل المتوقع

### التحقق من صحة مخططك

قبل استخدام مخطط مخصص، قم بالتحقق من صحته:

```bash
openspec schema validate my-workflow
```

يتحقق هذا من:
- صحة بنية `schema.yaml`
- وجود جميع القوالب المشار إليها
- عدم وجود اعتمادية دائرية
- صحة معرّفات العناصر

### استخدام مخططك المخصص

بمجرد إنشائه، استخدم مخططك مع:

```bash
# تحديد في الأمر
openspec new change feature --schema my-workflow

# أوتعيين كافتراضي في config.yaml
schema: my-workflow
```

### تصحيح أخطاء حل المخطط

لست متأكدًا أي مخطط يُستخدم؟ تحقق مع:

```bash
# رؤية من أين يتم حل مخطط محدد
openspec schema which my-workflow

# سرد جميع المخططات المتاحة
openspec schema which --all
```

يُظهر الإخراج ما إذا كان من مشروعك، أو دليل المستخدم، أو الحزمة:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **ملاحظة:** يدعم OpenSpec أيضًا المخططات على مستوى المستخدم في `~/.local/share/openspec/schemas/` للمشاركة عبر المشاريع، لكن المخططات على مستوى المشروع في `openspec/schemas/` موصى بها لأنها تخضع للتحكم في الإصدار مع الكود الخاص بك.

---

## أمثلة

### سير عمل التكرار السريع

سير عمل بسيط للتكرارات السريعة:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### إضافة عنصر مراجعة

قم بتفرع الافتراضي وأضف خطوة مراجعة:

```bash
openspec schema fork spec-driven with-review
```

ثم قم بتعديل `schema.yaml` لإضافة:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # الآن تتطلب المهام المراجعة أيضًا
```

---

## مخططات المجتمع

يدعم OpenSpec أيضًا المخططات التي يرعاها المجتمع وتُوزع عبر مستودعات مستقلة. توفر هذه سير عمل محددة تدمج OpenSpec مع أدوات أو أنظمة أخرى، على غرار كيفية عمل [كتالوج إضافات مجتمع github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) لـ spec-kit.

لا يتم تضمين مخططات المجتمع في نواة OpenSpec — تعيش في مستودعاتها الخاصة بإيقاع إصدارها الخاص. لاستخدام واحد، قم بنسخ حزمة المخطط إلى دليل `openspec/schemas/<schema-name>/` الخاص بمشروعك (يحتوي README لكل مستودع على تعليمات التثبيت).

| المخطط | المشرف | المستودع | الوصف |
|--------|--------|---------|-------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | يدمج حوكمة عناصر OpenSpec مع مهارات تنفيذ [obra/superpowers](https://github.com/obra/superpowers) (العصف الذهني، كتابة الخطط، TDD عبر الوكيل الفرعي، مراجعة الكود، الإنهاء). يضيف عنصر `retrospective` يركز على الأدلة لسد فجوة لا يغطيها Superpowers بشكل أصلي. |

> هل تريد المساهمة في مخطط مجتمع؟ افتح مشكلة مع رابط إلى مستودعك، أو أرسل طلب سحب لإضافة صف إلى هذا الجدول.

---

## انظر أيضًا

- [مرجع CLI: أوامر المخططات](cli.md#schema-commands) - وثائق الأوامر الكاملة