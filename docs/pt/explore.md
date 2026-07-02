# Explorar Primeiro

**`/opsx:explore` é o seu parceiro de pensamento. Recorra a ele sempre que tiver um problema, mas ainda não um plano.** Ele investiga sua base de código, avalia opções com você e esclarece o que você realmente quer, tudo isso antes que qualquer artefato ou linha de código seja criada. Quando o quadro estiver claro, ele passa para `/opsx:propose`.

Se você levar um hábito destes documentos, leve este: **quando não tiver certeza, explore antes de propor.**

É por isso que isso importa. Os assistentes de codificação IA estão ansiosos. Se você perguntar vagamente, eles construirão *algo* com confiança, mas talvez não seja o que você precisava. Explorar é a cura. É uma conversa sem riscos onde você e a IA descobrem juntos o movimento certo, para que quando você propor, esteja propondo a coisa certa.

## Quando explorar

Explorar é o primeiro passo correto mais frequentemente do que as pessoas esperam. Use-o quando qualquer um destes for verdadeiro:

- Você sabe o *problema*, mas não a *solução*. ("As páginas parecem lentas." "A autenticação está uma bagunça." "Continuamos recebendo pedidos duplicados.")
- Você está escolhendo entre abordagens e quer que os prós e contras sejam apresentados em relação ao seu código real.
- Você é novo em uma base de código e precisa entender como algo funciona antes de alterá-lo.
- Os requisitos são vagos e você quer refiná-los antes de se comprometer.
- Você suspeita que o trabalho é maior ou menor do que parece e quer dimensioná-lo honestamente.

Pule o explore apenas quando já souber exatamente o que quer e como fazer. Nesse caso, vá direto para [`/opsx:propose`](commands.md#opsxpropose).

## O que ele faz (e o que não faz)

Explorar é uma **conversa**, não um gerador.

**Ele faz:**
- Lê e pesquisa sua base de código para responder a perguntas reais.
- Compara opções e nomeia os prós e contras de cada uma.
- Desenha diagramas para tornar o design legível.
- Ajuda você a refinar uma ideia vaga em um escopo concreto e construível.
- Transiciona para `/opsx:propose` quando estiver pronto.

**Ele não faz:**
- Criar uma pasta de mudanças.
- Escrever quaisquer artefatos (nenhuma proposta, especificações, design ou tarefas).
- Escrever ou modificar código.

É esse o ponto. Explorar custa-lhe nada e compromete-o a nada. Você pode explorar três becos sem saída, aprender algo com cada um e só então propor o caminho que sobreviveu.

## Já está instalado

Boas notícias: `/opsx:explore` vem no perfil **core** padrão, ao lado de `propose`, `apply`, `sync` e `archive`. Você não precisa habilitar nada. Se o OpenSpec estiver configurado em seu projeto, explore estará pronto no seu chat com IA. (Assim como todos os comandos `/opsx:*`, você digita no chat do assistente, não no terminal. Veja [Como os Comandos Funcionam](how-commands-work.md).)

## Um exemplo completo

Veja como uma preocupação vaga se transforma em uma mudança nítida e construível.

```text
Você: /opsx:explore

IA: O que você gostaria de explorar?

Você: Nosso checkout às vezes cria pedidos duplicados. Eu não sei por quê
     e não sei como consertar isso com segurança.

IA: Deixe-me investigar o caminho do checkout...
     [lê o serviço de pedidos, o manipulador de webhook de pagamento e a
      lógica de envio do cliente]

     Aqui está o que encontrei. Existem duas maneiras de um duplicado acontecer:

     1. O cliente pode enviar duas vezes (clique duplo, tentar novamente em rede lenta).
        Nada disso é debounced.
     2. O webhook de pagamento pode disparar mais de uma vez, e o manipulador
        cria um pedido a cada vez. Não há chave de idempotência.

     A Causa #2 é a perigosa: ela pode cobrar e cumprir duas vezes.

     Três maneiras de consertar, aproximadamente em ordem de robustez:
     - Chave de idempotência no endpoint de criação do pedido (resolve ambas as causas)
     - Dedup no webhook usando o id da intenção de pagamento (resolve apenas #2)
     - Debounce no lado do cliente (resolve apenas #1, é uma solução paliativa)

     Dado que seu código já armazena o id da intenção de pagamento, a
     abordagem com chave de idempotência é uma pequena mudança com o maior retorno.
     Quer que eu dimensionar isso?

Você: Sim, vamos fazer a chave de idempotência.

Você: /opsx:propose add-order-idempotency-key

IA: Criado openspec/changes/add-order-idempotency-key/, com uma proposta
     e especificação delta fundamentadas no que acabamos de encontrar. Pronto para implementação.
```

Note o que aconteceu. O ponto de partida era "algo está errado e estou com medo de mexer nisso." Vinte segundos de exploração transformaram isso em uma causa raiz nomeada, três opções classificadas, uma recomendação ligada ao código existente e uma mudança precisa. A proposta que se segue é nítida porque o pensamento aconteceu primeiro.

## Passando para Propor

Explorar não arquiva nada. Quando estiver pronto, você simplesmente inicia uma mudança, e a IA carrega o contexto da sua conversa nos artefatos.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (pensar)     (concordar)       (construir)     (registrar)
```

Você pode dizer isso em linguagem simples ("vamos transformar isso em uma mudança") ou executar `/opsx:propose <nome>` diretamente. De qualquer maneira, a exploração que você acabou de fazer se torna a base da proposta, e não um bate-papo descartável.

Se você usar o conjunto de comandos expandido, explore pode passar para `/opsx:new` em vez disso, para criação de artefatos passo a passo. Veja [Fluxos de Trabalho](workflows.md).

## Dicas para uma boa exploração

- **Traga o problema, não a solução.** "Os logins estão lentos" dá à IA espaço para investigar. "Adicionar um cache Redis" compromete você antecipadamente com uma resposta que ainda não testou.
- **Peça os prós e contras em voz alta.** "Quais são as desvantagens de cada opção?" garante uma comparação mais honesta.
- **Deixe-a ler primeiro.** As melhores explorações começam com a IA realmente olhando seu código, e não adivinhando. Aponte para a área relevante se isso ajudar.
- **É permitido desistir.** Se a exploração revelar que a ideia não vale a pena, isso é uma vitória. Você aprendeu de forma barata.
- **Explore novamente no meio da mudança.** Preso durante `/opsx:apply`? Você pode voltar e explorar um subproblema, e depois retornar.

## Os prós e contras honestos

**O que você ganha:** explore pega os erros no momento mais barato possível, antes de qualquer artefato existir. É especialmente poderoso em códigos desconhecidos, onde a capacidade da IA de ler e resumir o sistema economiza uma tarde de escavação.

**O que custa:** um pouco de paciência. Explorar é uma conversa, então é mais lento do que disparar `/opsx:propose` e torcer. Para trabalho que você já entende genuinamente, essa etapa extra é puro *overhead*, e você deve pular.

A regra geral é: quanto mais vaga a tarefa, maior o retorno de explorar. Quanto mais clara a tarefa, mais você pode ir direto para propor.

## Onde ir em seguida

- [Comandos: `/opsx:explore`](commands.md#opsxexplore): a referência precisa
- [Fluxos de Trabalho](workflows.md): explore como parte do ciclo diário
- [Exemplos e Receitas](examples.md#recipe-3-exploring-before-you-commit): explore em um walkthrough completo
- [Primeiros Passos](getting-started.md): o guia para a primeira mudança, incluindo exploração