# Usando OpenSpec en un Proyecto Existente

**No se documenta todo el código base para empezar. Se escriben especificaciones solo para lo que se va a cambiar.** Esta es la cosa más importante que hay que saber al adoptar OpenSpec en un proyecto existente, y por eso OpenSpec está construido pensando en proyectos ya existentes (brownfield-first).

Una preocupación común suena así: "¿Mi aplicación tiene 80.000 líneas de código. ¿Tengo que escribir especificaciones para todo antes de que OpenSpec sea útil?" No. A ti te gustaría eso, y a nosotros también. OpenSpec va creciendo tus especificaciones una vez que cambias. Tu primer cambio documenta la porción a la que toca, el siguiente cambio documenta su porción, y con el tiempo tus especificaciones se completan de forma natural alrededor del trabajo que realmente realizas.

Esta guía muestra cómo empezar desde el día uno sin intentar abarcarlo todo.

## La versión de treinta segundos

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

Luego, en tu chat de IA:

```text
/opsx:explore            # opcional: haz que la IA lea el área que vas a tocar
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

Tus especificaciones ahora describen exactamente la parte del sistema que tocó el cambio, y nada más. Eso es correcto. Ya no te preocupas por las otras 80.000 líneas.

## Por qué delta-first es todo el truco

Los cambios de OpenSpec se escriben como **deltas**: `ADDED`, `MODIFIED`, `REMOVED`. Un delta describe lo que está cambiando en relación con el comportamiento actual, no el sistema completo.

Esto es exactamente lo que necesita el trabajo brownfield. Rara vez estás construyendo desde cero. Estás añadiendo un campo, arreglando una redirección, ajustando un tiempo de espera (timeout). Un delta te permite especificar ese cambio con precisión sin tener primero que escribir una especificación de 40 páginas de todo lo que lo rodea.

Así que tu directorio `openspec/specs/` no empieza lleno y completo. Empieza casi vacío y se acumula. Cada cambio archivado fusiona su delta. La especificación para `auth/` solo se vuelve exhaustiva después de haber realizado varios cambios de autenticación, que es exactamente cuando quieres que sea exhaustiva.

Si deseas conocer la mecánica más profunda, consulta [Concepts: Delta Specs](concepts.md#delta-specs).

## Tu primer cambio en una base de código real

Elige algo pequeño y real. No un juguete, no una reescritura. Un cambio que ibas a hacer esta semana de todos modos. Los primeros cambios pequeños te enseñan el flujo de trabajo con bajos riesgos.

**Paso 1: Deja que la IA lea el área relevante.** Aquí es donde `/opsx:explore` cumple su función en una base de código desconocida o grande. Señálalo al área que estás a punto de tocar y déjale mapear cómo funcionan las cosas antes de proponer cualquier cosa.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I need to add rate limiting to our public API, but I'm not sure
     how requests currently flow through the middleware.

AI:  Let me trace it... [reads the router, middleware stack, and config]
     Requests hit Express, pass through auth middleware, then your
     controllers. There's no rate-limiting layer today. The cleanest
     insertion point is a middleware right after auth. Want me to scope it?
```

Nota que la IA ahora entiende tu estructura real, por lo que la propuesta que escribe encajará con tu código, no con una plantilla genérica. En una base de código grande, este solo hábito ahorra la mayor parte del dolor. Consulta [Explore First](explore.md).

**Paso 2: Proponer el cambio.** La propuesta y su especificación delta capturan solo este cambio.

```text
You: /opsx:propose add-api-rate-limiting
```

**Paso 3: Construir y archivar** con `/opsx:apply` y `/opsx:archive`, igual que cualquier otro cambio. Después de archivarlo, tienes una especificación real para tu comportamiento de limitación de solicitudes, nacida de un cambio que necesitabas hacer de todos modos.

## ¿Prefieres un recorrido guiado? Usa onboard

Si prefieres ver el ciclo completo en tu propio código con narración, el comando ampliado `/opsx:onboard` hace exactamente eso: escanea tu base de código en busca una mejora pequeña y segura, luego te guía a través de proponerla, construirla y archivarla, explicando cada paso.

Activa primero los comandos ampliados:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Luego en el chat:

```text
/opsx:onboard
```

Es la introducción más suave posible en un proyecto real, y te deja con un cambio genuino (pequeño) que puedes mantener o descartar. Consulta [Commands: `/opsx:onboard`](commands.md#opsxonboard).

## "Pero ya tengo documentos de requisitos"

Quizás tengas un PRD, un SRS, una especificación formal, incluso modelos TLA+. Bien. No los importas por completo, y tampoco los tiras a la basura.

Trata los documentos existentes como **material fuente para la exploración**, no como especificaciones que deban convertirse. Cuando empieces un cambio, pega o señala a la IA la sección relevante, y déjala crear un delta OpenSpec enfocado a partir de ella. El delta captura el comportamiento que estás cambiando ahora, en forma de requisito y escenario probables por OpenSpec. Tus documentos originales permanecen donde están como contexto de fondo.

La razón honesta: Las especificaciones de OpenSpec están deliberadamente enfocadas en el comportamiento y limitadas a los cambios. Un PRD de 40 páginas es un artefacto diferente con una función distinta. Forzar una conversión masiva única tiende a producir una especificación grande y obsoleta en la que nadie confía. Dejar que las especificaciones crezcan a partir de cambios reales las mantiene precisas.

```text
You: /opsx:explore
You: Here's the section of our PRD about checkout. I'm implementing the
     "guest checkout" requirement next.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## Organizando especificaciones en una base de código grande

Las especificaciones viven bajo `openspec/specs/`, agrupadas por **dominio**: un área lógica que coincide con cómo tu equipo piensa sobre el sistema. No tienes que diseñar toda la taxonomía por adelantado. Crea una carpeta de dominio cuando tu primer cambio en esa área lo necesite.

Maneras comunes de dividir los dominios:

- **Por área de funcionalidad:** `auth/`, `payments/`, `search/`
- **Por componente:** `api/`, `frontend/`, `workers/`
- **Por contexto delimitado (bounded context):** `ordering/`, `fulfillment/`, `inventory/`

Elige lo que haga asentir a un recién llegado. Puedes refinarlo más tarde. Consulta [Concepts: Specs](concepts.md#specs).

## Monorepos y trabajo que abarca repositorios

Para un monorepo, el modelo más simple es un directorio `openspec/` en la raíz del repositorio, con dominios que se mapean a tus paquetes o servicios. Eso cubre a la mayoría de los equipos.

Si tu trabajo realmente abarca **múltiples repositorios** (o varios paquetes que tratas como separados), OpenSpec tiene una función beta de **stores**: la planificación vive en su propio repositorio independiente al que cualquiera de tus repositorios de código puede hacer referencia, por lo que el plan no tiene que vivir dentro de la carpeta `openspec/` de un repositorio. Es beta, así que trata sus comandos y estado como algo en evolución. Comienza con la [Stores User Guide](stores-beta/user-guide.md) para el modelo mental y el camino útil más pequeño.

## Algunas advertencias honestas

- **Resiste la tentación de rellenar todo.** Escribir especificaciones para código que no estás cambiando se siente productivo y generalmente no lo es. Esas especificaciones quedan obsoletas, porque nada las obliga a seguir la realidad. Deja que los cambios reales impulsen tus especificaciones.
- **Mantén los primeros cambios pequeños.** Tus primeros cambios son tanto sobre aprender el ritmo como sobre entregar. Un alcance ajustado hace que el ciclo sea rápido y las lecciones sean baratas.
- **Commit `openspec/` a git.** Tus especificaciones y archivo pertenecen al control de versiones junto con el código que describen.
- **Da contexto a la IA.** En una base de código grande con convenciones sólidas, rellena `openspec/config.yaml` en la sección `context:` para que cada propuesta respete tu stack y tus patrones. Consulta [Customization](customization.md#project-configuration).

## A dónde ir después

- [Explore First](explore.md) - el hábito clave para entender el código antes de cambiarlo
- [Getting Started](getting-started.md) - la guía completa del primer cambio
- [Editing & Iterating on a Change](editing-changes.md) - ajustando un cambio mientras aprendes
- [Concepts: Delta Specs](concepts.md#delta-specs) - por qué los deltas hacen que el trabajo brownfield sea limpio
- [Customization](customization.md) - enseña a OpenSpec las convenciones de tu proyecto