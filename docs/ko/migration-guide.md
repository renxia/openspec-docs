# OPSX로 마이그레이션

이 가이드는 레거시 OpenSpec 워크플로우에서 OPSX로 전환하는 데 도움을 드립니다. 마이그레이션은 원활하게 설계되었습니다—기존 작업은 보존되며, 새로운 시스템은 더 많은 유연성을 제공합니다.

## 무엇이 변경되나요?

OPSX는 이전의 단계 고정 워크플로우를 유연하고 액션 기반 접근 방식으로 대체합니다. 주요 변화는 다음과 같습니다:

| 측면 | 레거시 | OPSX |
|--------|--------|------|
| **명령어** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | 기본: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (확장 워크플로우 명령어는 선택 사항) |
| **워크플로우** | 모든 아티팩트를 한 번에 생성 | 점진적으로 또는 한 번에 생성—사용자 선택 |
| **되돌아가기** | 어색한 단계 게이트 | 자연스러움—언제든지 아티팩트 업데이트 가능 |
| **사용자 정의** | 고정된 구조 | 스키마 기반, 완전히 수정 가능 |
| **구성** | 마커가 있는 `CLAUDE.md` + `project.md` | `openspec/config.yaml`의 깔끔한 설정 |

**철학의 변화:** 작업은 선형적이지 않습니다. OPSX는 더 이상 그렇지 않은 척하지 않습니다.

---

## 시작하기 전에

### 기존 작업은 안전합니다

마이그레이션 프로세스는 보존을 염두에 두고 설계되었습니다:

- **`openspec/changes/`의 활성 변경 사항** — 완전히 보존됩니다. OPSX 명령어로 계속 진행할 수 있습니다.
- **아카이브된 변경 사항** — 변경되지 않습니다. 기록이 그대로 유지됩니다.
- **`openspec/specs/`의 메인 명세** — 변경되지 않습니다. 이것이 귀하의 진실의 원천(source of truth)입니다.
- **CLAUDE.md, AGENTS.md 등에 있는 귀하의 콘텐츠** — 보존됩니다. OpenSpec 마커 블록만 제거되며, 귀하가 작성한 모든 내용은 유지됩니다.

### 제거되는 항목

교체되는 OpenSpec 관리 파일만 해당됩니다:

| 항목 | 이유 |
|------|------|
| 레거시 슬래시 명령어 디렉토리/파일 | 새로운 스킬 시스템으로 대체됨 |
| `openspec/AGENTS.md` | 더 이상 사용되지 않는 워크플로우 트리거 |
| `CLAUDE.md`, `AGENTS.md` 등에 있는 OpenSpec 마커 | 더 이상 필요하지 않음 |

**도구별 레거시 명령어 위치** (예시 — 사용하는 도구에 따라 다를 수 있음):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (IDE 확장 프로그램만 해당; Copilot CLI에서는 지원되지 않음)
- 기타 (Augment, Continue, Amazon Q 등)

마이그레이션은 구성된 도구를 감지하고 해당 레거시 파일을 정리합니다.

제거 목록이 길어 보일 수 있지만, 이들은 모두 OpenSpec이 원래 생성한 파일입니다. 귀하의 자체 콘텐츠는 절대 삭제되지 않습니다.

### 주의가 필요한 항목

하나의 파일은 수동 마이그레이션이 필요합니다:

**`openspec/project.md`** — 이 파일에는 귀하가 작성한 프로젝트 컨텍스트가 포함되어 있을 수 있으므로 자동으로 삭제되지 않습니다. 다음을 수행해야 합니다:

1. 내용 검토
2. 유용한 컨텍스트를 `openspec/config.yaml`로 이동 (아래 가이드 참조)
3. 준비가 되면 파일 삭제

**이 변경을 한 이유:**

기존의 `project.md`는 수동적이었습니다 — 에이전트가 읽을 수도, 읽지 않을 수도, 읽은 내용을 잊어버릴 수도 있었습니다. 신뢰성이 일관되지 않다는 것을 발견했습니다.

새로운 `config.yaml` 컨텍스트는 **모든 OpenSpec 계획 요청에 능동적으로 주입됩니다**. 이는 귀하의 프로젝트 규칙, 기술 스택, 규칙이 AI가 아티팩트를 생성할 때 항상 존재한다는 것을 의미합니다. 더 높은 신뢰성.

**트레이드오프:**

컨텍스트가 모든 요청에 주입되므로, 간결하게 작성하는 것이 좋습니다. 정말 중요한 것에 집중하세요:
- 기술 스택과 주요 규칙
- AI가 알아야 할 명백하지 않은 제약 조건
- 이전에 자주 무시되었던 규칙

완벽하게 만들려고 걱정하지 마세요. 여기서 무엇이 가장 효과적인지 아직 배우고 있으며, 실험하면서 컨텍스트 주입 방식을 개선해 나갈 것입니다.

---

## 마이그레이션 실행

`openspec init`과 `openspec update` 모두 레거시 파일을 감지하고 동일한 정리 프로세스를 안내합니다. 상황에 맞는 명령어를 사용하세요:

- 새 설치는 프로필 `core`(`propose`, `explore`, `apply`, `sync`, `archive`)를 기본값으로 사용합니다.
- 마이그레이션된 설치는 필요한 경우 `custom` 프로필을 작성하여 이전에 설치한 워크플로우를 보존합니다.

### `openspec init` 사용

새 도구를 추가하거나 설정된 도구를 재구성하려면 이 명령어를 실행하세요:

```bash
openspec init
```

init 명령어는 레거시 파일을 감지하고 정리를 안내합니다:

```
새로운 OpenSpec으로 업그레이드

OpenSpec은 이제 코딩 에이전트 전반에서 부상하는 표준인 에이전트 스킬을 사용합니다.
이를 통해 모든 것이 이전처럼 작동하면서 설정이 간소화됩니다.

제거할 파일
보존할 사용자 콘텐츠 없음:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

업데이트할 파일
OpenSpec 마커가 제거되고, 귀하의 콘텐츠는 보존됩니다:
  • CLAUDE.md
  • AGENTS.md

주의 필요
  • openspec/project.md
    이 파일은 삭제하지 않습니다. 유용한 프로젝트 컨텍스트가 포함되어 있을 수 있습니다.

    새로운 openspec/config.yaml에는 계획 컨텍스트를 위한 "context:" 섹션이 있습니다.
    이는 모든 OpenSpec 요청에 포함되며 이전 project.md 접근 방식보다 더 안정적으로 작동합니다.

    project.md를 검토하고, 유용한 내용을 config.yaml의 context 섹션으로 이동한 다음,
    준비가 되면 파일을 삭제하세요.

? 레거시 파일을 업그레이드하고 정리하시겠습니까? (Y/n)
```

**'예'라고 말하면 무슨 일이 일어나나요:**

1. 레거시 슬래시 명령어 디렉토리가 제거됩니다.
2. `CLAUDE.md`, `AGENTS.md` 등에서 OpenSpec 마커가 제거됩니다 (귀하의 콘텐츠는 유지됨).
3. `openspec/AGENTS.md`가 삭제됩니다.
4. 새로운 스킬이 `.claude/skills/`에 설치됩니다.
5. `openspec/config.yaml`가 기본 스키마로 생성됩니다.

### `openspec update` 사용

기존 도구를 마이그레이션하고 최신 버전으로 새로 고치려면 이 명령어를 실행하세요:

```bash
openspec update
```

update 명령어는 레거시 아티팩트를 감지하고 정리한 다음, 현재 프로필 및 전달 설정에 맞게 생성된 스킬/명령어를 새로 고칩니다.

### 비대화형 / CI 환경

스크립트 기반 마이그레이션의 경우:

```bash
openspec init --force --tools claude
```

`--force` 플래그는 프롬프트를 건너뛰고 정리를 자동으로 수락합니다.

---

## project.md를 config.yaml로 마이그레이션

기존의 `openspec/project.md`는 프로젝트 컨텍스트를 위한 자유 형식 마크다운 파일이었습니다. 새로운 `openspec/config.yaml`는 구조화되어 있으며, 결정적으로 **모든 계획 요청에 주입되어** 귀하의 규칙이 AI가 작업할 때 항상 존재합니다.

### 이전 (project.md)

```markdown
# 프로젝트 컨텍스트

이것은 React와 Node.js를 사용하는 TypeScript 모노레포입니다.
테스트에는 Jest를 사용하며 엄격한 ESLint 규칙을 따릅니다.
우리의 API는 RESTful이며 docs/api.md에 문서화되어 있습니다.

## 규칙

- 모든 공개 API는 하위 호환성을 유지해야 합니다
- 새 기능에는 테스트가 포함되어야 합니다
- 명세에는 Given/When/Then 형식을 사용하세요
```

### 이후 (config.yaml)

```yaml
schema: spec-driven

context: |
  기술 스택: TypeScript, React, Node.js
  테스트: Jest 및 React Testing Library
  API: RESTful, docs/api.md에 문서화됨
  모든 공개 API의 하위 호환성을 유지합니다

rules:
  proposal:
    - 위험한 변경 사항에는 롤백 계획 포함
  specs:
    - 시나리오에 Given/When/Then 형식 사용
    - 새로운 패턴을 발명하기 전에 기존 패턴 참조
  design:
    - 복잡한 흐름에는 시퀀스 다이어그램 포함
```

### 주요 차이점

| project.md | config.yaml |
|------------|-------------|
| 자유 형식 마크다운 | 구조화된 YAML |
| 하나의 텍스트 덩어리 | 별도의 컨텍스트 및 아티팩트별 규칙 |
| 사용 시점 불명확 | 컨텍스트는 모든 아티팩트에 나타남; 규칙은 일치하는 아티팩트에만 나타남 |
| 스키마 선택 없음 | 명시적인 `schema:` 필드가 기본 워크플로우 설정 |

### 유지할 항목, 버릴 항목

마이그레이션 시 선별적으로 수행하세요. 스스로에게 질문하세요: "AI가 *모든* 계획 요청에 이것을 필요로 하나요?"

**`context:`에 적합한 후보:**
- 기술 스택 (언어, 프레임워크, 데이터베이스)
- 주요 아키텍처 패턴 (모노레포, 마이크로서비스 등)
- 명백하지 않은 제약 조건 ("X 라이브러리를 사용할 수 없는 이유는...")
- 자주 무시되는 중요한 규칙

**`rules:`로 이동할 항목:**
- 아티팩트별 형식 지정 ("명세에 Given/When/Then 사용")
- 검토 기준 ("제안서에는 롤백 계획 포함 필수")
- 이들은 일치하는 아티팩트에만 나타나 다른 요청을 가볍게 유지합니다.

**완전히 제외할 항목:**
- AI가 이미 알고 있는 일반적인 모범 사례
- 요약할 수 있는 장황한 설명
- 현재 작업에 영향을 주지 않는 역사적 컨텍스트

### 마이그레이션 단계

1. **config.yaml 생성** (init에 의해 아직 생성되지 않은 경우):
   ```yaml
   schema: spec-driven
   ```

2. **컨텍스트 추가** (간결하게 작성 — 모든 요청에 포함됨):
   ```yaml
   context: |
     프로젝트 배경을 여기에 입력하세요.
     AI가 진정으로 알아야 할 것에 집중하세요.
   ```

3. **아티팩트별 규칙 추가** (선택 사항):
   ```yaml
   rules:
     proposal:
       - 제안서별 안내
     specs:
       - 명세 작성 규칙
   ```

4. **유용한 내용을 모두 이동한 후 project.md 삭제**.

**과도하게 생각하지 마세요.** 필수 사항부터 시작하고 반복하세요. AI가 중요한 것을 놓치는 것을 발견하면 추가하세요. 컨텍스트가 부풀어 오른 것 같으면 다듬으세요. 이것은 살아있는 문서입니다.

### 도움이 필요하세요? 이 프롬프트를 사용하세요

project.md를 어떻게 정리해야 할지 확실하지 않다면, AI 어시스턴트에게 물어보세요:

```
OpenSpec의 이전 project.md에서 새로운 config.yaml 형식으로 마이그레이션하고 있습니다.

현재 project.md 내용은 다음과 같습니다:
[project.md 내용 붙여넣기]

다음과 같은 config.yaml을 만드는 데 도움을 주세요:
1. 간결한 `context:` 섹션 (모든 계획 요청에 주입되므로 간결하게 유지 — 기술 스택, 주요 제약 조건, 자주 무시되는 규칙에 집중)
2. 특정 아티팩트에 대한 `rules:` (콘텐츠가 아티팩트별인 경우, 예: "Given/When/Then 사용"은 전역 컨텍스트가 아닌 명세 규칙에 속함)

AI 모델이 이미 알고 있는 일반적인 내용은 제외하세요. 간결함에 대해 철저히 생각하세요.
```

AI가 필수적인 것과 다듬을 수 있는 것을 식별하는 데 도움을 줄 것입니다.

---

## 새로운 명령어

명령어 가용성은 프로필에 따라 다릅니다:

**기본값 (`core` 프로필):**

| 명령어 | 목적 |
|--------|------|
| `/opsx:propose` | 변경 사항을 만들고 계획 아티팩트를 한 단계에 생성 |
| `/opsx:explore` | 구조 없이 아이디어를 생각 |
| `/opsx:apply` | tasks.md의 작업 구현 |
| `/opsx:archive` | 변경 사항을 최종 확정하고 아카이브 |

**확장 워크플로우 (사용자 지정 선택):**

| 명령어 | 목적 |
|--------|------|
| `/opsx:new` | 새 변경 스캐폴드 시작 |
| `/opsx:continue` | 다음 아티팩트 생성 (한 번에 하나씩) |
| `/opsx:ff` | 빨리 감기 — 계획 아티팩트를 한 번에 생성 |
| `/opsx:verify` | 구현이 명세와 일치하는지 확인 |
| `/opsx:sync` | 델타 명세를 메인 명세에 병합 |
| `/opsx:bulk-archive` | 여러 변경 사항을 한 번에 아카이브 |
| `/opsx:onboard` | 안내된 종단간 온보딩 워크플로우 |

`openspec config profile`로 확장 명령어를 활성화한 다음 `openspec update`를 실행하세요.

### 레거시에서의 명령어 매핑

| 레거시 | OPSX 동등 명령어 |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (기본값) 또는 `/opsx:new` 다음 `/opsx:ff` (확장) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 새로운 기능

이러한 기능은 확장 워크플로우 명령어 세트의 일부입니다.

**세분화된 아티팩트 생성:**
```
/opsx:continue
```
의존성에 따라 한 번에 하나의 아티팩트를 생성합니다. 각 단계를 검토하려는 경우 사용하세요.

**탐색 모드:**
```
/opsx:explore
```
변경 사항을 확정하기 전에 파트너와 아이디어를 생각해 보세요.

---

## 새로운 아키텍처 이해

### 고정형에서 유동형으로

레거시 워크플로우는 선형 진행을 강제했습니다:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

구현 중에 설계가 잘못되었다는 것을 깨달으면?
안타깝게도. 단계 게이트는 쉽게 되돌아가게 해주지 않습니다.
```

OPSX는 단계가 아닌, 액션을 사용합니다:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (단계가 아닌)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    어떤 순서로든               │
         └───────────────────────────────────────────────┘
```

### 의존성 그래프

아티팩트들은 방향 그래프를 형성합니다. 의존성은 게이트가 아닌, 활성화 요소입니다:

```
                        proposal
                       (루트 노드)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (요구사항:                  (요구사항:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (요구사항:
                     specs, design)
```

`/opsx:continue`를 실행하면, 준비된 항목을 확인하고 다음 아티팩트를 제안합니다. 준비된 여러 아티팩트를 어떤 순서로든 생성할 수도 있습니다.

### 스킬 vs 명령어

레거시 시스템은 도구별 명령어 파일을 사용했습니다:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX는 새롭게 부상하는 **스킬** 표준을 사용합니다:

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

## 기존 변경사항 계속하기

진행 중인 변경사항은 OPSX 명령어와 원활하게 작동합니다.

**레거시 워크플로우에서 활성화된 변경사항이 있으십니까?**

```
/opsx:apply add-my-feature
```

OPSX는 기존 아티팩트를 읽고 중단된 지점부터 계속합니다.

**기존 변경사항에 아티팩트를 더 추가하고 싶으십니까?**

```
/opsx:continue add-my-feature
```

이미 존재하는 것을 기반으로 생성할 준비가 된 항목을 보여줍니다.

**상태를 확인해야 합니까?**

```bash
openspec status --change add-my-feature
```

---

## 새로운 설정 시스템

### config.yaml 구조

```yaml
# 필수: 새 변경사항의 기본 스키마
schema: spec-driven

# 선택사항: 프로젝트 컨텍스트 (최대 50KB)
# 모든 아티팩트 지시문에 주입됨
context: |
  프로젝트 배경, 기술 스택,
  규약 및 제약 조건.

# 선택사항: 아티팩트별 규칙
# 일치하는 아티팩트에만 주입됨
rules:
  proposal:
    - 롤백 계획 포함
  specs:
    - Given/When/Then 형식 사용
  design:
    - 폴백 전략 문서화
  tasks:
    - 최대 2시간 단위로 분할
```

### 스키마 결정

어떤 스키마를 사용할지 결정할 때, OPSX는 다음 순서로 확인합니다:

1. **CLI 플래그**: `--schema <name>` (최우선)
2. **변경사항 메타데이터**: 변경사항 디렉토리의 `.openspec.yaml`
3. **프로젝트 설정**: `openspec/config.yaml`
4. **기본값**: `spec-driven`

### 사용 가능한 스키마

| 스키마 | 아티팩트 | 적합한 용도 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | 대부분의 프로젝트 |

사용 가능한 모든 스키마를 나열하려면:

```bash
openspec schemas
```

### 사용자 정의 스키마

자신만의 워크플로우를 만드세요:

```bash
openspec schema init my-workflow
```

또는 기존 것을 포크하세요:

```bash
openspec schema fork spec-driven my-workflow
```

자세한 내용은 [사용자 정의](customization.md)를 참조하세요.

---

## 문제 해결

### "비대화형 모드에서 레거시 파일이 감지되었습니다"

CI 또는 비대화형 환경에서 실행 중입니다. 다음을 사용하세요:

```bash
openspec init --force
```

### 마이그레이션 후 명령어가 나타나지 않음

IDE를 다시 시작하세요. 스킬은 시작 시 감지됩니다.

### "규칙에서 알 수 없는 아티팩트 ID"

`rules:` 키가 스키마의 아티팩트 ID와 일치하는지 확인하세요:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

유효한 아티팩트 ID를 확인하려면 다음을 실행하세요:

```bash
openspec schemas --json
```

### 설정이 적용되지 않음

1. 파일이 `openspec/config.yaml` (`.yml`이 아닌)에 있는지 확인하세요
2. YAML 구문을 검증하세요
3. 설정 변경은 즉시 적용됩니다—재시작 불필요

### project.md가 마이그레이션되지 않음

시스템은 사용자 정의 내용이 포함될 수 있으므로 의도적으로 `project.md`를 보존합니다. 수동으로 검토하고, 유용한 부분을 `config.yaml`로 이동한 다음 삭제하세요.

### 정리될 항목을 확인하고 싶으십니까?

init을 실행하고 정리 프롬프트를 거부하세요—변경 사항 없이 전체 감지 요약을 볼 수 있습니다.

---

## 빠른 참조

### 마이그레이션 후 파일

```
project/
├── openspec/
│   ├── specs/                    # 변경 없음
│   ├── changes/                  # 변경 없음
│   │   └── archive/              # 변경 없음
│   └── config.yaml               # 신규: 프로젝트 설정
├── .claude/
│   └── skills/                   # 신규: OPSX 스킬
│       ├── openspec-propose/     # 기본 코어 프로필
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # 확장 프로필은 new/continue/ff/등 추가
├── CLAUDE.md                     # OpenSpec 마커 제거됨, 사용자 내용 보존
└── AGENTS.md                     # OpenSpec 마커 제거됨, 사용자 내용 보존
```

### 제거된 항목

- `.claude/commands/openspec/` — `.claude/skills/`로 대체됨
- `openspec/AGENTS.md` — 폐기됨
- `openspec/project.md` — `config.yaml`로 마이그레이션 후 삭제
- `CLAUDE.md`, `AGENTS.md` 등에서 OpenSpec 마커 블록

### 명령어 치트시트

```text
/opsx:propose      빠르게 시작 (기본 코어 프로필)
/opsx:apply        태스크 구현
/opsx:archive      완료 및 아카이브

# 확장 워크플로우 (활성화된 경우):
/opsx:new          변경사항 스캐폴딩
/opsx:continue     다음 아티팩트 생성
/opsx:ff           계획 아티팩트 생성
```

---

## 도움말 받기

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **문서**: 전체 OPSX 참조는 [docs/opsx.md](opsx.md)