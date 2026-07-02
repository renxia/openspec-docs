# 개념

이 가이드는 OpenSpec의 핵심 아이디어와 그것들이 어떻게 상호 작용하는지를 설명합니다. 실제 사용법에 대해서는 [Getting Started](getting-started.md) 및 [Workflows](workflows.md)를 참조하십시오.

## 철학

OpenSpec은 네 가지 원칙을 기반으로 구축되었습니다:

```
fluid not rigid         — 단계별 게이트(phase gates) 없이, 의미 있는 작업에 집중합니다
iterative not waterfall — 구축하면서 배우고, 지속적으로 개선합니다
easy not complex        — 가벼운 설정, 최소한의 형식 절차(ceremony)
brownfield-first        — 그린필드(greenfield)뿐만 아니라 기존 시스템과 함께 작동합니다
```

### 이러한 원칙이 중요한 이유

**유연함이지 경직적이지 않음.** 기존 사양 시스템은 단계를 강제합니다. 즉, 먼저 계획하고, 그다음 구현하고, 그리고 끝내는 식입니다. OpenSpec은 더 유연하여, 작업에 의미 있는 순서대로 아티팩트(artifacts)를 생성할 수 있습니다.

**반복적이지 폭포수 모델이 아님.** 요구사항은 변합니다. 이해는 심화됩니다. 처음에 좋은 접근 방식처럼 보였던 것도 코드베이스를 본 후에 유효하지 않을 수 있습니다. OpenSpec은 이러한 현실을 받아들입니다.

**복잡하지 않고 쉬움.** 일부 사양 프레임워크는 광범위한 설정, 경직된 형식 또는 무거운 프로세스를 요구합니다. OpenSpec은 방해되지 않습니다. 몇 초 만에 초기화하고 즉시 작업을 시작하며, 필요한 경우에만 맞춤 설정(customize)할 수 있습니다.

**기존 코드베이스 우선.** 대부분의 소프트웨어 작업은 처음부터 구축하는 것이 아니라 기존 시스템을 수정하는 것입니다. OpenSpec의 delta-based 접근 방식은 새로운 시스템을 설명하는 것뿐만 아니라 기존 동작에 대한 변경 사항을 지정하는 것을 쉽게 만듭니다.

## 개요 (The Big Picture)

OpenSpec은 작업을 두 가지 주요 영역으로 구성합니다:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs**는 진실의 원천(source of truth)입니다. 시스템이 현재 어떻게 작동하는지를 설명합니다.

**Changes**는 제안된 수정 사항이며, 병합할 준비가 될 때까지 별도의 폴더에 보관됩니다.

이러한 분리는 핵심적입니다. 충돌 없이 여러 변경 사항을 동시에 작업할 수 있습니다. 메인 스펙에 영향을 미치기 전에 변경 사항을 검토할 수 있습니다. 그리고 변경 사항을 아카이브(archive)하면 그 변화분(deltas)이 진실의 원천으로 깔끔하게 병합됩니다.

## Specs (스펙)

Specs는 구조화된 요구사항과 시나리오를 사용하여 시스템의 동작 방식을 설명합니다.

### 구조

```
openspec/specs/
├── auth/
│   └── spec.md           # 인증(Authentication) 동작
├── payments/
│   └── spec.md           # 결제 처리(Payment processing)
├── notifications/
│   └── spec.md           # 알림 시스템(Notification system)
└── ui/
    └── spec.md           # UI 동작 및 테마(Theme)
```

스펙은 도메인별로 구성합니다. 즉, 시스템에 의미가 있는 논리적 그룹화입니다. 일반적인 패턴:

- **기능 영역별**: `auth/`, `payments/`, `search/`
- **컴포넌트별**: `api/`, `frontend/`, `workers/`
- **경계 컨텍스트(Bounded context)별**: `ordering/`, `fulfillment/`, `inventory/`

### 스펙 형식 (Spec Format)

스펙은 요구사항을 포함하며, 각 요구사항에는 시나리오가 있습니다:

```markdown
# 인증 스펙 (Auth Specification)

## 목적 (Purpose)
애플리케이션의 인증 및 세션 관리.

## 요구사항 (Requirements)

### 요구사항: 사용자 인증 (User Authentication)
시스템은 성공적인 로그인 시 JWT 토큰을 발급해야 합니다(SHALL).

#### 시나리오: 유효한 자격 증명 (Valid credentials)
- GIVEN 유효한 자격 증명을 가진 사용자
- WHEN 사용자가 로그인 양식을 제출하면
- THEN JWT 토큰이 반환되고
- AND 사용자는 대시보드로 리디렉션됩니다.

#### 시나리오: 유효하지 않은 자격 증명 (Invalid credentials)
- GIVEN 유효하지 않은 자격 증명
- WHEN 사용자가 로그인 양식을 제출하면
- THEN 오류 메시지가 표시되고
- AND 토큰이 발급되지 않습니다.

### 요구사항: 세션 만료 (Session Expiration)
시스템은 30분간 활동이 없을 경우 세션을 만료시켜야 합니다(MUST).

#### 시나리오: 유휴 시간 초과 (Idle timeout)
- GIVEN 인증된 세션
- WHEN 30분이 경과하고 활동이 없으면
- THEN 세션이 무효화되고
- AND 사용자는 재인증명(re-authenticate)해야 합니다.
```

**주요 요소:**

| 요소 | 목적 |
|---------|---------|
| `## Purpose` | 이 스펙의 도메인에 대한 고수준 설명 |
| `### Requirement:` | 시스템이 가져야 할 특정 동작 |
| `#### Scenario:` | 요구사항을 구체적으로 보여주는 예시 |
| SHALL/MUST/SHOULD | 요구사항의 강도를 나타내는 RFC 2119 키워드 |

### 왜 이런 방식으로 스펙을 구성하는가 (Why Structure Specs This Way)

**요구사항은 "무엇(what)"입니다** — 구현 방식을 지정하지 않고 시스템이 무엇을 해야 하는지를 명시합니다.

**시나리오는 "언제(when)"입니다** — 검증할 수 있는 구체적인 예시를 제공합니다. 좋은 시나리오의 특징:
- 테스트 가능함 (자동화된 테스트를 작성할 수 있음)
- 행복한 경로(happy path)와 엣지 케이스(edge cases)를 모두 다룸
- Given/When/Then 또는 유사한 구조화된 형식을 사용

**RFC 2119 키워드** (SHALL, MUST, SHOULD, MAY)는 의도를 전달합니다:
- **MUST/SHALL** — 절대적인 요구사항
- **SHOULD** — 권장 사항이지만 예외가 존재함
- **MAY** — 선택 사항

### 스펙이란 무엇인가 (그리고 무엇이 아닌가) (What a Spec Is (and Is Not))

스펙은 구현 계획이 아니라 **행동 규약(behavior contract)**입니다.

좋은 스펙 내용:
- 사용자 또는 다운스트림 시스템이 의존하는 관찰 가능한 동작
- 입력, 출력 및 오류 조건
- 외부 제약 사항 (보안, 개인 정보 보호, 신뢰성, 호환성)
- 테스트하거나 명시적으로 검증할 수 있는 시나리오

스펙에서 피해야 할 내용:
- 내부 클래스/함수 이름
- 라이브러리 또는 프레임워크 선택
- 단계별 구현 세부 사항
- 상세 실행 계획 (이것들은 `design.md` 또는 `tasks.md`에 속합니다)

빠른 테스트:
- 만약 구현이 외부적으로 보이는 동작을 변경하지 않고도 바뀔 수 있다면, 그것은 스펙에 포함되지 않는 것이 좋습니다.

### 가볍게 유지하기: 점진적 엄격성 (Progressive Rigor)

OpenSpec은 관료주의를 피하는 것을 목표로 합니다. 변화가 검증 가능하도록 만드는 가장 가벼운 수준을 사용하십시오.

**라이트 스펙 (Lite spec, 기본값):**
- 짧고 동작 중심적인 요구사항
- 명확한 범위 및 비목표(non-goals) 설정
- 몇 가지 구체적인 승인 체크리스트

**풀 스펙 (Full spec, 고위험 시):**
- 팀 간 또는 리포지토리 간의 변경 사항
- API/계약 변경, 마이그레이션, 보안/개인 정보 보호 문제
- 모호성이 비싼 재작업을 유발할 가능성이 있는 변경 사항

대부분의 변경 사항은 라이트 모드에 머물러야 합니다.

### 인간과 에이전트의 협업 (Human + Agent Collaboration)

많은 팀에서 인간이 탐색하고 에이전트가 산출물을 초안 작성합니다. 의도된 순서는 다음과 같습니다:

1. 인간이 의도, 컨텍스트 및 제약 조건을 제공합니다.
2. 에이전트가 이를 동작 중심적인 요구사항과 시나리오로 변환합니다.
3. 에이전트는 구현 세부 사항을 `design.md`와 `tasks.md`에 보관하고 `spec.md`에는 넣지 않습니다.
4. 검증(Validation)은 구현 전에 구조와 명확성을 확인합니다.

이를 통해 스펙은 인간에게 읽기 쉽고 에이전트에게 일관성 있게 유지됩니다.

## Changes (변경 사항)

Changes는 시스템에 대한 제안된 수정 사항이며, 이를 이해하고 구현하는 데 필요한 모든 것을 담은 폴더로 패키징됩니다.

### 변경 사항 구조 (Change Structure)

```
openspec/changes/add-dark-mode/
├── proposal.md           # 이유와 내용 (Why and what)
├── design.md             # 방법 (How, 기술적 접근 방식)
├── tasks.md              # 구현 체크리스트
├── .openspec.yaml        # 변경 메타데이터 (선택 사항)
└── specs/                # 변화분 스펙 (Delta specs)
    └── ui/
        └── spec.md       # ui/spec.md에 어떤 것이 바뀌는지
```

각 변경 사항은 독립적입니다. 다음을 포함합니다:
- **Artifacts**: 의도, 설계 및 작업을 담고 있는 문서
- **Delta specs**: 추가, 수정 또는 제거되는 항목에 대한 스펙
- **Metadata**: 이 특정 변경 사항에 대한 선택적 구성 정보

### 왜 Changes가 폴더인가 (Why Changes Are Folders)

변경 사항을 폴더로 패키징하는 것은 여러 가지 이점을 제공합니다:

1. **모든 것을 한곳에.** 제안서, 설계, 작업 및 스펙이 한 곳에 있습니다. 다른 장소를 찾아다닐 필요가 없습니다.

2. **병렬 작업.** 여러 변경 사항이 충돌 없이 동시에 존재할 수 있습니다. `add-dark-mode`를 작업하는 동안 `fix-auth-bug`도 진행 중일 수 있습니다.

3. **깔끔한 히스토리.** 아카이브될 때, 변경 사항은 전체 컨텍스트가 보존된 채로 `changes/archive/`로 이동합니다. 무엇이 바뀌었는지뿐만 아니라 왜 바뀌었는지를 되돌아볼 수 있습니다.

4. **검토에 용이함.** 변경 폴더는 검토하기 쉽습니다. 열어서 제안서를 읽고, 설계를 확인하고, 스펙 변화분(delta)을 볼 수 있습니다.

## Artifacts (산출물)

Artifacts는 작업을 안내하는 변경 사항 내의 문서들입니다.

### 산출물의 흐름 (The Artifact Flow)

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

산출물들은 서로를 기반으로 구축됩니다. 각 산출물은 다음 단계에 대한 컨텍스트를 제공합니다.

### 산출물의 유형 (Artifact Types)

#### 제안서 (`proposal.md`)

제안서는 고수준에서 **의도(intent)**, **범위(scope)** 및 **접근 방식(approach)**을 담고 있습니다.

```markdown
# 제안: 다크 모드 추가 (Proposal: Add Dark Mode)

## 의도 (Intent)
사용자들은 야간 사용 시 눈의 피로를 줄이고 시스템 선호도를 맞추기 위해 다크 모드 옵션을 요청했습니다.

## 범위 (Scope)
포함되는 사항 (In scope):
- 설정 내 테마 토글
- 시스템 선호도 감지
- localStorage에 선호도 저장

제외되는 사항 (Out of scope):
- 사용자 지정 색상 테마 (향후 작업)
- 페이지별 테마 재정의

## 접근 방식 (Approach)
React context를 상태 관리용으로 사용하고, CSS 커스텀 속성(custom properties)을 사용하여 테밍(theming)을 구현합니다. 첫 로드 시 시스템 선호도를 감지하고 수동 오버라이드를 허용합니다.
```

**제안서를 업데이트해야 할 때:**
- 범위 변경 (축소 또는 확장)
- 의도 명확화 (문제에 대한 더 나은 이해)
- 접근 방식의 근본적인 변화

#### Specs (스펙, `specs/` 내의 delta specs)

Delta 스펙은 현재 스펙 대비 **무엇이 바뀌는지**를 설명합니다. 아래 [Delta Specs]를 참조하십시오.

#### 설계 (`design.md`)

설계는 **기술적 접근 방식**과 **아키텍처 결정 사항**을 담고 있습니다.

````markdown
# 설계: 다크 모드 추가 (Design: Add Dark Mode)

## 기술적 접근 방식 (Technical Approach)
프롭 드릴링(prop drilling)을 방지하기 위해 React Context를 통해 테마 상태를 관리합니다. CSS 커스텀 속성은 클래스 토글 없이 런타임 전환을 가능하게 합니다.

## 아키텍처 결정 사항 (Architecture Decisions)

### 결정: Redux 대신 Context 사용
React Context를 테마 상태에 사용하는 이유:
- 간단한 이진 상태(라이트/다크)
- 복잡한 상태 전환이 없음
- Redux 의존성 추가 방지

### 결정: CSS 커스텀 속성 사용
CSS-in-JS 대신 CSS 변수를 사용하는 이유:
- 기존 스타일시트와 호환됨
- 런타임 오버헤드 없음
- 브라우저 기본 솔루션

## 데이터 흐름 (Data Flow)
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## 파일 변경 사항 (File Changes)
- `src/contexts/ThemeContext.tsx` (새로 추가됨)
- `src/components/ThemeToggle.tsx` (새로 추가됨)
- `src/styles/globals.css` (수정됨)
````

**설계를 업데이트해야 할 때:**
- 구현이 접근 방식대로 작동하지 않음을 발견했을 때
- 더 나은 솔루션이 발견되었을 때
- 의존성 또는 제약 조건이 변경되었을 때

#### 작업 사항 (`tasks.md`)

작업 사항은 **구현 체크리스트**이며, 체크박스가 있는 구체적인 단계입니다.

```markdown
# 작업 사항 (Tasks)

## 1. 테마 인프라스트럭처
- [ ] 1.1 light/dark 상태를 가진 ThemeContext 생성
- [ ] 1.2 색상에 대한 CSS 커스텀 속성 추가
- [ ] 1.3 localStorage 영속성(persistence) 구현
- [ ] 1.4 시스템 선호도 감지 추가

## 2. UI 컴포넌트
- [ ] 2.1 ThemeToggle 컴포넌트 생성
- [ ] 2.2 설정 페이지에 토글 추가
- [ ] 2.3 빠른 토글을 포함하도록 헤더 업데이트

## 3. 스타일링
- [ ] 3.1 다크 테마 색상 팔레트 정의
- [ ] 3.2 컴포넌트를 CSS 변수 사용하도록 업데이트
- [ ] 3.3 접근성을 위한 대비 비율(contrast ratios) 테스트
```

**작업 사항 모범 사례:**
- 관련 작업을 헤딩 아래에 그룹화합니다.
- 계층적 번호 매기기를 사용합니다 (1.1, 1.2 등).
- 한 세션으로 완료할 수 있을 만큼 작게 유지합니다.
- 완료하는 대로 체크 표시를 합니다.

## Delta Specs (변화분 스펙)

Delta 스펙은 OpenSpec이 기존 시스템(brownfield development)에 작동하도록 만드는 핵심 개념입니다. 이는 전체 스펙을 다시 작성하는 것이 아니라 **무엇이 바뀌는지**를 설명합니다.

### 형식 (The Format)

```markdown
# 인증에 대한 변화분 (Delta for Auth)

## 추가된 요구사항 (ADDED Requirements)

### 요구사항: 2단계 인증 (Two-Factor Authentication)
시스템은 TOTP 기반의 2단계 인증을 지원해야 합니다(MUST).

#### 시나리오: 2FA 등록 (2FA enrollment)
- GIVEN 2FA가 활성화되지 않은 사용자
- WHEN 사용자가 설정에서 2FA를 활성화하면
- THEN 인증 앱 설정을 위한 QR 코드가 표시되고
- AND 사용자는 활성화 전에 코드로 검증해야 합니다.

#### 시나리오: 2FA 로그인 (2FA login)
- GIVEN 2FA가 활성화된 사용자
- WHEN 사용자가 유효한 자격 증명을 제출하면
- THEN OTP(One Time Password) 도전 과제가 제시되고
- AND 유효한 OTP를 통해서만 로그인이 완료됩니다.

## 수정된 요구사항 (MODIFIED Requirements)

### 요구사항: 세션 만료 (Session Expiration)
시스템은 15분간 활동이 없을 경우 세션을 만료시켜야 합니다(MUST).
(기존: 30분)

#### 시나리오: 유휴 시간 초과 (Idle timeout)
- GIVEN 인증된 세션
- WHEN 15분이 경과하고 활동이 없으면
- THEN 세션이 무효화됩니다.

## 제거된 요구사항 (REMOVED Requirements)

### 요구사항: 나를 기억하기 (Remember Me)
(2FA로 대체됨. 사용자는 매번 세션마다 재인증명해야 합니다.)
```

### Delta 섹션 (Delta Sections)

| 섹션 | 의미 | 아카이브 시 발생하는 일 |
|---------|---------|------------------------|
| `## ADDED Requirements` | 새로운 동작 | 메인 스펙에 추가됨 |
| `## MODIFIED Requirements` | 변경된 동작 | 기존 요구사항을 대체함 |
| `## REMOVED Requirements` | 폐기된 동작 | 메인 스펙에서 삭제됨 |

### 전체 스펙 대신 Delta를 사용하는 이유 (Why Deltas Instead of Full Specs)

**명확성.** Delta는 정확히 무엇이 바뀌는지 보여줍니다. 전체 스펙을 읽으려면 현재 버전과 정신적으로 비교(diff)해야 합니다.

**충돌 방지.** 두 개의 변경 사항이 서로 다른 요구사항을 수정하는 한, 동일한 스펙 파일을 건드려도 충돌하지 않습니다.

**검토 효율성.** 검토자는 변하지 않은 컨텍스트가 아닌 변화된 부분만 보게 됩니다. 중요한 것에 집중합니다.

**기존 시스템(Brownfield)에 적합함.** 대부분의 작업은 기존 동작을 수정하는 것입니다. Delta는 수정을 사후 대처가 아닌 핵심적인 것으로 만듭니다.

## Schemas

스키마는 워크플로우의 아티팩트 유형과 그 종속성을 정의합니다.

### How Schemas Work

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
```

**Artifacts form a dependency graph:**

```
                    proposal
                   (root node)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**Dependencies are enablers, not gates.** 종속성은 게이트가 아니라 활성화 요소입니다. 이는 다음에 무엇을 *반드시* 만들어야 하는지가 아니라 어떤 것이 생성될 수 있는지를 보여줍니다. 필요하지 않다면 디자인 단계를 건너뛸 수 있습니다. 스펙과 디자인은 모두 proposal에만 의존하므로, 디자인 이전에 또는 이후에 specs를 만들 수 있습니다.

### Built-in Schemas

**spec-driven** (기본값)

스펙 기반 개발을 위한 표준 워크플로우입니다:

```
proposal → specs → design → tasks → implement
```

적합한 경우: 구현 전에 스펙에 합의하고 싶은 대부분의 기능 작업.

### Custom Schemas

팀의 워크플로우에 맞는 사용자 지정 스키마를 생성하십시오:

```bash
# 처음부터 생성
openspec schema init research-first

# 기존 스키마 포크(fork)하기
openspec schema fork spec-driven research-first
```

**사용자 지정 스키마 예시:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # 먼저 리서치를 수행합니다

  - id: proposal
    generates: proposal.md
    requires: [research]   # 리서치에 기반한 제안서

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # 스펙/디자인을 건너뛰고 바로 태스크로 이동
```

사용자 지정 스키마를 생성하고 사용하는 방법에 대한 전체 내용은 [Customization](customization.md)을 참조하십시오.

## Archive

아카이빙(Archiving)은 변경 사항의 델타 스펙을 메인 스펙에 병합하고, 해당 변경 사항을 기록으로 보존함으로써 변경을 완료하는 과정입니다.

### What Happens When You Archive

```
Before archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


After archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # 이제 2FA 요구 사항을 포함합니다
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # 기록 보존용
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### The Archive Process

1. **Merge deltas.** 각 델타 스펙 섹션(ADDED/MODIFIED/REMOVED)이 해당 메인 스펙에 적용됩니다.

2. **Move to archive.** 변경 폴더는 연도 순서 구분을 위한 날짜 접두사를 사용하여 `changes/archive/`로 이동합니다.

3. **Preserve context.** 모든 아티팩트가 아카이브에 그대로 보존됩니다. 언제든지 변경이 이루어진 이유를 이해할 수 있습니다.

### Why Archive Matters

**Clean state.** 활성 변경 사항(`changes/`)은 진행 중인 작업만 보여줍니다. 완료된 작업은 정리되어 보이지 않게 됩니다.

**Audit trail.** 아카이브는 모든 변경의 전체 맥락을 보존합니다. 단순히 무엇이 바뀌었는지뿐만 아니라, 왜 바뀌어야 하는지를 설명하는 제안서(proposal), 어떻게 해야 하는지를 설명하는 디자인(design), 그리고 수행된 작업을 보여주는 태스크(tasks)까지 모두 포함됩니다.

**Spec evolution.** 스펙은 변경 사항이 아카이브될 때 유기적으로 성장합니다. 각 아카이브는 델타를 병합하여 시간이 지남에 따라 포괄적인 사양을 구축합니다.

## How It All Fits Together

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**The virtuous cycle:** (선순환)

1. Specs describe current behavior (스펙은 현재 동작을 설명합니다)
2. Changes propose modifications (as deltas) (변경 사항이 델타로 수정 사항을 제안합니다)
3. Implementation makes the changes real (구현이 변경 사항을 현실화합니다)
4. Archive merges deltas into specs (아카이브가 델타를 스펙에 병합합니다)
5. Specs now describe the new behavior (스펙은 이제 새로운 동작을 설명합니다)
6. Next change builds on updated specs (다음 변경 사항은 업데이트된 스펙을 기반으로 합니다)

## Glossary

| Term | Definition |
|------|------------|
| **Artifact** | A document within a change (proposal, design, tasks, or delta specs) (변경 사항 내의 문서: 제안서, 디자인, 태스크 또는 델타 스펙) |
| **Archive** | The process of completing a change and merging its deltas into main specs (변경을 완료하고 델타를 메인 스펙에 병합하는 과정) |
| **Change** | A proposed modification to the system, packaged as a folder with artifacts (아티팩트가 포함된 폴더 형태로 패키징된 시스템의 제안된 수정 사항) |
| **Delta spec** | A spec that describes changes (ADDED/MODIFIED/REMOVED) relative to current specs (현재 스펙 대비 변경 사항(추가됨/수정됨/제거됨)을 설명하는 스펙) |
| **Domain** | A logical grouping for specs (e.g., `auth/`, `payments/`) (스펙에 대한 논리적 그룹화: 예시로 `auth/`, `payments/`) |
| **Requirement** | A specific behavior the system must have (시스템이 가져야 하는 특정 동작) |
| **Scenario** | A concrete example of a requirement, typically in Given/When/Then format (요구 사항의 구체적인 예시이며, 일반적으로 Given/When/Then 형식으로 작성됨) |
| **Schema** | A definition of artifact types and their dependencies (아티팩트 유형과 그 종속성에 대한 정의) |
| **Spec** | A specification describing system behavior, containing requirements and scenarios (요구 사항 및 시나리오를 포함하는 시스템 동작을 설명하는 사양) |
| **Source of truth** | The `openspec/specs/` directory, containing the current agreed-upon behavior (`openspec/specs/` 디렉토리로, 현재 합의된 동작을 담고 있음) |

## Next Steps

- [Getting Started](getting-started.md) - 시작하기 (실질적인 첫 단계)
- [Workflows](workflows.md) - 워크플로우 (일반적인 패턴 및 사용 시점)
- [Commands](commands.md) - 명령어 (전체 명령어 참조)
- [Customization](customization.md) - 사용자 지정 (사용자 지정 스키마 생성 및 프로젝트 구성)