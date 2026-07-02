# ตัวอย่างและสูตรการใช้งาน

การเปลี่ยนแปลงที่แท้จริง ตั้งแต่เริ่มต้นจนเสร็จสิ้น สูตรการใช้งานแต่ละรายการจะแสดงคำสั่งที่คุณต้องพิมพ์และสิ่งที่คุณจะเห็นกลับมา เพื่อให้คุณสามารถจับคู่สถานการณ์ของคุณกับรูปแบบและคัดลอกมัน สิ่งเหล่านี้ใช้คำสั่ง **core** เริ่มต้น (`propose`, `explore`, `apply`, `sync`, `archive`); หากชุดคำสั่งที่ขยายแล้วมีประโยชน์ จะมีการระบุไว้

ข้อควรจำก่อนเริ่มต้น: คำสั่งแบบสแลช (slash commands) เช่น `/opsx:propose` ให้ใส่ใน **แชทของผู้ช่วย AI** และคำสั่ง `openspec` ให้ใส่ใน **เทอร์มินัล** หากยังไม่คุ้นเคย โปรดอ่าน [วิธีที่คำสั่งทำงาน](how-commands-work.md) ก่อน ในบันทึกด้านล่างนี้ `You:` และ `AI:` คือแชท และบรรทัดที่ขึ้นต้นด้วย `$` คือเทอร์มินัล

> **ยังไม่แน่ใจว่ากำลังสร้างอะไรอยู่ใช่ไหม?** สูตรการใช้งานส่วนใหญ่เหล่านี้จะชัดเจนยิ่งขึ้นหากคุณเริ่มต้นด้วย `/opsx:explore` เพื่อคิดให้รอบคอบคลุม [Recipe 3](#recipe-3-exploring-before-you-commit) แสดงตัวอย่าง และคู่มือ [Explore First](explore.md) จะอธิบายในรายละเอียด

## Recipe 1: ฟีเจอร์ขนาดเล็ก เส้นทางด่วน

**เมื่อใดที่ควรใช้:** คุณรู้ว่าต้องการอะไร และมันเป็นงานที่มีขอบเขตจำกัด นี่คือสูตรการใช้งานที่พบบ่อยที่สุด

ทั้งหมดมีสามคำสั่ง คือ Propose, build, archive.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

อ่านแผนงานก่อน เปิดดูข้อเสนอ (proposal) และ delta spec นี่คือสิ่งที่ OpenSpec ถูกสร้างขึ้นมาเพื่อทำ: การจับข้อสันนิษฐานที่ผิดพลาดในขณะที่มันยังเป็นเพียงย่อหน้าเดียว ไม่ใช่ 400 บรรทัดของโค้ด แก้ไขสิ่งประดิษฐ์ใด ๆ โดยตรงหากมีบางอย่างไม่ถูกต้อง จากนั้นจึงดำเนินการต่อ

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

แค่นั้นเอง พฤติกรรมของการออกจากระบบก็เป็นส่วนหนึ่งของข้อกำหนด (specs) ของคุณ และการเปลี่ยนแปลงนั้นถูกจัดเก็บพร้อมกับบริบททั้งหมด

## Recipe 2: การแก้ไขบั๊ก (Bug Fix)

**เมื่อใดที่ควรใช้:** มีบางอย่างผิดพลาดและคุณต้องการให้การแก้ไขนั้นถูกบันทึกเป็นการเปลี่ยนแปลงโดยเจตนาต่อพฤติกรรม ไม่ใช่แค่ commit ลึกลับ

การแก้ไขบั๊กทำงานเหมือนฟีเจอร์ สิ่งที่แตกต่างคือวิธีการกำหนดข้อเสนอ: อธิบายพฤติกรรมที่ *ถูกต้อง* ไม่ใช่แค่ "แก้ไขบั๊ก"

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

เนื่องจากการแก้ไขถูกบันทึกเป็นข้อกำหนดที่ `MODIFIED` พร้อมสถานการณ์ใหม่ บุคคลถัดไป (หรือเซสชัน AI ถัดไป) จึงเห็นว่าคุณแก้ไขมันแล้ว ไม่ใช่แค่ว่า "ถูกต้อง" หมายถึงอะไร จากนั้นก็ใช้ `/opsx:apply` และ `/opsx:archive` ตามปกติ

เคล็ดลับ: สำหรับการแก้ไข สถานการณ์ที่ดีคือ regression test ในรูปแบบข้อความ เช่น "GIVEN ผู้ใช้ที่ออกจากระบบ, WHEN พวกเขาส่งข้อมูลรับรองความถูกต้องที่ถูกต้อง, THEN พวกเขาจะไปที่แดชบอร์ดและไม่ถูกเปลี่ยนเส้นทางอีก" เขียนสิ่งนั้น และการดำเนินการก็จะมีเป้าหมายที่ชัดเจน

## Recipe 3: การสำรวจก่อนที่จะ commit

**เมื่อใดที่ควรใช้:** คุณมีปัญหาแต่ยังไม่มีแผน ยังไม่แน่ใจว่าจะสร้างอะไร หรือแนวทางไหนคือสิ่งที่ถูกต้อง

เริ่มต้นด้วย `/opsx:explore` มันคือคู่คิดในการคิดโดยไม่มีโครงสร้างและไม่มีการสร้างสิ่งประดิษฐ์ (artifacts) ใด ๆ มันจะอ่านโค้ดเบสของคุณและช่วยคุณตัดสินใจ

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

การสำรวจจะทำให้ความคิดของคุณชัดเจนขึ้น *ก่อน* ที่คุณจะใช้การเปลี่ยนแปลงใด ๆ เมื่อข้อมูลเชิงลึกนั้นตกผลึก ให้ทำการเสนอ (propose) และให้ AI นำบริบทไปข้างหน้า

## Recipe 4: การจัดการสองการเปลี่ยนแปลงพร้อมกัน

**เมื่อใดที่ควรใช้:** คุณกำลังอยู่ระหว่างฟีเจอร์และมีการแก้ไขเร่งด่วนเข้ามาขัดจังหวะคิว

การเปลี่ยนแปลงคือโฟลเดอร์ที่เป็นอิสระ ดังนั้นงานแบบคู่ขนานจึงไม่เกิดความขัดแย้ง เริ่มต้นการแก้ไข ส่งมอบ จากนั้นกลับไปที่ฟีเจอร์ตรงจุดที่คุณหยุดไว้

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

การตั้งชื่อการเปลี่ยนแปลงใน `/opsx:apply add-dark-mode` คือวิธีที่คุณชี้ให้ AI ทราบถึงการเปลี่ยนแปลงที่เฉพาะเจาะจงเมื่อมีมากกว่าหนึ่งรายการทำงานอยู่ เนื่องจากงาน (tasks) ติดตามความสมบูรณ์ใน `tasks.md` AI จึงรู้ว่าคุณหยุดอยู่ที่จุดใด

เมื่อมีการเปลี่ยนแปลงหลายอย่างเสร็จสิ้นพร้อมกัน `/opsx:bulk-archive` ที่ขยายแล้วจะรวบรวมพวกมันเข้าด้วยกันและแก้ไขข้อขัดแย้งของสเปคโดยการตรวจสอบสิ่งที่ถูกนำไปใช้จริง ดู [Workflows](workflows.md#parallel-changes)

## Recipe 5: การรีแฟคเตอร์ (Refactor) โดยไม่มีการเปลี่ยนแปลงพฤติกรรม

**เมื่อใดที่ควรใช้:** คุณกำลังปรับโครงสร้างโค้ด และพฤติกรรมที่มองเห็นได้จากภายนอกควรยังคงเหมือนเดิม

นี่คือกรณีที่น่าสนใจ เพราะการรีแฟคเตอร์โดยสมบูรณ์นั้น *ไม่มีอะไรจะเพิ่มให้กับสเปคของคุณ* สัญญาของพฤติกรรมไม่เปลี่ยนแปลง มีเพียงแค่การดำเนินการเท่านั้น ดังนั้นงานจึงอยู่ในส่วนของการออกแบบและงาน (tasks) และ delta spec จึงว่างเปล่าหรือไม่มีอยู่

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

เมื่อคุณจัดเก็บการเปลี่ยนแปลงที่ไม่เกี่ยวข้องกับสเปค คุณสามารถบอกคำสั่งเทอร์มินัลให้ข้ามขั้นตอนของสเปคได้:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

แฟล็กเดียวกันนี้มีประโยชน์สำหรับเครื่องมือ CI และการเปลี่ยนแปลงที่เกี่ยวกับเอกสารเท่านั้น หลักการคือ: สเปคอธิบายพฤติกรรม ดังนั้นถ้าพฤติกรรมไม่เปลี่ยนแปลง สเปคก็ไม่ควรเปลี่ยน ดู [Concepts](concepts.md#what-a-spec-is-and-is-not)

## Recipe 6: การควบคุมทีละขั้นตอน (Expanded Commands)

**เมื่อใดที่ควรใช้:** การเปลี่ยนแปลงที่ซับซ้อนหรือมีความเสี่ยงสูง ซึ่งคุณต้องการตรวจสอบสิ่งประดิษฐ์แต่ละรายการก่อนที่จะดำเนินการต่อ

`/opsx:propose` หลักจะร่างทุกอย่างพร้อมกัน เมื่อคุณต้องการทำทีละขั้นตอน ให้เปิดใช้งานคำสั่งที่ขยายแล้ว:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

ตอนนี้คุณสามารถสร้างและดำเนินการแบบค่อยเป็นขั้น ๆ ได้:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

ตรวจสอบสิ่งประดิษฐ์แต่ละรายการเมื่อมันปรากฏขึ้น แก้ไขได้อย่างอิสระ และดำเนินการต่อเมื่อคุณพอใจ เมื่อคุณต้องการให้ส่วนที่เหลือถูกร่างพร้อมกัน `/opsx:ff` จะเร่งไปข้างหน้าผ่านสิ่งประดิษฐ์การวางแผนที่เหลือ ก่อนจัดเก็บ `/opsx:verify` จะตรวจสอบว่าการดำเนินการนั้นตรงกับสเปคจริง ดู [Workflows](workflows.md#opsxff-vs-opsxcontinue)

## Recipe 7: การเรียนรู้วงจรทั้งหมดด้วยตนเอง

**เมื่อใดที่ควรใช้:** คุณได้ติดตั้ง OpenSpec และต้องการ *รู้สึก* ถึงขั้นตอนการทำงานบนโค้ดของคุณเอง ไม่ใช่ตัวอย่างของเล่น

เปิดใช้งานคำสั่งที่ขยายแล้ว (ดู Recipe 6) จากนั้น:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` จะค้นหาการปรับปรุงจริง (ขนาดเล็ก) สร้างการเปลี่ยนแปลงสำหรับมัน ดำเนินการ และจัดเก็บ โดยบรรยายทุกขั้นตอน มันใช้เวลา 15 ถึง 30 นาที และทิ้งการเปลี่ยนแปลงที่แท้จริงที่คุณสามารถเก็บไว้หรือทิ้งไป นี่คือวิธีที่อ่อนโยนที่สุดในการเรียนรู้ ดู [Commands](commands.md#opsxonboard)

## การตรวจสอบงานของคุณจากเทอร์มินัล

เมื่อใดก็ได้ จากเทอร์มินัล คุณสามารถตรวจสอบสถานะของสิ่งต่าง ๆ ได้:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

เครื่องมือเหล่านี้ใช้สำหรับอ่านและตรวจสอบเท่านั้น การเสนอและการสร้างยังคงเกิดขึ้นผ่านคำสั่งแบบสแลชในแชท รายละเอียดทั้งหมดอยู่ใน [CLI reference](cli.md)

## จะไปต่อที่ไหน

- [Explore First](explore.md): วิธีที่แนะนำในการเริ่มต้นเมื่อคุณไม่แน่ใจ
- [Workflows](workflows.md): รูปแบบต่าง ๆ ที่กล่าวมา พร้อมคำแนะนำการตัดสินใจว่าจะใช้อะไร
- [Commands](commands.md): คำสั่งแบบสแลชทั้งหมดโดยละเอียด
- [Getting Started](getting-started.md): คู่มือการเปลี่ยนแปลงแรกที่เป็นมาตรฐาน
- [Concepts](concepts.md): เหตุผลที่ส่วนต่าง ๆ เข้ากันได้เช่นนั้น