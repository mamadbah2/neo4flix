package sn.dev.user_service.data.repositories;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import sn.dev.user_service.data.entities.Movie;

public interface WatchlistRepository extends Neo4jRepository<Movie, String> {

    @Query("MATCH (u:User {keycloakId: $userId})-[:WATCHLIST]->(m:Movie) RETURN m")
    List<Movie> findWatchlistByUserId(@Param("userId") String userId);

    @Query("MERGE (u:User {keycloakId: $userId}) " +
           "MERGE (m:Movie {id: $movieId}) " +
           "MERGE (u)-[:WATCHLIST]->(m)")
    void addToWatchlist(@Param("userId") String userId, @Param("movieId") String movieId);

    @Query("MATCH (u:User {keycloakId: $userId})-[r:WATCHLIST]->(m:Movie {id: $movieId}) DELETE r")
    void removeFromWatchlist(@Param("userId") String userId, @Param("movieId") String movieId);

    @Query("MATCH (u:User {keycloakId: $userId})-[:WATCHLIST]->(m:Movie {id: $movieId}) RETURN COUNT(m) > 0")
    boolean existsInWatchlist(@Param("userId") String userId, @Param("movieId") String movieId);
}
