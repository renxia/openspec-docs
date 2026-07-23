# Revisando uma Alteração

Toda a promessa do OpenSpec é que você e sua IA **concordem sobre o que construir antes que qualquer código seja escrito.** Esse acordo só significa algo se você realmente ler o que a IA rascunhou. Esta página é sobre os dois minutos em que você faz isso — o que abrir, em que ordem e o que procurar.

A aposta é simples: detectar um erro de rumo em um plano de um parágrafo é quase gratuito. Detectar o mesmo erro de rumo em 300 linhas de código não é. A revisão é onde você coleta os frutos dessa aposta.

## Os dois momentos em que você revisa

Há exatamente dois:

```
/opsx:propose ──► REVISAR O PLANO ──► /opsx:apply ──► REVISAR O CÓDIGO ──► /opsx:archive
                  (antes de qualquer código)                    (/opsx:verify)
```

1. **Depois de `/opsx:propose`** (ou `/opsx:ff`), antes de `/opsx:apply` — leia o plano enquanto ele ainda for apenas palavras.
2. **Depois de construir**, com `/opsx:verify` — verifique se o código realmente fez o que o plano dizia.

A primeira revisão é a que mais economiza seu tempo, e a que as pessoas pulam. Esta página passa a maior parte do tempo nela.

## Leia nesta ordem

Uma alteração é uma pasta de Markdown simples em `openspec/changes/<name>/`. Leia os arquivos na ordem que permite que você pare o mais cedo possível se algo estiver errado:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. a intenção e o escopo   ← se isso estiver errado, pare aqui
├── specs/…/spec.md  2. os requisitos       ← o coração da revisão
├── design.md        (apenas para alterações maiores) — a abordagem técnica
└── tasks.md         3. o plano de trabalho
```

Você não precisa ler cada linha. Você precisa responder a três perguntas, uma por arquivo.

## A proposta: este é o problema certo?

Abra `proposal.md` primeiro. Ele captura o "porquê" e o "o quê" — a intenção, o escopo, a abordagem em um ou dois parágrafos.

**O que parece bom:** uma intenção clara, um escopo que você reconhece e uma razão pela qual vale a pena fazer isso agora.

**Sinais de alerta:**

- Ele resolve um problema ligeiramente *diferente* do que você pediu.
- O escopo cresceu — você pediu um alternador de tema e a proposta também mexe com autenticação "já que estamos por aqui".
- É vago. "Melhorar a página de configurações" não é um escopo; "adicionar um alternador de modo escuro que respeite a preferência do sistema operacional" é.

**A pergunta a responder:** *Isso corresponde ao que eu realmente pedi, e alguma coisa está se infiltrando?* Se a resposta for não, pare — não leia mais, conserte a proposta (veja [Fazendo oposição é barato](#pushing-back-is-cheap)).

## Os delta de especificações: "pronto" está definido corretamente?

Este é o coração da revisão. As especificações delta em `specs/` dizem o que será *verdadeiro* quando a alteração for lançada — como requisitos e os cenários que os provam:

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**O que um bom requisito parece:** uma declaração clara `SHALL`/`MUST` que você poderia entregar a um testador, e pelo menos um cenário cujo GIVEN/WHEN/THEN realmente exercite essa declaração.

**Sinais de alerta:**

- **Um requisito vago.** "O sistema SHALL ser rápido" não pode ser construído ou testado. O que é rápido?
- **Um requisito sem cenário**, ou um cenário que não testa o requisito sob o qual ele está.
- **A captura mais valiosa de todas: o que está faltando.** A IA fielmente escreve o que você *disse*. Seu trabalho é notar o que você *esqueceu* de dizer. Se você se importava mais com o caso de preferência do sistema operacional e nenhum cenário o menciona, essa é a revisão se pagando.

Leia os deltas perguntando *eu ficaria feliz se o sistema fizesse exatamente — e apenas — isso?* Nada aqui é sobre código ainda, então continua barato de mudar.

## As tarefas: o plano de trabalho é sensato?

Abra `tasks.md` por último. É a lista de verificação de implementação que a IA irá percorrer.

**O que parece bom:** passos ordenados, cada um rastreável até um requisito, nada misterioso.

**Sinais de alerta:**

- Uma tarefa sem requisito correspondente (de onde veio isso?).
- Uma tarefa gigante "implementar o recurso" que esconde todas as decisões reais.
- Uma tarefa que mexe com algo fora do escopo que você acabou de aprovar.

Você não está estimando ou microgerenciando aqui — você está verificando se o plano corresponde aos requisitos que você já aceitou.

## Fazendo oposição é barato

Se alguma das três perguntas voltou errada, diga isso. Não há fases e nada está bloqueado — você conserta e segue em frente. Duas maneiras, exatamente como em [Editando uma alteração](editing-changes.md):

- **Edite o arquivo você mesmo.** É Markdown simples; altere a linha de escopo, refine um requisito, exclua uma tarefa.
- **Diga à IA o que está errado** e deixe-a revisar: *"remova as alterações de autenticação — fora do escopo,"* *"adicione um cenário para quando o usuário já escolheu um tema,"* *"divida a tarefa 3 em esquema e interface."*

Depois releia a parte que você alterou. Redigite até que seja um plano que você assinaria com seu nome. Essa ida e volta *é* o produto funcionando.

## Após o código: verifique

Uma vez que o trabalho está construído, `/opsx:verify` é sua segunda revisão. Ele relê os artefatos e o código e relata incompatibilidades em três dimensões:

| Dimensão | O que ele verifica |
|-----------|----------------|
| **Completude** | Toda tarefa feita, todo requisito implementado, cenários cobertos |
| **Correção** | A implementação corresponde à intenção da especificação, casos de borda tratados |
| **Coerência** | Decisões de design realmente aparecem no código |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

Ele sinaliza problemas como CRITICAL, WARNING ou SUGGESTION, e ele **não** bloqueia o arquivamento — ele mostra as lacunas e deixa a decisão para você. Esta é a diferença entre "a IA escreveu código" e "ela construiu o que nós acordamos".

`/opsx:verify` está no perfil expandido. Se você não o tiver, ative-o com `openspec config profile` (depois `openspec update`), ou apenas releia a alteração e o diff você mesmo.

## Dimensione a revisão corretamente

Nem toda alteração merece a revisão completa. Uma correção de digitação de um arquivo merece uma olhada de vinte segundos. Uma alteração que mexe com autenticação, pagamentos ou dados que você não pode recuperar merece todas as perguntas acima. O ponto nunca foi cerimônia — é gastar sua atenção onde um erro seria caro, e passar os olhos onde não seria.

## A lista de verificação de dois minutos

- [ ] A intenção da proposta corresponde ao que eu pedi.
- [ ] Nada de extra se infiltrou no escopo.
- [ ] Todo requisito é específico o suficiente para ser testado.
- [ ] Todo requisito tem um cenário que realmente o exercita.
- [ ] O caso que mais me importa está coberto.
- [ ] As tarefas correspondem aos requisitos; nada é misterioso ou fora do escopo.
- [ ] Eu ficaria confortável se a IA construísse exatamente isso e nada mais.

Se todos os sete passarem, execute `/opsx:apply` com confiança. Se algum falhar, isso não é um revés — são os dois minutos fazendo seu trabalho.

## Para onde ir a seguir

- [Escrevendo Boas Especificações](writing-specs.md) — o outro lado: como rascunhar requisitos e cenários que valem a pena aprovar.
- [Editando e Iterando em uma Alteração](editing-changes.md) — a mecânica de alterar um plano depois que você começou.
- [Fluxos de Trabalho](workflows.md) — onde a revisão se encaixa no ciclo maior.