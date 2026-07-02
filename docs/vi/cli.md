# Tài liệu Tham khảo CLI

OpenSpec CLI (`openspec`) cung cấp các lệnh terminal để thiết lập dự án, xác thực, kiểm tra trạng thái và quản lý. Các lệnh này bổ sung cho các lệnh AI slash (như `/opsx:propose`) được tài liệu hóa trong [Commands](commands.md).

## Tóm tắt

| Category | Commands | Purpose |
|----------|----------|---------|
| **Thiết lập** | `init`, `update` | Khởi tạo và cập nhật OpenSpec trong dự án của bạn |
| **Kho lưu trữ (OpenSpec độc lập)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Quản lý các kho lưu trữ — các repo OpenSpec độc lập mà bạn đã đăng ký |
| **Sức khỏe** | `doctor` | Báo cáo tình trạng mối quan hệ cho gốc đã được giải quyết |
| **Ngữ cảnh làm việc** | `context` | Tập hợp bộ làm việc (gốc + các kho lưu trữ tham chiếu) |
| **Bộ làm việc cá nhân** | `workset create`, `workset list`, `workset open`, `workset remove` | Giữ và mở các chế độ xem cục bộ, cá nhân trong công cụ của bạn |
| **Duyệt** | `list`, `view`, `show` | Khám phá các thay đổi và thông số kỹ thuật |
| **Xác thực** | `validate` | Kiểm tra các thay đổi và thông số kỹ thuật xem có vấn đề gì không |
| **Vòng đời** | `archive` | Hoàn tất các thay đổi đã hoàn thành |
| **Quy trình làm việc** | `new change`, `status`, `instructions`, `templates`, `schemas` | Hỗ trợ quy trình làm việc dựa trên artifact |
| **Schema** | `schema init`, `schema fork`, `schema validate`, `schema which` | Tạo và quản lý các quy trình làm việc tùy chỉnh |
| **Cấu hình** | `config` | Xem và sửa đổi cài đặt |
| **Tiện ích** | `feedback`, `completion` | Phản hồi và tích hợp shell |

## Lệnh dành cho Người dùng và Tác nhân

Hầu hết các lệnh CLI được thiết kế để sử dụng bởi **người dùng** trên terminal. Một số lệnh cũng hỗ trợ **sử dụng bởi tác nhân/script** thông qua đầu ra JSON.

### Các Lệnh Chỉ Dành Cho Người Dùng

Các lệnh này mang tính tương tác và được thiết kế cho việc sử dụng trên terminal:

| Command | Mục đích |
|---------|---------|
| `openspec init` | Khởi tạo dự án (các lời nhắc tương tác) |
| `openspec view` | Bảng điều khiển tương tác |
| `openspec workset open <name>` | Mở một workset đã lưu (cửa sổ trình soạn thảo hoặc phiên tác nhân terminal) |
| `openspec config edit` | Mở cấu hình trong trình soạn thảo |
| `openspec feedback` | Gửi phản hồi qua GitHub |
| `openspec completion install` | Cài đặt các tính năng hoàn thành shell |

### Các Lệnh Tương Thích Với Tác Nhân

Các lệnh này hỗ trợ đầu ra `--json` để sử dụng theo chương trình bởi các tác nhân AI và script:

| Command | Sử dụng của Người dùng | Sử dụng của Tác nhân |
|---------|-----------|-----------|
| `openspec list` | Duyệt các thay đổi/spec | `--json` cho dữ liệu có cấu trúc |
| `openspec show <item>` | Đọc nội dung | `--json` để phân tích cú pháp |
| `openspec validate` | Kiểm tra sự cố | `--all --json` để xác thực hàng loạt |
| `openspec status` | Xem tiến trình artifact | `--json` cho trạng thái có cấu trúc |
| `openspec instructions` | Lấy các bước tiếp theo | `--json` cho hướng dẫn của tác nhân |
| `openspec templates` | Tìm đường dẫn template | `--json` để phân giải đường dẫn |
| `openspec schemas` | Liệt kê các schema khả dụng | `--json` để khám phá schema |
| `openspec store setup <id>` | Tạo và đăng ký một kho lưu trữ cục bộ | `--json` với các đầu vào tường minh cho đầu ra thiết lập có cấu trúc |
| `openspec store register <path>` | Đăng ký một kho lưu trữ hiện có | `--json` cho đầu ra đăng ký có cấu trúc |
| `openspec store unregister <id>` | Quên việc đăng ký một kho lưu trữ cục bộ | `--json` cho đầu ra dọn dẹp có cấu trúc |
| `openspec store remove <id>` | Xóa thư mục kho lưu trữ đã đăng ký | `--yes --json` cho việc xóa không tương tác |
| `openspec store list` | Duyệt các kho lưu trữ đã đăng ký | `--json` cho các bản ghi có cấu trúc |
| `openspec store doctor` | Kiểm tra thiết lập kho lưu trữ cục bộ | `--json` cho chẩn đoán có cấu trúc |
| `openspec new change <id>` | Tạo khung thay đổi cục bộ của repo | `--json`, cộng với `--store <id>` để sử dụng một kho lưu trữ đã đăng ký làm gốc OpenSpec |
| `openspec workset create [name]` | Soạn thảo một chế độ xem công việc cá nhân | `--member <path> --json` cho việc soạn thảo không tương tác |
| `openspec workset list` | Duyệt các workset đã lưu | `--json` cho các chế độ xem có cấu trúc |
| `openspec workset remove <name>` | Xóa một chế độ xem đã lưu | `--yes --json` cho việc xóa không tương tác |

---

## Tùy chọn Toàn cục

Các tùy chọn này hoạt động với tất cả các lệnh:

| Option | Mô tả |
|--------|-------------|
| `--version`, `-V` | Hiển thị số phiên bản |
| `--no-color` | Vô hiệu hóa đầu ra màu |
| `--help`, `-h` | Hiển thị trợ giúp cho lệnh |

---

## Các Lệnh Thiết Lập

### `openspec init`

Khởi tạo OpenSpec trong dự án của bạn. Tạo cấu trúc thư mục và cấu hình các tích hợp công cụ AI.

Hành vi mặc định sử dụng các giá trị mặc định cấu hình toàn cục: hồ sơ `core`, giao hàng `both`, quy trình làm việc `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Arguments (Đối số):**

| Argument | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `path` | Không | Thư mục đích (mặc định: thư mục hiện tại) |

**Options (Tùy chọn):**

| Option | Mô tả |
|--------|-------------|
| `--tools <list>` | Cấu hình các công cụ AI không tương tác. Sử dụng `all`, `none`, hoặc danh sách phân cách bằng dấu phẩy |
| `--force` | Tự động dọn dẹp các tệp cũ mà không cần nhắc nhở |
| `--profile <profile>` | Ghi đè hồ sơ toàn cục cho lần chạy init này (`core` hoặc `custom`) |

`--profile custom` sử dụng bất kỳ quy trình làm việc nào hiện được chọn trong cấu hình toàn cục (`openspec config profile`).

**Các ID công cụ được hỗ trợ (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> Danh sách này phản ánh `AI_TOOLS` trong `src/core/config.ts`. Xem [Supported Tools](supported-tools.md) để biết kỹ năng và đường dẫn lệnh của từng công cụ.

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

# Ghi đè hồ sơ cho lần chạy này
openspec init --profile core

# Bỏ qua lời nhắc và tự động dọn dẹp các tệp cũ
openspec init --force
```

**Nó tạo ra:**

```
openspec/
├── specs/              # Các thông số kỹ thuật của bạn (nguồn sự thật)
├── changes/            # Các thay đổi được đề xuất
└── config.yaml         # Cấu hình dự án

.claude/skills/         # Kỹ năng Claude Code (nếu chọn claude)
.cursor/skills/         # Kỹ năng Cursor (nếu chọn cursor)
.cursor/commands/       # Các lệnh OPSX của Cursor (nếu giao hàng bao gồm các lệnh)
... (các cấu hình công cụ khác)
```

---

### `openspec update`

Cập nhật các tệp hướng dẫn OpenSpec sau khi nâng cấp CLI. Tái tạo các tệp cấu hình công cụ AI bằng cách sử dụng hồ sơ toàn cục hiện tại, quy trình làm việc đã chọn và chế độ giao hàng của bạn.

```
openspec update [path] [options]
```

**Arguments (Đối số):**

| Argument | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `path` | Không | Thư mục đích (mặc định: thư mục hiện tại) |

**Options (Tùy chọn):**

| Option | Mô tả |
|--------|-------------|
| `--force` | Buộc cập nhật ngay cả khi các tệp đã được cập nhật |

**Ví dụ:**

```bash
# Cập nhật các tệp hướng dẫn sau khi nâng cấp npm
npm update @fission-ai/openspec
openspec update
```

---

## Các Kho Lưu Trữ (OpenSpec độc lập)

> **Beta.** Các kho lưu trữ và các tính năng được xây dựng trên chúng (tham chiếu, ngữ cảnh làm việc, worksets) là mới; tên lệnh, cờ, định dạng tệp và đầu ra JSON có thể thay đổi giữa các bản phát hành. Đối với hướng dẫn theo vấn đề trước, xem [stores guide](stores-beta/user-guide.md).

Một kho lưu trữ (store) là một repo OpenSpec độc lập mà bạn đã đăng ký trên máy này — ví dụ: một repo lập kế hoạch hoặc một repo hợp đồng. Việc đăng ký một kho lưu trữ cho phép các lệnh thông thường (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) hoạt động trong đó từ bất kỳ đâu bằng cách truyền `--store <id>`.

### `openspec store setup`

Tạo và đăng ký một kho lưu trữ cục bộ. Nếu không có đối số nào trên terminal, OpenSpec sẽ hướng dẫn người dùng qua quá trình thiết lập. Các tác nhân và script nên cung cấp các đầu vào tường minh và sử dụng `--json`.

```bash
openspec store setup [id] [options]
```

**Options (Tùy chọn):**

| Option | Mô tả |
|--------|-------------|
| `--path <path>` | Thư mục nơi kho lưu trữ nên tồn tại (ví dụ: `~/openspec/<id>`) |
| `--remote <url>` | Ghi lại nguồn từ xa chuẩn trong tệp `store.yaml` của kho lưu trữ mới |
| `--init-git` | Khởi tạo một repository Git với commit ban đầu (mặc định) |
| `--no-init-git` | Bỏ qua mọi hành động Git: không khởi tạo, không commit ban đầu |
| `--json` | Đầu ra JSON |

Các lần chạy không tương tác (`--json`, script, tác nhân) phải cung cấp cả ID kho lưu trữ và `--path`. Trong một terminal tương tác, quá trình thiết lập sẽ nhắc về vị trí với một gợi ý có thể chỉnh sửa tại một nơi hiển thị, thuộc sở hữu của người dùng (ví dụ: `~/openspec/<id>`); nó không bao giờ mặc định vào thư mục dữ liệu được quản lý của OpenSpec.

Ví dụ:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Đăng ký một thư mục kho lưu trữ cục bộ hiện có.

```bash
openspec store register [path] [options]
```

**Options (Tùy chọn):**

| Option | Mô tả |
|--------|-------------|
| `--id <id>` | ID kho lưu trữ; mặc định là siêu dữ liệu kho lưu trữ hoặc tên thư mục |
| `--yes` | Xác nhận tạo siêu dữ liệu danh tính kho lưu trữ cho một gốc OpenSpec lành mạnh |
| `--json` | Đầu ra JSON |

### `openspec store unregister`

Quên việc đăng ký một kho lưu trữ cục bộ mà không xóa các tệp.

```bash
openspec store unregister <id> [--json]
```

Sử dụng lệnh này khi một kho lưu trữ đã được di chuyển, sao chép sang nơi khác, hoặc không còn nên được hiển thị bởi OpenSpec trên máy này.

### `openspec store remove`

Quên việc đăng ký một kho lưu trữ cục bộ và xóa thư mục cục bộ của nó.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` hiển thị chính xác thư mục trước khi xóa trong terminal tương tác. Các tác nhân, script và người gọi JSON phải cung cấp `--yes` để xác nhận việc xóa. OpenSpec từ chối xóa một thư mục không chứa siêu dữ liệu kho lưu trữ khớp.

### `openspec store list`

Liệt kê các kho lưu trữ đã đăng ký cục bộ.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Kiểm tra việc đăng ký kho lưu trữ cục bộ, siêu dữ liệu và sự hiện diện của Git.

```bash
openspec store doctor [id] [--json]
```

Doctor chỉ mang tính chẩn đoán; nó báo cáo các gốc bị thiếu, sự không khớp về siêu dữ liệu và trạng thái sổ đăng ký cục bộ không hợp lệ mà không sửa đổi kho lưu trữ.

### Tham chiếu các kho lưu trữ từ một dự án

Một repo dự án có thể khai báo những kho lưu trữ mà công việc của nó sử dụng trong `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

Kể từ đó, đầu ra `openspec instructions` trong repo đó (cả ở cấp độ artifact và bề mặt `apply`, chế độ JSON và người dùng) mang một chỉ mục của các thông số kỹ thuật của từng kho lưu trữ được tham chiếu — ID spec, tóm tắt một dòng từ phần Mục đích của mỗi spec, và lệnh fetch (`openspec show <spec-id> --type spec --store <id>`). Chỉ mục được xây dựng trực tiếp từ bản sao lưu đã đăng ký trong mỗi lần chạy; nội dung spec không bao giờ được sao chép vào đầu ra.

Các tham chiếu là ngữ cảnh chỉ đọc. Chúng không bao giờ thay đổi nơi các lệnh hoạt động: công việc vẫn nằm ở gốc của repo, và việc ghi vào một kho lưu trữ được tham chiếu vẫn là hành động `--store` tường minh. Một tham chiếu không thể được phân giải (ví dụ: một kho lưu trữ chưa được đăng ký trên máy này) sẽ giảm xuống thành cảnh báo trong chỉ mục với cách khắc phục chính xác, và hướng dẫn vẫn được tạo ra. `openspec doctor` báo cáo tình trạng của tham chiếu ở một nơi.

### Ghi lại nguồn sao chép của một kho lưu trữ

Một kho lưu trữ có thể ghi lại nguồn clone chuẩn của nó trong tệp danh tính đã cam kết, để quá trình onboarding không bao giờ bị mắc kẹt ở "đăng ký kho lưu trữ":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Nguồn từ xa được đặt trong `.openspec-store/store.yaml` bên trong commit ban đầu, vì vậy mọi bản sao lưu đều biết điều đó khi sinh ra. Đối với một kho lưu trữ hiện có, hãy chỉnh sửa `store.yaml` bằng tay và cam kết. `store doctor` hiển thị nguồn từ xa đã ghi lại (và nguồn Git được quan sát của bản sao lưu); setup/register đặt tên nó theo hướng dẫn; và register ghi lại nguồn của bản sao lưu trong sổ đăng ký cục bộ của máy.

Một khai báo tham chiếu cũng có thể mang nguồn clone, để một đồng nghiệp chưa có kho lưu trữ nhận được một bản sửa lỗi hoàn chỉnh, có thể dán (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Việc ghi lại nguồn không phải là đồng bộ hóa: OpenSpec không bao giờ clone, pull hoặc push của riêng nó.

### Khai báo một kho lưu trữ mặc định

Một repo mà việc lập kế hoạch hoàn toàn được ngoại vi — không có `openspec/specs/` hoặc `openspec/changes/` cục bộ — có thể khai báo kho lưu trữ của mình một lần thay vì truyền `--store` trong mọi lệnh:

```yaml
# openspec/config.yaml (tệp duy nhất dưới openspec/)
store: team-context
```

Các lệnh thông thường sau đó sẽ tự động phân giải sang kho lưu trữ đã khai báo; banner gốc và khối `root` JSON báo cáo `source: "declared"` với ID kho lưu trữ, và các gợi ý được in vẫn mang `--store <id>`. Việc khai báo là một cơ chế dự phòng, không bao giờ là ghi đè: `--store` tường minh luôn thắng, và một thư mục với các thư mục lập kế hoạch thực tế sẽ bỏ qua con trỏ (với một cảnh báo). Để chuyển đổi một repo con trỏ thành gốc OpenSpec cục bộ, hãy xóa dòng `store:` và chạy `openspec init` — init từ chối tạo khung khi khai báo vẫn còn.

## Trạng thái kiểm tra (sức khỏe mối quan hệ)

Một câu hỏi chỉ đọc, một nơi duy nhất: liệu gốc OpenSpec có khỏe mạnh không, và các kho lưu trữ mà nó tham chiếu có sẵn trên máy này không?

```bash
openspec doctor [--store <id>] [--json]
```

Báo cáo tách biệt sức khỏe của gốc, sức khỏe siêu dữ liệu kho lưu trữ (bao gồm ghi chú khi remote được ghi lại và nguồn gốc của checkout khác nhau), và sức khỏe tham chiếu (hiển thị các hướng dẫn chẩn đoán tương tự, với các bản sửa lỗi clone cho các tham chiếu chưa được giải quyết). Các phát hiện về sức khỏe ở bất kỳ mức độ nào đều thoát bằng 0 — các agent đọc các mảng `status`; chỉ các lỗi lệnh (không có gốc, kho lưu trữ không xác định) mới thoát bằng 1. Doctor không bao giờ clone, đồng bộ hóa hoặc sửa chữa. Để lấy tập hợp đã được lắp ráp thay vì sức khỏe của nó, hãy sử dụng `openspec context`.

## Ngữ cảnh làm việc (tập hợp đã được lắp ráp)

Mọi thứ mà công việc này liên quan thông qua các khai báo OpenSpec, trong một tập hợp làm việc: gốc OpenSpec và các kho lưu trữ mà nó tham chiếu.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Bản tóm tắt JSON có thể được agent sử dụng (mỗi kho lưu trữ tham chiếu khả dụng mang theo công thức fetch của nó; các thành viên chưa được giải quyết mang theo cùng các hướng dẫn sửa lỗi và hiển thị doctor). `--code-workspace` bổ sung việc ghi một tệp workspace VS Code chứa gốc cộng với các kho lưu trữ tham chiếu khả dụng (`ref:<id>` thư mục) — đây là thao tác ghi mà lệnh này thực hiện, bị từ chối nếu tệp đã tồn tại mà không có `--force`. Các thành viên không khả dụng được báo cáo, không bao giờ được đoán.

"Ngữ cảnh làm việc" là tập hợp đã được lắp ráp; trường `context:` trong `openspec/config.yaml` là bối cảnh dự án được tiêm vào các hướng dẫn — hai thứ khác nhau. `openspec doctor` trả lời liệu tập hợp có khỏe mạnh không; `openspec context` trả lời tập hợp đó là gì.

## Các workset cá nhân

> **Beta.** Worksets là một phần của bề mặt beta mới; các lệnh, cờ và định dạng tệp có thể thay đổi hình dạng giữa các bản phát hành. Để xem hướng dẫn chi tiết, hãy tham khảo [stores guide](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Một workset là một chế độ xem được đặt tên và cá nhân hóa của các thư mục mà bạn cùng làm việc — một gốc lập kế hoạch cộng với bất cứ thứ gì khác mà bạn chọn — được lưu trên máy của bạn và mở lại bằng tên trong công cụ của bạn. Nó hoàn toàn cục bộ: không bao giờ được commit, không bao giờ được chia sẻ, không bao giờ được suy ra từ các khai báo, và việc xóa nó sẽ không bao giờ chạm vào một thư mục thành viên.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` chạy một luồng hướng dẫn ngắn (hoặc nhận các cờ `--member` không tương tác; thành viên đầu tiên là chính — các phiên bắt đầu từ đó). `open` khởi chạy công cụ đã chọn: trình soạn thảo (VS Code, Cursor) mở một cửa sổ với mọi thành viên và trả về; các tác nhân CLI (Claude Code, codex) tiếp quản terminal này như một phiên với mọi thành viên được đính kèm và không có lời nhắc nào được điền sẵn, kết thúc khi bạn thoát. Một thư mục thành viên bị thiếu tại thời điểm mở sẽ bị bỏ qua cùng với một ghi chú; phần còn lại sẽ mở. Tùy chọn công cụ đã lưu có thể bị ghi đè theo từng lần mở bằng `--tool`.

Hỗ trợ một công cụ mới là cấu hình, không phải mã. Mỗi công cụ là một trong hai kiểu khởi chạy — `workspace-file` (được khởi chạy với `.code-workspace` được tạo) hoặc `attach-dirs` (một cờ đính kèm cho mỗi thành viên) — và khóa `openers` trong `config.json` toàn cục (mở nó bằng `openspec config edit`) thêm các công cụ hoặc điều chỉnh các tính năng tích hợp theo trường:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Tất cả trạng thái workset được lưu trong thư mục `worksets/` của thư mục dữ liệu toàn cục (các chế độ xem đã lưu cộng với các tệp `<name>.code-workspace` được tạo, được tái tạo lại khi mở); xóa thư mục đó sẽ loại bỏ mọi dấu vết.

---

## Các Lệnh Duyệt (Browsing Commands)

### `openspec list`

Liệt kê các thay đổi hoặc thông số kỹ thuật trong dự án của bạn.

```
openspec list [options]
```

**Các Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--specs` | Liệt kê các thông số kỹ thuật thay vì các thay đổi |
| `--changes` | Liệt kê các thay đổi (mặc định) |
| `--sort <order>` | Sắp xếp theo `recent` (gần đây nhất - mặc định) hoặc `name` (tên) |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Liệt kê tất cả các thay đổi đang hoạt động
openspec list

# Liệt kê tất cả các thông số kỹ thuật
openspec list --specs

# Đầu ra JSON cho các script
openspec list --json
```

**Đầu ra (văn bản):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Hiển thị một bảng điều khiển tương tác để khám phá các thông số kỹ thuật và thay đổi.

```
openspec view
```

Mở giao diện dựa trên terminal để điều hướng qua các thông số kỹ thuật và thay đổi của dự án của bạn.

---

### `openspec show`

Hiển thị chi tiết về một thay đổi hoặc thông số kỹ thuật.

```
openspec show [item-name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `item-name` | Không | Tên của thay đổi hoặc thông số kỹ thuật (sẽ nhắc nếu bị bỏ qua) |

**Các Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--type <type>` | Chỉ định loại: `change` (thay đổi) hoặc `spec` (thông số kỹ thuật) (tự động phát hiện nếu không mơ hồ) |
| `--json` | Xuất dưới dạng JSON |
| `--no-interactive` | Vô hiệu hóa lời nhắc |

**Các tùy chọn dành riêng cho thay đổi:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--deltas-only` | Chỉ hiển thị các thông số kỹ thuật delta (chế độ JSON) |

**Các tùy chọn dành riêng cho thông số kỹ thuật:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--requirements` | Chỉ hiển thị các yêu cầu, loại trừ các kịch bản (chế độ JSON) |
| `--no-scenarios` | Loại trừ nội dung kịch bản (chế độ JSON) |
| `-r, --requirement <id>` | Hiển thị một yêu cầu cụ thể bằng chỉ mục 1 (chế độ JSON) |

**Ví dụ:**

```bash
# Lựa chọn tương tác
openspec show

# Hiển thị một thay đổi cụ thể
openspec show add-dark-mode

# Hiển thị một thông số kỹ thuật cụ thể
openspec show auth --type spec

# Đầu ra JSON để phân tích cú pháp
openspec show add-dark-mode --json
```

---

## Các Lệnh Xác Thực (Validation Commands)

### `openspec validate`

Xác thực các thay đổi và thông số kỹ thuật về các vấn đề cấu trúc.

```
openspec validate [item-name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `item-name` | Không | Mục cụ thể cần xác thực (sẽ nhắc nếu bị bỏ qua) |

**Các Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--all` | Xác thực tất cả các thay đổi và thông số kỹ thuật |
| `--changes` | Xác thực tất cả các thay đổi |
| `--specs` | Xác thực tất cả các thông số kỹ thuật |
| `--type <type>` | Chỉ định loại khi tên không rõ ràng: `change` hoặc `spec` |
| `--strict` | Bật chế độ xác thực nghiêm ngặt |
| `--json` | Xuất dưới dạng JSON |
| `--concurrency <n>` | Số lượng xác thực song song tối đa (mặc định: 6, hoặc biến môi trường `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Vô hiệu hóa lời nhắc |

**Ví dụ:**

```bash
# Xác thực tương tác
openspec validate

# Xác thực một thay đổi cụ thể
openspec validate add-dark-mode

# Xác thực tất cả các thay đổi
openspec validate --changes

# Xác thực mọi thứ với đầu ra JSON (cho CI/script)
openspec validate --all --json

# Xác thực nghiêm ngặt với khả năng song song tăng cường
openspec validate --all --strict --concurrency 12
```

**Đầu ra (văn bản):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: thiếu phần "Technical Approach"

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

## Các Lệnh Vòng Đời (Lifecycle Commands)

### `openspec archive`

Lưu trữ một thay đổi đã hoàn thành và hợp nhất các thông số kỹ thuật delta vào các thông số kỹ thuật chính.

```
openspec archive [change-name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi cần lưu trữ (sẽ nhắc nếu bị bỏ qua) |

**Các Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `-y, --yes` | Bỏ qua các lời nhắc xác nhận |
| `--skip-specs` | Bỏ qua cập nhật thông số kỹ thuật (cho các thay đổi chỉ về cơ sở hạ tầng/công cụ/tài liệu) |
| `--no-validate` | Bỏ qua xác thực (yêu cầu xác nhận) |

**Ví dụ:**

```bash
# Lưu trữ tương tác
openspec archive

# Lưu trữ một thay đổi cụ thể
openspec archive add-dark-mode

# Lưu trữ mà không có lời nhắc (CI/script)
openspec archive add-dark-mode --yes

# Lưu trữ một thay đổi công cụ không ảnh hưởng đến thông số kỹ thuật
openspec archive update-ci-config --skip-specs
```

**Nó làm gì:**

1. Xác thực thay đổi (trừ khi có `--no-validate`)
2. Nhắc xác nhận (trừ khi có `--yes`)
3. Hợp nhất các thông số kỹ thuật delta vào `openspec/specs/`
4. Di chuyển thư mục thay đổi đến `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Các Lệnh Quy Trình Làm Việc (Workflow Commands)

Các lệnh này hỗ trợ quy trình OPSX dựa trên artifact. Chúng hữu ích cho cả con người kiểm tra tiến độ và các tác nhân xác định bước tiếp theo.

### `openspec new change`

Tạo một thư mục thay đổi và siêu dữ liệu đã được check-in tùy chọn trong gốc OpenSpec đã giải quyết.

```bash
openspec new change <name> [options]
```

**Các Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--description <text>` | Mô tả để thêm vào `index.md` |
| `--goal <text>` | Siêu dữ liệu mục tiêu tùy chọn để lưu cùng với thay đổi |
| `--schema <name>` | Schema quy trình làm việc cần sử dụng |
| `--store <id>` | ID kho lưu trữ (store) được sử dụng làm gốc OpenSpec (một store là một repo OpenSpec độc lập mà bạn đã đăng ký) |
| `--json` | Xuất JSON |

Ví dụ:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Hiển thị trạng thái hoàn thành artifact cho một thay đổi.

```
openspec status [options]
```

**Các Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--change <id>` | Tên thay đổi (sẽ nhắc nếu bị bỏ qua) |
| `--schema <name>` | Ghi đè schema (tự động phát hiện từ cấu hình của thay đổi) |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Kiểm tra trạng thái tương tác
openspec status

# Trạng thái cho một thay đổi cụ thể
openspec status --change add-dark-mode

# JSON để tác nhân sử dụng
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

Nhận các hướng dẫn được làm giàu để tạo một artifact hoặc áp dụng các tác vụ. Được sử dụng bởi các tác nhân AI để hiểu cần tạo gì tiếp theo.

```
openspec instructions [artifact] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `artifact` | Không | ID artifact: `proposal`, `specs`, `design`, `tasks`, hoặc `apply` |

**Các Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--change <id>` | Tên thay đổi (bắt buộc trong chế độ không tương tác) |
| `--schema <name>` | Ghi đè schema |
| `--json` | Xuất dưới dạng JSON |

**Trường hợp đặc biệt:** Sử dụng `apply` làm artifact để nhận hướng dẫn triển khai tác vụ.

**Ví dụ:**

```bash
# Nhận hướng dẫn cho artifact tiếp theo
openspec instructions --change add-dark-mode

# Nhận hướng dẫn artifact cụ thể
openspec instructions design --change add-dark-mode

# Nhận hướng dẫn áp dụng/triển khai
openspec instructions apply --change add-dark-mode

# JSON để tác nhân tiêu thụ
openspec instructions design --change add-dark-mode --json
```

**Đầu ra bao gồm:**

- Nội dung mẫu cho artifact
- Ngữ cảnh dự án từ cấu hình
- Nội dung từ các artifact phụ thuộc
- Các quy tắc theo từng artifact từ cấu hình

---

### `openspec templates`

Hiển thị các đường dẫn mẫu đã được giải quyết cho tất cả các artifact trong một schema.

```
openspec templates [options]
```

**Các Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--schema <name>` | Schema cần kiểm tra (mặc định: `spec-driven`) |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Hiển thị đường dẫn mẫu cho schema mặc định
openspec templates

# Hiển thị các mẫu cho schema tùy chỉnh
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

**Các Tùy chọn:**

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
    Quy trình phát triển spec-driven mặc định
    Luồng: proposal → specs → design → tasks

  my-custom (project)
    Quy trình làm việc tùy chỉnh cho dự án này
    Luồng: research → proposal → tasks
```

## Các Lệnh về Schema

Các lệnh để tạo và quản lý các schema quy trình làm việc tùy chỉnh.

### `openspec schema init`

Tạo một schema cục bộ cho dự án.

```
openspec schema init <name> [options]
```

**Tham số:**

| Tham số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `name` | Có | Tên schema (kebab-case) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--description <text>` | Mô tả của Schema |
| `--artifacts <list>` | ID artifact phân tách bằng dấu phẩy (mặc định: `proposal,specs,design,tasks`) |
| `--default` | Đặt làm schema mặc định của dự án |
| `--no-default` | Không nhắc đặt làm mặc định |
| `--force` | Ghi đè lên schema hiện có |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Tạo schema tương tác
openspec schema init research-first

# Không tương tác với các artifact cụ thể
openspec schema init rapid \
  --description "Quy trình lặp lại nhanh" \
  --artifacts "proposal,tasks" \
  --default
```

**Nó tạo ra:**

```
openspec/schemas/<name>/
├── schema.yaml           # Định nghĩa Schema
└── templates/
    ├── proposal.md       # Template cho mỗi artifact
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

**Tham số:**

| Tham số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `source` | Có | Schema cần sao chép |
| `name` | Không | Tên schema mới (mặc định: `<source>-custom`) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--force` | Ghi đè lên đích đến hiện có |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Fork schema spec-driven tích hợp sẵn
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Xác thực cấu trúc và các template của một schema.

```
openspec schema validate [name] [options]
```

**Tham số:**

| Tham số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `name` | Không | Schema cần xác thực (xác thực tất cả nếu bỏ qua) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--verbose` | Hiển thị các bước xác thực chi tiết |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Xác thực một schema cụ thể
openspec schema validate my-workflow

# Xác thực tất cả các schemas
openspec schema validate
```

---

### `openspec schema which`

Hiển thị nơi một schema được phân giải (hữu ích cho việc gỡ lỗi thứ tự ưu tiên).

```
openspec schema which [name] [options]
```

**Tham số:**

| Tham số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `name` | Không | Tên schema |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--all` | Liệt kê tất cả các schemas cùng với nguồn của chúng |
| `--json` | Xuất dưới dạng JSON |

**Ví dụ:**

```bash
# Kiểm tra một schema đến từ đâu
openspec schema which spec-driven
```

**Kết quả:**

```
spec-driven được phân giải từ: package
  Nguồn: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Thứ tự ưu tiên của Schema:**

1. Dự án: `openspec/schemas/<name>/`
2. Người dùng: `~/.local/share/openspec/schemas/<name>/`
3. Gói (Package): Các schema tích hợp sẵn

---

## Các Lệnh Cấu Hình

### `openspec config`

Xem và sửa đổi cấu hình OpenSpec toàn cục.

```
openspec config <subcommand> [options]
```

**Các lệnh phụ:**

| Lệnh phụ | Mô tả |
|------------|-------------|
| `path` | Hiển thị vị trí tệp cấu hình |
| `list` | Hiển thị tất cả các cài đặt hiện tại |
| `get <key>` | Lấy một giá trị cụ thể |
| `set <key> <value>` | Đặt một giá trị |
| `unset <key>` | Xóa một khóa |
| `reset` | Đặt lại về mặc định |
| `edit` | Mở bằng `$EDITOR` |
| `profile [preset]` | Cấu hình hồ sơ quy trình làm việc tương tác hoặc qua preset |

**Ví dụ:**

```bash
# Hiển thị đường dẫn tệp cấu hình
openspec config path

# Liệt kê tất cả các cài đặt
openspec config list

# Lấy một giá trị cụ thể
openspec config get telemetry.enabled

# Đặt một giá trị
openspec config set telemetry.enabled false

# Thiết lập một giá trị chuỗi một cách rõ ràng
openspec config set user.name "My Name" --string

# Xóa một cài đặt tùy chỉnh
openspec config unset user.name

# Đặt lại tất cả cấu hình
openspec config reset --all --yes

# Chỉnh sửa cấu hình bằng trình soạn thảo của bạn
openspec config edit

# Cấu hình hồ sơ với wizard dựa trên hành động
openspec config profile

# Preset nhanh: chuyển đổi quy trình làm việc sang core (giữ chế độ delivery)
openspec config profile core
```

`openspec config profile` bắt đầu bằng một bản tóm tắt trạng thái hiện tại, sau đó cho phép bạn chọn:
- Thay đổi delivery + workflows
- Chỉ thay đổi delivery
- Chỉ thay đổi workflows
- Giữ nguyên cài đặt hiện tại (thoát)

Nếu bạn giữ nguyên cài đặt hiện tại, không có thay đổi nào được ghi và không hiển thị lời nhắc cập nhật.
Nếu không có thay đổi cấu hình nào nhưng các tệp dự án hiện tại chưa đồng bộ với hồ sơ/delivery toàn cục của bạn, OpenSpec sẽ hiển thị cảnh báo và đề xuất `openspec update`.
Nhấn `Ctrl+C` cũng hủy quy trình một cách sạch sẽ (không có stack trace) và thoát bằng mã `130`.
Trong danh sách kiểm tra quy trình làm việc, `[x]` nghĩa là quy trình làm việc đã được chọn trong cấu hình toàn cục. Để áp dụng các lựa chọn đó vào tệp dự án, hãy chạy `openspec update` (hoặc chọn `Apply changes to this project now?` khi được nhắc bên trong một dự án).

**Ví dụ tương tác:**

```bash
# Cập nhật chỉ delivery
openspec config profile
# chọn: Chỉ thay đổi delivery
# chọn delivery: Skills only

# Cập nhật chỉ workflows
openspec config profile
# chọn: Chỉ thay đổi workflows
# bật/tắt các workflow trong danh sách kiểm tra, sau đó xác nhận
```

---

## Các Lệnh Tiện Ích

### `openspec feedback`

Gửi phản hồi về OpenSpec. Tạo một issue trên GitHub.

```
openspec feedback <message> [options]
```

**Tham số:**

| Tham số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `message` | Có | Tin nhắn phản hồi |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--body <text>` | Mô tả chi tiết |

**Yêu cầu:** Cần cài đặt và xác thực GitHub CLI (`gh`).

**Ví dụ:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Quản lý các tính năng tự động hoàn thành (completion) cho CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Các lệnh phụ:**

| Lệnh phụ | Mô tả |
|------------|-------------|
| `generate [shell]` | Xuất script hoàn thành ra stdout |
| `install [shell]` | Cài đặt hoàn thành cho shell của bạn |
| `uninstall [shell]` | Gỡ bỏ các tính năng hoàn thành đã cài đặt |

**Các shell được hỗ trợ:** `bash`, `zsh`, `fish`, `powershell`

**Ví dụ:**

```bash
# Cài đặt completions (tự động phát hiện shell)
openspec completion install

# Cài đặt cho shell cụ thể
openspec completion install zsh

# Tạo script để cài đặt thủ công
openspec completion generate bash > ~/.bash_completion.d/openspec

# Gỡ bỏ
openspec completion uninstall
```

---

## Mã Thoát (Exit Codes)

| Mã | Ý nghĩa |
|------|---------|
| `0` | Thành công |
| `1` | Lỗi (lỗi xác thực, thiếu tệp, v.v.) |

---

## Các Biến Môi Trường

| Biến | Mô tả |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Đặt thành `0` để vô hiệu hóa telemetry |
| `DO_NOT_TRACK` | Đặt thành `1` để vô hiệu hóa telemetry (tín hiệu DNT tiêu chuẩn) |
| `OPENSPEC_CONCURRENCY` | Số lượng đồng thời mặc định cho việc xác thực hàng loạt (mặc định: 6) |
| `EDITOR` hoặc `VISUAL` | Trình soạn thảo cho `openspec config edit` |
| `NO_COLOR` | Vô hiệu hóa đầu ra màu khi được đặt |

---

## Tài Liệu Liên Quan

- [Commands](commands.md) - Các lệnh AI (`/opsx:propose`, `/opsx:apply`, v.v.)
- [Workflows](workflows.md) - Các mẫu phổ biến và thời điểm sử dụng từng lệnh
- [Customization](customization.md) - Tạo các schema và template tùy chỉnh
- [Getting Started](getting-started.md) - Hướng dẫn thiết lập lần đầu