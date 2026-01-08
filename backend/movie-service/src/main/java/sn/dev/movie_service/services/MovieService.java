package sn.dev.movie_service.services;

import java.util.List;

import sn.dev.movie_service.web.dto.responses.GenreResponse;
import sn.dev.movie_service.web.dto.responses.MoviePageResponse;
import sn.dev.movie_service.web.dto.responses.MovieResponse;
import sn.dev.movie_service.web.dto.responses.ReviewPageResponse;
import sn.dev.movie_service.web.dto.responses.SyncResponse;

/**
 * Service pour la gestion des films.
 * Utilise TMDb comme source de vérité et Neo4j pour les relations.
 */
public interface MovieService {

    // ================== DISCOVERY (TMDb Direct) ==================
    
    /**
     * Récupère les films tendances de la semaine depuis TMDb.
     */
    MoviePageResponse getTrendingMovies(String language, Integer page);
    
    /**
     * Récupère les films les mieux notés (Classiques) depuis TMDb.
     */
    MoviePageResponse getTopRatedMovies(String language, Integer page);
    
    /**
     * Récupère les films actuellement à l'affiche depuis TMDb.
     */
    MoviePageResponse getNowPlayingMovies(String language, Integer page);
    
    /**
     * Récupère les films à venir (prochaines sorties) depuis TMDb.
     */
    MoviePageResponse getUpcomingMovies(String language, Integer page);
    
    /**
     * Récupère les films les plus populaires depuis TMDb.
     */
    MoviePageResponse getPopularMovies(String language, Integer page);
    
    /**
     * Récupère les films par genre depuis TMDb.
     * @param genreId l'ID TMDb du genre
     */
    MoviePageResponse getMoviesByGenre(Integer genreId, String language, Integer page);
    
    /**
     * Récupère la liste de tous les genres disponibles.
     */
    List<GenreResponse> getAllGenres(String language);
    
    /**
     * Recherche de films par requête textuelle sur TMDb.
     */
    MoviePageResponse searchMovies(String query, String language, Integer page);

    // ================== SINGLE MOVIE ==================
    
    /**
     * Récupère les détails d'un film.
     * Combine les données TMDb (détails complets) avec l'état Neo4j (relations).
     */
    MovieResponse getMovieDetails(Long tmdbId, String language);
    
    /**
     * Récupère les avis sur un film avec pagination.
     * Combine les avis locaux (Neo4j) prioritaires et les avis TMDb.
     * 
     * @param tmdbId l'ID TMDb du film
     * @param language la langue
     * @param page le numéro de page
     * @param size le nombre d'avis par page
     */
    ReviewPageResponse getMovieReviews(Long tmdbId, String language, Integer page, Integer size);

    // ================== SYNCHRONISATION LAZY ==================
    
    /**
     * Synchronise un film dans Neo4j.
     * Utilise MERGE Cypher pour créer/mettre à jour le nœud Movie et ses relations IN_GENRE.
     * Appelé par les autres services (user-service, rating-service) avant de créer des relations.
     * 
     * @param tmdbId l'ID TMDb du film
     * @return les informations de synchronisation
     */
    SyncResponse syncMovie(Long tmdbId);

    // ================== RECOMMANDATIONS ==================
    
    /**
     * Récupère les IDs TMDb des films recommandés par filtrage collaboratif.
     */
    List<MovieResponse> getCollaborativeRecs(String userId, String language);
    
    /**
     * Récupère les IDs TMDb des films recommandés par genres.
     */
    List<MovieResponse> getGenreBasedRecs(String userId, String language);

    /**
     * Récupère les films similaires à un film donné.
     * 
     * @param tmdbId l'ID TMDb du film
     * @param language la langue
     * @param page le numéro de page
     */
    MoviePageResponse getSimilarMovies(Long tmdbId, String language, Integer page);

    // ================== BATCH ==================
    
    /**
     * Récupère les détails de plusieurs films en une seule requête.
     * 
     * @param tmdbIds la liste des IDs TMDb
     * @param language la langue
     * @param detailed si true, inclut le casting et les notes locales
     */
    List<MovieResponse> getBatchMovies(List<Long> tmdbIds, String language, Boolean detailed);
}
