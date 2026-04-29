# البدء

يشرح هذا الدليل كيفية عمل OpenSpec بعد تثبيته وتهيئته. للإرشادات المتعلقة بالتثبيت، راجع [ملف README الرئيسي](index.md#quick-start).

## كيف يعمل

يساعدك OpenSpec ومساعد البرمجة بالذكاء الاصطناعي على الاتفاق على ما يجب بناؤه قبل كتابة أي كود.

**المسار الافتراضي السريع (الملف الأساسي):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

**المسار الموسّع (اختيار سير عمل مخصص):**

```text
/opsx:new ──► /opsx:ff أو /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

الملف العالمي الافتراضي هو `core`، والذي يتضمن `propose` و `explight` و `apply` و `archive`. يمكنك تمكين أوامر سير العمل الموسّع باستخدام `openspec config profile` ثم `openspec update`.

## ما ينشئه OpenSpec

بعد تشغيل `openspec init`، يحتوي مشروعك على هذه البنية:

```
openspec/
├── specs/              # مصدر الحقيقة (سلوك نظامك)
│   └── <domain>/
│       └── spec.md
├── changes/            # التحديثات المقترحة (مجلد لكل تغيير)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # المواصفات الدلتا (ما يتغير)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # إعدادات المشروع (اختياري)
```

**مجلدان رئيسيان:**

- **`specs/`** - مصدر الحقيقة. تصف هذه المواصفات كيفية سلوك نظامك الحالي. منظمة حسب المجال (مثل `specs/auth/`، `specs/payments/`).

- **`changes/`** - التعديلات المقترحة. يحصل كل تغيير على مجلد خاص به يحتوي على جميع الملفات ذات الصلة. عند اكتمال التغيير، تندمج مواصفاته في مجلد `specs/` الرئيسي.

## فهم الملفات

يحتوي كل مجلد تغيير على ملفات توجه العمل:

| الملف | الغرض |
|----------|---------|
| `proposal.md` | "لماذا" و "ماذا" - يلتقط النية والنطاق والنهج |
| `specs/` | مواصفات دلتا تُظهر المتطلبات المُضافة/المُعدّلة/المُزالة |
| `design.md` | "كيف" - النهج الفني وقرارات الهيكلية |
| `tasks.md` | قائمة مهام التنفيذ مع خيارات التحقق |

**الملفات تبني بعضها البعض:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            التحديث أثناء التعلم
```

يمكنك دائمًا العودة وتنقيح الملفات السابقة أثناء تعلمك المزيد أثناء التنفيذ.

## كيفية عمل المواصفات الدلتا

المواصفات الدلتا هي المفهوم الرئيسي في OpenSpec. تُظهر ما يتغير مقارنةً بمواصفاتك الحالية.

### الصيغة

تستخدم المواصفات الدلتا أقسامًا للإشارة إلى نوع التغيير:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### ما يحدث عند الأرشفة

عند أرشفة تغيير:

1. تتم إضافة المتطلبات **المُضافة** إلى المواصفات الرئيسية
2. تتم استبدال المتطلبات **المُعدّلة** بالإصدار الحالي
3. تتم حذف المتطلبات **المُزالة** من المواصفات الرئيسية

يتم نقل مجلد التغيير إلى `openspec/changes/archive/` لسجل التدقيق.

## مثال: تغييرك الأول

دعنا نمر بإضافة الوضع الداكن إلى تطبيق.

### 1. بدء التغيير (الافتراضي)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — لماذا نفعل هذا، ما الذي يتغير
     ✓ specs/       — المتطلبات والسيناريوهات
     ✓ design.md    — النهج الفني
     ✓ tasks.md     — قائمة مهام التنفيذ
     Ready for implementation!
```

إذا قمت بتمكين ملف سير العمل الموسّع، يمكنك أيضًا القيام بذلك في خطوتين: `/opsx:new` ثم `/opsx:ff` (أو `/opsx:continue` بشكل تدريجي).

### 2. ما يتم إنشاؤه

**proposal.md** - يلتقط النية:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - دلتا تُظهر المتطلبات الجديدة:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - قائمة مهام التنفيذ:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. التنفيذ

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

أثناء التنفيذ، إذا اكتشفت أن التصميم يحتاج إلى تعديل، قم بتحديث الملف فقط واستمر.

### 4. الأرشفة

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

أصبحت مواصفات الدلتا الخاصة بك الآن جزءًا من المواصفات الرئيسية، توثيق كيفية عمل نظامك.

## التحقق والمراجعة

استخدم واجهة سطر الأوامر للتحقق من تغييراتك:

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## الخطوات التالية

- [سير العمل](workflows.md) - الأنماط الشائعة ومتى تستخدم كل أمر
- [الأوامر](commands.md) - المرجع الكامل لجميع أوامر الشرطة المائلة
- [المفاهيم](concepts.md) - فهم أعمق للمواصفات والتغييرات والمخططات
- [التخصيص](customization.md) - اجعل OpenSpec يعمل على طريقتك