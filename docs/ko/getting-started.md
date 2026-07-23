# 시작하기

이 가이드는 OpenSpec을 설치하고 초기화한 후 작동 방식을 설명합니다. 설치 방법은 [메인 README](../index.md#quick-start) 또는 [설치 가이드](installation.md)를 참고하세요. 전체 문서가 처음이신가요? [문서 홈](index.md)에서 전체 구조를 확인할 수 있습니다.

> **이 명령어는 어디에 입력하나요?** 두 곳이 있으며, 혼동하는 것이 초보자가 가장 많이 하는 실수입니다.
>
> - `openspec ...` 명령어(예: `openspec init`)는 **터미널**에서 실행합니다.
> - `/opsx:...` 명령어(예: `/opsx:propose`)는 AI 어시스턴트 채팅에서 실행하며, 코드 작성을 요청하는 것과 같은 입력창입니다.
>
> 별도의 '대화형 모드'를 시작할 필요가 없습니다. 채팅에 슬래시 명령어를 입력하면 AI가 나머지를 처리합니다. 전체 설명: [명령어 작동 방식](how-commands-work.md).

## 첫 5분 따라하기

각 단계가 실행되는 위치와 함께 전체 흐름을 보여드립니다:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (선택 사항: 먼저 아이디어를 구체화하세요)
AI CHAT      /opsx:propose add-dark-mode      (AI가 계획을 작성합니다. 검토하세요)
AI CHAT      /opsx:apply                      (AI가 빌드합니다)
AI CHAT      /opsx:archive                    (스펙이 업데이트되고 변경 사항이 보관됩니다)
```

터미널 두 단계로 설정한 후 채팅에서 작업을 진행합니다. 이 가이드의 나머지 부분에서 각 단계가 무엇을 하는지, 어떤 결과를 보게 되는지 설명합니다.

> **아직 무엇을 만들지 정하지 못하셨나요? `/opsx:explore`부터 시작하세요.** 아무런 리스크 없이 아이디어를 구체화할 수 있는 파트너로, 코드베이스를 읽고 옵션을 평가하며 모호한 아이디어를 구체적인 계획으로 다듬어줍니다. 아티팩트나 코드가 생성되기 전에 이 과정을 거치고, 준비가 되면 `/opsx:propose`로 넘어갑니다. 이는 AI가 자신 있게 잘못된 것을 만들어내는 것을 방지하는 가장 좋은 습관입니다. [탐색 가이드](explore.md)를 참고하세요.

## 작동 원리

OpenSpec은 코드를 작성하기 전에 귀하와 AI 코딩 어시스턴트가 빌드할 내용에 대해 합의할 수 있도록 도와줍니다.

**기본 빠른 경로 (코어 프로필):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (선택 사항)
```

아이디어를 구체화하는 중이라면 `/opsx:explore`부터 시작하세요. 이미 빌드할 내용을 알고 있다면 바로 `/opsx:propose`로 이동해도 됩니다. 탐색 기능은 기본 프로필에 포함되어 있어 언제든 사용할 수 있습니다.

**확장 경로 (커스텀 워크플로우 선택):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

기본 글로벌 프로필은 `core`로, `propose`, `explore`, `apply`, `sync`, `archive`가 포함됩니다. `openspec config profile` 명령으로 확장 워크플로우 명령어를 활성화한 후 `openspec update`를 실행할 수 있습니다.

## OpenSpec이 생성하는 것

`openspec init`을 실행한 후 프로젝트에는 다음과 같은 구조가 생성됩니다:

```
openspec/
├── specs/              # 진실의 원천 (시스템의 작동 방식)
│   └── <domain>/
│       └── spec.md
├── changes/            # 제안된 업데이트 (변경 사항마다 폴더 하나씩)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # 델타 스펙 (변경되는 내용)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # 프로젝트 설정 (선택 사항)
```

**두 가지 주요 디렉토리:**

- **`specs/`** - 진실의 원천. 이 스펙은 시스템이 현재 어떻게 작동하는지 설명합니다. 도메인별로 구성됩니다(예: `specs/auth/`, `specs/payments/`).
- **`changes/`** - 제안된 수정 사항. 각 변경 사항마다 관련 아티팩트가 모두 포함된 폴더가 생성됩니다. 변경이 완료되면 해당 스펙이 메인 `specs/` 디렉토리에 병합됩니다.

## 아티팩트 이해하기

각 변경 폴더에는 작업을 안내하는 아티팩트가 포함됩니다:

| 아티팩트 | 목적 |
|----------|------|
| `proposal.md` | "이유"와 "무엇" - 의도, 범위, 접근 방식 기록 |
| `specs/` | 추가/수정/삭제된 요구사항을 보여주는 델타 스펙 |
| `design.md` | "방법" - 기술적 접근 방식과 아키텍처 결정 사항 |
| `tasks.md` | 체크박스가 포함된 구현 체크리스트 |

**아티팩트는 서로 구축됩니다:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            학습에 따라 업데이트하세요
```

구현 중에 더 많은 것을 배우면 이전 아티팩트를 언제든 다시 다듬고 수정할 수 있습니다.

## 델타 스펙 작동 원리

델타 스펙은 OpenSpec의 핵심 개념입니다. 현재 스펙과 비교하여 변경되는 내용을 보여줍니다.

### 형식

델타 스펙은 섹션을 사용하여 변경 유형을 표시합니다:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### 아카이브 시 발생하는 일

변경 사항을 아카이브하면 다음과 같이 진행됩니다:

1. **ADDED** 요구사항이 메인 스펙에 추가됩니다.
2. **MODIFIED** 요구사항이 기존 버전을 대체합니다.
3. **REMOVED** 요구사항이 메인 스펙에서 삭제됩니다.

변경 폴더는 감사 기록을 위해 `openspec/changes/archive/`로 이동합니다.

## 예시: 첫 번째 변경 사항 만들기

애플리케이션에 다크 모드를 추가하는 과정을 살펴보겠습니다.

### 1. 변경 시작 (기본)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

확장 워크플로우 프로필을 활성화한 경우 `/opsx:new` 다음에 `/opsx:ff`(또는 점진적으로 `/opsx:continue`)로 두 단계로 진행할 수도 있습니다.

### 2. 생성되는 파일

**proposal.md** - 의도를 기록합니다:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - 새로운 요구사항을 보여주는 델타:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - 구현 체크리스트:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. 구현

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

구현 중에 디자인 조정이 필요하다는 것을 발견하면 아티팩트를 업데이트하고 계속 진행하세요.

### 4. 아카이브

```text
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

델타 스펙이 이제 메인 스펙의 일부가 되어 시스템 작동 방식을 문서화합니다.

## 검증 및 검토

CLI를 사용하여 변경 사항을 확인하세요:

```bash
# 활성 변경 사항 목록
openspec list

# 변경 사항 상세 보기
openspec show add-dark-mode

# 스펙 형식 검증
openspec validate add-dark-mode

# 대화형 대시보드
openspec view
```

## 다음 단계

- [먼저 탐색하기](explore.md) - 빌드할 내용을 확정하기 전에 `/opsx:explore`로 아이디어를 구체화하세요
- [변경 사항 검토하기](reviewing-changes.md) - 코드가 작성되기 전 AI가 작성한 계획에서 확인해야 할 사항
- [좋은 스펙 작성하기](writing-specs.md) - 강력한 요구사항과 시나리오의 예시
- [기존 프로젝트에서 OpenSpec 사용하기](existing-projects.md) - 대규모 브라운필드 코드베이스에서 시작하기
- [변경 사항 편집 및 반복하기](editing-changes.md) - 아티팩트 업데이트, 돌아가기, 수동 편집 내용 조정
- [핵심 개념 한눈에 보기](overview.md) - 전체 정신 모델을 한 페이지에서 확인
- [예시 및 레시피](examples.md) - 실제 변경 사항을 처음부터 끝까지 확인
- [워크플로우](workflows.md) - 일반적인 패턴과 각 명령어를 사용해야 하는 시점
- [명령어](commands.md) - 모든 슬래시 명령어의 전체 참조
- [개념](concepts.md) - 스펙, 변경 사항, 스키마에 대한 심층 이해
- [커스터마이징](customization.md) - OpenSpec을 자신에게 맞게 조정
- [스토어 (베타)](stores-beta/user-guide.md) - 여러 리포지토리나 팀에 걸친 계획이 필요하신가요? 별도의 리포지토리에 보관하세요 (베타)
- [FAQ](faq.md) 및 [문제 해결](troubleshooting.md) - 문제가 발생했을 때 참고하세요