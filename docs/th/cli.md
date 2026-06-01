# อ้างอิง CLI

OpenSpec CLI (`openspec`) ให้คำสั่งเทอร์มินัลสำหรับการตั้งค่าโปรเจกต์ การตรวจสอบสถานะ และการจัดการ คำสั่งเหล่านี้เป็นส่วนเสริมจากคำสั่ง AI slash (เช่น `/opsx:propose`) ที่ถูกบันทึกไว้ใน [Commands](commands.md)

## สรุป

| หมวดหมู่ | คำสั่ง | วัตถุประสงค์ |
|----------|----------|---------|
| **Setup** | `init`, `update` | เริ่มต้นและอัปเดต OpenSpec ในโปรเจกต์ของคุณ |
| **Workspaces (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | ตั้งค่ามุมมองท้องถิ่นบน repos หรือโฟลเดอร์ที่เชื่อมโยง |
| **Shared context (beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | จัดการการลงทะเบียน context-store ท้องถิ่นและบริบท initative ที่คงทน |
| **Browsing** | `list`, `view`, `show` | สำรวจการเปลี่ยนแปลงและข้อมูลจำเพาะ |
| **Validation** | `validate` | ตรวจสอบการเปลี่ยนแปลงและข้อมูลจำเพาะเพื่อหาปัญหา |
| **Lifecycle** | `archive` | สรุปการเปลี่ยนแปลงที่เสร็จสมบูรณ์ |
| **Workflow** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | การสนับสนุนเวิร์กโฟลว์ที่ขับเคลื่อนด้วยสิ่งประดิษฐ์ |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | สร้างและจัดการเวิร์กโฟลว์ที่กำหนดเอง |
| **Config** | `config` | ดูและแก้ไขการตั้งค่า |
| **Utility** | `feedback`, `completion` | การให้ข้อเสนอแนะและการผสานรวมกับ shell |

---

## คำสั่งแบบมนุษย์กับตัวแทน

คำสั่ง CLI ส่วนใหญ่ถูกออกแบบมาสำหรับ**การใช้งานของมนุษย์**ในเทอร์มินัล คำสั่งบางส่วนยังสนับสนุน**การใช้งานโดยตัวแทน/สคริปต์**ผ่านผลลัพธ์แบบ JSON

### คำสั่งสำหรับมนุษย์เท่านั้น

คำสั่งเหล่านี้เป็นแบบโต้ตอบและออกแบบมาสำหรับใช้งานในเทอร์มินัล:

| คำสั่ง | วัตถุประสงค์ |
|---------|---------|
| `openspec init` | เริ่มต้นโปรเจกต์ (พร้อมพรอมป์โต้ตอบ) |
| `openspec view` | แดชบอร์ดแบบโต้ตอบ |
| `openspec config edit` | เปิดไฟล์ config ในตัวแก้ไข |
| `openspec feedback` | ส่งความคิดเห็นผ่าน GitHub |
| `openspec completion install` | ติดตั้ง shell completions |

### คำสั่งที่รองรับตัวแทน

คำสั่งเหล่านี้รองรับผลลัพธ์แบบ `--json` สำหรับการใช้งานแบบโปรแกรมโดยตัวแทน AI และสคริปต์:

| คำสั่ง | การใช้งานโดยมนุษย์ | การใช้งานโดยตัวแทน |
|---------|-----------|-----------|
| `openspec list` | เรียกดู changes/specs | `--json` สำหรับข้อมูลแบบโครงสร้าง |
| `openspec show <item>` | อ่านเนื้อหา | `--json` สำหรับการแยกวิเคราะห์ |
| `openspec validate` | ตรวจสอบปัญหา | `--all --json` สำหรับการตรวจสอบจำนวนมาก |
| `openspec status` | ดูความคืบหน้าของ artifact | `--json` สำหรับสถานะแบบโครงสร้าง |
| `openspec instructions` | รับขั้นตอนถัดไป | `--json` สำหรับคำสั่งตัวแทน |
| `openspec templates` | ค้นหาเส้นทางเทมเพลต | `--json` สำหรับการหาเส้นทาง |
| `openspec schemas` | รายการ schemas ที่มี | `--json` สำหรับการค้นหา schema |
| `openspec workspace setup --no-interactive` | สร้าง workspace ด้วยอินพุตที่ระบุชัด | `--json` สำหรับผลลัพธ์การตั้งค่าแบบโครงสร้าง |
| `openspec workspace list` | เรียกดู workspaces ที่รู้จัก | `--json` สำหรับวัตถุ workspace แบบระบุประเภท |
| `openspec workspace link` | เชื่อมโยง repo หรือโฟลเดอร์ | `--json` สำหรับผลลัพธ์การเชื่อมโยงแบบโครงสร้าง |
| `openspec workspace relink` | ซ่อมแซมเส้นทางที่เชื่อมโยง | `--json` สำหรับผลลัพธ์การเชื่อมโยงแบบโครงสร้าง |
| `openspec workspace doctor` | ตรวจสอบ workspace หนึ่ง | `--json` สำหรับผลลัพธ์สถานะแบบโครงสร้าง |
| `openspec workspace update` | รีเฟรชคำแนะนำเฉพาะ workspace และทักษะตัวแทน | `--tools` เลือกตัวแทน; profile เลือกเวิร์กโฟลว์ |
| `openspec context-store setup <id>` | สร้าง context store ในเครื่อง | `--json` พร้อมอินพุตที่ระบุชัดสำหรับผลลัพธ์การตั้งค่าแบบโครงสร้าง |
| `openspec context-store register <path>` | ลงทะเบียน context store ที่มีอยู่ | `--json` สำหรับผลลัพธ์การลงทะเบียนแบบโครงสร้าง |
| `openspec context-store unregister <id>` | ลบการลงทะเบียน context store ในเครื่อง | `--json` สำหรับผลลัพธ์การล้างข้อมูลแบบโครงสร้าง |
| `openspec context-store remove <id>` | ลบโฟลเดอร์ context store ในเครื่องที่ลงทะเบียน | `--yes --json` สำหรับการลบแบบไม่โต้ตอบ |
| `openspec context-store list` | เรียกดู context stores ที่ลงทะเบียน | `--json` สำหรับผลลัพธ์การลงทะเบียนแบบโครงสร้าง |
| `openspec context-store doctor` | ตรวจสอบการตั้งค่า store ในเครื่อง | `--json` สำหรับผลลัพธ์การวินิจฉัยแบบโครงสร้าง |
| `openspec initiative list` | เรียดู initiatives ที่ใช้ร่วมกัน | `--json` สำหรับบันทึก initiative แบบโครงสร้าง |
| `openspec initiative show <id>` | แก้ไข initiative | `--json` สำหรับเส้นทาง canonical และ metadata |
| `openspec new change <id>` | สร้าง change scaffolding ที่ระดับ repo | `--json`, บวก `--initiative` สำหรับลิงก์การประสานงานร่วม |
| `opspec set change <id>` | อัปเดต metadata change ที่เช็คอินแล้ว | `--json`, บวก `--initiative` สำหรับลิงก์การประสานงานร่วม |

---

## ตัวเลือกทั่วไป

ตัวเลือกเหล่านี้ใช้ได้กับทุกคำสั่ง:

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--version`, `-V` | แสดงหมายเลขเวอร์ชัน |
| `--no-color` | ปิดการแสดงผลสี |
| `--help`, `-h` | แสดงความช่วยเหลือสำหรับคำสั่ง |

---

## คำสั่งตั้งค่าเริ่มต้น

### `openspec init`

เริ่มต้น OpenSpec ในโปรเจกต์ของคุณ สร้างโครงสร้างโฟลเดอร์และกำหนดค่าการผสานรวมเครื่องมือ AI

พฤติกรรมเริ่มต้นใช้ค่าเริ่มต้นของ config ทั่วไป: profile `core`, delivery `both`, workflows `propose, explore, apply, sync, archive`

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
| `--tools <list>` | กำหนดค่าเครื่องมือ AI แบบไม่โต้ตอบ ใช้ `all`, `none`, หรือรายการคั่นด้วยจุลภาค |
| `--force` | ล้างไฟล์รุ่นเก่าโดยอัตโนมัติโดยไม่ถาม |
| `--profile <profile>` | แทนที่ profile ทั่วไปสำหรับการเรียก init นี้ (`core` หรือ `custom`) |

`--profile custom` ใช้เวิร์กโฟลว์ที่เลือกไว้ปัจจุบันใน config ทั่วไป (`openspec config profile`)

**รหัสเครื่องมือที่รองรับ (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

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

# แทนที่ profile สำหรับการเรียกนี้
openspec init --profile core

# ข้ามพรอมป์และล้างไฟล์รุ่นเก่าโดยอัตโนมัติ
openspec init --force
```

**สิ่งที่สร้าง:**

```
openspec/
├── specs/              # ข้อกำหนดของคุณ (แหล่งข้อมูลที่แท้จริง)
├── changes/            # การเปลี่ยนแปลงที่เสนอ
└── config.yaml         # การกำหนดค่าโปรเจกต์

.claude/skills/         # ทักษะ Claude Code (ถ้าเลือก claude)
.cursor/skills/         # ทักษะ Cursor (ถ้าเลือก cursor)
.cursor/commands/       # คำสั่ง OPSX ของ Cursor (ถ้า delivery รวม commands)
... (การกำหนดค่าเครื่องมืออื่นๆ)
```

---

### `openspec update`

อัปเดตไฟล์คำแนะนำของ OpenSpec หลังจากอัปเกรด CLI สร้างไฟล์การกำหนดค่าเครื่องมือ AI ใหม่โดยใช้ profile ทั่วไปปัจจุบัน, เวิร์กโฟลว์ที่เลือก และโหมด delivery ของคุณ

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
| `--force` | บังคับอัปเดตแม้ว่าไฟล์จะเป็นปัจจุบันแล้ว |

**ตัวอย่าง:**

```bash
# อัปเดตไฟล์คำแนะนำหลังจากอัปเกรด npm
npm update @fission-ai/openspec
openspec update
```

---

## คำสั่ง Workspace

คำสั่ง Workspace อยู่ในขั้นเบต้า โมเดลท้องถิ่นด้านล่างเป็นทิศทางปัจจุบัน แต่ระบบอัตโนมัติภายนอก, การผสานรวม และเวิร์กโฟลว์ที่ทำงานยาวนาน ควรยังคงพิจารณาพฤติกรรมคำสั่ง, ไฟล์สถานะ และผลลัพธ์ JSON ว่ากำลังพัฒนา

Workspace สำหรับการประสานงานเป็นมุมมองท้องถิ่นของเครื่องสำหรับ repos หรือโฟลเดอร์ที่เชื่อมโยง ความชัดเจนของ workspace ไม่ใช่การยอมรับการเปลี่ยนแปลง: เชื่อมโยง repos หรือโฟลเดอร์ที่ OpenSpec ควรรู้ แล้วสร้างการเปลี่ยนแปลงเมื่อคุณพร้อมที่จะวางแผนงานเฉพาะ

### `openspec workspace setup`

สร้าง workspace ในตำแหน่ง workspace มาตรฐานของ OpenSpec และเชื่อมโยงอย่างน้อยหนึ่ง repo หรือโฟลเดอร์ที่มีอยู่

```bash
opspec workspace setup [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--name <name>` | ชื่อ workspace ชื่อต้องอยู่ในรูปแบบ kebab-case |
| `--link <path>` | เชื่อมโยง repo หรือโฟลเดอร์ที่มีอยู่และอนุมานชื่อจากชื่อโฟลเดอร์ |
| `--link <name>=<path>` | เชื่อมโยง repo หรือโฟลเดอร์ที่มีอยู่พร้อมชื่อที่ระบุชัด |
| `--opener <id>` | บันทึก opener ที่ต้องการระหว่างการตั้งค่าแบบไม่โต้ตอบ: `codex-cli`, `claude`, `github-copilot`, หรือ `editor` |
| `--tools <tools>` | ติดตั้งทักษะ OpenSpec เฉพาะ workspace สำหรับตัวแทน ใช้ `all`, `none`, หรือรหัสเครื่องมือคั่นด้วยจุลภาค |
| `--no-interactive` | ปิดพรอมป์; ต้องการ `--name` และอย่างน้อยหนึ่ง `--link` |
| `--json` | ผลลัพธ์ JSON; ต้องการ `--no-interactive` |

**ตัวอย่าง:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

การตั้งค่าแบบโต้ตอบจะถามหา opener ที่ต้องการและสามารถติดตั้งทักษะ OpenSpec เฉพาะ workspace สำหรับตัวแทนที่เลือกได้ การตั้งค่าแบบไม่โต้ตอบจะบันทึก opener ที่ต้องการเฉพาะเมื่อระบุ `--opener`; มิฉะนั้น `workspace open` จะพรอมป์ในภายหลังในเทอร์มินัลแบบโต้ตอบเมื่อ opener ที่รองรับพร้อมใช้งาน หรือถามสคริปต์ให้ส่ง `--agent <tool>` หรือ `--editor`

การติดตั้งทักษะ workspace เป็นเฉพาะทักษะในช่วงเบต้านี้: แม้ว่า delivery ทั่วไปจะเป็น `commands` หรือ `both` การตั้งค่า workspace จะเขียนโฟลเดอร์ทักษะตัวแทนในรากของ workspace และไม่สร้างไฟล์คำสั่งแบบ slash profile ทั่วไปที่ใช้งานอยู่จะเลือกว่าทักษะเวิร์กโฟลว์ใดถูกติดตั้ง; `--tools` เลือกว่าตัวแทนใดได้รับ หากไม่ระบุ `--tools` ในการตั้งค่าแบบไม่โต้ตอบ จะไม่มีการติดตั้งทักษะและ `workspace update --tools <ids>` สามารถเพิ่มได้ในภายหลัง

### `opspec workspace list`

แสดงรายการ workspaces ที่รู้จักของ OpenSpec จาก registry ท้องถิ่น

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

รายการแสดงตำแหน่งของแต่ละ workspace และ repos หรือโฟลเดอร์ที่เชื่อมโยง บันทึก registry ที่ล้าสมัยจะถูกรายงานแต่ไม่ถูกเปลี่ยนแปลง

### `opspec workspace link`

บันทึก repo หรือโฟลเดอร์ที่มีอยู่สำหรับ workspace หนึ่ง

```bash
openspec workspace link [name] <path> [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--workspace <name>` | เลือก workspace ที่รู้จักจาก registry ท้องถิ่น |
| `--json` | ผลลัพธ์ JSON |
| `--no-interactive` | ปิดพรอมป์เลือก workspace |

**ตัวอย่าง:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

เส้นทางต้องมีอยู่แล้ว เส้นทางสัมพัทธ์จะถูกแก้ไขโดยอ้างอิงไดเรกทอรีปัจจุบันของคำสั่งก่อนที่ OpenSpec จะเก็บเส้นทางสัมบูรณ์ที่ตรวจสอบแล้วในสถานะ workspace ท้องถิ่นของเครื่อง เส้นทางที่เชื่อมโยงสามารถเป็น repos, packages, services, apps หรือโฟลเดอร์ที่ไม่มีสถานะ `openspec/` ระดับ repo ได้

### `opspec workspace relink`

ซ่อมแซมหรือเปลี่ยนเส้นทางท้องถิ่นสำหรับลิงก์ที่มีอยู่

```bash
openspec workspace relink <name> <path> [options]
```

เส้นทางต้องมีอยู่แล้ว Relink อัปเดตเฉพาะเส้นทางท้องถิ่นของเครื่องสำหรับชื่อลิงก์ที่เสถียร

### `opspec workspace doctor`

ตรวจสอบว่า workspace หนึ่งสามารถแก้ไขอะไรได้บ้างบนเครื่องปัจจุบัน

```bash
openspec workspace doctor [options]
```

Doctor แสดงตำแหน่ง workspace, repos หรือโฟลเดอร์ที่เชื่อมโยง, เส้นทางที่ขาดหายไป, เส้นทาง specs ระดับ repo เมื่อมี, และคำแนะนำการแก้ไข ผลลัพธ์ JSON ยังรวมเส้นทางการวางแผน workspace เพื่อความเข้ากันได้ มันรายงานปัญหาเท่านั้น; ไม่ซ่อมแซมโดยอัตโนมัติ

คำสั่งที่ต้องการ workspace หนึ่งใช้ workspace ปัจจุบันเมื่อรันจากภายในโฟลเดอร์หรือไดเรกทอรีย่อยของ workspace จากที่อื่น ให้ส่ง `--workspace <name>`, เลือกจากตัวเลือกในเทอร์มินัลแบบโต้ตอบ หรือพึ่งพา workspace ที่รู้จักเพียงแห่งเดียวเมื่อมีเพียงแห่งเดียว ในโหมด `--json` หรือ `--no-interactive` การเลือกที่กำกวมจะล้มเหลวด้วยข้อผิดพลาดสถานะแบบโครงสร้างและแนะนำ `--workspace <name>`

การตอบสนอง JSON ใช้วัตถุแบบระบุประเภทบวกอาร์เรย์ `status` ข้อมูลหลักอยู่ใน `workspace`, `workspaces` หรือ `link`; คำเตือนและข้อผิดพลาดอยู่ใน `status`

### `opspec workspace update`

รีเฟรชคำแนะนำและทักษะตัวแทนเฉพาะ workspace ของ OpenSpec

```bash
openspec workspace update [name] [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--workspace <name>` | เลือก workspace ที่รู้จักจาก registry ท้องถิ่น |
| `--tools <tools>` | เลือกตัวแทนสำหรับทักษะ workspace ใช้ `all`, `none`, หรือรหัสเครื่องมือคั่นด้วยจุลภาค |
| `--json` | ผลลัพธ์ JSON |
| `--no-interactive` | ปิดพรอมป์เลือก workspace |

**ตัวอย่าง:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` รีเฟรชบล็อกคำแนะนำ workspace ที่สร้างขึ้นและพื้นผิวเปิดท้องถิ่น สำหรับทักษะตัวแทน มันใช้ตัวเลือกตัวแทนทักษะ workspace ที่เก็บไว้เมื่อไม่ระบุ `--tools` การส่ง `--tools` จะแทนที่ตัวเลือกที่เก็บไว้นั้น มันรีเฟรชเฉพาะไดเรกทอรีทักษะเวิร์กโฟลว์ที่จัดการโดย OpenSpec ในราก workspace, ลบทักษะเวิร์กโฟลว์ที่จัดการซึ่งไม่ถูกเลือก และไม่แตะต้อง repos และโฟลเดอร์ที่เชื่อมโยง

การรัน `openspec update` จากภายใน workspace จะเปลี่ยนเส้นทางไปยัง `opspec workspace update`; รัน `openspec update` ภายในโปรเจกต์ระดับ repo เมื่อคุณต้องการอัปเดตไฟล์เครื่องมือที่ repo เป็นเจ้าของ

### `opspec workspace open`

เปิดชุดงาน workspace ผ่าน opener ที่ต้องการที่เก็บไว้, การแทนที่ตัวแทนแบบช่วงเดียว หรือโหมดตัวแก้ไข VS Code

```bash
openspec workspace open [name] [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--workspace <name>` | ชื่อแทนตำแหน่ง workspace |
| `--initiative <id>` | เปิด initiative เป็นมุมมอง workspace ท้องถิ่น รับ `<id>` หรือ `<store>/<id>` |
| `--store <id>` | รหัส context store ที่ลงทะเบียนสำหรับ `--initiative` |
| `--store-path <path>` | ราก context store ท้องถิ่นที่มีอยู่สำหรับ `--initiative` |
| `--agent <tool>` | การแทนที่ตัวแทนช่วงเดียว: `codex-cli`, `claude`, หรือ `github-copilot` |
| `--editor` | เปิดไฟล์ workspace VS Code ที่ดูแลรักษาเป็น workspace ตัวแก้ไขปกติ |
| `--no-interactive` | ปิดพรอมป์เลือก workspace และ opener |

**ตัวอย่าง:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` ใช้ workspace ปัจจุบันเมื่อรันจากภายในหนึ่ง, เลือกอัตโนมัติ workspace ที่รู้จักเพียงแห่งเดียวเมื่อรันจากที่อื่น, และถามผู้ใช้ให้เลือกเมื่อมีหลาย workspaces ที่รู้จัก `--agent` และ `--editor` ไม่เปลี่ยน opener ที่ต้องการที่เก็บไว้ การส่งตัวแทนที่เปิดทั้งสองเป็นข้อผิดพลาด; เลือกอย่างใดอย่างหนึ่ง `--agent <tool>` หรือ `--editor`

เมื่อใช้ `--initiative` OpenSpec จะเตรียมหรือเลือกมุมมอง workspace ท้องถิ่นส่วนตัวสำหรับ initiative นั้น ร้านค้าที่เลือกจาก registry จะถูกเก็บโดยรหัส; `--store-path` เก็บตัวเลือกเส้นทาง runtime-local เนื่องจากมุมมอง workspace เป็นสถานะท้องถิ่นส่วนตัว

OpenSpec ดูแลรักษา `<workspace-name>.code-workspace` ที่ราก workspace สำหรับ VS Code editor และ GitHub Copilot-in-VS-Code opens ไฟล์นั้นเป็นสถานะมุมมอง workspace ท้องถิ่นของเครื่อง

workspace VS Code ที่ดูแลรักษาจะแสดง repos หรือโฟลเดอร์ที่เชื่อมโยงที่ถูกต้องก่อน จากนั้นบริบท initiative เมื่อแนบ จากนั้นไฟล์ workspace ของ OpenSpec VS Code แสดงรายการเหล่านั้นเป็น workspace หลายราก

การเปิด workspace จากรากทำให้ repos หรือโฟลเดอร์ที่เชื่อมโยงมองเห็นได้สำหรับการสำรวจและบริบท การแก้ไขการนำไปใช้ควรเริ่มต้นหลังจากคำขอของผู้ใช้ที่ชัดเจนและเวิร์กโฟลว์การนำไปใช้ OpenSpec ปกติเท่านั้น

## คำสั่ง Shared Context

Context stores และ initiatives เป็นพื้นที่สำหรับการประสานงานแบบเบต้า Context store คือการลงทะเบียนภายในเครื่องสำหรับ shared context ที่คงทน ซึ่งโดยทั่วไปจะเป็นโฟลเดอร์ที่รองรับด้วย Git หรือ clone ส่วน initiative คือบริบทการประสานงานร่วมกันภายใน context store การเปลี่ยนแปลงภายใน repo สามารถเชื่อมโยงกับ initiative ได้โดยไม่ต้องคัดลอกแผนร่วมเข้าไปในทุก repo

### `openspec context-store setup`

สร้างและลงทะเบียน context store ภายในเครื่อง หากไม่มีอาร์กิวเมนต์ในเทอร์มินัล
OpenSpec จะแนะนำผู้ใช้ตลอดขั้นตอนการตั้งค่า Agent และสคริปต์ควรส่งข้อมูลอินพุตอย่างชัดเจนและใช้ `--json`

```bash
openspec context-store setup [id] [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--path <path>` | พาธของโฟลเดอร์ context store; จะใช้ค่าเริ่มต้นจากไดเรกทอรีข้อมูลภายในเครื่องที่ OpenSpec จัดการ |
| `--init-git` | เริ่มต้น Git repository ใน context store |
| `--no-init-git` | ไม่เริ่มต้น Git repository |
| `--json` | แสดงผลลัพธ์เป็น JSON |

เมื่อไม่ได้ระบุ `--path` การตั้งค่าจะสร้าง store ภายใต้ `getGlobalDataDir()/context-stores/<id>`: `$XDG_DATA_HOME/openspec/context-stores/<id>` เมื่อมีการตั้งค่า `XDG_DATA_HOME` หรือ `~/.local/share/openspec/context-stores/<id>` ในกรณี fallback แบบ Unix-style ใช้ `--path` เมื่อคุณต้องการให้ store อยู่ใน clone ที่มองเห็นได้หรือโฟลเดอร์เฉพาะสำหรับทีม

ตัวอย่าง:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

ลงทะเบียนโฟลเดอร์ context store ภายในเครื่องที่มีอยู่

```bash
openspec context-store register [path] [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--id <id>` | รหัส context store; จะใช้ค่าเริ่มต้นจาก metadata ของ store หรือชื่อโฟลเดอร์ |
| `--json` | แสดงผลลัพธ์เป็น JSON |

### `openspec context-store unregister`

ลบการลงทะเบียน context store ภายในเครื่องโดยไม่ลบไฟล์

```bash
openspec context-store unregister <id> [--json]
```

ใช้คำสั่งนี้เมื่อ store ถูกย้าย, clone ไปที่อื่น หรือไม่ต้องการแสดงโดย OpenSpec บนเครื่องนี้อีกต่อไป

### `openspec context-store remove`

ลบการลงทะเบียน context store ภายในเครื่องและลบโฟลเดอร์ภายในเครื่องของมัน

```bash
openspec context-store remove <id> [--yes] [--json]
```

คำสั่ง `remove` จะแสดงโฟลเดอร์ที่แน่นอนก่อนลบในเทอร์มินัลแบบโต้ตอบ Agent, สคริปต์ และผู้เรียก JSON ต้องส่ง `--yes` เพื่อยืนยันการลบ
OpenSpec จะปฏิเสธการลบโฟลเดอร์ที่ไม่มี metadata ของ context store ที่ตรงกัน

### `openspec context-store list`

แสดงรายการ context store ที่ลงทะเบียนภายในเครื่อง

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

ตรวจสอบการลงทะเบียน, metadata และสถานะ Git ของ context store ภายในเครื่อง

```bash
openspec context-store doctor [id] [--json]
```

Doctor เป็นเพียงเครื่องมือวินิจฉัยเท่านั้น มันจะรายงานรากฐานที่หายไป, metadata ที่ไม่ตรงกัน และสถานะรีจิสทรีภายในเครื่องที่ไม่ถูกต้องโดยไม่แก้ไข store

### `openspec initiative create`

สร้าง initiative ใน context store

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--store <id>` | รหัส context store จากรีจิสทรีภายในเครื่อง |
| `--store-path <path>` | รากของ context store ภายในเครื่องที่มีอยู่ |
| `--title <title>` | ชื่อ initiative |
| `--summary <summary>` | สรุป initiative |
| `--json` | แสดงผลลัพธ์เป็น JSON |

### `openspec initiative list`

แสดงรายการ initiatives หากไม่มี selector คำสั่งนี้จะค้นหา context store ที่ลงทะเบียนทั้งหมดและรายงานคำเตือนการอ่านบางส่วนใน `status`

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--store <id>` | แสดงรายการ context store ที่ลงทะเบียนหนึ่งแห่ง |
| `--store-path <path>` | แสดงรายการรากของ context store ภายในเครื่องที่มีอยู่หนึ่งแห่ง |
| `--json` | แสดงผลลัพธ์เป็น JSON |

### `openspec initiative show`

ค้นหา initiative และแสดงตำแหน่ง canonical ของมัน

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

หากไม่มี `--store` OpenSpec จะค้นหา context store ที่ลงทะเบียน หากมี initiative id เดียวกันในหลาย store ให้ส่ง `--store <id>` หรือใช้รูปแบบ `<store>/<id>`

---

## คำสั่งการเรียกดู

### `openspec list`

แสดงรายการการเปลี่ยนแปลงหรือข้อกำหนดในโปรเจกต์ของคุณ

```
openspec list [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `--specs` | แสดงรายการข้อกำหนดแทนการเปลี่ยนแปลง |
| `--changes` | แสดงรายการการเปลี่ยนแปลง (ค่าเริ่มต้น) |
| `--sort <order>` | เรียงตาม `recent` (ค่าเริ่มต้น) หรือ `name` |
| `--json` | ผลลัพธ์ในรูปแบบ JSON |

**ตัวอย่าง:**

```bash
# แสดงรายการการเปลี่ยนแปลงที่ใช้งานอยู่ทั้งหมด
openspec list

# แสดงรายการข้อกำหนดทั้งหมด
openspec list --specs

# ผลลัพธ์ JSON สำหรับสคริปต์
openspec list --json
```

**ผลลัพธ์ (ข้อความ):**

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

เปิดอินเทอร์เฟซแบบเทอร์มินัลสำหรับนำทางข้อกำหนดและการเปลี่ยนแปลงของโปรเจกต์

---

### `openspec show`

แสดงรายละเอียดของการเปลี่ยนแปลงหรือข้อกำหนด

```
openspec show [item-name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|---------------|---------|-----------|
| `item-name` | ไม่ | ชื่อของการเปลี่ยนแปลงหรือข้อกำหนด (จะถามหากไม่ระบุ) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `--type <type>` | ระบุประเภท: `change` หรือ `spec` (ตรวจสอบอัตโนมัติหากไม่คลุมเครือ) |
| `--json` | ผลลัพธ์ในรูปแบบ JSON |
| `--no-interactive` | ปิดใช้งานข้อความแจ้งเตือน |

**ตัวเลือกเฉพาะสำหรับการเปลี่ยนแปลง:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `--deltas-only` | แสดงเฉพาะข้อกำหนดเดลต้า (โหมด JSON) |

**ตัวเลือกเฉพาะสำหรับข้อกำหนด:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `--requirements` | แสดงเฉพาะข้อกำหนด ไม่รวมสถานการณ์ (โหมด JSON) |
| `--no-scenarios` | ไม่รวมเนื้อหาสถานการณ์ (โหมด JSON) |
| `-r, --requirement <id>` | แสดงข้อกำหนดเฉพาะตามดัชนีเริ่มต้นที่ 1 (โหมด JSON) |

**ตัวอย่าง:**

```bash
# เลือกแบบโต้ตอบ
openspec show

# แสดงการเปลี่ยนแปลงเฉพาะ
openspec show add-dark-mode

# แสดงข้อกำหนดเฉพาะ
openspec show auth --type spec

# ผลลัพธ์ JSON สำหรับการวิเคราะห์
openspec show add-dark-mode --json
```

---

## คำสั่งการตรวจสอบความถูกต้อง

### `openspec validate`

ตรวจสอบการเปลี่ยนแปลงและข้อกำหนดสำหรับปัญหาทางโครงสร้าง

```
openspec validate [item-name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|---------------|---------|-----------|
| `item-name` | ไม่ | รายการที่ต้องการตรวจสอบ (จะถามหากไม่ระบุ) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `--all` | ตรวจสอบการเปลี่ยนแปลงและข้อกำหนดทั้งหมด |
| `--changes` | ตรวจสอบการเปลี่ยนแปลงทั้งหมด |
| `--specs` | ตรวจสอบข้อกำหนดทั้งหมด |
| `--type <type>` | ระบุประเภทเมื่อชื่อคลุมเครือ: `change` หรือ `spec` |
| `--strict` | เปิดใช้งานโหมดการตรวจสอบอย่างเข้มงวด |
| `--json` | ผลลัพธ์ในรูปแบบ JSON |
| `--concurrency <n>` | การตรวจสอบสูงสุดแบบขนาน (ค่าเริ่มต้น: 6 หรือตัวแปรสภาพแวดล้อม `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | ปิดใช้งานข้อความแจ้งเตือน |

**ตัวอย่าง:**

```bash
# การตรวจสอบแบบโต้ตอบ
openspec validate

# ตรวจสอบการเปลี่ยนแปลงเฉพาะ
openspec validate add-dark-mode

# ตรวจสอบการเปลี่ยนแปลงทั้งหมด
openspec validate --changes

# ตรวจสอบทุกอย่างพร้อมผลลัพธ์ JSON (สำหรับ CI/สคริปต์)
openspec validate --all --json

# การตรวจสอบอย่างเข้มงวดพร้อมเพิ่มความขนาน
openspec validate --all --strict --concurrency 12
```

**ผลลัพธ์ (ข้อความ):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**ผลลัพธ์ (JSON):**

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

เก็บถาวรการเปลี่ยนแปลงที่เสร็จสมบูรณ์และรวมข้อกำหนดเดลต้าเข้ากับข้อกำหนดหลัก

```
openspec archive [change-name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|---------------|---------|-----------|
| `change-name` | ไม่ | การเปลี่ยนแปลงที่ต้องการเก็บถาวร (จะถามหากไม่ระบุ) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `-y, --yes` | ข้ามข้อความแจ้งเตือนยืนยัน |
| `--skip-specs` | ข้ามการอัปเดตข้อกำหนด (สำหรับการเปลี่ยนแปลงเฉพาะโครงสร้างพื้นฐาน/เครื่องมือ/เอกสาร) |
| `--no-validate` | ข้ามการตรวจสอบความถูกต้อง (ต้องการการยืนยัน) |

**ตัวอย่าง:**

```bash
# เก็บถาวรแบบโต้ตอบ
openspec archive

# เก็บถาวรการเปลี่ยนแปลงเฉพาะ
openspec archive add-dark-mode

# เก็บถาวรโดยไม่ถาม (CI/สคริปต์)
openspec archive add-dark-mode --yes

# เก็บถาวรการเปลี่ยนแปลงเครื่องมือที่ไม่ส่งผลต่อข้อกำหนด
openspec archive update-ci-config --skip-specs
```

**สิ่งที่คำสั่งทำ:**

1. ตรวจสอบความถูกต้องของการเปลี่ยนแปลง (เว้นแต่ใช้ `--no-validate`)
2. ถามเพื่อยืนยัน (เว้นแต่ใช้ `--yes`)
3. รวมข้อกำหนดเดลต้าเข้าใน `openspec/specs/`
4. ย้ายโฟลเดอร์การเปลี่ยนแปลงไปที่ `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## คำสั่งเวิร์กโฟลว์

คำสั่งเหล่านี้รองรับเวิร์กโฟลว์ OPSX ที่ขับเคลื่อนด้วยสิ่งประดิษฐ์ ใช้ได้ทั้งสำหรับมนุษย์ที่ตรวจสอบความคืบหน้าและเอเจนต์ที่กำหนดขั้นตอนถัดไป

### `openspec new change`

สร้างไดเรกทอรีการเปลี่ยนแปลงในเครื่องที่เก็บและข้อมูลเมตาที่เลือกเช็คอิน

```bash
openspec new change <name> [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `--description <text>` | คำอธิบายที่จะเพิ่มใน `README.md` |
| `--goal <text>` | เป้าหมายผลิตภัณฑ์ของพื้นที่ทำงานเพื่อจัดเก็บร่วมกับการเปลี่ยนแปลง |
| `--areas <names>` | ชื่อที่เชื่อมโยงพื้นที่ทำงานที่ได้รับผลกระทบ คั่นด้วยจุลภาค |
| `--initiative <id>` | เชื่อมโยงการเปลี่ยนแปลงในเครื่องที่เก็บกับริเริ่ม |
| `--store <id>` | รหัสที่เก็บบริบทสำหรับ `--initiative` |
| `--store-path <path>` | รากที่เก็บบริบทที่มีอยู่ในเครื่องสำหรับ `--initiative` |
| `--schema <name>` | ชุดรูปแบบเวิร์กโฟลว์ที่ใช้ |
| `--json` | ผลลัพธ์ JSON |

ตัวอย่าง:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

อัปเดตข้อมูลเมตาของการเปลี่ยนแปลงในเครื่องที่เก็บที่เลือกเช็คอินโดยไม่ต้องสร้างการเปลี่ยนแปลงใหม่

```bash
openspec set change <name> [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `--initiative <id>` | เชื่อมโยงการเปลี่ยนแปลงในเครื่องที่เก็บกับริเริ่ม |
| `--store <id>` | รหัสที่เก็บบริบทสำหรับ `--initiative` |
| `--store-path <path>` | รากที่เก็บบริบทที่มีอยู่ในเครื่องสำหรับ `--initiative` |
| `--json` | ผลลัพธ์ JSON |

`set change --initiative` ทำงานแบบไม่เปลี่ยนแปลงผลลัพธ์เมื่อการเชื่อมโยงที่ร้องขอมีอยู่แล้วและปฏิเสธที่จะแทนที่การเชื่อมโยงริเริ่มที่มีอยู่และแตกต่างออกไป

### `openspec status`

แสดงสถานะความสมบูรณ์ของสิ่งประดิษฐ์สำหรับการเปลี่ยนแปลง

```
openspec status [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `--change <id>` | ชื่อการเปลี่ยนแปลง (จะถามหากไม่ระบุ) |
| `--schema <name>` | การแทนที่ชุดรูปแบบ (ตรวจสอบอัตโนมัติจากการกำหนดค่าของการเปลี่ยนแปลง) |
| `--json` | ผลลัพธ์ในรูปแบบ JSON |

**ตัวอย่าง:**

```bash
# ตรวจสอบสถานะแบบโต้ตอบ
openspec status

# สถานะสำหรับการเปลี่ยนแปลงเฉพาะ
openspec status --change add-dark-mode

# JSON สำหรับการใช้งานของเอเจนต์
openspec status --change add-dark-mode --json
```

**ผลลัพธ์ (ข้อความ):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**ผลลัพธ์ (JSON):**

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

รับคำแนะนำที่เพิ่มข้อมูลสำหรับการสร้างสิ่งประดิษฐ์หรือใช้งานงาน ใช้โดยเอเจนต์ AI เพื่อเข้าใจว่าจะสร้างอะไรต่อไป

```
openspec instructions [artifact] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|---------------|---------|-----------|
| `artifact` | ไม่ | รหัสสิ่งประดิษฐ์: `proposal`, `specs`, `design`, `tasks` หรือ `apply` |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `--change <id>` | ชื่อการเปลี่ยนแปลง (จำเป็นในโหมดที่ไม่โต้ตอบ) |
| `--schema <name>` | การแทนที่ชุดรูปแบบ |
| `--json` | ผลลัพธ์ในรูปแบบ JSON |

**กรณีพิเศษ:** ใช้ `apply` เป็นสิ่งประดิษฐ์เพื่อรับคำแนะนำการใช้งานงาน

**ตัวอย่าง:**

```bash
# รับคำแนะนำสำหรับสิ่งประดิษฐ์ถัดไป
openspec instructions --change add-dark-mode

# รับคำแนะนำสำหรับสิ่งประดิษฐ์เฉพาะ
openspec instructions design --change add-dark-mode

# รับคำแนะนำการใช้งาน/การนำไปใช้
openspec instructions apply --change add-dark-mode

# JSON สำหรับการบริโภคของเอเจนต์
openspec instructions design --change add-dark-mode --json
```

**ผลลัพธ์รวมถึง:**

- เนื้อหาเทมเพลตสำหรับสิ่งประดิษฐ์
- บริบทโปรเจกต์จากการกำหนดค่า
- เนื้อหาจากสิ่งประดิษฐ์ที่เป็นพึ่งพา
- กฎสำหรับสิ่งประดิษฐ์แต่ละรายการจากการกำหนดค่า

---

### `openspec templates`

แสดงเส้นทางเทมเพลตที่ถูกต้องสำหรับสิ่งประดิษฐ์ทั้งหมดในชุดรูปแบบ

```
openspec templates [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `--schema <name>` | ชุดรูปแบบที่ต้องการตรวจสอบ (ค่าเริ่มต้น: `spec-driven`) |
| `--json` | ผลลัพธ์ในรูปแบบ JSON |

**ตัวอย่าง:**

```bash
# แสดงเส้นทางเทมเพลตสำหรับชุดรูปแบบเริ่มต้น
openspec templates

# แสดงเทมเพลตสำหรับชุดรูปแบบที่กำหนดเอง
openspec templates --schema my-workflow

# JSON สำหรับการใช้งานโปรแกรม
openspec templates --json
```

**ผลลัพธ์ (ข้อความ):**

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

แสดงรายการชุดรูปแบบเวิร์กโฟลว์ที่มีอยู่พร้อมคำอธิบายและกระแสสิ่งประดิษฐ์

```
openspec schemas [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|-----------|
| `--json` | ผลลัพธ์ในรูปแบบ JSON |

**ตัวอย่าง:**

```bash
openspec schemas
```

**ผลลัพธ์:**

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

คำสั่งสำหรับสร้างและจัดการ schema ของ workflow แบบกำหนดเอง

### `openspec schema init`

สร้าง schema ใหม่สำหรับโปรเจกต์เฉพาะ

```
openspec schema init <name> [options]
```

**Arguments:**

| Argument | จำเป็น | คำอธิบาย |
|----------|--------|-------------|
| `name` | ใช่ | ชื่อ schema (ใช้ kebab-case) |

**Options:**

| Option | คำอธิบาย |
|--------|-------------|
| `--description <text>` | คำอธิบาย schema |
| `--artifacts <list>` | รายการ ID ของ artifact คั่นด้วยจุลภาค (ค่าเริ่มต้น: `proposal,specs,design,tasks`) |
| `--default` | ตั้งเป็น schema เริ่มต้นของโปรเจกต์ |
| `--no-default` | ไม่แจ้งเตือนให้ตั้งเป็นค่าเริ่มต้น |
| `--force` | เขียนทับ schema ที่มีอยู่ |
| `--json` | แสดงผลลัพธ์เป็น JSON |

**ตัวอย่าง:**

```bash
# สร้าง schema แบบ interactive
openspec schema init research-first

# สร้างแบบ non-interactive พร้อมระบุ artifacts
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**สิ่งที่คำสั่งนี้สร้าง:**

```
openspec/schemas/<name>/
├── schema.yaml           # คำจำกัดความ schema
└── templates/
    ├── proposal.md       # Template สำหรับแต่ละ artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

คัดลอก schema ที่มีอยู่ไปยังโปรเจกต์ของคุณเพื่อปรับแต่ง

```
openspec schema fork <source> [name] [options]
```

**Arguments:**

| Argument | จำเป็น | คำอธิบาย |
|----------|--------|-------------|
| `source` | ใช่ | Schema ที่ต้องการคัดลอก |
| `name` | ไม่ | ชื่อ schema ใหม่ (ค่าเริ่มต้น: `<source>-custom`) |

**Options:**

| Option | คำอธิบาย |
|--------|-------------|
| `--force` | เขียนทับปลายทางที่มีอยู่ |
| `--json` | แสดงผลลัพธ์เป็น JSON |

**ตัวอย่าง:**

```bash
# แยก schema แบบ spec-driven ที่มาพร้อมระบบ
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

ตรวจสอบโครงสร้างและ template ของ schema

```
openspec schema validate [name] [options]
```

**Arguments:**

| Argument | จำเป็น | คำอธิบาย |
|----------|--------|-------------|
| `name` | ไม่ | Schema ที่ต้องการตรวจสอบ (หากไม่ระบุ จะตรวจสอบทั้งหมด) |

**Options:**

| Option | คำอธิบาย |
|--------|-------------|
| `--verbose` | แสดงขั้นตอนการตรวจสอบโดยละเอียด |
| `--json` | แสดงผลลัพธ์เป็น JSON |

**ตัวอย่าง:**

```bash
# ตรวจสอบ schema เฉพาะ
openspec schema validate my-workflow

# ตรวจสอบ schema ทั้งหมด
openspec schema validate
```

---

### `openspec schema which`

แสดงที่มาของ schema (มีประโยชน์สำหรับการดีบักลำดับความสำคัญ)

```
openspec schema which [name] [options]
```

**Arguments:**

| Argument | จำเป็น | คำอธิบาย |
|----------|--------|-------------|
| `name` | ไม่ | ชื่อ schema |

**Options:**

| Option | คำอธิบาย |
|--------|-------------|
| `--all` | แสดงรายการ schema ทั้งหมดพร้อมแหล่งที่มา |
| `--json` | แสดงผลลัพธ์เป็น JSON |

**ตัวอย่าง:**

```bash
# ตรวจสอบแหล่งที่มาของ schema
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
3. แพ็กเกจ: Schema ที่มาพร้อมระบบ

---

## คำสั่ง Configuration

### `openspec config`

ดูและแก้ไขการตั้งค่าส่วนกลางของ OpenSpec

```
openspec config <subcommand> [options]
```

**Subcommands:**

| Subcommand | คำอธิบาย |
|------------|-------------|
| `path` | แสดงตำแหน่งไฟล์ config |
| `list` | แสดงการตั้งค่าปัจจุบันทั้งหมด |
| `get <key>` | รับค่าที่เจาะจง |
| `set <key> <value>` | ตั้งค่า |
| `unset <key>` | ลบคีย์ |
| `reset` | รีเซ็ตเป็นค่าเริ่มต้น |
| `edit` | เปิดใน `$EDITOR` |
| `profile [preset]` | กำหนดค่าโปรไฟล์ workflow แบบ interactive หรือผ่าน preset |

**ตัวอย่าง:**

```bash
# แสดงตำแหน่งไฟล์ config
openspec config path

# แสดงการตั้งค่าทั้งหมด
openspec config list

# รับค่าที่เจาะจง
openspec config get telemetry.enabled

# ตั้งค่า
openspec config set telemetry.enabled false

# ตั้งค่า string อย่างชัดเจน
openspec config set user.name "My Name" --string

# ลบการตั้งค่าที่กำหนดเอง
openspec config unset user.name

# รีเซ็ตการตั้งค่าทั้งหมด
openspec config reset --all --yes

# แก้ไข config ใน editor ของคุณ
openspec config edit

# กำหนดค่าโปรไฟล์ด้วย wizard แบบ action-based
openspec config profile

# preset แบบเร็ว: สลับ workflows ไปที่ core (รักษา delivery mode ไว้)
openspec config profile core
```

`openspec config profile` เริ่มต้นด้วยสรุปสถานะปัจจุบัน จากนั้นให้คุณเลือก:
- เปลี่ยน delivery + workflows
- เปลี่ยน delivery เท่านั้น
- เปลี่ยน workflows เท่านั้น
- รักษาการตั้งค่าปัจจุบัน (ออก)

หากคุณเลือกรักษาการตั้งค่าปัจจุบัน จะไม่มีการเขียนการเปลี่ยนแปลงและไม่แสดงพร้อมท์อัปเดต
หากไม่มีการเปลี่ยนแปลง config แต่โปรเจกต์ปัจจุบันหรือไฟล์ workspace ไม่ซิงค์กับโปรไฟล์/delivery ส่วนกลางของคุณ OpenSpec จะแสดงคำเตือนและแนะนำ `openspec update` สำหรับโปรเจกต์เฉพาะ repo-local หรือ `openspec workspace update` สำหรับคำแนะนำและทักษะ workspace-local
การกด `Ctrl+C` จะยกเลิกกระบวนการอย่างเรียบร้อย (ไม่มี stack trace) และออกด้วยรหัส `130`
ในรายการ workflow, `[x]` หมายความว่า workflow ถูกเลือกใน config ส่วนกลาง หากต้องการใช้ตัวเลือกเหล่านั้นกับไฟล์โปรเจกต์ ให้รัน `openspec update` (หรือเลือก `Apply changes to this project now?` เมื่อแจ้งเตือนภายในโปรเจกต์) จากภายใน workspace ให้ใช้ `openspec workspace update` เพื่อรีเฟรชคำแนะนำและทักษะ workspace-local; สิ่งนี้ยังคงเป็น skills-only สำหรับไฟล์ workflow ของ agent ที่สร้างขึ้นและไม่สร้างคำสั่ง workspace slash

**ตัวอย่าง interactive:**

```bash
# อัปเดต delivery เท่านั้น
openspec config profile
# เลือก: Change delivery only
# เลือก delivery: Skills only

# อัปเดต workflows เท่านั้น
openspec config profile
# เลือก: Change workflows only
# สลับ workflows ในรายการตรวจสอบ จากนั้นยืนยัน
```

---

## คำสั่ง Utility

### `openspec feedback`

ส่งความคิดเห็นเกี่ยวกับ OpenSpec จะสร้าง GitHub issue

```
openspec feedback <message> [options]
```

**Arguments:**

| Argument | จำเป็น | คำอธิบาย |
|----------|--------|-------------|
| `message` | ใช่ | ข้อความความคิดเห็น |

**Options:**

| Option | คำอธิบาย |
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

จัดการ shell completions สำหรับ CLI ของ OpenSpec

```
openspec completion <subcommand> [shell]
```

**Subcommands:**

| Subcommand | คำอธิบาย |
|------------|-------------|
| `generate [shell]` | แสดงสคริปต์ completion ไปที่ stdout |
| `install [shell]` | ติดตั้ง completion สำหรับ shell ของคุณ |
| `uninstall [shell]` | ลบ completions ที่ติดตั้ง |

**shells ที่รองรับ:** `bash`, `zsh`, `fish`, `powershell`

**ตัวอย่าง:**

```bash
# ติดตั้ง completions (ตรวจจับ shell อัตโนมัติ)
openspec completion install

# ติดตั้งสำหรับ shell เฉพาะ
openspec completion install zsh

# สร้างสคริปต์สำหรับติดตั้งด้วยตนเอง
openspec completion generate bash > ~/.bash_completion.d/openspec

# ถอนการติดตั้ง
openspec completion uninstall
```

---

## รหัสออกจากโปรแกรม

| รหัส | ความหมาย |
|------|---------|
| `0` | สำเร็จ |
| `1` | ข้อผิดพลาด (การตรวจสอบล้มเหลว, ไฟล์ขาดหาย เป็นต้น) |

---

## ตัวแปรสภาพแวดล้อม

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | ตั้งเป็น `0` เพื่อปิดการเก็บข้อมูลการใช้งาน |
| `DO_NOT_TRACK` | ตั้งเป็น `1` เพื่อปิดการเก็บข้อมูลการใช้งาน (สัญญาณ DNT มาตรฐาน) |
| `OPENSPEC_CONCURRENCY` | ค่าเริ่มต้นสำหรับการตรวจสอบจำนวนมากพร้อมกัน (ค่าเริ่มต้น: 6) |
| `EDITOR` หรือ `VISUAL` | โปรแกรมแก้ไขสำหรับ `openspec config edit` |
| `NO_COLOR` | ปิดการแสดงสีเมื่อตั้งค่า |

---

## เอกสารประกอบที่เกี่ยวข้อง

- [คำสั่ง](commands.md) - คำสั่ง AI slash (`/opsx:propose`, `/opsx:apply` เป็นต้น)
- [Workflows](workflows.md) - รูปแบบทั่วไปและเมื่อใดควรใช้คำสั่งใด
- [การปรับแต่ง](customization.md) - สร้าง schema และ template ที่กำหนดเอง
- [เริ่มต้นใช้งาน](getting-started.md) - คู่มือการตั้งค่าครั้งแรก