# 스토어: 자체 리포지토리에서 계획하기

> **베타.** 스토어(Stores), 참조(references), 작업 컨텍스트(working context), 워크셋(worksets)이 새로 추가되었습니다. 명령어 이름, 플래그, 파일 형식 및 JSON 출력은 릴리스 간에 계속 변경될 수 있습니다. 아래의 모든 워크스루(walkthrough)는 현재 빌드를 기준으로 실행되었지만, 업그레이드 후에는 이 가이드를 다시 읽어보십시오.

## 이것이 해결하는 문제

OpenSpec은 일반적으로 하나의 코드 리포지토리 내부에 존재합니다. 즉, 해당 리포지토리 옆에 있는 `openspec/` 폴더 안에 사양서(specs)와 변경 사항을 보관합니다.

하지만 계획 범위가 단일 리포지토리를 넘어설 때 이 방식으로는 한계가 있습니다.

- 작업이 여러 리포지토리에 걸쳐 진행됩니다. 예를 들어, 하나의 기능이 API 서버, 웹 앱 및 공유 라이브러리 모두에 영향을 미칩니다. 그렇다면 그 계획은 어느 `openspec/` 폴더 안에 존재해야 할까요?
- 팀이 코드가 존재하기 전에 계획을 세우거나, *이* 리포지토리에는 구현되지 않을 계획들을 세울 수 있습니다.
- 요구사항이 한 팀에 의해 소유되고 다른 팀에서 소비됩니다. 위키 버전은 계속 변하지만, 코딩 에이전트는 이를 읽을 수 없습니다.

**스토어(store)**가 해답입니다. 스토어는 오직 계획만을 목적으로 하는 독립적인 리포지토리입니다. 이는 여러분이 이미 알고 있는 것과 같은 `openspec/` 형태(사양서와 변경 사항)를 가지고 있으며, 작은 식별 파일 하나가 추가된 형태입니다. 사용자는 자신의 머신에 한 번 등록하고, 이후 모든 일반 OpenSpec 명령어를 어디에서든 사용할 수 있습니다.

## The shape

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

이 두 가지 규칙이 이를 단순하게 유지합니다.

1. **스토어는 단지 git 저장소입니다.** 스스로 커밋하고, 푸시하고, 풀링하며 검토합니다. OpenSpec은 자체적으로 클론하거나 동기화하거나 푸시하는 작업을 하지 않습니다.
2. **장치가 아닌 선언(Declarations)에 중점을 둡니다.** 저장소는 스토어와 어떻게 관련되는지를 *선언*할 수 있습니다 (아래 참조). 이 선언은 OpenSpec이 무엇을 알려줄 수 있는지 변화시키지만, 사용자의 명령이 어디에서 작동하는지는 결코 바꾸지 않습니다.

## 첫 번째 스토어까지 5분

두 가지 명령어만으로 아무것도 없는 상태에서 작동하는, 스토어 범위의 변경 사항을 만들 수 있습니다:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

이것이 전체 모델입니다. 여기서부터 라이프사이클은 `status`, `instructions`, `validate`, `archive` 등 사용자가 알고 있는 그대로이며, 모든 명령어에 `--store team-plans`를 추가하고, 출력되는 모든 힌트는 이를 위한 플래그를 담고 있습니다. `Using OpenSpec root:` 줄은 항상 명령어가 어디에서 작동하는지를 알려줍니다.

## 시나리오: 한 팀, 하나의 계획 저장소

팀은 자신의 스펙과 변경 사항을 코드 저장소에 분산시키는 대신 `team-plans`에 보관합니다.

**첫날 (설정하는 사람이):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

`--remote`를 전달하면 초기 커밋에 스토어 자체의 식별 파일(`.openspec-store/store.yaml`) 내부에 클론 URL이 기록됩니다. 모든 미래의 클론은 어디에서 왔는지 아는 상태로 태어나므로, 건강 검진 및 오류 메시지는 아직 해당 정보를 가지고 있지 않은 팀원을 위해 완전하고 복사 가능한 수정 사항을 출력할 수 있습니다.

**모든 팀원 (기기당 한 번):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

이후부터 모두는 이름으로 동일한 계획 저장소에서 작업합니다:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**작업 공유는 의도적으로 Git을 사용합니다.** 당신이 생성하는 변경 사항은 커밋하고 푸시하기 전까지는 당신의 체크아웃에만 존재하며, 이는 코드와 같습니다. 계획은 스토어가 일반적인 저장소이기 때문에 브랜치, 풀 리퀘스트 및 검토를 무료로 얻습니다.

**팀의 코드 저장소 연결하기.** 계획이 완전히 외부화된 코드 저장소는 `openspec/config.yaml`에 정확히 한 줄만 필요합니다:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

이제 `web-app` 내부에서 실행되는 모든 OpenSpec 명령어는 플래그 없이도 `--store`를 통해 `team-plans`에 대해 작동합니다:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

포인터는 대체 수단일 뿐, 절대적인 우위가 아닙니다. 명시적인 `--store`가 항상 우선하며, 만약 저장소가 자체적으로 실제 계획 폴더를 갖게 된다면 그것이 우선합니다 (오래된 포인터를 제거하라는 경고와 함께).

## 시나리오: 팀 경계를 넘는 요구사항

플랫폼 팀이 요구사항을 소유합니다. 제품 팀은 자신의 디자인과 자신의 저장소에서 이를 기반으로 구축합니다. 참조(reference)는 누구의 작업도 이동시키지 않으면서 그 관계를 설명합니다.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          │          └──────────────────────────┘
   └──────────────────────────┘
```

**제품 팀은 자신의 저장소 `openspec/config.yaml`에 무엇을 참조하는지 선언합니다:**

```yaml
references:
  - platform-reqs
```

참조는 읽기 전용 컨텍스트입니다. 저장소는 자체적인 `openspec/` 루트를 유지하며, 작업은 그곳에 머무릅니다. 변경되는 것은 해당 저장소의 `openspec instructions`가 이제 참조된 스토어의 스펙 인덱스를 포함한다는 점입니다. 각 스펙은 한 줄 요약과 정확한 가져오기 명령어(`openspec show <spec-id> --type spec --store platform-reqs`)를 가집니다. `api-server`에서 작업하는 에이전트는 상위 결제 요구사항을 찾고, 이를 인용하며, 자신의 로우레벨 디자인을 저장소 자체의 루트에 작성할 수 있습니다 — 아무도 컨텍스트를 복사 붙여넣기 할 필요 없이요.

참조는 클론 소스를 가질 수 있으므로, 아직 스토어를 가지고 있지 않은 팀원들에게 막다른 길 대신 완전한 수정 사항을 제공합니다:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**계획과 코드를 함께 열고 싶다면, 워크셋(workset)을 만드세요.** 이것은 개인적이고 명시적인 것입니다: 각 사람은 자신의 기기에서 실제로 작업하는 폴더를 선택합니다. 이러한 로컬 체크아웃 경로는 공유 계획 저장소에 커밋되지 않습니다.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## 항상 던질 수 있는 두 가지 질문

**"내 설정이 건강한가요?"** — `openspec doctor`는 현재 루트와 참조된 스토어를 읽기 전용으로 확인하며, 각 발견 사항에 대해 복사 가능한 수정 사항을 제공합니다:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"나는 무엇을 가지고 작업하고 있나요?"** — `openspec context`는 OpenSpec 선언으로부터 워킹셋(working set)을 조립합니다: 루트와 그것이 참조하는 스토어들.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

두 명령어 모두 에이전트를 위해 `--json`을 지원합니다. `openspec context --code-workspace <path>`는 전체 세트(the whole set)를 포함하는 VS Code 워크스페이스 파일을 추가로 작성하며, 이 명령어가 수행하는 유일한 쓰기 작업입니다.

## 워크셋: 함께 작업하는 폴더 다시 열기

위의 모든 내용과 별개로, 대부분의 사람들은 매번 세션마다 같은 몇 개의 폴더를 엽니다 — 계획 저장소와 두세 개의 코드 저장소입니다. **워크셋(workset)**은 이 모든 것의 개인적이고 명명된 보기이며, 원하는 도구에서 한 명령어로 다시 열립니다.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform`은 저장된 도구를 실행합니다: 에디터들 (VS Code, Cursor)은 모든 멤버를 포함하는 하나의 창을 열고 반환합니다. 첫 번째 멤버가 주(primary)입니다. 언제든지 `--tool <id>`로 도구를 재정의할 수 있습니다.

워크셋은 의도적으로 공유 상태가 *아닙니다*. 그것들은 당신의 기기에 존재하며, 절대 커밋되지 않으며, 작업에 대해 어떠한 주장도 하지 않습니다 — 단지 당신이 무엇을 함께 열기를 좋아하는지만 기록합니다. 하나를 제거해도 멤버 폴더는 건드리지 않습니다. 새로운 도구는 코드가 아닌 설정입니다: 워크스페이스 파일을 통해 실행되거나 폴더별 첨부 플래그로 실행될 수 있는 모든 것은 전역 설정(`openspec config edit`)의 `openers` 키 아래에 추가할 수 있습니다.

## 명령어가 어디에서 작동할지 결정하는 방법

모든 일반 명령어는 다음 순서대로 루트를 동일하게 해결합니다:

```
1. --store <id>          당신이 명시적으로 지시함        → 해당 스토어
2. nearest openspec/     여기에 실제 계획 루트가 있음    → 이 저장소
   (cwd에서 위로 올라가며)
3. store: pointer        config.yaml에 스토어가 선언됨  → 해당 스토어
4. none of the above     기기에 등록된 스토어가 없음?    → 선택 힌트와 함께 오류
                         스토어가 등록되지 않음?         → 현재 디렉토리
                                                          (클래식 동작)
```

`Using OpenSpec root:` 줄 (및 `--json` 출력의 `root` 블록)은 당신이 어떤 경우에 있는지 알려줍니다.

## 알려진 제한 사항

- **베타 형태.** 이 페이지의 모든 내용은 출시 버전에 따라 변경될 수 있습니다 — 이름, 플래그, 파일 형식, JSON 키 등.
- **기기당 스토어 ID당 하나의 체크아웃.** 동일한 ID 아래에 두 번째 체크아웃을 등록하면 `store unregister`를 먼저 하라는 힌트와 함께 실패합니다.
- **절대 동기화 없음 — 설계상 그렇습니다.** OpenSpec은 클론하거나 풀링하거나 푸시하지 않습니다. 오래된 체크아웃은 *당신이* 풀링할 때까지 오래된 스펙을 보여줍니다; 참조는 디스크에 있는 것에 대해 실시간으로 인덱싱됩니다.
- **일부 명령어는 제자리에 머무릅니다.** `view`, `templates`, `schemas` 및 사용 중단된 명사형(`openspec change show`, ...)은 현재 디렉토리에서만 작동하며 `--store`를 사용하지 않습니다.
- **기기별 상태는 기기마다 다릅니다.** 스토어 레지스트리와 워크셋은 로컬 설정입니다. 당신의 기기 레이아웃에 대한 어떤 것도 공유 계획에 커밋되지 않습니다.
- **워크셋에 대한 두 가지 실행 스타일.** 워크스페이스 파일이나 폴더별 첨부 플래그로 실행될 수 없는 도구는 오프너(opener)로 추가될 수 없습니다.
- **에이전트 JSON은 알려진 대소문자 분할을 가집니다** (store-family 키는 snake_case, workflow-family는 camelCase). [agent contract](../agent-contract.md)에 문서화되어 있으며, 이를 통일하는 것은 버전이 지정된 출시로 미뤄졌습니다.

## 항목의 위치

| What | Where | Shared? |
|---|---|---|
| A store's planning | `<store>/openspec/` (specs, changes) | Yes — commit and push it |
| A store's identity | `<store>/.openspec-store/store.yaml` | Yes — committed with the store |
| The store registry | `<data dir>/openspec/stores/registry.yaml` | No — this machine only |
| Worksets | `<data dir>/openspec/worksets/` | No — this machine only |

`<data dir>`는 macOS 및 Linux의 경우 `~/.local/share/openspec` (또는 설정된 `$XDG_DATA_HOME/openspec`), Windows에서는 `%LOCALAPPDATA%\openspec`입니다.
## Reference

이 페이지에 있는 모든 명령어에 대한 정확한 플래그 및 JSON 형태:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets)와 [agent contract](../agent-contract.md).