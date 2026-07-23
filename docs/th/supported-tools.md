# เครื่องมือที่รองรับ

OpenSpec ทำงานร่วมกับผู้ช่วยเขียนโค้ด AI ได้หลากหลาย เมื่อคุณรัน `openspec init` OpenSpec จะกำหนดค่าเครื่องมือที่เลือกโดยใช้โปรไฟล์/การเลือกเวิร์กโฟลว์ที่ใช้งานอยู่ และโหมดการส่งมอบของคุณ

## วิธีการทำงาน

สำหรับแต่ละเครื่องมือที่เลือก OpenSpec สามารถติดตั้ง:

1. **Skills** (หากการส่งมอบรวมถึง skills): `.../skills/openspec-*/SKILL.md`
2. **Commands** (หากการส่งมอบรวมถึง commands): ไฟล์คำสั่ง `opsx-*` เฉพาะเครื่องมือ

Codex รองรับเฉพาะ skills: OpenSpec จะติดตั้ง `.codex/skills/openspec-*/SKILL.md` สำหรับ Codex แม้ว่าการส่งมอบจะถูกตั้งค่าเป็น `commands` ก็ตาม และจะไม่สร้างไฟล์ prompt ที่กำหนดเองสำหรับ Codex

โดยค่าเริ่มต้น OpenSpec จะใช้โปรไฟล์ `core` ซึ่งประกอบด้วย:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

คุณสามารถเปิดใช้งานเวิร์กโฟลว์เพิ่มเติม (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) ผ่าน `openspec config profile` จากนั้นรัน `openspec update`

## เอกสารอ้างอิงไดเรกทอรีเครื่องมือ

| เครื่องมือ (ID) | รูปแบบเส้นทาง Skills | รูปแบบเส้นทาง Command |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | ไม่ถูกสร้าง (ไม่มีตัวปรับคำสั่ง; ใช้การเรียกแบบ skill `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | ไม่ถูกสร้าง (รองรับเฉพาะ skills; ใช้ `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | ไม่ถูกสร้าง (ไม่มีตัวปรับคำสั่ง; ใช้การเรียกแบบ skill `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx-<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | ไม่ถูกสร้าง (ไม่มีตัวปรับคำสั่ง; ใช้การเรียกแบบ skill `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | ไม่ถูกสร้าง (ไม่มีตัวปรับคำสั่ง; ใช้การเรียกแบบ skill `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | ไม่ถูกสร้าง (ไม่มีตัวปรับคำสั่ง; ใช้การเรียกแบบ skill `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx-<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* ไฟล์ prompt ของ GitHub Copilot จะถูกจดจำเป็นคำสั่ง slash ที่กำหนดเองในส่วนขยาย IDE (VS Code, JetBrains, Visual Studio) Copilot CLI ไม่ได้ใช้ `.github/prompts/*.prompt.md` โดยตรงในขณะนี้

\*\*\* Hermes โหลด skills จาก `~/.hermes/skills/` โดยค่าเริ่มต้น หากต้องการใช้ skills ของ OpenSpec ในโปรเจกต์ ให้เพิ่มไดเรกทอรี `.hermes/skills/` ของโปรเจกต์ลงใน `skills.external_dirs` ใน `~/.hermes/config.yaml`; Hermes จะแสดง skills ด้วยการเรียก slash ที่ผู้ใช้เห็น เช่น `/openspec-propose`

## การตั้งค่าแบบไม่โต้ตอบ

สำหรับ CI/CD หรือการตั้งค่าแบบสคริปต์ ให้ใช้ `--tools` (และ `--profile` เพิ่มเติมได้):

```bash
# กำหนดค่าเครื่องมือเฉพาะ
openspec init --tools claude,cursor

# กำหนดค่าเครื่องมือที่รองรับทั้งหมด
openspec init --tools all

# ข้ามการกำหนดค่าเครื่องมือ
openspec init --tools none

# แทนที่โปรไฟล์สำหรับการรัน init นี้
openspec init --profile core
```

**ID เครื่องมือที่มีอยู่ (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## การติดตั้งที่ขึ้นอยู่กับเวิร์กโฟลว์

OpenSpec จะติดตั้งสิ่งที่สร้างขึ้นจากเวิร์กโฟลว์ตามเวิร์กโฟลว์ที่เลือก:

- **โปรไฟล์หลัก (ค่าเริ่มต้น):** `propose`, `explore`, `apply`, `sync`, `archive`
- **การเลือกแบบกำหนดเอง:** ชุดย่อยใดๆ ของ ID เวิร์กโฟลว์ทั้งหมด:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

กล่าวอีกนัยหนึ่ง จำนวน skills/commands ขึ้นอยู่กับโปรไฟล์และการส่งมอบ ไม่ใช่ค่าคงที่

## ชื่อ Skills ที่สร้างขึ้น

เมื่อถูกเลือกโดยการกำหนดค่าโปรไฟล์/เวิร์กโฟลว์ OpenSpec จะสร้าง skills เหล่านี้:

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

ดู [Commands](commands.md) สำหรับพฤติกรรมของคำสั่ง และ [CLI](cli.md) สำหรับตัวเลือก `init`/`update`

## หัวข้อที่เกี่ยวข้อง

- [เอกสารอ้างอิง CLI](cli.md) — คำสั่งเทอร์มินัล
- [Commands](commands.md) — คำสั่ง slash และ skills
- [เริ่มต้นใช้งาน](getting-started.md) — การตั้งค่าครั้งแรก