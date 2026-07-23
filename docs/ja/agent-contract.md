# OpenSpec エージェント契約

`openspec` CLI の機械可読なサーフェスを `src/` に対して検証済みです（キャップストーン監査、2026-06-11）。以下の各構造体は、出力元コードから文書化されています。

## 1. 一般規約

- **1 回の呼び出しにつき 1 つの JSON ドキュメント。** `--json` モードでは、stdout に厳密に 1 つの JSON ドキュメント（2 スペースの改行あり整形）が出力されます。人間向けの文章、スピナー、ストアバナーは stderr に出力されます。
- **ストアバナー。** 人間モードでは、ストアが選択したルートについて `Using OpenSpec root: <id> (<path>)` を stderr に出力します。JSON モードでは決して出力されません。
- **キーの大文字小文字はサーフェスに依存します**（既知の不整合を参照）：store/doctor/context ペイロードは `snake_case` を使用します。ワークフローペイロード（`status`、`instructions`、`new change`、`validate`、`list`）は `camelCase` を使用しますが、埋め込まれた `root` オブジェクトは常に `store_id` を使用する点が例外です。
- **オプションのキーは null ではなく省略されます**。ほとんどのペイロードでは、オプションのキーは省略され、null にはなりません（例：`root.store_id`、`member.path`）。明示的な `null` を使用する例外は、各構造体ごとに記載されています（store doctor の `git.*`、失敗ペイロードなど）。

## 2. 診断エンベロープ

すべての機械可読診断（`StoreDiagnostic`）で共通のエンベロープ構造が使用されます：

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

診断は2つの位置に表示されます：**ステータス配列**（`status: StoreDiagnostic[]`、トップレベルまたは各エントリごと）による正常性調査結果、およびコマンド失敗時に単一要素の`status`配列に変換されてスローされるエラーです。

## 3. ルート選択と`RootOutput`

すべてのルート解決コマンド（`list`、`show`、`validate`、`status`、`instructions`、`instructions apply`、`new change`、`archive`、`doctor`、`context`）は、以下の優先順位で1つのOpenSpecルートを解決します：

1. `--store <id>` → 登録済みストアのルート（`source: "store"`）。
2. それ以外の場合、`openspec/`を含む最寄りの上位ディレクトリ → プランニングシェイプ → `source: "nearest"`（`store:`ポインタはstderrに警告を出して無視されます）；有効な`store:`ポインタを持つ設定専用ディレクトリ → そのストア、`source: "declared"`。
3. 最寄りのルートなし + グローバル`defaultStore`が設定されている場合（`openspec config set defaultStore <id>`） → そのストア、`source: "global_default"`；古いIDの場合は基盤となるストアエラーと`openspec config unset defaultStore`を指定する`fix`で失敗します。
4. 最寄りのルートなし、デフォルトなし + 登録済みストアが存在する場合 → エラー`no_root_with_registered_stores`。
5. ルートなし、デフォルトなし、ストアなし：スキャフォールディングコマンドはcwdを`source: "implicit"`として扱います；診断コマンド（`doctor`、`context`）は代わりに`no_openspec_root`で失敗します — これらは検査のみを行い、スキャフォールディングは行いません。

成功したJSONペイロードにはルートが埋め込まれます：

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**ルート失敗契約**：JSONモードでは、解決失敗時にstdoutに`{ ...commandNullShape, "status": [diagnostic] }`を出力し、終了コード1で終了します。

## 4. コマンドJSONシェイプ

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — 各チェンジごとの`status`はここでは文字列列挙型です。`--specs`：`{ "specs": [ { "id", "requirementCount" } ], "root" }`。

### 4.2 `show <item> --json`
チェンジ：`{ "id", "title", "deltaCount", "deltas": [...], "root" }`。スペック：`{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`。

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`。いずれかのアイテムが失敗した場合に終了コード1で終了します。

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`。各アーティファクトの`requires`はその直接依存IDです（すべてのステータスに存在するため、アーティファクトが`done`の場合でも推移的必須セットを計算可能です）；`missingDeps`は`blocked`の場合にのみ表示されます。`"skipped"`は、チェンジの`.openspec.yaml`が`skip_specs: true`を宣言している場合に、`generates`パスが`specs/`の下にあるアーティファクトにマークされます — 依存関係は満たされますが、作成してはなりません。アクティブなチェンジなし：`{ "changes": [], "message", "root" }`、終了コード0。

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`。`"skipped": true`（`"warning"`と共に）は、チェンジが`skip_specs: true`を宣言し、このアーティファクトがスキップされる場合に表示されます — ファイルを作成しないでください。`skipped: true`の依存関係エントリは、ファイルなしで満たされます — パスを読み取ろうとしないでください。

`ReferenceIndexEntry`：`{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — 解決済みエントリはroot/specs/fetchを保持；未解決エントリはstore_id + 警告ステータスを保持。インデックスは50KBで制限されます（`reference_index_truncated`）。

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`。

### 4.7 `new change <name> --json`
成功時：`{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`。失敗時：`{ "change": null, "status": [d] }`、終了コード1。

### 4.8 `archive <name> --json`
成功時：`{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`。失敗時：`{ "archive": null, "root"?, "status": [d] }`、終了コード1。JSONモードは厳密に非インタラクティブです：すべてのプロンプトポイントが`archive_*`コードになります。

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`。`drift`（git対応ストアチェックアウトでアップストリームトラッキング参照がある場合にのみ存在）は、ライブリモートではなく最後にフェッチしたアップストリームに対するahead/behindカウントです。重大度を問わず正常性調査結果がある場合、終了コード0。失敗ペイロード：`{ "root": null, "store": null, "references": [], "status": [d] }`、終了コード1。

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`。AVAILABLE = パスが存在 かつ ステータスが空。`--code-workspace <path>`は`{folders:[{name,path}]}`を書き込みます（利用可能な参照ストアのみ、`ref:`プレフィックス付き）；JSONモードでは書き込みが出力前に行われるため、書き込み失敗時でもstdoutには常に1つのドキュメントのみが含まれます。失敗時：`{ "root": null, "members": [], "status": [d] }`、終了コード1。

### 4.11 `store ... --json`
setup/register：`{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`。unregister/remove：`{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`。list：`{ "stores": [{id, root}], "status": [] }`。doctor：`{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }`（`null` = 不明/プローブされていません）。正常性調査結果がある場合は終了コード0；失敗時は終了コード1で対応するnullシェイプを出力。プロンプトキャンセルは終了コード130。

### 4.12 `schemas --json` / `templates --json`
`schemas`：ベア配列`[ {name, description, artifacts, source} ]`。`templates`：キー付きオブジェクト`{ "<artifactId>": {path, source} }`。両方ともcwdベースで、root/statusキーはありません。

## 5. 終了コード契約

| 状況 | 終了コード | Stdout |
|---|---|---|
| 成功、正常性調査結果を含む（doctor/context/store doctor） | 0 | ペイロード |
| `--json`モードでのコマンド失敗 | 1 | `status: [d]`とコマンドのnullシェイプを含む1つのJSONドキュメント |
| 失敗アイテムを含む`validate` | 1 | 完全なレポート |
| プロンプトキャンセル（`store`グループ、人間モード） | 130 | stderrのみ |

## 6. 診断コードカタログ

### 解決
`no_openspec_root`、`no_root_with_registered_stores`、`no_registered_stores`、`unknown_store`、`store_identity_mismatch`、`unhealthy_store_root`、`store_path_not_supported`、`invalid_store_pointer`、`initiative_option_removed`、`areas_option_removed`；パススルー：`invalid_store_id`、`invalid_store_registry`、`invalid_store_metadata`。

### OpenSpecルート正常性（エラー、修正なし）
`openspec_store_root_missing`、`openspec_store_root_not_directory`、`openspec_root_missing`、`openspec_root_not_directory`、`openspec_config_missing`、`openspec_config_not_file`、`openspec_specs_not_directory`、`openspec_changes_not_directory`、`openspec_archive_not_directory`。ストアベータ期間中、`openspec/specs/`、`openspec/changes/`、`openspec/changes/archive/`は正常なルートに存在しない場合があります；存在するがディレクトリでない場合にのみ正常性エラーとなります。

### ストアレジストリ/アイデンティティ/状態
`invalid_store_id`、`invalid_store_registry`、`invalid_store_metadata`、`store_registry_busy`、`store_not_found`、`no_store_registry`、`store_registry_changed`、`store_metadata_missing`、`store_metadata_id_mismatch`、`store_metadata_invalid`、`store_id_conflict`、`store_path_conflict`、`store_already_registered`（info）。

### ストアセットアップ/登録/削除
`store_setup_id_required`、`store_setup_path_required`、`store_setup_path_not_directory`、`store_setup_inside_git_repo`、`store_setup_non_empty_directory`、`store_setup_cancelled`、`store_path_required`、`store_path_missing`、`store_path_not_directory`、`store_root_pointer_declared`、`store_register_root_unhealthy`、`store_register_identity_confirmation_required`、`store_register_cancelled`、`store_remote_empty`、`store_remote_requires_hand_edit`、`store_remove_confirmation_required`、`store_remove_cancelled`、`store_remove_path_not_directory`、`store_remove_metadata_missing`、`store_root_missing`（removeでは警告、doctorではエラー）、`store_root_not_directory`。

### ストアGit
`store_git_init_failed`、`store_git_identity_missing`、`store_git_commit_failed`、`store_git_no_commits`（警告）、`store_clone_fragile_directories`（警告）、`store_remote_divergence`（info、doctor）、`store_checkout_drift`（info、doctor）。

### 参照（警告）
`reference_invalid_id`、`reference_registry_unreadable`、`reference_unresolved`、`reference_root_unhealthy`、`reference_index_truncated`。

### リレーションシップ（警告；doctor；contextはレジストリのもののみ保持）
`relationship_registry_unreadable`、`root_pointer_ignored`、`root_pointer_invalid`、`pointer_declarations_inert`。

### アーカイブ（JSONモード）
`archive_change_name_required`、`archive_change_not_found`、`archive_validation_failed`、`archive_confirmation_required`、`archive_tasks_incomplete`、`archive_spec_update_failed`、`archive_spec_validation_failed`、`archive_target_exists`、`archive_error`。

### コンテキスト書き込み
`context_file_exists`、`context_output_dir_missing`。

### フォールバック
`doctor_failed`、`context_failed`、`store_error`、`change_error`、`archive_error`。

## 既知の非整合性

キャップストーン監査で記録；公開キー名変更は本リリース後に延期される製品決定です：

1. ~~`--json`モードでは、いくつかの失敗パスがJSONドキュメントなしでstderrのみを出力していました。~~ キャップストーンガントレットラウンドで修正済み：`show`/`validate`の不明および曖昧なアイテムは`{status:[{code: unknown_item | ambiguous_item, ...}]}`を出力；`status`/`instructions`/`list`/`show`/`validate`のスローエラーはJSON対応失敗ヘルパーを経由（コマンドのnullシェイプ + `status`）；`store <unknown subcommand> --json`は`{status:[{code: unknown_store_subcommand}]}`を出力；`list`は解決失敗時に`{changes|specs: [], root: null}`のnullシェイプを保持します。
2. `store_root_missing`は2つの重大度で出力されます（removeでは警告、store doctorではエラー）— 文脈依存、上記で記載。
3. snake_case（ストアファミリー）とcamelCase（ワークフローファミリー）のキー大文字規則；`root.store_id`は常にsnake_case。
4. `src`に4つの並列エンベロープ型宣言が存在；アーカイブ診断は`target`を一切持ちません。
5. `list --json`は各チェンジごとに`status`キーを文字列列挙型として再利用します。
6. `validate`出力のみが`version`フィールドを持ちます。
7. `schemas`/`templates`はルート選択を無視します（cwdベース、`--store`なし）。
8. 非推奨の名詞形式（`change`/`spec`サブコマンド）は`root`/`status`のない非エンベロープペイロードを出力します。