# OPSX로 마이그레이션하기

이 가이드는 레거시 OpenSpec 워크플로우에서 OPSX로의 전환을 돕습니다. 마이그레이션은 원활하게 진행되도록 설계되었습니다—기존 작업은 보존되며, 새로운 시스템은 더 많은 유연성을 제공합니다.

## 변경되는 사항은 무엇인가요?

OPSX는 이전의 단계 고정형 워크플로우를 유연하고 작업 기반의 접근 방식으로 대체합니다. 핵심 변화는 다음과 같습니다:

| 측면 | 레거시 | OPSX |
|--------|--------|------|
| **명령어** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | 기본값: `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (확장 워크플로우 명령어 선택 사항) |
| **워크플로우** | 모든 산출물을 한 번에 생성 | 점진적으로 또는 한 번에 생성—선택 가능 |
| **되돌아가기** | 어색한 단계 게이트 | 자연스러움—어떤 산출물이든 언제든 업데이트 가능 |
| **커스터마이징** | 고정된 구조 | 스키마 기반, 완전히 수정 가능 |
| **구성** | 마커가 포함된 `CLAUDE.md` + `project.md` | `openspec/config.yaml`의 깔끔한 구성 |

**철학의 변화:** 작업은 선형적이지 않습니다. OPSX는 선형인 척하는 것을 멈춥니다.

---

## 시작하기 전에

### 기존 작업은 안전합니다

마이그레이션 프로세스는 보존을 염두에 두고 설계되었습니다:

- **`openspec/changes/`의 활성 변경 사항** — 완전히 보존됩니다. OPSX 명령으로 계속 작업할 수 있습니다.
- **보관된 변경 사항** — 변경되지 않습니다. 기록이 그대로 유지됩니다.
- **`openspec/specs/`의 메인 사양** — 변경되지 않습니다. 이것이 진실의 원본입니다.
- **CLAUDE.md, AGENTS.md 등에 있는 사용자 콘텐츠** — 보존됩니다. OpenSpec 마커 블록만 제거되며, 작성한 모든 내용은 그대로 남습니다.

### 제거되는 항목

교체되는 OpenSpec 관리 파일만 제거됩니다:

| 항목 | 이유 |
|------|------|
| 레거시 슬래시 명령 디렉토리/파일 | 새로운 스킬 시스템으로 대체됨 |
| `openspec/AGENTS.md` | 더 이상 사용되지 않는 워크플로우 트리거 |
| `CLAUDE.md`, `AGENTS.md` 등의 OpenSpec 마커 | 더 이상 필요하지 않음 |

**도구별 레거시 명령 위치** (예시 — 사용하는 도구에 따라 다를 수 있음):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (IDE 확장 전용; Copilot CLI에서는 지원되지 않음)
- 기타 (Augment, Continue, Amazon Q 등)

마이그레이션은 구성된 도구를 감지하고 해당 레거시 파일을 정리합니다.

제거 목록이 길어 보일 수 있지만, 이 모든 파일은 OpenSpec이 원래 생성한 것입니다. 사용자 콘텐츠는 절대 삭제되지 않습니다.

### 주의가 필요한 항목

하나의 파일은 수동 마이그레이션이 필요합니다:

**`openspec/project.md`** — 이 파일은 작성한 프로젝트 컨텍스트를 포함할 수 있으므로 자동으로 삭제되지 않습니다. 다음을 수행해야 합니다:

1. 내용을 검토합니다.
2. 유용한 컨텍스트를 `openspec/config.yaml`로 이동합니다 (아래 지침 참조).
3. 준비가 되면 파일을 삭제합니다.

**이 변경 사항을 도입한 이유:**

이전 `project.md`는 수동적이었습니다—에이전트가 읽을 수도 있고, 안 읽을 수도 있으며, 읽은 것을 잊어버릴 수도 있었습니다. 신뢰성이 일관되지 않는다는 점을 발견했습니다.

새로운 `config.yaml` 컨텍스트는 **모든 OpenSpec 계획 요청에 적극적으로 주입됩니다**. 이는 AI가 산출물을 생성할 때 프로젝트 관례, 기술 스택 및 규칙이 항상 존재한다는 것을 의미합니다. 신뢰성이 향상됩니다.

**트레이드오프:**

컨텍스트가 모든 요청에 주입되므로 간결하게 작성해야 합니다. 정말 중요한 것에 집중하세요:
- 기술 스택 및 핵심 관례
- AI가 알아야 하는 비자명한 제약 조건
- 이전에 자주 무시되었던 규칙

완벽하게 만들려고 하지 마세요. 어떤 것이 가장 효과적인지 우리는 여전히 학습 중이며, 실험을 통해 컨텍스트 주입 방식을 개선해 나갈 것입니다.

---

## 마이그레이션 실행

`openspec init`과 `openspec update` 모두 레거시 파일을 감지하고 동일한 정리 과정을 안내합니다. 상황에 맞는 것을 사용하세요:

- 새 설치는 기본적으로 `core` 프로필(`propose`, `explore`, `apply`, `archive`)을 사용합니다.
- 마이그레이션된 설치는 필요한 경우 `custom` 프로필을 작성하여 이전에 설치된 워크플로우를 보존합니다.

### `openspec init` 사용

새 도구를 추가하거나 설정된 도구를 재구성하려면 다음을 실행합니다:

```bash
openspec init
```

init 명령은 레거시 파일을 감지하고 정리를 안내합니다:

```
새로운 OpenSpec으로 업그레이드 중

OpenSpec은 이제 코딩 에이전트 전반에 걸쳐 새로운 표준이 된 에이전트 스킬을 사용합니다.
이전처럼 모든 것이 작동하면서 설정이 간소화됩니다.

제거할 파일
보존할 사용자 콘텐츠 없음:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

업데이트할 파일
OpenSpec 마커가 제거되며, 사용자 콘텐츠는 보존됩니다:
  • CLAUDE.md
  • AGENTS.md

주의가 필요한 항목
  • openspec/project.md
    이 파일은 삭제하지 않습니다. 유용한 프로젝트 컨텍스트를 포함할 수 있습니다.

    새로운 openspec/config.yaml에는 계획 컨텍스트를 위한 "context:" 섹션이 있습니다.
    이는 모든 OpenSpec 요청에 포함되며 이전 project.md 방식보다 더 안정적으로 작동합니다.

    project.md를 검토하고, 유용한 내용을 config.yaml의 context 섹션으로 이동한 후,
    준비가 되면 파일을 삭제합니다.

? 업그레이드하고 레거시 파일을 정리하시겠습니까? (Y/n)
```

**'yes'라고 응답하면 어떻게 되는지:**

1. 레거시 슬래시 명령 디렉토리가 제거됩니다.
2. `CLAUDE.md`, `AGENTS.md` 등에서 OpenSpec 마커가 제거됩니다 (사용자 콘텐츠는 유지).
3. `openspec/AGENTS.md`가 삭제됩니다.
4. `.claude/skills/`에 새로운 스킬이 설치됩니다.
5. 기본 스키마로 `openspec/config.yaml`이 생성됩니다.

### `openspec update` 사용

기존 도구를 마이그레이션하고 최신 버전으로 새로 고치려면 다음을 실행합니다:

```bash
openspec update
```

update 명령도 레거시 아티팩트를 감지하고 정리한 후, 현재 프로필 및 전달 설정에 맞게 생성된 스킬/명령을 새로 고칩니다.

### 비대화형 / CI 환경

스크립트 기반 마이그레이션의 경우:

```bash
openspec init --force --tools claude
```

`--force` 플래그는 프롬프트를 건너뛰고 정리를 자동으로 수락합니다.

---

## project.md를 config.yaml로 마이그레이션

이전 `openspec/project.md`는 프로젝트 컨텍스트를 위한 자유 형식 마크다운 파일이었습니다. 새로운 `openspec/config.yaml`은 구조화되어 있으며—중요하게도—**모든 계획 요청에 주입되어** AI가 작업할 때 관례가 항상 존재하도록 합니다.

### 이전 (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### 이후 (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### 주요 차이점

| project.md | config.yaml |
|------------|-------------|
| 자유 형식 마크다운 | 구조화된 YAML |
| 하나의 텍스트 덩어리 | 별도의 컨텍스트 및 아티팩트별 규칙 |
| 사용 시점 불명확 | 컨텍스트는 모든 아티팩트에 나타남; 규칙은 일치하는 아티팩트에만 나타남 |
| 스키마 선택 없음 | 명시적인 `schema:` 필드로 기본 워크플로우 설정 |

### 유지할 것, 버릴 것

마이그레이션 시 선택적으로 진행하세요. 스스로에게 물어보세요: "AI가 *모든* 계획 요청에 이것을 필요로 하는가?"

**`context:`에 적합한 항목**
- 기술 스택 (언어, 프레임워크, 데이터베이스)
- 핵심 아키텍처 패턴 (모노레포, 마이크로서비스 등)
- 비자명한 제약 조건 ("이유 때문에 라이브러리 X를 사용할 수 없음")
- 자주 무시되는 중요한 관례

**`rules:`로 이동할 항목**
- 아티팩트별 포맷팅 ("사양에서 Given/When/Then 사용")
- 검토 기준 ("제안에는 롤백 계획 포함")
- 이들은 일치하는 아티팩트에만 나타나므로 다른 요청을 가볍게 유지합니다.

**완전히 제외할 항목**
- AI가 이미 알고 있는 일반적인 모범 사례
- 요약할 수 있는 장황한 설명
- 현재 작업에 영향을 미치지 않는 과거 컨텍스트

### 마이그레이션 단계

1. **config.yaml 생성** (init에서 아직 생성되지 않은 경우):
   ```yaml
   schema: spec-driven
   ```

2. **컨텍스트 추가** (간결하게—이것이 모든 요청에 포함됨):
   ```yaml
   context: |
     프로젝트 배경을 여기에 작성하세요.
     AI가 실제로 알아야 할 것에 집중하세요.
   ```

3. **아티팩트별 규칙 추가** (선택 사항):
   ```yaml
   rules:
     proposal:
       - 제안 관련 지침
     specs:
       - 사양 작성 규칙
   ```

4. **유용한 모든 것을 이동한 후 project.md를 삭제합니다.**

**과도하게 생각하지 마세요.** 필수적인 것으로 시작하고 반복적으로 개선하세요. AI가 중요한 것을 놓치는 경우 추가하세요. 컨텍스트가 비대해 보이면 정리하세요. 이것은 살아있는 문서입니다.

### 도움이 필요하세요? 이 프롬프트를 사용하세요

project.md를 어떻게 정제해야 할지 확신이 서지 않는다면, AI 어시스턴트에게 다음을 요청하세요:

```
저는 OpenSpec의 이전 project.md에서 새로운 config.yaml 형식으로 마이그레이션하고 있습니다.

현재 project.md 내용은 다음과 같습니다:
[project.md 내용 붙여넣기]

다음을 포함하는 config.yaml을 만드는 데 도움을 주세요:
1. 간결한 `context:` 섹션 (이것이 모든 계획 요청에 주입되므로 간결하게 유지하세요—기술 스택, 핵심 제약 조건 및 자주 무시되는 관례에 집중)
2. 아티팩트별 내용이 있는 경우 해당 아티팩트에 대한 `rules:` (예: "Given/When/Then 사용"은 specs 규칙에 속하며, 전역 컨텍스트가 아님)

AI 모델이 이미 알고 있는 일반적인 내용은 제외하세요. 간결함에 대해 엄격하게 적용하세요.
```

AI가 필수적인 것과 정리할 수 있는 것을 구별하는 데 도움을 줄 것입니다.

---

## 새로운 명령

명령 사용 가능성은 프로필에 따라 다릅니다:

**기본 (`core` 프로필):**

| 명령 | 목적 |
|---------|---------|
| `/opsx:propose` | 변경 사항을 만들고 한 단계에서 계획 아티팩트를 생성 |
| `/opsx:explore` | 구조 없이 아이디어를 구상 |
| `/opsx:apply` | tasks.md의 작업을 구현 |
| `/opsx:archive` | 변경 사항을 확정하고 보관 |

**확장 워크플로우 (사용자 지정 선택):**

| 명령 | 목적 |
|---------|---------|
| `/opsx:new` | 새로운 변경 사항 스캐폴드 시작 |
| `/opsx:continue` | 다음 아티팩트를 하나씩 생성 |
| `/opsx:ff` | 빠른 진행—계획 아티팩트를 한 번에 생성 |
| `/opsx:verify` | 구현이 사양과 일치하는지 검증 |
| `/opsx:sync` | 보관하지 않고 미리보기/사양 병합 |
| `/opsx:bulk-archive` | 여러 변경 사항을 한 번에 보관 |
| `/opsx:onboard` | 안내된 종단간 온보딩 워크플로우 |

`openspec config profile`로 확장 명령을 활성화한 후 `openspec update`를 실행하세요.

### 레거시에서의 명령 매핑

| 레거시 | OPSX 대응 명령 |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (기본) 또는 `/opsx:new` 후 `/opsx:ff` (확장) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 새로운 기능

이러한 기능은 확장 워크플로우 명령 세트의 일부입니다.

**세분화된 아티팩트 생성:**
```
/opsx:continue
```
의존성에 따라 한 번에 하나의 아티팩트를 생성합니다. 각 단계를 검토하고 싶을 때 사용합니다.

**탐색 모드:**
```
/opsx:explore
```
변경 사항을 확정하기 전에 파트너와 아이디어를 구상합니다.

---

## 새로운 아키텍처 이해하기

### 상위 단계 고정형에서 유연한 구조로

기존 워크플로우는 선형적인 진행을 강제했습니다:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

구현 중에 설계가 잘못되었다는 것을 알게 되면 어떻게 할까요?
안타깝지만, 단계 게이트는 쉽게 돌아가도록 허용하지 않습니다.
```

OPSX는 단계가 아닌 **액션**을 사용합니다:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### 의존성 그래프

산출물은 방향 그래프를 형성합니다. 의존성은 게이트가 아닌 **활성화 요건**입니다:

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

`/opsx:continue`를 실행하면, 준비된 항목을 확인하고 다음 산출물을 제안합니다. 여러 개의 준비된 산출물을 임의 순서로 생성할 수도 있습니다.

### 스킬 vs 명령어

기존 시스템은 도구별 명령어 파일을 사용했습니다:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX는 새로운 **스킬** 표준을 사용합니다:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

스킬은 여러 AI 코딩 도구에서 인식되며 더 풍부한 메타데이터를 제공합니다.

---

## 기존 변경 사항 계속하기

진행 중인 변경 사항은 OPSX 명령어와 원활하게 작동합니다.

**기존 워크플로우에서 활성 변경 사항이 있나요?**

```
/opsx:apply add-my-feature
```

OPSX는 기존 산출물을 읽고 중단된 지점부터 계속합니다.

**기존 변경 사항에 더 많은 산출물을 추가하고 싶나요?**

```
/opsx:continue add-my-feature
```

기존 항목을 기반으로 생성할 준비가 된 항목을 보여줍니다.

**상태를 확인해야 하나요?**

```bash
openspec status --change add-my-feature
```

---

## 새로운 설정 시스템

### config.yaml 구조

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### 스키마 해석

사용할 스키마를 결정할 때, OPSX는 다음 순서로 확인합니다:

1. **CLI 플래그**: `--schema <name>` (최우선)
2. **변경 사항 메타데이터**: 변경 사항 디렉토리의 `.openspec.yaml`
3. **프로젝트 설정**: `openspec/config.yaml`
4. **기본값**: `spec-driven`

### 사용 가능한 스키마

| 스키마 | 산출물 | 적합한 용도 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | 대부분의 프로젝트 |

사용 가능한 모든 스키마를 나열합니다:

```bash
openspec schemas
```

### 사용자 지정 스키마

자신만의 워크플로우를 만듭니다:

```bash
openspec schema init my-workflow
```

또는 기존 스키마를 복제합니다:

```bash
openspec schema fork spec-driven my-workflow
```

자세한 내용은 [사용자 지정](customization.md)을 참조하세요.

---

## 문제 해결

### "Legacy files detected in non-interactive mode"

CI 또는 비대화형 환경에서 실행 중입니다. 다음을 사용하세요:

```bash
openspec init --force
```

### 마이그레이션 후 명령어가 나타나지 않음

IDE를 다시 시작하세요. 스킬은 시작 시 감지됩니다.

### "Unknown artifact ID in rules"

`rules:` 키가 스키마의 산출물 ID와 일치하는지 확인하세요:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

유효한 산출물 ID를 확인하려면 다음을 실행하세요:

```bash
openspec schemas --json
```

### 설정이 적용되지 않음

1. 파일이 `openspec/config.yaml`에 있는지 확인하세요 (`.yml`이 아님)
2. YAML 구문을 확인하세요
3. 설정 변경은 즉시 적용됩니다—재시작이 필요하지 않습니다

### project.md가 마이그레이션되지 않음

시스템은 `project.md`에 사용자 지정 내용이 포함되어 있을 수 있으므로 의도적으로 보존합니다. 수동으로 검토하고, 유용한 부분을 `config.yaml`로 이동한 후 삭제하세요.

### 정리될 내용을 확인하고 싶으신가요?

init를 실행하고 정리 프롬프트를 거절하세요—변경 없이 전체 감지 요약을 볼 수 있습니다.

---

## 빠른 참조

### 마이그레이션 후 파일 구조

```
project/
├── openspec/
│   ├── specs/                    # 변경 없음
│   ├── changes/                  # 변경 없음
│   │   └── archive/              # 변경 없음
│   └── config.yaml               # NEW: 프로젝트 설정
├── .claude/
│   └── skills/                   # NEW: OPSX 스킬
│       ├── openspec-propose/     # 기본 코어 프로파일
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       └── ...                   # 확장 프로파일은 new/continue/ff 등 추가
├── CLAUDE.md                     # OpenSpec 마커 제거됨, 사용자 내용 보존됨
└── AGENTS.md                     # OpenSpec 마커 제거됨, 사용자 내용 보존됨
```

### 제거된 항목

- `.claude/commands/openspec/` — `.claude/skills/`로 대체됨
- `openspec/AGENTS.md` — 더 이상 사용되지 않음
- `openspec/project.md` — `config.yaml`로 마이그레이션 후 삭제
- `CLAUDE.md`, `AGENTS.md` 등의 OpenSpec 마커 블록

### 명령어 치트시트

```text
/opsx:propose      빠르게 시작 (기본 코어 프로파일)
/opsx:apply        작업 구현
/opsx:archive      완료 및 보관

# 확장 워크플로우 (활성화된 경우):
/opsx:new          변경 사항 스캐폴딩
/opsx:continue     다음 산출물 생성
/opsx:ff           계획 산출물 생성
```

---

## 도움말

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **문서**: 전체 OPSX 참조는 [docs/opsx.md](opsx.md)를 확인하세요