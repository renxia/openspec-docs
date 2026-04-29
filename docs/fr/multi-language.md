# Guide Multilingue

Configurez OpenSpec pour générer des artefacts dans des langues autres que l'anglais.

## Configuration Rapide

Ajoutez une instruction de langue à votre fichier `openspec/config.yaml` :

```yaml
schema: spec-driven

context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.

  # Votre autre contexte de projet ci-dessous...
  Stack technique : TypeScript, React, Node.js
```

C'est tout. Tous les artefacts générés seront désormais en français.

## Exemples de Langues

### Portugais (Brésil)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Espagnol

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Chinois (Simplifié)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Japonais

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Français

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Allemand

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Conseils

### Gérer les Termes Techniques

Décidez comment traiter la terminologie technique :

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Combiner avec un Autre Contexte

Les paramètres de langue fonctionnent aux côtés de votre autre contexte de projet :

```yaml
schema: spec-driven

context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.

  Stack technique : TypeScript, React 18, Node.js 20
  Base de données : PostgreSQL avec Prisma ORM
```

## Vérification

Pour vérifier que votre configuration de langue fonctionne :

```bash
# Vérifiez les instructions - devrait afficher votre contexte de langue
openspec instructions proposal --change my-change

# La sortie inclura votre contexte de langue
```

## Documentation Connexe

- [Guide de Personnalisation](./customization.md) - Options de configuration du projet
- [Guide des Flux de Travail](./workflows.md) - Documentation complète des flux de travail