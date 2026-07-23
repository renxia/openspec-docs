# Cómo funcionan los comandos

**Lo único que debes saber: OpenSpec tiene dos tipos de comandos, y se ejecutan en dos lugares diferentes.**

- Los comandos `openspec ...` se ejecutan en tu **terminal**. (Ejemplo: `openspec init`.)
- Los comandos `/opsx:...` se ejecutan en el **chat de tu asistente de IA**. (Ejemplo: `/opsx:propose`.)

Si alguna vez escribes `/opsx:propose` en tu terminal y no pasa nada, esta página te explica por qué. Estás hablando con la mitad equivocada de OpenSpec. Los comandos de barra no son comandos de terminal. Son instrucciones que le das a tu asistente de codificación con IA, en el mismo cuadro de chat donde normalmente escribirías "agrega un formulario de inicio de sesión".

Esa única distinción es el obstáculo más común para los usuarios nuevos, así que vamos a dejarlo completamente claro.

## Las dos mitades

OpenSpec es un solo proyecto con dos caras.

**La CLI (mitad de terminal).** Un programa llamado `openspec` que instalas y ejecutas desde tu shell. Configura tu proyecto, lista y valida cambios, muestra un panel de control y archiva el trabajo terminado. Escribes estos comandos en iTerm, la terminal de VS Code, PowerShell, en cualquier lugar donde ejecutarías `git` o `npm`.

```bash
openspec init        # configura OpenSpec en este proyecto
openspec list        # ver cambios activos
openspec view        # abrir el panel de control interactivo
```

**Los comandos de barra (mitad de chat).** Comandos cortos como `/opsx:propose` y `/opsx:apply` que escribes en tu asistente de IA. Estos le indican a la IA que siga el flujo de trabajo de OpenSpec: redactar una propuesta, escribir especificaciones, construir a partir de la lista de tareas, archivar cuando termine. Escribes estos comandos en Claude Code, Cursor, Windsurf, Copilot, o el asistente que uses.

```text
/opsx:propose add-dark-mode    (escrito en el chat de tu IA)
/opsx:apply                    (escrito en el chat de tu IA)
/opsx:archive                  (escrito en el chat de tu IA)
```

Aquí tienes el modelo mental en una sola imagen:

```text
        TU TERMINAL                         EL CHAT DE TU ASISTENTE DE IA
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   instala     │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │  comandos y   │  /opsx:archive                │
   └──────────────────────┘   habilidades  └──────────────────────────────┘
        ejecuta openspec aquí                    ejecuta /opsx:* aquí
```

Fíjate en la flecha. Ejecutar `openspec init` en tu terminal es lo que *instala* los comandos de barra en tu herramienta de IA. La mitad de terminal configura la mitad de chat. Después de eso, el uso diario ocurre principalmente en el chat.

## "¿Cómo empiezo el modo interactivo?"

**No hay un modo interactivo separado para iniciar.** Esta pregunta surge mucho, así que merece una respuesta clara.

No entras a un modo especial de OpenSpec. Solo abres tu asistente de codificación con IA como siempre lo haces, y escribes un comando de barra en el chat. El comando de barra *es* la forma de "entrar" a OpenSpec. Tu asistente lo reconoce, carga la habilidad de OpenSpec correspondiente y empieza a seguir el flujo de trabajo.

Así que las instrucciones reales son:

1. Abre tu asistente de codificación con IA (Claude Code, Cursor, Windsurf, etc.) en tu proyecto.
2. Escribe `/opsx:propose` en su chat, el mismo lugar donde escribes cualquier otra solicitud.
3. Mira el autocompletado: si OpenSpec está instalado, verás aparecer `/opsx:propose`, `/opsx:apply` y otros comandos similares mientras escribes la barra.

Eso es todo. No hay modo que activar, no hay demonio que lanzar, no hay ventana separada.

Una cosa que sí es genuinamente interactiva está en la terminal: `openspec view`. Abre un panel de control para explorar tus especificaciones y cambios. Pero eso es un visor, no la herramienta con la que propones y construyes. La construcción se realiza mediante comandos de barra en el chat.

## Por qué existe esta división

Vale la pena entenderlo, porque explica por qué OpenSpec funciona con más de 25 herramientas de IA diferentes.

La CLI es el **motor**. Conoce las reglas: cómo es una carpeta de cambios, qué artefactos dependen de cuáles, cómo fusionar una especificación delta en tu fuente de verdad. Es igual en todos lados.

Los comandos de barra son el **volante**, y cada herramienta de IA tiene uno ligeramente diferente. Claude Code los llama comandos. Cursor y Windsurf tienen sus propios formatos. Algunas herramientas las llaman habilidades. Cuando ejecutas `openspec init`, OpenSpec genera el tipo de archivo correcto para cada herramienta que seleccionaste, así que la misma intención de `/opsx:propose` funciona sin importar qué asistente prefieras.

La fortaleza de este diseño: aprendes el flujo de trabajo una vez y lo usas en todas las herramientas. El intercambio: la sintaxis exacta de un comando puede diferir ligeramente entre herramientas, lo que se explica en la siguiente sección.

## Sintaxis de comandos de barra por herramienta

La intención es idéntica en todos lados. Lo que cambia es la puntuación. Usa la forma que coincida con tu asistente.

| Herramienta | Cómo lo escribes |
|-------------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | estilo de habilidad, por ejemplo `/openspec-propose` |
| Codex | estilo de habilidad mediante `.codex/skills/openspec-*` |
| Oh My Pi | `/opsx-propose`, `/opsx:apply` |
| Kimi CLI | estilo de habilidad, por ejemplo `/skill:openspec-propose` |
| Trae | `/opsx-propose`, `/opsx-apply` |

La mayoría de las herramientas usan o la forma con dos puntos (`/opsx:propose`) o la forma con guion (`/opsx-propose`). Algunas herramientas muestran OpenSpec como habilidades con nombre en lugar de comandos de barra; para esas invocas la habilidad por su nombre. La lista completa por herramienta, incluyendo exactamente qué archivos se escriben en cada lugar, está en [Herramientas compatibles](supported-tools.md).

Si tienes dudas, escribe una barra en el chat de tu IA y mira el autocompletado. Tu herramienta te mostrará la forma que espera.

## Cómo llegaron los comandos: habilidades y comandos

Cuando ejecutas `openspec init` (o `openspec update`), OpenSpec escribe archivos pequeños en tu proyecto para que tu herramienta de IA pueda encontrar el flujo de trabajo. Dependiendo de tu herramienta y su configuración, estos son **habilidades**, **comandos** o ambos.

- Las **habilidades** se encuentran en lugares como `.claude/skills/openspec-*/SKILL.md`. Son el estándar emergente multiplataforma: una carpeta de instrucciones que tu asistente detecta automáticamente.
- Los **comandos** se encuentran en lugares como `.claude/commands/opsx/<id>.md`. Son los archivos de comandos de barra más antiguos, específicos de cada herramienta. Codex no recibe archivos de comando generados; usa `.codex/skills/openspec-*`.

No tienes que preocuparte por cuál usa tu herramienta. Solo escribes el comando de barra y funciona. Pero saber que estos archivos existen ayuda cuando algo sale mal: si tus comandos desaparecen, generalmente significa que estos archivos faltan o están desactualizados, y `openspec update` los regenera.

Consulta [Herramientas compatibles](supported-tools.md) para ver las rutas exactas por herramienta, y [Guía de migración](migration-guide.md) para ver cómo las habilidades reemplazaron el enfoque anterior solo de comandos.

## Confirmar que está instalado

Comprobaciones rápidas, de la más rápida a la más lenta:

1. **Escribe una barra en el chat de tu IA.** Empieza a escribir `/opsx` y mira las sugerencias de autocompletado. Si aparecen, ya está listo.
2. **Busca los archivos.** Para Claude Code, comprueba que `.claude/skills/` contenga carpetas `openspec-*`. Otras herramientas usan sus propios directorios ([Herramientas compatibles](supported-tools.md) los enumera).
3. **Vuelve a ejecutar la configuración.** Desde la raíz de tu proyecto, ejecuta `openspec update`. Esto regenera los archivos de habilidades y comandos para las herramientas que hayas configurado.
4. **Reinicia tu asistente.** Muchas herramientas buscan habilidades y comandos al iniciarse, así que una ventana nueva puede ser el paso que faltaba.

## ¿Qué comandos tengo?

De forma predeterminada, OpenSpec instala el conjunto de comandos de barra **núcleo**:

- `/opsx:explore`: piensa una idea con la IA antes de comprometerte con un cambio (primer paso ideal cuando no estás seguro)
- `/opsx:propose`: crea un cambio y redacta todos sus artefactos de planificación en un solo paso
- `/opsx:apply`: construye el cambio trabajando a través de su lista de tareas
- `/opsx:sync`: fusiona las actualizaciones de especificaciones de un cambio en tus especificaciones principales (generalmente automático)
- `/opsx:archive`: finaliza un cambio y lo archiva

Un buen ritmo predeterminado: `explore` cuando estás decidiendo qué hacer, luego `propose`, `apply`, `archive`. La guía [Explora primero](explore.md) explica por qué ese paso inicial vale la pena.

También hay un conjunto **ampliado** para quienes quieren un control más detallado (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Lo activas con `openspec config profile`, luego lo aplicas con `openspec update`.

¿Eres nuevo en todo esto? `/opsx:onboard` (en el conjunto ampliado) te guía por un cambio completo en tu propia base de código, narrando cada paso. Es la introducción más amigable posible.

Para ver qué hace cada comando en detalle, consulta [Comandos](commands.md). Para saber cuándo usar cada uno, consulta [Flujos de trabajo](workflows.md).

## Una primera ejecución limpia

Juntando todo, aquí está toda la secuencia con cada paso etiquetado por el lugar donde ocurre.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd tu-proyecto
TERMINAL   $ openspec init
              (instala los comandos de barra en tu herramienta de IA)

CHAT DE IA      /opsx:explore
              (opcional: piensa la idea primero con la IA)

CHAT DE IA      /opsx:propose add-dark-mode
              (la IA redacta la propuesta, especificaciones, diseño y tareas)

CHAT DE IA      /opsx:apply
              (la IA lo construye, marcando las tareas como completadas)

CHAT DE IA      /opsx:archive
              (el cambio se fusiona en tus especificaciones y se archiva)
```

Dos pasos en la terminal para configurar. Luego te mueves al chat. Ese es el ritmo.

## Relacionado

- [Primeros pasos](getting-started.md): la guía completa para el primer cambio
- [Comandos](commands.md): todos los comandos de barra en detalle
- [CLI](cli.md): todos los comandos de terminal en detalle
- [Herramientas compatibles](supported-tools.md): sintaxis por herramienta y ubicaciones de archivos
- [Preguntas frecuentes](faq.md): más respuestas rápidas
- [Solución de problemas](troubleshooting.md): soluciones cuando los comandos no aparecen