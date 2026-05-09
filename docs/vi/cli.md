# Tham Chiếu Dòng Lệnh

Dòng lệnh OpenSpec (`openspec`) cung cấp các lệnh terminal để thiết lập dự án, kiểm tra trạng thái, xác thực và quản lý. Các lệnh này bổ sung cho các lệnh slash AI (như `/opsx:propose`) được ghi trong [Lệnh](commands.md).

## Tóm Tắt

| Danh Mục | Lệnh | Mục Đích |
|----------|----------|---------|
| **Thiết Lập** | `init`, `update` | Khởi tạo và cập nhật OpenSpec trong dự án của bạn |
| **Không Gian Làm Việc (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | Thiết lập quy hoạch trên các kho lưu trữ hoặc thư mục được liên kết |
| **Duyệt** | `list`, `view`, `show` | Khám phá các thay đổi và đặc tả |
| **Xác Thực** | `validate` | Kiểm tra các thay đổi và đặc tả để tìm lỗi |
| **Vòng Đời** | `archive` | Hoàn tất các thay đổi đã hoàn thành |
| **Quy Trình** | `status`, `instructions`, `templates`, `schemas` | Hỗ trợ quy trình làm việc dựa trên hiện vật |
| **Lược Đồ** | `schema init`, `schema fork`, `schema validate`, `schema which` | Tạo và quản lý các quy trình làm việc tùy chỉnh |
| **Cấu Hình** | `config` | Xem và sửa đổi cài đặt |
| **Tiện Ích** | `feedback`, `completion` | Phản hồi và tích hợp shell |

---

## Lệnh của Con người so với Lệnh của Agent

Hầu hết các lệnh CLI được thiết kế cho **sử dụng của con người** trong terminal. Một số lệnh cũng hỗ trợ **sử dụng cho agent/script** thông qua đầu ra JSON.

### Các lệnh chỉ dành cho Con người

Các lệnh này mang tính tương tác và được thiết kế để sử dụng trong terminal:

| Mục đích | Lệnh |
|---------|---------|
| Khởi tạo dự án (các lời nhắc tương tác) | `openspec init` |
| Bảng điều khiển tương tác | `openspec view` |
| Mở cấu hình trong trình soạn thảo | `openspec config edit` |
| Gửi phản hồi qua GitHub | `openspec feedback` |
| Cài đặt phần hoàn thành cho shell | `openspec completion install` |

### Các lệnh Tương thích với Agent

Các lệnh này hỗ trợ đầu ra `--json` để sử dụng theo chương trình bởi các agent và script AI:

| Lệnh | Sử dụng của Con người | Sử dụng của Agent |
|---------|-----------|-----------|
| `openspec list` | Duyệt các thay đổi/spec | `--json` cho dữ liệu có cấu trúc |
| `openspec show <item>` | Đọc nội dung | `--json` để phân tích cú pháp |
| `openspec validate` | Kiểm tra sự cố | `--all --json` để xác thực hàng loạt |
| `openspec status` | Xem tiến độ tạo phẩm | `--json` cho trạng thái có cấu trúc |
| `openspec instructions` | Lấy các bước tiếp theo | `--json` cho hướng dẫn của agent |
| `openspec templates` | Tìm đường dẫn mẫu | `--json` để phân giải đường dẫn |
| `openspec schemas` | Liệt kê các lược đồ có sẵn | `--json` để khám phá lược đồ |
| `openspec workspace setup --no-interactive` | Tạo không gian làm việc với đầu vào rõ ràng | `--json` cho đầu ra thiết lập có cấu trúc |
| `openspec workspace list` | Duyệt các không gian làm việc đã biết | `--json` cho các đối tượng không gian làm việc có kiểu |
| `openspec workspace link` | Liên kết một repo hoặc thư mục | `--json` cho đầu ra liên kết có cấu trúc |
| `openspec workspace relink` | Sửa chữa một đường dẫn đã liên kết | `--json` cho đầu ra liên kết có cấu trúc |
| `openspec workspace doctor` | Kiểm tra một không gian làm việc | `--json` cho đầu ra trạng thái có cấu trúc |

---

## Các Tùy chọn Toàn cục

Các tùy chọn này hoạt động với tất cả các lệnh:

| Mô tả | Tùy chọn |
|--------|-------------|
| Hiển thị số phiên bản | `--version`, `-V` |
| Tắt đầu ra màu sắc | `--no-color` |
| Hiển thị trợ giúp cho lệnh | `--help`, `-h` |

---

## Các lệnh Thiết lập

### `openspec init`

Khởi tạo OpenSpec trong dự án của bạn. Tạo cấu trúc thư mục và định cấu hình tích hợp công cụ AI.

Hành vi mặc định sử dụng các giá trị mặc định của cấu hình toàn cục: hồ sơ `core`, chế độ giao `both`, các quy trình làm việc `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Đối số:**

| Mô tả | Bắt buộc | Đối số |
|----------|----------|-------------|
| Thư mục đích (mặc định: thư mục hiện tại) | Không | `path` |

**Tùy chọn:**

| Mô tả | Tùy chọn |
|--------|-------------|
| Định cấu hình các công cụ AI một cách không tương tác. Sử dụng `all`, `none`, hoặc danh sách phân tách bằng dấu phẩy | `--tools <list>` |
| Tự động dọn dẹp các tệp cũ mà không cần nhắc | `--force` |
| Ghi đè hồ sơ toàn cục cho lần chạy khởi tạo này (`core` hoặc `custom`) | `--profile <profile>` |

`--profile custom` sử dụng bất kỳ quy trình làm việc nào hiện đang được chọn trong cấu hình toàn cục (`openspec config profile`).

**Các ID công cụ được hỗ trợ (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Ví dụ:**

```bash
# Khởi tạo tương tác
openspec init

# Khởi tạo trong một thư mục cụ thể
openspec init ./my-project

# Không tương tác: định cấu hình cho Claude và Cursor
openspec init --tools claude,cursor

# Định cấu hình cho tất cả các công cụ được hỗ trợ
openspec init --tools all

# Ghi đè hồ sơ cho lần chạy này
openspec init --profile core

# Bỏ qua các lời nhắc và tự động dọn dẹp các tệp cũ
openspec init --force
```

**Những gì nó tạo ra:**

```
openspec/
├── specs/              # Các đặc tả của bạn (nguồn chân lý)
├── changes/            # Các thay đổi được đề xuất
└── config.yaml         # Cấu hình dự án

.claude/skills/         # Các kỹ năng Claude Code (nếu đã chọn claude)
.cursor/skills/         # Các kỹ năng Cursor (nếu đã chọn cursor)
.cursor/commands/       # Các lệnh OPSX của Cursor (nếu chế độ giao bao gồm lệnh)
... (các cấu hình công cụ khác)
```

---

### `openspec update`

Cập nhật các tệp hướng dẫn OpenSpec sau khi nâng cấp CLI. Tạo lại các tệp cấu hình công cụ AI sử dụng hồ sơ toàn cục hiện tại, các quy trình làm việc đã chọn và chế độ giao của bạn.

```
openspec update [path] [options]
```

**Đối số:**

| Mô tả | Bắt buộc | Đối số |
|----------|----------|-------------|
| Thư mục đích (mặc định: thư mục hiện tại) | Không | `path` |

**Tùy chọn:**

| Mô tả | Tùy chọn |
|--------|-------------|
| Buộc cập nhật ngay cả khi các tệp đã được cập nhật | `--force` |

**Ví dụ:**

```bash
# Cập nhật các tệp hướng dẫn sau khi nâng cấp npm
npm update @fission-ai/openspec
openspec update
```

---

## Các lệnh Không gian làm việc

Các lệnh không gian làm việc đang được phát triển tích cực và chưa sẵn sàng để sử dụng. Không xây dựng tự động hóa bên ngoài, tích hợp hoặc các quy trình làm việc lâu dài dựa trên bề mặt lệnh này; hành vi của lệnh, các tệp trạng thái và đầu ra JSON có thể thay đổi bất cứ lúc nào.

Các không gian làm việc điều phối là nơi lên kế hoạch cho công việc trải rộng trên nhiều repo hoặc thư mục. Khả năng hiển thị của không gian làm việc không phải là cam kết thay đổi: hãy liên kết các repo hoặc thư mục mà OpenSpec nên biết, sau đó tạo các thay đổi khi bạn sẵn sàng lên kế hoạch cho công việc cụ thể.

### `openspec workspace setup`

Tạo một không gian làm việc trong vị trí không gian làm việc OpenSpec tiêu chuẩn và liên kết ít nhất một repo hoặc thư mục hiện có.

```bash
openspec workspace setup [options]
```

**Tùy chọn:**

| Mô tả | Tùy chọn |
|--------|-------------|
| Tên không gian làm việc. Tên phải ở dạng kebab-case | `--name <name>` |
| Liên kết một repo hoặc thư mục hiện có và suy ra tên liên kết từ tên thư mục | `--link <path>` |
| Liên kết một repo hoặc thư mục hiện có với tên liên kết rõ ràng | `--link <name>=<path>` |
| Lưu trình mở ưa thích trong quá trình thiết lập không tương tác: `codex`, `claude`, `github-copilot`, hoặc `editor` | `--opener <id>` |
| Tắt lời nhắc; yêu cầu `--name` và ít nhất một `--link` | `--no-interactive` |
| Đầu ra JSON; yêu cầu `--no-interactive` | `--json` |

**Ví dụ:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Thiết lập tương tác yêu cầu một trình mở ưa thích và lưu nó vào trạng thái không gian làm việc cục bộ của máy. Thiết lập không tương tác chỉ lưu trình mở ưa thích khi `--opener` được cung cấp; nếu không, `workspace open` sẽ nhắc sau trong các terminal tương tác khi có trình mở được hỗ trợ, hoặc yêu cầu các script truyền `--agent <tool>` hoặc `--editor`.

### `openspec workspace list`

Liệt kê các không gian làm việc OpenSpec đã biết từ sổ đăng ký cục bộ.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

Danh sách hiển thị vị trí của mỗi không gian làm việc và các repo hoặc thư mục đã liên kết. Các bản ghi sổ đăng ký cũ được báo cáo nhưng không được thay đổi.

### `openspec workspace link`

Ghi lại một repo hoặc thư mục hiện có cho một không gian làm việc.

```bash
openspec workspace link [name] <path> [options]
```

**Tùy chọn:**

| Mô tả | Tùy chọn |
|--------|-------------|
| Chọn một không gian làm việc đã biết từ sổ đăng ký cục bộ | `--workspace <name>` |
| Đầu ra JSON | `--json` |
| Tắt lời nhắc chọn không gian làm việc | `--no-interactive` |

**Ví dụ:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Đường dẫn phải đã tồn tại. Các đường dẫn tương đối được phân giải so với thư mục hiện tại của lệnh trước khi OpenSpec lưu đường dẫn tuyệt đối đã được xác minh vào trạng thái không gian làm việc cục bộ của máy. Các đường dẫn đã liên kết có thể là toàn bộ repo, gói, dịch vụ, ứng dụng hoặc thư mục không có trạng thái `openspec/` cục bộ của repo.

### `openspec workspace relink`

Sửa chữa hoặc thay đổi đường dẫn cục bộ cho một liên kết hiện có.

```bash
openspec workspace relink <name> <path> [options]
```

Đường dẫn phải đã tồn tại. Relink chỉ cập nhật đường dẫn cục bộ của máy cho tên liên kết ổn định.

### `openspec workspace doctor`

Kiểm tra những gì một không gian làm việc có thể phân giải trên máy hiện tại.

```bash
openspec workspace doctor [options]
```

Doctor hiển thị vị trí không gian làm việc, đường dẫn lập kế hoạch, các repo hoặc thư mục đã liên kết, các đường dẫn bị thiếu, đường dẫn spec cục bộ của repo khi có, và các đề xuất sửa chữa. Nó chỉ báo cáo sự cố; nó không tự động sửa chữa chúng.

Các lệnh cần một không gian làm việc sử dụng không gian làm việc hiện tại khi chạy từ bên trong thư mục hoặc thư mục con của không gian làm việc. Từ nơi khác, truyền `--workspace <name>`, chọn từ trình chọn trong terminal tương tác, hoặc dựa vào không gian làm việc duy nhất đã biết khi chỉ có một tồn tại. Ở chế độ `--json` hoặc `--no-interactive`, lựa chọn không rõ ràng sẽ thất bại với lỗi trạng thái có cấu trúc và đề xuất `--workspace <name>`.

Các phản hồi JSON sử dụng các đối tượng có kiểu cộng với các mảng `status`. Dữ liệu chính nằm trong `workspace`, `workspaces`, hoặc `link`; các cảnh báo và lỗi nằm trong `status`.

### `openspec workspace open`

Mở một bộ làm việc của không gian làm việc thông qua trình mở ưa thích đã lưu, ghi đè agent cho một phiên, hoặc chế độ trình soạn thảo VS Code.

```bash
openspec workspace open [name] [options]
```

**Tùy chọn:**

| Mô tả | Tùy chọn |
|--------|-------------|
| Bí danh cho tên không gian làm việc vị trí | `--workspace <name>` |
| Ghi đè agent cho một phiên: `codex`, `claude`, hoặc `github-copilot` | `--agent <tool>` |
| Mở tệp không gian làm việc VS Code được duy trì như một không gian làm việc trình soạn thảo bình thường | `--editor` |
| Tắt lời nhắc chọn không gian làm việc và trình mở | `--no-interactive` |

**Ví dụ:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` sử dụng không gian làm việc hiện tại khi chạy bên trong một cái, tự động chọn không gian làm việc duy nhất đã biết khi chạy từ nơi khác, và yêu cầu người dùng chọn khi có nhiều không gian làm việc đã biết. `--agent` và `--editor` không thay đổi trình mở ưa thích đã lưu. Truyền cả hai ghi đè trình mở là một lỗi; chọn hoặc `--agent <tool>` hoặc `--editor`.

OpenSpec duy trì `<workspace-name>.code-workspace` tại gốc không gian làm việc cho các lần mở VS Code và GitHub Copilot-trong-VS-Code. Tệp đó là cục bộ của máy và bị bỏ qua theo mặc định với một mục `.gitignore` cụ thể `<workspace-name>.code-workspace`, vì vậy các tệp `*.code-workspace` do người dùng tạo vẫn đủ điều kiện để theo dõi.

Không gian làm việc VS Code được duy trì bao gồm gốc điều phối dưới dạng `.` cộng với các repo hoặc thư mục đã liên kết hợp lệ dưới dạng các gốc bổ sung. VS Code hiển thị các mục đó dưới dạng không gian làm việc đa gốc.

Mở không gian làm việc gốc hỗ trợ khám phá và lập kế hoạch trên các repo hoặc thư mục đã liên kết. Các chỉnh sửa triển khai chỉ nên bắt đầu sau khi có yêu cầu rõ ràng của người dùng và một quy trình làm việc triển khai OpenSpec bình thường.

## Các lệnh duyệt

### `openspec list`

Liệt kê các thay đổi hoặc đặc tả trong dự án của bạn.

```
openspec list [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|-----------|--------|
| `--specs` | Liệt kê các đặc tả thay vì thay đổi |
| `--changes` | Liệt kê các thay đổi (mặc định) |
| `--sort <order>` | Sắp xếp theo `recent` (mặc định) hoặc `name` |
| `--json` | Xuất ra dưới dạng JSON |

**Ví dụ:**

```bash
# Liệt kê tất cả các thay đổi đang hoạt động
openspec list

# Liệt kê tất cả các đặc tả
openspec list --specs

# Xuất JSON cho các script
openspec list --json
```

**Đầu ra (văn bản):**

```
Các thay đổi đang hoạt động:
  add-dark-mode     Hỗ trợ chuyển đổi giao diện người dùng
  fix-login-bug     Xử lý thời gian chờ phiên
```

---

### `openspec view`

Hiển thị bảng điều khiển tương tác để khám phá các đặc tả và thay đổi.

```
openspec view
```

Mở một giao diện dựa trên thiết bị đầu cuối để điều hướng qua các đặc tả và thay đổi trong dự án của bạn.

---

### `openspec show`

Hiển thị chi tiết của một thay đổi hoặc đặc tả.

```
openspec show [item-name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|--------|-----------|--------|
| `item-name` | Không | Tên của thay đổi hoặc đặc tả (sẽ nhắc nếu bỏ qua) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|-----------|--------|
| `--type <type>` | Chỉ định loại: `change` hoặc `spec` (tự động phát hiện nếu không mơ hồ) |
| `--json` | Xuất ra dưới dạng JSON |
| `--no-interactive` | Tắt các lời nhắc |

**Tùy chọn dành riêng cho thay đổi:**

| Tùy chọn | Mô tả |
|-----------|--------|
| `--deltas-only` | Chỉ hiển thị các đặc tả delta (chế độ JSON) |

**Tùy chọn dành riêng cho đặc tả:**

| Tùy chọn | Mô tả |
|-----------|--------|
| `--requirements` | Chỉ hiển thị các yêu cầu, loại trừ các kịch bản (chế độ JSON) |
| `--no-scenarios` | Loại trừ nội dung kịch bản (chế độ JSON) |
| `-r, --requirement <id>` | Hiển thị yêu cầu cụ thể theo chỉ mục bắt đầu từ 1 (chế độ JSON) |

**Ví dụ:**

```bash
# Lựa chọn tương tác
openspec show

# Hiển thị một thay đổi cụ thể
openspec show add-dark-mode

# Hiển thị một đặc tả cụ thể
openspec show auth --type spec

# Xuất JSON để phân tích
openspec show add-dark-mode --json
```

---

## Các lệnh kiểm tra

### `openspec validate`

Kiểm tra các thay đổi và đặc tả về các vấn đề cấu trúc.

```
openspec validate [item-name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|--------|-----------|--------|
| `item-name` | Không | Mục cụ thể cần kiểm tra (sẽ nhắc nếu bỏ qua) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|-----------|--------|
| `--all` | Kiểm tra tất cả các thay đổi và đặc tả |
| `--changes` | Kiểm tra tất cả các thay đổi |
| `--specs` | Kiểm tra tất cả các đặc tả |
| `--type <type>` | Chỉ định loại khi tên bị mơ hồ: `change` hoặc `spec` |
| `--strict` | Bật chế độ kiểm tra nghiêm ngặt |
| `--json` | Xuất ra dưới dạng JSON |
| `--concurrency <n>` | Số lượng kiểm tra song song tối đa (mặc định: 6, hoặc biến môi trường `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Tắt các lời nhắc |

**Ví dụ:**

```bash
# Kiểm tra tương tác
openspec validate

# Kiểm tra một thay đổi cụ thể
openspec validate add-dark-mode

# Kiểm tra tất cả các thay đổi
openspec validate --changes

# Kiểm tra tất cả với đầu ra JSON (cho CI/script)
openspec validate --all --json

# Kiểm tra nghiêm ngặt với độ song song tăng
openspec validate --all --strict --concurrency 12
```

**Đầu ra (văn bản):**

```
Đang kiểm tra add-dark-mode...
  ✓ proposal.md hợp lệ
  ✓ specs/ui/spec.md hợp lệ
  ⚠ design.md: thiếu phần "Technical Approach"

Tìm thấy 1 cảnh báo
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

## Các lệnh vòng đời

### `openspec archive`

Lưu trữ một thay đổi đã hoàn thành và hợp nhất các đặc tả delta vào các đặc tả chính.

```
openspec archive [change-name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi cần lưu trữ (sẽ được nhắc nếu bỏ qua) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `-y, --yes` | Bỏ qua các lời nhắc xác nhận |
| `--skip-specs` | Bỏ qua cập nhật đặc tả (dành cho các thay đổi chỉ liên quan đến hạ tầng/công cụ/tài liệu) |
| `--no-validate` | Bỏ qua xác thực (yêu cầu xác nhận) |

**Ví dụ:**

```bash
# Lưu trữ tương tác
openspec archive

# Lưu trữ một thay đổi cụ thể
openspec archive add-dark-mode

# Lưu trữ không có lời nhắc (CI/scripts)
openspec archive add-dark-mode --yes

# Lưu trữ một thay đổi công cụ không ảnh hưởng đến đặc tả
openspec archive update-ci-config --skip-specs
```

**Công việc thực hiện:**

1. Xác thực thay đổi (trừ khi dùng `--no-validate`)
2. Nhắc xác nhận (trừ khi dùng `--yes`)
3. Hợp nhất các đặc tả delta vào `openspec/specs/`
4. Di chuyển thư mục thay đổi đến `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Các lệnh quy trình làm việc

Các lệnh này hỗ trợ quy trình làm việc OPSX dựa trên tạo phẩm. Chúng hữu ích cho cả con người kiểm tra tiến độ và các tác nhân xác định các bước tiếp theo.

### `openspec status`

Hiển thị trạng thái hoàn thành tạo phẩm cho một thay đổi.

```
openspec status [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--change <id>` | Tên thay đổi (sẽ được nhắc nếu bỏ qua) |
| `--schema <name>` | Ghi đè lược đồ (tự động phát hiện từ cấu hình của thay đổi) |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Kiểm tra trạng thái tương tác
openspec status

# Trạng thái cho thay đổi cụ thể
openspec status --change add-dark-mode

# JSON cho tác nhân sử dụng
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

Nhận các hướng dẫn chi tiết để tạo một tạo phẩm hoặc áp dụng các tác vụ. Được các tác nhân AI sử dụng để hiểu cần tạo gì tiếp theo.

```
openspec instructions [artifact] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `artifact` | Không | ID tạo phẩm: `proposal`, `specs`, `design`, `tasks`, hoặc `apply` |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--change <id>` | Tên thay đổi (bắt buộc ở chế độ không tương tác) |
| `--schema <name>` | Ghi đè lược đồ |
| `--json` | Xuất dưới dạng JSON |

**Trường hợp đặc biệt:** Sử dụng `apply` làm tạo phẩm để nhận hướng dẫn thực thi tác vụ.

**Ví dụ:**

```bash
# Nhận hướng dẫn cho tạo phẩm tiếp theo
openspec instructions --change add-dark-mode

# Nhận hướng dẫn cho tạo phẩm cụ thể
openspec instructions design --change add-dark-mode

# Nhận hướng dẫn áp dụng/thực thi
openspec instructions apply --change add-dark-mode

# JSON cho tác nhân tiêu thụ
openspec instructions design --change add-dark-mode --json
```

**Đầu ra bao gồm:**

- Nội dung mẫu cho tạo phẩm
- Ngữ cảnh dự án từ cấu hình
- Nội dung từ các tạo phẩm phụ thuộc
- Các quy tắc riêng cho từng tạo phẩm từ cấu hình

---

### `openspec templates`

Hiển thị các đường dẫn mẫu đã giải quyết cho tất cả các tạo phẩm trong một lược đồ.

```
openspec templates [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--schema <name>` | Lược đồ cần kiểm tra (mặc định: `spec-driven`) |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Hiển thị đường dẫn mẫu cho lược đồ mặc định
openspec templates

# Hiển thị mẫu cho lược đồ tùy chỉnh
openspec templates --schema my-workflow

# JSON cho sử dụng lập trình
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

Liệt kê các lược đồ quy trình làm việc có sẵn cùng với mô tả và luồng tạo phẩm của chúng.

```
openspec schemas [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--json` | Xuất dưới dạng JSON |

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

## Các lệnh lược đồ

Các lệnh để tạo và quản lý các lược đồ quy trình làm việc tùy chỉnh.

### `openspec schema init`

Tạo một lược đồ cục bộ dự án mới.

```
openspec schema init <name> [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `name` | Có | Tên lược đồ (dạng kebab-case) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--description <text>` | Mô tả lược đồ |
| `--artifacts <list>` | Danh sách ID tạo phẩm, phân tách bằng dấu phẩy (mặc định: `proposal,specs,design,tasks`) |
| `--default` | Đặt làm lược đồ mặc định của dự án |
| `--no-default` | Không nhắc đặt làm mặc định |
| `--force` | Ghi đè lược đồ hiện có |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Tạo lược đồ tương tác
openspec schema init research-first

# Không tương tác với các tạo phẩm cụ thể
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**Những gì nó tạo ra:**

```
openspec/schemas/<name>/
├── schema.yaml           # Định nghĩa lược đồ
└── templates/
    ├── proposal.md       # Mẫu cho mỗi tạo phẩm
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Sao chép một lược đồ hiện có vào dự án của bạn để tùy chỉnh.

```
openspec schema fork <source> [name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `source` | Có | Lược đồ cần sao chép |
| `name` | Không | Tên lược đồ mới (mặc định: `<source>-custom`) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--force` | Ghi đè đích hiện có |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Fork lược đồ spec-driven tích hợp sẵn
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Xác thực cấu trúc và mẫu của một lược đồ.

```
openspec schema validate [name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `name` | Không | Lược đồ cần xác thực (xác thực tất cả nếu bỏ qua) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--verbose` | Hiển thị các bước xác thực chi tiết |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Xác thực một lược đồ cụ thể
openspec schema validate my-workflow

# Xác thực tất cả lược đồ
openspec schema validate
```

---

### `openspec schema which`

Hiển thị lược đồ được giải quyết từ đâu (hữu ích để gỡ lỗi độ ưu tiên).

```
openspec schema which [name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `name` | Không | Tên lược đồ |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--all` | Liệt kê tất cả lược đồ cùng với nguồn của chúng |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Kiểm tra lược đồ đến từ đâu
openspec schema which spec-driven
```

**Đầu ra:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Độ ưu tiên lược đồ:**

1. Dự án: `openspec/schemas/<name>/`
2. Người dùng: `~/.local/share/openspec/schemas/<name>/`
3. Gói: Các lược đồ tích hợp sẵn

---

## Các lệnh cấu hình

### `openspec config`

Xem và sửa đổi cấu hình toàn cục của OpenSpec.

```
openspec config <subcommand> [options]
```

**Các lệnh con:**

| Lệnh con | Mô tả |
|------------|-------------|
| `path` | Hiển thị vị trí tệp cấu hình |
| `list` | Hiển thị tất cả các cài đặt hiện tại |
| `get <key>` | Lấy một giá trị cụ thể |
| `set <key> <value>` | Đặt một giá trị |
| `unset <key>` | Xóa một khóa |
| `reset` | Đặt lại về mặc định |
| `edit` | Mở trong `$EDITOR` |
| `profile [preset]` | Cấu hình hồ sơ quy trình làm việc một cách tương tác hoặc qua preset |

**Ví dụ:**

```bash
# Hiển thị đường dẫn tệp cấu hình
openspec config path

# Liệt kê tất cả cài đặt
openspec config list

# Lấy một giá trị cụ thể
openspec config get telemetry.enabled

# Đặt một giá trị
openspec config set telemetry.enabled false

# Đặt một giá trị chuỗi một cách tường minh
openspec config set user.name "My Name" --string

# Xóa một cài đặt tùy chỉnh
openspec config unset user.name

# Đặt lại toàn bộ cấu hình
openspec config reset --all --yes

# Chỉnh sửa cấu hình trong trình soạn thảo của bạn
openspec config edit

# Cấu hình hồ sơ với trình hướng dẫn dựa trên hành động
openspec config profile

# Preset nhanh: chuyển quy trình làm việc sang core (giữ nguyên chế độ phân phối)
openspec config profile core
```

`openspec config profile` bắt đầu với một bản tóm tắt trạng thái hiện tại, sau đó cho phép bạn chọn:
- Thay đổi chế độ phân phối + quy trình làm việc
- Chỉ thay đổi chế độ phân phối
- Chỉ thay đổi quy trình làm việc
- Giữ nguyên cài đặt hiện tại (thoát)

Nếu bạn giữ nguyên cài đặt hiện tại, không có thay đổi nào được ghi và không có thông báo cập nhật nào được hiển thị.
Nếu không có thay đổi cấu hình nào nhưng các tệp dự án hiện tại không đồng bộ với hồ sơ/chế độ phân phối toàn cục của bạn, OpenSpec sẽ hiển thị cảnh báo và đề xuất chạy `openspec update`.
Nhấn `Ctrl+C` cũng sẽ hủy quy trình một cách sạch sẽ (không có ngăn xếp theo dõi) và thoát với mã `130`.
Trong danh sách kiểm tra quy trình làm việc, `[x]` có nghĩa là quy trình làm việc được chọn trong cấu hình toàn cục. Để áp dụng các lựa chọn đó vào tệp dự án, hãy chạy `openspec update` (hoặc chọn `Áp dụng thay đổi cho dự án này ngay bây giờ?` khi được nhắc bên trong một dự án).

**Ví dụ tương tác:**

```bash
# Cập nhật chỉ chế độ phân phối
openspec config profile
# chọn: Chỉ thay đổi chế độ phân phối
# chọn chế độ phân phối: Chỉ Skills

# Cập nhật chỉ quy trình làm việc
openspec config profile
# chọn: Chỉ thay đổi quy trình làm việc
# chuyển đổi các quy trình làm việc trong danh sách kiểm tra, sau đó xác nhận
```

---

## Các lệnh tiện ích

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

Quản lý phần bổ sung cho shell của CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Các lệnh con:**

| Lệnh con | Mô tả |
|------------|-------------|
| `generate [shell]` | Xuất script bổ sung ra stdout |
| `install [shell]` | Cài đặt phần bổ sung cho shell của bạn |
| `uninstall [shell]` | Xóa các phần bổ sung đã cài đặt |

**Các shell được hỗ trợ:** `bash`, `zsh`, `fish`, `powershell`

**Ví dụ:**

```bash
# Cài đặt phần bổ sung (tự động phát hiện shell)
openspec completion install

# Cài đặt cho shell cụ thể
openspec completion install zsh

# Tạo script để cài đặt thủ công
openspec completion generate bash > ~/.bash_completion.d/openspec

# Gỡ cài đặt
openspec completion uninstall
```

---

## Mã thoát

| Mã | Ý nghĩa |
|------|---------|
| `0` | Thành công |
| `1` | Lỗi (lỗi xác thực, thiếu tệp, v.v.) |

---

## Biến môi trường

| Biến | Mô tả |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Đặt thành `0` để tắt thu thập dữ liệu |
| `DO_NOT_TRACK` | Đặt thành `1` để tắt thu thập dữ liệu (tín hiệu DNT tiêu chuẩn) |
| `OPENSPEC_CONCURRENCY` | Số luồng mặc định cho xác thực hàng loạt (mặc định: 6) |
| `EDITOR` hoặc `VISUAL` | Trình soạn thảo cho `openspec config edit` |
| `NO_COLOR` | Tắt đầu ra màu khi được đặt |

---

## Tài liệu liên quan

- [Lệnh](commands.md) - Các lệnh slash của AI (`/opsx:propose`, `/opsx:apply`, v.v.)
- [Quy trình làm việc](workflows.md) - Các mẫu phổ biến và khi nào nên sử dụng từng lệnh
- [Tùy chỉnh](customization.md) - Tạo lược đồ và mẫu tùy chỉnh
- [Bắt đầu](getting-started.md) - Hướng dẫn thiết lập lần đầu