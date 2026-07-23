# OpenSpec 에이전트 규약

`openspec` CLI의 기계 판독 가능한 인터페이스로, `src/` 코드와 대조하여 검증되었습니다(캡스톤 감사, 2026-06-11). 아래의 모든 구조는 코드에서 직접 문서화되었습니다.

## 1. 일반 규약

- **실행당 하나의 JSON 문서.** `--json` 모드에서 stdout은 정확히 하나의 2칸 들여쓰기로 pretty-print된 JSON 문서를 전달합니다. 사람이 읽을 수 있는 설명 문구, 스피너, 스토어 배너는 stderr로 출력됩니다.
- **스토어 배너.** 사람이 읽을 수 있는 모드에서, 스토어가 선택한 루트는 stderr에 `Using OpenSpec root: <id> (<path>)` 메시지를 출력합니다. JSON 모드에서는 절대 출력되지 않습니다.
- **키의 대소문자 규칙은 사용되는 인터페이스에 따라 다릅니다** (알려진 불일치 사항 참조): store/doctor/context 페이로드는 `snake_case`를 사용합니다; 워크플로우 페이로드(`status`, `instructions`, `new change`, `validate`, `list`)는 `camelCase`를 사용하되, 내장된 `root` 객체만은 예외적으로 항상 `store_id` 키를 사용합니다.
- 대부분의 페이로드에서 **선택적 키는 null 대신 생략**됩니다(예: `root.store_id`, `member.path`). 명시적 `null`을 사용하는 예외는 각 데이터 구조별로 별도로 명시됩니다(스토어 doctor 명령의 `git.*` 필드, 실패 페이로드).

## 2. 진단 봉투(envelope)

모든 기계가 읽을 수 있는 진단(`StoreDiagnostic`)은 동일한 봉투(envelope) 형식을 공유합니다:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

진단은 두 위치에 표시됩니다: 상태 검사 결과를 위한 **상태 배열**(`status: StoreDiagnostic[]`, 최상위 또는 각 항목별)과, 명령 실패 시 단일 요소 `status` 배열로 변환되는 **발생된 오류**입니다.

## 3. 루트 선택 및 `RootOutput`

모든 루트 해결 명령(`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`)은 다음 우선순위에 따라 단일 OpenSpec 루트를 해결합니다:
1. `--store <id>` → 등록된 스토어의 루트 (`source: "store"`).
2. 그 외의 경우, `openspec/` 디렉터리가 있는 가장 가까운 상위 디렉터리를 사용합니다: 계획(planning) 모양인 경우 → `source: "nearest"` (`store:` 포인터는 stderr 경고와 함께 무시됨); 유효한 `store:` 포인터가 있는 설정 전용 디렉터리인 경우 → 해당 스토어, `source: "declared"`.
3. 가장 가까운 루트가 없고 전역 `defaultStore`가 설정된 경우(`openspec config set defaultStore <id>`) → 해당 스토어, `source: "global_default"`; 유효기간이 지난 ID는 기본 스토어 오류와 `fix` 항목(내용: `openspec config unset defaultStore`)과 함께 실패합니다.
4. 가장 가까운 루트가 없고, 기본값도 없으며 등록된 스토어가 존재하는 경우 → 오류 `no_root_with_registered_stores`가 발생합니다.
5. 루트, 기본값, 스토어가 모두 없는 경우: 스캐폴딩(scaffolding) 명령은 현재 작업 디렉터리(cwd)를 `source: "implicit"`로 처리합니다; 진단 명령(`doctor`, `context`)은 대신 `no_openspec_root` 오류와 함께 실패합니다 — 이 명령들은 검사만 수행하고 스캐폴딩은 하지 않습니다.

성공한 JSON 페이로드에는 루트 정보가 포함됩니다:
```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**루트 실패 계약(Root-failure contract)**: JSON 모드에서 루트 해결에 실패하면 표준 출력에 `{ ...commandNullShape, "status": [diagnostic] }`를 출력하고 종료 코드 1로 종료합니다.

## 4. 명령 JSON 형식

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — 각 변경 항목의 `status`는 여기서 문자열 열거형입니다. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
변경(Change): `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. 명세(Spec): `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. 항목 중 하나라도 유효하지 않으면 종료 코드 1로 종료합니다.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. 각 아티팩트의 `requires`는 직접 의존성 ID 목록입니다(모든 상태에 존재하므로 아티팩트가 `done` 상태인 경우에도 전이적 필수 항목 집합을 계산할 수 있음); `missingDeps`는 `blocked` 상태일 때만 나타납니다. `"skipped"`는 `.openspec.yaml`에 `skip_specs: true`가 선언된 변경에서 `generates` 경로가 `specs/` 하위에 있는 아티팩트를 표시합니다 — 이 아티팩트는 의존성을 만족하지만 생성해서는 안 됩니다. 활성 변경이 없는 경우: `{ "changes": [], "message", "root" }`, 종료 코드 0입니다.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. 변경에서 `skip_specs: true`가 선언되고 이 아티팩트가 건너뛰어지는 경우 `"skipped": true` (와 `"warning"`)가 나타납니다 — 이 아티팩트의 파일을 생성하지 마세요. `skipped: true`인 의존성 항목은 파일 없이 만족된 것으로 간주됩니다 — 해당 경로를 읽으려고 시도하지 마세요.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — 해결된 항목은 root/specs/fetch를 포함하고, 해결되지 않은 항목은 store_id와 경고 상태를 포함합니다. 인덱스는 50KB로 제한됩니다(`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
성공 시: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. 실패 시: `{ "change": null, "status": [d] }`, 종료 코드 1입니다.

### 4.8 `archive <name> --json`
성공 시: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. 실패 시: `{ "archive": null, "root"?, "status": [d] }`, 종료 코드 1입니다. JSON 모드는 엄격히 비대화식입니다: 모든 프롬프트 지점은 `archive_*` 코드로 변환됩니다.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift`(업스트림 추적 참조가 있는 Git 기반 스토어 체크아웃에만 존재)는 마지막으로 가져온 업스트림 기준으로 앞뒤 개수를 나타내며, 라이브 원격 저장소 기준이 아닙니다. 모든 심각도의 상태 검사 결과는 종료 코드 0을 반환합니다. 실패 페이로드: `{ "root": null, "store": null, "references": [], "status": [d] }`, 종료 코드 1입니다.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = 경로가 존재하고 상태가 비어있는 경우입니다. `--code-workspace <path>` 옵션은 `{folders:[{name,path}]}`를 작성합니다(사용 가능한 참조 스토어만, `ref:` 접두사 포함); JSON 모드에서는 쓰기 작업이 출력 전에 실행되므로 쓰기 실패 시에도 표준 출력에는 정확히 하나의 문서만 포함됩니다. 실패 시: `{ "root": null, "members": [], "status": [d] }`, 종료 코드 1입니다.

### 4.11 `store ... --json`
설정/등록: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. 등록 해제/제거: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. 목록 조회: `{ "stores": [{id, root}], "status": [] }`. 상태 검사: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = 알 수 없음/검사되지 않음). 상태 검사 결과는 종료 코드 0을 반환하고, 실패 시에는 종료 코드 1과 함께 해당 null 형식을 반환합니다. 프롬프트 취소 시 종료 코드 130입니다.

### 4.12 `schemas --json` / `templates --json`
`schemas`: 단순 배열 `[ {name, description, artifacts, source} ]`. `templates`: 키-값 객체 `{ "<artifactId>": {path, source} }`. 두 명령 모두 현재 작업 디렉터리(cwd) 기반이며, `root`/`status` 키를 포함하지 않습니다.

## 5. 종료 코드 계약

| 상황 | 종료 코드 | 표준 출력 |
|---|---|---|
| 성공 (상태 검사 결과(doctor/context/store doctor) 포함) | 0 | 페이로드 |
| `--json` 모드에서 명령 실패 | 1 | `status: [d]`와 명령의 null 형식이 포함된 단일 JSON 문서 |
| 유효하지 않은 항목이 있는 `validate` 실행 | 1 | 전체 보고서 |
| 프롬프트 취소 (`store` 그룹, 대화형 모드) | 130 | 표준 오류만 |

## 6. 진단 코드 카탈로그

### 해결 관련
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; 전달(pass-through): `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### OpenSpec 루트 상태 검사 (오류, 수정 없음)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. 스토어 베타 기간 동안 정상적인 루트에는 `openspec/specs/`, `openspec/changes/`, `openspec/changes/archive/` 디렉터리가 없을 수 있습니다; 이 디렉터리는 존재하지만 디렉터리가 아닌 경우에만 상태 검사 오류로 간주됩니다.

### 스토어 레지스트리/식별/상태
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (정보).

### 스토어 설정/등록/제거
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (제거 시 경고, doctor 실행 시 오류), `store_root_not_directory`.

### 스토어 Git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (경고), `store_clone_fragile_directories` (경고), `store_remote_divergence` (정보, doctor), `store_checkout_drift` (정보, doctor).

### 참조 (경고)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### 관계 (경고; doctor; context는 레지스트리 관련 항목만 유지)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### 아카이브 (JSON 모드)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### 컨텍스트 쓰기
`context_file_exists`, `context_output_dir_missing`.

### 폴백(fallback)
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## 알려진 불일치 사항

캡스톤 감사(capstone audit)에서 기록됨; 공개 키 이름 변경은 이번 릴리스 이후로 미루어진 제품 결정 사항입니다:
1. ~~`--json` 모드에서 여러 실패 경로가 JSON 문서 없이 표준 오류만 출력했습니다.~~ 캡스톤 가울렛(capstone gauntlet) 라운드에서 수정됨: `show`/`validate`의 알 수 없거나 모호한 항목은 `{status:[{code: unknown_item | ambiguous_item, ...}]}`를 출력합니다; `status`/`instructions`/`list`/`show`/`validate`의 발생 오류는 JSON 인식 실패 헬퍼(명령의 null 형식 + `status`)를 통해 라우팅됩니다; `store <알 수 없는 하위 명령> --json`은 `{status:[{code: unknown_store_subcommand}]}`를 출력합니다; `list`는 루트 해결 실패 시 `{changes|specs: [], root: null}` null 형식을 반환합니다.
2. `store_root_missing`는 두 가지 심각도로 발생합니다(제거 시 경고, 스토어 doctor 실행 시 오류) — 문맥에 의존하며 위에 문서화되어 있습니다.
3. snake_case(스토어 계열)와 camelCase(워크플로우 계열) 키 대소문자 규칙이 혼용됩니다; `root.store_id`는 모든 곳에서 snake_case를 사용합니다.
4. 소스 코드(src)에 4개의 병렬 봉투(envelope) 유형 선언이 존재합니다; 아카이브 진단에는 `target`이 포함되지 않습니다.
5. `list --json`은 변경 항목별로 `status` 키를 문자열 열거형으로 재사용합니다.
6. `validate` 출력에만 `version` 필드가 포함됩니다.
7. `schemas`/`templates`는 루트 선택을 무시합니다(현재 작업 디렉터리 기반, `--store` 옵션 없음).
8. 사용이 권장되지 않는 명사 형태(`change`/`spec` 하위 명령)는 `root`/`status`가 없는 봉투에 싸이지 않은 페이로드를 출력합니다.