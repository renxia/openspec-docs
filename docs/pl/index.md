---
layout: home

hero:
  name: "OpenSpec"
  text: "Rozwój sterowany specyfikacją dla asystentów AI"
  tagline: Lekka specyfikacja do budowania i zarządzania projektami asystentów AI.
  actions:
    - theme: brand
      text: Rozpocznij
      link: ./getting-started
    - theme: alt
      text: Strona główna
      link: /

features:
  - title: Praca od specyfikacji
    details: Zdefiniuj wymagania przed pisaniem kodu.
  - title: Natywna dla AI
    details: Zaprojektowana dla Claude Code, Cursor, Windsurf i innych.
  - title: Wielojęzyczna
    details: Dokumentacja dostępna w wielu językach.
---


Nasza filozofia:

```text
→ płynna, nie sztywna
→ iteracyjna, nie kaskadowa
→ prosta, nie złożona
→ stworzona dla projektów istniejących, nie tylko nowych
→ skalowalna od projektów osobistych po przedsiębiorstwa
```

> [!TIP]
> **Nowy przepływ pracy jest już dostępny!** Przebudowaliśmy OpenSpec z nowym przepływem pracy opartym na artefaktach.
>
> Uruchom `/opsx:propose "twój pomysł"`, aby zacząć. → [Dowiedz się więcej tutaj](opsx.md)

<p align="center">
  Obserwuj <a href="https://x.com/0xTab">@0xTab na X</a>, aby być na bieżąco · Dołącz do <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a>, aby uzyskać pomoc i zadawać pytania.
</p>

## Zobacz to w akcji

```text
Ty: /opsx:propose add-dark-mode
AI:  Utworzono openspec/changes/add-dark-mode/
     ✓ proposal.md — dlaczego to robimy, co się zmienia
     ✓ specs/       — wymagania i scenariusze
     ✓ design.md    — podejście techniczne
     ✓ tasks.md     — lista kontrolna implementacji
     Gotowe do implementacji!

Ty: /opsx:apply
AI:  Implementuję zadania...
     ✓ 1.1 Dodaj dostawcę kontekstu motywu
     ✓ 1.2 Utwórz komponent przełącznika
     ✓ 2.1 Dodaj zmienne CSS
     ✓ 2.2 Podłącz localStorage
     Wszystkie zadania ukończone!

Ty: /opsx:archive
AI:  Zarchiwizowano w openspec/changes/archive/2025-01-23-add-dark-mode/
     Specyfikacje zaktualizowane. Gotowe na następną funkcję.
```

<details>
<summary><strong>Pulpit OpenSpec</strong></summary>
</details>

## Szybki start

**Wymaga Node.js 20.19.0 lub nowszego.**

Zainstaluj OpenSpec globalnie:

```bash
npm install -g @fission-ai/openspec@latest
```

Następnie przejdź do katalogu swojego projektu i zainicjalizuj:

```bash
cd your-project
openspec init
```

Teraz powiedz swojemu AI: `/opsx:propose <co-chcesz-zbudować>`

Jeśli chcesz rozszerzony przepływ pracy (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), wybierz go za pomocą `openspec config profile` i zastosuj za pomocą `openspec update`.

> [!NOTE]
> Nie wiesz, czy Twoje narzędzie jest obsługiwane? [Zobacz pełną listę](supported-tools.md) – obsługujemy ponad 25 narzędzi i ta liczba rośnie.
>
> Działa również z pnpm, yarn, bun i nix. [Zobacz opcje instalacji](installation.md).

## Dokumentacja

→ **[Pierwsze kroki](getting-started.md)**: pierwsze kroki<br>
→ **[Przepływy pracy](workflows.md)**: kombinacje i wzorce<br>
→ **[Polecenia](commands.md)**: komendy ukośnikowe i umiejętności<br>
→ **[CLI](cli.md)**: referencja terminala<br>
→ **[Obsługiwane narzędzia](supported-tools.md)**: integracje narzędzi i ścieżki instalacji<br>
→ **[Koncepcje](concepts.md)**: jak to wszystko się łączy<br>
→ **[Wielojęzyczność](multi-language.md)**: obsługa wielu języków<br>
→ **[Dostosowywanie](customization.md)**: dostosuj do swoich potrzeb


## Dlaczego OpenSpec?

Asystenci kodowania AI są potężni, ale nieprzewidywalni, gdy wymagania istnieją tylko w historii czatu. OpenSpec dodaje lekką warstwę specyfikacji, abyś uzgodnił, co zbudować, zanim zostanie napisany jakikolwiek kod.

- **Uzgodnij przed budową** — człowiek i AI uzgadniają specyfikacje przed napisaniem kodu
- **Zachowaj porządek** — każda zmiana ma własny folder z propozycją, specyfikacjami, projektem i zadaniami
- **Pracuj płynnie** — aktualizuj dowolny artefakt w dowolnym momencie, bez sztywnych bramek fazowych
- **Używaj swoich narzędzi** — działa z ponad 20 asystentami AI za pomocą komend ukośnikowych

### Jak się porównujemy

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Dokładny, ale ciężki. Sztywne bramki fazowe, dużo Markdowna, konfiguracja Pythona. OpenSpec jest lżejszy i pozwala na swobodną iterację.

**vs. [Kiro](https://kiro.dev)** (AWS) — Potężny, ale jesteś ograniczony do ich IDE i modeli Claude. OpenSpec działa z narzędziami, których już używasz.

**vs. nic** — Kodowanie AI bez specyfikacji oznacza niejasne podpowiedzi i nieprzewidywalne wyniki. OpenSpec zapewnia przewidywalność bez ceremonii.

## Aktualizacja OpenSpec

**Zaktualizuj pakiet**

```bash
npm install -g @fission-ai/openspec@latest
```

**Odśwież instrukcje dla agenta**

Uruchom to w każdym projekcie, aby ponownie wygenerować wskazówki dla AI i upewnić się, że najnowsze komendy ukośnikowe są aktywne:

```bash
openspec update
```

## Uwagi dotyczące użytkowania

**Wybór modelu**: OpenSpec działa najlepiej z modelami o wysokim rozumowaniu. Zalecamy Opus 4.5 i GPT 5.2 zarówno do planowania, jak i implementacji.

**Higiena kontekstu**: OpenSpec korzysta z czystego okna kontekstu. Wyczyść kontekst przed rozpoczęciem implementacji i utrzymuj dobrą higienę kontekstu przez całą sesję.

## Wkład

**Małe poprawki** — Poprawki błędów, literówek i drobne ulepszenia można przesyłać bezpośrednio jako PR-y.

**Większe zmiany** — W przypadku nowych funkcji, znaczących refaktoryzacji lub zmian architektonicznych, proszę najpierw przesłać propozycję zmiany OpenSpec, abyśmy mogli uzgodnić intencje i cele przed rozpoczęciem implementacji.

Pisząc propozycje, miej na uwadze filozofię OpenSpec: obsługujemy szerokie grono użytkowników korzystających z różnych agentów kodowania, modeli i przypadków użycia. Zmiany powinny działać dobrze dla wszystkich.

**Kod wygenerowany przez AI jest mile widziany** — o ile został przetestowany i zweryfikowany. PR-y zawierające kod wygenerowany przez AI powinny wspominać użytego agenta kodowania i model (np. "Wygenerowano za pomocą Claude Code przy użyciu claude-opus-4-5-20251101").

### Rozwój

- Zainstaluj zależności: `pnpm install`
- Zbuduj: `pnpm run build`
- Testuj: `pnpm test`
- Rozwijaj CLI lokalnie: `pnpm run dev` lub `pnpm run dev:cli`
- Konwencjonalne commity (jednoliniowe): `type(scope): subject`

## Inne

<details>
<summary><strong>Telemetria</strong></summary>

OpenSpec zbiera anonimowe statystyki użytkowania.

Zbieramy tylko nazwy komend i wersję, aby zrozumieć wzorce użytkowania. Żadnych argumentów, ścieżek, treści ani danych osobowych. Automatycznie wyłączone w CI.

**Rezygnacja:** `export OPENSPEC_TELEMETRY=0` lub `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Maintainerzy i doradcy</strong></summary>

Zobacz [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md), aby zobaczyć listę głównych maintainerów i doradców, którzy pomagają kierować projektem.

</details>



## Licencja

MIT