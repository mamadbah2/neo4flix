package sn.dev.movie_service.web.dto.tmdb;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO représentant une réponse paginée de TMDb.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TmdbPageResponse<T> {
    
    private Integer page;
    
    private List<T> results;
    
    @JsonProperty("total_pages")
    private Integer totalPages;
    
    @JsonProperty("total_results")
    private Integer totalResults;
}
