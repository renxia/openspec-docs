---
layout: home

hero:
  name: "OpenSpec"
  text: "AI 어시스턴트를 위한 사양 기반 개발"
  tagline: AI 어시스턴트 프로젝트를 구축하고 관리하기 위한 경량 사양.
  actions:
    - theme: brand
      text: 시작하기
      link: ./getting-started
    - theme: alt
      text: 홈
      link: /

features:
  - title: 사양 우선 워크플로
    details: 코드를 작성하기 전에 요구사항을 정의합니다.
  - title: AI 네이티브 설계
    details: Claude Code, Cursor, Windsurf 등을 위해 구축되었습니다.
  - title: 다국어 지원
    details: 여러 언어로 문서가 제공됩니다.
---


<details>
<summary><strong>가장 사랑받는 사양 프레임워크.</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
우리의 철학:

```text
→ 유연함, 경직되지 않음
→ 반복적, 폭포수 방식이 아님
→ 쉬움, 복잡하지 않음
→ 그린필드뿐 아니라 브라운필드를 위해 구축됨
→ 개인 프로젝트부터 기업까지 확장 가능
```

> [!TIP]
> **새로운 워크플로를 이제 사용할 수 있습니다!** 새로운 아티팩트 기반 워크플로로 OpenSpec을 재구축했습니다.
>
> `/opsx:propose "your idea"`를 실행하여 시작하세요. → [자세히 알아보기](opsx.md)

<p align="center">
  <a href="https://x.com/0xTab">@0xTab를 X에서 팔로우</a>하여 업데이트를 받으세요 · <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a>에 가입하여 도움과 질문을 받으세요.
</p>

<!-- TODO: Add GIF demo of /opsx:propose → /opsx:archive workflow -->

## 작동 방식 살펴보기

```text
You: /opsx:propose add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /opsx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /opsx:archive
AI:  Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>OpenSpec 대시보드</strong></summary>

</details>

## 빠른 시작

**Node.js 20.19.0 이상이 필요합니다.**

OpenSpec을 전역으로 설치합니다:

```bash
npm install -g @fission-ai/openspec@latest
```

그런 다음 프로젝트 디렉토리로 이동하여 초기화합니다:

```bash
cd your-project
openspec init
```

이제 AI에게 다음을 지시합니다: `/opsx:propose <what-you-want-to-build>`

확장된 워크플로(``/opsx:new``, ``/opsx:continue``, ``/opsx:ff``, ``/opsx:verify``, ``/opsx:sync``, ``/opsx:bulk-archive``, ``/opsx:onboard``)를 사용하려면 ``openspec config profile``로 선택하고 ``openspec update``로 적용합니다.

> [!NOTE]
> 사용 중인 도구가 지원되는지 확실하지 않으신가요? [전체 목록을 확인하세요](supported-tools.md) – 25개 이상의 도구를 지원하며 계속 늘어나고 있습니다.
>
> pnpm, yarn, bun, nix와도 작동합니다. [설치 옵션 보기](installation.md).

## 문서

→ **[시작하기](getting-started.md)**: 첫 단계<br>
→ **[워크플로](workflows.md)**: 조합 및 패턴<br>
→ **[명령어](commands.md)**: 슬래시 명령어 및 스킬<br>
→ **[CLI](cli.md)**: 터미널 참조<br>
→ **[지원 도구](supported-tools.md)**: 도구 통합 및 설치 경로<br>
→ **[개념](concepts.md)**: 전체적인 작동 방식<br>
→ **[다국어](multi-language.md)**: 다국어 지원<br>
→ **[사용자 정의](customization.md)**: 나만의 것으로 만들기


## OpenSpec을 사용하는 이유는?

AI 코딩 어시스턴트는 강력하지만 요구사항이 채팅 기록에만 존재할 때는 예측하기 어렵습니다. OpenSpec은 경량 사양 계층을 추가하여 코드가 작성되기 전에 구축할 내용에 합의할 수 있게 합니다.

- **구축 전에 합의** — 코드가 작성되기 전에 인간과 AI가 사양에 대해 정렬합니다.
- **체계적으로 유지** — 각 변경사항은 제안, 사양, 설계, 작업이 포함된 고유 폴더를 가집니다.
- **유연하게 작업** — 엄격한 단계 게이트 없이 언제든지 어떤 아티팩트든 업데이트합니다.
- **도구를 활용** — 슬래시 명령어를 통해 20개 이상의 AI 어시스턴트와 작동합니다.

### 비교

**[Spec Kit](https://github.com/github/spec-kit)** (GitHub) 대비 — 철저하지만 무거운 프레임워크입니다. 엄격한 단계 게이트, 많은 마크다운, Python 설정이 필요합니다. OpenSpec은 더 가볍고 자유롭게 반복 작업을 할 수 있게 합니다.

**[Kiro](https://kiro.dev)** (AWS) 대비 — 강력하지만 해당 IDE에 종속되고 Claude 모델로 제한됩니다. OpenSpec은 이미 사용 중인 도구와 작동합니다.

**없음 대비** — 사양 없이 AI 코딩을 하면 모호한 프롬프트와 예측 불가능한 결과를 초래합니다. OpenSpec은 불필요한 의식 없이 예측 가능성을 제공합니다.

## OpenSpec 업데이트

**패키지 업그레이드**

```bash
npm install -g @fission-ai/openspec@latest
```

**에이전트 지침 새로고침**

각 프로젝트 내에서 다음을 실행하여 AI 지침을 재생성하고 최신 슬래시 명령어가 활성화되도록 합니다:

```bash
openspec update
```

## 사용 참고사항

**모델 선택**: OpenSpec은 고추론 모델에서 가장 잘 작동합니다. 계획과 구현 모두에 Opus 4.5 및 GPT 5.2를 권장합니다.

**컨텍스트 관리**: OpenSpec은 깨끗한 컨텍스트 윈도우에서 이점을 얻습니다. 구현을 시작하기 전에 컨텍스트를 지우고 세션 전체에서 좋은 컨텍스트 관리를 유지하세요.

## 기여하기

**작은 수정** — 버그 수정, 오타 교정 및 사소한 개선은 PR로 직접 제출할 수 있습니다.

**더 큰 변경** — 새로운 기능, 상당한 리팩토링 또는 아키텍처 변경의 경우, 구현이 시작되기 전에 의도와 목표를 정렬할 수 있도록 먼저 OpenSpec 변경 제안을 제출해 주세요.

제안을 작성할 때는 OpenSpec의 철학을 염두에 두세요: 우리는 다양한 코딩 에이전트, 모델 및 사용 사례에 걸쳐 폭넓은 사용자를 대상으로 합니다. 변경 사항은 모두에게 잘 작동해야 합니다.

**AI 생성 코드는 환영합니다** — 테스트되고 검증된 경우에 한합니다. AI 생성 코드가 포함된 PR에는 사용된 코딩 에이전트와 모델을 언급해야 합니다(예: "Generated with Claude Code using claude-opus-4-5-20251101").

### 개발

- 의존성 설치: `pnpm install`
- 빌드: `pnpm run build`
- 테스트: `pnpm test`
- 로컬에서 CLI 개발: `pnpm run dev` 또는 `pnpm run dev:cli`
- 컨벤셔널 커밋(한 줄): `type(scope): subject`

## 기타

<details>
<summary><strong>원격 분석</strong></summary>

OpenSpec은 익명 사용 통계를 수집합니다.

사용 패턴을 이해하기 위해 명령어 이름과 버전만 수집합니다. 인수, 경로, 내용 또는 개인 식별 정보(PII)는 수집하지 않습니다. CI 환경에서는 자동으로 비활성화됩니다.

**선택 해제:** `export OPENSPEC_TELEMETRY=0` 또는 `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>유지보수자 및 자문위원</strong></summary>

프로젝트를 이끌어가는 핵심 유지보수자 및 자문위원 목록은 [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md)를 참조하세요.

</details>



## 라이선스

MIT