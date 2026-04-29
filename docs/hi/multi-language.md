# बहुभाषी मार्गदर्शिका

OpenSpec को अंग्रेजी के अलावा अन्य भाषाओं में कलाकृतियाँ उत्पन्न करने के लिए कॉन्फ़िगर करें।

## त्वरित सेटअप

अपने `openspec/config.yaml` में एक भाषा निर्देश जोड़ें:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

बस हो गया। सभी उत्पन्न कलाकृतियाँ अब पुर्तगाली में होंगी।

## भाषा उदाहरण

### पुर्तगाली (ब्राज़ील)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### स्पेनिश

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### चीनी (सरलीकृत)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### जापानी

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### फ़्रेंच

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### जर्मन

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## सुझाव

### तकनीकी शब्दों को संभालें

तकनीकी शब्दावली को कैसे संभालना है, यह तय करें:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### अन्य संदर्भ के साथ संयोजित करें

भाषा सेटिंग्स आपके अन्य परियोजना संदर्भ के साथ काम करती हैं:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## सत्यापन

अपनी भाषा कॉन्फ़िगरेशन काम कर रही है या नहीं, यह सत्यापित करने के लिए:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## संबंधित दस्तावेज़

- [अनुकूलन मार्गदर्शिका](./customization.md) - परियोजना कॉन्फ़िगरेशन विकल्प
- [वर्कफ़्लो मार्गदर्शिका](./workflows.md) - पूर्ण वर्कफ़्लो दस्तावेज़