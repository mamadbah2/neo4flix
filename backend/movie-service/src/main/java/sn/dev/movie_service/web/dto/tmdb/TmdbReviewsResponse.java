package sn.dev.movie_service.web.dto.tmdb;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Réponse TMDb pour les avis d'un film.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class TmdbReviewsResponse {
    
    private Long id;
    private Integer page;
    private List<TmdbReviewDto> results;
    
    @JsonProperty("total_pages")
    private Integer totalPages;
    
    @JsonProperty("total_results")
    private Integer totalResults;
    
    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TmdbReviewDto {
        private String id;
        private String author;
        private String content;
        
        @JsonProperty("created_at")
        private String createdAt;
        
        @JsonProperty("updated_at")
        private String updatedAt;
        
        private String url;
        
        @JsonProperty("author_details")
        private AuthorDetails authorDetails;
    }
    
    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorDetails {
        private String name;
        private String username;
        
        @JsonProperty("avatar_path")
        private String avatarPath;
        
        private Double rating;
    }
}
