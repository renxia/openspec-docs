# Ferramentas Suportadas

O OpenSpec funciona com diversos assistentes de codificação por IA. Ao executar `openspec init`, o OpenSpec configura as ferramentas selecionadas usando seu perfil/workflow ativo e modo de entrega.

## Como Funciona

Para cada ferramenta selecionada, o OpenSpec pode instalar:

1. **Skills** (se a entrega incluir skills): `.../skills/openspec-*/SKILL.md`
2. **Commands** (se a entrega incluir commands): arquivos de comando `opsx-*` específicos da ferramenta

Por padrão, o OpenSpec utiliza o perfil `core`, que inclui:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Você pode habilitar fluxos de trabalho expandidos (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) via `openspec config profile`, e então executar `openspec update`.

## Referência do Diretório de Ferramentas

| Ferramenta (ID) | Padrão do caminho de skills | Padrão do caminho de commands |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | `$CODEX_HOME/prompts/opsx-<id>.md`\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comando; use invocações baseadas em skill `/openspec-*`) |
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
| Kimi CLI (`kimi`) | `.kimi/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comando; use invocações baseadas em skill `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comando; use invocações baseadas em skill `/openspec-*`) |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comando; use invocações baseadas em skill `/openspec-*`) |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |

\* Os comandos do Codex são instalados no diretório home global do Codex (`$CODEX_HOME/prompts/` se definido, caso contrário `~/.codex/prompts/`), não no diretório do seu projeto.

\*\* Os arquivos de prompt do GitHub Copilot são reconhecidos como comandos slash personalizados nas extensões de IDE (VS Code, JetBrains, Visual Studio). O Copilot CLI atualmente não consome `.github/prompts/*.prompt.md` diretamente.

## Configuração Não Interativa

Para configurações em CI/CD ou por scripts, use `--tools` (e opcionalmente `--profile`):

```bash
# Configurar ferramentas específicas
openspec init --tools claude,cursor

# Configurar todas as ferramentas suportadas
openspec init --tools all

# Pular configuração de ferramentas
openspec init --tools none

# Substituir o perfil para esta execução do init
openspec init --profile core
```

**IDs de ferramentas disponíveis (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `vibe`, `windsurf`

## Instalação Dependente de Workflow

O OpenSpec instala artefatos de workflow com base nos fluxos de trabalho selecionados:

- **Perfil core (padrão):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Seleção personalizada:** qualquer subconjunto de todos os IDs de workflow:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Em outras palavras, as quantidades de skills/commands dependem do perfil e da entrega, não são fixas.

## Nomes de Skills Gerados

Quando selecionados pela configuração de perfil/workflow, o OpenSpec gera as seguintes skills:

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

Consulte [Comandos](commands.md) para o comportamento dos comandos e [CLI](cli.md) para opções de `init`/`update`.

## Relacionados

- [Referência da CLI](cli.md) — Comandos de terminal
- [Comandos](commands.md) — Comandos slash e skills
- [Primeiros Passos](getting-started.md) — Configuração inicial