# Risoluzione dei problemi

Soluzioni concrete per problemi concreti. Ogni voce nomina un sintomo, spiega la causa probabile in una frase e fornisce la soluzione. Se non trovi il tuo problema qui, l'[FAQ](faq.md) può aiutarti e [Discord](https://discord.gg/YctCnvvshC) lo farà sicuramente.

## Installazione e configurazione

### `openspec: command not found`

Il CLI non è installato o la tua shell non riesce a trovarlo. Installa globalmente e verifica:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Se è stato installato ma ancora non trovato, è probabile che il tuo percorso binario globale di npm non sia presente nel `PATH`. Esegui `npm bin -g` per vedere dove sono i binari globali e assicurati che quel percorso sia presente nel profilo della tua shell.

### "Requires Node.js 20.19.0 or higher"

OpenSpec funziona con Node 20.19.0+. Controlla la tua versione e aggiorna se necessario:

```bash
node --version
```

Se usi bun per installare OpenSpec, tieni presente che OpenSpec *funziona* ancora su Node, quindi hai bisogno di avere disponibile sul tuo `PATH` Node 20.19.0 o superiore. Vedi [Installazione](installation.md).

### `openspec init` non ha configurato il mio strumento AI

Init chiede quali strumenti configurare. Se hai saltato il tuo strumento o vuoi aggiungerne un altro, riavvia semplicemente l'operazione o usa la forma non interattiva:

```bash
openspec init --tools claude,cursor
```

L'elenco completo degli ID dei tool si trova in [Strumenti supportati](supported-tools.md). Usa `--tools all` per tutto e `--tools none` per saltare la configurazione dello strumento.

## I comandi non compaiono

Se `/opsx:propose` (o l'equivalente del tuo strumento) non appare o non fa nulla, segui questa lista. Sono ordinati dal più veloce da controllare al meno veloce.

1. **Potresti essere nel posto sbagliato.** I comandi slash vanno nella chat del tuo assistente AI, non nel terminale. Se hai digitato `/opsx:propose` nella tua shell, questo è il problema. Vedi [Come funzionano i Comandi](how-commands-work.md).

2. **Rigenera i file.** Dalla radice del progetto:

   ```bash
   openspec update
   ```

   Questo riscrive i file delle skill e dei comandi per ogni strumento che hai configurato.

3. **Riavvia l'assistente.** La maggior parte degli strumenti cercano le skill e i comandi all'avvio. Una nuova finestra lo fa spesso.

4. **Conferma che i file esistono.** Per Claude Code, verifica che `.claude/skills/` contenga le cartelle `openspec-*`. Gli altri strumenti usano le proprie directory, tutte elencate in [Strumenti supportati](supported-tools.md).

5. **Verifica di aver inizializzato questo progetto.** Le skill sono scritte per progetto. Se hai clonato un repository o sei passato ad altre cartelle, esegui `openspec init` (o `openspec update`) lì.

6. **Conferma che il tuo strumento supporta i file dei comandi.** Alcuni strumenti (Kimi CLI, Trae, ForgeCode, Mistral Vibe) non generano file di comando `opsx-*`; utilizzano invece invocazioni basate su skill. Le forme sono diverse per ogni strumento: vedi [Strumenti supportati](supported-tools.md) e [Come funzionano i Comandi](how-commands-work.md#slash-command-syntax-by-tool).

## Lavorare con le modifiche

### "Change not found" (Modifica non trovata)

Il comando non è riuscito a dire quale modifica intendevi. Nommala esplicitamente o verifica cosa esiste:

```bash
openspec list                    # vedi le modifiche attive
/opsx:apply add-dark-mode        # nomina la modifica nella chat
```

Conferma inoltre di essere nella directory del progetto corretta.

### "No artifacts ready" (Nessun artefatto pronto)

Ogni artefatto è o già creato o bloccato in attesa di una dipendenza. Vedi cosa sta bloccando:

```bash
openspec status --change <nome>
```

Poi crea prima la dipendenza mancante. Ricorda l'ordine: proposta abilita le specifiche e il design; specifiche e design insieme abilitano i task.

### `openspec validate` segnala avvisi o errori

La validazione controlla le tue specifiche e modifiche per problemi strutturali. Leggi il messaggio: nomina il file e il problema.

```bash
openspec validate <nome>           # valida un elemento
openspec validate --all            # valida tutto
openspec validate --all --strict   # controlli più rigorosi, utili per CI
```

Le cause comuni sono una sezione obbligatoria mancante (come una specifica senza scenari) o un delta header malformato. Correggi il file e riprova. La [riferimento CLI](cli.md#openspec-validate) documenta il formato dell'output.

### L'AI ha creato artefatti incompleti o errati

L'AI non aveva abbastanza contesto. Alcuni elementi possono aiutare:

- Aggiungi contesto del progetto in `openspec/config.yaml` affinché la tua stack e le tue convenzioni siano iniettate in ogni richiesta. Vedi [Personalizzazione](customization.md#project-configuration).
- Aggiungi `rules:` per artefatto per una guida che si applica solo, ad esempio, alle specifiche.
- Fornisci una descrizione più dettagliata quando proponi.
- Usa l'espanso `/opsx:continue` per creare un artefatto alla volta e rivederli ciascuno, invece di farli tutti insieme con `/opsx:ff`.

### Archive non finisce o avvisa di task incompleti

Archive non *bloccherà* su task incompleti, ma ti avverte, perché l'archiviazione significa solitamente che il lavoro è finito. Se i task rimangono intenzionalmente (stai archiviando una modifica parziale), procedi. Altrimenti finisci prima i task. Archive offrirà anche di sincronizzare le tue delta specs con le specifiche principali se non lo hai ancora fatto; rispondi sì a meno che tu abbia un motivo per no.

## Configurazione

### Il mio `config.yaml` non viene applicato

Tre sospettati comuni:

1. **Nome file sbagliato.** Deve essere `openspec/config.yaml`, non `.yml`.
2. **YAML non valido.** Eseguilo con qualsiasi validatore YAML; il CLI segnala anche gli errori di sintassi con i numeri di riga.
3. **Ti aspettavi un riavvio.** Non è necessario. Le modifiche alla configurazione prendono effetto immediatamente.

### "Unknown artifact ID in rules: X" (ID artefatto sconosciuto nelle regole: X)

Una chiave sotto `rules:` non corrisponde a nessun artefatto nel tuo schema. Per lo schema predefinito `spec-driven`, gli ID validi sono `proposal`, `specs`, `design` e `tasks`. Per vedere gli ID di qualsiasi schema:

```bash
openspec schemas --json
```

### "Context too large" (Contesto troppo grande)

Il campo `context:` è limitato a 50KB, intenzionalmente, perché viene iniettato in ogni richiesta. Riassumalo o fornisci un link verso documentazione più lunga invece di incollarla. Anche un contesto conciso produce risultati migliori e più veloci.

### "Schema not found" (Schema non trovato)

Il nome dello schema che hai referenziato non esiste. Elenca quelli disponibili e controlla l'ortografia:

```bash
openspec schemas                    # elenca gli schemi disponibili
openspec schema which <nome>        # vedi da dove risolve uno schema
openspec schema init <nome>         # crea un proprio
```

Vedi [Personalizzazione](customization.md#custom-schemas).

## Migrazione dal flusso di lavoro legacy

### "Legacy files detected in non-interactive mode" (File legacy rilevati in modalità non interattiva)

Sei in CI o in una shell non interattiva e OpenSpec ha trovato vecchi file da pulire ma non può chiederti conferma. Approva automaticamente:

```bash
openspec init --force
```

### I comandi non sono apparsi dopo la migrazione

Riavvia l'IDE. Le skill vengono rilevate all'avvio. Se continuano a non apparire, esegui `openspec update` e controlla le posizioni dei file in [Strumenti supportati](supported-tools.md).

### Il mio vecchio `project.md` non è stato migrato

Questo è intenzionale. OpenSpec non elimina mai automaticamente `project.md` perché potrebbe contenere contesto che hai scritto. Sposta le parti utili nella sezione `context:` di `config.yaml`, quindi eliminalo tu stesso. La [Guida alla Migrazione](migration-guide.md#migrating-projectmd-to-configyaml) descrive questo processo, inclusa una richiesta che puoi dare al tuo AI per fare la distillazione.

## Ancora bloccato?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dal tuo terminale:** `openspec feedback "what went wrong"` apre un issue per te.

Quando segnalate un problema, includete la versione di OpenSpec (`openspec --version`), la vostra versione di Node (`node --version`), il vostro strumento AI e il comando esatto e l'output. Questo rende l'aiuto molto più veloce.