# OPSX로 마이그레이션

이 가이드는 기존 레거시 OpenSpec 워크플로에서 OPSX로 전환하는 것을 도와줍니다. 마이그레이션은 원활하도록 설계되었습니다—기존 작업이 보존되며, 새로운 시스템이 더 많은 유연성을 제공합니다.

## 변경 사항

OPSX는 기존 단계 잠금 워크플로를 유동적이고 액션 기반의 접근 방식으로 대체합니다. 주요 변경 사항은 다음과 같습니다:

| 항목 | 기존 시스템 | OPSX |
|--------|--------|------|
| **명령어** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | 기본값: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (확장 워크플로 명령은 선택 사항) |
| **워크플로** | 한 번에 모든 아티팩트 생성 | 점진적으로 또는 한 번에 생성—선택은 사용자에게 있습니다. |
| **되돌리기** | 불편한 단계 게이트 | 자연스러움—언제든지 모든 아티팩트 업데이트 가능 |
| **커스터마이징** | 고정 구조 | 스키마 기반, 완전히 커스터마이징 가능 |
| **설정** | 마커가 포함된 `CLAUDE.md` + `project.md` | `openspec/config.yaml`에 깔끔한 설정 |

**철학적 변화:** 작업은 선형적이지 않습니다. OPSX는 더 이상 선형적이라고 가장하지 않습니다.

---

## 시작하기 전에

### 기존 작업은 안전합니다

마이그레이션 과정은 보존을 염두에 두고 설계되었습니다:

- `openspec/changes/`의 **활성 변경 사항** — 완전히 보존됩니다. OPSX 명령으로 계속 진행할 수 있습니다.
- **보관된 변경 사항** — 그대로 유지됩니다. 기록이 그대로 보존됩니다.
- `openspec/specs/`의 **주요 스펙** — 그대로 유지됩니다. 이것이 신뢰할 수 있는 소스입니다.
- `CLAUDE.md`, `AGENTS.md` 등의 **내용** — 보존됩니다. OpenSpec 마커 블록만 제거되며, 작성한 모든 내용은 그대로 유지됩니다.

### 제거되는 항목

대체되는 OpenSpec 관리 파일만 제거됩니다:

| 항목 | 이유 |
|------|------|
| 레거시 슬래시 명령 디렉토리/파일 | 새로운 스킬 시스템으로 대체됨 |
| `openspec/AGENTS.md` | 더 이상 사용되지 않는 워크플로우 트리거 |
| `CLAUDE.md`, `AGENTS.md` 등의 OpenSpec 마커 | 더 이상 필요하지 않음 |

**도구별 레거시 명령 위치** (예시—사용 중인 도구에 따라 다를 수 있습니다):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.cinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (IDE 확장만 지원; Copilot CLI에서는 지원되지 않음)
- Codex: OpenSpec는 이제 `.codex/skills/openspec-*`를 사용합니다; 레거시 정리는 `$CODEX_HOME/prompts` 또는 `~/.codex/prompts`에 있는 OpenSpec의 허용 목록 프롬프트 파일 이름만 대상으로 하며, 대체 스킬이 존재한 후에만 제거합니다.
- 기타 도구들 (Augment, Continue, Amazon Q 등)

마이그레이션은 구성한 도구를 감지하여 해당 도구의 레거시 파일을 정리합니다.

제거 목록이 길어 보일 수 있지만, 이는 모두 OpenSpec가 원래 생성한 파일입니다. 사용자의 콘텐츠는 절대 삭제되지 않습니다.

### 주의가 필요한 항목

한 파일을 수동으로 마이그레이션해야 합니다:

**`openspec/project.md`** — 이 파일은 작성한 프로젝트 컨텍스트가 포함될 수 있으므로 자동으로 삭제되지 않습니다. 다음 작업을 수행해야 합니다:

1. 내용 검토
2. 유용한 컨텍스트를 `openspec/config.yaml`로 이동 (아래 지침 참조)
3. 준비가 되면 파일 삭제

**이 변경을 한 이유:**

기존 `project.md`는 수동적이었습니다—에이전트가 읽을 수도 있고, 읽지 않을 수도 있고, 읽은 내용을 잊을 수도 있었습니다. 신뢰성이 일관되지 않다는 것을 발견했습니다.

새로운 `config.yaml` 컨텍스트는 **모든 OpenSpec 계획 요청에 능동적으로 삽입됩니다**. 즉, AI가 아티팩트를 생성할 때 프로젝트 규칙, 기술 스택, 규칙이 항상 포함됩니다. 더 높은 신뢰성입니다.

**트레이드오프:**

컨텍스트가 모든 요청에 삽입되므로 간결하게 작성하는 것이 좋습니다. 정말 중요한 것에 집중하세요:

- 기술 스택과 주요 규칙
- AI가 알아야 할 명확하지 않은 제약 조건
- 이전에 자주 무시되었던 규칙

완벽하게 만들려고 걱정하지 마세요. 여기서 무엇이 가장 효과적인지 아직 배우는 중이며, 실험하면서 컨텍스트 삽입 방식을 개선할 것입니다.

---

## 마이그레이션 실행하기

`openspec init`와 `openspec update` 모두 레거시 파일을 감지하여 동일한 정리 과정을 안내합니다. 상황에 맞는 명령을 사용하세요:

- 새 설치의 기본 프로필은 `core`입니다 (`propose`, `explore`, `apply`, `sync`, `archive`).
- 마이그레이션된 설치에서는 필요한 경우 `custom` 프로필을 작성하여 이전에 설치한 워크플로우를 보존합니다.

### `openspec init` 사용하기

새 도구를 추가하거나 설정된 도구를 재구성하려면 이 명령을 실행하세요:

```bash
openspec init
```

init 명령은 레거시 파일을 감지하여 정리 과정을 안내합니다:

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**예라고 답하면 다음과 같이 진행됩니다:**

1. 레거시 슬래시 명령 디렉토리가 제거됩니다
2. `CLAUDE.md`, `AGENTS.md` 등에서 OpenSpec 마커가 제거됩니다 (사용자 콘텐츠는 유지됨)
3. `openspec/AGENTS.md`가 삭제됩니다
4. 새로운 스킬이 `.claude/skills/`에 설치됩니다
5. 기본 스키마로 `openspec/config.yaml`가 생성됩니다

### `openspec update` 사용하기

기존 도구를 마이그레이션하고 최신 버전으로 업데이트하려면 이 명령을 실행하세요:

```bash
openspec update
```

update 명령은 레거시 아티팩트를 감지하고 정리한 다음, 현재 프로필과 전달 설정에 맞게 생성된 스킬/명령을 새로고침합니다.

### 비대화형 / CI 환경

스크립트 기반 마이그레이션의 경우:

```bash
openspec init --force --tools claude
```

`--force` 플래그는 프롬프트를 건너뛰고 정리를 자동으로 승인합니다.

이는 전역 Codex 프롬프트 디렉토리에 있는 OpenSpec 관리 Codex 프롬프트 파일의 정리를 포함합니다. 정리는 OpenSpec의 허용 목록 레거시 Codex 프롬프트 파일 이름만 대상으로 하며, 대체 `.codex/skills/openspec-*` 스킬이 존재한 후에만 제거하고 다른 모든 파일은 보존합니다.

---

## project.md에서 config.yaml로 마이그레이션하기

기존 `openspec/project.md`는 프로젝트 컨텍스트를 위한 자유 형식 마크다운 파일이었습니다. 새로운 `openspec/config.yaml`는 구조화되어 있으며, **중요하게도 모든 계획 요청에 삽입되므로** AI가 작업할 때 규칙이 항상 포함됩니다.

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
| 하나의 텍스트 덩어리 | 컨텍스트와 아티팩트별 규칙이 분리됨 |
| 사용 시점이 명확하지 않음 | 컨텍스트는 모든 아티팩트에 포함; 규칙은 해당 아티팩트에만 포함 |
| 스키마 선택 없음 | 명시적 `schema:` 필드가 기본 워크플로우를 설정 |

### 유지할 것과 버릴 것

마이그레이션할 때 선택적으로 진행하세요. "AI가 *모든* 계획 요청에 이것이 필요한가?" 라고 스스로에게 물어보세요:

**`context:`에 넣기 좋은 항목**

- 기술 스택 (언어, 프레임워크, 데이터베이스)
- 주요 아키텍처 패턴 (모노레포, 마이크로서비스 등)
- 명확하지 않은 제약 조건 ("우리는 ~때문에 X 라이브러리를 사용할 수 없습니다" 등)
- 자주 무시되는 중요한 규칙

**대신 `rules:`로 이동**

- 아티팩트별 형식 ("스펙에 Given/When/Then 사용" 등)
- 검토 기준 ("제안에는 롤백 계획이 포함되어야 함" 등)
- 이는 해당 아티팩트에만 나타나므로 다른 요청은 더 가벼워집니다

**완전히 제외**

- AI가 이미 알고 있는 일반적인 모범 사례
- 요약할 수 있는 장황한 설명
- 현재 작업에 영향을 미치지 않는 과거 컨텍스트

### 마이그레이션 단계

1. **config.yaml 생성** (init에서 아직 생성되지 않은 경우):
   ```yaml
   schema: spec-driven
   ```

2. **컨텍스트 추가** (간결하게 작성하세요—모든 요청에 포함됩니다):
   ```yaml
   context: |
     프로젝트 배경을 여기에 작성하세요.
     AI가 진정으로 알아야 할 것에 집중하세요.
   ```

3. **아티팩트별 규칙 추가** (선택 사항):
   ```yaml
   rules:
     proposal:
       - 제안 관련 지침
     specs:
       - 스펙 작성 규칙
   ```

4. 유용한 내용을 모두 이동한 후 **project.md 삭제**.

**너무 고민하지 마세요.** 필수 항목부터 시작해서 반복하세요. AI가 중요한 것을 놓치고 있다고 느끼면 추가하세요. 컨텍스트가 너무 많다고 느끼면 줄이세요. 이는 살아있는 문서입니다.

### 도움이 필요하신가요? 이 프롬프트를 사용하세요

project.md를 간결하게 정리하는 방법을 모르겠다면 AI 어시스턴트에게 다음과 같이 질문하세요:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI가 필수 항목과 줄일 수 있는 항목을 구분하는 데 도움을 줄 것입니다.

---

## 새로운 명령어

명령어 사용 가능 여부는 프로필에 따라 다릅니다:

**기본 (`core` 프로필):**

| 명령어 | 목적 |
|---------|---------|
| `/opsx:propose` | 변경 사항 생성 및 계획 아티팩트를 한 단계로 생성 |
| `/opsx:explore` | 구조 없이 아이디어를 구체화 |
| `/opsx:apply` | tasks.md의 작업 구현 |
| `/opsx:archive` | 변경 사항을 마무리하고 보관 |

**확장 워크플로우 (사용자 지정 선택):**

| 명령어 | 목적 |
|---------|---------|
| `/opsx:new` | 새 변경 스캐폴드 시작 |
| `/opsx:continue` | 다음 아티팩트 생성 (한 번에 하나씩) |
| `/opsx:ff` | 패스트 포워드—계획 아티팩트를 한 번에 생성 |
| `/opsx:verify` | 구현이 스펙과 일치하는지 검증 |
| `/opsx:sync` | 델타 스펙을 메인 스펙에 병합 |
| `/opsx:bulk-archive` | 여러 변경 사항을 한 번에 보관 |
| `/opsx:onboard` | 안내형 엔드투엔드 온보딩 워크플로우 |

확장 명령어를 활성화하려면 `openspec config profile`를 실행한 다음 `openspec update`를 실행하세요.

### 레거시 명령어 매핑

| 레거시 | OPSX 동등 명령어 |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (기본) 또는 `/opsx:new` 후 `/opsx:ff` (확장) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 새로운 기능

이 기능들은 확장 워크플로우 명령어 세트의 일부입니다.

**세밀한 아티팩트 생성:**

```
/opsx:continue
```

종속성에 따라 한 번에 하나의 아티팩트를 생성합니다. 각 단계를 검토하려는 경우 사용하세요.

**탐색 모드:**

```
/opsx:explore
```

변경 사항을 확정하기 전에 파트너와 함께 아이디어를 구체화합니다.

---

## 새로운 아키텍처 이해하기

### 단계 잠금에서 유동적으로

레거시 워크플로우는 선형 진행을 강제했습니다:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
```

OPSX는 단계가 아닌 액션을 사용합니다:

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

아티팩트는 방향성 그래프를 형성합니다. 의존성은 게이트가 아니라 활성화 조건입니다:

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

`/opsx:continue`를 실행하면 준비된 것을 확인하고 다음 아티팩트를 제안합니다. 원하는 경우 준비된 여러 아티팩트를 원하는 순서로 생성할 수도 있습니다.

### 스킬과 명령어

레거시 시스템은 도구별 명령 파일을 사용했습니다:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX는 부상하는 **스킬** 표준을 사용합니다:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

스킬은 여러 AI 코딩 도구에서 인식되며 더 풍부한 메타데이터를 제공합니다.

Codex는 OPSX에서 스킬만 사용합니다. OpenSpec는 더 이상 Codex 사용자 지정 프롬프트 파일을 생성하지 않습니다; 대신 생성된 `.codex/skills/openspec-*` 디렉토리를 사용하세요.

## 기존 변경 사항 계속하기

진행 중인 변경 사항은 OPSX 명령어와 완벽하게 호환됩니다.

**레거시 워크플로우에서 활성화된 변경 사항이 있나요?**

```
/opsx:apply add-my-feature
```

OPSX가 기존 아티팩트를 읽어 중단한 부분부터 계속 진행합니다.

**기존 변경 사항에 아티팩트를 더 추가하고 싶으신가요?**

```
/opsx:continue add-my-feature
```

기존에 생성된 아티팩트를 기반으로 생성할 수 있는 항목을 보여줍니다.

**상태를 확인하고 싶으신가요?**

```bash
openspec status --change add-my-feature
```

---

## 새로운 설정 시스템

### config.yaml 구조

```yaml
# 필수: 새 변경 사항의 기본 스키마
schema: spec-driven

# 선택 사항: 프로젝트 컨텍스트 (최대 50KB)
# 모든 아티팩트 지침에 주입됩니다.
context: |
  Your project background, tech stack,
  conventions, and constraints.

# 선택 사항: 아티팩트별 규칙
# 해당하는 아티팩트에만 주입됩니다.
rules:
  proposal:
    - 롤백 계획 포함
  specs:
    - Given/When/Then 형식 사용
  design:
    - 대체 전략 문서화
  tasks:
    - 최대 2시간 단위로 분할
```

### 스키마 결정

사용할 스키마를 결정할 때 OPSX는 다음 순서대로 확인합니다:

1. **CLI 플래그**: `--schema <이름>` (최우선 순위)
2. **변경 메타데이터**: 변경 디렉터리의 `.openspec.yaml`
3. **프로젝트 설정**: `openspec/config.yaml`
4. **기본값**: `spec-driven`

### 사용 가능한 스키마

| 스키마 | 아티팩트 | 적합한 사용 사례 |
|--------|-----------|----------|
| `spec-driven` | 제안 → 명세 → 설계 → 작업 | 대부분의 프로젝트 |

사용 가능한 모든 스키마를 나열하려면:

```bash
openspec schemas
```

### 커스텀 스키마

자신만의 워크플로우를 생성하려면:

```bash
openspec schema init my-workflow
```

또는 기존 스키마를 포크하려면:

```bash
openspec schema fork spec-driven my-workflow
```

자세한 내용은 [커스터마이징](customization.md)을 참고하세요.

---

## 문제 해결

### "비대화형 모드에서 레거시 파일이 감지됨"

CI 또는 비대화형 환경에서 실행 중입니다. 다음 명령어를 사용하세요:

```bash
openspec init --force
```

### 마이그레이션 후 명령어가 표시되지 않는 경우

IDE를 재시작하세요. 스킬은 시작 시 감지됩니다.

### "규칙에 알 수 없는 아티팩트 ID"

`rules:` 키가 스키마의 아티팩트 ID와 일치하는지 확인하세요:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

유효한 아티팩트 ID를 확인하려면 다음 명령어를 실행하세요:

```bash
openspec schemas --json
```

### 설정이 적용되지 않는 경우

1. 파일이 `openspec/config.yaml`에 위치하는지 확인하세요 (`.yml`이 아님)
2. YAML 구문을 검증하세요
3. 설정 변경 사항은 즉시 적용되며, 재시작이 필요하지 않습니다.

### project.md가 마이그레이션되지 않는 경우

시스템은 `project.md`에 사용자 정의 콘텐츠가 포함될 수 있으므로 의도적으로 보존합니다. 직접 검토한 후 유용한 부분을 `config.yaml`으로 이동한 뒤 삭제하세요.

### 정리될 내용을 미리 확인하고 싶으신가요?

init을 실행한 뒤 정리 프롬프트를 거절하면, 변경 사항이 적용되지 않은 상태로 전체 감지 요약을 확인할 수 있습니다.

---

## 빠른 참조

### 마이그레이션 후 파일 구조

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
│       └── ...                   # 확장 프로필은 new/continue/ff 등 추가
├── CLAUDE.md                     # OpenSpec 마커가 제거되었으며, 사용자 콘텐츠는 보존됩니다
└── AGENTS.md                     # OpenSpec 마커가 제거되었으며, 사용자 콘텐츠는 보존됩니다
```

### 삭제된 항목

- `.claude/commands/openspec/` — `.claude/skills/`로 대체됨
- `openspec/AGENTS.md` — 더 이상 사용되지 않음
- `openspec/project.md` — `config.yaml`로 마이그레이션한 뒤 삭제
- `CLAUDE.md`, `AGENTS.md` 등의 OpenSpec 마커 블록

### 명령어 치트시트

```text
/opsx:propose      빠르게 시작 (기본 코어 프로필)
/opsx:apply        작업 구현
/opsx:archive      완료 후 아카이브

# 확장 워크플로우 (활성화된 경우):
/opsx:new          변경 사항 스캐폴딩
/opsx:continue     다음 아티팩트 생성
/opsx:ff           계획 아티팩트 생성
```

---

## 도움 받기

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub 이슈**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **문서**: 전체 OPSX 레퍼런스는 [docs/opsx.md](opsx.md)를 참고하세요.