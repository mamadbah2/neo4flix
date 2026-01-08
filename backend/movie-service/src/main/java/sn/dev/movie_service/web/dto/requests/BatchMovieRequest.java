package sn.dev.movie_service.web.dto.requests;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Requête pour récupérer plusieurs films en une seule requête.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class BatchMovieRequest {
    
    /**
     * Liste des IDs TMDb des films à récupérer (max 50).
     */
    private List<Long> tmdbIds;
    
    /**
     * Langue pour les résultats (défaut: fr-FR).
     */
    private String language = "fr-FR";
}
