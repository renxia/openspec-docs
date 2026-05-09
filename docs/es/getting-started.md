# Primeros pasos

Esta guía explica cómo funciona OpenSpec después de haberlo instalado e inicializado. Para instrucciones de instalación, consulte el [README principal](index.md#quick-start).

## Cómo funciona

OpenSpec te ayuda a ti y a tu asistente de codificación con IA a llegar a un acuerdo sobre qué construir antes de escribir cualquier código.

**Ruta rápida predeterminada (perfil core):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Ruta ampliada (selección de flujo de trabajo personalizado):**

```text
/opsx:new ──► /opsx:ff o /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

El perfil global predeterminado es `core`, que incluye `propose`, `explore`, `apply`, `sync` y `archive`. Puedes habilitar los comandos del flujo de trabajo ampliado con `openspec config profile` y luego `openspec update`.

## Qué crea OpenSpec

Después de ejecutar `openspec init`, tu proyecto tendrá esta estructura:

```
openspec/
├── specs/              # Fuente de verdad (el comportamiento de tu sistema)
│   └── <domain>/
│       └── spec.md
├── changes/            # Actualizaciones propuestas (una carpeta por cambio)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Especificaciones delta (qué está cambiando)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Configuración del proyecto (opcional)
```

**Dos directorios clave:**

- **`specs/`** - La fuente de verdad. Estas especificaciones describen cómo se comporta actualmente tu sistema. Organizadas por dominio (por ejemplo, `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modificaciones propuestas. Cada cambio obtiene su propia carpeta con todos los artefactos relacionados. Cuando un cambio se completa, sus especificaciones se fusionan en el directorio principal `specs/`.

## Entendiendo los artefactos

Cada carpeta de cambio contiene artefactos que guían el trabajo:

| Artefacto | Propósito |
|-----------|-----------|
| `proposal.md` | El "por qué" y el "qué" - captura la intención, el alcance y el enfoque |
| `specs/` | Especificaciones delta que muestran requisitos AÑADIDOS/MODIFICADOS/ELIMINADOS |
| `design.md` | El "cómo" - enfoque técnico y decisiones de arquitectura |
| `tasks.md` | Lista de verificación de implementación con casillas |

**Los artefactos se construyen unos sobre otros:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            actualiza a medida que aprendes
```

Siempre puedes volver y refinar los artefactos anteriores a medida que aprendes más durante la implementación.

## Cómo funcionan las especificaciones delta

Las especificaciones delta son el concepto clave en OpenSpec. Muestran qué está cambiando en relación con tus especificaciones actuales.

### El formato

Las especificaciones delta usan secciones para indicar el tipo de cambio:

```markdown
# Delta para Auth

## Requisitos AÑADIDOS

### Requisito: Autenticación de Dos Factores
El sistema DEBE requerir un segundo factor durante el inicio de sesión.

#### Escenario: OTP requerido
- DADO un usuario con 2FA habilitado
- CUANDO el usuario envía credenciales válidas
- ENTONCES se presenta un desafío OTP

## Requisitos MODIFICADOS

### Requisito: Tiempo de Expiración de Sesión
El sistema DEBE expirar las sesiones después de 30 minutos de inactividad.
(Previo: 60 minutos)

#### Escenario: Tiempo de inactividad
- DADO una sesión autenticada
- CUANDO pasan 30 minutos sin actividad
- ENTONCES la sesión se invalida

## Requisitos ELIMINADOS

### Requisito: Recordarme
(Obsoleto en favor de 2FA)
```

### Qué sucede al archivar

Cuando archivas un cambio:

1. Los requisitos **AÑADIDOS** se añaden a la especificación principal
2. Los requisitos **MODIFICADOS** reemplazan la versión existente
3. Los requisitos **ELIMINADOS** se eliminan de la especificación principal

La carpeta del cambio se mueve a `openspec/changes/archive/` para el historial de auditoría.

## Ejemplo: Tu primer cambio

Vamos a recorrer el proceso de agregar modo oscuro a una aplicación.

### 1. Iniciar el cambio (Predeterminado)

```text
Tú: /opsx:propose add-dark-mode

IA:  Creado openspec/changes/add-dark-mode/
     ✓ proposal.md — por qué hacemos esto, qué está cambiando
     ✓ specs/       — requisitos y escenarios
     ✓ design.md    — enfoque técnico
     ✓ tasks.md     — lista de verificación de implementación
     ¡Listo para la implementación!
```

Si has habilitado el perfil de flujo de trabajo ampliado, también puedes hacerlo en dos pasos: `/opsx:new` luego `/opsx:ff` (o `/opsx:continue` incrementalmente).

### 2. Qué se crea

**proposal.md** - Captura la intención:

```markdown
# Propuesta: Agregar Modo Oscuro

## Intención
Los usuarios han solicitado una opción de modo oscuro para reducir la fatiga visual durante el uso nocturno.

## Alcance
- Agregar interruptor de tema en configuración
- Soportar detección de preferencia del sistema
- Persistir preferencia en localStorage

## Enfoque
Usar propiedades CSS personalizadas para theming con un contexto de React para la gestión de estado.
```

**specs/ui/spec.md** - Delta que muestra nuevos requisitos:

```markdown
# Delta para UI

## Requisitos AÑADIDOS

### Requisito: Selección de Tema
El sistema DEBE permitir a los usuarios elegir entre temas claro y oscuro.

#### Escenario: Interruptor manual
- DADO un usuario en cualquier página
- CUANDO el usuario hace clic en el interruptor de tema
- ENTONCES el tema cambia inmediatamente
- Y la preferencia persiste entre sesiones

#### Escenario: Preferencia del sistema
- DADO un usuario sin preferencia guardada
- CUANDO la aplicación carga
- ENTONCES se usa el esquema de color preferido del sistema
```

**tasks.md** - Lista de verificación de implementación:

```markdown
# Tareas

## 1. Infraestructura de Temas
- [ ] 1.1 Crear ThemeContext con estado claro/oscuro
- [ ] 1.2 Agregar propiedades CSS personalizadas para colores
- [ ] 1.3 Implementar persistencia en localStorage

## 2. Componentes de UI
- [ ] 2.1 Crear componente ThemeToggle
- [ ] 2.2 Agregar interruptor a la página de configuración
- [ ] 2.3 Actualizar Header para incluir interruptor rápido

## 3. Estilos
- [ ] 3.1 Definir paleta de colores del tema oscuro
- [ ] 3.2 Actualizar componentes para usar variables CSS
```

### 3. Implementar

```
Tú: /opsx:apply

IA:  Trabajando en las tareas...
     ✓ 1.1 Creado ThemeContext con estado claro/oscuro
     ✓ 1.2 Agregadas propiedades CSS personalizadas a globals.css
     ✓ 1.3 Implementada persistencia en localStorage
     ✓ 2.1 Creado componente ThemeToggle
     ...
     ¡Todas las tareas completadas!
```

Durante la implementación, si descubres que el diseño necesita ajustes, simplemente actualiza el artefacto y continúa.

### 4. Archivar

```
Tú: /opsx:archive

IA:  Archivando add-dark-mode...
     ✓ Especificaciones fusionadas en openspec/specs/ui/spec.md
     ✓ Movido a openspec/changes/archive/2025-01-24-add-dark-mode/
     ¡Listo! Preparado para la siguiente característica.
```

Tus especificaciones delta ahora son parte de las especificaciones principales, documentando cómo funciona tu sistema.

## Verificación y revisión

Usa la CLI para revisar tus cambios:

```bash
# Listar cambios activos
openspec list

# Ver detalles de un cambio
openspec show add-dark-mode

# Validar formato de especificación
openspec validate add-dark-mode

# Panel interactivo
openspec view
```

## Próximos pasos

- [Flujos de trabajo](workflows.md) - Patrones comunes y cuándo usar cada comando
- [Comandos](commands.md) - Referencia completa para todos los comandos slash
- [Conceptos](concepts.md) - Comprensión más profunda de especificaciones, cambios y esquemas
- [Personalización](customization.md) - Haz que OpenSpec funcione a tu manera