# التخصيص

يوفر OpenSpec ثلاثة مستويات من التخصيص:

| المستوى | الوظيفة | الأفضل لـ |
|---------|---------|----------|
| **إعداد المشروع** | تعيين القيم الافتراضية، حقن السياق/القواعد | معظم الفرق |
| **المخططات المخصصة** | تحديد مواد سير العمل الخاصة بك | الفرق ذات العمليات الفريدة |
| **التجاوزات العامة** | مشاركة المخططات عبر جميع المشاريع | المستخدمون المتقدمون |

---

## إعداد المشروع

ملف `openspec/config.yaml` هو أسهل طريقة لتخصيص OpenSpec لفرقك. يتيح لك:

- **تعيين مخطط افتراضي** - تخطي خيار `--schema` في كل أمر
- **حقن سياق المشروع** - يرى الذكاء الاصطناعي مكدس التقنية الخاص بك، الاتفاقيات، إلخ.
- **إضافة قواعد لكل مادة على حدة** - قواعد مخصصة لمواد محددة

### الإعداد السريع

```bash
openspec init
```

يوجهك هذا خلال إنشاء الإعداد بشكل تفاعلي. أو قم بإنشاء واحد يدويًا:

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

### آلية العمل

**المخطط الافتراضي:**

```bash
# Without config
openspec new change my-feature --schema spec-driven

# With config - schema is automatic
openspec new change my-feature
```

**حقن السياق والقواعد:**

عند إنشاء أي مادة، يتم حقن السياق والقواعد الخاصة بك في موجه الذكاء الاصطناعي:

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

- **السياق** يظهر في جميع المواد
- **القواعد** تظهر فقط للمادة المطابقة

### ترتيب تحديد المخطط

عندما يحتاج OpenSpec إلى مخطط، يتحقق بهذا الترتيب:

1. علامة واجهة سطر الأوامر: `--schema <name>`
2. بيانات تعريف التغيير (`.openspec.yaml` في مجلد التغيير)
3. إعداد المشروع (`openspec/config.yaml`)
4. الافتراضي (`spec-driven`)

---

## المخططات المخصصة

عندما لا يكون إعداد المشروع كافياً، قم بإنشاء مخطط خاص بك مع سير عمل مخصص بالكامل. توجد المخططات المخصصة في دليل `openspec/schemas/` لمشروعك ويتم التحكم في إصدارها مع الكود الخاص بك.

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

### نسخ مخطط موجود حاليًا

أسرع طريقة للتخصيص هي نسخ مخطط مدمج حاليًا:

```bash
openspec schema fork spec-driven my-workflow
```

ينسخ هذا المخطط `spec-driven` بالكامل إلى `openspec/schemas/my-workflow/` حيث يمكنك تعديله بحرية.

**ما ستحصل عليه:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

الآن قم بتعديل `schema.yaml` لتغيير سير العمل، أو قم بتعديل القوالب لتغيير ما يولده الذكاء الاصطناعي.

### إنشاء مخطط من الصفر

لسير عمل جديد تمامًا:

```bash
# Interactive
openspec schema init research-first

# Non-interactive
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### بنية المخطط

يحدد المخطط مواد سير العمل الخاصة بك وكيف تعتمد على بعضها البعض:

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
|-------|-------|
| `id` | المعرف الفريد، مستخدم في الأوامر والقواعد |
| `generates` | اسم ملف الإخراج (يدعم الأنماط العالمية مثل `specs/**/*.md`) |
| `template` | ملف القالب في دليل `templates/` |
| `instruction` | تعليمات الذكاء الاصطناعي لإنشاء هذه المادة |
| `requires` | التبعيات - المواد التي يجب أن توجد أولاً |

### القوالب

القوالب هي ملفات markdown توجه الذكاء الاصطناعي. يتم حقنها في الموجه عند إنشاء تلك المادة.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

يمكن أن تحتوي القوالب على:
- عناوين الأقسام التي يجب على الذكاء الاصطناعي ملؤها
- تعليقات HTML مع توجيهات للذكاء الاصطناعي
- تنسيقات مثال توضح الهيكل المتوقع

### التحقق من صحة المخطط الخاص بك

قبل استخدام مخطط مخصص، تحقق من صحته:

```bash
openspec schema validate my-workflow
```

يتحقق هذا من:
- صحة بناء جملة `schema.yaml`
- وجود جميع القوالب المشار إليها
- عدم وجود تبعيات دائرية
- صلاحية معرفات المواد

### استخدام المخطط المخصص الخاص بك

بمجرد الإنشاء، استخدم مخططك مع:

```bash
# Specify on command
openspec new change feature --schema my-workflow

# Or set as default in config.yaml
schema: my-workflow
```

### تصحيح تحديد المخطط

لست متأكدًا أي مخطط يتم استخدامه؟ تحقق باستخدام:

```bash
# See where a specific schema resolves from
openspec schema which my-workflow

# List all available schemas
openspec schema which --all
```

يعرض الإخراج ما إذا كان المخطط من مشروعك، دليل المستخدم، أو الحزمة:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **ملاحظة:** يدعم OpenSpec أيضًا المخططات على مستوى المستخدم في `~/.local/share/openspec/schemas/` لمشاركتها عبر المشاريع، ولكن يُوصى بالمخططات على مستوى المشروع في `openspec/schemas/` نظرًا لتحكم إصدارها مع الكود الخاص بك.

---

## الأمثلة

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

### إضافة مادة مراجعة

انسخ الافتراضي وأضف خطوة مراجعة:

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

## المخططات المجتمعية

يدعم OpenSpec أيضًا المخططات التي تحتفظ بها المجتمع وتُوزع عبر مستودعات مستقلة. توفر هذه المخططات سير عمل رأي يدمج OpenSpec مع أدوات أو أنظمة أخرى، على غرار كيفية عمل [كتالوج امتدادات المجتمع لـ github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) لـ spec-kit.

المخططات المجتمعية غير مُضمنة في نواة OpenSpec — فهي توجد في مستودعاتها الخاصة مع وتيرة إصدارها الخاصة. لاستخدام أحدها، انسخ حزمة المخطط إلى دليل `openspec/schemas/<schema-name>/` لمشروعك (يحتوي ملف README لكل مستودع على تعليمات التثبيت).

| المخطط | المشرف | المستودع | الوصف |
|--------|--------|----------|-------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | يدمج حوكمة مواد OpenSpec مع مهارات تنفيذ [obra/superpowers](https://github.com/obra/superpowers) (العصف الذهني، كتابة الخطط، TDD عبر الوكلاء الفرعيين، مراجعة الكود، الإنهاء). يضيف مادة `retrospective` أولوية للأدلة التي تملأ فجوة لا يغطيها Superpowers بشكل أصلي. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | سير عمل يضع إدارة المنتج (PM) في المقام الأول. يشغل خط أنابيب تخطيط [nanopm](https://github.com/nmrtn/nanopm) (تدقيق → استراتيجية → خارطة طريق → PRD) قبل مرحلة التنفيذ. يربط تخطيط المنتج بسير عمل الهندسة القائم على المواصفات في OpenSpec. تقرأ المواد من `.nanopm/` إذا كان موجودًا — يستمد الاقتراح من التدقيق، ويستمد التصميم من الاستراتيجية، وتستمد المهام من تفصيل PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | دفاتر تشغيل اختبارات من البداية إلى النهاية على مستوى القدرات. تحصل كل قدرة على مواصفات غير قابلة للتغيير، وقالب مهام غير قابل للتغيير، وسجل تشغيل واحد مختوم بوقت لكل تنفيذ. تكون التأكيدات على السلوك القابل للملاحظة فقط (حالة HTTP، نص الاستجابة، الحالة المحفوظة — أبدًا سلاسل سجل فرعية); يسجل كل تشغيل بداية/نهاية UTC، والمدة، واستهلاك رموز LLM التقديري الأفضل. |

> هل تريد المساهمة بمخطط مجتمعي؟ افتح مشكلة مع رابط لمستودعك، أو أرسل طلب سحب (PR) لإضافة صف إلى هذا الجدول.

---

## انظر أيضًا

- [مرجع واجهة سطر الأوامر: أوامر المخطط](cli.md#schema-commands) - وثائق الأوامر الكاملة