# Solução de Problemas

Correções concretas para problemas concretos. Cada entrada nomeia um sintoma, explica a causa provável em uma frase e fornece a correção. Se você não encontrar o seu problema aqui, o [FAQ](faq.md) pode ajudar, e o [Discord](https://discord.gg/YctCnvvshC) certamente ajudará.

## Instalação e Configuração

### `openspec: command not found`

O CLI não está instalado ou seu shell não consegue encontrá-lo. Instale-o globalmente e verifique:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Se ele foi instalado, mas ainda não é encontrado, o diretório binário global do npm provavelmente não está no seu `PATH`. Execute `npm bin -g` para ver onde os binários globais estão localizados e certifique-se de que esse caminho esteja no perfil do seu shell.

### "Requires Node.js 20.19.0 or higher"

O OpenSpec roda no Node 20.19.0+. Verifique sua versão e atualize, se necessário:

```bash
node --version
```

Se você usa o bun para instalar o OpenSpec, note que o OpenSpec ainda *roda* no Node, então você precisa ter o Node 20.19.0+ disponível no seu `PATH`, independentemente disso. Consulte [Instalação](installation.md).

### `openspec init` não configurou minha ferramenta de IA

O Init pergunta quais ferramentas configurar. Se você pulou sua ferramenta ou deseja adicionar outra, basta executá-lo novamente ou usar a forma não interativa:

```bash
openspec init --tools claude,cursor
```

A lista completa dos IDs das ferramentas está em [Ferramentas Suportadas](supported-tools.md). Use `--tools all` para tudo e `--tools none` para pular a configuração de ferramentas.

## Comandos não aparecem

Se `/opsx:propose` (ou o equivalente da sua ferramenta) não aparecer ou não fizer nada, siga esta lista. Eles estão ordenados do mais rápido de verificar para o último.

1. **Você pode estar no lugar errado.** Os comandos slash vão no chat do seu assistente de IA, e não no seu terminal. Se você digitou `/opsx:propose` no shell, esse é o problema. Consulte [Como os Comandos Funcionam](how-commands-work.md).

2. **Regerear os arquivos.** A partir da raiz do seu projeto:

   ```bash
   openspec update
   ```

   Isso reescreve os arquivos de habilidade (skill) e comando para cada ferramenta que você configurou.

3. **Reiniciar seu assistente.** A maioria das ferramentas verifica habilidades e comandos na inicialização. Uma janela nova geralmente faz isso.

4. **Confirmar se os arquivos existem.** Para o Claude Code, verifique se `.claude/skills/` contém pastas `openspec-*`. Outras ferramentas usam seus próprios diretórios, todos listados em [Ferramentas Suportadas](supported-tools.md).

5. **Verificar se você inicializou este projeto.** As habilidades são escritas por projeto. Se você clonou um repositório ou mudou de pasta, execute `openspec init` (ou `openspec update`) lá.

6. **Confirmar se sua ferramenta suporta arquivos de comando.** Algumas ferramentas (Kimi CLI, Trae, ForgeCode, Mistral Vibe) não geram arquivos de comando `opsx-*`; elas usam invocações baseadas em habilidades em vez disso. Os formulários diferem por ferramenta: consulte [Ferramentas Suportadas](supported-tools.md) e [Como os Comandos Funcionam](how-commands-work.md#slash-command-syntax-by-tool).

## Trabalhando com Mudanças

### "Change not found" (Mudança não encontrada)

O comando não conseguiu dizer qual mudança você quis. Nomeie-a explicitamente ou verifique o que existe:

```bash
openspec list                    # veja as mudanças ativas
/opsx:apply add-dark-mode        # nomeia a mudança no chat
```

Confirme também se você está no diretório do projeto correto.

### "No artifacts ready" (Nenhum artefato pronto)

Todo artefato está ou já criado ou bloqueado aguardando uma dependência. Veja o que está bloqueando:

```bash
openspec status --change <name>
```

Em seguida, crie a dependência ausente primeiro. Lembre-se da ordem: proposta habilita especificações e design; especificações e design juntos habilitam tarefas.

### `openspec validate` relata avisos ou erros

A validação verifica suas especificações e mudanças em busca de problemas estruturais. Leia a mensagem: ela nomeia o arquivo e o problema.

```bash
openspec validate <name>           # valida um item
openspec validate --all            # valida tudo
openspec validate --all --strict   # verificações mais rigorosas, bom para CI
```

As causas comuns são uma seção obrigatória ausente (como uma especificação sem cenários) ou um cabeçalho delta malformado. Corrija o arquivo e execute novamente. O [referencial CLI](cli.md#openspec-validate) documenta o formato da saída.

### A IA criou artefatos incompletos ou errados

A IA não teve contexto suficiente. Algumas alavancas ajudam:

- Adicione contexto do projeto em `openspec/config.yaml` para que sua pilha e convenções sejam injetadas em cada solicitação. Consulte [Personalização](customization.md#project-configuration).
- Adicione `rules:` por artefato para orientação que se aplica apenas, digamos, às especificações.
- Dê uma descrição mais detalhada ao propor.
- Use o `/opsx:continue` expandido para criar um artefato de cada vez e revisar cada um, em vez de `/opsx:ff` fazendo todos de uma vez.

### O Archive não termina ou avisa sobre tarefas incompletas

O Archive não irá *bloquear* por tarefas incompletas, mas ele o adverte, porque arquivar geralmente significa que o trabalho está feito. Se as tarefas permanecerem intencionalmente (você está enviando uma mudança parcial), prossiga. Caso contrário, termine as tarefas primeiro. O Archive também oferecerá para sincronizar suas especificações delta nas especificações principais se você ainda não tiver sincronizado; diga sim, a menos que tenha um motivo para não o fazer.

## Configuração

### Meu `config.yaml` não está sendo aplicado

Três suspeitos usuais:

1. **Nome de arquivo errado.** Deve ser `openspec/config.yaml`, e não `.yml`.
2. **YAML inválido.** Execute-o em qualquer validador YAML; o CLI também relata erros de sintaxe com números de linha.
3. **Você esperava uma reinicialização.** Você não precisa. As mudanças na configuração têm efeito imediato.

### "Unknown artifact ID in rules: X" (ID de artefato desconhecido em regras: X)

Uma chave sob `rules:` não corresponde a nenhum artefato no seu esquema. Para o esquema padrão `spec-driven`, os IDs válidos são `proposal`, `specs`, `design` e `tasks`. Para ver os IDs de qualquer esquema:

```bash
openspec schemas --json
```

### "Context too large" (Contexto muito grande)

O campo `context:` é limitado a 50KB, intencionalmente, porque ele é injetado em cada solicitação. Resuma-o ou forneça um link para documentação mais longa em vez de colá-los. Um contexto conciso também produz resultados melhores e mais rápidos.

### "Schema not found" (Esquema não encontrado)

O nome do esquema que você referenciou não existe. Liste o que está disponível e verifique a grafia:

```bash
openspec schemas                    # lista os esquemas disponíveis
openspec schema which <name>        # veja de onde um esquema é resolvido
openspec schema init <name>         # crie um personalizado
```

Consulte [Personalização](customization.md#custom-schemas).

## Migração do fluxo legado

### "Legacy files detected in non-interactive mode" (Arquivos legados detectados em modo não interativo)

Você está no CI ou em um shell não interativo, e o OpenSpec encontrou arquivos antigos para limpar, mas não consegue perguntar. Aproveite a aprovação automática:

```bash
openspec init --force
```

### Os comandos não apareceram após a migração

Reinicie seu IDE. As habilidades são detectadas na inicialização. Se eles ainda não aparecerem, execute `openspec update` e verifique os locais dos arquivos em [Ferramentas Suportadas](supported-tools.md).

### Meu antigo `project.md` não foi migrado

Isso é intencional. O OpenSpec nunca exclui `project.md` automaticamente porque ele pode conter contexto que você escreveu. Mova as partes úteis para a seção `context:` do `config.yaml`, e então exclua-o você mesmo. O [Guia de Migração](migration-guide.md#migrating-projectmd-to-configyaml) detalha isso, incluindo um prompt que você pode dar à sua IA para fazer o destilamento.

## Ainda travado?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **A partir do seu terminal:** `openspec feedback "o que deu errado"` abre um problema para você.

Ao relatar um problema, inclua sua versão do OpenSpec (`openspec --version`), sua versão do Node (`node --version`), sua ferramenta de IA e o comando exato e a saída. Isso torna a ajuda muito mais rápida.