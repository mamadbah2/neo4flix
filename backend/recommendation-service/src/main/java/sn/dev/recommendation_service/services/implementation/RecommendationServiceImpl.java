package sn.dev.recommendation_service.services.implementation;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sn.dev.recommendation_service.clients.MovieClient;
import sn.dev.recommendation_service.data.entities.Movie;
import sn.dev.recommendation_service.data.repositories.ShareRepository;
import sn.dev.recommendation_service.services.RecommendationService;
import sn.dev.recommendation_service.web.dto.responses.MovieResponse;

/**
 * Implémentation du service de recommandations.
 * Combine les recommandations TMDb avec le boost social (films partagés par amis).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecommendationServiceImpl implements RecommendationService {

    private final MovieClient movieClient;
    private final ShareRepository shareRepository;

    @Override
    public List<MovieResponse> getRecommendations(String userId) {
        // 1. Récupérer les films partagés par des amis (PRIORITÉ MAXIMALE - Boost Social)
        List<Movie> sharedMovies = shareRepository.findSharedMoviesForUser(userId);
        Set<Long> sharedMovieIds = new LinkedHashSet<>();
        List<MovieResponse> boostedMovies = new ArrayList<>();
        
        for (Movie movie : sharedMovies) {
            sharedMovieIds.add(movie.getTmdbId());
            boostedMovies.add(toMovieResponse(movie));
        }

        // 2. Récupérer les recommandations classiques (collaborative + genre-based)
        List<MovieResponse> collaborative = movieClient.getCollaborativeRecs().getBody();
        List<MovieResponse> genreBased = movieClient.getGenreBasedRecs().getBody();

        // 3. Fusionner en évitant les doublons et en gardant les films partagés en tête
        LinkedHashSet<MovieResponse> combined = new LinkedHashSet<>(boostedMovies);
        
        // Mélanger les recommandations classiques (en excluant celles déjà partagées)
        int maxSize = Math.max(
            collaborative != null ? collaborative.size() : 0, 
            genreBased != null ? genreBased.size() : 0
        );
        
        for (int i = 0; i < maxSize; i++) {
            if (collaborative != null && i < collaborative.size()) {
                MovieResponse movie = collaborative.get(i);
                if (!sharedMovieIds.contains(movie.getTmdbId())) {
                    combined.add(movie);
                }
            }
            if (genreBased != null && i < genreBased.size()) {
                MovieResponse movie = genreBased.get(i);
                if (!sharedMovieIds.contains(movie.getTmdbId())) {
                    combined.add(movie);
                }
            }
        }
        
        // Retourner la liste finale (max 10 éléments)
        return combined.stream().limit(10).toList();
    }

    @Override
    public List<MovieResponse> getSharedRecommendations(String userId) {
        List<Movie> sharedMovies = shareRepository.findSharedMoviesForUser(userId);
        return sharedMovies.stream()
                .map(this::toMovieResponse)
                .toList();
    }

    private MovieResponse toMovieResponse(Movie movie) {
        return MovieResponse.builder()
            .tmdbId(movie.getTmdbId())
            .title(movie.getTitle())
            .posterPath(movie.getPosterPath())
            .build();
    }
}
