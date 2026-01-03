package sn.dev.movie_service.web.dto.tmdb;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO représentant un film TMDb.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TmdbMovieDto {
    
    private Long id;
    
    private String title;
    
    @JsonProperty("original_title")
    private String originalTitle;
    
    private String overview;
    
    @JsonProperty("poster_path")
    private String posterPath;
    
    @JsonProperty("backdrop_path")
    private String backdropPath;
    
    @JsonProperty("release_date")
    private String releaseDate;
    
    @JsonProperty("vote_average")
    private Double voteAverage;
    
    @JsonProperty("vote_count")
    private Integer voteCount;
    
    private Double popularity;
    
    @JsonProperty("genre_ids")
    private List<Integer> genreIds;
    
    // Pour les détails complets (endpoint /movie/{id})
    private List<TmdbGenreDto> genres;
    
    private Boolean adult;
    
    @JsonProperty("original_language")
    private String originalLanguage;
    
    private Integer runtime;
    
    private String status;
    
    private String tagline;
    
    private Long budget;
    
    private Long revenue;
}
