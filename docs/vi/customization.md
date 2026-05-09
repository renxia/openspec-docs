# Tùy chỉnh

OpenSpec cung cấp ba cấp độ tùy chỉnh:

| Cấp độ | Chức năng | Phù hợp nhất cho |
|--------|-----------|-------------------|
| **Cấu hình dự án** | Đặt giá trị mặc định, chèn ngữ cảnh/quy tắc | Hầu hết các nhóm |
| **Schema tùy chỉnh** | Định nghĩa các thành phần quy trình làm việc của riêng bạn | Các nhóm có quy trình độc đáo |
| **Ghi đè toàn cục** | Chia sẻ schema cho tất cả dự án | Người dùng nâng cao |

---

## Cấu hình dự án

Tệp `openspec/config.yaml` là cách dễ nhất để tùy chỉnh OpenSpec cho nhóm của bạn. Nó cho phép bạn:

- **Đặt schema mặc định** - Bỏ qua `--schema` trên mỗi lệnh
- **Chèn ngữ cảnh dự án** - AI sẽ thấy ngăn xếp công nghệ, quy ước, v.v. của bạn
- **Thêm quy tắc cho từng thành phần** - Quy tắc tùy chỉnh cho các thành phần cụ thể

### Thiết lập nhanh

```bash
openspec init
```

Lệnh này sẽ hướng dẫn bạn tạo cấu hình một cách tương tác. Hoặc tạo thủ công:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### Cách thức hoạt động

**Schema mặc định:**

```bash
# Không có cấu hình
openspec new change my-feature --schema spec-driven

# Có cấu hình - schema được áp dụng tự động
openspec new change my-feature
```

**Chèn ngữ cảnh và quy tắc:**

Khi tạo bất kỳ thành phần nào, ngữ cảnh và quy tắc của bạn sẽ được chèn vào prompt của AI:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **Ngữ cảnh** xuất hiện trong TẤT CẢ các thành phần
- **Quy tắc** CHỈ xuất hiện cho thành phần phù hợp

### Thứ tự phân giải schema

Khi OpenSpec cần một schema, nó kiểm tra theo thứ tự sau:

1. Cờ CLI: `--schema <name>`
2. Metadata của thay đổi (`.openspec.yaml` trong thư mục thay đổi)
3. Cấu hình dự án (`openspec/config.yaml`)
4. Mặc định (`spec-driven`)

---

## Schema tùy chỉnh

Khi cấu hình dự án không đủ, hãy tạo schema của riêng bạn với quy trình làm việc hoàn toàn tùy chỉnh. Các schema tùy chỉnh nằm trong thư mục `openspec/schemas/` của dự án bạn và được kiểm soát phiên bản cùng với mã nguồn.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Cấu hình dự án
│   ├── schemas/           # Schema tùy chỉnh nằm ở đây
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Các thay đổi của bạn
└── src/
```

### Phân nhánh từ một schema có sẵn

Cách nhanh nhất để tùy chỉnh là phân nhánh từ một schema tích hợp sẵn:

```bash
openspec schema fork spec-driven my-workflow
```

Lệnh này sao chép toàn bộ schema `spec-driven` sang `openspec/schemas/my-workflow/` nơi bạn có thể chỉnh sửa tự do.

**Những gì bạn nhận được:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Định nghĩa quy trình làm việc
└── templates/
    ├── proposal.md       # Mẫu cho thành phần đề xuất
    ├── spec.md           # Mẫu cho đặc tả
    ├── design.md         # Mẫu cho thiết kế
    └── tasks.md          # Mẫu cho danh sách công việc
```

Bây giờ hãy chỉnh sửa `schema.yaml` để thay đổi quy trình làm việc, hoặc chỉnh sửa các mẫu để thay đổi những gì AI tạo ra.

### Tạo schema từ đầu

Để tạo một quy trình làm việc hoàn toàn mới:

```bash
# Tương tác
openspec schema init research-first

# Không tương tác
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Cấu trúc schema

Một schema định nghĩa các thành phần trong quy trình làm việc của bạn và cách chúng phụ thuộc lẫn nhau:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Các trường chính:**

| Trường | Mục đích |
|--------|----------|
| `id` | Định danh duy nhất, được sử dụng trong các lệnh và quy tắc |
| `generates` | Tên tệp đầu ra (hỗ trợ glob như `specs/**/*.md`) |
| `template` | Tệp mẫu trong thư mục `templates/` |
| `instruction` | Hướng dẫn cho AI để tạo thành phần này |
| `requires` | Các phụ thuộc - những thành phần nào phải tồn tại trước |

### Các mẫu

Các mẫu là các tệp markdown hướng dẫn AI. Chúng được chèn vào prompt khi tạo thành phần đó.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Các mẫu có thể bao gồm:
- Các tiêu đề phần mà AI cần điền vào
- Các chú thích HTML với hướng dẫn cho AI
- Các định dạng ví dụ cho thấy cấu trúc mong đợi

### Xác thực schema của bạn

Trước khi sử dụng schema tùy chỉnh, hãy xác thực nó:

```bash
openspec schema validate my-workflow
```

Lệnh này kiểm tra:
- Cú pháp `schema.yaml` là chính xác
- Tất cả các mẫu được tham chiếu đều tồn tại
- Không có phụ thuộc vòng
- Các ID thành phần là hợp lệ

### Sử dụng schema tùy chỉnh của bạn

Sau khi tạo, hãy sử dụng schema của bạn với:

```bash
# Chỉ định trên lệnh
openspec new change feature --schema my-workflow

# Hoặc đặt làm mặc định trong config.yaml
schema: my-workflow
```

### Gỡ lỗi phân giải schema

Không chắc chắn schema nào đang được sử dụng? Kiểm tra với:

```bash
# Xem một schema cụ thể được phân giải từ đâu
openspec schema which my-workflow

# Liệt kê tất cả các schema có sẵn
openspec schema which --all
```

Đầu ra cho biết nó đến từ dự án, thư mục người dùng hay gói của bạn:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Lưu ý:** OpenSpec cũng hỗ trợ schema cấp người dùng tại `~/.local/share/openspec/schemas/` để chia sẻ giữa các dự án, nhưng schema cấp dự án trong `openspec/schemas/` được khuyến nghị vì chúng được kiểm soát phiên bản cùng với mã nguồn của bạn.

---

## Ví dụ

### Quy trình làm việc lặp nhanh

Một quy trình làm việc tối giản cho các lần lặp nhanh:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Thêm một thành phần đánh giá

Phân nhánh từ mặc định và thêm một bước đánh giá:

```bash
openspec schema fork spec-driven with-review
```

Sau đó chỉnh sửa `schema.yaml` để thêm:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Schema cộng đồng

OpenSpec cũng hỗ trợ các schema do cộng đồng duy trì được phân phối thông qua các kho lưu trữ độc lập. Chúng cung cấp các quy trình làm việc có quan điểm tích hợp OpenSpec với các công cụ hoặc hệ thống khác, tương tự như cách [danh mục tiện ích mở rộng cộng đồng của github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) hoạt động cho spec-kit.

Các schema cộng đồng không được tích hợp vào lõi OpenSpec — chúng nằm trong các kho lưu trữ riêng với lịch phát hành riêng. Để sử dụng một schema, hãy sao chép gói schema vào thư mục `openspec/schemas/<schema-name>/` của dự án bạn (README của mỗi kho có hướng dẫn cài đặt).

| Schema | Người duy trì | Kho lưu trữ | Mô tả |
|--------|---------------|-------------|-------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Tích hợp quản trị thành phần của OpenSpec với các kỹ năng thực thi của [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, viết kế hoạch, TDD thông qua subagent, đánh giá mã, hoàn thiện). Thêm một thành phần `retrospective` ưu tiên bằng chứng lấp đầy khoảng trống mà Superpowers không tự nhiên bao phủ. |

> Bạn muốn đóng góp một schema cộng đồng? Hãy mở một issue với liên kết đến kho lưu trữ của bạn, hoặc gửi một PR thêm một hàng vào bảng này.

---

## Xem thêm

- [Tham khảo CLI: Các lệnh Schema](cli.md#schema-commands) - Tài liệu đầy đủ về các lệnh