package sn.dev.movie_service.web.dto.tmdb;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO pour la réponse de la liste des genres TMDb.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TmdbGenreListResponse {
    
    private List<TmdbGenreDto> genres;
}
