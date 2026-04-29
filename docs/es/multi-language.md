# Guía Multiidioma

Configure OpenSpec para generar artefactos en idiomas distintos al inglés.

## Configuración Rápida

Añada una instrucción de idioma a su archivo `openspec/config.yaml`:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Eso es todo. Todos los artefactos generados ahora estarán en portugués.

## Ejemplos de Idiomas

### Portugués (Brasil)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Español

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Chino (Simplificado)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Japonés

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Francés

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Alemán

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Consejos

### Manejar Términos Técnicos

Decida cómo manejar la terminología técnica:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Combinar con Otro Contexto

La configuración de idioma funciona junto con el otro contexto de su proyecto:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Verificación

Para verificar que su configuración de idioma funciona:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Documentación Relacionada

- [Guía de Personalización](./customization.md) - Opciones de configuración del proyecto
- [Guía de Flujos de Trabajo](./workflows.md) - Documentación completa de los flujos de trabajo