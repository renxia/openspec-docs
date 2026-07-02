# 워크플로우

이 가이드는 OpenSpec에 대한 일반적인 워크플로우 패턴과 각 패턴을 언제 사용해야 하는지를 다룹니다. 기본 설정은 [Getting Started](getting-started.md)를 참조하십시오. 명령어 참조는 [Commands](commands.md)를 참조하십시오.

## 철학: 단계가 아닌 행동(Actions)

전통적인 워크플로우는 단계를 거치도록 강제합니다: 계획(planning), 그다음 구현(implementation), 그리고 완료(done). 하지만 실제 업무는 깔끔하게 상자에 맞지 않습니다.

OPSX는 다른 접근 방식을 취합니다:

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**핵심 원칙:**

- **단계가 아닌 행동(Actions)** - 명령어는 갇혀 있는 단계가 아니라 수행할 수 있는 행위입니다.
- **종속성(Dependencies)은 활성화 요소(enablers)입니다** - 이는 다음에 무엇이 필요한지를 보여주는 것이 아니라 무엇이 가능한지를 보여줍니다.

> **사용자 정의(Customization):** OPSX 워크플로우는 아티팩트 시퀀스를 정의하는 스키마에 의해 구동됩니다. 사용자 지정 스키마 생성에 대한 자세한 내용은 [Customization](customization.md)을 참조하십시오.

## 두 가지 모드

### 기본 빠른 경로 (`core` 프로필)

새로운 설치 시 `core`가 기본값으로 제공되며, 이는 다음을 포함합니다:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

일반적인 흐름:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (선택 사항)
```

#### 탐색으로 시작하기 (습관으로 만들 가치 있는 행동)

`/opsx:explore`는 고급 추가 기능이 아니라 기본 프로필의 일부입니다. 이는 문제점은 있지만 아직 계획이 없을 때 취해야 할 조치이며, AI 비서기가 있는 대부분의 경우에 해당합니다.

```text
You: /opsx:explore

AI:  무엇을 탐색하고 싶으신가요?

You: 검색 결과가 오래된 것 같습니다. 캐싱 문제인지, 인덱싱 문제인지, 아니면 쿼리 자체의 문제인지 확실하지 않습니다.

AI:  제가 확인해 보겠습니다... [검색 서비스 및 캐시 계층을 읽음]
     인덱스 문제입니다. 밤에 한 번 재구축되기 때문에 편집 내용이 다음 날까지 표시되지 않습니다. 두 가지 옵션이 있습니다: 쓰기 시 재구축(단순하지만 부하가 더 큼) 또는 짧은 TTL 캐시 무효화(더 많은 구성 요소, 적은 부하). 귀하의 작성량(write volume)이 낮으므로 쓰기 시 재구축이 더 깔끔한 해결책입니다. 범위를 지정해 드릴까요?

You: 네.

You: /opsx:propose rebuild-search-index-on-write
```

탐색은 어떤 아티팩트도 생성하지 않으며 코드를 작성하지 않습니다. 이는 모호한 걱정을 정확한 변경 사항으로 바꾸는 무료적이고 부담 없는 대화이며, 따라서 뒤따르는 제안(proposal)이 명확해집니다. 이미 원하는 바를 정확히 알고 있습니까? 건너뛰고 `/opsx:propose`로 바로 이동하십시오. 전체 가이드: [Explore First](explore.md).

### 확장/전체 워크플로우 (사용자 지정 선택)

명시적인 스캐폴드 및 빌드 명령(` /opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`)을 사용하려면 다음을 활성화하십시오.

```bash
openspec config profile
openspec update
```

## 워크플로우 패턴 (확장 모드)

### 빠른 기능 구현 (Quick Feature)

무엇을 만들지 알고 있고 실행만 하면 될 때:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**대화 예시:**

```text
You: /opsx:new add-logout-button

AI:  openspec/changes/add-logout-button/를 생성했습니다.
     제안(proposal)을 만들 준비가 되었습니다.

You: /opsx:ff

AI:  모든 계획 아티팩트를 생성 중입니다...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     구현할 준비가 되었습니다!

You: /opsx:apply

AI:  작업을 진행 중입니다...
     ✓ 헤더에 로그아웃 버튼 추가
     ✓ 세션 클리어링 구현
     ✓ 확인 대화 상자 추가
     모든 작업 완료!

You: /opsx:archive

AI:  ✓ 스펙 병합
     ✓ 변경 사항 아카이브
```

**적합한 경우:** 소규모에서 중간 규모의 기능, 버그 수정, 간단한 변경 사항.

### 탐색적 (Exploratory)

요구사항이 불분명하거나 먼저 조사해야 할 때:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**대화 예시:**

```text
You: /opsx:explore

AI:  무엇을 탐색하고 싶으신가요?

You: 페이지 로드 성능을 개선하고 싶은데, 병목 현상이 어디인지 모르겠습니다.

AI:  제가 조사하는 것을 도와드리겠습니다...
     [번들 크기 분석, 느린 쿼리 식별, 컴포넌트 렌더링 패턴 검토]

     세 가지 주요 병목 현상을 발견했습니다:
     1. 대용량의 비최적화된 이미지
     2. ProductList에서의 동기 데이터 가져오기(Synchronous data fetching)
     3. 컨텍스트 변경으로 인한 재렌더링(Re-renders from context changes)

     어떤 것을 먼저 해결하고 싶으십니까?

You: 데이터 가져오기 문제를 다뤄보겠습니다.

You: /opsx:new optimize-product-list-fetching

AI:  변경 사항을 생성했습니다. 제안을 만들 준비가 되었습니다.

You: /opsx:continue

AI:  탐색 결과를 바탕으로 제안을 생성 중입니다...
     [조사 내용을 통합한 제안서 작성]

     스펙, 디자인을 만들 준비가 되었습니다.
     다음으로는 무엇을 원하십니까?

You: /opsx:continue

AI:  스펙을 생성 중입니다...
```

**적합한 경우:** 성능 최적화, 디버깅, 아키텍처 결정, 불분명한 요구사항.

### 병렬 변경 (Parallel Changes)

여러 변경 사항을 동시에 작업할 때:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (진행 중)
                                         │
                                    컨텍스트 전환(context switch)
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**대화 예시:**

```text
You: add-dark-mode 작업을 하고 있었는데, 버그 수정에 투입되었습니다.

You: /opsx:new fix-login-redirect

AI:  openspec/changes/fix-login-redirect/를 생성했습니다.

You: /opsx:ff

AI:  ✓ 계획 아티팩트 생성 완료

You: /opsx:apply

AI:  fix-login-redirect 작업을 진행 중입니다...
     [수정 사항 구현]
     모든 작업 완료!

You: /opsx:archive

AI:  ✓ fix-login-redirect 아카이브

You: 다크 모드 작업으로 돌아가겠습니다.

You: /opsx:apply add-dark-mode

AI:  add-dark-mode를 재개합니다...
     작업 2.3: 헤더 업데이트부터 진행합니다...
```

**적합한 경우:** 병렬 작업 스트림, 긴급 중단(urgent interrupts), 팀 협업.

완료된 여러 변경 사항이 있을 때는 `/opsx:bulk-archive`를 사용하십시오.

```text
You: /opsx:bulk-archive

AI:  3개의 완료된 변경 사항을 찾았습니다:
     - add-dark-mode (모든 작업 완료)
     - fix-login-redirect (모든 작업 완료)
     - update-footer (모든 작업 완료)

     스펙 충돌 여부를 확인 중...
     ⚠ add-dark-mode와 update-footer 모두 specs/ui/를 건드림

     해결하기 위해 코드베이스를 검사 중...
     두 변경 사항 모두 구현되었습니다. 시간 순서대로 적용할 예정입니다.

     3가지 변경 사항을 모두 아카이브하시겠습니까?

You: 네

AI:  ✓ add-dark-mode 아카이브 완료
     ✓ fix-login-redirect 아카이브 완료
     ✓ update-footer 아카이브 완료
     스펙 순서대로 병합: add-dark-mode → update-footer
```

Bulk archive는 여러 변경 사항이 동일한 스펙을 건드리는지 감지하고, 실제로 구현된 내용을 확인하여 충돌을 해결합니다.

### 변경 사항 완료하기

권장되는 완료 흐름:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              검증(validates)          동기화 요청 (prompts to sync)
              구현(implementation)     필요한 경우
```

#### 검증하기 (Verify): 작업 확인

`/opsx:verify`는 세 가지 차원에서 구현을 아티팩트와 비교하여 검증합니다.

```text
You: /opsx:verify

AI:  add-auth를 검증 중입니다...

     완전성 (COMPLETENESS)
     ✓ tasks.md의 12개 작업 모두 확인됨
     ✓ 스펙에 있는 모든 요구사항이 대응하는 코드를 가짐
     ⚠ "비활성 상태 후 세션 타임아웃" 시나리오 미테스트

     정확성 (CORRECTNESS)
     ✓ 구현이 스펙 의도와 일치함
     ✓ 시나리오에서 나온 엣지 케이스(Edge cases)가 처리됨
     ✓ 오류 상태가 스펙 정의와 일치함

     일관성 (COHERENCE)
     ✓ 디자인 결정 사항이 코드 구조에 반영됨
     ✓ 명명 규칙이 design.md와 일치함
     ⚠ 디자인에서는 "이벤트 기반(event-driven)"을 언급했지만 구현은 폴링(polling)을 사용하고 있음

     요약 (SUMMARY)
     ─────────────────────────────
     심각한 문제: 0
     경고: 2
     아카이브 준비 완료: 예 (경고 포함)

     권장 사항:
     1. 세션 타임아웃 시나리오에 대한 테스트 추가
     2. 디자인대로 이벤트 기반으로 리팩토링을 고려하거나 design.md를 업데이트할 것
```

**검증이 확인하는 내용:**

| 차원 | 검증 내용 |
|-----------|------------------|
| 완전성 (Completeness) | 모든 작업 완료, 모든 요구사항 구현, 시나리오 커버리지 |
| 정확성 (Correctness) | 구현이 스펙 의도와 일치, 엣지 케이스 처리 여부 |
| 일관성 (Coherence) | 디자인 결정 사항이 코드에 반영, 패턴의 일관성 |

검증은 아카이브를 차단하지는 않지만, 먼저 해결하고 싶은 문제를 드러냅니다.

#### 아카이브하기 (Archive): 변경 사항 최종 확정

`/opsx:archive`는 변경 사항을 완료하고 아카이브로 이동시킵니다.

```text
You: /opsx:archive

AI:  add-auth를 아카이브 중입니다...

     아티팩트 상태:
     ✓ proposal.md 존재
     ✓ specs/ 존재
     ✓ design.md 존재
     ✓ tasks.md 존재 (12/12 작업 완료)

     델타 스펙(Delta specs): 아직 메인에 동기화되지 않음
     → 지금 동기화하시겠습니까?

You: 네

AI:  ✓ openspec/specs/auth/spec.md로 스펙 동기화 완료
     ✓ openspec/changes/archive/2025-01-24-add-auth/로 이동

     변경 사항이 성공적으로 아카이브되었습니다.
```

아카이브는 스펙이 동기화되지 않은 경우 프롬프트를 표시합니다. 미완료된 작업으로 차단되지는 않지만 경고를 줄 것입니다.

## 언제 무엇을 사용해야 하는가

### `/opsx:ff` 대 `/opsx:continue`

| 상황 | 사용법 |
|-----------|-----|
| 명확한 요구사항, 구축 준비 완료 | `/opsx:ff` |
| 탐색 중이며 각 단계를 검토하고 싶을 때 | `/opsx:continue` |
| 스펙 이전에 제안(proposal)에 대해 반복 작업을 하고 싶을 때 | `/opsx:continue` |
| 시간적 압박이 있어 빠르게 진행해야 할 때 | `/opsx:ff` |
| 복잡한 변경 사항, 통제권을 갖고 싶을 때 | `/opsx:continue` |

**핵심 규칙:** 처음부터 전체 범위를 설명할 수 있다면 `/opsx:ff`를 사용하십시오. 진행하면서 알아가고 있는 중이라면 `/opsx:continue`를 사용하십시오.

### 업데이트 vs 새로 시작하기

흔한 질문입니다: 기존 변경 사항을 업데이트해도 되는 경우와 새롭게 시작해야 하는 경우는 언제인가요?

**기존 변경 사항을 업데이트해야 할 때:**

- 의도는 같으나 실행이 다듬어졌을 때
- 범위가 축소되었을 때 (MVP 먼저, 나머지는 나중에)
- 학습 기반 수정 (코드베이스가 예상과 달랐을 때)
- 구현 발견에 따른 디자인 조정

**새로운 변경 사항을 시작해야 할 때:**

- 의도가 근본적으로 바뀌었을 때
- 범위가 완전히 다른 작업으로 폭발적으로 증가했을 때
- 원래의 변경 사항이 독립적으로 "완료" 상태로 표시될 수 있을 때
- 패치(Patches)가 명확하게 하는 것보다 혼란스럽게 할 때

```text
                     ┌─────────────────────────────────────┐
                     │     이것이 같은 작업인가?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          같은 의도?      >50% 중복?      원래의 변경 사항을
          같은 문제?     같은 범위?        이러한 변경 없이 "완료"로
                 │                  │          표시할 수 있습니까?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      예 (YES)           아니요 (NO) 예 (YES)   아니요 (NO)  아니요 (NO)
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    업데이트 (UPDATE)            새로운 작업 (NEW)  업데이트 (UPDATE)  새로운 작업 (NEW)  업데이트 (UPDATE)  새로운 작업 (NEW)
```

**예시: "다크 모드 추가"**

- "커스텀 테마 지원도 필요하다" → 새로운 변경 사항 (범위 폭발적 증가)
- "시스템 선호도 감지(detection)가 예상보다 어렵다" → 업데이트 (같은 의도)
- "먼저 토글을 출시하고, 나중에 선호도를 추가하자" → 업데이트 후 아카이브, 그리고 새로운 변경 사항 생성

## 모범 사례 (Best Practices)

### 변경 사항에 집중하기

한 번의 논리적인 작업 단위로 변경 사항을 만드십시오. "기능 X를 추가하고 Y를 리팩토링하는 것"을 하고 있다면 두 개의 별도 변경 사항으로 고려하십시오.

**중요한 이유:**
- 검토 및 이해가 더 쉬움
- 더 깔끔한 아카이브 기록
- 독립적으로 출시 가능함
- 필요할 경우 단순한 롤백(rollback) 가능

### 불분명한 요구사항에 대해서는 `/opsx:explore` 사용하기

변경 사항을 확정하기 전에 문제 영역을 탐색하십시오.

```text
You: /opsx:explore

AI:  무엇을 탐색하고 싶으신가요?

You: API의 속도 제한(rate limiting)을 어떻게 처리해야 할까요?

AI:  현재 설정과 옵션을 조사해 보겠습니다...
     [코드베이스를 조사하고 패턴을 고려]

     취할 수 있는 세 가지 접근 방식을 보았습니다:
     1. 미들웨어 기반 (단순함, 엔드포인트별)
     2. Redis 기반 (확장 가능, 공유 상태)
     3. 사용자당 토큰 버킷 (공정함, 복잡함)

     현재 스택은 #1 또는 #2를 시사합니다. 규모는 어느 정도이십니까?
```

탐색은 아티팩트를 생성하기 전에 사고방식을 명확하게 합니다.

### 아카이브하기 전에 검증하기

`/opsx:verify`를 사용하여 구현이 아티팩트와 일치하는지 확인하십시오.

```text
You: /opsx:verify

AI:  add-dark-mode를 검증 중입니다...

     ✓ tasks.md의 모든 작업이 확인됨
     ✓ 스펙에 있는 요구사항들이 코드로 대응함
     ✓ 디자인 결정 사항이 구현에 반영됨

     아카이브 준비 완료!
```

변경 사항을 닫기 전에 불일치를 잡아냅니다.

### 변경 사항 명확하게 이름 지정하기

좋은 이름은 `openspec list`를 유용하게 만듭니다:

```text
좋은 예시:                          피해야 할 예시:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## 명령어 빠른 참조

전체 명령어 세부 정보 및 옵션은 [Commands](commands.md)를 참조하십시오.

| Command | 목적 | 사용 시점 |
| :--- | :--- | :--- |
| `/opsx:propose` | 변경 사항 및 계획 아티팩트 생성 | 빠른 기본 경로 (`core` 프로필) |
| `/opsx:explore` | AI와 함께 아이디어 구상하기 | 불확실할 때 시작: 불분명한 요구 사항, 조사, 옵션 비교 |
| `/opsx:new` | 변경 스캐폴드 시작 | 확장 모드, 명시적 아티팩트 제어 |
| `/opsx:continue` | 다음 아티팩트 생성 | 확장 모드, 단계별 아티팩트 생성 |
| `/opsx:ff` | 모든 계획 아티팩트 생성 | 확장 모드, 명확한 범위 |
| `/opsx:apply` | 작업 구현 | 코드 작성 준비 완료 |
| `/opsx:verify` | 구현 검증 | 확장 모드, 아카이브 전 |
| `/opsx:sync` | 델타 사양 병합 | 확장 모드, 선택 사항 |
| `/opsx:archive` | 변경 사항 완료 | 모든 작업 완료 |
| `/opsx:bulk-archive` | 다중 변경 사항 아카이브 | 확장 모드, 병렬 작업 |

## 다음 단계

- [Commands](commands.md) - 옵션을 포함한 전체 명령어 참조
- [Concepts](concepts.md) - 사양(specs), 아티팩트 및 스키마에 대한 심층 분석
- [Customization](customization.md) - 사용자 지정 워크플로우 생성