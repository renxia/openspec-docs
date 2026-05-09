# CLI 레퍼런스

OpenSpec CLI(`openspec`)는 프로젝트 설정, 검증, 상태 확인 및 관리를 위한 터미널 명령어를 제공합니다. 이 명령어들은 [Commands](commands.md)에 문서화된 AI 슬래시 명령어(예: `/opsx:propose`)를 보완합니다.

## 요약

| 카테고리 | 명령어 | 용도 |
|----------|----------|---------|
| **설정** | `init`, `update` | 프로젝트에서 OpenSpec을 초기화 및 업데이트 |
| **작업 영역 (베타)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | 연결된 저장소 또는 폴더 간 계획 설정 |
| **탐색** | `list`, `view`, `show` | 변경 사항 및 사양 탐색 |
| **검증** | `validate` | 변경 사항 및 사양의 문제점 확인 |
| **수명 주기** | `archive` | 완료된 변경 사항 마무리 |
| **워크플로우** | `status`, `instructions`, `templates`, `schemas` | 아티팩트 기반 워크플로우 지원 |
| **스키마** | `schema init`, `schema fork`, `schema validate`, `schema which` | 사용자 정의 워크플로우 생성 및 관리 |
| **설정** | `config` | 설정 보기 및 수정 |
| **유틸리티** | `feedback`, `completion` | 피드백 및 셸 통합 |

---

## 사용자 대 에이전트 명령어

대부분의 CLI 명령어는 터미널에서 **사용자 사용**을 위해 설계되었습니다. 일부 명령어는 JSON 출력을 통해 **에이전트/스크립트 사용**도 지원합니다.

### 사용자 전용 명령어

이 명령어들은 대화형이며 터미널 사용을 위해 설계되었습니다:

| 명령어 | 용도 |
|---------|---------|
| `openspec init` | 프로젝트 초기화 (대화형 프롬프트) |
| `openspec view` | 대시보드 |
| `openspec config edit` | 에디터에서 설정 열기 |
| `openspec feedback` | GitHub을 통해 피드백 제출 |
| `openspec completion install` | 셸 자동 완성 설치 |

### 에이전트 호환 명령어

이 명령어들은 AI 에이전트와 스크립트의 프로그래밍 방식 사용을 위해 `--json` 출력을 지원합니다:

| 명령어 | 사용자용 | 에이전트용 |
|---------|-----------|-----------|
| `openspec list` | 변경사항/사양 탐색 | 구조화된 데이터용 `--json` |
| `openspec show <item>` | 내용 읽기 | 파싱용 `--json` |
| `openspec validate` | 문제 확인 | 대량 검증용 `--all --json` |
| `openspec status` | 아티팩트 진행 상황 확인 | 구조화된 상태용 `--json` |
| `openspec instructions` | 다음 단계 확인 | 에이전트 지시사항용 `--json` |
| `openspec templates` | 템플릿 경로 찾기 | 경로 확인용 `--json` |
| `openspec schemas` | 사용 가능한 스키마 목록 | 스키마 검색용 `--json` |
| `openspec workspace setup --no-interactive` | 명시적 입력으로 작업 영역 생성 | 구조화된 설정 출력용 `--json` |
| `openspec workspace list` | 알려진 작업 영역 탐색 | 유형화된 작업 영역 객체용 `--json` |
| `openspec workspace link` | 저장소 또는 폴더 연결 | 구조화된 연결 출력용 `--json` |
| `openspec workspace relink` | 연결된 경로 복구 | 구조화된 연결 출력용 `--json` |
| `openspec workspace doctor` | 하나의 작업 영역 확인 | 구조화된 상태 출력용 `--json` |

---

## 전역 옵션

이 옵션들은 모든 명령어에서 작동합니다:

| 옵션 | 설명 |
|--------|-------------|
| `--version`, `-V` | 버전 번호 표시 |
| `--no-color` | 색상 출력 비활성화 |
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
| `--tools <list>` | 대화형 없이 AI 도구를 구성합니다. `all`, `none` 또는 쉼표로 구분된 목록을 사용하세요 |
| `--force` | 프롬프트 없이 레거시 파일을 자동 정리합니다 |
| `--profile <profile>` | 이 초기화 실행에 대해 전역 프로필을 재정의합니다 (`core` 또는 `custom`) |

`--profile custom`은 전역 설정(`openspec config profile`)에서 현재 선택된 워크플로우를 사용합니다.

**지원되는 도구 ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**예시:**

```bash
# 대화형 초기화
openspec init

# 특정 디렉토리에서 초기화
openspec init ./my-project

# 비대화형: Claude 및 Cursor용으로 구성
openspec init --tools claude,cursor

# 지원되는 모든 도구용으로 구성
openspec init --tools all

# 이 실행에 대해 프로필 재정의
openspec init --profile core

# 프롬프트를 건너뛰고 레거시 파일을 자동 정리
openspec init --force
```

**생성되는 내용:**

```
openspec/
├── specs/              # 귀하의 사양 (진실의 원천)
├── changes/            # 제안된 변경사항
└── config.yaml         # 프로젝트 설정

.claude/skills/         # Claude Code 스킬 (claude가 선택된 경우)
.cursor/skills/         # Cursor 스킬 (cursor가 선택된 경우)
.cursor/commands/       # Cursor OPSX 명령어 (전달 방식에 명령어가 포함된 경우)
... (기타 도구 설정)
```

---

### `openspec update`

CLI를 업그레이드한 후 OpenSpec 지시사항 파일을 업데이트합니다. 현재 전역 프로필, 선택된 워크플로우 및 전달 모드를 사용하여 AI 도구 설정 파일을 다시 생성합니다.

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
# npm 업그레이드 후 지시사항 파일 업데이트
npm update @fission-ai/openspec
openspec update
```

---

## 워크스페이스 명령어

워크스페이스 명령어는 현재 활발히 개발 중이며 아직 사용할 준비가 되지 않았습니다. 이 명령어 표면 위에 외부 자동화, 통합 또는 장기 워크플로우를 구축하지 마십시오. 명령어 동작, 상태 파일 및 JSON 출력은 언제든 변경될 수 있습니다.

조정 워크스페이스는 여러 저장소 또는 폴더에 걸친 작업을 위한 계획 공간입니다. 워크스페이스 가시성은 변경 약속이 아닙니다: OpenSpec이 알아야 할 저장소 또는 폴더를 연결한 다음, 특정 작업을 계획할 준비가 되면 변경사항을 생성하십시오.

### `openspec workspace setup`

표준 OpenSpec 워크스페이스 위치에 워크스페이스를 생성하고 최소 하나의 기존 저장소 또는 폴더를 연결합니다.

```bash
openspec workspace setup [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--name <name>` | 워크스페이스 이름. 이름은 케밥 케이스여야 합니다 |
| `--link <path>` | 기존 저장소 또는 폴더를 연결하고 폴더 이름에서 연결 이름을 추론합니다 |
| `--link <name>=<path>` | 명시적 연결 이름으로 기존 저장소 또는 폴더를 연결합니다 |
| `--opener <id>` | 비대화형 설정 중 선호하는 오프너를 저장합니다: `codex`, `claude`, `github-copilot`, 또는 `editor` |
| `--no-interactive` | 프롬프트를 비활성화합니다; `--name`과 최소 하나의 `--link`가 필요합니다 |
| `--json` | JSON을 출력합니다; `--no-interactive`가 필요합니다 |

**예시:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

대화형 설정은 선호하는 오프너를 묻고 머신 로컬 워크스페이스 상태에 저장합니다. 비대화형 설정은 `--opener`가 제공될 때만 선호하는 오프너를 저장합니다; 그렇지 않으면 `workspace open`은 지원되는 오프너가 사용 가능한 경우 나중에 대화형 터미널에서 프롬프트를 표시하거나, 스크립트에게 `--agent <tool>` 또는 `--editor`를 전달하도록 요청합니다.

### `openspec workspace list`

로컬 레지스트리에서 알려진 OpenSpec 워크스페이스를 나열합니다.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

목록은 각 워크스페이스 위치와 연결된 저장소 또는 폴더를 보여줍니다. 오래된 레지스트리 기록은 보고되지만 변경되지는 않습니다.

### `openspec workspace link`

하나의 워크스페이스에 대해 기존 저장소 또는 폴더를 기록합니다.

```bash
openspec workspace link [name] <path> [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--workspace <name>` | 로컬 레지스트리에서 알려진 워크스페이스를 선택합니다 |
| `--json` | JSON을 출력합니다 |
| `--no-interactive` | 워크스페이스 선택기 프롬프트를 비활성화합니다 |

**예시:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

경로는 이미 존재해야 합니다. 상대 경로는 OpenSpec이 확인된 절대 경로를 머신 로컬 워크스페이스 상태에 저장하기 전에 명령어의 현재 디렉토리를 기준으로 해석됩니다. 연결된 경로는 저장소 로컬 `openspec/` 상태가 없는 전체 저장소, 패키지, 서비스, 앱 또는 폴더일 수 있습니다.

### `openspec workspace relink`

기존 연결의 로컬 경로를 복구하거나 변경합니다.

```bash
openspec workspace relink <name> <path> [options]
```

경로는 이미 존재해야 합니다. Relink는 안정적인 연결 이름에 대한 머신 로컬 경로만 업데이트합니다.

### `openspec workspace doctor`

현재 머신에서 하나의 워크스페이스가 무엇을 확인할 수 있는지 확인합니다.

```bash
openspec workspace doctor [options]
```

Doctor는 워크스페이스 위치, 계획 경로, 연결된 저장소 또는 폴더, 누락된 경로, 존재하는 경우 저장소 로컬 사양 경로 및 제안된 수정 사항을 보여줍니다. 문제만 보고하며 자동으로 복구하지는 않습니다.

하나의 워크스페이스가 필요한 명령어는 워크스페이스 폴더 또는 하위 디렉토리 내에서 실행될 때 현재 워크스페이스를 사용합니다. 다른 곳에서는 `--workspace <name>`을 전달하거나, 대화형 터미널에서 선택기에서 선택하거나, 정확히 하나만 존재하는 경우 알려진 유일한 워크스페이스에 의존합니다. `--json` 또는 `--no-interactive` 모드에서는 모호한 선택이 구조화된 상태 오류로 실패하고 `--workspace <name>`을 제안합니다.

JSON 응답은 유형화된 객체와 `status` 배열을 사용합니다. 기본 데이터는 `workspace`, `workspaces` 또는 `link`에 있고, 경고와 오류는 `status`에 있습니다.

### `openspec workspace open`

저장된 선호 오프너, 일회성 에이전트 재정의 또는 VS Code 에디터 모드를 통해 워크스페이스 작업 세트를 엽니다.

```bash
openspec workspace open [name] [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--workspace <name>` | 위치 인수 워크스페이스 이름의 별칭 |
| `--agent <tool>` | 일회성 에이전트 재정의: `codex`, `claude`, 또는 `github-copilot` |
| `--editor` | 유지 관리되는 VS Code 워크스페이스 파일을 일반 에디터 워크스페이스로 엽니다 |
| `--no-interactive` | 워크스페이스 및 오프너 선택기 프롬프트를 비활성화합니다 |

**예시:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open`은 내부에서 실행될 때 현재 워크스페이스를 사용하고, 다른 곳에서 실행될 때 알려진 유일한 워크스페이스를 자동 선택하며, 여러 워크스페이스가 알려진 경우 사용자에게 선택을 요청합니다. `--agent`와 `--editor`는 저장된 선호 오프너를 변경하지 않습니다. 두 오프너 재정의를 모두 전달하는 것은 오류이며; `--agent <tool>` 또는 `--editor` 중 하나를 선택하십시오.

OpenSpec은 VS Code 에디터 및 GitHub Copilot-in-VS-Code 열기를 위해 워크스페이스 루트에 `<workspace-name>.code-workspace`를 유지 관리합니다. 해당 파일은 머신 로컬이며 특정 `<workspace-name>.code-workspace` `.gitignore` 항목으로 기본적으로 무시되므로, 사용자가 작성한 `*.code-workspace` 파일은 추적 대상으로 남아 있습니다.

유지 관리되는 VS Code 워크스페이스에는 조정 루트가 `.`으로 포함되고, 유효한 연결된 저장소 또는 폴더가 추가 루트로 포함됩니다. VS Code는 해당 항목들을 다중 루트 워크스페이스로 표시합니다.

루트 워크스페이스 열기는 연결된 저장소 또는 폴더 전반에 걸친 탐색 및 계획을 지원합니다. 구현 편집은 명시적인 사용자 요청과 일반 OpenSpec 구현 워크플로우 후에만 시작해야 합니다.

---

## 탐색 명령어

### `openspec list`

프로젝트의 변경 사항 또는 사양을 나열합니다.

```
openspec list [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--specs` | 변경 사항 대신 사양을 나열합니다 |
| `--changes` | 변경 사항을 나열합니다 (기본값) |
| `--sort <order>` | `recent` (기본값) 또는 `name`으로 정렬합니다 |
| `--json` | JSON 형식으로 출력합니다 |

**예시:**

```bash
# 모든 활성 변경 사항을 나열합니다
openspec list

# 모든 사양을 나열합니다
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

사양과 변경 사항을 탐색하기 위한 대화형 대시보드를 표시합니다.

```
openspec view
```

프로젝트의 사양과 변경 사항을 탐색하기 위한 터미널 기반 인터페이스를 엽니다.

---

### `openspec show`

변경 사항 또는 사양의 세부 정보를 표시합니다.

```
openspec show [item-name] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `item-name` | 아니오 | 변경 사항 또는 사양의 이름 (생략 시 프롬프트 표시) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--type <type>` | 유형을 지정합니다: `change` 또는 `spec` (명확한 경우 자동 감지) |
| `--json` | JSON 형식으로 출력합니다 |
| `--no-interactive` | 프롬프트를 비활성화합니다 |

**변경 사항 전용 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--deltas-only` | 델타 사양만 표시합니다 (JSON 모드) |

**사양 전용 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--requirements` | 요구 사항만 표시하고 시나리오는 제외합니다 (JSON 모드) |
| `--no-scenarios` | 시나리오 내용을 제외합니다 (JSON 모드) |
| `-r, --requirement <id>` | 1부터 시작하는 인덱스로 특정 요구 사항을 표시합니다 (JSON 모드) |

**예시:**

```bash
# 대화형 선택
openspec show

# 특정 변경 사항을 표시합니다
openspec show add-dark-mode

# 특정 사양을 표시합니다
openspec show auth --type spec

# 구문 분석을 위한 JSON 출력
openspec show add-dark-mode --json
```

---

## 유효성 검사 명령어

### `openspec validate`

구조적 문제에 대한 변경 사항과 사양의 유효성을 검사합니다.

```
openspec validate [item-name] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `item-name` | 아니오 | 유효성을 검사할 특정 항목 (생략 시 프롬프트 표시) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--all` | 모든 변경 사항과 사양의 유효성을 검사합니다 |
| `--changes` | 모든 변경 사항의 유효성을 검사합니다 |
| `--specs` | 모든 사양의 유효성을 검사합니다 |
| `--type <type>` | 이름이 모호할 때 유형을 지정합니다: `change` 또는 `spec` |
| `--strict` | 엄격한 유효성 검사 모드를 활성화합니다 |
| `--json` | JSON 형식으로 출력합니다 |
| `--concurrency <n>` | 최대 병렬 유효성 검사 수 (기본값: 6, 또는 `OPENSPEC_CONCURRENCY` 환경 변수) |
| `--no-interactive` | 프롬프트를 비활성화합니다 |

**예시:**

```bash
# 대화형 유효성 검사
openspec validate

# 특정 변경 사항의 유효성을 검사합니다
openspec validate add-dark-mode

# 모든 변경 사항의 유효성을 검사합니다
openspec validate --changes

# 모든 항목의 유효성을 JSON 출력으로 검사합니다 (CI/스크립트용)
openspec validate --all --json

# 병렬 처리를 증가시킨 엄격한 유효성 검사
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

## 생명주기 명령어

### `openspec archive`

완료된 변경 사항을 아카이브하고 델타 사양을 주요 사양에 병합합니다.

```
openspec archive [change-name] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 아카이브할 변경 사항 (생략 시 프롬프트 표시) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `-y, --yes` | 확인 프롬프트 건너뛰기 |
| `--skip-specs` | 사양 업데이트 건너뛰기 (인프라/도구/문서 전용 변경 사항용) |
| `--no-validate` | 검증 건너뛰기 (확인 필요) |

**예시:**

```bash
# 대화형 아카이브
openspec archive

# 특정 변경 사항 아카이브
openspec archive add-dark-mode

# 프롬프트 없이 아카이브 (CI/스크립트)
openspec archive add-dark-mode --yes

# 사양에 영향을 주지 않는 도구 변경 사항 아카이브
openspec archive update-ci-config --skip-specs
```

**작동 방식:**

1. 변경 사항 검증 (`--no-validate`가 아닌 경우)
2. 확인 프롬프트 표시 (`--yes`가 아닌 경우)
3. 델타 사양을 `openspec/specs/`에 병합
4. 변경 폴더를 `openspec/changes/archive/YYYY-MM-DD-<name>/`로 이동

---

## 워크플로우 명령어

이 명령어들은 아티팩트 기반 OPSX 워크플로우를 지원합니다. 진행 상황을 확인하는 사람이나 다음 단계를 결정하는 에이전트 모두에게 유용합니다.

### `openspec status`

변경 사항의 아티팩트 완료 상태를 표시합니다.

```
openspec status [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--change <id>` | 변경 이름 (생략 시 프롬프트 표시) |
| `--schema <name>` | 스키마 재정의 (변경 사항의 설정에서 자동 감지) |
| `--json` | JSON으로 출력 |

**예시:**

```bash
# 대화형 상태 확인
openspec status

# 특정 변경 사항의 상태
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

아티팩트 생성 또는 작업 적용을 위한 풍부한 지침을 가져옵니다. AI 에이전트가 다음에 무엇을 생성해야 하는지 이해하는 데 사용됩니다.

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
| `--change <id>` | 변경 이름 (비대화형 모드에서 필수) |
| `--schema <name>` | 스키마 재정의 |
| `--json` | JSON으로 출력 |

**특수 경우:** 작업 구현 지침을 얻으려면 아티팩트로 `apply`를 사용하십시오.

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

**출력 포함 내용:**

- 아티팩트용 템플릿 내용
- 설정에서 가져온 프로젝트 컨텍스트
- 종속성 아티팩트의 내용
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
| `--json` | JSON으로 출력 |

**예시:**

```bash
# 기본 스키마의 템플릿 경로 표시
openspec templates

# 사용자 정의 스키마의 템플릿 표시
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

사용 가능한 워크플로우 스키마를 설명과 아티팩트 흐름과 함께 나열합니다.

```
openspec schemas [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--json` | JSON으로 출력 |

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

사용자 정의 워크플로우 스키마를 생성하고 관리하기 위한 명령어입니다.

### `openspec schema init`

새 프로젝트 로컬 스키마를 생성합니다.

```
openspec schema init <name> [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `name` | 예 | 스키마 이름 (kebab-case) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--description <text>` | 스키마 설명 |
| `--artifacts <list>` | 쉼표로 구분된 아티팩트 ID (기본값: `proposal,specs,design,tasks`) |
| `--default` | 프로젝트 기본 스키마로 설정 |
| `--no-default` | 기본값으로 설정하라는 프롬프트 표시 안 함 |
| `--force` | 기존 스키마 덮어쓰기 |
| `--json` | JSON으로 출력 |

**예시:**

```bash
# 대화형 스키마 생성
openspec schema init research-first

# 특정 아티팩트를 사용한 비대화형 방식
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
    ├── proposal.md       # 각 아티팩트용 템플릿
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

기존 스키마를 프로젝트에 복사하여 사용자 정의할 수 있습니다.

```
openspec schema fork <source> [name] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `source` | 예 | 복사할 스키마 |
| `name` | 아니오 | 새 스키마 이름 (기본값: `<source>-custom`) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--force` | 기존 대상 덮어쓰기 |
| `--json` | JSON으로 출력 |

**예시:**

```bash
# 내장된 spec-driven 스키마 포크
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

스키마의 구조와 템플릿을 검증합니다.

```
openspec schema validate [name] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `name` | 아니오 | 검증할 스키마 (생략 시 모든 스키마 검증) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--verbose` | 상세한 검증 단계 표시 |
| `--json` | JSON으로 출력 |

**예시:**

```bash
# 특정 스키마 검증
openspec schema validate my-workflow

# 모든 스키마 검증
openspec schema validate
```

---

### `openspec schema which`

스키마가 어디에서 해석되는지 표시합니다 (우선순위 디버깅에 유용).

```
openspec schema which [name] [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|----------|----------|-------------|
| `name` | 아니오 | 스키마 이름 |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--all` | 모든 스키마를 소스와 함께 나열 |
| `--json` | JSON으로 출력 |

**예시:**

```bash
# 스키마가 어디서 오는지 확인
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

## 구성 명령어

### `openspec config`

전역 OpenSpec 구성을 확인하고 수정합니다.

```
openspec config <subcommand> [options]
```

**하위 명령어:**

| 하위 명령어 | 설명 |
|------------|------|
| `path` | 구성 파일 위치 표시 |
| `list` | 현재 모든 설정 표시 |
| `get <key>` | 특정 값 가져오기 |
| `set <key> <value>` | 값 설정 |
| `unset <key>` | 키 제거 |
| `reset` | 기본값으로 초기화 |
| `edit` | `$EDITOR`에서 열기 |
| `profile [preset]` | 대화형 또는 프리셋을 통한 워크플로우 프로필 구성 |

**예시:**

```bash
# 구성 파일 경로 표시
openspec config path

# 모든 설정 나열
openspec config list

# 특정 값 가져오기
openspec config get telemetry.enabled

# 값 설정
openspec config set telemetry.enabled false

# 문자열 값을 명시적으로 설정
openspec config set user.name "My Name" --string

# 사용자 설정 제거
openspec config unset user.name

# 모든 구성 초기화
openspec config reset --all --yes

# 에디터에서 구성 편집
openspec config edit

# 기반 마법사를 사용한 프로필 구성
openspec config profile

# 빠른 프리셋: 워크플로우를 코어로 전환 (전달 모드 유지)
openspec config profile core
```

`openspec config profile`은 현재 상태 요약으로 시작한 후 다음을 선택할 수 있습니다:
- 전달 모드 + 워크플로우 변경
- 전달 모드만 변경
- 워크플로우만 변경
- 현재 설정 유지 (종료)

현재 설정을 유지하면 변경 사항이 기록되지 않으며 업데이트 프롬프트가 표시되지 않습니다.
구성 변경 사항이 없지만 현재 프로젝트 파일이 전역 프로필/전달 모드와 동기화되지 않은 경우, OpenSpec은 경고를 표시하고 `openspec update` 실행을 제안합니다.
`Ctrl+C`를 누르면 흐름이 깔끔하게 취소되고(스택 트레이스 없이) 코드 `130`으로 종료됩니다.
워크플로우 체크리스트에서 `[x]`는 해당 워크플로우가 전역 구성에서 선택되었음을 의미합니다. 이러한 선택을 프로젝트 파일에 적용하려면 `openspec update`를 실행하세요 (또는 프로젝트 내에서 프롬프트가 표시될 때 `이 프로젝트에 지금 변경 사항을 적용하시겠습니까?`를 선택하세요).

**대화형 예시:**

```bash
# 전달 모드만 업데이트
openspec config profile
# 선택: 전달 모드만 변경
# 전달 모드 선택: 스킬 전용

# 워크플로우만 업데이트
openspec config profile
# 선택: 워크플로우만 변경
# 체크리스트에서 워크플로우를 토글한 후 확인
```

---

## 유틸리티 명령어

### `openspec feedback`

OpenSpec에 대한 피드백을 제출합니다. GitHub 이슈를 생성합니다.

```
openspec feedback <message> [options]
```

**인수:**

| 인수 | 필수 | 설명 |
|------|------|------|
| `message` | 예 | 피드백 메시지 |

**옵션:**

| 옵션 | 설명 |
|------|------|
| `--body <text>` | 상세 설명 |

**요구 사항:** GitHub CLI (`gh`)가 설치되어 있고 인증되어 있어야 합니다.

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
|------------|------|
| `generate [shell]` | 자동 완성 스크립트를 표준 출력으로 출력 |
| `install [shell]` | 셸에 자동 완성 설치 |
| `uninstall [shell]` | 설치된 자동 완성 제거 |

**지원되는 셸:** `bash`, `zsh`, `fish`, `powershell`

**예시:**

```bash
# 자동 완성 설치 (셸 자동 감지)
openspec completion install

# 특정 셸용으로 설치
openspec completion install zsh

# 수동 설치용 스크립트 생성
openspec completion generate bash > ~/.bash_completion.d/openspec

# 제거
openspec completion uninstall
```

---

## 종료 코드

| 코드 | 의미 |
|------|------|
| `0` | 성공 |
| `1` | 오류 (유효성 검사 실패, 누락된 파일 등) |

---

## 환경 변수

| 변수 | 설명 |
|------|------|
| `OPENSPEC_TELEMETRY` | `0`으로 설정하면 원격 분석 비활성화 |
| `DO_NOT_TRACK` | `1`로 설정하면 원격 분석 비활성화 (표준 DNT 시그널) |
| `OPENSPEC_CONCURRENCY` | 대량 유효성 검사의 기본 동시성 (기본값: 6) |
| `EDITOR` 또는 `VISUAL` | `openspec config edit`용 에디터 |
| `NO_COLOR` | 설정 시 컬러 출력 비활성화 |

---

## 관련 문서

- [명령어](commands.md) - AI 슬래시 명령어 (`/opsx:propose`, `/opsx:apply` 등)
- [워크플로우](workflows.md) - 일반적인 패턴 및 각 명령어 사용 시기
- [사용자 정의](customization.md) - 사용자 정의 스키마 및 템플릿 만들기
- [시작하기](getting-started.md) - 초기 설정 가이드