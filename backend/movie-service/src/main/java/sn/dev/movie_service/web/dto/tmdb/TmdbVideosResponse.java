package sn.dev.movie_service.web.dto.tmdb;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO pour la réponse des vidéos TMDb.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TmdbVideosResponse {
    
    private Long id;
    
    private List<TmdbVideoDto> results;
}
