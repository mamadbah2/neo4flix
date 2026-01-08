package sn.dev.rating_service.web.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class RateRequest {
    private Long tmdbId;
    private int score;
    
    /**
     * Commentaire optionnel sur le film.
     */
    private String comment;
}
