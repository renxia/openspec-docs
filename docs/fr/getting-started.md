# Pour commencer

Ce guide explique comment OpenSpec fonctionne après l'avoir installé et initialisé. Pour les instructions d'installation, consultez le [README principal](index.md#quick-start).

## Comment ça fonctionne

OpenSpec vous aide, vous et votre assistant de codage IA, à vous accorder sur ce qu'il faut construire avant qu'aucun code ne soit écrit.

**Chemin rapide par défaut (profil core) :**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Chemin étendu (sélection de workflow personnalisé) :**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Le profil global par défaut est `core`, qui inclut `propose`, `explore`, `apply`, `sync` et `archive`. Vous pouvez activer les commandes de workflow étendues avec `openspec config profile` puis `openspec update`.

## Ce qu'OpenSpec crée

Après avoir exécuté `openspec init`, votre projet a cette structure :

```
openspec/
├── specs/              # Source de vérité (le comportement de votre système)
│   └── <domain>/
│       └── spec.md
├── changes/            # Mises à jour proposées (un dossier par modification)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Spécifications delta (ce qui change)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Configuration du projet (optionnel)
```

**Deux répertoires clés :**

- **`specs/`** - La source de vérité. Ces spécifications décrivent le comportement actuel de votre système. Organisées par domaine (par ex., `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modifications proposées. Chaque modification obtient son propre dossier avec tous les artefacts associés. Lorsqu'une modification est terminée, ses spécifications sont fusionnées dans le répertoire principal `specs/`.

## Comprendre les artefacts

Chaque dossier de modification contient des artefacts qui guident le travail :

| Artefact | Objectif |
|----------|----------|
| `proposal.md` | Le "pourquoi" et le "quoi" - capture l'intention, la portée et l'approche |
| `specs/` | Spécifications delta montrant les exigences AJOUTÉES/MODIFIÉES/SUPPRIMÉES |
| `design.md` | Le "comment" - approche technique et décisions architecturales |
| `tasks.md` | Liste de contrôle d'implémentation avec des cases à cocher |

**Les artefacts s'appuient les uns sur les autres :**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            mise à jour au fur et à mesure de l'apprentissage
```

Vous pouvez toujours revenir en arrière et affiner les artefacts précédents à mesure que vous en apprenez davantage pendant l'implémentation.

## Comment fonctionnent les spécifications delta

Les spécifications delta sont le concept clé d'OpenSpec. Elles montrent ce qui change par rapport à vos spécifications actuelles.

### Le format

Les spécifications delta utilisent des sections pour indiquer le type de modification :

```markdown
# Delta pour Auth

## Exigences AJOUTÉES

### Exigence : Authentification à deux facteurs
Le système DOIT exiger un second facteur lors de la connexion.

#### Scénario : OTP requis
- ÉTANT DONNÉ un utilisateur avec 2FA activé
- QUAND l'utilisateur soumet des identifiants valides
- ALORS un défi OTP est présenté

## Exigences MODIFIÉES

### Exigence : Délai d'expiration de session
Le système DOIT expirer les sessions après 30 minutes d'inactivité.
(Précédemment : 60 minutes)

#### Scénario : Délai d'inactivité
- ÉTANT DONNÉ une session authentifiée
- QUAND 30 minutes passent sans activité
- ALORS la session est invalidée

## Exigences SUPPRIMÉES

### Exigence : Se souvenir de moi
(Déprécié en faveur de 2FA)
```

### Ce qui se passe lors de l'archivage

Lorsque vous archivez une modification :

1. Les exigences **AJOUTÉES** sont ajoutées à la spécification principale
2. Les exigences **MODIFIÉES** remplacent la version existante
3. Les exigences **SUPPRIMÉES** sont supprimées de la spécification principale

Le dossier de modification est déplacé vers `openspec/changes/archive/` pour l'historique d'audit.

## Exemple : Votre première modification

Parcourons l'ajout d'un mode sombre à une application.

### 1. Démarrer la modification (par défaut)

```text
Vous : /opsx:propose add-dark-mode

IA :  Créé openspec/changes/add-dark-mode/
     ✓ proposal.md — pourquoi nous faisons ça, ce qui change
     ✓ specs/       — exigences et scénarios
     ✓ design.md    — approche technique
     ✓ tasks.md     — liste de contrôle d'implémentation
     Prêt pour l'implémentation !
```

Si vous avez activé le profil de workflow étendu, vous pouvez également le faire en deux étapes : `/opsx:new` puis `/opsx:ff` (ou `/opsx:continue` de manière incrémentale).

### 2. Ce qui est créé

**proposal.md** - Capture l'intention :

```markdown
# Proposition : Ajouter le mode sombre

## Intention
Les utilisateurs ont demandé une option de mode sombre pour réduire la fatigue oculaire
pendant l'utilisation nocturne.

## Portée
- Ajouter un basculeur de thème dans les paramètres
- Supporter la détection des préférences système
- Persister la préférence dans localStorage

## Approche
Utiliser les propriétés CSS personnalisées pour le thème avec un contexte React
pour la gestion d'état.
```

**specs/ui/spec.md** - Delta montrant les nouvelles exigences :

```markdown
# Delta pour UI

## Exigences AJOUTÉES

### Exigence : Sélection du thème
Le système DOIT permettre aux utilisateurs de choisir entre les thèmes clair et sombre.

#### Scénario : Basculement manuel
- ÉTANT DONNÉ un utilisateur sur n'importe quelle page
- QUAND l'utilisateur clique sur le basculeur de thème
- ALORS le thème change immédiatement
- ET la préférence persiste entre les sessions

#### Scénario : Préférence système
- ÉTANT DONNÉ un utilisateur sans préférence enregistrée
- QUAND l'application se charge
- ALORS le schéma de couleurs préféré du système est utilisé
```

**tasks.md** - Liste de contrôle d'implémentation :

```markdown
# Tâches

## 1. Infrastructure du thème
- [ ] 1.1 Créer ThemeContext avec l'état clair/sombre
- [ ] 1.2 Ajouter des propriétés CSS personnalisées pour les couleurs
- [ ] 1.3 Implémenter la persistance localStorage

## 2. Composants UI
- [ ] 2.1 Créer le composant ThemeToggle
- [ ] 2.2 Ajouter le basculeur à la page des paramètres
- [ ] 2.3 Mettre à jour Header pour inclure un basculeur rapide

## 3. Style
- [ ] 3.1 Définir la palette de couleurs du thème sombre
- [ ] 3.2 Mettre à jour les composants pour utiliser les variables CSS
```

### 3. Implémenter

```
Vous : /opsx:apply

IA :  Traitement des tâches...
     ✓ 1.1 Créé ThemeContext avec l'état clair/sombre
     ✓ 1.2 Ajouté des propriétés CSS personnalisées à globals.css
     ✓ 1.3 Implémenté la persistance localStorage
     ✓ 2.1 Créé le composant ThemeToggle
     ...
     Toutes les tâches terminées !
```

Pendant l'implémentation, si vous découvrez que le design nécessite un ajustement, mettez simplement à jour l'artefact et continuez.

### 4. Archiver

```
Vous : /opsx:archive

IA :  Archivage de add-dark-mode...
     ✓ Spécifications fusionnées dans openspec/specs/ui/spec.md
     ✓ Déplacé vers openspec/changes/archive/2025-01-24-add-dark-mode/
     Terminé ! Prêt pour la prochaine fonctionnalité.
```

Vos spécifications delta font désormais partie des spécifications principales, documentant le fonctionnement de votre système.

## Vérification et révision

Utilisez le CLI pour vérifier vos modifications :

```bash
# Lister les modifications actives
openspec list

# Voir les détails d'une modification
openspec show add-dark-mode

# Valider le formatage des spécifications
openspec validate add-dark-mode

# Tableau de bord interactif
openspec view
```

## Prochaines étapes

- [Workflows](workflows.md) - Modèles courants et quand utiliser chaque commande
- [Commands](commands.md) - Référence complète pour toutes les commandes slash
- [Concepts](concepts.md) - Compréhension approfondie des spécifications, modifications et schémas
- [Customization](customization.md) - Faites fonctionner OpenSpec à votre manière