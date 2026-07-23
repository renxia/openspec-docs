# Solução de Problemas

Soluções concretas para problemas concretos. Cada entrada nomeia um sintoma, explica a causa provável em uma frase e fornece a correção. Se você não encontrar seu problema aqui, o [FAQ](faq.md) pode ajudar, e o [Discord](https://discord.gg/YctCnvvshC) definitivamente ajudará.

## Instalação e configuração

### `openspec: command not found`

A CLI não está instalada, ou seu shell não consegue encontrá-la. Instale-a globalmente e verifique:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Se foi instalada mas ainda não é encontrada, seu diretório global npm bin provavelmente não está no seu `PATH`. Execute `npm bin -g` para ver onde os binários globais residem, e certifique-se de que esse caminho está no perfil do seu shell.

### "Requires Node.js 20.19.0 or higher"

OpenSpec executa no Node 20.19.0+. Verifique sua versão e atualize se necessário:

```bash
node --version
```

Se você usa bun para instalar o OpenSpec, note que o OpenSpec ainda *executa* no Node, então você precisa do Node 20.19.0+ disponível no seu `PATH` independentemente. Veja [Instalação](installation.md).

### `openspec init` didn't configure my AI tool

O init pergunta quais ferramentas configurar. Se você pulou sua ferramenta ou quer adicionar outra, basta executá-lo novamente, ou use o formulário não interativo:

```bash
openspec init --tools claude,cursor
```

A lista completa de IDs de ferramentas está em [Ferramentas Suportadas](supported-tools.md). Use `--tools all` para tudo, `--tools none` para pular a configuração de ferramentas.

## Comandos não aparecem

Se `/opsx:propose` (ou o equivalente da sua ferramenta) não aparecer ou não fizer nada, siga esta lista. Ela está ordenada da verificação mais rápida para a mais lenta.

1. **Você pode estar no lugar errado.** Comandos com barra vão no chat do seu assistente de IA, não no seu terminal. Se você digitou `/opsx:propose` no seu shell, esse é o problema. Veja [Como os Comandos Funcionam](how-commands-work.md).

2. **Regenere os arquivos.** A partir da raiz do seu projeto:

   ```bash
   openspec update
   ```

   Isso reescreve os arquivos de habilidade e comando para cada ferramenta que você configurou.

3. **Reinicie seu assistente.** A maioria das ferramentas escaneiam por habilidades e comandos na inicialização. Uma janela nova geralmente resolve.

4. **Confirme que os arquivos existem.** Para o Claude Code, verifique se `.claude/skills/` contém pastas `openspec-*`. Outras ferramentas usam seus próprios diretórios, todos listados em [Ferramentas Suportadas](supported-tools.md).

5. **Verifique se você inicializou este projeto.** Habilidades são escritas por projeto. Se você clonou um repositório ou mudou de pastas, execute `openspec init` (ou `openspec update`) lá.

6. **Confirme se sua ferramenta suporta arquivos de comando.** Codex e algumas outras ferramentas (CodeArts, Kimi CLI, ForgeCode, Mistral Vibe) não recebem arquivos de comando `opsx-*` gerados; elas usam invocações baseadas em habilidades em vez disso. Para o Codex, verifique `.codex/skills/openspec-*`. Os formulários diferem por ferramenta: veja [Ferramentas Suportadas](supported-tools.md) e [Como os Comandos Funcionam](how-commands-work.md#slash-command-syntax-by-tool).

## Trabalhando com alterações

### "Change not found"

O comando não conseguiu identificar qual alteração você quis dizer. Nomeie-a explicitamente, ou verifique o que existe:

```bash
openspec list                    # see active changes
/opsx:apply add-dark-mode        # name the change in chat
```

Também confirme que você está no diretório de projeto correto.

### "No artifacts ready"

Cada artefato já está criado ou bloqueado esperando por uma dependência. Veja o que está bloqueando:

```bash
openspec status --change <name>
```

Depois crie a dependência faltante primeiro. Lembre-se da ordem: proposta habilita especificações e design; especificações e design juntos habilitam tarefas.

### `openspec validate` reports warnings or errors

A validação verifica suas especificações e alterações por problemas estruturais. Leia a mensagem: ela nomeia o arquivo e o problema.

```bash
openspec validate <name>           # validate one item
openspec validate --all            # validate everything
openspec validate --all --strict   # stricter checks, good for CI
```

Causas comuns são uma seção obrigatória faltando (como uma especificação sem cenários) ou um cabeçalho delta malformado. Corrija o arquivo e execute novamente. A [referência da CLI](cli.md#openspec-validate) documenta o formato de saída.

### A IA criou artefatos incompletos ou errados

A IA não teve contexto suficiente. Alguns controles ajudam:

- Adicione contexto do projeto em `openspec/config.yaml` para que sua pilha e convenções sejam injetadas em cada solicitação. Veja [Personalização](customization.md#project-configuration).
- Adicione `rules:` por artefato para orientação que se aplica apenas a, digamos, especificações.
- Dê uma descrição mais detalhada quando você propor.
- Use o `/opsx:continue` expandido para criar um artefato de cada vez e revisar cada um, ao invés do `/opsx:ff` que faz todos de uma vez.

### O arquivamento não termina, ou avisa sobre tarefas incompletas

O arquivamento não *bloqueará* em tarefas incompletas, mas ele avisa você, porque arquivar geralmente significa que o trabalho está pronto. Se as tarefas permanecerem intencionalmente (você está arquivando uma alteração parcial), prossiga. Caso contrário, termine as tarefas primeiro. O arquivamento também oferecerá para sincronizar suas especificações delta nas especificações principais se você ainda não sincronizou; diga sim a menos que você tenha um motivo para não fazer.

## Configuração

### Meu `config.yaml` não está sendo aplicado

Três suspeitos usuais:

1. **Nome de arquivo errado.** Deve ser `openspec/config.yaml`, não `.yml`.
2. **YAML inválido.** Execute-o em qualquer validador YAML; a CLI também relata erros de sintaxe com números de linha.
3. **Você esperava um reinício.** Você não precisa de um. Mudanças de configuração entram em efeito imediatamente.

### "Unknown artifact ID in rules: X"

Uma chave sob `rules:` não corresponde a nenhum artefato no seu esquema. Para o esquema padrão `spec-driven`, os IDs válidos são `proposal`, `specs`, `design`, `tasks`. Para ver os IDs de qualquer esquema:

```bash
openspec schemas --json
```

### "Context too large"

O campo `context:` é limitado a 50KB, de propósito, porque é injetado em cada solicitação. Resuma-o, ou faça um link para documentos mais longos ao invés de colá-los. Contexto enxuto também produz resultados melhores e mais rápidos.

### "Schema not found"

O nome do esquema que você referenciou não existe. Liste o que está disponível e verifique a ortografia:

```bash
openspec schemas                    # list available schemas
openspec schema which <name>        # see where a schema resolves from
openspec schema init <name>         # create a custom one
```

Veja [Personalização](customization.md#custom-schemas).

## Migração do fluxo de trabalho legado

### "Legacy files detected in non-interactive mode"

Você está em CI ou em um shell não interativo, e o OpenSpec encontrou arquivos antigos para limpar mas não pode solicitar sua confirmação. Aprove automaticamente:

```bash
openspec init --force
```

Para o Codex, o OpenSpec pode detectar arquivos de prompt gerenciados antigos em `$CODEX_HOME/prompts` ou `~/.codex/prompts`. Essa limpeza é limitada aos nomes de arquivo de prompt legado do Codex na lista de permissões do OpenSpec, e o `openspec init` não interativo remove apenas os arquivos cujas habilidades de substituição `.codex/skills/openspec-*` existem. O `openspec update` não interativo deixa toda a limpeza legada intocada a menos que você passe `--force`.

### Comandos não apareceram após a migração

Reinicie seu IDE. Habilidades são detectadas na inicialização. Se elas ainda não aparecerem, execute `openspec update` e verifique os locais dos arquivos em [Ferramentas Suportadas](supported-tools.md).

### Meu antigo `project.md` não foi migrado

Isso é intencional. O OpenSpec nunca exclui `project.md` automaticamente porque ele pode conter contexto que você escreveu. Mova as partes úteis para a seção `context:` do `config.yaml`, depois exclua-o você mesmo. O [Guia de Migração](migration-guide.md#migrating-projectmd-to-configyaml) percorre isso, incluindo um prompt que você pode passar para sua IA para fazer a destilação.

## Ainda com problemas?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Do seu terminal:** `openspec feedback "what went wrong"` abre uma issue para você.

Quando você relatar um problema, inclua sua versão do OpenSpec (`openspec --version`), sua versão do Node (`node --version`), sua ferramenta de IA, e o comando e saída exatos. Isso torna a ajuda muito mais rápida.