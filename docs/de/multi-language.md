# Mehrsprachiger Leitfaden

Konfigurieren Sie OpenSpec, um Artefakte in anderen Sprachen als Englisch zu generieren.

## Schnelleinrichtung

Fügen Sie eine Sprachanweisung zu Ihrer `openspec/config.yaml` hinzu:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Das war's. Alle generierten Artefakte werden nun auf Portugiesisch ausgegeben.

## Sprachbeispiele

### Portugiesisch (Brasilien)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Spanisch

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Chinesisch (Vereinfacht)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Japanisch

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Französisch

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Deutsch

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Tipps

### Umgang mit Fachbegriffen

Entcheiden Sie, wie Sie mit Fachterminologie umgehen:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Kombination mit anderem Kontext

Spracheinstellungen wirken neben Ihrem anderen Projekt-Kontext:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Überprüfung

Um zu überprüfen, ob Ihre Sprachkonfiguration funktioniert:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Verwandte Dokumentation

- [Anpassungsleitfaden](./customization.md) - Projekt-Konfigurationsoptionen
- [Workflows-Leitfaden](./workflows.md) - Vollständige Workflow-Dokumentation