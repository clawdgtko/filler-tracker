// Filler Tracker - Version avec intégration TMDB API
// Multilangue (FR/EN) avec guides filler et données réelles

const SHOWS_DB = {
  'stargate-sg1': {
    tmdbId: 4629,
    guides: {
      fr: {
        s1: [
          { ep: 1, type: "must-watch", note: "Pilote - Introduction complète" },
          { ep: 2, type: "optional", note: "Kawalsky possédé" },
          { ep: 3, type: "skip", note: "Épisode très faible" },
          { ep: 4, type: "important", note: "Introduction du Dr Fraiser" },
          { ep: 5, type: "optional", note: "Filler planète" },
          { ep: 6, type: "important", note: "Passé familial Jack" },
          { ep: 7, type: "optional", note: "Race ancienne" },
          { ep: 8, type: "must-watch", note: "Excellente histoire" },
          { ep: 9, type: "important", note: "Première mention Thor" },
          { ep: 10, type: "optional", note: "Intéressant" },
          { ep: 11, type: "important", note: "Teal'c famille" },
          { ep: 12, type: "optional", note: "Daniel capturé" },
          { ep: 13, type: "skip", note: "Le pire épisode" },
          { ep: 14, type: "must-watch", note: "Cassandra - arc important" },
          { ep: 15, type: "optional", note: "Procès Teal'c" },
          { ep: 16, type: "optional", note: "Les Tollans" },
          { ep: 17, type: "must-watch", note: "Jack & Carter Antarctique" },
          { ep: 18, type: "important", note: "Équipe dupliquée" },
          { ep: 19, type: "must-watch", note: "Réalité alternative" },
          { ep: 20, type: "skip", note: "Clip show" },
          { ep: 21, type: "must-watch", note: "Finale saison 1" }
        ]
      },
      en: {
        s1: [
          { ep: 1, type: "must-watch", note: "Pilot - Complete introduction" },
          { ep: 21, type: "must-watch", note: "Season 1 finale" }
        ]
      }
    }
  },
  'stargate-atlantis': {
    tmdbId: 2290,
    guides: {
      fr: {
        s1: [
          { ep: 1, type: "must-watch", note: "Rising (Partie 1) - Découverte d'Atlantis" },
          { ep: 2, type: "must-watch", note: "Rising (Partie 2) - L'équipe piégée" },
          { ep: 3, type: "important", note: "Hide and Seek - Premiers pas sur Atlantis" },
          { ep: 4, type: "optional", note: "Thirty-Eight Minutes" },
          { ep: 5, type: "important", note: "Suspicion - Qui espionne ?" },
          { ep: 6, type: "must-watch", note: "Childhood's End - Société de jeunes" },
          { ep: 7, type: "optional", note: "Poisoning the Well - Wraith découvert" },
          { ep: 8, type: "optional", note: "Underground - Alliance Genii" },
          { ep: 9, type: "optional", note: "Home - Illusions sur Terre" },
          { ep: 10, type: "important", note: "The Storm - Tempête menace Atlantis" },
          { ep: 11, type: "must-watch", note: "The Eye - Attaque Genii" },
          { ep: 12, type: "optional", note: "The Defiant One - Wraith solitaire" },
          { ep: 13, type: "optional", note: "Hot Zone - Virus mortel" },
          { ep: 14, type: "important", note: "Sanctuary - Ascension possible" },
          { ep: 15, type: "optional", note: "Before I Sleep - Ancienne Elizabeth" },
          { ep: 16, type: "optional", note: "The Brotherhood - Clé ZPM" },
          { ep: 17, type: "important", note: "Letters from Pegasus - Message vers Terre" },
          { ep: 18, type: "skip", note: "The Gift - Exposition Wraith" },
          { ep: 19, type: "important", note: "The Siege (Partie 1) - Wraith arrivent" },
          { ep: 20, type: "must-watch", note: "The Siege (Partie 2) - Bataille finale" }
        ]
      }
    }
  },
  'breaking-bad': { tmdbId: 1396 },
  'the-office': { tmdbId: 2316 },
  'friends': { tmdbId: 1668 },
  'game-of-thrones': { tmdbId: 1399 },
  'stranger-things': { tmdbId: 66732 },
  'the-simpsons': { tmdbId: 456 },
  'sherlock': { tmdbId: 19885 }
};

// TMDB API client
class TMDB {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.imageBase = 'https://image.tmdb.org/t/p';
  }
  
  async fetch(endpoint, lang = 'fr-FR') {
    const url = `${this.baseUrl}${endpoint}?api_key=${this.apiKey}&language=${lang}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  }
  
  getPoster(path, size = 'w342') {
    return path ? `${this.imageBase}/${size}${path}` : null;
  }
  
  getBackdrop(path, size = 'w1280') {
    return path ? `${this.imageBase}/${size}${path}` : null;
  }
  
  async getShow(id, lang = 'fr-FR') {
    return this.fetch(`/tv/${id}`, lang);
  }
  
  async getSeason(showId, seasonNum, lang = 'fr-FR') {
    return this.fetch(`/tv/${showId}/season/${seasonNum}`, lang);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Get language preference
    const cookies = request.headers.get('Cookie') || '';
    const langMatch = cookies.match(/lang=(fr|en)/);
    const lang = langMatch ? langMatch[1] : 'fr';
    const tmdbLang = lang === 'fr' ? 'fr-FR' : 'en-US';
    
    // Initialize TMDB client
    const tmdb = new TMDB(env.TMDB_API_KEY);
    
    if (path === '/' || path === '/index.html') {
      return renderHome(tmdb, lang, tmdbLang);
    }
    
    if (path.startsWith('/show/')) {
      const showId = path.split('/')[2];
      return renderShow(showId, tmdb, lang, tmdbLang);
    }
    
    if (path === '/api/set-language') {
      return setLanguage(request);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

async function renderHome(tmdb, lang, tmdbLang) {
  const t = {
    fr: {
      badge: 'Nouveau — Stargate SG-1 disponible',
      title: 'Ne perds plus de temps avec les épisodes inutiles',
      subtitle: 'Guides d\'épisodes complets avec notation must-watch, important et optionnel. Pour les séries qui en valent la peine.',
      cta: 'Explorer les séries →',
      stats: { series: 'Séries référencées', episodes: 'Épisodes notés', price: 'Gratuit, toujours' },
      popular: 'Séries populaires',
      free: 'Tous les guides gratuits',
      langLabel: 'FR'
    },
    en: {
      badge: 'New — Stargate SG-1 available',
      title: 'Stop wasting time on useless episodes',
      subtitle: 'Complete episode guides with must-watch, important and optional ratings.',
      cta: 'Browse shows →',
      stats: { series: 'Shows referenced', episodes: 'Episodes rated', price: 'Free, always' },
      popular: 'Popular shows',
      free: 'All guides free',
      langLabel: 'EN'
    }
  }[lang];
  
  // Fetch real data from TMDB for all shows
  const showIds = Object.keys(SHOWS_DB);
  const showsData = [];
  
  for (const id of showIds) {
    try {
      const data = await tmdb.getShow(SHOWS_DB[id].tmdbId, tmdbLang);
      showsData.push({
        id,
        name: data.name,
        overview: data.overview,
        poster: tmdb.getPoster(data.poster_path, 'w342'),
        backdrop: tmdb.getBackdrop(data.backdrop_path, 'w780'),
        year: data.first_air_date?.split('-')[0] || 'N/A',
        seasons: data.number_of_seasons,
        rating: data.vote_average?.toFixed(1),
        genres: data.genres?.slice(0, 2).map(g => g.name).join(', ') || ''
      });
    } catch (e) {
      console.error(`Failed to fetch ${id}:`, e);
    }
  }
  
  const showsHtml = showsData.map(show => `
    <a href="/show/${show.id}" class="show-card">
        <div class="show-poster" style="background-image: url('${show.poster || ''}'); background-size: cover; background-position: center;">
            ${!show.poster ? '<span style="font-size: 3rem;">📺</span>' : ''}
        </div>
        <div class="show-info">
            <h3 class="show-title">${show.name}</h3>
            <p class="show-meta">${show.seasons} ${lang === 'fr' ? 'saisons' : 'seasons'} • ${show.year} • ⭐ ${show.rating}</p>
            <span class="tag">${show.genres}</span>
        </div>
    </a>
  `).join('');
  
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Filler Tracker — Episode Guides</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <style>
      :root {
        --bg: #0c0c0c;
        --surface: #141414;
        --surface-hover: #1a1a1a;
        --border: #222;
        --text: #f5f5f5;
        --text-muted: #888;
        --accent: #ff6b35;
        --must-watch: #22c55e;
        --important: #f59e0b;
        --optional: #ef4444;
      }
      
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      body {
        font-family: 'Inter', system-ui, sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.6;
      }
      
      .nav {
        position: fixed;
        top: 0; left: 0; right: 0;
        height: 64px;
        background: rgba(12, 12, 12, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 48px;
        z-index: 100;
      }
      
      .logo {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--text);
        text-decoration: none;
      }
      
      .logo span { color: var(--accent); }
      
      .nav-links {
        display: flex;
        gap: 32px;
        align-items: center;
      }
      
      .nav-links a {
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: color 0.2s;
      }
      
      .nav-links a:hover { color: var(--text); }
      
      .lang-switch {
        background: var(--surface);
        border: 1px solid var(--border);
        color: var(--text);
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
      }
      
      .hero {
        padding: 140px 48px 80px;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .badge {
        display: inline-block;
        padding: 6px 14px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 4px;
        font-size: 0.8rem;
        color: var(--accent);
        font-weight: 500;
        margin-bottom: 24px;
      }
      
      .hero h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 4rem;
        font-weight: 700;
        line-height: 1.05;
        letter-spacing: -2px;
        margin-bottom: 24px;
        max-width: 800px;
      }
      
      .hero p {
        font-size: 1.15rem;
        color: var(--text-muted);
        max-width: 500px;
        margin-bottom: 40px;
      }
      
      .btn {
        padding: 14px 28px;
        border-radius: 4px;
        font-weight: 600;
        text-decoration: none;
        font-size: 0.95rem;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      
      .btn-primary {
        background: var(--accent);
        color: #000;
      }
      
      .stats {
        display: flex;
        gap: 80px;
        padding: 40px 48px;
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .stat h3 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--accent);
      }
      
      .stat p { color: var(--text-muted); font-size: 0.9rem; }
      
      .section {
        padding: 80px 48px;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 48px;
      }
      
      .section h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.75rem;
        font-weight: 600;
      }
      
      .section h2 span { color: var(--text-muted); font-weight: 400; }
      
      .shows-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }
      
      .show-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        overflow: hidden;
        text-decoration: none;
        color: var(--text);
        transition: all 0.2s;
      }
      
      .show-card:hover {
        border-color: var(--accent);
        transform: translateY(-4px);
      }
      
      .show-poster {
        height: 280px;
        background: linear-gradient(135deg, #1a1a1a 0%, #0c0c0c 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid var(--border);
      }
      
      .show-info { padding: 20px; }
      
      .show-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 8px;
      }
      
      .show-meta {
        color: var(--text-muted);
        font-size: 0.85rem;
        margin-bottom: 12px;
      }
      
      .tag {
        display: inline-block;
        padding: 4px 10px;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 4px;
        font-size: 0.75rem;
        color: var(--text-muted);
      }
      
      footer {
        padding: 48px;
        text-align: center;
        color: var(--text-muted);
        font-size: 0.85rem;
        border-top: 1px solid var(--border);
      }
      
      @media (max-width: 968px) {
        .hero h1 { font-size: 2.5rem; }
        .shows-grid { grid-template-columns: 1fr; }
        .stats { flex-direction: column; gap: 24px; }
        .nav { padding: 0 24px; }
        .hero, .section { padding-left: 24px; padding-right: 24px; }
      }
    </style>
</head>
<body>
    <nav class="nav">
        <a href="/" class="logo">Filler<span>.</span></a>
        <div class="nav-links">
            <a href="/">${lang === 'fr' ? 'Accueil' : 'Home'}</a>
            <a href="#shows">${lang === 'fr' ? 'Séries' : 'Shows'}</a>
            <button class="lang-switch" onclick="toggleLang()">${t.langLabel}</button>
        </div>
    </nav>

    <section class="hero">
        <div class="badge">${t.badge}</div>
        <h1>${t.title}</h1>
        <p>${t.subtitle}</p>
        <a href="#shows" class="btn btn-primary">${t.cta}</a>
    </section>

    <div class="stats">
        <div class="stat"><h3>${showsData.length}</h3><p>${t.stats.series}</p></div>
        <div class="stat"><h3>500+</h3><p>${t.stats.episodes}</p></div>
        <div class="stat"><h3>0$</h3><p>${t.stats.price}</p></div>
    </div>

    <section class="section" id="shows">
        <div class="section-header">
            <h2>${t.popular} <span>— ${t.free}</span></h2>
        </div>
        <div class="shows-grid">
            ${showsHtml}
        </div>
    </section>

    <footer>
        <p>© 2026 Filler Tracker — Données TMDB</p>
    </footer>
    
    <script>
        function toggleLang() {
            const newLang = document.documentElement.lang === 'fr' ? 'en' : 'fr';
            fetch('/api/set-language?lang=' + newLang).then(() => location.reload());
        }
    </script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

async function renderShow(showId, tmdb, lang, tmdbLang) {
  const show = SHOWS_DB[showId];
  if (!show) return new Response('Show not found', { status: 404 });
  
  const t = {
    fr: { back: '← Retour', guide: 'Guide des épisodes', mustWatch: 'À voir', important: 'Important', optional: 'Optionnel', skip: 'Skip' },
    en: { back: '← Back', guide: 'Episode Guide', mustWatch: 'Must Watch', important: 'Important', optional: 'Optional', skip: 'Skip' }
  }[lang];
  
  // Fetch show data from TMDB
  let showData, seasonData;
  try {
    showData = await tmdb.getShow(show.tmdbId, tmdbLang);
    seasonData = await tmdb.getSeason(show.tmdbId, 1, tmdbLang);
  } catch (e) {
    return new Response('Error fetching data', { status: 500 });
  }
  
  const backdrop = tmdb.getBackdrop(showData.backdrop_path, 'w1280');
  const poster = tmdb.getPoster(showData.poster_path, 'w342');
  
  // Merge TMDB episodes with our guides
  const guides = show.guides?.[lang] || show.guides?.['en'] || {};
  const guideMap = new Map((guides.s1 || []).map(g => [g.ep, g]));
  
  const episodes = (seasonData.episodes || []).map(ep => {
    const guide = guideMap.get(ep.episode_number);
    return {
      number: ep.episode_number,
      title: ep.name,
      overview: ep.overview,
      still: tmdb.getPoster(ep.still_path, 'w300'),
      airDate: ep.air_date,
      type: guide?.type || 'unknown',
      note: guide?.note || ''
    };
  });
  
  const typeColors = {
    'must-watch': '#22c55e',
    'important': '#f59e0b',
    'optional': '#ef4444',
    'skip': '#666',
    'clip': '#3b82f6',
    'unknown': '#444'
  };
  
  const typeLabels = {
    'must-watch': t.mustWatch,
    'important': t.important,
    'optional': t.optional,
    'skip': t.skip,
    'clip': 'Clip',
    'unknown': lang === 'fr' ? 'Non classé' : 'Unrated'
  };
  
  const episodesHtml = episodes.map(ep => `
    <div class="episode" data-expanded="false">
        <div class="ep-still" style="background-image: url('${ep.still || ''}')">
            ${!ep.still ? `<span class="ep-number-fallback">${ep.number}</span>` : ''}
        </div>
        <div class="ep-content">
            <div class="ep-header">
                <div>
                    <span class="ep-num">S1E${ep.number}</span>
                    <h3 class="ep-title">${ep.title}</h3>
                </div>
                <span class="ep-badge" style="background: ${typeColors[ep.type]}20; color: ${typeColors[ep.type]}; border: 1px solid ${typeColors[ep.type]}40;">
                    ${typeLabels[ep.type]}
                </span>
            </div>
            <p class="ep-overview">${ep.overview || (lang === 'fr' ? 'Aucun résumé disponible' : 'No overview available')}</p>
            ${ep.note ? `<p class="ep-note">💡 ${ep.note}</p>` : ''}
            <button class="ep-toggle" onclick="toggleEp(this)">${lang === 'fr' ? 'Voir plus' : 'Show more'}</button>
        </div>
    </div>
  `).join('');
  
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <title>${showData.name} — Filler Tracker</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <style>
      :root {
        --bg: #0c0c0c;
        --surface: #141414;
        --surface-hover: #1a1a1a;
        --border: #222;
        --text: #f5f5f5;
        --text-muted: #888;
        --accent: #ff6b35;
      }
      
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      body {
        font-family: 'Inter', system-ui, sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.6;
      }
      
      .nav {
        position: fixed;
        top: 0; left: 0; right: 0;
        height: 64px;
        background: rgba(12, 12, 12, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 48px;
        z-index: 100;
      }
      
      .logo {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--text);
        text-decoration: none;
      }
      
      .logo span { color: var(--accent); }
      
      .nav-links a {
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.9rem;
      }
      
      .hero-backdrop {
        height: 400px;
        background-size: cover;
        background-position: center;
        position: relative;
      }
      
      .hero-backdrop::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(12,12,12,0.3) 0%, var(--bg) 100%);
      }
      
      .container {
        max-width: 900px;
        margin: -100px auto 0;
        padding: 0 48px 48px;
        position: relative;
        z-index: 10;
      }
      
      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--text-muted);
        text-decoration: none;
        margin-bottom: 24px;
        font-size: 0.9rem;
      }
      
      .show-header {
        display: flex;
        gap: 32px;
        margin-bottom: 48px;
      }
      
      .show-poster {
        width: 200px;
        height: 300px;
        border-radius: 12px;
        background-size: cover;
        background-position: center;
        border: 1px solid var(--border);
        flex-shrink: 0;
      }
      
      .show-info h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 3rem;
        margin-bottom: 16px;
      }
      
      .show-info p {
        color: var(--text-muted);
        margin-bottom: 16px;
        line-height: 1.7;
      }
      
      .meta {
        display: flex;
        gap: 24px;
        font-size: 0.9rem;
        color: var(--text-muted);
        margin-bottom: 16px;
      }
      
      .rating {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--surface);
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
      }
      
      .episodes-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .episode {
        display: flex;
        gap: 20px;
        padding: 20px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        transition: all 0.2s;
      }
      
      .episode:hover {
        border-color: var(--border);
        background: var(--surface-hover);
      }
      
      .ep-still {
        width: 160px;
        height: 90px;
        background: var(--bg);
        border-radius: 8px;
        background-size: cover;
        background-position: center;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .ep-number-fallback {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-muted);
      }
      
      .ep-content {
        flex: 1;
      }
      
      .ep-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }
      
      .ep-num {
        color: var(--accent);
        font-weight: 600;
        font-size: 0.85rem;
        margin-right: 8px;
      }
      
      .ep-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.1rem;
        font-weight: 600;
        display: inline;
      }
      
      .ep-badge {
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .ep-overview {
        color: var(--text-muted);
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 8px;
      }
      
      .ep-note {
        color: var(--accent);
        font-size: 0.9rem;
        font-style: italic;
      }
      
      .ep-overview {
        color: var(--text-muted);
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 8px;
        max-height: 3.2em;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }
      
      .episode[data-expanded="true"] .ep-overview {
        max-height: 500px;
      }
      
      .ep-toggle {
        background: transparent;
        border: none;
        color: var(--accent);
        font-size: 0.85rem;
        cursor: pointer;
        padding: 4px 0;
        font-weight: 500;
      }
      
      .ep-toggle:hover {
        text-decoration: underline;
      }
      
      .episode[data-expanded="true"] .ep-toggle {
        color: var(--text-muted);
      }
      
      .season-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 48px 0 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border);
      }
      
      .expand-all-btn {
        background: var(--surface);
        border: 1px solid var(--border);
        color: var(--text);
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .expand-all-btn:hover {
        border-color: var(--accent);
      }
      
      @media (max-width: 768px) {
        .container { padding: 0 24px 48px; }
        .show-header { flex-direction: column; }
        .show-poster { width: 150px; height: 225px; }
        .show-info h1 { font-size: 2rem; }
        .episode { flex-direction: column; }
        .ep-still { width: 100%; height: 140px; }
      }
    </style>
</head>
<body>
    <nav class="nav">
        <a href="/" class="logo">Filler<span>.</span></a>
        <div class="nav-links">
            <a href="/">${lang === 'fr' ? 'Accueil' : 'Home'}</a>
        </div>
    </nav>
    
    <div class="hero-backdrop" style="background-image: url('${backdrop || poster}')"></div>
    
    <div class="container">
        <a href="/" class="back-link">${t.back}</a>
        
        <div class="show-header">
            <div class="show-poster" style="background-image: url('${poster}')"></div>
            <div class="show-info">
                <h1>${showData.name}</h1>
                <p>${showData.overview}</p>
                <div class="meta">
                    <span>${showData.number_of_seasons} ${lang === 'fr' ? 'saisons' : 'seasons'}</span>
                    <span>•</span>
                    <span>${showData.first_air_date?.split('-')[0] || 'N/A'}</span>
                    <span>•</span>
                    <span>${showData.genres?.map(g => g.name).join(', ')}</span>
                </div>
                <div class="rating">⭐ ${showData.vote_average?.toFixed(1)} / 10</div>
            </div>
        </div>
        
        <div class="season-header-row">
            <h2 class="season-title" style="font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; margin: 0;">${t.guide} — ${lang === 'fr' ? 'Saison 1' : 'Season 1'}</h2>
            <button class="expand-all-btn" onclick="toggleAllEps()">${lang === 'fr' ? 'Tout déplier' : 'Expand all'}</button>
        </div>
        
        <div class="episodes-list">
            ${episodesHtml}
        </div>
    </div>
    <script>
        function toggleEp(btn) {
            const episode = btn.closest('.episode');
            const isExpanded = episode.getAttribute('data-expanded') === 'true';
            episode.setAttribute('data-expanded', !isExpanded);
            btn.textContent = isExpanded ? '${lang === 'fr' ? 'Voir plus' : 'Show more'}' : '${lang === 'fr' ? 'Voir moins' : 'Show less'}';
        }
        
        let allExpanded = false;
        function toggleAllEps() {
            allExpanded = !allExpanded;
            const episodes = document.querySelectorAll('.episode');
            const btn = document.querySelector('.expand-all-btn');
            episodes.forEach(ep => {
                ep.setAttribute('data-expanded', allExpanded);
                const toggleBtn = ep.querySelector('.ep-toggle');
                if (toggleBtn) {
                    toggleBtn.textContent = allExpanded ? '${lang === 'fr' ? 'Voir moins' : 'Show less'}' : '${lang === 'fr' ? 'Voir plus' : 'Show more'}';
                }
            });
            btn.textContent = allExpanded ? '${lang === 'fr' ? 'Tout replier' : 'Collapse all'}' : '${lang === 'fr' ? 'Tout déplier' : 'Expand all'}';
        }
    </script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function setLanguage(request) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'fr';
  
  return new Response(JSON.stringify({ success: true, lang }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Strict`
    }
  });
}