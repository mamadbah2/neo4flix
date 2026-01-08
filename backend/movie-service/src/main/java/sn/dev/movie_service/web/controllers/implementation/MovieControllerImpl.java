package sn.dev.movie_service.web.controllers.implementation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.dev.movie_service.services.MovieService;
import sn.dev.movie_service.web.controllers.MovieController;
import sn.dev.movie_service.web.dto.responses.GenreResponse;
import sn.dev.movie_service.web.dto.responses.MoviePageResponse;
import sn.dev.movie_service.web.dto.responses.MovieResponse;
import sn.dev.movie_service.web.dto.responses.ReviewPageResponse;
import sn.dev.movie_service.web.dto.responses.SyncResponse;

/**
 * Implémentation du contrôleur Movie.
 */
@RestController
@RequiredArgsConstructor
public class MovieControllerImpl implements MovieController {

    private final MovieService movieService;

    // ================== DISCOVERY ENDPOINTS ==================

    @Override
    public ResponseEntity<MoviePageResponse> getTrendingMovies(String language, Integer page) {
        MoviePageResponse response = movieService.getTrendingMovies(language, page);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<MoviePageResponse> getTopRatedMovies(String language, Integer page) {
        MoviePageResponse response = movieService.getTopRatedMovies(language, page);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<MoviePageResponse> getNowPlayingMovies(String language, Integer page) {
        MoviePageResponse response = movieService.getNowPlayingMovies(language, page);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<MoviePageResponse> getUpcomingMovies(String language, Integer page) {
        MoviePageResponse response = movieService.getUpcomingMovies(language, page);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<MoviePageResponse> getPopularMovies(String language, Integer page) {
        MoviePageResponse response = movieService.getPopularMovies(language, page);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<MoviePageResponse> getMoviesByGenre(Integer genreId, String language, Integer page) {
        MoviePageResponse response = movieService.getMoviesByGenre(genreId, language, page);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<List<GenreResponse>> getAllGenres(String language) {
        List<GenreResponse> genres = movieService.getAllGenres(language);
        return ResponseEntity.ok(genres);
    }

    @Override
    public ResponseEntity<MoviePageResponse> searchMovies(String query, String language, Integer page) {
        MoviePageResponse response = movieService.searchMovies(query, language, page);
        return ResponseEntity.ok(response);
    }

    // ================== SINGLE MOVIE ==================

    @Override
    public ResponseEntity<MovieResponse> getMovieDetails(Long tmdbId, String language) {
        MovieResponse response = movieService.getMovieDetails(tmdbId, language);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<ReviewPageResponse> getMovieReviews(Long tmdbId, String language, Integer page, Integer size) {
        ReviewPageResponse response = movieService.getMovieReviews(tmdbId, language, page, size);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<MoviePageResponse> getSimilarMovies(Long tmdbId, String language, Integer page) {
        MoviePageResponse response = movieService.getSimilarMovies(tmdbId, language, page);
        return ResponseEntity.ok(response);
    }

    // ================== SYNC ENDPOINT ==================

    @Override
    public ResponseEntity<SyncResponse> syncMovie(Long tmdbId) {
        SyncResponse response = movieService.syncMovie(tmdbId);
        return ResponseEntity.ok(response);
    }

    // ================== RECOMMENDATIONS ==================

    @Override
    public ResponseEntity<List<MovieResponse>> getCollaborativeRecs(Object principal, String language) {
        String userId = ((Jwt) principal).getClaimAsString("sub");
        List<MovieResponse> recommendations = movieService.getCollaborativeRecs(userId, language);
        return ResponseEntity.ok(recommendations);
    }

    @Override
    public ResponseEntity<List<MovieResponse>> getGenreBasedRecs(Object principal, String language) {
        String userId = ((Jwt) principal).getClaimAsString("sub");
        List<MovieResponse> recommendations = movieService.getGenreBasedRecs(userId, language);
        return ResponseEntity.ok(recommendations);
    }

    // ================== BATCH ==================

    @Override
    public ResponseEntity<List<MovieResponse>> getBatchMovies(
            sn.dev.movie_service.web.dto.requests.BatchMovieRequest request,
            String language,
            Boolean detailed) {
        // Use language from request body if provided, else from query param
        String lang = (request.getLanguage() != null && !request.getLanguage().isBlank()) 
                ? request.getLanguage() 
                : language;
        List<MovieResponse> movies = movieService.getBatchMovies(request.getTmdbIds(), lang, detailed);
        return ResponseEntity.ok(movies);
    }
}