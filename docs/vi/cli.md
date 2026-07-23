# Tài liệu tham khảo CLI

CLI OpenSpec (`openspec`) cung cấp các lệnh dòng lệnh để thiết lập dự án, xác thực, kiểm tra trạng thái và quản lý. Các lệnh này bổ sung cho các lệnh gạch chéo AI (như `/opsx:propose`) được ghi chú trong [Lệnh](commands.md).

## Tóm tắt

| Danh mục | Lệnh | Mục đích |
|----------|----------|---------|
| **Thiết lập** | `init`, `update` | Khởi tạo và cập nhật OpenSpec trong dự án của bạn |
| **Kho lưu trữ (các kho OpenSpec độc lập)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Quản lý các kho lưu trữ — các kho OpenSpec độc lập bạn đã đăng ký |
| **Sức khỏe** | `doctor` | Báo cáo tình trạng sức khỏe mối quan hệ của gốc dự án đã được xác định |
| **Ngữ cảnh làm việc** | `context` | Tập hợp bộ làm việc (gốc + các kho lưu trữ được tham chiếu) |
| **Bộ làm việc cá nhân** | `workset create`, `workset list`, `workset open`, `workset remove` | Lưu và mở các khung nhìn làm việc cá nhân, cục bộ trong công cụ của bạn |
| **Duyệt** | `list`, `view`, `show` | Khám phá các thay đổi và đặc tả |
| **Xác thực** | `validate` | Kiểm tra các thay đổi và đặc tả để phát hiện lỗi |
| **Vòng đời** | `archive` | Hoàn tất các thay đổi đã hoàn thành |
| **Quy trình làm việc** | `new change`, `status`, `instructions`, `templates`, `schemas` | Hỗ trợ quy trình làm việc dựa trên artifact |
| **Lược đồ** | `schema init`, `schema fork`, `schema validate`, `schema which` | Tạo và quản lý các quy trình làm việc tùy chỉnh |
| **Cấu hình** | `config` | Xem và sửa đổi các cài đặt |
| **Tiện ích** | `feedback`, `completion` | Phản hồi và tích hợp shell |

---

## Lệnh của Con người và Tác nhân

Hầu hết các lệnh CLI được thiết kế để **con người sử dụng** trong terminal. Một số lệnh cũng hỗ trợ **sử dụng bởi tác nhân/script** thông qua đầu ra JSON.

### Các lệnh chỉ dành cho con người

Các lệnh này mang tính tương tác và được thiết kế để sử dụng trong terminal:

| Lệnh | Mục đích |
|---------|---------|
| `openspec init` | Khởi tạo dự án (có các câu hỏi tương tác) |
| `openspec view` | Bảng điều khiển tương tác |
| `openspec workset open <name>` | Mở một workset đã lưu (cửa sổ trình soạn thảo hoặc phiên tác nhân trên terminal) |
| `openspec config edit` | Mở tệp cấu hình trong trình soạn thảo |
| `openspec feedback` | Gửi phản hồi thông qua GitHub |
| `openspec completion install` | Cài đặt tính năng tự động hoàn thành lệnh shell |

### Các lệnh tương thích với tác nhân

Các lệnh này hỗ trợ đầu ra `--json` để sử dụng lập trình bởi các tác nhân AI và script:

| Lệnh | Cách dùng cho con người | Cách dùng cho tác nhân |
|---------|-----------|-----------|
| `openspec list` | Duyệt các thay đổi/đặc tả | `--json` để lấy dữ liệu có cấu trúc |
| `openspec show <item>` | Đọc nội dung | `--json` để phân tích cú pháp |
| `openspec validate` | Kiểm tra lỗi | `--all --json` để kiểm tra hàng loạt |
| `openspec status` | Xem tiến độ của các tác phẩm | `--json` để lấy trạng thái có cấu trúc |
| `openspec instructions` | Nhận các bước tiếp theo | `--json` để lấy hướng dẫn cho tác nhân |
| `openspec templates` | Tìm đường dẫn mẫu | `--json` để giải quyết đường dẫn |
| `openspec schemas` | Liệt kê các schema có sẵn | `--json` để khám phá schema |
| `openspec store setup <id>` | Tạo và đăng ký một kho lưu trữ cục bộ | `--json` kèm các đầu vào rõ ràng để lấy đầu ra cài đặt có cấu trúc |
| `openspec store register <path>` | Đăng ký một kho lưu trữ hiện có | `--json` để lấy đầu ra đăng ký có cấu trúc |
| `openspec store unregister <id>` | Bỏ đăng ký kho lưu trữ cục bộ | `--json` để lấy đầu ra dọn dẹp có cấu trúc |
| `openspec store remove <id>` | Xóa thư mục kho lưu trữ cục bộ đã đăng ký | `--yes --json` để xóa không cần tương tác |
| `openspec store list` | Duyệt các kho lưu trữ đã đăng ký | `--json` để lấy danh sách đăng ký có cấu trúc |
| `openspec store doctor` | Kiểm tra cấu hình kho lưu trữ cục bộ | `--json` để lấy chẩn đoán có cấu trúc |
| `openspec new change <id>` | Tạo khung thay đổi trong kho lưu trữ cục bộ | `--json`, kèm `--store <id>` để sử dụng kho lưu trữ đã đăng ký làm gốc OpenSpec |
| `openspec workset create [name]` | Tạo một khung làm việc cá nhân | `--member <path> --json` để tạo không cần tương tác |
| `openspec workset list` | Duyệt các workset đã lưu | `--json` để lấy các khung nhìn có cấu trúc |
| `openspec workset remove <name>` | Xóa một khung nhìn đã lưu | `--yes --json` để xóa không cần tương tác |

---

## Tùy chọn toàn cục

Các tùy chọn này hoạt động với tất cả các lệnh:

| Tùy chọn | Mô tả |
|--------|-------------|
| `--version`, `-V` | Hiển thị số phiên bản |
| `--no-color` | Tắt đầu ra màu sắc |
| `--help`, `-h` | Hiển thị trợ giúp cho lệnh |

---

## Các lệnh cài đặt

### `openspec init`

Khởi tạo OpenSpec trong dự án của bạn. Tạo cấu trúc thư mục và cấu hình tích hợp các công cụ AI.

Hành vi mặc định sử dụng các giá trị mặc định của cấu hình toàn cục: profile `core`, delivery `both`, workflows `propose, explore, apply, sync, archive`.

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
| `--tools <list>` | Cấu hình các công cụ AI không cần tương tác. Sử dụng `all`, `none`, hoặc danh sách phân tách bằng dấu phẩy |
| `--force` | Tự động dọn dẹp các tệp cũ mà không cần hỏi |
| `--profile <profile>` | Ghi đè hồ sơ toàn cục cho lần chạy khởi tạo này (`core` hoặc `custom`) |

`--profile custom` sử dụng các workflows hiện đang được chọn trong cấu hình toàn cục (`openspec config profile`).

**Các ID công cụ được hỗ trợ (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> Danh sách này trùng khớp với biến `AI_TOOLS` trong tệp `src/core/config.ts`. Xem [Công cụ được hỗ trợ](supported-tools.md) để biết kỹ năng và đường dẫn lệnh của từng công cụ.

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

# Bỏ qua các câu hỏi và tự động dọn dẹp tệp cũ
openspec init --force
```

**Những gì lệnh này tạo ra:**

```
openspec/
├── specs/              # Các đặc tả của bạn (nguồn thông tin chính xác)
├── changes/            # Các thay đổi được đề xuất
└── config.yaml         # Cấu hình dự án

.claude/skills/         # Kỹ năng Claude Code (nếu đã chọn claude)
.cursor/skills/         # Kỹ năng Cursor (nếu đã chọn cursor)
.cursor/commands/       # Lệnh Cursor OPSX (nếu delivery bao gồm lệnh)
... (các tệp cấu hình công cụ khác)
```

---

### `openspec update`

Cập nhật các tệp hướng dẫn OpenSpec sau khi nâng cấp CLI. Tạo lại các tệp cấu hình công cụ AI sử dụng hồ sơ toàn cục hiện tại, các workflows đã chọn và chế độ delivery của bạn.

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
| `--force` | Buộc cập nhật ngay cả khi các tệp đã là phiên bản mới nhất |

**Ví dụ:**

```bash
# Cập nhật tệp hướng dẫn sau khi nâng cấp qua npm
npm update @fission-ai/openspec
openspec update
```

---

## Kho lưu trữ (kho lưu trữ OpenSpec độc lập)

> **Beta.** Các kho lưu trữ và các tính năng được xây dựng trên chúng (references, working context, worksets) là mới; tên lệnh, cờ, định dạng tệp và đầu ra JSON có thể thay đổi giữa các bản phát hành. Để xem hướng dẫn đi từng bước giải quyết vấn đề, xem [hướng dẫn kho lưu trữ](stores-beta/user-guide.md).

Kho lưu trữ là một kho lưu trữ OpenSpec độc lập mà bạn đã đăng ký trên máy này — ví dụ như kho lưu trữ kế hoạch hoặc kho lưu trữ hợp đồng. Đăng ký một kho lưu trữ cho phép các lệnh thông thường (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) hoạt động trên nó từ bất kỳ đâu bằng cách truyền `--store <id>`.

### `openspec store setup`

Tạo và đăng ký một kho lưu trữ cục bộ. Khi không có đối số trong terminal, OpenSpec sẽ hướng dẫn người dùng thực hiện cài đặt. Các tác nhân và script nên truyền các đầu vào rõ ràng và sử dụng `--json`.

```bash
openspec store setup [id] [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--path <path>` | Thư mục nơi kho lưu trữ sẽ được đặt (ví dụ `~/openspec/<id>`) |
| `--remote <url>` | Ghi lại remote chính thức vào tệp `store.yaml` của kho lưu trữ mới |
| `--init-git` | Khởi tạo kho lưu trữ Git với lần commit đầu tiên (mặc định) |
| `--no-init-git` | Bỏ qua tất cả các thao tác Git: không khởi tạo, không commit đầu tiên |
| `--json` | Xuất ra JSON |

Các lần chạy không tương tác (`--json`, script, tác nhân) phải truyền cả id kho lưu trữ và `--path`. Trong terminal tương tác, quá trình cài đặt sẽ hỏi vị trí với một đề xuất có thể chỉnh sửa ở vị trí rõ ràng thuộc quyền sở hữu của người dùng (ví dụ `~/openspec/<id>`); nó không bao giờ mặc định sử dụng thư mục dữ liệu được quản lý bởi OpenSpec.

Ví dụ:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Đăng ký một thư mục kho lưu trữ cục bộ hiện có. Trong giai đoạn beta của tính năng kho lưu trữ, một gốc có thể được đăng ký trước khi có bất kỳ thay đổi nào, các đặc tả được áp dụng, hoặc các thay đổi được lưu trữ; trong trường hợp đó, các thư mục `openspec/changes/`, `openspec/specs/`, và `openspec/changes/archive/` có thể không tồn tại cho đến khi các lệnh thông thường tạo ra chúng. Một kho lưu trữ chỉ chứa cấu hình khai báo `store: <id>` vẫn là một con trỏ đến kho lưu trữ khác và không được đăng ký là gốc kho lưu trữ trừ khi con trỏ đó bị xóa.

```bash
openspec store register [path] [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--id <id>` | Id kho lưu trữ; mặc định là siêu dữ liệu kho lưu trữ hoặc tên thư mục |
| `--yes` | Xác nhận tạo siêu dữ liệu định danh kho lưu trữ cho một gốc OpenSpec hợp lệ |
| `--json` | Xuất ra JSON |

### `openspec store unregister`

Bỏ đăng ký một kho lưu trữ cục bộ mà không xóa các tệp.

```bash
openspec store unregister <id> [--json]
```

Sử dụng lệnh này khi một kho lưu trữ được di chuyển, sao chép đến nơi khác, hoặc không nên được hiển thị bởi OpenSpec trên máy này nữa.

### `openspec store remove`

Bỏ đăng ký kho lưu trữ cục bộ và xóa thư mục cục bộ của nó.

```bash
openspec store remove <id> [--yes] [--json]
```

Lệnh `remove` sẽ hiển thị chính xác thư mục trước khi xóa trong terminal tương tác. Các tác nhân, script và người gọi JSON phải truyền `--yes` để xác nhận xóa. OpenSpec sẽ từ chối xóa một thư mục không chứa siêu dữ liệu kho lưu trữ khớp.

### `openspec store list`

Liệt kê các kho lưu trữ đã đăng ký trên máy.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Kiểm tra đăng ký kho lưu trữ cục bộ, siêu dữ liệu và sự tồn tại của Git.

```bash
openspec store doctor [id] [--json]
```

Lệnh doctor chỉ dùng để chẩn đoán; nó báo cáo các gốc bị thiếu, sai lệch siêu dữ liệu và trạng thái đăng ký cục bộ không hợp lệ mà không sửa đổi kho lưu trữ.

### Tham chiếu đến kho lưu trữ từ một dự án

Một kho lưu trữ dự án có thể khai báo các kho lưu trữ mà công việc của nó dựa vào trong `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

Từ đó, đầu ra của lệnh `openspec instructions` trong kho lưu trữ đó (cả giao diện theo từng tác phẩm và giao diện `apply`, chế độ JSON và chế độ con người) sẽ mang theo một chỉ mục các đặc tả của mỗi kho lưu trữ được tham chiếu — id đặc tả, một tóm tắt một dòng từ phần Mục đích của mỗi đặc tả, và lệnh lấy dữ liệu (`openspec show <spec-id> --type spec --store <id>`). Chỉ mục được xây dựng trực tiếp từ bản checkout đã đăng ký trên mỗi lần chạy; nội dung đặc tả không bao giờ được sao chép vào đầu ra.

Các tham chiếu là ngữ cảnh chỉ đọc. Chúng không bao giờ thay đổi nơi các lệnh hoạt động: công việc luôn nằm ở gốc của chính kho lưu trữ đó, và ghi dữ liệu vào kho lưu trữ được tham chiếu vẫn là một thao tác `--store` rõ ràng. Một tham chiếu không thể được giải quyết (ví dụ: một kho lưu trữ không được đăng ký trên máy này) sẽ giảm xuống thành cảnh báo trong chỉ mục kèm theo cách khắc phục chính xác, và các hướng dẫn vẫn được tạo ra. Lệnh `openspec doctor` báo cáo tình trạng của các tham chiếu ở một nơi duy nhất.

### Ghi lại nguồn gốc sao chép của kho lưu trữ

Một kho lưu trữ có thể ghi lại nguồn sao chép chính thức của nó vào tệp định danh đã commit, để quá trình làm quen với dự án không bao giờ bị kẹt lại ở bước "đăng ký kho lưu trữ":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

Thông tin remote sẽ được lưu vào tệp `.openspec-store/store.yaml` bên trong lần commit đầu tiên, để mọi bản sao chép đều biết thông tin này ngay từ đầu. Đối với kho lưu trữ hiện có, chỉnh sửa tệp `store.yaml` thủ công và commit. Lệnh `store doctor` hiển thị remote đã được ghi (cùng nguồn gốc Git của bản checkout được quan sát); hướng dẫn chia sẻ cài đặt/đăng ký sẽ đặt tên cho nó; và lệnh register ghi lại nguồn gốc của bản checkout vào danh sách đăng ký cục bộ của máy.

Khai báo tham chiếu cũng có thể mang theo nguồn sao chép, để các thành viên trong nhóm chưa có kho lưu trữ nhận được cách khắc phục hoàn chỉnh, có thể dán trực tiếp (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Việc ghi lại remote không phải là thao tác đồng bộ hóa: OpenSpec không bao giờ tự thực hiện các thao tác sao chép, pull hoặc push dữ liệu.

### Khai báo kho lưu trữ mặc định

Một kho lưu trữ có kế hoạch được hoàn toàn bên ngoài — không có thư mục `openspec/specs/` hoặc `openspec/changes/` cục bộ — có thể khai báo kho lưu trữ của nó một lần thay vì phải truyền `--store` trên mọi lệnh:

```yaml
# openspec/config.yaml (tệp duy nhất trong thư mục openspec/)
store: team-context
```

Các lệnh thông thường sau đó sẽ tự động giải quyết đến kho lưu trữ đã khai báo; banner gốc và khối JSON `root` báo cáo `source: "declared"` kèm id kho lưu trữ, và các gợi ý in ra vẫn mang theo `--store <id>`. Khai báo này chỉ là lựa chọn dự phòng, không bao giờ ghi đè: `--store` rõ ràng luôn được ưu tiên, và một thư mục có các thư mục lập kế hoạch thực tế sẽ bỏ qua con trỏ này (kèm cảnh báo). Để chuyển đổi một kho lưu trữ con trỏ thành gốc OpenSpec cục bộ, xóa dòng `store:` và chạy lệnh `openspec init` — lệnh init sẽ từ chối tạo khung cấu trúc khi khai báo này còn tồn tại.

Một biến thể ở cấp máy sẽ áp dụng cho tất cả các kho lưu trữ cùng lúc: `openspec config set defaultStore <id>` (xem phần Cấu hình). Biến thể này chỉ được tham chiếu sau khi `--store`, gốc cục bộ và con trỏ dự án đều không thể giải quyết được; sau đó banner gốc và khối JSON `root` sẽ báo cáo `source: "global_default"`.

## Doctor (kiểm tra sức khỏe mối quan hệ)

Một câu hỏi chỉ đọc, một nơi duy nhất: gốc OpenSpec có khỏe không, và các kho lưu trữ (store) mà nó tham chiếu có sẵn trên máy này không?

```bash
openspec doctor [--store <id>] [--json]
```

Báo cáo phân tách thành sức khỏe gốc, sức khỏe siêu dữ liệu của kho lưu trữ (bao gồm ghi chú khi remote đã ghi lại và nguồn gốc của bản sao checkout khác nhau, và ghi chú khi bản sao checkout của kho lưu trữ đã lệch phía sau nhánh theo dõi upstream đã lấy lần cuối), và sức khỏe tham chiếu (cùng các hướng dẫn chẩn đoán được hiển thị, kèm các sửa lỗi sao chép cho các tham chiếu chưa được giải quyết). Các kết quả chẩn đoán sức khỏe với mọi mức độ nghiêm trọng đều thoát với mã 0 — các agent đọc các mảng `status`; chỉ các lỗi thực thi lệnh (không tìm thấy gốc, kho lưu trữ không xác định) mới thoát với mã 1. Doctor không bao giờ sao chép, đồng bộ hoặc sửa chữa. Để lấy chính bộ dữ liệu được tập hợp thay vì sức khỏe của nó, hãy sử dụng lệnh `openspec context`.

## Ngữ cảnh làm việc (bộ dữ liệu được tập hợp)

Tất cả các nội dung mà công việc này liên quan thông qua các khai báo OpenSpec, trong một bộ làm việc duy nhất: gốc OpenSpec và các kho lưu trữ mà nó tham chiếu.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

Bản tóm tắt JSON có thể được các agent sử dụng (mỗi kho lưu trữ tham chiếu có sẵn đều mang theo công thức lấy dữ liệu của nó; các thành phần chưa được giải quyết mang theo cùng các hướng dẫn sửa lỗi và nội dung hiển thị của lệnh doctor). Tham số `--code-workspace` còn ghi thêm một tệp không gian làm việc VS Code chứa gốc cùng các kho lưu trữ tham chiếu có sẵn (các thư mục `ref:<id>`) — đây là thao tác ghi duy nhất mà lệnh này thực hiện, sẽ bị từ chối nếu tệp đã tồn tại và không có tham số `--force`. Các thành phần không có sẵn được báo cáo, không bao giờ bị đoán mò.

"Ngữ cảnh làm việc" là bộ dữ liệu được tập hợp; trường `context:` trong tệp `openspec/config.yaml` là bối cảnh dự án được chèn vào các hướng dẫn — hai thứ hoàn toàn khác nhau. Lệnh `openspec doctor` trả lời xem bộ dữ liệu đó có khỏe không; lệnh `openspec context` trả lời bộ dữ liệu đó là gì.

## Bộ công việc cá nhân

> **Beta.** Các bộ công việc là một phần của bề mặt tính năng beta mới; các lệnh, cờ và định dạng tệp có thể thay đổi hình dạng giữa các bản phát hành. Để xem hướng dẫn từng bước, hãy xem [hướng dẫn cửa hàng](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Một bộ công việc là một chế độ xem có tên, mang tính cá nhân của các thư mục bạn làm việc cùng nhau — gốc kế hoạch cộng với bất kỳ thư mục nào khác bạn chọn — được lưu trên máy của bạn và mở lại theo tên trong công cụ của bạn. Nó hoàn toàn chỉ tồn tại cục bộ: không bao giờ được commit, không bao giờ được chia sẻ, không được tạo ra từ các khai báo, và xóa một bộ công việc không bao giờ ảnh hưởng đến bất kỳ thư mục thành viên nào.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` chạy một luồng hướng dẫn ngắn (hoặc nhận các cờ `--member` không tương tác; thành viên đầu tiên là thành viên chính — các phiên làm việc bắt đầu từ đó). `open` khởi chạy công cụ đã chọn: các trình soạn thảo (VS Code, Cursor) mở một cửa sổ với tất cả các thành viên và trả về; các tác nhân CLI (Claude Code, codex) chiếm quyền điều khiển terminal này như một phiên làm việc với tất cả các thành viên được liên kết và không có nhắc lệnh được điền sẵn, kết thúc khi bạn thoát. Một thư mục thành viên bị thiếu khi mở sẽ bị bỏ qua kèm theo ghi chú; các thư mục còn lại sẽ được mở. Tùy chọn công cụ đã lưu có thể ghi đè cho mỗi lần mở bằng cờ `--tool`.

Hỗ trợ công cụ mới chỉ là vấn đề cấu hình, không phải mã nguồn. Mỗi công cụ thuộc một trong hai kiểu khởi chạy — `workspace-file` (khởi chạy bằng tệp `.code-workspace` được tạo ra) hoặc `attach-dirs` (một cờ đính kèm cho mỗi thành viên) — và khóa `openers` trong tệp `config.json` toàn cục (mở nó bằng lệnh `openspec config edit`) dùng để thêm công cụ hoặc điều chỉnh các công cụ tích hợp sẵn theo từng trường:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Toàn bộ trạng thái của bộ công việc được lưu trong thư mục `worksets/` của thư mục dữ liệu toàn cục (các chế độ xem đã lưu cộng với các tệp `<name>.code-workspace` được tạo ra, được tạo lại mỗi khi mở); xóa thư mục này sẽ xóa toàn bộ dấu vết.

---

## Lệnh duyệt

### `openspec list`

Liệt kê các thay đổi hoặc đặc tả trong dự án của bạn.

```
openspec list [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--specs` | Liệt kê đặc tả thay vì thay đổi |
| `--changes` | Liệt kê các thay đổi (mặc định) |
| `--sort <order>` | Sắp xếp theo `recent` (mặc định) hoặc `name` |
| `--json` | Xuất ra dưới dạng JSON |

**Ví dụ:**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**Đầu ra (văn bản):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Hiển thị bảng điều khiển tương tác để khám phá các đặc tả và thay đổi.

```
openspec view
```

Mở một giao diện dựa trên terminal để điều hướng các đặc tả và thay đổi trong dự án của bạn.

---

### `openspec show`

Hiển thị chi tiết của một thay đổi hoặc đặc tả.

```
openspec show [item-name] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `item-name` | Không | Tên của thay đổi hoặc đặc tả (sẽ nhắc nếu bỏ trống) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--type <type>` | Chỉ định loại: `change` hoặc `spec` (tự động phát hiện nếu không có sự nhập nhằng) |
| `--json` | Xuất ra dưới dạng JSON |
| `--no-interactive` | Tắt các nhắc lệnh |

**Tùy chọn dành riêng cho thay đổi:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--deltas-only` | Chỉ hiển thị đặc tả delta (chế độ JSON) |

**Tùy chọn dành riêng cho đặc tả:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--requirements` | Chỉ hiển thị yêu cầu, loại trừ các kịch bản (chế độ JSON) |
| `--no-scenarios` | Loại trừ nội dung kịch bản (chế độ JSON) |
| `-r, --requirement <id>` | Hiển thị yêu cầu cụ thể theo chỉ số bắt đầu từ 1 (chế độ JSON) |

**Ví dụ:**

```bash
# Interactive selection
openspec show

# Show a specific change
openspec show add-dark-mode

# Show a specific spec
openspec show auth --type spec

# JSON output for parsing
openspec show add-dark-mode --json
```

---

## Lệnh xác thực

### `openspec validate`

Xác thực các thay đổi và đặc tả để tìm các vấn đề về cấu trúc.

```
openspec validate [item-name] [options]
```

Một thay đổi không có delta đặc tả nào sẽ không vượt qua xác thực trừ khi tệp `.openspec.yaml` của nó khai báo `skip_specs: true` (dành cho các công việc tái cấu trúc thuần túy, công cụ hoặc tài liệu — xem [Công thức 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)).

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `item-name` | Không | Mục cần xác thực cụ thể (sẽ nhắc nếu bỏ trống) |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--all` | Xác thực tất cả các thay đổi và đặc tả |
| `--changes` | Xác thực tất cả các thay đổi |
| `--specs` | Xác thực tất cả các đặc tả |
| `--type <type>` | Chỉ định loại khi tên có sự nhập nhằng: `change` hoặc `spec` |
| `--strict` | Bật chế độ xác thực nghiêm ngặt |
| `--json` | Xuất ra dưới dạng JSON |
| `--concurrency <n>` | Số lượng xác thực song song tối đa (mặc định: 6, hoặc biến môi trường `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Tắt các nhắc lệnh |

**Ví dụ:**

```bash
# Interactive validation
openspec validate

# Validate a specific change
openspec validate add-dark-mode

# Validate all changes
openspec validate --changes

# Validate everything with JSON output (for CI/scripts)
openspec validate --all --json

# Strict validation with increased parallelism
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

## Lệnh vòng đời

### `openspec archive`

Lưu trữ một thay đổi đã hoàn thành và gộp các đặc tả delta vào các đặc tả chính.

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
| `-y, --yes` | Bỏ qua các nhắc lệnh xác nhận |
| `--skip-specs` | Bỏ qua cập nhật đặc tả cho một lần chạy lưu trữ. Một thay đổi vĩnh viễn không có delta đặc tả nào nên khai báo `skip_specs: true` trong tệp `.openspec.yaml` của nó thay vì dùng cờ này — thay đổi đó sẽ được lưu trữ mà không cần cờ |
| `--no-validate` | Bỏ qua xác thực (cần xác nhận) |

**Ví dụ:**

```bash
# Interactive archive
openspec archive

# Archive specific change
openspec archive add-dark-mode

# Archive without prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
openspec archive update-ci-config --skip-specs
```

**Chức năng:**

1. Xác thực thay đổi (trừ khi dùng cờ `--no-validate`)
2. Nhắc xác nhận (trừ khi dùng cờ `--yes`)
3. Gộp các đặc tả delta vào `openspec/specs/`
4. Di chuyển thư mục thay đổi đến `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Lệnh quy trình làm việc

Các lệnh này hỗ trợ quy trình làm việc OPSX dựa trên sản phẩm phụ. Chúng hữu ích cả cho con người kiểm tra tiến độ và các tác nhân xác định các bước tiếp theo.

### `openspec new change`

Tạo thư mục thay đổi và siêu dữ liệu tùy chọn được commit trong gốc OpenSpec đã được giải quyết.

```bash
openspec new change <name> [options]
```

Tên thay đổi phải sử dụng kiểu kebab-case chữ thường. Chúng bắt đầu bằng một chữ cái thường, sau đó chỉ chứa chữ cái thường, số và dấu gạch ngang đơn. Chúng không được bắt đầu bằng số, chứa khoảng trắng, dấu gạch dưới, chữ cái hoa, dấu gạch ngang liên tiếp hoặc dấu gạch ngang ở đầu/cuối. Khi bao gồm mã vé bên ngoài, hãy thêm một tiền tố từ trước, ví dụ `ticket-123-add-notifications` thay vì `123-add-notifications`.

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--description <text>` | Mô tả để thêm vào tệp `index.md` |
| `--goal <text>` | Siêu dữ liệu mục tiêu tùy chọn để lưu cùng với thay đổi |
| `--schema <name>` | Lược đồ quy trình làm việc cần sử dụng |
| `--store <id>` | ID cửa hàng để sử dụng làm gốc OpenSpec (một cửa hàng là kho lưu trữ OpenSpec độc lập bạn đã đăng ký) |
| `--json` | Xuất ra JSON |

Ví dụ:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Hiển thị trạng thái hoàn thành sản phẩm phụ của một thay đổi.

```
openspec status [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--change <id>` | Tên thay đổi (sẽ nhắc nếu bỏ trống) |
| `--schema <name>` | Ghi đè lược đồ (tự động phát hiện từ cấu hình của thay đổi) |
| `--json` | Xuất ra dưới dạng JSON |

**Ví dụ:**

```bash
# Interactive status check
openspec status

# Status for specific change
openspec status --change add-dark-mode

# JSON for agent use
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

Một thay đổi khai báo `skip_specs: true` sẽ hiển thị giai đoạn đặc tả của nó là `[~] specs (skipped: change declares skip_specs)` và loại trừ nó khỏi tổng tiến độ.

**Đầu ra (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Nhận hướng dẫn nâng cao để tạo sản phẩm phụ hoặc áp dụng các nhiệm vụ. Được các tác nhân AI sử dụng để hiểu cần tạo gì tiếp theo.

```
openspec instructions [artifact] [options]
```

**Đối số:**

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `artifact` | Không | ID sản phẩm phụ: `proposal`, `specs`, `design`, `tasks`, hoặc `apply` |

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--change <id>` | Tên thay đổi (bắt buộc ở chế độ không tương tác) |
| `--schema <name>` | Ghi đè lược đồ |
| `--json` | Xuất ra dưới dạng JSON |

**Trường hợp đặc biệt:** Sử dụng `apply` làm sản phẩm phụ để nhận hướng dẫn thực hiện nhiệm vụ.

**Ví dụ:**

```bash
# Get instructions for next artifact
openspec instructions --change add-dark-mode

# Get specific artifact instructions
openspec instructions design --change add-dark-mode

# Get apply/implementation instructions
openspec instructions apply --change add-dark-mode

# JSON for agent consumption
openspec instructions design --change add-dark-mode --json
```

**Đầu ra bao gồm:**

- Nội dung mẫu cho sản phẩm phụ
- Ngữ cảnh dự án từ cấu hình
- Nội dung từ các sản phẩm phụ phụ thuộc
- Các quy tắc riêng cho từng sản phẩm phụ từ cấu hình

Đối với sản phẩm phụ bị bỏ qua thông qua `skip_specs: true`, đầu ra chỉ là cảnh báo (JSON thêm các trường `skipped`/`warning`) — sản phẩm phụ đó không được phép tạo.

---

### `openspec templates`

Hiển thị đường dẫn mẫu đã được giải quyết cho tất cả các sản phẩm phụ trong một lược đồ.

```
openspec templates [options]
```

**Tùy chọn:**

| Tùy chọn | Mô tả |
|--------|-------------|
| `--schema <name>` | Lược đồ cần kiểm tra (mặc định: `spec-driven`) |
| `--json` | Xuất ra dưới dạng JSON |

**Ví dụ:**

```bash
# Show template paths for default schema
openspec templates

# Show templates for custom schema
openspec templates --schema my-workflow

# JSON for programmatic use
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

Liệt kê các lược đồ quy trình làm việc có sẵn cùng mô tả và luồng sản phẩm phụ của chúng.

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
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

## Lệnh Schema

Các lệnh để tạo và quản lý schema quy trình làm việc tùy chỉnh.

### `openspec schema init`

Tạo một schema cục bộ dự án mới.

```
openspec schema init <name> [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Tên schema (định dạng kebab-case) |

**Options:**

| Option | Description |
|--------|-------------|
| `--description <text>` | Mô tả schema |
| `--artifacts <list>` | Danh sách ID artifact phân tách bằng dấu phẩy (mặc định: `proposal,specs,design,tasks`) |
| `--default` | Đặt làm schema mặc định của dự án |
| `--no-default` | Không hỏi đặt làm mặc định |
| `--force` | Ghi đè schema đã tồn tại |
| `--json` | Xuất ra định dạng JSON |

**Examples:**

```bash
# Tạo schema tương tác
openspec schema init research-first

# Tạo không tương tác với các artifact cụ thể
openspec schema init rapid \
  --description "Quy trình làm việc lặp lại nhanh" \
  --artifacts "proposal,tasks" \
  --default
```

**What it creates:**

```
openspec/schemas/<name>/
├── schema.yaml           # Định nghĩa schema
└── templates/
    ├── proposal.md       # Mẫu cho từng artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Sao chép một schema đã tồn tại vào dự án của bạn để tùy chỉnh.

```
openspec schema fork <source> [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `source` | Yes | Schema cần sao chép |
| `name` | No | Tên schema mới (mặc định: `<source>-custom`) |

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | Ghi đè đích đến đã tồn tại |
| `--json` | Xuất ra định dạng JSON |

**Example:**

```bash
# Fork schema spec-driven tích hợp sẵn
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Kiểm tra tính hợp lệ của cấu trúc và mẫu của schema.

```
openspec schema validate [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | Tên schema cần kiểm tra (nếu bỏ trống sẽ kiểm tra tất cả schema) |

**Options:**

| Option | Description |
|--------|-------------|
| `--verbose` | Hiển thị các bước kiểm tra chi tiết |
| `--json` | Xuất ra định dạng JSON |

**Example:**

```bash
# Kiểm tra một schema cụ thể
openspec schema validate my-workflow

# Kiểm tra tất cả các schema
openspec schema validate
```

---

### `openspec schema which`

Hiển thị nguồn gốc của schema (hữu ích để gỡ lỗi thứ tự ưu tiên).

```
openspec schema which [name] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | Tên schema |

**Options:**

| Option | Description |
|--------|-------------|
| `--all` | Liệt kê tất cả schema cùng nguồn gốc của chúng |
| `--json` | Xuất ra định dạng JSON |

**Example:**

```bash
# Kiểm tra nguồn gốc của một schema
openspec schema which spec-driven
```

**Output:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Thứ tự ưu tiên của schema:**

1. Dự án: `openspec/schemas/<name>/`
2. Người dùng: `~/.local/share/openspec/schemas/<name>/`
3. Gói: Các schema tích hợp sẵn

---

## Lệnh Cấu hình

### `openspec config`

Xem và chỉnh sửa cấu hình toàn cục của OpenSpec.

```
openspec config <subcommand> [options]
```

**Subcommands:**

| Subcommand | Description |
|------------|-------------|
| `path` | Hiển thị vị trí tệp cấu hình |
| `list` | Hiển thị tất cả cài đặt hiện tại |
| `get <key>` | Lấy một giá trị cụ thể |
| `set <key> <value>` | Đặt một giá trị |
| `unset <key>` | Xóa một khóa |
| `reset` | Đặt lại về mặc định |
| `edit` | Mở trong `$EDITOR` |
| `profile [preset]` | Cấu hình hồ sơ quy trình làm việc một cách tương tác hoặc thông qua preset |

**Examples:**

```bash
# Hiển thị vị trí tệp cấu hình
openspec config path

# Liệt kê tất cả cài đặt
openspec config list

# Lấy một giá trị cụ thể
openspec config get telemetry.enabled

# Đặt một giá trị
openspec config set telemetry.enabled false

# Đặt một giá trị chuỗi một cách rõ ràng
openspec config set user.name "My Name" --string

# Xóa một cài đặt tùy chỉnh
openspec config unset user.name

# Đặt kho lưu trữ mặc định ở cấp máy (gốc dự phòng khi không có --store, kho lưu trữ cục bộ, hoặc kho lưu trữ dự án: con trỏ được giải quyết)
openspec config set defaultStore team-plans

# Đặt lại toàn bộ cấu hình
openspec config reset --all --yes

# Chỉnh sửa cấu hình trong trình soạn thảo của bạn
openspec config edit

# Cấu hình hồ sơ với trình hướng dẫn dựa trên hành động
openspec config profile

# Preset nhanh: chuyển quy trình làm việc sang core (giữ nguyên chế độ delivery)
openspec config profile core
```

`openspec config profile` bắt đầu với bản tóm tắt trạng thái hiện tại, sau đó cho phép bạn chọn:
- Thay đổi delivery + workflows
- Chỉ thay đổi delivery
- Chỉ thay đổi workflows
- Giữ nguyên cài đặt hiện tại (thoát)

Nếu bạn giữ nguyên cài đặt hiện tại, không có thay đổi nào được ghi và không có lời nhắc cập nhật nào được hiển thị.
Nếu không có thay đổi cấu hình nhưng các tệp dự án hiện tại không đồng bộ với hồ sơ/delivery toàn cục của bạn, OpenSpec sẽ hiển thị cảnh báo và đề xuất `openspec update`.
Nhấn `Ctrl+C` cũng có thể hủy quy trình một cách sạch sẽ (không có stack trace) và thoát với mã `130`.
Trong danh sách kiểm tra quy trình làm việc, `[x]` có nghĩa là quy trình làm việc được chọn trong cấu hình toàn cục. Để áp dụng các lựa chọn này vào tệp dự án, hãy chạy `openspec update` (hoặc chọn `Áp dụng các thay đổi cho dự án này ngay?` khi được nhắc bên trong một dự án).

**Interactive examples:**

```bash
# Cập nhật chỉ delivery
openspec config profile
# choose: Change delivery only
# choose delivery: Skills only

# Cập nhật chỉ workflows
openspec config profile
# choose: Change workflows only
# toggle workflows in the checklist, then confirm
```

---

## Lệnh Tiện ích

### `openspec feedback`

Gửi phản hồi về OpenSpec. Tạo một issue trên GitHub.

```
openspec feedback <message> [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `message` | Yes | Nội dung phản hồi |

**Options:**

| Option | Description |
|--------|-------------|
| `--body <text>` | Mô tả chi tiết |

**Requirements:** GitHub CLI (`gh`) phải được cài đặt và xác thực.

**Example:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Quản lý hoàn thành lệnh shell cho CLI OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subcommands:**

| Subcommand | Description |
|------------|-------------|
| `generate [shell]` | Xuất script hoàn thành lệnh ra stdout |
| `install [shell]` | Cài đặt hoàn thành lệnh cho shell của bạn |
| `uninstall [shell]` | Xóa hoàn thành lệnh đã cài đặt |

**Supported shells:** `bash`, `zsh`, `fish`, `powershell`

**Examples:**

```bash
# Cài đặt hoàn thành lệnh (tự động phát hiện shell)
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

| Code | Meaning |
|------|---------|
| `0` | Thành công |
| `1` | Lỗi (kiểm tra tính hợp lệ thất bại, thiếu tệp, v.v.) |

---

## Biến Môi Trường

| Variable | Description |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Đặt thành `0` để tắt telemetry |
| `DO_NOT_TRACK` | Đặt thành `1` để tắt telemetry (tín hiệu DNT chuẩn) |
| `OPENSPEC_CONCURRENCY` | Độ đồng thời mặc định cho kiểm tra tính hợp lệ hàng loạt (mặc định: 6) |
| `EDITOR` hoặc `VISUAL` | Trình soạn thảo cho lệnh `openspec config edit` |
| `NO_COLOR` | Tắt đầu ra màu sắc khi được đặt |

---

## Related Documentation

- [Lệnh](commands.md) - Lệnh slash AI (`/opsx:propose`, `/opsx:apply`, v.v.)
- [Quy trình làm việc](workflows.md) - Các mẫu phổ biến và khi nào sử dụng từng lệnh
- [Tùy chỉnh](customization.md) - Tạo schema và mẫu tùy chỉnh
- [Bắt đầu](getting-started.md) - Hướng dẫn thiết lập lần đầu