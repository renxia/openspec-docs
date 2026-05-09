# Conceptos

Esta guía explica las ideas centrales detrás de OpenSpec y cómo se relacionan entre sí. Para un uso práctico, consulte [Primeros pasos](getting-started.md) y [Flujos de trabajo](workflows.md).

## Filosofía

OpenSpec se basa en cuatro principios:

```
fluido, no rígido         — sin fases fijas, trabaja en lo que tenga sentido
iterativo, no en cascada  — aprende mientras construyes, refina sobre la marcha
fácil, no complejo        — configuración ligera, mínima ceremonia
prioridad a sistemas existentes — funciona con bases de código existentes, no solo con proyectos nuevos
```

### Por qué importan estos principios

**Fluido, no rígido.** Los sistemas de especificaciones tradicionales te encierran en fases: primero planificas, luego implementas y luego terminas. OpenSpec es más flexible: puedes crear artefactos en cualquier orden que tenga sentido para tu trabajo.

**Iterativo, no en cascada.** Los requisitos cambian. La comprensión se profundiza. Lo que parecía un buen enfoque al principio podría no sostenerse después de ver la base de código. OpenSpec abraza esta realidad.

**Fácil, no complejo.** Algunos marcos de especificaciones requieren una configuración extensa, formatos rígidos o procesos pesados. OpenSpec no se interpone en tu camino. Inicializa en segundos, comienza a trabajar de inmediato, personaliza solo si es necesario.

**Prioridad a sistemas existentes.** La mayor parte del trabajo de software no consiste en construir desde cero, sino en modificar sistemas existentes. El enfoque basado en deltas de OpenSpec facilita especificar cambios en el comportamiento existente, no solo describir nuevos sistemas.

## La Imagen General

OpenSpec organiza tu trabajo en dos áreas principales:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fuente de verdad   │◄─────│  Modificaciones propuestas    │   │
│   │  Cómo funciona      │ merge│  Cada cambio = una carpeta    │   │
│   │  actualmente tu     │      │  Contiene artefactos + deltas │   │
│   │  sistema            │      │                               │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

Las **Specs** son la fuente de verdad: describen cómo se comporta actualmente tu sistema.

Los **Changes** son modificaciones propuestas: viven en carpetas separadas hasta que estés listo para fusionarlas.

Esta separación es clave. Puedes trabajar en múltiples cambios en paralelo sin conflictos. Puedes revisar un cambio antes de que afecte a las specs principales. Y cuando archivas un cambio, sus deltas se fusionan limpiamente en la fuente de verdad.

## Espacios de Coordinación (Workspaces)

El soporte para workspaces está en desarrollo activo y aún no está listo para su uso. No construyas automatización externa, integraciones o flujos de trabajo de larga duración sobre el comportamiento de los workspaces; los comandos, archivos de estado y la salida JSON pueden cambiar en cualquier momento.

Los comandos a continuación proporcionan el flujo de configuración inicial para la planificación a través de repositorios o carpetas vinculados.

Los proyectos OpenSpec locales del repositorio son la opción predeterminada correcta cuando un solo repositorio posee el flujo de planificación, implementación y archivo. Algunos trabajos abarcan varios repositorios o carpetas. Para ese caso, un espacio de coordinación de OpenSpec es el hogar de planificación duradero.

El modelo mental del workspace es:

```text
workspace = donde viven los cambios transversales relacionados
link      = un nombre estable para un repositorio o carpeta contra el que el workspace puede planificar
change    = una característica, corrección, proyecto u otra pieza de trabajo planificada
```

Un workspace tiene una forma diferente a un proyecto local del repositorio:

```text
workspace-folder/
├── changes/                       # Planificación a nivel de workspace
└── .openspec-workspace/
    ├── workspace.yaml             # Identidad compartida del workspace y nombres de enlaces
    └── local.yaml                 # Rutas locales de esta máquina
```

El estado local del repositorio de OpenSpec mantiene la forma existente:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Esa distinción importa. La carpeta del workspace es una superficie de coordinación para la planificación a través de repositorios o carpetas vinculados. El directorio `openspec/` de cada repositorio sigue siendo el hogar para las specs propiedad del repositorio, los cambios locales del repositorio y la planificación de la implementación. Los usuarios no necesitan ejecutar `openspec init` local del repositorio dentro de una carpeta de workspace.

Los nombres de enlace estables son la forma en que la planificación del workspace se refiere a repositorios y carpetas. El estado compartido del workspace mantiene nombres como `api`, `web` o `checkout`; cada máquina asigna esos nombres a sus propias rutas locales en `.openspec-workspace/local.yaml`.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

Los workspaces creados por OpenSpec excluyen `.openspec-workspace/local.yaml` del estado de colaboración portátil de forma predeterminada. `.openspec-workspace/workspace.yaml` permanece portátil porque almacena el nombre del workspace y los nombres de enlace estables, no las rutas absolutas de checkout de un usuario.

Las rutas vinculadas pueden ser repositorios completos, carpetas dentro de un monorepositorio grande u otras carpetas existentes. No necesitan estado local del repositorio `openspec/` antes de poder participar en la planificación del workspace. Los flujos de trabajo posteriores de implementación, verificación o archivo pueden requerir más preparación del repositorio, pero la visibilidad de la planificación comienza con el enlace.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Los workspaces administrados viven bajo el directorio de datos estándar de OpenSpec:

```text
getGlobalDataDir()/workspaces
```

Eso significa `$XDG_DATA_HOME/openspec/workspaces` cuando `XDG_DATA_HOME` está configurado, `~/.local/share/openspec/workspaces` en el fallback de estilo Unix, y `%LOCALAPPDATA%\openspec\workspaces` en el fallback nativo de Windows. Los shells nativos de Windows, PowerShell y WSL2 cada uno mantienen las cadenas de ruta para el runtime que ejecuta OpenSpec. Esta base no se traduce entre `D:\repo`, `/mnt/d/repo` y las rutas UNC de WSL.

OpenSpec también mantiene un registro local de la máquina en:

```text
getGlobalDataDir()/workspaces/registry.yaml
```

El registro asigna nombres de workspace a ubicaciones de workspace para que los comandos globales posteriores puedan listar o seleccionar workspaces conocidos desde cualquier lugar. Es solo un índice. Cada carpeta de workspace sigue siendo autoritativa para su propio `.openspec-workspace/workspace.yaml` y `.openspec-workspace/local.yaml`, por lo que los registros obsoletos del registro pueden ser reportados y reparados sin redefinir el workspace en sí.

La visibilidad del workspace no es un compromiso de cambio. Configura un workspace cuando OpenSpec debe saber qué repositorios o carpetas son relevantes; crea un cambio más tarde cuando estés listo para planificar una característica, corrección, proyecto u otra pieza de trabajo.

Comandos útiles:

```bash
# Configuración guiada
openspec workspace setup

# Configuración amigable para automatización
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# Ver workspaces conocidos desde el registro local
openspec workspace list
openspec workspace ls

# Agregar o reparar enlaces para el workspace seleccionado
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Verificar qué puede resolver esta máquina
openspec workspace doctor
openspec workspace doctor --workspace platform

# Abrir el conjunto de trabajo vinculado
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

`workspace setup` siempre crea el workspace en la ubicación estándar del workspace, lo registra en el registro local, muestra la ubicación del workspace y requiere al menos un repositorio o carpeta vinculado. La configuración interactiva solicita un abridor preferido. La configuración no interactiva almacena uno solo cuando se proporciona `--opener codex`, `--opener claude`, `--opener github-copilot` o `--opener editor`.

OpenSpec también mantiene archivos de apertura de workspace raíz: un bloque de guía administrado por OpenSpec en `AGENTS.md`, un archivo `<workspace-name>.code-workspace` local de la máquina para aperturas de VS Code y GitHub Copilot-en-VS-Code, y una entrada de ignorar específica para ese archivo `.code-workspace` mantenido. Los archivos `*.code-workspace` creados por el usuario permanecen rastreables porque la regla de ignorar apunta solo al archivo mantenido.

El workspace de VS Code mantenido incluye la raíz de coordinación como `.` más los repositorios o carpetas vinculados válidos como raíces adicionales. VS Code muestra esas entradas como un workspace multi-raíz.

`workspace open` abre el conjunto de trabajo vinculado con el abridor preferido almacenado a menos que se pase `--agent <tool>` o `--editor` para esa sesión. Pasar ambos anulaciones de abridor es un error. La apertura del workspace raíz hace que los repositorios y carpetas vinculados sean visibles para exploración y planificación; la implementación comienza después de que el usuario solicite explícitamente trabajo de implementación.

`workspace link` y `workspace relink` solo registran carpetas existentes; no crean, copian, mueven, inicializan ni editan el repositorio o carpeta vinculado. Después de un enlace o reenlace exitoso, OpenSpec actualiza la guía administrada, el archivo de workspace de VS Code y la regla de ignorar.

Los comandos de workspace que necesitan un workspace pueden ejecutarse desde cualquier lugar con `--workspace <name>`. Si los ejecutas dentro de una carpeta o subdirectorio de workspace, OpenSpec usa ese workspace actual. Si hay varios workspaces conocidos disponibles y no pasas `--workspace <name>`, los comandos humanos muestran un selector; `--json` y `--no-interactive` fallan con un error de estado estructurado en lugar de solicitar.

Los comandos directos de workspace admiten salida JSON para scripts. Las respuestas JSON mantienen los datos principales en objetos `workspace`, `workspaces` o `link` y reportan advertencias o errores en matrices `status`. Los objetos saludables usan `status: []`.

## Specs

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

### Formato de Spec

Una spec contiene requisitos, y cada requisito tiene escenarios:

```markdown
# Especificación de Autenticación
```

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
El sistema DEBE expirar las sesiones después de 30 minutos de inactividad.

#### Escenario: Tiempo de espera por inactividad
- DADA una sesión autenticada
- CUANDO pasan 30 minutos sin actividad
- ENTONCES la sesión se invalida
- Y el usuario debe autenticarse nuevamente
```

**Elementos clave:**

| Elemento | Propósito |
|----------|-----------|
| `## Purpose` | Descripción de alto nivel del dominio de esta especificación |
| `### Requirement:` | Un comportamiento específico que el sistema debe tener |
| `#### Scenario:` | Un ejemplo concreto del requisito en acción |
| SHALL/MUST/SHOULD | Palabras clave de la RFC 2119 que indican la fuerza del requisito |

### Por Qué Estructurar las Especificaciones de Esta Manera

**Los requisitos son el "qué"** — establecen lo que el sistema debe hacer sin especificar la implementación.

**Los escenarios son el "cuándo"** — proporcionan ejemplos concretos que pueden verificarse. Buenos escenarios:
- Son testeables (podrías escribir una prueba automatizada para ellos)
- Cubren tanto el camino feliz como los casos límite
- Usan el formato Dado/Cuando/Entonces u otro formato estructurado similar

**Las palabras clave de la RFC 2119** (SHALL, MUST, SHOULD, MAY) comunican la intención:
- **MUST/SHALL** — requisito absoluto
- **SHOULD** — recomendado, pero existen excepciones
- **MAY** — opcional

### Qué Es (y Qué No Es) una Especificación

Una especificación es un **contrato de comportamiento**, no un plan de implementación.

Buen contenido de especificación:
- Comportamiento observable en el que confían los usuarios o sistemas posteriores
- Entradas, salidas y condiciones de error
- Restricciones externas (seguridad, privacidad, fiabilidad, compatibilidad)
- Escenarios que pueden probarse o validarse explícitamente

Qué evitar en las especificaciones:
- Nombres internos de clases/funciones
- Elecciones de bibliotecas o frameworks
- Detalles de implementación paso a paso
- Planes de ejecución detallados (esos pertenecen a `design.md` o `tasks.md`)

Prueba rápida:
- Si la implementación puede cambiar sin cambiar el comportamiento visible externamente, probablemente no pertenece a la especificación.

### Mantenerlo Ligero: Rigor Progresivo

OpenSpec pretende evitar la burocracia. Usa el nivel más ligero que aún haga que el cambio sea verificable.

**Especificación Lite (por defecto):**
- Requisitos cortos centrados en el comportamiento
- Alcance y no-objetivos claros
- Algunas comprobaciones de aceptación concretas

**Especificación completa (para mayor riesgo):**
- Cambios entre equipos o repositorios
- Cambios en API/contratos, migraciones, preocupaciones de seguridad/privacidad
- Cambios donde la ambigüedad probablemente cause retrabajo costoso

La mayoría de los cambios deberían permanecer en modo Lite.

### Colaboración Humano + Agente

En muchos equipos, los humanos exploran y los agentes redactan los artefactos. El bucle previsto es:

1. El humano proporciona la intención, el contexto y las restricciones.
2. El agente convierte esto en requisitos y escenarios centrados en el comportamiento.
3. El agente mantiene los detalles de implementación en `design.md` y `tasks.md`, no en `spec.md`.
4. La validación confirma la estructura y la claridad antes de la implementación.

Esto mantiene las especificaciones legibles para los humanos y consistentes para los agentes.

## Cambios

Un cambio es una modificación propuesta a tu sistema, empaquetada como una carpeta con todo lo necesario para entenderlo e implementarlo.

### Estructura de un Cambio

```
openspec/changes/add-dark-mode/
├── proposal.md           # Por qué y qué
├── design.md             # Cómo (enfoque técnico)
├── tasks.md              # Lista de verificación de implementación
├── .openspec.yaml        # Metadatos del cambio (opcional)
└── specs/                # Especificaciones delta
    └── ui/
        └── spec.md       # Qué está cambiando en ui/spec.md
```

Cada cambio es autocontenido. Contiene:
- **Artefactos** — documentos que capturan la intención, el diseño y las tareas
- **Especificaciones delta** — especificaciones de lo que se está añadiendo, modificando o eliminando
- **Metadatos** — configuración opcional para este cambio específico

### Por Qué los Cambios son Carpetas

Empaquetar un cambio como una carpeta tiene varios beneficios:

1. **Todo junto.** La propuesta, el diseño, las tareas y las especificaciones viven en un solo lugar. No hay que buscar en diferentes ubicaciones.

2. **Trabajo en paralelo.** Múltiples cambios pueden existir simultáneamente sin entrar en conflicto. Trabaja en `add-dark-mode` mientras `fix-auth-bug` también está en progreso.

3. **Historial limpio.** Cuando se archivan, los cambios se mueven a `changes/archive/` con su contexto completo preservado. Puedes revisar y entender no solo qué cambió, sino por qué.

4. **Fácil de revisar.** Una carpeta de cambio es fácil de revisar: ábrela, lee la propuesta, revisa el diseño, mira los deltas de especificación.

## Artefactos

Los artefactos son los documentos dentro de un cambio que guían el trabajo.

### El Flujo de Artefactos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Los artefactos se construyen unos sobre otros. Cada artefacto proporciona contexto para el siguiente.

### Tipos de Artefactos

#### Propuesta (`proposal.md`)

La propuesta captura la **intención**, el **alcance** y el **enfoque** a alto nivel.

```markdown
# Propuesta: Añadir Modo Oscuro

## Intención
Los usuarios han solicitado una opción de modo oscuro para reducir la fatiga visual
durante el uso nocturno y coincidir con las preferencias del sistema.

## Alcance
Dentro del alcance:
- Interruptor de tema en configuración
- Detección de preferencias del sistema
- Persistir preferencia en localStorage

Fuera del alcance:
- Temas de color personalizados (trabajo futuro)
- Anulaciones de tema por página

## Enfoque
Usar propiedades CSS personalizadas para theming con un contexto de React
para la gestión del estado. Detectar la preferencia del sistema en la primera carga,
permitir anulación manual.
```

**Cuándo actualizar la propuesta:**
- El alcance cambia (se reduce o se amplía)
- La intención se clarifica (mejor comprensión del problema)
- El enfoque cambia fundamentalmente

#### Especificaciones (especificaciones delta en `specs/`)

Las especificaciones delta describen **qué está cambiando** en relación con las especificaciones actuales. Ver [Especificaciones Delta](#especificaciones-delta) a continuación.

#### Diseño (`design.md`)

El diseño captura el **enfoque técnico** y las **decisiones de arquitectura**.

````markdown
# Diseño: Añadir Modo Oscuro

## Enfoque Técnico
Estado del tema gestionado mediante React Context para evitar el prop drilling.
Las propiedades CSS personalizadas permiten el cambio en tiempo de ejecución sin alternar clases.

## Decisiones de Arquitectura

### Decisión: Context sobre Redux
Usar React Context para el estado del tema porque:
- Estado binario simple (claro/oscuro)
- Sin transiciones de estado complejas
- Evita añadir la dependencia de Redux

### Decisión: Propiedades CSS Personalizadas
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
CSS Variables (applied to :root)
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
- [ ] 1.2 Añadir propiedades CSS personalizadas para colores
- [ ] 1.3 Implementar persistencia en localStorage
- [ ] 1.4 Añadir detección de preferencias del sistema

## 2. Componentes de UI
- [ ] 2.1 Crear componente ThemeToggle
- [ ] 2.2 Añadir interruptor a la página de configuración
- [ ] 2.3 Actualizar Header para incluir interruptor rápido

## 3. Estilos
- [ ] 3.1 Definir paleta de colores del tema oscuro
- [ ] 3.2 Actualizar componentes para usar variables CSS
- [ ] 3.3 Probar ratios de contraste para accesibilidad
```

**Mejores prácticas para tareas:**
- Agrupar tareas relacionadas bajo encabezados
- Usar numeración jerárquica (1.1, 1.2, etc.)
- Mantener las tareas lo suficientemente pequeñas para completarlas en una sesión
- Marcar las tareas como completadas a medida que avances

## Especificaciones Delta

Las especificaciones delta son el concepto clave que hace que OpenSpec funcione para el desarrollo brownfield. Describen **qué está cambiando** en lugar de repetir toda la especificación.

### El Formato

```markdown
# Delta para Auth

## REQUISITOS AÑADIDOS

### Requisito: Autenticación de Dos Factores
El sistema DEBE soportar autenticación de dos factores basada en TOTP.

#### Escenario: Registro de 2FA
- DADO un usuario sin 2FA habilitado
- CUANDO el usuario habilita 2FA en configuración
- ENTONCES se muestra un código QR para configurar la aplicación autenticadora
- Y el usuario debe verificar con un código antes de la activación

#### Escenario: Inicio de sesión con 2FA
- DADO un usuario con 2FA habilitado
- CUANDO el usuario envía credenciales válidas
- ENTONCES se presenta un desafío OTP
- Y el inicio de sesión se completa solo después de un OTP válido

## REQUISITOS MODIFICADOS

### Requisito: Expiración de Sesión
El sistema DEBE expirar sesiones después de 15 minutos de inactividad.
(Previo: 30 minutos)

#### Escenario: Tiempo de espera por inactividad
- DADA una sesión autenticada
- CUANDO pasan 15 minutos sin actividad
- ENTONCES la sesión se invalida

## REQUISITOS ELIMINADOS

### Requisito: Recordarme
(Obsoleto en favor de 2FA. Los usuarios deben reautenticarse en cada sesión.)
```

### Secciones Delta

| Sección | Significado | Qué sucede al archivar |
|---------|-------------|------------------------|
| `## REQUISITOS AÑADIDOS` | Nuevo comportamiento | Se añade a la especificación principal |
| `## REQUISITOS MODIFICADOS` | Comportamiento cambiado | Reemplaza el requisito existente |
| `## REQUISITOS ELIMINADOS` | Comportamiento obsoleto | Se elimina de la especificación principal |

### Por Qué Deltas en Lugar de Especificaciones Completas

**Claridad.** Un delta muestra exactamente qué está cambiando. Al leer una especificación completa, tendrías que compararla mentalmente con la versión actual.

**Evitar conflictos.** Dos cambios pueden tocar el mismo archivo de especificación sin entrar en conflicto, siempre que modifiquen diferentes requisitos.

**Eficiencia en la revisión.** Los revisores ven el cambio, no el contexto sin cambios. Se centran en lo que importa.

**Adecuado para brownfield.** La mayor parte del trabajo modifica comportamientos existentes. Las deltas hacen que las modificaciones sean de primera clase, no una ocurrencia tardía.

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
    requires: [proposal]      # Necesita la propuesta antes de crear

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
   (requiere:                  (requiere:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requiere:
                specs, design)
```

**Las dependencias son habilitadores, no puertas.** Muestran qué es posible crear, no qué debes crear a continuación. Puedes omitir el diseño si no lo necesitas. Puedes crear las especificaciones antes o después del diseño — ambas dependen solo de la propuesta.

### Esquemas Integrados

**spec-driven** (predeterminado)

El flujo de trabajo estándar para el desarrollo impulsado por especificaciones:

```
proposal → specs → design → tasks → implement
```

Ideal para: La mayoría del trabajo de funcionalidades donde se desea acordar las especificaciones antes de la implementación.

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
    requires: [research]   # Propuesta basada en la investigación

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Omitir specs/design, ir directo a tareas
```

Consulta [Personalización](customization.md) para obtener detalles completos sobre la creación y uso de esquemas personalizados.

## Archivo

El archivado completa un cambio fusionando sus especificaciones delta en las especificaciones principales y preservando el cambio para el historial.

### Qué Sucede al Archivar

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
│       └── spec.md        # Ahora incluye los requisitos de 2FA
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

1. **Fusionar deltas.** Cada sección de especificación delta (AÑADIDO/MODIFICADO/ELIMINADO) se aplica a la especificación principal correspondiente.

2. **Mover al archivo.** La carpeta del cambio se mueve a `changes/archive/` con un prefijo de fecha para orden cronológico.

3. **Preservar el contexto.** Todos los artefactos permanecen intactos en el archivo. Siempre puedes revisar para entender por qué se realizó un cambio.

### Por Qué Importa el Archivado

**Estado limpio.** Los cambios activos (`changes/`) muestran solo el trabajo en progreso. El trabajo completado se aparta.

**Registro de auditoría.** El archivo preserva el contexto completo de cada cambio — no solo qué cambió, sino la propuesta que explica por qué, el diseño que explica cómo y las tareas que muestran el trabajo realizado.

**Evolución de las especificaciones.** Las especificaciones crecen orgánicamente a medida que se archivan los cambios. Cada archivo fusiona sus deltas, construyendo una especificación completa con el tiempo.

## Cómo Todo Encaja

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO DE OPENSPEC                               │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. INICIAR    │  /opsx:propose (core) o /opsx:new (expandido)           │
│   │     CAMBIO     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREAR      │  /opsx:ff o /opsx:continue (flujo de trabajo expandido) │
│   │     ARTEFACTOS │  Crea proposal → specs → design → tasks                 │
│   │                │  (basado en dependencias del esquema)                    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTAR│  /opsx:apply                                            │
│   │     TAREAS     │  Trabaja en las tareas, marcándolas como completadas    │
│   │                │◄──── Actualiza artefactos a medida que aprendes          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICAR  │  /opsx:verify (opcional)                                │
│   │     TRABAJO    │  Comprueba que la implementación coincida con las specs │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVAR   │────►│  Las especificaciones delta se fusionan      │    │
│   │     CAMBIO     │     │  en las especificaciones principales         │    │
│   └────────────────┘     │  La carpeta del cambio se mueve a archive/   │    │
│                          │  Las specs ahora son la fuente de verdad      │    │
│                          │  actualizada                                  │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**El ciclo virtuoso:**

1. Las especificaciones describen el comportamiento actual
2. Los cambios proponen modificaciones (como deltas)
3. La implementación hace los cambios reales
4. El archivado fusiona las deltas en las especificaciones
5. Las especificaciones ahora describen el nuevo comportamiento
6. El siguiente cambio se basa en las especificaciones actualizadas

## Glosario

| Término | Definición |
|---------|------------|
| **Artefacto** | Un documento dentro de un cambio (propuesta, diseño, tareas o especificaciones delta) |
| **Archivo** | El proceso de completar un cambio y fusionar sus deltas en las especificaciones principales |
| **Cambio** | Una modificación propuesta al sistema, empaquetada como una carpeta con artefactos |
| **Especificación delta** | Una especificación que describe cambios (AÑADIDO/MODIFICADO/ELIMINADO) en relación con las especificaciones actuales |
| **Dominio** | Una agrupación lógica para especificaciones (ej., `auth/`, `payments/`) |
| **Requisito** | Un comportamiento específico que el sistema debe tener |
| **Escenario** | Un ejemplo concreto de un requisito, típicamente en formato Dado/Cuando/Entonces |
| **Esquema** | Una definición de tipos de artefactos y sus dependencias |
| **Especificación** | Una especificación que describe el comportamiento del sistema, que contiene requisitos y escenarios |
| **Fuente de verdad** | El directorio `openspec/specs/`, que contiene el comportamiento acordado actual |

## Siguientes Pasos

- [Primeros Pasos](getting-started.md) - Pasos prácticos iniciales
- [Flujos de Trabajo](workflows.md) - Patrones comunes y cuándo usar cada uno
- [Comandos](commands.md) - Referencia completa de comandos
- [Personalización](customization.md) - Crea esquemas personalizados y configura tu proyecto