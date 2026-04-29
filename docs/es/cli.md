# Referencia de la CLI

La CLI de OpenSpec (`openspec`) proporciona comandos de terminal para la configuración del proyecto, validación, inspección de estado y gestión. Estos comandos complementan los comandos de inteligencia artificial con barra inclinada (como `/opsx:propose`) documentados en [Comandos](commands.md).

## Resumen

| Categoría | Comandos | Propósito |
|-----------|----------|-----------|
| **Configuración** | `init`, `update` | Inicializar y actualizar OpenSpec en su proyecto |
| **Exploración** | `list`, `view`, `show` | Explorar cambios y especificaciones |
| **Validación** | `validate` | Verificar cambios y especificaciones en busca de problemas |
| **Ciclo de vida** | `archive` | Finalizar cambios completados |
| **Flujo de trabajo** | `status`, `instructions`, `templates`, `schemas` | Soporte para flujos de trabajo basados en artefactos |
| **Esquemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Crear y gestionar flujos de trabajo personalizados |
| **Configuración** | `config` | Ver y modificar ajustes |
| **Utilidad** | `feedback`, `completion` | Retroalimentación e integración con la shell |

## Comandos Humanos vs de Agente

La mayoría de los comandos de CLI están diseñados para **uso humano** en una terminal. Algunos comandos también admiten **uso por agente/script** mediante salida JSON.

### Comandos Solo para Humanos

Estos comandos son interactivos y están diseñados para uso en terminal:

| Comando | Propósito |
|---------|-----------|
| `openspec init` | Inicializar proyecto (indicaciones interactivas) |
| `openspec view` | Panel de control interactivo |
| `openspec config edit` | Abrir configuración en editor |
| `openspec feedback` | Enviar comentarios a través de GitHub |
| `openspec completion install` | Instalar completado de shell |

### Comandos Compatibles con Agentes

Estos comandos admiten salida `--json` para uso programático por agentes de IA y scripts:

| Comando | Uso Humano | Uso de Agente |
|---------|-----------|-----------|
| `openspec list` | Explorar cambios/ especificaciones | `--json` para datos estructurados |
| `openspec show <item>` | Leer contenido | `--json` para análisis |
| `openspec validate` | Verificar problemas | `--all --json` para validación por lotes |
| `openspec status` | Ver progreso de artefactos | `--json` para estado estructurado |
| `openspec instructions` | Obtener próximos pasos | `--json` para instrucciones de agente |
| `openspec templates` | Encontrar rutas de plantillas | `--json` para resolución de rutas |
| `openspec schemas` | Listar esquemas disponibles | `--json` para descubrimiento de esquemas |

---

## Opciones Globales

Estas opciones funcionan con todos los comandos:

| Opción | Descripción |
|--------|-------------|
| `--version`, `-V` | Mostrar número de versión |
| `--no-color` | Desactivar salida con color |
| `--help`, `-h` | Mostrar ayuda para el comando |

---

## Comandos de Configuración

### `openspec init`

Inicializar OpenSpec en su proyecto. Crea la estructura de carpetas y configura las integraciones de herramientas de IA.

El comportamiento predeterminado utiliza los valores por defecto de la configuración global: perfil `core`, entrega `both`, flujos de trabajo `propose, explore, apply, archive`.

```
openspec init [path] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `path` | No | Directorio objetivo (predeterminado: directorio actual) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--tools <list>` | Configurar herramientas de IA de forma no interactiva. Usar `all`, `none`, o lista separada por comas |
| `--force` | Limpieza automática de archivos heredados sin solicitar confirmación |
| `--profile <profile>` | Anular el perfil global para esta ejecución de init (`core` o `custom`) |

`--profile custom` utiliza los flujos de trabajo que estén seleccionados actualmente en la configuración global (`openspec config profile`).

**IDs de herramientas compatibles (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

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

# Saltar indicaciones y limpiar automáticamente archivos heredados
openspec init --force
```

**Lo que crea:**

```
openspec/
├── specs/              # Sus especificaciones (fuente de verdad)
├── changes/            # Cambios propuestos
└── config.yaml         # Configuración del proyecto

.claude/skills/         # Habilidades de Claude Code (si se selecciona claude)
.cursor/skills/         # Habilidades de Cursor (si se selecciona cursor)
.cursor/commands/       # Comandos OPSX de Cursor (si la entrega incluye comandos)
... (otras configuraciones de herramientas)
```

---

### `openspec update`

Actualizar los archivos de instrucciones de OpenSpec después de actualizar la CLI. Regenera los archivos de configuración de herramientas de IA utilizando su perfil global actual, los flujos de trabajo seleccionados y el modo de entrega.

```
openspec update [path] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `path` | No | Directorio objetivo (predeterminado: directorio actual) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--force` | Forzar actualización incluso cuando los archivos están actualizados |

**Ejemplo:**

```bash
# Actualizar archivos de instrucciones después de npm update
npm update @fission-ai/openspec
openspec update
```

---

## Comandos de Exploración

### `openspec list`

Listar cambios o especificaciones en su proyecto.

```
openspec list [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--specs` | Listar especificaciones en lugar de cambios |
| `--changes` | Listar cambios (predeterminado) |
| `--sort <order>` | Ordenar por `recent` (predeterminado) o `name` |
| `--json` | Salida como JSON |

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

Abre una interfaz basada en terminal para navegar por las especificaciones y cambios de su proyecto.

---

### `openspec show`

Mostrar detalles de un cambio o especificación.

```
openspec show [item-name] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `item-name` | No | Nombre del cambio o especificación (solicita si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--type <type>` | Especificar tipo: `change` o `spec` (se detecta automáticamente si no es ambiguo) |
| `--json` | Salida como JSON |
| `--no-interactive` | Desactivar indicaciones |

**Opciones específicas de cambio:**

| Opción | Descripción |
|--------|-------------|
| `--deltas-only` | Mostrar solo especificaciones delta (modo JSON) |

**Opciones específicas de especificación:**

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
| `--strict` | Activar modo de validación estricta |
| `--json` | Salida como JSON |
| `--concurrency <n>` | Validaciones paralelas máximas (predeterminado: 6, o variable de entorno `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Desactivar indicaciones |

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

Archivar un cambio completado y fusionar las especificaciones delta en las especificaciones principales.

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
| `-y, --yes` | Saltar indicaciones de confirmación |
| `--skip-specs` | Saltar actualizaciones de especificaciones (para cambios de infraestructura/herramientas/solo documentación) |
| `--no-validate` | Saltar validación (requiere confirmación) |

**Ejemplos:**

```bash
# Archivado interactivo
openspec archive

# Archivar un cambio específico
openspec archive add-dark-mode

# Archivar sin indicaciones (CI/scripts)
openspec archive add-dark-mode --yes

# Archivar un cambio de herramientas que no afecta las especificaciones
openspec archive update-ci-config --skip-specs
```

**Lo que hace:**

1. Valida el cambio (a menos que se use `--no-validate`)
2. Solicita confirmación (a menos que se use `--yes`)
3. Fusiona las especificaciones delta en `openspec/specs/`
4. Mueve la carpeta del cambio a `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandos de Flujo de Trabajo

Estos comandos soportan el flujo de trabajo OPSX impulsado por artefactos. Son útiles tanto para humanos que verifican el progreso como para agentes que determinan los próximos pasos.

### `openspec status`

Mostrar el estado de finalización de artefactos para un cambio.

```
openspec status [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (solicita si se omite) |
| `--schema <name>` | Anulación de esquema (se detecta automáticamente de la configuración del cambio) |
| `--json` | Salida como JSON |

**Ejemplos:**

```bash
# Verificación de estado interactiva
openspec status

# Estado para un cambio específico
openspec status --change add-dark-mode

# JSON para uso de agente
openspec status --change add-dark-mode --json
```

**Salida (texto):**

```
Cambio: add-dark-mode
Esquema: spec-driven
Progreso: 2/4 artefactos completos

[x] proposal
[ ] design
[x] specs
[-] tasks (bloqueado por: design)
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

Obtener instrucciones enriquecidas para crear un artefacto o aplicar tareas. Lo utilizan los agentes de IA para entender qué crear a continuación.

```
openspec instructions [artifact] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `artifact` | No | ID del artefacto: `proposal`, `specs`, `design`, `tasks`, o `apply` |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (requerido en modo no interactivo) |
| `--schema <name>` | Anulación de esquema |
| `--json` | Salida como JSON |

**Caso especial:** Usar `apply` como artefacto para obtener instrucciones de implementación de tareas.

**Ejemplos:**

```bash
# Obtener instrucciones para el siguiente artefacto
openspec instructions --change add-dark-mode

# Obtener instrucciones para un artefacto específico
openspec instructions design --change add-dark-mode

# Obtener instrucciones de aplicación/implementación
openspec instructions apply --change add-dark-mode

# JSON para consumo de agente
openspec instructions design --change add-dark-mode --json
```

**La salida incluye:**

- Contenido de plantilla para el artefacto
- Contexto del proyecto de la configuración
- Contenido de artefactos dependientes
- Reglas por artefacto de la configuración

---

### `openspec templates`

Mostrar las rutas de plantillas resueltas para todos los artefactos en un esquema.

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
Esquema: spec-driven

Plantillas:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Listar esquemas de flujo de trabajo disponibles con sus descripciones y flujos de artefactos.

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
Esquemas disponibles:

  spec-driven (paquete)
    El flujo de trabajo de desarrollo impulsado por especificaciones predeterminado
    Flujo: proposal → specs → design → tasks

  my-custom (proyecto)
    Flujo de trabajo personalizado para este proyecto
    Flujo: research → proposal → tasks
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
| `--artifacts <lista>` | IDs de artefactos separados por comas (por defecto: `proposal,specs,design,tasks`) |
| `--default` | Establecer como esquema predeterminado del proyecto |
| `--no-default` | No preguntar para establecer como predeterminado |
| `--force` | Sobrescribir esquema existente |
| `--json` | Salida en formato JSON |

**Ejemplos:**

```bash
# Creación interactiva de esquema
openspec schema init research-first

# No interactiva con artefactos específicos
openspec schema init rapid \
  --description "Flujo de trabajo de iteración rápida" \
  --artifacts "proposal,tasks" \
  --default
```

**Lo que crea:**

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
openspec schema fork <origen> [nombre] [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `origen` | Sí | Esquema a copiar |
| `nombre` | No | Nuevo nombre del esquema (por defecto: `<origen>-custom`) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--force` | Sobrescribir destino existente |
| `--json` | Salida en formato JSON |

**Ejemplo:**

```bash
# Bifurcar el esquema integrado spec-driven
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valida la estructura y plantillas de un esquema.

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

Muestra de dónde se resuelve un esquema (útil para depurar la precedencia).

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
| `--json` | Salida en formato JSON |

**Ejemplo:**

```bash
# Verificar de dónde viene un esquema
openspec schema which spec-driven
```

**Salida:**

```
spec-driven se resuelve desde: package
  Fuente: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedencia de esquemas:**

1. Proyecto: `openspec/schemas/<nombre>/`
2. Usuario: `~/.local/share/openspec/schemas/<nombre>/`
3. Paquete: Esquemas integrados

---

## Comandos de Configuración

### `openspec config`

Visualiza y modifica la configuración global de OpenSpec.

```
openspec config <subcomando> [opciones]
```

**Subcomandos:**

| Subcomando | Descripción |
|------------|-------------|
| `path` | Mostrar ubicación del archivo de configuración |
| `list` | Mostrar todas las configuraciones actuales |
| `get <clave>` | Obtener un valor específico |
| `set <clave> <valor>` | Establecer un valor |
| `unset <clave>` | Eliminar una clave |
| `reset` | Restablecer valores predeterminados |
| `edit` | Abrir en `$EDITOR` |
| `profile [preset]` | Configurar el perfil de flujo de trabajo de forma interactiva o mediante un preset |

**Ejemplos:**

```bash
# Mostrar ruta del archivo de configuración
openspec config path

# Listar todas las configuraciones
openspec config list

# Obtener un valor específico
openspec config get telemetry.enabled

# Establecer un valor
openspec config set telemetry.enabled false

# Establecer un valor de cadena explícitamente
openspec config set user.name "Mi Nombre" --string

# Eliminar una configuración personalizada
openspec config unset user.name

# Restablecer toda la configuración
openspec config reset --all --yes

# Editar configuración en tu editor
openspec config edit

# Configurar perfil con asistente basado en acciones
openspec config profile

# Preset rápido: cambiar flujos de trabajo a core (mantiene el modo de entrega)
openspec config profile core
```

`openspec config profile` comienza con un resumen del estado actual, luego te permite elegir:
- Cambiar entrega + flujos de trabajo
- Cambiar solo la entrega
- Cambiar solo los flujos de trabajo
- Mantener la configuración actual (salir)

Si mantienes la configuración actual, no se escriben cambios y no se muestra un aviso de actualización.
Si no hay cambios en la configuración, pero los archivos del proyecto actual están desincronizados con tu perfil/entrega global, OpenSpec mostrará una advertencia y sugerirá ejecutar `openspec update`.
Presionar `Ctrl+C` también cancela el flujo limpiamente (sin traza de pila) y sale con el código `130`.
En la lista de verificación de flujos de trabajo, `[x]` significa que el flujo de trabajo está seleccionado en la configuración global. Para aplicar esas selecciones a los archivos del proyecto, ejecuta `openspec update` (o elige `¿Aplicar cambios a este proyecto ahora?` cuando se te pregunte dentro de un proyecto).

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

Envía comentarios sobre OpenSpec. Crea un issue de GitHub.

```
openspec feedback <mensaje> [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `mensaje` | Sí | Mensaje de comentarios |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--body <texto>` | Descripción detallada |

**Requisitos:** La CLI de GitHub (`gh`) debe estar instalada y autenticada.

**Ejemplo:**

```bash
openspec feedback "Agregar soporte para tipos de artefactos personalizados" \
  --body "Me gustaría definir mis propios tipos de artefactos más allá de los integrados."
```

---

### `openspec completion`

Gestiona las completions de shell para la CLI de OpenSpec.

```
openspec completion <subcomando> [shell]
```

**Subcomandos:**

| Subcomando | Descripción |
|------------|-------------|
| `generate [shell]` | Generar script de completions en stdout |
| `install [shell]` | Instalar completions para tu shell |
| `uninstall [shell]` | Eliminar completions instaladas |

**Shells soportados:** `bash`, `zsh`, `fish`, `powershell`

**Ejemplos:**

```bash
# Instalar completions (detecta el shell automáticamente)
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
| `OPENSPEC_TELEMETRY` | Establecer en `0` para desactivar la telemetría |
| `DO_NOT_TRACK` | Establecer en `1` para desactivar la telemetría (señal DNT estándar) |
| `OPENSPEC_CONCURRENCY` | Concurrencia predeterminada para validación masiva (por defecto: 6) |
| `EDITOR` o `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Desactiva la salida en color cuando está establecida |

---

## Documentación Relacionada

- [Comandos](commands.md) - Comandos de slash de IA (`/opsx:propose`, `/opsx:apply`, etc.)
- [Flujos de Trabajo](workflows.md) - Patrones comunes y cuándo usar cada comando
- [Personalización](customization.md) - Crear esquemas y plantillas personalizados
- [Primeros Pasos](getting-started.md) - Guía de configuración inicial