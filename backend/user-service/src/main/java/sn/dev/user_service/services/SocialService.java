package sn.dev.user_service.services;

import java.util.List;

import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.web.dto.responses.UserSuggestionsPageResponse;

public interface SocialService {
    
    void followUser(String userId, String targetUserId);
    
    void unfollowUser(String userId, String targetUserId);
    
    List<User> getFollowing(String userId);
    
    List<User> getFollowers(String userId);
    
    boolean isFollowing(String userId, String targetUserId);

    /**
     * Récupère les utilisateurs suggérés (non suivis) avec pagination.
     * 
     * @param userId l'ID de l'utilisateur connecté
     * @param page numéro de page (1-indexed)
     * @param size nombre d'éléments par page
     * @return les suggestions paginées avec statistiques
     */
    UserSuggestionsPageResponse getSuggestedUsers(String userId, int page, int size);
}
