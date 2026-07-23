# 워크플로우

이 가이드는 OpenSpec의 일반적인 워크플로우 패턴과 각 패턴을 사용해야 하는 시점을 다룹니다. 기본 설정은 [시작하기](getting-started.md)를 참고하세요. 명령어 참조는 [명령어](commands.md)를 참고하세요.

## 철학: 행동, 단계가 아님

기존 워크플로우는 계획, 구현, 완료의 단계를 거치도록 강제합니다. 하지만 실제 업무는 이런 단계에 딱 맞게 들어맞지 않습니다.

OPSX는 다음과 같은 다른 접근 방식을 사용합니다:

```text
전통적 (단계 고정):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "돌아갈 수 없음"  │
      └────────────────────┘

OPSX (유동적 행동):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**핵심 원칙:**

- **행동, 단계가 아님** - 명령어는 당신이 수행할 수 있는 행동이며, 갇혀 버리는 단계가 아닙니다
- **의존성은 가능하게 하는 요소입니다** - 의존성은 다음에 필요한 작업이 무엇인지가 아니라, 어떤 작업이 가능한지 보여줍니다

> **사용자 정의:** OPSX 워크플로우는 아티팩트 순서를 정의하는 스키마에 의해 구동됩니다. 사용자 정의 스키마 생성에 대한 자세한 내용은 [사용자 정의](customization.md)를 참고하세요.

## 두 가지 모드

### 기본 빠른 경로 (`core` 프로필)

새 설치 시 기본으로 `core`를 사용하며, 다음 기능을 제공합니다:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

일반적인 흐름:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (optional)
```

#### 탐색으로 시작하세요 (형성해야 할 습관)

`/opsx:explore`는 고급 추가 기능이 아닌 기본 프로필의 일부입니다. 아직 계획이 없지만 문제가 있을 때 가장 먼저 취해야 할 행동으로, AI 어시스턴트와 함께할 때는 대부분의 경우에 해당합니다.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our search results feel stale. I'm not sure if it's caching,
     indexing, or the query itself.

AI:  Let me look... [reads the search service and cache layer]
     It's the index: it only rebuilds nightly, so edits don't show
     up until the next day. Two options: rebuild on write (simple,
     more load) or a short-TTL cache invalidation (more moving parts,
     less load). Given your write volume is low, rebuild-on-write is
     the cleaner fix. Want to scope it?

You: Yes.

You: /opsx:propose rebuild-search-index-on-write
```

탐색은 아티팩트를 생성하지도 않고 코드를 작성하지도 않습니다. 막연한 걱정을 정확한 변경 사항으로 바꿔주는 부담 없는 대화일 뿐이므로, 이후 제안이 더욱 명확해집니다. 이미 원하는 내용을 정확히 알고 계신가요? 탐색을 건너뛰고 바로 `/opsx:propose`로 이동하세요. 전체 가이드: [Explore First](explore.md).

### 확장/전체 워크플로우 (커스텀 선택)

스캐폴드 및 빌드 명령어(`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`)를 명시적으로 사용하려면 다음 명령어로 활성화하세요:

```bash
openspec config profile
openspec update
```

## 워크플로우 패턴 (확장 모드)

### 빠른 기능 개발

구축할 내용을 알고 있고 실행만 하면 될 때:

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

**적합한 경우:** 중소형 기능, 버그 수정, 간단한 변경 사항.

### 탐색적 접근

요구사항이 불분명하거나 먼저 조사가 필요할 때:

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

**적합한 경우:** 성능 최적화, 디버깅, 아키텍처 결정, 불분명한 요구사항.

### 병렬 변경

여러 변경 사항을 동시에 작업할 때:

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

**적합한 경우:** 병렬 작업 스트림, 긴급한 방해 요소, 팀 협업.

여러 변경 사항을 완료했을 때는 `/opsx:bulk-archive`를 사용하세요:

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

일괄 아카이빙은 여러 변경 사항이 동일한 스펙을 수정할 경우 감지하여 실제 구현된 내용을 확인하여 충돌을 해결합니다.

### 변경 사항 완료하기

권장 완료 흐름:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### 검증: 작업 확인

`/opsx:verify`는 아티팩트와 비교하여 구현을 세 가지 차원에서 검증합니다:

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
|-----------|------------------|
| 완전성 | 모든 작업 완료, 모든 요구사항 구현, 시나리오 포함 |
| 정확성 | 구현이 스펙 의도와 일치, 엣지 케이스 처리 |
| 일관성 | 설계 결정이 코드에 반영, 패턴 일관성 유지 |

검증은 아카이빙을 차단하지 않지만, 먼저 처리하는 것이 좋은 문제점을 표시해줍니다.

#### 아카이빙: 변경 사항 마무리

`/opsx:archive`는 변경 사항을 완료하고 아카이브로 이동합니다:

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

아카이빙은 스펙이 동기화되지 않은 경우 프롬프트를 표시합니다. 미완료 작업으로 인해 차단하지는 않지만 경고 메시지를 표시합니다.

## 사용 시기

### `/opsx:ff` 대 `/opsx:continue`

| 상황 | 사용 |
|-----------|-----|
| 요구사항이 명확하고 구축 준비가 완료됨 | `/opsx:ff` |
| 탐색 중이며 각 단계를 검토하고 싶음 | `/opsx:continue` |
| 스펙 작성 전에 제안을 반복하고 싶음 | `/opsx:continue` |
| 시간 압박이 있어 빠르게 진행해야 함 | `/opsx:ff` |
| 복잡한 변경으로 제어가 필요함 | `/opsx:continue` |

**경험 법칙:** 전체 범위를 미리 설명할 수 있다면 `/opsx:ff`를 사용하세요. 진행하면서 파악하는 중이라면 `/opsx:continue`를 사용하세요.

### 업데이트 vs 새로 시작하기

흔히 하는 질문: 기존 변경 사항을 업데이트하는 것이 적절한 경우는 언제이고, 새로 시작해야 하는 경우는 언제인가요?

**다음 경우 기존 변경 사항을 업데이트하세요:**
- 의도는 같으나 실행 방법을 개선하는 경우
- 범위가 축소되는 경우 (먼저 MVP를 구현하고 나머지는 나중에)
- 학습을 통한 수정 (코드베이스가 예상과 다를 때)
- 구현 과정에서 발견한 내용을 바탕으로 설계를 조정하는 경우

**다음 경우 새 변경 사항을 시작하세요:**
- 의도가 근본적으로 변경된 경우
- 범위가 완전히 다른 작업으로 확장된 경우
- 원본 변경 사항을 단독으로 "완료"로 표기할 수 있는 경우
- 패치가 명확하게 하기보다 혼란을 주는 경우

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
- "커스텀 테마도 지원해야 함" → 새 변경 사항 (범위 확장)
- "시스템 기본 설정 감지가 예상보다 어려움" → 업데이트 (같은 의도)
- "먼저 토글을 출시하고 나중에 기본 설정을 추가하자" → 업데이트 후 아카이빙, 그 다음 새 변경 사항

## 모범 사례

### 변경 사항을 집중적으로 유지하세요

변경 사항당 논리적인 작업 단위 하나를 유지하세요. "기능 X 추가와 Y 리팩토링"을 동시에 진행하는 경우, 두 개의 별도 변경 사항으로 고려하세요.

**중요한 이유:**
- 검토하고 이해하기 쉬움
- 더 깔끔한 아카이브 기록
- 독립적으로 출시 가능
- 필요한 경우 롤백이 더 간단함

### 불분명한 요구사항의 경우 `/opsx:explore` 사용

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

탐색은 아티팩트를 생성하기 전에 사고를 명확히 합니다.

### 아카이빙 전에 검증하세요

`/opsx:verify`를 사용하여 구현이 아티팩트와 일치하는지 확인하세요:

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

변경 사항을 마무리하기 전에 불일치를 잡아냅니다.

### 변경 사항 이름을 명확하게 지정하세요

좋은 이름은 `openspec list`를 더 유용하게 만듭니다:

```text
권장:                          피하기:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## 명령어 빠른 참조

전체 명령어 상세 내용과 옵션은 [명령어](commands.md)를 참고하세요.

| 명령어 | 용도 | 사용 시점 |
|---------|---------|-------------|
| `/opsx:propose` | 변경 사항 + 계획 산출물 생성 | 빠른 기본 경로 (`core` 프로필) |
| `/opsx:explore` | AI와 함께 아이디어를 구체화하기 | 확실하지 않을 때 시작점: 요구사항이 불분명할 때, 조사가 필요할 때, 옵션 비교가 필요할 때 |
| `/opsx:new` | 변경 스캐폴드 시작 | 확장 모드, 명시적 산출물 제어 |
| `/opsx:continue` | 다음 산출물 생성 | 확장 모드, 단계별 산출물 생성 |
| `/opsx:ff` | 모든 계획 산출물 생성 | 확장 모드, 범위가 명확할 때 |
| `/opsx:apply` | 작업 구현 | 코드 작성 준비가 완료된 상태 |
| `/opsx:verify` | 구현 내용 검증 | 확장 모드, 보관 전 |
| `/opsx:sync` | 델타 스펙 병합 | 확장 모드, 선택 사항 |
| `/opsx:archive` | 변경 완료 | 모든 작업이 끝난 상태 |
| `/opsx:bulk-archive` | 여러 변경 사항 일괄 보관 | 확장 모드, 병렬 작업 시 |

## 다음 단계

- [좋은 스펙 작성하기](writing-specs.md) - 강력한 요구사항과 시나리오의 특징, 변경 범위를 적절히 정하는 방법
- [변경 사항 검토하기](reviewing-changes.md) - 코드 작성 전 초안 계획을 2분 만에 검토하는 방법
- [팀에서 OpenSpec 사용하기](team-workflow.md) - 변경 사항이 브랜치와 풀 리퀘스트와 연동되는 방식
- [명령어](commands.md) - 옵션이 포함된 전체 명령어 참조
- [개념](concepts.md) - 스펙, 산출물, 스키마에 대한 심층 분석
- [커스터마이징](customization.md) - 사용자 정의 워크플로우 생성