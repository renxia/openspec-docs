# คำสั่ง

นี่คือเอกสารอ้างอิงสำหรับคำสั่งสแลชของ OpenSpec คำสั่งเหล่านี้จะถูกเรียกใช้ในอินเทอร์เฟซแชทของผู้ช่วยเขียนโค้ด AI ของคุณ (เช่น Claude Code, Cursor, Windsurf)

สำหรับรูปแบบเวิร์กโฟลว์และวิธีการใช้แต่ละคำสั่ง โปรดดูที่ [Workflows](workflows.md) สำหรับคำสั่ง CLI ให้ดูที่ [CLI](cli.md)

## ข้อมูลอ้างอิงอย่างรวดเร็ว

### เส้นทางด่วนเริ่มต้น (`core` profile)

| Command | Purpose |
|---------|---------|
| /opsx:propose | สร้างการเปลี่ยนแปลงและสร้าง artifact การวางแผนในขั้นตอนเดียว |
| /opsx:explore | พิจารณาแนวคิดก่อนที่จะยืนยันการเปลี่ยนแปลง |
| /opsx:apply | ดำเนินการตามงานจากการเปลี่ยนแปลงนั้น |
| /opsx:sync | ผสานรวม delta specs เข้ากับ main specs |
| /opsx:archive | เก็บถาวรการเปลี่ยนแปลงที่เสร็จสมบูรณ์แล้ว |

### คำสั่งเวิร์กโฟลว์แบบขยาย (การเลือกเวิร์กโฟลว์แบบกำหนดเอง)

| Command | Purpose |
|---------|---------|
| /opsx:new | เริ่มต้นโครงร่างการเปลี่ยนแปลงใหม่ |
| /opsx:continue | สร้าง artifact ถัดไปตามการพึ่งพา |
| /opsx:ff | Fast-forward: สร้าง artifact การวางแผนทั้งหมดในครั้งเดียว |
| /opsx:verify | ตรวจสอบว่าการนำไปใช้ตรงกับ artifacts หรือไม่ |
| /opsx:bulk-archive | เก็บถาวรการเปลี่ยนแปลงหลายรายการพร้อมกัน |
| /opsx:onboard | บทเรียนแนะนำผ่านเวิร์กโฟลว์ที่สมบูรณ์ |

โปรไฟล์ทั่วโลกเริ่มต้นคือ `core` หากต้องการเปิดใช้งานคำสั่งเวิร์กโฟลว์แบบขยาย ให้รัน `openspec config profile` เลือกเวิร์กโฟลว์ จากนั้นให้รัน `openspec update` ในโปรเจกต์ของคุณ

## Command Reference

### `/opsx:propose`

สร้างการเปลี่ยนแปลงใหม่และสร้างอาร์ติแฟกต์สำหรับการวางแผนในขั้นตอนเดียว นี่คือคำสั่งเริ่มต้นโดยค่าดีฟอลต์ในโปรไฟล์ `core`

**Syntax:**
```text
/opsx:propose [change-name-or-description]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name-or-description` | No | ชื่อแบบ kebab-case หรือคำอธิบายการเปลี่ยนแปลงที่เป็นภาษาธรรมดา |

**What it does:**
- สร้าง `openspec/changes/<change-name>/`
- สร้างอาร์ติแฟกต์ที่จำเป็นก่อนการนำไปใช้ (สำหรับ `spec-driven`: proposal, specs, design, tasks)
- หยุดเมื่อการเปลี่ยนแปลงพร้อมสำหรับการเรียก `/opsx:apply`

**Example:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Tips:**
- ใช้สิ่งนี้สำหรับเส้นทางแบบ end-to-end ที่รวดเร็วที่สุด
- หากต้องการควบคุมอาร์ติแฟกต์ทีละขั้นตอน ให้เปิดใช้งานเวิร์กโฟลว์ที่ขยาย (expanded workflows) และใช้ `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **เริ่มต้นจากตรงนี้เมื่อคุณไม่แน่ใจ** Explore เป็นคู่หูคิดแบบไม่มีความเสี่ยงาน: มันจะอ่าน codebase ของคุณ เปรียบเทียบตัวเลือก และกลั่นแนวคิดที่คลุมเครือให้เป็นแผนที่เป็นรูปธรรมก่อนที่จะมีการเปลี่ยนแปลงใด ๆ เกิดขึ้น สิ่งนี้มาพร้อมกับโปรไฟล์เริ่มต้น สำหรับกรณีศึกษาและตัวอย่างเพิ่มเติม โปรดดูไกด์ [Explore First](explore.md)

คิดถึงไอเดีย ตรวจสอบปัญหา และชี้แจงข้อกำหนดก่อนที่จะตัดสินใจทำการเปลี่ยนแปลง

**Syntax:**
```
/opsx:explore [topic]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `topic` | No | สิ่งที่คุณต้องการสำรวจหรือตรวจสอบ |

**What it does:**
- เปิดการสนทนาเชิงสำรวจโดยไม่จำเป็นต้องมีโครงสร้างใด ๆ
- ตรวจสอบ codebase เพื่อตอบคำถาม
- เปรียบเทียบตัวเลือกและแนวทางต่างๆ
- สร้างแผนภาพเพื่อชี้แจงความคิด
- สามารถเปลี่ยนไปใช้ `/opsx:propose` (ค่าเริ่มต้น) หรือ `/opsx:new` (เวิร์กโฟลว์ที่ขยาย) เมื่อข้อมูลเชิงลึกปรากฏชัดเจนขึ้น

**Example:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Tips:**
- ใช้เมื่อข้อกำหนดยังไม่ชัดเจนหรือคุณต้องการทำการตรวจสอบ
- จะไม่มีการสร้างอาร์ติแฟกต์ใด ๆ ระหว่างการสำรวจ
- ดีสำหรับการเปรียบเทียบหลายแนวทางก่อนตัดสินใจ
- สามารถอ่านไฟล์และค้นหา codebase ได้

---

### `/opsx:new`

เริ่มต้นโครงร่างการเปลี่ยนแปลงใหม่ สร้างโฟลเดอร์การเปลี่ยนแปลงและรอให้คุณสร้างอาร์ติแฟกต์ด้วย `/opsx:continue` หรือ `/opsx:ff`

คำสั่งนี้เป็นส่วนหนึ่งของชุดเวิร์กโฟลว์ที่ขยาย (ไม่ได้รวมอยู่ในโปรไฟล์ `core` โดยค่าเริ่มต้น)

**Syntax:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | ชื่อสำหรับโฟลเดอร์การเปลี่ยนแปลง (จะถูกถามหากไม่ได้ระบุ) |
| `--schema` | No | สคีมาเวิร์กโฟลว์ที่จะใช้ (ค่าเริ่มต้น: จาก config หรือ `spec-driven`) |

**What it does:**
- สร้างไดเร็กทอรี `openspec/changes/<change-name>/`
- สร้างไฟล์ metadata `.openspec.yaml` ในโฟลเดอร์การเปลี่ยนแปลง
- แสดงเทมเพลตอาร์ติแฟกต์แรกที่พร้อมสำหรับการสร้าง
- ถามชื่อการเปลี่ยนแปลงและสคีมาหากไม่ได้ระบุ

**What it creates:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**Example:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Tips:**
- ใช้ชื่อที่สื่อความหมาย: `add-feature`, `fix-bug`, `refactor-module`
- หลีกเลี่ยงชื่อทั่วไป เช่น `update`, `changes`, `wip`
- สคีมาสามารถตั้งค่าได้ใน project config (`openspec/config.yaml`)

---

### `/opsx:continue`

สร้างอาร์ติแฟกต์ถัดไปในสายการพึ่งพา (dependency chain) สร้างทีละอาร์ติแฟกต์เพื่อความก้าวหน้าแบบเพิ่มขึ้นเรื่อย ๆ

**Syntax:**
```
/opsx:continue [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | การเปลี่ยนแปลงที่ต้องการดำเนินการต่อ (อนุมานจากบริบทหากไม่ได้ระบุ) |

**What it does:**
- สอบถามกราฟการพึ่งพาของอาร์ติแฟกต์
- แสดงว่าอาร์ติแฟกต์ใดพร้อมและอาร์ติแฟกต์ใดถูกบล็อก
- สร้างอาร์ติแฟกต์ที่พร้อมเป็นอันดับแรก
- อ่านไฟล์การพึ่งพาเพื่อบริบท
- แสดงสิ่งที่สามารถใช้งานได้หลังจากสร้างเสร็จ

**Example:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**Tips:**
- ใช้เมื่อคุณต้องการตรวจสอบอาร์ติแฟกต์แต่ละชิ้นก่อนดำเนินการต่อ
- ดีสำหรับการเปลี่ยนแปลงที่ซับซ้อนซึ่งคุณต้องการการควบคุม
- อาร์ติแฟกต์หลายชิ้นอาจพร้อมกันได้
- คุณสามารถแก้ไขอาร์ติแฟกต์ที่สร้างขึ้นได้ก่อนดำเนินการต่อ

---

### `/opsx:ff`

เร่งความเร็ว (Fast-forward) การสร้างอาร์ติแฟกต์ สร้างอาร์ติแฟกต์การวางแผนทั้งหมดในคราวเดียว

**Syntax:**
```
/opsx:ff [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | การเปลี่ยนแปลงที่ต้องการเร่งความเร็ว (อนุมานจากบริบทหากไม่ได้ระบุ) |

**What it does:**
- สร้างอาร์ติแฟกต์ทั้งหมดตามลำดับการพึ่งพา
- ติดตามความคืบหน้าผ่านรายการสิ่งที่ต้องทำ (todo list)
- หยุดเมื่ออาร์ติแฟกต์ที่ `apply-required` ทั้งหมดเสร็จสมบูรณ์
- อ่านการพึ่งพาแต่ละชิ้นก่อนสร้างอาร์ติแฟกต์ถัดไป

**Example:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Tips:**
- ใช้เมื่อคุณมีภาพที่ชัดเจนว่ากำลังสร้างอะไรอยู่
- เร็วกว่า `/opsx:continue` สำหรับการเปลี่ยนแปลงที่ไม่ซับซ้อน
- คุณยังสามารถแก้ไขอาร์ติแฟกต์ได้หลังจากนั้น
- ดีสำหรับฟีเจอร์ขนาดเล็กถึงกลาง

---

### `/opsx:apply`

ดำเนินการตามงาน (tasks) จากการเปลี่ยนแปลง ทำงานผ่านรายการงาน เขียนโค้ดและทำเครื่องหมายรายการที่เสร็จสมบูรณ์

**Syntax:**
```
/opsx:apply [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | การเปลี่ยนแปลงที่ต้องการดำเนินการ (อนุมานจากบริบทหากไม่ได้ระบุ) |

**What it does:**
- อ่าน `tasks.md` และระบุงานที่ยังไม่เสร็จสมบูรณ์
- ทำงานผ่านงานทีละรายการ
- เขียนโค้ด สร้างไฟล์ รันเทสต์ตามความจำเป็น
- ทำเครื่องหมายงานให้เสร็จสมบูรณ์ด้วยช่องทำเครื่องหมาย `[x]`

**Example:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Tips:**
- สามารถกลับมาดำเนินการต่อได้หากถูกขัดจังหวะ
- ใช้สำหรับการเปลี่ยนแปลงแบบคู่ขนานโดยการระบุชื่อการเปลี่ยนแปลง
- สถานะวะของการเสร็จสมบูรณ์จะถูกติดตามในช่องทำเครื่องหมายของ `tasks.md`

---

### `/opsx:verify`

ตรวจสอบว่าการนำไปใช้นั้นตรงตามอาร์ติแฟกต์การเปลี่ยนแปลง ตรวจสอบความครบถ้วน ความถูกต้อง และความสอดคล้อง

**Syntax:**
```
/opsx:verify [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | การเปลี่ยนแปลงที่ต้องการตรวจสอบ (อนุมานจากบริบทหากไม่ได้ระบุ) |

**What it does:**
- ตรวจสอบสามมิติของคุณภาพการนำไปใช้
- ค้นหาหลักฐานการดำเนินการใน codebase
- รายงานปัญหาที่จัดหมวดหมู่เป็น CRITICAL, WARNING หรือ SUGGESTION
- ไม่ได้บล็อกการเก็บถาว (archive) แต่จะแสดงปัญหาเหล่านั้น

**Verification dimensions:**

| Dimension | What it validates |
|-----------|-------------------|
| **Completeness** | งานทั้งหมดเสร็จสมบูรณ์ ข้อกำหนดทั้งหมดถูกนำไปใช้ สถานการณ์ต่างๆ ถูกครอบคลุม |
| **Correctness** | การดำเนินการตรงตามเจตนาของสเปค จัดการกับกรณีขอบเขต (edge cases) |
| **Coherence** | การตัดสินใจด้านการออกแบบสะท้อนอยู่ในโค้ด รูปแบบมีความสอดคล้องกัน |

**Example:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Tips:**
- รันก่อนการเก็บถาวเพื่อตรวจจับความไม่สอดคล้องกันตั้งแต่เนิ่น ๆ
- คำเตือนจะไม่บล็อกการเก็บถาวแต่บ่งชี้ถึงปัญหาที่อาจเกิดขึ้น
- ดีสำหรับการตรวจสอบงานของ AI ก่อนที่จะทำการ commit
- สามารถเปิดเผยความคลาดเคลื่อนระหว่างอาร์ติแฟกต์และการดำเนินการ

---

### `/opsx:sync`

**คำสั่งทางเลือก (Optional command).** ผสาน delta specs จากการเปลี่ยนแปลงเข้ากับสเปคหลัก Archive จะแจ้งเตือนให้ซิงค์หากจำเป็น ดังนั้นโดยปกติคุณจึงไม่จำเป็นต้องเรียกใช้สิ่งนี้ด้วยตนเอง

**Syntax:**
```
/opsx:sync [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | การเปลี่ยนแปลงที่ต้องการซิงค์ (อนุมานจากบริบทหากไม่ได้ระบุ) |

**What it does:**
- อ่าน delta specs จากโฟลเดอร์การเปลี่ยนแปลง
- แยกส่วน ADDED/MODIFIED/REMOVED/RENAMED
- ผสานการเปลี่ยนแปลงเข้าสู่ไดเร็กทอรี `openspec/specs/` หลัก
- รักษาเนื้อหาที่มีอยู่ที่ไม่ถูกกล่าวถึงใน delta
- ไม่ได้ทำการเก็บถาวการเปลี่ยนแปลง (ยังคงสถานะ active)

**Example:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**When to use manually:**

| Scenario | Use sync? |
|----------|-----------|
| Long-running change, want specs in main before archiving | Yes |
| Multiple parallel changes need the updated base specs | Yes |
| Want to preview/review the merge separately | Yes |
| Quick change, going straight to archive | No (archive handles it) |

**Tips:**
- Sync มีความฉลาด ไม่ใช่การคัดลอกวาง
- สามารถเพิ่มสถานการณ์ให้กับข้อกำหนดที่มีอยู่ได้โดยไม่ต้องทำซ้ำ
- การเปลี่ยนแปลงยังคง active หลังจากการซิงค์ (ไม่ได้ถูกเก็บถาว)
- ผู้ใช้ส่วนใหญ่จะไม่จำเป็นต้องเรียกใช้สิ่งนี้โดยตรง—archive จะแจ้งเตือนหากจำเป็น

---

### `/opsx:archive`

ทำการเก็บถาวการเปลี่ยนแปลงที่เสร็จสมบูรณ์ สรุปการเปลี่ยนแปลงและย้ายไปยังโฟลเดอร์ archive

**Syntax:**
```
/opsx:archive [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | การเปลี่ยนแปลงที่ต้องการเก็บถาว (อนุมานจากบริบทหากไม่ได้ระบุ) |

**What it does:**
- ตรวจสอบสถานะการเสร็จสมบูรณ์ของอาร์ติแฟกต์
- ตรวจสอบความเสร็จสมบูรณ์ของงาน (เตือนหากไม่เสร็จสมบูรณ์)
- เสนอให้ซิงค์ delta specs หากยังไม่ได้ซิงค์
- ย้ายโฟลเดอร์การเปลี่ยนแปลงไปยัง `openspec/changes/archive/YYYY-MM-DD-<name>/`
- รักษาอาร์ติแฟกต์ทั้งหมดไว้สำหรับ audit trail

**Example:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Tips:**
- Archive จะไม่บล็อกหากงานยังไม่เสร็จสมบูรณ์ แต่จะเตือน
- Delta specs สามารถซิงค์ระหว่างการ archive หรือก่อนหน้าได้
- การเปลี่ยนแปลงที่ถูกเก็บถาวจะถูกรักษาไว้สำหรับประวัติ
- ใช้ `/opsx:verify` ก่อนเพื่อตรวจจับปัญหา

---

### `/opsx:bulk-archive`

ทำการเก็บถาวการเปลี่ยนแปลงที่เสร็จสมบูรณ์หลายรายการพร้อมกัน จัดการความขัดแย้งของสเปคระหว่างการเปลี่ยนแปลง

**Syntax:**
```
/opsx:bulk-archive [change-names...]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-names` | No | การเปลี่ยนแปลงเฉพาะที่ต้องการเก็บถาว (จะถูกถามให้เลือกหากไม่ได้ระบุ) |

**What it does:**
- แสดงรายการการเปลี่ยนแปลงที่เสร็จสมบูรณ์ทั้งหมด
- ตรวจสอบแต่ละการเปลี่ยนแปลงก่อนทำการเก็บถาว
- ตรวจจับความขัดแย้งของสเปคระหว่างการเปลี่ยนแปลง
- แก้ไขความขัดแย้งโดยตรวจสอบว่าสิ่งใดถูกนำไปใช้จริง
- เก็บถาวตามลำดับเวลา

**Example:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Tips:**
- ดีสำหรับสายงานแบบคู่ขนาน (parallel work streams)
- การแก้ไขความขัดแย้งเป็นแบบ agentic (ตรวจสอบ codebase)
- การเปลี่ยนแปลงจะถูกเก็บถาวตามลำดับการสร้าง
- จะมีการแจ้งเตือนก่อนที่จะเขียนทับเนื้อหา spec

---

### `/opsx:onboard`

การฝึกอบรมแบบมีไกด์นำทางผ่านเวิร์กโฟลว์ OpenSpec ที่สมบูรณ์ เป็นบทเรียนเชิงโต้ตอบโดยใช้ codebase จริงของคุณ

**Syntax:**
```
/opsx:onboard
```

**What it does:**
- นำทางผ่านวงจรเวิร์กโฟลว์ที่สมบูรณ์พร้อมคำบรรยาย
- สแกน codebase ของคุณเพื่อหาโอกาสในการปรับปรุงจริง
- สร้างการเปลี่ยนแปลงจริงพร้อมอาร์ติแฟกต์จริง
- ดำเนินงานจริง (การเปลี่ยนแปลงเล็กน้อยที่ปลอดภัย)
- เก็บถาวการเปลี่ยนแปลงที่เสร็จสมบูรณ์
- อธิบายแต่ละขั้นตอนขณะที่เกิดขึ้น

**Phases:**
1. Welcome and codebase analysis (ต้อนรับและการวิเคราะห์ codebase)
2. Finding an improvement opportunity (ค้นหาโอกาสในการปรับปรุง)
3. Creating a change (`/opsx:new`) (สร้างการเปลี่ยนแปลง)
4. Writing the proposal (เขียนข้อเสนอ)
5. Creating specs (สร้างสเปค)
6. Writing the design (เขียนการออกแบบ)
7. Creating tasks (สร้างงาน)
8. Implementing tasks (`/opsx:apply`) (ดำเนินการตามงาน)
9. Verifying implementation (ตรวจสอบการนำไปใช้)
10. Archiving the change (เก็บถาวการเปลี่ยนแปลง)
11. Summary and next steps (สรุปและขั้นตอนต่อไป)

**Example:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Tips:**
- ดีที่สุดสำหรับผู้ใช้ใหม่ที่กำลังเรียนรู้เวิร์กโฟลว์
- ใช้โค้ดจริง ไม่ใช่ตัวอย่างของเล่น
- สร้างการเปลี่ยนแปลงจริงที่คุณสามารถเก็บไว้หรือทิ้งได้
- ใช้เวลา 15-30 นาทีในการดำเนินการให้เสร็จสมบูรณ์

## รูปแบบคำสั่งตามเครื่องมือ AI

เครื่องมือ AI ต่างๆ ใช้รูปแบบคำสั่งที่แตกต่างกันเล็กน้อย ให้ใช้รูปแบบที่ตรงกับเครื่องมือของคุณ:

| เครื่องมือ | ตัวอย่างไวยากรณ์คำสั่ง |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

เจตนาของคำสั่งนั้นเหมือนกันในทุกเครื่องมือ แต่การแสดงผลของคำสั่งอาจแตกต่างกันไปตามการผสานรวม (integration).

> **หมายเหตุ:** คำสั่งของ GitHub Copilot (`.github/prompts/*.prompt.md`) มีให้ใช้เฉพาะในส่วนขยาย IDE (VS Code, JetBrains, Visual Studio) เท่านั้น GitHub Copilot CLI ยังไม่รองรับไฟล์ prompt แบบกำหนดเอง — โปรดดู [Supported Tools](supported-tools.md) สำหรับรายละเอียดและวิธีแก้ไขปัญหา

---

## คำสั่งเดิม (Legacy)

คำสั่งเหล่านี้ใช้เวิร์กโฟลว์แบบเก่าที่ทำ "ทั้งหมดในครั้งเดียว" ยังคงใช้งานได้ แต่แนะนำให้ใช้คำสั่ง OPSX

| คำสั่ง | หน้าที่ดำเนินการ |
|---------|--------------|
| `/openspec:proposal` | สร้างอาร์ติแฟกต์ทั้งหมดในคราวเดียว (ข้อเสนอ, สเปค, การออกแบบ, งาน) |
| `/openspec:apply` | ดำเนินการเปลี่ยนแปลง |
| `/openspec:archive` | เก็บถาวรักษาสิ่งที่เปลี่ยนแปลง |

**เมื่อใดควรใช้คำสั่งเดิม:**
- โครงการที่มีอยู่แล้วที่ใช้เวิร์กโฟลว์เก่า
- การเปลี่ยนแปลงง่ายๆ ที่ไม่จำเป็นต้องสร้างอาร์ติแฟกต์แบบเพิ่มทีละส่วน (incremental)
- ความต้องการแนวทางแบบทั้งหมดหรือไม่มีเลย

**การย้ายไปใช้ OPSX:**
การเปลี่ยนแปลงเดิมสามารถดำเนินการต่อด้วยคำสั่ง OPSX ได้ โครงสร้างอาร์ติแฟกต์นั้นเข้ากันได้ (compatible).

---

## การแก้ไขปัญหา (Troubleshooting)

### "ไม่พบการเปลี่ยนแปลง"

คำสั่งไม่สามารถระบุได้ว่าควรดำเนินการกับการเปลี่ยนแปลงใด

**แนวทางแก้ไข:**
- ระบุชื่อการเปลี่ยนแปลงอย่างชัดเจน: `/opsx:apply add-dark-mode`
- ตรวจสอบว่าโฟลเดอร์การเปลี่ยนแปลงมีอยู่จริง: `openspec list`
- ยืนยันว่าคุณอยู่ในไดเรกทอรีโปรเจกต์ที่ถูกต้อง

### "ไม่มีอาร์ติแฟกต์พร้อมใช้งาน"

อาร์ติแฟกต์ทั้งหมดเสร็จสมบูรณ์แล้วหรือถูกบล็อกโดยการพึ่งพาที่ขาดหายไป

**แนวทางแก้ไข:**
- เรียกใช้ `openspec status --change <name>` เพื่อดูว่าอะไรกำลังบล็อกอยู่
- ตรวจสอบว่าอาร์ติแฟกต์ที่จำเป็นมีอยู่หรือไม่
- สร้างอาร์ติแฟกต์การพึ่งพาที่ขาดหายไปก่อน

### "ไม่พบ Schema"

Schema ที่ระบุไว้ไม่มีอยู่จริง

**แนวทางแก้ไข:**
- แสดงรายการ schema ที่มีอยู่: `openspec schemas`
- ตรวจสอบการสะกดชื่อ schema
- สร้าง schema หากเป็นแบบกำหนดเอง: `openspec schema init <name>`

### "ไม่รู้จักคำสั่ง"

เครื่องมือ AI ไม่สามารถรับรู้คำสั่ง OpenSpec ได้

**แนวทางแก้ไข:**
- ตรวจสอบให้แน่ใจว่าได้ทำการ initialize OpenSpec แล้ว: `openspec init`
- สร้างทักษะ (skills) ใหม่: `openspec update`
- ตรวจสอบว่าไดเรกทอรี `.claude/skills/` มีอยู่จริง (สำหรับ Claude Code)
- รีสตาร์ทเครื่องมือ AI ของคุณเพื่อรับรู้ทักษะใหม่

### "อาร์ติแฟกต์ไม่ได้ถูกสร้างขึ้นอย่างถูกต้อง"

AI สร้างอาร์ติแฟกต์ที่ไม่สมบูรณ์หรือไม่ถูกต้อง

**แนวทางแก้ไข:**
- เพิ่มบริบทของโปรเจกต์ใน `openspec/config.yaml`
- เพิ่มกฎเฉพาะสำหรับแต่ละอาร์ติแฟกต์เพื่อคำแนะนำเพิ่มเติม
- ให้รายละเอียดเพิ่มเติมในการอธิบายการเปลี่ยนแปลงของคุณ
- ใช้ `/opsx:continue` แทน `/opsx:ff` เพื่อควบคุมได้มากขึ้น

---

## ขั้นตอนต่อไป

- [Workflows](workflows.md) - รูปแบบทั่วไปและเวลาที่ควรใช้แต่ละคำสั่ง
- [CLI](cli.md) - คำสั่งเทอร์มินัลสำหรับการจัดการและการตรวจสอบความถูกต้อง
- [Customization](customization.md) - การสร้าง schema และ workflow แบบกำหนดเอง