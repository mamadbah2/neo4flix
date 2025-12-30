package sn.dev.movie_service.services;

import java.util.List;

import sn.dev.movie_service.data.entities.Movie;

public interface MovieService {
    List<Movie> getAllMovies();
    Movie getMovieById(String id);
    Movie createMovie(Movie movie);
}
