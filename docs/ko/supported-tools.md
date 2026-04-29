# 지원되는 도구

OpenSpec는 다양한 AI 코딩 어시스턴트와 함께 작동합니다. `openspec init`를 실행하면, OpenSpec은 활성 프로필/워크플로 선택 및 전달 모드를 사용하여 선택된 도구를 구성합니다.

## 작동 방식

각 선택된 도구에 대해 OpenSpec은 다음을 설치할 수 있습니다:

1. **스킬** (전달에 스킬이 포함된 경우): `.../skills/openspec-*/SKILL.md`
2. **명령어** (전달에 명령어가 포함된 경우): 도구별 `opsx-*` 명령어 파일

기본적으로 OpenSpec은 다음을 포함하는 `core` 프로필을 사용합니다:
- `propose`
- `explore`
- `apply`
- `archive`

`openspec config profile`을 통해 확장된 워크플로(`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`)를 활성화한 다음, `openspec update`를 실행할 수 있습니다.

## 도구 디렉토리 참조

| 도구 (ID) | 스킬 경로 패턴 | 명령어 경로 패턴 |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 생성되지 않음 (명령어 어댑터 없음; 스킬 기반 `/openspec-*` 호출 사용) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | 생성되지 않음 (명령어 어댑터 없음; 스킬 기반 `/openspec-*` 호출 사용) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Codex 명령어는 전역 Codex 홈(`$CODEX_HOME/prompts/`가 설정된 경우, 그렇지 않으면 `~/.codex/prompts/`)에 설치되며, 프로젝트 디렉토리에는 설치되지 않습니다.

\*\* GitHub Copilot 프롬프트 파일은 IDE 확장 프로그램(VS Code, JetBrains, Visual Studio)에서 사용자 정의 슬래시 명령어로 인식됩니다. Copilot CLI는 현재 `.github/prompts/*.prompt.md`를 직접 사용하지 않습니다.

## 비대화형 설정

CI/CD 또는 스크립트 설정의 경우, `--tools`를 사용하고 선택적으로 `--profile`을 사용합니다:

```bash
# 특정 도구 구성
openspec init --tools claude,cursor

# 지원되는 모든 도구 구성
openspec init --tools all

# 도구 구성 건너뛰기
openspec init --tools none

# 이번 init 실행에 대한 프로필 재정의
openspec init --profile core
```

**사용 가능한 도구 ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `forgecode`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## 워크플로 기반 설치

OpenSpec은 선택된 워크플로에 따라 워크플로 아티팩트를 설치합니다:

- **Core 프로필 (기본값):** `propose`, `explore`, `apply`, `archive`
- **사용자 정의 선택:** 모든 워크플로 ID의 임의 하위 집합:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

즉, 스킬/명령어 수는 프로필 및 전달 방식에 따라 달라지며, 고정되어 있지 않습니다.

## 생성된 스킬 이름

프로필/워크플로 구성에 의해 선택될 때, OpenSpec은 다음 스킬을 생성합니다:

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

명령어 동작은 [명령어](commands.md)를, `init`/`update` 옵션은 [CLI](cli.md)를 참조하십시오.

## 관련 문서

- [CLI 참조](cli.md) — 터미널 명령어
- [명령어](commands.md) — 슬래시 명령어 및 스킬
- [시작하기](getting-started.md) — 첫 설정