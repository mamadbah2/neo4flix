# 🎬 Neo4flix - Your Next-Gen Movie Platform

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.1-6DB33F?style=for-the-badge&logo=spring-boot)
![Neo4j](https://img.shields.io/badge/Neo4j-Graph_DB-008CC1?style=for-the-badge&logo=neo4j)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Keycloak](https://img.shields.io/badge/Keycloak-OAuth2-4D4D4D?style=for-the-badge&logo=keycloak)

**A powerful microservices-based movie platform powered by Neo4j graph database and TMDb API**

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation)

</div>

---

## 🚀 What is Neo4flix?

Neo4flix is a modern, scalable movie platform that combines the power of **graph databases** with **microservices architecture** to deliver personalized movie recommendations and social features. Think Netflix meets Neo4j! 🎯

### ✨ Why Neo4flix?

- **🧠 Smart Recommendations**: Collaborative filtering using Neo4j's graph algorithms
- **👥 Social Features**: Follow friends, share movies, discover what others are watching
- **📊 Real-time Analytics**: Track ratings, watchlists, and user preferences
- **🔐 Enterprise Security**: OAuth2/JWT with Keycloak integration
- **⚡ High Performance**: Microservices architecture with FeignClients
- **🌍 TMDb Integration**: Access to millions of movies with rich metadata

---

## 🎯 Features

### 🎥 Movie Discovery
- **Trending Movies**: Weekly trending films from TMDb
- **Top Rated Classics**: All-time best movies
- **Now Playing**: Current theater releases
- **Upcoming Releases**: Future movie launches
- **Genre-based Discovery**: Browse by your favorite genres
- **Advanced Search**: Find any movie instantly

### 👤 User Experience
- **Personal Watchlist**: Save movies to watch later
- **Movie Ratings**: Rate and review films (1-10 stars)
- **User Profiles**: Complete profiles with statistics
- **Follow System**: Connect with friends and movie enthusiasts

### 🤝 Social Features
- **Movie Sharing**: Share recommendations with friends (with custom messages!)
- **Social Boost**: See what your friends are watching first
- **Collaborative Filtering**: Get recommendations based on similar users
- **Genre-based Recommendations**: Personalized suggestions based on your taste
- **User Discovery**: Find new people to follow

### 📊 Analytics
- **User Statistics**: Track your movie journey
- **Rating Insights**: See community ratings
- **Genre Preferences**: Analyze your favorite genres
- **Watchlist Trends**: Popular movies among users

---

## 🏗️ Architecture

### Microservices Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                          │
│                     (Port 5050)                             │
│            Routes, CORS, Load Balancing                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ User Service │ │Movie Service │ │Rate Service  │ │  Recommend   │
│  (Port 8081) │ │ (Port 8082)  │ │ (Port 8084)  │ │   Service    │
│              │ │              │ │              │ │ (Port 8083)  │
│ • Watchlist  │ │ • TMDb API   │ │ • Ratings    │ │ • Collab.    │
│ • Follow     │ │ • Discovery  │ │ • Reviews    │ │   Filtering  │
│ • Profiles   │ │ • Search     │ │ • Comments   │ │ • Genre Rec. │
│ • Auth       │ │ • Sync Neo4j │ │              │ │ • Sharing    │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │
       └────────────────┴────────────────┴────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │      Neo4j DB         │
                    │  (Graph Database)     │
                    │                       │
                    │ • Users               │
                    │ • Movies              │
                    │ • Genres              │
                    │ • Relationships       │
                    └───────────────────────┘

External Services:
┌──────────────────┐         ┌──────────────────┐
│   Keycloak       │         │    TMDb API      │
│   OAuth2/JWT     │         │  Movie Database  │
└──────────────────┘         └──────────────────┘
```

### 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Java 21, Spring Boot 4.0.1, Spring Data Neo4j |
| **Database** | Neo4j Graph Database |
| **Security** | Keycloak (OAuth2/JWT), Spring Security |
| **Communication** | FeignClient, REST API |
| **External API** | TMDb (The Movie Database) |
| **Containerization** | Docker, Docker Compose |
| **Build Tool** | Maven |
| **Monitoring** | Spring Actuator |

### 🔄 Key Design Patterns

- **Microservices Architecture**: Independent, scalable services
- **API Gateway Pattern**: Single entry point for all clients
- **Lazy Synchronization**: Movies synced to Neo4j only when needed
- **Graph Relationships**: Efficient relationship queries with Neo4j
- **OAuth2 Resource Server**: Stateless JWT authentication

---

## 🚀 Quick Start

### Prerequisites

- **Java 21** or higher
- **Docker** & **Docker Compose**
- **Maven** 3.8+
- **TMDb API Key** (get it free at [TMDb](https://www.themoviedb.org/settings/api))

### 🐳 One-Command Deployment

```bash
# Clone the repository
git clone https://github.com/yourusername/neo4flix.git
cd neo4flix/backend

# Set your TMDb token (optional - already configured)
export TMDB_ACCESS_TOKEN=your_tmdb_token_here

# Start all services with Docker Compose
docker-compose up -d

# Check services health
docker-compose ps
```

**That's it! 🎉** All services are now running:
- API Gateway: http://localhost:5050
- User Service: http://localhost:8081
- Movie Service: http://localhost:8082
- Recommendation Service: http://localhost:8083
- Rating Service: http://localhost:8084

### 🧪 Test the API

```bash
# Get trending movies (no auth required)
curl http://localhost:5050/api/movies/discovery/trending

# Search for a movie
curl "http://localhost:5050/api/movies/search?query=Inception"

# Get movie details
curl http://localhost:5050/api/movies/27205
```

### 🔐 Authentication

```bash
# Login to get a token
curl -X POST https://keykloak.freeddns.org/realms/neo4flix/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=neo4flix-app&username=mamadbah&password=password123"

# Use the token in your requests
curl http://localhost:5050/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📚 API Documentation

### 🎬 Movie Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/movies/discovery/trending` | GET | ❌ | Weekly trending movies |
| `/api/movies/discovery/top-rated` | GET | ❌ | All-time best movies |
| `/api/movies/discovery/now-playing` | GET | ❌ | Movies in theaters |
| `/api/movies/discovery/upcoming` | GET | ❌ | Upcoming releases |
| `/api/movies/discovery/popular` | GET | ❌ | Popular movies |
| `/api/movies/discovery/by-genre/{id}` | GET | ❌ | Movies by genre |
| `/api/movies/search` | GET | ❌ | Search movies |
| `/api/movies/{tmdbId}` | GET | ❌ | Movie details |
| `/api/movies/{tmdbId}/reviews` | GET | ❌ | Movie reviews (paginated) |
| `/api/movies/batch` | POST | ❌ | Get multiple movies |
| `/api/movies/recommendations/collaborative` | GET | ✅ | Collaborative recommendations |
| `/api/movies/recommendations/genre-based` | GET | ✅ | Genre-based recommendations |

### 👤 User Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/users/me` | GET | ✅ | Current user info |
| `/api/users/profile` | GET | ✅ | User profile with stats |
| `/api/users/profile/{userId}` | GET | ✅ | Another user's profile |
| `/api/users/watchlist` | GET | ✅ | Get watchlist |
| `/api/users/watchlist/{tmdbId}` | POST | ✅ | Add to watchlist |
| `/api/users/watchlist/{tmdbId}` | DELETE | ✅ | Remove from watchlist |
| `/api/users/follow/{userId}` | POST | ✅ | Follow a user |
| `/api/users/follow/{userId}` | DELETE | ✅ | Unfollow a user |
| `/api/users/following` | GET | ✅ | Users you follow |
| `/api/users/followers` | GET | ✅ | Your followers |
| `/api/users/discover` | GET | ✅ | Discover users to follow |

### ⭐ Rating Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/rates/` | POST | ✅ | Rate a movie (with optional comment) |
| `/api/rates/movie/{tmdbId}` | GET | ❌ | Get movie ratings (paginated) |
| `/api/rates/user` | GET | ✅ | Get user's ratings |

### 🎯 Recommendation Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/recommendations/` | GET | ✅ | Personalized recommendations |
| `/api/recommendations/share` | POST | ✅ | Share movie with friend |
| `/api/recommendations/shared` | GET | ✅ | Movies shared by friends |

📖 **Full API Documentation**: See [FRONTEND_API_DOCUMENTATION.md](FRONTEND_API_DOCUMENTATION.md)

---

## 🔧 Development

### Local Development (Without Docker)

```bash
# Start each service individually
cd user-service
./mvnw spring-boot:run

cd movie-service
./mvnw spring-boot:run

# ... repeat for other services
```

### Environment Variables

```properties
# Neo4j Configuration
NEO4J_URI=bolt://your-neo4j-host:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=yourpassword

# TMDb API
TMDB_ACCESS_TOKEN=your_tmdb_bearer_token

# Service URLs (for inter-service communication)
MOVIE_SERVICE_URL=http://localhost:8082
USER_SERVICE_URL=http://localhost:8081
```

### Project Structure

```
backend/
├── api-gateway/           # API Gateway (Port 5050)
├── user-service/          # User management & social features
├── movie-service/         # TMDb integration & movie data
├── rating-service/        # Movie ratings & reviews
├── recommendation-service/ # Recommendation algorithms
├── docker-compose.yml     # Docker orchestration
├── pom.xml               # Parent POM
└── *.http                # API test files
```

---

## 🧪 Testing

### API Tests

The project includes comprehensive HTTP test files:

- `api-tests-user1.http` - User flow tests
- `api-tests-user2.http` - Multi-user scenarios
- `test-social.http` - Social features testing
- `api-test-tmdb.http` - TMDb integration tests

Open these files in VS Code with the REST Client extension or IntelliJ IDEA.

### Manual Testing with cURL

```bash
# Test trending movies
curl http://localhost:5050/api/movies/discovery/trending | jq

# Test authentication
curl -X POST https://keykloak.freeddns.org/realms/neo4flix/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=neo4flix-app&username=testuser&password=testpass"
```

---

## 🎨 Neo4j Graph Model

```cypher
# Users follow each other
(User)-[:FOLLOWS]->(User)

# Users have watchlists
(User)-[:WATCHLIST]->(Movie)

# Users rate movies
(User)-[:RATED {score: Int, comment: String, timestamp: DateTime}]->(Movie)

# Movies belong to genres
(Movie)-[:IN_GENRE]->(Genre)

# Users share movies
(User)-[:SHARED {message: String, timestamp: DateTime}]->(Movie)-[:SHARED_WITH]->(User)
```

### Example Cypher Queries

```cypher
# Find movies liked by similar users (Collaborative Filtering)
MATCH (me:User {keycloakId: $userId})-[:RATED {score: 8..10}]->(m:Movie)
      <-[:RATED {score: 8..10}]-(other:User)
MATCH (other)-[:RATED {score: 8..10}]->(rec:Movie)
WHERE NOT (me)-[:RATED]->(rec)
RETURN rec, count(other) as similarity
ORDER BY similarity DESC
LIMIT 20

# Find user's favorite genres
MATCH (u:User {keycloakId: $userId})-[:RATED {score: 7..10}]->(m:Movie)-[:IN_GENRE]->(g:Genre)
RETURN g.name, count(*) as count
ORDER BY count DESC
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Coding Standards

- Follow **Spring Boot best practices**
- Use **meaningful commit messages**
- Add **comprehensive error handling** with custom exceptions
- Write **unit and integration tests**
- Document **new API endpoints**

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mamadou Bah**
- GitHub: [@mamadbah](https://github.com/mamadbah)
- Email: mamadbah@example.com

---

## 🙏 Acknowledgments

- **TMDb** for providing an amazing movie database API
- **Neo4j** for the powerful graph database
- **Spring Boot** team for the excellent framework
- **Keycloak** for robust authentication

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you learn microservices or graph databases!

---

<div align="center">

**Built with ❤️ and ☕ using Java & Neo4j**

[⬆ Back to Top](#-neo4flix---your-next-gen-movie-platform)

</div>
