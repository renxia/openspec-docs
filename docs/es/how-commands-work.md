# Cómo Funcionan los Comandos

**La única cosa que debes saber es que OpenSpec tiene dos tipos de comandos, y estos se ejecutan en dos lugares diferentes.**

- Los comandos `openspec ...` se ejecutan en tu **terminal**. (Ejemplo: `openspec init`.)
- Los comandos `/opsx:...` se ejecutan en el **chat de tu asistente de IA**. (Ejemplo: `/opsx:propose`.)

Si alguna vez escribes `/opsx:propose` en tu terminal y no sucede nada, esta página es la razón. Estás hablando con la mitad equivocada de OpenSpec. Los comandos slash no son comandos de terminal. Son instrucciones que le das a tu asistente de codificación de IA, en la misma caja de chat donde normalmente escribirías "añadir un formulario de inicio de sesión".

Esta única distinción es el obstáculo más común para los nuevos usuarios, así que vamos a dejarlo absolutamente claro.

## Las dos mitades

OpenSpec es un proyecto con dos sombreros.

**La CLI (la mitad de la terminal).** Un programa llamado `openspec` que instalas y ejecutas desde tu shell. Configura tu proyecto, lista y valida cambios, muestra un panel de control y archiva el trabajo terminado. Escribes esto en iTerm, en la terminal de VS Code, PowerShell, donde sea que ejecutes `git` o `npm`.

```bash
openspec init        # configura OpenSpec en este proyecto
openspec list        # ver los cambios activos
openspec view        # abrir el panel de control interactivo
```

**Los comandos slash (la mitad del chat).** Comandos cortos como `/opsx:propose` y `/opsx:apply` que escribes en tu asistente de IA. Estos le dicen a la IA que siga el flujo de trabajo de OpenSpec: redactar una propuesta, escribir especificaciones, construir a partir de la lista de tareas, archivar cuando esté terminado. Escribes esto en Claude Code, Cursor, Windsurf, Copilot o el asistente que uses.

```text
/opsx:propose add-dark-mode    (escrito en tu chat de IA)
/opsx:apply                    (escrito en tu chat de IA)
/opsx:archive                  (escrito en tu chat de IA)
```

Aquí está el modelo mental en una imagen:

```text
        TU TERMINAL                         EL CHAT DE TU ASISTENTE DE IA
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   instala    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   comandos    │  /opsx:archive                │
   └──────────────────────┘    & habilidades   └──────────────────────────────┘
        ejecuta openspec aquí                       ejecuta /opsx:* aquí
```

Nótese la flecha. Ejecutar `openspec init` en su terminal es lo que *instala* los comandos slash en su herramienta de IA. La mitad de la terminal configura la mitad del chat. Después de eso, la operación diaria se realiza principalmente en el chat.

## "¿Cómo empiezo el modo interactivo?"

**No hay un modo interactivo separado para iniciar.** Esta pregunta surge mucho, por lo que merece una respuesta clara.

No entras en un modo especial de OpenSpec. Simplemente abres tu asistente de codificación de IA como siempre y escribes un comando slash en el chat. El comando slash *es* cómo "entrar" a OpenSpec. Tu asistente lo reconoce, carga la habilidad (skill) correspondiente de OpenSpec y comienza a seguir el flujo de trabajo.

Así que las instrucciones reales son:

1. Abre tu asistente de codificación de IA (Claude Code, Cursor, Windsurf, etc.) en tu proyecto.
2. Escribe `/opsx:propose` en su chat, en el mismo lugar donde escribes cualquier otra solicitud.
3. Observa la autocompletación: si OpenSpec está instalado, verás que aparecen `/opsx:propose`, `/opsx:apply` y amigos mientras escribes el slash.

Eso es todo. No hay modo para activar, ni demonio (daemon) para lanzar, ni ventana separada.

Una cosa que *sí* es genuinamente interactiva vive en la terminal: `openspec view`. Abre un panel de control para navegar por tus especificaciones y cambios. Pero eso es un visor, no la herramienta con la que propones y construyes. La construcción se realiza a través de comandos slash en el chat.

## Por qué existe esta división

Vale la pena entenderlo, porque explica por qué OpenSpec funciona con más de 25 herramientas de IA diferentes.

La CLI es el **motor**. Conoce las reglas: cómo se ve una carpeta de cambios, qué artefactos dependen de cuáles, cómo fusionar una especificación delta en tu fuente de verdad. Es lo mismo en todas partes.

Los comandos slash son el **volante**, y cada herramienta de IA tiene uno ligeramente diferente. Claude Code los llama comandos. Cursor y Windsurf tienen sus propios formatos. Algunas herramientas los llaman habilidades (skills). Cuando ejecutas `openspec init`, OpenSpec genera el tipo correcto de archivo para cada herramienta que seleccionaste, por lo que la misma intención `/opsx:propose` funciona sin importar qué asistente prefieras.

La fortaleza de este diseño es que aprendes el flujo de trabajo una vez y lo llevas a través de diferentes herramientas. La contrapartida: la sintaxis exacta de un comando puede diferir ligeramente entre las herramientas, lo cual es el siguiente tema.

## Sintaxis de comandos slash por herramienta

La intención es idéntica en todas partes. La puntuación difiere. Usa el formato que coincida con tu asistente.

| Herramienta | Cómo lo escribes |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | estilo skill, ej. `/skill:openspec-propose` |
| Trae | estilo skill, ej. `/openspec-propose` |

La mayoría de las herramientas usan el formato con dos puntos (`/opsx:propose`) o el formato con guion (`/opsx-propose`). Algunas herramientas exponen OpenSpec como habilidades (skills) con nombre en lugar de comandos slash; para esas invocas la habilidad por su nombre. La lista completa por herramienta, incluyendo exactamente qué archivos se escriben dónde, se encuentra en [Supported Tools](supported-tools.md).

En caso de duda, escribe un slash en tu chat de IA y mira la autocompletación. Tu herramienta te mostrará el formato que espera.

## Cómo llegaron los comandos: skills y comandos

Cuando ejecutas `openspec init` (o `openspec update`), OpenSpec escribe pequeños archivos en tu proyecto para que tu herramienta de IA pueda encontrar el flujo de trabajo. Dependiendo de tu herramienta y configuración, estos son **skills**, **comandos** o ambos.

- Los **Skills** residen en lugares como `.claude/skills/openspec-*/SKILL.md`. Son el estándar emergente multiherramienta: una carpeta de instrucciones que tu asistente detecta automáticamente.
- Los **Comandos** residen en lugares como `.claude/commands/opsx/<id>.md`. Son los archivos de comando slash per herramienta más antiguos.

No tienes que preocuparte por cuál usa tu herramienta. Simplemente escribes el comando slash y funciona. Pero saber que estos archivos existen ayuda cuando algo sale mal: si tus comandos desaparecen, generalmente significa que estos archivos están ausentes o desactualizados, y `openspec update` los regenera.

Consulta [Supported Tools](supported-tools.md) para las rutas exactas por herramienta, y [Migration Guide](migration-guide.md) para cómo las habilidades reemplazaron el enfoque anterior basado únicamente en comandos.

## Confirmando que está instalado

Verificaciones rápidas, lo más rápido posible:

1. **Escribe un slash en tu chat de IA.** Comienza a escribir `/opsx` y busca sugerencias de autocompletado. Si aparecen, estás listo.
2. **Busca los archivos.** Para Claude Code, verifica que `.claude/skills/` contenga carpetas `openspec-*`. Otras herramientas usan sus propios directorios ([Supported Tools](supported-tools.md) los enumera).
3. **Vuelve a ejecutar la configuración.** Desde la raíz de tu proyecto, ejecuta `openspec update`. Esto regenera los archivos de skill y comando para las herramientas que configuraste.
4. **Reinicia tu asistente.** Muchas herramientas escanean en busca de skills y comandos al iniciar, por lo que una ventana fresca puede ser el paso que falta.

## ¿Qué comandos tengo?

Por defecto, OpenSpec instala el conjunto **principal** de comandos slash:

- `/opsx:explore`: reflexiona sobre una idea con la IA antes de comprometerte con un cambio (un gran primer paso cuando no estás seguro)
- `/opsx:propose`: crea un cambio y redacta todos sus artefactos de planificación en un solo paso
- `/opsx:apply`: construye el cambio trabajando a través de su lista de tareas
- `/opsx:sync`: fusiona las actualizaciones de la especificación de un cambio en tus especificaciones principales (generalmente automático)
- `/opsx:archive`: finaliza un cambio y lo archiva

Un buen ritmo predeterminado es: `explore` cuando estás averiguando qué hacer, luego `propose`, `apply`, `archive`. La guía [Explore First](explore.md) explica por qué vale la pena ese paso inicial.

También hay un conjunto **expandido** para las personas que desean un control más fino (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Lo activas con `openspec config profile` y luego lo aplicas con `openspec update`.

¿Eres nuevo en todo esto? `/opsx:onboard` (en el conjunto expandido) te guía a través de un cambio completo en tu propia base de código, narrando cada paso. Es la introducción más amigable posible.

Para qué hace cada comando en detalle, consulta [Commands](commands.md). Para cuándo usar cuál, consulta [Workflows](workflows.md).

## Una primera ejecución limpia

Juntándolo todo, aquí está toda la secuencia con cada paso etiquetado por dónde ocurre.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (instala comandos slash en tu herramienta de IA)

AI CHAT      /opsx:explore
              (opcional: reflexiona sobre la idea con la IA primero)

AI CHAT      /opsx:propose add-dark-mode
              (la IA redacta la propuesta, las especificaciones, el diseño y las tareas)

AI CHAT      /opsx:apply
              (la IA lo construye, marcando las tareas)

AI CHAT      /opsx:archive
              (el cambio se fusiona en tus especificaciones y se archiva)
```

Dos pasos de terminal para configurar. Luego vives en el chat. Ese es el ritmo.

## Relacionado

- [Getting Started](getting-started.md): la guía completa para el primer cambio
- [Commands](commands.md): cada comando slash en detalle
- [CLI](cli.md): cada comando de terminal en detalle
- [Supported Tools](supported-tools.md): sintaxis y ubicaciones de archivos por herramienta
- [FAQ](faq.md): más respuestas rápidas
- [Troubleshooting](troubleshooting.md): soluciones cuando los comandos no aparecen