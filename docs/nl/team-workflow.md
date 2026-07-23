# OpenSpec in een team

Alles in de andere handleidingen werkt hetzelfde, of je nu alleen werkt of in een team van twintig personen. Wat verandert in een team zijn de vragen rond de randen: waar leven de specificaties, hoe beoordelen teamleden een plan, en hoe past dit allemaal in de pull-verzoek werkwijze die we al hebben?

Het korte antwoord: een wijziging is gewoon een verzameling bestanden, en OpenSpec raakt git nooit. Dus het past in je bestaande werkwijze in plaats van deze te vervangen. Deze pagina legt de conventies uit die goed werken.

## Eén regel: OpenSpec raakt git niet

OpenSpec leest en schrijft platte Markdown onder `openspec/`. Het committeert nooit, maakt geen takken, pushed of pulled nooit in je project — en het kloont of synchroniseert nooit zelf een [store](stores-beta/user-guide.md). Dat betekent:

- **Je committeert `openspec/` zoals elke andere broncode.** Specificaties, actieve wijzigingen en het archief maken deel uit van de geschiedenis van je project. (Ja, commit de hele map — zie de [FAQ](faq.md#should-i-commit-the-openspec-folder-to-git).)
- **Een wijziging is een map die je versioneert zoals code.** `openspec/changes/add-dark-mode/` is gewoon bestanden op een tak.
- **Alles hieronder is conventie, geen verplichting.** OpenSpec dwingt je niet om het op deze manier te doen; het past gewoon netjes.

## De alledaagse loop

De werkwijze die goed werkt, koppelt een wijziging aan een tak en een pull-verzoek:

```
git switch -c add-dark-mode        start een tak, zoals gewoonlijk
   │
/opsx:propose add-dark-mode        maak een concept van het plan (voorstel + specificaties + taken)
   │
BEOORDEEL HET PLAN                 je leest het voordat je code schrijft — zie Een wijziging beoordelen
   │
/opsx:apply                        bouw het; artefacten + code wijzigen samen
   │
git commit && open a PR            het PR bevat de specificatie-delta EN de code
   │
teamgenoot beoordeelt, voegt samen
   │
/opsx:archive                      voeg de delta toe aan specs/, verplaats de wijziging naar archive/
```

Het plan en de code staan naast elkaar in dezelfde tak, dus je teamleden beoordelen beide samen, en zes maanden later legt de gearchiveerde specificatie nog steeds uit waarom de code er uitziet zoals hij is.

## Specificaties beoordelen in een pull-verzoek

Dit is waar een team de meerwaarde voelt. Wanneer een PR de delta-specificatie van de wijziging bevat, krijgt de beoordelaar iets wat een kale diff nooit geeft: **een uitleg in gewone taal van wat deze wijziging moet doen**, voordat ze een enkele regel code lezen.

Een goede volgorde voor de beoordelaar:

1. **Lees `proposal.md`** — is dit het juiste probleem en de juiste scope?
2. **Lees de delta onder `specs/`** — is 'klaar' correct gedefinieerd? (Dit is de [Een wijziging beoordelen](reviewing-changes.md) twee-minuten beoordeling, nu plaatsvindend in de PR.)
3. **Lees daarna de code-diff** — levert het precies die vereisten op?

Een beoordelaar die het oneens is met de *aanpak*, kan dit goedkoop tegen het voorstel zeggen, in plaats van het opnieuw te bespreken over 300 regels code. Plaats de delta-specificatie bovenaan de PR-beschrijving, of wijs beoordelaars op de wijzigingsmap, zodat ze daar beginnen.

## Wanneer archiveren

Archiveren voegt de delta's van een wijziging toe aan je hoofdmap `openspec/specs/` en verplaatst de wijzigingsmap naar `openspec/changes/archive/YYYY-MM-DD-<name>/`. Omdat `specs/` de **gedeelde bron der waarheid** is, is de timing belangrijk in een team. Twee bruikbare conventies:

- **Archiveer na het samenvoegen van de PR (aanbevolen).** De tak draagt de actieve wijziging; zodra deze is samengevoegd met je hoofdtak, archiveer je daar (vaak een kleine vervolgcommit of een geplande opruiming). Dit zorgt ervoor dat de gedeelde `specs/` alleen vooruitgaat met werk dat daadwerkelijk is uitgerold.
- **Archiveer binnen de PR.** Eenvoudiger voor kleine teams: dezelfde PR die de code toevoegt, synchroniseert en archiveert ook. Het nadeel is dat je `specs/` diff en je code diff samen landen, wat de PR ruisiger kan maken.

Kies er een en wees consequent. In beide gevallen controleert `/opsx:archive` of taken zijn voltooid en biedt het eerst aan om te synchroniseren, zodat niets per ongeluk onafgewerkt wordt samengevoegd.

## Twee personen, parallelle wijzigingen

Omdat wijzigingen aparte mappen zijn, botsen ze niet:

- **Verschillende wijzigingen, verschillende personen — geen probleem.** `add-dark-mode` en `rate-limit-login` zijn verschillende mappen op verschillende takken; ze raken elkaar nooit totdat ze beide zijn gearchiveerd.
- **Eén wijziging, één eigenaar.** Twee personen die dezelfde wijzigingsmap bewerken, krijgen precies hetzelfde conflict als twee personen die hetzelfde bestand bewerken. Houd een wijziging bij één auteur, of splits het in twee wijzigingen (nog een reden om [de juiste grootte kiezen](writing-specs.md#right-size-the-change)).
- **De ene plaats waar conflicten voorkomen is `specs/`.** Als twee wijzigingen beide dezelfde vereiste aanpassen, zal het archiveren van de tweede een conflict veroorzaken in `openspec/specs/…/spec.md` — los het op zoals elk merge-conflict, en behoud de vereiste die de werkelijkheid weerspiegelt. Dit is zeldzaam, en het is een functie: het is git die je vertelt dat twee wijzigingen het oneens waren over hoe het systeem moet werken.

## Wanneer planning uitgroeit tot één repository

Alles hierboven gaat ervan uit dat het plan in de eigen `openspec/` map van de code repository staat, wat de juiste standaard is. Wanneer je planning daadwerkelijk meerdere repositories of teams overspant — één functie die drie services raakt, of vereisten die één team bezit en anderen gebruiken — is dat wat de bèta **stores** functie is voor: planning krijgt zijn eigen repository waar elke code repository naar kan verwijzen. Begin met de [Gebruikershandleiding voor Stores](stores-beta/user-guide.md).

## Waar gaat het naartoe

- [Een wijziging beoordelen](reviewing-changes.md) — de beoordelingsronde, nu binnen je PR.
- [Goede specificaties schrijven](writing-specs.md) — inclusief hoe je een wijziging de juiste grootte geeft zodat het in één tak past.
- [Gebruikershandleiding voor Stores](stores-beta/user-guide.md) — planning die repositories en teams overspant.