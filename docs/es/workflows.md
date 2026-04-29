# Flujos de trabajo

Esta guía cubre patrones comunes de flujo de trabajo para OpenSpec y cuándo usar cada uno. Para la configuración básica, consulta [Primeros pasos](getting-started.md). Para la referencia de comandos, consulta [Comandos](commands.md).

## Filosofía: Acciones, no fases

Los flujos de trabajo tradicionales te obligan a seguir fases: planificación, luego implementación, luego finalización. Pero el trabajo real no encaja perfectamente en casillas.

OPSX adopta un enfoque diferente:

```text
Tradicional (bloqueado por fases):

  PLANIFICACIÓN ────────► IMPLEMENTACIÓN ────────► FINALIZADO
      │                         │
      │   "No se puede volver"  │
      └─────────────────────────┘

OPSX (acciones fluidas):

  propuesta ──► especificaciones ──► diseño ──► tareas ──► implementar
```

**Principios clave:**

- **Acciones, no fases** - Los comandos son cosas que puedes hacer, no etapas en las que estás atrapado
- **Las dependencias son facilitadoras** - Muestran lo que es posible, no lo que se requiere a continuación

> **Personalización:** Los flujos de trabajo de OPSX están impulsados por esquemas que definen secuencias de artefactos. Consulta [Personalización](customization.md) para detalles sobre cómo crear esquemas personalizados.

## Dos Modos

### Ruta Rápida por Defecto (perfil `core`)

Las instalaciones nuevas se configuran por defecto con `core`, que proporciona:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

Flujo típico:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### Flujo de Trabajo Expandido/Completo (selección personalizada)

Si deseas comandos explícitos de andamiaje y construcción (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), habilítalos con:

```bash
openspec config profile
openspec update
```

## Patrones de Flujo de Trabajo (Modo Expandido)

### Funcionalidad Rápida

Cuando sabes lo que quieres construir y solo necesitas ejecutar:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Ejemplo de conversación:**

```text
Tú: /opsx:new add-logout-button

IA:  Creado openspec/changes/add-logout-button/
     Listo para crear: propuesta

Tú: /opsx:ff

IA:  Creando todos los artefactos de planificación...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     ¡Listo para la implementación!

Tú: /opsx:apply

IA:  Procesando tareas...
     ✓ Añadido botón de cerrar sesión al encabezado
     ✓ Implementada limpieza de sesión
     ✓ Añadido diálogo de confirmación
     ¡Todas las tareas completadas!

Tú: /opsx:archive

IA:  ✓ Specs fusionados
     ✓ Cambio archivado
```

**Ideal para:** Funcionalidades pequeñas a medianas, corrección de errores, cambios directos.

### Exploratorio

Cuando los requisitos no están claros o necesitas investigar primero:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Ejemplo de conversación:**

```text
Tú: /opsx:explore

IA:  ¿Qué te gustaría explorar?

Tú: Quiero mejorar el rendimiento de carga de la página pero no estoy seguro
     de dónde están los cuellos de botella.

IA:  Déjame ayudar a investigar...
     [Analiza tamaños de paquetes, identifica consultas lentas, revisa
     patrones de renderizado de componentes]

     Encontré tres cuellos de botella principales:
     1. Imágenes grandes sin optimizar
     2. Obtención de datos síncrona en ProductList
     3. Re-renderizados por cambios de contexto

     ¿Cuál te gustaría abordar primero?

Tú: Vamos a atacar el problema de obtención de datos.

Tú: /opsx:new optimize-product-list-fetching

IA:  Cambio creado. Listo para crear: propuesta

Tú: /opsx:continue

IA:  Creando propuesta basada en nuestra exploración...
     [Escribe la propuesta incorporando los hallazgos de la investigación]

     Listo para crear: specs, diseño
     ¿Qué te gustaría hacer a continuación?

Tú: /opsx:continue

IA:  Creando specs...
```

**Ideal para:** Optimización de rendimiento, depuración, decisiones arquitectónicas, requisitos poco claros.

### Cambios en Paralelo

Trabaja en múltiples cambios a la vez:

```text
Cambio A: /opsx:new ──► /opsx:ff ──► /opsx:apply (en progreso)
                                         │
                                    cambio de contexto
                                         │
Cambio B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Ejemplo de conversación:**

```text
Tú: Estoy trabajando en add-dark-mode pero me han llamado para una corrección de error

Tú: /opsx:new fix-login-redirect

IA:  Creado openspec/changes/fix-login-redirect/

Tú: /opsx:ff

IA:  ✓ Artefactos de planificación creados

Tú: /opsx:apply

IA:  Trabajando en fix-login-redirect...
     [Implementa la corrección]
     ¡Todas las tareas completadas!

Tú: /opsx:archive

IA:  ✓ fix-login-redirect archivado

Tú: Volvamos al modo oscuro

Tú: /opsx:apply add-dark-mode

IA:  Reanudando add-dark-mode...
     Retomando en tarea 2.3: Actualizar Encabezado...
```

**Ideal para:** Flujos de trabajo paralelos, interrupciones urgentes, colaboración en equipo.

Cuando tengas múltiples cambios completados, usa `/opsx:bulk-archive`:

```text
Tú: /opsx:bulk-archive

IA:  Encontrados 3 cambios completados:
     - add-dark-mode (todas las tareas hechas)
     - fix-login-redirect (todas las tareas hechas)
     - update-footer (todas las tareas hechas)

     Verificando conflictos de specs...
     ⚠ add-dark-mode y update-footer ambos tocan specs/ui/

     Inspeccionando el código fuente para resolver...
     Ambos cambios están implementados. Se aplicarán en orden cronológico.

     ¿Archivar los 3 cambios?

Tú: Sí

IA:  ✓ add-dark-mode archivado
     ✓ fix-login-redirect archivado
     ✓ update-footer archivado
     Specs fusionados en orden: add-dark-mode → update-footer
```

La archivación masiva detecta cuando múltiples cambios tocan los mismos specs y resuelve conflictos verificando lo que realmente está implementado.

### Completar un Cambio

El flujo de finalización recomendado:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valida              sugiere sincronizar
              implementación      si es necesario
```

#### Verificar: Revisa tu Trabajo

`/opsx:verify` valida la implementación contra tus artefactos en tres dimensiones:

```text
Tú: /opsx:verify

IA:  Verificando add-auth...

     COMPLETITUD
     ✓ Las 12 tareas en tasks.md están marcadas
     ✓ Todos los requisitos en specs tienen código correspondiente
     ⚠ Escenario "Tiempo de sesión por inactividad" no probado

     CORRECCIÓN
     ✓ La implementación coincide con la intención del spec
     ✓ Los casos extremos de los escenarios están manejados
     ✓ Los estados de error coinciden con las definiciones del spec

     COHERENCIA
     ✓ Las decisiones de diseño se reflejan en la estructura del código
     ✓ Las convenciones de nombres son consistentes con design.md
     ⚠ El diseño menciona "event-driven" pero la implementación usa polling

     RESUMEN
     ─────────────────────────────
     Problemas críticos: 0
     Advertencias: 2
     Listo para archivar: Sí (con advertencias)

     Recomendaciones:
     1. Añadir prueba para el escenario de tiempo de sesión
     2. Considerar refactorizar a event-driven como se diseñó, o actualizar design.md
```

**Qué verifica verify:**

| Dimensión | Qué valida |
|-----------|------------|
| Completitud | Todas las tareas hechas, todos los requisitos implementados, escenarios cubiertos |
| Corrección | La implementación coincide con la intención del spec, casos extremos manejados |
| Coherencia | Decisiones de diseño reflejadas en el código, patrones consistentes |

Verify no bloqueará la archivación, pero te muestra problemas que podrías querer abordar primero.

#### Archivar: Finalizar el Cambio

`/opsx:archive` completa el cambio y lo mueve al archivo:

```text
Tú: /opsx:archive

IA:  Archivando add-auth...

     Estado de artefactos:
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (12/12 tareas completadas)

     Specs delta: Aún no sincronizados con main
     → ¿Te gustaría sincronizar ahora?

Tú: Sí

IA:  ✓ Specs sincronizados a openspec/specs/auth/spec.md
     ✓ Movido a openspec/changes/archive/2025-01-24-add-auth/

     Cambio archivado exitosamente.
```

Archive preguntará si los specs no están sincronizados. No bloqueará por tareas incompletas, pero te advertirá.

## Cuándo Usar Cada Comando

### `/opsx:ff` vs `/opsx:continue`

| Situación | Usa |
|-----------|-----|
| Requisitos claros, listo para construir | `/opsx:ff` |
| Explorando, quieres revisar cada paso | `/opsx:continue` |
| Quieres iterar sobre la propuesta antes de los specs | `/opsx:continue` |
| Presión de tiempo, necesitas avanzar rápido | `/opsx:ff` |
| Cambio complejo, quieres control | `/opsx:continue` |

**Regla general:** Si puedes describir el alcance completo de antemano, usa `/opsx:ff`. Si lo estás descubriendo sobre la marcha, usa `/opsx:continue`.

### Cuándo Actualizar vs Empezar de Nuevo

Una pregunta común: ¿cuándo está bien actualizar un cambio existente y cuándo deberías empezar uno nuevo?

**Actualiza el cambio existente cuando:**

- Misma intención, ejecución refinada
- El alcance se reduce (MVP primero, el resto después)
- Correcciones basadas en aprendizaje (el código fuente no era lo que esperabas)
- Ajustes de diseño basados en descubrimientos de implementación

**Empieza un cambio nuevo cuando:**

- La intención cambió fundamentalmente
- El alcance explotó a un trabajo completamente diferente
- El cambio original puede marcarse como "hecho" de forma independiente
- Los parches confundirían más que aclarar

```text
                     ┌─────────────────────────────────────┐
                     │     ¿Es este el mismo trabajo?      │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ¿Misma intención?  ¿Más de 50% de    ¿Puede el original
          ¿Mismo problema?   superposición?     estar "hecho" sin
                 │                  │          estos cambios?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      SÍ                NO SÍ            NO  NO              SÍ
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    ACTUALIZAR        NUEVO ACTUALIZAR  NUEVO ACTUALIZAR     NUEVO
```

**Ejemplo: "Añadir modo oscuro"**

- "Necesito también soportar temas personalizados" → Cambio nuevo (el alcance explotó)
- "La detección de preferencias del sistema es más difícil de lo esperado" → Actualizar (misma intención)
- "Vamos a lanzar el interruptor primero, añadir preferencias después" → Actualizar y archivar, luego un cambio nuevo

## Mejores Prácticas

### Mantén los Cambios Enfocados

Una unidad lógica de trabajo por cambio. Si estás haciendo "añadir funcionalidad X y también refactorizar Y", considera dos cambios separados.

**Por qué importa:**
- Más fácil de revisar y entender
- Historial de archivo más limpio
- Se pueden lanzar independientemente
- Rollback más simple si es necesario

### Usa `/opsx:explore` para Requisitos Poco Claros

Antes de comprometerte con un cambio, explora el espacio del problema:

```text
Tú: /opsx:explore

IA:  ¿Qué te gustaría explorar?

Tú: ¿Cómo deberíamos manejar el rate limiting para nuestra API?

IA:  Déjame investigar tu configuración actual y las opciones...
     [Investiga el código fuente, considera patrones]

     Veo tres enfoques que podríamos tomar:
     1. Basado en middleware (simple, por endpoint)
     2. Con respaldo de Redis (escalable, estado compartido)
     3. Cubo de tokens por usuario (justo, complejo)

     Tu pila actual sugiere #1 o #2. ¿Cuál es tu escala?
```

La exploración aclara el pensamiento antes de que crees artefactos.

### Verifica Antes de Archivar

Usa `/opsx:verify` para comprobar que la implementación coincide con los artefactos:

```text
Tú: /opsx:verify

IA:  Verificando add-dark-mode...

     ✓ Todas las tareas en tasks.md están marcadas
     ✓ Los requisitos en specs tienen código correspondiente
     ✓ Las decisiones de diseño se reflejan en la implementación

     ¡Listo para archivar!
```

Detecta discrepancias antes de que cierres el cambio.

### Nombra los Cambios Claramente

Buenos nombres hacen que `openspec list` sea útil:

```text
Bueno:                         Evita:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Referencia Rápida de Comandos

Para detalles completos de los comandos y opciones, consulta [Comandos](commands.md).

| Comando | Propósito | Cuándo Usar |
|---------|-----------|-------------|
| `/opsx:propose` | Crear cambio + artefactos de planificación | Ruta predeterminada rápida (perfil `core`) |
| `/opsx:explore` | Analizar ideas | Requisitos poco claros, investigación |
| `/opsx:new` | Iniciar un esqueleto de cambio | Modo ampliado, control explícito de artefactos |
| `/opsx:continue` | Crear el siguiente artefacto | Modo ampliado, creación de artefactos paso a paso |
| `/opsx:ff` | Crear todos los artefactos de planificación | Modo ampliado, alcance claro |
| `/opsx:apply` | Implementar tareas | Listo para escribir código |
| `/opsx:verify` | Validar la implementación | Modo ampliado, antes de archivar |
| `/opsx:sync` | Fusionar especificaciones delta | Modo ampliado, opcional |
| `/opsx:archive` | Completar el cambio | Todo el trabajo finalizado |
| `/opsx:bulk-archive` | Archivar múltiples cambios | Modo ampliado, trabajo paralelo |

## Próximos Pasos

- [Comandos](commands.md) - Referencia completa de comandos con opciones
- [Conceptos](concepts.md) - Profundización en especificaciones, artefactos y esquemas
- [Personalización](customization.md) - Crear flujos de trabajo personalizados