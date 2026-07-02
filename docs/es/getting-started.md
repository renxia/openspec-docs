# Primeros Pasos

Esta guía explica cómo funciona OpenSpec después de que lo has instalado e inicializado. Para instrucciones de instalación, consulta el [README principal](../index.md#quick-start) o la [guía de instalación](installation.md). ¿Eres nuevo en todo el conjunto de documentos? La [página de inicio de la documentación](index.md) lo resume todo.

> **¿Dónde escribo estos comandos?** En dos lugares, y confundirlos es el error inicial más común.
>
> - Los comandos `openspec ...` (como `openspec init`) se ejecutan en tu **terminal**.
> - Los comandos `/opsx:...` (como `/opsx:propose`) se ejecutan en el **chat de tu asistente de IA**, la misma caja donde le pedirías que escribiera código.
>
> No hay un "modo interactivo" separado para empezar. Simplemente escribes el comando con barra en el chat y tu asistente continúa a partir de ahí. Explicación completa: [Cómo funcionan los comandos](how-commands-work.md).

## Tus Primeros Cinco Minutos

Todo el ciclo, etiquetado por dónde ocurre cada paso:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (opcional: piénsalo primero)
AI CHAT      /opsx:propose add-dark-mode      (la IA redacta el plan; tú lo revisas)
AI CHAT      /opsx:apply                      (la IA lo construye)
AI CHAT      /opsx:archive                    (las especificaciones se actualizan, el cambio se archiva)
```

Dos pasos en la terminal para configurar, y luego trabajas en el chat. El resto de esta guía desglosa qué hace cada paso y qué verás.

> **¿No estás seguro de qué construir todavía? Empieza con `/opsx:explore`.** Es un compañero de pensamiento sin riesgos que lee tu base de código, sopesa opciones y convierte una idea vaga en un plan concreto, todo antes de que exista cualquier artefacto o código. Cuando la imagen está clara, pasa a `/opsx:propose`. Este es el hábito más importante para trabajar con una IA que de otro modo construiría incorrectamente con confianza. Consulta la [guía Explore](explore.md).

## Cómo Funciona

OpenSpec te ayuda a ti y a tu asistente de codificación de IA a acordar qué construir antes de escribir cualquier código.

**Ruta rápida por defecto (perfil core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (opcional)
```

Comienza con `/opsx:explore` cuando estás descifrando qué hacer, o salta directamente a `/opsx:propose` cuando ya lo sabes. Explore está en el perfil predeterminado, por lo que siempre está disponible cuando lo necesitas.

**Ruta expandida (selección de flujo de trabajo personalizado):**

```text
/opsx:new ──► /opsx:ff o /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

El perfil global predeterminado es `core`, que incluye `propose`, `explore`, `apply`, `sync` y `archive`. Puedes habilitar los comandos de flujo de trabajo expandido con `openspec config profile` y luego `openspec update`.

## Qué Crea OpenSpec

Después de ejecutar `openspec init`, tu proyecto tiene esta estructura:

```
openspec/
├── specs/              # Fuente de la verdad (el comportamiento de tu sistema)
│   └── <dominio>/
│       └── spec.md
├── changes/            # Actualizaciones propuestas (una carpeta por cambio)
│   └── <nombre-del-cambio>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Especificaciones delta (lo que está cambiando)
│           └── <dominio>/
│               └── spec.md
└── config.yaml         # Configuración del proyecto (opcional)
```

**Dos directorios clave:**

- **`specs/`** - La fuente de la verdad. Estas especificaciones describen cómo se comporta tu sistema actualmente. Organizadas por dominio (por ejemplo, `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modificaciones propuestas. Cada cambio tiene su propia carpeta con todos los artefactos relacionados. Cuando un cambio está completo, sus especificaciones se fusionan en el directorio principal `specs/`.

## Entendiendo los Artefactos

Cada carpeta de cambio contiene artefactos que guían el trabajo:

| Artefacto | Propósito |
|----------|---------|
| `proposal.md` | El "por qué" y el "qué": captura la intención, el alcance y el enfoque |
| `specs/` | Especificaciones delta que muestran requisitos AÑADIDOS/MODIFICADOS/ELIMINADOS |
| `design.md` | El "cómo": enfoque técnico y decisiones de arquitectura |
| `tasks.md` | Lista de verificación de implementación con casillas de verificación |

**Los artefactos se construyen unos sobre otros:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            actualiza a medida que aprendes
```

Siempre puedes volver y refinar los artefactos anteriores a medida que aprendes más durante la implementación.

## Cómo Funcionan las Especificaciones Delta

Las especificaciones delta son el concepto clave en OpenSpec. Muestran qué está cambiando con respecto a tus especificaciones actuales.

### El Formato

Las especificaciones delta usan secciones para indicar el tipo de cambio:

```markdown
# Delta para Auth

## Requisitos AÑADIDOS

### Requisito: Autenticación de dos factores
El sistema DEBE requerir un segundo factor durante el inicio de sesión.

#### Escenario: OTP requerido
- DADO un usuario con 2FA habilitado
- CUANDO el usuario envía credenciales válidas
- ENTONCES se presenta un desafío OTP

## Requisitos MODIFICADOS

### Requisito: Tiempo de espera de sesión
El sistema DEBE caducar las sesiones después de 30 minutos de inactividad.
(Anteriormente: 60 minutos)

#### Escenario: Tiempo de espera inactivo
- DADO una sesión autenticada
- CUANDO pasan 30 minutos sin actividad
- ENTONCES la sesión se invalida

## Requisitos ELIMINADOS

### Requisito: Recordarme
(Obsoleto en favor de 2FA)
```

### Qué Sucede al Archivar

Cuando archivas un cambio:

1. Los requisitos **AÑADIDOS** se adjuntan a la especificación principal
2. Los requisitos **MODIFICADOS** reemplazan la versión existente
3. Los requisitos **ELIMINADOS** se eliminan de la especificación principal

La carpeta del cambio se mueve a `openspec/changes/archive/` para el historial de auditoría.

## Ejemplo: Tu Primer Cambio

Vamos a ver cómo añadir el modo oscuro a una aplicación.

### 1. Iniciar el Cambio (Predeterminado)

```text
Tú: /opsx:propose add-dark-mode

IA:  Creado openspec/changes/add-dark-mode/
     ✓ proposal.md — por qué lo estamos haciendo, qué está cambiando
     ✓ specs/       — requisitos y escenarios
     ✓ design.md    — enfoque técnico
     ✓ tasks.md     — lista de verificación de implementación
     ¡Listo para la implementación!
```

Si has habilitado el perfil de flujo de trabajo expandido, también puedes hacer esto en dos pasos: `/opsx:new` y luego `/opsx:ff` (o `/opsx:continue` incrementalmente).

### 2. Qué se Crea

**proposal.md** - Captura la intención:

```markdown
# Propuesta: Añadir modo oscuro

## Intención
Los usuarios han solicitado una opción de modo oscuro para reducir la fatiga visual
durante el uso nocturno.

## Alcance
- Añadir interruptor de tema en la configuración
- Soporte para detección de preferencias del sistema
- Persistir la preferencia en localStorage

## Enfoque
Usar propiedades personalizadas de CSS para la tematización con un contexto React
para la gestión del estado.
```

**specs/ui/spec.md** - Delta que muestra nuevos requisitos:

```markdown
# Delta para UI

## Requisitos AÑADIDOS

### Requisito: Selección de tema
El sistema DEBE permitir a los usuarios elegir entre temas claros y oscuros.

#### Escenario: Interruptor manual
- DADO un usuario en cualquier página
- CUANDO el usuario hace clic en el interruptor de tema
- ENTONCES el tema cambia inmediatamente
- Y la preferencia persiste a través de las sesiones

#### Escenario: Preferencia del sistema
- DADO un usuario sin preferencia guardada
- CUANDO se carga la aplicación
- ENTONCES se utiliza el esquema de color preferido por el sistema
```

**tasks.md** - Lista de verificación de implementación:

```markdown
# Tareas

## 1. Infraestructura del Tema
- [ ] 1.1 Crear ThemeContext con estado claro/oscuro
- [ ] 1.2 Añadir propiedades personalizadas de CSS para colores
- [ ] 1.3 Implementar persistencia en localStorage

## 2. Componentes de UI
- [ ] 2.1 Crear componente ThemeToggle
- [ ] 2.2 Añadir el interruptor a la página de configuración
- [ ] 2.3 Actualizar el Encabezado para incluir un interruptor rápido

## 3. Estilizado
- [ ] 3.1 Definir paleta de colores del tema oscuro
- [ ] 3.2 Actualizar componentes para usar variables CSS
```

### 3. Implementar

```
Tú: /opsx:apply

IA:  Trabajando a través de las tareas...
     ✓ 1.1 Creado ThemeContext con estado claro/oscuro
     ✓ 1.2 Añadidas propiedades personalizadas de CSS a globals.css
     ✓ 1.3 Implementada persistencia en localStorage
     ✓ 2.1 Creado componente ThemeToggle
     ...
     ¡Todas las tareas completadas!
```

Durante la implementación, si descubres que el diseño necesita un ajuste, simplemente actualiza el artefacto y continúa.

### 4. Archivar

```
Tú: /opsx:archive

IA:  Archivando add-dark-mode...
     ✓ Fusionados los specs en openspec/specs/ui/spec.md
     ✓ Mover a openspec/changes/archive/2025-01-24-add-dark-mode/
     ¡Hecho! Listo para la siguiente característica.
```

Tus especificaciones delta ahora forman parte de las especificaciones principales, documentando cómo funciona tu sistema.

## Verificación y Revisión

Usa el CLI para verificar tus cambios:

```bash
# Listar cambios activos
openspec list

# Ver detalles del cambio
openspec show add-dark-mode

# Validar formato de la especificación
openspec validate add-dark-mode

# Panel interactivo
openspec view
```

## Próximos Pasos

- [Explorar Primero](explore.md) - Usa `/opsx:explore` para pensar en una idea antes de comprometerte
- [Usar OpenSpec en un Proyecto Existente](existing-projects.md) - Empieza con una base de código grande (brownfield)
- [Editar e Iterar sobre un Cambio](editing-changes.md) - Actualiza artefactos, retrocede, reconcilia ediciones manuales
- [Conceptos Clave de un vistazo](overview.md) - Todo el modelo mental en una página
- [Ejemplos y Recetas](examples.md) - Cambios reales, de principio a fin
- [Flujos de Trabajo](workflows.md) - Patrones comunes y cuándo usar cada comando
- [Comandos](commands.md) - Referencia completa para todos los comandos con barra
- [Conceptos](concepts.md) - Comprensión más profunda de especificaciones, cambios y esquemas
- [Personalización](customization.md) - Haz que OpenSpec funcione a tu manera
- [Almacenes (Stores)](stores-beta/user-guide.md) - ¿Planificación que abarca repositorios o equipos? Mantenla en su propio repositorio (beta)
- [Preguntas Frecuentes (FAQ)](faq.md) y [Solución de Problemas](troubleshooting.md) - Cuando te quedas atascado