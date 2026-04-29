# คู่มือหลายภาษา

กำหนดค่า OpenSpec เพื่อสร้างชิ้นงานในภาษาอื่นนอกเหนือจากภาษาอังกฤษ

## การตั้งค่าอย่างรวดเร็ว

เพิ่มคำสั่งภาษาในไฟล์ `openspec/config.yaml` ของคุณ:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

เพียงเท่านี้ ชิ้นงานที่สร้างขึ้นทั้งหมดจะเป็นภาษาโปรตุเกส

## ตัวอย่างภาษา

### โปรตุเกส (บราซิล)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### ภาษาสเปน

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### ภาษาจีน (ตัวย่อ)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### ภาษาญี่ปุ่น

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### ภาษาฝรั่งเศส

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### ภาษาเยอรมัน

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## เคล็ดลับ

### จัดการกับคำศัพท์ทางเทคนิค

ตัดสินใจว่าจะจัดการกับคำศัพท์ทางเทคนิคอย่างไร:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### ผสมผสานกับบริบทอื่นๆ

การตั้งค่าภาษาทำงานร่วมกับบริบทอื่นๆ ของโปรเจกต์ของคุณ:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## การตรวจสอบ

เพื่อตรวจสอบว่าการตั้งค่าภาษาของคุณทำงานถูกต้อง:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## เอกสารที่เกี่ยวข้อง

- [คู่มือการปรับแต่ง](./customization.md) - ตัวเลือกการกำหนดค่าโปรเจกต์
- [คู่มือเวิร์กโฟลว์](./workflows.md) - เอกสารเวิร์กโฟลว์ฉบับเต็ม