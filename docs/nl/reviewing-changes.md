# Een wijziging beoordelen

Het hele belofte van OpenSpec is dat jij en je AI **eens worden over wat er gebouwd moet worden voordat er code wordt geschreven.** Die overeenkomst heeft alleen betekenis als je daadwerkelijk leest wat de AI heeft opgesteld. Deze pagina gaat over die twee minuten waar je dat doet — wat je opent, in welke volgorde, en waar je op moet letten.

De inzet is eenvoudig: een verkeerde afslag oppakken in een plan van een alinea is bijna gratis. Dezelfde verkeerde afslag oppakken in 300 regels code is dat niet. Beoordeling is waar je die inzet incasseert.

## De twee momenten waarop je beoordeelt

Er zijn er precies twee:

```
/opsx:propose ──► HET PLAN BEOORDELEN ──► /opsx:apply ──► DE CODE BEOORDELEN ──► /opsx:archive
                  (voordat er code is)                    (/opsx:verify)
```

1. **Na `/opsx:propose`** (of `/opsx:ff`), voor `/opsx:apply` — lees het plan terwijl het nog slechts woorden zijn.
2. **Na het bouwen**, met `/opsx:verify` — controleer of de code daadwerkelijk heeft gedaan wat het plan zei.

De eerste beoordeling is degene die je het meeste bespaart, en degene die mensen overslaan. Deze pagina besteedt daar het meeste tijd aan.

## Lees het in deze volgorde

Een wijziging is een map met gewone Markdown in `openspec/changes/<name>/`. Lees de bestanden in de volgorde die je zo snel mogelijk laat stoppen als er iets mis is:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. de intentie en scope   ← als dit fout is, stop hier
├── specs/…/spec.md  2. de vereisten            ← het hart van de beoordeling
├── design.md        (alleen voor grotere wijzigingen) — de technische aanpak
└── tasks.md         3. het werkplan
```

Je hoeft niet elke regel te lezen. Je moet drie vragen beantwoorden, één per bestand.

## Het voorstel: is dit het juiste probleem?

Open eerst `proposal.md`. Het vangt het "waarom" en "wat" — de intentie, de scope, de aanpak in een of twee alinea's.

**Wat goed eruitziet:** één duidelijke intentie, een scope die je herkent, en een reden waarom het de moeite waard is om het nu te doen.

**Rode vlaggen:**

- Het lost een iets *ander* probleem op dan hetgene waar je om vroeg.
- De scope is gegroeid — je vroeg om een thema-schakelaar en het voorstel raakt ook authenticatie "terwijl we er toch zijn."
- Het is vaag. "Verbeter de instellingenpagina" is geen scope; "voeg een donkermodus-schakelaar toe die de OS-voorkeur respecteert" is wel.

**De vraag om te beantwoorden:** *Komt dit overeen met wat ik daadwerkelijk heb gevraagd, en sluipt er iets binnen?* Als het antwoord nee is, stop — lees niet verder, repareer het voorstel (zie [Terugduwen is goedkoop](#pushing-back-is-cheap)).

## De spec-delta's: is "klaar" correct gedefinieerd?

Dit is het hart van de beoordeling. De delta-specificaties onder `specs/` zeggen wat er *waar* zal zijn als de wijziging wordt uitgerold — als vereisten en de scenario's die ze bewijzen:

```markdown
## ADDED Vereisten

### Vereiste: Donkermodus-schakelaar
Het systeem SHALL een gebruiker in staat stellen te schakelen tussen lichte en donkere thema's.

#### Scenario: Respecteert de OS-voorkeur bij eerste laden
- GIVEN een gebruiker die nog nooit een thema heeft ingesteld
- WHEN ze de app openen op een apparaat dat is ingesteld op donkere modus
- THEN wordt de app weergegeven in donkere modus
```

**Wat een goede vereiste eruitziet:** één duidelijke `SHALL`/`MUST` uitspraak die je aan een tester kunt geven, en tenminste één scenario waarvan de GIVEN/WHEN/THEN daadwerkelijk die uitspraak uitoefent.

**Rode vlaggen:**

- **Een vage vereiste.** "Het systeem SHALL snel zijn" kan niet worden gebouwd of getest. Wat is snel?
- **Een vereiste zonder scenario**, of een scenario dat de vereiste waar het onder staat niet test.
- **De meest waardevolle vangst van allemaal: wat er ontbreekt.** De AI noteert trouw wat je *zei*. Je werk is opmerken wat je *vergeten* bent te zeggen. Als je het meest om het OS-voorkeur-geval gaf en geen scenario het vermeldt, dan betaalt de beoordeling zichzelf terug.

Lees de delta's met de vraag *zou ik blij zijn als het systeem precies — en alleen — dit doet?* Hier gaat het nog niet over code, dus het blijft goedkoop om te veranderen.

## De taken: is het werkplan verstandig?

Open `tasks.md` als laatste. Het is de implementatiecontrolelijst die de AI zal doorlopen.

**Wat goed eruitziet:** geordende stappen, elk traceerbaar naar een vereiste, niets mysterieus.

**Rode vlaggen:**

- Een taak zonder overeenkomende vereiste (waar komt die vandaan?).
- Eén grote "implementeer de functie"-taak die alle echte beslissingen verbergt.
- Een taak die iets aanraakt buiten de scope die je zojuist hebt goedgekeurd.

Je bent hier niet bezig met schatten of micromanagen — je controleert of het plan overeenkomt met de vereisten die je al hebt geaccepteerd.

## Terugduwen is goedkoop {#pushing-back-is-cheap}

Als een van de drie vragen onjuist uitviel, zeg dat dan. Er zijn geen fasen en niets is vergrendeld — je repareert het en gaat verder. Twee manieren, exact zoals in [Een wijziging bewerken](editing-changes.md):

- **Bewerk het bestand zelf.** Het is gewone Markdown; verander de scoperegel, maak een vereiste strakker, verwijder een taak.
- **Vertel de AI wat er mis is** en laat het herzien: *"verwijder de authenticatiewijzigingen — buiten scope,"* *"voeg een scenario toe voor wanneer de gebruiker al een thema heeft gekozen,"* *"split taak 3 op in schema en UI."*

Lees daarna het deel dat je hebt gewijzigd opnieuw. Herzie het totdat het een plan is waar je je handtekening onder zet. Die heen-en-weer *is* het product dat werkt.

## Na de code: verifiëren

Zodra het werk is gebouwd, is `/opsx:verify` je tweede beoordeling. Het leest de artefacten en de code opnieuw en rapporteert afwijkingen op drie dimensies:

| Dimensie | Wat het controleert |
|-----------|---------------------|
| **Volledigheid** | Elke taak gedaan, elke vereiste geïmplementeerd, scenario's gedekt |
| **Correctheid** | De implementatie komt overeen met de intentie van de specificatie, randgevallen behandeld |
| **Samenhang** | Ontwerpbeslissingen komen daadwerkelijk terug in de code |

```
Jij: /opsx:verify

AI:  Verifiëren van add-dark-mode...

     VOLLEDIGHEID
     ✓ Alle 8 taken in tasks.md zijn gecontroleerd
     ✓ Alle vereisten in specs hebben overeenkomende code
     ⚠ Scenario "Respecteert de OS-voorkeur bij eerste laden" heeft geen testdekking
```

Het markeert problemen als CRITICAL, WARNING of SUGGESTION, en het blokkeert **niet** archiveren — het toont de hiaten en laat de keuze aan jou. Dit is het verschil tussen "heeft de AI code geschreven" en "heeft het gebouwd wat we afgesproken hebben."

`/opsx:verify` staat in het uitgebreide profiel. Als je het niet hebt, zet het aan met `openspec config profile` (daarna `openspec update`), of lees de wijziging en het diff zelf opnieuw.

## Maak de beoordeling de juiste omvang

Niet elke wijziging verdient de volledige controle. Een een-bestands-typo-fix verdient een twintig seconden durende blik. Een wijziging die authenticatie, betalingen of gegevens aanraakt die je niet kunt herstellen verdient elke vraag hierboven. Het punt was nooit ceremonie — het is je aandacht besteden waar een fout kostbaar zou zijn, en blikken waar het dat niet zou zijn.

## De twee-minutencontrolelijst

- [ ] De intentie van het voorstel komt overeen met wat ik heb gevraagd.
- [ ] Er is niets extraars de scope in geslopen.
- [ ] Elke vereiste is specifiek genoeg om te testen.
- [ ] Elke vereiste heeft een scenario dat daadwerkelijk uitoefent.
- [ ] Het geval waar ik het meest om geef is gedekt.
- [ ] Taken koppelen aan vereisten; niets is mysterieus of buiten scope.
- [ ] Ik zou me op mijn gemak voelen als de AI precies dit bouwde en niets meer.

Als alle zeven passeren, voer `/opsx:apply` uit met vertrouwen. Als er een faalt, dat is geen tegenslag — het zijn de twee minuten die hun werk doen.

## Waar gaat het naartoe

- [Goede specificaties schrijven](writing-specs.md) — de keerzijde: hoe vereisten en scenario's op te stellen die het waard zijn om goedgekeurd te worden.
- [Een wijziging bewerken & itereren](editing-changes.md) — de mechanica van het wijzigen van een plan nadat je bent begonnen.
- [Workflows](workflows.md) — waar beoordeling past in de grotere lus.