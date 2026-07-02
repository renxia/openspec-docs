# Conceptos

Esta guía explica las ideas centrales detrás de OpenSpec y cómo encajan. Para un uso práctico, consulte [Empezar](getting-started.md) y [Flujos de trabajo](workflows.md).

## Filosofía

OpenSpec se basa en cuatro principios:

```
fluido y no rígido         — sin puertas de fase (phase gates), trabaja en lo que tiene sentido
iterativo y no cascada — aprende mientras construyes, refina a medida que avanzas
fácil y no complejo        — configuración ligera, ceremonia mínima
prioridad en brownfield — funciona con bases de código existentes, no solo con proyectos nuevos (greenfield)
```

### Por Qué Son Importantes Estos Principios

**Fluido y no rígido.** Los sistemas de especificación tradicionales te encierran en fases: primero planeas, luego implementas y terminas. OpenSpec es más flexible; puedes crear artefactos en cualquier orden que tenga sentido para tu trabajo.

**Iterativo y no cascada.** Los requisitos cambian. La comprensión se profundiza. Lo que parecía un buen enfoque al principio podría no mantenerse después de ver la base de código (codebase). OpenSpec abraza esta realidad.

**Fácil y no complejo.** Algunos marcos de especificación requieren una configuración extensa, formatos rígidos o procesos pesados. OpenSpec no se interpone en tu camino. Inicializa en segundos, empieza a trabajar inmediatamente, personaliza solo si es necesario.

**Prioridad en brownfield.** La mayor parte del trabajo de software no es construir desde cero; es modificar sistemas existentes. El enfoque basado en delta (delta-based) de OpenSpec facilita la especificación de cambios en el comportamiento existente, no solo la descripción de nuevos sistemas.

## La Imagen General

OpenSpec organiza su trabajo en dos áreas principales:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** es la fuente de verdad: describen cómo se comporta actualmente su sistema.

**Changes** son modificaciones propuestas: residen en carpetas separadas hasta que esté listo para fusionarlas (merge).

Esta separación es clave. Puede trabajar en múltiples cambios en paralelo sin conflictos. Puede revisar un cambio antes de que afecte a las specs principales. Y cuando archiva un cambio, sus deltas se integran limpiamente en la fuente de verdad.

## Specs

Las Specs describen el comportamiento de su sistema utilizando requisitos y escenarios estructurados.

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
    └── spec.md           # Comportamiento y temas de la interfaz de usuario (UI)
```

Organice las specs por dominio: agrupaciones lógicas que tengan sentido para su sistema. Patrones comunes:

- **Por área de funcionalidad**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto acotado (bounded context)**: `ordering/`, `fulfillment/`, `inventory/`

### Formato de Spec

Una spec contiene requisitos, y cada requisito tiene escenarios:

```markdown
# Especificación de Auth

## Propósito
Gestión de la autenticación y las sesiones para la aplicación.

## Requisitos

### Requisito: Autenticación de Usuario
El sistema DEBE emitir un token JWT tras un inicio de sesión exitoso.

#### Escenario: Credenciales válidas
- DADO un usuario con credenciales válidas
- CUANDO el usuario envía el formulario de inicio de sesión
- ENTONCES se devuelve un token JWT
- Y el usuario es redirigido al panel de control (dashboard)

#### Escenario: Credenciales inválidas
- DADO credenciales inválidas
- CUANDO el usuario envía el formulario de inicio de sesión
- ENTONCES se muestra un mensaje de error
- Y no se emite ningún token

### Requisito: Caducidad de Sesión
El sistema DEBE caducar las sesiones después de 30 minutos de inactividad.

#### Escenario: Tiempo de espera por inactividad (Idle timeout)
- DADA una sesión autenticada
- CUANDO pasan 30 minutos sin actividad
- ENTONCES la sesión queda invalidada
- Y el usuario debe volver a autenticarse
```

**Elementos clave:**

| Elemento | Propósito |
|---------|---------|
| `## Propósito` | Descripción de alto nivel del dominio de esta spec |
| `### Requisito:` | Un comportamiento específico que el sistema debe tener |
| `#### Escenario:` | Un ejemplo concreto del requisito en acción |
| SHALL/MUST/SHOULD | Palabras clave de RFC 2119 que indican la fuerza del requisito |

### Por qué estructurar las Specs de esta manera

**Los Requisitos son el "qué"**: establecen lo que debe hacer el sistema sin especificar la implementación.

**Los Escenarios son el "cuándo"**: proporcionan ejemplos concretos que pueden ser verificados. Buenos escenarios:
- Son probables (se podría escribir una prueba automatizada para ellos)
- Cubren tanto la ruta feliz como los casos límite (edge cases).
- Utilizan Given/When/Then o un formato estructurado similar.

**Palabras clave de RFC 2119** (SHALL, MUST, SHOULD, MAY) comunican la intención:
- **MUST/SHALL** — Requisito absoluto
- **SHOULD** — Recomendado, pero existen excepciones
- **MAY** — Opcional

### Qué es una Spec (y qué no es)

Una spec es un **contrato de comportamiento**, no un plan de implementación.

Contenido bueno para la especificación:
- Comportamiento observable en el que confían los usuarios o sistemas posteriores (downstream).
- Entradas, salidas y condiciones de error.
- Restricciones externas (seguridad, privacidad, fiabilidad, compatibilidad).
- Escenarios que pueden ser probados o validados explícitamente.

Evitar en las specs:
- Nombres internos de clases/funciones.
- Elecciones de librerías o frameworks.
- Detalles de implementación paso a paso.
- Planes de ejecución detallados (esos pertenecen a `design.md` o `tasks.md`).

Prueba rápida:
- Si la implementación puede cambiar sin cambiar el comportamiento visible externamente, probablemente no pertenece a la especificación.

### Mantenerlo Ligero: Rigor Progresivo

OpenSpec busca evitar la burocracia. Utilice el nivel más ligero que aún haga que el cambio sea verificable.

**Lite spec (predeterminado):**
- Requisitos cortos centrados en el comportamiento.
- Alcance claro y no-objetivos (non-goals).
- Unos pocos puntos de aceptación concretos.

**Full spec (para mayor riesgo):**
- Cambios entre equipos o repositorios.
- Cambios de API/contrato, migraciones, preocupaciones de seguridad/privacidad.
- Cambios donde es probable que la ambigüedad cause un trabajo reestructurado costoso.

La mayoría de los cambios deben permanecer en modo Lite.

### Colaboración Humana + Agente

En muchos equipos, los humanos exploran y los agentes redactan artefactos. El ciclo previsto es:

1. El humano proporciona la intención, el contexto y las restricciones.
2. El agente convierte esto en requisitos centrados en el comportamiento y escenarios.
3. El agente mantiene los detalles de implementación en `design.md` y `tasks.md`, no en `spec.md`.
4. La validación confirma la estructura y claridad antes de la implementación.

Esto mantiene las specs legibles para los humanos y consistentes para los agentes.

## Changes

Un Change es una modificación propuesta a su sistema, empaquetada como una carpeta con todo lo necesario para entenderla e implementarla.

### Estructura del Cambio

```
openspec/changes/add-dark-mode/
├── proposal.md           # Por qué y qué
├── design.md             # Cómo (enfoque técnico)
├── tasks.md              # Lista de verificación de implementación
├── .openspec.yaml        # Metadatos del cambio (opcional)
└── specs/                # Specs delta
    └── ui/
        └── spec.md       # Qué está cambiando en ui/spec.md
```

Cada cambio es autocontenido. Contiene:
- **Artifacts** — Documentos que capturan la intención, el diseño y las tareas.
- **Delta specs** — Especificaciones de lo que se está añadiendo, modificando o eliminando.
- **Metadata** — Configuración opcional para este cambio específico.

### Por qué los Cambios son Carpetas

Empaquetar un cambio como una carpeta tiene varios beneficios:

1. **Todo junto.** La propuesta, el diseño, las tareas y las specs residen en un solo lugar. Sin tener que buscar en diferentes ubicaciones.

2. **Trabajo paralelo.** Múltiples cambios pueden existir simultáneamente sin conflicto. Trabaje en `add-dark-mode` mientras `fix-auth-bug` también está en progreso.

3. **Historial limpio.** Cuando se archivan, los cambios pasan a `changes/archive/` con su contexto completo preservado. Puede mirar hacia atrás y entender no solo qué cambió, sino por qué.

4. **Amigable para la revisión.** Una carpeta de cambio es fácil de revisar: ábrala, lea la propuesta, revise el diseño, vea las deltas de la spec.

## Artifacts

Los Artifacts son los documentos dentro de un cambio que guían el trabajo.

### El Flujo de Artefactos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   por qué        qué           cómo          pasos a seguir
 + alcance      cambios       enfoque     para realizar
```

Los Artifacts se construyen unos sobre otros. Cada artefacto proporciona contexto para el siguiente.

### Tipos de Artefactos

#### Proposal (`proposal.md`)

La propuesta captura la **intención**, el **alcance** y el **enfoque** a un nivel alto.

```markdown
# Propuesta: Añadir Modo Oscuro

## Intención
Los usuarios han solicitado una opción de modo oscuro para reducir la fatiga visual
durante el uso nocturno y para que coincida con las preferencias del sistema.

## Alcance
Incluido (In scope):
- Interruptor de tema en la configuración
- Detección de preferencias del sistema
- Persistencia de la preferencia en localStorage

Excluido (Out of scope):
- Temas de color personalizados (trabajo futuro)
- Anulaciones de temas por página

## Enfoque (Approach)
Utilizar propiedades CSS personalizadas para el tematización con un contexto de React
para la gestión del estado. Detectar la preferencia del sistema en la primera carga,
permitir anulación manual.
```

**Cuándo actualizar la propuesta:**
- Cambios de alcance (estrechar o expandir).
- La intención se aclara (mejor comprensión del problema).
- El enfoque cambia fundamentalmente.

#### Specs (delta specs en `specs/`)

Las delta specs describen **qué está cambiando** en relación con las specs actuales. Consulte [Delta Specs](#delta-specs) a continuación.

#### Design (`design.md`)

El diseño captura el **enfoque técnico** y las **decisiones de arquitectura**.

````markdown
# Diseño: Añadir Modo Oscuro

## Enfoque Técnico
El estado del tema se gestiona mediante React Context para evitar la propagación de props (prop drilling).
Las propiedades CSS personalizadas permiten el cambio en tiempo de ejecución sin alternar clases.

## Decisiones de Arquitectura

### Decisión: Contexto sobre Redux
Usar React Context para el estado del tema porque:
- Estado binario simple (claro/oscuro)
- Sin transiciones de estado complejas
- Evita añadir una dependencia de Redux

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
Variables CSS (aplicadas a :root)
```

## Cambios de Archivos
- `src/contexts/ThemeContext.tsx` (nuevo)
- `src/components/ThemeToggle.tsx` (nuevo)
- `src/styles/globals.css` (modificado)
````

**Cuándo actualizar el diseño:**
- La implementación revela que el enfoque no funcionará.
- Se descubre una mejor solución.
- Cambian las dependencias o las restricciones.

#### Tasks (`tasks.md`)

Las Tareas son la **lista de verificación de implementación**: pasos concretos con casillas de verificación.

```markdown
# Tareas

## 1. Infraestructura del Tema
- [ ] 1.1 Crear ThemeContext con estado claro/oscuro
- [ ] 1.2 Añadir propiedades CSS personalizadas para los colores
- [ ] 1.3 Implementar la persistencia en localStorage
- [ ] 1.4 Añadir detección de preferencia del sistema

## 2. Componentes de UI
- [ ] 2.1 Crear el componente ThemeToggle
- [ ] 2.2 Añadir el interruptor a la página de configuración
- [ ] 2.3 Actualizar la cabecera para incluir un interruptor rápido

## 3. Estilizado (Styling)
- [ ] 3.1 Definir la paleta de colores del tema oscuro
- [ ] 3.2 Actualizar los componentes para usar variables CSS
- [ ] 3.3 Probar las proporciones de contraste para la accesibilidad
```

**Mejores prácticas para tareas:**
- Agrupar tareas relacionadas bajo encabezados.
- Usar numeración jerárquica (1.1, 1.2, etc.).
- Mantener las tareas lo suficientemente pequeñas para completarlas en una sesión.
- Marcar las tareas como completadas a medida que se terminan.

## Delta Specs

Las delta specs son el concepto clave que hace que OpenSpec funcione para el desarrollo en sistemas existentes (brownfield). Describen **qué está cambiando** en lugar de reiterar la especificación completa.

### El Formato

```markdown
# Delta para Auth

## Requisitos AÑADIDOS

### Requisito: Autenticación de Dos Factores
El sistema DEBE soportar la autenticación de dos factores basada en TOTP.

#### Escenario: Inscripción de 2FA
- DADO un usuario sin habilitado el 2FA
- CUANDO el usuario habilita el 2FA en la configuración
- ENTONCES se muestra un código QR para configurar la aplicación de autenticador
- Y el usuario debe verificar con un código antes de la activación

#### Escenario: Inicio de sesión con 2FA
- DADO un usuario con 2FA habilitado
- CUANDO el usuario envía credenciales válidas
- ENTONCES se presenta un desafío OTP (One-Time Password)
- Y el inicio de sesión se completa solo después de un OTP válido

## Requisitos MODIFICADOS

### Requisito: Caducidad de Sesión
El sistema DEBE caducar las sesiones después de 15 minutos de inactividad.
(Anteriormente: 30 minutos)

#### Escenario: Tiempo de espera por inactividad
- DADA una sesión autenticada
- CUANDO pasan 15 minutos sin actividad
- ENTONCES la sesión queda invalidada

## Requisitos ELIMINADOS

### Requisito: Recordarme (Remember Me)
(Obsoleto en favor del 2FA. Los usuarios deben volver a autenticarse en cada sesión.)
```

### Secciones Delta

| Sección | Significado | Qué Sucede al Archivar |
|---------|---------|------------------------|
| `## Requisitos AÑADIDOS` | Nuevo comportamiento | Se adjunta a la especificación principal |
| `## Requisitos MODIFICADOS` | Comportamiento cambiado | Reemplaza el requisito existente |
| `## Requisitos ELIMINADOS` | Comportamiento obsoleto | Se elimina de la especificación principal |

### Por qué Deltas en lugar de Especificaciones Completas

**Claridad.** Un delta muestra exactamente qué está cambiando. Leyendo una especificación completa, tendría que compararla mentalmente con la versión actual.

**Evitar conflictos.** Dos cambios pueden tocar el mismo archivo de especificación sin conflicto, siempre y cuando modifiquen requisitos diferentes.

**Eficiencia en la revisión.** Los revisores ven el cambio, no el contexto inalterado. Se centran en lo que importa.

**Ajuste para sistemas existentes (Brownfield fit).** La mayoría del trabajo modifica comportamientos existentes. Las Deltas hacen que las modificaciones sean una clase de primer orden, no un pensamiento posterior.

## Esquemas

Los esquemas definen los tipos de artefactos y sus dependencias para un flujo de trabajo.

### Funcionamiento de los Esquemas

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No tiene dependencias, puede crearse primero

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Necesita la propuesta antes de crearla

  - id: design
    generates: design.md
    requires: [proposal]      # Puede crearse en paralelo con specs

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

**Las dependencias son habilitadores, no puertas de paso.** Muestran lo que es posible crear, no lo que debes crear a continuación. Puedes omitir el diseño si no lo necesitas. Puedes crear specs antes o después del diseño; ambos dependen solo de la propuesta.

### Esquemas Integrados (Built-in)

**spec-driven** (predeterminado)

El flujo de trabajo estándar para el desarrollo basado en especificaciones:

```
proposal → specs → design → tasks → implement
```

Mejor para: La mayoría del trabajo de características donde deseas acordar las especificaciones antes de la implementación.

### Esquemas Personalizados (Custom Schemas)

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
    requires: []           # Investiga primero

  - id: proposal
    generates: proposal.md
    requires: [research]   # La propuesta está informada por la investigación

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Omite specs/design, ve directamente a tareas
```

Consulta [Customization](customization.md) para obtener detalles completos sobre cómo crear y usar esquemas personalizados.

## Archivo (Archive)

El archivo completa un cambio al fusionar sus especificaciones delta en las especificaciones principales y preservando el cambio para la historia.

### Qué Sucede Cuando Archivas

```
Antes de archivar:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Después de archivar:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Ahora incluye los requisitos de 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preservado para la historia
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### El Proceso de Archivo

1. **Fusionar deltas.** Cada sección de especificación delta (AÑADIDO/MODIFICADO/ELIMINADO) se aplica a la especificación principal correspondiente.

2. **Mover al archivo.** La carpeta del cambio se mueve a `changes/archive/` con un prefijo de fecha para el orden cronológico.

3. **Preservar el contexto.** Todos los artefactos permanecen intactos en el archivo. Siempre puedes mirar hacia atrás para entender por qué se realizó un cambio.

### Por Qué es Importante Archivar

**Estado limpio.** Los cambios activos (`changes/`) muestran solo el trabajo en progreso. El trabajo completado se mueve fuera del camino.

**Rastro de auditoría.** El archivo preserva el contexto completo de cada cambio: no solo qué cambió, sino la propuesta que explica por qué, el diseño que explica cómo y las tareas que muestran el trabajo realizado.

**Evolución de especificaciones.** Las especificaciones crecen orgánicamente a medida que se archivan los cambios. Cada archivo fusiona sus deltas, construyendo una especificación exhaustiva con el tiempo.

## Cómo Encaja Todo Juntos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO DE OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. INICIAR      │  /opsx:propose (core) o /opsx:new (expanded)           │
│   │     CAMBIO      │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREAR       │  /opsx:ff o /opsx:continue (flujo de trabajo expandido)     │
│   │     ARTIFACTOS  │  Crea proposal → specs → design → tasks              │
│   │                │  (basado en las dependencias del esquema)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTAR │  /opsx:apply                                            │
│   │     TAREAS      │  Realiza las tareas, marcándolas como completadas                  │
│   │                │◄──── Actualiza los artefactos a medida que aprendes                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICAR   │  /opsx:verify (opcional)                                │
│   │     TRABAJO     │  Verifica que la implementación coincide con las especificaciones                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVAR    │────►│  Las especificaciones delta se fusionan en las especificaciones principales           │    │
│   │     CAMBIO      │     │  La carpeta del cambio se mueve a archive/             │    │
│   └────────────────┘     │  Las especificaciones son ahora la fuente de verdad actualizada   │    │
│                                                                              └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**El ciclo virtuoso:**

1. Las especificaciones describen el comportamiento actual.
2. Los cambios proponen modificaciones (como deltas).
3. La implementación hace que los cambios sean reales.
4. El archivo fusiona las deltas en las especificaciones.
5. Las especificaciones ahora describen el nuevo comportamiento.
6. El próximo cambio se basa en las especificaciones actualizadas.

## Glosario

| Término | Definición |
|------|------------|
| **Artifact** | Un documento dentro de un cambio (propuesta, diseño, tareas o especificaciones delta) |
| **Archive** | El proceso de completar un cambio y fusionar sus deltas en las especificaciones principales |
| **Change** | Una modificación propuesta al sistema, empaquetada como una carpeta con artefactos |
| **Delta spec** | Una especificación que describe cambios (AÑADIDO/MODIFICADO/ELIMINADO) en relación con las especificaciones actuales |
| **Domain** | Un agrupamiento lógico para las especificaciones (ej. `auth/`, `payments/`) |
| **Requirement** | Un comportamiento específico que el sistema debe tener |
| **Scenario** | Un ejemplo concreto de un requisito, típicamente en formato Dado/Cuando/Entonces |
| **Schema** | Una definición de tipos de artefactos y sus dependencias |
| **Spec** | Una especificación que describe el comportamiento del sistema, conteniendo requisitos y escenarios |
| **Source of truth** | El directorio `openspec/specs/`, que contiene el comportamiento actual acordado |

## Próximos Pasos

- [Getting Started](getting-started.md) - Primeros pasos prácticos
- [Workflows](workflows.md) - Patrones comunes y cuándo usar cada uno
- [Commands](commands.md) - Referencia completa de comandos
- [Customization](customization.md) - Crear esquemas personalizados y configurar tu proyecto