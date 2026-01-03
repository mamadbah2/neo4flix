package sn.dev.movie_service.web.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO de réponse pour la synchronisation d'un film.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyncResponse {
    
    private Long tmdbId;
    private String title;
    private Boolean created;
    private String message;
}
