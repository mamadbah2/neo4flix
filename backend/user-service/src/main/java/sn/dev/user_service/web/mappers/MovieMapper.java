package sn.dev.user_service.web.mappers;

import sn.dev.user_service.data.entities.Movie;
import sn.dev.user_service.web.dto.responses.MovieResponse;

/**
 * Mapper pour les films dans le user-service.
 */
public class MovieMapper {

    private MovieMapper() {
        // Utility class
    }

    public static MovieResponse toResponse(Movie movie) {
        if (movie == null) return null;
        return MovieResponse.builder()
            .tmdbId(movie.getTmdbId())
            .title(movie.getTitle())
            .posterPath(movie.getPosterPath())
            .build();
    }
}
