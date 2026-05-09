# Referencia de CLI

La CLI de OpenSpec (`openspec`) proporciona comandos de terminal para la configuración del proyecto, validación, inspección de estado y gestión. Estos comandos complementan los comandos de barra diagonal de IA (como `/opsx:propose`) documentados en [Comandos](commands.md).

## Resumen

| Categoría | Comandos | Propósito |
|-----------|----------|-----------|
| **Configuración** | `init`, `update` | Inicializar y actualizar OpenSpec en tu proyecto |
| **Espacios de trabajo (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace open` | Configurar la planificación en repositorios o carpetas vinculados |
| **Navegación** | `list`, `view`, `show` | Explorar cambios y especificaciones |
| **Validación** | `validate` | Comprobar cambios y especificaciones en busca de problemas |
| **Ciclo de vida** | `archive` | Finalizar cambios completados |
| **Flujo de trabajo** | `status`, `instructions`, `templates`, `schemas` | Soporte de flujo de trabajo basado en artefactos |
| **Esquemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Crear y gestionar flujos de trabajo personalizados |
| **Configuración** | `config` | Ver y modificar ajustes |
| **Utilidades** | `feedback`, `completion` | Comentarios e integración con el shell |

---

## Comandos Humanos vs. Agentes

La mayoría de los comandos de CLI están diseñados para **uso humano** en una terminal. Algunos comandos también admiten **uso por agentes/scripts** a través de la salida JSON.

### Comandos Solo para Humanos

Estos comandos son interactivos y están diseñados para uso en terminal:

| Comando | Propósito |
|---------|-----------|
| `openspec init` | Inicializar proyecto (indicaciones interactivas) |
| `openspec view` | Panel de control interactivo |
| `openspec config edit` | Abrir configuración en el editor |
| `openspec feedback` | Enviar comentarios a través de GitHub |
| `openspec completion install` | Instalar completados de shell |

### Comandos Compatibles con Agentes

Estos comandos admiten la salida `--json` para uso programático por agentes de IA y scripts:

| Comando | Uso Humano | Uso por Agente |
|---------|------------|----------------|
| `openspec list` | Explorar cambios/especificaciones | `--json` para datos estructurados |
| `openspec show <item>` | Leer contenido | `--json` para análisis |
| `openspec validate` | Verificar problemas | `--all --json` para validación masiva |
| `openspec status` | Ver progreso de artefactos | `--json` para estado estructurado |
| `openspec instructions` | Obtener próximos pasos | `--json` para instrucciones de agente |
| `openspec templates` | Encontrar rutas de plantillas | `--json` para resolución de rutas |
| `openspec schemas` | Listar esquemas disponibles | `--json` para descubrimiento de esquemas |
| `openspec workspace setup --no-interactive` | Crear un espacio de trabajo con entradas explícitas | `--json` para salida de configuración estructurada |
| `openspec workspace list` | Explorar espacios de trabajo conocidos | `--json` para objetos de espacio de trabajo tipados |
| `openspec workspace link` | Vincular un repositorio o carpeta | `--json` para salida de vinculación estructurada |
| `openspec workspace relink` | Reparar una ruta vinculada | `--json` para salida de vinculación estructurada |
| `openspec workspace doctor` | Verificar un espacio de trabajo | `--json` para salida de estado estructurado |

---

## Opciones Globales

Estas opciones funcionan con todos los comandos:

| Opción | Descripción |
|--------|-------------|
| `--version`, `-V` | Mostrar número de versión |
| `--no-color` | Deshabilitar salida con color |
| `--help`, `-h` | Mostrar ayuda para el comando |

---

## Comandos de Configuración

### `openspec init`

Inicializar OpenSpec en tu proyecto. Crea la estructura de carpetas y configura las integraciones de herramientas de IA.

El comportamiento predeterminado usa los valores predeterminados de configuración global: perfil `core`, entrega `both`, flujos de trabajo `propose, explore, apply, sync, archive`.

```
openspec init [path] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `path` | No | Directorio de destino (predeterminado: directorio actual) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--tools <list>` | Configurar herramientas de IA de forma no interactiva. Usar `all`, `none` o una lista separada por comas |
| `--force` | Limpieza automática de archivos heredados sin solicitar confirmación |
| `--profile <profile>` | Anular el perfil global para esta ejecución de init (`core` o `custom`) |

`--profile custom` utiliza los flujos de trabajo que estén seleccionados actualmente en la configuración global (`openspec config profile`).

**IDs de herramientas admitidas (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

**Ejemplos:**

```bash
# Inicialización interactiva
openspec init

# Inicializar en un directorio específico
openspec init ./my-project

# No interactivo: configurar para Claude y Cursor
openspec init --tools claude,cursor

# Configurar para todas las herramientas admitidas
openspec init --tools all

# Anular perfil para esta ejecución
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

Actualizar los archivos de instrucción de OpenSpec después de actualizar la CLI. Regenera los archivos de configuración de herramientas de IA usando tu perfil global actual, los flujos de trabajo seleccionados y el modo de entrega.

```
openspec update [path] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `path` | No | Directorio de destino (predeterminado: directorio actual) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--force` | Forzar actualización incluso cuando los archivos estén actualizados |

**Ejemplo:**

```bash
# Actualizar archivos de instrucción después de una actualización de npm
npm update @fission-ai/openspec
openspec update
```

---

## Comandos de Espacio de Trabajo

Los comandos de espacio de trabajo están en desarrollo activo y aún no están listos para su uso. No construyas automatización externa, integraciones o flujos de trabajo de larga duración sobre esta superficie de comandos; el comportamiento del comando, los archivos de estado y la salida JSON pueden cambiar en cualquier momento.

Los espacios de trabajo de coordinación son hogares de planificación para trabajo que abarca múltiples repositorios o carpetas. La visibilidad del espacio de trabajo no es un compromiso de cambio: vincula los repositorios o carpetas que OpenSpec debe conocer, luego crea cambios cuando estés listo para planificar un trabajo específico.

### `openspec workspace setup`

Crear un espacio de trabajo en la ubicación estándar de espacio de trabajo de OpenSpec y vincular al menos un repositorio o carpeta existente.

```bash
openspec workspace setup [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--name <name>` | Nombre del espacio de trabajo. Los nombres deben estar en kebab-case |
| `--link <path>` | Vincular un repositorio o carpeta existente e inferir el nombre del vínculo a partir del nombre de la carpeta |
| `--link <name>=<path>` | Vincular un repositorio o carpeta existente con un nombre de vínculo explícito |
| `--opener <id>` | Almacenar un abridor preferido durante la configuración no interactiva: `codex`, `claude`, `github-copilot` o `editor` |
| `--no-interactive` | Deshabilitar indicaciones; requiere `--name` y al menos un `--link` |
| `--json` | Salida JSON; requiere `--no-interactive` |

**Ejemplos:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

La configuración interactiva solicita un abridor preferido y lo almacena en el estado local de la máquina del espacio de trabajo. La configuración no interactiva almacena un abridor preferido solo cuando se proporciona `--opener`; de lo contrario, `workspace open` solicita más adelante en terminales interactivas cuando un abridor admitido está disponible, o pide a los scripts que pasen `--agent <tool>` o `--editor`.

### `openspec workspace list`

Listar los espacios de trabajo de OpenSpec conocidos del registro local.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

La lista muestra la ubicación de cada espacio de trabajo y los repositorios o carpetas vinculados. Los registros obsoletos del registro se informan pero no se modifican.

### `openspec workspace link`

Registrar un repositorio o carpeta existente para un espacio de trabajo.

```bash
openspec workspace link [name] <path> [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--workspace <name>` | Seleccionar un espacio de trabajo conocido del registro local |
| `--json` | Salida JSON |
| `--no-interactive` | Deshabilitar indicaciones del selector de espacio de trabajo |

**Ejemplos:**

```bash
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace link --workspace platform /repos/platform/apps/checkout
```

La ruta debe existir ya. Las rutas relativas se resuelven con respecto al directorio actual del comando antes de que OpenSpec almacene la ruta absoluta verificada en el estado local de la máquina del espacio de trabajo. Las rutas vinculadas pueden ser repositorios completos, paquetes, servicios, aplicaciones o carpetas sin estado `openspec/` local del repositorio.

### `openspec workspace relink`

Reparar o cambiar la ruta local para un vínculo existente.

```bash
openspec workspace relink <name> <path> [options]
```

La ruta debe existir ya. Relink actualiza solo la ruta local de la máquina para el nombre de vínculo estable.

### `openspec workspace doctor`

Verificar lo que un espacio de trabajo puede resolver en la máquina actual.

```bash
openspec workspace doctor [options]
```

Doctor muestra la ubicación del espacio de trabajo, la ruta de planificación, los repositorios o carpetas vinculados, las rutas faltantes, las rutas de especificaciones locales del repositorio cuando están presentes y las correcciones sugeridas. Solo informa problemas; no los repara automáticamente.

Los comandos que necesitan un espacio de trabajo utilizan el espacio de trabajo actual cuando se ejecutan desde dentro de una carpeta o subdirectorio del espacio de trabajo. Desde otro lugar, pasa `--workspace <name>`, selecciona del selector en una terminal interactiva, o confía en el único espacio de trabajo conocido cuando existe exactamente uno. En modo `--json` o `--no-interactive`, la selección ambigua falla con un error de estado estructurado y sugiere `--workspace <name>`.

Las respuestas JSON usan objetos tipados más matrices `status`. Los datos principales están en `workspace`, `workspaces` o `link`; las advertencias y errores están en `status`.

### `openspec workspace open`

Abrir un conjunto de trabajo del espacio de trabajo a través del abridor preferido almacenado, una anulación de agente de una sola sesión o el modo de editor de VS Code.

```bash
openspec workspace open [name] [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--workspace <name>` | Alias para el nombre posicional del espacio de trabajo |
| `--agent <tool>` | Anulación de agente de una sola sesión: `codex`, `claude` o `github-copilot` |
| `--editor` | Abrir el archivo de espacio de trabajo de VS Code mantenido como un espacio de trabajo de editor normal |
| `--no-interactive` | Deshabilitar indicaciones del selector de espacio de trabajo y abridor |

**Ejemplos:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex
openspec workspace open --editor
```

`workspace open` utiliza el espacio de trabajo actual cuando se ejecuta dentro de uno, selecciona automáticamente el único espacio de trabajo conocido cuando se ejecuta desde otro lugar, y pide al usuario que elija cuando se conocen múltiples espacios de trabajo. `--agent` y `--editor` no cambian el abridor preferido almacenado. Pasar ambas anulaciones de abridor es un error; elige `--agent <tool>` o `--editor`.

OpenSpec mantiene `<nombre-espacio-trabajo>.code-workspace` en la raíz del espacio de trabajo para aperturas de VS Code editor y GitHub Copilot-en-VS-Code. Ese archivo es local de la máquina y se ignora por defecto con una entrada específica de `.gitignore` para `<nombre-espacio-trabajo>.code-workspace`, por lo que los archivos `*.code-workspace` creados por el usuario siguen siendo elegibles para el seguimiento.

El espacio de trabajo de VS Code mantenido incluye la raíz de coordinación como `.` más los repositorios o carpetas vinculados válidos como raíces adicionales. VS Code muestra esas entradas como un espacio de trabajo de múltiples raíces.

La apertura del espacio de trabajo raíz admite la exploración y planificación a través de repositorios o carpetas vinculados. Las ediciones de implementación deben comenzar solo después de una solicitud explícita del usuario y un flujo de trabajo normal de implementación de OpenSpec.

## Comandos de Exploración

### `openspec list`

Listar cambios o especificaciones en tu proyecto.

```
openspec list [opciones]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--specs` | Listar especificaciones en lugar de cambios |
| `--changes` | Listar cambios (por defecto) |
| `--sort <orden>` | Ordenar por `recent` (reciente, por defecto) o `name` (nombre) |
| `--json` | Salida en formato JSON |

**Ejemplos:**

```bash
# Listar todos los cambios activos
openspec list

# Listar todas las especificaciones
openspec list --specs

# Salida JSON para scripts
openspec list --json
```

**Salida (texto):**

```
Cambios activos:
  add-dark-mode     Soporte para cambio de tema de interfaz
  fix-login-bug     Manejo de tiempo de espera de sesión
```

---

### `openspec view`

Mostrar un panel de control interactivo para explorar especificaciones y cambios.

```
openspec view
```

Abre una interfaz basada en terminal para navegar por las especificaciones y cambios de tu proyecto.

---

### `openspec show`

Mostrar detalles de un cambio o especificación.

```
openspec show [nombre-elemento] [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre-elemento` | No | Nombre del cambio o especificación (solicita si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--type <tipo>` | Especificar tipo: `change` (cambio) o `spec` (especificación) (se detecta automáticamente si no es ambiguo) |
| `--json` | Salida en formato JSON |
| `--no-interactive` | Deshabilitar indicaciones |

**Opciones específicas para cambios:**

| Opción | Descripción |
|--------|-------------|
| `--deltas-only` | Mostrar solo especificaciones delta (modo JSON) |

**Opciones específicas para especificaciones:**

| Opción | Descripción |
|--------|-------------|
| `--requirements` | Mostrar solo requisitos, excluir escenarios (modo JSON) |
| `--no-scenarios` | Excluir contenido de escenarios (modo JSON) |
| `-r, --requirement <id>` | Mostrar requisito específico por índice basado en 1 (modo JSON) |

**Ejemplos:**

```bash
# Selección interactiva
openspec show

# Mostrar un cambio específico
openspec show add-dark-mode

# Mostrar una especificación específica
openspec show auth --type spec

# Salida JSON para análisis
openspec show add-dark-mode --json
```

---

## Comandos de Validación

### `openspec validate`

Validar cambios y especificaciones en busca de problemas estructurales.

```
openspec validate [nombre-elemento] [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre-elemento` | No | Elemento específico a validar (solicita si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--all` | Validar todos los cambios y especificaciones |
| `--changes` | Validar todos los cambios |
| `--specs` | Validar todas las especificaciones |
| `--type <tipo>` | Especificar tipo cuando el nombre es ambiguo: `change` o `spec` |
| `--strict` | Habilitar modo de validación estricta |
| `--json` | Salida en formato JSON |
| `--concurrency <n>` | Máximo de validaciones paralelas (por defecto: 6, o variable de entorno `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Deshabilitar indicaciones |

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

# Validación estricta con mayor paralelismo
openspec validate --all --strict --concurrency 12
```

**Salida (texto):**

```
Validando add-dark-mode...
  ✓ proposal.md válido
  ✓ specs/ui/spec.md válido
  ⚠ design.md: falta la sección "Enfoque Técnico"

1 advertencia encontrada
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
        "warnings": ["design.md: falta la sección 'Enfoque Técnico'"]
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

## Comandos de Ciclo de Vida

### `openspec archive`

Archiva un cambio completado y fusiona las especificaciones delta en las especificaciones principales.

```
openspec archive [nombre-del-cambio] [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre-del-cambio` | No | Cambio a archivar (se solicita si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `-y, --yes` | Omitir confirmaciones |
| `--skip-specs` | Omitir actualizaciones de especificaciones (para cambios de infraestructura/herramientas/solo documentación) |
| `--no-validate` | Omitir validación (requiere confirmación) |

**Ejemplos:**

```bash
# Archivo interactivo
openspec archive

# Archivar un cambio específico
openspec archive add-dark-mode

# Archivar sin confirmaciones (CI/scripts)
openspec archive add-dark-mode --yes

# Archivar un cambio de herramientas que no afecta las especificaciones
openspec archive update-ci-config --skip-specs
```

**Qué hace:**

1. Valida el cambio (a menos que se use `--no-validate`)
2. Solicita confirmación (a menos que se use `--yes`)
3. Fusiona las especificaciones delta en `openspec/specs/`
4. Mueve la carpeta del cambio a `openspec/changes/archive/YYYY-MM-DD-<nombre>/`

---

## Comandos de Flujo de Trabajo

Estos comandos soportan el flujo de trabajo OPSX basado en artefactos. Son útiles tanto para humanos que verifican el progreso como para agentes que determinan los siguientes pasos.

### `openspec status`

Muestra el estado de completitud de los artefactos para un cambio.

```
openspec status [opciones]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (se solicita si se omite) |
| `--schema <nombre>` | Sobrescritura del esquema (se detecta automáticamente desde la configuración del cambio) |
| `--json` | Salida como JSON |

**Ejemplos:**

```bash
# Verificación de estado interactiva
openspec status

# Estado para un cambio específico
openspec status --change add-dark-mode

# JSON para uso de agentes
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
openspec instructions [artefacto] [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `artefacto` | No | ID del artefacto: `proposal`, `specs`, `design`, `tasks`, o `apply` |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (requerido en modo no interactivo) |
| `--schema <nombre>` | Sobrescritura del esquema |
| `--json` | Salida como JSON |

**Caso especial:** Use `apply` como artefacto para obtener instrucciones de implementación de tareas.

**Ejemplos:**

```bash
# Obtener instrucciones para el siguiente artefacto
openspec instructions --change add-dark-mode

# Obtener instrucciones para un artefacto específico
openspec instructions design --change add-dark-mode

# Obtener instrucciones de aplicación/implementación
openspec instructions apply --change add-dark-mode

# JSON para consumo de agentes
openspec instructions design --change add-dark-mode --json
```

**La salida incluye:**

- Contenido de la plantilla para el artefacto
- Contexto del proyecto desde la configuración
- Contenido de los artefactos de los que depende
- Reglas por artefacto desde la configuración

---

### `openspec templates`

Muestra las rutas resueltas de las plantillas para todos los artefactos en un esquema.

```
openspec templates [opciones]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--schema <nombre>` | Esquema a inspeccionar (predeterminado: `spec-driven`) |
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

Lista los esquemas de flujo de trabajo disponibles con sus descripciones y flujos de artefactos.

```
openspec schemas [opciones]
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
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Comandos de Esquema

Comandos para crear y gestionar esquemas de flujo de trabajo personalizados.

### `openspec schema init`

Crea un nuevo esquema local del proyecto.

```
openspec schema init <nombre> [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre` | Sí | Nombre del esquema (kebab-case) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--description <texto>` | Descripción del esquema |
| `--artifacts <lista>` | IDs de artefactos separados por comas (predeterminado: `proposal,specs,design,tasks`) |
| `--default` | Establecer como esquema predeterminado del proyecto |
| `--no-default` | No solicitar establecer como predeterminado |
| `--force` | Sobrescribir esquema existente |
| `--json` | Salida como JSON |

**Ejemplos:**

```bash
# Creación interactiva de esquema
openspec schema init research-first

# No interactivo con artefactos específicos
openspec schema init rapid \
  --description "Flujo de trabajo de iteración rápida" \
  --artifacts "proposal,tasks" \
  --default
```

**Qué crea:**

```
openspec/schemas/<nombre>/
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
openspec schema fork <fuente> [nombre] [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `fuente` | Sí | Esquema a copiar |
| `nombre` | No | Nombre del nuevo esquema (predeterminado: `<fuente>-custom`) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--force` | Sobrescribir destino existente |
| `--json` | Salida como JSON |

**Ejemplo:**

```bash
# Hacer un fork del esquema integrado spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valida la estructura y las plantillas de un esquema.

```
openspec schema validate [nombre] [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre` | No | Esquema a validar (valida todos si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--verbose` | Mostrar pasos de validación detallados |
| `--json` | Salida como JSON |

**Ejemplo:**

```bash
# Validar un esquema específico
openspec schema validate my-workflow

# Validar todos los esquemas
openspec schema validate
```

---

### `openspec schema which`

Muestra de dónde se resuelve un esquema (útil para depurar precedencia).

```
openspec schema which [nombre] [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre` | No | Nombre del esquema |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--all` | Listar todos los esquemas con sus fuentes |
| `--json` | Salida como JSON |

**Ejemplo:**

```bash
# Verificar de dónde proviene un esquema
openspec schema which spec-driven
```

**Salida:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedencia de esquemas:**

1. Proyecto: `openspec/schemas/<nombre>/`
2. Usuario: `~/.local/share/openspec/schemas/<nombre>/`
3. Paquete: Esquemas integrados

---

## Comandos de Configuración

### `openspec config`

Ver y modificar la configuración global de OpenSpec.

```
openspec config <subcomando> [opciones]
```

**Subcomandos:**

| Subcomando | Descripción |
|------------|-------------|
| `path` | Mostrar ubicación del archivo de configuración |
| `list` | Mostrar todos los ajustes actuales |
| `get <key>` | Obtener un valor específico |
| `set <key> <value>` | Establecer un valor |
| `unset <key>` | Eliminar una clave |
| `reset` | Restablecer valores predeterminados |
| `edit` | Abrir en `$EDITOR` |
| `profile [preset]` | Configurar perfil de flujo de trabajo de forma interactiva o mediante un preset |

**Ejemplos:**

```bash
# Mostrar ruta del archivo de configuración
openspec config path

# Listar todos los ajustes
openspec config list

# Obtener un valor específico
openspec config get telemetry.enabled

# Establecer un valor
openspec config set telemetry.enabled false

# Establecer explícitamente un valor de cadena
openspec config set user.name "Mi Nombre" --string

# Eliminar un ajuste personalizado
openspec config unset user.name

# Restablecer toda la configuración
openspec config reset --all --yes

# Editar configuración en tu editor
openspec config edit

# Configurar perfil con asistente basado en acciones
openspec config profile

# Preset rápido: cambiar flujos de trabajo a core (mantiene modo de entrega)
openspec config profile core
```

`openspec config profile` comienza con un resumen del estado actual y luego te permite elegir:
- Cambiar entrega + flujos de trabajo
- Cambiar solo la entrega
- Cambiar solo los flujos de trabajo
- Mantener ajustes actuales (salir)

Si mantienes los ajustes actuales, no se escriben cambios y no se muestra ninguna solicitud de actualización.
Si no hay cambios en la configuración pero los archivos del proyecto actual están desincronizados con tu perfil/entrega global, OpenSpec mostrará una advertencia y sugerirá ejecutar `openspec update`.
Presionar `Ctrl+C` también cancela el flujo de forma limpia (sin rastreo de pila) y sale con el código `130`.
En la lista de verificación de flujos de trabajo, `[x]` significa que el flujo de trabajo está seleccionado en la configuración global. Para aplicar esas selecciones a los archivos del proyecto, ejecuta `openspec update` (o elige `¿Aplicar cambios a este proyecto ahora?` cuando se te solicite dentro de un proyecto).

**Ejemplos interactivos:**

```bash
# Actualización solo de entrega
openspec config profile
# elegir: Cambiar solo la entrega
# elegir entrega: Solo habilidades

# Actualización solo de flujos de trabajo
openspec config profile
# elegir: Cambiar solo los flujos de trabajo
# alternar flujos de trabajo en la lista de verificación, luego confirmar
```

---

## Comandos de Utilidad

### `openspec feedback`

Enviar comentarios sobre OpenSpec. Crea un issue de GitHub.

```
openspec feedback <mensaje> [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `message` | Sí | Mensaje de comentarios |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--body <text>` | Descripción detallada |

**Requisitos:** GitHub CLI (`gh`) debe estar instalado y autenticado.

**Ejemplo:**

```bash
openspec feedback "Agregar soporte para tipos de artefactos personalizados" \
  --body "Me gustaría definir mis propios tipos de artefactos más allá de los incorporados."
```

---

### `openspec completion`

Administrar completados de shell para el CLI de OpenSpec.

```
openspec completion <subcomando> [shell]
```

**Subcomandos:**

| Subcomando | Descripción |
|------------|-------------|
| `generate [shell]` | Generar script de completado en stdout |
| `install [shell]` | Instalar completado para tu shell |
| `uninstall [shell]` | Eliminar completados instalados |

**Shells soportados:** `bash`, `zsh`, `fish`, `powershell`

**Ejemplos:**

```bash
# Instalar completados (detecta shell automáticamente)
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
|--------|-------------|
| `0` | Éxito |
| `1` | Error (fallo de validación, archivos faltantes, etc.) |

---

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Establecer en `0` para deshabilitar la telemetría |
| `DO_NOT_TRACK` | Establecer en `1` para deshabilitar la telemetría (señal DNT estándar) |
| `OPENSPEC_CONCURRENCY` | Concurrencia predeterminada para validación masiva (predeterminado: 6) |
| `EDITOR` o `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Deshabilitar salida de color cuando está establecida |

---

## Documentación Relacionada

- [Comandos](commands.md) - Comandos slash de IA (`/opsx:propose`, `/opsx:apply`, etc.)
- [Flujos de trabajo](workflows.md) - Patrones comunes y cuándo usar cada comando
- [Personalización](customization.md) - Crear esquemas y plantillas personalizadas
- [Primeros pasos](getting-started.md) - Guía de configuración inicial