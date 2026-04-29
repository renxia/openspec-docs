---
layout: home

hero:
  name: "OpenSpec"
  text: "Développement Piloté par Spécification pour les Assistants IA"
  tagline: Une spécification légère pour construire et gérer des projets d'assistants IA.
  actions:
    - theme: brand
      text: Commencer
      link: ./getting-started
    - theme: alt
      text: Accueil
      link: /

features:
  - title: Flux de Travail Spec-First
    details: Définissez les exigences avant d'écrire du code.
  - title: Conception IA-Native
    details: Conçu pour Claude Code, Cursor, Windsurf et plus.
  - title: Multi-Langues
    details: Documentation disponible en plusieurs langues.
---


<details>
<summary><strong>Le framework de spécification le plus apprécié.</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
Notre philosophie :

```text
→ fluide, pas rigide
→ itératif, pas en cascade
→ simple, pas complexe
→ conçu pour les projets existants (brownfield), pas seulement les nouveaux (greenfield)
→ évolutif des projets personnels aux entreprises
```

> [!TIP]
> **Nouveau flux de travail disponible !** Nous avons reconstruit OpenSpec avec un nouveau flux de travail guidé par des artefacts.
>
> Exécutez `/opsx:propose "votre idée"` pour commencer. → [En savoir plus ici](opsx.md)

<p align="center">
  Suivez <a href="https://x.com/0xTab">@0xTab sur X</a> pour les mises à jour · Rejoignez le <a href="https://discord.gg/YctCnvvshC">Discord d'OpenSpec</a> pour de l'aide et des questions.
</p>

<!-- TODO: Ajouter une démo GIF du flux /opsx:propose → /opsx:archive -->

## Voir en action

```text
Vous: /opsx:propose ajouter-mode-sombre
IA:   Créé openspec/changes/ajouter-mode-sombre/
      ✓ proposal.md — pourquoi nous le faisons, ce qui change
      ✓ specs/       — exigences et scénarios
      ✓ design.md    — approche technique
      ✓ tasks.md     — liste de contrôle d'implémentation
      Prêt pour l'implémentation !

Vous: /opsx:apply
IA:   Implémentation des tâches...
      ✓ 1.1 Ajouter le fournisseur de contexte de thème
      ✓ 1.2 Créer le composant de bascule
      ✓ 2.1 Ajouter les variables CSS
      ✓ 2.2 Connecter le localStorage
      Toutes les tâches terminées !

Vous: /opsx:archive
IA:   Archivé dans openspec/changes/archive/2025-01-23-ajouter-mode-sombre/
      Spécifications mises à jour. Prêt pour la prochaine fonctionnalité.
```

<details>
<summary><strong>Tableau de bord OpenSpec</strong></summary>

</details>

## Démarrage Rapide

**Nécessite Node.js 20.19.0 ou supérieur.**

Installez OpenSpec globalement :

```bash
npm install -g @fission-ai/openspec@latest
```

Puis naviguez vers le répertoire de votre projet et initialisez :

```bash
cd votre-projet
openspec init
```

Dites maintenant à votre IA : `/opsx:propose <ce-que-vous-voulez-construire>`

Si vous souhaitez le flux de travail étendu (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), sélectionnez-le avec `openspec config profile` et appliquez-le avec `openspec update`.

> [!NOTE]
> Vous ne savez pas si votre outil est supporté ? [Voir la liste complète](supported-tools.md) – nous supportons plus de 25 outils et la liste grandit.
>
> Fonctionne également avec pnpm, yarn, bun et nix. [Voir les options d'installation](installation.md).

## Documentation

→ **[Commencer](getting-started.md)** : premiers pas<br>
→ **[Flux de travail](workflows.md)** : combinaisons et modèles<br>
→ **[Commandes](commands.md)** : commandes slash et compétences<br>
→ **[CLI](cli.md)** : référence du terminal<br>
→ **[Outils Supportés](supported-tools.md)** : intégrations d'outils et chemins d'installation<br>
→ **[Concepts](concepts.md)** : comment tout s'assemble<br>
→ **[Multi-Langues](multi-language.md)** : support multi-langues<br>
→ **[Personnalisation](customization.md)** : adaptez-le à votre image


## Pourquoi OpenSpec ?

Les assistants de codage IA sont puissants mais imprévisibles lorsque les exigences vivent uniquement dans l'historique des conversations. OpenSpec ajoute une couche de spécification légère pour que vous vous accordiez sur ce à construire avant qu'aucun code ne soit écrit.

- **Accordez-vous avant de construire** — l'humain et l'IA s'alignent sur les spécifications avant l'écriture du code
- **Restez organisé** — chaque changement obtient son propre dossier avec proposition, spécifications, conception et tâches
- **Travaillez de manière fluide** — mettez à jour n'importe quel artefact à tout moment, pas de portes de phase rigides
- **Utilisez vos outils** — fonctionne avec plus de 20 assistants IA via des commandes slash

### Comment nous nous comparons

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Complet mais lourd. Portes de phase rigides, beaucoup de Markdown, configuration Python. OpenSpec est plus léger et vous permet d'itérer librement.

**vs. [Kiro](https://kiro.dev)** (AWS) — Puissant mais vous êtes enfermé dans leur IDE et limité aux modèles Claude. OpenSpec fonctionne avec les outils que vous utilisez déjà.

**vs. rien** — Le codage IA sans spécifications signifie des prompts vagues et des résultats imprévisibles. OpenSpec apporte de la prévisibilité sans la lourdeur.

## Mettre à jour OpenSpec

**Mettez à jour le package**

```bash
npm install -g @fission-ai/openspec@latest
```

**Rafraîchissez les instructions de l'agent**

Exécutez ceci dans chaque projet pour régénérer les instructions IA et vous assurer que les dernières commandes slash sont actives :

```bash
openspec update
```

## Notes d'utilisation

**Sélection du modèle** : OpenSpec fonctionne mieux avec des modèles à forte capacité de raisonnement. Nous recommandons Opus 4.5 et GPT 5.2 pour la planification et l'implémentation.

**Hygiène du contexte** : OpenSpec bénéficie d'une fenêtre de contexte propre. Effacez votre contexte avant de commencer l'implémentation et maintenez une bonne hygiène du contexte tout au long de votre session.

## Contribuer

**Petites corrections** — Les corrections de bugs, les corrections de fautes de frappe et les améliorations mineures peuvent être soumises directement en tant que PR.

**Changements plus importants** — Pour les nouvelles fonctionnalités, les refontes importantes ou les changements architecturaux, veuillez d'abord soumettre une proposition de changement OpenSpec afin que nous puissions nous aligner sur l'intention et les objectifs avant le début de l'implémentation.

Lors de la rédaction des propositions, gardez à l'esprit la philosophie d'OpenSpec : nous servons une grande variété d'utilisateurs à travers différents agents de codage, modèles et cas d'utilisation. Les changements doivent bien fonctionner pour tout le monde.

**Le code généré par IA est bienvenu** — tant qu'il a été testé et vérifié. Les PR contenant du code généré par IA doivent mentionner l'agent de codage et le modèle utilisé (par ex., "Généré avec Claude Code utilisant claude-opus-4-5-20251101").

### Développement

- Installer les dépendances : `pnpm install`
- Construire : `pnpm run build`
- Tester : `pnpm test`
- Développer la CLI localement : `pnpm run dev` ou `pnpm run dev:cli`
- Commits conventionnels (une ligne) : `type(scope): subject`

## Autre

<details>
<summary><strong>Télémétrie</strong></summary>

OpenSpec collecte des statistiques d'utilisation anonymes.

Nous collectons uniquement les noms de commandes et la version pour comprendre les schémas d'utilisation. Aucun argument, chemin, contenu ou PII. Désactivé automatiquement dans les environnements CI.

**Désactivation :** `export OPENSPEC_TELEMETRY=0` ou `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Responsables et Conseillers</strong></summary>

Voir [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) pour la liste des responsables principaux et des conseillers qui aident à guider le projet.

</details>



## Licence

MIT