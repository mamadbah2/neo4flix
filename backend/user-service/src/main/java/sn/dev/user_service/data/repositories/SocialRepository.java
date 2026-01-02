package sn.dev.user_service.data.repositories;

import java.util.List;

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
}
