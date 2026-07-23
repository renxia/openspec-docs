# Flujos de trabajo

Esta guía cubre los patrones de flujo de trabajo comunes para OpenSpec y cuándo usar cada uno. Para la configuración básica, consulta [Primeros pasos](getting-started.md). Para la referencia de comandos, consulta [Comandos](commands.md).

## Filosofía: Acciones, no fases

Los flujos de trabajo tradicionales te obligan a seguir fases secuenciales: planificación, luego implementación, luego finalización. Pero el trabajo real no se ajusta perfectamente a cajas predefinidas.

OPSX adopta un enfoque diferente:

```text
Tradicional (bloqueado por fases):

  PLANIFICACIÓN ────────► IMPLEMENTACIÓN ────────► FINALIZACIÓN
      │                    │
      │   "No se puede volver atrás"  │
      └────────────────────┘

OPSX (acciones fluidas):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Principios clave:**

- **Acciones, no fases** - Los comandos son acciones que puedes realizar, no etapas en las que te quedas atascado
- **Las dependencias son habilitadores** - Muestran lo que es posible, no lo que se requiere a continuación

> **Personalización:** Los flujos de trabajo de OPSX se rigen por esquemas que definen las secuencias de artefactos. Consulta [Personalización](customization.md) para obtener detalles sobre la creación de esquemas personalizados.

## Dos Modos

### Ruta Rápida Predeterminada (perfil `core`)

Las nuevas instalaciones usan `core` de forma predeterminada, que proporciona:
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

#### Comienza explorando (el hábito que vale la pena formar)

`/opsx:explore` forma parte del perfil predeterminado, no es un complemento avanzado. Es el movimiento que debes hacer cuando tienes un problema pero aún no tienes un plan, lo que, con un asistente de IA, es la mayoría de las veces.

```text
Tú: /opsx:explore

IA:  ¿Qué te gustaría explorar?

Tú: Nuestros resultados de búsqueda parecen obsoletos. No estoy seguro de si es el almacenamiento en caché,
     la indexación o la consulta en sí.

IA:  Déjame revisar... [lee el servicio de búsqueda y la capa de caché]
     Es el índice: solo se reconstruye por las noches, por lo que las ediciones no aparecen hasta el día siguiente. Dos opciones: reconstruir al escribir (simple, más carga) o una invalidación de caché con TTL corto (más componentes, menos carga). Dado que tu volumen de escritura es bajo, la reconstrucción al escribir es la solución más limpia. ¿Quieres definir su alcance?

Tú: Sí.

Tú: /opsx:propose rebuild-search-index-on-write
```

Explorar no crea artefactos ni escribe código. Es una conversación gratuita y sin riesgos que convierte una preocupación vaga en un cambio preciso, por lo que la propuesta que sigue es clara. ¿Ya sabes exactamente lo que quieres? Sáltatelo y ve directamente a `/opsx:propose`. Guía completa: [Explora Primero](explore.md).

### Flujo de Trabajo Ampliado/Completo (selección personalizada)

Si quieres comandos explícitos de andamiaje y construcción (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), actívalos con:

```bash
openspec config profile
openspec update
```

## Patrones de Flujo de Trabajo (Modo Ampliado)

### Característica Rápida

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

IA:  Trabajando en las tareas...
     ✓ Añadido botón de cierre de sesión al encabezado
     ✓ Implementada la limpieza de sesión
     ✓ Añadido diálogo de confirmación
     ¡Todas las tareas completadas!

Tú: /opsx:archive

IA:  ✓ Especificaciones fusionadas
     ✓ Cambio archivado
```

**Ideal para:** Características pequeñas a medianas, correcciones de errores, cambios sencillos.

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

Tú: Vamos a abordar el problema de la obtención de datos.

Tú: /opsx:new optimize-product-list-fetching

IA:  Cambio creado. Listo para crear: propuesta

Tú: /opsx:continue

IA:  Creando propuesta basada en nuestra exploración...
     [Escribe propuesta incorporando los conocimientos de la investigación]

     Listo para crear: especificaciones, diseño
     ¿Cuál te gustaría a continuación?

Tú: /opsx:continue

IA:  Creando especificaciones...
```

**Ideal para:** Optimización del rendimiento, depuración, decisiones arquitectónicas, requisitos poco claros.

### Cambios Paralelos

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
Tú: Estoy trabajando en add-dark-mode pero me interrumpieron con una corrección de errores

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
     Continuando en la tarea 2.3: Actualizar Encabezado...
```

**Ideal para:** Flujos de trabajo paralelos, interrupciones urgentes, colaboración en equipo.

Cuando tengas múltiples cambios completados, usa `/opsx:bulk-archive`:

```text
Tú: /opsx:bulk-archive

IA:  Encontrados 3 cambios completados:
     - add-dark-mode (todas las tareas hechas)
     - fix-login-redirect (todas las tareas hechas)
     - update-footer (todas las tareas hechas)

     Verificando conflictos de especificaciones...
     ⚠ add-dark-mode y update-footer ambos tocan specs/ui/

     Inspeccionando la base de código para resolver...
     Ambos cambios están implementados. Se aplicarán en orden cronológico.

     ¿Archivar los 3 cambios?

Tú: Sí

IA:  ✓ add-dark-mode archivado
     ✓ fix-login-redirect archivado
     ✓ update-footer archivado
     Especificaciones fusionadas en orden: add-dark-mode → update-footer
```

El archivado masivo detecta cuando múltiples cambios tocan las mismas especificaciones y resuelve conflictos verificando lo que realmente está implementado.

### Completar un Cambio

El flujo de finalización recomendado:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valida          pregunta si sincronizar
              implementación     si es necesario
```

#### Verificar: Revisa tu Trabajo

`/opsx:verify` valida la implementación frente a tus artefactos en tres dimensiones:

```text
Tú: /opsx:verify

IA:  Verificando add-auth...

     COMPLETITUD
     ✓ Las 12 tareas en tasks.md están marcadas
     ✓ Todos los requisitos en las especificaciones tienen código correspondiente
     ⚠ Escenario "Tiempo de espera de sesión después de inactividad" no probado

     CORRECCIÓN
     ✓ La implementación coincide con la intención de la especificación
     ✓ Los casos límite de los escenarios están manejados
     ✓ Los estados de error coinciden con las definiciones de la especificación

     COHERENCIA
     ✓ Las decisiones de diseño se reflejan en la estructura del código
     ✓ Las convenciones de nomenclatura son consistentes con design.md
     ⚠ El diseño menciona "basado en eventos" pero la implementación usa sondeo

     RESUMEN
     ─────────────────────────────
     Problemas críticos: 0
     Advertencias: 2
     Listo para archivar: Sí (con advertencias)

     Recomendaciones:
     1. Añadir prueba para el escenario de tiempo de espera de sesión
     2. Considera refactorizar a basado en eventos como está diseñado, o actualiza design.md
```

**Qué verifica verify:**

| Dimensión | Qué valida |
|-----------|------------|
| Completitud | Todas las tareas hechas, todos los requisitos implementados, escenarios cubiertos |
| Corrección | La implementación coincide con la intención de la especificación, casos límite manejados |
| Coherencia | Decisiones de diseño reflejadas en el código, patrones consistentes |

Verify no bloqueará el archivado, pero muestra problemas que quizás quieras abordar primero.

#### Archivar: Finalizar el Cambio

`/opsx:archive` completa el cambio y lo mueve al archivo:

```text
Tú: /opsx:archive

IA:  Archivando add-auth...

     Estado de los artefactos:
     ✓ proposal.md existe
     ✓ specs/ existe
     ✓ design.md existe
     ✓ tasks.md existe (12/12 tareas completadas)

     Especificaciones delta: Aún no sincronizadas con main
     → ¿Quieres sincronizar ahora?

Tú: Sí

IA:  ✓ Especificaciones sincronizadas en openspec/specs/auth/spec.md
     ✓ Movido a openspec/changes/archive/2025-01-24-add-auth/

     Cambio archivado exitosamente.
```

Archive te preguntará si las especificaciones no están sincronizadas. No bloqueará por tareas incompletas, pero te advertirá.

## Cuándo Usar Qué

### `/opsx:ff` vs `/opsx:continue`

| Situación | Usar |
|-----------|------|
| Requisitos claros, listo para construir | `/opsx:ff` |
| Explorando, quieres revisar cada paso | `/opsx:continue` |
| Quieres iterar en la propuesta antes de las especificaciones | `/opsx:continue` |
| Presión de tiempo, necesitas avanzar rápido | `/opsx:ff` |
| Cambio complejo, quieres control | `/opsx:continue` |

**Regla general:** Si puedes describir el alcance completo de antemano, usa `/opsx:ff`. Si lo estás descubriendo sobre la marcha, usa `/opsx:continue`.

### Cuándo Actualizar vs Empezar de Nuevo

Una pregunta común: ¿cuándo está bien actualizar un cambio existente y cuándo deberías empezar uno nuevo?

**Actualiza el cambio existente cuando:**

- Misma intención, ejecución refinada
- El alcance se reduce (MVP primero, el resto después)
- Correcciones basadas en aprendizaje (la base de código no es lo que esperabas)
- Ajustes de diseño basados en descubrimientos de la implementación

**Empieza un cambio nuevo cuando:**

- La intención cambió fundamentalmente
- El alcance explotó a un trabajo completamente diferente
- El cambio original se puede marcar como "hecho" de forma independiente
- Los parches confundirían más que aclarar

```text
                     ┌─────────────────────────────────────┐
                     │     ¿Es el mismo trabajo?           │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ¿Misma          ¿Más del 50%       ¿Se puede marcar
          intención?      de coincidencia?   el original como
          ¿Mismo          ¿Mismo alcance?    "hecho" sin
          problema?                           estos cambios?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      SÍ               NO  SÍ           NO  NO              SÍ
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    ACTUALIZAR        NUEVO ACTUALIZAR   NUEVO ACTUALIZAR    NUEVO
```

**Ejemplo: "Añadir modo oscuro"**

- "Necesitas también soportar temas personalizados" → Nuevo cambio (alcance explotó)
- "La detección de preferencias del sistema es más difícil de lo esperado" → Actualizar (misma intención)
- "Vamos a enviar el interruptor primero, añadir preferencias después" → Actualizar luego archivar, luego nuevo cambio

## Mejores Prácticas

### Mantén los Cambios Centrados

Una unidad lógica de trabajo por cambio. Si estás haciendo "añadir característica X y también refactorizar Y", considera dos cambios separados.

**Por qué importa:**
- Más fácil de revisar y entender
- Historial de archivo más limpio
- Se puede enviar de forma independiente
- Retroceso más simple si es necesario

### Usa `/opsx:explore` para Requisitos Poco Claros

Antes de comprometerte con un cambio, explora el espacio del problema:

```text
Tú: /opsx:explore

IA:  ¿Qué te gustaría explorar?

Tú: ¿Cómo deberíamos manejar la limitación de velocidad para nuestra API?

IA:  Déjame investigar tu configuración actual y opciones...
     [Investiga la base de código, considera patrones]

     Veo tres enfoques que podríamos tomar:
     1. Basado en middleware (simple, por endpoint)
     2. Con respaldo en Redis (escalable, estado compartido)
     3. Cubo de fichas por usuario (justo, complejo)

     Tu stack actual sugiere el #1 o #2. ¿Cuál es tu escala?
```

La exploración aclara el pensamiento antes de que crees artefactos.

### Verifica Antes de Archivar

Usa `/opsx:verify` para verificar que la implementación coincida con los artefactos:

```text
Tú: /opsx:verify

IA:  Verificando add-dark-mode...

     ✓ Todas las tareas en tasks.md están marcadas
     ✓ Los requisitos en las especificaciones tienen código correspondiente
     ✓ Las decisiones de diseño se reflejan en la implementación

     ¡Listo para archivar!
```

Detecta discrepancias antes de que cierres el cambio.

### Nombra los Cambios Claramente

Los buenos nombres hacen que `openspec list` sea útil:

| Bueno: | Evita: |
|--------|--------|
| add-dark-mode | feature-1 |
| fix-login-redirect | update |
| optimize-product-query | changes |
| implement-2fa | wip |

## Referencia Rápida de Comandos

Para ver todos los detalles y opciones de los comandos, consulta [Comandos](commands.md).

| Comando | Propósito | Cuándo usarlo |
|---------|-----------|---------------|
| `/opsx:propose` | Crear artefactos de cambio y planificación | Ruta predeterminada rápida (perfil `core`) |
| `/opsx:explore` | Analizar ideas con la IA | Empieza aquí si tienes dudas: requisitos poco claros, investigación, comparación de opciones |
| `/opsx:new` | Iniciar el andamiaje de un cambio | Modo ampliado, control explícito de artefactos |
| `/opsx:continue` | Crear el siguiente artefacto | Modo ampliado, creación de artefactos paso a paso |
| `/opsx:ff` | Crear todos los artefactos de planificación | Modo ampliado, alcance definido |
| `/opsx:apply` | Implementar tareas | Listo para escribir código |
| `/opsx:verify` | Validar la implementación | Modo ampliado, antes de archivar |
| `/opsx:sync` | Combinar especificaciones delta | Modo ampliado, opcional |
| `/opsx:archive` | Finalizar el cambio | Todo el trabajo finalizado |
| `/opsx:bulk-archive` | Archivar múltiples cambios | Modo ampliado, trabajo en paralelo |

## Próximos Pasos

- [Redacción de Buenas Especificaciones](writing-specs.md) - Aspectos que debe tener un requisito y un escenario sólidos, y cómo dimensionar correctamente un cambio
- [Revisión de un Cambio](reviewing-changes.md) - Repaso rápido de dos minutos a un plan borrador antes de escribir cualquier código
- [OpenSpec en Equipo](team-workflow.md) - Cómo se integran los cambios con las ramas y las solicitudes de extracción
- [Comandos](commands.md) - Referencia completa de comandos con opciones
- [Conceptos](concepts.md) - Análisis detallado de especificaciones, artefactos y esquemas
- [Personalización](customization.md) - Crea flujos de trabajo personalizados