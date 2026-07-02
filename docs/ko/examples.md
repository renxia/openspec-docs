# 예시 및 레시피

실제 변경 사항을 처음부터 끝까지 보여줍니다. 각 레시피는 사용자가 입력할 명령어와 그 결과로 볼 수 있는 내용을 모두 제공하므로, 자신의 상황에 맞는 패턴을 찾아 복사할 수 있습니다. 여기서는 기본 **core** 명령어(`propose`, `explore`, `apply`, `sync`, `archive`)를 사용하며, 확장된 세트가 도움이 되는 부분은 명시되어 있습니다.

시작하기 전에 유의사항: `/opsx:propose`와 같은 슬래시 명령어는 **AI 어시스턴트 채팅**에 입력하고, `openspec` 명령어는 **터미널**에 입력합니다. 이 내용이 새롭다면 먼저 [How Commands Work](how-commands-work.md)를 읽어보세요. 아래의 대화 기록에서 `You:`와 `AI:`는 채팅을 나타내며, `$`로 시작하는 줄은 터미널입니다.

> **아직 무엇을 만들지 확신하지 못했나요?** 대부분의 레시피는 먼저 `/opsx:explore`를 사용하여 충분히 고민하는 것에서 시작하면 더 명확해집니다. [Recipe 3](#recipe-3-exploring-before-you-commit)은 이를 실행하는 모습을 보여주며, [Explore First](explore.md) 가이드가 그 필요성을 완벽하게 뒷받침합니다.

## 레시피 1: 작은 기능, 빠른 경로

**사용 시점:** 원하는 바를 알고 있으며, 범위가 제한된 작업일 때 사용합니다. 이것이 가장 일반적인 레시피입니다.

전체 과정은 세 가지 명령어(Propose, 빌드, 아카이브)로 이루어집니다.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

이제 계획을 읽으십시오. 제안서와 델타 스펙을 여세요. 이것이 바로 OpenSpec이 만들어진 순간입니다. 코드가 400줄이 되기 전에 단 하나의 문단일 때 잘못된 가정을 잡아내는 것입니다. 만약 뭔가 이상하다면 원하는 아티팩트를 직접 편집한 후 계속 진행하십시오.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

끝입니다. 이제 로그아웃 동작은 스펙의 일부가 되었고, 변경 사항은 전체 맥락과 함께 보관되었습니다.

## 레시피 2: 버그 수정

**사용 시점:** 무언가 잘못되었고, 그 수정을 미스터리한 커밋이 아닌 의도적인 동작 변경으로 기록하고 싶을 때 사용합니다.

버그 수정은 기능과 정확히 동일하게 작동합니다. 차이점은 제안서를 작성하는 방식입니다. 단순히 "버그를 고치기"가 아니라 *올바른* 동작을 설명해야 합니다.

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

이 수정 사항이 새로운 시나리오와 함께 `MODIFIED` 요구사항으로 기록되기 때문에, 다음 사용자(또는 다음 AI 세션)는 단순히 수정을 했다는 사실뿐만 아니라 '올바르다'는 것이 무엇을 의미하는지 알게 됩니다. 그런 다음 평소처럼 `/opsx:apply` 및 `/opsx:archive`를 실행합니다.

팁: 수정 사항의 경우 좋은 시나리오는 산문으로 작성된 회귀 테스트입니다. "로그아웃 상태인 사용자가 유효한 자격 증명을 제출하면 대시보드에 도착하고 다시 리디렉션되지 않는다." 이렇게 작성하면 구현 목표가 명확해집니다.

## 레시피 3: 커밋 전에 탐색하기

**사용 시점:** 문제를 가지고 있지만 아직 계획이 없을 때 사용합니다. 무엇을 만들어야 할지, 어떤 접근 방식이 올바른지 확신하지 못할 수 있습니다.

`/opsx:explore`로 시작하십시오. 이는 구조나 아티팩트가 생성되지 않는 사고 파트너입니다. 코드베이스를 읽고 결정을 내리는 데 도움을 줍니다.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

탐색은 변경 사항에 투입하기 *전에* 사고를 명확하게 합니다. 통찰력이 구체화되면 제안하고 AI가 맥락을 이어갑니다.

## 레시피 4: 두 가지 변경 사항 동시에 처리하기

**사용 시점:** 기능 작업 중간에 있는데 긴급한 수정 사항이 순서를 앞당길 때 사용합니다.

변경 사항은 독립적인 폴더이므로 병렬 작업이 충돌하지 않습니다. 수정을 시작하고 배포한 다음, 중단했던 기능으로 돌아가십시오.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

`/opsx:apply add-dark-mode`에서 변경 사항의 이름을 지정하는 것이 여러 개가 활성화되어 있을 때 AI에게 특정 변경 사항을 지시하는 방법입니다. 작업이 `tasks.md`에 완료 여부를 추적하기 때문에, AI는 정확히 어디서 멈췄는지 알고 있습니다.

여러 변경 사항을 한 번에 완료할 때, 확장된 `/opsx:bulk-archive`는 이들을 함께 파일로 묶고 실제로 구현된 내용을 확인하여 스펙 충돌을 해결합니다. [Workflows](workflows.md#parallel-changes)를 참조하십시오.

## 레시피 5: 동작 변경이 없는 리팩토링

**사용 시점:** 코드를 재구성하고 있으며 외부적으로 보이는 동작은 동일하게 유지되어야 할 때 사용합니다.

이것이 흥미로운 경우입니다. 순수한 리팩토링은 *스펙에 추가할 내용이 없기* 때문입니다. 동작 계약은 변하지 않고 구현만 바뀝니다. 따라서 작업은 디자인과 태스크에 존재하며 스펙 델타는 비어 있거나 없습니다.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

스펙을 건드리지 않는 변경 사항을 아카이브할 때, 터미널 명령에 스펙 단계를 건너뛰도록 지시할 수 있습니다:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

이 플래그는 도구(tooling), CI 및 문서 전용 변경 사항에도 유용합니다. 원칙은 다음과 같습니다: 스펙은 동작을 설명하므로, 동작이 바뀌지 않았다면 스펙도 바뀌어서는 안 됩니다. [Concepts](concepts.md#what-a-spec-is-and-is-not)를 참조하십시오.

## 레시피 6: 단계별 제어 (확장된 명령어)

**사용 시점:** 복잡하거나 위험한 변경 사항으로, 다음 단계로 넘어가기 전에 각 아티팩트를 검토하고 싶을 때 사용합니다.

기본 `/opsx:propose`는 모든 것을 한 번에 초안 작성합니다. 단계별로 진행하고 싶은 경우 확장된 명령어를 활성화하십시오:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

이제 증분적으로(incrementally) 스캐폴딩하고 빌드할 수 있습니다:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

각 아티팩트가 생성될 때 검토하고 자유롭게 편집한 다음 만족스러울 때 계속 진행하십시오. 나머지를 한 번에 초안 작성하고 싶다면 `/opsx:ff`를 사용하여 나머지 계획 아티팩트를 빠르게 건너뛸 수 있습니다. 아카이브하기 전에 `/opsx:verify`는 구현이 실제로 스펙과 일치하는지 확인합니다. [Workflows](workflows.md#opsxff-vs-opsxcontinue)를 참조하십시오.

## 레시피 7: 전체 루프 실습 학습하기

**사용 시점:** OpenSpec을 설치했고 장난감 예제가 아닌 자신의 코드에서 워크플로우를 *체험하고* 싶을 때 사용합니다.

확장된 명령어를 활성화하십시오(레시피 6 참조). 그런 다음:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard`는 실제(작은) 개선 사항을 찾아내고, 이를 위한 변경 사항을 생성하고, 구현하고, 모든 단계를 서술하며 아카이브합니다. 15분에서 30분이 소요되며, 보관하거나 폐기할 수 있는 실제 변경 사항을 남깁니다. 이것이 가장 부드러운 학습 방법입니다. [Commands](commands.md#opsxonboard)를 참조하십시오.

## 터미널에서 작업 확인하기

언제든지 터미널에서 상태를 검사할 수 있습니다:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

이들은 읽고 검사하는 도구입니다. 제안 및 빌드는 여전히 채팅의 슬래시 명령어를 통해 이루어집니다. 전체 세부 정보는 [CLI reference](cli.md)를 참조하십시오.

## 다음 단계

- [Explore First](explore.md): 확신이 없을 때 시작하는 권장 방법
- [Workflows](workflows.md): 언제 각각을 사용해야 하는지에 대한 결정 지침과 함께 위의 패턴들
- [Commands](commands.md): 모든 슬래시 명령어에 대한 상세 정보
- [Getting Started](getting-started.md): 표준적인 첫 번째 변경 사항 워크스루
- [Concepts](concepts.md): 왜 이 조각들이 그렇게 맞춰져 있는지에 대한 설명