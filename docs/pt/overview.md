# Conceitos Centrais no Resumo

**OpenSpec é uma camada leve de acordo entre você e sua IA.** Você descreve o que uma mudança deve fazer, a IA elabora os detalhes, ambos analisam o mesmo plano e só então o código é escrito. Esta página é o modelo mental completo em uma tela. Quando você quiser a versão longa, [Concepts](concepts.md) tem.

Aqui está toda a ideia em cinco palavras: **acordar primeiro, construir com confiança depois.**

## As cinco ideias

Tudo no OpenSpec é construído a partir de cinco conceitos. Aprenda-os e o restante será detalhe.

**1. Specs são a verdade.** Uma spec descreve como seu sistema se comporta *agora*. Ela vive em `openspec/specs/`, organizada por domínio (`auth/`, `payments/`, `ui/`). As specs são compostas de requisitos ("o sistema DEVE expirar sessões após 30 minutos") e cenários (exemplos concretos de dado/quando/então). Pense nas specs como a resposta única acordada para "o que este software faz?".

**2. Uma mudança é uma unidade de trabalho.** Quando você deseja adicionar, modificar ou remover um comportamento, você cria uma mudança: uma pasta em `openspec/changes/` contendo tudo sobre esse trabalho em um só lugar. Uma proposta, um design, uma lista de tarefas e as edições da spec. Uma mudança, uma pasta, um recurso.

**3. Delta specs descrevem o que está mudando, não o mundo inteiro.** Dentro de uma mudança, você não reescreve a especificação inteira. Você escreve um pequeno delta: `ADDED` este requisito, `MODIFIED` aquele, `REMOVED` este outro. Este é o truque que torna o OpenSpec bom em editar sistemas existentes, e não apenas os novos (green-field). Você descreve o diff, não o destino.

**4. Artefatos são construídos um sobre o outro.** Uma mudança contém alguns documentos, criados em uma ordem natural, cada um alimentando o próximo:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   porquê    o quê       como      passos     fazer
```

Você pode revisitar qualquer um deles a qualquer momento. Eles são facilitadores, não barreiras. (Mais sobre isso abaixo.)

**5. Arquivamento insere a mudança na verdade.** Quando o trabalho está feito, você arquiva a mudança. Suas delta specs são mescladas nas suas specs principais, e a pasta da mudança move-se para `changes/archive/` com um carimbo de data. Agora suas specs descrevem a nova realidade, e você está pronto para a próxima mudança. O ciclo se fecha.

## A imagem

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ fonte da verdade │  merge  │ uma pasta por mudança    │    │
│   │ como as coisas funcionam │  em     │ proposta · design ·      │    │
│   │ hoje            │ arquivo │ tarefas · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Duas pastas. `specs/` é o que é verdade. `changes/` é o que você está propondo. O arquivamento move uma proposta para a verdade.

## O loop que você realmente vai rodar

Na configuração padrão, seu dia se parece com isto. Opicionalmente pense nisso primeiro; então um comando elabora o plano, você lê e ajusta o plano, o próximo constrói, e o último arquiva os arquivos.

```text
/opsx:explore                   →  (opcional) pensar com a IA primeiro
/opsx:propose add-dark-mode     →  AI elabora proposta, specs, design, tarefas
        (você lê e ajusta o plano)
/opsx:apply                     →  AI constrói, marcando as tarefas
/opsx:archive                   →  specs atualizadas, mudança arquivada
```

**Na dúvida, comece explorando.** `/opsx:explore` é um parceiro de pensamento sem riscos: ele lê seu código, expõe opções e transforma uma ideia vaga em um plano concreto antes que qualquer artefato exista. É o melhor antídoto para uma IA que, caso contrário, construiria *algo* a partir de um prompt vago. Já sabe exatamente o que quer? Pule direto para `/opsx:propose`. De qualquer forma, explorar está no perfil padrão, então ele sempre estará lá. Veja o [Guia de Exploração](explore.md).

Estes são comandos slash, digitados no chat do seu assistente de IA. A configuração (`openspec init`) acontece no seu terminal. Se essa divisão é nova para você, leia primeiro [Como os Comandos Funcionam](how-commands-work.md); este é o ponto de confusão mais comum.

## "Habilitadores, não portões"

Esta frase aparece em todos os lugares do OpenSpec, então aqui está o que ela significa em termos simples.

Os processos de spec tradicionais são cascata: termine o planejamento, *só ENTÃO* você é permitido implementar, e voltar atrás é doloroso. O OpenSpec recusa isso. A ordem `proposal → specs → design → tasks` mostra o que se torna *possível* a seguir, não o que você é *forçado* a fazer em seguida.

Descobre durante a implementação que o design estava errado? Edite `design.md` e continue. Percebeu que o escopo deveria diminuir? Atualize a proposta. Nada trava. As dependências existem apenas para que a IA tenha o contexto de que precisa (você não pode escrever boas tarefas sem specs para baseá-las), e não para te prender.

A força aqui é a honestidade: o trabalho real é bagunçado e iterativo, e o OpenSpec permite isso. O tradeoff é a disciplina: como nada o força a avançar, cabe a você manter uma mudança focada em vez de deixá-la se espalhar. O guia [Workflows](workflows.md) tem bons hábitos para isso.

## Por que isso vale o pequeno esforço extra

A verdade nua e crua: OpenSpec adiciona um passo. Você escreve um plano curto antes de construir. Então, o que você ganha com isso?

- **Você pega os erros antes que eles custem caro.** Corrigir um mal-entendido em uma proposta de parágrafo é grátis. Corrigi-lo depois que a IA escreveu 400 linhas não é.
- **O plano e o código ficam no mesmo repositório.** Seis meses depois, a spec diz a você (e à próxima sessão da IA) por que o sistema funciona da maneira que funciona.
- **As mudanças são revisáveis.** Uma pasta de mudança é um pacote organizado: leia a proposta, passe pelos deltas, verifique as tarefas. Sem arqueologia na história do chat.
- **Ele se encaixa em bases de código existentes.** Deltas significam que você pode especificar uma mudança para um aplicativo de 50.000 linhas sem primeiro documentar tudo.

E o honesto tradeoff: para uma correção verdadeiramente trivial de uma linha, a cerimônia pode não compensar, e isso é normal. OpenSpec foi projetado para ser leve, mas não é gratuito. Use-o onde o acordo importa, o que se revela ser a maior parte do tempo depois que você está trabalhando com uma IA que construirá com confiança qualquer coisa que você vagamente pediu.

## Para onde ir em seguida

- Novo por aqui? [Getting Started](getting-started.md) guia a primeira mudança na íntegra.
- Não tem certeza do que construir ainda? [Explore First](explore.md) é o lugar para começar.
- Confuso sobre onde os comandos são executados? [How Commands Work](how-commands-work.md).
- Quer a versão profunda de tudo acima? [Concepts](concepts.md).
- Aprender por exemplo? [Examples & Recipes](examples.md).
- Precisa de um termo definido? [Glossary](glossary.md).