# البدء

يشرح هذا الدليل كيفية عمل OpenSpec بعد تثبيته وتهيئته. للحصول على تعليمات التثبيت، راجع [main README](../index.md#quick-start) أو [Installation guide](installation.md). هل أنت جديد على مجموعة الوثائق بأكملها؟ [documentation home](index.md) يوضح كل شيء.

> **أين أكتب هذه الأوامر؟** مكانان، والخلط بينهما هو أكثر التعثرات الشائعة في البداية.
>
> - أوامر `openspec ...` (مثل `openspec init`) تعمل في **الطرفية (terminal)**.
> - أوامر `/opsx:...` (مثل `/opsx:propose`) تعمل في **دردشة مساعد الذكاء الاصطناعي**، وهو نفس المربع الذي تطلب منه كتابة التعليمات البرمجية فيه.
>
> لا يوجد "وضع تفاعلي" منفصل للبدء. أنت فقط تكتب الأمر الذي يبدأ بالشرطة المائلة (slash) في الدردشة ويقوم مساعدك بالمتابعة من هناك. شرح كامل: [How Commands Work](how-commands-work.md).

## أول خمس دقائق لك

الدورة الكاملة، مع تسمية كل خطوة بمكان حدوثها:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (اختياري: فكر في الأمر أولاً)
AI CHAT      /opsx:propose add-dark-mode      (يقوم الذكاء الاصطناعي بإعداد الخطة؛ أنت تراجعها)
AI CHAT      /opsx:apply                      (يقوم الذكاء الاصطناعي ببنائها)
AI CHAT      /opsx:archive                    (تم تحديث المواصفات، وتم حفظ التغيير)
```

خطوتان في الطرفية للإعداد، ثم تعيش في الدردشة. يوضح باقي هذا الدليل ما تفعله كل خطوة وما ستراه.

> **لست متأكدًا مما يجب بناؤه بعد؟ ابدأ بـ `/opsx:explore`.** إنه شريك تفكير لا يخاف الفشل ويقرأ قاعدة التعليمات البرمجية الخاصة بك، ويوازن الخيارات، ويصقل فكرة غامضة إلى خطة ملموسة، كل ذلك قبل أن يوجد أي ناتج أو كود. عندما تصبح الصورة واضحة، ينتقل الأمر إلى `/opsx:propose`. هذه هي العادة الأفضل على الإطلاق للعمل مع ذكاء اصطناعي قد يبني بثقة الشيء الخاطئ لولا هذا التوجيه. راجع [Explore guide](explore.md).

## كيف يعمل

يساعدك OpenSpec و مساعد البرمجة بالذكاء الاصطناعي الخاص بك على الاتفاق على ما يجب بناؤه قبل كتابة أي كود.

**المسار السريع الافتراضي (الملف الشخصي الأساسي):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (اختياري)
```

ابدأ بـ `/opsx:explore` عندما تكون في مرحلة التفكير فيما يجب القيام به، أو انتقل مباشرة إلى `/opsx:propose` عندما تعرف بالفعل. الـ Explore موجود في الملف الشخصي الافتراضي، لذا فهو متاح دائمًا عند الحاجة إليه.

**المسار الموسع (اختيار سير العمل المخصص):**

```text
/opsx:new ──► /opsx:ff أو /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

الملف الشخصي العام الافتراضي هو `core`، والذي يتضمن `propose` و `explore` و `apply` و `sync` و `archive`. يمكنك تمكين أوامر سير العمل الموسع باستخدام `openspec config profile` ثم `openspec update`.

## ما الذي ينشئه OpenSpec

بعد تشغيل `openspec init`، يحتوي مشروعك على هذا الهيكل:

```
openspec/
├── specs/              # مصدر الحقيقة (سلوك نظامك)
│   └── <domain>/
│       └── spec.md
├── changes/            # التحديثات المقترحة (مجلد واحد لكل تغيير)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # مواصفات دلتا (ما الذي يتغير)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # إعدادات المشروع (اختياري)
```

**مجلدان رئيسيان:**

- **`specs/`** - مصدر الحقيقة. تصف هذه المواصفات كيف يعمل نظامك حاليًا. منظمة حسب المجال (على سبيل المثال، `specs/auth/`، `specs/payments/`).

- **`changes/`** - التعديلات المقترحة. يحصل كل تغيير على مجلده الخاص بجميع المخرجات ذات الصلة. عندما يكتمل التغيير، يتم دمج مواصفاته في دليل `specs/` الرئيسي.

## فهم المخرجات (Artifacts)

يحتوي كل مجلد تغيير على مخرجات توجه العمل:

| المخرج | الغرض |
|----------|---------|
| `proposal.md` | "لماذا" و "ماذا" - يلتقط النية والنطاق والنهج |
| `specs/` | مواصفات دلتا التي توضح المتطلبات المُضافة/المُعدلة/المحذوفة |
| `design.md` | "كيف" - النهج التقني وقرارات البنية المعمارية |
| `tasks.md` | قائمة مراجعة التنفيذ مع مربعات الاختيار |

**تعتمد المخرجات على بعضها:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            يتم التحديث أثناء التعلم
```

يمكنك دائمًا العودة وتحسين المخرجات السابقة كلما تعلمت المزيد أثناء التنفيذ.

## كيف تعمل مواصفات دلتا (Delta Specs)

مواصفات الدلتا هي المفهوم الأساسي في OpenSpec. إنها توضح ما الذي يتغير بالنسبة لمواصفاتك الحالية.

### التنسيق

تستخدم مواصفات الدلتا أقسامًا للإشارة إلى نوع التغيير:

```markdown
# Delta for Auth (دلتا للمصادقة)

## ADDED Requirements (المتطلبات المضافة)

### Requirement: Two-Factor Authentication (المتطلب: المصادقة الثنائية)
يجب على النظام أن يطلب عاملاً ثانياً أثناء تسجيل الدخول.

#### Scenario: OTP required (السيناريو: مطلوب رمز OTP)
- GIVEN a user with 2FA enabled (بافتراض وجود مستخدم مع تفعيل 2FA)
- WHEN the user submits valid credentials (عندما يقدم المستخدم بيانات اعتماد صالحة)
- THEN an OTP challenge is presented (يتم تقديم تحدي OTP)

## MODIFIED Requirements (المتطلبات المُعدلة)

### Requirement: Session Timeout (المتطلب: مهلة الجلسة)
يجب على النظام أن ينهي الجلسات بعد 30 دقيقة من عدم النشاط.
(سابقاً: 60 دقيقة)

#### Scenario: Idle timeout (السيناريو: انتهاء المهلة بسبب الخمول)
- GIVEN an authenticated session (بافتراض وجود جلسة مصادق عليها)
- WHEN 30 minutes pass without activity (عندما تمر 30 دقيقة دون نشاط)
- THEN the session is invalidated (يتم إبطال الجلسة)

## REMOVED Requirements (المتطلبات المحذوفة)

### Requirement: Remember Me (المتطلب: تذكرني)
(مهمل لصالح المصادقة الثنائية)
```

### ماذا يحدث عند الأرشفة

عندما تقوم بأرشفة تغيير:

1. يتم إلحاق المتطلبات **ADDED** بالمواصفات الرئيسية.
2. تحل المتطلبات **MODIFIED** محل النسخة الحالية.
3. تُحذف المتطلبات **REMOVED** من المواصفات الرئيسية.

يتم نقل مجلد التغيير إلى `openspec/changes/archive/` لسجل التدقيق.

## مثال: أول تغيير لك

دعنا نتتبع إضافة الوضع المظلم (dark mode) لتطبيق ما.

### 1. بدء التغيير (الافتراضي)

```text
أنت: /opsx:propose add-dark-mode

الذكاء الاصطناعي:  تم إنشاء openspec/changes/add-dark-mode/
     ✓ proposal.md — لماذا نقوم بذلك، وما الذي يتغير
     ✓ specs/       — المتطلبات والسيناريوهات
     ✓ design.md    — النهج التقني
     ✓ tasks.md     — قائمة مراجعة التنفيذ
     جاهز للتنفيذ!
```

إذا قمت بتمكين الملف الشخصي الموسع لسير العمل، يمكنك أيضًا القيام بذلك على مرحلتين: `/opsx:new` ثم `/opsx:ff` (أو `/opsx:continue` تدريجيًا).

### 2. ما الذي تم إنشاؤه

**proposal.md** - يلتقط النية:

```markdown
# Proposal: Add Dark Mode (اقتراح: إضافة الوضع المظلم)

## Intent (النية)
طلب المستخدمين خيار الوضع المظلم لتقليل إجهاد العين أثناء الاستخدام الليلي.

## Scope (النطاق)
- إضافة زر تبديل للمظهر في الإعدادات
- دعم اكتشاف تفضيلات النظام
- الاحتفاظ بالتفضيل في localStorage

## Approach (النهج)
استخدم خصائص CSS المخصصة للتنسيق مع سياق React لإدارة الحالة.
```

**specs/ui/spec.md** - دلتا توضح المتطلبات الجديدة:

```markdown
# Delta for UI (دلتا لواجهة المستخدم)

## ADDED Requirements (المتطلبات المُضافة)

### Requirement: Theme Selection (المتطلب: اختيار المظهر)
يجب أن يسمح النظام للمستخدمين باختيار بين الأنماط الفاتحة والداكنة.

#### Scenario: Manual toggle (السيناريو: التبديل اليدوي)
- GIVEN a user on any page (بافتراض وجود مستخدم في أي صفحة)
- WHEN the user clicks the theme toggle (عندما ينقر المستخدم على زر تبديل المظهر)
- THEN the theme switches immediately (يتم تغيير المظهر فورًا)
- AND the preference persists across sessions (ويستمر التفضيل عبر الجلسات)

#### Scenario: System preference (السيناريو: تفضيل النظام)
- GIVEN a user with no saved preference (بافتراض وجود مستخدم بدون تفضيل محفوظ)
- WHEN the application loads (عندما يتم تحميل التطبيق)
- THEN the system's preferred color scheme is used (يتم استخدام المخطط اللوني المفضل للنظام)
```

**tasks.md** - قائمة مراجعة التنفيذ:

```markdown
# Tasks (المهام)

## 1. Theme Infrastructure (البنية التحتية للمظهر)
- [ ] 1.1 Create ThemeContext with light/dark state (إنشاء ThemeContext مع حالة فاتحة/داكنة)
- [ ] 1.2 Add CSS custom properties for colors (إضافة خصائص CSS المخصصة للألوان)
- [ ] 1.3 Implement localStorage persistence (تنفيذ الاحتفاظ في localStorage)

## 2. UI Components (مكونات واجهة المستخدم)
- [ ] 2.1 Create ThemeToggle component (إنشاء مكون ThemeToggle)
- [ ] 2.2 Add toggle to settings page (إضافة زر التبديل إلى صفحة الإعدادات)
- [ ] 2.3 Update Header to include quick toggle (تحديث الرأس لتضمين تبديل سريع

## 3. Styling (التنسيق)
- [ ] 3.1 Define dark theme color palette (تعريف لوحة ألوان الوضع الداكن)
- [ ] 3.2 Update components to use CSS variables (تحديث المكونات لاستخدام متغيرات CSS)
```

### 3. التنفيذ

```
أنت: /opsx:apply

الذكاء الاصطناعي:  يعمل على المهام...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     تم إكمال جميع المهام!
```

أثناء التنفيذ، إذا اكتشفت أن التصميم يحتاج إلى تعديل، فما عليك سوى تحديث المخرج والمتابعة.

### 4. الأرشفة

```
أنت: /opsx:archive

الذكاء الاصطناعي:  أرشفة add-dark-mode...
     ✓ تم دمج المواصفات في openspec/specs/ui/spec.md
     ✓ نقل إلى openspec/changes/archive/2025-01-24-add-dark-mode/
     تم! جاهز للميزة التالية.
```

أصبحت مواصفات الدلتا الخاصة بك جزءًا من المواصفات الرئيسية، موثقة لكيفية عمل نظامك.

## التحقق والمراجعة

استخدم واجهة سطر الأوامر (CLI) للتحقق من تغييراتك:

```bash
# عرض التغييرات النشطة
openspec list

# عرض تفاصيل التغيير
openspec show add-dark-mode

# التحقق من تنسيق المواصفات
openspec validate add-dark-mode

# لوحة معلومات تفاعلية
openspec view
```

## الخطوات التالية

- [Explore First](explore.md) - استخدم `/opsx:explore` للتفكير في فكرة قبل الالتزام بها
- [Using OpenSpec in an Existing Project](existing-projects.md) - ابدأ بقاعدة تعليمات برمجية كبيرة (brownfield codebase)
- [Editing & Iterating on a Change](editing-changes.md) - تحديث المخرجات، العودة، والمصالحة مع التعديلات اليدوية
- [Core Concepts at a Glance](overview.md) - النموذج العقلي بالكامل في صفحة واحدة
- [Examples & Recipes](examples.md) - تغييرات حقيقية، من البداية إلى النهاية
- [Workflows](workflows.md) - الأنماط الشائعة ومتى يجب استخدام كل أمر
- [Commands](commands.md) - مرجع كامل لجميع أوامر الشرطة المائلة (slash commands)
- [Concepts](concepts.md) - فهم أعمق للمواصفات والتغييرات والمخططات
- [Customization](customization.md) - اجعل OpenSpec يعمل بالطريقة التي تريدها
- [Stores](stores-beta/user-guide.md) - تخطيط يمتد عبر المستودعات أو الفرق؟ أبقه في مستودعه الخاص (نسخة تجريبية)
- [FAQ](faq.md) و [Troubleshooting](troubleshooting.md) - عندما تتعثر