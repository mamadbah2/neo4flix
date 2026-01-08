package sn.dev.movie_service.web.dto.tmdb;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Réponse TMDb pour les crédits (casting) d'un film.
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class TmdbCreditsResponse {
    
    private Long id;
    
    private List<TmdbCastDto> cast;
    
    private List<TmdbCrewDto> crew;
    
    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TmdbCastDto {
        private Long id;
        private String name;
        
        @JsonProperty("original_name")
        private String originalName;
        
        private String character;
        
        @JsonProperty("profile_path")
        private String profilePath;
        
        private Integer order;
        
        @JsonProperty("known_for_department")
        private String knownForDepartment;
    }
    
    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TmdbCrewDto {
        private Long id;
        private String name;
        private String job;
        private String department;
        
        @JsonProperty("profile_path")
        private String profilePath;
    }
}
