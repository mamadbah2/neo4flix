package sn.dev.user_service.data.repositories;

import java.util.List;
import java.util.Map;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import sn.dev.user_service.data.entities.User;

public interface SocialRepository extends Neo4jRepository<User, String> {

    @Query("MERGE (u1:User {keycloakId: $userId}) " +
           "MERGE (u2:User {keycloakId: $targetUserId}) " +
           "MERGE (u1)-[:FOLLOWS]->(u2)")
    void followUser(@Param("userId") String userId, @Param("targetUserId") String targetUserId);

    @Query("MATCH (u1:User {keycloakId: $userId})-[r:FOLLOWS]->(u2:User {keycloakId: $targetUserId}) DELETE r")
    void unfollowUser(@Param("userId") String userId, @Param("targetUserId") String targetUserId);

    @Query("MATCH (u:User {keycloakId: $userId})-[:FOLLOWS]->(following:User) RETURN following")
    List<User> findFollowing(@Param("userId") String userId);

    @Query("MATCH (follower:User)-[:FOLLOWS]->(u:User {keycloakId: $userId}) RETURN follower")
    List<User> findFollowers(@Param("userId") String userId);

    @Query("MATCH (u1:User {keycloakId: $userId})-[:FOLLOWS]->(u2:User {keycloakId: $targetUserId}) RETURN COUNT(u2) > 0")
    boolean isFollowing(@Param("userId") String userId, @Param("targetUserId") String targetUserId);

    /**
     * Trouve les utilisateurs que l'utilisateur actuel ne suit pas encore.
     * Retourne les données sous forme de Map pour inclure les stats.
     * Tri aléatoire pour la découverte.
     */
    @Query("MATCH (other:User) " +
           "WHERE other.keycloakId <> $userId " +
           "AND NOT EXISTS { MATCH (:User {keycloakId: $userId})-[:FOLLOWS]->(other) } " +
           "OPTIONAL MATCH (follower:User)-[:FOLLOWS]->(other) " +
           "OPTIONAL MATCH (other)-[:RATED]->(ratedMovie:Movie) " +
           "OPTIONAL MATCH (other)-[:WATCHLIST]->(watchlistMovie:Movie) " +
           "WITH other, count(DISTINCT follower) as followersCount, count(DISTINCT ratedMovie) as ratingsCount, count(DISTINCT watchlistMovie) as watchlistCount " +
           "RETURN other.keycloakId as id, other.username as username, followersCount, ratingsCount, watchlistCount " +
           "ORDER BY rand() " +
           "SKIP $skip LIMIT $limit")
    List<Map<String, Object>> findUsersNotFollowed(
            @Param("userId") String userId,
            @Param("skip") int skip,
            @Param("limit") int limit
    );

    /**
     * Compte le nombre total d'utilisateurs que l'utilisateur actuel ne suit pas encore.
     */
    @Query("MATCH (other:User) " +
           "WHERE other.keycloakId <> $userId " +
           "AND NOT EXISTS { MATCH (:User {keycloakId: $userId})-[:FOLLOWS]->(other) } " +
           "RETURN count(other)")
    Integer countUsersNotFollowed(@Param("userId") String userId);
}
