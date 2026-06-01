# Các Công Cụ Được Hỗ Trợ

OpenSpec hoạt động với nhiều trợ lý lập trình AI. Khi bạn chạy `openspec init`, OpenSpec cấu hình các công cụ được chọn dựa trên lựa chọn profile/workflow đang hoạt động và chế độ phân phối của bạn.

## Cách Hoạt Động

Đối với mỗi công cụ được chọn, OpenSpec có thể cài đặt:

1. **Skills** (nếu phân phối bao gồm skills): `.../skills/openspec-*/SKILL.md`
2. **Commands** (nếu phân phối bao gồm commands): file lệnh `opsx-*` theo từng công cụ

Theo mặc định, OpenSpec sử dụng profile `core`, bao gồm:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Bạn có thể bật các workflow mở rộng (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) thông qua `openspec config profile`, sau đó chạy `openspec update`.

## Tài Liệu Tham Khảo Thư Mục Công Cụ

| Công cụ (ID) | Mẫu đường dẫn Skills | Mẫu đường dẫn Commands |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ chuyển đổi lệnh; sử dụng gọi `/openspec-*` dựa trên skill) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ chuyển đổi lệnh; sử dụng gọi `/skill:openspec-*` dựa trên skill) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ chuyển đổi lệnh; sử dụng gọi `/openspec-*` dựa trên skill) |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ chuyển đổi lệnh; sử dụng gọi `/openspec-*` dựa trên skill) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Lệnh Codex được cài đặt trong thư mục home toàn cục của Codex (`$CODEX_HOME/prompts/` nếu đã đặt, nếu không thì `~/.codex/prompts/`), không phải trong thư mục dự án của bạn.

\*\* File prompt của GitHub Copilot được nhận dạng là các lệnh slash tùy chỉnh trong tiện ích mở rộng IDE (VS Code, JetBrains, Visual Studio). Copilot CLI hiện tại không trực tiếp sử dụng `.github/prompts/*.prompt.md`.

## Thiết Lập Không Tương Tác

Đối với CI/CD hoặc thiết lập bằng script, hãy sử dụng `--tools` (và tùy chọn `--profile`):

```bash
# Cấu hình các công cụ cụ thể
openspec init --tools claude,cursor

# Cấu hình tất cả các công cụ được hỗ trợ
openspec init --tools all

# Bỏ qua cấu hình công cụ
openspec init --tools none

# Ghi đè profile cho lần chạy init này
openspec init --profile core
```

**Các ID công cụ khả dụng (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `vibe`, `windsurf`

## Cài Đặt Phụ Thuộc Workflow

OpenSpec cài đặt các artifact workflow dựa trên các workflow được chọn:

- **Profile core (mặc định):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Lựa chọn tùy chỉnh:** bất kỳ tập hợp con nào của tất cả các ID workflow:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Nói cách khác, số lượng skill/command phụ thuộc vào profile và phân phối, không cố định.

## Tên Skill Được Tạo

Khi được chọn bởi cấu hình profile/workflow, OpenSpec tạo ra các skill sau:

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

Xem [Commands](commands.md) để biết hành vi lệnh và [CLI](cli.md) để biết các tùy chọn `init`/`update`.

## Liên Quan

- [Tài Liệu Tham Khảo CLI](cli.md) — Các lệnh terminal
- [Commands](commands.md) — Các lệnh slash và skills
- [Bắt Đầu](getting-started.md) — Thiết lập lần đầu