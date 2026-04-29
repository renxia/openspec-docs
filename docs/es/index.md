---
layout: home

hero:
  name: "OpenSpec"
  text: "Desarrollo Impulsado por Especificaciones para Asistentes de IA"
  tagline: Una especificación ligera para construir y gestionar proyectos de asistentes de IA.
  actions:
    - theme: brand
      text: Comenzar
      link: ./getting-started
    - theme: alt
      text: Inicio
      link: /

features:
  - title: Flujo de Trabajo con Especificaciones Primero
    details: Define los requisitos antes de escribir código.
  - title: Diseño Nativo para IA
    details: Construido para Claude Code, Cursor, Windsurf y más.
  - title: Multi-idioma
    details: Documentación disponible en múltiples idiomas.
---


<details>
<summary><strong>El marco de especificaciones más apreciado.</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
Nuestra filosofía:

```text
→ fluido, no rígido
→ iterativo, no en cascada
→ fácil, no complejo
→ construido para proyectos existentes, no solo para nuevos
→ escalable desde proyectos personales hasta empresas
```

> [!TIP]
> **¡Nuevo flujo de trabajo disponible!** Hemos reconstruido OpenSpec con un nuevo flujo de trabajo guiado por artefactos.
>
> Ejecuta `/opsx:propose "tu idea"` para comenzar. → [Aprende más aquí](opsx.md)

<p align="center">
  Sigue a <a href="https://x.com/0xTab">@0xTab en X</a> para actualizaciones · Únete al <a href="https://discord.gg/YctCnvvshC">Discord de OpenSpec</a> para ayuda y preguntas.
</p>

<!-- TODO: Add GIF demo of /opsx:propose → /opsx:archive workflow -->

## Veálo en acción

```text
Tú: /opsx:propose add-dark-mode
IA:  Creado openspec/changes/add-dark-mode/
     ✓ proposal.md — por qué lo hacemos, qué cambia
     ✓ specs/       — requisitos y escenarios
     ✓ design.md    — enfoque técnico
     ✓ tasks.md     — lista de verificación de implementación
     ¡Listo para la implementación!

Tú: /opsx:apply
IA:  Implementando tareas...
     ✓ 1.1 Añadir proveedor de contexto de temas
     ✓ 1.2 Crear componente de alternancia
     ✓ 2.1 Añadir variables CSS
     ✓ 2.2 Conectar con localStorage
     ¡Todas las tareas completadas!

Tú: /opsx:archive
IA:  Archivado en openspec/changes/archive/2025-01-23-add-dark-mode/
     Especificaciones actualizadas. Listo para la próxima funcionalidad.
```

<details>
<summary><strong>Panel de Control de OpenSpec</strong></summary>

</details>

## Inicio Rápido

**Requiere Node.js 20.19.0 o superior.**

Instala OpenSpec globalmente:

```bash
npm install -g @fission-ai/openspec@latest
```

Luego, navega al directorio de tu proyecto e inicializa:

```bash
cd tu-proyecto
openspec init
```

Ahora dile a tu IA: `/opsx:propose <lo-que-quieres-construir>`

Si deseas el flujo de trabajo ampliado (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), selecciónalo con `openspec config profile` y aplícalo con `openspec update`.

> [!NOTE]
> ¿No estás seguro si tu herramienta es compatible? [Consulta la lista completa](supported-tools.md) – soportamos más de 25 herramientas y seguimos creciendo.
>
> También funciona con pnpm, yarn, bun y nix. [Consulta las opciones de instalación](installation.md).

## Documentación

→ **[Primeros Pasos](getting-started.md)**: primeros pasos<br>
→ **[Flujos de Trabajo](workflows.md)**: combinaciones y patrones<br>
→ **[Comandos](commands.md)**: comandos de barra inclinada y habilidades<br>
→ **[CLI](cli.md)**: referencia de la terminal<br>
→ **[Herramientas Soportadas](supported-tools.md)**: integraciones de herramientas y rutas de instalación<br>
→ **[Conceptos](concepts.md)**: cómo encaja todo<br>
→ **[Multi-idioma](multi-language.md)**: soporte multi-idioma<br>
→ **[Personalización](customization.md)**: hazlo tuyo


## ¿Por qué OpenSpec?

Los asistentes de codificación con IA son poderosos pero impredecibles cuando los requisitos solo viven en el historial del chat. OpenSpec añade una capa ligera de especificaciones para que se acuerde qué construir antes de escribir cualquier código.

- **Acuerda antes de construir** — humano y IA se alinean en las especificaciones antes de que se escriba el código
- **Mantente organizado** — cada cambio obtiene su propia carpeta con propuesta, especificaciones, diseño y tareas
- **Trabaja con fluidez** — actualiza cualquier artefacto en cualquier momento, sin puertas de fase rígidas
- **Usa tus herramientas** — funciona con más de 20 asistentes de IA a través de comandos de barra inclinada

### Cómo nos comparamos

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Exhaustivo pero pesado. Puertas de fase rígidas, mucho Markdown, configuración en Python. OpenSpec es más ligero y te permite iterar libremente.

**vs. [Kiro](https://kiro.dev)** (AWS) — Poderoso pero estás encerrado en su IDE y limitado a modelos Claude. OpenSpec funciona con las herramientas que ya usas.

**vs. nada** — Codificar con IA sin especificaciones significa prompts vagos y resultados impredecibles. OpenSpec aporta previsibilidad sin la ceremonia.

## Actualizar OpenSpec

**Actualiza el paquete**

```bash
npm install -g @fission-ai/openspec@latest
```

**Refresca las instrucciones del agente**

Ejecuta esto dentro de cada proyecto para regenerar la guía de IA y asegurar que los últimos comandos de barra inclinada estén activos:

```bash
openspec update
```

## Notas de Uso

**Selección de modelo**: OpenSpec funciona mejor con modelos de alto razonamiento. Recomendamos Opus 4.5 y GPT 5.2 tanto para la planificación como para la implementación.

**Higiene del contexto**: OpenSpec se beneficia de una ventana de contexto limpia. Limpia tu contexto antes de comenzar la implementación y mantén una buena higiene del contexto durante toda tu sesión.

## Contribuir

**Correcciones pequeñas** — Las correcciones de errores, correcciones de errores tipográficos y mejoras menores se pueden enviar directamente como PRs.

**Cambios más grandes** — Para nuevas funcionalidades, refactorizaciones significativas o cambios arquitectónicos, por favor envía primero una propuesta de cambio de OpenSpec para que podamos alinearnos en la intención y los objetivos antes de que comience la implementación.

Al escribir propuestas, ten en cuenta la filosofía de OpenSpec: servimos a una amplia variedad de usuarios a través de diferentes agentes de codificación, modelos y casos de uso. Los cambios deben funcionar bien para todos.

**Se acepta código generado por IA** — siempre que haya sido probado y verificado. Los PRs que contengan código generado por IA deben mencionar el agente de codificación y el modelo utilizado (por ejemplo, "Generado con Claude Code usando claude-opus-4-5-20251101").

### Desarrollo

- Instalar dependencias: `pnpm install`
- Compilar: `pnpm run build`
- Probar: `pnpm test`
- Desarrollar CLI localmente: `pnpm run dev` o `pnpm run dev:cli`
- Commits convencionales (una línea): `type(scope): subject`

## Otros

<details>
<summary><strong>Telemetría</strong></summary>

OpenSpec recopila estadísticas de uso anónimas.

Solo recopilamos nombres de comandos y versión para comprender los patrones de uso. Sin argumentos, rutas, contenido ni información de identificación personal (PII). Se desactiva automáticamente en CI.

**Para desactivar:** `export OPENSPEC_TELEMETRY=0` o `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Mantenedores y Asesores</strong></summary>

Consulta [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) para la lista de mantenedores principales y asesores que ayudan a guiar el proyecto.

</details>



## Licencia

MIT