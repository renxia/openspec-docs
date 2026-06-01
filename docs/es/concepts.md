# Conceptos

Esta guía explica las ideas centrales detrás de OpenSpec y cómo se integran entre sí. Para su uso práctico, consulte [Primeros pasos](getting-started.md) y [Flujos de trabajo](workflows.md).

## Filosofía

OpenSpec se basa en cuatro principios:

```
fluidez no rigidez         — sin puertas de fase, trabaja en lo que tenga sentido
iterativo no cascada — aprende mientras construyes, perfecciona sobre la marcha
fácil no complejo        — configuración ligera, ceremonia mínima
enfoque en sistemas existentes — funciona con bases de código existentes, no solo desde cero
```

### Por qué importan estos principios

**Fluidez no rigidez.** Los sistemas de especificación tradicionales te encasillan en fases: primero planificas, luego implementas y luego terminas. OpenSpec es más flexible: puedes crear artefactos en cualquier orden que tenga sentido para tu trabajo.

**Iterativo no cascada.** Los requisitos cambian. La comprensión se profundiza. Lo que parecía un buen enfoque al principio podría no sostenerse después de ver la base de código. OpenSpec abraza esta realidad.

**Fácil no complejo.** Algunos marcos de especificación requieren una configuración extensa, formatos rígidos o procesos pesados. OpenSpec no estorba. Inicialízalo en segundos, comienza a trabajar de inmediato y personalízalo solo si lo necesitas.

**Enfoque en sistemas existentes.** La mayor parte del trabajo de software no consiste en construir desde cero, sino en modificar sistemas existentes. El enfoque basado en deltas de OpenSpec facilita especificar cambios en el comportamiento existente, no solo describir nuevos sistemas.

## La Visión General

OpenSpec organiza tu trabajo en dos áreas principales:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fuente de verdad   │◄─────│  Modificaciones propuestas   │   │
│   │  Cómo funciona      │ fusion│  Cada cambio = una carpeta   │   │
│   │  actualmente tu     │      │  Contiene artefactos + deltas │   │
│   │  sistema            │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** (Especificaciones) son la fuente de verdad: describen cómo se comporta actualmente tu sistema.

**Changes** (Cambios) son modificaciones propuestas: residen en carpetas separadas hasta que estés listo para fusionarlas.

Esta separación es clave. Puedes trabajar en múltiples cambios en paralelo sin conflictos. Puedes revisar un cambio antes de que afecte a las specs principales. Y cuando archivas un cambio, sus deltas se fusionan limpiamente en la fuente de verdad.

## Espacios de Trabajo de Coordinación

El soporte de espacios de trabajo está en fase beta. El modelo de vista local descrito a continuación es la dirección actual, pero la automatización externa, integraciones y flujos de trabajo de larga duración deben considerar que el comportamiento de los comandos, los archivos de estado y la salida JSON aún están en evolución.

Los comandos siguientes proporcionan el flujo de configuración inicial para abrir vistas locales sobre repositorios o carpetas vinculados.

Los proyectos OpenSpec locales de un repositorio (repo-local) son la opción predeterminada adecuada cuando un solo repositorio es dueño del flujo de planificación, implementación y archivo. Algunos trabajos abarcan varios repositorios o carpetas. Para ese caso, un espacio de trabajo de coordinación de OpenSpec es una vista local de la máquina que mantiene juntas las rutas vinculadas, el estado del opener y la configuración del agente.

El modelo conceptual del espacio de trabajo es:

```text
workspace (espacio de trabajo)     = vista local privada sobre almacenes de contexto, iniciativas, repositorios y carpetas
context store (almacén de contexto) = contenedor de contexto compartido duradero
initiative (iniciativa)           = contexto de coordinación duradero dentro de un almacén de contexto
link (enlace)                     = un nombre estable para un repositorio o carpeta que el espacio de trabajo puede resolver localmente
change (cambio)                   = una pieza planificada de trabajo; la implementación pertenece al repositorio propietario
```

Un espacio de trabajo tiene una estructura diferente a un proyecto local de repositorio:

```text
getGlobalDataDir()/workspaces/<nombre-espacio-trabajo>/
├── workspace.yaml                 # Registro de vista local privada
├── AGENTS.md                      # Guía de tiempo de ejecución generada
└── <nombre-espacio-trabajo>.code-workspace # Archivo de espacio de trabajo para editor generado
```

El estado local de repositorio de OpenSpec mantiene la estructura existente:

```text
repo-root/ (raíz del repositorio)
└── openspec/
    ├── specs/
    └── changes/
```

Esta distinción es importante. La carpeta del espacio de trabajo es una superficie de coordinación local para abrir e inspeccionar repositorios o carpetas vinculados. El directorio `openspec/` de cada repositorio sigue siendo el hogar para las specs propiedad del repositorio, los cambios locales del repositorio y la planificación de la implementación. Los usuarios no necesitan ejecutar `openspec init` local al repositorio dentro de la carpeta del espacio de trabajo.

Los nombres de enlace estables son la forma en que un espacio de trabajo hace referencia a repositorios y carpetas. El registro privado del espacio de trabajo mantiene nombres como `api`, `web` o `checkout` y los mapea a las rutas locales de este entorno de ejecución.

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

Cuando un espacio de trabajo abre una iniciativa, `context` registra la vinculación seleccionada del almacén de contexto y el id de la iniciativa. Los almacenes seleccionados por registro (registry-selected) permanecen portátiles por id; los almacenes seleccionados por ruta (path-selected) preservan intencionalmente la ruta local del entorno de ejecución porque `workspace.yaml` es un estado local privado.

```yaml
context:
  kind: initiative
  store:
    id: platform
    selector:
      kind: registry
      id: platform
  initiative:
    id: billing-launch
```

Las rutas vinculadas pueden ser repositorios completos, carpetas dentro de un monorepositorio grande u otras carpetas existentes. No necesitan estado `openspec/` local al repositorio antes de poder participar en la planificación del espacio de trabajo. Los flujos de trabajo posteriores de implementación, verificación o archivo pueden requerir más preparación del repositorio, pero la visibilidad para la planificación comienza con el enlace.

```text
multi-repo (multi-repositorio):
  api      -> /repos/api
  web      -> /repos/web

monorepositorio grande:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Los espacios de trabajo gestionados residen bajo el directorio estándar de datos de OpenSpec:

```text
getGlobalDataDir()/workspaces
```

Esto significa `$XDG_DATA_HOME/openspec/workspaces` cuando `XDG_DATA_HOME` está configurado, `~/.local/share/openspec/workspaces` como alternativa estilo Unix y `%LOCALAPPDATA%\openspec\workspaces` como alternativa nativa de Windows. Los shells nativos de Windows, PowerShell y WSL2 cada uno mantienen las rutas para el entorno de ejecución que ejecuta OpenSpec. Esta base no traduce entre rutas como `D:\repo`, `/mnt/d/repo` y rutas UNC de WSL.

OpenSpec aún puede leer raíces de espacios de trabajo beta más antiguas como entradas de compatibilidad, pero los espacios de trabajo gestionados ahora usan el registro raíz `workspace.yaml` mencionado anteriormente. La carpeta del espacio de trabajo sigue siendo la autoridad para su propia vista local privada.

La visibilidad del espacio de trabajo no implica compromiso de cambio. Configura un espacio de trabajo cuando OpenSpec debe saber qué repositorios o carpetas son relevantes; crea un cambio más tarde cuando estés listo para planificar una característica, corrección, proyecto u otra pieza de trabajo.

Comandos útiles:

```bash
# Configuración guiada
openspec workspace setup

# Configuración amigable para automatización
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# Ver espacios de trabajo conocidos desde el registro local
openspec workspace list
openspec workspace ls

# Agregar o reparar enlaces para el espacio de trabajo seleccionado
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Comprobar qué puede resolver esta máquina
openspec workspace doctor
openspec workspace doctor --workspace platform

# Actualizar la guía local del espacio de trabajo y habilidades del agente
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Abrir el conjunto de trabajo vinculado
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Abrir una iniciativa como una vista local del espacio de trabajo
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` siempre crea el espacio de trabajo en la ubicación estándar de espacios de trabajo, lo registra en el registro local, muestra la ubicación del espacio de trabajo y requiere al menos un repositorio o carpeta vinculado. La configuración interactiva solicita un opener preferido y puede instalar habilidades de OpenSpec para los agentes seleccionados. La configuración no interactiva almacena uno solo cuando se proporciona `--opener codex-cli`, `--opener claude`, `--opener github-copilot` o `--opener editor`.

Las habilidades del espacio de trabajo se instalan solo en la raíz del espacio de trabajo. El perfil global activo selecciona qué habilidades de flujo de trabajo se generan; `--tools` selecciona qué agentes las reciben. La configuración y actualización del espacio de trabajo no crean archivos de comandos de barra (slash command) incluso cuando la entrega global incluye comandos. Ejecuta `openspec workspace update` para actualizar la guía local del espacio de trabajo y agregar, actualizar o eliminar directorios de habilidades gestionadas del espacio de trabajo local sin editar repositorios o carpetas vinculados.

OpenSpec también mantiene archivos de apertura del espacio de trabajo raíz: un bloque de guía gestionado por OpenSpec en `AGENTS.md` y un archivo `<nombre-espacio-trabajo>.code-workspace` local de la máquina para aperturas en VS Code y GitHub Copilot-en-VS-Code. Un espacio de trabajo gestionado no es un repositorio, por lo que OpenSpec no crea un `.gitignore` predeterminado del espacio de trabajo ni un directorio `changes/` predeterminado a nivel del espacio de trabajo.

El archivo de espacio de trabajo de VS Code mantenido lista primero los repositorios o carpetas vinculados válidos, luego el contexto de la iniciativa cuando está adjunto, y luego los archivos del espacio de trabajo de OpenSpec. VS Code muestra esas entradas como un espacio de trabajo multi-raíz.

`workspace open` abre el conjunto de trabajo vinculado con el opener preferido almacenado a menos que se pase `--agent <tool>` o `--editor` para esa sesión específica. Pasar ambas anulaciones de opener es un error. La apertura del espacio de trabajo raíz hace que los repositorios y carpetas vinculados sean visibles para exploración y contexto; la implementación comienza después de que el usuario solicite explícitamente trabajo de implementación.

`workspace link` y `workspace relink` solo registran carpetas existentes; no crean, copian, mueven, inicializan ni editan el repositorio o carpeta vinculado. Después de un enlace o re-enlace exitoso, OpenSpec actualiza la guía gestionada y el archivo de espacio de trabajo de VS Code.

Los comandos del espacio de trabajo que necesitan un espacio de trabajo pueden ejecutarse desde cualquier lugar con `--workspace <nombre>`. Si los ejecutas dentro de una carpeta o subdirectorio del espacio de trabajo, OpenSpec usa ese espacio de trabajo actual. Si varios espacios de trabajo conocidos están disponibles y no pasas `--workspace <nombre>`, los comandos interactivos muestran un selector; `--json` y `--no-interactive` fallan con un error de estado estructurado en lugar de solicitar.

Los comandos directos del espacio de trabajo admiten salida JSON para scripts. Las respuestas JSON mantienen los datos principales en objetos `workspace`, `workspaces` o `link` e informan advertencias o errores en matrices `status`. Los objetos saludables usan `status: []`.

## Specs (Especificaciones)

Las specs describen el comportamiento de tu sistema usando requisitos y escenarios estructurados.

### Estructura

```
openspec/specs/
├── auth/
│   └── spec.md           # Comportamiento de autenticación
├── payments/
│   └── spec.md           # Procesamiento de pagos
├── notifications/
│   └── spec.md           # Sistema de notificaciones
└── ui/
    └── spec.md           # Comportamiento de la interfaz de usuario y temas
```

Organiza las specs por dominio: agrupaciones lógicas que tengan sentido para tu sistema. Patrones comunes:

- **Por área de característica**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto delimitado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato de la Spec

Una spec contiene requisitos, y cada requisito tiene escenarios:

```markdown
# Especificación de Autenticación

## Propósito
Autenticación y gestión de sesiones para la aplicación.

## Requisitos

### Requisito: Autenticación de Usuario
El sistema DEBE emitir un token JWT tras un inicio de sesión exitoso.

#### Escenario: Credenciales válidas
- DADO un usuario con credenciales válidas
- CUANDO el usuario envía el formulario de inicio de sesión
- ENTONCES se devuelve un token JWT
- Y el usuario es redirigido al panel de control

#### Escenario: Credenciales inválidas
- DADO credenciales inválidas
- CUANDO el usuario envía el formulario de inicio de sesión
- ENTONCES se muestra un mensaje de error
- Y no se emite ningún token

### Requisito: Expiración de Sesión
El sistema DEBE hacer expirar las sesiones después de 30 minutos de inactividad.

#### Escenario: Tiempo de espera por inactividad
- DADA una sesión autenticada
- CUANDO pasan 30 minutos sin actividad
- ENTONCES la sesión se invalida
- Y el usuario debe re-autenticarse
```

**Elementos clave:**

| Elemento | Propósito |
|----------|-----------|
| `## Propósito` | Descripción de alto nivel del dominio de esta spec |
| `### Requisito:` | Un comportamiento específico que el sistema debe tener |
| `#### Escenario:` | Un ejemplo concreto del requisito en acción |
| DEBE/DEBERÍA/PODRÍA | Palabras clave RFC 2119 que indican la fuerza del requisito |

### Por Qué Estructurar las Specs de Esta Manera

**Los requisitos son el "qué"**: establecen lo que el sistema debe hacer sin especificar la implementación.

**Los escenarios son el "cuándo"**: proporcionan ejemplos concretos que pueden verificarse. Buenos escenarios:
- Son testeables (podrías escribir una prueba automatizada para ellos)
- Cubren tanto el camino feliz como los casos límite
- Usan formato estructurado Dado/Cuando/Entonces o similar

**Las palabras clave RFC 2119** (DEBE, DEBERÍA, PODRÍA) comunican intención:
- **DEBE** — requisito absoluto
- **DEBERÍA** — recomendado, pero existen excepciones
- **PODRÍA** — opcional

### Qué Es (y Qué No Es) una Spec

Una spec es un **contrato de comportamiento**, no un plan de implementación.

Buen contenido de spec:
- Comportamiento observable en el que confían los usuarios o los sistemas dependientes
- Entradas, salidas y condiciones de error
- Restricciones externas (seguridad, privacidad, fiabilidad, compatibilidad)
- Escenarios que pueden probarse o validarse explícitamente

Evitar en specs:
- Nombres internos de clases/funciones
- Elecciones de bibliotecas o frameworks
- Detalles de implementación paso a paso
- Planes de ejecución detallados (esos pertenecen a `design.md` o `tasks.md`)

Prueba rápida:
- Si la implementación puede cambiar sin cambiar el comportamiento visible externamente, probablemente no pertenece a la spec.

### Mantenerlo Ligero: Rigor Progresivo

OpenSpec tiene como objetivo evitar la burocracia. Usa el nivel más ligero que aún haga el cambio verificable.

**Spec ligera (predeterminada):**
- Requisitos breves centrados en el comportamiento
- Alcance claro y objetivos no incluidos
- Algunas comprobaciones de aceptación concretas

**Spec completa (para mayor riesgo):**
- Cambios entre equipos o entre repositorios
- Cambios de API/contrato, migraciones, preocupaciones de seguridad/privacidad
- Cambios donde la ambigüedad probablemente cause retrabajo costoso

La mayoría de los cambios deben permanecer en modo ligero.

### Colaboración Humano + Agente

En muchos equipos, los humanos exploran y los agentes redactan artefactos. El ciclo previsto es:

1. El humano proporciona la intención, el contexto y las restricciones.
2. El agente convierte esto en requisitos y escenarios centrados en el comportamiento.
3. El agente mantiene los detalles de implementación en `design.md` y `tasks.md`, no en `spec.md`.
4. La validación confirma la estructura y la claridad antes de la implementación.

Esto mantiene las specs legibles para humanos y consistentes para los agentes.

## Cambios

Un cambio es una modificación propuesta a tu sistema, empaquetada como una carpeta con todo lo necesario para entenderla e implementarla.

### Estructura del cambio

```
openspec/changes/add-dark-mode/
├── proposal.md           # Por qué y qué
├── design.md             # Cómo (enfoque técnico)
├── tasks.md              # Lista de implementación
├── .openspec.yaml        # Metadatos del cambio (opcional)
└── specs/                # Especificaciones delta
    └── ui/
        └── spec.md       # Qué está cambiando en ui/spec.md
```

Cada cambio es autónomo. Tiene:
- **Artefactos** — documentos que capturan la intención, el diseño y las tareas
- **Especificaciones delta** — especificaciones de qué se está añadiendo, modificando o eliminando
- **Metadatos** — configuración opcional para este cambio específico

### Por qué los cambios son carpetas

Empaquetar un cambio como una carpeta tiene varios beneficios:

1. **Todo junto.** La propuesta, el diseño, las tareas y las especificaciones viven en un solo lugar. No hay que buscar en diferentes ubicaciones.

2. **Trabajo paralelo.** Múltiples cambios pueden existir simultáneamente sin conflictos. Se puede trabajar en `add-dark-mode` mientras `fix-auth-bug` también está en progreso.

3. **Historial limpio.** Al archivarse, los cambios se mueven a `changes/archive/` con su contexto completo preservado. Se puede revisar y entender no solo qué cambió, sino por qué.

4. **Fácil revisión.** Una carpeta de cambio es fácil de revisar — ábrela, lee la propuesta, revisa el diseño, ve los deltas de especificación.

## Artefactos

Los artefactos son los documentos dentro de un cambio que guían el trabajo.

### El flujo de artefactos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   por qué       qué           enfoque      pasos
 + alcance     cambios       técnico      a seguir
```

Los artefactos se construyen unos sobre otros. Cada artefacto proporciona contexto para el siguiente.

### Tipos de artefactos

#### Propuesta (`proposal.md`)

La propuesta captura la **intención**, el **alcance** y el **enfoque** a alto nivel.

```markdown
# Propuesta: Añadir Modo Oscuro
```

## Intención
Los usuarios han solicitado una opción de modo oscuro para reducir la fatiga visual
durante el uso nocturno y coincidir con las preferencias del sistema.

## Alcance
En alcance:
- Interruptor de tema en la configuración
- Detección de preferencias del sistema
- Persistir preferencia en localStorage

Fuera de alcance:
- Temas de color personalizados (trabajo futuro)
- Anulaciones de tema por página

## Enfoque
Usar propiedades personalizadas de CSS para la tematización con un contexto de React
para la gestión de estado. Detectar la preferencia del sistema en la primera carga,
permitir la anulación manual.
```

**Cuándo actualizar la propuesta:**
- Cambios en el alcance (reducción o expansión)
- La intención se clarifica (mejor comprensión del problema)
- El enfoque cambia fundamentalmente

#### Especificaciones (especificaciones delta en `specs/`)

Las especificaciones delta describen **qué está cambiando** en relación con las especificaciones actuales. Consulta [Especificaciones Delta](#especificaciones-delta) a continuación.

#### Diseño (`design.md`)

El diseño captura el **enfoque técnico** y las **decisiones de arquitectura**.

````markdown
# Diseño: Agregar Modo Oscuro

## Enfoque Técnico
Estado del tema gestionado mediante React Context para evitar el prop drilling.
Las propiedades personalizadas de CSS permiten el cambio en tiempo de ejecución sin alternar clases.

## Decisiones de Arquitectura

### Decisión: Context sobre Redux
Usar React Context para el estado del tema porque:
- Estado binario simple (claro/oscuro)
- Sin transiciones de estado complejas
- Evita agregar la dependencia de Redux

### Decisión: Propiedades Personalizadas de CSS
Usar variables CSS en lugar de CSS-in-JS porque:
- Funciona con la hoja de estilos existente
- Sin sobrecarga en tiempo de ejecución
- Solución nativa del navegador

## Flujo de Datos
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
Variables CSS (aplicadas a :root)
```

## Cambios de Archivos
- `src/contexts/ThemeContext.tsx` (nuevo)
- `src/components/ThemeToggle.tsx` (nuevo)
- `src/styles/globals.css` (modificado)
````

**Cuándo actualizar el diseño:**
- La implementación revela que el enfoque no funcionará
- Se descubre una mejor solución
- Las dependencias o restricciones cambian

#### Tareas (`tasks.md`)

Las tareas son la **lista de verificación de implementación** — pasos concretos con casillas de verificación.

```markdown
# Tareas

## 1. Infraestructura del Tema
- [ ] 1.1 Crear ThemeContext con estado claro/oscuro
- [ ] 1.2 Agregar propiedades personalizadas de CSS para colores
- [ ] 1.3 Implementar persistencia en localStorage
- [ ] 1.4 Agregar detección de preferencias del sistema

## 2. Componentes de UI
- [ ] 2.1 Crear componente ThemeToggle
- [ ] 2.2 Agregar interruptor a la página de configuración
- [ ] 2.3 Actualizar Header para incluir un interruptor rápido

## 3. Estilización
- [ ] 3.1 Definir paleta de colores del tema oscuro
- [ ] 3.2 Actualizar componentes para usar variables CSS
- [ ] 3.3 Probar ratios de contraste para accesibilidad
```

**Mejores prácticas para tareas:**
- Agrupar tareas relacionadas bajo encabezados
- Usar numeración jerárquica (1.1, 1.2, etc.)
- Mantener las tareas lo suficientemente pequeñas como para completar en una sesión
- Marcar las tareas como completadas a medida que las terminas

## Especificaciones Delta

Las especificaciones delta son el concepto clave que hace que OpenSpec funcione para el desarrollo de sistemas existentes. Describen **qué está cambiando** en lugar de reformular toda la especificación.

### El Formato

```markdown
# Delta para Auth

## Requisitos AGREGADOS

### Requisito: Autenticación de Dos Factores
El sistema DEBE soportar autenticación de dos factores basada en TOTP.

#### Escenario: Registro con 2FA
- DADO un usuario sin 2FA habilitado
- CUANDO el usuario habilita 2FA en la configuración
- ENTONCES se muestra un código QR para la configuración de la aplicación de autenticación
- Y el usuario debe verificar con un código antes de la activación

#### Escenario: Inicio de sesión con 2FA
- DADO un usuario con 2FA habilitado
- CUANDO el usuario envía credenciales válidas
- ENTONCES se presenta un desafío OTP
- Y el inicio de sesión se completa solo después de un OTP válido

## Requisitos MODIFICADOS

### Requisito: Expiración de Sesión
El sistema DEBE expirar las sesiones después de 15 minutos de inactividad.
(Previo: 30 minutos)

#### Escenario: Tiempo de espera por inactividad
- DADA una sesión autenticada
- CUANDO pasan 15 minutos sin actividad
- ENTONCES la sesión se invalida

## Requisitos ELIMINADOS

### Requisito: Recordarme
(Obsoleto en favor de 2FA. Los usuarios deben reautenticarse en cada sesión.)
```

### Secciones Delta

| Sección | Significado | Qué sucede al archivar |
|---------|-------------|------------------------|
| `## Requisitos AGREGADOS` | Comportamiento nuevo | Se añade a la especificación principal |
| `## Requisitos MODIFICADOS` | Comportamiento cambiado | Reemplaza el requisito existente |
| `## Requisitos ELIMINADOS` | Comportamiento obsoleto | Se elimina de la especificación principal |

### Por qué Deltas en lugar de Especificaciones Completas

**Claridad.** Un delta muestra exactamente qué está cambiando. Al leer una especificación completa, tendrías que comparar mentalmente con la versión actual.

**Evitar conflictos.** Dos cambios pueden tocar el mismo archivo de especificación sin conflicto, siempre que modifiquen diferentes requisitos.

**Eficiencia en la revisión.** Los revisores ven el cambio, no el contexto sin cambios. Se centra en lo que importa.

**Adecuación para sistemas existentes.** La mayor parte del trabajo modifica comportamientos existentes. Las deltas hacen que las modificaciones sean de primera clase, no un pensamiento posterior.

## Esquemas

Los esquemas definen los tipos de artefactos y sus dependencias para un flujo de trabajo.

### Cómo Funcionan los Esquemas

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Sin dependencias, se puede crear primero

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Necesita propuesta antes de crear

  - id: design
    generates: design.md
    requires: [proposal]      # Se puede crear en paralelo con specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Necesita tanto specs como design primero
```

**Los artefactos forman un grafo de dependencias:**

```
                    proposal
                   (nodo raíz)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**Las dependencias son habilitadores, no puertas.** Muestran qué es posible crear, no qué debes crear a continuación. Puedes omitir el diseño si no lo necesitas. Puedes crear especificaciones antes o después del diseño — ambas dependen solo de la propuesta.

### Esquemas Incorporados

**spec-driven** (predeterminado)

El flujo de trabajo estándar para el desarrollo impulsado por especificaciones:

```
proposal → specs → design → tasks → implement
```

Mejor para: La mayoría del trabajo de características donde quieres acordar especificaciones antes de la implementación.

### Esquemas Personalizados

Crea esquemas personalizados para el flujo de trabajo de tu equipo:

```bash
# Crear desde cero
openspec schema init research-first

# O bifurcar uno existente
openspec schema fork spec-driven research-first
```

**Ejemplo de esquema personalizado:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Investigar primero

  - id: proposal
    generates: proposal.md
    requires: [research]   # Propuesta informada por la investigación

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Omitir specs/design, ir directo a tareas
```

Consulta [Personalización](customization.md) para obtener todos los detalles sobre la creación y uso de esquemas personalizados.

## Archivo

El archivado completa un cambio fusionando sus especificaciones delta en las especificaciones principales y preservando el cambio para el historial.

### Qué Sucede Cuando Archivas

```
Antes del archivado:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ fusionar
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Después del archivado:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Ahora incluye requisitos de 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preservado para el historial
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### El Proceso de Archivado

1. **Fusionar deltas.** Cada sección de especificación delta (AGREGADOS/MODIFICADOS/ELIMINADOS) se aplica a la especificación principal correspondiente.

2. **Mover al archivo.** La carpeta del cambio se mueve a `changes/archive/` con un prefijo de fecha para orden cronológico.

3. **Preservar contexto.** Todos los artefactos permanecen intactos en el archivo. Siempre puedes volver atrás para entender por qué se hizo un cambio.

### Por qué el Archivado Importa

**Estado limpio.** Los cambios activos (`changes/`) muestran solo el trabajo en progreso. El trabajo completado se aparta del camino.

**Registro de auditoría.** El archivo preserva el contexto completo de cada cambio — no solo qué cambió, sino la propuesta que explica por qué, el diseño que explica cómo, y las tareas que muestran el trabajo realizado.

**Evolución de especificaciones.** Las especificaciones crecen orgánicamente a medida que se archivan los cambios. Cada archivo fusiona sus deltas, construyendo una especificación completa con el tiempo.

## Cómo Todo Encaja

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO DE OPENSPEC                                │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. INICIAR    │  /opsx:propose (core) o /opsx:new (flujo expandido)      │
│   │     CAMBIO     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREAR      │  /opsx:ff o /opsx:continue (flujo expandido)             │
│   │     ARTEFACTOS │  Crea propuesta → specs → diseño → tareas               │
│   │                │  (basado en dependencias del esquema)                    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTAR│  /opsx:apply                                            │
│   │     TAREAS     │  Trabaja en las tareas, marcándolas como completadas     │
│   │                │◄──── Actualiza artefactos a medida que aprendes          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICAR  │  /opsx:verify (opcional)                                │
│   │     TRABAJO    │  Verifica que la implementación coincida con specs       │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVAR   │────►│  Las especificaciones delta se fusionan      │    │
│   │     CAMBIO     │     │  en las especificaciones principales        │    │
│   └────────────────┘     │  La carpeta del cambio se mueve a archive/  │    │
│                          │  Las specs son ahora la fuente actualizada   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**El ciclo virtuoso:**

1. Las especificaciones describen el comportamiento actual
2. Los cambios proponen modificaciones (como deltas)
3. La implementación hace que los cambios sean reales
4. El archivado fusiona las deltas en las especificaciones
5. Las especificaciones ahora describen el nuevo comportamiento
6. El siguiente cambio se basa en las especificaciones actualizadas

## Glosario

| Término | Definición |
|------|------------|
| **Artifact** | Un documento dentro de un cambio (propuesta, diseño, tareas o especificaciones delta) |
| **Archive** | El proceso de completar un cambio y fusionar sus deltas en las especificaciones principales |
| **Change** | Una modificación propuesta al sistema, empaquetada como una carpeta con artefactos |
| **Delta spec** | Una especificación que describe cambios (AÑADIDO/MODIFICADO/ELIMINADO) con respecto a las especificaciones actuales |
| **Domain** | Una agrupación lógica para especificaciones (por ejemplo, `auth/`, `payments/`) |
| **Requirement** | Un comportamiento específico que el sistema debe tener |
| **Scenario** | Un ejemplo concreto de un requisito, típicamente en formato Given/When/Then |
| **Schema** | Una definición de tipos de artefactos y sus dependencias |
| **Spec** | Una especificación que describe el comportamiento del sistema, que contiene requisitos y escenarios |
| **Source of truth** | El directorio `openspec/specs/`, que contiene el comportamiento acordado actual |

## Próximos Pasos

- [Primeros Pasos](getting-started.md) - Pasos prácticos iniciales
- [Flujos de Trabajo](workflows.md) - Patrones comunes y cuándo usar cada uno
- [Comandos](commands.md) - Referencia completa de comandos
- [Personalización](customization.md) - Crear esquemas personalizados y configurar tu proyecto