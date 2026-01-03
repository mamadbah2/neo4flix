package sn.dev.rating_service.clients;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Réponse de synchronisation du movie-service.
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
