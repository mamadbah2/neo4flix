package sn.dev.rating_service.services.implementation;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sn.dev.rating_service.clients.InternalMovieClient;
import sn.dev.rating_service.data.entities.Rate;
import sn.dev.rating_service.data.repositories.RateRepository;
import sn.dev.rating_service.services.RateService;

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

    @Override
    public Rate createRate(String userId, Long tmdbId, int score) {
        // 1. Synchroniser le film avec movie-service
        try {
            var syncResponse = internalMovieClient.syncMovie(tmdbId);
            log.info("Film {} synchronisé: {}", tmdbId, syncResponse.getMessage());
        } catch (Exception e) {
            log.warn("Impossible de synchroniser le film {}: {}", tmdbId, e.getMessage());
        }
        
        // 2. Créer la notation
        log.debug("Création de la notation pour userId: {}, tmdbId: {}, score: {}", userId, tmdbId, score);
        rateRepository.createRate(userId, tmdbId, score);
        
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
}
