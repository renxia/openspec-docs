# Glosario

Cada término de OpenSpec en un solo lugar, definido en lenguaje sencillo. Léalo una vez y el resto de la documentación se leerá más rápido.

Los términos están agrupados por tema y luego alfabetizados dentro de cada grupo.

## Los sustantivos centrales

**Spec.** Un documento que describe cómo funciona parte de tu sistema. Los specs residen en `openspec/specs/`, están organizados por dominio y están compuestos por requisitos y escenarios. El spec es la respuesta acordada a "¿qué hace este software?". Ver [Conceptos](concepts.md#specs).

**Source of truth.** El directorio `openspec/specs/` en su totalidad. Contiene el comportamiento actual y acordado de tu sistema. Los cambios proponen ediciones al mismo; el archivo lo aplica.

**Change.** Una unidad de trabajo, empaquetada como una carpeta bajo `openspec/changes/<name>/`. Un cambio contiene todo sobre ese trabajo: su propuesta, diseño, tareas y las ediciones del spec que introduce. Un cambio, una característica o corrección.

**Artifact.** Un documento dentro de un cambio. Los artefactos estándar son la propuesta, los delta specs, el diseño y las tareas. Se crean en orden de dependencia y se alimentan mutuamente.

**Delta spec.** Un spec dentro de un cambio que describe solo lo que está cambiando, utilizando secciones `ADDED`, `MODIFIED` y `REMOVED`, en lugar de reescribir todo el spec. Esto es lo que permite a OpenSpec editar sistemas existentes de manera limpia. Ver [Conceptos](concepts.md#delta-specs).

**Domain.** Una agrupación lógica para los specs, como `auth/`, `payments/` o `ui/`. Tú eliges dominios que coincidan con cómo piensas en tu sistema.

## Dentro de un spec

**Requirement.** Un comportamiento único que el sistema debe tener, generalmente escrito con una palabra clave de RFC 2119: "El sistema DEBE expirar las sesiones después de 30 minutos." Los requisitos establecen el *qué*, no el *cómo*.

**Scenario.** Un ejemplo concreto y comprobable de un requisito en acción, típicamente en formato Dado/Cuando/Entonces. Los escenarios hacen que un requisito sea verificable: podrías escribir una prueba automatizada a partir de uno.

**RFC 2119 keywords.** Las palabras MUST, SHALL, SHOULD y MAY, que llevan un significado estandarizado sobre cuán estricto es un requisito. MUST y SHALL son absolutos. SHOULD es recomendado con margen para excepciones. MAY es opcional. El nombre proviene del documento de estándares de internet que los definió.

## Los artefactos

**Proposal (`proposal.md`).** El *por qué* y el *qué* de un cambio: su intención, alcance y enfoque de alto nivel. Es el primer artefacto que creas.

**Design (`design.md`).** El *cómo*: enfoque técnico, decisiones de arquitectura y los archivos que esperas tocar. Opcional para cambios sencillos.

**Tasks (`tasks.md`).** La lista de verificación de implementación, con casillas de verificación. La IA la revisa durante `/opsx:apply` y marca los elementos a medida que avanza.

## El ciclo de vida

**Archive.** El acto de finalizar un cambio. Sus delta specs se fusionan en los specs principales, y la carpeta del cambio se mueve a `openspec/changes/archive/YYYY-MM-DD-<name>/`. Después de archivar, tus specs describen la nueva realidad. Ver [Conceptos](concepts.md#archive).

**Sync.** La fusión de los delta specs de un cambio en los specs principales *sin* archivar el cambio. Generalmente es automático (archivar ofrece hacerlo), pero está disponible por sí solo como `/opsx:sync` para cambios de larga duración. Ver [Comandos](commands.md#opsxsync).

## Flujo de trabajo y comandos

**OPSX.** El flujo de trabajo estándar actual de OpenSpec, construido en torno a acciones fluidas en lugar de fases rígidas. Todos sus comandos slash comienzan con `/opsx:`. Ver [Flujo de trabajo OPSX](opsx.md).

**Slash command.** Un comando que escribes en el chat de tu asistente de IA, como `/opsx:propose`. Los comandos slash impulsan el flujo de trabajo. No son comandos de terminal. Ver [Cómo funcionan los Comandos](how-commands-work.md).

**Explore (`/opsx:explore`).** El comando compañero de pensamiento. Lee tu base de código, compara opciones y clarifica una idea vaga en un plan concreto, sin crear artefactos ni escribir código. Es el punto de partida recomendado siempre que tienes un problema pero aún no un plan. Ver [Explorar Primero](explore.md).

**CLI.** El programa `openspec` que ejecutas en tu terminal. Configura proyectos, lista y valida cambios, abre el dashboard y archiva. La mitad de OpenSpec de la terminal. Ver [CLI](cli.md).

**Skill.** Una carpeta de instrucciones (`.../skills/openspec-*/SKILL.md`) que tu asistente de IA detecta y sigue automáticamente. Los Skills son el estándar emergente inter-herramientas para entregar el flujo de trabajo de OpenSpec a tu asistente.

**Command file.** Un archivo de comando slash por herramienta (`.../commands/opsx-*`). El mecanismo de entrega más antiguo, aún soportado junto con los skills. Rara vez debes tocar estos directamente.

**Profile.** El conjunto de comandos slash instalados en tu proyecto. **Core** (el predeterminado) es `propose`, `explore`, `apply`, `sync`, `archive`. El conjunto **expandido** añade `new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`. Cámbialo con `openspec config profile`.

**Delivery.** Si OpenSpec instala skills, archivos de comandos o ambos para tus herramientas. Se configura globalmente y se aplica con `openspec update`.

## Personalización

**Schema.** La definición de qué artefactos tiene un flujo de trabajo y cómo dependen unos de otros. El predeterminado integrado es `spec-driven` (propuesta → specs → diseño → tareas). Puedes bifurcarlo o escribir el tuyo propio. Ver [Personalización](customization.md#custom-schemas).

**Template.** Un archivo Markdown dentro de un schema que da forma a lo que la IA genera para un artefacto dado. Editar una plantilla cambia inmediatamente la salida de la IA, sin necesidad de reconstruir.

**Project config (`openspec/config.yaml`).** Configuraciones por proyecto: el schema predeterminado, el `context:` inyectado en cada solicitud de planificación y las `rules:` por artefacto. La forma más fácil de enseñarle a OpenSpec sobre tu stack y convenciones. Ver [Personalización](customization.md#project-configuration).

**Context injection.** Poner el trasfondo del proyecto en el campo `context:` de `config.yaml` para que se añada automáticamente a cada artefacto que genera la IA. Es más fiable que esperar que la IA lea un archivo separado.

**Dependency graph.** El grafo dirigido formado por las relaciones `requires:` de los artefactos. Es un DAG (grafo acíclico dirigido: las flechas solo apuntan hacia adelante, nunca en un bucle), y OpenSpec lo utiliza para saber qué puedes crear a continuación.

**Enablers, not gates.** El principio de que las dependencias de los artefactos muestran lo que se vuelve *posible* a continuación, no lo que es *requerido* a continuación. Puedes revisar y editar cualquier artefacto en cualquier momento. Ver [Conceptos Centrales de un Vistazo](overview.md#enablers-not-gates).

## Coordinación entre repositorios (beta)

Estos términos solo se aplican si tu planificación abarca más de un repositorio. Están en beta. La mayoría de los usuarios pueden ignorarlos. Ver la [Guía del Usuario de Stores](stores-beta/user-guide.md).

**Store.** Un repositorio independiente cuya única función es la planificación. Tiene la misma forma `openspec/` que ya conoces (specs y cambios) más un pequeño archivo de identidad. Lo registras en tu máquina una vez, por nombre, y luego cualquier comando OpenSpec puede funcionar en él desde cualquier lugar.

**Reference.** Una declaración, en el `openspec/config.yaml` de un repositorio de código, de un store en el que ese repositorio se basa. Las Referencias son de solo lectura: el repositorio mantiene su propia raíz, y `openspec instructions` obtiene un índice de los specs del store referenciado, cada uno con el comando exacto para recuperarlo.

**Working context.** Lo que `openspec context` ensambla para el repositorio actual: su raíz OpenSpec más cada store que referencia, junto con cómo obtenerlo. La respuesta a "¿con qué estoy trabajando?".

**Workset.** Un conjunto personal de carpetas locales que abres juntas (un store junto con los repositorios de código en los que trabajas). Creado explícitamente con `openspec workset create`; nada de esos caminos locales se compromete al repositorio de planificación compartido.

## Ver también

- [Conceptos Centrales de un Vistazo](overview.md): las cinco ideas, en una página
- [Conceptos](concepts.md): la explicación detallada
- [Cómo Funcionan los Comandos](how-commands-work.md): comandos slash versus CLI