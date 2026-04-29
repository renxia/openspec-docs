# Hướng dẫn Đa Ngôn ngữ

Cấu hình OpenSpec để tạo các sản phẩm bằng ngôn ngữ khác ngoài tiếng Anh.

## Thiết lập nhanh

Thêm hướng dẫn ngôn ngữ vào tệp `openspec/config.yaml` của bạn:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Chỉ cần vậy thôi. Tất cả các sản phẩm được tạo ra giờ đây sẽ bằng tiếng Bồ Đào Nha.

## Ví dụ về ngôn ngữ

### Tiếng Bồ Đào Nha (Brazil)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Tiếng Tây Ban Nha

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Tiếng Trung (Giản thể)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Tiếng Nhật

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Tiếng Pháp

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Tiếng Đức

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Mẹo

### Xử lý Thuật ngữ Kỹ thuật

Quyết định cách xử lý thuật ngữ kỹ thuật:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Kết hợp với Ngữ cảnh Khác

Cài đặt ngôn ngữ hoạt động cùng với ngữ cảnh dự án khác của bạn:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Xác minh

Để xác minh cấu hình ngôn ngữ của bạn đang hoạt động:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Tài liệu Liên quan

- [Hướng dẫn Tùy chỉnh](./customization.md) - Các tùy chọn cấu hình dự án
- [Hướng dẫn Quy trình](./workflows.md) - Tài liệu quy trình đầy đủ