package sn.dev.user_service.web.controllers.implementation;

import java.util.List;
import java.util.Objects;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.dev.user_service.services.WatchlistService;
import sn.dev.user_service.web.controllers.WatchlistController;
import sn.dev.user_service.web.dto.responses.MovieResponse;
import sn.dev.user_service.web.mappers.MovieMapper;

/**
 * Implémentation du contrôleur Watchlist.
 */
@RestController
@RequiredArgsConstructor
public class WatchlistControllerImpl implements WatchlistController {

    private final WatchlistService watchlistService;

    @Override
    public ResponseEntity<List<MovieResponse>> getWatchlist(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("sub");
        var movies = watchlistService.getWatchlist(userId);
        var response = movies.stream()
                .map(MovieMapper::toResponse)
                .filter(m -> m != null && m.getTmdbId() != null) // Filter out null tmdbIds
                .toList();
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> addToWatchlist(@AuthenticationPrincipal Jwt jwt, Long tmdbId) {
        Objects.requireNonNull(tmdbId, "tmdbId ne peut pas être null");
        String userId = jwt.getClaimAsString("sub");
        watchlistService.addToWatchlist(userId, tmdbId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> removeFromWatchlist(@AuthenticationPrincipal Jwt jwt, Long tmdbId) {
        Objects.requireNonNull(tmdbId, "tmdbId ne peut pas être null");
        String userId = jwt.getClaimAsString("sub");
        watchlistService.removeFromWatchlist(userId, tmdbId);
        return ResponseEntity.noContent().build();
    }
}
