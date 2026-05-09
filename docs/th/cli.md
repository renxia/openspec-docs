# อ้างอิง CLI

OpenSpec CLI (`openspec`) มีคำสั่งเทอร์มินัลสำหรับการตั้งค่าโปรเจกต์ การตรวจสอบความถูกต้อง การตรวจสอบสถานะ และการจัดการ คำสั่งเหล่านี้เป็นส่วนเสริมของคำสั่ง AI slash (เช่น `/opsx:propose`) ที่ได้รับการบันทึกไว้ใน [Commands](commands.md)

## สรุป

| หมวดหมู่ | คำสั่ง | วัตถุประสงค์ |
|----------|----------|---------|
| **Setup** | `init`, `update` | เริ่มต้นและอัปเดต OpenSpec ในโปรเจกต์ของคุณ |
| **Workspaces (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | ตั้งค่าการวางแผนข้าม repos หรือโฟลเดอร์ที่เชื่อมโยง |
| **Browsing** | `list`, `view`, `show` | สำรวจการเปลี่ยนแปลงและข้อกำหนด |
| **Validation** | `validate` | ตรวจสอบปัญหาในการเปลี่ยนแปลงและข้อกำหนด |
| **Lifecycle** | `archive` | สรุปการเปลี่ยนแปลงที่เสร็จสมบูรณ์ |
| **Workflow** | `status`, `instructions`, `templates`, `schemas` | การสนับสนุนเวิร์กโฟลว์ที่ขับเคลื่อนด้วยสิ่งประดิษฐ์ |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | สร้างและจัดการเวิร์กโฟลว์ที่กำหนดเอง |
| **Config** | `config` | ดูและแก้ไขการตั้งค่า |
| **Utility** | `feedback`, `completion` | การตอบรับและการรวมเข้ากับเชลล์ |

---

## คำสั่งสำหรับมนุษย์ vs เอเจนต์

คำสั่ง CLI ส่วนใหญ่ถูกออกแบบมาเพื่อ**การใช้งานของมนุษย์**ในเทอร์มินัล บางคำสั่งยังรองรับ**การใช้งานของเอเจนต์/สคริปต์**ผ่านผลลัพธ์แบบ JSON

### คำสั่งสำหรับมนุษย์เท่านั้น

คำสั่งเหล่านี้เป็นแบบโต้ตอบและออกแบบมาเพื่อใช้งานในเทอร์มินัล:

| คำสั่ง | วัตถุประสงค์ |
|---------|---------|
| `openspec init` | เริ่มต้นโปรเจกต์ (พร้อมท์แบบโต้ตอบ) |
| `openspec view` | แดชบอร์ดแบบโต้ตอบ |
| `openspec config edit` | เปิดไฟล์ config ในตัวแก้ไข |
| `openspec feedback` | ส่งข้อเสนอแนะผ่าน GitHub |
| `openspec completion install` | ติดตั้ง shell completions |

### คำสั่งที่รองรับเอเจนต์

คำสั่งเหล่านี้รองรับผลลัพธ์แบบ `--json` สำหรับการใช้งานแบบโปรแกรมโดยเอเจนต์ AI และสคริปต์:

| คำสั่ง | การใช้งานของมนุษย์ | การใช้งานของเอเจนต์ |
|---------|-----------|-----------|
| `openspec list` | เรียกดูการเปลี่ยนแปลง/ข้อกำหนด | `--json` สำหรับข้อมูลที่มีโครงสร้าง |
| `openspec show <item>` | อ่านเนื้อหา | `--json` สำหรับการแยกวิเคราะห์ |
| `openspec validate` | ตรวจสอบปัญหา | `--all --json` สำหรับการตรวจสอบแบบกลุ่ม |
| `openspec status` | ดูความคืบหน้าของสิ่งประดิษฐ์ | `--json` สำหรับสถานะที่มีโครงสร้าง |
| `openspec instructions` | รับขั้นตอนถัดไป | `--json` สำหรับคำแนะนำเอเจนต์ |
| `openspec templates` | ค้นหาเส้นทางเทมเพลต | `--json` สำหรับการแก้ไขเส้นทาง |
| `openspec schemas` | แสดงรายการ schema ที่มี | `--json` สำหรับการค้นพบ schema |
| `openspec workspace setup --no-interactive` | สร้าง workspace ด้วยอินพุตที่ระบุ | `--json` สำหรับผลลัพธ์การตั้งค่าที่มีโครงสร้าง |
| `openspec workspace list` | เรียกดู workspace ที่รู้จัก | `--json` สำหรับอ็อบเจกต์ workspace ที่มีประเภท |
| `openspec workspace link` | ลิงก์ repo หรือโฟลเดอร์ | `--json` สำหรับผลลัพธ์การลิงก์ที่มีโครงสร้าง |
| `openspec workspace relink` | ซ่อมแซมเส้นทางที่ลิงก์ | `--json` สำหรับผลลัพธ์การลิงก์ที่มีโครงสร้าง |
| `openspec workspace doctor` | ตรวจสอบ workspace หนึ่ง | `--json` สำหรับผลลัพธ์สถานะที่มีโครงสร้าง |

---

## ตัวเลือกทั่วไป

ตัวเลือกเหล่านี้ใช้ได้กับทุกคำสั่ง:

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--version`, `-V` | แสดงหมายเลขเวอร์ชัน |
| `--no-color` | ปิดใช้งานผลลัพธ์สี |
| `--help`, `-h` | แสดงความช่วยเหลือสำหรับคำสั่ง |

---

## คำสั่งการตั้งค่า

### `openspec init`

เริ่มต้น OpenSpec ในโปรเจกต์ของคุณ สร้างโครงสร้างโฟลเดอร์และกำหนดค่าการรวมเครื่องมือ AI

พฤติกรรมเริ่มต้นใช้ค่าเริ่มต้นของ config ทั่วไป: โปรไฟล์ `core`, การส่งมอบ `both`, เวิร์กโฟลว์ `propose, explore, apply, sync, archive`

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
| `--tools <list>` | กำหนดค่าเครื่องมือ AI แบบไม่โต้ตอบ ใช้ `all`, `none` หรือรายการคั่นด้วยจุลภาค |
| `--force` | ลบไฟล์รุ่นเก่าโดยอัตโนมัติโดยไม่ต้องถาม |
| `--profile <profile>` | เขียนทับโปรไฟล์ทั่วไปสำหรับการรัน init นี้ (`core` หรือ `custom`) |

`--profile custom` ใช้เวิร์กโฟลว์ใดก็ตามที่เลือกไว้ใน config ทั่วไปปัจจุบัน (`openspec config profile`)

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

# เขียนทับโปรไฟล์สำหรับการรันนี้
openspec init --profile core

# ข้ามพร้อมท์และลบไฟล์รุ่นเก่าโดยอัตโนมัติ
openspec init --force
```

**สิ่งที่สร้าง:**

```
openspec/
├── specs/              # ข้อกำหนดของคุณ (แหล่งข้อมูลจริง)
├── changes/            # การเปลี่ยนแปลงที่เสนอ
└── config.yaml         # การกำหนดค่าโปรเจกต์

.claude/skills/         # ทักษะ Claude Code (หากเลือก claude)
.cursor/skills/         # ทักษะ Cursor (หากเลือก cursor)
.cursor/commands/       # คำสั่ง OPSX ของ Cursor (หากการส่งมอบรวมถึงคำสั่ง)
... (การกำหนดค่าเครื่องมืออื่นๆ)
```

---

### `openspec update`

อัปเดตไฟล์คำแนะนำ OpenSpec หลังจากอัปเกรด CLI สร้างไฟล์กำหนดค่าเครื่องมือ AI ขึ้นใหม่โดยใช้โปรไฟล์ทั่วไปปัจจุบัน เวิร์กโฟลว์ที่เลือก และโหมดการส่งมอบของคุณ

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
| `--force` | บังคับอัปเดตแม้เมื่อไฟล์เป็นเวอร์ชันล่าสุดแล้ว |

**ตัวอย่าง:**

```bash
# อัปเดตไฟล์คำแนะนำหลังจากอัปเกรด npm
npm update @fission-ai/openspec
openspec update
```

---

## คำสั่ง Workspace

คำสั่ง Workspace อยู่ระหว่างการพัฒนาอย่างแข็งขันและยังไม่พร้อมใช้งาน อย่าสร้างระบบอัตโนมัติภายนอก การรวมระบบ หรือเวิร์กโฟลว์ที่มีอายุยาวนานบนพื้นผิวคำสั่งนี้ พฤติกรรมของคำสั่ง ไฟล์สถานะ และผลลัพธ์ JSON อาจเปลี่ยนแปลงได้ตลอดเวลา

Workspace สำหรับการประสานงานเป็นบ้านวางแผนสำหรับงานที่ครอบคลุมหลาย repo หรือโฟลเดอร์ การมองเห็น workspace ไม่ใช่ข้อผูกมัดในการเปลี่ยนแปลง: ลิงก์ repo หรือโฟลเดอร์ที่ OpenSpec ควรรู้จัก จากนั้นสร้างการเปลี่ยนแปลงเมื่อคุณพร้อมวางแผนงานเฉพาะ

### `openspec workspace setup`

สร้าง workspace ในตำแหน่ง workspace มาตรฐานของ OpenSpec และลิงก์อย่างน้อยหนึ่ง repo หรือโฟลเดอร์ที่มีอยู่

```bash
openspec workspace setup [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--name <name>` | ชื่อ workspace ชื่อต้องเป็น kebab-case |
| `--link <path>` | ลิงก์ repo หรือโฟลเดอร์ที่มีอยู่และอนุมานชื่อลิงก์จากชื่อโฟลเดอร์ |
| `--link <name>=<path>` | ลิงก์ repo หรือโฟลเดอร์ที่มีอยู่ด้วยชื่อลิงก์ที่ระบุ |
| `--opener <id>` | จัดเก็บตัวเปิดที่ต้องการระหว่างการตั้งค่าแบบไม่โต้ตอบ: `codex`, `claude`, `github-copilot` หรือ `editor` |
| `--no-interactive` | ปิดใช้งานพร้อมท์ ต้องการ `--name` และอย่างน้อยหนึ่ง `--link` |
| `--json` | ผลลัพธ์ JSON ต้องการ `--no-interactive` |

**ตัวอย่าง:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

การตั้งค่าแบบโต้ตอบจะถามหาตัวเปิดที่ต้องการและจัดเก็บไว้ในสถานะ workspace ของเครื่อง การตั้งค่าแบบไม่โต้ตอบจะจัดเก็บตัวเปิดที่ต้องการเมื่อระบุ `--opener` เท่านั้น มิฉะนั้น `workspace open` จะถามในภายหลังในเทอร์มินัลแบบโต้ตอบเมื่อมีตัวเปิดที่รองรับ หรือถามสคริปต์ให้ส่ง `--agent <tool>` หรือ `--editor`

### `openspec workspace list`

แสดงรายการ workspace ที่รู้จักของ OpenSpec จาก registry ท้องถิ่น

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

รายการแสดงตำแหน่ง workspace และ repo หรือโฟลเดอร์ที่ลิงก์แต่ละรายการ บันทึก registry ที่ล้าสมัยจะถูกรายงานแต่ไม่เปลี่ยนแปลง

### `openspec workspace link`

บันทึก repo หรือโฟลเดอร์ที่มีอยู่สำหรับ workspace หนึ่ง

```bash
openspec workspace link [name] <path> [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--workspace <name>` | เลือก workspace ที่รู้จักจาก registry ท้องถิ่น |
| `--json` | ผลลัพธ์ JSON |
| `--no-interactive` | ปิดใช้งานพร้อมท์เลือก workspace |

**ตัวอย่าง:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

เส้นทางต้องมีอยู่แล้ว เส้นทางสัมพัทธ์จะถูกแก้ไขเทียบกับไดเรกทอรีปัจจุบันของคำสั่งก่อนที่ OpenSpec จะจัดเก็บเส้นทางสัมบูรณ์ที่ยืนยันแล้วในสถานะ workspace ของเครื่อง เส้นทางที่ลิงก์อาจเป็น repo แพ็กเกจ บริการ แอป หรือโฟลเดอร์ที่ไม่มีสถานะ `openspec/` ภายใน repo

### `openspec workspace relink`

ซ่อมแซมหรือเปลี่ยนเส้นทางท้องถิ่นสำหรับลิงก์ที่มีอยู่

```bash
openspec workspace relink <name> <path> [options]
```

เส้นทางต้องมีอยู่แล้ว Relink อัปเดตเฉพาะเส้นทางท้องถิ่นของเครื่องสำหรับชื่อลิงก์ที่เสถียร

### `openspec workspace doctor`

ตรวจสอบว่า workspace หนึ่งสามารถแก้ไขอะไรได้บ้างบนเครื่องปัจจุบัน

```bash
openspec workspace doctor [options]
```

Doctor แสดงตำแหน่ง workspace เส้นทางการวางแผน repo หรือโฟลเดอร์ที่ลิงก์ เส้นทางที่ขาดหายไป เส้นทาง spec ภายใน repo เมื่อมี และการแก้ไขที่แนะนำ มันรายงานปัญหาเท่านั้น ไม่ซ่อมแซมโดยอัตโนมัติ

คำสั่งที่ต้องการ workspace หนึ่งจะใช้ workspace ปัจจุบันเมื่อรันจากภายในโฟลเดอร์ workspace หรือไดเรกทอรีย่อย จากที่อื่น ส่ง `--workspace <name>` เลือกจากตัวเลือกในเทอร์มินัลแบบโต้ตอบ หรือพึ่งพา workspace ที่รู้จักเพียงแห่งเดียวเมื่อมีเพียงแห่งเดียว ในโหมด `--json` หรือ `--no-interactive` การเลือกที่คลุมเครือจะล้มเหลวด้วยข้อผิดพลาดสถานะที่มีโครงสร้างและแนะนำ `--workspace <name>`

การตอบกลับ JSON ใช้อ็อบเจกต์ที่มีประเภทบวกอาร์เรย์ `status` ข้อมูลหลักอยู่ใน `workspace`, `workspaces` หรือ `link` คำเตือนและข้อผิดพลาดอยู่ใน `status`

### `openspec workspace open`

เปิดชุดงาน workspace ผ่านตัวเปิดที่ต้องการที่จัดเก็บไว้ การเขียนทับเอเจนต์แบบครั้งเดียว หรือโหมดตัวแก้ไข VS Code

```bash
openspec workspace open [name] [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--workspace <name>` | ชื่อแทนสำหรับชื่อ workspace ตำแหน่ง |
| `--agent <tool>` | การเขียนทับเอเจนต์แบบครั้งเดียว: `codex`, `claude` หรือ `github-copilot` |
| `--editor` | เปิดไฟล์ workspace VS Code ที่ดูแลรักษาเป็น workspace ตัวแก้ไขปกติ |
| `--no-interactive` | ปิดใช้งานพร้อมท์เลือก workspace และตัวเปิด |

**ตัวอย่าง:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` ใช้ workspace ปัจจุบันเมื่อรันจากภายในหนึ่ง เลือกอัตโนมัติ workspace ที่รู้จักเพียงแห่งเดียวเมื่อรันจากที่อื่น และถามผู้ใช้ให้เลือกเมื่อมีหลาย workspace ที่รู้จัก `--agent` และ `--editor` ไม่เปลี่ยนตัวเปิดที่ต้องการที่จัดเก็บไว้ การส่งการเขียนทับตัวเปิดทั้งสองเป็นข้อผิดพลาด เลือกอย่างใดอย่างหนึ่ง `--agent <tool>` หรือ `--editor`

OpenSpec ดูแลรักษา `<workspace-name>.code-workspace` ที่ราก workspace สำหรับการเปิด VS Code ตัวแก้ไขและ GitHub Copilot-in-VS-Code ไฟล์นั้นเป็นของเครื่องและถูกละเว้นโดยค่าเริ่มต้นด้วยรายการ `.gitignore` เฉพาะ `<workspace-name>.code-workspace` ดังนั้นไฟล์ `*.code-workspace` ที่ผู้ใช้สร้างจึงยังมีสิทธิ์ถูกติดตาม

Workspace VS Code ที่ดูแลรักษาจะรวมรากการประสานงานเป็น `.` บวก repo หรือโฟลเดอร์ที่ลิงก์ที่ถูกต้องเป็นรากเพิ่มเติม VS Code แสดงรายการเหล่านั้นเป็น workspace หลายราก

การเปิด workspace รากสนับสนุนการสำรวจและการวางแผนข้าม repo หรือโฟลเดอร์ที่ลิงก์ การแก้ไขการนำไปใช้ควรเริ่มต้นหลังจากคำขอของผู้ใช้ที่ชัดเจนและเวิร์กโฟลว์การนำไปใช้ OpenSpec ปกติเท่านั้น

---

## คำสั่งสำหรับการเรียกดู

### `openspec list`

แสดงรายการการเปลี่ยนแปลงหรือข้อกำหนดในโปรเจกต์ของคุณ

```
openspec list [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|----------|
| `--specs` | แสดงรายการข้อกำหนดแทนการเปลี่ยนแปลง |
| `--changes` | แสดงรายการการเปลี่ยนแปลง (ค่าเริ่มต้น) |
| `--sort <order>` | เรียงลำดับตาม `recent` (ค่าเริ่มต้น) หรือ `name` |
| `--json` | แสดงผลลัพธ์เป็น JSON |

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
การเปลี่ยนแปลงที่ใช้งานอยู่:
  add-dark-mode     การสนับสนุนการสลับธีม UI
  fix-login-bug     การจัดการหมดเวลาเซสชัน
```

---

### `openspec view`

แสดงแดชบอร์ดแบบโต้ตอบสำหรับสำรวจข้อกำหนดและการเปลี่ยนแปลง

```
openspec view
```

เปิดอินเทอร์เฟซบนเทอร์มินัลสำหรับนำทางข้อกำหนดและการเปลี่ยนแปลงของโปรเจกต์ของคุณ

---

### `openspec show`

แสดงรายละเอียดของการเปลี่ยนแปลงหรือข้อกำหนด

```
openspec show [item-name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|--------------|--------|----------|
| `item-name` | ไม่ | ชื่อของการเปลี่ยนแปลงหรือข้อกำหนด (จะถามหากละเว้น) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|----------|
| `--type <type>` | ระบุประเภท: `change` หรือ `spec` (ตรวจจับอัตโนมัติหากไม่คลุมเครือ) |
| `--json` | แสดงผลลัพธ์เป็น JSON |
| `--no-interactive` | ปิดใช้งานพร้อมท์ |

**ตัวเลือกเฉพาะสำหรับการเปลี่ยนแปลง:**

| ตัวเลือก | คำอธิบาย |
|----------|----------|
| `--deltas-only` | แสดงเฉพาะข้อกำหนดเดลต้า (โหมด JSON) |

**ตัวเลือกเฉพาะสำหรับข้อกำหนด:**

| ตัวเลือก | คำอธิบาย |
|----------|----------|
| `--requirements` | แสดงเฉพาะข้อกำหนด ไม่รวมสถานการณ์ (โหมด JSON) |
| `--no-scenarios` | ไม่รวมเนื้อหาสถานการณ์ (โหมด JSON) |
| `-r, --requirement <id>` | แสดงข้อกำหนดเฉพาะตามดัชนีที่เริ่มจาก 1 (โหมด JSON) |

**ตัวอย่าง:**

```bash
# การเลือกแบบโต้ตอบ
openspec show

# แสดงการเปลี่ยนแปลงเฉพาะ
openspec show add-dark-mode

# แสดงข้อกำหนดเฉพาะ
openspec show auth --type spec

# ผลลัพธ์ JSON สำหรับการแยกวิเคราะห์
openspec show add-dark-mode --json
```

---

## คำสั่งสำหรับการตรวจสอบความถูกต้อง

### `openspec validate`

ตรวจสอบการเปลี่ยนแปลงและข้อกำหนดสำหรับปัญหาเชิงโครงสร้าง

```
openspec validate [item-name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|--------------|--------|----------|
| `item-name` | ไม่ | รายการเฉพาะที่ต้องการตรวจสอบ (จะถามหากละเว้น) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|----------|----------|
| `--all` | ตรวจสอบการเปลี่ยนแปลงและข้อกำหนดทั้งหมด |
| `--changes` | ตรวจสอบการเปลี่ยนแปลงทั้งหมด |
| `--specs` | ตรวจสอบข้อกำหนดทั้งหมด |
| `--type <type>` | ระบุประเภทเมื่อชื่อคลุมเครือ: `change` หรือ `spec` |
| `--strict` | เปิดใช้งานโหมดตรวจสอบความถูกต้องแบบเข้มงวด |
| `--json` | แสดงผลลัพธ์เป็น JSON |
| `--concurrency <n>` | การตรวจสอบแบบขนานสูงสุด (ค่าเริ่มต้น: 6 หรือตัวแปรสภาพแวดล้อม `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | ปิดใช้งานพร้อมท์ |

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

# การตรวจสอบแบบเข้มงวดพร้อมเพิ่มความขนาน
openspec validate --all --strict --concurrency 12
```

**ผลลัพธ์ (ข้อความ):**

```
กำลังตรวจสอบ add-dark-mode...
  ✓ proposal.md ถูกต้อง
  ✓ specs/ui/spec.md ถูกต้อง
  ⚠ design.md: ส่วน "Technical Approach" หายไป

พบ 1 คำเตือน
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
|----------|----------|-------------|
| `change-name` | ไม่ | การเปลี่ยนแปลงที่จะเก็บถาวร (จะถามหากละเว้น) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `-y, --yes` | ข้ามการถามยืนยัน |
| `--skip-specs` | ข้ามการอัปเดตข้อกำหนด (สำหรับการเปลี่ยนแปลงเฉพาะโครงสร้างพื้นฐาน/เครื่องมือ/เอกสาร) |
| `--no-validate` | ข้ามการตรวจสอบความถูกต้อง (ต้องมีการยืนยัน) |

**ตัวอย่าง:**

```bash
# เก็บถาวรแบบโต้ตอบ
openspec archive

# เก็บถาวรการเปลี่ยนแปลงเฉพาะ
openspec archive add-dark-mode

# เก็บถาวรโดยไม่ถาม (CI/scripts)
openspec archive add-dark-mode --yes

# เก็บถาวรการเปลี่ยนแปลงเครื่องมือที่ไม่ส่งผลต่อข้อกำหนด
openspec archive update-ci-config --skip-specs
```

**สิ่งที่คำสั่งทำ:**

1. ตรวจสอบความถูกต้องของการเปลี่ยนแปลง (เว้นแต่จะใช้ `--no-validate`)
2. ถามเพื่อยืนยัน (เว้นแต่จะใช้ `--yes`)
3. รวมข้อกำหนดเดลต้าเข้ากับ `openspec/specs/`
4. ย้ายโฟลเดอร์การเปลี่ยนแปลงไปที่ `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## คำสั่งเวิร์กโฟลว์

คำสั่งเหล่านี้รองรับเวิร์กโฟลว์ OPSX ที่ขับเคลื่อนด้วยสิ่งประดิษฐ์ (artifact) มีประโยชน์ทั้งสำหรับบุคคลที่ตรวจสอบความคืบหน้าและตัวแทน (agent) ที่กำหนดขั้นตอนถัดไป

### `openspec status`

แสดงสถานะความสมบูรณ์ของสิ่งประดิษฐ์สำหรับการเปลี่ยนแปลง

```
openspec status [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--change <id>` | ชื่อการเปลี่ยนแปลง (จะถามหากละเว้น) |
| `--schema <name>` | แทนที่สคีมา (ตรวจจับอัตโนมัติจากการกำหนดค่าของการเปลี่ยนแปลง) |
| `--json` | เอาต์พุตเป็น JSON |

**ตัวอย่าง:**

```bash
# ตรวจสอบสถานะแบบโต้ตอบ
openspec status

# สถานะสำหรับการเปลี่ยนแปลงเฉพาะ
openspec status --change add-dark-mode

# JSON สำหรับใช้โดยตัวแทน
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

รับคำแนะนำที่เสริมข้อมูลสำหรับการสร้างสิ่งประดิษฐ์หรือการใช้งานงาน ใช้โดยตัวแทน AI เพื่อเข้าใจสิ่งที่ต้องสร้างต่อไป

```
openspec instructions [artifact] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `artifact` | ไม่ | รหัสสิ่งประดิษฐ์: `proposal`, `specs`, `design`, `tasks` หรือ `apply` |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--change <id>` | ชื่อการเปลี่ยนแปลง (จำเป็นในโหมดไม่โต้ตอบ) |
| `--schema <name>` | แทนที่สคีมา |
| `--json` | เอาต์พุตเป็น JSON |

**กรณีพิเศษ:** ใช้ `apply` เป็นสิ่งประดิษฐ์เพื่อรับคำแนะนำการใช้งานงาน

**ตัวอย่าง:**

```bash
# รับคำแนะนำสำหรับสิ่งประดิษฐ์ถัดไป
openspec instructions --change add-dark-mode

# รับคำแนะนำสำหรับสิ่งประดิษฐ์เฉพาะ
openspec instructions design --change add-dark-mode

# รับคำแนะนำการใช้งาน/การนำไปใช้
openspec instructions apply --change add-dark-mode

# JSON สำหรับการใช้งานโดยตัวแทน
openspec instructions design --change add-dark-mode --json
```

**เอาต์พุตรวมถึง:**

- เนื้อหาเทมเพลตสำหรับสิ่งประดิษฐ์
- บริบทโครงการจากการกำหนดค่า
- เนื้อหาจากสิ่งประดิษฐ์ที่เป็น dependency
- กฎสำหรับแต่ละสิ่งประดิษฐ์จากการกำหนดค่า

---

### `openspec templates`

แสดงเส้นทางเทมเพลตที่ถูกต้องสำหรับสิ่งประดิษฐ์ทั้งหมดในสคีมา

```
openspec templates [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--schema <name>` | สคีมาที่จะตรวจสอบ (ค่าเริ่มต้น: `spec-driven`) |
| `--json` | เอาต์พุตเป็น JSON |

**ตัวอย่าง:**

```bash
# แสดงเส้นทางเทมเพลตสำหรับสคีมาเริ่มต้น
openspec templates

# แสดงเทมเพลตสำหรับสคีมาที่กำหนดเอง
openspec templates --schema my-workflow

# JSON สำหรับการใช้งานแบบโปรแกรม
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

แสดงรายการสคีมาเวิร์กโฟลว์ที่มีอยู่พร้อมคำอธิบายและกระแสสิ่งประดิษฐ์

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

## คำสั่งสคีมา

คำสั่งสำหรับการสร้างและจัดการสคีมาเวิร์กโฟลว์ที่กำหนดเอง

### `openspec schema init`

สร้างสคีมาท้องถิ่นของโครงการใหม่

```
openspec schema init <name> [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `name` | ใช่ | ชื่อสคีมา (kebab-case) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--description <text>` | คำอธิบายสคีมา |
| `--artifacts <list>` | รหัสสิ่งประดิษฐ์คั่นด้วยจุลภาค (ค่าเริ่มต้น: `proposal,specs,design,tasks`) |
| `--default` | ตั้งเป็นสคีมาเริ่มต้นของโครงการ |
| `--no-default` | ไม่ถามเพื่อตั้งเป็นค่าเริ่มต้น |
| `--force` | เขียนทับสคีมาที่มีอยู่ |
| `--json` | เอาต์พุตเป็น JSON |

**ตัวอย่าง:**

```bash
# สร้างสคีมาแบบโต้ตอบ
openspec schema init research-first

# ไม่โต้ตอบพร้อมสิ่งประดิษฐ์เฉพาะ
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**สิ่งที่สร้าง:**

```
openspec/schemas/<name>/
├── schema.yaml           # คำจำกัดความสคีมา
└── templates/
    ├── proposal.md       # เทมเพลตสำหรับแต่ละสิ่งประดิษฐ์
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

คัดลอกสคีมาที่มีอยู่ไปยังโครงการของคุณเพื่อปรับแต่ง

```
openspec schema fork <source> [name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `source` | ใช่ | สคีมาที่จะคัดลอก |
| `name` | ไม่ | ชื่อสคีมาใหม่ (ค่าเริ่มต้น: `<source>-custom`) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--force` | เขียนทับปลายทางที่มีอยู่ |
| `--json` | เอาต์พุตเป็น JSON |

**ตัวอย่าง:**

```bash
# แยกสคีมา spec-driven ในตัว
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

ตรวจสอบความถูกต้องของโครงสร้างและเทมเพลตของสคีมา

```
openspec schema validate [name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `name` | ไม่ | สคีมาที่จะตรวจสอบความถูกต้อง (ตรวจสอบทั้งหมดหากละเว้น) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--verbose` | แสดงขั้นตอนการตรวจสอบความถูกต้องโดยละเอียด |
| `--json` | เอาต์พุตเป็น JSON |

**ตัวอย่าง:**

```bash
# ตรวจสอบความถูกต้องของสคีมาเฉพาะ
openspec schema validate my-workflow

# ตรวจสอบความถูกต้องของสคีมาทั้งหมด
openspec schema validate
```

---

### `openspec schema which`

แสดงแหล่งที่มาของสคีมา (มีประโยชน์สำหรับการดีบักลำดับความสำคัญ)

```
openspec schema which [name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็น | คำอธิบาย |
|----------|----------|-------------|
| `name` | ไม่ | ชื่อสคีมา |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--all` | แสดงรายการสคีมาทั้งหมดพร้อมแหล่งที่มา |
| `--json` | เอาต์พุตเป็น JSON |

**ตัวอย่าง:**

```bash
# ตรวจสอบแหล่งที่มาของสคีมา
openspec schema which spec-driven
```

**เอาต์พุต:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**ลำดับความสำคัญของสคีมา:**

1. โครงการ: `openspec/schemas/<name>/`
2. ผู้ใช้: `~/.local/share/openspec/schemas/<name>/`
3. แพ็กเกจ: สคีมาในตัว

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
| `get <key>` | รับค่าเฉพาะ |
| `set <key> <value>` | ตั้งค่า |
| `unset <key>` | ลบคีย์ |
| `reset` | รีเซ็ตเป็นค่าเริ่มต้น |
| `edit` | เปิดใน `$EDITOR` |
| `profile [preset]` | กำหนดค่าโปรไฟล์เวิร์กโฟลว์แบบโต้ตอบหรือผ่านค่าที่ตั้งไว้ |

**ตัวอย่าง:**

```bash
# แสดงเส้นทางไฟล์กำหนดค่า
openspec config path

# แสดงการตั้งค่าทั้งหมด
openspec config list

# รับค่าเฉพาะ
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

# กำหนดค่าโปรไฟล์ด้วยตัวช่วยสร้างที่ใช้การกระทำ
openspec config profile

# ค่าที่ตั้งไว้แบบเร็ว: สลับเวิร์กโฟลว์ไปที่แกนหลัก (รักษารูปแบบการจัดส่ง)
openspec config profile core
```

`openspec config profile` เริ่มต้นด้วยสรุปสถานะปัจจุบัน จากนั้นให้คุณเลือก:
- เปลี่ยนการจัดส่ง + เวิร์กโฟลว์
- เปลี่ยนเฉพาะการจัดส่ง
- เปลี่ยนเฉพาะเวิร์กโฟลว์
- รักษาการตั้งค่าปัจจุบัน (ออก)

หากคุณรักษาการตั้งค่าปัจจุบัน จะไม่มีการเขียนการเปลี่ยนแปลงและไม่แสดงพร้อมท์อัปเดต
หากไม่มีการเปลี่ยนแปลงการกำหนดค่า แต่ไฟล์โปรเจกต์ปัจจุบันไม่ตรงกับโปรไฟล์/การจัดส่งทั่วไปของคุณ OpenSpec จะแสดงคำเตือนและแนะนำให้รัน `openspec update`
การกด `Ctrl+C` จะยกเลิกโฟลว์อย่างเรียบร้อย (ไม่มี stack trace) และออกด้วยรหัส `130`
ในรายการตรวจสอบเวิร์กโฟลว์ `[x]` หมายความว่าเวิร์กโฟลว์ถูกเลือกในการกำหนดค่าทั่วไป หากต้องการใช้การเลือกเหล่านั้นกับไฟล์โปรเจกต์ ให้รัน `openspec update` (หรือเลือก `ใช้การเปลี่ยนแปลงกับโปรเจกต์นี้ทันที?` เมื่อได้รับพร้อมท์ภายในโปรเจกต์)

**ตัวอย่างแบบโต้ตอบ:**

```bash
# อัปเดตเฉพาะการจัดส่ง
openspec config profile
# เลือก: เปลี่ยนเฉพาะการจัดส่ง
# เลือกการจัดส่ง: เฉพาะทักษะ

# อัปเดตเฉพาะเวิร์กโฟลว์
openspec config profile
# เลือก: เปลี่ยนเฉพาะเวิร์กโฟลว์
# สลับเวิร์กโฟลว์ในรายการตรวจสอบ จากนั้นยืนยัน
```

---

## คำสั่งอรรถประโยชน์

### `openspec feedback`

ส่งข้อเสนอแนะเกี่ยวกับ OpenSpec สร้างปัญหา GitHub

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

**ข้อกำหนด:** ต้องติดตั้งและยืนยันตัวตน GitHub CLI (`gh`)

**ตัวอย่าง:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

จัดการการเติมคำสั่งอัตโนมัติของเชลล์สำหรับ CLI ของ OpenSpec

```
openspec completion <subcommand> [shell]
```

**คำสั่งย่อย:**

| คำสั่งย่อย | คำอธิบาย |
|------------|-------------|
| `generate [shell]` | เอาต์พุตสคริปต์เติมคำสั่งอัตโนมัติไปยัง stdout |
| `install [shell]` | ติดตั้งการเติมคำสั่งอัตโนมัติสำหรับเชลล์ของคุณ |
| `uninstall [shell]` | ลบการเติมคำสั่งอัตโนมัติที่ติดตั้งไว้ |

**เชลล์ที่รองรับ:** `bash`, `zsh`, `fish`, `powershell`

**ตัวอย่าง:**

```bash
# ติดตั้งการเติมคำสั่งอัตโนมัติ (ตรวจจับเชลล์อัตโนมัติ)
openspec completion install

# ติดตั้งสำหรับเชลล์เฉพาะ
openspec completion install zsh

# สร้างสคริปต์สำหรับการติดตั้งด้วยตนเอง
openspec completion generate bash > ~/.bash_completion.d/openspec

# ถอนการติดตั้ง
openspec completion uninstall
```

---

## รหัสออก

| รหัส | ความหมาย |
|------|---------|
| `0` | สำเร็จ |
| `1` | ข้อผิดพลาด (การตรวจสอบล้มเหลว, ไฟล์ขาดหาย เป็นต้น) |

---

## ตัวแปรสภาพแวดล้อม

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | ตั้งเป็น `0` เพื่อปิดใช้งานเทเลเมทรี |
| `DO_NOT_TRACK` | ตั้งเป็น `1` เพื่อปิดใช้งานเทเลเมทรี (สัญญาณ DNT มาตรฐาน) |
| `OPENSPEC_CONCURRENCY` | การทำงานพร้อมกันเริ่มต้นสำหรับการตรวจสอบจำนวนมาก (ค่าเริ่มต้น: 6) |
| `EDITOR` หรือ `VISUAL` | ตัวแก้ไขสำหรับ `openspec config edit` |
| `NO_COLOR` | ปิดใช้งานเอาต์พุตสีเมื่อตั้งค่า |

---

## เอกสารที่เกี่ยวข้อง

- [Commands](commands.md) - คำสั่ง AI slash (`/opsx:propose`, `/opsx:apply` เป็นต้น)
- [Workflows](workflows.md) - รูปแบบทั่วไปและเมื่อใดควรใช้คำสั่งแต่ละคำสั่ง
- [Customization](customization.md) - สร้างสคีมาและเทมเพลตที่กำหนดเอง
- [Getting Started](getting-started.md) - คู่มือการตั้งค่าครั้งแรก