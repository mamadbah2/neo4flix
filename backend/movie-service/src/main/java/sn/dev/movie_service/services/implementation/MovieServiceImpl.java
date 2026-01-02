package sn.dev.movie_service.services.implementation;

import java.util.List;

import org.springframework.stereotype.Service;

import sn.dev.movie_service.data.entities.Movie;
import sn.dev.movie_service.data.repositories.MovieRepository;
import sn.dev.movie_service.services.MovieService;

@Service
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;

    public MovieServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @Override
    public Movie getMovieById(String id) {
        return movieRepository.findById(id).orElse(null);
    }

    @Override
    public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }

     @Override
    public List<Movie> getCollaborativeRecs(String userId) {
        return movieRepository.getCollaborativeRecs(userId);
    }

    @Override
    public List<Movie> getGenreBasedRecs(String userId) {
        return movieRepository.getGenreBasedRecs(userId);
    }
    
}
