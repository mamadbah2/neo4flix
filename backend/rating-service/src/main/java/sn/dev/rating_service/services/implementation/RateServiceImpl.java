package sn.dev.rating_service.services.implementation;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sn.dev.rating_service.clients.InternalMovieClient;
import sn.dev.rating_service.data.entities.Rate;
import sn.dev.rating_service.data.repositories.RateRepository;
import sn.dev.rating_service.services.RateService;
import sn.dev.rating_service.web.dto.responses.MovieRatingResponse;
import sn.dev.rating_service.web.dto.responses.MovieRatingsPageResponse;

/**
 * Implémentation du service de notation.
 * Synchronise les films avec movie-service avant de créer les relations RATED.
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class RateServiceImpl implements RateService {

    private final RateRepository rateRepository;
    private final InternalMovieClient internalMovieClient;
    private final Neo4jClient neo4jClient;

    @Override
    public Rate createRate(String userId, Long tmdbId, int score, String comment) {
        // 1. Synchroniser le film avec movie-service
        try {
            var syncResponse = internalMovieClient.syncMovie(tmdbId);
            log.info("Film {} synchronisé: {}", tmdbId, syncResponse.getMessage());
        } catch (Exception e) {
            log.warn("Impossible de synchroniser le film {}: {}", tmdbId, e.getMessage());
        }
        
        // 2. Créer la notation avec date
        String createdAt = java.time.Instant.now().toString();
        log.debug("Création de la notation pour userId: {}, tmdbId: {}, score: {}, comment: {}", userId, tmdbId, score, comment);
        rateRepository.createRate(userId, tmdbId, score, comment, createdAt);
        
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getRating(String userId, Long tmdbId) {
        return rateRepository.findRating(userId, tmdbId);
    }

    @Override
    public void deleteRate(String userId, Long tmdbId) {
        rateRepository.deleteRate(userId, tmdbId);
    }

    @Override
    @Transactional(readOnly = true)
    public MovieRatingsPageResponse getMovieRatings(Long tmdbId, int page, int size) {
        int skip = (page - 1) * size;
        
        // 1. Récupérer les ratings paginés via Neo4jClient
        String cypherQuery = "MATCH (u:User)-[r:RATED]->(m:Movie {tmdbId: $tmdbId}) " +
                "RETURN r.score as score, r.comment as comment, r.createdAt as createdAt " +
                "ORDER BY r.createdAt DESC " +
                "SKIP $skip LIMIT $limit";
        
        Collection<Map<String, Object>> ratingsData = neo4jClient.query(cypherQuery)
                .bind(tmdbId).to("tmdbId")
                .bind(skip).to("skip")
                .bind(size).to("limit")
                .fetch()
                .all();
        
        // 2. Mapper les résultats
        List<MovieRatingResponse> ratings = new ArrayList<>();
        for (var data : ratingsData) {
            Object scoreObj = data.get("score");
            Long scoreValue = scoreObj instanceof Long ? (Long) scoreObj : 
                    (scoreObj instanceof Integer ? ((Integer) scoreObj).longValue() : null);
            String comment = (String) data.get("comment");
            String createdAt = (String) data.get("createdAt");
            
            ratings.add(MovieRatingResponse.builder()
                    .score(scoreValue != null ? scoreValue.intValue() : 0)
                    .comment(comment)
                    .createdAt(createdAt)
                    .build());
        }
        
        // 3. Récupérer les stats
        Integer totalResults = rateRepository.countRatingsByMovie(tmdbId);
        Double averageScore = rateRepository.getAverageScoreByMovie(tmdbId);
        
        int total = totalResults != null ? totalResults : 0;
        int totalPages = (int) Math.ceil((double) total / size);
        
        return MovieRatingsPageResponse.builder()
                .tmdbId(tmdbId)
                .page(page)
                .totalPages(totalPages)
                .totalResults(total)
                .averageScore(averageScore)
                .ratings(ratings)
                .build();
    }
}
