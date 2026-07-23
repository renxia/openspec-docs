# Comandos

Esta es la referencia de los comandos de barra de OpenSpec. Estos comandos se invocan en la interfaz de chat de tu asistente de codificación con IA (por ejemplo, Claude Code, Cursor, Windsurf).

Para ver patrones de flujo de trabajo y cuándo usar cada comando, consulta [Flujos de trabajo](workflows.md). Para comandos de CLI, consulta [CLI](cli.md).

## Referencia rápida

### Ruta rápida predeterminada (perfil `core`)

| Comando | Propósito |
|---------|-----------|
| `/opsx:propose` | Crear un cambio y generar artefactos de planificación en un solo paso |
| `/opsx:explore` | Analizar ideas antes de comprometerse con un cambio |
| `/opsx:apply` | Implementar tareas del cambio |
| `/opsx:update` | Revisar los artefactos de planificación de un cambio y mantener su coherencia |
| `/opsx:sync` | Combinar especificaciones delta en las especificaciones principales |
| `/opsx:archive` | Archivar un cambio completado |

### Comandos de flujo de trabajo ampliado (selección de flujo de trabajo personalizado)

| Comando | Propósito |
|---------|-----------|
| `/opsx:new` | Iniciar una nueva estructura de cambio |
| `/opsx:continue` | Crear el siguiente artefacto en función de las dependencias |
| `/opsx:ff` | Avance rápido: crear todos los artefactos de planificación de una vez |
| `/opsx:verify` | Validar que la implementación coincide con los artefactos |
| `/opsx:bulk-archive` | Archivar múltiples cambios de una sola vez |
| `/opsx:onboard` | Tutorial guiado por el flujo de trabajo completo |

El perfil global predeterminado es `core`. Para habilitar los comandos de flujo de trabajo ampliado, ejecuta `openspec config profile`, selecciona los flujos de trabajo y luego ejecuta `openspec update` en tu proyecto.

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
| `change-name-or-description` | No | Nombre en kebab-case o descripción del cambio en lenguaje natural |

**Qué hace:**
- Crea `openspec/changes/<change-name>/`
- Genera artefactos necesarios antes de la implementación (para `spec-driven`: propuesta, especificaciones, diseño, tareas)
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
- Usa esto para la ruta de extremo a extremo más rápida
- Si deseas control de artefactos paso a paso, habilita los flujos de trabajo expandidos y usa `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Comienza aquí cuando no estés seguro.** Explore es un compañero de reflexión sin riesgos: lee tu base de código, compara opciones y convierte una idea difusa en un plan concreto antes de que exista cualquier cambio. Viene incluido en el perfil predeterminado. Para el caso completo y más ejemplos, consulta la guía [Explore First](explore.md).

Piensa en ideas, investiga problemas y aclara los requisitos antes de comprometerte con un cambio.

**Sintaxis:**
```
/opsx:explore [topic]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `topic` | No | Lo que quieras explorar o investigar |

**Qué hace:**
- Abre una conversación exploratoria sin necesidad de estructura
- Investiga la base de código para responder preguntas
- Compara opciones y enfoques
- Crea diagramas visuales para aclarar el pensamiento
- Puede transicionar a `/opsx:propose` (predeterminado) o `/opsx:new` (flujo de trabajo expandido) cuando los conocimientos se consoliden

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
- Usa cuando los requisitos no estén claros o necesites investigar
- No se crean artefactos durante la exploración
- Útil para comparar múltiples enfoques antes de decidir
- Puede leer archivos y buscar en la base de código

---

### `/opsx:new`

Inicia un andamiaje de cambio nuevo. Crea la carpeta del cambio y espera a que generes artefactos con `/opsx:continue` o `/opsx:ff`.

Este comando es parte del conjunto de flujos de trabajo expandidos (no incluido en el perfil `core` predeterminado).

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
- Solicita el nombre del cambio y el esquema si no se proporcionan

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
- El esquema también se puede configurar en la configuración del proyecto (`openspec/config.yaml`)

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
- Muestra qué artefactos están listos frente a los bloqueados
- Crea el primer artefacto listo
- Lee archivos de dependencia para obtener contexto
- Muestra qué queda disponible después de la creación

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
- Usa cuando quieras revisar cada artefacto antes de continuar
- Útil para cambios complejos donde quieras tener control
- Múltiples artefactos pueden estar listos simultáneamente
- Puedes editar los artefactos creados antes de continuar

---

### `/opsx:ff`

Avanzar rápidamente a través de la creación de artefactos. Crea todos los artefactos de planificación de una vez.

**Sintaxis:**
```
/opsx:ff [change-name]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Qué cambio acelerar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Crea todos los artefactos en orden de dependencia
- Rastrea el progreso mediante una lista de tareas
- Se detiene cuando todos los artefactos que requieren `apply` están completos
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
- Usa cuando tengas una idea clara de lo que estás construyendo
- Más rápido que `/opsx:continue` para cambios sencillos
- Aún puedes editar los artefactos después
- Útil para funcionalidades pequeñas a medianas

---

### `/opsx:apply`

Implementa las tareas del cambio. Trabaja en la lista de tareas, escribiendo código y marcando elementos como completados.

**Sintaxis:**
```
/opsx:apply [change-name]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Qué cambio implementar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Lee `tasks.md` e identifica tareas incompletas
- Trabaja en las tareas una por una
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
- Puede reanudar desde donde lo dejaste si se interrumpe
- Usa para cambios paralelos especificando el nombre del cambio
- El estado de finalización se rastrea en las casillas de verificación de `tasks.md`

---

### `/opsx:update`

Revisa los artefactos de planificación existentes de un cambio y manténlos coherentes entre sí. Solo artefactos de planificación: nunca edita código.

**Sintaxis:**

```text
/opsx:update [change-name]
```

**Argumentos:**

| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Qué cambio actualizar (se infiere del contexto si no se proporciona) |

**Qué hace:**

- Lee los artefactos del cambio mediante `openspec status --change <name> --json`
- Aplica la revisión solicitada, o revisa los artefactos en busca de contradicciones si no especificaste una
- Reconcilia los demás artefactos existentes en cualquier dirección (una edición del diseño puede afectar a la propuesta)
- Confirma cada edición contigo antes de escribir, un artefacto a la vez
- Finaliza recomendando el siguiente paso: `/opsx:continue` (faltan artefactos), `/opsx:apply` (llevar un plan revisado al código), o `/opsx:archive` (todo listo)

**Ejemplo:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Consejos:**

- No creará artefactos faltantes: eso es `/opsx:continue`
- Si el cambio ya fue implementado, sigue con `/opsx:apply` para que el código coincida con el plan revisado
- Si tu revisión cambia la *intención* del cambio, comienza de nuevo con un cambio nuevo (consulta [Cuándo Actualizar vs. Comenzar de Nuevo](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

Valida que la implementación coincida con los artefactos de tu cambio. Verifica la completitud, corrección y coherencia.

**Sintaxis:**
```
/opsx:verify [change-name]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-name` | No | Qué cambio verificar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Verifica tres dimensiones de calidad de implementación
- Busca en la base de código evidencia de implementación
- Informa problemas categorizados como CRÍTICO, ADVERTENCIA o SUGERENCIA
- No bloquea el archivado, pero muestra los problemas

**Dimensiones de verificación:**

| Dimensión | Qué valida |
|-----------|-------------------|
| **Completitud** | Todas las tareas completadas, todos los requisitos implementados, escenarios cubiertos |
| **Corrección** | La implementación coincide con la intención de la especificación, casos límite manejados |
| **Coherencia** | Decisiones de diseño reflejadas en el código, patrones consistentes |

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
- Ejecuta antes de archivar para detectar discrepancias temprano
- Las advertencias no bloquean el archivado pero indican problemas potenciales
- Útil para revisar el trabajo de la IA antes de confirmar
- Puede revelar desviaciones entre los artefactos y la implementación

---

### `/opsx:sync`

**Comando opcional.** Fusiona las especificaciones delta de un cambio en las especificaciones principales. El archivado solicitará sincronizar si es necesario, así que normalmente no necesitas ejecutar esto manualmente.

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
- Analiza las secciones AÑADIDO/MODIFICADO/ELIMINADO/RENOMBRADO
- Fusiona los cambios en el directorio principal `openspec/specs/`
- Preserva el contenido existente no mencionado en el delta
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

**Cuándo usar manualmente:**

| Escenario | ¿Usar sincronización? |
|----------|-------------------|
| Cambio de larga duración, quieres las especificaciones en el principal antes de archivar | Sí |
| Múltiples cambios paralelos necesitan las especificaciones base actualizadas | Sí |
| Quieres previsualizar/revisar la fusión por separado | Sí |
| Cambio rápido, yendo directamente al archivo | No (el archivado lo maneja) |

**Consejos:**
- La sincronización es inteligente, no es copiar y pegar
- Puede añadir escenarios a requisitos existentes sin duplicar
- El cambio permanece activo después de la sincronización (no archivado)
- La mayoría de los usuarios nunca necesitarán llamar a esto directamente: el archivado lo solicita si es necesario

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
- Verifica el estado de finalización de los artefactos
- Verifica la finalización de tareas (advierte si están incompletas)
- Ofrece sincronizar las especificaciones delta si aún no se han sincronizado
- Mueve la carpeta del cambio a `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Preserva todos los artefactos para la pista de auditoría

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
- El archivado no se bloqueará por tareas incompletas, pero advertirá
- Las especificaciones delta se pueden sincronizar durante el archivado o antes
- Los cambios archivados se preservan para el historial
- Usa `/opsx:verify` primero para detectar problemas

---

### `/opsx:bulk-archive`

Archiva múltiples cambios completados a la vez. Maneja conflictos de especificaciones entre cambios.

**Sintaxis:**
```
/opsx:bulk-archive [change-names...]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|----------|----------|-------------|
| `change-names` | No | Cambios específicos a archivar (solicita seleccionar si no se proporcionan) |

**Qué hace:**
- Lista todos los cambios completados
- Valida cada cambio antes de archivar
- Detecta conflictos de especificaciones entre cambios
- Resuelve conflictos verificando lo que realmente está implementado
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
- Útil para flujos de trabajo paralelos
- La resolución de conflictos es autónoma (verifica la base de código)
- Los cambios se archivan en orden de creación
- Solicita confirmación antes de sobrescribir el contenido de las especificaciones

---

### `/opsx:onboard`

Incorporación guiada a través del flujo de trabajo completo de OpenSpec. Un tutorial interactivo que usa tu base de código real.

**Sintaxis:**
```
/opsx:onboard
```

**Qué hace:**
- Recorre un ciclo completo de flujo de trabajo con narración
- Escanea tu base de código para encontrar oportunidades de mejora reales
- Crea un cambio real con artefactos reales
- Implementa trabajo real (cambios pequeños y seguros)
- Archiva el cambio completado
- Explica cada paso a medida que sucede

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
- Ideal para usuarios nuevos que aprenden el flujo de trabajo
- Usa código real, no ejemplos de juguete
- Crea un cambio real que puedes conservar o descartar
- Tarda entre 15 y 30 minutos en completarse

## Sintaxis de comandos por herramienta de IA

Las distintas herramientas de IA utilizan una sintaxis de comandos ligeramente diferente. Utiliza el formato que coincida con tu herramienta:

| Herramienta | Ejemplo de sintaxis |
|----------------|---------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | Invocaciones basadas en habilidades como `/openspec-propose`, `/openspec-apply-change` (no se generan archivos de comando `opsx-*`) |
| Codex | Invocaciones basadas en habilidades desde `.codex/skills/openspec-*` (no se generan archivos de prompt `opsx-*`) |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | Invocaciones basadas en habilidades como `/skill:openspec-propose`, `/skill:openspec-apply-change` (no se generan archivos de comando `opsx-*`) |
| Trae | `/opsx-propose`, `/opsx-apply` |

La intención es la misma en todas las herramientas, pero la forma en que se muestran los comandos puede variar según la integración.

> **Nota:** Los comandos de GitHub Copilot (`.github/prompts/*.prompt.md`) solo están disponibles en las extensiones de IDE (VS Code, JetBrains, Visual Studio). La CLI de GitHub Copilot no admite actualmente archivos de prompt personalizados — consulta [Herramientas compatibles](supported-tools.md) para obtener detalles y soluciones alternativas.

---

## Comandos heredados

Estos comandos utilizan el flujo de trabajo más antiguo de tipo "todo de una vez". Siguen funcionando, pero se recomiendan los comandos OPSX.

| Comando | Función |
|---------|---------|
| `/openspec:proposal` | Crea todos los artefactos de una sola vez (propuesta, especificaciones, diseño, tareas) |
| `/openspec:apply` | Implementa el cambio |
| `/openspec:archive` | Archiva el cambio |

**Cuándo usar los comandos heredados:**
- Proyectos existentes que utilizan el flujo de trabajo anterior
- Cambios sencillos en los que no necesitas la creación incremental de artefactos
- Preferencia por el enfoque de todo o nada

**Migración a OPSX:**
Los cambios heredados se pueden continuar con comandos OPSX. La estructura de los artefactos es compatible.

---

## Solución de problemas

### "Cambio no encontrado"

El comando no pudo identificar qué cambio debía procesar.

**Soluciones:**
- Especifica el nombre del cambio explícitamente: `/opsx:apply add-dark-mode`
- Verifica que la carpeta del cambio exista: `openspec list`
- Confirma que te encuentres en el directorio del proyecto correcto

### "No hay artefactos listos"

Todos los artefactos están completos o bloqueados por dependencias faltantes.

**Soluciones:**
- Ejecuta `openspec status --change <name>` para ver qué está generando el bloqueo
- Verifica si existen los artefactos requeridos
- Crea primero los artefactos de dependencia faltantes

### "Esquema no encontrado"

El esquema especificado no existe.

**Soluciones:**
- Lista los esquemas disponibles: `openspec schemas`
- Verifica la ortografía del nombre del esquema
- Crea el esquema si es personalizado: `openspec schema init <name>`

### Comandos no reconocidos

La herramienta de IA no reconoce los comandos de OpenSpec.

**Soluciones:**
- Asegúrate de que OpenSpec esté inicializado: `openspec init`
- Regenera las habilidades: `openspec update`
- Verifica que exista el directorio `.claude/skills/` (para Claude Code)
- Reinicia tu herramienta de IA para que cargue las nuevas habilidades

### Los artefactos no se generan correctamente

La IA crea artefactos incompletos o incorrectos.

**Soluciones:**
- Agrega contexto del proyecto en `openspec/config.yaml`
- Agrega reglas por artefacto para obtener orientación específica
- Proporciona más detalles en la descripción de tu cambio
- Utiliza `/opsx:continue` en lugar de `/opsx:ff` para tener más control

---

## Próximos pasos

- [Flujos de trabajo](workflows.md) - Patrones comunes y cuándo usar cada comando
- [CLI](cli.md) - Comandos de terminal para gestión y validación
- [Personalización](customization.md) - Crea esquemas y flujos de trabajo personalizados