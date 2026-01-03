package sn.dev.recommendation_service.web.dto.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO de réponse pour un film.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieResponse {
    private Long tmdbId;
    private String title;
    private String overview;
    private String posterPath;
    private Double voteAverage;
    private List<String> genres;
}