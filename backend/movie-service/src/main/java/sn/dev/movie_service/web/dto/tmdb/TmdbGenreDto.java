package sn.dev.movie_service.web.dto.tmdb;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO représentant un genre TMDb.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TmdbGenreDto {
    private Integer id;
    private String name;
}
