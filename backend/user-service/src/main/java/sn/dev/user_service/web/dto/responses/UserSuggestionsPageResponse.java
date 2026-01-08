package sn.dev.user_service.web.dto.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO pour la réponse paginée des suggestions d'utilisateurs.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSuggestionsPageResponse {
    private int page;
    private int totalPages;
    private int totalResults;
    private List<UserSuggestionResponse> users;
}
