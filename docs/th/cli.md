# การอ้างอิง CLI

OpenSpec CLI (`openspec`) ให้คำสั่งเทอร์มินัลสำหรับการตั้งค่าโครงการ การตรวจสอบความถูกต้อง การตรวจสอบสถานะ และการจัดการ คำสั่งเหล่านี้เสริมคำสั่งสแลชของ AI (เช่น `/opsx:propose`) ที่บันทึกไว้ใน [Commands](commands.md)

## สรุป

| Category | Commands | Purpose |
|----------|----------|---------|
| **Setup** | `init`, `update` | เริ่มต้นและอัปเดต OpenSpec ในโครงการของคุณ |
| **Stores (standalone OpenSpec repos)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | จัดการ Stores — repositories ของ OpenSpec แบบสแตนด์อโลนที่คุณได้ลงทะเบียนไว้ |
| **Health** | `doctor` | รายงานสุขภาพความสัมพันธ์สำหรับ Root ที่ถูกแก้ไขแล้ว |
| **Working context** | `context` | ประกอบชุดการทำงาน (root + stores ที่อ้างถึง) |
| **Personal worksets** | `workset create`, `workset list`, `workset open`, `workset remove` | เก็บและเปิดมุมมองการทำงานส่วนตัวในเครื่องมือของคุณ |
| **Browsing** | `list`, `view`, `show` | สำรวจการเปลี่ยนแปลงและสเปค |
| **Validation** | `validate` | ตรวจสอบการเปลี่ยนแปลงและสเปคเพื่อหาปัญหา |
| **Lifecycle** | `archive` | สรุปการเปลี่ยนแปลงที่เสร็จสมบูรณ์แล้ว |
| **Workflow** | `new change`, `status`, `instructions`, `templates`, `schemas` | รองรับเวิร์กโฟลว์ที่ขับเคลื่อนด้วย Artifacts |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | สร้างและจัดการเวิร์กโฟลว์แบบกำหนดเอง |
| **Config** | `config` | ดูและแก้ไขการตั้งค่า |
| **Utility** | `feedback`, `completion` | ข้อเสนอแนะและการรวมเข้ากับ Shell |

---

## คำสั่งสำหรับมนุษย์เทียบกับเอเจนต์

คำสั่ง CLI ส่วนใหญ่ถูกออกแบบมาสำหรับการใช้งานโดย **มนุษย์** ในเทอร์มินัล ขณะที่บางคำสั่งก็รองรับการใช้งานโดย **เอเจนต์/สคริปต์** ผ่านเอาต์พุต JSON

### คำสั่งสำหรับมนุษย์เท่านั้น

คำสั่งเหล่านี้เป็นแบบโต้ตอบ (interactive) และออกแบบมาสำหรับการใช้ในเทอร์มินัล:

| Command | วัตถุประสงค์ |
|---------|---------|
| `openspec init` | เริ่มต้นโปรเจกต์ (พร้อมการแจ้งเตือนแบบโต้ตอบ) |
| `openspec view` | แดชบอร์ดแบบโต้ตอบ |
| `openspec workset open <name>` | เปิดเวิร์คเซตที่บันทึกไว้ (หน้าต่าง editor หรือเซสชันเอเจนต์เทอร์มินัล) |
| `openspec config edit` | เปิดไฟล์คอนฟิกใน editor |
| `openspec feedback` | ส่งข้อเสนอแนะผ่าน GitHub |
| `openspec completion install` | ติดตั้ง shell completions |

### คำสั่งที่เข้ากันได้กับเอเจนต์

คำสั่งเหล่านี้รองรับเอาต์พุต `--json` สำหรับการใช้งานเชิงโปรแกรมโดย AI agents และสคริปต์:

| Command | การใช้งานของมนุษย์ | การใช้งานของเอเจนต์ |
|---------|-----------|-----------|
| `openspec list` | เรียกดูการเปลี่ยนแปลง/ข้อกำหนด (specs) | `--json` สำหรับข้อมูลที่มีโครงสร้าง |
| `openspec show <item>` | อ่านเนื้อหา | `--json` สำหรับการแยกวิเคราะห์ (parsing) |
| `openspec validate` | ตรวจสอบปัญหา | `--all --json` สำหรับการตรวจสอบจำนวนมาก |
| `openspec status` | ดูความคืบหน้าของอาร์ติแฟกต์ | `--json` สำหรับสถานะที่มีโครงสร้าง |
| `openspec instructions` | รับขั้นตอนถัดไป | `--json` สำหรับคำสั่งเอเจนต์ |
| `openspec templates` | ค้นหาพาธเทมเพลต | `--json` สำหรับการแก้ไขเส้นทาง (path resolution) |
| `openspec schemas` | รายชื่อสคีมาที่มีอยู่ | `--json` สำหรับการค้นพบสคีมา |
| `openspec store setup <id>` | สร้างและลงทะเบียนที่เก็บข้อมูลในเครื่อง (local store) | `--json` พร้อมอินพุตที่ชัดเจนสำหรับเอาต์พุตการตั้งค่าแบบมีโครงสร้าง |
| `openspec store register <path>` | ลงทะเบียนที่เก็บข้อมูลที่มีอยู่ | `--json` สำหรับเอาต์พุตการลงทะเบียนแบบมีโครงสร้าง |
| `openspec store unregister <id>` | ลืมการลงทะเบียนที่เก็บข้อมูลในเครื่อง | `--json` สำหรับเอาต์พุตการทำความสะอาดแบบมีโครงสร้าง |
| `openspec store remove <id>` | ลบโฟลเดอร์ที่เก็บข้อมูลที่ลงทะเบียนไว้ | `--yes --json` สำหรับการลบที่ไม่โต้ตอบ |
| `openspec store list` | เรียกดูที่เก็บข้อมูลที่ลงทะเบียนแล้ว | `--json` สำหรับรายการที่มีโครงสร้าง |
| `openspec store doctor` | ตรวจสอบการตั้งค่าของที่เก็บข้อมูลในเครื่อง | `--json` สำหรับการวินิจฉัยแบบมีโครงสร้าง |
| `openspec new change <id>` | สร้างโครงร่างการเปลี่ยนแปลงระดับ repo (repo-local) | `--json`, พร้อม `--store <id>` เพื่อใช้ที่เก็บข้อมูลที่ลงทะเบียนเป็นรากของ OpenSpec |
| `openspec workset create [name]` | จัดทำมุมมองการทำงานส่วนบุคคล | `--member <path> --json` สำหรับการจัดทำที่ไม่โต้ตอบ |
| `openspec workset list` | เรียกดูเวิร์คเซตที่บันทึกไว้ | `--json` สำหรับมุมมองที่มีโครงสร้าง |
| `openspec workset remove <name>` | ลบมุมมองที่บันทึกไว้ | `--yes --json` สำหรับการลบที่ไม่โต้ตอบ |

---

## ตัวเลือกทั่วไป (Global Options)

ตัวเลือกเหล่านี้ใช้งานได้กับคำสั่งทั้งหมด:

| Option | คำอธิบาย |
|--------|-------------|
| `--version`, `-V` | แสดงหมายเลขเวอร์ชัน |
| `--no-color` | ปิดการแสดงผลสี |
| `--help`, `-h` | แสดงความช่วยเหลือสำหรับคำสั่ง |

---

## คำสั่งสำหรับการตั้งค่า (Setup Commands)

### `openspec init`

เริ่มต้น OpenSpec ในโปรเจกต์ของคุณ สร้างโครงสร้างโฟลเดอร์และกำหนดค่าการผสานรวมเครื่องมือ AI

พฤติกรรมเริ่มต้นใช้ค่าคอนฟิกทั่วไป: โปรไฟล์ `core`, การส่งมอบ `both`, และเวิร์คโฟลว์ `propose, explore, apply, sync, archive`

```
openspec init [path] [options]
```

**Arguments:**

| Argument | จำเป็นหรือไม่ | คำอธิบาย |
|----------|----------|-------------|
| `path` | ไม่ | ไดเรกทอรีเป้าหมาย (ค่าเริ่มต้น: ไดเรกทอรีปัจจุบัน) |

**Options:**

| Option | คำอธิบาย |
|--------|-------------|
| `--tools <list>` | กำหนดค่าเครื่องมือ AI แบบไม่โต้ตอบ ใช้ `all`, `none` หรือรายการที่คั่นด้วยคอมม่า |
| `--force` | ทำความสะอาดไฟล์เก่าโดยอัตโนมัติโดยไม่ต้องแจ้งเตือน |
| `--profile <profile>` | เขียนทับโปรไฟล์ทั่วไปสำหรับการรัน init นี้ (`core` หรือ `custom`) |

`--profile custom` ใช้เวิร์คโฟลว์ที่เลือกไว้ในคอนฟิกทั่วไป (`openspec config profile`)

**ID เครื่องมือที่รองรับ (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> รายการนี้สะท้อนถึง `AI_TOOLS` ใน `src/core/config.ts` ดู [Supported Tools](supported-tools.md) สำหรับความสามารถและพาธคำสั่งของเครื่องมือแต่ละตัว

**ตัวอย่าง:**

```bash
# การเริ่มต้นแบบโต้ตอบ
openspec init

# เริ่มต้นในไดเรกทอรีที่ระบุ
openspec init ./my-project

# ไม่โต้ตอบ: กำหนดค่าสำหรับ Claude และ Cursor
openspec init --tools claude,cursor

# กำหนดค่าสำหรับเครื่องมือที่รองรับทั้งหมด
openspec init --tools all

# เขียนทับโปรไฟล์สำหรับการรันนี้
openspec init --profile core

# ข้ามการแจ้งเตือนและทำความสะอาดไฟล์เก่าโดยอัตโนมัติ
openspec init --force
```

**สิ่งที่สร้างขึ้น:**

```
openspec/
├── specs/              # ข้อกำหนดของคุณ (แหล่งความจริง)
├── changes/            # การเปลี่ยนแปลงที่เสนอ
└── config.yaml         # คอนฟิกของโปรเจกต์

.claude/skills/         # ทักษะ Claude Code (หากเลือก claude)
.cursor/skills/         # ทักษะ Cursor (หากเลือก cursor)
.cursor/commands/       # คำสั่ง OPSX ของ Cursor (หากการส่งมอบรวมคำสั่ง)
... (คอนฟิกเครื่องมืออื่น ๆ)
```

---

### `openspec update`

อัปเดตไฟล์คำสั่ง OpenSpec หลังจากอัพเกรด CLI สร้างไฟล์คอนฟิกของ AI tool ใหม่โดยใช้โปรไฟล์ทั่วไปที่เลือก เวิร์คโฟลว์ และโหมดการส่งมอบปัจจุบันของคุณ

```
openspec update [path] [options]
```

**Arguments:**

| Argument | จำเป็นหรือไม่ | คำอธิบาย |
|----------|----------|-------------|
| `path` | ไม่ | ไดเรกทอรีเป้าหมาย (ค่าเริ่มต้น: ไดเรกทอรีปัจจุบัน) |

**Options:**

| Option | คำอธิบาย |
|--------|-------------|
| `--force` | บังคับอัปเดตแม้ว่าไฟล์จะทันสมัยแล้วก็ตาม |

**ตัวอย่าง:**

```bash
# อัปเดตไฟล์คำสั่งหลังจาก npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## ที่เก็บข้อมูล (Stores) (OpenSpec repos แบบสแตนด์อโลน)

> **เบต้า** ที่เก็บข้อมูลและคุณสมบัติที่สร้างขึ้นบนมัน (การอ้างอิง, บริบทการทำงาน, เวิร์คเซต) ยังใหม่; ชื่อคำสั่ง, ธง (flags), รูปแบบไฟล์ และเอาต์พุต JSON อาจมีการเปลี่ยนแปลงระหว่างรุ่น สำหรับการเดินตามแนวคิดที่เน้นปัญหา ให้ดู [stores guide](stores-beta/user-guide.md)

ที่เก็บข้อมูล (Store) คือ repo OpenSpec แบบสแตนด์อโลนที่คุณลงทะเบียนไว้ในเครื่องนี้ — เช่น repo การวางแผน หรือ repo สัญญา การลงทะเบียนที่เก็บข้อมูลช่วยให้คำสั่งปกติ (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) ทำงานในนั้นจากทุกที่โดยการส่ง `--store <id>`

### `openspec store setup`

สร้างและลงทะเบียนที่เก็บข้อมูลในเครื่อง ด้วยไม่มีอาร์กิวเมนต์ในเทอร์มินัล OpenSpec จะแนะนำผู้ใช้ผ่านขั้นตอนการตั้งค่า เอเจนต์และสคริปต์ควรส่งอินพุตที่ชัดเจนและใช้ `--json`

```bash
openspec store setup [id] [options]
```

**Options:**

| Option | คำอธิบาย |
|--------|-------------|
| `--path <path>` | โฟลเดอร์ที่ที่เก็บข้อมูลควรอยู่ (ตัวอย่างเช่น `~/openspec/<id>`) |
| `--remote <url>` | บันทึกรีโมทที่เป็นมาตรฐานใน `store.yaml` ของที่เก็บข้อมูลใหม่ |
| `--init-git` | เริ่มต้น Git repository ด้วย commit เริ่มต้น (ค่าเริ่มต้น) |
| `--no-init-git` | ข้ามการดำเนินการ Git ทั้งหมด: ไม่เริ่ม, ไม่มี commit เริ่มต้น |
| `--json` | เอาต์พุต JSON |

การรันแบบไม่โต้ตอบ (`--json`, สคริปต์, เอเจนต์) ต้องส่งทั้ง id ของที่เก็บข้อมูลและ `--path` ในเทอร์มินัลแบบโต้ตอบ จะมีการแจ้งเตือนตำแหน่งด้วยข้อเสนอแนะที่แก้ไขได้ในตำแหน่งที่มองเห็นได้และเป็นของผู้ใช้ (ตัวอย่างเช่น `~/openspec/<id>`); มันจะไม่ตั้งค่าเริ่มต้นไปยังไดเรกทอรีข้อมูลที่จัดการโดย OpenSpec

**ตัวอย่าง:**

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

ลงทะเบียนโฟลเดอร์ที่เก็บข้อมูลในเครื่องที่มีอยู่

```bash
openspec store register [path] [options]
```

**Options:**

| Option | คำอธิบาย |
|--------|-------------|
| `--id <id>` | id ของที่เก็บข้อมูล; ค่าเริ่มต้นคือเมตาดาต้าของที่เก็บข้อมูลหรือชื่อโฟลเดอร์ |
| `--yes` | ยืนยันการสร้างเมตาดาต้าตัวตนของที่เก็บข้อมูลสำหรับราก OpenSpec ที่สมบูรณ์ |
| `--json` | เอาต์พุต JSON |

### `openspec store unregister`

ลืมการลงทะเบียนที่เก็บข้อมูลในเครื่องโดยไม่ลบไฟล์

```bash
openspec store unregister <id> [--json]
```

ใช้สิ่งนี้เมื่อมีการย้ายที่เก็บข้อมูล, โคลนไปยังที่อื่น, หรือไม่ควรแสดงโดย OpenSpec ในเครื่องนี้อีกต่อไป

### `openspec store remove`

ลืมการลงทะเบียนที่เก็บข้อมูลในเครื่องและลบโฟลเดอร์ท้องถิ่นของมัน

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` แสดงโฟลเดอร์ที่แน่นอนก่อนที่จะลบในเทอร์มินัลแบบโต้ตอบ เอเจนต์, สคริปต์ และผู้เรียก JSON ต้องส่ง `--yes` เพื่อยืนยันการลบ OpenSpec ปฏิเสธที่จะลบโฟลเดอร์ที่ไม่มีเมตาดาต้าของที่เก็บข้อมูลที่ตรงกัน

### `openspec store list`

แสดงรายการที่เก็บข้อมูลที่ลงทะเบียนในเครื่อง

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

ตรวจสอบการลงทะเบียนที่เก็บข้อมูลในเครื่อง, เมตาดาต้า และสถานะ Git

```bash
openspec store doctor [id] [--json]
```

Doctor เป็นแบบวินิจฉัยเท่านั้น; มันรายงานรากที่ขาดหายไป, ข้อผิดพลาดของเมตาดาต้า และสถานะรีจิสทรีในเครื่องที่ไม่ถูกต้องโดยไม่แก้ไขที่เก็บข้อมูล

### การอ้างอิงที่เก็บข้อมูลจากโปรเจกต์

repo โปรเจกต์สามารถประกาศว่าเวิร์คของมันดึงมาจากที่เก็บข้อมูลใดได้ใน `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

นับจากนั้น, เอาต์พุตของ `openspec instructions` ใน repo นั้น (ทั้งส่วนต่ออาร์ติแฟกต์และ `apply`, โหมด JSON และมนุษย์) จะมีการระบุดัชนีของสเปคของที่เก็บข้อมูลที่ถูกอ้างอิง — id ของสเปค, สรุปหนึ่งบรรทัดจากส่วนวัตถุประสงค์ (Purpose) ของแต่ละสเปค, และคำสั่ง fetch (`openspec show <spec-id> --type spec --store <id>`) ดัชนีนี้สร้างขึ้นแบบสดจากการเช็คเอาต์ที่ลงทะเบียนในทุกการรัน; เนื้อหาของสเปคจะไม่ถูกคัดลอกไปยังเอาต์พุต

การอ้างอิงเป็นบริบทแบบอ่านอย่างเดียว พวกมันไม่เคยเปลี่ยนแปลงว่าคำสั่งทำงานที่ใด: งานยังคงอยู่ในรากของ repo เอง และการเขียนไปยังที่เก็บข้อมูลที่ถูกอ้างอิงยังคงเป็นการดำเนินการ `--store` ที่ชัดเจน การอ้างอิงที่ไม่สามารถแก้ไขได้ (เช่น, ที่เก็บข้อมูลที่ไม่ได้ลงทะเบียนในเครื่องนี้) จะลดระดับเป็นคำเตือนในดัชนีพร้อมการแก้ไขที่แน่นอน และคำสั่งก็ยังคงสร้างขึ้น `openspec doctor` รายงานสุขภาพของการอ้างอิงในที่เดียว

### การบันทึกว่าที่เก็บข้อมูลถูกโคลนมาจากไหน

ที่เก็บข้อมูลสามารถบันทึกแหล่งที่มาของโคลนที่เป็นมาตรฐาน (canonical clone source) ในไฟล์ตัวตนที่คอมมิตได้ ดังนั้นการเริ่มต้นจึงไม่จบลงที่ "ลงทะเบียนที่เก็บข้อมูล":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

รีโมทจะถูกบันทึกใน `.openspec-store/store.yaml` ภายใน commit เริ่มต้น ดังนั้นทุกการโคลนจึงเกิดมาพร้อมกับการรับรู้สิ่งนี้ สำหรับที่เก็บข้อมูลที่มีอยู่ ให้แก้ไข `store.yaml` ด้วยตนเองและคอมมิต `store doctor` แสดงรีโมทที่บันทึกไว้ (และ Git origin ที่สังเกตได้จากการเช็คเอาต์); setup/register ตั้งชื่อตามแนวทางของเครื่อง; และ register บันทึก origin ของการเช็คเอาต์ในรีจิสทรีระดับเครื่อง

การประกาศการอ้างอิงสามารถบรรทุกแหล่งโคลนได้เช่นกัน ดังนั้นเพื่อนร่วมทีมที่ยังไม่มีที่เก็บข้อมูลจะได้รับวิธีแก้ไขที่สมบูรณ์และคัดลอกได้ (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

การบันทึกรีโมทไม่ใช่การซิงค์: OpenSpec ไม่เคยโคลน, ดึง (pull), หรือผลัก (push) ด้วยตัวเอง

### การประกาศที่เก็บข้อมูลเริ่มต้น (Default Store)

repo ที่การวางแผนทั้งหมดถูกภายนอก — ไม่มี `openspec/specs/` หรือ `openspec/changes/` ในเครื่อง — สามารถประกาศที่เก็บข้อมูลของตนได้เพียงครั้งเดียวแทนที่จะส่ง `--store` ในทุกคำสั่ง:

```yaml
# openspec/config.yaml (ไฟล์เดียวภายใต้ openspec/)
store: team-context
```

คำสั่งปกติจะแก้ไขเป็นที่เก็บข้อมูลที่ประกาศโดยอัตโนมัติ; แถบรากและบล็อก `root` ของ JSON รายงาน `source: "declared"` พร้อม id ของที่เก็บข้อมูล และคำแนะนำที่พิมพ์ยังคงมี `--store <id>` การประกาศเป็นการสำรอง (fallback) ไม่ใช่การเขียนทับ: `--store` ที่ชัดเจนจะชนะเสมอ และไดเรกทอรีที่มีโฟลเดอร์การวางแผนจริงจะเพิกเฉยต่อตัวชี้ (พร้อมคำเตือน) ในการแปลง repo ตัวชี้ให้เป็นราก OpenSpec ท้องถิ่น ให้ลบบรรทัด `store:` และรัน `openspec init` — init ปฏิเสธที่จะสร้างโครงร่างในขณะที่การประกาศมีอยู่

## Doctor (สุขภาพความสัมพันธ์)

คำถามแบบอ่านอย่างเดียวหนึ่งข้อ หนึ่งสถานที่: คือ OpenSpec root มีสุขภาพดีหรือไม่ และ stores ที่มันอ้างถึงมีอยู่ในเครื่องนี้หรือไม่?

```bash
openspec doctor [--store <id>] [--json]
```

รายงานจะแยกสุขภาพของ root, สุขภาพ metadata ของ store (รวมถึงหมายเหตุเมื่อ remote ที่บันทึกไว้และ origin ของ checkout แตกต่างกัน) และสุขภาพของการอ้างอิง (การวินิจฉัยเดียวกันที่แสดงขึ้น โดยมีการแก้ไข clone สำหรับการอ้างอิงที่ยังไม่ได้รับการแก้ไข) การค้นพบด้านสุขภาพใด ๆ ไม่ว่าจะระดับใด จะออกจาก 0 — agents อ่านอาเรย์ `status`; มีเพียงความล้มเหลวของคำสั่งเท่านั้น (ไม่มี root, store ที่ไม่ทราบ) จึงจะออก 1 Doctor ไม่เคยทำการ clone, sync หรือซ่อมแซม เพื่อรับชุดที่ประกอบแล้วแทนที่จะเป็นสุขภาพ ให้ใช้ `openspec context`

## Working context (ชุดที่ประกอบแล้ว)

ทุกสิ่งที่งานนี้เกี่ยวข้องผ่าน OpenSpec declarations ในชุดทำงานเดียว: คือ OpenSpec root และ stores ที่มันอ้างถึง

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON brief สามารถนำไปใช้โดย agent ได้ (stores ที่อ้างถึงที่มีอยู่แต่ละตัวมีสูตรการดึงข้อมูลของตัวเอง; สมาชิกที่ยังไม่ได้รับการแก้ไขมีการแก้ไขคำแนะนำเดียวกันและ doctor แสดง) `--code-workspace` ยังเขียนไฟล์ VS Code workspace ซึ่งประกอบด้วย root บวกกับ stores ที่อ้างถึงที่มีอยู่ (`ref:<id>` folders) — นี่คือสิ่งเดียวที่คำสั่งนี้ทำ และจะถูกปฏิเสธหากไฟล์มีอยู่โดยไม่มี `--force` สมาชิกที่ไม่พร้อมใช้งานจะถูกรายงาน ไม่เคยคาดเดา

"Working context" คือชุดที่ประกอบแล้ว; ฟิลด์ `context:` ใน `openspec/config.yaml` คือพื้นหลังของโปรเจกต์ที่ฉีดเข้าไปในคำแนะนำ — เป็นคนละสิ่งกัน `openspec doctor` ตอบว่าชุดนั้นมีสุขภาพดีหรือไม่; `openspec context` ตอบว่าชุดนั้นคืออะไร

## ชุดงานส่วนบุคคล

> **เบต้า** ชุดงานเป็นส่วนหนึ่งของพื้นผิวเบต้าใหม่; คำสั่ง, ธง (flags) และรูปแบบไฟล์อาจมีการเปลี่ยนแปลงระหว่างการเปิดตัว สำหรับคู่มือการใช้งาน โปรดดู [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

ชุดงานคือมุมมองส่วนบุคคลที่มีชื่อของโฟลเดอร์ที่คุณทำงานร่วมกัน — ซึ่งประกอบด้วย root การวางแผนและสิ่งอื่น ๆ ที่คุณเลือก — ที่เก็บไว้ในเครื่องของคุณและเปิดขึ้นตามชื่อในเครื่องมือของคุณ มันเป็นแบบโลคอลโดยสมบูรณ์: ไม่เคยถูก commit, ไม่เคยถูกแชร์, ไม่ได้มาจาก declaration และการลบชุดงานจะไม่กระทบต่อโฟลเดอร์สมาชิก

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` จะรันขั้นตอนแบบมีไกด์สั้น ๆ (หรือรับธง `--member` แบบไม่โต้ตอบ; สมาชิกคนแรกคือหลัก — เซสชันจะเริ่มต้นที่นั่น) `open` จะเปิดเครื่องมือที่เลือก: ตัวแก้ไข (VS Code, Cursor) จะเปิดหน้าต่างที่มีสมาชิกทุกคนและส่งคืนค่า; เอเจนต์ CLI (Claude Code, codex) จะเข้าควบคุมเทอร์มินัลนี้เป็นเซสชันพร้อมกับสมาชิกทุกคนแนบอยู่โดยไม่มี prompt กรอกไว้ล่วงหน้า และจะสิ้นสุดลงเมื่อคุณออกจากระบบ โฟลเดอร์สมาชิกที่ขาดหายไปในขณะเปิดจะถูกข้ามพร้อมบันทึก; ส่วนที่เหลือจะเปิดขึ้น การตั้งค่าเครื่องมือที่บันทึกสามารถถูกแทนที่ได้ต่อการเปิดด้วย `--tool`

การรองรับเครื่องมือใหม่คือการกำหนดค่า ไม่ใช่โค้ด ทุกเครื่องมือเป็นหนึ่งในสองรูปแบบการเปิด — `workspace-file` (เปิดโดยใช้ `.code-workspace` ที่สร้างขึ้น) หรือ `attach-dirs` (ธงแนบต่อสมาชิกแต่ละคน) — และคีย์ `openers` ในไฟล์ `config.json` ทั่วโลก (เปิดด้วย `openspec config edit`) จะเพิ่มเครื่องมือหรือปรับแต่ง built-in ตามฟิลด์:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

สถานะของชุดงานทั้งหมดจะถูกเก็บไว้ในโฟลเดอร์ `worksets/` ของไดเรกทอรีข้อมูลทั่วโลก (มุมมองที่บันทึกและไฟล์ `<name>.code-workspace` ที่สร้างขึ้น ซึ่งสร้างใหม่ทุกครั้งที่เปิด); การลบโฟลเดอร์นั้นจะลบร่องรอยทั้งหมด

---

## คำสั่งการเรียกดู (Browsing Commands)

### `openspec list`

แสดงรายการการเปลี่ยนแปลงหรือสเปคในโปรเจกต์ของคุณ

```
openspec list [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--specs` | แสดงรายการสเปคแทนการเปลี่ยนแปลง |
| `--changes` | แสดงรายการการเปลี่ยนแปลง (ค่าเริ่มต้น) |
| `--sort <order>` | เรียงตาม `recent` (ล่าสุด) (ค่าเริ่มต้น) หรือ `name` (ชื่อ) |
| `--json` | ส่งออกเป็น JSON |

**ตัวอย่าง:**

```bash
# แสดงรายการการเปลี่ยนแปลงทั้งหมดที่ใช้งานอยู่
openspec list

# แสดงรายการสเปคทั้งหมด
openspec list --specs

# การส่งออก JSON สำหรับสคริปต์
openspec list --json
```

**ผลลัพธ์ (ข้อความ):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

แสดงแดชบอร์ดแบบโต้ตอบสำหรับการสำรวจสเปคและการเปลี่ยนแปลง

```
openspec view
```

เปิดอินเทอร์เฟซที่ใช้เทอร์มินัลเพื่อนำทางสเปคและการเปลี่ยนแปลงของโปรเจกต์ของคุณ

---

### `openspec show`

แสดงรายละเอียดของการเปลี่ยนแปลงหรือสเปค

```
openspec show [item-name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็นหรือไม่ | คำอธิบาย |
|----------|----------|-------------|
| `item-name` | ไม่ | ชื่อของการเปลี่ยนแปลงหรือสเปค (จะ prompt หากละไว้) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--type <type>` | ระบุประเภท: `change` หรือ `spec` (ตรวจจับอัตโนมัติหากไม่กำกวม) |
| `--json` | ส่งออกเป็น JSON |
| `--no-interactive` | ปิดการใช้งาน prompt |

**ตัวเลือกเฉพาะสำหรับการเปลี่ยนแปลง:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--deltas-only` | แสดงเฉพาะสเปคเดลต้า (โหมด JSON) |

**ตัวเลือกเฉพาะสำหรับสเปค:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--requirements` | แสดงเฉพาะข้อกำหนด, ยกเว้นสถานการณ์ (โหมด JSON) |
| `--no-scenarios` | ยกเว้นเนื้อหาสถานการณ์ (โหมด JSON) |
| `-r, --requirement <id>` | แสดงข้อกำหนดที่เฉพาะเจาะจงตามดัชนี 1 (โหมด JSON) |

**ตัวอย่าง:**

```bash
# การเลือกแบบโต้ตอบ
openspec show

# แสดงการเปลี่ยนแปลงที่เฉพาะเจาะจง
openspec show add-dark-mode

# แสดงสเปคที่เฉพาะเจาะจง
openspec show auth --type spec

# การส่งออก JSON สำหรับการแยกวิเคราะห์
openspec show add-dark-mode --json
```

---

## คำสั่งการตรวจสอบความถูกต้อง (Validation Commands)

### `openspec validate`

ตรวจสอบความถูกต้องของการเปลี่ยนแปลงและสเปคสำหรับปัญหาเชิงโครงสร้าง

```
openspec validate [item-name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็นหรือไม่ | คำอธิบาย |
|----------|----------|-------------|
| `item-name` | ไม่ | รายการที่เฉพาะเจาะจงเพื่อตรวจสอบความถูกต้อง (จะ prompt หากละไว้) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--all` | ตรวจสอบการเปลี่ยนแปลงและสเปคทั้งหมด |
| `--changes` | ตรวจสอบการเปลี่ยนแปลงทั้งหมด |
| `--specs` | ตรวจสอบสเปคทั้งหมด |
| `--type <type>` | ระบุประเภทเมื่อชื่อไม่ชัดเจน: `change` หรือ `spec` |
| `--strict` | เปิดใช้งานโหมดการตรวจสอบที่เข้มงวด |
| `--json` | ส่งออกเป็น JSON |
| `--concurrency <n>` | การตรวจสอบแบบขนานสูงสุด (ค่าเริ่มต้น: 6, หรือ env `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | ปิดการใช้งาน prompt |

**ตัวอย่าง:**

```bash
# การตรวจสอบความถูกต้องแบบโต้ตอบ
openspec validate

# ตรวจสอบการเปลี่ยนแปลงที่เฉพาะเจาะจง
openspec validate add-dark-mode

# ตรวจสอบการเปลี่ยนแปลงทั้งหมด
openspec validate --changes

# ตรวจสอบทุกอย่างพร้อมผลลัพธ์ JSON (สำหรับ CI/สคริปต์)
openspec validate --all --json

# การตรวจสอบที่เข้มงวดพร้อมความขนานที่เพิ่มขึ้น
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

## คำสั่งวงจรชีวิต (Lifecycle Commands)

### `openspec archive`

เก็บถาวรการเปลี่ยนแปลงที่เสร็จสมบูรณ์และรวมสเปคเดลต้าเข้ากับสเปคหลัก

```
openspec archive [change-name] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็นหรือไม่ | คำอธิบาย |
|----------|----------|-------------|
| `change-name` | ไม่ | การเปลี่ยนแปลงที่จะเก็บถาวร (จะ prompt หากละไว้) |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `-y, --yes` | ข้ามการแจ้งเตือนยืนยัน |
| `--skip-specs` | ข้ามการอัปเดตสเปค (สำหรับการเปลี่ยนแปลงเฉพาะโครงสร้างพื้นฐาน/เครื่องมือ/เอกสาร) |
| `--no-validate` | ข้ามการตรวจสอบความถูกต้อง (ต้องมีการยืนยัน) |

**ตัวอย่าง:**

```bash
# การเก็บถาวรแบบโต้ตอบ
openspec archive

# เก็บถาวรการเปลี่ยนแปลงที่เฉพาะเจาะจง
openspec archive add-dark-mode

# เก็บถาวรโดยไม่มี prompt (CI/สคริปต์)
openspec archive add-dark-mode --yes

# เก็บถาวรการเปลี่ยนแปลงเครื่องมือที่ไม่ส่งผลต่อสเปค
openspec archive update-ci-config --skip-specs
```

**สิ่งที่ทำ:**

1. ตรวจสอบความถูกต้องของการเปลี่ยนแปลง (เว้นแต่จะใช้ `--no-validate`)
2. แจ้งเตือนเพื่อยืนยัน (เว้นแต่จะใช้ `--yes`)
3. รวมสเปคเดลต้าเข้าใน `openspec/specs/`
4. ย้ายโฟลเดอร์การเปลี่ยนแปลงไปยัง `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## คำสั่งขั้นตอนการทำงาน (Workflow Commands)

คำสั่งเหล่านี้รองรับขั้นตอนการทำงาน OPSX ที่ขับเคลื่อนด้วยอาร์ติแฟกต์ พวกมันมีประโยชน์ทั้งสำหรับมนุษย์ที่ตรวจสอบความคืบหน้าและเอเจนต์ที่กำหนดขั้นตอนถัดไป

### `openspec new change`

สร้างไดเรกทอรีการเปลี่ยนแปลงและเมตาดาต้าที่ถูกตรวจสอบใน root OpenSpec ที่แก้ไขแล้ว

```bash
openspec new change <name> [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--description <text>` | คำอธิบายที่จะเพิ่มลงใน `index.md` |
| `--goal <text>` | เมตาดาต้าเป้าหมายที่สามารถบันทึกพร้อมกับการเปลี่ยนแปลงได้ |
| `--schema <name>` | สคีมาขั้นตอนการทำงานที่จะใช้ |
| `--store <id>` | ID ของร้านค้า (store) ที่จะใช้เป็น root OpenSpec (ร้านค้าคือ repo OpenSpec แบบสแตนด์อโลนที่คุณลงทะเบียนไว้) |
| `--json` | ส่งออก JSON |

**ตัวอย่าง:**

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

แสดงสถานะความสมบูรณ์ของอาร์ติแฟกต์สำหรับการเปลี่ยนแปลง

```
openspec status [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--change <id>` | ชื่อการเปลี่ยนแปลง (จะ prompt หากละไว้) |
| `--schema <name>` | การแทนที่สคีมา (ตรวจจับอัตโนมัติจาก config ของการเปลี่ยนแปลง) |
| `--json` | ส่งออกเป็น JSON |

**ตัวอย่าง:**

```bash
# ตรวจสอบสถานะแบบโต้ตอบ
openspec status

# สถานะสำหรับการเปลี่ยนแปลงที่เฉพาะเจาะจง
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

รับคำแนะนำที่ได้รับการเสริมเพื่อสร้างอาร์ติแฟกต์หรือใช้ภารกิจ (tasks) ใช้โดยเอเจนต์ AI เพื่อทำความเข้าใจว่าจะสร้างอะไรต่อไป

```
openspec instructions [artifact] [options]
```

**อาร์กิวเมนต์:**

| อาร์กิวเมนต์ | จำเป็นหรือไม่ | คำอธิบาย |
|----------|----------|-------------|
| `artifact` | ไม่ | ID ของอาร์ติแฟกต์: `proposal`, `specs`, `design`, `tasks`, หรือ `apply` |

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--change <id>` | ชื่อการเปลี่ยนแปลง (จำเป็นในโหมดที่ไม่โต้ตอบ) |
| `--schema <name>` | การแทนที่สคีมา |
| `--json` | ส่งออกเป็น JSON |

**กรณีพิเศษ:** ใช้ `apply` เป็นอาร์ติแฟกต์เพื่อรับคำแนะนำในการนำไปใช้งาน

**ตัวอย่าง:**

```bash
# รับคำแนะนำสำหรับอาร์ติแฟกต์ถัดไป
openspec instructions --change add-dark-mode

# รับคำแนะนำของอาร์ติแฟกต์ที่เฉพาะเจาะจง
openspec instructions design --change add-dark-mode

# รับคำแนะนำการนำไปใช้/การใช้งานจริง
openspec instructions apply --change add-dark-mode

# JSON สำหรับการบริโภคโดยเอเจนต์
openspec instructions design --change add-dark-mode --json
```

**ผลลัพธ์ประกอบด้วย:**

- เนื้อหาเทมเพลตสำหรับอาร์ติแฟกต์
- บริบทของโปรเจกต์จาก config
- เนื้อหาจากอาร์ติแฟกต์ที่ขึ้นอยู่กับสิ่งอื่น (dependency artifacts)
- กฎต่ออาร์ติแฟกต์จาก config

---

### `openspec templates`

แสดงเส้นทางเทมเพลตที่แก้ไขแล้วสำหรับอาร์ติแฟกต์ทั้งหมดในสคีมา

```
openspec templates [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--schema <name>` | สคีมาที่จะตรวจสอบ (ค่าเริ่มต้น: `spec-driven`) |
| `--json` | ส่งออกเป็น JSON |

**ตัวอย่าง:**

```bash
# แสดงเส้นทางเทมเพลตสำหรับสคีมาเริ่มต้น
openspec templates

# แสดงเทมเพลตสำหรับสคีมาที่กำหนดเอง
openspec templates --schema my-workflow

# JSON สำหรับการใช้งานเชิงโปรแกรม
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

แสดงรายการสคีมาขั้นตอนการทำงานที่มีอยู่พร้อมคำอธิบายและโฟลว์ของอาร์ติแฟกต์

```
openspec schemas [options]
```

**ตัวเลือก:**

| ตัวเลือก | คำอธิบาย |
|--------|-------------|
| `--json` | ส่งออกเป็น JSON |

**ตัวอย่าง:**

```bash
openspec schemas
```

**ผลลัพธ์:**

```
Available schemas:

  spec-driven (package)
    ขั้นตอนการพัฒนาแบบ spec-driven ค่าเริ่มต้น
    Flow: proposal → specs → design → tasks

  my-custom (project)
    ขั้นตอนการทำงานที่กำหนดเองสำหรับโปรเจกต์นี้
    Flow: research → proposal → tasks
```

## คำสั่ง Schema

คำสั่งสำหรับการสร้างและจัดการ schema เวิร์กโฟลว์แบบกำหนดเอง

### `openspec schema init`

สร้าง schema เฉพาะระดับโปรเจกต์ใหม่

```
openspec schema init <name> [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | Yes | ชื่อ schema (รูปแบบ kebab-case) |

**Options:**

| Option | Description |
|--------|-------------|
| `--description <text>` | คำอธิบายของ schema |
| `--artifacts <list>` | ID ของ artifact ที่คั่นด้วยเครื่องหมายจุลภาค (ค่าเริ่มต้น: `proposal,specs,design,tasks`) |
| `--default` | ตั้งเป็น schema ค่าเริ่มต้นของโปรเจกต์ |
| `--no-default` | ไม่แจ้งเตือนเพื่อตั้งเป็นค่าเริ่มต้น |
| `--force` | เขียนทับ schema ที่มีอยู่ |
| `--json` | แสดงผลในรูปแบบ JSON |

**Examples:**

```bash
# การสร้าง schema แบบโต้ตอบ
openspec schema init research-first

# แบบไม่โต้ตอบพร้อม artifact เฉพาะ
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**สิ่งที่สร้างขึ้น:**

```
openspec/schemas/<name>/
├── schema.yaml           # คำจำกัดความของ schema
└── templates/
    ├── proposal.md       # เทมเพลตสำหรับแต่ละ artifact
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

| Argument | Required | Description |
|----------|----------|-------------|
| `source` | Yes | Schema ต้นฉบับที่ต้องการคัดลอก |
| `name` | No | ชื่อ schema ใหม่ (ค่าเริ่มต้น: `<source>-custom`) |

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | เขียนทับปลายทางที่มีอยู่ |
| `--json` | แสดงผลในรูปแบบ JSON |

**Example:**

```bash
# การ fork schema spec-driven ที่ติดตั้งมาให้แล้ว
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

ตรวจสอบความถูกต้องของโครงสร้างและเทมเพลตของ schema

```
openspec schema validate [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | Schema ที่ต้องการตรวจสอบ (จะตรวจสอบทั้งหมดหากละไว้) |

**Options:**

| Option | Description |
|--------|-------------|
| `--verbose` | แสดงขั้นตอนการตรวจสอบโดยละเอียด |
| `--json` | แสดงผลในรูปแบบ JSON |

**Example:**

```bash
# ตรวจสอบ schema เฉพาะ
openspec schema validate my-workflow

# ตรวจสอบ schemas ทั้งหมด
openspec schema validate
```

---

### `openspec schema which`

แสดงว่า a schema ถูกแก้ไขจากที่ใด (มีประโยชน์สำหรับการดีบักลำดับความสำคัญ)

```
openspec schema which [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | ชื่อ schema |

**Options:**

| Option | Description |
|--------|-------------|
| `--all` | แสดงรายการ schemas ทั้งหมดพร้อมแหล่งที่มาของมัน |
| `--json` | แสดงผลในรูปแบบ JSON |

**Example:**

```bash
# ตรวจสอบว่า a schema มาจากไหน
openspec schema which spec-driven
```

**Output:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**ลำดับความสำคัญของ Schema:**

1. โปรเจกต์: `openspec/schemas/<name>/`
2. ผู้ใช้: `~/.local/share/openspec/schemas/<name>/`
3. แพ็คเกจ: Schemas ที่ติดตั้งมาให้แล้ว

---

## คำสั่ง Configuration

### `openspec config`

ดูและแก้ไขการตั้งค่า Global ของ OpenSpec

```
openspec config <subcommand> [options]
```

**Subcommands:**

| Subcommand | Description |
|------------|-------------|
| `path` | แสดงตำแหน่งของไฟล์คอนฟิก |
| `list` | แสดงการตั้งค่าทั้งหมดในปัจจุบัน |
| `get <key>` | ดึงค่าเฉพาะ |
| `set <key> <value>` | ตั้งค่า |
| `unset <key>` | ลบ key |
| `reset` | รีเซ็ตเป็นค่าเริ่มต้น |
| `edit` | เปิดด้วย `$EDITOR` |
| `profile [preset]` | กำหนดค่าโปรไฟล์เวิร์กโฟลว์แบบโต้ตอบหรือผ่าน preset |

**Examples:**

```bash
# แสดงพาธของไฟล์คอนฟิก
openspec config path

# แสดงการตั้งค่าทั้งหมด
openspec config list

# ดึงค่าเฉพาะ
openspec config get telemetry.enabled

# ตั้งค่า
openspec config set telemetry.enabled false

# ตั้งค่าสตริงอย่างชัดเจน
openspec config set user.name "My Name" --string

# ลบการตั้งค่าแบบกำหนดเอง
openspec config unset user.name

# รีเซ็ตการตั้งค่าทั้งหมด
openspec config reset --all --yes

# แก้ไขคอนฟิกใน editor ของคุณ
openspec config edit

# กำหนดโปรไฟล์ด้วย wizard ที่อิงตาม action
openspec config profile

# Fast preset: สลับเวิร์กโฟลว์ไปยัง core (คงโหมดการส่งมอบไว้)
openspec config profile core
```

`openspec config profile` จะเริ่มต้นด้วยสรุปสถานะปัจจุบัน จากนั้นจะให้คุณเลือก:
- เปลี่ยนการส่งมอบ + เวิร์กโฟลว์
- เปลี่ยนเฉพาะการส่งมอบ
- เปลี่ยนเฉพาะเวิร์กโฟลว์
- คงการตั้งค่าปัจจุบันไว้ (ออก)

หากคุณคงการตั้งค่าปัจจุบันไว้ จะไม่มีการเขียนการเปลี่ยนแปลงใด ๆ และจะไม่มีการแจ้งเตือนให้อัปเดต หากไม่มีการเปลี่ยนแปลงคอนฟิก แต่ไฟล์โปรเจกต์ในปัจจุบันไม่ตรงกับ Global profile/delivery ของคุณ OpenSpec จะแสดงคำเตือนและแนะนำให้รัน `openspec update`
การกด `Ctrl+C` ก็เป็นการยกเลิก flow อย่างเรียบร้อย (ไม่มี stack trace) และออกด้วยโค้ด `130`
ในรายการตรวจสอบเวิร์กโฟลว์, `[x]` หมายถึงเวิร์กโฟลว์ที่ถูกเลือกในการตั้งค่า Global หากต้องการนำการเลือกเหล่านั้นไปใช้กับไฟล์โปรเจกต์ ให้รัน `openspec update` (หรือเลือก `Apply changes to this project now?` เมื่อมีการแจ้งเตือนภายในโปรเจกต์)

**Interactive examples:**

```bash
# การอัปเดตเฉพาะส่วนของการส่งมอบ
openspec config profile
# เลือก: เปลี่ยนเฉพาะการส่งมอบ
# เลือก delivery: Skills only

# การอัปเดตเฉพาะเวิร์กโฟลว์
openspec config profile
# เลือก: เปลี่ยนเฉพาะเวิร์กโฟลว์
# สลับเวิร์กโฟลว์ในรายการตรวจสอบ จากนั้นยืนยัน
```

---

## คำสั่ง Utility

### `openspec feedback`

ส่งข้อเสนอแนะเกี่ยวกับ OpenSpec สร้าง issue ใน GitHub

```
openspec feedback <message> [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `message` | Yes | ข้อความข้อเสนอแนะ |

**Options:**

| Option | Description |
|--------|-------------|
| `--body <text>` | คำอธิบายโดยละเอียด |

**Requirements:** ต้องติดตั้งและยืนยันตัวตนด้วย GitHub CLI (`gh`)

**Example:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

จัดการการเติมคำอัตโนมัติ (shell completions) สำหรับ OpenSpec CLI

```
openspec completion <subcommand> [shell]
```

**Subcommands:**

| Subcommand | Description |
|------------|-------------|
| `generate [shell]` | แสดงสคริปต์การเติมคำอัตโนมัติไปยัง stdout |
| `install [shell]` | ติดตั้งการเติมคำอัตโนมัติสำหรับ shell ของคุณ |
| `uninstall [shell]` | ลบการเติมคำอัตโนมัติที่ติดตั้งไว้ |

**Supported shells:** `bash`, `zsh`, `fish`, `powershell`

**Examples:**

```bash
# ติดตั้ง completions (ตรวจจับ shell โดยอัตโนมัติ)
openspec completion install

# ติดตั้งสำหรับ shell เฉพาะ
openspec completion install zsh

# สร้างสคริปต์สำหรับการติดตั้งด้วยตนเอง
openspec completion generate bash > ~/.bash_completion.d/openspec

# ถอนการติดตั้ง
openspec completion uninstall
```

---

## Exit Codes (รหัสออก)

| Code | Meaning |
|------|---------|
| `0` | สำเร็จ |
| `1` | ข้อผิดพลาด (ความล้มเหลวในการตรวจสอบ, ไฟล์ที่ขาดหายไป ฯลฯ) |

---

## Environment Variables (ตัวแปรสภาพแวดล้อม)

| Variable | Description |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | ตั้งค่าเป็น `0` เพื่อปิดการทำงานของ telemetry |
| `DO_NOT_TRACK` | ตั้งค่าเป็น `1` เพื่อปิดการทำงานของ telemetry (สัญญาณ DNT มาตรฐาน) |
| `OPENSPEC_CONCURRENCY` | Concurrency เริ่มต้นสำหรับการตรวจสอบจำนวนมาก (ค่าเริ่มต้น: 6) |
| `EDITOR` หรือ `VISUAL` | Editor สำหรับ `openspec config edit` |
| `NO_COLOR` | ปิดการแสดงผลสีเมื่อตั้งค่าแล้ว |

---

## Related Documentation (เอกสารที่เกี่ยวข้อง)

- [Commands](commands.md) - คำสั่งแบบ AI slash (`/opsx:propose`, `/opsx:apply`, ฯลฯ)
- [Workflows](workflows.md) - รูปแบบทั่วไปและเมื่อใดควรใช้แต่ละคำสั่ง
- [Customization](customization.md) - การสร้าง schema และเทมเพลตแบบกำหนดเอง
- [Getting Started](getting-started.md) - คู่มือการตั้งค่าครั้งแรก