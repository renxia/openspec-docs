# Personalización

OpenSpec ofrece tres niveles de personalización:

| Nivel | Función | Ideal para |
|-------|---------|------------|
| **Configuración del Proyecto** | Establecer valores predeterminados, inyectar contexto/reglas | La mayoría de los equipos |
| **Esquemas Personalizados** | Definir sus propios artefactos de flujo de trabajo | Equipos con procesos únicos |
| **Anulaciones Globales** | Compartir esquemas en todos los proyectos | Usuarios avanzados |

---

## Configuración del Proyecto

El archivo `openspec/config.yaml` es la forma más fácil de personalizar OpenSpec para su equipo. Le permite:

- **Establecer un esquema predeterminado** - Omitir `--schema` en cada comando
- **Inyectar contexto del proyecto** - La IA ve su pila tecnológica, convenciones, etc.
- **Agregar reglas por artefacto** - Reglas personalizadas para artefactos específicos

### Configuración Rápida

```bash
openspec init
```

Esto le guiará para crear una configuración de forma interactiva. O cree una manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
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

Al generar cualquier artefacto, su contexto y reglas se inyectan en el prompt de la IA:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **El contexto** aparece en TODOS los artefactos
- **Las reglas** SOLO aparecen para el artefacto correspondiente

### Orden de Resolución de Esquemas

Cuando OpenSpec necesita un esquema, verifica en este orden:

1. Bandera de CLI: `--schema <nombre>`
2. Metadatos del cambio (`.openspec.yaml` en la carpeta del cambio)
3. Configuración del proyecto (`openspec/config.yaml`)
4. Predeterminado (`spec-driven`)

---

## Esquemas Personalizados

Cuando la configuración del proyecto no es suficiente, cree su propio esquema con un flujo de trabajo completamente personalizado. Los esquemas personalizados se encuentran en el directorio `openspec/schemas/` de su proyecto y se controlan con el código fuente.

```text
su-proyecto/
├── openspec/
│   ├── config.yaml        # Configuración del proyecto
│   ├── schemas/           # Los esquemas personalizados van aquí
│   │   └── mi-flujo/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Sus cambios
└── src/
```

### Bifurcar un Esquema Existente

La forma más rápida de personalizar es bifurcar un esquema incorporado:

```bash
openspec schema fork spec-driven mi-flujo
```

Esto copia el esquema completo `spec-driven` a `openspec/schemas/mi-flujo/` donde puede editarlo libremente.

**Lo que obtiene:**

```text
openspec/schemas/mi-flujo/
├── schema.yaml           # Definición del flujo de trabajo
└── templates/
    ├── proposal.md       # Plantilla para el artefacto de propuesta
    ├── spec.md           # Plantilla para especificaciones
    ├── design.md         # Plantilla para diseño
    └── tasks.md          # Plantilla para tareas
```

Ahora edite `schema.yaml` para cambiar el flujo de trabajo, o edite las plantillas para cambiar lo que la IA genera.

### Crear un Esquema desde Cero

Para un flujo de trabajo completamente nuevo:

```bash
# Interactivo
openspec schema init research-first

# No interactivo
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Estructura del Esquema

Un esquema define los artefactos en su flujo de trabajo y cómo dependen unos de otros:

```yaml
# openspec/schemas/mi-flujo/schema.yaml
name: mi-flujo
version: 1
description: Flujo de trabajo personalizado de mi equipo

artifacts:
  - id: proposal
    generates: proposal.md
    description: Documento de propuesta inicial
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Diseño técnico
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
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
| `id` | Identificador único, usado en comandos y reglas |
| `generates` | Nombre del archivo de salida (admite glob como `specs/**/*.md`) |
| `template` | Archivo de plantilla en el directorio `templates/` |
| `instruction` | Instrucciones de IA para crear este artefacto |
| `requires` | Dependencias - qué artefactos deben existir primero |

### Plantillas

Las plantillas son archivos markdown que guían a la IA. Se inyectan en el prompt al crear ese artefacto.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Las plantillas pueden incluir:
- Encabezados de sección que la IA debe completar
- Comentarios HTML con guías para la IA
- Formatos de ejemplo que muestran la estructura esperada

### Validar su Esquema

Antes de usar un esquema personalizado, valídelo:

```bash
openspec schema validate mi-flujo
```

Esto verifica:
- La sintaxis de `schema.yaml` es correcta
- Todas las plantillas referenciadas existen
- No hay dependencias circulares
- Los IDs de los artefactos son válidos

### Usar su Esquema Personalizado

Una vez creado, use su esquema con:

```bash
# Especificar en el comando
openspec new change feature --schema mi-flujo

# O establecer como predeterminado en config.yaml
schema: mi-flujo
```

### Depurar la Resolución de Esquemas

¿No está seguro de qué esquema se está usando? Verifique con:

```bash
# Ver de dónde se resuelve un esquema específico
openspec schema which mi-flujo

# Listar todos los esquemas disponibles
openspec schema which --all
```

La salida muestra si proviene de su proyecto, directorio de usuario o del paquete:

```text
Schema: mi-flujo
Source: project
Path: /path/to/project/openspec/schemas/mi-flujo
```

---

> **Nota:** OpenSpec también soporta esquemas a nivel de usuario en `~/.local/share/openspec/schemas/` para compartir entre proyectos, pero se recomiendan los esquemas a nivel de proyecto en `openspec/schemas/` ya que se controlan con el código fuente.

---

## Ejemplos

### Flujo de Trabajo de Iteración Rápida

Un flujo de trabajo mínimo para iteraciones rápidas:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Agregar un Artefacto de Revisión

Bifurque el predeterminado y agregue un paso de revisión:

```bash
openspec schema fork spec-driven with-review
```

Luego edite `schema.yaml` para agregar:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... configuración existente de tasks ...
    requires:
      - specs
      - design
      - review    # Ahora las tareas también requieren revisión
```

---

## Ver También

- [Referencia de CLI: Comandos de Esquema](cli.md#schema-commands) - Documentación completa de comandos