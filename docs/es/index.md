---
layout: home

hero:
  name: "OpenSpec"
  text: "Desarrollo Guiado por Especificaciones para Asistentes de IA"
  tagline: Una especificación ligera para construir y gestionar proyectos de asistentes de IA.
  actions:
    - theme: brand
      text: "Comenzar"
      link: ./getting-started
    - theme: alt
      text: "Inicio"
      link: /

features:
  - title: Flujo de trabajo primero la especificación
    details: Define los requisitos antes de escribir código.
  - title: Diseño nativo para IA
    details: Creado para Claude Code, Cursor, Windsurf y más.
  - title: Multiidioma
    details: Documentación disponible en varios idiomas.
---

# Documentación de OpenSpec

Bienvenido. Este es el hogar de todo lo relacionado con OpenSpec.

OpenSpec te ayuda a ti y a tu asistente de codificación con IA **a ponerse de acuerdo sobre qué construir antes de escribir cualquier código.** Describes el cambio, la IA redacta una especificación corta y una lista de tareas, ambos revisan el mismo plan y luego se realiza el trabajo. Ya no tendrás que descubrir a mitad de camino que la IA construyó algo equivocado.

Si no lees nada más, lee estas dos páginas:

1. [Comenzar](getting-started.md): instala, inicializa y envía tu primer cambio.
2. [Cómo funcionan los comandos](how-commands-work.md): dónde escribes realmente `/opsx:propose` (pista: en el chat de tu IA, no en la terminal). Esto le suele pasar a casi todo el mundo la primera vez.

Esa segunda página es más importante de lo que parece. OpenSpec tiene dos partes: una herramienta de línea de comandos que ejecutas en tu terminal, y comandos de barra que le das a tu asistente de IA. Saber cuál es cuál te ahorra el momento de confusión más común.

> **El mejor hábito que puedes adoptar primero: cuando no estés seguro de qué construir, empieza con `/opsx:explore`.** Es un compañero de reflexión sin riesgos que lee tu código, evalúa opciones y convierte una idea difusa en un plan concreto antes de que exista cualquier artefacto o código. La guía [Explorar primero](explore.md) explica por qué.

## Elige tu camino

**Soy nuevo en esto.** Empieza por [Comenzar](getting-started.md), luego echa un vistazo rápido a [Conceptos básicos de un vistazo](overview.md). Cuando algo te parezca confuso, tienes cerca la [Preguntas frecuentes (FAQ)](faq.md) y el [Glosario](glossary.md).

**Tengo un problema pero no un plan.** Este es el caso más común, y tiene una respuesta dedicada: [Explorar primero](explore.md). Usa `/opsx:explore` para pensarlo con la IA antes de comprometerte con nada.

**Tengo una base de código existente grande.** No tienes que documentarla toda. [Usar OpenSpec en un proyecto existente](existing-projects.md) muestra cómo empezar con código brownfield real sin tener que abordar una tarea de una envergadura excesiva.

**Solo quiero que funcione.** [Instala](installation.md), ejecuta `openspec init`, luego lee [Cómo funcionan los comandos](how-commands-work.md) para que tu primer comando de barra se ejecute en el lugar correcto.

**Aprendo con ejemplos.** La página [Ejemplos y recetas](examples.md) recorre cambios reales de principio a fin: una funcionalidad pequeña, una corrección de errores, una refactorización, una exploración.

**La IA acaba de redactar un plan — ¿y ahora qué?** Léelo. [Revisar un cambio](reviewing-changes.md) muestra la revisión de dos minutos que detecta un giro equivocado mientras el coste de corregirlo todavía es bajo, y [Escribir buenas especificaciones](writing-specs.md) explica de qué está hecho un plan que vale la pena aprobar.

**Trabajo en equipo.** [OpenSpec en equipo](team-workflow.md) muestra cómo se corresponde un cambio con una rama y una solicitud de extracción, y cómo los compañeros revisan un plan antes de escribir el código.

**Vengo del flujo de trabajo anterior.** La [Guía de migración](migration-guide.md) explica qué cambió y por qué, y garantiza que tu trabajo existente está seguro.

**Quiero adaptarlo al proceso de mi equipo.** [Personalización](customization.md) cubre la configuración del proyecto, esquemas personalizados y contexto compartido.

**Algo no funciona.** [Solución de problemas](troubleshooting.md) recopila los fallos con los que se encuentran realmente los usuarios, con sus soluciones.

## Mapa completo

### Comienza aquí

| Documento | Qué te ofrece |
|-----------|---------------|
| [Comenzar](getting-started.md) | Instala, inicializa y ejecuta tu primer cambio de principio a fin |
| [Explorar primero](explore.md) | Usa `/opsx:explore` para reflexionar sobre una idea antes de comprometerte con ella |
| [Cómo funcionan los comandos](how-commands-work.md) | Dónde se ejecutan los comandos de barra, qué significa el "modo interactivo", terminal frente a chat |
| [Conceptos básicos de un vistazo](overview.md) | Todo el modelo mental en una página: especificaciones, cambios, deltas, archivo |
| [Instalación](installation.md) | npm, pnpm, yarn, bun, Nix, y cómo verificar que funcionó |

### Úsalo a diario

| Documento | Qué te ofrece |
|-----------|---------------|
| [Flujos de trabajo](workflows.md) | Patrones comunes y cuándo usar cada comando |
| [Ejemplos y recetas](examples.md) | Recorridos completos de cambios reales, listos para copiar y pegar |
| [Escribir buenas especificaciones](writing-specs.md) | Cómo son un requisito y un escenario sólidos, y cómo ajustar el tamaño de un cambio correctamente |
| [Revisar un cambio](reviewing-changes.md) | La revisión de dos minutos de un plan redactado antes de escribir cualquier código |
| [OpenSpec en equipo](team-workflow.md) | Cómo encajan los cambios en las ramas, las solicitudes de extracción y la revisión |
| [Usar OpenSpec en un proyecto existente](existing-projects.md) | Adoptar OpenSpec en una base de código brownfield grande |
| [Editar e iterar sobre un cambio](editing-changes.md) | Actualizar artefactos, retroceder, reconciliar ediciones manuales |
| [Comandos](commands.md) | Referencia de todos los comandos de barra `/opsx:*` |
| [CLI](cli.md) | Referencia de todos los comandos de terminal `openspec` |

### Compréndelo a fondo

| Documento | Qué te ofrece |
|-----------|---------------|
| [Conceptos](concepts.md) | La explicación detallada de especificaciones, cambios, artefactos, esquemas y archivo |
| [Flujo de trabajo OPSX](opsx.md) | Por qué el flujo de trabajo es fluido en lugar de estar bloqueado por fases, además de un análisis profundo de la arquitectura |
| [Glosario](glossary.md) | Todos los términos definidos en un solo lugar |

### Adáptalo a tu gusto

| Documento | Qué te ofrece |
|-----------|---------------|
| [Personalización](customization.md) | Configuración del proyecto, esquemas personalizados, contexto compartido |
| [Multiidioma](multi-language.md) | Generar artefactos en idiomas distintos al inglés |
| [Herramientas compatibles](supported-tools.md) | Las más de 25 herramientas de IA con las que se integra OpenSpec, y dónde se guardan los archivos |

### Cuando necesites ayuda

| Documento | Qué te ofrece |
|-----------|---------------|
| [Preguntas frecuentes (FAQ)](faq.md) | Respuestas rápidas a las preguntas más frecuentes |
| [Solución de problemas](troubleshooting.md) | Soluciones concretas para fallos concretos |
| [Guía de migración](migration-guide.md) | Pasar del flujo de trabajo heredado a OPSX |

### Coordinación entre repositorios (beta)

| Documento | Qué te ofrece |
|-----------|---------------|
| [Stores: Guía de usuario](stores-beta/user-guide.md) | Planifica en su propio repositorio cuando tu trabajo abarque varios repositorios o equipos |
| [Contrato de agente](agent-contract.md) | Las interfaces de CLI legibles por máquina que utilizan los agentes |

## La versión de treinta segundos

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← optional, but a great habit
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

Los pasos 1 y 2 se ejecutan en tu terminal. El resto se realiza en el chat de tu asistente de IA. Esa división es lo único que vale la pena memorizar, y [Cómo funcionan los comandos](how-commands-work.md) lo explica exactamente. El paso 3 es opcional, pero empezar con `/opsx:explore` cuando no estés seguro es el hábito que más vale la pena adoptar.

## Dónde más obtener ayuda

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) para preguntas, ideas y ayuda.
- **Problemas de GitHub:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) para errores y solicitudes de funcionalidades.
- **`openspec feedback "tu mensaje"`** envía comentarios directamente desde tu terminal (abre un problema en GitHub).

¿Has encontrado algo en esta documentación que sea erróneo, obsoleto o confuso? Eso es un fallo. Abre un problema o una solicitud de extracción (PR). Las mejoras en la documentación son algunas de las contribuciones más valiosas que puedes realizar.