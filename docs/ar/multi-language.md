# دليل تعدد اللغات

قم بتكوين OpenSpec لإنشاء نماذج بلغات أخرى غير الإنجليزية.

## الإعداد السريع

أضف تعليمات اللغة إلى ملف `openspec/config.yaml` الخاص بك:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

هذا كل شيء. سيتم الآن إنشاء جميع النماذج باللغة البرتغالية.

## أمثلة على اللغات

### البرتغالية (البرازيل)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### الإسبانية

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### الصينية (المبسطة)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### اليابانية

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### الفرنسية

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### الألمانية

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## نصائح

### التعامل مع المصطلحات التقنية

حدد كيفية التعامل مع المصطلحات التقنية:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### الدمج مع سياق آخر

تعمل إعدادات اللغة جنبًا إلى جنب مع سياق مشروعك الآخر:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## التحقق

للتحقق من عمل تكوين اللغة الخاص بك:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## التوثيق ذات الصلة

- [دليل التخصيص](./customization.md) - خيارات تكوين المشروع
- [دليل سير العمل](./workflows.md) - توثيق سير العمل الكامل