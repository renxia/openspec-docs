# Tham chiếu CLI

CLI của OpenSpec (`openspec`) cung cấp các lệnh terminal để thiết lập dự án, kiểm tra trạng thái và quản lý. Các lệnh này bổ sung cho các lệnh slash AI (như `/opsx:propose`) được ghi lại trong [Lệnh](commands.md).

## Tổng quan

| Danh mục | Lệnh | Mục đích |
|----------|------|----------|
| **Thiết lập** | `init`, `update` | Khởi tạo và cập nhật OpenSpec trong dự án của bạn |
| **Không gian làm việc (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | Thiết lập các chế độ xem cục bộ trên các kho lưu trữ hoặc thư mục được liên kết |
| **Ngữ cảnh chia sẻ (beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | Quản lý đăng ký context-store cục bộ và ngữ cảnh sáng kiến bền vững |
| **Duyệt** | `list`, `view`, `show` | Khám phá các thay đổi và spec |
| **Xác thực** | `validate` | Kiểm tra vấn đề trong các thay đổi và spec |
| **Vòng đời** | `archive` | Hoàn thành các thay đổi đã hoàn tất |
| **Quy trình làm việc** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | Hỗ trợ quy trình làm việc dựa trên tài liệu |
| **Sơ đồ (Schema)** | `schema init`, `schema fork`, `schema validate`, `schema which` | Tạo và quản lý các quy trình làm việc tùy chỉnh |
| **Cấu hình** | `config` | Xem và chỉnh sửa cài đặt |
| **Tiện ích** | `feedback`, `completion` | Phản hồi và tích hợp shell |

---

## So sánh Lệnh Dành cho Con người và Đại lý (Agent)

Hầu hết các lệnh CLI được thiết kế để **con người sử dụng** trong terminal. Một số lệnh cũng hỗ trợ **sử dụng bởi đại lý/script** thông qua đầu ra JSON.

### Lệnh Chỉ dành cho Con người

Các lệnh này mang tính tương tác và được thiết kế để sử dụng trong terminal:

| Mục đích lệnh | Mô tả |
|---------------|---------|
| `openspec init` | Khởi tạo dự án (gợi ý tương tác) |
| `openspec view` | Bảng điều khiển tương tác |
| `openspec config edit` | Mở tệp cấu hình trong trình soạn thảo |
| `openspec feedback` | Gửi phản hồi qua GitHub |
| `openspec completion install` | Cài đặt bổ sung cho shell |

### Lệnh Tương thích với Đại lý (Agent)

Các lệnh này hỗ trợ đầu ra `--json` để sử dụng theo chương trình bởi các đại lý AI và script:

| Lệnh | Sử dụng bởi Con người | Sử dụng bởi Đại lý |
|-------|------------------------|---------------------|
| `openspec list` | Duyệt các thay đổi/specs | `--json` cho dữ liệu có cấu trúc |
| `openspec show <item>` | Đọc nội dung | `--json` để phân tích |
| `openspec validate` | Kiểm tra các vấn đề | `--all --json` để kiểm tra hàng loạt |
| `openspec status` | Xem tiến độ sản phẩm | `--json` cho trạng thái có cấu trúc |
| `openspec instructions` | Nhận các bước tiếp theo | `--json` cho hướng dẫn của đại lý |
| `openspec templates` | Tìm đường dẫn mẫu | `--json` để phân giải đường dẫn |
| `openspec schemas` | Liệt kê các lược đồ có sẵn | `--json` để khám phá lược đồ |
| `openspec workspace setup --no-interactive` | Tạo không gian làm việc với đầu vào rõ ràng | `--json` cho đầu ra thiết lập có cấu trúc |
| `openspec workspace list` | Duyệt các không gian làm việc đã biết | `--json` cho các đối tượng không gian làm việc có kiểu |
| `openspec workspace link` | Liên kết một kho hoặc thư mục | `--json` cho đầu ra liên kết có cấu trúc |
| `openspec workspace relink` | Sửa chữa một đường dẫn đã liên kết | `--json` cho đầu ra liên kết có cấu trúc |
| `openspec workspace doctor` | Kiểm tra một không gian làm việc | `--json` cho đầu ra trạng thái có cấu trúc |
| `openspec workspace update` | Làm mới hướng dẫn cục bộ của không gian làm việc và kỹ năng của đại lý | `--tools` chọn đại lý; profile chọn quy trình làm việc |
| `openspec context-store setup <id>` | Tạo một kho ngữ cảnh cục bộ | `--json` với đầu vào rõ ràng cho đầu ra thiết lập có cấu trúc |
| `openspec context-store register <path>` | Đăng ký một kho ngữ cảnh hiện có | `--json` cho đầu ra đăng ký có cấu trúc |
| `openspec context-store unregister <id>` | Quên một đăng ký kho ngữ cảnh cục bộ | `--json` cho đầu ra dọn dẹp có cấu trúc |
| `openspec context-store remove <id>` | Xóa một thư mục kho ngữ cảnh cục bộ đã đăng ký | `--yes --json` để xóa không tương tác |
| `openspec context-store list` | Duyệt các kho ngữ cảnh đã đăng ký | `--json` cho các đăng ký có cấu trúc |
| `openspec context-store doctor` | Kiểm tra thiết lập kho cục bộ | `--json` cho chẩn đoán có cấu trúc |
| `openspec initiative list` | Duyệt các sáng kiến chung | `--json` cho các bản ghi sáng kiến có cấu trúc |
| `openspec initiative show <id>` | Phân giải một sáng kiến | `--json` cho các đường dẫn chính tắc và siêu dữ liệu |
| `openspec new change <id>` | Tạo khung thay đổi cục bộ trong kho | `--json`, cộng thêm `--initiative` cho các liên kết điều phối chung |
| `openspec set change <id>` | Cập nhật siêu dữ liệu thay đổi đã lưu trữ | `--json`, cộng thêm `--initiative` cho các liên kết điều phối chung |

---

## Các Tùy chọn Toàn cục

Các tùy chọn này hoạt động với tất cả các lệnh:

| Tùy chọn | Mô tả |
|-----------|---------|
| `--version`, `-V` | Hiển thị số phiên bản |
| `--no-color` | Tắt đầu ra màu |
| `--help`, `-h` | Hiển thị trợ giúp cho lệnh |

---

## Các lệnh Thiết lập

### `openspec init`

Khởi tạo OpenSpec trong dự án của bạn. Tạo cấu trúc thư mục và cấu hình tích hợp công cụ AI.

Hành vi mặc định sử dụng các giá trị mặc định từ cấu hình toàn cục: profile `core`, delivery `both`, workflows `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|--------|-----------|---------|
| `path` | Không | Thư mục đích (mặc định: thư mục hiện tại) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|-----------|---------|
| `--tools <list>` | Cấu hình công cụ AI không tương tác. Sử dụng `all`, `none`, hoặc danh sách ngăn cách bằng dấu phẩy |
| `--force` | Tự động dọn dẹp các tệp cũ mà không cần hỏi |
| `--profile <profile>` | Ghi đè profile toàn cục cho lần chạy init này (`core` hoặc `custom`) |

`--profile custom` sử dụng bất kỳ quy trình làm việc nào hiện đang được chọn trong cấu hình toàn cục (`openspec config profile`).

**ID công cụ được hỗ trợ (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

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

# Bỏ qua các lời nhắc và tự động dọn dẹp các tệp cũ
openspec init --force
```

**Những gì nó tạo ra:**

```
openspec/
├── specs/              # Các đặc tả của bạn (nguồn sự thật)
├── changes/            # Các thay đổi được đề xuất
└── config.yaml         # Cấu hình dự án

.claude/skills/         # Kỹ năng Claude Code (nếu đã chọn claude)
.cursor/skills/         # Kỹ năng Cursor (nếu đã chọn cursor)
.cursor/commands/       # Lệnh OPSX của Cursor (nếu delivery bao gồm lệnh)
... (các cấu hình công cụ khác)
```

---

### `openspec update`

Cập nhật các tệp hướng dẫn của OpenSpec sau khi nâng cấp CLI. Tạo lại các tệp cấu hình công cụ AI sử dụng profile toàn cục hiện tại, các quy trình làm việc đã chọn và chế độ delivery.

```
openspec update [path] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|--------|-----------|---------|
| `path` | Không | Thư mục đích (mặc định: thư mục hiện tại) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|-----------|---------|
| `--force` | Buộc cập nhật ngay cả khi các tệp đã cập nhật |

**Ví dụ:**

```bash
# Cập nhật các tệp hướng dẫn sau khi nâng cấp npm
npm update @fission-ai/openspec
openspec update
```

---

## Các lệnh Không gian làm việc (Workspace)

Các lệnh Không gian làm việc đang trong giai đoạn beta. Mô hình cục bộ dưới đây là hướng đi hiện tại, nhưng các tự động hóa bên ngoài, tích hợp và quy trình làm việc lâu dài vẫn nên coi hành vi lệnh, tệp trạng thái và đầu ra JSON là đang phát triển.

Các không gian làm việc điều phối là các chế độ xem cục bộ trên máy tính so với các kho hoặc thư mục đã liên kết. Tính khả thi của không gian làm việc không phải là cam kết thay đổi: hãy liên kết các kho hoặc thư mục mà OpenSpec cần biết, sau đó tạo các thay đổi khi bạn sẵn sàng lên kế hoạch cho công việc cụ thể.

### `openspec workspace setup`

Tạo một không gian làm việc trong vị trí không gian làm việc OpenSpec tiêu chuẩn và liên kết ít nhất một kho hoặc thư mục hiện có.

```bash
openspec workspace setup [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|-----------|---------|
| `--name <name>` | Tên không gian làm việc. Tên phải ở dạng kebab-case |
| `--link <path>` | Liên kết một kho hoặc thư mục hiện có và suy ra tên liên kết từ tên thư mục |
| `--link <name>=<path>` | Liên kết một kho hoặc thư mục hiện có với tên liên kết rõ ràng |
| `--opener <id>` | Lưu một trình mở ưa thích trong quá trình thiết lập không tương tác: `codex-cli`, `claude`, `github-copilot`, hoặc `editor` |
| `--tools <tools>` | Cài đặt các kỹ năng OpenSpec cục bộ trong không gian làm việc cho các đại lý. Sử dụng `all`, `none`, hoặc danh sách ID công cụ ngăn cách bằng dấu phẩy |
| `--no-interactive` | Tắt các lời nhắc; yêu cầu `--name` và ít nhất một `--link` |
| `--json` | Xuất JSON; yêu cầu `--no-interactive` |

**Ví dụ:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

Thiết lập tương tác hỏi về trình mở ưa thích và có thể cài đặt các kỹ năng OpenSpec cục bộ trong không gian làm việc cho các đại lý đã chọn. Thiết lập không tương tác chỉ lưu trình mở ưa thích khi cung cấp `--opener`; nếu không, `workspace open` sẽ nhắc sau trong các terminal tương tác khi có trình mở được hỗ trợ, hoặc yêu cầu các script truyền `--agent <tool>` hoặc `--editor`.

Việc cài đặt kỹ năng không gian làm việc chỉ là kỹ năng trong lát cắt beta này: ngay cả khi delivery toàn cục là `commands` hoặc `both`, thiết lập không gian làm việc ghi các thư mục kỹ năng của đại lý vào gốc không gian làm việc và không tạo các tệp lệnh slash. Profile toàn cục hoạt động chọn kỹ năng quy trình làm việc nào được cài đặt; `--tools` chọn đại lý nào nhận chúng. Nếu `--tools` bị bỏ qua trong thiết lập không tương tác, không có kỹ năng nào được cài đặt và `workspace update --tools <ids>` có thể thêm chúng sau.

### `openspec workspace list`

Liệt kê các không gian làm việc OpenSpec đã biết từ sổ đăng ký cục bộ.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

Danh sách hiển thị vị trí và các kho hoặc thư mục đã liên kết của mỗi không gian làm việc. Các bản ghi sổ đăng ký cũ kỹ được báo cáo nhưng không thay đổi.

### `openspec workspace link`

Ghi lại một kho hoặc thư mục hiện có cho một không gian làm việc.

```bash
openspec workspace link [name] <path> [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|-----------|---------|
| `--workspace <name>` | Chọn một không gian làm việc đã biết từ sổ đăng ký cục bộ |
| `--json` | Xuất JSON |
| `--no-interactive` | Tắt các lời nhắc chọn không gian làm việc |

**Ví dụ:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

Đường dẫn phải đã tồn tại. Các đường dẫn tương đối được phân giải so với thư mục hiện tại của lệnh trước khi OpenSpec lưu đường dẫn tuyệt đối đã xác minh vào trạng thái không gian làm việc cục bộ trên máy. Các đường dẫn đã liên kết có thể là toàn bộ kho, gói, dịch vụ, ứng dụng hoặc thư mục không có trạng thái `openspec/` cục bộ trong kho.

### `openspec workspace relink`

Sửa chữa hoặc thay đổi đường dẫn cục bộ cho một liên kết hiện có.

```bash
openspec workspace relink <name> <path> [options]
```

Đường dẫn phải đã tồn tại. Relink chỉ cập nhật đường dẫn cục bộ trên máy cho tên liên kết ổn định.

### `openspec workspace doctor`

Kiểm tra xem một không gian làm việc có thể phân giải những gì trên máy hiện tại.

```bash
openspec workspace doctor [options]
```

Doctor hiển thị vị trí không gian làm việc, các kho hoặc thư mục đã liên kết, các đường dẫn bị thiếu, đường dẫn specs cục bộ trong kho khi có, và các đề xuất sửa chữa. Đầu ra JSON cũng bao gồm đường dẫn lập kế hoạch không gian làm việc để tương thích. Nó chỉ báo cáo vấn đề; nó không tự động sửa chữa chúng.

Các lệnh cần một không gian làm việc sử dụng không gian làm việc hiện tại khi chạy từ bên trong một thư mục hoặc thư mục con của không gian làm việc. Từ nơi khác, truyền `--workspace <name>`, chọn từ bộ chọn trong terminal tương tác, hoặc dựa vào không gian làm việc duy nhất đã biết khi chỉ có một. Trong chế độ `--json` hoặc `--no-interactive`, lựa chọn không rõ ràng sẽ thất bại với lỗi trạng thái có cấu trúc và đề xuất `--workspace <name>`.

Các phản hồi JSON sử dụng các đối tượng có kiểu cộng thêm mảng `status`. Dữ liệu chính nằm trong `workspace`, `workspaces` hoặc `link`; cảnh báo và lỗi nằm trong `status`.

### `openspec workspace update`

Làm mới hướng dẫn OpenSpec cục bộ trong không gian làm việc và kỹ năng của đại lý.

```bash
openspec workspace update [name] [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|-----------|---------|
| `--workspace <name>` | Chọn một không gian làm việc đã biết từ sổ đăng ký cục bộ |
| `--tools <tools>` | Chọn đại lý cho các kỹ năng không gian làm việc. Sử dụng `all`, `none`, hoặc danh sách ID công cụ ngăn cách bằng dấu phẩy |
| `--json` | Xuất JSON |
| `--no-interactive` | Tắt các lời nhắc chọn không gian làm việc |

**Ví dụ:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` làm mới khối hướng dẫn không gian làm việc được tạo và bề mặt mở cục bộ. Đối với kỹ năng của đại lý, nó tái sử dụng lựa chọn đại lý kỹ năng không gian làm việc đã lưu khi `--tools` bị bỏ qua. Truyền `--tools` sẽ thay thế lựa chọn đã lưu đó. Nó chỉ làm mới các thư mục kỹ năng quy trình làm việc do OpenSpec quản lý trong gốc không gian làm việc, xóa các kỹ năng quy trình làm việc đã bị hủy chọn và để nguyên các kho và thư mục đã liên kết.

Chạy `openspec update` từ bên trong một không gian làm việc sẽ chuyển hướng sang `openspec workspace update`; chạy `openspec update` bên trong các dự án cục bộ trong kho khi bạn muốn các tệp công cụ thuộc sở hữu của kho được cập nhật.

### `openspec workspace open`

Mở một tập hợp làm việc của không gian làm việc thông qua trình mở ưa thích đã lưu, ghi đè đại lý cho một phiên, hoặc chế độ trình soạn thảo VS Code.

```bash
openspec workspace open [name] [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|-----------|---------|
| `--workspace <name>` | Bí danh cho tên không gian làm việc vị trí |
| `--initiative <id>` | Mở một sáng kiến dưới dạng chế độ xem không gian làm việc cục bộ. Chấp nhận `<id>` hoặc `<store>/<id>` |
| `--store <id>` | ID kho ngữ cảnh đã đăng ký cho `--initiative` |
| `--store-path <path>` | Gốc kho ngữ cảnh cục bộ hiện có cho `--initiative` |
| `--agent <tool>` | Ghi đè đại lý cho một phiên: `codex-cli`, `claude`, hoặc `github-copilot` |
| `--editor` | Mở tệp không gian làm việc VS Code được duy trì dưới dạng không gian làm việc trình soạn thảo bình thường |
| `--no-interactive` | Tắt các lời nhắc chọn không gian làm việc và trình mở |

**Ví dụ:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` sử dụng không gian làm việc hiện tại khi chạy bên trong một cái, tự động chọn không gian làm việc duy nhất đã biết khi chạy từ nơi khác, và yêu cầu người dùng chọn khi có nhiều không gian làm việc đã biết. `--agent` và `--editor` không thay đổi trình mở ưa thích đã lưu. Truyền cả hai ghi đè trình mở là lỗi; chọn hoặc `--agent <tool>` hoặc `--editor`.

Khi sử dụng `--initiative`, OpenSpec chuẩn bị hoặc chọn một chế độ xem không gian làm việc cục bộ riêng tư cho sáng kiến đó. Các kho được chọn từ sổ đăng ký được lưu theo id; `--store-path` lưu một trình chọn đường dẫn cục bộ tại thời gian chạy vì các chế độ xem không gian làm việc là trạng thái cục bộ riêng tư.

OpenSpec duy trì `<workspace-name>.code-workspace` ở gốc không gian làm việc cho việc mở trình soạn thảo VS Code và GitHub Copilot-in-VS-Code. Tệp đó là trạng thái chế độ xem không gian làm việc cục bộ trên máy.

Không gian làm việc VS Code được duy trì liệt kê các kho hoặc thư mục đã liên kết hợp lệ trước, sau đó là ngữ cảnh sáng kiện khi được đính kèm, sau đó là các tệp không gian làm việc OpenSpec. VS Code hiển thị các mục đó dưới dạng không gian làm việc đa gốc.

Mở không gian làm việc gốc làm cho các kho hoặc thư mục đã liên kết hiển thị để khám phá và ngữ cảnh. Các chỉnh sửa triển khai chỉ nên bắt đầu sau yêu cầu rõ ràng của người dùng và quy trình làm việc triển khai OpenSpec bình thường.

## Lệnh Bối Cảnh Chia Sẻ

Các kho bối cảnh và sáng kiến là các bề mặt điều phối phiên bản beta. Kho bối cảnh là một đăng ký cục bộ cho bối cảnh chia sẻ bền vững, thường là một thư mục hoặc bản sao được hỗ trợ bởi Git. Sáng kiến là bối cảnh điều phối chia sẻ bên trong một kho bối cảnh; các thay đổi cục bộ của kho mã có thể liên kết đến nó mà không cần sao chép kế hoạch chia sẻ vào mọi kho mã.

### `openspec context-store setup`

Tạo và đăng ký một kho bối cảnh cục bộ. Khi chạy trong terminal mà không có đối số, OpenSpec sẽ hướng dẫn người dùng qua quá trình thiết lập. Các tác nhân và script nên truyền đầu vào rõ ràng và sử dụng `--json`.

```bash
openspec context-store setup [id] [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--path <path>` | Đường dẫn thư mục kho bối cảnh; mặc định là thư mục dữ liệu cục bộ được quản lý bởi OpenSpec |
| `--init-git` | Khởi tạo kho Git trong kho bối cảnh |
| `--no-init-git` | Không khởi tạo kho Git |
| `--json` | Xuất đầu ra dạng JSON |

Khi bỏ qua `--path`, lệnh setup sẽ tạo kho trong `getGlobalDataDir()/context-stores/<id>`: `$XDG_DATA_HOME/openspec/context-stores/<id>` khi `XDG_DATA_HOME` được đặt, hoặc `~/.local/share/openspec/context-stores/<id>` trên các hệ thống Unix dự phòng. Truyền `--path` khi bạn muốn kho nằm trong một bản sao hoặc thư mục dành riêng cho nhóm.

Ví dụ:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

Đăng ký một thư mục kho bối cảnh cục bộ hiện có.

```bash
openspec context-store register [path] [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--id <id>` | Mã định danh kho bối cảnh; mặc định lấy từ siêu dữ liệu của kho hoặc tên thư mục |
| `--json` | Xuất đầu ra dạng JSON |

### `openspec context-store unregister`

Xóa đăng ký kho bối cảnh cục bộ mà không xóa các tệp.

```bash
openspec context-store unregister <id> [--json]
```

Sử dụng lệnh này khi kho đã được di chuyển, sao chép sang nơi khác, hoặc không còn muốn hiển thị trong OpenSpec trên máy này.

### `openspec context-store remove`

Xóa đăng ký kho bối cảnh cục bộ và xóa thư mục cục bộ của nó.

```bash
openspec context-store remove <id> [--yes] [--json]
```

Lệnh `remove` hiển thị chính xác thư mục trước khi xóa trong terminal tương tác. Các tác nhân, script và trình gọi JSON phải truyền `--yes` để xác nhận xóa. OpenSpec từ chối xóa thư mục không chứa siêu dữ liệu kho bối cảnh phù hợp.

### `openspec context-store list`

Liệt kê các kho bối cảnh đã đăng ký cục bộ.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

Kiểm tra đăng ký, siêu dữ liệu và trạng thái Git của kho bối cảnh cục bộ.

```bash
openspec context-store doctor [id] [--json]
```

Doctor chỉ có chức năng chẩn đoán; nó báo cáo các thư mục gốc bị thiếu, siêu dữ liệu không khớp và trạng thái đăng ký cục bộ không hợp lệ mà không sửa đổi kho.

### `openspec initiative create`

Tạo một sáng kiến trong kho bối cảnh.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--store <id>` | Mã định danh kho bối cảnh từ sổ đăng ký cục bộ |
| `--store-path <path>` | Đường dẫn gốc kho bối cảnh cục bộ hiện có |
| `--title <title>` | Tiêu đề sáng kiến |
| `--summary <summary>` | Tóm tắt sáng kiến |
| `--json` | Xuất đầu ra dạng JSON |

### `openspec initiative list`

Liệt kê các sáng kiến. Khi không có bộ chọn, lệnh này tìm kiếm tất cả các kho bối cảnh đã đăng ký và báo cáo các cảnh báo đọc một phần trong `status`.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--store <id>` | Liệt kê một kho bối cảnh đã đăng ký |
| `--store-path <path>` | Liệt kê một thư mục gốc kho bối cảnh cục bộ hiện có |
| `--json` | Xuất đầu ra dạng JSON |

### `openspec initiative show`

Phân giải một sáng kiến và in ra vị trí chính thức của nó.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

Nếu không có `--store`, OpenSpec sẽ tìm kiếm trong các kho bối cảnh đã đăng ký. Nếu cùng một mã sáng kiến tồn tại trong nhiều kho, hãy truyền `--store <id>` hoặc sử dụng dạng `<store>/<id>`.

---

## Các lệnh duyệt

### `openspec list`

Liệt kê các thay đổi hoặc đặc tả trong dự án của bạn.

```
openspec list [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--specs` | Liệt kê các đặc tả thay vì thay đổi |
| `--changes` | Liệt kê các thay đổi (mặc định) |
| `--sort <thứ_tự>` | Sắp xếp theo `recent` (mặc định) hoặc `name` |
| `--json` | Xuất ra dưới dạng JSON |

**Ví dụ:**

```bash
# Liệt kê tất cả các thay đổi đang hoạt động
openspec list

# Liệt kê tất cả các đặc tả
openspec list --specs

# Xuất JSON cho script
openspec list --json
```

**Đầu ra (văn bản):**

```
Các thay đổi đang hoạt động:
  add-dark-mode     Hỗ trợ chuyển đổi giao diện người dùng
  fix-login-bug     Xử lý hết thời gian phiên làm việc
```

---

### `openspec view`

Hiển thị bảng điều khiển tương tác để khám phá các đặc tả và thay đổi.

```
openspec view
```

Mở giao diện dựa trên thiết bị đầu cuối để điều hướng qua các đặc tả và thay đổi trong dự án của bạn.

---

### `openspec show`

Hiển thị chi tiết của một thay đổi hoặc đặc tả.

```
openspec show [tên-mục] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-mục` | Không | Tên của thay đổi hoặc đặc tả (sẽ được nhắc nếu không chỉ định) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--type <loại>` | Chỉ định loại: `change` hoặc `spec` (tự động phát hiện nếu rõ ràng) |
| `--json` | Xuất ra dưới dạng JSON |
| `--no-interactive` | Tắt nhắc |

**Tùy chọn dành riêng cho thay đổi:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--deltas-only` | Chỉ hiển thị các đặc tả delta (chế độ JSON) |

**Tùy chọn dành riêng cho đặc tả:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--requirements` | Chỉ hiển thị các yêu cầu, loại trừ kịch bản (chế độ JSON) |
| `--no-scenarios` | Loại trừ nội dung kịch bản (chế độ JSON) |
| `-r, --requirement <id>` | Hiển thị yêu cầu cụ thể theo chỉ số bắt đầu từ 1 (chế độ JSON) |

**Ví dụ:**

```bash
# Chọn tương tác
openspec show

# Hiển thị một thay đổi cụ thể
openspec show add-dark-mode

# Hiển thị một đặc tả cụ thể
openspec show auth --type spec

# Xuất JSON để phân tích
openspec show add-dark-mode --json
```

---

## Các lệnh xác thực

### `openspec validate`

Xác thực các thay đổi và đặc tả để tìm các vấn đề về cấu trúc.

```
openspec validate [tên-mục] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-mục` | Không | Mục cụ thể cần xác thực (sẽ được nhắc nếu không chỉ định) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--all` | Xác thực tất cả các thay đổi và đặc tả |
| `--changes` | Xác thực tất cả các thay đổi |
| `--specs` | Xác thực tất cả các đặc tả |
| `--type <loại>` | Chỉ định loại khi tên không rõ ràng: `change` hoặc `spec` |
| `--strict` | Bật chế độ xác thực nghiêm ngặt |
| `--json` | Xuất ra dưới dạng JSON |
| `--concurrency <n>` | Số lượng xác thực song song tối đa (mặc định: 6, hoặc biến môi trường `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Tắt nhắc |

**Ví dụ:**

```bash
# Xác thực tương tác
openspec validate

# Xác thực một thay đổi cụ thể
openspec validate add-dark-mode

# Xác thực tất cả các thay đổi
openspec validate --changes

# Xác thực tất cả với đầu ra JSON (dành cho CI/script)
openspec validate --all --json

# Xác thực nghiêm ngặt với độ song song tăng cường
openspec validate --all --strict --concurrency 12
```

**Đầu ra (văn bản):**

```
Đang xác thực add-dark-mode...
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
        "warnings": ["design.md: thiếu phần 'Technical Approach'"]
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
openspec archive [tên-thay-đổi] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-thay-đổi` | Không | Thay đổi cần lưu trữ (sẽ được nhắc nếu không chỉ định) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `-y, --yes` | Bỏ qua lời nhắc xác nhận |
| `--skip-specs` | Bỏ qua cập nhật đặc tả (dành cho các thay đổi chỉ liên quan đến hạ tầng/công cụ/tài liệu) |
| `--no-validate` | Bỏ qua xác thực (yêu cầu xác nhận) |

**Ví dụ:**

```bash
# Lưu trữ tương tác
openspec archive

# Lưu trữ thay đổi cụ thể
openspec archive add-dark-mode

# Lưu trữ không cần nhắc (CI/script)
openspec archive add-dark-mode --yes

# Lưu trữ một thay đổi công cụ không ảnh hưởng đến đặc tả
openspec archive update-ci-config --skip-specs
```

**Cách thực hiện:**

1. Xác thực thay đổi (trừ khi có `--no-validate`)
2. Nhắc xác nhận (trừ khi có `--yes`)
3. Hợp nhất các đặc tả delta vào `openspec/specs/`
4. Di chuyển thư mục thay đổi đến `openspec/changes/archive/YYYY-MM-DD-<tên>/`

---

## Các lệnh quy trình làm việc

Những lệnh này hỗ trợ quy trình làm việc OPSX hướng theo tác phẩm. Chúng hữu ích cho cả người kiểm tra tiến độ và các tác tử xác định bước tiếp theo.

### `openspec new change`

Tạo một thư mục thay đổi cục bộ trong repo và metadata tùy chọn được cam kết.

```bash
openspec new change <tên> [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--description <văn_bản>` | Mô tả thêm vào `README.md` |
| `--goal <văn_bản>` | Mục tiêu sản phẩm của không gian làm việc để lưu trữ cùng thay đổi |
| `--areas <các_tên>` | Tên liên kết không gian làm việc bị ảnh hưởng, cách nhau bằng dấu phẩy |
| `--initiative <id>` | Liên kết thay đổi repo cục bộ với một sáng kiến |
| `--store <id>` | ID kho ngữ cảnh cho `--initiative` |
| `--store-path <đường_dẫn>` | Gốc kho ngữ cảnh cục bộ hiện có cho `--initiative` |
| `--schema <tên>` | Schema quy trình làm việc sử dụng |
| `--json` | Xuất JSON |

Ví dụ:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

Cập nhật metadata thay đổi repo cục bộ đã cam kết mà không cần tạo lại thay đổi.

```bash
openspec set change <tên> [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--initiative <id>` | Liên kết thay đổi repo cục bộ với một sáng kiến |
| `--store <id>` | ID kho ngữ cảnh cho `--initiative` |
| `--store-path <đường_dẫn>` | Gốc kho ngữ cảnh cục bộ hiện có cho `--initiative` |
| `--json` | Xuất JSON |

`set change --initiative` là idempotent khi liên kết yêu cầu đã tồn tại và từ chối thay thế một liên kết sáng kiến hiện có khác.

### `openspec status`

Hiển thị trạng thái hoàn thành tác phẩm cho một thay đổi.

```
openspec status [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--change <id>` | Tên thay đổi (sẽ được nhắc nếu không chỉ định) |
| `--schema <tên>` | Ghi đè schema (tự động phát hiện từ cấu hình của thay đổi) |
| `--json` | Xuất ra dưới dạng JSON |

**Ví dụ:**

```bash
# Kiểm tra trạng thái tương tác
openspec status

# Trạng thái cho thay đổi cụ thể
openspec status --change add-dark-mode

# JSON cho tác tử sử dụng
openspec status --change add-dark-mode --json
```

**Đầu ra (văn bản):**

```
Thay đổi: add-dark-mode
Schema: spec-driven
Tiến độ: 2/4 tác phẩm hoàn thành

[x] proposal
[ ] design
[x] specs
[-] tasks (bị chặn bởi: design)
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

Nhận hướng dẫn chi tiết để tạo một tác phẩm hoặc áp dụng các tác vụ. Được các tác tử AI sử dụng để hiểu cần tạo gì tiếp theo.

```
openspec instructions [tác-phẩm] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tác-phẩm` | Không | ID tác phẩm: `proposal`, `specs`, `design`, `tasks`, hoặc `apply` |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--change <id>` | Tên thay đổi (bắt buộc ở chế độ không tương tác) |
| `--schema <tên>` | Ghi đè schema |
| `--json` | Xuất ra dưới dạng JSON |

**Trường hợp đặc biệt:** Sử dụng `apply` làm tác phẩm để nhận hướng dẫn thực hiện tác vụ.

**Ví dụ:**

```bash
# Nhận hướng dẫn cho tác phẩm tiếp theo
openspec instructions --change add-dark-mode

# Nhận hướng dẫn cho tác phẩm cụ thể
openspec instructions design --change add-dark-mode

# Nhận hướng dẫn áp dụng/thực hiện
openspec instructions apply --change add-dark-mode

# JSON cho tác tử tiêu thụ
openspec instructions design --change add-dark-mode --json
```

**Đầu ra bao gồm:**

- Nội dung mẫu cho tác phẩm
- Ngữ cảnh dự án từ cấu hình
- Nội dung từ các tác phẩm phụ thuộc
- Các quy tắc riêng cho từng tác phẩm từ cấu hình

---

### `openspec templates`

Hiển thị đường dẫn mẫu đã giải quyết cho tất cả các tác phẩm trong một schema.

```
openspec templates [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--schema <tên>` | Schema cần kiểm tra (mặc định: `spec-driven`) |
| `--json` | Xuất ra dưới dạng JSON |

**Ví dụ:**

```bash
# Hiển thị đường dẫn mẫu cho schema mặc định
openspec templates

# Hiển thị mẫu cho schema tùy chỉnh
openspec templates --schema my-workflow

# JSON để sử dụng theo chương trình
openspec templates --json
```

**Đầu ra (văn bản):**

```
Schema: spec-driven

Mẫu:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Liệt kê các schema quy trình làm việc có sẵn cùng với mô tả và luồng tác phẩm của chúng.

```
openspec schemas [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--json` | Xuất ra dưới dạng JSON |

**Ví dụ:**

```bash
openspec schemas
```

**Đầu ra:**

```
Các schema có sẵn:

  spec-driven (gói)
    Quy trình làm việc phát triển hướng theo đặc tả mặc định
    Luồng: proposal → specs → design → tasks

  my-custom (dự án)
    Quy trình làm việc tùy chỉnh cho dự án này
    Luồng: research → proposal → tasks
```

## Các lệnh Schema

Các lệnh để tạo và quản lý schema workflow tùy chỉnh.

### `openspec schema init`

Tạo một schema mới cục bộ cho dự án.

```
openspec schema init <name> [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `name` | Có | Tên schema (viết thường, dùng gạch nối) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--description <text>` | Mô tả schema |
| `--artifacts <list>` | Danh sách ID artifact, cách nhau bằng dấu phẩy (mặc định: `proposal,specs,design,tasks`) |
| `--default` | Đặt làm schema mặc định của dự án |
| `--no-default` | Không nhắc đặt làm mặc định |
| `--force` | Ghi đè schema đã tồn tại |
| `--json` | Xuất ra dạng JSON |

**Ví dụ:**

```bash
# Tạo schema tương tác
openspec schema init research-first

# Tạo không tương tác với các artifact cụ thể
openspec schema init rapid \
  --description "Quy trình lặp lại nhanh" \
  --artifacts "proposal,tasks" \
  --default
```

**Những gì nó tạo ra:**

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
| `--force` | Ghi đè điểm đến đã tồn tại |
| `--json` | Xuất ra dạng JSON |

**Ví dụ:**

```bash
# Fork schema spec-driven có sẵn
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Xác thực cấu trúc và các template của một schema.

```
openspec schema validate [name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `name` | Không | Schema cần xác thực (xác thực tất cả nếu bỏ qua) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--verbose` | Hiển thị các bước xác thực chi tiết |
| `--json` | Xuất ra dạng JSON |

**Ví dụ:**

```bash
# Xác thực một schema cụ thể
openspec schema validate my-workflow

# Xác thực tất cả schema
openspec schema validate
```

---

### `openspec schema which`

Hiển thị nơi một schema được giải quyết từ đâu (hữu ích để gỡ lỗi độ ưu tiên).

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
| `--all` | Liệt kê tất cả schema cùng với nguồn của chúng |
| `--json` | Xuất ra dạng JSON |

**Ví dụ:**

```bash
# Kiểm tra schema đến từ đâu
openspec schema which spec-driven
```

**Đầu ra:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Độ ưu tiên của Schema:**

1. Dự án: `openspec/schemas/<name>/`
2. Người dùng: `~/.local/share/openspec/schemas/<name>/`
3. Gói: Các schema có sẵn

---

## Các lệnh Cấu hình

### `openspec config`

Xem và sửa đổi cấu hình toàn cục của OpenSpec.

```
openspec config <subcommand> [options]
```

**Lệnh con:**

| Lệnh con | Mô tả |
|------------|-------------|
| `path` | Hiển thị vị trí file cấu hình |
| `list` | Hiển thị tất cả cài đặt hiện tại |
| `get <key>` | Lấy một giá trị cụ thể |
| `set <key> <value>` | Đặt một giá trị |
| `unset <key>` | Xóa một khóa |
| `reset` | Đặt lại về mặc định |
| `edit` | Mở trong `$EDITOR` |
| `profile [preset]` | Cấu hình profile workflow một cách tương tác hoặc thông qua preset |

**Ví dụ:**

```bash
# Hiển thị đường dẫn file cấu hình
openspec config path

# Liệt kê tất cả cài đặt
openspec config list

# Lấy một giá trị cụ thể
openspec config get telemetry.enabled

# Đặt một giá trị
openspec config set telemetry.enabled false

# Đặt rõ ràng một giá trị chuỗi
openspec config set user.name "Tên Của Tôi" --string

# Xóa một cài đặt tùy chỉnh
openspec config unset user.name

# Đặt lại toàn bộ cấu hình
openspec config reset --all --yes

# Chỉnh sửa cấu hình trong trình soạn thảo của bạn
openspec config edit

# Cấu hình profile với trình hướng dẫn dựa trên hành động
openspec config profile

# Preset nhanh: chuyển workflow sang core (giữ nguyên chế độ giao hàng)
openspec config profile core
```

`openspec config profile` bắt đầu với tóm tắt trạng thái hiện tại, sau đó cho phép bạn chọn:
- Thay đổi giao hàng + workflow
- Chỉ thay đổi giao hàng
- Chỉ thay đổi workflow
- Giữ cài đặt hiện tại (thoát)

Nếu bạn giữ cài đặt hiện tại, không có thay đổi nào được ghi và không có lời nhắc cập nhật được hiển thị.
Nếu không có thay đổi cấu hình nhưng dự án hoặc workspace hiện tại không đồng bộ với profile/chế độ giao hàng toàn cục của bạn, OpenSpec sẽ hiển thị cảnh báo và đề xuất `openspec update` cho các dự án cục bộ hoặc `openspec workspace update` cho hướng dẫn và kỹ năng cục bộ của workspace.
Nhấn `Ctrl+C` cũng sẽ hủy luồng một cách sạch sẽ (không có stack trace) và thoát với mã `130`.
Trong danh sách kiểm tra workflow, `[x]` có nghĩa là workflow được chọn trong cấu hình toàn cục. Để áp dụng các lựa chọn đó vào file dự án, chạy `openspec update` (hoặc chọn `Áp dụng thay đổi vào dự án này ngay?` khi được nhắc bên trong một dự án). Từ bên trong một workspace, sử dụng `openspec workspace update` để làm mới hướng dẫn và kỹ năng cục bộ của workspace; điều này vẫn chỉ dành cho kỹ năng đối với các file workflow agent được tạo và không tạo các lệnh slash của workspace.

**Ví dụ tương tác:**

```bash
# Cập nhật chỉ chế độ giao hàng
openspec config profile
# chọn: Chỉ thay đổi giao hàng
# chọn giao hàng: Chỉ Kỹ năng

# Cập nhật chỉ workflow
openspec config profile
# chọn: Chỉ thay đổi workflow
# chuyển đổi workflow trong danh sách kiểm tra, sau đó xác nhận
```

---

## Các lệnh Tiện ích

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
openspec feedback "Thêm hỗ trợ cho các loại artifact tùy chỉnh" \
  --body "Tôi muốn tự định nghĩa các loại artifact của riêng mình ngoài những loại có sẵn."
```

---

### `openspec completion`

Quản lý hoàn thành tự động cho shell của CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Lệnh con:**

| Lệnh con | Mô tả |
|------------|-------------|
| `generate [shell]` | Xuất script hoàn thành ra stdout |
| `install [shell]` | Cài đặt hoàn thành cho shell của bạn |
| `uninstall [shell]` | Gỡ bỏ hoàn thành đã cài đặt |

**Các shell được hỗ trợ:** `bash`, `zsh`, `fish`, `powershell`

**Ví dụ:**

```bash
# Cài đặt hoàn thành (tự động nhận diện shell)
openspec completion install

# Cài đặt cho shell cụ thể
openspec completion install zsh

# Tạo script để cài đặt thủ công
openspec completion generate bash > ~/.bash_completion.d/openspec

# Gỡ bỏ
openspec completion uninstall
```

---

## Mã thoát

| Ý nghĩa |
|------|---------|
| `0` | Thành công |
| `1` | Lỗi (xác thực thất bại, file bị thiếu, v.v.) |

---

## Biến môi trường

| Mô tả |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Đặt thành `0` để tắt telemetry |
| `DO_NOT_TRACK` | Đặt thành `1` để tắt telemetry (tín hiệu DNT tiêu chuẩn) |
| `OPENSPEC_CONCURRENCY` | Số luồng mặc định cho xác thực hàng loạt (mặc định: 6) |
| `EDITOR` hoặc `VISUAL` | Trình soạn thảo cho `openspec config edit` |
| `NO_COLOR` | Tắt màu sắc khi được đặt |

---

## Tài liệu liên quan

- [Commands](commands.md) - Các lệnh slash của AI (`/opsx:propose`, `/opsx:apply`, v.v.)
- [Workflows](workflows.md) - Các mẫu phổ biến và khi nào nên sử dụng mỗi lệnh
- [Customization](customization.md) - Tạo schema và template tùy chỉnh
- [Getting Started](getting-started.md) - Hướng dẫn cài đặt lần đầu