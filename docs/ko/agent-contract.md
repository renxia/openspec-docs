# OpenSpec 에이전트 계약서

`openspec` CLI의 기계 판독 가능한 인터페이스(Machine-readable surfaces)로, `src/`를 기준으로 검증되었습니다 (capstone 감사, 2026-06-11). 아래에 있는 모든 형태는 해당 코드를 통해 문서화되었습니다.

## 1. 일반적인 규칙

- **호출당 하나의 JSON 문서.** `--json` 모드에서 stdout은 정확히 하나의 JSON 문서를 포함하며 (2칸 들여쓰기), 인간이 읽을 수 있는 산문, 스피너 및 저장소 배너는 stderr로 출력됩니다.
- **저장소 배너.** 인간(human) 모드에서는 선택된 루트에 대해 `Using OpenSpec root: <id> (<path>)`를 stderr에 출력합니다. JSON 모드에서는 절대 출력되지 않습니다.
- **키 케이싱은 인터페이스에 따라 다릅니다** (Known inconsistencies 참조): store/doctor/context 페이로드는 `snake_case`를 사용하며, 워크플로우 페이로드 (`status`, `instructions`, `new change`, `validate`, `list`)는 `camelCase`를 사용합니다. 단, 내부에 포함된 `root` 객체는 항상 `store_id`를 사용합니다.
- **선택적 키는 null 대신 생략됩니다.** 대부분의 페이로드에서 (예: `root.store_id`, `member.path`). 명시적으로 `null`을 사용하는 예외 사항은 각 인터페이스별로 명시되어 있습니다 (store doctor `git.*`, 실패 페이로드).

## 2. 진단 엔벨로프(The diagnostic envelope)

모든 기계 판독 가능한 진단 (`StoreDiagnostic`)에 공유되는 하나의 엔벨로프 형태는 다음과 같습니다:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

진단은 두 가지 위치에 나타납니다: 건강 상태를 확인하는 **status 배열** (`status: StoreDiagnostic[]`가 최상위 또는 각 항목별로 존재)과 명령 실패 시 단일 요소 `status` 배열로 변환된 **발생한 오류**.

## 3. 루트 선택 및 `RootOutput`

모든 루트 해결 명령 (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`)은 하나의 우선순위에 따라 OpenSpec 루트를 해결합니다:

1. `--store <id>` → 등록된 저장소의 루트 (`source: "store"`).
2. 그렇지 않은 경우, `openspec/`을 가진 가장 가까운 조상(ancestor): 계획(planning) 형태 → `source: "nearest"` (stderr 경고와 함께 `store:` 포인터는 무시됨); 유효한 `store:` 포인터를 가진 설정 전용 디렉토리 → 해당 저장소, `source: "declared"`.
3. 가장 가까운 루트나 등록된 저장소가 없는 경우 → 오류 `no_root_with_registered_stores`.
4. 루트도 없고 저장소도 없는 경우: 스캐폴딩(scaffolding) 명령은 현재 작업 디렉토리(cwd)를 `source: "implicit"`로 간주합니다; 진단 명령 (`doctor`, `context`)은 대신 `no_openspec_root`로 실패하며, 스캐폴딩을 시도하지 않고 검사만 합니다.

성공적인 JSON 페이로드는 루트를 포함합니다:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**루트 실패 계약**: JSON 모드에서 해결 실패 시 `{ ...commandNullShape, "status": [diagnostic] }`를 stdout에 출력하고 1로 종료됩니다.

## 4. 명령 JSON 형태(Command JSON shapes)

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — 각 변경 사항에 대한 `status`가 문자열 열거형(enum)임을 참고하십시오. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
변경 사항: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. 모든 항목 중 하나라도 실패하면 1로 종료됩니다.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. 활성 변경 사항이 없는 경우: `{ "changes": [], "message", "root" }`, 0으로 종료됩니다.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — 해결된 항목은 root/specs/fetch를 포함하며, 미해결된 항목은 store_id와 경고 상태를 가집니다. 인덱스는 50KB로 제한됩니다 (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
성공: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. 실패: `{ "change": null, "status": [d] }`, 1로 종료됩니다.

### 4.8 `archive <name> --json`
성공: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. 실패: `{ "archive": null, "root"?, "status": [d] }`, 1로 종료됩니다. JSON 모드는 엄격하게 비대화형이므로, 모든 프롬프트 지점은 `archive_*` 코드가 됩니다.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. 모든 심각도의 건강 상태 발견 사항은 0으로 종료됩니다. 실패 페이로드: `{ "root": null, "store": null, "references": [], "status": [d] }`, 1로 종료됩니다.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = path가 존재하고 status가 비어 있는 경우. `--code-workspace <path>`는 `{folders:[{name,path}]}`를 작성합니다 (참조된 저장소만 해당, `ref:` 접두사 사용). JSON 모드에서 쓰기는 출력 전에 실행되므로, 쓰기 실패 시에도 stdout에는 정확히 하나의 문서가 유지됩니다. 실패: `{ "root": null, "members": [], "status": [d] }`, 1로 종료됩니다.

### 4.11 `store ... --json`
설정/등록: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. 등록 해제/삭제: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. 목록: `{ "stores": [{id, root}], "status": [] }`. 진단: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = 알 수 없음/검사하지 않음). 건강 상태 발견 사항은 0으로 종료되며; 실패는 해당 null-shape와 함께 1로 종료됩니다. 프롬프트 취소는 130을 반환합니다.

### 4.12 `schemas --json` / `templates --json`
`schemas`: 순수한 배열 `[ {name, description, artifacts, source} ]`. `templates`: 키가 있는 객체 `{ "<artifactId>": {path, source} }`. 둘 다 cwd 기반이며, root/status 키는 없습니다.

## 5. 종료 코드 계약(Exit-code contract)

| 상황 | 종료 코드 | Stdout |
|---|---|---|
| 성공, 건강 상태 발견 포함 (doctor/context/store doctor) | 0 | 해당 페이로드 |
| `--json` 모드에서 명령 실패 | 1 | `status: [d]`를 가진 하나의 JSON 문서와 해당 명령의 null-shape |
| 항목 실패가 있는 `validate` | 1 | 전체 보고서 |
| 프롬프트 취소 (`store` 그룹, 인간 모드) | 130 | stderr만 |

## 6. 진단 코드 카탈로그

### 해결(Resolution)
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; 통과(pass-through): `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### OpenSpec-root 건강 상태 (오류, 수정 없음)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, 그리고 각 항목의 `_not_directory` 변형.

### 저장소 레지스트리/신원/상태
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### 저장소 설정/등록/제거
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (제거 시 경고, doctor에서 오류), `store_root_not_directory`.

### 저장소 git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (경고), `store_clone_fragile_directories` (경고), `store_remote_divergence` (info, doctor).

### 참조(References) (경고)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### 관계(Relationships) (경고; doctor; context는 레지스트리만 유지)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### 아카이브 (JSON 모드)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Context 작성
`context_file_exists`, `context_output_dir_missing`.

### 폴백(Fallbacks)
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Known inconsistencies (알려진 불일치 사항)

capstone 감사에서 기록되었으며, 아래 릴리스 이후로 연기된 제품 결정인 공개 키 이름 변경 사항:

1. ~~JSON 모드에서 여러 실패 경로가 JSON 문서를 출력하지 않고 stderr에만 출력함.~~ capstone gauntlet 라운드에서 수정됨: `show`/`validate`는 알 수 없거나 모호한 항목을 `{status:[{code: unknown_item | ambiguous_item, ...}]}`로 방출합니다. `status`/`instructions`/`list`/`show`/`validate`의 발생된 오류는 JSON 인식 실패 도우미(해당 명령의 null-shape + `status`)를 통해 전달됩니다. `store <unknown subcommand> --json`은 `{status:[{code: unknown_store_subcommand}]}`을 방출합니다. `list`는 해결 실패 시 `{changes|specs: [], root: null}` null-shape를 가집니다.
2. `store_root_missing`는 두 가지 심각도(제거 시 경고, store doctor에서 오류)로 방출됩니다 — 이는 상황에 따라 다릅니다.
3. snake_case (store 계열) 대 camelCase (workflow 계열) 키 케이싱; `root.store_id`는 어디서나 snake_case를 사용합니다.
4. src에는 네 가지 병렬 엔벨로프 유형 선언이 존재하며, 아카이브 진단은 절대 `target`을 포함하지 않습니다.
5. `list --json`은 변경 사항별 문자열 열거형으로 `status` 키를 재사용합니다.
6. 오직 `validate` 출력만이 `version` 필드를 가집니다.
7. `schemas`/`templates`는 루트 선택(cwd 기반, `--store` 없음)을 무시합니다.
8. 사용되지 않는 명사 형태 (`change`/`spec` 하위 명령)는 `root`/`status` 없이 엔벨로프가 없는 페이로드를 방출합니다.