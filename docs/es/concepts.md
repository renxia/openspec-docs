# Conceptos

Esta guía explica las ideas fundamentales detrás de OpenSpec y cómo se relacionan entre sí. Para un uso práctico, consulta [Primeros Pasos](getting-started.md) y [Flujos de Trabajo](workflows.md).

## Filosofía

OpenSpec se construye en torno a cuatro principios:

```
fluido no rígido         — sin puertas de fase, trabaja en lo que tenga sentido
iterativo no cascada     — aprende mientras construyes, refina sobre la marcha
fácil no complejo        — configuración ligera, mínimo ceremonial
brownfield-first         — funciona con bases de código existentes, no solo con proyectos nuevos
```

### Por Qué Importan Estos Principios

**Fluido no rígido.** Los sistemas de especificación tradicionales te encierran en fases: primero planificas, luego implementas, y finalizas. OpenSpec es más flexible — puedes crear artefactos en cualquier orden que tenga sentido para tu trabajo.

**Iterativo no cascada.** Los requisitos cambian. La comprensión se profundiza. Lo que parecía un buen enfoque al principio podría no sostenerse después de ver la base de código. OpenSpec abraza esta realidad.

**Fácil no complejo.** Algunos marcos de especificación requieren una configuración extensa, formatos rígidos o procesos pesados. OpenSpec no te estorba. Inicializa en segundos, comienza a trabajar inmediatamente, personaliza solo si lo necesitas.

**Brownfield-first.** La mayoría del trabajo de software no consiste en construir desde cero — se trata de modificar sistemas existentes. El enfoque basado en deltas de OpenSpec facilita especificar cambios en el comportamiento existente, no solo describir sistemas nuevos.

## Visión General

OpenSpec organiza tu trabajo en dos áreas principales:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fuente de verdad  │◄─────│  Modificaciones propuestas    │   │
│   │  Cómo funciona      │ merge│  Cada cambio = una carpeta    │   │
│   │  tu sistema actual  │      │  Contiene artefactos + deltas │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Los Specs** son la fuente de verdad — describen cómo se comporta actualmente tu sistema.

**Los Changes** son modificaciones propuestas — residen en carpetas separadas hasta que estés listo para fusionarlos.

Esta separación es clave. Puedes trabajar en múltiples cambios en paralelo sin conflictos. Puedes revisar un cambio antes de que afecte los specs principales. Y cuando archivas un cambio, sus deltas se fusionan limpiamente en la fuente de verdad.

## Specs

Los specs describen el comportamiento de tu sistema utilizando requisitos y escenarios estructurados.

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
    └── spec.md           # Comportamiento y temas de la interfaz de usuario
```

Organiza los specs por dominio — agrupaciones lógicas que tengan sentido para tu sistema. Patrones comunes:

- **Por área de funcionalidad**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto acotado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato del Spec

Un spec contiene requisitos, y cada requisito tiene escenarios:

```markdown
# Especificación de Autenticación

## Propósito
Autenticación y gestión de sesiones para la aplicación.

## Requisitos

### Requisito: Autenticación de Usuarios
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

### Requisito: Expiración de Sesiones
El sistema DEBE expirar las sesiones después de 30 minutos de inactividad.

#### Escenario: Tiempo de espera por inactividad
- DADO una sesión autenticada
- CUANDO pasan 30 minutos sin actividad
- ENTONCES la sesión se invalida
- Y el usuario debe autenticarse nuevamente
```

**Elementos clave:**

| Elemento | Propósito |
|---------|---------|
| `## Purpose` | Descripción de alto nivel del dominio de este spec |
| `### Requirement:` | Un comportamiento específico que el sistema debe tener |
| `#### Scenario:` | Un ejemplo concreto del requisito en acción |
| SHALL/MUST/SHOULD | Palabras clave de la RFC 2119 que indican la fuerza del requisito |

### Por Qué Estructurar los Specs de Esta Manera

**Los requisitos son el "qué"** — declaran qué debe hacer el sistema sin especificar la implementación.

**Los escenarios son el "cuándo"** — proporcionan ejemplos concretos que pueden ser verificados. Buenos escenarios:
- Son verificables (podrías escribir una prueba automatizada para ellos)
- Cubren tanto el camino feliz como los casos extremos
- Usan el formato estructurado DADO/CUANDO/ENTONCES o similar

**Las palabras clave de la RFC 2119** (SHALL, MUST, SHOULD, MAY) comunican la intención:
- **MUST/SHALL** — requisito absoluto
- **SHOULD** — recomendado, pero existen excepciones
- **MAY** — opcional

### Qué Es un Spec (y Qué No Es)

Un spec es un **contrato de comportamiento**, no un plan de implementación.

Buen contenido de spec:
- Comportamiento observable en el que confían los usuarios o sistemas descendentes
- Entradas, salidas y condiciones de error
- Restricciones externas (seguridad, privacidad, fiabilidad, compatibilidad)
- Escenarios que pueden ser probados o validados explícitamente

Evitar en los specs:
- Nombres internos de clases/funciones
- Elecciones de bibliotecas o frameworks
- Detalles de implementación paso a paso
- Planes de ejecución detallados (estos pertenecen a `design.md` o `tasks.md`)

Prueba rápida:
- Si la implementación puede cambiar sin alterar el comportamiento visible externamente, probablemente no pertenece al spec.

### Mantenerlo Ligero: Rigor Progresivo

OpenSpec busca evitar la burocracia. Usa el nivel más ligero que haga que el cambio sea verificable.

**Spec ligero (predeterminado):**
- Requisitos cortos centrados en el comportamiento
- Alcance y objetivos no incluidos claros
- Algunas verificaciones de aceptación concretas

**Spec completo (para mayor riesgo):**
- Cambios entre equipos o repositorios
- Cambios en API/contratos, migraciones, preocupaciones de seguridad/privacidad
- Cambios donde la ambigüedad probablemente cause retrabajo costoso

La mayoría de los cambios deben permanecer en modo ligero.

### Colaboración Humano + Agente

En muchos equipos, los humanos exploran y los agentes redactan artefactos. El bucle previsto es:

1. El humano proporciona la intención, el contexto y las restricciones.
2. El agente convierte esto en requisitos centrados en el comportamiento y escenarios.
3. El agente mantiene los detalles de implementación en `design.md` y `tasks.md`, no en `spec.md`.
4. La validación confirma la estructura y la claridad antes de la implementación.

Esto mantiene los specs legibles para los humanos y consistentes para los agentes.

## Changes

Un change es una modificación propuesta a tu sistema, empaquetada como una carpeta con todo lo necesario para entenderlo e implementarlo.

### Estructura del Change

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

Cada change es autocontenido. Tiene:
- **Artefactos** — documentos que capturan la intención, el diseño y las tareas
- **Specs delta** — especificaciones de lo que se está añadiendo, modificando o eliminando
- **Metadatos** — configuración opcional para este cambio específico

### Por Qué los Changes Son Carpetas

Empaquetar un change como carpeta tiene varios beneficios:

1. **Todo junto.** Propuesta, diseño, tareas y specs viven en un solo lugar. No hay que buscar en diferentes ubicaciones.

2. **Trabajo en paralelo.** Pueden existir múltiples cambios simultáneamente sin conflictos. Trabaja en `add-dark-mode` mientras `fix-auth-bug` también está en progreso.

3. **Historial limpio.** Cuando se archivan, los cambios se mueven a `changes/archive/` con su contexto completo preservado. Puedes mirar hacia atrás y entender no solo qué cambió, sino por qué.

4. **Fácil de revisar.** Una carpeta de change es fácil de revisar — ábrela, lee la propuesta, revisa el diseño, mira los deltas de los specs.

## Artefactos

Los artefactos son los documentos dentro de un change que guían el trabajo.

### El Flujo de los Artefactos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   por qué        qué           cómo          pasos
 + alcance      cambios       enfoque       a seguir
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
- Alternancia de tema en la configuración
- Detección de preferencias del sistema
- Persistencia de la preferencia en localStorage

Fuera del alcance:
- Temas de colores personalizados (trabajo futuro)
- Anulaciones de tema por página

## Enfoque
Usar propiedades CSS personalizadas para el theming con un contexto React
para la gestión de estado. Detectar la preferencia del sistema en la primera carga,
permitir la anulación manual.
```

**Cuándo actualizar la propuesta:**
- Cambios en el alcance (reducción o expansión)
- La intención se aclara (mejor comprensión del problema)
- El enfoque cambia fundamentalmente

#### Specs (specs delta en `specs/`)

Los specs delta describen **qué está cambiando** en relación con los specs actuales. Ver [Specs Delta](#delta-specs) más abajo.

#### Diseño (`design.md`)

El diseño captura el **enfoque técnico** y las **decisiones de arquitectura**.

````markdown
# Diseño: Añadir Modo Oscuro

## Enfoque Técnico
El estado del tema se gestiona a través de React Context para evitar el prop drilling.
Las propiedades CSS personalizadas permiten el cambio en tiempo de ejecución sin alternancia de clases.

## Decisiones de Arquitectura

### Decisión: Context sobre Redux
Se utiliza React Context para el estado del tema porque:
- Estado binario simple (claro/oscuro)
- No hay transiciones de estado complejas
- Se evita añadir la dependencia de Redux

### Decisión: Propiedades Personalizadas de CSS
Se utilizan variables CSS en lugar de CSS-in-JS porque:
- Funciona con la hoja de estilos existente
- No hay sobrecarga en tiempo de ejecución
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

## Cambios en Archivos
- `src/contexts/ThemeContext.tsx` (nuevo)
- `src/components/ThemeToggle.tsx` (nuevo)
- `src/styles/globals.css` (modificado)
````

**Cuándo actualizar el diseño:**
- La implementación revela que el enfoque no funcionará
- Se descubre una mejor solución
- Cambian las dependencias o restricciones

#### Tareas (`tasks.md`)

Las tareas son la **lista de verificación de implementación** — pasos concretos con casillas de verificación.

```markdown
# Tareas

## 1. Infraestructura de Tema
- [ ] 1.1 Crear ThemeContext con estado claro/oscuro
- [ ] 1.2 Agregar propiedades CSS personalizadas para colores
- [ ] 1.3 Implementar persistencia en localStorage
- [ ] 1.4 Agregar detección de preferencias del sistema

## 2. Componentes de UI
- [ ] 2.1 Crear componente ThemeToggle
- [ ] 2.2 Agregar alternador a la página de configuración
- [ ] 2.3 Actualizar Header para incluir alternador rápido

## 3. Estilos
- [ ] 3.1 Definir paleta de colores para tema oscuro
- [ ] 3.2 Actualizar componentes para usar variables CSS
- [ ] 3.3 Probar ratios de contraste para accesibilidad
```

**Mejores prácticas para tareas:**
- Agrupar tareas relacionadas bajo encabezados
- Usar numeración jerárquica (1.1, 1.2, etc.)
- Mantener tareas lo suficientemente pequeñas para completarlas en una sesión
- Marcar las tareas a medida que se completan

## Especificaciones Delta

Las especificaciones delta son el concepto clave que hace que OpenSpec funcione para desarrollo en entornos existentes. Describen **qué está cambiando** en lugar de reespecificar toda la especificación.

### El Formato

```markdown
# Delta para Auth

## REQUERIMIENTOS AÑADIDOS

### Requerimiento: Autenticación de Dos Factores
El sistema DEBE soportar autenticación de dos factores basada en TOTP.

#### Escenario: Inscripción en 2FA
- DADO un usuario sin 2FA habilitado
- CUANDO el usuario habilita 2FA en la configuración
- ENTONCES se muestra un código QR para la configuración de la aplicación de autenticación
- Y el usuario debe verificar con un código antes de la activación

#### Escenario: Inicio de sesión con 2FA
- DADO un usuario con 2FA habilitado
- CUANDO el usuario envía credenciales válidas
- ENTONCES se presenta un desafío OTP
- Y el inicio de sesión se completa solo después de un OTP válido

## REQUERIMIENTOS MODIFICADOS

### Requerimiento: Expiración de Sesión
El sistema DEBE expirar las sesiones después de 15 minutos de inactividad.
(Previamente: 30 minutos)

#### Escenario: Tiempo de espera por inactividad
- DADO una sesión autenticada
- CUANDO pasan 15 minutos sin actividad
- ENTONCES la sesión se invalida

## REQUERIMIENTOS ELIMINADOS

### Requerimiento: Recordarme
(Depreciado en favor de 2FA. Los usuarios deben re-autenticarse en cada sesión.)
```

### Secciones de Delta

| Sección | Significado | Qué Ocurre al Archivar |
|---------|-------------|------------------------|
| `## REQUERIMIENTOS AÑADIDOS` | Comportamiento nuevo | Se añade a la especificación principal |
| `## REQUERIMIENTOS MODIFICADOS` | Comportamiento cambiado | Reemplaza el requerimiento existente |
| `## REQUERIMIENTOS ELIMINADOS` | Comportamiento deprecado | Se elimina de la especificación principal |

### Por Qué Deltas en Lugar de Especificaciones Completas

**Claridad.** Un delta muestra exactamente qué está cambiando. Al leer una especificación completa, tendrías que hacer un diff mental contra la versión actual.

**Evitación de conflictos.** Dos cambios pueden tocar el mismo archivo de especificación sin conflicto, siempre que modifiquen requerimientos diferentes.

**Eficiencia en la revisión.** Los revisores ven el cambio, no el contexto no modificado. Se centran en lo que importa.

**Adaptación a entornos existentes.** La mayoría del trabajo modifica comportamiento existente. Los deltas hacen que las modificaciones sean de primera clase, no un añadido posterior.

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
    requires: [proposal]      # Necesita proposal antes de crear

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

**Las dependencias son habilitadores, no compuertas.** Muestran qué es posible crear, no qué debes crear a continuación. Puedes omitir design si no lo necesitas. Puedes crear specs antes o después de design — ambos dependen solo de proposal.

### Esquemas Integrados

**spec-driven** (predeterminado)

El flujo de trabajo estándar para desarrollo guiado por especificaciones:

```
proposal → specs → design → tasks → implement
```

Ideal para: La mayoría del trabajo de funcionalidades donde quieres acordar las especificaciones antes de la implementación.

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
    requires: []           # Hacer investigación primero

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informado por la investigación

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Omitir specs/design, ir directo a tareas
```

Consulta [Personalización](customization.md) para detalles completos sobre cómo crear y usar esquemas personalizados.

## Archivo

Archivar completa un cambio fusionando sus especificaciones delta en las especificaciones principales y preservando el cambio para el historial.

### Qué Ocurre Cuando Archivas

```
Antes del archivo:

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


Después del archivo:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Ahora incluye los requerimientos de 2FA
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

### El Proceso de Archivo

1. **Fusionar deltas.** Cada sección de especificación delta (AÑADIDO/MODIFICADO/ELIMINADO) se aplica a la especificación principal correspondiente.

2. **Mover al archivo.** La carpeta del cambio se mueve a `changes/archive/` con un prefijo de fecha para orden cronológico.

3. **Preservar el contexto.** Todos los artefactos permanecen intactos en el archivo. Siempre puedes revisar para entender por qué se hizo un cambio.

### Por Qué Importa Archivar

**Estado limpio.** Los cambios activos (`changes/`) muestran solo el trabajo en progreso. El trabajo completado se aparta.

**Rastro de auditoría.** El archivo preserva el contexto completo de cada cambio — no solo qué cambió, sino la propuesta que explica por qué, el diseño que explica cómo, y las tareas que muestran el trabajo realizado.

**Evolución de especificaciones.** Las especificaciones crecen orgánicamente a medida que se archivan los cambios. Cada archivo fusiona sus deltas, construyendo una especificación completa a lo largo del tiempo.

## Cómo Todo Se Encaja

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO OPENSPEC                                  │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. INICIAR    │  /opsx:propose (core) o /opsx:new (expandido)           │
│   │     CAMBIO     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREAR      │  /opsx:ff o /opsx:continue (flujo expandido)            │
│   │     ARTEFACTOS │  Crea proposal → specs → design → tasks                 │
│   │                │  (basado en dependencias del esquema)                    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENTAR│  /opsx:apply                                            │
│   │     TAREAS     │  Trabaja en las tareas, marcándolas                     │
│   │                │◄──── Actualiza artefactos a medida que aprendes         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICAR  │  /opsx:verify (opcional)                                │
│   │     TRABAJO    │  Verificar que la implementación coincide con specs     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVAR   │────►│  Las especificaciones delta se fusionan      │    │
│   │     CAMBIO     │     │  en las especificaciones principales         │    │
│   └────────────────┘     │  La carpeta del cambio se mueve a archive/  │    │
│                          │  Las specs ahora son la fuente actualizada  │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**El ciclo virtuoso:**

1. Las especificaciones describen el comportamiento actual
2. Los cambios proponen modificaciones (como deltas)
3. La implementación hace que los cambios sean reales
4. El archivo fusiona los deltas en las especificaciones
5. Las especificaciones ahora describen el nuevo comportamiento
6. El siguiente cambio se basa en las especificaciones actualizadas

## Glosario

| Término | Definición |
|---------|------------|
| **Artifact** | Un documento dentro de un cambio (propuesta, diseño, tareas o especificaciones delta) |
| **Archive** | El proceso de completar un cambio y fusionar sus deltas en las especificaciones principales |
| **Change** | Una modificación propuesta al sistema, empaquetada como una carpeta con artifacts |
| **Delta spec** | Una especificación que describe cambios (AÑADIDO/MODIFICADO/ELIMINADO) en relación con las especificaciones actuales |
| **Domain** | Una agrupación lógica para las especificaciones (por ejemplo, `auth/`, `payments/`) |
| **Requirement** | Un comportamiento específico que el sistema debe tener |
| **Scenario** | Un ejemplo concreto de un requirement, típicamente en formato Dado/Cuando/Entonces |
| **Schema** | Una definición de los tipos de artifacts y sus dependencias |
| **Spec** | Una especificación que describe el comportamiento del sistema, que contiene requirements y scenarios |
| **Source of truth** | El directorio `openspec/specs/`, que contiene el comportamiento acordado actual |

## Próximos pasos

- [Primeros pasos](getting-started.md) - Pasos prácticos iniciales
- [Flujos de trabajo](workflows.md) - Patrones comunes y cuándo usar cada uno
- [Comandos](commands.md) - Referencia completa de comandos
- [Personalización](customization.md) - Crear schemas personalizados y configurar tu proyecto