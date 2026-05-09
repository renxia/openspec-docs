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
  - title: Flujo Especificación-Primero
    details: Define los requisitos antes de escribir código.
  - title: Diseño Nativo para IA
    details: Construido para Claude Code, Cursor, Windsurf y más.
  - title: Multi-idioma
    details: Documentación disponible en múltiples idiomas.
---


Nuestra filosofía:

```text
→ fluido, no rígido
→ iterativo, no en cascada
→ sencillo, no complejo
→ construido para brownfield, no solo greenfield
→ escalable desde proyectos personales hasta empresas
```

> [!TIP]
> **¡Nuevo flujo de trabajo disponible!** Hemos reconstruido OpenSpec con un nuevo flujo de trabajo guiado por artefactos.
>
> Ejecuta `/opsx:propose "tu idea"` para comenzar. → [Aprende más aquí](opsx.md)

<p align="center">
  Sigue a <a href="https://x.com/0xTab">@0xTab en X</a> para actualizaciones · Únete al <a href="https://discord.gg/YctCnvvshC">Discord de OpenSpec</a> para ayuda y preguntas.
</p>

## Míralo en acción

```text
Tú: /opsx:propose add-dark-mode
IA:  Creado openspec/changes/add-dark-mode/
     ✓ proposal.md — por qué hacemos esto, qué está cambiando
     ✓ specs/       — requisitos y escenarios
     ✓ design.md    — enfoque técnico
     ✓ tasks.md     — lista de implementación
     ¡Listo para implementar!

Tú: /opsx:apply
IA:  Implementando tareas...
     ✓ 1.1 Añadir proveedor de contexto de tema
     ✓ 1.2 Crear componente de alternancia
     ✓ 2.1 Añadir variables CSS
     ✓ 2.2 Conectar localStorage
     ¡Todas las tareas completadas!

Tú: /opsx:archive
IA:  Archivado en openspec/changes/archive/2025-01-23-add-dark-mode/
     Especificaciones actualizadas. Listo para la siguiente característica.
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

Luego navega al directorio de tu proyecto e inicializa:

```bash
cd your-project
openspec init
```

Ahora dile a tu IA: `/opsx:propose <lo-que-quieras-construir>`

Si quieres el flujo de trabajo expandido (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), selecciónalo con `openspec config profile` y aplícalo con `openspec update`.

> [!NOTE]
> ¿No estás seguro si tu herramienta es compatible? [Consulta la lista completa](supported-tools.md) – admitimos más de 25 herramientas y seguimos creciendo.
>
> También funciona con pnpm, yarn, bun y nix. [Consulta las opciones de instalación](installation.md).

## Documentación

→ **[Primeros Pasos](getting-started.md)**: los primeros pasos<br>
→ **[Flujos de Trabajo](workflows.md)**: combinaciones y patrones<br>
→ **[Comandos](commands.md)**: comandos slash y habilidades<br>
→ **[CLI](cli.md)**: referencia de terminal<br>
→ **[Herramientas Compatibles](supported-tools.md)**: integraciones de herramientas y rutas de instalación<br>
→ **[Conceptos](concepts.md)**: cómo encaja todo<br>
→ **[Multi-idioma](multi-language.md)**: soporte multi-idioma<br>
→ **[Personalización](customization.md)**: hazlo tuyo


## ¿Por qué OpenSpec?

Los asistentes de codificación con IA son poderosos pero impredecibles cuando los requisitos solo viven en el historial del chat. OpenSpec añade una capa de especificación ligera para que acuerdes qué construir antes de escribir cualquier código.

- **Acuerda antes de construir** — humano e IA se alinean en las especificaciones antes de escribir código
- **Mantente organizado** — cada cambio obtiene su propia carpeta con propuesta, especificaciones, diseño y tareas
- **Trabaja fluidamente** — actualiza cualquier artefacto en cualquier momento, sin puertas de fase rígidas
- **Usa tus herramientas** — funciona con más de 20 asistentes de IA mediante comandos slash

### Cómo nos comparamos

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Exhaustivo pero pesado. Puertas de fase rígidas, mucho Markdown, configuración en Python. OpenSpec es más ligero y te permite iterar libremente.

**vs. [Kiro](https://kiro.dev)** (AWS) — Poderoso pero estás atado a su IDE y limitado a modelos de Claude. OpenSpec funciona con las herramientas que ya usas.

**vs. nada** — Codificación con IA sin especificaciones significa indicaciones vagas y resultados impredecibles. OpenSpec aporta previsibilidad sin la ceremonia.

## Actualizar OpenSpec

**Actualiza el paquete**

```bash
npm install -g @fission-ai/openspec@latest
```

**Actualiza las instrucciones del agente**

Ejecuta esto dentro de cada proyecto para regenerar la guía de la IA y asegurar que los últimos comandos slash estén activos:

```bash
openspec update
```

## Notas de Uso

**Selección de modelo**: OpenSpec funciona mejor con modelos de alto razonamiento. Recomendamos Opus 4.5 y GPT 5.2 tanto para planificación como para implementación.

**Higiene de contexto**: OpenSpec se beneficia de una ventana de contexto limpia. Limpia tu contexto antes de comenzar la implementación y mantén una buena higiene de contexto durante toda tu sesión.

## Contribuir

**Correcciones menores** — Corrección de errores, erratas y mejoras menores pueden enviarse directamente como PRs.

**Cambios mayores** — Para nuevas características, refactorizaciones significativas o cambios arquitectónicos, por favor envía primero una propuesta de cambio de OpenSpec para que podamos alinearnos en la intención y los objetivos antes de que comience la implementación.

Al escribir propuestas, ten en cuenta la filosofía de OpenSpec: servimos a una amplia variedad de usuarios en diferentes agentes de codificación, modelos y casos de uso. Los cambios deben funcionar bien para todos.

**El código generado por IA es bienvenido** — siempre que haya sido probado y verificado. Los PRs que contengan código generado por IA deben mencionar el agente de codificación y el modelo utilizado (por ejemplo, "Generado con Claude Code usando claude-opus-4-5-20251101").

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

Solo recopilamos nombres de comandos y versión para comprender patrones de uso. No se recopilan argumentos, rutas, contenido ni PII. Se desactiva automáticamente en CI.

**Desactivar:** `export OPENSPEC_TELEMETRY=0` o `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Mantenedores y Asesores</strong></summary>

Consulta [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) para ver la lista de mantenedores principales y asesores que ayudan a guiar el proyecto.

</details>



## Licencia

MIT