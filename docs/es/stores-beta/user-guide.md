# Stores: Planificación en su propio repositorio

> **Beta.** Las Stores, las references, el working context y los worksets son nuevos. Los nombres de comandos, flags, formatos de archivo y salida JSON pueden seguir cambiando de forma entre versiones. Todos los recorridos paso a paso a continuación se ejecutaron en la compilación actual, pero vuelve a leer esta guía después de actualizar.

## El problema que resuelve

OpenSpec normalmente reside dentro de un único repositorio de código: una carpeta `openspec/` junto a tu código, que almacena especificaciones y cambios para ese repositorio.

Deja de ser suficiente en el momento en que tu planificación supera el alcance de un único repositorio:

- Tu trabajo abarca varios repositorios: una sola funcionalidad afecta al servidor de API, la aplicación web y una biblioteca compartida. ¿En qué carpeta `openspec/` reside el plan?
- Tu equipo planifica antes de que exista el código, o planifica elementos que nunca se convierten en código en *este* repositorio.
- Los requisitos son propiedad de un equipo y son consumidos por otros. La versión de la wiki se desvía, y además tu agente de codificación no puede leerla de todos modos.

Una **store** es la solución: un repositorio independiente cuya única función es la planificación. Cuenta con la misma estructura `openspec/` que ya conoces —especificaciones y cambios— además de un pequeño archivo de identidad. La registras en tu máquina una sola vez, por nombre, y a partir de ese momento todos los comandos normales de OpenSpec pueden funcionar en ella desde cualquier lugar.

## La forma

```
            team-plans  (un store: planificación en su propio repositorio)
            ├── .openspec-store/store.yaml     identidad: "I am team-plans"
            └── openspec/
                ├── specs/      lo que es verdad
                └── changes/    lo que está en movimiento
                      ▲
                      │ registrado en cada máquina por nombre;
                      │ compartido mediante push/clonación como cualquier repositorio
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (repositorio de código)   (repositorio de código)    (repositorio de código)
```

Dos reglas mantienen esto simple:

1. **Un store es solo un repositorio de Git.** Tú haces commit, push, pull y lo revisas tú mismo. OpenSpec nunca clona, sincroniza ni envía nada por su cuenta.
2. **Declaraciones, no maquinaria.** Los repositorios pueden *declarar* cómo se relacionan con los stores (mostrado a continuación). Las declaraciones cambian lo que OpenSpec puede decirte —nunca dónde actúan tus comandos.

## Cinco minutos para tu primer store

Dos comandos te llevan de cero a un cambio funcional con alcance de store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store listo: team-plans
Ubicación: /Users/you/openspec/team-plans
Raíz de OpenSpec: lista
Registro: registrado

Siguiente: ejecuta comandos normales de OpenSpec contra este store, por ejemplo:
  openspec new change <change-id> --store team-plans
Comparte este store haciendo commit y push de él como cualquier repositorio Git.
```

```bash
openspec new change add-login --store team-plans
```

```
Usando la raíz de OpenSpec: team-plans (/Users/you/openspec/team-plans)
Cambio 'add-login' creado en /Users/you/openspec/team-plans/openspec/changes/add-login/
Esquema: spec-driven
Siguiente: openspec status --change add-login --store team-plans
```

Ese es todo el modelo. A partir de aquí, el ciclo de vida es exactamente el que ya conoces —`status`, `instructions`, `validate`, `archive`— con `--store team-plans` en cada comando, y cada sugerencia impresa incluye el flag por ti. La línea `Using OpenSpec root:` siempre te indica dónde está actuando un comando.

## Historia: un equipo, un repositorio de planificación

Un equipo guarda sus especificaciones (specs) y cambios en `team-plans` en lugar de esparcirlos por los repositorios de código.

**Día uno (quien lo configure):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Pasar `--remote` registra la URL de clonación dentro del archivo de identidad propio del store (`.openspec-store/store.yaml`), en el commit inicial. Cada clonación futura nace sabiendo de dónde viene, por lo que las comprobaciones de estado y los mensajes de error pueden mostrar una solución completa y lista para pegar para los compañeros que aún no lo tengan.

**Cada compañero (una vez por máquina):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

A partir de entonces, todos trabajan en el mismo repositorio de planificación por nombre:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Compartir trabajo es git, a propósito.** Un cambio que crees existe solo en tu copia de trabajo hasta que hagas commit y lo envíes —igual que el código. Los planes obtienen ramas, pull requests y revisión de forma gratuita, porque un store es un repositorio ordinario.

**Conectar los repositorios de código del equipo.** Un repositorio de código cuya planificación está completamente externalizada necesita exactamente una línea, en `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Ahora todos los comandos de OpenSpec ejecutados dentro de `web-app` actúan sobre `team-plans` sin necesidad de flags:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Usando la raíz de OpenSpec: team-plans (/Users/you/openspec/team-plans)
...
```

El puntero es un respaldo, nunca una anulación: un `--store` explícito siempre gana, y si el repositorio desarrolla carpetas de planificación propias, estas ganan (con una advertencia de eliminar el puntero obsoleto).

**Un valor predeterminado para todos los repositorios de tu máquina.** Si trabajas en muchos repositorios de código que todos planifican en el mismo store, configúralo una sola vez, de forma global, en lugar de agregar la línea `store:` a cada repositorio:

```bash
openspec config set defaultStore team-plans
```

Ahora cualquier comando ejecutado fuera de una raíz de planificación —y sin `--store` ni puntero de proyecto— se resuelve a `team-plans`. Se encuentra en la parte inferior de la lista de precedencia, por lo que `--store`, una raíz local y el puntero `store:` de un proyecto siguen ganando. El banner de raíz y el bloque JSON `root` informan `source: "global_default"` con el id del store, para que siempre puedas diferenciar un valor predeterminado de toda la máquina del puntero propio de un repositorio. Elimínalo con `openspec config unset defaultStore`. Si el id no está registrado, los comandos arrojan un error y te indican que lo registres o elimines el valor predeterminado obsoleto.

## Historia: requisitos que cruzan los límites de los equipos

Un equipo de plataforma es el propietario de los requisitos. Los equipos de producto construyen basándose en ellos, en sus propios repositorios, con sus propios diseños. Una referencia describe esa relación sin mover el trabajo de nadie.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ lee      │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (sus propios diseños)    │
   │   trabajo de plataforma          │ openspec/changes/        │
   │                          │          │   (su propio trabajo)       │
   └──────────────────────────┘          └──────────────────────────┘
```

**El equipo de producto declara de qué se basa** en el `openspec/config.yaml` de su repositorio:

```yaml
references:
  - platform-reqs
```

Las referencias son contexto de solo lectura. El repositorio mantiene su propia raíz `openspec/`; el trabajo se queda ahí. Lo que cambia: `openspec instructions` en ese repositorio ahora incluye un índice de las especificaciones del store referenciado —cada una con un resumen de una línea y el comando de obtención exacto (`openspec show <spec-id> --type spec --store platform-reqs`). Un agente que trabaje en `api-server` puede encontrar los requisitos de pago upstream, citarlos y escribir su diseño de bajo nivel en la raíz propia del repositorio —sin que nadie tenga que pegar contexto de un lado a otro.

Una referencia puede incluir su fuente de clonación, para que los compañeros que aún no tienen el store obtengan una solución completa en lugar de un callejón sin salida:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Cuando quieras tener el plan y el código abiertos juntos, crea un workset.** Esto es personal y explícito: cada persona elige las carpetas con las que realmente trabaja en su máquina. Nada de esas rutas de copia de trabajo locales se confirma en el repositorio de planificación compartido.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Dos preguntas que siempre puedes hacer

**"¿Mi configuración está sana?"** — `openspec doctor` comprueba la raíz actual y sus stores referenciados, en modo solo lectura, con una solución lista para pegar por cada hallazgo:

```
Doctor

Raíz
  Ubicación: /Users/you/src/api-server
  Raíz de OpenSpec: ok

Referencias
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: El store referenciado 'design-system' no está registrado en esta máquina.
    Solución: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"¿Con qué estoy trabajando?"** — `openspec context` ensambla el conjunto de trabajo a partir de las declaraciones de OpenSpec: la raíz y los stores que referencia.

```
Contexto de trabajo para api-server (/Users/you/src/api-server)

Raíz de OpenSpec
  api-server  /Users/you/src/api-server

Stores referenciados
  platform-reqs  /Users/you/openspec/platform-reqs
    Obtener: openspec show <spec-id> --type spec --store platform-reqs
```

Ambos admiten `--json` para agentes. `openspec context --code-workspace <ruta>` además escribe un archivo de espacio de trabajo de VS Code que contiene todo el conjunto —la única escritura que realiza este comando.

## Worksets: vuelve a abrir las carpetas con las que trabajas juntos

Aparte de todo lo anterior: la mayoría de las personas abren las mismas pocas carpetas juntas en cada sesión —el repositorio de planificación más dos o tres repositorios de código. Un **workset** es una vista personal y con nombre de exactamente eso, que se vuelve a abrir con un solo comando en la herramienta que elijas.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       los tres se abren en tu herramienta
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (se abre en VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` luego lanza la herramienta guardada: los editores (VS Code, Cursor) abren una ventana con todos los miembros y regresan. El primer miembro es el principal. Puedes anular la herramienta en cualquier momento con `--tool <id>`.

Los worksets son deliberadamente *estado no compartido*. Residen en tu máquina, nunca se confirman (hacen commit) y no hacen ninguna afirmación sobre el trabajo —solo registran lo que te gusta tener abierto junto. Eliminar uno nunca toca las carpetas de los miembros. Las nuevas herramientas son configuración, no código: cualquier cosa que se lance mediante un archivo de espacio de trabajo o flags de adjunto por carpeta se puede agregar bajo la clave `openers` en la configuración global (`openspec config edit`).

## Cómo deciden los comandos dónde actuar

Todos los comandos normales resuelven su raíz de la misma manera, en este orden:

```
1. --store <id>          lo indicaste explícitamente        → ese store
2. openspec/ más cercano     una raíz de planificación real aquí     → este repositorio
   (subiendo desde el directorio de trabajo actual)
3. puntero store:        config.yaml declara un store  → ese store
4. defaultStore          la configuración global establece un valor  → ese store
                         predeterminado de máquina
5. ninguna de las anteriores   ¿hay stores registrados en esta     → error con una
                         máquina?                        sugerencia de selección
                         ¿no hay stores registrados?         → el directorio
                                                          actual
                                                          (comportamiento clásico)
```

La línea `Using OpenSpec root:` (y el bloque `root` en la salida `--json`) te indica en qué caso te encuentras.

## Limitaciones conocidas

- **Forma beta.** Todo en esta página puede cambiar entre versiones —nombres, flags, formatos de archivo, claves JSON.
- **Una copia de trabajo por id de store por máquina.** Registrar una segunda copia de trabajo con el mismo id falla con una sugerencia de ejecutar `store unregister` primero.
- **Sin sincronización, nunca —por diseño.** OpenSpec nunca clona, descarga (pull) ni envía (push). Una copia de trabajo obsoleta muestra especificaciones obsoletas hasta que *tú* hagas pull; las referencias se indexan en vivo a partir de lo que haya en el disco.
- **Las carpetas de planificación vacías pueden estar ausentes.** Un store nuevo puede no tener `openspec/changes/`, `openspec/specs/` ni `openspec/changes/archive/` en Git aún. Esto se acepta durante la beta; esas carpetas aparecen una vez que los comandos normales crean archivos en ellas.
- **Los repositorios puntero se mantienen como punteros.** Un repositorio que solo tiene configuración y cuyo `openspec/config.yaml` declara `store: <id>` se trata como planificación externalizada, no como una copia de store para registrar. Elimina la línea `store:` primero si quieres convertir intencionalmente ese repositorio en una raíz de store local.
- **Algunos comandos se quedan donde están.** `view`, `templates`, `schemas` y las formas de sustantivo obsoletas (`openspec change show`, ...) actúan solo en el directorio actual —no admiten `--store`.
- **El estado por máquina es exclusivo de cada máquina.** El registro de stores y los worksets son configuraciones locales. Nada de la disposición de tu máquina se confirma nunca en la planificación compartida.
- **Dos estilos de lanzamiento para worksets.** Una herramienta que no se pueda lanzar con un archivo de espacio de trabajo o flags de adjunto por carpeta no se puede agregar como abridor.
- **El JSON de agentes tiene una división de mayúsculas y minúsculas conocida** (las claves de la familia de stores son snake_case, las de la familia de flujos de trabajo son camelCase). Está documentado en el [contrato de agente](../agent-contract.md); la unificación se pospone hasta una release versionada.

## Dónde se almacena cada elemento

| Elemento | Ubicación | ¿Compartido? |
|---|---|---|
| La planificación de una tienda | `<store>/openspec/` (especificaciones, cambios) | Sí — realiza un commit y un push |
| La identidad de una tienda | `<store>/.openspec-store/store.yaml` | Sí — se incluye en el commit de la tienda |
| El registro de tiendas | `<data dir>/openspec/stores/registry.yaml` | No — solo en esta máquina |
| Conjuntos de trabajo | `<data dir>/openspec/worksets/` | No — solo en esta máquina |

`<data dir>` es `~/.local/share/openspec` en macOS y Linux (o
`$XDG_DATA_HOME/openspec` cuando esté definida), y `%LOCALAPPDATA%\openspec` en
Windows.

## Referencia

Banderas exactas y estructuras JSON de todos los comandos de esta página:
[Referencia de la CLI](../cli.md) (Tiendas, Doctor, Contexto de trabajo, Conjuntos de trabajo
personales) y el [contrato del agente](../agent-contract.md).