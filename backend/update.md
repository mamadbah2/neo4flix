# 🔄 Neo4flix API - Mise à jour du 08/01/2026

## Résumé des changements

Cette mise à jour corrige un bug et ajoute deux nouveaux endpoints.

---

## 🐛 Correction de bug

### Endpoint `/api/movies/{tmdbId}/reviews` (Erreur 500 corrigée)

**Problème :** L'endpoint retournait une erreur 500 à cause d'un problème de mapping Spring Data Neo4j avec les projections d'interface.

**Solution :** Changement du type de retour de la requête Cypher de `LocalReviewProjection` vers `Map<String, Object>` pour éviter les problèmes de mapping.

**Impact :** Aucun changement côté frontend, l'endpoint fonctionne maintenant correctement.

---

## ✨ Nouveaux endpoints

### 1. Ratings d'un film (Rating Service)

Récupère les notes des utilisateurs pour un film donné avec pagination.

#### Endpoint

```
GET /api/rates/movie/{tmdbId}
```

#### Paramètres

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `tmdbId` | number (path) | - | ID TMDb du film |
| `page` | number | 1 | Numéro de page (1-indexed) |
| `size` | number | 10 | Nombre d'éléments par page |

#### Auth

❌ Non requise (endpoint public)

#### Exemple de requête

```http
GET http://localhost:5050/api/rates/movie/27205?page=1&size=10
```

#### Réponse (200 OK)

```json
{
  "tmdbId": 27205,
  "page": 1,
  "totalPages": 3,
  "totalResults": 25,
  "averageScore": 8.4,
  "ratings": [
    {
      "score": 9,
      "comment": "Un chef-d'œuvre absolu de Christopher Nolan !",
      "createdAt": "2026-01-08T15:30:00.000Z"
    },
    {
      "score": 8,
      "comment": null,
      "createdAt": "2026-01-07T10:15:00.000Z"
    }
  ]
}
```

#### Interface TypeScript

```typescript
export interface MovieRatingResponse {
  score: number;
  comment: string | null;
  createdAt: string;
}

export interface MovieRatingsPageResponse {
  tmdbId: number;
  page: number;
  totalPages: number;
  totalResults: number;
  averageScore: number | null;
  ratings: MovieRatingResponse[];
}
```

---

### 2. Découverte d'utilisateurs (User Service)

Récupère les utilisateurs que l'utilisateur connecté ne suit pas encore. Tri aléatoire pour favoriser la découverte.

#### Endpoint

```
GET /api/users/discover
```

#### Paramètres

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `page` | number | 1 | Numéro de page (1-indexed) |
| `size` | number | 10 | Nombre d'éléments par page |

#### Auth

✅ Requise (Bearer Token)

#### Exemple de requête

```http
GET http://localhost:5050/api/users/discover?page=1&size=10
Authorization: Bearer <access_token>
```

#### Réponse (200 OK)

```json
{
  "page": 1,
  "totalPages": 5,
  "totalResults": 47,
  "users": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "username": "cinephile_42",
      "followersCount": 156,
      "ratingsCount": 87,
      "watchlistCount": 23
    },
    {
      "id": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
      "username": "movie_lover",
      "followersCount": 42,
      "ratingsCount": 124,
      "watchlistCount": 15
    }
  ]
}
```

#### Notes

- Les utilisateurs sont triés **aléatoirement** pour favoriser la découverte
- L'utilisateur connecté n'apparaît **jamais** dans les résultats
- Les utilisateurs déjà suivis n'apparaissent **pas** dans les résultats
- Les statistiques incluent : nombre de followers, notes données, films en watchlist

#### Interface TypeScript

```typescript
export interface UserSuggestionResponse {
  id: string;
  username: string;
  followersCount: number;
  ratingsCount: number;
  watchlistCount: number;
}

export interface UserSuggestionsPageResponse {
  page: number;
  totalPages: number;
  totalResults: number;
  users: UserSuggestionResponse[];
}
```

---

## 📋 Tableau récapitulatif des nouveaux endpoints

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/rates/movie/{tmdbId}` | GET | ❌ | Ratings d'un film avec pagination |
| `/api/users/discover` | GET | ✅ | Utilisateurs suggérés à suivre |

---

## 🔧 Exemple d'implémentation Angular

### Rating Service

```typescript
// services/rating.service.ts
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MovieRatingsPageResponse } from '../interfaces/rating.interface';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private api: ApiService) {}

  // Endpoint existant
  rateMovie(tmdbId: number, score: number, comment?: string): Observable<RateResponse> {
    const body = { tmdbId, score, comment };
    return this.api.postAuth<RateResponse>('/api/rates/', body);
  }

  // Nouveau endpoint
  getMovieRatings(tmdbId: number, page = 1, size = 10): Observable<MovieRatingsPageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.api.get<MovieRatingsPageResponse>(`/api/rates/movie/${tmdbId}`, params);
  }
}
```

### User Service (découverte)

```typescript
// services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserSuggestionsPageResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) {}

  // ... autres méthodes existantes ...

  // Nouveau endpoint
  discoverUsers(page = 1, size = 10): Observable<UserSuggestionsPageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.api.getAuth<UserSuggestionsPageResponse>('/api/users/discover', params);
  }
}
```

---

## 📝 Fichiers modifiés

### Movie Service
- `MovieRepository.java` - Changement du type de retour pour `getLocalReviews()`
- `MovieServiceImpl.java` - Adaptation pour utiliser `Map<String, Object>`

### Rating Service
- `RateRepository.java` - Ajout de `findRatingsByMovie()`, `countRatingsByMovie()`, `getAverageScoreByMovie()`
- `RateService.java` - Ajout de `getMovieRatings()`
- `RateServiceImpl.java` - Implémentation de `getMovieRatings()`
- `RateController.java` - Ajout de l'endpoint GET `/movie/{tmdbId}`
- `RateControllerImpl.java` - Implémentation de l'endpoint
- `SecurityConfig.java` - Ajout du `@Bean` manquant + autorisation GET public
- **Nouveaux fichiers :**
  - `MovieRatingResponse.java`
  - `MovieRatingsPageResponse.java`

### User Service
- `SocialRepository.java` - Ajout de `findUsersNotFollowed()`, `countUsersNotFollowed()`
- `SocialService.java` - Ajout de `getSuggestedUsers()`
- `SocialServiceImpl.java` - Implémentation de `getSuggestedUsers()`
- `SocialController.java` - Ajout de l'endpoint GET `/discover`
- `SocialControllerImpl.java` - Implémentation de l'endpoint
- **Nouveaux fichiers :**
  - `UserSuggestionResponse.java`
  - `UserSuggestionsPageResponse.java`

---

## 🧪 Tests HTTP

Les nouveaux endpoints peuvent être testés via le fichier `test-social.http` :

```http
###############################################################################
# ÉTAPE 11 : RATINGS D'UN FILM (NOUVEAU)
###############################################################################

### 11.1 Récupérer les ratings d'un film (paginé) - Endpoint public
GET {{baseUrl}}/api/rates/movie/27205?page=1&size=10

### 11.2 Récupérer les ratings avec pagination page 2
GET {{baseUrl}}/api/rates/movie/27205?page=2&size=5

###############################################################################
# ÉTAPE 12 : DÉCOUVERTE D'UTILISATEURS (NOUVEAU)
###############################################################################

### 12.1 Découvrir des utilisateurs à suivre (paginé, tri aléatoire)
GET {{baseUrl}}/api/users/discover?page=1&size=10
Authorization: Bearer {{tokenUserA}}

### 12.2 Découvrir des utilisateurs - Page 2
GET {{baseUrl}}/api/users/discover?page=2&size=5
Authorization: Bearer {{tokenUserB}}
```

---

## 🚀 Déploiement

Après avoir récupéré les changements, reconstruisez et redéployez les services :

```bash
# Rebuild et redeploy movie-service
cd movie-service
./mvnw clean package -DskipTests
docker-compose up -d --build movie-service

# Rebuild et redeploy rating-service
cd rating-service
./mvnw clean package -DskipTests
docker-compose up -d --build rating-service

# Rebuild et redeploy user-service
cd user-service
./mvnw clean package -DskipTests
docker-compose up -d --build user-service
```

Ou tout reconstruire :

```bash
docker-compose up -d --build
```
