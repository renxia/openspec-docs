# Contrato do Agente OpenSpec

Superfícies legíveis por máquina da CLI `openspec`, verificadas contra `src/` (auditoria capstone, 2026-06-11). Cada forma abaixo é documentada a partir do código emissor.

## 1. Convenções gerais

- **Um documento JSON por invocação.** No modo `--json`, o stdout contém exatamente um documento JSON (pretty-printed com 2 espaços). A prosa humana, spinners e o banner da loja vão para stderr.
- **Banner da Loja.** No modo humano, uma raiz selecionada pela loja imprime `Using OpenSpec root: <id> (<path>)` em stderr. Nunca é impresso no modo JSON.
- **A capitalização das chaves depende da superfície** (ver Inconsistências conhecidas): os payloads de store/doctor/context usam `snake_case`; os payloads de workflow (`status`, `instructions`, `new change`, `validate`, `list`) usam `camelCase`, exceto o objeto `root` embutido, que sempre usa `store_id`.
- **Chaves opcionais são omitidas, não nulas**, na maioria dos payloads (por exemplo, `root.store_id`, `member.path`). Exceções que usam explicitamente `null` são mencionadas por forma (doctor da loja `git.*`, payloads de falha).

## 2. O envelope diagnóstico

Uma forma de envelope é compartilhada por todo diagnóstico legível por máquina (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Os diagnósticos aparecem em duas posições: **arrays de status** (`status: StoreDiagnostic[]` no nível superior ou por entrada) para descobertas de saúde, e **erros lançados** convertidos em um array `status` de elemento único na falha do comando.

## 3. Seleção da raiz e `RootOutput`

Todos os comandos que resolvem a raiz (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) resolvem uma raiz OpenSpec com uma precedência:

1. `--store <id>` → a raiz da loja registrada (`source: "store"`).
2. Caso contrário, o ancestral mais próximo com `openspec/`: forma de planejamento → `source: "nearest"` (um ponteiro `store:` é ignorado com um aviso em stderr); diretório configuracional apenas com um ponteiro `store:` válido → aquela loja, `source: "declared"`.
3. Nenhuma raiz próxima + lojas registradas existem → erro `no_root_with_registered_stores`.
4. Sem raiz, sem lojas: comandos de scaffolding tratam o cwd como `source: "implicit"`; comandos diagnósticos (`doctor`, `context`) falham com `no_openspec_root` em vez disso — eles inspecionam, nunca fazem scaffolding.

Payloads JSON bem-sucedidos incorporam a raiz:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Contrato de falha da raiz**: no modo JSON, uma falha de resolução imprime `{ ...commandNullShape, "status": [diagnostic] }` em stdout e sai com código 1.

## 4. Formas JSON dos comandos

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — note que o `status` por mudança é um enum string aqui. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Sai com código 1 se qualquer item falhar.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"ready"|"blocked", missingDeps?} ], "root" }`. Sem mudanças ativas: `{ "changes": [], "message", "root" }`, sai com código 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "template", "dependencies": [{id,done,path,description}], "unlocks", "root" }`.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — entradas resolvidas carregam root/specs/fetch; não resolvidas carregam store_id + status de aviso. O índice é limitado a 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Sucesso: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Falha: `{ "change": null, "status": [d] }`, sai com código 1.

### 4.8 `archive <name> --json`
Sucesso: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Falha: `{ "archive": null, "root"?, "status": [d] }`, sai com código 1. O modo JSON é estritamente não interativo: cada ponto de prompt se torna um código `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "status": [] } | null, "references": [...], "status": [] }`. Descobertas de saúde de qualquer severidade saem com código 0. Payload de falha: `{ "root": null, "store": null, "references": [], "status": [d] }`, sai com código 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. DISPONÍVEL = path presente E status vazio. `--code-workspace <path>` escreve `{folders:[{name,path}]}` (apenas lojas referenciadas disponíveis, prefixos `ref:`); no modo JSON, a escrita ocorre antes da impressão, de modo que o stdout contenha exatamente um documento mesmo em caso de falha na escrita. Falha: `{ "root": null, "members": [], "status": [d] }`, sai com código 1.

### 4.11 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = desconhecido/não inspecionado). Descobertas de saúde saem com código 0; falhas saem com código 1 com a forma nula correspondente. O cancelamento do prompt sai com código 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: array simples `[ {name, description, artifacts, source} ]`. `templates`: objeto chaveado `{ "<artifactId>": {path, source} }`. Ambos baseados no cwd, sem chaves de raiz/status.

## 5. Contrato de código de saída

| Situação | Saída | Stdout |
|---|---|---|
| Sucesso, incluindo descobertas de saúde (doctor/context/store doctor) | 0 | o payload |
| Falha do comando no modo `--json` | 1 | um documento JSON com `status: [d]` e a forma nula do comando |
| `validate` com itens falhando | 1 | relatório completo |
| Cancelamento do prompt (grupo `store`, modo humano) | 130 | apenas stderr |

## 6. Catálogo de códigos de diagnóstico

### Resolução
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; pass-through: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Saúde da OpenSpec-root (erro, sem correção)
`openspec_store_root_missing`, `openspec_root_missing`, `openspec_config_missing`, `openspec_specs_missing`, `openspec_changes_missing`, `openspec_archive_missing`, mais variantes `_not_directory` de cada.

### Registro/identidade/estado da Loja
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Setup/registro/remoção da Loja
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (aviso na remoção, erro no doctor), `store_root_not_directory`.

### Git da Loja
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (aviso), `store_clone_fragile_directories` (aviso), `store_remote_divergence` (info, doctor).

### Referências (aviso)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relacionamentos (aviso; doctor; context mantém apenas o registro)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Arquivo (modo JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Escritas de Contexto
`context_file_exists`, `context_output_dir_missing`.

### Fallbacks
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Inconsistências conhecidas

Registradas pela auditoria capstone; renomeações de chaves publicadas são decisões do produto adiadas para além deste lançamento:

1. ~~No modo `--json`, vários caminhos de falha imprimiam apenas em stderr sem documento JSON.~~ Corrigido na rodada gauntlet capstone: `show`/`validate` itens desconhecidos e ambíguos emitem `{status:[{code: unknown_item | ambiguous_item, ...}]}`; erros lançados em `status`/`instructions`/`list`/`show`/`validate` passam pelo helper de falha consciente do JSON (a forma nula do comando + `status`); `store <subcomando desconhecido> --json` emite `{status:[{code: unknown_store_subcommand}]}`; `list` carrega sua forma nula `{changes|specs: [], root: null}` nas falhas de resolução.
2. `store_root_missing` é emitido com duas severidades (aviso na remoção, erro no doctor) — dependente do contexto, documentado acima.
3. Capitalização das chaves snake_case (família store) vs camelCase (família workflow); `root.store_id` é snake_case em todos os lugares.
4. Quatro declarações de tipo de envelope existem no src; diagnósticos de arquivo nunca carregam `target`.
5. `list --json` reutiliza a chave `status` como um enum string por mudança.
6. Apenas o output de `validate` carrega um campo `version`.
7. `schemas`/`templates` ignoram a seleção da raiz (baseado no cwd, sem `--store`).
8. Formas nominais obsoletas (`change`/`spec` subcomandos) emitem payloads não envelopados sem `root`/`status`.