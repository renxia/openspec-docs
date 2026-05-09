# เครื่องมือที่รองรับ

OpenSpec ทำงานร่วมกับผู้ช่วยเขียนโค้ด AI หลายตัว เมื่อคุณรันคำสั่ง `openspec init` OpenSpec จะกำหนดค่าเครื่องมือที่เลือกโดยใช้โปรไฟล์/เวิร์กโฟลว์ที่ใช้งานอยู่และโหมดการจัดส่งของคุณ

## วิธีการทำงาน

สำหรับเครื่องมือที่เลือกแต่ละรายการ OpenSpec สามารถติดตั้ง:

1. **ทักษะ** (หากการจัดส่งรวมถึงทักษะ): `.../skills/openspec-*/SKILL.md`
2. **คำสั่ง** (หากการจัดส่งรวมถึงคำสั่ง): ไฟล์คำสั่ง `opsx-*` เฉพาะเครื่องมือ

โดยค่าเริ่มต้น OpenSpec ใช้โปรไฟล์ `core` ซึ่งรวมถึง:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

คุณสามารถเปิดใช้งานเวิร์กโฟลว์แบบขยาย (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) ผ่าน `openspec config profile` จากนั้นรัน `openspec update`

## อ้างอิงไดเรกทอรีเครื่องมือ

| เครื่องมือ (ID) | รูปแบบเส้นทางทักษะ | รูปแบบเส้นทางคำสั่ง |
|----------------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | ไม่สร้าง (ไม่มีตัวปรับคำสั่ง; ใช้การเรียกใช้ตามทักษะ `/openspec-*`) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | ไม่สร้าง (ไม่มีตัวปรับคำสั่ง; ใช้การเรียกใช้ตามทักษะ `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | ไม่สร้าง (ไม่มีตัวปรับคำสั่ง; ใช้การเรียกใช้ตามทักษะ `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* คำสั่ง Codex จะถูกติดตั้งในไดเรกทอรี Codex ทั่วไป (`$CODEX_HOME/prompts/` หากตั้งค่าไว้ มิฉะนั้น `~/.codex/prompts/`) ไม่ใช่ในไดเรกทอรีโปรเจกต์ของคุณ

\*\* ไฟล์พรอมต์ GitHub Copilot จะถูกรับรู้เป็นคำสั่งสแลชแบบกำหนดเองในส่วนขยาย IDE (VS Code, JetBrains, Visual Studio) Copilot CLI ปัจจุบันไม่รองรับ `.github/prompts/*.prompt.md` โดยตรง

## การตั้งค่าแบบไม่โต้ตอบ

สำหรับ CI/CD หรือการตั้งค่าแบบสคริปต์ ให้ใช้ `--tools` (และตัวเลือก `--profile`):

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

**ID เครื่องมือที่มี (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

## การติดตั้งตามเวิร์กโฟลว์

OpenSpec จะติดตั้งสิ่งประดิษฐ์ของเวิร์กโฟลว์ตามเวิร์กโฟลว์ที่เลือก:

- **โปรไฟล์ Core (ค่าเริ่มต้น):** `propose`, `explore`, `apply`, `sync`, `archive`
- **การเลือกแบบกำหนดเอง:** ชุดย่อยใดๆ ของ ID เวิร์กโฟลว์ทั้งหมด:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

กล่าวอีกนัยหนึ่ง จำนวนทักษะ/คำสั่งขึ้นอยู่กับโปรไฟล์และขึ้นอยู่กับการจัดส่ง ไม่ใช่ค่าคงที่

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

ดู [คำสั่ง](commands.md) สำหรับพฤติกรรมคำสั่งและ [CLI](cli.md) สำหรับตัวเลือก `init`/`update`

## เกี่ยวข้อง

- [อ้างอิง CLI](cli.md) — คำสั่งเทอร์มินัล
- [คำสั่ง](commands.md) — คำสั่งสแลชและทักษะ
- [เริ่มต้นใช้งาน](getting-started.md) — การตั้งค่าครั้งแรก