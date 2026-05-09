# การปรับแต่ง

OpenSpec มีสามระดับของการปรับแต่ง:

| ระดับ | ทำอะไร | เหมาะสำหรับ |
|-------|--------|-------------|
| **Project Config** | ตั้งค่าเริ่มต้น, ใส่บริบท/กฎ | ทีมส่วนใหญ่ |
| **Custom Schemas** | กำหนดสิ่งประดิษฐ์ในเวิร์กโฟลว์ของคุณเอง | ทีมที่มีกระบวนการเฉพาะ |
| **Global Overrides** | แชร์ schema ข้ามทุกโปรเจกต์ | ผู้ใช้ขั้นสูง |

---

## การตั้งค่าโปรเจกต์

ไฟล์ `openspec/config.yaml` เป็นวิธีที่ง่ายที่สุดในการปรับแต่ง OpenSpec สำหรับทีมของคุณ ช่วยให้คุณ:

- **ตั้งค่า schema เริ่มต้น** - ข้าม `--schema` ในทุกคำสั่ง
- **ใส่บริบทโปรเจกต์** - AI จะเห็นเทคโนโลยีที่ใช้, ข้อตกลง, ฯลฯ
- **เพิ่มกฎสำหรับแต่ละสิ่งประดิษฐ์** - กฎที่กำหนดเองสำหรับสิ่งประดิษฐ์เฉพาะ

### การตั้งค่าอย่างรวดเร็ว

```bash
openspec init
```

คำสั่งนี้จะแนะนำคุณตลอดการสร้าง config แบบโต้ตอบ หรือสร้างด้วยตนเอง:

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

**Schema เริ่มต้น:**

```bash
# ไม่มี config
openspec new change my-feature --schema spec-driven

# มี config - schema จะถูกเลือกอัตโนมัติ
openspec new change my-feature
```

**การใส่บริบทและกฎ:**

เมื่อสร้างสิ่งประดิษฐ์ใดๆ บริบทและกฎของคุณจะถูกใส่เข้าไปในพรอมต์ของ AI:

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

- **บริบท** จะปรากฏในสิ่งประดิษฐ์ทั้งหมด
- **กฎ** จะปรากฏเฉพาะสำหรับสิ่งประดิษฐ์ที่ตรงกันเท่านั้น

### ลำดับการค้นหา Schema

เมื่อ OpenSpec ต้องการ schema จะตรวจสอบตามลำดับนี้:

1. แฟล็ก CLI: `--schema <name>`
2. เมตาดาต้าของ change (`.openspec.yaml` ในโฟลเดอร์ change)
3. การตั้งค่าโปรเจกต์ (`openspec/config.yaml`)
4. ค่าเริ่มต้น (`spec-driven`)

---

## Custom Schemas

เมื่อการตั้งค่าโปรเจกต์ไม่เพียงพอ ให้สร้าง schema ของคุณเองด้วยเวิร์กโฟลว์ที่กำหนดเองทั้งหมด Custom schemas จะอยู่ในไดเรกทอรี `openspec/schemas/` ของโปรเจกต์คุณและถูกควบคุมเวอร์ชันพร้อมกับโค้ดของคุณ

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

### Fork Schema ที่มีอยู่

วิธีที่เร็วที่สุดในการปรับแต่งคือ fork schema ในตัว:

```bash
openspec schema fork spec-driven my-workflow
```

คำสั่งนี้จะคัดลอก schema `spec-driven` ทั้งหมดไปที่ `openspec/schemas/my-workflow/` ซึ่งคุณสามารถแก้ไขได้อย่างอิสระ

**สิ่งที่คุณจะได้:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

ตอนนี้แก้ไข `schema.yaml` เพื่อเปลี่ยนเวิร์กโฟลว์ หรือแก้ไขเทมเพลตเพื่อเปลี่ยนสิ่งที่ AI สร้าง

### สร้าง Schema ตั้งแต่เริ่มต้น

สำหรับเวิร์กโฟลว์ที่สดใหม่ทั้งหมด:

```bash
# แบบโต้ตอบ
openspec schema init research-first

# ไม่โต้ตอบ
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### โครงสร้าง Schema

Schema จะกำหนดสิ่งประดิษฐ์ในเวิร์กโฟลว์ของคุณและวิธีที่พวกมันขึ้นต่อกัน:

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
| `id` | ตัวระบุเฉพาะ ใช้ในคำสั่งและกฎ |
| `generates` | ชื่อไฟล์เอาต์พุต (รองรับ globs เช่น `specs/**/*.md`) |
| `template` | ไฟล์เทมเพลตในไดเรกทอรี `templates/` |
| `instruction` | คำแนะนำ AI สำหรับการสร้างสิ่งประดิษฐ์นี้ |
| `requires` | การขึ้นต่อกัน - สิ่งประดิษฐ์ใดต้องมีอยู่ก่อน |

### เทมเพลต

เทมเพลตเป็นไฟล์ markdown ที่แนะนำ AI จะถูกใส่เข้าไปในพรอมต์เมื่อสร้างสิ่งประดิษฐ์นั้น

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

เทมเพลตสามารถประกอบด้วย:
- ส่วนหัวที่ AI ควรเติม
- ความคิดเห็น HTML พร้อมคำแนะนำสำหรับ AI
- รูปแบบตัวอย่างที่แสดงโครงสร้างที่คาดหวัง

### ตรวจสอบ Schema ของคุณ

ก่อนใช้ custom schema ให้ตรวจสอบ:

```bash
openspec schema validate my-workflow
```

คำสั่งนี้จะตรวจสอบ:
- ไวยากรณ์ `schema.yaml` ถูกต้อง
- เทมเพลตที่อ้างอิงทั้งหมดมีอยู่
- ไม่มีการขึ้นต่อกันแบบวงกลม
- รหัสสิ่งประดิษฐ์ถูกต้อง

### ใช้ Custom Schema ของคุณ

เมื่อสร้างแล้ว ใช้ schema ของคุณด้วย:

```bash
# ระบุในคำสั่ง
openspec new change feature --schema my-workflow

# หรือตั้งเป็นค่าเริ่มต้นใน config.yaml
schema: my-workflow
```

### ดีบักการค้นหา Schema

ไม่แน่ใจว่า schema ใดกำลังถูกใช้? ตรวจสอบด้วย:

```bash
# ดูว่า schema เฉพาะถูกค้นหาจากที่ใด
openspec schema which my-workflow

# แสดง schema ที่มีทั้งหมด
openspec schema which --all
```

เอาต์พุตจะแสดงว่ามาจากโปรเจกต์, ไดเรกทอรีผู้ใช้ หรือแพ็กเกจ:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **หมายเหตุ:** OpenSpec ยังรองรับ schema ระดับผู้ใช้ที่ `~/.local/share/openspec/schemas/` สำหรับการแชร์ข้ามโปรเจกต์ แต่แนะนำ schema ระดับโปรเจกต์ใน `openspec/schemas/` เนื่องจากถูกควบคุมเวอร์ชันพร้อมกับโค้ดของคุณ

---

## ตัวอย่าง

### เวิร์กโฟลว์การวนซ้ำอย่างรวดเร็ว

เวิร์กโฟลว์แบบเรียบง่ายสำหรับการวนซ้ำอย่างรวดเร็ว:

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

### เพิ่มสิ่งประดิษฐ์สำหรับการตรวจสอบ

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

## Community Schemas

OpenSpec ยังรองรับ schema ที่ดูแลโดยชุมชนซึ่งแจกจ่ายผ่าน repositories อิสระ สิ่งเหล่านี้ให้เวิร์กโฟลว์ที่มีความเห็นซึ่งรวม OpenSpec กับเครื่องมือหรือระบบอื่นๆ คล้ายกับวิธีที่ [github/spec-kit's community extension catalog](https://github.com/github/spec-kit/tree/main/extensions) ทำงานสำหรับ spec-kit

Community schemas ไม่ได้ถูก vendored เข้ามาใน OpenSpec core — พวกมันอยู่ใน repositories ของตัวเองด้วยจังหวะการเปิดตัวของตัวเอง หากต้องการใช้ ให้คัดลอกชุด schema เข้าไปในไดเรกทอรี `openspec/schemas/<schema-name>/` ของโปรเจกต์คุณ (README ของแต่ละ repo จะมีคำแนะนำการติดตั้ง)

| Schema | ผู้ดูแล | Repository | คำอธิบาย |
|--------|---------|-----------|----------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | รวมการกำกับดูแลสิ่งประดิษฐ์ของ OpenSpec กับทักษะการดำเนินงานของ [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, writing-plans, TDD via subagents, code review, finishing) เพิ่มสิ่งประดิษฐ์ `retrospective` ที่เน้นหลักฐานเพื่อเติมเต็มช่องว่างที่ Superpowers ไม่ครอบคลุมโดยธรรมชาติ |

> ต้องการมีส่วนร่วมกับ community schema หรือไม่? เปิด issue พร้อมลิงก์ไปยัง repository ของคุณ หรือส่ง PR เพิ่มแถวในตารางนี้

---

## ดูเพิ่มเติม

- [CLI Reference: Schema Commands](cli.md#schema-commands) - เอกสารคำสั่งฉบับเต็ม