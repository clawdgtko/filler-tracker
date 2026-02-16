#!/usr/bin/env node
/**
 * CSV to SHOWS_DB Converter
 * Convertit les fichiers CSV de guides en code JavaScript pour SHOWS_DB
 * 
 * Usage: node csv-to-js.js <fichier.csv>
 * Exemple: node csv-to-js.js ../data/guides/naruto-s1.csv
 */

const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  const episodes = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const ep = {};
    headers.forEach((h, idx) => {
      ep[h.trim()] = values[idx]?.trim().replace(/^"|"$/g, '') || '';
    });
    episodes.push(ep);
  }
  
  return episodes;
}

function convertToJS(csvFile) {
  const content = fs.readFileSync(csvFile, 'utf8');
  const episodes = parseCSV(content);
  
  // Extraire infos du nom de fichier
  const basename = path.basename(csvFile, '.csv');
  const match = basename.match(/(.+)-s(\d+)/);
  
  if (!match) {
    console.error('Format de nom de fichier invalide. Attendu: serie-sX.csv');
    process.exit(1);
  }
  
  const showId = match[1];
  const season = match[2];
  
  // Générer le code JS
  const jsLines = episodes.map(ep => {
    const note = ep.note || '';
    const title = ep.title || '';
    const type = ep.type || 'unknown';
    return `          { ep: ${ep.episode}, type: "${type}", note: "${title}${note ? ' - ' + note : ''}" }`;
  });
  
  const output = `// Ajouter dans SHOWS_DB['${showId}'].guides.fr.s${season}:

        s${season}: [
${jsLines.join(',\n')}
        ]`;
  
  return output;
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node csv-to-js.js <fichier.csv>');
  console.log('');
  console.log('Exemples:');
  console.log('  node csv-to-js.js ../data/guides/naruto-s1.csv');
  console.log('  node csv-to-js.js ../data/guides/one-piece-s1.csv');
  process.exit(1);
}

const csvFile = args[0];
const fullPath = path.resolve(csvFile);

if (!fs.existsSync(fullPath)) {
  console.error(`Fichier non trouvé: ${fullPath}`);
  process.exit(1);
}

console.log(convertToJS(fullPath));
console.log('');
console.log('// Copier-coller ce code dans SHOWS_DB dans worker.js');
