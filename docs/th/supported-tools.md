# เครื่องมือที่รองรับ

OpenSpec ทำงานร่วมกับ AI coding assistant หลายตัว เมื่อคุณรัน `openspec init` OpenSpec จะกำหนดค่าเครื่องมือที่เลือกโดยใช้โปรไฟล์/เวิร์กโฟลว์ที่คุณกำลังใช้งานและโหมดการส่งมอบของคุณ

## วิธีการทำงาน

สำหรับแต่ละเครื่องมือที่เลือก OpenSpec สามารถติดตั้ง:

1. **ทักษะ** (หากการส่งมอบรวมถึงทักษะ): `.../skills/openspec-*/SKILL.md`
2. **คำสั่ง** (หากการส่งมอบรวมถึงคำสั่ง): ไฟล์คำสั่ง `opsx-*` เฉพาะสำหรับเครื่องมือนั้น

โดยค่าเริ่มต้น OpenSpec จะใช้โปรไฟล์ `core` ซึ่งรวมถึง:
- `propose`
- `explore`
- `apply`
- `archive`

คุณสามารถเปิดใช้งานเวิร์กโฟลว์ที่ขยาย (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`) ได้ผ่าน `openspec config profile` จากนั้นรัน `openspec update`

## สารบัญอ้างอิงเครื่องมือ

| เครื่องมือ (ID) | รูปแบบเส้นทางทักษะ | รูปแบบเส้นทางคำสั่ง |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | ไม่ได้สร้าง (ไม่มีตัวปรับคำสั่ง; ใช้การเรียกใช้แบบอิงทักษะ `/openspec-*`) |
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
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | ไม่ได้สร้าง (ไม่มีตัวปรับคำสั่ง; ใช้การเรียกใช้แบบอิงทักษะ `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* คำสั่ง Codex จะถูกติดตั้งใน Codex home ระดับโลก (`$CODEX_HOME/prompts/` หากตั้งค่าไว้ ไม่เช่นนั้นจะเป็น `~/.codex/prompts/`) ไม่ใช่ไดเรกทอรีโปรเจกต์ของคุณ

\*\* ไฟล์ prompt ของ GitHub Copilot จะถูกจดจำเป็นคำสั่ง slash แบบกำหนดเองในส่วนขยาย IDE (VS Code, JetBrains, Visual Studio) Copilot CLI ไม่ได้ใช้ไฟล์ `.github/prompts/*.prompt.md` โดยตรงในปัจจุบัน

## การตั้งค่าแบบไม่โต้ตอบ

สำหรับ CI/CD หรือการตั้งค่าแบบสคริปต์ ให้ใช้ `--tools` (และเลือก `--profile`):

```bash
# กำหนดค่าเครื่องมือเฉพาะ
openspec init --tools claude,cursor

# กำหนดค่าเครื่องมือที่รองรับทั้งหมด
openspec init --tools all

# ข้ามการกำหนดค่าเครื่องมือ
openspec init --tools none

# กำหนดค่าโปรไฟล์ทับสำหรับการ init ครั้งนี้
openspec init --profile core
```

**ID เครื่องมือที่พร้อมใช้งาน (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `forgecode`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## การติดตั้งที่ขึ้นอยู่กับเวิร์กโฟลว์

OpenSpec จะติดตั้งสิ่งที่เกี่ยวข้องกับเวิร์กโฟลว์ตามเวิร์กโฟลว์ที่เลือก:

- **โปรไฟล์ Core (ค่าเริ่มต้น):** `propose`, `explore`, `apply`, `archive`
- **การเลือกกำหนดเอง:** ชุดย่อยใดก็ได้ของ ID เวิร์กโฟลว์ทั้งหมด:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

กล่าวอีกนัยหนึ่ง จำนวนทักษะ/คำสั่งจะขึ้นอยู่กับโปรไฟล์และการส่งมอบ ไม่ใช่ค่าคงที่

## ชื่อทักษะที่สร้างขึ้น

เมื่อเลือกโดยการกำหนดค่าโปรไฟล์/เวิร์กโฟลว์ OpenSpec จะสร้างทักษะเหล่านี้:

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

ดู [คำสั่ง](commands.md) สำหรับพฤติกรรมของคำสั่ง และ [CLI](cli.md) สำหรับตัวเลือก `init`/`update`

## เกี่ยวข้อง

- [อ้างอิง CLI](cli.md) — คำสั่งเทอร์มินัล
- [คำสั่ง](commands.md) — คำสั่ง slash และทักษะ
- [เริ่มต้นใช้งาน](getting-started.md) — การตั้งค่าครั้งแรก