package sn.dev.recommendation_service.services;

/**
 * Service pour le partage de films entre utilisateurs.
 */
public interface ShareService {
    
    /**
     * Partage un film avec un ami que l'utilisateur suit.
     * 
     * @param userId l'ID de l'utilisateur qui partage
     * @param targetUserId l'ID de l'ami destinataire
     * @param tmdbId l'ID TMDb du film à partager
     * @throws IllegalArgumentException si l'utilisateur ne suit pas la cible
     * @throws IllegalStateException si le film n'existe pas
     */
    void shareMovie(String userId, String targetUserId, Long tmdbId);
    
    /**
     * Vérifie si l'utilisateur suit la cible.
     */
    boolean isFollowing(String userId, String targetUserId);
}
