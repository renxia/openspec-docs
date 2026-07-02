# แนวคิด (Concepts)

คู่มือนี้อธิบายแนวคิดหลักเบื้องหลัง OpenSpec และวิธีการทำงานร่วมกัน สำหรับการใช้งานจริง โปรดดู [Getting Started](getting-started.md) และ [Workflows](workflows.md)

## ปรัชญา (Philosophy)

OpenSpec สร้างขึ้นบนหลักการสี่ประการ:

```
fluid not rigid         — ไม่มีการกำหนดขั้นตอนที่ตายตัว ให้ทำงานในสิ่งที่สมเหตุสมผล
iterative not waterfall — เรียนรู้ขณะสร้าง ปรับปรุงไปพร้อมกัน
easy not complex        — การตั้งค่าแบบน้ำหนักเบา ขั้นตอนน้อยที่สุด
brownfield-first        — ทำงานร่วมกับโค้ดเบสที่มีอยู่ ไม่ใช่แค่ระบบใหม่ทั้งหมด
```

### เหตุใดหลักการเหล่านี้จึงมีความสำคัญ (Why These Principles Matter)

**Fluid not rigid.** ระบบการกำหนดคุณสมบัติแบบเดิมจะจำกัดให้คุณต้องทำตามขั้นตอน: ขั้นแรกคือวางแผน จากนั้นจึงลงมือทำ และสุดท้ายก็เสร็จสิ้น OpenSpec มีความยืดหยุ่นมากกว่า — คุณสามารถสร้าง Artifacts ได้ในลำดับใดก็ได้ที่เหมาะสมกับงานของคุณ

**Iterative not waterfall.** ข้อกำหนดเปลี่ยนแปลงได้ ความเข้าใจจะลึกซึ้งขึ้น สิ่งที่ดูเหมือนเป็นแนวทางที่ดีในตอนแรกอาจไม่คงอยู่เมื่อคุณเห็นโค้ดเบส OpenSpec ยอมรับความเป็นจริงนี้

**Easy not complex.** กรอบการทำงาน (framework) การกำหนดคุณสมบัติบางตัวต้องการการตั้งค่าที่กว้างขวาง รูปแบบที่ตายตัว หรือกระบวนการที่มีน้ำหนักมาก OpenSpec จะไม่เป็นอุปสรรคอุปางค์ ให้เริ่มต้นภายในไม่กี่วินาที เริ่มทำงานได้ทันที และปรับแต่งเฉพาะเมื่อจำเป็นเท่านั้น

**Brownfield-first.** งานซอฟต์แวร์ส่วนใหญ่ไม่ได้เป็นการสร้างจากศูนย์ — แต่คือการแก้ไขระบบที่มีอยู่ แนวทางแบบ Delta ของ OpenSpec ทำให้ง่ายต่อการระบุการเปลี่ยนแปลงในพฤติกรรมเดิม ไม่ใช่แค่การอธิบายระบบใหม่

## ภาพรวมโดยสังเขป (The Big Picture)

OpenSpec จัดระเบียบงานของคุณออกเป็นสองส่วนหลัก:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** คือแหล่งความจริง (source of truth) ซึ่งอธิบายว่าระบบของคุณทำงานอยู่ได้อย่างไรในปัจจุบัน

**Changes** คือการแก้ไขที่เสนอ (proposed modifications) ซึ่งจะอยู่ในโฟลเดอร์แยกต่างหากจนกว่าคุณจะพร้อมที่จะรวมเข้าด้วยกัน (merge)

การแบ่งแยกนี้เป็นสิ่งสำคัญ คุณสามารถทำงานกับการเปลี่ยนแปลงหลายอย่างได้พร้อมกันโดยไม่มีความขัดแย้ง คุณสามารถตรวจสอบการเปลี่ยนแปลงก่อนที่มันจะส่งผลกระทบต่อ specs หลัก และเมื่อคุณเก็บถาวรการเปลี่ยนแปลงแล้ว deltas ของมันก็จะถูกรวมเข้ากับแหล่งความจริงได้อย่างราบรื่น

## Specs (ข้อกำหนด)

Specs อธิบายพฤติกรรมของระบบโดยใช้ข้อกำหนดและสถานการณ์จำลองที่มีโครงสร้างชัดเจน

### โครงสร้าง

```
openspec/specs/
├── auth/
│   └── spec.md           # พฤติกรรมของการยืนยันตัวตน (Authentication behavior)
├── payments/
│   └── spec.md           # การประมวลผลการชำระเงิน (Payment processing)
├── notifications/
│   └── spec.md           # ระบบการแจ้งเตือน (Notification system)
└── ui/
    └── spec.md           # พฤติกรรมและธีมของ UI
```

จัดเรียง specs ตามโดเมน (domain) ซึ่งคือกลุ่มย่อยที่มีเหตุผลสำหรับระบบของคุณ รูปแบบทั่วไป:

- **ตามพื้นที่ฟีเจอร์ (By feature area)**: `auth/`, `payments/`, `search/`
- **ตามคอมโพเนนต์ (By component)**: `api/`, `frontend/`, `workers/`
- **ตามบริบทที่ถูกจำกัด (By bounded context)**: `ordering/`, `fulfillment/`, `inventory/`

### รูปแบบ Spec

Spec ประกอบด้วยข้อกำหนด และแต่ละข้อกำหนดจะมีสถานการณ์จำลอง (scenarios) กำกับอยู่:

```markdown
# Auth Specification (ข้อกำหนดการยืนยันตัวตน)

## Purpose (วัตถุประสงค์)
การจัดการการยืนยันตัวตนและการจัดการเซสชันสำหรับแอปพลิเคชัน

## Requirements (ข้อกำหนด)

### Requirement: User Authentication (ข้อกำหนด: การยืนยันตัวตนผู้ใช้)
ระบบ SHALL ออก JWT token เมื่อเข้าสู่ระบบสำเร็จ

#### Scenario: Valid credentials (สถานการณ์จำลอง: ข้อมูลรับรองถูกต้อง)
- GIVEN ผู้ใช้ที่มีข้อมูลรับรองที่ถูกต้อง
- WHEN ผู้ใช้ส่งแบบฟอร์มการเข้าสู่ระบบ
- THEN มีการคืนค่า JWT token
- AND ผู้ใช้ถูกเปลี่ยนเส้นทางไปยังแดชบอร์ด

#### Scenario: Invalid credentials (สถานการณ์จำลอง: ข้อมูลรับรองไม่ถูกต้อง)
- GIVEN ข้อมูลรับรองที่ไม่ถูกต้อง
- WHEN ผู้ใช้ส่งแบบฟอร์มการเข้าสู่ระบบ
- THEN มีการแสดงข้อความผิดพลาด
- AND ไม่มีการออกโทเค็น

### Requirement: Session Expiration (ข้อกำหนด: การหมดอายุของเซสชัน)
ระบบ MUST หมดอายุเซสชันหลังจากไม่มีกิจกรรมเป็นเวลา 30 นาที

#### Scenario: Idle timeout (สถานการณ์จำลอง: หมดเวลานิ่งเฉยๆ)
- GIVEN เซสชันที่ได้รับการยืนยันตัวตนแล้ว
- WHEN ผ่านไป 30 นาทีโดยไม่มีกิจกรรม
- THEN เซสชันจะถูกทำให้ไม่ถูกต้อง
- AND ผู้ใช้ต้องทำการยืนยันตัวตนใหม

### Requirement: Session Expiration (ข้อกำหนด: การหมดอายุของเซสชัน)
ระบบ MUST หมดอายุเซสชันหลังจากไม่มีกิจกรรมเป็นเวลา 30 นาที
```

**องค์ประกอบหลัก:**

| Element | Purpose (วัตถุประสงค์) |
|---------|-----------------------|
| `## Purpose` | คำอธิบายระดับสูงสำหรับโดเมนของ spec นี้ |
| `### Requirement:` | พฤติกรรมเฉพาะที่ระบบต้องมี |
| `#### Scenario:` | ตัวอย่างที่เป็นรูปธรรมของข้อกำหนดในการทำงานจริง |
| SHALL/MUST/SHOULD | คีย์เวิร์ด RFC 2119 ที่บ่งบอกระดับความสำคัญของข้อกำหนด |

### เหตุใดจึงควรจัดโครงสร้าง Specs ในลักษณะนี้

**Requirements คือ "what" (สิ่งที่ต้องทำ)** — พวกมันระบุว่าระบบควรทำอะไรโดยไม่กำหนดวิธีการนำไปใช้

**Scenarios คือ "when" (เมื่อไหร่ที่ต้องตรวจสอบ)** — พวกมันให้ตัวอย่างที่เป็นรูปธรรมซึ่งสามารถถูกตรวจสอบได้ สถานการณ์จำลองที่ดี:
- สามารถทดสอบได้ (คุณสามารถเขียนการทดสอบอัตโนมัติสำหรับสิ่งเหล่านั้น)
- ครอบคลุมทั้งเส้นทางปกติ (happy path) และกรณีขอบเขต (edge cases)
- ใช้รูปแบบ Given/When/Then หรือรูปแบบที่มีโครงสร้างคล้ายกัน

**RFC 2119 keywords** (SHALL, MUST, SHOULD, MAY) สื่อสารเจตนา:
- **MUST/SHALL** — ข้อกำหนดที่จำเป็นอย่างยิ่ง
- **SHOULD** — แนะนำ แต่มีข้อยกเว้นอยู่
- **MAY** — เป็นทางเลือก

### Spec คืออะไร (และไม่ใช่สิ่งใด)

Spec คือ **สัญญาพฤติกรรม (behavior contract)** ไม่ใช่แผนการนำไปใช้ (implementation plan)

เนื้อหา spec ที่ดี:
- พฤติกรรมที่สามารถสังเกตได้ซึ่งผู้ใช้หรือระบบปลายทางอาศัยอยู่
- อินพุต เอาต์พุต และเงื่อนไขข้อผิดพลาด
- ข้อจำกัดภายนอก (ความปลอดภัย ความเป็นส่วนตัว ความน่าเชื่อถือ ความเข้ากันได้)
- สถานการณ์จำลองที่สามารถทดสอบหรือตรวจสอบได้อย่างชัดเจน

สิ่งที่ควรหลีกเลี่ยงใน specs:
- ชื่อคลาส/ฟังก์ชันภายใน
- การเลือกไลบรารีหรือเฟรมเวิร์ก
- รายละเอียดการนำไปใช้ทีละขั้นตอน
- แผนการดำเนินการโดยละเอียด (สิ่งเหล่านี้เป็นของ `design.md` หรือ `tasks.md`)

การทดสอบอย่างรวดเร็ว:
- หากการนำไปใช้อาจเปลี่ยนแปลงได้โดยที่พฤติกรรมที่มองเห็นภายนอกไม่เปลี่ยน มันก็ไม่ควรอยู่ใน spec

### ทำให้เบาที่สุด: Progressive Rigor (ความเข้มงวดแบบค่อยเป็นค่อยไป)

OpenSpec มุ่งมั่นที่จะหลีกเลี่ยงระบบราชการ (bureaucracy) ใช้ระดับที่เบาที่สุดที่ยังคงทำให้การเปลี่ยนแปลงนั้นสามารถตรวจสอบได้

**Lite spec (ค่าเริ่มต้น):**
- ข้อกำหนดที่เน้นพฤติกรรมสั้นๆ
- ขอบเขตและเป้าหมายที่ไม่ใช่ (non-goals) ที่ชัดเจน
- การตรวจสอบการยอมรับที่เป็นรูปธรรมเพียงเล็กน้อย

**Full spec (สำหรับความเสี่ยงสูงขึ้น):**
- การเปลี่ยนแปลงข้ามทีมหรือข้าม repository
- การเปลี่ยนแปลง API/สัญญา (contract) การโยกย้ายข้อมูล (migrations) ข้อกังวลด้านความปลอดภัย/ความเป็นส่วนตัว
- การเปลี่ยนแปลงที่อาจมีความคลุมเครือซึ่งนำไปสู่การทำงานซ้ำที่มีค่าใช้จ่ายสูง

การเปลี่ยนแปลงส่วนใหญ่ควรอยู่ในโหมด Lite

### การทำงานร่วมกันระหว่างมนุษย์และ Agent

ในหลายทีม มนุษย์จะสำรวจและ Agent จะร่าง Artifacts วงจรที่ตั้งใจไว้คือ:

1. มนุษย์ให้เจตนา บริบท และข้อจำกัด
2. Agent แปลสิ่งนี้เป็นข้อกำหนดและสถานการณ์จำลองที่เน้นพฤติกรรม
3. Agent เก็บรายละเอียดการนำไปใช้ไว้ใน `design.md` และ `tasks.md` ไม่ใช่ `spec.md`
4. การตรวจสอบยืนยันโครงสร้างและความชัดเจนก่อนการนำไปใช้

สิ่งนี้ทำให้ specs สามารถอ่านได้สำหรับมนุษย์และมีความสม่ำเสมอสำหรับ Agent

## Changes (การเปลี่ยนแปลง)

Change คือการแก้ไขที่เสนอต่อระบบของคุณ ซึ่งถูกบรรจุอยู่ในโฟลเดอร์พร้อมทุกสิ่งที่จำเป็นในการทำความเข้าใจและนำไปใช้

### โครงสร้าง Change

```
openspec/changes/add-dark-mode/
├── proposal.md           # เหตุผลและสิ่งที่จะทำ (Why and what)
├── design.md             # วิธีการ (แนวทางทางเทคนิค)
├── tasks.md              # รายการตรวจสอบการนำไปใช้ (Implementation checklist)
├── .openspec.yaml        # เมตาดาต้าของการเปลี่ยนแปลง (ไม่บังคับ)
└── specs/                # สเปคส่วนต่าง (Delta specs)
    └── ui/
        └── spec.md       # สิ่งที่กำลังถูกเปลี่ยนแปลงใน ui/spec.md
```

การเปลี่ยนแปลงแต่ละอย่างเป็นแบบครบวงจร (self-contained) มันมี:
- **Artifacts** — เอกสารที่บันทึกเจตนา การออกแบบ และงานที่ต้องทำ
- **Delta specs** — ข้อกำหนดสำหรับสิ่งที่กำลังถูกเพิ่ม แก้ไข หรือลบออก
- **Metadata** — การตั้งค่าที่ไม่บังคับสำหรับการเปลี่ยนแปลงเฉพาะนี้

### เหตุใด Changes จึงเป็นโฟลเดอร์

การบรรจุการเปลี่ยนแปลงให้อยู่ในรูปแบบของโฟลเดอร์มีประโยชน์หลายประการ:

1. **ทุกอย่างอยู่ด้วยกัน.** Proposal, design, tasks และ specs อยู่ในที่เดียว ไม่ต้องค้นหาจากหลายตำแหน่ง
2. **ทำงานแบบขนาน (Parallel work).** การเปลี่ยนแปลงหลายรายการสามารถมีอยู่ได้พร้อมกันโดยไม่ขัดแย้ง ทำงานบน `add-dark-mode` ในขณะที่ `fix-auth-bug` กำลังดำเนินการอยู่ด้วย
3. **ประวัติที่สะอาด.** เมื่อถูกเก็บถาวรแล้ว Changes จะย้ายไปที่ `changes/archive/` โดยที่บริบททั้งหมดได้รับการรักษาไว้ คุณสามารถมองย้อนกลับไปและเข้าใจได้ว่าอะไรเปลี่ยนแปลงไปบ้าง ไม่ใช่แค่ว่าเปลี่ยนไปอย่างไร
4. **ง่ายต่อการตรวจสอบ.** โฟลเดอร์การเปลี่ยนแปลงนั้นง่ายต่อการตรวจสอบ เปิดมัน อ่าน proposal ตรวจสอบ design ดู delta spec

## Artifacts (สิ่งประกอบ)

Artifacts คือเอกสารภายใน Change ที่ชี้นำงาน

### กระบวนการของ Artifacts (The Artifact Flow)

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artifacts สร้างต่อกัน แต่ละ Artifact ให้บริบทสำหรับสิ่งต่อไป

### ประเภทของ Artifacts

#### Proposal (`proposal.md`)

Proposal บันทึก **เจตนา (intent)** **ขอบเขต (scope)** และ **แนวทาง (approach)** ในระดับสูง

```markdown
# Proposal: Add Dark Mode (ข้อเสนอ: เพิ่มโหมดมืด)

## Intent (เจตนา)
ผู้ใช้ได้ร้องขอตัวเลือกโหมดมืดเพื่อลดความเมื่อยล้าของดวงตา
ระหว่างการใช้งานในเวลากลางคืนและเพื่อให้ตรงกับความต้องการของระบบ

## Scope (ขอบเขต)
สิ่งที่อยู่ในขอบเขต:
- ปุ่มสลับธีมในการตั้งค่า
- การตรวจจับความต้องการของระบบ
- การคงไว้ซึ่งความต้องการใน localStorage

สิ่งที่ไม่รวมอยู่ในขอบเขต:
- ธีมสีแบบกำหนดเอง (งานในอนาคต)
- การแทนที่ธีมต่อหน้า

## Approach (แนวทาง)
ใช้ CSS custom properties สำหรับการจัดการธีมร่วมกับ React context
สำหรับการจัดการสถานะ ตรวจจับความต้องการของระบบในการโหลดครั้งแรก อนุญาตให้มีการแทนที่ด้วยตนเองได้
```

**เมื่อใดที่ควรอัปเดต proposal:**
- ขอบเขตเปลี่ยนแปลง (แคบลงหรือขยายออก)
- เจตนาชัดเจนขึ้น (มีความเข้าใจปัญหาที่ดีขึ้น)
- แนวทางเปลี่ยนไปโดยพื้นฐาน

#### Specs (สเปคส่วนต่างใน `specs/`)

Delta specs อธิบาย **สิ่งที่กำลังถูกเปลี่ยนแปลง** เทียบกับ specs ปัจจุบัน ดู [Delta Specs](#delta-specs) ด้านล่างนี้

#### Design (`design.md`)

Design บันทึก **แนวทางทางเทคนิค** และ **การตัดสินใจด้านสถาปัตยกรรม**

````markdown
# Design: Add Dark Mode (การออกแบบ: เพิ่มโหมดมืด)

## Technical Approach (แนวทางทางเทคนิค)
จัดการสถานะธีมผ่าน React Context เพื่อหลีกเลี่ยง prop drilling
CSS custom properties ช่วยให้สามารถสลับได้ในขณะรันไทม์โดยไม่ต้องสลับคลาส

## Architecture Decisions (การตัดสินใจด้านสถาปัตยกรรม)

### Decision: Context over Redux (การตัดสินใจ: ใช้ Context แทน Redux)
ใช้ React Context สำหรับสถานะธีมเนื่องจาก:
- สถานะแบบ binary ง่ายๆ (light/dark)
- ไม่มีการเปลี่ยนสถานะที่ซับซ้อน
- หลีกเลี่ยงการเพิ่ม dependency ของ Redux

### Decision: CSS Custom Properties (การตัดสินใจ: ใช้ CSS Custom Properties)
ใช้ตัวแปร CSS แทน CSS-in-JS เนื่องจาก:
- ทำงานร่วมกับ stylesheet ที่มีอยู่แล้ว
- ไม่มีภาระในการรันไทม์
- เป็นโซลูชันแบบ Native ของเบราว์เซอร์

## Data Flow (การไหลของข้อมูล)
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes (การเปลี่ยนแปลงไฟล์)
- `src/contexts/ThemeContext.tsx` (ใหม่)
- `src/components/ThemeToggle.tsx` (ใหม่)
- `src/styles/globals.css` (แก้ไข)
````

**เมื่อใดที่ควรอัปเดต design:**
- การนำไปใช้เผยให้เห็นว่าแนวทางนั้นใช้ไม่ได้ผล
- ค้นพบโซลูชันที่ดีกว่า
- Dependency หรือข้อจำกัดมีการเปลี่ยนแปลง

#### Tasks (`tasks.md`)

Tasks คือ **รายการตรวจสอบการนำไปใช้ (implementation checklist)** ซึ่งเป็นขั้นตอนที่เป็นรูปธรรมพร้อมช่องทำเครื่องหมาย

```markdown
# Tasks (งานที่ต้องทำ)

## 1. Theme Infrastructure (โครงสร้างพื้นฐานธีม)
- [ ] 1.1 สร้าง ThemeContext พร้อมสถานะ light/dark
- [ ] 1.2 เพิ่ม CSS custom properties สำหรับสี
- [ ] 1.3 นำการคงไว้ซึ่งข้อมูลใน localStorage มาใช้
- [ ] 1.4 เพิ่มการตรวจจับความต้องการของระบบ

## 2. UI Components (ส่วนประกอบ UI)
- [ ] 2.1 สร้าง ThemeToggle component
- [ ] 2.2 เพิ่ม toggle ในหน้าตั้งค่า
- [ ] 2.3 อัปเดต Header เพื่อรวม quick toggle

## 3. Styling (การจัดรูปแบบ)
- [ ] 3.1 กำหนดจานสีธีมมืด
- [ ] 3.2 อัปเดต components ให้ใช้ CSS variables
- [ ] 3.3 ทดสอบอัตราส่วนความเปรียบต่างเพื่อการเข้าถึงได้ (accessibility)
```

**แนวปฏิบัติที่ดีที่สุดสำหรับ Task:**
- จัดกลุ่มงานที่เกี่ยวข้องภายใต้หัวข้อ
- ใช้การกำหนดหมายเลขแบบลำดับชั้น (1.1, 1.2, เป็นต้นไป)
- เก็บงานให้เล็กพอที่จะเสร็จสิ้นในเซสชันเดียว
- ทำเครื่องหมายถูกเมื่อทำเสร็จ

## Delta Specs (สเปคส่วนต่าง)

Delta specs คือแนวคิดหลักที่ทำให้ OpenSpec สามารถทำงานได้สำหรับการพัฒนาบนระบบเดิม (brownfield development) พวกมันอธิบาย **สิ่งที่กำลังถูกเปลี่ยนแปลง** แทนที่จะกล่าวซ้ำทั้ง spec

### รูปแบบ

```markdown
# Delta for Auth (ส่วนต่างสำหรับ Auth)

## ADDED Requirements (ข้อกำหนดที่เพิ่มเข้ามา)

### Requirement: Two-Factor Authentication (ข้อกำหนด: การยืนยันตัวตนสองปัจจัย)
ระบบ MUST รองรับการยืนยันตัวตนสองปัจจัยที่อิงตาม TOTP

#### Scenario: 2FA enrollment (สถานการณ์จำลอง: การลงทะเบียน 2FA)
- GIVEN ผู้ใช้ที่ยังไม่ได้เปิดใช้งาน 2FA
- WHEN ผู้ใช้เปิดใช้งาน 2FA ในการตั้งค่า
- THEN มีการแสดง QR code สำหรับการตั้งค่าแอป Authenticator
- AND ผู้ใช้ต้องยืนยันด้วยรหัสก่อนการเปิดใช้งาน

#### Scenario: 2FA login (สถานการณ์จำลอง: การเข้าสู่ระบบ 2FA)
- GIVEN ผู้ใช้ที่เปิดใช้งาน 2FA
- WHEN ผู้ใช้ส่งข้อมูลรับรองที่ถูกต้อง
- THEN มีการนำเสนอ OTP challenge
- AND การเข้าสู่ระบบจะเสร็จสมบูรณ์หลังจากได้รับ OTP ที่ถูกต้อง

## MODIFIED Requirements (ข้อกำหนดที่ถูกแก้ไข)

### Requirement: Session Expiration (ข้อกำหนด: การหมดอายุของเซสชัน)
ระบบ MUST หมดอายุเซสชันหลังจากไม่มีกิจกรรมเป็นเวลา 15 นาที
(เดิม: 30 นาที)

#### Scenario: Idle timeout (สถานการณ์จำลอง: หมดเวลานิ่งเฉยๆ)
- GIVEN เซสชันที่ได้รับการยืนยันตัวตนแล้ว
- WHEN ผ่านไป 15 นาทีโดยไม่มีกิจกรรม
- THEN เซสชันจะถูกทำให้ไม่ถูกต้อง

## REMOVED Requirements (ข้อกำหนดที่ถูกลบออก)

### Requirement: Remember Me (ข้อกำหนด: จำฉันไว้)
(เลิกใช้เนื่องจากมีการเปลี่ยนมาใช้ 2FA ผู้ใช้ควรทำการยืนยันตัวตนใหมในแต่ละเซสชัน)
```

### ส่วนของ Delta

| Section | Meaning (ความหมาย) | What Happens on Archive (สิ่งที่เกิดขึ้นเมื่อเก็บถาวร) |
|---------|-------------------|------------------------|
| `## ADDED Requirements` | พฤติกรรมใหม่ | ถูกต่อท้ายไปยัง spec หลัก |
| `## MODIFIED Requirements` | พฤติกรรมที่เปลี่ยนแปลงไป | แทนที่ข้อกำหนดเดิม |
| `## REMOVED Requirements` | พฤติกรรมที่ถูกเลิกใช้ | ถูกลบออกจาก spec หลัก |

### เหตุใดจึงใช้ Deltas แทนที่จะเป็น Full Specs

**ความชัดเจน.** Delta แสดงให้เห็นอย่างชัดเจนว่าอะไรกำลังเปลี่ยนแปลง การอ่าน full spec คุณจะต้องเปรียบเทียบมันในใจกับเวอร์ชันปัจจุบัน

**การหลีกเลี่ยงความขัดแย้ง.** การเปลี่ยนแปลงสองรายการสามารถแตะไฟล์ spec เดียวกันได้โดยไม่เกิดความขัดแย้ง ตราบใดที่พวกมันแก้ไขข้อกำหนดที่แตกต่างกัน

**ประสิทธิภาพในการตรวจสอบ.** ผู้ตรวจสอบจะเห็นการเปลี่ยนแปลง ไม่ใช่บริบทที่ไม่เปลี่ยนแปลง มุ่งเน้นไปที่สิ่งที่สำคัญ

**ความเหมาะสมกับ Brownfield.** งานส่วนใหญ่เป็นการแก้ไขพฤติกรรมที่มีอยู่เดิม Deltas ทำให้การแก้ไขเป็นสิ่งสำคัญ ไม่ใช่อะไรที่คิดทีหลัง

## Schemas

Schemas กำหนดประเภทของ Artifacts และการพึ่งพา (dependencies) ของพวกมันสำหรับ Workflow

### How Schemas Work

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
```

**Artifacts form a dependency graph:**

```
                    proposal
                   (root node)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**Dependencies are enablers, not gates.** พวกมันแสดงว่าอะไรสามารถถูกสร้างได้ ไม่ใช่สิ่งที่คุณต้องสร้างต่อไป คุณสามารถข้ามการทำ design ได้หากไม่จำเป็น คุณสามารถสร้าง specs ก่อนหรือหลัง design — ทั้งสองอย่างพึ่งพาแค่ proposal เท่านั้น

### Built-in Schemas

**spec-driven** (ค่าเริ่มต้น)

Workflow มาตรฐานสำหรับการพัฒนาแบบ spec-driven:

```
proposal → specs → design → tasks → implement
```

เหมาะสำหรับ: งานฟีเจอร์ส่วนใหญ่ที่คุณต้องการตกลงในเรื่องของ specs ก่อนการนำไปใช้งานจริง

### Custom Schemas

สร้าง custom schemas สำหรับ workflow ของทีมคุณ:

```bash
# Create from scratch
openspec schema init research-first

# Or fork an existing one
openspec schema fork spec-driven research-first
```

**ตัวอย่าง custom schema:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Do research first

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informed by research

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Skip specs/design, go straight to tasks
```

ดู [Customization](customization.md) สำหรับรายละเอียดทั้งหมดเกี่ยวกับการสร้างและการใช้ custom schemas

## Archive

การเก็บถาวรักษ์ (Archiving) คือกระบวนการที่ทำให้การเปลี่ยนแปลงเสร็จสมบูรณ์โดยการรวม delta specs เข้ากับ main specs และรักษาการเปลี่ยนแปลงนั้นไว้สำหรับประวัติศาสตร์

### What Happens When You Archive

```
Before archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


After archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Now includes 2FA requirements
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preserved for history
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### The Archive Process

1. **Merge deltas.** แต่ละส่วนของ delta spec (ADDED/MODIFIED/REMOVED) จะถูกนำไปใช้กับ main spec ที่เกี่ยวข้อง

2. **Move to archive.** โฟลเดอร์การเปลี่ยนแปลงจะถูกย้ายไปยัง `changes/archive/` พร้อมคำนำหน้าวันที่เพื่อจัดเรียงตามลำดับเวลา

3. **Preserve context.** Artifacts ทั้งหมดจะยังคงอยู่ในการเก็บถาวรักษ์ คุณสามารถย้อนกลับไปดูได้เสมอเพื่อทำความเข้าใจว่าเหตุใดจึงมีการเปลี่ยนแปลงเกิดขึ้น

### Why Archive Matters

**Clean state.** การเปลี่ยนแปลงที่กำลังดำเนินการอยู่ (`changes/`) จะแสดงเฉพาะงานที่กำลังดำเนินอยู่เท่านั้น งานที่เสร็จสมบูรณ์แล้วจะถูกย้ายออกไป

**Audit trail.** การเก็บถาวรักษ์จะรักษาบริบททั้งหมดของการเปลี่ยนแปลง — ไม่ใช่แค่ว่าอะไรเปลี่ยนไป แต่รวมถึง proposal ที่อธิบายเหตุผลการเปลี่ยนแปลง design ที่อธิบายวิธีการ และ tasks ที่แสดงงานที่ทำเสร็จแล้ว

**Spec evolution.** Specs จะเติบโตอย่างเป็นธรรมชาติเมื่อมีการเก็บถาวรักษ์ การเก็บถาวรักษ์แต่ละครั้งจะรวม deltas เข้าด้วยกัน สร้างข้อกำหนดที่ครอบคลุมตลอดเวลา

## How It All Fits Together

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**The virtuous cycle:**

1. Specs describe current behavior (Specs อธิบายพฤติกรรมปัจจุบัน)
2. Changes propose modifications (as deltas) (การเปลี่ยนแปลงเสนอการแก้ไข (ในรูปแบบของ delta))
3. Implementation makes the changes real (การนำไปใช้งานจริงทำให้การเปลี่ยนแปลงเป็นจริง)
4. Archive merges deltas into specs (Archive รวม deltas เข้ากับ specs)
5. Specs now describe the new behavior (Specs อธิบายพฤติกรรมใหม่แล้ว)
6. Next change builds on updated specs (การเปลี่ยนแปลงถัดไปจะสร้างขึ้นบนพื้นฐานของ specs ที่อัปเดตแล้ว)

## Glossary

| Term | Definition |
|------|------------|
| **Artifact** | เอกสารภายในการเปลี่ยนแปลง (proposal, design, tasks หรือ delta specs) |
| **Archive** | กระบวนการทำให้การเปลี่ยนแปลงเสร็จสมบูรณ์และรวม deltas เข้ากับ main specs |
| **Change** | การแก้ไขที่ถูกเสนอต่อระบบ ซึ่งบรรจุอยู่ในโฟลเดอร์พร้อม artifacts ต่างๆ |
| **Delta spec** | Spec ที่อธิบายการเปลี่ยนแปลง (ADDED/MODIFIED/REMOVED) เมื่อเทียบกับ specs ปัจจุบัน |
| **Domain** | กลุ่มเชิงตรรกะสำหรับ specs (เช่น `auth/`, `payments/`) |
| **Requirement** | พฤติกรรมเฉพาะที่ระบบต้องมี |
| **Scenario** | ตัวอย่างที่เป็นรูปธรรมของ requirement โดยทั่วไปอยู่ในรูปแบบ Given/When/Then |
| **Schema** | คำจำกัดความของประเภท Artifacts และการพึ่งพา (dependencies) ของพวกมัน |
| **Spec** | ข้อกำหนดที่อธิบายพฤติกรรมของระบบ ซึ่งประกอบด้วย requirements และ scenarios |
| **Source of truth** | ไดเรกทอรี `openspec/specs/` ซึ่งบรรจุพฤติกรรมที่เป็นที่ตกลงกันในปัจจุบัน |

## Next Steps

- [Getting Started](getting-started.md) - ขั้นตอนแรกที่ปฏิบัติได้จริง
- [Workflows](workflows.md) - รูปแบบทั่วไปและเมื่อใดควรใช้แต่ละรูปแบบ
- [Commands](commands.md) - เอกสารอ้างอิงคำสั่งทั้งหมด
- [Customization](customization.md) - การสร้าง custom schemas และการกำหนดค่าโปรเจกต์ของคุณ