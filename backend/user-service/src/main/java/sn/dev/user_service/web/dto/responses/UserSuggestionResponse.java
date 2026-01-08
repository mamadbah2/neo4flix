package sn.dev.user_service.web.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO pour un utilisateur suggéré avec ses statistiques.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSuggestionResponse {
    private String id;
    private String username;
    private Integer followersCount;
    private Integer ratingsCount;
    private Integer watchlistCount;
}
