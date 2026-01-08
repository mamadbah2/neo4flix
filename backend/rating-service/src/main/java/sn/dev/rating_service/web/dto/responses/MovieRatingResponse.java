package sn.dev.rating_service.web.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO pour une note individuelle d'un utilisateur sur un film.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieRatingResponse {
    private int score;
    private String comment;
    private String createdAt;
}
