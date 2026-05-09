# Các công cụ được hỗ trợ

OpenSpec hoạt động với nhiều trợ lý lập trình AI. Khi bạn chạy `openspec init`, OpenSpec sẽ cấu hình các công cụ được chọn dựa trên cấu hình/tác vụ đang hoạt động và chế độ giao hàng của bạn.

## Cách thức hoạt động

Đối với mỗi công cụ được chọn, OpenSpec có thể cài đặt:

1. **Kỹ năng** (nếu giao hàng bao gồm kỹ năng): `.../skills/openspec-*/SKILL.md`
2. **Lệnh** (nếu giao hàng bao gồm lệnh): các tệp lệnh `opsx-*` cụ thể cho từng công cụ

Theo mặc định, OpenSpec sử dụng cấu hình `core`, bao gồm:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Bạn có thể bật các tác vụ mở rộng (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) thông qua `openspec config profile`, sau đó chạy `openspec update`.

## Tham chiếu thư mục công cụ

| Công cụ (ID) | Mẫu đường dẫn kỹ năng | Mẫu đường dẫn lệnh |
|--------------|------------------------|---------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ điều hợp lệnh; sử dụng lệnh gọi dựa trên kỹ năng `/openspec-*`) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ điều hợp lệnh; sử dụng lệnh gọi dựa trên kỹ năng `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Không được tạo (không có bộ điều hợp lệnh; sử dụng lệnh gọi dựa trên kỹ năng `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Các lệnh Codex được cài đặt trong thư mục gốc Codex toàn cục (`$CODEX_HOME/prompts/` nếu được đặt, nếu không là `~/.codex/prompts/`), không phải thư mục dự án của bạn.

\*\* Các tệp prompt của GitHub Copilot được nhận dạng là các lệnh gạch chéo tùy chỉnh trong các phần mở rộng IDE (VS Code, JetBrains, Visual Studio). Copilot CLI hiện không trực tiếp sử dụng `.github/prompts/*.prompt.md`.

## Thiết lập không tương tác

Đối với thiết lập CI/CD hoặc thiết lập qua script, hãy sử dụng `--tools` (và tùy chọn `--profile`):

```bash
# Cấu hình các công cụ cụ thể
openspec init --tools claude,cursor

# Cấu hình tất cả các công cụ được hỗ trợ
openspec init --tools all

# Bỏ qua cấu hình công cụ
openspec init --tools none

# Ghi đè cấu hình cho lần chạy init này
openspec init --profile core
```

**Các ID công cụ có sẵn (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

## Cài đặt phụ thuộc vào tác vụ

OpenSpec cài đặt các thành phần tác vụ dựa trên các tác vụ được chọn:

- **Cấu hình core (mặc định):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Lựa chọn tùy chỉnh:** bất kỳ tập con nào của tất cả các ID tác vụ:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Nói cách khác, số lượng kỹ năng/lệnh phụ thuộc vào cấu hình và chế độ giao hàng, không phải cố định.

## Tên kỹ năng được tạo

Khi được chọn bởi cấu hình tác vụ/cấu hình, OpenSpec tạo ra các kỹ năng sau:

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

Xem [Lệnh](commands.md) để biết hành vi lệnh và [CLI](cli.md) để biết các tùy chọn `init`/`update`.

## Liên quan

- [Tham chiếu CLI](cli.md) — Các lệnh terminal
- [Lệnh](commands.md) — Các lệnh gạch chéo và kỹ năng
- [Bắt đầu](getting-started.md) — Thiết lập lần đầu