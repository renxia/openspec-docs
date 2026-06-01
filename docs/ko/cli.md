# CLI 참조

OpenSpec CLI(`openspec`)는 프로젝트 설정, 유효성 검사, 상태 검사 및 관리를 위한 터미널 명령을 제공합니다. 이러한 명령은 [명령](commands.md)에 문서화된 AI 슬래시 명령(예: `/opsx:propose`)을 보완합니다.

## 요약

| 카테고리 | 명령 | 목적 |
|----------|----------|---------|
| **설정** | `init`, `update` | 프로젝트에서 OpenSpec을 초기화하고 업데이트 |
| **작업 영역 (베타)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | 연결된 리포지토리 또는 폴더에 대한 로컬 뷰 설정 |
| **공유 컨텍스트 (베타)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | 로컬 컨텍스트-스토어 등록 및 지속적인 이니셔티브 컨텍스트 관리 |
| **탐색** | `list`, `view`, `show` | 변경사항 및 사양 탐색 |
| **유효성 검사** | `validate` | 변경사항 및 사양의 문제점 확인 |
| **수명 주기** | `archive` | 완료된 변경사항 마무리 |
| **워크플로우** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | 아티팩트 기반 워크플로우 지원 |
| **스키마** | `schema init`, `schema fork`, `schema validate`, `schema which` | 사용자 정의 워크플로우 생성 및 관리 |
| **설정** | `config` | 설정查看 및 수정 |
| **유틸리티** | `feedback`, `completion` | 피드백 및 쉘 통합 |

---

## 인간 vs 에이전트 명령어

대부분의 CLI 명령어는 터미널에서 **인간 사용**을 위해 설계되었습니다. 일부 명령어는 JSON 출력을 통해 **에이전트/스크립트 사용**도 지원합니다.

### 인간 전용 명령어

이 명령어들은 대화형이며 터미널 사용을 위해 설계되었습니다:

| 명령어 | 용도 |
|---------|---------|
| `openspec init` | 프로젝트 초기화 (대화형 프롬프트) |
| `openspec view` | 대화형 대시보드 |
| `openspec config edit` | 에디터에서 설정 열기 |
| `openspec feedback` | GitHub을 통해 피드백 제출 |
| `openspec completion install` | 셸 자동 완성 설치 |

### 에이전트 호환 명령어

이 명령어들은 AI 에이전트와 스크립트의 프로그래밍 방식 사용을 위해 `--json` 출력을 지원합니다:

| 명령어 | 인간 사용 | 에이전트 사용 |
|---------|-----------|-----------|
| `openspec list` | 변경사항/사양 탐색 | 구조화된 데이터용 `--json` |
| `openspec show <item>` | 콘텐츠 읽기 | 파싱용 `--json` |
| `openspec validate` | 문제 확인 | 대량 검증용 `--all --json` |
| `openspec status` | 아티팩트 진행 상황 확인 | 구조화된 상태용 `--json` |
| `openspec instructions` | 다음 단계 확인 | 에이전트 지침용 `--json` |
| `openspec templates` | 템플릿 경로 찾기 | 경로 해석용 `--json` |
| `openspec schemas` | 사용 가능한 스키마 목록 | 스키마 검색용 `--json` |
| `openspec workspace setup --no-interactive` | 명시적 입력으로 워크스페이스 생성 | 구조화된 설정 출력용 `--json` |
| `openspec workspace list` | 알려진 워크스페이스 탐색 | 형식화된 워크스페이스 객체용 `--json` |
| `openspec workspace link` | 리포지토리 또는 폴더 연결 | 구조화된 연결 출력용 `--json` |
| `openspec workspace relink` | 연결된 경로 복구 | 구조화된 연결 출력용 `--json` |
| `openspec workspace doctor` | 단일 워크스페이스 확인 | 구조화된 상태 출력용 `--json` |
| `openspec workspace update` | 워크스페이스 로컬 가이던스 및 에이전트 스킬 새로고침 | `--tools`는 에이전트 선택; 프로필은 워크플로우 선택 |
| `openspec context-store setup <id>` | 로컬 컨텍스트 스토어 생성 | 구조화된 설정 출력을 위한 명시적 입력 포함 `--json` |
| `openspec context-store register <path>` | 기존 컨텍스트 스토어 등록 | 구조화된 등록 출력용 `--json` |
| `openspec context-store unregister <id>` | 로컬 컨텍스트 스토어 등록 해제 | 구조화된 정리 출력용 `--json` |
| `openspec context-store remove <id>` | 등록된 로컬 컨텍스트 스토어 폴더 삭제 | 비대화형 삭제용 `--yes --json` |
| `openspec context-store list` | 등록된 컨텍스트 스토어 탐색 | 구조화된 등록 정보용 `--json` |
| `openspec context-store doctor` | 로컬 스토어 설정 확인 | 구조화된 진단용 `--json` |
| `openspec initiative list` | 공유 이니셔티브 탐색 | 구조화된 이니셔티브 레코드용 `--json` |
| `openspec initiative show <id>` | 이니셔티브 해석 | 표준 경로 및 메타데이터용 `--json` |
| `openspec new change <id>` | 리포지토리 로컬 변경 스캐폴딩 생성 | `--json`, 공유 조정 링크를 위한 `--initiative` 추가 |
| `openspec set change <id>` | 체크인된 변경 메타데이터 업데이트 | `--json`, 공유 조정 링크를 위한 `--initiative` 추가 |

---

## 전역 옵션

이 옵션들은 모든 명령어에서 사용할 수 있습니다:

| 옵션 | 설명 |
|--------|-------------|
| `--version`, `-V` | 버전 번호 표시 |
| `--no-color` | 컬러 출력 비활성화 |
| `--help`, `-h` | 명령어에 대한 도움말 표시 |

---

## 설정 명령어

### `openspec init`

프로젝트에서 OpenSpec을 초기화합니다. 폴더 구조를 생성하고 AI 도구 통합을 구성합니다.

기본 동작은 전역 설정 기본값을 사용합니다: 프로필 `core`, 전달 방식 `both`, 워크플로우 `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `path` | 아니오 | 대상 디렉토리 (기본값: 현재 디렉토리) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--tools <list>` | 비대화형으로 AI 도구를 구성합니다. `all`, `none` 또는 쉼표로 구분된 목록 사용 |
| `--force` | 프롬프트 없이 레거시 파일 자동 정리 |
| `--profile <profile>` | 이 초기화 실행에 대해 전역 프로필 재정의 (`core` 또는 `custom`) |

`--profile custom`은 전역 설정(`openspec config profile`)에서 현재 선택된 워크플로우를 사용합니다.

**지원되는 도구 ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**예시:**

```bash
# 대화형 초기화
openspec init

# 특정 디렉토리에서 초기화
openspec init ./my-project

# 비대화형: Claude 및 Cursor용 구성
openspec init --tools claude,cursor

# 지원되는 모든 도구용 구성
openspec init --tools all

# 이 실행에 대해 프로필 재정의
openspec init --profile core

# 프롬프트 건너뛰고 레거시 파일 자동 정리
openspec init --force
```

**생성되는 파일:**

```
openspec/
├── specs/              # 사양 (소스 오브 트루스)
├── changes/            # 제안된 변경사항
└── config.yaml         # 프로젝트 설정

.claude/skills/         # Claude Code 스킬 (claude 선택 시)
.cursor/skills/         # Cursor 스킬 (cursor 선택 시)
.cursor/commands/       # Cursor OPSX 명령어 (전달 방식에 commands 포함 시)
... (기타 도구 설정)
```

---

### `openspec update`

CLI 업그레이드 후 OpenSpec 지침 파일을 업데이트합니다. 현재 전역 프로필, 선택된 워크플로우 및 전달 방식을 사용하여 AI 도구 설정 파일을 다시 생성합니다.

```
openspec update [path] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `path` | 아니오 | 대상 디렉토리 (기본값: 현재 디렉토리) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--force` | 파일이 최신 상태일 때도 강제 업데이트 |

**예시:**

```bash
# npm 업그레이드 후 지침 파일 업데이트
npm update @fission-ai/openspec
openspec update
```

---

## 워크스페이스 명령어

워크스페이스 명령어는 베타 버전입니다. 아래의 로컬 뷰 모델이 현재 방향이지만, 외부 자동화, 통합 및 장기 워크플로우는 명령어 동작, 상태 파일 및 JSON 출력이 계속 진화하는 것으로 간주해야 합니다.

조정 워크스페이스는 연결된 리포지토리 또는 폴더에 대한 머신 로컬 뷰입니다. 워크스페이스 가시성은 변경 사항 커밋이 아닙니다: OpenSpec이 알아야 할 리포지토리 또는 폴더를 연결한 다음, 특정 작업을 계획할 준비가 되면 변경 사항을 생성하세요.

### `openspec workspace setup`

표준 OpenSpec 워크스페이스 위치에 워크스페이스를 생성하고 최소 하나의 기존 리포지토리 또는 폴더를 연결합니다.

```bash
openspec workspace setup [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--name <name>` | 워크스페이스 이름. 이름은 케밥 케이스여야 합니다 |
| `--link <path>` | 기존 리포지토리 또는 폴더를 연결하고 폴더 이름에서 링크 이름을 추론합니다 |
| `--link <name>=<path>` | 명시적 링크 이름으로 기존 리포지토리 또는 폴더를 연결합니다 |
| `--opener <id>` | 비대화형 설정 시 선호하는 오프너를 저장합니다: `codex-cli`, `claude`, `github-copilot` 또는 `editor` |
| `--tools <tools>` | 에이전트용 워크스페이스 로컬 OpenSpec 스킬을 설치합니다. `all`, `none` 또는 쉼표로 구분된 도구 ID 사용 |
| `--no-interactive` | 프롬프트 비활성화; `--name`과 최소 하나의 `--link`가 필요합니다 |
| `--json` | JSON 출력; `--no-interactive`가 필요합니다 |

**예시:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

대화형 설정은 선호하는 오프너를 요청하고 선택된 에이전트에 대해 워크스페이스 로컬 OpenSpec 스킬을 설치할 수 있습니다. 비대화형 설정은 `--opener`가 제공될 때만 선호하는 오프너를 저장합니다; 그렇지 않으면 지원되는 오프너를 사용할 수 있는 대화형 터미널에서 나중에 `workspace open`이 프롬프트를 표시하거나, 스크립트에 `--agent <tool>` 또는 `--editor`를 전달하도록 요청합니다.

워크스페이스 스킬 설치는 이 베타 버전에서 스킬 전용입니다: 전역 전달 방식이 `commands` 또는 `both`이더라도, 워크스페이스 설정은 워크스페이스 루트에 에이전트 스킬 폴더를 작성하고 슬래시 명령어 파일을 생성하지 않습니다. 활성 전역 프로필이 어떤 워크플로우 스킬을 설치할지 선택합니다; `--tools`는 어떤 에이전트가 이를 받을지 선택합니다. 비대화형 설정에서 `--tools`가 생략되면 스킬이 설치되지 않으며, `workspace update --tools <ids>`로 나중에 추가할 수 있습니다.

### `openspec workspace list`

로컬 레지스트리에서 알려진 OpenSpec 워크스페이스를 나열합니다.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

목록은 각 워크스페이스 위치와 연결된 리포지토리 또는 폴더를 표시합니다. 오래된 레지스트리 레코드는 보고되지만 변경되지는 않습니다.

### `openspec workspace link`

하나의 워크스페이스에 대해 기존 리포지토리 또는 폴더를 기록합니다.

```bash
openspec workspace link [name] <path> [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--workspace <name>` | 로컬 레지스트리에서 알려진 워크스페이스 선택 |
| `--json` | JSON 출력 |
| `--no-interactive` | 워크스페이스 선택기 프롬프트 비활성화 |

**예시:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

경로는 이미 존재해야 합니다. 상대 경로는 OpenSpec이 검증된 절대 경로를 머신 로컬 워크스페이스 상태에 저장하기 전에 명령어의 현재 디렉토리에 대해 해석됩니다. 연결된 경로는 전체 리포지토리, 패키지, 서비스, 앱 또는 리포지토리 로컬 `openspec/` 상태가 없는 폴더일 수 있습니다.

### `openspec workspace relink`

기존 링크의 로컬 경로를 복구하거나 변경합니다.

```bash
openspec workspace relink <name> <path> [options]
```

경로는 이미 존재해야 합니다. relink는 안정적인 링크 이름에 대한 머신 로컬 경로만 업데이트합니다.

### `openspec workspace doctor`

현재 머신에서 하나의 워크스페이스가 해석할 수 있는 것을 확인합니다.

```bash
openspec workspace doctor [options]
```

Doctor는 워크스페이스 위치, 연결된 리포지토리 또는 폴더, 누락된 경로, 존재하는 경우 리포지토리 로컬 사양 경로 및 수정 제안을 표시합니다. JSON 출력에는 호환성을 위해 워크스페이스 계획 경로도 포함됩니다. 문제만 보고하며 자동으로 복구하지 않습니다.

하나의 워크스페이스가 필요한 명령어는 워크스페이스 폴더 또는 하위 디렉토리 내에서 실행할 때 현재 워크스페이스를 사용합니다. 다른 곳에서 실행할 때는 `--workspace <name>`을 전달하거나, 대화형 터미널에서 선택기에서 선택하거나, 정확히 하나만 존재할 때 알려진 유일한 워크스페이스에 의존합니다. `--json` 또는 `--no-interactive` 모드에서는 모호한 선택이 구조화된 상태 오류로 실패하고 `--workspace <name>`을 제안합니다.

JSON 응답은 형식화된 객체와 `status` 배열을 사용합니다. 기본 데이터는 `workspace`, `workspaces` 또는 `link`에 있고, 경고와 오류는 `status`에 있습니다.

### `openspec workspace update`

워크스페이스 로컬 OpenSpec 가이던스 및 에이전트 스킬을 새로고침합니다.

```bash
openspec workspace update [name] [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--workspace <name>` | 로컬 레지스트리에서 알려진 워크스페이스 선택 |
| `--tools <tools>` | 워크스페이스 스킬용 에이전트 선택. `all`, `none` 또는 쉼표로 구분된 도구 ID 사용 |
| `--json` | JSON 출력 |
| `--no-interactive` | 워크스페이스 선택기 프롬프트 비활성화 |

**예시:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update`는 생성된 워크스페이스 가이던스 블록과 로컬 오픈 서페이스를 새로고침합니다. 에이전트 스킬의 경우 `--tools`가 생략되면 저장된 워크스페이스 스킬 에이전트 선택을 재사용합니다. `--tools`를 전달하면 저장된 선택이 대체됩니다. 워크스페이스 루트에서 OpenSpec 관리 워크플로우 스킬 디렉토리만 새로고침하고, 선택 해제된 관리 워크플로우 스킬을 제거하며, 연결된 리포지토리와 폴더는 그대로 둡니다.

워크스페이스 내부에서 `openspec update`를 실행하면 `openspec workspace update`로 리디렉션됩니다; 리포지토리 소유 도구 파일을 업데이트하려는 경우 리포지토리 로컬 프로젝트 내부에서 `openspec update`를 실행하세요.

### `openspec workspace open`

저장된 선호 오프너, 세션별 에이전트 재정의 또는 VS Code 에디터 모드를 통해 워크스페이스 작업 세트를 엽니다.

```bash
openspec workspace open [name] [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--workspace <name>` | 위치 인수 워크스페이스 이름의 별칭 |
| `--initiative <id>` | 이니셔티브를 로컬 워크스페이스 뷰로 엽니다. `<id>` 또는 `<store>/<id>` 허용 |
| `--store <id>` | `--initiative`용 등록된 컨텍스트 스토어 ID |
| `--store-path <path>` | `--initiative`용 기존 로컬 컨텍스트 스토어 루트 |
| `--agent <tool>` | 세션별 에이전트 재정의: `codex-cli`, `claude` 또는 `github-copilot` |
| `--editor` | 유지 관리되는 VS Code 워크스페이스 파일을 일반 에디터 워크스페이스로 열기 |
| `--no-interactive` | 워크스페이스 및 오프너 선택기 프롬프트 비활성화 |

**예시:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open`은 워크스페이스 내부에서 실행할 때 현재 워크스페이스를 사용하고, 다른 곳에서 실행할 때 알려진 유일한 워크스페이스를 자동 선택하며, 여러 워크스페이스가 알려져 있을 때 사용자에게 선택을 요청합니다. `--agent`와 `--editor`는 저장된 선호 오프너를 변경하지 않습니다. 두 오프너 재정의를 모두 전달하면 오류입니다; `--agent <tool>` 또는 `--editor` 중 하나를 선택하세요.

`--initiative`가 사용되면, OpenSpec은 해당 이니셔티브에 대한 비공개 로컬 워크스페이스 뷰를 준비하거나 선택합니다. 레지스트리에서 선택된 스토어는 ID로 저장됩니다; `--store-path`는 워크스페이스 뷰가 비공개 로컬 상태이기 때문에 런타임 로컬 경로 선택자를 저장합니다.

OpenSpec은 VS Code 에디터 및 GitHub Copilot-in-VS-Code 열기를 위해 워크스페이스 루트에 `<workspace-name>.code-workspace`를 유지 관리합니다. 해당 파일은 머신 로컬 워크스페이스 뷰 상태입니다.

유지 관리되는 VS Code 워크스페이스는 먼저 유효한 연결된 리포지토리 또는 폴더를 나열하고, 다음으로 첨부된 경우 이니셔티브 컨텍스트를, 마지막으로 OpenSpec 워크스페이스 파일을 나열합니다. VS Code는 해당 항목을 멀티 루트 워크스페이스로 표시합니다.

루트 워크스페이스 열기는 탐색 및 컨텍스트를 위해 연결된 리포지토리 또는 폴더를 가시화합니다. 구현 편집은 명시적인 사용자 요청과 일반 OpenSpec 구현 워크플로우 후에만 시작해야 합니다.

---

## 공유 컨텍스트 명령어

컨텍스트 저장소와 이니셔티브는 베타 단계의 협업 인터페이스입니다. 컨텍스트 저장소는 내구성이 있는 공유 컨텍스트를 위한 로컬 등록소로, 일반적으로 Git 기반 폴더 또는 클론입니다. 이니셔티브는 컨텍스트 저장소 내부의 공유 협업 컨텍스트입니다. 리포지토리 로컬 변경 사항은 공유 계획을 모든 리포지토리에 복사하지 않고도 이니셔티브에 연결할 수 있습니다.

### `openspec context-store setup`

로컬 컨텍스트 저장소를 생성하고 등록합니다. 터미널에서 인자를 지정하지 않으면, OpenSpec이 사용자를 안내하여 설정을 진행합니다. 에이전트와 스크립트는 명시적인 입력을 전달하고 `--json`을 사용해야 합니다.

```bash
openspec context-store setup [id] [options]
```

**옵션:**

| 옵션 | 설명 |
|------|------|
| `--path <path>` | 컨텍스트 저장소 폴더 경로. 기본값은 OpenSpec이 관리하는 로컬 데이터 디렉토리 |
| `--init-git` | 컨텍스트 저장소에 Git 리포지토리를 초기화 |
| `--no-init-git` | Git 리포지토리를 초기화하지 않음 |
| `--json` | JSON 출력 |

`--path`를 생략하면, 설정 시 `getGlobalDataDir()/context-stores/<id>` 경로에 저장소를 생성합니다. `XDG_DATA_HOME`이 설정된 경우 `$XDG_DATA_HOME/openspec/context-stores/<id>`를 사용하고, Unix 스타일 폴백에서는 `~/.local/share/openspec/context-stores/<id>`를 사용합니다. 저장소를 볼 수 있는 클론이나 팀 전용 폴더에 배치하려면 `--path`를 전달하세요.

예시:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

기존 로컬 컨텍스트 저장소 폴더를 등록합니다.

```bash
openspec context-store register [path] [options]
```

**옵션:**

| 옵션 | 설명 |
|------|------|
| `--id <id>` | 컨텍스트 저장소 ID. 기본값은 저장소 메타데이터 또는 폴더 이름 |
| `--json` | JSON 출력 |

### `openspec context-store unregister`

파일을 삭제하지 않고 로컬 컨텍스트 저장소 등록을 해제합니다.

```bash
openspec context-store unregister <id> [--json]
```

저장소가 이동되었거나 다른 곳으로 클론되었거나, 이 머신에서 OpenSpec에 더 이상 표시되지 않아야 할 때 사용합니다.

### `openspec context-store remove`

로컬 컨텍스트 저장소 등록을 해제하고 해당 로컬 폴더를 삭제합니다.

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove`는 대화형 터미널에서 삭제하기 전에 정확한 폴더 경로를 표시합니다. 에이전트, 스크립트 및 JSON 호출자는 삭제를 확인하기 위해 `--yes`를 전달해야 합니다. OpenSpec은 일치하는 컨텍스트 저장소 메타데이터가 포함되지 않은 폴더의 삭제를 거부합니다.

### `openspec context-store list`

로컬에 등록된 컨텍스트 저장소를 나열합니다.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

로컬 컨텍스트 저장소의 등록, 메타데이터 및 Git 존재 여부를 확인합니다.

```bash
openspec context-store doctor [id] [--json]
```

doctor은 진단 전용입니다. 저장소를 수정하지 않고 누락된 루트, 메타데이터 불일치, 유효하지 않은 로컬 레지스트리 상태를 보고합니다.

### `openspec initiative create`

컨텍스트 저장소에 이니셔티브를 생성합니다.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**옵션:**

| 옵션 | 설명 |
|------|------|
| `--store <id>` | 로컬 레지스트리의 컨텍스트 저장소 ID |
| `--store-path <path>` | 기존 로컬 컨텍스트 저장소 루트 |
| `--title <title>` | 이니셔티브 제목 |
| `--summary <summary>` | 이니셔티브 요약 |
| `--json` | JSON 출력 |

### `openspec initiative list`

이니셔티브를 나열합니다. 선택자를 지정하지 않으면, 모든 등록된 컨텍스트 저장소를 검색하고 `status`에 부분 읽기 경고를 보고합니다.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**옵션:**

| 옵션 | 설명 |
|------|------|
| `--store <id>` | 하나의 등록된 컨텍스트 저장소를 나열 |
| `--store-path <path>` | 하나의 기존 로컬 컨텍스트 저장소 루트를 나열 |
| `--json` | JSON 출력 |

### `openspec initiative show`

이니셔티브를 확인하고 해당 표준 위치를 출력합니다.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

`--store`를 지정하지 않으면, OpenSpec은 등록된 컨텍스트 저장소를 검색합니다. 동일한 이니셔티브 ID가 여러 저장소에 존재하는 경우, `--store <id>`를 전달하거나 `<store>/<id>` 형식을 사용하세요.

---

## 탐색 명령어

### `openspec list`

프로젝트의 변경사항 또는 사양을 나열합니다.

```
openspec list [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--specs` | 변경사항 대신 사양을 나열 |
| `--changes` | 변경사항을 나열 (기본값) |
| `--sort <order>` | `recent` (기본값) 또는 `name`으로 정렬 |
| `--json` | JSON 형식으로 출력 |

**예시:**

```bash
# 모든 활성 변경사항 나열
openspec list

# 모든 사양 나열
openspec list --specs

# 스크립트용 JSON 출력
openspec list --json
```

**출력 (텍스트):**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

사양과 변경사항을 탐색하기 위한 대시보드를 표시합니다.

```
openspec view
```

프로젝트의 사양과 변경사항을 탐색할 수 있는 터미널 기반 인터페이스를 엽니다.

---

### `openspec show`

변경사항 또는 사양의 세부 정보를 표시합니다.

```
openspec show [item-name] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `item-name` | 아니오 | 변경사항 또는 사양 이름 (생략 시 입력 요청) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--type <type>` | 유형 지정: `change` 또는 `spec` (명확한 경우 자동 감지) |
| `--json` | JSON 형식으로 출력 |
| `--no-interactive` | 프롬프트 비활성화 |

**변경사항 전용 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--deltas-only` | 델타 사양만 표시 (JSON 모드) |

**사양 전용 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--requirements` | 요구사항만 표시, 시나리오 제외 (JSON 모드) |
| `--no-scenarios` | 시나리오 콘텐츠 제외 (JSON 모드) |
| `-r, --requirement <id>` | 1부터 시작하는 인덱스로 특정 요구사항 표시 (JSON 모드) |

**예시:**

```bash
# 대화형 선택
openspec show

# 특정 변경사항 표시
openspec show add-dark-mode

# 특정 사양 표시
openspec show auth --type spec

# 파싱용 JSON 출력
openspec show add-dark-mode --json
```

---

## 유효성 검사 명령어

### `openspec validate`

변경사항과 사양의 구조적 문제를 검증합니다.

```
openspec validate [item-name] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `item-name` | 아니오 | 검증할 특정 항목 (생략 시 입력 요청) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--all` | 모든 변경사항과 사양 검증 |
| `--changes` | 모든 변경사항 검증 |
| `--specs` | 모든 사양 검증 |
| `--type <type>` | 이름이 모호할 때 유형 지정: `change` 또는 `spec` |
| `--strict` | 엄격한 검증 모드 활성화 |
| `--json` | JSON 형식으로 출력 |
| `--concurrency <n>` | 최대 병렬 검증 수 (기본값: 6, 또는 `OPENSPEC_CONCURRENCY` 환경변수) |
| `--no-interactive` | 프롬프트 비활성화 |

**예시:**

```bash
# 대화형 검증
openspec validate

# 특정 변경사항 검증
openspec validate add-dark-mode

# 모든 변경사항 검증
openspec validate --changes

# JSON 출력으로 전체 검증 (CI/스크립트용)
openspec validate --all --json

# 병렬 처리 증가와 함께 엄격한 검증
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

## 라이프사이클 명령어

### `openspec archive`

완료된 변경사항을 아카이브하고 델타 사양을 메인 사양에 병합합니다.

```
openspec archive [change-name] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 아카이브할 변경사항 (생략 시 입력 요청) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `-y, --yes` | 확인 프롬프트 건너뛰기 |
| `--skip-specs` | 사양 업데이트 건너뛰기 (인프라/툴링/문서 전용 변경사항용) |
| `--no-validate` | 검증 건너뛰기 (확인 필요) |

**예시:**

```bash
# 대화형 아카이브
openspec archive

# 특정 변경사항 아카이브
openspec archive add-dark-mode

# 프롬프트 없이 아카이브 (CI/스크립트)
openspec archive add-dark-mode --yes

# 사양에 영향을 주지 않는 툴링 변경사항 아카이브
openspec archive update-ci-config --skip-specs
```

**동작 방식:**

1. 변경사항 검증 (`--no-validate` 제외)
2. 확인 요청 (`--yes` 제외)
3. 델타 사양을 `openspec/specs/`에 병합
4. 변경사항 폴더를 `openspec/changes/archive/YYYY-MM-DD-<name>/`으로 이동

---

## 워크플로 명령어

이 명령어들은 아티팩트 기반 OPSX 워크플로를 지원합니다. 진행 상황을 확인하는 사용자와 다음 단계를 결정하는 에이전트 모두에게 유용합니다.

### `openspec new change`

로컬 저장소 변경사항 디렉토리와 선택적 체크인 메타데이터를 생성합니다.

```bash
openspec new change <name> [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--description <text>` | `README.md`에 추가할 설명 |
| `--goal <text>` | 변경사항과 함께 저장할 워크스페이스 제품 목표 |
| `--areas <names>` | 영향을 받는 워크스페이스 링크 이름 (쉼표 구분) |
| `--initiative <id>` | 로컬 변경사항을 이니셔티브에 연결 |
| `--store <id>` | `--initiative`용 컨텍스트 저장소 ID |
| `--store-path <path>` | `--initiative`용 기존 로컬 컨텍스트 저장소 루트 |
| `--schema <name>` | 사용할 워크플로 스키마 |
| `--json` | JSON 출력 |

예시:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

변경사항을 다시 생성하지 않고 체크인된 로컬 변경사항 메타데이터를 업데이트합니다.

```bash
openspec set change <name> [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--initiative <id>` | 로컬 변경사항을 이니셔티브에 연결 |
| `--store <id>` | `--initiative`용 컨텍스트 저장소 ID |
| `--store-path <path>` | `--initiative`용 기존 로컬 컨텍스트 저장소 루트 |
| `--json` | JSON 출력 |

`set change --initiative`는 요청된 링크가 이미 존재하면 멱등성을 가지며, 다른 기존 이니셔티브 링크를 대체하지 않습니다.

### `openspec status`

변경사항의 아티팩트 완료 상태를 표시합니다.

```
openspec status [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--change <id>` | 변경사항 이름 (생략 시 입력 요청) |
| `--schema <name>` | 스키마 재정의 (변경사항 설정에서 자동 감지) |
| `--json` | JSON 형식으로 출력 |

**예시:**

```bash
# 대화형 상태 확인
openspec status

# 특정 변경사항 상태
openspec status --change add-dark-mode

# 에이전트용 JSON
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

아티팩트 생성 또는 작업 적용을 위한 풍부한 지침을 가져옵니다. AI 에이전트가 다음에 무엇을 생성할지 이해하는 데 사용됩니다.

```
openspec instructions [artifact] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `artifact` | 아니오 | 아티팩트 ID: `proposal`, `specs`, `design`, `tasks`, 또는 `apply` |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--change <id>` | 변경사항 이름 (비대화형 모드에서 필수) |
| `--schema <name>` | 스키마 재정의 |
| `--json` | JSON 형식으로 출력 |

**특수 경우:** 아티팩트로 `apply`를 사용하면 작업 구현 지침을 얻을 수 있습니다.

**예시:**

```bash
# 다음 아티팩트에 대한 지침 가져오기
openspec instructions --change add-dark-mode

# 특정 아티팩트 지침 가져오기
openspec instructions design --change add-dark-mode

# 적용/구현 지침 가져오기
openspec instructions apply --change add-dark-mode

# 에이전트용 JSON
openspec instructions design --change add-dark-mode --json
```

**포함되는 출력:**

- 아티팩트용 템플릿 콘텐츠
- 설정에서 가져온 프로젝트 컨텍스트
- 종속 아티팩트의 콘텐츠
- 설정에서 가져온 아티팩트별 규칙

---

### `openspec templates`

스키마의 모든 아티팩트에 대한 템플릿 경로를 표시합니다.

```
openspec templates [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--schema <name>` | 검사할 스키마 (기본값: `spec-driven`) |
| `--json` | JSON 형식으로 출력 |

**예시:**

```bash
# 기본 스키마의 템플릿 경로 표시
openspec templates

# 커스텀 스키마의 템플릿 표시
openspec templates --schema my-workflow

# 프로그래밍 방식 사용을 위한 JSON
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

사용 가능한 워크플로 스키마와 설명, 아티팩트 흐름을 나열합니다.

```
openspec schemas [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--json` | JSON 형식으로 출력 |

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

---

## 스키마 명령어

사용자 정의 워크플로 스키마를 생성하고 관리하기 위한 명령어입니다.

### `openspec schema init`

새 프로젝트 로컬 스키마를 생성합니다.

```
openspec schema init <name> [options]
```

**인수:**

| 인수    | 필수 | 설명                              |
|---------|------|-----------------------------------|
| `name`  | 예   | 스키마 이름 (케밥 케이스)        |

**옵션:**

| 옵션                    | 설명                                                                 |
|-------------------------|----------------------------------------------------------------------|
| `--description <text>`  | 스키마 설명                                                          |
| `--artifacts <list>`    | 쉼표로 구분된 아티팩트 ID (기본값: `proposal,specs,design,tasks`)   |
| `--default`             | 프로젝트 기본 스키마로 설정                                          |
| `--no-default`          | 기본 스키마 설정 묻지 않음                                           |
| `--force`               | 기존 스키마 덮어쓰기                                                 |
| `--json`                | JSON 형식으로 출력                                                   |

**예시:**

```bash
# 대화형 스키마 생성
openspec schema init research-first

# 특정 아티팩트로 비대화형 생성
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**생성되는 구조:**

```
openspec/schemas/<name>/
├── schema.yaml           # 스키마 정의
└── templates/
    ├── proposal.md       # 각 아티팩트의 템플릿
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

기존 스키마를 프로젝트에 복사하여 커스터마이징합니다.

```
openspec schema fork <source> [name] [options]
```

**인수:**

| 인수     | 필수 | 설명                                      |
|----------|------|-------------------------------------------|
| `source` | 예   | 복사할 스키마                             |
| `name`   | 아니오 | 새 스키마 이름 (기본값: `<source>-custom`) |

**옵션:**

| 옵션     | 설명                       |
|----------|----------------------------|
| `--force`| 기존 대상 덮어쓰기         |
| `--json` | JSON 형식으로 출력         |

**예시:**

```bash
# 내장 스키마-드리븐 스키마를 분기
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

스키마의 구조와 템플릿을 검증합니다.

```
openspec schema validate [name] [options]
```

**인수:**

| 인수   | 필수 | 설명                                        |
|--------|------|---------------------------------------------|
| `name` | 아니오 | 검증할 스키마 (생략 시 모두 검증)         |

**옵션:**

| 옵션       | 설명                         |
|------------|------------------------------|
| `--verbose`| 상세 검증 단계 표시          |
| `--json`   | JSON 형식으로 출력           |

**예시:**

```bash
# 특정 스키마 검증
openspec schema validate my-workflow

# 모든 스키마 검증
openspec schema validate
```

---

### `openspec schema which`

스키마가 어디서 해석되는지 표시합니다 (우선 순위 디버깅에 유용).

```
openspec schema which [name] [options]
```

**인수:**

| 인수   | 필수 | 설명          |
|--------|------|---------------|
| `name` | 아니오 | 스키마 이름   |

**옵션:**

| 옵션     | 설명                               |
|----------|------------------------------------|
| `--all`  | 모든 스키마와 해당 소스 목록 표시 |
| `--json` | JSON 형식으로 출력                 |

**예시:**

```bash
# 스키마의 출처 확인
openspec schema which spec-driven
```

**출력:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**스키마 우선 순위:**

1. 프로젝트: `openspec/schemas/<name>/`
2. 사용자: `~/.local/share/openspec/schemas/<name>/`
3. 패키지: 내장 스키마

---

## 설정 명령어

### `openspec config`

전역 OpenSpec 설정을 보고 수정합니다.

```
openspec config <subcommand> [options]
```

**하위 명령어:**

| 하위 명령어            | 설명                                                  |
|------------------------|-------------------------------------------------------|
| `path`                 | 설정 파일 위치 표시                                   |
| `list`                 | 현재 모든 설정 표시                                   |
| `get <key>`            | 특정 값 가져오기                                      |
| `set <key> <value>`    | 값 설정                                               |
| `unset <key>`          | 키 제거                                               |
| `reset`                | 기본값으로 재설정                                     |
| `edit`                 | `$EDITOR`에서 열기                                    |
| `profile [preset]`     | 대화형 또는 프리셋을 통한 워크플로 프로필 설정        |

**예시:**

```bash
# 설정 파일 경로 표시
openspec config path

# 모든 설정 목록 표시
openspec config list

# 특정 값 가져오기
openspec config get telemetry.enabled

# 값 설정
openspec config set telemetry.enabled false

# 문자열 값 명시적 설정
openspec config set user.name "My Name" --string

# 사용자 정의 설정 제거
openspec config unset user.name

# 모든 설정 재설정
openspec config reset --all --yes

# 에디터에서 설정 편집
openspec config edit

# 액션 기반 마법사로 프로필 설정
openspec config profile

# 빠른 프리셋: 워크플로를 코어로 전환 (전달 모드 유지)
openspec config profile core
```

`openspec config profile`은 현재 상태 요약으로 시작한 후, 다음을 선택할 수 있게 합니다:
- 전달 + 워크플로 변경
- 전달만 변경
- 워크플로만 변경
- 현재 설정 유지 (종료)

현재 설정을 유지하면 변경 사항이 기록되지 않고 업데이트 프롬프트도 표시되지 않습니다. 설정 변경 사항이 없지만 현재 프로젝트 또는 작업 공간 파일이 전역 프로필/전달과 동기화되지 않은 경우, OpenSpec은 경고를 표시하고 로컬 저장소 프로젝트의 경우 `openspec update`를, 작업 공간 로컬 안내 및 기술의 경우 `openspec workspace update`를 제안합니다.
`Ctrl+C`를 누르면 깨끗하게(스택 트레이스 없이) 흐름을 취소하고 코드 `130`으로 종료합니다.
워크플로 체크리스트에서 `[x]`는 전역 설정에서 해당 워크플로가 선택되었음을 의미합니다. 이러한 선택을 프로젝트 파일에 적용하려면 `openspec update`를 실행하십시오(또는 프로젝트 내에서 프롬프트 시 `지금 이 프로젝트에 변경 사항을 적용하시겠습니까?`를 선택하십시오). 작업 공간 내에서는 `openspec workspace update`를 사용하여 작업 공간 로컬 안내 및 기술을 새로 고침하세요. 이는 생성된 에이전트 워크플로 파일의 경우 기술 전용으로 유지되며 작업 공간 슬래시 명령어를 생성하지 않습니다.

**대화형 예시:**

```bash
# 전달 전용 업데이트
openspec config profile
# 선택: 전달만 변경
# 전달 선택: 기술 전용

# 워크플로 전용 업데이트
openspec config profile
# 선택: 워크플로만 변경
# 체크리스트에서 워크플로 토글, 확인
```

---

## 유틸리티 명령어

### `openspec feedback`

OpenSpec에 대한 피드백을 제출합니다. GitHub 이슈를 생성합니다.

```
openspec feedback <message> [options]
```

**인수:**

| 인수      | 필수 | 설명          |
|-----------|------|---------------|
| `message` | 예   | 피드백 메시지 |

**옵션:**

| 옵션           | 설명                 |
|----------------|----------------------|
| `--body <text>`| 상세 설명            |

**요구 사항:** GitHub CLI (`gh`)가 설치되어 인증되어 있어야 합니다.

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

| 하위 명령어      | 설명                             |
|------------------|----------------------------------|
| `generate [shell]` | 자동 완성 스크립트를 표준 출력으로 출력 |
| `install [shell]`  | 셸에 자동 완성 설치              |
| `uninstall [shell]`| 설치된 자동 완성 제거            |

**지원 셸:** `bash`, `zsh`, `fish`, `powershell`

**예시:**

```bash
# 자동 완성 설치 (셸 자동 감지)
openspec completion install

# 특정 셸용 설치
openspec completion install zsh

# 수동 설치용 스크립트 생성
openspec completion generate bash > ~/.bash_completion.d/openspec

# 제거
openspec completion uninstall
```

---

## 종료 코드

| 코드 | 의미                                          |
|------|-----------------------------------------------|
| `0`  | 성공                                          |
| `1`  | 오류 (검증 실패, 누락된 파일 등)             |

---

## 환경 변수

| 변수                 | 설명                                                                 |
|----------------------|----------------------------------------------------------------------|
| `OPENSPEC_TELEMETRY` | 원격 측정을 비활성화하려면 `0`으로 설정                             |
| `DO_NOT_TRACK`       | 원격 측정을 비활성화하려면 `1`으로 설정 (표준 DNT 시그널)           |
| `OPENSPEC_CONCURRENCY`| 대량 검증을 위한 기본 동시성 (기본값: 6)                           |
| `EDITOR` 또는 `VISUAL`| `openspec config edit`용 에디터                                    |
| `NO_COLOR`           | 설정 시 컬러 출력 비활성화                                           |

---

## 관련 문서

- [명령어](commands.md) - AI 슬래시 명령어 (`/opsx:propose`, `/opsx:apply` 등)
- [워크플로](workflows.md) - 일반적인 패턴 및 각 명령어 사용 시기
- [커스터마이징](customization.md) - 사용자 정의 스키마 및 템플릿 생성
- [시작하기](getting-started.md) - 첫 설정 가이드