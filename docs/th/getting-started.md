# เริ่มต้นใช้งาน

คู่มือนี้อธิบายการทำงานของ OpenSpec หลังจากที่คุณติดตั้งและเริ่มต้นใช้งานแล้ว หากต้องการคำแนะนำในการติดตั้ง โปรดดูที่ [README หลัก](../index.md#quick-start) หรือ [คู่มือการติดตั้ง](installation.md) ใหม่กับเอกสารทั้งหมด? [หน้าหลักของเอกสาร](index.md) จะช่วยให้คุณทราบโครงสร้างทั้งหมดได้

> **ควรพิมพ์คำสั่งเหล่านี้ที่ไหน?** มีสองตำแหน่ง และการสับสนระหว่างสองแห่งนี้เป็นปัญหาที่พบบ่อยที่สุดในช่วงเริ่มต้น
>
> - คำสั่ง `openspec ...` (เช่น `openspec init`) รันใน **เทอร์มินัล** ของคุณ
> - คำสั่ง `/opsx:...` (เช่น `/opsx:propose`) รันใน **แชทของผู้ช่วย AI ของคุณ** ซึ่งเป็นตำแหน่งเดียวกับที่คุณจะขอให้มันเขียนโค้ด
>
> ไม่มี "โหมดโต้ตอบ" แยกต่างหากที่ต้องเริ่มต้น คุณเพียงพิมพ์คำสั่งสแลชในแชท และผู้ช่วยของคุณจะดำเนินการต่อจากนั้น คำอธิบายแบบเต็ม: [วิธีทำงานของคำสั่ง](how-commands-work.md)

## ห้านาทีแรกของคุณ

วงจรทั้งหมด โดยแต่ละขั้นตอนจะระบุว่าสำเร็จที่จุดใด:

```text
เทอร์มินัล   $ npm install -g @fission-ai/openspec@latest
เทอร์มินัล   $ cd your-project && openspec init
แชท AI      /opsx:explore                    (ไม่จำเป็น: คิดให้ชัดเจนก่อนก็ได้)
แชท AI      /opsx:propose add-dark-mode      (AI เขียนร่างแผน; คุณตรวจสอบ)
แชท AI      /opsx:apply                      (AI สร้างขึ้นมา)
แชท AI      /opsx:archive                    (อัปเดต specs แล้ว, บันทึกการเปลี่ยนแปลงเรียบร้อย)
```

มีสองขั้นตอนในเทอร์มินัลเพื่อตั้งค่าเบื้องต้น จากนั้นคุณจะทำงานหลักในแชท ส่วนที่เหลือของคู่มือนี้จะอธิบายหน้าที่ของแต่ละขั้นตอนและสิ่งที่คุณจะเห็น

> **ยังไม่แน่ใจว่าจะสร้างอะไร? เริ่มด้วย `/opsx:explore`** เป็นผู้ช่วยคิดที่ไม่มีความเสี่ยงที่จะอ่านโค้ดเบสของคุณ วิเคราะห์ตัวเลือก และเปลี่ยนไอเดียที่ยังไม่ชัดเจนให้เป็นแผนที่สมบูรณ์ ก่อนที่จะมีอาร์ติแฟกต์หรือโค้ดใดๆ เกิดขึ้น เมื่อภาพรวมชัดเจนแล้ว มันจะส่งต่อให้ `/opsx:propose` นี่เป็นนิสัยที่ดีที่สุดเมื่อทำงานกับ AI เพราะหากไม่ทำอย่างนี้ AI อาจสร้างสิ่งที่ผิดพลาดอย่างมั่นใจได้ ดูที่ [คู่มือ Explore](explore.md)

## วิธีการทำงาน

OpenSpec ช่วยให้คุณและผู้ช่วยเขียนโค้ด AI ของคุณตกลงกันว่าจะสร้างอะไร ก่อนที่จะเขียนโค้ดใดๆ

**เส้นทางด่วนเริ่มต้น (โปรไฟล์ core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (ไม่จำเป็น)
```

เริ่มด้วย `/opsx:explore` เมื่อคุณกำลังคิดหาว่าจะทำอะไร หรือกระโดดไปที่ `/opsx:propose` ทันทีหากคุณทราบอยู่แล้ว Explore อยู่ในโปรไฟล์เริ่มต้น ดังนั้นคุณสามารถใช้ได้ตลอดเวลาตามที่คุณต้องการ

**เส้นทางขยาย (การเลือกเวิร์กโฟลว์ที่กำหนดเอง):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

โปรไฟล์เริ่มต้นทั่วไปคือ `core` ซึ่งรวมถึงคำสั่ง `propose`, `explore`, `apply`, `sync`, และ `archive` คุณสามารถเปิดใช้งานคำสั่งเวิร์กโฟลว์ขยายได้ด้วย `openspec config profile` จากนั้นรัน `openspec update`

## OpenSpec สร้างอะไรขึ้นมา

หลังจากรันคำสั่ง `openspec init` โครงสร้างโปรเจกต์ของคุณจะเป็นดังนี้:

```
openspec/
├── specs/              # แหล่งข้อมูลที่เชื่อถือได้ (พฤติกรรมของระบบของคุณ)
│   └── <domain>/
│       └── spec.md
├── changes/            # การอัปเดตที่เสนอ (หนึ่งโฟลเดอร์ต่อหนึ่งการเปลี่ยนแปลง)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # สเปคแบบเดลต้า (สิ่งที่กำลังเปลี่ยนแปลง)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # การตั้งค่าคอนฟิกโปรเจกต์ (ไม่จำเป็น)
```

**สองโฟลเดอร์หลัก:**

- **`specs/`** - แหล่งข้อมูลที่เชื่อถือได้ สเปคเหล่านี้อธิบายว่าระบบของคุณทำงานอย่างไรในปัจจุบัน จัดเรียงตามโดเมน (เช่น `specs/auth/`, `specs/payments/`)
- **`changes/`** - การแก้ไขที่เสนอ แต่ละการเปลี่ยนแปลงจะมีโฟลเดอร์ของตัวเองพร้อมกับอาร์ติแฟกต์ทั้งหมดที่เกี่ยวข้อง เมื่อการเปลี่ยนแปลงเสร็จสมบูรณ์ สเปคของมันจะถูกผสานเข้าสู่โฟลเดอร์ `specs/` หลัก

## ทำความเข้าใจอาร์ติแฟกต์

แต่ละโฟลเดอร์การเปลี่ยนแปลงมีอาร์ติแฟกต์ที่ช่วยนำทางการทำงาน:

| อาร์ติแฟกต์ | วัตถุประสงค์ |
|----------|---------|
| `proposal.md` | "ทำไม" และ "อะไร" - จับghiความตั้งใจ ขอบเขต และวิธีการดำเนินการ |
| `specs/` | สเปคแบบเดลต้าที่แสดงความต้องการที่ ADDED/MODIFIED/REMOVED |
| `design.md` | "อย่างไร" - วิธีดำเนินการทางเทคนิคและการตัดสินใจด้านสถาปัตยกรรม |
| `tasks.md` | รายการตรวจสอบการนำไปปฏิบัติพร้อมช่องทำเครื่องหมาย |

**อาร์ติแฟกต์สร้างต่อจากกัน:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            อัปเดตเมื่อคุณเรียนรู้เพิ่มเติม
```

คุณสามารถย้อนกลับไปปรับปรุงอาร์ติแฟกต์ก่อนหน้าได้ตลอดเวลาตอนที่คุณเรียนรู้เพิ่มเติมระหว่างการนำไปปฏิบัติ

## วิธีการทำงานของสเปคแบบเดลต้า

สเปคแบบเดลต้าเป็นแนวคิดหลักของ OpenSpec มันแสดงสิ่งที่กำลังเปลี่ยนแปลงเทียบกับสเปคปัจจุบันของคุณ

### รูปแบบ

สเปคแบบเดลต้าใช้ส่วนต่างๆ เพื่อระบุประเภทของการเปลี่ยนแปลง:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### เกิดอะไรขึ้นเมื่อเก็บarkiv

เมื่อคุณเก็บarkivการเปลี่ยนแปลง:
1. ความต้องการ **ADDED** จะถูกเพิ่มต่อท้ายสเปคหลัก
2. ความต้องการ **MODIFIED** จะแทนที่เวอร์ชันที่มีอยู่
3. ความต้องการ **REMOVED** จะถูกลบออกจากสเปคหลัก

โฟลเดอร์การเปลี่ยนแปลงจะถูกย้ายไปที่ `openspec/changes/archive/` เพื่อเป็นประวัติการตรวจสอบ

## ตัวอย่าง: การเปลี่ยนแปลงแรกของคุณ

มาเรียนรู้ขั้นตอนการเพิ่ม dark mode ให้กับแอปพลิเคชันกัน

### 1. เริ่มต้นการเปลี่ยนแปลง (ค่าเริ่มต้น)

```text
You: /opsx:propose add-dark-mode

AI:  สร้าง openspec/changes/add-dark-mode/ เรียบร้อย
     ✓ proposal.md — ทำไมเราถึงทำนี้, กำลังเปลี่ยนแปลงอะไร
     ✓ specs/       — ความต้องการและสถานการณ์
     ✓ design.md    — วิธีดำเนินการทางเทคนิค
     ✓ tasks.md     — รายการตรวจสอบการนำไปปฏิบัติ
     พร้อมสำหรับการนำไปปฏิบัติแล้ว!
```

หากคุณเปิดใช้งานโปรไฟล์เวิร์กโฟลว์ขยายแล้ว คุณยังสามารถทำขั้นตอนนี้เป็นสองขั้นตอนได้: `/opsx:new` ตามด้วย `/opsx:ff` (หรือ `/opsx:continue` แบบเพิ่มทีละขั้น)

### 2. สิ่งที่จะถูกสร้างขึ้นมา

**proposal.md** - จับghiความตั้งใจ:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - สเปคแบบเดลต้าที่แสดงความต้องการใหม่:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - รายการตรวจสอบการนำไปปฏิบัติ:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. นำไปปฏิบัติ

```text
You: /opsx:apply

AI:  กำลังดำเนินการตามรายการงาน...
     ✓ 1.1 สร้าง ThemeContext พร้อมกับ light/dark state เรียบร้อย
     ✓ 1.2 เพิ่ม CSS custom properties ไปยัง globals.css เรียบร้อย
     ✓ 1.3 นำ localStorage persistence ไปปฏิบัติ เรียบร้อย
     ✓ 2.1 สร้าง ThemeToggle component เรียบร้อย
     ...
     งานทั้งหมดเสร็จสมบูรณ์!
```

ระหว่างการนำไปปฏิบัติ หากคุณพบว่าการออกแบบจำเป็นต้องปรับเปลี่ยน เพียงอัปเดตอาร์ติแฟกต์และดำเนินการต่อ

### 4. เก็บarkiv

```text
You: /opsx:archive

AI:  กำลังเก็บarkiv add-dark-mode...
     ✓ ผสานสเปคเข้าสู่ openspec/specs/ui/spec.md เรียบร้อย
     ✓ ย้ายไปที่ openspec/changes/archive/2025-01-24-add-dark-mode/ เรียบร้อย
     เสร็จแล้ว! พร้อมสำหรับฟีเจอร์ถัดไป
```

สเปคแบบเดลต้าของคุณขณะนี้เป็นส่วนหนึ่งของสเปคหลัก จัดทำเป็นเอกสารเกี่ยวกับการทำงานของระบบของคุณ

## การตรวจสอบและทบทวน

ใช้ CLI เพื่อตรวจสอบการเปลี่ยนแปลงของคุณ:

```bash
# แสดงรายการการเปลี่ยนแปลงที่ใช้งานอยู่
openspec list

# ดูรายละเอียดการเปลี่ยนแปลง
openspec show add-dark-mode

# ตรวจสอบรูปแบบสเปค
openspec validate add-dark-mode

# แดชบอร์ดแบบโต้ตอบ
openspec view
```

## ขั้นตอนต่อไป

- [สำรวจก่อน](explore.md) - ใช้ `/opsx:explore` เพื่อคิดไอเดียให้ชัดเจนก่อนที่คุณจะเริ่มดำเนินการ
- [ทบทวนการเปลี่ยนแปลง](reviewing-changes.md) - สิ่งที่ควรตรวจสอบในแผนที่ AI เขียนร่าง ก่อนที่จะเขียนโค้ดใดๆ
- [การเขียนสเปคที่ดี](writing-specs.md) - ความต้องการและสถานการณ์ที่ดีมีลักษณะอย่างไร
- [ใช้ OpenSpec ในโปรเจกต์ที่มีอยู่แล้ว](existing-projects.md) - เริ่มต้นกับโค้ดเบส brownfield ขนาดใหญ่ที่มีอยู่แล้ว
- [แก้ไขและปรับปรุงการเปลี่ยนแปลง](editing-changes.md) - อัปเดตอาร์ติแฟกต์ ย้อนกลับ ปรับให้สอดคล้องกับการแก้ไขด้วยตนเอง
- [แนวคิดหลักโดยสังเขบ](overview.md) - โมเดลความคิดทั้งหมดในหนึ่งหน้า
- [ตัวอย่างและสูตรปฏิบัติการ](examples.md) - การเปลี่ยนแปลงจริง ตั้งแต่ต้นจนจบ
- [เวิร์กโฟลว์](workflows.md) - แนวปฏิบัติทั่วไปและเวลาที่ควรใช้แต่ละคำสั่ง
- [คำสั่ง](commands.md) - แหล่งอ้างอิงแบบเต็มสำหรับคำสั่งสแลชทั้งหมด
- [แนวคิด](concepts.md) - ความเข้าใจลึกเกี่ยวกับสเปค การเปลี่ยนแปลง และ schemas
- [การปรับแต่ง](customization.md) - ทำให้ OpenSpec ทำงานตามที่คุณต้องการ
- [Stores](stores-beta/user-guide.md) - วางแผนที่ข้าม repos หรือทีม? เก็บไว้ใน repo ของตัวเอง (เบต้า)
- [FAQ](faq.md) และ [การแก้ไขปัญหา](troubleshooting.md) - เมื่อคุณติดขัด