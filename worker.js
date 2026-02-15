export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        if (path === '/' || path === '/index.html') {
            return serveHomePage();
        }
        
        if (path.startsWith('/show/')) {
            return serveShowPage(path.split('/')[2]);
        }
        
        if (path === '/login') return serveLoginPage();
        if (path === '/register') return serveRegisterPage();
        
        return new Response('Not Found', { status: 404 });
    }
};

function serveHomePage() {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Filler Tracker - Guide d'épisodes</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0c0c0c;
            --surface: #141414;
            --surface-hover: #1a1a1a;
            --border: #222;
            --text: #f5f5f5;
            --text-muted: #666;
            --accent: #ff6b35;
            --accent-2: #00d4aa;
            --danger: #ef4444;
            --warning: #f59e0b;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
        }
        
        /* Navigation minimaliste */
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
            letter-spacing: -0.5px;
        }
        
        .logo span { color: var(--accent); }
        
        .nav-links {
            display: flex;
            gap: 40px;
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
            padding: 8px 20px;
            border-radius: 4px;
            font-weight: 600;
        }
        
        /* Hero section sans gradient */
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
            font-size: 4.5rem;
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
        
        .btn-primary:hover {
            background: #ff8555;
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--text);
            border: 1px solid var(--border);
        }
        
        .btn-secondary:hover {
            background: var(--surface);
        }
        
        /* Stats ligne fine */
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
        
        .stat p {
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        
        /* Shows grid */
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
        
        .section h2 span {
            color: var(--text-muted);
            font-weight: 400;
        }
        
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
        
        .show-info {
            padding: 24px;
        }
        
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
        
        /* Features */
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
        
        .feature p {
            color: var(--text-muted);
            font-size: 0.95rem;
        }
        
        /* Footer minimal */
        footer {
            padding: 48px;
            text-align: center;
            color: var(--text-muted);
            font-size: 0.85rem;
            border-top: 1px solid var(--border);
        }
        
        footer a {
            color: var(--text);
            text-decoration: none;
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
            <a href="/">Accueil</a>
            <a href="#shows">Séries</a>
            <a href="/login" class="nav-cta">Connexion</a>
        </div>
    </nav>

    <section class="hero">
        <div class="badge">Nouveau — Stargate SG-1 disponible</div>
        <h1>Ne perds plus de temps avec les épisodes inutiles</h1>
        <p>Guides d'épisodes complets avec notation must-watch, important et optionnel. Pour les séries qui en valent la peine.</p>
        <div class="hero-buttons">
            <a href="#shows" class="btn btn-primary">Explorer les séries →</a>
            <a href="#features" class="btn btn-secondary">Comment ça marche</a>
        </div>
    </section>

    <div class="stats">
        <div class="stat">
            <h3>50+</h3>
            <p>Séries référencées</p>
        </div>
        <div class="stat">
            <h3>10k+</h3>
            <p>Épisodes notés</p>
        </div>
        <div class="stat">
            <h3>0€</h3>
            <p>Gratuit, toujours</p>
        </div>
    </div>

    <section class="section" id="shows">
        <div class="section-header">
            <h2>Séries populaires <span>— 3 épisodes gratuits, puis connexion requise</span></h2>
        </div>
        <div class="shows-grid">
            <a href="/show/stargate-sg1" class="show-card">
                <div class="show-poster">⭕</div>
                <div class="show-info">
                    <h3 class="show-title">Stargate SG-1</h3>
                    <p class="show-meta">10 saisons • 214 épisodes</p>
                    <span class="tag">Sci-Fi</span>
                </div>
            </a>
            
            <a href="/show/stargate-atlantis" class="show-card">
                <div class="show-poster">🌌</div>
                <div class="show-info">
                    <h3 class="show-title">Stargate Atlantis</h3>
                    <p class="show-meta">5 saisons • 100 épisodes</p>
                    <span class="tag">Aventure</span>
                </div>
            </a>
            
            <a href="/show/coming-soon" class="show-card" style="opacity: 0.5;">
                <div class="show-poster" style="font-size: 2rem;">+</div>
                <div class="show-info">
                    <h3 class="show-title">Plus à venir</h3>
                    <p class="show-meta">Bientôt disponible</p>
                    <span class="tag">Prochainement</span>
                </div>
            </a>
        </div>
    </section>

    <section class="section features" id="features">
        <div class="section-header">
            <h2>Pourquoi utiliser Filler Tracker</h2>
        </div>
        <div class="features-grid">
            <div class="feature">
                <h3><span>01</span>Gagne du temps</h3>
                <p>Skip les fillers qui n'avancent pas l'histoire. Concentre-toi sur l'essentiel.</p>
            </div>
            <div class="feature">
                <h3><span>02</span>Notation claire</h3>
                <p>Must-watch, Important, Optionnel. Chaque épisode est classé sans ambiguïté.</p>
            </div>
            <div class="feature">
                <h3><span>03</span>Gratuit</h3>
                <p>Accès complet gratuit. Pas de pub intrusive, pas de paiement caché.</p>
            </div>
        </div>
    </section>

    <footer>
        <p>© 2026 <a href="/">Filler Tracker</a> — Données TMDB & TVDB</p>
    </footer>
</body>
</html>`;

    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function serveShowPage(showId) {
    return serveHomePage();
}

function serveLoginPage() {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion — Filler Tracker</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0c0c0c;
            --surface: #141414;
            --border: #222;
            --text: #f5f5f5;
            --text-muted: #666;
            --accent: #ff6b35;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .auth-box {
            width: 100%;
            max-width: 400px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 48px;
        }
        
        .logo {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 8px;
            color: var(--text);
            text-decoration: none;
            display: block;
        }
        
        .logo span { color: var(--accent); }
        
        .subtitle {
            text-align: center;
            color: var(--text-muted);
            margin-bottom: 32px;
            font-size: 0.9rem;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        input {
            width: 100%;
            padding: 12px 16px;
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 6px;
            color: var(--text);
            font-size: 1rem;
            transition: border-color 0.2s;
        }
        
        input:focus {
            outline: none;
            border-color: var(--accent);
        }
        
        .btn {
            width: 100%;
            padding: 14px;
            background: var(--accent);
            color: #000;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 8px;
        }
        
        .divider {
            text-align: center;
            margin: 24px 0;
            color: var(--text-muted);
            font-size: 0.85rem;
            position: relative;
        }
        
        .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: var(--border);
        }
        
        .divider span {
            background: var(--surface);
            padding: 0 16px;
            position: relative;
        }
        
        .link {
            text-align: center;
            margin-top: 24px;
            font-size: 0.9rem;
            color: var(--text-muted);
        }
        
        .link a {
            color: var(--text);
            text-decoration: none;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="auth-box">
        <a href="/" class="logo">Filler<span>.</span></a>
        <p class="subtitle">Accède à tous les guides d'épisodes</p>
        
        <form>
            <div class="form-group">
                <label>Email</label>
                <input type="email" placeholder="ton@email.com">
            </div>
            <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" placeholder="••••••••">
            </div>
            <button type="submit" class="btn">Se connecter</button>
        </form>
        
        <div class="divider"><span>ou</span></div>
        
        <p class="link">Pas encore de compte ? <a href="/register">S'inscrire</a></p>
    </div>
</body>
</html>`;

    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function serveRegisterPage() {
    return serveLoginPage();
}