# Contrato de Agente OpenSpec

Superfícies legíveis por máquina da CLI `openspec`, verificadas em relação a `src/` (auditoria capstone, 2026-06-11). Cada formato abaixo é documentado a partir do código emissor.

## 1. Convenções gerais

- **Um documento JSON por invocação.** No modo `--json`, o stdout carrega exatamente um documento JSON (formatado com recuo de 2 espaços). Texto em linguagem natural, spinners e o banner da store são enviados para o stderr.
- **Banner da store.** No modo humano, uma raiz selecionada pela store imprime `Using OpenSpec root: <id> (<path>)` no stderr. Nunca é impresso no modo JSON.
- **A capitalização de chaves depende da superfície** (consulte Inconsistências conhecidas): payloads de store/doctor/context usam `snake_case`; payloads de fluxo de trabalho (`status`, `instructions`, `new change`, `validate`, `list`) usam `camelCase`, exceto o objeto `root` embutido, que sempre usa `store_id`.
- **Chaves opcionais são omitidas, não nulas**, na maioria dos payloads (ex.: `root.store_id`, `member.path`). Exceções que usam `null` explícito são indicadas por formato (payloads do comando store doctor para `git.*`, payloads de falha).

## 2. O envelope de diagnóstico

Um formato de envelope é compartilhado por todo diagnóstico legível por máquina (`StoreDiagnostic`):

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Os diagnósticos aparecem em duas posições: **arrays de status** (`status: StoreDiagnostic[]` no nível superior ou por entrada) para descobertas de saúde, e **erros lançados** convertidos em um array `status` de elemento único em caso de falha do comando.

## 3. Seleção de raiz e `RootOutput`

Todos os comandos de resolução de raiz (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `new change`, `archive`, `doctor`, `context`) resolvem uma raiz OpenSpec com uma precedência:

1. `--store <id>` → a raiz da loja registrada (`source: "store"`).
2. Caso contrário, ancestral mais próximo com `openspec/`: formato de planejamento → `source: "nearest"` (um ponteiro `store:` é ignorado com um aviso no stderr); diretório apenas de configuração com um ponteiro `store:` válido → essa loja, `source: "declared"`.
3. Sem raiz mais próxima + `defaultStore` global definido (`openspec config set defaultStore <id>`) → essa loja, `source: "global_default"`; um id obsoleto falha com o erro da loja subjacente e um `fix` nomeando `openspec config unset defaultStore`.
4. Sem raiz mais próxima, sem padrão + lojas registradas existem → erro `no_root_with_registered_stores`.
5. Sem raiz, sem padrão, sem lojas: comandos de scaffolding tratam o cwd como `source: "implicit"`; comandos de diagnóstico (`doctor`, `context`) falham com `no_openspec_root` em vez disso — eles inspecionam, nunca fazem scaffolding.

Cargas JSON bem-sucedidas incorporam a raiz:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Contrato de falha de raiz**: no modo JSON, uma falha de resolução imprime `{ ...commandNullShape, "status": [diagnostic] }` no stdout e sai com código 1.

## 4. Formatos JSON dos comandos

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress" } ], "root": RootOutput }` — observe que o `status` por alteração é um enum de string aqui. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

### 4.2 `show <item> --json`
Alteração: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Especificação: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Sai com código 1 quando qualquer item falhar.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. O `requires` de cada artefato são seus ids de dependência direta (presente para todo status, então o conjunto transitório requerido é computável mesmo quando o artefato está `done`); `missingDeps` aparece apenas quando `blocked`. `"skipped"` marca um artefato cujo caminho `generates` está sob `specs/` em uma alteração cujo `.openspec.yaml` declara `skip_specs: true`; ele satisfaz dependências mas não deve ser criado. Sem alterações ativas: `{ "changes": [], "message", "root" }`, sai com código 0.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `"skipped": true` (com `"warning"`) aparece quando a alteração declara `skip_specs: true` e este artefato é pulado — não crie seus arquivos. Uma entrada de dependência com `skipped: true` é satisfeita sem arquivos — não tente ler seus caminhos.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — entradas resolvidas carregam root/specs/fetch; não resolvidas carregam store_id + status de aviso. Índice limitado a 50KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "instruction", "references"?, "root" }`.

### 4.7 `new change <name> --json`
Sucesso: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Falha: `{ "change": null, "status": [d] }`, sai com código 1.

### 4.8 `archive <name> --json`
Sucesso: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"? }, "root" }`. Falha: `{ "archive": null, "root"?, "status": [d] }`, sai com código 1. O modo JSON é estritamente não interativo: cada ponto de prompt se torna um código `archive_*`.

### 4.9 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (presente apenas para um checkout de loja com suporte git que tem uma referência de rastreamento upstream) são contagens ahead/behind contra o último upstream buscado, não o remote ao vivo. Descobertas de saúde de qualquer severidade saem com código 0. Carga de falha: `{ "root": null, "store": null, "references": [], "status": [d] }`, sai com código 1.

### 4.10 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. DISPONÍVEL = caminho presente E status vazio. `--code-workspace <path>` escreve `{folders:[{name,path}]}` (apenas lojas referenciadas disponíveis, prefixos `ref:`); no modo JSON a escrita é executada antes da impressão para que o stdout contenha exatamente um documento mesmo em caso de falha na escrita. Falha: `{ "root": null, "members": [], "status": [d] }`, sai com código 1.

### 4.11 `store ... --json`
configuração/registro: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. cancelamento de registro/remoção: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. lista: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = desconhecido/não verificado). Descobertas de saúde saem com código 0; falhas saem com código 1 com o formato nulo correspondente. Cancelamento de prompt sai com código 130.

### 4.12 `schemas --json` / `templates --json`
`schemas`: array simples `[ {name, description, artifacts, source} ]`. `templates`: objeto chaveado `{ "<artifactId>": {path, source} }`. Ambos baseados no cwd, sem chaves root/status.

## 5. Contrato de código de saída

| Situação | Saída | Stdout |
|---|---|---|
| Sucesso, incl. descobertas de saúde (doctor/context/store doctor) | 0 | a carga útil |
| Falha de comando no modo `--json` | 1 | um documento JSON com `status: [d]` e o formato nulo do comando |
| `validate` com itens falhos | 1 | relatório completo |
| Cancelamento de prompt (grupo `store`, modo humano) | 130 | apenas stderr |

## 6. Catálogo de códigos de diagnóstico

### Resolução
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; pass-through: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Saúde da raiz OpenSpec (erro, sem correção)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Durante o beta das lojas, `openspec/specs/`, `openspec/changes/`, e `openspec/changes/archive/` podem estar ausentes em uma raiz saudável; eles são apenas erros de saúde quando presentes mas não são diretórios.

### Registro/identidade/estado da loja
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Configuração/registro/remoção de loja
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_root_missing` (aviso na remoção, erro no doctor), `store_root_not_directory`.

### Git da loja
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (aviso), `store_clone_fragile_directories` (aviso), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Referências (aviso)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relacionamentos (aviso; doctor; context mantém apenas o de registro)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Arquivamento (modo JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Escritas de contexto
`context_file_exists`, `context_output_dir_missing`.

### Fallbacks
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Inconsistências conhecidas

Registradas pela auditoria capstone; renomeações de chaves publicadas são decisões de produto adiadas para após este lançamento:

1. ~~No modo `--json`, vários caminhos de falha imprimiam apenas stderr sem documento JSON.~~ Corrigido na rodada de teste capstone: `show`/`validate` itens desconhecidos e ambíguos emitem `{status:[{code: unknown_item | ambiguous_item, ...}]}`; erros lançados em `status`/`instructions`/`list`/`show`/`validate` passam pelo auxiliar de falha ciente de JSON (o formato nulo do comando + `status`); `store <unknown subcommand> --json` emite `{status:[{code: unknown_store_subcommand}]}`; `list` carrega seu formato nulo `{changes|specs: [], root: null}` em falhas de resolução.
2. `store_root_missing` é emitido com duas severidades (aviso na remoção, erro no doctor da loja) — dependente de contexto, documentado acima.
3. snake_case (família de loja) vs camelCase (família de fluxo de trabalho) para chaves; `root.store_id` é snake_case em todos os lugares.
4. Quatro declarações de tipo de envelope paralelas existem em src; diagnósticos de arquivamento nunca carregam `target`.
5. `list --json` reutiliza a chave `status` como um enum de string por alteração.
6. Apenas a saída de `validate` carrega um campo `version`.
7. `schemas`/`templates` ignoram a seleção de raiz (baseados no cwd, sem `--store`).
8. Formas de substantivo depreciadas (subcomandos `change`/`spec`) emitem cargas não envelopadas sem `root`/`status`.