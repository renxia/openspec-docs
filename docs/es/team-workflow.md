# OpenSpec en un equipo

Todo el contenido de las demás guías funciona igual tanto si trabajas de forma individual como si formas parte de un equipo de veinte personas. Lo que cambia en un equipo son las preguntas en los márgenes: dónde se alojan las especificaciones, cómo revisan los compañeros un plan y cómo encaja todo esto en el flujo de solicitudes de extracción (pull requests) que ya tenemos.

La respuesta corta: un cambio no es más que archivos, y OpenSpec nunca toca git. Por lo tanto, se adapta a tu flujo de trabajo existente en lugar de reemplazarlo. Esta página detalla las convenciones que funcionan mejor.

## Una única regla: OpenSpec no toca git

OpenSpec lee y escribe Markdown sin formato en la carpeta `openspec/`. Nunca hace commits, crea ramas, hace push o hace pull en tu proyecto, y nunca clona ni sincroniza un [almacén](stores-beta/user-guide.md) por su cuenta. Esto significa que:

- **Haces commit de la carpeta `openspec/` como cualquier otro código fuente.** Las especificaciones, los cambios activos y el archivo histórico forman parte del historial de tu proyecto. (Sí, haz commit de la carpeta completa — consulta las [preguntas frecuentes](faq.md#should-i-commit-the-openspec-folder-to-git).)
- **Un cambio es una carpeta que versionas como si fuera código.** La carpeta `openspec/changes/add-dark-mode/` no son más que archivos en una rama.
- **Todo lo que aparece a continuación es una convención, no una obligación.** OpenSpec no te obligará a hacerlo de esta forma; simplemente se adapta perfectamente.

## El flujo de trabajo habitual

El flujo de trabajo que funciona mejor asocia un cambio a una rama y a una solicitud de extracción (pull request):

```
git switch -c add-dark-mode        crea una rama, como de costumbre
   │
/opsx:propose add-dark-mode        redacta el borrador del plan (propuesta + especificaciones + tareas)
   │
REVISA EL PLAN                      lo lees antes de escribir cualquier código — consulta Revisar un cambio
   │
/opsx:apply                        lo implementas; los artefactos y los cambios de código van juntos
   │
git commit && open a PR            abres una solicitud de extracción (PR); el PR contiene el delta de especificaciones Y el código
   │
compañeros revisan, fusionan
   │
/opsx:archive                      integra el delta en la carpeta specs/, mueve el cambio a la carpeta archive/
```

El plan y el código conviven en la misma rama, por lo que tus compañeros revisan ambos a la vez, y seis meses después la especificación archivada sigue explicando por qué el código tiene el aspecto que tiene.

## Revisar especificaciones en una solicitud de extracción (pull request)

Aquí es donde un equipo nota el beneficio. Cuando una PR incluye el delta de especificaciones del cambio, el revisor obtiene algo que un diff en bruto nunca le dará: **una declaración en lenguaje natural de lo que se supone que debe hacer este cambio**, antes de leer una sola línea de código.

Un orden de revisión recomendado para el revisor:

1. **Lee el archivo `proposal.md`** — ¿se trata del problema y el alcance correctos?
2. **Lee el delta en la carpeta `specs/`** — ¿se ha definido correctamente qué significa "terminado"? (Se trata de la revisión rápida de dos minutos de [Revisar un cambio](reviewing-changes.md), que ahora se realiza en la PR.)
3. **Después lee el diff de código** — ¿cumple exactamente con esos requisitos?

Un revisor que no esté de acuerdo con el *enfoque* puede indicarlo en la propuesta de forma sencilla, en lugar de volver a debatirlo a lo largo de 300 líneas de código. Coloca el delta de especificaciones cerca de la parte superior de la descripción de la solicitud de extracción, o indica a los revisores la carpeta del cambio, para que empiecen por ahí.

## Cuándo archivar

Al archivar, integras los deltas de un cambio en la carpeta principal `openspec/specs/` y mueves la carpeta del cambio a `openspec/changes/archive/YYYY-MM-DD-<name>/`. Como la carpeta `specs/` es la **fuente de verdad compartida**, el momento de realizar esta operación es importante en un equipo. Hay dos convenciones viables:

- **Archivar después de fusionar la PR (recomendado).** La rama contiene el cambio activo; una vez que se fusiona en tu rama principal, archivas allí (normalmente con un pequeño commit de seguimiento o una limpieza programada). Esto hace que la carpeta `specs/` compartida solo avance con el trabajo que se ha lanzado realmente.
- **Archivar dentro de la PR.** Más sencillo para equipos pequeños: la misma PR que añade el código también sincroniza y archiva. El inconveniente es que el diff de la carpeta `specs/` y el diff de código se envían juntos, lo que puede hacer que la PR sea más ruidosa.

Elige una opción y sé constante. En cualquier caso, el comando `/opsx:archive` comprueba que las tareas están completadas y ofrece sincronizar primero, para que nada se fusione a medio terminar por accidente.

## Dos personas, cambios en paralelo

Como los cambios son carpetas independientes, no entran en conflicto:

- **Cambios diferentes, personas diferentes — no hay problema.** Las carpetas `add-dark-mode` y `rate-limit-login` son carpetas distintas en ramas diferentes; nunca entran en contacto hasta que ambas se archivan.
- **Un cambio, un responsable.** Dos personas editando la misma carpeta de cambio entran en conflicto exactamente igual que dos personas editando el mismo archivo. Asigna un único autor a cada cambio, o divídelo en dos cambios (otra razón para [ajustar el tamaño del cambio](writing-specs.md#right-size-the-change)).
- **El único lugar donde aparecen conflictos es en la carpeta `specs/`.** Si dos cambios modifican el *mismo* requisito, al archivar el segundo se producirá un conflicto en el archivo `openspec/specs/…/spec.md` — resuélvelo como cualquier conflicto de fusión (merge), manteniendo el requisito que refleje la realidad. Esto es poco frecuente, y es una característica: es git avisándote de que dos cambios no se ponían de acuerdo sobre cómo debe comportarse el sistema.

## Cuando la planificación supera el alcance de un único repositorio

Todo lo anterior supone que el plan se aloja en la carpeta `openspec/` del propio repositorio de código, que es la opción predeterminada correcta. Cuando tu planificación abarca realmente varios repositorios o equipos —por ejemplo, una funcionalidad que afecta a tres servicios, o requisitos que pertenecen a un equipo y son consumidos por otros—, para eso está la funcionalidad beta de **almacenes**: la planificación obtiene su propio repositorio al que puede apuntar cualquier repositorio de código. Empieza por la [Guía de usuario de Almacenes](stores-beta/user-guide.md).

## Por dónde seguir

- [Revisar un cambio](reviewing-changes.md) — la revisión rápida, ahora dentro de tu solicitud de extracción.
- [Escribir buenas especificaciones](writing-specs.md) — incluye cómo ajustar el tamaño de un cambio para que quepa en una única rama.
- [Guía de usuario de Almacenes](stores-beta/user-guide.md) — planificación que abarca varios repositorios y equipos.