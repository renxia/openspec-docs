# Glossary

คำศัพท์ทั้งหมดของ OpenSpec ในที่เดียว อธิบายด้วยภาษาที่เข้าใจง่าย อ่านผ่าน ๆ ครั้งเดียวก็จะสามารถอ่านเอกสารส่วนอื่นได้เร็วขึ้น

คำศัพท์ถูกจัดกลุ่มตามหัวข้อ และเรียงลำดับตัวอักษรภายในแต่ละกลุ่ม

## The core nouns

**Spec.** เอกสารที่อธิบายว่าระบบบางส่วนทำงานอย่างไร Specs จะอยู่ใน `openspec/specs/` จัดระเบียบตามโดเมน และประกอบด้วย requirements และ scenarios Spec คือคำตอบที่เป็นที่ยอมรับร่วมกันสำหรับคำถามที่ว่า "ซอฟต์แวร์นี้ทำอะไร?" ดู [Concepts](concepts.md#specs)

**Source of truth.** ไดเรกทอรี `openspec/specs/` ทั้งหมด เป็นแหล่งเก็บพฤติกรรมปัจจุบันที่ตกลงร่วมกันของระบบ การเปลี่ยนแปลงจะเสนอการแก้ไขต่อมัน ส่วนการจัดเก็บถาวารณกรรม (archiving) จะนำไปใช้จริง

**Change.** หน่วยงานหนึ่งๆ บรรจุอยู่ในรูปแบบโฟลเดอร์ภายใต้ `openspec/changes/<name>/` Change เก็บทุกอย่างเกี่ยวกับงานนั้น: ข้อเสนอแนะ การออกแบบ งาน และการแก้ไข spec ที่มันนำมาให้ One change, one feature or fix.

**Artifact.** เอกสารที่อยู่ภายใน Change Artifact มาตรฐาน ได้แก่ proposal delta specs design และtasks พวกมันถูกสร้างตามลำดับการพึ่งพาอาศัยกันและป้อนข้อมูลเข้าหากัน

**Delta spec.** Spec ภายใน Change ที่อธิบายเฉพาะสิ่งที่กำลังเปลี่ยนแปลง โดยใช้ส่วน `ADDED` `MODIFIED` และ `REMOVED` แทนที่จะกล่าวซ้ำทั้ง spec นี่คือสิ่งที่ทำให้ OpenSpec สามารถแก้ไขระบบที่มีอยู่ได้อย่างสะอาดตา ดู [Concepts](concepts.md#delta-specs)

**Domain.** การจัดกลุ่มเชิงตรรกะสำหรับ specs เช่น `auth/` `payments/` หรือ `ui/` คุณเลือกโดเมนที่สอดคล้องกับวิธีที่คุณคิดเกี่ยวกับระบบของคุณ

## Inside a spec

**Requirement.** พฤติกรรมเดียวที่ระบบต้องมี โดยปกติเขียนด้วยคีย์เวิร์ด RFC 2119: "The system SHALL expire sessions after 30 minutes." Requirements ระบุ *what* ไม่ใช่ *how*

**Scenario.** ตัวอย่างที่เป็นรูปธรรมและสามารถทดสอบได้ของ requirement ที่กำลังทำงานอยู่ มักอยู่ในรูปแบบ Given/When/Then Scenarios ทำให้ requirement สามารถตรวจสอบได้ คุณสามารถเขียน automated test จากสิ่งนี้ได้

**RFC 2119 keywords.** คำว่า MUST SHALL SHOULD และ MAY ซึ่งมีความหมายมาตรฐานเกี่ยวกับระดับความเข้มงวดของ requirement MUST และ SHALL เป็นสิ่งที่ต้องทำอย่างแน่นอน SHOULD คือข้อแนะนำพร้อมมีข้อยกเว้น MAY เป็นทางเลือก ชื่อมาจากเอกสารมาตรฐานอินเทอร์เน็ตที่กำหนดสิ่งเหล่านี้

## The artifacts

**Proposal (`proposal.md`).** *Why* และ *what* ของการเปลี่ยนแปลง: เจตนา ขอบเขต และแนวทางระดับสูง Artifact แรกที่คุณสร้างขึ้น

**Design (`design.md`).** *How*: แนวทางทางเทคนิค การตัดสินใจด้านสถาปัตยกรรม และไฟล์ที่คุณคาดว่าจะต้องแก้ไข เป็นทางเลือกสำหรับ Change ง่ายๆ

**Tasks (`tasks.md`).** รายการตรวจสอบการนำไปใช้งานพร้อมช่องทำเครื่องหมาย AI จะดำเนินการผ่านมันระหว่าง `/opsx:apply` และจะติ๊กรายการเมื่อทำงานไปแล้ว

## The lifecycle

**Archive.** การกระทำที่เสร็จสิ้น Change Delta specs ของมันจะถูกรวมเข้ากับ main specs และโฟลเดอร์ change จะย้ายไปยัง `openspec/changes/archive/YYYY-MM-DD-<name>/` หลังจากเก็บถาวารณกรรม (archiving) specs ของคุณจะอธิบายความเป็นจริงใหม่ ดู [Concepts](concepts.md#archive)

**Sync.** การรวม delta specs ของ Change เข้ากับ main specs *โดยที่ไม่ได้* เก็บถาวารณกรรม (archiving) Change นั้น โดยปกติจะเป็นอัตโนมัติ (archive เสนอให้ทำ) แต่สามารถใช้งานได้ด้วยตัวเองผ่าน `/opsx:sync` สำหรับการเปลี่ยนแปลงที่ดำเนินไปเป็นเวลานาน ดู [Commands](commands.md#opsxsync)

## Workflow and commands

**OPSX.** workflow มาตรฐานของ OpenSpec ที่สร้างขึ้นรอบๆ การกระทำแบบไหลลื่น (fluid actions) แทนที่จะเป็นขั้นตอนที่ตายตัว Slash command ทั้งหมดเริ่มต้นด้วย `/opsx:` ดู [OPSX Workflow](opsx.md)

**Slash command.** คำสั่งที่คุณพิมพ์ลงใน chat ของ AI assistant เช่น `/opsx:propose` Slash commands เป็นตัวขับเคลื่อน workflow พวกมันไม่ใช่ terminal commands ดู [How Commands Work](how-commands-work.md)

**Explore (`/opsx:explore`).** คำสั่งที่เป็นคู่คิด (thinking-partner) มันจะอ่าน codebase ของคุณ เปรียบเทียบทางเลือก และทำให้ไอเดียที่ไม่ชัดเจนกลายเป็นแผนที่เป็นรูปธรรม โดยไม่สร้าง artifacts ใดๆ และไม่ได้เขียนโค้ดใดๆ เป็นจุดเริ่มต้นที่แนะนำเมื่อคุณมีปัญหาแต่ยังไม่มีแผน ดู [Explore First](explore.md)

**CLI.** โปรแกรม `openspec` ที่คุณรันใน terminal มันจะตั้งค่าโปรเจกต์ แสดงและตรวจสอบการเปลี่ยนแปลง เปิด dashboard และเก็บถาวารณกรรม (archiving) เป็นส่วนของ OpenSpec ใน terminal ดู [CLI](cli.md)

**Skill.** โฟลเดอร์คำแนะนำ (`.../skills/openspec-*/SKILL.md`) ที่ AI assistant ของคุณจะตรวจจับและทำตาม Skills คือมาตรฐานข้ามเครื่องมือที่กำลังเกิดขึ้นสำหรับการส่งมอบ workflow ของ OpenSpec ไปยัง assistant

**Command file.** ไฟล์ slash command ต่อเครื่องมือ (`.../commands/opsx-*`) กลไกานำส่งแบบเก่าที่ยังคงรองรับอยู่ควบคู่ไปกับ skills คุณแทบจะไม่ต้องแตะต้องสิ่งเหล่านี้โดยตรง

**Profile.** ชุดของ slash commands ที่ติดตั้งอยู่ในโปรเจกต์ของคุณ **Core** (ค่าเริ่มต้น) ได้แก่ `propose` `explore` `apply` `sync` และ `archive` ชุดที่ **expanded** จะเพิ่ม `new` `continue` `ff` `verify` `bulk-archive` และ `onboard` เปลี่ยนมันด้วย `openspec config profile`

**Delivery.** การที่ OpenSpec ติดตั้ง skills command files หรือทั้งสองอย่างสำหรับเครื่องมือของคุณ กำหนดค่าทั่วโลกและนำไปใช้ด้วย `openspec update`

## Customization

**Schema.** คำจำกัดความของ artifacts ที่ workflow มีและพวกมันพึ่งพาอาศัยกันอย่างไร ค่าเริ่มต้นที่มีอยู่คือ `spec-driven` (proposal → specs → design → tasks) คุณสามารถ fork หรือเขียนเองได้ ดู [Customization](customization.md#custom-schemas)

**Template.** ไฟล์ Markdown ภายใน schema ที่กำหนดรูปร่างสิ่งที่ AI สร้างสำหรับ artifact นั้นๆ การแก้ไข template จะเปลี่ยน output ของ AI ทันทีโดยไม่ต้อง rebuild

**Project config (`openspec/config.yaml`).** การตั้งค่าต่อโปรเจกต์: schema เริ่มต้น `context:` ที่ถูกฉีดเข้าไปในทุกคำขอวางแผน และ `rules:` ต่อartifact วิธีที่ง่ายที่สุดในการสอน OpenSpec เกี่ยวกับ stack และ convention ของคุณ ดู [Customization](customization.md#project-configuration)

**Context injection.** การใส่พื้นหลังของโปรเจกต์ลงในฟิลด์ `context:` ของ `config.yaml` เพื่อให้มันถูกเพิ่มโดยอัตโนมัติไปยังทุก artifact ที่ AI สร้างขึ้น ดีกว่าการหวังว่า AI จะอ่านไฟล์แยกต่างหากัน

**Dependency graph.** กราฟแบบมีทิศทางที่เกิดจากความสัมพันธ์ `requires:` ของ artifacts มันคือ DAG (directed acyclic graph: ลูกศรษ์ชี้ไปข้างหน้าเท่านั้น ไม่ใช่เป็นวง) และ OpenSpec ใช้มันเพื่อรู้ว่าคุณสามารถสร้างอะไรต่อไปได้

**Enablers, not gates.** หลักการที่ว่า dependency ของ artifact แสดงสิ่งที่ *เป็นไปได้* ต่อไป ไม่ใช่สิ่งที่ *จำเป็น* ต่อไป คุณสามารถกลับมาทบทวนและแก้ไข artifact ใดๆ ได้ตลอดเวลา ดู [Core Concepts at a Glance](overview.md#enablers-not-gates)

## Coordination across repos (beta)

คำศัพท์เหล่านี้ใช้ได้ก็ต่อเมื่อการวางแผนของคุณครอบคลุมมากกว่าหนึ่ง repo พวกมันอยู่ในช่วง beta ผู้ใช้ส่วนใหญ่สามารถละเลยพวกมันไปได้ ดูคู่มือผู้ใช้ Stores [Stores User Guide](stores-beta/user-guide.md)

**Store.** repo เดี่ยวที่มีหน้าที่ทั้งหมดคือการวางแผน มันมีรูปแบบ `openspec/` แบบเดียวกับที่คุณทราบอยู่แล้ว (specs และ changes) บวกกับไฟล์ identity ขนาดเล็ก คุณลงทะเบียนมันบนเครื่องของคุณหนึ่งครั้งตามชื่อ จากนั้นคำสั่ง OpenSpec ใดๆ ก็สามารถทำงานในมันได้จากทุกที่

**Reference.** การประกาศภายใน `openspec/config.yaml` ของโค้ด repo ที่อ้างถึง store นั้น References เป็นแบบอ่านได้อย่างเดียว: repo เก็บ root ของตัวเอง และ `openspec instructions` จะได้รับ index ของ specs ของ store ที่ถูกอ้างถึง โดยแต่ละอันมีคำสั่งที่แน่นอนในการดึงมันมา

**Working context.** สิ่งที่ `openspec context` รวบรวมขึ้นสำหรับ repo ปัจจุบัน: OpenSpec root ของมัน บวกกับทุก store ที่มันอ้างถึง พร้อมวิธีที่จะดึงมันมา คำตอบของ "ฉันกำลังทำงานกับอะไรอยู่?"

**Workset.** ชุดโฟลเดอร์ส่วนตัวในเครื่องที่คุณเปิดพร้อมกัน (store ควบคู่ไปกับโค้ด repo ที่คุณทำงาน) สร้างขึ้นโดยเฉพาะด้วย `openspec workset create`; ไม่มีสิ่งใดเกี่ยวกับ path ท้องถิ่นเหล่านั้นถูก commit ไปยัง shared planning repo

## See also

- [Core Concepts at a Glance](overview.md): ห้าแนวคิดในหน้าเดียว
- [Concepts](concepts.md): คำอธิบายแบบยาว
- [How Commands Work](how-commands-work.md): slash commands เทียบกับ CLI