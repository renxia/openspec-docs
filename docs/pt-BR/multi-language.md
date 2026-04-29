# Guia Multi-Idioma

Configure o OpenSpec para gerar artefatos em idiomas diferentes do inglês.

## Configuração Rápida

Adicione uma instrução de idioma ao seu `openspec/config.yaml`:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Pronto. Todos os artefatos gerados agora estarão em português.

## Exemplos de Idiomas

### Português (Brasil)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Espanhol

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Chinês (Simplificado)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Japonês

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Francês

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Alemão

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Dicas

### Lidar com Termos Técnicos

Decida como lidar com a terminologia técnica:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Combinar com Outro Contexto

As configurações de idioma funcionam junto com o outro contexto do seu projeto:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Verificação

Para verificar se sua configuração de idioma está funcionando:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Documentação Relacionada

- [Guia de Personalização](./customization.md) - Opções de configuração do projeto
- [Guia de Fluxos de Trabalho](./workflows.md) - Documentação completa dos fluxos de trabalho