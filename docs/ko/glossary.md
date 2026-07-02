# 용어집

모든 OpenSpec 용어를 한곳에 모아 평이한 언어로 정의했습니다. 한번 훑어보면 나머지 문서를 더 빠르게 읽을 수 있습니다.

용어는 주제별로 그룹화되어 있으며, 각 그룹 내에서는 알파벳순으로 정렬되어 있습니다.

## 핵심 명사 (The core nouns)

**Spec.** 시스템의 일부가 어떻게 작동하는지를 설명하는 문서입니다. Specs는 `openspec/specs/`에 존재하며, 도메인별로 구성되고 요구사항과 시나리오로 이루어져 있습니다. Spec은 "이 소프트웨어가 무엇을 하는가?"라는 질문에 대한 합의된 답변입니다. [Concepts](concepts.md#specs)를 참조하십시오.

**Source of truth.** `openspec/specs/` 디렉토리 전체를 의미합니다. 이는 시스템의 현재, 합의된 동작 방식을 담고 있습니다. 변경 사항은 이에 대한 편집을 제안하며, 아카이브(archiving)는 이를 적용합니다.

**Change.** 하나의 작업 단위이며, `openspec/changes/<name>/` 아래에 폴더 형태로 패키징됩니다. Change는 해당 작업에 관한 모든 것(제안, 설계, 태스크, 그리고 도입하는 spec 편집 사항)을 담고 있습니다. 한 개의 Change는 하나의 기능 또는 수정사항입니다.

**Artifact.** Change 내부에 있는 문서입니다. 표준 Artifact는 제안(proposal), 델타 spec(delta specs), 설계(design), 태스크(tasks)입니다. 이들은 의존성 순서대로 생성되며 서로에게 정보를 제공합니다.

**Delta spec.** Change 내부에 있으며, 전체 Spec을 다시 설명하는 대신 `ADDED`, `MODIFIED`, `REMOVED` 섹션을 사용하여 변경되는 내용만을 기술하는 Spec입니다. 이것이 OpenSpec이 기존 시스템을 깔끔하게 편집할 수 있게 하는 요소입니다. [Concepts](concepts.md#delta-specs)를 참조하십시오.

**Domain.** `auth/`, `payments/`, 또는 `ui/`와 같은 Spec의 논리적 그룹화 단위입니다. 도메인은 시스템에 대해 어떻게 생각하는지에 따라 선택합니다.

## Spec 내부 (Inside a spec)

**Requirement.** 시스템이 반드시 가져야 하는 단일한 동작입니다. 보통 RFC 2119 키워드("The system SHALL expire sessions after 30 minutes.")로 작성됩니다. Requirement는 *무엇(what)*을 기술하며, *어떻게(how)*를 기술하지 않습니다.

**Scenario.** 요구사항이 실제로 작동하는 구체적이고 테스트 가능한 예시이며, 일반적으로 Given/When/Then 형식으로 작성됩니다. Scenario는 요구사항을 검증 가능하게 만듭니다. 이를 통해 자동화된 테스트를 작성할 수 있습니다.

**RFC 2119 keywords.** MUST, SHALL, SHOULD, MAY라는 단어로, 이는 요구사항의 엄격함에 대한 표준화된 의미를 담고 있습니다. MUST와 SHALL은 절대적입니다. SHOULD는 예외가 있을 수 있는 권장 사항입니다. MAY는 선택 사항입니다. 이 이름은 해당 키워드를 정의한 인터넷 표준 문서를 따릅니다.

## Artifact (The artifacts)

**Proposal (`proposal.md`).** Change의 *이유(why)*와 *무엇(what)*을 담고 있습니다: 의도, 범위 및 고수준 접근 방식입니다. 가장 먼저 생성하는 Artifact입니다.

**Design (`design.md`).** *어떻게(how)*를 다룹니다: 기술적 접근 방식, 아키텍처 결정 사항 및 건드려야 할 파일들입니다. 간단한 Change의 경우 선택 사항입니다.

**Tasks (`tasks.md`).** 체크박스가 있는 구현 체크리스트입니다. AI는 `/opsx:apply` 과정에서 이를 처리하며 진행에 따라 항목을 체크합니다.

## 라이프사이클 (The lifecycle)

**Archive.** Change를 완료하는 행위입니다. 해당 델타 spec은 메인 Spec으로 병합되며, Change 폴더는 `openspec/changes/archive/YYYY-MM-DD-<name>/`로 이동됩니다. 아카이브 후, 사용자의 Spec은 새로운 현실을 기술합니다. [Concepts](concepts.md#archive)를 참조하십시오.

**Sync.** Change의 델타 spec을 메인 Spec으로 병합하되, Change 자체는 아카이브하지 않는 것입니다. 일반적으로 자동(아카이브가 수행할 것을 제안함)이지만, 장기 실행되는 Change에 대해서는 `/opsx:sync`로 단독 사용이 가능합니다. [Commands](commands.md#opsxsync)를 참조하십시오.

## 워크플로우 및 명령어 (Workflow and commands)

**OPSX.** 경직된 단계 대신 유동적인 액션(fluid actions)을 중심으로 구축된 현재의 표준 OpenSpec 워크플로우입니다. 모든 슬래시 명령어는 `/opsx:`로 시작합니다. [OPSX Workflow](opsx.md)를 참조하십시오.

**Slash command.** AI 어시스턴트 채팅창에 입력하는 명령어이며, 예시로 `/opsx:propose`가 있습니다. Slash command는 워크플로우를 구동합니다. 이는 터미널 명령어가 아닙니다. [How Commands Work](how-commands-work.md)를 참조하십시오.

**Explore (`/opsx:explore`).** 사고 파트너 명령어입니다. 코드베이스를 읽고, 옵션들을 비교하며, 모호한 아이디어를 구체적인 계획으로 명확히 합니다. 이 과정에서 Artifact를 생성하거나 코드를 작성하지 않습니다. 문제가 있지만 아직 계획이 없는 경우에 권장되는 시작점입니다. [Explore First](explore.md)를 참조하십시오.

**CLI.** 터미널에서 실행하는 `openspec` 프로그램입니다. 프로젝트를 설정하고, Change를 나열 및 검증하며, 대시보드를 열고, 아카이브합니다. OpenSpec의 터미널 측면을 담당합니다. [CLI](cli.md)를 참조하십시오.

**Skill.** AI 어시스턴트가 자동 감지하고 따르는 일련의 지침 폴더(`.../skills/openspec-*/SKILL.md`)입니다. Skill은 OpenSpec 워크플로우를 어시스턴트에게 전달하기 위한 떠오르는 크로스 툴 표준입니다.

**Command file.** 도구별 슬래시 명령어 파일(`.../commands/opsx-*`)입니다. 여전히 지원되지만, Skill과 함께 사용되는 이전의 배포 메커니즘입니다. 이 파일을 직접 건드리는 경우는 거의 없습니다.

**Profile.** 프로젝트에 설치된 슬래시 명령어 세트입니다. **Core**(기본값)에는 `propose`, `explore`, `apply`, `sync`, `archive`가 포함됩니다. **Expanded** 세트는 `new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`를 추가합니다. 이는 `openspec config profile`로 변경할 수 있습니다.

**Delivery.** OpenSpec이 도구를 위해 Skill, Command file 또는 둘 다를 설치하는지 여부입니다. 전역적으로 설정되며 `openspec update`로 적용됩니다.

## 사용자 정의 (Customization)

**Schema.** 워크플로우가 어떤 Artifact를 가지며, 이들이 서로 어떻게 의존하는지에 대한 정의입니다. 내장된 기본값은 `spec-driven`(proposal → specs → design → tasks)입니다. 이를 포크하거나 자신만의 것을 작성할 수 있습니다. [Customization](customization.md#custom-schemas)를 참조하십시오.

**Template.** Schema 내부에 있으며, 주어진 Artifact에 대해 AI가 무엇을 생성할지 형태를 잡는 Markdown 파일입니다. Template을 편집하면 재빌드 없이 AI의 출력이 즉시 변경됩니다.

**Project config (`openspec/config.yaml`).** 프로젝트별 설정입니다: 기본 Schema, 모든 계획 요청에 주입되는 `context:`, 그리고 Artifact별 `rules:`입니다. OpenSpec에게 자신의 스택과 관례를 가르치는 가장 쉬운 방법입니다. [Customization](customization.md#project-configuration)을 참조하십시오.

**Context injection.** 프로젝트 배경 정보를 `config.yaml`의 `context:` 필드에 넣어 AI가 생성하는 모든 Artifact에 자동으로 추가되도록 하는 것입니다. 이는 AI가 별도의 파일을 읽기를 바라는 것보다 더 신뢰할 수 있는 방법입니다.

**Dependency graph.** Artifact의 `requires:` 관계를 통해 형성되는 방향성 그래프입니다. 이는 DAG(Directed Acyclic Graph: 화살표는 항상 앞으로 향하며 순환하지 않음)이며, OpenSpec은 이를 사용하여 다음에 무엇을 만들 수 있는지 파악합니다.

**Enablers, not gates.** 이 원칙은 Artifact 의존성이 다음에 *필요한* 것이 아니라 다음에 *가능해지는* 것을 보여준다는 것입니다. 사용자는 언제든지 모든 Artifact를 검토하고 편집할 수 있습니다. [Core Concepts at a Glance](overview.md#enablers-not-gates)를 참조하십시오.

## 리포지토리 간 조정 (beta)

이 용어들은 계획 범위가 하나 이상의 리포지토리를 아우르는 경우에만 적용됩니다. 이 기능은 베타 버전입니다. 대부분의 사용자는 이를 무시할 수 있습니다. [Stores User Guide](stores-beta/user-guide.md)를 참조하십시오.

**Store.** 오직 계획만을 목적으로 하는 독립적인 리포지토리입니다. 이미 알고 있는 것과 같은 `openspec/` 형태(specs 및 changes)에 작은 식별 파일이 추가되어 있습니다. 사용자는 자신의 기계에 한 번 등록하면, 어떤 OpenSpec 명령어라도 어디서든 이 Store에서 작동할 수 있게 됩니다.

**Reference.** 코드 리포지토리의 `openspec/config.yaml` 내에서 해당 리포지토리가 의존하는 Store를 선언하는 것입니다. Reference는 읽기 전용입니다: 리포지토리는 자신의 루트를 유지하며, `openspec instructions`는 참조된 Store의 Spec 인덱스를 얻게 되며, 각 항목에는 이를 가져올 정확한 명령어가 포함됩니다.

**Working context.** `openspec context`가 현재 리포지토리에 대해 조립하는 내용입니다: OpenSpec root와 그것이 참조하는 모든 Store 및 각각을 가져오는 방법입니다. "나는 무엇을 가지고 작업하고 있는가?"라는 질문에 대한 답입니다.

**Workset.** 사용자가 함께 여는 개인적이고 기계 로컬의 폴더 세트입니다(작업 중인 코드 리포지토리와 함께 여는 Store). `openspec workset create`로 명시적으로 생성되며, 이 로컬 경로에 관한 내용은 공유 계획 리포지토리에 커밋되지 않습니다.

## 참고 자료 (See also)

- [Core Concepts at a Glance](overview.md): 한 페이지에 담긴 다섯 가지 아이디어
- [Concepts](concepts.md): 상세 설명
- [How Commands Work](how-commands-work.md): Slash command와 CLI의 차이점