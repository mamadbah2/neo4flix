package sn.dev.user_service.services.implementation;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.data.repositories.SocialRepository;
import sn.dev.user_service.services.SocialService;
import sn.dev.user_service.web.dto.responses.UserSuggestionResponse;
import sn.dev.user_service.web.dto.responses.UserSuggestionsPageResponse;

@Service
@Transactional
public class SocialServiceImpl implements SocialService {

    private final SocialRepository socialRepository;
    private final Neo4jClient neo4jClient;

    public SocialServiceImpl(SocialRepository socialRepository, Neo4jClient neo4jClient) {
        this.socialRepository = socialRepository;
        this.neo4jClient = neo4jClient;
    }

    @Override
    public void followUser(String userId, String targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new IllegalArgumentException("Un utilisateur ne peut pas se suivre lui-même");
        }
        socialRepository.followUser(userId, targetUserId);
    }

    @Override
    public void unfollowUser(String userId, String targetUserId) {
        socialRepository.unfollowUser(userId, targetUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getFollowing(String userId) {
        return socialRepository.findFollowing(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getFollowers(String userId) {
        return socialRepository.findFollowers(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFollowing(String userId, String targetUserId) {
        return socialRepository.isFollowing(userId, targetUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public UserSuggestionsPageResponse getSuggestedUsers(String userId, int page, int size) {
        int skip = (page - 1) * size;
        
        // 1. Récupérer les utilisateurs suggérés paginés via Neo4jClient
        String cypherQuery = "MATCH (u:User) " +
                "WHERE u.keycloakId <> $userId " +
                "AND NOT EXISTS { MATCH (:User {keycloakId: $userId})-[:FOLLOWS]->(u) } " +
                "WITH u, rand() as r " +
                "ORDER BY r " +
                "SKIP $skip LIMIT $limit " +
                "OPTIONAL MATCH (follower:User)-[:FOLLOWS]->(u) " +
                "WITH u, count(DISTINCT follower) as followersCount " +
                "OPTIONAL MATCH (u)-[:RATED]->(ratedMovie:Movie) " +
                "WITH u, followersCount, count(DISTINCT ratedMovie) as ratingsCount " +
                "OPTIONAL MATCH (u)-[:WATCHLIST]->(watchlistMovie:Movie) " +
                "RETURN u.keycloakId as id, u.username as username, " +
                "followersCount, ratingsCount, count(DISTINCT watchlistMovie) as watchlistCount";
        
        Collection<Map<String, Object>> usersData = neo4jClient.query(cypherQuery)
                .bind(userId).to("userId")
                .bind(skip).to("skip")
                .bind(size).to("limit")
                .fetch()
                .all();
        
        // 2. Mapper les résultats
        List<UserSuggestionResponse> suggestions = new ArrayList<>();
        for (var data : usersData) {
            String id = (String) data.get("id");
            String username = (String) data.get("username");
            Object followersObj = data.get("followersCount");
            Object ratingsObj = data.get("ratingsCount");
            Object watchlistObj = data.get("watchlistCount");
            
            Long followersCount = followersObj instanceof Long ? (Long) followersObj : 0L;
            Long ratingsCount = ratingsObj instanceof Long ? (Long) ratingsObj : 0L;
            Long watchlistCount = watchlistObj instanceof Long ? (Long) watchlistObj : 0L;
            
            suggestions.add(UserSuggestionResponse.builder()
                    .id(id)
                    .username(username)
                    .followersCount(followersCount.intValue())
                    .ratingsCount(ratingsCount.intValue())
                    .watchlistCount(watchlistCount.intValue())
                    .build());
        }
        
        // 3. Récupérer le total
        Integer totalResults = socialRepository.countUsersNotFollowed(userId);
        int total = totalResults != null ? totalResults : 0;
        int totalPages = (int) Math.ceil((double) total / size);
        
        return UserSuggestionsPageResponse.builder()
                .page(page)
                .totalPages(totalPages)
                .totalResults(total)
                .users(suggestions)
                .build();
    }
}
