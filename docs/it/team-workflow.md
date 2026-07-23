# OpenSpec in un team

Tutto il contenuto delle altre guide funziona allo stesso modo sia che tu lavori da solo sia che tu faccia parte di un team di venti persone. Ciò che cambia in un team sono le domande marginali: dove risiedono le specifiche, come i compagni di team revisionano un piano e come tutto questo si integra nel flusso di pull request che già utilizzi?

La risposta breve: una modifica è solo un insieme di file, e OpenSpec non interagisce mai con git. Quindi si integra nel tuo flusso di lavoro esistente invece di sostituirlo. Questa pagina illustra le convenzioni che funzionano meglio.

## Una sola regola: OpenSpec non interagisce con git

OpenSpec legge e scrive Markdown semplice nella cartella `openspec/`. Non esegue mai commit, crea branch, effettua push o pull nel tuo progetto, e non clona né sincrona autonomamente un [store](stores-beta/user-guide.md) per conto proprio. Questo significa che:

- **Esegui il commit della cartella `openspec/` come per qualsiasi altra sorgente.** Le specifiche, le modifiche attive e l'archivio fanno parte della cronologia del tuo progetto. (Sì, esegui il commit dell'intera cartella — consulta le [FAQ](faq.md#should-i-commit-the-openspec-folder-to-git).)
- **Una modifica è una cartella che versioni come se fosse codice.** `openspec/changes/add-dark-mode/` è solo un insieme di file su un branch.
- **Tutto il contenuto che segue è una convenzione, non un obbligo.** OpenSpec non ti obbliga a procedere in questo modo; si integra semplicemente in modo pulito.

## Il flusso di lavoro quotidiano

Il flusso di lavoro che funziona meglio associa una modifica a un branch e a una pull request:

```
git switch -c add-dark-mode        avvia un branch, come di consueto
   │
/opsx:propose add-dark-mode        redigi il piano (proposta + specifiche + task)
   │
REVISIONA IL PIANO                 lo leggi prima di qualsiasi codice — consulta Revisionare una modifica
   │
/opsx:apply                        costruiscilo; artefatti e modifiche al codice insieme
   │
git commit && open a PR            la PR contiene il delta delle specifiche E il codice
   │
i compagni di team revisionano, uniscono
   │
/opsx:archive                      incorpora il delta in specs/, sposta la modifica in archive/
```

Il piano e il codice risiedono affiancati nello stesso branch, quindi i tuoi compagni di team li revisionano insieme, e sei mesi dopo la specifica archiviata spiega ancora perché il codice ha l'aspetto che ha.

## Revisionare le specifiche in una pull request

È qui che un team percepisce il vantaggio. Quando una PR include il delta delle specifiche della modifica, il revisore ottiene qualcosa che un diff grezzo non gli darà mai: **un'esposizione in linguaggio semplice di cosa dovrebbe fare questa modifica**, prima di leggere anche solo una riga di codice.

Un buon ordine di revisione per il revisore:

1. **Leggi `proposal.md`** — si tratta del problema e dell'ambito corretti?
2. **Leggi il delta nella cartella `specs/`** — il "completato" è definito correttamente? (Questa è la revisione rapida di due minuti di [Revisionare una modifica](reviewing-changes.md), che ora avviene nella PR.)
3. **Poi leggi il diff del codice** — soddisfa esattamente quei requisiti?

Un revisore che non è d'accordo con l'*approccio* può esprimerlo sulla proposta, in modo semplice e veloce, invece di ricominciare la discussione su 300 righe di codice. Posiziona il delta delle specifiche nella parte superiore della descrizione della PR, o indirizza i revisori alla cartella della modifica, in modo che inizino da lì.

## Quando archiviare

L'archiviazione incorpora i delta delle modifiche nella tua cartella principale `openspec/specs/` e sposta la cartella della modifica in `openspec/changes/archive/YYYY-MM-DD-<name>/`. Poiché `specs/` è la **fonte di verità condivisa**, il tempismo è importante in un team. Due convenzioni applicabili:

- **Archivia dopo l'unione della PR (consigliato).** Il branch contiene la modifica attiva; una volta unita al tuo branch principale, archivia lì (spesso si tratta di un piccolo commit di follow-up o di una pulizia pianificata). Questo mantiene la `specs/` condivisa che avanza solo con il lavoro effettivamente rilasciato.
- **Archivia all'interno della PR.** Più semplice per i piccoli team: la stessa PR che aggiunge il codice sincronizza e archivia anche. Lo svantaggio è che il diff della tua `specs/` e il diff del codice arrivano insieme, il che può rendere la PR più rumorosa.

Scegline una e mantienila coerente. In entrambi i casi, `/opsx:archive` verifica che i task siano completati e offre di sincronizzare prima, quindi non viene unito nulla di incompleto per errore.

## Due persone, modifiche parallele

Poiché le modifiche sono cartelle separate, non entrano in conflitto:

- **Modifiche diverse, persone diverse — nessun problema.** `add-dark-mode` e `rate-limit-login` sono cartelle diverse su branch diversi; non si toccano mai finché non vengono entrambe archiviate.
- **Una modifica, un proprietario.** Due persone che modificano la stessa cartella di modifica entrano in conflitto esattamente come due persone che modificano lo stesso file. Assegna una modifica a un solo autore, o dividila in due modifiche (un altro motivo per [dimensionare correttamente](writing-specs.md#right-size-the-change)).
- **L'unico punto in cui si verificano conflitti è `specs/`.** Se due modifiche modificano lo *stesso* requisito, l'archiviazione della seconda genererà un conflitto in `openspec/specs/…/spec.md` — risolvilo come qualsiasi altro conflitto di merge, mantenendo il requisito che corrisponde alla realtà. È un evento raro, ed è una funzionalità: è git che ti segnala che due modifiche erano in disaccordo su come il sistema dovrebbe comportarsi.

## Quando la pianificazione supera le capacità di un singolo repository

Tutto il contenuto che precede presuppone che il piano risieda nella cartella `openspec/` del repository di codice stesso, che è l'impostazione predefinita corretta. Quando la tua pianificazione coinvolge effettivamente più repository o team — ad esempio una funzionalità che interessa tre servizi, o requisiti di proprietà di un team che vengono utilizzati da altri — la funzionalità beta **Store** serve proprio a questo: la pianificazione ottiene un proprio repository a cui qualsiasi repository di codice può fare riferimento. Inizia con la [Guida utente degli Store](stores-beta/user-guide.md).

## Dove andare dopo

- [Revisionare una modifica](reviewing-changes.md) — la fase di revisione, ora all'interno della tua PR.
- [Scrivere buone specifiche](writing-specs.md) — inclusa la modalità per dimensionare correttamente una modifica in modo che si adatti a un solo branch.
- [Guida utente degli Store](stores-beta/user-guide.md) — pianificazione che coinvolge più repository e team.