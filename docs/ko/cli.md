# CLI 참조

OpenSpec CLI(`openspec`)는 프로젝트 설정, 유효성 검사, 상태 확인 및 관리를 위한 터미널 명령어를 제공합니다. 이 명령어들은 [Commands](commands.md)에 문서화된 AI 슬래시 명령어(예: `/opsx:propose`)를 보완합니다.

## 요약

| 카테고리 | 명령어 | 목적 |
|----------|--------|------|
| **설정** | `init`, `update` | 프로젝트에서 OpenSpec을 초기화하고 업데이트합니다 |
| **스토어(독립형 OpenSpec 리포지토리)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | 스토어를 관리합니다 — 등록한 독립형 OpenSpec 리포지토리 |
| **건강 상태** | `doctor` | 해결된 루트의 관계 상태를 보고합니다 |
| **작업 컨텍스트** | `context` | 작업 세트(루트 + 참조 스토어)를 구성합니다 |
| **개인 작업 세트** | `workset create`, `workset list`, `workset open`, `workset remove` | 도구에서 개인 로컬 작업 보기를 유지하고 엽니다 |
| **탐색** | `list`, `view`, `show` | 변경 사항과 스펙을 탐색합니다 |
| **유효성 검사** | `validate` | 변경 사항과 스펙의 문제점을 확인합니다 |
| **수명 주기** | `archive` | 완료된 변경 사항을 마무리합니다 |
| **워크플로우** | `new change`, `status`, `instructions`, `templates`, `schemas` | 아티팩트 기반 워크플로우를 지원합니다 |
| **스키마** | `schema init`, `schema fork`, `schema validate`, `schema which` | 커스텀 워크플로우를 생성하고 관리합니다 |
| **설정** | `config` | 설정을 확인하고 수정합니다 |
| **유틸리티** | `feedback`, `completion` | 피드백 제공 및 셸 통합을 지원합니다 |

## 사용자 명령과 에이전트 명령

대부분의 CLI 명령은 터미널에서 **사용자 사용**을 위해 설계되었습니다. 일부 명령은 JSON 출력을 통해 **에이전트/스크립트 사용**도 지원합니다.

### 사용자 전용 명령

이 명령들은 대화형으로 터미널 사용을 위해 설계되었습니다:

| 명령어 | 목적 |
|---------|---------|
| `openspec init` | 프로젝트 초기화 (대화형 프롬프트) |
| `openspec view` | 대화형 대시보드 |
| `openspec workset open <name>` | 저장된 워크셋 열기 (편집기 창 또는 터미널 에이전트 세션) |
| `openspec config edit` | 설정 파일을 편집기에서 열기 |
| `openspec feedback` | GitHub를 통해 피드백 제출 |
| `openspec completion install` | 셸 자동완성 설치 |

### 에이전트 호환 명령

이 명령들은 AI 에이전트와 스크립트의 프로그래밍 사용을 위해 `--json` 출력을 지원합니다:

| 명령어 | 사용자 사용 | 에이전트 사용 |
|---------|-----------|-----------|
| `openspec list` | 변경 사항/스펙 탐색 | 구조화된 데이터용 `--json` |
| `openspec show <item>` | 콘텐츠 읽기 | 파싱용 `--json` |
| `openspec validate` | 문제점 확인 | 대량 검증용 `--all --json` |
| `openspec status` | 아티팩트 진행 상황 확인 | 구조화된 상태 정보용 `--json` |
| `openspec instructions` | 다음 단계 확인 | 에이전트 지시사항용 `--json` |
| `openspec templates` | 템플릿 경로 찾기 | 경로 확인용 `--json` |
| `openspec schemas` | 사용 가능한 스키마 목록 | 스키마 검색용 `--json` |
| `openspec store setup <id>` | 로컬 스토어 생성 및 등록 | 명시적 입력과 함께 구조화된 설정 출력용 `--json` |
| `openspec store register <path>` | 기존 스토어 등록 | 구조화된 등록 출력용 `--json` |
| `openspec store unregister <id>` | 로컬 스토어 등록 해제 | 구조화된 정리 출력용 `--json` |
| `openspec store remove <id>` | 등록된 로컬 스토어 폴더 삭제 | 비대화형 삭제용 `--yes --json` |
| `openspec store list` | 등록된 스토어 탐색 | 구조화된 등록 정보용 `--json` |
| `openspec store doctor` | 로컬 스토어 설정 확인 | 구조화된 진단 정보용 `--json` |
| `openspec new change <id>` | 리포지토리 로컬 변경 스캐폴딩 생성 | `--json`와 함께 등록된 스토어를 OpenSpec 루트로 사용하려면 `--store <id>` 추가 |
| `openspec workset create [name]` | 개인 작업 뷰 구성 | 비대화형 구성용 `--member <path> --json` |
| `openspec workset list` | 저장된 워크셋 탐색 | 구조화된 뷰용 `--json` |
| `openspec workset remove <name>` | 저장된 뷰 삭제 | 비대화형 삭제용 `--yes --json` |

---

## 전역 옵션

이 옵션은 모든 명령에서 사용할 수 있습니다:

| 옵션 | 설명 |
|------|------|
| `--version`, `-V` | 버전 번호 표시 |
| `--no-color` | 색상 출력 비활성화 |
| `--help`, `-h` | 명령 도움말 표시 |

---

## 설정 명령

### `openspec init`

프로젝트에 OpenSpec을 초기화합니다. 폴더 구조를 생성하고 AI 도구 통합을 구성합니다.

기본 동작은 전역 구성 기본값을 사용합니다: 프로필 `core`, 전달 방식 `both`, 워크플로우 `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**인자:**

| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `path` | 아니오 | 대상 디렉터리 (기본값: 현재 디렉터리) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--tools <list>` | AI 도구를 비대화형으로 구성합니다. `all`, `none`, 또는 쉼표로 구분된 목록을 사용하세요. |
| `--force` | 프롬프트 없이 레거시 파일을 자동 정리합니다. |
| `--profile <profile>` | 이 init 실행에 대한 전역 프로필을 재정의합니다 (`core` 또는 `custom`). |

`--profile custom`은 전역 구성에서 현재 선택된 워크플로우를 사용합니다 (`openspec config profile`).

**지원되는 도구 ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> 이 목록은 `src/core/config.ts`의 `AI_TOOLS`와 일치합니다. 각 도구의 스킬과 명령 경로는 [지원 도구](supported-tools.md)를 참조하세요.

**예시:**

```bash
# 대화형 초기화
openspec init

# 특정 디렉터리에 초기화
openspec init ./my-project

# 비대화형: Claude와 Cursor용 구성
openspec init --tools claude,cursor

# 모든 지원 도구용 구성
openspec init --tools all

# 이 실행에 대한 프로필 재정의
openspec init --profile core

# 프롬프트를 건너뛰고 레거시 파일 자동 정리
openspec init --force
```

**생성되는 파일:**

```
openspec/
├── specs/              # 스펙 (진실의 원천)
├── changes/            # 제안된 변경 사항
└── config.yaml         # 프로젝트 구성

.claude/skills/         # Claude Code 스킬 (claude가 선택된 경우)
.cursor/skills/         # Cursor 스킬 (cursor가 선택된 경우)
.cursor/commands/       # Cursor OPSX 명령 (전달 방식에 commands가 포함된 경우)
... (기타 도구 구성)
```

---

### `openspec update`

CLI를 업그레이드한 후 OpenSpec 지시 파일을 업데이트합니다. 현재 전역 프로필, 선택된 워크플로우, 전달 모드를 사용하여 AI 도구 구성 파일을 다시 생성합니다.

```
openspec update [path] [options]
```

**인자:**

| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `path` | 아니오 | 대상 디렉터리 (기본값: 현재 디렉터리) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--force` | 파일이 최신 상태이더라도 강제로 업데이트합니다. |

**예시:**

```bash
# npm 업그레이드 후 지시 파일 업데이트
npm update @fission-ai/openspec
openspec update
```

---

## 스토어 (독립형 OpenSpec 리포지토리)

> **베타.** 스토어와 이를 기반으로 구축된 기능(참조, 작업 컨텍스트, 워크셋)은 새로운 기능입니다. 출시 간에 명령 이름, 플래그, 파일 형식, JSON 출력이 변경될 수 있습니다. 문제 우선 안내서는 [스토어 가이드](stores-beta/user-guide.md)를 참조하세요.

스토어는 이 기기에 등록한 독립형 OpenSpec 리포지토리입니다. 예를 들어 계획 리포지토리나 계약 리포지토리가 해당됩니다. 스토어를 등록하면 일반 명령(`list`, `show`, `status`, `validate`, `new change`, `archive` 등)에 `--store <id>`를 전달하여 어디서든 해당 스토어에서 작동하도록 할 수 있습니다.

### `openspec store setup`

로컬 스토어를 생성하고 등록합니다. 터미널에서 인자 없이 실행하면 OpenSpec이 사용자를 설정 과정으로 안내합니다. 에이전트와 스크립트는 명시적 입력을 전달하고 `--json`을 사용해야 합니다.

```bash
openspec store setup [id] [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--path <path>` | 스토어가 위치할 폴더 (예: `~/openspec/<id>`) |
| `--remote <url>` | 새 스토어의 `store.yaml`에 표준 원격 저장소를 기록합니다. |
| `--init-git` | 초기 커밋으로 Git 리포지토리를 초기화합니다 (기본값). |
| `--no-init-git` | 모든 Git 작업을 건너뜁니다: 초기화하지 않고 초기 커밋도 생성하지 않습니다. |
| `--json` | JSON 출력 |

비대화형 실행(`--json`, 스크립트, 에이전트)은 스토어 ID와 `--path`를 모두 전달해야 합니다. 대화형 터미널에서 설정은 사용자가 소유한 보이는 위치(예: `~/openspec/<id>`)에 편집 가능한 제안과 함께 위치를 묻는 프롬프트를 표시합니다. OpenSpec의 관리 데이터 디렉터리를 기본값으로 사용하지 않습니다.

예시:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

기존 로컬 스토어 폴더를 등록합니다. 스토어 베타 기간 동안 변경 사항이 존재하기 전, 스펙이 적용되기 전, 변경 사항이 보관되기 전에 루트를 등록할 수 있습니다. 이 경우 일반 명령이 생성할 때까지 `openspec/changes/`, `openspec/specs/`, `openspec/changes/archive/`가 없을 수 있습니다. `store: <id>`를 선언한 구성 전용 리포지토리는 다른 스토어를 가리키는 포인터로 남으며, 해당 포인터가 제거되지 않는 한 스토어 루트로 등록되지 않습니다.

```bash
openspec store register [path] [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--id <id>` | 스토어 ID; 스토어 메타데이터 또는 폴더 이름을 기본값으로 사용합니다. |
| `--yes` | 정상적인 OpenSpec 루트에 대한 스토어 ID 메타데이터 생성을 확인합니다. |
| `--json` | JSON 출력 |

### `openspec store unregister`

파일을 삭제하지 않고 로컬 스토어 등록을 해제합니다.

```bash
openspec store unregister <id> [--json]
```

스토어가 이동했거나 다른 곳에 클론되었거나, 이 기기에서 OpenSpec이 더 이상 표시하지 않아야 할 때 사용하세요.

### `openspec store remove`

로컬 스토어 등록을 해제하고 해당 로컬 폴더를 삭제합니다.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove`는 대화형 터미널에서 삭제하기 전 정확한 폴더를 표시합니다. 에이전트, 스크립트, JSON 호출자는 삭제를 확인하려면 `--yes`를 전달해야 합니다. OpenSpec은 일치하는 스토어 메타데이터를 포함하지 않는 폴더 삭제를 거부합니다.

### `openspec store list`

로컬에 등록된 스토어를 나열합니다.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

로컬 스토어 등록, 메타데이터, Git 존재 여부를 확인합니다.

```bash
openspec store doctor [id] [--json]
```

doctor는 진단 전용입니다. 스토어를 수정하지 않고 누락된 루트, 메타데이터 불일치, 유효하지 않은 로컬 레지스트리 상태를 보고합니다.

### 프로젝트에서 스토어 참조하기

프로젝트 리포지토리는 `openspec/config.yaml`에서 작업에 사용할 스토어를 선언할 수 있습니다:

```yaml
schema: spec-driven
references:
  - team-context
```

그 이후부터 해당 리포지토리의 `openspec instructions` 출력(아티팩트별 및 `apply` 표면 모두, JSON 및 사용자 모드)에는 참조된 각 스토어의 스펙 색인이 포함됩니다. 스펙 ID, 각 스펙의 목적 섹션의 한 줄 요약, 가져오기 명령(`openspec show <spec-id> --type spec --store <id>`)입니다. 색인은 매 실행 시 등록된 체크아웃에서 실시간으로 빌드되며, 스펙 콘텐츠는 출력에 복사되지 않습니다.

참조는 읽기 전용 컨텍스트입니다. 명령이 작동하는 위치를 변경하지 않습니다: 작업은 리포지토리 자체 루트에 유지되며, 참조된 스토어에 쓰는 것은 명시적인 `--store` 작업으로 남습니다. 확인할 수 없는 참조(예: 이 기기에 등록되지 않은 스토어)는 정확한 수정 방법과 함께 색인에서 경고로 표시되며, 지시사항은 여전히 생성됩니다. `openspec doctor`는 한 곳에서 참조 상태를 보고합니다.

### 스토어 클론 출처 기록하기

스토어는 커밋된 ID 파일에 표준 클론 출처를 기록할 수 있으므로, 온보딩 과정에서 '스토어 등록'에서 막히는 일이 없습니다:

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

원격 저장소 정보는 초기 커밋 내의 `.openspec-store/store.yaml`에 기록되므로, 모든 클론이 출처를 알 상태로 생성됩니다. 기존 스토어의 경우 `store.yaml`을 직접 편집하고 커밋하세요. `store doctor`는 기록된 원격 저장소(및 체크아웃의 관찰된 Git 원본)를 표시하고, 설정/등록 공유 가이드에서 이를 명명하며, 등록은 기기 로컬 레지스트리에 체크아웃의 원본을 기록합니다.

참조 선언에도 클론 출처를 포함할 수 있으므로, 아직 스토어가 없는 팀원은 완전한 복사 가능한 수정 방법(`git clone <remote> <path> && openspec store register <path> --id <id>`)을 받을 수 있습니다:

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

원격 저장소를 기록하는 것은 동기화가 아닙니다: OpenSpec은 자체적으로 클론, 풀, 푸시를 수행하지 않습니다.

### 기본 스토어 선언하기

계획이 완전히 외부화된 리포지토리(로컬 `openspec/specs/` 또는 `openspec/changes/`가 없음)는 모든 명령에 `--store`를 전달하는 대신 스토어를 한 번만 선언할 수 있습니다:

```yaml
# openspec/config.yaml (openspec/ 아래 유일한 파일)
store: team-context
```

그러면 일반 명령이 자동으로 선언된 스토어로 확인됩니다. 루트 배너와 JSON `root` 블록은 스토어 ID와 함께 `source: "declared"`를 보고하고, 인쇄된 힌트에는 여전히 `--store <id>`가 포함됩니다. 이 선언은 폴백일 뿐 절대 재정의하지 않습니다: 명시적인 `--store`가 항상 우선하며, 실제 계획 폴더가 있는 디렉터리는 포인터를 무시합니다(경고와 함께). 포인터 리포지토리를 로컬 OpenSpec 루트로 변환하려면 `store:` 줄을 제거하고 `openspec init`을 실행하세요. init은 선언이 존재하는 동안 스캐폴딩을 거부합니다.

기기 수준 변형은 모든 리포지토리를 한 번에 적용합니다: `openspec config set defaultStore <id>` (구성 참조). 이는 `--store`, 로컬 루트, 프로젝트 포인터가 모두 확인에 실패한 후에만 사용됩니다. 그 다음 루트 배너와 JSON `root` 블록은 `source: "global_default"`를 보고합니다.

## Doctor (관계 상태 진단)

하나의 읽기 전용 질문, 하나의 장소: OpenSpec 루트가 정상 상태인지, 이 머신에서 참조하는 스토어를 사용할 수 있는지 확인합니다.

```bash
openspec doctor [--store <id>] [--json]
```

보고서는 루트 상태, 스토어 메타데이터 상태(기록된 원격 저장소와 체크아웃의 원본이 불일치할 때의 안내, 스토어 체크아웃이 최근 가져온 상류 추적 참조보다 상태가 뒤처졌을 때의 안내를 포함), 참조 상태(미해결 참조에 대한 클론 수정 방법이 포함된 동일한 진단 지침 표시)로 구분합니다. 심각도에 관계없이 상태 진단 결과가 나오면 종료 코드 0을 반환합니다 — 에이전트는 `status` 배열을 읽기 때문이며, 명령 실행 실패(루트가 없음, 알 수 없는 스토어)의 경우에만 종료 코드 1을 반환합니다. Doctor 명령은 클론, 동기화, 복구 작업을 절대 수행하지 않습니다. 상태 자체가 아닌 조립된 세트 자체를 가져오려면 `openspec context`를 사용하세요.

## 작업 컨텍스트 (조립된 세트)

OpenSpec 선언을 통해 이 작업과 관련된 모든 것을 하나의 작업 세트로 모은 것입니다: OpenSpec 루트와 참조하는 스토어들입니다.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON 간략 정보는 에이전트가 사용할 수 있도록 제공됩니다(사용 가능한 각 참조 스토어에는 가져오기 레시피가 포함되고, 미해결 구성원에는 동일한 수정 지침과 Doctor 표시 내용이 포함됩니다). `--code-workspace` 옵션은 루트와 사용 가능한 참조 스토어(`ref:<id>` 폴더)를 포함하는 VS Code 워크스페이스 파일을 추가로 작성합니다 — 이 명령이 수행하는 유일한 쓰기 작업으로, 파일이 이미 존재하는 경우 `--force` 옵션 없이는 거부됩니다. 사용할 수 없는 구성원은 보고되며, 추측하여 포함하지 않습니다.

"작업 컨텍스트"는 조립된 세트를 의미하고, `openspec/config.yaml`의 `context:` 필드는 지침에 삽입되는 프로젝트 배경 정보입니다 — 이는 서로 다른 두 가지 개념입니다. `openspec doctor`는 세트가 정상 상태인지 여부를 확인하고, `openspec context`는 세트가 무엇인지 확인합니다.

## 개인 워크셋

> **베타.** 워크셋은 새로운 베타 기능의 일부로, 릴리스 간에 명령어, 플래그, 파일 형식이 변경될 수 있습니다. 사용 방법에 대한 자세한 내용은 [스토어 가이드](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together)를 참고하세요.

워크셋은 함께 작업하는 폴더들에 대한 개인적인 이름 지정된 보기입니다. 계획 루트와 사용자가 선택한 기타 폴더를 포함하며, 사용자의 기기에 저장되어 도구에서 이름으로 다시 열 수 있습니다. 완전히 로컬로만 작동하므로 커밋되지 않고, 공유되지 않으며, 선언으로부터 생성되지 않고, 삭제해도 구성 폴더에 영향을 미치지 않습니다.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create`는 짧은 안내 흐름을 실행하거나(또는 `--member` 플래그를 사용해 비대화형으로 실행할 수 있으며, 첫 번째 구성원이 기본입니다. 세션은 해당 위치에서 시작됩니다.) `open`은 선택한 도구를 실행합니다. 편집기(VS Code, Cursor)는 모든 구성원이 포함된 창을 열고 반환하고, CLI 에이전트(Claude Code, codex)는 모든 구성원이 연결된 세션으로 이 터미널을 인수하며 사전에 입력된 프롬프트 없이 실행되며, 사용자가 종료할 때 끝납니다. 열 때 구성원 폴더가 누락된 경우 메모와 함께 건너뛰고 나머지는 엽니다. 저장된 도구 기본 설정은 `--tool`을 사용해 열 때마다 재정의할 수 있습니다.

새 도구를 지원하는 것은 코드가 아닌 설정으로 할 수 있습니다. 모든 도구는 두 가지 실행 스타일 중 하나입니다. `workspace-file`(생성된 `.code-workspace` 파일로 실행) 또는 `attach-dirs`(구성원당 하나의 연결 플래그)이며, 전역 `config.json`의 `openers` 키(`openspec config edit`로 열 수 있음)를 통해 도구를 추가하거나 내장 도구를 필드별로 조정할 수 있습니다:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

모든 워크셋 상태는 전역 데이터 디렉터리의 `worksets/` 폴더에 저장됩니다(저장된 보기와 생성된 `<name>.code-workspace` 파일이 포함되며, 열 때마다 다시 생성됨). 해당 폴더를 삭제하면 모든 흔적이 제거됩니다.

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
| `--specs` | 스펙 대신 변경 사항을 나열합니다 |
| `--changes` | 변경 사항을 나열합니다(기본값) |
| `--sort <order>` | `recent`(기본값) 또는 `name`으로 정렬합니다 |
| `--json` | JSON 형식으로 출력합니다 |

**예시:**

```bash
# 모든 활성 변경 사항 나열
openspec list

# 모든 스펙 나열
openspec list --specs

# 스크립트용 JSON 출력
openspec list --json
```

**출력(텍스트):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

스펙과 변경 사항을 탐색하기 위한 대화형 대시보드를 표시합니다.

```
openspec view
```

프로젝트의 스펙과 변경 사항을 탐색할 수 있는 터미널 기반 인터페이스를 엽니다.

---

### `openspec show`

변경 사항 또는 스펙의 상세 정보를 표시합니다.

```
openspec show [item-name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `item-name` | 아니요 | 변경 사항 또는 스펙의 이름(생략 시 프롬프트가 표시됨) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--type <type>` | 유형 지정: `change` 또는 `spec`(모호하지 않은 경우 자동 감지됨) |
| `--json` | JSON 형식으로 출력합니다 |
| `--no-interactive` | 프롬프트를 비활성화합니다 |

**변경 사항 관련 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--deltas-only` | 델타 스펙만 표시합니다(JSON 모드) |

**스펙 관련 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--requirements` | 요구사항만 표시하고 시나리오는 제외합니다(JSON 모드) |
| `--no-scenarios` | 시나리오 내용을 제외합니다(JSON 모드) |
| `-r, --requirement <id>` | 1부터 시작하는 인덱스로 특정 요구사항을 표시합니다(JSON 모드) |

**예시:**

```bash
# 대화형 선택
openspec show

# 특정 변경 사항 표시
openspec show add-dark-mode

# 특정 스펙 표시
openspec show auth --type spec

# 구문 분석용 JSON 출력
openspec show add-dark-mode --json
```

---

## 유효성 검사 명령어

### `openspec validate`

변경 사항과 스펙의 구조적 문제를 유효성 검사합니다.

```
openspec validate [item-name] [options]
```

스펙 델타가 없는 변경 사항은 `.openspec.yaml`에 `skip_specs: true`가 선언되지 않은 경우 유효성 검사에 실패합니다(순수 리팩터링, 툴링, 문서 작업의 경우 — [레시피 5](examples.md#recipe-5-a-refactor-with-no-behavior-change) 참고).

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `item-name` | 아니요 | 유효성 검사할 특정 항목(생략 시 프롬프트가 표시됨) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--all` | 모든 변경 사항과 스펙을 유효성 검사합니다 |
| `--changes` | 모든 변경 사항을 유효성 검사합니다 |
| `--specs` | 모든 스펙을 유효성 검사합니다 |
| `--type <type>` | 이름이 모호한 경우 유형 지정: `change` 또는 `spec` |
| `--strict` | 엄격한 유효성 검사 모드를 활성화합니다 |
| `--json` | JSON 형식으로 출력합니다 |
| `--concurrency <n>` | 최대 병렬 유효성 검사 수(기본값: 6, 또는 `OPENSPEC_CONCURRENCY` 환경 변수) |
| `--no-interactive` | 프롬프트를 비활성화합니다 |

**예시:**

```bash
# 대화형 유효성 검사
openspec validate

# 특정 변경 사항 유효성 검사
openspec validate add-dark-mode

# 모든 변경 사항 유효성 검사
openspec validate --changes

# JSON 출력으로 모든 항목 유효성 검사(CI/스크립트용)
openspec validate --all --json

# 엄격한 유효성 검사와 병렬 처리 수 증가
openspec validate --all --strict --concurrency 12
```

**출력(텍스트):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**출력(JSON):**

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

## 수명 주기 명령어

### `openspec archive`

완료된 변경 사항을 아카이브하고 델타 스펙을 메인 스펙에 병합합니다.

```
openspec archive [change-name] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 아카이브할 변경 사항(생략 시 프롬프트가 표시됨) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `-y, --yes` | 확인 프롬프트를 건너뜁니다 |
| `--skip-specs` | 한 번의 아카이브 실행에서 스펙 업데이트를 건너뜁니다. 영구적으로 스펙 델타가 없는 변경 사항은 `.openspec.yaml`에 `skip_specs: true`를 선언해야 합니다(플래그 없이 아카이브됨) |
| `--no-validate` | 유효성 검사를 건너뜁니다(확인이 필요함) |

**예시:**

```bash
# 대화형 아카이브
openspec archive

# 특정 변경 사항 아카이브
openspec archive add-dark-mode

# 프롬프트 없이 아카이브(CI/스크립트용)
openspec archive add-dark-mode --yes

# 스펙에 영향을 미치지 않는 툴링 변경 사항 아카이브
openspec archive update-ci-config --skip-specs
```

**수행 작업:**

1. 변경 사항을 유효성 검사합니다(`--no-validate`가 아닌 경우)
2. 확인 프롬프트를 표시합니다(`--yes`가 아닌 경우)
3. 델타 스펙을 `openspec/specs/`에 병합합니다
4. 변경 사항 폴더를 `openspec/changes/archive/YYYY-MM-DD-<name>/`로 이동합니다

---

## 워크플로우 명령어

이 명령어들은 아티팩트 기반 OPSX 워크플로우를 지원합니다. 진행 상황을 확인하는 사람과 다음 단계를 결정하는 에이전트 모두에게 유용합니다.

### `openspec new change`

변경 사항 디렉터리를 생성하고 확인된 OpenSpec 루트에 선택적으로 체크인된 메타데이터를 추가합니다.

```bash
openspec new change <name> [options]
```

변경 사항 이름은 소문자 케밥 케이스를 사용해야 합니다. 소문자로 시작한 뒤 소문자, 숫자, 단일 하이픈만 포함할 수 있습니다. 숫자로 시작할 수 없으며, 공백, 밑줄, 대문자, 연속된 하이픈, 앞뒤 하이픈을 포함할 수 없습니다. 외부 티켓 ID를 포함하는 경우 접두사에 단어를 붙이세요. 예를 들어 `123-add-notifications` 대신 `ticket-123-add-notifications`를 사용하세요.

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--description <text>` | `index.md`에 추가할 설명 |
| `--goal <text>` | 변경 사항과 함께 저장할 선택적 목표 메타데이터 |
| `--schema <name>` | 사용할 워크플로우 스키마 |
| `--store <id>` | OpenSpec 루트로 사용할 스토어 ID(스토어는 등록한 독립형 OpenSpec 리포지토리입니다) |
| `--json` | JSON 형식으로 출력합니다 |

예시:

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
| `--change <id>` | 변경 사항 이름(생략 시 프롬프트가 표시됨) |
| `--schema <name>` | 스키마 재정의(변경 사항의 설정에서 자동 감지됨) |
| `--json` | JSON 형식으로 출력합니다 |

**예시:**

```bash
# 대화형 상태 확인
openspec status

# 특정 변경 사항의 상태
openspec status --change add-dark-mode

# 에이전트용 JSON 출력
openspec status --change add-dark-mode --json
```

**출력(텍스트):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

`skip_specs: true`를 선언한 변경 사항은 스펙 단계를 `[~] specs (skipped: change declares skip_specs)`로 표시하고 진행률 계산에서 제외합니다.

**출력(JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

아티팩트 생성 또는 작업 적용에 대한 향상된 지침을 가져옵니다. AI 에이전트가 다음에 생성할 항목을 이해하는 데 사용됩니다.

```
openspec instructions [artifact] [options]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `artifact` | 아니요 | 아티팩트 ID: `proposal`, `specs`, `design`, `tasks`, `apply` 중 하나 |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--change <id>` | 변경 사항 이름(비대화형 모드에서 필수) |
| `--schema <name>` | 스키마 재정의 |
| `--json` | JSON 형식으로 출력합니다 |

**특수 케이스:** 작업 적용 지침을 가져오려면 아티팩트로 `apply`를 사용하세요.

**예시:**

```bash
# 다음 아티팩트에 대한 지침 가져오기
openspec instructions --change add-dark-mode

# 특정 아티팩트 지침 가져오기
openspec instructions design --change add-dark-mode

# 적용/구현 지침 가져오기
openspec instructions apply --change add-dark-mode

# 에이전트 사용용 JSON 출력
openspec instructions design --change add-dark-mode --json
```

**출력에 포함되는 내용:**

- 아티팩트의 템플릿 내용
- 설정의 프로젝트 컨텍스트
- 종속 아티팩트의 내용
- 설정의 아티팩트별 규칙

`skip_specs: true`로 건너뛴 아티팩트의 경우 경고만 출력됩니다(JSON은 `skipped`/`warning` 필드를 추가함). 해당 아티팩트를 생성해서는 안 됩니다.

---

### `openspec templates`

스키마의 모든 아티팩트에 대한 확인된 템플릿 경로를 표시합니다.

```
openspec templates [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--schema <name>` | 검사할 스키마(기본값: `spec-driven`) |
| `--json` | JSON 형식으로 출력합니다 |

**예시:**

```bash
# 기본 스키마의 템플릿 경로 표시
openspec templates

# 사용자 정의 스키마의 템플릿 표시
openspec templates --schema my-workflow

# 프로그래밍용 JSON 출력
openspec templates --json
```

**출력(텍스트):**

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

사용 가능한 워크플로우 스키마와 해당 설명, 아티팩트 흐름을 나열합니다.

```
openspec schemas [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--json` | JSON 형식으로 출력합니다 |

**예시:**

```bash
openspec schemas
```

**출력:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

## 스키마 명령어

커스텀 워크플로 스키마를 생성하고 관리하는 명령어입니다.

### `openspec schema init`

프로젝트 로컬 스키마를 새로 생성합니다.

```
openspec schema init <name> [options]
```

**인자:**

| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `name` | 예 | 스키마 이름 (케밥 케이스) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--description <text>` | 스키마 설명 |
| `--artifacts <list>` | 쉼표로 구분된 아티팩트 ID (기본값: `proposal,specs,design,tasks`) |
| `--default` | 프로젝트 기본 스키마로 설정 |
| `--no-default` | 기본값으로 설정 프롬프트 표시 안 함 |
| `--force` | 기존 스키마 덮어쓰기 |
| `--json` | JSON 형식으로 출력 |

**예시:**

```bash
# 대화형 스키마 생성
openspec schema init research-first

# 특정 아티팩트를 지정한 비대화형 생성
openspec schema init rapid \
  --description "빠른 반복 워크플로" \
  --artifacts "proposal,tasks" \
  --default
```

**생성되는 파일 구조:**

```
openspec/schemas/<name>/
├── schema.yaml           # 스키마 정의
└── templates/
    ├── proposal.md       # 각 아티팩트용 템플릿
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

기존 스키마를 프로젝트에 복사해 커스터마이징할 수 있게 합니다.

```
openspec schema fork <source> [name] [options]
```

**인자:**

| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `source` | 예 | 복사할 스키마 |
| `name` | 아니오 | 새 스키마 이름 (기본값: `<source>-custom`) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--force` | 기존 대상 덮어쓰기 |
| `--json` | JSON 형식으로 출력 |

**예시:**

```bash
# 내장 spec-driven 스키마 포크하기
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

스키마의 구조와 템플릿을 검증합니다.

```
openspec schema validate [name] [options]
```

**인자:**

| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `name` | 아니오 | 검증할 스키마 (생략 시 전체 검증) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--verbose` | 상세 검증 단계 표시 |
| `--json` | JSON 형식으로 출력 |

**예시:**

```bash
# 특정 스키마 검증
openspec schema validate my-workflow

# 모든 스키마 검증
openspec schema validate
```

---

### `openspec schema which`

스키마가 어디서 로드되는지 표시합니다 (우선순위 디버깅에 유용합니다).

```
openspec schema which [name] [options]
```

**인자:**

| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `name` | 아니오 | 스키마 이름 |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--all` | 모든 스키마와 출처 목록 표시 |
| `--json` | JSON 형식으로 출력 |

**예시:**

```bash
# 스키마 출처 확인
openspec schema which spec-driven
```

**출력:**

```
spec-driven 스키마 로드 출처: 패키지
  출처: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**스키마 우선순위:**

1. 프로젝트: `openspec/schemas/<name>/`
2. 사용자: `~/.local/share/openspec/schemas/<name>/`
3. 패키지: 내장 스키마

---

## 설정 명령어

### `openspec config`

전역 OpenSpec 설정을 확인하고 수정합니다.

```
openspec config <subcommand> [options]
```

**서브커맨드:**

| 서브커맨드 | 설명 |
|------------|-------------|
| `path` | 설정 파일 경로 표시 |
| `list` | 모든 현재 설정 표시 |
| `get <key>` | 특정 값 조회 |
| `set <key> <value>` | 값 설정 |
| `unset <key>` | 키 삭제 |
| `reset` | 기본값으로 재설정 |
| `edit` | `$EDITOR`로 열기 |
| `profile [preset]` | 워크플로 프로필을 대화형 또는 프리셋으로 구성 |

**예시:**

```bash
# 설정 파일 경로 표시
openspec config path

# 모든 설정 목록 표시
openspec config list

# 특정 값 조회
openspec config get telemetry.enabled

# 값 설정
openspec config set telemetry.enabled false

# 문자열 값 명시적으로 설정
openspec config set user.name "My Name" --string

# 커스텀 설정 삭제
openspec config unset user.name

# 머신 레벨 기본 저장소 설정 (--store, 로컬 루트, 프로젝트 저장소가 없을 때 대체 루트로 사용되는 포인터)
openspec config set defaultStore team-plans

# 모든 설정 기본값으로 재설정
openspec config reset --all --yes

# 편집기로 설정 열기
openspec config edit

# 액션 기반 마법사로 프로필 구성
openspec config profile

# 빠른 프리셋: 워크플로를 코어로 전환 (배송 모드는 유지)
openspec config profile core
```

`openspec config profile`는 현재 상태 요약을 표시한 후 다음 중 선택할 수 있습니다:
- 배송 + 워크플로 변경
- 배송만 변경
- 워크플로만 변경
- 현재 설정 유지 (종료)

현재 설정을 유지하면 변경 사항이 기록되지 않으며 업데이트 프롬프트도 표시되지 않습니다. 설정 변경은 없지만 현재 프로젝트 파일이 전역 프로필/배송 설정과 동기화되지 않은 경우 OpenSpec은 경고를 표시하고 `openspec update`를 제안합니다. `Ctrl+C`를 눌러도 흐름이 깔끔하게 취소됩니다 (스택 트레이스 없음) 및 종료 코드 `130`으로 종료됩니다. 워크플로 체크리스트에서 `[x]`는 해당 워크플로가 전역 설정에서 선택되었음을 의미합니다. 이 선택을 프로젝트 파일에 적용하려면 `openspec update`를 실행하거나 (프로젝트 내에서 프롬프트가 표시될 경우 '지금 이 프로젝트에 변경 사항 적용?'을 선택하세요).

**인터랙티브 예시:**

```bash
# 배송만 업데이트
openspec config profile
# 선택: 배송만 변경
# 배송 선택: Skills만 사용

# 워크플로만 업데이트
openspec config profile
# 선택: 워크플로만 변경
# 체크리스트에서 워크플로 토글 후 확인
```

---

## 유틸리티 명령어

### `openspec feedback`

OpenSpec에 대한 피드백을 제출합니다. GitHub 이슈를 생성합니다.

```
openspec feedback <message> [options]
```

**인자:**

| 인자 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `message` | 예 | 피드백 메시지 |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--body <text>` | 상세 설명 |

**요구 사항:** GitHub CLI(`gh`)가 설치되어 인증되어 있어야 합니다.

**예시:**

```bash
openspec feedback "커스텀 아티팩트 타입 지원 추가" \
  --body "내장 아티팩트 타입 외에 직접 아티팩트 타입을 정의하고 싶습니다."
```

---

### `openspec completion`

OpenSpec CLI의 셸 완료 기능을 관리합니다.

```
openspec completion <subcommand> [shell]
```

**서브커맨드:**

| 서브커맨드 | 설명 |
|------------|-------------|
| `generate [shell]` | 완료 스크립트를 표준 출력으로 출력 |
| `install [shell]` | 사용 중인 셸에 완료 기능 설치 |
| `uninstall [shell]` | 설치된 완료 기능 제거 |

**지원 셸:** `bash`, `zsh`, `fish`, `powershell`

**예시:**

```bash
# 완료 기능 설치 (셸 자동 감지)
openspec completion install

# 특정 셸에 설치
openspec completion install zsh

# 수동 설치용 스크립트 생성
openspec completion generate bash > ~/.bash_completion.d/openspec

# 완료 기능 제거
openspec completion uninstall
```

---

## 종료 코드

| 코드 | 의미 |
|------|---------|
| `0` | 성공 |
| `1` | 오류 (검증 실패, 파일 누락 등) |

---

## 환경 변수

| 변수 | 설명 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | 값을 `0`으로 설정하면 원격 분석을 비활성화합니다 |
| `DO_NOT_TRACK` | 값을 `1`으로 설정하면 원격 분석을 비활성화합니다 (표준 DNT 신호) |
| `OPENSPEC_CONCURRENCY` | 대량 검증의 기본 동시성 수 (기본값: 6) |
| `EDITOR` 또는 `VISUAL` | `openspec config edit`에 사용할 편집기 |
| `NO_COLOR` | 설정 시 색상 출력을 비활성화합니다 |

---

## 관련 문서

- [Commands](commands.md) - AI 슬래시 명령어 (`/opsx:propose`, `/opsx:apply` 등)
- [Workflows](workflows.md) - 일반적인 패턴과 각 명령어의 사용 시기
- [Customization](customization.md) - 커스텀 스키마와 템플릿 생성
- [Getting Started](getting-started.md) - 첫 사용자 설정 가이드