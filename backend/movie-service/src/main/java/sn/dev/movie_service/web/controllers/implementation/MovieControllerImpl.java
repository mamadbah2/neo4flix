package sn.dev.movie_service.web.controllers.implementation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import sn.dev.movie_service.services.MovieService;
import sn.dev.movie_service.web.controllers.MovieController;
import sn.dev.movie_service.web.dto.requests.MovieCreateRequest;
import sn.dev.movie_service.web.dto.responses.MovieResponse;
import sn.dev.movie_service.web.mappers.MovieMapper;

@RestController
public class MovieControllerImpl implements MovieController {

    private final MovieService movieService;

    public MovieControllerImpl(MovieService movieService) {
        this.movieService = movieService;
    }

    @Override
    public ResponseEntity<List<MovieResponse>> getAllMovies() {
        List<MovieResponse> responses = movieService.getAllMovies()
            .stream()
            .map(MovieMapper::toResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @Override
    public ResponseEntity<MovieResponse> getMovieById(String id) {
        var movie = movieService.getMovieById(id);
        if (movie == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(MovieMapper.toResponse(movie));
    }

    @Override
    public ResponseEntity<MovieResponse> createMovie(MovieCreateRequest request) {
        var movie = MovieMapper.fromCreateRequest(request);
        var saved = movieService.createMovie(movie);
        return ResponseEntity.ok(MovieMapper.toResponse(saved));
    }

     @Override
    public ResponseEntity<List<MovieResponse>> getCollaborativeRecs(Object principal) {
        String userId = ((Jwt) principal).getClaimAsString("sub");
        List<MovieResponse> responses = movieService.getCollaborativeRecs(userId)
            .stream()
            .map(MovieMapper::toResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @Override
    public ResponseEntity<List<MovieResponse>> getGenreBasedRecs(Object principal) {
        String userId = ((Jwt) principal).getClaimAsString("sub");
        List<MovieResponse> responses = movieService.getGenreBasedRecs(userId)
            .stream()
            .map(MovieMapper::toResponse)
            .toList();
        return ResponseEntity.ok(responses);
    }
}