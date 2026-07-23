# Risoluzione dei problemi

Soluzioni concrete per problemi concreti. Ogni voce riporta un sintomo, spiega la causa probabile in una frase e ti fornisce la soluzione. Se non trovi il tuo problema qui, le [FAQ](faq.md) potrebbero aiutarti, e il [Discord](https://discord.gg/YctCnvvshC) sicuramente sì.

## Installazione e configurazione

### `openspec: command not found`

La CLI non è installata, o la tua shell non riesce a trovarla. Installala globalmente e verifica:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Se è stata installata ma non viene comunque trovata, probabilmente la directory bin globale di npm non è presente nel tuo `PATH`. Esegui `npm bin -g` per vedere dove si trovano i binari globali, e assicurati che questo percorso sia presente nel profilo della tua shell.

### "Requires Node.js 20.19.0 or higher"

OpenSpec richiede Node.js 20.19.0 o superiore. Verifica la tua versione e aggiorna se necessario:

```bash
node --version
```

Se usi bun per installare OpenSpec, tieni presente che OpenSpec viene comunque *eseguito* su Node, quindi hai bisogno di Node 20.19.0 o superiore disponibile nel tuo `PATH` in ogni caso. Vedi [Installazione](installation.md).

### `openspec init` didn't configure my AI tool

Il comando `init` chiede quali strumenti configurare. Se hai saltato il tuo strumento o vuoi aggiungerne un altro, basta eseguirlo di nuovo, o usa la versione non interattiva:

```bash
openspec init --tools claude,cursor
```

L'elenco completo degli ID degli strumenti è in [Strumenti supportati](supported-tools.md). Usa `--tools all` per tutti gli strumenti, `--tools none` per saltare la configurazione degli strumenti.

## I comandi non vengono visualizzati

Se `/opsx:propose` (o l'equivalente del tuo strumento) non appare o non fa nulla, segui questo elenco in ordine. Sono ordinati dal controllo più veloce al più lento.

1. **Potresti essere nel posto sbagliato.** I comandi slash vanno inseriti nella chat del tuo assistente AI, non nel terminale. Se hai digitato `/opsx:propose` nella shell, quello è il problema. Vedi [Come funzionano i comandi](how-commands-work.md).

2. **Rigenera i file.** Dalla root del tuo progetto:

   ```bash
   openspec update
   ```

   Questo riscrive i file di competenze e comandi per ogni strumento che hai configurato.

3. **Riavvia il tuo assistente.** La maggior parte degli strumenti scansiona competenze e comandi all'avvio. Spesso basta aprire una nuova finestra.

4. **Verifica che i file esistano.** Per Claude Code, controlla che la cartella `.claude/skills/` contenga le cartelle `openspec-*`. Gli altri strumenti usano le proprie directory, tutte elencate in [Strumenti supportati](supported-tools.md).

5. **Verifica di aver inizializzato questo progetto.** Le competenze vengono scritte per progetto. Se hai clonato una repository o cambiato cartella, esegui `openspec init` (o `openspec update`) in quella posizione.

6. **Verifica che il tuo strumento supporti i file di comando.** Codex e alcuni altri strumenti (CodeArts, Kimi CLI, ForgeCode, Mistral Vibe) non ricevono i file di comando `opsx-*` generati; usano invece invocazioni basate su competenze. Per Codex, controlla `.codex/skills/openspec-*`. Le forme differiscono per strumento: vedi [Strumenti supportati](supported-tools.md) e [Come funzionano i comandi](how-commands-work.md#sintassi-dei-comandi-slash-per-strumento).

## Lavorare con le modifiche

### "Change not found"

Il comando non riesce a capire quale modifica intendevi. Nominala esplicitamente, o controlla cosa esiste:

```bash
openspec list                    # vedi le modifiche attive
/opsx:apply add-dark-mode        # nomina la modifica nella chat
```

Inoltre verifica di essere nella directory di progetto corretta.

### "No artifacts ready"

Ogni artefatto è o già creato, o bloccato in attesa di una dipendenza. Controlla cosa sta bloccando:

```bash
openspec status --change <name>
```

Poi crea prima la dipendenza mancante. Ricorda l'ordine: la proposta abilita le specifiche e il design; le specifiche e il design insieme abilitano le attività.

### `openspec validate` reports warnings or errors

La convalida controlla le tue specifiche e modifiche per problemi strutturali. Leggi il messaggio: riporta il nome del file e il problema.

```bash
openspec validate <name>           # convalida un solo elemento
openspec validate --all            # convalida tutto
openspec validate --all --strict   # controlli più rigorosi, adatti per CI
```

Le cause più comuni sono una sezione obbligatoria mancante (come una specifica senza scenari) o un'intestazione delta malformata. Correggi il file e riesegui il comando. Il [riferimento CLI](cli.md#openspec-validate) documenta il formato di output.

### The AI created incomplete or wrong artifacts

L'AI non aveva abbastanza contesto. Alcune opzioni aiutano:

- Aggiungi il contesto del progetto in `openspec/config.yaml` in modo che il tuo stack e le tue convenzioni vengano inserite in ogni richiesta. Vedi [Personalizzazione](customization.md#project-configuration).
- Aggiungi le `rules:` per artefatto per indicazioni che si applicano solo, ad esempio, alle specifiche.
- Fornisci una descrizione più dettagliata quando proponi una modifica.
- Usa la versione estesa di `/opsx:continue` per creare un artefatto alla volta e revisionarlo, invece di `/opsx:ff` che li crea tutti in una volta.

### Archive won't finish, or warns about incomplete tasks

L'archiviazione non si *bloccherà* per attività incomplete, ma ti avverte, perché archiviare di solito significa che il lavoro è terminato. Se le attività rimangono intenzionalmente (stai archiviando una modifica parziale), procedi. Altrimenti termina prima le attività. L'archiviazione ti offrirà anche di sincronizzare le tue specifiche delta nelle specifiche principali se non l'hai ancora fatto; accetta a meno che tu non abbia un motivo per non farlo.

## Configurazione

### My `config.yaml` isn't being applied

Tre sospetti abituali:

1. **Nome file sbagliato.** Deve essere `openspec/config.yaml`, non `.yml`.
2. **YAML non valido.** Esegui una validazione con un qualsiasi validatore YAML; la CLI riporta anche errori di sintassi con i numeri di riga.
3. **Ti aspettavi un riavvio.** Non è necessario. Le modifiche alla configurazione hanno effetto immediato.

### "Unknown artifact ID in rules: X"

Una chiave sotto `rules:` non corrisponde a nessun artefatto nel tuo schema. Per lo schema predefinito `spec-driven` gli ID validi sono `proposal`, `specs`, `design`, `tasks`. Per vedere gli ID di qualsiasi schema:

```bash
openspec schemas --json
```

### "Context too large"

Il campo `context:` è limitato a 50KB di proposito, perché viene inserito in ogni richiesta. Riassumilo, o inserisci un link a documenti più lunghi invece di incollarli. Un contesto più compatto produce anche risultati migliori e più veloci.

### "Schema not found"

Il nome dello schema che hai indicato non esiste. Elenca quelli disponibili e controlla l'ortografia:

```bash
openspec schemas                    # elenca gli schemi disponibili
openspec schema which <name>        # vedi da dove viene risolto uno schema
openspec schema init <name>         # crea uno schema personalizzato
```

Vedi [Personalizzazione](customization.md#custom-schemas).

## Migrazione dal flusso di lavoro legacy

### "Legacy files detected in non-interactive mode"

Sei in un ambiente CI o in una shell non interattiva, e OpenSpec ha trovato vecchi file da pulire ma non può chiederti conferma. Approva automaticamente:

```bash
openspec init --force
```

Per Codex, OpenSpec potrebbe rilevare vecchi file di prompt gestiti in `$CODEX_HOME/prompts` o `~/.codex/prompts`. Questa pulizia è limitata ai nomi di file di prompt Codex legacy consentiti da OpenSpec, e il `openspec init` non interattivo rimuove solo i file per cui esistono le competenze sostitutive `.codex/skills/openspec-*`. Il `openspec update` non interattivo lascia intatta tutta la pulizia dei file legacy a meno che non passi il flag `--force`.

### Commands didn't appear after migrating

Riavvia il tuo IDE. Le competenze vengono rilevate all'avvio. Se non dovessero apparire comunque, esegui `openspec update` e controlla le posizioni dei file in [Strumenti supportati](supported-tools.md).

### My old `project.md` wasn't migrated

È intenzionale. OpenSpec non elimina mai `project.md` automaticamente perché potrebbe contenere contesto che hai scritto tu. Sposta le parti utili nella sezione `context:` di `config.yaml`, poi eliminalo tu stesso. La [Guida alla migrazione](migration-guide.md#migrating-projectmd-to-configyaml) ti accompagna in questo processo, incluso un prompt che puoi dare alla tua AI per effettuare la distillazione.

## Ancora bloccato?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dal tuo terminale:** `openspec feedback "cosa è andato storto"` apre una issue per te.

Quando segnali un problema, includi la tua versione di OpenSpec (`openspec --version`), la tua versione di Node (`node --version`), il tuo strumento AI, e il comando e l'output esatti. Questo rende l'aiuto molto più veloce.