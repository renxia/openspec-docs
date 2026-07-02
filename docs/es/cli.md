# Referencia de la CLI

La CLI de OpenSpec (`openspec`) proporciona comandos de terminal para la configuración del proyecto, validación, inspección de estado y gestión. Estos comandos complementan los comandos slash de IA (como `/opsx:propose`) documentados en [Commands](commands.md).

## Resumen

| Categoría | Comandos | Propósito |
|----------|----------|---------|
| **Configuración** | `init`, `update` | Inicializar y actualizar OpenSpec en su proyecto |
| **Almacenes (stores) (repositorios de OpenSpec independientes)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Gestionar almacenes — repositorios de OpenSpec independientes que ha registrado |
| **Salud** | `doctor` | Informar sobre la salud de las relaciones para la raíz resuelta |
| **Contexto de trabajo** | `context` | Ensamblar el conjunto de trabajo (root + almacenes referenciados) |
| **Worksets personales** | `workset create`, `workset list`, `workset open`, `workset remove` | Mantener y abrir vistas de trabajo personales y locales en su herramienta |
| **Exploración** | `list`, `view`, `show` | Explorar cambios y especificaciones (specs) |
| **Validación** | `validate` | Comprobar cambios y especificaciones (specs) en busca de problemas |
| **Ciclo de vida** | `archive` | Finalizar los cambios completados |
| **Flujo de trabajo** | `new change`, `status`, `instructions`, `templates`, `schemas` | Soporte de flujo de trabajo impulsado por artefactos |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Crear y gestionar flujos de trabajo personalizados |
| **Configuración** | `config` | Ver y modificar la configuración (settings) |
| **Utilidad** | `feedback`, `completion` | Retroalimentación e integración con la shell |

## Human vs Agent Commands

La mayoría de los comandos CLI están diseñados para el **uso humano** en una terminal. Algunos comandos también admiten el **uso por agentes/scripts** a través de salida JSON.

### Human-Only Commands

Estos comandos son interactivos y están diseñados para uso en terminal:

| Command | Purpose |
|---------|---------|
| `openspec init` | Inicializar proyecto (prompts interactivos) |
| `openspec view` | Panel de control interactivo |
| `openspec workset open <name>` | Abrir un workset guardado (ventana de editor o sesión de agente en terminal) |
| `openspec config edit` | Abrir la configuración en el editor |
| `openspec feedback` | Enviar comentarios a través de GitHub |
| `openspec completion install` | Instalar completions de shell |

### Agent-Compatible Commands

Estos comandos admiten salida `--json` para uso programático por parte de agentes de IA y scripts:

| Command | Human Use | Agent Use |
|---------|-----------|-----------|
| `openspec list` | Explorar cambios/specs | `--json` para datos estructurados |
| `openspec show <item>` | Leer contenido | `--json` para parseo |
| `openspec validate` | Comprobar problemas | `--all --json` para validación masiva |
| `openspec status` | Ver el progreso del artefacto | `--json` para estado estructurado |
| `openspec instructions` | Obtener los siguientes pasos | `--json` para instrucciones de agente |
| `openspec templates` | Encontrar rutas de plantillas | `--json` para resolución de rutas |
| `openspec schemas` | Listar esquemas disponibles | `--json` para descubrimiento de esquemas |
| `openspec store setup <id>` | Crear y registrar un almacén local | `--json` con entradas explícitas para salida estructurada de configuración |
| `openspec store register <path>` | Registrar un almacén existente | `--json` para salida de registro estructurado |
| `openspec store unregister <id>` | Olvidar un registro de almacén local | `--json` para salida de limpieza estructurada |
| `openspec store remove <id>` | Eliminar una carpeta de almacén registrada | `--yes --json` para eliminación no interactiva |
| `openspec store list` | Explorar almacenes registrados | `--json` para registros estructurados |
| `openspec store doctor` | Comprobar la configuración del almacén local | `--json` para diagnósticos estructurados |
| `openspec new change <id>` | Crear andamiaje de cambio a nivel de repositorio | `--json`, más `--store <id>` para usar un almacén registrado como raíz OpenSpec |
| `openspec workset create [name]` | Componer una vista de trabajo personal | `--member <path> --json` para composición no interactiva |
| `openspec workset list` | Explorar worksets guardados | `--json` para vistas estructuradas |
| `openspec workset remove <name>` | Eliminar una vista guardada | `--yes --json` para eliminación no interactiva |

---

## Global Options

Estas opciones funcionan con todos los comandos:

| Option | Description |
|--------|-------------|
| `--version`, `-V` | Mostrar número de versión |
| `--no-color` | Deshabilitar la salida en color |
| `--help`, `-h` | Mostrar ayuda para el comando |

---

## Setup Commands

### `openspec init`

Inicializa OpenSpec en tu proyecto. Crea la estructura de carpetas y configura las integraciones de herramientas de IA.

El comportamiento predeterminado utiliza los valores predeterminados de la configuración global: perfil `core`, entrega `both`, flujos de trabajo `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | Directorio objetivo (predeterminado: directorio actual) |

**Options:**

| Option | Description |
|--------|-------------|
| `--tools <list>` | Configurar herramientas de IA de forma no interactiva. Usar `all`, `none` o lista separada por comas |
| `--force` | Limpieza automática de archivos heredados sin solicitar confirmación |
| `--profile <profile>` | Sobrescribir el perfil global para esta ejecución de init (`core` o `custom`) |

`--profile custom` utiliza los flujos de trabajo seleccionados actualmente en la configuración global (`openspec config profile`).

**Supported tool IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

> Esta lista refleja `AI_TOOLS` en `src/core/config.ts`. Consulte [Supported Tools](supported-tools.md) para la habilidad y las rutas de comandos de cada herramienta.

**Examples:**

```bash
# Inicialización interactiva
openspec init

# Inicializar en un directorio específico
openspec init ./my-project

# No interactivo: configurar para Claude y Cursor
openspec init --tools claude,cursor

# Configurar para todas las herramientas compatibles
openspec init --tools all

# Sobrescribir el perfil para esta ejecución
openspec init --profile core

# Omitir prompts y limpiar automáticamente archivos heredados
openspec init --force
```

**What it creates:**

```
openspec/
├── specs/              # Tus especificaciones (fuente de verdad)
├── changes/            # Cambios propuestos
└── config.yaml         # Configuración del proyecto

.claude/skills/         # Habilidades de código de Claude (si claude fue seleccionado)
.cursor/skills/         # Habilidades de Cursor (si cursor fue seleccionado)
.cursor/commands/       # Comandos OPSX de Cursor (si la entrega incluye comandos)
... (otras configuraciones de herramientas)
```

---

### `openspec update`

Actualiza los archivos de instrucciones de OpenSpec después de actualizar el CLI. Re-genera los archivos de configuración de las herramientas de IA utilizando tu perfil global actual, flujos de trabajo seleccionados y modo de entrega.

```
openspec update [path] [options]
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `path` | No | Directorio objetivo (predeterminado: directorio actual) |

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | Forzar la actualización incluso cuando los archivos están actualizados |

**Example:**

```bash
# Actualizar archivos de instrucciones después de npm upgrade
npm update @fission-ai/openspec
openspec update
```

---

## Stores (repositorios OpenSpec independientes)

> **Beta.** Los almacenes y las características construidas sobre ellos (referencias, contexto de trabajo, worksets) son nuevos; los nombres de comandos, flags, formatos de archivo y salida JSON pueden cambiar entre versiones. Para la guía de recorrido basada en problemas, consulte [stores guide](stores-beta/user-guide.md).

Un almacén es un repositorio OpenSpec independiente que has registrado en esta máquina, por ejemplo, un repositorio de planificación o un repositorio de contratos. Registrar un almacén permite que los comandos normales (`list`, `show`, `status`, `validate`, `new change`, `archive`, ...) actúen en él desde cualquier lugar al pasar `--store <id>`.

### `openspec store setup`

Crea y registra un almacén local. Sin argumentos en una terminal,
OpenSpec guía al usuario a través de la configuración. Los agentes y scripts deben pasar entradas explícitas
y usar `--json`.

```bash
openspec store setup [id] [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--path <path>` | Carpeta donde debe residir el almacén (por ejemplo `~/openspec/<id>`) |
| `--remote <url>` | Registrar el remoto canónico en el `store.yaml` del nuevo almacén |
| `--init-git` | Inicializar un repositorio Git con un commit inicial (predeterminado) |
| `--no-init-git` | Omitir cualquier acción de Git: sin init, sin commit inicial |
| `--json` | Salida JSON |

Las ejecuciones no interactivas (`--json`, scripts, agentes) deben pasar tanto el id del almacén como `--path`. En una terminal interactiva, la configuración solicita la ubicación con una sugerencia editable en un lugar visible y propiedad del usuario (por ejemplo `~/openspec/<id>`); nunca utiliza por defecto el directorio de datos gestionado por OpenSpec.

Examples:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registra una carpeta de almacén local existente.

```bash
openspec store register [path] [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--id <id>` | Id del almacén; por defecto, el nombre del metadato o la carpeta |
| `--yes` | Confirmar la creación de metadatos de identidad del almacén para una raíz OpenSpec saludable |
| `--json` | Salida JSON |

### `openspec store unregister`

Olvidar un registro de almacén local sin eliminar archivos.

```bash
openspec store unregister <id> [--json]
```

Úsalo cuando un almacén haya sido movido, clonado en otro lugar o ya no deba ser mostrado por OpenSpec en esta máquina.

### `openspec store remove`

Olvidar un registro de almacén local y eliminar su carpeta local.

```bash
openspec store remove <id> [--yes] [--json]
```

`remove` muestra la carpeta exacta antes de eliminarla en una terminal interactiva. Los agentes, scripts y los que llaman vía JSON deben pasar `--yes` para confirmar la eliminación. OpenSpec se niega a eliminar una carpeta que no contiene metadatos de almacén coincidentes.

### `openspec store list`

Lista los almacenes registrados localmente.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Comprueba el registro del almacén local, los metadatos y la presencia de Git.

```bash
openspec store doctor [id] [--json]
```

Doctor es solo diagnóstico; informa sobre raíces faltantes, desajustes de metadatos e estado inválido del registro local sin modificar el almacén.

### Referencing stores from a project

Un repositorio de proyecto puede declarar qué almacenes utiliza su trabajo en `openspec/config.yaml`:

```yaml
schema: spec-driven
references:
  - team-context
```

A partir de entonces, la salida de `openspec instructions` en ese repositorio (tanto las superficies por artefacto como `apply`, JSON y modos humanos) lleva un índice de los specs de cada almacén referenciado — ids de especificación, un resumen de una línea de la sección Purpose de cada spec, y el comando de obtención (`openspec show <spec-id> --type spec --store <id>`). El índice se construye en vivo a partir del checkout registrado en cada ejecución; el contenido del spec nunca se copia en la salida.

Las referencias son contexto de solo lectura. Nunca cambian dónde actúan los comandos: el trabajo permanece en la raíz propia del repositorio, y escribir en un almacén referenciado sigue siendo una acción explícita `--store`. Una referencia que no puede resolverse (por ejemplo, un almacén no registrado en esta máquina) degrada a una advertencia en el índice con la corrección exacta, y las instrucciones aún se generan. `openspec doctor` informa sobre la salud de la referencia en un lugar.

### Recording where a store is cloned from

Un almacén puede registrar su fuente canónica de clonación en su archivo de identidad comprometido, para que la incorporación nunca termine en "registrar el almacén":

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

El remoto se registra en `.openspec-store/store.yaml` dentro del commit inicial, por lo que cada clonación nace sabiendo esto. Para un almacén existente, edita `store.yaml` manualmente y haz commit. `store doctor` muestra el remoto registrado (y el origen de Git observado por el checkout); setup/register le da nombre a la guía; y register registra el origen del checkout en el registro local de la máquina.

Una declaración de referencia también puede llevar la fuente de clonación, para que un compañero de equipo que aún no tiene el almacén obtenga una corrección completa y pegable (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Registrar un remoto no es sincronización: OpenSpec nunca clona, jala ni empuja por sí mismo.

### Declaring a default store

Un repositorio cuya planificación está completamente externalizada — sin `openspec/specs/` local o `openspec/changes/` — puede declarar su almacén una vez en lugar de pasar `--store` en cada comando:

```yaml
# openspec/config.yaml (el único archivo bajo openspec/)
store: team-context
```

Los comandos normales resuelven el almacén declarado automáticamente; la barra de estado raíz y el bloque `root` JSON informan `source: "declared"` con el id del almacén, y las sugerencias impresas aún llevan `--store <id>`. La declaración es un valor predeterminado, nunca una anulación: `--store` explícito siempre gana, y un directorio con carpetas de planificación reales ignora el puntero (con una advertencia). Para convertir un repositorio con puntero en una raíz OpenSpec local, elimina la línea `store:` y ejecuta `openspec init` — init se niega a generar andamiaje mientras la declaración esté presente.

## Doctor (salud de la relación)

Una pregunta de solo lectura, un único lugar: ¿está saludable el *root* de OpenSpec y están disponibles en esta máquina los almacenes a los que hace referencia?

```bash
openspec doctor [--store <id>] [--json]
```

El informe separa la salud del *root*, la salud de los metadatos del almacén (incluida una nota cuando el remoto registrado y el origen del *checkout* divergen) y la salud de las referencias (las mismas instrucciones de diagnóstico que se muestran, con correcciones de clonación para referencias no resueltas). Los hallazgos de salud de cualquier gravedad salen con 0; los agentes leen los arreglos `status`; solo los fallos de comando (sin *root*, almacén desconocido) salen con 1. Doctor nunca clona, sincroniza ni repara. Para obtener el conjunto ensamblado en sí en lugar de su salud, usa `openspec context`.

## Contexto de trabajo (el conjunto ensamblado)

Todo lo que este trabajo relaciona a través de las declaraciones OpenSpec, en un único conjunto de trabajo: el *root* de OpenSpec y los almacenes a los que hace referencia.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

El resumen JSON es consumible por agentes (cada almacén referenciado disponible lleva su receta de obtención; los miembros no resueltos llevan las mismas instrucciones de corrección y la información de *doctor*). `--code-workspace` además escribe un archivo de espacio de trabajo de VS Code que contiene el *root* más los almacenes referenciados disponibles (`ref:<id>` carpetas), siendo esta la única escritura que realiza este comando, rechazada sin `--force` si el archivo existe. Los miembros no disponibles se informan, nunca se adivinan.

"Contexto de trabajo" es el conjunto ensamblado; el campo `context:` en `openspec/config.yaml` es el trasfondo del proyecto inyectado en las instrucciones, dos cosas diferentes. `openspec doctor` responde si el conjunto está saludable; `openspec context` responde qué es el conjunto.

## Personal worksets

> **Beta.** Los worksets son parte de la nueva superficie beta; los comandos, flags y formatos de archivo pueden cambiar entre versiones. Para el recorrido, consulte la [guía de tiendas](stores-beta/user-guide.md#worksets-reopen-the-folders-you-work-on-together).

Un workset es una vista personal y con nombre de las carpetas en las que colaboran —una raíz de planificación más cualquier otra cosa que elijas— guardada en tu máquina y reabierta por su nombre en tu herramienta. Es puramente local: nunca se confirma, nunca se comparte, nunca se deriva de declaraciones, y eliminar uno nunca toca una carpeta miembro.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` ejecuta un flujo guiado corto (o acepta los flags `--member` de forma no interactiva; el primer miembro es el principal —las sesiones comienzan allí). `open` lanza la herramienta elegida: los editores (VS Code, Cursor) abren una ventana con cada miembro y regresan; los agentes CLI (Claude Code, codex) toman este terminal como una sesión con cada miembro adjunto y sin prellenar ningún prompt, terminando cuando sales. Se omite cualquier carpeta miembro que falte en el momento de la apertura con una nota; el resto se abre. La preferencia de herramienta guardada puede anularse por apertura con `--tool`.

El soporte para una nueva herramienta es configuración, no código. Cada herramienta es uno de dos estilos de lanzamiento —`workspace-file` (lanzado con el `.code-workspace` generado) o `attach-dirs` (un flag de adjunto por miembro)— y la clave `openers` en el `config.json` global (ábrelo con `openspec config edit`) añade herramientas o ajusta los integrados por campo:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Todo el estado del workset reside en la carpeta `worksets/` de la carpeta de datos global (las vistas guardadas más los archivos `<name>.code-workspace` generados, regenerados en cada apertura); eliminar esa carpeta elimina todo rastro.

---

## Comandos de navegación

### `openspec list`

Enumera cambios o especificaciones en tu proyecto.

```
openspec list [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--specs` | Enumera especificaciones en lugar de cambios |
| `--changes` | Enumera cambios (predeterminado) |
| `--sort <order>` | Ordenar por `recent` (reciente, predeterminado) o `name` (nombre) |
| `--json` | Salida como JSON |

**Ejemplos:**

```bash
# Enumerar todos los cambios activos
openspec list

# Enumerar todas las especificaciones
openspec list --specs

# Salida en formato JSON para scripts
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

Abre una interfaz basada en terminal para navegar por las especificaciones y los cambios de tu proyecto.

---

### `openspec show`

Muestra detalles de un cambio o una especificación.

```
openspec show [item-name] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `item-name` | No | Nombre del cambio o la especificación (solicita si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--type <type>` | Especificar tipo: `change` o `spec` (detectado automáticamente si no hay ambigüedad) |
| `--json` | Salida como JSON |
| `--no-interactive` | Deshabilitar prompts |

**Opciones específicas de cambios:**

| Opción | Descripción |
|--------|-------------|
| `--deltas-only` | Mostrar solo especificaciones delta (modo JSON) |

**Opciones específicas de especificaciones:**

| Opción | Descripción |
|--------|-------------|
| `--requirements` | Mostrar solo requisitos, excluir escenarios (modo JSON) |
| `--no-scenarios` | Excluir contenido de escenarios (modo JSON) |
| `-r, --requirement <id>` | Mostrar un requisito específico por índice basado en 1 (modo JSON) |

**Ejemplos:**

```bash
# Selección interactiva
openspec show

# Mostrar un cambio específico
openspec show add-dark-mode

# Mostrar una especificación específica
openspec show auth --type spec

# Salida en formato JSON para análisis
openspec show add-dark-mode --json
```

---

## Comandos de validación

### `openspec validate`

Valida cambios y especificaciones en busca de problemas estructurales.

```
openspec validate [item-name] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `item-name` | No | Elemento específico a validar (solicita si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--all` | Validar todos los cambios y especificaciones |
| `--changes` | Validar todos los cambios |
| `--specs` | Validar todas las especificaciones |
| `--type <type>` | Especificar tipo cuando el nombre es ambiguo: `change` o `spec` |
| `--strict` | Habilitar modo de validación estricta |
| `--json` | Salida como JSON |
| `--concurrency <n>` | Máximo de validaciones paralelas (predeterminado: 6, o entorno `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Deshabilitar prompts |

**Ejemplos:**

```bash
# Validación interactiva
openspec validate

# Validar un cambio específico
openspec validate add-dark-mode

# Validar todos los cambios
openspec validate --changes

# Validar todo con salida JSON (para CI/scripts)
openspec validate --all --json

# Validación estricta con paralelismo aumentado
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

## Comandos de ciclo de vida

### `openspec archive`

Archiva un cambio completado y fusiona las especificaciones delta en las especificaciones principales.

```
openspec archive [change-name] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Cambio a archivar (solicita si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `-y, --yes` | Saltar prompts de confirmación |
| `--skip-specs` | Omitir actualizaciones de especificaciones (para cambios solo de infraestructura/herramientas/documentación) |
| `--no-validate` | Omitir validación (requiere confirmación) |

**Ejemplos:**

```bash
# Archivo interactivo
openspec archive

# Archivar un cambio específico
openspec archive add-dark-mode

# Archivar sin prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Archivar un cambio de herramientas que no afecta a las especificaciones
openspec archive update-ci-config --skip-specs
```

**Qué hace:**

1. Valida el cambio (a menos que se use `--no-validate`)
2. Solicita confirmación (a menos que se use `--yes`)
3. Fusiona las especificaciones delta en `openspec/specs/`
4. Mueve la carpeta de cambios a `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandos de flujo de trabajo

Estos comandos soportan el flujo de trabajo OPSX basado en artefactos. Son útiles tanto para humanos que revisan el progreso como para agentes que determinan los próximos pasos.

### `openspec new change`

Crea una carpeta de cambio y metadatos opcionales registrados en la raíz OpenSpec resuelta.

```bash
openspec new change <name> [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--description <text>` | Descripción para añadir a `index.md` |
| `--goal <text>` | Metadato de objetivo opcional para almacenar con el cambio |
| `--schema <name>` | Esquema de flujo de trabajo a usar |
| `--store <id>` | ID de almacén para usar como la raíz OpenSpec (un almacén es un repositorio OpenSpec independiente que has registrado) |
| `--json` | Salida en formato JSON |

Ejemplos:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Muestra el estado de finalización del artefacto para un cambio.

```
openspec status [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (solicita si se omite) |
| `--schema <name>` | Sobreescritura de esquema (detectado automáticamente a partir de la configuración del cambio) |
| `--json` | Salida como JSON |

**Ejemplos:**

```bash
# Comprobación interactiva del estado
openspec status

# Estado para un cambio específico
openspec status --change add-dark-mode

# JSON para uso por agentes
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

**Salida (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done"},
    {"id": "design", "outputPath": "design.md", "status": "ready"},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done"},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "missingDeps": ["design"]}
  ]
}
```

---

### `openspec instructions`

Obtiene instrucciones enriquecidas para crear un artefacto o aplicar tareas. Utilizado por agentes de IA para entender qué crear a continuación.

```
openspec instructions [artifact] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `artifact` | No | ID del artefacto: `proposal`, `specs`, `design`, `tasks` o `apply` |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (requerido en modo no interactivo) |
| `--schema <name>` | Sobreescritura de esquema |
| `--json` | Salida como JSON |

**Caso especial:** Usa `apply` como el artefacto para obtener instrucciones de implementación de tareas.

**Ejemplos:**

```bash
# Obtener instrucciones para el próximo artefacto
openspec instructions --change add-dark-mode

# Obtener instrucciones para un artefacto específico
openspec instructions design --change add-dark-mode

# Obtener instrucciones de aplicación/implementación
openspec instructions apply --change add-dark-mode

# JSON para consumo por agentes
openspec instructions design --change add-dark-mode --json
```

**La salida incluye:**

- Contenido de la plantilla para el artefacto
- Contexto del proyecto a partir de la configuración
- Contenido de los artefactos dependientes
- Reglas específicas del artefacto a partir de la configuración

---

### `openspec templates`

Muestra las rutas de plantillas resueltas para todos los artefactos en un esquema.

```
openspec templates [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--schema <name>` | Esquema a inspeccionar (predeterminado: `spec-driven`) |
| `--json` | Salida como JSON |

**Ejemplos:**

```bash
# Mostrar rutas de plantillas para el esquema predeterminado
openspec templates

# Mostrar plantillas para un esquema personalizado
openspec templates --schema my-workflow

# JSON para uso programático
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

Enumera los esquemas de flujo de trabajo disponibles con sus descripciones y flujos de artefactos.

```
openspec schemas [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--json` | Salida como JSON |

**Ejemplo:**

```bash
openspec schemas
```

**Salida:**

```
Available schemas:

  spec-driven (package)
    El flujo de desarrollo predeterminado basado en especificaciones
    Flujo: proposal → specs → design → tasks

  my-custom (project)
    Flujo de trabajo personalizado para este proyecto
    Flujo: research → proposal → tasks
```

## Comandos de Esquema

Comandos para crear y gestionar esquemas de flujo de trabajo personalizados.

### `openspec schema init`

Crea un esquema local al proyecto.

```
openspec schema init <name> [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `name` | Sí | Nombre del esquema (kebab-case) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--description <text>` | Descripción del esquema |
| `--artifacts <list>` | IDs de artefactos separados por comas (predeterminado: `proposal,specs,design,tasks`) |
| `--default` | Establecer como esquema predeterminado del proyecto |
| `--no-default` | No solicitar establecerlo como predeterminado |
| `--force` | Sobrescribir el esquema existente |
| `--json` | Salida en formato JSON |

**Ejemplos:**

```bash
# Creación interactiva de esquemas
openspec schema init research-first

# Sin interacción con artefactos específicos
openspec schema init rapid \
  --description "Rapid iteration workflow" \
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

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `source` | Sí | Esquema a copiar |
| `name` | No | Nuevo nombre del esquema (predeterminado: `<source>-custom`) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--force` | Sobrescribir el destino existente |
| `--json` | Salida en formato JSON |

**Ejemplo:**

```bash
# Bifurcar (fork) el esquema 'spec-driven' incorporado
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valida la estructura y las plantillas de un esquema.

```
openspec schema validate [name] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `name` | No | Esquema a validar (valida todos si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--verbose` | Mostrar pasos de validación detallados |
| `--json` | Salida en formato JSON |

**Ejemplo:**

```bash
# Validar un esquema específico
openspec schema validate my-workflow

# Validar todos los esquemas
openspec schema validate
```

---

### `openspec schema which`

Muestra de dónde resuelve un esquema (útil para depurar la precedencia).

```
openspec schema which [name] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `name` | No | Nombre del esquema |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--all` | Listar todos los esquemas con sus fuentes |
| `--json` | Salida en formato JSON |

**Ejemplo:**

```bash
# Comprobar de dónde proviene un esquema
openspec schema which spec-driven
```

**Salida:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedencia del Esquema:**

1. Proyecto: `openspec/schemas/<name>/`
2. Usuario: `~/.local/share/openspec/schemas/<name>/`
3. Paquete: Esquemas incorporados

---

## Comandos de Configuración

### `openspec config`

Visualiza y modifica la configuración global de OpenSpec.

```
openspec config <subcommand> [options]
```

**Subcomandos:**

| Subcomando | Descripción |
|------------|-------------|
| `path` | Mostrar ubicación del archivo de configuración |
| `list` | Mostrar todas las configuraciones actuales |
| `get <key>` | Obtener un valor específico |
| `set <key> <value>` | Establecer un valor |
| `unset <key>` | Eliminar una clave |
| `reset` | Restablecer a valores predeterminados |
| `edit` | Abrir en `$EDITOR` |
| `profile [preset]` | Configurar el perfil de flujo de trabajo de forma interactiva o mediante un preset |

**Ejemplos:**

```bash
# Mostrar la ruta del archivo de configuración
openspec config path

# Listar todas las configuraciones
openspec config list

# Obtener un valor específico
openspec config get telemetry.enabled

# Establecer un valor
openspec config set telemetry.enabled false

# Establecer explícitamente un valor de cadena
openspec config set user.name "My Name" --string

# Eliminar una configuración personalizada
openspec config unset user.name

# Restablecer toda la configuración
openspec config reset --all --yes

# Editar la configuración en tu editor
openspec config edit

# Configurar el perfil con asistente basado en acciones
openspec config profile

# Preset rápido: cambiar flujos de trabajo a core (mantiene el modo de entrega)
openspec config profile core
```

`openspec config profile` comienza con un resumen del estado actual, y luego te permite elegir:
- Cambiar la entrega + flujos de trabajo
- Cambiar solo la entrega
- Cambiar solo los flujos de trabajo
- Mantener las configuraciones actuales (salir)

Si mantienes las configuraciones actuales, no se escriben cambios ni se muestra una solicitud de actualización.
Si no hay cambios en la configuración pero los archivos del proyecto actual están desincronizados con tu perfil/entrega global, OpenSpec mostrará una advertencia y sugerirá `openspec update`.
Presionar `Ctrl+C` también cancela el flujo limpiamente (sin trazas de pila) y sale con código `130`.
En la lista de verificación del flujo de trabajo, `[x]` significa que el flujo de trabajo está seleccionado en la configuración global. Para aplicar esas selecciones a los archivos del proyecto, ejecuta `openspec update` (o elige `¿Aplicar cambios a este proyecto ahora?` cuando se solicita dentro de un proyecto).

**Ejemplos interactivos:**

```bash
# Actualización solo de entrega
openspec config profile
# elegir: Cambiar solo la entrega
# elegir delivery: Skills only

# Actualización solo de flujos de trabajo
openspec config profile
# elegir: Cambiar solo los flujos de trabajo
# alternar los flujos de trabajo en la lista de verificación, luego confirmar
```

---

## Comandos de Utilidad

### `openspec feedback`

Envía comentarios sobre OpenSpec. Crea un problema (issue) en GitHub.

```
openspec feedback <message> [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `message` | Sí | Mensaje de comentarios |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--body <text>` | Descripción detallada |

**Requisitos:** Se debe tener instalado y autenticado el CLI de GitHub (`gh`).

**Ejemplo:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Gestiona las autocompletaciones de la CLI de OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subcomandos:**

| Subcomando | Descripción |
|------------|-------------|
| `generate [shell]` | Salida del script de autocompletado a stdout |
| `install [shell]` | Instalar la autocompletación para tu shell |
| `uninstall [shell]` | Eliminar las autocompletaciones instaladas |

**Shells compatibles:** `bash`, `zsh`, `fish`, `powershell`

**Ejemplos:**

```bash
# Instalar autocompletados (detecta el shell automáticamente)
openspec completion install

# Instalar para un shell específico
openspec completion install zsh

# Generar script para instalación manual
openspec completion generate bash > ~/.bash_completion.d/openspec

# Desinstalar
openspec completion uninstall
```

---

## Códigos de Salida

| Código | Significado |
|------|-------------|
| `0` | Éxito |
| `1` | Error (falla de validación, archivos faltantes, etc.) |

---

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Establecer en `0` para deshabilitar la telemetría |
| `DO_NOT_TRACK` | Establecer en `1` para deshabilitar la telemetría (señal DNT estándar) |
| `OPENSPEC_CONCURRENCY` | Concurrencia predeterminada para validación masiva (predeterminado: 6) |
| `EDITOR` o `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Deshabilitar la salida de color cuando está establecida |

---

## Documentación Relacionada

- [Commands](commands.md) - Comandos de barra AI (`/opsx:propose`, `/opsx:apply`, etc.)
- [Workflows](workflows.md) - Patrones comunes y cuándo usar cada comando
- [Customization](customization.md) - Crear esquemas y plantillas personalizados
- [Getting Started](getting-started.md) - Guía de configuración inicial