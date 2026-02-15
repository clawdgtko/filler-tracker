# 🎬 Filler Tracker

Site web freemium pour tracker les épisodes "filler" des séries TV.

## 💡 Concept

- **Gratuit** : 3 épisodes consultables sans compte
- **Premium (gratuit)** : Compte utilisateur = accès illimité
- **Monétisation** : Publicités pour les non-connectés

## ✨ Fonctionnalités

- 🔍 Guide des épisodes (must-watch / important / optional)
- 🔐 Authentification utilisateur
- 📊 API TMDB/TVDB integration
- 💾 Historique de consultation
- 📱 Responsive design

## 🛠️ Tech Stack

- Cloudflare Workers
- D1 Database (users, tracking)
- KV Storage (sessions)
- TMDB API
- Vanilla JS

## 🚀 Déploiement

```bash
wrangler d1 create filler-tracker-db
wrangler d1 execute filler-tracker-db --command="CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, password_hash TEXT, created_at DATETIME);"
wrangler kv:namespace create SESSIONS
wrangler deploy
```

## 🔑 Configuration

Ajoute tes clés API dans l'interface Cloudflare :
- `TMDB_API_KEY`
