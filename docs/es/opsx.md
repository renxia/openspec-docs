# Flujo de trabajo OPSX

> Comentarios bienvenidos en [Discord](https://discord.gg/YctCnvvshC).

## ¿Qué es?

OPSX es ahora el flujo de trabajo estándar para OpenSpec.

Es un **flujo de trabajo fluido e iterativo** para cambios en OpenSpec. Se acabaron las fases rígidas — solo acciones que puedes tomar en cualquier momento.

## Por qué existe esto

El flujo de trabajo legacy de OpenSpec funciona, pero está **bloqueado**:

- **Las instrucciones están codificadas de forma rígida** — enterradas en TypeScript, no puedes cambiarlas.
- **Todo o nada** — un solo comando grande crea todo, no se pueden probar piezas individuales.
- **Estructura fija** — el mismo flujo de trabajo para todos, sin personalización.
- **Caja negra** — cuando la salida de la IA es mala, no puedes ajustar los prompts.

**OPSX lo abre.** Ahora cualquiera puede:

1. **Experimentar con instrucciones** — editar una plantilla, ver si la IA lo hace mejor.
2. **Probar de forma granular** — validar las instrucciones de cada artefacto de forma independiente.
3. **Personalizar flujos de trabajo** — definir tus propios artefactos y dependencias.
4. **Iterar rápidamente** — cambiar una plantilla, probar de inmediato, sin reconstruir.

```
Flujo de trabajo legacy:              OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Codificado en el      │           │  schema.yaml           │◄── Tú editas esto
│  paquete (no se puede  │           │  templates/*.md        │◄── O esto
│  cambiar)              │           │        ↓               │
│        ↓               │           │  Efecto instantáneo    │
│  Esperar nueva versión │           │        ↓               │
│        ↓               │           │  Pruébalo tú mismo     │
│  Esperar que sea mejor │           │                        │
└────────────────────────┘           └────────────────────────┘
```

**Esto es para todos:**
- **Equipos** — crear flujos de trabajo que coincidan con cómo realmente trabajan.
- **Usuarios avanzados** — ajustar prompts para obtener mejores salidas de IA para su base de código.
- **Contribuidores de OpenSpec** — experimentar con nuevos enfoque sin lanzamientos.

Todos seguimos aprendiendo qué funciona mejor. OPSX nos permite aprender juntos.

## La experiencia del usuario

**El problema con los flujos de trabajo lineales:**
Estás "en fase de planificación", luego "en fase de implementación", luego "terminado". Pero el trabajo real no funciona así. Implementas algo, te das cuenta de que tu diseño estaba mal, necesitas actualizar las especificaciones, continúas implementando. Las fases lineales luchan contra cómo realmente ocurre el trabajo.

**Enfoque de OPSX:**
- **Acciones, no fases** — crear, implementar, actualizar, archivar — haz cualquiera de ellas en cualquier momento.
- **Las dependencias son habilitadores** — muestran lo que es posible, no lo que se requiere a continuación.

```
  propuesta ──→ specs ──→ diseño ──→ tareas ──→ implementar
```

## Configuración

```bash
# Asegúrate de tener openspec instalado — las habilidades se generan automáticamente
openspec init
```

Esto crea habilidades en `.claude/skills/` (o equivalente) que los asistentes de codificación con IA detectan automáticamente.

Por defecto, OpenSpec usa el perfil de flujo de trabajo `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Si quieres los comandos de flujo de trabajo expandido (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), configúralos con `openspec config profile` y aplícalos con `openspec update`.

Durante la configuración, se te pedirá crear una **configuración del proyecto** (`openspec/config.yaml`). Esto es opcional pero recomendado.

## Configuración del proyecto

La configuración del proyecto te permite establecer valores predeterminados e inyectar contexto específico del proyecto en todos los artefactos.

### Crear configuración

La configuración se crea durante `openspec init`, o manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stack tecnológico: TypeScript, React, Node.js
  Convenciones de API: RESTful, respuestas JSON
  Pruebas: Vitest para pruebas unitarias, Playwright para e2e
  Estilo: ESLint con Prettier, TypeScript estricto

rules:
  proposal:
    - Incluir plan de reversión
    - Identificar equipos afectados
  specs:
    - Usar formato Given/When/Then para escenarios
  design:
    - Incluir diagramas de secuencia para flujos complejos
```

### Campos de configuración

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `schema` | string | Esquema predeterminado para nuevos cambios (ej., `spec-driven`) |
| `context` | string | Contexto del proyecto inyectado en todas las instrucciones de artefactos |
| `rules` | object | Reglas por artefacto, indexadas por ID de artefacto |

### Cómo funciona

**Precedencia del esquema** (de mayor a menor):
1. Flag de CLI (`--schema <nombre>`)
2. Metadatos del cambio (`.openspec.yaml` en el directorio del cambio)
3. Configuración del proyecto (`openspec/config.yaml`)
4. Predeterminado (`spec-driven`)

**Inyección de contexto:**
- El contexto se antepone a las instrucciones de cada artefacto.
- Se envuelve en etiquetas `<context>...</context>`.
- Ayuda a la IA a entender las convenciones de tu proyecto.

**Inyección de reglas:**
- Las reglas solo se inyectan para artefactos coincidentes.
- Se envuelven en etiquetas `<rules>...</rules>`.
- Aparecen después del contexto, antes de la plantilla.

### IDs de artefactos por esquema

**spec-driven** (predeterminado):
- `proposal` — Propuesta de cambio
- `specs` — Especificaciones
- `design` — Diseño técnico
- `tasks` — Tareas de implementación

### Validación de configuración

- IDs de artefacto desconocidos en `rules` generan advertencias.
- Los nombres de esquema se validan contra los esquemas disponibles.
- El contexto tiene un límite de tamaño de 50 KB.
- YAML inválido se reporta con números de línea.

### Solución de problemas

**"ID de artefacto desconocido en reglas: X"**
- Verifica que los IDs de artefacto coincidan con tu esquema (ver lista arriba).
- Ejecuta `openspec schemas --json` para ver los IDs de artefacto para cada esquema.

**La configuración no se aplica:**
- Asegúrate de que el archivo esté en `openspec/config.yaml` (no `.yml`).
- Verifica la sintaxis YAML con un validador.
- Los cambios en la configuración surten efecto inmediatamente (no se necesita reinicio).

**Contexto demasiado grande:**
- El contexto está limitado a 50 KB.
- Resume o enlaza a documentos externos en su lugar.

## Comandos

| Comando | Qué hace |
|---------|----------|
| `/opsx:propose` | Crea un cambio y genera artefactos de planificación en un solo paso (ruta rápida predeterminada) |
| `/opsx:explore` | Piensa ideas, investiga problemas, clarifica requisitos |
| `/opsx:new` | Inicia un nuevo andamiaje de cambio (flujo de trabajo expandido) |
| `/opsx:continue` | Crea el siguiente artefacto (flujo de trabajo expandido) |
| `/opsx:ff` | Avance rápido de artefactos de planificación (flujo de trabajo expandido) |
| `/opsx:apply` | Implementa tareas, actualizando artefactos según sea necesario |
| `/opsx:verify` | Valida la implementación contra los artefactos (flujo de trabajo expandido) |
| `/opsx:sync` | Sincroniza especificaciones delta con la principal (flujo de trabajo predeterminado, opcional) |
| `/opsx:archive` | Archiva cuando hayas terminado |
| `/opsx:bulk-archive` | Archiva múltiples cambios completados (flujo de trabajo expandido) |
| `/opsx:onboard` | Recorrido guiado de un cambio de extremo a extremo (flujo de trabajo expandido) |

## Uso

### Explorar una idea
```
/opsx:explore
```
Piensa ideas, investiga problemas, compara opciones. No se requiere estructura — solo un compañero de pensamiento. Cuando las ideas se cristalicen, transiciona a `/opsx:propose` (predeterminado) o `/opsx:new`/`/opsx:ff` (expandido).

### Iniciar un nuevo cambio
```
/opsx:propose
```
Crea el cambio y genera los artefactos de planificación necesarios antes de la implementación.

Si has habilitado flujos de trabajo expandidos, puedes usar en su lugar:

```text
/opsx:new        # solo andamiaje
/opsx:continue   # crear un artefacto a la vez
/opsx:ff         # crear todos los artefactos de planificación de una vez
```

### Crear artefactos
```
/opsx:continue
```
Muestra qué está listo para crear según las dependencias, luego crea un artefacto. Úsalo repetidamente para construir tu cambio de forma incremental.

```
/opsx:ff add-dark-mode
```
Crea todos los artefactos de planificación de una vez. Úsalo cuando tengas una imagen clara de lo que estás construyendo.

### Implementar (la parte fluida)
```
/opsx:apply
```
Trabaja en las tareas, marcándolas a medida que avanzas. Si estás manejando múltiples cambios, puedes ejecutar `/opsx:apply <nombre>`; de lo contrario, debería inferir de la conversación y pedirte que elijas si no puede determinarlo.

### Finalizar
```
/opsx:archive   # Mover al archivo cuando hayas terminado (pide sincronizar especificaciones si es necesario)
```

## Cuándo actualizar vs. empezar de nuevo

Siempre puedes editar tu propuesta o especificaciones antes de la implementación. Pero, ¿cuándo se convierte el refinamiento en "esto es un trabajo diferente"?

### Lo que captura una propuesta

Una propuesta define tres cosas:
1. **Intención** — ¿Qué problema estás resolviendo?
2. **Alcance** — ¿Qué está dentro/fuera de los límites?
3. **Enfoque** — ¿Cómo lo resolverás?

La pregunta es: ¿qué cambió, y en qué medida?

### Actualizar el cambio existente cuando:

**Misma intención, ejecución refinada**
- Descubres casos límite que no consideraste.
- El enfoque necesita ajustes pero el objetivo no ha cambiado.
- La implementación revela que el diseño estaba ligeramente desviado.

**El alcance se reduce**
- Te das cuenta de que el alcance completo es demasiado grande, quieres enviar un MVP primero.
- "Agregar modo oscuro" → "Agregar interruptor de modo oscuro (preferencia del sistema en v2)"

**Correcciones basadas en aprendizaje**
- La base de código no está estructurada como pensabas.
- Una dependencia no funciona como se esperaba.
- "Usar variables CSS" → "Usar el prefijo dark: de Tailwind en su lugar"

### Iniciar un nuevo cambio cuando:

**La intención cambió fundamentalmente**
- El problema en sí es diferente ahora.
- "Agregar modo oscuro" → "Agregar sistema de temas completo con colores, fuentes y espaciado personalizados."

**El alcance explotó**
- El cambio creció tanto que es esencialmente un trabajo diferente.
- La propuesta original sería irreconocible después de las actualizaciones.
- "Corregir error de inicio de sesión" → "Reescribir sistema de autenticación"

**El original es completable**
- El cambio original puede marcarse como "terminado".
- El nuevo trabajo es independiente, no un refinamiento.
- Completar "Agregar modo oscuro MVP" → Archivar → Nuevo cambio "Mejorar modo oscuro"

### Las heurísticas

```
                        ┌─────────────────────────────────────┐
                        │     ¿Es este el mismo trabajo?      │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             ¿Misma intención?  >50% de superposición?  ¿Se puede "terminar"
             ¿Mismo problema?   ¿Mismo alcance?         el original sin
                    │                  │                 estos cambios?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         SÍ                NO SÍ            NO  NO              SÍ
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       ACTUALIZAR        NUEVO ACTUALIZAR  NUEVO ACTUALIZAR    NUEVO
```

| Prueba | Actualizar | Nuevo cambio |
|--------|------------|--------------|
| **Identidad** | "Lo mismo, refinado" | "Trabajo diferente" |
| **Superposición de alcance** | >50% se superpone | <50% se superpone |
| **Completitud** | No se puede "terminar" sin cambios | Se puede terminar el original, el nuevo trabajo es independiente |
| **Historia** | La cadena de actualizaciones cuenta una historia coherente | Los parches confundirían más que aclarar |

### El principio

> **La actualización preserva el contexto. El nuevo cambio proporciona claridad.**
>
> Elige actualizar cuando la historia de tu pensamiento sea valiosa.
>
> Elige nuevo cuando empezar de nuevo sería más claro que parchear.

Piénsalo como ramas de git:
- Sigue haciendo commits mientras trabajas en la misma funcionalidad.
- Inicia una nueva rama cuando sea genuinamente un trabajo nuevo.
- A veces fusiona una funcionalidad parcial y empieza de nuevo para la fase 2.

## ¿Qué es diferente?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Estructura** | Un único documento de propuesta grande | Artefactos discretos con dependencias |
| **Flujo de trabajo** | Fases lineales: plan → implementar → archivar | Acciones fluidas — haz cualquier cosa en cualquier momento |
| **Iteración** | Difícil volver atrás | Actualiza los artefactos a medida que aprendes |
| **Personalización** | Estructura fija | Impulsado por esquemas (define tus propios artefactos) |

**La idea clave:** el trabajo no es lineal. OPSX deja de pretender que lo es.

## Análisis profundo de la arquitectura

Esta sección explica cómo funciona OPSX internamente y cómo se compara con el flujo de trabajo heredado.
Los ejemplos en esta sección utilizan el conjunto de comandos expandido (`new`, `continue`, etc.); los usuarios predeterminados de `core` pueden mapear el mismo flujo a `propose → apply → sync → archive`.

### Filosofía: Fases vs. Acciones

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE TRABAJO HEREDADO                           │
│                    (Bloqueado por fases, todo o nada)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │    FASE DE   │ ───► │    FASE DE   │ ───► │    FASE DE   │             │
│   │   PLANIFICACIÓN│      │ IMPLEMENTACIÓN│      │  ARCHIVADO   │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Crea TODOS los artefactos de una vez                                   │
│   • No se puede volver para actualizar las especificaciones durante la implementación │
│   • Las puertas de fase imponen una progresión lineal                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            FLUJO DE TRABAJO OPSX                            │
│                      (Acciones fluidas, iterativo)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACCIONES (no fases)              │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              en cualquier orden            │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Crea artefactos uno a la vez O avanza rápidamente                      │
│   • Actualiza especificaciones/diseño/tareas durante la implementación      │
│   • Las dependencias habilitan el progreso, las fases no existen            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arquitectura de componentes

El **flujo de trabajo heredado** utiliza plantillas codificadas en TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPONENTES DEL FLUJO HEREDADO                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Plantillas codificadas (cadenas de TypeScript)                            │
│                    │                                                        │
│                    ▼                                                        │
│   Configuradores/adaptadores específicos de herramientas                    │
│                    │                                                        │
│                    ▼                                                        │
│   Archivos de comandos generados (.claude/commands/openspec/*.md)           │
│                                                                             │
│   • Estructura fija, sin conciencia de artefactos                           │
│   • El cambio requiere modificación de código + reconstrucción              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** utiliza esquemas externos y un motor de grafos de dependencias:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENTES DE OPSX                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Definiciones de esquema (YAML)                                            │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependencias                     │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Patrones glob                    │   │
│   │      requires: [proposal]      ◄── Se habilita después de proposal  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Motor de grafos de artefactos                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Ordenación topológica (orden por dependencias)                   │   │
│   │  • Detección de estado (existencia en el sistema de archivos)       │   │
│   │  • Generación de instrucciones ricas (plantillas + contexto)        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Archivos de habilidades (.claude/skills/openspec-*/SKILL.md)              │
│                                                                             │
│   • Compatible entre editores (Claude Code, Cursor, Windsurf)               │
│   • Las habilidades consultan la CLI para datos estructurados               │
│   • Totalmente personalizable mediante archivos de esquema                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modelo de grafo de dependencias

Los artefactos forman un grafo acíclico dirigido (DAG). Las dependencias son **habilitadores**, no puertas:

```
                              proposal
                             (nodo raíz)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (requires:                  (requires:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requires:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ FASE APPLY   │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transiciones de estado:**

```
   BLOQUEADO ────────────────► LISTO ────────────────► HECHO
      │                        │                       │
   Faltan                   Todas las              El archivo
   dependencias             dependencias           existe en el
                            están HECHAS           sistema de archivos
```

### Flujo de información

**Flujo de trabajo heredado** — el agente recibe instrucciones estáticas:

```
  Usuario: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Instrucciones estáticas:               │
  │  • Crear proposal.md                    │
  │  • Crear tasks.md                       │
  │  • Crear design.md                      │
  │  • Crear specs/<capability>/spec.md     │
  │                                         │
  │  Sin conciencia de lo que existe o      │
  │  de las dependencias entre artefactos   │
  └─────────────────────────────────────────┘
           │
           ▼
  El agente crea TODOS los artefactos de una vez
```

**OPSX** — el agente consulta para obtener contexto rico:

```
  Usuario: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Paso 1: Consultar estado actual                                         │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── Primero listo    │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Paso 2: Obtener instrucciones ricas para el artefacto listo             │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Paso 3: Leer dependencias → Crear UN artefacto → Mostrar qué se desbloquea │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modelo de iteración

**Flujo de trabajo heredado** — difícil de iterar:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Espera, el diseño está mal"
       │               │
       │               ├── Opciones:
       │               │   • Editar archivos manualmente (rompe el contexto)
       │               │   • Abandonar y empezar de nuevo
       │               │   • Seguir adelante y arreglar después
       │               │
       │               └── No hay un mecanismo oficial para "volver atrás"
       │
       └── Crea TODOS los artefactos de una vez
```

**OPSX** — iteración natural:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "El diseño está mal"
      │                │                  │
      │                │                  ▼
      │                │            Solo edita design.md
      │                │            ¡y continúa!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply retoma
      │                │         donde lo dejaste
      │                │
      │                └── Crea UN artefacto, muestra qué se desbloquea
      │
      └── Genera la estructura del cambio, espera la dirección
```

### Esquemas personalizados

Crea flujos de trabajo personalizados usando los comandos de gestión de esquemas:

```bash
# Crear un nuevo esquema desde cero (interactivo)
openspec schema init my-workflow

# O bifurcar un esquema existente como punto de partida
openspec schema fork spec-driven my-workflow

# Validar la estructura de tu esquema
openspec schema validate my-workflow

# Ver de dónde se resuelve un esquema (útil para depuración)
openspec schema which my-workflow
```

Los esquemas se almacenan en `openspec/schemas/` (local del proyecto, controlado por versión) o `~/.local/share/openspec/schemas/` (global del usuario).

**Estructura del esquema:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Ejemplo de schema.yaml:**
```yaml
name: research-first
artifacts:
  - id: research        # Añadido antes de proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Ahora depende de research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Grafo de dependencias:**
```
   research ──► proposal ──► tasks
```

### Resumen

| Aspecto | Heredado | OPSX |
|---------|----------|------|
| **Plantillas** | TypeScript codificado | YAML + Markdown externos |
| **Dependencias** | Ninguna (todo de una vez) | DAG con ordenación topológica |
| **Estado** | Modelo mental basado en fases | Existencia en el sistema de archivos |
| **Personalización** | Editar código fuente, reconstruir | Crear schema.yaml |
| **Iteración** | Bloqueado por fases | Fluido, editar cualquier cosa |
| **Soporte de editores** | Configurador/adaptadores específicos de herramientas | Directorio único de habilidades |

## Esquemas

Los esquemas definen qué artefactos existen y sus dependencias. Actualmente disponibles:

- **spec-driven** (predeterminado): proposal → specs → design → tasks

```bash
# List available schemas
openspec schemas

# See all schemas with their resolution sources
openspec schema which --all

# Create a new schema interactively
openspec schema init my-workflow

# Fork an existing schema for customization
openspec schema fork spec-driven my-workflow

# Validate schema structure before use
openspec schema validate my-workflow
```

## Consejos

- Usa `/opsx:explore` para analizar una idea antes de comprometerte con un cambio.
- `/opsx:ff` cuando sabes lo que quieres, `/opsx:continue` cuando estás explorando.
- Durante `/opsx:apply`, si algo está mal — corrige el artefacto y luego continúa.
- Las tareas rastrean el progreso mediante casillas de verificación en `tasks.md`.
- Consulta el estado en cualquier momento: `openspec status --change "nombre"`

## Comentarios

Esto es un borrador. Es intencional — estamos aprendiendo qué funciona.

¿Encontraste un error? ¿Tienes ideas? Únete a nosotros en [Discord](https://discord.gg/YctCnvvshC) o abre un issue en [GitHub](https://github.com/Fission-AI/openspec/issues).