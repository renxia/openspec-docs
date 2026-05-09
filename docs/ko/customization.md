# 커스터마이징

OpenSpec는 세 가지 수준의 커스터마이징을 제공합니다:

| 수준 | 기능 | 적합한 대상 |
|------|------|------------|
| **프로젝트 설정** | 기본값 설정, 컨텍스트/규칙 주입 | 대부분의 팀 |
| **커스텀 스키마** | 자체 워크플로우 아티팩트 정의 | 고유한 프로세스를 가진 팀 |
| **글로벌 오버라이드** | 모든 프로젝트에서 스키마 공유 | 파워 유저 |

---

## 프로젝트 설정

`openspec/config.yaml` 파일은 팀에 맞게 OpenSpec을 커스터마이징하는 가장 쉬운 방법입니다. 이를 통해:

- **기본 스키마 설정** - 모든 명령어에 `--schema`를 입력할 필요 없음
- **프로젝트 컨텍스트 주입** - AI가 기술 스택, 규칙 등을 인식
- **아티팩트별 규칙 추가** - 특정 아티팩트에 대한 커스텀 규칙

### 빠른 설정

```bash
openspec init
```

이 명령어는 대화형으로 설정 파일을 생성하는 과정을 안내합니다. 또는 수동으로 생성할 수도 있습니다:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### 작동 방식

**기본 스키마:**

```bash
# 설정 없이
openspec new change my-feature --schema spec-driven

# 설정 적용 시 - 스키마가 자동으로 적용됨
openspec new change my-feature
```

**컨텍스트 및 규칙 주입:**

아티팩트를 생성할 때, 설정된 컨텍스트와 규칙이 AI 프롬프트에 주입됩니다:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **컨텍스트**는 모든 아티팩트에 나타남
- **규칙**은 일치하는 아티팩트에만 나타남

### 스키마 해결 순서

OpenSpec이 스키마가 필요할 때, 다음 순서로 확인합니다:

1. CLI 플래그: `--schema <name>`
2. 변경 메타데이터 (변경 폴더 내 `.openspec.yaml`)
3. 프로젝트 설정 (`openspec/config.yaml`)
4. 기본값 (`spec-driven`)

---

## 커스텀 스키마

프로젝트 설정만으로 충분하지 않을 때, 완전히 커스텀된 워크플로우로 자체 스키마를 생성할 수 있습니다. 커스텀 스키마는 프로젝트의 `openspec/schemas/` 디렉토리에 위치하며 코드와 함께 버전 관리됩니다.

```text
your-project/
├── openspec/
│   ├── config.yaml        # 프로젝트 설정
│   ├── schemas/           # 커스텀 스키마 위치
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 변경 사항
└── src/
```

### 기존 스키마 포크

커스터마이징하는 가장 빠른 방법은 내장 스키마를 포크하는 것입니다:

```bash
openspec schema fork spec-driven my-workflow
```

이 명령어는 전체 `spec-driven` 스키마를 `openspec/schemas/my-workflow/`로 복사하여 자유롭게 편집할 수 있게 합니다.

**생성되는 구조:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # 워크플로우 정의
└── templates/
    ├── proposal.md       # 제안 아티팩트 템플릿
    ├── spec.md           # 명세 템플릿
    ├── design.md         # 설계 템플릿
    └── tasks.md          # 작업 템플릿
```

이제 `schema.yaml`을 편집하여 워크플로우를 변경하거나, 템플릿을 편집하여 AI가 생성하는 내용을 변경할 수 있습니다.

### 스키마 처음부터 생성

완전히 새로운 워크플로우를 만들려면:

```bash
# 대화형
openspec schema init research-first

# 비대화형
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### 스키마 구조

스키마는 워크플로우의 아티팩트와 그들 간의 의존성을 정의합니다:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # 제안이 존재해야 설계를 생성할 수 있음

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**주요 필드:**

| 필드 | 용도 |
|------|------|
| `id` | 고유 식별자, 명령어 및 규칙에서 사용 |
| `generates` | 출력 파일명 (`specs/**/*.md`와 같은 글롭 지원) |
| `template` | `templates/` 디렉토리 내 템플릿 파일 |
| `instruction` | 이 아티팩트 생성을 위한 AI 지시사항 |
| `requires` | 의존성 - 먼저 존재해야 하는 아티팩트 |

### 템플릿

템플릿은 AI를 안내하는 마크다운 파일입니다. 해당 아티팩트를 생성할 때 프롬프트에 주입됩니다.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

템플릿에는 다음이 포함될 수 있습니다:
- AI가 채워야 할 섹션 헤더
- AI를 위한 가이드가 포함된 HTML 주석
- 예상 구조를 보여주는 예제 형식

### 스키마 검증

커스텀 스키마를 사용하기 전에 검증하세요:

```bash
openspec schema validate my-workflow
```

이 명령어는 다음을 확인합니다:
- `schema.yaml` 구문이 올바른지
- 참조된 모든 템플릿이 존재하는지
- 순환 의존성이 없는지
- 아티팩트 ID가 유효한지

### 커스텀 스키마 사용

생성 후, 다음과 같이 스키마를 사용합니다:

```bash
# 명령어에서 지정
openspec new change feature --schema my-workflow

# 또는 config.yaml에서 기본값으로 설정
schema: my-workflow
```

### 스키마 해결 디버깅

어떤 스키마가 사용되고 있는지 확실하지 않은 경우, 다음으로 확인합니다:

```bash
# 특정 스키마가 어디서 해결되는지 확인
openspec schema which my-workflow

# 사용 가능한 모든 스키마 나열
openspec schema which --all
```

출력은 프로젝트, 사용자 디렉토리 또는 패키지에서 가져온 것인지 보여줍니다:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **참고:** OpenSpec은 프로젝트 간 공유를 위해 `~/.local/share/openspec/schemas/`에 사용자 수준 스키마도 지원하지만, 코드와 함께 버전 관리되는 `openspec/schemas/`의 프로젝트 수준 스키마를 권장합니다.

---

## 예제

### 빠른 반복 워크플로우

빠른 반복을 위한 최소한의 워크플로우:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### 리뷰 아티팩트 추가

기본 스키마를 포크하고 리뷰 단계를 추가합니다:

```bash
openspec schema fork spec-driven with-review
```

그런 다음 `schema.yaml`을 편집하여 다음을 추가합니다:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... 기존 tasks 설정 ...
    requires:
      - specs
      - design
      - review    # 이제 작업에도 리뷰가 필요함
```

---

## 커뮤니티 스키마

OpenSpec은 독립 저장소를 통해 배포되는 커뮤니티 유지 관리 스키마도 지원합니다. 이들은 OpenSpec을 다른 도구나 시스템과 통합하는 고유한 워크플로우를 제공하며, [github/spec-kit의 커뮤니티 확장 카탈로그](https://github.com/github/spec-kit/tree/main/extensions)가 spec-kit에 대해 작동하는 방식과 유사합니다.

커뮤니티 스키마는 OpenSpec 코어에 포함되지 않습니다 — 자체 저장소에 자체 릴리스 주기로 존재합니다. 사용하려면, 스키마 번들을 프로젝트의 `openspec/schemas/<schema-name>/` 디렉토리에 복사하세요 (각 저장소의 README에 설치 지침이 있습니다).

| 스키마 | 관리자 | 저장소 | 설명 |
|--------|--------|--------|------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | OpenSpec의 아티팩트 거버넌스를 [obra/superpowers](https://github.com/obra/superpowers) 실행 기술 (브레인스토밍, 계획 작성, 서브에이전트를 통한 TDD, 코드 리뷰, 마무리)과 통합합니다. Superpowers가 원래 다루지 않는 증거 기반 `retrospective` 아티팩트를 추가하여 간극을 메웁니다. |

> 커뮤니티 스키마를 기여하고 싶으신가요? 저장소 링크와 함께 이슈를 열거나, 이 테이블에 행을 추가하는 PR을 제출하세요.

---

## 관련 문서

- [CLI 참조: 스키마 명령어](cli.md#schema-commands) - 전체 명령어 문서