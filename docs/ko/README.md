# OpenSpec 문서

환영합니다. 이곳은 OpenSpec에 관한 모든 것을 담고 있습니다.

OpenSpec은 코드를 작성하기 전에 무엇을 구축해야 하는지에 대해 귀하와 AI 코딩 어시스턴트가 **합의하도록** 돕습니다. 변경 사항을 설명하면 AI가 짧은 사양서(spec)와 작업 목록을 초안으로 작성합니다. 두 분 모두 동일한 계획을 검토하고, 그 후에 작업이 진행됩니다. 이제 와서 AI가 잘못된 것을 만들었다는 사실을 중간에야 깨닫는 일은 없습니다.

다른 어떤 것도 읽지 않는다면, 이 두 페이지를 읽으십시오:

1. [Getting Started](getting-started.md): 설치, 초기화 및 첫 번째 변경 사항 배포 방법.
2. [How Commands Work](how-commands-work.md): `/opsx:propose`를 실제로 입력해야 하는 곳(힌트: 터미널이 아닌 AI 채팅입니다). 이 부분에서 거의 모든 사람이 당황합니다.

두 번째 내용이 보이는 것보다 더 중요합니다. OpenSpec은 두 가지 측면을 가지고 있습니다. 터미널에서 실행하는 커맨드 라인 도구와 AI 어시스턴트에게 제공하는 슬래시(slash) 명령어입니다. 어느 것이 무엇인지 아는 것이 가장 흔한 혼란의 순간을 막아줍니다.

> **가장 먼저 구축해야 할 최고의 습관: 무엇을 만들어야 할지 확신이 서지 않을 때는 `/opsx:explore`로 시작하십시오.** 이는 코드를 읽고, 옵션을 평가하며, 어떤 산출물이나 코드도 존재하기 전에 모호한 아이디어를 구체적인 계획으로 다듬어주는 부담 없는 사고 파트너입니다. [Explore First](explore.md) 가이드가 이를 입증합니다.

## 경로 선택하기

**저는 완전히 처음입니다.** 먼저 [Getting Started](getting-started.md)를 보고, 이어서 [Core Concepts at a Glance](overview.md)를 훑어보십시오. 무언가가 의문의 여지가 있다고 느껴진다면, [FAQ](faq.md)와 [Glossary](glossary.md)가 도움이 될 것입니다.

**저는 문제가 있지만 계획이 없습니다.** 이것은 흔한 경우이며, 전용 답변이 있습니다: [Explore First](explore.md). 어떤 것에 전념하기 전에 AI와 함께 `/opsx:explore`를 사용하여 숙고하십시오.

**저는 기존에 큰 코드베이스(codebase)를 가지고 있습니다.** 모든 것을 문서화할 필요는 없습니다. [Using OpenSpec in an Existing Project](existing-projects.md)에서는 바다를 끓이는 것 없이 실제, 레거시 코드를 대상으로 어떻게 시작하는지 보여줍니다.

**그냥 작동하게 만들고 싶습니다.** [Install](installation.md)을 실행하고 `openspec init`을 실행한 다음, 첫 번째 슬래시 명령어가 올바른 곳에 들어가도록 [How Commands Work](how-commands-work.md)를 읽으십시오.

**저는 예시를 통해 배웁니다.** [Examples & Recipes](examples.md) 페이지는 실제 변경 사항(작은 기능, 버그 수정, 리팩토링, 탐색 등)을 처음부터 끝까지 안내합니다.

**저는 이전 워크플로우에서 왔습니다.** [Migration Guide](migration-guide.md)는 무엇이 어떻게 바뀌었고 왜 바뀐 것인지 설명하며, 기존 작업물이 안전하다는 것을 보장합니다.

**제 팀의 프로세스에 맞추고 싶습니다.** [Customization](customization.md)은 프로젝트 구성, 사용자 지정 스키마 및 공유 컨텍스트를 다룹니다.

**뭔가 고장 났습니다.** [Troubleshooting](troubleshooting.md)은 사람들이 실제로 직면하는 실패 사례와 그 해결책을 모아 놓았습니다.

## 전체 지도 (The whole map)

### 여기서 시작하기

| Doc | 제공하는 내용 |
|-----|-------------------|
| [Getting Started](getting-started.md) | 설치, 초기화 및 첫 번째 변경 사항의 종단 간(end to end) 실행 방법 |
| [Explore First](explore.md) | 커밋하기 전에 아이디어를 숙고하기 위해 `/opsx:explore` 사용하기 |
| [How Commands Work](how-commands-work.md) | 슬래시 명령어가 실행되는 곳, "인터랙티브 모드"의 의미, 터미널 대 채팅 |
| [Core Concepts at a Glance](overview.md) | 한 페이지에 담긴 전체적인 사고 모델: 사양서(specs), 변경 사항(changes), 델타(deltas), 아카이브(archive) |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix 및 작동 여부를 확인하는 방법 |

### 일상적으로 사용하기

| Doc | 제공하는 내용 |
|-----|-------------------|
| [Workflows](workflows.md) | 일반적인 패턴과 각 명령어를 언제 사용해야 하는지에 대한 안내 |
| [Examples & Recipes](examples.md) | 실제 변경 사항에 대한 전체 안내, 복사하여 붙여넣을 수 있음 |
| [Using OpenSpec in an Existing Project](existing-projects.md) | 대규모 레거시 코드베이스에 OpenSpec 도입하기 |
| [Editing & Iterating on a Change](editing-changes.md) | 산출물 업데이트, 되돌아가기, 수동 편집 사항 조정하기 |
| [Commands](commands.md) | 모든 `/opsx:*` 슬래시 명령어에 대한 참조 자료 |
| [CLI](cli.md) | 모든 `openspec` 터미널 명령어에 대한 참조 자료 |

### 깊이 이해하기

| Doc | 제공하는 내용 |
|-----|-------------------|
| [Concepts](concepts.md) | 사양서, 변경 사항, 산출물(artifacts), 스키마 및 아카이브에 대한 상세 설명 |
| [OPSX Workflow](opsx.md) | 왜 워크플로우가 단계별로 고정되어 있지 않고 유동적인지에 대한 설명과 아키텍처 심층 분석 |
| [Glossary](glossary.md) | 정의된 모든 용어 모음 |

### 나만의 것으로 만들기

| Doc | 제공하는 내용 |
|-----|-------------------|
| [Customization](customization.md) | 프로젝트 구성, 사용자 지정 스키마, 공유 컨텍스트 |
| [Multi-Language](multi-language.md) | 영어 이외의 언어로 산출물 생성하기 |
| [Supported Tools](supported-tools.md) | OpenSpec이 통합하는 25개 이상의 AI 도구와 파일 저장 위치 |

### 도움이 필요할 때

| Doc | 제공하는 내용 |
|-----|-------------------|
| [FAQ](faq.md) | 사람들이 가장 많이 하는 질문에 대한 빠른 답변 |
| [Troubleshooting](troubleshooting.md) | 구체적인 실패에 대한 실질적인 해결책 |
| [Migration Guide](migration-guide.md) | 레거시 워크플로우에서 OPSX로 이동하기 |

### 리포지토리 간 조정 (베타)

| Doc | 제공하는 내용 |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | 작업이 여러 리포지토리나 팀에 걸쳐 있을 때 계획 세우기 |
| [Agent Contract](agent-contract.md) | 에이전트가 구동하는 기계 판독 가능한 CLI 인터페이스 |

## 30초 요약 (The thirty-second version)

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← optional, but a great habit
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

1단계와 2단계는 터미널에서 수행됩니다. 나머지는 AI 어시스턴트의 채팅에서 수행됩니다. 이 분할 지점은 암기할 가치가 있는 유일한 부분이며, [How Commands Work](how-commands-work.md)가 그 이유를 정확히 설명합니다. 3단계는 선택 사항이지만, 확신이 서지 않을 때 `/opsx:explore`로 시작하는 습관은 가장 가치 있게 형성할 만합니다.

## 도움을 받을 수 있는 다른 곳들

- **Discord:** 질문, 아이디어 및 도움이 필요할 경우 [discord.gg/YctCnvvshC]
- **GitHub Issues:** 버그 및 기능 요청 사항은 [github.com/Fission-AI/OpenSpec/issues]를 이용해 주십시오.
- **`openspec feedback "your message"`** 는 터미널에서 직접 피드백을 보냅니다 (GitHub 이슈가 열립니다).

이 문서들에서 잘못되었거나, 오래되었거나, 혼란스러운 부분을 발견하셨습니까? 그것은 버그입니다. 이슈를 생성하거나 PR(Pull Request)을 제출하십시오. 문서 개선은 여러분이 할 수 있는 가장 가치 있는 기여 중 일부입니다.