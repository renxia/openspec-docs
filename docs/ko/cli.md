# CLI 참조

OpenSpec CLI (`openspec`)는 프로젝트 설정, 유효성 검사, 상태 검사 및 관리를 위한 터미널 명령을 제공합니다. 이 명령어들은 [Commands](commands.md)에 문서화된 AI 슬래시 명령어(예: `/opsx:propose`)를 보완합니다.

## 요약

| 카테고리 | 명령어 | 목적 |
|----------|----------|---------|
| **Setup** | `init`, `update` | 프로젝트에 OpenSpec을 초기화하고 업데이트합니다 |
| **Stores (독립형 OpenSpec 리포지토리)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | 등록한 독립형 OpenSpec 리포지토리를 관리합니다 |
| **Health** | `doctor` | 해결된 루트의 관계 상태를 보고합니다 |
| **Working context** | `context` | 작업 세트(루트 + 참조된 스토어)를 조립합니다 |
| **Personal worksets** | `workset create`, `workset list`, `workset open`, `workset remove` | 도구 내에서 개인적이고 로컬인 작업 뷰를 유지하고 엽니다 |
| **Browsing** | `list`, `view`, `show` | 변경 사항과 사양을 탐색합니다 |
| **Validation** | `validate` | 변경 사항 및 사양에 문제가 있는지 확인합니다 |
| **Lifecycle** | `archive` | 완료된 변경 사항을 최종 확정합니다 |
| **Workflow** | `new change`, `status`, `instructions`, `templates`, `schemas` | 아티팩트 기반 워크플로우 지원 |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | 사용자 정의 워크플로우를 생성하고 관리합니다 |
| **Config** | `config` | 설정을 보고 수정합니다 |
| **Utility** | `feedback`, `completion` | 피드백 및 셸 통합 |

---

## 사용자(Human) 명령어 대 에이전트(Agent) 명령어

대부분의 CLI 명령어는 터미널에서 **사용자에게 사용**되도록 설계되었습니다. 일부 명령어는 JSON 출력을 통해 **에이전트/스크립트 사용**도 지원합니다.

### 사용자 전용 명령어

이 명령어들은 인터랙티브하며 터미널 사용을 위해 설계되었습니다:

| Command | 용도 |
|---------|---------|
| `openspec init` | 프로젝트 초기화 (인터랙티브 프롬프트) |
| `openspec view` | 인터랙티브 대시보드 |
| `openspec workset open <name>` | 저장된 작업 세트 열기 (에디터 창 또는 터미널 에이전트 세션) |
| `openspec config edit` | 에디터에서 설정 열기 |
| `openspec feedback` | GitHub를 통해 피드백 제출 |
| `openspec completion install` | 쉘 완성 기능 설치 |

### 에이전트 호환 명령어

이 명령어들은 AI 에이전트와 스크립트의 프로그래밍적 사용을 위해 `--json` 출력을 지원합니다:

| Command | 사용자 사용 | 에이전트 사용 |
|---------|-----------|-----------|
| `openspec list` | 변경 사항/사양 탐색 | 구조화된 데이터를 위한 `--json` |
| `openspec show <item>` | 내용 읽기 | 파싱을 위한 `--json` |
| `openspec validate` | 문제 확인 | 대량 검증을 위한 `--all --json` |
| `openspec status` | 아티팩트 진행 상황 보기 | 구조화된 상태를 위한 `--json` |
| `openspec instructions` | 다음 단계 얻기 | 에이전트 지침을 위한 `--json` |
| `openspec templates` | 템플릿 경로 찾기 | 경로 해석을 위한 `--json` |
| `openspec schemas` | 사용 가능한 스키마 목록 보기 | 스키마 검색을 위한 `--json` |
| `openspec store setup <id>` | 로컬 저장소 생성 및 등록 | 구조화된 설정 출력을 위한 명시적 입력이 있는 `--json` |
| `openspec store register <path>` | 기존 저장소 등록 | 구조화된 등록 출력을 위한 `--json` |
| `openspec store unregister <id>` | 로컬 저장소 등록 해제 | 구조화된 정리 출력을 위한 `--json` |
| `openspec store remove <id>` | 등록된 로컬 저장소 폴더 삭제 | 비인터랙티브 삭제를 위한 `--yes --json` |
| `openspec store list` | 등록된 저장소 탐색 | 구조화된 등록을 위한 `--json` |
| `openspec store doctor` | 로컬 저장소 설정 확인 | 구조화된 진단 결과를 위한 `--json` |
| `openspec new change <id>` | 리포지토리 로컬 변경 사항 스캐폴딩 생성 | 등록된 저장소를 OpenSpec 루트로 사용하기 위한 `--member <path> --json` 포함 |
| `openspec workset create [name]` | 개인 작업 뷰 구성 | 비인터랙티브 구성을 위한 `--member <path> --json` |
| `openspec workset list` | 저장된 작업 세트 탐색 | 구조화된 뷰를 위한 `--json` |
| `openspec workset remove <name>` | 저장된 뷰 삭제 | 비인터랙티브 제거를 위한 `--yes --json` |

---

## 전역 옵션 (Global Options)

이 옵션들은 모든 명령어와 함께 작동합니다:

| Option | 설명 |
|--------|-------------|
| `--version`, `-V` | 버전 번호 표시 |
| `--no-color` | 색상 출력 비활성화 |
| `--help`, `-h` | 명령 도움말 표시 |

---

## 설정 명령어 (Setup Commands)

### `openspec init`

프로젝트에 OpenSpec을 초기화합니다. 폴더 구조를 생성하고 AI 도구 통합을 구성합니다.

기본 동작은 전역 설정 기본값(프로필 `core`, 배포 `both`, 워크플로우 `propose, explore, apply, sync, archive`)을 사용합니다.

```
openspec init [path] [options]
```

**인수 (Arguments):**

| Argument | 필수 여부 | 설명 |
|----------|----------|-------------|
| `path` | 없음 | 대상 디렉토리 (기본값: 현재 디렉토리) |

**옵션 (Options):**

| Option | 설명 |
|--------|-------------|
| `--tools <list>` | AI 도구를 비인터랙티브로 구성합니다. `all`, `none` 또는 쉼표로 구분된 목록을 사용하십시오 |
| `--force` | 프롬프트 없이 레거시 파일을 자동 정리합니다 |
| `--profile <profile>` | 이 초기화 실행에 대한 전역 프로필을 재정의합니다 (`core` 또는 `custom`) |

`--profile custom`은 현재 전역 설정(`openspec config profile`)에서 선택된 워크플로우를 사용합니다.

**지원되는 도구 ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> 이 목록은 `src/core/config.ts`의 `AI_TOOLS`를 미러링합니다. 각 도구의 기술 및 명령어 경로는 [Supported Tools](supported-tools.md)를 참조하십시오.

**예시:**

```bash
# 인터랙티브 초기화
openspec init

# 특정 디렉토리에서 초기화
openspec init ./my-project

# 비인터랙티브: Claude와 Cursor용으로 구성
openspec init --tools claude,cursor

# 모든 지원되는 도구에 대해 구성
openspec init --tools all

# 이 실행을 위해 프로필 재정의
openspec init --profile core

# 프롬프트를 건너뛰고 레거시 파일을 자동 정리
openspec init --force
```

**생성되는 항목:**

```
openspec/
├── specs/              # 귀하의 사양 (진실의 원천)
├── changes/            # 제안된 변경 사항
└── config.yaml         # 프로젝트 구성

.claude/skills/         # Claude 코드 기술 (claude가 선택된 경우)
.cursor/skills/         # Cursor 기술 (cursor가 선택된 경우)
.cursor/commands/       # Cursor OPSX 명령어 (배포에 명령이 포함된 경우)
... (기타 도구 구성)
```

---

### `openspec update`

CLI를 업그레이드한 후 OpenSpec 지침 파일을 업데이트합니다. 현재 전역 프로필, 선택된 워크플로우 및 배포 모드를 사용하여 AI 도구 구성 파일을 다시 생성합니다.

```
openspec update [path] [options]
```

**인수 (Arguments):**

| Argument | 필수 여부 | 설명 |
|----------|----------|-------------|
| `path` | 없음 | 대상 디렉토리 (기본값: 현재 디렉토리) |

**옵션 (Options):**

| Option | 설명 |
|--------|-------------|
| `--force` | 파일이 최신 상태일 때도 강제 업데이트합니다 |

**예시:**

```bash
# npm 업그레이드 후 지침 파일 업데이트
npm update @fission-ai/openspec
openspec update
```

---

## 저장소 (Stores - 독립형 OpenSpec 리포지토리)

> **베타.** 저장소와 이를 기반으로 구축된 기능(참조, 작업 컨텍스트, 작업 세트)은 새로 도입되었습니다. 명령어 이름, 플래그, 파일 형식 및 JSON 출력은 릴리스 간에 형태가 변경될 수 있습니다. 문제 중심 워크스루는 [stores 가이드](stores-beta/user-guide.md)를 참조하십시오.

저장소는 이 머신에 등록된 독립형 OpenSpec 리포지토리입니다. 예를 들어, 계획 리포지토리나 계약 리포지토리가 될 수 있습니다. 저장소를 등록하면 일반 명령어(`list`, `show`, `status`, `validate`, `new change`, `archive`, ...)가 `--store <id>`를 전달하여 어디서든 해당 저장소에서 작동할 수 있게 됩니다.

### `openspec store setup`

로컬 저장소를 생성하고 등록합니다. 터미널에 인수가 없으면 OpenSpec이 사용자에게 설정을 안내합니다. 에이전트와 스크립트는 명시적인 입력을 전달하고 `--json`을 사용해야 합니다.

```bash
openspec store setup [id] [options]
```

**옵션 (Options):**

| Option | 설명 |
|--------|-------------|
| `--path <path>` | 저장소가 위치할 폴더 (예: `~/openspec/<id>`) |
| `--remote <url>` | 새 저장소의 `store.yaml`에 정식 원격 복제본을 기록합니다 |
| `--init-git` | 초기 커밋으로 Git 리포지토리를 초기화합니다 (기본값) |
| `--no-init-git` | 모든 Git 작업을 건너뜁니다: 초기화 없음, 초기 커밋 없음 |
| `--json` | JSON 출력 |

비인터랙티브 실행(`--json`, 스크립트, 에이전트)은 저장소 ID와 `--path`를 모두 전달해야 합니다. 인터랙티브 터미널에서는 위치에 대한 프롬프트가 표시되며 편집 가능한 제안을 사용자 소유의 가시적인 위치(예: `~/openspec/<id>`)에 제공합니다. OpenSpec의 관리 데이터 디렉토리로 기본 설정되는 일은 없습니다.

**예시:**

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

기존 로컬 저장소 폴더를 등록합니다.

```bash
openspec store register [path] [options]
```

**옵션 (Options):**

| Option | 설명 |
|--------|-------------|
| `--id <id>` | 저장소 ID; 기본값은 저장소 메타데이터 또는 폴더 이름입니다 |
| `--yes` | 건강한 OpenSpec 루트를 위한 저장소 식별자 메타데이터 생성을 확인합니다 |
| `--json` | JSON 출력 |

### `openspec store unregister`

파일을 삭제하지 않고 로컬 저장소 등록을 해제합니다.

```bash
openspec store unregister <id> [--json]
```

이 명령어는 저장소가 이동했거나, 다른 곳으로 클론되었거나, 이 머신에서 더 이상 OpenSpec에 표시되어서는 안 될 때 사용하십시오.

### `openspec store remove`

로컬 저장소 등록을 해제하고 해당 로컬 폴더를 삭제합니다.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove`는 인터랙티브 터미널에서 삭제 전에 정확한 폴더를 표시합니다. 에이전트, 스크립트 및 JSON 호출자는 삭제를 확인하기 위해 `--yes`를 전달해야 합니다. OpenSpec은 일치하는 저장소 메타데이터가 포함되어 있지 않은 폴더의 삭제를 거부합니다.

### `openspec store list`

로컬에 등록된 저장소를 나열합니다.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

로컬 저장소 등록, 메타데이터 및 Git 존재 여부를 확인합니다.

```bash
openspec store doctor [id] [--json]
```

Doctor는 진단 전용이며, 저장소를 수정하지 않고 누락된 루트, 메타데이터 불일치 및 유효하지 않은 로컬 레지스트리 상태를 보고합니다.

### 프로젝트에서 저장소 참조하기

프로젝트 리포지토리는 `openspec/config.yaml`에 해당 작업이 의존하는 저장소를 선언할 수 있습니다:

```yaml
schema: spec-driven
references:
  - team-context
```

그 후, 해당 리포지토리에서 `openspec instructions` 출력(개별 아티팩트 및 `apply` 표면 모두, JSON 및 사용자 모드)에는 참조된 각 저장소의 사양 인덱스(사양 ID, 각 사양의 목적 섹션에서 가져온 한 줄 요약, 그리고 페치 명령어 (`openspec show <spec-id> --type spec --store <id>`))가 포함됩니다. 이 인덱스는 실행할 때마다 등록된 체크아웃으로부터 실시간으로 구축되며, 사양 내용은 출력에 절대 복사되지 않습니다.

참조는 읽기 전용 컨텍스트입니다. 명령어 작동 위치를 변경하지 않습니다: 작업은 리포지토리 자체 루트에 유지되며, 참조된 저장소에 쓰기는 여전히 명시적인 `--store` 작업을 필요로 합니다. 해결할 수 없는 참조(예: 이 머신에 등록되지 않은 저장소)는 정확한 수정 사항과 함께 인덱스에서 경고로 처리되며, 지침은 계속 생성됩니다. `openspec doctor`는 한 곳에서 참조 상태를 보고합니다.

### 저장소가 어디서 클론되었는지 기록하기

저장소는 커밋된 식별 파일에 정식 복제본 출처를 기록할 수 있으므로, 온보딩 과정이 "저장소를 등록하십시오" 단계에서 막히지 않습니다:

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

원격 복제본은 초기 커밋 내의 `.openspec-store/store.yaml`에 기록되므로, 모든 클론은 이를 알고 태어납니다. 기존 저장소의 경우 `store.yaml`을 수동으로 편집하고 커밋하십시오. `store doctor`는 기록된 원격(및 체크아웃이 관찰한 Git origin)을 표시합니다. `setup`/`register`는 가이드 이름으로 지정하며, `register`는 머신 로컬 레지스트리에 체크아웃의 출처를 기록합니다.

참조 선언도 클론 출처를 포함할 수 있습니다. 따라서 아직 저장소를 가지고 있지 않은 팀원은 완전하고 붙여넣을 수 있는 수정 사항(`git clone <remote> <path> && openspec store register <path> --id <id>`)을 받습니다:

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

원격 기록은 동기화가 아닙니다: OpenSpec은 자체적으로 클론하거나 풀(pull)하거나 푸시(push)하지 않습니다.

### 기본 저장소 선언하기

계획이 완전히 외부화된 리포지토리(로컬 `openspec/specs/` 또는 `openspec/changes/`가 없는 경우)는 모든 명령어에 `--store`를 전달하는 대신 한 번만 자신의 저장소를 선언할 수 있습니다:

```yaml
# openspec/config.yaml (openspec 아래의 유일한 파일)
store: team-context
```

이후 일반 명령어는 선언된 저장소로 자동 해결됩니다. 루트 배너와 JSON `root` 블록은 저장소 ID와 함께 `source: "declared"`를 보고하며, 인쇄된 힌트에는 여전히 `--store <id>`가 포함되어 있습니다. 이 선언은 대체가 아닌 폴백(fallback)입니다: 명시적인 `--store`가 항상 승리하며, 실제 계획 폴더가 있는 디렉토리는 포인터를 무시합니다(경고와 함께). 포인터 리포지토리를 로컬 OpenSpec 루트로 변환하려면 `store:` 줄을 제거하고 `openspec init`을 실행하십시오. 선언이 존재하는 동안 `init`은 스캐폴딩을 거부합니다.

## Doctor (상태 진단)

하나의 읽기 전용 질문으로, 한 곳에서 확인합니다: OpenSpec 루트가 정상인지, 그리고 해당 루트가 참조하는 스토어들이 이 시스템에 사용 가능한지 여부입니다.

```bash
openspec doctor [--store <id>] [--json]
```

이 보고서는 루트 상태, 스토어 메타데이터 상태(기록된 원격 저장소와 체크아웃의 출처가 다를 때의 주석 포함), 그리고 참조 상태를 분리합니다(동일한 진단 지침을 표시하며, 해결되지 않은 참조에 대한 클론 수정 사항이 포함됩니다). 어떤 심각도의 건강 문제도 0으로 종료되며 — 에이전트는 `status` 배열을 읽습니다. 오직 명령어 실패(루트 없음, 알 수 없는 스토어)만이 1로 종료됩니다. Doctor는 절대로 클론하거나 동기화하거나 복구하지 않습니다. 상태가 아닌 조립된 세트 자체를 얻으려면 `openspec context`를 사용하십시오.

## 작업 컨텍스트 (조립된 세트)

이 작업은 OpenSpec 선언을 통해 관련된 모든 것, 즉 하나의 작업 세트에 포함됩니다: OpenSpec 루트와 그것이 참조하는 스토어들입니다.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON 요약본은 에이전트가 소비할 수 있습니다(사용 가능한 각 참조 스토어는 자체 가져오기 레시피를 가지고 있으며, 해결되지 않은 멤버는 동일한 수정 지침과 doctor 결과를 가집니다). `--code-workspace`는 추가적으로 루트와 사용 가능한 참조 스토어들(`ref:<id>` 폴더)을 포함하는 VS Code 작업 공간 파일을 작성합니다. 이 명령어가 수행하는 유일한 쓰기 작업이며, 파일이 존재할 경우 `--force` 없이 거부됩니다. 사용 불가능한 멤버는 보고되며, 추측되지 않습니다.

"작업 컨텍스트"는 조립된 세트입니다. `openspec/config.yaml`의 `context:` 필드는 지침에 주입되는 프로젝트 배경이며 — 이는 두 가지 다른 것입니다. `openspec doctor`는 세트가 건강한지 답하고, `openspec context`는 그 세트가 무엇인지 답합니다.

## 개인 작업 세트

> **베타.** 작업 세트는 새로운 베타 표면의 일부입니다. 명령어, 플래그 및 파일 형식은 릴리스 간에 형태가 변경될 수 있습니다. 자세한 내용은 [stores 가이드](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together)를 참조하십시오.

작업 세트는 함께 작업하는 폴더의 개인적이고 이름이 지정된 뷰입니다. 이는 계획 루트와 사용자가 선택한 기타 요소를 포함하며, 로컬에 보관되어 도구에서 이름으로 다시 열립니다. 이는 순전히 로컬입니다. 절대 커밋되지 않으며, 공유되지 않고, 선언으로부터 파생되지 않으며, 하나를 제거해도 멤버 폴더에는 영향을 미치지 않습니다.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create`는 짧은 가이드 흐름을 실행하거나 (`--member` 플래그를 비대화형으로 사용), 첫 번째 멤버가 주(primary)가 되며 세션이 거기서 시작합니다. `open`은 선택된 도구를 실행합니다. 에디터(VS Code, Cursor)는 모든 멤버를 포함하는 창을 열고 반환하며, CLI 에이전트(Claude Code, codex)는 이 터미널을 모든 멤버가 연결된 세션으로 인계하고 사전 채우기 프롬프트 없이 종료될 때까지 유지합니다. `open` 시점에 누락된 멤버 폴더는 메모와 함께 건너뛰고 나머지는 열립니다. 저장된 도구 설정은 `--tool`을 사용하여 개별적으로 덮어쓸 수 있습니다.

새로운 도구를 지원하는 것은 코드가 아닌 구성입니다. 모든 도구는 두 가지 실행 스타일 중 하나인 `workspace-file`(생성된 `.code-workspace`로 실행) 또는 `attach-dirs`(멤버당 하나의 첨부 플래그)를 사용하며, 전역 `config.json`의 `openers` 키(openspec config edit으로 엽니다)는 필드별로 도구를 추가하거나 내장 기능을 조정합니다.

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

모든 작업 세트 상태는 전역 데이터 디렉토리의 `worksets/` 폴더에 저장됩니다(저장된 뷰 및 모든 `open` 시 재생성되는 `<name>.code-workspace` 파일). 이 폴더를 삭제하면 흔적을 완전히 지웁니다.

---

## 탐색 명령어

### `openspec list`

프로젝트의 변경 사항 또는 스펙을 나열합니다.

```
openspec list [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--specs` | 변경 사항 대신 스펙을 나열합니다 |
| `--changes` | 변경 사항을 나열합니다 (기본값) |
| `--sort <order>` | `recent`(기본값) 또는 `name`으로 정렬합니다 |
| `--json` | JSON으로 출력합니다 |

**예시:**

```bash
# 모든 활성 변경 사항을 나열합니다
openspec list

# 모든 스펙을 나열합니다
openspec list --specs

# 스크립트를 위한 JSON 출력입니다
openspec list --json
```

**출력 (텍스트):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

스펙과 변경 사항을 탐색하기 위한 인터랙티브 대시보드를 표시합니다.

```
openspec view
```

프로젝트의 사양 및 변경 사항을 탐색하기 위한 터미널 기반 인터페이스를 엽니다.

---

### `openspec show`

변경 사항 또는 스펙의 세부 정보를 표시합니다.

```
openspec show [item-name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `item-name` | 없음 | 변경 사항 또는 스펙의 이름 (생략 시 프롬프트 표시) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--type <type>` | 유형을 지정합니다: `change` 또는 `spec` (모호하지 않으면 자동 감지됨) |
| `--json` | JSON으로 출력합니다 |
| `--no-interactive` | 프롬프트를 비활성화합니다 |

**변경 사항 전용 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--deltas-only` | 델타 스펙만 표시합니다 (JSON 모드) |

**스펙 전용 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--requirements` | 요구 사항만 표시하고 시나리오는 제외합니다 (JSON 모드) |
| `--no-scenarios` | 시나리오 콘텐츠를 제외합니다 (JSON 모드) |
| `-r, --requirement <id>` | 1-기반 인덱스로 특정 요구 사항을 표시합니다 (JSON 모드) |

**예시:**

```bash
# 인터랙티브 선택입니다
openspec show

# 특정 변경 사항을 표시합니다
openspec show add-dark-mode

# 특정 스펙을 표시합니다
openspec show auth --type spec

# 구문 분석을 위한 JSON 출력입니다
openspec show add-dark-mode --json
```

---

## 유효성 검사 명령어

### `openspec validate`

변경 사항과 스펙의 구조적 문제를 확인합니다.

```
openspec validate [item-name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `item-name` | 없음 | 유효성 검사할 특정 항목 (생략 시 프롬프트 표시) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--all` | 모든 변경 사항 및 스펙을 유효성 검사합니다 |
| `--changes` | 모든 변경 사항을 유효성 검사합니다 |
| `--specs` | 모든 스펙을 유효성 검사합니다 |
| `--type <type>` | 이름이 모호할 때 유형을 지정합니다: `change` 또는 `spec` |
| `--strict` | 엄격한 유효성 검사 모드를 활성화합니다 |
| `--json` | JSON으로 출력합니다 |
| `--concurrency <n>` | 최대 병렬 유효성 검사 수 (기본값: 6, 또는 `OPENSPEC_CONCURRENCY` 환경 변수) |
| `--no-interactive` | 프롬프트를 비활성화합니다 |

**예시:**

```bash
# 인터랙티브 유효성 검사입니다
openspec validate

# 특정 변경 사항을 유효성 검사합니다
openspec validate add-dark-mode

# 모든 변경 사항을 유효성 검사합니다
openspec validate --changes

# CI/스크립트를 위한 JSON 출력으로 모든 것을 유효성 검사합니다
openspec validate --all --json

# 병렬 처리 증가 및 엄격한 유효성 검사입니다
openspec validate --all --strict --concurrency 12
```

**출력 (텍스트):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**출력 (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## 생명 주기 명령어

### `openspec archive`

완료된 변경 사항을 보관하고 델타 스펙을 메인 스펙에 병합합니다.

```
openspec archive [change-name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 없음 | 보관할 변경 사항 (생략 시 프롬프트 표시) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `-y, --yes` | 확인 프롬프트를 건너뜁니다 |
| `--skip-specs` | 스펙 업데이트를 건너뜁니다 (인프라/도구링/문서 전용 변경 사항의 경우) |
| `--no-validate` | 유효성 검사를 건너뜁니다 (확인이 필요합니다) |

**예시:**

```bash
# 인터랙티브 보관입니다
openspec archive

# 특정 변경 사항을 보관합니다
openspec archive add-dark-mode

# 프롬프트 없이 보관합니다 (CI/스크립트)
openspec archive add-dark-mode --yes

# 스펙에 영향을 미치지 않는 도구링 변경 사항을 보관합니다
openspec archive update-ci-config --skip-specs
```

**작동 방식:**

1. 변경 사항을 유효성 검사합니다 (단, `--no-validate`를 사용하지 않은 경우)
2. 확인 프롬프트를 표시합니다 (단, `--yes`를 사용하지 않은 경우)
3. 델타 스펙을 `openspec/specs/`에 병합합니다
4. 변경 폴더를 `openspec/changes/archive/YYYY-MM-DD-<name>/`로 이동시킵니다

---

## 워크플로우 명령어

이 명령어들은 아티팩트 기반의 OPSX 워크플로우를 지원합니다. 인간이 진행 상황을 확인하는 경우와 에이전트가 다음 단계를 결정하는 경우 모두 유용합니다.

### `openspec new change`

해결된 OpenSpec 루트에 변경 사항 디렉토리와 선택적 체크인 메타데이터를 생성합니다.

```bash
openspec new change <name> [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--description <text>` | `index.md`에 추가할 설명입니다 |
| `--goal <text>` | 변경 사항과 함께 저장할 선택적 목표 메타데이터입니다 |
| `--schema <name>` | 사용할 워크플로우 스키마입니다 |
| `--store <id>` | OpenSpec 루트로 사용할 스토어 ID입니다 (스토어는 등록한 독립적인 OpenSpec 리포지토리입니다) |
| `--json` | JSON을 출력합니다 |

**예시:**

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

변경 사항의 아티팩트 완료 상태를 표시합니다.

```
openspec status [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--change <id>` | 변경 이름 (생략 시 프롬프트 표시) |
| `--schema <name>` | 스키마 재정의 (변경 사항 구성에서 자동 감지됨) |
| `--json` | JSON으로 출력합니다 |

**예시:**

```bash
# 인터랙티브 상태 확인입니다
openspec status

# 특정 변경 사항에 대한 상태입니다
openspec status --change add-dark-mode

# 에이전트 사용을 위한 JSON입니다
openspec status --change add-dark-mode --json
```

**출력 (텍스트):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

**출력 (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

아티팩트를 생성하거나 작업을 적용하기 위한 풍부한 지침을 얻습니다. AI 에이전트가 다음에 무엇을 만들어야 하는지 이해하는 데 사용됩니다.

```
openspec instructions [artifact] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `artifact` | 없음 | 아티팩트 ID: `proposal`, `specs`, `design`, `tasks`, 또는 `apply` |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--change <id>` | 변경 이름 (비대화형 모드에서 필수) |
| `--schema <name>` | 스키마 재정의 |
| `--json` | JSON으로 출력합니다 |

**특수 사례:** `apply`를 아티팩트로 사용하여 작업 구현 지침을 얻습니다.

**예시:**

```bash
# 다음 아티팩트에 대한 지침을 얻습니다
openspec instructions --change add-dark-mode

# 특정 아티팩트 지침을 얻습니다
openspec instructions design --change add-dark-mode

# 적용/구현 지침을 얻습니다
openspec instructions apply --change add-dark-mode

# 에이전트 소비를 위한 JSON입니다
openspec instructions design --change add-dark-mode --json
```

**출력 내용:**

- 아티팩트를 위한 템플릿 콘텐츠
- 구성에서 가져온 프로젝트 컨텍스트
- 종속성 아티팩트의 콘텐츠
- 구성에서 가져온 아티팩트별 규칙

---

### `openspec templates`

스키마 내 모든 아티팩트에 대한 해결된 템플릿 경로를 표시합니다.

```
openspec templates [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--schema <name>` | 검사할 스키마 (기본값: `spec-driven`) |
| `--json` | JSON으로 출력합니다 |

**예시:**

```bash
# 기본 스키마에 대한 템플릿 경로를 표시합니다
openspec templates

# 사용자 정의 스키마에 대한 템플릿을 표시합니다
openspec templates --schema my-workflow

# 프로그래밍적 사용을 위한 JSON입니다
openspec templates --json
```

**출력 (텍스트):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

사용 가능한 워크플로우 스키마와 해당 설명 및 아티팩트 흐름을 나열합니다.

```
openspec schemas [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--json` | JSON으로 출력합니다 |

**예시:**

```bash
openspec schemas
```

**출력:**

```
Available schemas:

  spec-driven (package)
    기본 spec-driven 개발 워크플로우입니다.
    흐름: proposal → specs → design → tasks

  my-custom (project)
    이 프로젝트를 위한 사용자 정의 워크플로우입니다.
    흐름: research → proposal → tasks
```

## 스키마 명령어

사용자 정의 워크플로우 스키마를 생성하고 관리하는 명령어입니다.

### `openspec schema init`

새로운 프로젝트 로컬 스키마를 생성합니다.

```
openspec schema init <name> [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `name` | 예 | 스키마 이름 (kebab-case) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--description <text>` | 스키마 설명 |
| `--artifacts <list>` | 쉼표로 구분된 아티팩트 ID (기본값: `proposal,specs,design,tasks`) |
| `--default` | 프로젝트 기본 스키마로 설정 |
| `--no-default` | 기본값으로 설정하라는 프롬프트를 표시하지 않음 |
| `--force` | 기존 스키마를 덮어씁니다 |
| `--json` | JSON 형식으로 출력 |

**예시:**

```bash
# 대화형 스키마 생성
openspec schema init research-first

# 특정 아티팩트와 비대화형 실행
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**생성되는 내용:**

```
openspec/schemas/<name>/
├── schema.yaml           # 스키마 정의
└── templates/
    ├── proposal.md       # 각 아티팩트 템플릿
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

기존 스키마를 복사하여 사용자 지정할 수 있도록 프로젝트에 가져옵니다.

```
openspec schema fork <source> [name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `source` | 예 | 복사할 스키마 |
| `name` | 아니요 | 새 스키마 이름 (기본값: `<source>-custom`) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--force` | 기존 대상 파일을 덮어씁니다 |
| `--json` | JSON 형식으로 출력 |

**예시:**

```bash
# 내장된 spec-driven 스키마를 포크합니다
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

스키마의 구조와 템플릿을 검증합니다.

```
openspec schema validate [name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `name` | 아니요 | 검증할 스키마 (생략 시 모두 검증) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--verbose` | 자세한 검증 단계를 표시합니다 |
| `--json` | JSON 형식으로 출력합니다 |

**예시:**

```bash
# 특정 스키마를 검증합니다
openspec schema validate my-workflow

# 모든 스키마를 검증합니다
openspec schema validate
```

---

### `openspec schema which`

스키마가 어디에서 해석되는지 보여줍니다 (우선순위 디버깅에 유용).

```
openspec schema which [name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `name` | 아니요 | 스키마 이름 |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--all` | 모든 스키마와 해당 소스를 나열합니다 |
| `--json` | JSON 형식으로 출력합니다 |

**예시:**

```bash
# 특정 스키마의 출처를 확인합니다
openspec schema which spec-driven
```

**출력:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**스키마 우선순위:**

1. 프로젝트: `openspec/schemas/<name>/`
2. 사용자: `~/.local/share/openspec/schemas/<name>/`
3. 패키지: 내장 스키마

---

## 구성 명령어 (Configuration Commands)

### `openspec config`

전역 OpenSpec 구성을 보거나 수정합니다.

```
openspec config <subcommand> [options]
```

**하위 명령어:**

| 하위 명령어 | 설명 |
|------------|-------------|
| `path` | 설정 파일 위치를 표시합니다 |
| `list` | 모든 현재 설정을 표시합니다 |
| `get <key>` | 특정 값을 가져옵니다 |
| `set <key> <value>` | 값을 설정합니다 |
| `unset <key>` | 키를 제거합니다 |
| `reset` | 기본값으로 재설정합니다 |
| `edit` | `$EDITOR`에서 엽니다 |
| `profile [preset]` | 워크플로우 프로필을 대화형 또는 프리셋을 통해 구성합니다 |

**예시:**

```bash
# 설정 파일 경로를 표시합니다
openspec config path

# 모든 설정을 나열합니다
openspec config list

# 특정 값을 가져옵니다
openspec config get telemetry.enabled

# 값을 설정합니다
openspec config set telemetry.enabled false

# 문자열 값을 명시적으로 설정합니다
openspec config set user.name "My Name" --string

# 사용자 정의 설정을 제거합니다
openspec config unset user.name

# 모든 구성을 재설정합니다
openspec config reset --all --yes

# 편집기에서 설정을 편집합니다
openspec config edit

# 액션 기반 마법사로 프로필을 구성합니다
openspec config profile

# 빠른 프리셋: 워크플로우를 core로 전환합니다 (delivery 모드는 유지)
openspec config profile core
```

`openspec config profile`은 현재 상태 요약을 시작한 다음, 다음 중 하나를 선택할 수 있도록 합니다.
- delivery 및 워크플로우 변경
- delivery만 변경
- 워크플로우만 변경
- 현재 설정 유지 (종료)

현재 설정을 유지하면 변경 사항이 기록되지 않고 업데이트 프롬프트가 표시되지 않습니다. 구성 변경 사항이 없지만 현재 프로젝트 파일이 전역 프로필/delivery와 동기화되지 않은 경우, OpenSpec은 경고를 표시하고 `openspec update`를 제안합니다.
`Ctrl+C`를 누르면 흐름을 깨끗하게 취소(스택 추적 없음)하고 코드 `130`으로 종료됩니다.
워크플로우 체크리스트에서 `[x]`는 해당 워크플로우가 전역 구성에 선택되었음을 의미합니다. 이 선택 사항을 프로젝트 파일에 적용하려면 `openspec update`를 실행하거나 (프로젝트 내에서 프롬프트가 표시될 때) "이 프로젝트에 변경 사항 적용?"을 선택하십시오.

**대화형 예시:**

```bash
# delivery 전용 업데이트
openspec config profile
# 선택: delivery만 변경
# delivery 선택: Skills만

# 워크플로우 전용 업데이트
openspec config profile
# 선택: 워크플로우만 변경
# 체크리스트에서 워크플로우를 토글한 후 확인
```

---

## 유틸리티 명령어 (Utility Commands)

### `openspec feedback`

OpenSpec에 대한 피드백을 제출합니다. GitHub 이슈를 생성합니다.

```
openspec feedback <message> [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `message` | 예 | 피드백 메시지 |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--body <text>` | 자세한 설명 |

**요구 사항:** GitHub CLI (`gh`)가 설치 및 인증되어 있어야 합니다.

**예시:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

OpenSpec CLI의 셸 자동 완성을 관리합니다.

```
openspec completion <subcommand> [shell]
```

**하위 명령어:**

| 하위 명령어 | 설명 |
|------------|-------------|
| `generate [shell]` | 표준 출력으로 완성 스크립트를 출력합니다 |
| `install [shell]` | 셸에 자동 완성을 설치합니다 |
| `uninstall [shell]` | 설치된 자동 완성을 제거합니다 |

**지원되는 셸:** `bash`, `zsh`, `fish`, `powershell`

**예시:**

```bash
# 자동 감지하여 자동 완성을 설치합니다
openspec completion install

# 특정 셸에 설치합니다
openspec completion install zsh

# 수동 설치를 위한 스크립트를 생성합니다
openspec completion generate bash > ~/.bash_completion.d/openspec

# 제거합니다
openspec completion uninstall
```

---

## 종료 코드 (Exit Codes)

| 코드 | 의미 |
|------|---------|
| `0` | 성공 |
| `1` | 오류 (검증 실패, 파일 누락 등) |

---

## 환경 변수 (Environment Variables)

| 변수 | 설명 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | `0`으로 설정하면 텔레메트리를 비활성화합니다 |
| `DO_NOT_TRACK` | `1`로 설정하면 텔레메트리를 비활성화합니다 (표준 DNT 신호) |
| `OPENSPEC_CONCURRENCY` | 일괄 검증의 기본 동시성 수 (기본값: 6) |
| `EDITOR` 또는 `VISUAL` | `openspec config edit`에 사용되는 편집기 |
| `NO_COLOR` | 설정 시 색상 출력을 비활성화합니다 |

---

## 관련 문서

- [Commands](commands.md) - AI 슬래시 명령어 (`/opsx:propose`, `/opsx:apply` 등)
- [Workflows](workflows.md) - 일반적인 패턴 및 각 명령어를 사용해야 하는 경우
- [Customization](customization.md) - 사용자 정의 스키마 및 템플릿 생성
- [Getting Started](getting-started.md) - 첫 사용 가이드