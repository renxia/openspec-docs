# OpenSpec em uma Equipe

Tudo o que está nos outros guias funciona da mesma forma, seja você trabalhando sozinho ou em uma equipe de vinte pessoas. O que muda em uma equipe são as questões periféricas: onde os specs ficam armazenados, como os colegas de equipe revisam um plano e como tudo isso se encaixa no fluxo de pull-request que já utilizamos?

A resposta curta: uma alteração é apenas arquivos, e o OpenSpec nunca mexe com o git. Por isso ele se encaixa no seu fluxo de trabalho existente, em vez de substituí-lo. Esta página detalha as convenções que funcionam bem.

## Uma regra: o OpenSpec não mexe com o git

O OpenSpec lê e escreve Markdown simples dentro da pasta `openspec/`. Ele nunca executa commit, cria branches, faz push ou pull no seu projeto — e nunca clona ou sincroniza um [store](stores-beta/user-guide.md) por conta própria. Isso significa que:

- **Você faz commit da pasta `openspec/` como faz com qualquer código fonte.** Specs, alterações ativas e o arquivo morto fazem parte do histórico do seu projeto. (Sim, faça commit da pasta inteira — consulte o [FAQ](faq.md#should-i-commit-the-openspec-folder-to-git).)
- **Uma alteração é uma pasta que você versiona como se fosse código.** A pasta `openspec/changes/add-dark-mode/` é apenas um conjunto de arquivos em uma branch.
- **Tudo o que vem a seguir é convenção, não regra obrigatória.** O OpenSpec não vai obrigar você a fazer dessa forma; ele apenas se encaixa perfeitamente no fluxo.

## O fluxo de trabalho diário

O fluxo de trabalho que funciona bem associa uma alteração a uma branch e a um pull request:

```
git switch -c add-dark-mode        iniciar uma branch, como de costume
   │
/opsx:propose add-dark-mode        elaborar o plano (proposta + specs + tarefas)
   │
REVISAR O PLANO                    ler o plano antes de qualquer código — consulte Revisando uma Alteração
   │
/opsx:apply                        construir; artefatos + alteração de código juntos
   │
git commit && open a PR            o PR contém o delta do spec E o código
   │
colega revisa, faz merge
   │
/opsx:archive                      incorporar o delta aos specs/, mover a alteração para archive/
```

O plano e o código ficam lado a lado na mesma branch, então seus colegas de equipe revisam ambos juntos, e seis meses depois o spec arquivado ainda explica por que o código está da forma como está.

## Revisão de specs em um pull request

É aqui que uma equipe percebe o benefício. Quando um pull request inclui o delta do spec da alteração, o revisor obtém algo que um diff bruto nunca oferece: **uma declaração em linguagem simples do que essa alteração deve fazer**, antes de ler uma única linha de código.

Uma ordem de revisão adequada para o revisor:

1. **Leia o arquivo `proposal.md`** — este é o problema e o escopo corretos?
2. **Leia o delta dentro da pasta `specs/`** — o que é considerado "concluído" está definido corretamente? (Esta é a revisão de dois minutos descrita em [Revisando uma Alteração](reviewing-changes.md), agora acontecendo dentro do pull request.)
3. **Depois, leia o diff de código** — ele entrega exatamente esses requisitos?

Um revisor que discorda da *abordagem* pode apontar isso diretamente na proposta, de forma simples, em vez de reabrir a discussão em 300 linhas de código. Coloque o delta do spec no topo da descrição do pull request, ou indique aos revisores a pasta da alteração, para que eles comecem por ali.

## Quando arquivar

Arquivar incorpora os deltas de uma alteração ao seu `openspec/specs/` principal e move a pasta da alteração para `openspec/changes/archive/YYYY-MM-DD-<name>/`. Como a pasta `specs/` é a **fonte de verdade compartilhada**, o momento de arquivar faz diferença em uma equipe. Duas convenções viáveis:

- **Arquivar após o merge do pull request (recomendado).** A branch carrega a alteração ativa; assim que ela for mergeada para a sua branch principal, arquive-a lá (geralmente com um pequeno commit de acompanhamento ou uma limpeza agendada). Isso faz com que a pasta `specs/` compartilhada só avance com trabalho que realmente foi lançado.
- **Arquivar dentro do pull request.** Mais simples para equipes pequenas: o mesmo pull request que adiciona o código também sincroniza e arquiva. A troca é que o diff da sua pasta `specs/` e o diff de código chegam juntos, o que pode deixar o pull request mais poluído.

Escolha uma das opções e seja consistente. De qualquer forma, o comando `/opsx:archive` verifica se as tarefas estão concluídas e oferece para sincronizar primeiro, para que nada seja mergeado pela metade por acidente.

## Duas pessoas, alterações paralelas

Como as alterações são pastas separadas, elas não entram em conflito:

- **Alterações diferentes, pessoas diferentes — sem problema.** As pastas `add-dark-mode` e `rate-limit-login` são pastas diferentes em branches diferentes; elas nunca se interferem até que ambas sejam arquivadas.
- **Uma alteração, um responsável.** Duas pessoas editando a mesma pasta de alteração entram em conflito exatamente como duas pessoas editando o mesmo arquivo. Mantenha uma alteração com um único autor, ou divida-a em duas alterações (outro motivo para [ajustar o tamanho da alteração](writing-specs.md#right-size-the-change)).
- **O único local onde conflitos aparecem é a pasta `specs/`.** Se duas alterações modificarem o *mesmo* requisito, arquivar a segunda causará um conflito no arquivo `openspec/specs/…/spec.md` — resolva-o como qualquer conflito de merge, mantendo o requisito que reflete a realidade. Isso é raro, e é um recurso: é o git informando que duas alterações discordaram sobre como o sistema deve funcionar.

## Quando o planejamento ultrapassa um único repositório

Tudo o que foi dito acima assume que o plano fica na pasta `openspec/` do próprio repositório de código, o que é o padrão correto. Quando o seu planejamento realmente abrange vários repositórios ou equipes — um recurso que impacta três serviços, ou requisitos que uma equipe possui e outras consomem — é para isso que serve o recurso beta **stores**: o planejamento ganha o seu próprio repositório, para o qual qualquer repositório de código pode apontar. Comece pelo [Guia do Usuário de Stores](stores-beta/user-guide.md).

## Para onde ir a seguir

- [Revisando uma Alteração](reviewing-changes.md) — a revisão rápida, agora dentro do seu pull request.
- [Escrevendo bons specs](writing-specs.md) — incluindo como ajustar o tamanho de uma alteração para que ela caiba em uma única branch.
- [Guia do Usuário de Stores](stores-beta/user-guide.md) — planejamento que abrange repositórios e equipes.