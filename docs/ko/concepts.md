# 개념

이 가이드는 OpenSpec의 핵심 아이디어와 그것들이 어떻게 연결되는지 설명합니다. 실용적인 사용법은 [시작하기](getting-started.md) 및 [워크플로우](workflows.md)를 참조하십시오.

## 철학

OpenSpec은 네 가지 원칙을 중심으로 구축되었습니다:

```
fluid not rigid         — 단계적 게이트 없음, 의미 있는 작업 수행
iterative not waterfall — 구축하면서 배우고, 진행하면서 정제
easy not complex        — 가벼운 설정, 최소한의 형식
brownfield-first        — 신규 개발뿐만 아니라 기존 코드베이스와 호환
```

### 이러한 원칙이 중요한 이유

**유연함, 경직되지 않음.** 전통적인 명세 시스템은 단계에 고정시킵니다: 먼저 계획한 다음 구현하고, 그러면 끝입니다. OpenSpec은 더 유연합니다 — 작업에 의미 있는 순서대로 아티팩트를 생성할 수 있습니다.

**폭포수가 아닌 반복적.** 요구사항은 변합니다. 이해는 깊어집니다. 처음에는 좋은 접근 방식처럼 보였던 것이 코드베이스를 살펴본 후에는 유지되지 않을 수 있습니다. OpenSpec은 이 현실을 수용합니다.

**복잡하지 않은 쉬움.** 일부 명세 프레임워크는 광범위한 설정, 엄격한 형식 또는 무거운 프로세스를 요구합니다. OpenSpec은 방해하지 않습니다. 몇 초 안에 초기화하고, 즉시 작업을 시작하며, 필요할 때만 사용자 정의할 수 있습니다.

**기존 코드베이스 우선.** 대부분의 소프트웨어 작업은 처음부터 만드는 것이 아닙니다 — 기존 시스템을 수정하는 것입니다. OpenSpec의 델타 기반 접근 방식은 새로운 시스템을 설명하는 것뿐만 아니라 기존 동작의 변경 사항을 명세하기 쉽게 만듭니다.

## 전체 구조

OpenSpec는 작업을 두 가지 주요 영역으로 구성합니다:

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

**Specs**는 진실의 원천입니다 — 시스템의 현재 동작 방식을 설명합니다.

**Changes**는 제안된 수정 사항입니다 — 병합할 준비가 될 때까지 별도의 폴더에 보관됩니다.

이 분리가 핵심입니다. 충돌 없이 여러 변경 사항을 동시에 작업할 수 있습니다. 주요 스펙에 영향을 미치기 전에 변경 사항을 검토할 수 있습니다. 그리고 변경 사항을 아카이브하면 델타가 깔끔하게 진실의 원천에 병합됩니다.

## 조정 워크스페이스

워크스페이스 지원은 현재 활발히 개발 중이며 아직 사용할 준비가 되지 않았습니다. 워크스페이스 동작을 기반으로 외부 자동화, 통합 또는 장기 워크플로를 구축하지 마세요. 명령어, 상태 파일 및 JSON 출력은 언제든지 변경될 수 있습니다.

아래 명령어는 연결된 리포 또는 폴더 전반에 걸친 계획을 위한 초기 설정 흐름을 제공합니다.

리포 로컬 OpenSpec 프로젝트는 하나의 리포가 계획, 구현 및 아카이브 흐름을 소유할 때 적합한 기본값입니다. 일부 작업은 여러 리포 또는 폴더에 걸쳐 있습니다. 이러한 경우 OpenSpec 조정 워크스페이스가 영구적인 계획 허브가 됩니다.

워크스페이스의 개념 모델은 다음과 같습니다:

```text
workspace = where related cross-repo changes live
link      = a stable name for a repo or folder the workspace can plan against
change    = one feature, fix, project, or other planned piece of work
```

워크스페이스는 리포 로컬 프로젝트와 다른 구조를 가집니다:

```text
workspace-folder/
├── changes/                       # Workspace-level planning
└── .openspec-workspace/
    ├── workspace.yaml             # Shared workspace identity and link names
    └── local.yaml                 # This machine's local paths
```

리포 로컬 OpenSpec 상태는 기존 구조를 유지합니다:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

이 구분이 중요합니다. 워크스페이스 폴더는 연결된 리포 또는 폴더 전반에 걸친 계획을 위한 조정 표면입니다. 각 리포의 `openspec/` 디렉터리는 리포 소유 스펙, 리포 로컬 변경 사항 및 구현 계획의 허브로 남습니다. 사용자는 워크스페이스 폴더 내에서 리포 로컬 `openspec init`을 실행할 필요가 없습니다.

안정적인 링크 이름은 워크스페이스 계획이 리포 및 폴더를 참조하는 방법입니다. 공유 워크스페이스 상태는 `api`, `web` 또는 `checkout`과 같은 이름을 유지하며, 각 머신은 `.openspec-workspace/local.yaml`에서 해당 이름을 자체 로컬 경로에 매핑합니다.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

OpenSpec가 생성한 워크스페이스는 기본적으로 이식 가능한 협업 상태에서 `.openspec-workspace/local.yaml`을 제외합니다. `.openspec-workspace/workspace.yaml`은 워크스페이스 이름과 안정적인 링크 이름을 저장하므로 이식 가능하며, 특정 사용자의 절대 체크아웃 경로는 포함하지 않습니다.

연결된 경로는 전체 리포, 대형 모노레포 내부의 폴더 또는 기타 기존 폴더일 수 있습니다. 워크스페이스 계획에 참여하기 위해 리포 로컬 `openspec/` 상태가 필요하지 않습니다. 이후 구현, 검증 또는 아카이브 워크플로에는 더 많은 리포 준비가 필요할 수 있지만, 계획 가시성은 링크에서 시작됩니다.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

관리되는 워크스페이스는 표준 OpenSpec 데이터 디렉터리 아래에 위치합니다:

```text
getGlobalDataDir()/workspaces
```

이는 `XDG_DATA_HOME`이 설정된 경우 `$XDG_DATA_HOME/openspec/workspaces`, Unix 스타일 폴백 시 `~/.local/share/openspec/workspaces`, 네이티브 Windows 폴백 시 `%LOCALAPPDATA%\openspec\workspaces`를 의미합니다. 네이티브 Windows 셸, PowerShell 및 WSL2는 각각 OpenSpec를 실행하는 런타임의 경로 문자열을 유지합니다. 이 기반은 `D:\repo`, `/mnt/d/repo` 및 UNC WSL 경로 간에 변환하지 않습니다.

OpenSpec는 또한 머신 로컬 레지스트리를 다음 위치에 유지합니다:

```text
getGlobalDataDir()/workspaces/registry.yaml
```

레지스트리는 워크스페이스 이름을 워크스페이스 위치에 매핑하여 이후 전역 명령어가 어디서든 알려진 워크스페이스를 나열하거나 선택할 수 있게 합니다. 이는 인덱스일 뿐입니다. 각 워크스페이스 폴더는 자체 `.openspec-workspace/workspace.yaml`과 `.openspec-workspace/local.yaml`에 대한 권위를 유지하므로, 오래된 레지스트리 레코드는 워크스페이스 자체를 재정의하지 않고 보고 및 복구할 수 있습니다.

워크스페이스 가시성은 변경 확정이 아닙니다. OpenSpec가 어떤 리포 또는 폴더가 관련 있는지 알아야 할 때 워크스페이스를 설정하세요. 기능, 수정, 프로젝트 또는 기타 작업을 계획할 준비가 되면 나중에 변경 사항을 생성하세요.

유용한 명령어:

```bash
# Guided setup
openspec workspace setup

# Automation-friendly setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# See known workspaces from the local registry
openspec workspace list
openspec workspace ls

# Add or repair links for the selected workspace
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Check what this machine can resolve
openspec workspace doctor
openspec workspace doctor --workspace platform

# Open the linked working set
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

`workspace setup`은 항상 표준 워크스페이스 위치에 워크스페이스를 생성하고, 로컬 레지스트리에 기록하며, 워크스페이스 위치를 표시하고, 최소 하나의 연결된 리포 또는 폴더를 요구합니다. 대화형 설정에서는 선호하는 오프너를 요청합니다. 비대화형 설정에서는 `--opener codex`, `--opener claude`, `--opener github-copilot` 또는 `--opener editor`가 제공될 때만 하나를 저장합니다.

OpenSpec는 또한 루트 워크스페이스 열기 파일도 유지합니다: `AGENTS.md`의 OpenSpec 관리 가이드 블록, VS Code 및 GitHub Copilot-in-VS-Code 열기를 위한 머신 로컬 `<workspace-name>.code-workspace` 파일, 그리고 해당 관리 `.code-workspace` 파일에 대한 특정 무시 항목입니다. 사용자가 작성한 `*.code-workspace` 파일은 무시 규칙이 관리 파일만 대상으로 하므로 계속 추적 가능합니다.

관리되는 VS Code 워크스페이스에는 조정 루트가 `.`으로 포함되고, 유효한 연결된 리포 또는 폴더가 추가 루트로 포함됩니다. VS Code는 해당 항목들을 멀티 루트 워크스페이스로 표시합니다.

`workspace open`은 해당 세션에 대해 `--agent <tool>` 또는 `--editor`가 전달되지 않는 한 저장된 선호 오프너로 연결된 작업 세트를 엽니다. 두 오프너 오버라이드를 모두 전달하면 오류가 발생합니다. 루트 워크스페이스 열기는 연결된 리포 및 폴더를 탐색 및 계획에 가시적으로 만듭니다. 구현은 사용자가 명시적으로 구현 작업을 요청한 후 시작됩니다.

`workspace link`와 `workspace relink`는 기존 폴더만 기록합니다. 연결된 리포 또는 폴더를 생성, 복사, 이동, 초기화 또는 편집하지 않습니다. 성공적인 링크 또는 리링크 후, OpenSpec는 관리되는 가이드, VS Code 워크스페이스 파일 및 무시 규칙을 새로고침합니다.

하나의 워크스페이스가 필요한 워크스페이스 명령어는 `--workspace <name>`과 함께 어디서든 실행할 수 있습니다. 워크스페이스 폴더 또는 하위 디렉터리 내에서 실행하면, OpenSpec는 현재 워크스페이스를 사용합니다. 여러 알려진 워크스페이스가 있고 `--workspace <name>`을 전달하지 않으면, 대화형 명령어는 선택기를 표시합니다. `--json`과 `--no-interactive`는 프롬프트 대신 구조화된 상태 오류로 실패합니다.

직접 워크스페이스 명령어는 스크립트를 위한 JSON 출력을 지원합니다. JSON 응답은 주요 데이터를 `workspace`, `workspaces` 또는 `link` 객체에 유지하고 경고 또는 오류를 `status` 배열에 보고합니다. 정상 객체는 `status: []`를 사용합니다.

## 스펙

스펙은 구조화된 요구사항과 시나리오를 사용하여 시스템의 동작을 설명합니다.

### 구조

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

시스템에 의미 있는 논리적 그룹인 도메인별로 스펙을 구성하세요. 일반적인 패턴:

- **기능 영역별**: `auth/`, `payments/`, `search/`
- **구성 요소별**: `api/`, `frontend/`, `workers/`
- **한정된 컨텍스트별**: `ordering/`, `fulfillment/`, `inventory/`

### 스펙 형식

스펙은 요구사항을 포함하며, 각 요구사항에는 시나리오가 있습니다:

```markdown
# Auth Specification
```

## 목적
애플리케이션의 인증 및 세션 관리.

## 요구 사항

### 요구 사항: 사용자 인증
시스템은 로그인 성공 시 JWT 토큰을 발급해야 한다.

#### 시나리오: 유효한 자격 증명
- GIVEN 유효한 자격 증명을 가진 사용자가
- WHEN 로그인 양식을 제출하면
- THEN JWT 토큰이 반환되고
- AND 사용자가 대시보드로 리디렉션된다

#### 시나리오: 잘못된 자격 증명
- GIVEN 잘못된 자격 증명이
- WHEN 로그인 양식을 제출하면
- THEN 오류 메시지가 표시되고
- AND 토큰은 발급되지 않는다

### 요구 사항: 세션 만료
시스템은 30분 동안 활동이 없으면 세션을 만료시켜야 한다.

#### 시나리오: 유휴 시간 초과
- GIVEN 인증된 세션이
- WHEN 30분 동안 활동 없이 경과하면
- THEN 세션이 무효화되고
- AND 사용자는 재인증해야 한다
```

**핵심 요소:**

| 요소 | 목적 |
|---------|---------|
| `## Purpose` | 이 사양의 영역에 대한 상위 수준 설명 |
| `### Requirement:` | 시스템이 가져야 하는 특정 동작 |
| `#### Scenario:` | 요구 사항이 실제로 적용되는 구체적인 예시 |
| SHALL/MUST/SHOULD | 요구 사항 강도를 나타내는 RFC 2119 키워드 |

### 사양을 이런 방식으로 구성하는 이유

**요구 사항은 "무엇(what)"** — 구현을 지정하지 않고 시스템이 무엇을 해야 하는지를 명시합니다.

**시나리오는 "언제(when)"** — 검증할 수 있는 구체적인 예시를 제공합니다. 좋은 시나리오는:
- 테스트 가능해야 합니다 (자동화된 테스트를 작성할 수 있어야 함)
- 정상 경로와 엣지 케이스를 모두 다루어야 합니다
- Given/When/Then 또는 유사한 구조화된 형식을 사용합니다

**RFC 2119 키워드** (SHALL, MUST, SHOULD, MAY)는 의도를 전달합니다:
- **MUST/SHALL** — 절대적 요구 사항
- **SHOULD** — 권장되지만 예외가 존재함
- **MAY** — 선택 사항

### 사양이란 무엇인가 (그리고 무엇이 아닌가)

사양은 **행동 계약**이지 구현 계획이 아닙니다.

좋은 사양 내용:
- 사용자 또는 다운스트림 시스템이 의존하는 관찰 가능한 동작
- 입력, 출력 및 오류 조건
- 외부 제약 조건 (보안, 개인정보 보호, 신뢰성, 호환성)
- 테스트하거나 명시적으로 검증할 수 있는 시나리오

사양에서 피해야 할 것:
- 내부 클래스/함수 이름
- 라이브러리 또는 프레임워크 선택
- 단계별 구현 세부 사항
- 상세 실행 계획 (이것은 `design.md` 또는 `tasks.md`에 속함)

간단한 테스트:
- 외부적으로 보이는 동작을 변경하지 않고 구현을 변경할 수 있다면, 그것은 사양에 속하지 않을 가능성이 높습니다.

### 가볍게 유지하기: 점진적 엄격함

OpenSpec은 관료주의를 피하려고 합니다. 변경 사항을 검증 가능하게 만드는 가장 가벼운 수준을 사용하세요.

**라이트 사양 (기본):**
- 짧은 행동 중심 요구 사항
- 명확한 범위와 비목표
- 몇 가지 구체적인 수용 검사

**풀 사양 (더 높은 위험의 경우):**
- 팀 간 또는 저장소 간 변경
- API/계약 변경, 마이그레이션, 보안/개인정보 보호 문제
- 모호성이 값비싼 재작업을 초래할 가능성이 있는 변경

대부분의 변경은 라이트 모드에 머물러야 합니다.

### 인간 + 에이전트 협업

많은 팀에서 인간이 탐색하고 에이전트가 아티팩트를 초안합니다. 의도된 루프는 다음과 같습니다:

1. 인간이 의도, 맥락 및 제약 조건을 제공합니다.
2. 에이전트가 이를 행동 중심 요구 사항과 시나리오로 변환합니다.
3. 에이전트는 구현 세부 사항을 `design.md`와 `tasks.md`에 유지하고, `spec.md`에는 두지 않습니다.
4. 검증이 구현 전에 구조와 명확성을 확인합니다.

이렇게 하면 사양은 인간에게는 읽기 쉽고 에이전트에게는 일관성을 유지합니다.

## 변경

변경은 시스템에 대한 제안된 수정 사항으로, 이를 이해하고 구현하는 데 필요한 모든 것이 포함된 폴더 형태로 패키징됩니다.

### 변경 구조

```
openspec/changes/add-dark-mode/
├── proposal.md           # 이유와 내용
├── design.md             # 방법 (기술적 접근 방식)
├── tasks.md              # 구현 체크리스트
├── .openspec.yaml        # 변경 메타데이터 (선택 사항)
└── specs/                # 델타 명세
    └── ui/
        └── spec.md       # ui/spec.md에서 변경되는 내용
```

각 변경은 자체 포함됩니다. 다음을 포함합니다:
- **아티팩트** — 의도, 설계 및 작업을 기록하는 문서
- **델타 명세** — 추가, 수정 또는 제거되는 사항에 대한 명세
- **메타데이터** — 이 특정 변경에 대한 선택적 구성

### 변경이 폴더인 이유

변경을 폴더로 패키징하면 여러 가지 이점이 있습니다:

1. **모든 것이 함께 있습니다.** 제안서, 설계, 작업 및 명세가 한 곳에 있습니다. 다른 위치를 찾아다닐 필요가 없습니다.

2. **병렬 작업.** 여러 변경이 동시에 존재할 수 있으며 충돌하지 않습니다. `fix-auth-bug`가 진행 중인 동안 `add-dark-mode` 작업을 할 수 있습니다.

3. **깔끔한 기록.** 아카이브될 때, 변경 사항은 전체 컨텍스트가 보존된 채로 `changes/archive/`로 이동합니다. 무엇이 변경되었는지뿐만 아니라 왜 변경되었는지 나중에 확인할 수 있습니다.

4. **리뷰 용이성.** 변경 폴더는 리뷰하기 쉽습니다 — 열어서 제안서를 읽고, 설계를 확인하고, 명세 델타를 볼 수 있습니다.

## 아티팩트

아티팩트는 변경 내에서 작업을 안내하는 문서입니다.

### 아티팩트 흐름

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   이유            내용           방법          단계
 + 범위        변경 사항       접근 방식      수행할 작업
```

아티팩트는 서로를 기반으로 합니다. 각 아티팩트는 다음 아티팩트를 위한 컨텍스트를 제공합니다.

### 아티팩트 유형

#### 제안서 (`proposal.md`)

제안서는 높은 수준에서 **의도**, **범위** 및 **접근 방식**을 기록합니다.

```markdown
# 제안서: 다크 모드 추가

## 의도
사용자들이 야간 사용 시 눈의 피로를 줄이고 시스템 환경 설정과 일치시키기 위해 다크 모드 옵션을 요청했습니다.

## 범위
포함 범위:
- 설정에서 테마 전환
- 시스템 환경 설정 감지
- localStorage에 환경 설정 저장

제외 범위:
- 사용자 정의 색상 테마 (향후 작업)
- 페이지별 테마 오버라이드

## 접근 방식
상태 관리를 위해 React 컨텍스트와 함께 테마 설정을 위해 CSS 사용자 정의 속성을 사용합니다. 첫 로드 시 시스템 환경 설정을 감지하고 수동 오버라이드를 허용합니다.
```

**제안서를 업데이트해야 할 때:**
- 범위 변경 (축소 또는 확장)
- 의도 명확화 (문제에 대한 더 나은 이해)
- 접근 방식의 근본적 변경

#### 명세 (specs/의 델타 명세)

델타 명세는 전체 명세를 다시 진술하는 대신 현재 명세에 대해 **무엇이 변경되는지**를 설명합니다. 아래의 [델타 명세](#델타-명세)를 참조하십시오.

#### 설계 (`design.md`)

설계는 **기술적 접근 방식**과 **아키텍처 결정**을 기록합니다.

````markdown
# 설계: 다크 모드 추가

## 기술적 접근 방식
prop 드릴링을 피하기 위해 React 컨텍스트를 통해 테마 상태를 관리합니다. CSS 사용자 정의 속성을 사용하면 클래스 전환 없이 런타임 전환이 가능합니다.

## 아키텍처 결정

### 결정: Redux 대신 컨텍스트
다음과 같은 이유로 테마 상태에 React 컨텍스트를 사용합니다:
- 단순한 이진 상태 (라이트/다크)
- 복잡한 상태 전환 없음
- Redux 의존성 추가 방지

### 결정: CSS 사용자 정의 속성
다음과 같은 이유로 CSS-in-JS 대신 CSS 변수를 사용합니다:
- 기존 스타일시트와 작동
- 런타임 오버헤드 없음
- 브라우저 네이티브 솔루션

## 데이터 흐름
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## 파일 변경
- `src/contexts/ThemeContext.tsx` (새 파일)
- `src/components/ThemeToggle.tsx` (새 파일)
- `src/styles/globals.css` (수정됨)
````

**설계를 업데이트해야 할 때:**
- 구현 과정에서 접근 방식이 작동하지 않음이 드러날 때
- 더 나은 솔루션이 발견될 때
- 의존성 또는 제약 조건이 변경될 때

#### 작업 (`tasks.md`)

작업은 **구현 체크리스트** — 체크박스가 있는 구체적인 단계입니다.

```markdown
# 작업

## 1. 테마 인프라
- [ ] 1.1 라이트/다크 상태를 가진 ThemeContext 생성
- [ ] 1.2 색상을 위한 CSS 사용자 정의 속성 추가
- [ ] 1.3 localStorage 지속성 구현
- [ ] 1.4 시스템 환경 설정 감지 추가

## 2. UI 컴포넌트
- [ ] 2.1 ThemeToggle 컴포넌트 생성
- [ ] 2.2 설정 페이지에 토글 추가
- [ ] 2.3 빠른 토글을 포함하도록 Header 업데이트

## 3. 스타일링
- [ ] 3.1 다크 테마 색상 팔레트 정의
- [ ] 3.2 CSS 변수를 사용하도록 컴포넌트 업데이트
- [ ] 3.3 접근성을 위한 대비율 테스트
```

**작업 모범 사례:**
- 관련 작업을 제목 아래에 그룹화
- 계층적 번호 사용 (1.1, 1.2 등)
- 작업을 한 세션에 완료할 수 있을 만큼 작게 유지
- 작업을 완료할 때 체크 표시

## 델타 명세

델타 명세는 OpenSpec이 기존 시스템 개발에 작동하게 하는 핵심 개념입니다. 전체 명세를 다시 진술하는 대신 **무엇이 변경되는지**를 설명합니다.

### 형식

```markdown
# Auth 델타

## 추가된 요구 사항

### 요구 사항: 이중 인증
시스템은 TOTP 기반 이중 인증을 지원해야 합니다.

#### 시나리오: 2FA 등록
- 2FA가 활성화되지 않은 사용자가 주어졌을 때
- 사용자가 설정에서 2FA를 활성화하면
- 인증 앱 설정을 위한 QR 코드가 표시됨
- 사용자는 활성화 전에 코드로 인증해야 함

#### 시나리오: 2FA 로그인
- 2FA가 활성화된 사용자가 주어졌을 때
- 사용자가 유효한 자격 증명을 제출하면
- OTP 챌린지가 제시됨
- 유효한 OTP 이후에만 로그인 완료

## 수정된 요구 사항

### 요구 사항: 세션 만료
시스템은 15분 동안 비활성 상태 후 세션을 만료시켜야 합니다.
(이전: 30분)

#### 시나리오: 유휴 시간 초과
- 인증된 세션이 주어졌을 때
- 활동 없이 15분이 지나면
- 세션이 무효화됨

## 제거된 요구 사항

### 요구 사항: 로그인 상태 유지
(2FA로 대체되었습니다. 사용자는 각 세션마다 다시 인증해야 합니다.)
```

### 델타 섹션

| 섹션 | 의미 | 아카이브 시 발생하는 일 |
|---------|---------|------------------------|
| `## 추가된 요구 사항` | 새로운 동작 | 메인 명세에 추가됨 |
| `## 수정된 요구 사항` | 변경된 동작 | 기존 요구 사항을 대체함 |
| `## 제거된 요구 사항` | 더 이상 사용되지 않는 동작 | 메인 명세에서 삭제됨 |

### 전체 명세 대신 델타를 사용하는 이유

**명확성.** 델타는 정확히 무엇이 변경되는지 보여줍니다. 전체 명세를 읽으면 현재 버전과 정신적으로 비교해야 합니다.

**충돌 방지.** 두 변경이 서로 다른 요구 사항을 수정하는 한, 동일한 명세 파일을 수정해도 충돌하지 않습니다.

**리뷰 효율성.** 리뷰어는 변경 사항을 보지, 변경되지 않은 컨텍스트를 보지 않습니다. 중요한 것에 집중합니다.

**기존 시스템에 적합.** 대부분의 작업은 기존 동작을 수정합니다. 델타는 수정을 사후 처리가 아닌 우선 처리 대상으로 만듭니다.

## 스키마

스키마는 워크플로우를 위한 아티팩트 유형과 그 의존성을 정의합니다.

### 스키마 작동 방식

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # 의존성 없음, 먼저 생성 가능

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # 생성 전에 proposal 필요

  - id: design
    generates: design.md
    requires: [proposal]      # specs와 병렬로 생성 가능

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # specs와 design 모두 먼저 필요
```

**아티팩트는 의존성 그래프를 형성합니다:**

```
                    proposal
                   (루트 노드)
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

**의존성은 활성화 요소이지, 게이트가 아닙니다.** 이것은 다음에 무엇을 생성해야 하는지가 아니라, 무엇을 생성할 수 있는지를 보여줍니다. 필요하지 않다면 design을 건너뛸 수 있습니다. design 전후로 specs를 생성할 수 있습니다 — 둘 다 proposal에만 의존합니다.

### 내장 스키마

**spec-driven** (기본값)

스펙 주도 개발을 위한 표준 워크플로우:

```
proposal → specs → design → tasks → implement
```

적합한 경우: 구현 전에 스펙에 합의하고 싶은 대부분의 기능 작업.

### 사용자 정의 스키마

팀의 워크플로우에 맞는 사용자 정의 스키마를 생성합니다:

```bash
# 처음부터 생성
openspec schema init research-first

# 또는 기존 스키마를 포크
openspec schema fork spec-driven research-first
```

**사용자 정의 스키마 예시:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # 먼저 조사 수행

  - id: proposal
    generates: proposal.md
    requires: [research]   # 조사를 바탕으로 한 제안

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # specs/design 건너뛰고 바로 tasks로 진행
```

사용자 정의 스키마 생성 및 사용에 대한 자세한 내용은 [사용자 정의](customization.md)를 참조하세요.

## 아카이브

아카이브는 변경 사항의 델타 스펙을 메인 스펙에 병합하고 변경 사항을 기록으로 보존하여 변경을 완료합니다.

### 아카이브 시 발생하는 일

```
아카이브 전:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ 병합
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


아카이브 후:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # 이제 2FA 요구 사항 포함
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # 기록으로 보존됨
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### 아카이브 프로세스

1. **델타 병합.** 각 델타 스펙 섹션(추가/수정/삭제)이 해당 메인 스펙에 적용됩니다.
2. **아카이브로 이동.** 변경 폴더가 시간순 정렬을 위해 날짜 접두사와 함께 `changes/archive/`로 이동됩니다.
3. **맥락 보존.** 모든 아티팩트는 아카이브에 그대로 남아 있습니다. 변경이 이루어진 이유를 항상 다시 확인할 수 있습니다.

### 아카이브가 중요한 이유

**깨끗한 상태.** 활성 변경(`changes/`)에는 진행 중인 작업만 표시됩니다. 완료된 작업은 길에서 벗어납니다.

**감사 추적.** 아카이브는 모든 변경의 전체 맥락을 보존합니다 — 무엇이 바뀌었는지뿐만 아니라, 왜 바뀌었는지 설명하는 제안서, 어떻게 바뀌었는지 설명하는 설계서, 그리고 수행된 작업을 보여주는 작업 목록까지.

**스펙의 진화.** 스펙은 변경이 아카이브됨에 따라 유기적으로 성장합니다. 각 아카이브는 델타를 병합하여 시간이 지남에 따라 포괄적인 사양을 구축합니다.

## 전체 통합 구조

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC 흐름                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. 변경 시작   │  /opsx:propose (핵심) 또는 /opsx:new (확장)             │
│   │                │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. 아티팩트    │  /opsx:ff 또는 /opsx:continue (확장 워크플로우)          │
│   │     생성        │  proposal → specs → design → tasks 생성                │
│   │                │  (스키마 의존성 기반)                                    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. 작업 구현   │  /opsx:apply                                            │
│   │                │  작업을 진행하며 완료 체크                                │
│   │                │◄──── 학습한 내용에 따라 아티팩트 업데이트                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. 작업 검증   │  /opsx:verify (선택 사항)                               │
│   │                │  구현이 스펙과 일치하는지 확인                            │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. 변경 아카이브│────►│  델타 스펙이 메인 스펙에 병합됨               │    │
│   │                │     │  변경 폴더가 archive/로 이동됨                │    │
│   └────────────────┘     │  스펙이 이제 업데이트된 진실의 원천이 됨      │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**선순환 구조:**

1. 스펙은 현재 동작을 설명합니다.
2. 변경은 수정 사항을 제안합니다 (델타 형태로).
3. 구현은 변경을 실현합니다.
4. 아카이브는 델타를 스펙에 병합합니다.
5. 스펙은 이제 새로운 동작을 설명합니다.
6. 다음 변경은 업데이트된 스펙을 기반으로 합니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **아티팩트** | 변경 내의 문서 (제안서, 설계서, 작업 목록 또는 델타 스펙) |
| **아카이브** | 변경을 완료하고 그 델타를 메인 스펙에 병합하는 프로세스 |
| **변경** | 시스템에 대한 제안된 수정 사항, 아티팩트가 포함된 폴더로 패키징됨 |
| **델타 스펙** | 현재 스펙에 대한 변경 사항(추가/수정/삭제)을 설명하는 스펙 |
| **도메인** | 스펙의 논리적 그룹 (예: `auth/`, `payments/`) |
| **요구 사항** | 시스템이 가져야 하는 특정 동작 |
| **시나리오** | 요구 사항의 구체적인 예시, 일반적으로 Given/When/Then 형식 |
| **스키마** | 아티팩트 유형과 그 의존성의 정의 |
| **스펙** | 시스템 동작을 설명하는 사양, 요구 사항과 시나리오를 포함 |
| **진실의 원천** | 현재 합의된 동작을 포함하는 `openspec/specs/` 디렉토리 |

## 다음 단계

- [시작하기](getting-started.md) - 실용적인 첫 단계
- [워크플로우](workflows.md) - 일반적인 패턴과 각각의 사용 시기
- [명령어](commands.md) - 전체 명령어 참조
- [사용자 정의](customization.md) - 사용자 정의 스키마 생성 및 프로젝트 구성