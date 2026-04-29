# Flujo de trabajo OPSX

> Agradecemos sus comentarios en [Discord](https://discord.gg/YctCnvvshC).

## ¿Qué es?

OPSX es ahora el flujo de trabajo estándar para OpenSpec.

Es un **flujo de trabajo fluido e iterativo** para los cambios en OpenSpec. No más fases rígidas — solo acciones que puedes realizar en cualquier momento.

## Por qué existe esto

El flujo de trabajo heredado de OpenSpec funciona, pero está **totalmente restringido**:

- **Las instrucciones están codificadas** — enterradas en TypeScript, no puedes cambiarlas.
- **Todo o nada** — un solo comando grande crea todo, no se pueden probar partes individuales.
- **Estructura fija** — el mismo flujo para todos, sin personalización.
- **Caja negra** — cuando la salida de la IA es mala, no puedes ajustar los prompts.

**OPSX lo abre.** Ahora cualquiera puede:

1. **Experimentar con las instrucciones** — editar una plantilla, ver si la IA lo hace mejor.
2. **Probar de forma granular** — validar las instrucciones de cada artefacto de forma independiente.
3. **Personalizar flujos de trabajo** — definir tus propios artefactos y dependencias.
4. **Iterar rápidamente** — cambiar una plantilla, probar inmediatamente, sin reconstruir.

```
Flujo de trabajo heredado:              OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Codificado en el      │           │  schema.yaml           │◄── Tú editas esto
│  paquete (no se puede  │           │  templates/*.md        │◄── O esto
│  cambiar)              │           │        ↓               │
│        ↓               │           │  Efecto inmediato      │
│  Esperar nueva versión │           │        ↓               │
│        ↓               │           │  Pruébalo tú mismo     │
│  Esperar que mejore    │           └────────────────────────┘
└────────────────────────┘
```

**Esto es para todos:**
- **Equipos** — crear flujos de trabajo que se ajusten a cómo realmente trabajan.
- **Usuarios avanzados** — ajustar prompts para obtener mejores salidas de IA para su base de código.
- **Contribuidores de OpenSpec** — experimentar con nuevos enfoques sin necesidad de versiones.

Todos seguimos aprendiendo qué funciona mejor. OPSX nos permite aprender juntos.

## La Experiencia de Usuario

**El problema con los flujos de trabajo lineales:**
Estás "en la fase de planificación", luego "en la fase de implementación", luego "terminado". Pero el trabajo real no funciona así. Implementas algo, te das cuenta de que tu diseño estaba mal, necesitas actualizar las especificaciones, continuar implementando. Las fases lineales luchan contra cómo el trabajo realmente sucede.

**Enfoque de OPSX:**
- **Acciones, no fases** — crear, implementar, actualizar, archivar — haz cualquiera de ellas en cualquier momento.
- **Las dependencias son facilitadoras** — muestran lo que es posible, no lo que es obligatorio a continuación.

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Configuración

```bash
# Asegúrate de tener openspec instalado — las habilidades se generan automáticamente
openspec init
```

Esto crea habilidades en `.claude/skills/` (o su equivalente) que los asistentes de codificación de IA detectan automáticamente.

Por defecto, OpenSpec usa el perfil de flujo de trabajo `core` (`propose`, `explore`, `apply`, `archive`). Si quieres los comandos de flujo de trabajo extendido (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`), configúralos con `openspec config profile` y aplica con `openspec update`.

Durante la configuración, se te pedirá crear una **configuración del proyecto** (`openspec/config.yaml`). Esto es opcional pero recomendado.

## Configuración del Proyecto

La configuración del proyecto te permite establecer valores predeterminados e inyectar contexto específico del proyecto en todos los artefactos.

### Crear Configuración

La configuración se crea durante `openspec init`, o manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### Campos de Configuración

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `schema` | string | Esquema predeterminado para nuevos cambios (ej., `spec-driven`) |
| `context` | string | Contexto del proyecto inyectado en las instrucciones de todos los artefactos |
| `rules` | object | Reglas por artefacto, identificadas por el ID del artefacto |

### Cómo Funciona

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
- Las reglas solo se inyectan para los artefactos que coinciden.
- Se envuelven en etiquetas `<rules>...</rules>`.
- Aparecen después del contexto, antes de la plantilla.

### IDs de Artefactos por Esquema

**spec-driven** (predeterminado):
- `proposal` — Propuesta de cambio
- `specs` — Especificaciones
- `design` — Diseño técnico
- `tasks` — Tareas de implementación

### Validación de Configuración

- Los IDs de artefactos desconocidos en `rules` generan advertencias.
- Los nombres de esquema se validan contra los esquemas disponibles.
- El contexto tiene un límite de tamaño de 50KB.
- El YAML no válido se reporta con números de línea.

### Solución de Problemas

**"ID de artefacto desconocido en rules: X"**
- Verifica que los IDs de artefacto coincidan con tu esquema (ver lista arriba).
- Ejecuta `openspec schemas --json` para ver los IDs de artefacto para cada esquema.

**La configuración no se aplica:**
- Asegúrate de que el archivo esté en `openspec/config.yaml` (no `.yml`).
- Verifica la sintaxis YAML con un validador.
- Los cambios de configuración surten efecto inmediatamente (no se necesita reiniciar).

**Contexto demasiado grande:**
- El contexto está limitado a 50KB.
- Resume o enlaza a documentación externa en su lugar.

## Comandos

| Comando | Qué hace |
|---------|----------|
| `/opsx:propose` | Crea un cambio y genera artefactos de planificación en un solo paso (ruta rápida predeterminada) |
| `/opsx:explore` | Piensa en ideas, investiga problemas, aclara requisitos |
| `/opsx:new` | Inicia un nuevo andamiaje de cambio (flujo de trabajo extendido) |
| `/opsx:continue` | Crea el siguiente artefacto (flujo de trabajo extendido) |
| `/opsx:ff` | Avanza rápidamente los artefactos de planificación (flujo de trabajo extendido) |
| `/opsx:apply` | Implementa tareas, actualizando artefactos según sea necesario |
| `/opsx:verify` | Valida la implementación contra los artefactos (flujo de trabajo extendido) |
| `/opsx:sync` | Sincroniza especificaciones delta con la rama principal (flujo de trabajo extendido, opcional) |
| `/opsx:archive` | Archiva cuando terminas |
| `/opsx:bulk-archive` | Archiva múltiples cambios completados (flujo de trabajo extendido) |
| `/opsx:onboard` | Paseo guiado de un cambio de principio a fin (flujo de trabajo extendido) |

## Uso

### Explorar una idea
```
/opsx:explore
```
Piensa en ideas, investiga problemas, compara opciones. No se requiere estructura — solo un compañero de pensamiento. Cuando las ideas se cristalicen, transiciona a `/opsx:propose` (predeterminado) o `/opsx:new`/`/opsx:ff` (extendido).

### Iniciar un nuevo cambio
```
/opsx:propose
```
Crea el cambio y genera los artefactos de planificación necesarios antes de la implementación.

Si has habilitado flujos de trabajo extendidos, puedes usar en su lugar:

```text
/opsx:new        # solo andamiaje
/opsx:continue   # crear un artefacto a la vez
/opsx:ff         # crear todos los artefactos de planificación a la vez
```

### Crear artefactos
```
/opsx:continue
```
Muestra lo que está listo para crear basándose en las dependencias, luego crea un artefacto. Usa repetidamente para construir tu cambio incrementalmente.

```
/opsx:ff add-dark-mode
```
Crea todos los artefactos de planificación a la vez. Úsalo cuando tengas una imagen clara de lo que estás construyendo.

### Implementar (la parte fluida)
```
/opsx:apply
```
Trabaja a través de las tareas, marcándolas a medida que avanzas. Si estás manejando múltiples cambios, puedes ejecutar `/opsx:apply <nombre>`; de lo contrario, debería inferir de la conversación y preguntarte para elegir si no puede determinarlo.

### Terminar
```
/opsx:archive   # Mover al archivo cuando termines (pregunta si sincronizar especificaciones si es necesario)
```

## Cuándo Actualizar vs. Empezar de Nuevo

Siempre puedes editar tu propuesta o especificaciones antes de la implementación. Pero, ¿cuándo la refinación se convierte en "esto es un trabajo diferente"?

### Qué Captura una Propuesta

Una propuesta define tres cosas:
1. **Intención** — ¿Qué problema estás resolviendo?
2. **Alcance** — ¿Qué está dentro/fuera de los límites?
3. **Enfoque** — ¿Cómo lo resolverás?

La pregunta es: ¿qué cambió, y en qué medida?

### Actualizar el Cambio Existente Cuando:

**Misma intención, ejecución refinada**
- Descubres casos límite que no consideraste.
- El enfoque necesita ajustes pero el objetivo no ha cambiado.
- La implementación revela que el diseño estaba ligeramente mal.

**El alcance se reduce**
- Te das cuenta de que el alcance completo es demasiado grande, quieres lanzar el MVP primero.
- "Agregar modo oscuro" → "Agregar interruptor de modo oscuro (preferencia del sistema en v2)"

**Correcciones impulsadas por aprendizaje**
- La base de código no está estructurada como pensabas.
- Una dependencia no funciona como se esperaba.
- "Usar variables CSS" → "Usar el prefijo dark: de Tailwind en su lugar"

### Empezar un Nuevo Cambio Cuando:

**La intención cambió fundamentalmente**
- El problema en sí es diferente ahora.
- "Agregar modo oscuro" → "Agregar un sistema de temas completo con colores, fuentes y espaciado personalizados"

**El alcance explotó**
- El cambio creció tanto que es esencialmente un trabajo diferente.
- La propuesta original sería irreconocible después de las actualizaciones.
- "Corregir error de inicio de sesión" → "Reescribir sistema de autenticación"

**El original es completable**
- El cambio original puede marcarse como "hecho".
- El nuevo trabajo es independiente, no es un refinamiento.
- Completar "Agregar modo oscuro MVP" → Archivar → Nuevo cambio "Mejorar modo oscuro"

### Las Heurísticas

```
                        ┌─────────────────────────────────────┐
                        │     ¿Es este el mismo trabajo?      │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             ¿Misma intención?  >50% de superposición?  ¿Puede el original
             ¿Mismo problema?   ¿Mismo alcance?         quedar "hecho" sin
                    │                  │                 estos cambios?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         SÍ                NO SÍ            NO  NO              SÍ
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       ACTUALIZAR       NUEVO ACTUALIZAR   NUEVO ACTUALIZAR    NUEVO
```

| Prueba | Actualizar | Nuevo Cambio |
|--------|------------|--------------|
| **Identidad** | "Lo mismo, refinado" | "Trabajo diferente" |
| **Superposición de alcance** | >50% se superpone | <50% se superpone |
| **Finalización** | No puede quedar "hecho" sin cambios | Puede terminar el original, el nuevo trabajo es independiente |
| **Historia** | La cadena de actualizaciones cuenta una historia coherente | Los parches confundirían más de lo que aclararían |

### El Principio

> **Actualizar preserva el contexto. Un nuevo cambio proporciona claridad.**
>
> Elige actualizar cuando la historia de tu pensamiento es valiosa.
> Elige empezar de nuevo cuando comenzar desde cero sería más claro que parchear.

Piensa en ello como ramas de git:
- Sigue comprometiendo mientras trabajas en la misma funcionalidad.
- Inicia una nueva rama cuando es genuinamente un trabajo nuevo.
- A veces fusiona una funcionalidad parcial y empieza de nuevo para la fase 2.

## ¿Qué es diferente?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Estructura** | Un gran documento de propuesta | Artefactos discretos con dependencias |
| **Flujo de trabajo** | Fases lineales: planificar → implementar → archivar | Acciones fluidas — hacer cualquier cosa en cualquier momento |
| **Iteración** | Difícil para retroceder | Actualizar artefactos a medida que aprendes |
| **Personalización** | Estructura fija | Impulsado por esquema (define tus propios artefactos) |

**La idea clave:** el trabajo no es lineal. OPSX deja de pretender que lo es.

## Inmersión en la Arquitectura

Esta sección explica cómo funciona OPSX internamente y cómo se compara con el flujo de trabajo heredado.
Los ejemplos en esta sección utilizan el conjunto de comandos ampliado (`new`, `continue`, etc.); los usuarios predeterminados de `core` pueden mapear el mismo flujo a `propose → apply → archive`.

### Filosofía: Fases vs Acciones

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE TRABAJO HEREDADO                           │
│                    (Fase Bloqueada, Todo o Nada)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │    FASE DE   │ ───► │    FASE DE   │ ───► │    FASE DE   │             │
│   │  PLANIFICACIÓN│      │  IMPLEMENTACIÓN│      │  ARCHIVADO   │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Crea TODOS los artefactos a la vez                                     │
│   • No se puede volver a actualizar las especificaciones durante la        │
│     implementación                                                         │
│   • Las compuertas de fase imponen una progresión lineal                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE TRABAJO OPSX                               │
│                      (Acciones Fluidas, Iterativo)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │         ACCIONES (no fases)                │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              en cualquier orden            │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Crea artefactos uno a la vez O avanza rápidamente                      │
│   • Actualiza especificaciones/diseño/tareas durante la implementación     │
│   • Las dependencias permiten el progreso, las fases no existen            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arquitectura de Componentes

**El flujo de trabajo heredado** utiliza plantillas codificadas en TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   COMPONENTES DEL FLUJO DE TRABAJO HEREDADO                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Plantillas Codificadas (cadenas TypeScript)                               │
│                    │                                                        │
│                    ▼                                                        │
│   Configuradores/adaptadores específicos de la herramienta                  │
│                    │                                                        │
│                    ▼                                                        │
│   Archivos de Comandos Generados (.claude/commands/openspec/*.md)           │
│                                                                             │
│   • Estructura fija, sin conocimiento de artefactos                         │
│   • Los cambios requieren modificación del código + reconstrucción          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** utiliza esquemas externos y un motor de grafo de dependencias:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENTES DE OPSX                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Definiciones de Esquema (YAML)                                            │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependencias                     │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Patrones glob                    │   │
│   │      requires: [proposal]      ◄── Habilita después de proposal    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Motor de Grafo de Artefactos                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Ordenamiento topológico (orden de dependencias)                  │   │
│   │  • Detección de estado (existencia en el sistema de archivos)       │   │
│   │  • Generación de instrucciones enriquecidas (plantillas + contexto) │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Archivos de Habilidad (.claude/skills/openspec-*/SKILL.md)                │
│                                                                             │
│   • Compatible con múltiples editores (Claude Code, Cursor, Windsurf)      │
│   • Las habilidades consultan la CLI para datos estructurados              │
│   • Totalmente personalizable a través de archivos de esquema              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Grafo de Dependencias

Los artefactos forman un grafo acíclico dirigido (DAG). Las dependencias son **habilitadores**, no compuertas:

```
                              proposal
                             (nodo raíz)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (requiere:                  (requiere:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requiere:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ FASE APPLY   │
                          │ (requiere:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transiciones de estado:**

```
   BLOQUEADO ────────────────► LISTO ────────────────► HECHO
      │                        │                       │
   Faltan                   Todas las deps          El archivo existe
   dependencias             están en estado         en el sistema
                            HECHO                   de archivos
```

### Flujo de Información

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
  │  Sin conocimiento de lo que existe o    │
  │  las dependencias entre artefactos      │
  └─────────────────────────────────────────┘
           │
           ▼
  El agente crea TODOS los artefactos de una vez
```

**OPSX** — el agente consulta para obtener contexto enriquecido:

```
  Usuario: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Paso 1: Consultar el estado actual                                     │
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
  │  Paso 2: Obtener instrucciones enriquecidas para el artefacto listo      │
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
  │  Paso 3: Leer dependencias → Crear UN artefacto → Mostrar lo que se      │
  │          desbloquea                                                      │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Iteración

**Flujo de trabajo heredado** — incómodo para iterar:

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
       │               │   • Seguir adelante y corregir después
       │               │
       │               └── No hay mecanismo oficial para "retroceder"
       │
       └── Crea TODOS los artefactos a la vez
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
      │                └── Crea UN artefacto, muestra lo que se desbloquea
      │
      └── Prepara el cambio, espera instrucciones
```

### Esquemas Personalizados

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

Los esquemas se almacenan en `openspec/schemas/` (local al proyecto, controlado por versiones) o `~/.local/share/openspec/schemas/` (global para el usuario).

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

**Grafo de Dependencias:**
```
   research ──► proposal ──► tasks
```

### Resumen

| Aspecto | Heredado | OPSX |
|--------|----------|------|
| **Plantillas** | TypeScript codificada | YAML + Markdown externos |
| **Dependencias** | Ninguna (todo a la vez) | DAG con ordenamiento topológico |
| **Estado** | Modelo mental basado en fases | Existencia en el sistema de archivos |
| **Personalización** | Editar fuente, reconstruir | Crear schema.yaml |
| **Iteración** | Fase bloqueada | Fluida, editar cualquier cosa |
| **Soporte de Editor** | Configurador/adaptador específico de herramienta | Directorio único de habilidades |

## Esquemas

Los esquemas definen qué artefactos existen y sus dependencias. Actualmente disponibles:

- **spec-driven** (predeterminado): propuesta → especificaciones → diseño → tareas

```bash
# Listar esquemas disponibles
openspec schemas

# Ver todos los esquemas con sus fuentes de resolución
openspec schema which --all

# Crear un nuevo esquema de forma interactiva
openspec schema init my-workflow

# Bifurcar un esquema existente para personalización
openspec schema fork spec-driven my-workflow

# Validar la estructura del esquema antes de usarlo
openspec schema validate my-workflow
```

## Consejos

- Usa `/opsx:explore` para reflexionar sobre una idea antes de comprometerte con un cambio
- `/opsx:ff` cuando sabes lo que quieres, `/opsx:continue` cuando estás explorando
- Durante `/opsx:apply`, si algo está mal — corrige el artefacto, luego continúa
- Las tareas rastrean el progreso mediante casillas de verificación en `tasks.md`
- Consulta el estado en cualquier momento: `openspec status --change "nombre"`

## Comentarios

Esto es rudimentario. Es intencional — estamos aprendiendo qué funciona.

¿Encontraste un error? ¿Tienes ideas? Únete a nosotros en [Discord](https://discord.gg/YctCnvvshC) o abre un issue en [GitHub](https://github.com/Fission-AI/openspec/issues).