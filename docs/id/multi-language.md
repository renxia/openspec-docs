# Panduan Multi-Bahasa

Konfigurasikan OpenSpec untuk menghasilkan artefak dalam bahasa selain bahasa Inggris.

## Pengaturan Cepat

Tambahkan instruksi bahasa ke dalam `openspec/config.yaml` Anda:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Selesai. Semua artefak yang dihasilkan sekarang akan dalam bahasa Portugis.

## Contoh Bahasa

### Portugis (Brasil)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Spanyol

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Tionghoa (Sederhana)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Jepang

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Prancis

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Jerman

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Tips

### Menangani Istilah Teknis

Tentukan cara menangani istilah teknis:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Menggabungkan dengan Konteks Lain

Pengaturan bahasa bekerja bersama dengan konteks proyek lainnya:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Verifikasi

Untuk memverifikasi bahwa konfigurasi bahasa Anda berfungsi:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Dokumentasi Terkait

- [Panduan Kustomisasi](./customization.md) - Opsi konfigurasi proyek
- [Panduan Alur Kerja](./workflows.md) - Dokumentasi alur kerja lengkap