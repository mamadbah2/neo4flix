package sn.dev.movie_service.web.mappers;

import org.springframework.stereotype.Component;

import sn.dev.movie_service.data.entities.Movie;
import sn.dev.movie_service.web.dto.requests.MovieCreateRequest;
import sn.dev.movie_service.web.dto.responses.MovieResponse;

@Component
public class MovieMapper {
    // Transforme une entité Movie en MovieResponse
    public static MovieResponse toResponse(Movie movie) {
        if (movie == null) return null;
        return new MovieResponse(
            movie.getId(),
            movie.getTitle(),
            movie.getDescription(),
            movie.getYear(),
            movie.getGenres()
        );
    }

    // Transforme une MovieCreateRequest en entité Movie (sans id ni genres)
    public static Movie fromCreateRequest(MovieCreateRequest request) {
        if (request == null) return null;
        Movie movie = new Movie();
        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setYear(request.getReleaseYear());
        movie.setGenres(request.getGenres());
        return movie;
    }
}
