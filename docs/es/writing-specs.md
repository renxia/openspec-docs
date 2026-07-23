# Escribir especificaciones de calidad

Casi nunca escribes una especificación desde una página en blanco. Describes un cambio en lenguaje sencillo, `/opsx:propose` redacta los requisitos y los escenarios, y luego los mejoras. Esta página trata de esa última parte: qué significa que una especificación sea de "calidad" y cómo guiar a la IA para lograrlo.

Es el complemento de [Revisar un cambio](reviewing-changes.md): revisar consiste en detectar los puntos débiles de un borrador, mientras que escribir consiste en saber de qué está hecha una especificación sólida.

## Una especificación define comportamiento, no código

Una especificación indica lo que tu sistema *hace*, en términos que cualquiera puede verificar, no cómo está construido. Está formada por **requisitos** (enunciados de comportamiento) y **escenarios** (ejemplos concretos que los demuestran).

```markdown
### Requisito: Tiempo de espera de sesión
El sistema SHALL expirar una sesión después de 30 minutos de inactividad.

#### Escenario: Tiempo de espera por inactividad
- GIVEN una sesión autenticada
- WHEN pasan 30 minutos sin actividad
- THEN la sesión se invalida y el usuario debe volver a autenticarse
```

Guarda el *cómo* — la cola, la biblioteca, el esquema de la tabla — en `design.md` o en el código. Cuando el comportamiento y la implementación se mezclan en un mismo requisito, este deja de ser comprobable y empieza a quedar obsoleto en el momento en que cambia el código.

## Qué hace que un requisito sea de calidad

Un requisito de calidad es un único comportamiento, expresado con tanta claridad que se lo podrías entregar a otra persona para que lo pruebe.

- **Una sola afirmación, un solo `SHALL`/`MUST`.** Si un requisito tiene tres cláusulas de "y también", en realidad son tres requisitos. Divídelos.
- **Observable.** Alguien ajeno al código debería poder determinar si se cumple. "El sistema SHALL mostrar un banner de error cuando la subida supere los 10 MB" es observable. "El sistema SHALL gestionar las subidas grandes de forma elegante" no lo es.
- **La intensidad adecuada.** OpenSpec utiliza las palabras clave de la RFC 2119, y cada una tiene un significado distinto:

  | Palabra clave | Significado |
  |---------|---------|
  | `MUST` / `SHALL` | Un requisito obligatorio. No negociable. |
  | `SHOULD` | Una recomendación firme, con margen para una excepción justificada. |
  | `MAY` | Genuinamente opcional. |

  Utiliza `MUST`/`SHALL` de forma predeterminada. Usa `SHOULD` solo cuando realmente quieras decir "a menos que haya una buena razón para no hacerlo".

La prueba para un requisito es la siguiente: *¿podría un probador que nunca ha visto el código decir si se ha cumplido?* Si no, necesita ser afinado.

## Qué hace que un escenario sea de calidad

Los escenarios son donde un requisito demuestra su valor. Cada uno es un GIVEN / WHEN / THEN concreto que podría convertirse en una prueba automatizada.

- **Pone a prueba su requisito.** Un escenario que se limita a reformular el requisito con otras palabras no prueba nada. Conviértelo en una situación específica con un resultado específico.
- **Cubre los casos que importan, no solo el camino feliz.** El inicio de sesión válido es fácil. La entrada vacía, el token caducado, el segundo clic, lo que sale mal: ahí es donde viven los errores, y donde un escenario tiene más valor.
- **Nombra el caso en el título.** "Escenario: Rechaza un token caducado" le indica a un revisor qué se cubre de un vistazo; "Escenario: Prueba 2" no lo hace.

Un hábito útil: antes de aprobar, pregúntate *¿cuál es el único caso que me molestaría que se rompiera?* — y asegúrate de que haya un escenario que lo nombre.

## Elige el tipo de delta adecuado

Un cambio describe sus modificaciones a las especificaciones con tres tipos de sección. Usar el adecuado mantiene la veracidad de tus especificaciones archivadas:

- **`## ADDED Requirements`** — comportamiento completamente nuevo que no existía antes.
- **`## MODIFIED Requirements`** — comportamiento que ya existía y está cambiando. Incluye la versión nueva completa; una nota breve sobre lo que cambió ayuda al revisor.
- **`## REMOVED Requirements`** — comportamiento que se elimina, con una línea que explique el motivo.

Al archivar, ADDED se añade al final de la especificación principal, MODIFIED reemplaza la versión anterior y REMOVED se elimina. Si marcas un cambio real como ADDED, acabas teniendo dos requisitos contradictorios; si describes un comportamiento nuevo como MODIFIED, no hay nada que reemplazar. Si tienes dudas, abre la especificación actual y comprueba si el requisito ya está incluido.

## Ajusta el tamaño del cambio adecuadamente

El error de redacción más común no es un requisito mal redactado, sino un cambio que intenta ser tres cambios a la vez.

**Un buen cambio tiene una única intención que puedes expresar en una sola frase.** "Añadir un interruptor para el modo oscuro." "Limitar la tasa de solicitudes del endpoint de inicio de sesión." "Migrar las sesiones para que no usen cookies." Si para describir el cambio necesitas usar mucho "y también", esa es la señal de que debes dividirlo.

Señales de que un cambio es demasiado grande:

- El alcance de la propuesta parece una lista de funcionalidades no relacionadas.
- Revisarlo llevaría toda una tarde, así que nadie lo hará.
- Dos personas no podrían trabajar en él sin interferirse entre sí.
- La mitad de las tareas podrían lanzarse por su cuenta.

Los cambios más pequeños son más fáciles de revisar, más fáciles de desarrollar en una sesión centrada y más fáciles de entender seis meses después, cuando el archivo sea lo único que quede. Siempre puedes ejecutar varios cambios en paralelo: consulta [Editar e iterar](editing-changes.md) y [Flujos de trabajo](workflows.md).

También ocurre lo contrario: la corrección de un error tipográfico de una línea no necesita tres requisitos y un documento de diseño. Adapta la formalidad a la importancia del cambio.

## Cómo guiar a la IA para obtener un buen borrador

Como `/opsx:propose` se encarga del primer borrador, la calidad del resultado que obtienes depende de la calidad de la información que le proporcionas. No tienes que escribir los requisitos a mano, solo tienes que apuntar bien a la IA:

- **Indica la intención y los límites.** *"Añade un interruptor para el modo oscuro que siga la configuración del sistema operativo en la primera carga — no toques la API de temas existente."* La parte fuera del alcance es tan importante como la parte dentro del alcance.
- **Nombra los casos que te importan.** *"Asegúrate de que haya un escenario para un usuario que ya haya seleccionado un tema manualmente."* La IA cubre lo que tú le indiques.
- **Luego edita.** Es Markdown sin formato. Afina un `SHALL` ambiguo, borra un escenario que no prueba nada, añade el caso que se le pasó por alto — o pídeselo a la IA: *"el requisito de tiempo de espera es ambiguo, fíjalo en 30 minutos"*.

Haz un borrador, afina, repite. Unas cuantas rondas de eso producen una especificación en la que confías, que es el objetivo final.

## Lista de verificación rápida

- [ ] Cada requisito es un único comportamiento observable con un `SHALL`/`MUST`.
- [ ] No hay detalles de implementación incluidos en los requisitos.
- [ ] Cada requisito tiene al menos un escenario que lo pone a prueba de verdad.
- [ ] Los casos de borde y de error importantes tienen sus escenarios, no solo el camino feliz.
- [ ] Los deltas usan ADDED / MODIFIED / REMOVED correctamente frente a la especificación actual.
- [ ] Todo el cambio tiene una única intención que puedes expresar en una frase.

## Por dónde seguir

- [Revisar un cambio](reviewing-changes.md) — la revisión rápida de dos minutos que detecta lo que se te pasó por alto.
- [Conceptos](concepts.md) — el modelo más profundo que hay detrás de las especificaciones, los cambios y los deltas.
- [Ejemplos y recetas](examples.md) — cambios reales de principio a fin.