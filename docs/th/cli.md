# CLI Reference

OpenSpec CLI (`openspec`) เป็นเครื่องมือที่ให้คำสั่งเทอร์มินัลสำหรับการตั้งค่าโปรเจกต์ การตรวจสอบความถูกต้อง การตรวจสอบสถานะ และการจัดการ คำสั่งเหล่านี้เป็นส่วนเสริมของคำสั่ง AI slash (เช่น `/opsx:propose`) ที่มีอธิบายไว้ใน [Commands](commands.md)

## สรุป

| หมวดหมู่ | คำสั่ง | วัตถุประสงค์ |
|----------|----------|---------|
| **การตั้งค่า** | `init`, `update` | เริ่มต้นและอัปเดต OpenSpec ในโปรเจกต์ของคุณ |
| **การเรียกดู** | `list`, `view`, `show` | สำรวจการเปลี่ยนแปลงและสเปก |
| **การตรวจสอบความถูกต้อง** | `validate` | ตรวจสอบการเปลี่ยนแปลงและสเปกสำหรับปัญหา |
| **วงจรชีวิต** | `archive` | ทำให้การเปลี่ยนแปลงที่เสร็จสมบูรณ์ถูกต้องตามขั้นตอน |
| **ขั้นตอนการทำงาน** | `status`, `instructions`, `templates`, `schemas` | สนับสนุนขั้นตอนการทำงานที่ขับเคลื่อนด้วยผลงาน |
| **Schema** | `schema init`, `schema fork`, `schema validate`, `schema which` | สร้างและจัดการขั้นตอนการทำงานที่กำหนดเอง |
| **การกำหนดค่า** | `config` | ดูและแก้ไขการตั้งค่า |
| **เครื่องมืออำนวยความสะดวก** | `feedback`, `completion` | การให้反馈 และการเชื่อมต่อกับ shell |

## คำสั่งสำหรับมนุษย์ vs คำสั่งสำหรับ Agent

คำสั่ง CLI ส่วนใหญ่ถูกออกแบบมาเพื่อ **การใช้งานของมนุษย์** ในเทอร์มินัล บางคำสั่งยังรองรับ **การใช้งานโดย Agent/สคริปต์** ผ่านเอาต์พุต JSON

### คำสั่งสำหรับมนุษย์เท่านั้น

คำสั่งเหล่านี้เป็นแบบโต้ตอบและออกแบบมาสำหรับการใช้งานในเทอร์มินัล:

| คำสั่ง | วัตถุประสงค์ |
|---------|---------|
| `openspec init` | เริ่มต้นโปรเจกต์ (พร้อมท์โต้ตอบ) |
| `openspec view` | แดชบอร์ดแบบโต้ตอบ |
| `openspec config edit` | เปิดไฟล์ config ในตัวแก้ไข |
| `openspec feedback` | ส่งข้อเสนอแนะผ่าน GitHub |
| `openspec completion install` | ติดตั้ง shell completions |

### คำสั่งที่เข้ากันได้กับ Agent

คำสั่งเหล่านี้รองรับเอาต์พุต `--json` สำหรับการใช้งานเชิงโปรแกรมโดย AI agents และสคริปต์:

| คำสั่ง | การใช้งานโดยมนุษย์ | การใช้งานโดย Agent |
|---------|-----------|-----------|
| `openspec list` | เรียกดูการเปลี่ยนแปลง/ข้อกำหนด | `--json` สำหรับข้อมูลแบบมีโครงสร้าง |
| `openspec show <item>` | อ่านเนื้อหา | `--json` สำหรับการแยกวิเคราะห์ |
| `openspec validate` | ตรวจสอบปัญหา | `--all --json` สำหรับการตรวจสอบแบบกลุ่ม |
| `openspec status` | ดูความคืบหน้าของ artifact | `--json` สำหรับสถานะแบบมีโครงสร้าง |
| `openspec instructions` | รับขั้นตอนถัดไป | `--json` สำหรับคำสั่ง agent |
| `openspec templates` | ค้นหาเส้นทางเทมเพลต | `--json` สำหรับการแก้ไขเส้นทาง |
| `openspec schemas` | แสดงรายการ schemas ที่มีอยู่ | `--json` สำหรับการค้นพบ schema |

---

## ตัวเลือกทั่วไป

ตัวเลือกเหล่านี้ใช้ได้กับทุกคำสั่ง:

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--version`, `-V` | แสดงหมายเลขเวอร์ชัน |
| `--no-color` | ปิดการใช้งานเอาต์พุตสี |
| `--help`, `-h` | แสดงความช่วยเหลือสำหรับคำสั่ง |

---

## คำสั่งการตั้งค่า

### `openspec init`

เริ่มต้น OpenSpec ในโปรเจกต์ของคุณ สร้างโครงสร้างโฟลเดอร์และกำหนดค่าการผสานรวมเครื่องมือ AI

พฤติกรรมเริ่มต้นใช้ค่า config ทั่วไป: profile `core`, delivery `both`, workflows `propose, explore, apply, archive`

```
openspec init [path] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `path` | ไม่ | ไดเรกทอรีเป้าหมาย (ค่าเริ่มต้น: ไดเรกทอรีปัจจุบัน) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--tools <list>` | กำหนดค่าเครื่องมือ AI โดยไม่ต้องโต้ตอบ ใช้ `all`, `none`, หรือรายการคั่นด้วยเครื่องหมายจุลภาค |
| `--force` | ล้างไฟล์เก่าโดยอัตโนมัติโดยไม่ต้องถาม |
| `--profile <profile>` | แทนที่ profile ทั่วไปสำหรับการรันนี้ (`core` หรือ `custom`) |

`--profile custom` ใช้ workflows ใดก็ตามที่เลือกไว้ใน config ทั่วไป (`openspec config profile`)

**ID เครื่องมือที่รองรับ (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

**ตัวอย่าง:**

```bash
# การเริ่มต้นแบบโต้ตอบ
openspec init

# เริ่มต้นในไดเรกทอรีเฉพาะ
openspec init ./my-project

# ไม่โต้ตอบ: กำหนดค่าสำหรับ Claude และ Cursor
openspec init --tools claude,cursor

# กำหนดค่าสำหรับเครื่องมือที่รองรับทั้งหมด
openspec init --tools all

# แทนที่ profile สำหรับการรันนี้
openspec init --profile core

# ข้ามท์และล้างไฟล์เก่าโดยอัตโนมัติ
openspec init --force
```

**สิ่งที่สร้างขึ้น:**

```
openspec/
├── specs/              # ข้อกำหนดของคุณ (แหล่งข้อมูลที่เชื่อถือได้)
├── changes/            # การเปลี่ยนแปลงที่เสนอ
└── config.yaml         # การกำหนดค่าโปรเจกต์

.claude/skills/         # ทักษะ Claude Code (ถ้าเลือก claude)
.cursor/skills/         # ทักษะ Cursor (ถ้าเลือก cursor)
.cursor/commands/       # คำสั่ง Cursor OPSX (ถ้า delivery รวมคำสั่ง)
... (การกำหนดค่าเครื่องมืออื่นๆ)
```

---

### `openspec update`

อัปเดตไฟล์คำสั่ง OpenSpec หลังจากอัปเกรด CLI สร้างไฟล์กำหนดค่าเครื่องมือ AI ใหม่โดยใช้ profile ทั่วไป  workflows ที่เลือก และโหมด delivery ปัจจุบัน

```
openspec update [path] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `path` | ไม่ | ไดเรกทอรีเป้าหมาย (ค่าเริ่มต้น: ไดเรกทอรีปัจจุบัน) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--force` | บังคับอัปเดตแม้ไฟล์จะทันสมัยแล้ว |

**ตัวอย่าง:**

```bash
# อัปเดตไฟล์คำสั่งหลังจาก npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## คำสั่งการเรียกดู

### `openspec list`

แสดงรายการการเปลี่ยนแปลงหรือข้อกำหนดในโปรเจกต์ของคุณ

```
openspec list [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--specs` | แสดงรายการข้อกำหนดแทนการเปลี่ยนแปลง |
| `--changes` | แสดงรายการการเปลี่ยนแปลง (ค่าเริ่มต้น) |
| `--sort <order>` | เรียงลำดับตาม `recent` (ค่าเริ่มต้น) หรือ `name` |
| `--json` | เอาต์พุตเป็น JSON |

**ตัวอย่าง:**

```bash
# แสดงรายการการเปลี่ยนแปลงที่ใช้งานอยู่ทั้งหมด
openspec list

# แสดงรายการข้อกำหนดทั้งหมด
openspec list --specs

# เอาต์พุต JSON สำหรับสคริปต์
openspec list --json
```

**เอาต์พุต (ข้อความ):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

แสดงแดชบอร์ดแบบโต้ตอบสำหรับสำรวจข้อกำหนดและการเปลี่ยนแปลง

```
openspec view
```

เปิดอินเทอร์เฟซบนเทอร์มินัลสำหรับนำทางข้อกำหนดและการเปลี่ยนแปลงของโปรเจกต์

---

### `openspec show`

แสดงรายละเอียดของการเปลี่ยนแปลงหรือข้อกำหนด

```
openspec show [item-name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `item-name` | ไม่ | ชื่อของการเปลี่ยนแปลงหรือข้อกำหนด (จะถามถ้าไม่ระบุ) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--type <type>` | ระบุประเภท: `change` หรือ `spec` (ตรวจจับอัตโนมัติถ้าไม่ชัดเจน) |
| `--json` | เอาต์พุตเป็น JSON |
| `--no-interactive` | ปิดการใช้งานท์ |

**ตัวเลือกเฉพาะการเปลี่ยนแปลง:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--deltas-only` | แสดงเฉพาะ delta specs (โหมด JSON) |

**ตัวเลือกเฉพาะข้อกำหนด:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--requirements` | แสดงเฉพาะข้อกำหนด ไม่รวมสถานการณ์ (โหมด JSON) |
| `--no-scenarios` | ไม่รวมเนื้อหาสถานการณ์ (โหมด JSON) |
| `-r, --requirement <id>` | แสดงข้อกำหนดเฉพาะตาม index เริ่มต้นที่ 1 (โหมด JSON) |

**ตัวอย่าง:**

```bash
# การเลือกแบบโต้ตอบ
openspec show

# แสดงการเปลี่ยนแปลงเฉพาะ
openspec show add-dark-mode

# แสดงข้อกำหนดเฉพาะ
openspec show auth --type spec

# เอาต์พุต JSON สำหรับการแยกวิเคราะห์
openspec show add-dark-mode --json
```

---

## คำสั่งการตรวจสอบ

### `openspec validate`

ตรวจสอบการเปลี่ยนแปลงและข้อกำหนดสำหรับปัญหาเชิงโครงสร้าง

```
openspec validate [item-name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `item-name` | ไม่ | รายการเฉพาะที่จะตรวจสอบ (จะถามถ้าไม่ระบุ) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--all` | ตรวจสอบการเปลี่ยนแปลงและข้อกำหนดทั้งหมด |
| `--changes` | ตรวจสอบการเปลี่ยนแปลงทั้งหมด |
| `--specs` | ตรวจสอบข้อกำหนดทั้งหมด |
| `--type <type>` | ระบุประเภทเมื่อชื่อไม่ชัดเจน: `change` หรือ `spec` |
| `--strict` | เปิดใช้งานโหมดการตรวจสอบที่เข้มงวด |
| `--json` | เอาต์พุตเป็น JSON |
| `--concurrency <n>` | จำนวนการตรวจสอบแบบคู่ขนานสูงสุด (ค่าเริ่มต้น: 6 หรือ env `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | ปิดการใช้งานท์ |

**ตัวอย่าง:**

```bash
# การตรวจสอบแบบโต้ตอบ
openspec validate

# ตรวจสอบการเปลี่ยนแปลงเฉพาะ
openspec validate add-dark-mode

# ตรวจสอบการเปลี่ยนแปลงทั้งหมด
openspec validate --changes

# ตรวจสอบทั้งหมดพร้อมเอาต์พุต JSON (สำหรับ CI/สคริปต์)
openspec validate --all --json

# การตรวจสอบที่เข้มงวดพร้อมความเร็วคู่ขนานที่เพิ่มขึ้น
openspec validate --all --strict --concurrency 12
```

**เอาต์พุต (ข้อความ):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**เอาต์พุต (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## คำสั่งวงจรชีวิต

### `openspec archive`

เก็บถาวรการเปลี่ยนแปลงที่เสร็จสิ้นและรวม delta specs เข้ากับ main specs

```
openspec archive [change-name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `change-name` | ไม่ | การเปลี่ยนแปลงที่จะเก็บถาวร (จะถามถ้าไม่ระบุ) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `-y, --yes` | ข้ามท์การยืนยัน |
| `--skip-specs` | ข้ามการอัปเดตข้อกำหนด (สำหรับการเปลี่ยนแปลงเฉพาะโครงสร้างพื้นฐาน/เครื่องมือ/เอกสาร) |
| `--no-validate` | ข้ามการตรวจสอบ (ต้องการการยืนยัน) |

**ตัวอย่าง:**

```bash
# การเก็บถาวรแบบโต้ตอบ
openspec archive

# เก็บถาวรการเปลี่ยนแปลงเฉพาะ
openspec archive add-dark-mode

# เก็บถาวรโดยไม่ต้องถาม (CI/สคริปต์)
openspec archive add-dark-mode --yes

# เก็บถาวรการเปลี่ยนแปลงเครื่องมือที่ไม่กระทบข้อกำหนด
openspec archive update-ci-config --skip-specs
```

**สิ่งที่ทำ:**

1. ตรวจสอบการเปลี่ยนแปลง (เว้นแต่ `--no-validate`)
2. ถามการยืนยัน (เว้นแต่ `--yes`)
3. รวม delta specs เข้ากับ `openspec/specs/`
4. ย้ายโฟลเดอร์การเปลี่ยนแปลงไปที่ `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## คำสั่งเวิร์กโฟลว์

คำสั่งเหล่านี้รองรับเวิร์กโฟลว์ OPSX ที่ขับเคลื่อนด้วย artifact มีประโยชน์ทั้งสำหรับมนุษย์ที่ตรวจสอบความคืบหน้าและ agents ที่กำหนดขั้นตอนถัดไป

### `openspec status`

แสดงสถานะความสมบูรณ์ของ artifact สำหรับการเปลี่ยนแปลง

```
openspec status [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--change <id>` | ชื่อการเปลี่ยนแปลง (จะถามถ้าไม่ระบุ) |
| `--schema <name>` | การแทนที่ schema (ตรวจจับอัตโนมัติจาก config ของการเปลี่ยนแปลง) |
| `--json` | เอาต์พุตเป็น JSON |

**ตัวอย่าง:**

```bash
# การตรวจสอบสถานะแบบโต้ตอบ
openspec status

# สถานะสำหรับการเปลี่ยนแปลงเฉพาะ
openspec status --change add-dark-mode

# JSON สำหรับการใช้งานโดย agent
openspec status --change add-dark-mode --json
```

**เอาต์พุต (ข้อความ):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**เอาต์พุต (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

รับคำสั่งที่เสริมสำหรับการสร้าง artifact หรือการใช้งาน tasks ใช้โดย AI agents เพื่อเข้าใจว่าควรสร้างอะไรต่อไป

```
openspec instructions [artifact] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `artifact` | ไม่ | ID ของ artifact: `proposal`, `specs`, `design`, `tasks` หรือ `apply` |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--change <id>` | ชื่อการเปลี่ยนแปลง (จำเป็นในโหมดไม่โต้ตอบ) |
| `--schema <name>` | การแทนที่ schema |
| `--json` | เอาต์พุตเป็น JSON |

**กรณีพิเศษ:** ใช้ `apply` เป็น artifact เพื่อรับคำสั่งการใช้งาน tasks

**ตัวอย่าง:**

```bash
# รับคำสั่งสำหรับ artifact ถัดไป
openspec instructions --change add-dark-mode

# รับคำสั่ง artifact เฉพาะ
openspec instructions design --change add-dark-mode

# รับคำสั่งการใช้งาน/การนำไปใช้
openspec instructions apply --change add-dark-mode

# JSON สำหรับ agent
openspec instructions design --change add-dark-mode --json
```

**เอาต์พุตประกอบด้วย:**

- เนื้อหาเทมเพลตสำหรับ artifact
- บริบทโปรเจกต์จาก config
- เนื้อหาจาก artifact ที่พึ่งพา
- กฎสำหรับแต่ละ artifact จาก config

---

### `openspec templates`

แสดงเส้นทางเทมเพลตที่แก้ไขแล้วสำหรับ artifact ทั้งหมดใน schema

```
openspec templates [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--schema <name>` | Schema ที่จะตรวจสอบ (ค่าเริ่มต้น: `spec-driven`) |
| `--json` | เอาต์พุตเป็น JSON |

**ตัวอย่าง:**

```bash
# แสดงเส้นทางเทมเพลตสำหรับ schema เริ่มต้น
openspec templates

# แสดงเทมเพลตสำหรับ schema กำหนดเอง
openspec templates --schema my-workflow

# JSON สำหรับการใช้งานเชิงโปรแกรม
openspec templates --json
```

**เอาต์พุต (ข้อความ):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

แสดงรายการเวิร์กโฟลว์ schemas ที่มีอยู่พร้อมคำอธิบายและ artifact flows

```
openspec schemas [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--json` | เอาต์พุตเป็น JSON |

**ตัวอย่าง:**

```bash
openspec schemas
```

**เอาต์พุต:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## คำสั่ง Schema

คำสั่งสำหรับสร้างและจัดการ schema ของเวิร์กโฟลว์แบบกำหนดเอง

### `openspec schema init`

สร้าง schema ใหม่สำหรับโปรเจกต์ปัจจุบัน

```
openspec schema init <name> [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `name` | ใช่ | ชื่อ schema (ใช้ kebab-case) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--description <text>` | คำอธิบาย schema |
| `--artifacts <list>` | รายการ artifact ID คั่นด้วยเครื่องหมายจุลภาค (ค่าเริ่มต้น: `proposal,specs,design,tasks`) |
| `--default` | ตั้งเป็น schema เริ่มต้นของโปรเจกต์ |
| `--no-default` | ไม่ถามเพื่อตั้งเป็นค่าเริ่มต้น |
| `--force` | เขียนทับ schema ที่มีอยู่ |
| `--json` | แสดงผลเป็น JSON |

**ตัวอย่าง:**

```bash
# สร้าง schema แบบโต้ตอบ
openspec schema init research-first

# สร้างแบบไม่โต้ตอบพร้อม artifact ที่ระบุ
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**สิ่งที่สร้างขึ้น:**

```
openspec/schemas/<name>/
├── schema.yaml           # นิยาม schema
└── templates/
    ├── proposal.md       # เทมเพลตสำหรับแต่ละ artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

คัดลอก schema ที่มีอยู่มาใช้ในโปรเจกต์ของคุณเพื่อปรับแต่ง

```
openspec schema fork <source> [name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `source` | ใช่ | Schema ที่ต้องการคัดลอก |
| `name` | ไม่ | ชื่อ schema ใหม่ (ค่าเริ่มต้น: `<source>-custom`) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--force` | เขียนทับปลายทางที่มีอยู่ |
| `--json` | แสดงผลเป็น JSON |

**ตัวอย่าง:**

```bash
# Fork schema spec-driven ที่มีมาในตัว
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

ตรวจสอบโครงสร้างและเทมเพลตของ schema

```
openspec schema validate [name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `name` | ไม่ | Schema ที่ต้องการตรวจสอบ (ตรวจสอบทั้งหมดหากไม่ระบุ) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--verbose` | แสดงขั้นตอนการตรวจสอบโดยละเอียด |
| `--json` | แสดงผลเป็น JSON |

**ตัวอย่าง:**

```bash
# ตรวจสอบ schema ที่ระบุ
openspec schema validate my-workflow

# ตรวจสอบ schema ทั้งหมด
openspec schema validate
```

---

### `openspec schema which`

แสดงว่า schema ถูกกำหนดจากที่ใด (มีประโยชน์สำหรับการแก้ไขปัญหาลำดับความสำคัญ)

```
openspec schema which [name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `name` | ไม่ | ชื่อ schema |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--all` | แสดง schema ทั้งหมดพร้อมแหล่งที่มา |
| `--json` | แสดงผลเป็น JSON |

**ตัวอย่าง:**

```bash
# ตรวจสอบว่า schema มาจากที่ใด
openspec schema which spec-driven
```

**ผลลัพธ์:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**ลำดับความสำคัญของ schema:**

1. โปรเจกต์: `openspec/schemas/<name>/`
2. ผู้ใช้: `~/.local/share/openspec/schemas/<name>/`
3. แพ็กเกจ: Schema ที่มีมาในตัว

---

## คำสั่งการกำหนดค่า

### `openspec config`

ดูและแก้ไขการกำหนดค่า OpenSpec ทั่วไป

```
openspec config <subcommand> [options]
```

**คำสั่งย่อย:**

| คำสั่งย่อย | คำอธิบาย |
|------------|-------------|
| `path` | แสดงตำแหน่งไฟล์กำหนดค่า |
| `list` | แสดงการตั้งค่าปัจจุบันทั้งหมด |
| `get <key>` | รับค่าที่ระบุ |
| `set <key> <value>` | ตั้งค่า |
| `unset <key>` | ลบคีย์ |
| `reset` | รีเซ็ตเป็นค่าเริ่มต้น |
| `edit` | เปิดใน `$EDITOR` |
| `profile [preset]` | กำหนดค่าโปรไฟล์เวิร์กโฟลว์แบบโต้ตอบหรือผ่าน preset |

**ตัวอย่าง:**

```bash
# แสดงเส้นทางไฟล์กำหนดค่า
openspec config path

# แสดงการตั้งค่าทั้งหมด
openspec config list

# รับค่าที่ระบุ
openspec config get telemetry.enabled

# ตั้งค่า
openspec config set telemetry.enabled false

# ตั้งค่าสตริงอย่างชัดเจน
openspec config set user.name "My Name" --string

# ลบการตั้งค่าที่กำหนดเอง
openspec config unset user.name

# รีเซ็ตการกำหนดค่าทั้งหมด
openspec config reset --all --yes

# แก้ไขกำหนดค่าในตัวแก้ไขของคุณ
openspec config edit

# กำหนดค่าโปรไฟล์ด้วยตัวช่วยสร้างตามการกระทำ
openspec config profile

# Preset ที่รวดเร็ว: สลับเวิร์กโฟลว์เป็น core (คงโหมด delivery)
openspec config profile core
```

`openspec config profile` เริ่มต้นด้วยสรุปสถานะปัจจุบัน จากนั้นให้คุณเลือก:
- เปลี่ยน delivery + เวิร์กโฟลว์
- เปลี่ยน delivery เท่านั้น
- เปลี่ยนเวิร์กโฟลว์เท่านั้น
- คงการตั้งค่าปัจจุบัน (ออก)

หากคุณเลือกคงการตั้งค่าปัจจุบัน จะไม่มีการเขียนการเปลี่ยนแปลงใดๆ และจะไม่แสดงข้อความแจ้งให้อัปเดต
หากไม่มีการเปลี่ยนแปลงกำหนดค่า แต่ไฟล์โปรเจกต์ปัจจุบันไม่ตรงกับโปรไฟล์/delivery ทั่วไปของคุณ OpenSpec จะแสดงคำเตือนและแนะนำให้รัน `openspec update`
การกด `Ctrl+C` ยังยกเลิกกระบวนการได้อย่างเรียบร้อย (ไม่มี stack trace) และออกด้วยรหัส `130`
ในรายการตรวจสอบเวิร์กโฟลว์ `[x]` หมายถึงเวิร์กโฟลว์ถูกเลือกในการกำหนดค่าทั่วไป เพื่อนำการเลือกเหล่านั้นไปใช้กับไฟล์โปรเจกต์ ให้รัน `openspec update` (หรือเลือก `Apply changes to this project now?` เมื่อได้รับแจ้งภายในโปรเจกต์)

**ตัวอย่างแบบโต้ตอบ:**

```bash
# อัปเดตเฉพาะ delivery
openspec config profile
# เลือก: Change delivery only
# เลือก delivery: Skills only

# อัปเดตเฉพาะเวิร์กโฟลว์
openspec config profile
# เลือก: Change workflows only
# สลับเวิร์กโฟลว์ในรายการตรวจสอบ แล้วยืนยัน
```

---

## คำสั่งยูทิลิตี้

### `openspec feedback`

ส่งข้อเสนอแนะเกี่ยวกับ OpenSpec สร้าง GitHub issue

```
openspec feedback <message> [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `message` | ใช่ | ข้อความข้อเสนอแนะ |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--body <text>` | คำอธิบายโดยละเอียด |

**ข้อกำหนด:** ต้องติดตั้งและยืนยันตัวตน GitHub CLI (`gh`) แล้ว

**ตัวอย่าง:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

จัดการ shell completions สำหรับ OpenSpec CLI

```
openspec completion <subcommand> [shell]
```

**คำสั่งย่อย:**

| คำสั่งย่อย | คำอธิบาย |
|------------|-------------|
| `generate [shell]` | แสดงสคริปต์ completion ไปยัง stdout |
| `install [shell]` | ติดตั้ง completion สำหรับ shell ของคุณ |
| `uninstall [shell]` | ลบ completion ที่ติดตั้งไว้ |

**Shell ที่รองรับ:** `bash`, `zsh`, `fish`, `powershell`

**ตัวอย่าง:**

```bash
# ติดตั้ง completions (ตรวจจับ shell โดยอัตโนมัติ)
openspec completion install

# ติดตั้งสำหรับ shell ที่ระบุ
openspec completion install zsh

# สร้างสคริปต์สำหรับการติดตั้งด้วยตนเอง
openspec completion generate bash > ~/.bash_completion.d/openspec

# ถอนการติดตั้ง
openspec completion uninstall
```

---

## รหัสการออก

| รหัส | ความหมาย |
|------|---------|
| `0` | สำเร็จ |
| `1` | ข้อผิดพลาด (การตรวจสอบล้มเหลว ไฟล์หายไป ฯลฯ) |

---

## ตัวแปรสภาพแวดล้อม

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | ตั้งเป็น `0` เพื่อปิดการใช้งาน telemetry |
| `DO_NOT_TRACK` | ตั้งเป็น `1` เพื่อปิดการใช้งาน telemetry (สัญญาณ DNT มาตรฐาน) |
| `OPENSPEC_CONCURRENCY` | ค่า concurrency เริ่มต้นสำหรับการตรวจสอบแบบ bulk (ค่าเริ่มต้น: 6) |
| `EDITOR` หรือ `VISUAL` | ตัวแก้ไขสำหรับ `openspec config edit` |
| `NO_COLOR` | ปิดการใช้งานสีเมื่อตั้งค่า |

---

## เอกสารประกอบที่เกี่ยวข้อง

- [คำสั่ง](commands.md) - คำสั่ง AI slash (`/opsx:propose`, `/opsx:apply` ฯลฯ)
- [เวิร์กโฟลว์](workflows.md) - รูปแบบทั่วไปและเมื่อใดควรใช้คำสั่งใด
- [การปรับแต่ง](customization.md) - สร้าง schema และเทมเพลตแบบกำหนดเอง
- [เริ่มต้นใช้งาน](getting-started.md) - คู่มือการตั้งค่าครั้งแรก