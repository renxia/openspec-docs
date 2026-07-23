# Stores: วางแผนใน Repo แยกของตัวเอง

> **เบต้า.** Stores, references, working context, และ worksets เป็นฟีเจอร์ใหม่ ชื่อคำสั่ง แฟล็ก รูปแบบไฟล์ และเอาต์พุต JSON อาจยังมีการเปลี่ยนแปลงระหว่างการปล่อยรุ่นใหม่ ทุกบทปฏิบัติในด้านล่างนี้ถูกทดสอบบนรุ่นปัจจุบัน แต่โปรดอ่านคู่มือนี้อีกครั้งหลังจากที่คุณอัปเกรด

## ปัญหาที่ช่วยแก้

OpenSpec ปกติจะอยู่ใน repo โค้ดเดียว: โฟลเดอร์ `openspec/` อยู่ติดกับโค้ดของคุณ ซึ่งเก็บ specs และการเปลี่ยนแปลงทั้งหมดสำหรับ repo นั้น

สถานการณ์นี้ไม่เหมาะสมอีกต่อไปทันทีที่แผนงานของคุณมีขนาดใหญ่กว่าหนึ่ง repo:
- งานของคุณข้ามหลาย repo — หนึ่งฟีเจอร์ส่งผลต่อ API server, เว็บแอป และไลบรารีที่ใช้ร่วมกัน แผนงานจะอยู่ในโฟลเดอร์ `openspec/` ของใคร?
- ทีมของคุณวางแผนก่อนที่มีโค้ดอยู่ หรือวางแผนสิ่งที่จะไม่กลายเป็นโค้ดใน repo *นี้* เลย
- ความต้องการเป็นของหนึ่งทีมและถูกนำไปใช้โดยทีมอื่น เวอร์ชันบน wiki จะไม่สอดคล้องกัน และเอเจนต์ที่เขียนโค้ดของคุณก็อ่านไม่เข้าใจอยู่แล้ว

**Store** เป็นคำตอบ: เป็น repo แยกที่หน้าที่หลักคือการวางแผน มีโครงสร้าง `openspec/` เหมือนที่คุณรู้จักอยู่แล้ว — specs และ changes — พร้อมไฟล์ประจำตัวขนาดเล็ก คุณสามารถลงทะเบียนบนเครื่องของคุณเพียงครั้งเดียว โดยใช้ชื่อ จากนั้นทุกคำสั่ง OpenSpec ปกติสามารถทำงานภายในมันได้จากทุกที่

## โครงสร้าง

```
            team-plans  (เป็น store: การวางแผนอยู่ใน repository ของตัวเอง)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      คือข้อกำหนดที่เป็นจริง
                └── changes/    คือสิ่งที่กำลังดำเนินการอยู่
                      ▲
                      │ ลงทะเบียนบนแต่ละเครื่องด้วยชื่อ;
                      │ แชร์ได้โดยการ push/clone เหมือนกับ repository อื่นๆ
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (repo โค้ด)   (repo โค้ด)    (repo โค้ด)
```

สองกฎทำให้เรื่องนี้เรียบง่าย:

1. **store ก็เป็นแค่ git repo เท่านั้น** คุณสามารถ commit, push, pull และ review เองได้ OpenSpec จะไม่ clone, sync หรือ push อะไรทั้งหมดด้วยตัวเองเลย
2. **การประกาศ ไม่ใช่เครื่องจักร** Repo สามารถ *ประกาศ* ถึงความสัมพันธ์กับ store (แสดงไว้ด้านล่าง) การประกาศเปลี่ยนสิ่งที่ OpenSpec สามารถบอกคุณได้ — ไม่ใช่ตำแหน่งที่คำสั่งของคุณทำงาน

## เริ่มต้นใช้งาน store แรกของคุณภายใน 5 นาที

สองคำสั่งจะพาคุณจากไม่มีอะไรเลยไปสู่ change ที่ใช้งานได้และกำหนดขอบเขตด้วย store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store พร้อมใช้งาน: team-plans
ตำแหน่ง: /Users/you/openspec/team-plans
OpenSpec root: พร้อมใช้งาน
Registry: ลงทะเบียนแล้ว

ขั้นตอนต่อไป: รันคำสั่ง OpenSpec ปกติกับ store นี้ ตัวอย่างเช่น:
  openspec new change <change-id> --store team-plans
แชร์ store นี้โดยการ commit และ push เหมือนกับ Git repo อื่นๆ
```

```bash
openspec new change add-login --store team-plans
```

```
กำลังใช้ OpenSpec root: team-plans (/Users/you/openspec/team-plans)
สร้าง change 'add-login' ที่ /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
ขั้นตอนต่อไป: openspec status --change add-login --store team-plans
```

นี่คือโมเดลทั้งหมด ตั้งแต่จุดนี้ ไลฟ์ไซเคิลของ change คือสิ่งที่คุณคุ้นเคยอยู่แล้ว — `status`, `instructions`, `validate`, `archive` — เพียงเพิ่ม `--store team-plans` ในทุกคำสั่ง และทุกคำใบ้ที่แสดงออกมาจะมี flag นี้ให้คุณใช้ด้วย เส้น `Using OpenSpec root:` จะบอกเสมอว่าคำสั่งกำลังทำงานที่จุดใด

## เรื่องราว: ทีมเดียว ใช้ repo การวางแผนร่วมกันเพียงอันเดียว

ทีมจะเก็บ specs และ changes ของตัวเองไว้ใน `team-plans` แทนที่จะกระจายไปทั่ว repo โค้ดต่างๆ

**วันที่หนึ่ง (ผู้ที่ทำการตั้งค่า):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

การส่งค่า `--remote` จะบันทึก URL สำหรับ clone ไว้ในไฟล์ identity ของ store เอง (`.openspec-store/store.yaml`) ใน commit แรก การ clone ในอนาคตทั้งหมดจะทราบจุดเริ่มต้นของตัวเองตั้งแต่แรก ดังนั้น health checks และข้อความข้อผิดพลาดสามารถแสดงวิธีแก้ไขที่สมบูรณ์และสามารถ copy-paste ได้สำหรับเพื่อนร่วมทีมที่ยังไม่ได้มี store นี้

**เพื่อนร่วมทีมทุกคน (ทำครั้งเดียวต่อเครื่อง):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

ตั้งแต่จุดนี้ ทุกคนจะทำงานใน repo การวางแผนเดียวกันด้วยชื่อ:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**การแชร์งานใช้ git โดยเจตนา** change ที่คุณสร้างจะมีอยู่เฉพาะใน checkout ของคุณเองจนกว่าคุณจะ commit และ push มัน — เหมือนกับโค้ด ทีมงานสามารถสร้าง branches, pull requests และ review ได้ฟรี เพราะ store ก็เป็น repo ปกติเท่านั้น

**เชื่อมต่อ repo โค้ดของทีม** repo โค้ดที่การวางแผนของมันถูกย้ายออกมาอยู่ภายนอกอย่างสมบูรณ์จำเป็นต้องมีเพียงหนึ่งบรรทัด ใน `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

ตอนนี้ คำสั่ง OpenSpec ทุกคำสั่งที่รันภายใน `web-app` จะทำงานกับ `team-plans` โดยไม่ต้องใส่ flag เลย:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
กำลังใช้ OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

pointer (การชี้โยง) นี้เป็นตัวเลือกสำรอง ไม่ใช่ตัวแทนที่ใช้แทนที่เสมอ: การระบุ `--store` อย่างชัดเจนจะถูกใช้ก่อนเสมอ และหาก repo มีโฟลเดอร์การวางแผนของตัวเองจริงๆ โฟลเดอร์เหล่านั้นจะถูกใช้ก่อน (พร้อมกับคำเตือนให้ลบ pointer ที่ล้าสมัยออก)

**ค่าเริ่มต้นเดียวสำหรับทุก repo บนเครื่องของคุณ** หากคุณทำงานข้าม repo โค้ดหลายอันที่วางแผนทั้งหมดไว้ใน store เดียวกัน ให้ตั้งค่าเพียงครั้งเดียว โดยใช้การตั้งค่าทั่วโลก แทนที่จะเพิ่มบรรทัด `store:` ในแต่ละ repo:

```bash
openspec config set defaultStore team-plans
```

ตอนนี้ คำสั่งใดๆ ที่รันอยู่ภายนอกจากรากฐานการวางแผน (planning root) — และไม่มี `--store` และไม่มี pointer ของโปรเจกต์ — จะใช้ `team-plans` เป็นค่าเริ่มต้น ค่านี้อยู่ท้ายรายการลำดับความสำคัญ ดังนั้น `--store`, รากฐานท้องถิ่น และ pointer `store:` ของโปรเจกต์ยังคงถูกใช้ก่อนเสมอ แบนเนอร์รากฐานและบล็อก `root` ใน JSON จะรายงาน `source: "global_default"` ร่วมกับ id ของ store ดังนั้นคุณสามารถแยกแยะระหว่างค่าเริ่มต้นทั่วเครื่องกับ pointer ของ repo ได้ตลอดเวลา ลบค่านี้ด้วยคำสั่ง `openspec config unset defaultStore` หาก id นี้ไม่ได้ลงทะเบียน คำสั่งจะแจ้งข้อผิดพลาดและบอกให้คุณลงทะเบียนหรือลบค่าเริ่มต้นที่ล้าสมัยออก

## เรื่องราว: ข้อกำหนดที่ข้ามระหว่างทีมต่างๆ

ทีมแพลตฟอร์มเป็นเจ้าของข้อกำหนด ทีมผลิตภัณฑ์สร้างผลิตภัณฑ์ตามข้อกำหนดเหล่านี้ ใน repo ของตัวเอง ด้วยการออกแบบของตัวเอง การอ้างอิง (reference) อธิบายความสัมพันธ์นี้โดยไม่ต้องย้ายงานของใครๆ

```
   platform-reqs (store)                 api-server (repo โค้ด)
   เป็นเจ้าของโดยทีมแพลตฟอร์ม            เป็นเจ้าของโดยทีมผลิตภัณฑ์
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀ อ่าน   │ openspec/config.yaml     │
   │   payments/spec.md       │          │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (การออกแบบของทีมเอง)    │
   │   งานของแพลตฟอร์ม        │          │ openspec/changes/        │
   │                          │          │   (งานของทีมเอง)         │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**ทีมผลิตภัณฑ์ประกาศถึงสิ่งที่ใช้เป็นพื้นฐาน** ใน `openspec/config.yaml` ของ repo ตัวเอง:

```yaml
references:
  - platform-reqs
```

การอ้างอิง (references) เป็นบริบทแบบอ่านอย่างเดียว (read-only) repo จะเก็บรากฐาน `openspec/` ของตัวเองไว้ งานทั้งหมดจะอยู่ในที่นั้น สิ่งที่เปลี่ยนแปลง: คำสั่ง `openspec instructions` ใน repo นั้นตอนนี้จะมีดัชนีของ specs ของ store ที่อ้างอิง — แต่ละรายการมีสรุปหนึ่งบรรทัดและคำสั่ง fetch ที่แม่นยำ (`openspec show <spec-id> --type spec --store platform-reqs`) เอเจนต์ที่ทำงานใน `api-server` สามารถค้นหาข้อกำหนดการชำระเงินต้นทาง (upstream) อ้างอิงได้ และเขียนการออกแบบระดับล่าง (low-level design) ในรากฐานของ repo เอง — โดยไม่ต้องมีใครคัดลอก-วางบริบทไปมา

การอ้างอิงสามารถระบุแหล่งต้นทางสำหรับ clone ได้ ดังนั้นเพื่อนร่วมทีมที่ยังไม่ได้มี store นี้จะได้รับวิธีแก้ไขที่สมบูรณ์แทนที่จะติดอยู่ในทางตาย:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**หากคุณต้องการเปิดแผนงานและโค้ดพร้อมกัน ให้สร้าง workset (ชุดงาน)** workset เป็นสิ่งที่ส่วนตัวและชัดเจน: แต่ละคนเลือกโฟลเดอร์ที่พวกเขาจริงๆ ทำงานกับมันบนเครื่องของตัวเอง ไม่มีอะไรเกี่ยวกับเส้นทาง checkout ท้องถิ่นเหล่านี้ที่จะถูก commit ไปยัง repo การวางแผนที่ใช้ร่วมกัน

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## คำถามสองข้อที่คุณสามารถถามได้ตลอดเวลา

**"การตั้งค่าของฉันทำงานปกติหรือไม่?"** — คำสั่ง `openspec doctor` จะตรวจสอบรากฐานปัจจุบันและ store ที่อ้างอิงทั้งหมด แบบอ่านอย่างเดียว (read-only) พร้อมกับวิธีแก้ไขที่สามารถ copy-paste ได้สำหรับแต่ละผลลัพธ์ที่พบ:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ใช้งานปกติ

References
  - platform-reqs: ใช้งานปกติ (/Users/you/openspec/platform-reqs)
  - design-system: store ที่อ้างอิง 'design-system' ยังไม่ได้ลงทะเบียนบนเครื่องนี้
    วิธีแก้ไข: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"ฉันกำลังทำงานกับอะไรอยู่?"** — คำสั่ง `openspec context` จะรวบรวมชุดงาน (working set) จากประกาศของ OpenSpec: รากฐานและ store ที่อ้างอิงทั้งหมด

```
บริบทการทำงานสำหรับ api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    ดึงข้อมูล: openspec show <spec-id> --type spec --store platform-reqs
```

ทั้งสองคำสั่งรองรับ `--json` สำหรับเอเจนต์ คำสั่ง `openspec context --code-workspace <path>` จะเขียนไฟล์ workspace ของ VS Code ที่มีชุดงานทั้งหมดเพิ่มเติม — นี่เป็นการเขียนไฟล์เดียวที่คำสั่งนี้ทำได้

## Worksets (ชุดงาน): เปิดโฟลเดอร์ที่คุณทำงานร่วมกันอีกครั้ง

แยกจากทั้งหมดข้างต้น: คนส่วนใหญ่เปิดโฟลเดอร์เดียวกันหลายโฟลเดอร์พร้อมกันในทุกเซสชัน — repo การวางแผนรวมกับ repo โค้ดสองหรือสามอัน **workset** คือมุมมองส่วนตัวที่มีชื่อของรายการนี้โดยตรง เปิดได้อีกครั้งด้วยคำสั่งเดียวในเครื่องมือที่คุณเลือก

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       เปิดทั้งสามในเครื่องมือของคุณ
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (เปิดใน VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

คำสั่ง `openspec workset open platform` จะเปิดเครื่องมือที่บันทึกไว้: ตัวแก้ไข (VS Code, Cursor) จะเปิดหน้าต่างเดียวที่มีสมาชิกทั้งหมดและคืนค่ากลับ สมาชิกแรกเป็นสมาชิกหลัก สามารถแทนที่เครื่องมือได้ตลอดเวลาด้วย `--tool <id>`

worksets ไม่ใช่สถานะที่ใช้ร่วมกันโดยเจตนา พวกมันอยู่บนเครื่องของคุณเอง ไม่เคยถูก commit และไม่ทำการอ้างอิงถึงงานใดๆ — พวกมันบันทึกเฉพาะสิ่งที่คุณชอบเปิดพร้อมกันเท่านั้น การลบ workset หนึ่งอันจะไม่แตะต้องโฟลเดอร์สมาชิกใดๆ เครื่องมือใหม่เป็นการตั้งค่า ไม่ใช่โค้ด: สิ่งใดๆ ที่เปิดได้ผ่านไฟล์ workspace หรือ flag การแนบต่อโฟลเดอร์แต่ละอันสามารถเพิ่มได้ภายใต้คีย์ `openers` (สำหรับกำหนดเครื่องมือเปิด) ในการตั้งค่าทั่วโลก (`openspec config edit`)

## วิธีที่คำสั่งตัดสินใจทำงานที่จุดใด

ทุกคำสั่งปกติกำหนดรากฐานของตัวเองด้วยวิธีเดียวกัน ในลำดับดังนี้:

```
1. --store <id>          คุณระบุไว้อย่างชัดเจน        → store นั้น
2. nearest openspec/     มีรากฐานการวางแผนจริงที่นี่     → repo นี้
   (เดินขึ้นจากไดเร็กทอรีปัจจุบัน)
3. store: pointer        config.yaml ประกาศ store      → store นั้น
4. defaultStore          การตั้งค่าทั่วโลกกำหนดค่าเริ่มต้น  → store นั้น
                         ของเครื่อง
5. ไม่มีรายการข้างต้น     มี store ที่ลงทะเบียนบนเครื่องนี้? → แจ้งข้อผิดพลาดพร้อมคำใบ้
                         เลือก store
                         ไม่มี store ที่ลงทะเบียน?       → ไดเร็กทอรีปัจจุบัน
                                                          (พฤติกรรมดั้งเดิม)
```

เส้น `Using OpenSpec root:` (และบล็อก `root` ในเอาต์พุต `--json`) จะบอกคุณว่าคุณอยู่ในกรณีใด

## ข้อจำกัดที่ทราบอยู่

- **รุ่นเบต้า** ทุกอย่างบนหน้านี้อาจมีการเปลี่ยนแปลงระหว่างการปล่อยเวอร์ชัน — ชื่อ, flags, รูปแบบไฟล์, คีย์ JSON
- **หนึ่ง checkout ต่อ id ของ store ต่อเครื่อง** การลงทะเบียน checkout ที่สองภายใต้ id เดียวกันจะล้มเหลวพร้อมกับคำใบ้ให้รัน `store unregister` ก่อน
- **ไม่มีการ sync เลย — ตามการออกแบบ** OpenSpec จะไม่ clone, pull หรือ push เลย checkout ที่ล้าสมัยจะแสดง specs ที่ล้าสมัยจนกว่าคุณจะ pull เอง; การอ้างอิงจะถูกสร้างดัชนีสดจากไฟล์ทั้งหมดที่มีอยู่บนดิสก์
- **โฟลเดอร์การวางแผนที่ว่างอาจไม่มีอยู่** store ใหม่อาจยังไม่มี `openspec/changes/`, `openspec/specs/` หรือ `openspec/changes/archive/` ใน Git นี่เป็นสิ่งที่ยอมรับได้ในระหว่างรุ่นเบต้า; โฟลเดอร์เหล่านั้นจะปรากฏขึ้นหลังจากคำสั่งปกติสร้างไฟล์ในนั้น
- **repo ที่เป็น pointer จะยังคงเป็น pointer** repo ที่มีแต่การตั้งค่า (config-only) ที่ประกาศ `store: <id>` ใน `openspec/config.yaml` จะถูกจัดการเป็นการวางแผนภายนอก ไม่ใช่เป็น checkout ของ store ที่ต้องลงทะเบียน ลบบรรทัด `store:` ออกก่อนหากคุณตั้งใจจะแปลง repo นั้นเป็นรากฐาน store ท้องถิ่น
- **บางคำสั่งทำงานที่ตำแหน่งปัจจุบันเท่านั้น** `view`, `templates`, `schemas` และรูปแบบคำสั่งที่เป็นคำนามที่เลิกใช้แล้ว (`openspec change show`, ...) จะทำงานกับไดเร็กทอรีปัจจุบันเท่านั้น — ไม่รองรับ `--store`
- **สถานะต่อเครื่องเป็นของแต่ละเครื่องเอง** registry ของ store และ worksets เป็นการตั้งค่าท้องถิ่น ไม่มีอะไรเกี่ยวกับโครงสร้างเครื่องของคุณที่จะถูก commit ไปยังการวางแผนที่ใช้ร่วมกัน
- **สองสไตล์การเปิดสำหรับ worksets** เครื่องมือที่ไม่สามารถเปิดได้ด้วยไฟล์ workspace หรือ flag การแนบต่อโฟลเดอร์แต่ละอันไม่สามารถเพิ่มเป็น opener ได้
- **JSON ของเอเจนต์มีการแยกรูปแบบตัวพิมพ์ที่ทราบอยู่** (คีย์ของกลุ่ม store ใช้ snake_case, คีย์ของกลุ่ม workflow ใช้ camelCase) อธิบายไว้ใน [สัญญาเอเจนต์](../agent-contract.md); การทำให้เป็นมาตรฐานเดียวกันถูกเลื่อนออกไปจนถึงการปล่อยเวอร์ชันที่มีหมายเลขเวอร์ชัน

## ตำแหน่งจัดเก็บของแต่ละส่วน

| รายการ | ตำแหน่งจัดเก็บ | แชร์ได้หรือไม่? |
|---|---|---|
| แผนงานของ Store | `<store>/openspec/` (specs, changes) | ใช่ — คอมมิตและพุชไปยังที่เก็บ |
| เอกลักษณ์ของ Store | `<store>/.openspec-store/store.yaml` | ใช่ — คอมมิตพร้อมกับ Store |
| รีจิสทรีของ Store | `<data dir>/openspec/stores/registry.yaml` | ไม่ใช่ — เฉพาะเครื่องนี้เท่านั้น |
| เวิร์กเซ็ต | `<data dir>/openspec/worksets/` | ไม่ใช่ — เฉพาะเครื่องนี้เท่านั้น |

`<data dir>` คือ `~/.local/share/openspec` สำหรับ macOS และ Linux (หรือ `$XDG_DATA_HOME/openspec` หากมีการตั้งค่าไว้) และ `%LOCALAPPDATA%\openspec` สำหรับ Windows.

## แหล่งอ้างอิง

แฟล็กและรูปแบบ JSON ที่ตรงกันสำหรับทุกคำสั่งในหน้านี้: [เอกสารอ้างอิง CLI](../cli.md) (Stores, Doctor, Working context, Personal worksets) และ [สัญญาของ Agent](../agent-contract.md).