# CLI 참조

OpenSpec CLI(`openspec`)는 프로젝트 설정, 유효성 검사, 상태 점검 및 관리를 위한 터미널 명령어를 제공합니다. 이 명령어들은 [명령어](commands.md)에 문서화된 AI 슬래시 명령어(예: `/opsx:propose`)를 보완합니다.

## 요약

| 카테고리 | 명령어 | 목적 |
|----------|----------|---------|
| **설정** | `init`, `update` | 프로젝트에서 OpenSpec을 초기화하고 업데이트합니다 |
| **탐색** | `list`, `view`, `show` | 변경 사항 및 사양을 탐색합니다 |
| **유효성 검사** | `validate` | 변경 사항 및 사양의 문제를 확인합니다 |
| **수명 주기** | `archive` | 완료된 변경 사항을 마무리합니다 |
| **워크플로우** | `status`, `instructions`, `templates`, `schemas` | 아티팩트 기반 워크플로우 지원 |
| **스키마** | `schema init`, `schema fork`, `schema validate`, `schema which` | 사용자 정의 워크플로우를 생성하고 관리합니다 |
| **설정** | `config` | 설정을 보고 수정합니다 |
| **유틸리티** | `feedback`, `completion` | 피드백 및 셸 통합 |

---

## 사람 대 에이전트 명령어

대부분의 CLI 명령어는 터미널에서 **사람이 사용**하도록 설계되었습니다. 일부 명령어는 JSON 출력을 통해 **에이전트/스크립트 사용**도 지원합니다.

### 사람 전용 명령어

이 명령어들은 대화형이며 터미널 사용을 위해 설계되었습니다:

| 명령어 | 용도 |
|---------|---------|
| `openspec init` | 프로젝트 초기화 (대화형 프롬프트) |
| `openspec view` | 대화형 대시보드 |
| `openspec config edit` | 편집기에서 설정 열기 |
| `openspec feedback` | GitHub를 통해 피드백 제출 |
| `openspec completion install` | 셸 자동 완성 설치 |

### 에이전트 호환 명령어

이 명령어들은 AI 에이전트 및 스크립트의 프로그래밍 방식 사용을 위해 `--json` 출력을 지원합니다:

| 명령어 | 사람 사용 | 에이전트 사용 |
|---------|-----------|-----------|
| `openspec list` | 변경 사항/스펙 탐색 | 구조화된 데이터를 위한 `--json` |
| `openspec show <item>` | 내용 읽기 | 구문 분석을 위한 `--json` |
| `openspec validate` | 문제 확인 | 대량 검증을 위한 `--all --json` |
| `openspec status` | 산출물 진행 상황 확인 | 구조화된 상태를 위한 `--json` |
| `openspec instructions` | 다음 단계 가져오기 | 에이전트 지침을 위한 `--json` |
| `openspec templates` | 템플릿 경로 찾기 | 경로 확인을 위한 `--json` |
| `openspec schemas` | 사용 가능한 스키마 나열 | 스키마 발견을 위한 `--json` |

---

## 전역 옵션

이 옵션들은 모든 명령어와 함께 작동합니다:

| 옵션 | 설명 |
|--------|-------------|
| `--version`, `-V` | 버전 번호 표시 |
| `--no-color` | 색상 출력 비활성화 |
| `--help`, `-h` | 명령어에 대한 도움말 표시 |

---

## 설정 명령어

### `openspec init`

프로젝트에서 OpenSpec을 초기화합니다. 폴더 구조를 생성하고 AI 도구 통합을 구성합니다.

기본 동작은 전역 설정 기본값을 사용합니다: 프로필 `core`, 전달 `both`, 워크플로 `propose, explore, apply, archive`.

```
openspec init [path] [options]
```

**인자:**

| 인자 | 필수 | 설명 |
|----------|----------|-------------|
| `path` | 아니오 | 대상 디렉토리 (기본값: 현재 디렉토리) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--tools <list>` | 비대화형으로 AI 도구를 구성합니다. `all`, `none` 또는 쉼표로 구분된 목록 사용 |
| `--force` | 확인 없이 레거시 파일을 자동 정리합니다 |
| `--profile <profile>` | 이번 초기화 실행에 대한 전역 프로필 재정의 (`core` 또는 `custom`) |

`--profile custom`은 전역 설정(`openspec config profile`)에서 현재 선택된 워크플로를 사용합니다.

**지원되는 도구 ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

**예시:**

```bash
# 대화형 초기화
openspec init

# 특정 디렉토리에서 초기화
openspec init ./my-project

# 비대화형: Claude 및 Cursor를 위해 구성
openspec init --tools claude,cursor

# 모든 지원되는 도구를 위해 구성
openspec init --tools all

# 이번 실행에 대한 프로필 재정의
openspec init --profile core

# 프롬프트 건너뛰고 레거시 파일 자동 정리
openspec init --force
```

**생성되는 내용:**

```
openspec/
├── specs/              # 스펙 (진실의 원본)
├── changes/            # 제안된 변경 사항
└── config.yaml         # 프로젝트 설정

.claude/skills/         # Claude Code 스킬 (claude 선택 시)
.cursor/skills/         # Cursor 스킬 (cursor 선택 시)
.cursor/commands/       # Cursor OPSX 명령어 (전달에 명령어 포함 시)
... (기타 도구 설정)
```

---

### `openspec update`

CLI를 업그레이드한 후 OpenSpec 지침 파일을 업데이트합니다. 현재 전역 프로필, 선택된 워크플로 및 전달 모드를 사용하여 AI 도구 구성 파일을 다시 생성합니다.

```
openspec update [path] [options]
```

**인자:**

| 인자 | 필수 | 설명 |
|----------|----------|-------------|
| `path` | 아니오 | 대상 디렉토리 (기본값: 현재 디렉토리) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--force` | 파일이 최신 상태라도 강제로 업데이트합니다 |

**예시:**

```bash
# npm 업그레이드 후 지침 파일 업데이트
npm update @fission-ai/openspec
openspec update
```

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
| `--sort <order>` | `recent` (기본값) 또는 `name`으로 정렬 |
| `--json` | JSON으로 출력 |

**예시:**

```bash
# 모든 활성 변경 사항 나열
openspec list

# 모든 스펙 나열
openspec list --specs

# 스크립트용 JSON 출력
openspec list --json
```

**출력 (텍스트):**

```
활성 변경 사항:
  add-dark-mode     UI 테마 전환 지원
  fix-login-bug     세션 타임아웃 처리
```

---

### `openspec view`

스펙과 변경 사항을 탐색하기 위한 대화형 대시보드를 표시합니다.

```
openspec view
```

프로젝트의 스펙과 변경 사항을 탐색하기 위한 터미널 기반 인터페이스를 엽니다.

---

### `openspec show`

변경 사항 또는 스펙의 세부 정보를 표시합니다.

```
openspec show [item-name] [options]
```

**인자:**

| 인자 | 필수 | 설명 |
|----------|----------|-------------|
| `item-name` | 아니오 | 변경 사항 또는 스펙의 이름 (생략 시 프롬프트 표시) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--type <type>` | 유형 지정: `change` 또는 `spec` (명확하지 않으면 자동 감지) |
| `--json` | JSON으로 출력 |
| `--no-interactive` | 프롬프트 비활성화 |

**변경 사항 관련 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--deltas-only` | 델타 스펙만 표시 (JSON 모드) |

**스펙 관련 옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--requirements` | 요구 사항만 표시, 시나리오 제외 (JSON 모드) |
| `--no-scenarios` | 시나리오 내용 제외 (JSON 모드) |
| `-r, --requirement <id>` | 1부터 시작하는 인덱스로 특정 요구 사항 표시 (JSON 모드) |

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

## 검증 명령어

### `openspec validate`

변경 사항 및 스펙의 구조적 문제를 검증합니다.

```
openspec validate [item-name] [options]
```

**인자:**

| 인자 | 필수 | 설명 |
|----------|----------|-------------|
| `item-name` | 아니오 | 검증할 특정 항목 (생략 시 프롬프트 표시) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--all` | 모든 변경 사항 및 스펙 검증 |
| `--changes` | 모든 변경 사항 검증 |
| `--specs` | 모든 스펙 검증 |
| `--type <type>` | 이름이 명확하지 않을 때 유형 지정: `change` 또는 `spec` |
| `--strict` | 엄격한 검증 모드 활성화 |
| `--json` | JSON으로 출력 |
| `--concurrency <n>` | 최대 병렬 검증 수 (기본값: 6 또는 `OPENSPEC_CONCURRENCY` 환경 변수) |
| `--no-interactive` | 프롬프트 비활성화 |

**예시:**

```bash
# 대화형 검증
openspec validate

# 특정 변경 사항 검증
openspec validate add-dark-mode

# 모든 변경 사항 검증
openspec validate --changes

# 모든 항목을 JSON 출력으로 검증 (CI/스크립트용)
openspec validate --all --json

# 병렬성을 높인 엄격한 검증
openspec validate --all --strict --concurrency 12
```

**출력 (텍스트):**

```
add-dark-mode 검증 중...
  ✓ proposal.md 유효
  ✓ specs/ui/spec.md 유효
  ⚠ design.md: "Technical Approach" 섹션 누락

경고 1개 발견
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
        "warnings": ["design.md: 'Technical Approach' 섹션 누락"]
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

완료된 변경 사항을 보관하고 델타 스펙을 메인 스펙에 병합합니다.

```
openspec archive [change-name] [options]
```

**인자:**

| 인자 | 필수 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니오 | 보관할 변경 사항 (생략 시 프롬프트 표시) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `-y, --yes` | 확인 프롬프트 건너뛰기 |
| `--skip-specs` | 스펙 업데이트 건너뛰기 (인프라/도구/문서 전용 변경 사항용) |
| `--no-validate` | 검증 건너뛰기 (확인 필요) |

**예시:**

```bash
# 대화형 보관
openspec archive

# 특정 변경 사항 보관
openspec archive add-dark-mode

# 프롬프트 없이 보관 (CI/스크립트용)
openspec archive add-dark-mode --yes

# 스펙에 영향을 미치지 않는 도구 변경 사항 보관
openspec archive update-ci-config --skip-specs
```

**작동 방식:**

1. 변경 사항을 검증합니다 (`--no-validate`가 없는 경우)
2. 확인을 요청합니다 (`--yes`가 없는 경우)
3. 델타 스펙을 `openspec/specs/`에 병합합니다
4. 변경 사항 폴더를 `openspec/changes/archive/YYYY-MM-DD-<name>/`로 이동합니다

---

## 워크플로 명령어

이 명령어들은 산출물 기반 OPSX 워크플로를 지원합니다. 진행 상황을 확인하는 사람과 다음 단계를 결정하는 에이전트 모두에게 유용합니다.

### `openspec status`

변경 사항의 산출물 완료 상태를 표시합니다.

```
openspec status [options]
```

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--change <id>` | 변경 사항 이름 (생략 시 프롬프트 표시) |
| `--schema <name>` | 스키마 재정의 (변경 사항의 설정에서 자동 감지) |
| `--json` | JSON으로 출력 |

**예시:**

```bash
# 대화형 상태 확인
openspec status

# 특정 변경 사항 상태
openspec status --change add-dark-mode

# 에이전트 사용용 JSON
openspec status --change add-dark-mode --json
```

**출력 (텍스트):**

```
변경 사항: add-dark-mode
스키마: spec-driven
진행 상황: 산출물 2/4 완료

[x] proposal
[ ] design
[x] specs
[-] tasks (차단됨: design)
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

산출물을 생성하거나 작업을 적용하기 위한 풍부한 지침을 가져옵니다. AI 에이전트가 다음에 무엇을 만들어야 하는지 이해하는 데 사용됩니다.

```
openspec instructions [artifact] [options]
```

**인자:**

| 인자 | 필수 | 설명 |
|----------|----------|-------------|
| `artifact` | 아니오 | 산출물 ID: `proposal`, `specs`, `design`, `tasks` 또는 `apply` |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--change <id>` | 변경 사항 이름 (비대화형 모드에서 필수) |
| `--schema <name>` | 스키마 재정의 |
| `--json` | JSON으로 출력 |

**특수 경우:** 작업 구현 지침을 얻으려면 `apply`를 산출물로 사용합니다.

**예시:**

```bash
# 다음 산출물에 대한 지침 가져오기
openspec instructions --change add-dark-mode

# 특정 산출물 지침 가져오기
openspec instructions design --change add-dark-mode

# 적용/구현 지침 가져오기
openspec instructions apply --change add-dark-mode

# 에이전트 사용용 JSON
openspec instructions design --change add-dark-mode --json
```

**출력에 포함되는 내용:**

- 산출물에 대한 템플릿 내용
- 설정에서 가져온 프로젝트 컨텍스트
- 종속 산출물의 내용
- 설정에서 가져온 산출물별 규칙

---

### `openspec templates`

스키마의 모든 산출물에 대한 확인된 템플릿 경로를 표시합니다.

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

# 사용자 지정 스키마의 템플릿 표시
openspec templates --schema my-workflow

# 프로그래밍 방식 사용용 JSON
openspec templates --json
```

**출력 (텍스트):**

```
스키마: spec-driven

템플릿:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

설명 및 산출물 흐름과 함께 사용 가능한 워크플로 스키마를 나열합니다.

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
사용 가능한 스키마:

  spec-driven (패키지)
    기본 스키마 기반 개발 워크플로
    흐름: proposal → specs → design → tasks

  my-custom (프로젝트)
    이 프로젝트의 사용자 지정 워크플로
    흐름: research → proposal → tasks
```

---

## 스키마 명령어

커스텀 워크플로우 스키마를 생성하고 관리하는 명령어입니다.

### `openspec schema init`

새로운 프로젝트 로컬 스키마를 생성합니다.

```
openspec schema init <name> [options]
```

**인자:**

| 인자 | 필수 | 설명 |
|----------|----------|-------------|
| `name` | 예 | 스키마 이름 (kebab-case) |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--description <text>` | 스키마 설명 |
| `--artifacts <list>` | 쉼표로 구분된 아티팩트 ID (기본값: `proposal,specs,design,tasks`) |
| `--default` | 프로젝트 기본 스키마로 설정 |
| `--no-default` | 기본값으로 설정할지 묻지 않음 |
| `--force` | 기존 스키마 덮어쓰기 |
| `--json` | JSON 형식으로 출력 |

**예시:**

```bash
# 대화형 스키마 생성
openspec schema init research-first

# 특정 아티팩트를 지정한 비대화형 생성
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**생성되는 파일:**

```
openspec/schemas/<name>/
├── schema.yaml           # 스키마 정의
└── templates/
    ├── proposal.md       # 각 아티팩트에 대한 템플릿
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

기존 스키마를 프로젝트로 복사하여 커스터마이징합니다.

```
openspec schema fork <source> [name] [options]
```

**인자:**

| 인자 | 필수 | 설명 |
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
# 내장 스펙 기반 스키마를 포크
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

스키마의 구조와 템플릿을 검증합니다.

```
openspec schema validate [name] [options]
```

**인자:**

| 인자 | 필수 | 설명 |
|----------|----------|-------------|
| `name` | 아니오 | 검증할 스키마 (생략 시 모든 스키마 검증) |

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

스키마가 어디서 해석되는지 표시합니다 (우선 순위 디버깅에 유용).

```
openspec schema which [name] [options]
```

**인자:**

| 인자 | 필수 | 설명 |
|----------|----------|-------------|
| `name` | 아니오 | 스키마 이름 |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
| `--all` | 모든 스키마와 그 출처를 나열 |
| `--json` | JSON 형식으로 출력 |

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

전역 OpenSpec 설정을 확인하고 수정합니다.

```
openspec config <subcommand> [options]
```

**서브명령어:**

| 서브명령어 | 설명 |
|------------|-------------|
| `path` | 설정 파일 위치 표시 |
| `list` | 현재 모든 설정 표시 |
| `get <key>` | 특정 값 가져오기 |
| `set <key> <value>` | 값 설정 |
| `unset <key>` | 키 제거 |
| `reset` | 기본값으로 재설정 |
| `edit` | `$EDITOR`에서 열기 |
| `profile [preset]` | 대화형으로 또는 프리셋을 통해 워크플로우 프로필 설정 |

**예시:**

```bash
# 설정 파일 경로 표시
openspec config path

# 모든 설정 나열
openspec config list

# 특정 값 가져오기
openspec config get telemetry.enabled

# 값 설정
openspec config set telemetry.enabled false

# 문자열 값 명시적 설정
openspec config set user.name "My Name" --string

# 커스텀 설정 제거
openspec config unset user.name

# 모든 설정 재설정
openspec config reset --all --yes

# 편집기에서 설정 편집
openspec config edit

# 프로필 설정 (대화형)
openspec config profile

# 빠른 프리셋: 워크플로우를 core로 전환 (전달 모드 유지)
openspec config profile core
```

`openspec config profile`은 현재 상태 요약으로 시작한 후 선택할 수 있는 옵션을 제공합니다:
- 전달 방식 + 워크플로우 변경
- 전달 방식만 변경
- 워크플로우만 변경
- 현재 설정 유지 (종료)

현재 설정을 유지하면 변경 사항이 기록되지 않으며 업데이트 프롬프트가 표시되지 않습니다.
설정 변경이 없지만 현재 프로젝트 파일이 전역 프로필/전달 모드와 동기화되지 않은 경우, OpenSpec은 경고를 표시하고 `openspec update` 실행을 제안합니다.
`Ctrl+C`를 눌러도 흐름이 깔끔하게 취소됩니다 (스택 트레이스 없음) 및 종료 코드 `130`로 종료됩니다.
워크플로우 체크리스트에서 `[x]`는 전역 설정에서 해당 워크플로우가 선택되었음을 의미합니다. 이러한 선택 사항을 프로젝트 파일에 적용하려면 `openspec update`를 실행하거나 (프로젝트 내에서 프롬프트가 표시될 때) `Apply changes to this project now?`를 선택하십시오.

**대화형 예시:**

```bash
# 전달 방식만 업데이트
openspec config profile
# 선택: Change delivery only
# 전달 방식 선택: Skills only

# 워크플로우만 업데이트
openspec config profile
# 선택: Change workflows only
# 체크리스트에서 워크플로우를 토글한 후 확인
```

---

## 유틸리티 명령어

### `openspec feedback`

OpenSpec에 대한 피드백을 제출합니다. GitHub 이슈를 생성합니다.

```
openspec feedback <message> [options]
```

**인자:**

| 인자 | 필수 | 설명 |
|----------|----------|-------------|
| `message` | 예 | 피드백 메시지 |

**옵션:**

| 옵션 | 설명 |
|--------|-------------|
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

**서브명령어:**

| 서브명령어 | 설명 |
|------------|-------------|
| `generate [shell]` | 완성 스크립트를 표준 출력으로 출력 |
| `install [shell]` | 셸에 자동 완성 설치 |
| `uninstall [shell]` | 설치된 자동 완성 제거 |

**지원되는 셸:** `bash`, `zsh`, `fish`, `powershell`

**예시:**

```bash
# 자동 완성 설치 (셸 자동 감지)
openspec completion install

# 특정 셸에 설치
openspec completion install zsh

# 수동 설치용 스크립트 생성
openspec completion generate bash > ~/.bash_completion.d/openspec

# 제거
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
| `OPENSPEC_TELEMETRY` | `0`으로 설정하면 원격 분석 비활성화 |
| `DO_NOT_TRACK` | `1`로 설정하면 원격 분석 비활성화 (표준 DNT 신호) |
| `OPENSPEC_CONCURRENCY` | 대량 검증 시 기본 동시성 (기본값: 6) |
| `EDITOR` 또는 `VISUAL` | `openspec config edit`에 사용할 편집기 |
| `NO_COLOR` | 설정 시 색상 출력 비활성화 |

---

## 관련 문서

- [명령어](commands.md) - AI 슬래시 명령어 (`/opsx:propose`, `/opsx:apply` 등)
- [워크플로우](workflows.md) - 일반적인 패턴과 각 명령어 사용 시점
- [커스터마이징](customization.md) - 커스텀 스키마 및 템플릿 생성
- [시작하기](getting-started.md) - 첫 설정 가이드