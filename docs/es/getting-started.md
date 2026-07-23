# Primeros pasos

Esta guía explica cómo funciona OpenSpec después de que lo hayas instalado e inicializado. Para ver las instrucciones de instalación, consulta el [README principal](../index.md#quick-start) o la [Guía de instalación](installation.md). ¿Eres nuevo en todo el conjunto de documentación? La [página de inicio de la documentación](index.md) te muestra un mapa de todo el contenido.

> **¿Dónde escribo estos comandos?** Hay dos lugares, y confundirlos es el error más común al empezar.
>
> - Los comandos `openspec ...` (como `openspec init`) se ejecutan en tu **terminal**.
> - Los comandos `/opsx:...` (como `/opsx:propose`) se ejecutan en el **chat de tu asistente de IA**, el mismo espacio donde le pedirías que escriba código.
>
> No hay un "modo interactivo" independiente que iniciar. Solo tienes que escribir el comando de barra en el chat y tu asistente se encargará del resto. Explicación completa: [Cómo funcionan los comandos](how-commands-work.md).

## Tus primeros cinco minutos

El ciclo completo, con cada paso etiquetado según el lugar donde se realiza:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (opcional: reflexiona sobre la idea primero)
AI CHAT      /opsx:propose add-dark-mode      (la IA redacta el plan; tú lo revisas)
AI CHAT      /opsx:apply                      (la IA lo construye)
AI CHAT      /opsx:archive                    (especificaciones actualizadas, cambio archivado)
```

Dos pasos en la terminal para configurar todo, y después trabajarás directamente en el chat. El resto de esta guía explica en detalle qué hace cada paso y qué verás en cada uno.

> **¿Todavía no sabes qué construir? Empieza por `/opsx:explore`.** Es un compañero de reflexión sin riesgos que lee tu base de código, evalúa opciones y convierte una idea difusa en un plan concreto, todo antes de que exista cualquier artefacto o código. Cuando la imagen está clara, pasa el relevo a `/opsx:propose`. Este es el mejor hábito que puedes adoptar para trabajar con una IA que de otro modo construiría el producto equivocado con total seguridad. Consulta la [Guía de exploración](explore.md).

## Cómo funciona

OpenSpec te ayuda a ti y a tu asistente de codificación con IA a poneros de acuerdo sobre qué construir antes de escribir cualquier código.

**Ruta rápida predeterminada (perfil core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (opcional)
```

Empieza por `/opsx:explore` cuando estés definiendo qué hacer, o ve directamente a `/opsx:propose` cuando ya lo tengas claro. Explore está incluido en el perfil predeterminado, así que siempre estará disponible cuando lo necesites.

**Ruta ampliada (selección de flujo de trabajo personalizado):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

El perfil global predeterminado es `core`, que incluye los comandos `propose`, `explore`, `apply`, `sync` y `archive`. Puedes habilitar los comandos de flujo de trabajo ampliado con `openspec config profile` y después `openspec update`.

## Lo que crea OpenSpec

Después de ejecutar `openspec init`, tu proyecto tendrá la siguiente estructura:

```
openspec/
├── specs/              # Fuente de verdad (comportamiento de tu sistema)
│   └── <domain>/
│       └── spec.md
├── changes/            # Actualizaciones propuestas (una carpeta por cambio)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Especificaciones delta (lo que se está modificando)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Configuración del proyecto (opcional)
```

**Dos directorios clave:**

- **`specs/`** - La fuente de verdad. Estas especificaciones describen cómo se comporta tu sistema actualmente. Están organizadas por dominio (por ejemplo, `specs/auth/`, `specs/payments/`).
- **`changes/`** - Modificaciones propuestas. Cada cambio tiene su propia carpeta con todos los artefactos relacionados. Cuando un cambio está terminado, sus especificaciones se fusionan en el directorio principal `specs/`.

## Comprensión de los artefactos

Cada carpeta de cambio contiene artefactos que guían el trabajo:

| Artefacto | Propósito |
|----------|---------|
| `proposal.md` | El "por qué" y el "qué": captura la intención, el alcance y el enfoque |
| `specs/` | Especificaciones delta que muestran requisitos ADDED/MODIFIED/REMOVED |
| `design.md` | El "cómo": enfoque técnico y decisiones de arquitectura |
| `tasks.md` | Lista de verificación de implementación con casillas de verificación |

**Los artefactos se construyen uno sobre otro:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            actualiza a medida que aprendes
```

Siempre puedes volver atrás y refinar los artefactos anteriores a medida que aprendes más durante la implementación.

## Cómo funcionan las especificaciones delta

Las especificaciones delta son el concepto clave de OpenSpec. Muestran lo que se está modificando en relación con tus especificaciones actuales.

### El formato

Las especificaciones delta usan secciones para indicar el tipo de cambio:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### Qué sucede al archivar

Cuando archivas un cambio:

1. Los requisitos **ADDED** se añaden al final de la especificación principal
2. Los requisitos **MODIFIED** reemplazan la versión existente
3. Los requisitos **REMOVED** se eliminan de la especificación principal

La carpeta del cambio se mueve a `openspec/changes/archive/` para llevar el historial de auditoría.

## Ejemplo: Tu primer cambio

Vamos a recorrer el proceso de añadir el modo oscuro a una aplicación.

### 1. Iniciar el cambio (predeterminado)

```text
Tú: /opsx:propose add-dark-mode

IA:  Creado openspec/changes/add-dark-mode/
     ✓ proposal.md — por qué lo estamos haciendo, qué está cambiando
     ✓ specs/       — requisitos y escenarios
     ✓ design.md    — enfoque técnico
     ✓ tasks.md     — lista de verificación de implementación
     ¡Listo para implementar!
```

Si has habilitado el perfil de flujo de trabajo ampliado, también puedes hacer esto en dos pasos: primero `/opsx:new` y después `/opsx:ff` (o `/opsx:continue` de forma incremental).

### 2. Lo que se crea

**proposal.md** - Captura la intención:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - Delta que muestra los nuevos requisitos:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - Lista de verificación de implementación:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. Implementación

```text
Tú: /opsx:apply

IA:  Trabajando en las tareas...
     ✓ 1.1 Creado ThemeContext con estado claro/oscuro
     ✓ 1.2 Añadidas propiedades personalizadas de CSS a globals.css
     ✓ 1.3 Implementada la persistencia en localStorage
     ✓ 2.1 Creado el componente ThemeToggle
     ...
     ¡Todas las tareas completadas!
```

Durante la implementación, si detectas que el diseño necesita ajustes, solo tienes que actualizar el artefacto y continuar.

### 4. Archivar

```text
Tú: /opsx:archive

IA:  Archivando add-dark-mode...
     ✓ Especificaciones fusionadas en openspec/specs/ui/spec.md
     ✓ Movido a openspec/changes/archive/2025-01-24-add-dark-mode/
     ¡Listo! Preparado para la siguiente funcionalidad.
```

Tus especificaciones delta ahora forman parte de las especificaciones principales, documentando cómo funciona tu sistema.

## Verificación y revisión

Usa la CLI para consultar el estado de tus cambios:

```bash
# Listar cambios activos
openspec list

# Ver detalles del cambio
openspec show add-dark-mode

# Validar el formato de las especificaciones
openspec validate add-dark-mode

# Panel interactivo
openspec view
```

## Próximos pasos

- [Explora primero](explore.md) - Usa `/opsx:explore` para reflexionar sobre una idea antes de comprometerte con ella
- [Revisar un cambio](reviewing-changes.md) - Qué revisar en el plan que redacta la IA, antes de escribir cualquier código
- [Escribir buenas especificaciones](writing-specs.md) - Cómo son un requisito y un escenario sólidos
- [Usar OpenSpec en un proyecto existente](existing-projects.md) - Empieza a trabajar en una base de código legada de gran tamaño
- [Editar e iterar sobre un cambio](editing-changes.md) - Actualiza artefactos, vuelve atrás, reconcilia ediciones manuales
- [Conceptos básicos de un vistazo](overview.md) - Todo el modelo mental en una sola página
- [Ejemplos y recetas](examples.md) - Cambios reales, de principio a fin
- [Flujos de trabajo](workflows.md) - Patrones comunes y cuándo usar cada comando
- [Comandos](commands.md) - Referencia completa de todos los comandos de barra
- [Conceptos](concepts.md) - Comprensión más profunda de las especificaciones, los cambios y los esquemas
- [Personalización](customization.md) - Adapta OpenSpec a tu forma de trabajar
- [Almacenes](stores-beta/user-guide.md) - ¿La planificación abarca varios repositorios o equipos? Guárdala en su propio repositorio (beta)
- [Preguntas frecuentes](faq.md) y [Solución de problemas](troubleshooting.md) - Cuando te quedes atascado