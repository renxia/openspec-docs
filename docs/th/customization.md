# การปรับแต่ง

OpenSpec มีระดับการปรับแต่งสามระดับ:

| ระดับ | หน้าที่ | เหมาะสำหรับ |
|-------|---------|-------------|
| **การกำหนดค่าโปรเจกต์** | ตั้งค่าเริ่มต้น ฉีดบริบท/กฎ | ทีมส่วนใหญ่ |
| **สคีมาแบบกำหนดเอง** | กำหนด artifact ของเวิร์กโฟลว์เอง | ทีมที่มีกระบวนการเฉพาะตัว |
| **การเขียนทับระดับโลก** | ใช้สคีมาร่วมกันในทุกโปรเจกต์ | ผู้ใช้ขั้นสูง |

---

## การกำหนดค่าโปรเจกต์

ไฟล์ `openspec/config.yaml` เป็นวิธีที่ง่ายที่สุดในการปรับแต่ง OpenSpec สำหรับทีมของคุณ ช่วยให้คุณ:

- **ตั้งค่าสคีมาเริ่มต้น** - ข้าม `--schema` ในทุกคำสั่ง
- **ฉีดบริบทโปรเจกต์** - AI จะเห็นเทคโนโลยีที่ใช้ ธรรมเนียม ฯลฯ
- **เพิ่มกฎต่อ artifact** - กฎที่กำหนดเองสำหรับ artifact เฉพาะ

### การตั้งค่าอย่างรวดเร็ว

```bash
openspec init
```

คำสั่งนี้จะแนะนำคุณผ่านการสร้างไฟล์กำหนดค่าแบบโต้ตอบ หรือสร้างด้วยตนเอง:

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

### วิธีการทำงาน

**สคีมาเริ่มต้น:**

```bash
# Without config
openspec new change my-feature --schema spec-driven

# With config - schema is automatic
openspec new change my-feature
```

**การฉีดบริบทและกฎ:**

เมื่อสร้าง artifact ใดๆ บริบทและกฎของคุณจะถูกฉีดเข้าไปใน prompt ของ AI:

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

- **บริบท** จะปรากฏในทุก artifact
- **กฎ** จะปรากฏเฉพาะกับ artifact ที่ตรงกันเท่านั้น

### ลำดับการแก้ไขสคีมา

เมื่อ OpenSpec ต้องการสคีมา จะตรวจสอบตามลำดับนี้:

1. แฟล็ก CLI: `--schema <name>`
2. เมตาดาต้าของ change (`.openspec.yaml` ในโฟลเดอร์ change)
3. การกำหนดค่าโปรเจกต์ (`openspec/config.yaml)
4. ค่าเริ่มต้น (`spec-driven`)

---

## สคีมาแบบกำหนดเอง

เมื่อการกำหนดค่าโปรเจกต์ไม่เพียงพอ ให้สร้างสคีมาของคุณเองด้วยเวิร์กโฟลว์ที่กำหนดเองทั้งหมด สคีมาแบบกำหนดเองจะอยู่ในไดเรกทอรี `openspec/schemas/` ของโปรเจกต์คุณ และได้รับการควบคุมเวอร์ชันร่วมกับโค้ดของคุณ

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

### Fork สคีมาที่มีอยู่

วิธีที่เร็วที่สุดในการปรับแต่งคือ fork สคีมาที่มีอยู่:

```bash
openspec schema fork spec-driven my-workflow
```

คำสั่งนี้จะคัดลอกสคีมา `spec-driven` ทั้งหมดไปยัง `openspec/schemas/my-workflow/` ซึ่งคุณสามารถแก้ไขได้อย่างอิสระ

**สิ่งที่คุณจะได้รับ:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

ตอนนี้แก้ไข `schema.yaml` เพื่อเปลี่ยนเวิร์กโฟลว์ หรือแก้ไขเทมเพลตเพื่อเปลี่ยนสิ่งที่ AI สร้างขึ้น

### สร้างสคีมาจากศูนย์

สำหรับเวิร์กโฟลว์ใหม่ทั้งหมด:

```bash
# Interactive
openspec schema init research-first

# Non-interactive
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### โครงสร้างสคีมา

สคีมาจะกำหนด artifact ในเวิร์กโฟลว์ของคุณและวิธีที่มันพึ่งพาซึ่งกันและกัน:

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

**ฟิลด์สำคัญ:**

| ฟิลด์ | วัตถุประสงค์ |
|-------|-------------|
| `id` | ตัวระบุที่ไม่ซ้ำกัน ใช้ในคำสั่งและกฎ |
| `generates` | ชื่อไฟล์ผลลัพธ์ (รองรับ glob เช่น `specs/**/*.md`) |
| `template` | ไฟล์เทมเพลตในไดเรกทอรี `templates/` |
| `instruction` | คำสั่ง AI สำหรับสร้าง artifact นี้ |
| `requires` | การพึ่งพา - artifact ใดที่ต้องมีอยู่ก่อน |

### เทมเพลต

เทมเพลตเป็นไฟล์ markdown ที่แนะนำ AI จะถูกฉีดเข้าไปใน prompt เมื่อสร้าง artifact นั้น

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

เทมเพลตสามารถรวม:
- หัวข้อส่วนที่ AI ควรกรอก
- ความคิดเห็น HTML ที่มีคำแนะนำสำหรับ AI
- ตัวอย่างรูปแบบที่แสดงโครงสร้างที่คาดหวัง

### ตรวจสอบสคีมาของคุณ

ก่อนใช้สคีมาแบบกำหนดเอง ให้ตรวจสอบ:

```bash
openspec schema validate my-workflow
```

การตรวจสอบนี้จะ:
- ตรวจสอบว่าไวยากรณ์ `schema.yaml` ถูกต้อง
- ตรวจสอบว่าเทมเพลตที่อ้างอิงทั้งหมดมีอยู่
- ตรวจสอบว่าไม่มีการพึ่งพาแบบวนลูป
- ตรวจสอบว่า artifact ID ถูกต้อง

### ใช้สคีมาแบบกำหนดเองของคุณ

เมื่อสร้างแล้ว ให้ใช้สคีมาของคุณด้วย:

```bash
# Specify on command
openspec new change feature --schema my-workflow

# Or set as default in config.yaml
schema: my-workflow
```

### แก้ไขปัญหาการแก้ไขสคีมา

ไม่แน่ใจว่าสคีมาใดถูกใช้? ตรวจสอบด้วย:

```bash
# See where a specific schema resolves from
openspec schema which my-workflow

# List all available schemas
openspec schema which --all
```

ผลลัพธ์จะแสดงว่ามาจากโปรเจกต์ ไดเรกทอรีผู้ใช้ หรือแพ็กเกจ:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **หมายเหตุ:** OpenSpec ยังรองรับสคีมาในระดับผู้ใช้ที่ `~/.local/share/openspec/schemas/` สำหรับการใช้ร่วมกันระหว่างโปรเจกต์ แต่แนะนำให้ใช้สคีมาในระดับโปรเจกต์ใน `openspec/schemas/` เนื่องจากได้รับการควบคุมเวอร์ชันร่วมกับโค้ดของคุณ

---

## ตัวอย่าง

### เวิร์กโฟลว์การวนซ้ำอย่างรวดเร็ว

เวิร์กโฟลว์ขั้นต่ำสำหรับการวนซ้ำอย่างรวดเร็ว:

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

### การเพิ่ม artifact การตรวจสอบ

Fork ค่าเริ่มต้นและเพิ่มขั้นตอนการตรวจสอบ:

```bash
openspec schema fork spec-driven with-review
```

จากนั้นแก้ไข `schema.yaml` เพื่อเพิ่ม:

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

## ดูเพิ่มเติม

- [อ้างอิง CLI: คำสั่งสคีมา](cli.md#schema-commands) - เอกสารคำสั่งฉบับเต็ม