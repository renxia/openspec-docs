# Comandos

Esta es la referencia para los comandos de barra de OpenSpec. Estos comandos se invocan en la interfaz de chat de tu asistente de codificación con IA (por ejemplo, Claude Code, Cursor, Windsurf).

Para patrones de flujo de trabajo y cuándo usar cada comando, consulta [Flujos de trabajo](workflows.md). Para comandos de CLI, consulta [CLI](cli.md).

## Referencia rápida

### Ruta rápida predeterminada (perfil `core`)

| Comando | Propósito |
|---------|---------|
| `/opsx:propose` | Crear un cambio y generar artefactos de planificación en un solo paso |
| `/opsx:explore` | Analizar ideas antes de comprometerse con un cambio |
| `/opsx:apply` | Implementar tareas del cambio |
| `/opsx:archive` | Archivar un cambio completado |

### Comandos de flujo de trabajo ampliados (selección de flujo de trabajo personalizado)

| Comando | Propósito |
|---------|---------|
| `/opsx:new` | Iniciar un nuevo andamiaje de cambio |
| `/opsx:continue` | Crear el siguiente artefacto basado en dependencias |
| `/opsx:ff` | Avance rápido: crear todos los artefactos de planificación a la vez |
| `/opsx:verify` | Validar que la implementación coincida con los artefactos |
| `/opsx:sync` | Fusionar especificaciones delta en las especificaciones principales |
| `/opsx:bulk-archive` | Archivar múltiples cambios a la vez |
| `/opsx:onboard` | Tutorial guiado a través del flujo de trabajo completo |

El perfil global predeterminado es `core`. Para habilitar los comandos de flujo de trabajo ampliados, ejecuta `openspec config profile`, selecciona flujos de trabajo y luego ejecuta `openspec update` en tu proyecto.

---

## Referencia de Comandos

### `/opsx:propose`

Crea un nuevo cambio y genera artefactos de planificación en un solo paso. Este es el comando de inicio predeterminado en el perfil `core`.

**Sintaxis:**
```text
/opsx:propose [nombre-o-descripción-del-cambio]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre-o-descripción-del-cambio` | No | Nombre en formato kebab-case o descripción del cambio en lenguaje natural |

**Qué hace:**
- Crea `openspec/changes/<nombre-del-cambio>/`
- Genera los artefactos necesarios antes de la implementación (para `spec-driven`: propuesta, especificaciones, diseño, tareas)
- Se detiene cuando el cambio está listo para `/opsx:apply`

**Ejemplo:**
```text
Tú: /opsx:propose add-dark-mode

IA:  Creado openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Listo para la implementación. Ejecuta /opsx:apply.
```

**Consejos:**
- Usa este comando para la ruta más rápida de principio a fin
- Si quieres control paso a paso de los artefactos, habilita los flujos de trabajo expandidos y usa `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Analiza ideas, investiga problemas y aclara requisitos antes de comprometerte con un cambio.

**Sintaxis:**
```
/opsx:explore [tema]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `tema` | No | Lo que quieres explorar o investigar |

**Qué hace:**
- Abre una conversación exploratoria sin estructura requerida
- Investiga el código fuente para responder preguntas
- Compara opciones y enfoques
- Crea diagramas visuales para aclarar el pensamiento
- Puede transicionar a `/opsx:propose` (predeterminado) o `/opsx:new` (flujo de trabajo expandido) cuando las ideas se cristalicen

**Ejemplo:**
```text
Tú: /opsx:explore

IA:  ¿Qué te gustaría explorar?

Tú: ¿Cómo deberíamos manejar la autenticación para la aplicación móvil?

IA:  Déjame investigar tu configuración de autenticación actual...
     [Analiza el código fuente]

     Veo que estás usando autenticación basada en sesiones para la aplicación web.
     Para móvil, tenemos tres opciones principales:

     1. Tokens JWT (sin estado, funciona sin conexión)
     2. OAuth2 (si necesitas inicio de sesión de terceros)
     3. Extender las sesiones actuales (más simple, pero requiere conectividad)

     Tu API ya tiene CORS configurado. ¿Qué dirección te interesa?

Tú: Vamos con JWT. ¿Podemos empezar un cambio para eso?

IA:  Listo cuando quieras. Ejecuta /opsx:propose add-jwt-auth para comenzar.
```

**Consejos:**
- Usa cuando los requisitos no estén claros o necesites investigar
- No se crean artefactos durante la exploración
- Útil para comparar múltiples enfoques antes de decidir
- Puede leer archivos y buscar en el código fuente

---

### `/opsx:new`

Inicia un nuevo andamiaje de cambio. Crea la carpeta del cambio y espera a que generes artefactos con `/opsx:continue` o `/opsx:ff`.

Este comando es parte del conjunto de flujos de trabajo expandidos (no incluido en el perfil `core` predeterminado).

**Sintaxis:**
```
/opsx:new [nombre-del-cambio] [--schema <nombre-del-schema>]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre-del-cambio` | No | Nombre para la carpeta del cambio (se solicita si no se proporciona) |
| `--schema` | No | Schema de flujo de trabajo a usar (predeterminado: de la configuración o `spec-driven`) |

**Qué hace:**
- Crea el directorio `openspec/changes/<nombre-del-cambio>/`
- Crea el archivo de metadatos `.openspec.yaml` en la carpeta del cambio
- Muestra la primera plantilla de artefacto lista para ser creada
- Solicita el nombre del cambio y el schema si no se proporcionan

**Qué crea:**
```
openspec/changes/<nombre-del-cambio>/
└── .openspec.yaml    # Metadatos del cambio (schema, fecha de creación)
```

**Ejemplo:**
```
Tú: /opsx:new add-dark-mode

IA:  Creado openspec/changes/add-dark-mode/
     Schema: spec-driven

     Listo para crear: proposal
     Usa /opsx:continue para crearlo, o /opsx:ff para crear todos los artefactos.
```

**Consejos:**
- Usa nombres descriptivos: `add-feature`, `fix-bug`, `refactor-module`
- Evita nombres genéricos como `update`, `changes`, `wip`
- El schema también se puede establecer en la configuración del proyecto (`openspec/config.yaml`)

---

### `/opsx:continue`

Crea el siguiente artefacto en la cadena de dependencias. Crea un artefacto a la vez para un progreso incremental.

**Sintaxis:**
```
/opsx:continue [nombre-del-cambio]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre-del-cambio` | No | Qué cambio continuar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Consulta el grafo de dependencias de artefactos
- Muestra qué artefactos están listos vs. bloqueados
- Crea el primer artefacto listo
- Lee archivos de dependencias para contexto
- Muestra qué se vuelve disponible después de la creación

**Ejemplo:**
```
Tú: /opsx:continue

IA:  Cambio: add-dark-mode

     Estado de artefactos:
     ✓ proposal    (hecho)
     ◆ specs       (listo)
     ◆ design      (listo)
     ○ tasks       (bloqueado - necesita: specs)

     Creando specs...

     [Lee proposal.md, crea specs basado en requisitos]

     ✓ Creado openspec/changes/add-dark-mode/specs/ui/spec.md

     Ahora disponible: tasks
     Ejecuta /opsx:continue para crear el siguiente artefacto.
```

**Consejos:**
- Usa cuando quieras revisar cada artefacto antes de proceder
- Útil para cambios complejos donde quieres control
- Múltiples artefactos pueden volverse listos simultáneamente
- Puedes editar los artefactos creados antes de continuar

---

### `/opsx:ff`

Avance rápido en la creación de artefactos. Crea todos los artefactos de planificación a la vez.

**Sintaxis:**
```
/opsx:ff [nombre-del-cambio]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre-del-cambio` | No | Qué cambio avanzar rápidamente (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Crea todos los artefactos en orden de dependencia
- Rastrea el progreso a través de la lista de tareas
- Se detiene cuando todos los artefactos requeridos para `apply` están completos
- Lee cada dependencia antes de crear el siguiente artefacto

**Ejemplo:**
```
Tú: /opsx:ff add-dark-mode

IA:  Avanzando rápidamente add-dark-mode...

     ✓ Creando proposal.md
     ✓ Creando specs/ui/spec.md
     ✓ Creando design.md
     ✓ Creando tasks.md

     ¡Todos los artefactos de planificación completos!
     Listo para la implementación. Ejecuta /opsx:apply para comenzar.
```

**Consejos:**
- Usa cuando tengas una imagen clara de lo que estás construyendo
- Más rápido que `/opsx:continue` para cambios directos
- Aún puedes editar los artefactos después
- Útil para características pequeñas a medianas

---

### `/opsx:apply`

Implementa tareas del cambio. Trabaja a través de la lista de tareas, escribiendo código y marcando elementos.

**Sintaxis:**
```
/opsx:apply [nombre-del-cambio]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre-del-cambio` | No | Qué cambio implementar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Lee `tasks.md` e identifica tareas incompletas
- Trabaja en las tareas una por una
- Escribe código, crea archivos, ejecuta pruebas según sea necesario
- Marca las tareas como completas con casillas de verificación `[x]`

**Ejemplo:**
```
Tú: /opsx:apply

IA:  Implementando add-dark-mode...

     Leyendo tasks.md:
     - [ ] 1.1 Crear ThemeContext
     - [ ] 1.2 Agregar propiedades CSS personalizadas
     - [ ] 1.3 Implementar persistencia en localStorage

     Trabajando en 1.1: Crear ThemeContext...
     [Crea src/context/ThemeContext.tsx]

     ✓ 1.1 Completo

     Trabajando en 1.2: Agregar propiedades CSS personalizadas...
     [Actualiza src/styles/globals.css]

     ✓ 1.2 Completo
     ...
```

**Consejos:**
- Puede reanudar donde lo dejaste si se interrumpe
- Usa para cambios paralelos especificando el nombre del cambio
- El estado de finalización se rastrea en las casillas de verificación de `tasks.md`

---

### `/opsx:verify`

Valida que la implementación coincida con los artefactos de tu cambio. Verifica completitud, corrección y coherencia.

**Sintaxis:**
```
/opsx:verify [nombre-del-cambio]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre-del-cambio` | No | Qué cambio verificar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Verifica tres dimensiones de la calidad de implementación
- Busca evidencia de implementación en el código fuente
- Reporta problemas categorizados como CRÍTICO, ADVERTENCIA o SUGERENCIA
- No bloquea el archivo, pero presenta problemas

**Dimensiones de verificación:**

| Dimensión | Qué valida |
|-----------|------------|
| **Completitud** | Todas las tareas hechas, todos los requisitos implementados, escenarios cubiertos |
| **Corrección** | La implementación coincide con la intención de la especificación, casos extremos manejados |
| **Coherencia** | Las decisiones de diseño se reflejan en el código, patrones consistentes |

**Ejemplo:**
```
Tú: /opsx:verify

IA:  Verificando add-dark-mode...

     COMPLETENESS
     ✓ Las 8 tareas en tasks.md están marcadas
     ✓ Todos los requisitos en specs tienen código correspondiente
     ⚠ El escenario "Detección de preferencias del sistema" no tiene cobertura de pruebas

     CORRECCIÓN
     ✓ La implementación coincide con la intención de la especificación
     ✓ Los casos extremos de los escenarios están manejados
     ✓ Los estados de error coinciden con las definiciones de la especificación

     COHERENCIA
     ✓ Las decisiones de diseño se reflejan en la estructura del código
     ✓ Las convenciones de nomenclatura son consistentes con design.md
     ⚠ El diseño menciona "variables CSS" pero la implementación usa clases de Tailwind

     RESUMEN
     ─────────────────────────────
     Problemas críticos: 0
     Advertencias: 2
     Listo para archivar: Sí (con advertencias)

     Recomendaciones:
     1. Agregar prueba para la detección de preferencias del sistema
     2. Actualizar design.md para reflejar el uso de Tailwind, o refactorizar para usar variables CSS
```

**Consejos:**
- Ejecuta antes de archivar para detectar discrepancias temprano
- Las advertencias no bloquean el archivo pero indican problemas potenciales
- Útil para revisar el trabajo de la IA antes de comprometer
- Puede revelar desviaciones entre artefactos e implementación

---

### `/opsx:sync`

**Comando opcional.** Fusiona especificaciones delta de un cambio en las especificaciones principales. El archivo solicitará sincronizar si es necesario, por lo que normalmente no necesitas ejecutar esto manualmente.

**Sintaxis:**
```
/opsx:sync [nombre-del-cambio]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre-del-cambio` | No | Qué cambio sincronizar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Lee las especificaciones delta de la carpeta del cambio
- Analiza las secciones AÑADIDO/MODIFICADO/ELIMINADO/RENOMBRADO
- Fusiona los cambios en el directorio principal `openspec/specs/`
- Preserva el contenido existente no mencionado en el delta
- No archiva el cambio (permanece activo)

**Ejemplo:**
```text
Tú: /opsx:sync

IA:  Sincronizando especificaciones delta de add-dark-mode...

     Leyendo: openspec/changes/add-dark-mode/specs/ui/spec.md
     Objetivo: openspec/specs/ui/spec.md

     Cambios a aplicar:
     ✓ AÑADIDO: Requisito de Selección de Tema (2 escenarios)
     ✓ AÑADIDO: Requisito de Accesibilidad (1 escenario)

     Fusionando...
     ✓ openspec/specs/ui/spec.md actualizado

     El cambio permanece activo. Ejecuta /opsx:archive cuando esté listo para completar.
```

**Cuándo usar manualmente:**

| Escenario | ¿Usar sync? |
|-----------|-------------|
| Cambio de larga duración, quieres las specs en el principal antes de archivar | Sí |
| Múltiples cambios paralelos necesitan las especificaciones base actualizadas | Sí |
| Quieres previsualizar/revisar la fusión por separado | Sí |
| Cambio rápido, yendo directo a archivar | No (el archivo lo maneja) |

**Consejos:**
- La sincronización es inteligente, no es copiar y pegar
- Puede agregar escenarios a requisitos existentes sin duplicar
- El cambio permanece activo después de la sincronización (no se archiva)
- La mayoría de los usuarios nunca necesitarán llamar a esto directamente—el archivo lo solicita si es necesario

---

### `/opsx:archive`

Archiva un cambio completado. Finaliza el cambio y lo mueve a la carpeta de archivo.

**Sintaxis:**
```
/opsx:archive [nombre-del-cambio]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombre-del-cambio` | No | Qué cambio archivar (se infiere del contexto si no se proporciona) |

**Qué hace:**
- Verifica el estado de completitud de los artefactos
- Verifica la completitud de las tareas (advertencia si están incompletas)
- Ofrece sincronizar especificaciones delta si aún no se han sincronizado
- Mueve la carpeta del cambio a `openspec/changes/archive/YYYY-MM-DD-<nombre>/`
- Preserva todos los artefactos para auditoría

**Ejemplo:**
```text
Tú: /opsx:archive

IA:  Archivando add-dark-mode...

     Estado de artefactos:
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (8/8 tareas completas)

     Especificaciones delta: Aún no sincronizadas
     → ¿Sincronizar ahora? (recomendado)

Tú: Sí

IA:  ✓ Especificaciones sincronizadas a openspec/specs/ui/spec.md
     ✓ Movido a openspec/changes/archive/2025-01-24-add-dark-mode/

     Cambio archivado exitosamente.
```

**Consejos:**
- El archivo no bloqueará por tareas incompletas, pero advertirá
- Las especificaciones delta se pueden sincronizar durante el archivo o antes
- Los cambios archivados se preservan para el historial
- Usa `/opsx:verify` primero para detectar problemas

---

### `/opsx:bulk-archive`

Archiva múltiples cambios completados a la vez. Maneja conflictos de especificaciones entre cambios.

**Sintaxis:**
```
/opsx:bulk-archive [nombres-de-cambios...]
```

**Argumentos:**
| Argumento | Requerido | Descripción |
|-----------|-----------|-------------|
| `nombres-de-cambios` | No | Cambios específicos a archivar (solicita seleccionar si no se proporcionan) |

**Qué hace:**
- Lista todos los cambios completados
- Valida cada cambio antes de archivar
- Detecta conflictos de especificaciones entre cambios
- Resuelve conflictos verificando qué está realmente implementado
- Archiva en orden cronológico

**Ejemplo:**
```
Tú: /opsx:bulk-archive

IA:  Encontrados 3 cambios completados:
     - add-dark-mode (8/8 tareas completas)
     - fix-login-bug (3/3 tareas completas)
     - update-footer (2/2 tareas completas)

     Verificando conflictos de especificaciones...
     ⚠ add-dark-mode y update-footer ambos tocan specs/ui/

     Inspeccionando código fuente para resolver...
     Ambos cambios están implementados. Se fusionarán en orden cronológico:
     1. add-dark-mode (creado el 20 de enero)
     2. update-footer (creado el 22 de enero)

     ¿Archivar los 3 cambios?

Tú: Sí

IA:  ✓ Archivado add-dark-mode
     ✓ Archivado fix-login-bug
     ✓ Archivado update-footer
     Especificaciones fusionadas: add-dark-mode → update-footer
```

**Consejos:**
- Útil para flujos de trabajo paralelos
- La resolución de conflictos es agéntica (verifica el código fuente)
- Los cambios se archivan en orden de creación
- Solicita antes de sobrescribir contenido de especificaciones

---

### `/opsx:onboard`

Incorporación guiada a través del flujo de trabajo completo de OpenSpec. Un tutorial interactivo usando tu código fuente real.

**Sintaxis:**
```
/opsx:onboard
```

**Qué hace:**
- Recorre un ciclo de flujo de trabajo completo con narración
- Escanea tu código fuente para oportunidades reales de mejora
- Crea un cambio real con artefactos reales
- Implementa trabajo real (cambios pequeños y seguros)
- Archiva el cambio completado
- Explica cada paso mientras ocurre

**Fases:**
1. Bienvenida y análisis del código fuente
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
Tú: /opsx:onboard

IA:  ¡Bienvenido a OpenSpec!

     Te guiaré a través del flujo de trabajo completo usando tu código fuente real.
     Encontraremos algo pequeño para mejorar, crearemos un cambio adecuado para ello,
     lo implementaremos y lo archivaremos.

     Déjame escanear tu código fuente para oportunidades...

     [Analiza el código fuente]

     Encontré algunas cosas en las que podríamos trabajar:
     1. Agregar validación de entrada al formulario de contacto
     2. Mejorar los mensajes de error en el flujo de autenticación
     3. Agregar estados de carga a botones asíncronos

     ¿Cuál te interesa? (o sugiere algo diferente)
```

**Consejos:**
- Ideal para nuevos usuarios aprendiendo el flujo de trabajo
- Usa código real, no ejemplos de juguete
- Crea un cambio real que puedes conservar o descartar
- Toma 15-30 minutos completar

---

## Sintaxis de Comandos por Herramienta de IA

Las diferentes herramientas de IA utilizan una sintaxis de comandos ligeramente distinta. Utiliza el formato que corresponda a tu herramienta:

| Herramienta | Ejemplo de Sintaxis |
|-------------|---------------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | Invocaciones basadas en habilidades como `/openspec-propose`, `/openspec-apply-change` (sin archivos de comandos generados `opsx-*`) |

La intención es la misma en todas las herramientas, pero la forma en que se presentan los comandos puede variar según la integración.

> **Nota:** Los comandos de GitHub Copilot (`.github/prompts/*.prompt.md`) solo están disponibles en extensiones de IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI actualmente no admite archivos de prompts personalizados — consulta [Herramientas Soportadas](supported-tools.md) para más detalles y soluciones alternativas.

---

## Comandos Heredados

Estos comandos utilizan el flujo de trabajo anterior "todo de una vez". Aún funcionan, pero se recomiendan los comandos OPSX.

| Comando | Qué hace |
|---------|----------|
| `/openspec:proposal` | Crear todos los artefactos a la vez (propuesta, especificaciones, diseño, tareas) |
| `/openspec:apply` | Implementar el cambio |
| `/openspec:archive` | Archivar el cambio |

**Cuándo usar comandos heredados:**
- Proyectos existentes que usan el flujo de trabajo anterior
- Cambios simples donde no necesitas creación incremental de artefactos
- Preferencia por el enfoque de todo o nada

**Migrando a OPSX:**
Los cambios heredados pueden continuarse con los comandos OPSX. La estructura de artefactos es compatible.

---

## Solución de Problemas

### "Cambio no encontrado"

El comando no pudo identificar sobre qué cambio trabajar.

**Soluciones:**
- Especifica el nombre del cambio explícitamente: `/opsx:apply add-dark-mode`
- Verifica que la carpeta del cambio exista: `openspec list`
- Asegúrate de estar en el directorio correcto del proyecto

### "No hay artefactos listos"

Todos los artefactos están completos o bloqueados por dependencias faltantes.

**Soluciones:**
- Ejecuta `openspec status --change <nombre>` para ver qué está bloqueando
- Verifica si existen los artefactos requeridos
- Crea primero los artefactos de dependencia faltantes

### "Esquema no encontrado"

El esquema especificado no existe.

**Soluciones:**
- Lista los esquemas disponibles: `openspec schemas`
- Verifica la ortografía del nombre del esquema
- Crea el esquema si es personalizado: `openspec schema init <nombre>`

### Comandos no reconocidos

La herramienta de IA no reconoce los comandos de OpenSpec.

**Soluciones:**
- Asegúrate de que OpenSpec está inicializado: `openspec init`
- Regenera las habilidades: `openspec update`
- Verifica que el directorio `.claude/skills/` exista (para Claude Code)
- Reinicia tu herramienta de IA para que cargue las nuevas habilidades

### Artefactos no se generan correctamente

La IA crea artefactos incompletos o incorrectos.

**Soluciones:**
- Añade contexto del proyecto en `openspec/config.yaml`
- Añade reglas específicas por artefacto para orientación adicional
- Proporciona más detalle en la descripción de tu cambio
- Usa `/opsx:continue` en lugar de `/opsx:ff` para más control

---

## Próximos Pasos

- [Flujos de Trabajo](workflows.md) - Patrones comunes y cuándo usar cada comando
- [CLI](cli.md) - Comandos de terminal para gestión y validación
- [Personalización](customization.md) - Crear esquemas y flujos de trabajo personalizados