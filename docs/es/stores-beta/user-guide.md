# Almacenes: Planificar en su Propio Repositorio

> **Beta.** Los almacenes (Stores), las referencias, el contexto de trabajo y los conjuntos de trabajo (worksets) son nuevos. Los nombres de comandos, las banderas (flags), los formatos de archivo y la salida JSON aún pueden cambiar entre versiones. Cada recorrido a continuación se ejecutó contra la compilación actual, pero vuelva a leer esta guía después de actualizar.

## El problema que esto resuelve

OpenSpec normalmente reside dentro de un repositorio de código: una carpeta openspec/ junto a su código, conteniendo especificaciones y cambios para ese repositorio.

Esto ya no es suficiente cuando su planificación es más grande que un solo repositorio:

- Su trabajo abarca varios repositorios; una característica toca el servidor API, la aplicación web y una librería compartida. ¿En qué carpeta openspec/ reside el plan?
- Su equipo planea antes de que exista el código, o planea cosas que nunca se convierten en código en *este* repositorio.
- Los requisitos son propiedad de un equipo y son consumidos por otros. La versión del wiki se desvía, y su agente de codificación no puede leerla de todos modos.

Un **almacén (store)** es la respuesta: un repositorio independiente cuya única función es la planificación. Tiene la misma estructura openspec/ que ya conoce — especificaciones y cambios — además de un pequeño archivo de identidad. Lo registra en su máquina una vez, por nombre, y luego cada comando normal de OpenSpec puede funcionar en él desde cualquier lugar.

## La estructura

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Dos reglas mantienen esto sencillo:

1. **Un almacén es solo un repositorio Git.** Tú lo comprometes, lo subes, lo bajas y lo revisas tú mismo. OpenSpec nunca clona, sincroniza ni sube nada por sí mismo.
2. **Declaraciones, no maquinaria.** Los repositorios pueden *declarar* cómo se relacionan con los almacenes (mostrado a continuación). Las declaraciones cambian lo que OpenSpec puede decirte, pero nunca dónde actúan tus comandos.

## Cinco minutos para tu primer almacén

Dos comandos te llevan de la nada a un cambio funcional y limitado al almacén:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

Ese es el modelo completo. A partir de aquí, el ciclo de vida es exactamente lo que sabes: `status`, `instructions`, `validate`, `archive` — con `--store team-plans` en cada comando, y cada pista impresa te da la bandera necesaria. La línea `Using OpenSpec root:` siempre te dice dónde está actuando un comando.

## Historia: un equipo, un repositorio de planificación

Un equipo mantiene sus especificaciones y cambios en `team-plans` en lugar de dispersarlos por varios repositorios de código.

**Día uno (quienquiera que lo configure):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Al pasar `--remote`, se registra la URL de clonación dentro del archivo de identidad del propio almacén (`.openspec-store/store.yaml`), en el commit inicial. Cada clonación futura nace sabiendo de dónde vino, por lo que las comprobaciones de salud y los mensajes de error pueden imprimir una solución completa y copiable para los compañeros de equipo que aún no la tienen.

**Cada compañero de equipo (una vez por máquina):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

A partir de entonces, todos trabajan en el mismo repositorio de planificación por su nombre:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Compartir trabajo es Git, deliberadamente.** Un cambio que creas existe solo en tu checkout hasta que lo comprometes y lo subes, igual que el código. Los planes obtienen ramas, solicitudes de extracción (pull requests) y revisión gratis, porque un almacén es un repositorio ordinario.

**Conectando los repositorios de código del equipo.** Un repositorio de código cuya planificación está completamente externalizada necesita exactamente una línea, en `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Ahora, cada comando OpenSpec ejecutado dentro de `web-app` actúa sobre `team-plans` sin necesidad de banderas:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

El puntero es un plan de respaldo, nunca una anulación: un `--store` explícito siempre gana, y si el repositorio crece con sus propias carpetas de planificación, estas ganan (con una advertencia para eliminar el puntero obsoleto).

## Historia: requisitos que cruzan líneas de equipo

Un equipo de plataforma es dueño de los requisitos. Los equipos de producto construyen basándose en ellos, en sus propios repositorios, con sus propios diseños. Una referencia describe esa relación sin mover el trabajo de nadie.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          │          └──────────────────────────┘
   └──────────────────────────┘
```

**El equipo de producto declara sobre qué se basa** en su `openspec/config.yaml`:

```yaml
references:
  - platform-reqs
```

Las referencias son contexto de solo lectura. El repositorio mantiene su propia raíz `openspec`; el trabajo permanece allí. ¿Qué cambia? `openspec instructions` en ese repositorio ahora incluye un índice de las especificaciones del almacén referenciado — cada una con un resumen de una línea y el comando exacto para obtener (`openspec show <spec-id> --type spec --store platform-reqs`). Un agente trabajando en `api-server` puede encontrar los requisitos de pago ascendentes, citarlos y escribir su diseño de bajo nivel en la propia raíz del repositorio — sin que nadie tenga que pegar el contexto.

Una referencia puede llevar su fuente de clonación, por lo que los compañeros de equipo que aún no tienen el almacén obtienen una solución completa en lugar de un callejón sin salida:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Cuando quieres que el plan y el código estén abiertos juntos, crea un conjunto de trabajo (workset).** Esto es personal y explícito: cada persona elige las carpetas con las que realmente trabaja en su máquina. Nada sobre esas rutas de checkout local se compromete al repositorio de planificación compartido.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Dos preguntas que siempre puedes hacer

**"¿Mi configuración es saludable?"** — `openspec doctor` comprueba la raíz actual y sus almacenes referenciados, de solo lectura, con una solución copiable por cada hallazgo:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: The referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"¿Con qué estoy trabajando?"** — `openspec context` ensambla el conjunto de trabajo a partir de las declaraciones de OpenSpec: la raíz y los almacenes que referencia.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Ambos soportan `--json` para agentes. `openspec context --code-workspace <path>` además escribe un archivo de espacio de trabajo de VS Code que contiene el conjunto completo — la única escritura que realiza este comando.

## Conjuntos de trabajo (Worksets): reabrir las carpetas en las que trabajas juntos

Separado de todo lo anterior: la mayoría de las personas abren las mismas pocas carpetas juntas en cada sesión — el repositorio de planificación más dos o tres repositorios de código. Un **conjunto de trabajo** es una vista personal y nombrada de exactamente eso, reabierta con un comando en tu herramienta elegida.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` luego lanza la herramienta guardada: los editores (VS Code, Cursor) abren una ventana con cada miembro y listo. El primer miembro es el principal. Anula la herramienta en cualquier momento con `--tool <id>`.

Los conjuntos de trabajo deliberadamente *no* son estado compartido. Viven en tu máquina, nunca se comprometen y no hacen afirmaciones sobre el trabajo — solo registran lo que te gusta tener abierto juntos. Eliminar uno nunca toca las carpetas del miembro. Las herramientas nuevas son configuración, no código: cualquier cosa lanzada a través de un archivo de espacio de trabajo o banderas de adjunto por carpeta puede añadirse bajo la clave `openers` en la configuración global (`openspec config edit`).

## Cómo los comandos deciden dónde actuar

Cada comando normal resuelve su raíz de la misma manera, en este orden:

```
1. --store <id>          tú lo dijiste explícitamente        → ese almacén
2. nearest openspec/     una raíz de planificación real aquí     → este repositorio
   (subiendo desde cwd)
3. store: pointer        config.yaml declara un almacén  → ese almacén
4. none of the above     ¿almacenes registrados en esta     → error con una
                         máquina?                        pista de selección
                         ¿ningún almacén registrado?         → el directorio actual
                                                          (comportamiento clásico)
```

La línea `Using OpenSpec root:` (y el bloque `root` en la salida `--json`) te dice en qué caso estás.

## Limitaciones conocidas

- **Forma beta.** Todo en esta página puede cambiar entre versiones — nombres, banderas, formatos de archivo, claves JSON.
- **Un checkout por ID de almacén por máquina.** Registrar un segundo checkout bajo el mismo ID falla con una pista para `store unregister` primero.
- **Sin sincronización, nunca — por diseño.** OpenSpec nunca clona, baja ni sube. Un checkout obsoleto muestra especificaciones obsoletas hasta que *tú* bajas; las referencias se indexan en vivo desde lo que esté en disco.
- **Algunos comandos permanecen donde están.** `view`, `templates`, `schemas` y las formas nominales obsoletas (`openspec change show`, ...) actúan solo sobre el directorio actual — no requieren `--store`.
- **El estado por máquina es local a la máquina.** El registro de almacenes y los conjuntos de trabajo son configuraciones locales. Nada sobre el diseño de tu máquina se compromete nunca al planificación compartido.
- **Dos estilos de lanzamiento para conjuntos de trabajo.** Una herramienta que no puede ser lanzada con un archivo de espacio de trabajo o banderas de adjunto por carpeta no puede añadirse como un `opener`.
- **El JSON del agente tiene una división de mayúsculas conocida** (las claves de la familia *store* usan `snake_case`, las de la familia *workflow* usan `camelCase`). Documentado en el [contrato del agente](../agent-contract.md); su unificación está aplazada hasta una versión con numeración.

## Dónde residen las cosas

| Qué | Dónde | ¿Compartido? |
|---|---|---|
| La planificación de un almacén | `<store>/openspec/` (specs, changes) | Sí — compromételo y súbelo |
| La identidad de un almacén | `<store>/.openspec-store/store.yaml` | Sí — comprometido con el almacén |
| El registro del almacén | `<data dir>/openspec/stores/registry.yaml` | No — solo esta máquina |
| Conjuntos de trabajo (Worksets) | `<data dir>/openspec/worksets/` | No — solo esta máquina |

`<data dir>` es `~/.local/share/openspec` en macOS y Linux (o `$XDG_DATA_HOME/openspec` cuando está establecido), y `%LOCALAPPDATA%\openspec` en Windows.
## Referencia

Banderas exactas y formas JSON para cada comando de esta página:
[CLI reference](../cli.md) (Almacenes, Doctor, Contexto de trabajo, Conjuntos de trabajo personales) y el [contrato del agente](../agent-contract.md).