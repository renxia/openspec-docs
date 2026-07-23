# Flujo de trabajo OPSX

> Los comentarios son bienvenidos en [Discord](https://discord.gg/YctCnvvshC).

## ¿Qué es?

OPSX es ahora el flujo de trabajo estándar para OpenSpec.

Es un **flujo de trabajo fluido e iterativo** para los cambios de OpenSpec. No hay más fases rígidas — solo acciones que puedes realizar en cualquier momento.

## Por qué existe esto

El flujo de trabajo heredado de OpenSpec funciona, pero está **bloqueado**:

- **Las instrucciones están codificadas de forma fija** — ocultas en TypeScript, no puedes modificarlas
- **Todo o nada** — un solo comando grande crea todo, no puedes probar piezas individuales
- **Estructura fija** — mismo flujo de trabajo para todos, sin personalización
- **Caja negra** — cuando la salida de la IA es mala, no puedes ajustar los prompts

**OPSX lo abre.** Ahora cualquiera puede:

1. **Experimentar con las instrucciones** — edita una plantilla, comprueba si la IA funciona mejor
2. **Probar de forma granular** — valida las instrucciones de cada artefacto de forma independiente
3. **Personalizar flujos de trabajo** — define tus propios artefactos y dependencias
4. **Iterar rápidamente** — cambia una plantilla, pruébala inmediatamente, sin reconstrucciones

```
Flujo de trabajo heredado:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Codificado en el      │           │  schema.yaml           │◄── Tú editas esto
│  paquete (no se puede  │           │  templates/*.md        │◄── O esto
│  cambiar)              │           │        ↓               │
│        ↓               │           │  Efecto inmediato      │
│  Espera a una nueva    │           │        ↓               │
│  versión               │           │  Pruébalo tú mismo     │
│        ↓               │           │                        │
│  Espera que sea mejor  │           │                        │
└────────────────────────┘           └────────────────────────┘
```

**Esto es para todo el mundo:**
- **Equipos** — crea flujos de trabajo que se adapten a tu forma de trabajar real
- **Usuarios avanzados** — ajusta los prompts para obtener mejores resultados de la IA en tu base de código
- **Colaboradores de OpenSpec** — experimenta con nuevos enfoques sin necesidad de lanzamientos

Todos seguimos aprendiendo qué funciona mejor. OPSX nos permite aprender juntos.

## La experiencia de usuario

**El problema de los flujos de trabajo lineales:**
Estás "en la fase de planificación", luego "en la fase de implementación", luego "listo". Pero el trabajo real no funciona así. Implementas algo, te das cuenta de que tu diseño era erróneo, necesitas actualizar las especificaciones, sigues implementando. Las fases lineales van en contra de cómo se desarrolla el trabajo en la realidad.

**Enfoque de OPSX:**
- **Acciones, no fases** — crea, implementa, actualiza, archiva — puedes realizar cualquiera de ellas en cualquier momento
- **Las dependencias son habilitadores** — muestran lo que es posible, no lo que es obligatorio hacer a continuación

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Configuración

```bash
# Asegúrate de tener openspec instalado — las habilidades se generan automáticamente
openspec init
```

Esto crea habilidades en `.claude/skills/` (o la ruta equivalente) que los asistentes de codificación con IA detectan automáticamente.

De forma predeterminada, OpenSpec utiliza el perfil de flujo de trabajo `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Si quieres los comandos de flujo de trabajo ampliado (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), configúralos con `openspec config profile` y aplícalos con `openspec update`.

Durante la configuración, se te pedirá que crees una **configuración de proyecto** (`openspec/config.yaml`). Esta es opcional pero recomendada.

## Configuración del proyecto

La configuración de proyecto te permite establecer valores predeterminados e inyectar contexto específico del proyecto en todos los artefactos.

### Creación de la configuración

La configuración se crea durante `openspec init`, o de forma manual:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Pila tecnológica: TypeScript, React, Node.js
  Convenciones de API: RESTful, respuestas JSON
  Pruebas: Vitest para pruebas unitarias, Playwright para pruebas e2e
  Estilo: ESLint con Prettier, TypeScript estricto

rules:
  proposal:
    - Incluir plan de reversión
    - Identificar equipos afectados
  specs:
    - Usar el formato Given/When/Then para los escenarios
  design:
    - Incluir diagramas de secuencia para flujos complejos
```

### Campos de la configuración

| Campo | Tipo | Descripción |
|-------|-----|-------------|
| `schema` | string | Esquema predeterminado para nuevos cambios (por ejemplo, `spec-driven`) |
| `context` | string | Contexto del proyecto que se inyecta en las instrucciones de todos los artefactos |
| `rules` | objeto | Reglas por artefacto, identificadas por el ID del artefacto |

### Cómo funciona

**Prioridad de esquemas** (de mayor a menor):
1. Indicador de CLI (`--schema <nombre>`)
2. Metadatos del cambio (`.openspec.yaml` en el directorio del cambio)
3. Configuración del proyecto (`openspec/config.yaml`)
4. Predeterminado (`spec-driven`)

**Inyección de contexto:**
- El contexto se antepone a las instrucciones de cada artefacto
- Se envuelve en etiquetas `<context>...</context>`
- Ayuda a la IA a comprender las convenciones de tu proyecto

**Inyección de reglas:**
- Las reglas solo se inyectan para los artefactos coincidentes
- Se envuelven en etiquetas `<rules>...</rules>`
- Aparecen después del contexto, antes de la plantilla

### IDs de artefactos por esquema

**spec-driven** (predeterminado):
- `proposal` — Propuesta de cambio
- `specs` — Especificaciones
- `design` — Diseño técnico
- `tasks` — Tareas de implementación

### Validación de la configuración

- Los IDs de artefacto desconocidos en `rules` generan advertencias
- Los nombres de esquema se validan frente a los esquemas disponibles
- El contexto tiene un límite de tamaño de 50 KB
- El YAML no válido se informa con números de línea

### Solución de problemas

**"ID de artefacto desconocido en reglas: X"**
- Comprueba que los IDs de artefacto coincidan con tu esquema (ver lista anterior)
- Ejecuta `openspec schemas --json` para ver los IDs de artefacto de cada esquema

**La configuración no se aplica:**
- Asegúrate de que el archivo esté en `openspec/config.yaml` (no `.yml`)
- Comprueba la sintaxis de YAML con un validador
- Los cambios de configuración surten efecto inmediatamente (no es necesario reiniciar)

**Contexto demasiado grande:**
- El contexto está limitado a 50 KB
- Resumelo o enlaza a documentación externa en su lugar

## Comandos

| Comando | Qué hace |
|---------|-----------|
| `/opsx:propose` | Crea un cambio y genera artefactos de planificación en un solo paso (ruta rápida predeterminada) |
| `/opsx:explore` | Reflexiona sobre ideas, investiga problemas, aclara requisitos |
| `/opsx:new` | Inicia un andamio de cambio nuevo (flujo de trabajo ampliado) |
| `/opsx:continue` | Crea el siguiente artefacto (flujo de trabajo ampliado) |
| `/opsx:ff` | Avanza rápidamente los artefactos de planificación (flujo de trabajo ampliado) |
| `/opsx:apply` | Implementa tareas, actualizando los artefactos según sea necesario |
| `/opsx:update` | Revisa los artefactos de planificación de un cambio y mantiene su coherencia |
| `/opsx:verify` | Valida la implementación frente a los artefactos (flujo de trabajo ampliado) |
| `/opsx:sync` | Sincroniza las especificaciones delta con la rama principal (flujo de trabajo predeterminado, opcional) |
| `/opsx:archive` | Archiva cuando hayas terminado |
| `/opsx:bulk-archive` | Archiva múltiples cambios completados (flujo de trabajo ampliado) |
| `/opsx:onboard` | Recorrido guiado de un cambio de extremo a extremo (flujo de trabajo ampliado) |

## Uso

### Explorar una idea
```
/opsx:explore
```
Reflexiona sobre ideas, investiga problemas, compara opciones. No se requiere ninguna estructura: solo un compañero de reflexión. Cuando las ideas se consoliden, cambia a `/opsx:propose` (predeterminado) o `/opsx:new`/`/opsx:ff` (ampliado).

### Iniciar un cambio nuevo
```
/opsx:propose
```
Crea el cambio y genera los artefactos de planificación necesarios antes de la implementación.

Si has habilitado los flujos de trabajo ampliados, puedes usar en su lugar:

```text
/opsx:new        # solo crea el andamio
/opsx:continue   # crea un artefacto a la vez
/opsx:ff         # crea todos los artefactos de planificación de una vez
```

### Crear artefactos
```
/opsx:continue
```
Muestra lo que está listo para crear en función de las dependencias, luego crea un artefacto. Úsalo repetidamente para construir tu cambio de forma incremental.

```
/opsx:ff add-dark-mode
```
Crea todos los artefactos de planificación de una vez. Úsalo cuando tengas una idea clara de lo que estás construyendo.

### Implementar (la parte flexible)
```
/opsx:apply
```
Recorre las tareas, marcándolas como completadas a medida que avanzas. Si estás manejando varios cambios a la vez, puedes ejecutar `/opsx:apply <nombre>`; de lo contrario, debería inferirlo de la conversación y pedirte que elijas si no puede determinarlo.

### Actualizar un cambio
```
/opsx:update add-dark-mode - ahora almacenamos el tema en una cookie
```
Revisa los artefactos de planificación existentes del cambio y mantiene su coherencia en cualquier dirección (una edición del diseño puede afectar en cascada a la propuesta). Solo artefactos de planificación: nunca edita código, ni crea artefactos faltantes (eso es `/opsx:continue`). Cada edición se confirma contigo primero. Si el cambio ya se había implementado, recomienda `/opsx:apply` para que el código se adapte al plan revisado. Si tu revisión cambia la *intención* del cambio, empieza de nuevo en su lugar: consulta [Cuándo actualizar frente a empezar de cero](#when-to-update-vs-start-fresh).

### Finalizar
```
/opsx:archive   # Mueve al archivo cuando hayas terminado (pide sincronizar las especificaciones si es necesario)
```

## Cuándo actualizar frente a empezar de cero

Siempre puedes editar tu propuesta o especificaciones antes de la implementación. Pero, ¿cuándo pasa el refinamiento a ser "trabajo diferente"?

### Lo que captura una propuesta

Una propuesta define tres cosas:
1. **Intención** — ¿Qué problema estás resolviendo?
2. **Alcance** — ¿Qué está dentro/fuera de los límites?
3. **Enfoque** — ¿Cómo lo resolverás?

La pregunta es: ¿qué cambió, y en qué medida?

### Actualiza el cambio existente cuando:

**Misma intención, ejecución refinada**
- Descubres casos límite que no habías tenido en cuenta
- El enfoque necesita ajustes, pero el objetivo se mantiene igual
- La implementación revela que el diseño era ligeramente erróneo

**El alcance se reduce**
- Te das cuenta de que el alcance completo es demasiado grande, quieres lanzar primero el producto mínimo viable (MVP)
- "Añadir modo oscuro" → "Añadir interruptor de modo oscuro (preferencia del sistema en la v2)"

**Correcciones basadas en aprendizajes**
- La base de código no está estructurada como pensabas
- Una dependencia no funciona como esperabas
- "Usar variables CSS" → "Usar el prefijo `dark:` de Tailwind en su lugar"

### Inicia un cambio nuevo cuando:

**La intención cambió fundamentalmente**
- El problema en sí es diferente ahora
- "Añadir modo oscuro" → "Añadir sistema de temas completo con colores, fuentes y espaciados personalizados"

**El alcance se desbordó**
- El cambio creció tanto que es esencialmente trabajo diferente
- La propuesta original sería irreconocible después de las actualizaciones
- "Corregir error de inicio de sesión" → "Reescribir sistema de autenticación"

**El original se puede completar**
- El cambio original se puede marcar como "listo"
- El trabajo nuevo es independiente, no es un refinamiento
- Completa "Añadir MVP de modo oscuro" → Archiva → Nuevo cambio "Mejorar modo oscuro"

### Las heurísticas

```
                        ┌─────────────────────────────────────┐
                        │     ¿Es el mismo trabajo?           │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             ¿Misma intención?     >50% de coincidencia?  ¿Se puede marcar el
             ¿Mismo problema?     ¿Mismo alcance?        original como "listo"
                    │                  │          sin estos cambios?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         SÍ               NO SÍ           NO  NO              SÍ
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

| Prueba | Actualizar | Cambio nuevo |
|--------|------------|--------------|
| **Identidad** | "Lo mismo, refinado" | "Trabajo diferente" |
| **Coincidencia de alcance** | >50% de coincidencia | <50% de coincidencia |
| **Finalización** | No se puede marcar como "listo" sin cambios | Se puede completar el original, el trabajo nuevo es independiente |
| **Historia** | La cadena de actualizaciones cuenta una historia coherente | Los parches confundirían más que aclarar |

### El principio

> **La actualización preserva el contexto. El cambio nuevo aporta claridad.**
>
> Elige actualizar cuando el historial de tu razonamiento sea valioso.
> Elige empezar de nuevo cuando hacerlo desde cero sea más claro que aplicar parches.

Piénsalo como las ramas de git:
- Sigue haciendo commits mientras trabajas en la misma funcionalidad
- Crea una rama nueva cuando sea trabajo genuinamente nuevo
- A veces fusiona una funcionalidad parcial y empieza de nuevo para la fase 2

## ¿Qué es diferente?

| | Heredado (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Estructura** | Un único documento de propuesta grande | Artefactos discretos con dependencias |
| **Flujo de trabajo** | Fases lineales: planificar → implementar → archivar | Acciones fluidas — realiza cualquiera en cualquier momento |
| **Iteración** | Incómodo de retroceder | Actualiza los artefactos a medida que aprendes |
| **Personalización** | Estructura fija | Basado en esquemas (define tus propios artefactos) |

**La idea clave:** el trabajo no es lineal. OPSX deja de fingir que lo es.

## Análisis profundo de la arquitectura

Esta sección explica cómo funciona OPSX por dentro y cómo se compara con el flujo de trabajo heredado. Los ejemplos de esta sección usan el conjunto de comandos ampliado (`new`, `continue`, etc.); los usuarios predeterminados de `core` pueden mapear el mismo flujo a `propose → apply → sync → archive`.

### Filosofía: Fases frente a acciones

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE TRABAJO HEREDADO                            │
│                    (Bloqueado por fases, todo o nada)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │ FASE DE      │ ───► │ FASE DE      │ ───► │ FASE DE      │             │
│   │ PLANIFICACIÓN│      │ IMPLEMENTACIÓN│      │ ARCHIVACIÓN  │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Crea TODOS los artefactos de una vez                                    │
│   • No se puede volver para actualizar especificaciones durante la          │
│     implementación                                                          │
│   • Las puertas de fase imponen una progresión lineal                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            FLUJO DE TRABAJO OPSX                             │
│                      (Acciones fluidas, iterativo)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACCIONES (no fases)             │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              cualquier orden               │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Crea artefactos de uno en uno O salta etapas                            │
│   • Actualiza especificaciones/diseño/tareas durante la implementación      │
│   • Las dependencias habilitan el progreso, no existen fases                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arquitectura de componentes

El **flujo de trabajo heredado** usa plantillas hardcodeadas en TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPONENTES DEL FLUJO DE TRABAJO HEREDADO              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Plantillas hardcodeadas (cadenas de TypeScript)                           │
│                    │                                                        │
│                    ▼                                                        │
│   Configuradores/adaptadores específicos de herramienta                     │
│                    │                                                        │
│                    ▼                                                        │
│   Archivos de comando generados (.claude/commands/openspec/*.md)            │
│                                                                             │
│   • Estructura fija, sin conciencia de artefactos                           │
│   • Los cambios requieren modificación de código + reconstrucción           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** usa esquemas externos y un motor de grafo de dependencias:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENTES DE OPSX                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Definiciones de esquema (YAML)                                            │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependencias                    │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Patrones glob                    │   │
│   │      requires: [proposal]      ◄── Se habilita después de la        │   │
│   │                                    propuesta                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Motor de grafo de artefactos                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Ordenación topológica (orden por dependencias)                   │   │
│   │  • Detección de estado (existencia en el sistema de archivos)       │   │
│   │  • Generación de instrucciones enriquecidas (plantillas + contexto) │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Archivos de habilidad (.claude/skills/openspec-*/SKILL.md)                │
│                                                                             │
│   • Compatible entre editores (Claude Code, Cursor, Windsurf)               │
│   • La CLI de consulta de habilidades para datos estructurados              │
│   • Totalmente personalizable mediante archivos de esquema                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modelo de grafo de dependencias

Los artefactos forman un grafo acíclico dirigido (DAG, por sus siglas en inglés). Las dependencias son **habilitadores**, no puertas:

```
                              propuesta
                             (nodo raíz)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
               especificaciones               diseño
            (requiere:                      (requiere:
             propuesta)                      propuesta)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                                tareas
                            (requiere:
                            especificaciones, diseño)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ FASE DE      │
                          │ APLICACIÓN   │
                          │ (requiere:   │
                          │  tareas)     │
                          └──────────────┘
```

**Transiciones de estado:**

```
   BLOQUEADO ────────────────► LISTO ────────────────► HECHO
      │                        │                       │
   Faltan                  Todas las               El archivo existe
   dependencias            dependencias            en el sistema de
                          están HECHAS             archivos
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
  │  No tiene conciencia de qué existe ni   │
  │  de las dependencias entre artefactos   │
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
  │  Paso 1: Consultar el estado actual                                      │
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
  │  Paso 3: Leer dependencias → Crear UN artefacto → Mostrar lo que se     │
  │  desbloquea                                                              │
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
       │               │   • Seguir adelante y arreglarlo después
       │               │
       │               └── No hay un mecanismo oficial de "volver atrás"
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
      │                │            ¡Solo edita design.md
      │                │            y continúa!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply retoma
      │                │         donde lo dejaste
      │                │
      │                └── Crea UN solo artefacto, muestra lo que se desbloquea
      │
      └── Genera el esqueleto del cambio, espera indicaciones
```

### Esquemas personalizados

Crea flujos de trabajo personalizados usando los comandos de gestión de esquemas:

```bash
# Crea un esquema nuevo desde cero (interactivo)
openspec schema init my-workflow

# O bien bifurca un esquema existente como punto de partida
openspec schema fork spec-driven my-workflow

# Valida la estructura de tu esquema
openspec schema validate my-workflow

# Consulta desde dónde se resuelve un esquema (útil para depuración)
openspec schema which my-workflow
```

Los esquemas se almacenan en `openspec/schemas/` (local del proyecto, con control de versiones) o en `~/.local/share/openspec/schemas/` (global del usuario).

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
  - id: research        # Se agrega antes de la propuesta
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

| Aspecto | Versión anterior | OPSX |
|--------|----------|------|
| **Plantillas** | TypeScript hardcodeado | YAML y Markdown externos |
| **Dependencias** | Ninguna (todos a la vez) | DAG con ordenación topológica |
| **Estado** | Modelo mental basado en fases | Existencia en el sistema de archivos |
| **Personalización** | Editar el código fuente, reconstruir | Crear schema.yaml |
| **Iteración** | Bloqueado por fases | Fluido, editar cualquier elemento |
| **Soporte para editores** | Configuradores y adaptadores específicos de cada herramienta | Un único directorio de habilidades |
## Esquemas

Los esquemas definen qué artefactos existen y sus dependencias. Disponibles actualmente:

- **spec-driven** (predeterminado): propuesta → especificaciones → diseño → tareas

```bash
# Lista los esquemas disponibles
openspec schemas

# Muestra todos los esquemas junto con sus orígenes de resolución
openspec schema which --all

# Crea un esquema nuevo de forma interactiva
openspec schema init my-workflow

# Bifurca un esquema existente para personalizarlo
openspec schema fork spec-driven my-workflow

# Valida la estructura del esquema antes de usarlo
openspec schema validate my-workflow
```

## Consejos

- Usa `/opsx:explore` para analizar una idea antes de confirmar un cambio
- Usa `/opsx:ff` cuando ya sabes lo que quieres, `/opsx:continue` cuando estés explorando
- Durante `/opsx:apply`, si algo está mal, arregla el artefacto y luego continúa
- Las tareas registran el progreso mediante casillas de verificación en `tasks.md`
- Consulta el estado en cualquier momento: `openspec status --change "name"`

## Comentarios

Esto es un borrador. Es intencional: estamos aprendiendo qué funciona.

¿Encontraste un error? ¿Tienes ideas? Únete a nuestro [Discord](https://discord.gg/YctCnvvshC) o abre una incidencia en [GitHub](https://github.com/Fission-AI/openspec/issues).
```