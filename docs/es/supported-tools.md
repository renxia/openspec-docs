# Herramientas compatibles

OpenSpec funciona con muchos asistentes de codificación con IA. Cuando ejecutas `openspec init`, OpenSpec configura las herramientas seleccionadas usando tu selección activa de perfil/flujo de trabajo y el modo de entrega.

## Cómo funciona

Para cada herramienta seleccionada, OpenSpec puede instalar:

1. **Habilidades** (si la entrega incluye habilidades): `.../skills/openspec-*/SKILL.md`
2. **Comandos** (si la entrega incluye comandos): archivos de comando `opsx-*` específicos de cada herramienta

Codex es solo de habilidades: OpenSpec instala `.codex/skills/openspec-*/SKILL.md` para Codex incluso cuando la entrega está configurada como `commands`, y no genera archivos de prompt personalizados para Codex.

De forma predeterminada, OpenSpec usa el perfil `core`, que incluye:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Puedes habilitar flujos de trabajo ampliados (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) mediante `openspec config profile`, luego ejecuta `openspec update`.

## Referencia de directorios de herramientas

| Herramienta (ID) | Patrón de ruta de habilidades | Patrón de ruta de comandos |
|------------------|--------------------------------|-----------------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | No se generan (no hay adaptador de comandos; usa invocaciones basadas en habilidades `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | No se generan (solo usa habilidades; usa `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | No se generan (no hay adaptador de comandos; usa invocaciones basadas en habilidades `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | No se generan (no hay adaptador de comandos; usa invocaciones basadas en habilidades `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | No se generan (no hay adaptador de comandos; usa invocaciones basadas en habilidades `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | No se generan (no hay adaptador de comandos; usa invocaciones basadas en habilidades `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* Los archivos de prompt de GitHub Copilot se reconocen como comandos de barra personalizados en las extensiones de IDE (VS Code, JetBrains, Visual Studio). La CLI de Copilot actualmente no consume directamente `.github/prompts/*.prompt.md`.

\*\*\* Hermes carga las habilidades desde `~/.hermes/skills/` de forma predeterminada. Para usar las habilidades de OpenSpec locales del proyecto, agrega el directorio `.hermes/skills/` del proyecto a `skills.external_dirs` en `~/.hermes/config.yaml`; luego, Hermes expone las habilidades con invocaciones de barra orientadas al usuario como `/openspec-propose`.

## Configuración no interactiva

Para configuraciones de CI/CD o por script, usa `--tools` (y opcionalmente `--profile`):

```bash
# Configurar herramientas específicas
openspec init --tools claude,cursor

# Configurar todas las herramientas compatibles
openspec init --tools all

# Omitir la configuración de herramientas
openspec init --tools none

# Sobrescribir el perfil para esta ejecución de init
openspec init --profile core
```

**IDs de herramientas disponibles (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## Instalación dependiente del flujo de trabajo

OpenSpec instala artefactos de flujo de trabajo según los flujos de trabajo seleccionados:

- **Perfil core (predeterminado):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Selección personalizada:** cualquier subconjunto de todos los IDs de flujo de trabajo:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

En otras palabras, la cantidad de habilidades y comandos depende del perfil y del modo de entrega, no es fija.

## Nombres de habilidades generados

Cuando se seleccionan mediante la configuración de perfil/flujo de trabajo, OpenSpec genera estas habilidades:

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

Consulta [Comandos](commands.md) para ver el comportamiento de los comandos y [CLI](cli.md) para las opciones de `init`/`update`.

## Relacionado

- [Referencia de la CLI](cli.md) — Comandos de terminal
- [Comandos](commands.md) — Comandos de barra y habilidades
- [Primeros pasos](getting-started.md) — Configuración inicial