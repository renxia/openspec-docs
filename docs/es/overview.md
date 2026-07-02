# Conceptos Centrales de un Vistazo

**OpenSpec es una capa de acuerdo ligera entre tú y tu IA.** Tú describes lo que debe hacer un cambio, la IA redacta los detalles, ambos revisan el mismo plan y solo entonces se escribe código. Esta página es todo el modelo mental en una sola pantalla. Cuando quieres la versión larga, [Concepts](concepts.md) la tiene.

Aquí está toda la idea en cinco palabras: **acordar primero, construir con confianza.**

## Las cinco ideas

Todo en OpenSpec se construye a partir de cinco conceptos. Aprende estos y el resto es detalle.

**1. Las especificaciones son la verdad.** Una especificación describe cómo se comporta tu sistema *ahora*. Vive en `openspec/specs/`, organizado por dominio (`auth/`, `payments/`, `ui/`). Las especificaciones están compuestas de requisitos ("el sistema DEBE expirar las sesiones después de 30 minutos") y escenarios (ejemplos concretos de dado/cuando/entonces). Piensa en las especificaciones como la respuesta única acordada a "¿qué hace este software?".

**2. Un cambio es una unidad de trabajo.** Cuando quieres añadir, modificar o eliminar un comportamiento, creas un cambio: una carpeta en `openspec/changes/` que contiene todo sobre ese trabajo en un solo lugar. Una propuesta, un diseño, una lista de tareas y las ediciones de la especificación. Un cambio, una carpeta, una funcionalidad.

**3. Las delta specs describen lo que está cambiando, no el mundo entero.** Dentro de un cambio, no reescribes la especificación completa. Escribes un pequeño delta: `ADDED` este requisito, `MODIFIED` ese, `REMOVED` este otro. Este es el truco que hace que OpenSpec sea bueno editando sistemas existentes, no solo los nuevos (green-field). Describes la diferencia (diff), no el destino.

**4. Los artefactos se construyen unos sobre otros.** Un cambio contiene varios documentos, creados en un orden natural, cada uno alimentando al siguiente:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   por qué    qué       cómo      pasos     hacerlo
```

Puedes revisar cualquiera de ellos en cualquier momento. Son facilitadores, no obstáculos. (Más sobre esto más adelante).

**5. El archivo cierra el cambio dentro de la verdad.** Cuando el trabajo está hecho, archivas el cambio. Sus delta specs se fusionan con las especificaciones principales, y la carpeta del cambio se mueve a `changes/archive/` con una marca de fecha. Ahora tus especificaciones describen la nueva realidad, y estás listo para el siguiente cambio. El ciclo se cierra.

## La imagen

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ fuente de verdad │  fusión  │ una carpeta por cambio    │    │
│   │ cómo funcionan  │  en      │ proposal · design ·      │    │
│   │ las cosas     │ archive │ tasks · delta specs      │    │
│   │ hoy            │          └──────────────────────────┘    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Dos carpetas. `specs/` es lo que es verdad. `changes/` es lo que estás proponiendo. Archivar mueve una propuesta a la verdad.

## El ciclo que realmente vas a ejecutar

En la configuración predeterminada, tu día se ve así. Opcionalmente piénsalo primero; luego un comando redacta el plan, tú lo lees y lo ajustas, el siguiente lo construye y marca las tareas, y el último lo archiva.

```text
/opsx:explore                   →  (opcional) piénsalo con la IA primero
/opsx:propose add-dark-mode     →  La IA redacta propuesta, especificaciones, diseño, tareas
        (tú lees y ajustas el plan)
/opsx:apply                     →  La IA lo construye, marcando las tareas
/opsx:archive                   →  Especificaciones actualizadas, cambio archivado
```

**Ante la duda, empieza explorando.** `/opsx:explore` es un compañero de pensamiento sin riesgos: lee tu código, presenta opciones y convierte una idea vaga en un plan concreto antes de que exista cualquier artefacto. Es el mejor antídoto contra una IA que de otra manera construiría *algo* a partir de una indicación vaga. ¿Ya sabes exactamente lo que quieres? Ve directamente a `/opsx:propose`. De cualquier manera, explorar está incluido en el perfil predeterminado, por lo que siempre está disponible. Consulta la [Guía de Exploración](explore.md).

Estos son comandos slash, escritos en el chat de tu asistente de IA. La configuración (`openspec init`) se realiza en tu terminal. Si este punto es nuevo para ti, lee primero [Cómo Funcionan los Comandos](how-commands-work.md); es el punto de confusión más común.

## "Facilitadores, no obstáculos"

Esta frase aparece en todas partes de OpenSpec, así que aquí está lo que significa en términos sencillos.

Los procesos de especificación anticuados son cascadas: terminas la planificación y *luego* se te permite implementar, y retroceder es doloroso. OpenSpec rechaza eso. El orden `proposal → specs → design → tasks` muestra lo que se vuelve *posible* a continuación, no lo que estás *forzado* a hacer a continuación.

¿Descubres durante la implementación que el diseño estaba mal? Edita `design.md` y sigue adelante. ¿Te das cuenta de que el alcance debería reducirse? Actualiza la propuesta. Nada está bloqueado. Las dependencias existen solo para que la IA tenga el contexto que necesita (no puedes escribir buenas tareas sin especificaciones en las que basarlas), no para encerrarte.

La fortaleza aquí es la honestidad: el trabajo real es desordenado e iterativo, y OpenSpec lo permite. La compensación es la disciplina: dado que nada te fuerza a avanzar, depende de ti mantener un cambio enfocado en lugar de dejar que se extienda sin control. La guía [Workflows](workflows.md) tiene buenos hábitos para eso.

## Por qué esto vale la pequeña sobrecarga

La verdad simple: OpenSpec añade un paso. Escribes un plan corto antes de construir. ¿Y qué obtienes a cambio?

- **Atrapas los giros equivocados antes de que te cuesten dinero.** Corregir un malentendido en una propuesta de un párrafo es gratis. Arreglarlo después de que la IA escribió 400 líneas no lo es.
- **El plan y el código permanecen en el mismo repositorio.** Seis meses después, la especificación te dice (y a la próxima sesión de IA) por qué funciona el sistema de la manera en que lo hace.
- **Los cambios son revisables.** Una carpeta de cambio es un paquete ordenado: lee la propuesta, escanea los deltas, revisa las tareas. No arqueología a través del historial de chat.
- **Encaja con bases de código existentes.** Los deltas significan que puedes especificar un cambio en una aplicación de 50.000 líneas sin documentar primero todo el asunto.

Y la honesta compensación: para una corrección verdaderamente trivial de una sola línea, la ceremonia puede no valer la pena, y eso está bien. OpenSpec está diseñado para ser ligero, pero no es gratis. Úsalo donde el acuerdo importe, que resulta ser la mayoría de las veces cuando trabajas con una IA que construirá con confianza lo que vagamente pediste.

## A dónde ir después

- ¿Eres nuevo? [Getting Started](getting-started.md) guía el primer cambio en detalle.
- ¿No estás seguro de qué construir todavía? [Explore First](explore.md) es el lugar para empezar.
- ¿Estás confundido sobre dónde se ejecutan los comandos? [How Commands Work](how-commands-work.md).
- ¿Quieres la versión profunda de todo lo anterior? [Concepts](concepts.md).
- ¿Aprender por ejemplo? [Examples & Recipes](examples.md).
- ¿Necesitas que se defina un término? [Glossary](glossary.md).