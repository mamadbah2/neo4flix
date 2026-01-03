package sn.dev.movie_service.web.controllers.implementation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sn.dev.movie_service.services.MovieService;
import sn.dev.movie_service.web.controllers.InternalMovieController;
import sn.dev.movie_service.web.dto.responses.SyncResponse;

/**
 * Implémentation du contrôleur interne.
 */
@RestController
@RequiredArgsConstructor
public class InternalMovieControllerImpl implements InternalMovieController {

    private final MovieService movieService;

    @Override
    public ResponseEntity<SyncResponse> syncMovie(Long tmdbId) {
        SyncResponse response = movieService.syncMovie(tmdbId);
        return ResponseEntity.ok(response);
    }
}
