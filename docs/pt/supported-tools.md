# Ferramentas Suportadas

O OpenSpec funciona com muitos assistentes de codificação por IA. Quando você executa `openspec init`, o OpenSpec configura as ferramentas selecionadas usando sua seleção de perfil/fluxo de trabalho ativo e modo de entrega.

## Como Funciona

Para cada ferramenta selecionada, o OpenSpec pode instalar:

1. **Skills** (se a entrega incluir skills): `.../skills/openspec-*/SKILL.md`
2. **Commands** (se a entrega incluir comandos): arquivos de comando `opsx-*` específicos da ferramenta

O Codex é apenas para skills: o OpenSpec instala `.codex/skills/openspec-*/SKILL.md` para o Codex mesmo quando a entrega está definida como `commands`, e não gera arquivos de prompt personalizados para o Codex.

Por padrão, o OpenSpec usa o perfil `core`, que inclui:
- `propose`
- `explore`
- `apply`
- `sync`
- `archive`

Você pode habilitar fluxos de trabalho expandidos (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) via `openspec config profile`, depois execute `openspec update`.

## Referência de Diretórios de Ferramentas

| Ferramenta (ID) | Padrão de caminho de Skills | Padrão de caminho de Commands |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comando; use invocações baseadas em skills `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.codex/skills/openspec-*/SKILL.md` | Não gerado (apenas skills; use `.codex/skills/openspec-*`) |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comando; use invocações baseadas em skills `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Não gerado (sem adaptador de comando; use invocações baseadas em skills `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilocode/workflows/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comando; use invocações baseadas em skills `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comando; use invocações baseadas em skills `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| Windsurf (`windsurf`) | `.windsurf/skills/openspec-*/SKILL.md` | `.windsurf/workflows/opsx-<id>.md` |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |

\*\* Os arquivos de prompt do GitHub Copilot são reconhecidos como comandos slash personalizados em extensões de IDE (VS Code, JetBrains, Visual Studio). O Copilot CLI atualmente não consome `.github/prompts/*.prompt.md` diretamente.

\*\*\* O Hermes carrega skills de `~/.hermes/skills/` por padrão. Para usar skills do OpenSpec locais ao projeto, adicione o diretório `.hermes/skills/` do projeto a `skills.external_dirs` em `~/.hermes/config.yaml`; o Hermes então expõe skills com invocações slash voltadas ao usuário, como `/openspec-propose`.

## Configuração Não-Interativa

Para CI/CD ou configuração via script, use `--tools` (e opcionalmente `--profile`):

```bash
# Configurar ferramentas específicas
openspec init --tools claude,cursor

# Configurar todas as ferramentas suportadas
openspec init --tools all

# Ignorar configuração de ferramentas
openspec init --tools none

# Sobrescrever perfil para esta execução de init
openspec init --profile core
```

**IDs de ferramentas disponíveis (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `codeartsagent`, `codex`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`, `zcode`

## Instalação Dependente de Fluxo de Trabalho

O OpenSpec instala artefatos de fluxo de trabalho com base nos fluxos de trabalho selecionados:

- **Perfil core (padrão):** `propose`, `explore`, `apply`, `sync`, `archive`
- **Seleção personalizada:** qualquer subconjunto de todos os IDs de fluxo de trabalho:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Em outras palavras, as contagens de skills/comandos dependem do perfil e do modo de entrega, não são fixas.

## Nomes de Skills Gerados

Quando selecionados pela configuração de perfil/fluxo de trabalho, o OpenSpec gera estas skills:

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

Veja [Comandos](commands.md) para o comportamento dos comandos e [CLI](cli.md) para as opções de `init`/`update`.

## Relacionado

- [Referência da CLI](cli.md) — Comandos de terminal
- [Comandos](commands.md) — Comandos slash e skills
- [Primeiros Passos](getting-started.md) — Configuração inicial