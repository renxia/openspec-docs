# Referencia de CLI

La CLI de OpenSpec (`openspec`) proporciona comandos de terminal para la configuración de proyectos, validación, inspección de estado y gestión. Estos comandos complementan los comandos de barra oblicua de IA (como `/opsx:propose`) documentados en [Comandos](commands.md).

## Resumen

| Categoría | Comandos | Propósito |
|----------|----------|---------|
| **Configuración inicial** | `init`, `update` | Inicializar y actualizar OpenSpec en tu proyecto |
| **Almacenes (repositorios OpenSpec independientes)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Gestionar almacenes — repositorios OpenSpec independientes que has registrado |
| **Salud** | `doctor` | Informar del estado de las relaciones para la raíz resuelta |
| **Contexto de trabajo** | `context` | Ensamblar el conjunto de trabajo (raíz + almacenes referenciados) |
| **Conjuntos de trabajo personales** | `workset create`, `workset list`, `workset open`, `workset remove` | Mantener y abrir vistas de trabajo personales y locales en tu herramienta |
| **Exploración** | `list`, `view`, `show` | Explorar cambios y especificaciones |
| **Validación** | `validate` | Verificar cambios y especificaciones en busca de problemas |
| **Ciclo de vida** | `archive` | Finalizar cambios completados |
| **Flujo de trabajo** | `new change`, `status`, `instructions`, `templates`, `schemas` | Compatibilidad con flujos de trabajo impulsados por artefactos |
| **Esquemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Crear y gestionar flujos de trabajo personalizados |
| **Configuración** | `config` | Ver y modificar la configuración |
| **Utilidades** | `feedback`, `completion` | Retroalimentación e integración con el shell |

## Comandos para humanos frente a comandos para agentes

La mayoría de los comandos de la CLI están diseñados para **uso humano** en una terminal. Algunos comandos también admiten **uso por agentes/scripts** mediante salida JSON.

### Comandos solo para humanos

Estos comandos son interactivos y están diseñados para su uso en terminal:

| Comando | Propósito |
|---------|-----------|
| `openspec init` | Inicializar proyecto (indicaciones interactivas) |
| `openspec view` | Panel interactivo |
| `openspec workset open <name>` | Abrir un conjunto de trabajo guardado (ventana del editor o sesión de agente en terminal) |
| `openspec config edit` | Abrir la configuración en el editor |
| `openspec feedback` | Enviar comentarios mediante GitHub |
| `openspec completion install` | Instalar finalizaciones de shell |

### Comandos compatibles con agentes

Estos comandos admiten salida `--json` para su uso programático por agentes de IA y scripts:

| Comando | Uso humano | Uso por agentes |
|---------|-----------|-----------|
| `openspec list` | Explorar cambios/especificaciones | `--json` para datos estructurados |
| `openspec show <item>` | Leer contenido | `--json` para análisis |
| `openspec validate` | Comprobar si existen problemas | `--all --json` para validación masiva |
| `openspec status` | Ver el progreso de los artefactos | `--json` para estado estructurado |
| `openspec instructions` | Obtener los siguientes pasos | `--json` para instrucciones para agentes |
| `openspec templates` | Buscar rutas de plantillas | `--json` para resolución de rutas |
| `openspec schemas` | Listar esquemas disponibles | `--json` para descubrimiento de esquemas |
| `openspec store setup <id>` | Crear y registrar un almacén local | `--json` con entradas explícitas para obtener una salida de configuración estructurada |
| `openspec store register <path>` | Registrar un almacén existente | `--json` para obtener una salida de registro estructurada |
| `openspec store unregister <id>` | Olvidar un registro de almacén local | `--json` para obtener una salida de limpieza estructurada |
| `openspec store remove <id>` | Eliminar la carpeta de un almacén local registrado | `--yes --json` para eliminación no interactiva |
| `openspec store list` | Explorar almacenes registrados | `--json` para obtener registros estructurados |
| `openspec store doctor` | Comprobar la configuración del almacén local | `--json` para obtener diagnósticos estructurados |
| `openspec new change <id>` | Crear la estructura de cambios específica del repositorio | `--json`, además de `--store <id>` para usar un almacén registrado como raíz de OpenSpec |
| `openspec workset create [name]` | Componer una vista de trabajo personal | `--member <path> --json` para composición no interactiva |
| `openspec workset list` | Explorar conjuntos de trabajo guardados | `--json` para obtener vistas estructuradas |
| `openspec workset remove <name>` | Eliminar una vista guardada | `--yes --json` para eliminación no interactiva |

---

## Opciones globales

Estas opciones funcionan con todos los comandos:

| Opción | Descripción |
|--------|-------------|
| `--version`, `-V` | Mostrar número de versión |
| `--no-color` | Desactivar la salida de colores |
| `--help`, `-h` | Mostrar la ayuda del comando |

---

## Comandos de configuración

### `openspec init`

Inicializa OpenSpec en tu proyecto. Crea la estructura de carpetas y configura las integraciones con herramientas de IA.

El comportamiento predeterminado usa los valores predeterminados de la configuración global: perfil `core`, entrega `both`, flujos de trabajo `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|-----------|-------------|-------------|
| `path` | No | Directorio de destino (predeterminado: directorio actual) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--tools <list>` | Configurar herramientas de IA de forma no interactiva. Usa `all`, `none` o una lista separada por comas |
| `--force` | Limpiar automáticamente archivos heredados sin solicitar confirmación |
| `--profile <profile>` | Anular el perfil global para esta ejecución de init (`core` o `custom`) |

`--profile custom` usa los flujos de trabajo que estén seleccionados actualmente en la configuración global (`openspec config profile`).

**IDs de herramientas compatibles (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

> Esta lista es un reflejo de `AI_TOOLS` en `src/core/config.ts`. Consulta [Herramientas compatibles](supported-tools.md) para ver las habilidades y rutas de comando de cada herramienta.

**Ejemplos:**

```bash
# Inicialización interactiva
openspec init

# Inicializar en un directorio específico
openspec init ./my-project

# No interactivo: configurar para Claude y Cursor
openspec init --tools claude,cursor

# Configurar para todas las herramientas compatibles
openspec init --tools all

# Anular el perfil para esta ejecución
openspec init --profile core

# Omitir indicaciones y limpiar automáticamente archivos heredados
openspec init --force
```

**Lo que crea:**

```
openspec/
├── specs/              # Tus especificaciones (fuente de verdad)
├── changes/            # Cambios propuestos
└── config.yaml         # Configuración del proyecto

.claude/skills/         # Habilidades de Claude Code (si se seleccionó claude)
.cursor/skills/         # Habilidades de Cursor (si se seleccionó cursor)
.cursor/commands/       # Comandos OPSX de Cursor (si la entrega incluye comandos)
... (otras configuraciones de herramientas)
```

---

### `openspec update`

Actualiza los archivos de instrucciones de OpenSpec después de actualizar la CLI. Vuelve a generar los archivos de configuración de herramientas de IA usando tu perfil global actual, los flujos de trabajo seleccionados y el modo de entrega.

```
openspec update [path] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|-----------|-------------|-------------|
| `path` | No | Directorio de destino (predeterminado: directorio actual) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--force` | Forzar actualización incluso cuando los archivos estén actualizados |

**Ejemplo:**

```bash
# Actualizar archivos de instrucciones después de actualizar npm
npm update @fission-ai/openspec
openspec update
```

---

## Almacenes (repositorios OpenSpec independientes)

> **Beta.** Los almacenes y las funcionalidades construidas sobre ellos (referencias, contexto de trabajo, conjuntos de trabajo) son nuevos; los nombres de comandos, indicadores, formatos de archivo y salida JSON pueden cambiar entre versiones. Para el recorrido guiado centrado en problemas, consulta la [guía de almacenes](stores-beta/user-guide.md).

Un almacén es un repositorio OpenSpec independiente que has registrado en esta máquina, por ejemplo un repositorio de planificación o un repositorio de contratos. Registrar un almacén permite que los comandos normales (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) actúen sobre él desde cualquier lugar pasando `--store <id>`.

### `openspec store setup`

Crea y registra un almacén local. Sin argumentos en una terminal, OpenSpec guía al usuario por el proceso de configuración. Los agentes y scripts deben pasar entradas explícitas y usar `--json`.

```bash
openspec store setup [id] [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--path <path>` | Carpeta donde debe residir el almacén (por ejemplo `~/openspec/<id>`) |
| `--remote <url>` | Registrar el repositorio remoto canónico en el archivo `store.yaml` del nuevo almacén |
| `--init-git` | Inicializar un repositorio Git con una confirmación inicial (predeterminado) |
| `--no-init-git` | Omitir todas las acciones de Git: no inicializar, no realizar confirmación inicial |
| `--json` | Generar salida JSON |

Las ejecuciones no interactivas (`--json`, scripts, agentes) deben pasar tanto el id del almacén como `--path`. En una terminal interactiva, la configuración solicita la ubicación con una sugerencia editable en un lugar visible y propiedad del usuario (por ejemplo `~/openspec/<id>`); nunca usa como predeterminado el directorio de datos gestionado por OpenSpec.

Ejemplos:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registra una carpeta de almacén local existente. Durante la versión beta de los almacenes, se puede registrar una raíz antes de que existan cambios, se hayan aplicado especificaciones o se hayan archivado cambios; en ese caso, `openspec/changes/`, `openspec/specs/` y `openspec/changes/archive/` pueden estar ausentes hasta que los comandos normales las creen. Un repositorio que solo contiene configuración que declara `store: <id>` sigue siendo un puntero a otro almacén y no se registra como raíz de almacén a menos que se elimine ese puntero.

```bash
openspec store register [path] [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--id <id>` | Id del almacén; usa como predeterminado los metadatos del almacén o el nombre de la carpeta |
| `--yes` | Confirmar la creación de metadatos de identidad del almacén para una raíz de OpenSpec válida |
| `--json` | Generar salida JSON |

### `openspec store unregister`

Olvida el registro de un almacén local sin eliminar archivos.

```bash
openspec store unregister <id> [--json]
```

Usa esto cuando un almacén se haya movido, clonado en otro lugar o ya no deba ser mostrado por OpenSpec en esta máquina.

### `openspec store remove`

Olvida el registro de un almacén local y elimina su carpeta local.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` muestra la carpeta exacta antes de eliminarla en una terminal interactiva. Los agentes, scripts y llamadas JSON deben pasar `--yes` para confirmar la eliminación. OpenSpec se niega a eliminar una carpeta que no contenga metadatos de almacén coincidentes.

### `openspec store list`

Listar los almacenes registrados localmente.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Comprobar el registro de almacenes local, los metadatos y la presencia de Git.

```bash
openspec store doctor [id] [--json]
```

Doctor es solo de diagnóstico; informa de raíces faltantes, discrepancias de metadatos y estado de registro local inválido sin modificar el almacén.

### Referenciar almacenes desde un proyecto

Un repositorio de proyecto puede declarar en `openspec/config.yaml` de qué almacenes se alimenta su trabajo:

```yaml
schema: spec-driven
references:
  - team-context
```

A partir de entonces, la salida de `openspec instructions` en ese repositorio (tanto las superficies por artefacto como la superficie `apply`, en modos JSON y humano) incluye un índice de las especificaciones de cada almacén referenciado: ids de especificación, un resumen de una línea de la sección Propósito de cada especificación y el comando de obtención (`openspec show <spec-id> --type spec --store <id>`). El índice se construye en tiempo real a partir de la versión registrada en cada ejecución; el contenido de las especificaciones nunca se copia en la salida.

Las referencias son contexto de solo lectura. Nunca cambian el lugar donde actúan los comandos: el trabajo se mantiene en la raíz propia del repositorio, y la escritura en un almacén referenciado sigue siendo una acción explícita con `--store`. Una referencia que no se pueda resolver (por ejemplo, un almacén no registrado en esta máquina) se convierte en un aviso en el índice con la solución exacta, y las instrucciones siguen generándose. `openspec doctor` informa del estado de las referencias en un solo lugar.

### Registrar de dónde se clona un almacén

Un almacén puede registrar su fuente de clonación canónica en su archivo de identidad confirmado, de forma que la incorporación de nuevos usuarios nunca se estanca en «registra el almacén»:

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

El repositorio remoto se guarda en `.openspec-store/store.yaml` dentro de la confirmación inicial, por lo que cada clon nace conociéndolo. Para un almacén existente, edita `store.yaml` manualmente y confirma los cambios. `store doctor` muestra el repositorio remoto registrado (y el origen de Git observado de la versión); la guía de uso compartido de setup/register lo nombra; y register registra el origen de la versión en el registro local de la máquina.

Una declaración de referencia también puede incluir la fuente de clonación, de forma que un compañero que aún no tenga el almacén obtenga una solución completa y listo para pegar (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Registrar un repositorio remoto no es una sincronización: OpenSpec nunca clona, extrae ni envía cambios por su cuenta.

### Declarar un almacén predeterminado

Un repositorio cuya planificación esté completamente externalizada, sin `openspec/specs/` ni `openspec/changes/` locales, puede declarar su almacén una sola vez en lugar de pasar `--store` en cada comando:

```yaml
# openspec/config.yaml (el único archivo dentro de openspec/)
store: team-context
```

A partir de entonces, los comandos normales resuelven automáticamente al almacén declarado; el banner de raíz y el bloque JSON `root` informan de `source: "declared"` con el id del almacén, y las sugerencias impresas siguen incluyendo `--store <id>`. La declaración es una alternativa secundaria, nunca una anulación: el `--store` explícito siempre gana, y un directorio con carpetas de planificación reales ignora el puntero (con un aviso). Para convertir un repositorio puntero en una raíz de OpenSpec local, elimina la línea `store:` y ejecuta `openspec init`; init se niega a generar la estructura mientras la declaración esté presente.

Una variante a nivel de máquina se aplica a todos los repositorios a la vez: `openspec config set defaultStore <id>` (consulta Configuración). Solo se consulta después de que `--store`, una raíz local y un puntero de proyecto hayan fallado todos en la resolución; el banner de raíz y el bloque JSON `root` entonces informan de `source: "global_default"`.

## Doctor (salud de las relaciones)

Una única pregunta de solo lectura, en un solo lugar: ¿está saludable la raíz de OpenSpec y están disponibles las *store* a las que hace referencia en esta máquina?

```bash
openspec doctor [--store <id>] [--json]
```

El informe separa la salud de la raíz, la salud de los metadatos de la *store* (incluyendo una nota cuando el remoto registrado y el origen del *checkout* divergen, y una nota cuando el *checkout* de la *store* se ha desviado con respecto a la última referencia de seguimiento de *upstream* obtenida), y la salud de las referencias (se muestran las mismas instrucciones de diagnóstico, con correcciones de clonación para referencias sin resolver). Los hallazgos de salud de cualquier nivel de gravedad devuelven el código de salida 0 — los agentes leen los arrays `status`; solo los fallos de comando (no existe la raíz, *store* desconocida) devuelven el código de salida 1. El comando *doctor* nunca clona, sincroniza ni repara. Para obtener el propio conjunto ensamblado en lugar de su estado de salud, usa `openspec context`.

## Contexto de trabajo (el conjunto ensamblado)

Todo lo que este trabajo relaciona a través de las declaraciones de OpenSpec, en un único conjunto de trabajo: la raíz de OpenSpec y las *store* a las que hace referencia.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

El resumen en formato JSON es consumible por agentes (cada *store* referenciada disponible incluye su receta de obtención; los miembros sin resolver incluyen las mismas instrucciones de corrección que muestra el comando *doctor*). La opción `--code-workspace` además escribe un archivo de espacio de trabajo de VS Code que contiene la raíz junto con las *store* referenciadas disponibles (carpetas `ref:<id>`) — la única operación de escritura que realiza este comando, que se rechaza sin la opción `--force` si el archivo ya existe. Los miembros no disponibles se informan, nunca se suponen.

"Contexto de trabajo" es el conjunto ensamblado; el campo `context:` en `openspec/config.yaml` es el contexto de fondo del proyecto inyectado en las instrucciones — dos conceptos diferentes. `openspec doctor` responde si el conjunto está saludable; `openspec context` responde qué es el conjunto.

## Conjuntos de trabajo personales

> **Beta.** Los conjuntos de trabajo son parte de la nueva superficie beta; los comandos, indicadores y formatos de archivo pueden cambiar entre versiones. Para el recorrido paso a paso, consulta la [guía de almacenes](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Un conjunto de trabajo es una vista personal y con nombre de las carpetas en las que trabajas conjuntamente —una raíz de planificación más cualquier otra que elijas—, guardada en tu máquina y reabierta por nombre en tu herramienta. Es completamente local: nunca se confirma, nunca se comparte, nunca se deriva de declaraciones y eliminar uno nunca afecta a una carpeta miembro.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` ejecuta un flujo guiado corto (o acepta indicadores `--member` de forma no interactiva; el primer miembro es el principal —las sesiones empiezan ahí—). `open` lanza la herramienta elegida: los editores (VS Code, Cursor) abren una ventana con todos los miembros y regresan; los agentes de CLI (Claude Code, codex) toman el control de esta terminal como una sesión con todos los miembros adjuntos y sin indicación precompletada, finalizando cuando sales. Una carpeta miembro que falte al abrir se omite con una nota; el resto se abre. La preferencia de herramienta guardada se puede sobrescribir por apertura con `--tool`.

Admitir una nueva herramienta es una cuestión de configuración, no de código. Cada herramienta es uno de dos estilos de lanzamiento —`workspace-file` (lanzado con el `.code-workspace` generado) o `attach-dirs` (un indicador de adjunto por miembro)— y la clave `openers` en el `config.json` global (ábrelo con `openspec config edit`) agrega herramientas o ajusta las integradas por campo:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Todo el estado de los conjuntos de trabajo se encuentra en la carpeta `worksets/` del directorio de datos global (las vistas guardadas más los archivos `<name>.code-workspace` generados, regenerados en cada apertura); eliminar esa carpeta borra todo rastro.

---

## Comandos de navegación

### `openspec list`

Lista cambios o especificaciones en tu proyecto.

```
openspec list [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--specs` | Lista especificaciones en lugar de cambios |
| `--changes` | Lista cambios (predeterminado) |
| `--sort <order>` | Ordena por `recent` (predeterminado) o `name` |
| `--json` | Salida en formato JSON |

**Ejemplos:**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**Salida (texto):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Muestra un panel interactivo para explorar especificaciones y cambios.

```
openspec view
```

Abre una interfaz basada en terminal para navegar por las especificaciones y cambios de tu proyecto.

---

### `openspec show`

Muestra los detalles de un cambio o una especificación.

```
openspec show [item-name] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|-------------|-------------|
| `item-name` | No | Nombre del cambio o la especificación (pide confirmación si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--type <type>` | Especifica el tipo: `change` o `spec` (se detecta automáticamente si no es ambiguo) |
| `--json` | Salida en formato JSON |
| `--no-interactive` | Desactiva las solicitudes de confirmación |

**Opciones específicas de cambio:**

| Opción | Descripción |
|--------|-------------|
| `--deltas-only` | Muestra solo las especificaciones delta (modo JSON) |

**Opciones específicas de especificación:**

| Opción | Descripción |
|--------|-------------|
| `--requirements` | Muestra solo los requisitos, excluye los escenarios (modo JSON) |
| `--no-scenarios` | Excluye el contenido de los escenarios (modo JSON) |
| `-r, --requirement <id>` | Muestra un requisito específico por su índice base 1 (modo JSON) |

**Ejemplos:**

```bash
# Interactive selection
openspec show

# Show a specific change
openspec show add-dark-mode

# Show a specific spec
openspec show auth --type spec

# JSON output for parsing
openspec show add-dark-mode --json
```

---

## Comandos de validación

### `openspec validate`

Valida cambios y especificaciones en busca de problemas estructurales.

```
openspec validate [item-name] [options]
```

Un cambio con cero deltas de especificación falla la validación a menos que su `.openspec.yaml` declare `skip_specs: true` (para refactorizaciones puras, trabajo de herramientas o documentación — consulta la [Receta 5](examples.md#recipe-5-a-refactor-with-no-behavior-change)).

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|-------------|-------------|
| `item-name` | No | Elemento específico para validar (pide confirmación si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--all` | Valida todos los cambios y especificaciones |
| `--changes` | Valida todos los cambios |
| `--specs` | Valida todas las especificaciones |
| `--type <type>` | Especifica el tipo cuando el nombre es ambiguo: `change` o `spec` |
| `--strict` | Activa el modo de validación estricto |
| `--json` | Salida en formato JSON |
| `--concurrency <n>` | Validaciones paralelas máximas (predeterminado: 6, o la variable de entorno `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Desactiva las solicitudes de confirmación |

**Ejemplos:**

```bash
# Interactive validation
openspec validate

# Validate a specific change
openspec validate add-dark-mode

# Validate all changes
openspec validate --changes

# Validate everything with JSON output (for CI/scripts)
openspec validate --all --json

# Strict validation with increased parallelism
openspec validate --all --strict --concurrency 12
```

**Salida (texto):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**Salida (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Comandos del ciclo de vida

### `openspec archive`

Archiva un cambio completado y fusiona las especificaciones delta en las especificaciones principales.

```
openspec archive [change-name] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|-------------|-------------|
| `change-name` | No | Cambio para archivar (pide confirmación si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `-y, --yes` | Omite las solicitudes de confirmación |
| `--skip-specs` | Omite las actualizaciones de especificaciones para una ejecución de archivado. Un cambio que no tenga deltas de especificación de forma permanente debe declarar `skip_specs: true` en su `.openspec.yaml` en su lugar —se archiva sin indicador |
| `--no-validate` | Omite la validación (requiere confirmación) |

**Ejemplos:**

```bash
# Interactive archive
openspec archive

# Archive specific change
openspec archive add-dark-mode

# Archive without prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
openspec archive update-ci-config --skip-specs
```

**Qué hace:**

1. Valida el cambio (a menos que se use `--no-validate`)
2. Pide confirmación (a menos que se use `--yes`)
3. Fusiona las especificaciones delta en `openspec/specs/`
4. Mueve la carpeta del cambio a `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandos de flujo de trabajo

Estos comandos admiten el flujo de trabajo OPSX impulsado por artefactos. Son útiles tanto para humanos que comprueban el progreso como para agentes que determinan los próximos pasos.

### `openspec new change`

Crea un directorio de cambio y metadatos opcionales confirmados en la raíz de OpenSpec resuelta.

```bash
openspec new change <name> [options]
```

Los nombres de cambio deben usar kebab-case en minúsculas. Empiezan por una letra minúscula, luego contienen letras minúsculas, números y guiones simples. No pueden empezar por un número, contener espacios, guiones bajos, letras mayúsculas, guiones consecutivos o guiones iniciales/finales. Si incluyes un ID de ticket externo, ponle un prefijo con una palabra, por ejemplo `ticket-123-add-notifications` en lugar de `123-add-notifications`.

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--description <text>` | Descripción para agregar a `index.md` |
| `--goal <text>` | Metadatos de objetivo opcionales para guardar con el cambio |
| `--schema <name>` | Esquema de flujo de trabajo para usar |
| `--store <id>` | ID de almacén para usar como raíz de OpenSpec (un almacén es un repositorio independiente de OpenSpec que has registrado) |
| `--json` | Salida en JSON |

Ejemplos:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Muestra el estado de finalización de artefactos de un cambio.

```
openspec status [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (pide confirmación si se omite) |
| `--schema <name>` | Sobreescritura de esquema (se detecta automáticamente desde la configuración del cambio) |
| `--json` | Salida en formato JSON |

**Ejemplos:**

```bash
# Interactive status check
openspec status

# Status for specific change
openspec status --change add-dark-mode

# JSON for agent use
openspec status --change add-dark-mode --json
```

**Salida (texto):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[ ] design
[x] specs
[-] tasks (blocked by: design)
```

Un cambio que declara `skip_specs: true` muestra su etapa de especificaciones como `[~] specs (skipped: change declares skip_specs)` y la excluye del recuento de progreso.

**Salida (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Obtiene instrucciones enriquecidas para crear un artefacto o aplicar tareas. Lo usan los agentes de IA para entender qué crear a continuación.

```
openspec instructions [artifact] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|-------------|-------------|
| `artifact` | No | ID de artefacto: `proposal`, `specs`, `design`, `tasks` o `apply` |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (obligatorio en modo no interactivo) |
| `--schema <name>` | Sobreescritura de esquema |
| `--json` | Salida en formato JSON |

**Caso especial:** Usa `apply` como artefacto para obtener instrucciones de implementación de tareas.

**Ejemplos:**

```bash
# Get instructions for next artifact
openspec instructions --change add-dark-mode

# Get specific artifact instructions
openspec instructions design --change add-dark-mode

# Get apply/implementation instructions
openspec instructions apply --change add-dark-mode

# JSON for agent consumption
openspec instructions design --change add-dark-mode --json
```

**El resultado incluye:**

- Contenido de plantilla para el artefacto
- Contexto del proyecto desde la configuración
- Contenido de artefactos de dependencia
- Reglas por artefacto desde la configuración

Para un artefacto omitido mediante `skip_specs: true`, el resultado es solo una advertencia (el JSON agrega los campos `skipped`/`warning`) — no se debe crear el artefacto.

---

### `openspec templates`

Muestra las rutas de plantilla resueltas para todos los artefactos de un esquema.

```
openspec templates [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--schema <name>` | Esquema para inspeccionar (predeterminado: `spec-driven`) |
| `--json` | Salida en formato JSON |

**Ejemplos:**

```bash
# Show template paths for default schema
openspec templates

# Show templates for custom schema
openspec templates --schema my-workflow

# JSON for programmatic use
openspec templates --json
```

**Salida (texto):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Lista los esquemas de flujo de trabajo disponibles con sus descripciones y flujos de artefactos.

```
openspec schemas [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--json` | Salida en formato JSON |

**Ejemplo:**

```bash
openspec schemas
```

**Salida:**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

## Comandos de esquemas

Comandos para crear y gestionar esquemas de flujo de trabajo personalizados.

### `openspec schema init`

Crea un nuevo esquema local del proyecto.

```
openspec schema init <name> [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `name` | Sí | Nombre del esquema (kebab-case) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--description <text>` | Descripción del esquema |
| `--artifacts <list>` | IDs de artefactos separados por comas (predeterminado: `proposal,specs,design,tasks`) |
| `--default` | Establecer como esquema predeterminado del proyecto |
| `--no-default` | No solicitar confirmación para establecer como predeterminado |
| `--force` | Sobrescribir esquema existente |
| `--json` | Salida en formato JSON |

**Ejemplos:**

```bash
# Creación de esquema interactiva
openspec schema init research-first

# No interactivo con artefactos específicos
openspec schema init rapid \
  --description "Flujo de trabajo de iteración rápida" \
  --artifacts "proposal,tasks" \
  --default
```

**Lo que crea:**

```
openspec/schemas/<name>/
├── schema.yaml           # Definición del esquema
└── templates/
    ├── proposal.md       # Plantilla para cada artefacto
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Copia un esquema existente a tu proyecto para personalizarlo.

```
openspec schema fork <source> [name] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `source` | Sí | Esquema a copiar |
| `name` | No | Nombre del nuevo esquema (predeterminado: `<source>-custom`) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--force` | Sobrescribir destino existente |
| `--json` | Salida en formato JSON |

**Ejemplo:**

```bash
# Bifurca el esquema integrado orientado a especificaciones
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valida la estructura y plantillas de un esquema.

```
openspec schema validate [name] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `name` | No | Esquema a validar (valida todos si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--verbose` | Mostrar pasos de validación detallados |
| `--json` | Salida en formato JSON |

**Ejemplo:**

```bash
# Valida un esquema específico
openspec schema validate my-workflow

# Valida todos los esquemas
openspec schema validate
```

---

### `openspec schema which`

Muestra desde dónde se resuelve un esquema (útil para depurar la precedencia).

```
openspec schema which [name] [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `name` | No | Nombre del esquema |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--all` | Listar todos los esquemas con sus orígenes |
| `--json` | Salida en formato JSON |

**Ejemplo:**

```bash
# Comprueba de dónde proviene un esquema
openspec schema which spec-driven
```

**Salida:**

```
spec-driven se resuelve desde: paquete
  Origen: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedencia de esquemas:**

1. Proyecto: `openspec/schemas/<name>/`
2. Usuario: `~/.local/share/openspec/schemas/<name>/`
3. Paquete: Esquemas integrados

---

## Comandos de configuración

### `openspec config`

Ver y modificar la configuración global de OpenSpec.

```
openspec config <subcommand> [options]
```

**Subcomandos:**

| Subcomando | Descripción |
|------------|-------------|
| `path` | Mostrar la ubicación del archivo de configuración |
| `list` | Mostrar todos los ajustes actuales |
| `get <key>` | Obtener un valor específico |
| `set <key> <value>` | Establecer un valor |
| `unset <key>` | Eliminar una clave |
| `reset` | Restablecer a los valores predeterminados |
| `edit` | Abrir en `$EDITOR` |
| `profile [preset]` | Configurar el perfil de flujo de trabajo de forma interactiva o mediante un preajuste |

**Ejemplos:**

```bash
# Mostrar la ruta del archivo de configuración
openspec config path

# Listar todos los ajustes
openspec config list

# Obtener un valor específico
openspec config get telemetry.enabled

# Establecer un valor
openspec config set telemetry.enabled false

# Establecer un valor de cadena explícitamente
openspec config set user.name "My Name" --string

# Eliminar un ajuste personalizado
openspec config unset user.name

# Establecer un almacén predeterminado a nivel de máquina (raíz de respaldo cuando no hay --store,
# raíz local o almacén del proyecto: el puntero se resuelve)
openspec config set defaultStore team-plans

# Restablecer toda la configuración
openspec config reset --all --yes

# Editar la configuración en tu editor
openspec config edit

# Configurar el perfil con el asistente basado en acciones
openspec config profile

# Preajuste rápido: cambiar flujos de trabajo a core (mantiene el modo de entrega)
openspec config profile core
```

`openspec config profile` comienza con un resumen del estado actual, luego te permite elegir:
- Cambiar entrega + flujos de trabajo
- Cambiar solo la entrega
- Cambiar solo los flujos de trabajo
- Mantener los ajustes actuales (salir)

Si mantienes los ajustes actuales, no se escriben cambios y no se muestra ningún aviso de actualización.
Si no hay cambios en la configuración pero los archivos del proyecto actual no están sincronizados con tu perfil/modo de entrega global, OpenSpec mostrará una advertencia y sugerirá `openspec update`.
Presionar `Ctrl+C` también cancela el flujo de forma limpia (sin seguimiento de pila) y sale con el código `130`.
En la lista de verificación de flujos de trabajo, `[x]` significa que el flujo de trabajo está seleccionado en la configuración global. Para aplicar estas selecciones a los archivos del proyecto, ejecuta `openspec update` (o elige `¿Aplicar cambios a este proyecto ahora?` cuando se te solicite dentro de un proyecto).

**Ejemplos interactivos:**

```bash
# Actualización solo de entrega
openspec config profile
# elige: Cambiar solo la entrega
# elige entrega: Solo habilidades

# Actualización solo de flujos de trabajo
openspec config profile
# elige: Cambiar solo los flujos de trabajo
# activa/desactiva los flujos de trabajo en la lista de verificación, luego confirma
```

---

## Comandos de utilidad

### `openspec feedback`

Envía comentarios sobre OpenSpec. Crea una incidencia en GitHub.

```
openspec feedback <message> [options]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `message` | Sí | Mensaje de comentarios |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--body <text>` | Descripción detallada |

**Requisitos:** La CLI de GitHub (`gh`) debe estar instalada y autenticada.

**Ejemplo:**

```bash
openspec feedback "Añadir compatibilidad con tipos de artefactos personalizados" \
  --body "Me gustaría definir mis propios tipos de artefactos más allá de los integrados."
```

---

### `openspec completion`

Gestiona los autocompletados de shell para la CLI de OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subcomandos:**

| Subcomando | Descripción |
|------------|-------------|
| `generate [shell]` | Envía el script de autocompletado a la salida estándar |
| `install [shell]` | Instala el autocompletado para tu shell |
| `uninstall [shell]` | Elimina los autocompletados instalados |

**Shells compatibles:** `bash`, `zsh`, `fish`, `powershell`

**Ejemplos:**

```bash
# Instala los autocompletados (detecta el shell automáticamente)
openspec completion install

# Instala para un shell específico
openspec completion install zsh

# Genera el script para instalación manual
openspec completion generate bash > ~/.bash_completion.d/openspec

# Desinstala
openspec completion uninstall
```

---

## Códigos de salida

| Código | Significado |
|------|---------|
| `0` | Éxito |
| `1` | Error (fallo de validación, archivos faltantes, etc.) |

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Establecer en `0` para desactivar la telemetría |
| `DO_NOT_TRACK` | Establecer en `1` para desactivar la telemetría (señal DNT estándar) |
| `OPENSPEC_CONCURRENCY` | Concurrencia predeterminada para validación masiva (predeterminado: 6) |
| `EDITOR` o `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Desactiva la salida de colores cuando se establece |

---

## Documentación relacionada

- [Comandos](commands.md) - Comandos de barra oblicua de IA (`/opsx:propose`, `/opsx:apply`, etc.)
- [Flujos de trabajo](workflows.md) - Patrones comunes y cuándo usar cada comando
- [Personalización](customization.md) - Crea esquemas y plantillas personalizados
- [Primeros pasos](getting-started.md) - Guía de configuración inicial