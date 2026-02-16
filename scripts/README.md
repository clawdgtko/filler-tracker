# Filler Research Skill

Ce skill permet de rechercher automatiquement des guides de fillers pour les séries anime et de générer des fichiers CSV prêts à intégrer dans Filler Tracker.

## Installation

```bash
# Rendre les scripts exécutables
chmod +x scripts/filler-research.js
chmod +x scripts/auto-research.js
```

## Utilisation

### 1. Recherche manuelle (avec template)

Génère un fichier Markdown avec les URLs à visiter et un template CSV:

```bash
node scripts/filler-research.js "one piece" 1 61
```

Arguments:
- `nom-de-la-serie` (obligatoire): Nom de la série
- `saison` (optionnel): Numéro de saison (défaut: 1)
- `nombre-episodes` (optionnel): Nombre d'épisodes (défaut: 24)

### 2. Recherche avec rapport

Génère un rapport de recherche avec les liens importants:

```bash
node scripts/auto-research.js "naruto" 2
```

## Workflow

1. **Lancer la recherche**:
   ```bash
   node scripts/filler-research.js "attack on titan" 1 25
   ```

2. **Ouvrir le fichier .md généré** dans `data/guides/`

3. **Visiter les sites recommandés**:
   - https://www.animefillerlist.com
   - https://www.fillerlist.com
   - Reddit r/anime

4. **Remplir le CSV** avec les données:
   ```csv
   episode,title,type,note,sources
   1,To You 2000 Years Later,must-watch,Début de l'histoire,animefillerlist
   2,That Day,must-watch,Essentiel,
   3,A Dim Light Amid Despair,must-watch,,
   ```

5. **Importer dans SHOWS_DB** du worker.js

## Format CSV

| Colonne | Description | Valeurs possibles |
|---------|-------------|-------------------|
| `episode` | Numéro d'épisode | 1, 2, 3... |
| `title` | Titre de l'épisode | Texte libre |
| `type` | Type d'épisode | must-watch, important, optional, skip |
| `note` | Note explicative | Texte libre |
| `sources` | Source(s) de l'info | animefillerlist, reddit, etc. |

## Types d'épisodes

- **must-watch**: Épisode canon, essentiel à l'histoire principale
- **important**: Développement de personnage, arc secondaire intéressant
- **optional**: Filler acceptable mais pas essentiel
- **skip**: Filler à éviter, pas pertinent

## Exemple: Naruto

```csv
episode,title,type,note,sources
1,Enter Naruto Uzumaki!,must-watch,Pilote,animefillerlist
2,My Name is Konohamaru!,must-watch,Introduction,
3,"Sasuke and Sakura: Friends or Foes?",optional,Peut être skippé,reddit
4,Pass or Fail: Survival Test,optional,Examene chunnin debut,
```

## Intégration avec Filler Tracker

Après avoir créé le CSV, convertir en JavaScript pour SHOWS_DB:

```javascript
'naruto': {
  tmdbId: 46260,
  guides: {
    fr: {
      s1: [
        { ep: 1, type: "must-watch", note: "Pilote - Introduction" },
        { ep: 2, type: "must-watch", note: "Konohamaru" },
        { ep: 3, type: "optional", note: "Peut être skippé" },
        // ...
      ]
    }
  }
}
```

## Sources recommandées

### Sites spécialisés
- https://www.animefillerlist.com
- https://www.fillerlist.com
- https://www.narutofillerlist.com

### Communautés
- https://www.reddit.com/r/anime/
- https://www.reddit.com/r/Naruto/
- https://www.reddit.com/r/OnePiece/
- https://www.reddit.com/r/Bleach/

### Forums
- MyAnimeList forums
- AnimePlanet discussions

## Astuces

1. **Vérifier plusieurs sources**: Les guides peuvent varier
2. **Lire les commentaires Reddit**: Souvent plus détaillés
3. **Noter les arcs**: Parfois un arc entier est filler
4. **Sauvegarder les sources**: Pour référence future

## Limitations

- La recherche automatique via API web n'est pas implémentée (nécessite clé API)
- Certains vieux anime peuvent manquer de guides
- Les différences de version (VF vs VO) peuvent varier
