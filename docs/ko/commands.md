# Commands

이 문서는 OpenSpec의 슬래시 명령어(slash commands)에 대한 참조 자료입니다. 이 명령어들은 AI 코딩 어시스턴트의 채팅 인터페이스(예: Claude Code, Cursor, Windsurf)에서 호출됩니다.

워크플로우 패턴 및 각 명령어를 언제 사용해야 하는지에 대해서는 [Workflows]를 참고하십시오. CLI 명령어에 대해서는 [CLI]를 참고하십시오.

## Quick Reference (빠른 참조)

### Default Quick Path (`core` profile)

| Command | Purpose (목적) |
|---------|-------------------|
| `/opsx:propose` | 변경 사항을 생성하고 계획 아티팩트를 한 번에 생성합니다. |
| `/opsx:explore` | 변경 사항을 확정하기 전에 아이디어를 검토합니다. |
| `/opsx:apply` | 변경 사항에서 태스크를 구현합니다. |
| `/opsx:sync` | 델타 스펙(delta specs)을 메인 스펙(main specs)에 병합합니다. |
| `/opsx:archive` | 완료된 변경 사항을 보관합니다. |

### Expanded Workflow Commands (확장된 워크플로우 명령어 - 사용자 지정 워크플로우 선택)

| Command | Purpose (목적) |
|---------|-------------------|
| `/opsx:new` | 새로운 변경 스캐폴드(scaffold)를 시작합니다. |
| `/opsx:continue` | 종속성(dependencies)을 기반으로 다음 아티팩트를 생성합니다. |
| `/opsx:ff` | Fast-forward: 모든 계획 아티팩트를 한 번에 생성합니다. |
| `/opsx:verify` | 구현이 아티팩트와 일치하는지 검증합니다. |
| `/opsx:bulk-archive` | 여러 변경 사항을 한 번에 보관합니다. |
| `/opsx:onboard` | 전체 워크플로우를 안내하는 가이드 튜토리얼입니다. |

기본 전역 프로필드는 `core`입니다. 확장된 워크플로우 명령어를 활성화하려면, `openspec config profile`을 실행하고 워크플로우를 선택한 다음 프로젝트에서 `openspec update`를 실행하십시오.

## 명령어 참조

### `/opsx:propose`

새로운 변경 사항을 생성하고 계획 아티팩트를 한 번에 생성합니다. 이는 `core` 프로필드의 기본 시작 명령어입니다.

**구문:**
```text
/opsx:propose [change-name-or-description]
```

**인자:**
| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name-or-description` | 아니요 | 케밥 케이스(kebab-case) 이름 또는 일반 언어의 변경 설명 |

**기능:**
- `openspec/changes/<change-name>/` 생성
- 구현 전에 필요한 아티팩트 생성 (spec-driven의 경우: proposal, specs, design, tasks)
- `/opsx:apply`가 준비될 때까지 대기

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
- 가장 빠른 엔드투엔드(end-to-end) 경로를 위해 사용합니다.
- 단계별 아티팩트 제어가 필요하다면, 확장된 워크플로우를 활성화하고 `/opsx:new` + `/opsx:continue`를 사용하십시오.

---

### `/opsx:explore`

> **확신이 없을 때 여기서 시작하세요.** Explore는 위험 부담 없는 사고 파트너입니다. 코드베이스를 읽고, 옵션을 비교하며, 어떤 변경 사항이 생기기 전에 모호한 아이디어를 구체적인 계획으로 다듬어줍니다. 이는 기본 프로필드에 포함되어 있습니다. 전체 사례 및 더 많은 예시는 [Explore First](explore.md) 가이드를 참조하십시오.

변경 사항을 확정하기 전에 아이디어를 구상하고, 문제를 조사하며, 요구사항을 명확히 합니다.

**구문:**
```
/opsx:explore [topic]
```

**인자:**
| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `topic` | 아니요 | 탐색하거나 조사하고 싶은 주제 |

**기능:**
- 구조가 필요 없는 탐색적 대화 시작
- 질문에 답하기 위해 코드베이스를 조사
- 옵션과 접근 방식을 비교
- 사고를 명확히 하기 위한 시각적 다이어그램 생성
- 통찰력이 생길 때 `/opsx:propose` (기본값) 또는 `/opsx:new` (확장된 워크플로우)로 전환 가능

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
- 요구사항이 불분명하거나 조사가 필요할 때 사용합니다.
- 탐색 과정 중에는 아티팩트가 생성되지 않습니다.
- 결정을 내리기 전에 여러 접근 방식을 비교하는 데 유용합니다.
- 파일을 읽고 코드베이스를 검색할 수 있습니다.

---

### `/opsx:new`

새로운 변경 사항 스캐폴드(scaffold)를 시작합니다. 변경 폴더를 생성하고, `/opsx:continue` 또는 `/opsx:ff`로 아티팩트를 생성할 때까지 기다립니다.

이 명령어는 확장된 워크플로우 세트의 일부입니다 (기본 `core` 프로필드에는 포함되어 있지 않습니다).

**구문:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**인자:**
| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 변경 폴더의 이름 (제공되지 않은 경우 프롬프트로 요청됨) |
| `--schema` | 아니요 | 사용할 워크플로우 스키마 (기본값: config 또는 `spec-driven`) |

**기능:**
- `openspec/changes/<change-name>/` 디렉토리 생성
- 변경 폴더 내에 `.openspec.yaml` 메타데이터 파일 생성
- 생성을 준비하는 첫 번째 아티팩트 템플릿 표시
- 제공되지 않은 경우 변경 이름 및 스키마를 프롬프트로 요청

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
- `add-feature`, `fix-bug`, `refactor-module`과 같이 설명적인 이름을 사용하십시오.
- `update`, `changes`, `wip`와 같은 일반적인 이름은 피하십시오.
- 스키마는 프로젝트 설정(`openspec/config.yaml`)에 지정할 수도 있습니다.

---

### `/opsx:continue`

의존성 체인에서 다음 아티팩트를 생성합니다. 한 번에 하나의 아티팩트만 생성하여 점진적인 진행을 합니다.

**구문:**
```
/opsx:continue [change-name]
```

**인자:**
| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 계속할 변경 사항 (제공되지 않은 경우 컨텍스트에서 추론) |

**기능:**
- 아티팩트 의존성 그래프를 질의합니다.
- 어떤 아티팩트가 준비되었고(ready), 어떤 것이 차단되었는지(blocked) 표시합니다.
- 첫 번째 준비된 아티팩트를 생성합니다.
- 컨텍스트를 위해 의존성 파일을 읽습니다.
- 생성 후 무엇이 사용 가능해지는지 보여줍니다.

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
- 각 아티팩트를 검토한 후 진행하고 싶을 때 사용합니다.
- 제어를 원하는 복잡한 변경 사항에 유용합니다.
- 여러 아티팩트가 동시에 준비될 수 있습니다.
- 계속하기 전에 생성된 아티팩트를 편집할 수 있습니다.

---

### `/opsx:ff`

아티팩트 생성을 빠르게 진행(Fast-forward)합니다. 모든 계획 아티팩트를 한 번에 생성합니다.

**구문:**
```
/opsx:ff [change-name]
```

**인자:**
| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 빠르게 진행할 변경 사항 (제공되지 않은 경우 컨텍스트에서 추론) |

**기능:**
- 의존성 순서에 따라 모든 아티팩트를 생성합니다.
- 할 일 목록(todo list)을 통해 진행 상황을 추적합니다.
- 모든 `apply-required` 아티팩트가 완료되면 중지합니다.
- 다음 아티팩트를 생성하기 전에 각 의존성을 읽습니다.

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
- 무엇을 만들지 명확히 알고 있을 때 사용합니다.
- 간단한 변경 사항에 `/opsx:continue`보다 빠릅니다.
- 나중에 아티팩트를 편집할 수 있습니다.
- 소규모에서 중간 규모의 기능에 적합합니다.

---

### `/opsx:apply`

변경 사항에서 태스크를 구현합니다. 태스크 목록을 따라가며 코드를 작성하고 항목을 체크 표시합니다.

**구문:**
```
/opsx:apply [change-name]
```

**인자:**
| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 구현할 변경 사항 (제공되지 않은 경우 컨텍스트에서 추론) |

**기능:**
- `tasks.md`를 읽고 미완료된 태스크를 식별합니다.
- 태스크를 하나씩 처리합니다.
- 필요한 경우 코드를 작성하고 파일을 생성하며 테스트를 실행합니다.
- 체크박스 `[x]`로 태스크를 완료 표시합니다.

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
- 중단된 경우 이전에 멈춘 지점부터 재개할 수 있습니다.
- 변경 이름(change name)을 지정하여 병렬적인 변경 사항에 사용합니다.
- 완료 상태는 `tasks.md`의 체크박스에서 추적됩니다.

---

### `/opsx:verify`

구현이 변경 아티팩트와 일치하는지 검증합니다. 완성도, 정확성, 일관성을 확인합니다.

**구문:**
```
/opsx:verify [change-name]
```

**인자:**
| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 검증할 변경 사항 (제공되지 않은 경우 컨텍스트에서 추론) |

**기능:**
- 세 가지 차원의 구현 품질을 확인합니다.
- 코드베이스를 검색하여 구현 증거를 찾습니다.
- CRITICAL, WARNING 또는 SUGGESTION으로 분류된 문제를 보고합니다.
- 아카이브를 차단하지는 않지만 문제를 노출시킵니다.

**검증 차원:**

| 차원 | 검증 내용 |
|-----------|-------------------|
| **Completeness (완성도)** | 모든 태스크 완료, 모든 요구사항 구현, 시나리오 포함 여부 |
| **Correctness (정확성)** | 구현이 명세 의도와 일치하는지, 엣지 케이스(edge cases) 처리 여부 |
| **Coherence (일관성)** | 디자인 결정 사항이 코드에 반영되었는지, 패턴의 일관성 |

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
- 조기에 불일치를 포착하기 위해 아카이브 전에 실행합니다.
- 경고(Warnings)는 아카이브를 차단하지 않지만 잠재적인 문제를 나타냅니다.
- 커밋하기 전에 AI의 작업을 검토하는 데 유용합니다.
- 아티팩트와 구현 간의 불일치(drift)를 드러낼 수 있습니다.

---

### `/opsx:sync`

**선택적 명령어.** 변경 사항에서 나온 델타(delta) 명세(specs)를 메인 명세로 병합합니다. 필요할 경우 아카이브가 동기화를 요청하므로, 일반적으로 이 명령어를 수동으로 실행할 필요는 없습니다.

**구문:**
```
/opsx:sync [change-name]
```

**인자:**
| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 동기화할 변경 사항 (제공되지 않은 경우 컨텍스트에서 추론) |

**기능:**
- 변경 폴더에서 델타 명세(delta specs)를 읽습니다.
- ADDED/MODIFIED/REMOVED/RENAMED 섹션을 파싱합니다.
- 메인 `openspec/specs/` 디렉토리에 변경 사항을 병합합니다.
- 델타에 언급되지 않은 기존 콘텐츠는 보존됩니다.
- 해당 변경 사항을 아카이브하지 않습니다 (계속 활성 상태 유지).

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

**수동 사용 시점:**

| 시나리오 | sync 사용? |
|----------|-----------|
| 장기 실행되는 변경 사항, 아카이브 전에 메인에 명세가 필요함 | 예 |
| 여러 병렬 변경 사항이 업데이트된 기본 명세를 필요로 함 | 예 |
| 병합을 별도로 미리 보고/검토하고 싶음 | 예 |
| 간단한 변경 사항, 바로 아카이브할 예정임 | 아니요 (archive에서 처리) |

**팁:**
- Sync는 지능적이며 복사 붙여넣기가 아닙니다.
- 기존 요구사항에 시나리오를 추가할 수 있으며 중복되지 않습니다.
- 동기화 후에도 변경 사항은 활성 상태로 유지됩니다 (아카이브되지 않음).
- 대부분의 사용자는 이 명령어를 직접 호출할 필요가 없습니다—필요한 경우 archive에서 프롬프트합니다.

---

### `/opsx:archive`

완료된 변경 사항을 아카이브합니다. 해당 변경 사항을 최종 확정하고 아카이브 폴더로 이동시킵니다.

**구문:**
```
/opsx:archive [change-name]
```

**인자:**
| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 아카이브할 변경 사항 (제공되지 않은 경우 컨텍스트에서 추론) |

**기능:**
- 아티팩트 완료 상태를 확인합니다.
- 태스크 완료 여부를 확인합니다 (미완료 시 경고).
- 필요하다면 델타 명세 동기화를 제안합니다.
- 변경 폴더를 `openspec/changes/archive/YYYY-MM-DD-<name>/`로 이동시킵니다.
- 감사 추적(audit trail)을 위해 모든 아티팩트를 보존합니다.

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
- 미완료된 태스크에 대해 차단하지는 않지만 경고를 표시합니다.
- 델타 명세는 아카이브 중 또는 그 이전에 동기화할 수 있습니다.
- 아카이브된 변경 사항은 기록을 위해 보존됩니다.
- 문제를 포착하기 위해 먼저 `/opsx:verify`를 실행하는 것이 좋습니다.

---

### `/opsx:bulk-archive`

완료된 여러 변경 사항을 한 번에 아카이브합니다. 변경 간의 명세 충돌(spec conflicts)을 처리합니다.

**구문:**
```
/opsx:bulk-archive [change-names...]
```

**인자:**
| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-names` | 아니요 | 아카이브할 특정 변경 사항 (제공되지 않은 경우 선택을 요청함) |

**기능:**
- 모든 완료된 변경 사항 목록을 표시합니다.
- 아카이브 전에 각 변경 사항을 검증합니다.
- 변경 간의 명세 충돌을 감지합니다.
- 실제로 구현된 내용을 확인하여 충돌을 해결합니다.
- 시간 순서대로 아카이브합니다.

**예시:**
```text
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
- 병렬 작업 스트림에 유용합니다.
- 충돌 해결은 에이전트적입니다 (코드베이스를 확인).
- 변경 사항은 생성 순서대로 아카이브됩니다.
- 명세 내용 덮어쓰기 전에 프롬프트를 표시합니다.

---

### `/opsx:onboard`

완벽한 OpenSpec 워크플로우에 대한 가이드 투어입니다. 실제 코드베이스를 사용하는 대화형 튜토리얼입니다.

**구문:**
```
/opsx:onboard
```

**기능:**
- 내레이션과 함께 전체 워크플로우 주기를 안내합니다.
- 실제 개선 기회를 찾기 위해 코드베이스를 스캔합니다.
- 실제 아티팩트를 가진 실제 변경 사항을 생성합니다.
- 실제 작업을 구현합니다 (작고 안전한 변경).
- 완료된 변경 사항을 아카이브합니다.
- 각 단계가 진행될 때마다 설명합니다.

**단계:**
1. 환영 및 코드베이스 분석
2. 개선 기회 찾기
3. 변경 사항 생성 (`/opsx:new`)
4. 제안서 작성
5. 명세(specs) 생성
6. 디자인 작성
7. 태스크 생성
8. 태스크 구현 (`/opsx:apply`)
9. 구현 검증
10. 변경 사항 아카이브
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
- 워크플로우를 배우는 새로운 사용자에게 가장 좋습니다.
- 장난감 예시가 아닌 실제 코드를 사용합니다.
- 보관하거나 폐기할 수 있는 실제 변경 사항을 생성합니다.
- 완료하는 데 15~30분이 소요됩니다.

## AI 도구별 명령어 구문

서로 다른 AI 도구들은 약간씩 다른 명령어 구문을 사용합니다. 자신의 도구에 맞는 형식을 사용하십시오:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

도구 전반에 걸쳐 의도는 동일하지만, 명령어가 노출되는 방식은 통합(integration)에 따라 다를 수 있습니다.

> **참고:** GitHub Copilot 명령어(`.github/prompts/*.prompt.md`)는 IDE 확장 프로그램(VS Code, JetBrains, Visual Studio)에서만 사용할 수 있습니다. GitHub Copilot CLI는 현재 사용자 지정 프롬프트 파일을 지원하지 않습니다. 자세한 내용 및 해결 방법은 [Supported Tools](supported-tools.md)를 참조하십시오.

---

## 레거시 명령어

이 명령어들은 이전의 "일괄 처리(all-at-once)" 워크플로우를 사용합니다. 여전히 작동하지만 OPSX 명령어를 사용하는 것이 권장됩니다.

| Command | 기능 설명 |
|---------|--------------|
| `/openspec:proposal` | 모든 아티팩트 한 번에 생성 (제안, 사양, 설계, 태스크) |
| `/openspec:apply` | 변경 사항 구현 |
| `/openspec:archive` | 변경 사항 보관 |

**레거시 명령어를 사용해야 하는 경우:**
- 이전 워크플로우를 사용하는 기존 프로젝트
- 증분(incremental) 아티팩트 생성이 필요 없는 간단한 변경 사항
- 일괄 처리(all-or-nothing) 방식 선호

**OPSX로 마이그레이션하기:**
레거시 변경 사항은 OPSX 명령어를 사용하여 계속 진행할 수 있습니다. 아티팩트 구조는 호환됩니다.

---

## 문제 해결

### "Change not found" (변경 사항을 찾을 수 없음)

명령어가 어떤 변경 사항에 대해 작업해야 하는지 식별하지 못했습니다.

**해결 방법:**
- 변경 이름을 명시적으로 지정합니다: `/opsx:apply add-dark-mode`
- 변경 폴더가 존재하는지 확인합니다: `openspec list`
- 올바른 프로젝트 디렉토리에 있는지 확인합니다.

### "No artifacts ready" (준비된 아티팩트 없음)

모든 아티팩트는 완료되었거나 누락된 종속성(dependencies)에 의해 차단되어 있습니다.

**해결 방법:**
- 무엇이 막고 있는지 보려면 `openspec status --change <name>`을 실행합니다.
- 필요한 아티팩트가 존재하는지 확인합니다.
- 먼저 누락된 종속성 아티팩트를 생성합니다.

### "Schema not found" (스키마를 찾을 수 없음)

지정된 스키마가 존재하지 않습니다.

**해결 방법:**
- 사용 가능한 스키마 목록을 표시합니다: `openspec schemas`
- 스키마 이름의 철자를 확인합니다.
- 사용자 지정(custom)인 경우 스키마를 생성합니다: `openspec schema init <name>`

### Commands not recognized (명령어를 인식하지 못함)

AI 도구가 OpenSpec 명령어를 인식하지 못하고 있습니다.

**해결 방법:**
- OpenSpec이 초기화되었는지 확인합니다: `openspec init`
- 스킬을 재생성합니다: `openspec update`
- `.claude/skills/` 디렉토리가 존재하는지 확인합니다 (Claude Code의 경우).
- AI 도구를 재시작하여 새로운 스킬을 불러오게 합니다.

### Artifacts not generating properly (아티팩트가 제대로 생성되지 않음)

AI가 불완전하거나 잘못된 아티팩트를 생성합니다.

**해결 방법:**
- `openspec/config.yaml`에 프로젝트 컨텍스트를 추가합니다.
- 특정 지침을 위한 아티팩트별 규칙을 추가합니다.
- 변경 사항 설명에 더 많은 세부 정보를 제공합니다.
- 더 많은 제어를 위해 `/opsx:ff` 대신 `/opsx:continue`를 사용합니다.

---

## 다음 단계

- [Workflows](workflows.md) - 일반적인 패턴 및 각 명령어를 언제 사용할지 알아보기
- [CLI](cli.md) - 관리 및 검증을 위한 터미널 명령어
- [Customization](customization.md) - 사용자 지정 스키마 및 워크플로우 생성