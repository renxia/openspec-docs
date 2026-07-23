# Stores: 자체 저장소에서 계획하기

> **Beta.** Stores, references, working context, worksets는 새로운 기능입니다. 명령어 이름, 플래그, 파일 형식, JSON 출력은 릴리스 간에 변경될 수 있습니다. 아래의 모든 예시는 현재 빌드에서 실행되었지만, 업그레이드한 후에는 이 가이드를 다시 읽어주세요.

## 해결하는 문제

OpenSpec은 일반적으로 단일 코드 저장소 내에 존재합니다: 코드 옆에 위치한 `openspec/` 폴더로, 해당 저장소의 명세(specs)와 변경 사항(changes)을 보관합니다.

계획이 하나의 저장소보다 커지는 순간 더 이상 이 구조는 적합하지 않게 됩니다:

- 작업이 여러 저장소에 걸쳐 있는 경우 — 하나의 기능이 API 서버, 웹 앱, 공유 라이브러리에 모두 영향을 미치는 경우가 있습니다. 이때 계획은 어느 저장소의 `openspec/` 폴더에 저장해야 할까요?
- 팀에서 코드가 존재하기 전에 계획을 수립하거나, 이 저장소에 코드로 구현되지 않을 항목을 계획하는 경우도 있습니다.
- 요구 사항이 한 팀에서 관리하고 다른 팀에서 사용하는 경우도 있습니다. 위키 버전은 시간이 지나면서 내용이 달라지기 쉽고, 코딩 에이전트가 위키 내용을 읽을 수도 없습니다.

**스토어(store)** 가 이 문제의 해결책입니다: 계획 수립만을 목적으로 하는 독립형 저장소입니다. 기존에 사용하던 것과 동일한 `openspec/` 구조(명세와 변경 사항)를 가지며, 여기에 작은 식별 파일이 추가됩니다. 한 번 이름으로 기기에 등록하면, 어디서든 일반적인 OpenSpec 명령어로 이 스토어에서 작업할 수 있습니다.

## 구조

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

이 구조를 간단하게 유지하는 두 가지 규칙:

1. **스토어는 그저 git 저장소일 뿐입니다.** 직접 커밋, 푸시, 풀, 리뷰하세요. OpenSpec은 자체적으로 아무것도 클론, 동기화, 푸시하지 않습니다.
2. **선언일 뿐, 기계가 아닙니다.** 저장소는 스토어와의 관계를 *선언*할 수 있습니다(아래 참조). 선언은 OpenSpec이 알려줄 수 있는 내용을 변경할 뿐, 명령어가 작동하는 위치를 변경하지는 않습니다.

## 첫 번째 스토어를 5분 만에 만들기

두 개의 명령어로 아무것도 없는 상태에서 작동하는 스토어 범위 변경을 만들 수 있습니다:

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

이것이 전체 모델입니다. 이후 라이프사이클은 여러분이 알고 있는 것과 정확히 같습니다 — `status`, `instructions`, `validate`, `archive` — 각 명령어에 `--store team-plans`를 추가하면 되고, 출력되는 모든 힌트에 해당 플래그가 포함됩니다. `Using OpenSpec root:` 줄은 항상 명령어가 작동하는 위치를 알려줍니다.

## 이야기: 한 팀, 하나의 계획 저장소

팀은 스펙과 변경 사항을 코드 저장소에 흩어놓는 대신 `team-plans`에 보관합니다.

**첫 날(설정하는 사람):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

`--remote`을 전달하면 스토어 자체의 식별 파일(`.openspec-store/store.yaml`)에 클론 URL이 초기 커밋에 기록됩니다. 이후 모든 클론은 출처를 알고 있으므로, 아직 스토어를 가지고 있지 않은 팀원을 위해 상태 확인과 오류 메시지에 완전한 복사 가능한 수정 방법을 출력할 수 있습니다.

**모든 팀원(머신당 한 번):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

그 이후로 모든 팀원은 이름으로 동일한 계획 저장소에서 작업합니다:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**의도적으로 작업 공유는 git으로 합니다.** 여러분이 생성한 변경 사항은 커밋하고 푸시할 때까지 체크아웃에만 존재합니다 — 코드와 같습니다. 계획은 스토어가 일반적인 저장소이기 때문에 별도의 비용 없이 브랜치, 풀 리퀘스트, 리뷰를 받을 수 있습니다.

**팀의 코드 저장소 연결하기.** 계획이 완전히 외부화된 코드 저장소는 `openspec/config.yaml`에 정확히 한 줄만 필요합니다:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

이제 `web-app` 내부에서 실행되는 모든 OpenSpec 명령어는 플래그 없이 `team-plans`에서 작동합니다:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

이 포인터는 대체일 뿐, 우선하지 않습니다: 명시적인 `--store`가 항상 우선하고, 저장소에 자체적인 실제 계획 폴더가 생기면 해당 폴더가 우선합니다(오래된 포인터를 제거하라는 경고와 함께).

**머신의 모든 저장소에 대한 기본값 하나.** 여러 코드 저장소에서 모두 동일한 스토어에 계획을 세우는 경우, 각 저장소에 `store:` 줄을 추가하는 대신 전역으로 한 번만 설정하세요:

```bash
openspec config set defaultStore team-plans
```

이제 계획 루트 외부에서 실행되는 모든 명령어 — `--store`도 없고 프로젝트 포인터도 없는 경우 — 는 `team-plans`로 확인됩니다. 이는 우선순위 목록의 맨 아래에 위치하므로, `--store`, 로컬 루트, 프로젝트 `store:` 포인터가 모두 우선합니다. 루트 배너와 JSON `root` 블록은 스토어 ID와 함께 `source: "global_default"`를 보고하므로, 전역 기본값과 저장소 자체 포인터를 항상 구분할 수 있습니다. `openspec config unset defaultStore`로 지울 수 있습니다. ID가 등록되지 않은 경우 명령어가 오류를 발생시키고 등록하거나 오래된 기본값을 지우라고 알려줍니다.

## 이야기: 팀 경계를 넘는 요구사항

플랫폼 팀이 요구사항을 소유합니다. 제품 팀은 자체 저장소에서 자체 디자인으로 해당 요구사항을 기반으로 구축합니다. 참조는 아무도 작업을 옮기지 않고 해당 관계를 설명합니다.

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
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**제품 팀은 자체 저장소의 `openspec/config.yaml`에서 사용하는 것을 선언합니다:**

```yaml
references:
  - platform-reqs
```

참조는 읽기 전용 컨텍스트입니다. 저장소는 자체 `openspec/` 루트를 유지합니다. 작업은 해당 루트에 그대로 있습니다. 변경되는 점: 해당 저장소의 `openspec instructions`에 이제 참조된 스토어의 스펙 색인이 포함됩니다 — 각 스펙은 한 줄 요약과 정확한 가져오기 명령어(`openspec show <spec-id> --type spec --store platform-reqs`)가 함께 있습니다. `api-server`에서 작업하는 에이전트는 업스트림 결제 요구사항을 찾아 인용하고, 저장소 자체 루트에 저수준 디자인을 작성할 수 있습니다 — 누군가 컨텍스트를 붙여넣을 필요 없이.

참조는 클론 소스를 포함할 수 있으므로, 아직 스토어를 가지고 있지 않은 팀원은 막다른 골목 대신 완전한 수정 방법을 얻을 수 있습니다:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**계획과 코드를 함께 열고 싶을 때는 워크셋을 만드세요.** 이것은 개인적이고 명시적입니다: 각 사람은 자신의 머신에서 실제로 작업하는 폴더를 선택합니다. 해당 로컬 체크아웃 경로에 대한 내용은 공유 계획 저장소에 커밋되지 않습니다.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## 항상 물어볼 수 있는 두 가지 질문

**"내 설정이 정상인가요?"** — `openspec doctor`는 현재 루트와 참조된 스토어를 읽기 전용으로 확인하고, 각 발견 사항마다 복사 가능한 수정 방법을 출력합니다:

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

**"내가 작업하고 있는 것이 무엇인가요?"** — `openspec context`는 OpenSpec 선언으로부터 작업 세트를 구성합니다: 루트와 참조된 스토어입니다.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

둘 다 에이전트를 위해 `--json`을 지원합니다. `openspec context --code-workspace <path>`는 전체 세트가 포함된 VS Code 워크스페이스 파일을 추가로 작성합니다 — 이 명령어가 수행하는 유일한 쓰기 작업입니다.

## 워크셋: 함께 작업하는 폴더를 다시 열기

위의 모든 것과 별개로, 대부분의 사람은 매 세션마다 동일한 몇 개의 폴더를 함께 엽니다 — 계획 저장소와 2~3개의 코드 저장소입니다. **워크셋**은 정확히 그것에 대한 개인적이고 이름이 지정된 보기로, 선택한 도구에서 한 명령어로 다시 열 수 있습니다.

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

`openspec workset open platform`이 저장된 도구를 실행합니다: 편집기(VS Code, Cursor)는 모든 멤버가 포함된 창을 하나 열고 반환합니다. 첫 번째 멤버가 기본입니다. `--tool <id>`로 언제든 도구를 재정의할 수 있습니다.

워크셋은 의도적으로 *공유 상태가 아닙니다*. 머신에만 존재하며, 커밋되지 않고 작업에 대한 주장을 하지 않습니다 — 함께 열고 싶은 것만 기록할 뿐입니다. 워크셋을 제거해도 멤버 폴더에는 영향을 미치지 않습니다. 새 도구는 구성일 뿐 코드가 아닙니다: 워크스페이스 파일이나 폴더별 연결 플래그를 통해 실행되는 모든 것은 전역 구성의 `openers` 키 아래에 추가할 수 있습니다(`openspec config edit`).

## 명령어가 작동할 위치를 결정하는 방법

모든 일반 명령어는 다음과 같은 순서로 루트를 확인합니다:

```
1. --store <id>          you said so explicitly        → that store
2. nearest openspec/     a real planning root here     → this repo
   (walking up from cwd)
3. store: pointer        config.yaml declares a store  → that store
4. defaultStore          global config sets a machine  → that store
                         default
5. none of the above     stores registered on this     → error with a
                         machine?                        selection hint
                         no stores registered?         → the current
                                                          directory
                                                          (classic behavior)
```

`Using OpenSpec root:` 줄(및 `--json` 출력의 `root` 블록)은 어떤 경우에 해당하는지 알려줍니다.

## 알려진 제한 사항

- **베타 버전 형태.** 이 페이지의 모든 내용은 릴리스 간에 변경될 수 있습니다 — 이름, 플래그, 파일 형식, JSON 키.
- **머신당 스토어 ID별로 하나의 체크아웃만 허용.** 동일한 ID로 두 번째 체크아웃을 등록하려고 하면 먼저 `store unregister`를 실행하라는 힌트와 함께 실패합니다.
- **설계상 동기화는 영원히 없습니다.** OpenSpec은 클론, 풀, 푸시를 절대 하지 않습니다. 오래된 체크아웃은 *여러분이* 풀할 때까지 오래된 스펙을 표시합니다. 참조는 디스크에 있는 내용을 기반으로 라이브로 색인화됩니다.
- **빈 계획 폴더는 없을 수 있습니다.** 새 스토어는 아직 Git에 `openspec/changes/`, `openspec/specs/`, `openspec/changes/archive/`가 없을 수 있습니다. 베타 기간 동안 이는 허용됩니다. 일반 명령어가 해당 폴더에 파일을 생성하면 폴더가 나타납니다.
- **포인터 저장소는 포인터로 유지됩니다.** `openspec/config.yaml`에 `store: <id>`를 선언한 구성 전용 저장소는 등록할 스토어 체크아웃이 아니라 외부화된 계획으로 처리됩니다. 의도적으로 해당 저장소를 로컬 스토어 루트로 변환하려면 먼저 `store:` 줄을 제거하세요.
- **일부 명령어는 현재 위치에서 작동합니다.** `view`, `templates`, `schemas`, 그리고 더 이상 사용되지 않는 명사 형태(`openspec change show` 등)는 현재 디렉터리에서만 작동합니다 — `--store`를 사용할 수 없습니다.
- **머신별 상태는 머신에만 적용됩니다.** 스토어 레지스트리와 워크셋은 로컬 설정입니다. 머신의 레이아웃에 대한 내용은 공유 계획에 절대 커밋되지 않습니다.
- **워크셋의 두 가지 실행 스타일.** 워크스페이스 파일이나 폴더별 연결 플래그로 실행할 수 없는 도구는 열기 도구로 추가할 수 없습니다.
- **에이전트 JSON에는 알려진 대소문자 구분이 있습니다** (스토어 패밀리 키는 snake_case, 워크플로우 패밀리는 camelCase). [에이전트 계약](../agent-contract.md)에 문서화되어 있습니다. 통합은 버전이 지정된 릴리스로 미뤄져 있습니다.

## 항목 저장 위치

| 항목 | 위치 | 공유 여부? |
|---|---|---|
| 스토어 계획 | `<store>/openspec/` (스펙, 변경 사항) | 예 — 커밋 후 푸시하세요 |
| 스토어 식별 정보 | `<store>/.openspec-store/store.yaml` | 예 — 스토어와 함께 커밋됩니다 |
| 스토어 레지스트리 | `<data dir>/openspec/stores/registry.yaml` | 아니요 — 현재 기기에서만 사용 |
| 워크셋 | `<data dir>/openspec/worksets/` | 아니요 — 현재 기기에서만 사용 |

`<data dir>`는 macOS와 Linux의 경우 `~/.local/share/openspec` (혹은 `$XDG_DATA_HOME` 환경 변수가 설정된 경우 `$XDG_DATA_HOME/openspec`), Windows의 경우 `%LOCALAPPDATA%\openspec` 입니다.

## 참고

이 페이지의 모든 명령어에 대한 정확한 플래그와 JSON 형식: [CLI 참고 문서](../cli.md) (스토어, Doctor, 작업 컨텍스트, 개인 워크셋) 및 [에이전트 계약](../agent-contract.md).