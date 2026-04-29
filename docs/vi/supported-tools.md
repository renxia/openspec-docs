# Các Công Cụ Hỗ Trợ

OpenSpec hoạt động với nhiều trợ lý lập trình AI. Khi bạn chạy `openspec init`, OpenSpec cấu hình các công cụ được chọn bằng cách sử dụng hồ sơ/quy trình làm việc đang hoạt động và chế độ giao hàng của bạn.

## Cách Thức Hoạt Động

Đối với mỗi công cụ được chọn, OpenSpec có thể cài đặt:

1. **Kỹ năng** (nếu giao hàng bao gồm kỹ năng): `.../skills/openspec-*/SKILL.md`
2. **Lệnh** (nếu giao hàng bao gồm lệnh): các tệp lệnh cụ thể cho từng công cụ `opsx-*`

Mặc định, OpenSpec sử dụng hồ sơ `core`, bao gồm:
- `propose`
- `explore`
- `apply`
- `archive`

Bạn có thể kích hoạt các quy trình làm việc mở rộng (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`) thông qua `openspec config profile`, sau đó chạy `openspec update`.

## Tham Chiếu Thư Mục Công Cụ

| Công Cụ (ID) | Mẫu đường dẫn kỹ năng | Mẫu đường dẫn lệnh |
|---------------|------------------------|---------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ điều hợp lệnh; sử dụng các lệnh gọi dựa trên kỹ năng `/openspec-*`) |
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
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ điều hợp lệnh; sử dụng các lệnh gọi dựa trên kỹ năng `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Các lệnh Codex được cài đặt trong thư mục Codex toàn cục (`$CODEX_HOME/prompts/` nếu đã đặt, nếu không thì `~/.codex/prompts/`), không phải trong thư mục dự án của bạn.

\*\* Các tệp prompt của GitHub Copilot được nhận dạng là lệnh gạch chéo tùy chỉnh trong các tiện ích mở rộng IDE (VS Code, JetBrains, Visual Studio). Copilot CLI hiện không trực tiếp sử dụng `.github/prompts/*.prompt.md`.

## Thiết Lập Không Tương Tác

Đối với CI/CD hoặc thiết lập theo kịch bản, sử dụng `--tools` (và tùy chọn `--profile`):

```bash
# Cấu hình các công cụ cụ thể
openspec init --tools claude,cursor

# Cấu hình tất cả các công cụ được hỗ trợ
openspec init --tools all

# Bỏ qua cấu hình công cụ
openspec init --tools none

# Ghi đè hồ sơ cho lần chạy init này
openspec init --profile core
```

**Các ID công cụ khả dụng (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `forgecode`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## Cài Đặt Phụ Thuộc Vào Quy Trình Làm Việc

OpenSpec cài đặt các thành phần quy trình làm việc dựa trên các quy trình làm việc được chọn:

- **Hồ sơ Core (mặc định):** `propose`, `explore`, `apply`, `archive`
- **Lựa chọn tùy chỉnh:** bất kỳ tập con nào của tất cả các ID quy trình làm việc:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Nói cách khác, số lượng kỹ năng/lệnh phụ thuộc vào hồ sơ và phương thức giao hàng, không phải là cố định.

## Tên Kỹ Năng Được Tạo

Khi được chọn bởi cấu hình hồ sơ/quy trình làm việc, OpenSpec tạo ra các kỹ năng này:

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

Xem [Lệnh](commands.md) để biết hành vi của lệnh và [CLI](cli.md) để biết các tùy chọn `init`/`update`.

## Liên Quan

- [Tham Chiếu CLI](cli.md) — Lệnh dòng lệnh
- [Lệnh](commands.md) — Lệnh gạch chéo và kỹ năng
- [Bắt Đầu](getting-started.md) — Thiết lập lần đầu