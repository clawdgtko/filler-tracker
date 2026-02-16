#!/usr/bin/env node
/**
 * Filler Research Agent
 * Recherche des guides de fillers sur Reddit, forums et sites spécialisés
 * Génère des fichiers CSV prêts à intégrer dans Filler Tracker
 * 
 * Usage: node filler-research.js <nom-de-la-serie> [saison]
 * Exemple: node filler-research.js "naruto" 1
 */

const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../data/guides');

// Sources de recherche à interroger
const SEARCH_QUERIES = {
  reddit: (show, season) => [
    `${show} filler guide season ${season} reddit`,
    `${show} filler episodes skip reddit`,
    `${show} worth watching filler list`,
    `r/anime ${show} filler guide`
  ],
  forums: (show, season) => [
    `${show} filler guide complete`,
    `${show} canon episodes list`,
    `${show} skip fillers guide`,
    `${show} episode guide important only`
  ]
};

// Types d'épisodes
const EPISODE_TYPES = {
  'must-watch': ['canon', 'main story', 'essential', 'must watch', 'important', 'plot'],
  'important': ['semi-canon', 'character development', 'recommended', 'worth watching'],
  'optional': ['filler', 'optional', 'side story', 'extra'],
  'skip': ['skip', 'avoid', 'useless', 'bad filler', 'worst']
};

class FillerResearchAgent {
  constructor() {
    this.results = [];
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
  }

  /**
   * Génère les URLs de recherche
   */
  generateSearchUrls(showName, season = 1) {
    const queries = [];
    
    // Reddit
    SEARCH_QUERIES.reddit(showName, season).forEach(q => {
      queries.push(`https://www.reddit.com/search/?q=${encodeURIComponent(q)}&type=posts`);
    });
    
    // Google
    SEARCH_QUERIES.forums(showName, season).forEach(q => {
      queries.push(`https://www.google.com/search?q=${encodeURIComponent(q)}`);
    });
    
    return queries;
  }

  /**
   * Génère un template CSV pour la série
   */
  generateCSVTemplate(showName, season, totalEpisodes = 24) {
    const rows = [];
    rows.push(['episode', 'title', 'type', 'note', 'sources']);
    
    for (let i = 1; i <= totalEpisodes; i++) {
      rows.push([i, '', 'must-watch', '', '']);
    }
    
    return rows.map(r => r.join(',')).join('\n');
  }

  /**
   * Crée un fichier de recherche avec les URLs à visiter
   */
  createResearchFile(showName, season) {
    const sanitizedName = showName.toLowerCase().replace(/\s+/g, '-');
    const filename = `${sanitizedName}-s${season}-research.md`;
    const filepath = path.join(OUTPUT_DIR, filename);
    
    const urls = this.generateSearchUrls(showName, season);
    
    const content = `# Recherche Guide Filler: ${showName} - Saison ${season}

## URLs à visiter

${urls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

## Sites recommandés

- https://www.reddit.com/r/anime/
- https://www.reddit.com/r/OnePiece/
- https://www.reddit.com/r/Naruto/
- https://animefillerlist.com/
- https://www.fillerlist.com/

## Instructions

1. Visiter les URLs ci-dessus
2. Chercher les guides de fillers canoniques
3. Noter pour chaque épisode:
   - **must-watch**: Épisode canon, essentiel à l'histoire
   - **important**: Développement de personnage ou arc secondaire intéressant
   - **optional**: Filler acceptable mais pas essentiel
   - **skip**: Filler à éviter

## Template CSV

\`\`\`csv
${this.generateCSVTemplate(showName, season)}
\`\`\`

---
Généré le: ${new Date().toISOString()}
`;
    
    fs.writeFileSync(filepath, content);
    console.log(`✅ Fichier de recherche créé: ${filepath}`);
    return filepath;
  }

  /**
   * Crée un template CSV vide à remplir
   */
  createCSVTemplate(showName, season, totalEpisodes = 24) {
    const sanitizedName = showName.toLowerCase().replace(/\s+/g, '-');
    const filename = `${sanitizedName}-s${season}.csv`;
    const filepath = path.join(OUTPUT_DIR, filename);
    
    const csv = this.generateCSVTemplate(showName, season, totalEpisodes);
    fs.writeFileSync(filepath, csv);
    console.log(`✅ Template CSV créé: ${filepath}`);
    return filepath;
  }

  /**
   * Recherche principale
   */
  async research(showName, season = 1, totalEpisodes = 24) {
    console.log(`🔍 Recherche de guide pour: ${showName} - Saison ${season}`);
    console.log('');
    
    // Créer les fichiers
    const researchFile = this.createResearchFile(showName, season);
    const csvFile = this.createCSVTemplate(showName, season, totalEpisodes);
    
    console.log('');
    console.log('📋 Prochaines étapes:');
    console.log('1. Ouvrir le fichier .md pour voir les URLs de recherche');
    console.log('2. Visiter les sites et noter les épisodes importants');
    console.log('3. Remplir le fichier CSV avec les données trouvées');
    console.log('4. Importer le CSV dans SHOWS_DB du worker.js');
    console.log('');
    
    return { researchFile, csvFile };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node filler-research.js <nom-de-la-serie> [saison] [nombre-episodes]');
    console.log('');
    console.log('Exemples:');
    console.log('  node filler-research.js "one piece" 1 61');
    console.log('  node filler-research.js naruto 2 26');
    console.log('  node filler-research.js "attack on titan" 1 25');
    process.exit(1);
  }
  
  const showName = args[0];
  const season = parseInt(args[1]) || 1;
  const totalEpisodes = parseInt(args[2]) || 24;
  
  const agent = new FillerResearchAgent();
  await agent.research(showName, season, totalEpisodes);
}

main().catch(console.error);
