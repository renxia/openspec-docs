# Editando e Iterando un Cambio

**Cada artefacto en un cambio es simplemente un archivo Markdown que puedes editar en cualquier momento.** No hay una "fase de planificación" bloqueada, ni un portal de aprobación, ni un modo de edición especial para entrar. ¿Quieres cambiar la propuesta después de haber empezado a construir? Abre `proposal.md` y cámbialo. ¿Te has dado cuenta de que el diseño es incorrecto a mitad de la implementación? Arregla `design.md` y sigue adelante. Esa es la respuesta completa, y es intencional.

Esta página es para el momento en que piensas: "Espera, ¿puedo volver atrás y cambiar eso?". Sí. Así es cómo hacerlo, para cada caso común.

## Dos formas de editar cualquier cosa

Siempre tienes ambas opciones:

1. **Editar el archivo directamente.** Los artefactos son Markdown plano dentro de `openspec/changes/<name>/`. Abre `proposal.md`, `design.md`, `tasks.md` o una especificación delta bajo `specs/` en tu editor y cámbialo. Nada más se requiere.

2. **Pedirle a tu IA que lo revise.** En el chat, solo di lo que quieres: "Actualiza la propuesta para eliminar la idea de caché y añadir una sección de límite de tasa," o "el diseño debe usar una cola, no sondeo (polling)." La IA edita el artefacto por ti, usando el resto del cambio como contexto.

Usa la que mejor se adapte al momento. ¿Un pequeño ajuste en la redacción? Edita el archivo. ¿Una reconsideración sustancial? Deja que la IA revise con el contexto completo.

## "¿Cómo actualizo la propuesta (o las especificaciones) después de haber empezado?"

Simplemente actualízala. El mismo cambio, refinado.

Si estás usando los comandos expandidos, el flujo natural es: edita el artefacto y luego ejecuta `/opsx:continue` para continuar desde el nuevo estado, o `/opsx:apply` para seguir implementando contra el plan actualizado. Si estás en los comandos predeterminados `core`, edita el artefacto y ejecuta `/opsx:apply`; lee los archivos actuales, por lo que construye basándose en lo que dicen los artefactos.

El modelo mental es: los artefactos son el plan vivo, no un contrato firmado. La IA siempre trabaja a partir de su contenido actual, por lo que editarlos dirige el trabajo.

```text
Tú: Quiero cambiar el enfoque en este cambio.

Tú: [editar design.md, o decirle a la IA:]
     Actualiza design.md para usar una tarea en segundo plano en lugar de una llamada síncrona.

IA:  design.md actualizado. La lista de tareas sigue siendo adecuada; ¿quieres que continúe aplicando?

Tú: /opsx:apply
```

Esto responde a una pregunta muy común: no hay un comando separado de "actualizar propuesta" porque no lo necesitas. El archivo es la fuente de verdad, y editarlo (ya sea manualmente o a través de la IA) es la actualización.

## "¿Cómo vuelvo a revisar después de implementar?"

No tienes que "volver atrás", porque nunca te fuiste. El flujo de trabajo es fluido: revisar, editar e implementación no son fases secuenciales en las que estás atrapado.

Concretamente, después de algún trabajo con `/opsx:apply`:

- ¿Quieres reexaminar el plan? Abre los artefactos y léelos, o ejecuta `openspec show <change>` en tu terminal para una vista consolidada.
- ¿Encontraste algo que cambiar? Edita el artefacto (o pídele a la IA que lo haga), y luego continúa.
- ¿Quieres una verificación estructurada de que el código coincide con el plan? Ejecuta `/opsx:verify` (comando expandido). Informa sobre la integridad, la corrección y la coherencia sin bloquear nada. Consulta [Flujos de trabajo: Verificar tu trabajo](workflows.md#verify-check-your-work).

No hay una "fase de revisión" a la que volver, porque la revisión es algo que puedes hacer en cualquier momento, incluso después de la implementación.

## "Edité el código manualmente. ¿Cómo lo reconcilio con OpenSpec?"

Esto sucede constantemente y está bien. Hiciste un ajuste en tu editor, y ahora el código y los artefactos no coinciden. Hazlos coincidir en la dirección que sea cierta:

- **El código es correcto, la especificación está obsoleta.** Actualiza la especificación delta (y las tareas, si son relevantes) para describir el comportamiento que realmente has enviado. La especificación debe coincidir con la realidad antes de archivar, porque archivar fusiona la especificación en tu fuente de verdad.
- **La especificación es correcta, el código se desvió.** Sigue construyendo o arreglando hasta que el código coincida con la especificación.

Una forma rápida de detectar discrepancias es `/opsx:verify`: lee tus artefactos y tu código y te dice dónde divergen. Trata su salida como una lista de tareas para la reconciliación, y luego archiva cuando estén de acuerdo.

El principio es: en el momento del archivo, tus especificaciones se convierten en la verdad registrada. Así que antes de archivar, haz que las especificaciones sean honestas sobre lo que hace el código. Las ediciones manuales son bienvenidas; solo no permitas que desincronicen silenciosamente la especificación.

## Refinando una propuesta que no te satisface

Si una propuesta generada no cumple con tus expectativas, tienes tres buenas opciones:

- **Iterar en su lugar.** Dile a la IA qué está mal ("el alcance es demasiado amplio, elimina las funciones de administración") y deja que revise. Es lo más barato y generalmente correcto.
- **Explorar primero, luego volver a proponer.** Si el problema es que la idea misma no está clara, retrocede a `/opsx:explore`, piénsalo bien y deja que salga una propuesta más nítida. Consulta [Explorar Primero](explore.md).
- **Empezar de cero.** Si la intención ha cambiado fundamentalmente, un cambio nuevo puede ser más claro que parchear el anterior.

Esa última opción tiene su propia guía de decisión, próximamente.

## Cuándo actualizar versus cuándo empezar un cambio nuevo

Versión corta: **actualiza cuando es el mismo trabajo refinado; empieza uno nuevo cuando la intención ha cambiado fundamentalmente o el alcance se ha expandido a un trabajo diferente.**

- ¿Mismo objetivo, mejor enfoque? Actualizar.
- ¿Reducción del alcance (enviar el MVP ahora, más tarde)? Actualizar, luego archivar, y luego un cambio nuevo para la fase dos.
- ¿El problema en sí mismo cambió ("añadir modo oscuro" se convirtió en "construir un sistema de temas completo")? Cambio nuevo.

Hay un diagrama de flujo completo y ejemplos resueltos en [Flujos de trabajo: Cuándo Actualizar versus Empezar de Cero](workflows.md#when-to-update-vs-start-fresh) y un tratamiento más profundo en [OPSX: Cuándo Actualizar versus Empezar de Cero](opsx.md#when-to-update-vs-start-fresh).

## Una nota sobre las tareas

`tasks.md` es una lista de verificación viva, no un plan congelado. A medida que implementas, puedes añadir tareas que descubres, eliminar aquellas que resultaron innecesarias o reordenarlas. La IA marca los elementos como completados a medida que los completa durante `/opsx:apply`, y reanuda desde la primera tarea sin marcar si vuelves más tarde. Se espera que se edite la lista en medio del proceso.

## Hacia dónde ir a continuación

- [Flujos de trabajo](workflows.md) - patrones, además de la guía de decisión entre actualizar o empezar uno nuevo
- [Explorar Primero](explore.md) - el lugar al que acudir cuando una idea necesita ser replanteada
- [Comandos](commands.md) - `/opsx:continue`, `/opsx:apply` y `/opsx:verify` en detalle
- [Conceptos: Artefactos](concepts.md#artifacts) - para qué sirve cada artefacto