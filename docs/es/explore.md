# Explorar Primero

**`/opsx:explore` es tu compañero de pensamiento.** Acércate a él siempre que tengas un problema pero aún no una solución. Investiga tu base de código, evalúa opciones contigo y aclara lo que realmente quieres, todo antes de que se cree un solo artefacto o línea de código. Cuando la imagen esté clara, pasa el control a `/opsx:propose`.

Si tomas un hábito de esta documentación, toma este: **cuando no estés seguro, explora antes de proponer.**

He aquí por qué es importante. Los asistentes de codificación IA están ansiosos. Pregunta vagamente y ellos construirán *algo* con confianza, aunque quizás no sea lo que necesitabas. Explore es la cura. Es una conversación sin riesgos donde tú y la IA descubren el camino correcto juntos, para que cuando propongas, estés proponiendo lo correcto.

## Cuándo explorar

Explorar es el primer paso correcto más a menudo de lo que la gente espera. Úsalo cuando se cumpla alguna de estas condiciones:

- Sabes el *problema* pero no la *solución*. ("Las páginas parecen lentas." "La autenticación es un desastre." "Seguimos recibiendo pedidos duplicados.")
- Estás eligiendo entre enfoques y quieres que los compromisos estén detallados en relación con tu código real.
- Eres nuevo en una base de código y necesitas entender cómo funciona algo antes de cambiarlo.
- Los requisitos son vagos y quieres definirlos mejor antes de comprometértete.
- Sospechas que el trabajo es más grande o más pequeño de lo que parece y quieres evaluarlo honestamente.

Omite la exploración solo cuando ya sabes exactamente qué quieres y cómo hacerlo. En ese caso, ve directamente a [`/opsx:propose`](commands.md#opsxpropose).

## Qué hace (y qué no)

Explorar es una **conversación**, no un generador.

**Lo que hace:**
- Lee y busca en tu base de código para responder preguntas reales.
- Compara opciones y nombra los compromisos de cada una.
- Dibuja diagramas para hacer legible un diseño.
- Te ayuda a estrechar una idea vaga hasta convertirla en un alcance concreto y ejecutable.
- Transiciona a `/opsx:propose` cuando estés listo.

**Lo que no hace:**
- Crear una carpeta de cambios.
- Escribir ningún artefacto (ni propuestas, especificaciones, diseños ni tareas).
- Escribir o modificar código.

Ese es el punto. Explorar no te cuesta nada y no te compromete a nada. Puedes explorar tres callejones sin salida, aprender algo de cada uno y solo entonces proponer el camino que sobrevivió.

## Ya está instalado

Buenas noticias: `/opsx:explore` viene incluido en el perfil **core** predeterminado, junto con `propose`, `apply`, `sync` y `archive`. No necesitas habilitar nada. Si OpenSpec está configurado en tu proyecto, explore está listo en tu chat de IA. (Al igual que todos los comandos `/opsx:*`, lo escribes en el chat de tu asistente, no en la terminal. Consulta [Cómo funcionan los Comandos](how-commands-work.md).)

## Un ejemplo completo

Observa cómo una preocupación vaga se convierte en un cambio nítido y ejecutable.

```text
You: /opsx:explore

AI:  ¿Qué le gustaría explorar?

You: A veces nuestro proceso de pago crea pedidos duplicados. No sé por qué ni cómo arreglarlo de forma segura.

AI:  Permítame investigar la ruta del checkout...
     [lee el servicio de pedidos, el manejador del webhook de pago y la lógica de envío del cliente]

     Esto es lo que encontré. Hay dos formas en que puede ocurrir un duplicado:

     1. El cliente puede enviar dos veces (doble clic, reintento con red lenta).
        Nada lo debilita.
     2. El webhook de pago puede activarse más de una vez y el manejador
        crea un pedido cada vez. No hay clave de idempotencia.

     La causa #2 es la peligrosa: puede cobrar y cumplir dos veces.

     Tres formas de solucionarlo, aproximadamente en orden de robustez:
     - Clave de idempotencia en el endpoint de creación de pedidos (maneja ambas causas)
     - Desduplicación en el webhook usando el id del intento de pago (solo maneja #2)
     - Debounce del lado del cliente (solo maneja #1, tapa el verdadero problema)

     Dado que tu código ya almacena el ID del intento de pago, la
     aproximación con clave de idempotencia es un cambio pequeño con el mayor beneficio.
     ¿Quieres que defina el alcance de esto?

You: Sí, hagamos la clave de idempotencia.

You: /opsx:propose add-order-idempotency-key

AI:  Creado openspec/changes/add-order-idempotency-key/, con una propuesta
     y una especificación delta fundamentada en lo que acabamos de encontrar. Listo para la implementación.
```

Observa lo que sucedió. El punto de partida era "algo está mal y tengo miedo de tocarlo". Veinte segundos de exploración convirtieron eso en una causa raíz nombrada, tres opciones clasificadas, una recomendación vinculada al código existente y un cambio preciso. La propuesta que sigue es nítida porque el pensamiento ocurrió primero.

## Pasando la tarea a Propose

Explore no archiva nada. Cuando estés listo, simplemente comienzas un cambio, y la IA lleva el contexto de tu conversación a los artefactos.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (pensar)     (aceptar)       (construir)     (registrar)
```

Puedes decirlo en lenguaje sencillo ("vamos a convertir esto en un cambio") o ejecutar `/opsx:propose <nombre>` directamente. De cualquier manera, la exploración que acabas de hacer se convierte en la base de la propuesta, no en una conversación desechable.

Si utilizas el conjunto de comandos ampliado, explore puede pasar la tarea a `/opsx:new` en su lugar, para la creación de artefactos paso a paso. Consulta [Flujos de trabajo](workflows.md).

## Consejos para una buena exploración

- **Trae el problema, no la solución.** "Los inicios de sesión parecen lentos" le da a la IA espacio para investigar. "Añadir un caché Redis" te compromete antes de tiempo a una respuesta que aún no has probado.
- **Pide los compromisos en voz alta.** "¿Cuáles son las desventajas de cada opción?" obtienes una comparación más honesta.
- **Deja que lea primero.** Las mejores exploraciones comienzan con la IA mirando realmente tu código, no adivinando. Señálale el área relevante si eso ayuda.
- **Está bien rendirse.** Si la exploración revela que la idea no vale la pena, es una victoria. Aprendiste algo de forma económica.
- **Explora de nuevo a mitad del cambio.** ¿Estancado durante `/opsx:apply`? Puedes retroceder y explorar un subproblema, y luego volver.

## Los compromisos honestos

**Lo que ganas:** explore detecta los giros equivocados en el momento más barato posible, antes de que exista cualquier artefacto. Es especialmente potente en código desconocido, donde la capacidad de la IA para leer y resumir el sistema te ahorra una tarde de excavación.

**Lo que cuesta:** un poco de paciencia. Explore es una conversación, por lo tanto es más lento que ejecutar `/opsx:propose` y rezar. Para un trabajo que ya entiendes genuinamente, ese paso extra es pura sobrecarga, y deberías omitirlo.

La regla general: cuanto más vaga sea la tarea, más vale la pena explorar. Cuanto más clara sea la tarea, más puedes saltar directamente a proponer.

## A dónde ir después

- [Comandos: `/opsx:explore`](commands.md#opsxexplore): la referencia precisa
- [Flujos de trabajo](workflows.md): explore como parte del ciclo diario
- [Ejemplos y Recetas](examples.md#recipe-3-exploring-before-you-commit): explore en un recorrido completo
- [Cómo Empezar](getting-started.md): la guía para el primer cambio, incluyendo exploración