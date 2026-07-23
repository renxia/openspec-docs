# Contrat d'agent OpenSpec

Surfaces lisibles par machine de l'interface CLI `openspec`, vérifiées par rapport à `src/` (capstone audit, 2026-06-11). Chaque structure présentée ci-dessous est documentée à partir du code émetteur.

## 1. Conventions générales

- **Un document JSON par invocation.** En mode `--json`, stdout ne contient qu'un seul document JSON (mis en forme avec une indentation de 2 espaces). La prose humaine, les spinners et la bannière du store sont envoyés vers stderr.
- **Bannière du store.** En mode humain, un root sélectionné par le store affiche `Using OpenSpec root: <id> (<path>)` sur stderr. Elle n'est jamais affichée en mode JSON.
- **La casse des clés dépend de la surface** (voir Incohérences connues) : les charges utiles de store/doctor/context utilisent le `snake_case` ; les charges utiles des workflows (`status`, `instructions`, `new change`, `validate`, `list`) utilisent le `camelCase`, à l'exception de l'objet `root` intégré, qui utilise toujours `store_id`.
- **Les clés optionnelles sont omises, et non pas définies à `null`**, dans la plupart des charges utiles (par ex. `root.store_id`, `member.path`). Les exceptions qui utilisent un `null` explicite sont indiquées pour chaque structure (store doctor `git.*`, charges utiles d'échec).

## 2. L'enveloppe de diagnostic

Une forme d'enveloppe est partagée par tous les diagnostics lisibles par machine (`StoreDiagnostic`) :

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Les diagnostics apparaissent à deux positions : les **tableaux de statut** (`status: StoreDiagnostic[]` au niveau supérieur ou par entrée) pour les constats de santé, et les **erreurs levées** converties en un tableau `status` à un seul élément en cas d'échec de commande.

## 3. Sélection de la racine et `RootOutput`

Toutes les commandes de résolution de racine (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) résolvent une seule racine OpenSpec selon une priorité unique :

1. `--store <id>` → la racine du magasin enregistré (`source: "store"`).
2. Sinon, l'ancêtre le plus proche contenant `openspec/` : forme de planification → `source: "nearest"` (un pointeur `store:` est ignoré avec un avertissement sur stderr) ; répertoire de configuration uniquement avec un pointeur `store:` valide → ce magasin, `source: "declared"`.
3. Pas de racine la plus proche + `defaultStore` global défini (`openspec config set defaultStore <id>`) → ce magasin, `source: "global_default"` ; un identifiant obsolète échoue avec l'erreur de magasin sous-jacente et un `fix` nommé `openspec config unset defaultStore`.
4. Pas de racine la plus proche, pas de valeur par défaut + des magasins enregistrés existent → erreur `no_root_with_registered_stores`.
5. Pas de racine, pas de valeur par défaut, pas de magasins : les commandes d'échafaudage traitent le répertoire de travail courant comme `source: "implicit"` ; les commandes de diagnostic (`doctor`, `context`) échouent avec `no_openspec_root` à la place — elles inspectent, n'échafaudent jamais.

Les charges utiles JSON réussies intègrent la racine :

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Contrat d'échec de résolution de racine** : en mode JSON, un échec de résolution affiche `{ ...commandNullShape, "status": [diagnostic] }` sur stdout et renvoie le code de sortie 1.

## 4. Formes JSON des commandes

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — notez que le `status` par changement est une énumération de chaînes ici. `--specs` : `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Changement : `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spécification : `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Renvoie le code de sortie 1 si un élément échoue.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. Le champ `requires` de chaque artefact correspond aux identifiants de ses dépendances directes (présent pour tous les statuts, donc l'ensemble des dépendances transitives est calculable même quand l'artefact est `done`) ; `missingDeps` n'apparaît que quand le statut est `blocked`. `"skipped"` marque un artefact dont le chemin `generates` se trouve sous `specs/` dans un changement dont le fichier `.openspec.yaml` déclare `skip_specs: true` ; il satisfait les dépendances mais ne doit pas être créé. Pas de changements actifs : `{ "changes": [], "message", "root" }`, code de sortie 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `"skipped": true` (avec `"warning"`) apparaît quand le changement déclare `skip_specs: true` et que cet artefact est ignoré — ne créez pas ses fichiers. Une entrée de dépendance avec `skipped: true` est satisfaite sans fichiers — ne tentez pas de lire ses chemins.

`ReferenceIndexEntry` : `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — les entrées résolues contiennent root/specs/fetch ; les entrées non résolues contiennent store_id + un statut d'avertissement. L'index est plafonné à 50 Ko (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Succès : `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Échec : `{ "change": null, "status": [d] }`, code de sortie 1.

### 4.8 `archive <name> --json`
Succès : `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Échec : `{ "archive": null, "root"?, "status": [d] }`, code de sortie 1. Le mode JSON est strictement non interactif : chaque point de prompt devient un code `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (présent uniquement pour un extrait de magasin basé sur git qui dispose d'une référence de suivi en amont) correspond aux comptes d'écart en avance/en retard par rapport à la dernière extraction en amont, et non par rapport au dépôt distant en direct. Les constats de santé de toute gravité renvoient le code de sortie 0. Charge utile d'échec : `{ "root": null, "store": null, "references": [], "status": [d] }`, code de sortie 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. DISPONIBLE = chemin présent ET statut vide. `--code-workspace <chemin>` écrit `{folders:[{name,path}]}` (uniquement les magasins référencés disponibles, préfixes `ref:`) ; en mode JSON, l'écriture est exécutée avant l'affichage, donc stdout ne contient exactement un document même en cas d'échec de l'écriture. Échec : `{ "root": null, "members": [], "status": [d] }`, code de sortie 1.

### 4.11 `store ... --json`
configuration/enregistrement : `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. désenregistrement/suppression : `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. liste : `{ "stores": [{id, root}], "status": [] }`. diagnostic : `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = inconnu/non vérifié). Les constats de santé renvoient le code de sortie 0 ; les échecs renvoient le code de sortie 1 avec la forme nulle correspondante. L'annulation de prompt renvoie le code de sortie 130.

### 4.12 `schemas --json` / `templates --json`
`schemas` : tableau brut `[ {name, description, artifacts, source} ]`. `templates` : objet à clés `{ "<artifactId>": {path, source} }`. Les deux sont basés sur le répertoire de travail courant (cwd), sans clés root/status.

## 5. Contrat des codes de sortie

| Situation | Code de sortie | Stdout |
|---|---|---|
| Succès, incluant les constats de santé (doctor/context/store doctor) | 0 | la charge utile |
| Échec de commande en mode `--json` | 1 | un document JSON avec `status: [d]` et la forme nulle de la commande |
| `validate` avec des éléments échouants | 1 | rapport complet |
| Annulation de prompt (groupe `store`, mode humain) | 130 | stderr uniquement |

## 6. Catalogue des codes de diagnostic

### Résolution
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed` ; codes transmis : `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Santé de la racine OpenSpec (erreur, pas de correctif)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Pendant la bêta des magasins, `openspec/specs/`, `openspec/changes/` et `openspec/changes/archive/` peuvent être absents d'une racine saine ; ce ne sont des erreurs de santé que quand ils sont présents mais ne sont pas des répertoires.

### Registre/identité/état des magasins
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Configuration/enregistrement/suppression des magasins
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (avertissement lors de la suppression, erreur dans le diagnostic de magasin), `store_root_not_directory`.

### Git des magasins
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (avertissement), `store_clone_fragile_directories` (avertissement), `store_remote_divergence` (info, diagnostic), `store_checkout_drift` (info, diagnostic).

### Références (avertissement)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relations (avertissement ; diagnostic ; context ne conserve que celui du registre)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archive (mode JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Écritures de contexte
`context_file_exists`, `context_output_dir_missing`.

### Correctifs de secours
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Incohérences connues

Enregistrées par l'audit de synthèse ; les renommage de clés publiés sont des décisions produit reportées après cette version :

1. ~~En mode `--json`, plusieurs chemins d'échec affichaient uniquement stderr sans document JSON.~~ Corrigé lors du tour de gauntlet de synthèse : les éléments inconnus et ambigus de `show`/`validate` émettent `{status:[{code: unknown_item | ambiguous_item, ...}]}` ; les erreurs levées dans `status`/`instructions`/`list`/`show`/`validate` passent par l'assistant d'échec compatible JSON (forme nulle de la commande + `status`) ; `store <sous-commande inconnue> --json` émet `{status:[{code: unknown_store_subcommand}]}` ; `list` transporte sa forme nulle `{changes|specs: [], root: null}` en cas d'échecs de résolution.
2. `store_root_missing` est émis avec deux gravités (avertissement lors de la suppression, erreur dans le diagnostic de magasin) — dépendant du contexte, documenté ci-dessus.
3. casse snake_case (famille de magasins) vs camelCase (famille de flux de travail) des clés ; `root.store_id` est en snake_case partout.
4. Quatre déclarations de type d'enveloppe parallèles existent dans src ; les diagnostics d'archive ne portent jamais `target`.
5. `list --json` réutilise la clé `status` comme énumération de chaînes par changement.
6. Seule la sortie de `validate` comporte un champ `version`.
7. `schemas`/`templates` ignorent la sélection de racine (basés sur le répertoire de travail courant, pas de `--store`).
8. Les formes nominales dépréciées (sous-commandes `change`/`spec`) émettent des charges utiles sans enveloppe, sans `root`/`status`.