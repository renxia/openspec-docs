# Troubleshooting

Concrete oplossingen voor concrete problemen. Elke vermelding noemt een symptoom, legt de waarschijnlijke oorzaak in één zin uit en geeft u de oplossing. Als u uw probleem hier niet ziet, kan de [FAQ](faq.md) helpen, en de [Discord](https://discord.gg/YctCnvvshC) zal dat zeker doen.

## Installatie en setup

### `openspec: command not found`

De CLI is niet geïnstalleerd, of uw shell kan deze niet vinden. Installeer het globaal en controleer:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Als het geïnstalleerd is maar nog steeds niet wordt gevonden, staat de globale npm bin-directory waarschijnlijk niet in uw `PATH`. Voer `npm bin -g` uit om te zien waar de globale binaries zich bevinden, en zorg ervoor dat die paden in uw shell-profiel staan.

### "Requires Node.js 20.19.0 or higher"

OpenSpec draait op Node 20.19.0+. Controleer uw versie en upgrade indien nodig:

```bash
node --version
```

Als u bun gebruikt om OpenSpec te installeren, let op dat OpenSpec nog steeds draait op Node, dus u heeft Node 20.19.0+ nodig beschikbaar in uw `PATH`, ongeacht wat. Zie [Installatie](installation.md).

### `openspec init` didn't configure my AI tool

Init vraagt welke tools moeten worden ingesteld. Als u uw tool overgeslagen heeft of nog een andere wilt toevoegen, voer het dan opnieuw uit, of gebruik de niet-interactieve vorm:

```bash
openspec init --tools claude,cursor
```

De volledige lijst met tool ID's staat in [Ondersteunde Tools](supported-tools.md). Gebruik `--tools all` voor alles, en `--tools none` om de toolsetup over te slaan.

## Commando's verschijnen niet

Als `/opsx:propose` (of het equivalent van uw tool) niet verschijnt of niets doet, werk dan door deze lijst heen. Ze zijn gerangschikt van snelst te controleren naar laatste.

1. **U bevindt zich mogelijk op de verkeerde plek.** Slash commands gaan in het chatvenster van uw AI-assistent, niet in uw terminal. Als u `/opsx:propose` in uw shell heeft getypt, is dat het probleem. Zie [Hoe Commando's Werken](how-commands-work.md).

2. **Regeneer de bestanden.** Vanuit de projectroot:

   ```bash
   openspec update
   ```

   Dit herschrijft de skill- en commando-bestanden voor elke geconfigureerde tool.

3. **Herstart uw assistent.** De meeste tools scannen bij het opstarten naar skills en commando's. Een nieuw venster doet dit vaak al.

4. **Controleer of de bestanden bestaan.** Voor Claude Code controleer of `.claude/skills/` de `openspec-*` mappen bevat. Andere tools gebruiken hun eigen mappen, allemaal vermeld in [Ondersteunde Tools](supported-tools.md).

5. **Controleer of u dit project heeft geïnitialiseerd.** Skills worden geschreven per project. Als u een repository heeft gekloond of van mappen heeft gewisseld, voer dan `openspec init` (of `openspec update`) daar uit.

6. **Bevestig dat uw tool commando-bestanden ondersteunt.** Een paar tools (Kimi CLI, Trae, ForgeCode, Mistral Vibe) krijgen geen gegenereerde `opsx-*` commando-bestanden; ze gebruiken in plaats daarvan skill-gebaseerde aanroepen. De formulieren verschillen per tool: zie [Ondersteunde Tools](supported-tools.md) en [Hoe Commando's Werken](how-commands-work.md#slash-command-syntax-by-tool).

## Werken met wijzigingen

### "Change not found"

Het commando kon niet bepalen welke wijziging u bedoelde. Benoem het expliciet, of controleer wat er bestaat:

```bash
openspec list                    # zie actieve wijzigingen
/opsx:apply add-dark-mode        # benoem de wijziging in chat
```

Bevestig ook dat u zich in de juiste projectmap bevindt.

### "No artifacts ready"

Elk artefact is of al aangemaakt, of geblokkeerd in afwachting van een afhankelijkheid. Zie wat blokkeert:

```bash
openspec status --change <name>
```

Maak daarna eerst de ontbrekende afhankelijkheid aan. Onthoud de volgorde: een voorstel maakt specs en ontwerp mogelijk; specs en ontwerp samen maken taken mogelijk.

### `openspec validate` rapporteert waarschuwingen of fouten

Validatie controleert uw specs en wijzigingen op structurele problemen. Lees de boodschap: deze noemt het bestand en het probleem.

```bash
openspec validate <name>           # valideer één item
openspec validate --all            # valideer alles
openspec validate --all --strict   # strengere controles, goed voor CI
```

Veelvoorkomende oorzaken zijn een ontbrekende vereiste sectie (zoals een spec zonder scenario's) of een verkeerd gevormde delta header. Los het bestand op en voer opnieuw uit. De [CLI-referentie](cli.md#openspec-validate) documenteert het uitvoerformaat.

### De AI heeft onvolledige of verkeerde artefacten gemaakt

De AI had niet genoeg context. Een paar dingen kunnen helpen:

- Voeg projectcontext toe in `openspec/config.yaml` zodat uw stack en conventies in elke aanvraagestelling worden ingevoegd. Zie [Aanpassing](customization.md#project-configuration).
- Voeg per artefact `rules:` toe voor richtlijnen die alleen gelden voor, bijvoorbeeld, specs.
- Geef een gedetailleerdere beschrijving wanneer u een voorstel doet.
- Gebruik de uitgebreide `/opsx:continue` om één artefact tegelijk aan te maken en elk te beoordelen, in plaats van dat `/opsx:ff` ze allemaal tegelijkertijd uitvoert.

### Archive wil niet klaar zijn, of waarschuwt over onvoltooide taken

Archive zal niet *blokkeren* op onvoltooide taken, maar het waarschuwt u, omdat archiveren meestal betekent dat het werk is voltooid. Als de taken bewust blijven bestaan (u dient een gedeeltelijke wijziging in), ga dan verder. Zo niet, maak eerst de taken af. Archive biedt ook aan om uw delta specs te synchroniseren met de hoofdspecs als u dit nog niet heeft gedaan; zeg ja tenzij u een reden heeft om nee te zeggen.

## Configuratie

### Mijn `config.yaml` wordt niet toegepast

Drie gebruikelijke verdachten:

1. **Verkeerde bestandsnaam.** Het moet `openspec/config.yaml` zijn, niet `.yml`.
2. **Ongeldig YAML.** Voer het door een YAML-valideerder; de CLI rapporteert ook syntaxisfouten met regelnummers.
3. **U verwachtte een herstart.** U heeft die niet nodig. Configuratiewijzigingen hebben onmiddellijk effect.

### "Unknown artifact ID in rules: X"

Een sleutel onder `rules:` komt niet overeen met een artefact in uw schema. Voor het standaard `spec-driven` schema zijn de geldige ID's `proposal`, `specs`, `design`, `tasks`. Om de ID's voor elk schema te zien:

```bash
openspec schemas --json
```

### "Context too large"

Het `context:` veld is beperkt tot 50KB, en dat is opzettelijk, omdat het in elke aanvraagestelling wordt ingevoegd. Vat het samen, of link naar langere documentatie in plaats van ze te plakken. Een beknopt context levert ook betere, snellere resultaten op.

### "Schema not found"

Het opgegeven schema bestaat niet. Listeer wat er beschikbaar is en controleer de spelling:

```bash
openspec schemas                    # listeer beschikbare schemas
openspec schema which <name>        # zie waar een schema van wordt opgelost
openspec schema init <name>         # maak een aangepast schema aan
```

Zie [Aanpassing](customization.md#custom-schemas).

## Migratie van de legacy-workflow

### "Legacy files detected in non-interactive mode"

U bevindt zich in CI of een niet-interactieve shell, en OpenSpec heeft oude bestanden gevonden om op te ruimen maar kan u niet vragen om goedkeuring. Keur dit automatisch goed:

```bash
openspec init --force
```

### Commando's verschenen niet na migratie

Herstart uw IDE. Skills worden gedetecteerd bij het opstarten. Als ze nog steeds niet verschijnen, voer dan `openspec update` uit en controleer de bestandspaden in [Ondersteunde Tools](supported-tools.md).

### Mijn oude `project.md` is niet gemigreerd

Dat is opzettelijk. OpenSpec verwijdert `project.md` nooit automatisch omdat het context kan bevatten die u heeft geschreven. Verplaats de nuttige delen naar de `context:` sectie van `config.yaml`, en verwijder het vervolgens zelf. De [Migratiehandleiding](migration-guide.md#migrating-projectmd-to-configyaml) beschrijft dit, inclusief een prompt die u aan uw AI kunt geven om de samenvatting te maken.

## Nog steeds vastgelopen?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Vanuit uw terminal:** `openspec feedback "what went wrong"` opent een issue voor u.

Wanneer u een probleem rapporteert, vermeld dan uw OpenSpec-versie (`openspec --version`), uw Node-versie (`node --version`), uw AI-tool en het exacte commando en de uitvoer. Dit maakt hulp veel sneller.