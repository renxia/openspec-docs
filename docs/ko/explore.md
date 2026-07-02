# 탐색(Explore) 살펴보기

**`/opsx:explore`는 당신의 사고 파트너입니다. 문제가 있지만 아직 해결책이 정해지지 않았을 때 언제든지 이를 활용하십시오.** 이는 코드베이스를 조사하고, 다양한 옵션에 대해 함께 숙고하며, 단 하나의 아티팩트나 코드가 생성되기 전에 실제로 무엇을 원하는지 명확하게 해줍니다. 그림이 선명해지면 `/opsx:propose`로 작업을 인계합니다.

만약 이 문서들에서 한 가지 습관을 얻는다면, 이것을 기억하십시오. **확신이 서지 않을 때는 제안하기 전에 먼저 탐색(explore)하세요.**

이것이 왜 중요한가요? AI 코딩 어시스턴트는 열정적입니다. 모호하게 질문하면 그들은 자신 있게 *무언가*를 만들겠지만, 그것이 당신이 필요로 했던 것이 아닐 수도 있습니다. 탐색은 해독제입니다. 이는 당신과 AI가 올바른 방향을 함께 찾아내는 위험 부담 없는 대화이며, 제안을 할 때쯤이면 올바른 것을 제안하게 됩니다.

## 언제 탐색해야 하는가

탐색은 사람들이 생각하는 것보다 더 자주 필요한 첫 단계입니다. 다음 중 하나라도 해당된다면 이를 사용하십시오.

- *문제*는 알지만 *해결책*은 모를 때. ("페이지 로딩이 느립니다." "인증(Auth)에 문제가 있습니다." "반복 주문을 계속 받고 있습니다.")
- 여러 접근 방식 중에서 선택해야 하며, 실제 코드와 비교하여 장단점(tradeoffs)을 알고 싶을 때.
- 코드베이스가 처음이며, 변경하기 전에 작동 방식을 이해해야 할 때.
- 요구 사항이 모호하고, 확정하기 전에 이를 명확하게 다듬고 싶을 때.
- 작업의 범위가 보이는 것보다 더 크거나 작다고 의심하며, 솔직하게 범위를 설정하고 싶을 때.

이미 원하는 바와 방법을 정확히 알고 있다면 탐색은 건너뛰십시오. 그럴 때는 바로 [`/opsx:propose`](commands.md#opsxpropose)로 이동하십시오.

## 무엇을 하는가 (그리고 하지 않는 것)

탐색은 생성기가 아니라 **대화**입니다.

**하는 일:**
- 실제 질문에 답하기 위해 코드베이스를 읽고 검색합니다.
- 옵션을 비교하고 각 옵션의 장단점을 명시합니다.
- 설계를 이해하기 위한 다이어그램을 그립니다.
- 모호한 아이디어를 구체적이고 구축 가능한 범위로 좁히는 것을 돕습니다.
- 준비가 되면 `/opsx:propose`로 전환합니다.

**하지 않는 일:**
- 변경 폴더를 생성하지 않습니다.
- 어떠한 아티팩트(제안서, 사양서, 설계, 작업 목록)도 작성하지 않습니다.
- 코드를 작성하거나 수정하지 않습니다.

이것이 핵심입니다. 탐색은 비용이 들지 않으며 어떤 것에 대해서도 약속을 하지 않습니다. 세 가지 막다른 길을 탐색하고 각 것에서 무언가를 배운 후에야 비로소 살아남은 경로를 제안할 수 있습니다.

## 이미 설치되어 있습니다

좋은 소식입니다: `/opsx:explore`는 `propose`, `apply`, `sync`, `archive`와 함께 기본 **core** 프로필드에 포함되어 제공됩니다. 활성화할 필요가 없습니다. 프로젝트에 OpenSpec이 설정되어 있다면, AI 채팅에서 탐색 기능을 사용할 수 있습니다. (모든 `/opsx:*` 명령어와 마찬가지로, 터미널이 아닌 어시스턴트의 채팅창에 입력하십시오. [How Commands Work](how-commands-work.md)를 참조하십시오.)

## 전체 예시

어떻게 모호한 걱정이 명확하고 구축 가능한 변경 사항으로 변하는지 살펴보십시오.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

무슨 일이 일어났는지 주목하십시오. 시작점은 "뭔가 잘못되었고 만지는 것이 두렵다"였습니다. 20초간의 탐색이 그것을 명명된 근본 원인, 세 가지 순위별 옵션, 기존 코드에 연결된 권장 사항, 그리고 정확한 변경으로 바꾼 것입니다. 뒤따르는 제안은 사전에 사고가 있었기 때문에 날카롭습니다.

## Propose로 인계하기

탐색은 어떤 것에 대해서도 아카이브(archive)하지 않습니다. 준비가 되면, 단순히 변경을 시작하고 AI는 대화의 맥락을 아티팩트에 담아냅니다.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

평범한 언어로 말할 수도 있습니다("이것을 변경 사항으로 만들자") 또는 `/opsx:propose <name>`을 직접 실행할 수 있습니다. 어느 쪽이든, 방금 수행한 탐색은 버려지는 대화가 아니라 제안의 기반이 됩니다.

확장된 명령어 세트를 사용하면 탐색은 단계별 아티팩트 생성을 위해 `/opsx:new`로 인계될 수도 있습니다. [Workflows](workflows.md)를 참조하십시오.

## 성공적인 탐색을 위한 팁

- **해결책이 아닌 문제를 가져오십시오.** "로그인 속도가 느립니다"는 AI에게 조사할 여지를 줍니다. "Redis 캐시 추가"는 아직 테스트하지 않은 답변에 미리 약속하는 것입니다.
- **장단점을 소리 내어 물어보십시오.** "각 옵션의 단점은 무엇입니까?"라고 물으면 더 정직한 비교를 얻을 수 있습니다.
- **먼저 읽게 하십시오.** 최고의 탐색은 AI가 추측하는 것이 아니라 실제로 코드를 보는 것에서 시작됩니다. 도움이 된다면 관련 영역을 지정해 주십시오.
- **포기해도 괜찮습니다.** 탐색 결과 아이디어가 가치가 없다고 밝혀진다면, 그것 자체가 승리입니다. 저렴하게 배웠기 때문입니다.
- **변경 도중에 다시 탐색하십시오.** `/opsx:apply` 중에 막혔습니까? 한 단계 뒤로 물러나 서브 문제를 탐색한 다음 돌아올 수 있습니다.

## 솔직한 장단점

**얻는 것:** 탐색은 어떤 아티팩트가 존재하기 전에 가장 저렴한 순간에 잘못된 방향을 잡아냅니다. 특히 AI가 시스템을 읽고 요약하는 능력이 하루 종일 파헤클링(spelunking) 하는 시간을 절약해 주는 익숙하지 않은 코드에서 강력합니다.

**비용:** 약간의 인내심입니다. 탐색은 대화이기 때문에, `/opsx:propose`를 실행하고 희망하는 것보다 느립니다. 이미 진정으로 이해하고 있는 작업에 대해서는 그 추가 단계가 순수한 오버헤드(overhead)이므로 건너뛰어야 합니다.

일반적인 규칙: 작업이 모호할수록 탐색의 효과가 큽니다. 작업이 명확할수록 제안으로 바로 넘어갈 수 있습니다.

## 다음으로 나아갈 곳

- [Commands: `/opsx:explore`](commands.md#opsxexplore): 정확한 참조
- [Workflows](workflows.md): 일상적인 루프의 일부로서 탐색
- [Examples & Recipes](examples.md#recipe-3-exploring-before-you-commit): 전체 워크스루를 통한 탐색
- [Getting Started](getting-started.md): 탐색을 포함한 첫 번째 변경 가이드