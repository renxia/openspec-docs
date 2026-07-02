# Ejemplos y Recetas

Cambios reales, de principio a fin. Cada receta muestra los comandos que debes escribir y lo que verás como respuesta, para que puedas comparar tu situación con un patrón y copiarlo. Estos utilizan los comandos predeterminados **core** (`propose`, `explore`, `apply`, `sync`, `archive`); si se necesita el conjunto expandido, se indica.

Un recordatorio antes de empezar: los comandos de barra como `/opsx:propose` van en el **chat del asistente de IA**, y los comandos `openspec` van en tu **terminal**. Si esto es nuevo para ti, lee primero [Cómo funcionan los Comandos](how-commands-work.md). En las transcripciones a continuación, `You:` (Tú:) y `AI:` (IA:) son el chat, y las líneas que comienzan con `$` son la terminal.

> **¿No estás seguro de lo que estás construyendo aún?** La mayoría de estas recetas son más claras si empiezas con `/opsx:explore` para pensarlo primero. [Receta 3](#recipe-3-exploring-before-you-commit) lo muestra en acción, y la guía [Explorar Primero](explore.md) presenta el caso completo.

## Receta 1: Una pequeña funcionalidad, la vía rápida

**Cuándo usarla:** sabes lo que quieres y es una pieza de trabajo contenida. Esta es la receta más común.

Todo el proceso consta de tres comandos. Proponer, construir, archivar.

```text
You: /opsx:propose add-logout-button

AI:  Creado openspec/changes/add-logout-button/
     ✓ proposal.md — por qué y qué
     ✓ specs/      — el nuevo requisito y sus escenarios
     ✓ design.md   — enfoque técnico
     ✓ tasks.md    — lista de verificación de implementación
     Listo para la implementación. Ejecuta /opsx:apply.
```

Ahora lee el plan. Abre la propuesta y el delta spec. Este es el momento para el que OpenSpec esté construido: detectar una suposición incorrecta mientras aún está en un párrafo, no en 400 líneas de código. Edita cualquier artefacto directamente si algo anda mal, y luego continúa.

```text
You: /opsx:apply

AI:  Trabajando a través de las tareas...
     ✓ 1.1 Añadir botón de cierre de sesión al encabezado
     ✓ 1.2 Limpiar la sesión al hacer clic
     ✓ 1.3 Añadir diálogo de confirmación
     ¡Todas las tareas completadas!

You: /opsx:archive

AI:  Archivando add-logout-button...
     ✓ Especificaciones fusionadas en openspec/specs/auth/spec.md
     ✓ Movido a openspec/changes/archive/2026-06-22-add-logout-button/
     Hecho. Listo para el siguiente cambio.
```

Eso es todo. El comportamiento de cierre de sesión ahora forma parte de tus especificaciones, y el cambio está archivado con su contexto completo.

## Receta 2: Una corrección de errores (bug fix)

**Cuándo usarla:** algo está roto y quieres que la solución quede registrada como un cambio deliberado en el comportamiento, no como un commit misterioso.

Las correcciones de errores funcionan exactamente igual que las funcionalidades. La diferencia radica en cómo enmarcas la propuesta: describe el comportamiento *correcto*, no solo "arreglar el error".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Creado openspec/changes/fix-login-redirect-loop/
     La propuesta captura el comportamiento roto actual y el
     comportamiento pretendido. El delta spec MODIFICA el requisito de redirección
     para que sea preciso y testeable.
     Listo para la implementación.
```

Dado que la corrección se registra como un requisito `MODIFIED` con un escenario fresco, la siguiente persona (o la próxima sesión de IA) no solo ve que lo arreglaste, sino qué significa "correcto". Luego `/opsx:apply` y `/opsx:archive` como siempre.

Consejo: para una corrección, un buen escenario es la prueba de regresión en prosa. "DADO un usuario sin iniciar sesión, CUANDO envía credenciales válidas, ENTONCES aterriza en el panel de control y no es redirigido de nuevo." Escribe eso, y la implementación tendrá un objetivo claro.

## Receta 3: Explorar antes de comprometerse

**Cuándo usarla:** tienes un problema pero aún no un plan. No estás seguro de qué construir o qué enfoque es el correcto.

Empieza con `/opsx:explore`. Es un compañero de pensamiento sin estructura y sin artefactos creados. Lee tu base de código y te ayuda a decidir.

```text
You: /opsx:explore

AI:  ¿Qué te gustaría explorar?

You: Las páginas tardan en cargar, pero no sé dónde se va el tiempo.

AI:  Déjame mirar... Encontré tres culpables probables:
     1. Imágenes grandes y sin optimizar en la lista de productos
     2. Obtención sincrónica de datos que bloquea la renderización
     3. Re-renderizados desencadenados por cambios de contexto
     ¿Qué deberíamos abordar primero?

You: El de la obtención de datos.

You: /opsx:propose optimize-product-list-fetching

AI:  Creado el cambio, con una propuesta informada por lo que acabamos de encontrar. Listo para la implementación.
```

La exploración aclara tu pensamiento *antes* de gastar un cambio en ello. Cuando la idea se cristaliza, propónlo y la IA lleva el contexto hacia adelante.

## Receta 4: Manejar dos cambios a la vez

**Cuándo usarla:** estás a mitad de una funcionalidad y una corrección urgente salta la cola.

Los cambios son carpetas independientes, por lo que el trabajo paralelo no entra en conflicto. Inicia la corrección, envíala (ship it), y luego vuelve a la funcionalidad justo donde lo dejaste.

```text
You: Estoy a medio camino de add-dark-mode, pero necesito arreglar un bug de inicio de sesión ahora.

You: /opsx:propose fix-login-redirect

AI:  Creado openspec/changes/fix-login-redirect/. Listo para la implementación.

You: /opsx:apply

AI:  Implementado la corrección. Todas las tareas completadas.

You: /opsx:archive

AI:  ✓ Archivado fix-login-redirect.

You: Volviendo a dark mode.

You: /opsx:apply add-dark-mode

AI:  Reanudando add-dark-mode. Retomando en la tarea 2.3: Actualizar el Encabezado...
```

Nombrar el cambio en `/opsx:apply add-dark-mode` es cómo le indicas a la IA un cambio específico cuando hay más de uno activo. Dado que las tareas rastrean la finalización en `tasks.md`, la IA sabe exactamente dónde te detuviste.

Cuando varios cambios se completan a la vez, el expandido `/opsx:bulk-archive` los archiva juntos y resuelve conflictos de especificaciones comprobando lo que está implementado realmente. Consulta [Flujos de trabajo](workflows.md#parallel-changes).

## Receta 5: Un refactor sin cambio de comportamiento

**Cuándo usarla:** estás reestructurando código y el comportamiento visible externamente debe permanecer idéntico.

Este es el caso interesante, porque un refactor puro *no tiene nada que añadir a tus especificaciones*. El contrato de comportamiento no cambia; solo la implementación lo hace. Por lo tanto, el trabajo reside en el diseño y las tareas, y el delta de la especificación está vacío o ausente.

```text
You: /opsx:propose refactor-payment-module

AI:  Creado el cambio. La propuesta establece el objetivo (dividir el módulo de pago, sin cambio de comportamiento) y el diseño captura la nueva estructura. Sin cambios en las especificaciones, ya que el comportamiento es idéntico. Listo para la implementación.
```

Cuando archivas un cambio que no toca las especificaciones, puedes indicarle al comando de terminal que omita el paso de la especificación:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

La misma bandera es útil para herramientas, CI y cambios solo de documentación. El principio es: las especificaciones describen el comportamiento, por lo tanto si el comportamiento no cambió, la especificación tampoco debería cambiar. Consulta [Conceptos](concepts.md#what-a-spec-is-and-is-not).

## Receta 6: Control paso a paso (comandos expandidos)

**Cuándo usarla:** un cambio complejo o arriesgado en el que quieres revisar cada artefacto antes de continuar.

El `/opsx:propose` core redacta todo a la vez. Cuando prefieres ir paso a paso, activa los comandos expandidos:

```bash
$ openspec config profile      # selecciona los flujos de trabajo expandidos
$ openspec update              # aplícalos a este proyecto
```

Ahora puedes crear y construir incrementalmente:

```text
You: /opsx:new add-2fa

AI:  Creado openspec/changes/add-2fa/. Listo para crear: proposal.

You: /opsx:continue

AI:  Creado proposal.md. Ahora disponibles: specs, design.

You: /opsx:continue

AI:  Creado specs/auth/spec.md. Ahora disponible: design.
```

Revisa cada artefacto a medida que aparece, edita libremente y continúa cuando estés satisfecho. Cuando quieres que el resto se redacte de una vez, `/opsx:ff` avanza rápidamente a través de los artefactos de planificación restantes. Antes de archivar, `/opsx:verify` comprueba que la implementación coincide con las especificaciones. Consulta [Flujos de trabajo](workflows.md#opsxff-vs-opsxcontinue).

## Receta 7: Aprender el ciclo completo en la práctica

**Cuándo usarla:** has instalado OpenSpec y quieres *sentir* el flujo de trabajo en tu propio código, no en un ejemplo de juguete.

Activa los comandos expandidos (consulta la Receta 6), y luego:

```text
You: /opsx:onboard

AI:  ¡Bienvenido a OpenSpec! Te guiaré a través de un cambio completo usando tu base de código real. Déjame buscar una pequeña mejora segura que podamos hacer juntos...
```

`/opsx:onboard` encuentra una mejora real (pequeña), crea un cambio para ella, lo implementa y lo archiva, narrando cada paso. Tarda entre 15 y 30 minutos y te deja con un cambio real que puedes conservar o descartar. Es la forma más suave de aprender. Consulta [Comandos](commands.md#opsxonboard).

## Comprobando tu trabajo desde la terminal

En cualquier momento, desde tu terminal, puedes inspeccionar el estado de las cosas:

```bash
$ openspec list                      # cambios activos
$ openspec show add-dark-mode        # un cambio en detalle
$ openspec validate add-dark-mode    # comprobar la estructura
$ openspec view                      # panel interactivo
```

Estas son herramientas de lectura e inspección. La propuesta y la construcción siguen ocurriendo a través de comandos de barra en el chat. Detalles completos en [Referencia CLI](cli.md).

## A dónde ir después

- [Explorar Primero](explore.md): la forma recomendada de empezar cuando no estás seguro
- [Flujos de trabajo](workflows.md): los patrones anteriores, con guía de decisión sobre cuándo usar cada uno
- [Comandos](commands.md): cada comando de barra en detalle
- [Empezar](getting-started.md): el recorrido canónico del primer cambio
- [Conceptos](concepts.md): por qué las piezas encajan de la manera en que lo hacen