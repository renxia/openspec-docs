---
layout: home

hero:
  name: "OpenSpec"
  text: "AI 어시스턴트를 위한 스펙 기반 개발"
  tagline: AI 어시스턴트 프로젝트를 구축하고 관리하기 위한 경량 스펙.
  actions:
    - theme: brand
      text: 시작하기
      link: ./getting-started
    - theme: alt
      text: 홈
      link: /

features:
  - title: 스펙 우선 워크플로우
    details: 코드를 작성하기 전에 요구사항을 정의하세요.
  - title: AI 네이티브 설계
    details: Claude Code, Cursor, Windsurf 등을 위해 구축되었습니다.
  - title: 다국어 지원
    details: 여러 언어로 문서를 이용할 수 있습니다.
---


우리의 철학:

```text
→ 유연함, 경직되지 않음
→ 반복적, 폭포수 모델이 아님
→ 간단함, 복잡하지 않음
→ 그린필드만이 아닌 브라운필드를 위해 구축
→ 개인 프로젝트에서 기업까지 확장 가능
```

> [!TIP]
> **새로운 워크플로우가 이제 가능합니다!** 아티팩트 기반 워크플로우로 OpenSpec을 재구축했습니다.
>
> 시작하려면 `/opsx:propose "your idea"`를 실행하세요. → [자세히 알아보기](opsx.md)

<p align="center">
  업데이트를 위해 <a href="https://x.com/0xTab">@0xTab on X</a>를 팔로우하세요 · 도움과 질문을 위해 <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a>에 참여하세요.
</p>

## 작동 모습 보기

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

이제 AI에게 알려주세요: `/opsx:propose <what-you-want-to-build>`

확장된 워크플로우(`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`)를 원하시면, `openspec config profile`로 선택하고 `openspec update`로 적용하세요.

> [!NOTE]
> 사용 중인 도구가 지원되는지 확실하지 않으신가요? [전체 목록 보기](supported-tools.md) – 25개 이상의 도구를 지원하며 계속 추가되고 있습니다.
>
> pnpm, yarn, bun, nix에서도 작동합니다. [설치 옵션 보기](installation.md).

## 문서

→ **[시작하기](getting-started.md)**: 첫 단계<br>
→ **[워크플로우](workflows.md)**: 조합과 패턴<br>
→ **[커맨드](commands.md)**: 슬래시 커맨드 & 스킬<br>
→ **[CLI](cli.md)**: 터미널 참조<br>
→ **[지원 도구](supported-tools.md)**: 도구 통합 & 설치 경로<br>
→ **[개념](concepts.md)**: 전체 구조 이해<br>
→ **[다국어 지원](multi-language.md)**: 다국어 지원<br>
→ **[사용자 정의](customization.md)**: 나만의 설정


## 왜 OpenSpec인가?

AI 코딩 어시스턴트는 강력하지만, 요구사항이 채팅 기록에만 존재하면 예측하기 어렵습니다. OpenSpec은 코드가 작성되기 전에 무엇을 만들 것인지 합의할 수 있도록 경량 스펙 레이어를 추가합니다.

- **구축 전에 합의하세요** — 인간과 AI가 코드가 작성되기 전에 스펙에 대해 합의합니다
- **정리된 상태를 유지하세요** — 각 변경사항은 제안서, 스펙, 설계, 작업 목록이 포함된 자체 폴더를 가집니다
- **유연하게 작업하세요** — 언제든지 아티팩트를 업데이트할 수 있으며, 경직된 단계 게이트가 없습니다
- **도구를 사용하세요** — 슬래시 커맨드를 통해 20개 이상의 AI 어시스턴트와 함께 작동합니다

### 비교

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — 철저하지만 무겁습니다. 경직된 단계 게이트, 많은 마크다운, Python 설정. OpenSpec은 더 가볍고 자유롭게 반복할 수 있습니다.

**vs. [Kiro](https://kiro.dev)** (AWS) — 강력하지만 해당 IDE에 종속되고 Claude 모델로 제한됩니다. OpenSpec은 이미 사용 중인 도구와 함께 작동합니다.

**vs. 아무것도 없음** — 스펙 없는 AI 코딩은 모호한 프롬프트와 예측 불가능한 결과를 의미합니다. OpenSpec은 형식적인 절차 없이 예측 가능성을 제공합니다.

## OpenSpec 업데이트

**패키지 업그레이드**

```bash
npm install -g @fission-ai/openspec@latest
```

**에이전트 지침 새로고침**

각 프로젝트 내에서 실행하여 AI 가이드를 재생성하고 최신 슬래시 커맨드가 활성화되도록 합니다:

```bash
openspec update
```

## 사용 참고사항

**모델 선택**: OpenSpec은 고급 추론 모델에서 가장 잘 작동합니다. 계획과 구현 모두에 Opus 4.5와 GPT 5.2를 권장합니다.

**컨텍스트 위생**: OpenSpec은 깨끗한 컨텍스트 창에서 이점을 얻습니다. 구현을 시작하기 전에 컨텍스트를 지우고 세션 내내 좋은 컨텍스트 위생을 유지하세요.

## 기여하기

**작은 수정** — 버그 수정, 오타 수정, 사소한 개선은 PR로 직접 제출할 수 있습니다.

**큰 변경사항** — 새로운 기능, 중요한 리팩토링 또는 아키텍처 변경의 경우, 구현이 시작되기 전에 의도와 목표를 맞출 수 있도록 먼저 OpenSpec 변경 제안서를 제출해 주세요.

제안서를 작성할 때 OpenSpec 철학을 염두에 두세요: 우리는 다양한 코딩 에이전트, 모델, 사용 사례를 가진 광범위한 사용자를 지원합니다. 변경사항은 모두에게 잘 작동해야 합니다.

**AI 생성 코드는 환영합니다** — 테스트와 검증을 거친 경우에 한합니다. AI 생성 코드를 포함하는 PR은 사용된 코딩 에이전트와 모델을 언급해야 합니다 (예: "Generated with Claude Code using claude-opus-4-5-20251101").

### 개발

- 의존성 설치: `pnpm install`
- 빌드: `pnpm run build`
- 테스트: `pnpm test`
- 로컬에서 CLI 개발: `pnpm run dev` 또는 `pnpm run dev:cli`
- 컨벤션 커밋 (한 줄): `type(scope): subject`

## 기타

<details>
<summary><strong>텔레메트리</strong></summary>

OpenSpec은 익명의 사용 통계를 수집합니다.

사용 패턴을 이해하기 위해 커맨드 이름과 버전만 수집합니다. 인수, 경로, 내용 또는 PII는 수집하지 않습니다. CI에서는 자동으로 비활성화됩니다.

**옵트아웃:** `export OPENSPEC_TELEMETRY=0` 또는 `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>관리자 & 어드바이저</strong></summary>

프로젝트를 안내하는 핵심 관리자 및 어드바이저 목록은 [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md)를 참조하세요.

</details>



## 라이선스

MIT