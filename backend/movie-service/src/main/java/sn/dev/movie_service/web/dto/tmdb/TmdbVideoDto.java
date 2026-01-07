package sn.dev.movie_service.web.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO représentant une vidéo TMDb (bande-annonce, teaser, etc.).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TmdbVideoDto {
    
    private String id;
    
    @JsonProperty("iso_639_1")
    private String iso6391;
    
    @JsonProperty("iso_3166_1")
    private String iso31661;
    
    private String name;
    
    private String key;
    
    private String site;
    
    private Integer size;
    
    private String type;
    
    private Boolean official;
    
    @JsonProperty("published_at")
    private String publishedAt;
}
