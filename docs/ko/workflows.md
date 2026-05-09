# 워크플로우

이 가이드는 OpenSpec의 일반적인 워크플로우 패턴과 각 패턴의 사용 시기에 대해 다룹니다. 기본 설정은 [시작하기](getting-started.md)를 참조하세요. 명령어 참조는 [명령어](commands.md)를 확인하세요.

## 철학: 단계가 아닌 액션

기존 워크플로우는 계획, 구현, 완료와 같은 단계를 강제합니다. 하지만 실제 작업은 이러한 틀에 깔끔하게 맞지 않습니다.

OPSX는 다른 접근 방식을 취합니다:

```text
기존 방식 (단계 고정):

  계획 ────────► 구현 ────────► 완료
      │                    │
      │   "되돌아갈 수 없음"  │
      └────────────────────┘

OPSX (유동적 액션):

  제안 ──► 명세 ──► 설계 ──► 작업 ──► 구현
```

**핵심 원칙:**

- **단계가 아닌 액션** - 명령어는 갇혀 있는 단계가 아니라 수행할 수 있는 작업입니다
- **의존성은 가능성을 열어줌** - 다음에 필요한 것이 아니라 가능한 것을 보여줍니다

> **사용자 정의:** OPSX 워크플로우는 아티팩트 시퀀스를 정의하는 스키마에 의해 구동됩니다. 사용자 정의 스키마 생성에 대한 자세한 내용은 [사용자 정의](customization.md)를 참조하세요.

## 두 가지 모드

### 기본 빠른 경로 (`core` 프로필)

새 설치 시 기본값은 `core`이며, 다음 명령어를 제공합니다:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

일반적인 흐름:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### 확장/전체 워크플로우 (사용자 지정 선택)

스캐폴딩 및 빌드 명령어(`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`)를 명시적으로 사용하려면 다음을 실행하여 활성화하세요:

```bash
openspec config profile
openspec update
```

## 워크플로우 패턴 (확장 모드)

### 빠른 기능 구현

구현할 내용을 알고 있고 실행만 하면 되는 경우:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**대화 예시:**

```text
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**적합한 경우:** 소규모~중간 규모 기능, 버그 수정, 단순한 변경 사항.

### 탐색적 작업

요건이 불명확하거나 먼저 조사가 필요한 경우:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**대화 예시:**

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**적합한 경우:** 성능 최적화, 디버깅, 아키텍처 결정, 불명확한 요건.

### 병렬 변경 작업

여러 변경 사항을 동시에 작업하는 경우:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**대화 예시:**

```text
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**적합한 경우:** 병렬 작업 스트림, 긴급한 중단 작업, 팀 협업.

완료된 변경 사항이 여러 개인 경우 `/opsx:bulk-archive`를 사용하세요:

```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

일괄 아카이브는 여러 변경 사항이 동일한 스펙을 건드리는 경우를 감지하고, 실제 구현된 내용을 확인하여 충돌을 해결합니다.

### 변경 완료하기

권장되는 완료 흐름:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### 검증: 작업 확인하기

`/opsx:verify`는 세 가지 차원에서 아티팩트 대비 구현을 검증합니다:

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

**검증 항목:**

| 차원 | 검증 내용 |
|------|----------|
| 완전성 | 모든 작업 완료, 모든 요건 구현, 시나리오 커버 여부 |
| 정확성 | 구현이 스펙 의도와 일치하는지, 엣지 케이스 처리 여부 |
| 일관성 | 설계 결정이 코드에 반영되었는지, 패턴이 일관된지 |

검증은 아카이브를 차단하지 않지만, 먼저 해결해야 할 문제를 표면화합니다.

#### 아카이브: 변경 마무리하기

`/opsx:archive`는 변경을 완료하고 아카이브로 이동합니다:

```text
You: /opsx:archive

AI:  Archiving add-auth...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (12/12 tasks complete)

     Delta specs: Not yet synced to main
     → Would you like to sync now?

You: Yes

AI:  ✓ Synced specs to openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-auth/

     Change archived successfully.
```

아카이브 시 스펙이 동기화되지 않았으면 프롬프트를 표시합니다. 미완료 작업에 대해 차단하지는 않지만 경고를 표시합니다.

## 언제 무엇을 사용할지

### `/opsx:ff` vs `/opsx:continue`

| 상황 | 사용할 명령어 |
|------|--------------|
| 요건이 명확하고 구현 준비 완료 | `/opsx:ff` |
| 탐색 중이며 각 단계를 검토하고 싶은 경우 | `/opsx:continue` |
| 스펙 작성 전에 제안서를 반복 수정하고 싶은 경우 | `/opsx:continue` |
| 시간 압박이 있고 빠르게 진행해야 하는 경우 | `/opsx:ff` |
| 복잡한 변경이며 세밀한 제어가 필요한 경우 | `/opsx:continue` |

**경험 법칙:** 전체 범위를 미리 설명할 수 있으면 `/opsx:ff`를 사용하세요. 진행하면서 파악해 나가는 경우 `/opsx:continue`를 사용하세요.

### 업데이트할지 새로 시작할지

흔한 질문: 기존 변경 사항을 업데이트해도 되는 경우와 새로 시작해야 하는 경우는 언제인가요?

**기존 변경 사항을 업데이트하는 경우:**

- 동일한 의도, 개선된 실행
- 범위 축소 (MVP 먼저, 나중에 나머지)
- 학습 기반 수정 (코드베이스가 예상과 다른 경우)
- 구현 발견에 기반한 설계 조정

**새로운 변경 사항을 시작하는 경우:**

- 의도가 근본적으로 변경됨
- 범위가 완전히 다른 작업으로 확장됨
- 원래 변경 사항을 독립적으로 "완료"로 표시할 수 있음
- 패치가 명확하게 하기보다 혼란을 야기하는 경우

```text
                     ┌─────────────────────────────────────┐
                     │     Is this the same work?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Same intent?      >50% overlap?      Can original
          Same problem?     Same scope?        be "done" without
                 │                  │          these changes?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YES               NO YES           NO  NO              YES
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

**예시: "다크 모드 추가"**

- "커스텀 테마도 지원해야 합니다" → 새 변경 사항 (범위 확장)
- "시스템 환경설정 감지가 예상보다 어렵습니다" → 업데이트 (동일한 의도)
- "토글 먼저 출시하고, 환경설정은 나중에 추가합시다" → 업데이트 후 아카이브, 그 후 새 변경 사항

## 모범 사례

### 변경 사항을 집중적으로 유지하기

하나의 변경 사항에 하나의 논리적 작업 단위. "기능 X를 추가하고 Y도 리팩터링"하는 경우 두 개의 별도 변경 사항을 고려하세요.

**중요한 이유:**
- 검토와 이해가 더 쉬움
- 더 깔끔한 아카이브 이력
- 독립적으로 출시 가능
- 필요 시 롤백이 더 간단

### 불명확한 요건에는 `/opsx:explore` 사용

변경 사항을 확정하기 전에 문제 영역을 탐색하세요:

```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebase, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

탐색은 아티팩트를 생성하기 전에 사고를 명확하게 합니다.

### 아카이브 전에 검증하기

`/opsx:verify`를 사용하여 구현이 아티팩트와 일치하는지 확인하세요:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

변경 사항을 마무리하기 전에 불일치를 포착합니다.

### 변경 사항 이름을 명확하게 짓기

좋은 이름은 `openspec list`를 유용하게 만듭니다:

```text
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## 명령어 빠른 참조

전체 명령어 세부 정보 및 옵션은 [명령어](commands.md)를 참조하세요.

| 명령어 | 용도 | 사용 시점 |
|---------|---------|-------------|
| `/opsx:propose` | 변경 사항 + 계획 아티팩트 생성 | 빠른 기본 경로 (`core` 프로필) |
| `/opsx:explore` | 아이디어 검토 | 불명확한 요구사항, 조사 |
| `/opsx:new` | 변경 스캐폴딩 시작 | 확장 모드, 명시적 아티팩트 제어 |
| `/opsx:continue` | 다음 아티팩트 생성 | 확장 모드, 단계별 아티팩트 생성 |
| `/opsx:ff` | 모든 계획 아티팩트 생성 | 확장 모드, 명확한 범위 |
| `/opsx:apply` | 작업 구현 | 코드 작성이 준비된 상태 |
| `/opsx:verify` | 구현 검증 | 확장 모드, 아카이브 전 |
| `/opsx:sync` | 델타 스펙 병합 | 확장 모드, 선택 사항 |
| `/opsx:archive` | 변경 완료 | 모든 작업 완료 |
| `/opsx:bulk-archive` | 여러 변경 사항 아카이브 | 확장 모드, 병렬 작업 |

## 다음 단계

- [명령어](commands.md) - 옵션 포함 전체 명령어 참조
- [개념](concepts.md) - 스펙, 아티팩트 및 스키마 심화 학습
- [사용자 정의](customization.md) - 맞춤 워크플로우 생성