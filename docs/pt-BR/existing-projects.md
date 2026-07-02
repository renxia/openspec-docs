# Usando o OpenSpec em um Projeto Existente

**Você não documenta todo o código-base para começar. Você escreve especificações apenas para aquilo que está prestes a mudar.** Este é o ponto mais importante ao adotar o OpenSpec em um projeto existente, e é por isso que o OpenSpec foi construído pensando no cenário "brownfield" (em projetos existentes).

Uma preocupação comum soa assim: "Meu aplicativo tem 80.000 linhas de código. Preciso escrever especificações para tudo antes que o OpenSpec seja útil?" Não. Você odiaria isso, e nós também. O OpenSpec cresce suas especificações uma mudança por vez. Sua primeira mudança documenta a fatia do sistema em que ela toca; a próxima mudança documenta sua fatia, e ao longo de meses, suas especificações se preenchem naturalmente em torno do trabalho que você realmente realiza.

Este guia mostra como começar no primeiro dia sem tentar "cozinhar o oceano" (tentar fazer tudo de uma vez).

## A versão de trinta segundos

```bash
$ cd your-existing-project
$ openspec init          # adiciona openspec/ e os comandos da sua ferramenta de IA
```

Em seguida, no seu chat de IA:

```text
/opsx:explore            # opcional: peça à IA para ler a área que você irá tocar
/opsx:propose <uma mudança real e pequena que você realmente precisa>
/opsx:apply
/opsx:archive
```

Suas especificações agora descrevem exatamente a parte do sistema em que a mudança tocou, e nada mais. Isso está correto. Você parou de se preocupar com as outras 80.000 linhas.

## Por que o delta-first é o truque principal

As mudanças do OpenSpec são escritas como **deltas**: `ADDED`, `MODIFIED`, `REMOVED`. Um delta descreve o que está mudando em relação ao comportamento atual, e não o sistema inteiro.

É exatamente isso que o trabalho "brownfield" exige. Você raramente está construindo do zero. Você está adicionando um campo, corrigindo um redirecionamento, apertando um timeout. Um delta permite que você especifique essa mudança de forma precisa sem precisar escrever primeiro uma especificação de 40 páginas sobre tudo ao redor dela.

Portanto, seu diretório `openspec/specs/` não começa cheio e completo. Ele começa quase vazio e acumula. Cada mudança arquivada incorpora seu delta. A especificação para `auth/` só se torna completa depois que você tiver feito várias mudanças de autenticação, que é exatamente quando você quer que ela esteja completa.

Se você deseja as mecânicas mais profundas, consulte [Conceitos: Especificações Delta](concepts.md#delta-specs).

## Sua primeira mudança em um código-base real

Escolha algo pequeno e real. Não um brinquedo, nem uma reescrita. Uma mudança que você ia fazer esta semana de qualquer maneira. Mudanças iniciais pequenas ensinam o fluxo de trabalho com baixas expectativas.

**Passo 1: Deixe a IA ler a área relevante.** É aqui que `/opsx:explore` cumpre seu papel em um código-base grande ou desconhecido. Aponte para a parte que você está prestes a tocar e deixe-a mapear como as coisas funcionam antes de propor qualquer coisa.

```text
Você: /opsx:explore

IA:  O que você gostaria de explorar?

Você: Preciso adicionar limitação de taxa (rate limiting) à nossa API pública, mas não tenho certeza de como os pedidos fluem atualmente através do middleware.

IA:  Deixe-me rastrear... [lê o roteador, a pilha de middleware e a configuração]
     Os pedidos chegam ao Express, passam pelo middleware de autenticação e depois pelos seus controladores. Não há camada de limitação de taxa hoje. O ponto de inserção mais limpo é um middleware logo após a autenticação. Quer que eu escopo isso?
```

Note que a IA agora entende sua estrutura real, então a proposta que ela escreve se encaixará no seu código, e não em um modelo genérico. Em um código-base grande, este único hábito salva o maior sofrimento. Consulte [Explore Primeiro](explore.md).

**Passo 2: Proponha a mudança.** A proposta e sua especificação delta capturam apenas essa mudança.

```text
Você: /opsx:propose add-api-rate-limiting
```

**Passo 3: Construa e arquive** com `/opsx:apply` e `/opsx:archive`, assim como qualquer outra mudança. Após o arquivamento, você terá uma especificação real para o comportamento de limitação de taxa, nascida de uma mudança que você precisava fazer de qualquer maneira.

## Prefere um tour guiado? Use onboard

Se você prefere assistir ao ciclo inteiro acontecer no seu próprio código com narração, o comando expandido `/opsx:onboard` faz exatamente isso: ele escaneia seu código-base em busca de uma melhoria pequena e segura, e depois guia você através da proposta, construção e arquivamento dela, explicando cada etapa.

Ative os comandos expandidos primeiro:

```bash
$ openspec config profile      # selecione os fluxos de trabalho expandidos
$ openspec update              # aplique-os a este projeto
```

Em seguida no chat:

```text
/opsx:onboard
```

É a introdução mais gentil possível em um projeto real, e ele deixa você com uma mudança genuína (pequena) que pode manter ou descartar. Consulte [Comandos: `/opsx:onboard`](commands.md#opsxonboard).

## "Mas eu já tenho documentos de requisitos"

Talvez você tenha um PRD, um SRS, uma especificação formal, até modelos TLA+. Ótimo. Você não os importa por completo, e nem os joga fora.

Trate a documentação existente como **material de origem para exploração**, e não como especificações para conversão. Quando você iniciar uma mudança, cole ou aponte a IA para a seção relevante e deixe-a moldar um delta OpenSpec focado a partir dela. O delta captura o comportamento que você está mudando agora, na forma testável de requisito e cenário do OpenSpec. Seus documentos originais permanecem onde estão como pano de fundo.

A razão honesta: as especificações do OpenSpec são deliberadamente focadas no comportamento e limitadas às mudanças. Um PRD de 40 páginas é um artefato diferente com uma função diferente. Forçar uma conversão em massa única tende a produzir uma especificação grande e obsoleta que ninguém confia. Permitir que as especificações cresçam a partir de mudanças reais mantém sua precisão.

```text
Você: /opsx:explore
Você: Aqui está a seção do nosso PRD sobre checkout. Estou implementando o requisito "guest checkout" (checkout como convidado) em seguida.
     [cola o requisito relevante]
IA:  [lê, faz perguntas de esclarecimento e depois ajuda a escopar uma mudança]
Você: /opsx:propose add-guest-checkout
```

## Organizando especificações em um código-base grande

As especificações vivem sob `openspec/specs/`, agrupadas por **domínio**: uma área lógica que corresponde à forma como sua equipe pensa sobre o sistema. Você não precisa projetar toda a taxonomia de antemão. Crie uma pasta de domínio quando sua primeira mudança nessa área precisar dela.

Formas comuns de dividir domínios:

- **Por área de funcionalidade:** `auth/`, `payments/`, `search/`
- **Por componente:** `api/`, `frontend/`, `workers/`
- **Por contexto delimitado (bounded context):** `ordering/`, `fulfillment/`, `inventory/`

Escolha o que fizer sentido para um novato. Você pode refinar mais tarde. Consulte [Conceitos: Especificações](concepts.md#specs).

## Monorepos e trabalho que abrange repositórios

Para um monorepo, o modelo mais simples é um diretório `openspec/` na raiz do repositório, com domínios que mapeiam para seus pacotes ou serviços. Isso cobre a maioria das equipes.

Seu trabalho realmente abrange **múltiplos repositórios** (ou vários pacotes que você trata como separados), o OpenSpec tem um recurso beta de **stores**: o planejamento vive em seu próprio repo autônomo que qualquer um dos seus repositórios de código pode referenciar, para que o plano não precise viver dentro da pasta `openspec/` de um repositório. É beta, então trate seus comandos e estado como evoluindo. Comece com o [Guia do Usuário Stores](stores-beta/user-guide.md) para o modelo mental e o caminho útil mais simples.

## Algumas cautelas honestas

- **Resista à tentação de preencher tudo retroativamente.** Escrever especificações para código que você não está mudando parece produtivo, mas geralmente não é. Essas especificações ficam obsoletas porque nada as força a acompanhar a realidade. Deixe as mudanças reais impulsionarem suas especificações.
- **Mantenha as mudanças iniciais pequenas.** Suas primeiras mudanças são tanto sobre aprender o ritmo quanto sobre entregar. Um escopo apertado torna o ciclo rápido e as lições baratas.
- **Commit `openspec/` para git.** Suas especificações e arquivo pertencem ao controle de versão junto com o código que eles descrevem.
- **Dê contexto à IA.** Em um código-base grande com convenções fortes, preencha o `context:` do `openspec/config.yaml` para que cada proposta respeite sua pilha e padrões. Consulte [Customização](customization.md#project-configuration).

## Para onde ir em seguida

- [Explore Primeiro](explore.md) - o hábito chave para entender o código antes de mudá-lo
- [Primeiros Passos](getting-started.md) - o guia completo da primeira mudança
- [Editando e Iterando uma Mudança](editing-changes.md) - ajustando uma mudança enquanto você aprende
- [Conceitos: Especificações Delta](concepts.md#delta-specs) - por que os deltas tornam o trabalho brownfield limpo
- [Customização](customization.md) - ensine ao OpenSpec as convenções do seu projeto