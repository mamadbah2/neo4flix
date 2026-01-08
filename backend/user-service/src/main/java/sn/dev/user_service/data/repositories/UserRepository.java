package sn.dev.user_service.data.repositories;

import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import sn.dev.user_service.data.entities.User;

public interface UserRepository extends Neo4jRepository<User, String> {
    Optional<User> findByKeycloakId(String keycloakId);

    /**
     * Compte le nombre de followers d'un utilisateur.
     */
    @Query("MATCH (follower:User)-[:FOLLOWS]->(u:User {keycloakId: $userId}) RETURN count(follower)")
    Integer countFollowers(@Param("userId") String userId);

    /**
     * Compte le nombre de personnes suivies par un utilisateur.
     */
    @Query("MATCH (u:User {keycloakId: $userId})-[:FOLLOWS]->(following:User) RETURN count(following)")
    Integer countFollowing(@Param("userId") String userId);

    /**
     * Compte le nombre de films en watchlist.
     */
    @Query("MATCH (u:User {keycloakId: $userId})-[:WATCHLIST]->(m:Movie) RETURN count(m)")
    Integer countWatchlist(@Param("userId") String userId);

    /**
     * Compte le nombre de notes données par un utilisateur.
     */
    @Query("MATCH (u:User {keycloakId: $userId})-[:RATED]->(m:Movie) RETURN count(m)")
    Integer countRatings(@Param("userId") String userId);
}
