# Tùy chỉnh

OpenSpec cung cấp ba cấp độ tùy chỉnh:

| Cấp độ | Chức năng | Phù hợp với |
|-------|--------------|----------|
| **Cấu hình Dự án** | Đặt mặc định, chèn ngữ cảnh/quy tắc | Đội nhóm thông thường |
| **Schema Tùy chỉnh** | Định nghĩa quy trình làm việc riêng | Đội nhóm có quy trình đặc thù |
| **Ghi đè Toàn cục** | Chia sẻ schema cho tất cả dự án | Người dùng nâng cao |

---

## Cấu hình Dự án

Tệp `openspec/config.yaml` là cách dễ nhất để tùy chỉnh OpenSpec cho đội nhóm của bạn. Nó cho phép bạn:

- **Đặt schema mặc định** - Bỏ qua `--schema` trong mỗi lệnh
- **Chèn ngữ cảnh dự án** - AI thấy được ngăn xếp công nghệ, quy ước, v.v.
- **Thêm quy tắc cho từng artifact** - Quy tắc tùy chỉnh cho các artifact cụ thể

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

# Có cấu hình - schema được tự động chọn
openspec new change my-feature
```

**Chèn ngữ cảnh và quy tắc:**

Khi tạo bất kỳ artifact nào, ngữ cảnh và quy tắc của bạn được chèn vào prompt của AI:

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

- **Ngữ cảnh** xuất hiện trong TẤT CẢ các artifact
- **Quy tắc** CHỈ xuất hiện cho artifact tương ứng

### Thứ tự giải quyết Schema

Khi OpenSpec cần một schema, nó kiểm tra theo thứ tự sau:

1. Cờ CLI: `--schema <name>`
2. Metadata của thay đổi (`.openspec.yaml` trong thư mục thay đổi)
3. Cấu hình dự án (`openspec/config.yaml`)
4. Mặc định (`spec-driven`)

---

## Schema Tùy chỉnh

Khi cấu hình dự án không đủ, hãy tạo schema của riêng bạn với quy trình làm việc hoàn toàn tùy chỉnh. Các schema tùy chỉnh nằm trong thư mục `openspec/schemas/` của dự án và được quản lý phiên bản cùng với mã nguồn của bạn.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### Fork một Schema hiện có

Cách nhanh nhất để tùy chỉnh là fork một schema có sẵn:

```bash
openspec schema fork spec-driven my-workflow
```

Lệnh này sao chép toàn bộ schema `spec-driven` vào `openspec/schemas/my-workflow/`, nơi bạn có thể chỉnh sửa tự do.

**Kết quả nhận được:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

Bây giờ, hãy chỉnh sửa `schema.yaml` để thay đổi quy trình làm việc, hoặc chỉnh sửa các template để thay đổi những gì AI tạo ra.

### Tạo Schema từ đầu

Để có một quy trình làm việc hoàn toàn mới:

```bash
# Tương tác
openspec schema init research-first

# Không tương tác
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Cấu trúc Schema

Schema định nghĩa các artifact trong quy trình làm việc của bạn và cách chúng phụ thuộc lẫn nhau:

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
|-------|---------|
| `id` | Định danh duy nhất, được sử dụng trong lệnh và quy tắc |
| `generates` | Tên tệp đầu ra (hỗ trợ glob như `specs/**/*.md`) |
| `template` | Tệp template trong thư mục `templates/` |
| `instruction` | Hướng dẫn cho AI khi tạo artifact này |
| `requires` | Các phụ thuộc - artifact nào phải tồn tại trước |

### Template

Template là các tệp markdown hướng dẫn AI. Chúng được chèn vào prompt khi tạo artifact đó.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Template có thể bao gồm:
- Các tiêu đề phần mà AI cần điền vào
- Nhận xét HTML chứa hướng dẫn cho AI
- Các ví dụ định dạng hiển thị cấu trúc mong đợi

### Xác thực Schema của bạn

Trước khi sử dụng schema tùy chỉnh, hãy xác thực nó:

```bash
openspec schema validate my-workflow
```

Lệnh này kiểm tra:
- Cú pháp `schema.yaml` chính xác
- Tất cả các template được tham chiếu tồn tại
- Không có phụ thuộc vòng lặp
- Các ID artifact hợp lệ

### Sử dụng Schema Tùy chỉnh của bạn

Sau khi tạo, sử dụng schema của bạn với:

```bash
# Chỉ định trong lệnh
openspec new change feature --schema my-workflow

# Hoặc đặt làm mặc định trong config.yaml
schema: my-workflow
```

### Gỡ lỗi Giải quyết Schema

Không chắc chắn schema nào đang được sử dụng? Kiểm tra với:

```bash
# Xem một schema cụ thể được giải quyết từ đâu
openspec schema which my-workflow

# Liệt kê tất cả các schema có sẵn
openspec schema which --all
```

Kết quả hiển thị cho biết nó đến từ dự án, thư mục người dùng hay gói:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Lưu ý:** OpenSpec cũng hỗ trợ các schema cấp người dùng tại `~/.local/share/openspec/schemas/` để chia sẻ giữa các dự án, nhưng các schema cấp dự án trong `openspec/schemas/` được khuyến nghị vì chúng được quản lý phiên bản cùng với mã nguồn của bạn.

---

## Ví dụ

### Quy trình làm việc T迭代 nhanh

Quy trình tối giản cho các lần lặp nhanh:

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

### Thêm một Artifact Kiểm tra

Fork schema mặc định và thêm bước kiểm tra:

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

## Xem thêm

- [Tham chiếu CLI: Lệnh Schema](cli.md#schema-commands) - Tài liệu đầy đủ về lệnh