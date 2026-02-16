#!/usr/bin/env node
/**
 * Filler Auto-Research Agent
 * Recherche automatique de guides de fillers via API web
 * Parse les résultats et génère des CSV
 * 
 * Usage: node auto-research.js <nom-de-la-serie>
 * Exemple: node auto-research.js "one piece"
 */

const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../data/guides');

// Sites connus pour les guides de fillers
const KNOWN_SOURCES = {
  'animefillerlist.com': {
    name: 'Anime Filler List',
    pattern: /(\d+)\s*-\s*(.+?)\s*-\s*(Canon|Manga Canon|Mixed Canon\/Filler|Filler)/i
  },
  'fillerlist.com': {
    name: 'Filler List',
    pattern: /Episode\s*(\d+)[\s:]+(.+?)(?:\s*-\s*(Canon|Filler|Mixed))?/i
  }
};

class AutoResearchAgent {
  constructor() {
    this.results = new Map();
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
  }

  /**
   * Génère les requêtes de recherche
   */
  generateQueries(showName) {
    return [
      `${showName} filler guide complete list`,
      `${showName} canon episodes only`,
      `${showName} filler episodes to skip`,
      `${showName} anime filler list reddit`,
      `site:reddit.com ${showName} filler guide`,
      `site:animefillerlist.com ${showName}`
    ];
  }

  /**
   * Analyse le texte pour trouver des patterns d'épisodes
   */
  parseEpisodeData(text, showName) {
    const episodes = [];
    
    // Pattern: "Episode X - Title - Type"
    const patterns = [
      /Episode\s*(\d+)[\s:-]+(.+?)(?:\s*[-:]\s*(Canon|Filler|Mixed|Mostly Filler|Mostly Canon))?/gi,
      /(\d+)\s*[-.]\s*(.+?)(?:\s*[-.]\s*(Canon|Filler|Mixed|Anime Canon))?/gi,
      /#?(\d+)\s+(.+?)(?:\s+\((Canon|Filler|Mixed)\))?/gi
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const epNum = parseInt(match[1]);
        const title = match[2]?.trim() || '';
        const typeRaw = match[3]?.toLowerCase() || '';
        
        let type = 'unknown';
        if (typeRaw.includes('canon') && !typeRaw.includes('filler')) {
          type = 'must-watch';
        } else if (typeRaw.includes('mixed')) {
          type = 'important';
        } else if (typeRaw.includes('filler')) {
          type = 'skip';
        }
        
        if (!episodes.find(e => e.episode === epNum)) {
          episodes.push({ episode: epNum, title, type, source: 'auto' });
        }
      }
    }
    
    return episodes.sort((a, b) => a.episode - b.episode);
  }

  /**
   * Détermine le type d'épisode basé sur le contenu
   */
  determineType(text) {
    const lower = text.toLowerCase();
    
    if (lower.includes('must watch') || lower.includes('essential') || 
        lower.includes('canon') || lower.includes('main story')) {
      return 'must-watch';
    }
    if (lower.includes('skip') || lower.includes('avoid') || 
        lower.includes('filler') || lower.includes('useless')) {
      return 'skip';
    }
    if (lower.includes('optional') || lower.includes('worth watching') ||
        lower.includes('decent') || lower.includes('ok')) {
      return 'optional';
    }
    if (lower.includes('important') || lower.includes('character development') ||
        lower.includes('recommended')) {
      return 'important';
    }
    
    return 'unknown';
  }

  /**
   * Génère le CSV final
   */
  generateCSV(episodes, showName, season) {
    const rows = [['episode', 'title', 'type', 'note', 'confidence']];
    
    for (const ep of episodes) {
      rows.push([
        ep.episode,
        `"${ep.title.replace(/"/g, '""')}"`,
        ep.type,
        ep.note || '',
        ep.source === 'auto' ? 'low' : 'high'
      ]);
    }
    
    return rows.map(r => r.join(',')).join('\n');
  }

  /**
   * Crée un rapport de recherche
   */
  createResearchReport(showName, season, queries) {
    const sanitizedName = showName.toLowerCase().replace(/\s+/g, '-');
    const filename = `${sanitizedName}-s${season}-research-report.md`;
    const filepath = path.join(OUTPUT_DIR, filename);
    
    const content = `# Rapport de Recherche: ${showName} - Saison ${season}

Date: ${new Date().toISOString()}

## Requêtes de recherche

${queries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

## Instructions manuelles

Comme la recherche automatique a des limitations, voici les étapes manuelles:

### 1. Visiter ces sites

- [Anime Filler List](https://www.animefillerlist.com/shows/${showName.toLowerCase().replace(/\s+/g, '-')})
- [Filler List](https://www.fillerlist.com/${showName.toLowerCase().replace(/\s+/g, '-')})
- [Reddit r/anime](https://www.reddit.com/r/anime/search/?q=${encodeURIComponent(showName + ' filler')})

### 2. Noter les épisodes

Pour chaque épisode, déterminer:
- **must-watch**: Canon, essentiel à l'histoire principale
- **important**: Développement de personnage, arc secondaire
- **optional**: Filler acceptable, peut être regardé
- **skip**: Filler à éviter, pas pertinent

### 3. Remplir le CSV

Utiliser le template généré et remplir les données.

## Résultats automatiques

*Aucun résultat automatique - recherche manuelle requise*

---

**Note**: Les guides de fillers sont souvent subjectifs. Vérifier plusieurs sources!
`;
    
    fs.writeFileSync(filepath, content);
    return filepath;
  }

  /**
   * Recherche principale
   */
  async research(showName, season = 1) {
    console.log(`🔍 Recherche automatique pour: ${showName}`);
    console.log('');
    
    const queries = this.generateQueries(showName);
    console.log('Requêtes générées:');
    queries.forEach((q, i) => console.log(`  ${i + 1}. ${q}`));
    console.log('');
    
    // Créer le rapport de recherche
    const reportFile = this.createResearchReport(showName, season, queries);
    console.log(`✅ Rapport de recherche: ${reportFile}`);
    
    // Créer un template CSV vide
    const sanitizedName = showName.toLowerCase().replace(/\s+/g, '-');
    const csvFile = path.join(OUTPUT_DIR, `${sanitizedName}-s${season}.csv`);
    
    const emptyCSV = 'episode,title,type,note,confidence\n';
    fs.writeFileSync(csvFile, emptyCSV);
    console.log(`✅ Template CSV: ${csvFile}`);
    
    console.log('');
    console.log('⚠️  IMPORTANT: La recherche automatique nécessite une API web.');
    console.log('    Pour l\'instant, utilisez le rapport pour recherche manuelle.');
    console.log('');
    console.log('📋 Prochaines étapes:');
    console.log('1. Ouvrir le fichier .md pour les liens');
    console.log('2. Visiter animefillerlist.com et reddit');
    console.log('3. Remplir le CSV avec les épisodes trouvés');
    console.log('4. Importer dans SHOWS_DB');
    
    return { reportFile, csvFile };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node auto-research.js <nom-de-la-serie> [saison]');
    console.log('');
    console.log('Exemples:');
    console.log('  node auto-research.js "one piece" 1');
    console.log('  node auto-research.js naruto 2');
    console.log('  node auto-research.js bleach');
    process.exit(1);
  }
  
  const showName = args[0];
  const season = parseInt(args[1]) || 1;
  
  const agent = new AutoResearchAgent();
  await agent.research(showName, season);
}

main().catch(console.error);
