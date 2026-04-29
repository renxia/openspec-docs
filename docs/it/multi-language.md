# Guida Multilingue

Configura OpenSpec per generare artefatti in lingue diverse dall'inglese.

## Configurazione Rapida

Aggiungi un'istruzione sulla lingua al tuo file `openspec/config.yaml`:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Ecco fatto. Tutti gli artefatti generati saranno ora in portoghese.

## Esempi di Lingue

### Portoghese (Brasile)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Spagnolo

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Cinese (Semplificato)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Giapponese

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Francese

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Tedesco

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Suggerimenti

### Gestione dei Termini Tecnici

Decidi come gestire la terminologia tecnica:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Combinazione con Altro Contesto

Le impostazioni della lingua funzionano insieme al contesto del tuo progetto:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Verifica

Per verificare che la tua configurazione della lingua funzioni:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Documentazione Correlata

- [Guida alla Personalizzazione](./customization.md) - Opzioni di configurazione del progetto
- [Guida ai Flussi di Lavoro](./workflows.md) - Documentazione completa dei flussi di lavoro