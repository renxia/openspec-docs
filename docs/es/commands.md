# Comandos

Esta es la referencia para los comandos de barra (slash) de OpenSpec. Estos comandos se invocan en la interfaz de chat de su asistente de codificación IA (por ejemplo, Claude Code, Cursor, Windsurf).

Para los patrones de flujo de trabajo y cuándo usar cada comando, consulte [Flujos de trabajo](workflows.md). Para los comandos CLI, consulte [CLI](cli.md).

## Referencia Rápida

### Ruta Rápida Predeterminada (`core` perfil)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Crear un cambio y generar artefactos de planificación en un solo paso |
| `/opsx:explore` | Analizar ideas antes de comprometerse con un cambio |
| `/opsx:apply` | Implementar tareas del cambio |
| `/opsx:sync` | Fusionar especificaciones Delta en las especificaciones principales |
| `/opsx:archive` | Archivar un cambio completado |

### Comandos de Flujo de Trabajo Expandidos (selección personalizada de flujos de trabajo)

| Command | Purpose |
|---------|---------|
| `/opsx:new` | Iniciar un nuevo esqueleto de cambio |
| `/opsx:continue` | Crear el siguiente artefacto basándose en las dependencias |
| `/opsx:ff` | Avanzar rápidamente (Fast-forward): crear todos los artefactos de planificación a la vez |
| `/opsx:verify` | Validar que la implementación coincide con los artefactos |
| `/opsx:bulk-archive` | Archivar múltiples cambios a la vez |
| `/opsx:onboard` | Tutorial guiado del flujo de trabajo completo |

El perfil global predeterminado es `core`. Para habilitar los comandos de flujo de trabajo expandidos, ejecute `openspec config profile`, seleccione los flujos de trabajo y luego ejecute `openspec update` en su proyecto.

## Referencia de Comandos

### `/opsx:propose`

Crea un nuevo cambio y genera artefactos de planificación en un solo paso. Este es el comando de inicio predeterminado en el perfil `core`.

**Sintaxis:**
```text
/opsx:propose [change-name-or-description]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name-or-description` | No | Nombre en kebab-case o descripción del cambio en lenguaje sencillo |

**Qué hace:**
- Crea `openspec/changes/<change-name>/`
- Genera los artefactos necesarios antes de la implementación (para `spec-driven`: propuesta, especificaciones, diseño, tareas)
- Se detiene cuando el cambio está listo para `/opsx:apply`

**Ejemplo:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Consejos:**
- Úsalo para el camino más rápido de principio a fin
- Si deseas un control granular paso a paso de los artefactos, habilita flujos de trabajo expandidos y usa `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Empieza aquí si no estás seguro.** Explore es un compañero de pensamiento sin riesgos: lee tu base de código, compara opciones y refina una idea vaga en un plan concreto antes de que exista cualquier cambio. Viene incluido en el perfil predeterminado. Para el caso completo y más ejemplos, consulta la guía [Explore First](explore.md).

Piensa sobre ideas, investiga problemas y aclara requisitos antes de comprometerte con un cambio.

**Sintaxis:**
```
/opsx:explore [topic]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `topic` | No | Lo que quieres explorar o investigar |

**Qué hace:**
- Abre una conversación exploratoria sin requerir estructura
- Investiga la base de código para responder preguntas
- Compara opciones y enfoques
- Crea diagramas visuales para clarificar el pensamiento
- Puede transicionar a `/opsx:propose` (predeterminado) o `/opsx:new` (flujo de trabajo expandido) cuando las ideas se cristalizan

**Ejemplo:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Consejos:**
- Úsalo cuando los requisitos no estén claros o necesites investigar
- No se crean artefactos durante la exploración
- Es bueno para comparar múltiples enfoques antes de decidir
- Puede leer archivos y buscar en la base de código

---

### `/opsx:new`

Inicia un nuevo esqueleto de cambio. Crea la carpeta del cambio y espera a que generes los artefactos con `/opsx:continue` o `/opsx:ff`.

Este comando forma parte del conjunto de flujos de trabajo expandidos (no incluido en el perfil `core` predeterminado).

**Sintaxis:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Nombre para la carpeta del cambio (se solicita si no se proporciona) |
| `--schema` | No | Esquema de flujo de trabajo a usar (predeterminado: desde la configuración o `spec-driven`) |

**Qué hace:**
- Crea el directorio `openspec/changes/<change-name>/`
- Crea el archivo de metadatos `.openspec.yaml` en la carpeta del cambio
- Muestra la primera plantilla de artefacto lista para crear
- Solicita el nombre y el esquema del cambio si no se proporcionan

**Qué crea:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Metadatos del cambio (esquema, fecha de creación)
```

**Ejemplo:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Consejos:**
- Usa nombres descriptivos: `add-feature`, `fix-bug`, `refactor-module`
- Evita nombres genéricos como `update`, `changes`, `wip`
- El esquema también se puede establecer en la configuración del proyecto (`openspec/config.yaml`)

---

### `/opsx:continue`

Crea el siguiente artefacto en la cadena de dependencias. Crea un artefacto a la vez para un progreso incremental.

**Sintaxis:**
```
/opsx:continue [change-name]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Qué cambio continuar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Consulta el grafo de dependencias de artefactos
- Muestra qué artefactos están listos vs bloqueados
- Crea el primer artefacto listo
- Lee los archivos de dependencia para obtener contexto
- Muestra lo que está disponible después de la creación

**Ejemplo:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**Consejos:**
- Úsalo cuando quieras revisar cada artefacto antes de continuar
- Es bueno para cambios complejos donde quieres control
- Varios artefactos pueden estar listos simultáneamente
- Puedes editar los artefactos creados antes de continuar

---

### `/opsx:ff`

Avanza rápidamente la creación de artefactos. Crea todos los artefactos de planificación a la vez.

**Sintaxis:**
```
/opsx:ff [change-name]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Qué cambio avanzar rápidamente (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Crea todos los artefactos en orden de dependencia
- Rastrea el progreso a través de una lista de tareas pendientes
- Se detiene cuando todos los artefactos `apply-required` están completos
- Lee cada dependencia antes de crear el siguiente artefacto

**Ejemplo:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Consejos:**
- Úsalo cuando tengas una imagen clara de lo que estás construyendo
- Es más rápido que `/opsx:continue` para cambios sencillos
- Aún puedes editar los artefactos después
- Es bueno para características pequeñas a medianas

---

### `/opsx:apply`

Implementa las tareas del cambio. Pasa por la lista de tareas, escribiendo código y marcando elementos como completados.

**Sintaxis:**
```
/opsx:apply [change-name]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Qué cambio implementar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Lee `tasks.md` e identifica las tareas incompletas
- Pasa por las tareas una por una
- Escribe código, crea archivos, ejecuta pruebas según sea necesario
- Marca las tareas como completadas con casillas de verificación `[x]`

**Ejemplo:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Consejos:**
- Puede reanudar donde lo dejaste si es interrumpido
- Úsalo para cambios paralelos especificando el nombre del cambio
- El estado de finalización se rastrea en las casillas de verificación de `tasks.md`

---

### `/opsx:verify`

Valida que la implementación coincida con los artefactos del cambio. Comprueba la integridad, la corrección y la coherencia.

**Sintaxis:**
```
/opsx:verify [change-name]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Qué cambio verificar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Comprueba tres dimensiones de calidad de la implementación
- Busca evidencia de implementación en la base de código
- Reporta problemas categorizados como CRITICAL, WARNING o SUGGESTION
- No bloquea el archivo, pero muestra los problemas

**Dimensiones de verificación:**

| Dimensión | Qué valida |
|-----------|-------------------|
| **Completeness** | Todas las tareas realizadas, todos los requisitos implementados, escenarios cubiertos |
| **Correctness** | La implementación coincide con la intención del especificación, se manejan casos límite |
| **Coherence** | Las decisiones de diseño se reflejan en el código, los patrones son consistentes |

**Ejemplo:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Consejos:**
- Ejecútalo antes de archivar para detectar discrepancias a tiempo
- Las advertencias no bloquean el archivo, pero indican posibles problemas
- Es bueno para revisar el trabajo de la IA antes de comprometerse
- Puede revelar desviaciones entre los artefactos y la implementación

---

### `/opsx:sync`

**Comando opcional.** Fusiona las especificaciones delta de un cambio en las especificaciones principales. El archivo solicitará sincronizar si es necesario, por lo que normalmente no necesitas ejecutar esto manualmente.

**Sintaxis:**
```
/opsx:sync [change-name]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Qué cambio sincronizar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Lee las especificaciones delta de la carpeta del cambio
- Analiza las secciones ADDED/MODIFIED/REMOVED/RENAMED
- Fusiona los cambios en el directorio principal `openspec/specs/`
- Preserva el contenido existente que no se menciona en el delta
- No archiva el cambio (permanece activo)

**Ejemplo:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Cuándo usarlo manualmente:**

| Escenario | ¿Usar sync? |
|----------|-----------|
| Cambio de larga duración, quiero las especificaciones en el principal antes de archivar | Sí |
| Varios cambios paralelos necesitan las especificaciones base actualizadas | Sí |
| Quiero previsualizar/revisar la fusión por separado | Sí |
| Cambio rápido, yendo directo al archivo | No (el archivo lo maneja) |

**Consejos:**
- Sync es inteligente, no copia y pega
- Puede añadir escenarios a requisitos existentes sin duplicarlos
- El cambio permanece activo después de la sincronización (no archivado)
- La mayoría de los usuarios nunca necesitarán llamarlo directamente: el archivo solicita si es necesario

---

### `/opsx:archive`

Archiva un cambio completado. Finaliza el cambio y lo mueve a la carpeta de archivo.

**Sintaxis:**
```
/opsx:archive [change-name]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Qué cambio archivar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Comprueba el estado de finalización de los artefactos
- Comprueba la finalización de las tareas (avisa si están incompletas)
- Ofrece sincronizar las especificaciones delta si aún no lo ha hecho
- Mueve la carpeta del cambio a `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Preserva todos los artefactos para el rastro de auditoría

**Ejemplo:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Consejos:**
- El archivo no bloqueará por tareas incompletas, pero sí avisará
- Las especificaciones delta se pueden sincronizar durante el archivo o antes
- Los cambios archivados se preservan para la historia
- Usa `/opsx:verify` primero para detectar problemas

---

### `/opsx:bulk-archive`

Archiva múltiples cambios completados a la vez. Maneja los conflictos de especificaciones entre cambios.

**Sintaxis:**
```
/opsx:bulk-archive [change-names...]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-names` | No | Cambios específicos a archivar (solicita selección si no se proporciona) |

**Qué hace:**
- Enumera todos los cambios completados
- Valida cada cambio antes de archivarlo
- Detecta conflictos de especificaciones entre cambios
- Resuelve los conflictos comprobando lo que está realmente implementado
- Archiva en orden cronológico

**Ejemplo:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Consejos:**
- Es bueno para flujos de trabajo paralelos
- La resolución de conflictos es agentica (comprueba la base de código)
- Los cambios se archivan en orden de creación
- Solicita antes de sobrescribir el contenido de las especificaciones

---

### `/opsx:onboard`

Orientación guiada a través del flujo de trabajo completo de OpenSpec. Un tutorial interactivo usando tu base de código real.

**Sintaxis:**
```
/opsx:onboard
```

**Qué hace:**
- Recorre un ciclo de trabajo completo con narración
- Escanea tu base de código en busca oportunidades reales de mejora
- Crea un cambio real con artefactos reales
- Implementa trabajo real (cambios pequeños y seguros)
- Archiva el cambio completado
- Explica cada paso a medida que ocurre

**Fases:**
1. Bienvenida y análisis de la base de código
2. Encontrar una oportunidad de mejora
3. Crear un cambio (`/opsx:new`)
4. Escribir la propuesta
5. Crear especificaciones
6. Escribir el diseño
7. Crear tareas
8. Implementar tareas (`/opsx:apply`)
9. Verificar la implementación
10. Archivar el cambio
11. Resumen y próximos pasos

**Ejemplo:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Consejos:**
- Es mejor para usuarios nuevos que aprenden el flujo de trabajo
- Utiliza código real, no ejemplos de juguete
- Crea un cambio real que puedes conservar o descartar
- Tarda entre 15 y 30 minutos en completarse

## Sintaxis de Comandos por Herramienta IA

Diferentes herramientas de IA utilizan sintaxis de comandos ligeramente distintas. Utiliza el formato que coincida con tu herramienta:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

La intención es la misma en todas las herramientas, pero la forma en que se presentan los comandos puede variar según la integración.

> **Nota:** Los comandos de GitHub Copilot (`.github/prompts/*.prompt.md`) solo están disponibles en extensiones de IDE (VS Code, JetBrains, Visual Studio). El CLI de GitHub Copilot actualmente no admite archivos de prompts personalizados; consulta [Supported Tools](supported-tools.md) para obtener detalles y soluciones alternativas.

---

## Comandos Heredados

Estos comandos utilizan el flujo de trabajo más antiguo de "todo a la vez". Todavía funcionan, pero se recomiendan los comandos OPSX.

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | Crea todos los artefactos a la vez (propuesta, especificaciones, diseño, tareas) |
| `/openspec:apply` | Implementa el cambio |
| `/openspec:archive` | Archiva el cambio |

**Cuándo usar comandos heredados:**
- Proyectos existentes que utilizan el flujo de trabajo antiguo
- Cambios sencillos donde no necesitas la creación incremental de artefactos
- Preferencia por un enfoque de todo o nada

**Migración a OPSX:**
Los cambios heredados se pueden continuar con los comandos OPSX. La estructura de artefactos es compatible.

---

## Solución de Problemas

### "Change not found" (Cambio no encontrado)

El comando no pudo identificar sobre qué cambio trabajar.

**Soluciones:**
- Especifica el nombre del cambio explícitamente: `/opsx:apply add-dark-mode`
- Verifica que la carpeta del cambio existe: `openspec list`
- Asegúrate de estar en el directorio correcto del proyecto

### "No artifacts ready" (Artefactos no listos)

Todos los artefactos están completos o bloqueados por dependencias faltantes.

**Soluciones:**
- Ejecuta `openspec status --change <name>` para ver qué está bloqueando
- Verifica si existen los artefactos requeridos
- Crea primero los artefactos de dependencia que faltan

### "Schema not found" (Esquema no encontrado)

El esquema especificado no existe.

**Soluciones:**
- Lista los esquemas disponibles: `openspec schemas`
- Revisa la ortografía del nombre del esquema
- Crea el esquema si es personalizado: `openspec schema init <name>`

### Commands not recognized (Comandos no reconocidos)

La herramienta de IA no reconoce los comandos OpenSpec.

**Soluciones:**
- Asegúrate de que OpenSpec esté inicializado: `openspec init`
- Regenera las habilidades: `openspec update`
- Verifica que el directorio `.claude/skills/` existe (para Claude Code)
- Reinicia tu herramienta de IA para que reconozca las nuevas habilidades

### Artifacts not generating properly (Artefactos no generándose correctamente)

La IA crea artefactos incompletos o incorrectos.

**Soluciones:**
- Agrega contexto del proyecto en `openspec/config.yaml`
- Añade reglas por artefacto para una guía específica
- Proporciona más detalles en la descripción de tu cambio
- Usa `/opsx:continue` en lugar de `/opsx:ff` para tener más control

---

## Próximos Pasos

- [Workflows](workflows.md) - Patrones comunes y cuándo usar cada comando
- [CLI](cli.md) - Comandos de terminal para gestión y validación
- [Customization](customization.md) - Creación de esquemas y flujos de trabajo personalizados