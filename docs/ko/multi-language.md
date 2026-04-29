# 다국어 가이드

OpenSpec를 설정하여 영어 이외의 언어로 산출물을 생성하는 방법을 설명합니다.

## 빠른 설정

`openspec/config.yaml` 파일에 언어 지시사항을 추가합니다:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

이것으로 끝입니다. 이제 모든 생성된 산출물은 포르투갈어로 작성됩니다.

## 언어 예시

### 포르투갈어 (브라질)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### 스페인어

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### 중국어 (간체)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### 일본어

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### 프랑스어

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### 독일어

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## 팁

### 기술 용어 처리

기술 용어를 어떻게 처리할지 결정합니다:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### 다른 컨텍스트와 결합

언어 설정은 다른 프로젝트 컨텍스트와 함께 작동합니다:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## 확인

언어 설정이 올바르게 작동하는지 확인하려면:

```bash
# 지시사항을 확인합니다 - 언어 컨텍스트가 표시되어야 합니다
openspec instructions proposal --change my-change

# 출력에 언어 컨텍스트가 포함됩니다
```

## 관련 문서

- [사용자 정의 가이드](./customization.md) - 프로젝트 구성 옵션
- [워크플로우 가이드](./workflows.md) - 전체 워크플로우 문서