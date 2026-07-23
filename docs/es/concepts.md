# Conceptos

Esta guía explica las ideas centrales de OpenSpec y cómo se relacionan entre sí. Para el uso práctico, consulta [Primeros pasos](getting-started.md) y [Flujos de trabajo](workflows.md).

## Filosofía

OpenSpec se construye en torno a cuatro principios:

```
fluido no rígido         — sin puertas de fase, trabaja en lo que tenga sentido
iterativo no en cascada — aprende a medida que construyes, refina a medida que avanzas
sencillo no complejo     — configuración ligera, ceremonial mínimo
brownfield-first        — funciona con bases de código existentes, no solo con proyectos greenfield
```

### Por qué importan estos principios

**Fluido, no rígido.** Los sistemas de especificaciones tradicionales te obligan a seguir fases: primero planificas, luego implementas, y ya está. OpenSpec es más flexible — puedes crear artefactos en el orden que tenga sentido para tu trabajo.

**Iterativo, no en cascada.** Los requisitos cambian. La comprensión se profundiza. Lo que parecía un buen enfoque al principio puede no sostenerse después de ver la base de código. OpenSpec adopta esta realidad.

**Sencillo, no complejo.** Algunos frameworks de especificaciones requieren una configuración extensa, formatos rígidos o procesos pesados. OpenSpec no se interpone en tu camino. Se inicializa en segundos, puedes empezar a trabajar de inmediato y personalizarlo solo si lo necesitas.

**Brownfield-first.** La mayor parte del trabajo de software no consiste en construir desde cero — se trata de modificar sistemas existentes. El enfoque basado en deltas de OpenSpec facilita especificar cambios en el comportamiento existente, no solo describir sistemas nuevos.

## La Visión General

OpenSpec organiza tu trabajo en dos áreas principales:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Fuente de verdad   │◄─────│  Modificaciones propuestas    │   │
│   │  Cómo funciona tu   │ fusion│  Cada cambio = una carpeta    │   │
│   │  sistema actualmente│      │  Contiene artefactos + deltas │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

Las **especificaciones** son la fuente de verdad — describen cómo funciona tu sistema actualmente.

Los **cambios** son modificaciones propuestas — residen en carpetas separadas hasta que estés listo para fusionarlas.

Esta separación es fundamental. Puedes trabajar en múltiples cambios en paralelo sin conflictos. Puedes revisar un cambio antes de que afecte las especificaciones principales. Y cuando archivas un cambio, sus deltas se fusionan limpiamente en la fuente de verdad.

## Especificaciones

Las especificaciones describen el comportamiento de tu sistema usando requisitos estructurados y escenarios.

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
    └── spec.md           # Comportamiento y temas de la interfaz
```

Organiza las especificaciones por dominio — agrupaciones lógicas que tengan sentido para tu sistema. Patrones comunes:

- **Por área de funcionalidad**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto delimitado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato de Especificación

Una especificación contiene requisitos, y cada requisito tiene escenarios:

```markdown
# Especificación de Autenticación

## Propósito
Autenticación y gestión de sesiones para la aplicación.

## Requisitos

### Requisito: Autenticación de Usuario
El sistema DEBERÁ emitir un token JWT tras un inicio de sesión exitoso.

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
- DADO una sesión autenticada
- CUANDO pasan 30 minutos sin actividad
- ENTONCES la sesión se invalida
- Y el usuario debe volver a autenticarse
```

**Elementos clave:**

| Elemento | Propósito |
|---------|-----------|
| `## Propósito` | Descripción de alto nivel del dominio de esta especificación |
| `### Requisito:` | Un comportamiento específico que el sistema debe tener |
| `#### Escenario:` | Un ejemplo concreto del requisito en acción |
| SHALL/MUST/SHOULD | Palabras clave RFC 2119 que indican la fuerza del requisito |

### Por qué Estructurar las Especificaciones de Esta Manera

**Los requisitos son el "qué"** — establecen lo que el sistema debe hacer sin especificar la implementación.

**Los escenarios son el "cuándo"** — proporcionan ejemplos concretos que se pueden verificar. Buenos escenarios:
- Son verificables (podrías escribir una prueba automatizada para ellos)
- Cubren tanto el camino feliz como los casos límite
- Usan el formato estructurado Dado/Cuándo/Entonces o similar

**Palabras clave RFC 2119** (SHALL, MUST, SHOULD, MAY) comunican la intención:
- **MUST/SHALL** — requisito absoluto
- **SHOULD** — recomendado, pero existen excepciones
- **MAY** — opcional

### Qué es una Especificación (y qué no es)

Una especificación es un **contrato de comportamiento**, no un plan de implementación.

Buen contenido para especificaciones:
- Comportamiento observable en el que confían los usuarios o sistemas descendientes
- Entradas, salidas y condiciones de error
- Restricciones externas (seguridad, privacidad, fiabilidad, compatibilidad)
- Escenarios que se pueden probar o validar explícitamente

Evitar en las especificaciones:
- Nombres de clases/funciones internas
- Elecciones de bibliotecas o frameworks
- Detalles de implementación paso a paso
- Planes de ejecución detallados (estos pertenecen a `design.md` o `tasks.md`)

Prueba rápida:
- Si la implementación puede cambiar sin modificar el comportamiento visible externamente, probablemente no pertenece a la especificación.

### Mantenlo Ligero: Rigor Progresivo

OpenSpec tiene como objetivo evitar la burocracia. Usa el nivel más ligero que aún haga que el cambio sea verificable.

**Especificación ligera (predeterminada):**
- Requisitos cortos centrados en el comportamiento
- Alcance y no-objetivos claros
- Algunas comprobaciones de aceptación concretas

**Especificación completa (para mayor riesgo):**
- Cambios entre equipos o entre repositorios
- Cambios de API/contratos, migraciones, preocupaciones de seguridad/privacidad
- Cambios donde la ambigüedad probablemente cause rework costoso

La mayoría de los cambios deberían mantenerse en modo ligero.

### Colaboración Humano + Agente

En muchos equipos, los humanos exploran y los agentes redactan artefactos. El ciclo previsto es:

1. El humano proporciona intención, contexto y restricciones.
2. El agente convierte esto en requisitos centrados en el comportamiento y escenarios.
3. El agente mantiene los detalles de implementación en `design.md` y `tasks.md`, no en `spec.md`.
4. La validación confirma la estructura y claridad antes de la implementación.

Esto mantiene las especificaciones legibles para los humanos y consistentes para los agentes.

## Cambios

Un cambio es una modificación propuesta a tu sistema, empaquetada como una carpeta con todo lo necesario para entenderla e implementarla.

### Estructura de Cambio

```
openspec/changes/add-dark-mode/
├── proposal.md           # Por qué y qué
├── design.md             # Cómo (enfoque técnico)
├── tasks.md              # Lista de verificación de implementación
├── .openspec.yaml        # Metadatos del cambio (opcional): schema, created, skip_specs
└── specs/                # Especificaciones delta
    └── ui/
        └── spec.md       # Qué está cambiando en ui/spec.md
```

Cada cambio es autónomo. Tiene:
- **Artefactos** — documentos que capturan la intención, el diseño y las tareas
- **Especificaciones delta** — especificaciones de lo que se está agregando, modificando o eliminando
- **Metadatos** — configuración opcional para este cambio específico

### Por qué los Cambios son Carpetas

Empaquetar un cambio como una carpeta tiene varios beneficios:

1. **Todo junto.** La propuesta, el diseño, las tareas y las especificaciones viven en un solo lugar. No hay que buscar en diferentes ubicaciones.

2. **Trabajo en paralelo.** Múltiples cambios pueden existir simultáneamente sin conflictos. Trabaja en `add-dark-mode` mientras `fix-auth-bug` también está en progreso.

3. **Historial limpio.** Cuando se archiva, los cambios se mueven a `changes/archive/` con su contexto completo preservado. Puedes mirar hacia atrás y entender no solo qué cambió, sino por qué.

4. **Fácil de revisar.** Una carpeta de cambio es fácil de revisar — ábrela, lee la propuesta, revisa el diseño, ve los deltas de especificaciones.

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
# Propuesta: Agregar Modo Oscuro

## Intención
Los usuarios han solicitado una opción de modo oscuro para reducir la fatiga visual
durante el uso nocturno y coincidir con las preferencias del sistema.

## Alcance
Dentro del alcance:
- Interruptor de tema en configuración
- Detección de preferencia del sistema
- Persistir preferencia en localStorage

Fuera del alcance:
- Temas de color personalizados (trabajo futuro)
- Anulaciones de tema por página

## Enfoque
Usar propiedades personalizadas de CSS para el theming con un contexto de React
para la gestión de estado. Detectar la preferencia del sistema en la primera carga,
permitir anulación manual.
```

**Cuándo actualizar la propuesta:**
- Cambios en el alcance (reducción o expansión)
- Aclaración de la intención (mejor comprensión del problema)
- Cambio fundamental del enfoque

#### Especificaciones (especificaciones delta en `specs/`)

Las especificaciones delta describen **qué está cambiando** en relación con las especificaciones actuales. Ver [Especificaciones Delta](#delta-specs) a continuación.

#### Diseño (`design.md`)

El diseño captura el **enfoque técnico** y las **decisiones de arquitectura**.

````markdown
# Diseño: Agregar Modo Oscuro

## Enfoque Técnico
El estado del tema se gestiona mediante Contexto de React para evitar el prop drilling.
Las propiedades personalizadas de CSS permiten el cambio en tiempo de ejecución sin alternancia de clases.

## Decisiones de Arquitectura

### Decisión: Contexto sobre Redux
Usar Contexto de React para el estado del tema porque:
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
ThemeProvider (contexto)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
Variables CSS (aplicadas a :root)
```

## Cambios en Archivos
- `src/contexts/ThemeContext.tsx` (nuevo)
- `src/components/ThemeToggle.tsx` (nuevo)
- `src/styles/globals.css` (modificado)
````

**Cuándo actualizar el diseño:**
- La implementación revela que el enfoque no funcionará
- Se descubre una solución mejor
- Cambian las dependencias o restricciones

#### Tareas (`tasks.md`)

Las tareas son la **lista de verificación de implementación** — pasos concretos con casillas de verificación.

```markdown
# Tareas

## 1. Infraestructura de Temas
- [ ] 1.1 Crear ThemeContext con estado claro/oscuro
- [ ] 1.2 Agregar propiedades personalizadas de CSS para colores
- [ ] 1.3 Implementar persistencia en localStorage
- [ ] 1.4 Agregar detección de preferencia del sistema

## 2. Componentes de Interfaz
- [ ] 2.1 Crear componente ThemeToggle
- [ ] 2.2 Agregar interruptor a la página de configuración
- [ ] 2.3 Actualizar Header para incluir interruptor rápido

## 3. Estilos
- [ ] 3.1 Definir paleta de colores del tema oscuro
- [ ] 3.2 Actualizar componentes para usar variables CSS
- [ ] 3.3 Probar relaciones de contraste para accesibilidad
```

**Buenas prácticas para tareas:**
- Agrupar tareas relacionadas bajo encabezados
- Usar numeración jerárquica (1.1, 1.2, etc.)
- Mantener las tareas lo suficientemente pequeñas para completarse en una sesión
- Marcar las tareas como completadas a medida que las termines

## Especificaciones Delta

Las especificaciones delta son el concepto clave que hace que OpenSpec funcione para el desarrollo sobre código existente (brownfield). Describen **qué está cambiando** en lugar de volver a escribir toda la especificación.

### El Formato

```markdown
# Delta para Autenticación

## Requisitos AGREGADOS

### Requisito: Autenticación de Dos Factores
El sistema DEBE admitir autenticación de dos factores basada en TOTP.

#### Escenario: Inscripción en 2FA
- DADO un usuario sin 2FA habilitado
- CUANDO el usuario habilita 2FA en configuración
- ENTONCES se muestra un código QR para la configuración de la aplicación autenticadora
- Y el usuario debe verificar con un código antes de la activación

#### Escenario: Inicio de sesión con 2FA
- DADO un usuario con 2FA habilitado
- CUANDO el usuario envía credenciales válidas
- ENTONCES se presenta un desafío OTP
- Y el inicio de sesión se completa solo después de un OTP válido

## Requisitos MODIFICADOS

### Requisito: Expiración de Sesión
El sistema DEBE expirar las sesiones después de 15 minutos de inactividad.
(Anteriormente: 30 minutos)

#### Escenario: Tiempo de espera por inactividad
- DADO una sesión autenticada
- CUANDO pasan 15 minutos sin actividad
- ENTONCES la sesión se invalida

## Requisitos ELIMINADOS

### Requisito: Recordarme
(Obsoleto en favor de 2FA. Los usuarios deben volver a autenticarse en cada sesión.)
```

### Secciones Delta

| Sección | Significado | Qué sucede al archivar |
|---------|-------------|------------------------|
| `## Requisitos AGREGADOS` | Comportamiento nuevo | Se agrega a la especificación principal |
| `## Requisitos MODIFICADOS` | Comportamiento modificado | Reemplaza el requisito existente |
| `## Requisitos ELIMINADOS` | Comportamiento obsoleto | Se elimina de la especificación principal |

### Por qué Deltas en lugar de Especificaciones Completas

**Claridad.** Un delta muestra exactamente qué está cambiando. Leyendo una especificación completa, tendrías que hacer un diff mental contra la versión actual.

**Evitar conflictos.** Dos cambios pueden tocar el mismo archivo de especificación sin entrar en conflicto, siempre que modifiquen requisitos diferentes.

**Eficiencia en la revisión.** Los revisores ven el cambio, no el contexto sin cambios. Centrarse en lo que importa.

**Adecuación para brownfield.** La mayoría del trabajo modifica comportamiento existente. Los deltas hacen que las modificaciones sean de primera clase, no una idea de último momento.

## Esquemas

Los esquemas definen los tipos de artefactos y sus dependencias para un flujo de trabajo.

### Cómo funcionan los esquemas

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
    requires: [proposal]      # Se puede crear en paralelo con las especificaciones

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Necesita tanto especificaciones como diseño primero
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

**Las dependencias son habilitadores, no puertas.** Muestran lo que es posible crear, no lo que debes crear a continuación. Puedes omitir el diseño si no lo necesitas. Puedes crear las especificaciones antes o después del diseño —ambas dependen solo de la propuesta.

### Esquemas integrados

**spec-driven** (predeterminado)

El flujo de trabajo estándar para el desarrollo spec-driven:

```
proposal → specs → design → tasks → implement
```

Ideal para: La mayoría del trabajo de características donde quieras acordar las especificaciones antes de la implementación.

### Esquemas personalizados

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
    requires: [research]   # Propuesta informada por la investigación

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Omitir especificaciones/diseño, ir directamente a las tareas
```

Consulta [Personalización](customization.md) para obtener todos los detalles sobre la creación y el uso de esquemas personalizados.

## Archivo

El archivado completa un cambio fusionando sus especificaciones delta en las especificaciones principales y preservando el cambio para el historial.

### Qué sucede cuando archivas

```
Antes del archivado:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ fusión
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

### El proceso de archivado

1. **Fusionar deltas.** Cada sección de especificación delta (AGREGADO/MODIFICADO/ELIMINADO) se aplica a la especificación principal correspondiente.

2. **Mover al archivo.** La carpeta de cambios se mueve a `changes/archive/` con un prefijo de fecha para el orden cronológico.

3. **Preservar el contexto.** Todos los artefactos permanecen intactos en el archivo. Siempre puedes volver atrás para entender por qué se realizó un cambio.

### Por qué el archivado es importante

**Estado limpio.** Los cambios activos (`changes/`) muestran solo el trabajo en progreso. El trabajo completado se aparta.

**Rastro de auditoría.** El archivo preserva el contexto completo de cada cambio —no solo lo que cambió, sino la propuesta que explica por qué, el diseño que explica cómo y las tareas que muestran el trabajo realizado.

**Evolución de especificaciones.** Las especificaciones crecen orgánicamente a medida que se archivan los cambios. Cada archivado fusiona sus deltas, construyendo una especificación completa con el tiempo.

## Cómo encaja todo

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
│   │  2. CREAR      │  /opsx:ff o /opsx:continue (flujo de trabajo            │
│   │     ARTEFACTOS │  expandido)                                              │
│   │                │  Crea propuesta → especificaciones → diseño → tareas    │
│   │                │  (basado en las dependencias del esquema)                │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3.            │  /opsx:apply                                             │
│   │   IMPLEMENTAR  │  Trabaja en las tareas, marcándolas como completadas     │
│   │     TAREAS     │◄──── Actualiza artefactos a medida que aprendes          │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFICAR  │  /opsx:verify (opcional)                                │
│   │     TRABAJO    │  Verifica que la implementación coincida con las         │
│   │                │  especificaciones                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVAR   │────►│  Las especificaciones delta se fusionan en las  │    │
│   │     CAMBIO     │     │  especificaciones principales                 │    │
│   └────────────────┘     │  La carpeta de cambios se mueve a archive/     │    │
│                          │  Las especificaciones son ahora la fuente de    │    │
│                          │  verdad actualizada                            │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**El ciclo virtuoso:**

1. Las especificaciones describen el comportamiento actual
2. Los cambios proponen modificaciones (como deltas)
3. La implementación hace realidad los cambios
4. El archivado fusiona los deltas en las especificaciones
5. Las especificaciones ahora describen el nuevo comportamiento
6. El siguiente cambio se construye sobre las especificaciones actualizadas

## Glosario

| Término | Definición |
|---------|------------|
| **Artefacto** | Un documento dentro de un cambio (propuesta, diseño, tareas o especificaciones delta) |
| **Archivado** | El proceso de completar un cambio y fusionar sus deltas en las especificaciones principales |
| **Cambio** | Una modificación propuesta al sistema, empaquetada como una carpeta con artefactos |
| **Especificación delta** | Una especificación que describe cambios (AGREGADO/MODIFICADO/ELIMINADO) en relación con las especificaciones actuales |
| **Dominio** | Una agrupación lógica para especificaciones (ej., `auth/`, `payments/`) |
| **Requisito** | Un comportamiento específico que el sistema debe tener |
| **Escenario** | Un ejemplo concreto de un requisito, típicamente en formato Dado/Cuando/Entonces |
| **Esquema** | Una definición de tipos de artefactos y sus dependencias |
| **Especificación** | Una especificación que describe el comportamiento del sistema, que contiene requisitos y escenarios |
| **Fuente de verdad** | El directorio `openspec/specs/`, que contiene el comportamiento acordado actualmente |

## Próximos pasos

- [Primeros Pasos](getting-started.md) - Pasos prácticos iniciales
- [Flujos de Trabajo](workflows.md) - Patrones comunes y cuándo usar cada uno
- [Comandos](commands.md) - Referencia completa de comandos
- [Personalización](customization.md) - Crea esquemas personalizados y configura tu proyecto