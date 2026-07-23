# Công cụ được hỗ trợ

OpenSpec hoạt động với nhiều trợ lý lập trình AI. Khi bạn chạy lệnh `openspec init`, OpenSpec sẽ cấu hình các công cụ được chọn dựa trên lựa chọn hồ sơ/quy trình làm việc đang sử dụng của bạn và chế độ phân phối.

## Cách hoạt động

Đối với mỗi công cụ được chọn, OpenSpec có thể cài đặt:

1. **Kỹ năng** (nếu chế độ phân phối bao gồm kỹ năng): `.../skills/openspec-*/SKILL.md`
2. **Lệnh** (nếu chế độ phân phối bao gồm lệnh): các tệp lệnh `opsx-*` dành riêng cho từng công cụ

Codex chỉ hỗ trợ kỹ năng: OpenSpec cài đặt `.codex/skills/openspec-*/SKILL.md` cho Codex ngay cả khi chế độ phân phối được đặt thành `commands`, và không tạo các tệp prompt tùy chỉnh cho Codex.

Theo mặc định, OpenSpec sử dụng hồ sơ `core`, bao gồm:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Bạn có thể kích hoạt các quy trình làm việc mở rộng (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) thông qua lệnh `openspec config profile`, sau đó chạy lệnh `openspec update`.

## Tham khảo thư mục công cụ

| Công cụ (ID) | Mẫu đường dẫn kỹ năng | Mẫu đường dẫn lệnh |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ chuyển đổi lệnh; sử dụng lệnh gọi dựa trên kỹ năng `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | Không được tạo (chỉ hỗ trợ kỹ năng; sử dụng `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ chuyển đổi lệnh; sử dụng lệnh gọi dựa trên kỹ năng `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Không được tạo (không có bộ chuyển đổi lệnh; sử dụng lệnh gọi dựa trên kỹ năng `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ chuyển đổi lệnh; sử dụng lệnh gọi dựa trên kỹ năng `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ chuyển đổi lệnh; sử dụng lệnh gọi dựa trên kỹ năng `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* Các tệp prompt của GitHub Copilot được nhận dạng là lệnh gạch chéo tùy chỉnh trong các tiện ích mở rộng IDE (VS Code, JetBrains, Visual Studio). Copilot CLI hiện không sử dụng trực tiếp các tệp `.github/prompts/*.prompt.md`.

\*\*\* Hermes mặc định tải các kỹ năng từ thư mục `~/.hermes/skills/`. Để sử dụng các kỹ năng OpenSpec cục bộ của dự án, hãy thêm thư mục `.hermes/skills/` của dự án vào `skills.external_dirs` trong tệp `~/.hermes/config.yaml`; sau đó Hermes sẽ cung cấp các kỹ năng với các lệnh gọi gạch chéo hướng đến người dùng như `/openspec-propose`.

## Thiết lập không tương tác

Đối với thiết lập CI/CD hoặc thiết lập bằng kịch bản, hãy sử dụng `--tools` (và tùy chọn `--profile`):

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

**Các ID công cụ khả dụng (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## Cài đặt phụ thuộc vào quy trình làm việc

OpenSpec cài đặt các thành phần của quy trình làm việc dựa trên các quy trình làm việc được chọn:

- **Hồ sơ cốt lõi (mặc định):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Lựa chọn tùy chỉnh:** bất kỳ tập con nào của tất cả các ID quy trình làm việc:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Nói cách khác, số lượng kỹ năng/lệnh phụ thuộc vào hồ sơ và chế độ phân phối, không cố định.

## Tên kỹ năng được tạo ra

Khi được chọn thông qua cấu hình hồ sơ/quy trình làm việc, OpenSpec sẽ tạo ra các kỹ năng sau:

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

Xem [Lệnh](commands.md) để biết hành vi của các lệnh và [CLI](cli.md) để biết các tùy chọn của `init`/`update`.

## Liên quan

- [Tài liệu tham khảo CLI](cli.md) — Lệnh terminal
- [Lệnh](commands.md) — Lệnh gạch chéo và kỹ năng
- [Bắt đầu](getting-started.md) — Thiết lập lần đầu