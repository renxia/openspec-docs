# Editar e iterar sobre un cambio

**Cada artefacto en un cambio es simplemente un archivo Markdown que puedes editar en cualquier momento.** No hay una "fase de planificación" bloqueada, no hay una puerta de aprobación, no hay un modo de edición especial para ingresar. ¿Quieres cambiar la propuesta después de haber comenzado a construir? Abre `proposal.md` y cámbiala. ¿Te diste cuenta de que el diseño es incorrecto a mitad de la implementación? Corrige `design.md` y sigue adelante. Esa es toda la respuesta, y es así por diseño.

Esta página es para el momento en que piensas "espera, ¿puedo volver atrás y cambiar eso?". Sí. Aquí te explicamos cómo, para cada caso común.

## Dos formas de editar cualquier cosa

Siempre tienes ambas opciones:

1. **Edita el archivo directamente.** Los artefactos son archivos Markdown simples en `openspec/changes/<name>/`. Abre `proposal.md`, `design.md`, `tasks.md` o una especificación delta en `specs/` en tu editor y cámbialo. No se requiere nada más.

2. **Pide a tu IA que lo revise.** En el chat, simplemente di lo que quieres: "Actualiza la propuesta para eliminar la idea de caché y agregar una sección de límite de tasa", o "el diseño debería usar una cola, no sondeo". La IA edita el artefacto por ti, usando el resto del cambio como contexto.

Usa la que se adapte al momento. ¿Un pequeño ajuste de redacción? Edita el archivo. ¿Una reconsideración sustancial? Deja que la IA lo revise con contexto completo.

## "¿Cómo actualizo la propuesta (o las especificaciones) después de haber comenzado?"

Simplemente actualízala. El mismo cambio, refinado.

Si estás usando los comandos expandidos, el flujo natural es: edita el artefacto, luego ejecuta `/opsx:continue` para continuar desde el nuevo estado, o `/opsx:apply` para seguir implementando según el plan actualizado. Si estás en los comandos `core` predeterminados, edita el artefacto y ejecuta `/opsx:apply`; lee los archivos actuales, por lo que construye según lo que los artefactos digan ahora.

El modelo mental: los artefactos son el plan en vivo, no un contrato firmado. La IA siempre trabaja a partir de su contenido actual, por lo que editarlos dirige el trabajo.

```text
Tú: Quiero cambiar el enfoque de este cambio.

Tú: [edita design.md, o dile a la IA:]
     Actualiza design.md para usar un trabajo en segundo plano en lugar de una llamada síncrona.

IA:  Actualicé design.md. La lista de tareas sigue siendo válida; ¿quieres que continúe aplicando?

Tú: /opsx:apply
```

Esto responde a una pregunta muy común: no hay un comando separado de "actualizar propuesta" porque no lo necesitas. El archivo es la fuente de verdad, y editarlo (a mano o mediante la IA) es la actualización.

## "¿Cómo vuelvo a revisar después de implementar?"

No tienes que "volver atrás", porque nunca te fuiste. El flujo de trabajo es fluido: revisión, edición e implementación no son fases secuenciales de las que estás atrapado.

Concretamente, después de algo de trabajo con `/opsx:apply`:

- ¿Quieres volver a examinar el plan? Abre los artefactos y léelos, o ejecuta `openspec show <change>` en tu terminal para obtener una vista consolidada.
- ¿Encontraste algo para cambiar? Edita el artefacto (o pide a la IA que lo haga), luego continúa.
- ¿Quieres una verificación estructurada de que el código coincide con el plan? Ejecuta `/opsx:verify` (comando expandido). Informa sobre completitud, corrección y coherencia sin bloquear nada. Consulta [Flujos de trabajo: Verificar](workflows.md#verify-check-your-work).

No hay una "fase de revisión" a la que volver, porque la revisión es algo que puedes hacer en cualquier momento, incluso después de la implementación.

## "Edité el código a mano. ¿Cómo lo reconcilio con OpenSpec?"

Esto sucede constantemente y está bien. Modificaste algo en tu editor, y ahora el código y los artefactos no coinciden. Vuelve a sincronizarlos en la dirección que sea verdadera:

- **El código ahora es correcto, la especificación está obsoleta.** Actualiza la especificación delta (y las tareas, si es relevante) para describir el comportamiento que realmente enviaste. La especificación debe coincidir con la realidad antes de archivar, porque al archivar se fusiona la especificación en tu fuente de verdad.
- **La especificación es correcta, el código se desvió.** Sigue construyendo o corrigiendo hasta que el código coincida con la especificación.

Una forma rápida de detectar discrepancias es `/opsx:verify`: lee tus artefactos y tu código y te dice dónde divergen. Considera su resultado como una lista de tareas pendientes para la reconciliación, luego archiva cuando estén de acuerdo.

El principio: en el momento de archivar, tus especificaciones se convierten en la verdad registrada. Así que antes de archivar, haz que las especificaciones sean honestas sobre lo que hace el código. Las ediciones manuales son bienvenidas; solo no permitas que des sincronicen la especificación silenciosamente.

## Refinar una propuesta que no te satisface

Si una propuesta generada no da en el blanco, tienes tres buenas opciones:

- **Iterar en el lugar.** Dile a la IA qué está mal ("el alcance es demasiado amplio, elimina las funciones de administración") y deja que lo revise. Es la opción más económica y generalmente la correcta.
- **Explorar primero, luego volver a proponer.** Si el problema es que la idea misma no está clara, retrocede a `/opsx:explore`, piénsalo bien y deja que salga una propuesta más precisa de eso. Consulta [Explorar primero](explore.md).
- **Empezar de nuevo.** Si la intención ha cambiado fundamentalmente, un nuevo cambio puede ser más claro que parchear el anterior.

Esa última opción tiene su propia guía de decisión, a continuación.

## Cuándo actualizar vs. empezar un cambio nuevo

Versión corta: **actualiza cuando sea el mismo trabajo refinado; empieza uno nuevo cuando la intención haya cambiado fundamentalmente o el alcance se haya expandido en un trabajo diferente.**

- ¿Mismo objetivo, mejor enfoque? Actualiza.
- ¿Reducción de alcance (envía el MVP ahora, más después)? Actualiza, luego archiva, luego un cambio nuevo para la fase dos.
- ¿El problema mismo cambió ("agregar modo oscuro" se convirtió en "construir un sistema de temas completo")? Cambio nuevo.

Hay un diagrama de flujo completo y ejemplos prácticos en [Flujos de trabajo: Cuándo actualizar vs. empezar de nuevo](workflows.md#when-to-update-vs-start-fresh) y un tratamiento más profundo en [OPSX: Cuándo actualizar vs. Empezar de nuevo](opsx.md#when-to-update-vs-start-fresh).

## Una nota sobre las tareas

`tasks.md` es una lista de verificación viva, no un plan congelado. A medida que implementas, puedes agregar tareas que descubras, eliminar las que resultaron innecesarias, o reordenarlas. La IA marca los elementos como completados a medida que los finaliza durante `/opsx:apply`, y reanuda desde la primera tarea sin marcar si vuelves más tarde. Editar la lista en pleno vuelo es lo esperado.

## Dónde ir a continuación

- [Flujos de trabajo](workflows.md) - patrones, además de la guía de decisión de actualizar vs. nuevo
- [Revisar un cambio](reviewing-changes.md) - la revisión de dos minutos de un plan antes de construirlo
- [Explorar primero](explore.md) - el lugar al que retroceder cuando una idea necesita ser repensada
- [Comandos](commands.md) - `/opsx:continue`, `/opsx:apply` y `/opsx:verify` en detalle
- [Conceptos: Artefactos](concepts.md#artifacts) - para qué sirve cada artefacto