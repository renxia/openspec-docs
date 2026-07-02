---
layout: home

hero:
  name: "OpenSpec"
  text: "AI 어시스턴트를 위한 명세 기반 개발"
  tagline: AI 어시스턴트 프로젝트를 구축하고 관리하기 위한 경량 명세.
  actions:
    - theme: brand
      text: 시작하기
      link: ./getting-started
    - theme: alt
      text: 홈
      link: /

features:
  - title: Spec-First Workflow
    details: 코드를 작성하기 전에 요구 사항을 정의합니다.
  - title: AI-Native Design
    details: Claude Code, Cursor, Windsurf 등과 함께 사용하도록 설계되었습니다.
  - title: Multi-Language
    details: 다양한 언어로 문서화가 가능합니다.
---

# OpenSpec 문서

환영합니다. 이곳은 OpenSpec에 관한 모든 것의 홈입니다.

OpenSpec은 코드가 작성되기 전에 AI 코딩 어시스턴트와 **무엇을 만들지 합의하는** 데 도움을 줍니다. 사용자는 변경 사항을 설명하고, AI는 짧은 명세와 작업 목록을 초안으로 작성하며, 두 사람은 동일한 계획을 검토한 후 작업을 진행합니다. 중간에 AI가 잘못된 것을 만든다는 사실을 발견하는 일은 이제 없습니다.

다른 것은 읽지 않더라도 이 두 페이지를 읽어보세요:

1. [Getting Started](getting-started.md): 설치, 초기화 및 첫 번째 변경 사항 배포 방법.
2. [How Commands Work](how-commands-work.md): `/opsx:propose`가 실제로 입력되는 곳(힌트: 터미널이 아닌 AI 채팅에서). 이 부분 때문에 거의 모든 사람이 혼란을 겪습니다.

두 번째 항목은 보이는 것보다 더 중요합니다. OpenSpec에는 두 가지 측면이 있습니다. 터미널에서 실행하는 커맨드라인 도구와 AI 어시스턴트에게 제공하는 슬래시 명령어입니다. 어느 것이 무엇인지 아는 것은 가장 흔한 혼란을 방지해 줍니다.

> **가장 먼저 구축해야 할 습관: 무엇을 만들어야 할지 확신이 서지 않을 때 `/opsx:explore`를 시작하세요.** 이는 코드를 읽고, 옵션을 평가하며, 어떤 아티팩트나 코드가 존재하기 전에 모호한 아이디어를 구체적인 계획으로 다듬어주는 부담 없는 사고 파트너입니다. [Explore First](explore.md) 가이드가 이를 입증합니다.

## 경로 선택하기

**완전히 초보자입니다.** [Getting Started](getting-started.md)로 시작한 다음, [Core Concepts at a Glance](overview.md)를 훑어보세요. 무언가가 미스터리하게 느껴진다면, [FAQ](faq.md)와 [Glossary](glossary.md)가 근처에 있습니다.

**문제가 있지만 계획이 없습니다.** 이것은 흔한 경우이며, 전용 답변이 있습니다: [Explore First](explore.md). 어떤 것에 확정하기 전에 AI와 함께 생각하려면 `/opsx:explore`를 사용하세요.

**크고 기존의 코드베이스가 있습니다.** 모든 것을 문서화할 필요는 없습니다. [Using OpenSpec in an Existing Project](existing-projects.md)에서는 바다 전체를 끓이지 않고 실제 레거시(brownfield) 코드로 시작하는 방법을 보여줍니다.

**그냥 작동하게 만들고 싶습니다.** [Install](installation.md)를 실행하고, `openspec init`을 실행한 다음, 첫 번째 슬래시 명령어가 올바른 곳에 도달하도록 [How Commands Work](how-commands-work.md)를 읽으세요.

**예제를 통해 배웁니다.** [Examples & Recipes](examples.md) 페이지는 실제 변경 사항(작은 기능, 버그 수정, 리팩토링, 탐색 등)을 처음부터 끝까지 안내합니다.

**이전 워크플로우에서 왔습니다.** [Migration Guide](migration-guide.md)는 무엇이 어떻게 바뀌었는지, 그리고 왜 바뀌었는지 설명하며 기존 작업이 안전하다는 것을 보장합니다.

**내 팀의 프로세스에 맞게 조정하고 싶습니다.** [Customization](customization.md)은 프로젝트 구성, 사용자 정의 스키마 및 공유 컨텍스트를 다룹니다.

**무언가 고장 났습니다.** [Troubleshooting](troubleshooting.md)는 사람들이 실제로 겪는 실패 사례와 그 해결책을 모아 놓았습니다.

## 전체 지도

### 여기서 시작하기

| Doc | 제공하는 내용 |
|-----|-------------------|
| [Getting Started](getting-started.md) | 설치, 초기화 및 첫 번째 변경 사항을 처음부터 끝까지 실행하는 방법 |
| [Explore First](explore.md) | 커밋하기 전에 아이디어를 생각하기 위해 `/opsx:explore`를 사용하는 방법 |
| [How Commands Work](how-commands-work.md) | 슬래시 명령어가 실행되는 곳, "대화형 모드"의 의미, 터미널 대 채팅 |
| [Core Concepts at a Glance](overview.md) | 명세, 변경 사항, 델타, 아카이브에 대한 전체적인 사고 모델을 한 페이지에 담았습니다 |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix 및 작동 여부를 확인하는 방법 |

### 일상적으로 사용하기

| Doc | 제공하는 내용 |
|-----|-------------------|
| [Workflows](workflows.md) | 일반적인 패턴과 각 명령어를 언제 사용할지에 대한 가이드 |
| [Examples & Recipes](examples.md) | 실제 변경 사항에 대한 전체 안내, 복사/붙여넣기 가능 |
| [Using OpenSpec in an Existing Project](existing-projects.md) | 대규모 레거시 코드베이스에서 OpenSpec을 채택하는 방법 |
| [Editing & Iterating on a Change](editing-changes.md) | 아티팩트 업데이트, 되돌아가기, 수동 편집 조정 |
| [Commands](commands.md) | 모든 `/opsx:*` 슬래시 명령어에 대한 참조 |
| [CLI](cli.md) | 모든 `openspec` 터미널 명령어에 대한 참조 |

### 깊이 이해하기

| Doc | 제공하는 내용 |
|-----|-------------------|
| [Concepts](concepts.md) | 명세, 변경 사항, 아티팩트, 스키마 및 아카이브에 대한 상세 설명 |
| [OPSX Workflow](opsx.md) | 왜 워크플로우가 단계별 잠금(phase-locked)이 아닌 유동적인지, 그리고 아키텍처 심층 분석 |
| [Glossary](glossary.md) | 모든 용어를 한곳에 정의했습니다 |

### 나만의 것으로 만들기

| Doc | 제공하는 내용 |
|-----|-------------------|
| [Customization](customization.md) | 프로젝트 구성, 사용자 정의 스키마, 공유 컨텍스트 |
| [Multi-Language](multi-language.md) | 영어 외의 언어로 아티팩트를 생성하는 방법 |
| [Supported Tools](supported-tools.md) | OpenSpec이 통합되는 25가지 이상의 AI 도구와 파일 저장 위치 |

### 도움이 필요할 때

| Doc | 제공하는 내용 |
|-----|-------------------|
| [FAQ](faq.md) | 사람들이 가장 많이 묻는 질문에 대한 빠른 답변 |
| [Troubleshooting](troubleshooting.md) | 구체적인 실패에 대한 실질적인 해결책 |
| [Migration Guide](migration-guide.md) | 레거시 워크플로우에서 OPSX로 이동하는 방법 |

### 리포지토리 간 조정 (베타)

| Doc | 제공하는 내용 |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | 작업이 여러 리포지토리나 팀에 걸쳐 있을 때의 계획 |
| [Agent Contract](agent-contract.md) | 에이전트가 구동하는 기계 판독 가능한 CLI 표면 |

## 30초 버전

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← 선택 사항이지만 좋은 습관입니다
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

1단계와 2단계는 터미널에서 실행됩니다. 나머지는 AI 어시스턴트의 채팅에서 실행됩니다. 이 분할은 기억할 가치가 있는 유일한 부분이며, [How Commands Work](how-commands-work.md)가 정확히 그 이유를 설명합니다. 3단계는 선택 사항이지만, 확신이 서지 않을 때 `/opsx:explore`로 시작하는 것은 가장 형성할 가치가 있는 습관입니다.

## 다른 도움을 얻을 수 있는 곳

- **Discord:** 질문, 아이디어 및 도움은 [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)에서 받으세요.
- **GitHub Issues:** 버그 및 기능 요청은 [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)를 확인하세요.
- **`openspec feedback "your message"`** 는 터미널에서 직접 피드백을 보냅니다(GitHub 이슈가 열립니다).

이 문서에서 잘못되거나, 오래되었거나, 혼란스러운 것을 발견했습니까? 그것은 버그입니다. 이슈나 PR을 여세요. 문서 개선은 여러분이 할 수 있는 가장 가치 있는 기여 중 일부입니다.