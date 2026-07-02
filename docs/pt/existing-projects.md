# Usando o OpenSpec em um Projeto Existente

**Você não documenta toda a base de código para começar. Você escreve specs apenas para aquilo que está prestes a mudar.** Este é o ponto mais importante ao adotar o OpenSpec em um projeto existente, e é por isso que o OpenSpec foi construído pensando no *brownfield* (ambiente legado).

Uma preocupação comum soa assim: "Meu aplicativo tem 80.000 linhas de código. Preciso escrever specs para tudo antes que o OpenSpec seja útil?" Não. Você odiaria isso, e nós também. O OpenSpec cresce seus specs uma mudança por vez. Sua primeira mudança documenta a fatia em que ela toca, a próxima mudança documenta a sua fatia, e ao longo de meses, seus specs se preenchem naturalmente ao redor do trabalho que você realmente faz.

Este guia mostra como começar no primeiro dia sem tentar "ferver o oceano".

## A Versão de Trinta Segundos

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

Seus specs agora descrevem exatamente a parte do sistema em que a mudança tocou, e nada mais. Isso está correto. Você parou de se preocupar com as outras 80.000 linhas.

## Por Que o Delta-First é o Segredo Principal

As mudanças do OpenSpec são escritas como **deltas**: `ADDED`, `MODIFIED`, `REMOVED`. Um delta descreve o que está mudando em relação ao comportamento atual, e não o sistema inteiro.

É exatamente isso que o trabalho *brownfield* exige. Você raramente está construindo a partir do zero. Você está adicionando um campo, corrigindo um redirecionamento, apertando um timeout. Um delta permite que você especifique essa mudança precisamente sem ter que escrever primeiro um spec de 40 páginas sobre tudo ao redor dela.

Portanto, seu diretório `openspec/specs/` não começa cheio e completo. Ele começa quase vazio e se acumula. Cada mudança arquivada mescla seu delta. O spec para `auth/` só se torna completo depois que você tiver feito várias mudanças de autenticação, o que é exatamente quando você quer que ele esteja completo.

Se você deseja os mecanismos mais profundos, consulte [Conceitos: Specs Delta](concepts.md#delta-specs).

## Sua Primeira Mudança em uma Base de Código Real

Escolha algo pequeno e real. Não um brinquedo, não uma reescrita. Uma mudança que você ia fazer esta semana de qualquer maneira. Pequenas mudanças iniciais ensinam o fluxo de trabalho com baixo risco.

**Passo 1: Deixe a IA ler a área relevante.** É aqui que `/opsx:explore` cumpre seu papel em uma base de código desconhecida ou grande. Aponte para a parte que você está prestes a tocar e deixe-a mapear como as coisas funcionam antes de propor qualquer coisa.

```text
Você: /opsx:explore

IA:  O que você gostaria de explorar?

Você: Preciso adicionar limitação de taxa (rate limiting) à nossa API pública, mas não tenho certeza
     de como os pedidos fluem atualmente através do middleware.

IA:  Deixe-me rastrear... [lê o roteador, a pilha de middleware e a configuração]
     Os pedidos chegam ao Express, passam pelo middleware de autenticação, depois para seus
     controladores. Não há uma camada de limitação de taxa hoje. O ponto de inserção mais limpo é um middleware logo após a autenticação. Quer que eu escopo isso?
```

Note que a IA agora entende sua estrutura real, então a proposta que ela escreve se encaixará no seu código, e não em um template genérico. Em uma base de código grande, esse único hábito economiza o maior sofrimento. Consulte [Explore Primeiro](explore.md).

**Passo 2: Proponha a mudança.** A proposta e seu spec delta capturam apenas essa mudança.

```text
Você: /opsx:propose add-api-rate-limiting
```

**Passo 3: Construa e arquive** com `/opsx:apply` e `/opsx:archive`, assim como qualquer outra mudança. Após o arquivamento, você terá um spec real para seu comportamento de limitação de taxa, nascido de uma mudança que você precisava fazer de qualquer maneira.

## Prefere um Tour Guiado? Use Onboard

Se você prefere assistir ao ciclo completo acontecer em seu próprio código com narração, o comando expandido `/opsx:onboard` faz exatamente isso: ele escaneia sua base de código em busca de uma melhoria pequena e segura, depois guia você através da proposta, construção e arquivamento dela, explicando cada passo.

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

## "Mas Eu Já Tenho Documentos de Requisitos"

Talvez você tenha um PRD, um SRS, um spec formal, até modelos TLA+. Tudo bem. Você não os importa por completo, e nem os joga fora.

Trate os documentos existentes como **material de origem para exploração**, e não como specs a serem convertidos. Quando você começar uma mudança, cole ou aponte a IA para a seção relevante e deixe-a moldar um delta OpenSpec focado a partir dela. O delta captura o comportamento que você está mudando agora, na forma de requisito e cenário testável do OpenSpec. Seus documentos originais permanecem onde estão como pano de fundo.

O motivo honesto: os specs do OpenSpec são deliberadamente focados no comportamento e limitados às mudanças. Um PRD de 40 páginas é um artefato diferente com uma função diferente. Forçar uma conversão em massa única tende a produzir um spec grande e obsoleto que ninguém confia. Deixar os specs crescer a partir de mudanças reais mantém sua precisão.

```text
Você: /opsx:explore
Você: Aqui está a seção do nosso PRD sobre checkout. Estou implementando o requisito
     "guest checkout" (checkout como convidado) em seguida.
     [cole o requisito relevante]
IA:  [lê, faz perguntas de esclarecimento e depois ajuda a escopar uma mudança]
Você: /opsx:propose add-guest-checkout
```

## Organizando Specs em uma Base de Código Grande

Os specs vivem sob `openspec/specs/`, agrupados por **domínio**: uma área lógica que corresponde à forma como sua equipe pensa sobre o sistema. Você não precisa projetar toda a taxonomia antecipadamente. Crie uma pasta de domínio quando sua primeira mudança nessa área precisar dela.

Formas comuns de fatiar domínios:

- **Por área de funcionalidade:** `auth/`, `payments/`, `search/`
- **Por componente:** `api/`, `frontend/`, `workers/`
- **Por contexto delimitado (bounded context):** `ordering/`, `fulfillment/`, `inventory/`

Escolha o que fizer um novato acenar com a cabeça. Você pode refinar mais tarde. Consulte [Conceitos: Specs](concepts.md#specs).

## Monorepos e Trabalho que Abrange Múltiplos Repositórios

Para um monorepo, o modelo mais simples é um diretório `openspec/` na raiz do repositório, com domínios que mapeiam para seus pacotes ou serviços. Isso cobre a maioria das equipes.

Se o seu trabalho realmente abrange **múltiplos repositórios** (ou vários pacotes que você trata como separados), o OpenSpec tem um recurso beta de **stores**: o planejamento vive em seu próprio repo autônomo que qualquer um dos seus repositórios de código pode referenciar, para que o plano não precise viver dentro da pasta `openspec/` de um repositório. É beta, então trate seus comandos e estado como evolutivos. Comece com o [Guia do Usuário Stores](stores-beta/user-guide.md) para o modelo mental e o caminho útil mais simples.

## Algumas Advertências Sinceras

- **Resista à tentação de preencher tudo.** Escrever specs para código que você não está mudando parece produtivo e geralmente não é. Esses specs ficam obsoletos, porque nada os força a acompanhar a realidade. Deixe as mudanças reais impulsionarem seus specs.
- **Mantenha as mudanças iniciais pequenas.** Suas primeiras mudanças são tanto sobre aprender o ritmo quanto sobre lançar. Um escopo apertado torna o ciclo rápido e as lições baratas.
- **Commit `openspec/` para git.** Seus specs e arquivos de arquivo pertencem ao controle de versão junto com o código que eles descrevem.
- **Dê contexto à IA.** Em uma base de código grande com convenções fortes, preencha o `context:` do `openspec/config.yaml` para que cada proposta respeite sua pilha e padrões. Consulte [Customização](customization.md#project-configuration).

## Próximos Passos

- [Explore Primeiro](explore.md) - o hábito chave para entender o código antes de mudá-lo
- [Getting Started](getting-started.md) - o guia completo da primeira mudança
- [Editing & Iterating on a Change](editing-changes.md) - ajustando uma mudança à medida que você aprende
- [Conceitos: Delta Specs](concepts.md#delta-specs) - por que os deltas tornam o trabalho brownfield limpo
- [Customization](customization.md) - ensine ao OpenSpec as convenções do seu projeto