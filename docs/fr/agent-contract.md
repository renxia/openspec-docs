# Contrat d'Agent OpenSpec

Les surfaces lisibles par machine de l'outil CLI `openspec`, vérifiées par rapport à `src/` (audit capstone, 2026-06-11). Chaque forme ci-dessous est documentée à partir du code émetteur.

## 1. Conventions générales

- **Un document JSON par invocation.** En mode `--json`, stdout contient exactement un document JSON (formaté avec des indentations de 2 espaces). La prose humaine, les spinners et la bannière de l'outil sont envoyés à stderr.
- **Bannière de l'outil.** En mode humain, une racine sélectionnée par l'outil affiche `Using OpenSpec root: <id> (<path>)` sur stderr. Elle n'est jamais affichée en mode JSON.
- **La casse des clés dépend de la surface** (voir Incohérences connues) : les charges utiles (payloads) de store/doctor/context utilisent `snake_case`; les charges utiles de workflow (`status`, `instructions`, `new change`, `validate`, `list`) utilisent `camelCase`, à l'exception de l'objet `root` intégré, qui utilise toujours `store_id`.
- **Les clés optionnelles sont omises, non nulles**, dans la plupart des charges utiles (par exemple, `root.store_id`, `member.path`). Les exceptions utilisant explicitement `null` sont mentionnées par forme (doctor store `git.*`, charges utiles de échec).

## 2. L'enveloppe diagnostique

Une forme d'enveloppe est partagée par chaque diagnostic lisible par machine (`StoreDiagnostic`) :

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Les diagnostics apparaissent à deux endroits : les **tableaux de statut** (`status: StoreDiagnostic[]` au niveau supérieur ou par entrée) pour les résultats de santé, et les **erreurs levées** converties en un tableau `status` d'un seul élément lors de l'échec de la commande.

## 3. Sélection de la racine et `RootOutput`

Toutes les commandes résolvant une racine (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) résolvent une racine OpenSpec selon une précédence :

1. `--store <id>` → la racine du store enregistré (`source: "store"`).
2. Sinon, l'ancêtre le plus proche contenant `openspec/`: forme de planification → `source: "nearest"` (un pointeur `store:` est ignoré avec un avertissement sur stderr) ; répertoire configuré uniquement avec un pointeur `store:` valide → ce store, `source: "declared"`.
3. Aucune racine la plus proche + aucun stores enregistrés existent → erreur `no_root_with_registered_stores`.
4. Aucune racine, aucun stores : les commandes de scaffolding traitent le cwd comme `source: "implicit"`; les commandes diagnostiques (`doctor`, `context`) échouent avec `no_openspec_root` à la place — elles inspectent, ne scaffoldent jamais.

Les charges utiles JSON réussies intègrent la racine :

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Contrat d'échec de la racine** : en mode JSON, un échec de résolution affiche `{ ...commandNullShape, "status": [diagnostic] }` sur stdout et sort avec le code 1.

## 4. Formes JSON des commandes

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — notez que le statut par changement est une énumération de chaînes ici. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Changement : `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec : `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Sort avec le code 1 si un élément échoue.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Aucun changement actif : `{ "changes": [], "message", "root" }`, sort avec le code 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — les entrées résolues contiennent root/specs/fetch ; les non résolues contiennent store_id + statut d'avertissement. L'index est plafonné à 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Succès : `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Échec : `{ "change": null, "status": [d] }`, sort avec le code 1.

### 4.8 `archive <name> --json`
Succès : `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Échec : `{ "archive": null, "root"?, "status": [d] }`, sort avec le code 1. Le mode JSON est strictement non interactif : chaque point de requête devient un code `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. Les résultats de santé de n'importe quelle sévérité sortent avec le code 0. Charge utile d'échec : `{ "root": null, "store": null, "references": [], "status": [d] }`, sort avec le code 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. DISPONIBLE = path présent ET statut vide. `--code-workspace <path>` écrit `{folders:[{name,path}]}` (stores référencés uniquement, préfixes `ref:`); en mode JSON, l'écriture s'exécute avant l'impression, de sorte que stdout contienne exactement un document même en cas d'échec d'écriture. Échec : `{ "root": null, "members": [], "status": [d] }`, sort avec le code 1.

### 4.11 `store ... --json`
setup/register : `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove : `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list : `{ "stores": [{id, root}], "status": [] }`. doctor : `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = inconnu/non sondé). Les résultats de santé sortent avec le code 0 ; les échecs sortent avec le code 1 en utilisant la forme nulle correspondante. L'annulation de l'invite sort avec le code 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: tableau simple `[ {name, description, artifacts, source} ]`. `templates`: objet clé `{ "<artifactId>": {path, source} }`. Les deux sont basés sur le cwd, sans clés root/status.

## 5. Contrat de code de sortie

| Situation | Sortie | Stdout |
|---|---|---|
| Succès, y compris les résultats de santé (doctor/context/store doctor) | 0 | la charge utile |
| Échec de commande en mode `--json` | 1 | un document JSON avec `status: [d]` et la forme nulle de la commande |
| `validate` avec des éléments échouant | 1 | rapport complet |
| Annulation de l'invite (groupe `store`, mode humain) | 130 | stderr seulement |

## 6. Catalogue des codes diagnostiques

### Résolution
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; transit : `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Santé de la racine OpenSpec (erreur, sans correction)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, ainsi que les variantes `_not_directory` de chacune.

### Registre/identité/état du Store
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Setup/enregistrement/suppression du Store
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (avertissement lors de la suppression, erreur dans doctor), `store_root_not_directory`.

### Git du Store
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (avertissement), `store_clone_fragile_directories` (avertissement), `store_remote_divergence` (info, doctor).

### Références (avertissement)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relations (avertissement ; doctor ; context ne conserve que le registre)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archive (mode JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Écritures de Context
`context_file_exists`, `context_output_dir_missing`.

### Fallbacks
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Incohérences connues

Enregistrées par l'audit capstone ; les renommages de clés publiés sont des décisions produit reportées au-delà de cette version :

1. ~~En mode `--json`, plusieurs chemins d'échec affichaient uniquement sur stderr sans document JSON.~~ Corrigé dans le gauntlet capstone : `show`/`validate` éléments inconnus et ambigus émettent `{status:[{code: unknown_item | ambiguous_item, ...}]}`; les erreurs levées dans `status`/`instructions`/`list`/`show`/`validate` passent par l'aide de fonction d'échec consciente du JSON (la forme nulle de la commande + `status`); `store <sous-commande inconnue> --json` émet `{status:[{code: unknown_store_subcommand}]}`; `list` porte sa forme nulle `{changes|specs: [], root: null}` en cas d'échec de résolution.
2. `store_root_missing` est émis avec deux niveaux de sévérité (avertissement lors de la suppression, erreur dans doctor) — dépendant du contexte, documenté ci-dessus.
3. Casse des clés snake_case (famille store) vs camelCase (famille workflow) ; `root.store_id` est en snake_case partout.
4. Quatre déclarations de type d'enveloppe existent dans src ; les diagnostics d'archive ne portent jamais le champ `target`.
5. `list --json` réutilise la clé `status` comme une énumération de chaînes par changement.
6. Seul l'output `validate` porte un champ `version`.
7. `schemas`/`templates` ignorent la sélection de la racine (basé sur le cwd, sans `--store`).
8. Les formes nominales obsolètes (`change`/`spec`) émettent des charges utiles non enveloppées sans `root`/`status`.