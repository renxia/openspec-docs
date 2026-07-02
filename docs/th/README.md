# เอกสาร OpenSpec

ยินดีต้อนรับ นี่คือศูนย์รวมทุกสิ่งเกี่ยวกับ OpenSpec

OpenSpec ช่วยให้คุณและผู้ช่วยเขียนโค้ด AI ของคุณ **เห็นพ้องต้องกันว่าจะสร้างอะไรก่อนที่จะเริ่มเขียนโค้ด** คุณอธิบายการเปลี่ยนแปลง AI จะร่าง spec สั้นๆ และรายการงาน ทั้งสองฝ่ายจะดูแผนเดียวกัน จากนั้นงานก็จะเกิดขึ้น ไม่ต้องมาค้นพบกลางคันว่า AI สร้างสิ่งที่ผิดพลาดไป

หากคุณอ่านสิ่งอื่นไม่ได้ให้อ่านสองหน้านี้:

1. [Getting Started](getting-started.md): การติดตั้ง การเริ่มต้นใช้งาน และการส่งมอบการเปลี่ยนแปลงครั้งแรกของคุณ
2. [How Commands Work](how-commands-work.md): สถานที่ที่คุณพิมพ์ `/opsx:propose` (คำแนะนำ: ในแชท AI ไม่ใช่ในเทอร์มินัล) สิ่งนี้ทำให้คนส่วนใหญ่สับสนในช่วงแรก

สิ่งหลังมีความสำคัญมากกว่าที่เห็น OpenSpec มีสองส่วน: เครื่องมือบรรทัดคำสั่งที่คุณรันในเทอร์มินัล และ slash commands ที่คุณมอบให้กับผู้ช่วย AI ของคุณ การรู้ว่าอันไหนคืออะไรจะช่วยประหยัดความสับสนที่พบบ่อยที่สุดได้มาก

> **นิสัยที่ดีที่สุดที่ควรสร้างขึ้นก่อน: เมื่อคุณไม่แน่ใจว่าจะสร้างอะไร ให้เริ่มต้นด้วย `/opsx:explore`** มันเป็นคู่คิดในการคิดที่ไม่ต้องมีความเสี่ยงานใดๆ ที่อ่านโค้ดของคุณ ชั่งน้ำหนักตัวเลือก และเปลี่ยนความคิดที่คลุมเครือให้กลายเป็นแผนที่เป็นรูปธรรมก่อนที่จะมีสิ่งประดิษฐ์หรือโค้ดใดๆ เกิดขึ้น คู่มือ [Explore First](explore.md) จะแสดงเหตุผล

## เลือกเส้นทางของคุณ

**ฉันเป็นมือใหม่สุดๆ** เริ่มต้นด้วย [Getting Started](getting-started.md) จากนั้นอ่านสรุปภาพรวมจาก [Core Concepts at a Glance](overview.md) เมื่อมีบางอย่างที่รู้สึกว่าลึกลับ [FAQ](faq.md) และ [Glossary](glossary.md) ก็อยู่ใกล้ๆ
**ฉันมีปัญหาแต่ยังไม่มีแผน** นี่คือกรณีทั่วไป และมีคำตอบเฉพาะ: [Explore First](explore.md) ใช้ `/opsx:explore` เพื่อคิดไตร่ตรองกับ AI ก่อนที่จะตัดสินใจทำอะไรลงไป
**ฉันมี codebase ขนาดใหญ่ที่มีอยู่แล้ว** คุณไม่จำเป็นต้องจัดทำเอกสารทั้งหมด [Using OpenSpec in an Existing Project](existing-projects.md) แสดงวิธีการเริ่มต้นบนโค้ดจริงที่เป็น brownfield โดยไม่ต้องพยายามครอบคลุมทุกอย่าง
**ฉันแค่อยากให้มันทำงานได้** [Install](installation.md) รัน `openspec init` จากนั้นอ่าน [How Commands Work](how-commands-work.md) เพื่อให้แน่ใจว่า slash command แรกของคุณไปอยู่ในที่ที่ถูกต้อง
**ฉันเรียนรู้จากการดูตัวอย่าง** หน้า [Examples & Recipes](examples.md) จะพาคุณผ่านการเปลี่ยนแปลงจริงตั้งแต่ต้นจนจบ: ฟีเจอร์เล็กๆ การแก้ไขบั๊ก การรีแฟคเตอร์ หรือการสำรวจ
**ฉันมาจาก workflow เก่า** [Migration Guide](migration-guide.md) อธิบายว่าอะไรเปลี่ยนไปและทำไม่อย่างไร และรับประกันว่างานที่มีอยู่ของคุณปลอดภัย
**ฉันต้องการปรับให้เข้ากับกระบวนการของทีม** [Customization](customization.md) ครอบคลุมการตั้งค่าโปรเจกต์ สคีมาที่กำหนดเอง และบริบทที่ใช้ร่วมกัน
**มีบางอย่างพัง** [Troubleshooting](troubleshooting.md) รวบรวมความล้มเหลวที่ผู้คนพบเจอจริง พร้อมวิธีแก้ไข
## แผนผังทั้งหมด

### เริ่มต้นที่นี่

| Doc | สิ่งที่คุณจะได้รับ |
|-----|-------------------|
| [Getting Started](getting-started.md) | การติดตั้ง การเริ่มต้นใช้งาน และการรันการเปลี่ยนแปลงครั้งแรกของคุณตั้งแต่ต้นจนจบ |
| [Explore First](explore.md) | ใช้ `/opsx:explore` เพื่อคิดไตร่ตรองแนวคิดก่อนที่คุณจะตัดสินใจทำ |
| [How Commands Work](how-commands-work.md) | สถานที่ที่ slash commands ทำงาน ความหมายของ "interactive mode" เทียบกับ terminal และ chat |
| [Core Concepts at a Glance](overview.md) | โมเดลความคิดทั้งหมดในหน้าเดียว: specs, changes, deltas, archive |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix และวิธีการตรวจสอบว่าทำงานได้แล้ว |

### ใช้ในชีวิตประจำวัน

| Doc | สิ่งที่คุณจะได้รับ |
|-----|-------------------|
| [Workflows](workflows.md) | รูปแบบที่พบบ่อยและเมื่อใดควรใช้แต่ละคำสั่ง |
| [Examples & Recipes](examples.md) | การสาธิตการเปลี่ยนแปลงจริงทั้งหมด ที่สามารถคัดลอกไปใช้งานได้ทันที |
| [Using OpenSpec in an Existing Project](existing-projects.md) | การนำ OpenSpec มาใช้กับ codebase ขนาดใหญ่ที่เป็น brownfield |
| [Editing & Iterating on a Change](editing-changes.md) | อัปเดต artifacts ย้อนกลับ และการกระทบยอดการแก้ไขด้วยตนเอง |
| [Commands](commands.md) | ข้อมูลอ้างอิงสำหรับทุก slash command `/opsx:*` |
| [CLI](cli.md) | ข้อมูลอ้างอิงสำหรับทุกคำสั่ง `openspec` ในเทอร์มินัล |

### ทำความเข้าใจอย่างลึกซึ้ง

| Doc | สิ่งที่คุณจะได้รับ |
|-----|-------------------|
| [Concepts](concepts.md) | คำอธิบายแบบเต็มของ specs, changes, artifacts, schemas และ archive |
| [OPSX Workflow](opsx.md) | เหตุผลที่ว่าทำไม่งานจึงมีความยืดหยุ่นแทนที่จะถูกล็อกเป็นเฟสบวกกับเจาะลึกด้านสถาปัตยกรรม |
| [Glossary](glossary.md) | คำศัพท์ทุกคำที่กำหนดไว้ในที่เดียว |

### ทำให้เป็นของคุณเอง

| Doc | สิ่งที่คุณจะได้รับ |
|-----|-------------------|
| [Customization](customization.md) | การตั้งค่าโปรเจกต์ สคีมาที่กำหนดเอง และบริบทที่ใช้ร่วมกัน |
| [Multi-Language](multi-language.md) | สร้าง artifacts ในภาษาอื่นที่ไม่ใช่ภาษาอังกฤษ |
| [Supported Tools](supported-tools.md) | เครื่องมือ AI กว่า 25 ตัวที่ OpenSpec ผสานรวมด้วยและไฟล์จะไปอยู่ที่ใด |

### เมื่อคุณต้องการความช่วยเหลือ

| Doc | สิ่งที่คุณจะได้รับ |
|-----|-------------------|
| [FAQ](faq.md) | คำตอบด่วนสำหรับคำถามที่ผู้คนถามบ่อยที่สุด |
| [Troubleshooting](troubleshooting.md) | วิธีแก้ไขที่เป็นรูปธรรมสำหรับความล้มเหลวที่เป็นรูปธรรม |
| [Migration Guide](migration-guide.md) | การย้ายจาก workflow เดิมมาสู่ OPSX |

### ประสานงานข้าม repositories (beta)

| Doc | สิ่งที่คุณจะได้รับ |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | วางแผนใน repo ของตัวเองเมื่องานของคุณครอบคลุมหลาย repos หรือทีม |
| [Agent Contract](agent-contract.md) | ส่วนติดต่อ CLI ที่อ่านได้ด้วยเครื่องจักรซึ่ง agents ใช้ขับเคลื่อน |

## เวอร์ชั่นสามสิบวินาที

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← optional, but a great habit
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

ขั้นตอนที่ 1 และ 2 เกิดขึ้นในเทอร์มินัลของคุณ ส่วนที่เหลือเกิดขึ้นในแชทของผู้ช่วย AI ของคุณ การแบ่งแยกนี้คือสิ่งเดียวที่คุ้มค่าแก่การจดจำ และ [How Commands Work](how-commands-work.md) อธิบายอย่างชัดเจนว่าทำไม่อย่างไร ขั้นตอนที่ 3 เป็นทางเลือก แต่การเริ่มต้นด้วย `/opsx:explore` เมื่อคุณไม่แน่ใจเป็นนิสัยที่ควรสร้างมากที่สุด

## ที่อื่นที่คุณจะได้รับความช่วยเหลือ

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) สำหรับคำถาม แนวคิด และความช่วยเหลือ
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) สำหรับบั๊กและคำขอฟีเจอร์
- **`openspec feedback "your message"`** ส่งข้อเสนอแนะจากเทอร์มินัลของคุณโดยตรง (มันจะเปิด GitHub issue)

พบสิ่งใดในเอกสารเหล่านี้ที่ผิด ล้าสมัย หรือสับสนหรือไม่? นั่นคือบั๊ก เปิด issue หรือ PR การปรับปรุงเอกสารเป็นหนึ่งในการมีส่วนร่วมที่มีคุณค่าที่สุดที่คุณสามารถทำได้