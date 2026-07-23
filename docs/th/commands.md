# คำสั่ง

นี่คือเอกสารอ้างอิงสำหรับสแลชคำสั่งของ OpenSpec คำสั่งเหล่านี้ถูกเรียกใช้ผ่านอินเทอร์เฟซแชทของผู้ช่วยเขียนโค้ด AI ของคุณ (เช่น Claude Code, Cursor, Windsurf)

หากต้องการดูรูปแบบเวิร์กโฟลว์และเวลาที่ควรใช้แต่ละคำสั่ง โปรดดูที่ [เวิร์กโฟลว์](workflows.md) หากต้องการดูคำสั่ง CLI โปรดดูที่ [CLI](cli.md)

## อ้างอิงด่วน

### เส้นทางด่วนเริ่มต้น (โปรไฟล์ `core`)

| คำสั่ง | วัตถุประสงค์ |
|---------|---------|
| `/opsx:propose` | สร้างการเปลี่ยนแปลงและสร้างอาร์ติแฟกต์การวางแผนในขั้นตอนเดียว |
| `/opsx:explore` | คิดทบทวนไอเดียก่อนที่จะตัดสินใจดำเนินการเปลี่ยนแปลง |
| `/opsx:apply` | ดำเนินการงานที่ระบุไว้ในการเปลี่ยนแปลง |
| `/opsx:update` | แก้ไขอาร์ติแฟกต์การวางแผนของการเปลี่ยนแปลงและรักษาความสอดคล้องกันของอาร์ติแฟกต์ทั้งหมด |
| `/opsx:sync` | ผสานสเปคส่วนเปลี่ยนแปลงเข้าสู่สเปคหลัก |
| `/opsx:archive` | เก็บรวบรวมการเปลี่ยนแปลงที่เสร็จสมบูรณ์แล้ว |

### คำสั่งเวิร์กโฟลว์ขยาย (สำหรับการเลือกเวิร์กโฟลว์แบบกำหนดเอง)

| คำสั่ง | วัตถุประสงค์ |
|---------|---------|
| `/opsx:new` | เริ่มต้นโครงสร้างการเปลี่ยนแปลงใหม่ |
| `/opsx:continue` | สร้างอาร์ติแฟกต์ถัดไปตามข้อพึ่งพา |
| `/opsx:ff` | ฟาสต์ฟอร์วาร์ด: สร้างอาร์ติแฟกต์การวางแผนทั้งหมดในครั้งเดียว |
| `/opsx:verify` | ตรวจสอบความสอดคล้องระหว่างการนำไปปฏิบัติใช้และอาร์ติแฟกต์ |
| `/opsx:bulk-archive` | เก็บรวบรวมรายการเปลี่ยนแปลงหลายรายการในครั้งเดียว |
| `/opsx:onboard` | บทเรียนแนะนำที่นำคุณท่องเวิร์กโฟลว์ทั้งหมด |

โปรไฟล์ทั่วโลกเริ่มต้นคือ `core` หากต้องการเปิดใช้งานคำสั่งเวิร์กโฟลว์ขยาย ให้รัน `openspec config profile` เลือกเวิร์กโฟลว์ที่ต้องการ จากนั้นรัน `openspec update` ในโปรเจกต์ของคุณ

---

## อ้างอิงคำสั่ง

### `/opsx:propose`

สร้างการเปลี่ยนแปลงใหม่และสร้างอาร์ติแฟกต์การวางแผนในขั้นตอนเดียว นี่คือคำสั่งเริ่มต้นเริ่มต้นในโปรไฟล์ `core`

**ไวยากรณ์:**
```text
/opsx:propose [change-name-or-description]
```

**อาร์กิวเมนต์:**
| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `change-name-or-description` | ไม่ | ชื่อแบบ kebab-case หรือคำอธิบายการเปลี่ยนแปลงแบบภาษาทั่วไป |

**สิ่งที่ทำ:**
- สร้างโฟลเดอร์ `openspec/changes/<change-name>/`
- สร้างอาร์ติแฟกต์ที่จำเป็นก่อนการนำไปใช้ (สำหรับ `spec-driven`: proposal, specs, design, tasks)
- หยุดเมื่อการเปลี่ยนแปลงพร้อมสำหรับ `/opsx:apply`

**ตัวอย่าง:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**เคล็ดลับ:**
- ใช้สำหรับกระบวนการตั้งแต่เริ่มจนจบที่เร็วที่สุด
- หากคุณต้องการควบคุมอาร์ติแฟกต์ทีละขั้นตอน ให้เปิดใช้งานเวิร์กโฟลว์ขยายและใช้ `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **เริ่มต้นที่นี่หากคุณไม่แน่ใจ.** Explore เป็นพาร์ตเนอร์ในการคิดค้นที่ไม่มีความเสี่ยง: อ่านโค้ดเบสของคุณ เปรียบเทียบตัวเลือก และทำให้ความคิดที่คลาดเคลื่อนเป็นแผนที่ชัดเจนก่อนมีการเปลี่ยนแปลงใดๆ มันมาพร้อมกับโปรไฟล์เริ่มต้นเริ่มต้น สำหรับกรณีเต็มและตัวอย่างเพิ่มเติม โปรดดูที่ [สำรวจก่อน](explore.md) guide.

คิดผ่านไอเดีย ตรวจสอบปัญหา และชัดเจนข้อกำหนดก่อนที่จะยอมรับการเปลี่ยนแปลง

**ไวยากรณ์:**
```
/opsx:explore [topic]
```

**อาร์กิวเมนต์:**
| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `topic` | ไม่ | หัวข้อที่คุณต้องการสำรวจหรือตรวจสอบ |

**สิ่งที่ทำ:**
- เปิดการสนทนาสำรวจที่ไม่ต้องการโครงสร้างใดๆ
- ตรวจสอบโค้ดเบสเพื่อตอบคำถาม
- เปรียบเทียบตัวเลือกและวิธีการต่างๆ
- สร้างแผนภาพเพื่อช่วยให้ความคิดชัดเจน
- สามารถเปลี่ยนไปใช้ `/opsx:propose` (เริ่มต้นเริ่มต้น) หรือ `/opsx:new` (เวิร์กโฟลว์ขยาย) เมื่อความคิด crystallize

**ตัวอย่าง:**
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

**เคล็ดลับ:**
- ใช้เมื่อข้อกำหนดไม่ชัดเจนหรือคุณต้องการตรวจสอบ
- ไม่มีการสร้างอาร์ติแฟกต์ใดๆ ระหว่างการสำรวจ
- เหมาะสำหรับการเปรียบเทียบวิธีการหลายๆ วิธีก่อนตัดสินใจ
- สามารถอ่านไฟล์และค้นหาในโค้ดเบสได้

---

### `/opsx:new`

เริ่มต้นโครงสร้างการเปลี่ยนแปลงใหม่ สร้างโฟลเดอร์การเปลี่ยนแปลงและรอคุณสร้างอาร์ติแฟกต์ด้วย `/opsx:continue` หรือ `/opsx:ff` คำสั่งนี้เป็นส่วนหนึ่งของชุดเวิร์กโฟลว์ขยาย (ไม่ได้รวมอยู่ในโปรไฟล์ `core` เริ่มต้นเริ่มต้น)

**ไวยากรณ์:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**อาร์กิวเมนต์:**
| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `change-name` | ไม่ | ชื่อสำหรับโฟลเดอร์การเปลี่ยนแปลง (จะถูกถามหากไม่ได้ระบุ) |
| `--schema` | ไม่ | สคีมาของเวิร์กโฟลว์ที่จะใช้ (เริ่มต้นเริ่มต้น: จาก config หรือ `spec-driven`) |

**สิ่งที่ทำ:**
- สร้างโฟลเดอร์ `openspec/changes/<change-name>/`
- สร้างไฟล์เมตาดาต้า `.openspec.yaml` ในโฟลเดอร์การเปลี่ยนแปลง
- แสดงเทมเพลตอาร์ติแฟกต์แรกที่พร้อมสำหรับการสร้าง
- สอบถามชื่อการเปลี่ยนแปลงและสคีมาหากไม่ได้ระบุ

**สิ่งที่สร้าง:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**ตัวอย่าง:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**เคล็ดลับ:**
- ใช้ชื่อที่อธิบายได้: `add-feature`, `fix-bug`, `refactor-module`
- หลีกเลี่ยงชื่อทั่วไปเช่น `update`, `changes`, `wip`
- สคีมาก็สามารถตั้งค่าในคอนฟิกของโปรเจกต์ (`openspec/config.yaml`) ได้

---

### `/opsx:continue`

สร้างอาร์ติแฟกต์ถัดไปในลำดับความ 의존性 สร้างอาร์ติแฟกต์ทีละอันเพื่อความคืบหน้าเพิ่มเติม

**ไวยากรณ์:**
```
/opsx:continue [change-name]
```

**อาร์กิวเมนต์:**
| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `change-name` | ไม่ | การเปลี่ยนแปลงที่จะดำเนินการต่อ (จะคาดเดาจากบริบทหากไม่ได้ระบุ) |

**สิ่งที่ทำ:**
- สอบถามกราฟความ 의존性ของอาร์ติแฟกต์
- แสดงอาร์ติแฟกต์ที่พร้อม vs ที่ถูกบล็อก
- สร้างอาร์ติแฟกต์แรกที่พร้อม
- อ่านไฟล์ความ 의존性เพื่อบริบท
- แสดงสิ่งที่พร้อมใช้งานหลังจากสร้าง

**ตัวอย่าง:**
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

**เคล็ดลับ:**
- ใช้เมื่อคุณต้องการตรวจสอบแต่ละอาร์ติแฟกต์ก่อนดำเนินการต่อ
- เหมาะสำหรับการเปลี่ยนแปลงที่ซับซ้อนซึ่งคุณต้องการควบคุม
- อาร์ติแฟกต์หลายๆ อันอาจพร้อมใช้งานพร้อมกัน
- คุณสามารถแก้ไขอาร์ติแฟกต์ที่สร้างแล้วก่อนดำเนินการต่อได้

---

### `/opsx:ff`

กระโดดข้ามขั้นตอนการสร้างอาร์ติแฟกต์ สร้างอาร์ติแฟกต์การวางแผนทั้งหมดในครั้งเดียว

**ไวยากรณ์:**
```
/opsx:ff [change-name]
```

**อาร์กิวเมนต์:**
| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `change-name` | ไม่ | การเปลี่ยนแปลงที่จะกระโดดข้าม (จะคาดเดาจากบริบทหากไม่ได้ระบุ) |

**สิ่งที่ทำ:**
- สร้างอาร์ติแฟกต์ทั้งหมดตามลำดับความ 의존性
- ติดตามความคืบหน้าผ่านรายการสิ่งที่ต้องทำ
- หยุดเมื่ออาร์ติแฟกต์ทั้งหมดที่ต้องการ `apply-required` เสร็จสมบูรณ์
- อ่านความ 의존性แต่ละอันก่อนสร้างอาร์ติแฟกต์ถัดไป

**ตัวอย่าง:**
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

**เคล็ดลับ:**
- ใช้เมื่อคุณมีความเข้าใจที่ชัดเจนเกี่ยวกับสิ่งที่คุณกำลังสร้าง
- เร็วกว่า `/opsx:continue` สำหรับการเปลี่ยนแปลงที่เรียบง่าย
- คุณยังสามารถแก้ไขอาร์ติแฟกต์หลังจากนั้นได้
- เหมาะสำหรับฟีเจอร์ขนาดเล็กถึงกลาง

---

### `/opsx:apply`

นำงานที่ต้องทำจากการเปลี่ยนแปลงไปใช้ ทำงานผ่านรายการงาน การเขียนโค้ดและทำเครื่องหมายรายการที่เสร็จแล้ว

**ไวยากรณ์:**
```
/opsx:apply [change-name]
```

**อาร์กิวเมนต์:**
| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `change-name` | ไม่ | การเปลี่ยนแปลงที่จะนำไปใช้ (จะคาดเดาจากบริบทหากไม่ได้ระบุ) |

**สิ่งที่ทำ:**
- อ่าน `tasks.md` และระบุงานที่ยังไม่เสร็จ
- ทำงานผ่านงานทีละอัน
- เขียนโค้ด สร้างไฟล์ และรันทดสอบตามความจำเป็น
- ทำเครื่องหมายงานที่เสร็จด้วยเช็คบ็อกซ์ `[x]`

**ตัวอย่าง:**
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

**เคล็ดลับ:**
- สามารถทำงานต่อจากจุดที่คุณหยุดไว้หากมีการขัดจังหวะ
- ใช้สำหรับการเปลี่ยนแปลงแบบคู่ขนานโดยระบุชื่อการเปลี่ยนแปลง
- สถานะความสมบูรณ์ถูกติดตามในเช็คบ็อกซ์ของ `tasks.md`

---

### `/opsx:update`

แก้ไขอาร์ติแฟกต์การวางแผนที่มีอยู่ของการเปลี่ยนแปลงและทำให้สอดคล้องกัน อาร์ติแฟกต์การวางแผนเท่านั้น - จะไม่แก้ไขโค้ด

**ไวยากรณ์:**

```text
/opsx:update [change-name]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `change-name` | ไม่ | การเปลี่ยนแปลงที่จะอัปเดต (จะคาดเดาจากบริบทหากไม่ได้ระบุ) |

**สิ่งที่ทำ:**

- อ่านอาร์ติแฟกต์ของการเปลี่ยนแปลงผ่าน `openspec status --change <name> --json`
- นำการแก้ไขที่คุณขอมาใช้ หรือตรวจสอบอาร์ติแฟกต์เพื่อหาความขัดแย้งหากคุณไม่ได้ระบุ
- ปรับให้สอดคล้องกับอาร์ติแฟกต์อื่นที่มีอยู่ทิศทางใดๆ (การแก้ไขดีไซน์อาจส่งผลต่อ proposal)
- ยืนยันการแก้ไขแต่ละครั้งกับคุณก่อนเขียน ทีละอาร์ติแฟกต์
- จบด้วยการแนะนำขั้นตอนถัดไป: `/opsx:continue` (ขาดอาร์ติแฟกต์) `/opsx:apply` (นำแผนที่แก้ไขไปใช้ในโค้ด) หรือ `/opsx:archive` (เสร็จสมบูรณ์)

**ตัวอย่าง:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**เคล็ดลับ:**

- จะไม่สร้างอาร์ติแฟกต์ที่ขาด - นั่นคือหน้าที่ของ `/opsx:continue`
- หากการเปลี่ยนแปลงได้รับการนำไปใช้แล้ว ให้ติดตามด้วย `/opsx:apply` เพื่อให้โค้ดสอดคล้องกับแผนที่แก้ไข
- หากการแก้ไขของคุณเปลี่ยน *วัตถุประสงค์* ของการเปลี่ยนแปลง ให้เริ่มใหม่ด้วยการเปลี่ยนแปลงใหม่แทน (ดู [เมื่อใดควรอัปเดต vs เริ่มใหม่](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

ตรวจสอบว่าการนำไปใช้สอดคล้องกับอาร์ติแฟกต์การเปลี่ยนแปลงของคุณ ตรวจสอบความสมบูรณ์ ความถูกต้อง และความสอดคล้อง

**ไวยากรณ์:**
```
/opsx:verify [change-name]
```

**อาร์กิวเมนต์:**
| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `change-name` | ไม่ | การเปลี่ยนแปลงที่จะตรวจสอบ (จะคาดเดาจากบริบทหากไม่ได้ระบุ) |

**สิ่งที่ทำ:**
- ตรวจสอบสามมิติของคุณภาพการนำไปใช้
- ค้นหาในโค้ดเบสเพื่อหาความเป็นจริงของการนำไปใช้
- รายงานปัญหาที่จัดกลุ่มเป็น CRITICAL, WARNING หรือ SUGGESTION
- ไม่บล็อกการจัดเก็บ แต่แสดงปัญหาที่พบ

**มิติของการตรวจสอบ:**

| มิติ | สิ่งที่ตรวจสอบ |
|-----------|-------------------|
| **ความสมบูรณ์** | งานทั้งหมดเสร็จ ข้อกำหนดทั้งหมดถูกนำไปใช้ สถานการณ์ทั้งหมดถูกครอบคลุม |
| **ความถูกต้อง** | การนำไปใช้สอดคล้องกับวัตถุประสงค์ของ spec กรณีขอบถูกจัดการ |
| **ความสอดคล้อง** | การตัดสินใจเกี่ยวกับดีไซน์สะท้อนในโค้ด รูปแบบสอดคล้องกัน |

**ตัวอย่าง:**
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

**เคล็ดลับ:**
- รันก่อนจัดเก็บเพื่อจับความไม่สอดคล้องตั้งแต่เนิ่นๆ
- คำเตือนไม่บล็อกการจัดเก็บแต่บ่งบอกถึงปัญหาที่อาจเกิดขึ้น
- เหมาะสำหรับการตรวจสอบงานของ AI ก่อนส่งมอบ
- สามารถแสดงความแตกต่างระหว่างอาร์ติแฟกต์และการนำไปใช้ได้

---

### `/opsx:sync`

**คำสั่งเสริม.** ผสาน delta specs จากการเปลี่ยนแปลงเข้าไปใน specs หลัก คำสั่ง archive จะแจ้งให้ทำการ sync หาก必要性 ดังนั้นคุณมักไม่จำเป็นต้องรันคำสั่งนี้ด้วยตนเอง

**ไวยากรณ์:**
```
/opsx:sync [change-name]
```

**อาร์กิวเมนต์:**
| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `change-name` | ไม่ | การเปลี่ยนแปลงที่จะ sync (จะคาดเดาจากบริบทหากไม่ได้ระบุ) |

**สิ่งที่ทำ:**
- อ่าน delta specs จากโฟลเดอร์การเปลี่ยนแปลง
- แยกส่วน ADDED/MODIFIED/REMOVED/RENAMED
- ผสานการเปลี่ยนแปลงเข้าไปในโฟลเดอร์ `openspec/specs/` หลัก
- รักษาคอนเทนต์ที่มีอยู่ที่ไม่ถูกกล่าวถึงใน delta
- ไม่จัดเก็บการเปลี่ยนแปลง (ยังคงใช้งานอยู่)

**ตัวอย่าง:**
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

**เมื่อใดที่จะใช้ด้วยตนเอง:**

| สถานการณ์ | ใช้ sync? |
|----------|-----------|
| การเปลี่ยนแปลงที่ใช้เวลานาน ต้องการ specs ในหลักก่อนจัดเก็บ | ใช่ |
| การเปลี่ยนแปลงแบบคู่ขนานหลายๆ อันต้องการ specs พื้นฐานที่อัปเดต | ใช่ |
| ต้องการดูตัวอย่าง/ตรวจสอบการผสานแยกต่างหาก | ใช่ |
| การเปลี่ยนแปลงที่ทำได้อย่างรวดเร็ว ไปจัดเก็บโดยตรง | ไม่ (คำสั่ง archive จัดการให้) |

**เคล็ดลับ:**
- Sync ทำงานอย่างชาญฉลาด ไม่ใช่การคัดลอกวาง
- สามารถเพิ่มสถานการณ์เข้าไปในข้อกำหนดที่มีอยู่ได้โดยไม่ทำซ้ำ
- การเปลี่ยนแปลงยังคงใช้งานอยู่หลังจาก sync (ไม่ได้จัดเก็บ)
- ผู้ใช้ส่วนใหญ่ไม่จำเป็นต้องเรียกใช้โดยตรง - คำสั่ง archive จะแจ้งหากจำเป็น

---

### `/opsx:archive`

จัดเก็บการเปลี่ยนแปลงที่เสร็จสมบูรณ์ ทำให้เสร็จสมบูรณ์และย้ายไปยังโฟลเดอร์จัดเก็บ

**ไวยากรณ์:**
```
/opsx:archive [change-name]
```

**อาร์กิวเมนต์:**
| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `change-name` | ไม่ | การเปลี่ยนแปลงที่จะจัดเก็บ (จะคาดเดาจากบริบทหากไม่ได้ระบุ) |

**สิ่งที่ทำ:**
- ตรวจสอบสถานะความสมบูรณ์ของอาร์ติแฟกต์
- ตรวจสอบความสมบูรณ์ของงาน (เตือนหากยังไม่เสร็จ)
- เสนอให้ sync delta specs หากยังไม่ได้ sync
- ย้ายโฟลเดอร์การเปลี่ยนแปลงไปยัง `openspec/changes/archive/YYYY-MM-DD-<name>/`
- รักษาอาร์ติแฟกต์ทั้งหมดเพื่อการตรวจสอบย้อนหลัง

**ตัวอย่าง:**
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

**เคล็ดลับ:**
- การจัดเก็บจะไม่บล็อกหากงานยังไม่เสร็จ แต่จะเตือน
- delta specs สามารถ sync ระหว่างการจัดเก็บหรือก่อนหน้าได้
- การเปลี่ยนแปลงที่จัดเก็บจะถูกรักษาสำหรับประวัติศาสตร์
- ใช้ `/opsx:verify` ก่อนเพื่อจับปัญหา

---

### `/opsx:bulk-archive`

จัดเก็บการเปลี่ยนแปลงที่เสร็จสมบูรณ์หลายๆ อันในครั้งเดียว จัดการกับความขัดแย้งของ spec ระหว่างการเปลี่ยนแปลง

**ไวยากรณ์:**
```
/opsx:bulk-archive [change-names...]
```

**อาร์กิวเมนต์:**
| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `change-names` | ไม่ | การเปลี่ยนแปลงเฉพาะที่จะจัดเก็บ (จะถามให้เลือกหากไม่ได้ระบุ) |

**สิ่งที่ทำ:**
- แสดงรายการการเปลี่ยนแปลงที่เสร็จสมบูรณ์ทั้งหมด
- ตรวจสอบความถูกต้องของแต่ละการเปลี่ยนแปลงก่อนจัดเก็บ
- ตรวจพบความขัดแย้งของ spec ระหว่างการเปลี่ยนแปลง
- แก้ไขความขัดแย้งโดยตรวจสอบสิ่งที่ถูกนำไปใช้จริง
- จัดเก็บตามลำดับเวลา

**ตัวอย่าง:**
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

**เคล็ดลับ:**
- เหมาะสำหรับสตรีมงานแบบคู่ขนาน
- การแก้ไขความขัดแย้งทำงานเอง (ตรวจสอบโค้ดเบส)
- การเปลี่ยนแปลงถูกจัดเก็บตามลำดับการสร้าง
- แจ้งเตือนก่อนเขียนทับคอนเทนต์ของ spec

---

### `/opsx:onboard`

การแนะนำใช้งานที่นำไปใช้ผ่านเวิร์กโฟลว์ OpenSpec เต็มรูปแบบ เป็นบทเรียนแบบโต้ตอบที่ใช้โค้ดเบสจริงของคุณ

**ไวยากรณ์:**
```
/opsx:onboard
```

**สิ่งที่ทำ:**
- เดินผ่านรอบเวิร์กโฟลว์เต็มรูปแบบพร้อมคำอธิบาย
- สแกนโค้ดเบสของคุณเพื่อหาความโอกาสปรับปรุงจริง
- สร้างการเปลี่ยนแปลงจริงพร้อมอาร์ติแฟกต์จริง
- นำงานจริงไปใช้ (การเปลี่ยนแปลงเล็ก ปลอดภัย)
- จัดเก็บการเปลี่ยนแปลงที่เสร็จสมบูรณ์
- อธิบายแต่ละขั้นตอนเมื่อเกิด

**ขั้นตอน:**
1. ยินดีต้อนรับและวิเคราะห์โค้ดเบส
2. ค้นหาความโอกาสปรับปรุง
3. สร้างการเปลี่ยนแปลง (`/opsx:new`)
4. เขียน proposal
5. สร้าง specs
6. เขียน design
7. สร้าง tasks
8. นำงานไปใช้ (`/opsx:apply`)
9. ตรวจสอบการนำไปใช้
10. จัดเก็บการเปลี่ยนแปลง
11. สรุปและขั้นตอนต่อไป

**ตัวอย่าง:**
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

**เคล็ดลับ:**
- เหมาะสำหรับผู้ใช้ใหม่ที่กำลังเรียนรู้เวิร์กโฟลว์
- ใช้โค้ดจริง ไม่ใช่ตัวอย่างจำลอง
- สร้างการเปลี่ยนแปลงจริงที่คุณสามารถเก็บไว้หรือลบทิ้งได้
- ใช้เวลา 15-30 นาทีเพื่อเสร็จสมบูรณ์

## ไวยากรณ์คำสั่งตามเครื่องมือ AI

เครื่องมือ AI ต่างๆใช้ไวยากรณ์คำสั่งที่แตกต่างกันเล็กน้อย ใช้รูปแบบที่ตรงกับเครื่องมือของคุณ:

| เครื่องมือ | ตัวอย่างไวยากรณ์ |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | เรียกใช้ตามสกิล เช่น `/openspec-propose`, `/openspec-apply-change` (ไม่มีการสร้างไฟล์คำสั่ง `opsx-*` ที่สร้างโดยอัตโนมัติ) |
| Codex | เรียกใช้ตามสกิลจาก `.codex/skills/openspec-*` (ไม่มีการสร้างไฟล์พรอมต์ `opsx-*` ที่สร้างโดยอัตโนมัติ) |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | เรียกใช้ตามสกิล เช่น `/skill:openspec-propose`, `/skill:openspec-apply-change` (ไม่มีการสร้างไฟล์คำสั่ง `opsx-*` ที่สร้างโดยอัตโนมัติ) |
| Trae | `/opsx-propose`, `/opsx-apply` |

จุดประสงค์เหมือนกันในทุกเครื่องมือ แต่วิธีการแสดงคำสั่งอาจแตกต่างกันไปตามการบูรณาการ

> **หมายเหตุ:** คำสั่ง GitHub Copilot (`.github/prompts/*.prompt.md`) มีให้ใช้ได้เฉพาะในส่วนขยาย IDE (VS Code, JetBrains, Visual Studio) เท่านั้น GitHub Copilot CLI ปัจจุบันยังไม่รองรับไฟล์พรอมต์ที่กำหนดเอง — ดูรายละเอียดและวิธีแก้ปัญหาเพิ่มเติมที่ [เครื่องมือที่รองรับ](supported-tools.md)

---

## คำสั่งรุ่นเก่า

คำสั่งเหล่านี้ใช้เวิร์กโฟลว์ "ทำทั้งหมดพร้อมกัน" รุ่นเก่า พวกเขายังใช้งานได้อยู่ แต่แนะนำให้ใช้คำสั่ง OPSX แทน

| คำสั่ง | หน้าที่การทำงาน |
|---------|--------------|
| `/openspec:proposal` | สร้างอาร์ติแฟกต์ทั้งหมดพร้อมกัน (ข้อเสนอ, สเปค, การออกแบบ, งานที่ต้องทำ) |
| `/openspec:apply` | นำการเปลี่ยนแปลงไปใช้จริง |
| `/openspec:archive` | เก็บถาวรการเปลี่ยนแปลง |

**กรณีที่ควรใช้คำสั่งรุ่นเก่า:**
- โปรเจกต์ที่มีอยู่แล้วที่ใช้เวิร์กโฟลว์รุ่นเก่า
- การเปลี่ยนแปลงที่ง่าย ไม่จำเป็นต้องสร้างอาร์ติแฟกต์ทีละส่วน
- ต้องการใช้แนวทางการทำงานทั้งหมดหรือไม่ก็ไม่ทำ

**การย้ายไปใช้ OPSX:**
การเปลี่ยนแปลงรุ่นเก่าสามารถดำเนินการต่อได้ด้วยคำสั่ง OPSX โครงสร้างอาร์ติแฟกต์เข้ากันได้

---

## การแก้ปัญหา

### "Change not found"

คำสั่งไม่สามารถระบุได้ว่าควรทำงานกับการเปลี่ยนแปลงรายใด

**วิธีแก้:**
- ระบุชื่อการเปลี่ยนแปลงอย่างชัดเจน: `/opsx:apply add-dark-mode`
- ตรวจสอบว่าโฟลเดอร์การเปลี่ยนแปลงมีอยู่: `openspec list`
- ตรวจสอบว่าคุณอยู่ในไดเรกทอรีโปรเจกต์ที่ถูกต้อง

### "No artifacts ready"

อาร์ติแฟกต์ทั้งหมดเสร็จสมบูรณ์หรือถูกบล็อกเนื่องจากขาด dependencies ที่จำเป็น

**วิธีแก้:**
- รันคำสั่ง `openspec status --change <name>` เพื่อดูสิ่งที่กำลังบล็อกอยู่
- ตรวจสอบว่าอาร์ติแฟกต์ที่จำเป็นมีอยู่หรือไม่
- สร้างอาร์ติแฟกต์ dependencies ที่ขาดหายไปก่อน

### "Schema not found"

สคีมาที่ระบุไม่มีอยู่

**วิธีแก้:**
- รายการสคีมาที่มีอยู่: `openspec schemas`
- ตรวจสอบการสะกดชื่อของสคีมา
- สร้างสคีมาเองหากเป็นสคีกำหนดเอง: `openspec schema init <name>`

### คำสั่งไม่ถูกรู้จัก

เครื่องมือ AI ไม่รู้จักคำสั่งของ OpenSpec

**วิธีแก้:**
- ตรวจสอบว่า OpenSpec ได้ถูกเริ่มต้นแล้ว: `openspec init`
- สร้างสกิลใหม่: `openspec update`
- ตรวจสอบว่าไดเรกทอรี `.claude/skills/` มีอยู่ (สำหรับ Claude Code)
- รีสตาร์ทเครื่องมือ AI ของคุณเพื่อโหลดสกิลใหม่

### อาร์ติแฟกต์ไม่ถูกสร้างอย่างถูกต้อง

AI สร้างอาร์ติแฟกต์ที่ไม่สมบูรณ์หรือไม่ถูกต้อง

**วิธีแก้:**
- เพิ่มบริบทของโปรเจกต์ใน `openspec/config.yaml`
- เพิ่มกฎสำหรับแต่ละอาร์ติแฟกต์เพื่อคำแนะนำเฉพาะ
- ให้รายละเอียดเพิ่มเติมในคำอธิบายการเปลี่ยนแปลงของคุณ
- ใช้ `/opsx:continue` แทน `/opsx:ff` เพื่อควบคุมได้มากขึ้น

---

## ขั้นตอนต่อไป

- [เวิร์กโฟลว์](workflows.md) - รูปแบบทั่วไปและเวลาที่ควรใช้แต่ละคำสั่ง
- [CLI](cli.md) - คำสั่งเทอร์มินัลสำหรับการจัดการและการตรวจสอบความถูกต้อง
- [การปรับแต่งเอง](customization.md) - สร้างสคีมาและเวิร์กโฟลว์ที่กำหนดเอง