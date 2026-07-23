# 지원되는 도구

OpenSpec은 다양한 AI 코딩 어시스턴트와 함께 작동합니다. `openspec init`을 실행하면 OpenSpec은 활성 프로필/워크플로 선택 및 전달 모드를 사용하여 선택한 도구를 구성합니다.

## 작동 원리

각 선택한 도구에 대해 OpenSpec은 다음을 설치할 수 있습니다:
1. **스킬** (전달에 스킬이 포함된 경우): `.../skills/openspec-*/SKILL.md`
2. **명령** (전달에 명령이 포함된 경우): 도구별 `opsx-*` 명령 파일

Codex는 스킬만 지원합니다: 전달 모드가 `commands`로 설정되어 있어도 OpenSpec은 Codex에 대해 `.codex/skills/openspec-*/SKILL.md`를 설치하며, Codex 사용자 정의 프롬프트 파일은 생성하지 않습니다.

기본적으로 OpenSpec은 다음을 포함하는 `core` 프로필을 사용합니다:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

`openspec config profile`을 통해 확장 워크플로(`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`)를 활성화한 다음 `openspec update`를 실행할 수 있습니다.

## 도구 디렉터리 참조

| 도구 (ID) | 스킬 경로 패턴 | 명령 경로 패턴 |
|-----------|----------------|----------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | 생성되지 않음 (명령 어댑터가 없음; 스킬 기반 `/openspec-*` 호출 사용) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | 생성되지 않음 (스킬만 지원; `.codex/skills/openspec-*` 사용) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 생성되지 않음 (명령 어댑터가 없음; 스킬 기반 `/openspec-*` 호출 사용) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | 생성되지 않음 (명령 어댑터가 없음; 스킬 기반 `/openspec-*` 호출 사용) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | 생성되지 않음 (명령 어댑터가 없음; 스킬 기반 `/skill:openspec-*` 호출 사용) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | 생성되지 않음 (명령 어댑터가 없음; 스킬 기반 `/openspec-*` 호출 사용) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* GitHub Copilot 프롬프트 파일은 IDE 확장 프로그램(VS Code, JetBrains, Visual Studio)에서 사용자 정의 슬래시 명령으로 인식됩니다. Copilot CLI는 현재 `.github/prompts/*.prompt.md`를 직접 사용하지 않습니다.

\*\*\* Hermes는 기본적으로 `~/.hermes/skills/`에서 스킬을 로드합니다. 프로젝트 로컬 OpenSpec 스킬을 사용하려면 프로젝트 `.hermes/skills/` 디렉터리를 `~/.hermes/config.yaml`의 `skills.external_dirs`에 추가하세요. 그러면 Hermes는 `/openspec-propose`와 같은 사용자 대상 슬래시 호출로 스킬을 노출합니다.

## 비대화형 설정

CI/CD 또는 스크립트 기반 설정의 경우 `--tools` (선택적으로 `--profile`과 함께)를 사용하세요:

```bash
# 특정 도구 구성
openspec init --tools claude,cursor

# 지원되는 모든 도구 구성
openspec init --tools all

# 도구 구성 건너뛰기
openspec init --tools none

# 이 init 실행에 대한 프로필 재정의
openspec init --profile core
```

**사용 가능한 도구 ID (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## 워크플로 의존적 설치

OpenSpec은 선택한 워크플로를 기반으로 워크플로 아티팩트를 설치합니다:
- **코어 프로필 (기본값):** `propose`, `explore`, `apply`, `sync`, `archive`
- **사용자 정의 선택:** 모든 워크플로 ID의 하위 집합: `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

즉, 스킬/명령 수는 프로필과 전달 모드에 따라 달라지며 고정되어 있지 않습니다.

## 생성되는 스킬 이름

프로필/워크플로 구성에 의해 선택되면 OpenSpec은 다음 스킬을 생성합니다:
- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

명령 동작은 [Commands](commands.md)를, `init`/`update` 옵션은 [CLI](cli.md)를 참조하세요.

## 관련 항목

- [CLI 참조](cli.md) — 터미널 명령
- [Commands](commands.md) — 슬래시 명령 및 스킬
- [시작하기](getting-started.md) — 첫 설정