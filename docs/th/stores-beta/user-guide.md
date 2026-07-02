# Stores: Plan in Its Own Repo

> **Beta.** Stores, references, working context, และ worksets เป็นฟีเจอร์ใหม่ ชื่อ Command, flags, file formats, และ JSON output อาจยังมีการเปลี่ยนแปลงระหว่างการปล่อยเวอร์ชัน (releases) การเดินตามขั้นตอนทั้งหมดด้านล่างนี้ถูกรันกับ build ปัจจุบัน แต่โปรดอ่านคู่มือนี้ซ้ำหลังจากอัปเกรด

## ปัญหาที่สิ่งนี้แก้ไขได้

โดยปกติแล้ว OpenSpec จะอยู่ใน code repo เดียว: คือโฟลเดอร์ openspec/ ที่อยู่ถัดจากโค้ดของคุณ ซึ่งบรรจุ specs และการเปลี่ยนแปลงสำหรับ repo นั้น

สิ่งนี้ก็ไม่เพียงพอเมื่อการวางแผนของคุณมีขนาดใหญ่กว่าหนึ่ง repo:

- งานของคุณครอบคลุมหลาย repo — ฟีเจอร์เดียวอาจเกี่ยวข้องกับ API server, web app, และไลบรารีที่ใช้ร่วมกัน แผนนั้นควรอยู่ในโฟลเดอร์ openspec/ ของใคร?
- ทีมของคุณวางแผนก่อนที่โค้ดจะถูกสร้างขึ้น หรือวางแผนสิ่งที่ไม่ได้กลายเป็นโค้ดใน repo นี้
- ข้อกำหนด (Requirements) เป็นของทีมหนึ่งและถูกบริโภคโดยทีมอื่น เวอร์ชันใน wiki อาจเกิดความคลาดเคลื่อน และ coding agent ของคุณก็ไม่สามารถอ่านได้อยู่ดี

Store คือคำตอบ: เป็น standalone repo ที่มีหน้าที่ทั้งหมดคือการวางแผน มันมีรูปแบบ openspec/ แบบเดียวกับที่คุณคุ้นเคย — specs และ changes — บวกกับ identity file ขนาดเล็ก คุณลงทะเบียนมันบนเครื่องของคุณเพียงครั้งเดียวด้วยชื่อที่กำหนด จากนั้นคำสั่ง OpenSpec ทั่วไปทุกคำสั่งก็จะสามารถทำงานได้ใน store นั้นจากทุกที่

## The shape

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

กฎสองข้อทำให้สิ่งนี้เรียบง่าย:

1. **คลังข้อมูล (Store) คือ git repo** คุณเป็นผู้ทำการ commit, push, pull และตรวจสอบด้วยตนเอง OpenSpec จะไม่ทำการ clone, sync หรือ push ใด ๆ ด้วยตัวเอง
2. **การประกาศ ไม่ใช่กลไกานะ** Repos สามารถ *ประกาศ* วิธีที่มันเกี่ยวข้องกับคลังข้อมูลได้ (แสดงด้านล่าง) การประกาศเหล่านี้จะเปลี่ยนสิ่งที่ OpenSpec สามารถบอกคุณได้—แต่ไม่ใช่ว่าคำสั่งของคุณทำงานที่ไหน

## ห้านาทีสู่คลังข้อมูลแรกของคุณ

มีสองคำสั่งที่จะพาคุณจากศูนย์ไปสู่การเปลี่ยนแปลงที่มีขอบเขตของคลังข้อมูลที่ใช้งานได้:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

นั่นคือโมเดลทั้งหมด จากจุดนี้ไปวงจรชีวิต (lifecycle) จะเป็นไปตามที่คุณทราบอย่างแน่นอน — `status`, `instructions`, `validate`, `archive` — โดยมี `--store team-plans` ในทุกคำสั่ง และข้อแนะนำที่พิมพ์ออกมาทุกอย่างจะบ่งบอกสิ่งนั้นให้คุณทราบ บรรทัด `Using OpenSpec root:` จะบอกเสมอว่าคำสั่งกำลังทำงานอยู่ที่ไหน

## เรื่องราว: หนึ่งทีม หนึ่ง repo สำหรับการวางแผน (planning)

ทีมงานเก็บ specs และ changes ของตนเองไว้ใน `team-plans` แทนที่จะกระจัดกระจายไปทั่วโค้ด repos

**วันแรก (ใครก็ตามที่ตั้งค่า):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

การส่งผ่าน `--remote` จะบันทึก URL สำหรับ clone ไว้ในไฟล์ identity ของคลังข้อมูล (`.openspec-store/store.yaml`) ใน commit แรก ทุกการ clone ในอนาคต้มักจะรู้ว่ามันมาจากที่ใด ดังนั้น health checks และข้อความแสดงข้อผิดพลาดจึงสามารถพิมพ์วิธีแก้ไขที่สมบูรณ์และพร้อมใช้งานสำหรับเพื่อนร่วมทีมที่ยังไม่มีได้

**สมาชิกในทีมทุกคน (ครั้งเดียวต่อเครื่อง):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

ตั้งแต่นั้นเป็นต้นไป ทุกคนจะทำงานใน repo สำหรับการวางแผนเดียวกันโดยใช้ชื่อ:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**การแชร์งานคือ git โดยเจตนา** การเปลี่ยนแปลงที่คุณสร้างขึ้นจะมีอยู่แค่ใน checkout ของคุณจนกว่าคุณจะ commit และ push — เช่นเดียวกับโค้ด แผนงานสามารถมี branches, pull requests และการตรวจสอบได้โดยอัตโนมัติ เพราะคลังข้อมูลคือ repo ทั่วไป

**การเชื่อมต่อโค้ด repos ของทีม** โค้ด repo ที่มีการวางแผนภายนอกอย่างสมบูรณ์ต้องการบรรทัดเดียวใน `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

ตอนนี้ทุกคำสั่ง OpenSpec ที่รันภายใน `web-app` จะทำงานบน `team-plans` โดยไม่ต้องมี flag ใด ๆ เลย:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

ตัวชี้ (pointer) เป็นเพียงทางเลือกสำรอง ไม่ใช่การแทนที่เสมอไป การใช้ `--store` อย่างชัดเจนจะชนะเสมอ และหาก repo เติบโตจนมีโฟลเดอร์สำหรับการวางแผนของตัวเอง โฟลเดอร์เหล่านั้นก็จะชนะ (พร้อมคำเตือนให้ลบตัวชี้ที่ไม่เป็นปัจจุบัน)

## เรื่องราว: ข้อกำหนดที่ข้ามทีม

ทีมแพลตฟอร์มเป็นเจ้าของข้อกำหนด ทีมผลิตภัณฑ์จะสร้างงานโดยอ้างอิงจากสิ่งเหล่านี้ใน repo ของตนเอง พร้อมด้วยการออกแบบของตนเอง การอ้างอิง (reference) จะอธิบายความสัมพันธ์นั้นโดยไม่ต้องย้ายงานของใคร

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          │          └──────────────────────────┘
   └──────────────────────────┘
```

**ทีมผลิตภัณฑ์จะประกาศสิ่งที่ตนใช้อ้างอิง** ใน `openspec/config.yaml` ของ repo:

```yaml
references:
  - platform-reqs
```

การอ้างอิงคือบริบทที่อ่านได้อย่างเดียว (read-only context) Repo จะเก็บรากฐาน `openspec/` ของตนเอง งานจะยังคงอยู่ที่นั่น สิ่งที่เปลี่ยนแปลงคือ `openspec instructions` ใน repo นั้นตอนนี้จะมีดัชนีของ specs ที่ถูกอ้างอิง — โดยแต่ละรายการมีสรุปหนึ่งบรรทัดและคำสั่ง fetch ที่แน่นอน (`openspec show <spec-id> --type spec --store platform-reqs`) Agent ที่ทำงานใน `api-server` สามารถค้นหาข้อกำหนดด้านการชำระเงินต้นทาง (upstream payment requirements) อ้างอิง และเขียนการออกแบบระดับต่ำของตนเองในรากฐานของ repo — โดยที่ไม่มีใครต้องคัดลอกบริบทมาวาง

การอ้างอิงสามารถบรรจุแหล่งที่มาของการ clone ได้ ดังนั้นเพื่อนร่วมทีมที่ยังไม่มีคลังข้อมูลจะได้รับวิธีแก้ไขที่สมบูรณ์แทนที่จะเป็นทางตัน:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**เมื่อคุณต้องการแผนและโค้ดพร้อมกัน ให้สร้าง workset** สิ่งนี้เป็นเรื่องส่วนตัวและชัดเจน แต่ละคนเลือกโฟลเดอร์ที่ตนทำงานด้วยจริง ๆ บนเครื่องของตน ไม่มีสิ่งใดเกี่ยวกับเส้นทาง checkout ท้องถิ่นเหล่านั้นถูก commit ลงใน repo สำหรับการวางแผนที่แชร์แล้ว

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## สองคำถามที่คุณสามารถถามได้เสมอ

**"การตั้งค่าของฉันมีสุขภาพดีหรือไม่?"** — `openspec doctor` จะตรวจสอบรากฐานปัจจุบันและคลังข้อมูลที่ถูกอ้างอิง โดยอ่านได้อย่างเดียว พร้อมวิธีแก้ไขที่พร้อมใช้งานสำหรับแต่ละสิ่งที่พบ:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"ฉันกำลังทำงานกับอะไรอยู่?"** — `openspec context` จะรวบรวมชุดงาน (working set) จากการประกาศของ OpenSpec: รากฐานและคลังข้อมูลที่มันอ้างถึง

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

ทั้งสองรองรับ `--json` สำหรับ agent `openspec context --code-workspace <path>` จะเขียนไฟล์ workspace ของ VS Code ซึ่งมีชุดงานทั้งหมด — นี่คือสิ่งเดียวที่คำสั่งนี้ทำ

## Worksets: เปิดโฟลเดอร์ที่คุณทำงานด้วยกันอีกครั้ง

แยกจากทั้งหมดข้างต้น คนส่วนใหญ่จะเปิดโฟลเดอร์ไม่กี่อันเดียวกันพร้อมกันในทุกเซสชัน — คือคลังข้อมูลสำหรับการวางแผนบวกกับโค้ด repos สองถึงสามอัน **workset** คือมุมมองที่เป็นชื่อและเป็นส่วนตัวของสิ่งนั้น ซึ่งถูกเปิดขึ้นอีกครั้งด้วยคำสั่งเดียวในเครื่องมือที่คุณเลือก

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` จากนั้นจะเปิดเครื่องมือที่บันทึกไว้: โปรแกรมแก้ไข (VS Code, Cursor) จะเปิดหน้าต่างเดียวพร้อมกับสมาชิกทั้งหมดและกลับมา Worksets ถูกออกแบบมาให้ *ไม่* เป็นสถานะที่แชร์ พวกมันอยู่บนเครื่องของคุณ ไม่เคยถูก commit และไม่ได้กล่าวอ้างถึงงาน — พวกมันเพียงแค่บันทึกว่าคุณชอบเปิดอะไรพร้อมกัน การลบหนึ่งรายการจะไม่แตะต้องโฟลเดอร์สมาชิก เครื่องมือใหม่คือการกำหนดค่า ไม่ใช่โค้ด: สิ่งใดก็ตามที่เปิดผ่านไฟล์ workspace หรือ flag การแนบต่อต่อโฟลเดอร์สามารถเพิ่มได้ภายใต้คีย์ `openers` ใน config ทั่วโลก (`openspec config edit`)

## วิธีที่คำสั่งตัดสินใจว่าจะทำงานที่ไหน

ทุกคำสั่งปกติจะแก้ไขรากฐาน (root) ของมันในลักษณะเดียวกัน ตามลำดับนี้:

```
1. --store <id>          คุณระบุอย่างชัดเจน        → คลังข้อมูลนั้น
2. nearest openspec/     รากฐานการวางแผนจริง ๆ ที่นี่   → repo นี้
   (walking up from cwd)
3. store: pointer        config.yaml ประกาศคลังข้อมูล  → คลังข้อมูลนั้น
4. none of the above     มีคลังข้อมูลลงทะเบียนบนเครื่องนี้หรือไม่? → ข้อผิดพลาดพร้อมคำแนะนำในการเลือก
                         ไม่มีคลังข้อมูลที่ลงทะเบียน?         → ไดเรกทอรีปัจจุบัน
                                                          (พฤติกรรมแบบคลาสสิก)
```

บรรทัด `Using OpenSpec root:` (และบล็อก `root` ในเอาต์พุต `--json`) จะบอกคุณว่าคุณอยู่ในกรณีใด

## ข้อจำกัดที่ทราบ

- **รูปแบบเบต้า** ทุกสิ่งที่อยู่บนหน้านี้อาจเปลี่ยนแปลงได้ระหว่างการออกเวอร์ชัน — ชื่อ flag รูปแบบไฟล์ คีย์ JSON
- **เช็คเอาท์เดียวต่อ ID คลังข้อมูล ต่อเครื่อง** การลงทะเบียนเช็คเอาท์ที่สองภายใต้ ID เดียวกันจะล้มเหลวพร้อมคำแนะนำให้ `store unregister` ก่อน
- **ห้ามซิงค์เด็ดขาด — ตามการออกแบบ** OpenSpec จะไม่ทำการ clone, pull หรือ push เช็คเอาท์ที่ไม่เป็นปัจจุบันจะแสดง specs ที่ไม่เป็นปัจจุบันจนกว่า *คุณ* จะ pull การอ้างอิงจะถูกจัดทำดัชนีแบบสดจากสิ่งที่อยู่บนดิสก์
- **บางคำสั่งยังคงอยู่ที่เดิม** `view`, `templates`, `schemas` และรูปแบบนามที่เลิกใช้แล้ว (`openspec change show`, ...) ทำงานกับไดเรกทอรีปัจจุบันเท่านั้น — ไม่ต้องมี `--store`
- **สถานะต่อเครื่องเป็นของแต่ละเครื่อง** Store registry และ worksets เป็นการตั้งค่าท้องถิ่น ไม่มีสิ่งใดเกี่ยวกับเค้าโครงของเครื่องคุณถูก commit ลงในแผนที่แชร์แล้ว
- **สองรูปแบบการเปิดสำหรับ worksets** เครื่องมือที่ไม่สามารถเปิดด้วยไฟล์ workspace หรือ flag การแนบต่อต่อโฟลเดอร์ได้จะไม่สามารถเพิ่มเป็น opener ได้
- **JSON ของ Agent มีการแบ่ง casing ที่ทราบกัน** (คีย์ store-family เป็น snake_case, workflow-family เป็น camelCase) ถูกบันทึกไว้ใน [agent contract](../agent-contract.md); การรวมให้เป็นหนึ่งเดียวถูกเลื่อนไปจนถึงเวอร์ชันที่กำหนด

## สิ่งต่าง ๆ อยู่ที่ไหน

| รายการ | ที่อยู่ | แชร์ได้หรือไม่? |
|---|---|---|
| การวางแผนของคลังข้อมูล | `<store>/openspec/` (specs, changes) | ได้ — commit และ push |
| Identity ของคลังข้อมูล | `<store>/.openspec-store/store.yaml` | ได้ — commit พร้อมกับคลังข้อมูล |
| Store registry | `<data dir>/openspec/stores/registry.yaml` | ไม่ — เครื่องนี้เท่านั้นที่เก็บ |
| Worksets | `<data dir>/openspec/worksets/` | ไม่ — เครื่องนี้เท่านั้นที่เก็บ |

`<data dir>` คือ `~/.local/share/openspec` บน macOS และ Linux (หรือ `$XDG_DATA_HOME/openspec` เมื่อตั้งค่า) และ `%LOCALAPPDATA%\openspec` บน Windows
## Reference

Flag และรูปแบบ JSON ที่แน่นอนสำหรับทุกคำสั่งบนหน้านี้:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) และ [agent contract](../agent-contract.md).