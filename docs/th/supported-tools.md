# เครื่องมือที่รองรับ

OpenSpec สามารถทำงานร่วมกับผู้ช่วยเขียนโค้ด AI ได้หลายตัว เมื่อคุณรัน `openspec init` OpenSpec จะตั้งค่าเครื่องมือที่เลือกโดยใช้โปรไฟล์/เวิร์กโฟลว์ที่ใช้งานอยู่และโหมดการส่งมอบของคุณ

## วิธีการทำงาน

สำหรับเครื่องมือที่เลือกแต่ละตัว OpenSpec สามารถติดตั้งได้:

1. **Skills** (หากการส่งมอบรวม skills): `.../skills/openspec-*/SKILL.md`
2. **Commands** (หากการส่งมอบรวม commands): ไฟล์คำสั่ง `opsx-<id>` เฉพาะสำหรับแต่ละเครื่องมือ

โดยค่าเริ่มต้น OpenSpec ใช้โปรไฟล์ `core` ซึ่งรวม:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

คุณสามารถเปิดใช้งานเวิร์กโฟลว์เพิ่มเติม (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) ผ่าน `openspec config profile` จากนั้นรัน `openspec update`

## เอกสารอ้างอิงไดเรกทอรีเครื่องมือ

| เครื่องมือ (ID) | รูปแบบเส้นทาง Skills | รูปแบบเส้นทาง Commands |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | ไม่ถูกสร้าง (ไม่มีตัวแปลงคำสั่ง; ใช้การเรียก `/openspec-*` แบบ skill) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | ไม่ถูกสร้าง (ไม่มีตัวแปลงคำสั่ง; ใช้การเรียก `/skill:openspec-*` แบบ skill) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | ไม่ถูกสร้าง (ไม่มีตัวแปลงคำสั่ง; ใช้การเรียก `/openspec-*` แบบ skill) |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | ไม่ถูกสร้าง (ไม่มีตัวแปลงคำสั่ง; ใช้การเรียก `/openspec-*` แบบ skill) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* คำสั่งของ Codex จะถูกติดตั้งในไดเรกทอรีหลักส่วนกลางของ Codex (`$CODEX_HOME/prompts/` หากตั้งค่าไว้ มิฉะนั้นจะเป็น `~/.codex/prompts/`) ไม่ใช่ไดเรกทอรีโปรเจกต์ของคุณ

\*\* ไฟล์ prompt ของ GitHub Copilot จะถูกรู้จักในฐานะคำสั่งแบบกำหนดเองในส่วนขยาย IDE (VS Code, JetBrains, Visual Studio) Copilot CLI ยังไม่รองรับการใช้งาน `.github/prompts/*.prompt.md` โดยตรงในปัจจุบัน

## การตั้งค่าแบบไม่โต้ตอบ

สำหรับการตั้งค่าผ่าน CI/CD หรือสคริปต์ ให้ใช้ `--tools` (และเลือกได้ `--profile`):

```bash
# ตั้งค่าเครื่องมือเฉพาะ
openspec init --tools claude,cursor

# ตั้งค่าเครื่องมือที่รองรับทั้งหมด
openspec init --tools all

# ข้ามการตั้งค่าเครื่องมือ
openspec init --tools none

# เขียนทับโปรไฟล์สำหรับการ init ครั้งนี้
openspec init --profile core
```

**ID ของเครื่องมือที่ใช้ได้ (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `vibe`, `windsurf`

## การติดตั้งที่ขึ้นอยู่กับเวิร์กโฟลว์

OpenSpec จะติดตั้งอาร์แทแฟกต์ของเวิร์กโฟลว์ตามเวิร์กโฟลว์ที่เลือก:

- **โปรไฟล์ core (ค่าเริ่มต้น):** `propose`, `explore`, `apply`, `sync`, `archive`
- **เลือกเอง:** ชุดย่อยใดๆ ของ ID เวิร์กโฟลว์ทั้งหมด:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

กล่าวอีกนัยหนึ่ง จำนวน skill/command จะขึ้นอยู่กับโปรไฟล์และการส่งมอบ ไม่ใช่จำนวนคงที่

## ชื่อ Skills ที่สร้างขึ้น

เมื่อถูกเลือกโดยการตั้งค่าโปรไฟล์/เวิร์กโฟลว์ OpenSpec จะสร้าง skills เหล่านี้:

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

ดู [Commands](commands.md) สำหรับพฤติกรรมของคำสั่ง และ [CLI](cli.md) สำหรับตัวเลือก `init`/`update`

## เนื้อหาที่เกี่ยวข้อง

- [เอกสารอ้างอิง CLI](cli.md) — คำสั่งเทอร์มินัล
- [Commands](commands.md) — คำสั่งแบบ Slash และ skills
- [เริ่มต้นใช้งาน](getting-started.md) — การตั้งค่าครั้งแรก