# Flujos de trabajo

Esta guía cubre los patrones comunes de flujo de trabajo para OpenSpec y cuándo usar cada uno. Para la configuración básica, consulte [Getting Started](getting-started.md). Para la referencia de comandos, consulte [Commands](commands.md).

## Filosofía: Acciones, no Fases

Los flujos de trabajo tradicionales te fuerzan a pasar por fases: planificación, luego implementación y finalmente terminado. Pero el trabajo real no encaja perfectamente en cajas.

OPSX adopta un enfoque diferente:

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Principios clave:**

- **Acciones, no fases** - Los comandos son cosas que puedes hacer, no etapas en las que estás atrapado.
- **Las dependencias son habilitadores** - Muestran lo posible, no lo que se requiere a continuación.

> **Personalización:** Los flujos de trabajo de OPSX están impulsados por esquemas que definen secuencias de artefactos. Consulte [Customization](customization.md) para obtener detalles sobre la creación de esquemas personalizados.

## Dos Modos

### Ruta Rápida Predeterminada (`core` profile)

Las nuevas instalaciones se configuran por defecto con `core`, lo que proporciona:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Flujo típico:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (opcional)
```

#### Comience explorando (el hábito que debe formarse)

`/opsx:explore` forma parte del perfil predeterminado, no es un complemento avanzado. Es la acción a realizar cuando tiene un problema pero aún no un plan, lo cual sucede la mayor parte del tiempo con un asistente de IA.

```text
Usted: /opsx:explore

IA:  ¿Qué le gustaría explorar?

Usted: Nuestras resultados de búsqueda se sienten obsoletos. No estoy seguro si es el caché,
     la indexación o la consulta en sí misma.

IA:  Déjame mirar... [lee el servicio de búsqueda y la capa de caché]
     Es la indexación: solo se reconstruye por la noche, por lo que las ediciones no aparecen
     hasta el día siguiente. Hay dos opciones: reconstruir al escribir (simple, más carga) o una invalidación de caché con TTL corto (más piezas móviles, menos carga). Dado que su volumen de escritura es bajo, la reconstrucción al escribir es la solución más limpia. ¿Quiere acotarlo?

Usted: Sí.

Usted: /opsx:propose rebuild-search-index-on-write
```

Explorar no crea artefactos ni escribe código. Es una conversación gratuita y sin riesgos que convierte una preocupación vaga en un cambio preciso, por lo que la propuesta subsiguiente es clara. ¿Ya sabe exactamente lo que quiere? Omítalo e vaya directamente a `/opsx:propose`. Guía completa: [Explore First](explore.md).

### Flujo de Trabajo Ampliado/Completo (selección personalizada)

Si desea comandos explícitos para la estructura inicial y la construcción (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), actívelos con:

```bash
openspec config profile
openspec update
```

## Patrones de Flujo de Trabajo (Modo Ampliado)

### Funcionalidad Rápida

Cuando sabe lo que quiere construir y solo necesita ejecutar:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Ejemplo de conversación:**

```text
Usted: /opsx:new add-logout-button

IA:  Creado openspec/changes/add-logout-button/
     Listo para crear: propuesta

Usted: /opsx:ff

IA:  Creando todos los artefactos de planificación...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     ¡Listo para la implementación!

Usted: /opsx:apply

IA:  Trabajando en las tareas...
     ✓ Añadido botón de cierre de sesión al encabezado
     ✓ Implementada la limpieza de sesión
     ✓ Añadido diálogo de confirmación
     ¡Todas las tareas completadas!

Usted: /opsx:archive

IA:  ✓ Especificaciones fusionadas
     ✓ Cambio archivado
```

**Mejor para:** Funcionalidades pequeñas a medianas, correcciones de errores, cambios sencillos.

### Exploratorio

Cuando los requisitos no están claros o necesita investigar primero:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Ejemplo de conversación:**

```text
Usted: /opsx:explore

IA:  ¿Qué le gustaría explorar?

Usted: Quiero mejorar el rendimiento de la carga de páginas, pero no estoy seguro
     de dónde están los cuellos de botella.

IA:  Déjame ayudar a investigar...
     [Analiza tamaños de paquete, identifica consultas lentas, revisa patrones de renderizado de componentes]

     Encontré tres cuellos de botella principales:
     1. Imágenes grandes y no optimizadas
     2. Obtención de datos síncrona en ProductList
     3. Re-renderizados debido a cambios de contexto

     ¿Cuál le gustaría abordar primero?

Usted: Abordemos el problema de la obtención de datos.

Usted: /opsx:new optimize-product-list-fetching

IA:  Creado cambio. Listo para crear: propuesta

Usted: /opsx:continue

IA:  Creando la propuesta basada en nuestra exploración...
     [Escribe la propuesta incorporando las conclusiones de la investigación]

     Listo para crear: especificaciones, diseño
     ¿Qué le gustaría hacer a continuación?

Usted: /opsx:continue

IA:  Creando especificaciones...
```

**Mejor para:** Optimización del rendimiento, depuración, decisiones arquitectónicas, requisitos poco claros.

### Cambios Paralelos

Trabaje en múltiples cambios al mismo tiempo:

```text
Cambio A: /opsx:new ──► /opsx:ff ──► /opsx:apply (en progreso)
                                         │
                                    cambio de contexto
                                         │
Cambio B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Ejemplo de conversación:**

```text
Usted: Estoy trabajando en add-dark-mode pero me desvié a una corrección de errores.

Usted: /opsx:new fix-login-redirect

IA:  Creado openspec/changes/fix-login-redirect/

Usted: /opsx:ff

IA:  ✓ Artefactos de planificación creados

Usted: /opsx:apply

IA:  Trabajando en fix-login-redirect...
     [Implementa la corrección]
     ¡Todas las tareas completadas!

Usted: /opsx:archive

IA:  ✓ fix-login-redirect archivado

Usted: Volvamos a dark mode.

Usted: /opsx:apply add-dark-mode

IA:  Reanudando add-dark-mode...
     Retomando en la tarea 2.3: Actualizar Encabezado...
```

**Mejor para:** Flujos de trabajo paralelos, interrupciones urgentes, colaboración en equipo.

Cuando tenga múltiples cambios completados, use `/opsx:bulk-archive`:

```text
Usted: /opsx:bulk-archive

IA:  Encontró 3 cambios completados:
     - add-dark-mode (todas las tareas hechas)
     - fix-login-redirect (todas las tareas hechas)
     - update-footer (todas las tareas hechas)

     Verificando conflictos de especificaciones...
     ⚠ add-dark-mode y update-footer tocan specs/ui/

     Inspeccionando la base de código para resolver...
     Ambos cambios están implementados. Se aplicarán en orden cronológico.

     ¿Archivar los 3 cambios?

Usted: Sí

IA:  ✓ add-dark-mode archivado
     ✓ fix-login-redirect archivado
     ✓ update-footer archivado
     Especificaciones fusionadas en orden: add-dark-mode → update-footer
```

Bulk archive detecta cuándo múltiples cambios tocan las mismas especificaciones y resuelve los conflictos comprobando lo que está realmente implementado.

### Completar un Cambio

El flujo de finalización recomendado:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valida          solicita sincronización
              implementación     si es necesario
```

#### Verificar: Revise su Trabajo

`/opsx:verify` valida la implementación contra sus artefactos en tres dimensiones:

```text
Usted: /opsx:verify

IA:  Verificando add-auth...

     COMPLETITUD
     ✓ Todas las 12 tareas de tasks.md han sido revisadas
     ✓ Todos los requisitos en specs tienen código correspondiente
     ⚠ El escenario "Tiempo de espera de sesión después de la inactividad" no ha sido probado

     CORRECTEDUMBRE
     ✓ La implementación coincide con la intención de la especificación
     ✓ Los casos límite del escenario están manejados
     ✓ Los estados de error coinciden con las definiciones de la especificación

     COHERENCIA
     ✓ Las decisiones de diseño se reflejan en la estructura del código
     ✓ Las convenciones de nomenclatura son consistentes con design.md
     ⚠ El diseño menciona "orientado a eventos" pero la implementación utiliza polling (sondeo)

     RESUMEN
     ─────────────────────────────
     Problemas críticos: 0
     Advertencias: 2
     Listo para archivar: Sí (con advertencias)

     Recomendaciones:
     1. Añadir prueba para el escenario de tiempo de espera de sesión
     2. Considerar la refactorización a orientado a eventos como se diseñó, o actualizar design.md
```

**Qué verifica:**

| Dimensión | Qué valida |
|-----------|------------------|
| Completitud | Todas las tareas hechas, todos los requisitos implementados, escenarios cubiertos |
| Corrección | La implementación coincide con la intención de la especificación, se manejan los casos límite |
| Coherencia | Las decisiones de diseño se reflejan en el código, los patrones son consistentes |

Verify no bloqueará el archivo, pero sí mostrará problemas que querría abordar primero.

#### Archivar: Finalizar el Cambio

`/opsx:archive` completa el cambio y lo mueve al archivo:

```text
Usted: /opsx:archive

IA:  Archivando add-auth...

     Estado de los artefactos:
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (12/12 tareas completas)

     Delta de especificaciones: Aún no sincronizado con la principal
     → ¿Le gustaría sincronizar ahora?

Usted: Sí

IA:  ✓ Especificaciones sincronizadas a openspec/specs/auth/spec.md
     ✓ Movido a openspec/changes/archive/2025-01-24-add-auth/

     Cambio archivado con éxito.
```

Archive solicitará si las especificaciones no están sincronizadas. No bloqueará por tareas incompletas, pero sí advertirá.

## Cuándo Usar Cada Uno

### `/opsx:ff` vs `/opsx:continue`

| Situación | Uso |
|-----------|-----|
| Requisitos claros, listo para construir | `/opsx:ff` |
| Explorando, quiere revisar cada paso | `/opsx:continue` |
| Quiere iterar sobre la propuesta antes de las especificaciones | `/opsx:continue` |
| Presión de tiempo, necesita moverse rápido | `/opsx:ff` |
| Cambio complejo, quiere control | `/opsx:continue` |

**Regla general:** Si puede describir el alcance completo por adelantado, use `/opsx:ff`. Si lo está descubriendo mientras avanza, use `/opsx:continue`.

### Cuándo Actualizar vs Empezar de Cero

Una pregunta común: ¿cuándo está bien actualizar un cambio existente y cuándo debe comenzar uno nuevo?

**Actualice el cambio existente cuando:**

- La intención es la misma, pero la ejecución se ha refinado
- El alcance se reduce (MVP primero, el resto después)
- Correcciones impulsadas por el aprendizaje (la base de código no era lo que esperaba)
- Ajustes de diseño basados en descubrimientos de implementación

**Comience un cambio nuevo cuando:**

- La intención cambió fundamentalmente
- El alcance explotó hacia trabajo completamente diferente
- El cambio original puede ser marcado como "hecho" por sí solo
- Los parches causarían más confusión que claridad

```text
                     ┌─────────────────────────────────────┐
                     │     ¿Es este el mismo trabajo?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ¿Misma intención?      >50% de superposición?      ¿Se puede marcar el original
          ¿Mismo problema?     ¿Mismo alcance?        como "hecho" sin
                 │                  │          estos cambios?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      SÍ               NO SÍ           NO  NO              SÍ
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    ACTUALIZAR        NUEVO  ACTUALIZAR       NUEVO  ACTUALIZAR      NUEVO
```

**Ejemplo: "Añadir modo oscuro"**

- "Necesitamos soportar temas personalizados también" → Nuevo cambio (el alcance explotó)
- "La detección de preferencias del sistema es más difícil de lo esperado" → Actualizar (misma intención)
- "Vamos a lanzar el interruptor primero, añadir las preferencias después" → Actualizar y archivar, luego nuevo cambio

## Mejores Prácticas

### Mantenga los Cambios Enfocados

Una unidad lógica de trabajo por cambio. Si está haciendo "añadir la funcionalidad X y también refactorizar Y", considere dos cambios separados.

**Por qué es importante:**
- Es más fácil de revisar y entender
- Historial de archivo más limpio
- Puede ser enviado independientemente
- Reversión más sencilla si es necesario

### Use `/opsx:explore` para Requisitos Poco Claros

Antes de comprometerse con un cambio, explore el espacio del problema:

```text
Usted: /opsx:explore

IA:  ¿Qué le gustaría explorar?

Usted: ¿Cómo debemos manejar la limitación de tasa (rate limiting) para nuestra API?

IA:  Déjame investigar su configuración actual y las opciones...
     [Investiga la base de código, considera patrones]

     Veo tres enfoques que podríamos tomar:
     1. Basado en middleware (simple, por punto final)
     2. Respaldado por Redis (escalable, estado compartido)
     3. Cubeta de tokens por usuario (justo, complejo)

     Su pila actual sugiere #1 o #2. ¿Cuál es su escala?
```

La exploración aclara el pensamiento antes de crear artefactos.

### Verifique Antes de Archivar

Use `/opsx:verify` para comprobar que la implementación coincide con los artefactos:

```text
Usted: /opsx:verify

IA:  Verificando add-dark-mode...

     ✓ Todas las tareas de tasks.md han sido revisadas
     ✓ Los requisitos en specs tienen código correspondiente
     ✓ Las decisiones de diseño se reflejan en la implementación

     ¡Listo para archivar!
```

Detecta discrepancias antes de cerrar el cambio.

### Nombre los Cambios Claramente

Los buenos nombres hacen que `openspec list` sea útil:

```text
Bueno:                          Evitar:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Referencia Rápida de Comandos

Para obtener detalles completos y opciones de los comandos, consulte [Commands](commands.md).

| Command | Propósito | Cuándo Usarlo |
|---------|---------|-------------|
| `/opsx:propose` | Crear artefactos de planificación y cambio | Ruta predeterminada rápida (`core` profile) |
| `/opsx:explore` | Analizar ideas con la IA | Iniciar aquí si no está seguro: requisitos poco claros, investigación, comparación de opciones |
| `/opsx:new` | Iniciar un esqueleto de cambio | Modo expandido, control explícito de artefactos |
| `/opsx:continue` | Crear el siguiente artefacto | Modo expandido, creación de artefactos paso a paso |
| `/opsx:ff` | Crear todos los artefactos de planificación | Modo expandido, alcance claro |
| `/opsx:apply` | Implementar tareas | Listo para escribir código |
| `/opsx:verify` | Validar la implementación | Modo expandido, antes de archivar |
| `/opsx:sync` | Fusionar especificaciones delta | Modo expandido, opcional |
| `/opsx:archive` | Completar el cambio | Todo el trabajo terminado |
| `/opsx:bulk-archive` | Archivar múltiples cambios | Modo expandido, trabajo paralelo |

## Próximos Pasos

- [Commands](commands.md) - Referencia completa de comandos con opciones
- [Concepts](concepts.md) - Análisis profundo de especificaciones, artefactos y esquemas
- [Customization](customization.md) - Crear flujos de trabajo personalizados