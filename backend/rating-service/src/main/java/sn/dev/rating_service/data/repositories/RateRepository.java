package sn.dev.rating_service.data.repositories;

import java.util.List;
import java.util.Map;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import sn.dev.rating_service.data.entities.Rate;

/**
 * Repository pour les notations de films.
 * Utilise tmdbId comme identifiant de film.
 */
public interface RateRepository extends Neo4jRepository<Rate, String> {
    
    @Query("MATCH (u:User {keycloakId: $userId}) MATCH (m:Movie {tmdbId: $tmdbId}) " +
        "MERGE (u)-[r:RATED]->(m) " +
        "SET r.score = $score, r.comment = $comment, r.createdAt = $createdAt " +
        "RETURN r")
    void createRate(
        @Param("userId") String userId, 
        @Param("tmdbId") Long tmdbId, 
        @Param("score") int score,
        @Param("comment") String comment,
        @Param("createdAt") String createdAt
    );
    
    @Query("MATCH (u:User {keycloakId: $userId})-[r:RATED]->(m:Movie {tmdbId: $tmdbId}) RETURN r.score")
    Integer findRating(@Param("userId") String userId, @Param("tmdbId") Long tmdbId);
    
    @Query("MATCH (u:User {keycloakId: $userId})-[r:RATED]->(m:Movie {tmdbId: $tmdbId}) DELETE r")
    void deleteRate(@Param("userId") String userId, @Param("tmdbId") Long tmdbId);

    /**
     * Récupère les ratings d'un film avec pagination.
     */
    @Query("MATCH (u:User)-[r:RATED]->(m:Movie {tmdbId: $tmdbId}) " +
           "RETURN r.score as score, r.comment as comment, r.createdAt as createdAt " +
           "ORDER BY r.createdAt DESC " +
           "SKIP $skip LIMIT $limit")
    List<Map<String, Object>> findRatingsByMovie(
        @Param("tmdbId") Long tmdbId,
        @Param("skip") int skip,
        @Param("limit") int limit
    );

    /**
     * Compte le nombre total de ratings pour un film.
     */
    @Query("MATCH (u:User)-[r:RATED]->(m:Movie {tmdbId: $tmdbId}) RETURN count(r)")
    Integer countRatingsByMovie(@Param("tmdbId") Long tmdbId);

    /**
     * Calcule la moyenne des scores pour un film.
     */
    @Query("MATCH (u:User)-[r:RATED]->(m:Movie {tmdbId: $tmdbId}) RETURN avg(r.score)")
    Double getAverageScoreByMovie(@Param("tmdbId") Long tmdbId);
}
