# Scrivere buone specifiche

Raramente scrivi una specifica partendo da una pagina bianca. Descrivi una modifica in linguaggio semplice, `/opsx:propose` redige le bozze di requisiti e scenari, e poi tu li rendi di qualità. Questa pagina si concentra proprio su quest'ultima parte: cosa significa "di qualità" e come indirizzare l'IA verso questo obiettivo.

È la pagina complementare a [Revisione di una modifica](reviewing-changes.md): la revisione serve a individuare i punti deboli di una bozza, la scrittura serve a sapere di cosa è fatta una specifica valida.

## Una specifica descrive il comportamento, non il codice

Una specifica descrive cosa fa il tuo sistema, in termini che chiunque possa verificare — non come è costruito. È composta da **requisiti** (enunciati di comportamento) e **scenari** (esempi concreti che li dimostrano).

```markdown
### Requisito: Timeout della sessione
Il sistema DOVRÀ invalidare una sessione dopo 30 minuti di inattività.

#### Scenario: Timeout per inattività
- GIVEN una sessione autenticata
- WHEN passano 30 minuti senza attività
- THEN la sessione viene invalidata e l'utente deve riautenticarsi
```

Mantieni il *come* — la coda, la libreria, lo schema della tabella — in `design.md` o nel codice. Quando comportamento e implementazione vengono mescolati in un unico requisito, il requisito cessa di essere verificabile e inizia a diventare obsoleto non appena il codice viene modificato.

## Cosa rende un requisito valido

Un requisito valido è un singolo comportamento, espresso in modo così chiaro che puoi consegnarlo a qualcun altro perché lo verifichi.

- **Un solo enunciato, un solo `SHALL`/`MUST`.** Se un requisito ha tre clausole "e anche", in realtà si tratta di tre requisiti distinti. Dividili.
- **Verificabile.** Chi non ha accesso al codice deve essere in grado di dire se il requisito è rispettato. "Il sistema DOVRÀ mostrare un banner di errore quando il caricamento supera i 10 MB" è verificabile. "Il sistema DOVRÀ gestire i caricamenti di grandi dimensioni in modo elegante" non lo è.
- **La forza corretta.** OpenSpec utilizza le keyword della RFC 2119, che hanno significati diversi:

  | Keyword | Significato |
  |---------|-------------|
  | `MUST` / `SHALL` | Un requisito obbligatorio. Non negoziabile. |
  | `SHOULD` | Una forte raccomandazione, con spazio per giustificate eccezioni. |
  | `MAY` | Genuinamente opzionale. |

  Utilizza `MUST`/`SHALL` come impostazione predefinita. Usa `SHOULD` solo quando intendi veramente "a meno che non ci sia un buon motivo per non farlo".

Il criterio per valutare un requisito: *un tester che non ha mai visto il codice sarebbe in grado di dire se è stato superato?* In caso contrario, ha bisogno di essere perfezionato.

## Cosa rende uno scenario valido

Gli scenari sono la parte in cui un requisito dimostra il proprio valore. Ognuno è un GIVEN / WHEN / THEN concreto che può essere trasformato in un test automatizzato.

- **Verifica il requisito a cui si riferisce.** Uno scenario che si limita a riformulare il requisito con altre parole non testa nulla. Rendilo una situazione specifica con un risultato specifico.
- **Copri i casi che contano, non solo il percorso felice.** Il login valido è semplice. L'input vuoto, il token scaduto, il secondo clic, l'evento che non funziona: sono quelli i punti in cui si annidano i bug, e dove uno scenario vale di più.
- **Indica il caso nel titolo.** "Scenario: Rifiuta un token scaduto" permette a un revisore di capire immediatamente cosa viene verificato; "Scenario: Test 2" no.

Un'abitudine utile: prima di approvare, chiediti *quale è il caso per cui sarei infastidito se si rompesse?* e assicurati che ci sia uno scenario che lo indichi.

## Scegli il tipo di delta corretto

Una modifica descrive le sue modifiche alle specifiche con tre tipi di sezione. Utilizzare quello corretto mantiene le specifiche archiviate coerenti:

- **`## ADDED Requirements`** — comportamento completamente nuovo che non esisteva in precedenza.
- **`## MODIFIED Requirements`** — comportamento che esisteva già e che viene modificato. Includi la versione completa nuova; una breve nota su cosa è cambiato aiuta il revisore.
- **`## REMOVED Requirements`** — comportamento che viene rimosso, con una riga che ne spiega il motivo.

In fase di archiviazione, ADDED viene aggiunto alla specifica principale, MODIFIED sostituisce la versione precedente e REMOVED viene eliminato. Se contrassegni una modifica reale come ADDED, ti ritrovi con due requisiti in conflitto; se descrivi un comportamento nuovo come MODIFIED, non c'è niente da sostituire. In caso di dubbio, apri la specifica attuale e verifica se il requisito è già presente.

## Dimensiona correttamente la modifica

L'errore di scrittura più comune non è un requisito formulato male: è una modifica che cerca di essere tre modifiche diverse.

**Una modifica valida ha un solo intento che puoi esprimere in una frase.** "Aggiungi un interruttore per la modalità scura." "Applica un rate limit all'endpoint di login." "Esegui la migrazione delle sessioni fuori dai cookie." Se per descrivere la modifica hai bisogno di molti "e anche", è il segnale che devi dividerla.

Segnali che una modifica è troppo grande:

- L'ambito della proposta sembra un elenco di funzionalità non correlate.
- La sua revisione richiederebbe un pomeriggio intero, quindi nessuno lo farà.
- Due persone non potrebbero lavorarci contemporaneamente senza entrare in conflitto.
- Metà delle attività potrebbe essere rilasciata autonomamente.

Le modifiche più piccole sono più facili da revisionare, più facili da implementare in una sessione di lavoro concentrata, e più facili da comprendere anche sei mesi dopo, quando l'archivio è tutto ciò che rimane. Puoi sempre eseguire più modifiche in parallelo — consulta [Modifica e iterazione](editing-changes.md) e [Flussi di lavoro](workflows.md).

Può anche accadere il contrario: la correzione di un errore di battitura su una sola riga non richiede tre requisiti e un documento di progettazione. Adatta il livello di formalità alla rilevanza della modifica.

## Come indirizzare l'IA verso una bozza di qualità

Dato che `/opsx:propose` redige la prima bozza, la qualità del risultato che ottieni dipende dalla qualità di ciò che le fornisci. Non devi scrivere i requisiti manualmente: devi solo indirizzare l'IA nel modo corretto:

- **Indica l'intento e i confini.** *"Aggiungi un interruttore per la modalità scura che segue l'impostazione del sistema operativo al primo caricamento — non modificare l'API dei temi esistente."* La parte fuori dall'ambito è importante quanto quella inclusa.
- **Indica i casi che ti interessano.** *"Assicurati che ci sia uno scenario per un utente che ha già scelto un tema manualmente."* L'IA copre ciò che le indichi.
- **Poi modifica.** È semplice Markdown. Rendi più preciso un `SHALL` vago, elimina uno scenario che non testa niente, aggiungi il caso che ha perso — oppure chiedi all'IA di farlo: *"il requisito sul timeout è vago, fissalo a 30 minuti."*

Bozza, perfeziona, ripeti. Poche ripetizioni di questo processo producono una specifica di cui ti puoi fidare, che è l'obiettivo finale.

## Checklist rapida

- [ ] Ogni requisito è un singolo comportamento verificabile con un `SHALL`/`MUST`.
- [ ] Nessun dettaglio di implementazione è incorporato nei requisiti.
- [ ] Ogni requisito ha almeno uno scenario che lo verifica effettivamente.
- [ ] I casi limite e di errore importanti hanno uno scenario dedicato, non solo il percorso felice.
- [ ] I delta utilizzano ADDED / MODIFIED / REMOVED correttamente rispetto alla specifica attuale.
- [ ] L'intera modifica ha un solo intento che puoi esprimere in una frase.

## Dove andare dopo

- [Revisione di una modifica](reviewing-changes.md) — la verifica di due minuti che individua ciò che è sfuggito.
- [Concetti](concepts.md) — il modello più approfondito alla base di specifiche, modifiche e delta.
- [Esempi e ricette](examples.md) — modifiche reali dall'inizio alla fine.