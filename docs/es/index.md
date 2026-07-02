---
layout: home

hero:
  name: "OpenSpec"
  text: "Desarrollo impulsado por especificaciones para asistentes de IA"
  tagline: Una especificación ligera para construir y gestionar proyectos de asistentes de IA.
  actions:
    - theme: brand
      text: Empezar
      link: ./getting-started
    - theme: alt
      text: Inicio
      link: /

features:
  - title: Flujo de trabajo basado en especificaciones
    details: Define los requisitos antes de escribir código.
  - title: Diseño nativo para IA
    details: Construido para Claude Code, Cursor, Windsurf y más.
  - title: Multi-idioma
    details: Documentación disponible en múltiples idiomas.
---

# Documentación de OpenSpec

Bienvenidos. Esta es la página principal de todo lo relacionado con OpenSpec.

OpenSpec te ayuda a ti y a tu asistente de codificación de IA a **acordar qué construir antes de escribir cualquier código.** Tú describes el cambio, la IA redacta una especificación corta y una lista de tareas, ambos miran el mismo plan y luego se realiza el trabajo. No más descubrimientos a mitad del camino de que la IA construyó algo incorrecto.

Si no lees nada más, lee estas dos páginas:

1. [Getting Started](getting-started.md): instala, inicializa y envía tu primer cambio.
2. [How Commands Work](how-commands-work.md): dónde realmente escribes `/opsx:propose` (pista: en tu chat de IA, no en la terminal). Esto confunde a casi todo el mundo una vez.

La segunda es más importante de lo que parece. OpenSpec tiene dos mitades: una herramienta de línea de comandos que ejecutas en tu terminal y comandos slash que le das a tu asistente de IA. Saber cuál es cuál te ahorra el momento de confusión más común.

> **El mejor hábito para desarrollar primero: cuando no estás seguro de qué construir, comienza con `/opsx:explore`.** Es un compañero de pensamiento sin riesgos que lee tu código, sopesa las opciones y refina una idea vaga en un plan concreto antes de que exista cualquier artefacto o código. La guía [Explore First](explore.md) lo demuestra.

## Elige tu camino

**Soy completamente nuevo.** Empieza con [Getting Started](getting-started.md) y luego echa un vistazo a los [Core Concepts at a Glance](overview.md). Cuando algo te parezca misterioso, la [FAQ](faq.md) y el [Glossary](glossary.md) están cerca.

**Tengo un problema pero no tengo un plan.** Este es el caso común, y tiene una respuesta dedicada: [Explore First](explore.md). Usa `/opsx:explore` para pensarlo con la IA antes de comprometerte con nada.

**Tengo una base de código grande existente.** No documentas todo. [Using OpenSpec in an Existing Project](existing-projects.md) muestra cómo empezar en código real (brownfield) sin ahogar el océano.

**Solo quiero que funcione.** [Install](installation.md), ejecuta `openspec init` y luego lee [How Commands Work](how-commands-work.md) para que tu primer comando slash aterrice en el lugar correcto.

**Aprendo por ejemplo.** La página [Examples & Recipes](examples.md) recorre cambios reales de principio a fin: una pequeña característica, una corrección de errores, un refactor, una exploración.

**Vengo del flujo de trabajo antiguo.** La [Migration Guide](migration-guide.md) explica qué cambió y por qué, y promete que tu trabajo existente está seguro.

**Quiero adaptarlo al proceso de mi equipo.** [Customization](customization.md) cubre la configuración del proyecto, esquemas personalizados y contexto compartido.

**Algo está roto.** [Troubleshooting](troubleshooting.md) recopila los fallos reales que experimentan las personas, con soluciones.

## El mapa completo

### Empieza aquí

| Doc | Lo que te proporciona |
|-----|-------------------|
| [Getting Started](getting-started.md) | Instalar, inicializar y ejecutar tu primer cambio de principio a fin |
| [Explore First](explore.md) | Usar `/opsx:explore` para pensar en una idea antes de comprometerte |
| [How Commands Work](how-commands-work.md) | Dónde se ejecutan los comandos slash, qué significa "modo interactivo", terminal vs chat |
| [Core Concepts at a Glance](overview.md) | Todo el modelo mental en una página: especificaciones, cambios, deltas, archivo |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix y cómo verificar que funcionó |

### Úsalo día a día

| Doc | Lo que te proporciona |
|-----|-------------------|
| [Workflows](workflows.md) | Patrones comunes y cuándo recurrir a cada comando |
| [Examples & Recipes](examples.md) | Recorridos completos de cambios reales, copias y pegas |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Adoptar OpenSpec en una base de código brownfield grande |
| [Editing & Iterating on a Change](editing-changes.md) | Actualizar artefactos, retroceder, conciliar ediciones manuales |
| [Commands](commands.md) | Referencia para cada comando slash `/opsx:*` |
| [CLI](cli.md) | Referencia para cada comando de terminal `openspec` |

### Entiéndelo profundamente

| Doc | Lo que te proporciona |
|-----|-------------------|
| [Concepts](concepts.md) | La explicación detallada de especificaciones, cambios, artefactos, esquemas y archivo |
| [OPSX Workflow](opsx.md) | Por qué el flujo de trabajo es fluido en lugar de bloqueado por fases, además de una inmersión arquitectónica |
| [Glossary](glossary.md) | Cada término definido en un solo lugar |

### Hazlo tuyo

| Doc | Lo que te proporciona |
|-----|-------------------|
| [Customization](customization.md) | Configuración del proyecto, esquemas personalizados y contexto compartido |
| [Multi-Language](multi-language.md) | Generar artefactos en idiomas distintos al inglés |
| [Supported Tools](supported-tools.md) | Las 25+ herramientas de IA con las que se integra OpenSpec, y dónde aterrizan los archivos |

### Cuando necesitas ayuda

| Doc | Lo que te proporciona |
|-----|-------------------|
| [FAQ](faq.md) | Respuestas rápidas a las preguntas más comunes |
| [Troubleshooting](troubleshooting.md) | Soluciones concretas para fallos concretos |
| [Migration Guide](migration-guide.md) | Cómo pasar del flujo de trabajo heredado a OPSX |

### Coordinación entre repos (beta)

| Doc | Lo que te proporciona |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Planificar en su propio repo cuando tu trabajo abarca varios repos o equipos |
| [Agent Contract](agent-contract.md) | Las interfaces CLI legibles por máquina que impulsan los agentes |

## La versión de treinta segundos

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← opcional, pero un gran hábito
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

Los pasos 1 y 2 se realizan en tu terminal. El resto ocurre en el chat de tu asistente de IA. Esa división es la única cosa que vale la pena memorizar, y [How Commands Work](how-commands-work.md) explica exactamente por qué. El paso 3 es opcional, pero empezar con `/opsx:explore` cuando no estás seguro es el hábito más valioso para formar.

## Dónde más obtener ayuda

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) para preguntas, ideas y ayuda.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) para errores y solicitudes de características.
- **`openspec feedback "your message"`** envía comentarios directamente desde tu terminal (abre un problema en GitHub).

¿Encontraste algo incorrecto, desactualizado o confuso en esta documentación? Eso es un error. Abre un problema o un PR. Las mejoras en la documentación son algunas de las contribuciones más valiosas que puedes hacer.