# المفاهيم

يشرح هذا الدليل الأفكار الأساسية وراء OpenSpec وكيف تتكامل مع بعضها البعض. للاستخدام العملي، راجع [البدء](getting-started.md) و [سير العمل](workflows.md).

## الفلسفة

يُبنى OpenSpec حول أربع مبادئ:

```
مرن لا صارم         — لا توجد بوابات مراحل، اعمل على ما يبدو منطقيًا
تكراري لا منهج الشلال — تعلم أثناء البناء، وحسّن مع التقدم
سهل لا معقد        — إعداد خفيف، إجراءات رسمية قليلة
أولوية للمشاريع القائمة        — يعمل مع قواعد الكود الحالية، وليس فقط المشاريع الجديدة من الصفر
```

### لماذا تهم هذه المبادئ؟

**مرن لا صارم.** أنظمة المواصفات التقليدية تقيدك بمراحل محددة: أولاً تخطط، ثم تنفذ، ثم تنتهي. OpenSpec أكثر مرونة — يمكنك إنشاء العناصر بأي ترتيب يناسب عملك.

**تكراري لا منهج الشلال.** المتطلبات تتغير. الفهم يتعمق. ما بدا كنهج جيد في البداية قد لا ينجح بعد أن ترى قاعدة الكود. OpenSpec يتبنى هذه الحقيقة.

**سهل لا معقد.** بعض أطر المواصفات تتطلب إعدادًا مكثفًا، أو تنسيقات صارمة، أو عمليات ثقيلة. OpenSpec لا يعيقك. يمكنك تهيئته في ثوانٍ، والبدء في العمل فورًا، وتخصيصه فقط إذا كنت بحاجة إلى ذلك.

**أولوية للمشاريع القائمة.** معظم عمل البرمجيات لا يتضمن البناء من الصفر — بل تعديل الأنظمة الحالية. النهج القائم على الفروقات في OpenSpec يسهل تحديد التغييرات في السلوك الحالي، وليس فقط وصف أنظمة جديدة.

## الصورة الكبيرة

ينظم OpenSpec عملك في مجالين رئيسيين:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**المواصفات (Specs)** هي المصدر الموثوق — فهي تصف كيف يعمل نظامك حالياً.

**التغييرات (Changes)** هي التعديلات المقترحة — توجد في مجلدات منفصلة حتى تكون جاهزاً لدمجها.

هذا الفصل هو المفتاح. يمكنك العمل على عدة تغييرات بشكل متوازٍ دون تعارضات. يمكنك مراجعة التغيير قبل أن يؤثر على المواصفات الرئيسية. وعندما تقوم بأرشفة تغيير، تندمج الدلتا (deltas) الخاصة به بشكل نظيف في المصدر الموثوق.

## المواصفات

تصف المواصفات سلوك نظامك باستخدام متطلبات وسيناريوهات منظمة.

### الهيكل

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

قم بتنظيم المواصفات حسب النطاق — تجميعات منطقية تناسب نظامك. الأنماط الشائعة:

- **حسب مجال الميزة**: `auth/`، `payments/`، `search/`
- **حسب المكون**: `api/`، `frontend/`، `workers/`
- **حسب السياق المقيد**: `ordering/`، `fulfillment/`، `inventory/`

### تنسيق المواصفة

تحتوي المواصفة على متطلبات، وكل متطلب له سيناريوهات:

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**العناصر الرئيسية:**

| العنصر | الغرض |
|---------|---------|
| `## Purpose` | وصف عالي المستوى لنطاق هذه المواصفة |
| `### Requirement:` | سلوك محدد يجب أن يوفره النظام |
| `#### Scenario:` | مثال ملموس للمتطلب أثناء التشغيل |
| SHALL/MUST/SHOULD | كلمات مفتاحية من RFC 2119 تشير إلى قوة المتطلب |

### لماذا ننظم المواصفات بهذه الطريقة

**المتطلبات هي "الماذا"** — فهي تصف ما يجب أن يفعله النظام دون تحديد التنفيذ.

**السيناريوهات هي "متى"** — فهي توفر أمثلة ملموسة يمكن التحقق منها. السيناريوهات الجيدة:
- قابلة للاختبار (يمكنك كتابة اختبار آلي لها)
- تغطي المسار السليم والحالات الحدية
- تستخدم Given/When/Then أو تنسيق منظم مشابه

**كلمات مفتاحية RFC 2119** (SHALL, MUST, SHOULD، MAY) توصل النية:
- **MUST/SHALL** — متطلب مطلق
- **SHOULD** — موصى به، ولكن توجد استثناءات
- **MAY** — اختياري

### ما هي المواصفة (وما ليست)

المواصفة هي **عقد سلوكي**، وليست خطة تنفيذ.

محتويات المواصفة الجيدة:
- سلوك يمكن ملاحظته ويعتمد عليه المستخدمون أو الأنظمة اللاحقة
- المدخلات والمخرجات وحالات الخطأ
- القيود الخارجية (الأمان، الخصوصية، الموثوقية، التوافق)
- سيناريوهات يمكن اختبارها أو التحقق منها صراحة

تجنب في المواصفات:
- أسماء الفئات/الدوال الداخلية
- اختيارات المكتبات أو الأطر البرمجية
- تفاصيل التنفيذ خطوة بخطوة
- خطط التنفيذ التفصيلية (هذه تنتمي إلى `design.md` أو `tasks.md`)

اختبار سريع:
- إذا كان يمكن تغيير التنفيذ دون تغيير السلوك الظاهر خارجياً، فمن المحتمل أنه لا ينتمي إلى المواصفة.

### اجعلها خفيفة: صرامة تقدمية

يهدف OpenSpec إلى تجنب البيروقراطية. استخدم المستوى الأخف الذي لا يزال يجعل التغيير قابلاً للتحقق.

**مواصفة خفيفة (افتراضي):**
- متطلبات قصيرة تركز على السلوك أولاً
- نطاق واضح وأهداف غير مرغوب فيها
- عدد قليل من فحوصات القبول الملموسة

**مواصفة كاملة (لمخاطر أعلى):**
- تغييرات عبر الفرق أو عبر المستودعات
- تغييرات واجهات برمجة التطبيقات/العقود، عمليات الترحيل، مخاوف الأمان/الخصوصية
- تغييرات حيث أن الغموض من المحتمل أن يسبب إعادة عمل مكلفة

يجب أن تبقى معظم التغييرات في الوضع الخفيف.

### التعاون بين الإنسان والوكيل

في العديد من الفرق، يستكشف البشر ويقوم الوكلاء بصياغة القطع الأثرية. الحلقة المقصودة هي:

1. يقدم الإنسان النية والسياق والقيود.
2. يحول الوكيل هذا إلى متطلبات تركز على السلوك وسيناريوهات.
3. يحتفظ الوكيل بتفاصيل التنفيذ في `design.md` و `tasks.md`، وليس في `spec.md`.
4. يؤكد التحقق من الهيكل والوضوح قبل التنفيذ.

هذا يجعل المواصفات قابلة للقراءة للبشر ومتسقة للوكلاء.

## التغييرات

التغيير هو تعديل مقترح لنظامك، معبأ في مجلد يحتوي على كل ما يلزم لفهمه وتنفيذه.

### هيكل التغيير

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

كل تغيير مستقل بذاته. يحتوي على:

- **Artifacts** — مستندات تلتقط النية والتصميم والمهام
- **Delta specs** — مواصفات لما يتم إضافته أو تعديله أو إزالته
- **Metadata** — تكوين اختياري لهذا التغيير المحدد

### لماذا تكون التغييرات مجلدات

لتعبئة التغيير في مجلد فوائد عديدة:

1. **كل شيء معاً.** توجد المقترحات والتصميم والمهام والمواصفات في مكان واحد. لا حاجة للبحث في مواقع مختلفة.

2. **عمل متوازٍ.** يمكن أن توجد عدة تغييرات في نفس الوقت دون تعارض. اعمل على `add-dark-mode` بينما `fix-auth-bug` قيد التقدم أيضاً.

3. **سجل نظيف.** عند الأرشفة، تنتقل التغييرات إلى `changes/archive/` مع الحفاظ على سياقها الكامل. يمكنك الرجوع إلى الوراء وفهم ليس فقط ما تم تغييره، ولكن لماذا.

4. **سهل المراجعة.** مجلد التغيير سهل المراجعة — افتحه، اقرأ المقترح، تحقق من التصميم، شاهد دلتا المواصفات.

## القطع الأثرية (Artifacts)

القطع الأثرية هي المستندات داخل التغيير التي توجه العمل.

### تدفق القطعة الأثرية

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

تبني القطع الأثرية على بعضها البعض. توفر كل قطعة أثرية سياق للتالية.

### أنواع القطع الأثرية

#### المقترح (`proposal.md`)

يلتقط المقترح **النية** و**النطاق** و**المنهجية** على مستوى عالٍ.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**متى تقوم بتحديث المقترح:**
- تغيير النطاق (تضييق أو توسيع)
- توضيح النية (فهم أفضل للمشكلة)
- تحول أساسي في المنهجية

#### المواصفات (delta specs في `specs/`)

تصف delta specs **ما يتم تغييره** بالنسبة إلى المواصفات الحالية. انظر [Delta Specs](#delta-specs) أدناه.

#### التصميم (`design.md`)

يلتقط التصميم **المنهجية التقنية** و**قرارات البنية**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**متى تقوم بتحديث التصميم:**
- يكشف التنفيذ أن المنهجية لن تعمل
- تم اكتشاف حل أفضل
- تتغير التبعيات أو القيود

#### المهام (`tasks.md`)

المهام هي **قائمة التحقق من التنفيذ** — خطوات ملموسة مع مربعات اختيار.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**أفضل ممارسات المهام:**
- قم بتجميع المهام ذات الصلة تحت عناوين
- استخدم ترقيم هرمي (1.1، 1.2، إلخ)
- اجعل المهام صغيرة بما يكفي لإكمالها في جلسة واحدة
- قم بتحديد المهام عند إكمالها

## Delta Specs

تعتبر مواصفات دلتا المفهوم الأساسي الذي يجعل OpenSpec يعمل للتطوير على الأنظمة الحالية (brownfield). فهي تصف **ما يتم تغييره** بدلاً من إعادة صياغة المواصفة بالكامل.

### التنسيق

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### أقسام الدلتا

| القسم | المعنى | ما يحدث عند الأرشفة |
|---------|---------|------------------------|
| `## ADDED Requirements` | سلوك جديد | يُلحق بالمواصفة الرئيسية |
| `## MODIFIED Requirements` | سلوك معدل | يستبدل المتطلب الموجود |
| `## REMOVED Requirements` | سلوك مهمل | يُحذف من المواصفة الرئيسية |

### لماذا نستخدم الدلتا بدلاً من المواصفات الكاملة

**الوضوح.** تُظهر الدلتا بالضبط ما يتم تغييره. عند قراءة مواصفة كاملة، سيتعين عليك مقارنتها ذهنياً مع الإصدار الحالي.

**تجنب التعارضات.** يمكن لتغييرين التأثير على نفس ملف المواصفة دون تعارض، طالما أنهما يعدلان متطلبات مختلفة.

**كفاءة المراجعة.** يرى المراجعون التغيير، وليس السياق الذي لم يتغير. التركيز على ما يهم.

**ملاءمة للتطوير على الأنظمة الحالية (brownfield).** معظم العمل يعدل السلوك الموجود. تجعل الدلتا التعديلات من الدرجة الأولى، وليست فكرة لاحقة.

## المخططات

تحدد المخططات أنواع القطع الأثرية وتبعياتها لسير العمل.

### كيف تعمل المخططات

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # لا توجد تبعيات، يمكن إنشاؤها أولاً

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # تحتاج إلى مقترح قبل إنشائها

  - id: design
    generates: design.md
    requires: [proposal]      # يمكن إنشاؤها بالتوازي مع المواصفات

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # تحتاج إلى كل من المواصفات والتصميم أولاً
```

**تشكل القطع الأثرية رسمًا بيانيًا للتبعيات:**

```
                    مقترح
                   (العقدة الجذرية)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      مواصفات                     تصميم
   (تحتاج إلى:                  (تحتاج إلى:
    مقترح)                       مقترح)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    مهام
                (تحتاج إلى:
                مواصفات، تصميم)
```

**التبعيات هي عوامل تمكين، وليست حواجز.** توضح ما هو ممكن إنشاؤه، وليس ما يجب عليك إنشاؤه تاليًا. يمكنك تخطي التصميم إذا لم تكن بحاجة إليه. يمكنك إنشاء المواصفات قبل أو بعد التصميم — كلاهما يعتمد فقط على المقترح.

### المخططات المدمجة

**spec-driven** (الافتراضي)

سير العمل القياسي للتطوير القائم على المواصفات:

```
مقترح → مواصفات → تصميم → مهام → تنفيذ
```

الأفضل لمعظم أعمال الميزات التي تريد الاتفاق على مواصفاتها قبل التنفيذ.

### المخططات المخصصة

أنشئ مخططات مخصصة لسير عمل فريقك:

```bash
# إنشئ من الصفر
openspec schema init research-first

# أو انسخ مخططًا موجودًا
openspec schema fork spec-driven research-first
```

**مثال على مخطط مخصص:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # قم بإجراء البحث أولاً

  - id: proposal
    generates: proposal.md
    requires: [research]   # المقترح مستنير بالبحث

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # تخطى المواصفات/التصميم، واذهب مباشرة إلى المهام
```

راجع [التخصيص](customization.md) للحصول على تفاصيل كاملة حول إنشاء المخططات المخصصة واستخدامها.

## الأرشفة

تضمن الأرشفة اكتمال التغيير عن طريق دمج مواصفات الفروقات الخاصة به في المواصفات الرئيسية والحفاظ على التغيير في السجل التاريخي.

### ما يحدث عند أرشفة تغيير

```
قبل الأرشفة:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ دمج
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


بعد الأرشفة:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # تحتوي الآن على متطلبات 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # محفوظة للسجل التاريخي
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### عملية الأرشفة

1. **دمج الفروقات.** يتم تطبيق كل قسم من مواصفة الفروقات (ADDED/MODIFIED/REMOVED) على المواصفة الرئيسية المقابلة.
2. **النقل إلى الأرشيف.** ينقل مجلد التغيير إلى `changes/archive/` مع بادئة تاريخ للترتيب الزمني.
3. **الحفاظ على السياق.** تظل جميع القطع الأثرية سليمة في الأرشيف. يمكنك دائمًا الرجوع إليها لفهم سبب إجراء تغيير معين.

### أهمية الأرشفة

**حالة نظيفة.** تعرض التغييرات النشطة (`changes/`) فقط العمل قيد التنفيذ. ينتقل العمل المكتمل خارج هذه المساحة.

**سجل تدقيق.** تحفظ الأرشيف السياق الكامل لكل تغيير — ليس فقط ما تم تغييره، بل أيضًا المقترح الذي يشرح السبب، والتصميم الذي يشرح آلية التنفيذ، والمهام التي توضح العمل المنجز.

**تطور المواصفات.** تنمو المواصفات بشكل طبيعي مع أرشفة التغييرات. تقوم كل عملية أرشفة بدمج فروقاتها، مما يبني مواصفة شاملة بمرور الوقت.

## كيف تتكامل كل العناصر معًا

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              تدفق OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. بداية التغيير      │  /opsx:propose (الأساسي) أو /opsx:new (الموسع)           │
│   │     التغيير     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. الإنشاء     │  /opsx:ff أو /opsx:continue (سير العمل الموسع)         │
│   │     القطع الأثرية  │  ينشئ مقترح → مواصفات → تصميم → مهام              │
│   │                │  (بناءً على تبعيات المخطط)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. التنفيذ    │  /opsx:apply                                            │
│   │     المهام      │  اعمل على إنجاز المهام، مع وضع علامة عليها عند الانتهاء                  │
│   │                │◄──── قم بتحديث القطع الأثرية أثناء تقدمك في التعلم                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. التحقق     │  /opsx:verify (اختياري)                                │
│   │     العمل       │  تحقق من أن التنفيذ يطابق المواصفات                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. الأرشفة    │────►│  تندمج مواصفات الفروقات في المواصفات الرئيسية           │    │
│   │     التغيير     │     │  ينقل مجلد التغيير إلى archive/             │    │
│   └────────────────┘     │  تصبح المواصفات الآن مصدر الحقيقة المحدث   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**الدورة الفاضلة:**

1. تصف المواصفات السلوك الحالي
2. يقترح التغييرات تعديلات (كفروقات)
3. يجعل التنفيذ التغييرات حقيقية
4. تدمج الأرشفة الفروقات في المواصفات
5. تصف المواصفات الآن السلوك الجديد
6. يبني التغيير التالي على المواصفات المحدثة

## قاموس المصطلحات

| المصطلح | التعريف |
|------|------------|
| **القطعة الأثرية** | وثيقة داخل تغيير (مقترح، تصميم، مهام، أو مواصفات فروقات) |
| **الأرشفة** | عملية إكمال تغيير ودمج فروقاته في المواصفات الرئيسية |
| **التغيير** | تعديل مقترح للنظام، معبأ كملف يحتوي على قطع أثرية |
| **مواصفة الفروقات** | مواصفة تصف التغييرات (ADDED/MODIFIED/REMOVED) بالنسبة إلى المواصفات الحالية |
| **المجال** | تجميع منطقي للمواصفات (مثل `auth/`، `payments/`) |
| **المتطلب** | سلوك محدد يجب أن يمتلكه النظام |
| **السيناريو** | مثال ملموس لمتطلب، عادة ما يكون بتنسيق Given/When/Then |
| **المخطط** | تعريف لأنواع القطع الأثرية وتبعياتها |
| **المواصفة** | مواصفة تصف سلوك النظام، تحتوي على متطلبات وسيناريوهات |
| **مصدر الحقيقة** | مجلد `openspec/specs/`، الذي يحتوي على السلوك الحالي المتفق عليه |

## الخطوات التالية

- [البدء](getting-started.md) - الخطوات العملية الأولى
- [سير العمل](workflows.md) - الأنماط الشائعة ومتى تستخدم كل منها
- [الأوامر](commands.md) - مرجع كامل للأوامر
- [التخصيص](customization.md) - إنشاء مخططات مخصصة وتكوين مشروعك