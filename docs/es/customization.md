# Personalización

OpenSpec proporciona tres niveles de personalización:

| Nivel | Qué hace | Mejor para |
|-------|----------|------------|
| **Configuración del Proyecto** | Establecer valores predeterminados, inyectar contexto/reglas | La mayoría de los equipos |
| **Esquemas Personalizados** | Definir tus propios artefactos de flujo de trabajo | Equipos con procesos únicos |
| **Anulaciones Globales** | Compartir esquemas en todos los proyectos | Usuarios avanzados |

---

## Configuración del Proyecto

El archivo `openspec/config.yaml` es la forma más sencilla de personalizar OpenSpec para tu equipo. Te permite:

- **Establecer un esquema predeterminado** - Omitir `--schema` en cada comando
- **Inyectar contexto del proyecto** - La IA ve tu stack tecnológico, convenciones, etc.
- **Agregar reglas por artefacto** - Reglas personalizadas para artefactos específicos

### Configuración Rápida

```bash
openspec init
```

Esto te guía para crear una configuración de forma interactiva. O crea una manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Stack tecnológico: TypeScript, React, Node.js, PostgreSQL
  Estilo de API: RESTful, documentado en docs/api.md
  Pruebas: Jest + React Testing Library
  Valoramos la compatibilidad con versiones anteriores para todas las APIs públicas

rules:
  proposal:
    - Incluir plan de reversión
    - Identificar equipos afectados
  specs:
    - Usar formato Dado/Cuando/Entonces
    - Referenciar patrones existentes antes de inventar nuevos
```

### Cómo Funciona

**Esquema predeterminado:**

```bash
# Sin configuración
openspec new change my-feature --schema spec-driven

# Con configuración - el esquema es automático
openspec new change my-feature
```

**Inyección de contexto y reglas:**

Al generar cualquier artefacto, tu contexto y reglas se inyectan en el prompt de la IA:

```xml
<context>
Stack tecnológico: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Incluir plan de reversión
- Identificar equipos afectados
</rules>

<template>
[Plantilla integrada del esquema]
</template>
```

- **Contexto** aparece en TODOS los artefactos
- **Reglas** aparecen SOLO para el artefacto correspondiente

### Orden de Resolución de Esquemas

Cuando OpenSpec necesita un esquema, lo verifica en este orden:

1. Bandera CLI: `--schema <name>`
2. Metadatos del cambio (`.openspec.yaml` en la carpeta del cambio)
3. Configuración del proyecto (`openspec/config.yaml`)
4. Predeterminado (`spec-driven`)

---

## Esquemas Personalizados

Cuando la configuración del proyecto no es suficiente, crea tu propio esquema con un flujo de trabajo completamente personalizado. Los esquemas personalizados residen en el directorio `openspec/schemas/` de tu proyecto y están controlados por versiones junto con tu código.

```text
tu-proyecto/
├── openspec/
│   ├── config.yaml        # Configuración del proyecto
│   ├── schemas/           # Los esquemas personalizados residen aquí
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Tus cambios
└── src/
```

### Bifurcar un Esquema Existente

La forma más rápida de personalizar es bifurcar un esquema integrado:

```bash
openspec schema fork spec-driven my-workflow
```

Esto copia todo el esquema `spec-driven` a `openspec/schemas/my-workflow/` donde puedes editarlo libremente.

**Lo que obtienes:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Definición del flujo de trabajo
└── templates/
    ├── proposal.md       # Plantilla para el artefacto de propuesta
    ├── spec.md           # Plantilla para especificaciones
    ├── design.md         # Plantilla para diseño
    └── tasks.md          # Plantilla para tareas
```

Ahora edita `schema.yaml` para cambiar el flujo de trabajo, o edita las plantillas para cambiar lo que genera la IA.

### Crear un Esquema desde Cero

Para un flujo de trabajo completamente nuevo:

```bash
# Interactivo
openspec schema init research-first

# No interactivo
openspec schema init rapid \
  --description "Flujo de trabajo de iteración rápida" \
  --artifacts "proposal,tasks" \
  --default
```

### Estructura del Esquema

Un esquema define los artefactos en tu flujo de trabajo y cómo dependen entre sí:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: Flujo de trabajo personalizado de mi equipo

artifacts:
  - id: proposal
    generates: proposal.md
    description: Documento de propuesta inicial
    template: proposal.md
    instruction: |
      Crea una propuesta que explique POR QUÉ se necesita este cambio.
      Enfócate en el problema, no en la solución.
    requires: []

  - id: design
    generates: design.md
    description: Diseño técnico
    template: design.md
    instruction: |
      Crea un documento de diseño que explique CÓMO implementar.
    requires:
      - proposal    # No se puede crear el diseño hasta que exista la propuesta

  - id: tasks
    generates: tasks.md
    description: Lista de verificación de implementación
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Campos clave:**

| Campo | Propósito |
|-------|-----------|
| `id` | Identificador único, utilizado en comandos y reglas |
| `generates` | Nombre de archivo de salida (admite patrones glob como `specs/**/*.md`) |
| `template` | Archivo de plantilla en el directorio `templates/` |
| `instruction` | Instrucciones para la IA para crear este artefacto |
| `requires` | Dependencias - qué artefactos deben existir primero |

### Plantillas

Las plantillas son archivos markdown que guían a la IA. Se inyectan en el prompt al crear ese artefacto.

```markdown
<!-- templates/proposal.md -->
## Por qué

<!-- Explica la motivación para este cambio. ¿Qué problema resuelve? -->

## Qué Cambia

<!-- Describe qué cambiará. Sé específico sobre nuevas capacidades o modificaciones. -->

## Impacto

<!-- Código afectado, APIs, dependencias, sistemas -->
```

Las plantillas pueden incluir:
- Encabezados de sección que la IA debe completar
- Comentarios HTML con orientación para la IA
- Formatos de ejemplo que muestran la estructura esperada

### Validar tu Esquema

Antes de usar un esquema personalizado, valídalo:

```bash
openspec schema validate my-workflow
```

Esto verifica:
- La sintaxis de `schema.yaml` es correcta
- Todas las plantillas referenciadas existen
- No hay dependencias circulares
- Los IDs de artefactos son válidos

### Usar tu Esquema Personalizado

Una vez creado, usa tu esquema con:

```bash
# Especificar en el comando
openspec new change feature --schema my-workflow

# O establecer como predeterminado en config.yaml
schema: my-workflow
```

### Depurar la Resolución de Esquemas

¿No estás seguro de qué esquema se está usando? Verifica con:

```bash
# Ver desde dónde se resuelve un esquema específico
openspec schema which my-workflow

# Listar todos los esquemas disponibles
openspec schema which --all
```

La salida muestra si proviene de tu proyecto, directorio de usuario o del paquete:

```text
Esquema: my-workflow
Fuente: proyecto
Ruta: /path/to/project/openspec/schemas/my-workflow
```

---

> **Nota:** OpenSpec también admite esquemas a nivel de usuario en `~/.local/share/openspec/schemas/` para compartir entre proyectos, pero se recomiendan los esquemas a nivel de proyecto en `openspec/schemas/` ya que están controlados por versiones junto con tu código.

---

## Ejemplos

### Flujo de Trabajo de Iteración Rápida

Un flujo de trabajo mínimo para iteraciones rápidas:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Iteración rápida con sobrecarga mínima

artifacts:
  - id: proposal
    generates: proposal.md
    description: Propuesta rápida
    template: proposal.md
    instruction: |
      Crea una propuesta breve para este cambio.
      Enfócate en qué y por qué, omite especificaciones detalladas.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Lista de verificación de implementación
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Agregar un Artefacto de Revisión

Bifurca el predeterminado y agrega un paso de revisión:

```bash
openspec schema fork spec-driven with-review
```

Luego edita `schema.yaml` para agregar:

```yaml
  - id: review
    generates: review.md
    description: Lista de verificación de revisión pre-implementación
    template: review.md
    instruction: |
      Crea una lista de verificación de revisión basada en el diseño.
      Incluye consideraciones de seguridad, rendimiento y pruebas.
    requires:
      - design

  - id: tasks
    # ... configuración existente de tareas ...
    requires:
      - specs
      - design
      - review    # Ahora las tareas también requieren revisión
```

---

## Esquemas de la Comunidad

OpenSpec también admite esquemas mantenidos por la comunidad distribuidos a través de repositorios independientes. Estos proporcionan flujos de trabajo con opiniones formadas que integran OpenSpec con otras herramientas o sistemas, de manera similar a como funciona el [catálogo de extensiones comunitarias de github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) para spec-kit.

Los esquemas de la comunidad no se incluyen en el núcleo de OpenSpec — residen en sus propios repositorios con su propio ciclo de lanzamiento. Para usar uno, copia el paquete de esquema en el directorio `openspec/schemas/<schema-name>/` de tu proyecto (el README de cada repositorio tiene instrucciones de instalación).

| Esquema | Mantenedor | Repositorio | Descripción |
|--------|-----------|------------|-------------|
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integra la gobernanza de artefactos de OpenSpec con las habilidades de ejecución de [obra/superpowers](https://github.com/obra/superpowers) (lluvia de ideas, writing-plans, TDD mediante subagentes, revisión de código, finalización). Agrega un artefacto `retrospective` centrado en evidencia que cubre un vacío que Superpowers no cubre de forma nativa. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Flujo de trabajo primero para PM. Ejecuta el pipeline de planificación de [nanopm](https://github.com/nmrtn/nanopm) (auditoría → estrategia → hoja de ruta → PRD) antes de la implementación. Conecta la planificación de productos con el flujo de trabajo de ingeniería impulsado por especificaciones de OpenSpec. Los artefactos se leen desde `.nanopm/` si está presente — la propuesta toma la auditoría, el diseño toma la estrategia y las tareas toman el desglose del PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Runbooks de pruebas de extremo a extremo a nivel de capacidad. Cada capacidad obtiene una especificación inmutable, una plantilla de tareas inmutable y un registro de ejecución con marca de tiempo por ejecución. Las aserciones son solo comportamiento observable (estado HTTP, cuerpo de respuesta, estado persistido — nunca subcadenas de registro); cada ejecución registra UTC de inicio/fin, duración y consumo estimado de tokens LLM. |

> ¿Quieres contribuir un esquema de la comunidad? Abre un issue con un enlace a tu repositorio, o envía un PR agregando una fila a esta tabla.

---

## Ver También

- [Referencia de CLI: Comandos de Esquema](cli.md#schema-commands) - Documentación completa de comandos