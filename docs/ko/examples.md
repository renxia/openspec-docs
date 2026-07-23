# 예제 & 레시피

실제 변경 사항을 처음부터 끝까지 보여줍니다. 각 레시피는 입력할 명령어와 그에 대한 응답을 보여주므로, 자신의 상황에 맞는 패턴을 찾아 복사할 수 있습니다. 여기서는 기본 **코어** 명령어(`propose`, `explore`, `apply`, `sync`, `archive`)를 사용하며, 확장 명령어 세트가 도움이 되는 경우 별도로 표기합니다.

시작하기 전 안내: `/opsx:propose`와 같은 슬래시 명령어는 **AI 어시스턴트 채팅**에 입력하고, `openspec` 명령어는 **터미널**에 입력합니다. 이 내용이 처음이라면 먼저 [명령어 작동 방식](how-commands-work.md)을 읽어보세요. 아래 대화록에서 `You:`와 `AI:`는 채팅 내용이고, `$`로 시작하는 줄은 터미널 명령어입니다.

> **아직 무엇을 만들지 정하지 않으셨나요?** 대부분의 레시피는 먼저 `/opsx:explore`로 생각을 정리한 후 시작하면 더 효과적입니다. [레시피 3](#recipe-3-exploring-before-you-commit)에서 실제 사용 예를 보여드리고, [먼저 탐색하기](explore.md) 가이드에서 전체적인 근거를 설명합니다.

## 레시피 1: 소규모 기능, 빠른 경로

**사용 시기:** 원하는 기능이 명확하고, 작업 범위가 한정된 경우입니다. 가장 많이 사용되는 레시피입니다.

전체 과정은 세 가지 명령어로 구성됩니다. 제안(propose), 구현(apply), 보관(archive)입니다.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

이제 계획을 읽어보세요. 제안서와 델타 명세서를 열어보세요. OpenSpec가 특히 유용한 순간입니다: 잘못된 가정이 400줄의 코드가 아닌 한 문단으로 작성된 상태에서 잡아낼 수 있기 때문입니다. 내용이 이상하다면 아티팩트를 직접 수정한 후 계속 진행하세요.

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

이제 완료입니다. 로그아웃 동작이 이제 명세의 일부가 되었고, 변경 사항은 전체 맥락과 함께 보관되었습니다.

## 레시피 2: 버그 수정

**사용 시기:** 기능이 정상 동작하지 않고, 그 수정 내용을 불명확한 커밋이 아닌 의도적인 동작 변경 사항으로 기록하고 싶을 때 사용합니다.

버그 수정은 기능 추가와 정확히 같은 방식으로 진행됩니다. 유일한 차이점은 제안서를 작성하는 방식입니다: "버그를 수정한다"고만 적는 대신 *올바른 동작*을 설명하세요.

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

수정 내용이 새로운 시나리오가 포함된 `MODIFIED` 요구사항으로 적용되기 때문에, 다음 작업자(또는 다음 AI 세션)는 단순히 버그를 수정했다는 사실뿐 아니라 '올바른 동작'이 무엇인지 확인할 수 있습니다. 이후 평소처럼 `/opsx:apply`와 `/opsx:archive`를 실행하세요.

팁: 버그 수정의 경우 좋은 시나리오는 문장으로 작성된 회귀 테스트입니다. "GIVEN a logged-out user, WHEN they submit valid credentials, THEN they land on the dashboard and are not redirected again." Write that, and the implementation has a clear target.

## 레시피 3: 변경 사항을 적용하기 전에 탐색하기

**사용 시기:** 문제는 있지만 아직 구체적인 계획이 없을 때 사용합니다. 무엇을 만들지, 어떤 접근 방식이 적합한지 확실하지 않을 때 적합합니다.

먼저 `/opsx:explore`를 실행하세요. 이 명령어는 구조나 아티팩트 생성 없이 생각을 정리하는 파트너 역할을 합니다. 코드베이스를 분석하여 의사 결정을 도와줍니다.

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

탐색을 통해 변경 사항을 적용하기 전에 생각을 명확히 정리할 수 있습니다. 통찰이 구체화되면 제안(propose)하면, AI가 해당 맥락을 이어서 반영합니다.

## 레시피 4: 두 가지 변경 사항을 동시에 진행하기

**사용 시기:** 기능을 개발하던 중 긴급한 수정 사항이 우선 처리되어야 할 때 사용합니다.

변경 사항은 독립적인 폴더로 관리되므로, 병렬로 작업해도 충돌이 발생하지 않습니다. 수정 사항을 먼저 시작해서 배포한 후, 중단했던 기능 개발을 그대로 이어서 진행하세요.

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

여러 변경 사항이 활성화된 상태에서 특정 변경 사항을 지정하려면 `/opsx:apply add-dark-mode`처럼 변경 사항 이름을 함께 입력하면 됩니다. 작업 완료 상태가 `tasks.md`에 기록되므로, AI가 정확히 중단한 위치를 파악할 수 있습니다.

여러 변경 사항을 한 번에 완료한 경우, 확장 명령어 `/opsx:bulk-archive`로 함께 보관할 수 있으며, 실제 구현된 내용을 확인하여 명세 충돌을 해결합니다. 자세한 내용은 [워크플로우](workflows.md#parallel-changes)를 참고하세요.

## 레시피 5: 동작 변경이 없는 리팩토링

**사용 시기:** 코드 구조를 재정리하되, 외부에서 보이는 동작은 그대로 유지해야 할 때 사용합니다.

이 경우는 특별한 케이스입니다. 순수 리팩토링의 경우 명세에 추가할 내용이 *전혀 없기* 때문입니다. 동작 계약은 변경되지 않고 구현만 바뀌기 때문에, 작업은 디자인과 작업(task) 영역에만 포함되고 명세 델타는 비어있거나 존재하지 않습니다.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

변경 사항의 `.openspec.yaml`에 `skip_specs: true`를 설정하여 빈 델타임을 명시적으로 선언하세요:

```yaml
schema: spec-driven
skip_specs: true
```

이 표시가 없으면 `openspec validate`가 델타가 없는 변경 사항을 거부하므로(명세 단계를 누락했는지 확인할 수 있음), 표시가 있으면 검증이 통과되고 `openspec status`에 명세 단계가 대기 중이 아닌 명시적으로 건너뛴 것으로 표시됩니다. 리팩토링 과정에서 동작이 변경된 경우, `.openspec.yaml`에서 `skip_specs`를 제거하고 델타 명세를 작성하세요. 검증 도구는 표시와 명세 파일이 함께 존재하는 경우 충돌로 처리하므로, 오래된 표시가 조용히 남아있을 수 없습니다.

표시가 된 변경 사항을 보관할 때는 추가 플래그가 필요 없습니다(병합할 델타가 없으므로). 별도로 `--skip-specs` 플래그를 사용하면 터미널 명령어가 명세 단계를 명시적으로 건너뛰도록 설정할 수 있습니다:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

이 플래그는 도구, CI, 문서만 변경하는 경우에도 유용합니다. 원칙은 다음과 같습니다: 명세는 동작을 설명하므로, 동작이 변경되지 않았다면 명세도 변경되지 않아야 합니다. 자세한 내용은 [개념](concepts.md#what-a-spec-is-and-is-not)을 참고하세요.

## 레시피 6: 단계별 제어 (확장 명령어)

**사용 시기:** 복잡하거나 위험이 있는 변경 사항으로, 다음 단계로 넘어가기 전 각 아티팩트를 검토하고 싶을 때 사용합니다.

기본 `/opsx:propose` 명령어는 모든 내용을 한 번에 초안을 작성합니다. 한 단계씩 진행하고 싶다면 확장 명령어를 활성화하세요:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

이제 점진적으로 뼈대를 만들고 구축할 수 있습니다:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

각 아티팩트가 생성될 때마다 검토하고, 자유롭게 수정한 후 만족하면 다음 단계로 넘어가세요. 나머지 계획 아티팩트를 한 번에 초안 작성하고 싶다면 `/opsx:ff`로 남은 아티팩트를 빠르게 생성할 수 있습니다. 보관하기 전에 `/opsx:verify`로 구현 내용이 실제로 명세와 일치하는지 확인하세요. 자세한 내용은 [워크플로우](workflows.md#opsxff-vs-opsxcontinue)를 참고하세요.

## 레시피 7: 전체 워크플로우를 직접 체험하며 배우기

**사용 시기:** OpenSpec를 설치했고, 예제가 아닌 실제 자신의 코드로 워크플로우를 *직접 체험*해보고 싶을 때 사용합니다.

먼저 확장 명령어를 활성화하세요(레시피 6 참고), 그 다음:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard`은 실제(소규모) 개선 사항을 찾아 변경 사항을 생성하고, 구현한 후 보관까지 전체 과정을 단계별로 설명해줍니다. 소요 시간은 15~30분이며, 완료 후 유지하거나 삭제할 수 있는 실제 변경 사항이 남습니다. 가장 부드럽게 배울 수 있는 방법입니다. 자세한 내용은 [명령어](commands.md#opsxonboard)를 참고하세요.

## 터미널에서 작업 결과 확인하기

언제든 터미널에서 현재 상태를 확인할 수 있습니다:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

이 명령어들은 읽기 및 검사용 도구입니다. 제안과 구현은 여전히 채팅의 슬래시 명령어로 진행됩니다. 자세한 내용은 [CLI 참고 문서](cli.md)에서 확인하세요.

## 다음으로 확인할 내용

- [먼저 탐색하기](explore.md): 확실하지 않을 때 추천하는 시작 방식
- [워크플로우](workflows.md): 위에서 소개한 패턴과 각 패턴의 사용 시기 결정 가이드
- [명령어](commands.md): 모든 슬래시 명령어의 상세 설명
- [시작하기](getting-started.md): 첫 변경 사항 적용의 표준 가이드
- [개념](concepts.md): 각 구성 요소가 이렇게 설계된 이유