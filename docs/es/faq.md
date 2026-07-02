# FAQ

Respuestas rápidas a las preguntas más comunes. Si su pregunta es realmente de "algo está roto", [Troubleshooting](troubleshooting.md) es la página adecuada. Si desea que se le defina un término, consulte el [Glossary](glossary.md).

## Lo básico

### ¿Qué es OpenSpec, en una frase?

Una capa ligera que logra que usted y su asistente de codificación IA estén de acuerdo sobre qué construir, por escrito, antes de escribir cualquier código.

### ¿Por qué querría eso?

Porque los asistentes de IA están seguros incluso cuando se equivocan. Cuando los requisitos existen solo en un hilo de chat, la IA rellena las lagunas con suposiciones, y usted lo descubre después de que el código existe. OpenSpec adelanta la negociación, al punto donde los errores son baratos de corregir. Consulte [Core Concepts at a Glance](overview.md) para el caso completo.

### ¿Tengo que usarlo para todo?

No. Úselo donde la concordancia sea importante, es decir, en la mayor parte del trabajo no trivial. Para una corrección de un solo carácter tipográfico, la ceremonia probablemente no vale la pena, y eso está bien.

### ¿Puedo usarlo en una gran base de código existente o solo en proyectos nuevos?

Las bases de código existentes son el evento principal. OpenSpec es "brownfield-first": usted no documenta su aplicación completa por adelantado. Escribe especificaciones solo para lo que cada cambio toca, y sus especificaciones se van completando con el tiempo alrededor del trabajo que realmente realiza. Hay una guía dedicada: [Using OpenSpec in an Existing Project](existing-projects.md).

### ¿Está ligado a alguna herramienta de IA?

No. OpenSpec funciona con más de 25 asistentes, incluyendo Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex y más. La lista completa y los detalles por herramienta están en [Supported Tools](supported-tools.md).

## Ejecutar comandos

### ¿Dónde escribo `/opsx:propose`?

En el chat de su asistente de IA, no en la terminal. Este es el punto de confusión más común, por lo que tiene su propia página: [How Commands Work](how-commands-work.md). Versión corta: `openspec ...` se ejecuta en la terminal, `/opsx:...` se ejecuta en el chat.

### ¿Cómo "iniciar el modo interactivo"?

No hay un modo separado para iniciarlo. Abre su asistente de IA como lo normal y escriba un comando con barra (slash command) en su chat. El comando con barra es cómo usted "entra" a OpenSpec. (La única característica verdaderamente interactiva de la terminal es `openspec view`, un panel de control para navegar por las especificaciones y los cambios). Explicación completa en [How Commands Work](how-commands-work.md).

### Escribí un comando con barra y no pasó nada. ¿Por qué?

Lo más probable es que lo haya escrito en la terminal en lugar de en el chat de su IA, o que los comandos aún no estén instalados. Ejecute `openspec update` en su proyecto, reinicie su asistente y luego intente escribir `/opsx` en el chat y busque el autocompletado. [Troubleshooting](troubleshooting.md#commands-dont-show-up) tiene la lista de verificación completa.

### ¿Por qué la sintaxis `/opsx:propose` está en una herramienta y `/opsx-propose` en otra?

Cada herramienta de IA muestra los comandos personalizados de manera ligeramente diferente. La intención es idéntica; solo cambia la puntuación. Escriba una barra en su chat y el autocompletado le mostrará el formato que espera su herramienta. La tabla por herramienta está en [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

### ¿Cuál es la diferencia entre una habilidad (skill) y un comando?

Ambos son archivos que OpenSpec escribe para que su asistente pueda ejecutar el flujo de trabajo. Las habilidades (`.../skills/openspec-*/SKILL.md`) son el estándar más nuevo entre herramientas; los comandos (`.../commands/opsx-*`) son los archivos con barra (slash files) más antiguos específicos de la herramienta. No necesita elegir. Simplemente escriba el comando con barra, y OpenSpec instalará el que su herramienta utilice.

## El flujo de trabajo

### ¿Por dónde debo empezar si no estoy seguro de qué construir?

Con `/opsx:explore`. Es un compañero de pensamiento sin riesgos que lee su base de código, presenta opciones y convierte un problema vago en un plan concreto, todo antes de que exista cualquier cambio o código. Está en el perfil predeterminado, por lo que siempre está disponible. Cuando el plan esté claro, pasa a `/opsx:propose`. Este es el mejor hábito para formar, ya que evita que una IA entusiasta construya algo equivocado con confianza. Consulte [Explore First](explore.md).

### ¿Cuál es el flujo más simple posible?

```text
/opsx:explore (opcional)   luego   /opsx:propose <lo que quiere>   luego   /opsx:apply   luego   /opsx:archive
```

Explore para pensarlo, proponga para redactar el plan, aplique para construirlo, archive para guardarlo. Omita explorar si ya sabe exactamente lo que quiere.

### ¿Cuál es la diferencia entre `/opsx:propose` y `/opsx:new`?

`/opsx:propose` es el comando predeterminado de un solo paso: crea el cambio y redacta todos los artefactos de planificación a la vez. `/opsx:new` forma parte del conjunto de comandos expandidos y solo crea una modificación vacía, dejándolo para que usted cree los artefactos uno por uno con `/opsx:continue` (o todos a la vez con `/opsx:ff`). Use propose a menos que quiera tener control paso a paso. Consulte [Commands](commands.md).

### ¿Qué son los perfiles `core` y expandidos?

Un perfil decide qué comandos con barra se instalan. **Core** (el predeterminado) le da `propose`, `explore`, `apply`, `sync`, `archive`. El conjunto **expandido** añade `new`, `continue`, `ff`, `verify`, `bulk-archive` y `onboard` para un control más fino. Cambie con `openspec config profile`, luego aplique con `openspec update`.

### ¿Necesito ejecutar `/opsx:sync`?

Generalmente no. Sync fusiona los delta specs de un cambio en sus especificaciones principales, y `/opsx:archive` ofrecerá hacerlo por usted. Ejecute sync manualmente solo cuando quiera que las especificaciones se fusionen antes de archivar, por ejemplo, en un cambio de larga duración. Consulte [Commands](commands.md#opsxsync).

### ¿Cómo edito una propuesta, una especificación o una tarea después de haber comenzado?

Simplemente edite el archivo. Cada artefacto es Markdown plano en `openspec/changes/<name>/`, y no hay ninguna fase bloqueada ni modo de edición especial. Cámbielo a mano, o pida a su IA que lo revise ("actualiza el diseño para usar una cola"), y siga adelante. La IA siempre trabaja a partir del contenido actual del archivo. Guía completa: [Editing & Iterating on a Change](editing-changes.md).

### ¿Puedo retroceder y cambiar el plan después de implementar parte de él?

Sí, en cualquier momento. El flujo de trabajo es fluido, por lo que la revisión y la edición no son fases de las que se pueda quedar excluido. Edite el artefacto y luego continúe. Si desea una verificación estructurada de que el código todavía coincide con el plan, ejecute `/opsx:verify`. Consulte [Editing & Iterating on a Change](editing-changes.md#how-do-i-go-back-to-review-after-implementing).

### Yo edité el código a mano. ¿Cómo lo reconcilio con la especificación?

Tráigalos de vuelta a la sincronía antes de archivar, ya que archivar hace que sus especificaciones sean el registro de la verdad. Si el código es correcto ahora, actualice el delta spec para que coincida con lo que envió; si la especificación es correcta, siga construyendo hasta que el código esté de acuerdo. `/opsx:verify` muestra las discrepancias. Consulte [Editing & Iterating on a Change](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec).

### ¿Cuándo debo actualizar un cambio existente en lugar de comenzar uno nuevo?

Actualice cuando sea el mismo trabajo, refinado. Comience de cero cuando la intención haya cambiado fundamentalmente o el alcance se haya expandido a un trabajo diferente. Hay un diagrama de flujo de decisión y ejemplos en [Workflows](workflows.md#when-to-update-vs-start-fresh).

### ¿Qué pasa si mi sesión se queda sin contexto, o los requisitos cambian a mitad de la implementación?

Aquí es donde las especificaciones demuestran su valor. Debido a que el plan vive en archivos (y no solo en el historial de chat), usted puede despejar su contexto, iniciar una nueva sesión de IA y continuar con `/opsx:apply`; lee los artefactos y reanuda desde la primera tarea sin verificar. Si los requisitos cambian, edite los artefactos para que coincidan con la nueva realidad y continúe. Mantener una ventana de contexto limpia también produce mejores resultados; despeje el contexto antes de la implementación.

### ¿Debo commitear la carpeta `openspec/` a git?

Sí. Sus especificaciones, cambios activos y archivo forman parte del historial de su proyecto. Commítelos como cualquier otro código fuente. El archivo en particular se convierte en un registro duradero de por qué razón funciona su sistema.

## Especificaciones y cambios

### ¿Qué va en una especificación (spec) versus en un diseño?

Una especificación describe el comportamiento observable: lo que hace el sistema, sus entradas, salidas y condiciones de error. Un diseño describe cómo se construirá: el enfoque técnico, las decisiones de arquitectura, los cambios de archivos. Si la implementación puede cambiar sin cambiar el comportamiento visible externamente, pertenece al diseño, no a la especificación. [Concepts](concepts.md#what-a-spec-is-and-is-not) profundiza en esto.

### ¿Qué es una delta spec?

Una especificación que describe solo lo que está cambiando, usando las secciones `ADDED`, `MODIFIED` y `REMOVED`, en lugar de reiterar la especificación completa. Es cómo OpenSpec maneja los cambios en sistemas existentes de manera limpia. Consulte [Concepts](concepts.md#delta-specs).

### ¿A dónde van los cambios archivados?

A `openspec/changes/archive/YYYY-MM-DD-<name>/`, con todos los artefactos preservados. Nada se elimina; el cambio simplemente sale de su lista activa.

## Configuración y personalización

### ¿Cómo le digo a la IA sobre mi pila tecnológica (tech stack)?

Póngalo en `openspec/config.yaml` bajo `context:`. Ese texto se inyecta en cada solicitud de planificación, por lo que la IA siempre conoce su pila y sus convenciones. Consulte [Customization](customization.md#project-configuration).

### ¿Puedo generar especificaciones en un idioma distinto al inglés?

Sí. Agregue una instrucción de idioma a `context:` de su configuración. [Multi-Language](multi-language.md) tiene fragmentos para copiar y pegar para varios idiomas.

### ¿Puedo cambiar el flujo de trabajo en sí mismo?

Sí, con esquemas personalizados (custom schemas). Un esquema define qué artefactos existen y cómo dependen unos de otros. Haga un fork del predeterminado con `openspec schema fork spec-driven my-workflow`, y luego edítelo. Consulte [Customization](customization.md#custom-schemas).

## Modelos, privacidad y actualizaciones

### ¿Qué modelo de IA debo usar?

OpenSpec funciona mejor con modelos de alta capacidad de razonamiento. El README recomienda modelos como Codex 5.5 y Opus 4.7 tanto para la planificación como para la implementación. Mantenga también su ventana de contexto limpia: despeje el contexto antes de la implementación para obtener los mejores resultados.

### ¿OpenSpec recopila datos?

Recopila estadísticas anónimas de uso: nombre del comando y versión solamente. Sin argumentos, rutas, contenido o datos personales, y está desactivado automáticamente en CI. Opte por no participar con `export OPENSPEC_TELEMETRY=0` o `export DO_NOT_TRACK=1`.

### ¿Cómo actualizo?

Dos pasos. Actualice el paquete (`npm install -g @fission-ai/openspec@latest`), luego ejecute `openspec update` dentro de cada proyecto para refrescar las habilidades y comandos generados.

### ¿Cómo desinstalo OpenSpec?

No hay un comando de desinstalación, porque es solo un paquete global más archivos en su proyecto. Elimine el paquete (`npm uninstall -g @fission-ai/openspec`), y opcionalmente elimine el directorio `openspec/` y los archivos de herramientas generados. El proceso paso a paso, incluyendo qué es seguro conservar, está en [Installation: Uninstalling](installation.md#uninstalling).

## Obtener ayuda

### ¿Dónde hago preguntas o reporto errores?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Desde su terminal:** `openspec feedback "su mensaje"` abre un problema de GitHub para usted.

### Estos documentos están mal o son confusos. ¿Qué hago?

Dínnoslo, o arréglenlo. Los PRs (Pull Requests) de documentación son bienvenidos y valorados. Abra un problema o envíe una solicitud de extracción (pull request).