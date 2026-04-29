# Przewodnik wielojęzyczny

Skonfiguruj OpenSpec, aby generować artefakty w językach innych niż angielski.

## Szybka konfiguracja

Dodaj instrukcję językową do swojego pliku `openspec/config.yaml`:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

To wszystko. Wszystkie generowane artefakty będą teraz w języku portugalskim.

## Przykłady języków

### Portugalski (Brazylia)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Hiszpański

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Chiński (uproszczony)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Japoński

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Francuski

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Niemiecki

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Wskazówki

### Obsługa terminów technicznych

Zdecyduj, jak obsługiwać terminologię techniczną:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Łączenie z innym kontekstem

Ustawienia językowe działają wraz z innym kontekstem projektu:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Weryfikacja

Aby sprawdzić, czy konfiguracja językowa działa poprawnie:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Powiązana dokumentacja

- [Przewodnik dostosowywania](./customization.md) - Opcje konfiguracji projektu
- [Przewodnik po przepływach pracy](./workflows.md) - Pełna dokumentacja przepływów pracy