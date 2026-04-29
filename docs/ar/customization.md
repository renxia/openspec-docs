# التخصيص

يوفر OpenSpec ثلاثة مستويات من التخصيص:

| المستوى | ماذا يفعل | الأفضل لـ |
|-------|--------------|----------|
| **إعدادات المشروع** | تعيين الافتراضيات، حقن السياق/القواعد | معظم الفرق |
| **مخططات مخصصة** | تعريف مُخرجات سير عملك الخاصة | الفرق ذات العمليات الفريدة |
| **التجاوزات العامة** | مشاركة المخططات عبر جميع المشاريع | المستخدمون المتقدمون |

---

## إعدادات المشروع

يُعد ملف `openspec/config.yaml` أسهل طريقة لتخصيص OpenSpec لفريقك. يتيح لك:

- **تعيين مخطط افتراضي** - تخطي `--schema` في كل أمر
- **حقن سياق المشروع** - يرى الذكاء الاصطناعي حزمة التقنيات الخاصة بك، والاتفاقيات، إلخ.
- **إضافة قواعد لكل مُخرج** - قواعد مخصصة لمُخرجات محددة

### الإعداد السريع

```bash
openspec init
```

يُرشدك هذا الأمر لإنشاء ملف إعداد بشكل تفاعلي. أو قم بإنشائه يدويًا:

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
# بدون إعدادات
openspec new change my-feature --schema spec-driven

# مع الإعدادات - المخطط تلقائي
openspec new change my-feature
```

**حقن السياق والقواعد:**

عند إنشاء أي مُخرج، يتم حقن سياقك وقواعدهك في استعلام الذكاء الاصطناعي:

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

- **السياق** يظهر في جميع المُخرجات
- **القواعد** تظهر فقط للمخرج المطابق

### ترتيب حل المخطط

عندما يحتاج OpenSpec إلى مخطط، يتحقق بالترتيب التالي:

1. علامة سطر الأوامر: `--schema <name>`
2. بيانات التغيير الوصفية (`.openspec.yaml` في مجلد التغيير)
3. إعدادات المشروع (`openspec/config.yaml`)
4. الافتراضي (`spec-driven`)

---

## مخططات مخصصة

عندما لا تكفي إعدادات المشروع، قم بإنشاء مخططك الخاص بسير عمل مخصص تمامًا. تعيش المخططات المخصصة في مجلد `openspec/schemas/` في مشروعك وتُتحكم بإصداراتها مع الكود الخاص بك.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### نسخ مخطط موجود

أسرع طريقة للتخصيص هي نسخ مخطط مدمج:

```bash
openspec schema fork spec-driven my-workflow
```

يقوم هذا الأمر بنسخ مخطط `spec-driven` بالكامل إلى `openspec/schemas/my-workflow/` حيث يمكنك تعديله بحرية.

**ما تحصل عليه:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

الآن قم بتعديل `schema.yaml` لتغيير سير العمل، أو عدّل القوالب لتغيير ما يُنشئه الذكاء الاصطناعي.

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

يُعرّف المخطط المُخرجات في سير عملك وكيفية تبعيتها لبعضها البعض:

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
      - proposal    # Can't create design until proposal exists

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
|-------|---------|
| `id` | مُعرّف فريد، يُستخدم في الأوامر والقواعد |
| `generates` | اسم ملف الإخراج (يدعم التوسيعات مثل `specs/**/*.md`) |
| `template` | ملف القالب في مجلد `templates/` |
| `instruction` | تعليمات الذكاء الاصطناعي لإنشاء هذا المُخرج |
| `requires` | التبعيات - أي المُخرجات يجب أن توجد أولاً |

### القوالب

القوالب هي ملفات markdown توجّه الذكاء الاصطناعي. يتم حقنها في الاستعلام عند إنشاء ذلك المُخرج.

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
- أقسام رئيسية يجب على الذكاء الاصطناعي ملؤها
- تعليقات HTML بإرشادات للذكاء الاصطناعي
- تنسيقات نموذجية تُظهر الهيكل المتوقع

### التحقق من مخططك

قبل استخدام مخطط مخصص، تحقق منه:

```bash
openspec schema validate my-workflow
```

يتحقق هذا الأمر من:
- صحة بنية `schema.yaml`
- وجود جميع القوالب المرجعة
- عدم وجود تبعيات دائرية
- صلاحية مُعرّفات المُخرجات

### استخدام مخططك المخصص

بمجرد الإنشاء، استخدم مخططك باستخدام:

```bash
# حدد في الأمر
openspec new change feature --schema my-workflow

# أو اجعله افتراضيًا في config.yaml
schema: my-workflow
```

### تصحيح حل المخطط

لست متأكدًا أي مخطط قيد الاستخدام؟تحقق باستخدام:

```bash
# ارى من أين يتم حل مخطط محدد
openspec schema which my-workflow

# اعرض جميع المخططات المتاحة
openspec schema which --all
```

يُظهر الإخراج ما إذا كان من مشروعك، أو مجلد المستخدم، أو الحزمة:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **ملاحظة:** يدعم OpenSpec أيضًا مخططات على مستوى المستخدم في `~/.local/share/openspec/schemas/` للمشاركة عبر المشاريع، لكن يُوصى بمخططات على مستوى المشروع في `openspec/schemas/` لأنها تُتحكم بإصداراتها مع الكود الخاص بك.

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

### إضافة مُخرج للمراجعة

انسخ المخطط الافتراضي وأضف خطوة مراجعة:

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
      - review    # Now tasks require review too
```

---

## انظر أيضًا

- [مرجع سطر الأوامر: أوامر المخطط](cli.md#schema-commands) - توثيق الأوامر الكامل