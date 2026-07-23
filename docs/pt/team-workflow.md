# OpenSpec em Equipe

Tudo nos outros guias funciona da mesma forma, seja você trabalhando sozinho ou em uma equipe de vinte pessoas. O que muda em uma equipe são as questões nas bordas: onde os specs ficam armazenados, como os colegas de equipe revisam um plano e como tudo isso se encaixa no fluxo de pull-request que já temos?

A resposta curta: uma alteração é apenas arquivos, e o OpenSpec nunca mexe com o git. Então ele se encaixa no seu fluxo de trabalho existente em vez de substituí-lo. Esta página detalha as convenções que funcionam bem.

## Uma regra: o OpenSpec não mexe com o git

O OpenSpec lê e escreve Markdown simples em `openspec/`. Ele nunca faz commit, cria branches, faz push ou faz pull no seu projeto — e nunca clona ou sincroniza um [store](stores-beta/user-guide.md) por conta própria. Isso significa:

- **Você faz commit de `openspec/` como qualquer código fonte.** Specs, alterações ativas e o arquivo morto fazem parte do histórico do seu projeto. (Sim, faça commit da pasta inteira — veja o [FAQ](faq.md#should-i-commit-the-openspec-folder-to-git).)
- **Uma alteração é uma pasta que você versiona como código.** `openspec/changes/add-dark-mode/` são apenas arquivos em um branch.
- **Tudo abaixo é convenção, não imposição.** O OpenSpec não vai obrigar você a fazer dessa forma; ele simplesmente se encaixa perfeitamente.

## O loop cotidiano

O fluxo de trabalho que funciona bem mapeia uma alteração para um branch e um pull request:

```
git switch -c add-dark-mode        inicie um branch, como de costume
   │
/opsx:propose add-dark-mode        rascunhe o plano (proposta + specs + tarefas)
   │
REVIEW THE PLAN                    REVISAR O PLANO
   │
/opsx:apply                        construa-o; artefatos + código mudam juntos
   │
git commit && open a PR            o PR contém o delta de specs E o código
   │
teammate reviews, merges           colega revisa, faz merge
   │
/opsx:archive                      dobre o delta em specs/, mova a alteração para archive/
```

O plano e o código vivem lado a lado no mesmo branch, então seus colegas de equipe revisam ambos juntos, e seis meses depois o spec arquivado ainda explica por que o código está da forma como está.

## Revisando specs em um pull request

É aqui que uma equipe sente o retorno. Quando um PR inclui o delta de specs da alteração, o revisor ganha algo que um diff bruto nunca dá a ele: **uma declaração em linguagem simples do que essa alteração deve fazer**, antes de ler uma única linha de código.

Uma boa ordem de revisão para o revisor:

1. **Leia `proposal.md`** — este é o problema e o escopo corretos?
2. **Leia o delta em `specs/`** — o "pronto" está definido corretamente? (Esta é a revisão de dois minutos de [Revisando uma Alteração](reviewing-changes.md), agora acontecendo no PR.)
3. **Depois leia o diff de código** — ele entrega exatamente esses requisitos?

Um revisor que discorda da *abordagem* pode dizer isso na proposta, de forma barata, em vez de reabrir a discussão em 300 linhas de código. Coloque o delta de specs perto do topo da descrição do PR, ou aponte os revisores para a pasta da alteração, para que eles comecem por lá.

## Quando arquivar

Arquivar dobra os deltas de uma alteração no seu `openspec/specs/` principal e move a pasta da alteração para `openspec/changes/archive/YYYY-MM-DD-<name>/`. Como `specs/` é a **fonte de verdade compartilhada**, o timing importa em uma equipe. Duas convenções viáveis:

- **Arquivar após o merge do PR (recomendado).** O branch carrega a alteração ativa; uma vez que ela seja merged para o seu branch principal, arquive lá (muitas vezes um pequeno commit de acompanhamento ou uma limpeza agendada). Isso mantém o `specs/` compartilhado avançando apenas com trabalho que realmente foi entregue.
- **Arquivar dentro do PR.** Mais simples para equipes pequenas: o mesmo PR que adiciona o código também sincroniza e arquiva. A troca é que o seu diff de `specs/` e o diff de código chegam juntos, o que pode deixar o PR mais barulhento.

Escolha um e seja consistente. De qualquer forma, `/opsx:archive` verifica se as tarefas estão completas e oferece para sincronizar primeiro, para que nada seja merged pela metade por acidente.

## Duas pessoas, alterações paralelas

Como as alterações são pastas separadas, elas não colidem:

- **Alterações diferentes, pessoas diferentes — sem problema.** `add-dark-mode` e `rate-limit-login` são pastas diferentes em branches diferentes; elas nunca se tocam até que ambas sejam arquivadas.
- **Uma alteração, um dono.** Duas pessoas editando a mesma pasta de alteração entram em conflito exatamente como duas pessoas editando o mesmo arquivo. Mantenha uma alteração com um único autor, ou divida-a em duas alterações (outro motivo para [dimensionar corretamente](writing-specs.md#right-size-the-change)).
- **O único lugar onde conflitos aparecem é em `specs/`.** Se duas alterações modificarem o *mesmo* requisito, arquivar a segunda causará um conflito em `openspec/specs/…/spec.md` — resolva-o como qualquer conflito de merge, mantendo o requisito que reflete a realidade. Isso é raro, e é um recurso: é o git dizendo que duas alterações discordaram de como o sistema deve se comportar.

## Quando o planejamento ultrapassa um repo

Tudo acima assume que o plano vive na própria pasta `openspec/` do repo de código, o que é o padrão correto. Quando o seu planejamento realmente abrange vários repositórios ou equipes — um recurso tocando três serviços, ou requisitos que uma equipe possui e outras consomem — é para isso que serve o recurso beta **stores**: o planejamento ganha seu próprio repo que qualquer repo de código pode apontar. Comece pelo [Guia do Usuário de Stores](stores-beta/user-guide.md).

## Para onde ir a seguir

- [Revisando uma Alteração](reviewing-changes.md) — a passagem de revisão, agora dentro do seu PR.
- [Escrevendo Boas Specs](writing-specs.md) — incluindo como dimensionar corretamente uma alteração para que ela caiba em um branch.
- [Guia do Usuário de Stores](stores-beta/user-guide.md) — planejamento que abrange repositórios e equipes.