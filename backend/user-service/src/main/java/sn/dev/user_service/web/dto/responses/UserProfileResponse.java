package sn.dev.user_service.web.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO de réponse pour le profil utilisateur avec statistiques.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    
    private String id;
    private String username;
    private String email;
    
    /**
     * Nombre de notes données par l'utilisateur.
     */
    private Integer ratingsCount;
    
    /**
     * Nombre de followers.
     */
    private Integer followersCount;
    
    /**
     * Nombre de personnes suivies.
     */
    private Integer followingCount;
    
    /**
     * Nombre de films en watchlist.
     */
    private Integer watchlistCount;
}
