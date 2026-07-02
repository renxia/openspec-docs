# Explore Primeiro

**`/opsx:explore` é seu parceiro de pensamento. Recorra a ele sempre que você tiver um problema, mas ainda não tiver um plano.** Ele investiga sua base de código, pesa as opções com você e esclarece o que você realmente quer, tudo isso antes que qualquer artefato ou linha de código seja criada. Quando o quadro estiver claro, ele passa para `/opsx:propose`.

Se você levar um hábito destes documentos, leve este: **quando não tiver certeza, explore antes de propor.**

É por isso que isso importa. Os assistentes de codificação IA estão ansiosos. Peça algo vagamente e eles construirão *algo* com confiança, mas talvez não seja a coisa que você precisava. Explore é a cura. É uma conversa sem riscos onde você e a IA descobrem o caminho certo juntos, para que quando você propor, esteja propondo a coisa certa.

## Quando explorar

Explorar é o primeiro passo correto mais frequentemente do que as pessoas esperam. Use-o quando qualquer um destes for verdadeiro:

- Você sabe o *problema*, mas não a *solução*. ("As páginas parecem lentas." "A autenticação está uma bagunça." "Continuamos recebendo pedidos duplicados.")
- Você está escolhendo entre abordagens e quer que os tradeoffs sejam detalhados em relação ao seu código real.
- Você é novo em uma base de código e precisa entender como algo funciona antes de alterá-lo.
- Os requisitos são vagos e você quer refiná-los antes de se comprometer.
- Você suspeita que o trabalho é maior ou menor do que parece e quer dimensioná-lo honestamente.

Pule o explore apenas quando você já sabe exatamente o que quer e como fazer. Nesse caso, vá direto para [`/opsx:propose`](commands.md#opsxpropose).

## O que ele faz (e não faz)

Explore é uma **conversa**, não um gerador.

**Ele faz:**
- Lê e pesquisa sua base de código para responder a perguntas reais.
- Compara opções e nomeia os tradeoffs de cada uma.
- Desenha diagramas para tornar o design legível.
- Ajuda você a refinar uma ideia vaga em um escopo concreto e construível.
- Transiciona para `/opsx:propose` quando você estiver pronto.

**Ele não faz:**
- Cria uma pasta de mudanças.
- Escreve quaisquer artefatos (nenhuma proposta, especificações, design ou tarefas).
- Escreve ou modifica código.

Esse é o ponto. Explorar não custa nada e não te compromete com nada. Você pode explorar três becos sem saída, aprender algo de cada um e só então propor o caminho que sobreviveu.

## Já está instalado

Boas notícias: `/opsx:explore` vem no perfil **core** padrão, ao lado de `propose`, `apply`, `sync` e `archive`. Você não precisa habilitar nada. Se o OpenSpec estiver configurado em seu projeto, explore estará pronto no chat da sua IA. (Assim como todos os comandos `/opsx:*`, você digita no chat do assistente, não no terminal. Veja [Como os Comandos Funcionam](how-commands-work.md).)

## Um exemplo completo

Assista como uma preocupação vaga se torna-se uma mudança nítida e construível.

```text
Você: /opsx:explore

IA: O que você gostaria de explorar?

Você: Nosso checkout às vezes cria pedidos duplicados. Eu não sei por quê
     e não sei como consertar isso com segurança.

IA: Deixe-me investigar o caminho do checkout...
     [lê o serviço de pedidos, o manipulador de webhook de pagamento e a
      lógica de envio do cliente]

     Aqui está o que encontrei. Existem duas maneiras de um duplicado acontecer:

     1. O cliente pode enviar duas vezes (clique duplo, tentativa em rede lenta).
        Nada faz debounce nisso.
     2. O webhook de pagamento pode disparar mais de uma vez, e o manipulador
        cria um pedido cada vez. Não há chave de idempotência.

     A causa #2 é a perigosa: ela pode cobrar e cumprir duas vezes.

     Três maneiras de corrigir, aproximadamente em ordem de robustez:
     - Chave de idempotência no endpoint de criação do pedido (lida com ambas as causas)
     - Dedup no webhook pelo ID da intenção de pagamento (lida apenas com #2)
     - Debounce no lado do cliente (lida apenas com #1, tapa o bug real)

     Dado que seu código já armazena o ID da intenção de pagamento, a
     abordagem da chave de idempotência é uma pequena mudança com o maior retorno.
     Quer que eu dimensionar isso?

Você: Sim, vamos fazer a chave de idempotência.

Você: /opsx:propose add-order-idempotency-key

IA: Criou openspec/changes/add-order-idempotency-key/, com uma proposta
     e um delta spec fundamentado no que acabamos de encontrar. Pronto para implementação.
```

Note o que aconteceu. O ponto de partida era "algo está errado e estou com medo de mexer nisso". Vinte segundos de exploração transformaram isso em uma causa raiz nomeada, três opções ranqueadas, uma recomendação ligada ao código existente e uma mudança precisa. A proposta que se segue é nítida porque o pensamento aconteceu primeiro.

## Passando para Propose

Explore não arquiva nada. Quando você estiver pronto, você simplesmente inicia uma mudança, e a IA carrega o contexto da sua conversa nos artefatos.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (pensar)     (concordar)       (construir)     (registrar)
```

Você pode dizer isso em linguagem simples ("vamos transformar isso em uma mudança") ou executar `/opsx:propose <nome>` diretamente. De qualquer forma, a exploração que você acabou de fazer se torna a fundação da proposta, não um bate-papo descartável.

Se você usar o conjunto de comandos expandido, explore pode passar para `/opsx:new` em vez disso, para criação de artefatos passo a passo. Veja [Workflows](workflows.md).

## Dicas para uma boa exploração

- **Traga o problema, não a solução.** "Os logins estão lentos" dá à IA espaço para investigar. "Adicionar um cache Redis" te compromete antecipadamente com uma resposta que você ainda não testou.
- **Peça os tradeoffs em voz alta.** "Quais são as desvantagens de cada opção?" garante uma comparação mais honesta.
- **Deixe a IA ler primeiro.** As melhores explorações começam com a IA realmente olhando para o seu código, e não adivinhando. Aponte a área relevante se isso ajudar.
- **É aceitável desistir.** Se a exploração revelar que a ideia não vale a pena, isso é uma vitória. Você aprendeu de forma barata.
- **Explore novamente no meio da mudança.** Preso durante `/opsx:apply`? Você pode voltar e explorar um subproblema, e depois retornar.

## Os tradeoffs honestos

**O que você ganha:** explore pega os erros no momento mais barato possível, antes que qualquer artefato exista. É especialmente poderoso em código desconhecido, onde a capacidade da IA de ler e resumir o sistema economiza uma tarde de escavação.

**O que custa:** um pouco de paciência. Explore é uma conversa, então é mais lento do que disparar `/opsx:propose` e torcer. Para trabalho que você já entende genuinamente, essa etapa extra é puro overhead, e você deve pular.

A regra geral: quanto mais vaga a tarefa, maior o retorno de explore. Quanto mais clara a tarefa, mais você pode pular direto para propor.

## Onde ir em seguida

- [Comandos: `/opsx:explore`](commands.md#opsxexplore): a referência precisa
- [Workflows](workflows.md): explore como parte do ciclo diário
- [Exemplos e Receitas](examples.md#recipe-3-exploring-before-you-commit): explore em um walkthrough completo
- [Primeiros Passos](getting-started.md): o guia para a primeira mudança, incluindo exploração