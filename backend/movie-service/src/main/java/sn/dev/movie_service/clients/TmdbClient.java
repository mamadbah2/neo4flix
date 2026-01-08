package sn.dev.movie_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import sn.dev.movie_service.config.TmdbFeignConfig;
import sn.dev.movie_service.web.dto.tmdb.TmdbCreditsResponse;
import sn.dev.movie_service.web.dto.tmdb.TmdbGenreListResponse;
import sn.dev.movie_service.web.dto.tmdb.TmdbMovieDto;
import sn.dev.movie_service.web.dto.tmdb.TmdbPageResponse;
import sn.dev.movie_service.web.dto.tmdb.TmdbReviewsResponse;
import sn.dev.movie_service.web.dto.tmdb.TmdbVideosResponse;

/**
 * Client Feign pour l'API TMDb.
 * Source de vérité pour les informations de films.
 */
@FeignClient(
    name = "tmdb-client",
    url = "${tmdb.api.base-url}",
    configuration = TmdbFeignConfig.class
)
public interface TmdbClient {

    /**
     * Récupère les films tendances de la semaine.
     */
    @GetMapping("/trending/movie/week")
    TmdbPageResponse<TmdbMovieDto> getTrendingMovies(
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Récupère les films les mieux notés (Classiques).
     */
    @GetMapping("/movie/top_rated")
    TmdbPageResponse<TmdbMovieDto> getTopRatedMovies(
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Récupère les films actuellement à l'affiche (Latest).
     */
    @GetMapping("/movie/now_playing")
    TmdbPageResponse<TmdbMovieDto> getNowPlayingMovies(
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Récupère les détails complets d'un film par son ID TMDb.
     */
    @GetMapping("/movie/{movieId}")
    TmdbMovieDto getMovieDetails(
        @PathVariable("movieId") Long movieId,
        @RequestParam(defaultValue = "fr-FR") String language
    );

    /**
     * Recherche de films par requête textuelle.
     */
    @GetMapping("/search/movie")
    TmdbPageResponse<TmdbMovieDto> searchMovies(
        @RequestParam String query,
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Découverte de films par genre.
     * Permet de filtrer les films par ID de genre TMDb.
     */
    @GetMapping("/discover/movie")
    TmdbPageResponse<TmdbMovieDto> discoverMoviesByGenre(
        @RequestParam("with_genres") Integer genreId,
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(value = "sort_by", defaultValue = "popularity.desc") String sortBy
    );

    /**
     * Récupère les films à venir (prochaines sorties).
     */
    @GetMapping("/movie/upcoming")
    TmdbPageResponse<TmdbMovieDto> getUpcomingMovies(
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Récupère les films les plus populaires.
     */
    @GetMapping("/movie/popular")
    TmdbPageResponse<TmdbMovieDto> getPopularMovies(
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );

    /**
     * Récupère les vidéos (bande-annonces, teasers) d'un film.
     */
    @GetMapping("/movie/{movieId}/videos")
    TmdbVideosResponse getMovieVideos(
        @PathVariable("movieId") Long movieId,
        @RequestParam(defaultValue = "fr-FR") String language
    );

    /**
     * Récupère la liste de tous les genres de films.
     */
    @GetMapping("/genre/movie/list")
    TmdbGenreListResponse getGenreList(
        @RequestParam(defaultValue = "fr-FR") String language
    );

    /**
     * Récupère les crédits (casting) d'un film.
     */
    @GetMapping("/movie/{movieId}/credits")
    TmdbCreditsResponse getMovieCredits(
        @PathVariable("movieId") Long movieId,
        @RequestParam(defaultValue = "fr-FR") String language
    );

    /**
     * Récupère les avis (reviews) d'un film.
     */
    @GetMapping("/movie/{movieId}/reviews")
    TmdbReviewsResponse getMovieReviews(
        @PathVariable("movieId") Long movieId,
        @RequestParam(defaultValue = "fr-FR") String language,
        @RequestParam(defaultValue = "1") Integer page
    );
}
