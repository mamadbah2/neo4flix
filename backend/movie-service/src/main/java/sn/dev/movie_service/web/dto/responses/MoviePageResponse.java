package sn.dev.movie_service.web.dto.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO de réponse paginée pour les films.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MoviePageResponse {
    
    private Integer page;
    private Integer totalPages;
    private Integer totalResults;
    private List<MovieResponse> results;
}
