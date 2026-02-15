import { Router } from './router.js';

// JWT Secret (change this in production!)
const JWT_SECRET = 'your-secret-key-change-this';

// TMDB API Configuration
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // User needs to add this
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export default {
    async fetch(request, env, ctx) {
        const router = new Router(request, env);
        
        // API Routes
        router.get('/api/shows/:id', getShowDetails);
        router.get('/api/shows/:id/episodes', getEpisodes);
        router.post('/api/auth/login', handleLogin);
        router.post('/api/auth/register', handleRegister);
        
        // Page Routes
        router.get('/', renderHome);
        router.get('/show/:id', renderShow);
        router.get('/login', renderLogin);
        router.get('/register', renderRegister);
        
        return router.handle();
    }
};

// Mock data for Stargate until TMDB API is configured
const STARGATE_DATA = {
    id: 4629,
    name: "Stargate SG-1",
    overview: "Une équipe militaire explore la galaxie via des portes des étoiles.",
    poster_path: "/stargate.jpg",
    seasons: [
        { season_number: 1, episode_count: 21 },
        { season_number: 2, episode_count: 22 },
        { season_number: 3, episode_count: 22 },
        { season_number: 4, episode_count: 22 },
        { season_number: 5, episode_count: 22 },
        { season_number: 6, episode_count: 22 },
        { season_number: 7, episode_count: 22 },
        { season_number: 8, episode_count: 20 },
        { season_number: 9, episode_count: 20 },
        { season_number: 10, episode_count: 20 }
    ]
};

async function renderHome(request, env) {
    const html = generateHTML('Filler Tracker - Accueil', `
        <div class="hero">
            <h1>🎬 Filler Tracker</h1>
            <p>Ne perds plus de temps avec les épisodes inutiles. Découvre lesquels regarder et lesquels sauter.</p>
            <a href="/show/4629" class="btn btn-primary">Découvrir Stargate SG-1</a>
        </div>
        
        <!-- Ad Banner Top -->
        <div class="ad-banner">
            <p>📢 Espace Publicitaire</p>
        </div>
        
        <div class="shows-grid">
            <a href="/show/4629" class="show-card">
                <div class="show-poster">⭕</div>
                <h3>Stargate SG-1</h3>
                <p>10 saisons • 214 épisodes</p>
                <span class="badge">Sci-Fi</span>
            </a>
        </div>
        
        <!-- Ad Banner Bottom -->
        <div class="ad-banner">
            <p>📢 Espace Publicitaire</p>
        </div>
    `, { env });
    
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

async function renderShow(request, env) {
    const url = new URL(request.url);
    const showId = url.pathname.split('/')[2];
    
    // Check authentication for viewing beyond 3 episodes
    const token = getCookie(request, 'auth_token');
    const isAuthenticated = token && await verifyJWT(token);
    
    const episodesViewed = parseInt(getCookie(request, 'episodes_viewed') || '0');
    const canViewMore = isAuthenticated || episodesViewed < 3;
    
    const html = generateHTML('Stargate SG-1 - Filler Tracker', `
        <div class="show-header">
            <div class="show-poster-large">⭕</div>
            <div class="show-info">
                <h1>Stargate SG-1</h1>
                <p class="overview">Une équipe militaire explore la galaxie via des portes des étoiles anciennes.</p>
                <div class="meta">
                    <span>📺 10 saisons</span>
                    <span>🎬 214 épisodes</span>
                    <span>⭐ 8.4/10</span>
                </div>
            </div>
        </div>
        
        <!-- Ad Banner -->
        <div class="ad-banner ad-large">
            <p>📢 Espace Publicitaire Premium</p>
        </div>
        
        ${!isAuthenticated && episodesViewed >= 3 ? `
        <div class="paywall">
            <div class="paywall-content">
                <h2>🔒 Contenu Premium</h2>
                <p>Vous avez consulté 3 épisodes gratuitement.</p>
                <p>Créez un compte gratuit pour accéder à tous les épisodes !</p>
                <div class="paywall-actions">
                    <a href="/register" class="btn btn-primary">Créer un compte</a>
                    <a href="/login" class="btn btn-secondary">Se connecter</a>
                </div>
                <p class="small">Pas de pub pour les membres ✨</p>
            </div>
        </div>
        ` : `
        <div class="episodes-container">
            <h2>📋 Guide des épisodes</h2>
            <div class="filter-tabs">
                <button class="tab active">Tous</button>
                <button class="tab">À voir</button>
                <button class="tab">Optionnels</button>
            </div>
            
            <div class="seasons-list">
                ${generateSeasonsHTML(canViewMore, isAuthenticated)}
            </div>
        </div>
        `}
        
        <!-- Sidebar Ad -->
        <div class="sidebar-ad">
            <p>📢 Pub</p>
        </div>
    `, { env, isAuthenticated });
    
    // Set cookie for episodes viewed
    const response = new Response(html, { 
        headers: { 'Content-Type': 'text/html' } 
    });
    
    if (!isAuthenticated) {
        response.headers.append('Set-Cookie', `episodes_viewed=${episodesViewed + 1}; Path=/; Max-Age=86400`);
    }
    
    return response;
}

function generateSeasonsHTML(canViewMore, isAuthenticated) {
    if (!canViewMore) return '';
    
    let html = '';
    for (let s = 1; s <= 2; s++) { // Only show 2 seasons for demo
        html += `
        <div class="season">
            <h3>Saison ${s}</h3>
            <div class="episodes-grid">
                ${generateEpisodesHTML(s)}
            </div>
        </div>
        `;
    }
    return html;
}

function generateEpisodesHTML(season) {
    const episodes = [
        { num: 1, title: "Children of the Gods", type: "must-watch", desc: "Le pilote" },
        { num: 2, title: "The Enemy Within", type: "optional", desc: "Filler" },
        { num: 3, title: "Emancipation", type: "optional", desc: "Skip" },
        { num: 4, title: "The Broca Divide", type: "important", desc: "Dr Fraiser" },
        { num: 5, title: "The First Commandment", type: "optional", desc: "Moyen" }
    ];
    
    return episodes.map(ep => `
        <div class="episode-card ${ep.type}">
            <div class="ep-number">${ep.num}</div>
            <div class="ep-info">
                <h4>${ep.title}</h4>
                <p>${ep.desc}</p>
                <span class="badge-${ep.type}">${ep.type === 'must-watch' ? 'À voir' : ep.type === 'important' ? 'Important' : 'Optionnel'}</span>
            </div>
        </div>
    `).join('');
}

async function renderLogin(request, env) {
    const html = generateHTML('Connexion - Filler Tracker', `
        <div class="auth-container">
            <h1>🔐 Connexion</h1>
            <form class="auth-form" onsubmit="return handleLogin(event)">
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Mot de passe" required />
                <button type="submit" class="btn btn-primary">Se connecter</button>
            </form>
            <p>Pas encore de compte ? <a href="/register">S'inscrire</a></p>
        </div>
    `, { env });
    
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

async function renderRegister(request, env) {
    const html = generateHTML('Inscription - Filler Tracker', `
        <div class="auth-container">
            <h1>📝 Inscription</h1>
            <p class="subtitle">Accès illimité à tous les guides d'épisodes !</p>
            <form class="auth-form" onsubmit="return handleRegister(event)">
                <input type="text" name="username" placeholder="Nom d'utilisateur" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Mot de passe" required />
                <button type="submit" class="btn btn-primary">Créer mon compte</button>
            </form>
            <p>Déjà un compte ? <a href="/login">Se connecter</a></p>
            
            <div class="benefits">
                <h3>✨ Avantages membre :</h3>
                <ul>
                    <li>Accès à tous les épisodes</li>
                    <li>Sans publicité</li>
                    <li>Synchronisation cross-device</li>
                    <li>Notifications nouveaux épisodes</li>
                </ul>
            </div>
        </div>
    `, { env });
    
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

// Helper functions
function generateHTML(title, content, { env, isAuthenticated = false }) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --bg-primary: #0f0f1a;
            --bg-secondary: #1a1a2e;
            --accent: #00d4ff;
            --success: #00ff88;
            --warning: #ffd700;
            --danger: #ff6b6b;
        }
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
            min-height: 100vh;
            color: #fff;
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        
        /* Header */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            margin-bottom: 30px;
        }
        .logo { font-size: 1.5rem; font-weight: 800; color: var(--accent); }
        nav { display: flex; gap: 20px; }
        nav a { color: #888; text-decoration: none; transition: color 0.3s; }
        nav a:hover { color: var(--accent); }
        
        /* Hero */
        .hero {
            text-align: center;
            padding: 60px 20px;
            background: linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(123,104,238,0.1) 100%);
            border-radius: 20px;
            margin-bottom: 40px;
        }
        .hero h1 { font-size: 3rem; margin-bottom: 20px; }
        .hero p { font-size: 1.2rem; color: #888; margin-bottom: 30px; }
        
        /* Buttons */
        .btn {
            display: inline-block;
            padding: 12px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
            cursor: pointer;
            border: none;
            font-size: 1rem;
        }
        .btn-primary {
            background: linear-gradient(135deg, var(--accent) 0%, #7b68ee 100%);
            color: white;
        }
        .btn-secondary {
            background: rgba(255,255,255,0.1);
            color: white;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,212,255,0.3); }
        
        /* Ads */
        .ad-banner {
            background: rgba(255,255,255,0.05);
            border: 2px dashed rgba(255,255,255,0.2);
            padding: 40px;
            text-align: center;
            border-radius: 10px;
            margin: 30px 0;
            color: #666;
        }
        .ad-large { padding: 60px; }
        .sidebar-ad {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 160px;
            height: 600px;
            background: rgba(255,255,255,0.05);
            border: 2px dashed rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
        }
        @media (max-width: 1400px) { .sidebar-ad { display: none; } }
        
        /* Show Cards */
        .shows-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .show-card {
            background: rgba(255,255,255,0.05);
            border-radius: 15px;
            padding: 20px;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .show-card:hover {
            transform: translateY(-5px);
            border-color: var(--accent);
        }
        .show-poster {
            font-size: 4rem;
            text-align: center;
            margin-bottom: 15px;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            background: rgba(0,212,255,0.2);
            border-radius: 20px;
            font-size: 0.8rem;
            margin-top: 10px;
        }
        
        /* Paywall */
        .paywall {
            background: linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(123,104,238,0.1) 100%);
            border: 2px solid var(--accent);
            border-radius: 20px;
            padding: 60px;
            text-align: center;
            margin: 40px 0;
        }
        .paywall h2 { font-size: 2rem; margin-bottom: 20px; }
        .paywall-actions { display: flex; gap: 15px; justify-content: center; margin: 30px 0; }
        .small { color: #888; font-size: 0.9rem; }
        
        /* Episodes */
        .episodes-container { margin: 40px 0; }
        .filter-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab {
            padding: 10px 20px;
            background: rgba(255,255,255,0.05);
            border: none;
            border-radius: 20px;
            color: #888;
            cursor: pointer;
            transition: all 0.3s;
        }
        .tab.active { background: var(--accent); color: white; }
        .season { margin-bottom: 30px; }
        .season h3 { margin-bottom: 15px; color: var(--accent); }
        .episodes-grid { display: grid; gap: 10px; }
        .episode-card {
            display: flex;
            gap: 15px;
            padding: 15px;
            background: rgba(255,255,255,0.03);
            border-radius: 10px;
            border-left: 4px solid transparent;
            transition: all 0.3s;
        }
        .episode-card:hover { background: rgba(255,255,255,0.08); }
        .episode-card.must-watch { border-left-color: var(--success); }
        .episode-card.important { border-left-color: var(--warning); }
        .episode-card.optional { border-left-color: var(--danger); opacity: 0.7; }
        .ep-number {
            width: 40px;
            height: 40px;
            background: rgba(0,212,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
        }
        .badge-must-watch { color: var(--success); font-size: 0.8rem; }
        .badge-important { color: var(--warning); font-size: 0.8rem; }
        .badge-optional { color: var(--danger); font-size: 0.8rem; }
        
        /* Auth */
        .auth-container {
            max-width: 400px;
            margin: 60px auto;
            padding: 40px;
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            text-align: center;
        }
        .auth-form { display: flex; flex-direction: column; gap: 15px; margin: 30px 0; }
        .auth-form input {
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 10px;
            color: white;
            font-size: 1rem;
        }
        .benefits { text-align: left; margin-top: 30px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); }
        .benefits ul { list-style: none; margin-top: 15px; }
        .benefits li { padding: 10px 0; color: #888; }
        .benefits li:before { content: "✓"; color: var(--success); margin-right: 10px; }
        
        /* Show Header */
        .show-header { display: flex; gap: 30px; margin-bottom: 40px; }
        .show-poster-large { font-size: 8rem; }
        .show-info h1 { font-size: 2.5rem; margin-bottom: 15px; }
        .overview { color: #888; margin-bottom: 20px; }
        .meta { display: flex; gap: 20px; color: #666; }
        @media (max-width: 768px) {
            .show-header { flex-direction: column; }
            .paywall-actions { flex-direction: column; }
            .hero h1 { font-size: 2rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <a href="/" class="logo">🎬 Filler Tracker</a>
            <nav>
                <a href="/">Accueil</a>
                <a href="/show/4629">Stargate</a>
                ${isAuthenticated ? '<a href="#">Mon Compte</a>' : '<a href="/login">Connexion</a>'}
            </nav>
        </header>
        
        ${content}
        
        <footer style="text-align: center; padding: 40px 0; color: #666; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 60px;">
            <p>© 2026 Filler Tracker - Propulsé par TMDB & TVDB</p>
        </footer>
    </div>
    
    <script>
        async function handleLogin(e) {
            e.preventDefault();
            // Implementation would go here
            alert('Login simulation - connecte l\'API backend');
        }
        async function handleRegister(e) {
            e.preventDefault();
            alert('Register simulation - connecte l\'API backend');
        }
    </script>
</body>
</html>`;
}

function getCookie(request, name) {
    const cookies = request.headers.get('Cookie') || '';
    const match = cookies.match(new RegExp(name + '=([^;]+)'));
    return match ? match[1] : null;
}

async function verifyJWT(token) {
    // Simplified - in production use proper JWT verification
    return token && token.length > 10;
}

async function handleLogin(request, env) {
    return new Response('Login API endpoint', { status: 501 });
}

async function handleRegister(request, env) {
    return new Response('Register API endpoint', { status: 501 });
}

async function getShowDetails(request, env, params) {
    return new Response(JSON.stringify(STARGATE_DATA), {
        headers: { 'Content-Type': 'application/json' }
    });
}

async function getEpisodes(request, env, params) {
    return new Response(JSON.stringify({ episodes: [] }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
