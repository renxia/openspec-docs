---
layout: home

hero:
  name: "OpenSpec"
  text: "Specyfikacja jako podstawa rozwoju asystentów AI"
  tagline: Lekka specyfikacja do budowania i zarządzania projektami asystentów AI.
  actions:
    - theme: brand
      text: Zacznij tutaj
      link: ./getting-started
    - theme: alt
      text: Strona główna
      link: /

features:
  - title: Praca oparta na specyfikacji
    details: Zdefiniuj wymagania przed napisaniem kodu.
  - title: Projektowanie dla AI
    details: Stworzony dla Claude Code, Cursor, Windsurf i innych.
  - title: Wiele języków
    details: Dokumentacja dostępna w wielu językach.
---


<details>
<summary><strong>Najbardziej lubiany framework specyfikacji.</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
Nasza filozofia:

```text
→ elastyczność, nie sztywność
→ iteracje, nie model wodospadowy
→ prostota, nie złożoność
→ budowane dla istniejących projektów, nie tylko nowych
→ skalowalne od projektów osobistych po przedsiębiorstwa
```

> [!TIP]
> **Nowy przepływ pracy jest już dostępny!** Przebudowaliśmy OpenSpec z nowym przepływem pracy opartym na artefaktach.
>
> Uruchom `/opsx:propose "twój pomysł"`, aby zacząć. → [Dowiedz się więcej tutaj](opsx.md)

<p align="center">
  Obserwuj <a href="https://x.com/0xTab">@0xTab na X</a>, aby być na bieżąco · Dołącz do <a href="https://discord.gg/YctCnvvshC">Discord OpenSpec</a>, aby uzyskać pomoc i zadać pytania.
</p>

<!-- TODO: Add GIF demo of /opsx:propose → /opsx:archive workflow -->

## Zobacz to w akcji

```text
Ty: /opsx:propose add-dark-mode
AI:  Utworzono openspec/changes/add-dark-mode/
     ✓ proposal.md — dlaczego to robimy, co się zmienia
     ✓ specs/       — wymagania i scenariusze
     ✓ design.md    — podejście techniczne
     ✓ tasks.md     — lista zadań do realizacji
     Gotowe do implementacji!

Ty: /opsx:apply
AI:  Realizacja zadań...
     ✓ 1.1 Dodanie providera kontekstu motywu
     ✓ 1.2 Utworzenie komponentu przełącznika
     ✓ 2.1 Dodanie zmiennych CSS
     ✓ 2.2 Podłączenie localStorage
     Wszystkie zadania zakończone!

Ty: /opsx:archive
AI:  Zarchiwizowano do openspec/changes/archive/2025-01-23-add-dark-mode/
     Specyfikacje zaktualizowane. Gotowe na następną funkcję.
```

<details>
<summary><strong>Panel OpenSpec</strong></summary>

</details>

## Szybki start

**Wymaga Node.js w wersji 20.19.0 lub nowszej.**

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

Jeśli chcesz rozszerzonego przepływu pracy (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), wybierz go za pomocą `openspec config profile` i zastosuj za pomocą `openspec update`.

> [!NOTE]
> Nie jesteś pewien, czy Twoje narzędzie jest obsługiwane? [Zobacz pełną listę](supported-tools.md) – obsługujemy ponad 20 narzędzi i ta liczba rośnie.
>
> Działa również z pnpm, yarn, bun i nix. [Zobacz opcje instalacji](installation.md).

## Dokumentacja

→ **[Pierwsze kroki](getting-started.md)**: pierwsze kroki<br>
→ **[Przepływy pracy](workflows.md)**: kombinacje i wzorce<br>
→ **[Polecenia](commands.md)**: polecenia ukośnika i umiejętności<br>
→ **[CLI](cli.md)**: odniesienie do terminala<br>
→ **[Obsługiwane narzędzia](supported-tools.md)**: integracje z narzędziami i ścieżki instalacji<br>
→ **[Pojęcia](concepts.md)**: jak to wszystko działa razem<br>
→ **[Wiele języków](multi-language.md)**: obsługa wielu języków<br>
→ **[Dostosowywanie](customization.md)**: dostosuj do swoich potrzeb


## Dlaczego OpenSpec?

Asystenci kodowania AI są potężne, ale nieprzewidywalne, gdy wymagania żyją tylko w historii czatu. OpenSpec dodaje lekką warstwę specyfikacji, abyś mógł ustalić, co budować, zanim zostanie napisany jakikolwiek kod.

- **Ustal przed budowaniem** — człowiek i AI uzgadniają specyfikacje, zanim zostanie napisany kod
- **Zachowaj porządek** — każda zmiana otrzymuje własny folder z propozycją, specyfikacjami, projektem i zadaniami
- **Pracuj elastycznie** — aktualizuj dowolny artefakt w dowolnym momencie, bez sztywnych bramek faz
- **Używaj swoich narzędzi** — współpracuje z ponad 20 asystentami AI za pomocą poleceń ukośnika

### Jak wypadamy w porównaniu

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Dokładny, ale ciężki. Sztywne bramki faz, dużo Markdowna, konfiguracja Pythona. OpenSpec jest lżejszy i pozwala swobodnie iterować.

**vs. [Kiro](https://kiro.dev)** (AWS) — Potężny, ale jesteś zamknięty w ich IDE i ograniczony do modeli Claude. OpenSpec działa z narzędziami, których już używasz.

**vs. nic** — Kodowanie AI bez specyfikacji oznacza niejasne prompty i nieprzewidywalne wyniki. OpenSpec wnosi przewidywalność bez zbędnej ceremonii.

## Aktualizowanie OpenSpec

**Zaktualizuj pakiet**

```bash
npm install -g @fission-ai/openspec@latest
```

**Odśwież instrukcje agenta**

Uruchom to wewnątrz każdego projektu, aby wygenerować wskazówki AI i upewnić się, że najnowsze polecenia ukośnika są aktywne:

```bash
openspec update
```

## Uwagi dotyczące użytkowania

**Wybór modelu**: OpenSpec najlepiej działa z modelami o wysokiej zdolności rozumowania. Zalecamy Opus 4.5 i GPT 5.2 zarówno do planowania, jak i implementacji.

**Higiena kontekstu**: OpenSpec korzysta z czystego okna kontekstu. Wyczyść swój kontekst przed rozpoczęciem implementacji i utrzymuj dobrą higienę kontekstu przez cały czas trwania sesji.

## Wkład w rozwój

**Drobne poprawki** — Poprawki błędów, korekty literówek i drobne ulepszenia mogą być przesyłane bezpośrednio jako PR-y.

**Większe zmiany** — W przypadku nowych funkcji, znaczących refaktorów lub zmian architektonicznych, prosimy najpierw przesłać propozycję zmiany OpenSpec, abyśmy mogli uzgodnić intencje i cele przed rozpoczęciem implementacji.

Pisząc propozycje, miej na uwadze filozofię OpenSpec: służymy szerokiej gamie użytkowników w różnych agentach kodowania, modelach i przypadkach użycia. Zmiany powinny dobrze działać dla wszystkich.

**Kod generowany przez AI jest mile widziany** — o ile został przetestowany i zweryfikowany. PR-y zawierające kod generowany przez AI powinny zawierać informację o użyty agencie kodowania i modelu (np. „Wygenerowano za pomocą Claude Code z użyciem claude-opus-4-5-20251101”).

### Rozwój

- Zainstaluj zależności: `pnpm install`
- Zbuduj: `pnpm run build`
- Przetestuj: `pnpm test`
- Opracuj CLI lokalnie: `pnpm run dev` lub `pnpm run dev:cli`
- Konwencjonalne commity (jednoliniowe): `type(scope): subject`

## Inne

<details>
<summary><strong>Telemetria</strong></summary>

OpenSpec zbiera anonimowe statystyki użytkowania.

Zbieramy tylko nazwy poleceń i wersję, aby zrozumieć wzorce użytkowania. Żadne argumenty, ścieżki, treści ani dane osobowe nie są zbierane. Automatycznie wyłącza się w CI.

**Wyłączenie:** `export OPENSPEC_TELEMETRY=0` lub `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Opiekunowie i doradcy</strong></summary>

Zobacz [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md), aby uzyskać listę głównych opiekunów i doradców, którzy pomagają w kierowaniu projektem.

</details>



## Licencja

MIT