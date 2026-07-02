# OpenSpec Agent Contract

`openspec` CLIの機械可読なサーフェス（`src/`による検証済み、キャップストーン監査 2026-06-11）。以下のすべてのシェイプは、エミットするコードから文書化されています。

## 1. 一般的な規約

- **InvocationごとのJSONドキュメント.** `--json`モードでは、stdoutには正確に一つのJSONドキュメント（2スペースで整形）が出力されます。人間向けの散文、スピナー、ストアバナーはstderrに出力されます。
- **ストアバナー.** 人間向けモードでは、選択されたルートが `Using OpenSpec root: <id> (<path>)` をstderrに出力します。JSONモードでは決して出力されません。
- **キーのケース指定はサーフェスに依存します**（既知の不整合性を参照）：store/doctor/contextペイロードは `snake_case` を使用し、ワークフローペイロード（`status`、`instructions`、`new change`、`validate`、`list`）は `camelCase` を使用します。ただし、埋め込まれた`root`オブジェクトは常に`store_id`を使用します。
- **オプションのキーはnullではなく省略されます**、ほとんどのペイロードで（例: `root.store_id`、`member.path`）。明示的な`null`を使用する例外については、各シェイプで言及されています（ストアドクター`git.*`、失敗ペイロード）。

## 2. 診断エンベロープ

すべての機械可読な診断（`StoreDiagnostic`）が共有する一つのエンベロープシェイプがあります。

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

診断は二つの位置に現れます：健全性チェックのための**status配列**（トップレベルまたは各エントリの`status: StoreDiagnostic[]`）と、コマンド失敗時に単一要素の`status`配列に変換される**スローされたエラー**です。

## 3. ルート選択と`RootOutput`

すべてのルート解決コマンド（`list`、`show`、`validate`、`status`、`instructions`、`instructions apply`、`new change`、`archive`、`doctor`、`context`）は、一つの優先順位に従ってOpenSpec rootを解決します。

1. `--store <id>` → 登録されたストアのルート（`source: "store"`）。
2. それ以外の場合、最も近い祖先で`openspec/`を持つもの：計画シェイプ → `source: "nearest"`（`store:`ポインタはstderr警告とともに無視されます）；有効な`store:`ポインタを持つ設定専用ディレクトリ → そのストア、`source: "declared"`。
3. 最も近いルートおよび登録されたストアが存在しない場合 → エラー`no_root_with_registered_stores`。
4. ルートもストアもない場合：スキャフォールディングコマンドはcwdを`source: "implicit"`として扱います；診断コマンド（`doctor`、`context`）は代わりに`no_openspec_root`で失敗します—これらは検査するだけで、スキャフォールドしません。

成功したJSONペイロードにはルートが埋め込まれます。

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**ルート失敗契約**: JSONモードでは、解決失敗時に`{ ...commandNullShape, "status": [diagnostic] }`をstdoutに出力し、1で終了します。

## 4. コマンドJSONシェイプ

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — ここでの変更ごとの`status`は文字列のEnumであることに注意してください。`--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`。

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`。Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`。

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`。いずれかのアイテムが失敗した場合に1で終了します。

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`。アクティブな変更がない場合: `{ "changes": [], "message", "root" }`、0で終了します。

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`。

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — 解決されたエントリはroot/specs/fetchを持ちます。未解決のエントリはstore_id + warning statusを持ちます。インデックスは50KBに制限されています（`reference_index_truncated`）。

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`。

### 4.7 `new change <name> --json`
成功: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`。失敗: `{ "change": null, "status": [d] }`、1で終了します。

### 4.8 `archive <name> --json`
成功: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`。失敗: `{ "archive": null, "root"?, "status": [d] }`、1で終了します。JSONモードは厳密に非対話的です：すべてのプロンプトポイントが`archive_*`コードになります。

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`。いずれの重大度であれど、健全性チェックの結果が出た場合、0で終了します。失敗ペイロード: `{ "root": null, "store": null, "references": [], "status": [d] }`、1で終了します。

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`。AVAILABLE = pathが存在し、かつstatusが空であること。`--code-workspace <path>`は`{folders:[{name,path}]}`を書き込みます（参照されたストアのみ、`ref:`プレフィックス）。JSONモードでは、書き込みが印刷の前に実行されるため、書き込み失敗時でもstdoutには正確に一つのドキュメントが含まれます。失敗: `{ "root": null, "members": [], "status": [d] }`、1で終了します。

### 4.11 `store ... --json`
セットアップ/登録: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`。未登録/削除: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`。一覧表示: `{ "stores": [{id, root}], "status": [] }`。ドクター: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }`（`null` = 未知/検査されていない）。健全性チェックの結果が出た場合、0で終了します。失敗する場合は対応するnull-shapeで1で終了します。プロンプトキャンセルは130で終了します。

### 4.12 `schemas --json` / `templates --json`
`schemas`: 素の配列 `[ {name, description, artifacts, source} ]`。`templates`: キー付きオブジェクト `{ "<artifactId>": {path, source} }`。どちらもcwdベースであり、root/statusキーはありません。

## 5. Exit-code契約

| 状況 | Exit | Stdout |
|---|---|---|
| 成功（健全性チェックの結果を含む：doctor/context/store doctor） | 0 | ペイロード |
| `--json`モードでのコマンド失敗 | 1 | `status: [d]`を持つ一つのJSONドキュメントと、そのコマンドのnull-shape |
| アイテムが失敗した`validate` | 1 | 完全なレポート |
| プロンプトキャンセル（`store`グループ、人間向けモード） | 130 | stderrのみ |

## 6. 診断コードカタログ

### Resolution (解決)
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; パススルー: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`。

### OpenSpec-root 健全性 (error, no fix)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`、およびそれぞれの`_not_directory`バリアント。

### Store registry/identity/state
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info)。

### Store setup/register/remove
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (削除時にwarning, doctorでerror), `store_root_not_directory`。

### Store git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor)。

### References (warning)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`。

### Relationships (warning; doctor; contextはregistryのみを保持)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`。

### Archive (JSONモード)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`。

### Context writes
`context_file_exists`, `context_output_dir_missing`。

### Fallbacks (フォールバック)
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`。

## Known inconsistencies (既知の不整合性)

キャップストーン監査によって記録されたものであり、公開キーのリネームは本リリース以降に延期された製品上の決定事項です：

1. ~~JSONモードでは、いくつかの失敗パスがJSONドキュメントなしでstderrのみに出力されていました。~~ キャップストーンガントレットラウンドで修正されました: `show`/`validate`は不明または曖昧なアイテムをエミットする `{status:[{code: unknown_item | ambiguous_item, ...}]}` を出力します；`status`/`instructions`/`list`/`show`/`validate`でのスローされたエラーは、JSON対応の失敗ヘルパー（コマンドのnull-shape + `status`）を介して流れます；`store <unknown subcommand> --json` は `{status:[{code: unknown_store_subcommand}]}` をエミットします；`list`は解決失敗時にその `{changes|specs: [], root: null}` のnull-shapeを持ちます。
2. `store_root_missing`は二つの重大度（削除時のwarning、ストアドクターでのerror）でエミットされます—これはコンテキストに依存し、上記に文書化されています。
3. キーのケース指定：snake_case (storeファミリー) 対 camelCase (ワークフローファミリー)；`root.store_id`は常にsnake_caseです。
4. srcには四つの並行なエンベロープ型宣言が存在します。アーカイブ診断では`target`を持ちません。
5. `list --json`は、変更ごとの文字列Enumとして`status`キーを再利用します。
6. `validate`の出力のみが`version`フィールドを持ちます。
7. `schemas`/`templates`はルート選択を無視します（cwdベース、`--store`なし）。
8. 非推奨となった名詞形（`change`/`spec`サブコマンド）は、`root`/`status`を持たないエンベロープされていないペイロードをエミットします。
