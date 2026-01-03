package sn.dev.user_service.data.repositories;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import sn.dev.user_service.data.entities.Movie;

/**
 * Repository pour la gestion des watchlists.
 * Utilise tmdbId comme identifiant de film (synchronisé avec movie-service).
 */
public interface WatchlistRepository extends Neo4jRepository<Movie, Long> {

    @Query("MATCH (u:User {keycloakId: $userId})-[:WATCHLIST]->(m:Movie) RETURN m")
    List<Movie> findWatchlistByUserId(@Param("userId") String userId);

    @Query("MERGE (u:User {keycloakId: $userId}) " +
           "MERGE (m:Movie {tmdbId: $tmdbId}) " +
           "MERGE (u)-[:WATCHLIST]->(m)")
    void addToWatchlist(@Param("userId") String userId, @Param("tmdbId") Long tmdbId);

    @Query("MATCH (u:User {keycloakId: $userId})-[r:WATCHLIST]->(m:Movie {tmdbId: $tmdbId}) DELETE r")
    void removeFromWatchlist(@Param("userId") String userId, @Param("tmdbId") Long tmdbId);

    @Query("MATCH (u:User {keycloakId: $userId})-[:WATCHLIST]->(m:Movie {tmdbId: $tmdbId}) RETURN COUNT(m) > 0")
    boolean existsInWatchlist(@Param("userId") String userId, @Param("tmdbId") Long tmdbId);
}
