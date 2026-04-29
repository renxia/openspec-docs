# 명령어

이 문서는 OpenSpec의 슬래시 명령어에 대한 참조입니다. 이러한 명령어는 AI 코딩 어시스턴트의 채팅 인터페이스(예: Claude Code, Cursor, Windsurf)에서 호출됩니다.

워크플로우 패턴과 각 명령어 사용 시점에 대해서는 [워크플로우](workflows.md)를, CLI 명령어에 대해서는 [CLI](cli.md)를 참조하세요.

## 빠른 참조

### 기본 빠른 경로 (`core` 프로필)

| 명령어 | 용도 |
|---------|---------|
| `/opsx:propose` | 변경 사항을 생성하고 계획 아티팩트를 한 단계에 생성합니다 |
| `/opsx:explore` | 변경 사항을 확정하기 전에 아이디어를 검토합니다 |
| `/opsx:apply` | 변경 사항에서 작업을 구현합니다 |
| `/opsx:archive` | 완료된 변경 사항을 보관합니다 |

### 확장 워크플로우 명령어 (사용자 지정 워크플로우 선택)

| 명령어 | 용도 |
|---------|---------|
| `/opsx:new` | 새로운 변경 사항 스캐폴드를 시작합니다 |
| `/opsx:continue` | 종속성을 기반으로 다음 아티팩트를 생성합니다 |
| `/opsx:ff` | 빨리 감기: 모든 계획 아티팩트를 한 번에 생성합니다 |
| `/opsx:verify` | 구현이 아티팩트와 일치하는지 검증합니다 |
| `/opsx:sync` | 델타 스펙을 메인 스펙에 병합합니다 |
| `/opsx:bulk-archive` | 여러 변경 사항을 한 번에 보관합니다 |
| `/opsx:onboard` | 전체 워크플로우를 안내하는 튜토리얼을 진행합니다 |

기본 전역 프로필은 `core`입니다. 확장 워크플로우 명령어를 활성화하려면 `openspec config profile`을 실행하여 워크플로우를 선택한 후, 프로젝트에서 `openspec update`를 실행하세요.

---

## 명령 참조

### `/opsx:propose`

새로운 변경 사항을 생성하고 계획 산출물을 한 단계에 생성합니다.这是 `core` 프로필의 기본 시작 명령입니다.

**구문:**
```text
/opsx:propose [change-name-or-description]
```

**인수:**
| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `change-name-or-description` | 아니오 | 케밥-케이스 이름 또는 자연어 변경 설명 |

**작동 방식:**
- `openspec/changes/<change-name>/` 디렉토리를 생성합니다.
- 구현 전 필요한 산출물을 생성합니다 (`spec-driven`의 경우: 제안서, 스펙, 설계, 작업)
- 변경 사항이 `/opsx:apply`에 준비되면 중지합니다.

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
- 가장 빠른 엔드투엔드 경로를 원할 때 사용합니다.
- 단계별 산출물 제어를 원하면 확장 워크플로를 활성화하고 `/opsx:new` + `/opsx:continue`를 사용하세요.

---

### `/opsx:explore`

변경 사항을 확정하기 전에 아이디어를 구상하고, 문제를 조사하고, 요구 사항을 명확히 합니다.

**구문:**
```
/opsx:explore [topic]
```

**인수:**
| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `topic` | 아니오 | 탐색하거나 조사하고자 하는 주제 |

**작동 방식:**
- 구조화되지 않은 탐색적 대화를 엽니다.
- 코드베이스를 조사하여 질문에 답합니다.
- 옵션과 접근 방식을 비교합니다.
- 생각을 명확히 하기 위해 시각적 다이어그램을 만듭니다.
- 통찰이 명확해지면 `/opsx:propose` (기본) 또는 `/opsx:new` (확장 워크플로)로 전환할 수 있습니다.

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
- 요구 사항이 불분명하거나 조사가 필요할 때 사용합니다.
- 탐색 중에는 산출물이 생성되지 않습니다.
- 결정하기 전에 여러 접근 방식을 비교할 때 유용합니다.
- 파일을 읽고 코드베이스를 검색할 수 있습니다.

---

### `/opsx:new`

새로운 변경 사항 스캐폴드를 시작합니다. 변경 사항 폴더를 생성하고 `/opsx:continue` 또는 `/opsx:ff`로 산출물을 생성하기를 기다립니다.

이 명령은 확장 워크플로 세트의 일부입니다 (기본 `core` 프로필에는 포함되지 않음).

**구문:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**인수:**
| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 변경 사항 폴더 이름 (제공되지 않으면 프롬프트) |
| `--schema` | 아니오 | 사용할 워크플로 스키마 (기본값: 설정 또는 `spec-driven`에서 가져옴) |

**작동 방식:**
- `openspec/changes/<change-name>/` 디렉토리를 생성합니다.
- 변경 사항 폴더에 `.openspec.yaml` 메타데이터 파일을 생성합니다.
- 생성할 준비가 된 첫 번째 산출물 템플릿을 표시합니다.
- 변경 사항 이름과 스키마가 제공되지 않으면 프롬프트를 표시합니다.

**생성되는 파일:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # 변경 사항 메타데이터 (스키마, 생성 날짜)
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
- 설명적인 이름을 사용하세요: `add-feature`, `fix-bug`, `refactor-module`
- `update`, `changes`, `wip`와 같은 일반적인 이름은 피하세요.
- 스키마는 프로젝트 설정 (`openspec/config.yaml`)에서도 설정할 수 있습니다.

---

### `/opsx:continue`

의존성 체인에서 다음 산출물을 생성합니다. 점진적 진행을 위해 한 번에 하나의 산출물을 생성합니다.

**구문:**
```
/opsx:continue [change-name]
```

**인수:**
| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 계속할 변경 사항 (제공되지 않으면 컨텍스트에서 추론) |

**작동 방식:**
- 산출물 의존성 그래프를 쿼리합니다.
- 준비된 산출물과 차단된 산출물을 표시합니다.
- 첫 번째 준비된 산출물을 생성합니다.
- 컨텍스트를 위해 의존 파일을 읽습니다.
- 생성 후 사용 가능한 항목을 표시합니다.

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
- 각 산출물을 진행하기 전에 검토하고 싶을 때 사용합니다.
- 제어가 필요한 복잡한 변경 사항에 유용합니다.
- 여러 산출물이 동시에 준비될 수 있습니다.
- 계속하기 전에 생성된 산출물을 편집할 수 있습니다.

---

### `/opsx:ff`

산출물 생성을 빠르게 진행합니다. 모든 계획 산출물을 한 번에 생성합니다.

**구문:**
```
/opsx:ff [change-name]
```

**인수:**
| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 빠르게 진행할 변경 사항 (제공되지 않으면 컨텍스트에서 추론) |

**작동 방식:**
- 의존성 순서대로 모든 산출물을 생성합니다.
- 할 일 목록을 통해 진행 상황을 추적합니다.
- 모든 `apply-required` 산출물이 완료되면 중지합니다.
- 다음 산출물을 생성하기 전에 각 의존성을 읽습니다.

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
- 구축할 내용이 명확할 때 사용합니다.
- 간단한 변경 사항의 경우 `/opsx:continue`보다 빠릅니다.
- 나중에 산출물을 편집할 수 있습니다.
- 소규모에서 중규모 기능에 유용합니다.

---

### `/opsx:apply`

변경 사항의 작업을 구현합니다. 작업 목록을 처리하며 코드를 작성하고 항목을 체크합니다.

**구문:**
```
/opsx:apply [change-name]
```

**인수:**
| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 구현할 변경 사항 (제공되지 않으면 컨텍스트에서 추론) |

**작동 방식:**
- `tasks.md`를 읽고 미완료 작업을 식별합니다.
- 작업을 하나씩 처리합니다.
- 필요에 따라 코드를 작성하고, 파일을 생성하고, 테스트를 실행합니다.
- 체크박스 `[x]`로 작업 완료를 표시합니다.

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
- 중단된 경우 중단된 지점에서 다시 시작할 수 있습니다.
- 변경 사항 이름을 지정하여 병렬 변경 사항에 사용할 수 있습니다.
- 완료 상태는 `tasks.md` 체크박스에서 추적됩니다.

---

### `/opsx:verify`

구현이 변경 사항 산출물과 일치하는지 검증합니다. 완전성, 정확성, 일관성을 확인합니다.

**구문:**
```
/opsx:verify [change-name]
```

**인수:**
| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 검증할 변경 사항 (제공되지 않으면 컨텍스트에서 추론) |

**작동 방식:**
- 구현 품질의 세 가지 차원을 확인합니다.
- 구현 증거를 위해 코드베이스를 검색합니다.
- CRITICAL, WARNING 또는 SUGGESTION으로 분류된 문제를 보고합니다.
- 보관을 차단하지는 않지만 문제를 표시합니다.

**검증 차원:**

| 차원 | 검증하는 내용 |
|-----------|-------------------|
| **완전성** | 모든 작업 완료, 모든 요구 사항 구현, 시나리오 커버리지 |
| **정확성** | 구현이 스펙 의도와 일치, 엣지 케이스 처리 |
| **일관성** | 설계 결정이 코드에 반영, 패턴 일관성 |

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
- 불일치를 조기에 발견하기 위해 보관 전에 실행합니다.
- 경고는 보관을 차단하지 않지만 잠재적 문제를 나타냅니다.
- 커밋하기 전에 AI의 작업을 검토할 때 유용합니다.
- 산출물과 구현 사이의 이탈을 드러낼 수 있습니다.

---

### `/opsx:sync`

**선택적 명령.** 변경 사항의 델타 스펙을 메인 스펙으로 병합합니다. 필요 시 보관 프롬프트에서 동기화를 제안하므로, 일반적으로 수동으로 실행할 필요가 없습니다.

**구문:**
```
/opsx:sync [change-name]
```

**인수:**
| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 동기화할 변경 사항 (제공되지 않으면 컨텍스트에서 추론) |

**작동 방식:**
- 변경 사항 폴더에서 델타 스펙을 읽습니다.
- ADDED/MODIFIED/REMOVED/RENAMED 섹션을 파싱합니다.
- 변경 사항을 메인 `openspec/specs/` 디렉토리로 병합합니다.
- 델타에 언급되지 않은 기존 콘텐츠를 보존합니다.
- 변경 사항을 보관하지 않습니다 (활성 상태 유지).

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

| 시나리오 | sync 사용? |
|----------|-----------|
| 장기간 진행되는 변경 사항, 보관 전에 메인에 스펙을 원할 때 | 예 |
| 여러 병렬 변경 사항이 업데이트된 기본 스펙이 필요할 때 | 예 |
| 병합을 미리 보거나 별도로 검토하고 싶을 때 | 예 |
| 빠른 변경 사항, 바로 보관으로 진행할 때 | 아니오 (보관에서 처리) |

**팁:**
- 동기화는 지능적이며 단순 복사-붙여넣기가 아닙니다.
- 중복 없이 기존 요구 사항에 시나리오를 추가할 수 있습니다.
- 동기화 후에도 변경 사항은 활성 상태로 유지됩니다 (보관되지 않음).
- 대부분의 사용자는 이 명령을 직접 호출할 필요가 없습니다—필요 시 보관 프롬프트에서 제안합니다.

---

### `/opsx:archive`

완료된 변경 사항을 보관합니다. 변경 사항을 마무리하고 보관 폴더로 이동합니다.

**구문:**
```
/opsx:archive [change-name]
```

**인수:**
| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 보관할 변경 사항 (제공되지 않으면 컨텍스트에서 추론) |

**작동 방식:**
- 산출물 완료 상태를 확인합니다.
- 작업 완료를 확인합니다 (미완료 시 경고).
- 아직 동기화되지 않은 경우 델타 스펙 동기화를 제안합니다.
- 변경 사항 폴더를 `openspec/changes/archive/YYYY-MM-DD-<name>/`로 이동합니다.
- 감사 추적을 위해 모든 산출물을 보존합니다.

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
- 보관은 미완료 작업을 차단하지 않지만 경고합니다.
- 델타 스펙은 보관 중 또는 사전에 동기화할 수 있습니다.
- 보관된 변경 사항은 기록을 위해 보존됩니다.
- 문제를 발견하기 위해 먼저 `/opsx:verify`를 사용하세요.

---

### `/opsx:bulk-archive`

여러 완료된 변경 사항을 한 번에 보관합니다. 변경 사항 간 스펙 충돌을 처리합니다.

**구문:**
```
/opsx:bulk-archive [change-names...]
```

**인수:**
| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `change-names` | 아니오 | 보관할 특정 변경 사항 (제공되지 않으면 선택 프롬프트) |

**작동 방식:**
- 모든 완료된 변경 사항을 나열합니다.
- 보관 전에 각 변경 사항을 검증합니다.
- 변경 사항 전반에 걸친 스펙 충돌을 감지합니다.
- 실제 구현된 내용을 확인하여 충돌을 해결합니다.
- 시간순으로 보관합니다.

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
- 병렬 작업 흐름에 유용합니다.
- 충돌 해결은 에이전트 방식입니다 (코드베이스를 확인).
- 변경 사항은 생성 순서대로 보관됩니다.
- 스펙 내용 덮어쓰기 전에 프롬프트를 표시합니다.

---

### `/opsx:onboard`

실제 코드베이스를 사용하는 전체 OpenSpec 워크플로를 안내하는 온보딩. 인터랙티브 튜토리얼입니다.

**구문:**
```
/opsx:onboard
```

**작동 방식:**
- 내레이션과 함께 전체 워크플로 주기를 안내합니다.
- 실제 개선 기회를 위해 코드베이스를 스캔합니다.
- 실제 산출물이 포함된 실제 변경 사항을 생성합니다.
- 실제 작업을 구현합니다 (작고 안전한 변경 사항).
- 완료된 변경 사항을 보관합니다.
- 각 단계가 진행되는 동안 설명합니다.

**단계:**
1. 환영 및 코드베이스 분석
2. 개선 기회 찾기
3. 변경 사항 생성 (`/opsx:new`)
4. 제안서 작성
5. 스펙 생성
6. 설계 작성
7. 작업 생성
8. 작업 구현 (`/opsx:apply`)
9. 구현 검증
10. 변경 사항 보관
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
- 워크플로를 배우는 신규 사용자에게 가장 적합합니다.
- 장난감 예시가 아닌 실제 코드를 사용합니다.
- 유지하거나 폐기할 수 있는 실제 변경 사항을 생성합니다.
- 완료하는 데 15-30분이 소요됩니다.

---

## AI 도구별 명령어 구문

각 AI 도구는 약간 다른 명령어 구문을 사용합니다. 사용 중인 도구에 맞는 형식을 선택하세요:

| 도구 | 구문 예시 |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | `/openspec-propose`, `/openspec-apply-change`와 같은 스킬 기반 호출 (생성된 `opsx-*` 명령어 파일 없음) |

도구 전반에 걸쳐 의도는 동일하지만, 명령어가 표시되는 방식은 통합 방식에 따라 다를 수 있습니다.

> **참고:** GitHub Copilot 명령어(`.github/prompts/*.prompt.md`)는 IDE 확장 프로그램(VS Code, JetBrains, Visual Studio)에서만 사용할 수 있습니다. GitHub Copilot CLI는 현재 사용자 지정 프롬프트 파일을 지원하지 않습니다 — 자세한 내용과 해결 방법은 [지원되는 도구](supported-tools.md)를 참조하세요.

---

## 레거시 명령어

이 명령어들은 이전의 "한번에 모두" 워크플로를 사용합니다. 여전히 작동하지만 OPSX 명령어를 사용하는 것이 권장됩니다.

| 명령어 | 기능 |
|---------|--------------|
| `/openspec:proposal` | 모든 아티팩트를 한번에 생성 (제안서, 스펙, 설계, 작업) |
| `/openspec:apply` | 변경 사항 구현 |
| `/openspec:archive` | 변경 사항 보관 |

**레거시 명령어 사용 시점:**
- 이전 워크플로를 사용하는 기존 프로젝트
- 점진적인 아티팩트 생성이 필요하지 않은 간단한 변경 사항
- 전부 아니면 전무 방식 선호 시

**OPSX로 마이그레이션:**
레거시 변경 사항은 OPSX 명령어로 계속 진행할 수 있습니다. 아티팩트 구조는 호환됩니다.

---

## 문제 해결

### "Change not found"

명령어가 작업할 변경 사항을 식별할 수 없었습니다.

**해결 방법:**
- 변경 사항 이름을 명시적으로 지정: `/opsx:apply add-dark-mode`
- 변경 사항 폴더가 존재하는지 확인: `openspec list`
- 올바른 프로젝트 디렉토리에 있는지 확인

### "No artifacts ready"

모든 아티팩트가 완료되었거나 누락된 종속성으로 인해 차단되었습니다.

**해결 방법:**
- `openspec status --change <name>`을 실행하여 차단 요인 확인
- 필요한 아티팩트가 존재하는지 확인
- 누락된 종속 아티팩트를 먼저 생성

### "Schema not found"

지정된 스키마가 존재하지 않습니다.

**해결 방법:**
- 사용 가능한 스키마 목록 확인: `openspec schemas`
- 스키마 이름 철자 확인
- 사용자 지정 스키마인 경우 생성: `openspec schema init <name>`

### 명령어 인식 불가

AI 도구가 OpenSpec 명령어를 인식하지 못합니다.

**해결 방법:**
- OpenSpec이 초기화되었는지 확인: `openspec init`
- 스킬 재생성: `openspec update`
- `.claude/skills/` 디렉토리가 존재하는지 확인 (Claude Code용)
- AI 도구를 재시작하여 새 스킬을 로드

### 아티팩트가 올바르게 생성되지 않음

AI가 불완전하거나 잘못된 아티팩트를 생성합니다.

**해결 방법:**
- `openspec/config.yaml`에 프로젝트 컨텍스트 추가
- 특정 지침을 위한 아티팩트별 규칙 추가
- 변경 사항 설명에 더 많은 세부 정보 제공
- 더 많은 제어를 위해 `/opsx:ff` 대신 `/opsx:continue` 사용

---

## 다음 단계

- [워크플로](workflows.md) - 일반적인 패턴과 각 명령어 사용 시점
- [CLI](cli.md) - 관리 및 검증을 위한 터미널 명령어
- [사용자 지정](customization.md) - 사용자 지정 스키마 및 워크플로 생성