# Flujos de trabajo

Esta guía cubre patrones comunes de flujos de trabajo para OpenSpec y cuándo usar cada uno. Para la configuración básica, consulte [Primeros pasos](getting-started.md). Para la referencia de comandos, consulte [Comandos](commands.md).

## Filosofía: Acciones, no fases

Los flujos de trabajo tradicionales te obligan a pasar por fases: planificación, luego implementación, luego finalizado. Pero el trabajo real no encaja perfectamente en cajas.

OPSX adopta un enfoque diferente:

```text
Tradicional (bloqueado por fases):

  PLANIFICACIÓN ────────► IMPLEMENTACIÓN ────────► FINALIZADO
      │                    │
      │   "No se puede     │
      │    volver atrás"   │
      └────────────────────┘

OPSX (acciones fluidas):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Principios clave:**

- **Acciones, no fases** - Los comandos son cosas que puedes hacer, no etapas en las que estás atrapado.
- **Las dependencias son habilitadores** - Muestran qué es posible, no qué es lo siguiente requerido.

> **Personalización:** Los flujos de trabajo de OPSX se basan en esquemas que definen secuencias de artefactos. Consulte [Personalización](customization.md) para obtener detalles sobre la creación de esquemas personalizados.

## Dos Modos

### Ruta Rápida por Defecto (perfil `core`)

Las instalaciones nuevas usan por defecto `core`, que proporciona:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Flujo típico:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### Flujo de Trabajo Expandido/Completo (selección personalizada)

Si deseas comandos explícitos de scaffold y build (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), actívalos con:

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
     Listo para crear: proposal

Tú: /opsx:ff

IA:  Creando todos los artefactos de planificación...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     ¡Listo para implementación!

Tú: /opsx:apply

IA:  Trabajando en las tareas...
     ✓ Añadido botón de cierre de sesión al encabezado
     ✓ Implementada limpieza de sesión
     ✓ Añadido diálogo de confirmación
     ¡Todas las tareas completadas!

Tú: /opsx:archive

IA:  ✓ Especificaciones fusionadas
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

IA:  Déjame ayudarte a investigar...
     [Analiza tamaños de paquetes, identifica consultas lentas, revisa
     patrones de renderizado de componentes]

     Encontré tres cuellos de botella principales:
     1. Imágenes grandes no optimizadas
     2. Obtención de datos síncrona en ProductList
     3. Re-renderizados por cambios de contexto

     ¿Cuál te gustaría abordar primero?

Tú: Abordemos el problema de obtención de datos.

Tú: /opsx:new optimize-product-list-fetching

IA:  Cambio creado. Listo para crear: proposal

Tú: /opsx:continue

IA:  Creando propuesta basada en nuestra exploración...
     [Escribe la propuesta incorporando los hallazgos de la investigación]

     Listo para crear: specs, design
     ¿Cuál prefieres ahora?

Tú: /opsx:continue

IA:  Creando especificaciones...
```

**Ideal para:** Optimización de rendimiento, depuración, decisiones de arquitectura, requisitos poco claros.

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
Tú: Estoy trabajando en add-dark-mode pero me llamaron para corregir un error

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
     Retomando en la tarea 2.3: Actualizar Header...
```

**Ideal para:** Flujos de trabajo paralelos, interrupciones urgentes, colaboración en equipo.

Cuando tienes múltiples cambios completados, usa `/opsx:bulk-archive`:

```text
Tú: /opsx:bulk-archive

IA:  Encontrados 3 cambios completados:
     - add-dark-mode (todas las tareas hechas)
     - fix-login-redirect (todas las tareas hechas)
     - update-footer (todas las tareas hechas)

     Comprobando conflictos de especificaciones...
     ⚠ add-dark-mode y update-footer ambos tocan specs/ui/

     Inspeccionando la base de código para resolver...
     Ambos cambios están implementados. Se aplicarán en orden cronológico.

     ¿Archivar los 3 cambios?

Tú: Sí

IA:  ✓ Archivado add-dark-mode
     ✓ Archivado fix-login-redirect
     ✓ Archivado update-footer
     Especificaciones fusionadas en orden: add-dark-mode → update-footer
```

El archivo masivo detecta cuando múltiples cambios tocan las mismas especificaciones y resuelve conflictos verificando lo que realmente está implementado.

### Completar un Cambio

El flujo de finalización recomendado:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              valida la          solicita sincronizar
              implementación     si es necesario
```

#### Verificar: Revisa Tu Trabajo

`/opsx:verify` valida la implementación contra tus artefactos en tres dimensiones:

```text
Tú: /opsx:verify

IA:  Verificando add-auth...

     COMPLETITUD
     ✓ Las 12 tareas en tasks.md están marcadas
     ✓ Todos los requisitos en specs tienen código correspondiente
     ⚠ Escenario "Tiempo de sesión tras inactividad" no probado

     CORRECCIÓN
     ✓ La implementación coincide con la intención de la especificación
     ✓ Los casos límite de los escenarios están manejados
     ✓ Los estados de error coinciden con las definiciones de la especificación

     COHERENCIA
     ✓ Las decisiones de diseño se reflejan en la estructura del código
     ✓ Las convenciones de nombres son consistentes con design.md
     ⚠ El diseño menciona "basado en eventos" pero la implementación usa sondeo

     RESUMEN
     ─────────────────────────────
     Problemas críticos: 0
     Advertencias: 2
     Listo para archivar: Sí (con advertencias)

     Recomendaciones:
     1. Añadir prueba para el escenario de tiempo de sesión
     2. Considerar refactorizar a basado en eventos según el diseño, o actualizar design.md
```

**Qué verifica verify:**

| Dimensión | Lo que valida |
|-----------|---------------|
| Completitud | Todas las tareas hechas, todos los requisitos implementados, escenarios cubiertos |
| Corrección | La implementación coincide con la intención de la especificación, casos límite manejados |
| Coherencia | Decisiones de diseño reflejadas en el código, patrones consistentes |

Verify no bloqueará el archivo, pero expone problemas que podrías querer abordar primero.

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
     → ¿Te gustaría sincronizar ahora?

Tú: Sí

IA:  ✓ Especificaciones sincronizadas a openspec/specs/auth/spec.md
     ✓ Movido a openspec/changes/archive/2025-01-24-add-auth/

     Cambio archivado con éxito.
```

Archive solicitará si las especificaciones no están sincronizadas. No se bloqueará por tareas incompletas, pero te advertirá.

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

### Cuándo Actualizar vs Empezar de Cero

Una pregunta común: ¿cuándo está bien actualizar un cambio existente y cuándo deberías empezar uno nuevo?

**Actualiza el cambio existente cuando:**

- Misma intención, ejecución refinada
- El alcance se reduce (primero MVP, el resto después)
- Correcciones basadas en aprendizaje (la base de código no era lo que esperabas)
- Ajustes de diseño basados en descubrimientos de implementación

**Empieza un cambio nuevo cuando:**

- La intención cambió fundamentalmente
- El alcance se expandió a un trabajo completamente diferente
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
          ¿Misma intención?  >50% superposición?  ¿Puede el original
          ¿Mismo problema?   ¿Mismo alcance?      estar "hecho" sin
                 │                  │          estos cambios?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      SÍ                NO SÍ            NO  NO              SÍ
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
   ACTUALIZAR        NUEVO ACTUALIZAR   NUEVO ACTUALIZAR    NUEVO
```

**Ejemplo: "Añadir modo oscuro"**

- "También necesitamos soportar temas personalizados" → Cambio nuevo (el alcance se expandió)
- "La detección de preferencias del sistema es más difícil de lo esperado" → Actualizar (misma intención)
- "Vamos a lanzar el interruptor primero, añadir preferencias después" → Actualizar, luego archivar, luego cambio nuevo

## Mejores Prácticas

### Mantén los Cambios Enfocados

Una unidad lógica de trabajo por cambio. Si estás haciendo "añadir funcionalidad X y además refactorizar Y", considera dos cambios separados.

**Por qué importa:**
- Más fácil de revisar y entender
- Historial de archivo más limpio
- Se puede lanzar independientemente
- Reversión más simple si es necesario

### Usa `/opsx:explore` para Requisitos Poco Claros

Antes de comprometerte con un cambio, explora el espacio del problema:

```text
Tú: /opsx:explore

IA:  ¿Qué te gustaría explorar?

Tú: ¿Cómo deberíamos manejar el limitador de tasa para nuestra API?

IA:  Déjame investigar tu configuración actual y opciones...
     [Investiga la base de código, considera patrones]

     Veo tres enfoques que podríamos tomar:
     1. Basado en middleware (simple, por endpoint)
     2. Respaldado por Redis (escalable, estado compartido)
     3. Cubo de tokens por usuario (justo, complejo)

     Tu stack actual sugiere #1 o #2. ¿Cuál es tu escala?
```

La exploración aclara el pensamiento antes de crear artefactos.

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

Detecta discrepancias antes de cerrar el cambio.

### Nombra los Cambios Claramente

Los buenos nombres hacen que `openspec list` sea útil:

```text
Bueno:                         Evitar:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Referencia Rápida de Comandos

Para detalles completos de comandos y opciones, consulte [Comandos](commands.md).

| Comando | Propósito | Cuándo usar |
|---------|-----------|-------------|
| `/opsx:propose` | Crear cambio + artefactos de planificación | Ruta predeterminada rápida (perfil `core`) |
| `/opsx:explore` | Reflexionar sobre ideas | Requisitos poco claros, investigación |
| `/opsx:new` | Iniciar un andamiaje de cambio | Modo expandido, control explícito de artefactos |
| `/opsx:continue` | Crear el siguiente artefacto | Modo expandido, creación de artefactos paso a paso |
| `/opsx:ff` | Crear todos los artefactos de planificación | Modo expandido, alcance claro |
| `/opsx:apply` | Implementar tareas | Listo para escribir código |
| `/opsx:verify` | Validar la implementación | Modo expandido, antes de archivar |
| `/opsx:sync` | Fusionar especificaciones delta | Modo expandido, opcional |
| `/opsx:archive` | Completar el cambio | Todo el trabajo finalizado |
| `/opsx:bulk-archive` | Archivar múltiples cambios | Modo expandido, trabajo en paralelo |

## Próximos Pasos

- [Comandos](commands.md) - Referencia completa de comandos con opciones
- [Conceptos](concepts.md) - Profundización en especificaciones, artefactos y esquemas
- [Personalización](customization.md) - Crear flujos de trabajo personalizados