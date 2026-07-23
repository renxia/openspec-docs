# 명령어 작동 원리

**알아야 할 가장 중요한 점: OpenSpec에는 두 가지 종류의 명령어가 있으며, 각각 서로 다른 두 곳에서 실행됩니다.**

- `openspec ...` 명령어는 **터미널**에서 실행됩니다. (예: `openspec init`.)
- `/opsx:...` 명령어는 **AI 어시스턴트의 채팅**에서 실행됩니다. (예: `/opsx:propose`.)

만약 터미널에 `/opsx:propose`를 입력했는데 아무 반응이 없다면, 이 문서가 그 이유를 설명해드립니다. 여러분은 OpenSpec의 잘못된 부분과 상호작용하고 있는 것입니다. 슬래시 명령어는 터미널 명령어가 아닙니다. 이는 AI 코딩 어시스턴트에게 주는 지시로, 보통 "로그인 폼 추가하기"와 같은 요청을 입력하는 바로 그 채팅 입력창에 입력하는 것입니다.

이 구분은 신규 사용자가 가장 많이 겪는 혼란의 원인이므로, 명확히 설명해드리겠습니다.

## 두 가지 구성 요소

OpenSpec는 두 가지 역할을 수행하는 하나의 프로젝트입니다.

**CLI (터미널 부분)**. 쉘에서 설치하고 실행하는 `openspec`라는 이름의 프로그램입니다. 프로젝트를 설정하고, 변경 사항을 나열 및 검증하며, 대시보드를 표시하고 완료된 작업을 아카이브합니다. `git`이나 `npm`을 실행하는 어디서든, iTerm, VS Code 터미널, PowerShell 등에 이 명령어를 입력하면 됩니다.

```bash
openspec init        # 이 프로젝트에 OpenSpec 설정
openspec list        # 활성 변경 사항 확인
openspec view        # 인터랙티브 대시보드 열기
```

**슬래시 명령어 (채팅 부분)**. `/opsx:propose`, `/opsx:apply` 등 AI 어시스턴트에 입력하는 짧은 명령어입니다. 이 명령어는 AI에게 OpenSpec 워크플로우를 따르도록 지시합니다: 제안 초안 작성, 스펙 작성, 작업 목록 기반 빌드, 완료 후 아카이브. Claude Code, Cursor, Windsurf, Copilot 등 사용하는 어시스턴트 어디에나 입력할 수 있습니다.

```text
/opsx:propose add-dark-mode    (AI 채팅에 입력)
/opsx:apply                    (AI 채팅에 입력)
/opsx:archive                  (AI 채팅에 입력)
```

이 구조를 한 그림으로 표현하면 다음과 같습니다:

```text
        YOUR TERMINAL                         YOUR AI ASSISTANT'S CHAT
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installs    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   commands    │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        run openspec here                       run /opsx:* here
```

화살표를 주목하세요. 터미널에서 `openspec init`을 실행하는 것이 AI 도구에 슬래시 명령어를 *설치*하는 과정입니다. 터미널 부분이 채팅 부분을 설정합니다. 이후 일상적인 작업은 대부분 채팅에서 이루어집니다.

## "인터랙티브 모드는 어떻게 시작하나요?"

**별도의 인터랙티브 모드를 시작할 필요가 없습니다.** 이 질문이 매우 많이 나오므로 명확한 답변을 드리겠습니다.

별도의 OpenSpec 모드에 진입할 필요가 없습니다. 평소처럼 AI 코딩 어시스턴트를 열고 채팅에 슬래시 명령어를 입력하기만 하면 됩니다. 슬래시 명령어가 바로 OpenSpec에 "진입"하는 방법입니다. 어시스턴트가 해당 명령어를 인식하면, 일치하는 OpenSpec 스킬을 불러와 워크플로우를 따르기 시작합니다.

따라서 실제로 해야 할 단계는 다음과 같습니다:

1. 프로젝트에서 AI 코딩 어시스턴트(Claude Code, Cursor, Windsurf 등)를 엽니다.
2. 어시스턴트 채팅에 `/opsx:propose`를 입력합니다. 이곳은 다른 요청을 입력하는 바로 그 입력창입니다.
3. 자동 완성 기능을 확인하세요: OpenSpec가 설치되어 있다면 슬래시를 입력하는 동안 `/opsx:propose`, `/opsx:apply` 등 관련 명령어가 표시됩니다.

이게 전부입니다. 켜고 끌 모드도, 실행할 데몬도, 별도의 창도 없습니다.

터미널에서 *진정으로 인터랙티브*로 작동하는 기능은 `openspec view` 명령어 하나뿐입니다. 이 명령어는 스펙과 변경 사항을 탐색할 수 있는 대시보드를 엽니다. 하지만 이는 뷰어일 뿐, 제안하고 빌드하는 작업은 채팅의 슬래시 명령어로 이루어집니다.

## 이렇게 분리된 이유

이 분리 방식을 이해하는 것이 중요합니다. 왜냐하면 이 방식이 OpenSpec가 25개 이상의 다양한 AI 도구와 호환되는 이유를 설명해주기 때문입니다.

CLI는 **엔진**입니다. 변경 폴더의 구조, 아티팩트 간의 의존성, 델타 스펙을 소스 오브 트루스에 병합하는 방법 등 규칙을 모두 알고 있습니다. 모든 환경에서 동일하게 작동합니다.

슬래시 명령어는 **핸들**과 같으며, 각 AI 도구마다 핸들이 조금씩 다릅니다. Claude Code는 이를 commands라고 부르고, Cursor와 Windsurf는 고유한 형식을 사용합니다. 일부 도구는 이를 skills라고 부르기도 합니다. `openspec init`을 실행하면 OpenSpec가 선택한 각 도구에 맞는 올바른 유형의 파일을 생성하므로, 선호하는 어시스턴트가 무엇이든 `/opsx:propose`라는 동일한 의도로 작동합니다.

이 설계의 장점은 워크플로우를 한 번만 배우면 모든 도구에서 사용할 수 있다는 점입니다. 단점은 도구마다 명령어의 구문이 약간씩 다를 수 있다는 점으로, 다음 섹션에서 자세히 설명합니다.

## 도구별 슬래시 명령어 구문

모든 도구에서 명령어의 의도는 동일하지만, 구두점 사용법이 다릅니다. 사용하는 어시스턴트에 맞는 형식을 사용하세요.

| 도구 | 입력 형식 |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | 스킬 스타일, 예: `/openspec-propose` |
| Codex | `.codex/skills/openspec-*` 경로를 통한 스킬 스타일 |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | 스킬 스타일, 예: `/skill:openspec-propose` |
| Trae | `/opsx-propose`, `/opsx-apply` |

대부분의 도구는 콜론 형식(`/opsx:propose`)이나 대시 형식(`/opsx-propose`) 중 하나를 사용합니다. 일부 도구는 슬래시 명령어 대신 명명된 스킬로 OpenSpec를 제공하므로, 해당 도구에서는 스킬 이름으로 스킬을 호출하면 됩니다. 각 도구별 전체 목록과 정확히 어떤 파일이 어디에 작성되는지는 [지원 도구](supported-tools.md)에서 확인할 수 있습니다.

확실하지 않다면 AI 채팅에 슬래시를 입력하고 자동 완성 목록을 확인하세요. 사용하는 도구가 기대하는 형식을 보여줄 것입니다.

## 명령어가 설치되는 원리: 스킬과 명령어

`openspec init`(또는 `openspec update`)를 실행하면 OpenSpec가 프로젝트에 작은 파일들을 작성하여 AI 도구가 워크플로우를 찾을 수 있도록 합니다. 사용하는 도구와 설정에 따라 이 파일들은 **스킬**, **명령어**, 혹은 둘 다일 수 있습니다.

- **스킬**은 `.claude/skills/openspec-*/SKILL.md` 등의 위치에 저장됩니다. 스킬은 새로운 크로스툴 표준으로, 어시스턴트가 자동으로 감지하는 지시사항이 담긴 폴더입니다.
- **명령어**는 `.claude/commands/opsx/<id>.md` 등의 위치에 저장됩니다. 명령어는 이전의 도구별 슬래시 명령어 파일로, Codex에는 생성되는 명령어 파일이 없으므로 `.codex/skills/openspec-*`를 사용하세요.

사용하는 도구가 스킬을 사용하는지 명령어를 사용하는지 신경 쓸 필요가 없습니다. 그냥 슬래시 명령어를 입력하면 작동합니다. 하지만 이 파일들이 존재한다는 것을 알고 있으면 문제가 발생했을 때 도움이 됩니다: 명령어가 사라진 경우 대부분 이 파일들이 누락되었거나 오래된 것이므로, `openspec update`로 다시 생성할 수 있습니다.

도구별 정확한 파일 경로는 [지원 도구](supported-tools.md)에서, 스킬이 기존 명령어만 사용하던 방식을 대체한 과정은 [마이그레이션 가이드](migration-guide.md)에서 확인할 수 있습니다.

## 설치 확인하기

빠른 확인 방법, 가장 빠른 순서대로 다음과 같습니다:

1. **AI 채팅에 슬래시를 입력하세요.** `/opsx`를 입력하기 시작하면 자동 완성 제안이 표시되는지 확인하세요. 제안이 표시되면 정상적으로 설치된 것입니다.
2. **파일을 확인하세요.** Claude Code의 경우 `.claude/skills/` 디렉토리에 `openspec-*` 폴더가 있는지 확인하세요. 다른 도구는 각자의 디렉토리를 사용하므로, 목록은 [지원 도구](supported-tools.md)에서 확인할 수 있습니다.
3. **설정을 다시 실행하세요.** 프로젝트 루트에서 `openspec update`를 실행하세요. 이 명령어는 구성한 모든 도구의 스킬과 명령어 파일을 다시 생성합니다.
4. **어시스턴트를 재시작하세요.** 많은 도구가 시작 시 스킬과 명령어를 스캔하므로, 새 창을 열면 문제가 해결될 수 있습니다.

## 기본으로 설치되는 명령어는 무엇인가요?

기본적으로 OpenSpec는 **코어** 슬래시 명령어 세트를 설치합니다:

- `/opsx:explore`: 변경 사항을 확정하기 전에 AI와 함께 아이디어를 검토하는 명령어(확신이 들지 않을 때 첫 단계로 사용하기 좋습니다)
- `/opsx:propose`: 변경 사항을 생성하고 모든 기획 산출물의 초안을 한 단계에서 작성하는 명령어
- `/opsx:apply`: 작업 목록을 따라 변경 사항을 빌드하는 명령어
- `/opsx:sync`: 변경 사항의 스펙 업데이트를 메인 스펙에 병합하는 명령어(보통 자동으로 실행됩니다)
- `/opsx:archive`: 변경 사항을 완료하고 아카이브에 저장하는 명령어

권장 기본 흐름: 할 일을 정할 때 `explore`를 사용한 후 `propose`, `apply`, `archive` 순으로 진행하세요. 이 초기 단계가 중요한 이유는 [먼저 탐색하기](explore.md) 가이드에서 확인할 수 있습니다.

더 세밀한 제어가 필요한 사용자를 위한 **확장** 명령어 세트도 있습니다(`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). `openspec config profile`로 이 세트를 활성화한 후 `openspec update`로 적용하세요.

OpenSpec를 처음 사용하시나요? 확장 세트에 포함된 `/opsx:onboard`는 여러분의 코드베이스에서 완전한 변경 사항을 만들기까지 각 단계를 안내해줍니다. 가장 친절한 입문 가이드입니다.

각 명령어의 상세 기능은 [명령어](commands.md)에서, 어떤 상황에서 어떤 명령어를 사용해야 하는지은 [워크플로우](workflows.md)에서 확인할 수 있습니다.

## 완벽한 첫 실행

전체 과정을 정리하면, 각 단계가 실행되는 위치와 함께 다음 순서대로 진행하시면 됩니다:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installs slash commands into your AI tool)

AI CHAT      /opsx:explore
              (optional: think the idea through with the AI first)

AI CHAT      /opsx:propose add-dark-mode
              (AI drafts proposal, specs, design, tasks)

AI CHAT      /opsx:apply
              (AI builds it, checking off tasks)

AI CHAT      /opsx:archive
              (change is merged into your specs and filed away)
```

설정을 위한 터미널 단계가 두 개 있습니다. 이후에는 채팅에서 모든 작업을 진행하시면 됩니다. 이것이 기본 흐름입니다.

## 관련 문서

- [시작하기](getting-started.md): 첫 변경 사항 생성 전체 과정 안내
- [명령어](commands.md): 모든 슬래시 명령어 상세 설명
- [CLI](cli.md): 모든 터미널 명령어 상세 설명
- [지원 도구](supported-tools.md): 도구별 구문 및 파일 위치
- [자주 묻는 질문](faq.md): 더 많은 빠른 답변
- [문제 해결](troubleshooting.md): 명령어가 표시되지 않을 때 해결 방법