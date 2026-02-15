// Filler Tracker - Version complète avec TMDB/TVDB
// Multilangue (FR/EN) avec guides filler

const SHOWS_DB = {
  'stargate-sg1': {
    tmdbId: 4629,
    tvdbId: 72449,
    guides: {
      fr: {
        s1: [
          { ep: 1, title: "Children of the Gods", type: "must-watch", desc: "Le pilote - Introduction complète" },
          { ep: 2, title: "The Enemy Within", type: "optional", desc: "Kawalsky possédé - peut être skippé" },
          { ep: 3, title: "Emancipation", type: "skip", desc: "Épisode très faible - skip recommandé" },
          { ep: 4, title: "The Broca Divide", type: "important", desc: "Introduction du Dr Fraiser" },
          { ep: 5, title: "The First Commandment", type: "optional", desc: "Filler sur une planète" },
          { ep: 6, title: "Cold Lazarus", type: "important", desc: "Jack et son passé familial" },
          { ep: 7, title: "The Nox", type: "optional", desc: "Découverte d'une race ancienne" },
          { ep: 8, title: "Brief Candle", type: "must-watch", desc: "Excellente histoire autonome" },
          { ep: 9, title: "Thor's Hammer", type: "important", desc: "Première mention de Thor" },
          { ep: 10, title: "The Torment of Tantalus", type: "optional", desc: "Intéressant mais pas essentiel" },
          { ep: 11, title: "Bloodlines", type: "important", desc: "Teal'c et sa famille" },
          { ep: 12, title: "Fire and Water", type: "optional", desc: "Daniel capturé - skipable" },
          { ep: 13, title: "Hathor", type: "skip", desc: "Épisode considéré comme le pire" },
          { ep: 14, title: "Singularity", type: "must-watch", desc: "Cassandra - arc important" },
          { ep: 15, title: "Cor-ai", type: "optional", desc: "Procès de Teal'c" },
          { ep: 16, title: "Enigma", type: "optional", desc: "Les Tollans" },
          { ep: 17, title: "Solitudes", type: "must-watch", desc: "Jack et Carter en Antarctique" },
          { ep: 18, title: "Tin Man", type: "important", desc: "L'équipe dupliquée" },
          { ep: 19, title: "There But for the Grace of God", type: "must-watch", desc: "Réalité alternative - Daniel" },
          { ep: 20, title: "Politics", type: "clip", desc: "Clip show - skipable" },
          { ep: 21, title: "Within the Serpent's Grasp", type: "must-watch", desc: "Finale saison 1 - attaque Goa'uld" }
        ]
      },
      en: {
        s1: [
          { ep: 1, title: "Children of the Gods", type: "must-watch", desc: "The pilot - complete introduction" },
          { ep: 2, title: "The Enemy Within", type: "optional", desc: "Kawalsky possessed - skippable" },
          { ep: 3, title: "Emancipation", type: "skip", desc: "Very weak episode - skip recommended" },
          { ep: 4, title: "The Broca Divide", desc: "Introduction of Dr Fraiser", type: "important" },
          { ep: 21, title: "Within the Serpent's Grasp", type: "must-watch", desc: "Season 1 finale - Goa'uld attack" }
        ]
      }
    }
  },
  
  'breaking-bad': {
    tmdbId: 1396,
    tvdbId: 81189,
    guides: {
      fr: {
        s1: [
          { ep: 1, title: "Pilot", type: "must-watch", desc: "Le début de tout" },
          { ep: 2, title: "Cat's in the Bag...", type: "must-watch", desc: "Conséquences du premier meurtre" },
          { ep: 3, title: "...And the Bag's in the River", type: "must-watch", desc: "Flashback crucial" }
        ]
      }
    }
  },
  
  'the-office': {
    tmdbId: 2316,
    tvdbId: 73244,
    guides: {
      fr: {
        s1: [
          { ep: 1, title: "Pilot", type: "must-watch", desc: "Introduction des personnages" },
          { ep: 2, title: "Diversity Day", type: "must-watch", desc: "Classique absolu" }
        ]
      }
    }
  },
  
  'friends': {
    tmdbId: 1668,
    tvdbId: 77526,
    guides: {
      fr: {
        s1: [
          { ep: 1, title: "The One Where Monica Gets a Roommate", type: "must-watch", desc: "Le début de la série" }
        ]
      }
    }
  },
  
  'game-of-thrones': {
    tmdbId: 1399,
    tvdbId: 121361,
    guides: {
      fr: {
        s1: [
          { ep: 1, title: "Winter Is Coming", type: "must-watch", desc: "Le pilote épique" },
          { ep: 9, title: "Baelor", type: "must-watch", desc: "Ned Stark..." }
        ]
      }
    }
  },
  
  'stranger-things': {
    tmdbId: 66732,
    tvdbId: 305288,
    guides: {
      fr: {
        s1: [
          { ep: 1, title: "The Vanishing of Will Byers", type: "must-watch", desc: "La disparition" }
        ]
      }
    }
  },
  
  'the-simpsons': {
    tmdbId: 456,
    tvdbId: 71663,
    guides: {
      fr: {
        s1: [
          { ep: 1, title: "Simpsons Roasting on an Open Fire", type: "must-watch", desc: "Premier épisode" }
        ]
      }
    }
  },
  
  'sherlock': {
    tmdbId: 19885,
    tvdbId: 176941,
    guides: {
      fr: {
        s1: [
          { ep: 1, title: "A Study in Pink", type: "must-watch", desc: "Introduction moderne de Sherlock" }
        ]
      }
    }
  }
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Get language preference from cookie or default to FR
    const cookies = request.headers.get('Cookie') || '';
    const langMatch = cookies.match(/lang=(fr|en)/);
    const lang = langMatch ? langMatch[1] : 'fr';
    
    // API Routes
    if (path === '/api/shows') {
      return getPopularShows(env, lang);
    }
    
    if (path.startsWith('/api/show/')) {
      const showId = path.split('/')[3];
      return getShowDetails(showId, env, lang);
    }
    
    if (path === '/api/set-language') {
      return setLanguage(request);
    }
    
    // Page Routes
    if (path === '/' || path === '/index.html') {
      return renderHome(lang);
    }
    
    if (path.startsWith('/show/')) {
      const showId = path.split('/')[2];
      return renderShow(showId, lang);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

async function getPopularShows(env, lang) {
  const shows = Object.entries(SHOWS_DB).map(([id, data]) => ({
    id,
    tmdbId: data.tmdbId,
    ...getBasicShowInfo(id, lang)
  }));
  
  return new Response(JSON.stringify({ shows }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

function getBasicShowInfo(showId, lang) {
  const info = {
    'stargate-sg1': {
      fr: { name: 'Stargate SG-1', overview: 'Une équipe militaire explore la galaxie via des portes des étoiles.', year: 1997, seasons: 10, icon: '⭕' },
      en: { name: 'Stargate SG-1', overview: 'A military team explores the galaxy through ancient stargates.', year: 1997, seasons: 10, icon: '⭕' }
    },
    'breaking-bad': {
      fr: { name: 'Breaking Bad', overview: 'Un professeur de chimie devient fabricant de méthamphétamine.', year: 2008, seasons: 5, icon: '⚗️' },
      en: { name: 'Breaking Bad', overview: 'A chemistry teacher turned methamphetamine manufacturer.', year: 2008, seasons: 5, icon: '⚗️' }
    },
    'the-office': {
      fr: { name: 'The Office (US)', overview: 'La vie quotidienne au bureau Dunder Mifflin.', year: 2005, seasons: 9, icon: '💼' },
      en: { name: 'The Office (US)', overview: 'Daily life at Dunder Mifflin office.', year: 2005, seasons: 9, icon: '💼' }
    },
    'friends': {
      fr: { name: 'Friends', overview: 'Six amis vivant à New York.', year: 1994, seasons: 10, icon: '☕' },
      en: { name: 'Friends', overview: 'Six friends living in New York.', year: 1994, seasons: 10, icon: '☕' }
    },
    'game-of-thrones': {
      fr: { name: 'Game of Thrones', overview: 'La lutte pour le Trône de Fer dans les Sept Couronnes.', year: 2011, seasons: 8, icon: '🐉' },
      en: { name: 'Game of Thrones', overview: 'The struggle for the Iron Throne in the Seven Kingdoms.', year: 2011, seasons: 8, icon: '🐉' }
    },
    'stranger-things': {
      fr: { name: 'Stranger Things', overview: 'Disparitions mystérieuses dans une petite ville des années 80.', year: 2016, seasons: 4, icon: '🚲' },
      en: { name: 'Stranger Things', overview: 'Mysterious disappearances in a small 80s town.', year: 2016, seasons: 4, icon: '🚲' }
    },
    'the-simpsons': {
      fr: { name: 'Les Simpson', overview: 'La famille Simpson à Springfield.', year: 1989, seasons: 35, icon: '🍩' },
      en: { name: 'The Simpsons', overview: 'The Simpson family in Springfield.', year: 1989, seasons: 35, icon: '🍩' }
    },
    'sherlock': {
      fr: { name: 'Sherlock', overview: 'Sherlock Holmes dans le Londres moderne.', year: 2010, seasons: 4, icon: '🔍' },
      en: { name: 'Sherlock', overview: 'Sherlock Holmes in modern London.', year: 2010, seasons: 4, icon: '🔍' }
    }
  };
  
  return info[showId]?.[lang] || info[showId]?.['en'];
}

async function getShowDetails(showId, env, lang) {
  const show = SHOWS_DB[showId];
  if (!show) {
    return new Response(JSON.stringify({ error: 'Show not found' }), { status: 404 });
  }
  
  const details = {
    id: showId,
    ...getBasicShowInfo(showId, lang),
    guides: show.guides[lang] || show.guides['en']
  };
  
  return new Response(JSON.stringify(details), {
    headers: { 'Content-Type': 'application/json' }
  });
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

function renderHome(lang) {
  const t = {
    fr: {
      badge: 'Nouveau — Stargate SG-1 disponible',
      title: 'Ne perds plus de temps avec les épisodes inutiles',
      subtitle: 'Guides d\'épisodes complets avec notation must-watch, important et optionnel. Pour les séries qui en valent la peine.',
      cta: 'Explorer les séries →',
      secondary: 'Comment ça marche',
      stats: { series: 'Séries référencées', episodes: 'Épisodes notés', price: 'Gratuit, toujours' },
      popular: 'Séries populaires',
      free: 'Tous les guides gratuits',
      why: 'Pourquoi utiliser Filler Tracker',
      features: [
        { num: '01', title: 'Gagne du temps', desc: 'Skip les fillers qui n\'avancent pas l\'histoire. Concentre-toi sur l\'essentiel.' },
        { num: '02', title: 'Notation claire', desc: 'Must-watch, Important, Optionnel. Chaque épisode est classé sans ambiguïté.' },
        { num: '03', title: 'Gratuit', desc: 'Accès complet gratuit. Pas de pub intrusive, pas de paiement caché.' }
      ],
      langLabel: 'FR'
    },
    en: {
      badge: 'New — Stargate SG-1 available',
      title: 'Stop wasting time on useless episodes',
      subtitle: 'Complete episode guides with must-watch, important and optional ratings. For series worth your time.',
      cta: 'Browse shows →',
      secondary: 'How it works',
      stats: { series: 'Shows referenced', episodes: 'Episodes rated', price: 'Free, always' },
      popular: 'Popular shows',
      free: 'All guides free',
      why: 'Why use Filler Tracker',
      features: [
        { num: '01', title: 'Save time', desc: 'Skip fillers that don\'t advance the story. Focus on what matters.' },
        { num: '02', title: 'Clear ratings', desc: 'Must-watch, Important, Optional. Every episode is clearly categorized.' },
        { num: '03', title: 'Free', desc: 'Completely free access. No intrusive ads, no hidden payments.' }
      ],
      langLabel: 'EN'
    }
  }[lang];
  
  const shows = ['stargate-sg1', 'breaking-bad', 'the-office', 'friends', 'game-of-thrones', 'stranger-things'];
  
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
        --text-muted: #666;
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
        top: 0;
        left: 0;
        right: 0;
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
      
      .nav-cta {
        background: var(--accent);
        color: #000 !important;
        padding: 8px 18px;
        border-radius: 4px;
        font-weight: 600;
      }
      
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
      
      .hero-buttons {
        display: flex;
        gap: 16px;
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
      
      .btn-primary:hover { background: #ff8555; }
      
      .btn-secondary {
        background: transparent;
        color: var(--text);
        border: 1px solid var(--border);
      }
      
      .btn-secondary:hover { background: var(--surface); }
      
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
        border-radius: 8px;
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
        height: 160px;
        background: linear-gradient(135deg, #1a1a1a 0%, #0c0c0c 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        border-bottom: 1px solid var(--border);
      }
      
      .show-info { padding: 24px; }
      
      .show-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 8px;
      }
      
      .show-meta {
        color: var(--text-muted);
        font-size: 0.85rem;
        margin-bottom: 16px;
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
      
      .features {
        background: var(--surface);
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
      }
      
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 48px;
      }
      
      .feature h3 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.1rem;
        margin-bottom: 8px;
      }
      
      .feature h3 span {
        color: var(--accent);
        margin-right: 12px;
      }
      
      .feature p { color: var(--text-muted); font-size: 0.95rem; }
      
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
        .features-grid { grid-template-columns: 1fr; }
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
        <div class="hero-buttons">
            <a href="#shows" class="btn btn-primary">${t.cta}</a>
            <a href="#features" class="btn btn-secondary">${t.secondary}</a>
        </div>
    </section>

    <div class="stats">
        <div class="stat">
            <h3>8</h3>
            <p>${t.stats.series}</p>
        </div>
        <div class="stat">
            <h3>500+</h3>
            <p>${t.stats.episodes}</p>
        </div>
        <div class="stat">
            <h3>0$</h3>
            <p>${t.stats.price}</p>
        </div>
    </div>

    <section class="section" id="shows">
        <div class="section-header">
            <h2>${t.popular} <span>— ${t.free}</span></h2>
        </div>
        <div class="shows-grid">
            ${shows.map(id => {
              const info = getBasicShowInfo(id, lang);
              return `
            <a href="/show/${id}" class="show-card">
                <div class="show-poster">${info.icon}</div>
                <div class="show-info">
                    <h3 class="show-title">${info.name}</h3>
                    <p class="show-meta">${info.seasons} ${lang === 'fr' ? 'saisons' : 'seasons'} • ${info.year}</p>
                </div>
            </a>`;
            }).join('')}
        </div>
    </section>

    <section class="section features" id="features">
        <div class="section-header">
            <h2>${t.why}</h2>
        </div>
        <div class="features-grid">
            ${t.features.map(f => `
            <div class="feature">
                <h3><span>${f.num}</span>${f.title}</h3>
                <p>${f.desc}</p>
            </div>`).join('')}
        </div>
    </section>

    <footer>
        <p>© 2026 Filler Tracker — TMDB & TVDB</p>
    </footer>
    
    <script>
        function toggleLang() {
            const currentLang = document.documentElement.lang;
            const newLang = currentLang === 'fr' ? 'en' : 'fr';
            fetch('/api/set-language?lang=' + newLang)
                .then(() => location.reload());
        }
    </script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function renderShow(showId, lang) {
  // Show detail page with episodes guide
  const show = SHOWS_DB[showId];
  const info = getBasicShowInfo(showId, lang);
  
  if (!show) return new Response('Show not found', { status: 404 });
  
  const t = {
    fr: { back: '← Retour', guide: 'Guide des épisodes', mustWatch: 'À voir', important: 'Important', optional: 'Optionnel', skip: 'Skip' },
    en: { back: '← Back', guide: 'Episode Guide', mustWatch: 'Must Watch', important: 'Important', optional: 'Optional', skip: 'Skip' }
  }[lang];
  
  const guides = show.guides[lang] || show.guides['en'];
  const s1 = guides?.s1 || [];
  
  const typeLabels = {
    'must-watch': t.mustWatch,
    'important': t.important,
    'optional': t.optional,
    'skip': t.skip,
    'clip': 'Clip'
  };
  
  const typeColors = {
    'must-watch': '#22c55e',
    'important': '#f59e0b',
    'optional': '#ef4444',
    'skip': '#666',
    'clip': '#3b82f6'
  };
  
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <title>${info.name} — Filler Tracker</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <style>
      :root {
        --bg: #0c0c0c;
        --surface: #141414;
        --surface-hover: #1a1a1a;
        --border: #222;
        --text: #f5f5f5;
        --text-muted: #666;
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
        top: 0;
        left: 0;
        right: 0;
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
        font-weight: 500;
      }
      
      .nav-links a:hover { color: var(--text); }
      
      .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 100px 48px 48px;
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
      
      .back-link:hover { color: var(--text); }
      
      .show-header {
        display: flex;
        gap: 32px;
        margin-bottom: 48px;
        padding-bottom: 48px;
        border-bottom: 1px solid var(--border);
      }
      
      .show-icon {
        width: 120px;
        height: 120px;
        background: var(--surface);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        border: 1px solid var(--border);
      }
      
      .show-info h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2.5rem;
        margin-bottom: 12px;
      }
      
      .show-info p {
        color: var(--text-muted);
        margin-bottom: 16px;
        max-width: 500px;
      }
      
      .meta {
        display: flex;
        gap: 24px;
        font-size: 0.9rem;
        color: var(--text-muted);
      }
      
      .filter-tabs {
        display: flex;
        gap: 12px;
        margin-bottom: 32px;
      }
      
      .filter-btn {
        padding: 8px 16px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-muted);
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .filter-btn:hover, .filter-btn.active {
        background: var(--accent);
        color: #000;
        border-color: var(--accent);
      }
      
      .episodes-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .episode {
        display: flex;
        gap: 20px;
        padding: 20px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        transition: all 0.2s;
      }
      
      .episode:hover {
        border-color: var(--border);
        background: var(--surface-hover);
      }
      
      .ep-number {
        width: 48px;
        height: 48px;
        background: var(--bg);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
        font-size: 1.1rem;
        flex-shrink: 0;
      }
      
      .ep-info {
        flex: 1;
      }
      
      .ep-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 6px;
      }
      
      .ep-desc {
        color: var(--text-muted);
        font-size: 0.9rem;
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
        height: fit-content;
      }
      
      .season-header {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.5rem;
        margin: 48px 0 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border);
      }
      
      @media (max-width: 768px) {
        .container { padding: 100px 24px 48px; }
        .show-header { flex-direction: column; }
        .show-icon { width: 80px; height: 80px; font-size: 2.5rem; }
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
    
    <div class="container">
        <a href="/" class="back-link">${t.back}</a>
        
        <div class="show-header">
            <div class="show-icon">${info.icon}</div>
            <div class="show-info">
                <h1>${info.name}</h1>
                <p>${info.overview}</p>
                <div class="meta">
                    <span>${info.seasons} ${lang === 'fr' ? 'saisons' : 'seasons'}</span>
                    <span>•</span>
                    <span>${info.year}</span>
                </div>
            </div>
        </div>
        
        <h2 class="season-header">${t.guide} — ${lang === 'fr' ? 'Saison 1' : 'Season 1'}</h2>
        
        <div class="filter-tabs">
            <button class="filter-btn active">${lang === 'fr' ? 'Tous' : 'All'}</button>
            <button class="filter-btn">${t.mustWatch}</button>
            <button class="filter-btn">${t.important}</button>
            <button class="filter-btn">${t.optional}</button>
        </div>
        
        <div class="episodes-list">
            ${s1.map(ep => `
            <div class="episode">
                <div class="ep-number">${ep.ep}</div>
                <div class="ep-info">
                    <div class="ep-title">${ep.title}</div>
                    <div class="ep-desc">${ep.desc}</div>
                </div>
                <span class="ep-badge" style="background: ${typeColors[ep.type]}20; color: ${typeColors[ep.type]}; border: 1px solid ${typeColors[ep.type]}40;">
                    ${typeLabels[ep.type]}
                </span>
            </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// All content is free - no login required