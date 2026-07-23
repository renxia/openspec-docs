# 명령어

이 문서는 OpenSpec의 슬래시 명령어 참고서입니다. 이 명령어들은 AI 코딩 어시스턴트의 채팅 인터페이스(예: Claude Code, Cursor, Windsurf)에서 실행됩니다.

워크플로 패턴과 각 명령어의 사용 시점은 [워크플로](workflows.md)를 참고하세요. CLI 명령어는 [CLI](cli.md)를 참고하세요.

## 빠른 참고

### 기본 빠른 경로 (`core` 프로필)

| 명령어 | 목적 |
|---------|---------|
| `/opsx:propose` | 변경 사항을 생성하고 계획 산출물을 한 단계로 생성합니다 |
| `/opsx:explore` | 변경 사항을 확정하기 전에 아이디어를 검토합니다 |
| `/opsx:apply` | 변경 사항의 작업을 구현합니다 |
| `/opsx:update` | 변경 사항의 계획 산출물을 수정하고 일관성을 유지합니다 |
| `/opsx:sync` | 델타 명세를 메인 명세에 병합합니다 |
| `/opsx:archive` | 완료된 변경 사항을 아카이브합니다 |

### 확장 워크플로 명령어 (커스텀 워크플로 선택)

| 명령어 | 목적 |
|---------|---------|
| `/opsx:new` | 새 변경 스캐폴드를 시작합니다 |
| `/opsx:continue` | 의존성을 기반으로 다음 산출물을 생성합니다 |
| `/opsx:ff` | 패스트포워드: 모든 계획 산출물을 한 번에 생성합니다 |
| `/opsx:verify` | 구현이 산출물과 일치하는지 검증합니다 |
| `/opsx:bulk-archive` | 여러 변경 사항을 한 번에 아카이브합니다 |
| `/opsx:onboard` | 전체 워크플로를 안내하는 튜토리얼을 실행합니다 |

기본 전역 프로필은 `core`입니다. 확장 워크플로 명령어를 사용하려면 `openspec config profile`을 실행해 워크플로를 선택한 후, 프로젝트에서 `openspec update`를 실행하세요.

## 명령어 참조

### `/opsx:propose`

한 단계로 새로운 변경을 생성하고 계획 산출물을 생성합니다. 이것은 `core` 프로필의 기본 시작 명령어입니다.

**구문:**
```text
/opsx:propose [change-name-or-description]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name-or-description` | 아니오 | 케밥 케이스 이름 또는 일반 언어로 된 변경 설명 |

**기능:**
- `openspec/changes/<change-name>/` 디렉터리를 생성합니다
- 구현 전에 필요한 산출물을 생성합니다 (`spec-driven`의 경우: 제안서, 사양, 설계, 작업)
- 변경이 `/opsx:apply` 실행 준비가 되면 중단합니다

**예시:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**팁:**
- 가장 빠른 엔드투엔드 경로를 원할 때 사용하세요
- 단계별 산출물 제어를 원한다면 확장 워크플로우를 활성화하고 `/opsx:new` + `/opsx:continue`를 사용하세요

---

### `/opsx:explore`

> **확실하지 않을 때 여기서 시작하세요.** Explore는 아무런 부담 없는 사고 파트너입니다. 코드베이스를 읽고 옵션을 비교하며, 변경이 생성되기 전에 모호한 아이디어를 구체적인 계획으로 다듬습니다. 기본 프로필에 포함되어 있습니다. 전체 사례와 더 많은 예시는 [Explore First](explore.md) 가이드를 참조하세요.

변경을 약속하기 전에 아이디어를 생각하고, 문제를 조사하며, 요구사항을 명확히 하세요.

**구문:**
```
/opsx:explore [topic]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `topic` | 아니오 | 탐색하거나 조사하고 싶은 주제 |

**기능:**
- 구조가 필요 없는 탐색적 대화를 시작합니다
- 질문에 답하기 위해 코드베이스를 조사합니다
- 옵션과 접근 방식을 비교합니다
- 사고를 명확히 하기 위해 시각적 다이어그램을 생성합니다
- 통찰이 구체화되면 `/opsx:propose`(기본값) 또는 `/opsx:new`(확장 워크플로우)로 전환할 수 있습니다

**예시:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**팁:**
- 요구사항이 불분명하거나 조사가 필요할 때 사용하세요
- 탐색 중에는 산출물이 생성되지 않습니다
- 결정하기 전에 여러 접근 방식을 비교하는 데 적합합니다
- 파일을 읽고 코드베이스를 검색할 수 있습니다

---

### `/opsx:new`

새로운 변경 스캐폴드를 시작합니다. 변경 폴더를 생성하고 `/opsx:continue` 또는 `/opsx:ff`로 산출물을 생성할 때까지 대기합니다.

이 명령어는 확장 워크플로우 세트의 일부입니다(기본 `core` 프로필에 포함되지 않음).

**구문:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 변경 폴더의 이름(제공하지 않으면 프롬프트로 입력) |
| `--schema` | 아니오 | 사용할 워크플로우 스키마(기본값: 설정에서 가져오기 또는 `spec-driven`) |

**기능:**
- `openspec/changes/<change-name>/` 디렉터리를 생성합니다
- 변경 폴더에 `.openspec.yaml` 메타데이터 파일을 생성합니다
- 생성 준비가 된 첫 번째 산출물 템플릿을 표시합니다
- 제공하지 않으면 변경 이름과 스키마를 프롬프트로 입력합니다

**생성되는 항목:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # 변경 메타데이터 (스키마, 생성 날짜)
```

**예시:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**팁:**
- 설명이 포함된 이름을 사용하세요: `add-feature`, `fix-bug`, `refactor-module`
- `update`, `changes`, `wip`와 같은 일반적인 이름은 피하세요
- 스키마는 프로젝트 설정(`openspec/config.yaml`)에서도 설정할 수 있습니다

---

### `/opsx:continue`

의존성 체인에서 다음 산출물을 생성합니다. 점진적 진행을 위해 한 번에 하나의 산출물을 생성합니다.

**구문:**
```
/opsx:continue [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 계속할 변경(제공하지 않으면 컨텍스트에서 추론) |

**기능:**
- 산출물 의존성 그래프를 쿼리합니다
- 준비됨 vs 차단됨 산출물을 표시합니다
- 첫 번째 준비된 산출물을 생성합니다
- 컨텍스트를 위해 의존성 파일을 읽습니다
- 생성 후 사용 가능해지는 항목을 표시합니다

**예시:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**팁:**
- 계속하기 전에 각 산출물을 검토하고 싶을 때 사용하세요
- 제어가 필요한 복잡한 변경에 적합합니다
- 여러 산출물이 동시에 준비될 수 있습니다
- 계속하기 전에 생성된 산출물을 편집할 수 있습니다

---

### `/opsx:ff`

산출물 생성을 빠르게 진행합니다. 모든 계획 산출물을 한 번에 생성합니다.

**구문:**
```
/opsx:ff [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 빠르게 진행할 변경(제공하지 않으면 컨텍스트에서 추론) |

**기능:**
- 의존성 순서대로 모든 산출물을 생성합니다
- 할 일 목록을 통해 진행 상황을 추적합니다
- 모든 `apply-required` 산출물이 완료되면 중단합니다
- 다음 산출물을 생성하기 전에 각 의존성을 읽습니다

**예시:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**팁:**
- 구축하려는 것이 명확할 때 사용하세요
- 간단한 변경의 경우 `/opsx:continue`보다 빠릅니다
- 생성 후에도 산출물을 편집할 수 있습니다
- 소규모~중간 규모 기능에 적합합니다

---

### `/opsx:apply`

변경의 작업을 구현합니다. 작업 목록을 진행하면서 코드를 작성하고 항목을 체크합니다.

**구문:**
```
/opsx:apply [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 구현할 변경(제공하지 않으면 컨텍스트에서 추론) |

**기능:**
- `tasks.md`를 읽고 미완료 작업을 식별합니다
- 작업을 하나씩 진행합니다
- 필요에 따라 코드를 작성하고, 파일을 생성하고, 테스트를 실행합니다
- 체크박스 `[x]`로 작업을 완료 표시합니다

**예시:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**팁:**
- 중단된 경우 중단한 위치부터 다시 시작할 수 있습니다
- 변경 이름을 지정하여 병렬 변경에 사용하세요
- 완료 상태는 `tasks.md` 체크박스에서 추적됩니다

---

### `/opsx:update`

변경의 기존 계획 산출물을 수정하고 서로 일관성을 유지합니다. 계획 산출물만 수정하며 코드는 편집하지 않습니다.

**구문:**

```text
/opsx:update [change-name]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 업데이트할 변경(제공하지 않으면 컨텍스트에서 추론) |

**기능:**

- `openspec status --change <name> --json`을 통해 변경의 산출물을 읽습니다
- 요청한 수정을 적용하거나, 명명하지 않은 경우 산출물의 모순을 검토합니다
- 다른 기존 산출물을 모든 방향으로 조정합니다(설계 편집이 제안서에 영향을 미칠 수 있음)
- 쓰기 전에 모든 편집을 확인하며 한 번에 하나의 산출물씩 진행합니다
- 다음 단계를 권장하며 종료합니다: `/opsx:continue`(산출물 누락), `/opsx:apply`(수정된 계획을 코드에 반영), `/opsx:archive`(모두 완료)

**예시:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**팁:**

- 누락된 산출물을 생성하지 않습니다 - 그것은 `/opsx:continue`의 기능입니다
- 변경이 이미 구현된 경우 `/opsx:apply`를 후속으로 사용하여 코드가 수정된 계획과 일치하도록 하세요
- 수정이 변경의 *의도*를 변경하는 경우 새 변경으로 시작하는 것이 좋습니다([업데이트 vs 새로 시작 시기](opsx.md#when-to-update-vs-start-fresh) 참조)

---

### `/opsx:verify`

구현이 변경 산출물과 일치하는지 검증합니다. 완전성, 정확성, 일관성을 확인합니다.

**구문:**
```
/opsx:verify [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 검증할 변경(제공하지 않으면 컨텍스트에서 추론) |

**기능:**
- 구현 품질의 세 가지 차원을 확인합니다
- 구현 증거를 찾기 위해 코드베이스를 검색합니다
- CRITICAL, WARNING, SUGGESTION으로 분류된 문제를 보고합니다
- 아카이브를 차단하지 않지만 문제를 표면화합니다

**검증 차원:**

| 차원 | 검증 내용 |
|-----------|-------------------|
| **완전성** | 모든 작업 완료, 모든 요구사항 구현, 시나리오 포함 |
| **정확성** | 구현이 사양 의도와 일치, 엣지 케이스 처리 |
| **일관성** | 설계 결정이 코드에 반영, 패턴 일관성 유지 |

**예시:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**팁:**
- 아카이브하기 전에 불일치를 조기에 발견하려면 실행하세요
- 경고는 아카이브를 차단하지 않지만 잠재적 문제를 나타냅니다
- 커밋하기 전에 AI의 작업을 검토하는 데 적합합니다
- 산출물과 구현 간의 편차를 발견할 수 있습니다

---

### `/opsx:sync`

**선택적 명령어.** 변경의 델타 사양을 메인 사양에 병합합니다. 아카이브가 필요할 경우 동기화를 프롬프트하므로 일반적으로 수동으로 실행할 필요가 없습니다.

**구문:**
```
/opsx:sync [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 동기화할 변경(제공하지 않으면 컨텍스트에서 추론) |

**기능:**
- 변경 폴더에서 델타 사양을 읽습니다
- ADDED/MODIFIED/REMOVED/RENAMED 섹션을 구문 분석합니다
- 변경 사항을 메인 `openspec/specs/` 디렉터리에 병합합니다
- 델타에 언급되지 않은 기존 콘텐츠를 보존합니다
- 변경을 아카이브하지 않습니다(활성 상태 유지)

**예시:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**수동으로 사용하는 경우:**

| 시나리오 | 동기화 사용? |
|----------|-----------|
| 장기 실행 변경, 아카이브하기 전에 메인에 사양을 반영하고 싶을 때 | 예 |
| 여러 병렬 변경이 업데이트된 기본 사양이 필요할 때 | 예 |
| 병합을 별도로 미리보거나 검토하고 싶을 때 | 예 |
| 빠른 변경, 바로 아카이브로 이동할 때 | 아니오(아카이브가 처리함) |

**팁:**
- 동기화는 지능적이며 단순 복사-붙여넣기가 아닙니다
- 기존 요구사항에 시나리오를 중복 없이 추가할 수 있습니다
- 동기화 후 변경은 활성 상태로 유지됩니다(아카이브되지 않음)
- 대부분의 사용자는 직접 호출할 필요가 없습니다 - 아카이브가 필요할 경우 프롬프트합니다

---

### `/opsx:archive`

완료된 변경을 아카이브합니다. 변경을 종료하고 아카이브 폴더로 이동합니다.

**구문:**
```
/opsx:archive [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 아카이브할 변경(제공하지 않으면 컨텍스트에서 추론) |

**기능:**
- 산출물 완료 상태를 확인합니다
- 작업 완료 상태를 확인합니다(미완료 시 경고)
- 아직 동기화되지 않은 경우 델타 사양 동기화를 제안합니다
- 변경 폴더를 `openspec/changes/archive/YYYY-MM-DD-<name>/`으로 이동합니다
- 감사 추적을 위해 모든 산출물을 보존합니다

**예시:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**팁:**
- 아카이브는 미완료 작업을 차단하지 않지만 경고합니다
- 델타 사양은 아카이브 중이나 사전에 동기화할 수 있습니다
- 아카이브된 변경은 기록 보존을 위해 유지됩니다
- 문제를 미리 발견하려면 먼저 `/opsx:verify`를 사용하세요

---

### `/opsx:bulk-archive`

여러 완료된 변경을 한 번에 아카이브합니다. 변경 간 사양 충돌을 처리합니다.

**구문:**
```
/opsx:bulk-archive [change-names...]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-names` | 아니오 | 아카이브할 특정 변경(제공하지 않으면 선택하도록 프롬프트) |

**기능:**
- 모든 완료된 변경을 나열합니다
- 아카이브하기 전에 각 변경을 검증합니다
- 변경 간 사양 충돌을 감지합니다
- 실제로 구현된 내용을 확인하여 충돌을 해결합니다
- 생성 순서대로 아카이브합니다

**예시:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**팁:**
- 병렬 작업 스트림에 적합합니다
- 충돌 해결은 에이전트가 수행합니다(코드베이스 확인)
- 변경은 생성 순서대로 아카이브됩니다
- 사양 콘텐츠를 덮어쓰기 전에 프롬프트합니다

---

### `/opsx:onboard`

전체 OpenSpec 워크플로우를 안내하는 온보딩입니다. 실제 코드베이스를 사용한 대화형 튜토리얼입니다.

**구문:**
```
/opsx:onboard
```

**기능:**
- 내레이션과 함께 완전한 워크플로우 주기를 안내합니다
- 실제 개선 기회를 찾기 위해 코드베이스를 스캔합니다
- 실제 산출물로 실제 변경을 생성합니다
- 실제 작업을 구현합니다(작고 안전한 변경)
- 완료된 변경을 아카이브합니다
- 각 단계가 발생할 때마다 설명합니다

**단계:**
1. 환영 및 코드베이스 분석
2. 개선 기회 찾기
3. 변경 생성(`/opsx:new`)
4. 제안서 작성
5. 사양 생성
6. 설계 작성
7. 작업 생성
8. 작업 구현(`/opsx:apply`)
9. 구현 검증
10. 변경 아카이브
11. 요약 및 다음 단계

**예시:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**팁:**
- 워크플로우를 배우는 새 사용자에게 가장 적합합니다
- 장난감 예시가 아닌 실제 코드를 사용합니다
- 유지하거나 폐기할 수 있는 실제 변경을 생성합니다
- 완료하는 데 15~30분이 소요됩니다

## AI 도구별 명령어 구문

다양한 AI 도구는 약간씩 다른 명령어 구문을 사용합니다. 사용 중인 도구에 맞는 형식을 사용하세요:

| 도구 | 구문 예시 |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | `/openspec-propose`, `/openspec-apply-change` 등 스킬 기반 호출을 사용하며, 생성된 `opsx-*` 명령어 파일은 없습니다 |
| Codex | `.codex/skills/openspec-*`에서 스킬 기반 호출을 사용하며, 생성된 `opsx-*` 프롬프트 파일은 없습니다 |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | `/skill:openspec-propose`, `/skill:openspec-apply-change` 등 스킬 기반 호출을 사용하며, 생성된 `opsx-*` 명령어 파일은 없습니다 |
| Trae | `/opsx-propose`, `/opsx-apply` |

모든 도구의 의도는 동일하지만, 명령어가 노출되는 방식은 통합 방식에 따라 다를 수 있습니다.

> **참고:** GitHub Copilot 명령어(`.github/prompts/*.prompt.md`)는 IDE 확장 프로그램(VS Code, JetBrains, Visual Studio)에서만 사용할 수 있습니다. GitHub Copilot CLI는 현재 사용자 정의 프롬프트 파일을 지원하지 않습니다. 자세한 내용과 해결 방법은 [지원 도구](supported-tools.md)를 참조하세요.

---

## 레거시 명령어

이 명령어는 기존 "일괄 처리" 워크플로우를 사용합니다. 여전히 작동하지만 OPSX 명령어 사용을 권장합니다.

| 명령어 | 기능 |
|---------|--------------|
| `/openspec:proposal` | 한 번에 모든 산출물 생성(제안서, 명세, 설계, 작업 목록) |
| `/openspec:apply` | 변경 사항 구현 |
| `/openspec:archive` | 변경 사항 아카이브 |

**레거시 명령어 사용 시기:**
- 기존 워크플로우를 사용하는 기존 프로젝트
- 점진적 산출물 생성이 필요하지 않은 간단한 변경 사항
- 전부 적용하거나 전부 적용하지 않는 방식을 선호하는 경우

**OPSX로 마이그레이션:**
레거시 변경 사항은 OPSX 명령어로 계속 진행할 수 있습니다. 산출물 구조가 호환됩니다.

---

## 문제 해결

### "변경 사항을 찾을 수 없음"

명령어가 작업할 변경 사항을 식별하지 못했습니다.

**해결 방법:**
- 변경 사항 이름을 명시적으로 지정하세요: `/opsx:apply add-dark-mode`
- 변경 사항 폴더가 존재하는지 확인하세요: `openspec list`
- 올바른 프로젝트 디렉터리에 있는지 확인하세요

### "준비된 산출물이 없음"

모든 산출물이 완료되었거나 누락된 종속성으로 인해 차단된 상태입니다.

**해결 방법:**
- 차단 요인을 확인하려면 `openspec status --change <name>`를 실행하세요
- 필요한 산출물이 존재하는지 확인하세요
- 먼저 누락된 종속성 산출물을 생성하세요

### "스키마를 찾을 수 없음"

지정한 스키마가 존재하지 않습니다.

**해결 방법:**
- 사용 가능한 스키마를 나열하세요: `openspec schemas`
- 스키마 이름의 철자를 확인하세요
- 사용자 정의 스키마인 경우 생성하세요: `openspec schema init <name>`

### 명령어가 인식되지 않음

AI 도구가 OpenSpec 명령어를 인식하지 못합니다.

**해결 방법:**
- OpenSpec이 초기화되었는지 확인하세요: `openspec init`
- 스킬을 재생성하세요: `openspec update`
- `.claude/skills/` 디렉터리가 존재하는지 확인하세요(Claude Code의 경우)
- 새 스킬을 적용하려면 AI 도구를 재시작하세요

### 산출물이 올바르게 생성되지 않음

AI가 불완전하거나 잘못된 산출물을 생성합니다.

**해결 방법:**
- `openspec/config.yaml`에 프로젝트 컨텍스트를 추가하세요
- 특정 가이드라인을 위해 산출물별 규칙을 추가하세요
- 변경 사항 설명에 더 자세한 내용을 추가하세요
- 더 많은 제어를 위해 `/opsx:ff` 대신 `/opsx:continue`를 사용하세요

---

## 다음 단계

- [워크플로우](workflows.md) - 일반적인 패턴과 각 명령어 사용 시기
- [CLI](cli.md) - 관리 및 검증을 위한 터미널 명령어
- [커스터마이징](customization.md) - 사용자 정의 스키마 및 워크플로우 생성