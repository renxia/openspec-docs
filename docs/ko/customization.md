# 커스터마이징

OpenSpec는 세 가지 수준의 커스터마이징을 제공합니다:

| 수준 | 기능 | 적합한 대상 |
|-------|--------------|----------|
| **프로젝트 설정** | 기본값 설정, 컨텍스트/규칙 주입 | 대부분의 팀 |
| **커스텀 스키마** | 고유한 워크플로우 아티팩트 정의 | 고유한 프로세스를 가진 팀 |
| **전역 재정의** | 모든 프로젝트에서 스키마 공유 | 고급 사용자 |

---

## 프로젝트 설정

`openspec/config.yaml` 파일은 팀에 맞게 OpenSpec를 커스터마이징하는 가장 쉬운 방법입니다. 다음 기능을 제공합니다:

- **기본 스키마 설정** - 매 명령어마다 `--schema`를 생략할 수 있습니다
- **프로젝트 컨텍스트 주입** - AI가 기술 스택, 규칙 등 팀의 컨텍스트를 인식합니다
- **아티팩트별 규칙 추가** - 특정 아티팩트에 대한 커스텀 규칙을 설정할 수 있습니다

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

### 작동 원리

**기본 스키마:**

```bash
# 설정이 없는 경우
openspec new change my-feature --schema spec-driven

# 설정이 있는 경우 - 스키마가 자동으로 적용됩니다
openspec new change my-feature
```

**컨텍스트 및 규칙 주입:**

아티팩트를 생성할 때마다 컨텍스트와 규칙이 AI 프롬프트에 주입됩니다:

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

- **컨텍스트**는 모든 아티팩트에 포함됩니다
- **규칙**은 해당 아티팩트에만 적용됩니다

### 스키마 확인 순서

OpenSpec가 스키마를 필요로 할 때 다음 순서대로 확인합니다:

1. CLI 플래그: `--schema <name>`
2. 변경 메타데이터 (변경 폴더 내 `.openspec.yaml`)
3. 프로젝트 설정 (`openspec/config.yaml`)
4. 기본값 (`spec-driven`)

---

## 커스텀 스키마

프로젝트 설정만으로는 부족한 경우, 완전히 커스텀된 워크플로우로 자신만의 스키마를 생성할 수 있습니다. 커스텀 스키마는 프로젝트의 `openspec/schemas/` 디렉터리에 위치하며, 코드와 함께 버전 관리됩니다.

```text
your-project/
├── openspec/
│   ├── config.yaml        # 프로젝트 설정
│   ├── schemas/           # 커스텀 스키마가 위치하는 디렉터리
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 변경 사항
└── src/
```

### 기존 스키마 포크하기

커스터마이징하는 가장 빠른 방법은 내장 스키마를 포크하는 것입니다:

```bash
openspec schema fork spec-driven my-workflow
```

이 명령어는 전체 `spec-driven` 스키마를 `openspec/schemas/my-workflow/`로 복사하여 자유롭게 편집할 수 있게 합니다.

**생성되는 파일 구조:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # 워크플로우 정의
└── templates/
    ├── proposal.md       # 제안 아티팩트용 템플릿
    ├── spec.md           # 스펙 아티팩트용 템플릿
    ├── design.md         # 설계 아티팩트용 템플릿
    └── tasks.md          # 작업 아티팩트용 템플릿
```

이제 `schema.yaml`을 편집하여 워크플로우를 변경하거나, 템플릿을 편집하여 AI가 생성하는 내용을 변경할 수 있습니다.

### 스키마를 처음부터 생성하기

완전히 새로운 워크플로우의 경우:

```bash
# 대화형 모드
openspec schema init research-first

# 비대화형 모드
openspec schema init rapid \
  --description "빠른 반복 워크플로우" \
  --artifacts "proposal,tasks" \
  --default
```

### 스키마 구조

스키마는 워크플로우의 아티팩트와 아티팩트 간의 의존 관계를 정의합니다:

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
      - proposal    # 제안 문서가 존재해야 설계 문서를 생성할 수 있습니다

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
|-------|---------|
| `id` | 고유 식별자로, 명령어와 규칙에서 사용됩니다 |
| `generates` | 출력 파일명으로, `specs/**/*.md`와 같은 glob 패턴을 지원합니다 |
| `template` | `templates/` 디렉터리에 위치한 템플릿 파일입니다 |
| `instruction` | 이 아티팩트를 생성하기 위한 AI 지시사항입니다 |
| `requires` | 의존 관계로, 먼저 존재해야 하는 아티팩트를 지정합니다 |

### 템플릿

템플릿은 AI가 참고할 마크다운 파일입니다. 아티팩트를 생성할 때 프롬프트에 주입됩니다.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

템플릿에 포함할 수 있는 내용:
- AI가 작성해야 하는 섹션 헤더
- AI를 위한 안내가 포함된 HTML 주석
- 예상되는 구조를 보여주는 예시 형식

### 스키마 유효성 검사

커스텀 스키마를 사용하기 전에 유효성을 검사하세요:

```bash
openspec schema validate my-workflow
```

다음 내용을 검사합니다:
- `schema.yaml`의 구문이 올바른지
- 참조된 모든 템플릿이 존재하는지
- 순환 의존 관계가 없는지
- 아티팩트 ID가 유효한지

### 커스텀 스키마 사용하기

스키마를 생성한 후 다음 방법으로 사용할 수 있습니다:

```bash
# 명령어에서 직접 지정
openspec new change feature --schema my-workflow

# 또는 config.yaml에서 기본값으로 설정
schema: my-workflow
```

### 스키마 확인 디버깅

어떤 스키마가 사용되는지 확인하려면 다음 명령어를 사용하세요:

```bash
# 특정 스키마가 어디서 로드되는지 확인
openspec schema which my-workflow

# 사용 가능한 모든 스키마 목록 확인
openspec schema which --all
```

출력 결과를 통해 스키마가 프로젝트, 사용자 디렉터리, 패키지 중 어디서 로드되는지 확인할 수 있습니다:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **참고:** OpenSpec는 `~/.local/share/openspec/schemas/`에 사용자 수준의 스키마를 지원하여 여러 프로젝트에서 공유할 수 있지만, 코드와 함께 버전 관리할 수 있는 `openspec/schemas/`의 프로젝트 수준 스키마 사용을 권장합니다.

---

## 예시

### 빠른 반복 워크플로우

빠른 반복을 위한 최소한의 워크플로우입니다:

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

### 검토 아티팩트 추가하기

기본 스키마를 포크한 후 검토 단계를 추가하세요:

```bash
openspec schema fork spec-driven with-review
```

그 다음 `schema.yaml`을 편집하여 다음 내용을 추가하세요:

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
      - review    # 이제 tasks 생성에 review도 필요합니다
```

---

## 커뮤니티 스키마

OpenSpec는 독립 저장소를 통해 배포되는 커뮤니티에서 유지 관리하는 스키마도 지원합니다. 이 스키마는 spec-kit의 [github/spec-kit 커뮤니티 확장 카탈로그](https://github.com/github/spec-kit/tree/main/extensions)와 마찬가지로, OpenSpec를 다른 도구나 시스템과 통합하는 의견이 반영된 워크플로우를 제공합니다.

커뮤니티 스키마는 OpenSpec 코어에 포함되지 않으며, 각자의 저장소에서 독자적인 릴리스 주기를 가지고 유지 관리됩니다. 사용하려면 스키마 번들을 프로젝트의 `openspec/schemas/<schema-name>/` 디렉터리에 복사하면 됩니다 (각 저장소의 README에 설치 방법이 명시되어 있습니다).

| 스키마 | 유지 관리자 | 저장소 | 설명 |
|--------|-----------|-----------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | OpenSpec의 아티팩트 거버넌스를 [obra/superpowers](https://github.com/obra/superpowers)의 실행 스킬(브레인스토밍, 계획 작성, 서브에이전트를 통한 TDD, 코드 리뷰, 마무리)과 통합합니다. Superpowers가 기본적으로 지원하지 않는 증거 기반 `retrospective` 아티팩트를 추가하여 해당 공백을 메웁니다. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | PM 우선 워크플로우입니다. 구현 단계 이전에 [nanopm](https://github.com/nmrtn/nanopm)의 기획 파이프라인(감사 → 전략 → 로드맵 → PRD)을 실행합니다. 제품 기획을 OpenSpec의 스펙 기반 엔지니어링 워크플로우와 연결합니다. `.nanopm/` 디렉터리가 존재하는 경우 아티팩트를 해당 디렉터리에서 읽어옵니다 — 제안은 감사 결과를, 설계는 전략을, 작업은 PRD 분해 내용을 참조합니다. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | 기능 단위의 엔드투엔드 테스트 실행 가이드입니다. 각 기능마다 변경 불가능한 스펙, 변경 불가능한 작업 템플릿, 실행마다 타임스탬프가 기록된 실행 기록이 생성됩니다. 검증은 관찰 가능한 동작만 사용합니다(HTTP 상태, 응답 본문, 영구 저장된 상태 — 로그 부분 문자열은 절대 사용하지 않습니다); 각 실행 기록에는 UTC 기준 시작/종료 시간, 실행 시간, 최적 추정 LLM 토큰 사용량이 기록됩니다. |

> 커뮤니티 스키마에 기여하고 싶으신가요? 저장소 링크와 함께 이슈를 열거나, 이 표에 행을 추가하는 PR을 제출해주세요.

---

## 참고 자료

- [CLI 참조: 스키마 명령어](cli.md#schema-commands) - 전체 명령어 문서