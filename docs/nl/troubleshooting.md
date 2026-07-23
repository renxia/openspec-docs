# Problemen oplossen

Concrete oplossingen voor concrete problemen. Elke vermelding noemt een symptoom, verklaart de waarschijnlijke oorzaak in een zin en geeft je de oplossing. Als je probleem hier niet staat, kan de [FAQ](faq.md) helpen, en de [Discord](https://discord.gg/YctCnvvshC) zeker.

## Installatie en setup

### `openspec: command not found`

De CLI is niet geïnstalleerd, of je shell kan hem niet vinden. Installeer hem globaal en controleer:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Als hij is geïnstalleerd maar nog steeds niet wordt gevonden, staat je globale npm bin-waarschijnlijk niet in je `PATH`. Voer `npm bin -g` uit om te zien waar globale binaries staan, en zorg dat dat pad in je shell-profiel staat.

### "Vereist Node.js 20.19.0 of hoger"

OpenSpec draait op Node 20.19.0+. Controleer je versie en upgrade indien nodig:

```bash
node --version
```

Als je bun gebruikt om OpenSpec te installeren, let op dat OpenSpec nog steeds *draait* op Node, dus je hebt Node 20.19.0+ beschikbaar nodig in je `PATH`. Zie [Installatie](installation.md).

### `openspec init` heeft mijn AI-tool niet geconfigureerd

Init vraagt welke tools je wilt instellen. Als je jouw tool hebt overgeslagen of er een andere wilt toevoegen, voer het dan gewoon opnieuw uit, of gebruik de niet-interactieve vorm:

```bash
openspec init --tools claude,cursor
```

De volledige lijst met tool-ID's staat in [Ondersteunde Tools](supported-tools.md). Gebruik `--tools all` voor alles, `--tools none` om tool-installatie over te slaan.

## Opdrachten verschijnen niet

Als `/opsx:propose` (of het equivalent van je tool) niet verschijnt of niets doet, werk dan deze lijst af. Ze zijn geordend van het snelst te controleren naar het langzaamst.

1. **Je bent misschien op de verkeerde plaats.** Slash-commando's gaan in de chat van je AI-assistent, niet in je terminal. Als je `/opsx:propose` in je shell hebt getypt, is dat het probleem. Zie [Hoe opdrachten werken](how-commands-work.md).

2. **Genereer de bestanden opnieuw.** Vanuit de root van je project:

   ```bash
   openspec update
   ```

   Dit herschrijft de skill- en opdrachtbestanden voor elke tool die je hebt geconfigureerd.

3. **Herstart je assistent.** De meeste tools scannen bij het opstarten naar skills en opdrachten. Een venster opnieuw opstarten lost het vaak op.

4. **Bevestig dat de bestanden bestaan.** Voor Claude Code, controleer dat `.claude/skills/` `openspec-*` mappen bevat. Andere tools gebruiken hun eigen mappen, allemaal vermeld in [Ondersteunde Tools](supported-tools.md).

5. **Controleer of je dit project hebt geïnitialiseerd.** Skills worden per project geschreven. Als je een repo hebt gekloond of van map bent gewisseld, voer dan `openspec init` (of `openspec update`) uit in die map.

6. **Bevestig dat je tool opdrachtbestanden ondersteunt.** Codex en een paar andere tools (CodeArts, Kimi CLI, ForgeCode, Mistral Vibe) krijgen geen gegenereerde `opsx-*` opdrachtbestanden; ze gebruiken daarvoor skill-gebaseerde aanroepen. Voor Codex, controleer `.codex/skills/openspec-*`. De vormen verschillen per tool: zie [Ondersteunde Tools](supported-tools.md) en [Hoe opdrachten werken](how-commands-work.md#slash-command-syntax-by-tool).

## Werken met wijzigingen

### "Wijziging niet gevonden"

De opdracht kon niet bepalen welke wijziging je bedoelde. Noem het expliciet, of controleer wat er bestaat:

```bash
openspec list                    # zie actieve wijzigingen
/opsx:apply add-dark-mode        # noem de wijziging in chat
```

Bevestig ook dat je in de juiste projectmap bent.

### "Geen artifacts klaar"

Elke artifact is ofwel al gemaakt of geblokkeerd en wacht op een afhankelijkheid. Zie wat er blokkeert:

```bash
openspec status --change <name>
```

Maak dan eerst de ontbrekende afhankelijkheid aan. Onthoud de volgorde: proposal schakelt specs en design in; specs en design samen schakelen tasks in.

### `openspec validate` rapporteert waarschuwingen of fouten

Validatie controleert je specs en wijzigingen op structurele problemen. Lees het bericht: het noemt het bestand en het probleem.

```bash
openspec validate <name>           # valideer één item
openspec validate --all            # valideer alles
openspec validate --all --strict   # strengere controles, goed voor CI
```

Veelvoorkomende oorzaken zijn een ontbrekende vereiste sectie (zoals een spec zonder scenario's) of een misvormde delta-header. Herstel het bestand en voer het opnieuw uit. De [CLI-referentie](cli.md#openspec-validate) documenteert het uitvoerformaat.

### De AI heeft onvolledige of verkeerde artifacts gemaakt

De AI had niet genoeg context. Een paar hefboomen helpen:

- Voeg projectcontext toe in `openspec/config.yaml` zodat je stack en conventies in elk verzoek worden geïnjecteerd. Zie [Aanpassen](customization.md#project-configuration).
- Voeg per-artifact `rules:` toe voor richtlijnen die alleen van toepassing zijn op, bijvoorbeeld, specs.
- Geef een meer gedetailleerde beschrijving wanneer je voorstelt.
- Gebruik de uitgebreide `/opsx:continue` om één artifact tegelijk te maken en elke te beoordelen, in plaats van `/opsx:ff` die ze allemaal tegelijk doet.

### Archiveren wordt niet voltooid, of waarschuwt voor onvolledige taken

Archiveren *blokkeert* niet bij onvolledige taken, maar het waarschuwt je, omdat archiveren meestal betekent dat het werk klaar is. Als taken met opzet overblijven (je dient een gedeeltelijke wijziging in), ga dan door. Anders voltooi je eerst de taken. Archiveren zal ook aanbieden om je delta-specs te synchroniseren met de hoofd-specs als je dat nog niet hebt gedaan; zeg ja, tenzij je een reden hebt om dat niet te doen.

## Configuratie

### Mijn `config.yaml` wordt niet toegepast

Drie gebruikelijke verdachten:

1. **Verkeerde bestandsnaam.** Het moet `openspec/config.yaml` zijn, niet `.yml`.
2. **Ongeldige YAML.** Voer het door een YAML-validator; de CLI rapporteert ook syntaxfouten met regelnummers.
3. **Je verwachtte een herstart.** Die heb je niet nodig. Configuratiewijzigingen worden direct doorgevoerd.

### "Onbekend artifact-ID in regels: X"

Een sleutel onder `rules:` komt niet overeen met een artifact in je schema. Voor het standaard `spec-driven` schema zijn de geldige ID's `proposal`, `specs`, `design`, `tasks`. Om de ID's voor elk schema te zien:

```bash
openspec schemas --json
```

### "Context te groot"

Het `context:` veld is bewust beperkt tot 50KB, omdat het in elk verzoek wordt geïnjecteerd. Vat het samen, of link naar langere documentatie in plaats van ze te plakken. Lean context levert ook betere, snellere resultaten op.

### "Schema niet gevonden"

De schema-naam waarnaar je verweest bestaat niet. Lijst wat beschikbaar is en controleer de spelling:

```bash
openspec schemas                    # lijst beschikbare schema's
openspec schema which <name>        # zie waar een schema vandaan komt
openspec schema init <name>         # maak een aangepaste aan
```

Zie [Aanpassen](customization.md#custom-schemas).

## Migratie van de verouderde workflow

### "Verouderde bestanden gedetecteerd in niet-interactieve modus"

Je bent in CI of een niet-interactieve shell, en OpenSpec heeft oude bestanden gevonden om op te ruimen maar kan je niet vragen. Keur automatisch goed:

```bash
openspec init --force
```

Voor Codex kan OpenSpec oude beheerde prompt-bestanden detecteren in `$CODEX_HOME/prompts` of `~/.codex/prompts`. Die opruiming is beperkt tot OpenSpec's toegestane verouderde Codex prompt-bestandsnamen, en niet-interactieve `openspec init` verwijdert alleen de bestanden waarvan de vervangende `.codex/skills/openspec-*` skills bestaan. Niet-interactieve `openspec update` laat alle verouderde opruiming ongeroerd tenzij je `--force` doorgeeft.

### Opdrachten verschenen niet na migratie

Herstart je IDE. Skills worden gedetecteerd bij het opstarten. Als ze nog steeds niet verschijnen, voer dan `openspec update` uit en controleer de bestandslocaties in [Ondersteunde Tools](supported-tools.md).

### Mijn oude `project.md` is niet gemigreerd

Dat is met opzet. OpenSpec verwijdert `project.md` nooit automatisch omdat het context kan bevatten die je hebt geschreven. Verplaats de nuttige delen naar de `context:` sectie van `config.yaml`, en verwijder het dan zelf. De [Migratiehandleiding](migration-guide.md#migrating-projectmd-to-configyaml) loopt hier doorheen, inclusief een prompt die je aan je AI kunt geven om het destilleren te doen.

## Nog steeds vast?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Vanuit je terminal:** `openspec feedback "wat ging er fout"` opent een issue voor je.

Wanneer je een probleem rapporteert, voeg dan je OpenSpec-versie (`openspec --version`), je Node-versie (`node --version`), je AI-tool en de exacte opdracht en uitvoer toe. Het maakt hulp veel sneller.