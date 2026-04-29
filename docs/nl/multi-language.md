# Meertalige Gids

Configureer OpenSpec om artefacten in andere talen dan Engels te genereren.

## Snelle Installatie

Voeg een taalinstructie toe aan uw `openspec/config.yaml`:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Dat is alles. Alle gegenereerde artefacten zijn nu in het Portugees.

## Taalvoorbeelden

### Portugees (Brazilië)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Spaans

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Chinees (Vereenvoudigd)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Japans

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Frans

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Duits

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Tips

### Omgaan met Technische Termen

Beslis hoe u met technische terminologie omgaat:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Combineren met Andere Context

Taalinstellingen werken naast uw andere projectcontext:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Verificatie

Om te controleren of uw taalconfiguratie werkt:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Gerelateerde Documentatie

- [Aanpassingsgids](./customization.md) - Opties voor projectconfiguratie
- [Workflows Gids](./workflows.md) - Volledige workflowdocumentatie