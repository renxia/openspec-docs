# Tùy chỉnh

OpenSpec cung cấp ba cấp độ tùy chỉnh:

| Cấp độ | Chức năng | Phù hợp với |
|-------|------------|-------------|
| **Cấu hình dự án** | Đặt giá trị mặc định, chèn ngữ cảnh/quy tắc | Hầu hết các nhóm |
| **Schema tùy chỉnh** | Định nghĩa tác phẩm quy trình làm việc của riêng bạn | Các nhóm có quy trình làm việc độc đáo |
| **Ghi đè toàn cục** | Chia sẻ schema trên tất cả các dự án | Người dùng nâng cao |

---

## Cấu hình dự án

Tệp `openspec/config.yaml` là cách dễ nhất để tùy chỉnh OpenSpec cho nhóm của bạn. Nó cho phép bạn:

- **Đặt schema mặc định** - Bỏ qua cờ `--schema` trên mọi lệnh
- **Chèn ngữ cảnh dự án** - AI sẽ thấy ngăn xếp công nghệ, quy ước, v.v. của bạn
- **Thêm quy tắc theo từng tác phẩm** - Quy tắc tùy chỉnh cho các tác phẩm cụ thể

### Thiết lập nhanh

```bash
openspec init
```

Lệnh này sẽ hướng dẫn bạn tạo cấu hình một cách tương tác. Hoặc bạn có thể tạo thủ công:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Ngăn xếp công nghệ: TypeScript, React, Node.js, PostgreSQL
  Phong cách API: RESTful, được ghi chú trong docs/api.md
  Kiểm thử: Jest + React Testing Library
  Chúng tôi coi trọng khả năng tương thích ngược cho tất cả các API công cộng

rules:
  proposal:
    - Bao gồm kế hoạch khôi phục
    - Xác định các nhóm bị ảnh hưởng
  specs:
    - Sử dụng định dạng Given/When/Then
    - Tham khảo các mẫu hiện có trước khi tạo ra mẫu mới
```

### Cách hoạt động

**Schema mặc định:**

```bash
# Không có cấu hình
openspec new change my-feature --schema spec-driven

# Có cấu hình - schema được tự động áp dụng
openspec new change my-feature
```

**Chèn ngữ cảnh và quy tắc:**

Khi tạo bất kỳ tác phẩm nào, ngữ cảnh và quy tắc của bạn sẽ được chèn vào lời nhắc AI:

```xml
<context>
Ngăn xếp công nghệ: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Bao gồm kế hoạch khôi phục
- Xác định các nhóm bị ảnh hưởng
</rules>

<template>
[Mẫu tích hợp sẵn của schema]
</template>
```

- **Ngữ cảnh** xuất hiện trong TẤT CẢ các tác phẩm
- **Quy tắc** CHỈ xuất hiện đối với tác phẩm tương ứng

### Thứ tự giải quyết schema

Khi OpenSpec cần một schema, nó sẽ kiểm tra theo thứ tự sau:

1. Cờ CLI: `--schema <name>`
2. Siêu dữ liệu thay đổi (tệp `.openspec.yaml` trong thư mục thay đổi)
3. Cấu hình dự án (`openspec/config.yaml`)
4. Mặc định (`spec-driven`)

---

## Schema tùy chỉnh

Khi cấu hình dự án không đủ, bạn có thể tạo schema riêng với quy trình làm việc hoàn toàn tùy chỉnh. Các schema tùy chỉnh nằm trong thư mục `openspec/schemas/` của dự án và được kiểm soát phiên bản cùng với mã nguồn của bạn.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Cấu hình dự án
│   ├── schemas/           # Các schema tùy chỉnh nằm ở đây
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Các thay đổi của bạn
└── src/
```

### Sao chép (fork) một schema có sẵn

Cách nhanh nhất để tùy chỉnh là sao chép một schema tích hợp sẵn:

```bash
openspec schema fork spec-driven my-workflow
```

Lệnh này sao chép toàn bộ schema `spec-driven` vào thư mục `openspec/schemas/my-workflow/` nơi bạn có thể chỉnh sửa tự do.

**Bạn nhận được:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Định nghĩa quy trình làm việc
└── templates/
    ├── proposal.md       # Mẫu cho tác phẩm đề xuất
    ├── spec.md           # Mẫu cho đặc tả
    ├── design.md         # Mẫu cho thiết kế
    └── tasks.md          # Mẫu cho nhiệm vụ
```

Bây giờ chỉnh sửa tệp `schema.yaml` để thay đổi quy trình làm việc, hoặc chỉnh sửa các mẫu để thay đổi nội dung AI tạo ra.

### Tạo schema từ đầu

Đối với quy trình làm việc hoàn toàn mới:

```bash
# Tương tác
openspec schema init research-first

# Không tương tác
openspec schema init rapid \
  --description "Quy trình làm việc lặp lại nhanh" \
  --artifacts "proposal,tasks" \
  --default
```

### Cấu trúc schema

Một schema định nghĩa các tác phẩm trong quy trình làm việc của bạn và cách chúng phụ thuộc vào nhau:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: Quy trình làm việc tùy chỉnh của nhóm tôi

artifacts:
  - id: proposal
    generates: proposal.md
    description: Tài liệu đề xuất ban đầu
    template: proposal.md
    instruction: |
      Tạo một đề xuất giải thích TẠI SAO thay đổi này cần thiết.
      Tập trung vào vấn đề, không phải giải pháp.
    requires: []

  - id: design
    generates: design.md
    description: Thiết kế kỹ thuật
    template: design.md
    instruction: |
      Tạo tài liệu thiết kế giải thích CÁCH thực hiện.
    requires:
      - proposal    # Không thể tạo thiết kế cho đến khi đề xuất tồn tại

  - id: tasks
    generates: tasks.md
    description: Danh sách kiểm tra thực hiện
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Các trường chính:**

| Trường | Mục đích |
|-------|---------|
| `id` | Định danh duy nhất, được sử dụng trong lệnh và quy tắc |
| `generates` | Tên file đầu ra (hỗ trợ glob như `specs/**/*.md`) |
| `template` | Tệp mẫu trong thư mục `templates/` |
| `instruction` | Lời nhắc AI để tạo tác phẩm này |
| `requires` | Phụ thuộc - các tác phẩm phải tồn tại trước |

### Mẫu

Các mẫu là tệp markdown hướng dẫn AI. Chúng được chèn vào lời nhắc khi tạo tác phẩm tương ứng.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Giải thích động lực của thay đổi này. Vấn đề này giải quyết điều gì? -->

## What Changes

<!-- Mô tả những gì sẽ thay đổi. Cụ thể về các khả năng mới hoặc sửa đổi. -->

## Impact

<!-- Mã nguồn, API, phụ thuộc, hệ thống bị ảnh hưởng -->
```

Các mẫu có thể bao gồm:
- Tiêu đề phần mà AI cần điền vào
- Chú thích HTML có hướng dẫn cho AI
- Định dạng ví dụ hiển thị cấu trúc mong đợi

### Xác thực schema của bạn

Trước khi sử dụng schema tùy chỉnh, hãy xác thực nó:

```bash
openspec schema validate my-workflow
```

Lệnh này kiểm tra:
- Cú pháp tệp `schema.yaml` chính xác
- Tất cả các mẫu được tham chiếu đều tồn tại
- Không có phụ thuộc vòng tròn
- Các id tác phẩm hợp lệ

### Sử dụng schema tùy chỉnh của bạn

Sau khi tạo, bạn có thể sử dụng schema với:

```bash
# Chỉ định trên lệnh
openspec new change feature --schema my-workflow

# Hoặc đặt làm mặc định trong config.yaml
schema: my-workflow
```

### Gỡ lỗi giải quyết schema

Không chắc chắn đang sử dụng schema nào? Kiểm tra với:

```bash
# Xem schema cụ thể được giải quyết từ đâu
openspec schema which my-workflow

# Liệt kê tất cả các schema có sẵn
openspec schema which --all
```

Kết quả hiển thị xem schema đến từ dự án của bạn, thư mục người dùng hay gói phần mềm:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Lưu ý:** OpenSpec cũng hỗ trợ schema cấp người dùng tại thư mục `~/.local/share/openspec/schemas/` để chia sẻ trên nhiều dự án, nhưng các schema cấp dự án trong thư mục `openspec/schemas/` được khuyến nghị vì chúng được kiểm soát phiên bản cùng với mã nguồn của bạn.

---

## Ví dụ

### Quy trình làm việc lặp lại nhanh

Một quy trình làm việc tối thiểu cho các lần lặp nhanh:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Lặp lại nhanh với chi phí tối thiểu

artifacts:
  - id: proposal
    generates: proposal.md
    description: Đề xuất nhanh
    template: proposal.md
    instruction: |
      Tạo đề xuất ngắn gọn cho thay đổi này.
      Tập trung vào cái gì và tại sao, bỏ qua các đặc tả chi tiết.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Danh sách kiểm tra thực hiện
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Thêm tác phẩm đánh giá

Sao chép schema mặc định và thêm bước đánh giá:

```bash
openspec schema fork spec-driven with-review
```

Sau đó chỉnh sửa tệp `schema.yaml` để thêm:

```yaml
  - id: review
    generates: review.md
    description: Danh sách kiểm tra đánh giá trước khi thực hiện
    template: review.md
    instruction: |
      Tạo danh sách kiểm tra đánh giá dựa trên thiết kế.
      Bao gồm các cân nhắc về bảo mật, hiệu suất và kiểm thử.
    requires:
      - design

  - id: tasks
    # ... cấu hình nhiệm vụ hiện có ...
    requires:
      - specs
      - design
      - review    # Bây giờ nhiệm vụ cũng yêu cầu đánh giá
```

---

## Schema cộng đồng

OpenSpec cũng hỗ trợ các schema được cộng đồng duy trì, phân phối thông qua các kho lưu trữ độc lập. Các schema này cung cấp các quy trình làm việc có định hướng, tích hợp OpenSpec với các công cụ hoặc hệ thống khác, tương tự như [catalog tiện ích mở rộng cộng đồng của github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) hoạt động đối với spec-kit.

Các schema cộng đồng không được nhúng vào lõi OpenSpec — chúng nằm trong các kho lưu trữ riêng với chu kỳ phát hành riêng. Để sử dụng một schema, hãy sao chép gói schema vào thư mục `openspec/schemas/<tên-schema>/` của dự án (tệp README của mỗi kho lưu trữ có hướng dẫn cài đặt).

| Schema | Người duy trì | Kho lưu trữ | Mô tả |
|--------|--------------|-------------|---------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Tích hợp quản trị tác phẩm của OpenSpec với các kỹ năng thực thi của [obra/superpowers](https://github.com/obra/superpowers) (động não, viết kế hoạch, TDD qua subagent, xem xét mã nguồn, hoàn thành). Thêm tác phẩm `retrospective` ưu tiên bằng chứng, lấp đầy khoảng trống mà Superpowers không hỗ trợ sẵn. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Quy trình làm việc ưu tiên quản lý dự án. Chạy đường ống lập kế hoạch của [nanopm](https://github.com/nmrtn/nanopm) (kiểm toán → chiến lược → lộ trình → PRD) phía trước giai đoạn thực hiện. Kết nối lập kế hoạch sản phẩm với quy trình kỹ thuật theo đặc tả của OpenSpec. Các tác phẩm đọc từ thư mục `.nanopm/` nếu tồn tại — đề xuất lấy nguồn từ kiểm toán, thiết kế lấy nguồn từ chiến lược, nhiệm vụ lấy nguồn từ phân rã PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Sổ tay kiểm thử đầu cuối cấp khả năng. Mỗi khả năng nhận được một đặc tả không thay đổi, một mẫu nhiệm vụ không thay đổi và một bản ghi thực thi có dấu thời gian cho mỗi lần chạy. Các khẳng định chỉ là hành vi có thể quan sát được (mã trạng thái HTTP, nội dung phản hồi, trạng thái được lưu trữ — không bao giờ là chuỗi con trong nhật ký); mỗi lần chạy ghi lại thời gian bắt đầu/kết thúc UTC, thời lượng và ước tính mức tiêu thụ token LLM tốt nhất. |

> Muốn đóng góp một schema cộng đồng? Hãy mở một vấn đề với liên kết đến kho lưu trữ của bạn, hoặc gửi một PR thêm một dòng vào bảng này.

---

## Xem thêm

- [Tài liệu tham khảo CLI: Lệnh Schema](cli.md#schema-commands) - Tài liệu lệnh đầy đủ