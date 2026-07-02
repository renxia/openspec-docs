# 명령어 작동 방식

**알아야 할 한 가지: OpenSpec은 두 종류의 명령어를 가지고 있으며, 이들은 서로 다른 곳에서 실행됩니다.**

- `openspec ...` 명령어는 **터미널**에서 실행됩니다. (예: `openspec init`.)
- `/opsx:...` 명령어는 **AI 어시스턴트의 채팅창**에서 실행됩니다. (예: `/opsx:propose`.)

만약 터미널에 `/opsx:propose`를 입력했는데 아무 일도 일어나지 않는다면, 이 페이지가 그 이유입니다. 당신은 OpenSpec의 절반(half)과 대화하고 있는 것이 아닙니다. 슬래시 명령어는 터미널 명령어가 아닙니다. 그것들은 "로그인 폼 추가하기"라고 평소에 타이핑하는 곳에 입력하는 AI 코딩 어시스턴트에게 주는 지시사항입니다.

이 단 하나의 차이가 초보 사용자들에게 가장 흔한 걸림돌이므로, 명확하게 정리해 보겠습니다.

## 두 가지 측면 (The two halves)

OpenSpec은 두 가지 역할을 수행하는 하나의 프로젝트입니다.

**CLI (터미널 측면).** `openspec`이라는 프로그램으로, 사용자가 설치하여 쉘(shell)에서 실행합니다. 이 프로그램은 프로젝트를 설정하고, 변경 사항을 나열 및 검증하며, 대시보드를 표시하고, 완료된 작업을 보관합니다. 이는 iTerm, VS Code 터미널, PowerShell 등 `git`이나 `npm`을 실행하는 모든 곳에 입력할 수 있습니다.

```bash
openspec init        # 이 프로젝트에 OpenSpec 설정하기
openspec list        # 활성 변경 사항 보기
openspec view        # 대화형 대시보드 열기
```

**슬래시 명령어 (채팅 측면).** `/opsx:propose` 및 `/opsx:apply`와 같은 짧은 명령어로, AI 어시스턴트에게 입력합니다. 이들은 AI에게 OpenSpec 워크플로우를 따르도록 지시합니다: 제안서 초안 작성, 스펙 작성, 작업 목록 기반 빌드, 완료 시 보관. 이는 Claude Code, Cursor, Windsurf, Copilot 등 사용하는 어시스턴트에 입력합니다.

```text
/opsx:propose add-dark-mode    (AI 채팅에 입력)
/opsx:apply                    (AI 채팅에 입력)
/opsx:archive                  (AI 채팅에 입력)
```

다음은 하나의 그림으로 나타낸 사고 모델입니다.

```text
        당신의 터미널                         당신의 AI 어시스턴트 채팅
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   commands를    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  설치함        │  /opsx:apply                  │
   │  $ openspec view     │  ──────────►  │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        여기에 openspec 실행       여기서 /opsx:* 실행
```

화살표에 주목하십시오. 터미널에서 `openspec init`을 실행하는 것이 슬래시 명령어를 AI 도구에 *설치*하는 것입니다. 터미널 측면이 채팅 측면을 설정합니다. 그 후, 일상적인 작업은 대부분 채팅에서 이루어집니다.

## "대화형 모드를 어떻게 시작하나요?"

**별도의 대화형 모드는 없습니다.** 이 질문이 자주 나오기 때문에 명확하게 답변드립니다.

특별한 OpenSpec 모드에 진입하는 것이 아닙니다. 평소처럼 AI 코딩 어시스턴트를 열고 채팅창에 슬래시 명령어를 입력하기만 하면 됩니다. 슬래시 명령어 자체가 OpenSpec을 "진입"하는 방법입니다. 어시스턴트는 이를 인식하고, 해당되는 OpenSpec 스킬을 로드하며, 워크플로우를 따르기 시작합니다.

따라서 실제 지침은 다음과 같습니다:

1. 프로젝트에서 AI 코딩 어시스턴트(Claude Code, Cursor, Windsurf 등)를 엽니다.
2. 다른 어떤 요청을 입력하는 곳에나 마찬가지로 채팅창에 `/opsx:propose`를 입력합니다.
3. 자동 완성 기능을 확인하세요: OpenSpec이 설치되어 있다면, 슬래시를 타이핑할 때 `/opsx:propose`, `/opsx:apply` 등이 나타나는 것을 볼 수 있습니다.

그게 전부입니다. 토글할 모드도 없고, 실행할 데몬(daemon)도 없으며, 별도의 창도 없습니다.

진정으로 대화형인 한 가지는 터미널에 존재합니다: `openspec view`. 이는 스펙과 변경 사항을 탐색하기 위한 대시보드를 엽니다. 하지만 그것은 제안하고 빌드하는 도구가 아니라 보기(viewer)일 뿐입니다. 빌드는 채팅에서 슬래시 명령어를 통해 이루어집니다.

## 이러한 분할이 존재하는 이유

이는 OpenSpec이 25가지 이상의 다양한 AI 도구와 작동하는 이유를 설명하기 때문에 이해할 가치가 있습니다.

CLI는 **엔진**입니다. 그것은 규칙을 알고 있습니다: 변경 폴더가 어떤 모습이어야 하는지, 어떤 아티팩트가 무엇에 의존하는지, 델타 스펙(delta spec)을 진실의 원천(source of truth)에 병합하는 방법 등. 이는 어디서나 동일합니다.

슬래시 명령어는 **핸들(steering wheel)**이며, 모든 AI 도구마다 약간씩 다른 핸들을 가지고 있습니다. Claude Code는 이를 명령어로 부릅니다. Cursor와 Windsurf는 자체적인 형식을 가집니다. 일부 도구는 이를 스킬이라고 부릅니다. `openspec init`을 실행하면 OpenSpec은 선택한 각 도구에 맞는 올바른 종류의 파일을 생성하므로, 선호하는 어시스턴트가 무엇이든 동일한 `/opsx:propose` 의도가 작동합니다.

이 디자인의 강점은 다음과 같습니다: 워크플로우를 한 번 배우면 모든 도구에 적용할 수 있습니다. 단점은: 명령어의 정확한 구문이 도구마다 약간 다를 수 있다는 점이며, 이는 다음 섹션에서 다룹니다.

## 도구별 슬래시 명령어 구문

의도는 어디서나 동일합니다. 문법(punctuation)만 다릅니다. 사용자의 어시스턴트에 맞는 형식을 사용하십시오.

| Tool | How you type it |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | skill-style, e.g. `/skill:openspec-propose` |
| Trae | skill-style, e.g. `/openspec-propose` |

대부분의 도구는 콜론 형식(`/opsx:propose`) 또는 대시 형식(`/opsx-propose`)을 사용합니다. 일부 도구는 슬래시 명령어가 아닌 이름 있는 스킬(named skills)로 OpenSpec을 노출합니다. 이 경우, 해당 스킬 이름을 사용하여 호출해야 합니다. 어떤 파일이 어디에 작성되는지 정확히 포함된 전체 도구 목록은 [Supported Tools](supported-tools.md)를 참조하십시오.

의심스러울 때는 AI 채팅창에 슬래시를 입력하고 자동 완성 기능을 확인하십시오. 사용자의 도구가 기대하는 형식을 보여줄 것입니다.

## 명령어는 어떻게 생겼나: 스킬과 명령어 (skills and commands)

`openspec init`(또는 `openspec update`)을 실행하면, OpenSpec은 AI 도구가 워크플로우를 찾을 수 있도록 프로젝트 내부에 작은 파일들을 작성합니다. 사용자의 도구와 설정에 따라, 이들은 **스킬(skills)**이거나 **명령어(commands)**이거나 둘 다입니다.

- **Skills**는 `.claude/skills/openspec-*/SKILL.md`와 같은 곳에 존재합니다. 이는 떠오르는 크로스-툴 표준이며, 어시스턴트가 자동으로 감지하는 지침 폴더입니다.
- **Commands**는 `.claude/commands/opsx/<id>.md`와 같은 곳에 존재합니다. 이는 이전의 도구별 슬래시 명령어 파일입니다.

사용자가 어떤 것을 사용하는지는 신경 쓸 필요가 없습니다. 그냥 슬래시 명령어를 입력하면 작동합니다. 하지만 이러한 파일들이 존재한다는 것을 아는 것은 문제가 발생했을 때 도움이 됩니다: 만약 명령어들이 사라졌다면, 일반적으로 이 파일들이 누락되었거나 오래된 것이므로 `openspec update`를 실행하여 재생성해야 합니다.

도구별 정확한 경로에 대해서는 [Supported Tools](supported-tools.md)를, 스킬이 이전의 명령어 전용 접근 방식을 어떻게 대체했는지에 대해서는 [Migration Guide](migration-guide.md)를 참조하십시오.

## 설치 여부 확인하기 (Confirming it's installed)

빠른 점검, 가장 쉬운 것부터:

1. **AI 채팅창에 슬래시를 입력합니다.** `/opsx`를 타이핑하고 자동 완성 제안을 확인하세요. 나타난다면 준비된 것입니다.
2. **파일을 찾습니다.** Claude Code의 경우, `.claude/skills/` 안에 `openspec-*` 폴더가 있는지 확인하십시오. 다른 도구는 자체 디렉토리(이는 [Supported Tools](supported-tools.md)에 나열되어 있습니다)를 사용합니다.
3. **설정을 다시 실행합니다.** 프로젝트 루트에서 `openspec update`를 실행합니다. 이는 구성한 모든 도구에 대한 스킬 및 명령어 파일을 재생성합니다.
4. **어시스턴트를 재시작합니다.** 많은 도구가 시작 시점에 스킬과 명령어를 스캔하므로, 새 창을 여는 것이 누락된 단계를 보완할 수 있습니다.

## 어떤 명령어가 있나요? (Which commands do I even have?)

기본적으로 OpenSpec은 **핵심(core)** 슬래시 명령어 세트를 설치합니다:

- `/opsx:explore`: 변경 사항을 확정하기 전에 AI와 함께 아이디어를 구상해 보는 것 (확신이 없을 때 훌륭한 첫 단계)
- `/opsx:propose`: 변경 사항을 생성하고 모든 계획 아티팩트의 초안을 한 번에 작성합니다.
- `/opsx:apply`: 작업 목록을 거치며 변경 사항을 빌드합니다.
- `/opsx:sync`: 변경 사항의 스펙 업데이트를 메인 스펙에 병합합니다 (대부분 자동).
- `/opsx:archive`: 변경 사항을 완료하고 보관합니다.

좋은 기본 리듬은 다음과 같습니다: 무엇을 할지 파악할 때는 `explore`를, 그 다음에는 `propose`, `apply`, `archive` 순서입니다. [Explore First](explore.md) 가이드가 왜 이 첫 단계가 유용한지를 설명해 줍니다.

더 세밀한 제어를 원하는 사람들을 위한 **확장(expanded)** 세트도 있습니다 (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). 이는 `openspec config profile`로 활성화한 다음, `openspec update`로 적용합니다.

이 모든 것에 처음인가요? `/opsx:onboard`(확장 세트에 있음)는 사용자의 코드베이스를 따라 완전한 변경 과정을 안내하며 각 단계를 나레이션해 줍니다. 이것은 가장 친절한 소개입니다.

각 명령어가 무엇을 하는지에 대한 자세한 내용은 [Commands](commands.md)를, 언제 어떤 것을 사용해야 하는지는 [Workflows](workflows.md)를 참조하십시오.

## 깔끔한 첫 실행 (A clean first run)

모두를 종합하여, 각 단계가 어디서 발생하는지 레이블링한 전체 시퀀스를 보여드립니다.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (AI 도구에 슬래시 명령어를 설치합니다)

AI CHAT      /opsx:explore
              (선택 사항: AI와 함께 아이디어를 구상합니다)

AI CHAT      /opsx:propose add-dark-mode
              (AI가 제안서, 스펙, 디자인, 작업을 초안 작성합니다)

AI CHAT      /opsx:apply
              (AI가 작업 목록을 확인하며 빌드합니다)

AI CHAT      /opsx:archive
              (변경 사항이 스펙에 병합되고 보관됩니다)
```

설정을 위한 두 가지 터미널 단계. 그 후에는 채팅에서 작업을 진행하게 됩니다. 이것이 리듬입니다.

## 관련 자료 (Related)

- [Getting Started](getting-started.md): 전체 첫 변경 사항 워크스루
- [Commands](commands.md): 모든 슬래시 명령어에 대한 상세 정보
- [CLI](cli.md): 모든 터미널 명령어에 대한 상세 정보
- [Supported Tools](supported-tools.md): 도구별 구문 및 파일 위치
- [FAQ](faq.md): 더 많은 빠른 답변
- [Troubleshooting](troubleshooting.md): 명령어가 표시되지 않을 때의 해결 방법