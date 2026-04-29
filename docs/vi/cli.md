# Tham chiếu CLI

CLI OpenSpec (`openspec`) cung cấp các lệnh terminal để thiết lập dự án, kiểm tra, xem trạng thái và quản lý. Các lệnh này bổ sung cho các lệnh AI slash (như `/opsx:propose`) được tài liệu hóa trong [Lệnh](commands.md).

## Tổng quan

| Danh mục | Lệnh | Mục đích |
|----------|----------|---------|
| **Thiết lập** | `init`, `update` | Khởi tạo và cập nhật OpenSpec trong dự án của bạn |
| **Duyệt** | `list`, `view`, `show` | Khám phá các thay đổi và thông số kỹ thuật |
| **Kiểm tra** | `validate` | Kiểm tra các thay đổi và thông số kỹ thuật để tìm vấn đề |
| **Vòng đời** | `archive` | Hoàn tất các thay đổi đã hoàn thành |
| **Quy trình** | `status`, `instructions`, `templates`, `schemas` | Hỗ trợ quy trình dựa trên sản phẩm |
| **Schema** | `schema init`, `schema fork`, `schema validate`, `schema which` | Tạo và quản lý quy trình tùy chỉnh |
| **Cấu hình** | `config` | Xem và sửa đổi cài đặt |
| **Tiện ích** | `feedback`, `completion` | Phản hồi và tích hợp shell |

---

## Lệnh cho Người dùng và Agent

Hầu hết các lệnh CLI đều được thiết kế để **sử dụng bởi con người** trong terminal. Một số lệnh cũng hỗ trợ **sử dụng bởi agent/script** thông qua đầu ra JSON.

### Lệnh chỉ dành cho Người dùng

Các lệnh này mang tính tương tác và được thiết kế để sử dụng trên terminal:

| Lệnh | Mục đích |
|---------|---------|
| `openspec init` | Khởi tạo dự án (các nhắc nhở tương tác) |
| `openspec view` | Bảng điều khiển tương tác |
| `openspec config edit` | Mở file cấu hình trong trình soạn thảo |
| `openspec feedback` | Gửi phản hồi qua GitHub |
| `openspec completion install` | Cài đặt tính năng hoàn thành lệnh shell |

### Lệnh tương thích với Agent

Các lệnh này hỗ trợ đầu ra `--json` để sử dụng theo chương trình bởi các agent AI và script:

| Lệnh | Sử dụng bởi Người dùng | Sử dụng bởi Agent |
|---------|-----------|-----------|
| `openspec list` | Duyệt các thay đổi/specs | `--json` cho dữ liệu có cấu trúc |
| `openspec show <item>` | Đọc nội dung | `--json` để phân tích |
| `openspec validate` | Kiểm tra sự cố | `--all --json` để xác thực hàng loạt |
| `openspec status` | Xem tiến độ artifact | `--json` cho trạng thái có cấu trúc |
| `openspec instructions` | Lấy các bước tiếp theo | `--json` cho hướng dẫn agent |
| `openspec templates` | Tìm đường dẫn template | `--json` để giải quyết đường dẫn |
| `openspec schemas` | Liệt kê các schema có sẵn | `--json` để khám phá schema |

---

## Các tùy chọn Toàn cục

Các tùy chọn này hoạt động với tất cả các lệnh:

| Tùy chọn | Mô tả |
|--------|-------------|
| `--version`, `-V` | Hiển thị số phiên bản |
| `--no-color` | Vô hiệu hóa đầu ra màu sắc |
| `--help`, `-h` | Hiển thị trợ giúp cho lệnh |

---

## Lệnh Thiết lập

### `openspec init`

Khởi tạo OpenSpec trong dự án của bạn. Tạo cấu trúc thư mục và cấu hình tích hợp các công cụ AI.

Hành vi mặc định sử dụng các giá trị mặc định từ cấu hình toàn cục: profile `core`, delivery `both`, workflows `propose, explore, apply, archive`.

```
openspec init [path] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `path` | Không | Thư mục đích (mặc định: thư mục hiện tại) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--tools <list>` | Cấu hình các công cụ AI không tương tác. Sử dụng `all`, `none`, hoặc danh sách phân tách bằng dấu phẩy |
| `--force` | Tự động dọn dẹp các file cũ mà không cần nhắc |
| `--profile <profile>` | Ghi đè profile toàn cục cho lần chạy khởi tạo này (`core` hoặc `custom`) |

`--profile custom` sử dụng bất kỳ workflow nào hiện đang được chọn trong cấu hình toàn cục (`openspec config profile`).

**Các ID công cụ được hỗ trợ (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

**Ví dụ:**

```bash
# Khởi tạo tương tác
openspec init

# Khởi tạo trong một thư mục cụ thể
openspec init ./my-project

# Không tương tác: cấu hình cho Claude và Cursor
openspec init --tools claude,cursor

# Cấu hình cho tất cả các công cụ được hỗ trợ
openspec init --tools all

# Ghi đè profile cho lần chạy này
openspec init --profile core

# Bỏ qua nhắc nhở và tự động dọn dẹp các file cũ
openspec init --force
```

**Các thư mục được tạo:**

```
openspec/
├── specs/              # Các specification của bạn (nguồn sự thật)
├── changes/            # Các thay đổi được đề xuất
└── config.yaml         # Cấu hình dự án

.claude/skills/         # Các kỹ năng Claude Code (nếu chọn claude)
.cursor/skills/         # Các kỹ năng Cursor (nếu chọn cursor)
.cursor/commands/       # Các lệnh OPSX của Cursor (nếu delivery bao gồm commands)
... (các cấu hình công cụ khác)
```

---

### `openspec update`

Cập nhật các file hướng dẫn của OpenSpec sau khi nâng cấp CLI. Tạo lại các file cấu hình công cụ AI bằng cách sử dụng profile toàn cục hiện tại, các workflow đã chọn và chế độ delivery.

```
openspec update [path] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `path` | Không | Thư mục đích (mặc định: thư mục hiện tại) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--force` | Buộc cập nhật ngay cả khi các file đã là mới nhất |

**Ví dụ:**

```bash
# Cập nhật các file hướng dẫn sau khi nâng cấp npm
npm update @fission-ai/openspec
openspec update
```

---

## Lệnh Duyệt

### `openspec list`

Liệt kê các thay đổi hoặc specs trong dự án của bạn.

```
openspec list [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--specs` | Liệt kê specs thay vì các thay đổi |
| `--changes` | Liệt kê các thay đổi (mặc định) |
| `--sort <order>` | Sắp xếp theo `recent` (mặc định) hoặc `name` |
| `--json` | Đầu ra dưới dạng JSON |

**Ví dụ:**

```bash
# Liệt kê tất cả các thay đổi đang hoạt động
openspec list

# Liệt kê tất cả specs
openspec list --specs

# Đầu ra JSON cho script
openspec list --json
```

**Đầu ra (văn bản):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

Hiển thị một bảng điều khiển tương tác để khám phá specs và thay đổi.

```
openspec view
```

Mở một giao diện dựa trên terminal để điều hướng các specification và thay đổi trong dự án của bạn.

---

### `openspec show`

Hiển thị chi tiết của một thay đổi hoặc spec.

```
openspec show [item-name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `item-name` | Không | Tên của thay đổi hoặc spec (sẽ nhắc nếu bỏ trống) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--type <type>` | Chỉ định loại: `change` hoặc `spec` (tự động phát hiện nếu không rõ ràng) |
| `--json` | Đầu ra dưới dạng JSON |
| `--no-interactive` | Vô hiệu hóa nhắc nhở |

**Tùy chọn dành riêng cho Change:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--deltas-only` | Chỉ hiển thị các delta specs (chế độ JSON) |

**Tùy chọn dành riêng cho Spec:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--requirements` | Chỉ hiển thị các yêu cầu, loại trừ kịch bản (chế độ JSON) |
| `--no-scenarios` | Loại trừ nội dung kịch bản (chế độ JSON) |
| `-r, --requirement <id>` | Hiển thị một yêu cầu cụ thể theo chỉ mục bắt đầu từ 1 (chế độ JSON) |

**Ví dụ:**

```bash
# Lựa chọn tương tác
openspec show

# Hiển thị một thay đổi cụ thể
openspec show add-dark-mode

# Hiển thị một spec cụ thể
openspec show auth --type spec

# Đầu ra JSON để phân tích
openspec show add-dark-mode --json
```

---

## Lệnh Xác thực

### `openspec validate`

Xác thực các thay đổi và specs để tìm các vấn đề về cấu trúc.

```
openspec validate [item-name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `item-name` | Không | Mục cụ thể cần xác thực (sẽ nhắc nếu bỏ trống) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--all` | Xác thực tất cả các thay đổi và specs |
| `--changes` | Xác thực tất cả các thay đổi |
| `--specs` | Xác thực tất cả specs |
| `--type <type>` | Chỉ định loại khi tên không rõ ràng: `change` hoặc `spec` |
| `--strict` | Bật chế độ xác thực nghiêm ngặt |
| `--json` | Đầu ra dưới dạng JSON |
| `--concurrency <n>` | Số lượng xác thực song song tối đa (mặc định: 6, hoặc biến môi trường `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Vô hiệu hóa nhắc nhở |

**Ví dụ:**

```bash
# Xác thực tương tác
openspec validate

# Xác thực một thay đổi cụ thể
openspec validate add-dark-mode

# Xác thực tất cả các thay đổi
openspec validate --changes

# Xác thực tất cả với đầu ra JSON (cho CI/script)
openspec validate --all --json

# Xác thực nghiêm ngặt với khả năng song song tăng
openspec validate --all --strict --concurrency 12
```

**Đầu ra (văn bản):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**Đầu ra (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Lệnh Vòng đời

### `openspec archive`

Lưu trữ một thay đổi đã hoàn thành và hợp nhất các delta specs vào specs chính.

```
openspec archive [change-name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi cần lưu trữ (sẽ nhắc nếu bỏ trống) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `-y, --yes` | Bỏ qua các nhắc nhở xác nhận |
| `--skip-specs` | Bỏ qua việc cập nhật specs (dành cho các thay đổi chỉ liên quan đến cơ sở hạ tầng/công cụ/tài liệu) |
| `--no-validate` | Bỏ qua xác thực (yêu cầu xác nhận) |

**Ví dụ:**

```bash
# Lưu trữ tương tác
openspec archive

# Lưu trữ một thay đổi cụ thể
openspec archive add-dark-mode

# Lưu trữ không cần nhắc (CI/script)
openspec archive add-dark-mode --yes

# Lưu trữ một thay đổi về công cụ không ảnh hưởng đến specs
openspec archive update-ci-config --skip-specs
```

**Các bước thực hiện:**

1. Xác thực thay đổi (trừ khi `--no-validate`)
2. Nhắc xác nhận (trừ khi `--yes`)
3. Hợp nhất các delta specs vào `openspec/specs/`
4. Di chuyển thư mục thay đổi vào `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Lệnh Quy trình làm việc

Các lệnh này hỗ trợ quy trình OPSX dựa trên artifact. Chúng hữu ích cho cả con người kiểm tra tiến độ và agent xác định các bước tiếp theo.

### `openspec status`

Hiển thị trạng thái hoàn thành artifact của một thay đổi.

```
openspec status [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--change <id>` | Tên thay đổi (sẽ nhắc nếu bỏ trống) |
| `--schema <name>` | Ghi đè schema (tự động phát hiện từ cấu hình của thay đổi) |
| `--json` | Đầu ra dưới dạng JSON |

**Ví dụ:**

```bash
# Kiểm tra trạng thái tương tác
openspec status

# Trạng thái cho thay đổi cụ thể
openspec status --change add-dark-mode

# JSON cho agent sử dụng
openspec status --change add-dark-mode --json
```

**Đầu ra (văn bản):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**Đầu ra (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Lấy các hướng dẫn được làm giàu để tạo artifact hoặc áp dụng các task. Được sử dụng bởi các agent AI để hiểu cần tạo gì tiếp theo.

```
openspec instructions [artifact] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `artifact` | Không | ID artifact: `proposal`, `specs`, `design`, `tasks`, hoặc `apply` |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--change <id>` | Tên thay đổi (bắt buộc trong chế độ không tương tác) |
| `--schema <name>` | Ghi đè schema |
| `--json` | Đầu ra dưới dạng JSON |

**Trường hợp đặc biệt:** Sử dụng `apply` làm artifact để lấy hướng dẫn triển khai task.

**Ví dụ:**

```bash
# Lấy hướng dẫn cho artifact tiếp theo
openspec instructions --change add-dark-mode

# Lấy hướng dẫn cho artifact cụ thể
openspec instructions design --change add-dark-mode

# Lấy hướng dẫn áp dụng/triển khai
openspec instructions apply --change add-dark-mode

# JSON cho agent sử dụng
openspec instructions design --change add-dark-mode --json
```

**Đầu ra bao gồm:**

- Nội dung template cho artifact
- Ngữ cảnh dự án từ cấu hình
- Nội dung từ các artifact phụ thuộc
- Các quy tắc cho từng artifact từ cấu hình

---

### `openspec templates`

Hiển thị các đường dẫn template đã giải quyết cho tất cả artifact trong một schema.

```
openspec templates [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--schema <name>` | Schema cần kiểm tra (mặc định: `spec-driven`) |
| `--json` | Đầu ra dưới dạng JSON |

**Ví dụ:**

```bash
# Hiển thị đường dẫn template cho schema mặc định
openspec templates

# Hiển thị template cho schema tùy chỉnh
openspec templates --schema my-workflow

# JSON để sử dụng theo chương trình
openspec templates --json
```

**Đầu ra (văn bản):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Liệt kê các schema quy trình làm việc có sẵn cùng với mô tả và luồng artifact của chúng.

```
openspec schemas [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--json` | Đầu ra dưới dạng JSON |

**Ví dụ:**

```bash
openspec schemas
```

**Đầu ra:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Lệnh Schema

Các lệnh để tạo và quản lý schema quy trình làm việc tùy chỉnh.

### `openspec schema init`

Tạo một schema cục bộ dự án mới.

```
openspec schema init <name> [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `name` | Có | Tên schema (dạng kebab-case) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--description <text>` | Mô tả schema |
| `--artifacts <list>` | Danh sách ID artifact phân tách bằng dấu phẩy (mặc định: `proposal,specs,design,tasks`) |
| `--default` | Đặt làm schema mặc định của dự án |
| `--no-default` | Không nhắc đặt làm mặc định |
| `--force` | Ghi đè schema hiện có |
| `--json` | Xuất ra định dạng JSON |

**Ví dụ:**

```bash
# Tạo schema tương tác
openspec schema init research-first

# Tạo không tương tác với các artifact cụ thể
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Cấu trúc được tạo:**

```
openspec/schemas/<name>/
├── schema.yaml           # Định nghĩa schema
└── templates/
    ├── proposal.md       # Mẫu cho mỗi artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Sao chép một schema hiện có vào dự án của bạn để tùy chỉnh.

```
openspec schema fork <source> [name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `source` | Có | Schema cần sao chép |
| `name` | Không | Tên schema mới (mặc định: `<source>-custom`) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--force` | Ghi đè đích hiện có |
| `--json` | Xuất ra định dạng JSON |

**Ví dụ:**

```bash
# Fork schema spec-driven tích hợp sẵn
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Xác thực cấu trúc và mẫu của một schema.

```
openspec schema validate [name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `name` | Không | Schema cần xác thực (xác thực tất cả nếu bỏ trống) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--verbose` | Hiển thị các bước xác thực chi tiết |
| `--json` | Xuất ra định dạng JSON |

**Ví dụ:**

```bash
# Xác thực một schema cụ thể
openspec schema validate my-workflow

# Xác thực tất cả các schema
openspec schema validate
```

---

### `openspec schema which`

Hiển thị nơi một schema được giải quyết từ (hữu ích cho việc gỡ lỗi ưu tiên).

```
openspec schema which [name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `name` | Không | Tên schema |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--all` | Liệt kê tất cả các schema cùng nguồn của chúng |
| `--json` | Xuất ra định dạng JSON |

**Ví dụ:**

```bash
# Kiểm tra nguồn gốc của một schema
openspec schema which spec-driven
```

**Kết quả:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Ưu tiên schema:**

1. Dự án: `openspec/schemas/<name>/`
2. Người dùng: `~/.local/share/openspec/schemas/<name>/`
3. Gói: Các schema tích hợp sẵn

---

## Lệnh Cấu hình

### `openspec config`

Xem và sửa đổi cấu hình OpenSpec toàn cục.

```
openspec config <subcommand> [options]
```

**Lệnh con:**

| Lệnh con | Mô tả |
|------------|-------------|
| `path` | Hiển thị vị trí tệp cấu hình |
| `list` | Hiển thị tất cả các thiết lập hiện tại |
| `get <key>` | Lấy một giá trị cụ thể |
| `set <key> <value>` | Đặt một giá trị |
| `unset <key>` | Xóa một khóa |
| `reset` | Đặt lại về mặc định |
| `edit` | Mở trong `$EDITOR` |
| `profile [preset]` | Cấu hình hồ sơ quy trình làm việc tương tác hoặc qua preset |

**Ví dụ:**

```bash
# Hiển thị đường dẫn tệp cấu hình
openspec config path

# Liệt kê tất cả các thiết lập
openspec config list

# Lấy một giá trị cụ thể
openspec config get telemetry.enabled

# Đặt một giá trị
openspec config set telemetry.enabled false

# Đặt rõ ràng một giá trị chuỗi
openspec config set user.name "My Name" --string

# Xóa một thiết lập tùy chỉnh
openspec config unset user.name

# Đặt lại tất cả cấu hình
openspec config reset --all --yes

# Chỉnh sửa cấu hình trong trình soạn thảo của bạn
openspec config edit

# Cấu hình hồ sơ với wizard dựa trên hành động
openspec config profile

# Preset nhanh: chuyển quy trình làm việc sang core (giữ chế độ giao hàng)
openspec config profile core
```

`openspec config profile` bắt đầu với tóm tắt trạng thái hiện tại, sau đó cho phép bạn chọn:
- Thay đổi giao hàng + quy trình làm việc
- Chỉ thay đổi giao hàng
- Chỉ thay đổi quy trình làm việc
- Giữ thiết lập hiện tại (thoát)

Nếu bạn giữ thiết lập hiện tại, không có thay đổi nào được ghi lại và không có lời nhắc cập nhật nào được hiển thị.
Nếu không có thay đổi cấu hình nào nhưng các tệp dự án hiện tại không đồng bộ với hồ sơ/giao hàng toàn cục của bạn, OpenSpec sẽ hiển thị cảnh báo và gợi ý chạy `openspec update`.
Nhấn `Ctrl+C` cũng hủy luồng một cách sạch sẽ (không có stack trace) và thoát với mã `130`.
Trong danh sách kiểm tra quy trình làm việc, `[x]` có nghĩa là quy trình làm việc được chọn trong cấu hình toàn cục. Để áp dụng các lựa chọn đó cho các tệp dự án, hãy chạy `openspec update` (hoặc chọn `Apply changes to this project now?` khi được nhắc trong dự án).

**Ví dụ tương tác:**

```bash
# Cập nhật chỉ giao hàng
openspec config profile
# chọn: Change delivery only
# chọn giao hàng: Skills only

# Cập nhật chỉ quy trình làm việc
openspec config profile
# chọn: Change workflows only
# bật/tắt quy trình làm việc trong danh sách kiểm tra, sau đó xác nhận
```

---

## Lệnh Tiện ích

### `openspec feedback`

Gửi phản hồi về OpenSpec. Tạo một issue trên GitHub.

```
openspec feedback <message> [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `message` | Có | Thông điệp phản hồi |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--body <text>` | Mô tả chi tiết |

**Yêu cầu:** GitHub CLI (`gh`) phải được cài đặt và xác thực.

**Ví dụ:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Quản lý shell completion cho OpenSpec CLI.

```
openspec completion <subcommand> [shell]
```

**Lệnh con:**

| Lệnh con | Mô tả |
|------------|-------------|
| `generate [shell]` | Xuất script completion ra stdout |
| `install [shell]` | Cài đặt completion cho shell của bạn |
| `uninstall [shell]` | Xóa các completion đã cài đặt |

**Shell được hỗ trợ:** `bash`, `zsh`, `fish`, `powershell`

**Ví dụ:**

```bash
# Cài đặt completion (tự động phát hiện shell)
openspec completion install

# Cài đặt cho shell cụ thể
openspec completion install zsh

# Tạo script để cài đặt thủ công
openspec completion generate bash > ~/.bash_completion.d/openspec

# Gỡ cài đặt
openspec completion uninstall
```

---

## Mã Thoát

| Mã | Ý nghĩa |
|------|---------|
| `0` | Thành công |
| `1` | Lỗi (xác thực thất bại, thiếu tệp, v.v.) |

---

## Biến Môi trường

| Biến | Mô tả |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Đặt thành `0` để tắt遥测 |
| `DO_NOT_TRACK` | Đặt thành `1` để tắt遥测 (tín hiệu DNT tiêu chuẩn) |
| `OPENSPEC_CONCURRENCY` | Số lượng chạy đồng thời mặc định cho xác thực hàng loạt (mặc định: 6) |
| `EDITOR` hoặc `VISUAL` | Trình soạn thảo cho `openspec config edit` |
| `NO_COLOR` | Tắt đầu ra màu khi được đặt |

---

## Tài liệu Liên quan

- [Lệnh](commands.md) - Lệnh slash AI (`/opsx:propose`, `/opsx:apply`, v.v.)
- [Quy trình làm việc](workflows.md) - Các mẫu phổ biến và khi nào sử dụng mỗi lệnh
- [Tùy chỉnh](customization.md) - Tạo schema và mẫu tùy chỉnh
- [Bắt đầu](getting-started.md) - Hướng dẫn thiết lập lần đầu