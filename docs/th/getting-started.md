# เริ่มต้นใช้งาน

คู่มือนี้อธิบายวิธีการทำงานของ OpenSpec หลังจากที่คุณติดตั้งและเริ่มต้นใช้งานแล้ว สำหรับคำแนะนำการติดตั้ง โปรดดูที่ [README หลัก](index.md#quick-start)

## วิธีการทำงาน

OpenSpec ช่วยให้คุณและผู้ช่วยเขียนโค้ด AI ของคุณตกลงกันว่าจะสร้างอะไรก่อนที่จะเขียนโค้ดใดๆ

**เส้นทางเริ่มต้นแบบเร็ว (โปรไฟล์หลัก):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**เส้นทางแบบขยาย (การเลือกเวิร์กโฟลว์ที่กำหนดเอง):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

โปรไฟล์เริ่มต้นแบบทั่วไปคือ `core` ซึ่งรวมถึง `propose`, `explore`, `apply`, `sync` และ `archive` คุณสามารถเปิดใช้งานคำสั่งเวิร์กโฟลว์แบบขยายได้ด้วย `openspec config profile` แล้วตามด้วย `openspec update`

## สิ่งที่ OpenSpec สร้างขึ้น

หลังจากรัน `openspec init` โปรเจกต์ของคุณจะมีโครงสร้างดังนี้:

```
openspec/
├── specs/              # แหล่งข้อมูลจริง (พฤติกรรมของระบบของคุณ)
│   └── <domain>/
│       └── spec.md
├── changes/            # การอัปเดตที่เสนอ (หนึ่งโฟลเดอร์ต่อการเปลี่ยนแปลง)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # สเปกเดลต้า (สิ่งที่กำลังเปลี่ยนแปลง)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # การกำหนดค่าโปรเจกต์ (ไม่บังคับ)
```

**สองไดเรกทอรีหลัก:**

- **`specs/`** - แหล่งข้อมูลจริง สเปกเหล่านี้อธิบายพฤติกรรมปัจจุบันของระบบของคุณ จัดระเบียบตามโดเมน (เช่น `specs/auth/`, `specs/payments/`)

- **changes/`** - การแก้ไขที่เสนอ การเปลี่ยนแปลงแต่ละรายการจะมีโฟลเดอร์ของตัวเองพร้อมสิ่งประดิษฐ์ที่เกี่ยวข้องทั้งหมด เมื่อการเปลี่ยนแปลงเสร็จสมบูรณ์ สเปกของมันจะถูกรวมเข้ากับไดเรกทอรี `specs/` หลัก

## ทำความเข้าใจสิ่งประดิษฐ์

โฟลเดอร์การเปลี่ยนแปลงแต่ละโฟลเดอร์มีสิ่งประดิษฐ์ที่ช่วยแนะนำการทำงาน:

| สิ่งประดิษฐ์ | วัตถุประสงค์ |
|----------|---------|
| `proposal.md` | "ทำไม" และ "อะไร" - บันทึกเจตนา ขอบเขต และแนวทาง |
| `specs/` | สเปกเดลต้าที่แสดงข้อกำหนดที่เพิ่ม/แก้ไข/ลบ |
| `design.md` | "อย่างไร" - แนวทางทางเทคนิคและการตัดสินใจด้านสถาปัตยกรรม |
| `tasks.md` | รายการตรวจสอบการใช้งานพร้อมช่องทำเครื่องหมาย |

**สิ่งประดิษฐ์สร้างขึ้นซึ่งกันและกัน:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            อัปเดตเมื่อคุณเรียนรู้
```

คุณสามารถย้อนกลับและปรับปรุงสิ่งประดิษฐ์ก่อนหน้าได้เสมอเมื่อคุณเรียนรู้เพิ่มเติมในระหว่างการใช้งาน

## วิธีการทำงานของสเปกเดลต้า

สเปกเดลต้าเป็นแนวคิดหลักใน OpenSpec มันแสดงให้เห็นว่ามีการเปลี่ยนแปลงอะไรบ้างเมื่อเทียบกับสเปกปัจจุบันของคุณ

### รูปแบบ

สเปกเดลต้าใช้ส่วนเพื่อระบุประเภทของการเปลี่ยนแปลง:

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

### สิ่งที่เกิดขึ้นเมื่อจัดเก็บ

เมื่อคุณจัดเก็บการเปลี่ยนแปลง:

1. ข้อกำหนดที่ **เพิ่ม** จะถูกเพิ่มต่อท้ายสเปกหลัก
2. ข้อกำหนดที่ **แก้ไข** จะแทนที่เวอร์ชันที่มีอยู่
3. ข้อกำหนดที่ **ลบ** จะถูกลบออกจากสเปกหลัก

โฟลเดอร์การเปลี่ยนแปลงจะถูกย้ายไปที่ `openspec/changes/archive/` เพื่อเก็บประวัติการตรวจสอบ

## ตัวอย่าง: การเปลี่ยนแปลงครั้งแรกของคุณ

เรามาเดินผ่านขั้นตอนการเพิ่มโหมดมืดให้กับแอปพลิเคชัน

### 1. เริ่มการเปลี่ยนแปลง (ค่าเริ่มต้น)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

หากคุณเปิดใช้งานโปรไฟล์เวิร์กโฟลว์แบบขยาย คุณยังสามารถทำสิ่งนี้เป็นสองขั้นตอนได้: `/opsx:new` แล้วตามด้วย `/opsx:ff` (หรือ `/opsx:continue` เพิ่มเติมทีละนิด)

### 2. สิ่งที่ถูกสร้างขึ้น

**proposal.md** - บันทึกเจตนา:

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

**specs/ui/spec.md** - เดลต้าที่แสดงข้อกำหนดใหม่:

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

**tasks.md** - รายการตรวจสอบการใช้งาน:

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

### 3. ใช้งาน

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

ในระหว่างการใช้งาน หากคุณพบว่าการออกแบบต้องมีการปรับเปลี่ยน เพียงแค่อัปเดตสิ่งประดิษฐ์แล้วดำเนินการต่อ

### 4. จัดเก็บ

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

สเปกเดลต้าของคุณตอนนี้เป็นส่วนหนึ่งของสเปกหลัก ซึ่งบันทึกวิธีการทำงานของระบบของคุณ

## การตรวจสอบและทบทวน

ใช้ CLI เพื่อตรวจสอบการเปลี่ยนแปลงของคุณ:

```bash
# รายการการเปลี่ยนแปลงที่ใช้งานอยู่
openspec list

# ดูรายละเอียดการเปลี่ยนแปลง
openspec show add-dark-mode

# ตรวจสอบรูปแบบสเปก
openspec validate add-dark-mode

# แดชบอร์ดแบบโต้ตอบ
openspec view
```

## ขั้นตอนถัดไป

- [เวิร์กโฟลว์](workflows.md) - รูปแบบทั่วไปและเมื่อใดควรใช้คำสั่งแต่ละคำสั่ง
- [คำสั่ง](commands.md) - การอ้างอิงแบบเต็มสำหรับคำสั่งทั้งหมด
- [แนวคิด](concepts.md) - ความเข้าใจที่ลึกซึ้งยิ่งขึ้นเกี่ยวกับสเปก การเปลี่ยนแปลง และสคีมา
- [การปรับแต่ง](customization.md) - ทำให้ OpenSpec ทำงานในแบบของคุณ