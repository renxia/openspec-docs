# FAQ

가장 자주 묻는 질문에 대한 빠른 답변입니다. 만약 질문이 "무언가 고장났어요"와 같은 문제라면 [Troubleshooting](troubleshooting.md) 페이지를 참조하십시오. 용어 정의가 필요하다면 [Glossary](glossary.md)를 참고하십시오.

## 기본 사항 (The basics)

### OpenSpec이란 무엇인가요? 한 문장으로 설명해주세요.

OpenSpec은 코드를 작성하기 전에 당신과 AI 코딩 어시스턴트가 무엇을 구축할지에 대해 서면으로 합의하게 해주는 경량 레이어입니다.

### 왜 필요하나요?

AI 어시스턴트는 틀렸을 때조차 확신하는 경향이 있기 때문입니다. 요구사항이 채팅 스레드에만 존재하면 AI는 추측으로 빈틈을 채우게 되고, 코드가 생성된 후에야 이를 알게 됩니다. OpenSpec은 실수가 저렴하게 수정될 수 있는 더 이른 단계에서 합의를 이루어줍니다. 전체적인 내용은 [Core Concepts at a Glance](overview.md)를 참고하십시오.

### 모든 것에 사용해야 하나요?

아닙니다. 합의가 중요한 곳, 즉 대부분의 비자명한 작업에 사용하세요. 한 글자의 오타 수정에는 그 의식(ceremony)이 필요하지 않을 수 있으며, 그것은 괜찮습니다.

### 대규모 기존 코드베이스에서 사용할 수 있나요, 아니면 새 프로젝트에서만 사용 가능한가요?

기존 코드베이스가 주된 대상입니다. OpenSpec은 brownfield-first 방식입니다: 즉, 전체 앱을 미리 문서화할 필요가 없습니다. 각 변경 사항이 어떤 부분을 건드리는지에 대해서만 스펙을 작성하며, 실제 작업을 진행하면서 스펙이 점차적으로 채워집니다. 이에 대한 전용 가이드가 있습니다: [Using OpenSpec in an Existing Project](existing-projects.md).

### 특정 AI 도구에 종속되어 있나요?

아닙니다. OpenSpec은 Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex 등을 포함하여 25개 이상의 어시스턴트와 함께 작동합니다. 전체 목록과 각 도구별 세부 정보는 [Supported Tools](supported-tools.md)를 참조하십시오.

## 명령어 실행 (Running commands)

### `/opsx:propose`를 어디에 입력해야 하나요?

터미널이 아닌 AI 어시스턴트의 채팅창에 입력해야 합니다. 이것이 가장 흔한 혼란 지점이므로, 이에 대한 별도의 페이지가 있습니다: [How Commands Work](how-commands-work.md). 간단히 말하면, `openspec ...`은 터미널에서 실행되고, `/opsx:...`는 채팅에서 실행됩니다.

### "대화형 모드(interactive mode)"를 어떻게 시작하나요?

별도의 모드를 시작하는 것은 없습니다. 평소처럼 AI 어시스턴트를 열고 슬래시 명령어를 채팅창에 입력하십시오. 이 슬래시 명령어가 OpenSpec을 "진입"하는 방법입니다. (진정으로 대화형인 터미널 기능은 스펙과 변경 사항을 탐색하기 위한 대시보드인 `openspec view`입니다.) 자세한 설명은 [How Commands Work](how-commands-work.md)를 참고하십시오.

### 슬래시 명령어를 입력했는데 아무 일도 일어나지 않았습니다. 왜 그런가요?

대부분 터미널에 입력했거나, 아직 해당 명령어가 설치되지 않았기 때문일 가능성이 높습니다. 프로젝트에서 `openspec update`를 실행하고 어시스턴트를 재시작한 다음, 채팅창에 `/opsx`를 입력하고 자동 완성(autocomplete)을 확인해 보세요. [Troubleshooting](troubleshooting.md#commands-dont-show-up)에 전체 체크리스트가 있습니다.

### 왜 어떤 도구에서는 `/opsx:propose`이고 다른 도구에서는 `/opsx-propose`인가요?

각 AI 도구가 사용자 지정 명령어를 약간 다르게 표시하기 때문입니다. 의도는 동일하며, 구두점만 다릅니다. 채팅창에 슬래시를 입력하면 해당 도구가 기대하는 형식을 자동 완성으로 보여줍니다. 각 도구별 표는 [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool)에 있습니다.

### 스킬(skill)과 명령어(command)의 차이점은 무엇인가요?

둘 다 OpenSpec이 어시스턴트가 워크플로우를 실행할 수 있도록 작성하는 파일입니다. Skills (`.../skills/openspec-*/SKILL.md`)는 더 최신이며 크로스-툴 표준이고, Commands (`.../commands/opsx-*`)는 이전 버전의 도구별 슬래시 파일입니다. 둘 중 하나를 선택할 필요가 없습니다. 슬래시 명령어를 입력하기만 하면 OpenSpec이 해당 도구가 사용하는 것을 설치합니다.

## 워크플로우 (The workflow)

### 무엇을 구축해야 할지 확신하지 못한다면 어디서부터 시작해야 하나요?

`/opsx:explore`로 시작하십시오. 이것은 코드를 읽고, 옵션을 제시하며, 어떤 변경이나 코드도 존재하기 전에 모호한 문제를 구체적인 계획으로 바꾸어 주는 부담 없는 사고 파트너입니다. 기본 프로필드에 있으므로 항상 사용할 수 있습니다. 계획이 명확해지면 `/opsx:propose`로 작업을 넘깁니다. 이는 가장 좋은 습관리를 형성하는 방법인데, 성급한 AI가 잘못된 것을 확신을 가지고 구축하는 것을 막아주기 때문입니다. [Explore First](explore.md)를 참고하십시오.

### 가장 간단한 흐름은 무엇인가요?

```text
/opsx:explore (선택 사항)   다음으로   /opsx:propose <원하는 바>   다음으로   /opsx:apply   다음으로   /opsx:archive
```

탐색(Explore)을 통해 생각하고, 제안(Propose)을 통해 계획 초안을 작성하며, 적용(Apply)을 통해 구축하고, 보관(Archive)을 통해 파일로 정리합니다. 원하는 바를 정확히 알고 있다면 탐색은 건너뛰십시오.

### `/opsx:propose`와 `/opsx:new`의 차이점은 무엇인가요?

`/opsx:propose`는 기본 단일 단계 명령어입니다. 변경 사항을 생성하고 모든 계획 산출물(planning artifacts)을 한 번에 초안 작성합니다. `/opsx:new`는 확장된 명령어 세트의 일부이며 빈 변경 사항만 스캐폴딩(scaffolds)하고, 사용자가 `/opsx:continue`(또는 모두 한 번에 `/opsx:ff`)를 통해 산출물을 하나씩 생성하도록 남겨둡니다. 단계별 제어(step-by-step control)를 원하지 않는 이상은 propose를 사용하십시오. [Commands](commands.md)를 참고하십시오.

### `core`와 expanded 프로필드는 무엇인가요?

프로필드는 어떤 슬래시 명령어가 설치될지 결정합니다. **Core** (기본값)는 `propose`, `explore`, `apply`, `sync`, `archive`를 제공합니다. **Expanded** 세트는 더 세밀한 제어를 위해 `new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`를 추가합니다. `openspec config profile`로 전환한 다음, `openspec update`로 적용하십시오.

### `/opsx:sync`를 실행해야 하나요?

대부분 필요하지 않습니다. Sync는 변경 사항의 델타 스펙(delta specs)을 메인 스펙에 병합하며, `/opsx:archive`가 이를 대신 수행할지 여부를 물어볼 것입니다. 예를 들어 장기간 진행되는 변경 사항에 대해 보관하기 전에 스펙이 병합되기를 원할 때만 수동으로 sync를 실행하십시오. [Commands](commands.md#opsxsync)를 참고하십시오.

### 시작한 후에 제안(proposal), 스펙(spec), 또는 태스크(task)를 수정하려면 어떻게 해야 하나요?

파일을 수정하기만 하면 됩니다. 모든 산출물은 `openspec/changes/<name>/`에 일반 Markdown 파일로 존재하며, 잠긴 단계나 특별한 편집 모드가 없습니다. 수동으로 변경하거나 AI에게 "큐(queue)를 사용하도록 설계를 업데이트해"와 같이 요청하여 수정하게 한 다음 계속 진행하십시오. AI는 항상 현재 파일 내용을 기반으로 작동합니다. 전체 가이드는 [Editing & Iterating on a Change](editing-changes.md)에 있습니다.

### 일부를 구현한 후 계획을 되돌려 변경할 수 있나요?

네, 언제든지 가능합니다. 워크플로우는 유동적이므로 검토 및 편집은 잠기지 않는 단계입니다. 산출물을 수정하고 계속 진행하십시오. 코드가 여전히 계획과 일치하는지 구조화된 확인을 원한다면 `/opsx:verify`를 실행하십시오. [Editing & Iterating on a Change](editing-changes.md#how-do-i-go-back-to-review-after-implementing)를 참고하십시오.

### 코드를 수동으로 수정했습니다. 이를 스펙과 어떻게 조화시킬까요?

보관(archive)을 하기 전에 두 가지를 동기화해야 합니다. 왜냐하면 보관은 당신의 스펙을 진실의 기록(record of truth)으로 만들기 때문입니다. 만약 코드가 이제 올바르다면, 델타 스펙을 배포한 내용과 일치하도록 업데이트하십시오. 만약 스펙이 올바르다면, 코드가 동의할 때까지 계속 구축하십시오. `/opsx:verify`가 불일치를 보여줍니다. [Editing & Iterating on a Change](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec)를 참고하십시오.

### 기존 변경 사항을 업데이트해야 할까요, 아니면 새로운 것을 시작해야 할까요?

동일한 작업을 개선하는 것이라면 업데이트하십시오. 의도가 근본적으로 바뀌었거나 범위가 다른 작업으로 폭발적으로 확장되었다면 새로 시작하십시오. [Workflows](workflows.md#when-to-update-vs-start-fresh)에 결정 흐름도와 예시가 있습니다.

### 세션이 컨텍스트 부족 상태가 되거나 구현 도중에 요구사항이 변경되면 어떻게 하나요?

바로 이 지점에서 스펙의 가치가 생깁니다. 계획이 파일(단순히 채팅 기록뿐만 아니라)에 존재하기 때문에, 컨텍스트를 정리하고 새로운 AI 세션을 시작한 다음 `/opsx:apply`로 재개할 수 있습니다. 이는 산출물을 읽고 첫 번째 확인되지 않은 태스크부터 재개합니다. 요구사항이 변경되면, 아티팩트를 수정하여 새로운 현실과 일치시키고 계속 진행하십시오. 깨끗한 컨텍스트 창을 유지하는 것도 더 나은 결과를 가져옵니다. 구현 전에 정리하십시오.

### `openspec/` 폴더를 git에 커밋해야 하나요?

네. 당신의 스펙, 활성 변경 사항 및 아카이브는 프로젝트 기록의 일부입니다. 다른 어떤 소스 코드와 마찬가지로 커밋하십시오. 특히 아카이브는 시스템이 작동하는 이유에 대한 영구적인 기록이 됩니다.

## 스펙과 변경 사항 (Specs and changes)

### 스펙(spec)에 넣어야 할 것과 디자인(design)에 넣어야 할 것은 무엇인가요?

스펙은 관찰 가능한 동작을 설명합니다: 시스템이 무엇을 하는지, 입력값, 출력값 및 오류 조건. 디자인은 어떻게 구축할 것인지 설명합니다: 기술적 접근 방식, 아키텍처 결정, 파일 변경 사항. 구현이 외부적으로 보이는 동작을 바꾸지 않고도 바뀔 수 있다면, 그것은 스펙이 아닌 디자인에 속해야 합니다. [Concepts](concepts.md#what-a-spec-is-and-is-not)에서 더 깊이 다룹니다.

### 델타 스펙(delta spec)이란 무엇인가요?

전체 스펙을 다시 기술하는 대신, `ADDED`, `MODIFIED`, `REMOVED` 섹션을 사용하여 변경되는 내용만을 설명하는 스펙입니다. 이는 OpenSpec이 기존 시스템의 편집 사항을 깔끔하게 처리하는 방법입니다. [Concepts](concepts.md#delta-specs)를 참고하십시오.

### 보관된(archived) 변경 사항은 어디에 저장되나요?

모든 산출물이 보존된 채로 `openspec/changes/archive/YYYY-MM-DD-<name>/`에 저장됩니다. 아무것도 삭제되지 않으며, 해당 변경 사항이 활성 목록에서 제외될 뿐입니다.

## 구성 및 사용자 정의 (Configuration and customization)

### AI에게 기술 스택(tech stack)을 알려주려면 어떻게 해야 하나요?

`openspec/config.yaml` 파일의 `context:` 아래에 넣으십시오. 이 텍스트는 모든 계획 요청에 주입되므로, AI는 항상 당신의 스택과 관례를 알게 됩니다. [Customization](customization.md#project-configuration)을 참고하십시오.

### 영어 외의 언어로 스펙을 생성할 수 있나요?

네. 설정 파일의 `context:`에 언어 지침을 추가하십시오. [Multi-Language](multi-language.md)에는 여러 언어에 대한 복사 붙여넣기용 단편(snippets)이 있습니다.

### 워크플로우 자체를 변경할 수 있나요?

예, 사용자 지정 스키마(custom schemas)로 가능합니다. 스키마는 어떤 산출물이 존재하며 그것들이 서로 어떻게 의존하는지를 정의합니다. `openspec schema fork spec-driven my-workflow`로 기본값을 포크(fork)한 다음 편집하십시오. [Customization](customization.md#custom-schemas)를 참고하십시오.

## 모델, 개인 정보 보호 및 업그레이드 (Models, privacy, and upgrades)

### 어떤 AI 모델을 사용해야 하나요?

OpenSpec은 높은 추론 능력을 가진 모델과 가장 잘 작동합니다. README는 계획 및 구현 모두에 대해 Codex 5.5와 Opus 4.7 같은 모델을 권장합니다. 또한 컨텍스트 창을 깨끗하게 유지하십시오: 최상의 결과를 위해서는 구현 전에 정리하는 것이 좋습니다.

### OpenSpec이 데이터를 수집하나요?

익명화된 사용 통계(command 이름과 버전만)를 수집합니다. 인자, 경로, 콘텐츠 또는 개인 데이터는 수집하지 않으며, CI에서는 자동으로 비활성화됩니다. `export OPENSPEC_TELEMETRY=0` 또는 `export DO_NOT_TRACK=1`로 거부할 수 있습니다.

### 어떻게 업그레이드하나요?

두 단계입니다. 패키지를 업그레이드하고 (`npm install -g @fission-ai/openspec@latest`), 각 프로젝트 내에서 `openspec update`를 실행하여 생성된 스킬과 명령어를 새로 고치십시오.

### OpenSpec을 어떻게 제거하나요?

제거 명령어는 없습니다. 왜냐하면 이것은 전역 패키지(global package)와 프로젝트 파일의 조합이기 때문입니다. 패키지를 제거하고 (`npm uninstall -g @fission-ai/openspec`), 선택적으로 `openspec/` 디렉토리와 생성된 도구 파일을 삭제하십시오. 무엇을 보관해야 하는지에 대한 단계별 지침은 [Installation: Uninstalling](installation.md#uninstalling)에 있습니다.

## 도움 요청 (Getting help)

### 질문을 하거나 버그를 보고하려면 어디로 가야 하나요?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **터미널에서:** `openspec feedback "당신의 메시지"`를 실행하면 GitHub 이슈가 열립니다.

### 이 문서가 틀렸거나 혼란스럽습니다. 어떻게 해야 하나요?

저에게 알려주시거나, 고쳐주십시오. 문서 PR(Pull Request)은 환영하며 높이 평가됩니다. 이슈를 열거나 풀 리퀘스트를 보내주세요.