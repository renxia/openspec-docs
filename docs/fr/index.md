---
layout: home

hero:
  name: "OpenSpec"
  text: "Développement piloté par spécification pour les assistants IA"
  tagline: Une spécification légère pour construire et gérer des projets d'assistant IA.
  actions:
    - theme: brand
      text: Commencer
      link: ./getting-started
    - theme: alt
      text: Accueil
      link: /

features:
  - title: Flux de travail axé sur la spécification
    details: Définissez les exigences avant d'écrire du code.
  - title: Conception native pour l'IA
    details: Conçu pour Claude Code, Cursor, Windsurf et plus encore.
  - title: Multi-langues
    details: Documentation disponible en plusieurs langues.
---


Notre philosophie :

```text
→ fluide, pas rigide
→ itératif, pas en cascade
→ simple, pas complexe
→ conçu pour le brownfield, pas seulement le greenfield
→ évolutif des projets personnels aux entreprises
```

> [!TIP]
> **Nouveau flux de travail disponible !** Nous avons reconstruit OpenSpec avec un nouveau flux de travail guidé par les artefacts.
>
> Lancez `/opsx:propose "votre idée"` pour commencer. → [En savoir plus ici](opsx.md)

<p align="center">
  Suivez <a href="https://x.com/0xTab">@0xTab sur X</a> pour les mises à jour · Rejoignez le <a href="https://discord.gg/YctCnvvshC">Discord OpenSpec</a> pour de l'aide et des questions.
</p>

## Voir en action

```text
Vous : /opsx:propose add-dark-mode
IA :  Créé openspec/changes/add-dark-mode/
     ✓ proposal.md — pourquoi nous faisons ça, ce qui change
     ✓ specs/       — exigences et scénarios
     ✓ design.md    — approche technique
     ✓ tasks.md     — liste de contrôle d'implémentation
     Prêt pour l'implémentation !

Vous : /opsx:apply
IA :  Implémentation des tâches...
     ✓ 1.1 Ajouter le fournisseur de contexte de thème
     ✓ 1.2 Créer le composant de bascule
     ✓ 2.1 Ajouter les variables CSS
     ✓ 2.2 Connecter localStorage
     Toutes les tâches sont terminées !

Vous : /opsx:archive
IA :  Archivé dans openspec/changes/archive/2025-01-23-add-dark-mode/
     Spécifications mises à jour. Prêt pour la prochaine fonctionnalité.
```

<details>
<summary><strong>Tableau de bord OpenSpec</strong></summary>
</details>

## Démarrage rapide

**Nécessite Node.js 20.19.0 ou supérieur.**

Installez OpenSpec globalement :

```bash
npm install -g @fission-ai/openspec@latest
```

Ensuite, naviguez vers le répertoire de votre projet et initialisez :

```bash
cd your-project
openspec init
```

Maintenant, dites à votre IA : `/opsx:propose <ce-que-vous-voulez-construire>`

Si vous souhaitez le flux de travail étendu (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), sélectionnez-le avec `openspec config profile` et appliquez avec `openspec update`.

> [!NOTE]
> Vous n'êtes pas sûr que votre outil soit pris en charge ? [Consultez la liste complète](supported-tools.md) – nous prenons en charge plus de 25 outils et ce nombre augmente.
>
> Fonctionne également avec pnpm, yarn, bun et nix. [Voir les options d'installation](installation.md).

## Documentation

→ **[Démarrage](getting-started.md)** : premiers pas<br>
→ **[Flux de travail](workflows.md)** : combinaisons et modèles<br>
→ **[Commandes](commands.md)** : commandes slash et compétences<br>
→ **[CLI](cli.md)** : référence du terminal<br>
→ **[Outils pris en charge](supported-tools.md)** : intégrations d'outils et chemins d'installation<br>
→ **[Concepts](concepts.md)** : comment tout s'articule<br>
→ **[Multi-langues](multi-language.md)** : support multi-langues<br>
→ **[Personnalisation](customization.md)** : adaptez-le à vos besoins


## Pourquoi OpenSpec ?

Les assistants de codage IA sont puissants mais imprévisibles lorsque les exigences ne vivent que dans l'historique des discussions. OpenSpec ajoute une couche de spécification légère pour que vous vous accordiez sur ce qu'il faut construire avant qu'aucun code ne soit écrit.

- **Accordez-vous avant de construire** — l'humain et l'IA s'alignent sur les spécifications avant que le code ne soit écrit
- **Restez organisé** — chaque modification obtient son propre dossier avec proposition, spécifications, conception et tâches
- **Travaillez fluidement** — mettez à jour n'importe quel artefact à tout moment, sans portes de phase rigides
- **Utilisez vos outils** — fonctionne avec plus de 20 assistants IA via des commandes slash

### Comment nous comparons

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Approfondi mais lourd. Portes de phase rigides, beaucoup de Markdown, configuration Python. OpenSpec est plus léger et vous permet d'itérer librement.

**vs. [Kiro](https://kiro.dev)** (AWS) — Puissant mais vous êtes enfermé dans leur IDE et limité aux modèles Claude. OpenSpec fonctionne avec les outils que vous utilisez déjà.

**vs. rien** — Le codage IA sans spécifications signifie des invites vagues et des résultats imprévisibles. OpenSpec apporte de la prévisibilité sans la cérémonie.

## Mise à jour d'OpenSpec

**Mettre à niveau le paquet**

```bash
npm install -g @fission-ai/openspec@latest
```

**Actualiser les instructions de l'agent**

Exécutez ceci dans chaque projet pour régénérer les conseils de l'IA et vous assurer que les dernières commandes slash sont actives :

```bash
openspec update
```

## Notes d'utilisation

**Sélection du modèle** : OpenSpec fonctionne mieux avec des modèles à raisonnement élevé. Nous recommandons Opus 4.5 et GPT 5.2 à la fois pour la planification et l'implémentation.

**Hygiène du contexte** : OpenSpec bénéficie d'une fenêtre de contexte propre. Effacez votre contexte avant de commencer l'implémentation et maintenez une bonne hygiène du contexte tout au long de votre session.

## Contribution

**Petites corrections** — Les corrections de bugs, les corrections de fautes de frappe et les améliorations mineures peuvent être soumises directement en tant que PR.

**Changements plus importants** — Pour les nouvelles fonctionnalités, les refactorisations significatives ou les changements architecturaux, veuillez d'abord soumettre une proposition de modification OpenSpec afin que nous puissions nous aligner sur l'intention et les objectifs avant le début de l'implémentation.

Lors de la rédaction de propositions, gardez à l'esprit la philosophie d'OpenSpec : nous servons une grande variété d'utilisateurs à travers différents agents de codage, modèles et cas d'utilisation. Les changements doivent bien fonctionner pour tout le monde.

**Le code généré par l'IA est le bienvenu** — à condition qu'il ait été testé et vérifié. Les PR contenant du code généré par l'IA doivent mentionner l'agent de codage et le modèle utilisé (par exemple, "Généré avec Claude Code en utilisant claude-opus-4-5-20251101").

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

Nous collectons uniquement les noms de commandes et la version pour comprendre les modèles d'utilisation. Aucun argument, chemin, contenu ou PII. Désactivé automatiquement dans CI.

**Désactivation :** `export OPENSPEC_TELEMETRY=0` ou `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Mainteneurs & Conseillers</strong></summary>

Voir [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) pour la liste des mainteneurs principaux et des conseillers qui aident à guider le projet.

</details>



## Licence

MIT