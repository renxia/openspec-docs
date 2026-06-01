# Referencia de CLI

La CLI de OpenSpec (`openspec`) proporciona comandos de terminal para la configuración del proyecto, validación, inspección de estado y gestión. Estos comandos complementan los comandos slash de IA (como `/opsx:propose`) documentados en [Comandos](commands.md).

## Resumen

| Categoría | Comandos | Propósito |
|-----------|----------|-----------|
| **Configuración** | `init`, `update` | Inicializar y actualizar OpenSpec en tu proyecto |
| **Espacios de trabajo (beta)** | `workspace setup`, `workspace list`, `workspace ls`, `workspace link`, `workspace relink`, `workspace doctor`, `workspace update`, `workspace open` | Configurar vistas locales sobre repositorios o carpetas vinculadas |
| **Contexto compartido (beta)** | `context-store setup`, `context-store register`, `context-store unregister`, `context-store remove`, `context-store list`, `context-store doctor`, `initiative create`, `initiative show`, `initiative list` | Gestionar registros locales de context-store y contexto persistente de iniciativas |
| **Navegación** | `list`, `view`, `show` | Explorar cambios y especificaciones |
| **Validación** | `validate` | Comprobar cambios y especificaciones en busca de problemas |
| **Ciclo de vida** | `archive` | Finalizar cambios completados |
| **Flujo de trabajo** | `new change`, `set change`, `status`, `instructions`, `templates`, `schemas` | Soporte de flujo de trabajo impulsado por artefactos |
| **Esquemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Crear y gestionar flujos de trabajo personalizados |
| **Configuración** | `config` | Ver y modificar ajustes |
| **Utilidades** | `feedback`, `completion` | Retroalimentación e integración con el shell |

---

## Comandos para Humanos vs Agentes

La mayoría de los comandos CLI están diseñados para **uso humano** en un terminal. Algunos comandos también admiten **uso por agentes/scripts** mediante salida JSON.

### Comandos Exclusivamente para Humanos

Estos comandos son interactivos y están diseñados para uso en terminal:

| Comando | Propósito |
|---------|-----------|
| `openspec init` | Inicializar proyecto (indicaciones interactivas) |
| `openspec view` | Panel interactivo |
| `openspec config edit` | Abrir configuración en el editor |
| `openspec feedback` | Enviar comentarios a través de GitHub |
| `openspec completion install` | Instalar autocompletado de shell |

### Comandos Compatibles con Agentes

Estos comandos admiten la salida `--json` para uso programático por agentes de IA y scripts:

| Comando | Uso Humano | Uso Agente |
|---------|------------|------------|
| `openspec list` | Explorar cambios/especificaciones | `--json` para datos estructurados |
| `openspec show <item>` | Leer contenido | `--json` para análisis |
| `openspec validate` | Comprobar problemas | `--all --json` para validación masiva |
| `openspec status` | Ver progreso de artefactos | `--json` para estado estructurado |
| `openspec instructions` | Obtener próximos pasos | `--json` para instrucciones de agente |
| `openspec templates` | Encontrar rutas de plantillas | `--json` para resolución de rutas |
| `openspec schemas` | Listar esquemas disponibles | `--json` para descubrimiento de esquemas |
| `openspec workspace setup --no-interactive` | Crear un espacio de trabajo con entradas explícitas | `--json` para salida de configuración estructurada |
| `openspec workspace list` | Explorar espacios de trabajo conocidos | `--json` para objetos de espacio de trabajo tipados |
| `openspec workspace link` | Vincular un repositorio o carpeta | `--json` para salida de vinculación estructurada |
| `openspec workspace relink` | Reparar una ruta vinculada | `--json` para salida de vinculación estructurada |
| `openspec workspace doctor` | Comprobar un espacio de trabajo | `--json` para salida de estado estructurada |
| `openspec workspace update` | Actualizar la guía local del espacio de trabajo y las habilidades del agente | `--tools` selecciona agentes; el perfil selecciona flujos de trabajo |
| `openspec context-store setup <id>` | Crear un almacén de contexto local | `--json` con entradas explícitas para salida de configuración estructurada |
| `openspec context-store register <path>` | Registrar un almacén de contexto existente | `--json` para salida de registro estructurada |
| `openspec context-store unregister <id>` | Olvidar un registro de almacén de contexto local | `--json` para salida de limpieza estructurada |
| `openspec context-store remove <id>` | Eliminar una carpeta de almacén de contexto local registrada | `--yes --json` para eliminación no interactiva |
| `openspec context-store list` | Explorar almacenes de contexto registrados | `--json` para registros estructurados |
| `openspec context-store doctor` | Comprobar la configuración del almacén local | `--json` para diagnósticos estructurados |
| `openspec initiative list` | Explorar iniciativas compartidas | `--json` para registros de iniciativas estructurados |
| `openspec initiative show <id>` | Resolver una iniciativa | `--json` para rutas canónicas y metadatos |
| `openspec new change <id>` | Crear andamiaje de cambio local al repositorio | `--json`, más `--initiative` para enlaces de coordinación compartida |
| `openspec set change <id>` | Actualizar metadatos de cambio confirmados | `--json`, más `--initiative` para enlaces de coordinación compartida |

---

## Opciones Globales

Estas opciones funcionan con todos los comandos:

| Opción | Descripción |
|--------|-------------|
| `--version`, `-V` | Mostrar número de versión |
| `--no-color` | Deshabilitar la salida con color |
| `--help`, `-h` | Mostrar ayuda para el comando |

---

## Comandos de Configuración

### `openspec init`

Inicializa OpenSpec en tu proyecto. Crea la estructura de carpetas y configura las integraciones de herramientas de IA.

El comportamiento predeterminado usa los valores de configuración global predeterminados: perfil `core`, entrega `both`, flujos de trabajo `propose, explore, apply, sync, archive`.

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
| `--tools <list>` | Configurar herramientas de IA de forma no interactiva. Use `all`, `none` o una lista separada por comas |
| `--force` | Limpieza automática de archivos heredados sin solicitar confirmación |
| `--profile <profile>` | Anular el perfil global para esta ejecución de init (`core` o `custom`) |

`--profile custom` usa los flujos de trabajo que estén seleccionados actualmente en la configuración global (`openspec config profile`).

**IDs de herramientas admitidas (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `opencode`, `pi`, `qoder`, `lingma`, `qwen`, `roocode`, `trae`, `windsurf`

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

# Anular perfil para esta ejecución
openspec init --profile core

# Omitir indicaciones y limpiar archivos heredados automáticamente
openspec init --force
```

**Lo que crea:**

```
openspec/
├── specs/              # Tus especificaciones (fuente de verdad)
├── changes/            # Cambios propuestos
└── config.yaml         # Configuración del proyecto

.claude/skills/         # Habilidades de Claude Code (si se selecciona claude)
.cursor/skills/         # Habilidades de Cursor (si se selecciona cursor)
.cursor/commands/       # Comandos OPSX de Cursor (si la entrega incluye comandos)
... (otras configuraciones de herramientas)
```

---

### `openspec update`

Actualiza los archivos de instrucción de OpenSpec después de actualizar la CLI. Regenera los archivos de configuración de herramientas de IA utilizando tu perfil global actual, los flujos de trabajo seleccionados y el modo de entrega.

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

Los comandos de espacio de trabajo están en fase beta. El modelo de vista local que se muestra a continuación es la dirección actual, pero la automatización externa, las integraciones y los flujos de trabajo de larga duración aún deben tratar el comportamiento del comando, los archivos de estado y la salida JSON como elementos en evolución.

Los espacios de trabajo de coordinación son vistas locales de la máquina sobre repositorios o carpetas vinculados. La visibilidad del espacio de trabajo no es compromiso de cambio: vincula los repositorios o carpetas que OpenSpec debe conocer, luego crea cambios cuando estés listo para planificar un trabajo específico.

### `openspec workspace setup`

Crea un espacio de trabajo en la ubicación estándar de espacio de trabajo de OpenSpec y vincula al menos un repositorio o carpeta existente.

```bash
openspec workspace setup [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--name <name>` | Nombre del espacio de trabajo. Los nombres deben estar en formato kebab-case |
| `--link <path>` | Vincular un repositorio o carpeta existente e inferir el nombre del enlace a partir del nombre de la carpeta |
| `--link <name>=<path>` | Vincular un repositorio o carpeta existente con un nombre de enlace explícito |
| `--opener <id>` | Almacenar un abridor preferido durante la configuración no interactiva: `codex-cli`, `claude`, `github-copilot`, o `editor` |
| `--tools <tools>` | Instalar habilidades de OpenSpec locales al espacio de trabajo para agentes. Use `all`, `none` o IDs de herramientas separados por comas |
| `--no-interactive` | Deshabilitar indicaciones; requiere `--name` y al menos un `--link` |
| `--json` | Salida JSON; requiere `--no-interactive` |

**Ejemplos:**

```bash
openspec workspace setup
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli
openspec workspace setup --no-interactive --name platform --link /repos/api --tools codex,claude
openspec workspace setup --no-interactive --json --name checkout --link /repos/platform/apps/checkout
```

La configuración interactiva solicita un abridor preferido y puede instalar habilidades de OpenSpec locales al espacio de trabajo para los agentes seleccionados. La configuración no interactiva almacena un abridor preferido solo cuando se proporciona `--opener`; de lo contrario, `workspace open` solicitará más adelante en terminales interactivos cuando haya un abridor compatible disponible, o pedirá a los scripts que pasen `--agent <tool>` o `--editor`.

La instalación de habilidades del espacio de trabajo es solo de habilidades en esta fase beta: incluso si la entrega global es `commands` o `both`, la configuración del espacio de trabajo escribe carpetas de habilidades de agente en la raíz del espacio de trabajo y no crea archivos de comandos de barra. El perfil global activo elige qué habilidades de flujo de trabajo se instalan; `--tools` elige qué agentes las reciben. Si se omite `--tools` en la configuración no interactiva, no se instalan habilidades y `workspace update --tools <ids>` puede agregarlas más tarde.

### `openspec workspace list`

Lista los espacios de trabajo conocidos de OpenSpec del registro local.

```bash
openspec workspace list [--json]
openspec workspace ls [--json]
```

La lista muestra la ubicación de cada espacio de trabajo y los repositorios o carpetas vinculados. Los registros obsoletos del registro se informan pero no se modifican.

### `openspec workspace link`

Registra un repositorio o carpeta existente para un espacio de trabajo.

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

La ruta ya debe existir. Las rutas relativas se resuelven con respecto al directorio actual del comando antes de que OpenSpec almacene la ruta absoluta verificada en el estado local de la máquina del espacio de trabajo. Las rutas vinculadas pueden ser repositorios completos, paquetes, servicios, aplicaciones o carpetas sin estado local al repositorio `openspec/`.

### `openspec workspace relink`

Repara o cambia la ruta local para un enlace existente.

```bash
openspec workspace relink <name> <path> [options]
```

La ruta ya debe existir. Relink actualiza solo la ruta local de la máquina para el nombre de enlace estable.

### `openspec workspace doctor`

Comprueba lo que un espacio de trabajo puede resolver en la máquina actual.

```bash
openspec workspace doctor [options]
```

Doctor muestra la ubicación del espacio de trabajo, los repositorios o carpetas vinculados, las rutas faltantes, las rutas de especificaciones locales al repositorio cuando están presentes, y las correcciones sugeridas. La salida JSON también incluye la ruta de planificación del espacio de trabajo por compatibilidad. Solo informa problemas; no los repara automáticamente.

Los comandos que necesitan un espacio de trabajo usan el espacio de trabajo actual cuando se ejecutan desde dentro de una carpeta o subdirectorio del espacio de trabajo. Desde otro lugar, pasa `--workspace <name>`, selecciona del selector en un terminal interactivo, o confía en el único espacio de trabajo conocido cuando exactamente existe uno. En modo `--json` o `--no-interactive`, una selección ambigua falla con un error de estado estructurado y sugiere `--workspace <name>`.

Las respuestas JSON usan objetos tipados más matrices `status`. Los datos principales viven en `workspace`, `workspaces` o `link`; las advertencias y errores viven en `status`.

### `openspec workspace update`

Actualiza la guía de OpenSpec local al espacio de trabajo y las habilidades del agente.

```bash
openspec workspace update [name] [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--workspace <name>` | Seleccionar un espacio de trabajo conocido del registro local |
| `--tools <tools>` | Seleccionar agentes para habilidades del espacio de trabajo. Use `all`, `none` o IDs de herramientas separados por comas |
| `--json` | Salida JSON |
| `--no-interactive` | Deshabilitar indicaciones del selector de espacio de trabajo |

**Ejemplos:**

```bash
openspec workspace update
openspec workspace update platform
openspec workspace update --workspace platform --tools codex,claude
openspec workspace update --workspace platform --tools none
```

`workspace update` actualiza el bloque de guía generado del espacio de trabajo y la superficie local abierta. Para las habilidades del agente, reutiliza la selección de agente de habilidades del espacio de trabajo almacenada cuando se omite `--tools`. Pasar `--tools` reemplaza esa selección almacenada. Actualiza solo los directorios de habilidades de flujo de trabajo gestionados por OpenSpec en la raíz del espacio de trabajo, elimina las habilidades de flujo de trabajo gestionadas deseleccionadas y deja los repositorios y carpetas vinculados sin tocar.

Ejecutar `openspec update` desde dentro de un espacio de trabajo redirige a `openspec workspace update`; ejecuta `openspec update` dentro de proyectos locales al repositorio cuando quieras que se actualicen los archivos de herramientas propiedad del repositorio.

### `openspec workspace open`

Abre un conjunto de trabajo del espacio de trabajo a través del abridor preferido almacenado, una anulación de agente de sesión única o el modo editor de VS Code.

```bash
openspec workspace open [name] [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--workspace <name>` | Alias para el nombre posicional del espacio de trabajo |
| `--initiative <id>` | Abrir una iniciativa como una vista local del espacio de trabajo. Acepta `<id>` o `<store>/<id>` |
| `--store <id>` | ID del almacén de contexto registrado para `--initiative` |
| `--store-path <path>` | Raíz del almacén de contexto local existente para `--initiative` |
| `--agent <tool>` | Anulación de agente de sesión única: `codex-cli`, `claude`, o `github-copilot` |
| `--editor` | Abrir el archivo de espacio de trabajo mantenido de VS Code como un espacio de trabajo de editor normal |
| `--no-interactive` | Deshabilitar indicaciones del selector de espacio de trabajo y abridor |

**Ejemplos:**

```bash
openspec workspace open
openspec workspace open platform
openspec workspace open platform --agent github-copilot
openspec workspace open --agent codex-cli
openspec workspace open --editor
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative platform/billing-launch
```

`workspace open` usa el espacio de trabajo actual cuando se ejecuta dentro de uno, selecciona automáticamente el único espacio de trabajo conocido cuando se ejecuta en otro lugar, y pide al usuario que elija cuando se conocen múltiples espacios de trabajo. `--agent` y `--editor` no cambian el abridor preferido almacenado. Pasar ambas anulaciones de abridor es un error; elige `--agent <tool>` o `--editor`.

Cuando se usa `--initiative`, OpenSpec prepara o selecciona una vista privada local del espacio de trabajo para esa iniciativa. Los almacenes seleccionados por registro se almacenan por ID; `--store-path` almacena un selector de ruta local en tiempo de ejecución porque las vistas del espacio de trabajo son estado local privado.

OpenSpec mantiene `<nombre-espacio-trabajo>.code-workspace` en la raíz del espacio de trabajo para aperturas de VS Code editor y GitHub Copilot-en-VS-Code. Ese archivo es el estado de la vista local de la máquina del espacio de trabajo.

El espacio de trabajo mantenido de VS Code lista primero los repositorios o carpetas vinculados válidos, luego el contexto de la iniciativa cuando está adjunto, luego los archivos del espacio de trabajo de OpenSpec. VS Code muestra esas entradas como un espacio de trabajo multirraíz.

La apertura del espacio de trabajo raíz hace visibles los repositorios o carpetas vinculados para exploración y contexto. Las ediciones de implementación deben comenzar solo después de una solicitud explícita del usuario y un flujo de trabajo normal de implementación de OpenSpec.

---

## Comandos de Contexto Compartido

Los almacenes de contexto y las iniciativas son superficies de coordinación beta. Un almacén de contexto es un registro local para contexto compartido duradero, generalmente una carpeta o clon respaldado por Git. Una iniciativa es contexto de coordinación compartido dentro de un almacén de contexto; los cambios locales del repositorio pueden vincularse a ella sin copiar el plan compartido en cada repositorio.

### `openspec context-store setup`

Crea y registra un almacén de contexto local. Sin argumentos en una terminal,
OpenSpec guía al usuario durante la configuración. Los agentes y scripts deben proporcionar
entradas explícitas y usar `--json`.

```bash
openspec context-store setup [id] [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--path <path>` | Ruta de la carpeta del almacén de contexto; por defecto es el directorio de datos local gestionado por OpenSpec |
| `--init-git` | Inicializar un repositorio Git en el almacén de contexto |
| `--no-init-git` | No inicializar un repositorio Git |
| `--json` | Salida JSON |

Cuando se omite `--path`, la configuración crea el almacén en `getGlobalDataDir()/context-stores/<id>`: `$XDG_DATA_HOME/openspec/context-stores/<id>` cuando `XDG_DATA_HOME` está definido, o `~/.local/share/openspec/context-stores/<id>` en sistemas Unix como alternativa. Use `--path` cuando desee que el almacén esté en un clon visible o en una carpeta específica del equipo.

Ejemplos:

```bash
openspec context-store setup
openspec context-store setup team-context
openspec context-store setup team-context --path /repos/team-context --no-init-git
openspec context-store setup team-context --json --no-init-git
```

### `openspec context-store register`

Registra una carpeta de almacén de contexto local existente.

```bash
openspec context-store register [path] [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--id <id>` | ID del almacén de contexto; por defecto utiliza los metadatos del almacén o el nombre de la carpeta |
| `--json` | Salida JSON |

### `openspec context-store unregister`

Olvida el registro de un almacén de contexto local sin eliminar los archivos.

```bash
openspec context-store unregister <id> [--json]
```

Úselo cuando un almacén haya sido movido, clonado en otro lugar, o ya no deba ser
mostrado por OpenSpec en esta máquina.

### `openspec context-store remove`

Olvida el registro de un almacén de contexto local y elimina su carpeta local.

```bash
openspec context-store remove <id> [--yes] [--json]
```

`remove` muestra la carpeta exacta antes de eliminarla en una terminal interactiva.
Los agentes, scripts y llamadores JSON deben pasar `--yes` para confirmar la eliminación.
OpenSpec se niega a eliminar una carpeta que no contiene metadatos de almacén de contexto coincidentes.

### `openspec context-store list`

Enumera los almacenes de contexto registrados localmente.

```bash
openspec context-store list [--json]
openspec context-store ls [--json]
```

### `openspec context-store doctor`

Comprueba el registro local del almacén de contexto, los metadatos y la presencia de Git.

```bash
openspec context-store doctor [id] [--json]
```

Doctor es solo diagnóstico; informa sobre raíces faltantes, discrepancias en metadatos y estado inválido del registro local sin modificar el almacén.

### `openspec initiative create`

Crea una iniciativa en un almacén de contexto.

```bash
openspec initiative create <id> --title <title> --summary <summary> [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--store <id>` | ID del almacén de contexto del registro local |
| `--store-path <path>` | Raíz de un almacén de contexto local existente |
| `--title <title>` | Título de la iniciativa |
| `--summary <summary>` | Resumen de la iniciativa |
| `--json` | Salida JSON |

### `openspec initiative list`

Enumera las iniciativas. Sin un selector, busca en todos los almacenes de contexto registrados y reporta advertencias de lectura parcial en `status`.

```bash
openspec initiative list [options]
openspec initiative ls [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--store <id>` | Enumera un almacén de contexto registrado |
| `--store-path <path>` | Enumera la raíz de un almacén de contexto local existente |
| `--json` | Salida JSON |

### `openspec initiative show`

Resuelve una iniciativa e imprime su ubicación canónica.

```bash
openspec initiative show <id> [options]
openspec initiative show <store>/<id> [options]
```

Sin `--store`, OpenSpec busca en los almacenes de contexto registrados. Si la misma ID de iniciativa existe en múltiples almacenes, use `--store <id>` o la forma `<store>/<id>`.

---

## Comandos de Navegación

### `openspec list`

Lista cambios o especificaciones en tu proyecto.

```
openspec list [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--specs` | Lista especificaciones en lugar de cambios |
| `--changes` | Lista cambios (por defecto) |
| `--sort <order>` | Ordenar por `recent` (por defecto) o `name` |
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
  fix-login-bug     Manejo de tiempos de espera de sesión
```

---

### `openspec view`

Muestra un panel de control interactivo para explorar especificaciones y cambios.

```
openspec view
```

Abre una interfaz basada en terminal para navegar por las especificaciones y cambios de tu proyecto.

---

### `openspec show`

Muestra los detalles de un cambio o especificación.

```
openspec show [item-name] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `item-name` | No | Nombre del cambio o especificación (pregunta si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--type <type>` | Especifica el tipo: `change` o `spec` (se detecta automáticamente si no es ambiguo) |
| `--json` | Salida como JSON |
| `--no-interactive` | Deshabilita los prompts |

**Opciones específicas para cambios:**

| Opción | Descripción |
|--------|-------------|
| `--deltas-only` | Muestra solo especificaciones delta (modo JSON) |

**Opciones específicas para especificaciones:**

| Opción | Descripción |
|--------|-------------|
| `--requirements` | Muestra solo requisitos, excluye escenarios (modo JSON) |
| `--no-scenarios` | Excluye contenido de escenarios (modo JSON) |
| `-r, --requirement <id>` | Muestra un requisito específico por índice basado en 1 (modo JSON) |

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

Valida cambios y especificaciones en busca de problemas estructurales.

```
openspec validate [item-name] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `item-name` | No | Elemento específico a validar (pregunta si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--all` | Valida todos los cambios y especificaciones |
| `--changes` | Valida todos los cambios |
| `--specs` | Valida todas las especificaciones |
| `--type <type>` | Especifica el tipo cuando el nombre es ambiguo: `change` o `spec` |
| `--strict` | Habilita el modo de validación estricto |
| `--json` | Salida como JSON |
| `--concurrency <n>` | Validaciones paralelas máximas (por defecto: 6, o variable de entorno `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Deshabilita los prompts |

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

## Comandos del Ciclo de Vida

### `openspec archive`

Archiva un cambio completado y fusiona las especificaciones delta en las especificaciones principales.

```
openspec archive [change-name] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `change-name` | No | Cambio a archivar (pregunta si se omite) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `-y, --yes` | Omite los prompts de confirmación |
| `--skip-specs` | Omite actualizaciones de especificaciones (para cambios de infraestructura/herramientas/solo documentación) |
| `--no-validate` | Omite la validación (requiere confirmación) |

**Ejemplos:**

```bash
# Archivado interactivo
openspec archive

# Archivar cambio específico
openspec archive add-dark-mode

# Archivar sin prompts (CI/scripts)
openspec archive add-dark-mode --yes

# Archivar un cambio de herramientas que no afecta a las especificaciones
openspec archive update-ci-config --skip-specs
```

**Qué realiza:**

1. Valida el cambio (a menos que se use `--no-validate`)
2. Solicita confirmación (a menos que se use `--yes`)
3. Fusiona las especificaciones delta en `openspec/specs/`
4. Mueve la carpeta del cambio a `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## Comandos de Flujo de Trabajo

Estos comandos soportan el flujo de trabajo OPSX basado en artefactos. Son útiles tanto para humanos que verifican el progreso como para agentes que determinan los próximos pasos.

### `openspec new change`

Crea un directorio de cambio local del repositorio y metadatos opcionalmente registrados.

```bash
openspec new change <name> [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--description <text>` | Descripción a añadir a `README.md` |
| `--goal <text>` | Objetivo del producto del espacio de trabajo para almacenar con el cambio |
| `--areas <names>` | Nombres de vínculos del espacio de trabajo afectados, separados por comas |
| `--initiative <id>` | Vincula el cambio local del repositorio a una iniciativa |
| `--store <id>` | ID del almacén de contexto para `--initiative` |
| `--store-path <path>` | Raíz del almacén de contexto local existente para `--initiative` |
| `--schema <name>` | Esquema de flujo de trabajo a utilizar |
| `--json` | Salida JSON |

Ejemplos:

```bash
openspec new change add-billing-api --initiative billing-launch --store platform
openspec new change add-billing-api --initiative platform/billing-launch --json
```

### `openspec set change`

Actualiza los metadatos de un cambio local del repositorio registrado sin recrear el cambio.

```bash
openspec set change <name> [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--initiative <id>` | Vincula el cambio local del repositorio a una iniciativa |
| `--store <id>` | ID del almacén de contexto para `--initiative` |
| `--store-path <path>` | Raíz del almacén de contexto local existente para `--initiative` |
| `--json` | Salida JSON |

`set change --initiative` es idempotente cuando el vínculo solicitado ya existe y se niega a reemplazar un vínculo de iniciativa existente diferente.

### `openspec status`

Muestra el estado de completitud de los artefactos para un cambio.

```
openspec status [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (pregunta si se omite) |
| `--schema <name>` | Anulación del esquema (se detecta automáticamente desde la configuración del cambio) |
| `--json` | Salida como JSON |

**Ejemplos:**

```bash
# Verificación de estado interactiva
openspec status

# Estado de un cambio específico
openspec status --change add-dark-mode

# JSON para uso de agentes
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

Obtiene instrucciones enriquecidas para crear un artefacto o aplicar tareas. Utilizado por agentes de IA para comprender qué crear a continuación.

```
openspec instructions [artifact] [options]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `artifact` | No | ID del artefacto: `proposal`, `specs`, `design`, `tasks`, o `apply` |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--change <id>` | Nombre del cambio (requerido en modo no interactivo) |
| `--schema <name>` | Anulación del esquema |
| `--json` | Salida como JSON |

**Caso especial:** Usa `apply` como artefacto para obtener instrucciones de implementación de tareas.

**Ejemplos:**

```bash
# Obtener instrucciones para el próximo artefacto
openspec instructions --change add-dark-mode

# Obtener instrucciones de un artefacto específico
openspec instructions design --change add-dark-mode

# Obtener instrucciones de aplicación/implementación
openspec instructions apply --change add-dark-mode

# JSON para consumo de agentes
openspec instructions design --change add-dark-mode --json
```

**La salida incluye:**

- Contenido de la plantilla para el artefacto
- Contexto del proyecto desde la configuración
- Contenido de los artefactos de dependencia
- Reglas específicas por artefacto desde la configuración

---

### `openspec templates`

Muestra las rutas de plantillas resueltas para todos los artefactos en un esquema.

```
openspec templates [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--schema <name>` | Esquema a inspeccionar (por defecto: `spec-driven`) |
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

Lista los esquemas de flujo de trabajo disponibles con sus descripciones y flujos de artefactos.

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
    El flujo de trabajo de desarrollo basado en especificaciones predeterminado
    Flujo: proposal → specs → design → tasks

  my-custom (proyecto)
    Flujo de trabajo personalizado para este proyecto
    Flujo: research → proposal → tasks
```

---

## Comandos de esquema

Comandos para crear y administrar esquemas de flujo de trabajo personalizados.

### `openspec schema init`

Crea un nuevo esquema local del proyecto.

```
openspec schema init <nombre> [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `name` | Sí | Nombre del esquema (kebab-case) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--description <texto>` | Descripción del esquema |
| `--artifacts <lista>` | IDs de artefactos separados por coma (predeterminado: `proposal,specs,design,tasks`) |
| `--default` | Establecer como esquema predeterminado del proyecto |
| `--no-default` | No solicitar establecer como predeterminado |
| `--force` | Sobrescribir el esquema existente |
| `--json` | Salida como JSON |

**Ejemplos:**

```bash
# Creación interactiva del esquema
openspec schema init research-first

# No interactivo con artefactos específicos
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

Copia un esquema existente a tu proyecto para su personalización.

```
openspec schema fork <origen> [nombre] [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `source` | Sí | Esquema a copiar |
| `name` | No | Nombre del nuevo esquema (predeterminado: `<origen>-custom`) |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--force` | Sobrescribir el destino existente |
| `--json` | Salida como JSON |

**Ejemplo:**

```bash
# Bifurcar el esquema incorporado spec-driven
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
|----------|----------|-------------|
| `name` | No | Esquema a validar (valida todos si se omite) |

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

Muestra desde dónde se resuelve un esquema (útil para depurar la precedencia).

```
openspec schema which [nombre] [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `name` | No | Nombre del esquema |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--all` | Listar todos los esquemas con sus fuentes |
| `--json` | Salida como JSON |

**Ejemplo:**

```bash
# Comprobar de dónde proviene un esquema
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
3. Paquete: Esquemas incorporados

---

## Comandos de configuración

### `openspec config`

Ver y modificar la configuración global de OpenSpec.

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
| `profile [preset]` | Configurar perfil de flujo de trabajo de forma interactiva o mediante preset |

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

# Establecer explícitamente un valor de cadena
openspec config set user.name "Mi Nombre" --string

# Eliminar una configuración personalizada
openspec config unset user.name

# Restablecer toda la configuración
openspec config reset --all --yes

# Editar la configuración en tu editor
openspec config edit

# Configurar perfil con asistente basado en acciones
openspec config profile

# Preset rápido: cambiar flujos de trabajo a core (mantiene modo de entrega)
openspec config profile core
```

`openspec config profile` comienza con un resumen del estado actual, luego te permite elegir:
- Cambiar entrega + flujos de trabajo
- Cambiar solo la entrega
- Cambiar solo los flujos de trabajo
- Mantener configuración actual (salir)

Si mantienes la configuración actual, no se escriben cambios y no se muestra ningún aviso de actualización.
Si no hay cambios en la configuración, pero los archivos actuales del proyecto o del área de trabajo están desincronizados con tu perfil/entrega global, OpenSpec mostrará una advertencia y sugerirá `openspec update` para proyectos locales del repositorio o `openspec workspace update` para orientación y habilidades locales del área de trabajo.
Presionar `Ctrl+C` también cancela el flujo de manera limpia (sin rastreo de pila) y sale con código `130`.
En la lista de verificación de flujos de trabajo, `[x]` significa que el flujo de trabajo está seleccionado en la configuración global. Para aplicar esas selecciones a los archivos del proyecto, ejecuta `openspec update` (o elige `¿Aplicar cambios a este proyecto ahora?` cuando se te indique dentro de un proyecto). Desde dentro de un área de trabajo, usa `openspec workspace update` para actualizar la orientación y habilidades locales del área de trabajo; esto sigue siendo solo para habilidades en los archivos de flujo de trabajo del agente generado y no genera comandos de barra para el área de trabajo.

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

## Comandos de utilidad

### `openspec feedback`

Enviar comentarios sobre OpenSpec. Crea un issue en GitHub.

```
openspec feedback <mensaje> [opciones]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `message` | Sí | Mensaje de comentario |

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--body <texto>` | Descripción detallada |

**Requisitos:** GitHub CLI (`gh`) debe estar instalado y autenticado.

**Ejemplo:**

```bash
openspec feedback "Añadir soporte para tipos de artefactos personalizados" \
  --body "Me gustaría definir mis propios tipos de artefactos más allá de los incorporados."
```

---

### `openspec completion`

Administrar complementos de shell para la CLI de OpenSpec.

```
openspec completion <subcomando> [shell]
```

**Subcomandos:**

| Subcomando | Descripción |
|------------|-------------|
| `generate [shell]` | Generar script de complemento en stdout |
| `install [shell]` | Instalar complemento para tu shell |
| `uninstall [shell]` | Eliminar complementos instalados |

**Shells admitidos:** `bash`, `zsh`, `fish`, `powershell`

**Ejemplos:**

```bash
# Instalar complementos (detecta automáticamente el shell)
openspec completion install

# Instalar para un shell específico
openspec completion install zsh

# Generar script para instalación manual
openspec completion generate bash > ~/.bash_completion.d/openspec

# Desinstalar
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
| `OPENSPEC_TELEMETRY` | Establezca en `0` para deshabilitar la telemetría |
| `DO_NOT_TRACK` | Establezca en `1` para deshabilitar la telemetría (señal DNT estándar) |
| `OPENSPEC_CONCURRENCY` | Concurrencia predeterminada para validación masiva (predeterminado: 6) |
| `EDITOR` o `VISUAL` | Editor para `openspec config edit` |
| `NO_COLOR` | Deshabilita la salida en color cuando se establece |

---

## Documentación relacionada

- [Comandos](commands.md) - Comandos de barra de IA (`/opsx:propose`, `/opsx:apply`, etc.)
- [Flujos de trabajo](workflows.md) - Patrones comunes y cuándo usar cada comando
- [Personalización](customization.md) - Crear esquemas y plantillas personalizadas
- [Primeros pasos](getting-started.md) - Guía de configuración inicial