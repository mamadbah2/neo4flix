# 🎬 Neo4flix Frontend

<div align="center">

![Angular](https://img.shields.io/badge/Angular-21.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Keycloak](https://img.shields.io/badge/Keycloak-OIDC-4B8BBE?style=for-the-badge&logo=keycloak&logoColor=white)
![Neo4j](https://img.shields.io/badge/Neo4j-Graph-008CC1?style=for-the-badge&logo=neo4j&logoColor=white)

**A social-driven movie recommendation engine with a cinematic experience** 🍿

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Integration](#-api-integration) • [Contributing](#-contributing)

</div>

---

## ✨ What is Neo4flix?

Neo4flix is a **Netflix-inspired** movie platform that combines the power of **graph databases** (Neo4j) with a modern Angular frontend. It's not just about watching movies—it's about **discovering them socially**.

> *"Because your friend's movie taste matters more than an algorithm."*

### 🎯 Key Highlights

- 🔥 **Cinematic Dark UI** - Pure black backgrounds with Netflix-red accents
- 🤝 **Social Features** - Follow friends, share movies, see what they're watching
- 🧠 **Smart Recommendations** - Powered by Neo4j graph relationships
- ⚡ **Blazing Fast** - Angular 21 Signals, lazy loading, SSR-ready
- 🔐 **Secure Auth** - Keycloak OIDC with 2-week session persistence

---

## 🚀 Features

### 🎬 Movie Discovery
- **Trending, Popular, Top Rated** - Always fresh content
- **Genre Exploration** - 19 genres from TMDb
- **Powerful Search** - Find any movie instantly
- **Coming Soon** - Never miss upcoming releases

### 👥 Social Network
- **Follow System** - Build your movie community
- **Friend Activity** - See what your friends are rating
- **Movie Sharing** - Recommend films to friends with personal messages
- **User Discovery** - Find new people with similar taste

### ⭐ Ratings & Reviews
- **Community Ratings** - Real ratings from Neo4flix users
- **Personal Watchlist** - Keep track of what you want to watch
- **Detailed Reviews** - Share your thoughts on movies

### 🎯 Smart Recommendations
- **Collaborative Filtering** - Based on users with similar taste
- **Genre-Based** - Personalized to your preferences
- **Graph-Powered** - Neo4j relationship traversal magic

---

## 🛠 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 11.x or higher
- **Backend services** running (API Gateway on port 5050)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/neo4flix.git
cd neo4flix/frontend

# Install dependencies
npm install

# Start development server
npm start
```

🎉 Open [http://localhost:4200](http://localhost:4200) and start exploring!

### Environment Setup

The app connects to the API Gateway at `http://localhost:5050`. Make sure these services are running:

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 5050 | Main entry point |
| User Service | 8081 | Authentication & social |
| Movie Service | 8082 | TMDb integration |
| Recommendation Service | 8083 | Graph recommendations |
| Rating Service | 8084 | Ratings & reviews |
| Keycloak | - | Identity provider |

---

## 🏗 Architecture

```
src/
├── app/
│   ├── core/              # 🔧 Singleton services, guards, interceptors
│   │   ├── guards/        # Route protection
│   │   ├── interceptors/  # HTTP token injection
│   │   ├── interfaces/    # TypeScript types
│   │   └── services/      # API services
│   ├── features/          # 📦 Lazy-loaded feature modules
│   │   ├── auth/          # Login, Register
│   │   ├── home/          # Main dashboard
│   │   ├── movies/        # Movie details
│   │   ├── social/        # Friend activity
│   │   └── watchlist/     # Personal watchlist
│   └── shared/            # 🧩 Reusable components
│       └── components/    # UI building blocks
├── environments/          # Config (dev/prod)
└── styles.css            # Global Tailwind styles
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Angular 21 (Standalone Components) |
| **State** | Angular Signals (reactive, no NgRx needed) |
| **Styling** | Tailwind CSS 4.1 (dark mode, mobile-first) |
| **Auth** | Keycloak OIDC (password grant + refresh tokens) |
| **HTTP** | Angular HttpClient with interceptors |
| **Testing** | Vitest |
| **SSR** | Angular SSR with hydration |

---

## 🔌 API Integration

### Services Overview

```typescript
// 🎬 Movie discovery & details
MovieService      → /api/movies/*

// ⭐ Ratings & reviews
RatingService     → /api/rates/*

// 🎯 Personalized recommendations
RecommendationService → /api/recommendations/*

// 👥 Social features
SocialService     → /api/users/*

// 📋 Watchlist management
WatchlistService  → /api/users/watchlist/*

// 🔐 Authentication
AuthService       → Keycloak OIDC endpoints
```

### Key Patterns

**Batch Enrichment** - Recommendations are enriched with full movie data:
```typescript
// Fetch recommendations → Get TMDb IDs → Batch enrich
getRecommendations().pipe(
  switchMap(recs => getMoviesBatch(recs.map(r => r.tmdbId)))
)
```

**User Sync on Login** - Every login syncs with backend:
```typescript
login(credentials).pipe(
  switchMap(() => syncUserWithBackend())  // POST /api/users/me
)
```

---

## 🧪 Development

### Commands

```bash
# Development server (hot reload)
npm start

# Run tests
npm test

# Production build
npm run build

# SSR development
npm run serve:ssr:frontend
```

### Code Style

- ✅ **Strict TypeScript** - No `any` types
- ✅ **Signals over Observables** - For component state
- ✅ **Standalone Components** - Modern Angular patterns
- ✅ **Tailwind only** - No inline styles
- ✅ **NgOptimizedImage** - For all TMDb posters

---

## 🎨 Design System

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Background | `#000000` | Pure black canvas |
| Primary | `#E50914` | Netflix red (CTAs, active states) |
| Accent | `#B20710` | Dark red (shadows, gradients) |
| Text | `#FFFFFF` | Primary text |
| Muted | `#808080` | Secondary text |

### UI Components

- **Hero Slider** - Full-width backdrop carousels
- **Movie Cards** - Hover-to-expand with quick actions
- **Movie Rows** - Horizontal scrolling lists
- **Skeleton Loaders** - Layout-matching placeholders
- **Toast Notifications** - Non-intrusive feedback
- **Slide-in Panels** - Modal alternatives

---

## 🤝 Contributing

We love contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Review Checklist

- [ ] TypeScript strict mode passes
- [ ] Tests are added/updated
- [ ] No console.log in production code
- [ ] Follows component structure guidelines
- [ ] Responsive design verified

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by the Neo4flix Team**

*Powered by Angular 21, Neo4j, and way too much ☕*

[![Star on GitHub](https://img.shields.io/github/stars/yourusername/neo4flix?style=social)](https://github.com/yourusername/neo4flix)

</div>

---

## 📚 Additional Resources

- [API Documentation](./FRONTEND_API_DOCUMENTATION.md) - Full backend API reference
- [Copilot Resume](./copilot_resume.md) - Project context for AI assistants
- [Template Files](./template/) - HTML design references

---

*Happy Movie Watching! 🎬🍿*
