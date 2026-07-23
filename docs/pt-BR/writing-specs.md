# Escrevendo Boas Especificações

Você raramente escreve uma especificação do zero. Você descreve uma alteração em linguagem simples, o `/opsx:propose` rascunha os requisitos e cenários, e depois você os aprimora. Esta página trata dessa última parte — o que caracteriza uma boa especificação e como direcionar a IA para alcançá-la. Ela é o complemento de [Revisando uma Alteração](reviewing-changes.md): revisar é identificar os pontos fracos de um rascunho, escrever é saber do que é feita uma especificação forte.

## Uma especificação descreve comportamento, não código

Uma especificação descreve o que o seu sistema *faz*, em termos que qualquer pessoa pode verificar — não como ele é construído. Ela é composta por **requisitos** (declarações de comportamento) e **cenários** (exemplos concretos que os comprovam).

```markdown
### Requirement: Session Timeout
The system SHALL expire a session after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass with no activity
- THEN the session is invalidated and the user must re-authenticate
```

Mantenha o *como* — a fila, a biblioteca, o esquema da tabela — no arquivo `design.md` ou no código. Quando comportamento e implementação são misturados em um mesmo requisito, o requisito deixa de ser testável e começa a ficar desatualizado no momento em que o código é alterado.

## O que caracteriza um requisito de qualidade

Um requisito de qualidade descreve um único comportamento, formulado de forma tão clara que você poderia entregá-lo a outra pessoa para testar.

- **Uma declaração, um `SHALL`/`MUST`.** Se um requisito tiver três cláusulas de "e também", na verdade são três requisitos. Separe-os.
- **Observável.** Alguém de fora do time de desenvolvimento deve ser capaz de dizer se ele é cumprido. "O sistema SHALL exibir um banner de erro quando o upload exceder 10 MB" é observável. "O sistema SHALL lidar com uploads grandes de forma elegante" não é.
- **A intensidade correta.** O OpenSpec usa as palavras-chave do RFC 2119, e elas têm significados diferentes:

  | Palavra-chave | Significado |
  |---------|---------|
  | `MUST` / `SHALL` | Um requisito obrigatório. Não negociável. |
  | `SHOULD` | Uma recomendação forte, com espaço para exceções justificadas. |
  | `MAY` | Genuinamente opcional. |

  Use `MUST`/`SHALL` por padrão. Use `SHOULD` apenas quando você realmente quiser dizer "a menos que haja um bom motivo para não o fazer."

O teste para um requisito é: *um testador que nunca viu o código seria capaz de dizer se ele foi cumprido?* Se não, ele precisa ser refinado.

## O que caracteriza um cenário de qualidade

Os cenários são onde um requisito demonstra seu valor. Cada um é um GIVEN / WHEN / THEN concreto que pode se tornar um teste automatizado.

- **Ele exercita seu requisito.** Um cenário que apenas reformula o requisito com outras palavras não testa nada. Torne-o uma situação específica com um resultado específico.
- **Cubra os casos que importam, não apenas o caminho feliz.** O login válido é fácil. A entrada vazia, o token expirado, o segundo clique, o que dá errado — é aí que os bugs residem, e onde um cenário vale mais a pena.
- **Nomeie o caso no título.** "Cenário: Rejeita um token expirado" informa a um revisor o que está coberto de relance; "Cenário: Teste 2" não informa.

Um hábito útil: antes de aprovar, pergunte *qual é o único caso que eu ficaria chateado de ver quebrado?* — e certifique-se de que um cenário o nomeia.

## Escolha o tipo de delta correto

Uma alteração descreve suas edições nas especificações com três tipos de seção. Usar o tipo correto mantém suas especificações arquivadas consistentes:

- **`## ADDED Requirements`** — comportamento totalmente novo que não existia antes.
- **`## MODIFIED Requirements`** — comportamento que já existia e está sendo alterado. Inclua a versão nova completa; uma nota curta sobre o que mudou ajuda o revisor.
- **`## REMOVED Requirements`** — comportamento que está sendo removido, com uma linha explicando o motivo.

No arquivamento, ADDED é adicionado ao final da especificação principal, MODIFIED substitui a versão antiga e REMOVED é excluído. Se você marcar uma alteração real como ADDED, acabará com dois requisitos conflitantes; se descrever um comportamento novo como MODIFIED, não haverá nada para substituir. Em caso de dúvida, abra a especificação atual e verifique se o requisito já existe lá.

## Defina o tamanho correto da alteração

O erro de autoria mais comum não é um requisito mal formulado — é uma alteração que está tentando ser três alterações ao mesmo tempo.

**Uma boa alteração tem uma única intenção que você consegue expressar em uma frase.** "Adicionar um botão de alternância para modo escuro." "Aplicar limite de taxa no endpoint de login." "Migrar sessões para fora dos cookies." Se descrever a alteração precisar de muitos "e também", esse é o sinal para dividi-la.

Sinais de que uma alteração está muito grande:

- O escopo da proposta parece uma lista de funcionalidades não relacionadas.
- Levaria uma tarde inteira para revisá-la, então ninguém vai fazer isso.
- Duas pessoas não conseguiriam trabalhar nela ao mesmo tempo sem conflitos.
- Metade das tarefas poderia ser lançada por conta própria.

Alterações menores são mais fáceis de revisar, mais fáceis de implementar em uma sessão focada e mais fáceis de entender seis meses depois, quando o arquivamento for tudo o que restar. Você sempre pode executar várias alterações em paralelo — consulte [Editando e iterando](editing-changes.md) e [Fluxos de trabalho](workflows.md).

O inverso também acontece: uma correção de erro de digitação de uma linha não requer três requisitos e um documento de design. Adeque o nível de formalidade ao impacto da alteração.

## Como direcionar a IA para um rascunho de qualidade

Como o `/opsx:propose` faz o primeiro rascunho, a qualidade do resultado que você recebe está diretamente ligada à qualidade do que você fornece a ele. Você não precisa escrever requisitos manualmente — só precisa direcionar a IA corretamente:

- **Defina a intenção e os limites.** *"Adicionar um botão de alternância para modo escuro que segue a configuração do sistema operacional no primeiro carregamento — não modifique a API de temas existente."* A parte fora do escopo é tão importante quanto a parte dentro do escopo.
- **Nomeie os casos que são importantes para você.** *"Certifique-se de que há um cenário para um usuário que já escolheu um tema manualmente."* A IA cobre o que você apontar para ela.
- **Depois, edite.** É Markdown simples. Refine um `SHALL` vago, exclua um cenário que não testa nada, adicione o caso que ele perdeu — ou peça à IA para fazer isso: *"o requisito de tempo limite é vago, defina-o como 30 minutos."*

Rascunhe, refine, repita. Algumas rodadas disso produzem uma especificação na qual você confia, que é o objetivo principal.

## Lista de verificação rápida

- [ ] Cada requisito descreve um único comportamento observável com um `SHALL`/`MUST`.
- [ ] Nenhum detalhe de implementação está embutido nos requisitos.
- [ ] Todo requisito tem pelo menos um cenário que realmente o exercita.
- [ ] Os casos de borda e de erro importantes têm cenários, não apenas o caminho feliz.
- [ ] Os deltas usam ADDED / MODIFIED / REMOVED corretamente em relação à especificação atual.
- [ ] Toda a alteração tem uma única intenção que você consegue expressar em uma frase.

## Para onde ir em seguida

- [Revisando uma Alteração](reviewing-changes.md) — a verificação rápida de dois minutos que captura o que passou despercebido.
- [Conceitos](concepts.md) — o modelo mais aprofundado por trás de especificações, alterações e deltas.
- [Exemplos e Receitas](examples.md) — alterações reais do início ao fim.