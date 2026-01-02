package sn.dev.user_service.web.mappers;

import sn.dev.user_service.data.entities.Movie;
import sn.dev.user_service.web.dto.responses.MovieResponse;

public class MovieMapper {

    public static MovieResponse toResponse(Movie movie) {
        if (movie == null) return null;
        return new MovieResponse(
            movie.getId(),
            movie.getTitle(),
            movie.getDescription(),
            movie.getYear()
        );
    }
}
