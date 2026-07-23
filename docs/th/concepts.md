# แนวคิด

คู่มือนี้อธิบายแนวคิดหลักของ OpenSpec และวิธีที่แนวคิดเหล่านี้ทำงานร่วมกัน หากต้องการดูวิธีใช้งานจริง โปรดดูที่ [เริ่มต้นใช้งาน](getting-started.md) และ [กระบวนการทำงาน](workflows.md)

## ปรัชญา

OpenSpec ถูกสร้างขึ้นโดยยึดหลักการสี่ประการ:

```
ยืดหยุ่น ไม่แข็งจงใจ         — ไม่มีประตูเฟส ทำงานกับสิ่งที่เหมาะสมและสมเหตุสมผล
วนซ้ำ ไม่ใช่แบบน้ำตก       — เรียนรู้ขณะพัฒนา ปรับปรุงอย่างต่อเนื่องตามความจำเป็น
ง่าย ไม่ซับซ้อน            — การตั้งค่าที่เบา ไม่มีขั้นตอนที่ยุ่งยากและเป็นพิธีการมาก
brownfield เป็นหลัก        — ทำงานกับฐานโค้ดที่มีอยู่แล้ว ไม่ใช่แค่ greenfield ใหม่
```

### เหตุใดหลักการเหล่านี้จึงสำคัญ

**ยืดหยุ่น ไม่แข็งจงใจ.** ระบบ spec แบบดั้งเดิมจะล็อกคุณไว้ในแต่ละเฟส: ก่อนอื่นวางแผน จากนั้นนำไปปฏิบัติ และเมื่อเสร็จแล้วก็จบงาน OpenSpec ยืดหยุ่นกว่า — คุณสามารถสร้าง artifacts ในลำดับใด ๆ ที่เหมาะสมกับงานของคุณ

**วนซ้ำ ไม่ใช่แบบน้ำตก.** ความต้องการเปลี่ยนแปลง ความเข้าใจเพิ่มมากขึ้น สิ่งที่ดูเหมือนเป็นวิธีการที่ดีในช่วงเริ่มต้นอาจไม่เหมาะสมหลังจากคุณเห็นฐานโค้ดแล้ว OpenSpec ยอมรับความเป็นจริงนี้

**ง่าย ไม่ซับซ้อน.** บางเฟรมเวิร์ค spec ต้องการการตั้งค่าที่ซับซ้อนและต้องใช้เวลานาน รูปแบบที่แข็งจงใจ หรือโปรเซสที่หนักแน่น OpenSpec ไม่รบกวนการทำงานของคุณ เริ่มต้นได้ในไม่กี่วินาที เริ่มทำงานทันที ปรับแต่งได้เฉพาะเมื่อคุณต้องการ

**Brownfield เป็นหลัก.** งานพัฒนาซอฟต์แวร์ส่วนใหญ่ไม่ได้เป็นการสร้างจากศูนย์ — แต่เป็นการแก้ไขระบบที่มีอยู่แล้ว วิธีการแบบ delta ของ OpenSpec ทำให้ง่ายต่อการกำหนดการเปลี่ยนแปลงของพฤติกรรมที่มีอยู่แล้ว ไม่ใช่แค่การอธิบายระบบใหม่

## ภาพรวมทั้งหมด

OpenSpec จัดงานของคุณออกเป็นสองพื้นที่หลัก:

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

**Specs** เป็นแหล่งข้อมูลหลัก — อธิบายว่าระบบของคุณทำงานอย่างไรในปัจจุบัน

**Changes** คือการปรับเปลี่ยนที่เสนอ — อยู่ในโฟลเดอร์แยกต่างหากจนกว่าคุณจะพร้อมที่จะรวม (merge) กับส่วนหลัก

การแยกส่วนนี้เป็นสิ่งสำคัญ คุณสามารถทำงานกับหลาย Changes พร้อมกันโดยไม่เกิดข้อขัดแย้ง คุณสามารถตรวจสอบ Change ก่อนที่มันจะส่งผลต่อ Specs หลัก และเมื่อคุณเก็บถาวร (archive) Change แล้ว deltas ของมันจะรวมเข้าสู่แหล่งข้อมูลหลักอย่างเรียบร้อย

## Specs

Specs อธิบายพฤติกรรมของระบบของคุณโดยใช้ข้อกำหนด (requirements) และสถานการณ์ (scenarios) ที่มีโครงสร้าง

### โครงสร้าง

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

จัดกลุ่ม Specs ตามโดเมน — การจัดกลุ่มตามตรรกะที่เหมาะสมกับระบบของคุณ รูปแบบทั่วไป:

- **ตามพื้นที่ฟีเจอร์**: `auth/`, `payments/`, `search/`
- **ตามคอมโพเนนต์**: `api/`, `frontend/`, `workers/`
- **ตาม Bounded Context**: `ordering/`, `fulfillment/`, `inventory/`

### รูปแบบ Spec

Spec มีข้อกำหนด และแต่ละข้อกำหนดมีสถานการณ์:

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**องค์ประกอบหลัก:**

| องค์ประกอบ | ความหมาย |
|-----------|----------|
| `## Purpose` | คำอธิบายระดับสูงของโดเมนของ Spec นี้ |
| `### Requirement:` | พฤติกรรมเฉพาะที่ระบบต้องมี |
| `#### Scenario:` | ตัวอย่างจริงของข้อกำหนดที่กำลังใช้งาน |
| SHALL/MUST/SHOULD | คำหลักของ RFC 2119 ที่ระบุระดับความเข้มงวดของข้อกำหนด |

### เหตุผลในการจัดโครงสร้าง Spec ไว้ในรูปแบบนี้

**Requirements คือ "อะไร"** — ระบุว่าระบบควรทำอะไรโดยไม่ระบุวิธีการนำไปปฏิบัติใช้ (implementation)

**Scenarios คือ "เมื่อไร"** — ให้ตัวอย่างจริงที่สามารถตรวจสอบได้ Scenarios ที่ดี:
- สามารถทดสอบได้ (คุณสามารถเขียนทดสอบอัตโนมัติ (automated test) สำหรับมันได้)
- include ทั้งเส้นทางปกติ (happy path) และกรณีขอบ (edge cases)
- ใช้ Given/When/Then หรือรูปแบบที่มีโครงสร้างคล้ายกัน

**คำหลักของ RFC 2119** (SHALL, MUST, SHOULD, MAY) สื่อความหมายถึงความตั้งใจ:
- **MUST/SHALL** — ข้อกำหนดที่ขาดไม่ได้
- **SHOULD** — แนะนำ แต่มีข้อยกเว้นได้
- **MAY** — ตัวเลือก

### Spec คืออะไร (และไม่ใช่อะไร)

Spec คือ **สัญญาพฤติกรรม** ไม่ใช่แผนการนำไปปฏิบัติใช้

เนื้อหา Spec ที่ดี:
- พฤติกรรมที่สังเกตได้ซึ่งผู้ใช้หรือระบบที่อยู่ด้านล่าง (downstream systems) พึ่งพา
- ข้อมูลนำเข้า (inputs), ข้อมูลส่งออก (outputs) และเงื่อนไขข้อผิดพลาด (error conditions)
- ข้อจำกัดจากภายนอก (ความปลอดภัย (security), ความเป็นส่วนตัว (privacy), ความน่าเชื่อถือ (reliability), ความเข้ากันได้ (compatibility))
- Scenarios ที่สามารถทดสอบได้หรือตรวจสอบได้อย่างชัดเจน

หลีกเลี่ยงใน Spec:
- ชื่อคลาส/ฟังก์ชันภายใน
- การเลือกไลบรารีหรือ framework
- รายละเอียดการนำไปใช้ทีละขั้นตอน
- แผนการดำเนินการโดยละเอียด (ควรอยู่ใน `design.md` หรือ `tasks.md`)

วิธีทดสอบอย่างเร็ว:
- หากวิธีการนำไปใช้ (implementation) สามารถเปลี่ยนแปลงได้โดยไม่เปลี่ยนแปลงพฤติกรรมที่มองเห็นจากภายนอก ก็มีโอกาสว่าไม่ควรอยู่ใน Spec

### ให้มีน้ำหนักเบา: ความเข้มงวดแบบค่อยเป็นค่อยไป (Progressive Rigor)

OpenSpec ตั้งใจเพื่อหลีกเลี่ยงกระบวนการยุ่งยาก ใช้ระดับที่เบาที่สุดที่ยังทำให้ Change สามารถตรวจสอบยืนยันได้

**Spec รุ่นเบา (ค่าเริ่มต้น):**
- ข้อกำหนดสั้นๆ ที่เน้นพฤติกรรมก่อน
- ขอบเขตและสิ่งที่ไม่ได้เป็นเป้าหมาย (non-goals) ชัดเจน
- การตรวจสอบยอมรับ (acceptance checks) จำนวนไม่มากที่เป็นรูปธรรม

**Spec เต็มรูปแบบ (สำหรับความเสี่ยงสูง):**
- Changes ที่ข้ามทีมหรือข้าม repo (cross-repo)
- การเปลี่ยนแปลง API/สัญญา (contract), การย้ายข้อมูล (migrations), ปัญหาความปลอดภัย/ความเป็นส่วนตัว
- Changes ที่ความไม่ชัดเจนอาจทำให้เกิดการทำงานซ้ำ (rework) ด้วยค่าใช้จ่ายสูง

ส่วนใหญ่ของ Changes ควรอยู่ในโหมด Lite

### การทำงานร่วมกันระหว่างมนุษย์ + เอเจ้นต์ (Agent)

ในหลายทีม มนุษย์ทำการสำรวจและเอเจ้นต์ทำร่างอาร์ติแฟกต์ (artifacts) ลูปที่กำหนดไว้คือ:
1. มนุษย์ให้ความตั้งใจ (intent), บริบท (context) และข้อจำกัด (constraints)
2. เอเจ้นต์แปลงสิ่งนี้เป็น requirements และ scenarios ที่เน้นพฤติกรรมก่อน
3. เอเจ้นต์เก็บรายละเอียดการนำไปใช้ (implementation detail) ใน `design.md` และ `tasks.md` ไม่ใช่ `spec.md`
4. การตรวจสอบยืนยัน (Validation) ชี้ให้เห็นถึงโครงสร้างและความชัดเจนก่อนการนำไปใช้ (implementation)

สิ่งนี้ทำให้ Spec อ่านง่ายสำหรับมนุษย์และสอดคล้องกันสำหรับเอเจ้นต์

## Changes

Change คือการปรับเปลี่ยนที่เสนอสำหรับระบบของคุณ ที่บรรจุเป็นโฟลเดอร์พร้อมกับทุกสิ่งที่จำเป็นเพื่อเข้าใจและนำไปใช้

### โครงสร้าง Change

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

แต่ละ Change เป็นหน่วยที่สมบูรณ์ในตัวเอง มี:
- **Artifacts** — เอกสารที่จับภาพความตั้งใจ (intent), การออกแบบ (design) และงานที่ต้องทำ (tasks)
- **Delta specs** — ข้อกำหนดสำหรับสิ่งที่กำลังจะเพิ่ม, ปรับเปลี่ยน หรือลบออก
- **Metadata** — การกำหนดค่า (configuration) ตัวเลือกสำหรับ Change เฉพาะนี้

### เหตุผลที่ Changes ถูกบรรจุเป็นโฟลเดอร์

การบรรจุ Change เป็นโฟลเดอร์มีประโยชน์หลายอย่าง:
1. **ทุกอย่างอยู่ด้วยกัน** — Proposal, design, tasks และ Specs ทั้งหมดอยู่ในที่เดียว ไม่ต้องค้นหาที่ต่างๆ
2. **ทำงานพร้อมกัน** — หลาย Changes สามารถมีอยู่พร้อมกันโดยไม่เกิดข้อขัดแย้ง สามารถทำงานกับ `add-dark-mode` ในขณะที่ `fix-auth-bug` ยังอยู่ในขั้นตอนดำเนินการ
3. **ประวัติที่สะอาด** — เมื่อ Changes ถูกเก็บถาวร (archived) จะถูกย้ายไปที่ `changes/archive/` พร้อมกับบริบททั้งหมดที่เก็บรักษาไว้ คุณสามารถดูย้อนกลับและเข้าใจไม่เพียงแต่สิ่งที่เปลี่ยนแปลง แต่ยังเข้าใจเหตุผลของการเปลี่ยนแปลงด้วย
4. **เหมาะกับการตรวจสอบ** — โฟลเดอร์ Change ตรวจสอบง่าย — เปิดโฟลเดอร์ อ่าน Proposal, ตรวจสอบ Design, ดู deltas ของ Spec

## Artifacts

Artifacts คือเอกสารภายใน Change ที่ใช้แนะนำการทำงาน

### ลำดับการไหลของ Artifacts

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Artifacts สร้างกันบนพื้นฐานของกันและกัน แต่ละ Artifact ให้บริบทให้กับ Artifact ถัดไป

### ประเภทของ Artifacts

#### Proposal (`proposal.md`)

Proposal จับภาพ **ความตั้งใจ (intent)**, **ขอบเขต (scope)** และ **แนวทาง (approach)** ในระดับสูง

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**ช่วงเวลาที่ควรอัปเดต Proposal:**
- ขอบเขตมีการเปลี่ยนแปลง (แคบลงหรือกว้างขึ้น)
- ความตั้งใจชัดเจนขึ้น (เข้าใจปัญหาดีขึ้น)
- แนวทางมีการเปลี่ยนแปลงพื้นฐาน

#### Specs (delta specs ใน `specs/`)

Delta specs อธิบาย **สิ่งที่กำลังเปลี่ยนแปลง** เทียบกับ Specs ปัจจุบัน ดู [Delta Specs](#delta-specs) ด้านล่าง

#### Design (`design.md`)

Design จับภาพ **แนวทางทางเทคนิค (technical approach)** และ **การตัดสินใจด้านสถาปัตยกรรม (architecture decisions)**

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**ช่วงเวลาที่ควรอัปเดต Design:**
- การนำไปใช้ (implementation) เผยให้เห็นว่าแนวทางไม่สามารถทำงานได้
- พบวิธีแก้ที่ดีกว่า
- ข้อพึ่งพา (dependencies) หรือข้อจำกัดมีการเปลี่ยนแปลง

#### Tasks (`tasks.md`)

Tasks คือ **รายการตรวจสอบการนำไปใช้ (implementation checklist)** — ขั้นตอนที่เป็นรูปธรรมพร้อมกับช่องทำเครื่องหมาย

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**แนวปฏิบัติที่ดีที่สุดสำหรับ Tasks:**
- จัดกลุ่ม Tasks ที่เกี่ยวข้องภายใต้หัวข้อ
- ใช้การลำดับเลขแบบลำดับชั้น (1.1, 1.2 ฯลฯ)
- ทำให้ Tasks มีขนาดเล็กพอที่จะสามารถทำได้ภายในหนึ่งเซสชัน
- ทำเครื่องหมาย Tasks เมื่อคุณทำเสร็จแล้ว

## Delta Specs

Delta specs เป็นแนวคิดหลักที่ทำให้ OpenSpec ทำงานได้กับการพัฒนาบนระบบที่มีอยู่แล้ว (brownfield development) อธิบาย **สิ่งที่กำลังเปลี่ยนแปลง** แทนที่จะระบุข้อกำหนดทั้งหมดใหม่

### รูปแบบ

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### ส่วนของ Delta

| ส่วน | ความหมาย | เกิดอะไรขึ้นเมื่อเก็บถาวร (Archive) |
|------|----------|----------------------------------|
| `## ADDED Requirements` | พฤติกรรมใหม่ | เพิ่มต่อท้าย Spec หลัก |
| `## MODIFIED Requirements` | พฤติกรรมที่เปลี่ยนแปลง | แทนที่ข้อกำหนดที่มีอยู่เดิม |
| `## REMOVED Requirements` | พฤติกรรมที่เลิกใช้ | ลบออกจาก Spec หลัก |

### เหตุผลที่ใช้ Deltas แทน Spec เต็มรูปแบบ

**ความชัดเจน** — Delta แสดงสิ่งที่เปลี่ยนแปลงอย่างถูกต้อง หากอ่าน Spec เต็มรูปแบบ คุณจะต้องทำการเปรียบเทียบ (diff) กับเวอร์ชันปัจจุบันด้วยตนเอง

**หลีกเลี่ยงข้อขัดแย้ง** — 2 Changes สามารถแก้ไขไฟล์ Spec เดียวกันโดยไม่เกิดข้อขัดแย้ง ตราบใดที่พวกมันแก้ไขข้อกำหนดที่แตกต่างกัน

**ประสิทธิภาพในการตรวจสอบ** — ผู้ตรวจสอบเห็นการเปลี่ยนแปลง ไม่ใช่บริบทที่ไม่เปลี่ยนแปลง โฟกัสไปที่สิ่งที่สำคัญ

**เหมาะกับการพัฒนาบนระบบที่มีอยู่แล้ว (Brownfield)** — งานส่วนใหญ่เป็นการปรับเปลี่ยนพฤติกรรมที่มีอยู่ Deltas ทำให้การปรับเปลี่ยนเป็นสิ่งสำคัญ ไม่ใช่เรื่องรองๆ

## สคีมา

สคีกำหนดประเภทของอาร์ติแฟกต์และข้อพึ่งพาของแต่ละประเภทสำหรับเวิร์กโฟลว์

### วิธีการทำงานของสคีมา

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # ไม่มีข้อพึ่งพา สามารถสร้างก่อนได้

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # ต้องการ proposal ก่อนสร้าง

  - id: design
    generates: design.md
    requires: [proposal]      # สามารถสร้างพร้อมกับ specs ได้

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # ต้องการทั้ง specs และ design ก่อน
```

**อาร์ติแฟกต์สร้างกราฟข้อพึ่งพา:**

```
                    proposal
                   (โหนดราก)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (ต้องการ:                  (ต้องการ:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (ต้องการ:
                specs, design)
```

**ข้อพึ่งพาเป็นตัวช่วยเปิดโอกาส ไม่ใช่ตัวจำกัด** พวกมันแสดงว่าสามารถสร้างอะไรได้ ไม่ใช่สิ่งที่คุณต้องสร้างต่อไป คุณสามารถข้าม design ได้หากไม่ต้องการ คุณสามารถสร้าง specs ก่อนหรือหลัง design — ทั้งสองอย่างพึ่งพาเฉพาะ proposal เท่านั้น

### สคีมาที่มีอยู่ภายในระบบ

**spec-driven** (ค่าเริ่มต้น)

เวิร์กโฟลว์มาตรฐานสำหรับการพัฒนาที่ใช้ spec-driven:

```
proposal → specs → design → tasks → implement
```

เหมาะสำหรับ: งานฟีเจอร์ส่วนใหญ่ที่คุณต้องการให้มีการตกลงเกี่ยวกับ specs ก่อนเริ่มนำไปปฏิบัติตาม

### สคีกำหนดเอง

สร้างสคีกำหนดเองสำหรับเวิร์กโฟลว์ของทีมคุณ:

```bash
# สร้างตั้งแต่เริ่มต้น
openspec schema init research-first

# หรือ fork จากที่มีอยู่แล้ว
openspec schema fork spec-driven research-first
```

**ตัวอย่างสคีกำหนดเอง:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # ทำการวิจัยก่อน

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal สร้างจากผลการวิจัย

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # ข้าม specs/design ไปสร้าง tasks โดยตรง
```

ดูรายละเอียดเพิ่มเติมเกี่ยวกับการสร้างและการใช้สคีกำหนดเองที่ [การปรับแต่ง](customization.md)

## การจัดเก็บประวัติ

การจัดเก็บประวัติจะทำให้การเปลี่ยนแปลงเสร็จสมบูรณ์โดยผสานส pec delta ของการเปลี่ยนแปลงนั้นเข้ากับส pec หลักและเก็บรักษาการเปลี่ยนแปลงไว้เพื่อใช้เป็นประวัติศาสตร์

### สิ่งที่เกิดขึ้นเมื่อคุณจัดเก็บประวัติ

```
Before archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │ ผสาน
        ├── design.md                │
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


After archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # ตอนนี้รวมถึงข้อกำหนดเกี่ยวกับ 2FA แล้ว
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # เก็บรักษาไว้เพื่อประวัติศาสตร์
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### กระบวนการจัดเก็บประวัติ

1. **ผสาน delta** แต่ละส่วนของส pec delta (ADDED/MODIFIED/REMOVED) จะถูกนำไปใช้กับส pec หลักที่เกี่ยวข้อง
2. **ย้ายไปยังส่วนจัดเก็บประวัติ** โฟลเดอร์ของการเปลี่ยนแปลงจะถูกย้ายไปที่ `changes/archive/` โดยมีคำนำหน้าวันที่เพื่อจัดเรียงตามลำดับเวลา
3. **เก็บรักษาบริบท** อาร์ติแฟกต์ทั้งหมดยังคงสมบูรณ์ในส่วนจัดเก็บประวัติ คุณสามารถดูย้อนกลับไปเสมอเพื่อเข้าใจเหตุผลของการเปลี่ยนแปลงนั้น

### เหตุผลที่การจัดเก็บประวัติมีความสำคัญ

**สถานะที่สะอาด** การเปลี่ยนแปลงที่กำลังดำเนินการ (`changes/`) จะแสดงเฉพาะงานที่กำลังทำอยู่ งานที่เสร็จสมบูรณ์จะถูกย้ายออกไป

**เส้นทางตรวจสอบ** ส่วนจัดเก็บประวัติเก็บรักษาบริบททั้งหมดของการเปลี่ยนแปลงแต่ละครั้ง — ไม่ใช่แค่สิ่งที่เปลี่ยนไป แต่ยังรวมถึง proposal ที่อธิบายเหตุผล, การออกแบบที่อธิบายวิธีการ, และ tasks ที่แสดงงานที่ทำแล้ว

**การพัฒนาของส pec** ส pec เติบโตตามธรรมชาติเมื่อมีการจัดเก็บประวัติการเปลี่ยนแปลงแต่ละครั้ง การจัดเก็บประวัติแต่ละครั้งจะผสาน delta ของมันเข้าไป สร้างส pec ที่ครบถ้วนไปด้วยเวลา

## สิ่งทั้งหมดนี้สอดคล้องกันอย่างไร

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. เริ่มการเปลี่ยนแปลง      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. สร้างอาร์ติแฟกต์     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  สร้าง proposal → specs → design → tasks              │
│   │                │  (ขึ้นอยู่กับข้อพึ่งพาของสคีมา)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. นำ tasks ไปปฏิบัติตาม  │  /opsx:apply                                            │
│   │     TASKS      │  ทำงานผ่าน tasks โดยทำเครื่องหมายว่าเสร็จแล้ว                  │
│   │                │◄---- ปรับปรุงอาร์ติแฟกต์เมื่อคุณเรียนรู้เพิ่มเติม                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. ตรวจสอบงาน       │  /opsx:verify (optional)                                │
│   │     WORK       │  ตรวจสอบว่าการนำไปปฏิบัติตามสอดคล้องกับ specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. จัดเก็บประวัติการเปลี่ยนแปลง    │────►│  ส pec delta ผสานเข้าไปในส pec หลัก           │    │
│   │     CHANGE     │     │  โฟลเดอร์ของการเปลี่ยนแปลงย้ายไปยัง archive/             │    │
│   └────────────────┘     │  ส pec ตอนนี้เป็นแหล่งข้อมูลที่ถูกปรับปรุงแล้ว   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**วัฎจักรการพัฒนาที่ดี:**

1. ส pec อธิบายพฤติกรรมปัจจุบัน
2. การเปลี่ยนแปลงเสนอการแก้ไข (ในรูปแบบ delta)
3. การนำไปปฏิบัติตามทำให้การเปลี่ยนแปลงเป็นจริง
4. การจัดเก็บประวัติผสาน delta เข้าไปในส pec
5. ส pec ตอนนี้อธิบายพฤติกรรมใหม่
6. การเปลี่ยนแปลงถัดไปจะสร้างบนส pec ที่ถูกปรับปรุงแล้ว

## พจนานุกรม

| Term | Definition |
|------|------------|
| **Artifact** | เอกสารภายในของการเปลี่ยนแปลง (proposal, design, tasks หรือ delta specs) |
| **Archive** | กระบวนการทำให้การเปลี่ยนแปลงเสร็จสมบูรณ์โดยผสาน delta ของมันเข้ากับส pec หลัก |
| **Change** | การแก้ไขที่เสนอสำหรับระบบ จัดอยู่ในโฟลเดอร์พร้อมกับอาร์ติแฟกต์ทั้งหมด |
| **Delta spec** | ส pec ที่อธิบายการเปลี่ยนแปลง (ADDED/MODIFIED/REMOVED) เทียบกับส pec ปัจจุบัน |
| **Domain** | การจัดกลุ่มตรรกะสำหรับส pec (เช่น `auth/`, `payments/`) |
| **Requirement** | พฤติกรรมเฉพาะที่ระบบต้องมี |
| **Scenario** | ตัวอย่างจริงของข้อกำหนด โดยปกติอยู่ในรูปแบบ Given/When/Then |
| **Schema** | การกำหนดประเภทของอาร์ติแฟกต์และข้อพึ่งพาของแต่ละประเภท |
| **Spec** | ข้อกำหนดที่อธิบายพฤติกรรมของระบบ รวมถึงข้อกำหนดและสถานการณ์ |
| **Source of truth** | โฟลเดอร์ `openspec/specs/` ซึ่งมีพฤติกรรมปัจจุบันที่ได้รับการยอมรับร่วมกัน |

## ขั้นตอนต่อไป

- [เริ่มต้นใช้งาน](getting-started.md) - ขั้นตอนแรกที่ใช้งานได้จริง
- [เวิร์กโฟลว์](workflows.md) - แบบงานทั่วไปและเวลาเหมาะสมที่จะใช้แต่ละแบบ
- [คำสั่ง](commands.md) - เอกสารอ้างอิงคำสั่งทั้งหมด
- [การปรับแต่ง](customization.md) - สร้างสคีกำหนดเองและกำหนดค่าโปรเจกต์ของคุณ