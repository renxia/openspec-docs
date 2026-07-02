# Glossário

Todo termo do OpenSpec em um só lugar, definido em linguagem simples. Dê uma olhada rápida e o restante da documentação será lido mais rápido.

Os termos são agrupados por tópico e depois alfabetizados dentro de cada grupo.

## Os substantivos centrais

**Spec.** Um documento que descreve como parte do seu sistema se comporta. Specs residem em `openspec/specs/`, são organizadas por domínio e são compostas por requisitos e cenários. O spec é a resposta acordada para "o que este software faz?". Veja [Conceitos](concepts.md#specs).

**Source of truth.** O diretório `openspec/specs/` como um todo. Ele contém o comportamento atual e acordado do seu sistema. As mudanças propõem edições nele; o arquivamento as aplica.

**Change.** Uma unidade de trabalho, empacotada como uma pasta sob `openspec/changes/<name>/`. Uma change contém tudo sobre esse trabalho: sua proposta, design, tarefas e as edições do spec que ela introduz. Uma change, um recurso ou correção.

**Artifact.** Um documento dentro de uma change. Os artifacts padrão são a proposta, os delta specs, o design e as tarefas. Eles são criados em ordem de dependência e se alimentam uns dos outros.

**Delta spec.** Um spec dentro de uma change que descreve apenas o que está mudando, usando as seções `ADDED`, `MODIFIED` e `REMOVED`, em vez de reescrever o spec inteiro. É isso que permite ao OpenSpec editar sistemas existentes de forma limpa. Veja [Conceitos](concepts.md#delta-specs).

**Domain.** Um agrupamento lógico para specs, como `auth/`, `payments/` ou `ui/`. Você escolhe domínios que correspondam à forma como você pensa sobre o seu sistema.

## Dentro de um spec

**Requirement.** Um comportamento único que o sistema deve ter, geralmente escrito com uma palavra-chave RFC 2119: "O sistema DEVE expirar sessões após 30 minutos." Os requisitos declaram o *o quê*, não o *como*.

**Scenario.** Um exemplo concreto e testável de um requisito em ação, tipicamente no formato Given/When/Then. Cenários tornam um requisito verificável: você poderia escrever um teste automatizado a partir dele.

**RFC 2119 keywords.** As palavras MUST, SHALL, SHOULD e MAY, que carregam um significado padronizado sobre quão estrito é um requisito. MUST e SHALL são absolutos. SHOULD é recomendado com margem para exceções. MAY é opcional. O nome vem do documento de padrões da internet que os definiu.

## Os artifacts

**Proposal (`proposal.md`).** O *porquê* e o *o quê* de uma mudança: sua intenção, escopo e abordagem de alto nível. É o primeiro artifact que você cria.

**Design (`design.md`).** O *como*: abordagem técnica, decisões de arquitetura e os arquivos que você espera tocar. Opcional para mudanças simples.

**Tasks (`tasks.md`).** A checklist de implementação, com caixas de seleção. A IA a percorre durante `/opsx:apply` e marca os itens à medida que avança.

## O ciclo de vida

**Archive.** O ato de finalizar uma change. Seus delta specs são mesclados nos specs principais, e a pasta da change é movida para `openspec/changes/archive/YYYY-MM-DD-<name>/`. Após o arquivamento, seus specs descrevem a nova realidade. Veja [Conceitos](concepts.md#archive).

**Sync.** Mesclar os delta specs de uma change nos specs principais *sem* arquivar a change. Geralmente automático (o arquivo oferece para fazer isso), mas disponível por conta própria como `/opsx:sync` para mudanças de longa duração. Veja [Comandos](commands.md#opsxsync).

## Fluxo de trabalho e comandos

**OPSX.** O fluxo de trabalho padrão atual do OpenSpec, construído em torno de ações fluidas em vez de fases rígidas. Seus comandos slash começam todos com `/opsx:`. Veja [Fluxo de Trabalho OPSX](opsx.md).

**Slash command.** Um comando que você digita no chat do seu assistente de IA, como `/opsx:propose`. Os comandos slash impulsionam o fluxo de trabalho. Eles não são comandos de terminal. Veja [Como os Comandos Funcionam](how-commands-work.md).

**Explore (`/opsx:explore`).** O comando parceiro de pensamento. Ele lê sua base de código, compara opções e clarifica uma ideia vaga em um plano concreto, sem criar artifacts e sem escrever código. É o ponto de partida recomendado sempre que você tem um problema, mas ainda não um plano. Veja [Explore First](explore.md).

**CLI.** O programa `openspec` que você executa no seu terminal. Ele configura projetos, lista e valida mudanças, abre o dashboard e arquiva. A metade do terminal do OpenSpec. Veja [CLI](cli.md).

**Skill.** Uma pasta de instruções (`.../skills/openspec-*/SKILL.md`) que seu assistente de IA detecta e segue automaticamente. Skills são o padrão emergente entre ferramentas para entregar o fluxo de trabalho do OpenSpec ao seu assistente.

**Command file.** Um arquivo de comando slash por ferramenta (`.../commands/opsx-*`). O mecanismo de entrega mais antigo, ainda suportado junto com skills. Você raramente interage com eles diretamente.

**Profile.** O conjunto de comandos slash instalados no seu projeto. **Core** (o padrão) inclui `propose`, `explore`, `apply`, `sync`, `archive`. O conjunto **expanded** adiciona `new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`. Altere isso com `openspec config profile`.

**Delivery.** Se o OpenSpec instala skills, arquivos de comando ou ambos para suas ferramentas. Configurado globalmente e aplicado com `openspec update`.

## Personalização

**Schema.** A definição de quais artifacts um fluxo de trabalho possui e como eles dependem uns dos outros. O padrão embutido é `spec-driven` (proposal → specs → design → tasks). Você pode bifurcá-lo ou escrever o seu próprio. Veja [Personalização](customization.md#custom-schemas).

**Template.** Um arquivo Markdown dentro de um schema que molda o que a IA gera para um determinado artifact. Editar um template muda imediatamente a saída da IA, sem necessidade de reconstrução.

**Project config (`openspec/config.yaml`).** Configurações por projeto: o schema padrão, o `context:` injetado em cada solicitação de planejamento e as `rules:` por artifact. A maneira mais fácil de ensinar ao OpenSpec sobre seu stack e convenções. Veja [Personalização](customization.md#project-configuration).

**Context injection.** Colocar o histórico do projeto no campo `context:` do `config.yaml` para que ele seja adicionado automaticamente a cada artifact gerado pela IA. É mais confiável do que esperar que a IA leia um arquivo separado.

**Dependency graph.** O grafo direcionado formado pelos relacionamentos `requires:` dos artifacts. É um DAG (grafo acíclico dirigido: as setas apontam apenas para frente, nunca em um loop), e o OpenSpec usa isso para saber o que você pode criar em seguida.

**Enablers, not gates.** O princípio de que as dependências dos artifacts mostram o que se torna *possível* em seguida, não o que é *necessário* em seguida. Você pode revisitar e editar qualquer artifact a qualquer momento. Veja [Conceitos Centrais em um Olhar](overview.md#enablers-not-gates).

## Coordenação entre repositórios (beta)

Estes termos se aplicam apenas se o seu planejamento abranger mais de um repo. Eles estão em beta. A maioria dos usuários pode ignorá-los. Veja o [Guia do Usuário de Stores](stores-beta/user-guide.md).

**Store.** Um repo autônomo cuja função é planejar. Ele tem a mesma forma `openspec/` que você já conhece (specs e changes) mais um pequeno arquivo de identidade. Você o registra em sua máquina uma vez, pelo nome, e então qualquer comando OpenSpec pode funcionar nele de qualquer lugar.

**Reference.** Uma declaração, no `openspec/config.yaml` de um repo de código, de um store no qual esse repo se baseia. As referências são somente leitura: o repo mantém sua própria raiz, e o `openspec instructions` ganha um índice dos specs do store referenciado, cada um com o comando exato para buscá-lo.

**Working context.** O que `openspec context` monta para o repositório atual: seu root OpenSpec mais todos os stores que ele referencia, cada um com como obtê-lo. A resposta para "com o que estou trabalhando?".

**Workset.** Um conjunto pessoal de pastas localmente abertas (um store junto com os repositórios de código em que você trabalha). Criado explicitamente com `openspec workset create`; nada sobre esses caminhos locais é commitado no repo de planejamento compartilhado.

## Veja também

- [Conceitos Centrais em um Olhar](overview.md): as cinco ideias, em uma página
- [Conceitos](concepts.md): a explicação detalhada
- [Como os Comandos Funcionam](how-commands-work.md): comandos slash versus CLI