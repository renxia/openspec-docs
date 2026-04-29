# Pour commencer

Ce guide explique le fonctionnement d'OpenSpec après son installation et son initialisation. Pour les instructions d'installation, consultez le [README principal](index.md#quick-start).

## Fonctionnement

OpenSpec vous aide, vous et votre assistant de codage IA, à vous mettre d'accord sur ce qu'il faut construire avant l'écriture de tout code.

**Chemin rapide par défaut (profil de base) :**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

**Chemin étendu (sélection de flux de travail personnalisé) :**

```text
/opsx:new ──► /opsx:ff ou /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Le profil global par défaut est `core`, qui inclut `propose`, `explore`, `apply` et `archive`. Vous pouvez activer les commandes de flux de travail étendues avec `openspec config profile` puis `openspec update`.

## Ce qu'OpenSpec crée

Après l'exécution de `openspec init`, votre projet possède cette structure :

```
openspec/
├── specs/              # Source de vérité (le comportement de votre système)
│   └── <domaine>/
│       └── spec.md
├── changes/            # Mises à jour proposées (un dossier par modification)
│   └── <nom-modification>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Spécifications delta (ce qui change)
│           └── <domaine>/
│               └── spec.md
└── config.yaml         # Configuration du projet (optionnel)
```

**Deux répertoires clés :**

- **`specs/`** - La source de vérité. Ces spécifications décrivent le comportement actuel de votre système. Organisées par domaine (par ex., `specs/auth/`, `specs/payments/`).

- **`changes/`** - Modifications proposées. Chaque modification dispose de son propre dossier contenant tous les artefacts associés. Lorsqu'une modification est terminée, ses spécifications fusionnent dans le répertoire principal `specs/`.

## Comprendre les artefacts

Chaque dossier de modification contient des artefacts qui guident le travail :

| Artefact | Objectif |
|----------|----------|
| `proposal.md` | Le « pourquoi » et le « quoi » - capture l'intention, la portée et l'approche |
| `specs/` | Spécifications delta montrant les exigences AJOUTÉES/MODIFIÉES/SUPPRIMÉES |
| `design.md` | Le « comment » - approche technique et décisions d'architecture |
| `tasks.md` | Liste de contrôle d'implémentation avec cases à cocher |

**Les artefacts se construisent les uns sur les autres :**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            mise à jour au fur et à mesure des apprentissages
```

Vous pouvez toujours revenir en arrière et affiner les artefacts précédents au fur et à mesure que vous en apprenez plus pendant l'implémentation.

## Fonctionnement des spécifications delta

Les spécifications delta sont le concept clé d'OpenSpec. Elles montrent ce qui change par rapport à vos spécifications actuelles.

### Le format

Les spécifications delta utilisent des sections pour indiquer le type de modification :

```markdown
# Delta pour Auth

## Exigences AJOUTÉES

### Exigence : Authentification à deux facteurs
Le système DOIT exiger un deuxième facteur lors de la connexion.

#### Scénario : OTP requis
- ÉTANT DONNÉ un utilisateur avec 2FA activé
- QUAND l'utilisateur soumet des identifiants valides
- ALORS un défi OTP est présenté

## Exigences MODIFIÉES

### Exigence : Expiration de session
Le système fera expirer les sessions après 30 minutes d'inactivité.
(Précédemment : 60 minutes)

#### Scénario : Expiration par inactivité
- ÉTANT DONNÉ une session authentifiée
- QUAND 30 minutes passent sans activité
- ALORS la session est invalidée

## Exigences SUPPRIMÉES

### Exigence : Se souvenir de moi
(Déprécié en faveur de la 2FA)
```

### Ce qui se passe lors de l'archivage

Lorsque vous archivez une modification :

1. Les exigences **AJOUTÉES** sont ajoutées à la spécification principale
2. Les exigences **MODIFIÉES** remplacent la version existante
3. Les exigences **SUPPRIMÉES** sont supprimées de la spécification principale

Le dossier de modification est déplacé dans `openspec/changes/archive/` pour l'historique d'audit.

## Exemple : Votre première modification

Parcourons l'ajout du mode sombre à une application.

### 1. Démarrer la modification (par défaut)

```text
Vous : /opsx:propose add-dark-mode

IA :  Créé openspec/changes/add-dark-mode/
      ✓ proposal.md — pourquoi nous le faisons, ce qui change
      ✓ specs/       — exigences et scénarios
      ✓ design.md    — approche technique
      ✓ tasks.md     — liste de contrôle d'implémentation
      Prêt pour l'implémentation !
```

Si vous avez activé le profil de flux de travail étendu, vous pouvez également le faire en deux étapes : `/opsx:new` puis `/opsx:ff` (ou `/opsx:continue` de manière incrémentale).

### 2. Ce qui est créé

**proposal.md** - Capture l'intention :

```markdown
# Proposition : Ajouter le mode sombre

## Intention
Les utilisateurs ont demandé une option de mode sombre pour réduire la fatigue oculaire lors de l'utilisation nocturne.

## Portée
- Ajouter un bouton de basculement de thème dans les paramètres
- Supporter la détection des préférences système
- Persister la préférence dans localStorage

## Approche
Utiliser des propriétés CSS personnalisées pour le theming avec un contexte React pour la gestion de l'état.
```

**specs/ui/spec.md** - Delta montrant les nouvelles exigences :

```markdown
# Delta pour UI

## Exigences AJOUTÉES

### Exigence : Sélection du thème
Le système PERMETTRA aux utilisateurs de choisir entre les thèmes clair et sombre.

#### Scénario : Basculement manuel
- ÉTANT DONNÉ un utilisateur sur n'importe quelle page
- QUAND l'utilisateur clique sur le bouton de basculement du thème
- ALORS le thème bascule immédiatement
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
- [ ] 1.2 Ajouter les propriétés CSS personnalisées pour les couleurs
- [ ] 1.3 Implémenter la persistance dans localStorage

## 2. Composants UI
- [ ] 2.1 Créer le composant ThemeToggle
- [ ] 2.2 Ajouter le basculement à la page des paramètres
- [ ] 2.3 Mettre à jour Header pour inclure le basculement rapide

## 3. Style
- [ ] 3.1 Définir la palette de couleurs du thème sombre
- [ ] 3.2 Mettre à jour les composants pour utiliser les variables CSS
```

### 3. Implémenter

```
Vous : /opsx:apply

IA :  Traitement des tâches...
      ✓ 1.1 Créé ThemeContext avec l'état clair/sombre
      ✓ 1.2 Ajouté les propriétés CSS personnalisées à globals.css
      ✓ 1.3 Implémenté la persistance dans localStorage
      ✓ 2.1 Créé le composant ThemeToggle
      ...
      Toutes les tâches sont terminées !
```

Pendant l'implémentation, si vous découvrez que le design nécessite des ajustements, mettez simplement à jour l'artefact et continuez.

### 4. Archiver

```
Vous : /opsx:archive

IA :  Archivage de add-dark-mode...
      ✓ Spécifications fusionnées dans openspec/specs/ui/spec.md
      ✓ Déplacé dans openspec/changes/archive/2025-01-24-add-dark-mode/
      Terminé ! Prêt pour la prochaine fonctionnalité.
```

Vos spécifications delta font désormais partie des spécifications principales, documentant le fonctionnement de votre système.

## Vérification et examen

Utilisez l'interface en ligne de commande pour vérifier vos modifications :

```bash
# Lister les modifications actives
openspec list

# Afficher les détails d'une modification
openspec show add-dark-mode

# Valider le formatage des spécifications
openspec validate add-dark-mode

# Tableau de bord interactif
openspec view
```

## Étapes suivantes

- [Flux de travail](workflows.md) - Modèles courants et quand utiliser chaque commande
- [Commandes](commands.md) - Référence complète de toutes les commandes en slash
- [Concepts](concepts.md) - Compréhension approfondie des spécifications, des modifications et des schémas
- [Personnalisation](customization.md) - Faire fonctionner OpenSpec à votre manière