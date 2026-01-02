package sn.dev.user_service.web.controllers.implementation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import sn.dev.user_service.services.WatchlistService;
import sn.dev.user_service.web.controllers.WatchlistController;
import sn.dev.user_service.web.dto.responses.MovieResponse;
import sn.dev.user_service.web.mappers.MovieMapper;

@RestController
public class WatchlistControllerImpl implements WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistControllerImpl(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @Override
    public ResponseEntity<List<MovieResponse>> getWatchlist(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("sub");
        var movies = watchlistService.getWatchlist(userId);
        var response = movies.stream()
                .map(MovieMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> addToWatchlist(@AuthenticationPrincipal Jwt jwt, String movieId) {
        String userId = jwt.getClaimAsString("sub");
        watchlistService.addToWatchlist(userId, movieId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> removeFromWatchlist(@AuthenticationPrincipal Jwt jwt, String movieId) {
        String userId = jwt.getClaimAsString("sub");
        watchlistService.removeFromWatchlist(userId, movieId);
        return ResponseEntity.noContent().build();
    }
}
