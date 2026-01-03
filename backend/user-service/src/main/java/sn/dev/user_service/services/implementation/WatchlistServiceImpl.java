package sn.dev.user_service.services.implementation;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sn.dev.user_service.clients.InternalMovieClient;
import sn.dev.user_service.data.entities.Movie;
import sn.dev.user_service.data.repositories.WatchlistRepository;
import sn.dev.user_service.services.WatchlistService;

/**
 * Implémentation du service Watchlist.
 * Synchronise les films avec movie-service avant de créer les relations.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class WatchlistServiceImpl implements WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final InternalMovieClient internalMovieClient;

    @Override
    @Transactional(readOnly = true)
    public List<Movie> getWatchlist(String userId) {
        return watchlistRepository.findWatchlistByUserId(userId);
    }

    @Override
    public void addToWatchlist(String userId, Long tmdbId) {
        // 1. Synchroniser le film avec movie-service (crée le nœud si nécessaire)
        try {
            var syncResponse = internalMovieClient.syncMovie(tmdbId);
            log.info("Film {} synchronisé: {}", tmdbId, syncResponse.getMessage());
        } catch (Exception e) {
            log.warn("Impossible de synchroniser le film {}: {}", tmdbId, e.getMessage());
            // On continue quand même - le nœud sera créé par le MERGE
        }
        
        // 2. Ajouter à la watchlist
        watchlistRepository.addToWatchlist(userId, tmdbId);
    }

    @Override
    public void removeFromWatchlist(String userId, Long tmdbId) {
        watchlistRepository.removeFromWatchlist(userId, tmdbId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isInWatchlist(String userId, Long tmdbId) {
        return watchlistRepository.existsInWatchlist(userId, tmdbId);
    }
}
