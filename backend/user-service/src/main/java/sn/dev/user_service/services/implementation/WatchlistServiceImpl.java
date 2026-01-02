package sn.dev.user_service.services.implementation;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sn.dev.user_service.data.entities.Movie;
import sn.dev.user_service.data.repositories.WatchlistRepository;
import sn.dev.user_service.services.WatchlistService;

@Service
@Transactional
public class WatchlistServiceImpl implements WatchlistService {

    private final WatchlistRepository watchlistRepository;

    public WatchlistServiceImpl(WatchlistRepository watchlistRepository) {
        this.watchlistRepository = watchlistRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Movie> getWatchlist(String userId) {
        return watchlistRepository.findWatchlistByUserId(userId);
    }

    @Override
    public void addToWatchlist(String userId, String movieId) {
        watchlistRepository.addToWatchlist(userId, movieId);
    }

    @Override
    public void removeFromWatchlist(String userId, String movieId) {
        watchlistRepository.removeFromWatchlist(userId, movieId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isInWatchlist(String userId, String movieId) {
        return watchlistRepository.existsInWatchlist(userId, movieId);
    }
}
