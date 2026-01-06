# 🎬 Neo4flix - Documentation API pour le Frontend Angular

## 📋 Table des Matières

1. [Configuration de Base](#configuration-de-base)
2. [Authentification Keycloak](#authentification-keycloak)
3. [Movie Service - API Films](#movie-service---api-films)
4. [User Service - API Utilisateurs](#user-service---api-utilisateurs)
5. [Rating Service - API Notes](#rating-service---api-notes)
6. [Recommendation Service - API Recommandations](#recommendation-service---api-recommandations)
7. [Interfaces TypeScript](#interfaces-typescript)
8. [Gestion des Erreurs](#gestion-des-erreurs)
9. [Exemples d'Implémentation Angular](#exemples-dimplémentation-angular)

---

## Configuration de Base

### URLs et Ports

| Service | URL Directe | Via API Gateway |
|---------|-------------|-----------------|
| API Gateway | - | `http://localhost:5050` |
| User Service | `http://localhost:8081` | `http://localhost:5050/api/users` |
| Movie Service | `http://localhost:8082` | `http://localhost:5050/api/movies` |
| Rating Service | `http://localhost:8084` | `http://localhost:5050/api/rates` |
| Recommendation Service | `http://localhost:8083` | `http://localhost:5050/api/recommendations` |
| Keycloak | `http://keycloak4flix.duckdns.org` | - |

### Base URL à utiliser dans Angular

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5050',
  keycloak: {
    url: 'http://keycloak4flix.duckdns.org',
    realm: 'neo4flix',
    clientId: 'neo4flix-app'
  }
};
```

### CORS ✅

**CORS est configuré** dans l'API Gateway pour `http://localhost:4200`. Toutes les requêtes passent par le gateway qui gère les headers CORS.

---

## Authentification Keycloak

### Configuration Keycloak pour Angular

| Paramètre | Valeur |
|-----------|--------|
| URL | `http://keycloak4flix.duckdns.org` |
| Realm | `neo4flix` |
| Client ID | `neo4flix-app` |
| Grant Type | `password` (dev) / `authorization_code` (prod) |

### Login - Obtenir un Token

```http
POST http://keycloak4flix.duckdns.org/realms/neo4flix/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded
```

**Request Body (form-urlencoded):**
```
grant_type=password
client_id=neo4flix-app
username=<username>
password=<password>
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "token_type": "Bearer",
  "not-before-policy": 0,
  "session_state": "abc123-def456",
  "scope": "openid email profile"
}
```

### Refresh Token

```http
POST http://keycloak4flix.duckdns.org/realms/neo4flix/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```
grant_type=refresh_token
client_id=neo4flix-app
refresh_token=<refresh_token>
```

### Comment utiliser le Token

Toutes les requêtes authentifiées doivent inclure le header:
```
Authorization: Bearer <access_token>
```

---

## Movie Service - API Films

### 1. Discovery - Films Tendances

**Endpoint:** `GET /api/movies/discovery/trending`

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `page` | number | 1 | Numéro de page |
| `language` | string | "fr-FR" | Langue des résultats |

**Auth:** ❌ Non requise

**Exemple:**
```http
GET http://localhost:5050/api/movies/discovery/trending?page=1&language=fr-FR
```

**Response (200 OK):**
```json
{
  "page": 1,
  "totalPages": 500,
  "totalResults": 10000,
  "results": [
    {
      "tmdbId": 27205,
      "title": "Inception",
      "originalTitle": "Inception",
      "overview": "Dom Cobb est un voleur expérimenté...",
      "posterPath": "/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdropPath": "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "releaseDate": "2010-07-16",
      "voteAverage": 8.369,
      "voteCount": 35234,
      "popularity": 142.567,
      "genres": ["Action", "Science-Fiction", "Aventure"],
      "runtime": null,
      "tagline": null,
      "syncedInNeo4j": false
    }
  ]
}
```

### 2. Discovery - Films les Mieux Notés

**Endpoint:** `GET /api/movies/discovery/top-rated`

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `page` | number | 1 | Numéro de page |
| `language` | string | "fr-FR" | Langue des résultats |

**Auth:** ❌ Non requise

### 3. Discovery - Films à l'Affiche

**Endpoint:** `GET /api/movies/discovery/now-playing`

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `page` | number | 1 | Numéro de page |
| `language` | string | "fr-FR" | Langue des résultats |

**Auth:** ❌ Non requise

### 4. Recherche de Films

**Endpoint:** `GET /api/movies/search`

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `query` | string | ✅ Oui | Terme de recherche |
| `page` | number | Non (défaut: 1) | Numéro de page |
| `language` | string | Non (défaut: "fr-FR") | Langue des résultats |

**Auth:** ❌ Non requise

**Exemple:**
```http
GET http://localhost:5050/api/movies/search?query=Matrix&language=fr-FR
```

**Response (200 OK):**
```json
{
  "page": 1,
  "totalPages": 2,
  "totalResults": 35,
  "results": [
    {
      "tmdbId": 603,
      "title": "Matrix",
      "originalTitle": "The Matrix",
      "overview": "Programmeur anonyme dans un service administratif...",
      "posterPath": "/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg",
      "backdropPath": "/l4QHerTSbMI7qgvasqxP36pqjN6.jpg",
      "releaseDate": "1999-03-30",
      "voteAverage": 8.2,
      "voteCount": 24521,
      "popularity": 89.234,
      "genres": ["Action", "Science-Fiction"],
      "runtime": null,
      "tagline": null,
      "syncedInNeo4j": false
    }
  ]
}
```

### 5. Détails d'un Film

**Endpoint:** `GET /api/movies/{tmdbId}`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `tmdbId` | number (path) | ID TMDb du film |
| `language` | string (query) | Langue (défaut: "fr-FR") |

**Auth:** ❌ Non requise

**Exemple:**
```http
GET http://localhost:5050/api/movies/27205?language=fr-FR
```

**Response (200 OK):**
```json
{
  "tmdbId": 27205,
  "title": "Inception",
  "originalTitle": "Inception",
  "overview": "Dom Cobb est un voleur expérimenté, le meilleur dans l'art dangereux de l'extraction...",
  "posterPath": "/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
  "backdropPath": "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
  "releaseDate": "2010-07-16",
  "voteAverage": 8.369,
  "voteCount": 35234,
  "popularity": 142.567,
  "genres": ["Action", "Science-Fiction", "Aventure"],
  "runtime": 148,
  "tagline": "Votre esprit est la scène du crime.",
  "syncedInNeo4j": true
}
```

**Response (404 Not Found):**
```json
{
  "timestamp": "2026-01-06T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Movie not found with TMDb ID: 999999999",
  "path": "/api/movies/999999999"
}
```

### 6. Synchroniser un Film (pour Watchlist/Rating)

**Endpoint:** `POST /api/movies/{tmdbId}/sync`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `tmdbId` | number (path) | ID TMDb du film |

**Auth:** ❌ Non requise

> ⚠️ **Note:** Cette synchronisation est généralement appelée automatiquement par le backend quand vous ajoutez un film à la watchlist ou quand vous le notez. Vous n'avez pas besoin de l'appeler manuellement dans la plupart des cas.

**Response (200 OK - Film déjà existant):**
```json
{
  "tmdbId": 27205,
  "title": "Inception",
  "created": false,
  "message": "Movie already exists in Neo4j"
}
```

**Response (201 Created - Nouveau film):**
```json
{
  "tmdbId": 27205,
  "title": "Inception",
  "created": true,
  "message": "Movie synchronized to Neo4j"
}
```

### 7. Recommandations Collaboratives

**Endpoint:** `GET /api/movies/recommendations/collaborative`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `language` | string (query) | Langue (défaut: "fr-FR") |

**Auth:** ✅ Requise (Bearer Token)

**Description:** Recommande des films basés sur les préférences d'utilisateurs similaires (ceux qui ont aimé les mêmes films que vous).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "page": 1,
  "totalPages": 1,
  "totalResults": 10,
  "results": [
    {
      "tmdbId": 155,
      "title": "The Dark Knight",
      "overview": "Batman entreprend de démanteler les dernières organisations criminelles...",
      "posterPath": "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      "backdropPath": "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
      "releaseDate": "2008-07-14",
      "voteAverage": 8.5,
      "voteCount": 31234,
      "popularity": 98.234,
      "genres": ["Action", "Crime", "Drame"],
      "runtime": null,
      "tagline": null,
      "syncedInNeo4j": true
    }
  ]
}
```

### 8. Recommandations par Genre

**Endpoint:** `GET /api/movies/recommendations/genre-based`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `language` | string (query) | Langue (défaut: "fr-FR") |

**Auth:** ✅ Requise (Bearer Token)

**Description:** Recommande des films basés sur vos genres préférés (déduits de vos films notés et watchlist).

---

## User Service - API Utilisateurs

### 1. Obtenir l'Utilisateur Connecté

**Endpoint:** `GET /api/users/me`

**Auth:** ✅ Requise (Bearer Token)

**Response (200 OK):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "username": "mamadbah",
  "email": "mamadbah@example.com"
}
```

### 2. Obtenir un Utilisateur par ID

**Endpoint:** `GET /api/users/{id}`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | string (path) | ID Keycloak de l'utilisateur |

**Auth:** ✅ Requise (Bearer Token)

**Response (200 OK):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "username": "john_doe",
  "email": "john@example.com"
}
```

### 3. Obtenir la Watchlist

**Endpoint:** `GET /api/users/watchlist`

**Auth:** ✅ Requise (Bearer Token)

**Response (200 OK):**
```json
[
  {
    "tmdbId": 27205,
    "title": "Inception",
    "posterPath": "/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg"
  },
  {
    "tmdbId": 155,
    "title": "The Dark Knight",
    "posterPath": "/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  }
]
```

### 4. Ajouter un Film à la Watchlist

**Endpoint:** `POST /api/users/watchlist/{tmdbId}`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `tmdbId` | number (path) | ID TMDb du film à ajouter |

**Auth:** ✅ Requise (Bearer Token)

**Response (200 OK):**
```json
{
  "tmdbId": 27205,
  "title": "Inception",
  "posterPath": "/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg"
}
```

> ⚠️ **Note:** Le backend synchronise automatiquement le film dans Neo4j si nécessaire.

### 5. Retirer un Film de la Watchlist

**Endpoint:** `DELETE /api/users/watchlist/{tmdbId}`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `tmdbId` | number (path) | ID TMDb du film à retirer |

**Auth:** ✅ Requise (Bearer Token)

**Response (204 No Content):** *(Pas de body)*

---

## Fonctionnalités Sociales

### 1. Suivre un Utilisateur

**Endpoint:** `POST /api/users/follow/{userId}`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `userId` | string (path) | ID Keycloak de l'utilisateur à suivre |

**Auth:** ✅ Requise (Bearer Token)

**Response (200 OK):**
```json
{
  "id": "target-user-id",
  "username": "john_doe",
  "email": "john@example.com"
}
```

### 2. Ne Plus Suivre un Utilisateur

**Endpoint:** `DELETE /api/users/follow/{userId}`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `userId` | string (path) | ID Keycloak de l'utilisateur |

**Auth:** ✅ Requise (Bearer Token)

**Response (204 No Content):** *(Pas de body)*

### 3. Liste des Utilisateurs Suivis (Following)

**Endpoint:** `GET /api/users/following`

**Auth:** ✅ Requise (Bearer Token)

**Response (200 OK):**
```json
[
  {
    "id": "user-id-1",
    "username": "john_doe",
    "email": "john@example.com"
  },
  {
    "id": "user-id-2",
    "username": "jane_doe",
    "email": "jane@example.com"
  }
]
```

### 4. Liste des Abonnés (Followers)

**Endpoint:** `GET /api/users/followers`

**Auth:** ✅ Requise (Bearer Token)

**Response (200 OK):**
```json
[
  {
    "id": "follower-id-1",
    "username": "fan_user",
    "email": "fan@example.com"
  }
]
```

### 5. Vérifier si on Suit un Utilisateur

**Endpoint:** `GET /api/users/following/{userId}`

| Paramètre | Type | Description |
|-----------|------|-------------|
| `userId` | string (path) | ID Keycloak de l'utilisateur |

**Auth:** ✅ Requise (Bearer Token)

**Response (200 OK):**
```json
{
  "following": true
}
```

---

## Rating Service - API Notes

### 1. Noter un Film

**Endpoint:** `POST /api/rates/`

**Auth:** ✅ Requise (Bearer Token)

**Request Body:**
```json
{
  "tmdbId": 27205,
  "score": 8
}
```

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `tmdbId` | number | Requis | ID TMDb du film |
| `score` | number | 1-10 | Note du film |

**Response (200 OK):**
```json
{
  "score": 8
}
```

> ⚠️ **Note:** Le backend synchronise automatiquement le film dans Neo4j si nécessaire avant d'enregistrer la note.

---

## Recommendation Service - API Recommandations

### 1. Obtenir mes Recommandations Personnalisées

**Endpoint:** `GET /api/recommendations/`

**Auth:** ✅ Requise (Bearer Token)

**Response (200 OK):**
```json
[
  {
    "tmdbId": 157336,
    "title": "Interstellar",
    "overview": "Dans un futur proche, la Terre est devenue hostile...",
    "posterPath": "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    "voteAverage": 8.4,
    "genres": ["Aventure", "Drame", "Science-Fiction"]
  }
]
```

### 2. Films Partagés par mes Amis

**Endpoint:** `GET /api/recommendations/shared`

**Auth:** ✅ Requise (Bearer Token)

**Response (200 OK):**
```json
[
  {
    "tmdbId": 550,
    "title": "Fight Club",
    "overview": "Le narrateur, sans identité précise, est employé...",
    "posterPath": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "voteAverage": 8.4,
    "genres": ["Drame"],
    "sharedBy": {
      "id": "friend-user-id",
      "username": "friend_name"
    },
    "sharedAt": "2026-01-05T15:30:00"
  }
]
```

### 3. Partager un Film avec un Ami

**Endpoint:** `POST /api/recommendations/share`

**Auth:** ✅ Requise (Bearer Token)

**Request Body:**
```json
{
  "targetUserId": "friend-keycloak-id",
  "tmdbId": 27205
}
```

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `targetUserId` | string | ✅ Oui | ID Keycloak du destinataire |
| `tmdbId` | number | ✅ Oui | ID TMDb du film à partager |

**Response (201 Created):**
```json
{
  "message": "Movie shared successfully",
  "tmdbId": 27205,
  "sharedWith": "friend-keycloak-id"
}
```

---

## Interfaces TypeScript

Voici les interfaces TypeScript prêtes à utiliser dans votre projet Angular:

```typescript
// ===========================================
// MOVIE INTERFACES
// ===========================================

export interface Movie {
  tmdbId: number;
  title: string;
  originalTitle?: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genres: string[];
  runtime?: number | null;
  tagline?: string | null;
  syncedInNeo4j?: boolean;
}

export interface MoviePage {
  page: number;
  totalPages: number;
  totalResults: number;
  results: Movie[];
}

export interface MovieLight {
  tmdbId: number;
  title: string;
  posterPath: string | null;
}

export interface SyncResponse {
  tmdbId: number;
  title: string;
  created: boolean;
  message: string;
}

// ===========================================
// USER INTERFACES
// ===========================================

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface FollowStatus {
  following: boolean;
}

// ===========================================
// RATING INTERFACES
// ===========================================

export interface RateRequest {
  tmdbId: number;
  score: number;  // 1-10
}

export interface RateResponse {
  score: number;
}

// ===========================================
// RECOMMENDATION INTERFACES
// ===========================================

export interface MovieRecommendation {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  voteAverage: number;
  genres: string[];
}

export interface SharedMovie extends MovieRecommendation {
  sharedBy: {
    id: string;
    username: string;
  };
  sharedAt: string;
}

export interface ShareRequest {
  targetUserId: string;
  tmdbId: number;
}

// ===========================================
// AUTH INTERFACES (Keycloak)
// ===========================================

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  session_state: string;
  scope: string;
}

// ===========================================
// ERROR INTERFACE
// ===========================================

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
```

---

## Gestion des Erreurs

### Codes d'Erreur HTTP

| Code | Signification | Action Frontend |
|------|---------------|-----------------|
| 200 | Succès | Afficher les données |
| 201 | Créé | Afficher confirmation |
| 204 | Succès sans contenu | Afficher confirmation |
| 400 | Requête invalide | Afficher message d'erreur |
| 401 | Non authentifié | Rediriger vers login |
| 403 | Accès refusé | Afficher message "accès refusé" |
| 404 | Non trouvé | Afficher "ressource introuvable" |
| 500 | Erreur serveur | Afficher erreur générique |

### Format d'Erreur Standard

```json
{
  "timestamp": "2026-01-06T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Movie not found with TMDb ID: 999999999",
  "path": "/api/movies/999999999"
}
```

---

## Exemples d'Implémentation Angular

### Service HTTP Base

```typescript
// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Helper pour construire les headers avec token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Méthodes génériques
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params });
  }

  getAuth<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { 
      headers: this.getAuthHeaders(),
      params 
    });
  }

  postAuth<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, {
      headers: this.getAuthHeaders()
    });
  }

  deleteAuth<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.getAuthHeaders()
    });
  }
}
```

### Movie Service

```typescript
// services/movie.service.ts
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Movie, MoviePage } from '../interfaces/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(private api: ApiService) {}

  // Discovery
  getTrending(page = 1, language = 'fr-FR'): Observable<MoviePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', language);
    return this.api.get<MoviePage>('/api/movies/discovery/trending', params);
  }

  getTopRated(page = 1, language = 'fr-FR'): Observable<MoviePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', language);
    return this.api.get<MoviePage>('/api/movies/discovery/top-rated', params);
  }

  getNowPlaying(page = 1, language = 'fr-FR'): Observable<MoviePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('language', language);
    return this.api.get<MoviePage>('/api/movies/discovery/now-playing', params);
  }

  // Search
  search(query: string, page = 1, language = 'fr-FR'): Observable<MoviePage> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('language', language);
    return this.api.get<MoviePage>('/api/movies/search', params);
  }

  // Details
  getMovieDetails(tmdbId: number, language = 'fr-FR'): Observable<Movie> {
    const params = new HttpParams().set('language', language);
    return this.api.get<Movie>(`/api/movies/${tmdbId}`, params);
  }

  // Recommendations (authentifié)
  getCollaborativeRecommendations(language = 'fr-FR'): Observable<MoviePage> {
    const params = new HttpParams().set('language', language);
    return this.api.getAuth<MoviePage>('/api/movies/recommendations/collaborative', params);
  }

  getGenreBasedRecommendations(language = 'fr-FR'): Observable<MoviePage> {
    const params = new HttpParams().set('language', language);
    return this.api.getAuth<MoviePage>('/api/movies/recommendations/genre-based', params);
  }
}
```

### User Service

```typescript
// services/user.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, FollowStatus } from '../interfaces/user.interface';
import { MovieLight } from '../interfaces/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) {}

  // Current user
  getMe(): Observable<User> {
    return this.api.getAuth<User>('/api/users/me');
  }

  getUser(userId: string): Observable<User> {
    return this.api.getAuth<User>(`/api/users/${userId}`);
  }

  // Watchlist
  getWatchlist(): Observable<MovieLight[]> {
    return this.api.getAuth<MovieLight[]>('/api/users/watchlist');
  }

  addToWatchlist(tmdbId: number): Observable<MovieLight> {
    return this.api.postAuth<MovieLight>(`/api/users/watchlist/${tmdbId}`, {});
  }

  removeFromWatchlist(tmdbId: number): Observable<void> {
    return this.api.deleteAuth<void>(`/api/users/watchlist/${tmdbId}`);
  }

  // Social
  followUser(userId: string): Observable<User> {
    return this.api.postAuth<User>(`/api/users/follow/${userId}`, {});
  }

  unfollowUser(userId: string): Observable<void> {
    return this.api.deleteAuth<void>(`/api/users/follow/${userId}`);
  }

  getFollowing(): Observable<User[]> {
    return this.api.getAuth<User[]>('/api/users/following');
  }

  getFollowers(): Observable<User[]> {
    return this.api.getAuth<User[]>('/api/users/followers');
  }

  isFollowing(userId: string): Observable<FollowStatus> {
    return this.api.getAuth<FollowStatus>(`/api/users/following/${userId}`);
  }
}
```

### Rating Service

```typescript
// services/rating.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RateRequest, RateResponse } from '../interfaces/rating.interface';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private api: ApiService) {}

  rateMovie(tmdbId: number, score: number): Observable<RateResponse> {
    const body: RateRequest = { tmdbId, score };
    return this.api.postAuth<RateResponse>('/api/rates/', body);
  }
}
```

### Intercepteur HTTP pour les Erreurs

```typescript
// interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expiré ou invalide
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
```

---

## URLs des Images TMDb

Pour afficher les images (posters, backdrops), utilisez les URLs TMDb:

```typescript
// utils/tmdb-image.util.ts
export class TmdbImageUtil {
  private static readonly BASE_URL = 'https://image.tmdb.org/t/p/';

  // Tailles disponibles pour les posters
  static readonly POSTER_SIZES = {
    W92: 'w92',
    W154: 'w154',
    W185: 'w185',
    W342: 'w342',
    W500: 'w500',
    W780: 'w780',
    ORIGINAL: 'original'
  };

  // Tailles disponibles pour les backdrops
  static readonly BACKDROP_SIZES = {
    W300: 'w300',
    W780: 'w780',
    W1280: 'w1280',
    ORIGINAL: 'original'
  };

  static getPosterUrl(path: string | null, size = 'w342'): string {
    if (!path) return '/assets/images/no-poster.jpg';
    return `${this.BASE_URL}${size}${path}`;
  }

  static getBackdropUrl(path: string | null, size = 'w1280'): string {
    if (!path) return '/assets/images/no-backdrop.jpg';
    return `${this.BASE_URL}${size}${path}`;
  }
}
```

**Utilisation dans un template:**
```html
<img [src]="getPosterUrl(movie.posterPath)" [alt]="movie.title">
```

---

## Résumé des Endpoints

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/movies/discovery/trending` | GET | ❌ | Films tendances |
| `/api/movies/discovery/top-rated` | GET | ❌ | Films les mieux notés |
| `/api/movies/discovery/now-playing` | GET | ❌ | Films à l'affiche |
| `/api/movies/search` | GET | ❌ | Recherche de films |
| `/api/movies/{tmdbId}` | GET | ❌ | Détails d'un film |
| `/api/movies/{tmdbId}/sync` | POST | ❌ | Sync film dans Neo4j |
| `/api/movies/recommendations/collaborative` | GET | ✅ | Recommandations collaboratives |
| `/api/movies/recommendations/genre-based` | GET | ✅ | Recommandations par genre |
| `/api/users/me` | GET | ✅ | Utilisateur connecté |
| `/api/users/{id}` | GET | ✅ | Info utilisateur |
| `/api/users/watchlist` | GET | ✅ | Ma watchlist |
| `/api/users/watchlist/{tmdbId}` | POST | ✅ | Ajouter à watchlist |
| `/api/users/watchlist/{tmdbId}` | DELETE | ✅ | Retirer de watchlist |
| `/api/users/follow/{userId}` | POST | ✅ | Suivre utilisateur |
| `/api/users/follow/{userId}` | DELETE | ✅ | Ne plus suivre |
| `/api/users/following` | GET | ✅ | Mes abonnements |
| `/api/users/followers` | GET | ✅ | Mes abonnés |
| `/api/users/following/{userId}` | GET | ✅ | Vérifie si on suit |
| `/api/rates/` | POST | ✅ | Noter un film |
| `/api/recommendations/` | GET | ✅ | Mes recommandations |
| `/api/recommendations/shared` | GET | ✅ | Films partagés |
| `/api/recommendations/share` | POST | ✅ | Partager un film |

---

## Notes Importantes

1. **Toutes les requêtes passent par l'API Gateway** (`localhost:5050`)
2. **CORS est configuré** pour `localhost:4200`
3. **Le token Keycloak** doit être stocké et envoyé dans le header `Authorization`
4. **Les images TMDb** nécessitent de construire l'URL complète avec `https://image.tmdb.org/t/p/`
5. **La synchronisation Neo4j** est automatique lors de l'ajout à la watchlist ou d'une notation
6. **Les IDs des films** sont les IDs TMDb (nombres), pas des UUIDs
