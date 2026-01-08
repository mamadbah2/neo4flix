package sn.dev.movie_service.web.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import sn.dev.movie_service.web.dto.responses.GenreResponse;
import sn.dev.movie_service.web.dto.responses.MoviePageResponse;
import sn.dev.movie_service.web.dto.responses.MovieResponse;
import sn.dev.movie_service.web.dto.responses.ReviewPageResponse;
import sn.dev.movie_service.web.dto.responses.SyncResponse;
import sn.dev.movie_service.web.dto.requests.BatchMovieRequest;

/**
 * Contrôleur REST pour les films.
 * Expose les endpoints de discovery (TMDb) et de synchronisation (Neo4j).
 */
@RequestMapping("/api/movies")
public interface MovieController {

    // ================== DISCOVERY ENDPOINTS (TMDb Direct) ==================

    /**
     * Films tendances de la semaine.
     * Source: TMDb - Pas de stockage Neo4j.
     */
    @GetMapping("/discovery/trending")
    ResponseEntity<MoviePageResponse> getTrendingMovies(
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Films les mieux notés (Classiques).
     * Source: TMDb - Pas de stockage Neo4j.
     */
    @GetMapping("/discovery/top-rated")
    ResponseEntity<MoviePageResponse> getTopRatedMovies(
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Films actuellement à l'affiche.
     * Source: TMDb - Pas de stockage Neo4j.
     */
    @GetMapping("/discovery/now-playing")
    ResponseEntity<MoviePageResponse> getNowPlayingMovies(
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Films à venir (prochaines sorties).
     * Source: TMDb - Pas de stockage Neo4j.
     */
    @GetMapping("/discovery/upcoming")
    ResponseEntity<MoviePageResponse> getUpcomingMovies(
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Films les plus populaires.
     * Source: TMDb - Pas de stockage Neo4j.
     */
    @GetMapping("/discovery/popular")
    ResponseEntity<MoviePageResponse> getPopularMovies(
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Films par genre.
     * Source: TMDb - Pas de stockage Neo4j.
     */
    @GetMapping("/discovery/by-genre/{genreId}")
    ResponseEntity<MoviePageResponse> getMoviesByGenre(
        @PathVariable Integer genreId,
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Liste de tous les genres disponibles.
     * Source: TMDb.
     */
    @GetMapping("/genres")
    ResponseEntity<List<GenreResponse>> getAllGenres(
        @RequestParam(defaultValue = "fr-FR") String language
    );

    /**
     * Recherche de films.
     * Source: TMDb - Pas de stockage Neo4j.
     */
    @GetMapping("/search")
    ResponseEntity<MoviePageResponse> searchMovies(
        @RequestParam String query,
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    // ================== SINGLE MOVIE ==================

    /**
     * Détails d'un film par son ID TMDb.
     * Combine les données TMDb avec l'état Neo4j.
     */
    @GetMapping("/{tmdbId}")
    ResponseEntity<MovieResponse> getMovieDetails(
        @PathVariable Long tmdbId,
        @RequestParam(defaultValue = "fr-FR") String language
    );

    /**
     * Avis sur un film avec pagination.
     * Combine les avis locaux (Neo4j) prioritaires et les avis TMDb.
     */
    @GetMapping("/{tmdbId}/reviews")
    ResponseEntity<ReviewPageResponse> getMovieReviews(
        @PathVariable Long tmdbId,
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "5") Integer size
    );

    /**
     * Films similaires à un film donné.
     * Source: TMDb - Pas de stockage Neo4j.
     */
    @GetMapping("/{tmdbId}/similar")
    ResponseEntity<MoviePageResponse> getSimilarMovies(
        @PathVariable Long tmdbId,
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    // ================== SYNC ENDPOINT (Internal) ==================

    /**
     * Synchronise un film dans Neo4j.
     * Appelé par les autres services avant de créer des relations.
     */
    @PostMapping("/{tmdbId}/sync")
    ResponseEntity<SyncResponse> syncMovie(@PathVariable Long tmdbId);

    // ================== RECOMMENDATIONS ==================

    /**
     * Recommandations collaboratives pour l'utilisateur authentifié.
     */
    @GetMapping("/recommendations/collaborative")
    ResponseEntity<List<MovieResponse>> getCollaborativeRecs(
        @AuthenticationPrincipal Object principal,
        @RequestParam(defaultValue = "fr-FR") String language
    );

    /**
     * Recommandations basées sur les genres préférés.
     */
    @GetMapping("/recommendations/genre-based")
    ResponseEntity<List<MovieResponse>> getGenreBasedRecs(
        @AuthenticationPrincipal Object principal,
        @RequestParam(defaultValue = "fr-FR") String language
    );

    // ================== BATCH ENDPOINT ==================

    /**
     * Récupère les détails de plusieurs films en une seule requête.
     * Version légère pour enrichir les watchlists.
     */
    @PostMapping("/batch")
    ResponseEntity<List<MovieResponse>> getBatchMovies(
        @RequestBody BatchMovieRequest request,
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "false") Boolean detailed
    );
}
