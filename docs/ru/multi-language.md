# Руководство по многоязычности

Настройте OpenSpec для генерации артефактов на языках, отличных от английского.

## Быстрая настройка

Добавьте инструкцию по языку в файл `openspec/config.yaml`:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Вот и все. Все генерируемые артефакты теперь будут на португальском языке.

## Примеры языков

### Португальский (Бразилия)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Испанский

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Китайский (упрощенный)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Японский

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Французский

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Немецкий

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Советы

### Обработка технических терминов

Решите, как обрабатывать техническую терминологию:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Комбинирование с другим контекстом

Настройки языка работают наряду с другими контекстными данными вашего проекта:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Проверка

Чтобы проверить, работает ли ваша языковая конфигурация:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Связанная документация

- [Руководство по настройке](./customization.md) - Параметры конфигурации проекта
- [Руководство по рабочим процессам](./workflows.md) - Полная документация по рабочим процессам