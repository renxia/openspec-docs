# Herramientas compatibles

OpenSpec funciona con muchos asistentes de codificación con IA. Cuando ejecutas `openspec init`, OpenSpec configura las herramientas seleccionadas utilizando tu perfil/selección de flujo de trabajo activo y el modo de entrega.

## Cómo funciona

Para cada herramienta seleccionada, OpenSpec puede instalar:

1. **Habilidades** (si la entrega incluye habilidades): `.../skills/openspec-*/SKILL.md`
2. **Comandos** (si la entrega incluye comandos): archivos de comandos específicos de la herramienta `opsx-*`

Por defecto, OpenSpec utiliza el perfil `core`, que incluye:
- `propose`
- `explore`
- `apply`
- `archive`

Puedes habilitar flujos de trabajo ampliados (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`) mediante `openspec config profile`, y luego ejecutar `openspec update`.

## Referencia del directorio de herramientas

| Herramienta (ID) | Patrón de ruta de habilidades | Patrón de ruta de comandos |
|-------------------|-------------------------------|----------------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | No se genera (sin adaptador de comandos; usa invocaciones basadas en habilidades `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | No se genera (sin adaptador de comandos; usa invocaciones basadas en habilidades `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Los comandos de Codex se instalan en el directorio global de Codex (`$CODEX_HOME/prompts/` si está configurado, de lo contrario `~/.codex/prompts/`), no en tu directorio de proyecto.

\*\* Los archivos de prompts de GitHub Copilot se reconocen como comandos slash personalizados en las extensiones del IDE (VS Code, JetBrains, Visual Studio). La CLI de Copilot actualmente no consume directamente los archivos `.github/prompts/*.prompt.md`.

## Configuración no interactiva

Para configuraciones CI/CD o scriptadas, usa `--tools` (y opcionalmente `--profile`):

```bash
# Configurar herramientas específicas
openspec init --tools claude,cursor

# Configurar todas las herramientas compatibles
openspec init --tools all

# Omitir la configuración de herramientas
openspec init --tools none

# Anular el perfil para esta ejecución de init
openspec init --profile core
```

**IDs de herramientas disponibles (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `forgecode`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## Instalación dependiente del flujo de trabajo

OpenSpec instala los artefactos del flujo de trabajo basándose en los flujos de trabajo seleccionados:

- **Perfil core (predeterminado):** `propose`, `explore`, `apply`, `archive`
- **Selección personalizada:** cualquier subconjunto de todos los IDs de flujo de trabajo:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

En otras palabras, la cantidad de habilidades/comandos depende del perfil y de la entrega, no es fija.

## Nombres de habilidades generadas

Cuando se seleccionan mediante la configuración de perfil/flujo de trabajo, OpenSpec genera estas habilidades:

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

Consulta [Comandos](commands.md) para el comportamiento de los comandos y [CLI](cli.md) para las opciones de `init`/`update`.

## Relacionado

- [Referencia de la CLI](cli.md) — Comandos de terminal
- [Comandos](commands.md) — Comandos slash y habilidades
- [Primeros pasos](getting-started.md) — Configuración inicial