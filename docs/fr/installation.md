# Installation

## Prérequis

- **Node.js 20.19.0 ou supérieur** — Vérifiez votre version : `node --version`

## Gestionnaires de paquets

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

Bun peut installer OpenSpec globalement, mais OpenSpec fonctionne actuellement sur Node.js. Vous avez toujours besoin de Node.js 20.19.0 ou supérieur disponible dans le `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Exécuter OpenSpec directement sans installation :

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Ou installer dans votre profil :

```bash
nix profile install github:Fission-AI/OpenSpec
```

Ou ajouter à votre environnement de développement dans `flake.nix` :

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

## Vérifier l'installation

```bash
openspec --version
```

## Mise à jour

Mettez à niveau le paquet, puis rafraîchissez les fichiers générés de chaque projet :

```bash
npm install -g @fission-ai/openspec@latest   # ou équivalent pnpm/yarn/bun
openspec update                              # à exécuter dans chaque projet
```

`openspec update` régénère les fichiers de compétences (skill) et de commandes pour les outils que vous avez configurés, garantissant ainsi que vos commandes slash restent à jour avec la version installée.

## Désinstallation

Il n'existe pas de commande `openspec uninstall`, car OpenSpec est un paquet global ainsi que des fichiers dans votre projet. Le retrait nécessite quelques étapes manuelles, et rien ici ne touche votre code source.

**1. Supprimer le paquet global :**

```bash
npm uninstall -g @fission-ai/openspec   # ou: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Supprimer OpenSpec d'un projet (facultatif).** Supprimez le répertoire `openspec/` si vous ne souhaitez plus ses spécifications et changements :

```bash
rm -rf openspec/
```

Réfléchissez avant de le faire : `openspec/specs/` et `openspec/changes/archive/` sont votre enregistrement du comportement du système et pourquoi il a changé. Si vous souhaitez conserver cet historique, gardez le dossier (ou conservez-le dans git) même après la désinstallation.

**3. Supprimer les fichiers d'outils IA générés (facultatif).** OpenSpec écrit les fichiers de compétences et de commandes dans des répertoires par outil tels que `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*`, etc. Supprimez les compétences `openspec-*` et les commandes `opsx-*` pour tous les outils que vous avez configurés. Les chemins exacts par outil sont listés dans [Outils pris en charge](supported-tools.md).

Si vous avez également des blocs marqueurs OpenSpec dans des fichiers tels que `CLAUDE.md` ou `AGENTS.md`, supprimez ces blocs manuellement ; votre propre contenu dans ces fichiers est à vous de garder.

## Prochaines étapes

Après l'installation, initialisez OpenSpec dans votre projet :

```bash
cd your-project
openspec init
```

Consultez [Démarrage rapide](getting-started.md) pour un guide complet.