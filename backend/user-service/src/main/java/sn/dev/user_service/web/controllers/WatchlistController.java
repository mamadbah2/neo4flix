package sn.dev.user_service.web.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import sn.dev.user_service.web.dto.responses.MovieResponse;

@RequestMapping("/api/users/watchlist")
public interface WatchlistController {

    @GetMapping
    ResponseEntity<List<MovieResponse>> getWatchlist(@AuthenticationPrincipal Jwt jwt);

    @PostMapping("/{movieId}")
    ResponseEntity<Void> addToWatchlist(@AuthenticationPrincipal Jwt jwt, @PathVariable String movieId);

    @DeleteMapping("/{movieId}")
    ResponseEntity<Void> removeFromWatchlist(@AuthenticationPrincipal Jwt jwt, @PathVariable String movieId);
}
