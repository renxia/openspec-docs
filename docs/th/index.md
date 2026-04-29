---
layout: home

hero:
  name: "OpenSpec"
  text: "การพัฒนาที่ขับเคลื่อนด้วยข้อกำหนด สำหรับ AI ผู้ช่วย"
  tagline: ข้อกำหนดเบาๆ สำหรับการสร้างและจัดการโปรเจกต์ AI ผู้ช่วย
  actions:
    - theme: brand
      text: เริ่มต้นใช้งาน
      link: ./getting-started
    - theme: alt
      text: หน้าแรก
      link: /

features:
  - title: ขั้นตอนการทำงานที่ให้ข้อกำหนดมาก่อน
    details: กำหนดความต้องการก่อนเขียนโค้ด
  - title: การออกแบบที่เป็น AI โดยธรรมชาติ
    details: สร้างมาสำหรับ Claude Code, Cursor, Windsurf และอื่นๆ
  - title: หลายภาษา
    details: เอกสารประกอบมีให้บริการในหลายภาษา
---


<details>
<summary><strong>เฟรมเวิร์กข้อกำหนดที่ได้รับความนิยมมากที่สุด</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
ปรัชญาของเรา:

```text
→ ยืดหยุ่น ไม่ใช่แข็งทื่อ
→ เป็นแบบวนซ้ำ ไม่ใช่น้ำตก
→ ง่าย ไม่ใช่ซับซ้อน
→ สร้างมาสำหรับโปรเจกต์ที่มีอยู่แล้ว ไม่ใช่แค่โปรเจกต์ใหม่
→ ปรับขนาดได้ตั้งแต่โปรเจกต์ส่วนบุคคลไปจนถึงองค์กร
```

> [!TIP]
> **ขั้นตอนการทำงานใหม่พร้อมใช้งานแล้ว!** เราได้สร้าง OpenSpec ใหม่ด้วยขั้นตอนการทำงานที่แนะนำโดย artifact
>
> รัน `/opsx:propose "your idea"` เพื่อเริ่มต้น → [เรียนรู้เพิ่มเติมที่นี่](opsx.md)

<p align="center">
  ติดตาม <a href="https://x.com/0xTab">@0xTab บน X</a> สำหรับการอัปเดต · เข้าร่วม <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> เพื่อขอความช่วยเหลือและถามคำถาม
</p>

<!-- TODO: Add GIF demo of /opsx:propose → /opsx:archive workflow -->

## ดูตัวอย่างการใช้งาน

```text
You: /opsx:propose add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /opsx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /opsx:archive
AI:  Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>แดชบอร์ด OpenSpec</strong></summary>

</details>

## เริ่มต้นอย่างรวดเร็ว

**ต้องใช้ Node.js เวอร์ชัน 20.19.0 หรือใหม่กว่า**

ติดตั้ง OpenSpec ทั่วทั้งระบบ:

```bash
npm install -g @fission-ai/openspec@latest
```

จากนั้นไปที่ไดเรกทอรีโปรเจกต์ของคุณและเริ่มต้น:

```bash
cd your-project
openspec init
```

ตอนนี้บอก AI ของคุณ: `/opsx:propose <what-you-want-to-build>`

หากคุณต้องการขั้นตอนการทำงานที่ขยาย (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`) ให้เลือกด้วย `openspec config profile` และนำไปใช้ด้วย `openspec update`

> [!NOTE]
> ไม่แน่ใจว่าเครื่องมือของคุณได้รับการสนับสนุนหรือไม่? [ดูรายการทั้งหมด](supported-tools.md) – เราสนับสนุนเครื่องมือมากกว่า 25 รายการและกำลังเพิ่มขึ้นเรื่อยๆ
>
> ยังใช้งานได้กับ pnpm, yarn, bun และ nix [ดูตัวเลือกการติดตั้ง](installation.md)

## เอกสารประกอบ

→ **[เริ่มต้นใช้งาน](getting-started.md)**: ขั้นตอนแรก<br>
→ **[ขั้นตอนการทำงาน](workflows.md)**: การผสมผสานและรูปแบบ<br>
→ **[คำสั่ง](commands.md)**: คำสั่งแบบ slash และทักษะ<br>
→ **[CLI](cli.md)**: อ้างอิงเทอร์มินัล<br>
→ **[เครื่องมือที่รองรับ](supported-tools.md)**: การผสานรวมเครื่องมือและเส้นทางการติดตั้ง<br>
→ **[แนวคิด](concepts.md)**: วิธีที่ทุกอย่างเชื่อมต่อกัน<br>
→ **[หลายภาษา](multi-language.md)**: การสนับสนุนหลายภาษา<br>
→ **[การปรับแต่ง](customization.md)**: ทำให้เป็นของคุณเอง


## ทำไมต้อง OpenSpec?

AI ผู้ช่วยเขียนโค้ดนั้นทรงพลังแต่ไม่สามารถคาดเดาได้เมื่อข้อกำหนดอยู่เฉพาะในประวัติการแชท OpenSpec เพิ่มชั้นข้อกำหนดเบาๆ เพื่อให้คุณตกลงในสิ่งที่จะสร้างก่อนที่จะเขียนโค้ดใดๆ

- **ตกลงก่อนที่จะสร้าง** — มนุษย์และ AI ตกลงในข้อกำหนดก่อนที่จะเขียนโค้ด
- **จัดระเบียบอยู่เสมอ** — การเปลี่ยนแปลงแต่ละครั้งจะมีโฟลเดอร์ของตัวเองพร้อมข้อเสนอ ข้อกำหนด การออกแบบ และงาน
- **ทำงานอย่างยืดหยุ่น** — อัปเดต artifact ใดก็ได้ตลอดเวลา ไม่มีขั้นตอนที่เข้มงวด
- **ใช้เครื่องมือของคุณ** — ทำงานร่วมกับ AI ผู้ช่วยมากกว่า 20 รายการผ่านคำสั่งแบบ slash

### เปรียบเทียบกับเรา

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — ละเอียดถี่ถ้วนแต่หนัก OpenSpec เบากว่าและให้คุณวนซ้ำได้อย่างอิสระ

**vs. [Kiro](https://kiro.dev)** (AWS) — ทรงพลังแต่คุณถูกล็อกไว้ใน IDE ของพวกเขาและจำกัดเฉพาะโมเดล Claude OpenSpec ทำงานร่วมกับเครื่องมือที่คุณใช้อยู่แล้ว

**vs. ไม่มีอะไร** — การเขียนโค้ดด้วย AI โดยไม่มีข้อกำหนดหมายถึง prompt ที่คลุมเครือและผลลัพธ์ที่คาดเดาไม่ได้ OpenSpec นำความคาดเดาได้มาโดยไม่ต้องมีพิธีรีตอง

## การอัปเดต OpenSpec

**อัปเกรดแพ็กเกจ**

```bash
npm install -g @fission-ai/openspec@latest
```

**รีเฟรชคำแนะนำของ agent**

รันคำสั่งนี้ในแต่ละโปรเจกต์เพื่อสร้างคำแนะนำ AI ใหม่และให้แน่ใจว่าคำสั่งแบบ slash ล่าสุดทำงานอยู่:

```bash
openspec update
```

## บันทึกการใช้งาน

**การเลือกโมเดล**: OpenSpec ทำงานได้ดีที่สุดกับโมเดลที่มีเหตุผลสูง เราแนะนำ Opus 4.5 และ GPT 5.2 สำหรับทั้งการวางแผนและการนำไปใช้งาน

**สุขอนามัยบริบท**: OpenSpec ได้ประโยชน์จากหน้าต่างบริบทที่สะอาด ล้างบริบทของคุณก่อนเริ่มการนำไปใช้งานและรักษาสุขอนามัยบริบทที่ดีตลอดเซสชันของคุณ

## การมีส่วนร่วม

**การแก้ไขเล็กน้อย** — การแก้ไขข้อผิดพลาด การแก้ไขข้อผิดพลาด และการปรับปรุงเล็กน้อยสามารถส่งเป็น PR ได้โดยตรง

**การเปลี่ยนแปลงที่ใหญ่กว่า** — สำหรับฟีเจอร์ใหม่ การ refactor ที่สำคัญ หรือการเปลี่ยนแปลงสถาปัตยกรรม โปรดส่งข้อเสนอการเปลี่ยนแปลง OpenSpec ก่อนเพื่อให้เราตกลงในเจตนาและเป้าหมายก่อนที่จะเริ่มการนำไปใช้งาน

เมื่อเขียนข้อเสนอ โปรดคำนึงถึงปรัชญาของ OpenSpec: เราให้บริการผู้ใช้ที่หลากหลายใน agent ต่างๆ โมเดล และกรณีการใช้งาน การเปลี่ยนแปลงควรทำงานได้ดีสำหรับทุกคน

**ยินดีต้อนรับโค้ดที่สร้างโดย AI** — ตราบใดที่ได้รับการทดสอบและตรวจสอบแล้ว PR ที่มีโค้ดที่สร้างโดย AI ควรระบุ agent ที่ใช้เขียนโค้ดและโมเดล (เช่น "สร้างด้วย Claude Code โดยใช้ claude-opus-4-5-20251101")

### การพัฒนา

- ติดตั้ง dependency: `pnpm install`
- สร้าง: `pnpm run build`
- ทดสอบ: `pnpm test`
- พัฒนา CLI ท้องถิ่น: `pnpm run dev` หรือ `pnpm run dev:cli`
- การ commit แบบ conventional (บรรทัดเดียว): `type(scope): subject`

## อื่นๆ

<details>
<summary><strong>การเก็บข้อมูลการใช้งาน</strong></summary>

OpenSpec เก็บสถิติการใช้งานแบบไม่ระบุตัวตน

เราเก็บเฉพาะชื่อคำสั่งและเวอร์ชันเพื่อเข้าใจรูปแบบการใช้งาน ไม่มีอาร์กิวเมนต์ เส้นทาง เนื้อหา หรือ PII ปิดการใช้งานอัตโนมัติใน CI

**เลิกใช้งาน:** `export OPENSPEC_TELEMETRY=0` หรือ `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>ผู้ดูแลและที่ปรึกษา</strong></summary>

ดู [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) สำหรับรายชื่อผู้ดูแลหลักและที่ปรึกษาที่ช่วยนำทางโปรเจกต์

</details>



## ลิขสิทธิ์

MIT