package sn.dev.recommendation_service.data.repositories;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import sn.dev.recommendation_service.data.entities.Movie;

public interface ShareRepository extends Neo4jRepository<Movie, String> {

    /**
     * Crée une relation de partage : l'utilisateur recommande un film à un ami qu'il suit.
     * Vérifie d'abord que la relation FOLLOWS existe.
     */
    @Query("""
            MATCH (me:User {keycloakId: $userId})-[:FOLLOWS]->(friend:User {keycloakId: $targetUserId})
            MATCH (m:Movie {id: $movieId})
            MERGE (me)-[s:SHARED_WITH {at: datetime()}]->(sr:SharedRecommendation {movieId: $movieId, fromUserId: $userId, toUserId: $targetUserId})
            MERGE (sr)-[:RECOMMENDS]->(m)
            MERGE (sr)-[:FOR]->(friend)
            RETURN COUNT(sr) > 0
            """)
    boolean shareMovieWithFriend(@Param("userId") String userId, 
                                  @Param("targetUserId") String targetUserId, 
                                  @Param("movieId") String movieId);

    /**
     * Vérifie si l'utilisateur suit bien la cible.
     */
    @Query("MATCH (u1:User {keycloakId: $userId})-[:FOLLOWS]->(u2:User {keycloakId: $targetUserId}) RETURN COUNT(u2) > 0")
    boolean isFollowing(@Param("userId") String userId, @Param("targetUserId") String targetUserId);

    /**
     * Récupère les films recommandés à un utilisateur par ses amis (via SHARED_WITH).
     * Retourne les films avec le nombre de fois qu'ils ont été partagés pour le scoring.
     */
    @Query("""
            MATCH (friend:User)-[:SHARED_WITH]->(sr:SharedRecommendation)-[:FOR]->(me:User {keycloakId: $userId})
            MATCH (sr)-[:RECOMMENDS]->(m:Movie)
            RETURN DISTINCT m
            """)
    List<Movie> findSharedMoviesForUser(@Param("userId") String userId);

    /**
     * Récupère les IDs des films partagés avec l'utilisateur pour le boost.
     */
    @Query("""
            MATCH (friend:User)-[:SHARED_WITH]->(sr:SharedRecommendation)-[:FOR]->(me:User {keycloakId: $userId})
            MATCH (sr)-[:RECOMMENDS]->(m:Movie)
            RETURN DISTINCT m.id
            """)
    List<String> findSharedMovieIdsForUser(@Param("userId") String userId);

    /**
     * Vérifie si le film existe dans la base Neo4j.
     */
    @Query("MATCH (m:Movie {id: $movieId}) RETURN COUNT(m) > 0")
    boolean movieExists(@Param("movieId") String movieId);
}
