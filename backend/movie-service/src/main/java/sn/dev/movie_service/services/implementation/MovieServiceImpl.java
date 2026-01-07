package sn.dev.movie_service.services.implementation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sn.dev.movie_service.clients.TmdbClient;
import sn.dev.movie_service.data.repositories.MovieRepository;
import sn.dev.movie_service.exceptions.MovieNotFoundException;
import sn.dev.movie_service.exceptions.TmdbApiException;
import sn.dev.movie_service.services.MovieService;
import sn.dev.movie_service.services.TmdbGenreMapping;
import sn.dev.movie_service.web.dto.responses.GenreResponse;
import sn.dev.movie_service.web.dto.responses.MoviePageResponse;
import sn.dev.movie_service.web.dto.responses.MovieResponse;
import sn.dev.movie_service.web.dto.responses.SyncResponse;
import sn.dev.movie_service.web.dto.tmdb.TmdbGenreDto;
import sn.dev.movie_service.web.dto.tmdb.TmdbGenreListResponse;
import sn.dev.movie_service.web.dto.tmdb.TmdbMovieDto;
import sn.dev.movie_service.web.dto.tmdb.TmdbPageResponse;
import sn.dev.movie_service.web.dto.tmdb.TmdbVideoDto;
import sn.dev.movie_service.web.dto.tmdb.TmdbVideosResponse;

/**
 * Implémentation du service Movie.
 * TMDb = source de vérité, Neo4j = stockage des relations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MovieServiceImpl implements MovieService {

    private final TmdbClient tmdbClient;
    private final MovieRepository movieRepository;

    // ================== DISCOVERY (TMDb Direct) ==================

    @Override
    @Transactional(readOnly = true)
    public MoviePageResponse getTrendingMovies(String language, Integer page) {
        try {
            TmdbPageResponse<TmdbMovieDto> response = tmdbClient.getTrendingMovies(language, page);
            return mapToPageResponse(response);
        } catch (FeignException e) {
            throw new TmdbApiException("Impossible de récupérer les films tendances", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public MoviePageResponse getTopRatedMovies(String language, Integer page) {
        try {
            TmdbPageResponse<TmdbMovieDto> response = tmdbClient.getTopRatedMovies(language, page);
            return mapToPageResponse(response);
        } catch (FeignException e) {
            throw new TmdbApiException("Impossible de récupérer les films les mieux notés", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public MoviePageResponse getNowPlayingMovies(String language, Integer page) {
        try {
            TmdbPageResponse<TmdbMovieDto> response = tmdbClient.getNowPlayingMovies(language, page);
            return mapToPageResponse(response);
        } catch (FeignException e) {
            throw new TmdbApiException("Impossible de récupérer les films à l'affiche", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public MoviePageResponse getUpcomingMovies(String language, Integer page) {
        try {
            TmdbPageResponse<TmdbMovieDto> response = tmdbClient.getUpcomingMovies(language, page);
            return mapToPageResponse(response);
        } catch (FeignException e) {
            throw new TmdbApiException("Impossible de récupérer les films à venir", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public MoviePageResponse getPopularMovies(String language, Integer page) {
        try {
            TmdbPageResponse<TmdbMovieDto> response = tmdbClient.getPopularMovies(language, page);
            return mapToPageResponse(response);
        } catch (FeignException e) {
            throw new TmdbApiException("Impossible de récupérer les films populaires", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public MoviePageResponse getMoviesByGenre(Integer genreId, String language, Integer page) {
        try {
            TmdbPageResponse<TmdbMovieDto> response = tmdbClient.discoverMoviesByGenre(genreId, language, page, "popularity.desc");
            return mapToPageResponse(response);
        } catch (FeignException e) {
            throw new TmdbApiException("Impossible de récupérer les films par genre", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<GenreResponse> getAllGenres(String language) {
        try {
            TmdbGenreListResponse response = tmdbClient.getGenreList(language);
            return response.getGenres().stream()
                    .map(g -> GenreResponse.builder()
                            .id(g.getId())
                            .name(g.getName())
                            .build())
                    .toList();
        } catch (FeignException e) {
            throw new TmdbApiException("Impossible de récupérer la liste des genres", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public MoviePageResponse searchMovies(String query, String language, Integer page) {
        try {
            TmdbPageResponse<TmdbMovieDto> response = tmdbClient.searchMovies(query, language, page);
            return mapToPageResponse(response);
        } catch (FeignException e) {
            throw new TmdbApiException("Impossible de rechercher les films", e);
        }
    }

    // ================== SINGLE MOVIE ==================

    @Override
    @Transactional(readOnly = true)
    public MovieResponse getMovieDetails(Long tmdbId, String language) {
        try {
            // 1. Récupérer les détails depuis TMDb
            TmdbMovieDto tmdbMovie = tmdbClient.getMovieDetails(tmdbId, language);
            
            // 2. Récupérer les vidéos (bande-annonces)
            String trailerUrl = fetchTrailerUrl(tmdbId, language);
            
            // 3. Vérifier si le film existe dans Neo4j
            boolean existsInNeo4j = movieRepository.existsByTmdbId(tmdbId);
            
            // 4. Mapper vers la réponse enrichie
            return mapToDetailedResponse(tmdbMovie, existsInNeo4j, trailerUrl);
            
        } catch (FeignException.NotFound e) {
            throw new MovieNotFoundException(tmdbId);
        } catch (FeignException e) {
            throw new TmdbApiException("Impossible de récupérer les détails du film " + tmdbId, e);
        }
    }

    // ================== SYNCHRONISATION LAZY ==================

    @Override
    public SyncResponse syncMovie(Long tmdbId) {
        log.info("Synchronisation du film TMDb ID: {}", tmdbId);
        
        // Vérifier si déjà synchronisé
        boolean alreadyExists = movieRepository.existsByTmdbId(tmdbId);
        
        if (alreadyExists) {
            log.debug("Film {} déjà présent dans Neo4j", tmdbId);
            return SyncResponse.builder()
                    .tmdbId(tmdbId)
                    .created(false)
                    .message("Film déjà synchronisé")
                    .build();
        }
        
        try {
            // Récupérer les infos depuis TMDb
            TmdbMovieDto tmdbMovie = tmdbClient.getMovieDetails(tmdbId, "fr-FR");
            
            // MERGE le film dans Neo4j
            movieRepository.mergeMovie(
                    tmdbId,
                    tmdbMovie.getTitle(),
                    tmdbMovie.getPosterPath()
            );
            
            // MERGE les genres et leurs relations
            if (tmdbMovie.getGenres() != null) {
                for (TmdbGenreDto genre : tmdbMovie.getGenres()) {
                    movieRepository.mergeGenreRelation(
                            tmdbId,
                            genre.getId(),
                            genre.getName()
                    );
                }
            }
            
            log.info("Film {} synchronisé avec succès", tmdbId);
            
            return SyncResponse.builder()
                    .tmdbId(tmdbId)
                    .title(tmdbMovie.getTitle())
                    .created(true)
                    .message("Film synchronisé avec succès")
                    .build();
                    
        } catch (FeignException.NotFound e) {
            throw new MovieNotFoundException(tmdbId);
        } catch (FeignException e) {
            throw new TmdbApiException("Impossible de synchroniser le film " + tmdbId, e);
        }
    }

    // ================== RECOMMANDATIONS ==================

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getCollaborativeRecs(String userId, String language) {
        List<Long> tmdbIds = movieRepository.getCollaborativeRecsTmdbIds(userId);
        return fetchMoviesFromTmdb(tmdbIds, language);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieResponse> getGenreBasedRecs(String userId, String language) {
        List<Long> tmdbIds = movieRepository.getGenreBasedRecsTmdbIds(userId);
        return fetchMoviesFromTmdb(tmdbIds, language);
    }

    // ================== HELPERS ==================

    /**
     * Mappe une réponse paginée TMDb vers notre DTO.
     */
    private MoviePageResponse mapToPageResponse(TmdbPageResponse<TmdbMovieDto> tmdbResponse) {
        List<MovieResponse> movies = tmdbResponse.getResults().stream()
                .map(this::mapToSimpleResponse)
                .toList();
        
        return MoviePageResponse.builder()
                .page(tmdbResponse.getPage())
                .totalPages(tmdbResponse.getTotalPages())
                .totalResults(tmdbResponse.getTotalResults())
                .results(movies)
                .build();
    }

    /**
     * Mappe un film TMDb vers une réponse simple (liste).
     */
    private MovieResponse mapToSimpleResponse(TmdbMovieDto tmdbMovie) {
        List<String> genreNames = new ArrayList<>();
        if (tmdbMovie.getGenreIds() != null) {
            genreNames = tmdbMovie.getGenreIds().stream()
                    .map(TmdbGenreMapping::getGenreName)
                    .toList();
        }
        
        return MovieResponse.builder()
                .tmdbId(tmdbMovie.getId())
                .title(tmdbMovie.getTitle())
                .originalTitle(tmdbMovie.getOriginalTitle())
                .overview(tmdbMovie.getOverview())
                .posterPath(tmdbMovie.getPosterPath())
                .backdropPath(tmdbMovie.getBackdropPath())
                .releaseDate(tmdbMovie.getReleaseDate())
                .voteAverage(tmdbMovie.getVoteAverage())
                .voteCount(tmdbMovie.getVoteCount())
                .popularity(tmdbMovie.getPopularity())
                .genres(genreNames)
                .build();
    }

    /**
     * Mappe un film TMDb détaillé vers une réponse complète.
     */
    private MovieResponse mapToDetailedResponse(TmdbMovieDto tmdbMovie, boolean syncedInNeo4j, String trailerUrl) {
        List<String> genreNames = new ArrayList<>();
        if (tmdbMovie.getGenres() != null) {
            genreNames = tmdbMovie.getGenres().stream()
                    .map(TmdbGenreDto::getName)
                    .toList();
        } else if (tmdbMovie.getGenreIds() != null) {
            genreNames = tmdbMovie.getGenreIds().stream()
                    .map(TmdbGenreMapping::getGenreName)
                    .toList();
        }
        
        return MovieResponse.builder()
                .tmdbId(tmdbMovie.getId())
                .title(tmdbMovie.getTitle())
                .originalTitle(tmdbMovie.getOriginalTitle())
                .overview(tmdbMovie.getOverview())
                .posterPath(tmdbMovie.getPosterPath())
                .backdropPath(tmdbMovie.getBackdropPath())
                .releaseDate(tmdbMovie.getReleaseDate())
                .voteAverage(tmdbMovie.getVoteAverage())
                .voteCount(tmdbMovie.getVoteCount())
                .popularity(tmdbMovie.getPopularity())
                .genres(genreNames)
                .runtime(tmdbMovie.getRuntime())
                .tagline(tmdbMovie.getTagline())
                .trailerUrl(trailerUrl)
                .syncedInNeo4j(syncedInNeo4j)
                .build();
    }

    /**
     * Récupère l'URL de la bande-annonce YouTube d'un film.
     */
    private String fetchTrailerUrl(Long tmdbId, String language) {
        try {
            // Essayer d'abord dans la langue demandée
            TmdbVideosResponse videosResponse = tmdbClient.getMovieVideos(tmdbId, language);
            String trailerUrl = extractYoutubeTrailerUrl(videosResponse);
            
            // Si pas de trailer dans la langue demandée, essayer en anglais
            if (trailerUrl == null && !"en-US".equals(language)) {
                videosResponse = tmdbClient.getMovieVideos(tmdbId, "en-US");
                trailerUrl = extractYoutubeTrailerUrl(videosResponse);
            }
            
            return trailerUrl;
        } catch (FeignException e) {
            log.warn("Impossible de récupérer les vidéos pour le film {}: {}", tmdbId, e.getMessage());
            return null;
        }
    }

    /**
     * Extrait l'URL YouTube de la bande-annonce officielle.
     */
    private String extractYoutubeTrailerUrl(TmdbVideosResponse videosResponse) {
        if (videosResponse == null || videosResponse.getResults() == null) {
            return null;
        }
        
        // Chercher d'abord une bande-annonce officielle
        return videosResponse.getResults().stream()
                .filter(v -> "YouTube".equalsIgnoreCase(v.getSite()))
                .filter(v -> "Trailer".equalsIgnoreCase(v.getType()))
                .filter(v -> Boolean.TRUE.equals(v.getOfficial()))
                .findFirst()
                .map(v -> "https://www.youtube.com/watch?v=" + v.getKey())
                // Sinon, prendre n'importe quel trailer YouTube
                .orElseGet(() -> videosResponse.getResults().stream()
                        .filter(v -> "YouTube".equalsIgnoreCase(v.getSite()))
                        .filter(v -> "Trailer".equalsIgnoreCase(v.getType()))
                        .findFirst()
                        .map(v -> "https://www.youtube.com/watch?v=" + v.getKey())
                        // Sinon, prendre un teaser
                        .orElseGet(() -> videosResponse.getResults().stream()
                                .filter(v -> "YouTube".equalsIgnoreCase(v.getSite()))
                                .filter(v -> "Teaser".equalsIgnoreCase(v.getType()))
                                .findFirst()
                                .map(v -> "https://www.youtube.com/watch?v=" + v.getKey())
                                .orElse(null)));
    }

    /**
     * Récupère les détails de plusieurs films depuis TMDb.
     */
    private List<MovieResponse> fetchMoviesFromTmdb(List<Long> tmdbIds, String language) {
        List<MovieResponse> movies = new ArrayList<>();
        
        for (Long tmdbId : tmdbIds) {
            try {
                TmdbMovieDto tmdbMovie = tmdbClient.getMovieDetails(tmdbId, language);
                String trailerUrl = fetchTrailerUrl(tmdbId, language);
                movies.add(mapToDetailedResponse(tmdbMovie, true, trailerUrl));
            } catch (FeignException e) {
                log.warn("Impossible de récupérer le film {} depuis TMDb: {}", tmdbId, e.getMessage());
            }
        }
        
        return movies;
    }
}
