package sn.dev.movie_service.web.dto.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO de réponse pour un film, enrichi avec les données TMDb.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieResponse {
    
    private Long tmdbId;
    private String title;
    private String originalTitle;
    private String overview;
    private String posterPath;
    private String backdropPath;
    private String releaseDate;
    private Double voteAverage;
    private Integer voteCount;
    private Double popularity;
    private List<String> genres;
    private Integer runtime;
    private String tagline;
    
    // URL de la bande-annonce YouTube (si disponible)
    private String trailerUrl;
    
    // Indique si le film est synchronisé dans Neo4j (pour les relations)
    private Boolean syncedInNeo4j;
}
