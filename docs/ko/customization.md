# 사용자 지정

OpenSpec는 세 가지 수준의 사용자 지정을 제공합니다:

| 수준 | 기능 | 대상 |
|------|------|------|
| **프로젝트 설정** | 기본값 설정, 컨텍스트/규칙 주입 | 대부분의 팀 |
| **사용자 지정 스키마** | 고유한 워크플로우 아티팩트 정의 | 고유한 프로세스를 가진 팀 |
| **글로벌 오버라이드** | 모든 프로젝트에 걸쳐 스키마 공유 | 파워 사용자 |

---

## 프로젝트 설정

`openspec/config.yaml` 파일은 팀을 위해 OpenSpec를 사용자 지정하는 가장 쉬운 방법입니다. 이를 통해 다음을 수행할 수 있습니다:

- **기본 스키마 설정** - 모든 명령에서 `--schema` 옵션을 건너뛸 수 있습니다
- **프로젝트 컨텍스트 주입** - AI가 기술 스택, 관례 등을 인식합니다
- **아티팩트별 규칙 추가** - 특정 아티팩트에 대한 사용자 지정 규칙

### 빠른 설정

```bash
openspec init
```

이 명령은 대화형으로 설정 파일을 생성하도록 안내합니다. 또는 수동으로 생성할 수도 있습니다:

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
# 설정 파일 없이
openspec new change my-feature --schema spec-driven

# 설정 파일 사용 시 - 스키마가 자동으로 적용됨
openspec new change my-feature
```

**컨텍스트 및 규칙 주입:**

아티팩트를 생성할 때, 설정한 컨텍스트와 규칙이 AI 프롬프트에 주입됩니다:

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
[스키마의 내장 템플릿]
</template>
```

- **컨텍스트**는 모든 아티팩트에 표시됩니다
- **규칙**은 해당 아티팩트에만 표시됩니다

### 스키마 해석 순서

OpenSpec가 스키마가 필요할 때, 다음 순서로 확인합니다:

1. CLI 플래그: `--schema <name>`
2. 변경사항 메타데이터 (변경사항 폴더의 `.openspec.yaml`)
3. 프로젝트 설정 (`openspec/config.yaml`)
4. 기본값 (`spec-driven`)

---

## 사용자 지정 스키마

프로젝트 설정으로 충분하지 않을 때, 완전히 사용자 지정된 워크플로우로 자체 스키마를 만들 수 있습니다. 사용자 지정 스키마는 프로젝트의 `openspec/schemas/` 디렉토리에 위치하며, 코드와 함께 버전 관리됩니다.

```text
your-project/
├── openspec/
│   ├── config.yaml        # 프로젝트 설정
│   ├── schemas/           # 사용자 지정 스키마 위치
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 변경사항
└── src/
```

### 기존 스키마 포크

가장 빠른 사용자 지정 방법은 내장 스키마를 포크하는 것입니다:

```bash
openspec schema fork spec-driven my-workflow
```

이 명령은 `spec-driven` 스키마 전체를 `openspec/schemas/my-workflow/`로 복사하여 자유롭게 편집할 수 있게 합니다.

**생성되는 파일:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # 워크플로우 정의
└── templates/
    ├── proposal.md       # 제안 아티팩트용 템플릿
    ├── spec.md           # 스펙용 템플릿
    ├── design.md         # 설계용 템플릿
    └── tasks.md          # 작업용 템플릿
```

이제 `schema.yaml`을 편집하여 워크플로우를 변경하거나, 템플릿을 편집하여 AI가 생성하는 내용을 변경할 수 있습니다.

### 처음부터 스키마 생성

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

스키마는 워크플로우의 아티팩트와 그 의존성을 정의합니다:

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
| `id` | 고유 식별자, 명령 및 규칙에서 사용 |
| `generates` | 출력 파일명 (예: `specs/**/*.md`와 같은 글롭 지원) |
| `template` | `templates/` 디렉토리의 템플릿 파일 |
| `instruction` | 이 아티팩트를 생성하기 위한 AI 지침 |
| `requires` | 의존성 - 먼저 존재해야 하는 아티팩트 |

### 템플릿

템플릿은 AI를 안내하는 마크다운 파일입니다. 해당 아티팩트를 생성할 때 프롬프트에 주입됩니다.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- 변경 동기를 설명합니다. 이 변경이 어떤 문제를 해결합니까? -->

## What Changes

<!-- 변경되는 내용을 설명합니다. 새로운 기능이나 수정 사항을 구체적으로 기술합니다. -->

## Impact

<!-- 영향을 받는 코드, API, 의존성, 시스템 -->
```

템플릿에는 다음을 포함할 수 있습니다:
- AI가 채워야 하는 섹션 헤더
- AI를 위한 안내가 포함된 HTML 주석
- 예상 구조를 보여주는 예시 형식

### 스키마 검증

사용자 지정 스키마를 사용하기 전에 검증합니다:

```bash
openspec schema validate my-workflow
```

이 명령은 다음을 확인합니다:
- `schema.yaml` 구문이 올바른지
- 참조된 모든 템플릿이 존재하는지
- 순환 의존성이 없는지
- 아티팩트 ID가 유효한지

### 사용자 지정 스키마 사용

생성 후 다음 명령으로 스키마를 사용합니다:

```bash
# 명령에서 지정
openspec new change feature --schema my-workflow

# 또는 config.yaml에서 기본값으로 설정
schema: my-workflow
```

### 스키마 해석 디버깅

어떤 스키마가 사용되는지 확실하지 않을 때 확인합니다:

```bash
# 특정 스키마가 어디서 해석되는지 확인
openspec schema which my-workflow

# 사용 가능한 모든 스키마 나열
openspec schema which --all
```

출력은 스키마가 프로젝트, 사용자 디렉토리, 또는 패키지에서 오는지 보여줍니다:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **참고:** OpenSpec는 `~/.local/share/openspec/schemas/`에 사용자 수준 스키마도 지원하여 프로젝트 간에 공유할 수 있지만, 프로젝트 수준 스키마(`openspec/schemas/`)가 코드와 함께 버전 관리되므로 이를 권장합니다.

---

## 예시

### 빠른 반복 워크플로우

빠른 반복을 위한 최소 워크플로우:

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

### 검토 아티팩트 추가

기본 스키마를 포크하고 검토 단계를 추가합니다:

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
      - review    # 이제 tasks는 review도 필요로 함
```

---

## 참고 자료

- [CLI 참조: 스키마 명령](cli.md#schema-commands) - 전체 명령 문서