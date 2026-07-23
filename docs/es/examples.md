# Ejemplos y recetas

Cambios reales, de principio a fin. Cada receta muestra los comandos que escribirías y lo que verías como respuesta, para que puedas comparar tu situación con un patrón y copiarlo. Estas usan los comandos **principales** predeterminados (`propose`, `explore`, `apply`, `sync`, `archive`); cuando el conjunto ampliado es útil, se indica.

Un recordatorio antes de empezar: los comandos con barra como `/opsx:propose` se escriben en el **chat de tu asistente de IA**, y los comandos `openspec` se ejecutan en tu **terminal**. Si esto es nuevo para ti, lee primero [Cómo funcionan los comandos](how-commands-work.md). En las transcripciones de abajo, `You:` y `AI:` corresponden al chat, y las líneas que empiezan por `$` son la terminal.

> **¿Aún no sabes qué vas a construir?** La mayoría de estas recetas son más efectivas si empiezas por `/opsx:explore` para pensarlo bien primero. La [Receta 3](#recipe-3-exploring-before-you-commit) lo muestra en acción, y la guía [Explorar primero](explore.md) expone el argumento completo.

## Receta 1: Una funcionalidad pequeña, la ruta rápida

**Cuándo usarla:** sabes lo que quieres y es una pieza de trabajo acotada. Esta es la receta más común.

Todo se reduce a tres comandos: proponer, construir, archivar.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Ahora lee el plan. Abre la propuesta y la especificación delta. Este es el momento para el que está diseñado OpenSpec: detectar una suposición errónea mientras sigue siendo un párrafo, no 400 líneas de código. Edita cualquier artefacto directamente si algo no encaja, y luego continúa.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

Eso es todo. El comportamiento de cierre de sesión ahora forma parte de tus especificaciones, y el cambio se archiva con todo su contexto.

## Receta 2: Corrección de errores

**Cuándo usarla:** algo está roto y quieres que la corrección quede registrada como un cambio deliberado de comportamiento, no como un commit sin explicación.

Las correcciones de errores funcionan exactamente igual que las funcionalidades. La diferencia está en cómo redactas la propuesta: describe el comportamiento *correcto*, no solo "corrige el error".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Como la corrección se implementa como un requisito `MODIFIED` con un escenario nuevo, la siguiente persona (o la siguiente sesión de IA) no solo verá que lo has corregido, sino qué significa "correcto". Después, ejecuta `/opsx:apply` y `/opsx:archive` como de costumbre.

Consejo: para una corrección, un buen escenario es la prueba de regresión en prosa. "DADO un usuario sin sesión iniciada, CUANDO envía credenciales válidas, ENTONCES accede al panel de control y no se le redirige de nuevo". Escribe eso y la implementación tendrá un objetivo claro.

## Receta 3: Explorar antes de comprometerte

**Cuándo usarla:** tienes un problema pero aún no tienes un plan. No sabes qué construir, o qué enfoque es el adecuado.

Empieza por `/opsx:explore`. Es un compañero de reflexión sin estructura y sin crear artefactos. Lee tu base de código y te ayuda a decidir.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

La exploración aclara tu pensamiento *antes* de gastar un cambio en ello. Cuando la idea se cristalice, propón el cambio y la IA mantiene el contexto para seguir.

## Receta 4: Gestionar dos cambios a la vez

**Cuándo usarla:** estás en medio de una funcionalidad y una corrección urgente se adelanta en la cola.

Los cambios son carpetas independientes, así que el trabajo en paralelo no genera conflictos. Empieza la corrección, envíala y vuelve a la funcionalidad justo donde la dejaste.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Indicar el nombre del cambio en `/opsx:apply add-dark-mode` es la forma de apuntar a la IA a un cambio concreto cuando hay más de uno activo. Como las tareas registran el progreso en `tasks.md`, la IA sabe exactamente dónde te quedaste.

Cuando hay varios cambios terminados a la vez, el comando ampliado `/opsx:bulk-archive` los archiva conjuntamente y resuelve los conflictos de especificaciones comprobando lo que está realmente implementado. Consulta [Flujos de trabajo](workflows.md#parallel-changes).

## Receta 5: Una refactorización sin cambios de comportamiento

**Cuándo usarla:** estás reestructurando código y el comportamiento visible desde el exterior debe permanecer idéntico.

Este es el caso interesante, porque una refactorización pura no tiene *nada que añadir a tus especificaciones*. El contrato de comportamiento no cambia; solo cambia la implementación. Así que el trabajo se limita al diseño y las tareas, y el delta de especificaciones está vacío o no existe.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Declara el delta vacío explícitamente estableciendo `skip_specs: true` en el archivo `.openspec.yaml` del cambio:

```yaml
schema: spec-driven
skip_specs: true
```

Sin el marcador, `openspec validate` rechaza un cambio con cero deltas (así se detecta una fase de especificaciones olvidada); con él, la validación pasa y `openspec status` muestra la etapa de especificaciones como omitida explícitamente en lugar de pendiente. Si al final la refactorización resulta que cambia el comportamiento, elimina `skip_specs` de `.openspec.yaml` y escribe las especificaciones delta: la validación trata el marcador más los archivos de especificaciones como un conflicto, así que el marcador obsoleto no puede permanecer silenciosamente.

Archivar un cambio marcado no necesita indicadores adicionales (no hay deltas que fusionar). Por separado, el indicador `--skip-specs` le indica al comando de terminal que omita explícitamente el paso de especificaciones:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Este mismo indicador es útil para herramientas, CI y cambios solo de documentación. El principio es: las especificaciones describen el comportamiento, así que si el comportamiento no cambia, la especificación tampoco debería hacerlo. Consulta [Conceptos](concepts.md#what-a-spec-is-and-is-not).

## Receta 6: Control paso a paso (comandos ampliados)

**Cuándo usarla:** un cambio complejo o arriesgado en el que quieres revisar cada artefacto antes de pasar al siguiente.

El comando principal `/opsx:propose` redacta todo de una vez. Cuando prefieras ir paso a paso, activa los comandos ampliados:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Ahora puedes crear la estructura y construir de forma incremental:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Revisa cada artefacto a medida que se genera, edítalo libremente y continúa cuando estés satisfecho. Cuando quieras redactar el resto de una vez, `/opsx:ff` avanza rápidamente por los artefactos de planificación restantes. Antes de archivar, `/opsx:verify` comprueba que la implementación coincide realmente con las especificaciones. Consulta [Flujos de trabajo](workflows.md#opsxff-vs-opsxcontinue).

## Receta 7: Aprender todo el ciclo de forma práctica

**Cuándo usarla:** has instalado OpenSpec y quieres *sentir* el flujo de trabajo con tu propio código, no con un ejemplo de juguete.

Activa los comandos ampliados (consulta la Receta 6) y luego:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` encuentra una mejora real (pequeña), crea un cambio para ella, lo implementa y lo archiva, narrando cada paso. Tarda entre 15 y 30 minutos y te deja con un cambio real que puedes conservar o descartar. Es la forma más suave de aprender. Consulta [Comandos](commands.md#opsxonboard).

## Comprobar tu trabajo desde la terminal

En cualquier momento, desde tu terminal, puedes inspeccionar el estado de las cosas:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Estas son herramientas de lectura e inspección. La propuesta y la construcción siguen realizándose mediante comandos con barra en el chat. Todos los detalles en la [Referencia de la CLI](cli.md).

## Por dónde seguir

- [Explorar primero](explore.md): la forma recomendada de empezar cuando no estás seguro
- [Flujos de trabajo](workflows.md): los patrones anteriores, con orientación para decidir cuándo usar cada uno
- [Comandos](commands.md): todos los comandos con barra en detalle
- [Primeros pasos](getting-started.md): la guía canónica paso a paso para tu primer cambio
- [Conceptos](concepts.md): por qué las piezas encajan de la forma en que lo hacen