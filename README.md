# Neo4Flix

Neo4Flix est une application de gestion et de recommandation de films, construite avec une architecture microservices. Elle combine un backend Java (Spring Boot) et un frontend Angular pour offrir une expérience utilisateur moderne et évolutive.

## Structure du projet

- **backend/** : Contient tous les microservices Java (Spring Boot)
  - **api-gateway/** : Passerelle API pour orchestrer les appels entre les microservices
  - **movie-service/** : Gestion des films et intégration avec TMDB
  - **rating-service/** : Gestion des notes et avis des utilisateurs
  - **recommendation-service/** : Système de recommandation personnalisé
  - **user-service/** : Gestion des utilisateurs et authentification
  - **docker-compose.yml** : Orchestration des services via Docker
  - **README.md, copilot.md, etc.** : Documentation et scripts de test

- **frontend/** : Application Angular pour l'interface utilisateur
  - **src/** : Code source principal (pages, composants, services)
  - **public/** : Assets statiques
  - **template/** : Modèles HTML pour différentes pages
  - **README.md, DEPLOYMENT_GUIDE.md, etc.** : Documentation et guides

## Prérequis

- Java 17+
- Node.js 18+
- Angular CLI
- Docker & Docker Compose

## Installation

### Backend
```bash
cd backend
# Démarrer tous les services avec Docker Compose
sudo docker-compose up --build
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

## Fonctionnalités principales
- Authentification et gestion des utilisateurs
- Recherche et affichage de films
- Notation et avis
- Recommandations personnalisées
- Architecture microservices scalable

## API Documentation
- Voir le fichier `FRONTEND_API_DOCUMENTATION.md` dans chaque dossier pour les endpoints disponibles.

## Tests
- Des fichiers `.http` sont fournis pour tester les APIs avec VS Code ou Postman.

## Contribution
Les contributions sont les bienvenues !
1. Forkez le projet
2. Créez une branche (`feature/ma-feature`)
3. Commitez vos modifications
4. Ouvrez une Pull Request

---
Pour toute question, contactez l'équipe via les issues GitHub ou consultez la documentation dans chaque dossier.
