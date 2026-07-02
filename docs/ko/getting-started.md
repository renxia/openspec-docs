# 시작하기

이 가이드는 OpenSpec을 설치하고 초기화한 후 작동하는 방식을 설명합니다. 설치 지침은 [main README](../index.md#quick-start) 또는 [Installation guide](installation.md)를 참조하십시오. 전체 문서 세트가 처음이신가요? [documentation home](index.md)에서 모든 내용을 확인할 수 있습니다.

> **이 명령어들은 어디에 입력하나요?** 두 곳이며, 이를 혼동하는 것이 초기에 가장 흔한 실수입니다.
>
> - `openspec ...` 명령어(예: `openspec init`)는 **터미널**에서 실행됩니다.
> - `/opsx:...` 명령어(예: `/opsx:propose`)는 코드를 작성해달라고 요청하는 것과 같은 AI 어시스턴트의 **채팅창**에서 실행됩니다.
>
> 시작하기 위한 별도의 "대화 모드"는 없습니다. 단순히 채팅에 슬래시 명령어를 입력하면 어시스턴트가 작업을 이어받습니다. 자세한 설명: [How Commands Work](how-commands-work.md).

## 첫 5분 사용법

각 단계가 어디에서 발생하는지 표시된 전체 루프입니다:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (선택 사항: 먼저 생각하기)
AI CHAT      /opsx:propose add-dark-mode      (AI가 초안을 작성하면, 사용자가 검토합니다)
AI CHAT      /opsx:apply                      (AI가 구축합니다)
AI CHAT      /opsx:archive                    (명세 업데이트 완료, 변경 사항 보관)
```

설정을 위한 두 가지 터미널 단계가 있으며, 그 후에는 채팅 환경에서 작업하게 됩니다. 이 가이드의 나머지 부분은 각 단계가 무엇을 하는지, 그리고 사용자가 무엇을 보게 될지 자세히 설명합니다.

> **아직 무엇을 만들지 모르겠나요? `/opsx:explore`로 시작하세요.** 이는 코드를 읽고, 옵션을 평가하며, 어떤 아티팩트나 코드가 존재하기 전에 모호한 아이디어를 구체적인 계획으로 다듬어 주는 부담 없는 사고 파트너입니다. 그림이 명확해지면 `/opsx:propose`로 작업을 넘깁니다. 이는 그렇지 않으면 AI가 자신 있게 잘못된 것을 구축할 수 있는 상황에서 가장 좋은 습관입니다. [Explore 가이드](explore.md)를 참고하세요.

## 작동 방식

OpenSpec은 코드가 작성되기 전에 사용자와 AI 코딩 어시스턴트가 무엇을 만들지에 대해 합의하도록 돕습니다.

**기본 빠른 경로 (core 프로필):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (선택 사항)
```

무엇을 해야 할지 파악할 때는 `/opsx:explore`로 시작하거나, 이미 알고 있다면 바로 `/opsx:propose`로 건너뛸 수 있습니다. Explore는 기본 프로필에 있으므로 필요할 때 항상 사용할 수 있습니다.

**확장 경로 (사용자 정의 워크플로우 선택):**

```text
/opsx:new ──► /opsx:ff 또는 /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

기본 전역 프로필은 `core`이며, 여기에는 `propose`, `explore`, `apply`, `sync`, `archive`가 포함됩니다. `openspec config profile` 및 이후 `openspec update`를 사용하여 확장 워크플로우 명령어를 활성화할 수 있습니다.

## OpenSpec이 생성하는 것

`openspec init`을 실행한 후, 프로젝트는 다음과 같은 구조를 갖게 됩니다:

```
openspec/
├── specs/              # 진실의 원천 (시스템의 동작)
│   └── <domain>/
│       └── spec.md
├── changes/            # 제안된 업데이트 (변경 사항당 하나의 폴더)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # 델타 명세 (무엇이 변경되는지)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # 프로젝트 설정 (선택 사항)
```

**두 가지 핵심 디렉토리:**

- **`specs/`** - 진실의 원천입니다. 이 명세들은 시스템이 현재 어떻게 동작하는지 설명합니다. 도메인별로 구성됩니다(예: `specs/auth/`, `specs/payments/`).

- **`changes/`** - 제안된 수정 사항입니다. 각 변경 사항은 모든 관련 아티팩트를 포함하는 자체 폴더를 갖습니다. 변경 사항이 완료되면 해당 명세는 메인 `specs/` 디렉토리에 병합됩니다.

## 아티팩트 이해하기

각 변경 폴더에는 작업을 안내하는 아티팩트가 포함되어 있습니다:

| 아티팩트 | 목적 |
|----------|---------|
| `proposal.md` | "이유"와 "무엇을 할 것인가" - 의도, 범위 및 접근 방식을 기록합니다 |
| `specs/` | 추가/수정/삭제된 요구 사항을 보여주는 델타 명세 |
| `design.md` | "어떻게 할 것인가" - 기술적 접근 방식 및 아키텍처 결정 |
| `tasks.md` | 체크박스가 있는 구현 체크리스트 |

**아티팩트는 서로 구축됩니다:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            학습에 따라 업데이트
```

구현 과정에서 더 많이 알게 되면 언제든지 이전 아티팩트로 돌아가서 수정할 수 있습니다.

## 델타 명세 작동 방식

델타 명세는 OpenSpec의 핵심 개념입니다. 이는 현재 명세 대비 무엇이 변경되는지를 보여줍니다.

### 형식

델타 명세는 섹션을 사용하여 변경 유형을 나타냅니다:

```markdown
# Auth에 대한 델타

## ADDED Requirements (추가된 요구 사항)

### Requirement: Two-Factor Authentication (2단계 인증)
시스템은 로그인 중에 두 번째 요소를 요구해야 합니다.

#### Scenario: OTP required (OTP 필요 시)
- GIVEN a user with 2FA enabled (2FA가 활성화된 사용자가 있을 때)
- WHEN the user submits valid credentials (사용자가 유효한 자격 증명을 제출하면)
- THEN an OTP challenge is presented (OTP 인증이 제시되어야 한다)

## MODIFIED Requirements (수정된 요구 사항)

### Requirement: Session Timeout (세션 시간 초과)
시스템은 30분 동안 비활성화되면 세션을 만료시켜야 합니다.
(이전: 60분)

#### Scenario: Idle timeout (유휴 시간 초과 시)
- GIVEN an authenticated session (인증된 세션이 있을 때)
- WHEN 30 minutes pass without activity (활동 없이 30분이 지나면)
- THEN the session is invalidated (세션은 무효화되어야 한다)

## REMOVED Requirements (제거된 요구 사항)

### Requirement: Remember Me (기억하기 기능)
(2FA를 대신하여 사용 중단됨)
```

### 아카이브 시 발생하는 일

변경 사항을 아카이브할 때:

1. **ADDED** 요구 사항은 메인 명세에 추가됩니다.
2. **MODIFIED** 요구 사항은 기존 버전을 대체합니다.
3. **REMOVED** 요구 사항은 메인 명세에서 삭제됩니다.

변경 폴더는 감사 기록을 위해 `openspec/changes/archive/`로 이동합니다.

## 예시: 첫 번째 변경 사항

애플리케이션에 다크 모드를 추가하는 과정을 살펴보겠습니다.

### 1. 변경 시작 (기본)

```text
You: /opsx:propose add-dark-mode

AI:  openspec/changes/add-dark-mode/를 생성했습니다.
     ✓ proposal.md — 우리가 이것을 하는 이유, 무엇이 변경되는지
     ✓ specs/       — 요구 사항 및 시나리오
     ✓ design.md    — 기술적 접근 방식
     ✓ tasks.md     — 구현 체크리스트
     구현 준비 완료!
```

확장 워크플로우 프로필을 활성화했다면, 두 단계로도 수행할 수 있습니다: `/opsx:new` 다음 `/opsx:ff` (또는 `/opsx:continue`를 점진적으로 사용).

### 2. 생성되는 것

**proposal.md** - 의도를 기록합니다:

```markdown
# Proposal: Add Dark Mode (다크 모드 추가 제안)

## Intent (의도)
사용자들은 야간 사용 시 눈의 피로를 줄이기 위해 다크 모드 옵션을 요청했습니다.

## Scope (범위)
- 설정에 테마 토글 추가
- 시스템 기본 설정 감지 지원
- localStorage에 선호 사항 저장

## Approach (접근 방식)
상태 관리를 위한 React context와 CSS 커스텀 속성을 사용하여 테마를 구현합니다.
```

**specs/ui/spec.md** - 새로운 요구 사항을 보여주는 델타:

```markdown
# Delta for UI (UI에 대한 델타)

## ADDED Requirements (추가된 요구 사항)

### Requirement: Theme Selection (테마 선택)
시스템은 사용자가 라이트 테마와 다크 테마 중에서 선택할 수 있도록 허용해야 합니다.

#### Scenario: Manual toggle (수동 토글 시)
- GIVEN a user on any page (모든 페이지에 있는 사용자가 있을 때)
- WHEN the user clicks the theme toggle (사용자가 테마 토글을 클릭하면)
- THEN the theme switches immediately (테마가 즉시 전환되어야 한다)
- AND the preference persists across sessions (그리고 선호 사항은 세션 전반에 걸쳐 유지되어야 한다)

#### Scenario: System preference (시스템 기본 설정 시)
- GIVEN a user with no saved preference (저장된 선호 사항이 없는 사용자가 있을 때)
- WHEN the application loads (애플리케이션이 로드되면)
- THEN the system's preferred color scheme is used (시스템의 선호 색 구성표가 사용되어야 한다)
```

**tasks.md** - 구현 체크리스트:

```markdown
# Tasks (작업 목록)

## 1. Theme Infrastructure (테마 인프라)
- [ ] 1.1 light/dark 상태를 가진 ThemeContext 생성
- [ ] 1.2 색상을 위한 CSS 커스텀 속성 추가
- [ ] 1.3 localStorage 지속성 구현

## 2. UI Components (UI 구성 요소)
- [ ] 2.1 ThemeToggle 컴포넌트 생성
- [ ] 2.2 설정 페이지에 토글 추가
- [ ] 2.3 빠른 토글을 포함하도록 헤더 업데이트

## 3. Styling (스타일링)
- [ ] 3.1 다크 테마 색상 팔레트 정의
- [ ] 3.2 CSS 변수를 사용하도록 구성 요소 업데이트
```

### 3. 구현

```
You: /opsx:apply

AI:  작업을 진행 중입니다...
     ✓ 1.1 light/dark 상태를 가진 ThemeContext 생성 완료
     ✓ 1.2 globals.css에 CSS 커스텀 속성 추가 완료
     ✓ 1.3 localStorage 지속성 구현 완료
     ✓ 2.1 ThemeToggle 컴포넌트 생성 완료
     ...
     모든 작업이 완료되었습니다!
```

구현 중에 디자인을 조정해야 한다는 것을 발견하면, 아티팩트를 업데이트하고 계속 진행하기만 하면 됩니다.

### 4. 아카이브

```
You: /opsx:archive

AI:  add-dark-mode를 아카이브 중...
     ✓ specs를 openspec/specs/ui/spec.md에 병합했습니다.
     ✓ openspec/changes/archive/2025-01-24-add-dark-mode/로 이동했습니다.
     완료! 다음 기능을 준비하세요.
```

사용자의 델타 명세는 이제 시스템의 작동 방식을 문서화하는 메인 명세의 일부가 되었습니다.

## 검증 및 검토

CLI를 사용하여 변경 사항을 확인하십시오:

```bash
# 활성 변경 사항 목록 보기
openspec list

# 변경 세부 정보 보기
openspec show add-dark-mode

# 명세 형식 유효성 검사
openspec validate add-dark-mode

# 대화형 대시보드
openspec view
```

## 다음 단계

- [Explore First](explore.md) - 커밋하기 전에 아이디어를 생각하려면 `/opsx:explore`를 사용하세요
- [Using OpenSpec in an Existing Project](existing-projects.md) - 기존의 거대한 브라운필드 코드베이스에서 시작하기
- [Editing & Iterating on a Change](editing-changes.md) - 아티팩트를 업데이트하고, 되돌아가서 수동 편집을 조정하세요
- [Core Concepts at a Glance](overview.md) - 한 페이지에 담긴 전체적인 사고 모델
- [Examples & Recipes](examples.md) - 실제 변경 사항, 처음부터 끝까지
- [Workflows](workflows.md) - 일반적인 패턴 및 각 명령어를 사용해야 할 때
- [Commands](commands.md) - 모든 슬래시 명령어에 대한 전체 참조
- [Concepts](concepts.md) - 명세, 변경 사항 및 스키마에 대한 더 깊은 이해
- [Customization](customization.md) - OpenSpec을 자신에게 맞게 만드세요
- [Stores](stores-beta/user-guide.md) - 리포지토리나 팀에 걸친 계획이 필요한가요? 자체 리포지토리에 보관하세요 (베타)
- [FAQ](faq.md) 및 [Troubleshooting](troubleshooting.md) - 막혔을 때