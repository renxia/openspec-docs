# Glossário

Todo termo do OpenSpec em um só lugar, definido em linguagem simples. Dê uma olhada e o restante da documentação será lido mais rápido.

Os termos são agrupados por tópico e depois alfabetizados dentro de cada grupo.

## Os substantivos centrais

**Spec.** Um documento que descreve como uma parte do seu sistema se comporta. Os specs vivem em `openspec/specs/`, são organizados por domínio e são compostos por requisitos e cenários. O spec é a resposta acordada para "o que este software faz?". Veja [Conceitos](concepts.md#specs).

**Source of truth.** O diretório `openspec/specs/` como um todo. Ele contém o comportamento atual e acordado do seu sistema. As mudanças propõem edições nele; o arquivamento as aplica.

**Change.** Uma unidade de trabalho, empacotada como uma pasta sob `openspec/changes/<name>/`. Um change contém tudo sobre esse trabalho: sua proposta, design, tarefas e as edições do spec que ele introduz. Um change, um recurso ou correção.

**Artifact.** Um documento dentro de um change. Os artefatos padrão são a proposta, os delta specs, o design e as tarefas. Eles são criados em ordem de dependência e alimentam uns aos outros.

**Delta spec.** Um spec dentro de um change que descreve apenas o que está mudando, usando as seções `ADDED`, `MODIFIED` e `REMOVED`, em vez de reescrever o spec inteiro. É isso que permite ao OpenSpec editar sistemas existentes de forma limpa. Veja [Conceitos](concepts.md#delta-specs).

**Domain.** Um agrupamento lógico para specs, como `auth/`, `payments/` ou `ui/`. Você escolhe domínios que correspondam à forma como você pensa sobre o seu sistema.

## Dentro de um spec

**Requirement.** Um comportamento único que o sistema deve ter, geralmente escrito com uma palavra-chave do RFC 2119: "O sistema SHALL expirar sessões após 30 minutos.". Os requisitos declaram o *o quê*, não o *como*.

**Scenario.** Um exemplo concreto e testável de um requisito em ação, tipicamente no formato Dado/Quando/Então (Given/When/Then). Os cenários tornam um requisito verificável: você poderia escrever um teste automatizado a partir dele.

**RFC 2119 keywords.** As palavras MUST, SHALL, SHOULD e MAY, que carregam um significado padronizado sobre o quão rigoroso é um requisito. MUST e SHALL são absolutos. SHOULD é recomendado com margem para exceções. MAY é opcional. O nome vem do documento padrão da internet que os definiu.

## Os artefatos

**Proposal (`proposal.md`).** O *porquê* e o *o quê* de uma mudança: sua intenção, escopo e abordagem de alto nível. É o primeiro artefato que você cria.

**Design (`design.md`).** O *como*: a abordagem técnica, as decisões de arquitetura e os arquivos que você espera tocar. É opcional para mudanças simples.

**Tasks (`tasks.md`).** A lista de verificação da implementação, com caixas de seleção. A IA trabalha através dela durante `/opsx:apply` e marca os itens à medida que avança.

## O ciclo de vida

**Archive.** O ato de finalizar uma mudança. Seus delta specs são mesclados nos specs principais, e a pasta da mudança move para `openspec/changes/archive/YYYY-MM-DD-<name>/`. Após o arquivamento, seus specs descrevem a nova realidade. Veja [Conceitos](concepts.md#archive).

**Sync.** Mesclar os delta specs de uma mudança nos specs principais *sem* arquivar a mudança. Geralmente automático (o arquivo oferece para fazer isso), mas disponível por si só como `/opsx:sync` para mudanças de longa duração. Veja [Comandos](commands.md#opsxsync).

## Fluxo de trabalho e comandos

**OPSX.** O fluxo de trabalho padrão atual do OpenSpec, construído em torno de ações fluidas em vez de fases rígidas. Seus comandos de barra (slash) começam todos com `/opsx:`. Veja [Fluxo de Trabalho OPSX](opsx.md).

**Slash command.** Um comando que você digita no chat do seu assistente de IA, como `/opsx:propose`. Os comandos de barra impulsionam o fluxo de trabalho. Eles não são comandos de terminal. Veja [Como os Comandos Funcionam](how-commands-work.md).

**Explore (`/opsx:explore`).** O comando parceiro de pensamento. Ele lê sua base de código, compara opções e clarifica uma ideia vaga em um plano concreto, sem criar artefatos e sem escrever código. É o ponto de partida recomendado sempre que você tem um problema, mas ainda não um plano. Veja [Explore Primeiro](explore.md).

**CLI.** O programa `openspec` que você executa no seu terminal. Ele configura projetos, lista e valida mudanças, abre o painel e arquiva. É a metade do terminal do OpenSpec. Veja [CLI](cli.md).

**Skill.** Uma pasta de instruções (`.../skills/openspec-*/SKILL.md`) que o seu assistente de IA detecta e segue automaticamente. As Skills são o padrão emergente entre ferramentas para entregar o fluxo de trabalho do OpenSpec ao seu assistente.

**Command file.** Um arquivo de comando de barra por ferramenta (`.../commands/opsx-*`). O mecanismo de entrega mais antigo, ainda suportado junto com as skills. Você raramente os toca diretamente.

**Profile.** O conjunto de comandos de barra instalados no seu projeto. **Core** (o padrão) inclui `propose`, `explore`, `apply`, `sync`, `archive`. O conjunto **expanded** adiciona `new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`. Altere-o com `openspec config profile`.

**Delivery.** Se o OpenSpec instala skills, arquivos de comando ou ambos para suas ferramentas. Configurável globalmente e aplicado com `openspec update`.

## Customização

**Schema.** A definição de quais artefatos um fluxo de trabalho possui e como eles dependem uns dos outros. O padrão embutido é `spec-driven` (proposal → specs → design → tasks). Você pode fazer um fork ou escrever o seu próprio. Veja [Customização](customization.md#custom-schemas).

**Template.** Um arquivo Markdown dentro de um schema que molda o que a IA gera para um determinado artefato. Editar um template muda imediatamente a saída da IA, sem necessidade de reconstrução.

**Project config (`openspec/config.yaml`).** Configurações por projeto: o schema padrão, o `context:` injetado em cada solicitação de planejamento e as `rules:` por artefato. A maneira mais fácil de ensinar ao OpenSpec sobre sua stack e convenções. Veja [Configuração do Projeto](customization.md#project-configuration).

**Context injection.** Colocar o histórico do projeto no campo `context:` do `config.yaml` para que ele seja automaticamente adicionado a cada artefato gerado pela IA. É mais confiável do que esperar que a IA leia um arquivo separado.

**Dependency graph.** O grafo direcionado formado pelas relações `requires:` dos artefatos. É um DAG (grafo acíclico dirigido: as setas apontam apenas para frente, nunca em um loop), e o OpenSpec usa isso para saber o que você pode criar em seguida.

**Enablers, not gates.** O princípio de que as dependências dos artefatos mostram o que se torna *possível* em seguida, e não o que é *necessário* em seguida. Você pode revisitar e editar qualquer artefato a qualquer momento. Veja [Conceitos Principais à Vista](overview.md#enablers-not-gates).

## Coordenação entre repositórios (beta)

Estes termos se aplicam apenas se o seu planejamento abranger mais de um repositório. Eles estão em beta. A maioria dos usuários pode ignorá-los. Consulte o [Guia do Usuário de Stores](stores-beta/user-guide.md).

**Store.** Um repositório autônomo cujo trabalho é planejar. Ele tem o mesmo formato `openspec/` que você já conhece (specs e changes) mais um pequeno arquivo de identidade. Você o registra em sua máquina uma vez, pelo nome, e então qualquer comando do OpenSpec pode funcionar nele de qualquer lugar.

**Reference.** Uma declaração, em um `openspec/config.yaml` de um repositório de código, de um store no qual o repositório se baseia. As referências são somente leitura: o repositório mantém sua própria raiz, e as instruções do `openspec` ganham um índice dos specs do store referenciado, cada um com o comando exato para buscá-lo.

**Working context.** O que o `openspec context` monta para o repositório atual: sua raiz OpenSpec mais cada store que ele referencia, cada um com como buscá-lo. A resposta para "com o que estou trabalhando?".

**Workset.** Um conjunto pessoal de pastas locais na máquina que você abre junto (um store ao lado dos repositórios de código em que trabalha). Criado explicitamente com `openspec workset create`; nada sobre esses caminhos locais é commitado no repositório compartilhado de planejamento.

## Ver também

- [Conceitos Principais à Vista](overview.md): as cinco ideias, em uma página
- [Conceitos](concepts.md): a explicação detalhada
- [Como os Comandos Funcionam](how-commands-work.md): comandos de barra versus o CLI