# Installazione

## Prerequisiti

- **Node.js 20.19.0 o superiore** — Controlla la versione: `node --version`

## Gestori di pacchetti

### npm

```bash
npm install -g @fission-ai/openspec@latest
```

### pnpm

```bash
pnpm add -g @fission-ai/openspec@latest
```

### yarn

```bash
yarn global add @fission-ai/openspec@latest
```

### bun

Bun può installare OpenSpec globalmente, ma OpenSpec funziona attualmente su Node.js.
Hai comunque bisogno di avere Node.js 20.19.0 o superiore disponibile in `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Esegui OpenSpec direttamente senza installazione:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Oppure installa nel tuo profilo:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Oppure aggiungilo all'ambiente di sviluppo in `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:Fission-AI/OpenSpec";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## Verifica l'installazione

```bash
openspec --version
```

## Aggiornamento

Aggiorna il pacchetto e poi aggiorna i file generati di ogni progetto:

```bash
npm install -g @fission-ai/openspec@latest   # o equivalente pnpm/yarn/bun
openspec update                              # esegui all'interno di ogni progetto
```

`openspec update` rigenera i file delle skill e dei comandi per gli strumenti che hai configurato, in modo che i tuoi comandi slash rimangano aggiornati rispetto alla versione installata.

## Disinstallazione

Non esiste un comando `openspec uninstall`, perché OpenSpec è semplicemente un pacchetto globale più alcuni file nel tuo progetto. La sua rimozione richiede alcuni passaggi manuali e nulla qui tocca il tuo codice sorgente.

**1. Rimuovi il pacchetto globale:**

```bash
npm uninstall -g @fission-ai/openspec   # o: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Rimuovi OpenSpec da un progetto (opzionale).** Elimina la directory `openspec/` se non desideri più le sue specifiche e modifiche:

```bash
rm -rf openspec/
```

Pensa bene prima di farlo: `openspec/specs/` e `openspec/changes/archive/` sono il tuo registro del comportamento del sistema e del motivo del cambiamento. Se desideri questa cronologia, conserva la cartella (o tienila in git) anche dopo la disinstallazione.

**3. Rimuovi i file degli strumenti AI generati (opzionale).** OpenSpec scrive i file delle skill e dei comandi nelle directory specifiche per strumento, come `.claude/skills/openspec-`, `.cursor/commands/opsx-`, ecc. Elimina le skill `openspec-` e i comandi `opsx-` per gli strumenti che hai configurato. I percorsi esatti per ogni strumento sono elencati in [Supported Tools](supported-tools.md).

Se hai anche dei blocchi di marcatura OpenSpec in file come `CLAUDE.md` o `AGENTS.md`, rimuovi quei blocchi manualmente; il tuo contenuto in quei file è tuo da conservare.

## Prossimi Passaggi

Dopo l'installazione, inizializza OpenSpec nel tuo progetto:

```bash
cd your-project
openspec init
```

Consulta [Getting Started](getting-started.md) per una guida completa.